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
  ThumbsUp,
  MessageCircle,
  Share2,
  PhoneCall,
  ShieldCheck,
  Send,
  Building2,
  Truck,
  Award,
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
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  SAMPLE_MANDI_PRICES,
  SAMPLE_MANDI_PRICE_TRENDS,
  SAMPLE_COMMUNITY_POSTS,
} from "@/lib/data/sampleData";
import { MandiPriceItem, CommunityPost } from "@/lib/types";
import { generateWhatsAppUrl, copyToClipboard } from "@/lib/utils/kisanShare";

export default function MarketPage() {
  const { lang, t } = useLanguage();
  const [activeMainTab, setActiveMainTab] = useState<"market" | "community">("market");
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

  // Community Hub State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(SAMPLE_COMMUNITY_POSTS);
  const [communityFilter, setCommunityFilter] = useState<string>("all");
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState<"pest" | "market" | "seeds" | "schemes" | "machinery">("seeds");

  const cropFilters = [
    { key: "all", labelEn: "All Commodities", labelTe: "అన్ని రకాల పంటలు" },
    { key: "paddy", labelEn: "Paddy", labelTe: "వరి" },
    { key: "cotton", labelEn: "Cotton", labelTe: "పత్తి" },
    { key: "chilli", labelEn: "Chilli", labelTe: "మిరప" },
    { key: "turmeric", labelEn: "Turmeric", labelTe: "పసుపు" },
    { key: "maize", labelEn: "Maize", labelTe: "మొక్కజొన్న" },
    { key: "groundnut", labelEn: "Groundnut", labelTe: "వేరుశెనగ" },
    { key: "redgram", labelEn: "Redgram", labelTe: "కందులు" },
    { key: "soybean", labelEn: "Soybean", labelTe: "సోయాబీన్" },
  ];

  const filteredPrices = SAMPLE_MANDI_PRICES.filter((item) => {
    if (selectedCropFilter === "all") return true;
    return item.id.toLowerCase().includes(selectedCropFilter);
  });

  const filteredCommunity = communityPosts.filter((post) => {
    if (communityFilter === "all") return true;
    return post.category === communityFilter;
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

  const handleUpvote = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasVoted = p.hasUserUpvoted;
          return {
            ...p,
            upvotes: hasVoted ? p.upvotes - 1 : p.upvotes + 1,
            hasUserUpvoted: !hasVoted,
          };
        }
        return p;
      })
    );
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: "Mallesham Goud",
      authorVillage: "Mallapur",
      authorDistrict: "Jagtial",
      authorCrop: "Paddy (RNR 15048)",
      timeAgoEn: "Just now",
      timeAgoTe: "ఇప్పుడే",
      category: newQuestionCategory,
      questionEn: newQuestionText,
      questionTe: newQuestionText,
      upvotes: 1,
      hasUserUpvoted: true,
      repliesCount: 0,
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setNewQuestionText("");
    setShowAskModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Live Agmarknet Badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("market_title")}
            </h1>
            <Badge variant="online" className="py-1 px-3 gap-1.5 font-bold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("market_live_badge")}</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("market_subtitle")} • Source: <b>Telangana State Agricultural Marketing Dept & Agmarknet</b>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Segmented Toggle: Market vs Community */}
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900">
            <button
              onClick={() => setActiveMainTab("market")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeMainTab === "market"
                  ? "bg-white text-agri-800 shadow-2xs dark:bg-stone-800 dark:text-agri-300"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>{lang === "te" ? "మార్కెట్ ధరలు" : "APMC Mandi Rates"}</span>
            </button>
            <button
              onClick={() => setActiveMainTab("community")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeMainTab === "community"
                  ? "bg-white text-agri-800 shadow-2xs dark:bg-stone-800 dark:text-agri-300"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              <Users className="h-3.5 w-3.5 text-amber-500" />
              <span>{lang === "te" ? "రైతు సంఘం" : "Community Hub"}</span>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 active:scale-95 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            title="Refresh Live Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t("market_btn_refresh")}</span>
          </button>
        </div>
      </div>

      {activeMainTab === "market" ? (
        /* ================= TAB 1: REAL MARKET DATA VIEW ================= */
        <div className="space-y-6">
          {/* Commodity Filter Chips */}
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

          {/* Real Price Analytics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {t("market_highest_modal")}
                </p>
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">₹16,500</span>
                <span className="text-xs text-stone-500">/ quintal</span>
              </div>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                Chilli (Teja Export Grade) at Khammam APMC
              </p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-sky-500/10 to-transparent border-sky-200 dark:border-sky-900/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                  Telangana Sona Paddy (RNR 15048)
                </p>
                <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  +₹500 Govt Bonus
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">₹2,320</span>
                <span className="text-xs text-stone-500">/ quintal</span>
              </div>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                MSP ₹2,300 + State Bonus at Jagtial Yard (8 km away)
              </p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Nizamabad Turmeric e-NAM
                </p>
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">₹13,400</span>
                <span className="text-xs text-stone-500">/ quintal</span>
              </div>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                Daily arrivals: 5,600 Qtls (Active e-Auction)
              </p>
            </Card>
          </div>

          {/* Grid of Real APMC Mandi Cards */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>🌾 Live Telangana Wholesale Rates</span>
                <span className="text-[11px] font-normal text-stone-500">
                  (Official Agmarknet Feed: {SAMPLE_MANDI_PRICES[0].priceDate})
                </span>
              </h3>
              <a
                href="https://tsmarketing.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-agri-700 hover:underline flex items-center gap-1 dark:text-agri-400"
              >
                <span>tsmarketing.in Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
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
                    <div>
                      {/* Title & Trend Icon */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                            {lang === "te" ? item.commodityTe : item.commodityEn}
                          </span>
                          <span className="text-[11px] text-stone-500 block">{item.variety}</span>
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

                      {/* Modal Price Display */}
                      <div className="my-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                            ₹{item.modalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            / quintal
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
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
                              Steady
                            </span>
                          )}
                          {item.govtBonus && (
                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              +₹{item.govtBonus} State Bonus
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Real Market Details (Min / Max / Arrivals / MSP) */}
                      <div className="rounded-xl bg-stone-50 p-2.5 dark:bg-stone-850 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                          <span>{t("market_price_range")}:</span>
                          <b>₹{item.minPrice.toLocaleString("en-IN")} – ₹{item.maxPrice.toLocaleString("en-IN")}</b>
                        </div>
                        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                          <span>{t("market_arrivals")}:</span>
                          <b>{item.arrivalsQtl.toLocaleString("en-IN")} Quintals</b>
                        </div>
                        {item.mspPrice > 0 && (
                          <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                            <span>{t("market_msp_label")}:</span>
                            <span className="font-semibold text-agri-700 dark:text-agri-400">
                              ₹{item.mspPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Market Yard Info & Action Links */}
                    <div className="mt-3 border-t border-stone-100 pt-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                          {lang === "te" ? item.marketNameTe : item.marketNameEn}
                        </span>
                        <span className="text-[10px] text-stone-400">{item.distanceKm} km</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => setActiveTrendItem(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-agri-700 hover:text-agri-800 dark:text-agri-400"
                        >
                          <LineChartIcon className="h-3.5 w-3.5" />
                          <span>{t("market_btn_trend")}</span>
                        </button>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                        >
                          <MapPin className="h-3.5 w-3.5 text-stone-400" />
                          <span>Maps</span>
                        </a>

                        {item.secretaryPhone && (
                          <a
                            href={`tel:${item.secretaryPhone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                            title="Call Market Yard Secretary"
                          >
                            <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Call Yard</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 15-Day Price Trend Interactive Modal */}
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

          {/* Quick Preview of Rythu Community Feed at Bottom of Market */}
          <Card className="bg-gradient-to-r from-stone-50 to-agri-50/30 border-stone-200 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-agri-700" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {t("community_tab_title")}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Active Telangana farmer questions with verified PJTAU & AEO answers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveMainTab("community")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-agri-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-agri-800 transition self-start sm:self-auto"
              >
                <span>{lang === "te" ? "మొత్తం చర్చలు చూడండి" : "View All Discussions"}</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {communityPosts.slice(0, 2).map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-2xs dark:border-stone-800 dark:bg-stone-850 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <b>{post.authorName} ({post.authorVillage}, {post.authorDistrict})</b>
                    <span>{lang === "te" ? post.timeAgoTe : post.timeAgoEn}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {lang === "te" ? post.questionTe : post.questionEn}
                  </p>
                  {post.officialAnswer && (
                    <div className="rounded-lg bg-emerald-50 p-2 text-[11px] text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200/60">
                      <div className="flex items-center gap-1 font-bold mb-0.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>{post.officialAnswer.expertName} ({post.officialAnswer.designationEn})</span>
                      </div>
                      <p className="line-clamp-2">
                        {lang === "te" ? post.officialAnswer.answerTe : post.officialAnswer.answerEn}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        /* ================= TAB 2: FULL REAL RYTHU COMMUNITY HUB ================= */
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                  <Users className="h-5 w-5 text-agri-700" />
                  <span>{t("community_tab_title")}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {t("community_subtitle")}
                </p>
              </div>

              <button
                onClick={() => setShowAskModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-agri-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-agri-800 transition active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>{t("community_ask_btn")}</span>
              </button>
            </div>

            {/* Filter Pills for Community Topics */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {[
                { key: "all", labelEn: "All Discussions", labelTe: "అన్ని రకాల చర్చలు" },
                { key: "seeds", labelEn: "Seeds & Varieties", labelTe: "విత్తనాలు & రకాలు" },
                { key: "market", labelEn: "Mandi & Moisture", labelTe: "మార్కెట్ & తేమ నిబంధనలు" },
                { key: "machinery", labelEn: "Machinery & Rental", labelTe: "యంత్రాలు & అద్దె" },
                { key: "pest", labelEn: "Pest Outbreaks", labelTe: "తెగుళ్ల సమస్యలు" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setCommunityFilter(f.key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    communityFilter === f.key
                      ? "bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900"
                      : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
                  }`}
                >
                  {lang === "te" ? f.labelTe : f.labelEn}
                </button>
              ))}
            </div>

            {/* Discussion Posts Feed */}
            <div className="mt-5 space-y-4">
              {filteredCommunity.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-3"
                >
                  {/* Farmer Author Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-agri-100 text-agri-800 dark:bg-agri-950 dark:text-agri-300 text-xs font-bold">
                        {post.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          {post.authorName}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {post.authorVillage}, {post.authorDistrict} • Crop: <b>{post.authorCrop}</b>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-stone-400">
                      {lang === "te" ? post.timeAgoTe : post.timeAgoEn}
                    </span>
                  </div>

                  {/* Question Content */}
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 leading-relaxed">
                    {lang === "te" ? post.questionTe : post.questionEn}
                  </p>

                  {/* Verified Official Answer Block */}
                  {post.officialAnswer ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                            {post.officialAnswer.expertName}
                          </span>
                          <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                            ({lang === "te" ? post.officialAnswer.designationTe : post.officialAnswer.designationEn})
                          </span>
                        </div>
                        <span className="rounded-md bg-emerald-200/60 px-2 py-0.5 text-[9px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                          {t("community_verified_badge")}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 dark:text-stone-200 leading-relaxed">
                        {lang === "te" ? post.officialAnswer.answerTe : post.officialAnswer.answerEn}
                      </p>

                      <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400 font-medium pt-1">
                        Institution: {post.officialAnswer.institution} • Verified {post.officialAnswer.answeredAt}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-stone-50 p-3 text-xs text-stone-500 italic dark:bg-stone-850">
                      Waiting for local Mandal Agricultural Officer (MAO) verification.
                    </div>
                  )}

                  {/* Interactive Upvote & WhatsApp Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition ${
                          post.hasUserUpvoted
                            ? "bg-agri-100 text-agri-800 dark:bg-agri-950 dark:text-agri-300"
                            : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{t("community_helpful")} ({post.upvotes})</span>
                      </button>

                      <span className="inline-flex items-center gap-1 text-stone-500">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{post.repliesCount} {t("community_replies")}</span>
                      </span>
                    </div>

                    {post.officialAnswer && (
                      <a
                        href={generateWhatsAppUrl(
                          `🌾 *తెలంగాణ రైతు సమాచారం (Rythu Community)* 🌾\nరైతు: ${post.authorName} (${post.authorDistrict})\nప్రశ్న: ${post.questionTe}\n\n✅ *అధికారిక సమాధానం (${post.officialAnswer.expertName}):*\n${post.officialAnswer.answerTe}\n\n- Smart Farm Assistant Portal`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold dark:text-emerald-400"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Ask Question Interactive Modal */}
          {showAskModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
              <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                    {t("community_modal_title")}
                  </h3>
                  <button
                    onClick={() => setShowAskModal(false)}
                    className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handlePostQuestion} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Topic Category
                    </label>
                    <select
                      value={newQuestionCategory}
                      onChange={(e) => setNewQuestionCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs text-stone-900 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-100"
                    >
                      <option value="seeds">Seeds, Varieties & Sowing</option>
                      <option value="market">Mandi Yard Rates & Moisture Deductions</option>
                      <option value="machinery">Tractor & Harvester Custom Hiring</option>
                      <option value="schemes">Rythu Bharosa / Subsidies</option>
                      <option value="pest">Pest Outbreaks & Spraying</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Your Question (English or Telugu)
                    </label>
                    <textarea
                      rows={4}
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Type your question in Telugu or English (e.g. జగిత్యాలలో తెలంగాణ సోనా విత్తనాలు ఎక్కడ లభిస్తాయి?)..."
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-900 placeholder-stone-400 focus:border-agri-600 focus:outline-hidden dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setShowAskModal(false)}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newQuestionText.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-agri-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-agri-800 disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Post Question</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
