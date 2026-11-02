process.env.NODE_ENV = "test";
import test from "node:test";
import assert from "node:assert/strict";
import { executeDiagnosis, createInconclusiveDiagnosis, createValidationFailureResponse } from "../src/lib/diagnosisSafety.ts";
import { validateImagePayload } from "../src/lib/imageValidation.ts";
import {
  VALID_LEAF_IMAGE,
  VERY_DARK_IMAGE,
  OVEREXPOSED_IMAGE,
  LOW_RES_IMAGE,
  CORRUPTED_IMAGE,
  SPOOFED_IMAGE,
  UNSUPPORTED_TYPE_IMAGE,
} from "./fixtures.mjs";

const MOCK_API_KEY = "AIzaSyFakeKeyForTestingPurposes1234567890";

test("Test 1: Valid, clear leaf image passes pre-inference validation", () => {
  const result = validateImagePayload(VALID_LEAF_IMAGE);
  assert.equal(result.isValid, true);
  assert.ok(result.metadata);
  assert.equal(result.metadata.format, "png");
  assert.equal(result.metadata.width, 200);
  assert.equal(result.metadata.height, 200);
  assert.ok(result.metadata.estimatedLuminance >= 22 && result.metadata.estimatedLuminance <= 242);
});

test("Test 2: Blurry image triggers structured inconclusive result with guidance", async () => {
  const blurryModelJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "inconclusive",
    diseaseNameEn: "Diagnosis Inconclusive (Insufficient Image Quality / Blur)",
    diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది (మసకబారిన ఫోటో)",
    scientificName: "N/A",
    crop: "Paddy",
    confidenceLevel: "Unable to determine",
    severity: "low",
    symptomsEn: "Image is out of focus or motion-blurred. Vein structure and lesion halos cannot be differentiated.",
    symptomsTe: "ఫోటో అస్పష్టంగా, మసకబారి ఉంది. ఆకు మచ్చల లక్షణాలు స్పష్టంగా కనిపించడం లేదు.",
    chemicalSprayEn: "Do NOT spray chemicals without verified diagnosis.",
    chemicalSprayTe: "నిర్ధారించని మందులు వాడవద్దు.",
    dosage: "Consult local AEO",
    organicControlEn: "Take a clear, sharp close-up photo.",
    organicControlTe: "ఆకును దగ్గరగా ఉంచి స్పష్టమైన ఫోటో తీయండి.",
    preventiveMeasuresEn: "Hold camera steady 15-20 cm from leaf.",
    preventiveMeasuresTe: "చేయి వణకకుండా స్థిరంగా పట్టుకుని ఫోటో తీయండి.",
    safetyDisclaimer: "Always confirm critical treatment decisions with local AEO.",
  });

  const res = await executeDiagnosis(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: blurryModelJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.equal(res.body.diagnosis.status, "inconclusive");
  assert.equal(res.body.diagnosis.confidenceLevel, "Unable to determine");
  assert.equal(res.body.diagnosis.isChemicalVerified, false);
});

test("Test 3: Very dark image rejected by pre-inference validation", () => {
  const res = validateImagePayload(VERY_DARK_IMAGE);
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "IMAGE_TOO_DARK");
  assert.match(res.messageEn, /severely underexposed|darkness/i);
  assert.match(res.messageTe, /చాలా చీకటిగా ఉంది/);
  assert.match(res.guidanceTe, /మంచి వెలుతురులో ఫోటో తీసి మళ్లీ ప్రయత్నించండి/);
});

test("Test 4: Overexposed image rejected by pre-inference validation", () => {
  const res = validateImagePayload(OVEREXPOSED_IMAGE);
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "IMAGE_TOO_BRIGHT");
  assert.match(res.messageEn, /severely overexposed|harsh glare/i);
  assert.match(res.messageTe, /మితిమీరిన కాంతి లేదా మెరుపు/);
});

test("Test 5: Image below the supported resolution rejected", () => {
  const res = validateImagePayload(LOW_RES_IMAGE, { minWidth: 120, minHeight: 120 });
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "RESOLUTION_TOO_LOW");
  assert.match(res.messageEn, /resolution .* is too low/i);
  assert.match(res.messageTe, /రెసల్యూషన్ .* చాలా తక్కువగా ఉంది/);
});

