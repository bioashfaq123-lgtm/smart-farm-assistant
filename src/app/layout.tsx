import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/common/LanguageContext";
import { ThemeProvider } from "@/components/common/ThemeContext";
import { FarmerProfileProvider } from "@/components/common/FarmerProfileContext";
import { AppShell } from "@/components/layout/AppShell";
import { PWARegister } from "@/components/common/PWARegister";
import { AnalyticsTracker } from "@/components/common/AnalyticsTracker";

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
  verification: {
    google: "6T6_uPweHA5yPTKumhdlNSNq2gEXdzQQ1TVda3CIt5M",
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
            <FarmerProfileProvider>
              <PWARegister />
              <AnalyticsTracker />
              <AppShell>{children}</AppShell>
            </FarmerProfileProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
