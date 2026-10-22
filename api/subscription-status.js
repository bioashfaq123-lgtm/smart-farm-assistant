// Vercel serverless function: returns subscription and trial status for the current user
const {
  verifyAuthToken,
  getUserSubscription,
  PLAN_PRICE_PAISE,
  PLAN_MONTHS,
  TRIAL_DAYS,
  DEMO_MODE_PUBLIC
} = require("./_auth");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  try {
    const token = await verifyAuthToken(req);

    if (!token) {
      return res.status(200).json({
        loggedIn: false,
        demoModePublic: DEMO_MODE_PUBLIC,
        hasAccess: DEMO_MODE_PUBLIC,
        status: DEMO_MODE_PUBLIC ? "public_demo" : "anonymous",
        planPricePaise: PLAN_PRICE_PAISE,
        planMonths: PLAN_MONTHS,
        trialDaysTotal: TRIAL_DAYS
      });
    }

    const sub = await getUserSubscription(token.uid, token.email, token.name || token.displayName);

    return res.status(200).json({
      loggedIn: true,
      ...sub,
      planPricePaise: PLAN_PRICE_PAISE,
      planMonths: PLAN_MONTHS,
      trialDaysTotal: TRIAL_DAYS
    });
  } catch (err) {
    console.error("subscription-status error:", err);
    return res.status(500).json({ error: "Failed to fetch subscription status." });
  }
};
