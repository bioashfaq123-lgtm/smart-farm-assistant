"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Search,
  Globe,
  FileText,
  HelpCircle,
  X,
  Stethoscope,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPestMessage, generateWhatsAppUrl } from "@/lib/utils/kisanShare";

// Client-side Canvas Image Compression & Quality Pre-Check
export interface ClientCompressionResult {
  dataUrl: string;
  width: number;
  height: number;
  luminance: number;
  qualityWarning?: { en: string; te: string };
}

async function compressImageFile(file: File, maxDim = 1024, quality = 0.8): Promise<ClientCompressionResult> {
  return new Promise((resolve, reject) => {
    // MIME validation
    const validMimes = ["image/jpeg", "image/png", "image/webp"];
    if (file.type && !validMimes.includes(file.type.toLowerCase())) {
      return reject(new Error("UNSUPPORTED_FORMAT"));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.onload = () => {
        const origWidth = img.width;
        const origHeight = img.height;

        let qualityWarning: { en: string; te: string } | undefined;
        if (origWidth < 120 || origHeight < 120) {
          qualityWarning = {
            en: `Low image resolution (${origWidth}x${origHeight}px). Move camera closer (15-20 cm) for clear pathology.`,
            te: `ఫోటో పరిమాణం చాలా చిన్నది (${origWidth}x${origHeight}px). ఆకును దగ్గరగా ఉంచి స్పష్టమైన ఫోటో తీయండి.`,
          };
        }

        let width = origWidth;
        let height = origHeight;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({
            dataUrl: e.target?.result as string,
            width,
            height,
            luminance: 128,
            qualityWarning,
          });
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Sample canvas luminance across pixels
        let totalLum = 0;
        let count = 0;
        try {
          const imgData = ctx.getImageData(0, 0, width, height).data;
          const step = Math.max(1, Math.floor(imgData.length / (4 * 500)));
          for (let i = 0; i < imgData.length; i += 4 * step) {
            totalLum += 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
            count++;
          }
        } catch {
          // Ignore if canvas tainted
        }

        const avgLum = count > 0 ? Math.round(totalLum / count) : 128;

        if (!qualityWarning) {
          if (avgLum < 22) {
            qualityWarning = {
              en: "Photo appears severely underexposed (too dark). Capture in natural daylight.",
              te: "ఫోటో చాలా చీకటిగా ఉంది. మంచి ఉదయపు వెలుతురులో ఫోటో తీయండి.",
            };
          } else if (avgLum > 242) {
            qualityWarning = {
              en: "Photo has harsh glare or flash washout. Turn off flash and retake.",
              te: "ఫోటోపై ఫ్లాష్ మెరుపు లేదా తీవ్ర కాంతి పడింది. ఫ్లాష్ లేకుండా తీయండి.",
            };
          }
        }

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({
          dataUrl,
          width,
          height,
          luminance: avgLum,
          qualityWarning,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Quick 1-Click Symptom Chips by Crop
const CROP_SYMPTOM_PRESETS: Record<string, Array<{ en: string; te: string }>> = {
  Paddy: [
    { en: "Spindle-shaped brown lesions with ash center", te: "ఆకులపై బూడిద కేంద్రంతో కదురు ఆకారపు మచ్చలు" },
    { en: "Neck of panicle blackening and breaking (Neck rot)", te: "కంకి మెడ నల్లబడి విరిగిపోవడం" },
    { en: "Wavy straw-yellow drying from leaf margins (BLB)", te: "ఆకు అంచుల నుండి తరంగాల రూపంలో ఎండిపోవడం" },
    { en: "Water-soaked lesions on leaf sheath near water line", te: "నీటి మట్టం వద్ద ఆకు తొడుగుపై మచ్చలు" },
    { en: "Dead heart in central tiller with caterpillar inside", te: "మొవ్వు కుళ్ళిపోయి ఎండిపోవడం (డెడ్ హార్ట్)" },
    { en: "Brown spots and hopper burn in rootzone", te: "మొక్కల మొదళ్ల వద్ద ఉధృతి (సుడి దోమ)" },
    { en: "Rusty reddish-brown discoloration on young leaves (Zinc)", te: "లేత ఆకులు ఇనుము రంగులోకి మారడం (జింక్ లోపం)" },
  ],
  Cotton: [
    { en: "Angular water-soaked leaf spots turning dark brown", te: "ఆకులపై కోణీయ ఆకారపు మచ్చలు" },
    { en: "Rosette flowers and pink caterpillar inside bolls", te: "రోసెట్ పువ్వులు మరియు కాయల్లో గులాబీ రంగు పురుగు" },
    { en: "Leaves curling downward with yellowing margins", te: "ఆకులు క్రిందికి ముడుచుకోవడం మరియు పసుపు రంగు" },
    { en: "Leaves turning red/purple between green veins (Magnesium)", te: "ఈనెల మధ్య ఆకులు ఎర్రబారడం (మెగ్నీషియం లోపం)" },
    { en: "Dropping of flower squares and young green bolls", te: "పిందెలు మరియు కాయలు రాలిపోవడం" },
  ],
  Chilli: [
    { en: "Upward boat-shaped leaf curling with stunted growth (Thrips)", te: "ఆకులు పైకి దోనెలా ముడుచుకుపోవడం (తామర పురుగులు)" },
    { en: "Circular sunken black spots on fruit turning rotten (Anthracnose)", te: "కాయలపై నల్లటి గుండ్రని మచ్చలు (కొమ్మ ఎండు/కాయ కుళ్ళు)" },
    { en: "White powdery fungal coating on leaf surface", te: "ఆకులపై బూడిద వంటి తెల్లని పొర" },
    { en: "Sudden wilting and root browning in moist soil", te: "మొక్కలు అకస్మాత్తుగా వాడిపోవడం" },
  ],
  Maize: [
    { en: "Ragged leaf holes and sawdust-like frass in whorl (FAW)", te: "మొవ్వులో రంధ్రాలు మరియు లద్దె పురుగు విసర్జన" },
    { en: "Long spindle-shaped grey-green leaf blight spots", te: "ఆకులపై పొడవాటి బూడిద రంగు మచ్చలు" },
    { en: "V-shaped yellowing starting from leaf tips (Nitrogen)", te: "ఆకు కొన నుండి V ఆకారంలో పసుపు రంగు (నత్రజని లోపం)" },
  ],
  Redgram: [
    { en: "Sudden drooping and wilting of plants with xylem browning", te: "మొక్కలు అకస్మాత్తుగా వాడి ఎండిపోవడం (ఎండు తెగులు)" },
    { en: "Bushy pale leaves with no flowering (Sterility Mosaic)", te: "మొక్కలు గొడ్డుబోయి పూత రాకపోవడం" },
    { en: "Bored holes in pods with caterpillar feeding on seeds", te: "కాయలకు రంధ్రాలు చేసి గింజలు తినే శనగ పచ్చ పురుగు" },
  ],
};

// Preloaded Reference Test Cases for 1-Click Instant Testing
const REFERENCE_TEST_CASES = [
  {
    id: "blast",
    crop: "Paddy",
    nameEn: "Rice Blast (Pyricularia oryzae)",
    nameTe: "వరి అగ్గితెగులు (ఆకు & మెడ విరుపు)",
    symptoms: "Spindle-shaped brown lesions with ash-grey centers on leaf blades. Panicle neck base turning black and rotting.",
    severity: "high",
  },
  {
    id: "blb",
    crop: "Paddy",
    nameEn: "Bacterial Leaf Blight (BLB)",
    nameTe: "బాక్టీరియా ఆకు ఎండు తెగులు",
    symptoms: "Water-soaked wavy straw-colored drying progressing downward from leaf tips and margins.",
    severity: "high",
  },
  {
    id: "pbw",
    crop: "Cotton",
    nameEn: "Pink Bollworm (Pectinophora gossypiella)",
    nameTe: "పత్తిలో గులాబీ రంగు పురుగు",
    symptoms: "Rosetted flower petals with interlocked rosette bloom. Pinkish caterpillar larvae tunneling into bolls and feeding on lint.",
    severity: "high",
  },
  {
    id: "murda",
    crop: "Chilli",
    nameEn: "Chilli Leaf Curl & Thrips (Murda Complex)",
    nameTe: "మిరపలో ఆకు ముడత & తామర పురుగులు",
    symptoms: "Upward cupping of leaves like a boat, crinkling, brittle veins, and flower shedding due to thrips sucking sap.",
    severity: "medium",
  },
];

export default function DiagnosisPage() {
  const { lang } = useLanguage();
  const { profile } = useFarmerProfile();

  // Inputs
  const [selectedCrop, setSelectedCrop] = useState<string>(profile.primaryCrop || "Paddy");
  const [symptomText, setSymptomText] = useState<string>("");
  const [leafPhotoBase64, setLeafPhotoBase64] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [photoMeta, setPhotoMeta] = useState<{ width: number; height: number; luminance: number } | null>(null);
  const [photoQualityWarning, setPhotoQualityWarning] = useState<{ en: string; te: string } | null>(null);

  // States
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [activeCandidateIdx, setActiveCandidateIdx] = useState<number>(0);
  const [primaryObservation, setPrimaryObservation] = useState<string>("");
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [diagnosticSource, setDiagnosticSource] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Photo Selection with Canvas Compression
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage("");
    setIsCompressing(true);
    setPhotoFileName(file.name);

    try {
      const result = await compressImageFile(file);
      setLeafPhotoBase64(result.dataUrl);
      setPhotoMeta({ width: result.width, height: result.height, luminance: result.luminance });
      setPhotoQualityWarning(result.qualityWarning || null);
    } catch (err: any) {
      setErrorMessage("Could not process image file. Please choose another JPG or PNG photo.");
    } finally {
      setIsCompressing(false);
      e.target.value = "";
    }
  };

  const removePhoto = () => {
    setLeafPhotoBase64(null);
    setPhotoFileName("");
  };

  // Add a preset symptom chip
  const addSymptomChip = (chipText: string) => {
    if (symptomText.includes(chipText)) return;
    setSymptomText((prev) => (prev ? `${prev.trim()}, ${chipText}` : chipText));
  };

  // Run Diagnosis
  const handleRunDiagnosis = async (forcedCrop?: string, forcedSymptoms?: string, forcedImage?: string) => {
    const cropToUse = forcedCrop || selectedCrop;
    const symptomsToUse = forcedSymptoms !== undefined ? forcedSymptoms : symptomText;
    const imageToUse = forcedImage !== undefined ? forcedImage : leafPhotoBase64;

    if (!imageToUse && !symptomsToUse.trim()) {
      setErrorMessage("Please capture/upload a leaf photo OR describe the symptoms in words to begin diagnosis.");
      return;
    }

    setErrorMessage("");
    setRateLimitSeconds(0);
    setIsDiagnosing(true);
    setDiagnosisResult(null);
    setCandidatesList([]);
    setActiveCandidateIdx(0);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageToUse,
          symptoms: symptomsToUse,
          crop: cropToUse,
          district: profile.district || "Jagtial",
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        if (res.status === 429 && data.resetSeconds) {
          setRateLimitSeconds(data.resetSeconds);
        }
        throw new Error(data.error || "Failed to process diagnosis.");
      }

      setDiagnosisResult(data.diagnosis);
      setCandidatesList(Array.isArray(data.candidates) ? data.candidates : []);
      setActiveCandidateIdx(0);
      setPrimaryObservation(data.primaryObservation || "");
      setDiagnosticSource(data.source || "Gemini Multimodal AI & Scientific Crop Pathology");
    } catch (err: any) {
      setErrorMessage(err.message || "Diagnosis service temporarily unavailable. Please verify connection and retry.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // 1-Click Test Case trigger
  const handleSelectTestCase = (testCase: typeof REFERENCE_TEST_CASES[0]) => {
    setSelectedCrop(testCase.crop);
    setSymptomText(testCase.symptoms);
    setLeafPhotoBase64(null);
    setPhotoFileName(`Sample: ${testCase.nameEn}`);
    handleRunDiagnosis(testCase.crop, testCase.symptoms, undefined);
  };

  // Active selected candidate item helper
  const getActiveItem = () => {
    if (candidatesList && candidatesList.length > 0) {
      const cand = candidatesList[activeCandidateIdx] || candidatesList[0];
      return {
        ...cand,
        diseaseNameEn: cand.commonName || cand.diseaseNameEn || diagnosisResult?.diseaseNameEn,
        diseaseNameTe: cand.nameTe || cand.diseaseNameTe || diagnosisResult?.diseaseNameTe,
        crop: selectedCrop,
        symptomsEn: cand.symptomsSeen || cand.symptomsEn || diagnosisResult?.symptomsEn,
        symptomsTe: cand.symptomsSeen || cand.symptomsTe || diagnosisResult?.symptomsTe,
        chemicalSprayEn: cand.management?.chemicalNoticeEn || cand.chemicalSprayEn || diagnosisResult?.chemicalSprayEn,
        chemicalSprayTe: cand.management?.chemicalNoticeTe || cand.chemicalSprayTe || diagnosisResult?.chemicalSprayTe,
        dosage: diagnosisResult?.dosage || "Confirm with Mandal AEO before purchase",
        organicControlEn: cand.management?.biological?.[0] || cand.organicControlEn || diagnosisResult?.organicControlEn,
        organicControlTe: cand.management?.biological?.[0] || cand.organicControlTe || diagnosisResult?.organicControlTe,
        preventiveMeasuresEn: cand.management?.cultural?.[0] || cand.preventiveMeasuresEn || diagnosisResult?.preventiveMeasuresEn,
        preventiveMeasuresTe: cand.management?.cultural?.[0] || cand.preventiveMeasuresTe || diagnosisResult?.preventiveMeasuresTe,
        safetyDisclaimer: cand.management?.safetyDisclaimer || diagnosisResult?.safetyDisclaimer,
        favourableConditions: cand.favourableConditions || diagnosisResult?.favourableConditions,
        unconfirmedSymptoms: cand.unconfirmedSymptoms,
        differentialClues: cand.differentialClues,
        fieldCheck: cand.fieldCheck,
        type: cand.type,
      };
    }
    return diagnosisResult;
  };

  // Copy prescription text
  const handleCopyPrescription = () => {
    const item = getActiveItem();
    if (!item) return;
    const text = `🌱 Smart Farm Assistant - Crop Diagnosis Assessment
Status: ${item.status === "inconclusive" ? "INCONCLUSIVE (Field Verification Required)" : "POSSIBLE DIAGNOSIS (Indicative Assessment)"}
Assessment Level: ${item.confidenceLevel || "Needs further verification"}
Disease: ${item.diseaseNameEn} (${item.diseaseNameTe})
Crop: ${item.crop || selectedCrop}
Observed Symptoms: ${item.symptomsEn}
${item.differentialClues ? `Differential Clues: ${item.differentialClues}\n` : ""}${item.fieldCheck ? `Field Check: ${item.fieldCheck}\n` : ""}Chemical Notice: ${item.chemicalSprayEn}
Organic / Cultural Management: ${item.organicControlEn}
Preventive Field Agronomy: ${item.preventiveMeasuresEn}
Safety Rule: ${item.safetyDisclaimer}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // WhatsApp Sharing
  const handleShareWhatsApp = () => {
    const item = getActiveItem();
    if (!item) return;
    const text = formatPestMessage(
      {
        crop: item.crop || selectedCrop,
        cropTe: item.crop || selectedCrop,
        pestName: item.diseaseNameEn,
        pestNameTe: item.diseaseNameTe,
        remedy: item.chemicalSprayEn,
        remedyTe: item.chemicalSprayTe,
        dosage: item.dosage,
        dosageTe: item.dosage,
        organic: item.organicControlEn,
        organicTe: item.organicControlTe,
        ppe: item.safetyDisclaimer || "Wear protective mask and gloves.",
        ppeTe: item.safetyDisclaimer || "రక్షణ మాస్క్ మరియు చేతి తొడుగులు ధరించండి.",
      },
      lang
    );
    window.open(generateWhatsAppUrl(text), "_blank");
  };

  // Text-to-Speech (TTS)
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const item = getActiveItem();
    if (!item) return;
    const textToRead = lang === "te"
      ? `${item.diseaseNameTe}. ${item.chemicalSprayTe}. మోతాదు: ${item.dosage}. సేంద్రీయ విధానం: ${item.organicControlTe}`
      : `${item.diseaseNameEn}. Recommended treatment: ${item.chemicalSprayEn}. Dosage: ${item.dosage}. Organic alternative: ${item.organicControlEn}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang === "te" ? "te-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoSelect}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-md">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                {lang === "te" ? "పంట రోగ నిర్ధారణ & చికిత్స కేంద్రం" : "Crop Disease & Pest Diagnosis Studio"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                {profile.village} Field &bull; {profile.district} District &bull; {selectedCrop} ({profile.areaAcre} Acres)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/advisory"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition shadow-2xs"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat With Krishi Sahayak &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 shadow-2xs">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Agricultural Pathologist Notice: </span>
          AI diagnosis is an indicative diagnostic tool calibrated with scientific packages of practices. Always confirm critical pesticide and dosage applications with your local Agricultural Extension Officer (AEO). Always wear PPE (mask and gloves) when spraying.
        </div>
      </div>

      {/* Dual Diagnostic Input Studio (Photo + Symptoms Description) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Leaf Photo Upload */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  1. Capture or Upload Leaf Photo
                </h3>
              </div>
              <Badge variant="normal">Option A</Badge>
            </div>

            {/* Photo Dropzone or Thumbnail */}
            {!leafPhotoBase64 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 p-6 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 shadow-xs group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7 text-emerald-600" />
                </div>
                <h4 className="mt-3 text-xs font-bold text-stone-900 dark:text-white">
                  Click to Upload or Drag Leaf Photo
                </h4>
                <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400 max-w-xs">
                  Upload an infected crop leaf, stem, or fruit photo. Supports JPG, PNG, WebP (auto-compressed).
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-bold transition shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-500" />
                    <span>Snap Camera</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-stone-900">
                <img
                  src={leafPhotoBase64}
                  alt="Uploaded infected crop leaf"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3.5">
                  <div className="text-white text-xs">
                    <span className="font-bold block truncate max-w-[200px]">{photoFileName}</span>
                    <span className="text-[10px] text-emerald-300">✓ Compressed &amp; Ready for Vision AI</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-sm transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}

            {isCompressing && (
              <div className="flex items-center gap-2 text-xs text-sky-600 font-semibold animate-pulse">
                <span className="h-2 w-2 rounded-full bg-sky-600 animate-ping" />
                <span>Compressing photo to optimal resolution...</span>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Describe Disease Symptoms (User Request Feature!) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  2. Describe Symptoms in Words (Text or 1-Click Chips)
                </h3>
              </div>
              <Badge variant="normal">Option B</Badge>
            </div>

            {/* Crop Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 shrink-0">
                Selected Crop:
              </span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 px-3 py-1.5 text-xs font-bold text-stone-900 dark:text-white shadow-2xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="Paddy">Paddy (Rice / వరి)</option>
                <option value="Cotton">Cotton (పత్తి)</option>
                <option value="Chilli">Chilli (మిరప)</option>
                <option value="Maize">Maize (మొక్కజొన్న)</option>
                <option value="Redgram">Red Gram (కంది)</option>
                <option value="Groundnut">Groundnut (వేరుశనగ)</option>
                <option value="Soybean">Soybean (సోయాబీన్)</option>
              </select>
            </div>

            {/* Symptom Input Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                Describe Visible Symptoms on Crop:
              </label>
              <textarea
                rows={3}
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Type what you see (e.g. Spindle brown spots with ash centers on paddy leaves, yellow leaf drying along edges, caterpillar eating flower squares, or downward leaf curling...)"
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-3 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-500 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Quick 1-Click Symptom Chips */}
            {CROP_SYMPTOM_PRESETS[selectedCrop] && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <span>⚡ Common {selectedCrop} Symptoms (Click to add):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CROP_SYMPTOM_PRESETS[selectedCrop].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addSymptomChip(lang === "te" ? chip.te : chip.en)}
                      className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 px-2.5 py-1 text-[11px] font-medium text-stone-700 dark:text-stone-300 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition shadow-2xs text-left"
                    >
                      + {lang === "te" ? chip.te : chip.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[11px] text-stone-500">
                {leafPhotoBase64
                  ? "✓ Photo attached + Symptoms provided"
                  : symptomText
                  ? "✓ Symptoms text provided (Text Diagnosis Ready)"
                  : "Upload photo, enter symptoms, or select a test case below"}
              </span>

              <button
                type="button"
                onClick={() => handleRunDiagnosis()}
                disabled={isDiagnosing || (!leafPhotoBase64 && !symptomText.trim())}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs px-6 py-2.5 shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isDiagnosing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing Pathology...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Disease Diagnosis</span>
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Rate Limit Alert */}
      {rateLimitSeconds > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            {lang === "te"
              ? `నిర్ధారణ పరిమితి ముగిసింది (10 నిమిషాలకు 10 అభ్యర్థనలు). దయచేసి మరో ${rateLimitSeconds} సెకన్ల తర్వాత ప్రయత్నించండి.`
              : `Diagnosis rate limit reached (10 requests per 10 minutes). Please wait ${rateLimitSeconds} seconds before submitting another image.`}
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Instant 1-Click Reference Test Cases (Demonstration / Evaluation) */}
      <Card className="p-4 bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🧪</span>
            <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              1-Click Symptom Test Cases (Evaluation & Demonstration)
            </span>
          </div>
          <span className="text-[10px] text-stone-500">Click any card to test instant diagnosis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REFERENCE_TEST_CASES.map((tc) => (
            <button
              key={tc.id}
              onClick={() => handleSelectTestCase(tc)}
              className="text-left rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 p-3 hover:border-emerald-500 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  {tc.crop}
                </span>
                <span className="text-[10px] text-rose-600 font-bold uppercase">{tc.severity}</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {lang === "te" ? tc.nameTe : tc.nameEn}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-snug">
                {tc.symptoms}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Diagnosis Results Section */}
      {diagnosisResult && (
        diagnosisResult.status === "inconclusive" ? (
          /* INCONCLUSIVE SAFETY STATE (Task 1 & Task 4) */
          <div className="rounded-3xl border-2 border-amber-300 dark:border-amber-700/80 bg-amber-50/60 dark:bg-amber-950/30 p-6 shadow-xl space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200 dark:border-amber-900/60">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 px-3 py-1 text-xs font-bold border border-amber-300 dark:border-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{lang === "te" ? "స్పష్టమైన నిర్ధారణ కాలేదు" : "Unable to Determine / Inconclusive"}</span>
                  </span>
                  <span className="rounded-full bg-white dark:bg-stone-850 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    {diagnosisResult.confidenceLevel || "Unable to determine"}
                  </span>
                  <span className="rounded-full bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-1 text-xs font-bold border border-rose-200 dark:border-rose-900">
                    Safety Gate: Misdiagnosis Prevention
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 mt-1">
                  {lang === "te" ? diagnosisResult.diseaseNameTe : diagnosisResult.diseaseNameEn}
                </h2>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {lang === "te"
                    ? "తప్పుడు లేదా అసంపూర్ణ నిర్ధారణ ఆధారంగా రసాయన మందులు పిచికారీ చేయడం వల్ల పంట నష్టం మరియు ధన నష్టం వాటిల్లే అవకాశం ఉంది."
                    : "To prevent hazardous chemical sprays and unnecessary expense, a definitive diagnosis was not fabricated."}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={toggleSpeech}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-stone-850 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-50 transition shadow-2xs"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
                  <span>{isSpeaking ? "Stop Voice" : "Listen Voice"}</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Reason */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-white/90 dark:bg-stone-900 p-4 space-y-1.5">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                📋 Visual Observation &amp; Diagnostic Findings
              </span>
              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {lang === "te" ? diagnosisResult.symptomsTe : diagnosisResult.symptomsEn}
              </p>
            </div>

            {/* Suggested Photographic & Field Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-2">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider block">
                  📸 Photographic Best Practices for Accurate Diagnosis
                </span>
                <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Capture clear close-up photos in natural morning sunlight.</li>
                  <li>Ensure the camera focuses directly on the lesion or affected leaf margin.</li>
                  <li>Photograph both the upper and lower leaf surfaces.</li>
                  <li>Avoid blurry, out-of-focus, or extreme wide-angle field shots.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider block">
                  👨‍🌾 Recommended Field Extension Actions
                </span>
                <ul className="text-xs text-emerald-950 dark:text-emerald-100 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Inspect surrounding plants to determine if symptoms are isolated or spreading.</li>
                  <li>Do NOT spray chemical pesticides without verified on-site diagnosis.</li>
                  <li>Consult your local Mandal Agricultural Extension Officer (AEO) for field inspection.</li>
                  <li>Call Kisan Toll-Free Helpline: <b>1800-180-1551</b> (6 AM – 10 PM).</li>
                </ul>
              </div>
            </div>

            {/* Safety Footer */}
            <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 p-3.5 text-[11px] text-stone-600 dark:text-stone-400 space-y-1 border border-amber-200 dark:border-amber-900/60">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safety Gate Source: {diagnosticSource}</span>
              </div>
              <p className="leading-relaxed">
                {diagnosisResult.safetyDisclaimer}
              </p>
            </div>
          </div>
        ) : (() => {
          const item = getActiveItem();
          if (!item) return null;
          return (
          /* INDICATIVE / DIFFERENTIAL DIAGNOSIS RESULT (Draft KB Standard) */
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-white dark:bg-stone-900 p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
            {/* Primary Observation Banner if available */}
            {primaryObservation && (
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-850/80 p-3.5 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block mb-0.5">
                    {lang === "te" ? "ప్రాథమిక పరిశీలన సారాంశం (AI విజన్):" : "Diagnostic Observation Summary:"}
                  </span>
                  <span>{primaryObservation}</span>
                </div>
              </div>
            )}

            {/* Differential Candidate Tabs (Multi-Candidate Navigation) */}
            {candidatesList && candidatesList.length > 1 && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>
                      {lang === "te"
                        ? "డిఫరెన్షియల్ నిర్ధారణలు (ఒకే రకమైన లక్షణాలు ఉన్న తెగుళ్ళు):"
                        : "Differential Diagnoses (Multiple Overlapping Conditions Detected):"}
                    </span>
                  </span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                    {candidatesList.length} possible conditions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {candidatesList.map((cand: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveCandidateIdx(idx)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        activeCandidateIdx === idx
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm scale-102"
                          : "bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-750 hover:border-emerald-500"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-black/10 dark:bg-white/10 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{lang === "te" ? (cand.nameTe || cand.commonName) : cand.commonName}</span>
                      <span className="text-[10px] opacity-75 uppercase tracking-wider">
                        ({cand.type || "pathology"})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Candidate Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 text-xs font-bold border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {candidatesList.length > 1
                        ? `Candidate ${activeCandidateIdx + 1} of ${candidatesList.length}`
                        : lang === "te"
                        ? "సూచిక నిర్ధారణ (పరిశీలించదగినది)"
                        : "Indicative Assessment"}
                    </span>
                  </span>
                  <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    Status: {item.confidenceLevel || "Possible diagnosis"}
                  </span>
                  <span className="rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 text-[11px] font-semibold border border-amber-200 dark:border-amber-800">
                    {item.verificationStatus || "Draft Knowledge Base (Pending Field Review)"}
                  </span>
                  <Badge variant={item.severity === "high" ? "critical" : "warning"}>
                    Severity: {String(item.severity || "medium").toUpperCase()}
                  </Badge>
                  {item.type && (
                    <span className="rounded-full bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-sky-200 dark:border-sky-900">
                      {item.type}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
                  {lang === "te" ? item.diseaseNameTe : item.diseaseNameEn}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                  Organism / Classification: <span className="font-semibold text-stone-700 dark:text-stone-300">{item.scientificName}</span>
                </p>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={toggleSpeech}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-750 transition shadow-2xs"
                  title="Listen to prescription in voice audio"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-600" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Listen Voice</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyPrescription}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-750 transition shadow-2xs"
                  title="Copy full assessment to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition hover:scale-[1.02]"
                  title="Share assessment to WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Core Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Symptoms Observed */}
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-850/60 p-4 space-y-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  🔍 Visible Foliage Symptoms
                </span>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {lang === "te" ? item.symptomsTe : item.symptomsEn}
                </p>
                {item.unconfirmedSymptoms && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                    <span className="font-bold">⚠️ Unconfirmed Signs in Current Photo:</span> {item.unconfirmedSymptoms}
                  </div>
                )}
                {item.favourableConditions && (
                  <div className="pt-1 text-[11px] text-stone-500">
                    <b>Favourable Weather:</b> {item.favourableConditions}
                  </div>
                )}
              </div>

              {/* Box 2: Differential Clues & Field Checks */}
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-2">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider block">
                  🔬 Differential Clues &amp; Farmer Field Check
                </span>
                {item.differentialClues && (
                  <div className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block mb-0.5">
                      Key Distinguishing Features:
                    </span>
                    {item.differentialClues}
                  </div>
                )}
                {item.fieldCheck && (
                  <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-white dark:bg-stone-900 p-2.5 text-[11px] text-blue-950 dark:text-blue-200 leading-snug">
                    <span className="font-bold block text-blue-700 dark:text-blue-300 mb-0.5">
                      👨‍🌾 Recommended Field Check for Farmer:
                    </span>
                    {item.fieldCheck}
                  </div>
                )}
              </div>
            </div>

            {/* Organic, Cultural & Chemical Notice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Cultural Management */}
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-850/40 p-4 space-y-1.5">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  🌾 Cultural Agronomy
                </span>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                  {lang === "te" ? item.preventiveMeasuresTe : item.preventiveMeasuresEn}
                </p>
              </div>

              {/* Box 2: Organic & Biological */}
              <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 p-4 space-y-1.5">
                <span className="text-xs font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider block">
                  🌿 Organic &amp; Biological
                </span>
                <p className="text-xs text-teal-950 dark:text-teal-100 leading-relaxed">
                  {lang === "te" ? item.organicControlTe : item.organicControlEn}
                </p>
              </div>

              {/* Box 3: Indicative Chemical Guidance */}
              <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-1.5">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                  ⚠️ Chemical Guidance (Indicative Only)
                </span>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 leading-relaxed">
                  {lang === "te" ? item.chemicalSprayTe : item.chemicalSprayEn}
                </p>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium pt-1 border-t border-amber-200 dark:border-amber-900/50">
                  Dosage: Confirm with Mandal AEO before purchase. Never apply without CIB&amp;RC container label verification.
                </div>
              </div>
            </div>

            {/* Safety Disclaimer & Source Footnote */}
            <div className="rounded-2xl bg-stone-100 dark:bg-stone-850 p-4 text-[11px] text-stone-600 dark:text-stone-400 space-y-1 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Diagnostic Assessment Source: {diagnosticSource}</span>
              </div>
              <p className="leading-relaxed">
                {item.safetyDisclaimer || diagnosisResult.safetyDisclaimer}
              </p>
            </div>
          </div>
          );
        })()
      )}
    </div>
  );
}
