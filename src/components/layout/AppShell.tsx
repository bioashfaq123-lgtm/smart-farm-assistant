"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { WifiOff, ArrowRight } from "lucide-react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isDemo = pathname.startsWith("/demo");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const offlineBanner = isOffline && !isDemo && (
    <div
      role="alert"
      className="bg-amber-600 text-white px-4 py-2.5 text-xs md:text-sm font-semibold flex items-center justify-between shadow-md z-50 sticky top-0"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-100" />
        <span>
          You are offline. Open the offline demo / మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. డెమో మోడ్ చూడండి.
        </span>
      </div>
      <Link
        href="/demo"
        className="bg-white text-amber-900 px-3 py-1 rounded-md font-bold text-xs hover:bg-amber-50 transition shrink-0 ml-2 flex items-center gap-1 shadow-xs"
      >
        <span>Open Offline Demo</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );

  if (isAdmin) {
    return (
      <main className="min-h-screen w-full">
        {offlineBanner}
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:ml-64 min-h-screen">
        {offlineBanner}
        <Header />
        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <BottomNav />
    </div>
  );
}
