// Unit tests for Agronomic Weather Advisory Rules, Multi-Model Consensus, and Ground Truth Accuracy
const assert = require("assert");
const {
  computeSprayWindow,
  computeIrrigationAdvice,
  computeDiseaseRiskAlerts,
  compareForecastModels,
  evaluateForecastAccuracy
} = require("./lib/weather/advisoryRules");
const { getCropDisorders } = require("./lib/diagnosis/knowledgeBase");

console.log("=== RUNNING WEATHER ADVISORY & IRRIGATION RULES TESTS ===");

// -------------------------------------------------------------
// TEST 1: Spray Window Rules with Fixed Fake Forecasts
// -------------------------------------------------------------
// Case 1A: High wind speed triggers unfavorable spray drift warning
const highWindCase = computeSprayWindow({
  currentTempC: 26,
  currentWindSpeedKmh: 18.5,
  currentWindGustsKmh: 28,
  nextHoursRainProb: [10, 10, 5, 5, 0, 0],
  nextHoursRainSum: [0, 0, 0, 0, 0, 0],
  currentHour: 8
});
assert(highWindCase.suitable === false, "High wind speed must mark spray window as unsuitable");
assert(highWindCase.rating === "UNFAVORABLE", "Rating must be UNFAVORABLE");
assert(highWindCase.issues.some(i => i.toLowerCase().includes("wind")), "Issues must mention wind speed");
assert(highWindCase.issuesTe.some(i => i.includes("గాలి")), "Telugu issue must mention wind");
console.log("[PASS] 1A. High wind speed spray drift protection verified.");

// Case 1B: Upcoming rain wash-off risk triggers unfavorable warning
const rainWashOffCase = computeSprayWindow({
  currentTempC: 25,
  currentWindSpeedKmh: 8,
  currentWindGustsKmh: 12,
  nextHoursRainProb: [15, 65, 80, 45, 10, 0],
  nextHoursRainSum: [0.1, 4.5, 6.0, 1.2, 0, 0],
  currentHour: 8
});
assert(rainWashOffCase.suitable === false, "Upcoming rain must prevent chemical spray");
assert(rainWashOffCase.issues.some(i => i.toLowerCase().includes("rain risk")), "Issues must cite rain risk");
console.log("[PASS] 1B. Upcoming rain wash-off risk protection verified.");

// Case 1C: Extreme midday heat (> 35°C) triggers scorching warning
const highHeatCase = computeSprayWindow({
  currentTempC: 38,
  currentWindSpeedKmh: 6,
  currentWindGustsKmh: 10,
  nextHoursRainProb: [0, 0, 0, 0, 0, 0],
  nextHoursRainSum: [0, 0, 0, 0, 0, 0],
  currentHour: 13
});
assert(highHeatCase.suitable === false, "Extreme midday heat must prevent spraying");
assert(highHeatCase.issues.some(i => i.toLowerCase().includes("midday temperature")), "Must cite high midday heat");
console.log("[PASS] 1C. High midday heat leaf-scorching protection verified.");

// Case 1D: Ideal early morning conditions (8 AM, 25°C, 7 km/h wind, 0% rain)
const idealCase = computeSprayWindow({
  currentTempC: 25,
  currentWindSpeedKmh: 7,
  currentWindGustsKmh: 11,
  nextHoursRainProb: [0, 5, 5, 0, 0, 0],
  nextHoursRainSum: [0, 0, 0, 0, 0, 0],
  currentHour: 8
});
assert(idealCase.suitable === true, "Ideal morning conditions must be marked suitable");
assert(idealCase.rating === "IDEAL", "Rating must be IDEAL");
assert(idealCase.adviceEn.includes("Ideal spray conditions"), "Must output ideal English advice");
assert(idealCase.adviceTe.includes("అనుకూలమైన సమయం"), "Must output ideal Telugu advice");
console.log("[PASS] 1D. Ideal early-morning spray window approved.");

