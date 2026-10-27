"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Droplets,
  Calendar,
  CloudRain,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Leaf,
  Edit3,
  Save,
  RotateCcw,
  Gauge,
  Info,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { useIoTTelemetry } from "@/lib/iot/useIoTTelemetry";
import { fetchLiveDistrictWeather, LiveWeatherData } from "@/lib/weather/openMeteo";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Standard PJTAU crop duration references (indicative)
const DEFAULT_CROP_DURATIONS: Record<
  string,
  {
    totalDays: number;
    variety: string;
    stages: { nameEn: string; nameTe: string; startDay: number; endDay: number; adviceEn: string; adviceTe: string }[];
  }
> = {
  Paddy: {
    totalDays: 125,
    variety: "RNR-15048 (Telangana Sona)",
    stages: [
      {
        nameEn: "Nursery & Seedling",
        nameTe: "నారుమడి దశ",
        startDay: 0,
        endDay: 25,
        adviceEn: "Maintain 2–3 cm thin water layer. Apply Zinc Sulfate 2g/L if khaira leaf bronzing appears.",
        adviceTe: "2-3 సెం.మీ పలుచని నీటి మట్టం ఉంచండి. జింక్ లోపం కనిపిస్తే 2గ్రా లీటరుకు పిచికారీ చేయండి.",
      },
      {
        nameEn: "Active Tillering",
        nameTe: "పిలకల దశ",
        startDay: 26,
        endDay: 55,
        adviceEn: "Top dress 1/3 Nitrogen (Urea). Alternate wetting and drying (AWD) saves up to 30% water.",
        adviceTe: "మొదటి దఫా యూరియా వేయండి. తడి-ఆరి విధానం పాటించి 30% నీటిని ఆదా చేయండి.",
      },
      {
        nameEn: "Panicle Initiation",
        nameTe: "చిరుపొట్ట దశ",
        startDay: 56,
        endDay: 85,
        adviceEn: "Crucial critical irrigation stage. Never allow moisture deficit; maintain 5 cm standing water.",
        adviceTe: "అత్యంత కీలకమైన దశ. నీటి ఎద్దడి లేకుండా 5 సెం.మీ నీరు ఉండేలా చూడండి.",
      },
      {
        nameEn: "Grain Filling & Milk Stage",
        nameTe: "గింజ పాలుపోసుకునే దశ",
        startDay: 86,
        endDay: 110,
        adviceEn: "Inspect for BPH (Brown Plant Hopper) at base of stems. Drain water 10 days before harvest.",
        adviceTe: "సుడిదోమ ఆశించకుండా మొదళ్ల వద్ద పరిశీలించండి. కోతకు 10 రోజుల ముందు నీరు తీసివేయండి.",
      },
      {
        nameEn: "Maturity & Harvest",
        nameTe: "కోత దశ",
        startDay: 111,
        endDay: 125,
        adviceEn: "Harvest when 85% of panicles turn golden straw yellow. Moisture target at harvest 17–20%.",
        adviceTe: "85% వెన్నులు బంగారు రంగులోకి మారినప్పుడు కోత కోయండి. తేమ 17-20% ఉండేలా చూడండి.",
      },
    ],
  },
  Cotton: {
    totalDays: 160,
    variety: "Bollgard II Hybrid",
    stages: [
      {
        nameEn: "Vegetative Emergence",
        nameTe: "శాకీయ పెరుగుదల దశ",
        startDay: 0,
        endDay: 40,
        adviceEn: "Gap filling within 10 days of sowing. Thin to single healthy plant per hill.",
        adviceTe: "మొలక వచ్చిన 10 రోజుల్లో ఖాళీలను పూడ్చండి. ఒక్కో చోట ఒకే ఆరోగ్యకరమైన మొక్కను ఉంచండి.",
      },
      {
        nameEn: "Square & Flower Formation",
        nameTe: "మొగ్గ మరియు పూత దశ",
        startDay: 41,
        endDay: 80,
        adviceEn: "Monitor for sucking pests (Jassids, Thrips). Install yellow sticky traps (5/acre).",
        adviceTe: "రసం పీల్చే పురుగులను గమనించండి. ఎకరాకు 5 పసుపు జిగురు బోర్డులను అమర్చండి.",
      },
      {
        nameEn: "Boll Development",
        nameTe: "కాయ దశ",
        startDay: 81,
        endDay: 125,
        adviceEn: "Critical moisture stress period. Drip irrigate when soil moisture drops below 30%.",
        adviceTe: "నీటి అవసరం అత్యధికంగా ఉండే దశ. తేమ 30% కంటే తగ్గకుండా డ్రిప్ ద్వారా నీరందించండి.",
      },
      {
        nameEn: "Boll Bursting & Picking",
        nameTe: "కాయ పగులుట & తీత",
        startDay: 126,
        endDay: 160,
        adviceEn: "Pick clean seed cotton into dry cotton bags after dew dries in the morning.",
        adviceTe: "మంచు ఆరిన తర్వాత మాత్రమే పత్తిని శుభ్రంగా ఏరి కాటన్ సంచులలో నిల్వ చేయండి.",
      },
    ],
  },
  Maize: {
    totalDays: 105,
    variety: "Single Cross Hybrid",
    stages: [
      {
        nameEn: "Knee-High Stage",
        nameTe: "మోకాలి ఎత్తు దశ",
        startDay: 0,
        endDay: 35,
        adviceEn: "Scout for Fall Armyworm (FAW) whorl damage. Apply Emamectin benzoate if frass observed.",
        adviceTe: "కత్తెర పురుగు దాడిని సుడిలో గమనించండి. లద్దె కనిపిస్తే ఎమామెక్టిన్ బెంజోయేట్ పిచికారీ చేయండి.",
      },
      {
        nameEn: "Tasseling & Silking",
        nameTe: "పూత & వెన్ను దశ",
        startDay: 36,
        endDay: 70,
        adviceEn: "Most moisture-sensitive period. Water stress now drastically reduces grain kernel set.",
        adviceTe: "అత్యంత సున్నితమైన దశ. ఈ సమయంలో నీటి ఎద్దడి వస్తే దిగుబడి గణనీయంగా తగ్గుతుంది.",
      },
      {
        nameEn: "Grain Hardening & Harvest",
        nameTe: "గింజ గట్టిపడుట & కోత",
        startDay: 71,
        endDay: 105,
        adviceEn: "Harvest when black layer forms at the base of the kernel. Sun dry cobs to 12% moisture.",
        adviceTe: "గింజ అడుగున నల్లటి పొర ఏర్పడినప్పుడు కోత కోయండి. 12% తేమ వచ్చే వరకు ఎండబెట్టండి.",
      },
    ],
  },
  Chilli: {
    totalDays: 165,
    variety: "Teja / Guntur Sannam",
    stages: [
      {
        nameEn: "Transplanting & Establishment",
        nameTe: "నాటు దశ",
        startDay: 0,
        endDay: 40,
        adviceEn: "Dip seedling roots in Trichoderma viride. Maintain light, frequent drip irrigations.",
        adviceTe: "ట్రైకోడెర్మా విరిడే ద్రావణంలో నారు వేర్లను ముంచి నాటండి. పలుచని నీటి తడులు ఇవ్వండి.",
      },
      {
        nameEn: "Branching & Flowering",
        nameTe: "కొమ్మలు & పూత దశ",
        startDay: 41,
        endDay: 90,
        adviceEn: "Monitor for Black Thrips (Thrips parvispinus). Spray Spinetoram or spinosad on schedule.",
        adviceTe: "నల్ల తామర పురుగుల ఉధృతిని గమనించండి. సిఫార్సు చేసిన మందులను పిచికారీ చేయండి.",
      },
      {
        nameEn: "Fruit Setting & Pickings",
        nameTe: "కాయ కాపు & కోతలు",
        startDay: 91,
        endDay: 165,
        adviceEn: "Harvest deep red ripe pods for drying. Dry on clean polythene tarpaulins, not bare soil.",
        adviceTe: "పూర్తిగా ఎర్రబడిన కాయలను మాత్రమే కోయండి. పాలిథిన్ పట్టాలపై మాత్రమే ఆరబెట్టండి.",
      },
    ],
  },
};

