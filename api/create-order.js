// Vercel serverless function: creates a Razorpay order for subscription payment
const {
  verifyAuthToken,
  getUserSubscription,
  PLAN_PRICE_PAISE,
  PLAN_MONTHS
} = require("./_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. POST only." });
  }

  const token = await verifyAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please sign in with Google." });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Razorpay payment keys are not configured on the server." });
  }

  try {
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const receiptId = `rcpt_${token.uid.slice(0, 8)}_${Date.now().toString().slice(-6)}`;

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`
      },
      body: JSON.stringify({
        amount: PLAN_PRICE_PAISE,
        currency: "INR",
        receipt: receiptId,
        notes: {
          uid: token.uid,
          email: token.email || "",
          plan: `smart_farm_${PLAN_MONTHS}_months`
        }
      })
    });

    const orderData = await rzpResponse.json();

    if (!rzpResponse.ok) {
      console.error("Razorpay order creation error:", orderData);
      return res.status(502).json({
        error: orderData.error?.description || "Failed to create Razorpay order."
      });
    }

    // Return ONLY public details to browser (order_id and public key_id, NEVER secret)
    return res.status(200).json({
      order_id: orderData.id,
      key_id: keyId,
      amount: PLAN_PRICE_PAISE,
      currency: "INR",
      plan_months: PLAN_MONTHS
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Internal server error while creating payment order." });
  }
};
