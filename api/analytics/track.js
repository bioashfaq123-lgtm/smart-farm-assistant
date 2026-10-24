// Serverless endpoint to track pageviews and live active sessions
const { getFirebaseAdmin } = (() => {
  try {
    return require("../_auth");
  } catch {
    return { getFirebaseAdmin: () => null };
  }
})();

module.exports = async function handler(req, res) {
  // CORS support
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { path = "/", device = "Mobile", sessionId, visitorId } = body;

    const adm = getFirebaseAdmin();
    if (adm) {
      try {
        const db = adm.database();
        const now = Date.now();
        // Record active session ping (last seen within 5 minutes)
        if (sessionId) {
          const cleanSessionId = String(sessionId).replace(/[.#$\[\]\/]/g, "_");
          await db.ref(`analytics/active_sessions/${cleanSessionId}`).set({
            path,
            device,
            visitorId: visitorId || "anon",
            lastSeen: now,
          });
        }

        // Increment total pageview counter
        await db.ref("analytics/counters/total_pageviews").transaction((current) => (current || 0) + 1);
      } catch (dbErr) {
        console.warn("Analytics DB write warning:", dbErr.message);
      }
    }

    return res.status(200).json({ ok: true, timestamp: Date.now() });
  } catch (err) {
    console.error("Analytics track error:", err);
    return res.status(200).json({ ok: true, fallback: true });
  }
};
