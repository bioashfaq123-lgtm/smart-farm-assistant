import {
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  Activity,
  TrendingUp,
  Landmark,
  Sparkles,
  Wrench,
  Presentation,
  Compass,
  LucideIcon,
} from "lucide-react";

export type FeatureCategory = "all" | "ai" | "iot" | "market" | "tools";

export interface PlatformFeature {
  id: string;
  href: string;
  titleEn: string;
  titleTe: string;
  shortLabelEn: string;
  shortLabelTe: string;
  descriptionEn: string;
  descriptionTe: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  category: "ai" | "iot" | "market" | "tools" | "core";
  categoryLabelEn: string;
  categoryLabelTe: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  isPrimaryBottomNav?: boolean;
}

export const FEATURE_CATEGORIES = [
  { id: "all", labelEn: "All Features (10)", labelTe: "అన్ని ఫీచర్లు (10)" },
  { id: "ai", labelEn: "AI & Crop Health", labelTe: "ఏఐ & పంట ఆరోగ్యం" },
  { id: "iot", labelEn: "Field & IoT", labelTe: "క్షేత్ర ఆటోమేషన్" },
  { id: "market", labelEn: "Market & Schemes", labelTe: "మార్కెట్ & పథకాలు" },
  { id: "tools", labelEn: "Calculators & Demo", labelTe: "సాధనాలు & డెమో" },
] as const;

export interface FeatureSectionGroup {
  id: string;
  titleEn: string;
  titleTe: string;
  features: PlatformFeature[];
}

