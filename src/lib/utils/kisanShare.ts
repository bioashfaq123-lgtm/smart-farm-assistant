/**
 * Kisan WhatsApp & SMS Share Utilities
 * Formats agronomic recommendations into clean, readable text messages
 * in Telugu and English with one-click WhatsApp intent URL generator.
 */

export interface FertilizerShareData {
  crop: string;
  cropTe?: string;
  area: number;
  unit: string;
  ureaBags: number;
  dapBags: number;
  mopBags: number;
  estCost: number;
  splits: { stageEn: string; stageTe: string; notesEn: string; notesTe: string }[];
}

export interface SeedShareData {
  crop: string;
  cropTe?: string;
  area: number;
  unit: string;
  seedKg: number;
  packets: number;
  spacing: string;
  podKg?: number;
}

export interface PestShareData {
  crop: string;
  cropTe: string;
  pestName: string;
  pestNameTe: string;
  remedy: string;
  remedyTe: string;
  dosage: string;
  dosageTe: string;
  organic: string;
  organicTe: string;
  ppe: string;
  ppeTe: string;
}

export function formatFertilizerMessage(data: FertilizerShareData, lang: "en" | "te"): string {
  if (lang === "te") {
    return `🌾 *స్మార్ట్ ఫార్మ్ అసిస్టెంట్ - PJTAU ఎరువుల సలహా చీటీ* 🌾
పంట: ${data.cropTe || data.crop} | విస్తీర్ణం: ${data.area} ${data.unit === "acre" ? "ఎకరాలు" : data.unit}

📦 *అవసరమైన ఎరువుల బస్తాలు:*
• DAP (50 కిలోలు): ${data.dapBags} బస్తాలు
• యూరియా (45 కిలోలు): ${data.ureaBags} బస్తాలు
• MOP/పొటాష్ (50 కిలోలు): ${data.mopBags} బస్తాలు
💰 అంచనా వ్యయం: ₹${data.estCost.toLocaleString("en-IN")}

📅 *విడతల వారీగా వేసే పద్ధతి:*
${data.splits.map((s, i) => `${i + 1}. ${s.stageTe}: ${s.notesTe}`).join("\n")}

⚠️ *గమనిక:* మట్టి పరీక్ష ఆధారంగా లేదా గ్రామ AEO సలహా ప్రకారం మార్పులు చేసుకోండి.
📞 కిసాన్ టోల్ ఫ్రీ హెల్ప్‌లైన్: 1800-180-1551`;
  }

  return `🌾 *Smart Farm Assistant - PJTAU Fertilizer Prescription* 🌾
Crop: ${data.crop} | Land Area: ${data.area} ${data.unit}

📦 *Required Fertilizer Bags:*
• DAP (50 kg): ${data.dapBags} bags
• Urea (45 kg): ${data.ureaBags} bags
• MOP (50 kg): ${data.mopBags} bags
💰 Estimated Subsidized Cost: ₹${data.estCost.toLocaleString("en-IN")}

📅 *Recommended Split Application:*
${data.splits.map((s, i) => `${i + 1}. ${s.stageEn}: ${s.notesEn}`).join("\n")}

⚠️ *Notice:* Confirm with your local Agriculture Extension Officer (AEO) before purchase.
📞 Kisan Toll-Free Helpline: 1800-180-1551`;
}

export function formatPestMessage(data: PestShareData, lang: "en" | "te"): string {
  if (lang === "te") {
    return `🚨 *స్మార్ట్ ఫార్మ్ అసిస్టెంట్ - తెగులు గుర్తింపు & నివారణ* 🚨
పంట: ${data.cropTe}
తెగులు/పురుగు: ${data.pestNameTe}

🧪 *సిఫారసు చేయబడిన మందు:*
${data.remedyTe}
మోతాదు: ${data.dosageTe}

🌿 *సేంద్రియ / జీవ నియంత్రణ:*
${data.organicTe}

🛡️ *భద్రతా జాగ్రత్తలు:*
${data.ppeTe}
ఎదురుగాలిలో పిచికారీ చేయవద్దు. మాస్క్ మరియు చేతి తొడుగులు ధరించండి.
📞 కిసాన్ కాల్ సెంటర్: 1800-180-1551`;
  }

  return `🚨 *Smart Farm Assistant - Crop Pest Prescription* 🚨
Crop: ${data.crop}
Pest/Disease: ${data.pestName}

🧪 *PJTAU Recommended Chemical Treatment:*
${data.remedy}
Dosage: ${data.dosage}

🌿 *Organic / Biological Alternative:*
${data.organic}

🛡️ *Safety & PPE Rules:*
${data.ppe}
Never spray facing wind. Respirator and gloves mandatory.
📞 Kisan Call Centre: 1800-180-1551`;
}

export function generateWhatsAppUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
