"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Navigation,
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
        /* ================= TAB 1: SIMPLE FARMER-FIRST MANDI HUB ================= */
        <div className="space-y-6">
          {/* STEP 1: SELECT CROP (BIG, SIMPLE, ONE-TOUCH BUTTONS) */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-50 flex items-center gap-2">
                  <span>🌾 1. Select Crop / పంటను ఎంచుకోండి:</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === "te"
                    ? "పంటను ఎంచుకుని నేటి మార్కెట్ రాకలు, ధరలు మరియు యార్డ్ లొకేషన్ వివరాలు పొందండి"
                    : "Tap any crop to instantly see today's arrivals, procurement prices & mandi yard directions"}
                </p>
              </div>

              {selectedCropFilter !== "all" && (
                <button
                  onClick={() => handleSelectCrop("all")}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>{lang === "te" ? "అన్ని పంటలు చూపించు" : "Show All Crops"}</span>
                </button>
              )}
            </div>

            {/* Big Tactile Crop Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {[
                { key: "paddy", labelEn: "Paddy", labelTe: "వరి (ధాన్యం)", icon: "🌾", badge: "+₹500 Bonus" },
                { key: "cotton", labelEn: "Cotton", labelTe: "పత్తి", icon: "☁️", badge: "CCI Rate" },
                { key: "maize", labelEn: "Maize", labelTe: "మొక్కజొన్న", icon: "🌽", badge: "Feed Demand" },
                { key: "chilli", labelEn: "Chilli", labelTe: "మిరప", icon: "🌶️", badge: "Spot Auction" },
                { key: "redgram", labelEn: "Redgram", labelTe: "కందులు", icon: "🫘", badge: "MSP Center" },
                { key: "turmeric", labelEn: "Turmeric", labelTe: "పసుపు", icon: "🟡", badge: "Nizamabad" },
                { key: "groundnut", labelEn: "Groundnut", labelTe: "వేరుశెనగ", icon: "🥜", badge: "Oil Mills" },
                { key: "all", labelEn: "All Crops", labelTe: "అన్ని పంటలు", icon: "✨", badge: "All Mandis" },
              ].map((c) => {
                const isSelected = selectedCropFilter === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => handleSelectCrop(c.key)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 ring-2 ring-emerald-500 shadow-md text-emerald-950 dark:text-emerald-100 font-black"
                        : "border-stone-200 bg-stone-50/50 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{c.icon}</span>
                    <span className="text-xs sm:text-sm font-bold leading-tight">
                      {lang === "te" ? c.labelTe : c.labelEn}
                    </span>
                    <span
                      className={`mt-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {c.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SUMMARY OF TODAY'S ARRIVALS & RATES FOR SELECTED CROP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Arrivals */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block truncate">
                  {lang === "te" ? "నేటి మొత్తం రాకలు" : "Today's Total Arrivals"}
                </span>
                <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                  {metrics.totalArrivals.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-stone-500 block truncate">
                  {lang === "te" ? "క్వింటాళ్ల రాకలు రికార్డయ్యాయి" : "Quintals arrived at yards"}
                </span>
              </div>
            </div>

            {/* 2. Highest Mandi Rate */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block truncate">
                  {lang === "te" ? "అత్యధిక ధర (టాప్ రేటు)" : "Top Mandi Rate Today"}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {metrics.highest ? `₹${(metrics.highest.totalFarmerRate || metrics.highest.modalPrice).toLocaleString("en-IN")}` : "---"}
                </span>
                <span className="text-xs text-stone-500 block truncate">
                  {metrics.highest ? `${metrics.highest.marketNameEn}` : "/ quintal"}
                </span>
              </div>
            </div>

            {/* 3. Telangana Bonus / MSP Status */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block truncate">
                  {metrics.hasBonusPaddy ? "Telangana State Bonus" : "Govt MSP Protection"}
                </span>
                <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                  {metrics.hasBonusPaddy ? "+₹500 / Qtl" : "MSP Protected"}
                </span>
                <span className="text-xs text-stone-500 block truncate">
                  {metrics.hasBonusPaddy ? "Direct DBT to bank account" : "Fair Average Quality (FAQ)"}
                </span>
              </div>
            </div>

            {/* 4. Active Mandis & Nearest Yard */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block truncate">
                  {lang === "te" ? "క్రియాశీల యార్డులు" : "Active Mandi Yards"}
                </span>
                <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                  {metrics.uniqueYardsCount} {lang === "te" ? "యార్డులు" : "Yards Open"}
                </span>
                <span className="text-xs text-stone-500 block truncate">
                  {filteredPrices[0] ? `Nearest: ${filteredPrices[0].distanceKm} km away` : "Telangana APMC"}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: MANDI ARRIVALS & DIRECT LOCATION NAVIGATION SECTION */}
          <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>🏛️ 2. Mandi Arrivals & Yard Directions ({activeCropLabel})</span>
                  <Badge variant="online" className="text-[10px] py-0.5">
                    ● Live Arrivals Feed
                  </Badge>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === "te"
                    ? "మీ పంటను అమ్ముకోవడానికి దగ్గరి మార్కెట్ యార్డ్‌ను ఎంచుకుని లొకేషన్ బటన్ నొక్కండి"
                    : "Review today's arrivals and tap 'Get Directions' to navigate directly to the Mandi gate"}
                </p>
              </div>

              {/* View Switcher: Easy Cards vs Full Table */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-850 p-1 rounded-xl border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
                <button
                  onClick={() => setMandiViewMode("cards")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    mandiViewMode === "cards"
                      ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                      : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>{lang === "te" ? "యార్డ్ కార్డులు" : "Yard Cards"}</span>
                </button>
                <button
                  onClick={() => setMandiViewMode("table")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    mandiViewMode === "table"
                      ? "bg-white text-emerald-800 shadow-2xs dark:bg-stone-800 dark:text-emerald-300"
                      : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{lang === "te" ? "టేబుల్ లిస్ట్" : "APMC Table"}</span>
                </button>
              </div>
            </div>

            {filteredPrices.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
                <Store className="h-10 w-10 text-stone-400 mx-auto mb-3" />
                <p className="text-base font-bold text-stone-800 dark:text-stone-200">
                  {lang === "te" ? "ఎంచుకున్న పంటకు రాకలు కనుగొనబడలేదు" : "No market arrivals found for this crop"}
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  {lang === "te"
                    ? "ఈ పంటకు నేటి మార్కెట్ యార్డ్ రికార్డులు లేవు. ఇతర పంటలను ఎంచుకోండి."
                    : "Try selecting All Crops or switching commodities above to see active Telangana market yards."}
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t("market_reset_filters")}</span>
                </button>
              </div>
            ) : mandiViewMode === "cards" ? (
              /* ================= 1. SIMPLE CARD VIEW WITH PROMINENT ARRIVALS & DIRECTIONS ================= */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrices.map((item) => {
                  const hasBonus = (item.govtBonus || 0) > 0;
                  const totalRate = item.totalFarmerRate || (item.modalPrice + (item.govtBonus || 0));
                  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    item.mapsQuery || `${item.marketNameEn}, ${item.districtEn}, Telangana`
                  )}`;

                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Header: Yard Name & Distance */}
                        <div className="flex items-start justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3 mb-3">
                          <div>
                            <h4 className="text-base font-black text-stone-900 dark:text-stone-50 leading-snug">
                              {lang === "te" ? item.marketNameTe : item.marketNameEn}
                            </h4>
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mt-0.5">
                              {lang === "te" ? item.districtTe : item.districtEn} District
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 shrink-0 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.distanceKm} km</span>
                          </span>
                        </div>

                        {/* Commodity & Variety Badge */}
                        <div className="mb-3">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                            {lang === "te" ? `${item.commodityTe} (${item.varietyTe || item.variety})` : `${item.commodityEn} (${item.variety})`}
                          </span>
                          {hasBonus && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
                              +₹500/Qtl Telangana State Bonus via DBT
                            </span>
                          )}
                        </div>

                        {/* PROMINENT ARRIVALS BADGE & TODAY'S RATE */}
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 mb-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <span>{lang === "te" ? "నేటి రాకలు" : "Today's Arrivals"}</span>
                            </span>
                            <span className="text-base sm:text-lg font-black font-mono text-stone-900 dark:text-white mt-0.5 block">
                              {item.arrivalsQtl.toLocaleString("en-IN")} Qtl
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate">
                              Weighment Active
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>{lang === "te" ? "రైతు ధర" : "Farmer Rate"}</span>
                            </span>
                            <span className="text-base sm:text-lg font-black font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                              ₹{totalRate.toLocaleString("en-IN")}/Qtl
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate">
                              {item.mspPrice > 0 ? `MSP: ₹${item.mspPrice.toLocaleString("en-IN")}` : "Spot Auction"}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-stone-500 mb-3 flex items-center justify-between">
                          <span>Price Range: <b>₹{item.minPrice.toLocaleString("en-IN")} – ₹{item.maxPrice.toLocaleString("en-IN")}</b></span>
                          <span className="text-emerald-600 font-semibold">{item.marketStatus || "Active Mandi Trade"}</span>
                        </div>
                      </div>

                      {/* PROMINENT LOCATION / DIRECTIONS & CALL ACTION BUTTONS */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
                        {/* BIG GREEN DIRECTIONS BUTTON */}
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm py-2.5 px-3 shadow-sm active:scale-98 transition"
                        >
                          <Navigation className="h-4 w-4" />
                          <span>{lang === "te" ? "యార్డ్ లొకేషన్ & దిశలు (Google Maps)" : "Get Mandi Directions (Google Maps)"}</span>
                        </a>

                        <div className="flex items-center gap-2">
                          {item.secretaryPhone ? (
                            <a
                              href={`tel:${item.secretaryPhone}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 py-2 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-50"
                            >
                              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{lang === "te" ? "ఫోన్ చేయండి" : "Call Yard"}</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => setActiveTrendItem(item)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 py-2 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-50"
                            >
                              <LineChartIcon className="h-3.5 w-3.5 text-emerald-600" />
                              <span>15-Day Trend</span>
                            </button>
                          )}

                          <button
                            onClick={() => setActiveTrendItem(item)}
                            className="inline-flex items-center justify-center p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
                            title="View 15-Day Price Trend"
                          >
                            <LineChartIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ================= 2. TABLE VIEW: CLEAN APMC PROCUREMENT TABLE WITH DIRECTIONS ================= */
              <div className="overflow-x-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-700">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Market Yard</th>
                      <th className="py-3.5 px-4 font-bold">Commodity & Variety</th>
                      <th className="py-3.5 px-4 font-bold text-amber-700 dark:text-amber-400">Today's Arrivals</th>
                      <th className="py-3.5 px-4 font-bold">Central MSP</th>
                      <th className="py-3.5 px-4 font-bold">TS Bonus</th>
                      <th className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">Total Farmer Rate</th>
                      <th className="py-3.5 px-4 font-bold text-center">Mandi Location (GPS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                    {filteredPrices.map((row) => {
                      const hasBonus = (row.govtBonus || 0) > 0;
                      const totalRate = row.totalFarmerRate || (row.modalPrice + (row.govtBonus || 0));
                      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        row.mapsQuery || `${row.marketNameEn}, ${row.districtEn}, Telangana`
                      )}`;

                      return (
                        <tr
                          key={row.id}
                          className={hasBonus ? "bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold" : "hover:bg-stone-50 dark:hover:bg-stone-850 transition"}
                        >
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-stone-900 dark:text-white block">
                              {lang === "te" ? row.marketNameTe : row.marketNameEn}
                            </span>
                            <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              <span>{row.distanceKm} km • {row.districtEn}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-800 dark:text-stone-200">
                            {lang === "te" ? `${row.commodityTe} (${row.varietyTe || row.variety})` : `${row.commodityEn} (${row.variety})`}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-800 dark:text-amber-300">
                            {row.arrivalsQtl.toLocaleString("en-IN")} Qtl
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
                          <td className="py-3.5 px-4 text-center">
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              <span>Directions</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* STEP 4: INTERACTIVE YIELD PAYOUT & WHATSAPP ADVISORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payout Calculator */}
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  💰 {profile.name}'s {activeCropLabel} Payout Calculator
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {profile.areaAcre || 4.5} Acres Farm
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === "te"
                    ? "అమ్మదలచిన దిగుబడి (క్వింటాళ్లు) నమోదు చేయండి:"
                    : "Enter Expected Crop to Sell (Quintals):"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={calcYieldQtl}
                  onChange={(e) => setCalcYieldQtl(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-lg font-black font-mono outline-none shadow-2xs focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-stone-500 mt-1.5 block">
                  Estimated ~{profile.areaAcre ? Math.round(calcYieldQtl / profile.areaAcre) : 21} Qtl/acre on your {profile.areaAcre || 4.5} acre field in {profile.district}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-500 block">Total Realized Value:</span>
                  <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-mono mt-1 block">
                    ₹{(calcYieldQtl * activeRate).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-stone-400">@ ₹{activeRate.toLocaleString("en-IN")}/quintal</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                    {activeBonus > 0 ? "Telangana DBT Bonus:" : "MSP Value:"}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">
                    {activeBonus > 0
                      ? `+₹${(calcYieldQtl * activeBonus).toLocaleString("en-IN")}`
                      : `₹${(calcYieldQtl * activeMsp).toLocaleString("en-IN")}`}
                  </span>
                  <span className="text-[10px] text-emerald-600">
                    {activeBonus > 0 ? "Direct DBT into Rythu Bank Account" : `Official MSP Benchmark`}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Share Advisory Generator */}
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                      WhatsApp Rythu Mandi Advisory
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                    Bilingual
                  </span>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-2xl p-3.5 border border-stone-200 dark:border-stone-700 font-mono text-[11px] text-stone-700 dark:text-stone-300 whitespace-pre-line max-h-40 overflow-y-auto">
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
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
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-1.5 shadow-xs"
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
