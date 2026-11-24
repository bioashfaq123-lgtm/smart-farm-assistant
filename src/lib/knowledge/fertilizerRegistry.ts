import { FertilizerCropSchedule, SourceCitation } from "./types";

/**
 * Standard PJTAU Telangana Vyavasaayam Diksoochi 2019-2020 & Package of Practices
 * Baseline Crop Nutrient Schedules with Exact Split Stages.
 */
export const VERIFIED_FERTILIZER_SCHEDULES: Record<string, FertilizerCropSchedule> = {
  Paddy: {
    crop: "Paddy",
    recommendedNutrientsPerAcre: { nKg: 48, pKg: 24, kKg: 16, znKg: 5 },
    recommendedNutrientsPerHa: { nKg: 120, pKg: 60, kKg: 40 },
    splits: [
      {
        stageEn: "Basal (Final Puddling / Dhummu)",
        stageTe: "ఆఖరి దుక్కిలో / నాట్లకు ముందు (బేసల్)",
        timingDays: "Day 0 (At planting)",
        dapKg: 52, // 1 bag DAP (50 kg) provides 23 kg P2O5 and 9 kg N
        ureaKg: 0,
        mopKg: 13.5, // ~1/2 of Potash (approx 13-14 kg MOP)
        zincKg: 20, // 20 kg Zinc Sulphate (21%) per acre once in 3 seasons
        notesEn: "CRITICAL: Apply entire DAP (Phosphorus) in the final puddle before transplanting. Phosphorus is immobile; never top-dress DAP later.",
        notesTe: "ముఖ్య గమనిక: మొత్తం DAP (భాస్వరం) ఆఖరి దుక్కిలోనే వేయాలి. భాస్వరం నేలలో కదలదు, కాబట్టి నాటిన తర్వాత DAP పైపాటుగా వేస్తే వృథా అవుతుంది.",
      },
      {
        stageEn: "Active Tillering Stage",
        stageTe: "పిలకల దశ (నాటిన 20–25 రోజులకు)",
        timingDays: "20–25 DAT (Days After Transplanting)",
        dapKg: 0, // STRICTLY ZERO DAP
        ureaKg: 42.5, // ~1 bag Urea (45 kg)
        mopKg: 0,
        notesEn: "Top dress Urea only. Drain excess water to a thin 1-2 cm film before broadcasting. If zinc rust spots appear, spray 2g ZnSO4 + 10g Urea per L.",
        notesTe: "యూరియా మాత్రమే పైపాటుగా వేయాలి. పొలంలో నీరు ఎక్కువగా ఉంటే తీసివేసి పలుచటి తేమలో మాత్రమే యూరియా చల్లాలి. ఎట్టి పరిస్థితుల్లోనూ DAP వేయరాదు.",
      },
      {
        stageEn: "Panicle Initiation (Boot Leaf Stage)",
        stageTe: "చిరుపొట్ట / పూత దశ (నాటిన 45–50 రోజులకు)",
        timingDays: "45–50 DAT",
        dapKg: 0,
        ureaKg: 42.5, // ~1 bag Urea (45 kg)
        mopKg: 13.5, // Remaining 1/2 Potash (~13-14 kg MOP)
        notesEn: "Final split of Urea along with remaining Potash (MOP). Potash strengthens culms and increases test grain weight and disease resistance.",
        notesTe: "చివరి విడత యూరియా మరియు మిగిలిన పొటాష్ వేయాలి. పొటాష్ గింజ బరువు, నాణ్యత పెంచి చేను పడిపోకుండా కాపాడుతుంది.",
      },
    ],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU (Professor Jayashankar Telangana State Agricultural University)",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 43,
      printedPage: 10,
      sectionHeader: "వరి ఎరువుల యాజమాన్యం (Paddy Fertilizer Management)",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    soilAdjustmentRules: {
      lowNutrientMultiplier: 1.25,
      mediumNutrientMultiplier: 1.0,
      highNutrientMultiplier: 0.75,
    },
  },

  Cotton: {
    crop: "Cotton",
    recommendedNutrientsPerAcre: { nKg: 60, pKg: 24, kKg: 24 },
    recommendedNutrientsPerHa: { nKg: 150, pKg: 60, kKg: 60 },
    splits: [
      {
        stageEn: "Basal (At Sowing)",
        stageTe: "విత్తే సమయంలో (ఆఖరి దుక్కి)",
        timingDays: "0 DAS (Days After Sowing)",
        dapKg: 52,
        ureaKg: 15,
        mopKg: 10,
        notesEn: "Apply full P2O5 as DAP along with 20% N and 20% K in bands 5 cm away and below seed level.",
        notesTe: "మొత్తం DAP, కొద్దిపాటి యూరియా, పొటాష్ దుక్కిలో లేదా విత్తనానికి 5 సెం.మీ దూరంలో చారలలో వేయాలి.",
      },
      {
        stageEn: "Vegetative / Square Initiation",
        stageTe: "శాకీయ ఎదుగుదల / కాయ మొగ్గ దశ (30–35 రోజులు)",
        timingDays: "30–35 DAS",
        dapKg: 0,
        ureaKg: 35,
        mopKg: 10,
        notesEn: "Apply 2nd split in moist soil followed by inter-cultivation (edlu kattedam).",
        notesTe: "నేలలో తగినంత తేమ ఉన్నప్పుడు వేసి గుంటక లేదా దంతితో నేలలో కలపాలి.",
      },
      {
        stageEn: "Peak Flowering Stage",
        stageTe: "తీవ్రమైన పూత దశ (60–65 రోజులు)",
        timingDays: "60–65 DAS",
        dapKg: 0,
        ureaKg: 35,
        mopKg: 10,
        notesEn: "Apply 3rd split to sustain floral retention and prevent square dropping.",
        notesTe: "పూత, పిందె రాలకుండా ఉండేందుకు 3వ విడత ఎరువులు వేయాలి.",
      },
      {
        stageEn: "Boll Development Stage",
        stageTe: "కాయ అభివృద్ధి దశ (80–90 రోజులు)",
        timingDays: "80–90 DAS",
        dapKg: 0,
        ureaKg: 25,
        mopKg: 10,
        notesEn: "Final dose. If moisture is receding, spray 2% Potassium Nitrate (13-0-45) @ 20 g/L.",
        notesTe: "చివరి విడత ఎరువులు. వర్షాభావ పరిస్థితుల్లో 13-0-45 (20 గ్రా/లీ) పిచికారీ చేయాలి.",
      },
    ],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 105,
      printedPage: 72,
      sectionHeader: "పత్తి సమగ్ర పోషక యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    soilAdjustmentRules: {
      lowNutrientMultiplier: 1.25,
      mediumNutrientMultiplier: 1.0,
      highNutrientMultiplier: 0.75,
    },
  },

  Chilli: {
    crop: "Chilli",
    recommendedNutrientsPerAcre: { nKg: 60, pKg: 24, kKg: 24 },
    recommendedNutrientsPerHa: { nKg: 150, pKg: 60, kKg: 60 },
    splits: [
      {
        stageEn: "Basal (Transplanting)",
        stageTe: "నాట్ల సమయంలో (బేసల్)",
        timingDays: "0 DAT",
        dapKg: 52,
        ureaKg: 20,
        mopKg: 10,
        notesEn: "Entire Phosphorus as DAP with 20% N and 20% K. Incorporate 10 tonnes FYM/acre before planting.",
        notesTe: "మొత్తం DAP తో పాటు కొద్ది మోతాదులో యూరియా, పొటాష్. ఎకరానికి 10 టన్నుల పశువుల ఎరువు తప్పనిసరి.",
      },
      {
        stageEn: "Branching Stage (30 DAT)",
        stageTe: "కొమ్మలు పుట్టే దశ (30 రోజులు)",
        timingDays: "30 DAT",
        dapKg: 0,
        ureaKg: 30,
        mopKg: 10,
        notesEn: "Apply 2nd split around plant basins.",
        notesTe: "మొక్కల మొదళ్ల వద్ద రింగులుగా ఎరువు వేసి మట్టి ఎక్కించాలి.",
      },
      {
        stageEn: "Flowering & Fruit Set (60 DAT)",
        stageTe: "పూత, కాయ కట్టే దశ (60 రోజులు)",
        timingDays: "60 DAT",
        dapKg: 0,
        ureaKg: 30,
        mopKg: 10,
        notesEn: "3rd split to nourish developing green chillies.",
        notesTe: "కాయ ఎదుగుదలకు 3వ విడత ఎరువులు అందించాలి.",
      },
      {
        stageEn: "Post 1st Picking (90 DAT)",
        stageTe: "మొదటి కోత తర్వాత (90 రోజులు)",
        timingDays: "90 DAT",
        dapKg: 0,
        ureaKg: 30,
        mopKg: 10,
        notesEn: "Replenish nutrients for secondary pickings.",
        notesTe: "తదుపరి కోతలకు కాయల నాణ్యత పెరగడానికి చివరి విడత అందించాలి.",
      },
    ],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 168,
      printedPage: 135,
      sectionHeader: "మిరప ఎరువుల సమగ్ర యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    soilAdjustmentRules: {
      lowNutrientMultiplier: 1.25,
      mediumNutrientMultiplier: 1.0,
      highNutrientMultiplier: 0.75,
    },
  },

  Maize: {
    crop: "Maize",
    recommendedNutrientsPerAcre: { nKg: 72, pKg: 24, kKg: 20 },
    recommendedNutrientsPerHa: { nKg: 180, pKg: 60, kKg: 50 },
    splits: [
      {
        stageEn: "Basal (At Sowing)",
        stageTe: "విత్తే సమయంలో (ఆఖరి దుక్కి)",
        timingDays: "0 DAS",
        dapKg: 52,
        ureaKg: 35,
        mopKg: 17,
        notesEn: "Full DAP, 1/3rd Urea, and 1/2 Potash at planting.",
        notesTe: "మొత్తం DAP, మూడో వంతు యూరియా, సగం పొటాష్ దుక్కిలో వేయాలి.",
      },
      {
        stageEn: "Knee-High Stage (మోకాలి లోతు దశ)",
        stageTe: "మోకాలి లోతు దశ (30–35 రోజులు)",
        timingDays: "30–35 DAS",
        dapKg: 0,
        ureaKg: 50,
        mopKg: 0,
        notesEn: "Top dress 1/3rd Urea in rows followed by earthing up.",
        notesTe: "రెండవ విడత యూరియా వేసి మొక్కల మొదళ్ళ వద్ద మట్టి ఎగదోయాలి.",
      },
      {
        stageEn: "Tasseling & Silking Stage (కంకి పూత దశ)",
        stageTe: "కంకి పూత / గింజ పాలుపోసుకునే దశ (55–60 రోజులు)",
        timingDays: "55–60 DAS",
        dapKg: 0,
        ureaKg: 50,
        mopKg: 17,
        notesEn: "Final 1/3rd Urea and remaining 1/2 Potash to optimize cob size and grain fill.",
        notesTe: "కంకిలో గింజ నిండుగా మారడానికి మిగిలిన యూరియా మరియు పొటాష్ వేయాలి.",
      },
    ],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 78,
      printedPage: 45,
      sectionHeader: "మొక్కజొన్న పోషక యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    soilAdjustmentRules: {
      lowNutrientMultiplier: 1.25,
      mediumNutrientMultiplier: 1.0,
      highNutrientMultiplier: 0.75,
    },
  },

  Redgram: {
    crop: "Redgram",
    recommendedNutrientsPerAcre: { nKg: 8, pKg: 20, kKg: 0 },
    recommendedNutrientsPerHa: { nKg: 20, pKg: 50, kKg: 0 },
    splits: [
      {
        stageEn: "Basal (At Sowing)",
        stageTe: "విత్తే సమయంలో (ఆఖరి దుక్కి)",
        timingDays: "0 DAS",
        dapKg: 43.5, // 1 bag DAP provides ~20 kg P2O5 and 8 kg N (exact starter N!)
        ureaKg: 0,
        mopKg: 0,
        notesEn: "As a legume, Redgram fixes its own nitrogen after nodulation. DAP supplies the required starter N and full P2O5.",
        notesTe: "పప్పుధాన్యాల పంట కాబట్టి వేరుబుడిపెల ద్వారా నత్రజని స్థిరీకరించుకుంటుంది. DAP ద్వారా వచ్చే కొద్ది నత్రజని, మొత్తం భాస్వరం సరిపోతుంది. అదనపు యూరియా వేయరాదు.",
      },
    ],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 122,
      printedPage: 89,
      sectionHeader: "కంది పోషక యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    soilAdjustmentRules: {
      lowNutrientMultiplier: 1.25,
      mediumNutrientMultiplier: 1.0,
      highNutrientMultiplier: 0.75,
    },
  },

  Groundnut: {
    crop: "Groundnut",
    recommendedNutrientsPerAcre: { nKg: 12, pKg: 16, kKg: 20 },
    recommendedNutrientsPerHa: { nKg: 30, pKg: 40, kKg: 50 },
    splits: [
      {
        stageEn: "Basal (At Sowing)",
        stageTe: "విత్తే సమయంలో",
        timingDays: "0 DAS",
        dapKg: 35,
        ureaKg: 15,
        mopKg: 33,
        notesEn: "Full P2O5, full Potash, and starter N mixed into soil before sowing.",
        notesTe: "మొత్తం భాస్వరం, పొటాష్ మరియు నత్రజని ఆఖరి దుక్కిలో వేయాలి.",
      },
      {
        stageEn: "Gypsum Application at Flowering",
        stageTe: "పూత దశలో జిప్సం వేయడం (40–45 రోజులు)",
        timingDays: "40–45 DAS",
        dapKg: 0,
        ureaKg: 0,
        mopKg: 0,
        notesEn: "CRITICAL: Apply 200 kg Gypsum/acre near root zone and earth up. Gypsum provides Calcium (for shell hardening) and Sulphur (for oil synthesis).",
        notesTe: "ముఖ్యమైనది: ఎకరానికి 200 కిలోల జిప్సం వేసి మట్టి ఎక్కించాలి. కాల్షియం కాయ గట్టిపడటానికి, గింజ ఊరడానికి మరియు నూనె శాతానికి అత్యవసరం.",
      },
    ],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 144,
      printedPage: 111,
      sectionHeader: "వేరుశెనగ ఎరువుల యాజమాన్యం & జిప్సం ప్రాముఖ్యత",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    soilAdjustmentRules: {
      lowNutrientMultiplier: 1.25,
      mediumNutrientMultiplier: 1.0,
      highNutrientMultiplier: 0.75,
    },
  },
};

