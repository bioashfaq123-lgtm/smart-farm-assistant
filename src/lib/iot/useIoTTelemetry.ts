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

export function useIoTTelemetry(pollIntervalMs: number = 8000) {
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
      const res = await fetch("/api/iot-telemetry", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (isMounted.current) {
          setData(json);
          setError(null);
          setIsLoading(false);
        }
      }
    } catch (err: any) {
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

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isOwner) {
        headers["Authorization"] = "Bearer owner_authorized";
      }

      const res = await fetch("/api/iot-telemetry", {
        method: "POST",
        headers,
        body: JSON.stringify({ action, value, ownerPin: pin }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (result.requiresAuth) {
          return {
            success: false,
            error: "Owner authorization required. Enter owner PIN to operate pump.",
          };
        }
        return { success: false, error: result.error || "Command rejected" };
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

      // Re-fetch after 1 second to confirm physical ESP32 relay state
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
