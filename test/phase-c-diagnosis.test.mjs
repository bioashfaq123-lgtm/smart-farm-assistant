import test from "node:test";
import assert from "node:assert/strict";
import { runDiagnosisPipeline } from "../src/lib/diagnosis/pipeline.ts";
import { checkRateLimit, resetRateLimits } from "../src/lib/diagnosis/rateLimiter.ts";
import { VALID_LEAF_IMAGE, CORRUPTED_IMAGE, VERY_DARK_IMAGE } from "./fixtures.mjs";

const MOCK_API_KEY = "AIzaSyFakeKeyForPhaseCTestMockingOnly1234567";

test("Case 1: Clear image with a supported crop and distinct symptoms", async () => {
  const modelJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "diagnosis_available",
    primaryObservation: "Clear diamond/spindle-shaped lesions with grey center on paddy leaf blade.",
    candidates: [
      {
        id: "paddy_blast",
        commonName: "Rice Blast",
        nameTe: "వరి అగ్గితెగులు",
        scientificName: "Magnaporthe oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Spindle-shaped lesions with brownish-red margins and grey center.",
        unconfirmedSymptoms: "Panicle neck rot not visible in leaf photo.",
        differentialClues: "Spindle shape with grey center distinguishes from circular brown spot lesions.",
        fieldCheck: "Inspect lower canopy and panicle neck node for lesion progression.",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      symptoms: "Spindle-shaped leaf spots with ash-grey center",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case1-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: modelJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.status, "diagnosis_available");
  assert.equal(res.body.candidates.length, 1);

  const candidate = res.body.candidates[0];
  assert.equal(candidate.id, "paddy_blast");
  assert.equal(candidate.isFromKb, true);
  assert.match(candidate.verificationStatus, /Draft Knowledge Base|Verified/i);
  assert.ok(candidate.management.cultural.length > 0);
  assert.ok(candidate.management.biological.length > 0);
  assert.match(candidate.management.safetyDisclaimer, /Agriculture Extension Officer/i);
});

test("Case 2: Ambiguous symptoms shared by multiple diseases (Blast vs Brown Spot)", async () => {
  const differentialJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible",
    primaryObservation: "Early stage foliar spots showing overlapping fungal necrotic signs.",
    candidates: [
      {
        id: "paddy_blast",
        commonName: "Rice Blast",
        nameTe: "వరి అగ్గితెగులు",
        scientificName: "Magnaporthe oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Early small brownish spots initiating on middle leaves.",
        unconfirmedSymptoms: "Fully elongated spindle centers not yet formed.",
        differentialClues: "Blast lesions elongate into spindle shapes with ash-grey center; Brown spot lesions remain oval with yellow halo.",
        fieldCheck: "Hold leaf against sunlight: check if spot centers are greyish-white (Blast) or uniform dark brown (Brown Spot).",
      },
      {
        id: "paddy_brown_spot",
        commonName: "Brown Spot",
        nameTe: "ఆకుమచ్చ తెగులు",
        scientificName: "Bipolaris oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Small circular brown spots scattered across leaf blade.",
        unconfirmedSymptoms: "Seedling collar rot not visible.",
        differentialClues: "Circular/oval spots with distinct yellow halo; often indicates potassium or silica deficient light soils.",
        fieldCheck: "Inspect soil fertility history: Brown spot typically predominates in sandy, nutrient-depleted soils.",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      symptoms: "Small brownish spots on leaves, unsure if blast or brown spot",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case2-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: differentialJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "possible");
  assert.equal(res.body.candidates.length, 2);

  // Verifies that two distinct candidates are preserved without forced single prediction
  assert.equal(res.body.candidates[0].id, "paddy_blast");
  assert.equal(res.body.candidates[1].id, "paddy_brown_spot");
  assert.ok(res.body.candidates[0].differentialClues.length > 10);
  assert.ok(res.body.candidates[1].fieldCheck.length > 10);
});

test("Case 3: Healthy leaf uploaded", async () => {
  const healthyJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "inconclusive",
    notSureReason: "Foliage appears vigorous and healthy. No pathogen lesions, chlorosis, or pest chewing observed.",
    candidates: [],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case3-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: healthyJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.equal(res.body.candidates.length, 0);
  assert.notEqual(res.body.diagnosis.id, "paddy_blast");
  assert.match(res.body.diagnosis.diseaseNameEn, /Inconclusive/i);
});

test("Case 4: Leaf showing nutrient deficiency or abiotic stress (Zinc deficiency)", async () => {
  const nutrientJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "diagnosis_available",
    primaryObservation: "Rusty brown discoloration and midrib chlorosis characteristic of Khaira disease (Zinc deficiency).",
    candidates: [
      {
        id: "",
        commonName: "Zinc Deficiency (Khaira Disease)",
        nameTe: "జింక్ లోపం (ఖైరా తెగులు)",
        scientificName: "Zinc Deficiency (Micronutrient Abiotic Disorder)",
        type: "nutrient",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Rusty-brown blotches starting on lower leaf blades 2-3 weeks after transplanting.",
        unconfirmedSymptoms: "Stunted seedling root growth not confirmed.",
        differentialClues: "No fungal mycelium or sporulation; widespread across waterlogged patch rather than localized fungal centers.",
        fieldCheck: "Check if soil is continuously submerged or high in pH/calcareous content.",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      symptoms: "Rusty reddish brown patches on leaves 3 weeks after transplanting",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case4-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: nutrientJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.candidates[0].type, "nutrient");
  assert.match(res.body.candidates[0].commonName, /Zinc/i);
  assert.equal(res.body.diagnosis.severity, "low");
});

test("Case 5: Unsupported crop uploaded", async () => {
  const res = await runDiagnosisPipeline(
    {
      crop: "Dragonfruit",
      symptoms: "Yellowing stem segments",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      clientIp: "case5-ip",
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.match(res.body.diagnosis.symptomsEn, /Paddy/i); // Mentions supported crops
  assert.notEqual(res.body.diagnosis.id, "paddy_blast");
});

test("Case 6: Image where symptoms are not classifiable from this angle/light", async () => {
  const unclassifiableJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "needs_more_information",
    notSureReason: "Visual symptoms are inconclusive from this angle. The lesion margin is obscured by shadow and leaf curling. Underside inspection required.",
    candidates: [],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Cotton",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case6-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: unclassifiableJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "needs_more_information");
  assert.match(res.body.notSureReason, /underside|inconclusive/i);
});

test("Case 7: Missing symptoms with ambiguous image", async () => {
  const inconclusiveJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "inconclusive",
    notSureReason: "Visual evidence is ambiguous without clinical field inspection.",
    candidates: [],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      symptoms: "",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case7-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: inconclusiveJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
  assert.notEqual(res.body.diagnosis.id, "paddy_blast");
});

test("Case 8: Malformed model output (invalid JSON)", async () => {
  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case8-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "```json { broken_json: [ unclosed" }] } }],
        }),
      }),
    }
  );

  // Gracefully caught and safely returned without crashing
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "inconclusive");
});

