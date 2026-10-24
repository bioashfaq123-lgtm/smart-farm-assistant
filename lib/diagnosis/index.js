const {
  loadKnowledgeBase,
  getSupportedCrops,
  getCropDisorders,
  enrichCandidate
} = require("./knowledgeBase");
const { checkRateLimit } = require("./rateLimiter");
const GeminiDiagnosisProvider = require("./adapters/geminiProvider");

// Registry of pluggable diagnosis providers
const providers = {
  gemini: new GeminiDiagnosisProvider()
};

function getProvider(name = "gemini") {
  const p = providers[name.toLowerCase()];
  if (!p) {
    throw new Error(`Unsupported diagnosis provider: ${name}`);
  }
  return p;
}

/**
 * Main diagnosis service orchestrator
 */
async function diagnoseCropPhoto({
  crop,
  lang = "en",
  images = [],
  context = {},
  providerName = "gemini",
  ip = "anonymous",
  userId = null
}) {
  // 1. Rate Limiting Check
  const rateLimitResult = checkRateLimit(ip, userId);
  if (!rateLimitResult.allowed) {
    const isTe = (lang === "te" || lang === "Telugu");
    return {
      status: rateLimitResult.status,
      success: false,
      error: "RATE_LIMITED",
      message: isTe ? rateLimitResult.messageTe : rateLimitResult.messageEn,
      resetSeconds: rateLimitResult.resetSeconds
    };
  }

  // 2. Validate Crop Support
  const supportedCrops = getSupportedCrops();
  const normalizedCrop = supportedCrops.find(
    c => c.toLowerCase() === String(crop || "").trim().toLowerCase()
  );

  if (!normalizedCrop) {
    const isTe = (lang === "te" || lang === "Telugu");
    return {
      status: 200,
      success: true,
      result: {
        isUnderstood: false,
        crop: crop || "Unknown",
        confidence: "low",
        notSureReason: isTe
          ? `ఈ పంట (${crop || "పేరు నమోదు కాలేదు"}) ప్రస్తుతం ధ్రువీకరించబడిన డేటాబేస్‌లో లేదు. ధ్రువీకరించబడిన పంటలు: ${supportedCrops.join(", ")}. సరైన సలహా కోసం మీ మండల వ్యవసాయ విస్తరణ అధికారి (AEO) లేదా PJTAU శాస్త్రవేత్తను సంప్రదించండి.`
          : `The crop "${crop || "unspecified"}" is not in our validated PJTAU crop list. Supported crops are: ${supportedCrops.join(", ")}. Please consult your local Mandal Agricultural Extension Officer (AEO).`,
        candidates: [],
        adviceSummary: isTe
          ? "ధ్రువీకరించని పంటలకు తప్పుడు మందులు పిచికారీ చేయవద్దు. స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి."
          : "Do not apply chemical sprays without confirmed diagnosis from your local Mandal AEO."
      }
    };
  }

  // 3. Retrieve KB Disorders for Context Grounding
  const kbDisorders = getCropDisorders(normalizedCrop);

  // 4. Execute Pluggable Provider
  const provider = getProvider(providerName);
  const rawDiagnosis = await provider.diagnose({
    crop: normalizedCrop,
    lang,
    images,
    context,
    kbDisorders
  });

  // 5. Handle Model "Not Sure" / Low Quality Cases
  if (!rawDiagnosis.isUnderstood || !rawDiagnosis.candidates || rawDiagnosis.candidates.length === 0) {
    const isTe = (lang === "te" || lang === "Telugu");
    return {
      status: 200,
      success: true,
      result: {
        isUnderstood: false,
        crop: normalizedCrop,
        confidence: "low",
        notSureReason: rawDiagnosis.notSureReason || (
          isTe
            ? "ఫోటో నాణ్యత సరిపోలేదు లేదా ఆకుపై లక్షణాలు స్పష్టంగా లేవు. దయచేసి మంచి వెలుతురులో మరొక స్పష్టమైన ఫోటో తీయండి, లేదా మీ మండల వ్యవసాయ విస్తరణ అధికారి (AEO) కి చూపించండి."
            : "The photo appears unclear or symptoms are ambiguous. Please take a clear close-up in natural daylight or consult your Mandal Agricultural Extension Officer."
        ),
        candidates: [],
        adviceSummary: rawDiagnosis.adviceSummary || (
          isTe
            ? "ఖచ్చితమైన నిర్ధారణ లేకుండా ఎటువంటి క్రిమిసంహారక మందులు పిచికారీ చేయవద్దు."
            : "Do not apply chemical pesticides until confirmed by an agricultural extension officer."
        )
      }
    };
  }

  // 6. Enrich Candidates with Strictly KB-Ground Management
  const enrichedCandidates = rawDiagnosis.candidates.slice(0, 3).map(c => 
    enrichCandidate(normalizedCrop, c)
  );

  // 7. Check Overall Diagnostic Confidence
  const topCandidate = enrichedCandidates[0];
  const overallConfidence = topCandidate ? topCandidate.confidence : "low";

  return {
    status: 200,
    success: true,
    result: {
      isUnderstood: true,
      crop: normalizedCrop,
      confidence: overallConfidence,
      topCandidate,
      candidates: enrichedCandidates,
      adviceSummary: rawDiagnosis.adviceSummary || "",
      followUpNote: lang === "te"
        ? "గమనిక: పిచికారీ చేసే ముందు లేబుల్ సూచనలను పరిశీలించండి. 3 రోజుల తర్వాత మీ పొలాన్ని మళ్ళీ పరిశీలించండి."
        : "Follow-up note: Check field again in 3 days to monitor response.",
      disclaimer: "All management advice is formulated according to PJTAU & ICAR guidelines. Chemical recommendations mention active ingredient groups only; no specific commercial brands or tank mixtures are prescribed. Always follow CIB&RC statutory label directions and wear PPE."
    }
  };
}

module.exports = {
  diagnoseCropPhoto,
  getProvider,
  getSupportedCrops
};
