const BaseDiagnosisProvider = require("./baseProvider");

let cachedAvailableModels = null;
let lastModelFetch = 0;

/**
 * Dynamically queries Google Generative Language API to discover active models
 */
async function getAvailableGeminiModels(apiKey) {
  if (cachedAvailableModels && cachedAvailableModels.length > 0 && (Date.now() - lastModelFetch < 1800000)) {
    return cachedAvailableModels;
  }

  const versions = ["v1beta", "v1"];
  for (const v of versions) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`);
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data.models) && data.models.length > 0) {
          const supported = data.models
            .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => ({
              id: m.name.replace(/^models\//, ""),
              version: v
            }));

          if (supported.length > 0) {
            // Prioritize flash models first for fast, economical inference
            supported.sort((a, b) => {
              const aFlash = a.id.includes("flash") ? 1 : 0;
              const bFlash = b.id.includes("flash") ? 1 : 0;
              return bFlash - aFlash;
            });
            cachedAvailableModels = supported;
            lastModelFetch = Date.now();
            return supported;
          }
        }
      }
    } catch (err) {
      console.warn(`ListModels error on ${v}:`, err.message);
    }
  }

  // Fallback candidate list if ListModels call fails
  return [
    { id: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest", version: "v1beta" },
    { id: "gemini-1.5-flash", version: "v1" },
    { id: "gemini-2.0-flash", version: "v1beta" },
    { id: "gemini-1.5-pro", version: "v1" }
  ];
}

class GeminiDiagnosisProvider extends BaseDiagnosisProvider {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    super("Gemini");
    this.apiKey = apiKey;
  }

  buildPrompt(crop, lang, context, kbDisorders) {
    const isTe = (lang === "te" || lang === "Telugu");
    
    // Format list of known disorders from Telangana KB
    const kbListing = (kbDisorders || []).map(d => 
      `- ID: "${d.id}" | Common: "${d.commonName}" | Telugu: "${d.nameTe}" | Type: ${d.type} | Key: ${d.differential || d.symptoms.slice(0, 100)}`
    ).join("\n");

    const ctxStr = `
- Crop: ${crop || "Field crop"}
- Growth stage / days since sowing: ${context?.stage || "Not specified"}
- Affected plant part: ${context?.part || "Leaf"}
- Spread across field: ${context?.spread || "Scattered plants"}
- Recent weather / irrigation: ${context?.weather || "Normal"}
- Recent chemical sprays: ${context?.sprays || "None reported"}
`.trim();

    return `You are a clinical agricultural plant pathologist for Telangana, India (PJTAU standard).
Analyze the attached crop photo(s) using the farmer's field context.

FARMER FIELD CONTEXT:
${ctxStr}

AUTHORITATIVE TELANGANA KNOWLEDGE BASE CANDIDATES FOR THIS CROP:
${kbListing || "No pre-compiled list available for this crop."}

DIAGNOSTIC & HONESTY RULES:
1. Strict candidate limit: up to 3 candidate causes maximum, sorted by likelihood.
2. If the photo is unclear, blurry, too dark, out of focus, does not show a plant, or if you are not confident, set "isUnderstood": false and specify the exact reason in "notSureReason". Do NOT guess or force a diagnosis.
3. For each candidate cause:
   - "id": Match the KB disorder ID from above if it matches, else empty string.
   - "commonName": Standard English name.
   - "nameTe": Telugu name.
   - "scientificName": Causal organism or nutrient classification.
   - "type": Strictly one of "fungal", "bacterial", "viral", "insect", "nutrient", "other".
   - "confidence": Strictly "high", "medium", or "low" (DO NOT use percentage numbers).
   - "symptomsSeen": Exact symptoms visible in the submitted photo(s).
   - "differentialCheck": How to distinguish this from similar pests/diseases.
   - "fieldCheck": What specific physical test or check the farmer must perform in the field to confirm.
4. STRICT SAFETY: DO NOT prescribe chemical pesticide dosages, commercial brand names, or chemical tank mixtures.
5. Language: Provide explanations in ${isTe ? "professional, polite Telugu (వ్యవసాయ పంచాంగ తెలుగు)" : "clear Indian English"}.

OUTPUT FORMAT: Return STRICT JSON ONLY adhering to this JSON schema:
{
  "isUnderstood": true,
  "notSureReason": "",
  "candidates": [
    {
      "id": "paddy_blast",
      "commonName": "Rice Blast",
      "nameTe": "అగ్గితెగులు",
      "scientificName": "Magnaporthe oryzae",
      "type": "fungal",
      "confidence": "high",
      "symptomsSeen": "Spindle-shaped lesions with grey center on leaf blade",
      "differentialCheck": "Brown spot lesions are smaller and circular without tapering ends",
      "fieldCheck": "Look for ash-grey center on leaf spots and examine neck nodes for blackening"
    }
  ],
  "adviceSummary": "Summary notes for the farmer"
}`;
  }

  validateDiagnosisJson(data) {
    if (!data || typeof data !== "object") return false;
    if (typeof data.isUnderstood !== "boolean") return false;
    if (!Array.isArray(data.candidates)) return false;
    if (data.candidates.length > 3) data.candidates = data.candidates.slice(0, 3);

    for (const c of data.candidates) {
      if (!c.commonName || !c.type) return false;
      const validTypes = ["fungal", "bacterial", "viral", "insect", "nutrient", "other"];
      if (!validTypes.includes(String(c.type).toLowerCase())) {
        c.type = "other";
      }
      const validConf = ["high", "medium", "low"];
      if (!validConf.includes(String(c.confidence).toLowerCase())) {
        c.confidence = "medium";
      }
    }
    return true;
  }

  async diagnose({ crop, lang = "en", images = [], context = {}, kbDisorders = [] }) {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    if (!images || images.length === 0) {
      throw new Error("At least one crop photo is required for diagnosis.");
    }

    const cleanImages = images.slice(0, 3).map(img => 
      String(img).replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "").trim()
    ).filter(img => img.length > 50);

    if (cleanImages.length === 0) {
      throw new Error("Invalid or empty image payload.");
    }

    const promptText = this.buildPrompt(crop, lang, context, kbDisorders);
    const discovered = await getAvailableGeminiModels(this.apiKey);

    const candidateModels = [];
    if (process.env.GEMINI_MODEL) {
      candidateModels.push({ id: process.env.GEMINI_MODEL, version: "v1beta" });
      candidateModels.push({ id: process.env.GEMINI_MODEL, version: "v1" });
    }
    discovered.forEach(m => {
      if (!candidateModels.some(c => c.id === m.id && c.version === m.version)) {
        candidateModels.push(m);
      }
    });

    let lastError = null;
    let parsedResult = null;

    // Retry loop: try candidate models, with 1 retry on invalid JSON
    for (const model of candidateModels) {
      const { id: modelName, version } = model;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${this.apiKey}`;
          
          const parts = [{ text: promptText + (attempt === 2 ? "\nCRITICAL: Previous response was invalid JSON. Reply with PURE VALID JSON ONLY." : "") }];
          cleanImages.forEach(img => {
            parts.push({
              inline_data: { mime_type: "image/jpeg", data: img }
            });
          });

          const generationConfig = {
            response_mime_type: "application/json",
            temperature: 0.2
          };

          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": this.apiKey
            },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig
            })
          });

          const jsonRes = await res.json().catch(() => ({}));

          if (!res.ok) {
            const msg = (jsonRes.error && jsonRes.error.message) || `Gemini status ${res.status}`;
            lastError = msg;
            // If 404 or unsupported model, skip attempt 2 and jump to next model
            if (res.status === 404 || res.status === 400 || res.status === 503) break;
            continue;
          }

          const rawText = (jsonRes.candidates?.[0]?.content?.parts || [])
            .map(p => p.text || "")
            .join("")
            .trim();

          if (!rawText) {
            lastError = "Empty response from Gemini model.";
            continue;
          }

          // Strip markdown code fences if present
          const cleanJsonStr = rawText
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

          let parsed = null;
          try {
            parsed = JSON.parse(cleanJsonStr);
          } catch (pe) {
            lastError = `JSON parse failed: ${pe.message}`;
            if (attempt === 1) continue; // retry once
            break;
          }

          if (this.validateDiagnosisJson(parsed)) {
            parsedResult = parsed;
            break;
          } else {
            lastError = "Response did not match required diagnosis schema.";
            if (attempt === 1) continue; // retry once
          }
        } catch (fetchErr) {
          lastError = fetchErr.message;
        }
      }
      if (parsedResult) break;
    }

    if (!parsedResult) {
      throw new Error(lastError || "Could not analyze crop photo with AI model. Please try again or consult local Mandal AEO.");
    }

    return parsedResult;
  }
}

module.exports = GeminiDiagnosisProvider;
