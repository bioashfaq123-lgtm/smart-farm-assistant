/*
  ESP32 soil moisture + pump controller (Firebase Realtime Database over REST)
  Board: "ESP32 Dev Module" (Arduino IDE, esp32 board package installed)

  Wiring:
    Soil sensor board  VCC -> 3V3, GND -> GND, AO -> GPIO34 (ADC1)
    Relay module       VCC -> VIN (5V), GND -> GND, IN -> GPIO26
    Pump               battery(+) -> relay COM, relay NO -> pump(+), pump(-) -> battery(-)
*/
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <time.h>

// ---------- EDIT THESE ----------
const char *WIFI_SSID = "FarmHotspot";
const char *WIFI_PASS = "12345678";
const char *DB_URL = "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com";
const char *DB_PATH = "field";
const int SENSOR_PIN = 34;
const int RELAY_PIN = 26;
const bool RELAY_ACTIVE_LOW = true;    // Set to true if relay clicks ON on LOW (standard blue modules)
const int RAW_DRY = 3900;             // reading in dry air  (~4000 = 0% moisture)
const int RAW_WET = 1100;             // reading in water    (~1055 = 100% moisture)
const unsigned long PUSH_MS = 8000UL; // upload to Firebase every 8s
const unsigned long MAX_PUMP_MS = 5UL * 60UL * 1000UL;      // safety: 5 min max
const unsigned long PUMP_COOLDOWN_MS = 10UL * 60UL * 1000UL; // safety: 10 min cooldown
// --------------------------------

int lastRawADC = 0;
bool pumpOn = false;
bool safetyTripped = false;
unsigned long pumpStarted = 0;
unsigned long safetyTripTime = 0;
unsigned long lastPush = 0;
unsigned long lastFastControl = 0;
unsigned long lastWifiRetry = 0;

String currentMode = "auto";
int currentThreshold = 30;
bool currentRainSkip = false;

void setRelayHardware(bool active) {
  // active = true  -> relay energized (contacts closed, pump runs)
  // active = false -> relay de-energized (contacts open, pump stopped)
  digitalWrite(RELAY_PIN, (active ^ RELAY_ACTIVE_LOW) ? HIGH : LOW);
}

void setPump(bool on) {
  if (on == pumpOn) return;

  if (on) {
    if (safetyTripped) {
      if (millis() - safetyTripTime < PUMP_COOLDOWN_MS) {
        Serial.println("[SAFETY] Blocked: Pump cooldown active.");
        return;
      }
      safetyTripped = false;
    }
    pumpStarted = millis();
    pumpOn = true;
    setRelayHardware(true);
    Serial.println("[PUMP] Turned ON");
  } else {
    pumpOn = false;
    setRelayHardware(false);
    Serial.println("[PUMP] Turned OFF");
  }
}

int readMoisture() {
  long sum = 0;
  for (int i = 0; i < 16; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(2);
  }
  int raw = sum / 16;
  lastRawADC = raw;

  int pct = map(raw, RAW_DRY, RAW_WET, 0, 100);
  return constrain(pct, 0, 100);
}

String dbGet(const String &key) {
  if (WiFi.status() != WL_CONNECTED) return "";
  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(3);

  HTTPClient http;
  http.setTimeout(3000);
  String out = "";

  if (http.begin(client, String(DB_URL) + "/" + DB_PATH + "/" + key + ".json")) {
    int code = http.GET();
    if (code == 200) out = http.getString();
    http.end();
  }
  client.stop();
  out.replace("\"", "");
  out.trim();
  return out;
}

void dbPut(const String &key, const String &json) {
  if (WiFi.status() != WL_CONNECTED) return;
  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(3);

  HTTPClient http;
  http.setTimeout(3000);

  if (http.begin(client, String(DB_URL) + "/" + DB_PATH + "/" + key + ".json")) {
    http.PUT(json);
    http.end();
  }
  client.stop();
}

void handleWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  if (pumpOn) {
    Serial.println("[SAFETY] WiFi lost! Turning pump off.");
    setPump(false);
  }

  if (millis() - lastWifiRetry > 15000UL) {
    lastWifiRetry = millis();
    Serial.printf("[WIFI] Reconnecting to [%s]...\n", WIFI_SSID);
    WiFi.disconnect();
    delay(100);
    WiFi.begin(WIFI_SSID, WIFI_PASS);
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);

  // Preset output latch BEFORE setting pin mode to OUTPUT to prevent power-on glitch
  setRelayHardware(false);
  pinMode(RELAY_PIN, OUTPUT);
  setRelayHardware(false);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  Serial.println("\n==================================================");
  Serial.println("  Smart Farm ESP32 Diagnostics & Starting");
  Serial.println("==================================================");
  Serial.printf("Connecting to: [%s] ...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  unsigned long startWait = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startWait < 12000) {
    delay(400);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n\n[WIFI] Connected Successfully!");
    Serial.print("   IP: ");
    Serial.println(WiFi.localIP());
    configTime(0, 0, "pool.ntp.org");
  } else {
    Serial.println("\n\n[WIFI] Connecting in background...");
  }
}

void loop() {
  handleWiFi();

  // 1. HARD 5-MINUTE SAFETY TIMEOUT
  if (pumpOn && (millis() - pumpStarted >= MAX_PUMP_MS)) {
    Serial.println("[SAFETY] Max 5-min limit reached! Engaging 10-min cooldown.");
    setPump(false);
    safetyTripped = true;
    safetyTripTime = millis();
    dbPut("pump", "false");
    dbPut("pump_state", "false");
  }

  // 2. FAST LOCAL CONTROL LOOP (Every 250ms for INSTANT physical reaction!)
  int m = readMoisture();
  if (millis() - lastFastControl >= 250UL) {
    lastFastControl = millis();

    // In auto mode, react immediately to water dipping and removal
    if (currentMode != "manual" && !safetyTripped) {
      if (m >= 0 && m < currentThreshold && !currentRainSkip) {
        if (!pumpOn) {
          setPump(true);
        }
      } else if (m >= currentThreshold + 10 || currentRainSkip || m < 0) {
        if (pumpOn) {
          setPump(false);
        }
      }
    }
  }

  // 3. CLOUD TELEMETRY & SETTINGS SYNC (Every 8 Seconds)
  if (WiFi.status() == WL_CONNECTED && (millis() - lastPush >= PUSH_MS)) {
    lastPush = millis();
    unsigned long now = (unsigned long)time(nullptr);

    dbPut("moisture", String(m));
    unsigned long ts = (now > 100000UL) ? now : (1793289000UL + (millis() / 1000));
    dbPut("updated", String(ts));
    dbPut("updated_ms", "{\".sv\":\"timestamp\"}");
    dbPut("history/" + String(ts), "{\"t\":" + String(ts) + ",\"m\":" + String(m) + "}");

    String modeDb = dbGet("mode");
    if (modeDb.length() > 0 && modeDb != "null") {
      currentMode = modeDb;
    }
    int thDb = dbGet("threshold").toInt();
    if (thDb > 0) {
      currentThreshold = thDb;
    }
    currentRainSkip = (dbGet("rain_skip") == "true");

    if (currentMode == "manual") {
      bool want = (dbGet("pump") == "true");
      if (!want && safetyTripped) {
        safetyTripped = false;
      }
      if (want != pumpOn && (!want || !safetyTripped)) {
        setPump(want);
      }
    }

    dbPut("pump", pumpOn ? "true" : "false");
    dbPut("pump_state", pumpOn ? "true" : "false");
    Serial.printf("moisture=%d%% (raw=%d) mode=%s pump=%d locked=%d\n", m,
                  lastRawADC, currentMode.c_str(), pumpOn, safetyTripped);
  }

  delay(20);
}
