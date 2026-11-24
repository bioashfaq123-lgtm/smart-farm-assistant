"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Mic,
  MicOff,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Share2,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Info,
  Bug,
  Leaf,
  Sprout,
  Droplets,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPestMessage, generateWhatsAppUrl } from "@/lib/utils/kisanShare";
import { PlantDoctorResponse } from "@/app/api/diagnose/route";

const CROP_OPTIONS = [
  { value: "Paddy", labelEn: "Paddy / Rice (వరి)", labelTe: "వరి (Paddy)" },
  { value: "Cotton", labelEn: "Cotton (పత్తి)", labelTe: "పత్తి (Cotton)" },
  { value: "Chilli", labelEn: "Red Chilli (మిరప)", labelTe: "మిరప (Chilli)" },
  { value: "Maize", labelEn: "Maize (మొక్కజొన్న)", labelTe: "మొక్కజొన్న (Maize)" },
  { value: "Redgram", labelEn: "Redgram (కంది)", labelTe: "కంది (Redgram)" },
  { value: "Groundnut", labelEn: "Groundnut (వేరుశెనగ)", labelTe: "వేరుశెనగ (Groundnut)" },
  { value: "Turmeric", labelEn: "Turmeric (పసుపు)", labelTe: "పసుపు (Turmeric)" },
  { value: "Tomato", labelEn: "Tomato (టమాటా)", labelTe: "టమాటా (Tomato)" },
];

const GROWTH_STAGES = [
  { value: "Nursery", labelEn: "Nursery / Seedling (నారుమడి దశ)", labelTe: "నారుమడి దశ" },
  { value: "Active Tillering / Branching", labelEn: "Tillering / Branching (పిలకల / శాఖీయ దశ)", labelTe: "పిలకల / శాఖీయ దశ" },
  { value: "Square / Boot Leaf", labelEn: "Square / Boot Leaf (మొగ్గ / చిరుపొట్ట దశ)", labelTe: "మొగ్గ / చిరుపొట్ట దశ" },
  { value: "Flowering & Fruit Set", labelEn: "Flowering (పూత దశ)", labelTe: "పూత దశ" },
  { value: "Grain / Boll Development", labelEn: "Boll / Grain Filling (గింజ / కాయ అభివృద్ధి)", labelTe: "గింజ / కాయ అభివృద్ధి" },
  { value: "Pre-Harvest", labelEn: "Maturity / Ripening (కోతకు ముందు)", labelTe: "కోతకు ముందు" },
];

const PRESET_CHIPS: Record<string, Array<{ en: string; te: string }>> = {
  Paddy: [
    { en: "Spindle lesions with ash center (Blast / అగ్గితెగులు)", te: "ఆకులపై బూడిద కేంద్రంతో కదురు ఆకారపు మచ్చలు (అగ్గితెగులు)" },
    { en: "Dead hearts in tillers & white ears (Stem Borer)", te: "మొవ్వు కుళ్ళు మరియు తెల్ల కంకులు (కాండం తొలిచే పురుగు)" },
    { en: "Circular hopper-burn patches at plant base (BPH)", te: "చేనులో సుడిదోమ వల్ల ఎండిపోయిన గుండ్రని మచ్చలు (సుడిదోమ)" },
    { en: "Wavy straw-yellow leaf drying from margins (BLB)", te: "ఆకు అంచుల వెంబడి అలల వలె ఎండిపోవడం (బాక్టీరియా ఎండు తెగులు)" },
    { en: "Snake-skin spots on leaf sheaths near water line", te: "నీటి మట్టం వద్ద తొడుగులపై పాము చర్మం లాంటి పొడ మచ్చలు" },
    { en: "Rusty bronze spots on leaves (Zinc deficiency)", te: "ఆకులపై ఇటుక రంగు తుప్పు మచ్చలు (జింక్ లోపం / ఖైరా)" },
    { en: "Annual grasses and sedges weed control", te: "వరి నాటులో గడ్డి మరియు తుంగ కలుపు నివారణ" },
  ],
  Cotton: [
    { en: "Rosetted flowers & boll holes (Pink Bollworm)", te: "రోసెట్ పువ్వులు మరియు కాయల్లో పురుగులు (గులాబీ రంగు పురుగు)" },
    { en: "Upward leaf curling & yellowing (Jassids / Whitefly)", te: "ఆకులు పైకి ముడుచుకోవడం మరియు పచ్చదోమ/తెల్లదోమ" },
    { en: "Square shedding & boll dropping", te: "పత్తిలో పూత, పిందె, మొగ్గ రాలిపోవడం" },
    { en: "Angular water-soaked leaf spots (Black arm)", te: "ఆకులపై కోణీయ మచ్చలు (నల్ల కాండం తెగులు)" },
  ],
  Chilli: [
    { en: "Upward boat-shaped leaf cupping (Thrips / పైముడత)", te: "ఆకులు పైకి దోనెలా ముడుచుకోవడం (తామర పురుగులు / పైముడత)" },
    { en: "Downward inverted leaf curl (Mites / కిందిముడత)", te: "ఆకులు కిందికి బోర్లించిన పడవలా ముడుచుకోవడం (పచ్చ నల్లి / కిందిముడత)" },
    { en: "Twig drying from tips downward (Dieback / Colletotrichum)", te: "కొమ్మల పైనుండి కిందికి ఎండుకుపోవడం (కొమ్మ ఎండు తెగులు)" },
    { en: "Circular sunken spots on ripe chillies (Fruit Rot)", te: "పండిన కాయలపై నల్లటి గుండ్రని కుళ్ళు మచ్చలు (కాయ కుళ్ళు)" },
  ],
  Maize: [
    { en: "Ragged holes in whorls with sawdust frass (Fall Armyworm)", te: "సుడులలో రంపపు పొట్టు లాంటి మలం & ఆకులకు రంధ్రాలు (కత్తెర పురుగు)" },
    { en: "Yellowing of knee-high plants", te: "మోకాలి లోతు మొక్కల్లో ఆకులు పసుపుబారడం" },
  ],
};

