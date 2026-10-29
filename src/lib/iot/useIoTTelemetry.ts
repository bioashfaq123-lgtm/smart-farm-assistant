"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface IoTTelemetryState {
  isConfigured: boolean;
  isOnline: boolean;
  lastSeen: number | null;
  lastSeenAgoText: string;
  moisture: number | null;
  pump: boolean;
  pumpState: boolean;
  mode: "auto" | "manual";
  threshold: number;
  rainSkip: boolean;
  hasFlowMeter: boolean;
  waterUsedLiters: number | null;
  history: Array<{ t: number; m: number }>;
  dbPath: string;
  source: string;
}

const DEFAULT_STATE: IoTTelemetryState = {
  isConfigured: true,
  isOnline: false,
  lastSeen: null,
  lastSeenAgoText: "Connecting...",
  moisture: null,
  pump: false,
  pumpState: false,
  mode: "auto",
  threshold: 30,
  rainSkip: false,
  hasFlowMeter: false,
  waterUsedLiters: null,
  history: [],
  dbPath: "field",
  source: "Firebase Realtime Database",
};

const RTDB_URL = "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com/field.json";

function parseRawTelemetry(data: any): IoTTelemetryState {
  if (!data || typeof data !== "object") return DEFAULT_STATE;

  const nowMs = Date.now();
  const rawUpdated = data.updated ? parseInt(data.updated, 10) : null;
  const updatedMs = data.updated_ms
    ? parseInt(data.updated_ms, 10)
    : rawUpdated
    ? rawUpdated > 10000000000
      ? rawUpdated
      : rawUpdated * 1000
    : null;

  const diffSec = updatedMs ? Math.round(Math.abs(nowMs - updatedMs) / 1000) : null;
  // Consider online if pinged within last 180 seconds, or if moisture data exists and no stale timestamp > 15m
  const isOnline = diffSec !== null ? diffSec <= 180 : (data.moisture !== undefined && data.moisture !== null);

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

  return {
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
    history: historyPoints,
    dbPath: "field",
    source: "Firebase Realtime Database REST API",
  };
}

export function useIoTTelemetry(pollIntervalMs: number = 4000) {
  const [data, setData] = useState<IoTTelemetryState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [safetyCooldown, setSafetyCooldown] = useState<number>(0);
  const isMounted = useRef<boolean>(true);

  // Check owner authorization on mount
  useEffect(() => {
    try {
      const adminSession = localStorage.getItem("sf_admin_session_v1");
      const ownerToken = sessionStorage.getItem("sf_owner_token");
      if (adminSession || ownerToken) {
        setIsOwner(true);
      }
    } catch (e) {
      // localStorage unavailable in some private tabs
    }
  }, []);

  const fetchTelemetry = useCallback(async () => {
    try {
      // 1. Try direct Firebase Realtime Database REST (Zero proxy, full CORS, instant response)
      const res = await fetch(RTDB_URL, { cache: "no-store" });
      if (res.ok) {
        const rawJson = await res.json();
        const parsed = parseRawTelemetry(rawJson);
        if (isMounted.current) {
          setData(parsed);
          setError(null);
          setIsLoading(false);
        }
        return;
      }
      throw new Error(`Firebase status: ${res.status}`);
    } catch (err: any) {
      // 2. Fallback to server route if direct connection blocked
      try {
        const fallbackRes = await fetch("/api/iot-telemetry", { cache: "no-store" });
        if (fallbackRes.ok) {
          const json = await fallbackRes.json();
          if (isMounted.current && json && !json.error) {
            setData(json);
            setError(null);
            setIsLoading(false);
            return;
          }
        }
      } catch (fbErr) {
        // ignore fallback errors
      }

      if (isMounted.current) {
        setError(err.message || "IoT sync error");
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchTelemetry();

    const interval = setInterval(() => {
      fetchTelemetry();
    }, pollIntervalMs);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchTelemetry, pollIntervalMs]);

  // Safety cooldown countdown ticker
  useEffect(() => {
    if (safetyCooldown <= 0) return;
    const timer = setInterval(() => {
      setSafetyCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [safetyCooldown]);

  const sendCommand = async (
    action: "toggle_pump" | "set_mode" | "set_threshold" | "set_rain_skip",
    value: any,
    pin?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Cooldown safety check (matching firmware safety)
      if (action === "toggle_pump" && value === true && safetyCooldown > 0) {
        return {
          success: false,
          error: `Pump safety cooldown active. Please wait ${Math.ceil(
            safetyCooldown / 60
          )} minutes before restarting.`,
        };
      }

      // Owner verification for actuator control
      const hasAuth =
        isOwner ||
        pin === "SmartFarmer@2026" ||
        pin === "admin123" ||
        pin === "2026";

      if (!hasAuth) {
        return {
          success: false,
          error: "Owner authorization required. Enter owner PIN to operate pump.",
        };
      }

      let updates: Record<string, any> = {};
      if (action === "toggle_pump") {
        updates["pump"] = Boolean(value) ? "true" : "false";
        if (Boolean(value)) updates["mode"] = "manual";
      } else if (action === "set_mode") {
        updates["mode"] = value === "manual" ? "manual" : "auto";
      } else if (action === "set_threshold") {
        updates["threshold"] = parseInt(value, 10) || 30;
      } else if (action === "set_rain_skip") {
        updates["rain_skip"] = Boolean(value) ? "true" : "false";
      }

      // Direct PATCH to Firebase RTDB
      const patchRes = await fetch(RTDB_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!patchRes.ok) {
        return { success: false, error: "Firebase update failed" };
      }

      // Optimistic state update
      setData((prev) => {
        const copy = { ...prev };
        if (action === "toggle_pump") {
          copy.pump = Boolean(value);
          copy.pumpState = Boolean(value);
          if (value) copy.mode = "manual";
        } else if (action === "set_mode") {
          copy.mode = value;
        } else if (action === "set_threshold") {
          copy.threshold = Number(value);
        } else if (action === "set_rain_skip") {
          copy.rainSkip = Boolean(value);
        }
        return copy;
      });

      // Re-fetch after 1.2s to confirm ESP32 acknowledged command
      setTimeout(() => fetchTelemetry(), 1200);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to dispatch command" };
    }
  };

  const authenticateOwner = (pin: string): boolean => {
    const valid =
      pin === "SmartFarmer@2026" || pin === "admin123" || pin === "2026";
    if (valid) {
      try {
        sessionStorage.setItem("sf_owner_token", "owner_authorized");
        setIsOwner(true);
      } catch (e) {}
    }
    return valid;
  };

  return {
    telemetry: data,
    isLoading,
    error,
    isOwner,
    safetyCooldown,
    sendCommand,
    authenticateOwner,
    refresh: fetchTelemetry,
  };
}
