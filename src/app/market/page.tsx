"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Search,
  Filter,
  Check,
  Layers,
  Tag,
  Info,
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
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  COMMODITY_CROPS,
  VARIETIES_CATALOG,
  SAMPLE_MANDI_PRICES,
  SAMPLE_MANDI_PRICE_TRENDS,
  SAMPLE_COMMUNITY_POSTS,
} from "@/lib/data/sampleData";
import { MandiPriceItem, CommunityPost } from "@/lib/types";
import { generateWhatsAppUrl, copyToClipboard } from "@/lib/utils/kisanShare";

export default function MarketPage() {
  const { lang, t } = useLanguage();
  const { profile } = useFarmerProfile();
  const [activeMainTab, setActiveMainTab] = useState<"market" | "community">("market");
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>("all");
  const [selectedVarietyFilter, setSelectedVarietyFilter] = useState<string>("all");
  const [selectedMarketFilter, setSelectedMarketFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTrendItem, setActiveTrendItem] = useState<MandiPriceItem | null>(null);
  const [mandiViewMode, setMandiViewMode] = useState<"table" | "cards">("table");
  const [calcYieldQtl, setCalcYieldQtl] = useState<number>(95);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);

  // Auto-select crop from farmer profile
  useEffect(() => {
    if (profile?.primaryCrop) {
      const lower = profile.primaryCrop.toLowerCase();
      if (lower.includes("cotton") || lower.includes("పత్తి")) {
        setSelectedCropFilter("cotton");
        setCalcYieldQtl(Math.round((profile.areaAcre || 4.5) * 9));
      } else if (lower.includes("maize") || lower.includes("మొక్కజొన్న")) {
        setSelectedCropFilter("maize");
        setCalcYieldQtl(Math.round((profile.areaAcre || 4.5) * 28));
      } else if (lower.includes("chilli") || lower.includes("మిరప")) {
        setSelectedCropFilter("chilli");
        setCalcYieldQtl(Math.round((profile.areaAcre || 4.5) * 14));
      } else if (lower.includes("turmeric") || lower.includes("పసుపు")) {
        setSelectedCropFilter("turmeric");
        setCalcYieldQtl(Math.round((profile.areaAcre || 4.5) * 25));
      } else if (lower.includes("redgram") || lower.includes("కందులు")) {
        setSelectedCropFilter("redgram");
        setCalcYieldQtl(Math.round((profile.areaAcre || 4.5) * 7));
      } else {
        setSelectedCropFilter("paddy");
        setCalcYieldQtl(Math.round((profile.areaAcre || 4.5) * 21));
      }
    }
  }, [profile?.primaryCrop, profile?.areaAcre]);

  // Live Mandi State from /api/mandi
  const [mandiPrices, setMandiPrices] = useState<MandiPriceItem[]>(SAMPLE_MANDI_PRICES);
  const [mandiSource, setMandiSource] = useState<string>("APMC Daily Snapshot");
  const [mandiNotice, setMandiNotice] = useState<string>("");
  const [isLiveMandi, setIsLiveMandi] = useState<boolean>(false);

  // Fetch from /api/mandi
  const fetchMandiData = async (cropKey?: string) => {
    try {
      setIsRefreshing(true);
      const activeCrop = cropKey !== undefined ? cropKey : selectedCropFilter;
      const url = activeCrop && activeCrop !== "all" ? `/api/mandi?crop=${activeCrop}` : "/api/mandi";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setMandiPrices(json.data);
          setMandiSource(json.source || "APMC Snapshot");
          setMandiNotice(json.notice || "");
          setIsLiveMandi(!!json.isLive);
        }
      }
    } catch (e) {
      // Keep existing sample
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMandiData();
  }, []);

  // Community Hub State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(SAMPLE_COMMUNITY_POSTS);
  const [communityFilter, setCommunityFilter] = useState<string>("all");
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState<"pest" | "market" | "seeds" | "schemes" | "machinery">("seeds");

  // Reset variety when crop changes & fetch crop-specific mandi feed
  const handleSelectCrop = (cropKey: string) => {
    setSelectedCropFilter(cropKey);
    setSelectedVarietyFilter("all");
    fetchMandiData(cropKey);
  };

  // Varieties belonging to the active crop
  const availableVarieties = useMemo(() => {
    if (selectedCropFilter === "all") return VARIETIES_CATALOG;
    return VARIETIES_CATALOG.filter((v) => v.cropKey === selectedCropFilter);
  }, [selectedCropFilter]);

  const selectedVarietyInfo = useMemo(() => {
    return VARIETIES_CATALOG.find((v) => v.varietyKey === selectedVarietyFilter);
  }, [selectedVarietyFilter]);

  // List of all distinct APMC markets for dropdown
  const allApmcMarkets = useMemo(() => {
    return Array.from(new Set(mandiPrices.map((p) => p.marketNameEn))).sort();
  }, [mandiPrices]);

  // Filtered mandi prices
  const filteredPrices = useMemo(() => {
    return mandiPrices.filter((item) => {
      // 1. Crop filter
      if (selectedCropFilter !== "all" && item.cropKey !== selectedCropFilter) {
        return false;
      }
      // 2. Variety filter
      if (selectedVarietyFilter !== "all" && item.varietyKey !== selectedVarietyFilter) {
        return false;
      }
      // 3. APMC Market filter
      if (selectedMarketFilter !== "all" && item.marketNameEn !== selectedMarketFilter) {
        return false;
      }
      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchVariety =
          item.variety.toLowerCase().includes(q) ||
          (item.varietyTe && item.varietyTe.toLowerCase().includes(q));
        const matchCommodity =
          item.commodityEn.toLowerCase().includes(q) ||
          item.commodityTe.toLowerCase().includes(q);
        const matchMarket =
          item.marketNameEn.toLowerCase().includes(q) ||
          item.marketNameTe.toLowerCase().includes(q);
        const matchDistrict =
          item.districtEn.toLowerCase().includes(q) ||
          item.districtTe.toLowerCase().includes(q);
        if (!matchVariety && !matchCommodity && !matchMarket && !matchDistrict) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCropFilter, selectedVarietyFilter, selectedMarketFilter, searchQuery]);

  // Dynamic price metrics based on filtered results
  const metrics = useMemo(() => {
    if (filteredPrices.length === 0) {
      return {
        highest: null,
        lowest: null,
        totalArrivals: 0,
        uniqueYardsCount: 0,
        hasBonusPaddy: false,
      };
    }
    const sorted = [...filteredPrices].sort((a, b) => b.modalPrice - a.modalPrice);
    const totalArrivals = filteredPrices.reduce((sum, p) => sum + p.arrivalsQtl, 0);
    const uniqueYards = new Set(filteredPrices.map((p) => p.marketNameEn)).size;
    const hasBonus = filteredPrices.some((p) => (p.govtBonus || 0) > 0);

    return {
      highest: sorted[0],
      lowest: sorted[sorted.length - 1],
      totalArrivals,
      uniqueYardsCount: uniqueYards,
      hasBonusPaddy: hasBonus,
    };
  }, [filteredPrices]);

  const filteredCommunity = communityPosts.filter((post) => {
    if (communityFilter === "all") return true;
    return post.category === communityFilter;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleClearAllFilters = () => {
    setSelectedCropFilter("all");
    setSelectedVarietyFilter("all");
    setSelectedMarketFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilter =
    selectedCropFilter !== "all" ||
    selectedVarietyFilter !== "all" ||
    selectedMarketFilter !== "all" ||
    searchQuery.trim() !== "";

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
      authorName: profile.name,
      authorVillage: profile.village,
      authorDistrict: profile.district,
      authorCrop: profile.primaryCrop,
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

  const activeCalcRow = filteredPrices[0] || mandiPrices[0];
  const activeRate = activeCalcRow?.totalFarmerRate || (activeCalcRow?.modalPrice + (activeCalcRow?.govtBonus || 0)) || 2820;
  const activeMsp = activeCalcRow?.mspPrice || 2320;
  const activeBonus = activeCalcRow?.govtBonus || 0;
  const activeCropLabel =
    selectedCropFilter === "all"
      ? (lang === "te" ? "అన్ని పంటలు" : "All Commodities")
      : COMMODITY_CROPS.find((c) => c.key === selectedCropFilter)
      ? (lang === "te" ? COMMODITY_CROPS.find((c) => c.key === selectedCropFilter)!.labelTe : COMMODITY_CROPS.find((c) => c.key === selectedCropFilter)!.labelEn)
      : selectedCropFilter.toUpperCase();

  const whatsappText = `🌾 *Smart Farm Assistant — Live Mandi Rates & Payout* 🌾
📍 రైతు: ${profile.name} (${profile.village}, ${profile.district})
🌱 పంట: ${activeCropLabel} (${selectedVarietyInfo ? (lang === "te" ? selectedVarietyInfo.nameTe : selectedVarietyInfo.nameEn) : (profile.primaryCrop || "RNR 15048")} • ${profile.areaAcre} ఎకరాలు)
💰 ${lang === "te" ? activeCalcRow?.marketNameTe : activeCalcRow?.marketNameEn}: ₹${activeRate.toLocaleString("en-IN")}/క్వింటాల్ ${activeBonus > 0 ? `(MSP ₹${activeMsp.toLocaleString("en-IN")} + తెలంగాణ బోనస్ ₹${activeBonus})` : `(MSP ₹${activeMsp.toLocaleString("en-IN")})`}
📊 అంచనా చెల్లింపు: ${calcYieldQtl} క్వింటాళ్లు = ₹${(calcYieldQtl * activeRate).toLocaleString("en-IN")}
${activeBonus > 0 ? `🏛️ తెలంగాణ బోనస్ (DBT): +₹${(calcYieldQtl * activeBonus).toLocaleString("en-IN")}
` : ""}🌐 ప్రత్యక్ష పోర్టల్: https://smartfarming-web.vercel.app`;

  return (
    <div className="space-y-6">
      {/* 1. Header with Live Agmarknet Badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("market_title")}
            </h1>
            <Badge
              variant={isLiveMandi ? "online" : "normal"}
              className="py-1 px-3 gap-1.5 font-bold shadow-2xs"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isLiveMandi ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{mandiSource}</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("market_subtitle")} • Source: <b>{mandiSource}</b>
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
        <div className="space-y-5">
          {/* 1. Primary Commodity Chips Bar */}
          <div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <SlidersHorizontal className="h-4 w-4 text-stone-400 shrink-0 hidden sm:block" />
              {COMMODITY_CROPS.map((crop) => {
                const isActive = selectedCropFilter === crop.key;
                return (
                  <button
                    key={crop.key}
                    onClick={() => handleSelectCrop(crop.key)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-agri-700 text-white shadow-xs"
                        : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                    }`}
                  >
                    <span>{crop.icon}</span>
                    <span>{lang === "te" ? crop.labelTe : crop.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Variety Selector Bar: Choose Specific Crop Variety */}
          <div className="rounded-2xl border border-agri-200/90 bg-gradient-to-r from-agri-50/70 via-white to-agri-50/30 p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900/90 dark:from-stone-900 dark:to-stone-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-agri-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-agri-600 dark:text-agri-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-agri-950 dark:text-agri-200">
                  {lang === "te" ? "రకం ఎంచుకోండి (Choose Variety):" : "Choose Variety / Commercial Grade:"}
                </span>
                <span className="text-[11px] text-stone-500">
                  ({availableVarieties.length} {lang === "te" ? "రకాలు" : "varieties in catalogue"})
                </span>
              </div>
              {selectedVarietyFilter !== "all" && (
                <button
                  onClick={() => setSelectedVarietyFilter("all")}
                  className="text-[11px] font-semibold text-agri-700 hover:text-agri-900 dark:text-agri-400 flex items-center gap-1 self-start sm:self-auto"
                >
                  <X className="h-3 w-3" />
                  <span>{lang === "te" ? "అన్ని రకాలు చూపించు" : "Show All Varieties"}</span>
                </button>
              )}
            </div>

            {/* Variety Quick Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedVarietyFilter("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedVarietyFilter === "all"
                    ? "bg-agri-700 text-white shadow-xs"
                    : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
                }`}
              >
                <span>{lang === "te" ? "అన్ని రకాలు (All Varieties)" : "All Varieties"}</span>
              </button>
              {availableVarieties.map((v) => {
                const isSelected = selectedVarietyFilter === v.varietyKey;
                return (
                  <button
                    key={v.varietyKey}
                    onClick={() => setSelectedVarietyFilter(isSelected ? "all" : v.varietyKey)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-agri-700 text-white shadow-xs ring-2 ring-agri-500"
                        : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
                    }`}
                  >
                    <span>{lang === "te" ? v.nameTe : v.nameEn}</span>
                    {v.bonusEligible && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        +₹500 Govt Bonus
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Variety Information Banner */}
            {selectedVarietyInfo && (
              <div className="mt-3 rounded-xl bg-white/95 p-3 text-xs border border-agri-200/70 dark:bg-stone-850 dark:border-stone-800 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <Tag className="h-3.5 w-3.5 text-agri-600" />
                  <span>{lang === "te" ? selectedVarietyInfo.nameTe : selectedVarietyInfo.nameEn}</span>
                  {selectedVarietyInfo.bonusEligible && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                      {lang === "te"
                        ? "తెలంగాణ ప్రభుత్వం +₹500 సన్న వడ్ల బోనస్ అర్హత"
                        : "Eligible for +₹500/qtl Telangana State Fine Paddy Bonus"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                  {lang === "te" ? selectedVarietyInfo.featuresTe : selectedVarietyInfo.featuresEn}
                </p>
              </div>
            )}
          </div>

          {/* 3. Search and Secondary APMC Market Yard Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* APMC Yard / District Dropdown */}
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
              <select
                value={selectedMarketFilter}
                onChange={(e) => setSelectedMarketFilter(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs font-semibold text-stone-800 shadow-2xs focus:border-agri-500 focus:outline-hidden dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
              >
                <option value="all">
                  {lang === "te"
                    ? "తెలంగాణలోని అన్ని మార్కెట్ యార్డులు (All APMCs)"
                    : "All Telangana APMC Yards"}
                </option>
                {allApmcMarkets.map((mkt) => (
                  <option key={mkt} value={mkt}>
                    {mkt}
                  </option>
                ))}
              </select>
            </div>

            {/* Instant Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("market_search_placeholder")}
                className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-8 py-2.5 text-xs text-stone-900 placeholder-stone-400 shadow-2xs focus:border-agri-500 focus:outline-hidden dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilter && (
              <button
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 self-start sm:self-auto"
              >
                <RefreshCw className="h-3 w-3" />
                <span>{t("market_reset_filters")}</span>
              </button>
            )}
          </div>

          {/* 4. Real Price Analytics Cards (Dynamic Based on Active Selection) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {selectedVarietyFilter !== "all"
                    ? (lang === "te" ? "ఈ రకానికి గరిష్ట ధర" : "Highest for Selected Variety")
                    : t("market_highest_modal")}
                </p>
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">
                  {metrics.highest ? `₹${metrics.highest.modalPrice.toLocaleString("en-IN")}` : "---"}
                </span>
                <span className="text-xs text-stone-500">/ quintal</span>
              </div>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 truncate">
                {metrics.highest
                  ? `${metrics.highest.variety} at ${
                      lang === "te" ? metrics.highest.marketNameTe : metrics.highest.marketNameEn
                    }`
                  : "No market arrivals"}
              </p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-sky-500/10 to-transparent border-sky-200 dark:border-sky-900/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                  {metrics.hasBonusPaddy
                    ? (lang === "te" ? "తెలంగాణ సోనా / సన్న బియ్యం" : "Telangana Fine Rice Bonus")
                    : (lang === "te" ? "కనీస మద్దతు ధర (MSP)" : "Govt MSP Benchmark")}
                </p>
                {metrics.hasBonusPaddy ? (
                  <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    +₹500 Govt Bonus
                  </span>
                ) : (
                  <Building2 className="h-4 w-4 text-sky-600" />
                )}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">
                  {metrics.hasBonusPaddy ? "₹2,300 + ₹500" : "MSP Protected"}
                </span>
                <span className="text-xs text-stone-500">
                  {metrics.hasBonusPaddy ? "= ₹2,800/qtl" : "as per FAQ norms"}
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 truncate">
                {metrics.hasBonusPaddy
                  ? "Telangana Rythu Fine Grain Incentive for RNR 15048 & BPT 5204"
                  : "Fair Average Quality (FAQ) certified procurement at APMCs"}
              </p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {lang === "te" ? "నేటి మొత్తం మార్కెట్ రాకలు" : "Today's Mandi Arrivals"}
                </p>
                <Truck className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 dark:text-stone-50">
                  {metrics.totalArrivals.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-stone-500">Quintals</span>
              </div>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                {lang === "te"
                  ? `${metrics.uniqueYardsCount} వ్యవసాయ మార్కెట్ యార్డులలో క్రియాశీల రాకలు`
                  : `Active arrivals across ${metrics.uniqueYardsCount} Telangana APMC yards`}
              </p>
            </Card>
          </div>

          {/* 5. Live Telangana APMC Mandi Rates Table & Cards */}
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>🌾 Live Telangana Wholesale Rates ({activeCropLabel})</span>
                  <span className="text-[11px] font-normal text-stone-500">
                    • Showing {filteredPrices.length} arrivals
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedCropFilter !== "all"
                    ? `Live procurement prices across Telangana markets for ${activeCropLabel}`
                    : "Wholesale APMC yard rates synchronized with Central MSP and Telangana ₹500 State Bonus"}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* View Switcher: Table View (Requested Layout) vs Card View */}
                <div className="flex items-center rounded-xl border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-850">
                  <button
                    onClick={() => setMandiViewMode("table")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      mandiViewMode === "table"
                        ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                        : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>{lang === "te" ? "టేబుల్ వీక్షణ" : "APMC Table"}</span>
                  </button>
                  <button
                    onClick={() => setMandiViewMode("cards")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      mandiViewMode === "cards"
                        ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                        : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                    }`}
                  >
                    <Store className="h-3.5 w-3.5" />
                    <span>{lang === "te" ? "కార్డుల వీక్షణ" : "Yard Cards"}</span>
                  </button>
                </div>

                <a
                  href="https://tsmarketing.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-agri-700 hover:underline flex items-center gap-1 dark:text-agri-400 hidden md:flex"
                >
                  <span>tsmarketing.in</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {filteredPrices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
                <Store className="h-8 w-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {t("market_no_matching")}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {lang === "te"
                    ? "ఎంచుకున్న రకం లేదా మార్కెట్ ఫిల్టర్లలో రాకలు లేవు. ఫిల్టర్లు క్లియర్ చేసి తిరిగి ప్రయత్నించండి."
                    : "No APMC yards found for the selected variety and market combination. Try clearing filters."}
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-agri-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-agri-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t("market_reset_filters")}</span>
                </button>
              </div>
            ) : mandiViewMode === "table" ? (
              /* ================= TABLE VIEW: EXACT APMC PROCUREMENT TABLE ================= */
              <div className="space-y-6">
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-700">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Market Yard</th>
                        <th className="py-3.5 px-4 font-bold">Commodity & Variety</th>
                        <th className="py-3.5 px-4 font-bold">Central MSP</th>
                        <th className="py-3.5 px-4 font-bold">TS State Bonus</th>
                        <th className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">Total Farmer Rate</th>
                        <th className="py-3.5 px-4 font-bold">Market Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                      {filteredPrices.map((row) => {
                        const hasBonus = (row.govtBonus || 0) > 0;
                        const totalRate = row.totalFarmerRate || (row.modalPrice + (row.govtBonus || 0));
                        return (
                          <tr
                            key={row.id}
                            className={hasBonus ? "bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold" : "hover:bg-stone-50 dark:hover:bg-stone-850 transition"}
                          >
                            <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                              {lang === "te" ? row.marketNameTe : row.marketNameEn}
                            </td>
                            <td className="py-3.5 px-4 text-stone-800 dark:text-stone-200">
                              {lang === "te" ? `${row.commodityTe} (${row.varietyTe || row.variety})` : `${row.commodityEn} (${row.variety})`}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-stone-700 dark:text-stone-300">
                              {row.mspPrice > 0 ? `₹${row.mspPrice.toLocaleString("en-IN")}` : "N/A"}
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              {hasBonus ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                                  +₹{row.govtBonus}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm md:text-base">
                              ₹{totalRate.toLocaleString("en-IN")} / Qtl
                            </td>
                            <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                              {row.marketStatus || (hasBonus ? "Bonus Disbursed via DBT" : "Active MSP Procurement")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Interactive Yield Payout Deck & WhatsApp Share */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Payout Calculator */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                        {profile.name}'s {activeCropLabel} Payout Calculator
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {selectedVarietyInfo ? (lang === "te" ? selectedVarietyInfo.nameTe : selectedVarietyInfo.nameEn) : (profile.primaryCrop || "RNR 15048")} ({profile.areaAcre || 4.5} Acres)
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Expected Yield in Quintals / దిగుబడి (క్వింటాళ్లు):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={calcYieldQtl}
                        onChange={(e) => setCalcYieldQtl(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-base font-bold font-mono outline-none"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Estimated ~{profile.areaAcre ? Math.round(calcYieldQtl / profile.areaAcre) : 21} Qtl/acre on {profile.areaAcre || 4.5} Acres | ఖరీఫ్ సగటు దిగుబడి అంచనా
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                        <span className="text-xs text-stone-500 block">Total Realized Value:</span>
                        <span className="text-xl font-black text-stone-900 dark:text-white font-mono mt-1 block">
                          ₹{(calcYieldQtl * activeRate).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-stone-400">@ ₹{activeRate.toLocaleString("en-IN")}/quintal</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                          {activeBonus > 0 ? "TS Bonus Component:" : "Base MSP Value:"}
                        </span>
                        <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">
                          {activeBonus > 0
                            ? `+₹${(calcYieldQtl * activeBonus).toLocaleString("en-IN")}`
                            : `₹${(calcYieldQtl * activeMsp).toLocaleString("en-IN")}`}
                        </span>
                        <span className="text-[10px] text-emerald-600">
                          {activeBonus > 0 ? "Direct DBT to Rythu Account" : `MSP Benchmark: ₹${activeMsp.toLocaleString("en-IN")}/Qtl`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Share Advisory Generator */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                            WhatsApp Rythu Advisory Formatter
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                          Bilingual Text
                        </span>
                      </div>

                      <div className="bg-white dark:bg-stone-900 rounded-xl p-3 border border-stone-200 dark:border-stone-700 font-mono text-[11px] text-stone-700 dark:text-stone-300 whitespace-pre-line max-h-40 overflow-y-auto">
                        {whatsappText}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            const ok = await copyToClipboard(whatsappText);
                            if (ok) {
                              setCopiedShareText(true);
                              setTimeout(() => setCopiedShareText(false), 2500);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
                            copiedShareText
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-700 hover:bg-emerald-800 text-white"
                          }`}
                        >
                          {copiedShareText ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                          <span>{copiedShareText ? "Copied!" : "Copy Text"}</span>
                        </button>

                        <a
                          href={generateWhatsAppUrl(whatsappText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share on WhatsApp</span>
                        </a>
                      </div>

                      <span className="text-[11px] text-stone-500">Rythu Direct Share</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= CARD VIEW (ORIGINAL DETAILED GRID) ================= */
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
                        {/* Variety Badge & Trend Icon */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:border-emerald-900/60 dark:text-emerald-300">
                                {lang === "te" && item.varietyTe ? item.varietyTe : item.variety}
                              </span>
                              {item.govtBonus && (
                                <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                                  +₹{item.govtBonus} State Bonus
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 block">
                              {lang === "te" ? item.commodityTe : item.commodityEn}
                            </span>
                          </div>
                          {isUp ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                              <TrendingUp className="h-4 w-4" />
                            </span>
                          ) : isDown ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shrink-0">
                              <TrendingDown className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 shrink-0">
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
                                +₹{item.changeAmount} ({item.changePct}%)
                              </span>
                            )}
                            {isDown && (
                              <span className="font-semibold text-rose-600 dark:text-rose-400">
                                ₹{item.changeAmount} ({item.changePct}%)
                              </span>
                            )}
                            {!isUp && !isDown && (
                              <span className="text-stone-500 dark:text-stone-400">
                                Steady rate
                              </span>
                            )}
                            <span className="text-[11px] text-stone-400">• Modal Wholesale Rate</span>
                          </div>
                        </div>

                        {/* Real Market Details (Min / Max / Arrivals / MSP) */}
                        <div className="rounded-xl bg-stone-50 p-2.5 dark:bg-stone-850 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                            <span>{t("market_price_range")}:</span>
                            <b>
                              ₹{item.minPrice.toLocaleString("en-IN")} – ₹{item.maxPrice.toLocaleString("en-IN")}
                            </b>
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
                          <span className="text-[10px] text-stone-400 shrink-0">{item.distanceKm} km away</span>
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
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              item.mapsQuery
                            )}`}
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
            )}
          </div>

          {/* 15-Day Price Trend Interactive Modal */}
          {activeTrendItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
              <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                      {lang === "te" && activeTrendItem.varietyTe
                        ? activeTrendItem.varietyTe
                        : activeTrendItem.variety}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {lang === "te" ? activeTrendItem.marketNameTe : activeTrendItem.marketNameEn} •{" "}
                      {t("market_modal_trend_title")}
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
                    Latest recorded rate: <b>₹{activeTrendItem.modalPrice.toLocaleString("en-IN")}/qtl</b>
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
