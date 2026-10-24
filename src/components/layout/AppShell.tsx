"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:ml-64 min-h-screen">
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
