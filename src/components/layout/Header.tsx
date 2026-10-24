"use client";

import React from "react";
import { Moon, Sun, Globe, Sprout } from "lucide-react";
import { useLanguage } from "../common/LanguageContext";
import { useTheme } from "../common/ThemeContext";

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-white/80 px-4 backdrop-blur-md md:px-8 dark:border-stone-800/80 dark:bg-stone-950/80">
      {/* Left: Mobile Title or Desktop Location Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-agri-700 text-white md:hidden dark:bg-agri-600">
          <Sprout className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-stone-900 md:hidden dark:text-stone-50 truncate max-w-[180px]">
            {t("app_title")}
          </h2>
          <div className="hidden items-center gap-2 text-xs text-stone-500 md:flex dark:text-stone-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {t("live_badge")}
            </span>
            <span>• Jagtial, Telangana</span>
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
      </div>
    </header>
  );
}
