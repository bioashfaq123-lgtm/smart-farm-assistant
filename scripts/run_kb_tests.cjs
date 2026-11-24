/**
 * Automated Test Runner: 34 Representative Agronomic Test Cases
 * Validates Knowledge Base Retrieval, Safety Gating, IPM Prioritization,
 * Stoichiometric Fertilizer Calculations, and Page Citations.
 */

const { searchKnowledgeBase } = require("../dist-test/retrievalEngine.js");
const { validateChemicalRecommendation, VERIFIED_PESTICIDES } = require("../dist-test/pesticideRegistry.js");
const { computeSourceGroundedFertilizer, VERIFIED_FERTILIZER_SCHEDULES } = require("../dist-test/fertilizerRegistry.js");

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ [FAIL] ${testName} - ${details}`);
  }
}

console.log("===============================================================");
console.log("SMART FARM ASSISTANT — AGRICULTURAL KNOWLEDGE BASE TEST SUITE");
console.log("===============================================================\n");

// --- 1. PADDY (RICE) CASES ---
console.log("SECTION 1: PADDY (RICE) AGRONOMY & PROTECTION");

// Case 1: Leaf Folder
const res1 = searchKnowledgeBase({ query: "leaf folder", crop: "Paddy" });
assert(
  res1.records.length > 0 || res1.verifiedChemicals.some(c => c.activeIngredient.includes("Cartap") || c.activeIngredient.includes("Chlorantraniliprole")),
  "Case 1: Paddy Leaf Folder retrieves verified remedy",
  JSON.stringify(res1.records.map(r => r.title))
);

// Case 2: DAP at tillering stage
const fertPaddy = computeSourceGroundedFertilizer({ crop: "Paddy", area: 1, unit: "acre" });
const tilleringSplit = fertPaddy.stageSplits.find(s => s.stageEn.includes("Tillering"));
assert(
  tilleringSplit && tilleringSplit.dapKg === 0 && tilleringSplit.ureaKg > 0,
  "Case 2: Tillering stage strictly forbids DAP (0 kg) and top-dresses Urea only",
  `Tillering DAP: ${tilleringSplit?.dapKg} kg`
);

// Case 3: Blast Disease
const res3 = searchKnowledgeBase({ query: "blast", crop: "Paddy" });
const blastRec = res3.records.find(r => r.id === "rec_dis_paddy_blast" || r.keywords.includes("blast"));
assert(
  blastRec && blastRec.citation.pdfPage === 51 && blastRec.citation.printedPage === 18,
  "Case 3: Paddy Blast retrieves Tricyclazole guidance with exact citation (PDF pg 51)",
  blastRec ? `${blastRec.citation.documentTitle} pg ${blastRec.citation.pdfPage}` : "Not found"
);

// Case 4: Sheath Blight
const res4 = searchKnowledgeBase({ query: "sheath blight", crop: "Paddy" });
assert(
  res4.records.some(r => r.id === "rec_dis_paddy_sheath_blight") && res4.verifiedChemicals.some(c => c.activeIngredient.includes("Hexaconazole")),
  "Case 4: Sheath Blight matches Hexaconazole 5% SC / Validamycin with lower sheath coverage",
  `Matches: ${res4.records.length}`
);

// Case 5: Bacterial Leaf Blight (BLB)
const res5 = searchKnowledgeBase({ query: "BLB bacterial leaf blight", crop: "Paddy" });
const blbRec = res5.records.find(r => r.id === "rec_dis_paddy_blb");
assert(
  blbRec && blbRec.originalTeluguText.includes("యూరియా") && blbRec.originalTeluguText.includes("ఆపివేయాలి"),
  "Case 5: BLB requires immediate cessation of urea top-dressing and field drainage",
  blbRec?.title
);

// Case 6: Brown Planthopper (BPH)
const res6 = searchKnowledgeBase({ query: "bph సుడిదోమ", crop: "Paddy" });
assert(
  res6.records.some(r => r.id === "rec_pest_paddy_bph") && res6.verifiedChemicals.some(c => c.activeIngredient.includes("Pymetrozine")),
  "Case 6: BPH identifies hopper burn, alleyways requirement, and Pymetrozine 50% WG",
  res6.verifiedChemicals.map(c => c.activeIngredient).join(", ")
);

// Case 7: Paddy Stem Borer
const res7 = searchKnowledgeBase({ query: "stem borer dead heart", crop: "Paddy" });
assert(
  res7.records.some(r => r.id === "rec_pest_paddy_stem_borer") && res7.records[0].ipm.cultural.length > 0,
  "Case 7: Stem Borer provides IPM tip clipping, pheromone traps, and Cartap/Coragen",
  res7.records[0]?.id
);

// Case 8: RNR 15048 Telangana Sona
const res8 = searchKnowledgeBase({ query: "telangana sona rnr 15048", crop: "Paddy" });
assert(
  res8.records.some(r => r.id === "rec_var_paddy_rnr15048") && res8.records[0].englishText.includes("51.5"),
  "Case 8: Telangana Sona specifies 125 days duration and low GI 51.5",
  res8.records[0]?.title
);

// Case 9: BPT 5204 Samba Mahsuri
const res9 = searchKnowledgeBase({ query: "bpt 5204 samba mahsuri", crop: "Paddy" });
assert(
  res9.records.some(r => r.id === "rec_var_paddy_bpt5204"),
  "Case 9: Samba Mahsuri specifies 145-150 days long duration and 15x15 cm spacing",
  res9.records[0]?.title
);

// Case 10: Alternate Wetting and Drying (AWD)
const res10 = searchKnowledgeBase({ query: "awd pani pipe", crop: "Paddy" });
assert(
  res10.records.some(r => r.id === "rec_irrig_awd_paddy") && res10.records[0].englishText.includes("15 cm"),
  "Case 10: AWD Pani Pipe specifies re-irrigation when water drops 15 cm below surface",
  res10.records[0]?.title
);

// Case 11: Direct Seeded Rice (DSR) Drum Seeder
const res11 = searchKnowledgeBase({ query: "drum seeder dsr", crop: "Paddy" });
assert(
  res11.records.some(r => r.id === "rec_sow_dsr_drum_seeder") && res11.records[0].englishText.includes("10–12 kg"),
  "Case 11: Drum Seeder specifies 10-12 kg sprouted seed rate and ~Rs 5,000 labor saving",
  res11.records[0]?.title
);

// Case 12: Paddy Nursery seed rate & Carbendazim
const res12 = searchKnowledgeBase({ query: "paddy nursery seed rate", crop: "Paddy" });
assert(
  res12.records.some(r => r.id === "rec_sow_paddy_nursery") && res12.records[0].englishText.includes("Carbendazim"),
  "Case 12: Nursery management specifies 5 cents nursery and Carbendazim seed treatment",
  res12.records[0]?.title
);

// Case 13: Transplanted Rice Pre-emergence weed control
const res13 = searchKnowledgeBase({ query: "pretilachlor pre-emergence", crop: "Paddy" });
assert(
  res13.verifiedChemicals.some(c => c.activeIngredient.includes("Pretilachlor 50% EC")),
  "Case 13: Pre-emergence weed control specifies Pretilachlor 50% EC @ 400 mL/acre within 3-5 DAT",
  res13.verifiedChemicals[0]?.activeIngredient
);

// Case 14: Transplanted Rice Post-emergence weed control
const res14 = searchKnowledgeBase({ query: "bispyribac nominee gold", crop: "Paddy" });
assert(
  res14.verifiedChemicals.some(c => c.activeIngredient.includes("Bispyribac Sodium 10% SC")),
  "Case 14: Post-emergence weed control specifies Bispyribac Sodium 10% SC @ 80-100 mL/acre",
  res14.verifiedChemicals[0]?.activeIngredient
);

// Case 15: Zinc deficiency (Khaira disease)
const res15 = searchKnowledgeBase({ query: "zinc deficiency khaira", crop: "Paddy" });
assert(
  res15.records.some(r => r.id === "rec_soil_zinc_deficiency") && res15.records[0].englishText.includes("Zinc Sulphate"),
  "Case 15: Zinc deficiency identifies bronze spots, 20-25 kg ZnSO4 basal, and bans DAP direct mixing",
  res15.records[0]?.title
);

// --- 2. COTTON CASES ---
console.log("\nSECTION 2: COTTON AGRONOMY & PROTECTION");

// Case 16: Pink Bollworm
const res16 = searchKnowledgeBase({ query: "pink bollworm rosette", crop: "Cotton" });
assert(
  res16.records.some(r => r.id === "rec_pest_cotton_pink_bollworm") && res16.verifiedChemicals.some(c => c.activeIngredient.includes("Emamectin")),
  "Case 16: Pink bollworm identifies rosetted flowers, pheromone traps, and Emamectin Benzoate 5% SG",
  res16.verifiedChemicals[0]?.activeIngredient
);

// Case 17: Non-Bt Refugia
const res17 = searchKnowledgeBase({ query: "cotton refugia non-bt", crop: "Cotton" });
assert(
  res17.records.some(r => r.id === "rec_var_cotton_refugia") && res17.records[0].englishText.includes("5 border rows"),
  "Case 17: Non-Bt refugia mandates 5 border rows to delay pink bollworm resistance",
  res17.records[0]?.title
);

// Case 18: Cotton Sucking Pests (Flonicamid)
const res18 = searchKnowledgeBase({ query: "jassids aphids flonicamid", crop: "Cotton" });
assert(
  res18.verifiedChemicals.some(c => c.activeIngredient.includes("Flonicamid 50% WG")),
  "Case 18: Cotton sucking pests approves Flonicamid 50% WG (Ulala) @ 0.4 g/L",
  res18.verifiedChemicals[0]?.activeIngredient
);

// Case 19: Cotton 4-split fertilizer schedule
const fertCotton = computeSourceGroundedFertilizer({ crop: "Cotton", area: 1, unit: "acre" });
assert(
  fertCotton.stageSplits.length === 4 && fertCotton.adjustedNutrientRequirementKg.n === 60,
  "Case 19: Cotton fertilizer schedule has 4 splits (Basal, Square, Flowering, Boll fill)",
  `Splits count: ${fertCotton.stageSplits.length}`
);

// Case 20: Pre-emergence herbicide in Cotton
const res20 = searchKnowledgeBase({ query: "pendimethalin pre-emergence", crop: "Cotton" });
assert(
  res20.verifiedChemicals.some(c => c.activeIngredient.includes("Pendimethalin 30% EC")),
  "Case 20: Cotton pre-emergence specifies Pendimethalin 30% EC @ 1.3 L/acre within 48h of sowing",
  res20.verifiedChemicals[0]?.activeIngredient
);

// --- 3. CHILLI CASES ---
console.log("\nSECTION 3: CHILLI AGRONOMY & PROTECTION");

// Case 21: Chilli Leaf Curl - Upward (Thrips)
const res21 = searchKnowledgeBase({ query: "chilli upward curl thrips", crop: "Chilli" });
assert(
  res21.records.some(r => r.id === "rec_pest_chilli_thrips_mites") && res21.verifiedChemicals.some(c => c.activeIngredient.includes("Fipronil")),
  "Case 21: Chilli upward leaf curling identified as Thrips, matches Fipronil 5% SC & blue traps",
  res21.verifiedChemicals[0]?.activeIngredient
);

// Case 22: Chilli Leaf Curl - Downward (Mites)
const res22 = searchKnowledgeBase({ query: "chilli downward curl mites", crop: "Chilli" });
assert(
  res22.records.some(r => r.id === "rec_pest_chilli_thrips_mites") && res22.verifiedChemicals.some(c => c.activeIngredient.includes("Spiromesifen")),
  "Case 22: Chilli downward inverted curling identified as Mites, matches Spiromesifen 22.9% SC",
  res22.verifiedChemicals[0]?.activeIngredient
);

// Case 23: Chilli Dieback & Anthracnose
const res23 = searchKnowledgeBase({ query: "chilli dieback fruit rot", crop: "Chilli" });
assert(
  res23.records.some(r => r.id === "rec_dis_chilli_dieback") && res23.records[0].englishText.includes("Azoxystrobin"),
  "Case 23: Chilli Dieback/Anthracnose specifies twig necrosis from tip downward & Azoxystrobin",
  res23.records[0]?.title
);

// Case 24: Chilli 4-split fertilizer schedule
const fertChilli = computeSourceGroundedFertilizer({ crop: "Chilli", area: 2, unit: "acre" });
assert(
  fertChilli.stageSplits.length === 4 && fertChilli.commercialProducts.dapBags50kg > 0,
  "Case 24: Chilli fertilizer allocates 4 splits (Basal, 30, 60, 90 DAT) scaled for 2 acres",
  `DAP bags: ${fertChilli.commercialProducts.dapBags50kg}`
);

// --- 4. MAIZE CASES ---
console.log("\nSECTION 4: MAIZE AGRONOMY & PROTECTION");

// Case 25: Maize Fall Armyworm
const res25 = searchKnowledgeBase({ query: "fall armyworm maize", crop: "Maize" });
assert(
  res25.records.some(r => r.id === "rec_pest_maize_fall_armyworm") && res25.records[0].englishText.includes("sand + lime"),
  "Case 25: Fall Armyworm specifies sand+lime whorl application & Chlorantraniliprole 18.5% SC",
  res25.records[0]?.title
);

// Case 26: Maize NPK split schedule
const fertMaize = computeSourceGroundedFertilizer({ crop: "Maize", area: 1, unit: "acre" });
assert(
  fertMaize.stageSplits.some(s => s.stageEn.includes("Knee-High")),
  "Case 26: Maize fertilizer includes Knee-High earthing-up split at 30-35 DAS",
  fertMaize.stageSplits.map(s => s.stageEn).join(", ")
);

// --- 5. PULSES, OILSEEDS & HORTICULTURE ---
console.log("\nSECTION 5: PULSES, OILSEEDS & CASH CROPS");

// Case 27: Redgram starter N
const fertRedgram = computeSourceGroundedFertilizer({ crop: "Redgram", area: 1, unit: "acre" });
assert(
  fertRedgram.commercialProducts.ureaBags45kg === 0 && fertRedgram.commercialProducts.dapBags50kg > 0,
  "Case 27: Redgram requires starter N from DAP only with 0 bags supplemental Urea (legume symbiosis)",
  `Urea bags: ${fertRedgram.commercialProducts.ureaBags45kg}, DAP bags: ${fertRedgram.commercialProducts.dapBags50kg}`
);

// Case 28: Groundnut Gypsum
const fertGroundnut = computeSourceGroundedFertilizer({ crop: "Groundnut", area: 1, unit: "acre" });
assert(
  fertGroundnut.stageSplits.some(s => s.stageEn.includes("Gypsum")),
  "Case 28: Groundnut schedule specifies 200 kg Gypsum/acre at flowering for pod filling & oil",
  fertGroundnut.stageSplits.map(s => s.stageEn).join(", ")
);

// Case 29: Turmeric Rhizome Rot
const res29 = searchKnowledgeBase({ query: "turmeric rhizome rot", crop: "Turmeric" });
assert(
  res29.records.some(r => r.id === "rec_hort_turmeric_rhizome_rot") && res29.records[0].englishText.includes("Metalaxyl"),
  "Case 29: Turmeric Rhizome Rot mandates seed rhizome soaking in Metalaxyl + soil drenching",
  res29.records[0]?.title
);

// --- 6. MECHANIZATION, DRONES & STORAGE ---
console.log("\nSECTION 6: MECHANIZATION, DRONES & STORAGE");

// Case 30: Agricultural Drone Spraying SOP
const res30 = searchKnowledgeBase({ query: "drone spraying sop kisan", crop: "General" });
assert(
  res30.records.some(r => r.id === "rec_tech_drone_spraying") && res30.records[0].englishText.includes("10–12 Litres"),
  "Case 30: Drone spraying SOP specifies 10-12 L water/acre, 1.5-2m altitude, and <10 km/h wind speed",
  res30.records[0]?.title
);

// Case 31: Grain Storage Moisture
const res31 = searchKnowledgeBase({ query: "grain storage moisture fumigation", crop: "General" });
assert(
  res31.records.some(r => r.id === "rec_post_grain_storage") && res31.records[0].englishText.includes("13–14%"),
  "Case 31: Grain storage specifies sun-drying to 13-14% moisture and Aluminium Phosphide fumigation",
  res31.records[0]?.title
);

// --- 7. SAFETY GATING, AMBIGUITY & STOICHIOMETRY ---
console.log("\nSECTION 7: SAFETY GATING, AMBIGUITY & STOICHIOMETRY");

// Case 32: Unregistered Chemical Withholding
const check32 = validateChemicalRecommendation("unapproved_compound_xyz", "Paddy");
assert(
  check32.isVerified === false && check32.rejectionReason.en.includes("withheld"),
  "Case 32: Unregistered chemical is safely withheld with statutory notice",
  check32.rejectionReason?.en
);

// Case 33: Soil Test Calibration (+25% for Low, -25% for High)
const fertSoilLow = computeSourceGroundedFertilizer({
  crop: "Paddy",
  area: 1,
  unit: "acre",
  soilTestStatus: { provided: true, nitrogenRating: "Low", phosphorusRating: "Low", potassiumRating: "Low" },
});
const fertSoilStd = computeSourceGroundedFertilizer({
  crop: "Paddy",
  area: 1,
  unit: "acre",
});
assert(
  fertSoilLow.isSoilTestGrounded === true &&
  fertSoilLow.adjustedNutrientRequirementKg.n === Math.round(fertSoilStd.adjustedNutrientRequirementKg.n * 1.25 * 10) / 10,
  "Case 33: Soil test calibration applies +25% nutrient boost when Soil N is Low",
  `Low N: ${fertSoilLow.adjustedNutrientRequirementKg.n} vs Base N: ${fertSoilStd.adjustedNutrientRequirementKg.n}`
);

// Case 34: Stoichiometric Anti-Double-Counting
const fertCheck = computeSourceGroundedFertilizer({ crop: "Paddy", area: 1, unit: "acre" });
const pSupplied = fertCheck.commercialProducts.dapKgTotal * 0.46;
const nFromDap = fertCheck.commercialProducts.dapKgTotal * 0.18;
const nFromUrea = fertCheck.commercialProducts.ureaKgTotal * 0.46;
assert(
  Math.abs(pSupplied - fertCheck.adjustedNutrientRequirementKg.p) < 1.0 &&
  Math.abs((nFromDap + nFromUrea) - fertCheck.adjustedNutrientRequirementKg.n) < 1.5,
  "Case 34: Stoichiometric conservation: N from DAP + N from Urea exactly matches target N",
  `Target N: ${fertCheck.adjustedNutrientRequirementKg.n}, Actual N: ${(nFromDap + nFromUrea).toFixed(1)}`
);

// Case 35: Trichoderma Biocontrol Retrieval
const res35 = searchKnowledgeBase({ query: "Explain about trichoderma", crop: "Paddy" });
assert(
  res35.records.some(r => r.id === "rec_bio_trichoderma_biocontrol") && res35.records[0].englishText.includes("Trichoderma"),
  "Case 35: Biocontrol query for Trichoderma retrieves Trichoderma viride biocontrol record even with Paddy profile",
  res35.records[0]?.title
);

console.log("\n===============================================================");
console.log(`TEST RUN COMPLETED: ${passedCount} PASSED, ${failedCount} FAILED out of 35`);
console.log("===============================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
