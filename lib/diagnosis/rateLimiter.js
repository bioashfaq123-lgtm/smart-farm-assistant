// In-memory sliding window rate limiter for diagnosis API
const ipMinuteBuckets = new Map();
const ipDailyBuckets = new Map();
const userDailyBuckets = new Map();

const LIMITS = {
  PER_10_MINUTES: 10,
  DAILY_CAP: 40
};

// Periodic garbage collection every 15 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipMinuteBuckets.entries()) {
    if (now - record.resetTime > 600000) ipMinuteBuckets.delete(key);
  }
  for (const [key, record] of ipDailyBuckets.entries()) {
    if (now - record.resetTime > 86400000) ipDailyBuckets.delete(key);
  }
  for (const [key, record] of userDailyBuckets.entries()) {
    if (now - record.resetTime > 86400000) userDailyBuckets.delete(key);
  }
}, 15 * 60 * 1000);
if (typeof cleanupTimer.unref === "function") cleanupTimer.unref();

function checkRateLimit(ip = "anonymous", userId = null) {
  const now = Date.now();
  const safeIp = String(ip).replace(/[^a-zA-Z0-9.:_-]/g, "");

  // 1. IP 10-Minute window
  let minRec = ipMinuteBuckets.get(safeIp);
  if (!minRec || now > minRec.resetTime) {
    minRec = { count: 0, resetTime: now + 10 * 60 * 1000 };
    ipMinuteBuckets.set(safeIp, minRec);
  }
  if (minRec.count >= LIMITS.PER_10_MINUTES) {
    const sec = Math.ceil((minRec.resetTime - now) / 1000);
    return {
      allowed: false,
      status: 429,
      resetSeconds: sec,
      messageEn: `Diagnosis limit reached (${LIMITS.PER_10_MINUTES} requests per 10 minutes). Please wait ${sec} seconds before diagnosing another photo.`,
      messageTe: `నిర్ధారణ పరిమితి ముగిసింది (10 నిమిషాలకు ${LIMITS.PER_10_MINUTES} ఫోటోలు మాత్రమే). దయచేసి మరో ${sec} సెకన్ల తర్వాత ప్రయత్నించండి.`
    };
  }

  // 2. IP Daily cap
  let dayRec = ipDailyBuckets.get(safeIp);
  if (!dayRec || now > dayRec.resetTime) {
    dayRec = { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
    ipDailyBuckets.set(safeIp, dayRec);
  }
  if (dayRec.count >= LIMITS.DAILY_CAP) {
    const hrs = Math.ceil((dayRec.resetTime - now) / 3600000);
    return {
      allowed: false,
      status: 429,
      resetSeconds: Math.ceil((dayRec.resetTime - now) / 1000),
      messageEn: `Daily diagnosis cap of ${LIMITS.DAILY_CAP} requests reached. Resets in approximately ${hrs} hours.`,
      messageTe: `రోజువారీ ${LIMITS.DAILY_CAP} నిర్ధారణల గరిష్ట పరిమితి ముగిసింది. సుమారు ${hrs} గంటల తర్వాత మళ్ళీ ప్రయత్నించవచ్చు.`
    };
  }

  // 3. User Daily cap (if authenticated)
  if (userId) {
    let uRec = userDailyBuckets.get(userId);
    if (!uRec || now > uRec.resetTime) {
      uRec = { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
      userDailyBuckets.set(userId, uRec);
    }
    if (uRec.count >= LIMITS.DAILY_CAP) {
      const hrs = Math.ceil((uRec.resetTime - now) / 3600000);
      return {
        allowed: false,
        status: 429,
        resetSeconds: Math.ceil((uRec.resetTime - now) / 1000),
        messageEn: `Daily farmer account quota of ${LIMITS.DAILY_CAP} diagnoses reached. Resets in ${hrs} hours.`,
        messageTe: `మీ ఖాతాకు కేటాయించిన రోజువారీ ${LIMITS.DAILY_CAP} నిర్ధారణలు పూర్తయ్యాయి. ${hrs} గంటల తర్వాత మళ్ళీ అందుబాటులోకి వస్తుంది.`
      };
    }
  }

  // Record hit
  minRec.count++;
  dayRec.count++;
  if (userId) {
    userDailyBuckets.get(userId).count++;
  }

  return {
    allowed: true,
    remainingShortTerm: LIMITS.PER_10_MINUTES - minRec.count,
    remainingDaily: LIMITS.DAILY_CAP - dayRec.count
  };
}

module.exports = {
  checkRateLimit,
  LIMITS
};
