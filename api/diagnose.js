// Vercel serverless function: AI Crop Disease Diagnosis using Google Gemini
const {
  verifyAuthToken,
  getUserSubscription,
  DEMO_MODE_PUBLIC
} = require("./_auth");

let cachedAvailableModels = null;
let lastModelFetch = 0;

/**
 * Dynamically queries Google Generative Language API to discover
 * which exact models are enabled and active for the user's GEMINI_API_KEY.
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
            // Prioritize flash models first, then any other generative models
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

  // Fallback candidate list if ListModels is unavailable
  return [
    { id: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest", version: "v1beta" },
    { id: "gemini-1.5-flash", version: "v1" },
    { id: "gemini-1.5-flash-latest", version: "v1" },
    { id: "gemini-2.0-flash", version: "v1beta" },
    { id: "gemini-2.0-flash-exp", version: "v1beta" },
    { id: "gemini-2.5-flash", version: "v1beta" },
    { id: "gemini-1.5-flash-001", version: "v1beta" },
    { id: "gemini-1.5-flash-002", version: "v1beta" },
    { id: "gemini-1.5-pro", version: "v1" },
    { id: "gemini-1.5-pro", version: "v1beta" }
  ];
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    // 1. Server-side subscription & trial enforcement
    if (!DEMO_MODE_PUBLIC) {
      let token = null;
      try {
        token = await verifyAuthToken(req);
      } catch (authErr) {
        console.warn("Auth token check error:", authErr.message);
      }

      if (!token) {
        return res.status(401).json({
          error: "AUTH_REQUIRED",
          message: "Please sign in with Google to access AI crop disease diagnosis."
        });
      }

      let sub = null;
      try {
        sub = await getUserSubscription(token.uid, token.email, token.name);
      } catch (subErr) {
        console.warn("Subscription check error:", subErr.message);
      }

      if (sub && !sub.hasAccess) {
        return res.status(402).json({
          error: "SUBSCRIPTION_REQUIRED",
          message: "Your 14-day free trial has ended. Please subscribe to unlock AI crop disease diagnosis.",
          status: sub.status
        });
      }
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set in environment" });
    }

    const { crop, lang, image } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: "No crop image provided for diagnosis" });
    }

    // Clean base64 image string
    const cleanImg = String(image).replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "").trim();
    if (cleanImg.length < 50) {
      return res.status(400).json({ error: "Invalid image payload" });
    }

    const isTelugu = (lang === "Telugu" || lang === "te");
    const prompt = `You are an expert agricultural extension pathologist for farmers in Telangana, India (PJTAU standard). The crop is ${crop || "field crop"}.
Look at the attached plant photo and provide an accurate diagnostic assessment.
Reply strictly in ${isTelugu ? "professional, polite Telugu (ప్రామాణిక వ్యవసాయ తెలుగు)" : "clear Indian English"}, using these clear labelled sections:

${isTelugu ? 
`సమస్య / తెగులు నిర్ధారణ: (తెగులు, పురుగు లేదా పోషక లోపం పేరు, మరియు మీ అంచనా ఖచ్చితత్వం)
లక్షణాలు: (ఫోటోలో కనిపించే నిర్దిష్ట ఆకు/మొక్క నష్ట లక్షణాలు)
ఇతర అవకాశాలు: (ఒకటి లేదా రెండు ఇతర సారూప్య తెగుళ్లు లేదా కారణాలు)
సస్యరక్షణ & నివారణ చర్యలు: (ముందుగా సమగ్ర సస్యరక్షణ / సేంద్రీయ పద్ధతులు, ఆపై రసాయన మందుల క్రియాశీల పదార్థాల పేర్లు మరియు మోతాదు PJTAU మార్గదర్శకాల ప్రకారం)
సలహా & సంప్రదింపులు: (స్థానిక మండల వ్యవసాయ విస్తరణ అధికారి లేదా PJTAU శాస్త్రవేత్తను ఎప్పుడు సంప్రదించాలి)`
:
`Likely problem: (disease, pest or nutrient deficiency name, and diagnostic certainty)
What I can see: (the visible leaf/plant symptoms)
Other possibilities: (one or two alternative causes)
What to do now: (Integrated Pest Management: cultural and bio-control first, then recommended chemical active ingredients with PJTAU safety guidance)
When to get help: (when to contact the local Mandal AEO or PJTAU scientist)`
}

If the photo is unclear or not a plant, explain politely and request a closer photo of an affected leaf. Avoid excessive markdown symbols.`;

    // 2. Discover available models for this specific API key
    const discoveredModels = await getAvailableGeminiModels(key);

    // If custom env model is set, prepend it to candidate list
    const candidateList = [];
    if (process.env.GEMINI_MODEL) {
      candidateList.push({ id: process.env.GEMINI_MODEL, version: "v1beta" });
      candidateList.push({ id: process.env.GEMINI_MODEL, version: "v1" });
    }

    discoveredModels.forEach(m => {
      if (!candidateList.some(c => c.id === m.id && c.version === m.version)) {
        candidateList.push(m);
      }
    });

    let lastError = null;
    let diagnosisText = "";

    // 3. Try available models sequentially until one succeeds
    for (const item of candidateList) {
      const { id: modelName, version } = item;
      try {
        const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${key}`;
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inline_data: { mime_type: "image/jpeg", data: cleanImg }
                }
              ]
            }]
          })
        });

        const j = await r.json().catch(() => ({}));
        if (r.ok) {
          diagnosisText = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
          if (diagnosisText) break;
        } else {
          lastError = (j.error && j.error.message) || `Gemini API error (${r.status})`;
          console.warn(`Model ${modelName} on ${version} failed (${r.status}):`, lastError);
          // If 404 (model not found) or 503 (busy) or 400 (unsupported), try next candidate
          if (r.status === 404 || r.status === 503 || r.status === 400) continue;
          break;
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`Fetch error for ${modelName}:`, err.message);
      }
    }

    if (!diagnosisText) {
      return res.status(502).json({ error: lastError || "Failed to analyze photo with Gemini AI" });
    }

    return res.status(200).json({ text: diagnosisText });
  } catch (e) {
    console.error("Diagnose unhandled error:", e);
    return res.status(500).json({ error: String(e.message || e) });
  }
};
