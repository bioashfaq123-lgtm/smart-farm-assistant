// Vercel serverless function: crop disease diagnosis using Google Gemini
const {
  verifyAuthToken,
  getUserSubscription,
  DEMO_MODE_PUBLIC
} = require("./_auth");

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
          message: "Please sign in to access AI crop disease diagnosis."
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

    // Candidate models in priority order with resilient fallback
    const candidateModels = [
      process.env.GEMINI_MODEL,
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ].filter(Boolean);

    // Deduplicate models
    const modelsToTry = [...new Set(candidateModels)];

    let lastError = null;
    let diagnosisText = "";

    for (const modelName of modelsToTry) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: "image/jpeg", data: cleanImg } }
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
          console.warn(`Model ${modelName} failed (${r.status}):`, lastError);
          // If 404 (model not found) or 503 (high demand) or 400 (bad model), try next model
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
