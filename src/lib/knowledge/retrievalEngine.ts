import { AGRICULTURAL_KNOWLEDGE_STORE } from "./knowledgeStore";
import { VERIFIED_PESTICIDES, validateChemicalRecommendation } from "./pesticideRegistry";
import {
  computeSourceGroundedFertilizer,
  VERIFIED_FERTILIZER_SCHEDULES,
  DetailedFertilizerReport,
} from "./fertilizerRegistry";
import {
  KnowledgeRecord,
  KnowledgeSearchFilter,
  KnowledgeSearchResult,
  PesticideLabel,
} from "./types";

/**
 * Transliteration & Synonym Lexicon
 * Bridges colloquial English / transliterated Telugu / Romanized crop & pest terms to Telugu keywords.
 */
const TRANSLITERATION_MAP: Record<string, string[]> = {
  paddy: ["వరి", "rice", "dhan", "vari"],
  cotton: ["పత్తి", "kapas", "patti"],
  chilli: ["మిరప", "mirapa", "mirchi", "chili"],
  maize: ["మొక్కజొన్న", "makka", "corn", "mokkajonna"],
  redgram: ["కంది", "tur", "pigeonpea", "kandi"],
  groundnut: ["వేరుశెనగ", "verusenaga", "peanut"],
  turmeric: ["పసుపు", "pasupu", "haldi"],
  blast: ["అగ్గితెగులు", "aggi thegulu", "neck blast", "pyricularia"],
  "stem borer": ["కాండం తొలిచే పురుగు", "kandam tholuche", "dead heart", "white ear"],
  bph: ["సుడిదోమ", "sudi doma", "brown planthopper", "hopper burn"],
  "leaf folder": ["ఆకుచుట్టు పురుగు", "aakuchuttu", "leaf roller"],
  "pink bollworm": ["గులాబీ రంగు పురుగు", "gulabi rangu purugu", "rosette flower"],
  "fall armyworm": ["కత్తెర పురుగు", "kathera purugu", "spodoptera"],
  thrips: ["తామర పురుగులు", "thamara purugulu", "పైముడత", "leaf curl"],
  mites: ["నల్లి", "nalli", "కిందిముడత", "yellow mites"],
  urea: ["యూరియా", "nitrogen", "నత్రజని"],
  dap: ["డిఎపి", "భాస్వరం", "phosphorus", "immobile"],
  potash: ["పొటాష్", "mop", "k2o"],
  zinc: ["జింక్", "ఖైరా తెగులు", "khaira", "zinc sulphate"],
  weeds: ["కలుపు", "kalupu", "pretilachlor", "nominee gold", "herbicide"],
  drone: ["డ్రోన్", "drone spraying", "kisan drone", "ulv"],
  trichoderma: ["ట్రైకోడెర్మా", "trichoderma viride", "trichoderma harzianum", "bio-fungicide", "జీవ శిలీంద్ర"],
  pseudomonas: ["సూడోమోనాస్", "pseudomonas fluorescens", "bio bactericide", "జీవ బాక్టీరియా"],
  neem: ["వేప", "neem oil", "nske", "azadirachtin", "వేప నూనె", "వేప కషాయం", "botanical"],
  biocontrol: ["జీవ నియంత్రణ", "biological control", "bio control", "మిత్రపురుగులు"],
};

/**
 * Hybrid Agricultural Retrieval Engine
 */