// -------------------------------------------------------------
// TEST 2: Irrigation & Rain-Skip Rules
// -------------------------------------------------------------
// Case 2A: Rain-skip triggered when rain probability >= 60% or sum >= 5mm
const rainSkipCase = computeIrrigationAdvice({
  et0DailyMm: 4.8,
  rainProbMax: 75,
  rainSumMm: 12.0,
  sensorMoisturePct: 22,
  moistureThresholdPct: 30
});
assert(rainSkipCase.action === "SKIP", "Action must be SKIP");
assert(rainSkipCase.rainSkip === true, "rainSkip must be true");
assert(rainSkipCase.reasonEn.includes("skipped to conserve power"), "Must state rain-skip rationale");
console.log("[PASS] 2A. Rain-skip automatically triggers on heavy rain forecast.");

// Case 2B: Dry soil below threshold (18% vs 30%) with zero rain calls for irrigation
const irrigateCase = computeIrrigationAdvice({
  et0DailyMm: 5.2,
  rainProbMax: 10,
  rainSumMm: 0,
  sensorMoisturePct: 18,
  moistureThresholdPct: 30
});
assert(irrigateCase.action === "IRRIGATE", "Must recommend IRRIGATE when dry");
assert(irrigateCase.rainSkip === false, "rainSkip must be false");
assert(irrigateCase.reasonEn.includes("Run motor to replenish"), "Must advise running pump");
console.log("[PASS] 2B. Low moisture sensor reading triggers irrigation recommendation.");

// Case 2C: Adequate soil moisture (45% vs 30%)
const adequateCase = computeIrrigationAdvice({
  et0DailyMm: 4.0,
  rainProbMax: 5,
  rainSumMm: 0,
  sensorMoisturePct: 45,
  moistureThresholdPct: 30
});
assert(adequateCase.action === "ADEQUATE", "Must report ADEQUATE when moist");
assert(adequateCase.reasonEn.includes("No irrigation required today"), "Must advise no irrigation needed");
console.log("[PASS] 2C. Adequate moisture suppresses unnecessary motor runs.");

// -------------------------------------------------------------
// TEST 3: Disease Risk Alerts from Telangana Knowledge Base
// -------------------------------------------------------------
const paddyDisorders = getCropDisorders("Paddy");
// Blast favorable conditions: 20-26°C and RH >= 90%
const blastAlerts = computeDiseaseRiskAlerts({
  crop: "Paddy",
  tempC: 23,
  humidityPct: 93,
  disorders: paddyDisorders
});
assert(blastAlerts.length > 0, "Favorable cool/humid weather must trigger blast alert");
const blast = blastAlerts.find(a => a.disorderId === "paddy_blast");
assert(blast, "Blast alert must be present");
assert(blast.riskLevel === "HIGH", "Risk level must be HIGH");
assert(blast.disclaimer.includes("NOT a field diagnosis"), "Must include disclaimer that this is a risk indicator, not a diagnosis");
assert(blast.source.includes("pjtau.edu.in"), "Source must be authentic university URL");
console.log("[PASS] 3A. Rice Blast high risk alert triggers under favorable weather with disclaimer.");

// Unfavorable hot and dry conditions (38°C, 35% RH) must NOT trigger fungal blast alerts
const dryAlerts = computeDiseaseRiskAlerts({
  crop: "Paddy",
  tempC: 38,
  humidityPct: 35,
  disorders: paddyDisorders
});
assert(dryAlerts.length === 0, "Dry hot weather must not trigger fungal risk alerts");
console.log("[PASS] 3B. Non-favorable weather correctly suppresses disease alerts.");

// -------------------------------------------------------------
// TEST 4: Multi-Model Forecast Consensus Comparison
// -------------------------------------------------------------
// Case 4A: All models agree on heavy rain
const agreeRain = compareForecastModels({
  ecmwf: 14.2,
  gfs: 11.5,
  icon: 13.0
});
assert(agreeRain.consensus === "AGREE_RAIN", "Must detect agreement on rain");
assert(agreeRain.confidence === "HIGH", "Confidence must be HIGH when unanimous");
assert(agreeRain.statusTextEn.includes("Forecasts agree: Rain expected"), "Must report consensus");
console.log("[PASS] 4A. Unanimous rain prediction outputs 'Forecasts agree'.");

