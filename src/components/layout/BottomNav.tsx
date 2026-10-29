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
  Landmark,
} from "lucide-react";
import { useLanguage } from "../common/LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();

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
      href: "/schemes",
      label: lang === "te" ? "పథకాలు" : "Schemes",
      icon: Landmark,
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
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-stone-200/90 bg-white/95 px-1 pb-safe backdrop-blur-md md:hidden dark:border-stone-800/80 dark:bg-stone-950/95">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center rounded-lg px-1 py-1 text-center transition-all ${
              isActive
                ? "font-bold text-agri-700 dark:text-agri-400"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <div className="relative">
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110 stroke-[2.5]" : "scale-100 stroke-[1.8]"
                }`}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-agri-600 dark:bg-agri-400" />
              )}
            </div>
            <span className="mt-1 text-[10px] tracking-tight truncate max-w-[54px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
