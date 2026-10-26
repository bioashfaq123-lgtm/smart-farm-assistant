"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Mic,
  Camera,
  Send,
  Volume2,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  AlertOctagon,
  ShieldAlert,
  PhoneCall,
  Leaf,
  Layers,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Paperclip,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";
import { SafetyNotice } from "@/components/common/SafetyNotice";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  INITIAL_CHAT_MESSAGES,
  SAMPLE_ADVISORY_TIPS,
  SAMPLE_PEST_DIAGNOSTICS,
} from "@/lib/data/sampleData";
import { ChatMessage, PestDiagnosticCase } from "@/lib/types";
import {
  formatPestMessage,
  generateWhatsAppUrl,
  copyToClipboard,
} from "@/lib/utils/kisanShare";

export default function AdvisoryPage() {
  const { lang, t } = useLanguage();
  const { profile } = useFarmerProfile();
  const getInitialGreeting = (farmerName: string, village: string, crop: string): ChatMessage[] => {
    const greetingNameEn = farmerName ? `${farmerName} garu` : "Rythu Mithra";
    const greetingNameTe = farmerName ? `${farmerName} గారు` : "రైతు మిత్ర";
    const loc = village ? `in ${village}` : "in your field";
    const locTe = village ? `${village} లోని` : "మీ పొలంలోని";
    const crp = crop ? crop.split(" ")[0] : "crop";

    return [
      {
        id: "msg-welcome",
        sender: "assistant",
        textEn: `Namaste ${greetingNameEn}! I am your Krishi Sahayak AI. How is your ${crp} crop ${loc} doing today? You can type your question, record voice audio, or attach a plant leaf photo for instant PJTAU diagnosis.`,
        textTe: `నమస్తే ${greetingNameTe}! నేను మీ కృషి సహాయక్ AI. ${locTe} మీ పంట ఎలా ఉంది? మీరు మీ ప్రశ్నను టైప్ చేయవచ్చు, మైక్ నొక్కి మాట్లాడవచ్చు లేదా ఆకుల ఫోటోను పంపి రోగ నిర్ధారణ పొందవచ్చు.`,
        timestamp: "10:30 AM",
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialGreeting(profile.name, profile.village, profile.primaryCrop)
  );

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id.startsWith("msg-")) {
        return getInitialGreeting(profile.name, profile.village, profile.primaryCrop);
      }
      return prev;
    });
  }, [profile.name, profile.village, profile.primaryCrop]);

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "diagnostics">("chat");

  // Chat image attachment state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement | null>(null);

  // Diagnostic tab states
  const [selectedCase, setSelectedCase] = useState<PestDiagnosticCase>(SAMPLE_PEST_DIAGNOSTICS[0]);
  const [uploadedLeafPhoto, setUploadedLeafPhoto] = useState<string | null>(null);
  const [customAiDiagnosis, setCustomAiDiagnosis] = useState<any | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [diagSource, setDiagSource] = useState<string>("PJTAU Reference Cases");
  const diagFileInputRef = useRef<HTMLInputElement | null>(null);

  const [copiedPest, setCopiedPest] = useState(false);
  const [chatSource, setChatSource] = useState<string>("PJTAU Knowledge Base");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "YOU";

  // Quick suggestion prompts
  const sampleSuggestions = [
    {
      en: "What is the recommended spray for Leaf Blast in paddy?",
      te: "వరిలో అగ్గితెగులు నివారణకు సిఫారసు చేసిన మందు ఏమిటి?",
    },
    {
      en: "How to claim the ₹500/quintal Telangana Fine Rice bonus?",
      te: "తెలంగాణ సన్నవడ్ల ₹500/క్వింటాల్ బోనస్ ఎలా పొందాలి?",
    },
    {
      en: "How much DAP and Urea should I apply at tillering stage?",
      te: "పిలకల దశలో ఎంత డీఏపీ మరియు యూరియా వేయాలి?",
    },
    {
      en: "Yellowing on lower leaves in cotton - deficiency or pest?",
      te: "పత్తిలో ఆకులు పసుపు రంగులోకి మారడానికి నివారణ ఏమిటి?",
    },
  ];

  // Handle chat image selection
  const handleChatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = "";
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    const imgToSend = attachedImage;

    if (!text.trim() && !imgToSend) return;

    setErrorMessage("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      textEn: text || (imgToSend ? "Analyze this uploaded plant/leaf image" : ""),
      textTe: text || (imgToSend ? "ఈ అప్‌లోడ్ చేసిన మొక్క/ఆకు చిత్రాన్ని విశ్లేషించండి" : ""),
      imageUrl: imgToSend || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setAttachedImage(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text || (imgToSend ? "Analyze this crop leaf image for pests, disease or deficiency under PJTAU practices." : ""),
          image: imgToSend || undefined,
          lang,
          farmerProfile: {
            district: profile.district,
            primaryCrop: profile.primaryCrop,
            areaAcre: profile.areaAcre,
          },
        }),
      });

      if (res.status === 429) {
        setErrorMessage("AI rate limit reached. Please wait a moment or ask a specific PJTAU topic.");
      }

      const data = await res.json();
      const reply = data.reply || "Based on PJTAU guidelines, ensure adequate moisture and consult your local Mandal Agricultural Officer before spraying.";

      if (data.source) {
        setChatSource(data.source);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        textEn: reply,
        textTe: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setErrorMessage("Network error. Using offline PJTAU advisory.");
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        textEn: "Based on PJTAU Package of Practices, maintain 2-3 cm thin water layer and monitor pest ETL thresholds. Consult your Mandal Agricultural Officer before spraying.",
        textTe: "PJTAU మార్గదర్శకాల ప్రకారం పొలంలో పలుచని నీటి నిల్వ ఉంచండి మరియు పురుగు ఉధృతిని గమనించండి. మందుల పిచికారీ కోసం మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "te" ? "te-IN" : "en-IN";
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText(
          lang === "te"
            ? "వరిలో అగ్గితెగులు నివారణకు మందు ఏమిటి?"
            : "What is the recommended remedy for leaf blast in paddy?"
        );
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  // Handler for selecting sample reference case
  const handleSelectSampleCase = (pestCase: PestDiagnosticCase) => {
    setIsAnalyzingPhoto(true);
    setSelectedCase(pestCase);
    setUploadedLeafPhoto(null);
    setCustomAiDiagnosis(null);
    setDiagSource("PJTAU Reference Cases");
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
    }, 400);
  };

  // Handler for live leaf photo upload and multimodal Gemini diagnosis
  const handleLeafPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setUploadedLeafPhoto(base64Data);
      setIsAnalyzingPhoto(true);
      setCustomAiDiagnosis(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Diagnose this crop leaf photo for disease, pest, or nutrient deficiency under PJTAU package of practices.",
            image: base64Data,
            mode: "diagnosis",
            lang,
            farmerProfile: {
              district: profile.district,
              primaryCrop: profile.primaryCrop,
              areaAcre: profile.areaAcre,
            },
          }),
        });

        const data = await res.json();
        if (data.diagnosis) {
          setCustomAiDiagnosis(data.diagnosis);
          setDiagSource(data.source || "Gemini 1.5 Flash (Multimodal Vision)");
        } else if (data.reply) {
          setCustomAiDiagnosis({
            diseaseName: "Visual Leaf Pathology Analysis",
            severity: "high",
            symptoms: "Visual leaf lesion symptoms detected by AI.",
            remedy: data.reply,
            dosage: "See prescription below",
            organicAlternative: "Neem oil 10,000 ppm @ 2 mL/L",
            safety: "Wear protective face mask and gloves.",
            fullText: data.reply,
          });
          setDiagSource(data.source || "Gemini 1.5 Flash Vision");
        }
      } catch (err) {
        // Fallback to sample case
        setDiagSource("Offline PJTAU Reference Cases");
      } finally {
        setIsAnalyzingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Active diagnosis display object
  const activeDiagnosis = customAiDiagnosis
    ? {
        pestNameEn: customAiDiagnosis.diseaseName,
        pestNameTe: customAiDiagnosis.diseaseName,
        cropEn: profile.primaryCrop,
        cropTe: profile.primaryCrop,
        severity: customAiDiagnosis.severity || "high",
        symptomsEn: customAiDiagnosis.symptoms || "Visual symptoms analyzed from photo.",
        symptomsTe: customAiDiagnosis.symptoms || "ఫోటో నుండి విశ్లేషించిన లక్షణాలు.",
        recommendedSprayEn: customAiDiagnosis.remedy || "Apply recommended PJTAU spray.",
        recommendedSprayTe: customAiDiagnosis.remedy || "సిఫారసు చేసిన మందు పిచికారీ చేయండి.",
        dosageEn: customAiDiagnosis.dosage || "As per PJTAU package of practices",
        dosageTe: customAiDiagnosis.dosage || "PJTAU మార్గదర్శకాల ప్రకారం",
        organicAlternativeEn: customAiDiagnosis.organicAlternative || "Neem oil 10,000 ppm @ 2 mL/L",
        organicAlternativeTe: customAiDiagnosis.organicAlternative || "వేప నూనె @ 2 మి.లీ/లీటరు",
        ppePrecautionsEn: customAiDiagnosis.safety || "Wear face mask and hand gloves during spraying.",
        ppePrecautionsTe: customAiDiagnosis.safety || "రక్షణ మాస్క్ మరియు చేతి తొడుగులు ధరించండి.",
      }
    : selectedCase;

  return (
    <div className="space-y-6">
      {/* 1. Header with View Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("advisory_title")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              Gemini 1.5 Flash Multimodal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {profile.village} Field &bull; {profile.district} District &bull; {profile.primaryCrop} ({profile.areaAcre} Acres)
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === "chat"
                ? "bg-white text-stone-900 shadow-2xs dark:bg-stone-800 dark:text-stone-50"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-agri-600" />
            <span>{lang === "te" ? "కృషి సహాయక్ చాట్" : "Krishi Sahayak Chat"}</span>
          </button>
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === "diagnostics"
                ? "bg-white text-stone-900 shadow-2xs dark:bg-stone-800 dark:text-stone-50"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <Camera className="h-3.5 w-3.5 text-rose-500" />
            <span>{lang === "te" ? "ఆకు తెగులు స్కానర్" : "Leaf Disease Scanner"}</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <SafetyNotice />

      {activeTab === "chat" ? (
        /* Chat View */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Chat Interface */}
          <Card className="lg:col-span-2 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 p-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 text-white shadow-2xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {lang === "te" ? "కృషి సహాయక్ AI సంభాషణ" : "Krishi Sahayak AI Assistant"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      {chatSource}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMessages(INITIAL_CHAT_MESSAGES)}
                title="Reset conversation"
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5 rounded-lg transition"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Messages List Area */}
            <div className="flex-1 space-y-4 p-4 sm:p-6 overflow-y-auto max-h-[460px]">
              {messages.map((msg) => {
                const isBot = msg.sender === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    {isBot && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-agri-100 text-agri-800 dark:bg-agri-950 dark:text-agri-300">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isBot
                          ? "bg-stone-50/90 text-stone-900 border border-stone-200/80 dark:bg-stone-850 dark:text-stone-100 dark:border-stone-800"
                          : "bg-agri-700 text-white"
                      }`}
                    >
                      {/* Attached image preview in chat message */}
                      {msg.imageUrl && (
                        <div className="mb-2.5 overflow-hidden rounded-xl border border-white/20">
                          <img
                            src={msg.imageUrl}
                            alt="Uploaded crop leaf"
                            className="max-h-48 w-auto object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <p className="whitespace-pre-line">{lang === "te" && msg.textTe ? msg.textTe : msg.textEn}</p>
                      <div
                        className={`mt-2 flex items-center justify-between text-[10px] ${
                          isBot ? "text-stone-400 dark:text-stone-500" : "text-white/80"
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isBot && (
                          <button
                            onClick={() => speakText(lang === "te" && msg.textTe ? msg.textTe : msg.textEn)}
                            className="hover:text-agri-600 dark:hover:text-agri-400 transition flex items-center gap-1 font-medium"
                            title="Listen to audio"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>{lang === "te" ? "వినండి" : "Listen"}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {!isBot && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800 text-white text-xs font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex h-2 w-2 rounded-full bg-agri-600 animate-ping" />
                  <span>Consulting Gemini 1.5 Flash multimodal vision & PJTAU knowledge...</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="border-t border-stone-100 bg-stone-50/50 p-2.5 dark:border-stone-800 dark:bg-stone-900/40 overflow-x-auto flex gap-2">
              {sampleSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(lang === "te" ? s.te : s.en)}
                  className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-medium text-stone-700 shadow-2xs hover:border-agri-400 hover:text-agri-800 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
                >
                  💡 {lang === "te" ? s.te : s.en}
                </button>
              ))}
            </div>

            {/* Input Action Bar */}
            <div className="border-t border-stone-200 p-3 sm:p-4 dark:border-stone-800 bg-white dark:bg-stone-900">
              {/* Image attachment preview chip before sending */}
              {attachedImage && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-stone-100 p-2 text-xs dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                  <img
                    src={attachedImage}
                    alt="Preview"
                    className="h-10 w-10 rounded-lg object-cover border border-stone-300"
                  />
                  <div className="flex-1 truncate">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      Leaf Photo Attached
                    </span>
                    <p className="text-[10px] text-stone-400">Gemini 1.5 Flash Vision will inspect this image</p>
                  </div>
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    title="Remove attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Hidden file input for chat image attachment */}
              <input
                type="file"
                ref={chatFileInputRef}
                accept="image/*"
                onChange={handleChatImageSelect}
                className="hidden"
              />

              {isRecording && (
                <div className="mb-2 flex items-center justify-between rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>{t("advisory_listening")}</span>
                  </div>
                  <span className="text-[10px] font-mono">00:03</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                  placeholder={
                    attachedImage
                      ? "Ask a question about this attached photo..."
                      : t("advisory_input_placeholder")
                  }
                  className="w-full resize-none rounded-xl border border-stone-200 p-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-agri-600 focus:outline-hidden focus:ring-1 focus:ring-agri-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder-stone-500"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleVoiceRecording}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isRecording
                          ? "border-rose-400 bg-rose-100 text-rose-800"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
                      }`}
                    >
                      <Mic className="h-3.5 w-3.5 text-rose-500" />
                      <span>{t("advisory_btn_voice")}</span>
                    </button>

                    <button
                      onClick={() => chatFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 transition"
                      title="Attach leaf photo"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-agri-600" />
                      <span>{attachedImage ? "Change Photo" : "Attach Photo"}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("diagnostics")}
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 transition"
                    >
                      <Camera className="h-3.5 w-3.5 text-rose-500" />
                      <span>Scanner</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() && !attachedImage}
                    className="flex items-center gap-1.5 rounded-xl bg-agri-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-agri-800 disabled:opacity-50 active:scale-95"
                  >
                    <span>{t("advisory_btn_send")}</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Rail: Quick Tips & Helpline */}
          <div className="space-y-4">
            <Card>
              <CardHeader
                title={t("advisory_quick_tips")}
                subtitle="Season-specific farm guidelines"
                icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
              />

              <div className="space-y-3">
                {SAMPLE_ADVISORY_TIPS.map((tip) => (
                  <div
                    key={tip.id}
                    className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 text-xs dark:border-stone-800 dark:bg-stone-850 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {lang === "te" ? tip.titleTe : tip.titleEn}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-agri-700 dark:text-agri-400">
                        {lang === "te" ? tip.categoryTe : tip.categoryEn}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                      {lang === "te" ? tip.descTe : tip.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Helpline Assistance */}
            <Card className="bg-gradient-to-br from-agri-800 to-stone-900 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-agri-300">
                    Kisan Call Centre (Toll-Free)
                  </h4>
                  <p className="text-xl font-black mt-0.5">1800-180-1551</p>
                  <p className="text-[11px] text-stone-300 mt-1">
                    Direct government agricultural officer helpline (6 AM - 10 PM)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Multimodal Leaf & Pest Pathology Diagnostic View */
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={t("diag_tab_title")}
              subtitle={t("diag_subtitle")}
              icon={<Camera className="h-5 w-5 text-rose-500" />}
              action={<Badge variant="outline" className="text-xs">{diagSource}</Badge>}
            />

            {/* Live Upload Leaf Photo Card (Gemini 1.5 Flash Multimodal Vision) */}
            <div className="rounded-2xl border-2 border-dashed border-agri-300 bg-agri-50/40 p-6 text-center dark:border-agri-800 dark:bg-agri-950/20">
              <input
                type="file"
                ref={diagFileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleLeafPhotoFile}
                className="hidden"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-600 text-white shadow-md shadow-agri-600/30">
                <Upload className="h-7 w-7" />
              </div>

              <h3 className="mt-3 text-base font-bold text-stone-900 dark:text-white">
                {lang === "te"
                  ? "తెగులు సోకిన ఆకు ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి"
                  : "Capture or Upload Infected Crop Leaf Photo"}
              </h3>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
                {lang === "te"
                  ? "Google Gemini 1.5 Flash విజన్ AI సాంకేతికత ద్వారా ఆకు లక్షణాలను విశ్లేషించి, PJTAU నిర్ధారిత మందుల మోతాదును తక్షణమే పొందండి."
                  : "Powered by Google Gemini 1.5 Flash Vision AI. Instantly identifies plant pathogens, leaf spot diseases, and chewing pests under PJTAU package of practices."}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => diagFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-agri-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-agri-800 transition active:scale-95"
                >
                  <Camera className="h-4 w-4" />
                  <span>{lang === "te" ? "కెమెరా / ఫోటో ఎంచుకోండి" : "Take Photo / Choose Image"}</span>
                </button>
              </div>
            </div>

            {/* Quick Reference Sample Cases */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  {lang === "te" ? "లేదా PJTAU ప్రామాణిక కేసును ఎంచుకోండి:" : "Or select a PJTAU Reference Sample Case:"}
                </h4>
                <span className="text-[11px] text-stone-400">Offline Verified Samples</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SAMPLE_PEST_DIAGNOSTICS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSampleCase(item)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                      !uploadedLeafPhoto && selectedCase.id === item.id
                        ? "border-agri-600 bg-agri-50/60 ring-2 ring-agri-600/30 dark:bg-agri-950/30"
                        : "border-stone-200 bg-white hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agri-100 text-agri-700 dark:bg-agri-900 dark:text-agri-300 font-bold">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {lang === "te" ? item.pestNameTe : item.pestNameEn}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {lang === "te" ? item.cropTe : item.cropEn}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-rose-600 uppercase">
                        {item.severity} severity
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Pathology Result Card */}
            {isAnalyzingPhoto ? (
              <div className="my-8 flex flex-col items-center justify-center py-10 text-stone-500">
                <span className="h-10 w-10 animate-spin rounded-full border-3 border-agri-600 border-t-transparent" />
                <p className="mt-3 text-xs font-bold text-stone-700 dark:text-stone-200">
                  Gemini 1.5 Flash Vision analyzing leaf lesions...
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Cross-referencing PJTAU pathology package of practices
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
                  <div className="flex items-start gap-4">
                    {/* Uploaded photo thumbnail if user uploaded an image */}
                    {uploadedLeafPhoto && (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-agri-600 shadow-xs">
                        <img
                          src={uploadedLeafPhoto}
                          alt="Analyzed crop leaf"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-agri-700 dark:text-agri-400">
                          {t("diag_identified")}
                        </span>
                        <Badge variant="normal" className="text-[10px]">
                          {diagSource}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black text-stone-900 dark:text-stone-50 mt-0.5">
                        {lang === "te" ? activeDiagnosis.pestNameTe : activeDiagnosis.pestNameEn}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Crop: <b className="text-stone-800 dark:text-stone-200">{lang === "te" ? activeDiagnosis.cropTe : activeDiagnosis.cropEn}</b>
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={activeDiagnosis.severity === "high" ? "critical" : "warning"}
                    className="self-start sm:self-auto py-1 px-3"
                  >
                    {String(activeDiagnosis.severity).toUpperCase()} RISK LEVEL
                  </Badge>
                </div>

                {/* Symptoms & University Recommendations */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-850 space-y-1">
                    <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <AlertOctagon className="h-4 w-4 text-amber-500" />
                      <span>{t("diag_symptoms")}</span>
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {lang === "te" ? activeDiagnosis.symptomsTe : activeDiagnosis.symptomsEn}
                    </p>
                  </div>

                  <div className="rounded-xl bg-agri-50/60 p-4 dark:bg-agri-950/30 space-y-1 border border-agri-200/60 dark:border-agri-900/40">
                    <h4 className="text-xs font-bold text-agri-900 dark:text-agri-200 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-agri-600" />
                      <span>{t("diag_remedy")}</span>
                    </h4>
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === "te" ? activeDiagnosis.recommendedSprayTe : activeDiagnosis.recommendedSprayEn}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 pt-1">
                      <b>{t("diag_dosage")}:</b> {lang === "te" ? activeDiagnosis.dosageTe : activeDiagnosis.dosageEn}
                    </p>
                  </div>
                </div>

                {/* Organic Alternative & PPE Precautions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-1">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Leaf className="h-4 w-4 text-emerald-600" />
                      <span>{t("diag_organic")}</span>
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      {lang === "te" ? activeDiagnosis.organicAlternativeTe : activeDiagnosis.organicAlternativeEn}
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-1">
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>{t("diag_safety")}</span>
                    </h4>
                    <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                      {lang === "te" ? activeDiagnosis.ppePrecautionsTe : activeDiagnosis.ppePrecautionsEn}
                    </p>
                  </div>
                </div>

                {/* Action buttons with WhatsApp and SMS Sharing */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("chat");
                        handleSend(
                          lang === "te"
                            ? `నా పొలంలో ${activeDiagnosis.pestNameTe} గుర్తించబడింది. మరింత సలహా ఇవ్వండి.`
                            : `Detected ${activeDiagnosis.pestNameEn} in field. Please give step-by-step guidance.`
                        );
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-agri-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-agri-800"
                    >
                      <span>{lang === "te" ? "ఈ తెగులు గురించి చాట్‌లో మాట్లాడండి" : "Discuss in AI Chat"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <a
                      href={generateWhatsAppUrl(
                        formatPestMessage(
                          {
                            crop: activeDiagnosis.cropEn,
                            cropTe: activeDiagnosis.cropTe,
                            pestName: activeDiagnosis.pestNameEn,
                            pestNameTe: activeDiagnosis.pestNameTe,
                            remedy: activeDiagnosis.recommendedSprayEn,
                            remedyTe: activeDiagnosis.recommendedSprayTe,
                            dosage: activeDiagnosis.dosageEn,
                            dosageTe: activeDiagnosis.dosageTe,
                            organic: activeDiagnosis.organicAlternativeEn,
                            organicTe: activeDiagnosis.organicAlternativeTe,
                            ppe: activeDiagnosis.ppePrecautionsEn,
                            ppeTe: activeDiagnosis.ppePrecautionsTe,
                          },
                          lang
                        )
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>WhatsApp Share</span>
                    </a>

                    <button
                      onClick={async () => {
                        const txt = formatPestMessage(
                          {
                            crop: activeDiagnosis.cropEn,
                            cropTe: activeDiagnosis.cropTe,
                            pestName: activeDiagnosis.pestNameEn,
                            pestNameTe: activeDiagnosis.pestNameTe,
                            remedy: activeDiagnosis.recommendedSprayEn,
                            remedyTe: activeDiagnosis.recommendedSprayTe,
                            dosage: activeDiagnosis.dosageEn,
                            dosageTe: activeDiagnosis.dosageTe,
                            organic: activeDiagnosis.organicAlternativeEn,
                            organicTe: activeDiagnosis.organicAlternativeTe,
                            ppe: activeDiagnosis.ppePrecautionsEn,
                            ppeTe: activeDiagnosis.ppePrecautionsTe,
                          },
                          lang
                        );
                        const ok = await copyToClipboard(txt);
                        if (ok) {
                          setCopiedPest(true);
                          setTimeout(() => setCopiedPest(false), 2000);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 transition"
                    >
                      {copiedPest ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedPest ? "Copied Prescription!" : "Copy SMS"}</span>
                    </button>
                  </div>

                  <a
                    href="tel:18001801551"
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-200 transition"
                  >
                    <PhoneCall className="h-4 w-4 text-emerald-600" />
                    <span>{t("diag_helpline")} (1800-180-1551)</span>
                  </a>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