export const PLATFORM_FEATURES: PlatformFeature[] = [

  {
    id: "dashboard",
    href: "/dashboard",
    titleEn: "Farm Dashboard",
    titleTe: "ఫార్మ్ డాష్‌బోర్డ్",
    shortLabelEn: "Dashboard",
    shortLabelTe: "డాష్‌బోర్డ్",
    descriptionEn: "Complete overview of your farm, local district weather forecasts, active crop status, and quick telemetry.",
    descriptionTe: "రైతు ప్రొఫైల్, స్థానిక జిల్లా వాతావరణం, పంట పరిస్థితి మరియు ఐఓటీ సమాచారం.",
    icon: LayoutDashboard,
    badge: "Core",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    category: "core",
    categoryLabelEn: "Overview",
    categoryLabelTe: "సమీక్ష",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/40",
    accentText: "text-emerald-700 dark:text-emerald-400",
    accentBorder: "border-emerald-200 dark:border-emerald-800",
    isPrimaryBottomNav: true,
  },
  {
    id: "diagnosis",
    href: "/diagnosis",
    titleEn: "Crop Disease Diagnosis",
    titleTe: "పంట రోగ నిర్ధారణ",
    shortLabelEn: "Diagnosis",
    shortLabelTe: "రోగ నిర్ధారణ",
    descriptionEn: "Snap a leaf photo or describe symptoms to receive instant differential pathology diagnosis and extension advice.",
    descriptionTe: "ఆకు ఫోటో తీసి పంట తెగుళ్ళను తక్షణమే గుర్తించండి మరియు విశ్వవిద్యాలయ నివారణ పద్ధతులు పొందండి.",
    icon: Stethoscope,
    badge: "AI Vision",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    category: "ai",
    categoryLabelEn: "AI & Crop Health",
    categoryLabelTe: "ఏఐ & పంట ఆరోగ్యం",
    accentBg: "bg-purple-50 dark:bg-purple-950/40",
    accentText: "text-purple-700 dark:text-purple-400",
    accentBorder: "border-purple-200 dark:border-purple-800",
    isPrimaryBottomNav: true,
  },
  {
    id: "iot",
    href: "/iot",
    titleEn: "IoT Soil Telemetry & Pump",
    titleTe: "ఐఓటీ సెన్సార్లు & పంపు నియంత్రణ",
    shortLabelEn: "IoT Pump",
    shortLabelTe: "ఐఓటీ పంపు",
    descriptionEn: "Continuous ESP32 soil moisture (VWC%), temperature, EC, and automated pump cutoff interlock.",
    descriptionTe: "నేలలోని తేమ, ఉష్ణోగ్రత మరియు మొబైల్ ద్వారా వ్యవసాయ బోర్ పంపును ఆన్/ఆఫ్ చేసే నియంత్రణ.",
    icon: Activity,
    badge: "Live ESP32",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    category: "iot",
    categoryLabelEn: "Field Automation",
    categoryLabelTe: "క్షేత్ర ఆటోమేషన్",
    accentBg: "bg-teal-50 dark:bg-teal-950/40",
    accentText: "text-teal-700 dark:text-teal-400",
    accentBorder: "border-teal-200 dark:border-teal-800",
    isPrimaryBottomNav: true,
  },
  {
    id: "market",
    href: "/market",
    titleEn: "Live APMC Mandi Market",
    titleTe: "లైవ్ మార్కెట్ యార్డ్ ధరలు",
    shortLabelEn: "Mandi Rates",
    shortLabelTe: "మార్కెట్ ధరలు",
    descriptionEn: "Live crop rates across Telangana mandis, ₹500/Qtl fine rice bonus calculation, and GPS mandi routes.",
    descriptionTe: "తెలంగాణ మార్కెట్ ధరలు, సన్న బియ్యం ₹500 బోనస్ లెక్కలు మరియు మార్కెట్ యార్డ్ రూట్ మ్యాప్.",
    icon: TrendingUp,
    badge: "Live APMC",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    category: "market",
    categoryLabelEn: "Market & Finance",
    categoryLabelTe: "మార్కెట్ & ఆర్థికం",
    accentBg: "bg-amber-50 dark:bg-amber-950/40",
    accentText: "text-amber-700 dark:text-amber-400",
    accentBorder: "border-amber-200 dark:border-amber-800",
    isPrimaryBottomNav: true,
  },
  {
    id: "advisory",
    href: "/advisory",
    titleEn: "AI Krishi Sahayak Advisory",
    titleTe: "ఏఐ వ్యవసాయ సలహాదారు",
    shortLabelEn: "AI Advisor",
    shortLabelTe: "ఏఐ సలహాలు",
    descriptionEn: "Interactive bilingual voice & text chat with agricultural AI for fertilizers, pest management, and crop planning.",
    descriptionTe: "ఎరువులు, తెగుళ్ళు మరియు సమగ్ర సాగుపై ఏఐ నిపుణుడితో తెలుగు మరియు ఇంగ్లీషులో సంభాషించండి.",
    icon: MessageSquare,
    badge: "AI Chat",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    category: "ai",
    categoryLabelEn: "AI & Crop Health",
    categoryLabelTe: "ఏఐ & పంట ఆరోగ్యం",
    accentBg: "bg-sky-50 dark:bg-sky-950/40",
    accentText: "text-sky-700 dark:text-sky-400",
    accentBorder: "border-sky-200 dark:border-sky-800",
  },
  {
    id: "schemes",
    href: "/schemes",
    titleEn: "Govt Schemes & Subsidies",
    titleTe: "ప్రభుత్వ పథకాలు & సబ్సిడీలు",
    shortLabelEn: "Schemes",
    shortLabelTe: "పథకాలు",
    descriptionEn: "12+ state & central schemes: Rythu Bharosa (₹15,000/acre), Rythu Bima, PM-KISAN, loan waivers, solar pump subsidies.",
    descriptionTe: "రైతు భరోసా, రైతు బీమా, పీఎం కిసాన్, రుణమాఫీ మరియు సోలార్ సబ్సిడీల పూర్తి మార్గదర్శిని.",
    icon: Landmark,
    badge: "12 Schemes",
    badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    category: "market",
    categoryLabelEn: "Market & Finance",
    categoryLabelTe: "మార్కెట్ & ఆర్థికం",
    accentBg: "bg-indigo-50 dark:bg-indigo-950/40",
    accentText: "text-indigo-700 dark:text-indigo-400",
    accentBorder: "border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "insights",
    href: "/insights",
    titleEn: "Farm Insights & Yield Analytics",
    titleTe: "పంట విశ్లేషణ & దిగుబడి",
    shortLabelEn: "Insights",
    shortLabelTe: "విశ్లేషణ",
    descriptionEn: "Predictive yield projections, cost-benefit analysis, soil health interpretation, and crop rotation recommender.",
    descriptionTe: "దిగుబడి అంచనాలు, ఖర్చుల విశ్లేషణ, నేల సారవంతం మరియు పంట మార్పిడి శాస్త్రీయ సూచనలు.",
    icon: Sparkles,
    badge: "Analytics",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    category: "ai",
    categoryLabelEn: "AI & Crop Health",
    categoryLabelTe: "ఏఐ & పంట ఆరోగ్యం",
    accentBg: "bg-rose-50 dark:bg-rose-950/40",
    accentText: "text-rose-700 dark:text-rose-400",
    accentBorder: "border-rose-200 dark:border-rose-800",
  },
  {
    id: "tools",
    href: "/tools",
    titleEn: "Scientific Agri Calculators",
    titleTe: "వ్యవసాయ కాలిక్యులేటర్లు",
    shortLabelEn: "Agri Tools",
    shortLabelTe: "టూల్స్",
    descriptionEn: "Precision calculators for NPK 3-split fertilizer dosage, seed rates, spray dilution, and water consumption.",
    descriptionTe: "ఎరువుల మోతాదు, విత్తన పరిమాణం, స్ప్రే ట్యాంక్ కొలతలు మరియు నీటి పారుదల కాలిక్యులేటర్లు.",
    icon: Wrench,
    badge: "Calculators",
    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
    category: "tools",
    categoryLabelEn: "Tools & Utilities",
    categoryLabelTe: "సాధనాలు & పరికరాలు",
    accentBg: "bg-orange-50 dark:bg-orange-950/40",
    accentText: "text-orange-700 dark:text-orange-400",
    accentBorder: "border-orange-200 dark:border-orange-800",
  },
  {
    id: "demo",
    href: "/demo",
    titleEn: "Conference Demo & Offline Mode",
    titleTe: "కాన్ఫరెన్స్ డెమో మోడ్",
    shortLabelEn: "Live Demo",
    shortLabelTe: "డెమో మోడ్",
    descriptionEn: "Full offline simulator and benchmark evaluation showcase for live conference presentations.",
    descriptionTe: "ఇంటర్నెట్ లేకపోయినా పనిచేసే ఆఫ్‌లైన్ డెమో మరియు మూల్యాంకన ప్రదర్శన వేదిక.",
    icon: Presentation,
    badge: "Offline Ready",
    badgeColor: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300",
    category: "tools",
    categoryLabelEn: "Tools & Utilities",
    categoryLabelTe: "సాధనాలు & పరికరాలు",
    accentBg: "bg-stone-50 dark:bg-stone-900",
    accentText: "text-stone-700 dark:text-stone-300",
    accentBorder: "border-stone-200 dark:border-stone-800",
  },
  {
    id: "showcase",
    href: "/",
    titleEn: "Platform Guide & Showcase",
    titleTe: "ప్లాట్‌ఫారమ్ గైడ్ & ఫీచర్లు",
    shortLabelEn: "Showcase",
    shortLabelTe: "షోకేస్",
    descriptionEn: "Complete ecosystem overview, farmer profile registration guide, and frequently asked questions.",
    descriptionTe: "మొత్తం ఫీచర్ల సారాంశం, రైతు ప్రొఫైల్ నమోదు మరియు తరచుగా అడిగే ప్రశ్నలు (FAQ).",
    icon: Compass,
    badge: "Guide",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    category: "core",
    categoryLabelEn: "Overview",
    categoryLabelTe: "సమీక్ష",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/40",
    accentText: "text-emerald-700 dark:text-emerald-400",
    accentBorder: "border-emerald-200 dark:border-emerald-800",
  },
];

