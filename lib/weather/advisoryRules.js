/**
 * Pure, testable agronomic weather advice functions for Smart Farm Assistant
 * Grounded in PJTAU (Professor Jayashankar Telangana Agricultural University) agronomy.
 */

/**
 * 1. Spray Window Advisor
 * Pure function evaluating wind speed, gusts, upcoming rain risk, and extreme temperature.
 *
 * Agronomic criteria (PJTAU / ICAR):
 * - Wind speed must be < 15 km/h (gusts < 25 km/h) to avoid spray drift into non-target areas/crops.
 * - No significant rain (precipitation prob < 30% and rain sum < 1 mm) in the next 4 to 6 hours to avoid chemical wash-off.
 * - Air temperature must be < 35°C (avoid midday spraying; early morning 6-9 AM or late afternoon 4-6 PM preferred).
 *
 * @param {Object} params
 * @param {number} params.currentTempC - Current temperature in Celsius
 * @param {number} params.currentWindSpeedKmh - Current 10m wind speed in km/h
 * @param {number} params.currentWindGustsKmh - Current wind gusts in km/h
 * @param {Array<number>} params.nextHoursRainProb - Next 6 hours precipitation probability percentages
 * @param {Array<number>} params.nextHoursRainSum - Next 6 hours precipitation sum in mm
 * @param {number} [params.currentHour] - Current hour of day (0-23)
 * @returns {Object} Suitability result with score, window, and bilingual reasons
 */
function computeSprayWindow({
  currentTempC,
  currentWindSpeedKmh,
  currentWindGustsKmh = 0,
  nextHoursRainProb = [],
  nextHoursRainSum = [],
  currentHour = new Date().getHours()
}) {
  const issues = [];
  const issuesTe = [];

  // Wind drift check
  if (currentWindSpeedKmh >= 15 || currentWindGustsKmh >= 25) {
    issues.push(`Wind speed is high (${currentWindSpeedKmh.toFixed(1)} km/h, gusts ${currentWindGustsKmh.toFixed(1)} km/h). Spray drift risk.`);
    issuesTe.push(`గాలి వేగం ఎక్కువగా ఉంది (${currentWindSpeedKmh.toFixed(1)} కి.మీ/గం). మందు పక్క పొలాలకు కొట్టుకుపోయే ప్రమాదం ఉంది.`);
  }

  // Rain wash-off check in next 6 hours
  const maxRainProb = nextHoursRainProb.length > 0 ? Math.max(...nextHoursRainProb.slice(0, 6)) : 0;
  const totalRainNext6h = nextHoursRainSum.length > 0
    ? nextHoursRainSum.slice(0, 6).reduce((a, b) => a + (Number(b) || 0), 0)
    : 0;

  if (maxRainProb >= 40 || totalRainNext6h >= 1.5) {
    issues.push(`Rain risk in next 6 hours (Probability: ${maxRainProb}%, Rain: ${totalRainNext6h.toFixed(1)} mm). Chemical will wash off.`);
    issuesTe.push(`రాబోయే 6 గంటల్లో వర్ష సూచన ఉంది (${maxRainProb}%, ${totalRainNext6h.toFixed(1)} మి.మీ). మందు కొట్టుకుపోతుంది.`);
  }

  // High midday heat check
  if (currentTempC >= 35) {
    issues.push(`High midday temperature (${currentTempC.toFixed(1)}°C). Risk of chemical evaporation and foliar scorching.`);
    issuesTe.push(`తీవ్రమైన ఎండ / ఉష్ణోగ్రత (${currentTempC.toFixed(1)}°C). మందు ఆవిరై ఆకులు మాడే ప్రమాదం ఉంది.`);
  }

  // Ideal time of day check (Early morning 6-9 AM or late afternoon 4-6:30 PM)
  const isIdealTime = (currentHour >= 6 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 18);

  const suitable = issues.length === 0;

  let adviceEn = "";
  let adviceTe = "";

  if (suitable) {
    if (isIdealTime) {
      adviceEn = "Ideal spray conditions right now (Low wind, no rain risk, comfortable temperature).";
      adviceTe = "పిచికారీకి అనుకూలమైన సమయం (తక్కువ గాలి, వర్షం లేదు, అనుకూల ఉష్ణోగ్రత).";
    } else {
      adviceEn = "Weather parameters acceptable, but early morning (6-9 AM) or late afternoon (4-6 PM) is best.";
      adviceTe = "వాతావరణం అనుకూలంగా ఉంది, అయితే ఉదయం (6-9 గం) లేదా సాయంత్రం (4-6 గం) పిచికారీ చేయడం ఉత్తమం.";
    }
  } else {
    adviceEn = `Unfavorable for spraying right now: ${issues.join(" ")}`;
    adviceTe = `ఇప్పుడు పిచికారీకి అనుకూలం కాదు: ${issuesTe.join(" ")}`;
  }

  return {
    suitable,
    rating: suitable ? (isIdealTime ? "IDEAL" : "ACCEPTABLE") : "UNFAVORABLE",
    issues,
    issuesTe,
    adviceEn,
    adviceTe,
    windKmh: currentWindSpeedKmh,
    tempC: currentTempC,
    maxRainProbNext6h: maxRainProb,
    totalRainNext6hMm: totalRainNext6h
  };
}

