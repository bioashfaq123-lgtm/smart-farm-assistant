/**
 * Smart Farm Crop Disease Diagnosis — Gemini Vision Multimodal Adapter
 * 
 * Secure, schema-enforced AI adapter for differential diagnosis and plant pathology.
 * - Sends API key exclusively via HTTP header 'x-goog-api-key'.
 * - Solicits differential candidates only when evidence supports multiple causes.
 * - Strictly prohibits LLM-generated chemical pesticide dosages and brand names.
 */

export interface ModelCandidateOutput {
  id?: string;
  commonName: string;
  nameTe?: string;
  scientificName?: string;
  type: "fungal" | "bacterial" | "viral" | "insect" | "nutrient" | "abiotic" | "other";
  confidenceLevel: "Possible diagnosis" | "Needs further verification" | "Unable to determine";
  symptomsSeen: string;
  unconfirmedSymptoms?: string;
  differentialClues?: string;
  fieldCheck?: string;
}

export interface ModelDiagnosisResponse {
  isPlant: boolean;
  cropConsistency: "consistent" | "inconsistent" | "unsupported" | "ambiguous";
  status: "diagnosis_available" | "possible" | "possible_diagnosis" | "needs_more_information" | "inconclusive";
  notSureReason?: string;
  candidates: ModelCandidateOutput[];
  primaryObservation?: string;
}

export interface DiagnoseParams {
  crop: string;
  symptoms?: string;
  imageBuffer?: Buffer;
  mimeType?: string;
  district?: string;
  lang?: "en" | "te";
  kbDisorders?: Array<{ id: string; commonName: string; nameTe: string; type: string; differential?: string; symptoms: string }>;
  apiKey?: string;
  model?: string;
  fetchFn?: typeof fetch;
}

