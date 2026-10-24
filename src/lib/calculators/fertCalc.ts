/**
 * Telangana PJTAU Package of Practices Fertilizer Dosage Calculator
 */

export interface FertParams {
  crop: string;
  area: number;
  unit: "acre" | "guntha" | "ha";
}

export interface FertResult {
  crop: string;
  areaAcre: number;
  nKgPerHa: number;
  p2o5KgPerHa: number;
  k2oKgPerHa: number;
  nReqKg: number;
  pReqKg: number;
  kReqKg: number;
  dapBags: number;
  ureaBags: number;
  mopBags: number;
  splits: {
    stageEn: string;
    stageTe: string;
    dapPct: number;
    ureaPct: number;
    mopPct: number;
    notesEn: string;
    notesTe: string;
  }[];
}

export const CROP_NPK_PJTAU: Record<string, { n: number; p: number; k: number; nameEn: string; nameTe: string }> = {
  Paddy: { n: 120, p: 60, k: 40, nameEn: "Paddy (Rice)", nameTe: "వరి (Paddy)" },
  Maize: { n: 180, p: 60, k: 50, nameEn: "Maize (Corn)", nameTe: "మొక్కజొన్న (Maize)" },
  Cotton: { n: 150, p: 60, k: 60, nameEn: "Cotton", nameTe: "పత్తి (Cotton)" },
  Groundnut: { n: 30, p: 40, k: 50, nameEn: "Groundnut", nameTe: "వేరుశెనగ (Groundnut)" },
  Redgram: { n: 20, p: 50, k: 0, nameEn: "Redgram (Pigeonpea)", nameTe: "కంది (Redgram)" },
  Chilli: { n: 150, p: 60, k: 60, nameEn: "Chilli", nameTe: "మిరప (Chilli)" },
  Soybean: { n: 20, p: 60, k: 40, nameEn: "Soybean", nameTe: "సోయాచిక్కుడు (Soybean)" },
  Sesame: { n: 60, p: 40, k: 30, nameEn: "Sesame", nameTe: "నువ్వులు (Sesame)" },
};

const HA_PER_ACRE = 0.4047;
const HA_PER_GUNTHA = 0.010117;

export function calculateFertilizer(p: FertParams): FertResult {
  const cropData = CROP_NPK_PJTAU[p.crop] || CROP_NPK_PJTAU.Paddy;
  const area = p.area || 1;
  const areaHa = p.unit === "ha" ? area : p.unit === "guntha" ? area * HA_PER_GUNTHA : area * HA_PER_ACRE;
  const areaAcre = areaHa / HA_PER_ACRE;

  // Pure nutrient requirement for entered area
  const nReqKg = cropData.n * areaHa;
  const pReqKg = cropData.p * areaHa;
  const kReqKg = cropData.k * areaHa;

  // Fertilizers:
  // DAP (18% N, 46% P2O5) - 50 kg bag provides 9 kg N and 23 kg P2O5
  const dapBags = Math.ceil(pReqKg / 23);
  const nFromDap = dapBags * 9;

  // Remaining N supplied via Urea (46% N) - 45 kg bag provides 20.7 kg N
  const remainingN = Math.max(0, nReqKg - nFromDap);
  const ureaBags = Math.ceil(remainingN / 20.7);

  // MOP (60% K2O) - 50 kg bag provides 30 kg K2O
  const mopBags = Math.ceil(kReqKg / 30);

  const splits = [
    {
      stageEn: "Basal (At Sowing / Last Ploughing)",
      stageTe: "ఆఖరి దుక్కిలో / నాట్ల సమయంలో (బేసల్)",
      dapPct: 100,
      ureaPct: 33,
      mopPct: 50,
      notesEn: "Full DAP dose, 1/3rd Urea, and 1/2 MOP mixed thoroughly into soil.",
      notesTe: "మొత్తం DAP, 1/3 వంతు యూరియా మరియు సగం పొటాష్ దుక్కిలో వేయాలి.",
    },
    {
      stageEn: "Tillering / Active Vegetative Growth (30–35 DAS)",
      stageTe: "పిలకల దశ / శాకీయ ఎదుగుదల దశ (30–35 రోజులు)",
      dapPct: 0,
      ureaPct: 33,
      mopPct: 0,
      notesEn: "Top dress 1/3rd Urea when adequate soil moisture is present.",
      notesTe: "నేలలో తగినంత తేమ ఉన్నప్పుడు 1/3 వంతు యూరియాను పైపాటుగా వేయండి.",
    },
    {
      stageEn: "Panicle Initiation / Flowering Stage (60–65 DAS)",
      stageTe: "చిరుపొట్ట / పూత దశ (60–65 రోజులు)",
      dapPct: 0,
      ureaPct: 34,
      mopPct: 50,
      notesEn: "Final 1/3rd Urea and remaining 1/2 MOP to boost grain weight.",
      notesTe: "గింజ బరువు, నాణ్యత పెరగడానికి మిగిలిన యూరియా మరియు పొటాష్ వేయాలి.",
    },
  ];

  return {
    crop: p.crop,
    areaAcre,
    nKgPerHa: cropData.n,
    p2o5KgPerHa: cropData.p,
    k2oKgPerHa: cropData.k,
    nReqKg: Math.round(nReqKg),
    pReqKg: Math.round(pReqKg),
    kReqKg: Math.round(kReqKg),
    dapBags,
    ureaBags,
    mopBags,
    splits,
  };
}
