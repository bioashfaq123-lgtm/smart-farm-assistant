"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Landmark,
  Coins,
  Shield,
  Zap,
  Banknote,
  Droplet,
  Wallet,
  ShieldAlert,
  CreditCard,
  Sun,
  Tractor,
  FlaskConical,
  Wheat,
  Search,
  ExternalLink,
  Phone,
  CheckCircle2,
  FileText,
  HelpCircle,
  X,
  Calculator,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { GOVERNMENT_SCHEMES_DATA, GovernmentScheme } from "@/lib/data/governmentSchemes";

export default function GovernmentSchemesPage() {
  const { lang } = useLanguage();
  const { profile } = useFarmerProfile();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "state" | "central" | "dbt" | "insurance" | "irrigation_machinery">("all");
  const [activeModalScheme, setActiveModalScheme] = useState<GovernmentScheme | null>(null);

  // Interactive Calculator State
  const [calcAcres, setCalcAcres] = useState<number>(profile.areaAcre > 0 ? profile.areaAcre : 4.5);
  const [isPaddyCultivator, setIsPaddyCultivator] = useState<boolean>(
    profile.primaryCrop.toLowerCase().includes("paddy") || profile.primaryCrop.toLowerCase().includes("rice") || true
  );

  // Computed Financial Entitlements
  const rythuBharosaAmount = calcAcres * 15000;
  const fineRiceBonusEstimated = isPaddyCultivator ? Math.round(calcAcres * 20 * 500) : 0; // ~20 quintals per acre
  const pmKisanAmount = 6000;
  const powerSavingsEstimate = 35000; // estimated annual electricity cost savings
  const totalAnnualValue = rythuBharosaAmount + fineRiceBonusEstimated + pmKisanAmount + powerSavingsEstimate;

  // Filter schemes based on search query and category
  const filteredSchemes = useMemo(() => {
    return GOVERNMENT_SCHEMES_DATA.filter((scheme) => {
      // Category filter
      if (selectedFilter === "state" && scheme.level !== "state") return false;
      if (selectedFilter === "central" && scheme.level !== "central") return false;
      if (selectedFilter === "dbt" && scheme.category !== "dbt") return false;
      if (selectedFilter === "insurance" && scheme.category !== "insurance" && scheme.category !== "credit") return false;
      if (selectedFilter === "irrigation_machinery" && scheme.category !== "irrigation" && scheme.category !== "machinery" && scheme.category !== "soil") return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        scheme.nameEn.toLowerCase().includes(q) ||
        scheme.nameTe.toLowerCase().includes(q) ||
        scheme.shortName.toLowerCase().includes(q) ||
        scheme.summaryEn.toLowerCase().includes(q) ||
        scheme.summaryTe.toLowerCase().includes(q) ||
        scheme.financialBenefitEn.toLowerCase().includes(q) ||
        scheme.financialBenefitTe.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedFilter]);

  // Icon mapper
  const renderSchemeIcon = (type: string) => {
    const iconClass = "w-6 h-6 text-emerald-700 dark:text-emerald-400";
    switch (type) {
      case "coins":
        return <Coins className={iconClass} />;
      case "wheat":
        return <Wheat className={iconClass} />;
      case "shield":
        return <Shield className={iconClass} />;
      case "zap":
        return <Zap className={iconClass} />;
      case "banknote":
        return <Banknote className={iconClass} />;
      case "droplet":
        return <Droplet className={iconClass} />;
      case "wallet":
        return <Wallet className={iconClass} />;
      case "shield-alert":
        return <ShieldAlert className={iconClass} />;
      case "credit-card":
        return <CreditCard className={iconClass} />;
      case "sun":
        return <Sun className={iconClass} />;
      case "tractor":
        return <Tractor className={iconClass} />;
      case "flask":
        return <FlaskConical className={iconClass} />;
      default:
        return <Landmark className={iconClass} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
              <Landmark className="w-3.5 h-3.5" />
              <span>Official Government Portal • తెలంగాణ & కేంద్ర పథకాలు</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === "te" ? "ప్రభుత్వ వ్యవసాయ పథకాల వేదిక" : "Government Schemes Portal"}
          </h1>
          <p className="mt-1 text-sm text-emerald-100/90 leading-relaxed">
            {lang === "te"
              ? "తెలంగాణ రాష్ట్ర మరియు కేంద్ర ప్రభుత్వ రైతు సంక్షేమ పథకాలు, పెట్టుబడి సాయం (రైతు భరోసా), ₹500 సన్న బియ్యం బోనస్, పంటల బీమా, ఉచిత విద్యుత్ మరియు యాంత్రీకరణ సబ్సిడీల పూర్తి సమాచారం."
              : "Comprehensive directory of Telangana State and Central Government agricultural subsidies, Rythu Bharosa DBT, ₹500 fine rice bonus, PM-KISAN, crop insurance, and free electricity."}
          </p>
        </div>

        {/* Quick Highlights / Direct Links */}
        <div className="relative z-10 flex flex-col sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <span className="font-semibold text-white">Verified Data Source:</span>
            <span>Telangana Agri & GOI DAC&FW</span>
          </div>
          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kisan Call Centre: 1800-180-1551</span>
          </a>
        </div>

        {/* Subtle decorative background watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-white">
          <Landmark className="w-64 h-64" />
        </div>
      </div>

      {/* Dynamic Entitlement Calculator Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                {lang === "te"
                  ? "మీ అర్హత వార్షిక ప్రభుత్వ ప్రయోజనాల లెక్కింపు"
                  : "Calculate Your Annual Government Scheme Benefits"}
              </h2>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {lang === "te"
                ? "మీ సాగుభూమి విస్తీర్ణం ఆధారంగా రైతు భరోసా, సన్న బియ్యం బోనస్, పి.ఎం. కిసాన్ మరియు ఉచిత విద్యుత్ ద్వారా మీకు లభించే వార్షిక ఆర్థిక విలువ:"
                : "Based on your farm acreage, calculate instant annual DBT cash transfers, procurement bonuses, and free electricity savings:"}
            </p>

            {/* Slider & Options */}
            <div className="pt-2 space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-stone-700 dark:text-stone-300">
                    Cultivable Land Area / సాగుభూమి:
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    {calcAcres} Acres / ఎకరాలు
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15.0"
                  step="0.5"
                  value={calcAcres}
                  onChange={(e) => setCalcAcres(parseFloat(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:bg-stone-700"
                />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaddyCultivator}
                    onChange={(e) => setIsPaddyCultivator(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">
                    Include TS Fine Rice ₹500/Qtl Bonus (సన్న వరి సాగు)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Computed Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[280px]">
            <div className="rounded-xl bg-emerald-50/80 p-3.5 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block">
                Rythu Bharosa (TS)
              </span>
              <span className="text-lg font-bold text-emerald-950 dark:text-emerald-100">
                ₹{rythuBharosaAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                ₹15,000 / Acre / Yr
              </span>
            </div>

            {isPaddyCultivator && (
              <div className="rounded-xl bg-teal-50/80 p-3.5 border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800">
                <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 block">
                  Fine Rice Bonus (TS)
                </span>
                <span className="text-lg font-bold text-teal-950 dark:text-teal-100">
                  ₹{fineRiceBonusEstimated.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 block">
                  ~₹500 / Qtl on yield
                </span>
              </div>
            )}

            <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">
                PM-KISAN (Central)
              </span>
              <span className="text-lg font-bold text-amber-950 dark:text-amber-100">
                ₹6,000
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
                3 Installments / Yr
              </span>
            </div>

            <div className="rounded-xl bg-stone-900 text-white p-3.5 shadow-md dark:bg-emerald-900">
              <span className="text-[11px] font-semibold text-emerald-300 block">
                Total Annual Value
              </span>
              <span className="text-xl font-extrabold text-white">
                ₹{totalAnnualValue.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-stone-300 block">
                Direct DBT + Power savings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "te"
                ? "పథకం పేరు, వరి బోనస్, సోలార్, రైతు భరోసా శోధించండి..."
                : "Search schemes by name, keyword, bonus, solar, insurance..."
            }
            className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-emerald-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-semibold">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-2 rounded-xl transition shrink-0 ${
              selectedFilter === "all"
                ? "bg-stone-900 text-white shadow-xs dark:bg-emerald-800 dark:text-white"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
            }`}
          >
            All Schemes ({GOVERNMENT_SCHEMES_DATA.length})
          </button>
          <button
            onClick={() => setSelectedFilter("state")}
            className={`px-3 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
              selectedFilter === "state"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
            }`}
          >
            <span>🏛️</span>
            <span>Telangana State (6)</span>
          </button>
          <button
            onClick={() => setSelectedFilter("central")}
            className={`px-3 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
              selectedFilter === "central"
                ? "bg-amber-800 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
            }`}
          >
            <span>🇮🇳</span>
            <span>Central Govt (6)</span>
          </button>
          <button
            onClick={() => setSelectedFilter("dbt")}
            className={`px-3 py-2 rounded-xl transition shrink-0 ${
              selectedFilter === "dbt"
                ? "bg-stone-900 text-white shadow-xs dark:bg-emerald-800 dark:text-white"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
            }`}
          >
            Direct Cash DBT
          </button>
          <button
            onClick={() => setSelectedFilter("insurance")}
            className={`px-3 py-2 rounded-xl transition shrink-0 ${
              selectedFilter === "insurance"
                ? "bg-stone-900 text-white shadow-xs dark:bg-emerald-800 dark:text-white"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
            }`}
          >
            Insurance & Loans
          </button>
          <button
            onClick={() => setSelectedFilter("irrigation_machinery")}
            className={`px-3 py-2 rounded-xl transition shrink-0 ${
              selectedFilter === "irrigation_machinery"
                ? "bg-stone-900 text-white shadow-xs dark:bg-emerald-800 dark:text-white"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
            }`}
          >
            Solar, Drip & Machinery
          </button>
        </div>
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="group flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all dark:border-stone-800 dark:bg-stone-900 dark:hover:border-emerald-500/80"
          >
            <div>
              {/* Header: Level Badge and Category */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    scheme.level === "state"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                  }`}
                >
                  <span>{scheme.level === "state" ? "🏛️" : "🇮🇳"}</span>
                  <span>{lang === "te" ? scheme.badgeTe : scheme.badgeEn}</span>
                </span>

                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                  {lang === "te" ? scheme.categoryLabelTe : scheme.categoryLabelEn}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3 mb-2.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-950/60 dark:border-emerald-800/60 group-hover:scale-105 transition-transform">
                  {renderSchemeIcon(scheme.iconType)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors dark:text-white dark:group-hover:text-emerald-400 leading-snug">
                    {lang === "te" ? scheme.nameTe : scheme.nameEn}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {lang === "te" ? scheme.nameEn : scheme.nameTe}
                  </p>
                </div>
              </div>

              {/* Financial Benefit Callout Pill */}
              <div className="my-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 p-2.5">
                <span className="block text-[10px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-400 mb-0.5">
                  Financial Benefit / ఆర్థిక సాయం
                </span>
                <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  {lang === "te" ? scheme.financialBenefitTe : scheme.financialBenefitEn}
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 mb-3">
                {lang === "te" ? scheme.summaryTe : scheme.summaryEn}
              </p>

              {/* Key Eligibility Points (First 2) */}
              <div className="space-y-1 mb-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                {(lang === "te" ? scheme.eligibilityTe : scheme.eligibilityEn).slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="mt-2 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveModalScheme(scheme)}
                className="flex-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2 px-3 transition flex items-center justify-center gap-1.5 dark:bg-emerald-700 dark:hover:bg-emerald-800"
              >
                <span>{lang === "te" ? "పూర్తి వివరాలు & దరఖాస్తు" : "View Details & Apply"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition dark:border-stone-800 dark:hover:bg-stone-800 dark:text-stone-300"
                title={`Visit official ${scheme.portalName}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 dark:bg-stone-900 dark:border-stone-800">
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
            No schemes found matching "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
            className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* DETAILED SCHEME MODAL */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 p-6 text-stone-900 dark:text-stone-100"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModalScheme(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3 mb-4 pr-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
                {renderSchemeIcon(activeModalScheme.iconType)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      activeModalScheme.level === "state"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    <span>{activeModalScheme.level === "state" ? "🏛️" : "🇮🇳"}</span>
                    <span>{lang === "te" ? activeModalScheme.badgeTe : activeModalScheme.badgeEn}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {lang === "te" ? activeModalScheme.categoryLabelTe : activeModalScheme.categoryLabelEn}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  {lang === "te" ? activeModalScheme.nameTe : activeModalScheme.nameEn}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === "te" ? activeModalScheme.nameEn : activeModalScheme.nameTe}
                </p>
              </div>
            </div>

            {/* Benefit Box */}
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3.5 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                Financial Benefit & Grant / ఆర్థిక సహాయం
              </span>
              <p className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
                {lang === "te" ? activeModalScheme.financialBenefitTe : activeModalScheme.financialBenefitEn}
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                {lang === "te" ? activeModalScheme.summaryTe : activeModalScheme.summaryEn}
              </p>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-4 text-xs">
              {/* Eligibility */}
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "te" ? "ఎవరు అర్హులు? (Eligibility Criteria)" : "Who is Eligible?"}</span>
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {(lang === "te" ? activeModalScheme.eligibilityTe : activeModalScheme.eligibilityEn).map(
                    (item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Documents Required */}
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "te" ? "కావలసిన పత్రాలు (Required Documents)" : "Documents Checklist"}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === "te" ? activeModalScheme.documentsRequiredTe : activeModalScheme.documentsRequiredEn).map(
                    (doc, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 p-2 flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium"
                      >
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="truncate">{doc}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* How to Apply */}
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "te" ? "దరఖాస్తు విధానం (Step-by-Step How to Apply)" : "How to Apply"}</span>
                </h4>
                <ol className="space-y-2 pl-1">
                  {(lang === "te" ? activeModalScheme.howToApplyTe : activeModalScheme.howToApplyEn).map(
                    (step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    )
                  )}
                </ol>
              </div>

              {/* Support & Helpline */}
              <div className="rounded-xl bg-stone-50 dark:bg-stone-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    Official Helpline: {activeModalScheme.helpline}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500">Free Government Assistance</span>
              </div>
            </div>

            {/* Modal Bottom CTAs */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveModalScheme(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
              >
                Close
              </button>

              <a
                href={activeModalScheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition flex items-center gap-2 shadow-md"
              >
                <span>Visit Official Portal ({activeModalScheme.portalName})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
