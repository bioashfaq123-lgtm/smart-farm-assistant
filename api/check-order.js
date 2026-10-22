// Vercel serverless function: "I paid but my access is not active" reconciliation endpoint
// Queries Razorpay API directly for order status and activates plan if captured
const {
  verifyAuthToken,
  recordPaymentAndExtendPlan
} = require("./_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. POST only." });
  }

  const token = await verifyAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please sign in with Google." });
  }

  const { orderId } = req.body || {};
  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ error: "Please provide a valid Razorpay Order ID." });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Server payment configuration missing." });
  }

  try {
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    // Fetch order details from Razorpay
    const orderResp = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId.trim())}`, {
      headers: { "Authorization": `Basic ${authString}` }
    });

    if (!orderResp.ok) {
      return res.status(404).json({ error: "Order not found on Razorpay." });
    }

    const order = await orderResp.json();

    // Verify order belongs to the requesting user
    if (order.notes?.uid && order.notes.uid !== token.uid) {
      return res.status(403).json({ error: "Order does not belong to this account." });
    }

    // Fetch payments associated with this order
    const paymentsResp = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId.trim())}/payments`, {
      headers: { "Authorization": `Basic ${authString}` }
    });

    const paymentsData = await paymentsResp.json();
    const paymentsList = paymentsData.items || [];

    const capturedPayment = paymentsList.find(p => p.status === "captured");

    if (capturedPayment) {
      const result = await recordPaymentAndExtendPlan(token.uid, {
        orderId: order.id,
        paymentId: capturedPayment.id,
        amount: capturedPayment.amount,
        currency: capturedPayment.currency || "INR"
      });

      return res.status(200).json({
        success: true,
        activated: true,
        message: result.alreadyProcessed
          ? "Payment was already applied to your account."
          : "Payment verified successfully! Your plan is now active.",
        newPlanEnd: result.newPlanEnd
      });
    }

    const failedPayment = paymentsList.find(p => p.status === "failed");
    if (failedPayment) {
      return res.status(200).json({
        success: false,
        activated: false,
        status: "failed",
        message: `Payment failed (${failedPayment.error_description || "Declined by bank"}). Please retry payment.`
      });
    }

    return res.status(200).json({
      success: false,
      activated: false,
      status: order.status,
      message: `Order status is "${order.status}". No completed payment was found yet.`
    });
  } catch (err) {
    console.error("Order check reconciliation error:", err);
    return res.status(500).json({ error: "Failed to check payment status with Razorpay." });
  }
};
