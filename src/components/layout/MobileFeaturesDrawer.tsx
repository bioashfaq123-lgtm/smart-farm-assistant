"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Search,
  Sparkles,
  ArrowRight,
  User,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import {
  PLATFORM_FEATURES,
  FEATURE_CATEGORIES,
  PlatformFeature,
} from "@/lib/navigation/features";
import { useLanguage } from "../common/LanguageContext";
import { useFarmerProfile } from "../common/FarmerProfileContext";

interface MobileFeaturesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFeaturesDrawer({ isOpen, onClose }: MobileFeaturesDrawerProps) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const { profile, openProfileModal, openAuthModal, isLoggedIn, logout } = useFarmerProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter features based on search query and category
  const filteredFeatures = useMemo(() => {
    return PLATFORM_FEATURES.filter((feature) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "ai" && feature.category !== "ai") return false;
        if (selectedCategory === "iot" && feature.category !== "iot") return false;
        if (selectedCategory === "market" && feature.category !== "market") return false;
        if (selectedCategory === "tools" && feature.category !== "tools") return false;
      }

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        feature.titleEn.toLowerCase().includes(q) ||
        feature.titleTe.toLowerCase().includes(q) ||
        feature.descriptionEn.toLowerCase().includes(q) ||
        feature.descriptionTe.toLowerCase().includes(q) ||
        (feature.badge && feature.badge.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="features-hub-title"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Drawer Surface */}
      <div
        className="flex h-[90vh] max-h-[92vh] w-full flex-col rounded-t-3xl border-t border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-950 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle / top bar */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 dark:border-stone-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="features-hub-title"
                className="text-base font-bold text-stone-900 dark:text-white"
              >
                {lang === "te" ? "అన్ని వ్యవసాయ ఫీచర్లు (10)" : "All Platform Features (10)"}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lang === "te"
                  ? "తెలంగాణ రైతులకు అవసరమైన సాధనాలు"
                  : "Tap any feature to launch instantly"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close features menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-2.5 border-b border-stone-100 bg-stone-50/80 p-3.5 dark:border-stone-800/80 dark:bg-stone-900/60">
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "te"
                  ? "ఫీచర్ లేదా సాధనం వెతకండి (ఉదా: తెగుళ్లు, పంపు, ఎరువులు)..."
                  : "Search features (e.g., disease, pump, mandi, calculator)..."
              }
              className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-9 text-xs font-medium text-stone-900 placeholder-stone-400 shadow-2xs focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {FEATURE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-2xs dark:bg-emerald-600"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800"
                  }`}
                >
                  {lang === "te" ? cat.labelTe : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Feature Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredFeatures.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                {lang === "te"
                  ? "మీ శోధనకు తగిన ఫీచర్లు కనిపించలేదు"
                  : "No features found matching your search"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline"
              >
                {lang === "te" ? "అన్ని ఫీచర్లను చూపించు" : "Reset filters & show all"}
              </button>
            </div>
          ) : (
            filteredFeatures.map((feature) => {
              const Icon = feature.icon;
              const isActive =
                pathname === feature.href ||
                (feature.href === "/" && (pathname === "/" || pathname === "/landing"));

              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  onClick={onClose}
                  className={`group flex items-start gap-3.5 rounded-2xl border p-3 transition-all ${
                    isActive
                      ? "border-emerald-600 bg-emerald-50/70 shadow-xs dark:border-emerald-500/80 dark:bg-emerald-950/40"
                      : "border-stone-200/90 bg-white hover:border-emerald-400 hover:bg-stone-50/80 dark:border-stone-800 dark:bg-stone-900/90 dark:hover:border-stone-700 dark:hover:bg-stone-850/80"
                  }`}
                >
                  {/* Icon Tile */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs transition-transform group-hover:scale-105 ${feature.accentBg} ${feature.accentText} ${feature.accentBorder}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Feature Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                          {lang === "te" ? feature.titleTe : feature.titleEn}
                        </span>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500">
                          ({lang === "te" ? feature.titleEn : feature.titleTe})
                        </span>
                      </div>
                      {feature.badge && (
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            feature.badgeColor || "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                          }`}
                        >
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-stone-500 dark:text-stone-400 line-clamp-2">
                      {lang === "te" ? feature.descriptionTe : feature.descriptionEn}
                    </p>
                  </div>

                  {/* Navigation Arrow */}
                  <div className="self-center pl-1 text-stone-300 group-hover:text-emerald-600 dark:text-stone-600 dark:group-hover:text-emerald-400 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Bottom Drawer Footer: Profile & Account Controls */}
        <div className="border-t border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/90 space-y-2.5">
          {isLoggedIn && profile.name ? (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onClose();
                  openProfileModal();
                }}
                className="flex items-center gap-2 text-left min-w-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-2xs">
                  {profile.name[0]?.toUpperCase() || "🌾"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {profile.village}, {profile.district}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal("login");
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {lang === "te" ? "ఖాతా మార్చండి" : "Switch"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{lang === "te" ? "లాగ్ అవుట్" : "Logout"}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal("login");
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === "te" ? "రైతు లాగిన్ / ఖాతా తెరవండి" : "Farmer Login / Create Account"}</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-stone-800">
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Traffic</span>
            </Link>
            <span>v2.4 &bull; Telangana Rythu Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

