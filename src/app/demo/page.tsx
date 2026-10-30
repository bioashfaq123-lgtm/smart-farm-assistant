"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Presentation,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  CloudRain,
  Sun,
  Activity,
  Power,
  Microscope,
  Volume2,
  VolumeX,
  TrendingUp,
  Calculator,
  Share2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Download,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  Clock,
  Sparkle,
} from "lucide-react";
import { calculateFertilizer } from "@/lib/calculators/fertCalc";
import { calculateSeedRate, CROP_CONFIGS } from "@/lib/calculators/seedCalc";
import { useFarmerProfile } from "@/components/common/FarmerProfileContext";

// 7 Conference Presentation Steps
const DEMO_STEPS = [
  {
    id: 1,
    titleEn: "Low Moisture Alert",
    titleTe: "నేల తేమ హెచ్చరిక",
    descEn: "Capacitive sensor triggers sub-20% deficit alert",
    descTe: "20% కంటే తక్కువ తేమ ఉన్నప్పుడు హెచ్చరిక",
  },
  {
    id: 2,
    titleEn: "Pump ON Animation",
    titleTe: "పంపు ఆటో ఆన్",
    descEn: "Submersible pump hums, moisture animates to 31.5%",
    descTe: "పంపు నడచి తేమ 31.5%కి చేరుకుంటుంది",
  },
  {
    id: 3,
    titleEn: "Rain-Skip Pauses Pump",
    titleTe: "రెయిన్-స్కిప్ ఇంటర్‌లాక్",
    descEn: "Tomorrow's 85% rain forecast pauses irrigation",
    descTe: "రేపటి వర్ష సూచనతో పంపు ఆపివేయబడుతుంది",
  },
  {
    id: 4,
    titleEn: "Offline PJTAU Calculators",
    titleTe: "ఎరువులు & విత్తనాల లెక్క",
    descEn: "Pure TypeScript fertilizer & seed dosage",
    descTe: "ఇంటర్నెట్ లేకుండా ఖచ్చితమైన మోతాదు",
  },
  {
    id: 5,
    titleEn: "Krishi Sahayak Q&A",
    titleTe: "కృషి సహాయక్ ప్రశ్నలు",
    descEn: "4 bundled agronomy answers with statutory disclaimer",
    descTe: "4 ముఖ్యమైన రైతు ప్రశ్నలు మరియు సమాధానాలు",
  },
  {
    id: 6,
    titleEn: "Sample Leaf Disease Scanner",
    titleTe: "పంట తెగుళ్ల గుర్తింపు",
    descEn: "3 recorded sample leaves with vector graphics",
    descTe: "3 రికార్డ్ చేసిన ఆకు తెగుళ్ల నమూనాలు",
  },
  {
    id: 7,
    titleEn: "Sample Mandi Prices",
    titleTe: "మార్కెట్ ధరలు & ₹500 బోనస్",
    descEn: "Telangana APMC rates, MSP + ₹500 bonus & WhatsApp share",
    descTe: "తెలంగాణ మార్కెట్ ధరలు మరియు వాట్సాప్ షేర్",
  },
];

// Bundled Krishi Sahayak Q&A for Step 5
const BUNDLED_QA = [
  {
    id: 1,
    qEn: "How much DAP and Urea should I apply for Paddy at panicle initiation?",
    qTe: "వరిలో చిరుపొట్ట దశలో ఎంత డీఏపీ మరియు యూరియా వేయాలి?",
    aEn: "At panicle initiation (PI stage, ~55-60 days for RNR 15048), DO NOT apply DAP (phosphorus should be basal only). Apply the 2nd/3rd split of Urea at 25-30 kg/acre along with MOP (Potash) at 15-20 kg/acre for bold grain filling. Maintain 2-3 cm thin water layer during application.",
    aTe: "వరిలో చిరుపొట్ట దశలో డీఏపీ అస్సలు వేయరాదు (భాస్వరం దుక్కిలోనే వేయాలి). ఎకరానికి 25-30 కిలోల యూరియా మరియు 15-20 కిలోల పొటాష్ (MOP) కలిపి వేయాలి. దీనివల్ల గింజ బరువు మరియు నాణ్యత పెరుగుతుంది. పొలంలో పలుచగా నీరు ఉండాలి.",
    badge: "Paddy • వరి",
  },
  {
    id: 2,
    qEn: "Yellowing on lower leaves in cotton - is it magnesium deficiency or nitrogen?",
    qTe: "పత్తిలో క్రింది ఆకులు పసుపుగా మారడం - మెగ్నీషియం లోపమా లేక నత్రజని లోపమా?",
    aEn: "Check leaf venation: Nitrogen deficiency shows uniform pale yellowing starting from leaf tips of older lower leaves. Magnesium deficiency causes interveinal chlorosis (veins stay green while leaf tissue turns yellow, later purplish-red). For Mg deficiency, spray Magnesium Sulphate (MgSO4) @ 10g/L water twice at 15-day interval.",
    aTe: "నత్రజని లోపమైతే ముదిరిన ఆకుల చివర్ల నుండి మొత్తం ఆకు లేత పసుపు రంగులోకి మారుతుంది. మెగ్నీషియం లోపమైతే ఆకు ఈనెలు పచ్చగా ఉండి, ఈనెల మధ్య భాగం పసుపు లేదా ఎరుపు రంగులోకి మారుతుంది. మెగ్నీషియం లోపానికి ఎకరానికి 1 కిలో మెగ్నీషియం సల్ఫేట్ 100 లీటర్ల నీటిలో కలిపి పిచికారీ చేయాలి.",
    badge: "Cotton • పత్తి",
  },
  {
    id: 3,
    qEn: "Water is scarce in borewell - how many days interval for maize?",
    qTe: "బోరుబావిలో నీరు తక్కువగా ఉంది - మొక్కజొన్నకు ఎన్ని రోజులకోసారి నీరు పెట్టాలి?",
    aEn: "Maize has two non-negotiable critical moisture periods: Tasseling (పూత దశ, 45-55 DAS) and Silking/Grain Filling (గింజ పాలుపోసుకునే దశ, 60-75 DAS). During early vegetative stage, alternate furrow irrigation can stretch the interval to 10-12 days in red soils. But do not allow water stress during silking as yield drops by up to 40%.",
    aTe: "మొక్కజొన్నలో పూత దశ (45-55 రోజులు) మరియు గింజ పాలుపోసుకునే దశ (60-75 రోజులు) అత్యంత కీలకమైనవి. ఈ దశలలో తేమ లోపిస్తే 40% దిగుబడి తగ్గుతుంది. నీటి కొరత ఉన్నప్పుడు ఒక సాలు విడిచి ఒక సాలుకు (Alternate furrow) నీరు పారించడం ద్వారా 35% నీటిని ఆదా చేయవచ్చు.",
    badge: "Maize • మొక్కజొన్న",
  },
  {
    id: 4,
    qEn: "How to claim the ₹500/quintal Telangana Fine Rice bonus?",
    qTe: "తెలంగాణ సన్నవడ్ల ₹500/క్వింటాల్ బోనస్ ఎలా పొందాలి?",
    aEn: "To receive the ₹500/quintal State Bonus for Fine Paddy (సన్న రకాలు like RNR 15048, BPT 5204): 1. Ensure crop is recorded in Rythu Bandhu / crop booking portal by your AEO. 2. Bring Aadhaar, Pattadar Passbook, and Bank Account linked to NPCI to the APMC procurement center (PPC/IKP). 3. Moisture must be below 17%. Payout is ₹2,320 MSP + ₹500 bonus = ₹2,820/quintal directly into your bank account.",
    aTe: "తెలంగాణ ప్రభుత్వ సన్నవడ్ల బోనస్ ₹500/క్వింటాల్ పొందడానికి: 1. ఏఈఓ వద్ద పంట నమోదు (Crop Booking) చేయించాలి. 2. ఆధార్, పట్టాదారు పాస్ పుస్తకం, ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతా వివరాలు ఐకేపీ/పీపీసీ కొనుగోలు కేంద్రానికి తీసుకెళ్లాలి. 3. ధాన్యంలో తేమ 17% కంటే తక్కువగా ఉండాలి. కేంద్ర మద్దతు ధర ₹2,320 + రాష్ట్ర బోనస్ ₹500 కలిపి క్వింటాలుకు ₹2,820 జమ అవుతుంది.",
    badge: "MSP Bonus • బోనస్",
  },
];

