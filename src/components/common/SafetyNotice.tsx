"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function SafetyNotice() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-amber-300/80 bg-amber-50/90 p-4 text-xs text-amber-950 shadow-xs dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-amber-200/80 p-1.5 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 shrink-0">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{t("advisory_safety_title")}</span>
          </p>
          <p className="leading-relaxed opacity-95">
            {t("advisory_safety_text")}
          </p>
        </div>
      </div>
    </div>
  );
}
