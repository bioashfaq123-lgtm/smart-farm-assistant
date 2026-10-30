/*
  Smart Farm Assistant — ESP32 Soil Moisture & High-Speed Irrigation Controller
  Platform: ESP32 Dev Module (Arduino IDE)
  
  Optimized Architecture:
  1. Fast 1-Second Cloud Command Polling: Manual pump ON/OFF executes in <= 1s.
  2. Single-Call Atomic REST Sync: Replaced 10 blocking HTTP calls with 1 fast GET / PATCH.
  3. Trimmed-Mean ADC Filtering: Eliminates Wi-Fi RF noise spikes on ADC1 GPIO 34.
  4. Modem Sleep Disabled (WiFi.setSleep(false)): Lowers network roundtrip to <15ms.
  5. Fail-Safe Auto Irrigation & 5-Min Hardware Safety Timeout: Runs locally even if Wi-Fi drops.

  Wiring Connections:
    - Capacitive Soil Sensor VCC -> ESP32 GPIO 27 (Powers sensor with stable 3.3V)
    - Capacitive Soil Sensor GND -> ESP32 GND
    - Capacitive Soil Sensor AOUT-> ESP32 GPIO 34 (ADC1 Channel 6)
    - 5V Relay Module VCC       -> ESP32 VIN (5V)
    - 5V Relay Module GND       -> ESP32 GND
    - 5V Relay Module IN        -> ESP32 GPIO 26
    - Pump Circuit              -> Battery(+) to Relay COM, Relay NO to Pump(+), Pump(-) to Battery(-)
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <time.h>

// ==================== CONFIGURATION ====================
const char *WIFI_SSID = "FarmHotspot";
const char *WIFI_PASS = "12345678";
const char *DB_URL    = "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com";
const char *DB_PATH   = "field";

// Hardware Pins
const int SENSOR_PIN     = 34;    // Analog soil moisture probe (ADC1 - safe with Wi-Fi)
const int SENSOR_VCC_PIN = 27;    // Direct 3.3V sensor power pin
const int RELAY_PIN      = 26;    // Active-Low Relay trigger
const bool RELAY_ACTIVE_LOW = true;

// Sensor ADC Calibration Constants
const int RAW_DRY = 3900;         // Reading in dry air  (~3900 = 0% moisture)
const int RAW_WET = 1100;         // Reading in water    (~1100 = 100% moisture)

// Loop Timers (Decoupled for sub-second responsiveness)
const unsigned long POLL_COMMANDS_MS   = 1000UL;              // Check manual pump commands every 1.0s
const unsigned long PUSH_TELEMETRY_MS  = 6000UL;              // Push telemetry every 6s
const unsigned long PUSH_HISTORY_MS    = 60000UL;             // Record history entry every 60s
const unsigned long FAST_CONTROL_MS    = 200UL;               // Fast local auto-irrigation check (0.2s)
const unsigned long MAX_PUMP_MS        = 5UL * 60UL * 1000UL; // Safety: 5-minute continuous run cutoff
const unsigned long PUMP_COOLDOWN_MS   = 10UL * 60UL * 1000UL;// Safety: 10-minute cooldown latch
// =======================================================

// State Tracking
int lastRawADC = 0;
float smoothedMoisture = -1.0;
bool pumpOn = false;
bool safetyTripped = false;
unsigned long pumpStarted = 0;
unsigned long safetyTripTime = 0;

unsigned long lastCommandPoll = 0;
unsigned long lastTelemetryPush = 0;
unsigned long lastHistoryPush = 0;
unsigned long lastFastControl = 0;
unsigned long lastWifiRetry = 0;

String currentMode = "auto";
int currentThreshold = 30;
bool currentRainSkip = false;

// Hardware Relay Control
void setRelayHardware(bool active) {
  // active = true  -> relay energized (contacts closed, pump runs)
  // active = false -> relay de-energized (contacts open, pump stops)
  digitalWrite(RELAY_PIN, (active ^ RELAY_ACTIVE_LOW) ? HIGH : LOW);
}

// Logical Pump Actuator with Safety Guards
void setPump(bool on) {
  if (on == pumpOn) return;

  if (on) {
    if (safetyTripped) {
      if (millis() - safetyTripTime < PUMP_COOLDOWN_MS) {
        Serial.println("[SAFETY] Blocked: 10-minute cooldown active. Wait for timeout.");
        return;
      }
      safetyTripped = false;
    }
    pumpStarted = millis();
    pumpOn = true;
    setRelayHardware(true);
    Serial.println("[PUMP] >>> ACTIVATED (Relay Closed) <<<");
  } else {
    pumpOn = false;
    setRelayHardware(false);
    Serial.println("[PUMP] --- STOPPED (Relay Opened) ---");
  }
}

// Noise-Filtered Soil Moisture Reading (Trimmed-Mean + Exponential Moving Average)
int readMoisture() {
  const int NUM_SAMPLES = 20;
  int samples[NUM_SAMPLES];

  // 1. Take 20 fast analog samples over 10 milliseconds
  for (int i = 0; i < NUM_SAMPLES; i++) {
    samples[i] = analogRead(SENSOR_PIN);
    delayMicroseconds(500);
  }

  // 2. Sort to discard top 3 and bottom 3 outliers (filters out Wi-Fi RF noise spikes)
  for (int i = 0; i < NUM_SAMPLES - 1; i++) {
    for (int j = 0; j < NUM_SAMPLES - i - 1; j++) {
      if (samples[j] > samples[j + 1]) {
        int temp = samples[j];
        samples[j] = samples[j + 1];
        samples[j + 1] = temp;
      }
    }
  }

  // 3. Average the remaining 14 middle samples
  long sum = 0;
  for (int i = 3; i < NUM_SAMPLES - 3; i++) {
    sum += samples[i];
  }
  int raw = sum / 14;
  lastRawADC = raw;

  // 4. Map to percentage based on calibration constants
  int pct = map(raw, RAW_DRY, RAW_WET, 0, 100);
  pct = constrain(pct, 0, 100);

  // 5. Exponential Moving Average (EMA) for rock-steady stability
  if (smoothedMoisture < 0) {
    smoothedMoisture = pct;
  } else {
    smoothedMoisture = (smoothedMoisture * 0.75f) + (pct * 0.25f);
  }

  return (int)round(smoothedMoisture);
}

// Lightweight JSON Field Parser (Zero external dependencies)
String getJsonField(const String &json, const String &key) {
  String searchKey = "\"" + key + "\":";
  int idx = json.indexOf(searchKey);
  if (idx == -1) return "";
  idx += searchKey.length();

  while (idx < json.length() && (json[idx] == ' ' || json[idx] == '\"')) {
    idx++;
  }

  int endIdx = idx;
  while (endIdx < json.length() && 
         json[endIdx] != ',' && 
         json[endIdx] != '}' && 
         json[endIdx] != '\"' && 
         json[endIdx] != '\r' && 
         json[endIdx] != '\n') {
    endIdx++;
  }

  String val = json.substring(idx, endIdx);
  val.trim();
  return val;
}

// Fast Atomic HTTP PATCH to Firebase
void dbPatch(const String &jsonPayload) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(2);

  HTTPClient http;
  http.setTimeout(2500);

  String url = String(DB_URL) + "/" + DB_PATH + ".json";
  if (http.begin(client, url)) {
    http.addHeader("Content-Type", "application/json");
    http.sendRequest("PATCH", jsonPayload);
    http.end();
  }
  client.stop();
}

// Fast Atomic HTTP PUT to Firebase (for sub-paths like history)
void dbPut(const String &subPath, const String &jsonPayload) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(2);

  HTTPClient http;
  http.setTimeout(2500);

  String url = String(DB_URL) + "/" + DB_PATH + "/" + subPath + ".json";
  if (http.begin(client, url)) {
    http.addHeader("Content-Type", "application/json");
    http.PUT(jsonPayload);
    http.end();
  }
  client.stop();
}

// Fast Cloud Command Polling (Fetches mode, pump, threshold, and rain_skip in 1 call)
void fetchCloudControls() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(2);

  HTTPClient http;
  http.setTimeout(2200);

  String url = String(DB_URL) + "/" + DB_PATH + ".json";
  if (http.begin(client, url)) {
    int httpCode = http.GET();
    if (httpCode == 200) {
      String payload = http.getString();

      // Extract Mode
      String modeVal = getJsonField(payload, "mode");
      if (modeVal.length() > 0 && modeVal != "null") {
        currentMode = modeVal;
      }

      // Extract Threshold
      String thVal = getJsonField(payload, "threshold");
      int thNum = thVal.toInt();
      if (thNum > 0) {
        currentThreshold = thNum;
      }

      // Extract Rain Skip
      String rainVal = getJsonField(payload, "rain_skip");
      if (rainVal.length() > 0) {
        currentRainSkip = (rainVal == "true" || rainVal == "1");
      }

      // Manual Mode Actuator Synchronization (Instant execution in <= 1s)
      if (currentMode == "manual") {
        String pumpVal = getJsonField(payload, "pump");
        bool wantPump = (pumpVal == "true" || pumpVal == "1");

        // Clear cooldown latch if user explicitly commands pump OFF
        if (!wantPump && safetyTripped) {
          safetyTripped = false;
          Serial.println("[SAFETY] Cooldown latch reset by manual OFF command.");
        }

        if (wantPump != pumpOn && (!wantPump || !safetyTripped)) {
          setPump(wantPump);
          // Confirm state back to Firebase immediately so web dashboard updates with zero delay
          dbPatch("{\"pump_state\":" + String(wantPump ? "\"true\"" : "\"false\"") + "}");
          Serial.printf("[MANUAL] Button triggered! Relay is now %s\n", wantPump ? "ON" : "OFF");
        }
      }
    }
    http.end();
  }
  client.stop();
}

// Push Live Telemetry to Firebase (1 atomic PATCH instead of 4 separate calls)
void pushTelemetry(int moisture) {
  if (WiFi.status() != WL_CONNECTED) return;

  unsigned long now = (unsigned long)time(nullptr);
  unsigned long ts = (now > 100000UL) ? now : (1793289000UL + (millis() / 1000));

  String payload = "{";
  payload += "\"moisture\":" + String(moisture) + ",";
  payload += "\"pump_state\":" + String(pumpOn ? "\"true\"" : "\"false\"") + ",";
  payload += "\"updated\":" + String(ts) + ",";
  payload += "\"updated_ms\":{\".sv\":\"timestamp\"}";
  payload += "}";

  dbPatch(payload);

  // Record historical trend point once per minute
  if (millis() - lastHistoryPush >= PUSH_HISTORY_MS) {
    lastHistoryPush = millis();
    String histPayload = "{\"t\":" + String(ts) + ",\"m\":" + String(moisture) + "}";
    dbPut("history/" + String(ts), histPayload);
  }

  Serial.printf("[TELEMETRY] Moisture: %d%% (ADC: %d) | Pump: %s | Mode: %s | RainSkip: %d | Cooldown: %d\n",
                moisture, lastRawADC, pumpOn ? "ON" : "OFF", currentMode.c_str(), 
                currentRainSkip ? 1 : 0, safetyTripped ? 1 : 0);
}

// Non-blocking Wi-Fi Health Manager
void handleWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  // If pump is running in manual mode and Wi-Fi disconnects beyond safety window, shut off
  if (pumpOn && (millis() - pumpStarted >= MAX_PUMP_MS)) {
    Serial.println("[SAFETY] WiFi unavailable & max run limit reached! Shutting pump off.");
    setPump(false);
    safetyTripped = true;
    safetyTripTime = millis();
  }

  // Non-blocking auto-reconnect trigger every 10 seconds
  if (millis() - lastWifiRetry > 10000UL) {
    lastWifiRetry = millis();
    Serial.printf("[WIFI] Reconnecting to [%s]...\n", WIFI_SSID);
    WiFi.reconnect();
  }
}

// Setup
void setup() {
  Serial.begin(115200);
  delay(300);

  // 1. Power soil sensor directly from GPIO 27 (3.3V)
  pinMode(SENSOR_VCC_PIN, OUTPUT);
  digitalWrite(SENSOR_VCC_PIN, HIGH);

  // 2. Relay Pin Setup (Guarantee pump starts OFF)
  setRelayHardware(false);
  pinMode(RELAY_PIN, OUTPUT);
  setRelayHardware(false);

  // 3. Configure ADC1 (12-bit resolution: 0 - 4095)
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  // 4. Ultra-Responsive Wi-Fi Settings
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  WiFi.setSleep(false); // CRITICAL: Disables 802.11 modem sleep for <15ms latency!

  Serial.println("\n=======================================================");
  Serial.println("  Smart Farm Assistant — ESP32 High-Speed Controller");
  Serial.println("=======================================================");
  Serial.printf("Connecting to Wi-Fi: [%s] ...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  // Fast connection check with 8-second initial timeout
  unsigned long startWait = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startWait < 8000) {
    delay(250);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected Successfully!");
    Serial.printf("   IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("   Signal RSSI: %d dBm\n", WiFi.RSSI());
    configTime(0, 0, "pool.ntp.org", "time.google.com");
  } else {
    Serial.println("\n[WIFI] Connecting in background. Local auto-irrigation active.");
  }
}

// Main Execution Loop
void loop() {
  handleWiFi();

  // 1. HARD 5-MINUTE MOTOR SAFETY TIMEOUT
  if (pumpOn && (millis() - pumpStarted >= MAX_PUMP_MS)) {
    Serial.println("[SAFETY] Max 5-min limit reached! Engaging 10-min cooldown.");
    setPump(false);
    safetyTripped = true;
    safetyTripTime = millis();
    dbPatch("{\"pump\":\"false\",\"pump_state\":\"false\"}");
  }

  // 2. FAST LOCAL CONTROL LOOP (Every 200ms)
  int m = readMoisture();
  if (millis() - lastFastControl >= FAST_CONTROL_MS) {
    lastFastControl = millis();

    // In Auto mode: Reacts to soil moisture changes in 0.2s without waiting for cloud
    if (currentMode == "auto" && !safetyTripped) {
      if (m >= 0 && m < currentThreshold && !currentRainSkip) {
        if (!pumpOn) {
          setPump(true);
          dbPatch("{\"pump_state\":\"true\"}");
        }
      } else if (m >= currentThreshold + 10 || currentRainSkip || m < 0) {
        if (pumpOn) {
          setPump(false);
          dbPatch("{\"pump_state\":\"false\"}");
        }
      }
    }
  }

  // 3. FAST CLOUD COMMAND CHECK (Every 1.0s for instantaneous manual response)
  if (WiFi.status() == WL_CONNECTED && (millis() - lastCommandPoll >= POLL_COMMANDS_MS)) {
    lastCommandPoll = millis();
    fetchCloudControls();
  }

  // 4. CLOUD TELEMETRY PUSH (Every 6.0s in 1 atomic PATCH)
  if (WiFi.status() == WL_CONNECTED && (millis() - lastTelemetryPush >= PUSH_TELEMETRY_MS)) {
    lastTelemetryPush = millis();
    pushTelemetry(m);
  }

  delay(10);
}
