"use client";

import React, { useState } from "react";
import { X, Sprout, Key, CheckCircle, Mail, MapPin, User, ChevronDown } from "lucide-react";
import { QUICK_DEMO_FARMERS, DemoFarmer } from "@/lib/auth/demoProfiles";
import { useFarmerProfile } from "./FarmerProfileContext";
import { useLanguage } from "./LanguageContext";
import { TELANGANA_DISTRICTS } from "@/lib/profile/farmerProfile";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { profile, updateProfile, loginWithDemo } = useFarmerProfile();
  const { setLang } = useLanguage();

  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // Login State (Email-only authentication)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpInput, setLoginOtpInput] = useState("");

  // Register Form State (Matching uploaded registration screenshot)
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [farmSizeAcres, setFarmSizeAcres] = useState<string>("0");
  const [preferredLang, setPreferredLang] = useState<"English" | "Telugu (తెలుగు)" | "Hindi (हिंदी)" | "Malayalam (മലയാളം)">("English");

  const [registerOtpSent, setRegisterOtpSent] = useState(false);
  const [registerOtpInput, setRegisterOtpInput] = useState("");

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  // Validate Email
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email.trim());
  };

  // Helper to parse Location into District and State
  const parseLocation = (locStr: string) => {
    if (!locStr.trim()) return { district: "Jagtial", state: "Telangana" };
    const parts = locStr.split(",").map((s) => s.trim());
    let districtCandidate = parts[0] || "Jagtial";
    let stateCandidate = parts[1] || "Telangana";

    // Check if districtCandidate matches any known Telangana district
    const matchedTs = Object.keys(TELANGANA_DISTRICTS).find(
      (d) => d.toLowerCase() === districtCandidate.toLowerCase()
    );
    if (matchedTs) {
      districtCandidate = matchedTs;
      stateCandidate = "Telangana";
    }

    return { district: districtCandidate, state: stateCandidate };
  };

  // LOGIN: Send OTP to Email
  const handleSendLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !isValidEmail(loginEmail)) {
      setErrorMsg("Please enter a valid email address (e.g. your.email@example.com)");
      return;
    }
    setErrorMsg("");
    setLoginOtpSent(true);
    setSuccessMsg(`Secure OTP sent to ${loginEmail}! (Demo verification code: 123456)`);
  };

  // LOGIN: Verify Email OTP
  const handleVerifyLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginOtpInput.trim() || loginOtpInput.trim().length < 4) {
      setErrorMsg("Please enter the 6-digit code (e.g. 123456)");
      return;
    }

    updateProfile({
      name: profile.name && profile.name !== "Kisan Sathi" ? profile.name : loginEmail.split("@")[0],
      email: loginEmail.trim().toLowerCase(),
      isCustom: true,
      hasCompletedOnboarding: true,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("smartfarm_logged_in", "true");
    }

    setSuccessMsg("Welcome! Successfully logged in with Email ID.");
    setTimeout(() => {
      onClose();
    }, 700);
  };

  // REGISTER: Send OTP to Email
  const handleSendRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Please enter your Full Name *");
      return;
    }
    if (!registerEmail.trim() || !isValidEmail(registerEmail)) {
      setErrorMsg("Please enter a valid Email ID * (e.g. your.email@example.com)");
      return;
    }

    setErrorMsg("");
    setRegisterOtpSent(true);
    setSuccessMsg(`OTP sent to ${registerEmail}! (Demo verification code: 123456)`);
  };

  // REGISTER: Verify Email OTP & Complete Registration
  const handleVerifyRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerOtpInput.trim() || registerOtpInput.trim().length < 4) {
      setErrorMsg("Please enter the 6-digit code (e.g. 123456)");
      return;
    }

    const { district, state } = parseLocation(location);
    const parsedAcres = parseFloat(farmSizeAcres) || 4.0;

    // Apply preferred language
    if (preferredLang.includes("Telugu")) {
      setLang("te");
    } else {
      setLang("en");
    }

    updateProfile({
      name: fullName.trim(),
      email: registerEmail.trim().toLowerCase(),
      phone: phoneNumber.trim() || undefined,
      district,
      state,
      location: location.trim() || `${district}, ${state}`,
      areaAcre: parsedAcres > 0 ? parsedAcres : 4.0,
      preferredLanguage: preferredLang,
      isCustom: true,
      hasCompletedOnboarding: true,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("smartfarm_logged_in", "true");
    }

    setSuccessMsg(`Welcome, ${fullName.trim()}! Your farmer account is registered.`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // DEMO LOGIN: 1-Click Profile Selection
  const handleSelectDemo = (farmer: DemoFarmer) => {
    loginWithDemo(farmer);
    if (farmer.languageBadge.includes("Telugu")) {
      setLang("te");
    } else {
      setLang("en");
    }
    setSuccessMsg(`Logged in as ${farmer.name} (${farmer.email})`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 p-6 text-stone-900 dark:text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              FarmConnect
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Join our agricultural community platform
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 p-3 text-xs text-red-700 dark:text-red-300">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Segmented Tab Switcher (Login / Register) */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg("");
              setLoginOtpSent(false);
              setRegisterOtpSent(false);
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === "login"
                ? "bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setErrorMsg("");
              setLoginOtpSent(false);
              setRegisterOtpSent(false);
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === "register"
                ? "bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-white"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* TAB 1: LOGIN (EMAIL ONLY AUTH) */}
        {tab === "login" && (
          <div>
            {!loginOtpSent ? (
              <form onSubmit={handleSendLoginOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:border-emerald-400"
                  />
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                    Enter your email address to receive secure OTP verification
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Send OTP to Email</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Enter 6-Digit Email Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={loginOtpInput}
                    onChange={(e) => setLoginOtpInput(e.target.value)}
                    placeholder="123456"
                    autoFocus
                    className="w-full text-center tracking-widest text-lg font-bold rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                    <span>Sent to: {loginEmail}</span>
                    <button
                      type="button"
                      onClick={() => setLoginOtpSent(false)}
                      className="text-emerald-700 dark:text-emerald-400 underline font-medium"
                    >
                      Change Email
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Email OTP & Enter</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: REGISTER (MATCHING USER SCREENSHOT EXACTLY) */}
        {tab === "register" && (
          <div>
            {!registerOtpSent ? (
              <form onSubmit={handleSendRegisterOtp} className="space-y-3.5">
                {/* Full Name * */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                {/* Email * */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                    OTP will be sent to your email ID for secure, instant verification
                  </p>
                </div>

                {/* Location and Farm Size (acres) in 2-Column Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Farm Size (acres)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={farmSizeAcres}
                      onChange={(e) => setFarmSizeAcres(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Preferred Language Dropdown (Styled with Green Accent) */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as any)}
                      className="w-full appearance-none rounded-xl border-2 border-emerald-600/90 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:outline-none dark:border-emerald-500 dark:bg-stone-800 dark:text-white"
                    >
                      <option value="English">English</option>
                      <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                      <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                      <option value="Malayalam (മലയാളം)">Malayalam (മലയാളം)</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 dark:text-emerald-400 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Send OTP to Email</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyRegisterOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Enter 6-Digit Email Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={registerOtpInput}
                    onChange={(e) => setRegisterOtpInput(e.target.value)}
                    placeholder="123456"
                    autoFocus
                    className="w-full text-center tracking-widest text-lg font-bold rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                    <span>Sent to: {registerEmail}</span>
                    <button
                      type="button"
                      onClick={() => setRegisterOtpSent(false)}
                      className="text-emerald-700 dark:text-emerald-400 underline font-medium"
                    >
                      Change Details
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Email & Complete Registration</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* SECTION DIVIDER: Quick Demo Login */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 font-semibold text-stone-600 dark:bg-stone-900 dark:text-stone-400">
              Quick Demo Login
            </span>
          </div>
        </div>

        {/* DEMO LOGIN CARDS (EXACT MATCH TO REFERENCE) */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {QUICK_DEMO_FARMERS.map((farmer) => (
            <button
              key={farmer.id}
              type="button"
              onClick={() => handleSelectDemo(farmer)}
              className="w-full text-left rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-850 p-3 hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20 transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  {farmer.nameDisplay}
                </span>
                <span className="rounded-full border border-stone-300 dark:border-stone-700 px-2.5 py-0.5 text-[11px] font-medium text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800">
                  {farmer.languageBadge}
                </span>
              </div>
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-2">
                {farmer.email}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {farmer.crops.map((crop, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:text-stone-300"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