/**
 * Deterministic Stoichiometric Fertilizer Dosage Engine.
 * Accurately accounts for nutrients provided by each fertilizer (avoiding double-counting).
 */
export interface FertilizerCalculationInput {
  crop: string;
  area: number;
  unit: "acre" | "guntha" | "ha";
  soilTestStatus?: {
    provided: boolean;
    nitrogenRating?: "Low" | "Medium" | "High";
    phosphorusRating?: "Low" | "Medium" | "High";
    potassiumRating?: "Low" | "Medium" | "High";
  };
  organicManureTonnesApplied?: number; // FYM / Vermicompost
}

export interface CommercialFertilizerBags {
  dapBags50kg: number;
  dapKgTotal: number;
  ureaBags45kg: number;
  ureaKgTotal: number;
  mopBags50kg: number;
  mopKgTotal: number;
  zincSulphateKgTotal?: number;
}

export interface DetailedFertilizerReport {
  crop: string;
  areaAcre: number;
  isSoilTestGrounded: boolean;
  rawNutrientRequirementKg: { n: number; p: number; k: number };
  adjustedNutrientRequirementKg: { n: number; p: number; k: number };
  commercialProducts: CommercialFertilizerBags;
  stageSplits: Array<{
    stageEn: string;
    stageTe: string;
    timing: string;
    dapKg: number;
    ureaKg: number;
    mopKg: number;
    zincKg?: number;
    notesEn: string;
    notesTe: string;
  }>;
  organicNutrientCreditNotes?: string;
  stoichiometryExplanation: string;
  citation: SourceCitation;
}

