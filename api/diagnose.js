// Vercel serverless function: crop disease diagnosis using Google Gemini (free tier available).
// Set GEMINI_API_KEY in Vercel > Project > Settings > Environment Variables. Optional: GEMINI_MODEL.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    const { crop, lang, image } = req.body || {};
    if (!image) return res.status(400).json({ error: "no image" });
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const prompt = `You are an agricultural extension assistant for farmers in Telangana, India. The crop is ${crop}. Look at the attached photo and reply in ${lang || "English"}, in plain text with no markdown or asterisks, using these labelled lines:
Likely problem: (disease, pest or nutrient disorder, and how sure you are)
What I can see: (the visible symptoms)
Other possibilities: (one or two)
What to do now: (practical steps, cultural and low-cost first, then chemical options by active ingredient only, with a caution to follow the label)
When to get help: (when to contact the local extension officer)
If the photo is unclear or not a plant, say so and ask for a clearer photo.`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: image } }] }] })
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: (j.error && j.error.message) || "Gemini error" });
    const text = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
    res.status(200).json({ text: text || "No answer returned." });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
