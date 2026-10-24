/**
 * Smart Farm Assistant - Seed Rate Calculator Module
 * Aligned with PJTAU (Professor Jayashankar Telangana State Agricultural University)
 * Vyavasaya Panchangam Package of Practices & ICAR Standards.
 * Pure client-side JavaScript. Zero external dependencies.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SeedCalc = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Conversion factors:
  // 1 acre = 0.4047 ha, 1 guntha = 0.010117 ha
  var HA_PER_ACRE = 0.4047;
  var HA_PER_GUNTHA = 0.010117;

  /**
   * Researched Crop Agronomic Defaults
   * All values marked "indicative" per PJTAU / ICAR sources.
   * Spacings in cm, 1000-seed test weight in grams.
   */
  var CROP_SEED_DEFAULTS = {
    Paddy: {
      nameEn: "Paddy (Rice)",
      nameTe: "వరి (Paddy)",
      indicative: true,
      boldSeeded: false,
      defaultWeightBasis: 1000,
      methods: ["transplant", "line", "broadcast"],
      defaultMethod: "transplant",
      spacings: {
        transplant: { row: 20, plant: 15, seeds: 2 },
        line: { row: 20, plant: 12, seeds: 2 },
        broadcast: { row: 15, plant: 10, seeds: 1 }
      },
      testWeightG: 20, // Fine (RNR 15048) ~15g, Medium (BPT 5204) ~18g, Coarse (MTU 1010) ~24g
      testWeightPlausibleRange1000: { min: 12, max: 30 },
      germinationPct: 90,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 15, max: 25 },
      smallSeeded: false,
      nursery: {
        seedRateKgPerAcreMain: "15–25 kg (Fine varieties: 15–20 kg, Coarse: 20–25 kg, Hybrids: 5 kg)",
        nurseryAreaCents: 5, // 5 cents = ~200 m² = 2 gunthas per acre
        nurseryAreaGuntha: 2,
        nurseryAreaM2: 200,
        differencesEn: "In transplanted paddy, seeds are raised in a 5-cent nursery bed for 20–25 days before transplanting into puddled soil. This provides uniform plant stand and suppresses weeds. Direct Seeded Rice (DSR) sows seed straight into the main field (10–12 kg/acre line sown or 25–30 kg broadcast), saving nursery labor and initial water but requiring proactive weed management.",
        differencesTe: "నాటు వరి పద్ధతిలో 1 ఎకరం ప్రధాన పొలానికి 5 గుంటల (200 చ.మీ.) నారుమడిలో 20-25 రోజులు నారు పెంచి నాటుతారు. ఇది మొక్కల సాంద్రతను సమానంగా ఉంచి, కలుపును అరికడుతుంది. అదే వెదజల్లే (DSR) పద్ధతిలో విత్తనాలను నేరుగా పొలంలోనే వేస్తారు (సాలు పద్ధతిలో 10-12 కిలోలు, వెదజల్లితే 25-30 కిలోలు). దీనిలో నారు పోసే శ్రమ, ప్రారంభ నీరు ఆదా అవుతాయి కానీ కలుపు నివారణ ముఖ్యం."
      }
    },
    Maize: {
      nameEn: "Maize (Corn)",
      nameTe: "మొక్కజొన్న (Maize)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100, // 100-seed weight default for bold
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 60, plant: 20, seeds: 1 }
      },
      testWeightG: 250, // 1000-seed wt = 250g (100-seed wt = 25g)
      testWeightPlausibleRange1000: { min: 180, max: 400 },
      germinationPct: 90,
      purityPct: 98,
      extraPct: 0,
      standardRangeKgPerAcre: { min: 7, max: 10 },
      smallSeeded: false
    },
    Cotton: {
      nameEn: "Cotton",
      nameTe: "పత్తి (Cotton)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100,
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 90, plant: 60, seeds: 1 }
      },
      testWeightG: 80, // 1000-seed wt = 80g (100-seed wt = 8g)
      testWeightPlausibleRange1000: { min: 50, max: 130 },
      germinationPct: 85,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 0.45, max: 2.0 },
      smallSeeded: false
    },
    Sesame: {
      nameEn: "Sesame (Til)",
      nameTe: "నువ్వులు (Sesame)",
      indicative: true,
      boldSeeded: false,
      defaultWeightBasis: 1000,
      methods: ["line", "broadcast"],
      defaultMethod: "line",
      spacings: {
        line: { row: 30, plant: 15, seeds: 1 },
        broadcast: { row: 20, plant: 10, seeds: 1 }
      },
      testWeightG: 3.0,
      testWeightPlausibleRange1000: { min: 2.0, max: 5.0 },
      germinationPct: 85,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 1.5, max: 3.0 },
      smallSeeded: true
    },
    Groundnut: {
      nameEn: "Groundnut (Peanut)",
      nameTe: "వేరుశెనగ (Groundnut)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100, // 100-seed weight default
      supportsSeedForm: true, // Kernels or Pods
      defaultSeedForm: "kernels",
      defaultShellingPct: 70, // Indicative PJTAU ~70%
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 30, plant: 10, seeds: 1 }
      },
      testWeightG: 400, // 1000-kernel wt = 400g (100-seed wt = 40g)
      testWeightPlausibleRange1000: { min: 250, max: 700 },
      germinationPct: 85,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 40, max: 75 }, // Kernels 40-70 kg, pods 60-100 kg
      smallSeeded: false
    },
    Redgram: {
      nameEn: "Redgram (Pigeonpea)",
      nameTe: "కంది (Redgram)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100,
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 120, plant: 20, seeds: 1 }
      },
      testWeightG: 90, // 1000-seed wt = 90g (100-seed wt = 9g)
      testWeightPlausibleRange1000: { min: 60, max: 160 },
      germinationPct: 85,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 4, max: 6 },
      smallSeeded: false
    },
    Chickpea: {
      nameEn: "Chickpea (Bengalgram)",
      nameTe: "శనగ (Chickpea)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100, // 100-seed weight default for bold
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 30, plant: 10, seeds: 1 }
      },
      testWeightG: 200, // 1000-seed wt = 200g (100-seed wt = 20g)
      testWeightPlausibleRange1000: { min: 120, max: 450 },
      germinationPct: 85,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 20, max: 25 },
      smallSeeded: false
    },
    Castor: {
      nameEn: "Castor",
      nameTe: "ఆముదం (Castor)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100, // 100-seed weight default for bold
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 90, plant: 60, seeds: 1 }
      },
      testWeightG: 280, // 1000-seed wt = 280g (100-seed wt = 28g)
      testWeightPlausibleRange1000: { min: 150, max: 400 },
      germinationPct: 80,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 2, max: 3 },
      smallSeeded: false
    },
    Chilli: {
      nameEn: "Chilli",
      nameTe: "మిరప (Chilli)",
      indicative: true,
      boldSeeded: false,
      defaultWeightBasis: 1000,
      methods: ["transplant"],
      defaultMethod: "transplant",
      spacings: {
        transplant: { row: 60, plant: 45, seeds: 1 }
      },
      testWeightG: 5.0,
      testWeightPlausibleRange1000: { min: 3.0, max: 8.0 },
      germinationPct: 80,
      purityPct: 98,
      extraPct: 10,
      standardRangeKgPerAcre: { min: 0.1, max: 0.5 },
      smallSeeded: true
    },
    Soybean: {
      nameEn: "Soybean",
      nameTe: "సోయాచిక్కుడు (Soybean)",
      indicative: true,
      boldSeeded: true,
      defaultWeightBasis: 100,
      methods: ["line"],
      defaultMethod: "line",
      spacings: {
        line: { row: 30, plant: 7.5, seeds: 1 }
      },
      testWeightG: 120, // 1000-seed wt = 120g (100-seed wt = 12g)
      testWeightPlausibleRange1000: { min: 80, max: 200 },
      germinationPct: 80,
      purityPct: 98,
      extraPct: 5,
      standardRangeKgPerAcre: { min: 25, max: 35 },
      smallSeeded: false
    },
    Custom: {
      nameEn: "Custom Crop",
      nameTe: "ఇతర పంట (Custom)",
      indicative: true,
      boldSeeded: false,
      defaultWeightBasis: 1000,
      methods: ["line", "broadcast", "transplant"],
      defaultMethod: "line",
      spacings: {
        line: { row: 60, plant: 20, seeds: 1 },
        broadcast: { row: 20, plant: 10, seeds: 1 },
        transplant: { row: 60, plant: 30, seeds: 1 }
      },
      testWeightG: 100,
      testWeightPlausibleRange1000: { min: 0.1, max: 2000 },
      germinationPct: 90,
      purityPct: 98,
      extraPct: 0,
      standardRangeKgPerAcre: { min: 0.1, max: 200 },
      smallSeeded: false
    }
  };

  /**
   * Convert area into hectares based on specified unit
   */
  function convertToHectares(area, unit) {
    if (!area || area <= 0) return 0;
    if (unit === 'acre') return area * HA_PER_ACRE;
    if (unit === 'guntha') return area * HA_PER_GUNTHA;
    if (unit === 'ha' || unit === 'hectare') return area * 1.0;
    return area * HA_PER_ACRE;
  }

  /**
   * Pure Calculation Function
   */
  function calculateSeedRate(params) {
    var area = parseFloat(params.area) || 0;
    var unit = params.unit || 'acre';
    var rowCm = parseFloat(params.rowSpacingCm) || 0;
    var plantCm = parseFloat(params.plantSpacingCm) || 0;
    var seedsPerHill = parseInt(params.seedsPerHill, 10);
    if (isNaN(seedsPerHill) || seedsPerHill < 1) seedsPerHill = 1;

    // Weight input basis: 100 or 1000
    var weightBasis = parseInt(params.weightBasis, 10) === 100 ? 100 : 1000;
    var rawWeight = parseFloat(params.testWeightG) || 0;
    // Normalized 1000-seed weight in grams:
    var testWeightG = (weightBasis === 100) ? (rawWeight * 10.0) : rawWeight;
    var weight100G = (weightBasis === 100) ? rawWeight : (rawWeight / 10.0);

    var germPct = parseFloat(params.germinationPct) || 0;
    var purityPct = parseFloat(params.purityPct) || 0;
    var extraPct = parseFloat(params.extraPct) || 0;
    if (extraPct < 0) extraPct = 0;

    var packetSizeKg = parseFloat(params.packetSizeKg) || 1.0;
    if (packetSizeKg <= 0) packetSizeKg = 1.0;

    var pricePerKg = parseFloat(params.pricePerKg) || 0;
    if (pricePerKg < 0) pricePerKg = 0;

    // Groundnut seed form (kernels vs pods) & shelling %
    var crop = params.crop || 'Maize';
    var seedForm = params.seedForm || 'kernels'; // 'kernels' or 'pods'
    var shellingPct = parseFloat(params.shellingPct);
    if (isNaN(shellingPct) || shellingPct <= 0) shellingPct = 70.0;
    var shellingFrac = shellingPct / 100.0;

    // Basic validity check
    if (area <= 0 || rowCm <= 0 || plantCm <= 0 || testWeightG <= 0 || germPct <= 0 || purityPct <= 0) {
      return {
        valid: false,
        error: "All agronomic dimensions, seed test weight, germination %, and purity % must be positive numbers."
      };
    }

    var rowM = rowCm / 100.0;
    var plantM = plantCm / 100.0;
    var areaPerHillM2 = rowM * plantM;

    // Hills and Plants per Hectare
    var hillsPerHa = 10000.0 / areaPerHillM2;
    var plantsPerHa = hillsPerHa * seedsPerHill;

    // Plants per Acre
    var plantsPerAcre = plantsPerHa * HA_PER_ACRE;

    // Area conversions
    var areaHa = convertToHectares(area, unit);
    var areaAcre = areaHa / HA_PER_ACRE;
    var plantsEnteredArea = plantsPerHa * areaHa;

    // Fractions
    var germFrac = germPct / 100.0;
    var purityFrac = purityPct / 100.0;
    var extraFrac = extraPct / 100.0;
    var viabilityProduct = germFrac * purityFrac;

    // Seed Rate (Kernels / Seeds) per Hectare (kg/ha)
    // Formula: plantsPerHa * testWeightG / (1,000,000 * germFrac * purityFrac) * (1 + extraFrac)
    var seedRateKgPerHa = (plantsPerHa * testWeightG) / (1000000.0 * viabilityProduct) * (1.0 + extraFrac);

    // Seed Rate per Acre (kg/acre)
    var seedRateKgPerAcre = seedRateKgPerHa * HA_PER_ACRE;

    // Seed Rate for Entered Area (kg)
    var seedRateKgEntered = seedRateKgPerHa * areaHa;

    // Groundnut Pods Requirement (if applicable)
    var podsRateKgPerHa = (crop === 'Groundnut') ? (seedRateKgPerHa / shellingFrac) : null;
    var podsRateKgPerAcre = (crop === 'Groundnut') ? (seedRateKgPerAcre / shellingFrac) : null;
    var podsRateKgEntered = (crop === 'Groundnut') ? (seedRateKgEntered / shellingFrac) : null;

    // Effective primary quantity (if farmer chose 'pods' for groundnut, primary is pods; else kernels)
    var displayRateKgEntered = (crop === 'Groundnut' && seedForm === 'pods') ? podsRateKgEntered : seedRateKgEntered;
    var displayRateKgPerAcre = (crop === 'Groundnut' && seedForm === 'pods') ? podsRateKgPerAcre : seedRateKgPerAcre;
    var displayRateKgPerHa = (crop === 'Groundnut' && seedForm === 'pods') ? podsRateKgPerHa : seedRateKgPerHa;

    // Seed counts
    var seedsPerHa = (plantsPerHa / viabilityProduct) * (1.0 + extraFrac);
    var seedsPerAcre = seedsPerHa * HA_PER_ACRE;
    var seedsEnteredArea = seedsPerHa * areaHa;

    // Packet calculations based on display primary seed form
    var packetsNeeded = Math.ceil(displayRateKgEntered / packetSizeKg);
    var totalPacketsWeightKg = packetsNeeded * packetSizeKg;

    // Estimated Cost
    var estimatedCost = pricePerKg > 0 ? (displayRateKgEntered * pricePerKg) : null;

    // Small-seeded crop representation
    var cropConfig = CROP_SEED_DEFAULTS[crop] || CROP_SEED_DEFAULTS.Custom;
    var isSmallSeeded = Boolean(cropConfig.smallSeeded || seedRateKgEntered < 2.0);

    return {
      valid: true,
      crop: crop,
      sowingMethod: params.sowingMethod || 'line',
      seedForm: seedForm,
      weightBasis: weightBasis,
      inputs: {
        area: area,
        unit: unit,
        areaHa: areaHa,
        areaAcre: areaAcre,
        rowSpacingCm: rowCm,
        plantSpacingCm: plantCm,
        seedsPerHill: seedsPerHill,
        rawWeight: rawWeight,
        weightBasis: weightBasis,
        testWeightG: testWeightG,
        weight100G: weight100G,
        germinationPct: germPct,
        purityPct: purityPct,
        extraPct: extraPct,
        shellingPct: shellingPct,
        packetSizeKg: packetSizeKg,
        pricePerKg: pricePerKg
      },
      intermediates: {
        rowM: rowM,
        plantM: plantM,
        areaPerHillM2: areaPerHillM2,
        hillsPerHa: hillsPerHa,
        plantsPerHa: plantsPerHa,
        plantsPerAcre: plantsPerAcre,
        plantsEnteredArea: plantsEnteredArea,
        areaHa: areaHa,
        areaAcre: areaAcre,
        germFrac: germFrac,
        purityFrac: purityFrac,
        viabilityProduct: viabilityProduct,
        extraFrac: extraFrac,
        shellingFrac: shellingFrac
      },
      results: {
        // Standard kernel / clean seed quantities
        seedRateKgPerHa: seedRateKgPerHa,
        seedRateKgPerAcre: seedRateKgPerAcre,
        seedRateKgEntered: seedRateKgEntered,
        seedRateGramsEntered: Math.round(seedRateKgEntered * 1000.0),
        seedRateGramsPerAcre: Math.round(seedRateKgPerAcre * 1000.0),
        isSmallSeeded: isSmallSeeded,

        // Groundnut Pods quantities (if Groundnut)
        podsRateKgPerHa: podsRateKgPerHa,
        podsRateKgPerAcre: podsRateKgPerAcre,
        podsRateKgEntered: podsRateKgEntered,
        shellingPct: shellingPct,

        // Display Primary values (respecting seedForm choice)
        displayRateKgEntered: displayRateKgEntered,
        displayRateKgPerAcre: displayRateKgPerAcre,
        displayRateKgPerHa: displayRateKgPerHa,

        // Counts
        seedsPerHa: Math.round(seedsPerHa),
        seedsPerAcre: Math.round(seedsPerAcre),
        seedsEnteredArea: Math.round(seedsEnteredArea),
        plantsPerHa: Math.round(plantsPerHa),
        plantsPerAcre: Math.round(plantsPerAcre),
        plantsEnteredArea: Math.round(plantsEnteredArea),

        // Packets & Cost
        packetSizeKg: packetSizeKg,
        packetsNeeded: packetsNeeded,
        totalPacketsWeightKg: totalPacketsWeightKg,
        estimatedCost: estimatedCost ? Math.round(estimatedCost) : null
      }
    };
  }

  /**
   * Validate Inputs and Generate Friendly Agronomic Warnings
   */
  function validateSeedInputs(params, calcResult) {
    var errors = [];
    var warnings = [];

    var area = parseFloat(params.area);
    var rowCm = parseFloat(params.rowSpacingCm);
    var plantCm = parseFloat(params.plantSpacingCm);
    var seedsPerHill = parseInt(params.seedsPerHill, 10);

    var weightBasis = parseInt(params.weightBasis, 10) === 100 ? 100 : 1000;
    var rawWeight = parseFloat(params.testWeightG);
    var testWeightG = (weightBasis === 100) ? (rawWeight * 10.0) : rawWeight;

    var germPct = parseFloat(params.germinationPct);
    var purityPct = parseFloat(params.purityPct);
    var extraPct = parseFloat(params.extraPct);
    var crop = params.crop || 'Maize';
    var cropConfig = CROP_SEED_DEFAULTS[crop] || CROP_SEED_DEFAULTS.Custom;

    // Hard errors
    if (isNaN(area) || area <= 0) {
      errors.push({
        id: "err_area",
        en: "Enter an area greater than zero.",
        te: "దయచేసి సున్నా కంటే ఎక్కువ విస్తీర్ణాన్ని నమోదు చేయండి."
      });
    }

    if (isNaN(rowCm) || rowCm <= 0) {
      errors.push({
        id: "err_row",
        en: "Row spacing must be a positive number.",
        te: "సాళ్ళ మధ్య దూరం సున్నా కంటే ఎక్కువగా ఉండాలి."
      });
    }

    if (isNaN(plantCm) || plantCm <= 0) {
      errors.push({
        id: "err_plant",
        en: "Plant spacing must be a positive number.",
        te: "మొక్కల మధ్య దూరం సున్నా కంటే ఎక్కువగా ఉండాలి."
      });
    }

    if (isNaN(seedsPerHill) || seedsPerHill < 1) {
      errors.push({
        id: "err_seeds_hill",
        en: "Seeds per hill must be at least 1.",
        te: "ప్రతి గుబురుకు కనీసం 1 విత్తనం ఉండాలి."
      });
    }

    if (isNaN(rawWeight) || rawWeight <= 0) {
      errors.push({
        id: "err_test_weight",
        en: "Seed test weight must be a positive number.",
        te: "విత్తనాల బరువు సున్నా కంటే ఎక్కువగా ఉండాలి."
      });
    }

    if (isNaN(germPct) || germPct <= 0 || germPct > 100) {
      errors.push({
        id: "err_germ",
        en: "Germination percentage must be between 1% and 100%.",
        te: "మొలక శాతం 1% నుండి 100% మధ్య ఉండాలి."
      });
    }

    if (isNaN(purityPct) || purityPct <= 0 || purityPct > 100) {
      errors.push({
        id: "err_purity",
        en: "Physical purity percentage must be between 1% and 100%.",
        te: "విత్తన స్వచ్ఛత శాతం 1% నుండి 100% మధ్య ఉండాలి."
      });
    }

    if (!isNaN(extraPct) && extraPct < 0) {
      errors.push({
        id: "err_extra",
        en: "Extra seed percentage cannot be negative.",
        te: "అదనపు విత్తన శాతం రుణాత్మకంగా ఉండకూడదు."
      });
    }

    if (errors.length > 0) {
      return { isValid: false, errors: errors, warnings: warnings };
    }

    // Friendly Agronomic Warnings
    // 1. Germination below 70%
    if (germPct < 70) {
      warnings.push({
        id: "warn_low_germ",
        type: "warn",
        en: "Germination is below 70% (poor seed viability). Certified seeds typically have ≥ 80–90% germination. Consider sourcing certified seed or increasing seed allowance.",
        te: "మొలక శాతం 70% కంటే తక్కువగా ఉంది (నాణ్యత తక్కువ). సాధారణంగా ధృవీకరించిన విత్తనాలలో 80–90% మొలక ఉంటుంది. సర్టిఫైడ్ విత్తనాలను వాడటం లేదా విత్తన మోతాదు పెంచడం మంచిది."
      });
    }

    // 2. Physical purity below 90%
    if (purityPct < 90) {
      warnings.push({
        id: "warn_low_purity",
        type: "warn",
        en: "Physical purity is below 90% (high inert matter, broken grains, or weed seeds). Clean, winnow, or grade seed before sowing.",
        te: "విత్తన స్వచ్ఛత 90% కంటే తక్కువగా ఉంది (తాలు, చెత్త లేదా కలుపు విత్తనాలు ఎక్కువ). విత్తే ముందు విత్తనాలను శుభ్రం చేసి, తాలు వేరు చేయండి."
      });
    }

    // 3. Spacing realism checks
    if (rowCm < 10 || rowCm > 300) {
      warnings.push({
        id: "warn_spacing_row",
        type: "warn",
        en: "Row spacing (" + rowCm + " cm) appears unusual for standard field cultivation. Please double check.",
        te: "సాళ్ళ మధ్య దూరం (" + rowCm + " సెం.మీ.) సాధారణ సాగు పద్ధతులకు భిన్నంగా ఉంది. దయచేసి సరిచూసుకోండి."
      });
    }

    if (plantCm < 3 || plantCm > 150) {
      warnings.push({
        id: "warn_spacing_plant",
        type: "warn",
        en: "Plant spacing (" + plantCm + " cm) appears unusual for field cultivation. Please double check.",
        te: "మొక్కల మధ్య దూరం (" + plantCm + " సెం.మీ.) అసాధారణంగా ఉంది. దయచేసి సరిచూసుకోండి."
      });
    }

    // 4. Test weight plausible range warning
    if (cropConfig.testWeightPlausibleRange1000) {
      var minW = cropConfig.testWeightPlausibleRange1000.min;
      var maxW = cropConfig.testWeightPlausibleRange1000.max;
      if (testWeightG < minW || testWeightG > maxW) {
        var enteredBasisStr = (weightBasis === 100) 
          ? (rawWeight + " g (100-seed wt = " + testWeightG + " g per 1000 seeds)")
          : (rawWeight + " g per 1000 seeds");
        var plausibleBasisStr = (weightBasis === 100)
          ? ((minW / 10) + "–" + (maxW / 10) + " g for 100 seeds")
          : (minW + "–" + maxW + " g for 1000 seeds");

        warnings.push({
          id: "warn_test_weight_range",
          type: "warn",
          en: "Entered seed weight (" + enteredBasisStr + ") is outside the plausible range (" + plausibleBasisStr + ") for " + (cropConfig.nameEn || crop) + ". Please check if you entered 100-seed weight vs 1000-seed weight correctly.",
          te: "నమోదు చేసిన విత్తనాల బరువు (" + enteredBasisStr + ") ఈ పంట ప్రామాణిక పరిధి (" + plausibleBasisStr + ") కి భిన్నంగా ఉంది. దయచేసి 100 విత్తనాల బరువు మరియు 1000 విత్తనాల బరువు మధ్య తేడాను సరిచూసుకోండి."
        });
      }
    }

    // 5. Deviation > 30% from recommended PJTAU standard range
    if (cropConfig.standardRangeKgPerAcre && calcResult && calcResult.valid) {
      var rateAcre = calcResult.results.displayRateKgPerAcre;
      var minAcre = cropConfig.standardRangeKgPerAcre.min;
      var maxAcre = cropConfig.standardRangeKgPerAcre.max;

      if (rateAcre < minAcre * 0.70) {
        var pctLow = Math.round(((minAcre - rateAcre) / minAcre) * 100);
        warnings.push({
          id: "warn_rate_low",
          type: "info",
          en: "Calculated seed rate (" + rateAcre.toFixed(1) + " kg/acre) is " + pctLow + "% below standard PJTAU range (" + minAcre + "–" + maxAcre + " kg/acre). Please verify row spacing, plant spacing, and test weight.",
          te: "లెక్కించిన విత్తన మోతాదు (" + rateAcre.toFixed(1) + " కిలోలు/ఎకరం) PJTAU ప్రామాణిక సిఫారసు (" + minAcre + "–" + maxAcre + " కిలోలు) కంటే " + pctLow + "% తక్కువగా ఉంది. సాళ్ళ దూరం, మొక్కల దూరం మరియు విత్తన బరువును సరిచూసుకోండి."
        });
      } else if (rateAcre > maxAcre * 1.30) {
        var pctHigh = Math.round(((rateAcre - maxAcre) / maxAcre) * 100);
        warnings.push({
          id: "warn_rate_high",
          type: "info",
          en: "Calculated seed rate (" + rateAcre.toFixed(1) + " kg/acre) is " + pctHigh + "% higher than standard PJTAU range (" + minAcre + "–" + maxAcre + " kg/acre). Please verify spacing and seed count per hill.",
          te: "లెక్కించిన విత్తన మోతాదు (" + rateAcre.toFixed(1) + " కిలోలు/ఎకరం) PJTAU ప్రామాణిక సిఫారసు (" + minAcre + "–" + maxAcre + " కిలోలు) కంటే " + pctHigh + "% ఎక్కువగా ఉంది. సాళ్ళ దూరం, మొక్కల దూరం మరియు ప్రతి గుబురుకు విత్తనాల సంఖ్యను సరిచూసుకోండి."
        });
      }
    }

    return {
      isValid: true,
      errors: errors,
      warnings: warnings
    };
  }

  /**
   * Generate Plain Language "Show Working" Steps
   */
  function getSeedCalculationWorking(calc, lang) {
    if (!calc || !calc.valid) return [];
    var isTe = (lang === 'te');
    var inp = calc.inputs;
    var im = calc.intermediates;
    var res = calc.results;
    var crop = calc.crop;

    var steps = [];

    // Step 1: Spacing and Hills per Hectare
    steps.push({
      step: 1,
      titleEn: "Step 1: Spacing and Hills per Hectare",
      titleTe: "దశ 1: సాళ్ళ దూరం & హెక్టారుకు గుబుర్ల సంఖ్య",
      textEn: "Row spacing = " + inp.rowSpacingCm + " cm (" + im.rowM.toFixed(2) + " m). Plant spacing = " + inp.plantSpacingCm + " cm (" + im.plantM.toFixed(2) + " m).\n" +
              "Area occupied per hill = " + im.rowM.toFixed(2) + " m × " + im.plantM.toFixed(2) + " m = " + im.areaPerHillM2.toFixed(4) + " m².\n" +
              "Hills per hectare = 10,000 m² ÷ " + im.areaPerHillM2.toFixed(4) + " m² = " + Math.round(im.hillsPerHa).toLocaleString('en-IN') + " hills/ha.",
      textTe: "సాళ్ళ మధ్య దూరం = " + inp.rowSpacingCm + " సెం.మీ. (" + im.rowM.toFixed(2) + " మీ.). మొక్కల మధ్య దూరం = " + inp.plantSpacingCm + " సెం.మీ. (" + im.plantM.toFixed(2) + " మీ.).\n" +
              "ఒక్కో గుబురుకు వైశాల్యం = " + im.rowM.toFixed(2) + " × " + im.plantM.toFixed(2) + " = " + im.areaPerHillM2.toFixed(4) + " చ.మీ.\n" +
              "హెక్టారుకు గుబుర్ల సంఖ్య = 10,000 చ.మీ. ÷ " + im.areaPerHillM2.toFixed(4) + " = " + Math.round(im.hillsPerHa).toLocaleString('te-IN') + " గుబుర్లు/హెక్టారు."
    });

    // Step 2: Target Plant Population
    steps.push({
      step: 2,
      titleEn: "Step 2: Target Plant Population",
      titleTe: "దశ 2: అవసరమైన మొక్కల సాంద్రత",
      textEn: "Seeds per hill = " + inp.seedsPerHill + ".\n" +
              "Target plants per hectare = " + Math.round(im.hillsPerHa).toLocaleString('en-IN') + " × " + inp.seedsPerHill + " = " + Math.round(im.plantsPerHa).toLocaleString('en-IN') + " plants/ha.\n" +
              "Equivalent target plants per acre = " + Math.round(im.plantsPerHa).toLocaleString('en-IN') + " × 0.4047 = " + Math.round(im.plantsPerAcre).toLocaleString('en-IN') + " plants/acre.",
      textTe: "ప్రతి గుబురుకు విత్తనాల సంఖ్య = " + inp.seedsPerHill + ".\n" +
              "హెక్టారుకు అవసరమైన మొక్కల సంఖ్య = " + Math.round(im.hillsPerHa).toLocaleString('te-IN') + " × " + inp.seedsPerHill + " = " + Math.round(im.plantsPerHa).toLocaleString('te-IN') + " మొక్కలు/హెక్టారు.\n" +
              "ఎకరాకు అవసరమైన మొక్కల సంఖ్య = " + Math.round(im.plantsPerHa).toLocaleString('te-IN') + " × 0.4047 = " + Math.round(im.plantsPerAcre).toLocaleString('te-IN') + " మొక్కలు/ఎకరం."
    });

    // Step 3: Seed Weight & Viability Adjustment
    var weightNoticeEn = (inp.weightBasis === 100)
      ? ("Selected weight basis = 100-seed weight (" + inp.rawWeight + " g).\nEquivalent 1000-seed weight = " + inp.rawWeight + " g × 10 = " + inp.testWeightG + " g.")
      : ("Selected weight basis = 1000-seed weight (" + inp.rawWeight + " g). Weight of 1 seed = " + (inp.testWeightG / 1000).toFixed(4) + " g.");

    var weightNoticeTe = (inp.weightBasis === 100)
      ? ("ఎంచుకున్న ప్రమాణం = 100 విత్తనాల బరువు (" + inp.rawWeight + " గ్రా.).\n1000 విత్తనాల బరువుగా మార్పిడి = " + inp.rawWeight + " × 10 = " + inp.testWeightG + " గ్రా.")
      : ("ఎంచుకున్న ప్రమాణం = 1000 విత్తనాల బరువు (" + inp.rawWeight + " గ్రా.). ఒక్క విత్తనం బరువు = " + (inp.testWeightG / 1000).toFixed(4) + " గ్రా.");

    steps.push({
      step: 3,
      titleEn: "Step 3: Test Weight & Viability Factors",
      titleTe: "దశ 3: విత్తనాల బరువు & మొలక సామర్థ్య లెక్క",
      textEn: weightNoticeEn + "\n" +
              "Germination = " + inp.germinationPct + "% (fraction: " + im.germFrac.toFixed(2) + "). Purity = " + inp.purityPct + "% (fraction: " + im.purityFrac.toFixed(2) + ").\n" +
              "Live pure seed factor = " + im.germFrac.toFixed(2) + " × " + im.purityFrac.toFixed(2) + " = " + im.viabilityProduct.toFixed(4) + ".\n" +
              "Extra seed for gaps & losses = " + inp.extraPct + "% (factor: " + (1 + im.extraFrac).toFixed(2) + ").",
      textTe: weightNoticeTe + "\n" +
              "మొలక శాతం = " + inp.germinationPct + "% (భిన్నం: " + im.germFrac.toFixed(2) + "). స్వచ్ఛత = " + inp.purityPct + "% (భిన్నం: " + im.purityFrac.toFixed(2) + ").\n" +
              "సమర్థవంతమైన విత్తన భాగం = " + im.germFrac.toFixed(2) + " × " + im.purityFrac.toFixed(2) + " = " + im.viabilityProduct.toFixed(4) + ".\n" +
              "నష్టాల కోసం అదనపు విత్తనం = " + inp.extraPct + "% (గుణకం: " + (1 + im.extraFrac).toFixed(2) + ")."
    });

    // Step 4: Kernel / Clean Seed Rate
    steps.push({
      step: 4,
      titleEn: "Step 4: Seed Rate Formula (Clean Seed / Kernels)",
      titleTe: "దశ 4: విత్తన మోతాదు సమీకరణం (విత్తనాలు / పప్పు)",
      textEn: "Seed rate (kg/ha) = [Plants/ha (" + Math.round(im.plantsPerHa) + ") × 1000-seed weight (" + inp.testWeightG + " g)] ÷ [1,000,000 × " + im.viabilityProduct.toFixed(4) + "] × " + (1 + im.extraFrac).toFixed(2) + "\n" +
              "= " + res.seedRateKgPerHa.toFixed(2) + " kg/ha.\n" +
              "Per acre rate = " + res.seedRateKgPerHa.toFixed(2) + " × 0.4047 = " + res.seedRateKgPerAcre.toFixed(2) + " kg/acre.",
      textTe: "విత్తన మోతాదు (కిలోలు/హెక్టారు) = [మొక్కలు/హెక్టారు (" + Math.round(im.plantsPerHa) + ") × 1000 విత్తనాల బరువు (" + inp.testWeightG + " గ్రా.)] ÷ [1,000,000 × " + im.viabilityProduct.toFixed(4) + "] × " + (1 + im.extraFrac).toFixed(2) + "\n" +
              "= " + res.seedRateKgPerHa.toFixed(2) + " కిలోలు/హెక్టారు.\n" +
              "ఎకరాకు మోతాదు = " + res.seedRateKgPerHa.toFixed(2) + " × 0.4047 = " + res.seedRateKgPerAcre.toFixed(2) + " కిలోలు/ఎకరం."
    });

    // Step 5: Groundnut Pods / Shelling (if Groundnut)
    if (crop === 'Groundnut') {
      steps.push({
        step: 5,
        titleEn: "Step 5: Groundnut Shelling Percentage & Pods Needed",
        titleTe: "దశ 5: వేరుశెనగ దిగుబడి శాతం & అవసరమైన కాయలు",
        textEn: "Clean Kernel requirement = " + res.seedRateKgPerHa.toFixed(2) + " kg/ha (" + res.seedRateKgPerAcre.toFixed(2) + " kg/acre).\n" +
                "Shelling percentage = " + inp.shellingPct + "% (fraction: " + (inp.shellingPct / 100).toFixed(2) + ").\n" +
                "Unshelled Pods needed = Kernel quantity ÷ Shelling fraction = " + res.seedRateKgPerHa.toFixed(2) + " ÷ " + (inp.shellingPct / 100).toFixed(2) + "\n" +
                "= " + res.podsRateKgPerHa.toFixed(2) + " kg/ha of pods (" + res.podsRateKgPerAcre.toFixed(2) + " kg/acre of pods).\n" +
                "For entered area (" + inp.area + " " + inp.unit + "): Kernels = " + res.seedRateKgEntered.toFixed(2) + " kg | Pods = " + res.podsRateKgEntered.toFixed(2) + " kg.",
        textTe: "శుభ్రమైన పప్పు (గింజల) మోతాదు = " + res.seedRateKgPerHa.toFixed(2) + " కిలోలు/హెక్టారు (" + res.seedRateKgPerAcre.toFixed(2) + " కిలోలు/ఎకరం).\n" +
                "కాయల నుండి పప్పు దిగుబడి (Shelling %) = " + inp.shellingPct + "% (భిన్నం: " + (inp.shellingPct / 100).toFixed(2) + ").\n" +
                "కావలసిన కాయల పరిమాణం = పప్పు పరిమాణం ÷ షెల్లింగ్ భిన్నం = " + res.seedRateKgPerHa.toFixed(2) + " ÷ " + (inp.shellingPct / 100).toFixed(2) + "\n" +
                "= " + res.podsRateKgPerHa.toFixed(2) + " కిలోలు/హెక్టారు కాయలు (" + res.podsRateKgPerAcre.toFixed(2) + " కిలోలు/ఎకరం కాయలు).\n" +
                "నమోదు చేసిన విస్తీర్ణానికి (" + inp.area + " " + (inp.unit === 'acre' ? 'ఎకరాలు' : 'గుంటలు') + "): పప్పు = " + res.seedRateKgEntered.toFixed(2) + " కిలోలు | కాయలు = " + res.podsRateKgEntered.toFixed(2) + " కిలోలు."
      });
    }

    // Step 6 / Final: Area Requirement and Packets
    var costTextEn = res.estimatedCost ? ("\nEstimated seed cost @ ₹" + inp.pricePerKg + "/kg = ₹" + res.estimatedCost.toLocaleString('en-IN') + ".") : "";
    var costTextTe = res.estimatedCost ? ("\nరూ. " + inp.pricePerKg + "/కిలో చొప్పున అంచనా వ్యయం = ₹" + res.estimatedCost.toLocaleString('te-IN') + ".") : "";

    var finalStepNum = (crop === 'Groundnut') ? 6 : 5;
    steps.push({
      step: finalStepNum,
      titleEn: "Step " + finalStepNum + ": Field Area & Packet Requirement",
      titleTe: "దశ " + finalStepNum + ": పొలం విస్తీర్ణం & ప్యాకెట్ల సంఖ్య",
      textEn: "Entered field area = " + inp.area + " " + inp.unit + " (" + im.areaHa.toFixed(4) + " ha = " + im.areaAcre.toFixed(2) + " acres).\n" +
              "Total primary quantity needed = " + res.displayRateKgEntered.toFixed(2) + " kg" + (res.isSmallSeeded ? (" (" + res.seedRateGramsEntered.toLocaleString('en-IN') + " grams)") : "") + ".\n" +
              "Selected packet size = " + inp.packetSizeKg + " kg. Packets needed = ceil(" + res.displayRateKgEntered.toFixed(2) + " ÷ " + inp.packetSizeKg + ") = " + res.packetsNeeded + " packets." + costTextEn,
      textTe: "నమోదు చేసిన పొలం విస్తీర్ణం = " + inp.area + " " + (inp.unit === 'acre' ? 'ఎకరాలు' : inp.unit === 'guntha' ? 'గుంటలు' : 'హెక్టార్లు') + " (" + im.areaHa.toFixed(4) + " హెక్టార్లు = " + im.areaAcre.toFixed(2) + " ఎకరాలు).\n" +
              "మొత్తం కావలసిన పరిమాణం = " + res.displayRateKgEntered.toFixed(2) + " కిలోలు" + (res.isSmallSeeded ? (" (" + res.seedRateGramsEntered.toLocaleString('te-IN') + " గ్రాములు)") : "") + ".\n" +
              "ఎంచుకున్న ప్యాకెట్ సైజు = " + inp.packetSizeKg + " కిలో. కావలసిన ప్యాకెట్లు = " + res.packetsNeeded + " ప్యాకెట్లు." + costTextTe
    });

    return steps;
  }

  return {
    HA_PER_ACRE: HA_PER_ACRE,
    HA_PER_GUNTHA: HA_PER_GUNTHA,
    CROP_SEED_DEFAULTS: CROP_SEED_DEFAULTS,
    convertToHectares: convertToHectares,
    calculateSeedRate: calculateSeedRate,
    validateSeedInputs: validateSeedInputs,
    getSeedCalculationWorking: getSeedCalculationWorking
  };
}));