// Bundled Sample Leaf Diseases for Step 6
const SAMPLE_LEAF_DISEASES = [
  {
    id: "paddy_blast",
    cropEn: "Paddy (Rice)",
    cropTe: "వరి",
    diseaseEn: "Paddy Leaf Blast",
    diseaseTe: "వరి అగ్గితెగులు",
    pathogen: "Pyricularia oryzae (Magnaporthe grisea)",
    severity: "High (Severe Defoliation Risk)",
    confidence: "94.2%",
    symptomsEn:
      "Spindle-shaped or diamond-shaped lesions with grey or whitish centers and dark reddish-brown borders. Lesions enlarge and coalesce, burning entire leaf blades.",
    symptomsTe:
      "ఆకులపై కంటి లేదా నూలుకండె ఆకారపు మచ్చలు ఏర్పడతాయి. మచ్చల మధ్య భాగం బూడిద రంగులో, అంచులు ముదురు గోధుమ రంగులో ఉంటాయి. క్రమంగా ఆకులు ఎండిపోయి అగ్ని తగిలినట్లు కాలిపోతాయి.",
    recommendationsEn: [
      "Avoid excessive top-dressing with Nitrogen (Urea) during cool humid weather.",
      "Spray Tricyclazole 75% WP @ 0.6 g/L water OR Isoprothiolane 40% EC @ 1.5 mL/L.",
      "Maintain adequate water depth (2-3 cm) in the field to moderate microclimate.",
    ],
    recommendationsTe: [
      "మంచు మరియు తేమ అధికంగా ఉన్నప్పుడు నత్రజని (యూరియా) ఎరువులను అధికంగా వాడరాదు.",
      "ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రాములు లేదా ఐసోప్రోథియోలేన్ 40% EC @ 1.5 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
      "వరి మడిలో 2-3 సెం.మీ నీటి నిల్వ ఉంచడం ద్వారా తెగులు తీవ్రతను తగ్గించవచ్చు.",
    ],
    svgType: "blast",
  },
  {
    id: "cotton_bollworm",
    cropEn: "Cotton",
    cropTe: "పత్తి",
    diseaseEn: "Pink Bollworm Infestation",
    diseaseTe: "గులాబీ రంగు పురుగు ఉధృతి",
    pathogen: "Pectinophora gossypiella",
    severity: "Critical (ETL Exceeded: >10% Damaged Bolls)",
    confidence: "91.8%",
    symptomsEn:
      "Rosetted flowers that fail to open fully ('rosette bloom'). Small entry boreholes on squares and young green bolls. Larvae feed on developing seeds inside locules, staining lint brownish.",
    symptomsTe:
      "గుడ్డి పూలు లేదా ముడుచుకుపోయిన పూలు (Rosetted flowers) కనిపిస్తాయి. లేత కాయలపై సన్నని రంధ్రాలు ఉంటాయి. గులాబీ రంగు లార్వా కాయ లోపలి గింజలను తింటూ పత్తి దూదిని పాడుచేస్తుంది.",
    recommendationsEn: [
      "Install 8-10 Pink Bollworm pheromone traps per acre for continuous monitoring.",
      "Spray Profenofos 50% EC @ 2.0 mL/L OR Emamectin Benzoate 5% SG @ 5 g per 10 L water.",
      "Collect and destroy fallen rosetted flowers and dropped squares twice weekly.",
    ],
    recommendationsTe: [
      "ఎకరానికి 8-10 లింగాకర్షక బుట్టలు (Pheromone Traps) అమర్చి పురుగు ఉధృతిని గమనించాలి.",
      "ప్రొఫెనోఫాస్ 50% EC @ 2 మి.లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 5% SG @ 5 గ్రాములు 10 లీటర్ల నీటికి కలిపి పిచికారీ చేయాలి.",
      "రాలిన గుడ్డి పూలు మరియు పిందెలను ఏరివేసి నాశనం చేయాలి.",
    ],
    svgType: "bollworm",
  },
  {
    id: "chilli_curl",
    cropEn: "Chilli",
    cropTe: "మిరప",
    diseaseEn: "Chilli Leaf Curl Virus",
    diseaseTe: "మిరప బొబ్బర తెగులు (ఆకుముడుత)",
    pathogen: "Begomovirus (Transmitted by Whitefly Bemisia tabaci)",
    severity: "Moderate-High (Vector Control Urgently Needed)",
    confidence: "96.5%",
    symptomsEn:
      "Upward curling, cupping, and puckering of leaves. Vein clearing and thickening on leaf undersides. Severe plant stunting with shortened internodes and flower drop.",
    symptomsTe:
      "ఆకులు పైకి దోనెలా ముడుచుకుపోవడం (Upward curling), ఆకుల అంచులు ముడుతలు పడటం. మొక్కల ఎదుగుదల ఆగిపోయి గిడసబారిపోతాయి. తెల్లదోమ ద్వారా ఈ వైరస్ వేగంగా వ్యాపిస్తుంది.",
    recommendationsEn: [
      "Install 15-20 yellow sticky traps per acre to capture whitefly vectors early.",
      "Spray Diafenthiuron 50% WP @ 1.25 g/L OR Acetamiprid 20% SP @ 0.2 g/L to suppress whiteflies.",
      "Spray Neem Oil 10,000 ppm @ 2 mL/L as an eco-friendly repellent and anti-feedant.",
    ],
    recommendationsTe: [
      "తెల్లదోమ నివారణకు ఎకరానికి 15-20 పసుపు రంగు జిగురు అట్టలను (Yellow Sticky Traps) అమర్చాలి.",
      "డయాఫెంతియురాన్ 50% WP @ 1.25 గ్రా లేదా ఎసిటామైప్రిడ్ 20% SP @ 0.2 గ్రా లీటరు నీటికి కలిపి పిచికారీ చేయాలి.",
      "వేపనూనె (10,000 ppm) @ 2 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయడం వల్ల దోమల ఉధృతి తగ్గుతుంది.",
    ],
    svgType: "leafcurl",
  },
];

