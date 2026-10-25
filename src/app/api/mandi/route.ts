import { NextResponse } from "next/server";
import { ALL_TELANGANA_MANDI_PRICES } from "@/lib/data/mandiData";
import { MandiPriceItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtParam = searchParams.get("district")?.toLowerCase();
  const cropParam = searchParams.get("crop")?.toLowerCase();
  const varietyParam = searchParams.get("variety")?.toLowerCase();

  const apiKey = process.env.DATA_GOV_IN_API_KEY;

  // 1. If DATA_GOV_IN_API_KEY is configured, try live Agmarknet API
  if (apiKey && apiKey.trim() !== "") {
    try {
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(
        apiKey
      )}&format=json&limit=100&filters%5Bstate%5D=Telangana`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const records = json.records || [];

        if (Array.isArray(records) && records.length > 0) {
          // Map to standard MandiPriceItem format
          const mapped: MandiPriceItem[] = records.map((r: any, idx: number) => {
            const modalPrice = parseFloat(r.modal_price) || 0;
            const minPrice = parseFloat(r.min_price) || modalPrice * 0.95;
            const maxPrice = parseFloat(r.max_price) || modalPrice * 1.05;
            const commodity = r.commodity || "Paddy";
            const isFinePaddy =
              commodity.toLowerCase().includes("paddy") &&
              (r.variety?.toLowerCase().includes("rnr") ||
                r.variety?.toLowerCase().includes("sona") ||
                r.variety?.toLowerCase().includes("bpt") ||
                r.variety?.toLowerCase().includes("fine"));

            return {
              id: `agmarknet-${idx}-${Date.now()}`,
              cropKey: commodity.toLowerCase().includes("paddy")
                ? "paddy"
                : commodity.toLowerCase().includes("cotton")
                ? "cotton"
                : commodity.toLowerCase().includes("maize")
                ? "maize"
                : commodity.toLowerCase().includes("chilli")
                ? "chilli"
                : "other",
              commodityEn: commodity,
              commodityTe: commodity,
              variety: r.variety || "FAQ",
              varietyTe: r.variety || "సాధారణ రకం",
              marketNameEn: `${r.market || "APMC"} Market`,
              marketNameTe: `${r.market || "APMC"} మార్కెట్`,
              districtEn: r.district || "Telangana",
              districtTe: r.district || "తెలంగాణ",
              modalPrice,
              minPrice,
              maxPrice,
              prevPrice: modalPrice,
              changeAmount: 0,
              changePct: 0,
              mspPrice: isFinePaddy ? 2320 : 0,
              govtBonus: isFinePaddy ? 500 : undefined,
              priceDate: r.arrival_date || new Date().toISOString().slice(0, 10),
              unit: "Quintal",
              arrivalsQtl: parseFloat(r.arrivals) || 120,
              distanceKm: 20,
              status: "open",
              mapsQuery: `${r.market || "APMC Market"}, ${r.district || "Telangana"}`,
            };
          });

          return NextResponse.json(
            {
              isLive: true,
              source: "data.gov.in Agmarknet Live Feed",
              notice: "Live Telangana APMC rates synchronized from Agmarknet API.",
              count: mapped.length,
              data: mapped,
            },
            {
              headers: {
                "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
              },
            }
          );
        }
      }
    } catch (e) {
      // Live API error or timeout, will fall back gracefully below
    }
  }

  // 2. Verified Snapshot Fallback (Guaranteed zero crashes, honest labeling)
  let filtered = [...ALL_TELANGANA_MANDI_PRICES];

  if (districtParam && districtParam !== "all") {
    filtered = filtered.filter(
      (m) =>
        m.districtEn.toLowerCase().includes(districtParam) ||
        m.marketNameEn.toLowerCase().includes(districtParam)
    );
  }

  if (cropParam && cropParam !== "all") {
    filtered = filtered.filter(
      (m) =>
        (m.cropKey && m.cropKey.toLowerCase() === cropParam) ||
        m.commodityEn.toLowerCase().includes(cropParam)
    );
  }

  if (varietyParam && varietyParam !== "all") {
    filtered = filtered.filter(
      (m) =>
        m.varietyKey?.toLowerCase() === varietyParam ||
        m.variety.toLowerCase().includes(varietyParam)
    );
  }

  return NextResponse.json(
    {
      isLive: false,
      source: "APMC Daily Market Bulletin Snapshot (25 Oct 2026)",
      notice: apiKey
        ? "Agmarknet live upstream temporarily unreachable. Showing verified APMC snapshot."
        : "Using verified APMC daily bulletin snapshot. Configure DATA_GOV_IN_API_KEY in environment variables for direct live Agmarknet sync.",
      count: filtered.length,
      data: filtered,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    }
  );
}
