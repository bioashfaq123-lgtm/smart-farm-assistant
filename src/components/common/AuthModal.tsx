"use client";

import React, { useState } from "react";
import { X, Sprout, Key, CheckCircle, ArrowRight, Phone, Mail, MapPin, User } from "lucide-react";
import { QUICK_DEMO_FARMERS, DemoFarmer } from "@/lib/auth/demoProfiles";
import { useFarmerProfile } from "./FarmerProfileContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { profile, updateProfile, loginWithDemo } = useFarmerProfile();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [contactInput, setContactInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regState, setRegState] = useState("Telangana");
  const [regDistrict, setRegDistrict] = useState("Jagtial");
  const [regVillage, setRegVillage] = useState("Mallapur");
  const [regCrop, setRegCrop] = useState("Paddy (RNR 15048 / Telangana Sona)");
  const [regAcres, setRegAcres] = useState(4.0);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) {
      setErrorMsg("Please enter a valid email address or 10-digit mobile number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setSuccessMsg(`OTP sent to ${contactInput}! (For instant testing use OTP: 123456)`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length < 4) {
      setErrorMsg("Please enter the 6-digit OTP (e.g. 123456)");
      return;
    }

    // Determine if email or phone
    const isEmail = contactInput.includes("@");
    updateProfile({
      name: profile.name || "Kisan Sathi",
      email: isEmail ? contactInput : profile.email || "farmer@smartfarm.telangana",
      phone: !isEmail ? contactInput : profile.phone || "+91 98480 12345",
      isCustom: true,
      hasCompletedOnboarding: true,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("smartfarm_logged_in", "true");
    }

    setSuccessMsg("Welcome! Successfully logged in.");
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!regContact.trim()) {
      setErrorMsg("Please enter your phone or email");
      return;
    }

    const isEmail = regContact.includes("@");
    updateProfile({
      name: regName.trim(),
      email: isEmail ? regContact : undefined,
      phone: !isEmail ? regContact : undefined,
      state: regState,
      district: regDistrict,
      village: regVillage,
      primaryCrop: regCrop,
      areaAcre: Number(regAcres) || 4.0,
      isCustom: true,
      hasCompletedOnboarding: true,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("smartfarm_logged_in", "true");
    }

    setSuccessMsg(`Welcome, ${regName}! Your farmer account is registered.`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleSelectDemo = (farmer: DemoFarmer) => {
    loginWithDemo(farmer);
    setSuccessMsg(`Logged in as ${farmer.name} (${farmer.state})`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 p-6 text-stone-900 dark:text-stone-100"
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
        <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg("");
              setOtpSent(false);
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
              setOtpSent(false);
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

        {/* LOGIN TAB CONTENT */}
        {tab === "login" && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    placeholder="your.email@example.com or 9876543210"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:border-emerald-400"
                  />
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                    Enter your email address or phone number to receive OTP
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Send OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-lg font-bold rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                    <span>Sent to: {contactInput}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-emerald-700 dark:text-emerald-400 underline font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify OTP & Enter</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* REGISTER TAB CONTENT */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Farmer Full Name / రైతు పేరు
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Ramesh Reddy"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                value={regContact}
                onChange={(e) => setRegContact(e.target.value)}
                placeholder="9876543210 or your.email@example.com"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  State / రాష్ట్రం
                </label>
                <select
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-2.5 py-2 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                >
                  <option value="Telangana">Telangana (తెలంగాణ)</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  District / జిల్లా
                </label>
                <input
                  type="text"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  placeholder="e.g. Jagtial"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-2.5 py-2 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Crop / ప్రధాన పంట
                </label>
                <select
                  value={regCrop}
                  onChange={(e) => setRegCrop(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-2.5 py-2 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                >
                  <option value="Paddy (RNR 15048 / Telangana Sona)">Paddy (వరి / RNR 15048)</option>
                  <option value="Cotton (ప్రత్తి)">Cotton (ప్రత్తి)</option>
                  <option value="Chilli (మిర్చి)">Chilli (మిర్చి)</option>
                  <option value="Maize (మొక్కజొన్న)">Maize (మొక్కజొన్న)</option>
                  <option value="Redgram (కందులు)">Redgram (కందులు)</option>
                  <option value="Turmeric (పసుపు)">Turmeric (పసుపు)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Land Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={regAcres}
                  onChange={(e) => setRegAcres(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-2.5 py-2 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              <Sprout className="w-4 h-4" />
              <span>Create Farmer Account</span>
            </button>
          </form>
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

        {/* DEMO LOGIN CARDS (MATCHING REFERENCE EXACTLY) */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
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
