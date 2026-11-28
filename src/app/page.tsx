"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Sparkles,
  Bot,
  Activity,
  TrendingUp,
  Landmark,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Layers,
  Zap,
  Globe,
  Sun,
  Moon,
  MapPin,
  ChevronRight,
  Play,
  Calendar,
  Lock,
  Compass,
  FileText,
  HelpCircle,
  LogIn,
  UserPlus,
  X,
  Menu,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { InstallAppButton } from "@/components/common/PWAInstallContext";
import {
  PLATFORM_FEATURES,
  FEATURE_CATEGORIES,
} from "@/lib/navigation/features";
import { isAuthorizedAdmin } from "@/lib/auth/adminAuth";

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const { openAuthModal, openProfileModal, isLoggedIn, hasRegistered, profile } = useFarmerProfile();
  const isAdmin = isAuthorizedAdmin(profile?.email, isLoggedIn);

  const [activePreviewTab, setActivePreviewTab] = useState<"ai" | "iot" | "mandi" | "schemes">("ai");
  const [selectedFeatureCat, setSelectedFeatureCat] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showFloatingPrompt, setShowFloatingPrompt] = useState<boolean>(false);

  // Handle URL hash changes (e.g. #schemes, #mandi, #iot, #ai)
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.toLowerCase();
      if (hash === "#schemes") {
        setActivePreviewTab("schemes");
        document.getElementById("schemes")?.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#mandi") {
        setActivePreviewTab("mandi");
        document.getElementById("mandi")?.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#iot") {
        setActivePreviewTab("iot");
        document.getElementById("iot")?.scrollIntoView({ behavior: "smooth" });
      } else if (hash === "#ai") {
        setActivePreviewTab("ai");
        document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Show a gentle floating registration prompt for first-time visitors after 2.5 seconds
  // Only show registration prompt for genuine first-time visitors (never registered before)
  useEffect(() => {
    if (!isLoggedIn && !profile.name && !hasRegistered) {
      const timer = setTimeout(() => {
        try {
          const dismissed = sessionStorage.getItem("sf_reg_prompt_dismissed");
          if (!dismissed) {
            setShowFloatingPrompt(true);
          }
        } catch (e) {
          setShowFloatingPrompt(true);
        }
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowFloatingPrompt(false);
    }
  }, [isLoggedIn, profile.name, hasRegistered]);

  const dismissFloatingPrompt = () => {
    setShowFloatingPrompt(false);
    try {
      sessionStorage.setItem("sf_reg_prompt_dismissed", "true");
    } catch (e) {}
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      qEn: "What is Smart Farm Assistant and what features does it offer?",
      qTe: "స్మార్ట్ ఫార్మ్ అసిస్టెంట్ అంటే ఏమిటి మరియు ఇందులో ఏయే సేవలు ఉన్నాయి?",
      aEn: "Smart Farm Assistant is an integrated digital agriculture platform engineered for Telangana rythus. It brings together 10 precision farming modules in Telugu and English: AI Crop Disease Diagnosis, Krishi Sahayak research-grounded advisory, live ESP32 IoT soil moisture & pump automation, real-time APMC Mandi rates with ₹500 fine rice bonus, scientific NPK fertilizer calculators, and government scheme eligibility guides.",
      aTe: "స్మార్ట్ ఫార్మ్ అసిస్టెంట్ అనేది తెలంగాణ రైతుల కోసం రూపొందించబడిన సమగ్ర డిజిటల్ వ్యవసాయ వేదిక. ఇందులో 10 ముఖ్య సేవలు ఉన్నాయి: ఏఐ పంట తెగుళ్ళ నిర్ధారణ, పరిశోధనా ఆధారిత కృషి సహాయక్ సలహాలు, ఈఎస్పీ32 ఐఓటీ ఆటోమేటిక్ నీటి పారుదల, లైవ్ మార్కెట్ ధరలు & ₹500 సన్న బియ్యం బోనస్ లెక్కలు, శాస్త్రీయ ఎరువుల కాలిక్యులేటర్లు మరియు ప్రభుత్వ పథకాల మార్గదర్శిని.",
    },
    {
      qEn: "How does the AI Crop Disease Diagnosis (Plant Doctor) diagnose diseases?",
      qTe: "ఏఐ పంట రోగ నిర్ధారణ (ప్లాంట్ డాక్టర్) తెగుళ్ళను ఎలా గుర్తిస్తుంది?",
      aEn: "Farmers can upload or snap a leaf photo, or describe symptoms in Telugu or English. The vision model analyzes foliar lesions across 16 major regional crop diseases (Paddy Blast, Sheath Blight, Cotton Pink Bollworm, Chilli Anthracnose, etc.), cross-checks with CIBRC statutory safety guidelines, and recommends verified chemical dilutions, biological controls (Trichoderma), and mandatory Pre-Harvest Intervals (PHI).",
      aTe: "రైతులు తెగులు సోకిన ఆకు ఫోటో తీసి అప్‌లోడ్ చేయవచ్చు లేదా లక్షణాలను వివరించవచ్చు. ఏఐ మోడల్ 16 రకాల ప్రధాన పంట తెగుళ్ళను (వరి అగ్గితెగులు, పొడతెగులు, పత్తి గులాబీ రంగు పురుగు, మిర్చి కొమ్మకుళ్లు మొదలైనవి) ఖచ్చితంగా గుర్తించి, సీఐబీఆర్‌సీ ఆమోదిత మందుల మోతాదులు, ట్రైకోడెర్మా వంటి జీవ నియంత్రణ మరియు కోత ముందు వ్యవధి (PHI) సూచిస్తుంది.",
    },
    {
      qEn: "How is AI Krishi Sahayak different from generic chatbots?",
      qTe: "ఏఐ కృషి సహాయక్ సాధారణ చాట్‌బాట్‌ల కంటే ఎలా భిన్నమైనది?",
      aEn: "Unlike generic AI models that hallucinate unverified or unsafe chemicals, Krishi Sahayak is strictly grounded in 3,689 pages of verified PJTSAU research literature, including 56 monthly issues of Vyavasayam (2022–2026) and the Telangana Vyavasaayam Diksoochi. Every recommendation cites the exact publication issue and page number, ensuring 100% scientific credibility.",
      aTe: "సాధారణ ఏఐ చాట్‌బాట్‌ల వలె తప్పుడు మందులను సూచించకుండా, కృషి సహాయక్ 3,689 పేజీల విశ్వవిద్యాలయ వ్యవసాయ పరిశోధనా ప్రచురణలు మరియు వ్యవసాయం మాసపత్రికల ఆధారంగా పనిచేస్తుంది. ప్రతి సలహాకు ఆధారమైన ప్రచురణ మరియు పేజీ సంఖ్యను సైటేషన్ రూపంలో అందిస్తుంది.",
    },
    {
      qEn: "How does the ESP32 IoT Soil Telemetry automate irrigation and protect borewells?",
      qTe: "ఈఎస్పీ32 ఐఓటీ సెన్సార్లు సాగునీటి పంపును ఎలా ఆటోమేట్ చేస్తాయి?",
      aEn: "Field-edge capacitive soil moisture sensors (v1.2) continuously sample root-zone volumetric water content (VWC %). When moisture drops below 30%, a 30A optocoupled relay automatically turns ON the borewell pump. Once optimal field capacity reaches 55%, it automatically cuts off. This saves 25–30% water, prevents dangerous midnight field visits, and includes dry-run and rain-skip protection.",
      aTe: "నేలలో అమర్చిన సెన్సార్లు వేరు మండలంలోని తేమను నిరంతరం కొలుస్తాయి. తేమ 30% కంటే తగ్గితే 30A రిలే ద్వారా బోరుబావి మోటార్ ఆటోమేటిక్‌గా ఆన్ అవుతుంది; 55% తగినంత తేమ చేరగానే దానంతటదే ఆగిపోతుంది. ఇది 25-30% నీటిని ఆదా చేయడంతో పాటు, అర్ధరాత్రి పొలాలకు వెళ్లే ప్రమాదాన్ని నివారిస్తుంది.",
    },
    {
      qEn: "How does the Fertilizer Calculator solve the 'DAP Nitrogen Trap' to save money?",
      qTe: "ఎరువుల కాలిక్యులేటర్ 'డీఏపీ నత్రజని లోపం' సరిచేసి డబ్బును ఎలా ఆదా చేస్తుంది?",
      aEn: "Farmers often apply full urea alongside Di-Ammonium Phosphate (DAP), forgetting that each 50 kg bag of DAP already supplies 9.4 kg of elemental Nitrogen. Our calculator uses stoichiometric deduction: it subtracts the Nitrogen supplied by DAP from the urea requirement, saving approximately 1 full bag (~21 kg) of urea per acre while preventing blast outbreaks and lodging.",
      aTe: "రైతులు డీఏపీతో పాటు పూర్తి మోతాదు యూరియాను వేస్తుంటారు. కానీ 50 కిలోల డీఏపీ బస్తాలో 9.4 కిలోల స్వచ్ఛమైన నత్రజని ఉంటుందని గమనించరు. మన కాలిక్యులేటర్ డీఏపీలోని నత్రజనిని లెక్కించి, యూరియా మోతాదు నుండి తీసివేస్తుంది. దీనివల్ల ఎకరాకు దాదాపు 1 బస్తా యూరియా ఆదా అవ్వడమే కాక, పైరు పడిపోకుండా మరియు అగ్గితెగులు రాకుండా కాపాడుతుంది.",
    },
    {
      qEn: "How does the Telangana ₹500/quintal Fine Rice bonus work in Mandi Rates?",
      qTe: "తెలంగాణ ₹500 సన్న బియ్యం బోనస్ లైవ్ మార్కెట్‌లో ఎలా లెక్కించబడుతుంది?",
      aEn: "The Government of Telangana provides an additional ₹500/Qtl incentive bonus over the Central Minimum Support Price (MSP of ₹2,320) for 33 notified fine paddy varieties (such as RNR 15048 / Telangana Sona, BPT 5204). The live Mandi module tracks daily arrival prices across 12 Telangana APMC markets and instantly computes total earnings with the ₹500 bonus (₹2,820/Qtl total).",
      aTe: "తెలంగాణ ప్రభుత్వం 33 రకాల సన్న వరి రకాలకు (RNR 15048 తెలంగాణ సోనా, BPT 5204 వంటివి) కేంద్ర కనీస మద్దతు ధర ₹2,320కి అదనంగా ₹500 బోనస్ అందిస్తుంది. మన మార్కెట్ విభాగం 12 వ్యవసాయ మార్కెట్ల ధరలను ట్రాక్ చేస్తూ, ఈ బోనస్‌తో కలిపి వచ్చే మొత్తం ఆదాయాన్ని (క్వింటాలుకు ₹2,820) తక్షణమే లెక్కిస్తుంది.",
    },
    {
      qEn: "Can the platform work in remote fields without internet connectivity?",
      qTe: "మారుమూల గ్రామీణ పొలాల్లో ఇంటర్నెట్ లేకపోయినా పనిచేస్తుందా?",
      aEn: "Yes! Smart Farm Assistant is an offline-capable Progressive Web App (PWA). Once opened, critical agronomic Package of Practices, fertilizer calculators, and emergency diagnostic reference tables are pre-cached and operate seamlessly offline even in remote fields without mobile signal.",
      aTe: "ఖచ్చితంగా! పీడబ్ల్యూఏ (PWA) ఆఫ్‌లైన్ టెక్నాలజీ ద్వారా ఇంటర్నెట్ సిగ్నల్ లేని మారుమూల చేలలో కూడా వ్యవసాయ సలహాలు, ఎరువుల కాలిక్యులేటర్లు మరియు అత్యవసర పంట రక్షణ సమాచారం అందుబాటులో ఉంటాయి.",
    },
    {
      qEn: "Is Smart Farm Assistant free for farmers to use?",
      qTe: "స్మార్ట్ ఫార్మ్ అసిస్టెంట్ రైతులకు ఉచితంగా లభిస్తుందా?",
      aEn: "Yes, 100% free open advisory platform. Farmers can access AI crop disease diagnosis, bilingual voice chat with Krishi Sahayak, live APMC Mandi rates, scientific calculators, and government scheme guides without any subscription fee or hidden charges.",
      aTe: "అవును, రైతులందరికీ 100% ఉచితం. ఏఐ పంట వ్యాధి నిర్ధారణ, కృషి సహాయక్ వాయిస్ చాట్, లైవ్ మార్కెట్ ధరలు, సైంటిఫిక్ కాలిక్యులేటర్లు మరియు ప్రభుత్వ పథకాల సమాచారం ఎటువంటి రుసుము లేకుండా ఉచితంగా పొందవచ్చు.",
    },
  ];

  return (
    <div className="-m-4 md:-m-8 pb-16 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen">
      {/* FLOATING FIRST-TIME VISITOR REGISTRATION BAR */}
      {showFloatingPrompt && (
        <aside
          aria-label="First-time registration prompt"
          className="fixed bottom-20 left-3 right-3 sm:left-4 sm:right-4 md:bottom-8 md:left-auto md:right-8 md:max-w-md z-50 rounded-2xl border-2 border-emerald-500 bg-white/95 dark:bg-stone-900/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-black text-stone-900 dark:text-white">
                  {lang === "te" ? "రైతు ప్రొఫైల్‌ను నమోదు చేసుకోండి" : "First Time Here? Register Your Farm Profile"}
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  {lang === "te"
                    ? "మీ జిల్లా వాతావరణం మరియు ఏఐ పంట సలహాల కోసం 30 సెకన్లలో ప్రొఫైల్ నమోదు చేయండి."
                    : "Register in 30 seconds to get tailored crop diagnostics, local Mandi rates, and weather."}
                </p>
                <div className="flex items-center gap-2 pt-1.5">
                  <button
                    onClick={() => {
                      dismissFloatingPrompt();
                      openAuthModal("register");
                    }}
                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                  >
                    {lang === "te" ? "ఇప్పుడే నమోదు చేయండి" : "Register Profile"}
                  </button>
                  <button
                    onClick={dismissFloatingPrompt}
                    className="rounded-lg border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  >
                    {lang === "te" ? "తరువాత" : "Maybe Later"}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={dismissFloatingPrompt}
              aria-label="Dismiss registration prompt"
              className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}

      {/* HERO SECTION WITH CLEAN MOBILE-FRIENDLY LAYOUT */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 px-3.5 sm:px-6 md:px-8 border-b border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-950">
        <div className="max-w-6xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Announcement Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-none">
              {lang === "te"
                ? "జెమినీ 3.8 మల్టీమోడల్ ఏఐ & ఈఎస్పీ32 ఐఓటీ సాంకేతికత"
                : "Powered by Gemini 3.8 Multimodal AI & Real-Time ESP32 IoT Sensors"}
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            {lang === "te" ? (
              <>
                తెలంగాణ రైతులకు <span className="text-emerald-700 dark:text-emerald-400">స్మార్ట్ వ్యవసాయ</span> విప్లవం
              </>
            ) : (
              <>
                Next-Gen AI & IoT Platform for <span className="text-emerald-700 dark:text-emerald-400">Sustainable Agriculture</span>
              </>
            )}
          </h1>

          {/* Hero Subheadline */}
          <p className="text-xs sm:text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
            {lang === "te"
              ? "పంట ఆకు ఫోటోతో తక్షణ రోగ నిర్ధారణ, బోరుబావి ఐఓటీ సెన్సార్లు, లైవ్ మార్కెట్ యార్డ్ ధరలు (సన్న బియ్యం ₹500 బోనస్), మరియు రైతు భరోసా, పి.ఎం. కిసాన్ పథకాల సమగ్ర వేదిక."
              : "Empowering farmers with Gemini 3.8 Multimodal Leaf Pathology, continuous ESP32 soil moisture telemetry with automated pump interlock, live APMC Mandi rates with GPS navigation, and unified Telangana & Central Government schemes."}
          </p>

          {/* ============================================================ */}
          {/* 🌟 FARMER CONTEXT CARD (DYNAMIC LOGGED-IN VS GUEST) */}
          {/* ============================================================ */}
          <div id="register" className="pt-2">
            {!isLoggedIn ? (
              hasRegistered ? (
                /* USER HAS REGISTERED BEFORE & IS LOGGED OUT: SHOW ONLY LOGIN */
                <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 p-5 sm:p-6 shadow-xl backdrop-blur-md text-left transition-all">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{lang === "te" ? "రైతు లాగిన్" : "Farmer Portal Login"}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-stone-950 dark:text-white">
                        {lang === "te" ? "మీ ఫార్మ్ డాష్‌బోర్డ్ తెరవడానికి లాగిన్ అవ్వండి" : "Welcome Back! Please Log In"}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {lang === "te"
                          ? "మీ పంట వ్యాధి నిర్ధారణ, ఐఓటీ పంపు సమాచారం, మరియు లైవ్ మార్కెట్ ధరల కోసం మీ ఖాతాతో లాగిన్ అవ్వండి."
                          : "Log in with your Gmail or Google Account to access your live farm telemetry, crop advisories, and APMC Mandi rates."}
                      </p>
                    </div>
                    <div className="shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => openAuthModal("login")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{lang === "te" ? "లాగిన్ అవ్వండి" : "Login"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* BRAND NEW VISITOR: SHOW STEP 1 REGISTRY CARD */
                <div className="mx-auto max-w-2xl rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/50 dark:via-stone-900 dark:to-emerald-950/50 p-4.5 sm:p-6 shadow-xl shadow-emerald-700/10 backdrop-blur-md text-left transition-all">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{lang === "te" ? "ముఖ్య గమనిక • మొదటి సారి వచ్చిన వారికి" : "Welcome • Step 1: Register Profile"}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-stone-950 dark:text-white">
                        {lang === "te" ? "ముందుగా మీ రైతు ప్రొఫైల్‌ను నమోదు చేసుకోండి" : "Please Register Your Farm Profile First"}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {lang === "te"
                          ? "మీ జిల్లా వాతావరణం, పంట సలహాలు, మరియు లైవ్ మార్కెట్ ధరలను పొందడానికి మీ వివరాలను నమోదు చేయండి (30 సెకన్లు)."
                          : "Personalize your AI crop diagnostics, district weather forecasts, and live Mandi rates for your village in 30 seconds."}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => openAuthModal("register")}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{lang === "te" ? "ప్రొఫైల్ నమోదు చేయండి" : "Register Farm Profile"}</span>
                      </button>
                      <button
                        onClick={() => openAuthModal("login")}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs transition"
                      >
                        <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === "te" ? "లాగిన్" : "Existing Login"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/40 p-4 sm:p-5 shadow-sm text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                      {profile.name?.slice(0, 2).toUpperCase() || "AM"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white truncate">
                          {profile.name}
                        </span>
                        <span className="rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30 shrink-0">
                          ✓ Profile Active
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                        {profile.village ? `${profile.village}, ` : ""}{profile.district} District &bull; Crop: <b className="text-stone-900 dark:text-white">{profile.primaryCrop}</b> ({profile.areaAcre} Acres)
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center justify-center gap-1.5 shadow-sm shrink-0 hover:scale-[1.02] active:scale-95"
                  >
                    <span>{lang === "te" ? "ఫార్మ్ డాష్‌బోర్డ్ తెరవండి" : "Open Farm Dashboard"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Quick 1-tap feature shortcuts for registered farmer */}
                <div className="mt-3.5 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href="/diagnosis"
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-700 font-semibold text-[11px] transition shadow-2xs"
                    >
                      🩺 {lang === "te" ? "రోగ నిర్ధారణ" : "AI Diagnosis"}
                    </Link>
                    <Link
                      href="/iot"
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-700 font-semibold text-[11px] transition shadow-2xs"
                    >
                      📡 {lang === "te" ? "ఐఓటీ పంపు" : "IoT Pump"}
                    </Link>
                    <Link
                      href="/market"
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-700 font-semibold text-[11px] transition shadow-2xs"
                    >
                      📈 {lang === "te" ? "మార్కెట్ ధరలు" : "Mandi Rates"}
                    </Link>
                    <Link
                      href="/schemes"
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-700 font-semibold text-[11px] transition shadow-2xs"
                    >
                      🏛️ {lang === "te" ? "పథకాలు" : "Schemes"}
                    </Link>
                  </div>
                  <button
                    onClick={openProfileModal}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    {lang === "te" ? "ప్రొఫైల్ మార్చండి" : "Edit Details / Switch"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Non-logged-in Call to Actions */}
          {!isLoggedIn && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <InstallAppButton variant="pill" className="px-5 py-3 text-xs sm:text-sm" />

              {hasRegistered ? (
                /* Once registered, show ONLY Login button */
                <button
                  onClick={() => openAuthModal("login")}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{lang === "te" ? "రైతు లాగిన్" : "Login"}</span>
                </button>
              ) : (
                /* First-time visitor: allow registration */
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02]"
                  >
                    <span>{lang === "te" ? "🚀 ఫార్మ్ డాష్‌బోర్డ్ ప్రారంభించండి" : "🚀 Launch Farm Dashboard"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => openAuthModal("register")}
                    className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm border border-stone-300 shadow-xs dark:bg-stone-900 dark:text-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "te" ? "రైతు నమోదు" : "Register Farm Profile"}</span>
                  </button>
                </>
              )}

              <Link
                href="/schemes"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md dark:bg-stone-800 dark:hover:bg-stone-750 transition"
              >
                <Landmark className="w-4 h-4 text-amber-400" />
                <span>{lang === "te" ? "🏛️ ప్రభుత్వ పథకాలు" : "🏛️ Explore Govt Schemes"}</span>
              </Link>
            </div>
          )}

          {/* Platform Performance Metrics Banner (Clean 2x2 Grid on Mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                Evidence-Based
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                Decision Support & Safety Gate
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-0.5">PJTAU Package of Practices Grounded</span>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                ₹500 / Qtl
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                Telangana Fine Rice Bonus
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-0.5">Live APMC Mandi tracker (₹2,820/Qtl)</span>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                12 Active
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                Government Schemes
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-0.5">Rythu Bharosa, Bima, PM-KISAN, KUSUM</span>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                24x7
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                IoT Telemetry & Pump Cutoff
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-0.5">Prevents borewell dry run & water waste</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SHOWCASE */}
      <section id="features" className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
            Complete Digital Agriculture Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white">
            {lang === "te" ? "రైతుకు అవసరమైన అన్ని ఆధునిక సౌకర్యాలు" : "All The Features Modern Farmers Need"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
            Integrated tools designed specifically for Telangana and Indian agronomic conditions, supporting bilingual Telugu & English.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FEATURE_CATEGORIES.map((cat) => {
            const isSelected = selectedFeatureCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFeatureCat(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-sm dark:bg-emerald-600 scale-105"
                    : "bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                }`}
              >
                {lang === "te" ? cat.labelTe : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Responsive Grid of All 10 Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PLATFORM_FEATURES.filter((f) => {
            if (selectedFeatureCat === "all") return true;
            return f.category === selectedFeatureCat;
          }).map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900"
              >
                <div>
                  {/* Card Header: Icon & Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-2xs transition-transform group-hover:scale-110 ${feature.accentBg} ${feature.accentText} ${feature.accentBorder}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {feature.badge && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          feature.badgeColor || "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                        }`}
                      >
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Category Tag */}
                  <div className="mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                      {lang === "te" ? feature.categoryLabelTe : feature.categoryLabelEn}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {lang === "te" ? feature.titleTe : feature.titleEn}
                    </h3>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500">
                      {lang === "te" ? feature.titleEn : feature.titleTe}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {lang === "te" ? feature.descriptionTe : feature.descriptionEn}
                  </p>
                </div>

                {/* Direct Action Link */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 group-hover:underline"
                  >
                    <span>{lang === "te" ? "ప్రారంభించండి" : "Launch Feature"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE FEATURE PREVIEW BOX */}
      <section id="preview" className="max-w-6xl mx-auto px-4 md:px-8 py-10 scroll-mt-20">
        <div id="schemes" className="scroll-mt-28" />
        <div id="mandi" className="scroll-mt-28" />
        <div id="iot" className="scroll-mt-28" />
        <div id="ai" className="scroll-mt-28" />
        <div className="rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Interactive Live Preview
              </span>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Experience Smart Farm Assistant in Action
              </h3>
            </div>

            {/* Preview Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActivePreviewTab("ai")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activePreviewTab === "ai" ? "bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white" : "text-stone-500"
                }`}
              >
                AI Pathology
              </button>
              <button
                onClick={() => setActivePreviewTab("iot")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activePreviewTab === "iot" ? "bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white" : "text-stone-500"
                }`}
              >
                IoT Telemetry
              </button>
              <button
                onClick={() => setActivePreviewTab("mandi")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activePreviewTab === "mandi" ? "bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white" : "text-stone-500"
                }`}
              >
                Mandi Rates
              </button>
              <button
                onClick={() => setActivePreviewTab("schemes")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activePreviewTab === "schemes" ? "bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white" : "text-stone-500"
                }`}
              >
                Schemes
              </button>
            </div>
          </div>

          {/* TAB 1: AI Pathology Preview */}
          {activePreviewTab === "ai" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                  <span>Gemini 3.8 Multimodal Vision</span>
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                  Leaf Blast Diagnosis in Paddy (RNR 15048)
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Farmer Md Ashfaq snaps a leaf photo in Jagtial. Within 1.2 seconds, the multimodal model analyzes spindle-shaped lesions and recommends:
                </p>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800 p-3 text-xs space-y-1.5 border border-stone-200/80 dark:border-stone-700">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Spray Tricyclazole 75% WP @ 0.6g / Litre of water</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Avoid excessive top-dressing of Urea nitrogen during cloudy weather</span>
                  </div>
                </div>
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                >
                  <span>Try AI Advisory Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
                  <span>Sample Diagnosis Card</span>
                  <span className="text-stone-600 dark:text-stone-300 font-bold">Possible Diagnosis (Indicative)</span>
                </div>
                <div className="rounded-xl bg-white dark:bg-stone-900 p-4 border border-stone-200/60 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">Diagnosis: Pyricularia oryzae</span>
                    <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">Action Needed</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Scientific Agronomic Advisory &bull; Sourced from Agricultural Research Stations</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IoT Telemetry Preview */}
          {activePreviewTab === "iot" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-xs font-bold">
                  <span>ESP32 Wireless Telemetry</span>
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                  Real-Time Soil Health & Automated Pump
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Continuously tracks volumetric water content (VWC %), leaf canopy temperature, and soil NPK values. If soil drops below your threshold, automated pump interlock starts irrigation and cuts off when optimal saturation is reached.
                </p>
                <Link
                  href="/iot"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition"
                >
                  <span>Explore IoT Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-teal-50 dark:bg-teal-950/40 p-3.5 border border-teal-200 dark:border-teal-800">
                  <span className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold block">Soil Moisture (VWC)</span>
                  <span className="text-2xl font-black text-teal-950 dark:text-teal-100">46.2%</span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400">Optimal Rootzone Status</span>
                </div>
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3.5 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">Pump Status</span>
                  <span className="text-2xl font-black text-emerald-950 dark:text-emerald-100">OFF (Auto)</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Interlock Engaged</span>
                </div>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-850 p-3.5 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] text-stone-600 dark:text-stone-400 font-semibold block">Soil Temperature</span>
                  <span className="text-2xl font-black text-stone-900 dark:text-white">28.4 °C</span>
                  <span className="text-[10px] text-stone-500">Normal Range</span>
                </div>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-850 p-3.5 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] text-stone-600 dark:text-stone-400 font-semibold block">NPK Status</span>
                  <span className="text-2xl font-black text-stone-900 dark:text-white">Good</span>
                  <span className="text-[10px] text-stone-500">N: 142 • P: 48 • K: 184</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Mandi Rates Preview */}
          {activePreviewTab === "mandi" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold">
                  <span>Live APMC Mandi Rates</span>
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                  Paddy RNR 15048 with Telangana ₹500 Bonus
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Transparent breakdown between Central MSP (₹2,320) and Telangana State Bonus (+₹500), totaling ₹2,820/Qtl with 1-tap Google Maps directions to Jagtial APMC.
                </p>
                <Link
                  href="/market"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition"
                >
                  <span>Open Market Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 text-xs font-bold">
                  <span>Jagtial APMC Market Yard</span>
                  <span className="text-emerald-700 font-black">₹2,820 / Qtl</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Central Government MSP:</span>
                    <span className="font-semibold text-stone-900 dark:text-white">₹2,320</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>Telangana Fine Rice Bonus:</span>
                    <span>+₹500 / Qtl</span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Today's Total Arrivals:</span>
                    <span className="font-semibold text-stone-900 dark:text-white">4,850 Quintals</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Schemes Preview */}
          {activePreviewTab === "schemes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold">
                  <span>State & Central Govt Schemes</span>
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                  Rythu Bharosa, Rythu Bima & PM-KISAN
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Check eligibility, download checklists, and view required documents for Rythu Bharosa (₹15,000/acre), ₹5 Lakh Rythu Bima life insurance, PM-KISAN, and solar water pumps.
                </p>
                <Link
                  href="/schemes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 transition"
                >
                  <span>Visit Schemes Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-stone-850">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-900 dark:text-white">
                    <span>Rythu Bharosa (TS)</span>
                    <span className="text-emerald-700 dark:text-emerald-400">₹15,000 / Acre / Yr</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Direct DBT into farmer bank account for Kharif & Rabi</p>
                </div>
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-stone-850">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-900 dark:text-white">
                    <span>PM-KISAN (Central)</span>
                    <span className="text-amber-700 dark:text-amber-400">₹6,000 / Yr</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">3 installments of ₹2,000 every 4 months</p>
                </div>
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-stone-850">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-900 dark:text-white">
                    <span>Rythu Bima (TS)</span>
                    <span className="text-indigo-700 dark:text-indigo-400">₹5,00,000 Life Cover</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">100% state-funded insurance for pattadar farmers</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
            Questions & Answers
          </span>
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs transition hover:border-emerald-500/40"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full text-left py-4 px-5 flex items-center justify-between font-bold text-sm sm:text-base text-stone-900 dark:text-white hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
              >
                <span className="pr-4 leading-snug">{lang === "te" ? faq.qTe : faq.qEn}</span>
                <ChevronRight
                  className={`w-5 h-5 shrink-0 text-emerald-600 transition-transform duration-200 ${
                    openFaqIndex === index ? "rotate-90 text-emerald-700" : "text-stone-400"
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="px-5 pb-5 pt-3.5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850/40">
                  <p>{lang === "te" ? faq.aTe : faq.aEn}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER (CLEANED - UNIVERSITY NAME REMOVED PER USER REQUEST) */}
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 pt-12 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-stone-200 dark:border-stone-800 text-xs">
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span className="font-extrabold text-base text-stone-900 dark:text-white">
                  Smart Farm Assistant
                </span>
              </div>
              <p className="text-stone-500 leading-relaxed">
                Empowering Telangana rythus with multimodal AI, real-time IoT soil intelligence, and unified government schemes.
              </p>
              <div className="pt-1">
                <a
                  href="tel:18001801551"
                  className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Kisan Call Centre: 1800-180-1551</span>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                Platform Features
              </h5>
              <ul className="space-y-1.5 text-stone-500 dark:text-stone-400">
                <li><Link href="/dashboard" className="hover:text-emerald-600 transition">Farm Dashboard</Link></li>
                <li><Link href="/diagnosis" className="hover:text-emerald-600 transition">AI Disease Diagnosis</Link></li>
                <li><Link href="/iot" className="hover:text-emerald-600 transition">ESP32 IoT Sensors</Link></li>
                <li><Link href="/market" className="hover:text-emerald-600 transition">APMC Mandi Rates</Link></li>
                <li><Link href="/schemes" className="hover:text-emerald-600 transition">Government Schemes</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                Calculators & Tools
              </h5>
              <ul className="space-y-1.5 text-stone-500 dark:text-stone-400">
                <li><Link href="/tools" className="hover:text-emerald-600 transition">Paddy Payout Calculator</Link></li>
                <li><Link href="/tools" className="hover:text-emerald-600 transition">Fertilizer NPK Split</Link></li>
                <li><Link href="/tools" className="hover:text-emerald-600 transition">Seed Rate Estimator</Link></li>
                <li><Link href="/demo" className="hover:text-emerald-600 transition">Conference Live Demo</Link></li>
                {isAdmin && (
                  <li><Link href="/admin" className="hover:text-emerald-600 transition">Admin Console</Link></li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                Official Portals
              </h5>
              <ul className="space-y-1.5 text-stone-500 dark:text-stone-400">
                <li><a href="https://rythubharosa.telangana.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">Rythu Bharosa ↗</a></li>
                <li><a href="https://epds.telangana.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">TS Civil Supplies ↗</a></li>
                <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">PM-KISAN Portal ↗</a></li>
                <li><a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">PM Fasal Bima ↗</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
            <p>© 2026 Smart Farm Assistant • Smart Agriculture & Farmer Welfare System</p>
            <div className="flex items-center gap-4">
              {!hasRegistered && (
                <button onClick={() => openAuthModal("register")} className="hover:underline font-semibold text-emerald-700 dark:text-emerald-400">
                  Register Profile
                </button>
              )}
              <button onClick={() => openAuthModal("login")} className="hover:underline font-semibold">
                Farmer Login
              </button>
              <Link href="/dashboard" className="hover:underline font-semibold">
                Launch Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
