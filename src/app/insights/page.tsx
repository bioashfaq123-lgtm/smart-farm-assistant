"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Droplets,
  Calendar,
  CloudRain,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Leaf,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  SAMPLE_FIELD_ZONES,
  SAMPLE_CROP_CALENDAR,
  SAMPLE_WEATHER,
  SAMPLE_PROFILE,
} from "@/lib/data/sampleData";

export default function InsightsPage() {
  const { lang, t } = useLanguage();
  const { profile } = useFarmerProfile();
  const [sowingDate, setSowingDate] = useState(profile.sowingDate || SAMPLE_PROFILE.sowingDate);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("insights_title")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              {profile.district} Farm Insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("insights_subtitle")} • {profile.primaryCrop} ({profile.areaAcre} Acres)
          </p>
        </div>
      </div>

      {/* 2. Top Section: Field Zones Shaded by Moisture */}
      <Card>
        <CardHeader
          title={t("insights_zones_title")}
          subtitle="Real-time moisture color-coding across your active management units"
          icon={<Layers className="h-5 w-5 text-agri-600" />}
          action={<Badge variant="outline">3 Zones</Badge>}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SAMPLE_FIELD_ZONES.map((zone) => {
            const isDry = zone.status === "dry";

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 p-5 transition ${
                  isDry
                    ? "border-rose-300 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20"
                    : "border-emerald-300 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {lang === "te" ? zone.nameTe : zone.nameEn}
                  </span>
                  <Badge variant={isDry ? "critical" : "normal"}>
                    {isDry ? t("status_dry") : t("status_optimal")}
                  </Badge>
                </div>

                <div className="my-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900 dark:text-stone-50">
                    {zone.moisturePct}%
                  </span>
                  <span className="text-xs text-stone-500">soil moisture</span>
                </div>

                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-200/80 pt-3 dark:border-stone-800">
                  <div className="flex justify-between">
                    <span>Crop:</span>
                    <b className="text-stone-800 dark:text-stone-200">{lang === "te" ? zone.cropTe : zone.cropEn}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Block Area:</span>
                    <span>{zone.areaAcre} Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sensor Node:</span>
                    <span>{zone.sensorNode}</span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg p-2 text-center text-xs font-semibold">
                  {isDry ? (
                    <span className="text-rose-700 dark:text-rose-300">
                      ⚠️ Needs Irrigation (Below 25% threshold)
                    </span>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-300">
                      ✓ Moisture Adequate (Within 25–35% band)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Middle Section: Crop Timeline from Sowing Date & 5-Day Weather Impact */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Crop Calendar from Sowing Date */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-agri-600" />
                <span>{t("insights_crop_calendar")}</span>
              </h3>
              <p className="text-xs text-stone-500">
                Paddy (RNR 15048) — Indicative 125-day duration
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Sown on:</span>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="rounded-lg border border-stone-200 bg-stone-50 p-1 text-xs dark:border-stone-800 dark:bg-stone-900"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {SAMPLE_CROP_CALENDAR.map((stage, idx) => {
              const isCurrent = stage.status === "current";
              const isCompleted = stage.status === "completed";

              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? "bg-agri-700 text-white"
                          : isCurrent
                          ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950"
                          : "border border-stone-300 bg-stone-100 text-stone-500 dark:border-stone-700 dark:bg-stone-800"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stage.day}
                    </div>
                    {idx < SAMPLE_CROP_CALENDAR.length - 1 && (
                      <div className="h-full w-0.5 bg-stone-200 dark:bg-stone-800 my-1" />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-amber-800 dark:text-amber-300 text-sm"
                            : "text-stone-900 dark:text-stone-100"
                        }`}
                      >
                        {lang === "te" ? stage.stageTe : stage.stageEn}
                      </h4>
                      <Badge variant={isCompleted ? "normal" : isCurrent ? "warning" : "outline"}>
                        {stage.status}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                      {lang === "te" ? stage.adviceTe : stage.adviceEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 5-Day Weather Impact & Water Plan */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={t("insights_weather_impact")}
              subtitle="Automated rain-skip and moisture planning"
              icon={<CloudRain className="h-5 w-5 text-sky-600" />}
            />

            {/* Smart Rain Skip Advisory Banner */}
            <div className="rounded-2xl border border-sky-300 bg-sky-50/80 p-4 text-xs text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-100">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span>Smart Irrigation Advice: Skip Tomorrow's Cycle</span>
              </div>
              <p className="leading-relaxed">
                70% chance of showers tomorrow in Jagtial. Pausing drip cycles will save approx <b>1,400 Liters</b> of water and avoid nitrogen leaching from root zones.
              </p>
            </div>

            {/* 5-Day Outlook List */}
            <div className="mt-4 space-y-2">
              {SAMPLE_WEATHER.forecast5Day.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/60 p-2.5 text-xs dark:border-stone-800 dark:bg-stone-850"
                >
                  <span className="font-bold text-stone-800 dark:text-stone-200 w-20">
                    {lang === "te" ? f.dayTe : f.dayEn}
                  </span>
                  <span className="text-stone-500 flex-1 truncate">{f.condition}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold">{f.temp}°C</span>
                    <span
                      className={`font-bold ${
                        f.rainChance >= 60
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-stone-400"
                      }`}
                    >
                      💧 {f.rainChance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Water Conservation Summary Card */}
          <Card className="bg-gradient-to-br from-agri-50/80 to-stone-50 border-agri-200 dark:from-agri-950/30 dark:to-stone-900 dark:border-agri-900/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-agri-800 dark:text-agri-300">
                  {t("insights_water_saved_title")}
                </span>
                <p className="text-2xl font-black text-agri-900 dark:text-agri-100 mt-1">
                  {t("insights_water_saved_val")}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Conserved via soil moisture threshold automation.
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-agri-100 text-agri-700 dark:bg-agri-900/60 dark:text-agri-300">
                <Droplets className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Honest Data Compliance: "Coming Soon" Cards for Unverified AI Metrics */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-stone-500" />
          <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
            {t("insights_coming_soon")}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-dashed border-stone-300 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-200/60 text-stone-600 dark:bg-stone-800 dark:text-stone-400 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  {t("insights_yield_predictor")}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {t("insights_yield_desc")}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Status: Multi-season validation
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-dashed border-stone-300 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-200/60 text-stone-600 dark:bg-stone-800 dark:text-stone-400 shrink-0">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  {t("insights_carbon_credits")}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {t("insights_carbon_desc")}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Status: Awaiting audit framework
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
