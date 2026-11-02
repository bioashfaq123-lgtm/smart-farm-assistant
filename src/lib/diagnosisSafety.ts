import { runDiagnosisPipeline } from "./diagnosis/pipeline.ts";
import fs from "fs";
import path from "path";
import {
  validateImagePayload,
  extractImageBuffer,
  type ImageValidationResult,
  type ValidationConfig,
} from "./imageValidation.ts";

export interface DiagnosisRequest {
  image?: string; // base64 data URI or raw base64
  symptoms?: string; // farmer's text description of symptoms
  crop?: string; // e.g. "Paddy", "Cotton", "Chilli", etc.
  district?: string;
  lang?: "en" | "te";
}

export interface StructuredDiagnosis {
  status: "possible_diagnosis" | "inconclusive";
  id: string;
  diseaseNameEn: string;
  diseaseNameTe: string;
  scientificName: string;
  crop: string;
  confidenceLevel: "Possible diagnosis" | "Needs further verification" | "Unable to determine";
  severity: "low" | "medium" | "high";
  verificationStatus: string;
  symptomsEn: string;
  symptomsTe: string;
  chemicalSprayEn: string;
  chemicalSprayTe: string;
  dosage: string;
  isChemicalVerified: boolean;
  organicControlEn: string;
  organicControlTe: string;
  preventiveMeasuresEn: string;
  preventiveMeasuresTe: string;
  suggestedActionsEn?: string[];
  suggestedActionsTe?: string[];
  safetyDisclaimer: string;
  favourableConditions?: string;
  metadata?: any;
}

export interface DiagnosisApiResponse {
  success: boolean;
  status: "possible_diagnosis" | "inconclusive" | "symptom_match" | "validation_failed";
  source: string;
  isAiGenerated: boolean;
  diagnosis: StructuredDiagnosis;
  error?: string;
  errorKey?: string;
  guidance?: string;
}

export interface ExecuteDiagnosisResult {
  status: number;
  body: any;
}

// Load authoritative diseases knowledge base
let cachedKb: any = null;
export function getDiseasesDb() {
  if (cachedKb) return cachedKb;
  try {
    const filePath = path.join(process.cwd(), "data", "diseases.json");
    if (fs.existsSync(filePath)) {
      cachedKb = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return cachedKb;
    }
  } catch (e) {
    console.warn("Could not read diseases.json from cwd:", e);
  }
  return { crops: {} };
}

export function getSupportedCrops(): string[] {
  const db = getDiseasesDb();
  return Object.keys(db.crops || {});
}

const AGRI_STOP_WORDS = new Set([
  "leaf", "leaves", "plant", "plants", "crop", "crops",
  "field", "farm", "problem", "issue", "disease", "disorder",
  "some", "vague", "have", "seen", "very", "yellow", "brown", "spots", "spot", "green"
]);

// Local Expert Rule Matching Engine
// SAFETY RULE: Returns null if no strong positive match. NEVER defaults to disorders[0].
export function matchLocalDisorder(cropName: string, queryText: string) {
  if (!queryText || !queryText.trim()) return null;

  const db = getDiseasesDb();
  const normalizedCrop = String(cropName || "Paddy").toLowerCase();
  
  // Find matching crop key
  const cropKey = Object.keys(db.crops || {}).find(
    (k) => k.toLowerCase() === normalizedCrop || normalizedCrop.includes(k.toLowerCase())
  );
  if (!cropKey || !db.crops[cropKey]) return null;

  const disorders = db.crops[cropKey]?.disorders || [];
  if (!disorders.length) return null;

  const cleanQuery = queryText.toLowerCase().trim();
  if (cleanQuery.length < 3) return null;

  let bestScore = 0;
  let bestDisorder: any = null;

  for (const d of disorders) {
    let score = 0;
    const nameEn = (d.commonName || "").toLowerCase();
    const nameTe = (d.nameTe || "").toLowerCase();
    const scientific = (d.scientificName || "").toLowerCase();
    const symptoms = (d.symptoms || "").toLowerCase();
    const differential = (d.differential || "").toLowerCase();

    // Check specific terms, skipping generic non-diagnostic stop words
    const checkTerms = cleanQuery.split(/[\s,.;]+/);
    for (const term of checkTerms) {
      if (term.length < 3 || AGRI_STOP_WORDS.has(term)) continue;
      if (nameEn.includes(term)) score += 10;
      if (nameTe.includes(term)) score += 10;
      if (scientific.includes(term)) score += 12;
      if (symptoms.includes(term)) score += 4;
      if (differential.includes(term)) score += 3;
    }

    // Specific symptom boosts
    if (cleanQuery.includes("spindle") && (nameEn.includes("blast") || d.id.includes("blast"))) score += 15;
    if (cleanQuery.includes("neck") && (nameEn.includes("blast") || d.id.includes("blast"))) score += 15;
    if (cleanQuery.includes("ooze") && (nameEn.includes("bacterial") || d.id.includes("blb"))) score += 15;
    if (cleanQuery.includes("dead heart") && (nameEn.includes("borer") || d.id.includes("stem_borer"))) score += 15;
    if (cleanQuery.includes("hopper") && (nameEn.includes("hopper") || d.id.includes("bph"))) score += 15;
    if (cleanQuery.includes("sheath") && (nameEn.includes("sheath") || d.id.includes("sheath"))) score += 15;
    if (cleanQuery.includes("pink") && (nameEn.includes("bollworm") || d.id.includes("bollworm"))) score += 15;
    if (cleanQuery.includes("curl") && (nameEn.includes("curl") || d.id.includes("curl"))) score += 15;
    if (cleanQuery.includes("rust") || cleanQuery.includes("khaira") || cleanQuery.includes("zinc")) {
      if (d.id.includes("zinc")) score += 15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestDisorder = d;
    }
  }

  // Only return if evidence score is strictly positive and meets confidence threshold
  return bestScore >= 12 ? bestDisorder : null;
}

