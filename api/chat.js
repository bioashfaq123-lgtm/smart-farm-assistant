// Vercel serverless function: "Krishi Sahayak" (కృషి సహాయక్) AI Agriculture Assistant.
// Uses Google Gemini with web grounding (tools: [{ google_search: {} }]) and multimodal audio/image support.
// Subscription gating: Krishi Sahayak stays free for everyone!
// - Unpaid / expired users & guests: 10 questions/day limit with friendly bilingual prompt & Pay button info.
// - Subscribers / active trial: higher daily limit (50 questions/day).
// - Global daily ceiling to protect Gemini API quota.

const { verifyAuthToken, getUserSubscription, DEMO_MODE_PUBLIC } = require("./_auth");

// In-memory rate limiting structures
const usageRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours rolling
const GUEST_DAILY_LIMIT = 10;
const SUBSCRIBER_DAILY_LIMIT = 60;
const GLOBAL_DAILY_LIMIT = 1200; // Protects Gemini quota
let globalTimestamps = [];

function checkGlobalLimit() {
  const now = Date.now();
  globalTimestamps = globalTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (globalTimestamps.length >= GLOBAL_DAILY_LIMIT) {
    return false;
  }
  globalTimestamps.push(now);
  return true;
}

function checkUserOrIpLimit(key, maxAllowed) {
  const now = Date.now();
  const timestamps = (usageRateMap.get(key) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= maxAllowed) {
    usageRateMap.set(key, timestamps);
    return {
      allowed: false,
      count: timestamps.length,
      limit: maxAllowed
    };
  }
  timestamps.push(now);
  usageRateMap.set(key, timestamps);

  // Periodic cleanup
  if (usageRateMap.size > 2000) {
    for (const [k, v] of usageRateMap.entries()) {
      const active = v.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) usageRateMap.delete(k);
      else usageRateMap.set(k, active);
    }
  }

  return {
    allowed: true,
    count: timestamps.length,
    limit: maxAllowed
  };
}

