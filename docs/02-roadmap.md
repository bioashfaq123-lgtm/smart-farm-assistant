# Roadmap: 19 Oct to 29 Nov 2026 (conference 2-4 Dec)

Tick `[x]` as you finish. Weeks 3-5 software has a first version already; remaining work is shown.

## Week 1 (19-25 Oct): Setup and bench test
- [ ] Call Dr. B. Balaji Naik about demo/exhibition space and whether a live demo or poster fits
- [ ] Order 2 ESP32 boards (30-pin), capacitive soil sensor, 12V pump + solenoid valve, power adapter (boards arrive 26 Oct)
- [ ] Wire ESP32 to the kit's sensor board and relay on a breadboard
- [ ] Upload a test sketch: print moisture, click relay
- [ ] Calibrate the sensor: dry-air and in-water readings (set RAW_DRY / RAW_WET)

## Week 2 (26 Oct-1 Nov): Cloud link
- [ ] Create Firebase project + Realtime Database
- [ ] Flash `esp32_soil_pump.ino` with your WiFi and database URL
- [ ] Change `pump` in the Firebase console and confirm the relay switches

## Week 3 (2-8 Nov): App core and weather
- [x] Web app with registration, weather (first version)
- [ ] Moisture history graph (store readings under `/history`)
- [ ] Auto mode tested end to end with rain forecast
- [ ] Deploy on Vercel and test on mobile data

## Week 4 (9-15 Nov): Fertilizer calculator and registration
- [x] Fertilizer calculator (first version)
- [ ] Verify the dose table against PJTAU/ICAR package of practices for your crops
- [ ] Register for the conference via the Google form **before 15 Nov**: https://forms.gle/ZVF6oJpEosAShGRZ6 (Students Rs. 1,000; others Rs. 3,000)

## Week 5 (16-22 Nov): Disease diagnosis and mandi prices
- [x] Photo diagnosis function (needs GEMINI_API_KEY)
- [ ] Test with 20-30 real leaf photos
- [ ] Get data.gov.in key, test `api/mandi.js`, confirm commodity names
- [ ] Keep a saved copy of last good prices

## Week 6 (23-29 Nov): Polish and rehearse
- [ ] Telugu interface and offline demo mode
- [ ] Demo bed or pots with pump, tubing, sealed box
- [ ] Test continuously for 2-3 days
- [ ] Poster/banner, 3-minute demo script, backup video

## 30 Nov-1 Dec: Pack and travel
Spare ESP32, cables, power strip, phone hotspot, printed QR code of the app link.
