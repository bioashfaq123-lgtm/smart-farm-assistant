/**
 * PJTAU Aligned Seed Rate Calculator Logic
 * Pure client-side calculations with bilingual step generation.
 */

export interface SeedCalcParams {
  crop: string;
  sowingMethod: string;
  area: number;
  unit: "acre" | "guntha" | "ha";
  rowSpacingCm: number;
  plantSpacingCm: number;
  seedsPerHill: number;
  weightBasis: 100 | 1000;
  testWeightG: number;
  germinationPct: number;
  purityPct: number;
  extraPct: number;
  seedForm?: "kernels" | "pods";
  shellingPct?: number;
  packetSizeKg?: number;
  pricePerKg?: number;
}

export interface SeedCalcResult {
  valid: boolean;
  error?: string;
  seedRateKgPerHa: number;
  seedRateKgPerAcre: number;
  seedRateKgEntered: number;
  seedRateGramsEntered: number;
  displayRateKgEntered: number;
  podsRateKgEntered?: number;
  podsRateKgPerAcre?: number;
  podsRateKgPerHa?: number;
  plantsPerAcre: number;
  plantsPerHa: number;
  packetsNeeded: number;
  estimatedCost?: number;
  isSmallSeeded: boolean;
  steps: {
    step: number;
    titleEn: string;
    titleTe: string;
    textEn: string;
    textTe: string;
  }[];
}

export const CROP_CONFIGS: Record<string, any> = {
  Paddy: {
    nameEn: "Paddy (Rice)",
    nameTe: "వరి (Paddy)",
    boldSeeded: false,
    defaultWeightBasis: 1000,
    methods: ["transplant", "line", "broadcast"],
    defaultMethod: "transplant",
    spacings: {
      transplant: { row: 20, plant: 15, seeds: 2 },
      line: { row: 20, plant: 12, seeds: 2 },
      broadcast: { row: 15, plant: 10, seeds: 1 },
    },
    testWeightG: 20,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 5,
  },
  Maize: {
    nameEn: "Maize (Corn)",
    nameTe: "మొక్కజొన్న (Maize)",
    boldSeeded: true,
    defaultWeightBasis: 100,
    methods: ["line"],
    defaultMethod: "line",
    spacings: { line: { row: 60, plant: 20, seeds: 1 } },
    testWeightG: 250, // 25g for 100 seeds
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0,
  },
  Cotton: {
    nameEn: "Cotton",
    nameTe: "పత్తి (Cotton)",
    boldSeeded: true,
    defaultWeightBasis: 100,
    methods: ["line"],
    defaultMethod: "line",
    spacings: { line: { row: 90, plant: 60, seeds: 1 } },
    testWeightG: 80, // 8g for 100 seeds
    germinationPct: 85,
    purityPct: 98,
    extraPct: 5,
  },
  Groundnut: {
    nameEn: "Groundnut (Peanut)",
    nameTe: "వేరుశెనగ (Groundnut)",
    boldSeeded: true,
    defaultWeightBasis: 100,
    supportsSeedForm: true,
    defaultSeedForm: "kernels",
    defaultShellingPct: 70,
    methods: ["line"],
    defaultMethod: "line",
    spacings: { line: { row: 30, plant: 10, seeds: 1 } },
    testWeightG: 400, // 40g for 100 seeds
    germinationPct: 85,
    purityPct: 98,
    extraPct: 5,
  },
  Redgram: {
    nameEn: "Redgram (Pigeonpea)",
    nameTe: "కంది (Redgram)",
    boldSeeded: true,
    defaultWeightBasis: 100,
    methods: ["line"],
    defaultMethod: "line",
    spacings: { line: { row: 120, plant: 20, seeds: 1 } },
    testWeightG: 90, // 9g for 100 seeds
    germinationPct: 85,
    purityPct: 98,
    extraPct: 5,
  },
  Chilli: {
    nameEn: "Chilli",
    nameTe: "మిరప (Chilli)",
    boldSeeded: false,
    defaultWeightBasis: 1000,
    methods: ["transplant"],
    defaultMethod: "transplant",
    spacings: { transplant: { row: 60, plant: 45, seeds: 1 } },
    testWeightG: 5.0,
    germinationPct: 80,
    purityPct: 98,
    extraPct: 10,
  },
  Soybean: {
    nameEn: "Soybean",
    nameTe: "సోయాచిక్కుడు (Soybean)",
    boldSeeded: true,
    defaultWeightBasis: 100,
    methods: ["line"],
    defaultMethod: "line",
    spacings: { line: { row: 30, plant: 7.5, seeds: 1 } },
    testWeightG: 120, // 12g for 100 seeds
    germinationPct: 80,
    purityPct: 98,
    extraPct: 5,
  },
};

