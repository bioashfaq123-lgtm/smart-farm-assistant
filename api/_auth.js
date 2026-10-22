// Shared authentication and subscription helper for Vercel serverless functions
const admin = require("firebase-admin");
const crypto = require("crypto");

let firebaseApp = null;

/**
 * Initializes and returns the Firebase Admin SDK singleton.
 * Reads credentials strictly from process.env.FIREBASE_SERVICE_ACCOUNT (JSON string or base64 encoded).
 */
function getFirebaseAdmin() {
  if (firebaseApp) return admin;
  if (admin.apps.length > 0) {
    firebaseApp = admin.app();
    return admin;
  }

  const rawSa = process.env.FIREBASE_SERVICE_ACCOUNT;
  const dbUrl = process.env.FIREBASE_DATABASE_URL || process.env.DB_URL;

  if (!rawSa) {
    console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    return null;
  }

  try {
    let serviceAccount;
    const trimmed = rawSa.trim();
    if (trimmed.startsWith("{")) {
      serviceAccount = JSON.parse(trimmed);
    } else {
      // Decode base64
      const decoded = Buffer.from(trimmed, "base64").toString("utf8");
      serviceAccount = JSON.parse(decoded);
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: dbUrl || (serviceAccount.project_id ? `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com` : undefined)
    });
    return admin;
  } catch (err) {
    console.error("Failed to initialize Firebase Admin SDK:", err.message);
    return null;
  }
}

