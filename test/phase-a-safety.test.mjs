process.env.NODE_ENV = "test";
import test from "node:test";
import assert from "node:assert/strict";
import {
  matchLocalDisorder,
  createInconclusiveDiagnosis,
  executeDiagnosis,
  getDiseasesDb,
} from "../src/lib/diagnosisSafety.ts";

// Dummy 64-char valid Base64 image payload for image upload tests
const DUMMY_BASE64_IMAGE =
  "data:image/jpeg;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// Mock valid API key
const MOCK_API_KEY = "AIzaSyFakeKeyForTestingPurposes1234567890";

test("Case 1: Paddy selected, no symptoms, and AI service unavailable", async () => {
  // Input: Crop is Paddy, no symptoms, AI unavailable (mocked network failure)
  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      symptoms: "",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => {
        throw new Error("AI service unavailable: Network unreachable");
      },
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "inconclusive");
  assert.equal(result.body.diagnosis.status, "inconclusive");
  // Crucial: Must NEVER default to disorders[0] (Rice Blast)
  assert.notEqual(result.body.diagnosis.id, "blast");
  assert.equal(
    result.body.diagnosis.diseaseNameEn,
    "Diagnosis Inconclusive / Further Verification Required"
  );
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
  assert.match(result.body.diagnosis.chemicalSprayEn, /No chemical prescription issued/i);
});

test("Case 2: Healthy leaf uploaded", async () => {
  // Model vision detects a healthy leaf and outputs inconclusive status
  const healthyLeafJson = JSON.stringify({
    status: "inconclusive",
    diseaseNameEn: "No Pathogen Detected (Healthy Foliage)",
    diseaseNameTe: "వ్యాధి లక్షణాలు లేవు (ఆరోగ్యకరమైన ఆకు)",
    scientificName: "N/A",
    crop: "Paddy",
    confidenceLevel: "Unable to determine",
    severity: "low",
    symptomsEn: "Foliage appears green and vigorous without active necrotic lesions or fungal sporulation.",
    symptomsTe: "ఆకు ఆరోగ్యంగా ఉంది, ఎలాంటి తెగులు మచ్చలు కనిపించడం లేదు.",
    chemicalSprayEn: "Do not apply chemical sprays to healthy crops.",
    chemicalSprayTe: "ఆరోగ్యకరమైన పంటకు రసాయన మందులు అవసరం లేదు.",
    dosage: "No chemical required",
    organicControlEn: "Maintain balanced nutrition and adequate irrigation.",
    organicControlTe: "సమతుల్య పోషకాలు మరియు నీటి యాజమాన్యం పాటించండి.",
    preventiveMeasuresEn: "Continue regular field scouting.",
    preventiveMeasuresTe: "పొలాన్ని క్రమం తప్పకుండా పర్యవేక్షించండి.",
    safetyDisclaimer: "Do not apply off-label pesticides.",
  });

  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: healthyLeafJson }] } }],
        }),
      }),
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "inconclusive");
  assert.equal(result.body.diagnosis.status, "inconclusive");
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
  assert.match(result.body.diagnosis.chemicalSprayEn, /No chemical prescription issued/i);
  assert.notEqual(result.body.diagnosis.id, "blast");
});

test("Case 3: Non-plant image uploaded", async () => {
  // Model detects a non-plant object (e.g. tractor, hand, shoe)
  const nonPlantJson = JSON.stringify({
    status: "inconclusive",
    diseaseNameEn: "Diagnosis Inconclusive (Non-Plant Subject)",
    diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది (పంట ఆకు కాదు)",
    scientificName: "N/A",
    crop: "Cotton",
    confidenceLevel: "Unable to determine",
    severity: "low",
    symptomsEn: "Uploaded image does not appear to contain a crop leaf or agricultural plant specimen.",
    symptomsTe: "అందించిన ఫోటోలో పంట లేదా ఆకు స్పష్టంగా కనిపించడం లేదు.",
    chemicalSprayEn: "No chemical prescription issued.",
    chemicalSprayTe: "ఎలాంటి మందు సిఫారసు చేయబడలేదు.",
    dosage: "N/A",
    organicControlEn: "Please upload an infected crop leaf photo.",
    organicControlTe: "దయచేసి తెగులు సోకిన ఆకు ఫోటోను అప్లోడ్ చేయండి.",
    preventiveMeasuresEn: "Ensure camera is focused on affected crop leaf.",
    preventiveMeasuresTe: "కెమెరా ఆకుపై ఫోకస్ అయ్యేలా చూడండి.",
    safetyDisclaimer: "Only evaluate clear agricultural foliage.",
  });

  const result = await executeDiagnosis(
    {
      crop: "Cotton",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: nonPlantJson }] } }],
        }),
      }),
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "inconclusive");
  assert.equal(result.body.diagnosis.status, "inconclusive");
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
  assert.notEqual(result.body.diagnosis.id, "bollworm");
});

