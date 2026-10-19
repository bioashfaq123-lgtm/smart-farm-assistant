/*
  ESP32 soil moisture + pump controller (Firebase Realtime Database over REST)
  Board: "ESP32 Dev Module" (Arduino IDE, esp32 board package installed)

  Wiring (see docs/04-hardware-and-firmware.md):
    Soil sensor board  VCC -> 3V3, GND -> GND, AO -> GPIO34 (ADC1)
    Relay module       VCC -> VIN (5V), GND -> GND, IN -> GPIO26
    Pump               battery(+) -> relay COM, relay NO -> pump(+), pump(-) -> battery(-)
*/
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <time.h>

// ---------- EDIT THESE ----------
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* DB_URL    = "https://YOUR-PROJECT-default-rtdb.firebaseio.com"; // no trailing slash
const char* DB_PATH   = "field";   // must match DB_PATH in config.js
const int   SENSOR_PIN = 34;
const int   RELAY_PIN  = 26;
const bool  RELAY_ACTIVE_LOW = true;   // most blue relay modules click ON when the pin goes LOW
const int   RAW_DRY = 3200;            // reading in dry air  (calibrate!)
const int   RAW_WET = 1400;            // reading in water    (calibrate!)
const unsigned long PUSH_MS = 10000;   // upload every 10 s
const unsigned long MAX_PUMP_MS = 5UL * 60UL * 1000UL; // safety: never run more than 5 min at a time
// --------------------------------

bool pumpOn = false;
unsigned long pumpStarted = 0, lastPush = 0;

void setPump(bool on) {
  pumpOn = on;
  digitalWrite(RELAY_PIN, (on ^ RELAY_ACTIVE_LOW) ? HIGH : LOW);
  if (on) pumpStarted = millis();
}

int readMoisture() {
  long sum = 0;
  for (int i = 0; i < 16; i++) { sum += analogRead(SENSOR_PIN); delay(5); }
  int raw = sum / 16;
  int pct = map(raw, RAW_DRY, RAW_WET, 0, 100);
  return constrain(pct, 0, 100);
}

String dbGet(const String& key) {
  WiFiClientSecure c; c.setInsecure();   // demo only: skips the certificate check
  HTTPClient http; String out = "";
  if (http.begin(c, String(DB_URL) + "/" + DB_PATH + "/" + key + ".json")) {
    if (http.GET() == 200) out = http.getString();
    http.end();
  }
  out.replace("\"", ""); out.trim();
  return out;
}

void dbPut(const String& key, const String& json) {
  WiFiClientSecure c; c.setInsecure();
  HTTPClient http;
  if (http.begin(c, String(DB_URL) + "/" + DB_PATH + "/" + key + ".json")) {
    http.PUT(json); http.end();
  }
}

void connectWifi() {
  WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("WiFi");
  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t < 20000) { delay(500); Serial.print("."); }
  Serial.println(WiFi.status() == WL_CONNECTED ? " connected" : " FAILED");
  if (WiFi.status() == WL_CONNECTED) configTime(0, 0, "pool.ntp.org");   // UTC clock for the 'updated' timestamp
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  setPump(false);
  analogReadResolution(12);
  connectWifi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) { setPump(false); connectWifi(); return; }
  if (pumpOn && millis() - pumpStarted > MAX_PUMP_MS) { setPump(false); dbPut("pump", "false"); }

  if (millis() - lastPush >= PUSH_MS) {
    lastPush = millis();
    int m = readMoisture();
    unsigned long now = (unsigned long)time(nullptr);
    dbPut("moisture", String(m));
    dbPut("updated", String(now));
    if (now > 100000UL) {
      dbPut("history/" + String(now), "{\"t\":" + String(now) + ",\"m\":" + String(m) + "}");
    }
    String mode = dbGet("mode");
    if (mode == "auto") {
      int th = dbGet("threshold").toInt(); if (th <= 0) th = 30;
      bool rainSkip = dbGet("rain_skip") == "true";
      if (m < th && !rainSkip) { if (!pumpOn) setPump(true); }
      else if (m >= th + 10 || rainSkip) { if (pumpOn) setPump(false); }
      dbPut("pump", pumpOn ? "true" : "false");
    } else {
      bool want = dbGet("pump") == "true";
      if (want != pumpOn) setPump(want);
    }
    dbPut("pump_state", pumpOn ? "true" : "false");
    Serial.printf("moisture=%d%% mode=%s pump=%d\n", m, mode.c_str(), pumpOn);
  }
  delay(200);
}