// Generate structured inconclusive response (never fabricates a disease)
export function createInconclusiveDiagnosis(
  crop: string,
  district: string = "Jagtial",
  lang: "en" | "te" = "en",
  reasonEn?: string,
  reasonTe?: string,
  extraMetadata?: any
): DiagnosisApiResponse {
  return {
    success: true,
    status: "inconclusive",
    source: "Smart Farm Decision-Support Safety Gate",
    isAiGenerated: false,
    diagnosis: {
      status: "inconclusive",
      id: "inconclusive_case",
      diseaseNameEn: "Diagnosis Inconclusive / Further Verification Required",
      diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది / క్షేత్రస్థాయి పరిశీలన అవసరం",
      scientificName: "N/A — Insufficient diagnostic certainty",
      crop,
      confidenceLevel: "Unable to determine",
      severity: "medium",
      verificationStatus: "Inconclusive (No unverified disease assigned)",
      symptomsEn: reasonEn || "Visual evidence is ambiguous, low-contrast, or insufficient to distinguish between overlapping foliar conditions without on-site field testing.",
      symptomsTe: reasonTe || "అందించిన ఫోటో లేదా లక్షణాలు ఖచ్చితమైన నిర్ధారణకు సరిపోలేదు. తప్పుడు మందులు వాడకుండా ఉండేందుకు స్థానిక వ్యవసాయ అధికారి పరిశీలన అవసరం.",
      chemicalSprayEn: "No chemical prescription issued. Chemical sprays must NEVER be applied without confirmed diagnosis from your Mandal Agricultural Extension Officer (AEO).",
      chemicalSprayTe: "ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు. మండల వ్యవసాయ విస్తరణ అధికారి (AEO) ద్వారా నిర్ధారించబడకుండా రసాయన మందులు వాడవద్దు.",
      dosage: "Do not apply chemical pesticides without confirmed diagnosis",
      isChemicalVerified: false,
      organicControlEn: "Inspect plants daily in the morning. Isolate or carefully prune severely damaged leaves if infection is localized. Ensure field drainage.",
      organicControlTe: "ప్రతిరోజూ ఉదయం మొక్కలను గమనించండి. సమస్య ఉన్న ఆకులను వేరు చేయండి. పొలంలో నీరు నిల్వ ఉండకుండా చూడండి.",
      preventiveMeasuresEn: "Take a clear, sharp close-up photo in natural daylight showing upper and lower leaf surfaces. Check nearby plants for spread.",
      preventiveMeasuresTe: "మంచి సూర్యకాంతిలో ఆకు పైభాగం మరియు క్రింది భాగం స్పష్టంగా కనిపించేలా క్లోజప్ ఫోటో తీయండి. పక్క మొక్కలను పరిశీలించండి.",
      suggestedActionsEn: [
        "Take a well-focused close-up photo (15-20 cm) in morning daylight.",
        "Check lower leaf surface and stem nodes for fungal webbing or insect pests.",
        "Consult your local Mandal Agricultural Extension Officer (AEO) or call Kisan Toll-Free Helpline 1800-180-1551."
      ],
      suggestedActionsTe: [
        "మంచి వెలుతురులో ఆకుకు 15-20 సెం.మీ దూరంలో స్పష్టమైన క్లోజప్ ఫోటో తీయండి.",
        "ఆకుల అడుగున పురుగులు లేదా బూజు లక్షణాలు ఏమైనా ఉన్నాయో పరిశీలించండి.",
        "మీ గ్రామ వ్యవసాయ విస్తరణ అధికారి (AEO) ని లేదా కిసాన్ కాల్ సెంటర్ (1800-180-1551) ని సంప్రదించండి."
      ],
      safetyDisclaimer: "Agricultural Safety Gate: To protect crops and prevent hazardous off-label pesticide usage, unverified diagnoses are never fabricated. Always consult your Mandal Agricultural Extension Officer (AEO).",
      favourableConditions: "Requires field confirmation under local microclimate conditions.",
      metadata: extraMetadata,
    }
  };
}

