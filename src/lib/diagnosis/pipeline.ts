/**
 * Smart Farm Crop Disease Diagnosis — Authoritative Pipeline Orchestrator (Phase C)
 * 
 * Unites:
 * 1. Deployment-compatible sliding window rate limiter.
 * 2. Phase B pre-inference image validation (magic bytes, dimensions, exposure).
 * 3. Gemini multimodal vision adapter with strict JSON differential schema.
 * 4. Authoritative Telangana Knowledge Base grounding (PJTAU package of practices).
 * 5. Honest uncertainty taxonomy (diagnosis_available, possible, needs_more_information, inconclusive, provider_error).
 */

import {
  validateImagePayload,
  extractImageBuffer,
  type ImageValidationResult,
  type ValidationConfig,
} from "../imageValidation.ts";
import { checkRateLimit, type RateLimitCheckResult } from "./rateLimiter.ts";
import { queryGeminiDiagnosis, type ModelDiagnosisResponse, type ModelCandidateOutput } from "./geminiAdapter.ts";
import {
  loadKnowledgeBase,
  getSupportedCrops,
  getCropDisorders,
  findDisorder,
  enrichCandidateWithKb,
} from "./knowledgeBase.ts";
import { matchLocalDisorder } from "../diagnosisSafety.ts";

export type DiagnosisStatus =
  | "diagnosis_available"
  | "possible"
  | "possible_diagnosis"
  | "symptom_match"
  | "needs_more_information"
  | "inconclusive"
  | "validation_failed"
  | "rate_limited"
  | "provider_error";

export interface DifferentialCandidate {
  id: string;
  commonName: string;
  nameTe: string;
  scientificName: string;
  type: "fungal" | "bacterial" | "viral" | "insect" | "nutrient" | "abiotic" | "other";
  confidenceLevel: "Possible diagnosis" | "Needs further verification" | "Unable to determine";
  symptomsSeen: string;
  unconfirmedSymptoms: string;
  differentialClues: string;
  fieldCheck: string;
  isFromKb: boolean;
  verificationStatus: string;
  source: string;
  favourableConditions?: string;
  management: {
    cultural: string[];
    biological: string[];
    chemicalClass: string[];
    chemicalNoticeEn: string;
    chemicalNoticeTe: string;
    safetyDisclaimer: string;
  };
}

export interface DiagnosisPipelineResult {
  status: number; // HTTP status code
  body: {
    success: boolean;
    status: DiagnosisStatus;
    source: string;
    isAiGenerated: boolean;
    crop: string;
    district: string;
    primaryObservation?: string;
    notSureReason?: string;
    candidates: DifferentialCandidate[];
    diagnosis: any; // Backward-compatible primary diagnosis view
    error?: string;
    errorKey?: string;
    guidance?: string;
    resetSeconds?: number;
    metadata?: any;
  };
}

export interface PipelineExecutionOptions {
  clientIp?: string;
  userId?: string | null;
  apiKey?: string;
  model?: string;
  fetchFn?: typeof fetch;
  skipRateLimiter?: boolean;
  validationConfig?: ValidationConfig;
}

/**
 * Creates structured inconclusive response for pipeline
 */
