// Vercel serverless function: AI Crop Disease Diagnosis with Structured Output, KB Enrichment & Consent Dataset
const {
  verifyAuthToken,
  getUserSubscription,
  getFirebaseAdmin,
  DEMO_MODE_PUBLIC
} = require("./_auth");
const { diagnoseCropPhoto, getSupportedCrops } = require("../lib/diagnosis");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Local dataset file path for offline/local environment fallback
const LOCAL_DATASET_FILE = path.join(process.cwd(), "data", "diagnoses_dataset.json");

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || req.connection?.remoteAddress || "127.0.0.1";
}

async function saveConsentRecord(record) {
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp) {
      const db = adminApp.database();
      await db.ref(`diagnoses_dataset/${record.id}`).set(record);
      return;
    }
  } catch (err) {
    console.warn("Could not save consent record to Firebase:", err.message);
  }

  // Fallback to local file store
  try {
    let list = [];
    if (fs.existsSync(LOCAL_DATASET_FILE)) {
      list = JSON.parse(fs.readFileSync(LOCAL_DATASET_FILE, "utf8") || "[]");
    }
    list.unshift(record);
    if (list.length > 200) list = list.slice(0, 200);
    fs.writeFileSync(LOCAL_DATASET_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (fe) {
    console.warn("Could not write to local dataset file:", fe.message);
  }
}

async function updateFeedbackRecord(id, feedback, correctDisease) {
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp) {
      const db = adminApp.database();
      await db.ref(`diagnoses_dataset/${id}`).update({
        userFeedback: feedback,
        userCorrectDisease: correctDisease || "",
        feedbackTimestamp: Date.now()
      });
      return true;
    }
  } catch (err) {
    console.warn("Could not update feedback in Firebase:", err.message);
  }

  try {
    if (fs.existsSync(LOCAL_DATASET_FILE)) {
      const list = JSON.parse(fs.readFileSync(LOCAL_DATASET_FILE, "utf8") || "[]");
      const item = list.find(x => x.id === id);
      if (item) {
        item.userFeedback = feedback;
        item.userCorrectDisease = correctDisease || "";
        item.feedbackTimestamp = Date.now();
        fs.writeFileSync(LOCAL_DATASET_FILE, JSON.stringify(list, null, 2), "utf8");
        return true;
      }
    }
  } catch (fe) {
    console.warn("Could not update local dataset file:", fe.message);
  }
  return false;
}

async function getDatasetForAdmin() {
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp) {
      const db = adminApp.database();
      const snap = await db.ref("diagnoses_dataset").limitToLast(100).once("value");
      const val = snap.val() || {};
      return Object.values(val).reverse();
    }
  } catch (err) {
    console.warn("Could not read dataset from Firebase:", err.message);
  }

  try {
    if (fs.existsSync(LOCAL_DATASET_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_DATASET_FILE, "utf8") || "[]");
    }
  } catch (e) {
    console.warn("Could not read local dataset file:", e.message);
  }
  return [];
}

async function updateAdminLabel(id, label, notes) {
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp) {
      const db = adminApp.database();
      await db.ref(`diagnoses_dataset/${id}`).update({
        adminLabel: label,
        adminNotes: notes || "",
        adminVerifiedAt: Date.now()
      });
      return true;
    }
  } catch (err) {
    console.warn("Could not update label in Firebase:", err.message);
  }

  try {
    if (fs.existsSync(LOCAL_DATASET_FILE)) {
      const list = JSON.parse(fs.readFileSync(LOCAL_DATASET_FILE, "utf8") || "[]");
      const item = list.find(x => x.id === id);
      if (item) {
        item.adminLabel = label;
        item.adminNotes = notes || "";
        item.adminVerifiedAt = Date.now();
        fs.writeFileSync(LOCAL_DATASET_FILE, JSON.stringify(list, null, 2), "utf8");
        return true;
      }
    }
  } catch (fe) {
    console.warn("Could not update local dataset label:", fe.message);
  }
  return false;
}