test("Test 6: Corrupted image rejected safely", () => {
  const res = validateImagePayload(CORRUPTED_IMAGE);
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "CORRUPT_BASE64");
  assert.match(res.messageEn, /corrupted, empty, or truncated/i);
});

test("Test 7: Empty upload rejected with actionable error", async () => {
  const res = await executeDiagnosis({
    crop: "Paddy",
    image: "",
    symptoms: "",
  });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /Please upload an image or describe crop symptoms/i);
});

test("Test 8: Spoofed image extension or MIME type rejected via magic bytes", () => {
  const res = validateImagePayload(SPOOFED_IMAGE);
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "UNSUPPORTED_FORMAT");
  assert.match(res.messageEn, /Unsupported image format or spoofed file signature/i);
});

test("Test 9: Unsupported file type (GIF/PDF) rejected", () => {
  const res = validateImagePayload(UNSUPPORTED_TYPE_IMAGE);
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "UNSUPPORTED_FORMAT");
});

test("Test 10: File exceeding upload-size limit rejected", () => {
  // Test with tight size limit config (10 KB)
  const res = validateImagePayload(VALID_LEAF_IMAGE, { maxSizeBytes: 200 });
  assert.equal(res.isValid, false);
  assert.equal(res.errorKey, "PAYLOAD_TOO_LARGE");
});

