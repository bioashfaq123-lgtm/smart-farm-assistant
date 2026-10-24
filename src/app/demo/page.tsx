"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Presentation,
  ShieldCheck,
  Wifi,
  WifiOff,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Layers,
  Droplets,
  CloudRain,
  Sun,
  Activity,
  Sliders,
  Power,
  Microscope,
  Volume2,
  TrendingUp,
  Calculator,
  Share2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/components/common/LanguageContext";
import {
  SAMPLE_PROFILE,
  SAMPLE_WEATHER,
  SAMPLE_MANDI_ITEMS,
} from "@/lib/data/sampleData";
import { calculateFertilizer } from "@/lib/calculators/fertCalc";

// 7 Conference Stages
const STAGES = [
  { id: 1, nameEn: "Farmer Profile", nameTe: "రైతు ప్రొఫైల్", icon: User },
  { id: 2, nameEn: "Weather & Rain-Skip", nameTe: "వాతావరణం & రెయిన్-స్కిప్", icon: CloudRain },
  { id: 3, nameEn: "IoT Soil & Pump", nameTe: "ESP32 నేల తేమ & పంపు", icon: Activity },
  { id: 4, nameEn: "AI Disease Doctor", nameTe: "AI పంట వైద్యుడు", icon: Microscope },
  { id: 5, nameEn: "Mandi Rates & MSP", nameTe: "మార్కెట్ ధరలు & ₹500 బోనస్", icon: TrendingUp },
  { id: 6, nameEn: "PJTAU Fertilizer", nameTe: "PJTAU ఎరువుల లెక్క", icon: Calculator },
  { id: 7, nameEn: "Rythu WhatsApp Share", nameTe: "వాట్సాప్ రైతు షేర్", icon: Share2 },
];

