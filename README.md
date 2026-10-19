# Smart Farm Assistant: ESP32 irrigation + farmer web app

Demo for the **National Conference ADSAUF-2047** (PJTAU, Rajendranagar, Hyderabad, 2-4 Dec 2026).
Owner: Md Ashfaq. Hardware: SP ELECTRON DIY Smart Plant Watering Kit + ESP32.

## What is in this folder
| Path | What it is |
|---|---|
| `index.html`, `config.js` | The web app: Register, Weather, Fertilizer, Disease check, Mandi prices, Field control |
| `api/diagnose.js` | Server function for photo diagnosis using Google Gemini (no Claude needed) |
| `api/mandi.js` | Server function for live mandi prices (data.gov.in) |
| `firmware/esp32_soil_pump/` | ESP32 Arduino code (moisture upload + pump control) |
| `docs/` | Plan, roadmap, budget, hardware and conference notes |
| `ANTIGRAVITY_PROMPTS.md` | Prompts to paste into Antigravity, step by step |
| `spreadsheets/` | The three Excel files made earlier |

## Quick start
1. Open this folder in Antigravity (File > Open Folder) and paste the first prompt from `ANTIGRAVITY_PROMPTS.md`.
2. Test the app locally: `npx vercel dev` (or open `index.html` in a browser; weather, fertilizer and registration work without any key).
3. Deploy: push to GitHub, import in vercel.com, add the environment variables from `.env.example`.
4. When the ESP32 arrives (26 Oct), follow `docs/04-hardware-and-firmware.md`.

## Status (19 Oct 2026)
Done: web app first version (Register, Weather, Fertilizer, Disease check, Mandi, Field tab), ESP32 code (untested on hardware).
To do: weeks 1-2 hardware tests, real mandi key, verify fertilizer doses, Telugu UI, offline mode, rehearsal.
