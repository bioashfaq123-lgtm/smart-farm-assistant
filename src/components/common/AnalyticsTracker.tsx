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

    // Record client-side visitor event
    recordClientPageview(pathname);
  }, [pathname]);

  return null;
}
