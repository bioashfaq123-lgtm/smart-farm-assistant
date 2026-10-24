// Knowledge Base helper for crop disease diagnosis
const fs = require("fs");
const path = require("path");

let cachedKb = null;

function loadKnowledgeBase() {
  if (cachedKb) return cachedKb;
  try {
    const p = path.join(process.cwd(), "data", "diseases.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      cachedKb = JSON.parse(raw);
      return cachedKb;
    }
  } catch (err) {
    console.warn("Could not read data/diseases.json from process.cwd, trying fallback:", err.message);
  }
  try {
    const p = path.resolve(__dirname, "../../data/diseases.json");
    const raw = fs.readFileSync(p, "utf8");
    cachedKb = JSON.parse(raw);
    return cachedKb;
  } catch (err) {
    console.error("Critical: Failed to load data/diseases.json:", err.message);
    return { crops: {}, metadata: {} };
  }
}

function getSupportedCrops() {
  const kb = loadKnowledgeBase();
  return Object.keys(kb.crops || {});
}

function getCropDisorders(crop) {
  const kb = loadKnowledgeBase();
  if (!crop) return [];
  // Case-insensitive matching of crop key
  const normalized = Object.keys(kb.crops || {}).find(
    k => k.toLowerCase() === String(crop).trim().toLowerCase()
  );
  if (!normalized || !kb.crops[normalized]) return [];
  return kb.crops[normalized].disorders || [];
}

function findDisorder(crop, idOrName) {
  if (!idOrName) return null;
  const disorders = getCropDisorders(crop);
  const target = String(idOrName).toLowerCase().trim();
  
  // 1. Direct ID match
  let match = disorders.find(d => d.id.toLowerCase() === target);
  if (match) return match;

  // 2. Common name match
  match = disorders.find(d => d.commonName.toLowerCase() === target || d.commonName.toLowerCase().includes(target));
  if (match) return match;

  // 3. Telugu name match
  match = disorders.find(d => d.nameTe.includes(target));
  if (match) return match;

  // 4. Scientific name partial match
  match = disorders.find(d => d.scientificName && d.scientificName.toLowerCase().includes(target));
  return match || null;
}

/**
 * Enriches Gemini candidate causes with authoritative management text from the KB.
 * Strictly enforces that management text comes from the KB, NOT hallucinated text.
 */
function enrichCandidate(crop, candidate) {
  const disorder = findDisorder(crop, candidate.id || candidate.commonName || candidate.scientificName);
  
  if (!disorder) {
    return {
      id: candidate.id || "unlisted_disorder",
      commonName: candidate.commonName || "Unknown Condition",
      nameTe: candidate.nameTe || "",
      scientificName: candidate.scientificName || "N/A",
      type: candidate.type || "other",
      confidence: candidate.confidence || "low",
      symptomsSeen: candidate.symptomsSeen || "",
      differentialCheck: candidate.differentialCheck || "",
      fieldCheck: candidate.fieldCheck || "Observe affected field area and consult Mandal AEO.",
      isFromKb: false,
      status: "unverified - requires field extension review",
      source: "https://pjtau.edu.in",
      management: {
        cultural: ["Consult your Mandal Agricultural Extension Officer (AEO) or PJTAU scientist for inspection."],
        biological: ["Avoid spraying unconfirmed biologicals until diagnosed by an extension officer."],
        chemicalClass: ["No chemical class recommendation available without verified identification."],
        regulatoryDisclaimer: "Use only CIB&RC approved crop protection products in India. Strictly adhere to package label instructions and wear protective gear."
      }
    };
  }

  return {
    id: disorder.id,
    commonName: disorder.commonName,
    nameTe: disorder.nameTe,
    scientificName: disorder.scientificName,
    type: disorder.type,
    confidence: candidate.confidence || "medium",
    symptomsSeen: candidate.symptomsSeen || disorder.symptoms,
    differentialCheck: candidate.differentialCheck || disorder.differential,
    fieldCheck: candidate.fieldCheck || disorder.fieldCheck,
    isFromKb: true,
    status: disorder.status || "draft - needs expert review",
    source: disorder.source || "https://pjtau.edu.in",
    favourableConditions: disorder.favourableConditions || null,
    management: {
      cultural: disorder.management?.cultural || [],
      biological: disorder.management?.biological || [],
      chemicalClass: disorder.management?.chemicalClass || [],
      regulatoryDisclaimer: disorder.management?.regulatoryDisclaimer || 
        "Use only CIB&RC approved products for this crop in India. Strictly follow container label directions and wear personal protective equipment."
    }
  };
}

module.exports = {
  loadKnowledgeBase,
  getSupportedCrops,
  getCropDisorders,
  findDisorder,
  enrichCandidate
};