// Sample APMC Mandi Data for Step 7
// Multi-Commodity Authentic APMC Mandi Dataset for Step 7
const SAMPLE_MANDI_DATA = [
  // Paddy APMCs
  {
    yardEn: "Jagtial APMC",
    yardTe: "జగిత్యాల మార్కెట్ యార్డ్",
    commodityEn: "Paddy (RNR 15048 / Telangana Sona)",
    commodityTe: "సన్న వడ్లు (RNR 15048)",
    msp: 2320,
    tsBonus: 500,
    totalPrice: 2820,
    arrivals: "3,450 Qtl",
    trend: "+₹50/Qtl",
    status: "Active MSP Procurement",
    cropKey: "paddy",
  },
  {
    yardEn: "Suryapet APMC",
    yardTe: "సూర్యాపేట మార్కెట్ యార్డ్",
    commodityEn: "Paddy (BPT 5204 / Samba Mahsuri)",
    commodityTe: "వరి (సాంబ మసూరి)",
    msp: 2320,
    tsBonus: 500,
    totalPrice: 2820,
    arrivals: "2,890 Qtl",
    trend: "+₹45/Qtl",
    status: "Bonus Disbursed via DBT",
    cropKey: "paddy",
  },
  {
    yardEn: "Miryalaguda APMC",
    yardTe: "మిర్యాలగూడ మార్కెట్ యార్డ్",
    commodityEn: "Paddy (RNR 15048 / Super Fine)",
    commodityTe: "సన్న వడ్లు (మిర్యాలగూడ మేలిమి)",
    msp: 2320,
    tsBonus: 500,
    totalPrice: 2820,
    arrivals: "4,620 Qtl",
    trend: "+₹60/Qtl",
    status: "Active MSP Procurement",
    cropKey: "paddy",
  },
  {
    yardEn: "Nizamabad APMC",
    yardTe: "నిజామాబాద్ మార్కెట్ యార్డ్",
    commodityEn: "Paddy (KNM 118 / Common Grade)",
    commodityTe: "వరి (కూనారం 118 / సాధారణ రకం)",
    msp: 2320,
    tsBonus: 0,
    totalPrice: 2320,
    arrivals: "3,110 Qtl",
    trend: "+₹15/Qtl",
    status: "Active MSP Procurement",
    cropKey: "paddy",
  },
  {
    yardEn: "Karimnagar APMC",
    yardTe: "కరీంనగర్ మార్కెట్ యార్డ్",
    commodityEn: "Paddy (HMT Sona / Table Fine)",
    commodityTe: "వరి (హెచ్.ఎమ్.టి సోనా)",
    msp: 2320,
    tsBonus: 500,
    totalPrice: 2820,
    arrivals: "2,540 Qtl",
    trend: "+₹30/Qtl",
    status: "Bonus Disbursed via DBT",
    cropKey: "paddy",
  },
  // Cotton APMCs
  {
    yardEn: "Warangal APMC (Enmamula)",
    yardTe: "వరంగల్ ఏనుమాముల మార్కెట్",
    commodityEn: "Cotton (Bunny / Medium-Long Staple)",
    commodityTe: "పత్తి (మధ్యస్థ-పొడవు పింజ)",
    msp: 7521,
    tsBonus: 0,
    totalPrice: 7780,
    arrivals: "6,200 Qtl",
    trend: "+₹110/Qtl",
    status: "Private Mandi Trade",
    cropKey: "cotton",
  },
  {
    yardEn: "Adilabad APMC",
    yardTe: "ఆదిలాబాద్ మార్కెట్ యార్డ్",
    commodityEn: "Cotton (Brahma / High Ginner Demand)",
    commodityTe: "పత్తి (బ్రహ్మ / తెల్ల బంగారం)",
    msp: 7521,
    tsBonus: 0,
    totalPrice: 7650,
    arrivals: "5,400 Qtl",
    trend: "+₹80/Qtl",
    status: "CCI Procurement Center",
    cropKey: "cotton",
  },
  {
    yardEn: "Khammam APMC",
    yardTe: "ఖమ్మం మార్కెట్ యార్డ్",
    commodityEn: "Cotton (MCU-5 / Long Staple)",
    commodityTe: "పత్తి (పొడుగు పింజ రకం)",
    msp: 7521,
    tsBonus: 0,
    totalPrice: 7810,
    arrivals: "3,950 Qtl",
    trend: "+₹95/Qtl",
    status: "Commercial Spot Bidding",
    cropKey: "cotton",
  },
  // Maize APMCs
  {
    yardEn: "Nizamabad APMC",
    yardTe: "నిజామాబాద్ మార్కెట్ యార్డ్",
    commodityEn: "Maize (Hybrid Yellow)",
    commodityTe: "మొక్కజొన్న (హైబ్రిడ్ పసుపు)",
    msp: 2225,
    tsBonus: 0,
    totalPrice: 2310,
    arrivals: "4,180 Qtl",
    trend: "+₹35/Qtl",
    status: "Poultry Feed Demand",
    cropKey: "maize",
  },
  {
    yardEn: "Badepally APMC (Jadcherla)",
    yardTe: "బాడేపల్లి మార్కెట్ యార్డ్ (జడ్చర్ల)",
    commodityEn: "Maize (Pioneer Industrial Feed)",
    commodityTe: "మొక్కజొన్న (పారిశ్రామిక రకం)",
    msp: 2225,
    tsBonus: 0,
    totalPrice: 2280,
    arrivals: "2,740 Qtl",
    trend: "+₹20/Qtl",
    status: "Poultry Feed Demand",
    cropKey: "maize",
  },
  // Chilli APMCs
  {
    yardEn: "Khammam APMC",
    yardTe: "ఖమ్మం మార్కెట్ యార్డ్",
    commodityEn: "Chilli (Teja / Red Dry)",
    commodityTe: "మిరప (తేజ / ఎండు మిర్చి)",
    msp: 0,
    tsBonus: 0,
    totalPrice: 19450,
    arrivals: "1,420 Qtl",
    trend: "+₹250/Qtl",
    status: "Spices Board Benchmark",
    cropKey: "chilli",
  },
  {
    yardEn: "Warangal APMC (Enmamula)",
    yardTe: "వరంగల్ ఏనుమాముల మార్కెట్",
    commodityEn: "Chilli (Wonder Hot / Export Grade)",
    commodityTe: "మిరప (వండర్ హాట్ / ఎగుమతి రకం)",
    msp: 0,
    tsBonus: 0,
    totalPrice: 18200,
    arrivals: "1,890 Qtl",
    trend: "+₹180/Qtl",
    status: "Commercial Spot Bidding",
    cropKey: "chilli",
  },
  // Redgram APMCs
  {
    yardEn: "Tandur APMC (Vikarabad)",
    yardTe: "తాండూరు మార్కెట్ యార్డ్",
    commodityEn: "Redgram (Tandur GI Tagged Pigeon Pea)",
    commodityTe: "కందులు (తాండూరు GI ట్యాగ్ రకం)",
    msp: 7550,
    tsBonus: 0,
    totalPrice: 7920,
    arrivals: "2,150 Qtl",
    trend: "+₹120/Qtl",
    status: "Premium Dal Mill Offtake",
    cropKey: "redgram",
  },
  {
    yardEn: "Suryapet APMC",
    yardTe: "సూర్యాపేట మార్కెట్ యార్డ్",
    commodityEn: "Redgram (Asha / Bold Grain)",
    commodityTe: "కందులు (ఆశా / లావు గింజ)",
    msp: 7550,
    tsBonus: 0,
    totalPrice: 7750,
    arrivals: "1,640 Qtl",
    trend: "+₹70/Qtl",
    status: "Active MSP Procurement",
    cropKey: "redgram",
  },
];

