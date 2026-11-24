/**
 * Telangana PJTAU Package of Practices Fertilizer Dosage Calculator
 * Grounded in Telangana Vyavasaayam Diksoochi 2019-2020 & Package of Practices.
 */

import {
  computeSourceGroundedFertilizer,
  VERIFIED_FERTILIZER_SCHEDULES,
  DetailedFertilizerReport,
} from "@/lib/knowledge/fertilizerRegistry";

export interface FertParams {
  crop: string;
  area: number;
  unit: "acre" | "guntha" | "ha";
  soilTestStatus?: {
    provided: boolean;
    nitrogenRating?: "Low" | "Medium" | "High";
    phosphorusRating?: "Low" | "Medium" | "High";
    potassiumRating?: "Low" | "Medium" | "High";
  };
  organicManureTonnesApplied?: number;
}

export interface FertResult {
  crop: string;
  areaAcre: number;
  nKgPerHa: number;
  p2o5KgPerHa: number;
  k2oKgPerHa: number;
  nReqKg: number;
  pReqKg: number;
  kReqKg: number;
  dapBags: number;
  dapKgTotal?: number;
  ureaBags: number;
  ureaKgTotal?: number;
  mopBags: number;
  mopKgTotal?: number;
  zincSulphateKgTotal?: number;
  isSoilTestGrounded: boolean;
  stoichiometryExplanation?: string;
  citation?: {
    documentTitle: string;
    publicationMonthYear: string;
    pdfPage: number;
    printedPage: number | string;
    sectionHeader?: string;
  };
  splits: {
    stageEn: string;
    stageTe: string;
    dapKg?: number;
    ureaKg?: number;
    mopKg?: number;
    dapPct: number;
    ureaPct: number;
    mopPct: number;
    zincKg?: number;
    timing?: string;
    notesEn: string;
    notesTe: string;
  }[];
}

export const CROP_NPK_PJTAU: Record<string, { n: number; p: number; k: number; nameEn: string; nameTe: string }> = {
  Paddy: { n: 120, p: 60, k: 40, nameEn: "Paddy (Rice)", nameTe: "వరి (Paddy)" },
  Maize: { n: 180, p: 60, k: 50, nameEn: "Maize (Corn)", nameTe: "మొక్కజొన్న (Maize)" },
  Cotton: { n: 150, p: 60, k: 60, nameEn: "Cotton", nameTe: "పత్తి (Cotton)" },
  Groundnut: { n: 30, p: 40, k: 50, nameEn: "Groundnut", nameTe: "వేరుశెనగ (Groundnut)" },
  Redgram: { n: 20, p: 50, k: 0, nameEn: "Redgram (Pigeonpea)", nameTe: "కంది (Redgram)" },
  Chilli: { n: 150, p: 60, k: 60, nameEn: "Chilli", nameTe: "మిరప (Chilli)" },
  Soybean: { n: 20, p: 60, k: 40, nameEn: "Soybean", nameTe: "సోయాచిక్కుడు (Soybean)" },
  Sesame: { n: 60, p: 40, k: 30, nameEn: "Sesame", nameTe: "నువ్వులు (Sesame)" },
};

export function calculateFertilizer(p: FertParams): FertResult {
  const report: DetailedFertilizerReport = computeSourceGroundedFertilizer({
    crop: p.crop,
    area: p.area,
    unit: p.unit,
    soilTestStatus: p.soilTestStatus,
    organicManureTonnesApplied: p.organicManureTonnesApplied,
  });

  const cropSchedule = VERIFIED_FERTILIZER_SCHEDULES[p.crop] || VERIFIED_FERTILIZER_SCHEDULES.Paddy;

  const splits = report.stageSplits.map((s, idx) => ({
    stageEn: s.stageEn,
    stageTe: s.stageTe,
    dapKg: s.dapKg,
    ureaKg: s.ureaKg,
    mopKg: s.mopKg,
    dapPct: s.dapKg > 0 ? 100 : 0,
    ureaPct: idx === 0 ? 33 : idx === 1 ? 33 : 34,
    mopPct: s.mopKg > 0 ? 50 : 0,
    zincKg: s.zincKg,
    timing: s.timing,
    notesEn: s.notesEn,
    notesTe: s.notesTe,
  }));

  return {
    crop: report.crop,
    areaAcre: report.areaAcre,
    nKgPerHa: cropSchedule.recommendedNutrientsPerHa.nKg,
    p2o5KgPerHa: cropSchedule.recommendedNutrientsPerHa.pKg,
    k2oKgPerHa: cropSchedule.recommendedNutrientsPerHa.kKg,
    nReqKg: Math.round(report.adjustedNutrientRequirementKg.n),
    pReqKg: Math.round(report.adjustedNutrientRequirementKg.p),
    kReqKg: Math.round(report.adjustedNutrientRequirementKg.k),
    dapBags: report.commercialProducts.dapBags50kg,
    dapKgTotal: report.commercialProducts.dapKgTotal,
    ureaBags: report.commercialProducts.ureaBags45kg,
    ureaKgTotal: report.commercialProducts.ureaKgTotal,
    mopBags: report.commercialProducts.mopBags50kg,
    mopKgTotal: report.commercialProducts.mopKgTotal,
    zincSulphateKgTotal: report.commercialProducts.zincSulphateKgTotal,
    isSoilTestGrounded: report.isSoilTestGrounded,
    stoichiometryExplanation: report.stoichiometryExplanation,
    citation: {
      documentTitle: report.citation.documentTitle,
      publicationMonthYear: report.citation.publicationMonthYear,
      pdfPage: report.citation.pdfPage,
      printedPage: report.citation.printedPage,
      sectionHeader: report.citation.sectionHeader,
    },
    splits,
  };
}