// Generate structured response for pre-inference validation failure
export function createValidationFailureResponse(
  crop: string,
  district: string = "Jagtial",
  lang: "en" | "te" = "en",
  validation: ImageValidationResult
): DiagnosisApiResponse {
  const isTe = lang === "te";
  return {
    success: false,
    status: "validation_failed",
    errorKey: validation.errorKey,
    error: isTe ? validation.messageTe : validation.messageEn,
    guidance: isTe ? validation.guidanceTe : validation.guidanceEn,
    source: "Smart Farm Pre-Inference Image Quality Gate",
    isAiGenerated: false,
    diagnosis: {
      status: "inconclusive",
      id: "validation_rejection",
      diseaseNameEn: "Diagnosis Inconclusive / Image Quality Gate",
      diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది / ఫోటో నాణ్యత సరిపోలేదు",
      scientificName: "N/A — Pre-inference validation rejected unsuitable image",
      crop,
      confidenceLevel: "Unable to determine",
      severity: "low",
      verificationStatus: "Rejected by Pre-Inference Safety Gate",
      symptomsEn: validation.messageEn || "Image did not pass pre-inference quality checks.",
      symptomsTe: validation.messageTe || "ఫోటో నాణ్యతా ప్రమాణాలకు అనుగుణంగా లేదు.",
      chemicalSprayEn: "No chemical prescription issued. Never apply chemical sprays on the basis of an unclear or unsuitable photo.",
      chemicalSprayTe: "ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు. అస్పష్టమైన ఫోటో ఆధారంగా రసాయన మందులు పిచికారీ చేయవద్దు.",
      dosage: "Do not apply chemical pesticides without confirmed diagnosis",
      isChemicalVerified: false,
      organicControlEn: "Capture a fresh photograph in natural morning daylight.",
      organicControlTe: "సహజమైన ఉదయపు వెలుతురులో కొత్త ఫోటో తీయండి.",
      preventiveMeasuresEn: validation.guidanceEn || "Capture sharp close-up images showing lesion margins in natural daylight.",
      preventiveMeasuresTe: validation.guidanceTe || "ఆకు మచ్చల అంచులు స్పష్టంగా కనిపించేలా సహజమైన వెలుతురులో ఫోటో తీయండి.",
      suggestedActionsEn: [
        validation.guidanceEn || "Photograph the leaf closely (15-20 cm) in natural morning lighting.",
        "Ensure camera lens is focused directly on leaf margins rather than background soil.",
        "Avoid harsh flash glare, deep shadows, and motion blur.",
        "Call Kisan Toll-Free Helpline: 1800-180-1551 for on-site field consultation."
      ],
      suggestedActionsTe: [
        validation.guidanceTe || "ఆకును దగ్గరగా (15-20 సెం.మీ) ఉంచి మంచి వెలుతురులో ఫోటో తీయండి.",
        "నేల కాకుండా ఆకుపై కెమెరా ఫోకస్ అయ్యేలా చూసుకోండి.",
        "ఫ్లాష్ లైట్ లేదా నీడ పడకుండా సహజ కాంతిలో తీయండి.",
        "సమస్య తీవ్రంగా ఉంటే కిసాన్ కాల్ సెంటర్ 1800-180-1551 కి ఫోన్ చేయండి."
      ],
      safetyDisclaimer: "Agricultural Safety Gate: Unsuitable, corrupted, or non-plant images are safely filtered before inference to prevent misdiagnosis.",
      metadata: validation.metadata,
    }
  };
}

// Core Diagnostic Execution Engine
export async function executeDiagnosis(
  body: DiagnosisRequest,
  options?: {
    apiKey?: string;
    model?: string;
    fetchFn?: typeof fetch;
    validationConfig?: ValidationConfig;
  }
): Promise<ExecuteDiagnosisResult> {
  const result = await runDiagnosisPipeline(body, {
    apiKey: options?.apiKey,
    model: options?.model,
    fetchFn: options?.fetchFn,
    skipRateLimiter: true,
    validationConfig: options?.validationConfig,
  });
  return {
    status: result.status,
    body: result.body,
  };
}