test("Case 9: AI provider timeout", async () => {
  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case9-ip",
      fetchFn: async () => {
        throw new Error("AbortSignal.timeout: Network timeout after 12000ms");
      },
    }
  );

  assert.equal(res.status, 200);
  assert.ok(res.body.status === "inconclusive" || res.body.status === "provider_error");
  assert.match(res.body.diagnosis.symptomsEn, /timed out|unavailable|connection/i);
});

test("Case 10: Model suggests disease absent from knowledge base", async () => {
  const unlistedJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible",
    primaryObservation: "Sheath rot observed on upper leaf sheaths.",
    candidates: [
      {
        id: "",
        commonName: "Sheath Rot",
        nameTe: "వరి తొడుగు కుళ్ళు తెగులు",
        scientificName: "Sarocladium oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Oblong or irregular greyish brown lesions on flag leaf sheath.",
        unconfirmedSymptoms: "Immature panicle emergence failure.",
        differentialClues: "Lesions concentrated on boot leaf sheath enclosing the young panicle.",
        fieldCheck: "Peel back leaf sheath to inspect panicle rot.",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case10-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: unlistedJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  const candidate = res.body.candidates[0];
  assert.equal(candidate.isFromKb, false);
  assert.match(candidate.verificationStatus, /Unverified/i);
  assert.equal(res.body.diagnosis.isChemicalVerified, false);
  assert.match(candidate.management.chemicalNoticeEn, /No verified chemical prescription available/i);
});

test("Case 11: Disease record in KB marked as unreviewed/draft", async () => {
  // Cotton Pink Bollworm in KB has reviewStatus: "draft - needs expert review"
  const bollwormJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible",
    candidates: [
      {
        id: "cotton_pink_bollworm",
        commonName: "Pink Bollworm",
        nameTe: "గులాబీ రంగు కాయతొలుచు పురుగు",
        scientificName: "Pectinophora gossypiella",
        type: "insect",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Rosetted flower and small exit holes on developing bolls.",
        unconfirmedSymptoms: "Internal lint staining.",
        differentialClues: "Rosetted flowers twisted shut like a rosette.",
        fieldCheck: "Open 20 green bolls across the field to count internal larvae.",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Cotton",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case11-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: bollwormJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  const candidate = res.body.candidates[0];
  assert.equal(candidate.isFromKb, true);
  // Must show Draft Knowledge Base status
  assert.match(candidate.verificationStatus, /Draft Knowledge Base/i);
});

test("Case 12: Grounded cultural and biological management recommendations", async () => {
  const blastJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible",
    candidates: [
      {
        id: "paddy_blast",
        commonName: "Rice Blast",
        nameTe: "వరి అగ్గితెగులు",
        scientificName: "Magnaporthe oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Spindle spots on leaves.",
        unconfirmedSymptoms: "",
        differentialClues: "",
        fieldCheck: "",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case12-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: blastJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  const mgmt = res.body.candidates[0].management;
  assert.ok(mgmt.cultural.some((c) => c.toLowerCase().includes("nitrogen") || c.toLowerCase().includes("drainage") || c.toLowerCase().includes("spacing")));
  assert.ok(mgmt.biological.some((b) => b.toLowerCase().includes("pseudomonas") || b.toLowerCase().includes("bio")));
});

test("Case 13: Prohibits specific chemical dosage on unverified / draft records", async () => {
  const blastJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible",
    candidates: [
      {
        id: "paddy_blast",
        commonName: "Rice Blast",
        nameTe: "వరి అగ్గితెగులు",
        scientificName: "Magnaporthe oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "Spindle spots.",
      },
    ],
  });

  const res = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "en",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case13-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: blastJson }] } }],
        }),
      }),
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.diagnosis.isChemicalVerified, false);
  assert.equal(res.body.diagnosis.dosage, "Confirm with Mandal AEO before purchase");
  assert.doesNotMatch(res.body.diagnosis.dosage, /\d+\s*(ml|g|kg)\s*\/\s*(acre|litre)/i);
});

