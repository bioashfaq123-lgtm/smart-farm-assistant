"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  MapPin,
  ExternalLink,
  Bell,
  Plus,
  Clock,
  Sparkles,
  Users,
  Store,
  CheckCircle2,
  LineChart as LineChartIcon,
  X,
  SlidersHorizontal,
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
import {
  SAMPLE_MANDI_PRICES,
  SAMPLE_MANDI_PRICE_TRENDS,
} from "@/lib/data/sampleData";
import { MandiPriceItem } from "@/lib/types";

export default function MarketPage() {
  const { lang, t } = useLanguage();
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTrendItem, setActiveTrendItem] = useState<MandiPriceItem | null>(null);
  const [alerts, setAlerts] = useState([
    { id: "al-1", crop: "Paddy (Common / Sona)", condition: "Above ₹2,350 / qtl", active: true },
    { id: "al-2", crop: "Cotton (Medium Staple)", condition: "Above ₹7,500 / qtl", active: true },
    { id: "al-3", crop: "Chilli (Teja Red)", condition: "Above ₹16,000 / qtl", active: false },
  ]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newCropName, setNewCropName] = useState("Maize");
  const [newTargetPrice, setNewTargetPrice] = useState("2300");

  const cropFilters = [
    { key: "all", labelEn: "All Commodities", labelTe: "అన్ని రకాల పంటలు" },
    { key: "paddy", labelEn: "Paddy", labelTe: "వరి" },
    { key: "cotton", labelEn: "Cotton", labelTe: "పత్తి" },
    { key: "maize", labelEn: "Maize", labelTe: "మొక్కజొన్న" },
    { key: "groundnut", labelEn: "Groundnut", labelTe: "వేరుశెనగ" },
    { key: "chilli", labelEn: "Chilli", labelTe: "మిరప" },
    { key: "redgram", labelEn: "Redgram", labelTe: "కందులు" },
  ];

  const filteredPrices = SAMPLE_MANDI_PRICES.filter((item) => {
    if (selectedCropFilter === "all") return true;
    return item.id.toLowerCase().includes(selectedCropFilter);
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetPrice) return;
    const newEntry = {
      id: `al-${Date.now()}`,
      crop: newCropName,
      condition: `Above ₹${Number(newTargetPrice).toLocaleString("en-IN")} / qtl`,
      active: true,
    };
    setAlerts((prev) => [newEntry, ...prev]);
    setShowAddAlert(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("market_title")}
            </h1>
            <DemoBadge subtle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("market_subtitle")}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 active:scale-95 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{t("market_btn_refresh")}</span>
        </button>
      </div>

      {/* 2. Commodity Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <SlidersHorizontal className="h-4 w-4 text-stone-400 shrink-0 hidden sm:block" />
        {cropFilters.map((flt) => (
          <button
            key={flt.key}
            onClick={() => setSelectedCropFilter(flt.key)}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedCropFilter === flt.key
                ? "bg-agri-700 text-white shadow-xs"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            {lang === "te" ? flt.labelTe : flt.labelEn}
          </button>
        ))}
      </div>

      {/* 3. Price Analytics Overview Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-200 dark:border-emerald-900/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            {t("market_highest_modal")}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900 dark:text-stone-50">₹16,500</span>
            <span className="text-xs text-stone-500">/ quintal</span>
          </div>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
            Chilli (Teja) at Khammam APMC
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-sky-500/10 to-transparent border-sky-200 dark:border-sky-900/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
            Paddy (RNR 15048) Modal
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900 dark:text-stone-50">₹2,320</span>
            <span className="text-xs text-stone-500">/ quintal</span>
          </div>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
            +₹50 today at Jagtial Yard (8 km away)
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-200 dark:border-amber-900/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Cotton (Bt Medium) Modal
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900 dark:text-stone-50">₹7,450</span>
            <span className="text-xs text-stone-500">/ quintal</span>
          </div>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
            Warangal Enumamula APMC (Stable)
          </p>
        </Card>
      </div>

      {/* 4. Grid of Mandi Commodity Cards */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>🌾 Live Telangana Wholesale Rates</span>
            <span className="text-[11px] font-normal text-stone-500">
              (Recorded: {SAMPLE_MANDI_PRICES[0].priceDate})
            </span>
          </h3>
          <span className="text-[11px] text-stone-500">Agmarknet Telangana APMC Sample</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrices.map((item) => {
            const isUp = item.changeAmount > 0;
            const isDown = item.changeAmount < 0;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:border-agri-400 hover:shadow-md dark:border-stone-800/80 dark:bg-stone-900/90"
              >
                {/* Commodity Title & Trend Icon */}
                <div className="flex items-center justify-between gap-1">
                  <div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                      {lang === "te" ? item.commodityTe : item.commodityEn}
                    </span>
                    <span className="text-[11px] text-stone-400">{item.variety}</span>
                  </div>
                  {isUp ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  ) : isDown ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <TrendingDown className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      <Minus className="h-4 w-4" />
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="my-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                      ₹{item.modalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      / quintal
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    {isUp && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +{item.changeAmount} ({item.changePct}%) vs yesterday
                      </span>
                    )}
                    {isDown && (
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {item.changeAmount} ({item.changePct}%) vs yesterday
                      </span>
                    )}
                    {!isUp && !isDown && (
                      <span className="text-stone-500 dark:text-stone-400">
                        Steady (0.0% change)
                      </span>
                    )}
                  </div>
                </div>

                {/* Market Yard Info & Trend Graph Trigger */}
                <div className="border-t border-stone-100 pt-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400 flex items-center justify-between">
                  <span className="truncate">
                    {lang === "te" ? item.marketNameTe : item.marketNameEn}
                  </span>
                  <button
                    onClick={() => setActiveTrendItem(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-agri-700 hover:text-agri-800 dark:text-agri-400"
                  >
                    <LineChartIcon className="h-3.5 w-3.5" />
                    <span>{t("market_btn_trend")}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 15-Day Price Trend Interactive Modal */}
      {activeTrendItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  {lang === "te" ? activeTrendItem.commodityTe : activeTrendItem.commodityEn}
                </h3>
                <p className="text-xs text-stone-500">
                  {lang === "te" ? activeTrendItem.marketNameTe : activeTrendItem.marketNameEn} • {t("market_modal_trend_title")}
                </p>
              </div>
              <button
                onClick={() => setActiveTrendItem(null)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SAMPLE_MANDI_PRICE_TRENDS[activeTrendItem.id] || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}/qtl`, "Modal Rate"]}
                    contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#16a34a" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800 text-xs">
              <span className="text-stone-500">
                Latest recorded rate: <b>₹{activeTrendItem.modalPrice.toLocaleString("en-IN")}</b>
              </span>
              <button
                onClick={() => setActiveTrendItem(null)}
                className="rounded-xl bg-agri-700 px-4 py-2 font-semibold text-white hover:bg-agri-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Lower Section: Nearby Mandi Yards with Directions & Price Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Nearby Telangana APMC Market Yards with Google Maps Link (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("market_nearby_title")}
            subtitle="Verified APMC market yards in your agriculture division"
            icon={<Store className="h-5 w-5 text-agri-600" />}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SAMPLE_MANDI_PRICES.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-xl border border-stone-150 bg-stone-50/70 p-4 transition hover:border-agri-300 dark:border-stone-800 dark:bg-stone-850"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      {lang === "te" ? m.marketNameTe : m.marketNameEn}
                    </h4>
                    <Badge variant={m.status === "open" ? "normal" : "outline"}>
                      {m.status === "open" ? "OPEN" : "CLOSED"}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Primary: {lang === "te" ? m.commodityTe : m.commodityEn} ({m.variety})
                  </p>

                  <div className="mt-2.5 space-y-1 text-xs text-stone-600 dark:text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-stone-400" />
                      <span>{m.distanceKm} km away • {m.districtEn} District</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-stone-400" />
                      <span>Yard Timings: 06:00 AM – 06:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-agri-600/30 bg-agri-50 px-3 py-2 text-xs font-semibold text-agri-800 transition hover:bg-agri-100 dark:bg-agri-950/40 dark:text-agri-300 dark:hover:bg-agri-900/60"
                  >
                    <span>{t("market_open_maps")}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Rail: Price Alerts Card */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {t("market_price_alerts_title")}
                </h3>
              </div>
              <button
                onClick={() => setShowAddAlert(!showAddAlert)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 dark:border-stone-700"
                title="Add alert"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {showAddAlert && (
              <form onSubmit={handleCreateAlert} className="mt-3 rounded-xl border border-agri-200 bg-agri-50/50 p-3 text-xs space-y-2 dark:border-agri-900/50 dark:bg-agri-950/30">
                <p className="font-bold text-agri-900 dark:text-agri-200">Set Custom Mandi Alert</p>
                <div>
                  <label className="text-[10px] text-stone-500 block">Crop Name</label>
                  <input
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-1.5 text-xs dark:border-stone-700 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block">Target Threshold (₹/quintal)</label>
                  <input
                    type="number"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-1.5 text-xs dark:border-stone-700 dark:bg-stone-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAlert(false)}
                    className="rounded-lg px-2.5 py-1 text-[11px] text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-agri-700 px-3 py-1 text-[11px] font-semibold text-white"
                  >
                    Save Alert
                  </button>
                </div>
              </form>
            )}

            <div className="mt-3 space-y-2.5">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="flex items-center justify-between rounded-xl border border-stone-150 p-3 text-xs dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850"
                >
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{al.crop}</p>
                    <p className="text-[11px] text-stone-500">{al.condition}</p>
                  </div>
                  <button
                    onClick={() => toggleAlert(al.id)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                      al.active
                        ? "bg-agri-700 text-white"
                        : "bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
                    }`}
                  >
                    {al.active ? t("market_alert_active") : "Paused"}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Community Q&A Feed Placeholder Card (Honest Data Rule: Deferred to Phase 4) */}
          <Card className="bg-stone-50/80 border-dashed border-stone-300 dark:border-stone-800 dark:bg-stone-900/60">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
              <Users className="h-4 w-4 text-agri-600" />
              <span>Farmer Community Q&A Feed</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Telangana Rythu discussion board with admin-verified expert moderation will be introduced in <b>Phase 4</b> per project roadmap.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
