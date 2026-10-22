// Vercel serverless function: Razorpay Webhook listener
// Verifies X-Razorpay-Signature against raw body using RAZORPAY_WEBHOOK_SECRET
// Handles payment.captured and order.paid idempotently
const crypto = require("crypto");
const {
  recordPaymentAndExtendPlan,
  secureCompare,
  PLAN_PRICE_PAISE
} = require("./_auth");

// CRITICAL FOR VERCEL: Disable body parser so we can read exact raw binary/text chunks
// This ensures HMAC SHA-256 signature calculation matches Razorpay's hash exactly
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(req.body)) return resolve(req.body);
    if (typeof req.body === "string") return resolve(Buffer.from(req.body, "utf8"));

    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", err => reject(err));
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. POST only." });
  }

  const signature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing webhook signature or RAZORPAY_WEBHOOK_SECRET");
    return res.status(400).json({ error: "Missing webhook configuration or signature." });
  }

  try {
    const rawBodyBuffer = await getRawBody(req);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBodyBuffer)
      .digest("hex");

    const isValid = secureCompare(expectedSignature, signature);
    if (!isValid) {
      console.warn("Forged or invalid Razorpay webhook signature rejected.");
      return res.status(400).json({ error: "Invalid webhook signature." });
    }

    const payload = JSON.parse(rawBodyBuffer.toString("utf8"));
    const event = payload.event;
    console.log(`Razorpay webhook received event: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      // Extract user UID from notes
      const uid = paymentEntity?.notes?.uid || orderEntity?.notes?.uid;
      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const amount = paymentEntity?.amount || orderEntity?.amount_paid || PLAN_PRICE_PAISE;

      if (!uid) {
        console.warn("Webhook event missing user uid in notes:", event);
        return res.status(200).json({ status: "ignored_missing_uid" });
      }

      if (paymentId) {
        const result = await recordPaymentAndExtendPlan(uid, {
          paymentId,
          orderId,
          amount,
          currency: paymentEntity?.currency || "INR"
        });
        console.log(`Webhook successfully processed payment ${paymentId} for uid ${uid}. Already processed: ${result.alreadyProcessed}`);
      }
    }

    // Always acknowledge Razorpay webhooks quickly with 200 OK
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Error processing Razorpay webhook:", err);
    return res.status(500).json({ error: "Failed to process webhook." });
  }
};
