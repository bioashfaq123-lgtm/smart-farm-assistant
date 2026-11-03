"use client";

import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Globe,
  MapPin,
  LogIn,
  Compass,
  LogOut,
  User,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../common/LanguageContext";
import { useTheme } from "../common/ThemeContext";
import { useFarmerProfile } from "../common/FarmerProfileContext";
import { MobileFeaturesDrawer } from "./MobileFeaturesDrawer";

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { profile, openProfileModal, openAuthModal, isLoggedIn, logout } = useFarmerProfile();
  const [isOnline, setIsOnline] = useState(true);
  const [isFeaturesDrawerOpen, setIsFeaturesDrawerOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-white/80 px-3 backdrop-blur-md sm:px-6 md:px-8 dark:border-stone-800/80 dark:bg-stone-950/80">
        {/* Left: Mobile Title or Desktop Location Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-xs border border-emerald-500/30 md:hidden">
            <img
              src="/images/smart_farm_app_icon.jpg"
              alt="Smart Farm Assistant Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-stone-900 md:hidden dark:text-stone-50 truncate max-w-[140px] sm:max-w-[200px]">
              {t("app_title")}
            </h2>
            {/* Network Status Chip & District Indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
              {isOnline ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/80 text-[10px] sm:text-[11px] shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden xs:inline">Live</span>
                  <span>Online</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/80 text-[10px] sm:text-[11px] shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Offline</span>
                </span>
              )}
              <button
                onClick={openProfileModal}
                className="hidden sm:inline-flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-emerald-700 font-semibold truncate text-xs"
                title="Click to change your farm district"
              >
                <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                <span className="truncate">{profile.district}, Telangana</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Action Controls: Features Trigger, Language, Theme, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile All Features Trigger Pill */}
          <button
            type="button"
            onClick={() => setIsFeaturesDrawerOpen(true)}
            className="flex md:hidden items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs hover:bg-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 transition"
            title="Explore all 10 platform features"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px]">{lang === "te" ? "ఫీచర్లు" : "Features"}</span>
            <span className="rounded-full bg-emerald-600 px-1 text-[8px] font-extrabold text-white">10</span>
          </button>

          {/* Bilingual Switcher Button */}
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-0.5 dark:border-stone-800 dark:bg-stone-900">
            <button
              onClick={() => setLang("en")}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                lang === "en"
                  ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              <Globe className="h-3 w-3" />
              <span>EN</span>
            </button>
            <button
              onClick={() => setLang("te")}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                lang === "te"
                  ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
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
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-850"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-stone-600" />
            )}
          </button>

          {/* Explore Showcase Link (Desktop) */}
          <Link
            href="/"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200/90 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
            title="View Platform Showcase & Features"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Showcase</span>
          </Link>

          {/* Login / Register / Farmer Profile & Logout Pill */}
          {isLoggedIn && profile.name ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={openProfileModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-2xs"
                title="Farmer Profile & Settings"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] sm:max-w-[110px] truncate">{profile.name}</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold text-xs transition shadow-2xs"
                title="Logout from this account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden md:inline">{lang === "te" ? "లాగ్ అవుట్" : "Logout"}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-2xs"
              title="Login / Register"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">
                {lang === "te" ? "లాగిన్" : "Login"}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Features Drawer */}
      <MobileFeaturesDrawer
        isOpen={isFeaturesDrawerOpen}
        onClose={() => setIsFeaturesDrawerOpen(false)}
      />
    </>
  );
}