// Configurable constants with defaults
const PLAN_PRICE_PAISE = parseInt(process.env.PLAN_PRICE_PAISE, 10) || 49900;
const PLAN_MONTHS = parseInt(process.env.PLAN_MONTHS, 10) || 6;
const TRIAL_DAYS = parseInt(process.env.TRIAL_DAYS, 10) || 14;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const DEMO_EMAILS = (process.env.DEMO_EMAILS || "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);
const DEMO_MODE_PUBLIC = (process.env.DEMO_MODE_PUBLIC || "").trim().toLowerCase() === "true";

/**
 * Adds calendar months to a timestamp, handling edge cases like month-end days.
 */
function addCalendarMonths(fromTimestamp, months) {
  const d = new Date(fromTimestamp);
  const targetMonth = d.getMonth() + months;
  const originalDate = d.getDate();
  d.setMonth(targetMonth);
  // Handle edge case where target month has fewer days (e.g. Aug 31 -> Sep 30)
  if (d.getDate() < originalDate) {
    d.setDate(0);
  }
  return d.getTime();
}

/**
 * Extracts and verifies the Firebase ID token from the Authorization header.
 * Returns decoded token or null.
 */
async function verifyAuthToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  const idToken = authHeader.split("Bearer ")[1].trim();
  if (!idToken) return null;

  const adm = getFirebaseAdmin();
  if (!adm) return null;

  try {
    const decodedToken = await adm.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (err) {
    console.warn("Firebase token verification failed:", err.message);
    return null;
  }
}

/**
 * Gets or initializes the user subscription in Firebase Realtime Database.
 * The trial starts at the user's first Google login and is recorded on the server clock.
 */
async function getUserSubscription(uid, email = "", displayName = "") {
  const adm = getFirebaseAdmin();
  const normalizedEmail = (email || "").toLowerCase();
  const isOwner = !!(ADMIN_EMAIL && normalizedEmail === ADMIN_EMAIL);
  const isDemo = DEMO_EMAILS.includes(normalizedEmail);
  const isExempt = isOwner || isDemo;

  if (!adm) {
    // If Admin SDK is not yet configured, return fallback state
    return {
      uid,
      email,
      displayName,
      status: DEMO_MODE_PUBLIC || isExempt ? "active" : "trial_active",
      trialStart: Date.now(),
      trialEnd: Date.now() + TRIAL_DAYS * 86400000,
      trialDaysLeft: TRIAL_DAYS,
      planStart: null,
      planEnd: null,
      planDaysLeft: 0,
      isSubscribed: isExempt,
      hasAccess: true,
      isOwner,
      isExempt,
      demoModePublic: DEMO_MODE_PUBLIC,
      payments: {}
    };
  }

  const db = adm.database();
  const subRef = db.ref(`subscriptions/${uid}`);
  const snap = await subRef.once("value");
  let sub = snap.val();

  const now = Date.now();

  // First Google login: initialize 14-day trial on server
  if (!sub) {
    const trialStart = now;
    const trialEnd = trialStart + TRIAL_DAYS * 24 * 60 * 60 * 1000;
    sub = {
      uid,
      email: normalizedEmail,
      displayName: displayName || "",
      firstLoginAt: now,
      trialStart,
      trialEnd,
      planStart: null,
      planEnd: null,
      status: "trial_active",
      updatedAt: now,
      payments: {}
    };
    await subRef.set(sub);
  } else {
    // Keep email/displayName fresh if changed
    if ((normalizedEmail && sub.email !== normalizedEmail) || (displayName && sub.displayName !== displayName)) {
      sub.email = normalizedEmail || sub.email;
      sub.displayName = displayName || sub.displayName;
      sub.updatedAt = now;
      await subRef.update({ email: sub.email, displayName: sub.displayName, updatedAt: now });
    }
  }

  // Determine current active status
  let status = "trial_active";
  const planActive = sub.planEnd && sub.planEnd > now;
  const trialActive = sub.trialEnd && sub.trialEnd > now;

  if (planActive) {
    status = "active";
  } else if (sub.planEnd && sub.planEnd <= now) {
    status = "expired";
  } else if (trialActive) {
    status = "trial_active";
  } else {
    status = "trial_expired";
  }

  const trialDaysLeft = sub.trialEnd ? Math.max(0, Math.ceil((sub.trialEnd - now) / 86400000)) : 0;
  const planDaysLeft = sub.planEnd ? Math.max(0, Math.ceil((sub.planEnd - now) / 86400000)) : 0;
  const hasAccess = isExempt || DEMO_MODE_PUBLIC || planActive || trialActive;

  return {
    uid,
    email: sub.email || normalizedEmail,
    displayName: sub.displayName || displayName,
    status,
    trialStart: sub.trialStart,
    trialEnd: sub.trialEnd,
    trialDaysLeft,
    planStart: sub.planStart,
    planEnd: sub.planEnd,
    planDaysLeft,
    isSubscribed: planActive || isExempt,
    hasAccess,
    isOwner,
    isExempt,
    demoModePublic: DEMO_MODE_PUBLIC,
    payments: sub.payments || {}
  };
}

/**
 * Idempotently activates or extends a subscription for a given payment.
 * New plan end = later of (now, current plan end) plus PLAN_MONTHS calendar months.
 */
async function recordPaymentAndExtendPlan(uid, paymentData) {
  const adm = getFirebaseAdmin();
  if (!adm) throw new Error("Firebase Admin SDK not initialized.");

  const db = adm.database();
  const subRef = db.ref(`subscriptions/${uid}`);
  const snap = await subRef.once("value");
  let sub = snap.val() || { uid, trialStart: Date.now(), trialEnd: Date.now() };

  sub.payments = sub.payments || {};

  const paymentId = paymentData.paymentId || paymentData.id;
  if (!paymentId) throw new Error("Missing paymentId");

  // Idempotency: if payment already recorded, do not extend twice!
  if (sub.payments[paymentId] && sub.payments[paymentId].status === "captured") {
    return {
      alreadyProcessed: true,
      sub
    };
  }

  const now = Date.now();
  const baseTime = (sub.planEnd && sub.planEnd > now) ? sub.planEnd : now;
  const newPlanEnd = addCalendarMonths(baseTime, PLAN_MONTHS);
  const newPlanStart = sub.planStart && sub.planEnd && sub.planEnd > now ? sub.planStart : now;

  const paymentRecord = {
    orderId: paymentData.orderId || "",
    paymentId: paymentId,
    amount: paymentData.amount || PLAN_PRICE_PAISE,
    currency: paymentData.currency || "INR",
    status: "captured",
    createdAt: now,
    planExtendedUntil: newPlanEnd
  };

  sub.payments[paymentId] = paymentRecord;
  sub.planStart = newPlanStart;
  sub.planEnd = newPlanEnd;
  sub.status = "active";
  sub.updatedAt = now;

  await subRef.set(sub);

  return {
    alreadyProcessed: false,
    newPlanEnd,
    sub
  };
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
function secureCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  getFirebaseAdmin,
  verifyAuthToken,
  getUserSubscription,
  recordPaymentAndExtendPlan,
  addCalendarMonths,
  secureCompare,
  PLAN_PRICE_PAISE,
  PLAN_MONTHS,
  TRIAL_DAYS,
  ADMIN_EMAIL,
  DEMO_EMAILS,
  DEMO_MODE_PUBLIC
};