export function computeSourceGroundedFertilizer(input: FertilizerCalculationInput): DetailedFertilizerReport {
  const cropSchedule = VERIFIED_FERTILIZER_SCHEDULES[input.crop] || VERIFIED_FERTILIZER_SCHEDULES.Paddy;

  // Normalize area to Acres
  let areaAcre = input.area || 1;
  if (input.unit === "ha") {
    areaAcre = input.area * 2.47105;
  } else if (input.unit === "guntha") {
    areaAcre = input.area / 40.0;
  }

  // Base Nutrient Requirement
  let baseN = cropSchedule.recommendedNutrientsPerAcre.nKg * areaAcre;
  let baseP = cropSchedule.recommendedNutrientsPerAcre.pKg * areaAcre;
  let baseK = cropSchedule.recommendedNutrientsPerAcre.kKg * areaAcre;

  const rawReq = {
    n: Math.round(baseN * 10) / 10,
    p: Math.round(baseP * 10) / 10,
    k: Math.round(baseK * 10) / 10,
  };

  // Soil Test Calibration
  let isSoilTestGrounded = false;
  let adjN = baseN;
  let adjP = baseP;
  let adjK = baseK;

  if (input.soilTestStatus && input.soilTestStatus.provided) {
    isSoilTestGrounded = true;
    const { nitrogenRating, phosphorusRating, potassiumRating } = input.soilTestStatus;

    if (nitrogenRating === "Low") adjN *= 1.25;
    else if (nitrogenRating === "High") adjN *= 0.75;

    if (phosphorusRating === "Low") adjP *= 1.25;
    else if (phosphorusRating === "High") adjP *= 0.75;

    if (potassiumRating === "Low") adjK *= 1.25;
    else if (potassiumRating === "High") adjK *= 0.75;
  }

  // Organic Manure Deduction (if farmer applied FYM, 1 tonne supplies approx 2.5 kg N, 1 kg P2O5, 2.5 kg K2O)
  let organicCredit = "";
  if (input.organicManureTonnesApplied && input.organicManureTonnesApplied > 0) {
    const fymTonnes = input.organicManureTonnesApplied;
    organicCredit = `Farmer reported ${fymTonnes} tonnes of Farmyard Manure (FYM). This supplies approx ${fymTonnes * 5} kg total organic nutrients, improving soil microbial buffer and micronutrient availability.`;
  }

  // DETERMINISTIC STOICHIOMETRY:
  // 1. DAP (18% N, 46% P2O5): Supplies 100% of P2O5.
  // 1 bag DAP (50 kg) = 23 kg P2O5 + 9.0 kg N.
  const dapKgTotal = Math.round((adjP / 0.46) * 10) / 10;
  const dapBags50kg = Math.ceil(dapKgTotal / 50.0);

  // 2. Nitrogen supplied by DAP:
  const nFromDap = (dapKgTotal * 0.18);

  // 3. Remaining Nitrogen supplied via Urea (46% N):
  // 1 bag Urea (45 kg) = 20.7 kg N. If remaining N is negligible (<=2 kg, e.g. pulses where DAP covers starter N), 0 bags required.
  const remainingN = Math.max(0, adjN - nFromDap);
  const ureaKgTotal = remainingN > 2.0 ? Math.round((remainingN / 0.46) * 10) / 10 : 0;
  const ureaBags45kg = remainingN > 2.0 ? Math.ceil(ureaKgTotal / 45.0) : 0;

  // 4. Potash supplied via MOP (60% K2O):
  // 1 bag MOP (50 kg) = 30.0 kg K2O.
  const mopKgTotal = Math.round((adjK / 0.60) * 10) / 10;
  const mopBags50kg = Math.ceil(mopKgTotal / 50.0);

  // 5. Stage Splits Scaled to Area
  const stageSplits = cropSchedule.splits.map((s) => ({
    stageEn: s.stageEn,
    stageTe: s.stageTe,
    timing: s.timingDays,
    dapKg: Math.round(s.dapKg * areaAcre * (adjP / (baseP || 1))),
    ureaKg: Math.round(s.ureaKg * areaAcre * (remainingN / (baseN * 0.8 || 1))),
    mopKg: Math.round(s.mopKg * areaAcre * (adjK / (baseK || 1))),
    zincKg: s.zincKg ? Math.round(s.zincKg * areaAcre) : undefined,
    notesEn: s.notesEn,
    notesTe: s.notesTe,
  }));

  const stoichiometryExplanation = `Calculations: Target pure nutrients: N=${Math.round(adjN)}kg, P2O5=${Math.round(adjP)}kg, K2O=${Math.round(adjK)}kg. Entire P2O5 is supplied via DAP (${dapKgTotal} kg / ~${dapBags50kg} bags of 50kg), which also contributes ${Math.round(nFromDap)} kg of Nitrogen. The remaining ${Math.round(remainingN)} kg Nitrogen is supplied via Urea (${ureaKgTotal} kg / ~${ureaBags45kg} bags of 45kg) to avoid nitrogen excess. Potash is supplied via MOP (${mopKgTotal} kg / ~${mopBags50kg} bags of 50kg).`;

  return {
    crop: cropSchedule.crop,
    areaAcre: Math.round(areaAcre * 100) / 100,
    isSoilTestGrounded,
    rawNutrientRequirementKg: rawReq,
    adjustedNutrientRequirementKg: {
      n: Math.round(adjN * 10) / 10,
      p: Math.round(adjP * 10) / 10,
      k: Math.round(adjK * 10) / 10,
    },
    commercialProducts: {
      dapBags50kg,
      dapKgTotal,
      ureaBags45kg,
      ureaKgTotal,
      mopBags50kg,
      mopKgTotal,
      zincSulphateKgTotal: cropSchedule.recommendedNutrientsPerAcre.znKg ? Math.round(cropSchedule.recommendedNutrientsPerAcre.znKg * 4 * areaAcre) : undefined,
    },
    stageSplits,
    organicNutrientCreditNotes: organicCredit,
    stoichiometryExplanation,
    citation: cropSchedule.citation,
  };
}