export function getFeatureSectionGroups(): FeatureSectionGroup[] {
  return [
    {
      id: "core",
      titleEn: "Overview",
      titleTe: "సమీక్ష",
      features: PLATFORM_FEATURES.filter((f) => f.category === "core"),
    },
    {
      id: "ai",
      titleEn: "AI & Crop Health",
      titleTe: "ఏఐ & పంట ఆరోగ్యం",
      features: PLATFORM_FEATURES.filter((f) => f.category === "ai"),
    },
    {
      id: "iot",
      titleEn: "Field Automation",
      titleTe: "క్షేత్ర ఆటోమేషన్",
      features: PLATFORM_FEATURES.filter((f) => f.category === "iot"),
    },
    {
      id: "market",
      titleEn: "Market & Schemes",
      titleTe: "మార్కెట్ & ఆర్థికం",
      features: PLATFORM_FEATURES.filter((f) => f.category === "market"),
    },
    {
      id: "tools",
      titleEn: "Tools & Utilities",
      titleTe: "సాధనాలు & డెమో",
      features: PLATFORM_FEATURES.filter((f) => f.category === "tools"),
    },
  ];
}

export function getPrimaryBottomNavFeatures(): PlatformFeature[] {
  return PLATFORM_FEATURES.filter((f) => f.isPrimaryBottomNav);
}

