import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/common/LanguageContext";
import { ThemeProvider } from "@/components/common/ThemeContext";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { PWARegister } from "@/components/common/PWARegister";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://smartfarming-web.vercel.app"),
  title: "Smart Farm Assistant | Telangana Rythu Digital Portal",
  description:
    "AI-powered agronomic advisory, live IoT sensor monitoring, Telangana APMC mandi rates, and PJTAU package of practices for Telangana farmers.",
  applicationName: "Smart Farm Assistant",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "https://smartfarming-web.vercel.app",
    languages: {
      "en-IN": "https://smartfarming-web.vercel.app",
      "te-IN": "https://smartfarming-web.vercel.app",
    },
  },
  openGraph: {
    title: "Smart Farm Assistant — Telangana Rythu Portal",
    description: "Bilingual digital farming assistant and IoT agronomy portal for Telangana farmers.",
    type: "website",
    url: "https://smartfarming-web.vercel.app",
    locale: "en_IN",
    alternateLocale: "te_IN",
    siteName: "Smart Farm Assistant",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 selection:bg-agri-200 selection:text-agri-900">
        <ThemeProvider>
          <LanguageProvider>
            <PWARegister />
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
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
