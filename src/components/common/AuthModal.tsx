"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ChevronDown,
  CheckCircle,
  LogIn,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useFarmerProfile } from "./FarmerProfileContext";
import { useLanguage } from "./LanguageContext";
import { TELANGANA_DISTRICTS } from "@/lib/profile/farmerProfile";
import { QUICK_DEMO_FARMERS, DemoFarmer } from "@/lib/auth/demoProfiles";
import {
  findUserByEmail,
  authenticateWithPassword,
  authenticateWithGoogle,
  registerNewFarmer,
} from "@/lib/auth/userRegistry";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { profile, updateProfile, loginWithDemo, logout } = useFarmerProfile();
  const { lang, setLang } = useLanguage();

  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // Sync tab with initialTab when opened
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, initialTab]);

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("bioashfaq123@gmail.com");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // REGISTER (FARMER REGISTRY & FIELD SETUP) STATE
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState("");
  const [regDistrict, setRegDistrict] = useState("Jagtial");
  const [regMandal, setRegMandal] = useState("Dharmapuri");
  const [regVillage, setRegVillage] = useState("Mallapur");
  const [regAreaAcre, setRegAreaAcre] = useState("4.5");
  const [regAreaGunta, setRegAreaGunta] = useState("0");
  const [regPrimaryCrop, setRegPrimaryCrop] = useState("Paddy (RNR 15048 / Telangana Sona)");
  const [regSoilType, setRegSoilType] = useState("Red Sandy Loam (చల్కా నేలలు)");
  const [regIrrigationType, setRegIrrigationType] = useState("3 HP Submersible Borewell");
  const [regSowingDate, setRegSowingDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [regLanguage, setRegLanguage] = useState<"English" | "Telugu (తెలుగు)" | "Hindi (हिंदी)">("English");

  // Google Selector Modal state
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Quick Demo Dropdown toggle
  const [showDemoList, setShowDemoList] = useState(false);

  // Messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const districtNames = Object.keys(TELANGANA_DISTRICTS);

  const handleDistrictChange = (newDist: string) => {
    setRegDistrict(newDist);
    const meta = TELANGANA_DISTRICTS[newDist];
    if (meta) {
      setRegMandal(meta.defaultMandal);
      setRegVillage(meta.defaultVillage);
    }
  };

  // Google Sign-In Execution
  const executeGoogleLogin = (email: string, displayName?: string) => {
    const result = authenticateWithGoogle(email, displayName);
    setShowGoogleAccounts(false);
    setErrorMsg("");

    if (result.isNew) {
      setSuccessMsg(`Welcome, ${result.user.name}! Registered with Google (${email}).`);
    } else {
      setSuccessMsg(`Welcome back, ${result.user.name}! Logged in with Google.`);
    }

    setTimeout(() => {
      onClose();
    }, 700);
  };

  // Pre-fill Registry form with Google Account
  const handleGooglePreFillRegister = (email: string, displayName: string) => {
    setRegEmail(email);
    setRegName(displayName);
    setShowGoogleAccounts(false);
    setSuccessMsg(`Google Account connected: ${email}. Please complete your field setup below.`);
  };

  // SUBMIT LOGIN (GMAIL & PASSWORD)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginEmail.trim() || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setErrorMsg("Please enter a valid Gmail / Email address");
      return;
    }
    if (!loginPassword) {
      setErrorMsg("Please enter your password");
      return;
    }

    const authResult = authenticateWithPassword(loginEmail, loginPassword);
    if (!authResult.success) {
      // If user is not yet in registry, offer 1-click registration
      setErrorMsg(authResult.error || "Login failed. Please check credentials.");
      return;
    }

    setSuccessMsg(`Welcome back, ${authResult.user?.name}!`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  // SUBMIT REGISTRATION (FARMER REGISTRY & FIELD SETUP)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!regName.trim()) {
      setErrorMsg("Please enter your Full Farmer Name *");
      return;
    }
    if (!regEmail.trim() || !/\S+@\S+\.\S+/.test(regEmail)) {
      setErrorMsg("Please enter a valid Gmail / Email address *");
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMsg("Please set a password (at least 4 characters) *");
      return;
    }
    const acres = parseFloat(regAreaAcre);
    if (isNaN(acres) || acres <= 0) {
      setErrorMsg("Please enter valid land area in acres *");
      return;
    }
    if (!regPrimaryCrop.trim()) {
      setErrorMsg("Please select your primary crop *");
      return;
    }

    if (regLanguage.includes("Telugu")) {
      setLang("te");
    } else {
      setLang("en");
    }

    const newAccount = registerNewFarmer({
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      phone: regPhone.trim(),
      district: regDistrict,
      mandal: regMandal.trim(),
      village: regVillage.trim(),
      areaAcre: acres,
      areaGunta: parseInt(regAreaGunta, 10) || 0,
      primaryCrop: regPrimaryCrop,
      soilType: regSoilType,
      irrigationType: regIrrigationType,
      sowingDate: regSowingDate,
      preferredLanguage: regLanguage,
    });

    setSuccessMsg(`Registration Complete! Welcome to Smart Farm, ${newAccount.name}.`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // 1-Click Demo Login selection
  const handleDemoSelect = (farmer: DemoFarmer) => {
    loginWithDemo(farmer);
    if (farmer.languageBadge.includes("Telugu")) {
      setLang("te");
    } else {
      setLang("en");
    }
    setSuccessMsg(`Logged in as demo farmer: ${farmer.name}`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 text-stone-900 dark:text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🌱
            </div>
            <h2 className="text-xl font-black tracking-tight text-stone-950 dark:text-white">
              Smart Farm Assistant
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Telangana Rythu Digital Ecosystem &bull; Secure Farmer Portal
          </p>
        </div>

        {/* Navigation Tabs: [ Login ] | [ Farmer Registry & Field Setup ] */}
        <div className="flex rounded-2xl bg-stone-100 dark:bg-stone-800/80 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              tab === "login"
                ? "bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === "te" ? "లాగిన్" : "Login"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              tab === "register"
                ? "bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{lang === "te" ? "రైతు రిజిస్ట్రీ & ఫీల్డ్ సెటప్" : "Farmer Registry & Field Setup"}</span>
          </button>
        </div>

        {/* Alert Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40 p-3 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
              {errorMsg.includes("register") && (
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    setRegEmail(loginEmail);
                    setErrorMsg("");
                  }}
                  className="block mt-1 font-bold underline text-emerald-700 dark:text-emerald-400"
                >
                  Click here to register your farm profile now →
                </button>
              )}
            </div>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 p-3 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: LOGIN (GOOGLE ACCOUNT OR GMAIL & PASSWORD) */}
        {/* ============================================================ */}
        {tab === "login" && (
          <div className="space-y-4">
            {/* GOOGLE SIGN IN BUTTON */}
            <div>
              <button
                type="button"
                onClick={() => setShowGoogleAccounts(true)}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm shadow-xs transition hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{lang === "te" ? "గూగుల్ ఖాతాతో కొనసాగండి" : "Continue with Google Account"}</span>
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
              <span className="bg-white dark:bg-stone-900 px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
                {lang === "te" ? "లేదా ఈమెయిల్ & పాస్‌వర్డ్" : "or with Gmail & Password"}
              </span>
              <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
            </div>

            {/* GMAIL & PASSWORD FORM */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Gmail / Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-stone-850 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPassword("password123");
                      setSuccessMsg("Default demo password filled: password123");
                    }}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Use default (password123)
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-stone-850 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === "te" ? "స్మార్ట్ ఫార్మ్‌కు లాగిన్ అవ్వండి" : "Sign In to Smart Farm"}</span>
              </button>
            </form>

            {/* Switch to Registry notice */}
            <div className="pt-2 text-center text-xs text-stone-500">
              <span>{lang === "te" ? "కొత్త రైతా?" : "New to Smart Farm?"} </span>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMsg("");
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                {lang === "te" ? "రైతు రిజిస్ట్రీ & ఫీల్డ్ సెటప్ చేయండి →" : "Register farm profile & field setup →"}
              </button>
            </div>

            {/* 1-Click Demo Profiles Accordion */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowDemoList(!showDemoList)}
                className="w-full flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 py-1 hover:text-stone-800 dark:hover:text-stone-200"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Click Test Demo Farmers</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDemoList ? "rotate-180" : ""}`} />
              </button>

              {showDemoList && (
                <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {QUICK_DEMO_FARMERS.map((farmer) => (
                    <button
                      key={farmer.id}
                      type="button"
                      onClick={() => handleDemoSelect(farmer)}
                      className="w-full text-left p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/80 hover:bg-emerald-50/50 dark:hover:bg-stone-800 text-xs transition flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 dark:text-white block truncate">
                          {farmer.nameDisplay}
                        </span>
                        <span className="text-[11px] text-stone-500 block truncate">
                          {farmer.district}, {farmer.state} &bull; {farmer.primaryCrop}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {farmer.languageBadge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: REGISTER (FARMER REGISTRY & REAL FIELD SETUP) */}
        {/* ============================================================ */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Banner explaining Farmer Registry & Field Setup */}
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-stone-900 p-3.5 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Telangana Farmer Registry</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                Farmer Profile &amp; Field Setup is done <b>only during registration</b>. Once registered, you will log in directly via Google or Password with your saved field parameters!
              </p>
            </div>

            {/* Google Fast-Fill Option for Registration */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setShowGoogleAccounts(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{lang === "te" ? "గూగుల్ నుండి వివరాలను నింపండి" : "Auto-fill with Google Account"}</span>
              </button>
            </div>

            {/* SECTION 1: CREDENTIALS */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block border-b border-stone-200 dark:border-stone-800 pb-1">
                1. Farmer Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Farmer Name / రైతు పేరు *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ashfaq Mohammed"
                    required
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Gmail / Email ID *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. bioashfaq123@gmail.com"
                    required
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create password"
                      required
                      className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 pr-9 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="98480 12345"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: FIELD SETUP & PARAMETERS */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block border-b border-stone-200 dark:border-stone-800 pb-1">
                2. Field &amp; Agronomy Setup
              </span>

              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  District / జిల్లా *
                </label>
                <div className="relative">
                  <select
                    value={regDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border-2 border-emerald-600/80 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white font-semibold focus:outline-none pr-9"
                  >
                    {districtNames.map((d) => (
                      <option key={d} value={d}>
                        {d} ({TELANGANA_DISTRICTS[d]?.nameTe || d})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 dark:text-emerald-400 pointer-events-none" />
                </div>
              </div>

              {/* Mandal & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Mandal / మండలం
                  </label>
                  <input
                    type="text"
                    value={regMandal}
                    onChange={(e) => setRegMandal(e.target.value)}
                    placeholder="Mandal"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Village / గ్రామం
                  </label>
                  <input
                    type="text"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    placeholder="Village"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Land Area: Acres & Guntas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Land Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={regAreaAcre}
                    onChange={(e) => setRegAreaAcre(e.target.value)}
                    placeholder="4.0"
                    required
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Guntas (0–39)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="39"
                    value={regAreaGunta}
                    onChange={(e) => setRegAreaGunta(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Primary Crop */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Crop / ప్రధాన పంట *
                </label>
                <div className="relative">
                  <select
                    value={regPrimaryCrop}
                    onChange={(e) => setRegPrimaryCrop(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:border-emerald-600 focus:outline-none pr-9"
                  >
                    <option value="Paddy (RNR 15048 / Telangana Sona)">Paddy — RNR 15048 / Telangana Sona (వరి)</option>
                    <option value="Paddy (BPT 5204 / Samba Mahsuri)">Paddy — BPT 5204 / Samba Mahsuri (సాంబ మసూరి)</option>
                    <option value="Cotton (ప్రత్తి)">Cotton / ప్రత్తి</option>
                    <option value="Red Chilli (ఎర్ర మిరప)">Red Chilli / ఎర్ర మిరప</option>
                    <option value="Maize (మొక్కజొన్న)">Maize / మొక్కజొన్న</option>
                    <option value="Red Gram / Pigeon Pea (కందులు)">Red Gram / కందులు</option>
                    <option value="Turmeric (పసుపు)">Turmeric / పసుపు</option>
                    <option value="Soybean (సోయాబీన్)">Soybean / సోయాబీన్</option>
                    <option value="Vegetables / Horticulture (కూరగాయలు)">Vegetables / కూరగాయలు</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Soil Type & Irrigation Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Soil Type / నేల రకం
                  </label>
                  <select
                    value={regSoilType}
                    onChange={(e) => setRegSoilType(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white"
                  >
                    <option value="Red Sandy Loam (చల్కా నేలలు)">Red Sandy Loam (ఎర్ర చల్కా నేలలు)</option>
                    <option value="Black Cotton Soil (నల్ల రేగడి నేలలు)">Black Cotton Soil (నల్ల రేగడి నేలలు)</option>
                    <option value="Clay Loam (జిగురు నేలలు)">Clay Loam (జిగురు నేలలు)</option>
                    <option value="Alluvial / Sandy Soil (ఇసుక నేలలు)">Alluvial Soil (ఇసుక నేలలు)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Irrigation Source / నీటి పారుదల
                  </label>
                  <select
                    value={regIrrigationType}
                    onChange={(e) => setRegIrrigationType(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white"
                  >
                    <option value="3 HP Submersible Borewell">3 HP Submersible Borewell</option>
                    <option value="5 HP Submersible Borewell">5 HP Submersible Borewell</option>
                    <option value="Solar Drip Irrigation">Solar Drip Irrigation (బిందు సేద్యం)</option>
                    <option value="Canal / Tank Water (కాల్వ/చెరువు)">Canal / Tank Water (కాల్వ/చెరువు)</option>
                    <option value="Open Well (బావి)">Open Well (బావి)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Registration Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] mt-3"
            >
              <Sprout className="w-4 h-4" />
              <span>{lang === "te" ? "రైతు నమోదును పూర్తి చేసి డాష్‌బోర్డ్ తెరవండి" : "Complete Registration & Create Farm Profile"}</span>
            </button>

            {/* Switch back to Login */}
            <div className="pt-1 text-center text-xs text-stone-500">
              <span>{lang === "te" ? "ఇప్పటికే ఖాతా ఉందా?" : "Already registered?"} </span>
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMsg("");
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                {lang === "te" ? "గూగుల్ లేదా పాస్‌వర్డ్‌తో లాగిన్ అవ్వండి →" : "Sign In with Google or Password →"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* GOOGLE ACCOUNT SELECTOR MODAL */}
      {showGoogleAccounts && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-bold text-sm text-stone-900 dark:text-white">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleAccounts(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Choose an account to continue to <b>Smart Farm Assistant</b>:
            </p>

            {/* List of Detected Google Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (tab === "register") {
                    handleGooglePreFillRegister("bioashfaq123@gmail.com", "Ashfaq Mohammed");
                  } else {
                    executeGoogleLogin("bioashfaq123@gmail.com", "Ashfaq Mohammed");
                  }
                }}
                className="w-full p-3 rounded-2xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-left flex items-center gap-3 transition"
              >
                <div className="h-9 w-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  AM
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                    Ashfaq Mohammed
                  </span>
                  <span className="block text-[11px] text-stone-500 truncate">
                    bioashfaq123@gmail.com
                  </span>
                </div>
              </button>

              {/* Enter custom Google account option */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full p-3 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 text-center transition"
                >
                  + Use another Google account
                </button>
              ) : (
                <div className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    Enter any Gmail address:
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="farmer.name@gmail.com"
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGoogleEmail.trim() || !customGoogleEmail.includes("@")) {
                        setErrorMsg("Please enter a valid Gmail address");
                        return;
                      }
                      const namePart = customGoogleEmail.split("@")[0].replace(/[._]/g, " ");
                      if (tab === "register") {
                        handleGooglePreFillRegister(customGoogleEmail, namePart);
                      } else {
                        executeGoogleLogin(customGoogleEmail, namePart);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                  >
                    Continue with this Gmail
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