/**
 * 2. Smart Irrigation & Rain-Skip Advisor
 * Combines reference evapotranspiration (ET0), forecast rain, and soil sensor moisture.
 *
 * Agronomic criteria:
 * - If significant rain is forecast (prob >= 60% or sum >= 5mm in next 24-48h), trigger rain skip.
 * - ET0 indicates crop water demand (mm/day).
 * - If sensor moisture is provided, use threshold to advise pump on/off.
 *
 * @param {Object} params
 * @param {number} params.et0DailyMm - Reference evapotranspiration in mm
 * @param {number} params.rainProbMax - Max precipitation probability in % (today/tomorrow)
 * @param {number} params.rainSumMm - Expected precipitation sum in mm (today/tomorrow)
 * @param {number|null} [params.sensorMoisturePct] - Live soil moisture % from IoT device
 * @param {number} [params.moistureThresholdPct=30] - Auto-irrigation threshold %
 * @returns {Object} Irrigation recommendation with rain-skip status
 */
function computeIrrigationAdvice({
  et0DailyMm = 4.0,
  rainProbMax = 0,
  rainSumMm = 0,
  sensorMoisturePct = null,
  moistureThresholdPct = 30
}) {
  // Rain skip rule: Rain prob >= 60% OR expected rain >= 5 mm
  const shouldSkipForRain = rainProbMax >= 60 || rainSumMm >= 5.0;

  if (shouldSkipForRain) {
    return {
      action: "SKIP",
      rainSkip: true,
      reasonEn: `Rain forecast detected (${rainProbMax}% chance, ~${rainSumMm.toFixed(1)} mm). Irrigation skipped to conserve power and avoid waterlogging.`,
      reasonTe: `వర్ష సూచన ఉంది (${rainProbMax}% అవకాశం, ~${rainSumMm.toFixed(1)} మి.మీ). నీటి వృధా, నీరు నిలవడాన్ని నివారించడానికి మోటార్ ఆపబడింది.`,
      waterDemandMm: et0DailyMm,
      sensorMoisturePct
    };
  }

  // If live sensor moisture is available
  if (sensorMoisturePct !== null && !isNaN(sensorMoisturePct)) {
    if (sensorMoisturePct <= moistureThresholdPct) {
      const deficit = Math.max(1, (moistureThresholdPct - sensorMoisturePct) * 0.8 + et0DailyMm);
      return {
        action: "IRRIGATE",
        rainSkip: false,
        reasonEn: `Soil moisture (${sensorMoisturePct.toFixed(0)}%) is at or below threshold (${moistureThresholdPct}%). Daily crop water demand (ET0) is ${et0DailyMm.toFixed(1)} mm. Run motor to replenish root zone.`,
        reasonTe: `నేల తేమ (${sensorMoisturePct.toFixed(0)}%) నిర్ణీత పరిమితి (${moistureThresholdPct}%) కంటే తగ్గింది. పంట రోజువారీ నీటి అవసరం ${et0DailyMm.toFixed(1)} మి.మీ. మోటార్ ఆన్ చేయండి.`,
        waterDemandMm: et0DailyMm,
        sensorMoisturePct
      };
    } else {
      return {
        action: "ADEQUATE",
        rainSkip: false,
        reasonEn: `Soil moisture (${sensorMoisturePct.toFixed(0)}%) is healthy. Crop ET0 demand is ${et0DailyMm.toFixed(1)} mm/day. No irrigation required today.`,
        reasonTe: `నేలలో తగినంత తేమ (${sensorMoisturePct.toFixed(0)}%) ఉంది. రోజువారీ పంట నీటి అవసరం ${et0DailyMm.toFixed(1)} మి.మీ. నేడు నీరు పెట్టవలసిన అవసరం లేదు.`,
        waterDemandMm: et0DailyMm,
        sensorMoisturePct
      };
    }
  }

  // Fallback when no sensor is attached: advisory based purely on ET0
  return {
    action: "ET0_GUIDE",
    rainSkip: false,
    reasonEn: `No rain forecast. Reference crop evapotranspiration (ET0) is ${et0DailyMm.toFixed(1)} mm/day. Irrigate based on local soil dry-down observations.`,
    reasonTe: `వర్ష సూచన లేదు. రోజువారీ భాష్పీభవనం (ET0) ${et0DailyMm.toFixed(1)} మి.మీ. నేల ఆరిన విధానాన్ని బట్టి నీరు పెట్టండి.`,
    waterDemandMm: et0DailyMm,
    sensorMoisturePct: null
  };
}

