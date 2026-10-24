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
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { DemoBadge } from "@/components/common/DemoBadge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SAMPLE_MANDI_PRICES } from "@/lib/data/sampleData";
import { MandiPriceItem } from "@/lib/types";

export default function MarketPage() {
  const { lang, t } = useLanguage();
  const [prices, setPrices] = useState<MandiPriceItem[]>(SAMPLE_MANDI_PRICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: "al-1", crop: "Paddy (Common / Sona)", condition: "Above ₹2,350 / qtl", active: true },
    { id: "al-2", crop: "Cotton (Medium Staple)", condition: "Above ₹7,500 / qtl", active: true },
    { id: "al-3", crop: "Chilli (Teja Red)", condition: "Above ₹16,000 / qtl", active: false },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
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

      {/* 2. Top Grid of Mandi Commodity Cards (Matching Screenshot 5) */}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {prices.slice(0, 4).map((item) => {
            const isUp = item.changeAmount > 0;
            const isDown = item.changeAmount < 0;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:border-agri-400 hover:shadow-md dark:border-stone-800/80 dark:bg-stone-900/90"
              >
                {/* Commodity Title & Trend Icon */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                    {lang === "te" ? item.commodityTe : item.commodityEn}
                  </span>
                  {isUp ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isDown ? (
                    <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <Minus className="h-4 w-4 text-stone-400 shrink-0" />
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
                        +{item.changeAmount} ({item.changePct}%)
                      </span>
                    )}
                    {isDown && (
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {item.changeAmount} ({item.changePct}%)
                      </span>
                    )}
                    {!isUp && !isDown && (
                      <span className="text-stone-500 dark:text-stone-400">
                        0 (0.0%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Market Yard Info */}
                <div className="border-t border-stone-100 pt-2.5 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400 flex items-center justify-between">
                  <span className="truncate">
                    {lang === "te" ? item.marketNameTe : item.marketNameEn}
                  </span>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {item.priceDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Section: Nearby Mandi Yards with Directions & Price Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Nearby Telangana APMC Market Yards with Google Maps Link (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("market_nearby_title")}
            subtitle="Verified APMC market yards in your agriculture division"
            icon={<Store className="h-5 w-5 text-agri-600" />}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {prices.slice(0, 4).map((m) => (
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

        {/* Right Rail: Price Alerts Card (Matching Screenshot 4) */}
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
                onClick={() => alert("Price alert builder will connect to real mandi SMS in Phase 2.")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 dark:border-stone-700"
                title="Add alert"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

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
