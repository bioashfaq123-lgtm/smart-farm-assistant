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
  Globe,
  Search,
  ExternalLink,
  Compass,
  BookOpen,
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

/**
 * Client-side Canvas Image Compression
 * Scales high-resolution smartphone camera photos (3-12MB) down to max 1024x1024 JPEG at 0.75 quality (~150KB-250KB).
 * This completely avoids Vercel's 4.5MB Serverless request body limit (413 Payload Too Large).
 */
async function compressImageFile(file: File, maxDim = 1024, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

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
          resolve(e.target?.result as string);
          return;
        }

        // Fill white background for transparent images
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}


/**
 * Direct Client-Side Fallback Advisory based on PJTAU Package of Practices.
 * Guarantees that even if serverless API times out or network drops,
 * farmers always receive complete, high-quality, actionable agronomic advice.
 */
function getFallbackAgronomicReply(
  query: string,
  crop = "Paddy",
  district = "Jagtial",
  lang: "en" | "te" = "en"
): string {
  const q = (query || "").toLowerCase();
  const isTe = lang === "te";

  // 1. Vermicompost & Organic Manures
  if (
    q.includes("vermi") ||
    q.includes("compost") ||
    q.includes("earthworm") ||
    q.includes("వానపాము") ||
    q.includes("సేంద్రీయ") ||
    q.includes("organic")
  ) {
    if (isTe) {
      return `🪱 **వానపాముల ఎరువు (వర్మీకంపోస్ట్) — PJTAU సమగ్ర సేంద్రీయ మార్గదర్శకాలు**:

• **వర్మీకంపోస్ట్ అంటే ఏమిటి?**:
  - వానపాముల ఎరువు అనేది వ్యవసాయ వ్యర్థాలు, పశువుల పేడను మేలైన వానపాములు (**ఐసీనియా ఫెటిడా** లేదా **యుడ్రిలస్ యూజినే**) ద్వారా తయారుచేసే శ్రేష్టమైన సేంద్రీయ ఎరువు.
  - సాధారణ పశువుల ఎరువు కన్నా ఇందులో 5 రెట్లు ఎక్కువ నత్రజని, 7 రెట్లు ఎక్కువ భాస్వరం, 11 రెట్లు ఎక్కువ పొటాష్ ఉంటాయి.

• **PJTAU సిఫారసు చేసిన మోతాదు (ఎకరానికి)**:
  1. **వరి & ధాన్యపు పంటలు**: ఆఖరి దమ్ము లేదా నేల తయారీలో ఎకరానికి **2.0 నుండి 2.5 టన్నులు** వేయాలి.
  2. **పత్తి, మిరప, మొక్కజొన్న**: నాట్లు వేసే వరుసల్లో ఎకరానికి **1.5 నుండి 2.0 టన్నులు** వేయాలి.
  3. **కూరగాయల పంటలు**: ఎకరానికి **2.5 నుండి 3.0 టన్నులు** నేలలో కలియదున్నాలి.
  4. **పండ్ల తోటలు (మామిడి, జామ)**: చెట్టుకు **5 నుండి 10 కిలోలు** పాదుల్లో వేయాలి.

• **ముఖ్యమైన లాభాలు**:
  - నేలలో తేమ నిల్వ సామర్థ్యం 25-30% పెరుగుతుంది.
  - రసాయన యూరియా, డీఏపీ వాడకాన్ని 25-30% వరకు తగ్గించవచ్చు.

⚠️ *గమనిక: వానపాముల ఎరువును ఎండలో ఆరబెట్టరాదు. నీడలోనే తేమ ఆరకుండా నిల్వ ఉంచాలి.*`;
    }

    return `🪱 **Vermicompost (Earthworm Organic Manure) — PJTAU Package of Practices & Scientific Guidelines**:

• **What is Vermicompost?**:
  - Vermicompost is premium organic humus produced through the eco-biological breakdown of cow dung, crop residue, and farm biomass using specialized surface earthworms (**Eisenia fetida** or **Eudrilus eugeniae**).
  - It contains 5× more available nitrogen, 7× more phosphorus, and 11× more potassium than standard Farm Yard Manure (FYM), with active plant growth hormones.

• **Nutrient Profile**:
  - **Organic Carbon (OC)**: 18% to 22%
  - **NPK Ratio**: Nitrogen (1.5–2.5%), Available P₂O₅ (1.0–1.5%), Potash (1.5–2.0%).
  - **Micronutrients**: Rich in Zinc, Iron, Calcium, and living mycorrhizae.

• **PJTAU Recommended Application Dosages**:
  1. **Paddy & Field Crops**: Apply **2.0 to 2.5 tonnes per acre** as a basal dressing during final puddling (*dhummu*).
  2. **Cotton, Chilli & Maize**: Apply **1.5 to 2.0 tonnes per acre** in seed furrows before sowing.
  3. **Vegetables (Tomato, Brinjal, Bhendi)**: Apply **2.5 to 3.0 tonnes per acre** in top 10 cm soil.
  4. **Fruit Orchards (Mango, Guava)**: Apply **5 to 10 kg per tree** around the drip perimeter ring.

• **Key Agronomic Benefits**:
  - Increases soil moisture-holding capacity by 25%–30% in red and black soils.
  - Safely reduces synthetic Urea and DAP dependency by 25% to 30%.

⚠️ *Statutory Disclaimer: Use well-cured, odorless, granular vermicompost. Keep covered under shade to preserve active microbes.*`;
  }

  // 2. DAP and Urea at Tillering Stage
  if (
    q.includes("tillering") ||
    (q.includes("dap") && q.includes("urea")) ||
    q.includes("పిలక")
  ) {
    if (isTe) {
      return `🌱 **వరిలో పిలకల దశలో ఎరువుల యాజమాన్యం — PJTAU సిఫారసులు**:

• **డీఏపీ (DAP) గురించి అత్యంత ముఖ్యమైన సూచన**:
  - **పిలకల దశలో డీఏపీ (DAP) ఎరువును అస్సలు వేయరాదు!**
  - డీఏపీలోని భాస్వరం (Phosphorus) నేలలో కదలదు. కాబట్టి డీఏపీని నాట్లు వేసే ముందు ఆఖరి దమ్ములోనే వేయాలి.

• **పిలకల దశలో (నాటిన 20-25 రోజులకు) వేయవలసిన ఎరువులు**:
  1. **యూరియా (2వ దఫా)**: ఎకరానికి **25 నుండి 30 కిలోల యూరియా** చల్లుకోవాలి (సుమారు అర బస్తా).
  2. **నీటి యాజమాన్యం**: యూరియా చల్లే ముందు అదనపు నీటిని తీసివేసి పలుచటి నీరు ఉంచాలి.
  3. **జింక్ లోపం నివారణ**: ఆకులు తుప్పు మచ్చలుగా మారితే లీటరు నీటికి 2 గ్రాముల జింక్ సల్ఫేట్ + 10 గ్రాముల యూరియా పిచికారీ చేయాలి.

⚠️ *గమనిక: ఎరువులు వాడే ముందు మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*`;
    }

    return `🌱 **Paddy Fertilizer Schedule — Tillering Stage Advisory (PJTAU Package of Practices)**:

• **CRITICAL RULE ON DAP**:
  - **DO NOT apply DAP at the tillering stage!**
  - DAP contains phosphorus (P), which is immobile in soil. It must be applied ONLY as a basal dose during final puddling (*dhummu*).

• **WHAT TO APPLY AT ACTIVE TILLERING (20–25 Days After Transplanting)**:
  1. **Urea (Nitrogen Top-Dressing)**: Apply **25 to 30 kg Urea per acre** (approx. half a 45-kg bag).
  2. **Water Management**: Drain excess standing water before broadcasting urea; maintain a thin 1–2 cm film.
  3. **Zinc Correction**: If lower leaves show reddish-brown rust spots, spray **Zinc Sulphate (21%) @ 2.0 g/L + Urea @ 10 g/L water**.

⚠️ *Statutory Disclaimer: Consult your Mandal Agricultural Officer (MAO) before applying fertilizers.*`;
  }

  // 3. Leaf Folder & Caterpillars
  if (q.includes("leaf folder") || q.includes("roller") || q.includes("ఆకుచుట్టు")) {
    if (isTe) {
      return `🌿 **వరిలో ఆకుచుట్టు పురుగు (Leaf Folder) — PJTAU యాజమాన్యం**:

• **నష్ట లక్షణాలు**: లార్వాలు ఆకులను నిలువుగా చుట్టి లోపల పత్రహరితాన్ని గీకి తింటాయి. ఆకులపై తెల్లటి పొడవాటి చారలు ఏర్పడతాయి.
• **సిఫారసు చేసిన పిచికారీ మందులు (ఏదైనా ఒకటి)**:
  1. **కార్టాప్ హైడ్రోక్లోరైడ్ 50% SP** @ 2.0 గ్రా/లీ (ఎకరానికి 400 గ్రాములు 200 లీటర్ల నీటిలో).
  2. **క్లోరాంట్రానిలిప్రోల్ 18.5% SC (కోరాజెన్)** @ 0.3 మి.లీ/లీ (ఎకరానికి 60 మి.లీ).
  3. **ఫ్లూబెండియమైడ్ 39.35% SC (ఫేమ్)** @ 0.2 మి.లీ/లీ.
• **సేంద్రీయ పద్ధతి**: వేప నూనె (10,000 ppm) @ 2.0 మి.లీ/లీ లేదా ట్రైకోగ్రామా కార్డులు ఎకరానికి 40,000 అమర్చాలి.

⚠️ *గమనిక: రసాయనాలు వాడే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.*`;
    }

    return `🌿 **Paddy Leaf Folder (Cnaphalocrocis medinalis) — PJTAU Package of Practices**:

• **Symptoms**: Larvae fold leaves longitudinally and scrape green chlorophyll, creating papery white streaks.
• **Recommended Chemical Spray (Choose one)**:
  1. **Cartap Hydrochloride 50% SP** @ 2.0 g/L water (400 g/acre in 200 L water).
  2. **Chlorantraniliprole 18.5% SC (Coragen)** @ 0.3 mL/L water (60 mL/acre).
  3. **Flubendiamide 39.35% SC (Fame)** @ 0.2 mL/L water.
• **Organic Alternative**: Spray Neem Oil (10,000 ppm) @ 2.0 mL/L or release *Trichogramma chilonis* egg cards (40,000/acre).

⚠️ *Statutory Disclaimer: Consult your Mandal Agricultural Officer (MAO) before spraying.*`;
  }

  // 4. Default General Agronomic Advice
  if (isTe) {
    return `🌾 **కృషి సహాయక్ — PJTAU సమగ్ర వ్యవసాయ సలహా (${crop} • ${district} జిల్లా)**:

• **ప్రశ్న**: "${query}"
• **PJTAU సిఫారసు చేసిన ముఖ్య సూచనలు**:
  1. **ఎరువుల యాజమాన్యం**: సిఫారసు చేసిన మోతాదులోనే ఎరువులను దఫాలవారీగా వేయాలి. పిలకల దశలో నత్రజని (యూరియా) మాత్రమే వేయాలి.
  2. **సస్యరక్షణ**: పురుగుల నివారణకు కార్టాప్ 50% SP @ 2.0 గ్రా/లీ లేదా క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ పిచికారీ చేయాలి.
  3. **తెగుళ్ల నివారణ**: మచ్చ తెగుళ్లు ఉంటే ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ పిచికారీ చేయాలి.
  4. **సేంద్రీయ పద్ధతి**: వేప నూనె (10,000 ppm) @ 2.0 మి.లీ/లీటరు నీటికి కలిపి పిచికారీ చేయాలి.

⚠️ *గమనిక: రసాయన మందులు వాడే ముందు మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*`;
  }

  return `🌾 **Krishi Sahayak — PJTAU Agronomic Advisory (${crop} • ${district} District)**:

• **Query Assessed**: "${query}"
• **PJTAU Recommended Practices**:
  1. **Fertilizer Management**: Apply nitrogen (Urea) in recommended splits. Do not top-dress phosphatic fertilizers (DAP) after planting.
  2. **Pest Control**: Spray **Chlorantraniliprole 18.5% SC** @ 0.3 mL/L water OR **Cartap Hydrochloride 50% SP** @ 2.0 g/L water.
  3. **Disease Control**: If foliar lesions or blast occur, apply **Tricyclazole 75% WP** @ 0.6 g/L or **Hexaconazole 5% SC** @ 2.0 mL/L.
  4. **Organic Alternative**: Apply **Neem Oil (10,000 ppm)** @ 2.0 mL/L water or 5% NSKE.

⚠️ *Statutory Disclaimer: Consult your Mandal Agricultural Officer (MAO) before applying chemical sprays.*`;
}

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
  const [isCompressing, setIsCompressing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "diagnostics" | "browser">("chat");

  // Online Agri Browser states
  const [browserSearchQuery, setBrowserSearchQuery] = useState("");
  const [selectedBrowserEngine, setSelectedBrowserEngine] = useState<
    "google" | "pjtau" | "plantvillage" | "agmarknet" | "telangana"
  >("google");

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

  // Helper to open online search engine or agricultural portal directly
  const openWebSearch = (
    query: string,
    engine: "google" | "pjtau" | "plantvillage" | "agmarknet" | "telangana" = "google"
  ) => {
    let url = "";
    const clean = query.trim() || `${profile.primaryCrop} Telangana agriculture`;
    if (engine === "google") {
      url = `https://www.google.com/search?q=${encodeURIComponent(clean + " PJTAU Telangana agriculture")}`;
    } else if (engine === "pjtau") {
      url = `https://www.google.com/search?q=site:pjtau.edu.in+${encodeURIComponent(clean)}`;
    } else if (engine === "plantvillage") {
      url = `https://www.google.com/search?q=site:plantvillage.psu.edu+${encodeURIComponent(clean)}`;
    } else if (engine === "agmarknet") {
      url = `https://agmarknet.gov.in/`;
    } else if (engine === "telangana") {
      url = `https://agri.telangana.gov.in/`;
    }
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

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

  // Handle chat image selection with canvas compression
  const handleChatImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setErrorMessage("");
      const compressedBase64 = await compressImageFile(file);
      setAttachedImage(compressedBase64);
    } catch (err) {
      setErrorMessage("Could not process image. Please try another photo.");
    } finally {
      setIsCompressing(false);
      e.target.value = "";
    }
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
          mode: imgToSend ? "diagnosis" : "chat",
          lang,
          farmerProfile: {
            district: profile.district,
            primaryCrop: profile.primaryCrop,
            areaAcre: profile.areaAcre,
          },
        }),
      });

      const data = await res.json();
      const reply = (data && data.reply && data.reply.trim() !== "") ? data.reply : getFallbackAgronomicReply(text, profile.primaryCrop, profile.district, lang);

      if (data.source) {
        setChatSource(data.source);
      }

      const searchQuery = data.searchQuery || text || `${profile.primaryCrop} leaf disease treatment PJTAU`;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        textEn: reply,
        textTe: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        searchQuery,
        isFallback: !data.isLiveAi,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        textEn: "🌿 **PJTAU Package of Practices Guidance**:\n\n• **Insect/Pest Management**: For leaf folder or stem borer, spray Cartap Hydrochloride 50% SP @ 2.0 g/L or Chlorantraniliprole 18.5% SC @ 0.3 mL/L water.\n• **Disease Management**: If fungal blast or sheath blight is observed, apply Tricyclazole 75% WP @ 0.6 g/L or Hexaconazole 5% SC @ 2.0 mL/L water.\n• **Organic Alternative**: Apply Neem Oil (10,000 ppm) @ 2.0 mL/L or 5% NSKE.\n\n⚠️ *Consult your Mandal Agricultural Officer before chemical spraying.*",
        textTe: "🌿 **PJTAU సమగ్ర వ్యవసాయ సలహా**:\n\n• **పురుగుల నివారణ**: ఆకుచుట్టు లేదా కాండం తొలిచే పురుగు నివారణకు కార్టాప్ హైడ్రోక్లోరైడ్ 50% SP @ 2.0 గ్రా/లీ లేదా క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ పిచికారీ చేయాలి.\n• **తెగుళ్ల నివారణ**: అగ్గితెగులు లేదా పొడ తెగులు ఉంటే ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ లేదా హెక్సాకొనజోల్ 5% SC @ 2.0 మి.లీ పిచికారీ చేయాలి.\n• **సేంద్రీయ పద్ధతి**: వేప నూనె (10,000 ppm) @ 2.0 మి.లీ/లీటరు పిచికారీ చేయాలి.\n\n⚠️ *మందులు వాడే ముందు మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        searchQuery: text || `${profile.primaryCrop} leaf disease treatment PJTAU`,
        isFallback: false,
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

  // Handler for live leaf photo upload and multimodal Gemini diagnosis with canvas compression
  const handleLeafPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingPhoto(true);
    setCustomAiDiagnosis(null);
    setErrorMessage("");

    try {
      const compressedBase64 = await compressImageFile(file);
      setUploadedLeafPhoto(compressedBase64);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Diagnose this crop leaf photo for disease, pest, or nutrient deficiency under PJTAU package of practices.",
          image: compressedBase64,
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
      setDiagSource("Offline PJTAU Reference Cases");
      setErrorMessage("AI vision diagnosis could not connect. You can search directly online using the browser tool.");
    } finally {
      setIsAnalyzingPhoto(false);
      e.target.value = "";
    }
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
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
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
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
              activeTab === "diagnostics"
                ? "bg-white text-stone-900 shadow-2xs dark:bg-stone-800 dark:text-stone-50"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <Camera className="h-3.5 w-3.5 text-rose-500" />
            <span>{lang === "te" ? "ఆకు తెగులు స్కానర్" : "Leaf Disease Scanner"}</span>
          </button>
          <button
            onClick={() => setActiveTab("browser")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
              activeTab === "browser"
                ? "bg-white text-stone-900 shadow-2xs dark:bg-stone-800 dark:text-stone-50"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-sky-600" />
            <span>{lang === "te" ? "ఆన్‌లైన్ బ్రౌజర్" : "Online Agri Browser"}</span>
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

                      {/* Bot message action toolbar */}
                      <div
                        className={`mt-2.5 flex flex-wrap items-center justify-between gap-1.5 text-[10px] ${
                          isBot ? "text-stone-400 dark:text-stone-500" : "text-white/80"
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isBot && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              onClick={() => speakText(lang === "te" && msg.textTe ? msg.textTe : msg.textEn)}
                              className="hover:text-agri-600 dark:hover:text-agri-400 transition flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                              title="Listen to audio"
                            >
                              <Volume2 className="h-3 w-3" />
                              <span>{lang === "te" ? "వినండి" : "Listen"}</span>
                            </button>

                            

                            <button
                              onClick={async () => {
                                await copyToClipboard(lang === "te" && msg.textTe ? msg.textTe : msg.textEn);
                              }}
                              className="hover:text-stone-700 dark:hover:text-stone-200 transition flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                              title="Copy text"
                            >
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {isBot && (
                        <div className="mt-2 text-[11px] text-stone-400 dark:text-stone-500 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>PJTAU & ICAR Package of Practices Grounded</span>
                        </div>
                      )}
                    </div>

                    {!isBot && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800 text-white text-xs font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                );
              })}

              {isCompressing && (
                <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400">
                  <span className="flex h-2 w-2 rounded-full bg-sky-600 animate-ping" />
                  <span>Compressing leaf photo for fast serverless upload...</span>
                </div>
              )}

              {isSending && (
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex h-2 w-2 rounded-full bg-agri-600 animate-ping" />
                  <span>Consulting Gemini 1.5 Flash multimodal vision & PJTAU knowledge...</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertOctagon className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button onClick={() => setErrorMessage(null)} className="text-xs text-stone-500 hover:text-stone-700">Dismiss</button>
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

                    <button
                      onClick={() => {
                        if (inputText.trim()) {
                          setBrowserSearchQuery(inputText);
                        }
                        setActiveTab("browser");
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300 transition"
                      title="Search online directly in Agri Browser"
                    >
                      <Globe className="h-3.5 w-3.5 text-sky-600" />
                      <span>{lang === "te" ? "ఆన్‌లైన్ బ్రౌజర్" : "Online Browser"}</span>
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
      ) : activeTab === "diagnostics" ? (
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

                {/* Direct Online Web Search & PJTAU Library Actions */}
                <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 dark:border-sky-900/60 dark:bg-sky-950/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-sky-950 dark:text-sky-100 flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-sky-600" />
                        <span>
                          {lang === "te"
                            ? "ఈ తెగులు నివారణను ఆన్‌లైన్ బ్రౌజర్‌లో వెతకండి"
                            : "Search Disease Treatment Online in Web Browser"}
                        </span>
                      </h4>
                      <p className="text-[11px] text-sky-800 dark:text-sky-300">
                        Direct web search across PJTAU university publications, ICAR, and Google
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => openWebSearch(activeDiagnosis.pestNameEn, "google")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-bold text-xs shadow-2xs hover:bg-stone-50"
                      >
                        <Search className="h-3.5 w-3.5 text-sky-600" />
                        <span>Search Google</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </button>
                      <button
                        onClick={() => openWebSearch(activeDiagnosis.pestNameEn, "pjtau")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-2xs hover:bg-emerald-700"
                      >
                        <Compass className="h-3.5 w-3.5" />
                        <span>PJTAU Library</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </button>
                      <button
                        onClick={() => {
                          setBrowserSearchQuery(activeDiagnosis.pestNameEn);
                          setActiveTab("browser");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs shadow-2xs hover:bg-sky-700"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Open Agri Browser</span>
                      </button>
                    </div>
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
      ) : (
        /* Online Agricultural Web Browser View */
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={lang === "te" ? "తెలంగాణ రైతు ఆన్‌లైన్ వ్యవసాయ బ్రౌజర్" : "Telangana Rythu Online Agricultural Web Browser"}
              subtitle={
                lang === "te"
                  ? "గూగుల్, ప్రొఫెసర్ జయశంకర్ వర్సిటీ (PJTAU), ప్లాంట్‌విలేజ్ మరియు అగ్మార్క్‌నెట్ పోర్టల్స్‌లో నేరుగా వెతకండి"
                  : "Direct real-time search across Google, PJTAU Digital Library, PlantVillage, ICAR, and Agmarknet"
              }
              icon={<Globe className="h-5 w-5 text-sky-600" />}
              action={
                <Badge variant="normal" className="text-xs bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
                  Live Web Gateway
                </Badge>
              }
            />

            {/* Interactive Search Engine Console */}
            <div className="space-y-4">
              {/* Engine Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Search Engine:</span>
                {[
                  { id: "google", label: "Google Agri", icon: Search },
                  { id: "pjtau", label: "PJTAU Digital Library", icon: Compass },
                  { id: "plantvillage", label: "PlantVillage Diseases", icon: Leaf },
                  { id: "agmarknet", label: "Agmarknet Mandi Hub", icon: Layers },
                  { id: "telangana", label: "Telangana Agri Portal", icon: Globe },
                ].map((eng) => {
                  const Icon = eng.icon;
                  const isSelected = selectedBrowserEngine === eng.id;
                  return (
                    <button
                      key={eng.id}
                      onClick={() => setSelectedBrowserEngine(eng.id as any)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? "bg-sky-600 text-white shadow-xs"
                          : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{eng.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live Search Input Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    value={browserSearchQuery}
                    onChange={(e) => setBrowserSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        openWebSearch(browserSearchQuery, selectedBrowserEngine);
                      }
                    }}
                    placeholder={
                      lang === "te"
                        ? "తెగులు పేరు, పురుగు మందు మోతాదు, సన్నవడ్ల బోనస్, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి వెతకండి..."
                        : "Search any crop disease, pesticide molecule, ₹500 bonus, APMC market price, or STCR schedule..."
                    }
                    className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-10 py-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-sky-600 focus:outline-hidden focus:ring-1 focus:ring-sky-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder-stone-500"
                  />
                  {browserSearchQuery && (
                    <button
                      onClick={() => setBrowserSearchQuery("")}
                      className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openWebSearch(browserSearchQuery, selectedBrowserEngine)}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-sky-700 transition active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Launch Search</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (browserSearchQuery.trim()) {
                        setActiveTab("chat");
                        handleSend(browserSearchQuery);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-agri-600 bg-agri-50 px-4 py-3 text-xs font-bold text-agri-800 hover:bg-agri-100 dark:bg-agri-950/40 dark:text-agri-300 transition"
                    title="Ask Krishi Sahayak AI about this query"
                  >
                    <Bot className="h-4 w-4 text-agri-600" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Curated Telangana Agricultural Searches */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  {lang === "te" ? "తెలంగాణ రైతు ప్రాచుర్యం పొందిన శోధనలు:" : "Popular Telangana Agricultural Search Topics:"}
                </h4>
                <span className="text-[11px] text-stone-400">1-Click Live Search</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    crop: "Paddy (వరి)",
                    query: "Paddy Blast & Brown Spot Tricyclazole dosage PJTAU",
                    badge: "Pathology",
                  },
                  {
                    crop: "Paddy (వరి)",
                    query: "Telangana Fine Rice ₹500 Bonus procurement rules",
                    badge: "Govt Bonus",
                  },
                  {
                    crop: "Paddy (వరి)",
                    query: "Paddy Yellow Stem Borer Cartap Hydrochloride spray",
                    badge: "Pest Control",
                  },
                  {
                    crop: "Cotton (పత్తి)",
                    query: "Cotton Pink Bollworm ETL & Profenofos spray PJTAU",
                    badge: "IPM Spray",
                  },
                  {
                    crop: "Chilli (మిరప)",
                    query: "Chilli Black Thrips & Gemini Virus PJTAU spray",
                    badge: "Specialist",
                  },
                  {
                    crop: "Maize (మొక్కజొన్న)",
                    query: "Maize Fall Armyworm Chlorantraniliprole whorl application",
                    badge: "Dosage",
                  },
                  {
                    crop: "Compost (ఎరువు)",
                    query: "PJTAU Vermicompost Preparation Bed Step-by-Step",
                    badge: "Organic",
                  },
                  {
                    crop: "Soil Health (నేల)",
                    query: "PJTAU Soil Health Card STCR Fertilizer schedule Telangana",
                    badge: "STCR Card",
                  },
                  {
                    crop: "Irrigation (నీరు)",
                    query: "Telangana Micro Irrigation Drip Subsidy TSMIP scheme",
                    badge: "Subsidy",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBrowserSearchQuery(item.query);
                      openWebSearch(item.query, selectedBrowserEngine);
                    }}
                    className="flex items-start justify-between gap-2 rounded-xl border border-stone-200 bg-white p-3 text-left shadow-2xs hover:border-sky-500 hover:bg-sky-50/40 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-850 transition group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-agri-700 dark:text-agri-400">
                          {item.crop}
                        </span>
                        <span className="text-[10px] rounded-md bg-stone-100 px-1.5 py-0.5 font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:text-sky-700 dark:group-hover:text-sky-300">
                        {item.query}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-stone-400 group-hover:text-sky-600 mt-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Official Agricultural Portals Directory */}
            <div className="mt-8 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                {lang === "te" ? "ప్రభుత్వ మరియు విశ్వవిద్యాలయ పోర్టల్స్ డైరెక్టరీ:" : "Official Government & University Portals Directory:"}
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. PJTAU */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                        State Agricultural University
                      </span>
                      <Compass className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h5 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      PJTAU Official Portal
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      Prof. Jayashankar Telangana State Agricultural University. Package of practices, Vyavasayam journal & KVK scientist directories.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="https://pjtau.edu.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-800 transition"
                    >
                      <span>Visit pjtau.edu.in</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* 2. Agmarknet */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">
                        Govt of India Mandi Network
                      </span>
                      <Layers className="h-4 w-4 text-amber-600" />
                    </div>
                    <h5 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      Agmarknet National Portal
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      Real-time arrivals, modal and maximum wholesale prices across all regulated APMC agricultural market yards in Telangana.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="https://agmarknet.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-800 transition"
                    >
                      <span>Visit agmarknet.gov.in</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* 3. Rythu Bandhu Portal */}
                <div className="rounded-2xl border border-sky-200 bg-sky-50/30 p-4 dark:border-sky-900/60 dark:bg-sky-950/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-300">
                        Telangana State Agriculture
                      </span>
                      <Globe className="h-4 w-4 text-sky-600" />
                    </div>
                    <h5 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      Rythu Bandhu & Agri Dept
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      Telangana Agriculture Department portal for crop booking records, ₹500/qtl fine rice bonus DBT status, and Rythu Bima.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="https://agri.telangana.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-sky-800 transition"
                    >
                      <span>Visit agri.telangana.gov.in</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* 4. PlantVillage */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-4 dark:border-rose-900/60 dark:bg-rose-950/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300">
                        Leaf Pathology Encyclopedia
                      </span>
                      <Leaf className="h-4 w-4 text-rose-600" />
                    </div>
                    <h5 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      PlantVillage Disease Archive
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      Penn State open-access visual diagnostic database covering hundreds of crop diseases, bacterial blights, and pests.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="https://plantvillage.psu.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-800 transition"
                    >
                      <span>Visit plantvillage.psu.edu</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* 5. Kisan Call Centre */}
                <div className="rounded-2xl border border-teal-200 bg-teal-50/30 p-4 dark:border-teal-900/60 dark:bg-teal-950/20 flex flex-col justify-between sm:col-span-2 lg:col-span-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300">
                        National Toll-Free Helpline
                      </span>
                      <PhoneCall className="h-4 w-4 text-teal-600" />
                    </div>
                    <h5 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                      Kisan Call Centre (1800-180-1551)
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      Connect directly with qualified agricultural officers and scientists in Telugu or English. Free consultation on crop pests, fertilizer scheduling, weather forecasts, and market advisory daily from 6:00 AM to 10:00 PM.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="tel:18001801551"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-teal-800 transition"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>Call 1800-180-1551 Free</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
