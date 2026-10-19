# Hardware and firmware

## Which ESP32 to order
Order **2 x 30-pin ESP32 dev boards** (e.g. the Robocraze ESP32 WiFi Bluetooth Dual-Core board) plus a data USB cable. Expansion boards (TekBud, ROBOMALLS) are empty bases with no ESP32 on them: optional, TekBud is the safer one (more reviews). Skip sponsored ATtiny85 and ESP32-C3 Mini items.
If you buy an expansion board: set the voltage jumper to 3.3V for the sensor rows; take the relay's 5V from the separate 5V pin.

## Is the kit enough?
Yes for a desk/conference demo. Soil probe + blue comparator board, relay, pump, battery holder, tubing and jumper wires all work with an ESP32. The only missing part is the ESP32.

## Wiring
| From | To |
|---|---|
| Sensor board VCC | ESP32 **3V3** (not 5V) |
| Sensor board GND | GND |
| Sensor board **AO** | **GPIO34** (ADC1; ADC2 pins stop working with WiFi) |
| Relay VCC | VIN / 5V |
| Relay GND | GND |
| Relay IN | GPIO26 |
| Pump (+) | relay NO; battery (+) to relay COM; pump (-) to battery (-) |
Never power the pump from an ESP32 pin. Many relay boards are active-low: if it behaves backwards, flip `RELAY_ACTIVE_LOW`.

## Calibrate
1. Open Serial Monitor (115200) with a sketch that prints `analogRead(34)`.
2. Note the value in dry air = `RAW_DRY`, and with the probe in water = `RAW_WET`.
3. Put both numbers in `esp32_soil_pump.ino`.

## Firebase setup (free)
1. console.firebase.google.com > Add project > Build > **Realtime Database** > Create (choose a region).
2. Copy the database URL (`https://...firebaseio.com`) into `config.js` (`DB_URL`) and into the `.ino` (`DB_URL`).
3. Pick a hard-to-guess `DB_PATH` (e.g. `field_x7k2q9`) in both places.
4. Rules for the demo (anyone with the path can write, so keep the path secret and tighten after the conference):
```
{ "rules": { "field_x7k2q9": { ".read": true, ".write": true } } }
```
5. Arduino IDE: install the ESP32 board package, choose "ESP32 Dev Module", edit WiFi and URL at the top, upload.
6. In the app, open Field control: you should see moisture update every ~10 s and the pump buttons work.

## Safety built into the code
The pump auto-stops after 5 minutes (`MAX_PUMP_MS`) and turns off if WiFi drops. The code uses `setInsecure()` (no certificate check): fine for a demo, not for production. The firmware is untested on real hardware, so bench-test with the pump disconnected first.
