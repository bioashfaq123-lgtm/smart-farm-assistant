"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Activity,
  TrendingUp,
  Wrench,
  Sparkles,
  MapPin,
  ShieldCheck,
  Presentation,
  Landmark,
  Compass,
  Stethoscope,
  LogIn,
  LogOut,
} from "lucide-react";
import { useLanguage } from "../common/LanguageContext";
import { useFarmerProfile } from "../common/FarmerProfileContext";
import { getFeatureSectionGroups } from "@/lib/navigation/features";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const { profile, openProfileModal, openAuthModal, isLoggedIn, logout } = useFarmerProfile();

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "🌾";

  const sectionGroups = getFeatureSectionGroups();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-stone-200/90 bg-white/95 backdrop-blur-md md:flex dark:border-stone-800/80 dark:bg-stone-950/95">
      {/* Brand Top Header */}
      <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4 dark:border-stone-800/80 shrink-0">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-md border border-emerald-500/30">
          <img
            src="/images/smart_farm_app_icon.jpg"
            alt="Smart Farm Assistant Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-extrabold tracking-tight text-stone-900 dark:text-white truncate">
            {t("app_title")}
          </span>
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">
            Telangana Rythu Portal
          </p>
        </div>
      </div>

      {/* Categorized Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        {sectionGroups.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Category Section Header */}
            <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {lang === "te" ? section.titleTe : section.titleEn}
            </div>

            {/* Section Features */}
            {section.features.map((feature) => {
              const Icon = feature.icon;
              const isActive =
                pathname === feature.href ||
                (feature.href === "/" && (pathname === "/" || pathname === "/landing")) ||
                (feature.href === "/dashboard" && pathname === "/dashboard");

              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs dark:bg-emerald-600 dark:text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-stone-400 group-hover:text-emerald-600 dark:text-stone-500 dark:group-hover:text-emerald-400"
                      }`}
                    />
                    <span className="truncate">
                      {lang === "te" ? feature.titleTe : feature.titleEn}
                    </span>
                  </div>

                  {feature.badge && (
                    <span
                      className={`ml-1.5 shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                        isActive
                          ? "bg-emerald-800 text-emerald-100 dark:bg-emerald-700"
                          : feature.badgeColor || "bg-stone-100 text-stone-600 dark:bg-stone-850 dark:text-stone-400"
                      }`}
                    >
                      {feature.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Dynamic Farmer Profile Pill at Bottom (Opens Setup Modal on Click) */}
      <div className="border-t border-stone-100 p-3.5 dark:border-stone-800/80 shrink-0 bg-stone-50/50 dark:bg-stone-900/30">
        <button
          onClick={openProfileModal}
          className="w-full text-left flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-stone-100 dark:hover:bg-stone-900 group"
          title="Click to edit farmer profile & field setup"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-xs group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-stone-900 truncate dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {profile.name || (lang === "te" ? "రైతు ప్రొఫైల్ నమోదు" : "Set Up Farm Profile")}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-stone-500 truncate dark:text-stone-400">
              <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
              <span>
                {profile.name
                  ? `${profile.village}, ${profile.district}`
                  : (lang === "te" ? "వివరాలు జోడించండి" : "Click to configure")}
              </span>
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="flex-1 text-center py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 transition flex items-center justify-center gap-1 shadow-2xs"
            title="Switch to another farmer account or demo"
          >
            <LogIn className="w-3 h-3" />
            <span>
              {isLoggedIn && profile.name
                ? (lang === "te" ? "ఖాతా మార్చండి" : "Switch Account")
                : (lang === "te" ? "లాగిన్" : "Login")}
            </span>
          </button>

          {isLoggedIn && profile.name && (
            <button
              type="button"
              onClick={logout}
              className="py-1.5 px-2.5 rounded-lg text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900 transition flex items-center justify-center gap-1 shadow-2xs"
              title="Logout from this account"
            >
              <LogOut className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              <span>{lang === "te" ? "లాగ్ అవుట్" : "Logout"}</span>
            </button>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
          <Link
            href="/admin"
            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 transition group"
          >
            <span className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              Farm Assistant Admin
            </span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-1 py-0.5 rounded">
              Traffic
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