const SYSTEM_INSTRUCTION = `You are "Krishi Sahayak" (కృషి సహాయక్), an expert, respectful, and caring agricultural extension assistant for farmers in Telangana and across India, created for the Smart Farm Assistant app (aligned with PJTAU agronomic recommendations).

YOUR CORE RESPONSIBILITIES & LANGUAGE RULES:

1. LANGUAGE REQUIREMENTS (STRICT):
   A. WHEN SPEAKING TELUGU (వృత్తిపరమైన ప్రామాణిక వ్యవసాయ తెలుగు - PROFESSIONAL TELUGU):
      - You MUST speak in RESPECTFUL, PROFESSIONAL, AND POLITE STANDARD AGRICULTURAL TELUGU (ప్రామాణిక మరియు వృత్తిపరమైన తెలుగు భాష) as officially used by Professor Jayashankar Telangana State Agricultural University (PJTAU), Agricultural Extension Officers (AEOs), and Krishi Vigyan Kendras (KVKs).
      - Greet respectfully and warmly: "నమస్కారం రైతన్న గారూ!", "రైతు సోదరులకు నమస్కారం!", or "నమస్కారం!".
      - Tone: Professional, courteous, encouraging, and clear. Speak like a knowledgeable university agricultural scientist / extension officer advising a farmer.
      - DO NOT use heavy local street slang (STRICTLY AVOID words like "ఫికర్ చేయకురి", "చూస్కోరి", "జెయ్యురి", "దావఖాన", "సక్కంగ", "మస్తు", "కొట్టురి", "పోతది").
      - Use standard professional agricultural expressions:
        * Use "ఆందోళన చెందవద్దు" or "కంగారు పడవలసిన అవసరం లేదు" (instead of "ఫికర్ చేయకురి").
        * Use "ఎలా గుర్తించాలి" and "ఎలా నివారించాలి / ఎలా నియంత్రించాలి" (clear, professional phrasing).
        * Use "గమనించండి", "పరిశీలించండి" (instead of "చూస్కోరి").
        * Use respectful imperatives: "పిచికారీ చేయండి", "వాడండి", "వేయండి", "కలపండి".
        * Use "సరిగ్గా" or "సక్రమంగా" (instead of "సక్కంగ").
        * Use standard verbal forms: "అవుతుంది", "వస్తుంది", "చేస్తుంది", "ఉంటుంది".
        * Refer to medical facilities respectfully as "ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) / సమీప ఆసుపత్రి" (instead of "సర్కారు దావఖాన").
      - Use official PJTAU agronomic terminology:
        * పంట (crop), చేను / పొలం (farm field), దుక్కి (land prep), విత్తన శుద్ధి (seed treatment), దఫాలు (splits/intervals).
        * దశలు: పిలక దశ (tillering), చిరుపొట్ట దశ (panicle initiation), పూత దశ (flowering), గింజ పాలుపోసుకునే దశ (milking stage), కోత దశ (harvest).
        * ఎరువులు: ప్రాథమిక మోతాదు (basal dose), పైపాటు ఎరువు (top-dressing).
        * సస్యరక్షణ: తెగుళ్లు (diseases), చీడపీడలు (pests), సేంద్రీయ / జీవ నియంత్రణ (biological control), రసాయన మందులు (chemical pesticides).
      - Ensure high readability: structure answers with bold headings, clear bullet points, and neat paragraphs without markdown clutter.

   B. WHEN SPEAKING ENGLISH (INDIAN ENGLISH):
      - You MUST speak in NATURAL, COURTEOUS INDIAN ENGLISH as used in Indian agricultural universities (PJTAU, ICAR) and extension services.
      - Greet respectfully: "Namaste Raithanna!", "Namaskaram Raithanna!", or "Hello Raithanna!".
      - Use familiar Indian agronomic vocabulary naturally:
        * "Kharif", "Rabi", "basal application", "top-dressing", "tillering stage", "panicle initiation", "flowering stage", "boll stage", "earhead stage".
        * "Acre", "guntha", "hectare", "quintal", "bags of 50 kg".
        * "Urea", "DAP", "MOP", "SSP", "farmyard manure (FYM)", "neem cake".
        * "Mandi / APMC yard rates", "modal rate", "MSP", "borewell irrigation".
      - Tone: Warm, respectful, clear, structured in easy-to-read bullet points.
      - Avoid Western slang or idioms (no "howdy", "heads up", "y'all", "ballpark"). Use polite Indian English phrasing ("Kindly note", "Please follow", "Do not worry Raithanna").

2. CONTEXT AWARENESS:
   If the app provides farm context (selected crop, district, or weather summary), tailor your answer to that Telangana district and crop without exposing internal app code.

3. AGRICULTURAL SAFETY GUARDRAILS (CRITICAL):
   - Never generate arbitrary pesticide/fungicide/herbicide tank-mix dose recipes from memory. State active ingredient names only (e.g. Chlorantraniliprole 18.5% SC, Neem oil 1500 ppm).
   - Mandatory spraying instruction: Always state that the farmer must read the exact dosage printed on the product container label and consult their local Mandal Agricultural Extension Officer (AEO) or PJTAU scientist before spraying.
   - Mandatory PPE warning whenever any chemical spray is mentioned: Always advise wearing a face mask, rubber gloves, boots, and never spraying facing against the wind.
   - Emergency Poisoning: If anyone feels dizzy, nauseous, or has pesticide exposure/ingestion, immediately advise calling 108 and rushing to the nearest Primary Health Centre (PHC) / దావఖాన with the chemical container.
   - Banned chemicals: Never recommend banned/restricted agrochemicals (e.g., Monocrotophos on vegetables, Paraquat, Endosulfan).
   - Mandi prices: Remind farmers that APMC mandi rates fluctuate daily and to re-verify live arrival rates on the Mandi tab or eNAM before transport.

4. FORMAT:
   Use short, easily readable bullet points or crisp paragraphs that look great and read clearly on a farmer's mobile screen. Prioritize organic, bio-control, and low-cost Integrated Pest Management (IPM) before chemical intervention.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. POST only." });
  }

  // 1. Check Global Server Quota Ceiling
  if (!checkGlobalLimit()) {
    return res.status(429).json({
      error: "Service is currently experiencing high daily volume across the platform. Please check back shortly.",
      globalLimitReached: true
    });
  }

  // 2. Identify User & Determine Subscription Tier
  let userSub = null;
  let rateKey = "";
  let maxQuestions = GUEST_DAILY_LIMIT;
  let isSubscriber = false;

  const clientIp = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
                   req.socket?.remoteAddress ||
                   "127.0.0.1";

  try {
    const token = await verifyAuthToken(req);
    if (token) {
      userSub = await getUserSubscription(token.uid, token.email, token.name);
      rateKey = `usr_${token.uid}`;
      isSubscriber = userSub && userSub.hasAccess;
      maxQuestions = isSubscriber ? SUBSCRIBER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
    } else {
      rateKey = `ip_${clientIp}`;
      maxQuestions = DEMO_MODE_PUBLIC ? SUBSCRIBER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
    }
  } catch (err) {
    rateKey = `ip_${clientIp}`;
    maxQuestions = GUEST_DAILY_LIMIT;
  }

  // 3. Apply Tiered Rate Limit
  const rateResult = checkUserOrIpLimit(rateKey, maxQuestions);
  if (!rateResult.allowed) {
    return res.status(429).json({
      error: "DAILY_LIMIT_REACHED",
      limitReached: true,
      canUpgrade: !isSubscriber,
      remaining: 0,
      limit: maxQuestions,
      message: isSubscriber
        ? "You have reached your daily limit of questions. Please return tomorrow."
        : "You have reached the free daily limit of 10 questions for Krishi Sahayak. Subscribe to the 6-month plan (Rs 499) for unlimited questions and full app access!",
      message_te: isSubscriber
        ? "మీరు ఈ రోజు ప్రశ్నల పరిమితిని చేరుకున్నారు. దయచేసి రేపు మళ్లీ అడగండి."
        : "మీరు కృషి సహాయక్ ఉచిత 10 ప్రశ్నల రోజువారీ పరిమితిని చేరుకున్నారు. అపరిమిత ప్రశ్నలు మరియు అన్ని ఫీచర్ల కోసం 6 నెలల ప్లాన్ (₹499) పొందండి!"
    });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured on server." });
    }

    const {
      message = "",
      history = [],
      image,
      audio,
      audioMime = "audio/webm",
      context = {}
    } = req.body || {};

    const cleanMessage = String(message || "").trim();
    if (!cleanMessage && !image && !audio) {
      return res.status(400).json({ error: "Please enter a question, record audio, or attach a photo." });
    }
    if (cleanMessage.length > 1000) {
      return res.status(400).json({ error: "Question is too long (maximum 1000 characters)." });
    }

    // Build context prefix if non-sensitive agricultural context is provided
    let contextNote = "";
    if (context.crop || context.district || context.weatherSummary) {
      const parts = [];
      if (context.crop) parts.push(`Crop: ${context.crop}`);
      if (context.district) parts.push(`District: ${context.district}, Telangana`);
      if (context.weatherSummary) parts.push(`Weather: ${context.weatherSummary}`);
      contextNote = `[Current Farm Context: ${parts.join(" | ")}]\n\n`;
    }

    // Build contents array for Gemini
    const contents = [];

    // Add conversation history (up to last 6 messages / 3 turns)
    const sanitizedHistory = Array.isArray(history) ? history.slice(-6) : [];
    for (const h of sanitizedHistory) {
      if (h && (h.role === "user" || h.role === "model") && typeof h.text === "string" && h.text.trim()) {
        contents.push({
          role: h.role,
          parts: [{ text: h.text.trim().substring(0, 1000) }]
        });
      }
    }

    // Prepare current user turn parts
    const currentParts = [];
    const promptText = contextNote + (cleanMessage || (audio ? "Please listen to this voice message from a farmer and answer their question." : "Please inspect this crop photo and advise the farmer."));
    currentParts.push({ text: promptText });

    // Handle photo attachment (base64 string without data URL prefix)
    if (image && typeof image === "string") {
      const cleanImg = image.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
      if (cleanImg.length < 5 * 1024 * 1024) {
        currentParts.push({
          inline_data: { mime_type: "image/jpeg", data: cleanImg }
        });
      }
    }

    // Handle voice message attachment (base64 string without data URL prefix)
    if (audio && typeof audio === "string") {
      const cleanAudio = audio.replace(/^data:audio\/[a-zA-Z0-9+.-]+;base64,/, "");
      if (cleanAudio.length < 5 * 1024 * 1024) {
        currentParts.push({
          inline_data: { mime_type: audioMime || "audio/webm", data: cleanAudio }
        });
      }
    }

    contents.push({ role: "user", parts: currentParts });

    // Model selection with fallback
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const fallbackModel = "gemini-3.5-flash-lite";

    async function callGemini(modelName, withGrounding = true) {
      const bodyPayload = {
        contents,
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }
      };
      if (withGrounding) {
        bodyPayload.tools = [{ google_search: {} }];
      }

      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key
        },
        body: JSON.stringify(bodyPayload)
      });
      return r;
    }

    // Attempt 1: Primary model with search grounding
    let response = await callGemini(primaryModel, true);
    let data = await response.json().catch(() => ({}));

    // If grounding quota is exhausted (429) or tool not supported, retry without grounding
    if (response.status === 429 && data.error?.message?.toLowerCase().includes("quota")) {
      response = await callGemini(primaryModel, false);
      data = await response.json().catch(() => ({}));
    }

    // If primary model experiences a 404 (model not found) or 503 (high demand), retry with fallback models
    if (!response.ok && (response.status === 404 || response.status === 503)) {
      const fallbacks = [fallbackModel, "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
      for (const fb of fallbacks) {
        response = await callGemini(fb, false);
        data = await response.json().catch(() => ({}));
        if (response.ok) break;
      }
    }

    if (!response.ok) {
      const errMsg = data.error?.message || `API error (${response.status})`;
      return res.status(502).json({ error: errMsg });
    }

    const candidate = data.candidates?.[0];
    const text = (candidate?.content?.parts || []).map(p => p.text || "").join("").trim();

    // Extract grounding sources if available
    const sources = [];
    const chunks = candidate?.groundingMetadata?.groundingChunks || [];
    const seenUris = new Set();
    for (const chunk of chunks) {
      const uri = chunk.web?.uri;
      const title = chunk.web?.title || uri;
      if (uri && !seenUris.has(uri)) {
        seenUris.add(uri);
        sources.push({ title, uri });
        if (sources.length >= 4) break;
      }
    }

    return res.status(200).json({
      text: text || "నమస్కారం! మీ ప్రశ్నను మరొకసారి అడగగలరా? (Could you please repeat your question?)",
      sources,
      questionsUsedToday: rateResult.count,
      questionsDailyLimit: maxQuestions,
      isSubscriber
    });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Service temporarily unavailable. Please try again." });
  }
};
