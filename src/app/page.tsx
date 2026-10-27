"use client";

import React, { useState, useEffect } from "react";
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
  Edit3,
  RefreshCw,
  Info,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { fetchLiveDistrictWeather, LiveWeatherData } from "@/lib/weather/openMeteo";
import { useIoTTelemetry } from "@/lib/iot/useIoTTelemetry";
import {
  SAMPLE_SENSOR_TELEMETRY,
  SAMPLE_IOT_ALERTS,
  SAMPLE_ADVISORY_TIPS,
} from "@/lib/data/sampleData";

export default function DashboardPage() {
  const { lang, t } = useLanguage();
  const { profile, openProfileModal, resetToSample } = useFarmerProfile();
  const { telemetry } = useIoTTelemetry(8000);

  // Calculate dynamic crop age from farmer's actual sowing date
  const cropAgeDays = profile.sowingDate
    ? Math.max(0, Math.floor((Date.now() - new Date(profile.sowingDate).getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingWeather(true);
    fetchLiveDistrictWeather(profile.district).then((data) => {
      if (isMounted) {
        setWeather(data);
        setLoadingWeather(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [profile.district]);

  return (
    <div className="space-y-6">
      {/* Visual Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-stone-900 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/images/smart_farm_hero.jpg"
            alt="Smart Farm Hero Banner"
            className="h-full w-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col justify-between min-h-[210px] text-white">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                🌾 Telangana Rythu Portal
              </span>
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/25 text-sky-300 border border-sky-400/40 backdrop-blur-md flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live IoT & PJTAU AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm text-white">
              {profile.name ? `${t("greeting")}, ${profile.name}!` : "Smart Farm Assistant"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed">
              {profile.name ? (
                <>
                  {t("sub_greeting")}{" "}
                  <span className="font-semibold text-emerald-300">
                    {profile.village}, {profile.district} District
                  </span>
                  {" "}&bull; Primary Crop: <span className="font-semibold text-amber-300">{profile.primaryCrop || "Paddy"}</span> ({profile.areaAcre} Acres).
                </>
              ) : (
                "Empowering Telangana farmers with real-time IoT soil intelligence, automated irrigation, PJTAU pest advisories, and live APMC mandi prices."
              )}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={openProfileModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-stone-900 shadow-sm transition hover:bg-stone-100 active:scale-95"
            >
              <Edit3 className="h-3.5 w-3.5 text-emerald-700" />
              <span>{profile.name ? "Edit Farm Profile" : "Set Up Farm Profile"}</span>
            </button>
            <Link
              href="/advisory"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              <span>{t("nav_advisory")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Onboarding Alert Banner if Profile Setup Pending */}
      {!profile.hasCompletedOnboarding && (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-green-950/40 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨‍🌾</span>
                <h2 className="text-base font-bold text-stone-900 dark:text-white">
                  Welcome to Telangana Rythu Digital Portal!
                </h2>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
                Please complete your farmer profile and field setup. Selecting your district, land area, crop, and irrigation system enables live Open-Meteo district weather, local APMC mandi prices, and tailored PJTAU crop advisories.
              </p>
            </div>
            <button
              onClick={openProfileModal}
              className="shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Complete Field Setup</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Row: Farm Profile Card (2 cols) & Today's Weather Card (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Farm Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("profile_title")}
            subtitle={`${profile.village}, ${profile.mandal} Mandal, ${profile.district} (Telangana)`}
            icon={<Wheat className="h-5 w-5 text-agri-600 dark:text-agri-400" />}
            action={
              <button
                onClick={openProfileModal}
                className="text-xs font-semibold text-agri-700 dark:text-agri-400 hover:underline flex items-center gap-1"
              >
                <span>Customize</span>
                <Edit3 className="h-3 w-3" />
              </button>
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t("profile_crop")}
              </span>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100 truncate">
                {profile.primaryCrop}
              </p>
              <span className="text-[11px] text-agri-700 dark:text-agri-400 font-medium">
                {profile.soilType}
              </span>
            </div>

            <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t("profile_land_size")}
              </span>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                {profile.areaAcre} {t("profile_acres")}{" "}
                {profile.areaGunta > 0 ? `(${profile.areaGunta} ${t("profile_guntas")})` : ""}
              </p>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {t("profile_irrigation")}:{" "}
                <b className="text-stone-700 dark:text-stone-200">{profile.irrigationType}</b>
              </span>
            </div>

            <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {t("profile_crop_age")}
              </span>
              {cropAgeDays !== null && !isNaN(cropAgeDays) && profile.sowingDate ? (
                <>
                  <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                    {cropAgeDays} {t("profile_days")}
                  </p>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {t("profile_sowing_date")}: {profile.sowingDate}
                  </span>
                </>
              ) : (
                <>
                  <p className="mt-1 font-semibold text-stone-500 dark:text-stone-400 text-sm">
                    Not Specified
                  </p>
                  <button
                    onClick={openProfileModal}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline mt-0.5 inline-block"
                  >
                    + Set Sowing Date
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="normal">🌿 Telangana Agriculture</Badge>
              <Badge variant="outline">📍 {profile.district} District</Badge>
              <Badge variant="outline">💧 {profile.irrigationType}</Badge>
            </div>
            {!profile.isCustom && (
              <button
                onClick={openProfileModal}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Change from Mallesham Goud →
              </button>
            )}
          </div>
        </Card>

        {/* Real Open-Meteo Weather Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader
              title={t("weather_title")}
              subtitle={`${profile.district}, Telangana`}
              icon={<CloudRain className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
              action={
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">
                  {weather?.lastUpdatedText || "Live"}
                </span>
              }
            />

            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-extrabold text-stone-900 dark:text-white">
                  {weather ? `${weather.temperatureC}°C` : "—°C"}
                </span>
              </div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mt-1">
                {weather
                  ? lang === "te"
                    ? weather.weatherDescriptionTe
                    : weather.weatherDescriptionEn
                  : "Fetching live Open-Meteo data..."}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-stone-100 dark:border-stone-800 pt-3">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Thermometer className="h-4 w-4 text-rose-500 shrink-0" />
                <span>
                  {t("weather_high")}: <b>{weather?.todayHighC ?? 32}°C</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Droplets className="h-4 w-4 text-sky-500 shrink-0" />
                <span>
                  {t("weather_humidity")}: <b>{weather?.humidityPct ?? 55}%</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Wind className="h-4 w-4 text-stone-500 shrink-0" />
                <span>
                  {t("weather_wind")}: <b>{weather?.windSpeedKmH ?? 8} km/h</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <CloudRain className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>
                  {t("weather_rain_chance")}:{" "}
                  <b className="text-indigo-600 dark:text-indigo-400">
                    {weather?.rainProbabilityPct ?? 10}%
                  </b>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-sky-50 p-2 text-center text-[11px] text-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
            {weather && weather.rainProbabilityPct >= 50
              ? `🌧️ High rain probability (${weather.rainProbabilityPct}%). Rain-skip will pause irrigation cycles to conserve water.`
              : `☀️ Favorable weather in ${profile.district}. Standard irrigation interval recommended.`}
          </div>
        </Card>
      </div>

      {/* 3. Key Stat KPI Cards Grid (4 Columns) with Real IoT Data */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Real ESP32 Soil Moisture */}
        <StatCard
          title={t("stat_soil_moisture")}
          value={
            telemetry.moisture !== null
              ? `${telemetry.moisture}%`
              : telemetry.isOnline
              ? "Reading..."
              : "Standby"
          }
          unit={telemetry.moisture !== null ? "VWC" : ""}
          normalRange={`Threshold: ${telemetry.threshold}%`}
          statusBadge={
            telemetry.moisture !== null
              ? {
                  label:
                    telemetry.moisture < telemetry.threshold
                      ? "Needs Water"
                      : "Optimal Moisture",
                  variant:
                    telemetry.moisture < telemetry.threshold ? "critical" : "normal",
                }
              : {
                  label: telemetry.isOnline ? "Awaiting Sync" : "ESP32 Offline",
                  variant: "outline",
                }
          }
          icon={
            <Droplets
              className={`h-5 w-5 ${
                telemetry.moisture !== null && telemetry.moisture < telemetry.threshold
                  ? "text-rose-500 animate-pulse"
                  : "text-sky-500"
              }`}
            />
          }
        />

        {/* Real Open-Meteo Ambient Temperature */}
        <StatCard
          title={t("stat_soil_temp")}
          value={weather ? `${weather.temperatureC}°C` : "—°C"}
          normalRange="Open-Meteo Ambient"
          statusBadge={{
            label: "Open-Meteo Live",
            variant: "normal",
          }}
          icon={<Thermometer className="h-5 w-5 text-emerald-500" />}
        />

        {/* Honest Flow Meter Requirement: No Flow Meter Installed */}
        <StatCard
          title={t("stat_water_used")}
          value="No flow meter"
          unit=""
          normalRange="Sensor uninstalled"
          statusBadge={{
            label: "Hardware Pending",
            variant: "outline",
          }}
          icon={<Activity className="h-5 w-5 text-stone-400" />}
        />

        {/* Real ESP32 Pump State from Firebase RTDB */}
        <StatCard
          title={t("stat_pump_status")}
          value={
            telemetry.pumpState
              ? "RUNNING"
              : telemetry.mode === "auto"
              ? "AUTO"
              : "STANDBY"
          }
          unit={telemetry.pumpState ? "5 HP Relay ON" : "Relay OFF"}
          statusBadge={
            telemetry.pumpState
              ? {
                  label: "Pumping Active",
                  variant: "critical",
                }
              : telemetry.rainSkip
              ? {
                  label: "Rain-Skip Standby",
                  variant: "warning",
                }
              : {
                  label: telemetry.isOnline ? "Standby" : "Offline",
                  variant: "normal",
                }
          }
          icon={<Power className={`h-5 w-5 ${telemetry.pumpState ? "text-rose-500 animate-pulse" : "text-amber-500"}`} />}
        />
      </div>

      {/* 4. Two Columns: Latest Recommendations & Recent Farm Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest Recommendations Card */}
        <Card>
          <CardHeader
            title={t("advisory_quick_tips")}
            subtitle="Based on PJTAU Vyavasaya Panchangam / Package of Practices"
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

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
            ⚠️ <em>AI advice is indicative. Consult your local Mandal Agricultural Officer (MAO) before spraying.</em>
          </div>
        </Card>

        {/* Alerts List Card */}
        <Card>
          <CardHeader
            title={t("alerts_title")}
            subtitle="Sensor telemetry thresholds and automated triggers"
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
                {t("insights_water_saved_title")}:{" "}
                <span className="text-agri-700 dark:text-agri-300">
                  {t("insights_water_saved_val")}
                </span>
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
