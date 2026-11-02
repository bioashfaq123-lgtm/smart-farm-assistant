import fs from "fs";
import path from "path";

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
}

export interface DiagnosisApiResponse {
  success: boolean;
  status: "possible_diagnosis" | "inconclusive" | "symptom_match";
  source: string;
  isAiGenerated: boolean;
  diagnosis: StructuredDiagnosis;
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
  reasonTe?: string
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
        "Take a well-focused close-up photo in morning daylight.",
        "Check lower leaf surface and stem nodes for fungal webbing or insect pests.",
        "Consult your local Mandal Agricultural Extension Officer (AEO) or call Kisan Toll-Free Helpline 1800-180-1551."
      ],
      suggestedActionsTe: [
        "మంచి వెలుతురులో ఆకు పైభాగం మరియు క్రింది భాగం స్పష్టంగా కనిపించేలా ఫోటో తీయండి.",
        "ఆకుల అడుగున పురుగులు లేదా బూజు లక్షణాలు ఏమైనా ఉన్నాయో పరిశీలించండి.",
        "మీ గ్రామ వ్యవసాయ విస్తరణ అధికారి (AEO) ని లేదా కిసాన్ కాల్ సెంటర్ (1800-180-1551) ని సంప్రదించండి."
      ],
      safetyDisclaimer: "Agricultural Safety Gate: To protect crops and prevent hazardous off-label pesticide usage, unverified diagnoses are never fabricated. Always consult your Mandal Agricultural Extension Officer (AEO).",
      favourableConditions: "Requires field confirmation under local microclimate conditions."
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
  }
): Promise<ExecuteDiagnosisResult> {
  try {
    const { image, symptoms, crop = "Paddy", district = "Jagtial", lang = "en" } = body;

    const hasImage = Boolean(image && image.trim().length > 50);
    const hasSymptoms = Boolean(symptoms && symptoms.trim().length > 0);

    if (!hasImage && !hasSymptoms) {
      return {
        status: 400,
        body: { error: "Please upload an image or describe crop symptoms to diagnose." }
      };
    }

    // Extract clean image payload if present
    let mimeType = "image/jpeg";
    let base64Data = "";
    if (hasImage && image) {
      if (image.startsWith("data:")) {
        const parts = image.split(";base64,");
        mimeType = parts[0].replace("data:", "");
        base64Data = parts[1];
      } else {
        base64Data = image;
      }
    }

    // SECURITY: Read credentials exclusively from server-side environment variables or explicit options
    const apiKey = (options?.apiKey ?? process.env.GEMINI_API_KEY ?? "").trim();
    const isApiKeyValid = apiKey.length >= 30;

    const localMatch = matchLocalDisorder(crop, symptoms || "");
    const effectiveFetch = options?.fetchFn || fetch;

    // 1. Attempt Gemini Multimodal Vision / Symptom Reasoning if API key is present
    if (isApiKeyValid) {
      const configuredModel = options?.model || process.env.GEMINI_MODEL || "gemini-2.0-flash";
      const candidateModels = [configuredModel, "gemini-2.0-flash", "gemini-1.5-flash"].filter(
        (m, idx, arr) => m !== "gemini-3.8-flash" && arr.indexOf(m) === idx
      );

      const promptParts: any[] = [];

      if (hasImage && base64Data) {
        promptParts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }

      const userInstruction = `You are an expert plant pathologist and agricultural extension diagnostic assistant for ${district} District, Telangana, India.
Farmer Crop: ${crop}.
Farmer Reported Symptoms: "${symptoms || "None provided; evaluate visually."}".
Language Requirement: Output response in ${lang === "te" ? "Telugu (తెలుగు)" : "English"}.

DIAGNOSTIC SAFETY RULES:
1. If the photo does not clearly show a crop leaf/plant, is too blurry/dark, shows a healthy plant, or if symptoms are ambiguous/insufficient for a confident assessment, you MUST set "status": "inconclusive".
2. DO NOT invent chemical pesticide commercial names, chemical tank mixes, or specific spray dosages.
3. If a probable disease is visually identified, set "status": "possible_diagnosis", "confidenceLevel": "Possible diagnosis" or "Needs further verification". DO NOT assign fake percentage numbers.
4. Chemical recommendations must state: "Consult your local Mandal Agricultural Extension Officer (AEO) for CIB&RC approved label treatment."

Output STRICT JSON only matching this schema with NO markdown fences:
{
  "status": "possible_diagnosis" | "inconclusive",
  "diseaseNameEn": "Name of disease or 'Diagnosis Inconclusive / Further Verification Required'",
  "diseaseNameTe": "తెలుగులో వ్యాధి పేరు లేదా 'వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది'",
  "scientificName": "Scientific Pathogen Name or 'N/A'",
  "crop": "${crop}",
  "confidenceLevel": "Possible diagnosis" | "Needs further verification" | "Unable to determine",
  "severity": "low" | "medium" | "high",
  "symptomsEn": "Exact visual symptoms seen, or why image is inconclusive",
  "symptomsTe": "గమనించిన స్పష్టమైన లక్షణాలు లేదా నిర్ధారణ ఎందుకు సాధ్యం కాలేదు",
  "chemicalSprayEn": "CIB&RC guidance note (DO NOT invent pesticide doses)",
  "chemicalSprayTe": "వ్యవసాయ అధికారి సలహా సూచన",
  "dosage": "Consult container label and local AEO",
  "organicControlEn": "Safe cultural or biological management practice",
  "organicControlTe": "సేంద్రీయ లేదా సాంస్కృతిక యాజమాన్య పద్ధతి",
  "preventiveMeasuresEn": "Agronomic preventive actions",
  "preventiveMeasuresTe": "నివారణ చర్యలు",
  "safetyDisclaimer": "Wear protective gear during handling. Consult your local Agricultural Extension Officer (AEO)."
}`;

      promptParts.push({ text: userInstruction });

      for (const modelId of candidateModels) {
        try {
          const geminiRes = await effectiveFetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [{ role: "user", parts: promptParts }],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 1200,
                  responseMimeType: "application/json",
                },
              }),
              signal: AbortSignal.timeout(12000),
            }
          );

          if (!geminiRes.ok) continue;

          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (rawText) {
            const cleanJsonText = rawText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
            const parsed = JSON.parse(cleanJsonText);

            if (parsed) {
              const isInconclusive = parsed.status === "inconclusive" || 
                (parsed.confidenceLevel === "Unable to determine") ||
                (parsed.diseaseNameEn && parsed.diseaseNameEn.toLowerCase().includes("inconclusive")) ||
                (parsed.diseaseNameEn && parsed.diseaseNameEn.toLowerCase().includes("unable to determine"));

              if (isInconclusive) {
                return {
                  status: 200,
                  body: createInconclusiveDiagnosis(
                    crop,
                    district,
                    lang,
                    parsed.symptomsEn,
                    parsed.symptomsTe
                  )
                };
              }

              if (parsed.diseaseNameEn && parsed.diseaseNameEn !== "N/A") {
                const isKbMatch = Boolean(localMatch && (
                  localMatch.commonName.toLowerCase().includes(parsed.diseaseNameEn.toLowerCase()) ||
                  parsed.diseaseNameEn.toLowerCase().includes(localMatch.commonName.toLowerCase())
                ));

                const chemNotice = isKbMatch && localMatch.management?.chemicalClass?.[0]
                  ? `Indicative Class: ${localMatch.management.chemicalClass[0]}. Confirm exact CIB&RC label dosage with local Mandal AEO before application.`
                  : "No verified chemical prescription available. Chemical application requires on-site confirmation by your Mandal Agricultural Extension Officer (AEO).";

                const chemNoticeTe = isKbMatch && localMatch.management?.chemicalClass?.[0]
                  ? `సూచన: ${localMatch.management.chemicalClass[0]}. పిచికారీ చేసే ముందు గ్రామ AEO ని సంప్రదించి సరైన మోతాదును తెలుసుకోండి.`
                  : "ధ్రువీకరించబడిన రసాయన మందు అందుబాటులో లేదు. స్థానిక వ్యవసాయ అధికారి (AEO) సూచించిన తర్వాతే మందులు వాడండి.";

                return {
                  status: 200,
                  body: {
                    success: true,
                    status: "possible_diagnosis",
                    source: `Gemini Multimodal Vision AI (${modelId}) — Indicative Assessment`,
                    isAiGenerated: true,
                    diagnosis: {
                      status: "possible_diagnosis",
                      id: localMatch?.id || "ai_observation",
                      diseaseNameEn: parsed.diseaseNameEn,
                      diseaseNameTe: parsed.diseaseNameTe || parsed.diseaseNameEn,
                      scientificName: parsed.scientificName || localMatch?.scientificName || "Pathogen identification pending laboratory confirmation",
                      crop,
                      confidenceLevel: parsed.confidenceLevel === "High" ? "Possible diagnosis" : "Needs further verification",
                      severity: parsed.severity || "medium",
                      verificationStatus: "Unverified (Draft Knowledge Base - Pending Field Extension Review)",
                      symptomsEn: parsed.symptomsEn || "Visual foliar symptoms observed.",
                      symptomsTe: parsed.symptomsTe || "గమనించిన ఆకు లక్షణాలు.",
                      chemicalSprayEn: chemNotice,
                      chemicalSprayTe: chemNoticeTe,
                      dosage: "Confirm with Mandal AEO before purchase",
                      isChemicalVerified: false,
                      organicControlEn: (isKbMatch && localMatch.management?.biological?.[0]) || parsed.organicControlEn || "Adopt balanced fertilization and field sanitation.",
                      organicControlTe: (isKbMatch && localMatch.management?.biological?.[0]) || parsed.organicControlTe || "సమతుల్య ఎరువులు మరియు పొలంలో పరిశుభ్రత పాటించండి.",
                      preventiveMeasuresEn: (isKbMatch && localMatch.management?.cultural?.[0]) || parsed.preventiveMeasuresEn || "Monitor field progression and ensure proper drainage.",
                      preventiveMeasuresTe: (isKbMatch && localMatch.management?.cultural?.[0]) || parsed.preventiveMeasuresTe || "పొలంలో తెగులు వ్యాప్తిని గమనిస్తూ నీటి పారుదల సక్రమంగా నిర్వహించండి.",
                      safetyDisclaimer: "Always use CIB&RC approved crop protection products. Wear protective mask and gloves. Confirm critical treatment decisions with your local Agriculture Extension Officer (AEO).",
                      favourableConditions: localMatch?.favourableConditions?.weatherFactors || "Favourable under warm, humid conditions.",
                    },
                  }
                };
              }
            }
          }
        } catch (modelErr) {
          if (process.env.NODE_ENV !== "test") {
            console.warn(`Model ${modelId} evaluation attempt failed:`, modelErr);
          }
          continue;
        }
      }
    }

    // 2. Safe Fallback Handling
    if (localMatch && hasSymptoms) {
      const bioRec = localMatch.management?.biological?.[0] || "Adopt recommended biological control practices.";
      const culturalRec = localMatch.management?.cultural?.[0] || "Adopt balanced crop management.";

      return {
        status: 200,
        body: {
          success: true,
          status: "symptom_match",
          source: "Symptom Rule Match (Unconfirmed by visual AI)",
          isAiGenerated: false,
          diagnosis: {
            status: "possible_diagnosis",
            id: localMatch.id,
            diseaseNameEn: localMatch.commonName,
            diseaseNameTe: localMatch.nameTe,
            scientificName: localMatch.scientificName || "N/A",
            crop,
            confidenceLevel: "Needs further verification",
            severity: "medium",
            verificationStatus: "Unverified (Draft Knowledge Base - Pending Field Extension Review)",
            symptomsEn: `Matched farmer-reported symptoms: "${symptoms}". Visual confirmation unavailable.`,
            symptomsTe: `రైతు తెలిపిన లక్షణాల ఆధారంగా సరిపోలినది: "${symptoms}". ఫోటో ద్వారా ధ్రువీకరణ జరగలేదు.`,
            chemicalSprayEn: `Indicative Class: ${localMatch.management?.chemicalClass?.[0] || "Chemical class under review"}. Must be confirmed by your Mandal AEO before purchase.`,
            chemicalSprayTe: `సూచిక రసాయన తరగతి: ${localMatch.management?.chemicalClass?.[0] || "సమీక్షలో ఉంది"}. కొనుగోలు చేసే ముందు మండల AEO ని సంప్రదించండి.`,
            dosage: "Confirm with Mandal AEO before purchase",
            isChemicalVerified: false,
            organicControlEn: bioRec,
            organicControlTe: bioRec,
            preventiveMeasuresEn: culturalRec,
            preventiveMeasuresTe: culturalRec,
            safetyDisclaimer: "Indicative symptom match only. Wear protective face mask and gloves. Always verify critical diagnosis with your local Agriculture Extension Officer (AEO).",
            favourableConditions: localMatch.favourableConditions?.weatherFactors || "Favourable in humid or cloudy conditions.",
          },
        }
      };
    }

    // 3. Ambiguous, missing symptoms, or AI service unavailable: Return honest inconclusive response.
    return {
      status: 200,
      body: createInconclusiveDiagnosis(
        crop,
        district,
        lang,
        !hasImage && !hasSymptoms
          ? "No leaf photo or detailed symptoms were provided."
          : "Visual diagnostic service could not establish a confident identification. To prevent misdiagnosis and unsafe chemical application, field inspection is required.",
        !hasImage && !hasSymptoms
          ? "ఆకు ఫోటో లేదా స్పష్టమైన లక్షణాలు అందించలేదు."
          : "స్పష్టమైన నిర్ధారణకు తగిన సమాచారం లేదు. పంట నష్టాన్ని మరియు అనవసరపు మందుల వాడకాన్ని నివారించడానికి క్షేత్ర పరిశీలన అవసరం."
      )
    };
  } catch (err: any) {
    console.error("Diagnosis error:", err);
    return {
      status: 200,
      body: createInconclusiveDiagnosis(
        "Crop",
        "Telangana",
        "en",
        "A temporary system error occurred while evaluating the diagnosis. Please retry with a clear photo.",
        "నిర్ధారణ సమయంలో సాంకేతిక లోపం సంభవించింది. దయచేసి స్పష్టమైన ఫోటోతో మళ్ళీ ప్రయత్నించండి."
      )
    };
  }
}
