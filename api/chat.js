// Vercel serverless function: "Raithu Mitra" (రైతు మిత్ర) AI Agriculture Assistant.
// Uses Google Gemini with web grounding (tools: [{ google_search: {} }]) and multimodal audio/image support.
// Environment variables: GEMINI_API_KEY (required), GEMINI_MODEL (optional, default: gemini-3.5-flash).

const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_HOUR = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = (ipRateMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_HOUR) {
    ipRateMap.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  ipRateMap.set(ip, timestamps);

  // Periodically clean up old IP entries
  if (ipRateMap.size > 1000) {
    for (const [k, v] of ipRateMap.entries()) {
      const active = v.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) ipRateMap.delete(k);
      else ipRateMap.set(k, active);
    }
  }
  return true;
}

const SYSTEM_INSTRUCTION = `You are "Raithu Mitra" (రైతు మిత్ర), an intelligent, respectful, and caring agricultural extension assistant for farmers in Telangana and across India, created for the Smart Farm Assistant app (aligned with PJTSAU agronomic recommendations).

YOUR CORE RESPONSIBILITIES & RULES:
1. LANGUAGE: Respond in the exact language the farmer uses (Telugu, English, Hindi, etc.). Use simple, warm, everyday farmer-friendly vocabulary. In Telugu, address the farmer respectfully as 'రైతన్నా' (Raithanna) or 'నమస్కారం' (Namaskaram). Keep answers clear, structured, and practical.
2. CONTEXT AWARENESS: If the app provides farm context (selected crop, district, or weather summary), use it to make your answer relevant, but never reveal internal app mechanics.
3. AGRICULTURAL SAFETY GUARDRAILS (CRITICAL):
   - Never generate arbitrary pesticide/fungicide/herbicide tank-mix dose recipes from memory. State active ingredient names only (e.g. Chlorantraniliprole 18.5% SC, Neem oil 1500 ppm).
   - Mandatory spraying instruction: Always state that the farmer must read the exact dosage printed on the product container label and consult their local Mandal Agricultural Extension Officer (AEO) or PJTSAU scientist before spraying.
   - Mandatory PPE warning whenever any chemical spray is mentioned: Always advise wearing a face mask, rubber gloves, boots, and never spraying facing against the wind.
   - Emergency Poisoning: If anyone feels dizzy, nauseous, or has pesticide exposure/ingestion, immediately advise calling 108 and rushing to the nearest Primary Health Centre (PHC) with the chemical container.
   - Banned chemicals: Never recommend banned/restricted agrochemicals (e.g., Monocrotophos on vegetables, Paraquat, Endosulfan).
   - Mandi prices: Remind farmers that APMC mandi rates fluctuate daily and to re-verify live arrival rates on the Mandi tab or eNAM before transport.
4. TONE: Encouraging, scientific yet simple, prioritizing organic/biological and low-cost IPM practices before chemical intervention. Format responses with clean bullet points or short paragraphs for easy reading on mobile screens.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. POST only." });
  }

  const clientIp = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
                   req.socket?.remoteAddress ||
                   "127.0.0.1";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "Hourly limit reached (20 questions/hr). Please wait a while before asking again."
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

    // If primary model experiences a 503 high-demand spike, retry with fallback model
    if (response.status === 503) {
      response = await callGemini(fallbackModel, false);
      data = await response.json().catch(() => ({}));
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
      sources
    });
  } catch (err) {
    return res.status(500).json({ error: "Service temporarily unavailable. Please try again." });
  }
};
