/**
 * Smart Farm Crop Disease Diagnosis — Deployment-Compatible Rate Limiter
 * 
 * In-memory sliding-window bucket limiter with lazy garbage collection.
 * Avoids dangling setInterval timers to remain safe in serverless environments.
 */

export interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  status: number;
  resetSeconds?: number;
  messageEn?: string;
  messageTe?: string;
  remainingShortTerm?: number;
  remainingDaily?: number;
}

const ipMinuteBuckets = new Map<string, RateLimitRecord>();
const ipDailyBuckets = new Map<string, RateLimitRecord>();

export const DEFAULT_LIMITS = {
  PER_10_MINUTES: 10,
  DAILY_CAP: 40,
};

/**
 * Lazy cleanup of expired bucket keys to avoid memory leaks
 */
function cleanupExpiredRecords(now: number) {
  if (ipMinuteBuckets.size > 2000) {
    ipMinuteBuckets.forEach((record, key) => {
      if (now > record.resetTime) ipMinuteBuckets.delete(key);
    });
  }
  if (ipDailyBuckets.size > 2000) {
    ipDailyBuckets.forEach((record, key) => {
      if (now > record.resetTime) ipDailyBuckets.delete(key);
    });
  }
}

/**
 * Checks rate limit for a client IP
 */
export function checkRateLimit(
  ip = "anonymous",
  userId: string | null = null,
  customLimits = DEFAULT_LIMITS
): RateLimitCheckResult {
  const now = Date.now();
  cleanupExpiredRecords(now);

  const safeIp = String(ip || "anonymous").replace(/[^a-zA-Z0-9.:_-]/g, "");

  // 1. 10-Minute Sliding Window
  let minRec = ipMinuteBuckets.get(safeIp);
  if (!minRec || now > minRec.resetTime) {
    minRec = { count: 0, resetTime: now + 10 * 60 * 1000 };
    ipMinuteBuckets.set(safeIp, minRec);
  }

  if (minRec.count >= customLimits.PER_10_MINUTES) {
    const sec = Math.ceil((minRec.resetTime - now) / 1000);
    return {
      allowed: false,
      status: 429,
      resetSeconds: sec,
      messageEn: `Diagnosis rate limit reached (${customLimits.PER_10_MINUTES} requests per 10 minutes). Please wait ${sec} seconds before trying another photo.`,
      messageTe: `నిర్ధారణ పరిమితి ముగిసింది (10 నిమిషాలకు ${customLimits.PER_10_MINUTES} ఫోటోలు మాత్రమే). దయచేసి మరో ${sec} సెకన్ల తర్వాత ప్రయత్నించండి.`,
    };
  }

  // 2. 24-Hour Daily Cap
  let dayRec = ipDailyBuckets.get(safeIp);
  if (!dayRec || now > dayRec.resetTime) {
    dayRec = { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
    ipDailyBuckets.set(safeIp, dayRec);
  }

  if (dayRec.count >= customLimits.DAILY_CAP) {
    const sec = Math.ceil((dayRec.resetTime - now) / 1000);
    const hrs = Math.ceil((dayRec.resetTime - now) / 3600000);
    return {
      allowed: false,
      status: 429,
      resetSeconds: sec,
      messageEn: `Daily diagnosis limit of ${customLimits.DAILY_CAP} requests reached. Resets in approximately ${hrs} hours.`,
      messageTe: `రోజువారీ ${customLimits.DAILY_CAP} నిర్ధారణల గరిష్ట పరిమితి ముగిసింది. సుమారు ${hrs} గంటల తర్వాత మళ్ళీ ప్రయత్నించవచ్చు.`,
    };
  }

  // Increment counters
  minRec.count++;
  dayRec.count++;

  return {
    allowed: true,
    status: 200,
    remainingShortTerm: Math.max(0, customLimits.PER_10_MINUTES - minRec.count),
    remainingDaily: Math.max(0, customLimits.DAILY_CAP - dayRec.count),
  };
}

/**
 * Helper for testing: resets internal buckets
 */
export function resetRateLimiter() {
  ipMinuteBuckets.clear();
  ipDailyBuckets.clear();
}

export const resetRateLimits = resetRateLimiter;
