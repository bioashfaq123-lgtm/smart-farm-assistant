"use client";

import React, { useState } from "react";
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
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "diagnostics">("chat");
  const [selectedCase, setSelectedCase] = useState<PestDiagnosticCase>(SAMPLE_PEST_DIAGNOSTICS[0]);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
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

  const sampleSuggestions = [
    {
      en: "How to identify and treat Paddy Blast?",
      te: "వరిలో అగ్గితెగులు నివారణకు మందు ఏమిటి?",
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

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setErrorMessage("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      textEn: text,
      textTe: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang,
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

  const handleSimulatePhotoUpload = (pestCase: PestDiagnosticCase) => {
    setIsAnalyzingPhoto(true);
    setSelectedCase(pestCase);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("advisory_title")}
            </h1>
            <Badge variant="normal">{t("advisory_badge_ai")}</Badge>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              {chatSource}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("advisory_subtitle")}
          </p>
        </div>

        {/* Tab switch between Chat and Photo Diagnostics */}
        <div className="mt-3 sm:mt-0 flex items-center rounded-xl border border-stone-200 bg-stone-100/80 p-1 dark:border-stone-800 dark:bg-stone-900">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "chat"
                ? "bg-white text-agri-800 shadow-2xs dark:bg-stone-800 dark:text-agri-300"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "చాట్ సంభాషణ" : "AI Advisor Chat"}</span>
          </button>
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "diagnostics"
                ? "bg-white text-agri-800 shadow-2xs dark:bg-stone-800 dark:text-agri-300"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            <Camera className="h-3.5 w-3.5 text-rose-500" />
            <span>{t("diag_tab_title")}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Chatbot Safety Notice Banner */}
      <SafetyNotice />

      {activeTab === "chat" ? (
        /* 2-Column Advisory Chat Layout (Matching Screenshot 3) */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Chat Conversation Window (2 Cols) */}
          <Card className="lg:col-span-2 flex flex-col justify-between min-h-[580px] p-0 overflow-hidden">
            {/* Chat Stream Header */}
            <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-agri-700 text-white shadow-xs">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Krishi Sahayak Assistant
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    PJTAU Vyavasaya Panchangam Knowledge Engine
                  </p>
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
                  <span>Consulting PJTAU agronomic intelligence...</span>
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
                  placeholder={t("advisory_input_placeholder")}
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
                      onClick={() => setActiveTab("diagnostics")}
                      className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 transition"
                    >
                      <Camera className="h-3.5 w-3.5 text-agri-600" />
                      <span>{t("advisory_btn_image")}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
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
                    className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-850"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {lang === "te" ? tip.titleTe : tip.titleEn}
                      </h4>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${tip.badgeColor}`}
                      >
                        {lang === "te" ? tip.categoryTe : tip.categoryEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {lang === "te" ? tip.descTe : tip.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-emerald-50/50 border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Telangana Extension Helpline</span>
              </h4>
              <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                For direct telephone consultation with PJTAU scientists, dial Toll-Free <b>1800 425 3536</b> (Working hours 10 AM – 5 PM).
              </p>
            </Card>
          </div>
        </div>
      ) : (
        /* Phase 2: Leaf & Pest Photo Pathology Diagnostic View */
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={t("diag_tab_title")}
              subtitle={t("diag_subtitle")}
              icon={<Camera className="h-5 w-5 text-rose-500" />}
              action={<Badge variant="outline" className="text-xs">PJTAU Reference Cases</Badge>}
            />

            {/* Step 1: Select Sample Crop Leaf or Upload */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                1. {t("diag_sample_btn")}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SAMPLE_PEST_DIAGNOSTICS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSimulatePhotoUpload(item)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                      selectedCase.id === item.id
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

            {/* Step 2: Diagnostic Pathology Result Card */}
            {isAnalyzingPhoto ? (
              <div className="my-8 flex flex-col items-center justify-center py-10 text-stone-500">
                <span className="h-8 w-8 animate-spin rounded-full border-3 border-agri-600 border-t-transparent" />
                <p className="mt-3 text-xs font-medium">{t("diag_analyzing")}</p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-agri-700 dark:text-agri-400">
                      {t("diag_identified")}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 dark:text-stone-50">
                      {lang === "te" ? selectedCase.pestNameTe : selectedCase.pestNameEn}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Crop: <b className="text-stone-800 dark:text-stone-200">{lang === "te" ? selectedCase.cropTe : selectedCase.cropEn}</b>
                    </p>
                  </div>
                  <Badge variant={selectedCase.severity === "high" ? "critical" : "warning"} className="self-start sm:self-auto py-1 px-3">
                    {selectedCase.severity.toUpperCase()} RISK LEVEL
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
                      {lang === "te" ? selectedCase.symptomsTe : selectedCase.symptomsEn}
                    </p>
                  </div>

                  <div className="rounded-xl bg-agri-50/60 p-4 dark:bg-agri-950/30 space-y-1 border border-agri-200/60 dark:border-agri-900/40">
                    <h4 className="text-xs font-bold text-agri-900 dark:text-agri-200 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-agri-600" />
                      <span>{t("diag_remedy")}</span>
                    </h4>
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === "te" ? selectedCase.recommendedSprayTe : selectedCase.recommendedSprayEn}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 pt-1">
                      <b>{t("diag_dosage")}:</b> {lang === "te" ? selectedCase.dosageTe : selectedCase.dosageEn}
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
                      {lang === "te" ? selectedCase.organicAlternativeTe : selectedCase.organicAlternativeEn}
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-1">
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>{t("diag_safety")}</span>
                    </h4>
                    <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                      {lang === "te" ? selectedCase.ppePrecautionsTe : selectedCase.ppePrecautionsEn}
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
                            ? `నా పొలంలో ${selectedCase.pestNameTe} గుర్తించబడింది. మరింత సలహా ఇవ్వండి.`
                            : `Detected ${selectedCase.pestNameEn} in field. Please give step-by-step guidance.`
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
                            crop: selectedCase.cropEn,
                            cropTe: selectedCase.cropTe,
                            pestName: selectedCase.pestNameEn,
                            pestNameTe: selectedCase.pestNameTe,
                            remedy: selectedCase.recommendedSprayEn,
                            remedyTe: selectedCase.recommendedSprayTe,
                            dosage: selectedCase.dosageEn,
                            dosageTe: selectedCase.dosageTe,
                            organic: selectedCase.organicAlternativeEn,
                            organicTe: selectedCase.organicAlternativeTe,
                            ppe: selectedCase.ppePrecautionsEn,
                            ppeTe: selectedCase.ppePrecautionsTe,
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
                            crop: selectedCase.cropEn,
                            cropTe: selectedCase.cropTe,
                            pestName: selectedCase.pestNameEn,
                            pestNameTe: selectedCase.pestNameTe,
                            remedy: selectedCase.recommendedSprayEn,
                            remedyTe: selectedCase.recommendedSprayTe,
                            dosage: selectedCase.dosageEn,
                            dosageTe: selectedCase.dosageTe,
                            organic: selectedCase.organicAlternativeEn,
                            organicTe: selectedCase.organicAlternativeTe,
                            ppe: selectedCase.ppePrecautionsEn,
                            ppeTe: selectedCase.ppePrecautionsTe,
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
