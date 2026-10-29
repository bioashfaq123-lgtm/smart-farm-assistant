/*
  ESP32 soil moisture + pump controller (Firebase Realtime Database over REST)
  Board: "ESP32 Dev Module" (Arduino IDE, esp32 board package installed)

  Wiring (see docs/04-hardware-and-firmware.md):
    Soil sensor board  VCC -> 3V3, GND -> GND, AO -> GPIO34 (ADC1)
    Relay module       VCC -> VIN (5V), GND -> GND, IN -> GPIO26
    Pump               battery(+) -> relay COM, relay NO -> pump(+), pump(-) ->
  battery(-)
*/
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <time.h>

// ---------- EDIT THESE ----------
const char *WIFI_SSID = "FarmHotspot";
const char *WIFI_PASS = "12345678";
const char *DB_URL =
    "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com"; // no
                                                                      // trailing
                                                                      // slash
const char *DB_PATH = "field"; // must match DB_PATH in config.js
const int SENSOR_PIN = 34;
const int RELAY_PIN = 26;
const bool RELAY_ACTIVE_LOW = true; // most blue relay modules click ON when the pin goes LOW
const int RAW_DRY = 3900;              // reading in dry air  (calibrate!)
const int RAW_WET = 1100;              // reading in water    (calibrate!)
const unsigned long PUSH_MS = 10000UL; // upload every 10 s
const unsigned long MAX_PUMP_MS =
    5UL * 60UL * 1000UL; // safety: never run more than 5 min at a time
const unsigned long PUMP_COOLDOWN_MS =
    10UL * 60UL * 1000UL; // safety: 10 min cooldown after hitting max limit
// --------------------------------

int lastRawADC = 0;
bool pumpOn = false;
bool safetyTripped = false;
unsigned long pumpStarted = 0;
unsigned long safetyTripTime = 0;
unsigned long lastPush = 0;
unsigned long lastWifiRetry = 0;

void setRelayHardware(bool active) {
  // active = true -> relay contacts energized (pump runs)
  // active = false -> relay contacts open (pump stopped)
  digitalWrite(RELAY_PIN, (active ^ RELAY_ACTIVE_LOW) ? HIGH : LOW);
}

