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
} from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";
import { DemoBadge } from "@/components/common/DemoBadge";
import { SafetyNotice } from "@/components/common/SafetyNotice";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  INITIAL_CHAT_MESSAGES,
  SAMPLE_ADVISORY_TIPS,
} from "@/lib/data/sampleData";
import { ChatMessage } from "@/lib/types";

export default function AdvisoryPage() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sampleSuggestions = [
    {
      en: "How to identify yellow stem borer in paddy?",
      te: "వరిలో కాండం తొలిచే పురుగును ఎలా గుర్తించాలి?",
    },
    {
      en: "Optimal drip irrigation schedule during flowering stage?",
      te: "పూత దశలో డ్రిప్ ద్వారా నీటి తడులు ఎలా ఇవ్వాలి?",
    },
    {
      en: "Can I spray bio-fungicides before tomorrow's rain?",
      te: "రేపు వర్షం పడే ముందు మందుల పిచికారీ చేయవచ్చా?",
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

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

    // Simulate AI response with Chatbot Safety Rules adhered to
    setTimeout(() => {
      let replyEn = "Based on PJTAU guidelines, ensure field moisture is adequate. For chemical dosages or specific brand formulations, always check the physical product container label and confirm with your village Agriculture Extension Officer (AEO). Always wear rubber gloves, mask, and goggles during spray application.";
      let replyTe = "PJTAU వ్యవసాయ మార్గదర్శకాల ప్రకారం పొలంలో తగినంత తేమ ఉండేలా చూసుకోండి. రసాయన మందుల మోతాదులు మరియు బ్రాండ్ల వివరాల కోసం తప్పనిసరిగా మందు సీసాపై ఉన్న లేబుల్ చదవండి మరియు మీ గ్రామ వ్యవసాయ అధికారి (AEO)ని సంప్రదించండి. పిచికారీ సమయంలో తప్పనిసరిగా చేతి తొడుగులు, మాస్క్ ధరించండి.";

      if (text.toLowerCase().includes("borer") || text.includes("పురుగు")) {
        replyEn = "Yellow stem borer causes dead hearts in vegetative stage and white ears at panicle stage. Install 4 pheromone traps per acre. For chemical interventions, please consult your local Mandal Agriculture Officer (MAO) for approved active ingredients and follow label directions strictly. Always wear full protective equipment.";
        replyTe = "కాండం తొలిచే పురుగు ఆశిస్తే పిలక దశలో ఎండిన పిలకలు, వెన్ను దశలో తెల్ల కంకులు వస్తాయి. ఎకరాకు 4 లింగాకర్షక బుట్టలు పెట్టండి. మందుల పిచికారీ కోసం మీ స్థానిక వ్యవసాయ అధికారి (MAO) సూచించిన మందును మాత్రమే లేబుల్ మోతాదు ప్రకారం వాడండి. రక్షణ తొడుగులు తప్పనిసరి.";
      } else if (text.toLowerCase().includes("rain") || text.includes("వర్షం")) {
        replyEn = "With 70% rain probability forecasted, postpone all foliar nutrient and chemical sprays. Rain will wash off the active chemicals, leading to economic loss and chemical runoff into waterways.";
        replyTe = "రేపు 70% వర్షం పడే అవకాశం ఉన్నందున ఎటువంటి రసాయన లేదా సేంద్రియ పిచికారీలను వాయిదా వేయండి. వర్షానికి మందు కొట్టుకుపోయి వృథా అవుతుంది.";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        textEn: replyEn,
        textTe: replyTe,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsSending(false);
    }, 1000);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText(
          lang === "te"
            ? "వరి ఆకులపై తెగులు మచ్చలు కనిపిస్తున్నాయి, ఏమి చేయాలి?"
            : "Showing brown leaf spots on paddy, what precautions to take?"
        );
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              {t("advisory_title")}
            </h1>
            <Badge variant="normal">{t("advisory_badge_ai")}</Badge>
            <DemoBadge subtle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {t("advisory_subtitle")}
          </p>
        </div>
      </div>

      {/* Mandatory Chatbot Safety Notice Banner */}
      <SafetyNotice />

      {/* 2-Column Advisory Layout (Matching Screenshot 3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Chat Conversation Window (2 Cols) */}
        <Card className="lg:col-span-2 flex flex-col justify-between min-h-[560px] p-0 overflow-hidden">
          {/* Chat Stream Header */}
          <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-900/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-agri-700 text-white shadow-xs">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Krishi-GPT Assistant
                </h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready to assist in Telugu & English
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
                    <p>{lang === "te" && msg.textTe ? msg.textTe : msg.textEn}</p>
                    <div
                      className={`mt-2 flex items-center justify-between text-[10px] ${
                        isBot ? "text-stone-400 dark:text-stone-500" : "text-white/80"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isBot && (
                        <button
                          onClick={() => alert("Audio playback simulated in demo mode.")}
                          className="hover:text-agri-600 dark:hover:text-agri-400 transition"
                          title="Listen to audio"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800 text-white text-xs font-bold">
                      MG
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span className="flex h-2 w-2 rounded-full bg-agri-600 animate-ping" />
                <span>Krishi Sahayak is formulating agronomic guidance...</span>
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

          {/* Input Action Bar (Matching Screenshot 3) */}
          <div className="border-t border-stone-200 p-3 sm:p-4 dark:border-stone-800 bg-white dark:bg-stone-900">
            {isRecording && (
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 animate-pulse">
                <Mic className="h-4 w-4" />
                <span>{t("advisory_listening")}</span>
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

                  <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 transition">
                    <Camera className="h-3.5 w-3.5 text-agri-600" />
                    <span>{t("advisory_btn_image")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleSend(
                            lang === "te"
                              ? "నేను పంట ఆకుల ఫోటోను అప్‌లోడ్ చేశాను. తెగులు లక్షణాలను విశ్లేషించండి."
                              : "Uploaded leaf photo. Please analyze disease symptoms."
                          );
                        }
                      }}
                    />
                  </label>
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

        {/* Right Rail: Quick Tips & Agronomic Practices (1 Col) */}
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
    </div>
  );
}
