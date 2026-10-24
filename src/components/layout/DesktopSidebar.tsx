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
  Sprout,
  MapPin,
  ShieldCheck,
  Presentation,
} from "lucide-react";
import { useLanguage } from "../common/LanguageContext";
import { SAMPLE_PROFILE } from "@/lib/data/sampleData";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      href: "/",
      label: t("nav_dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/advisory",
      label: t("nav_advisory"),
      icon: MessageSquare,
      badge: "AI",
    },
    {
      href: "/iot",
      label: t("nav_iot"),
      icon: Activity,
    },
    {
      href: "/market",
      label: t("nav_market"),
      icon: TrendingUp,
    },
    {
      href: "/tools",
      label: t("nav_tools"),
      icon: Wrench,
    },
    {
      href: "/insights",
      label: t("nav_insights"),
      icon: Sparkles,
    },
    {
      href: "/demo",
      label: "Conference Demo",
      icon: Presentation,
      badge: "LIVE",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-stone-200/90 bg-white/95 backdrop-blur-md md:flex dark:border-stone-800/80 dark:bg-stone-950/95">
      {/* Brand Top Header */}
      <div className="flex items-center gap-3 border-b border-stone-100 p-6 dark:border-stone-800/80">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agri-700 text-white shadow-xs dark:bg-agri-600">
          <Sprout className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <span className="block text-base font-bold tracking-tight text-stone-900 dark:text-white truncate">
            {t("app_title")}
          </span>
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">
            Telangana Rythu Portal
          </p>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-stone-900 text-white shadow-xs dark:bg-agri-950 dark:text-agri-300 dark:border dark:border-agri-800/60"
                  : "text-stone-600 hover:bg-stone-100/90 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-900/80 dark:hover:text-stone-100"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive
                      ? "text-agri-400 dark:text-agri-400"
                      : "text-stone-400 group-hover:text-stone-900 dark:text-stone-500 dark:group-hover:text-stone-200"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-agri-800 text-agri-200"
                      : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Farmer Profile Pill at Bottom (Matching Screenshot) */}
      <div className="border-t border-stone-100 p-4 dark:border-stone-800/80">
        <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-stone-50 dark:hover:bg-stone-900/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-agri-800 text-sm font-bold text-white shadow-xs">
            MG
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-stone-900 truncate dark:text-stone-100">
              {SAMPLE_PROFILE.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-stone-500 truncate dark:text-stone-400">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>
                {SAMPLE_PROFILE.village}, {SAMPLE_PROFILE.district}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800/60">
          <Link
            href="/admin"
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-stone-100/80 hover:bg-stone-200/80 dark:bg-stone-900/80 dark:hover:bg-stone-800 transition group"
          >
            <span className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              Farm Assistant Admin
            </span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              Traffic
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
