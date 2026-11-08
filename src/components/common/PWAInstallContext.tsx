"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Download, Smartphone, X, Check, Share, PlusSquare } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface PWAInstallContextType {
  isInstalled: boolean;
  canInstall: boolean;
  isIOS: boolean;
  triggerInstall: () => Promise<void>;
  showInstallInstructions: boolean;
  setShowInstallInstructions: (show: boolean) => void;
}

const PWAInstallContext = createContext<PWAInstallContextType>({
  isInstalled: true,
  canInstall: false,
  isIOS: false,
  triggerInstall: async () => {},
  showInstallInstructions: false,
  setShowInstallInstructions: () => {},
});

export function usePWAInstall() {
  return useContext(PWAInstallContext);
}

export function PWAInstallProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState<boolean>(true); // Default true during SSR
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState<boolean>(false);
  const { lang } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 2. Check if currently running as an installed standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    // 3. Check persistent installed flag in localStorage
    let storedInstalled = false;
    try {
      storedInstalled = localStorage.getItem("sf_app_installed") === "true";
    } catch (e) {
      // ignore security / private mode errors
    }

    // If already installed or currently running in standalone app mode, never show install buttons
    if (isStandalone || storedInstalled) {
      setIsInstalled(true);
      return;
    }

    // App is not installed yet
    setIsInstalled(false);

    // 4. Capture native 'beforeinstallprompt' event (Android Chrome, Edge, desktop Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    // 5. Handle successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem("sf_app_installed", "true");
      } catch (e) {}
    };

    // 6. Listen to display-mode changes
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleMqlChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        try {
          localStorage.setItem("sf_app_installed", "true");
        } catch (err) {}
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    if (mql.addEventListener) {
      mql.addEventListener("change", handleMqlChange);
    }

    // 7. Check Chromium getInstalledRelatedApps API if supported
    if ("getInstalledRelatedApps" in navigator) {
      try {
        (navigator as any).getInstalledRelatedApps().then((relatedApps: any[]) => {
          if (Array.isArray(relatedApps) && relatedApps.length > 0) {
            setIsInstalled(true);
            try {
              localStorage.setItem("sf_app_installed", "true");
            } catch (e) {}
          }
        });
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleMqlChange);
      }
    };
  }, []);

  const triggerInstall = async () => {
    if (isInstalled) return;

    // Case A: Android Chrome / Chromium with native prompt ready
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === "accepted") {
          setIsInstalled(true);
          try {
            localStorage.setItem("sf_app_installed", "true");
          } catch (e) {}
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn("PWA prompt error:", err);
        setShowInstallInstructions(true);
      }
      return;
    }

    // Case B: iOS Safari or browsers where beforeinstallprompt is not available
    setShowInstallInstructions(true);
  };

  const canInstall = !isInstalled;

  return (
    <PWAInstallContext.Provider
      value={{
        isInstalled,
        canInstall,
        isIOS,
        triggerInstall,
        showInstallInstructions,
        setShowInstallInstructions,
      }}
    >
      {children}

      {/* Manual Install Instructions Modal (for iOS or browsers without native prompt) */}
      {showInstallInstructions && !isInstalled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-2xl text-stone-900 dark:text-stone-100">
            {/* Close Button */}
            <button
              onClick={() => setShowInstallInstructions(false)}
              className="absolute top-3 right-3 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {lang === "te" ? "యాప్‌ను ఇన్‌స్టాల్ చేయండి" : "Install Smart Farm App"}
                </h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  {lang === "te" ? "తెలంగాణ రైతు పోర్టల్" : "Direct Phone Installation"}
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
                <p>
                  {lang === "te"
                    ? "ఐఫోన్‌లో ఈ యాప్‌ను మీ హోమ్ స్క్రీన్‌పై ఇన్‌స్టాల్ చేయడానికి:"
                    : "To install Smart Farm Assistant on your iPhone home screen:"}
                </p>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800 p-3 space-y-2 border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">1</span>
                    <span>{lang === "te" ? "సఫారీ క్రింది భాగంలో షేర్ (Share) బటన్ నొక్కండి" : "Tap the Share button at bottom of Safari"}</span>
                    <Share className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">2</span>
                    <span>{lang === "te" ? "'Add to Home Screen' ఎంచుకోండి" : "Select 'Add to Home Screen'"}</span>
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
                <p>
                  {lang === "te"
                    ? "మీ ఫోన్‌లో యాప్‌గా ఇన్‌స్టాల్ చేయడానికి బ్రౌజర్ మెనూను ఉపయోగించండి:"
                    : "Install directly on your phone using your browser menu:"}
                </p>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800 p-3 space-y-2 border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">1</span>
                    <span>{lang === "te" ? "బ్రౌజర్ పైన ఉన్న 3 చుక్కల మెనూ (⋮) నొక్కండి" : "Tap the 3 dots (⋮) menu in your browser"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">2</span>
                    <span>{lang === "te" ? "'Install app' లేదా 'Add to Home screen' నొక్కండి" : "Tap 'Install app' or 'Add to Home screen'"}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstallInstructions(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
            >
              {lang === "te" ? "సరే, అర్థమైంది" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </PWAInstallContext.Provider>
  );
}

/**
 * Reusable Install App Button Component
 * Returns null if the app is already installed!
 */
export function InstallAppButton({
  className = "",
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "banner" | "compact" | "drawer";
}) {
  const { isInstalled, triggerInstall } = usePWAInstall();
  const { lang } = useLanguage();

  // STRICT REQUIREMENT: If the user has already installed the app, NEVER show this button!
  if (isInstalled) {
    return null;
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={triggerInstall}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition hover:scale-105 active:scale-95 ${className}`}
        title="Install Smart Farm app directly on your phone"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{lang === "te" ? "యాప్ ఇన్‌స్టాల్" : "Install"}</span>
      </button>
    );
  }

  if (variant === "drawer") {
    return (
      <button
        type="button"
        onClick={triggerInstall}
        className={`w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-green-700 text-white shadow-md transition active:scale-98 ${className}`}
      >
        <div className="flex items-center gap-2.5 text-left">
          <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">
              {lang === "te" ? "స్మార్ట్ ఫార్మ్ యాప్ ఇన్‌స్టాల్ చేయండి" : "Install Smart Farm App"}
            </p>
            <p className="text-[10px] text-emerald-100">
              {lang === "te" ? "ప్లే స్టోర్ అవసరం లేకుండా 1-క్లిక్ డౌన్‌లోడ్" : "1-Tap Direct Phone Install"}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold bg-white text-emerald-800 px-2 py-1 rounded-lg shrink-0">
          {lang === "te" ? "ఇన్‌స్టాల్" : "INSTALL"}
        </span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-700 via-emerald-800 to-green-800 p-4 text-white shadow-lg ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold">
                {lang === "te" ? "రైతుల కోసం స్మార్ట్ ఫార్మ్ మొబైల్ యాప్" : "Get the Smart Farm Mobile App"}
              </p>
              <p className="text-xs text-emerald-100">
                {lang === "te"
                  ? "మీ ఫోన్ హోమ్ స్క్రీన్‌పై నేరుగా ఇన్‌స్టాల్ చేసుకోండి (లైవ్ మార్కెట్ & రోగ నిర్ధారణ)"
                  : "Install directly on your phone for instant offline advisory & camera diagnosis"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={triggerInstall}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{lang === "te" ? "ఇప్పుడే ఇన్‌స్టాల్ చేయండి" : "Install App Now"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Default: pill button
  return (
    <button
      type="button"
      onClick={triggerInstall}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition hover:scale-105 active:scale-95 border border-emerald-600/30 ${className}`}
      title="Install Smart Farm app on your phone"
    >
      <Download className="w-3.5 h-3.5" />
      <span>{lang === "te" ? "యాప్ ఇన్‌స్టాల్" : "Install App"}</span>
    </button>
  );
}