export async function queryGeminiDiagnosis(params: DiagnoseParams): Promise<ModelDiagnosisResponse> {
  const {
    crop,
    symptoms = "",
    imageBuffer,
    mimeType = "image/jpeg",
    district = "Jagtial",
    lang = "en",
    kbDisorders = [],
    apiKey = process.env.GEMINI_API_KEY || "",
    fetchFn = fetch,
  } = params;

  if (!apiKey || apiKey.length < 30) {
    throw new Error("MISSING_API_KEY");
  }

  const configuredModel = params.model || process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const candidateModels = [configuredModel, "gemini-2.0-flash", "gemini-1.5-flash"].filter(
    (m, idx, arr) => m !== "gemini-3.8-flash" && arr.indexOf(m) === idx
  );

  const promptParts: any[] = [];

  // Add image if buffer provided
  if (imageBuffer && imageBuffer.length > 0) {
    promptParts.push({
      inlineData: {
        mimeType,
        data: imageBuffer.toString("base64"),
      },
    });
  }

  // Format pre-compiled Telangana knowledge base disorders
  const kbListing = kbDisorders
    .map(
      (d) =>
        `- ID: "${d.id}" | Common: "${d.commonName}" | Telugu: "${d.nameTe}" | Type: ${d.type} | Key: ${
          d.differential || d.symptoms.slice(0, 100)
        }`
    )
    .join("\n");

  const isTe = lang === "te";
  const userInstruction = `You are a clinical agricultural plant pathologist for ${district} District, Telangana, India (PJTAU standard).
Analyze the crop leaf photo and farmer field context.

FARMER FIELD CONTEXT:
- Declared Crop: ${crop}
- Farmer Reported Symptoms: "${symptoms || "None reported; evaluate visually."}"
- Language Requirement: Provide English and Telugu terms.

AUTHORITATIVE TELANGANA KNOWLEDGE BASE CANDIDATES FOR THIS CROP:
${kbListing || "No pre-compiled list available for this crop."}

DIAGNOSTIC & DIFFERENTIAL RULES:
1. PLANT RELEVANCE & CROP CONSISTENCY:
   - "isPlant": Set false if the image shows a person, animal, vehicle, tool, indoor room, or non-plant object.
   - "cropConsistency": Set "consistent" if the visible foliage matches "${crop}".
     Set "inconsistent" if image shows a completely different crop/plant.
     Set "unsupported" if the plant is an unverified crop species.
     Set "ambiguous" if plant species cannot be reliably determined.
2. HONEST UNCERTAINTY STATUS:
   - If "isPlant" is false or "cropConsistency" is "inconsistent", set "status": "inconclusive".
   - If the photo shows a healthy leaf, set "status": "inconclusive".
   - If symptoms are ambiguous, photo is low-contrast, or requires checking leaf underside / whole plant, set "status": "needs_more_information".
   - If symptoms could plausibly be caused by multiple distinct conditions (e.g. Blast vs Brown Spot, or Thrips vs Mites vs Mosaic), set "status": "possible" and return 2 or 3 differential candidates.
   - If one clear condition is visually confirmed on the declared crop, set "status": "diagnosis_available" and return 1 candidate.
   - NEVER fabricate alternative conditions merely to fill a list. Return only plausible candidates supported by evidence.
3. FOR EACH CANDIDATE:
   - "id": Match the KB disorder ID from above if it matches, else empty string.
   - "commonName": Standard English condition name.
   - "nameTe": Telugu name.
   - "scientificName": Causal organism, pest species, or nutrient classification (e.g., "Zinc Deficiency").
   - "type": Strictly one of "fungal", "bacterial", "viral", "insect", "nutrient", "abiotic", "other".
   - "confidenceLevel": Strictly "Possible diagnosis", "Needs further verification", or "Unable to determine". DO NOT use percentage numbers.
   - "symptomsSeen": Exact visual signs visible on foliage.
   - "unconfirmedSymptoms": Important diagnostic clues that cannot be verified from the photo alone.
   - "differentialClues": How to distinguish this from similar pests/diseases.
   - "fieldCheck": Specific physical test or inspection the farmer should conduct in the field.
4. STRICT SAFETY:
   - DO NOT prescribe chemical pesticide dosages, commercial brand names, or chemical tank mixtures.

Output STRICT JSON only matching this schema with NO markdown fences:
{
  "isPlant": boolean,
  "cropConsistency": "consistent" | "inconsistent" | "unsupported" | "ambiguous",
  "status": "diagnosis_available" | "possible" | "needs_more_information" | "inconclusive",
  "notSureReason": "Explanation if inconclusive or needs_more_information",
  "primaryObservation": "Summary of visual findings",
  "candidates": [
    {
      "id": "kb_disorder_id_or_empty",
      "commonName": "Condition Name",
      "nameTe": "వ్యాధి పేరు",
      "scientificName": "Scientific or Nutrient Name",
      "type": "fungal" | "bacterial" | "viral" | "insect" | "nutrient" | "abiotic" | "other",
      "confidenceLevel": "Possible diagnosis" | "Needs further verification" | "Unable to determine",
      "symptomsSeen": "Visible symptoms on leaf",
      "unconfirmedSymptoms": "Symptoms not visible in current photo",
      "differentialClues": "How this differs from similar conditions",
      "fieldCheck": "Field inspection step for farmer"
    }
  ]
}`;

  promptParts.push({ text: userInstruction });

  let lastError: any = null;

  for (const modelId of candidateModels) {
    try {
      const response = await fetchFn(
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
              maxOutputTokens: 1400,
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(12000),
        }
      );

      if (!response.ok) {
        lastError = new Error(`HTTP_${response.status}_FROM_${modelId}`);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        lastError = new Error("EMPTY_MODEL_OUTPUT");
        continue;
      }

      const cleanJson = rawText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
      const parsed: any = JSON.parse(cleanJson);

      // Robust schema normalization
      if (parsed && (typeof parsed.status === "string" || typeof parsed.diseaseNameEn === "string")) {
        // Normalize isPlant and cropConsistency
        if (typeof parsed.isPlant !== "boolean") {
          parsed.isPlant = true;
        }
        if (!parsed.cropConsistency) {
          parsed.cropConsistency = "consistent";
        }

        // Normalize status
        if (!parsed.status) {
          parsed.status = parsed.diseaseNameEn ? "possible_diagnosis" : "inconclusive";
        }
        if (parsed.status === "possible_diagnosis") {
          parsed.status = "possible_diagnosis";
        }

        // If candidates array is missing but single diseaseNameEn is provided (legacy format)
        if (!Array.isArray(parsed.candidates) || parsed.candidates.length === 0) {
          if (parsed.diseaseNameEn && parsed.diseaseNameEn !== "N/A") {
            parsed.candidates = [
              {
                id: parsed.id || "",
                commonName: parsed.diseaseNameEn,
                nameTe: parsed.diseaseNameTe || parsed.diseaseNameEn,
                scientificName: parsed.scientificName || "N/A",
                type: parsed.type || "fungal",
                confidenceLevel: parsed.confidenceLevel || "Possible diagnosis",
                symptomsSeen: parsed.symptomsEn || parsed.symptomsSeen || "Visual foliar symptoms observed.",
                unconfirmedSymptoms: parsed.unconfirmedSymptoms || "",
                differentialClues: parsed.differentialClues || "",
                fieldCheck: parsed.fieldCheck || "",
              },
            ];
          } else {
            parsed.candidates = [];
          }
        }

        return parsed as ModelDiagnosisResponse;
      }
    } catch (err: any) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(`Model ${modelId} evaluation attempt failed:`, err.message);
      }
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("PROVIDER_UNAVAILABLE");
}