/**
 * 3. Crop Disease Risk Indicators
 * Correlates forecast temperature and relative humidity with favorable conditions from our PJTAU Knowledge Base.
 * Explicitly labeled as RISK INDICATORS based on weather microclimate, NOT field diagnoses.
 *
 * @param {Object} params
 * @param {string} params.crop - Target crop (Paddy, Maize, Cotton, Groundnut, etc.)
 * @param {number} params.tempC - Current or average forecast temperature in Celsius
 * @param {number} params.humidityPct - Relative humidity percentage
 * @param {Array<Object>} [params.disorders] - List of disorders from data/diseases.json for this crop
 * @returns {Array<Object>} Triggered risk alerts
 */
function computeDiseaseRiskAlerts({
  crop = "Paddy",
  tempC,
  humidityPct,
  disorders = []
}) {
  const alerts = [];
  if (!disorders || disorders.length === 0) return alerts;

  disorders.forEach(d => {
    const fc = d.favourableConditions;
    if (!fc || !fc.tempRangeC || fc.relativeHumidityMin == null) return;

    const [minTemp, maxTemp] = fc.tempRangeC;
    const minHum = fc.relativeHumidityMin;

    const isTempFavorable = (tempC >= minTemp && tempC <= maxTemp);
    const isHumidityFavorable = (humidityPct >= minHum);

    if (isTempFavorable && isHumidityFavorable) {
      alerts.push({
        disorderId: d.id,
        crop,
        commonName: d.commonName,
        nameTe: d.nameTe,
        riskLevel: "HIGH",
        source: d.source || "https://pjtau.edu.in",
        reasonEn: `Favorable microclimate for ${d.commonName}: Temperature is ${tempC.toFixed(0)}°C (favorable: ${minTemp}–${maxTemp}°C) and Humidity is ${humidityPct.toFixed(0)}% (threshold: ≥${minHum}%).`,
        reasonTe: `${d.nameTe} వ్యాప్తికి అనుకూల వాతావరణం: ఉష్ణోగ్రత ${tempC.toFixed(0)}°C (${minTemp}–${maxTemp}°C), గాలిలో తేమ ${humidityPct.toFixed(0)}% (పరిమితి: ≥${minHum}%).`,
        fieldCheck: d.fieldCheck,
        disclaimer: "Weather-based disease risk indicator only, NOT a field diagnosis. Inspect field to confirm presence."
      });
    } else if (isTempFavorable && humidityPct >= minHum - 10) {
      alerts.push({
        disorderId: d.id,
        crop,
        commonName: d.commonName,
        nameTe: d.nameTe,
        riskLevel: "MODERATE",
        source: d.source || "https://pjtau.edu.in",
        reasonEn: `Moderate risk for ${d.commonName}: Temperature ${tempC.toFixed(0)}°C is favorable, humidity (${humidityPct.toFixed(0)}%) approaching risk threshold (≥${minHum}%).`,
        reasonTe: `${d.nameTe} వ్యాప్తికి మధ్యస్థ ప్రమాద అవకాశం: ఉష్ణోగ్రత అనుకూలంగా ఉంది, తేమ పెరుగుతోంది.`,
        fieldCheck: d.fieldCheck,
        disclaimer: "Weather-based disease risk indicator only, NOT a field diagnosis."
      });
    }
  });

  return alerts;
}

/**
 * 4. Multi-Model Forecast Consensus Comparison
 * Compares rain forecasts across independent models (e.g. ECMWF, GFS, ICON).
 * Prevents misleading single-number overconfidence.
 *
 * @param {Object} modelsRain - Map of model name to predicted rain sum in mm or prob %
 * Example: { ecmwf: 8.5, gfs: 6.2, icon: 7.0 }
 * @returns {Object} Consensus assessment
 */