export default function InsightsPage() {
  const { lang, t } = useLanguage();
  const { profile } = useFarmerProfile();
  const { telemetry } = useIoTTelemetry(8000);

  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [sowingDate, setSowingDate] = useState<string>(profile.sowingDate || "2026-07-15");
  const [isEditingDuration, setIsEditingDuration] = useState<boolean>(false);
  const [customTotalDays, setCustomTotalDays] = useState<number>(125);

  // Sync sowingDate when profile changes
  useEffect(() => {
    if (profile.sowingDate) {
      setSowingDate(profile.sowingDate);
    }
  }, [profile.sowingDate]);

  // Fetch real Open-Meteo weather
  useEffect(() => {
    fetchLiveDistrictWeather(profile.district).then((w) => setWeather(w));
  }, [profile.district]);

  // Resolve active crop configuration
  const matchedCropKey = Object.keys(DEFAULT_CROP_DURATIONS).find((k) =>
    (profile.primaryCrop || "").toLowerCase().includes(k.toLowerCase())
  ) || "Paddy";

  const cropConfig = DEFAULT_CROP_DURATIONS[matchedCropKey];

  useEffect(() => {
    setCustomTotalDays(cropConfig.totalDays);
  }, [matchedCropKey, cropConfig.totalDays]);

  // Calculate days elapsed since sowing
  const daysElapsed = useMemo(() => {
    const sown = new Date(sowingDate).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - sown) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [sowingDate]);

  // Percentage crop progress
  const progressPct = Math.min(100, Math.round((daysElapsed / customTotalDays) * 100));

  // Determine current growth stage
  const currentStage = useMemo(() => {
    for (const st of cropConfig.stages) {
      if (daysElapsed >= st.startDay && daysElapsed <= st.endDay) {
        return st;
      }
    }
    return cropConfig.stages[cropConfig.stages.length - 1];
  }, [cropConfig, daysElapsed]);

  // Identify any upcoming rain in next 5 days
  const rainOpportunity = useMemo(() => {
    if (!weather?.dailyForecast) return null;
    return weather.dailyForecast.find((d) => d.rainProbPct >= 50);
  }, [weather]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("insights_title")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              {profile.district} Field Analytics
            </span>
            <Badge variant="outline" className="text-xs">
              Phase 3 Agronomy
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {profile.village} Field &bull; {profile.areaAcre} Acres of {profile.primaryCrop} &bull; Sown on {sowingDate}
          </p>
        </div>
      </div>

      {/* 2. Top Section: Monitored Field Zones Shaded by Moisture */}
      <Card>
        <CardHeader
          title={t("insights_zones_title")}
          subtitle={`Real telemetry mapped to ${profile.name}'s registered acreage in ${profile.village}`}
          icon={<Layers className="h-5 w-5 text-agri-600" />}
          action={
            <Badge variant={telemetry.isOnline ? "online" : "outline"}>
              {telemetry.isOnline ? "ESP32 Live" : "Calibrated Zone"}
            </Badge>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Main Monitored Block (Tied to ESP32 sensor) */}
          <div
            className={`rounded-2xl border-2 p-5 transition ${
              telemetry.moisture !== null && telemetry.moisture < telemetry.threshold
                ? "border-rose-300 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20"
                : "border-emerald-300 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Block A1: {profile.primaryCrop} (Monitored)
              </span>
              <Badge
                variant={
                  telemetry.moisture !== null && telemetry.moisture < telemetry.threshold
                    ? "critical"
                    : "normal"
                }
              >
                {telemetry.moisture !== null && telemetry.moisture < telemetry.threshold
                  ? t("status_dry")
                  : t("status_optimal")}
              </Badge>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-stone-900 dark:text-stone-50">
                {telemetry.moisture !== null ? `${telemetry.moisture}%` : "32%"}
              </span>
              <span className="text-xs text-stone-500">
                {telemetry.moisture !== null ? "live ESP32 moisture" : "PJTAU baseline moisture"}
              </span>
            </div>

            <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-200/80 pt-3 dark:border-stone-800">
              <div className="flex justify-between">
                <span>Crop & Variety:</span>
                <b className="text-stone-800 dark:text-stone-200">{profile.primaryCrop}</b>
              </div>
              <div className="flex justify-between">
                <span>Block Area:</span>
                <span>{profile.areaAcre} Acres</span>
              </div>
              <div className="flex justify-between">
                <span>Hardware Node:</span>
                <span>ESP32 Node A1 (GPIO 34)</span>
              </div>
            </div>

            <div className="mt-3 rounded-lg p-2 text-center text-xs font-semibold">
              {telemetry.moisture !== null && telemetry.moisture < telemetry.threshold ? (
                <span className="text-rose-700 dark:text-rose-300">
                  ⚠️ Needs Irrigation (Below {telemetry.threshold}% threshold)
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-300">
                  ✓ Moisture Adequate (Target: {telemetry.threshold}%)
                </span>
              )}
            </div>
          </div>

          {/* Block B: Secondary parcel */}
          <div className="rounded-2xl border-2 border-stone-200 bg-stone-50/60 p-5 dark:border-stone-800 dark:bg-stone-900/40">
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Block B: Field Margin
              </span>
              <Badge variant="outline">Unconnected Node</Badge>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-600 dark:text-stone-400">
                —%
              </span>
              <span className="text-xs text-stone-400">No probe assigned</span>
            </div>

            <div className="space-y-1 text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200/80 pt-3 dark:border-stone-800">
              <div className="flex justify-between">
                <span>Soil Type:</span>
                <span>{profile.soilType}</span>
              </div>
              <div className="flex justify-between">
                <span>Irrigation:</span>
                <span>{profile.irrigationType}</span>
              </div>
            </div>

            <div className="mt-3 rounded-lg p-2 text-center text-xs text-stone-500">
              Ready for secondary ESP32 wireless node.
            </div>
          </div>

          {/* Honest Flow Meter Status Card */}
          <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/40 p-5 dark:border-stone-800 dark:bg-stone-900/30">
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-amber-600" />
                <span>Water Metering</span>
              </span>
              <Badge variant="outline">No Flow Meter</Badge>
            </div>

            <div className="my-4">
              <span className="text-xl font-bold text-stone-700 dark:text-stone-300 block">
                Flow Sensor Uninstalled
              </span>
              <span className="text-xs text-stone-400">
                No physical pulse meter connected to ESP32
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed border-t border-stone-200/80 pt-3 dark:border-stone-800">
              Water delivered is estimated based on pump horsepower (~1,200 L/hr) rather than inline impeller telemetry.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Middle Section: Dynamic Crop Timeline & Real Weather Impact */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dynamic Crop Calendar from Real Sowing Date */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-agri-600" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {t("insights_crop_calendar")}
                </h3>
                <Badge variant="outline" className="text-[10px]">Indicative (PJTAU)</Badge>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {profile.primaryCrop} &bull; {daysElapsed} Days Elapsed ({progressPct}% of {customTotalDays}-day cycle)
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Sown on:</span>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="rounded-lg border border-stone-300 bg-stone-50 px-2 py-1 text-xs dark:border-stone-700 dark:bg-stone-800 font-medium"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              <span>Day {daysElapsed}</span>
              <span className="text-agri-700 dark:text-agri-400">Harvest Target: Day {customTotalDays}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-agri-600 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Stage Milestones */}
          <div className="mt-5 space-y-4">
            {cropConfig.stages.map((stage, idx) => {
              const isCompleted = daysElapsed > stage.endDay;
              const isCurrent = daysElapsed >= stage.startDay && daysElapsed <= stage.endDay;

              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? "bg-agri-700 text-white"
                          : isCurrent
                          ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950"
                          : "border border-stone-300 bg-stone-100 text-stone-500 dark:border-stone-700 dark:bg-stone-800"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    {idx < cropConfig.stages.length - 1 && (
                      <div className="h-full w-0.5 bg-stone-200 dark:bg-stone-800 my-1" />
                    )}
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-amber-800 dark:text-amber-300 text-sm"
                            : "text-stone-900 dark:text-stone-100"
                        }`}
                      >
                        {lang === "te" ? stage.nameTe : stage.nameEn} (Day {stage.startDay}–{stage.endDay})
                      </h4>
                      <Badge variant={isCompleted ? "normal" : isCurrent ? "warning" : "outline"}>
                        {isCompleted ? "Done" : isCurrent ? "Current Stage" : "Upcoming"}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {lang === "te" ? stage.adviceTe : stage.adviceEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Duration Customizer */}
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
            <span>PJTAU indicative package of practices</span>
            <div className="flex items-center gap-1.5">
              <span>Total duration:</span>
              <input
                type="number"
                min="60"
                max="240"
                value={customTotalDays}
                onChange={(e) => setCustomTotalDays(Number(e.target.value))}
                className="w-14 rounded border border-stone-300 p-0.5 text-center dark:border-stone-700 dark:bg-stone-800"
              />
              <span>days</span>
            </div>
          </div>
        </Card>

        {/* Real Open-Meteo Weather Impact & Water Plan */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={t("insights_weather_impact")}
              subtitle={`Open-Meteo 7-day live atmospheric forecast for ${profile.district}`}
              icon={<CloudRain className="h-5 w-5 text-sky-600" />}
              action={
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">
                  {weather?.lastUpdatedText || "Live Feed"}
                </span>
              }
            />

            {/* Smart Rain Skip Advisory Banner */}
            {rainOpportunity ? (
              <div className="rounded-2xl border border-sky-300 bg-sky-50/90 p-4 text-xs text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-100">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  <span>Rain-Skip Active: {rainOpportunity.dayNameEn} ({rainOpportunity.rainProbPct}% Rain)</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Atmospheric rain probability is {rainOpportunity.rainProbPct}% in {profile.district}.
                  Automated drip runs are suspended to prevent nitrogen leaching and conserve estimated ~1,200 Liters/acre.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <span>☀️ Clear Weather Forecast</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  No significant rainfall forecast in {profile.district} this week. Normal irrigation schedule active.
                </p>
              </div>
            )}

            {/* 5-Day Outlook List */}
            <div className="mt-4 space-y-2">
              {(weather?.dailyForecast || []).slice(0, 5).map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/60 p-2.5 text-xs dark:border-stone-800 dark:bg-stone-850"
                >
                  <span className="font-bold text-stone-800 dark:text-stone-200 w-24">
                    {lang === "te" ? f.dayNameTe : f.dayNameEn}
                  </span>
                  <span className="text-stone-500 flex-1 truncate text-xs">
                    {lang === "te" ? f.conditionTe : f.conditionEn}
                  </span>
                  <div className="flex items-center gap-3 shrink-0 font-medium">
                    <span>{f.highC}° / {f.lowC}°</span>
                    <span
                      className={`font-bold ${
                        f.rainProbPct >= 50
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-stone-400"
                      }`}
                    >
                      💧 {f.rainProbPct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Water Conservation Status Card (Honest Flow Meter Notice) */}
          <Card className="bg-gradient-to-br from-agri-50/80 to-stone-50 border-agri-200 dark:from-agri-950/30 dark:to-stone-900 dark:border-agri-900/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-agri-800 dark:text-agri-300">
                  {t("insights_water_saved_title")}
                </span>
                <p className="text-2xl font-black text-agri-900 dark:text-agri-100 mt-1">
                  Estimated via Rain-Skip
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  Calculated from weather rain-skip interlocks (~1,200 L/acre/cycle). Direct flow counter uninstalled.
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-agri-100 text-agri-700 dark:bg-agri-900/60 dark:text-agri-300 shrink-0">
                <Droplets className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Honest Data Compliance: "Coming Soon" Cards for Multi-Season R&D */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-stone-500" />
          <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
            {t("insights_coming_soon")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-dashed border-stone-300 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-200/60 text-stone-600 dark:bg-stone-800 dark:text-stone-400 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  {t("insights_yield_predictor")}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {t("insights_yield_desc")}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Status: Multi-season validation
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-dashed border-stone-300 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-200/60 text-stone-600 dark:bg-stone-800 dark:text-stone-400 shrink-0">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  {t("insights_carbon_credits")}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {t("insights_carbon_desc")}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Status: Awaiting audit framework
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
