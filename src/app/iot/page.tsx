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
  Sparkles,
  CloudRain,
  RotateCcw,
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
import { FieldZone, TelemetryPoint } from "@/lib/types";

type MetricTab = "moisture" | "temperature" | "humidity" | "ph";

export default function IoTPage() {
  const { lang, t } = useLanguage();
  const [activeMetric, setActiveMetric] = useState<MetricTab>("moisture");
  const [alerts, setAlerts] = useState(SAMPLE_IOT_ALERTS);
  const [pumpState, setPumpState] = useState(SAMPLE_PUMP_STATE);
  const [telemetry, setTelemetry] = useState(SAMPLE_SENSOR_TELEMETRY);
  const [zones, setZones] = useState<FieldZone[]>(SAMPLE_FIELD_ZONES);
  const [trendData, setTrendData] = useState<TelemetryPoint[]>(SAMPLE_7DAY_TRENDS);
  const [simMessage, setSimMessage] = useState<string | null>(null);

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

  // Phase 2: Simulation Handlers
  const handleSimulateDrip = () => {
    setTelemetry((prev) => ({
      ...prev,
      soilMoisturePct: 34.2,
      soilMoistureStatus: "normal",
      lastUpdated: "Just now (After drip run)",
    }));
    setZones((prev) =>
      prev.map((z) =>
        z.id === "zone-1"
          ? { ...z, moisturePct: 34.2, status: "optimal" }
          : z
      )
    );
    setPumpState((prev) => ({
      ...prev,
      pumpOn: true,
      lastChanged: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
    // Update trend chart with irrigated point
    setTrendData((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = {
        ...copy[copy.length - 1],
        moisture: 34.2,
      };
      return copy;
    });
    setSimMessage(t("sim_msg_drip"));
  };

  const handleSimulateRain = () => {
    setTelemetry((prev) => ({
      ...prev,
      soilMoisturePct: 38.5,
      soilMoistureStatus: "normal",
      airHumidityPct: 88,
      lastUpdated: "Just now (Rain sensor)",
    }));
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        moisturePct: 38.5,
        status: "optimal",
      }))
    );
    setPumpState((prev) => ({
      ...prev,
      pumpOn: false,
      rainSkipActive: true,
    }));
    setTrendData((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = {
        ...copy[copy.length - 1],
        moisture: 38.5,
        humidity: 88,
      };
      return copy;
    });
    setSimMessage(t("sim_msg_rain"));
  };

  const handleResetBaseline = () => {
    setTelemetry(SAMPLE_SENSOR_TELEMETRY);
    setZones(SAMPLE_FIELD_ZONES);
    setTrendData(SAMPLE_7DAY_TRENDS);
    setPumpState(SAMPLE_PUMP_STATE);
    setSimMessage(t("sim_msg_reset"));
  };

  const getMetricConfig = () => {
    switch (activeMetric) {
      case "moisture":
        return {
          key: "moisture",
          unit: "%",
          name: t("stat_soil_moisture"),
          color: "#0284c7",
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

      {/* Phase 2: Interactive Field Moisture Simulator Banner Card */}
      <Card className="bg-gradient-to-r from-sky-500/10 via-agri-500/10 to-transparent border-sky-300/80 dark:border-sky-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                {t("sim_title")}
              </h3>
              <Badge variant="outline" className="text-[10px]">Phase 2 Demo</Badge>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t("sim_desc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateDrip}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-sky-700 active:scale-95 transition"
            >
              <Droplets className="h-3.5 w-3.5" />
              <span>{t("sim_btn_drip")}</span>
            </button>
            <button
              onClick={handleSimulateRain}
              className="inline-flex items-center gap-1.5 rounded-xl bg-agri-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-agri-800 active:scale-95 transition"
            >
              <CloudRain className="h-3.5 w-3.5" />
              <span>{t("sim_btn_rain")}</span>
            </button>
            <button
              onClick={handleResetBaseline}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 transition"
              title="Reset Baseline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t("sim_btn_reset")}</span>
            </button>
          </div>
        </div>

        {simMessage && (
          <div className="mt-3 rounded-xl bg-white/80 p-2.5 text-xs font-medium text-stone-800 border border-sky-200 dark:bg-stone-900/80 dark:border-sky-900/60 dark:text-stone-200 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{simMessage}</span>
          </div>
        )}
      </Card>

      {/* 2. Top 4 Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stat_soil_moisture")}
          value={telemetry.soilMoisturePct}
          unit="%"
          normalRange={telemetry.soilMoistureRange}
          statusBadge={{
            label: telemetry.soilMoistureStatus === "critical" ? t("status_critical") : t("status_normal"),
            variant: telemetry.soilMoistureStatus === "critical" ? "critical" : "normal",
          }}
          icon={<Droplets className={`h-5 w-5 ${telemetry.soilMoistureStatus === "critical" ? "text-rose-500" : "text-sky-500"}`} />}
        />

        <StatCard
          title={t("stat_soil_temp")}
          value={telemetry.soilTempC}
          unit="°C"
          normalRange={telemetry.soilTempRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<Thermometer className="h-5 w-5 text-emerald-500" />}
        />

        <StatCard
          title={t("stat_air_humidity")}
          value={telemetry.airHumidityPct}
          unit="%"
          normalRange={telemetry.airHumidityRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<Zap className="h-5 w-5 text-amber-500" />}
        />

        <StatCard
          title={t("stat_soil_ph")}
          value={telemetry.soilPh}
          unit="pH"
          normalRange={telemetry.soilPhRange}
          statusBadge={{
            label: t("status_normal"),
            variant: "normal",
          }}
          icon={<FlaskConical className="h-5 w-5 text-sky-500" />}
        />
      </div>

      {/* 3. Recharts 7-Day Trend Chart & Alert Widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Sensor Trend Chart (2 Cols) */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Activity className="h-5 w-5 text-agri-600" />
                <span>{t("iot_chart_title")}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Daily telemetry aggregated from Node A1 (Soil Depth 15cm)
              </p>
            </div>

            {/* Metric Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-900">
              {(["moisture", "temperature", "humidity", "ph"] as MetricTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMetric(tab)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                    activeMetric === tab
                      ? "bg-white text-stone-900 shadow-2xs dark:bg-stone-800 dark:text-stone-50"
                      : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts SVG Chart Area */}
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#78716c" />
                <YAxis domain={currentConfig.domain} tick={{ fontSize: 12 }} stroke="#78716c" />
                <Tooltip
                  formatter={(val: number) => [`${val} ${currentConfig.unit}`, currentConfig.name]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e7e5e4", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey={currentConfig.key}
                  stroke={currentConfig.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: currentConfig.color }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Rail: Active IoT Alerts (1 Col) */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {t("alerts_title")}
                </h3>
              </div>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {alerts.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {alerts.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">{t("alerts_none")}</p>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs dark:border-rose-900/60 dark:bg-rose-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 dark:text-rose-200">
                        {lang === "te" ? al.titleTe : al.titleEn}
                      </span>
                      <button
                        onClick={() => dismissAlert(al.id)}
                        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        title={t("alerts_clear")}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 text-stone-700 dark:text-stone-300 leading-relaxed text-[11px]">
                      {lang === "te" ? al.descTe : al.descEn}
                    </p>
                    <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{al.sensorId}</span>
                      <span>{lang === "te" ? al.timeAgoTe : al.timeAgoEn}</span>
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

      {/* 4. Sensor Network Map */}
      <Card>
        <CardHeader
          title="Sensor Network Map"
          subtitle="Visual zone moisture layout across your registered field blocks"
          icon={<MapPin className="h-5 w-5 text-agri-600" />}
          action={<DemoBadge subtle />}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {zones.map((zone) => (
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
                    <p className="text-[11px] text-stone-400">
                      RSSI: {dev.rssiSignal} • Batt: {dev.batteryPct}%
                    </p>
                  </div>
                </div>

                <Badge variant={dev.isOnline ? "online" : "offline"}>
                  {dev.isOnline ? t("status_online") : t("status_offline")}
                </Badge>
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