export default function ConferenceDemoPage() {
  const { lang, setLang } = useLanguage();

  // Core Demo States
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [activeStage, setActiveStage] = useState<number>(1);
  const [viewAll, setViewAll] = useState<boolean>(false);

  // Stage 1: Farmer Profile (Mallesham Goud)
  const [farmer, setFarmer] = useState({
    name: "Mallesham Goud",
    nameTe: "మల్లేశం గౌడ్",
    village: "Mallapur",
    villageTe: "మల్లాపూర్",
    mandal: "Dharmapuri",
    mandalTe: "ధర్మపురి",
    district: "Jagtial",
    districtTe: "జగిత్యాల",
    acres: 4.5,
    crop: "Paddy (RNR 15048 / Telangana Sona)",
    cropTe: "వరి (RNR 15048 / తెలంగాణ సోనా)",
    soil: "Red Sandy Loam (చల్కా నేలలు)",
    sowingDays: 101,
    phone: "+91 98480 12345",
    rythuId: "TG-JAG-2026-0842",
  });
  const [isEditingFarmer, setIsEditingFarmer] = useState(false);

  // Stage 2: Weather & Rain Simulation
  const [isRaining, setIsRaining] = useState(false);

  // Stage 3: ESP32 IoT Soil & Pump
  const [soilMoisture, setSoilMoisture] = useState<number>(17.4);
  const [pumpStatus, setPumpStatus] = useState<"ON" | "OFF" | "AUTO">("ON");
  const [pumpSecondsLeft, setPumpSecondsLeft] = useState<number>(274); // 4m 34s
  const [autoControlEnabled, setAutoControlEnabled] = useState<boolean>(true);

  // Stage 4: AI Disease Scanner
  const [selectedDisease, setSelectedDisease] = useState<"paddy_blast" | "cotton_curl">("paddy_blast");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Stage 5: Mandi MSP Calculator
  const [yieldQuintals, setYieldQuintals] = useState<number>(110); // for 4.5 acres

  // Stage 7: WhatsApp Share copied state
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Moisture history chart data
  const [moistureHistory, setMoistureHistory] = useState([
    { time: "06:00", moisture: 14.2 },
    { time: "08:00", moisture: 15.1 },
    { time: "10:00", moisture: 16.3 },
    { time: "12:00", moisture: 16.8 },
    { time: "14:00", moisture: 17.1 },
    { time: "Now", moisture: soilMoisture },
  ]);

  // Keep moisture history updated
  useEffect(() => {
    setMoistureHistory((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { time: "Now", moisture: soilMoisture };
      return copy;
    });

    // Automatic Irrigation Threshold Logic
    if (autoControlEnabled) {
      if (isRaining) {
        setPumpStatus("OFF");
      } else if (soilMoisture < 20.0) {
        setPumpStatus("ON");
      } else if (soilMoisture > 32.0) {
        setPumpStatus("OFF");
      }
    }
  }, [soilMoisture, isRaining, autoControlEnabled]);

  // Pump countdown timer when ON
  useEffect(() => {
    let interval: any;
    if (pumpStatus === "ON") {
      interval = setInterval(() => {
        setPumpSecondsLeft((prev) => {
          if (prev <= 1) {
            setPumpStatus("OFF");
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPumpSecondsLeft(300);
    }
    return () => clearInterval(interval);
  }, [pumpStatus]);

  // Keyboard Navigation for Presenter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "n" || e.key === "N") {
        setActiveStage((prev) => Math.min(STAGES.length, prev + 1));
      } else if (e.key === "ArrowLeft" || e.key === "p" || e.key === "P") {
        setActiveStage((prev) => Math.max(1, prev - 1));
      } else if (e.key === "d" || e.key === "D") {
        setMode((prev) => (prev === "demo" ? "live" : "demo"));
      } else if (e.key === "r" || e.key === "R") {
        resetDemo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resetDemo = () => {
    setFarmer({
      name: "Mallesham Goud",
      nameTe: "మల్లేశం గౌడ్",
      village: "Mallapur",
      villageTe: "మల్లాపూర్",
      mandal: "Dharmapuri",
      mandalTe: "ధర్మపురి",
      district: "Jagtial",
      districtTe: "జగిత్యాల",
      acres: 4.5,
      crop: "Paddy (RNR 15048 / Telangana Sona)",
      cropTe: "వరి (RNR 15048 / తెలంగాణ సోనా)",
      soil: "Red Sandy Loam (చల్కా నేలలు)",
      sowingDays: 101,
      phone: "+91 98480 12345",
      rythuId: "TG-JAG-2026-0842",
    });
    setSoilMoisture(17.4);
    setIsRaining(false);
    setPumpStatus("ON");
    setAutoControlEnabled(true);
    setSelectedDisease("paddy_blast");
    setYieldQuintals(110);
    setActiveStage(1);
  };

  const handleTeluguAudio = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "te-IN";
    utter.rate = 0.95;
    utter.onend = () => setIsPlayingAudio(false);
    utter.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utter);
  };

  // Fertilizer calculation for Mallesham Goud's 4.5 acres
  const fert = calculateFertilizer({
    crop: "Paddy",
    area: farmer.acres,
    unit: "acre",
  });

  // Mandi MSP calculations
  const centralMsp = 2320;
  const tsBonus = 500;
  const totalRatePerQ = centralMsp + tsBonus; // 2820
  const totalPayout = yieldQuintals * totalRatePerQ;
  const bonusPayout = yieldQuintals * tsBonus;

  // WhatsApp formatted message
  const whatsappText = `🌾 *Smart Farm Assistant — Rythu Advisory* 🌾\n👤 రైతు: ${farmer.nameTe} (${farmer.villageTe}, ${farmer.districtTe})\n🌱 పంట: ${farmer.cropTe} (${farmer.acres} ఎకరాలు)\n💧 నేల తేమ: ${soilMoisture.toFixed(1)}% (${soilMoisture < 20 ? "పంపు నడుస్తోంది" : "తేమ సరిపడా ఉంది"})\n🌧️ వాతావరణం: ${isRaining ? "భారీ వర్షం హెచ్చరిక - నీటిపారుదల నిలిపివేయబడింది" : "అనుకూలం"}\n💰 జగిత్యాల మార్కెట్ MSP రేటు: ₹${totalRatePerQ}/క్వింటాల్ (కేంద్ర MSP ₹${centralMsp} + తెలంగాణ బోనస్ ₹${tsBonus})\n🌐 పోర్టల్: https://smartfarming-web.vercel.app`;

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(whatsappText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-20">
      {/* -------------------------------------------------------- */}
      {/* Top Conference Command Bar */}
      {/* -------------------------------------------------------- */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-xs px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Title & Conference Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-500/20">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  Conference Live Demo
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60">
                  ADSAUF-2047 PJTAU
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Full-Lifecycle Farmer Journey: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{farmer.name} ({farmer.district})</span>
              </p>
            </div>
          </div>

          {/* Center / Right: Dual-Mode Switcher & Presenter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dual Mode Switcher */}
            <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 p-1">
              <button
                onClick={() => setMode("demo")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  mode === "demo"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
                }`}
                title="Pre-cached conference datasets with zero latency"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pre-Cached Demo (Fail-Safe)</span>
              </button>
              <button
                onClick={() => setMode("live")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  mode === "live"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900"
                }`}
                title="Live hardware & API telemetry"
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>Live Cloud Sync</span>
              </button>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition"
              title="Toggle Telugu / English language"
            >
              {lang === "en" ? "తెలుగు UI" : "English UI"}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetDemo}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition flex items-center gap-1"
              title="Reset all values to Mallesham Goud defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* Fail-Safe Guard Banner */}
      {/* -------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-2xl p-4 shadow-sm border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center shrink-0 border border-emerald-400/40">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Zero Glitch Conference Guard
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {mode === "demo"
                  ? "Operating in Pre-Cached Stage Mode. All agronomy formulas, Mandi prices, and AI leaf diagnostics are cached locally for 100% offline reliability."
                  : "Live Mode Enabled. Attempting real-time synchronization with Jagtial ESP32 Soil Kit and APMC Agmarknet servers."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-emerald-200/80 bg-white/10 px-2.5 py-1 rounded-lg font-mono">
              Shortcuts: [← / →] Navigate • [D] Dual-Mode • [R] Reset
            </span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* 7-Stage Interactive Stepper */}
      {/* -------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-3 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STAGES.map((s) => {
              const Icon = s.icon;
              const isActive = activeStage === s.id;
              const isPast = activeStage > s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStage(s.id);
                    setViewAll(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? "bg-agri-700 text-white shadow-sm"
                      : isPast
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                      : "bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-agri-800"
                        : isPast
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span>{lang === "te" ? s.nameTe : s.nameEn}</span>
                </button>
              );
            })}

            {/* Toggle View All */}
            <button
              onClick={() => setViewAll(!viewAll)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                viewAll
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
              }`}
            >
              {viewAll ? "Single Stage View" : "View All Stages"}
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* Main Content Area */}
      {/* -------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        {/* ======================================================== */}
        {/* STAGE 1: Farmer Profile Creation (Mallesham Goud) */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 1) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-agri-100 text-agri-800 dark:bg-agri-950 dark:text-agri-300 font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    {lang === "te" ? "స్టేజ్ 1: రైతు ప్రొఫైల్ & వివరాలు" : "Stage 1: Verified Farmer Onboarding Profile"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Mallesham Goud • Mallapur, Dharmapuri, Jagtial District
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingFarmer(!isEditingFarmer)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-agri-600" />
                  {isEditingFarmer ? "Close Editor" : "Edit Details Live"}
                </button>
              </div>
            </div>

            {/* Live Profile Editor (if toggled) */}
            {isEditingFarmer && (
              <div className="mb-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-3">
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  Interactive Profile Customizer (Demonstrate real-time adaptation):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-stone-500 block mb-1">Farmer Name:</label>
                    <input
                      type="text"
                      value={farmer.name}
                      onChange={(e) => setFarmer({ ...farmer, name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-stone-500 block mb-1">Land Area (Acres):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={farmer.acres}
                      onChange={(e) => setFarmer({ ...farmer, acres: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-stone-500 block mb-1">Village & District:</label>
                    <input
                      type="text"
                      value={`${farmer.village}, ${farmer.district}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(",");
                        setFarmer({
                          ...farmer,
                          village: parts[0]?.trim() || farmer.village,
                          district: parts[1]?.trim() || farmer.district,
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Farmer Card Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Avatar & Contact */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-agri-50 to-stone-50 dark:from-agri-950/40 dark:to-stone-900 border border-agri-200/60 dark:border-agri-800/40 flex flex-col justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-agri-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                    MG
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">
                      {farmer.name}
                    </h3>
                    <p className="text-xs font-semibold text-agri-700 dark:text-agri-400">
                      {farmer.nameTe}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-agri-200/70 text-agri-900 dark:bg-agri-900/60 dark:text-agri-200">
                      ID: {farmer.rythuId}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-agri-200/50 dark:border-agri-800/40 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{farmer.village}, {farmer.mandal}, {farmer.district} (Telangana)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{farmer.phone} (WhatsApp Registered)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Rythu Bandhu & Rythu Bima Verified</span>
                  </div>
                </div>
              </div>

              {/* Agronomic Profile & Land Specifics */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block mb-1">Land Holding</span>
                  <span className="text-lg font-extrabold text-stone-900 dark:text-white">
                    {farmer.acres} Acres
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    18 Guntas (సొంత భూమి)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block mb-1">Primary Crop</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white truncate block">
                    Paddy (RNR 15048)
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    తెలంగాణ సోనా (Super Fine)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block mb-1">Soil Classification</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">
                    Red Sandy Loam
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    చల్కా నేలలు (pH 6.8 Optimal)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block mb-1">Irrigation System</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">
                    Drip + ESP32 Pump
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    Borewell 5HP Solar Unit
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block mb-1">Crop Stage</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">
                    Day {farmer.sowingDays}
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    Panicle Initiation (వెన్ను దశ)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block mb-1">IoT Telemetry Node</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Node 01 Online
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    ESP32 + Capacitive Soil v2
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: Hyperlocal Weather & Rain-Skip Automation */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 2) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? "స్టేజ్ 2: వాతావరణం & ఆటోమేటిక్ రెయిన్-స్కిప్" : "Stage 2: Hyperlocal Weather & Automated Rain-Skip Advisory"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Jagtial IMD Radar Grid • Precipitation Forecast & Irrigation Suspension
                  </p>
                </div>
              </div>

              {/* Rain Simulation Trigger Button */}
              <button
                onClick={() => setIsRaining(!isRaining)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
                  isRaining
                    ? "bg-blue-600 text-white hover:bg-blue-700 animate-pulse"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                }`}
              >
                <CloudRain className="w-4 h-4" />
                <span>{isRaining ? "Simulating Heavy Rain (Active)" : "Simulate 15mm Rainfall Event"}</span>
              </button>
            </div>

            {/* Rain-Skip Active Alert Banner */}
            {isRaining ? (
              <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 flex items-start gap-3">
                <CloudRain className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    🌧️ Rain-Skip Activated: ESP32 Irrigation Automatically Suspended!
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                    Heavy shower predicted (15mm, 85% probability). The Smart Farm Assistant automatically sent an MQTT override command to Mallesham Goud&apos;s ESP32 unit to turn the pump <strong>OFF</strong>. Saved <strong>4,200 Litres</strong> of ground water and prevented root rot (వేరుకుళ్లు).
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  Clear Sky Forecast. Standard automated soil moisture threshold protocol is active.
                </span>
                <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">
                  Next rain window: 4 days away
                </span>
              </div>
            )}

            {/* 5-Day Forecast Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SAMPLE_WEATHER.forecast5Day.map((day, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border text-center transition ${
                    i === 0 && isRaining
                      ? "bg-blue-100/70 border-blue-400 text-blue-950 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-200"
                      : "bg-stone-50 dark:bg-stone-800/60 border-stone-200/60 dark:border-stone-700/60"
                  }`}
                >
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                    {lang === "te" ? day.dayTe : day.dayEn}
                  </span>
                  <div className="my-2 flex justify-center">
                    {i === 0 && isRaining ? (
                      <CloudRain className="w-6 h-6 text-blue-600 animate-bounce" />
                    ) : day.rainChance > 50 ? (
                      <CloudRain className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Sun className="w-6 h-6 text-amber-500" />
                    )}
                  </div>
                  <span className="text-base font-extrabold block text-stone-900 dark:text-white">
                    {day.temp}°C
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1 block">
                    {i === 0 && isRaining ? "85% Rain" : `${day.rainChance}% Rain`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: ESP32 IoT Soil Moisture & Solar Pump Unit */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 3) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? "స్టేజ్ 3: ESP32 నేల తేమ & పంపు కంట్రోల్" : "Stage 3: ESP32 IoT Soil Moisture & Solar Pump Automation"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Capacitive Soil Sensor v2 • 5HP Solar Pump Relay • 5-Minute Safety Dry-Run Limit
                  </p>
                </div>
              </div>

              {/* Pump Toggle Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAutoControlEnabled(false);
                    setPumpStatus(pumpStatus === "ON" ? "OFF" : "ON");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
                    pumpStatus === "ON"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{pumpStatus === "ON" ? "Pump PUMPING (ON)" : "Pump STOPPED (OFF)"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Moisture Gauge & Slider Controller */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-500">
                      Real-Time Soil Moisture Gauge
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        soilMoisture < 20
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          : soilMoisture > 32
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {soilMoisture < 20 ? "DRY (నీరు అవసరం)" : soilMoisture > 32 ? "WET (సంతృప్త)" : "OPTIMAL (అనుకూలం)"}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 my-3">
                    <span className="text-4xl font-extrabold text-stone-900 dark:text-white">
                      {soilMoisture.toFixed(1)}%
                    </span>
                    <span className="text-xs text-stone-400">Volumetric Water Content (VWC)</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-3 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(100, soilMoisture * 2)}%` }}
                      className={`h-full transition-all duration-300 ${
                        soilMoisture < 20
                          ? "bg-red-500"
                          : soilMoisture > 32
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>0% (Parched)</span>
                    <span className="font-semibold text-emerald-600">Threshold: 20%</span>
                    <span>50% (Saturated)</span>
                  </div>

                  {/* Interactive Slider */}
                  <div className="mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-700/60">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                        Simulate Soil Moisture Level:
                      </span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {soilMoisture.toFixed(1)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="45"
                      step="0.5"
                      value={soilMoisture}
                      onChange={(e) => setSoilMoisture(parseFloat(e.target.value))}
                      className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Drag below 20% to watch the pump trigger automatically!
                    </p>
                  </div>
                </div>

                {/* 5-Minute Countdown Safety Box */}
                <div className="mt-4 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      Pump Run Timer:
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.floor(pumpSecondsLeft / 60)}m {pumpSecondsLeft % 60}s remaining
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Hardware protection: Automatic relay cut-off after 5 mins to prevent borewell dry running.
                  </p>
                </div>
              </div>

              {/* Live Telemetry History Chart (2 columns) */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        24-Hour Soil Moisture Trend Line
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        ESP32 Analog Pin 34 • Capacitive Reading Stream
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Live Stream Active
                    </span>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={moistureHistory} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                        <YAxis domain={[10, 30]} stroke="#9ca3af" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                            borderRadius: "0.75rem",
                            color: "#fff",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="moisture"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fill="url(#moistGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-500">
                  <span>ESP32 Wi-Fi Signal: -62 dBm</span>
                  <span>Battery: 88% (Solar Charging)</span>
                  <span>Firmware: v2.4.1 ADSAUF</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 4: AI Crop Pathology Diagnostic (AI Doctor) */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 4) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold flex items-center justify-center text-sm">
                  4
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? "స్టేజ్ 4: AI పంట వైద్యుడు & వ్యాధి నిర్ధారణ" : "Stage 4: AI Crop Pathology Diagnostic (Computer Vision)"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Google Gemini 1.5/Flash Vision • PJTAU Scientific Remedies • Telugu Audio Synthesis
                  </p>
                </div>
              </div>

              {/* Sample Disease Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDisease("paddy_blast")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedDisease === "paddy_blast"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  Paddy Blast (వరి అగ్గి తెగులు)
                </button>
                <button
                  onClick={() => setSelectedDisease("cotton_curl")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedDisease === "cotton_curl"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  Cotton Leaf Curl (పత్తి ఆకుముడత)
                </button>
              </div>
            </div>

            {/* Diagnostic Result Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Leaf Visual & Diagnostic Match */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-2">
                    Scanned Leaf Sample
                  </span>
                  <div className="w-full h-36 rounded-xl bg-gradient-to-br from-green-800 to-stone-900 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                    <span>{selectedDisease === "paddy_blast" ? "🌾" : "🌱"}</span>
                    <div className="absolute inset-0 bg-stone-900/30 flex items-end p-2.5">
                      <span className="px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                        Camera Scan #0492
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        AI Confidence Score:
                      </span>
                      <span className="font-bold text-emerald-600">94.8% Match</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-emerald-500 h-full w-[94.8%]" />
                    </div>
                  </div>
                </div>

                {/* Audio Button */}
                <button
                  onClick={() =>
                    handleTeluguAudio(
                      selectedDisease === "paddy_blast"
                        ? "రైతు సోదరులారా, మీ వరి పంటలో అగ్గి తెగులు లక్షణాలు కనిపించాయి. ట్రైసైక్లాజోల్ డెబ్భై అయిదు శాతం మందును లీటరు నీటికి సున్నా బిందువు ఆరు గ్రాములు కలిపి పిచికారీ చేయండి."
                        : "రైతు సోదరులారా, పత్తిలో ఆకుముడత వైరస్ గమనించబడింది. వేపనూనె లేదా ఇమిడాక్లోప్రిడ్ తో పిచికారీ చేయండి."
                    )
                  }
                  className="mt-4 w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? "Playing Telugu Advice..." : "తెలుగులో వినండి (Telugu Audio)"}</span>
                </button>
              </div>

              {/* Diagnosis Details & Dual-Treatment Protocols */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-stone-500">Identified Pathogen:</span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {selectedDisease === "paddy_blast"
                      ? "Paddy Leaf Blast (వరి అగ్గి తెగులు / Pyricularia oryzae)"
                      : "Cotton Leaf Curl Virus (పత్తి ఆకుముడత తెగులు)"}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    {selectedDisease === "paddy_blast"
                      ? "Spindle-shaped elliptical lesions with greyish center and brownish margins observed on leaves. Panicle blast risk high during humid morning conditions."
                      : "Upward leaf curling, thickening of veins, and enation under leaf blades caused by whitefly vector (Bemisia tabaci)."}
                  </p>
                </div>

                {/* Treatment Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Organic Treatment */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                      🌱 Organic / Eco-Friendly Protocol
                    </span>
                    <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1 list-disc pl-4">
                      <li>Spray 5% Neem Seed Kernel Extract (NSKE).</li>
                      <li>10,000 ppm Cold-pressed Neem Oil @ 3 ml per Litre.</li>
                      <li>Avoid excess Urea split application during humid weeks.</li>
                    </ul>
                  </div>

                  {/* Chemical Treatment */}
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                    <span className="text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5 mb-1.5">
                      🧪 PJTAU Recommended Chemical Dosage
                    </span>
                    <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1 list-disc pl-4">
                      <li><strong>Tricyclazole 75% WP</strong> @ 0.6 g / Litre of water.</li>
                      <li>Alternative: <strong>Isoprothiolane 40% EC</strong> @ 1.5 ml / Litre.</li>
                      <li>Spray during evening hours (4:00 PM – 6:00 PM).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 5: Live Telangana APMC Mandi Rates & ₹500 Bonus */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 5) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                  5
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? "స్టేజ్ 5: మార్కెట్ ధరలు & ₹500 రైతు బోనస్" : "Stage 5: Live APMC Mandi Rates, MSP & Telangana ₹500 Rythu Bonus"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Jagtial & Karimnagar APMC Hub • Central MSP ₹2,320 + Telangana State Bonus ₹500
                  </p>
                </div>
              </div>

              {/* Verified Badge */}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Agmarknet Verified Feed
              </span>
            </div>

            {/* Mandi Cards & Net Payout Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Paddy Grade-A Rate Highlight */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-stone-50 dark:from-emerald-950/40 dark:to-stone-900 border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Jagtial APMC Yard (జగిత్యాల మార్కెట్)
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Paddy Grade-A (వరి గ్రేడ్-ఎ)
                  </h3>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-200/50 dark:border-stone-800">
                      <span className="text-stone-500">Central Government MSP:</span>
                      <span className="font-semibold text-stone-900 dark:text-white">₹{centralMsp} / Q</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/50 dark:border-stone-800 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <span>Telangana Fine Rice Bonus:</span>
                      <span>+₹{tsBonus} / Q</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold text-sm text-stone-900 dark:text-white">
                      <span>Net Farmer Price:</span>
                      <span className="text-emerald-600 text-base">₹{totalRatePerQ} / Quintal</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-stone-500">
                  Daily Arrivals: 1,420 Quintals • Demand: High
                </div>
              </div>

              {/* Mallesham Goud Expected Farm Income Calculator (2 columns) */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-600" />
                      Mallesham Goud Revenue Projection (4.5 Acres)
                    </h4>
                    <span className="text-xs text-stone-400">Harvest: Nov 2026</span>
                  </div>

                  {/* Yield slider */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-600 dark:text-stone-400">Estimated Total Harvest:</span>
                      <span className="font-bold text-stone-900 dark:text-white font-mono">
                        {yieldQuintals} Quintals (~24.4 Q/acre)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="160"
                      step="5"
                      value={yieldQuintals}
                      onChange={(e) => setYieldQuintals(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* Revenue Outcome Banner */}
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] text-stone-400 block mb-1">Total Gross Realization</span>
                      <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
                        ₹{totalPayout.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        {yieldQuintals} Q × ₹2,820/Q
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block mb-1 font-semibold">
                        Telangana ₹500 Bonus Extra
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                        +₹{bonusPayout.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-500 block mt-0.5 font-medium">
                        Pure profit addition to farmer pocket
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Procurement Center: Mallapur IKP Center (2.5 km away)</span>
                  <span className="text-emerald-600 font-semibold">Direct DBT to Bank Account</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 6: PJTAU Fertilizer & Seed Calculator */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 6) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                  6
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? "స్టేజ్ 6: PJTAU సిఫార్సు చేసిన ఎరువుల లెక్క" : "Stage 6: PJTAU Package of Practices Fertilizer Dosage"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Scientific N-P-K recommendation calibrated for Mallesham Goud&apos;s 4.5 Acres of Paddy
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200/80">
                120:60:40 kg/ha Standard Ratio
              </span>
            </div>

            {/* Bag Requirements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-xs font-semibold text-stone-500 block mb-1">
                  Urea Requirement (యూరియా)
                </span>
                <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {fert.ureaBags} Bags
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  50kg bags (~{fert.nReqKg.toFixed(1)} kg pure Nitrogen)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-xs font-semibold text-stone-500 block mb-1">
                  DAP Requirement (డి.ఎ.పి)
                </span>
                <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {fert.dapBags} Bags
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  50kg bags (~{fert.pReqKg.toFixed(1)} kg pure P2O5)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-xs font-semibold text-stone-500 block mb-1">
                  MOP Potash (పొటాష్)
                </span>
                <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {fert.mopBags} Bags
                </span>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  50kg bags (~{fert.kReqKg.toFixed(1)} kg pure K2O)
                </span>
              </div>
            </div>

            {/* Split Schedule Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Growth Stage</th>
                    <th className="py-2.5 px-3">Urea Share</th>
                    <th className="py-2.5 px-3">DAP Share</th>
                    <th className="py-2.5 px-3">MOP Share</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Application Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {fert.splits.map((s, i) => (
                    <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="py-2.5 px-3 font-semibold text-stone-800 dark:text-stone-200">
                        {lang === "te" ? s.stageTe : s.stageEn}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{s.ureaPct}%</td>
                      <td className="py-2.5 px-3 font-mono">{s.dapPct}%</td>
                      <td className="py-2.5 px-3 font-mono">{s.mopPct}%</td>
                      <td className="py-2.5 px-3 text-stone-500">{lang === "te" ? s.notesTe : s.notesEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 7: Rythu Community & WhatsApp Share Engine */}
        {/* ======================================================== */}
        {(viewAll || activeStage === 7) && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 font-bold flex items-center justify-center text-sm">
                  7
                </span>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? "స్టేజ్ 7: రైతు సమాజం & వాట్సాప్ షేరింగ్" : "Stage 7: Rythu Community Hub & WhatsApp Share Engine"}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    1-Click Verified Agronomic WhatsApp Dispatch for Village Farmer Groups
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-1.5 transition"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Preview Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 font-mono text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {whatsappText}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
              <span>Ready for real-time demonstration during Q&A panel at ADSAUF-2047.</span>
              <span className="text-emerald-600 font-semibold">Zero SMS costs • Direct WhatsApp integration</span>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------- */}
        {/* Bottom Presenter Stepper Controls */}
        {/* -------------------------------------------------------- */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={() => {
              setActiveStage((prev) => Math.max(1, prev - 1));
              setViewAll(false);
            }}
            disabled={activeStage === 1 && !viewAll}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          <span className="text-xs font-semibold text-stone-500 font-mono">
            Stage {activeStage} of {STAGES.length}
          </span>

          <button
            onClick={() => {
              if (activeStage < STAGES.length) {
                setActiveStage((prev) => prev + 1);
                setViewAll(false);
              }
            }}
            disabled={activeStage === STAGES.length && !viewAll}
            className="px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-sm disabled:opacity-40 transition flex items-center gap-1.5"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
