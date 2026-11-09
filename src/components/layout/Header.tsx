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
import { InstallAppButton } from "../common/PWAInstallContext";

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
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-3 backdrop-blur-md sm:px-6 md:px-8 dark:border-stone-800/80 dark:bg-stone-950/95 transition-colors">
        {/* Left: Mobile Branding or Desktop Location Indicator */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink">
          {/* Mobile App Icon */}
          <Link
            href="/"
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-xs border border-emerald-500/30 md:hidden block hover:opacity-90 transition active:scale-95"
            title="Go to Homepage"
          >
            <img
              src="/images/smart_farm_app_icon.jpg"
              alt="Smart Farm Assistant Logo"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="min-w-0">
            {/* Title on Mobile (Hidden on Desktop where DesktopSidebar displays it) */}
            <Link href="/" className="block md:hidden">
              <h1 className="text-sm sm:text-base font-extrabold text-stone-950 dark:text-stone-50 truncate leading-tight tracking-tight">
                {t("app_title")}
              </h1>
            </Link>

            {/* Network Status Chip & District Indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
              {isOnline ? (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/80 text-[10px] sm:text-[11px] shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden xs:inline">Live</span>
                  <span>Online</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/80 text-[10px] sm:text-[11px] shrink-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Offline</span>
                </span>
              )}

              {/* District Indicator */}
              <button
                onClick={openProfileModal}
                className="inline-flex items-center gap-1 text-stone-600 dark:text-stone-400 hover:text-emerald-700 font-semibold truncate text-[11px] sm:text-xs max-w-[110px] sm:max-w-[200px]"
                title="Click to change your farm district"
              >
                <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                <span className="truncate">{profile.district || "Telangana"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Action Controls: Language, Theme, Install, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Bilingual Switcher Button (Compact on mobile) */}
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-100/90 p-0.5 dark:border-stone-800 dark:bg-stone-900 shrink-0">
            <button
              onClick={() => setLang("en")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                lang === "en"
                  ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang("te")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                lang === "te"
                  ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
              title="తెలుగు భాషకు మార్చండి"
            >
              <span className="inline sm:hidden">తె</span>
              <span className="hidden sm:inline">తెలుగు</span>
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-850 shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-stone-600" />
            )}
          </button>

          {/* Explore Showcase Link (Desktop only) */}
          <Link
            href="/"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200/90 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
            title="View Platform Showcase & Features"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Showcase</span>
          </Link>

          {/* Direct Install App Button (Auto-hidden if user already installed) */}
          <InstallAppButton variant="compact" />

          {/* Login / Register / Farmer Profile & Logout */}
          {isLoggedIn && profile.name ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={openProfileModal}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-2xs hover:scale-102 active:scale-95"
                title="Farmer Profile & Settings"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-800 dark:bg-emerald-900 flex items-center justify-center text-[10px] font-black uppercase text-white shadow-2xs">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate text-xs font-semibold">
                  {profile.name}
                </span>
              </button>

              {/* Logout button (Desktop) */}
              <button
                type="button"
                onClick={logout}
                className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold text-xs transition shadow-2xs"
                title="Logout from this account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>{lang === "te" ? "లాగ్ అవుట్" : "Logout"}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-2xs shrink-0"
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
