// api/tts.js - High Quality Native Text-to-Speech Streaming (Telugu & Indian English)
const ttsCache = new Map();
const MAX_CACHE = 150;

function chunkText(str, maxLen = 140) {
  const rawSentences = str.split(/(?<=[.!?।\n])\s+/);
  const chunks = [];
  let current = "";
  for (const s of rawSentences) {
    if ((current + " " + s).trim().length <= maxLen) {
      current = (current + " " + s).trim();
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxLen) {
        current = s;
      } else {
        const words = s.split(/\s+/);
        let wChunk = "";
        for (const w of words) {
          if ((wChunk + " " + w).trim().length <= maxLen) {
            wChunk = (wChunk + " " + w).trim();
          } else {
            if (wChunk) chunks.push(wChunk);
            wChunk = w;
          }
        }
        current = wChunk;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter(c => c.length > 0);
}

async function fetchMp3Chunk(text, lang) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Referer": "https://translate.google.com/"
    }
  });

  if (!res.ok) {
    throw new Error(`TTS upstream returned status ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = async (req, res) => {
  let text = "";
  let lang = "";

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch(e){}
    }
    text = (body && body.text) || "";
    lang = (body && body.lang) || "";
  } else if (req.method === "GET") {
    text = (req.query && req.query.text) || "";
    lang = (req.query && req.query.lang) || "";
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Clean text of markdown, URLs, symbols, brackets
  const clean = String(text || "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#`~[\]()]/g, " ")
    .replace(/[-–—]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);

  if (!clean) {
    return res.status(400).json({ error: "No text provided" });
  }

  // Automatic script detection: if text contains Telugu unicode, force Telugu language
  const isTelugu = /[\u0C00-\u0C7F]/.test(clean);
  const targetLang = (lang === "te" || isTelugu) ? "te" : "en";

  const cacheKey = `${targetLang}:${clean}`;
  if (ttsCache.has(cacheKey)) {
    const cachedBuf = ttsCache.get(cacheKey);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", cachedBuf.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.end(cachedBuf);
  }

  try {
    const chunks = chunkText(clean, 140);
    if (!chunks.length) {
      return res.status(400).json({ error: "Empty chunks" });
    }

    // Limit to max 12 chunks to avoid long delays
    const activeChunks = chunks.slice(0, 12);
    const mp3Buffers = await Promise.all(activeChunks.map(c => fetchMp3Chunk(c, targetLang)));
    const totalMp3 = Buffer.concat(mp3Buffers);

    if (ttsCache.size > MAX_CACHE) {
      const firstKey = ttsCache.keys().next().value;
      ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, totalMp3);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", totalMp3.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.end(totalMp3);

  } catch (err) {
    console.error("TTS generation error:", err);
    return res.status(500).json({ error: "Failed to synthesize speech: " + err.message });
  }
};
