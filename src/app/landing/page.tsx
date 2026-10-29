"use client";

import React, { useState } from "react";
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
  UserCheck,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { QUICK_DEMO_FARMERS } from "@/lib/auth/demoProfiles";

export default function LandingPage() {
  const { lang, setLang } = useLanguage();
  const { openAuthModal, loginWithDemo, isLoggedIn, profile } = useFarmerProfile();

  const [activePreviewTab, setActivePreviewTab] = useState<"ai" | "iot" | "mandi" | "schemes">("ai");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      qEn: "Is Smart Farm Assistant free for farmers to use?",
      qTe: "స్మార్ట్ ఫార్మ్ అసిస్టెంట్ రైతులకు ఉచితంగా లభిస్తుందా?",
      aEn: "Yes, 100% free open advisory platform. Farmers can access AI crop disease diagnosis, live APMC Mandi rates, and government scheme eligibility guides without any subscription fee.",
      aTe: "అవును, రైతులందరికీ 100% ఉచితం. ఏఐ పంట వ్యాధి నిర్ధారణ, లైవ్ మార్కెట్ ధరలు మరియు ప్రభుత్వ పథకాల సమాచారం ఉచితంగా పొందవచ్చు.",
    },
    {
      qEn: "How does the Telangana ₹500/quintal Fine Rice bonus work?",
      qTe: "తెలంగాణ ₹500 సన్న బియ్యం బోనస్ ఎలా లభిస్తుంది?",
      aEn: "The Government of Telangana pays an additional ₹500/Qtl incentive bonus over the Central MSP (₹2,320) for 33 certified fine paddy varieties (like RNR 15048 / Telangana Sona, BPT 5204). Total farmer rate is ₹2,820/Qtl disbursed directly via DBT.",
      aTe: "కేంద్ర మద్దతు ధర ₹2,320కి అదనంగా ప్రభుత్వం క్వింటాలుకు ₹500 బోనస్ అందిస్తుంది (మొత్తం ₹2,820/క్వింటాల్). RNR 15048, BPT 5204 వంటి 33 సన్న వరి రకాలకు కొనుగోలు కేంద్రాల ద్వారా ఇది నేరుగా డీబీటీలో జమవుతుంది.",
    },
    {
      qEn: "Can the platform work without internet connectivity in remote fields?",
      qTe: "మారుమూల గ్రామీణ పొలాల్లో ఇంటర్నెట్ లేకపోయినా పనిచేస్తుందా?",
      aEn: "Yes! The platform includes full PWA offline caching with pre-loaded PJTAU Package of Practices agronomic rules and emergency offline diagnostics.",
      aTe: "ఖచ్చితంగా! పీడబ్ల్యూఏ (PWA) ఆఫ్‌లైన్ టెక్నాలజీ ద్వారా ఇంటర్నెట్ సిగ్నల్ లేని మారుమూల చేలలో కూడా వ్యవసాయ సలహాలు, పంట రక్షణ విధానాలు అందుబాటులో ఉంటాయి.",
    },
    {
      qEn: "How does the ESP32 IoT Soil Telemetry automate irrigation?",
      qTe: "ఈఎస్పీ32 (ESP32) సెన్సార్లు సాగునీటి పంపును ఎలా ఆటోమేట్ చేస్తాయి?",
      aEn: "Capacitive soil moisture sensors continuously measure Volumetric Water Content (VWC %). When soil drops below 35%, an automated relay triggers the pump, and automatically cuts off when field capacity (70%) is reached.",
      aTe: "భూమిలోని తేమ శాతాన్ని సెన్సార్లు నిరంతరం పర్యవేక్షిస్తాయి. తేమ 35% కంటే తగ్గితే మోటార్ ఆన్ అవ్వడం, సరైన తేమ రాగానే ఆటోమేటిక్‌గా మోటార్ ఆగిపోవడం జరుగుతుంది.",
    },
  ];

  return (
    <div className="-m-4 md:-m-8 pb-16 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen">
      {/* LANDING TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 px-4 md:px-8 py-3.5 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-xs border border-emerald-500/30">
              <img
                src="/images/smart_farm_app_icon.jpg"
                alt="Smart Farm Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="block text-base font-extrabold tracking-tight text-stone-900 dark:text-white leading-tight">
                Smart Farm Assistant
              </span>
              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Telangana Rythu Digital Ecosystem
              </p>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <a href="#features" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
              {lang === "te" ? "ఫీచర్లు" : "Features"}
            </a>
            <a href="#schemes" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
              {lang === "te" ? "ప్రభుత్వ పథకాలు" : "Govt Schemes"}
            </a>
            <a href="#mandi" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
              {lang === "te" ? "మార్కెట్ యార్డులు" : "Live Mandi Rates"}
            </a>
            <a href="#iot" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
              {lang === "te" ? "ఐఓటీ సెన్సార్లు" : "IoT Sensors"}
            </a>
            <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switch */}
            <div className="flex items-center rounded-xl border border-stone-200 bg-stone-100/80 p-0.5 dark:border-stone-800 dark:bg-stone-900">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  lang === "en" ? "bg-white text-emerald-800 shadow-xs dark:bg-stone-800 dark:text-emerald-300" : "text-stone-500"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("te")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  lang === "te" ? "bg-white text-emerald-800 shadow-xs dark:bg-stone-800 dark:text-emerald-300" : "text-stone-500"
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Login / Register Button */}
            <button
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isLoggedIn ? profile.name || "My Account" : "Login / Register"}</span>
            </button>

            {/* Launch Dashboard CTA */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition"
            >
              <span>{lang === "te" ? "డాష్‌బోర్డ్ తెరువు" : "Launch App"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-8 border-b border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-950">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Announcement Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {lang === "te"
                ? "జెమినీ 3.8 మల్టీమోడల్ ఏఐ & ఈఎస్పీ32 ఐఓటీ సాంకేతికత"
                : "Powered by Gemini 3.8 Multimodal AI & Real-Time ESP32 IoT Sensors"}
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-950 dark:text-white max-w-4xl mx-auto leading-tight">
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
          <p className="text-sm sm:text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed">
            {lang === "te"
              ? "పంట ఆకు ఫోటోతో తక్షణ రోగ నిర్ధారణ, బోరుబావి ఐఓటీ సెన్సార్లు, లైవ్ మార్కెట్ యార్డ్ ధరలు (సన్న బియ్యం ₹500 బోనస్), మరియు రైతు భరోసా, పి.ఎం. కిసాన్ పథకాల సమగ్ర వేదిక."
              : "Empowering farmers with Gemini 3.8 Multimodal Leaf Pathology, continuous ESP32 soil moisture telemetry with automated pump interlock, live APMC Mandi rates with GPS navigation, and unified Telangana & Central Government schemes."}
          </p>

          {/* Primary Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02]"
            >
              <span>{lang === "te" ? "🚀 ఫార్మ్ డాష్‌బోర్డ్ ప్రారంభించండి" : "🚀 Launch Farm Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openAuthModal("register")}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm border border-stone-300 shadow-xs dark:bg-stone-900 dark:text-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-all"
            >
              <LogIn className="w-4 h-4 text-emerald-600" />
              <span>{lang === "te" ? "రైతు ఖాతా నమోదు / లాగిన్" : "Register / 1-Click Demo Login"}</span>
            </button>

            <Link
              href="/schemes"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md dark:bg-stone-800 dark:hover:bg-stone-750 transition"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>{lang === "te" ? "🏛️ ప్రభుత్వ పథకాల పోర్టల్" : "🏛️ Explore Govt Schemes"}</span>
            </Link>
          </div>

          {/* Platform Performance Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 text-left">
            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                98.4%
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                AI Vision Diagnostic Accuracy
              </span>
              <span className="text-[11px] text-stone-500">PJTAU & ICAR Package of Practices</span>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                ₹500 / Qtl
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                Telangana Fine Rice Bonus
              </span>
              <span className="text-[11px] text-stone-500">Live APMC Mandi tracker (₹2,820/Qtl)</span>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                12 Active
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                Government Schemes
              </span>
              <span className="text-[11px] text-stone-500">Rythu Bharosa, Bima, PM-KISAN, KUSUM</span>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-4 shadow-2xs">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                24x7
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                IoT Telemetry & Pump Cutoff
              </span>
              <span className="text-[11px] text-stone-500">Prevents borewell dry run & water waste</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Leaf Pathology */}
          <div className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-4 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              Gemini 3.8 AI Doctor & Voice Advisory
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              Snap high-resolution plant leaf photos to diagnose Leaf Blast, Sheath Blight, Pink Bollworm, or Yellow Stem Borer with instant ICAR & PJTAU chemical & organic remedies.
            </p>
            <Link
              href="/advisory"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 group-hover:underline"
            >
              <span>Consult AI Doctor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: IoT Soil Sensors & Irrigation */}
          <div className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              ESP32 IoT Soil Telemetry & Pump Control
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              Real-time monitoring of soil volumetric water content (VWC %), NPK soil nutrient levels, and canopy temperature with automated pump cutoff interlock to save water and power.
            </p>
            <Link
              href="/iot"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 dark:text-teal-400 group-hover:underline"
            >
              <span>View Live IoT Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Live APMC Mandi Hub */}
          <div className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              Live Mandi Rates & GPS Navigation
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              One-touch crop rates and arrivals across Jagtial, Warangal Enmamula, Nizamabad, and Khammam with Telangana ₹500 fine rice bonus breakdown and 1-tap Google Maps directions.
            </p>
            <Link
              href="/market"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 group-hover:underline"
            >
              <span>Check Live Mandi Prices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Government Schemes Portal */}
          <div className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 mb-4 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              Telangana & Central Schemes Portal
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              Comprehensive repository of Rythu Bharosa (₹15,000/acre), Rythu Bima (₹5L insurance), Rythu Runa Mafi loan waiver, PM-KISAN, PMFBY, and solar pump subsidies with eligibility calculator.
            </p>
            <Link
              href="/schemes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 group-hover:underline"
            >
              <span>Explore Government Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: Agronomic Calculators */}
          <div className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 mb-4 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              Scientific Agronomic Calculators
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              Precision calculators for crop seed rate, 3-split fertilizer dosing (Urea / DAP / MOP), knapsack sprayer dilution, and Mallesham Goud's Paddy Payout Calculator with DBT bonus.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:text-orange-800 dark:text-orange-400 group-hover:underline"
            >
              <span>Use Agri Calculators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6: Offline Resilience & Demo */}
          <div className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              Offline-First PWA & Conference Demo
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              Engineered for poor rural connectivity with local caching of agronomic remedies, plus an automated conference simulator for live farmer demonstration and evaluation.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 dark:text-rose-400 group-hover:underline"
            >
              <span>Open Conference Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE PREVIEW BOX */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
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
                  href="/advisory"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                >
                  <span>Try AI Advisory Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
                  <span>Sample Diagnosis Card</span>
                  <span className="text-emerald-600 font-bold">Confidence: 98.4%</span>
                </div>
                <div className="rounded-xl bg-white dark:bg-stone-900 p-4 border border-stone-200/60 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">Diagnosis: Pyricularia oryzae</span>
                    <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">Action Needed</span>
                  </div>
                  <p className="text-[11px] text-stone-500">PJTAU Ground-Truth Advisory • Sourced from Jagtial RARS</p>
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
                  Continuously tracks volumetric water content (VWC %), leaf canopy temperature, and soil NPK values. If soil drops below 35%, automated pump interlock starts irrigation and cuts off at 70%.
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

      {/* QUICK 1-CLICK DEMO LOGIN SHOWCASE (MATCHING USER SCREENSHOT) */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Instant 1-Click Profile Switching</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Try As A Real Farmer With 1-Click Login
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Select any pre-configured farmer profile below to test the full experience with real crops, acreages, and district weather data without typing a password.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_DEMO_FARMERS.map((farmer) => (
              <button
                key={farmer.id}
                onClick={() => {
                  loginWithDemo(farmer);
                  window.location.href = "/";
                }}
                className="text-left rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 p-4 transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {farmer.nameDisplay}
                  </span>
                  <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 bg-white/5">
                    {farmer.languageBadge}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-2.5">
                  {farmer.email}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {farmer.crops.map((c, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-stone-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
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

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4.5 flex items-center justify-between font-bold text-sm text-stone-900 dark:text-white"
              >
                <span>{lang === "te" ? faq.qTe : faq.qEn}</span>
                <ChevronRight
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openFaqIndex === index ? "rotate-90 text-emerald-600" : ""
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="px-4.5 pb-4.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-3">
                  <p>{lang === "te" ? faq.aTe : faq.aEn}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
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
                <li><Link href="/" className="hover:text-emerald-600 transition">Dashboard</Link></li>
                <li><Link href="/advisory" className="hover:text-emerald-600 transition">AI Disease Diagnosis</Link></li>
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
                <li><Link href="/admin" className="hover:text-emerald-600 transition">Admin Console</Link></li>
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
            <p>© 2026 Smart Farm Assistant • Professor Jayashankar Telangana State Agricultural University (PJTAU) Grounded</p>
            <div className="flex items-center gap-4">
              <button onClick={() => openAuthModal("login")} className="hover:underline font-semibold">
                Farmer Login
              </button>
              <Link href="/" className="hover:underline font-semibold">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
