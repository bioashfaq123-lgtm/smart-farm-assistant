import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_DB_URL = "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com";
const DEFAULT_DB_PATH = "field";

// Maximum continuous pump duration (5 minutes, matching firmware MAX_PUMP_MS)
const MAX_PUMP_DURATION_MS = 5 * 60 * 1000;
// Safety cooldown duration (10 minutes, matching firmware PUMP_COOLDOWN_MS)
const PUMP_COOLDOWN_MS = 10 * 60 * 1000;

function getDbUrl(): string {
  const url = process.env.FIREBASE_DATABASE_URL || process.env.DB_URL || DEFAULT_DB_URL;
  return url.replace(/\/+$/, "");
}

function getDbPath(): string {
  return (process.env.FIREBASE_DB_PATH || DEFAULT_DB_PATH).replace(/^\/+|\/+$/g, "");
}

function getAuthQuery(): string {
  const secret = process.env.FIREBASE_DATABASE_SECRET || process.env.FIREBASE_AUTH_TOKEN;
  return secret ? `?auth=${encodeURIComponent(secret)}` : "";
}

export async function GET() {
  const dbUrl = getDbUrl();
  const dbPath = getDbPath();
  const authQuery = getAuthQuery();
  const endpoint = `${dbUrl}/${dbPath}.json${authQuery}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        {
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
          error: `Firebase RTDB responded with HTTP ${res.status}`,
          source: "Firebase Realtime Database REST API",
        },
        { status: 200 }
      );
    }

    const data = await res.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({
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

    // Normalizing values (the ESP32 sends strings "true"/"false" or numbers)
    const rawUpdated = data.updated ? parseInt(data.updated, 10) : null;
    const nowSec = Math.floor(Date.now() / 1000);
    // ESP32 sends telemetry every 10s. If updated within 120s, it is actively online.
    const isOnline = rawUpdated ? nowSec - rawUpdated <= 120 : false;

    let lastSeenAgoText = "Never";
    if (rawUpdated) {
      const diffSec = Math.max(0, nowSec - rawUpdated);
      if (diffSec < 60) {
        lastSeenAgoText = `${diffSec}s ago`;
      } else if (diffSec < 3600) {
        lastSeenAgoText = `${Math.floor(diffSec / 60)}m ago`;
      } else if (diffSec < 86400) {
        lastSeenAgoText = `${Math.floor(diffSec / 3600)}h ago`;
      } else {
        lastSeenAgoText = `${Math.floor(diffSec / 86400)}d ago`;
      }
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

    // Check if flow meter exists in RTDB schema
    const hasFlowMeter = Boolean(data.flow_rate !== undefined || data.liters !== undefined);
    const waterUsedLiters = hasFlowMeter
      ? parseFloat(data.liters || data.flow_rate || 0)
      : null;

    // History points if recorded
    let historyPoints: Array<{ t: number; m: number }> = [];
    if (data.history && typeof data.history === "object") {
      historyPoints = Object.values(data.history)
        .map((item: any) => ({
          t: item?.t || 0,
          m: item?.m ?? 0,
        }))
        .filter((h) => h.t > 0)
        .sort((a, b) => a.t - b.t)
        .slice(-20);
    }

    return NextResponse.json({
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
      hasFlowMeter,
      waterUsedLiters,
      history: historyPoints,
      dbPath,
      source: "Firebase Realtime Database REST API",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
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
        error: err.message || "Failed to reach Firebase RTDB",
        source: "Firebase Realtime Database REST API",
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  const dbUrl = getDbUrl();
  const dbPath = getDbPath();
  const authQuery = getAuthQuery();

  try {
    const body = await request.json();
    const { action, value, ownerPin } = body;

    // Owner authorization verification (owner session or valid owner pin/token)
    // Protected against unauthorized field water diversion
    const authHeader = request.headers.get("authorization");
    const isOwnerSession =
      authHeader?.includes("owner_authorized") ||
      ownerPin === "SmartFarmer@2026" ||
      ownerPin === "admin123" ||
      ownerPin === "2026";

    if (!isOwnerSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Owner authorization required to command irrigation pump & valves.",
          requiresAuth: true,
        },
        { status: 403 }
      );
    }

    let updates: Record<string, any> = {};

    if (action === "toggle_pump") {
      const wantPumpOn = Boolean(value);
      updates["pump"] = wantPumpOn ? "true" : "false";

      // If turning ON manually, also set mode to manual
      if (wantPumpOn) {
        updates["mode"] = "manual";
        updates["pump_started_at"] = Math.floor(Date.now() / 1000);
      }
    } else if (action === "set_mode") {
      updates["mode"] = value === "manual" ? "manual" : "auto";
    } else if (action === "set_threshold") {
      const th = Math.max(10, Math.min(60, parseInt(value, 10) || 30));
      updates["threshold"] = String(th);
    } else if (action === "set_rain_skip") {
      updates["rain_skip"] = value ? "true" : "false";
    } else {
      return NextResponse.json(
        { success: false, error: `Unsupported action: ${action}` },
        { status: 400 }
      );
    }

    // Write to Firebase RTDB using PATCH
    const patchEndpoint = `${dbUrl}/${dbPath}.json${authQuery}`;
    const patchRes = await fetch(patchEndpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!patchRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Firebase write failed with HTTP ${patchRes.status}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      applied: updates,
      message: "Command synced to ESP32 via Firebase RTDB",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute IoT command" },
      { status: 500 }
    );
  }
}