const HA_PER_ACRE = 0.4047;
const HA_PER_GUNTHA = 0.010117;

export function calculateSeedRate(p: SeedCalcParams): SeedCalcResult {
  const area = p.area || 1;
  const areaHa = p.unit === "ha" ? area : p.unit === "guntha" ? area * HA_PER_GUNTHA : area * HA_PER_ACRE;
  const areaAcre = areaHa / HA_PER_ACRE;

  const rowM = p.rowSpacingCm / 100;
  const plantM = p.plantSpacingCm / 100;
  const areaPerHill = rowM * plantM;

  if (areaPerHill <= 0) {
    return {
      valid: false,
      error: "Spacing must be greater than zero",
      seedRateKgPerHa: 0,
      seedRateKgPerAcre: 0,
      seedRateKgEntered: 0,
      seedRateGramsEntered: 0,
      displayRateKgEntered: 0,
      plantsPerAcre: 0,
      plantsPerHa: 0,
      packetsNeeded: 0,
      isSmallSeeded: false,
      steps: [],
    };
  }

  const hillsPerHa = 10000 / areaPerHill;
  const plantsPerHa = hillsPerHa * (p.seedsPerHill || 1);
  const plantsPerAcre = Math.round(plantsPerHa * HA_PER_ACRE);

  const testWeight1000G = p.weightBasis === 100 ? p.testWeightG * 10 : p.testWeightG;
  const germFrac = (p.germinationPct || 90) / 100;
  const purityFrac = (p.purityPct || 98) / 100;
  const extraFrac = (p.extraPct || 0) / 100;
  const viability = germFrac * purityFrac;

  const seedRateKgPerHa = (plantsPerHa * testWeight1000G) / (1000000 * viability) * (1 + extraFrac);
  const seedRateKgPerAcre = seedRateKgPerHa * HA_PER_ACRE;
  const seedRateKgEntered = seedRateKgPerHa * areaHa;

  const shellingFrac = (p.shellingPct || 70) / 100;
  const podsRateKgPerHa = p.crop === "Groundnut" ? seedRateKgPerHa / shellingFrac : undefined;
  const podsRateKgPerAcre = p.crop === "Groundnut" ? seedRateKgPerAcre / shellingFrac : undefined;
  const podsRateKgEntered = p.crop === "Groundnut" ? seedRateKgEntered / shellingFrac : undefined;

  const isPods = p.crop === "Groundnut" && p.seedForm === "pods";
  const displayRateKgEntered = isPods && podsRateKgEntered ? podsRateKgEntered : seedRateKgEntered;

  const packetSize = p.packetSizeKg || 1;
  const packetsNeeded = Math.ceil(displayRateKgEntered / packetSize);
  const estimatedCost = p.pricePerKg ? Math.round(displayRateKgEntered * p.pricePerKg) : undefined;

  const isSmallSeeded = Boolean(testWeight1000G <= 5 || seedRateKgEntered < 2);

  const steps = [
    {
      step: 1,
      titleEn: "Step 1: Spacing and Hills Calculation",
      titleTe: "దశ 1: సాళ్ళ దూరం & హెక్టారుకు గుబుర్ల సంఖ్య",
      textEn: `Row: ${p.rowSpacingCm} cm (${rowM.toFixed(2)} m), Plant: ${p.plantSpacingCm} cm (${plantM.toFixed(2)} m).\nArea per hill = ${areaPerHill.toFixed(4)} m².\nHills per hectare = 10,000 ÷ ${areaPerHill.toFixed(4)} = ${Math.round(hillsPerHa).toLocaleString()} hills/ha.`,
      textTe: `సాళ్ళు: ${p.rowSpacingCm} సెం.మీ., మొక్కలు: ${p.plantSpacingCm} సెం.మీ.\nగుబురు వైశాల్యం = ${areaPerHill.toFixed(4)} చ.మీ.\nహెక్టారుకు గుబుర్లు = 10,000 ÷ ${areaPerHill.toFixed(4)} = ${Math.round(hillsPerHa).toLocaleString()} గుబుర్లు.`,
    },
    {
      step: 2,
      titleEn: "Step 2: Plant Population and Viability Factors",
      titleTe: "దశ 2: మొక్కల సంఖ్య & మొలక సామర్థ్య లెక్క",
      textEn: `Target plants/ha = ${Math.round(plantsPerHa).toLocaleString()} (${plantsPerAcre.toLocaleString()} plants/acre).\nEffective viability = ${p.germinationPct}% germ × ${p.purityPct}% purity = ${(viability * 100).toFixed(1)}%.\nWeight basis: ${p.weightBasis}-seed wt (${p.testWeightG} g) = ${testWeight1000G} g per 1000 seeds.`,
      textTe: `లక్ష్య మొక్కలు/హెక్టారు = ${Math.round(plantsPerHa).toLocaleString()} (${plantsPerAcre.toLocaleString()} మొక్కలు/ఎకరం).\nమొలక సామర్థ్యం = ${p.germinationPct}% మొలక × ${p.purityPct}% స్వచ్ఛత = ${(viability * 100).toFixed(1)}%.\n1000 విత్తనాల బరువు = ${testWeight1000G} గ్రాములు.`,
    },
    {
      step: 3,
      titleEn: "Step 3: Clean Seed Requirement",
      titleTe: "దశ 3: శుభ్రమైన విత్తన మోతాదు",
      textEn: `Formula: [Plants/ha × 1000-seed wt (g)] ÷ [1,000,000 × Viability] × (1 + Extra)\n= ${seedRateKgPerHa.toFixed(2)} kg/ha (${seedRateKgPerAcre.toFixed(2)} kg/acre).`,
      textTe: `సూత్రం: [మొక్కలు/హెక్టారు × 1000 విత్తనాల బరువు] ÷ [1,000,000 × సామర్థ్యం] × (1 + అదనపు)\n= ${seedRateKgPerHa.toFixed(2)} కిలోలు/హెక్టారు (${seedRateKgPerAcre.toFixed(2)} కిలోలు/ఎకరం).`,
    },
  ];

  if (p.crop === "Groundnut") {
    steps.push({
      step: 4,
      titleEn: "Step 4: Groundnut Shelling & Pods Needed",
      titleTe: "దశ 4: వేరుశెనగ దిగుబడి & కాయల మోతాదు",
      textEn: `Kernels: ${seedRateKgPerAcre.toFixed(1)} kg/acre.\nShelling fraction = ${p.shellingPct || 70}%.\nUnshelled pods needed = ${seedRateKgPerAcre.toFixed(1)} ÷ ${(shellingFrac).toFixed(2)} = ${podsRateKgPerAcre?.toFixed(1)} kg/acre (${podsRateKgPerHa?.toFixed(1)} kg/ha).`,
      textTe: `పప్పు: ${seedRateKgPerAcre.toFixed(1)} కిలోలు/ఎకరం.\nదిగుబడి శాతం (షెల్లింగ్) = ${p.shellingPct || 70}%.\nఅవసరమైన కాయలు = ${seedRateKgPerAcre.toFixed(1)} ÷ ${(shellingFrac).toFixed(2)} = ${podsRateKgPerAcre?.toFixed(1)} కిలోలు/ఎకరం (${podsRateKgPerHa?.toFixed(1)} కిలోలు/హెక్టారు).`,
    });
  }

  return {
    valid: true,
    seedRateKgPerHa,
    seedRateKgPerAcre,
    seedRateKgEntered,
    seedRateGramsEntered: Math.round(seedRateKgEntered * 1000),
    displayRateKgEntered,
    podsRateKgEntered,
    podsRateKgPerAcre,
    podsRateKgPerHa,
    plantsPerAcre,
    plantsPerHa: Math.round(plantsPerHa),
    packetsNeeded,
    estimatedCost,
    isSmallSeeded,
    steps,
  };
}
