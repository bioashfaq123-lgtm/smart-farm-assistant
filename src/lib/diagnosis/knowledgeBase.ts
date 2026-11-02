import fs from "fs";
import path from "path";

export interface KnowledgeBaseMetadata {
  version: string;
  region: string;
  institutions: string[];
  reviewStatus: string;
  disclaimer: string;
}

export interface DisorderRecord {
  id: string;
  commonName: string;
  nameTe: string;
  scientificName: string;
  type: "fungal" | "bacterial" | "viral" | "insect" | "nutrient" | "abiotic" | "other";
  status: string; // e.g. "draft - needs expert review"
  source: string;
  symptoms: string;
  fieldCheck: string;
  differential: string;
  favourableConditions?: {
    tempRangeC?: number[];
    relativeHumidityMin?: number;
    weatherFactors?: string;
  };
  management: {
    cultural: string[];
    biological: string[];
    chemicalClass: string[];
    regulatoryDisclaimer: string;
  };
}

export interface CropRecord {
  cropNameEn: string;
  cropNameTe: string;
  scientificName: string;
  disorders: DisorderRecord[];
}

export interface KnowledgeBaseData {
  metadata: KnowledgeBaseMetadata;
  crops: Record<string, CropRecord>;
}

let cachedKb: KnowledgeBaseData | null = null;

/**
 * Loads authoritative Telangana Crop Knowledge Base from disk
 */
export function loadKnowledgeBase(): KnowledgeBaseData {
  if (cachedKb) return cachedKb;
  try {
    const p = path.join(process.cwd(), "data", "diseases.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      cachedKb = JSON.parse(raw);
      return cachedKb!;
    }
  } catch (err: any) {
    console.warn("Could not read data/diseases.json from process.cwd:", err.message);
  }

  try {
    const p = path.resolve(__dirname, "../../../data/diseases.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      cachedKb = JSON.parse(raw);
      return cachedKb!;
    }
  } catch (err: any) {
    console.error("Critical: Failed to load data/diseases.json:", err.message);
  }

  return {
    metadata: {
      version: "1.0.0",
      region: "Telangana, India",
      institutions: ["PJTAU"],
      reviewStatus: "draft - needs expert review",
      disclaimer: "Indicative university package of practices.",
    },
    crops: {},
  };
}

/**
 * Returns list of validated crop keys supported by the system
 */
export function getSupportedCrops(): string[] {
  const kb = loadKnowledgeBase();
  return Object.keys(kb.crops || {});
}

/**
 * Returns disorders catalog for a given crop (case-insensitive)
 */
export function getCropDisorders(crop: string): DisorderRecord[] {
  const kb = loadKnowledgeBase();
  if (!crop) return [];
  const normalized = Object.keys(kb.crops || {}).find(
    (k) => k.toLowerCase() === String(crop).trim().toLowerCase()
  );
  if (!normalized || !kb.crops[normalized]) return [];
  return kb.crops[normalized].disorders || [];
}

/**
 * Finds exact or closest disorder match in knowledge base
 */
export function findDisorder(crop: string, queryIdOrName: string): DisorderRecord | null {
  if (!queryIdOrName || !queryIdOrName.trim()) return null;
  const disorders = getCropDisorders(crop);
  const target = String(queryIdOrName).toLowerCase().trim();

  // 1. Direct ID match
  let match = disorders.find((d) => d.id.toLowerCase() === target);
  if (match) return match;

  // 2. Direct common name match
  match = disorders.find(
    (d) => d.commonName.toLowerCase() === target || d.commonName.toLowerCase().includes(target)
  );
  if (match) return match;

  // 3. Telugu name match
  match = disorders.find((d) => d.nameTe && d.nameTe.toLowerCase().includes(target));
  if (match) return match;

  // 4. Scientific name match
  match = disorders.find(
    (d) => d.scientificName && d.scientificName.toLowerCase().includes(target)
  );
  if (match) return match;

  return null;
}

/**
 * Enriches a raw candidate from the AI vision adapter with grounded management
 * and verification metadata from the authoritative knowledge base.
 */