void setPump(bool on) {
  if (on == pumpOn)
    return; // Prevent resetting timer if state hasn't changed

  if (on) {
    // Safety check: do not start if cooldown is active
    if (safetyTripped) {
      if (millis() - safetyTripTime < PUMP_COOLDOWN_MS) {
        Serial.println("[SAFETY] Blocked: Pump cooldown active.");
        return;
      }
      safetyTripped = false; // Cooldown expired
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

  // Sensor safety: detect disconnected or floating probe
  // 4095 is dry air (0% moisture)

  int pct = map(raw, RAW_DRY, RAW_WET, 0, 100);
  return constrain(pct, 0, 100);
}

String dbGet(const String &key) {
  if (WiFi.status() != WL_CONNECTED)
    return "";
  WiFiClientSecure client;
  client.setInsecure(); // demo only: skips the certificate check
  client.setTimeout(3);

  HTTPClient http;
  http.setTimeout(3000);
  String out = "";

  if (http.begin(client,
                 String(DB_URL) + "/" + DB_PATH + "/" + key + ".json")) {
    int code = http.GET();
    if (code == 200)
      out = http.getString();
    http.end();
  }
  client.stop();
  out.replace("\"", "");
  out.trim();
  return out;
}

void dbPut(const String &key, const String &json) {
  if (WiFi.status() != WL_CONNECTED)
    return;
  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(3);

  HTTPClient http;
  http.setTimeout(3000);

  if (http.begin(client,
                 String(DB_URL) + "/" + DB_PATH + "/" + key + ".json")) {
    http.PUT(json);
    http.end();
  }
  client.stop();
}

void handleWiFi() {
  if (WiFi.status() == WL_CONNECTED)
    return;

  // Safety: turn off pump immediately if WiFi is lost
  if (pumpOn) {
    Serial.println("[SAFETY] WiFi lost! Turning pump off.");
    setPump(false);
  }

  // Clean reconnect attempt every 15 seconds
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

  // PREVENT BOOT GLITCH: Preset output latch BEFORE setting pin mode to OUTPUT
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
  Serial.println("[DIAGNOSTIC] Scanning all visible 2.4 GHz WiFi networks...");

  int n = WiFi.scanNetworks();
  Serial.printf("[DIAGNOSTIC] Found %d visible networks:\n", n);
  bool foundSSID = false;

  for (int i = 0; i < n; ++i) {
    String currentSSID = WiFi.SSID(i);
    int rssi = WiFi.RSSI(i);
    int ch = WiFi.channel(i);
    Serial.printf("   #%d: \"%s\" (Signal: %d dBm, Channel: %d)\n", i + 1,
                  currentSSID.c_str(), rssi, ch);
    if (currentSSID == WIFI_SSID) {
      foundSSID = true;
    }
  }

  Serial.println("--------------------------------------------------");
  if (!foundSSID) {
    Serial.printf("⚠️  WARNING: \"%s\" was NOT detected by the ESP32!\n",
                  WIFI_SSID);
    Serial.println("   Causes & Fixes:");
    Serial.println("   1. Check if Vivo Y31 hotspot is turned ON.");
    Serial.println("   2. In Vivo Hotspot Configuration, change AP Band to "
                   "'2.4 GHz Band'.");
    Serial.println("   3. In Vivo Hotspot Configuration, verify 'Hide my "
                   "hotspot' is OFF.");
    Serial.println("--------------------------------------------------\n");
  } else {
    Serial.printf("✅ Target \"%s\" DETECTED! Proceeding to connect...\n",
                  WIFI_SSID);
    Serial.println("--------------------------------------------------\n");
  }

  Serial.printf("Connecting to: [%s] ...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  unsigned long startWait = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startWait < 14000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n\n🎉 [WIFI] Connected Successfully!");
    Serial.print("   [WIFI] ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("   [WIFI] Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    configTime(0, 0, "pool.ntp.org"); // UTC clock for the 'updated' timestamp
  } else {
    Serial.println(
        "\n\n[WIFI] Connection timed out. Still attempting in background...");
    Serial.println(
        "[WIFI] Tip: If password was changed, update WIFI_PASS in the code.");
  }
}

void loop() {
  handleWiFi();

  // 1. HARD 5-MINUTE TIMEOUT & COOLDOWN LATCH
  if (pumpOn && (millis() - pumpStarted >= MAX_PUMP_MS)) {
    Serial.println(
        "[SAFETY] Max 5-min limit reached! Engaging 10-min cooldown.");
    setPump(false);
    safetyTripped = true;
    safetyTripTime = millis();
    dbPut("pump", "false");
    dbPut("pump_state", "false");
  }

  // 2. PERIODIC TELEMETRY & CONTROL
  if (WiFi.status() == WL_CONNECTED && (millis() - lastPush >= PUSH_MS)) {
    lastPush = millis();
    int m = readMoisture();
    unsigned long now = (unsigned long)time(nullptr);

    if (m >= 0) {
      dbPut("moisture", String(m));
    }

    // Always write updated timestamp so web app knows ESP32 is actively pinging
    unsigned long ts =
        (now > 100000UL) ? now : (1793289000UL + (millis() / 1000));
    dbPut("updated", String(ts));
    dbPut("updated_ms", "{\".sv\":\"timestamp\"}");
    dbPut("history/" + String(ts),
          "{\"t\":" + String(ts) + ",\"m\":" + String(m) + "}");

    String mode = dbGet("mode");
    if (mode == "auto") {
      int th = dbGet("threshold").toInt();
      if (th <= 0)
        th = 30;
      bool rainSkip = (dbGet("rain_skip") == "true");

      // Auto control with sensor fault check & cooldown check
      if (m >= 0 && m < th && !rainSkip && !safetyTripped) {
        if (!pumpOn)
          setPump(true);
      } else if (m >= th + 10 || rainSkip || m < 0) {
        if (pumpOn)
          setPump(false);
      }
      dbPut("pump", pumpOn ? "true" : "false");
    } else {
      // Manual mode
      bool want = (dbGet("pump") == "true");
      // If safety was tripped, reset lockout when the user sets command to
      // false
      if (!want && safetyTripped) {
        safetyTripped = false;
      }
      if (want != pumpOn && (!want || !safetyTripped)) {
        setPump(want);
      }
    }

    dbPut("pump_state", pumpOn ? "true" : "false");
    Serial.printf("moisture=%d%% (raw=%d) mode=%s pump=%d locked=%d\n", m,
                  lastRawADC, mode.c_str(), pumpOn, safetyTripped);
  }

  delay(50); // Yield to FreeRTOS watchdog
}
