// Vercel serverless function for ESP32 IoT telemetry proxy to Firebase Realtime Database
const DEFAULT_DB_URL = "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com";
const DEFAULT_DB_PATH = "field";

module.exports = async (req, res) => {
  const dbUrl = (process.env.FIREBASE_DATABASE_URL || process.env.DB_URL || DEFAULT_DB_URL).replace(/\/+$/, "");
  const dbPath = (process.env.FIREBASE_DB_PATH || DEFAULT_DB_PATH).replace(/^\/+|\/+$/g, "");
  const authSecret = process.env.FIREBASE_DATABASE_SECRET || process.env.FIREBASE_AUTH_TOKEN;
  const authQuery = authSecret ? `?auth=${encodeURIComponent(authSecret)}` : "";
  const endpoint = `${dbUrl}/${dbPath}.json${authQuery}`;

  if (req.method === "GET") {
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        return res.status(200).json({
          isConfigured: true,
          isOnline: false,
          lastSeen: null,
          lastSeenAgoText: "Database unreachable",
          moisture: null,
          pump: false,
          pumpState: false,
          mode: "auto",
          threshold: 30,
          rainSkip: false,
          hasFlowMeter: false,
          waterUsedLiters: null,
          source: "Firebase Realtime Database REST API",
        });
      }

      const data = await response.json();
      if (!data || typeof data !== "object") {
        return res.status(200).json({
          isConfigured: true,
          isOnline: false,
          lastSeen: null,
          lastSeenAgoText: "No telemetry data yet",
          moisture: null,
          pump: false,
          pumpState: false,
          mode: "auto",
          threshold: 30,
          rainSkip: false,
          hasFlowMeter: false,
          waterUsedLiters: null,
          source: "Firebase Realtime Database REST API",
        });
      }

      const nowMs = Date.now();
      const rawUpdated = data.updated ? parseInt(data.updated, 10) : null;
      // Handle both ms timestamps (13 digits) and seconds timestamps (10 digits)
      const updatedMs = data.updated_ms
        ? parseInt(data.updated_ms, 10)
        : rawUpdated
        ? rawUpdated > 10000000000
          ? rawUpdated
          : rawUpdated * 1000
        : null;

      const diffSec = updatedMs ? Math.round(Math.abs(nowMs - updatedMs) / 1000) : null;
      // Online if pinged within last 180s, or if moisture data exists and was updated within 15 mins
      const isOnline = diffSec !== null
        ? diffSec <= 180
        : (data.moisture !== undefined && data.moisture !== null);

      let lastSeenAgoText = "Never";
      if (diffSec !== null) {
        if (diffSec < 60) lastSeenAgoText = `${diffSec}s ago`;
        else if (diffSec < 3600) lastSeenAgoText = `${Math.floor(diffSec / 60)}m ago`;
        else lastSeenAgoText = `${Math.floor(diffSec / 3600)}h ago`;
      } else if (isOnline) {
        lastSeenAgoText = "Live";
      }

      const moisture =
        data.moisture !== undefined && data.moisture !== null
          ? typeof data.moisture === "number"
            ? data.moisture
            : parseFloat(data.moisture) || null
          : null;

      const pump = data.pump === true || data.pump === "true";
      const pumpState = data.pump_state === true || data.pump_state === "true";
      const rainSkip = data.rain_skip === true || data.rain_skip === "true";
      const mode = data.mode === "manual" ? "manual" : "auto";
      const threshold = parseInt(data.threshold, 10) || 30;

      return res.status(200).json({
        isConfigured: true,
        isOnline,
        lastSeen: rawUpdated,
        lastSeenAgoText: isOnline ? "Online (Live ping)" : `Offline (${lastSeenAgoText})`,
        moisture,
        pump,
        pumpState,
        mode,
        threshold,
        rainSkip,
        hasFlowMeter: false,
        waterUsedLiters: null,
        history: [],
        dbPath,
        source: "Firebase Realtime Database REST API",
      });
    } catch (err) {
      return res.status(200).json({
        isConfigured: true,
        isOnline: false,
        lastSeen: null,
        lastSeenAgoText: "Connection error",
        moisture: null,
        pump: false,
        pumpState: false,
        mode: "auto",
        threshold: 30,
        rainSkip: false,
        hasFlowMeter: false,
        waterUsedLiters: null,
        source: "Firebase Realtime Database REST API",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { action, value } = req.body || {};
      let updates = {};

      if (action === "toggle_pump") {
        updates["pump"] = Boolean(value) ? "true" : "false";
        if (Boolean(value)) {
          updates["mode"] = "manual";
        }
      } else if (action === "set_mode") {
        updates["mode"] = value === "manual" ? "manual" : "auto";
      } else if (action === "set_threshold") {
        updates["threshold"] = parseInt(value, 10) || 30;
      } else if (action === "set_rain_skip") {
        updates["rain_skip"] = Boolean(value) ? "true" : "false";
      }

      const patchRes = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!patchRes.ok) {
        return res.status(502).json({ success: false, error: "Failed to update Firebase RTDB" });
      }

      return res.status(200).json({ success: true, updates });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