function compareForecastModels(modelsRain = {}) {
  const modelEntries = Object.entries(modelsRain).filter(([_, val]) => val !== null && !isNaN(val));

  if (modelEntries.length < 2) {
    return {
      consensus: "SINGLE_MODEL",
      statusTextEn: "Single model forecast",
      statusTextTe: "సింగిల్ మోడల్ అంచనా",
      agreementScore: 1.0,
      rainExpected: modelEntries.length === 1 ? Number(modelEntries[0][1]) >= 2.5 : false
    };
  }

  // Classify each model as expecting rain (>= 2.5 mm or >= 50%) or dry (< 2.5 mm)
  const rainFlags = modelEntries.map(([name, val]) => ({
    name,
    value: Number(val),
    expectsRain: Number(val) >= 2.5
  }));

  const rainPredictorsCount = rainFlags.filter(m => m.expectsRain).length;
  const totalModels = rainFlags.length;

  const unanimousRain = (rainPredictorsCount === totalModels);
  const unanimousDry = (rainPredictorsCount === 0);

  if (unanimousRain) {
    return {
      consensus: "AGREE_RAIN",
      confidence: "HIGH",
      statusTextEn: `Forecasts agree: Rain expected (${modelEntries.map(([k, v]) => `${k.toUpperCase()}: ${v}mm`).join(", ")})`,
      statusTextTe: `అన్ని మోడళ్లు ఏకీభవిస్తున్నాయి: వర్షం పడే అవకాశం ఉంది (${modelEntries.map(([k, v]) => `${k.toUpperCase()}: ${v}మి.మీ`).join(", ")})`,
      agreementScore: 1.0,
      rainExpected: true
    };
  }

  if (unanimousDry) {
    return {
      consensus: "AGREE_DRY",
      confidence: "HIGH",
      statusTextEn: "Forecasts agree: Dry weather expected across all meteorological models.",
      statusTextTe: "అన్ని వాతావరణ మోడళ్లు ఏకీభవిస్తున్నాయి: పొడి వాతావరణం కొనసాగవచ్చు.",
      agreementScore: 1.0,
      rainExpected: false
    };
  }

  // Models diverge
  return {
    consensus: "DIVERGENT",
    confidence: "UNCERTAIN",
    statusTextEn: `Forecasts differ, uncertain (${rainPredictorsCount}/${totalModels} models predict rain: ${modelEntries.map(([k, v]) => `${k.toUpperCase()}: ${v}mm`).join(", ")})`,
    statusTextTe: `వాతావరణ మోడళ్ల మధ్య భిన్నాభిప్రాయం, అనిశ్చితి (${totalModels} లో ${rainPredictorsCount} మోడళ్లు మాత్రమే వర్షాన్ని సూచిస్తున్నాయి).`,
    agreementScore: Math.max(rainPredictorsCount, totalModels - rainPredictorsCount) / totalModels,
    rainExpected: rainPredictorsCount >= Math.ceil(totalModels / 2)
  };
}

/**
 * 5. Local Ground Truth Accuracy Evaluator
 * Evaluates historical forecast vs measured ground truth rain events.
 * Only shows score when at least minDays (e.g. 5 days) are logged.
 *
 * @param {Array<Object>} historyLogs - List of daily logs { date, forecastRainMm, measuredRainMm }
 * @param {number} [minDays=5]
 * @returns {Object} Accuracy metric
 */
function evaluateForecastAccuracy(historyLogs = [], minDays = 5) {
  if (!Array.isArray(historyLogs) || historyLogs.length < minDays) {
    return {
      hasEnoughDays: false,
      loggedDays: Array.isArray(historyLogs) ? historyLogs.length : 0,
      minRequiredDays: minDays,
      messageEn: `Accumulating local weather ground truth (${Array.isArray(historyLogs) ? historyLogs.length : 0}/${minDays} days logged). Score appears once enough days are recorded.`,
      messageTe: `స్థానిక వాతావరణ రికార్డులను సేకరిస్తున్నాము (${Array.isArray(historyLogs) ? historyLogs.length : 0}/${minDays} రోజులు నమోదయ్యాయి). తగినంత సమాచారం చేరిన తర్వాత ఫలితం కనిపిస్తుంది.`
    };
  }

  let correctDays = 0;
  const totalDays = historyLogs.length;

  historyLogs.forEach(entry => {
    const fRain = (Number(entry.forecastRainMm) || 0) >= 2.5;
    const mRain = (Number(entry.measuredRainMm) || 0) >= 2.5;
    // Correct if both predicted rain or both predicted dry
    if (fRain === mRain) {
      correctDays++;
    }
  });

  return {
    hasEnoughDays: true,
    correctDays,
    totalDays,
    accuracyRatio: `${correctDays}/${totalDays}`,
    messageEn: `Rain forecast was right ${correctDays} of ${totalDays} days for this location.`,
    messageTe: `గత ${totalDays} రోజులలో ఈ ప్రాంతానికి సంబంధించి వర్ష సూచన ${correctDays} రోజులు సరిగ్గా నమోదైంది.`
  };
}

module.exports = {
  computeSprayWindow,
  computeIrrigationAdvice,
  computeDiseaseRiskAlerts,
  compareForecastModels,
  evaluateForecastAccuracy
};
