"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Activity,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "../common/LanguageContext";
import { MobileFeaturesDrawer } from "./MobileFeaturesDrawer";

export function BottomNav() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Core 4 primary tabs for daily farmer routines
  const primaryTabs = [
    {
      href: "/dashboard",
      labelEn: "Dashboard",
      labelTe: "డాష్‌బోర్డ్",
      icon: LayoutDashboard,
    },
    {
      href: "/diagnosis",
      labelEn: "Diagnosis",
      labelTe: "రోగ నిర్ధారణ",
      icon: Stethoscope,
      badge: "AI",
    },
    {
      href: "/iot",
      labelEn: "IoT Pump",
      labelTe: "ఐఓటీ పంపు",
      icon: Activity,
    },
    {
      href: "/market",
      labelEn: "Mandi Rates",
      labelTe: "మార్కెట్",
      icon: TrendingUp,
    },
  ];

  // Check if current page is one of the "More Features" pages
  const isMorePageActive = [
    "/advisory",
    "/schemes",
    "/insights",
    "/tools",
    "/demo",
    "/landing",
    "/admin",
  ].some((route) => pathname.startsWith(route));

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-stone-200/90 bg-white/95 px-2 pb-safe backdrop-blur-md md:hidden dark:border-stone-800/80 dark:bg-stone-950/95"
      >
        {primaryTabs.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[48px] min-w-[56px] flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 text-center transition-all ${
                isActive
                  ? "font-bold text-emerald-700 dark:text-emerald-400"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110 stroke-[2.5]" : "scale-100 stroke-[1.8]"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 rounded-full bg-purple-600 px-1 text-[8px] font-bold text-white leading-none py-0.5">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </div>
              <span className="mt-1 text-[11px] tracking-tight truncate max-w-[68px]">
                {lang === "te" ? item.labelTe : item.labelEn}
              </span>
            </Link>
          );
        })}

        {/* 5th Tab: All Features Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`flex min-h-[48px] min-w-[56px] flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 text-center transition-all ${
            isMorePageActive || isDrawerOpen
              ? "font-bold text-emerald-700 dark:text-emerald-400"
              : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          }`}
          aria-label="Open all platform features menu"
        >
          <div className="relative">
            <LayoutGrid
              className={`h-5 w-5 transition-transform ${
                isMorePageActive || isDrawerOpen
                  ? "scale-110 stroke-[2.5]"
                  : "scale-100 stroke-[1.8]"
              }`}
            />
            <span className="absolute -top-1 -right-2 rounded-full bg-emerald-600 px-1 text-[8px] font-extrabold text-white leading-none py-0.5">
              10
            </span>
            {(isMorePageActive || isDrawerOpen) && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="mt-1 text-[11px] tracking-tight truncate max-w-[68px]">
            {lang === "te" ? "అన్ని ఫీచర్లు" : "All Features"}
          </span>
        </button>
      </nav>

      {/* Slide-over Full Feature Directory Drawer */}
      <MobileFeaturesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