export function createPipelineInconclusive(
  crop: string,
  district = "Jagtial",
  lang: "en" | "te" = "en",
  reasonEn?: string,
  reasonTe?: string,
  status: DiagnosisStatus = "inconclusive",
  metadata?: any
): DiagnosisPipelineResult {
  const isTe = lang === "te";
  const defReasonEn = reasonEn || "Visual evidence is ambiguous, low-contrast, or insufficient to distinguish between overlapping foliar conditions without on-site field testing.";
  const defReasonTe = reasonTe || "అందించిన ఫోటో లేదా లక్షణాలు ఖచ్చితమైన నిర్ధారణకు సరిపోలేదు. తప్పుడు మందులు వాడకుండా ఉండేందుకు స్థానిక వ్యవసాయ అధికారి పరిశీలన అవసరం.";

  const primary = {
    status: "inconclusive",
    id: "inconclusive_case",
    diseaseNameEn: "Diagnosis Inconclusive / Further Verification Required",
    diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది / క్షేత్రస్థాయి పరిశీలన అవసరం",
    scientificName: "N/A — Insufficient diagnostic certainty",
    crop,
    confidenceLevel: "Unable to determine",
    severity: "medium",
    verificationStatus: "Inconclusive (No unverified disease assigned)",
    symptomsEn: defReasonEn,
    symptomsTe: defReasonTe,
    chemicalSprayEn: "No chemical prescription issued. Chemical sprays must NEVER be applied without confirmed diagnosis from your Mandal Agricultural Extension Officer (AEO).",
    chemicalSprayTe: "ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు. మండల వ్యవసాయ విస్తరణ అధికారి (AEO) ద్వారా నిర్ధారించబడకుండా రసాయన మందులు వాడవద్దు.",
    dosage: "Do not apply chemical pesticides without confirmed diagnosis",
    isChemicalVerified: false,
    organicControlEn: "Inspect plants daily in the morning. Isolate or carefully prune severely damaged leaves if infection is localized. Ensure field drainage.",
    organicControlTe: "ప్రతిరోజూ ఉదయం మొక్కలను గమనించండి. సమస్య ఉన్న ఆకులను వేరు చేయండి. పొలంలో నీరు నిల్వ ఉండకుండా చూడండి.",
    preventiveMeasuresEn: "Take a clear, sharp close-up photo (15-20 cm) in natural daylight showing upper and lower leaf surfaces. Check nearby plants for spread.",
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
    metadata,
  };

  return {
    status: 200,
    body: {
      success: true,
      status,
      source: "Smart Farm Decision-Support Safety Gate",
      isAiGenerated: false,
      crop,
      district,
      notSureReason: isTe ? defReasonTe : defReasonEn,
      candidates: [],
      diagnosis: primary,
      metadata,
    },
  };
}

/**
 * Executes authoritative diagnosis pipeline
 */
