import { PesticideLabel } from "./types";

/**
 * Verified Indian CIBRC & PJTAU Package of Practices Pesticide Label Database.
 * Every chemical recommendation MUST match an entry in this registry with exact formulation,
 * permitted crop, target pest/disease, and pre-harvest interval (PHI).
 *
 * Statutory Rule: Never invent dosages or suggest off-label chemical formulations.
 */
export const VERIFIED_PESTICIDES: PesticideLabel[] = [
  // --- PADDY (RICE) PESTS & DISEASES ---
  {
    id: "cartap_50_sp",
    activeIngredient: "Cartap Hydrochloride 50% SP",
    commonBrands: ["Padan", "Caldan", "Sanvex"],
    formulation: "50% SP",
    approvedCrops: ["Paddy"],
    targetPestsOrDiseases: ["Stem Borer (కాండం తొలిచే పురుగు)", "Leaf Folder (ఆకుచుట్టు పురుగు)"],
    dosagePerLiterWater: "2.0 g/L",
    dosagePerAcre: "400 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 21,
    safetyPrecautions: {
      en: "Wear protective gloves and mask while spraying. Avoid spraying during peak bee activity. Toxic to aquatic organisms.",
      te: "పిచికారీ చేసేటప్పుడు చేతి తొడుగులు, మాస్క్ ధరించండి. తేనెటీగల సంచారం సమయంలో వాడవద్దు. చేపలకు మరియు జలచరాలకు హానికరం.",
    },
    registrationStatus: "CIBRC_APPROVED",
    regulatoryNotes: "PJTAU Standard recommendation for vegetative stage stem borer and leaf folder.",
  },
  {
    id: "coragen_18_5_sc",
    activeIngredient: "Chlorantraniliprole 18.5% SC",
    commonBrands: ["Coragen", "Cover", "Cosko"],
    formulation: "18.5% SC",
    approvedCrops: ["Paddy", "Cotton", "Maize", "Chilli", "Tomato", "Redgram"],
    targetPestsOrDiseases: ["Stem Borer", "Leaf Folder", "Fall Armyworm (కత్తెర పురుగు)", "Helicoverpa Pod Borer", "Fruit Borer"],
    dosagePerLiterWater: "0.3 mL/L",
    dosagePerAcre: "60 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 14,
    safetyPrecautions: {
      en: "Do not exceed recommended dose (0.3 mL/L). Maintain 14-day pre-harvest interval.",
      te: "సిఫారసు చేసిన మోతాదు (0.3 మి.లీ/లీ) మించవద్దు. కోతకు 14 రోజుల ముందు పిచికారీ ఆపండి.",
    },
    registrationStatus: "CIBRC_APPROVED",
    regulatoryNotes: "Anthranilic diamide; ryanodine receptor activator. Safe for major beneficial predators when used as per label.",
  },
  {
    id: "tricyclazole_75_wp",
    activeIngredient: "Tricyclazole 75% WP",
    commonBrands: ["Beam", "Baan", "Sivic"],
    formulation: "75% WP",
    approvedCrops: ["Paddy"],
    targetPestsOrDiseases: ["Blast (అగ్గి తెగులు)", "Neck Blast (మెడ విరుపు)", "Node Blast"],
    dosagePerLiterWater: "0.6 g/L",
    dosagePerAcre: "120 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 30,
    safetyPrecautions: {
      en: "Specific melanin biosynthesis inhibitor. Highly systemic for blast prevention. Spray at early tillering or panicle emergence if weather is cool/foggy.",
      te: "అగ్గి తెగులు నివారణకు అత్యుత్తమ దైహిక శిలీంధ్రనాశిని. చల్లని వాతావరణం, మంచు ఉన్నప్పుడు ఆరంభంలోనే పిచికారీ చేయాలి.",
    },
    registrationStatus: "CIBRC_APPROVED",
    regulatoryNotes: "PJTAU Golden Standard for Paddy Blast management.",
  },
  {
    id: "hexaconazole_5_sc",
    activeIngredient: "Hexaconazole 5% SC",
    commonBrands: ["Contaf", "Sitara"],
    formulation: "5% SC",
    approvedCrops: ["Paddy", "Chilli", "Groundnut"],
    targetPestsOrDiseases: ["Sheath Blight (మచ్చ తెగులు / పొడ తెగులు)", "Powdery Mildew", "Tikka Leaf Spot"],
    dosagePerLiterWater: "2.0 mL/L",
    dosagePerAcre: "400 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 30,
    safetyPrecautions: {
      en: "Ensure spray reaches the base and lower leaf sheaths where sheath blight sclerotia reside.",
      te: "మొక్క మొదలు, దిగువ ఆకుల తొడుగులకు బాగా తగిలేలా పిచికారీ చేయాలి.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "nativo_75_wg",
    activeIngredient: "Trifloxystrobin 25% + Tebuconazole 50% WG",
    commonBrands: ["Nativo"],
    formulation: "75% WG",
    approvedCrops: ["Paddy", "Chilli", "Tomato"],
    targetPestsOrDiseases: ["Sheath Blight", "Neck Blast", "Anthracnose / Fruit Rot"],
    dosagePerLiterWater: "0.4 g/L",
    dosagePerAcre: "80 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 21,
    safetyPrecautions: {
      en: "Dual action strobilurin + triazole. Use at boot leaf stage for premium panicle health.",
      te: "ద్విముఖ చర్య గల మందు. చిరుపొట్ట దశలో పిచికారీ చేస్తే గింజ నాణ్యత పెరుగుతుంది.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "pymetrozine_50_wg",
    activeIngredient: "Pymetrozine 50% WG",
    commonBrands: ["Chess", "Plenum"],
    formulation: "50% WG",
    approvedCrops: ["Paddy"],
    targetPestsOrDiseases: ["Brown Planthopper (BPH / సుడి దోమ)", "White Backed Planthopper (WBPH)"],
    dosagePerLiterWater: "0.6 g/L",
    dosagePerAcre: "120 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 19,
    safetyPrecautions: {
      en: "Spray directly towards the base/hills of the plants. Drain standing water from the field before application for maximum efficacy.",
      te: "మందును నేరుగా దుబ్బుల మొదళ్ళపై పడేలా పిచికారీ చేయాలి. పొలంలో నీటిని తీసివేసి పిచికారీ చేయడం వల్ల సుడిదోమ వేగంగా నియంత్రించబడుతుంది.",
    },
    registrationStatus: "CIBRC_APPROVED",
    regulatoryNotes: "Specifically paralyses insect stylet mechanism; safe for predatory mirid bugs and spiders.",
  },
  {
    id: "dinotefuran_20_sg",
    activeIngredient: "Dinotefuran 20% SG",
    commonBrands: ["Token", "Osheen"],
    formulation: "20% SG",
    approvedCrops: ["Paddy", "Cotton"],
    targetPestsOrDiseases: ["Brown Planthopper (BPH)", "Green Leafhopper", "Jassids"],
    dosagePerLiterWater: "0.4 g/L",
    dosagePerAcre: "80 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 21,
    safetyPrecautions: {
      en: "Third generation neonicotinoid. Rapid translaminar action.",
      te: "అతి త్వరగా ఆకుల లోపలికి చొచ్చుకుపోయి సుడిదోమను హరిస్తుంది.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "kasugamycin_3_sl",
    activeIngredient: "Kasugamycin 3% SL",
    commonBrands: ["Kasu-B"],
    formulation: "3% SL",
    approvedCrops: ["Paddy"],
    targetPestsOrDiseases: ["Bacterial Leaf Blight (BLB / బాక్టీరియా ఆకు ఎండు తెగులు)", "Blast"],
    dosagePerLiterWater: "2.5 mL/L",
    dosagePerAcre: "500 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 21,
    safetyPrecautions: {
      en: "When BLB is noticed, immediately stop top-dressing Urea and drain field water for 2-3 days.",
      te: "బాక్టీరియా ఎండు తెగులు కనిపించిన వెంటనే యూరియా వేయడం నిలిపివేయాలి మరియు 2-3 రోజులు పొలంలో నీరు కట్టరాదు.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },

  // --- COTTON PESTS & DISEASES ---
  {
    id: "flonicamid_50_wg",
    activeIngredient: "Flonicamid 50% WG",
    commonBrands: ["Ulala", "Aero"],
    formulation: "50% WG",
    approvedCrops: ["Cotton", "Paddy", "Chilli"],
    targetPestsOrDiseases: ["Jassids (పచ్చదోమ)", "Aphids (పేనుబంక)", "Whitefly (తెల్లదోమ)", "BPH"],
    dosagePerLiterWater: "0.4 g/L",
    dosagePerAcre: "80 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 25,
    safetyPrecautions: {
      en: "Target feeding inhibitor. Extremely safe to predatory ladybird beetles and chrysoperla.",
      te: "రసం పీల్చే పురుగుల ఆహార వ్యవస్థను స్తంభింపజేస్తుంది. మిత్రపురుగులకు సురక్షితమైనది.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "diafenthiuron_50_wp",
    activeIngredient: "Diafenthiuron 50% WP",
    commonBrands: ["Pegasus", "Agni"],
    formulation: "50% WP",
    approvedCrops: ["Cotton", "Chilli", "Brinjal"],
    targetPestsOrDiseases: ["Whitefly (తెల్లదోమ)", "Mites (నల్లి)", "Thrips (తామర పురుగులు)"],
    dosagePerLiterWater: "1.25 g/L",
    dosagePerAcre: "250 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 30,
    safetyPrecautions: {
      en: "Apply in late afternoon when nymphs and adults are actively feeding under leaves.",
      te: "ఆకుల అడుగుభాగాన మందు పడేలా సాయంత్రం వేళల్లో పిచికారీ చేయాలి.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "emamectin_5_sg",
    activeIngredient: "Emamectin Benzoate 5% SG",
    commonBrands: ["Proclaim", "Safari", "Starclaim"],
    formulation: "5% SG",
    approvedCrops: ["Cotton", "Maize", "Chilli", "Redgram", "Tomato"],
    targetPestsOrDiseases: ["Bollworm", "Fall Armyworm (కత్తెర పురుగు)", "Fruit Borer", "Spodoptera"],
    dosagePerLiterWater: "0.4 g/L",
    dosagePerAcre: "80 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 15,
    safetyPrecautions: {
      en: "Naturally derived from Streptomyces avermitilis. Rapid stomach action against caterpillars.",
      te: "శనగపచ్చ పురుగు, లద్దె పురుగుల నివారణకు సమర్థవంతమైన జీవ ఆధారిత మందు.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "copper_oxychloride_50_wp",
    activeIngredient: "Copper Oxychloride 50% WP",
    commonBrands: ["Blitox", "Fytolan", "Blue Copper"],
    formulation: "50% WP",
    approvedCrops: ["Cotton", "Chilli", "Tomato", "Paddy", "Turmeric"],
    targetPestsOrDiseases: ["Bacterial Leaf Blight / Black Arm", "Damping Off", "Fruit Rot / Anthracnose", "Rhizome Rot"],
    dosagePerLiterWater: "3.0 g/L",
    dosagePerAcre: "600 g/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 15,
    safetyPrecautions: {
      en: "Can be combined with Streptocycline (1 g in 10 L water) for bacterial blight outbreaks. Do not mix with acidic chemicals.",
      te: "బాక్టీరియా మచ్చ తెగులు తీవ్రంగా ఉన్నప్పుడు స్ట్రెప్టోసైక్లిన్ (10 లీటర్లకు 1 గ్రా) కలిపి వాడవచ్చు. ఆమ్ల గుణం గల మందులతో కలపరాదు.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },

  // --- CHILLI PESTS & DISEASES ---
  {
    id: "fipronil_5_sc",
    activeIngredient: "Fipronil 5% SC",
    commonBrands: ["Regent", "Mortal"],
    formulation: "5% SC",
    approvedCrops: ["Chilli", "Paddy", "Cotton"],
    targetPestsOrDiseases: ["Thrips (పై ముడత / తామర పురుగులు)", "Stem Borer"],
    dosagePerLiterWater: "2.0 mL/L",
    dosagePerAcre: "400 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 7,
    safetyPrecautions: {
      en: "Effective against upward leaf curling caused by thrips. Do not spray during peak flowering in morning.",
      te: "ఆకులు పైకి ముడుచుకునే తామర పురుగుల నివారణకు మంచిది. ఉదయం పూత సమయంలో పిచికారీ చేయరాదు.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
  {
    id: "spiromesifen_22_9_sc",
    activeIngredient: "Spiromesifen 22.9% SC",
    commonBrands: ["Oberon"],
    formulation: "22.9% SC",
    approvedCrops: ["Chilli", "Tomato", "Cotton"],
    targetPestsOrDiseases: ["Yellow Mites (కింది ముడత / పచ్చ నల్లి)", "Whitefly nymphs"],
    dosagePerLiterWater: "1.0 mL/L",
    dosagePerAcre: "200 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 5,
    safetyPrecautions: {
      en: "Controls downward curling caused by mites feeding under the leaves. Ensure thorough under-leaf coverage.",
      te: "ఆకులు బోర్లపడి కిందికి ముడుచుకునే నల్లి నివారణకు ఆకుల అడుగుభాగం తడిచేలా పిచికారీ చేయాలి.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },

  // --- HERBICIDES (TELANGANA WEED MANAGEMENT) ---
  {
    id: "pretilachlor_50_ec",
    activeIngredient: "Pretilachlor 50% EC",
    commonBrands: ["Rifit", "Eraze"],
    formulation: "50% EC",
    approvedCrops: ["Paddy"],
    targetPestsOrDiseases: ["Annual grasses, sedges, and broadleaf weeds (Pre-emergence)"],
    dosagePerLiterWater: "2.0 mL/L (or sand mix broadcast)",
    dosagePerAcre: "400 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 60,
    safetyPrecautions: {
      en: "Pre-emergence herbicide: Apply within 3 to 5 days after transplanting (DAT). Maintain a thin standing water film (2-3 cm) for 48 hours for weed barrier formation. Do not drain.",
      te: "వరి నాటిన 3 నుండి 5 రోజులలోపు పొలంలో పలుచటి నీరు నిలగట్టి ఎకరానికి 400 మి.లీ పిచికారీ చేయాలి లేదా 20-25 కిలోల ఇసుకలో కలిపి చల్లాలి. 48 గంటలు నీరు తగ్గకుండా చూడాలి.",
    },
    registrationStatus: "CIBRC_APPROVED",
    regulatoryNotes: "PJTAU Standard Pre-emergence herbicide for transplanted rice.",
  },
  {
    id: "bispyribac_sodium_10_sc",
    activeIngredient: "Bispyribac Sodium 10% SC",
    commonBrands: ["Nominee Gold", "Adora", "Taarak"],
    formulation: "10% SC",
    approvedCrops: ["Paddy"],
    targetPestsOrDiseases: ["Post-emergence Echinochloa, Cyperus, and broadleaf weeds"],
    dosagePerLiterWater: "0.5 mL/L",
    dosagePerAcre: "100 mL/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 60,
    safetyPrecautions: {
      en: "Post-emergence herbicide: Apply when weeds have 2-4 leaves (15-20 DAT). Drain excess standing water before spraying; re-irrigate field 24-48 hours after spray.",
      te: "కలుపు 2-4 ఆకుల దశలో ఉన్నప్పుడు (నాటిన 15-20 రోజులకు) పొలంలోని నీటిని పూర్తిగా తీసివేసి పిచికారీ చేయాలి. పిచికారీ చేసిన 24-48 గంటల తర్వాత తిరిగి నీరు పెట్టాలి.",
    },
    registrationStatus: "CIBRC_APPROVED",
    regulatoryNotes: "PJTAU Standard Post-emergence herbicide for transplanted & direct-seeded rice.",
  },
  {
    id: "pendimethalin_30_ec",
    activeIngredient: "Pendimethalin 30% EC",
    commonBrands: ["Stomp", "Dhanutop"],
    formulation: "30% EC",
    approvedCrops: ["Cotton", "Chilli", "Maize", "Groundnut", "Soybean"],
    targetPestsOrDiseases: ["Annual grasses and broadleaf weeds (Pre-emergence)"],
    dosagePerLiterWater: "6.5 mL/L",
    dosagePerAcre: "1300 mL (1.3 L)/acre",
    dilutionWaterLitresPerAcre: 200,
    waitingPeriodDaysPHI: 60,
    safetyPrecautions: {
      en: "Pre-emergence herbicide: Spray on moist soil within 24 to 48 hours of sowing/transplanting before crop and weed emergence.",
      te: "విత్తిన 24 నుండి 48 గంటల లోపు నేలలో తగినంత తేమ ఉన్నప్పుడు పిచికారీ చేయాలి. పంట మొలకెత్తిన తర్వాత వాడరాదు.",
    },
    registrationStatus: "CIBRC_APPROVED",
  },
];

/**
 * Validates whether a proposed chemical recommendation is authorized under Indian CIBRC / PJTAU guidelines.
 */
export function validateChemicalRecommendation(
  activeIngredientOrKeyword: string,
  crop: string
): {
  isVerified: boolean;
  label?: PesticideLabel;
  rejectionReason?: { en: string; te: string };
} {
  const query = activeIngredientOrKeyword.toLowerCase();
  const cropLower = crop.toLowerCase();

  const match = VERIFIED_PESTICIDES.find((p) => {
    const aiMatch = p.activeIngredient.toLowerCase().includes(query);
    const brandMatch = p.commonBrands.some((b) => b.toLowerCase().includes(query));
    const pestMatch = p.targetPestsOrDiseases.some((t) => t.toLowerCase().includes(query));
    const cropMatch = p.approvedCrops.some((c) => c.toLowerCase().includes(cropLower) || cropLower.includes(c.toLowerCase()));

    return (aiMatch || brandMatch || pestMatch) && (cropMatch || cropLower === "all" || cropLower === "general");
  });

  if (match) {
    return {
      isVerified: true,
      label: match,
    };
  }

  return {
    isVerified: false,
    rejectionReason: {
      en: `Actionable chemical recommendation withheld: The proposed substance "${activeIngredientOrKeyword}" for crop "${crop}" could not be confirmed against the verified Indian CIBRC pesticide label database. Under statutory farm safety standards, unverified chemical dosages are not generated. Consult your Mandal Agricultural Officer (MAO).`,
      te: `రసాయన మందు సిఫారసు నిలిపివేయబడింది: "${crop}" పంటకు "${activeIngredientOrKeyword}" వినియోగం భారతీయ CIBRC మరియు PJTAU అధికారిక రిజిస్ట్రీలో ధృవీకరించబడలేదు. రైతు భద్రత నిబంధనల ప్రకారం ధృవీకరించని మోతాదులు సిఫారసు చేయబడవు. దయచేసి మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.`,
    },
  };
}
