"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordClientPageview, detectDevice, getOrCreateSessionId, getOrCreateVisitorId } from "@/lib/analytics/analyticsStore";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    // Do not track admin portal internal navigation as external farmer visits
    if (pathname.startsWith("/admin")) return;

    // 1. Record client-side
    recordClientPageview(pathname);

    // 2. Non-blocking ping to serverless analytics endpoint
    try {
      const payload = {
        path: pathname,
        device: detectDevice(),
        sessionId: getOrCreateSessionId(),
        visitorId: getOrCreateVisitorId(),
        referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
        timestamp: Date.now(),
      };

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track", JSON.stringify(payload));
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          // ignore tracking errors silently
        });
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
