// Serverless endpoint for Weather Forecast, Multi-Model Consensus, and Scheduled/On-Report Rain-Skip
const { getFirebaseAdmin } = require("./_auth");
const {
  computeSprayWindow,
  computeIrrigationAdvice,
  computeDiseaseRiskAlerts,
  compareForecastModels,
  evaluateForecastAccuracy
} = require("../lib/weather/advisoryRules");
const { getCropDisorders } = require("../lib/diagnosis/knowledgeBase");

// In-memory weather cache to prevent rate-limiting Open-Meteo
const weatherCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

async function fetchOpenMeteoMultiModel(lat, lon) {
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return { data: cached.data, fromCache: true, cachedAt: cached.timestamp };
  }

  // Fetch Open-Meteo with best_match, ecmwf_ifs025, gfs_seamless, icon_seamless
  // Required variables:
  // hourly: temperature_2m, relative_humidity_2m, precipitation_probability, precipitation, weather_code, wind_speed_10m, wind_gusts_10m, et0_fao_evapotranspiration
  // daily: temperature_2m_max, temperature_2m_min, precipitation_sum, precipitation_probability_max, wind_speed_10m_max, wind_gusts_10m_max, et0_fao_evapotranspiration
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,et0_fao_evapotranspiration` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,et0_fao_evapotranspiration` +
    `&models=best_match,ecmwf_ifs025,gfs_seamless,icon_seamless` +
    `&timezone=Asia%2FKolkata&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo API returned status ${res.status}`);
  }
  const data = await res.json();
  weatherCache.set(cacheKey, { data, timestamp: now });
  return { data, fromCache: false, cachedAt: now };
}