export async function runDiagnosisPipeline(
  body: {
    image?: string;
    symptoms?: string;
    crop?: string;
    district?: string;
    lang?: "en" | "te";
  },
  options?: PipelineExecutionOptions
): Promise<DiagnosisPipelineResult> {
  const { image, symptoms, crop = "Paddy", district = "Jagtial", lang = "en" } = body;
  const isTe = lang === "te";

  // 1. Rate Limiting Check
  if (!options?.skipRateLimiter) {
    const rateLimit = checkRateLimit(options?.clientIp || "anonymous", options?.userId || null);
    if (!rateLimit.allowed) {
      return {
        status: 429,
        body: {
          success: false,
          status: "rate_limited",
          errorKey: "RATE_LIMITED",
          error: isTe ? rateLimit.messageTe : rateLimit.messageEn,
          resetSeconds: rateLimit.resetSeconds,
          source: "Smart Farm API Gateway Rate Limiter",
          isAiGenerated: false,
          crop,
          district,
          candidates: [],
          diagnosis: null,
        },
      };
    }
  }

  // 2. Validate Input Presence
  const hasImage = Boolean(image && image.trim().length > 20);
  const hasSymptoms = Boolean(symptoms && symptoms.trim().length > 0);

  if (!hasImage && !hasSymptoms) {
    return {
      status: 400,
      body: {
        success: false,
        status: "validation_failed",
        error: "Please upload an image or describe crop symptoms to diagnose.",
        source: "Input Validation Gate",
        isAiGenerated: false,
        crop,
        district,
        candidates: [],
        diagnosis: null,
      },
    };
  }

  // 3. Supported Crops Validation
  const supportedCrops = getSupportedCrops();
  const isSupportedCrop = supportedCrops.some(
    (c) => c.toLowerCase() === String(crop || "").trim().toLowerCase()
  );

  // 4. Phase B Pre-Inference Image Quality Validation
  let imageBuffer: Buffer | undefined;
  let mimeType = "image/jpeg";
  let validationMeta: any = null;

  if (hasImage) {
    const validation = validateImagePayload(image, options?.validationConfig);
    if (!validation.isValid) {
      const isTeLang = lang === "te";
      return {
        status: 400,
        body: {
          success: false,
          status: "validation_failed",
          errorKey: validation.errorKey,
          error: isTeLang ? validation.messageTe : validation.messageEn,
          guidance: isTeLang ? validation.guidanceTe : validation.guidanceEn,
          source: "Smart Farm Pre-Inference Image Quality Gate",
          isAiGenerated: false,
          crop,
          district,
          candidates: [],
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
          },
          metadata: validation.metadata,
        },
      };
    }

    validationMeta = validation.metadata;
    mimeType = validation.metadata?.mimeType || "image/jpeg";
    const extracted = extractImageBuffer(image!);
    if (extracted) {
      imageBuffer = extracted.buffer;
    }
  }

  // Unsupported crop guard: If not in validated list, return safe advisory with supported crops
  if (!isSupportedCrop) {
    return createPipelineInconclusive(
      crop,
      district,
      lang,
      `The crop "${crop}" is not currently in our validated Telangana PJTAU crop database. Supported crops are: ${supportedCrops.join(", ")}. Please consult your local Mandal Agricultural Extension Officer (AEO).`,
      `ఈ పంట (${crop}) ప్రస్తుతం ధ్రువీకరించబడిన PJTAU డేటాబేస్‌లో లేదు. ధ్రువీకరించబడిన పంటలు: ${supportedCrops.join(", ")}. దయచేసి స్థానిక వ్యవసాయ విస్తరణ అధికారి (AEO) ని సంప్రదించండి.`,
      "inconclusive",
      validationMeta
    );
  }

  const apiKey = (options?.apiKey ?? process.env.GEMINI_API_KEY ?? "").trim();
  const isApiKeyValid = apiKey.length >= 30;
  const kbDisorders = getCropDisorders(crop);

  // 5. Attempt Gemini Multimodal Vision / Differential Reasoning
  let isAiAttempted = false;
  if (isApiKeyValid) {
    try {
      isAiAttempted = true;
      const modelResponse: ModelDiagnosisResponse = await queryGeminiDiagnosis({
        crop,
        symptoms,
        imageBuffer,
        mimeType,
        district,
        lang,
        kbDisorders,
        apiKey,
        model: options?.model,
        fetchFn: options?.fetchFn,
      });

      // A. Plant Relevance Check
      if (!modelResponse.isPlant) {
        return createPipelineInconclusive(
          crop,
          district,
          lang,
          "The uploaded image does not appear to contain a crop leaf or agricultural plant specimen. Please upload an infected plant leaf photo.",
          "అందించిన ఫోటోలో పంట లేదా ఆకు స్పష్టంగా కనిపించడం లేదు. దయచేసి తెగులు సోకిన పంట ఆకు ఫోటోను అప్లోడ్ చేయండి.",
          "inconclusive",
          validationMeta
        );
      }

      // B. Crop Consistency Check
      if (modelResponse.cropConsistency === "inconsistent") {
        return createPipelineInconclusive(
          crop,
          district,
          lang,
          `The foliage in the photo does not match the selected crop (${crop}). Please verify your crop selection or upload the corresponding leaf photo.`,
          `ఫోటోలోని ఆకులు ఎంచుకున్న పంట (${crop}) తో సరిపోలడం లేదు. దయచేసి సరైన పంటను ఎంచుకోండి లేదా ఆ పంట ఫోటోను అప్‌లోడ్ చేయండి.`,
          "inconclusive",
          validationMeta
        );
      }

      if (modelResponse.cropConsistency === "ambiguous") {
        return createPipelineInconclusive(
          crop,
          district,
          lang,
          modelResponse.notSureReason || "Crop species identity is ambiguous. Visual foliage features cannot definitively confirm the crop without clinical field inspection.",
          "పంట రకం అస్పష్టంగా ఉంది. క్షేత్రస్థాయి పరిశీలన లేకుండా సరైన పంటగా నిర్ధారించలేము.",
          "inconclusive",
          validationMeta
        );
      }

      // C. Inconclusive or Healthy Leaf
      if (modelResponse.status === "inconclusive") {
        return createPipelineInconclusive(
          crop,
          district,
          lang,
          modelResponse.notSureReason || "Foliage appears healthy or visual symptoms are ambiguous without clinical field inspection.",
          modelResponse.notSureReason || "ఆకు ఆరోగ్యంగా ఉంది లేదా స్పష్టమైన తెగులు లక్షణాలు కనిపించడం లేదు. క్షేత్ర పరిశీలన అవసరం.",
          "inconclusive",
          validationMeta
        );
      }

      // D. Needs More Information Check
      if (modelResponse.status === "needs_more_information") {
        return createPipelineInconclusive(
          crop,
          district,
          lang,
          modelResponse.notSureReason || "Visual symptoms are inconclusive from this angle. Please photograph the leaf underside, examine whole plant growth, or describe symptoms.",
          modelResponse.notSureReason || "ఈ కోణంలో ఫోటో స్పష్టమైన నిర్ధారణకు సరిపోలేదు. దయచేసి ఆకు అడుగు భాగం ఫోటో తీయండి లేదా లక్షణాలను వివరించండి.",
          "needs_more_information",
          validationMeta
        );
      }

      // E. Valid Differential or Single Diagnosis
      if (modelResponse.candidates && modelResponse.candidates.length > 0) {
        // Enrich up to 3 candidates with authoritative Telangana knowledge base
        const enrichedCandidates = modelResponse.candidates.slice(0, 3).map((c) =>
          enrichCandidateWithKb(crop, c)
        );

        const primaryCandidate = enrichedCandidates[0];
        // Determine status type: preserve explicit possible_diagnosis for compatibility
        let statusType: DiagnosisStatus;
        if (modelResponse.status === "possible_diagnosis") {
          statusType = "possible_diagnosis";
        } else if (modelResponse.status === "diagnosis_available" && enrichedCandidates.length === 1) {
          statusType = "diagnosis_available";
        } else if (enrichedCandidates.length > 1) {
          statusType = "possible";
        } else {
          statusType = "possible_diagnosis";
        }

        // Construct backward-compatible primary diagnosis view
        const primaryDiagnosis = {
          status: statusType,
          id: primaryCandidate.id,
          diseaseNameEn: primaryCandidate.commonName,
          diseaseNameTe: primaryCandidate.nameTe,
          scientificName: primaryCandidate.scientificName,
          crop,
          confidenceLevel: primaryCandidate.confidenceLevel,
          severity: primaryCandidate.type === "nutrient" || primaryCandidate.type === "abiotic" ? "low" : "medium",
          verificationStatus: primaryCandidate.verificationStatus,
          symptomsEn: primaryCandidate.symptomsSeen,
          symptomsTe: primaryCandidate.symptomsSeen,
          chemicalSprayEn: primaryCandidate.management.chemicalNoticeEn,
          chemicalSprayTe: primaryCandidate.management.chemicalNoticeTe,
          dosage: "Confirm with Mandal AEO before purchase",
          isChemicalVerified: false,
          organicControlEn: primaryCandidate.management.biological?.[0] || "Adopt balanced nutrition and field sanitation.",
          organicControlTe: primaryCandidate.management.biological?.[0] || "సమతుల్య ఎరువులు మరియు పరిశుభ్రత పాటించండి.",
          preventiveMeasuresEn: primaryCandidate.management.cultural?.[0] || "Monitor field progression and ensure proper drainage.",
          preventiveMeasuresTe: primaryCandidate.management.cultural?.[0] || "పొలంలో నీటి పారుదల సక్రమంగా నిర్వహించండి.",
          safetyDisclaimer: primaryCandidate.management.safetyDisclaimer,
          favourableConditions: primaryCandidate.favourableConditions || "Requires field confirmation under local microclimate conditions.",
          metadata: validationMeta,
        };

        return {
          status: 200,
          body: {
            success: true,
            status: statusType,
            source: `Gemini Multimodal AI & Telangana Grounded Pathology`,
            isAiGenerated: true,
            crop,
            district,
            primaryObservation: modelResponse.primaryObservation || "Visual foliar assessment evaluated against PJTAU standard.",
            candidates: enrichedCandidates as DifferentialCandidate[],
            diagnosis: primaryDiagnosis,
            metadata: validationMeta,
          },
        };
      }
    } catch (err: any) {
      if (process.env.NODE_ENV !== "test") {
        console.warn("AI vision provider evaluation error:", err.message);
      }
      // If error is timeout or provider failure and symptoms are absent, return structured inconclusive response
      if (!hasSymptoms) {
        return createPipelineInconclusive(
          crop,
          district,
          lang,
          "The diagnostic vision service timed out or encountered a temporary connection failure. Please retry with a clear photo.",
          "సాంకేతిక సమస్య లేదా నెట్‌వర్క్ ఆలస్యం కారణంగా నిర్ధారణ పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
          "inconclusive",
          { ...validationMeta, errorType: "provider_error" }
        );
      }
    }
  }

  // 6. Safe Symptom Rule Grounding Fallback
  // If farmer reported symptoms with a high rule match, provide indicative diagnosis
  const localMatch = matchLocalDisorder(crop, symptoms || "");
  if (localMatch && hasSymptoms) {
    const enriched = enrichCandidateWithKb(crop, {
      id: localMatch.id,
      commonName: localMatch.commonName,
      nameTe: localMatch.nameTe,
      scientificName: localMatch.scientificName,
      type: localMatch.type,
      confidenceLevel: "Needs further verification",
      symptomsSeen: `Matched farmer-reported symptoms: "${symptoms}". Visual confirmation unavailable.`,
      unconfirmedSymptoms: "Visual leaf lesion margin confirmation unavailable.",
      differentialClues: localMatch.differential,
      fieldCheck: localMatch.fieldCheck,
    });

    return {
      status: 200,
      body: {
        success: true,
        status: "symptom_match",
        source: "Symptom Rule Match (Unconfirmed by visual AI)",
        isAiGenerated: false,
        crop,
        district,
        primaryObservation: `Farmer reported: "${symptoms}".`,
        candidates: [enriched as DifferentialCandidate],
        diagnosis: {
          status: "possible",
          id: enriched.id,
          diseaseNameEn: enriched.commonName,
          diseaseNameTe: enriched.nameTe,
          scientificName: enriched.scientificName,
          crop,
          confidenceLevel: "Needs further verification",
          severity: "medium",
          verificationStatus: enriched.verificationStatus,
          symptomsEn: enriched.symptomsSeen,
          symptomsTe: enriched.symptomsSeen,
          chemicalSprayEn: enriched.management.chemicalNoticeEn,
          chemicalSprayTe: enriched.management.chemicalNoticeTe,
          dosage: "Confirm with Mandal AEO before purchase",
          isChemicalVerified: false,
          organicControlEn: enriched.management.biological?.[0] || "Adopt balanced field management.",
          organicControlTe: enriched.management.biological?.[0] || "సమతుల్య యాజమాన్య పద్ధతులు పాటించండి.",
          preventiveMeasuresEn: enriched.management.cultural?.[0] || "Ensure field sanitation.",
          preventiveMeasuresTe: enriched.management.cultural?.[0] || "పొలంలో పరిశుభ్రత పాటించండి.",
          safetyDisclaimer: enriched.management.safetyDisclaimer,
          favourableConditions: enriched.favourableConditions || "Humid or cloudy field microclimate.",
          metadata: validationMeta,
        },
        metadata: validationMeta,
      },
    };
  }

  // 7. Ambiguous or missing symptoms with no AI match: return honest inconclusive response
  return createPipelineInconclusive(
    crop,
    district,
    lang,
    isAiAttempted
      ? "Diagnostic vision service was unavailable and reported symptoms were insufficient for a reliable assessment."
      : "Visual diagnostic service could not establish a confident identification. To prevent misdiagnosis and unsafe chemical application, field inspection is required.",
    isAiAttempted
      ? "సాంకేతిక లోపం మరియు అసంపూర్ణ లక్షణాల వల్ల ఖచ్చితమైన నిర్ధారణ సాధ్యం కాలేదు."
      : "స్పష్టమైన నిర్ధారణకు తగిన సమాచారం లేదు. పంట నష్టాన్ని మరియు అనవసరపు మందుల వాడకాన్ని నివారించడానికి క్షేత్ర పరిశీలన అవసరం.",
    "inconclusive",
    { ...validationMeta, isAiAttempted, errorType: isAiAttempted ? "provider_error" : undefined }
  );
}
