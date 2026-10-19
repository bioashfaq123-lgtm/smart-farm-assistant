# Project overview

## Goal
Remote-control soil moisture sensing and a pump from a phone, plus farmer tools, as a live demo at ADSAUF-2047 (Theme 3: IoT, Sensors and Smart Farm Automation; also fits the Live Demonstrations list: smart irrigation, soil moisture sensors, mobile applications, AI-based crop disease diagnosis).

## Why not Blynk
Blynk is a fixed widget dashboard: no custom screens, photo upload or price table. A custom web app does everything in one place.

## Architecture
```
Soil sensor -> ESP32 (WiFi) <-> Firebase Realtime Database <-> Web app (Vercel)
                                                   |-> /api/diagnose -> Gemini (photo diagnosis)
                                                   |-> /api/mandi    -> data.gov.in (prices)
                         Web app -> Open-Meteo (weather, no key)
```
Database fields under `/field`: moisture, pump (command), pump_state, mode (manual/auto), threshold, rain_skip, updated.

## Features and how each is built
| Feature | How | Risk |
|---|---|---|
| Weather and rain forecast | Open-Meteo API (free, no key). "Skip irrigation if rain likely" also sets `rain_skip` for the ESP32 | Low |
| Mandi prices | data.gov.in Agmarknet API via `api/mandi.js`; sample table is the fallback | High (API can be unreliable; verify resource id) |
| Fertilizer dosage | Rule table of N-P-K per crop, converted to urea/DAP/MOP | Medium: verify doses with PJTAU package of practices |
| Pest and disease diagnosis | Photo sent to Gemini through `api/diagnose.js` | Medium: AI suggestion only |
| Registration | Farmer profile saved in browser (localStorage); pre-fills crop and area | Low |
| Field control | App writes pump/mode to Firebase; ESP32 reads and acts | Medium |

## Extras for the conference
Telugu interface, graphs of moisture, WhatsApp/push alerts, offline demo mode (saved data if venue WiFi is poor).

## Kit limits
- Exposed-probe soil sensor corrodes in weeks: fine for demos; use a capacitive sensor for longer use.
- Mini pump is for pots or a small bed only; an orchard needs a proper pump with a solenoid valve.
- Field use needs internet (hotspot or GSM) and solar power.
