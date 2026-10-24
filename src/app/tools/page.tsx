"use client";

import React, { useState } from "react";
import {
  Wrench,
  Calculator,
  Sprout,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Sparkles,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  calculateSeedRate,
  CROP_CONFIGS,
  SeedCalcResult,
} from "@/lib/calculators/seedCalc";
import {
  calculateFertilizer,
  CROP_NPK_PJTAU,
  FertResult,
} from "@/lib/calculators/fertCalc";
import {
  formatFertilizerMessage,
  generateWhatsAppUrl,
  copyToClipboard,
} from "@/lib/utils/kisanShare";

export default function ToolsPage() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"seed" | "fert">("seed");
  const [copiedFert, setCopiedFert] = useState(false);

  // --- Seed Calculator State ---
  const [seedCrop, setSeedCrop] = useState("Maize");
  const [seedMethod, setSeedMethod] = useState("line");
  const [seedArea, setSeedArea] = useState(1);
  const [seedUnit, setSeedUnit] = useState<"acre" | "guntha" | "ha">("acre");
  const [seedRowCm, setSeedRowCm] = useState(60);
  const [seedPlantCm, setSeedPlantCm] = useState(20);
  const [seedSeedsHill, setSeedSeedsHill] = useState(1);
  const [seedWeightBasis, setSeedWeightBasis] = useState<100 | 1000>(100);
  const [seedTestWeightG, setSeedTestWeightG] = useState(25);
  const [seedGermPct, setSeedGermPct] = useState(90);
  const [seedPurityPct, setSeedPurityPct] = useState(98);
  const [seedExtraPct, setSeedExtraPct] = useState(0);
  const [seedForm, setSeedForm] = useState<"kernels" | "pods">("kernels");
  const [seedShellingPct, setSeedShellingPct] = useState(70);
  const [seedPacketSize, setSeedPacketSize] = useState(1);
  const [isWorkingExpanded, setIsWorkingExpanded] = useState(false);
  const [seedResult, setSeedResult] = useState<SeedCalcResult | null>(null);

  // When crop changes, update default parameters
  const handleCropChange = (crop: string) => {
    setSeedCrop(crop);
    const cfg = CROP_CONFIGS[crop];
    if (cfg) {
      setSeedMethod(cfg.defaultMethod || "line");
      const sp = cfg.spacings[cfg.defaultMethod || "line"] || { row: 60, plant: 20, seeds: 1 };
      setSeedRowCm(sp.row);
      setSeedPlantCm(sp.plant);
      setSeedSeedsHill(sp.seeds || 1);
      setSeedWeightBasis(cfg.defaultWeightBasis);
      setSeedTestWeightG(cfg.defaultWeightBasis === 100 ? cfg.testWeightG / 10 : cfg.testWeightG);
      setSeedGermPct(cfg.germinationPct);
      setSeedPurityPct(cfg.purityPct);
      setSeedExtraPct(cfg.extraPct);
      setSeedForm(cfg.defaultSeedForm || "kernels");
    }
  };

  const runSeedCalculation = () => {
    const res = calculateSeedRate({
      crop: seedCrop,
      sowingMethod: seedMethod,
      area: seedArea,
      unit: seedUnit,
      rowSpacingCm: seedRowCm,
      plantSpacingCm: seedPlantCm,
      seedsPerHill: seedSeedsHill,
      weightBasis: seedWeightBasis,
      testWeightG: seedTestWeightG,
      germinationPct: seedGermPct,
      purityPct: seedPurityPct,
      extraPct: seedExtraPct,
      seedForm,
      shellingPct: seedShellingPct,
      packetSizeKg: seedPacketSize,
    });
    setSeedResult(res);
  };

  // --- Fertilizer Calculator State ---
  const [fertCrop, setFertCrop] = useState("Paddy");
  const [fertArea, setFertArea] = useState(1);
  const [fertUnit, setFertUnit] = useState<"acre" | "guntha" | "ha">("acre");
  const [fertResult, setFertResult] = useState<FertResult | null>(null);

  const runFertCalculation = () => {
    const res = calculateFertilizer({
      crop: fertCrop,
      area: fertArea,
      unit: fertUnit,
    });
    setFertResult(res);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
          {t("tools_title")}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          {t("tools_subtitle")}
        </p>
      </div>

      {/* 2. Tool Navigation Switcher Pills */}
      <div className="flex gap-2 border-b border-stone-200 pb-3 dark:border-stone-800">
        <button
          onClick={() => setActiveTab("seed")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === "seed"
              ? "bg-agri-700 text-white shadow-xs"
              : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
          }`}
        >
          <Sprout className="h-4 w-4" />
          <span>{t("tools_tab_seed")}</span>
        </button>

        <button
          onClick={() => setActiveTab("fert")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === "fert"
              ? "bg-agri-700 text-white shadow-xs"
              : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{t("tools_tab_fert")}</span>
        </button>
      </div>

      {/* Indicative Note Alert */}
      <div className="rounded-xl border border-agri-200 bg-agri-50/70 p-3 text-xs text-agri-900 dark:border-agri-900/50 dark:bg-agri-950/20 dark:text-agri-200 flex items-start gap-2">
        <HelpCircle className="h-4 w-4 text-agri-700 dark:text-agri-400 shrink-0 mt-0.5" />
        <span>{t("tools_indicative_note")}</span>
      </div>

      {/* --- TAB 1: SEED RATE CALCULATOR --- */}
      {activeTab === "seed" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form Inputs (2 Cols) */}
          <Card className="lg:col-span-2">
            <CardHeader
              title={t("tools_tab_seed")}
              subtitle="Calculates required seed weight, packet count, and population"
              icon={<Sprout className="h-5 w-5 text-agri-600" />}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("seed_crop_label")}
                </label>
                <select
                  value={seedCrop}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                >
                  {Object.keys(CROP_CONFIGS).map((k) => (
                    <option key={k} value={k}>
                      {lang === "te" ? CROP_CONFIGS[k].nameTe : CROP_CONFIGS[k].nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sowing Method */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("seed_method_label")}
                </label>
                <select
                  value={seedMethod}
                  onChange={(e) => setSeedMethod(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                >
                  <option value="line">Line Sowing / Dibbling (సాలు పద్ధతి)</option>
                  <option value="transplant">Transplanting (నాటు పద్ధతి)</option>
                  <option value="broadcast">Broadcasting (వెదజల్లే పద్ధతి)</option>
                </select>
              </div>

              {/* Area & Unit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("seed_area_label")}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={seedArea}
                    onChange={(e) => setSeedArea(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("seed_unit_label")}
                  </label>
                  <select
                    value={seedUnit}
                    onChange={(e) => setSeedUnit(e.target.value as any)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                  >
                    <option value="acre">Acres (ఎకరాలు)</option>
                    <option value="guntha">Gunthas (గుంటలు)</option>
                    <option value="ha">Hectares (హెక్టార్లు)</option>
                  </select>
                </div>
              </div>

              {/* Spacing (Row x Plant) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("seed_spacing_row")}
                  </label>
                  <input
                    type="number"
                    value={seedRowCm}
                    onChange={(e) => setSeedRowCm(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t("seed_spacing_plant")}
                  </label>
                  <input
                    type="number"
                    value={seedPlantCm}
                    onChange={(e) => setSeedPlantCm(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Weight Basis & Test Weight */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("seed_weight_basis")}
                </label>
                <select
                  value={seedWeightBasis}
                  onChange={(e) => setSeedWeightBasis(parseInt(e.target.value, 10) as any)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                >
                  <option value={100}>100-seed weight (Bold Seeds / 100 గింజల బరువు)</option>
                  <option value={1000}>1000-seed weight (Standard / 1000 గింజల బరువు)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t("seed_weight_val")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={seedTestWeightG}
                  onChange={(e) => setSeedTestWeightG(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Groundnut specific Pods vs Kernels */}
              {seedCrop === "Groundnut" && (
                <div className="sm:col-span-2 grid grid-cols-2 gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-900/40">
                  <div>
                    <label className="block text-xs font-semibold text-amber-950 dark:text-amber-200 mb-1">
                      {t("seed_groundnut_form")}
                    </label>
                    <select
                      value={seedForm}
                      onChange={(e) => setSeedForm(e.target.value as any)}
                      className="w-full rounded-xl border border-amber-300 bg-white p-2.5 text-xs font-medium text-stone-900 dark:border-amber-800 dark:bg-stone-900 dark:text-stone-100"
                    >
                      <option value="kernels">{t("seed_form_kernels")}</option>
                      <option value="pods">{t("seed_form_pods")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-950 dark:text-amber-200 mb-1">
                      {t("seed_shelling_pct")}
                    </label>
                    <input
                      type="number"
                      value={seedShellingPct}
                      onChange={(e) => setSeedShellingPct(parseFloat(e.target.value) || 70)}
                      className="w-full rounded-xl border border-amber-300 bg-white p-2.5 text-xs font-medium text-stone-900 dark:border-amber-800 dark:bg-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              )}

              {/* Quality & Extra factors */}
              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {t("seed_germ_pct")}
                  </label>
                  <input
                    type="number"
                    value={seedGermPct}
                    onChange={(e) => setSeedGermPct(parseFloat(e.target.value) || 85)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-medium dark:border-stone-800 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {t("seed_purity_pct")}
                  </label>
                  <input
                    type="number"
                    value={seedPurityPct}
                    onChange={(e) => setSeedPurityPct(parseFloat(e.target.value) || 98)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-medium dark:border-stone-800 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    {t("seed_extra_pct")}
                  </label>
                  <input
                    type="number"
                    value={seedExtraPct}
                    onChange={(e) => setSeedExtraPct(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-medium dark:border-stone-800 dark:bg-stone-900"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={runSeedCalculation}
              className="mt-6 w-full rounded-xl bg-agri-700 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-agri-800 active:scale-95"
            >
              {t("seed_calc_btn")}
            </button>
          </Card>

          {/* Results Summary Box (1 Col) */}
          <div className="space-y-4">
            <Card className="border-agri-300 dark:border-agri-800 bg-agri-50/30 dark:bg-agri-950/20">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center justify-between">
                <span>🌾 Calculated Seed Requirement</span>
                <Badge variant="normal">PJTAU Aligned</Badge>
              </h3>

              {seedResult ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-white p-3.5 shadow-2xs dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                    <span className="text-xs text-stone-500">For Entered Area ({seedArea} {seedUnit})</span>
                    <p className="text-2xl font-black text-agri-800 dark:text-agri-300">
                      {seedResult.displayRateKgEntered.toFixed(2)} kg
                    </p>
                    {seedResult.isSmallSeeded && (
                      <span className="text-[11px] text-stone-500">
                        ({seedResult.seedRateGramsEntered.toLocaleString()} grams)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                      <span className="text-stone-500">Per Acre Rate</span>
                      <p className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                        {seedResult.seedRateKgPerAcre.toFixed(2)} kg/ac
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                      <span className="text-stone-500">Plants / Acre</span>
                      <p className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                        {seedResult.plantsPerAcre.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {seedCrop === "Groundnut" && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                      <b>🥜 Groundnut Breakdown:</b>
                      <p className="mt-0.5">Kernels: {seedResult.seedRateKgEntered.toFixed(1)} kg</p>
                      <p>Pods (@ {seedShellingPct}%): {seedResult.podsRateKgEntered?.toFixed(1)} kg</p>
                    </div>
                  )}

                  <div className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900 text-xs flex justify-between items-center">
                    <span className="text-stone-500">1 kg Seed Packets</span>
                    <b className="text-agri-700 dark:text-agri-400">
                      {seedResult.packetsNeeded} packets
                    </b>
                  </div>

                  {/* Toggle Show Working Drawer */}
                  <button
                    onClick={() => setIsWorkingExpanded(!isWorkingExpanded)}
                    className="w-full text-center text-xs font-semibold text-agri-700 hover:text-agri-800 dark:text-agri-400 py-1"
                  >
                    {isWorkingExpanded ? t("seed_working_hide") : t("seed_working_btn")}
                  </button>

                  {isWorkingExpanded && (
                    <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs max-h-60 overflow-y-auto">
                      {seedResult.steps.map((s) => (
                        <div key={s.step} className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                          <p className="font-bold text-stone-900 dark:text-stone-100">
                            {lang === "te" ? s.titleTe : s.titleEn}
                          </p>
                          <p className="mt-1 whitespace-pre-line text-[11px] text-stone-600 dark:text-stone-400 font-mono">
                            {lang === "te" ? s.textTe : s.textEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-stone-500">
                  Select your crop and click "Calculate Seed Requirement" to see kg requirements and step-by-step math.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* --- TAB 2: FERTILIZER DOSAGE CALCULATOR --- */}
      {activeTab === "fert" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title={t("tools_tab_fert")}
              subtitle="Calculates required Urea, DAP, MOP bags and split schedule"
              icon={<Layers className="h-5 w-5 text-agri-600" />}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Select Crop
                </label>
                <select
                  value={fertCrop}
                  onChange={(e) => setFertCrop(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                >
                  {Object.keys(CROP_NPK_PJTAU).map((k) => (
                    <option key={k} value={k}>
                      {lang === "te" ? CROP_NPK_PJTAU[k].nameTe : CROP_NPK_PJTAU[k].nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Land Area
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={fertArea}
                    onChange={(e) => setFertArea(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={fertUnit}
                    onChange={(e) => setFertUnit(e.target.value as any)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                  >
                    <option value="acre">Acres (ఎకరాలు)</option>
                    <option value="guntha">Gunthas (గుంటలు)</option>
                    <option value="ha">Hectares (హెక్టార్లు)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={runFertCalculation}
              className="mt-6 w-full rounded-xl bg-agri-700 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-agri-800 active:scale-95"
            >
              Calculate Fertilizer Bags
            </button>
          </Card>

          {/* Fertilizer Results Summary */}
          <div>
            <Card className="border-agri-300 dark:border-agri-800 bg-agri-50/30 dark:bg-agri-950/20">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center justify-between">
                <span>🧪 Fertilizer Requirement</span>
                <Badge variant="normal">PJTAU PoP</Badge>
              </h3>

              {fertResult ? (
                <div className="space-y-3 text-xs">
                  <div className="rounded-xl bg-white p-3.5 shadow-2xs dark:bg-stone-900">
                    <span className="text-stone-500">Pure Nutrients Required</span>
                    <p className="font-bold text-stone-900 dark:text-stone-100 mt-1">
                      N: {fertResult.nReqKg} kg • P₂O₅: {fertResult.pReqKg} kg • K₂O: {fertResult.kReqKg} kg
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                      <div>
                        <span className="block font-semibold">DAP (50 kg bags)</span>
                        <span className="text-[10px] text-stone-400">@ ₹1,350/bag MRP</span>
                      </div>
                      <b className="text-agri-700 dark:text-agri-400 font-bold text-sm">
                        {fertResult.dapBags} bags
                      </b>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                      <div>
                        <span className="block font-semibold">Urea (45 kg bags)</span>
                        <span className="text-[10px] text-stone-400">@ ₹266.50/bag MRP</span>
                      </div>
                      <b className="text-agri-700 dark:text-agri-400 font-bold text-sm">
                        {fertResult.ureaBags} bags
                      </b>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                      <div>
                        <span className="block font-semibold">MOP (50 kg bags)</span>
                        <span className="text-[10px] text-stone-400">@ ₹1,700/bag MRP</span>
                      </div>
                      <b className="text-agri-700 dark:text-agri-400 font-bold text-sm">
                        {fertResult.mopBags} bags
                      </b>
                    </div>
                  </div>

                  {/* Phase 2: Estimated Input Cost Card */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs dark:border-amber-900/40 dark:bg-amber-950/20 space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                      <span>{t("fert_cost_title")}</span>
                      <span className="text-sm font-extrabold text-stone-900 dark:text-stone-50">
                        ₹{(
                          fertResult.ureaBags * 266.5 +
                          fertResult.dapBags * 1350 +
                          fertResult.mopBags * 1700
                        ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-800/80 dark:text-amber-300">
                      Estimated fertilizer procurement budget for {fertArea} {fertUnit} of {fertCrop}.
                    </p>
                  </div>

                  {/* WhatsApp & SMS Sharing Action Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={generateWhatsAppUrl(
                        formatFertilizerMessage(
                          {
                            crop: fertCrop,
                            cropTe: CROP_NPK_PJTAU[fertCrop]?.nameTe,
                            area: fertArea,
                            unit: fertUnit,
                            ureaBags: fertResult.ureaBags,
                            dapBags: fertResult.dapBags,
                            mopBags: fertResult.mopBags,
                            estCost:
                              fertResult.ureaBags * 266.5 +
                              fertResult.dapBags * 1350 +
                              fertResult.mopBags * 1700,
                            splits: fertResult.splits,
                          },
                          lang
                        )
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>WhatsApp Share</span>
                    </a>

                    <button
                      onClick={async () => {
                        const txt = formatFertilizerMessage(
                          {
                            crop: fertCrop,
                            cropTe: CROP_NPK_PJTAU[fertCrop]?.nameTe,
                            area: fertArea,
                            unit: fertUnit,
                            ureaBags: fertResult.ureaBags,
                            dapBags: fertResult.dapBags,
                            mopBags: fertResult.mopBags,
                            estCost:
                              fertResult.ureaBags * 266.5 +
                              fertResult.dapBags * 1350 +
                              fertResult.mopBags * 1700,
                            splits: fertResult.splits,
                          },
                          lang
                        );
                        const ok = await copyToClipboard(txt);
                        if (ok) {
                          setCopiedFert(true);
                          setTimeout(() => setCopiedFert(false), 2000);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 transition"
                    >
                      {copiedFert ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedFert ? "Copied SMS!" : "Copy SMS"}</span>
                    </button>
                  </div>

                  {/* Print / Save Advisory Slip */}
                  <button
                    onClick={() => window.print()}
                    className="w-full rounded-xl border border-stone-300 bg-white py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                  >
                    📄 {t("fert_print_btn")}
                  </button>

                  {/* Split stages */}
                  <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <b className="text-stone-800 dark:text-stone-200">Recommended Split Schedule:</b>
                    {fertResult.splits.map((sp, idx) => (
                      <div key={idx} className="rounded-lg bg-white p-2.5 shadow-2xs dark:bg-stone-900">
                        <p className="font-bold text-stone-900 dark:text-stone-100">
                          {lang === "te" ? sp.stageTe : sp.stageEn}
                        </p>
                        <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                          {lang === "te" ? sp.notesTe : sp.notesEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-stone-500">
                  Select your crop and field size, then click "Calculate Fertilizer Bags" to see bag requirements and split stages.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