export function enrichCandidateWithKb(crop: string, candidate: any) {
  const disorder = findDisorder(crop, candidate.id || candidate.commonName || candidate.scientificName);

  if (!disorder) {
    // Unlisted or unverified condition
    return {
      id: candidate.id || "unlisted_condition",
      commonName: candidate.commonName || "Unknown Condition",
      nameTe: candidate.nameTe || candidate.commonName || "గుర్తించబడని సమస్య",
      scientificName: candidate.scientificName || "N/A — Pathogen unidentified",
      type: candidate.type || "other",
      confidenceLevel: candidate.confidenceLevel || "Needs further verification",
      symptomsSeen: candidate.symptomsSeen || "Visual symptoms observed on foliage.",
      unconfirmedSymptoms: candidate.unconfirmedSymptoms || "Microscopic or laboratory confirmation unavailable.",
      differentialClues: candidate.differentialClues || "Observe progression on newly emerging leaves.",
      fieldCheck: candidate.fieldCheck || "Examine affected plant area and consult your local Mandal Agricultural Extension Officer (AEO).",
      isFromKb: false,
      verificationStatus: "Unverified (Draft / External Condition — Pending Extension Review)",
      source: "https://pjtau.edu.in",
      management: {
        cultural: ["Isolate or carefully prune severely damaged plant parts. Maintain proper field drainage."],
        biological: ["Avoid unconfirmed spray treatments until verified by an extension officer."],
        chemicalClass: ["No verified chemical class available for unverified condition."],
        chemicalNoticeEn: "No verified chemical prescription available. Chemical sprays must NEVER be applied without confirmed diagnosis from your Mandal Agricultural Extension Officer (AEO).",
        chemicalNoticeTe: "ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు. మండల వ్యవసాయ అధికారి (AEO) సూచించిన తర్వాతే మందులు వాడండి.",
        safetyDisclaimer: "Agricultural Safety Gate: Unverified records never issue chemical prescriptions. Always consult your Mandal Agricultural Extension Officer (AEO).",
      },
    };
  }

  // Grounded in PJTAU Knowledge Base
  const isExpertReviewed = disorder.status.toLowerCase().includes("verified") || disorder.status.toLowerCase().includes("approved");
  const chemClass = disorder.management?.chemicalClass?.[0];

  const chemNoticeEn = chemClass
    ? `Indicative Chemical Group: ${chemClass}. Must be confirmed by your Mandal AEO and verified against Central Insecticides Board & Registration Committee (CIB&RC) container label before purchase.`
    : "No chemical prescription issued. Confirm treatment with your local Mandal Agricultural Extension Officer (AEO).";

  const chemNoticeTe = chemClass
    ? `సూచిక రసాయన తరగతి: ${chemClass}. పిచికారీ చేసే ముందు గ్రామ AEO ని సంప్రదించి CIB&RC లేబుల్ సిఫారసులను నిర్ధారించుకోండి.`
    : "ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు. స్థానిక మండల వ్యవసాయ విస్తరణ అధికారి (AEO) సూచనల మేరకే మందులు వాడండి.";

  return {
    id: disorder.id,
    commonName: disorder.commonName,
    nameTe: disorder.nameTe,
    scientificName: disorder.scientificName,
    type: disorder.type,
    confidenceLevel: candidate.confidenceLevel || "Possible diagnosis",
    symptomsSeen: candidate.symptomsSeen || disorder.symptoms,
    unconfirmedSymptoms: candidate.unconfirmedSymptoms || "Check panicle neck, stem collar, and root system for secondary spread.",
    differentialClues: candidate.differentialClues || disorder.differential,
    fieldCheck: candidate.fieldCheck || disorder.fieldCheck,
    isFromKb: true,
    verificationStatus: isExpertReviewed
      ? "Verified (University Extension Standard)"
      : "Draft Knowledge Base (Indicative Package of Practices — Pending Field Review)",
    source: disorder.source || "https://pjtau.edu.in",
    favourableConditions: disorder.favourableConditions?.weatherFactors,
    management: {
      cultural: disorder.management?.cultural || ["Adopt balanced crop nutrition and proper field spacing."],
      biological: disorder.management?.biological || ["Apply recommended bio-control agents (e.g. Pseudomonas fluorescens)."],
      chemicalClass: disorder.management?.chemicalClass || [],
      chemicalNoticeEn: chemNoticeEn,
      chemicalNoticeTe: chemNoticeTe,
      safetyDisclaimer: (disorder.management?.regulatoryDisclaimer || "Use only CIB&RC approved crop protection products in India. Strictly adhere to package label instructions and wear protective gear.") + " Always verify critical diagnosis with your local Agriculture Extension Officer (AEO).",
    },
  };
}
