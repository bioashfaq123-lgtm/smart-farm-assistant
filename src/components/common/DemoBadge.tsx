"use client";

import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface DemoBadgeProps {
  className?: string;
  subtle?: boolean;
}

export function DemoBadge({ className = "", subtle = false }: DemoBadgeProps) {
  const { t } = useLanguage();

  if (subtle) {
    return (
      <span
        title={t("demo_badge_sub")}
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        {t("demo_badge")}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100/80 text-amber-900 border border-amber-300 shadow-xs dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800 ${className}`}
      title={t("demo_badge_sub")}
    >
      <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>{t("demo_badge")}</span>
      <span className="text-[10px] opacity-75 hidden sm:inline font-normal">
        • {t("demo_badge_sub")}
      </span>
    </div>
  );
}
