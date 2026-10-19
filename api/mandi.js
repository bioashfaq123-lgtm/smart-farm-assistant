// Vercel serverless function: live mandi prices from data.gov.in (Agmarknet daily prices).
// Get a free key at https://data.gov.in and set DATA_GOV_API_KEY in Vercel environment variables.
const RESOURCE = process.env.MANDI_RESOURCE_ID || "9ef84268-d588-465a-a308-a864a43d0070";
const ALIASES = {
  Paddy: ["Paddy(Common)", "Paddy(Dhan)(Common)"],
  Maize: ["Maize"],
  Cotton: ["Cotton"],
  Chilli: ["Green Chilli", "Dry Chillies", "Chilli Red"],
  Sesame: ["Sesamum(Sesame,Gingelly,Til)", "Sesame"],
  Groundnut: ["Groundnut"],
  Redgram: ["Arhar (Tur/Red Gram)(Whole)", "Red Gram"],
  Soybean: ["Soyabean", "Soybean"]
};
let cache = {}; // last good copy per crop

module.exports = async (req, res) => {
  const crop = req.query.crop || "Paddy";
  const key = process.env.DATA_GOV_API_KEY;
  if (!key) return res.status(200).json({ rows: cache[crop] || [], reason: "no_key", note: "DATA_GOV_API_KEY not set" });

  const candidates = ALIASES[crop] || [crop];
  const buildUrl = (commodity, stateField) =>
    `https://api.data.gov.in/resource/${RESOURCE}?api-key=${key}&format=json&limit=30` +
    `&filters%5B${encodeURIComponent(stateField)}%5D=Telangana&filters%5Bcommodity%5D=${encodeURIComponent(commodity)}`;

  try {
    let records = [];
    for (const commodity of candidates) {
      let r = await fetch(buildUrl(commodity, "state.keyword"));
      let j = r.ok ? await r.json() : null;

      if (!j || !j.records || j.records.length === 0) {
        let r2 = await fetch(buildUrl(commodity, "state"));
        if (r2.ok) {
          let j2 = await r2.json();
          if (j2 && j2.records && j2.records.length > 0) j = j2;
        }
      }

      if (j && j.records && j.records.length > 0) {
        records = j.records;
        break;
      }
    }

    const rows = records.map(x => {
      const mkt = (x.market || x.Market || "Mandi").trim();
      const dt = (x.arrival_date || x.Arrival_Date || "").trim();
      const variety = (x.variety || x.Variety || "Standard").trim();
      const vg = [variety, x.grade || x.Grade].filter(Boolean).filter(v => v !== "Other").join(" · ");
      const meta = [vg, dt].filter(Boolean).join(" · ");
      return [
        mkt,
        x.min_price || x.Min_Price,
        x.max_price || x.Max_Price,
        x.modal_price || x.Modal_Price,
        meta,
        variety
      ];
    });

    if (rows.length) cache[crop] = rows;
    res.setHeader("Cache-Control", "s-maxage=1800");
    const hasData = rows.length > 0 || (cache[crop] && cache[crop].length > 0);
    res.status(200).json({
      rows: rows.length ? rows : (cache[crop] || []),
      reason: rows.length ? "live" : (cache[crop] ? "cache" : "no_arrivals")
    });
  } catch (e) {
    res.status(200).json({ rows: cache[crop] || [], reason: "error", note: String(e.message || e) });
  }
};