async function syncRainSkipToDatabase(lat, lon, fieldPath = "field") {
  const { data } = await fetchOpenMeteoMultiModel(lat, lon);
  const daily = data.daily || {};
  
  // Calculate rain skip
  const rainProbDay0 = daily.precipitation_probability_max?.[0] || 0;
  const rainProbDay1 = daily.precipitation_probability_max?.[1] || 0;
  const rainSumDay0 = daily.precipitation_sum?.[0] || 0;
  const rainSumDay1 = daily.precipitation_sum?.[1] || 0;

  const maxProb = Math.max(rainProbDay0, rainProbDay1);
  const maxRain = Math.max(rainSumDay0, rainSumDay1);
  const shouldSkip = maxProb >= 60 || maxRain >= 5.0;

  const reason = shouldSkip
    ? `Rain forecast in next 24-48h (${maxProb}% prob, ~${maxRain.toFixed(1)} mm). Irrigation skipped.`
    : `No significant rain forecast in next 48h (${maxProb}% max prob, ~${maxRain.toFixed(1)} mm). Normal auto-irrigation active.`;

  let dbWritten = false;
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp) {
      const db = adminApp.database();
      await db.ref(fieldPath).update({
        rain_skip: shouldSkip,
        rain_skip_reason: reason,
        rain_skip_updated_at: Date.now(),
        forecast_rain_mm: maxRain,
        forecast_rain_prob: maxProb
      });
      dbWritten = true;
    }
  } catch (dbErr) {
    console.warn("Could not sync rain-skip to Firebase:", dbErr.message);
  }

  return {
    success: true,
    shouldSkip,
    maxProb,
    maxRain,
    reason,
    dbWritten,
    updatedAt: Date.now()
  };
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = req.query.action || req.body?.action || "";
  const lat = parseFloat(req.query.lat || req.body?.lat || "18.79"); // Default Jagtial
  const lon = parseFloat(req.query.lon || req.body?.lon || "78.91");
  const crop = req.query.crop || req.body?.crop || "Paddy";

  try {
    // -------------------------------------------------------------
    // ACTION 1: Server-Side Rain-Skip Sync (Vercel Cron / On-Report)
    // -------------------------------------------------------------
    if (action === "sync_device") {
      const fieldPath = req.query.field || req.body?.field || "field";
      const result = await syncRainSkipToDatabase(lat, lon, fieldPath);
      return res.status(200).json(result);
    }

    // -------------------------------------------------------------
    // ACTION 2: Full Multi-Model Weather & Farm Advice Fetch
    // -------------------------------------------------------------
    const { data, fromCache, cachedAt } = await fetchOpenMeteoMultiModel(lat, lon);
    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    // 1. Multi-Model Rain Consensus for Next 24-48h
    // Compare daily rain across ecmwf, gfs, icon, best_match
    const modelRain = {
      best_match: daily.precipitation_sum?.[0] ?? daily.precipitation_sum_best_match?.[0] ?? 0,
      ecmwf: daily.precipitation_sum_ecmwf_ifs025?.[0] ?? daily.precipitation_sum?.[0] ?? 0,
      gfs: daily.precipitation_sum_gfs_seamless?.[0] ?? daily.precipitation_sum?.[0] ?? 0,
      icon: daily.precipitation_sum_icon_seamless?.[0] ?? daily.precipitation_sum?.[0] ?? 0
    };
    const consensus = compareForecastModels(modelRain);

    // 2. Pure Farm Advice: Spray Window
    const next6hProb = (hourly.precipitation_probability || []).slice(0, 6);
    const next6hRain = (hourly.precipitation || []).slice(0, 6);
    const sprayWindow = computeSprayWindow({
      currentTempC: current.temperature_2m || 30,
      currentWindSpeedKmh: current.wind_speed_10m || 8,
      currentWindGustsKmh: current.wind_gusts_10m || 12,
      nextHoursRainProb: next6hProb,
      nextHoursRainSum: next6hRain,
      currentHour: new Date().getHours()
    });

    // 3. Pure Farm Advice: Smart Irrigation & Rain-Skip
    const et0Today = daily.et0_fao_evapotranspiration?.[0] || 4.2;
    const rainProbMax = Math.max(daily.precipitation_probability_max?.[0] || 0, daily.precipitation_probability_max?.[1] || 0);
    const rainSumMax = Math.max(daily.precipitation_sum?.[0] || 0, daily.precipitation_sum?.[1] || 0);
    const sensorMoisture = req.query.moisture ? parseFloat(req.query.moisture) : null;
    const irrigationAdvice = computeIrrigationAdvice({
      et0DailyMm: et0Today,
      rainProbMax,
      rainSumMm: rainSumMax,
      sensorMoisturePct: sensorMoisture,
      moistureThresholdPct: 30
    });

    // 4. Pure Farm Advice: Disease Risk Indicators from KB
    const disorders = getCropDisorders(crop);
    const diseaseAlerts = computeDiseaseRiskAlerts({
      crop,
      tempC: current.temperature_2m || 28,
      humidityPct: current.relative_humidity_2m || 65,
      disorders
    });

    // 5. Severe Weather Warnings (Heat, Heavy Rain, High Winds)
    const severeWarnings = [];
    if ((current.temperature_2m || 0) >= 40 || (daily.temperature_2m_max?.[0] || 0) >= 42) {
      severeWarnings.push({
        type: "HEAT_WAVE",
        severity: "WARNING",
        titleEn: "Extreme Heat Wave Alert (>40°C)",
        titleTe: "తీవ్రమైన వడగాడ్పుల హెచ్చరిక (>40°C)",
        messageEn: "Provide light frequent irrigations to prevent plant desiccation. Avoid midday farm labor.",
        messageTe: "ఎండ తీవ్రత నుండి పంటను కాపాడటానికి తేలికపాటి తడులు ఇవ్వండి. మధ్యాహ్నం వ్యవసాయ పనులు చేయవద్దు."
      });
    }
    if (rainSumMax >= 35 || Math.max(...(hourly.precipitation || [0])) >= 15) {
      severeWarnings.push({
        type: "HEAVY_RAIN",
        severity: "WARNING",
        titleEn: "Heavy Rainfall Warning (>35 mm)",
        titleTe: "భారీ వర్ష సూచన హెచ్చరిక (>35 మి.మీ)",
        messageEn: "Clear field drainage channels to prevent water stagnation and root asphyxiation.",
        messageTe: "పొలంలో నీరు నిల్వ ఉండకుండా మురుగు కాలువలను సరిచేసుకోండి."
      });
    }
    if ((current.wind_gusts_10m || 0) >= 40 || (daily.wind_gusts_10m_max?.[0] || 0) >= 45) {
      severeWarnings.push({
        type: "HIGH_WIND",
        severity: "WARNING",
        titleEn: "Strong Wind & Gusts Alert (>40 km/h)",
        titleTe: "ఈదురు గాలుల హెచ్చరిక (>40 కి.మీ/గం)",
        messageEn: "Suspend pesticide/herbicide spraying. Provide staking for tall crops like sugarcane, banana, or chilli.",
        messageTe: "మందుల పిచికారీ నిలిపివేయండి. ఎత్తుగా పెరిగే పంటలకు ఊతాలు ఏర్పాటు చేయండి."
      });
    }

    return res.status(200).json({
      success: true,
      fromCache,
      cachedAt,
      source: "Open-Meteo Meteorological Service",
      coordinates: { lat, lon },
      crop,
      current,
      hourly,
      daily,
      consensus,
      sprayWindow,
      irrigationAdvice,
      diseaseAlerts,
      severeWarnings,
      imdOfficialAlertsUrl: "https://mausam.imd.gov.in"
    });
  } catch (err) {
    console.error("Weather endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch weather data."
    });
  }
};
