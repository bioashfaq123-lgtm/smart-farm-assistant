# Prompts for Antigravity

Open this folder in Antigravity. Paste the prompts one at a time. Keep Planning mode on for steps 2-6 and review the plan before it edits files. Use a Gemini or other model available on your plan. Run no hardware code until you have checked it.

## 1. Orient the agent
"Read README.md and everything in docs/. This is a Vercel-hosted static web app (index.html, config.js, api/*.js) plus ESP32 firmware. Summarise the project and list what is done and what is left. Do not change any files yet."

## 2. Run and test locally
"Help me run this project locally with `npx vercel dev`. Create .env.local from .env.example (leave keys blank, I will fill them). Open the app in the browser and check every tab (Register, Weather, Fertilizer, Disease check, Mandi prices, Field control) for errors. Report problems and fix only real bugs."

## 3. Verify the fertilizer table
"In index.html the CROPS table holds indicative N, P2O5, K2O kg/ha values. Search for the current Telangana/PJTAU package of practices for paddy, maize, cotton, sesame, groundnut, redgram, chilli and soybean, and show me a comparison with sources. Update the table only after I approve."

## 4. Real mandi prices
"Using api/mandi.js, check the data.gov.in Agmarknet resource id and the exact commodity names for Telangana. Test with my DATA_GOV_API_KEY from .env.local. Fix the mapping, keep the last-good-copy fallback, and keep the sample table as a final fallback."

## 5. Moisture history graph
"On the Field control tab, store each moisture reading from the ESP32 under /field/history with a timestamp (update the firmware and app), and draw a small line chart of the last 24 hours using plain canvas or SVG, no heavy libraries."

## 6. Telugu interface and offline mode
"Add an English/Telugu language switch for all labels in index.html using a single translations object. Add an offline demo mode that shows saved sample data for weather, prices and sensor readings when there is no internet, with a clear Demo badge."

## 7. Deploy
"Walk me through deploying to Vercel from GitHub and adding GEMINI_API_KEY and DATA_GOV_API_KEY as environment variables. Then generate a QR code for the deployed URL for my poster."

## 8. Firmware review (before flashing)
"Review firmware/esp32_soil_pump/esp32_soil_pump.ino for bugs and safety. Check the relay logic, the 5-minute pump limit and WiFi reconnect. Suggest fixes but do not change the pin numbers without asking me."

## Tips
- Never paste API keys into prompts or commit them; keep them in .env.local and Vercel settings.
- Ask the agent to explain each change in simple words.
- The Disease check and Mandi tabs need the deployed or `vercel dev` version; they do not work if you just double-click index.html.