test("Case 14: Rate-limit enforcement returns HTTP 429", async () => {
  resetRateLimits();
  const testIp = "rate-limit-test-ip-999";

  // Execute 10 permitted calls
  for (let i = 0; i < 10; i++) {
    const res = await runDiagnosisPipeline(
      {
        crop: "Paddy",
        symptoms: "Leaf spots",
        image: VALID_LEAF_IMAGE,
      },
      {
        clientIp: testIp,
        apiKey: "", // test fast local path
      }
    );
    assert.equal(res.status, 200, `Call ${i + 1} should succeed`);
  }

  // 11th call must be blocked with HTTP 429
  const blockedRes = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      symptoms: "Leaf spots",
      image: VALID_LEAF_IMAGE,
    },
    {
      clientIp: testIp,
      apiKey: "",
    }
  );

  assert.equal(blockedRes.status, 429);
  assert.equal(blockedRes.body.status, "rate_limited");
  assert.equal(blockedRes.body.errorKey, "RATE_LIMITED");
  assert.ok(blockedRes.body.resetSeconds && blockedRes.body.resetSeconds > 0);
  assert.match(blockedRes.body.error, /Rate limit reached|10 diagnostic requests/i);

  // Clean up
  resetRateLimits();
});

test("Case 15: Telugu and English bilingual rendering of results", async () => {
  const blastJson = JSON.stringify({
    isPlant: true,
    cropConsistency: "consistent",
    status: "possible",
    candidates: [
      {
        id: "paddy_blast",
        commonName: "Rice Blast",
        nameTe: "వరి అగ్గితెగులు",
        scientificName: "Magnaporthe oryzae",
        type: "fungal",
        confidenceLevel: "Possible diagnosis",
        symptomsSeen: "ఆకులపై నూలుకండె ఆకారపు మచ్చలు ఏర్పడ్డాయి.",
      },
    ],
  });

  const resTe = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VALID_LEAF_IMAGE,
      lang: "te",
    },
    {
      apiKey: MOCK_API_KEY,
      clientIp: "case15-ip",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: blastJson }] } }],
        }),
      }),
    }
  );

  assert.equal(resTe.status, 200);
  const candidate = resTe.body.candidates[0];
  assert.match(candidate.nameTe, /అగ్గితెగులు/);
  assert.match(candidate.management.chemicalNoticeTe, /మండల వ్యవసాయ విస్తరణ అధికారి|AEO|CIB&RC/i);
});

test("Case 16: Safety & validation regression: confirms Phase A and Phase B protections intact", async () => {
  // Severe underexposure rejected before inference
  const darkRes = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: VERY_DARK_IMAGE,
      lang: "en",
    },
    {
      clientIp: "case16-ip",
    }
  );

  assert.equal(darkRes.status, 400);
  assert.equal(darkRes.body.status, "validation_failed");
  assert.equal(darkRes.body.errorKey, "IMAGE_TOO_DARK");

  // Corrupted base64 rejected
  const corruptRes = await runDiagnosisPipeline(
    {
      crop: "Paddy",
      image: CORRUPTED_IMAGE,
      lang: "en",
    },
    {
      clientIp: "case16-ip",
    }
  );

  assert.equal(corruptRes.status, 400);
  assert.equal(corruptRes.body.status, "validation_failed");
  assert.equal(corruptRes.body.errorKey, "CORRUPT_BASE64");
});