test("Case 4: Image of an unsupported crop uploaded", async () => {
  // Crop not in knowledge base (e.g. Dragonfruit)
  const result = await executeDiagnosis(
    {
      crop: "Dragonfruit",
      symptoms: "Unusual reddish stems",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => {
        throw new Error("AI unreachable");
      },
    }
  );

  // Must not assign Paddy/Cotton disorders to Dragonfruit!
  assert.equal(result.status, 200);
  assert.equal(result.body.status, "inconclusive");
  assert.equal(result.body.diagnosis.crop, "Dragonfruit");
  assert.notEqual(result.body.diagnosis.id, "blast");
  assert.notEqual(result.body.diagnosis.id, "bollworm");
});

test("Case 5: Blurry or unreadable image uploaded", async () => {
  const blurryJson = JSON.stringify({
    status: "inconclusive",
    diseaseNameEn: "Diagnosis Inconclusive (Insufficient Image Quality)",
    diseaseNameTe: "వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది (స్పష్టత లేని ఫోటో)",
    scientificName: "N/A",
    crop: "Chilli",
    confidenceLevel: "Unable to determine",
    severity: "medium",
    symptomsEn: "Photo is out of focus, motion-blurred, or underexposed. Lesion margins cannot be resolved.",
    symptomsTe: "ఫోటో అస్పష్టంగా ఉంది. ఆకు మచ్చలు సరిగ్గా కనిపించడం లేదు.",
    chemicalSprayEn: "Do NOT spray chemicals without verified diagnosis.",
    chemicalSprayTe: "స్పష్టమైన నిర్ధారణ లేకుండా మందులు వాడవద్దు.",
    dosage: "N/A",
    organicControlEn: "Retake photo in clear morning sunlight.",
    organicControlTe: "మంచి వెలుతురులో ఫోటో తీయండి.",
    preventiveMeasuresEn: "Capture sharp close-up images of both leaf surfaces.",
    preventiveMeasuresTe: "ఆకు రెండు వైపులా స్పష్టంగా కనిపించేలా ఫోటో తీయండి.",
    safetyDisclaimer: "Always confirm diagnosis before spraying.",
  });

  const result = await executeDiagnosis(
    {
      crop: "Chilli",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: blurryJson }] } }],
        }),
      }),
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "inconclusive");
  assert.equal(result.body.diagnosis.status, "inconclusive");
  assert.equal(result.body.diagnosis.confidenceLevel, "Unable to determine");
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
});

test("Case 6: AI timeout or provider error", async () => {
  // Network timeout simulation
  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      symptoms: "Yellowish streaks",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => {
        const timeoutErr = new Error("The operation was aborted due to timeout");
        timeoutErr.name = "TimeoutError";
        throw timeoutErr;
      },
    }
  );

  assert.equal(result.status, 200);
  // Must safely degrade without crashing or returning arbitrary default
  assert.notEqual(result.body.diagnosis.id, "blast");
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
});

test("Case 7: Invalid or incomplete model JSON", async () => {
  // Provider returns malformed / truncated JSON string
  const malformedOutput = '{"status": "possible_diagnosis", "diseaseNameEn": "Rice Bl';

  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      symptoms: "general spots",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: malformedOutput }] } }],
        }),
      }),
    }
  );

  // JSON parse error caught; must safely degrade to inconclusive
  assert.equal(result.status, 200);
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
  assert.notEqual(result.body.diagnosis.id, "blast");
});

test("Case 8: Missing API key", async () => {
  // No API key provided (empty string)
  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      symptoms: "vague yellow leaf",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: "", // empty
    }
  );

  assert.equal(result.status, 200);
  // Without API key, symptoms are too vague for high score -> inconclusive
  assert.equal(result.body.status, "inconclusive");
  assert.equal(result.body.diagnosis.status, "inconclusive");
  assert.notEqual(result.body.diagnosis.id, "blast");
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
});

test("Case 9: A disease absent from the knowledge base", async () => {
  // Vision model detects an unlisted disease: "Fusarium Head Blight"
  const unlistedDiseaseJson = JSON.stringify({
    status: "possible_diagnosis",
    diseaseNameEn: "Fusarium Head Blight",
    diseaseNameTe: "ఫ్యుసేరియం హెడ్ బ్లైట్",
    scientificName: "Fusarium graminearum",
    crop: "Paddy",
    confidenceLevel: "Needs further verification",
    severity: "high",
    symptomsEn: "Bleached spikelets on panicles with salmon-pink sporodochia.",
    symptomsTe: "కంకులపై తెల్లబారిన గింజలు మరియు గులాబీ రంగు బూజు కనిపిస్తుంది.",
    chemicalSprayEn: "Apply registered triazole fungicide per local agronomic guidelines.",
    chemicalSprayTe: "వ్యవసాయ అధికారి సూచించిన శిలీంధ్ర నాశిని వాడండి.",
    dosage: "Consult container label and local AEO",
    organicControlEn: "Crop rotation and clean seed selection.",
    organicControlTe: "పంట మార్పిడి మరియు శుద్ధి చేసిన విత్తనాలు వాడండి.",
    preventiveMeasuresEn: "Avoid overhead irrigation during flowering.",
    preventiveMeasuresTe: "పూత దశలో నీటి తుంపర్లు ఆకులపై పడకుండా చూడండి.",
    safetyDisclaimer: "Wear protective face mask and gloves.",
  });

  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      image: DUMMY_BASE64_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: unlistedDiseaseJson }] } }],
        }),
      }),
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "possible_diagnosis");
  // Verification status must explicitly show Unverified Draft
  assert.match(result.body.diagnosis.verificationStatus, /Unverified/i);
  // Chemical must NOT be verified, and chemicalSprayEn must instruct on-site confirmation
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
  assert.match(
    result.body.diagnosis.chemicalSprayEn,
    /No verified chemical prescription available/i
  );
  assert.match(result.body.diagnosis.chemicalSprayEn, /Mandal Agricultural Extension Officer/i);
});