// Case 4B: All models agree on dry weather
const agreeDry = compareForecastModels({
  ecmwf: 0.0,
  gfs: 0.1,
  icon: 0.0
});
assert(agreeDry.consensus === "AGREE_DRY", "Must detect agreement on dry weather");
assert(agreeDry.statusTextEn.includes("Dry weather expected"), "Must report dry consensus");
console.log("[PASS] 4B. Unanimous dry prediction outputs 'Forecasts agree: Dry weather'.");

// Case 4C: Models diverge (one predicts heavy rain, others predict dry)
const divergent = compareForecastModels({
  ecmwf: 18.0,
  gfs: 0.2,
  icon: 0.5
});
assert(divergent.consensus === "DIVERGENT", "Must detect model divergence");
assert(divergent.confidence === "UNCERTAIN", "Confidence must be UNCERTAIN");
assert(divergent.statusTextEn.includes("Forecasts differ, uncertain"), "Must explicitly report uncertainty instead of false confidence");
assert(divergent.statusTextTe.includes("భిన్నాభిప్రాయం"), "Telugu status must express uncertainty");
console.log("[PASS] 4C. Divergent forecast models output 'Forecasts differ, uncertain' avoiding false certainty.");

// -------------------------------------------------------------
// TEST 5: Ground Truth Accuracy Evaluator
// -------------------------------------------------------------
// Case 5A: Under minimum days threshold (< 5 days)
const insufficientHistory = [
  { date: "2026-10-21", forecastRainMm: 6, measuredRainMm: 8 },
  { date: "2026-10-22", forecastRainMm: 0, measuredRainMm: 0 },
  { date: "2026-10-23", forecastRainMm: 0, measuredRainMm: 2 }
];
const evalEarly = evaluateForecastAccuracy(insufficientHistory, 5);
assert(evalEarly.hasEnoughDays === false, "Must not display score until min days are logged");
assert(evalEarly.messageEn.includes("Accumulating local weather ground truth (3/5"), "Must show accumulating progress");
console.log("[PASS] 5A. Insufficient history (<5 days) suppresses premature score.");

// Case 5B: 7 days logged (5 correct, 2 incorrect)
const matureHistory = [
  { date: "2026-10-18", forecastRainMm: 6, measuredRainMm: 8 },  // Correct (both rain)
  { date: "2026-10-19", forecastRainMm: 0, measuredRainMm: 0 },  // Correct (both dry)
  { date: "2026-10-20", forecastRainMm: 0, measuredRainMm: 0 },  // Correct (both dry)
  { date: "2026-10-21", forecastRainMm: 8, measuredRainMm: 1 },  // Incorrect (forecast rain, was dry)
  { date: "2026-10-22", forecastRainMm: 0, measuredRainMm: 9 },  // Incorrect (forecast dry, was rain)
  { date: "2026-10-23", forecastRainMm: 0, measuredRainMm: 0 },  // Correct (both dry)
  { date: "2026-10-24", forecastRainMm: 12, measuredRainMm: 15 } // Correct (both rain)
];
const evalMature = evaluateForecastAccuracy(matureHistory, 5);
assert(evalMature.hasEnoughDays === true, "Must evaluate when >= 5 days");
assert(evalMature.correctDays === 5, "Expected 5 correct days");
assert(evalMature.totalDays === 7, "Expected 7 total days");
assert(evalMature.accuracyRatio === "5/7", "Accuracy ratio must be 5/7");
assert(evalMature.messageEn.includes("Rain forecast was right 5 of 7 days"), "English message must state '5 of 7 days'");
assert(evalMature.messageTe.includes("5 రోజులు సరిగ్గా"), "Telugu message must state '5 రోజులు సరిగ్గా'");
console.log("[PASS] 5B. 'Rain forecast was right X of Y days' verified with 7-day ground truth.");

console.log("\n=======================================================");
console.log("ALL WEATHER ADVISORY & IRRIGATION TESTS PASSED (11/11)");
console.log("=======================================================\n");
