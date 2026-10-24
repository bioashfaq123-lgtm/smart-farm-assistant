"use client";

import React, { useState } from "react";
import {
  Droplets,
  Thermometer,
  Zap,
  FlaskConical,
  Activity,
  AlertTriangle,
  Check,
  X,
  Power,
  Wifi,
  WifiOff,
  Cpu,
  MapPin,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/components/common/LanguageContext";
import { DemoBadge } from "@/components/common/DemoBadge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import {
  SAMPLE_SENSOR_TELEMETRY,
  SAMPLE_7DAY_TRENDS,
  SAMPLE_IOT_ALERTS,
  SAMPLE_CONNECTED_DEVICES,
  SAMPLE_PUMP_STATE,
  SAMPLE_FIELD_ZONES,
} from "@/lib/data/sampleData";

type MetricTab = "moisture" | "temperature" | "humidity" | "ph";

export default function IoTPage() {
  const { lang, t } = useLanguage();
  const [activeMetric, setActiveMetric] = useState<MetricTab>("moisture");
  const [alerts, setAlerts] = useState(SAMPLE_IOT_ALERTS);
  const [pumpState, setPumpState] = useState(SAMPLE_PUMP_STATE);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const togglePump = () => {
    setPumpState((prev) => ({
      ...prev,
      pumpOn: !prev.pumpOn,
      lastChanged: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  };

  const toggleValve = (valve: "valveAOpen" | "valveBOpen") => {
    setPumpState((prev) => ({
      ...prev,
      [valve]: !prev[valve],
    }));
  };

  const getMetricConfig = () => {
    switch (activeMetric) {
      case "moisture":
        return {
          key: "moisture",
          unit: "%",
          name: t("stat_soil_moisture"),
          color: "#0284c7", // Sky blue matching screenshot 1
          domain: [0, 45],
        };
      case "temperature":
        return {
          key: "temperature",
          unit: "°C",
          name: t("stat_soil_temp"),
          color: "#ea580c",
          domain: [15, 38],
        };
      case "humidity":
        return {
          key: "humidity",
          unit: "%",
          name: t("stat_air_humidity"),
          color: "#16a34a",
          domain: [40, 100],
        };
      case "ph":
        return {
          key: "ph",
          unit: "pH",
          name: t("stat_soil_ph"),
          color: "#9333ea",
          domain: [5, 8.5],
        };
    }
  };

  const currentConfig = getMetricConfig();

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("iot_title")}
            </h1>
            <DemoBadge subtle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("iot_subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="online" className="py-1 px-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ESP32 Hub Online</span>
          </Badge>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards Grid (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stat_soil_moisture")}
          value={SAMPLE_SENSOR_TELEMETRY.soilMoisturePct}
          unit="%"
          normalRange={SAMPLE_SENSOR_TELEMETRY.soilMoistureRange}
          statusBadge={{
            label: t("status_critical"),
            variant: "critical",
          }}
          icon={<Droplets className="h-5 w-5 text-rose-500" />}
        />

        <StatCard
          title={t("stat_soil_temp")}
          value={SAMPLE_SENSOR_TELEMETRY.soilTempC}
          unit="°C"
          normalRange={SAMPLE_SENSOR_TELEMETRY.soilTempRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<Thermometer className="h-5 w-5 text-emerald-500" />}
        />

        <StatCard
          title={t("stat_air_humidity")}
          value={SAMPLE_SENSOR_TELEMETRY.airHumidityPct}
          unit="%"
          normalRange={SAMPLE_SENSOR_TELEMETRY.airHumidityRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<Zap className="h-5 w-5 text-amber-500" />}
        />

        <StatCard
          title={t("stat_soil_ph")}
          value={SAMPLE_SENSOR_TELEMETRY.soilPh}
          unit="pH"
          normalRange={SAMPLE_SENSOR_TELEMETRY.soilPhRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<FlaskConical className="h-5 w-5 text-sky-500" />}
        />
      </div>

      {/* 3. Middle Section: 7-Day Trend Chart & IoT Alerts (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recharts Trend Chart (2 Cols) */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                {t("iot_chart_title")}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Hourly logged readings from Field A soil node
              </p>
            </div>

            {/* Metric Selector Pills */}
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-900">
              <button
                onClick={() => setActiveMetric("moisture")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeMetric === "moisture"
                    ? "bg-stone-900 text-white dark:bg-agri-950 dark:text-agri-300"
                    : "text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {t("iot_tab_moisture")}
              </button>
              <button
                onClick={() => setActiveMetric("temperature")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeMetric === "temperature"
                    ? "bg-stone-900 text-white dark:bg-agri-950 dark:text-agri-300"
                    : "text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {t("iot_tab_temp")}
              </button>
              <button
                onClick={() => setActiveMetric("humidity")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeMetric === "humidity"
                    ? "bg-stone-900 text-white dark:bg-agri-950 dark:text-agri-300"
                    : "text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {t("iot_tab_humidity")}
              </button>
              <button
                onClick={() => setActiveMetric("ph")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  activeMetric === "ph"
                    ? "bg-stone-900 text-white dark:bg-agri-950 dark:text-agri-300"
                    : "text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {t("iot_tab_ph")}
              </button>
            </div>
          </div>

          {/* Line Chart */}
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_7DAY_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.6} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  domain={currentConfig.domain}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  unit={currentConfig.unit}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    borderRadius: "12px",
                    border: "none",
                    color: "#f5f5f4",
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                  }}
                  formatter={(value: any) => [`${value} ${currentConfig.unit}`, currentConfig.name]}
                />
                <Line
                  type="monotone"
                  dataKey={currentConfig.key}
                  stroke={currentConfig.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: currentConfig.color, strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-center text-xs text-stone-500 dark:text-stone-400">
            —o— {currentConfig.name} ({currentConfig.unit})
          </div>
        </Card>

        {/* Right: IoT Alerts Widget with Red Counter (Matching Screenshot 1) */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {t("alerts_title")}
                </h3>
              </div>
              {alerts.length > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow-xs">
                  {alerts.length}
                </span>
              )}
            </div>

            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-center text-xs text-stone-500 py-6">{t("alerts_none")}</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-3 text-xs transition ${
                      alert.severity === "critical"
                        ? "border-rose-200 bg-rose-50/70 dark:border-rose-950 dark:bg-rose-950/20"
                        : alert.severity === "warning"
                        ? "border-amber-200 bg-amber-50/70 dark:border-amber-950 dark:bg-amber-950/20"
                        : "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-850"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 dark:text-stone-100">
                            {lang === "te" ? alert.titleTe : alert.titleEn}
                          </span>
                          <Badge variant={alert.severity}>{alert.severity}</Badge>
                        </div>
                        <p className="mt-1 text-stone-600 dark:text-stone-300 leading-relaxed">
                          {lang === "te" ? alert.descTe : alert.descEn}
                        </p>
                        <div className="mt-2 text-[10px] text-stone-400 dark:text-stone-500">
                          {alert.sensorId} • {lang === "te" ? alert.timeAgoTe : alert.timeAgoEn}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="rounded-md p-1 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 dark:hover:bg-stone-800"
                          title="Dismiss"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-stone-50 p-2 text-center text-[11px] text-stone-500 dark:bg-stone-900 dark:text-stone-400">
            Automated alerts triggered via ESP32 telemetry thresholds.
          </div>
        </Card>
      </div>

      {/* 4. Sensor Network Map (Matching Screenshot 2) */}
      <Card>
        <CardHeader
          title="Sensor Network Map"
          subtitle="Visual zone moisture layout across your registered field blocks"
          icon={<MapPin className="h-5 w-5 text-agri-600" />}
          action={<DemoBadge subtle />}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SAMPLE_FIELD_ZONES.map((zone) => (
            <div
              key={zone.id}
              className={`rounded-2xl border-2 p-4 transition ${
                zone.status === "dry"
                  ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20"
                  : "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {lang === "te" ? zone.nameTe : zone.nameEn}
                </span>
                <Badge variant={zone.status === "dry" ? "critical" : "normal"}>
                  {zone.status === "dry" ? t("status_dry") : t("status_optimal")}
                </Badge>
              </div>

              <div className="my-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">
                  {zone.moisturePct}%
                </span>
                <span className="text-xs text-stone-500">soil moisture</span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200/60 dark:border-stone-800">
                <span>{lang === "te" ? zone.cropTe : zone.cropEn}</span>
                <span>{zone.areaAcre} Acres</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Lower Section: Connected Devices & Pump/Valve Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Connected Hardware Devices */}
        <Card>
          <CardHeader
            title={t("iot_devices_title")}
            subtitle="Registered wireless ESP32 mesh sensors"
            icon={<Cpu className="h-5 w-5 text-stone-600 dark:text-stone-400" />}
          />

          <div className="space-y-3">
            {SAMPLE_CONNECTED_DEVICES.map((dev) => (
              <div
                key={dev.id}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-850"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-2xs dark:bg-stone-800">
                    {dev.isOnline ? (
                      <Wifi className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === "te" ? dev.nameTe : dev.nameEn}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Battery: {dev.batteryPct}% • Signal: {dev.rssiSignal}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant={dev.isOnline ? "online" : "offline"}>
                    {dev.isOnline ? t("status_online") : t("status_offline")}
                  </Badge>
                  <p className="mt-1 text-[10px] text-stone-400">
                    {lang === "te" ? dev.lastSeenTe : dev.lastSeenEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pump & Actuator Controls */}
        <Card>
          <CardHeader
            title={t("iot_controls_title")}
            subtitle="Automated & manual drip valve toggles"
            icon={<Power className="h-5 w-5 text-agri-600" />}
          />

          <div className="space-y-4">
            {/* Main Pump Switch Card */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-850">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {t("iot_pump_switch")} (5 HP Submersible)
                  </span>
                  <Badge variant={pumpState.pumpOn ? "normal" : "outline"}>
                    {pumpState.pumpOn ? t("iot_pump_on") : t("iot_pump_off")}
                  </Badge>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Mode: <b className="capitalize text-stone-800 dark:text-stone-200">{pumpState.mode}</b> • Threshold: {pumpState.thresholdMoisturePct}%
                </p>
              </div>

              <button
                onClick={togglePump}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition active:scale-95 shadow-xs ${
                  pumpState.pumpOn
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : "bg-agri-700 text-white hover:bg-agri-800"
                }`}
                title="Toggle Motor Pump"
              >
                <Power className="h-6 w-6" />
              </button>
            </div>

            {/* Rain Skip Protection Banner */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-xs text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200">
              <div className="flex items-center gap-2 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span>{t("iot_rain_skip_active")}</span>
              </div>
              <p className="mt-1 text-[11px] opacity-90">
                Weather forecast detects 70% rain tomorrow. Pump auto-activation is suspended to prevent field waterlogging.
              </p>
            </div>

            {/* Solenoid Valves */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {t("iot_valves")}
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleValve("valveAOpen")}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    pumpState.valveAOpen
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
                  }`}
                >
                  <span className="text-xs font-semibold">{t("iot_valve_a")}</span>
                  <Badge variant={pumpState.valveAOpen ? "normal" : "outline"}>
                    {pumpState.valveAOpen ? "OPEN" : "CLOSED"}
                  </Badge>
                </button>

                <button
                  onClick={() => toggleValve("valveBOpen")}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    pumpState.valveBOpen
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
                  }`}
                >
                  <span className="text-xs font-semibold">{t("iot_valve_b")}</span>
                  <Badge variant={pumpState.valveBOpen ? "normal" : "outline"}>
                    {pumpState.valveBOpen ? "OPEN" : "CLOSED"}
                  </Badge>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
