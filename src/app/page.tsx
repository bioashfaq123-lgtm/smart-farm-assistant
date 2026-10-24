"use client";

import React from "react";
import Link from "next/link";
import {
  Wheat,
  MapPin,
  Ruler,
  Droplets,
  CloudRain,
  Thermometer,
  Wind,
  Power,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { DemoBadge } from "@/components/common/DemoBadge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import {
  SAMPLE_PROFILE,
  SAMPLE_WEATHER,
  SAMPLE_SENSOR_TELEMETRY,
  SAMPLE_IOT_ALERTS,
  SAMPLE_ADVISORY_TIPS,
} from "@/lib/data/sampleData";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* 1. Header Welcome Greeting */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("greeting")}, {SAMPLE_PROFILE.name}!
            </h1>
            <DemoBadge subtle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("sub_greeting")} <span className="font-semibold text-agri-700 dark:text-agri-400">{SAMPLE_PROFILE.village}, {SAMPLE_PROFILE.district}</span>.
          </p>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <Link
            href="/advisory"
            className="inline-flex items-center gap-2 rounded-xl bg-agri-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-agri-800 active:scale-95"
          >
            <span>{t("nav_advisory")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 2. Top Row: Farm Profile Card (2 cols) & Today's Weather Card (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Farm Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("profile_title")}
            subtitle={`${SAMPLE_PROFILE.village}, ${SAMPLE_PROFILE.district} (${SAMPLE_PROFILE.state})`}
            icon={<Wheat className="h-5 w-5 text-agri-600 dark:text-agri-400" />}
            action={<DemoBadge subtle />}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t("profile_crop")}
              </span>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100 truncate">
                {SAMPLE_PROFILE.primaryCrop}
              </p>
              <span className="text-[11px] text-agri-700 dark:text-agri-400 font-medium">
                {SAMPLE_PROFILE.soilType}
              </span>
            </div>

            <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t("profile_land_size")}
              </span>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                {SAMPLE_PROFILE.areaAcre} {t("profile_acres")} ({SAMPLE_PROFILE.areaGunta} {t("profile_guntas")})
              </p>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {t("profile_irrigation")}: <b className="text-stone-700 dark:text-stone-200">{SAMPLE_PROFILE.irrigationType}</b>
              </span>
            </div>

            <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t("profile_crop_age")}
              </span>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                {SAMPLE_PROFILE.daysSinceSowing} {t("profile_days")}
              </p>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {t("profile_sowing_date")}: {SAMPLE_PROFILE.sowingDate}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <Badge variant="normal">🌿 {t("badge_organic")}</Badge>
            <Badge variant="normal">📡 {t("badge_sensors")}</Badge>
            <Badge variant="outline">💧 Drip Irrigated</Badge>
            <Badge variant="outline">📍 Zone A & B Active</Badge>
          </div>
        </Card>

        {/* Weather Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader
              title={t("weather_title")}
              subtitle={SAMPLE_WEATHER.location}
              icon={<CloudRain className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
              action={<DemoBadge subtle />}
            />

            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-extrabold text-stone-900 dark:text-white">
                  {SAMPLE_WEATHER.tempCurrent}°C
                </span>
              </div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mt-1">
                {SAMPLE_WEATHER.conditionEn} ({SAMPLE_WEATHER.conditionTe})
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-stone-100 dark:border-stone-800 pt-3">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Thermometer className="h-4 w-4 text-rose-500 shrink-0" />
                <span>
                  {t("weather_high")}: <b>{SAMPLE_WEATHER.tempHigh}°C</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Droplets className="h-4 w-4 text-sky-500 shrink-0" />
                <span>
                  {t("weather_humidity")}: <b>{SAMPLE_WEATHER.humidityPct}%</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Wind className="h-4 w-4 text-stone-500 shrink-0" />
                <span>
                  {t("weather_wind")}: <b>{SAMPLE_WEATHER.windSpeedKmH} km/h</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <CloudRain className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>
                  {t("weather_rain_chance")}: <b className="text-indigo-600 dark:text-indigo-400">{SAMPLE_WEATHER.rainChancePct}%</b>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-sky-50 p-2 text-center text-[11px] text-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
            🌧️ Rain likely tomorrow (70%). Drip cycle paused by auto rain-skip.
          </div>
        </Card>
      </div>

      {/* 3. Key Stat KPI Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stat_soil_moisture")}
          value={`${SAMPLE_SENSOR_TELEMETRY.soilMoisturePct}%`}
          normalRange={SAMPLE_SENSOR_TELEMETRY.soilMoistureRange}
          statusBadge={{
            label: t("status_critical"),
            variant: "critical",
          }}
          icon={<Droplets className="h-5 w-5 text-rose-500" />}
        />

        <StatCard
          title={t("stat_soil_temp")}
          value={`${SAMPLE_SENSOR_TELEMETRY.soilTempC}°C`}
          normalRange={SAMPLE_SENSOR_TELEMETRY.soilTempRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<Thermometer className="h-5 w-5 text-emerald-500" />}
        />

        <StatCard
          title={t("stat_water_used")}
          value="1,250"
          unit="Liters"
          trendText="-8% vs yesterday"
          trendPositive={true}
          icon={<Activity className="h-5 w-5 text-agri-600" />}
        />

        <StatCard
          title={t("stat_pump_status")}
          value="AUTO"
          unit="Standby"
          statusBadge={{
            label: "Rain-Skip Active",
            variant: "warning",
          }}
          icon={<Power className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* 4. Two Columns: Latest Recommendations & Recent Farm Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest Recommendations Card */}
        <Card>
          <CardHeader
            title={t("advisory_quick_tips")}
            subtitle="Tailored for Telangana paddy in grain filling stage"
            icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
            action={
              <Link
                href="/advisory"
                className="text-xs font-semibold text-agri-700 hover:text-agri-800 dark:text-agri-400"
              >
                View all →
              </Link>
            }
          />

          <div className="space-y-3">
            {SAMPLE_ADVISORY_TIPS.slice(0, 3).map((tip) => (
              <div
                key={tip.id}
                className="rounded-xl border border-stone-100 bg-stone-50/70 p-3.5 transition hover:border-agri-300 dark:border-stone-800 dark:bg-stone-850"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {tip.titleEn}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${tip.badgeColor}`}
                  >
                    {tip.categoryEn}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {tip.descEn}
                </p>
                <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                  {tip.descTe}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts List Card */}
        <Card>
          <CardHeader
            title={t("alerts_title")}
            subtitle="Active sensor warnings and automated triggers"
            icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
            action={<Badge variant="critical">{SAMPLE_IOT_ALERTS.length} Alerts</Badge>}
          />

          <div className="space-y-3">
            {SAMPLE_IOT_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-3.5 transition ${
                  alert.severity === "critical"
                    ? "border-rose-200 bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-950/20"
                    : alert.severity === "warning"
                    ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20"
                    : "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-850"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {alert.titleEn}
                      </span>
                      <Badge variant={alert.severity}>{alert.severity}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {alert.descEn}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                      <span>📡 {alert.sensorId}</span>
                      <span>⏱️ {alert.timeAgoEn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5. Water Use & Conservation Summary Card */}
      <Card className="bg-gradient-to-r from-agri-50/60 to-emerald-50/30 dark:from-agri-950/30 dark:to-stone-900 border-agri-200/80 dark:border-agri-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-agri-700 dark:text-agri-400" />
              <h4 className="text-sm font-bold text-agri-950 dark:text-agri-100">
                {t("insights_water_saved_title")}: <span className="text-agri-700 dark:text-agri-300">{t("insights_water_saved_val")}</span>
              </h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-2xl">
              {t("insights_water_saved_desc")}
            </p>
          </div>

          <Link
            href="/iot"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-agri-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-agri-900 transition"
          >
            <span>Manage Pump & Sensors</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