export default function ConferenceDemoPage() {
  // Navigation & Settings State
  const [activeStep, setActiveStep] = useState<number>(1);
  const [lang, setLang] = useState<"en" | "te">("en");
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Step 1 & 2: Soil Moisture & Pump Animation
  const [soilMoisture, setSoilMoisture] = useState<number>(17.4);
  const [pumpRunning, setPumpRunning] = useState<boolean>(false);
  const [pumpTimerSeconds, setPumpTimerSeconds] = useState<number>(274); // 4m 34s

  // Step 3: Rain-Skip Interlock
  const [rainSkipActive, setRainSkipActive] = useState<boolean>(false);

  // Step 4: Live Offline Calculators
  const [calcCrop, setCalcCrop] = useState<"Paddy" | "Maize" | "Cotton">("Paddy");
  const [calcAcres, setCalcAcres] = useState<number>(4.5);
  const [calcGuntas, setCalcGuntas] = useState<number>(0);

  // Step 5: Krishi Sahayak Selected Question
  const [selectedQaId, setSelectedQaId] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Step 6: Sample Leaf Disease Selection
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>("paddy_blast");

  // Step 7: Yield Payout Calculator & Live Specific Crop Mandi Data
  const { profile } = useFarmerProfile();
  const [expectedYieldQtl, setExpectedYieldQtl] = useState<number>(110);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);
  const [demoCropFilter, setDemoCropFilter] = useState<string>("paddy");
  const [liveMandiList, setLiveMandiList] = useState<any[]>(SAMPLE_MANDI_DATA);
  const [isMandiLoading, setIsMandiLoading] = useState<boolean>(false);
  const [mandiDataSource, setMandiDataSource] = useState<string>("APMC Daily Procurement Feed");
  const [lastSyncTime, setLastSyncTime] = useState<string>("Live Feed Active");

  const fetchDemoMandi = async (cropKey: string) => {
    setIsMandiLoading(true);
    try {
      const url = cropKey === "all" ? "/api/mandi" : `/api/mandi?crop=${cropKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((item: any) => ({
            yardEn: item.marketNameEn,
            yardTe: item.marketNameTe,
            commodityEn: `${item.commodityEn} (${item.variety})`,
            commodityTe: `${item.commodityTe} (${item.varietyTe || item.variety})`,
            msp: item.mspPrice || 0,
            tsBonus: item.govtBonus || 0,
            totalPrice: item.totalFarmerRate || (item.modalPrice + (item.govtBonus || 0)),
            arrivals: `${item.arrivalsQtl?.toLocaleString("en-IN") || "3,200"} Qtl`,
            trend: item.changeAmount ? `${item.changeAmount > 0 ? "+" : ""}₹${item.changeAmount}/Qtl` : "Steady",
            status: item.marketStatus || (item.govtBonus ? "Bonus Disbursed via DBT" : "Active MSP Procurement"),
            cropKey: item.cropKey,
          }));
          setLiveMandiList(mapped);
          setMandiDataSource(json.source || "Agmarknet Live Feed");
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch (e) {
      // Keep existing list
    } finally {
      setIsMandiLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoMandi(demoCropFilter);
  }, [demoCropFilter]);

  useEffect(() => {
    if (profile?.primaryCrop) {
      const lower = profile.primaryCrop.toLowerCase();
      if (lower.includes("cotton") || lower.includes("పత్తి")) {
        setDemoCropFilter("cotton");
        setExpectedYieldQtl(Math.round((profile.areaAcre || 4.5) * 9));
      } else if (lower.includes("maize") || lower.includes("మొక్కజొన్న")) {
        setDemoCropFilter("maize");
        setExpectedYieldQtl(Math.round((profile.areaAcre || 4.5) * 28));
      } else if (lower.includes("chilli") || lower.includes("మిరప")) {
        setDemoCropFilter("chilli");
        setExpectedYieldQtl(Math.round((profile.areaAcre || 4.5) * 14));
      } else if (lower.includes("redgram") || lower.includes("కందులు")) {
        setDemoCropFilter("redgram");
        setExpectedYieldQtl(Math.round((profile.areaAcre || 4.5) * 7));
      } else {
        setDemoCropFilter("paddy");
        setExpectedYieldQtl(Math.round((profile.areaAcre || 4.5) * 21));
      }
    }
  }, [profile?.primaryCrop, profile?.areaAcre]);

  // Audio Context ref for synthesized mechanical pump hum
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Setup / Teardown Pump Hum Sound
  const startPumpHum = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (oscillatorRef.current) return;

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      // 60Hz mechanical drone with soft harmonic
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(65, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      // AudioContext unavailable or blocked by autoplay
    }
  };

  const stopPumpHum = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch (e) {}
  };

  // Sync Pump Sound with state
  useEffect(() => {
    if (pumpRunning && soundEnabled) {
      startPumpHum();
    } else {
      stopPumpHum();
    }
    return () => stopPumpHum();
  }, [pumpRunning, soundEnabled]);

  // Pump Simulation Effect: smoothly brings moisture from 17.4% up to 31.5%
  useEffect(() => {
    let interval: any;
    if (pumpRunning) {
      interval = setInterval(() => {
        setSoilMoisture((prev) => {
          if (prev >= 31.5) {
            setPumpRunning(false);
            return 31.5;
          }
          return parseFloat((prev + 0.4).toFixed(1));
        });
        setPumpTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [pumpRunning]);

  // Rain-Skip Interlock Logic: When Step 3 is active, rain forecast forces pump OFF
  useEffect(() => {
    if (activeStep === 3) {
      setRainSkipActive(true);
      setPumpRunning(false);
    }
  }, [activeStep]);

  // Keyboard navigation for conference presenter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "n" || e.key === "N") {
        setActiveStep((prev) => Math.min(DEMO_STEPS.length, prev + 1));
      } else if (e.key === "ArrowLeft" || e.key === "p" || e.key === "P") {
        setActiveStep((prev) => Math.max(1, prev - 1));
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleReset = () => {
    setActiveStep(1);
    setSoilMoisture(17.4);
    setPumpRunning(false);
    setPumpTimerSeconds(274);
    setRainSkipActive(false);
    setCalcCrop("Paddy");
    setCalcAcres(4.5);
    setCalcGuntas(0);
    setSelectedQaId(1);
    setSelectedDiseaseId("paddy_blast");
    setExpectedYieldQtl(110);
    stopPumpHum();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Text to Speech for Q&A
  const handleSpeak = (text: string, voiceLang: "en-IN" | "te-IN") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Calculated Fertilizer for Step 4
  const totalAreaInAcres = calcAcres + calcGuntas / 40;
  const fertOutput = calculateFertilizer({
    crop: calcCrop,
    area: totalAreaInAcres,
    unit: "acre",
  });

  // Calculated Seed Rate for Step 4
  const seedOutput = calculateSeedRate({
    crop: calcCrop,
    sowingMethod: calcCrop === "Paddy" ? "transplant" : calcCrop === "Cotton" ? "dibble" : "line",
    area: totalAreaInAcres,
    unit: "acre",
    rowSpacingCm: calcCrop === "Paddy" ? 20 : calcCrop === "Cotton" ? 90 : 60,
    plantSpacingCm: calcCrop === "Paddy" ? 15 : calcCrop === "Cotton" ? 60 : 20,
    seedsPerHill: calcCrop === "Paddy" ? 2 : 1,
    weightBasis: 1000,
    testWeightG: calcCrop === "Paddy" ? 22 : calcCrop === "Cotton" ? 90 : 280,
    germinationPct: 85,
    purityPct: 98,
    extraPct: 10,
  });

  // Active QA Item for Step 5
  const activeQa = BUNDLED_QA.find((q) => q.id === selectedQaId) || BUNDLED_QA[0];

  // Active Disease for Step 6
  const activeDisease =
    SAMPLE_LEAF_DISEASES.find((d) => d.id === selectedDiseaseId) || SAMPLE_LEAF_DISEASES[0];

  // Displayed Mandi rows for Step 7
  const displayedDemoMandiRows = React.useMemo(() => {
    if (demoCropFilter === "all") return liveMandiList;
    const match = liveMandiList.filter(
      (m) => m.cropKey === demoCropFilter || (m.commodityEn && m.commodityEn.toLowerCase().includes(demoCropFilter))
    );
    return match.length > 0 ? match : SAMPLE_MANDI_DATA.filter((m) => m.cropKey === demoCropFilter);
  }, [liveMandiList, demoCropFilter]);

  const activeDemoMandiRow = displayedDemoMandiRows[0] || SAMPLE_MANDI_DATA[0];
  const activeRate = activeDemoMandiRow?.totalPrice || 2820;
  const activeMsp = activeDemoMandiRow?.msp || 2320;
  const activeBonus = activeDemoMandiRow?.tsBonus || 0;
  const activeFarmerName = profile?.name || "Md Ashfaq";
  const activeFarmerLocation = `${profile?.village || "Jagtial"}, ${profile?.district || "Jagtial"}`;
  const cropDisplayName =
    demoCropFilter === "paddy"
      ? "Paddy"
      : demoCropFilter === "cotton"
      ? "Cotton"
      : demoCropFilter === "maize"
      ? "Maize"
      : demoCropFilter === "chilli"
      ? "Chilli"
      : demoCropFilter === "redgram"
      ? "Redgram"
      : "Commodity";

  // WhatsApp share text generator for Step 7
  const whatsappAdvisory = `🌾 *Smart Farm Assistant — Live Mandi Rates & Payout* 🌾
📍 రైతు: ${activeFarmerName} (${activeFarmerLocation})
🌱 పంట: ${cropDisplayName} (${profile?.primaryCrop || "RNR 15048"} • ${profile?.areaAcre || 4.5} ఎకరాలు)
💧 నేల తేమ: ${soilMoisture.toFixed(1)}% (${soilMoisture < 20 ? "⚠️ తక్కువ తేమ - పంపు అవసరం" : "✅ సరిపడా తేమ"})
🌧️ వర్ష సూచన: ${rainSkipActive ? "🌧️ రేపు 32mm భారీ వర్షం - రెయిన్ స్కిప్ ఆన్" : "ఎండ/పొడి వాతావరణం"}
💰 ${activeDemoMandiRow?.yardTe || activeDemoMandiRow?.yardEn || "APMC"} రేటు: ₹${activeRate.toLocaleString("en-IN")}/క్వింటాల్ ${activeBonus > 0 ? `(MSP ₹${activeMsp.toLocaleString("en-IN")} + బోనస్ ₹${activeBonus})` : `(MSP ₹${activeMsp.toLocaleString("en-IN")})`}
📊 అంచనా చెల్లింపు: ${expectedYieldQtl} క్వింటాళ్లు = ₹${(expectedYieldQtl * activeRate).toLocaleString("en-IN")}
🌐 లైవ్ సైట్: https://smartfarming-web.vercel.app`;

  const copyWhatsAppAdvisory = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(whatsappAdvisory);
      setCopiedShareText(true);
      setTimeout(() => setCopiedShareText(false), 2500);
    }
  };

  return (
    <div
      className={`min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-24 transition-all ${
        isProjectorMode ? "text-lg md:text-xl font-medium" : "text-sm md:text-base"
      }`}
    >
      {/* ======================================================== */}
      {/* 1. PERMANENT NON-REMOVABLE TOP RIBBON                   */}
      {/* ======================================================== */}
      <aside
        aria-label="Demo mode announcement"
        className="w-full bg-amber-400 dark:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 text-center text-xs md:text-sm tracking-wide shadow-md sticky top-0 z-50 border-b-2 border-amber-600 flex flex-col sm:flex-row items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 text-left">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold uppercase tracking-wider">
              SIMULATED DEMO — no internet or sensor needed
            </span>
            <span className="opacity-50 hidden sm:inline">•</span>
            <span className="font-semibold text-stone-900">
              అనుకరణ డెమో — ఇంటర్నెట్ లేదా సెన్సార్ అవసరం లేదు
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/offline-demo.html"
            download="smart-farm-offline-demo.html"
            className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Download 100% self-contained single HTML demo file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download offline copy</span>
          </a>
          <Link
            href="/dashboard"
            className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
            title="Return to live connected website"
          >
            <span>Back to live site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. PRESENTER COMMAND BAR & PROJECTOR CONTROLS            */}
      {/* ======================================================== */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 md:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Conference Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base md:text-lg font-extrabold text-stone-900 dark:text-white">
                  PJTAU Conference Walkthrough
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  ADSAUF-2047 (2-4 Dec 2026)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  Step {activeStep} of 7
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Farmer Case Study: <span className="font-semibold text-stone-800 dark:text-stone-200">Mallesham Goud</span> • Mallapur, Jagtial District (4.5 Acres Paddy RNR 15048)
              </p>
            </div>
          </div>

          {/* Presenter Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Projector Mode Toggle */}
            <button
              onClick={() => setIsProjectorMode(!isProjectorMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                isProjectorMode
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50"
              }`}
              title="Scale typography and contrast for lecture hall projector"
            >
              {isProjectorMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isProjectorMode ? "Standard View" : "Projector View"}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition"
              title="Toggle Telugu / English language"
            >
              {lang === "en" ? "తెలుగు మోడ్" : "English Mode"}
            </button>

            {/* Sound Hum Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                soundEnabled
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50"
              }`}
              title="Synthesizes client-side 60Hz mechanical pump hum"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? "Pump Audio ON" : "Mute Sound"}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition flex items-center gap-1"
              title="Reset simulation to initial state (Shortcut: R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset [R]</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. GUIDED 7-STEP INTERACTIVE PROGRESS STEPPER            */}
      {/* ======================================================== */}
      <nav aria-label="Demo flow steps" className="max-w-7xl mx-auto px-4 md:px-8 pt-5">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-3 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DEMO_STEPS.map((s) => {
              const isActive = activeStep === s.id;
              const isPast = activeStep > s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30"
                      : isPast
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      : "bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-emerald-800"
                        : isPast
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span>{lang === "te" ? s.titleTe : s.titleEn}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper Progress bar */}
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${(activeStep / DEMO_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 4. MAIN STEP PRESENTATION VIEWPORTS                      */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {/* ====================================================== */}
        {/* STEP 1: LOW MOISTURE ALERT (<20%)                      */}
        {/* ====================================================== */}
        {activeStep === 1 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 inline-block mb-2">
                  Step 1 of 7: Telemetry Alert Trigger
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te" ? "నేల తేమ ప్రమాదకర స్థాయి హెచ్చరిక (17.4%)" : "Low Moisture Alert: Soil Moisture at 17.4%"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Capacitive Soil Sensor (ESP32 ADC Pin 34) in Jagtial Field #2 detected root zone depletion below critical 20.0% threshold.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <span>Next: Pump ON (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Critical Alert Card */}
            <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-500 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-red-900 dark:text-red-200">
                      {lang === "te"
                        ? "అత్యవసర నీటి తడి అవసరం — తేమ 17.4% (<20% పరిమితి)"
                        : "CRITICAL MOISTURE DEFICIT — Immediate Irrigation Required"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white">
                      DEFICIT: -2.6%
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-red-800 dark:text-red-300 mt-1">
                    {lang === "te"
                      ? "వరి పిలకల దశలో (Active Tillering Stage) నేల తేమ 20% కంటే తగ్గడం వల్ల పిలకల సంఖ్య మరియు ధాన్యపు దిగుబడి 25% వరకు తగ్గే ప్రమాదం ఉంది."
                      : "Paddy crop is at day 42 (active tillering). Soil moisture below 20% triggers stress hormones and restricts tiller formation. Immediate 30 mm irrigation cycle recommended."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPumpRunning(true);
                  setActiveStep(2);
                }}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs md:text-sm font-bold shadow-md shrink-0 flex items-center justify-center gap-2 transition"
              >
                <Power className="w-4 h-4" />
                <span>Simulate Pump Start →</span>
              </button>
            </div>

            {/* Moisture Telemetry Gauge & Threshold Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Radial / Bar Gauge */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Root Zone Volumetric Water Content
                </span>
                <div className="relative w-40 h-40 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-stone-200 dark:stroke-stone-700"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-red-500 transition-all duration-1000"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * soilMoisture) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-red-600 dark:text-red-400">
                      {soilMoisture.toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase">
                      CRITICAL LOW
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                  Optimal Target: <span className="font-bold text-emerald-600">25.0% – 35.0%</span>
                </p>
              </div>

              {/* Threshold Range Breakdown */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-3">
                    PJTAU Agronomy Moisture Thresholds
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 font-medium">
                      <span className="text-red-900 dark:text-red-300 font-bold">Wilting Risk (&lt;20.0%)</span>
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">CURRENT: 17.4%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300">
                      <span>Low Caution (20.0% – 25.0%)</span>
                      <span className="font-mono">Pump Standby</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-semibold">
                      <span>Optimal Rice Root (25.0% – 35.0%)</span>
                      <span className="font-mono">Target Saturation</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300">
                      <span>Field Capacity (&gt;35.0%)</span>
                      <span className="font-mono">Pump Auto-Cutoff</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-500">
                  Telemetry Frequency: <span className="font-mono font-semibold">Every 60 seconds (ESP32 Mesh)</span>
                </div>
              </div>

              {/* Field Metadata */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-3">
                    Field #2 Profile
                  </h4>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                      <dt className="text-stone-500">Farmer Name:</dt>
                      <dd className="font-bold text-stone-900 dark:text-white">Mallesham Goud</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                      <dt className="text-stone-500">Location:</dt>
                      <dd className="font-bold text-stone-900 dark:text-white">Mallapur, Jagtial</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                      <dt className="text-stone-500">Soil Classification:</dt>
                      <dd className="font-bold text-stone-900 dark:text-white">Red Sandy Loam (చల్కా నేలలు)</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-700">
                      <dt className="text-stone-500">Crop & Variety:</dt>
                      <dd className="font-bold text-emerald-700 dark:text-emerald-400">Paddy (RNR 15048)</dd>
                    </div>
                    <div className="flex justify-between py-1">
                      <dt className="text-stone-500">Irrigation Source:</dt>
                      <dd className="font-bold text-stone-900 dark:text-white">3 HP Submersible Borewell</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mt-3">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Presenter hint: Click "Next" to watch pump activate and moisture replenish.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================== */}
        {/* STEP 2: PUMP ON ANIMATION (Moisture rises to 31.5%)    */}
        {/* ====================================================== */}
        {activeStep === 2 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 inline-block mb-2">
                  Step 2 of 7: Autonomous Irrigation Cycle
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te" ? "పంపు ఆటోమేటిక్ ఆన్ & తేమ పెరుగుదల (31.5%)" : "Pump ON Animation: Water Replenishment to 31.5%"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Relay engaged 3 HP submersible pump. Soil moisture is animating from 17.4% to optimal saturation (31.5%).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-semibold hover:bg-stone-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <span>Next: Rain-Skip (Step 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Pump Interactive Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pump Hardware & Spinning Impeller Animation */}
              <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase font-mono tracking-wider text-emerald-300">
                      ESP32 RELAY CHANNEL #1
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        pumpRunning
                          ? "bg-emerald-500 text-stone-950 animate-pulse"
                          : soilMoisture >= 31.5
                          ? "bg-emerald-400 text-stone-950"
                          : "bg-stone-700 text-stone-300"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{pumpRunning ? "PUMP ACTIVE" : soilMoisture >= 31.5 ? "CYCLE COMPLETE" : "PUMP IDLE"}</span>
                    </span>
                  </div>

                  {/* Spinning Impeller Animation */}
                  <div className="flex flex-col items-center justify-center my-6">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* Outer pulsing ring */}
                      <div
                        className={`absolute inset-0 rounded-full border-4 border-emerald-400/30 ${
                          pumpRunning ? "animate-ping" : ""
                        }`}
                      />
                      {/* Spinning impeller wheel */}
                      <div
                        className={`w-28 h-28 rounded-full border-4 border-dashed border-emerald-300 flex items-center justify-center transition-all ${
                          pumpRunning ? "animate-spin" : ""
                        }`}
                        style={{ animationDuration: "1.2s" }}
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Droplets className="w-8 h-8 text-emerald-300" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-3">
                      <span className="text-2xl font-mono font-black text-white">
                        {pumpRunning ? "420 Litres/min" : soilMoisture >= 31.5 ? "Target Achieved" : "0 L/min"}
                      </span>
                      <p className="text-xs text-emerald-200/80">3 HP Submersible • 2.2 kW Active Load</p>
                    </div>
                  </div>
                </div>

                {/* Manual Start / Pause Trigger */}
                <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (soilMoisture >= 31.5) setSoilMoisture(17.4);
                      setPumpRunning(!pumpRunning);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      pumpRunning
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-emerald-400 hover:bg-emerald-300 text-stone-950 shadow-md"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{pumpRunning ? "Pause Pump Simulation" : "Restart 17.4% → 31.5% Cycle"}</span>
                  </button>
                </div>
              </div>

              {/* Live Moisture Rise Display */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-stone-500 uppercase">Real-Time Soil Sensor</span>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      ADC Channel 34
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                      {soilMoisture.toFixed(1)}%
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        soilMoisture >= 25.0
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {soilMoisture >= 30.0 ? "OPTIMAL" : soilMoisture >= 20.0 ? "RECOVERING" : "DEFICIT"}
                    </span>
                  </div>

                  {/* Horizontal Bar with Target Marker */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>Start: 17.4%</span>
                      <span className="font-bold text-emerald-600">Target: 31.5%</span>
                      <span>Max: 40%</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 h-4 rounded-full overflow-hidden p-0.5 relative">
                      <div
                        className="bg-gradient-to-r from-amber-500 via-emerald-500 to-green-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(soilMoisture / 40) * 100}%` }}
                      />
                      {/* Target notch */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-stone-900 dark:bg-white"
                        style={{ left: `${(31.5 / 40) * 100}%` }}
                        title="Optimal Cutoff Target: 31.5%"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-4 leading-relaxed">
                    {soilMoisture >= 31.5 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Target 31.5% reached! Soil pore space is optimally balanced with 50% water and 50% aeration.
                      </span>
                    ) : (
                      `Injecting 420 L/min across lateral drip line #2. Moisture increment: +0.4% per step.`
                    )}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 mt-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-500">Auto Shutoff Timer:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {Math.floor(pumpTimerSeconds / 60)}m {pumpTimerSeconds % 60}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Water Volume & Agronomic Metrics */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-3">
                    Calculated Irrigation Metrics
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <span className="text-stone-500">Water Discharged:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {pumpRunning ? "1,890 Litres" : soilMoisture >= 31.5 ? "2,520 Litres" : "0 L"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <span className="text-stone-500">Effective Root Depth:</span>
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">18.5 cm</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <span className="text-stone-500">Electricity Consumed:</span>
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">0.22 kWh</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <span className="text-stone-500">Power Factor:</span>
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-200">0.91 (Healthy)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 mt-4">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Presenter Speaking Point:</span>
                  </div>
                  <p className="text-[11px] leading-tight">
                    "Notice how the ESP32 closed-loop logic prevents waterlogging. Once 31.5% is detected, pump cuts off without requiring manual farmer intervention."
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================== */}
        {/* STEP 3: RAIN-SKIP PAUSES IRRIGATION (85% Rain, 32mm)   */}
        {/* ====================================================== */}
        {activeStep === 3 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 inline-block mb-2">
                  Step 3 of 7: Predictive Weather Interlock
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te"
                    ? "రెయిన్-స్కిప్ ఇంటర్‌లాక్: రేపు 32 మి.మీ భారీ వర్ష సూచన (85%)"
                    : "Rain-Skip Interlock: Forecast 85% Rain Tomorrow (32 mm)"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Doppler radar & Open-Meteo AWS model indicates heavy monsoon showers tomorrow. Smart interlock suppresses pump to conserve groundwater.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-semibold hover:bg-stone-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <span>Next: Calculators (Step 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weather Alert & Interlock Hero */}
            <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md mb-8 border border-sky-800/60">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                    <CloudRain className="w-9 h-9 text-sky-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-400 text-stone-950">
                        Active Rain-Skip Interlock
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-black mt-2">
                      {lang === "te"
                        ? "భారీ వర్ష సూచన — పంపు ఆటోమేటిక్‌గా నిలిపివేయబడింది"
                        : "Heavy Rain Warning Tomorrow: 32 mm Precipitation (85% Probability)"}
                    </h3>
                    <p className="text-xs md:text-sm text-sky-200/90 mt-1 max-w-2xl leading-relaxed">
                      {lang === "te"
                        ? "రేపు ఉదయం 08:00 నుండి జగిత్యాల పరిసర ప్రాంతాల్లో 32 మి.మీ వర్షపాతం నమోదయ్యే అవకాశం ఉంది. నేల ఇప్పటికే తగినంత తేమతో ఉన్నందున మరియు రేపు వర్షం కురవనున్నందున, పంపును ఆపివేసి 38,000 లీటర్ల భూగర్భ జలాలను ఆదా చేయడం జరిగింది."
                        : "Irrigation scheduled for tonight is bypassed automatically. Pumping water before a 32 mm downpour causes nutrient leaching, lodging, and root suffocation. Smart rain-skip protects crop yield and power costs."}
                    </p>
                  </div>
                </div>

                {/* Rain Probability Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
                  <span className="text-xs text-sky-200 uppercase font-bold tracking-wider">Rain Probability</span>
                  <div className="text-4xl font-black text-sky-300 my-1">85%</div>
                  <span className="text-xs font-semibold text-white/90">32 mm Expected</span>
                </div>
              </div>
            </div>

            {/* Interlock Metrics & Resource Conservation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Groundwater Saved */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Groundwater Saved</h4>
                </div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-2">
                  ~38,000 Litres
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Equivalent to 3 full hours of continuous 3 HP submersible borewell pumping saved on 4.5 acres.
                </p>
              </div>

              {/* Electricity & Cost Savings */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Power & Equipment Life</h4>
                </div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-2">
                  6.6 kWh Saved
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Prevents dry run motor heating and unnecessary transformer load on Telangana agricultural feeders.
                </p>
              </div>

              {/* Agronomic Protection */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">Root Health Preservation</h4>
                </div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 my-2">
                  Zero Leaching
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Eliminates nitrate runoff and anaerobic root rot caused by irrigation immediately prior to rainfall.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================== */}
        {/* STEP 4: LIVE OFFLINE PJTAU INPUT CALCULATORS           */}
        {/* ====================================================== */}
        {activeStep === 4 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 inline-block mb-2">
                  Step 4 of 7: Zero-Latency Client Calculators
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te"
                    ? "PJTAU ఎరువులు & విత్తనాల మోతాదు కాలిక్యులేటర్ (100% ఆఫ్‌లైన్)"
                    : "Live Offline Calculators: PJTAU Fertilizer & Seed Rate"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Pure TypeScript mathematical models aligned with PJTAU Package of Practices. Change inputs below to see instant dosage recalculation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-semibold hover:bg-stone-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <span>Next: Krishi Sahayak (Step 5)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Inputs Strip */}
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                Interactive Farm Parameters (Try altering values during presentation)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Crop Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Select Crop / పంట ఎంచుకోండి:
                  </label>
                  <select
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Paddy">Paddy / వరి (Rice)</option>
                    <option value="Maize">Maize / మొక్కజొన్న</option>
                    <option value="Cotton">Cotton / పత్తి</option>
                  </select>
                </div>

                {/* Land Area Acres */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Area in Acres / ఎకరాలు:
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={calcAcres}
                    onChange={(e) => setCalcAcres(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                {/* Guntas */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Additional Guntas / గుంటలు:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="39"
                    step="5"
                    value={calcGuntas}
                    onChange={(e) => setCalcGuntas(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Dual Results: Fertilizer Bags & Seed Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fertilizer Dosage Result */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      Fertilizer Requirement ({totalAreaInAcres.toFixed(2)} Acres)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    PJTAU NPK Rec.
                  </span>
                </div>

                {/* 3 Key Bags Badges */}
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">DAP (18-46-0)</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white my-1 block">
                      {fertOutput.dapBags}
                    </span>
                    <span className="text-[10px] text-stone-500">50kg bags (Basal)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-300 block">Urea (46% N)</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white my-1 block">
                      {fertOutput.ureaBags}
                    </span>
                    <span className="text-[10px] text-stone-500">50kg bags (Splits)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">MOP (60% K)</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white my-1 block">
                      {fertOutput.mopBags}
                    </span>
                    <span className="text-[10px] text-stone-500">50kg bags (Potash)</span>
                  </div>
                </div>

                {/* Split Schedule Table */}
                <div className="mt-4">
                  <h5 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    Application Split Schedule:
                  </h5>
                  <div className="space-y-2 text-xs">
                    {fertOutput.splits.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {lang === "te" ? s.stageTe : s.stageEn}
                          </span>
                          <p className="text-[10px] text-stone-500">{lang === "te" ? s.notesTe : s.notesEn}</p>
                        </div>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                          {s.dapPct > 0 ? `DAP: ${s.dapPct}% ` : ""}
                          {s.ureaPct > 0 ? `Urea: ${s.ureaPct}% ` : ""}
                          {s.mopPct > 0 ? `MOP: ${s.mopPct}%` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seed Rate & Hill Spacing Result */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      Seed Requirement & Spacing
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Spacing Model
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Total Seed (kg)</span>
                    <span className="text-3xl font-black text-stone-900 dark:text-white my-1 block">
                      {seedOutput.seedRateKgEntered.toFixed(1)} kg
                    </span>
                    <span className="text-[10px] text-stone-500">
                      ({seedOutput.seedRateKgPerAcre.toFixed(1)} kg/acre)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 block">Standard Packets</span>
                    <span className="text-3xl font-black text-stone-900 dark:text-white my-1 block">
                      {seedOutput.packetsNeeded}
                    </span>
                    <span className="text-[10px] text-stone-500">Packets recommended</span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">Plant Population per Acre:</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                      {seedOutput.plantsPerAcre.toLocaleString()} hills/acre
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">Recommended Spacing:</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                      {calcCrop === "Paddy" ? "20 cm × 15 cm (2 seedlings/hill)" : calcCrop === "Cotton" ? "90 cm × 60 cm (Dibbling)" : "60 cm × 20 cm"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">Standard Test Weight:</span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                      {calcCrop === "Paddy" ? "22g per 1000 grains (RNR 15048)" : calcCrop === "Cotton" ? "90g per 1000 seeds" : "280g per 1000 seeds"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================== */}
        {/* STEP 5: KRISHI SAHAYAK BUNDLED Q&A                     */}
        {/* ====================================================== */}
        {activeStep === 5 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 inline-block mb-2">
                  Step 5 of 7: Pre-Cached Agronomy Intelligence
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te"
                    ? "కృషి సహాయక్: ముఖ్యమైన రైతు ప్రశ్నలు & సమాధానాలు"
                    : "Krishi Sahayak Bundled Q&A: Offline Farmer Advisory"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  4 validated conference agronomy answers in Telugu and English. Click questions to display immediate verified response.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-semibold hover:bg-stone-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(6)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <span>Next: Leaf Scanner (Step 6)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Statutory Safety Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-4 rounded-r-2xl mb-6 shadow-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold">⚠️ Statutory Safety Disclaimer:</span> AI advice is indicative agronomic guidance aligned with PJTAU Package of Practices. Always consult your Mandal Agricultural Officer (MAO) or Agricultural Extension Officer (AEO) before spraying chemicals.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question Selection List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Select Question to Ask:
                </h4>
                {BUNDLED_QA.map((q) => {
                  const isSelected = q.id === selectedQaId;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQaId(q.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-sm"
                          : "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                          {q.badge}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-xs md:text-sm font-bold text-stone-900 dark:text-white leading-snug">
                        {lang === "te" ? q.qTe : q.qEn}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Verified Agronomic Response Deck */}
              <div className="lg:col-span-2 bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-700 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        AI
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                          Krishi Sahayak Agronomic Response
                        </h4>
                        <span className="text-[10px] text-stone-500">Verified PJTAU Practice • Zero Network Call</span>
                      </div>
                    </div>

                    {/* Speech Synthesis Audio Button */}
                    <button
                      onClick={() =>
                        handleSpeak(
                          lang === "te" ? activeQa.aTe : activeQa.aEn,
                          lang === "te" ? "te-IN" : "en-IN"
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                        isSpeaking
                          ? "bg-red-600 text-white border-red-600 animate-pulse"
                          : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 hover:bg-stone-100"
                      }`}
                      title="Read answer aloud using local speech synthesis"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? "Stop Voice" : lang === "te" ? "వినండి (Telugu Voice)" : "Read Aloud"}</span>
                    </button>
                  </div>

                  {/* Question Asked */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Farmer Inquiry:
                    </span>
                    <p className="text-base font-extrabold text-stone-900 dark:text-white">
                      "{lang === "te" ? activeQa.qTe : activeQa.qEn}"
                    </p>
                  </div>

                  {/* Verified Answer Body */}
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 shadow-xs">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                      Agronomic Solution:
                    </span>
                    <p className="text-sm md:text-base text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                      {lang === "te" ? activeQa.aTe : activeQa.aEn}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between text-xs text-stone-500">
                  <span>Source: PJTAU Vyavasaya Panchangam (2025-26)</span>
                  <span className="font-mono text-emerald-600 font-semibold">Latency: 0 ms (Pre-cached)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================== */}
        {/* STEP 6: SAMPLE LEAF DISEASE SCANNER                    */}
        {/* ====================================================== */}
        {activeStep === 6 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 inline-block mb-2">
                  Step 6 of 7: Computer Vision Diagnostics
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te"
                    ? "నమూనా ఆకు తెగుళ్ల స్కానర్ (3 రికార్డ్ చేసిన ఫలితాలు)"
                    : "Sample Leaf Disease Scanner: 3 Recorded Leaves"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Instant diagnostic cards with custom inline SVG leaf vectors, symptoms, and PJTAU dosage recommendations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(5)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-semibold hover:bg-stone-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(7)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <span>Next: Mandi Prices (Step 7)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Permanent Label Badge */}
            <div className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                Recorded sample result, not a live AI diagnosis / రికార్డ్ చేయబడిన నమూనా ఫలితం, ప్రత్యక్ష AI నిర్ధారణ కాదు
              </span>
              <span className="text-[11px] font-mono font-bold bg-white dark:bg-stone-900 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
                100% Vector Rendered
              </span>
            </div>

            {/* 3 Sample Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {SAMPLE_LEAF_DISEASES.map((d) => {
                const isSelected = d.id === selectedDiseaseId;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiseaseId(d.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "te" ? d.cropTe : d.cropEn}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                      {lang === "te" ? d.diseaseTe : d.diseaseEn}
                    </h4>
                    <span className="text-[10px] text-stone-500 font-mono mt-1 block">
                      Confidence: {d.confidence}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Disease Details Dossier */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-stone-50 dark:bg-stone-800/60 rounded-3xl p-6 border border-stone-200 dark:border-stone-700">
              {/* Inline SVG Leaf Graphic */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
                  Visual Symptom Vector
                </span>

                {/* Paddy Blast SVG */}
                {activeDisease.svgType === "blast" && (
                  <svg className="w-44 h-44" viewBox="0 0 200 200" fill="none">
                    {/* Leaf Blade */}
                    <path
                      d="M100 20 C140 60 160 120 100 180 C40 120 60 60 100 20 Z"
                      fill="#4ade80"
                      stroke="#16a34a"
                      strokeWidth="3"
                    />
                    <path d="M100 20 L100 180" stroke="#15803d" strokeWidth="2" strokeDasharray="3 3" />
                    {/* Spindle lesions with grey centers and brown borders */}
                    <ellipse cx="100" cy="70" rx="14" ry="32" fill="#78350f" transform="rotate(-15 100 70)" />
                    <ellipse cx="100" cy="70" rx="9" ry="24" fill="#cbd5e1" transform="rotate(-15 100 70)" />
                    <ellipse cx="115" cy="120" rx="10" ry="22" fill="#78350f" transform="rotate(20 115 120)" />
                    <ellipse cx="115" cy="120" rx="6" ry="16" fill="#cbd5e1" transform="rotate(20 115 120)" />
                    <ellipse cx="85" cy="135" rx="8" ry="18" fill="#78350f" transform="rotate(-10 85 135)" />
                    <ellipse cx="85" cy="135" rx="5" ry="12" fill="#cbd5e1" transform="rotate(-10 85 135)" />
                  </svg>
                )}

                {/* Cotton Bollworm SVG */}
                {activeDisease.svgType === "bollworm" && (
                  <svg className="w-44 h-44" viewBox="0 0 200 200" fill="none">
                    {/* Cotton Boll Base */}
                    <circle cx="100" cy="110" r="45" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
                    {/* Calyx Leaves */}
                    <path d="M100 50 L115 75 L100 85 L85 75 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                    <path d="M50 110 L75 125 L85 110 L75 95 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                    <path d="M150 110 L125 125 L115 110 L125 95 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                    {/* Entry Hole & Stained Area */}
                    <circle cx="110" cy="115" r="14" fill="#92400e" opacity="0.3" />
                    <circle cx="110" cy="115" r="6" fill="#1e293b" />
                    {/* Small Pinkish Larva Graphic */}
                    <path
                      d="M90 135 Q105 145 120 135"
                      stroke="#f43f5e"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {/* Chilli Leaf Curl SVG */}
                {activeDisease.svgType === "leafcurl" && (
                  <svg className="w-44 h-44" viewBox="0 0 200 200" fill="none">
                    {/* Curled, Puckered Leaf Blade */}
                    <path
                      d="M100 30 C130 50 145 90 120 160 C95 180 80 140 85 90 C85 60 90 40 100 30 Z"
                      fill="#86efac"
                      stroke="#15803d"
                      strokeWidth="3"
                    />
                    {/* Thickened Crinkled Veins */}
                    <path d="M100 30 Q105 100 105 170" stroke="#166534" strokeWidth="3" />
                    <path d="M102 70 Q125 65 130 80" stroke="#166534" strokeWidth="2.5" />
                    <path d="M103 105 Q125 105 120 125" stroke="#166534" strokeWidth="2.5" />
                    <path d="M100 85 Q85 80 86 100" stroke="#166534" strokeWidth="2.5" />
                    {/* Puckering Crinkles */}
                    <circle cx="115" cy="85" r="4" fill="#15803d" opacity="0.6" />
                    <circle cx="110" cy="120" r="5" fill="#15803d" opacity="0.6" />
                    <circle cx="95" cy="130" r="4" fill="#15803d" opacity="0.6" />
                  </svg>
                )}

                <div className="mt-4 text-center">
                  <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                    Confidence: {activeDisease.confidence}
                  </span>
                  <p className="text-[10px] text-stone-500 font-italic mt-0.5">{activeDisease.pathogen}</p>
                </div>
              </div>

              {/* Symptoms & PJTAU Prescription */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                      {activeDisease.severity}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {lang === "te" ? activeDisease.diseaseTe : activeDisease.diseaseEn}
                  </h3>
                  <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                    {lang === "te" ? activeDisease.symptomsTe : activeDisease.symptomsEn}
                  </p>
                </div>

                {/* Treatment Recommendations */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-700">
                  <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                    PJTAU Package of Practices Recommended Treatment:
                  </h5>
                  <ul className="space-y-2 text-xs md:text-sm">
                    {(lang === "te" ? activeDisease.recommendationsTe : activeDisease.recommendationsEn).map(
                      (rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-stone-800 dark:text-stone-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================== */}
        {/* STEP 7: SAMPLE MANDI PRICES & TELANGANA BONUS          */}
        {/* ====================================================== */}
        {activeStep === 7 && (
          <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 inline-block mb-2">
                  Step 7 of 7: Market Economics & DBT Bonus
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-white">
                  {lang === "te"
                    ? "మార్కెట్ ధరలు & తెలంగాణ ₹500 సన్నవడ్ల బోనస్"
                    : "Sample Mandi Prices: Telangana MSP + ₹500/Qtl State Bonus"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Recorded October 2026 APMC dataset demonstrating direct farmer realization (₹2,820/quintal) and WhatsApp sharing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep(6)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-semibold hover:bg-stone-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Presentation</span>
                </button>
              </div>
            </div>

            {/* Specific Crop Filter Chips */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300 mr-1">
                {lang === "te" ? "పంటను ఎంచుకోండి (Specific Crop):" : "Select Specific Crop:"}
              </span>
              {[
                { key: "paddy", labelEn: "🌾 Paddy (వరి)", labelTe: "🌾 వరి (ధాన్యం)" },
                { key: "cotton", labelEn: "☁️ Cotton (పత్తి)", labelTe: "☁️ పత్తి" },
                { key: "maize", labelEn: "🌽 Maize (మొక్కజొన్న)", labelTe: "🌽 మొక్కజొన్న" },
                { key: "chilli", labelEn: "🌶️ Chilli (మిరప)", labelTe: "🌶️ మిరప" },
                { key: "redgram", labelEn: "🫘 Redgram (కందులు)", labelTe: "🫘 కందులు" },
                { key: "all", labelEn: "✨ All Commodities", labelTe: "✨ అన్ని పంటలు" },
              ].map((c) => {
                const isSel = demoCropFilter === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setDemoCropFilter(c.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSel
                        ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500"
                        : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span>{lang === "te" ? c.labelTe : c.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Agmarknet & APMC Status Ribbon */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl px-4 py-2.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs md:text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                  {lang === "te"
                    ? `ప్రత్యక్ష APMC మార్కెట్ ధరలు — ${cropDisplayName} • తెలంగాణ`
                    : `Live APMC Mandi Rates for ${cropDisplayName} • Telangana`}
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded">
                  LIVE FEED
                </span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-stone-500 dark:text-stone-400">
                <span className="text-[11px] font-mono">
                  {mandiDataSource} • {lastSyncTime}
                </span>
                <button
                  onClick={() => fetchDemoMandi(demoCropFilter)}
                  disabled={isMandiLoading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 font-semibold text-emerald-800 dark:text-emerald-300 text-[11px] hover:bg-emerald-50 active:scale-95 transition"
                >
                  <RotateCcw className={`w-3 h-3 ${isMandiLoading ? "animate-spin" : ""}`} />
                  <span>{isMandiLoading ? "Syncing..." : "Sync Live"}</span>
                </button>
              </div>
            </div>

            {/* Mandi Prices Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 mb-8 bg-white dark:bg-stone-900 shadow-2xs">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="py-3 px-4">Market Yard</th>
                    <th className="py-3 px-4">Commodity & Variety</th>
                    <th className="py-3 px-4">Central MSP</th>
                    <th className="py-3 px-4">TS State Bonus</th>
                    <th className="py-3 px-4 text-emerald-700 dark:text-emerald-400">Total Farmer Rate</th>
                    <th className="py-3 px-4">Market Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                  {displayedDemoMandiRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.tsBonus > 0 ? "bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold" : "hover:bg-stone-50 dark:hover:bg-stone-850 transition"}
                    >
                      <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                        {lang === "te" ? row.yardTe : row.yardEn}
                      </td>
                      <td className="py-3 px-4">
                        {lang === "te" ? row.commodityTe : row.commodityEn}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {row.msp > 0 ? `₹${row.msp.toLocaleString()}` : "N/A"}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {row.tsBonus > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            +₹{row.tsBonus}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm md:text-base">
                        ₹{row.totalPrice.toLocaleString()} / Qtl
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interactive Yield Payout Deck & WhatsApp Share */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payout Calculator */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {activeFarmerName}'s {cropDisplayName} Payout Calculator
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {profile?.primaryCrop || (demoCropFilter === "cotton" ? "Bunny" : demoCropFilter === "maize" ? "Hybrid Yellow" : "RNR 15048")} ({profile?.areaAcre || 4.5} Acres)
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Expected Yield in Quintals / దిగుబడి (క్వింటాళ్లు):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={expectedYieldQtl}
                    onChange={(e) => setExpectedYieldQtl(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-base font-bold font-mono outline-none"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    {demoCropFilter === "cotton"
                      ? `Estimated ~${Math.round(expectedYieldQtl / (profile?.areaAcre || 4.5))} Qtl/acre for Cotton under drip irrigation.`
                      : demoCropFilter === "maize"
                      ? `Estimated ~${Math.round(expectedYieldQtl / (profile?.areaAcre || 4.5))} Qtl/acre for Maize.`
                      : `Average ~21-24 Quintals/acre for Paddy under optimal irrigation.`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                    <span className="text-xs text-stone-500 block">Total Realized Value:</span>
                    <span className="text-xl font-black text-stone-900 dark:text-white font-mono mt-1 block">
                      ₹{(expectedYieldQtl * activeRate).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-stone-400">@ ₹{activeRate.toLocaleString("en-IN")}/quintal</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      {activeBonus > 0 ? "TS Bonus Component:" : "Base MSP Value:"}
                    </span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">
                      {activeBonus > 0
                        ? `+₹${(expectedYieldQtl * activeBonus).toLocaleString("en-IN")}`
                        : `₹${(expectedYieldQtl * activeMsp).toLocaleString("en-IN")}`}
                    </span>
                    <span className="text-[10px] text-emerald-600">
                      {activeBonus > 0 ? "Direct DBT to Rythu Account" : `MSP Benchmark: ₹${activeMsp.toLocaleString("en-IN")}/Qtl`}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Share Advisory Generator */}
              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                        WhatsApp Rythu Advisory Formatter
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                      Bilingual Text
                    </span>
                  </div>

                  <div className="bg-white dark:bg-stone-900 rounded-xl p-3 border border-stone-200 dark:border-stone-700 font-mono text-[11px] text-stone-700 dark:text-stone-300 whitespace-pre-line max-h-40 overflow-y-auto">
                    {whatsappAdvisory}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyWhatsAppAdvisory}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
                        copiedShareText
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white"
                      }`}
                    >
                      {copiedShareText ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      <span>{copiedShareText ? "Copied!" : "Copy Text"}</span>
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappAdvisory)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </a>
                  </div>

                  <span className="text-[11px] text-stone-500">Rythu Direct Share</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ======================================================== */}
      {/* 5. BOTTOM PERSISTENT STEPPER NAVIGATION                  */}
      {/* ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 md:px-8 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs md:text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => setActiveStep((prev) => Math.min(DEMO_STEPS.length, prev + 1))}
              disabled={activeStep === DEMO_STEPS.length}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-bold shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-stone-500 font-mono">
            <span>Keyboard shortcuts: [←] Prev • [→] Next • [R] Reset</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/offline-demo.html"
              download="smart-farm-offline-demo.html"
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-200 transition flex items-center gap-1.5"
              title="Download standalone file for emergency backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline HTML</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