module.exports = async (req, res) => {
  const action = req.query.action || "";

  // -------------------------------------------------------------
  // SUB-ENDPOINT: Farmer Feedback Submission
  // -------------------------------------------------------------
  if (action === "feedback" && req.method === "POST") {
    try {
      const { id, feedback, correctDisease } = req.body || {};
      if (!id || !feedback) {
        return res.status(400).json({ error: "id and feedback are required" });
      }
      await updateFeedbackRecord(id, feedback, correctDisease);
      return res.status(200).json({ success: true, message: "Feedback recorded. Thank you for helping improve diagnosis accuracy." });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // -------------------------------------------------------------
  // SUB-ENDPOINT: Admin Dataset Review & Labeling
  // -------------------------------------------------------------
  if (action === "dataset" || action === "label") {
    let token = null;
    try {
      token = await verifyAuthToken(req);
    } catch (e) {}

    let isOwner = false;
    if (token) {
      const sub = await getUserSubscription(token.uid, token.email, token.name);
      isOwner = Boolean(sub && sub.isOwner);
    }

    if (!isOwner && !DEMO_MODE_PUBLIC) {
      return res.status(403).json({ error: "FORBIDDEN", message: "Only the administrator can access the diagnosis dataset." });
    }

    if (action === "dataset" && req.method === "GET") {
      const dataset = await getDatasetForAdmin();
      return res.status(200).json({ success: true, count: dataset.length, dataset });
    }

    if (action === "label" && req.method === "POST") {
      const { id, label, notes } = req.body || {};
      if (!id || !label) {
        return res.status(400).json({ error: "id and label are required" });
      }
      await updateAdminLabel(id, label, notes);
      return res.status(200).json({ success: true, message: "Label updated successfully." });
    }
  }

  // -------------------------------------------------------------
  // MAIN ENDPOINT: Crop Disease Diagnosis
  // -------------------------------------------------------------
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    // 1. Subscription & Trial Enforcement
    let token = null;
    if (!DEMO_MODE_PUBLIC) {
      try {
        token = await verifyAuthToken(req);
      } catch (authErr) {
        console.warn("Auth token check error:", authErr.message);
      }

      if (!token) {
        return res.status(401).json({
          error: "AUTH_REQUIRED",
          message: "Please sign in with Google to access AI crop disease diagnosis."
        });
      }

      let sub = null;
      try {
        sub = await getUserSubscription(token.uid, token.email, token.name);
      } catch (subErr) {
        console.warn("Subscription check error:", subErr.message);
      }

      if (sub && !sub.hasAccess) {
        return res.status(402).json({
          error: "SUBSCRIPTION_REQUIRED",
          message: "Your 14-day free trial has ended. Please subscribe to unlock AI crop disease diagnosis.",
          status: sub.status
        });
      }
    }

    const {
      crop,
      lang = "en",
      image,
      images,
      context = {},
      consentSave = false
    } = req.body || {};

    // Collect images: supports both single `image` and array `images`
    let imageList = [];
    if (Array.isArray(images) && images.length > 0) {
      imageList = images;
    } else if (image) {
      imageList = [image];
    }

    if (imageList.length === 0) {
      return res.status(400).json({ error: "No crop image provided for diagnosis." });
    }

    // Limit to 3 images maximum
    if (imageList.length > 3) {
      imageList = imageList.slice(0, 3);
    }

    // Validate payload size (max 4MB per image base64)
    for (const img of imageList) {
      if (typeof img !== "string" || img.length > 5 * 1024 * 1024) {
        return res.status(413).json({
          error: "IMAGE_TOO_LARGE",
          message: "One or more images exceed the 4MB upload limit. Please use compressed images."
        });
      }
    }

    const clientIp = getClientIp(req);
    const userId = token ? token.uid : null;

    // 2. Execute Structured Diagnosis
    const diagResponse = await diagnoseCropPhoto({
      crop,
      lang,
      images: imageList,
      context,
      ip: clientIp,
      userId
    });

    if (!diagResponse.success) {
      return res.status(diagResponse.status || 500).json({
        error: diagResponse.error,
        message: diagResponse.message,
        resetSeconds: diagResponse.resetSeconds
      });
    }

    const result = diagResponse.result;
    const diagnosisId = "diag_" + Date.now() + "_" + crypto.randomBytes(4).toString("hex");
    result.diagnosisId = diagnosisId;

    // Format human-readable text for backward compatibility with existing UI
    const isTe = (lang === "te" || lang === "Telugu");
    let legacyText = "";
    if (!result.isUnderstood) {
      legacyText = isTe
        ? `⚠️ నిర్ధారణ ఖచ్చితంగా చేయలేకపోయాము:\n${result.notSureReason}\n\nసలహా:\n${result.adviceSummary}`
        : `⚠️ Could not make a definitive diagnosis:\n${result.notSureReason}\n\nAdvice:\n${result.adviceSummary}`;
    } else {
      const top = result.topCandidate;
      const mgmt = top.management || {};
      const cult = (mgmt.cultural || []).map(c => `• ${c}`).join("\n");
      const bio = (mgmt.biological || []).map(b => `• ${b}`).join("\n");
      const chem = (mgmt.chemicalClass || []).map(k => `• ${k}`).join("\n");

      if (isTe) {
        legacyText = `🌿 సమస్య / తెగులు నిర్ధారణ: ${top.nameTe || top.commonName} (${top.scientificName || ""})\nఅంచనా ఖచ్చితత్వం: ${top.confidence === "high" ? "ఎక్కువ (High)" : top.confidence === "medium" ? "మధ్యస్థం (Medium)" : "తక్కువ (Low)"}\n\n` +
          `🔍 కనిపించే లక్షణాలు:\n${top.symptomsSeen}\n\n` +
          `🔬 ఇతర పోలికలతో తేడా (Differential check):\n${top.differentialCheck}\n\n` +
          `🌾 పొలంలో నిర్ధారించుకోవలసిన అంశాలు:\n${top.fieldCheck}\n\n` +
          `🛠️ సస్యరక్షణ & నివారణ చర్యలు (PJTAU ప్రామాణిక పద్ధతులు):\n` +
          `1. సాగు పద్ధతులు (Cultural):\n${cult || "• మండల వ్యవసాయ అధికారి సూచించిన జాగ్రత్తలు పాటించండి."}\n\n` +
          `2. జీవ నియంత్రణ (Biological):\n${bio || "• వేప నూనె లేదా ట్రైకోడెర్మా పిచికారీ చేయండి."}\n\n` +
          `3. రసాయన మందుల తరగతి (Chemical Group Only):\n${chem || "• సిఫారసు చేసిన క్రియాశీల పదార్థ తరగతి మందులు మాత్రమే వాడండి."}\n\n` +
          `⚠️ గమనిక & రక్షణ:\n${mgmt.regulatoryDisclaimer || "సిఫారసు చేసిన మోతాదు లేబుల్ ప్రకారం వాడండి. మాస్క్ మరియు చేతి తొడుగులు ధరించండి."}`;
      } else {
        legacyText = `Likely problem: ${top.commonName} (${top.scientificName})\nDiagnostic confidence: ${top.confidence.toUpperCase()}\n\n` +
          `Visible symptoms in photo:\n${top.symptomsSeen}\n\n` +
          `How to tell apart from similar issues:\n${top.differentialCheck}\n\n` +
          `What to verify in the field:\n${top.fieldCheck}\n\n` +
          `Management (PJTAU / ICAR standard):\n` +
          `1. Cultural controls:\n${cult || "• Follow standard university field hygiene."}\n\n` +
          `2. Biological controls:\n${bio || "• Bio-control agent application."}\n\n` +
          `3. Chemical active ingredient group:\n${chem || "• Consult registered active ingredient class."}\n\n` +
          `Statutory Safety:\n${mgmt.regulatoryDisclaimer || "Use only CIB&RC approved products for this crop. Always follow package label and wear personal protective equipment."}`;
      }
    }

    // 3. Anonymous Dataset Saving on Farmer Consent
    if (consentSave) {
      const anonymousRecord = {
        id: diagnosisId,
        timestamp: Date.now(),
        crop: result.crop,
        context,
        topCauseId: result.topCandidate?.id || "",
        topCauseName: result.topCandidate?.commonName || "",
        confidence: result.confidence,
        isUnderstood: result.isUnderstood,
        // Store thumbnail (first image only, truncated to avoid giant payload)
        imageThumb: imageList[0] ? `data:image/jpeg;base64,${imageList[0]}` : null,
        userFeedback: null,
        userCorrectDisease: null,
        adminLabel: null
      };
      saveConsentRecord(anonymousRecord).catch(err => console.warn("Failed background consent save:", err.message));
    }

    return res.status(200).json({
      success: true,
      text: legacyText,
      result
    });
  } catch (e) {
    console.error("Diagnose unhandled error:", e);
    return res.status(500).json({ error: String(e.message || e) });
  }
};
