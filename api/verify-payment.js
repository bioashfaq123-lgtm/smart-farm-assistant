// Vercel serverless function: verifies Razorpay payment signature and idempotently activates plan
const crypto = require("crypto");
const {
  verifyAuthToken,
  recordPaymentAndExtendPlan,
  secureCompare,
  PLAN_PRICE_PAISE
} = require("./_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. POST only." });
  }

  const token = await verifyAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please sign in with Google." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing required payment verification parameters." });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: "Server payment configuration missing." });
  }

  try {
    // Generate expected HMAC SHA-256 signature
    const textToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(textToSign)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    const isValid = secureCompare(expectedSignature, razorpay_signature);
    if (!isValid) {
      console.warn("Invalid payment signature detected for user:", token.uid);
      return res.status(400).json({ error: "Invalid payment signature. Payment verification failed." });
    }

    // Signature verified! Idempotently activate or extend plan
    const result = await recordPaymentAndExtendPlan(token.uid, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: PLAN_PRICE_PAISE,
      currency: "INR"
    });

    return res.status(200).json({
      success: true,
      message: result.alreadyProcessed
        ? "Payment was already applied to your subscription."
        : "Subscription plan successfully activated!",
      newPlanEnd: result.newPlanEnd,
      alreadyProcessed: result.alreadyProcessed
    });
  } catch (err) {
    console.error("Payment verification processing error:", err);
    return res.status(500).json({ error: "Failed to record and activate subscription plan." });
  }
};