export function searchKnowledgeBase(filter: KnowledgeSearchFilter): KnowledgeSearchResult {
  const query = (filter.query || "").trim().toLowerCase();
  const targetCrop = (filter.crop || "").trim().toLowerCase();
  const limit = filter.limit || 5;

  // 1. Expand query terms using transliteration & synonym map
  const queryTokens = query.split(/\s+/).filter(Boolean);
  const expandedTokens = new Set<string>(queryTokens);

  for (const [key, synonyms] of Object.entries(TRANSLITERATION_MAP)) {
    if (query.includes(key) || synonyms.some((s) => query.includes(s.toLowerCase()))) {
      expandedTokens.add(key);
      synonyms.forEach((s) => expandedTokens.add(s.toLowerCase()));
    }
  }

  // 2. Score and rank records
  const scoredRecords: Array<{ record: KnowledgeRecord; score: number }> = [];

  for (const record of AGRICULTURAL_KNOWLEDGE_STORE) {
    // Crop filter
    if (targetCrop && targetCrop !== "all" && targetCrop !== "general") {
      const recCrop = record.crop.toLowerCase();
      if (
        recCrop !== "general" &&
        recCrop !== "all" &&
        !recCrop.includes("all") &&
        !recCrop.includes(targetCrop) &&
        !targetCrop.includes(recCrop)
      ) {
        continue; // Skip irrelevant crop records
      }
    }

    // Category filter
    if (filter.category && record.category !== filter.category) {
      continue;
    }

    // Verified only filter
    if (filter.verifiedOnly && record.qualityStatus !== "verified_agricultural_record") {
      continue;
    }

    let score = 0;
    const recTitle = record.title.toLowerCase();
    const recTelugu = record.originalTeluguText.toLowerCase();
    const recEnglish = record.englishText.toLowerCase();
    const recKeywords = record.keywords.map((k) => k.toLowerCase());

    // Exact full query match
    if (query && (recTitle.includes(query) || recEnglish.includes(query) || recTelugu.includes(query))) {
      score += 50;
    }

    // Token & synonym matching
    expandedTokens.forEach((token) => {
      if (!token) return;
      if (recTitle.includes(token)) score += 15;
      if (recKeywords.some((k) => k.includes(token))) score += 12;
      if (recEnglish.includes(token)) score += 6;
      if (recTelugu.includes(token)) score += 6;
    });

    // Source priority weighting (CIBRC Statutory > PJTAU Recent Magazine > Diksoochi Baseline)
    // IMPORTANT: Only boost priority if there was an actual query relevance match (score > 0)!
    if (score > 0) {
      if (record.citation.sourcePriority === "pjtau_magazine_recent") {
        score += 4; // Recent field advisory boost
      } else if (record.citation.sourcePriority === "cibrc_statutory") {
        score += 8; // Statutory regulatory priority
      }
      scoredRecords.push({ record, score });
    } else if (!query) {
      scoredRecords.push({ record, score: 1 });
    }
  }

  // If crop-specific search found no matches, perform second pass across all crops for cross-crop agronomic topics
  if (scoredRecords.length === 0 && query && targetCrop && targetCrop !== "all" && targetCrop !== "general") {
    return searchKnowledgeBase({ ...filter, crop: "all" });
  }

  // Sort descending by score
  scoredRecords.sort((a, b) => b.score - a.score);
  const matchedRecords = scoredRecords.slice(0, limit).map((s) => s.record);

  // 3. Match Verified Pesticide Labels
  const verifiedChemicals: PesticideLabel[] = [];
  if (query) {
    for (const pesticide of VERIFIED_PESTICIDES) {
      const pActive = pesticide.activeIngredient.toLowerCase();
      const pTrade = pesticide.commonBrands.map((b) => b.toLowerCase());
      const pPests = pesticide.targetPestsOrDiseases.map((t) => t.toLowerCase());
      const pCrops = pesticide.approvedCrops.map((c) => c.toLowerCase());

      const cropMatches = !targetCrop || targetCrop === "all" || pCrops.some((c) => c.includes(targetCrop) || targetCrop.includes(c));
      const pestOrKeywordMatches =
        Array.from(expandedTokens).some(
          (token) =>
            pActive.includes(token) ||
            pTrade.some((b) => b.includes(token)) ||
            pPests.some((t) => t.includes(token))
        );

      if (cropMatches && pestOrKeywordMatches) {
        verifiedChemicals.push(pesticide);
      }
    }
  }

  // 4. Check if Fertilizer Schedule is applicable
  let groundedFertilizer: DetailedFertilizerReport | undefined;
  const isFertilizerQuery =
    expandedTokens.has("urea") ||
    expandedTokens.has("dap") ||
    expandedTokens.has("potash") ||
    expandedTokens.has("యూరియా") ||
    expandedTokens.has("fertilizer") ||
    query.includes("fertilizer") ||
    query.includes("dosage") ||
    query.includes("ఎరువులు") ||
    filter.category === "fertilizer_recommendation";

  if (isFertilizerQuery) {
    const cropKey = targetCrop.charAt(0).toUpperCase() + targetCrop.slice(1);
    groundedFertilizer = computeSourceGroundedFertilizer({
      crop: VERIFIED_FERTILIZER_SCHEDULES[cropKey] ? cropKey : "Paddy",
      area: 1,
      unit: "acre",
    });
  }

  return {
    records: matchedRecords,
    totalMatches: scoredRecords.length,
    verifiedChemicals,
    groundedFertilizer,
    queryExplanation: `Retrieved ${matchedRecords.length} verified PJTAU records and ${verifiedChemicals.length} statutory chemical labels.`,
  };
}

/**
 * Formats a verified knowledge citation block for chat / advisory UI.
 */
export function formatCitationFooter(record: KnowledgeRecord): string {
  const c = record.citation;
  return `📖 *ఆధార గ్రంథం / Source Reference:* [${c.documentTitle} (${c.publicationMonthYear}) — PDF Page ${c.pdfPage}, Printed Page ${c.printedPage}]`;
}