test("Case 10: An unverified chemical recommendation", async () => {
  // Check that chemical recommendations are never marked verified without CIB&RC confirmation
  const testInconclusive = createInconclusiveDiagnosis("Paddy", "Jagtial", "en");
  assert.equal(testInconclusive.diagnosis.isChemicalVerified, false);
  assert.match(testInconclusive.diagnosis.dosage, /Do not apply chemical pesticides/i);

  // Check matching disorder result
  const localDisorder = matchLocalDisorder("Paddy", "Spindle-shaped brown lesions with ash-grey center on leaf blades");
  assert.ok(localDisorder);
  assert.equal(localDisorder.id, "paddy_blast");

  // In executeDiagnosis, symptom match must have isChemicalVerified === false
  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      symptoms: "Spindle-shaped brown lesions with ash-grey center on leaf blades",
      lang: "en",
    },
    {
      apiKey: "", // test symptom match path
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "symptom_match");
  assert.equal(result.body.diagnosis.isChemicalVerified, false);
  assert.match(result.body.diagnosis.chemicalSprayEn, /Must be confirmed by your Mandal AEO/i);
  assert.equal(result.body.diagnosis.dosage, "Confirm with Mandal AEO before purchase");
});

test("Case 11: A successful diagnosis with a valid, verified knowledge-base record", async () => {
  // Distinct symptoms matching Rice Blast in data/diseases.json
  const symptoms = "Spindle-shaped brown lesions with ash-grey center and black panicle neck rot";
  const matched = matchLocalDisorder("Paddy", symptoms);

  assert.ok(matched, "Should find a positive match in knowledge base");
  assert.equal(matched.id, "paddy_blast");
  assert.match(matched.commonName, /Rice Blast/);
  assert.ok(matched.management.biological.length > 0);
  assert.ok(matched.management.cultural.length > 0);

  const result = await executeDiagnosis(
    {
      crop: "Paddy",
      symptoms,
      lang: "en",
    },
    {
      apiKey: "",
    }
  );

  assert.equal(result.status, 200);
  assert.match(result.body.diagnosis.diseaseNameEn, /Rice Blast/);
  assert.equal(result.body.diagnosis.id, "paddy_blast");
  assert.match(result.body.diagnosis.safetyDisclaimer, /Agriculture Extension Officer/i);
});

test("Case 12: Telugu and English result rendering for inconclusive diagnoses", () => {
  // Test English rendering
  const enResult = createInconclusiveDiagnosis("Paddy", "Jagtial", "en");
  assert.equal(enResult.status, "inconclusive");
  assert.equal(
    enResult.diagnosis.diseaseNameEn,
    "Diagnosis Inconclusive / Further Verification Required"
  );
  assert.match(enResult.diagnosis.chemicalSprayEn, /No chemical prescription issued/i);
  assert.match(enResult.diagnosis.safetyDisclaimer, /Agricultural Safety Gate/i);
  assert.ok(
    enResult.diagnosis.suggestedActionsEn?.some((action) =>
      action.includes("1800-180-1551")
    ),
    "English result must include Kisan Toll-Free helpline"
  );

  // Test Telugu rendering
  const teResult = createInconclusiveDiagnosis("Paddy", "Jagtial", "te");
  assert.equal(teResult.status, "inconclusive");
  assert.match(teResult.diagnosis.diseaseNameTe, /వ్యాధి నిర్ధారణ అసంపూర్ణంగా ఉంది/);
  assert.match(teResult.diagnosis.chemicalSprayTe, /ఎలాంటి రసాయన మందు సిఫారసు చేయబడలేదు/);
  assert.match(teResult.diagnosis.symptomsTe, /ఖచ్చితమైన నిర్ధారణకు సరిపోలేదు/);
  assert.ok(
    teResult.diagnosis.suggestedActionsTe?.some((action) =>
      action.includes("1800-180-1551")
    ),
    "Telugu result must include Kisan Toll-Free helpline"
  );
});
