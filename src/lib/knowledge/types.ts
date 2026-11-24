/**
 * Agricultural Knowledge Base Domain Types
 * Covers PJTAU Telangana Vyavasayam Publications & Diksoochi Ingestion Standards
 */

import type { DetailedFertilizerReport } from "./fertilizerRegistry";

export type KnowledgeCategory =
  | "crop_production"
  | "varieties_seed"
  | "sowing_planting"
  | "soil_nutrients"
  | "fertilizer_recommendation"
  | "irrigation_water"
  | "insect_pests"
  | "plant_diseases"
  | "weed_management"
  | "biological_ipm"
  | "horticulture"
  | "agri_engineering"
  | "postharvest_management"
  | "seasonal_advisories"
  | "agri_technology";

export type SourcePriority =
  | "cibrc_statutory"
  | "pjtau_magazine_recent"
  | "pjtau_diksoochi_baseline";

export type QualityStatus =
  | "pending_extraction"
  | "needs_manual_review"
  | "verified_agricultural_record"
  | "deprecated_historical";

export interface SourceCitation {
  documentTitle: string;
  publisher: string;
  publicationMonthYear: string;
  filename: string;
  pdfPage: number;
  printedPage: number | string;
  sectionHeader?: string;
  sourcePriority: SourcePriority;
}

export interface IPMGuidance {
  cultural: string[];
  mechanical: string[];
  biological: string[];
}

export interface KnowledgeRecord {
  id: string;
  title: string;
  crop: string; // Paddy, Cotton, Chilli, Maize, Redgram, Groundnut, Soybean, Turmeric, Tomato, General
  category: KnowledgeCategory;
  originalTeluguText: string;
  normalizedTeluguText: string;
  englishText: string;
  keywords: string[];
  citation: SourceCitation;
  qualityStatus: QualityStatus;
  lastReviewDate: string;
  ipm?: IPMGuidance;
  verifiedChemicalId?: string;
  dosageConfidence: "high_verified" | "medium_reviewed" | "flagged_for_audit";
  notes?: string;
}

export interface PesticideLabel {
  id: string;
  activeIngredient: string;
  commonBrands: string[];
  formulation: string; // e.g. "50% SP", "18.5% SC", "75% WP"
  approvedCrops: string[];
  targetPestsOrDiseases: string[];
  dosagePerLiterWater: string;
  dosagePerAcre: string;
  dilutionWaterLitresPerAcre: number;
  waitingPeriodDaysPHI: number;
  safetyPrecautions: {
    en: string;
    te: string;
  };
  registrationStatus: "CIBRC_APPROVED" | "RESTRICTED" | "BANNED" | "PJTAU_STANDARD";
  regulatoryNotes?: string;
}

export interface FertilizerStageSplit {
  stageEn: string;
  stageTe: string;
  timingDays: string;
  dapKg: number;
  ureaKg: number;
  mopKg: number;
  sspKg?: number;
  zincKg?: number;
  notesEn: string;
  notesTe: string;
}

export interface FertilizerCropSchedule {
  crop: string;
  recommendedNutrientsPerAcre: {
    nKg: number;
    pKg: number;
    kKg: number;
    znKg?: number;
  };
  recommendedNutrientsPerHa: {
    nKg: number;
    pKg: number;
    kKg: number;
  };
  splits: FertilizerStageSplit[];
  citation: SourceCitation;
  soilAdjustmentRules: {
    lowNutrientMultiplier: number; // e.g. 1.25 (+25%)
    mediumNutrientMultiplier: number; // 1.0 (standard)
    highNutrientMultiplier: number; // 0.75 (-25%)
  };
}

export interface KnowledgeSearchFilter {
  query?: string;
  crop?: string;
  category?: KnowledgeCategory;
  verifiedOnly?: boolean;
  limit?: number;
}

export interface KnowledgeSearchResult {
  records: KnowledgeRecord[];
  totalMatches: number;
  verifiedChemicals: PesticideLabel[];
  groundedFertilizer?: DetailedFertilizerReport;
  queryExplanation?: string;
}
