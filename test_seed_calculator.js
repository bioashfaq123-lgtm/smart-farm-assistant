/**
 * Test script for Seed Rate Calculator Pure Functions
 * Verifies maize worked case, groundnut bold-seeded kernels/pods case,
 * unit conversions, extra seed %, seeds per hill > 1, weight plausible range checks,
 * and edge/validation cases.
 */

const assert = require('assert');
const SeedCalc = require('./seed_calculator.js');

console.log('=== RUNNING SEED RATE CALCULATOR TESTS ===\n');

let testsPassed = 0;
let testsTotal = 0;

function runTest(name, fn) {
  testsTotal++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// 1. Worked Case 1: Maize (User Requirement)
// Maize, row 60 cm, plant 20 cm, 1 seed per hill, 1000-seed weight 250 g,
// germination 90%, purity 98%, no extra seed (0%)
// Must give about 23.6 kg/ha and about 9.6 kg/acre.
runTest('Maize Worked Benchmark Case (23.6 kg/ha & 9.6 kg/acre)', () => {
  const result = SeedCalc.calculateSeedRate({
    crop: 'Maize',
    sowingMethod: 'line',
    area: 1,
    unit: 'acre',
    rowSpacingCm: 60,
    plantSpacingCm: 20,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 250,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0,
    packetSizeKg: 1
  });

  assert.strictEqual(result.valid, true);

  const kgPerHa = result.results.seedRateKgPerHa;
  const kgPerAcre = result.results.seedRateKgPerAcre;

  assert(Math.abs(kgPerHa - 23.62) < 0.1, `Expected ~23.6 kg/ha, got ${kgPerHa.toFixed(2)}`);
  assert(Math.abs(kgPerAcre - 9.56) < 0.1, `Expected ~9.6 kg/acre, got ${kgPerAcre.toFixed(2)}`);

  console.log(`   -> Maize Calculated: ${kgPerHa.toFixed(2)} kg/ha, ${kgPerAcre.toFixed(2)} kg/acre`);
});

// 2. Worked Case 2: Groundnut Kernels & Pods (User Requirement)
// Groundnut kernels, row 30 cm, plant 10 cm, 1 seed per hill, 100-seed weight 40 g,
// germination 85%, purity 98%, no extra seed (0%).
// Must give about 160 kg/ha (about 65 kg/acre), and about 229 kg/ha of pods at 70% shelling.
runTest('Groundnut Kernels & Pods Worked Case (160 kg/ha kernels, 65 kg/acre, 229 kg/ha pods)', () => {
  const result = SeedCalc.calculateSeedRate({
    crop: 'Groundnut',
    sowingMethod: 'line',
    seedForm: 'kernels',
    area: 1,
    unit: 'acre',
    rowSpacingCm: 30,
    plantSpacingCm: 10,
    seedsPerHill: 1,
    weightBasis: 100, // 100-seed weight basis
    testWeightG: 40,  // 40 g per 100 seeds (= 400 g per 1000 seeds)
    germinationPct: 85,
    purityPct: 98,
    extraPct: 0,
    shellingPct: 70
  });

  assert.strictEqual(result.valid, true);

  const kernelKgPerHa = result.results.seedRateKgPerHa;
  const kernelKgPerAcre = result.results.seedRateKgPerAcre;
  const podsKgPerHa = result.results.podsRateKgPerHa;
  const podsKgPerAcre = result.results.podsRateKgPerAcre;

  // Expected:
  // hills/ha = 10,000 / (0.3 * 0.1) = 333,333.333
  // plants/ha = 333,333.333
  // 1000-seed wt = 40 * 10 = 400 g
  // kg/ha kernels = 333,333.333 * 400 / (1,000,000 * 0.85 * 0.98) = 133,333,333.33 / 833,000 = 160.064 kg/ha
  // kg/acre kernels = 160.064 * 0.4047 = 64.778 kg/acre (~65 kg/acre)
  // kg/ha pods = 160.064 / 0.70 = 228.66 kg/ha (~229 kg/ha)
  // kg/acre pods = 64.778 / 0.70 = 92.54 kg/acre
  assert(Math.abs(kernelKgPerHa - 160.06) < 0.2, `Expected ~160 kg/ha kernels, got ${kernelKgPerHa.toFixed(2)}`);
  assert(Math.abs(kernelKgPerAcre - 64.78) < 0.3, `Expected ~65 kg/acre kernels, got ${kernelKgPerAcre.toFixed(2)}`);
  assert(Math.abs(podsKgPerHa - 228.66) < 0.5, `Expected ~229 kg/ha pods, got ${podsKgPerHa.toFixed(2)}`);

  console.log(`   -> Groundnut Calculated: ${kernelKgPerHa.toFixed(1)} kg/ha kernels (${kernelKgPerAcre.toFixed(1)} kg/acre)`);
  console.log(`   -> Groundnut Pods @ 70%: ${podsKgPerHa.toFixed(1)} kg/ha pods (${podsKgPerAcre.toFixed(1)} kg/acre)`);
});

// 3. Unit Conversions (Acre, Guntha, Hectare)
runTest('Unit Conversions: 1 Hectare vs 2.471 Acres vs 98.84 Gunthas', () => {
  const baseParams = {
    crop: 'Maize',
    sowingMethod: 'line',
    rowSpacingCm: 60,
    plantSpacingCm: 20,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 250,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0
  };

  const resHa = SeedCalc.calculateSeedRate({ ...baseParams, area: 1, unit: 'ha' });
  const resAcre = SeedCalc.calculateSeedRate({ ...baseParams, area: 1, unit: 'acre' });
  const resGuntha = SeedCalc.calculateSeedRate({ ...baseParams, area: 40, unit: 'guntha' });

  assert.strictEqual(resHa.inputs.areaHa, 1.0);
  assert(Math.abs(resAcre.inputs.areaHa - 0.4047) < 0.0001);
  assert(Math.abs(resGuntha.inputs.areaHa - (40 * 0.010117)) < 0.0001);

  assert.strictEqual(resHa.results.seedRateKgEntered, resHa.results.seedRateKgPerHa);
  assert.strictEqual(resAcre.results.seedRateKgEntered, resAcre.results.seedRateKgPerAcre);
});

// 4. Extra seed % factor
runTest('Extra Seed % factor', () => {
  const res0 = SeedCalc.calculateSeedRate({
    crop: 'Maize',
    sowingMethod: 'line',
    area: 1,
    unit: 'ha',
    rowSpacingCm: 60,
    plantSpacingCm: 20,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 250,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0
  });

  const res10 = SeedCalc.calculateSeedRate({
    crop: 'Maize',
    sowingMethod: 'line',
    area: 1,
    unit: 'ha',
    rowSpacingCm: 60,
    plantSpacingCm: 20,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 250,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 10
  });

  const ratio = res10.results.seedRateKgPerHa / res0.results.seedRateKgPerHa;
  assert(Math.abs(ratio - 1.10) < 0.001, `Expected 10% increase (ratio 1.10), got ${ratio.toFixed(4)}`);
});

// 5. Seeds per hill > 1
runTest('Seeds per hill > 1 scales plant population and seed quantity', () => {
  const res1 = SeedCalc.calculateSeedRate({
    crop: 'Paddy',
    sowingMethod: 'line',
    area: 1,
    unit: 'ha',
    rowSpacingCm: 20,
    plantSpacingCm: 15,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 20,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0
  });

  const res2 = SeedCalc.calculateSeedRate({
    crop: 'Paddy',
    sowingMethod: 'line',
    area: 1,
    unit: 'ha',
    rowSpacingCm: 20,
    plantSpacingCm: 15,
    seedsPerHill: 2,
    weightBasis: 1000,
    testWeightG: 20,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0
  });

  assert(Math.abs(res2.results.plantsPerHa - res1.results.plantsPerHa * 2) <= 1, 'Plants per ha should double');
  const ratio = res2.results.seedRateKgPerHa / res1.results.seedRateKgPerHa;
  assert(Math.abs(ratio - 2.0) < 0.001, `Expected 2x seeds, got ${ratio.toFixed(2)}`);
});

// 6. Validation and Bad Inputs
runTest('Validation: rejects non-positive area, spacing, test weight, and percentages', () => {
  const badArea = SeedCalc.validateSeedInputs({ area: 0, rowSpacingCm: 60, plantSpacingCm: 20, testWeightG: 250, germinationPct: 90, purityPct: 98 });
  assert.strictEqual(badArea.isValid, false);
  assert(badArea.errors.some(e => e.id === 'err_area'));

  const badSpacing = SeedCalc.validateSeedInputs({ area: 1, rowSpacingCm: -10, plantSpacingCm: 20, testWeightG: 250, germinationPct: 90, purityPct: 98 });
  assert.strictEqual(badSpacing.isValid, false);
  assert(badSpacing.errors.some(e => e.id === 'err_row'));

  const badGerm = SeedCalc.validateSeedInputs({ area: 1, rowSpacingCm: 60, plantSpacingCm: 20, testWeightG: 250, germinationPct: 150, purityPct: 98 });
  assert.strictEqual(badGerm.isValid, false);
  assert(badGerm.errors.some(e => e.id === 'err_germ'));
});

// 7. Agronomic Warnings: Low Germination (< 70%) & Low Purity (< 90%)
runTest('Agronomic Warnings: triggers warning on germination < 70% and purity < 90%', () => {
  const lowQual = SeedCalc.validateSeedInputs({
    crop: 'Maize',
    area: 1,
    rowSpacingCm: 60,
    plantSpacingCm: 20,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 250,
    germinationPct: 65,
    purityPct: 85,
    extraPct: 5
  });

  assert.strictEqual(lowQual.isValid, true);
  assert(lowQual.warnings.some(w => w.id === 'warn_low_germ'));
  assert(lowQual.warnings.some(w => w.id === 'warn_low_purity'));
});

// 8. Agronomic Warnings: Test Weight outside Plausible Range
runTest('Agronomic Warnings: triggers warning when test weight is outside plausible range', () => {
  // Maize plausible range is 180 - 400 g per 1000 seeds.
  // If user inputs 50 g (might have confused 1000-seed with 100-seed):
  const lowWeight = SeedCalc.validateSeedInputs({
    crop: 'Maize',
    area: 1,
    rowSpacingCm: 60,
    plantSpacingCm: 20,
    seedsPerHill: 1,
    weightBasis: 1000,
    testWeightG: 50,
    germinationPct: 90,
    purityPct: 98,
    extraPct: 0
  });

  assert.strictEqual(lowWeight.isValid, true);
  assert(lowWeight.warnings.some(w => w.id === 'warn_test_weight_range'), 'Should warn for test weight out of plausible range');
});

// 9. Show Working steps generation in English and Telugu (including Groundnut Pods)
runTest('Show Working steps generation in English and Telugu with Pods step', () => {
  const calc = SeedCalc.calculateSeedRate({
    crop: 'Groundnut',
    sowingMethod: 'line',
    seedForm: 'pods',
    area: 2,
    unit: 'acre',
    rowSpacingCm: 30,
    plantSpacingCm: 10,
    seedsPerHill: 1,
    weightBasis: 100,
    testWeightG: 40,
    germinationPct: 85,
    purityPct: 98,
    extraPct: 5,
    shellingPct: 70,
    packetSizeKg: 25,
    pricePerKg: 80
  });

  const stepsEn = SeedCalc.getSeedCalculationWorking(calc, 'en');
  const stepsTe = SeedCalc.getSeedCalculationWorking(calc, 'te');

  assert.strictEqual(stepsEn.length, 6, 'Groundnut should have 6 steps including pods');
  assert.strictEqual(stepsTe.length, 6);
  assert(stepsEn[4].titleEn.includes('Shelling Percentage & Pods Needed'));
  assert(stepsTe[4].titleTe.includes('వేరుశెనగ దిగుబడి శాతం & అవసరమైన కాయలు'));
});

// 10. Bold-seeded crops configuration check
runTest('Bold-seeded crops (Groundnut, Maize, Soybean, Redgram, Chickpea, Castor, Cotton) default to 100-seed weight', () => {
  const boldList = ['Groundnut', 'Maize', 'Soybean', 'Redgram', 'Chickpea', 'Castor', 'Cotton'];
  boldList.forEach(cropName => {
    const config = SeedCalc.CROP_SEED_DEFAULTS[cropName];
    assert(config, `Crop ${cropName} should exist in CROP_SEED_DEFAULTS`);
    assert.strictEqual(config.boldSeeded, true, `${cropName} must be marked boldSeeded`);
    assert.strictEqual(config.defaultWeightBasis, 100, `${cropName} must have defaultWeightBasis = 100`);
  });
});

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${testsTotal} | PASSED: ${testsPassed} | FAILED: ${testsTotal - testsPassed}`);
console.log(`========================================\n`);

if (testsPassed !== testsTotal) {
  process.exit(1);
}