test("Test 11: Non-plant image rejected safely without fabricating disease", async () => {
  const nonPlantModelJson = JSON.stringify({
    isPlant: false,
    cropConsistency: "inconsistent",
    status: "inconclusive",
    diseaseNameEn: "Diagnosis Inconclusive (Non-Plant Subject)",
    diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది (పంట ఆకు కాదు)",
    scientificName: "N/A",
    crop: "Cotton",
    confidenceLevel: "Unable to determine",
    severity: "low",
    symptomsEn: "Visual inspection indicates an animal or mechanical tool rather than crop foliage.",
    symptomsTe: "ఫోటోలో పంట ఆకు కనిపించడం లేదు.",
    chemicalSprayEn: "No chemical prescription issued.",
    chemicalSprayTe: "ఎలాంటి మందు సిఫారసు చేయబడలేదు.",
    dosage: "N/A",
    organicControlEn: "Upload an affected crop leaf photo.",
    organicControlTe: "తెగులు సోకిన ఆకు ఫోటోను అప్లోడ్ చేయండి.",
    preventiveMeasuresEn: "Ensure camera focuses on plant foliage.",
    preventiveMeasuresTe: "కెమెరా ఆకుపై ఫోకస్ అయ్యేలా చూడండి.",
    safetyDisclaimer: "Never evaluate non-plant subjects.",
  });

  const res = await executeDiagnosis(
    {
      crop: "Cotton",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: nonPlantModelJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.equal(res.body.diagnosis.status, "inconclusive");
  assert.notEqual(res.body.diagnosis.id, "bollworm");
  assert.notEqual(res.body.diagnosis.id, "paddy_blast");
  assert.equal(res.body.diagnosis.isChemicalVerified, false);
});

test("Test 12: Unsupported crop handled safely without forced diagnosis", async () => {
  const res = await executeDiagnosis({
    crop: "Dragonfruit",
    image: VALID_LEAF_IMAGE,
    lang: "en",
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.match(res.body.diagnosis.symptomsEn, /not currently in our validated Telangana PJTAU crop database/i);
  assert.notEqual(res.body.diagnosis.id, "paddy_blast");
});

test("Test 13: Ambiguous crop identity requests clarification", async () => {
  const ambiguousCropJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "ambiguous",
    status: "inconclusive",
    diseaseNameEn: "Diagnosis Inconclusive (Ambiguous Crop Identity)",
    diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది (పంట రకం అస్పష్టంగా ఉంది)",
    scientificName: "N/A",
    crop: "Chilli",
    confidenceLevel: "Unable to determine",
    severity: "low",
    symptomsEn: "Leaf shape does not definitively match Chilli. Could be weed foliage or solanaceous relative.",
    symptomsTe: "ఆకు లక్షణాలు మిరప పంటతో ఖచ్చితంగా సరిపోలడం లేదు.",
    chemicalSprayEn: "No chemical prescription issued without verified crop identity.",
    chemicalSprayTe: "పంట స్పష్టత లేకుండా మందులు వాడవద్దు.",
    dosage: "Consult local AEO",
    organicControlEn: "Upload whole plant photo or provide field context.",
    organicControlTe: "మొక్క మొత్తం కనిపించేలా ఫోటో తీయండి.",
    preventiveMeasuresEn: "Verify crop selection.",
    preventiveMeasuresTe: "సరైన పంటను ఎంచుకోండి.",
    safetyDisclaimer: "Confirm crop type before spraying.",
  });

  const res = await executeDiagnosis(
    {
      crop: "Chilli",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: ambiguousCropJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.match(res.body.diagnosis.symptomsEn, /Crop species identity is ambiguous/i);
});

test("Test 14: Image-quality validation failure returns structured bilingual error", () => {
  const darkRes = validateImagePayload(VERY_DARK_IMAGE);
  const failurePayload = createValidationFailureResponse("Paddy", "Jagtial", "te", darkRes);

  assert.equal(failurePayload.success, false);
  assert.equal(failurePayload.status, "validation_failed");
  assert.equal(failurePayload.errorKey, "IMAGE_TOO_DARK");
  assert.match(failurePayload.error, /చాలా చీకటిగా ఉంది/);
  assert.match(failurePayload.guidance, /మంచి వెలుతురులో ఫోటో తీసి మళ్లీ ప్రయత్నించండి/);
  assert.equal(failurePayload.diagnosis.isChemicalVerified, false);
  assert.match(failurePayload.diagnosis.chemicalSprayTe, /ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు/);
});

test("Test 15: Vision provider timeout handled gracefully", async () => {
  const res = await executeDiagnosis(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => {
        const err = new Error("Gateway Timeout: AI provider did not respond in 12s");
        err.name = "TimeoutError";
        throw err;
      },
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.equal(res.body.diagnosis.isChemicalVerified, false);
  assert.notEqual(res.body.diagnosis.id, "paddy_blast");
});

test("Test 16: Valid image proceeds to diagnosis stage with safety gate preserved", async () => {
  const validDiagnosisJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible_diagnosis",
    diseaseNameEn: "Rice Blast (Leaf & Neck Blast)",
    diseaseNameTe: "వరి అగ్గితెగులు",
    scientificName: "Pyricularia oryzae",
    crop: "Paddy",
    confidenceLevel: "Possible diagnosis",
    severity: "high",
    symptomsEn: "Spindle-shaped brown lesions with ash-grey centers on leaf blades.",
    symptomsTe: "ఆకులపై బూడిద కేంద్రంతో కదురు ఆకారపు మచ్చలు.",
    chemicalSprayEn: "Tricyclazole 75% WP @ 0.6 g/L water (PJTAU Package of Practices)",
    chemicalSprayTe: "ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ (PJTAU సిఫారసు)",
    dosage: "Consult container label and local AEO",
    organicControlEn: "Spray Pseudomonas fluorescens @ 10 g/L or neem oil 10,000 ppm @ 2 mL/L.",
    organicControlTe: "సూడోమోనాస్ ఫ్లోరోసెన్స్ 10 గ్రా/లీ పిచికారీ చేయండి.",
    preventiveMeasuresEn: "Avoid excess nitrogen fertilizer. Maintain proper field water level.",
    preventiveMeasuresTe: "నత్రజని ఎరువులను అధికంగా వాడరాదు.",
    safetyDisclaimer: "Always verify critical diagnosis with your local Agriculture Extension Officer (AEO).",
  });

  const res = await executeDiagnosis(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      symptoms: "Spindle-shaped brown lesions with ash-grey centers",
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: validDiagnosisJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "possible_diagnosis");
  assert.match(res.body.diagnosis.diseaseNameEn, /Rice Blast/i);
  assert.equal(res.body.diagnosis.confidenceLevel, "Possible diagnosis");
  assert.equal(res.body.diagnosis.isChemicalVerified, false);
  assert.match(res.body.diagnosis.safetyDisclaimer, /Agriculture Extension Officer/i);
});