export default function DiagnosisPage() {
  const { lang } = useLanguage();
  const { profile } = useFarmerProfile();

  // Form Inputs
  const [selectedCrop, setSelectedCrop] = useState<string>(profile.primaryCrop || "Paddy");
  const [symptomText, setSymptomText] = useState<string>("");
  const [knownDisease, setKnownDisease] = useState<string>("");
  const [knownPest, setKnownPest] = useState<string>("");
  const [weedProblem, setWeedProblem] = useState<string>("");
  const [cropAgeDays, setCropAgeDays] = useState<string>("");
  const [growthStage, setGrowthStage] = useState<string>("Active Tillering / Branching");
  const [district, setDistrict] = useState<string>(profile.district || "Jagtial");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // States
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [result, setResult] = useState<PlantDoctorResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCitations, setShowCitations] = useState<boolean>(false);

  // Sync with farmer profile crop on mount
  useEffect(() => {
    if (profile.primaryCrop) {
      const match = CROP_OPTIONS.find((c) => c.value.toLowerCase() === profile.primaryCrop.toLowerCase());
      if (match) setSelectedCrop(match.value);
    }
  }, [profile.primaryCrop]);

  // Voice Input (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setErrorMessage(
        lang === "te"
          ? "మీ బ్రౌజర్ లో వాయిస్ ఇన్పుట్ అందుబాటులో లేదు. దయచేసి లక్షణాలను టైప్ చేయండి."
          : "Speech recognition is not supported in this browser. Please type your symptoms."
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = lang === "te" ? "te-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage("");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSymptomText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    if (symptomText.includes(chipText)) return;
    setSymptomText((prev) => (prev ? `${prev}, ${chipText}` : chipText));
  };

  // Run Crop Protection Advisory
  const handleDiagnose = async () => {
    if (!symptomText.trim() && !knownDisease.trim() && !knownPest.trim() && !weedProblem.trim()) {
      setErrorMessage(
        lang === "te"
          ? "దయచేసి పంట లక్షణాలు లేదా సమస్యను వివరించండి."
          : "Please describe the symptoms or select a known problem to begin advisory."
      );
      return;
    }

    setErrorMessage("");
    setIsDiagnosing(true);
    setResult(null);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: selectedCrop,
          symptoms: symptomText,
          knownDisease: knownDisease.trim() || undefined,
          knownPest: knownPest.trim() || undefined,
          weedProblem: weedProblem.trim() || undefined,
          cropAgeDays: cropAgeDays || undefined,
          growthStage,
          district,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process crop protection advisory.");
      }

      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Service temporarily unavailable. Please retry.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Text-to-Speech
  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !result) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead =
      lang === "te"
        ? `${result.suspectedCondition.nameTe}. ${result.suspectedCondition.symptomsObservedTe}.`
        : `${result.suspectedCondition.nameEn}. ${result.suspectedCondition.symptomsObservedEn}.`;

    const utter = new SpeechSynthesisUtterance(textToRead);
    utter.lang = lang === "te" ? "te-IN" : "en-IN";
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const chips = PRESET_CHIPS[selectedCrop] || PRESET_CHIPS.Paddy;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {lang === "te" ? "AI ప్లాంట్ డాక్టర్ — పంట సస్యరక్షణ సలహాదారు" : "AI Plant Doctor — Crop Protection Advisory"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              PJTAU & CIBRC Grounded
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {lang === "te"
              ? "తెలంగాణ వ్యవసాయ విశ్వవిద్యాలయ (PJTAU) పరిశోధనల ఆధారంగా శాస్త్రీయ తెగులు, పురుగుల యాజమాన్యం."
              : "Scientifically grounded symptom analysis, IPM biological control, and verified CIBRC chemical safety."}
          </p>
        </div>

        <Link
          href="/advisory"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-agri-700 bg-agri-50 hover:bg-agri-100 dark:bg-agri-950 dark:text-agri-300 border border-agri-200 transition"
        >
          <span>{lang === "te" ? "కృషి సహాయక్ చాట్" : "Krishi Sahayak Chat"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. Advisory Consultation Form */}
      <Card className="border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {lang === "te" ? "లక్షణాల నమోదు & విశ్లేషణ" : "Crop Symptom & Protection Assessment"}
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            {profile.village} • {district}
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Row 1: Crop Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
              {lang === "te" ? "1. పంటను ఎంచుకోండి" : "1. Select Target Crop"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CROP_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedCrop(c.value)}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-left transition flex items-center justify-between ${
                    selectedCrop === c.value
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/70 dark:border-emerald-500 dark:text-emerald-200 shadow-2xs"
                      : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-300"
                  }`}
                >
                  <span>{lang === "te" ? c.labelTe : c.labelEn}</span>
                  {selectedCrop === c.value && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Symptom Description Input with Voice */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                {lang === "te" ? "2. ఆకులు / పంటపై లక్షణాలను వివరించండి" : "2. Describe Symptoms Observed"}
              </label>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                  isListening
                    ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 border-stone-300"
                }`}
                title="Speak your symptoms in Telugu or English"
              >
                {isListening ? <MicOff className="h-3.5 w-3.5 text-rose-600" /> : <Mic className="h-3.5 w-3.5 text-emerald-600" />}
                <span>{isListening ? (lang === "te" ? "వింటోంది..." : "Listening...") : (lang === "te" ? "మైక్ మాట్లాడండి" : "Voice Input")}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder={
                lang === "te"
                  ? "ఉదాహరణ: ఆకులపై బూడిద రంగు మచ్చలు ఉన్నాయి, కంకి మెడ నల్లబడి విరిగిపోతోంది..."
                  : "e.g. Spindle shaped spots with brown margins and grey center, neck of panicle blackening..."
              }
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-stone-400"
            />

            {/* Quick 1-Click Symptom Preset Chips */}
            <div className="mt-2.5">
              <p className="text-[11px] font-semibold text-stone-500 mb-1.5">
                {lang === "te" ? "సాధారణ లక్షణాల ఎంపిక (క్లిక్ చేయండి):" : "Quick Symptom Presets (Click to add):"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip, idx) => {
                  const chipText = lang === "te" ? chip.te : chip.en;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChipClick(chipText)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition"
                    >
                      + {chipText}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Collapsible Advanced Agronomy Parameters */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <span className="flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                {lang === "te" ? "అదనపు క్షేత్ర వివరాలు (ఐచ్ఛికం: పురుగు పేరు, కలుపు, పంట దశ)" : "Additional Field Parameters (Optional: Pest, Weed, Crop Stage)"}
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {lang === "te" ? "తెలిసిన తెగులు పేరు" : "Known Disease (if suspected)"}
                  </label>
                  <input
                    type="text"
                    value={knownDisease}
                    onChange={(e) => setKnownDisease(e.target.value)}
                    placeholder="e.g. Blast, Sheath Blight, Tikka"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {lang === "te" ? "కీటక పురుగు పేరు" : "Insect Pest Name"}
                  </label>
                  <input
                    type="text"
                    value={knownPest}
                    onChange={(e) => setKnownPest(e.target.value)}
                    placeholder="e.g. Stem Borer, BPH, Pink Bollworm"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {lang === "te" ? "కలుపు సమస్య" : "Weed Problem"}
                  </label>
                  <input
                    type="text"
                    value={weedProblem}
                    onChange={(e) => setWeedProblem(e.target.value)}
                    placeholder="e.g. Echinochloa, Cyperus sedge, Pre-emergence"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {lang === "te" ? "పంట వయస్సు (రోజులు)" : "Crop Age (Days After Sowing)"}
                  </label>
                  <input
                    type="number"
                    value={cropAgeDays}
                    onChange={(e) => setCropAgeDays(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {lang === "te" ? "పంట ఎదుగుదల దశ" : "Crop Growth Stage"}
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-700 p-2 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {GROWTH_STAGES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {lang === "te" ? s.labelTe : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleDiagnose}
              disabled={isDiagnosing}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDiagnosing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === "te" ? "సస్యరక్షణ విశ్లేషణ జరుగుతోంది..." : "Analyzing PJTAU Knowledge Base..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === "te" ? "సస్యరక్షణ సలహా పొందండి" : "Get Scientific Crop Protection Advisory"}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setSymptomText("");
                setKnownDisease("");
                setKnownPest("");
                setWeedProblem("");
                setCropAgeDays("");
                setResult(null);
                setErrorMessage("");
              }}
              className="px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{lang === "te" ? "క్లియర్" : "Reset"}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* 3. Advisory Outcome Results */}
      {result && (
        <div className="space-y-4">
          {/* Statutory Confidence & Field Screening Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === "te" ? "ప్రాథమిక పరిశీలనా మార్గదర్శకం (ప్రయోగశాల నిర్ధారణ కాదు)" : "Indicative Field Screening — Not Laboratory Confirmed"}
              </p>
              <p className="mt-0.5 opacity-90">
                {lang === "te" ? result.confidenceNotice.te : result.confidenceNotice.en}
              </p>
            </div>
          </div>

          {/* Follow-up Clarification Box (If Symptoms Ambiguous) */}
          {result.needsClarification && result.clarificationQuestions && (
            <Card className="border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <HelpCircle className="h-4 w-4" />
                  <span>{lang === "te" ? "మరింత స్పష్టత కోసం అదనపు పరిశీలనలు:" : "Diagnostic Follow-Up Observations:"}</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  {(lang === "te" ? result.clarificationQuestions.te : result.clarificationQuestions.en).map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {/* Primary Condition & Etiology Card */}
          <Card className="border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      {lang === "te" ? result.etiology.labelTe : result.etiology.labelEn}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {result.crop} • {result.district}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-50 mt-1">
                    {lang === "te" ? result.suspectedCondition.nameTe : result.suspectedCondition.nameEn}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition"
                    title="Listen to advisory"
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4 text-rose-600" /> : <Volume2 className="h-4 w-4 text-emerald-600" />}
                  </button>
                  <a
                    href={generateWhatsAppUrl(
                      formatPestMessage(
                        {
                          crop: selectedCrop,
                          cropTe: selectedCrop,
                          pestName: result.suspectedCondition.nameEn,
                          pestNameTe: result.suspectedCondition.nameTe,
                          remedy: result.chemicalRecommendation.activeIngredient || "Follow PJTAU Package of Practices",
                          remedyTe: result.chemicalRecommendation.activeIngredient || "PJTAU సమగ్ర సస్యరక్షణ పాటించండి",
                          dosage: result.chemicalRecommendation.dosagePerLiterWater || "Follow official label",
                          dosageTe: result.chemicalRecommendation.dosagePerLiterWater || "అధికారిక లేబుల్ ప్రకారం",
                          organic: result.ipmGuidance.biological.join("; "),
                          organicTe: result.ipmGuidance.biological.join("; "),
                          ppe: "Wear protective face mask and gloves",
                          ppeTe: "చేతి తొడుగులు, రక్షణ మాస్క్ ధరించండి",
                        },
                        lang
                      )
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 transition"
                    title="Share with fellow farmers on WhatsApp"
                  >
                    <Share2 className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Symptoms Observed */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  {lang === "te" ? "లక్షణాల విశ్లేషణ" : "Agronomic Symptoms Assessed"}
                </h4>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  {lang === "te" ? result.suspectedCondition.symptomsObservedTe : result.suspectedCondition.symptomsObservedEn}
                </p>
              </div>

              {/* IPM Guidance Box (FIRST) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs uppercase tracking-wider">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  <span>{lang === "te" ? "సమగ్ర సస్యరక్షణ & జీవ నియంత్రణ (IPM First)" : "Integrated Pest Management (IPM Guidance First)"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-800 dark:text-stone-200">
                  <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                      {lang === "te" ? "వ్యవసాయ పద్ధతులు:" : "Cultural Practices:"}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {result.ipmGuidance.cultural.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                      {lang === "te" ? "యాంత్రిక పద్ధతులు:" : "Mechanical Controls:"}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {result.ipmGuidance.mechanical.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                      {lang === "te" ? "జీవ నియంత్రణ:" : "Biological Controls:"}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {result.ipmGuidance.biological.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chemical Recommendation (Strict Safety Gated) */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {result.chemicalRecommendation.isActionable ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                  )}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    {lang === "te" ? "రసాయన సస్యరక్షణ మార్గదర్శకం (CIBRC ధృవీకరించిన రికార్డు)" : "Statutory Chemical Safety Gate (CIBRC Label Verification)"}
                  </h4>
                </div>

                {result.chemicalRecommendation.isActionable ? (
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <div>
                        <span className="text-stone-500 block text-[11px]">{lang === "te" ? "సిఫారసు చేసిన రసాయన ఫార్ములేషన్:" : "Approved Active Ingredient & Formulation:"}</span>
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {result.chemicalRecommendation.activeIngredient}
                        </span>
                        {result.chemicalRecommendation.brands && result.chemicalRecommendation.brands.length > 0 && (
                          <span className="text-[11px] text-stone-500 block">
                            Trade Names: {result.chemicalRecommendation.brands.join(", ")}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px]">{lang === "te" ? "అధికారిక మోతాదు:" : "Approved Statutory Dosage:"}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                          {result.chemicalRecommendation.dosagePerLiterWater}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          ({result.chemicalRecommendation.dosagePerAcre} in {result.chemicalRecommendation.dilutionWaterLiters || 200} L water/acre)
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px]">{lang === "te" ? "కోతకు ముందు వేచి ఉండే వ్యవధి (PHI):" : "Pre-Harvest Interval (PHI):"}</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {result.chemicalRecommendation.waitingPeriodDaysPHI} {lang === "te" ? "రోజులు" : "days"}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px]">{lang === "te" ? "భద్రతా సూచన:" : "Safety & PPE Precautions:"}</span>
                        <span className="text-[11px] text-stone-700 dark:text-stone-300">
                          {lang === "te"
                            ? result.chemicalRecommendation.safetyPrecautions?.te
                            : result.chemicalRecommendation.safetyPrecautions?.en}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-semibold">
                      {lang === "te" ? "రసాయన పిచికారీ మోతాదు నిలిపివేయబడింది" : "Actionable Chemical Spray Withheld"}
                    </p>
                    <p className="mt-0.5 text-[11px] opacity-90">
                      {lang === "te"
                        ? result.chemicalRecommendation.withholdingReason?.te
                        : result.chemicalRecommendation.withholdingReason?.en}
                    </p>
                  </div>
                )}
              </div>

              {/* Expandable Source Citation */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowCitations(!showCitations)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-600 transition"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {showCitations
                      ? (lang === "te" ? "ఆధార గ్రంథ వివరాలను దాచు" : "Hide Source Citation")
                      : (lang === "te" ? "ఆధార గ్రంథ వివరాలను చూడండి (పేజీ నంబర్ తో సహా)" : "View Supporting PJTAU Citation & Page Numbers")}
                  </span>
                  {showCitations ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showCitations && (
                  <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs space-y-1 border border-stone-200 dark:border-stone-700">
                    <p>
                      <strong className="text-stone-700 dark:text-stone-200">Document:</strong> {result.citation.documentTitle} ({result.citation.publicationMonthYear})
                    </p>
                    <p>
                      <strong className="text-stone-700 dark:text-stone-200">Publisher:</strong> {result.citation.publisher}
                    </p>
                    <p>
                      <strong className="text-stone-700 dark:text-stone-200">PDF Reference:</strong> {result.citation.filename} &bull; PDF Page: {result.citation.pdfPage} &bull; Printed Page: {result.citation.printedPage}
                    </p>
                    {result.citation.sectionHeader && (
                      <p>
                        <strong className="text-stone-700 dark:text-stone-200">Section:</strong> {result.citation.sectionHeader}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
