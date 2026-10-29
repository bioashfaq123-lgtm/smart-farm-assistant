"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Globe, Sprout, MapPin, Wifi, WifiOff, LogIn, Compass } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../common/LanguageContext";
import { useTheme } from "../common/ThemeContext";
import { useFarmerProfile } from "../common/FarmerProfileContext";

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { profile, openProfileModal, openAuthModal, isLoggedIn } = useFarmerProfile();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-white/80 px-4 backdrop-blur-md md:px-8 dark:border-stone-800/80 dark:bg-stone-950/80">
      {/* Left: Mobile Title or Desktop Location Indicator */}
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-xs border border-emerald-500/30 md:hidden">
          <img
            src="/images/smart_farm_app_icon.jpg"
            alt="Smart Farm Assistant Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-base font-bold text-stone-900 md:hidden dark:text-stone-50 truncate max-w-[150px]">
            {t("app_title")}
          </h2>
          {/* Network Status Chip & District Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {isOnline ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/80 text-[11px]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live (Online)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/80 text-[11px]">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span>Offline (Pre-cached)</span>
              </span>
            )}
            <button
              onClick={openProfileModal}
              className="hidden sm:inline-flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-emerald-700 font-semibold"
              title="Click to change your farm district"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>{profile.district}, Telangana</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Action Controls: Language Toggle & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Bilingual Switcher Button */}
        <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-900">
          <button
            onClick={() => setLang("en")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              lang === "en"
                ? "bg-white text-agri-800 shadow-xs dark:bg-stone-800 dark:text-agri-300"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>EN</span>
          </button>
          <button
            onClick={() => setLang("te")}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              lang === "te"
                ? "bg-white text-agri-800 shadow-xs dark:bg-stone-800 dark:text-agri-300"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <span>తెలుగు</span>
          </button>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-850"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-stone-600" />
          )}
        </button>

        {/* Explore Showcase Link */}
        <Link
          href="/landing"
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200/90 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          title="View Platform Showcase & Features"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Showcase</span>
        </Link>

        {/* Login / Register / Farmer Profile Pill */}
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-xs"
          title="Login / Register or Switch Farmer Profile"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span className="max-w-[120px] truncate">
            {profile.name ? profile.name : "Login"}
          </span>
        </button>
      </div>
    </header>
  );
}
