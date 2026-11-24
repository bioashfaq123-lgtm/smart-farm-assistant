import { KnowledgeRecord } from "./types";

/**
 * Curated Centralized Agricultural Knowledge Base for Telangana & PJTAU Publications.
 * Cross-indexed across all 15 required agronomic categories with exact document titles,
 * publication dates, PDF page indexes, printed page citations, and bilingual UTF-8 Telugu + English text.
 */
export const AGRICULTURAL_KNOWLEDGE_STORE: KnowledgeRecord[] = [
  // ==========================================
  // 1. CROP VARIETIES & SEED PRODUCTION
  // ==========================================
  {
    id: "rec_var_paddy_rnr15048",
    title: "వరి రకం: ఆర్.ఎన్.ఆర్ 15048 (తెలంగాణ సోనా) సమగ్ర వివరాలు",
    crop: "Paddy",
    category: "varieties_seed",
    originalTeluguText: `ఆర్.ఎన్.ఆర్ 15048 (తెలంగాణ సోనా): ప్రొఫెసర్ జయశంకర్ తెలంగాణ రాష్ట్ర వ్యవసాయ విశ్వవిద్యాలయం విడుదల చేసిన ప్రసిద్ధ సన్న రకం. దీని పంట కాలం 125 రోజులు. ఖరీఫ్ మరియు రబీ రెండు కాలాలకు అనుకూలం. గ్లైసిమిక్ ఇండెక్స్ (GI) 51.5 మాత్రమే ఉండటం వల్ల మధుమేహ వ్యాధిగ్రస్తులకు అత్యుత్తమం. అగ్గితెగులును తట్టుకుంటుంది. ఎకరానికి సగటు దిగుబడి 26 నుండి 28 క్వింటాళ్లు. విత్తన మోతాదు: ఎకరానికి 20-25 కిలోలు. నత్రజని అధికంగా వేస్తే లాడ్జింగ్ (చేను పడిపోవడం) జరిగే అవకాశం ఉన్నందున సిఫారసు చేసిన మోతాదులోనే ఎరువులు వేయాలి.`,
    normalizedTeluguText: `ఆర్.ఎన్.ఆర్ 15048 (తెలంగాణ సోనా) — స్వల్పకాలిక (125 రోజులు), తక్కువ గ్లైసిమిక్ ఇండెక్స్ (GI 51.5) కలిగిన సన్న బియ్యం రకం. ఖరీఫ్ & రబీ సాగుకు అనుకూలం. అగ్గితెగులు నిరోధక శక్తి కలదు. ఎకరానికి 26-28 క్వింటాళ్ల దిగుబడి.`,
    englishText: `RNR 15048 (Telangana Sona): Short duration (125 days) super-fine grain variety released by PJTAU. Suitable for both Kharif and Rabi seasons. Low Glycemic Index (GI 51.5) makes it ideal for diabetic patients. Resistant to Blast disease. Average yield: 26–28 quintals/acre. Seed rate: 20–25 kg/acre. Avoid excess nitrogen top-dressing to prevent crop lodging.`,
    keywords: ["rnr 15048", "telangana sona", "తెలంగాణ సోనా", "వరి రకాలు", "low gi", "fine grain", "blast resistant", "rabi paddy"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU (Professor Jayashankar Telangana State Agricultural University)",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 36,
      printedPage: 3,
      sectionHeader: "వరి రకాలు — తెలంగాణ సోనా (RNR 15048)",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    notes: "Verified baseline from Diksoochi and updated in PJTAU Vyavasayam monthly editions.",
  },
  {
    id: "rec_var_paddy_bpt5204",
    title: "సాంబ మసూరి (బి.పి.టి 5204) సాగు యాజమాన్యం మరియు మెళకువలు",
    crop: "Paddy",
    category: "varieties_seed",
    originalTeluguText: `బి.పి.టి 5204 (సాంబ మసూరి): దీర్ఘకాలిక రకం (145-150 రోజులు). మార్కెట్లో అత్యంత ఆదరణ, ప్రీమియం ధర పలికే సన్న రకం. ఖరీఫ్ కాలంలో జూన్ 15 నుండి జూలై 15 లోపు నారు పోసుకోవాలి. లేట్ అయితే అగ్గితెగులు మరియు సుడిదోమ ఉధృతి పెరుగుతుంది. నాట్లు వేసేటప్పుడు చదరపు మీటరుకు 44 దుబ్బులు (15x15 సెం.మీ దూరం) ఉండేలా చూడాలి. అధిక నత్రజని వేయకూడదు; నత్రజనిని 3 సమపాళ్లలో దుక్కిలో, పిలక దశలో, చిరుపొట్ట దశలో విభజించి వేయాలి.`,
    normalizedTeluguText: `సాంబ మసూరి (BPT 5204) — 150 రోజుల దీర్ఘకాలిక సన్న రకం. అత్యున్నత వంట నాణ్యత. సుడిదోమ, అగ్గితెగులు ఆశించే అవకాశం ఉన్నందున సమగ్ర సస్యరక్షణ మరియు క్రమబద్ధమైన నత్రజని యాజమాన్యం పాటించాలి.`,
    englishText: `BPT 5204 (Samba Mahsuri): Long duration (145–150 days) premium quality fine rice. High market demand. Sow nursery between June 15 and July 15 for Kharif. Delayed planting increases vulnerability to Blast and BPH. Plant at 15x15 cm spacing (44 hills/m²). Avoid excessive nitrogen; apply N strictly in 3 splits.`,
    keywords: ["bpt 5204", "samba mahsuri", "సాంబ మసూరి", "fine rice", "long duration paddy", "వరి రకాలు"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 37,
      printedPage: 4,
      sectionHeader: "వరి రకాలు — సాంబ మసూరి",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },
  {
    id: "rec_var_cotton_refugia",
    title: "బీటీ పత్తిలో గులాబీ రంగు పురుగు నివారణకు రిఫ్యూజియా (Refugia) ప్రాముఖ్యత",
    crop: "Cotton",
    category: "varieties_seed",
    originalTeluguText: `బీటీ పత్తి విత్తన ప్యాకెట్ తో పాటు వచ్చే 120 గ్రాముల నాన్-బీటీ విత్తనాలను పొలం చుట్టూ 5 వరుసలలో తప్పనిసరిగా విత్తాలి. దీనిని రిఫ్యూజియా అంటారు. నాన్-బీటీ మొక్కలపై పెరిగే గులాబీ రంగు పురుగులు విషానికి గురికాకుండా సహజంగా ఉంటాయి. ఇవి బీటీ పంటపై బతికిన పురుగులతో సంపర్కం జరపడం వల్ల గులాబీ రంగు పురుగులో బీటీ టాక్సిన్ కు వ్యతిరేకంగా రోగనిరోధక శక్తి (Resistance) అభివృద్ధి చెందకుండా ఉంటుంది.`,
    normalizedTeluguText: `బీటీ పత్తి చుట్టూ 5 వరుసల నాన్-బీటీ రిఫ్యూజియా విత్తడం చట్టబద్ధం మరియు శాస్త్రీయ ఆవశ్యకత. ఇది గులాబీ రంగు పురుగులో నిరోధకత రాకుండా నిరోధిస్తుంది.`,
    englishText: `Refugia Strategy in Bt Cotton: Farmers must plant 5 border rows of Non-Bt cotton (using the 120g non-Bt seed packet provided). This maintains a susceptible pink bollworm population that mates with any surviving moths, preventing resistance buildup against Cry1Ac/Cry2Ab Bt toxins.`,
    keywords: ["cotton refugia", "non-bt", "రిఫ్యూజియా", "గులాబీ రంగు పురుగు", "pink bollworm resistance", "పత్తి"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "June 2024",
      filename: "vyavasayam-june-2024-2.pdf",
      pdfPage: 14,
      printedPage: 12,
      sectionHeader: "పత్తిలో గులాబీ రంగు పురుగు నిరోధకత నిర్వహణ",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 2. SOWING & PLANTING
  // ==========================================
  {
    id: "rec_sow_paddy_nursery",
    title: "వరి నారుమడి యాజమాన్యం మరియు విత్తన మోతాదు",
    crop: "Paddy",
    category: "sowing_planting",
    originalTeluguText: `ఎకరం పొలానికి 5 సెంట్ల (200 చదరపు మీటర్ల) నారుమడి అవసరం. సాధారణ రకాలకు ఎకరానికి విత్తన మోతాదు: 20-25 కిలోలు; హైబ్రిడ్ వరికి 5 కిలోలు. విత్తనశుద్ధి: కిలో విత్తనానికి కార్బెండజిమ్ 2 గ్రాములు లేదా ట్రైసైక్లాజోల్ 2 గ్రాములతో పొడి విత్తనశుద్ధి చేయాలి లేదా 1 గ్రాము కార్బెండజిమ్ ను లీటరు నీటిలో కలిపి 24 గంటలు నానబెట్టాలి. నారుమడిలో నాట్లు వేయడానికి ముదురు నారు వాడకూడదు; ఖరీఫ్ లో 25-30 రోజుల నారు, రబీలో 30-35 రోజుల నారు అనుకూలం.`,
    normalizedTeluguText: `ఎకరాకు 5 సెంట్ల నారుమడి. విత్తన మోతాదు: 20-25 కిలోలు. విత్తనశుద్ధి: కార్బెండజిమ్ 2 గ్రా/కిలో విత్తనానికి. 25-30 రోజుల లేత నారు నాటడం ద్వారా అధిక పిలకలు వచ్చి దిగుబడి పెరుగుతుంది.`,
    englishText: `Paddy Nursery Management: 5 cents (200 m²) nursery area required per acre. Seed rate: 20–25 kg/acre for inbred varieties; 5 kg/acre for hybrids. Seed treatment: Dry dress with Carbendazim 2g/kg seed or soak in Carbendazim solution (1g/L water) for 24 hours. Optimal seedling age: 25–30 days in Kharif and 30–35 days in Rabi.`,
    keywords: ["paddy nursery", "seed rate", "విత్తన మోతాదు", "నారుమడి", "seed treatment", "విత్తనశుద్ధి", "వరి నాట్లు"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 38,
      printedPage: 5,
      sectionHeader: "వరి నారుమడి తయారీ మరియు విత్తనశుద్ధి",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },
  {
    id: "rec_sow_dsr_drum_seeder",
    title: "వరిలో డ్రమ్ సీడర్ (డైరెక్ట్ సీడింగ్) సాగు పద్ధతి",
    crop: "Paddy",
    category: "sowing_planting",
    originalTeluguText: `డ్రమ్ సీడర్ ద్వారా దమ్ము చేసిన పొలంలో నేరుగా మొలకెత్తిన విత్తనాలను చల్లుకోవచ్చు. దీనివల్ల నారుమడి పెంచడం, నారు పీకడం మరియు నాట్లు వేసే కూలీల ఖర్చు ఎకరానికి రూ. 5000 వరకు ఆదా అవుతుంది. పంట 7-10 రోజులు ముందుగా కోతకు వస్తుంది. ఎకరానికి 10-12 కిలోల మొలక విత్తనాలు సరిపోతాయి. విత్తనాలు డ్రమ్ సీడర్ లో పోసే ముందు 24 గంటలు నానబెట్టి, మరో 24 గంటలు మండె కట్టి చిరుమొలక దశలో చల్లాలి. వరుసల మధ్య దూరం 20 సెం.మీ ఉంటుంది.`,
    normalizedTeluguText: `డ్రమ్ సీడర్ వరి సాగు: ఎకరానికి 10-12 కిలోల మొలక విత్తనాలు. నారు పోసే, నాట్లు వేసే శ్రమ లేకుండా ఎకరానికి రూ. 5,000 ఖర్చు ఆదా అవుతుంది. వరుసల మధ్య 20 సెం.మీ దూరం ఏర్పడి ఎలుకలు, కలుపు సులభంగా నివారించవచ్చు.`,
    englishText: `Direct Seeded Rice (DSR) via Drum Seeder: Sows sprouted seeds directly in well-puddled fields. Saves ~Rs 5,000/acre on nursery raising, uprooting, and manual transplanting labor. Crop matures 7–10 days earlier. Seed rate: 10–12 kg/acre. Soak seeds for 24 hours, incubate for 24 hours to obtain 1–2 mm radicle sprouts before filling seeder drums. Row-to-row spacing: 20 cm.`,
    keywords: ["drum seeder", "direct seeded rice", "dsr", "డ్రమ్ సీడర్", "వరి సూటి విత్తే పద్ధతి", "labor saving"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "June 2023",
      filename: "vyavasayam-june-2023-1.pdf",
      pdfPage: 8,
      printedPage: 6,
      sectionHeader: "దమ్ము చేసిన పొలంలో డ్రమ్ సీడర్ తో వరి సాగు",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 3. SOIL & NUTRIENT MANAGEMENT
  // ==========================================
  {
    id: "rec_soil_zinc_deficiency",
    title: "వరిలో జింక్ లోపం (ఖైరా తెగులు) లక్షణాలు మరియు సవరణ చర్యలు",
    crop: "Paddy",
    category: "soil_nutrients",
    originalTeluguText: `తెలంగాణలోని చల్కా మరియు నల్లరేగడి నేలల్లో జింక్ లోపం సర్వసాధారణం. నాటిన 15-20 రోజుల తర్వాత మధ్య మరియు దిగువ ఆకుల ఈనెలు పచ్చగా ఉండి, ఈనెల మధ్య భాగంలో తుప్పు రంగు లేదా ఇటుక రంగు మచ్చలు ఏర్పడతాయి. ఆకులు పెళుసుగా మారి దుబ్బు చేయకుండా మొక్కలు గిడసబారిపోతాయి. దీనిని ఖైరా అంటారు. నివారణ: ఆఖరి దుక్కిలో ఎకరానికి 20-25 కిలోల జింక్ సల్ఫేట్ (21%) వేయాలి. ఒకసారి వేస్తే 3 పంటల వరకు సరిపోతుంది. పంట కాలంలో లోపం కనిపిస్తే: లీటరు నీటికి 2 గ్రాముల జింక్ సల్ఫేట్ (21%) + 10 గ్రాముల యూరియా కలిపి 5 రోజుల వ్యవధిలో రెండుసార్లు పిచికారీ చేయాలి. గమనిక: జింక్ సల్ఫేట్ ను DAP లేదా భాస్వరం ఎరువులతో ఎప్పుడూ కలిపి వేయరాదు (రసాయనిక చర్య జరిగి జింక్ ఫాస్ఫేట్ గా మారి రెండూ నిరుపయోగమవుతాయి).`,
    normalizedTeluguText: `జింక్ లోపం: నాటిన 15-20 రోజులకు ఆకులపై ఇటుక రంగు/తుప్పు మచ్చలు. నివారణ: దుక్కిలో 20-25 కిలోల జింక్ సల్ఫేట్ (21%) వేయాలి. పంటలో కనిపిస్తే: 2 గ్రా జింక్ సల్ఫేట్ + 10 గ్రా యూరియా లీటరు నీటికి కలిపి పిచికారీ చేయాలి. DAP తో కలపరాదు!`,
    englishText: `Zinc Deficiency (Khaira Disease) in Paddy: Highly prevalent in Telangana red and black soils. Appears 15–20 DAT as rusty bronze/brown spots on middle and lower leaves between veins; plants remain stunted with poor tillering. Prevention: Broadcast 20–25 kg Zinc Sulphate (21%) per acre at final puddling (effective for 3 seasons). In standing crop: Foliar spray 2.0 g Zinc Sulphate (21%) + 10.0 g Urea per liter of water twice at 5-day intervals. CRITICAL: Never mix Zinc Sulphate directly with DAP/Phosphorus fertilizers, as insoluble Zinc Phosphate precipitates out.`,
    keywords: ["zinc deficiency", "జింక్ లోపం", "khaira disease", "ఖైరా తెగులు", "zinc sulphate", "dap mixing warning", "micronutrient"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 44,
      printedPage: 11,
      sectionHeader: "వరిలో సూక్ష్మపోషకాల లోపాలు — జింక్ లోప సవరణ",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 4. IRRIGATION & WATER MANAGEMENT
  // ==========================================
  {
    id: "rec_irrig_awd_paddy",
    title: "వరిలో ఆల్టర్నేట్ వెట్టింగ్ అండ్ డ్రైయింగ్ (AWD) నీటి యాజమాన్యం",
    crop: "Paddy",
    category: "irrigation_water",
    originalTeluguText: `వరి పొలంలో ఎల్లప్పుడూ 5-10 సెం.మీ నీరు నిలబెట్టడం వల్ల వేర్లకు గాలి అందక వేరు కుళ్ళు వస్తుంది, మీథేన్ వాయువు విడుదలై పర్యావరణానికి హాని కలుగుతుంది. దీనికి బదులుగా 'పానీ పైప్' (AWD ట్యూబ్) పద్ధతిని పాటించాలి. 30 సెం.మీ పొడవు, 15-20 సెం.మీ వ్యాసం గల ప్లాస్టిక్ పైపునకు రంధ్రాలు చేసి పొలంలో 15 సెం.మీ లోతుకు దింపాలి. పైపు లోపల నీటి మట్టం నేల మట్టం కన్నా 15 సెం.మీ కిందికి దిగినప్పుడు మాత్రమే తిరిగి 5 సెం.మీ లోతు నీరు పెట్టాలి. దీనివల్ల 25-30% నీరు ఆదా అవుతుంది మరియు దిగుబడి తగ్గదు. గమనిక: పిలకల దశ మరియు చిరుపొట్ట నుండి గింజ పాలుపోసుకునే దశలలో చేనులో నిరంతరం పలుచటి నీరు ఉండాలి.`,
    normalizedTeluguText: `AWD నీటి యాజమాన్యం: పానీ పైప్ లో నీటి మట్టం నేల కన్నా 15 సెం.మీ దిగువకు వెళ్ళినప్పుడు మాత్రమే నీరు పెట్టాలి. 25-30% నీరు మరియు విద్యుత్ ఆదా అవుతుంది. చిరుపొట్ట దశలో నీటి ఎద్దడి రానివ్వకూడదు.`,
    englishText: `Alternate Wetting and Drying (AWD) in Paddy: Continuous submergence is unnecessary and causes root rot and methane emissions. Install a perforated 30 cm PVC field water tube ('Pani Pipe') 15 cm into the soil. Re-irrigate to 5 cm depth only when water drops 15 cm below the soil surface inside the tube. Saves 25–30% irrigation water and pumping electricity with zero yield loss. Exception: Maintain continuous 2–3 cm water film during critical tillering and panicle emergence/flowering stages.`,
    keywords: ["awd", "alternate wetting and drying", "pani pipe", "నీటి యాజమాన్యం", "water saving", "వరి నీటి పారుదల"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "January 2024",
      filename: "vyavasayam-January-2025.pdf",
      pdfPage: 19,
      printedPage: 17,
      sectionHeader: "వరిలో నీటి పొదుపు పద్ధతులు — పానీ పైప్ విధానం",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 5. INSECT PESTS & IPM
  // ==========================================
  {
    id: "rec_pest_paddy_stem_borer",
    title: "వరి కాండం తొలిచే పురుగు (Stem Borer) సమగ్ర నివారణ చర్యలు",
    crop: "Paddy",
    category: "insect_pests",
    originalTeluguText: `కాండం తొలిచే పురుగు (Scirpophaga incertulas): లార్వా కాండం లోపలికి చొచ్చుకుపోయి లోపలి కణజాలాన్ని తినడం వల్ల పిలక దశలో 'మొవ్వు కుళ్ళు' (Dead Heart) మరియు ఈనె దశలో 'తెల్ల కంకి' (White Earhead) ఏర్పడతాయి. తెల్ల కంకులు చేతితో లాగితే సులభంగా ఊడి వస్తాయి, గింజలు ఉండవు.
ఆర్థిక నష్ట పరిమితి (ETL): చదరపు మీటరుకు 1 గుడ్ల సముదాయం లేదా పిలక దశలో 5% మొవ్వు కుళ్ళు లేదా ఈనె దశలో 2% తెల్ల కంకులు.
సమగ్ర యాజమాన్యం (IPM):
1. నాటేటప్పుడు నారు కొసలను తుంచి నాటాలి (ఆడ రెక్కల పురుగులు కొసలపై పెట్టిన గుడ్లు నాశనమవుతాయి).
2. ఎకరానికి 8-10 లింగాకర్షక బుట్టలు (Pheromone Traps) అమర్చాలి.
3. ఎకరానికి 40,000 ట్రైకోగ్రామా ఖిలోనిస్ లేదా జపోనికమ్ గుడ్డు పరాన్నజీవుల కార్డులను వారం వ్యవధిలో 3 సార్లు అమర్చాలి.
రసాయన నివారణ (ఉధృతి ఎక్కువగా ఉన్నప్పుడు):
- కార్టాప్ హైడ్రోక్లోరైడ్ 50% SP @ 2.0 గ్రాములు లీటరు నీటికి (ఎకరానికి 400 గ్రాములు) లేదా
- క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ లీటరు నీటికి (ఎకరానికి 60 మి.లీ 200 లీటర్ల నీటిలో) పిచికారీ చేయాలి.`,
    normalizedTeluguText: `వరి కాండం తొలిచే పురుగు: పిలక దశలో మొవ్వు కుళ్ళు, ఈనె దశలో తెల్లకంకి. IPM: నారు కొసలు తుంచడం, 8 లింగాకర్షక బుట్టలు, ట్రైకోగ్రామా కార్డులు. రసాయన మందు: కార్టాప్ హైడ్రోక్లోరైడ్ 50% SP @ 2 గ్రా/లీ లేదా క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ/లీ.`,
    englishText: `Paddy Yellow Stem Borer (Scirpophaga incertulas) Integrated Management: Larvae bore into culms, causing 'Dead Hearts' in vegetative stage and chaffy 'White Ears' in reproductive stage. ETL: 1 egg mass/m² or 5% dead hearts or 2% white ears. IPM: Clip seedling leaf tips before transplanting to destroy egg masses; install 8–10 pheromone traps/acre; release Trichogramma japonicum @ 40,000/acre 3 times. Chemical Control (when ETL exceeded): Cartap Hydrochloride 50% SP @ 2.0 g/L (400 g/acre) OR Chlorantraniliprole 18.5% SC @ 0.3 mL/L (60 mL/acre in 200 L water).`,
    keywords: ["stem borer", "కాండం తొలిచే పురుగు", "dead heart", "white ear", "scirpophaga", "cartap", "coragen", "వరి తెగుళ్లు"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 47,
      printedPage: 14,
      sectionHeader: "వరిలో కాండం తొలిచే పురుగు యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    ipm: {
      cultural: ["Clip seedling tips before transplanting", "Avoid excessive nitrogen fertilizers"],
      mechanical: ["Install 8-10 pheromone traps per acre with Scirpophaga lures"],
      biological: ["Release Trichogramma japonicum parasitoids @ 40,000 eggs/acre"],
    },
    verifiedChemicalId: "cartap_50_sp",
  },
  {
    id: "rec_pest_paddy_bph",
    title: "వరిలో సుడిదోమ (Brown Planthopper) సమగ్ర రక్షణ మరియు రసాయన పిచికారీ",
    crop: "Paddy",
    category: "insect_pests",
    originalTeluguText: `సుడిదోమ (Nilaparvata lugens): దుబ్బుల మొదళ్ల వద్ద ఉండి రసం పీల్చడం వల్ల చేనులో గుండ్రని మచ్చలుగా చేను ఎండిపోతుంది. దీనిని 'హాపర్ బర్న్' (Hopper Burn) లేదా సుడి అంటారు.
ముఖ్య జాగ్రత్తలు:
1. పంటలో ప్రతి 2 మీటర్లకు 20 సెం.మీ వెడల్పున 'బాటలు' (Alleyways) తీయాలి. దీనివల్ల గాలి, వెలుతురు సోకి సుడిదోమ ఉధృతి తగ్గుతుంది మరియు మందు పిచికారీ సులభమవుతుంది.
2. పొలంలో నీరు తీసివేసి 2-3 రోజులు ఆరబెట్టాలి.
3. సింథటిక్ పైరెథ్రాయిడ్స్ (డెల్టామెథ్రిన్, సైపర్‌మెథ్రిన్) వాడరాదు; ఇవి మిత్రపురుగులను చంపి సుడిదోమ పునరుత్పత్తిని పెంచుతాయి (Resurgence).
ఆర్థిక నష్ట పరిమితి (ETL): దుబ్బుకు 10-15 దోమలు.
సిఫారసు చేసిన మందులు (ఏదైనా ఒకటి):
- పైమెట్రోజైన్ 50% WG (చెస్) @ 0.6 గ్రాములు లీటరు నీటికి (ఎకరానికి 120 గ్రాములు) లేదా
- డైనోటెఫ్యూరాన్ 20% SG (టోకెన్/ఓషీన్) @ 0.4 గ్రాములు లీటరు నీటికి (ఎకరానికి 80 గ్రాములు).
పిచికారీ చేసేటప్పుడు నాజిల్ ను దుబ్బుల మొదళ్లకు గురిపెట్టి పిచికారీ చేయాలి.`,
    normalizedTeluguText: `సుడిదోమ నివారణ: ప్రతి 2 మీటర్లకు బాటలు తీయాలి. పొలంలో నీరు తీసి ఆరబెట్టాలి. పైరెథ్రాయిడ్స్ వాడరాదు! రసాయన మందు: పైమెట్రోజైన్ 50% WG @ 0.6 గ్రా/లీ లేదా డైనోటెఫ్యూరాన్ 20% SG @ 0.4 గ్రా/లీ మొదళ్లకు తగిలేలా పిచికారీ చేయాలి.`,
    englishText: `Paddy Brown Planthopper (BPH - Nilaparvata lugens): Nymphs and adults suck sap from the base of tillers, producing circular dried patches called 'Hopper Burn'. ETL: 10–15 insects/hill. Key Agronomic Practices: Form 20 cm alleyways every 2 meters for aeration and spray penetration. Drain standing water from the field for 2–3 days. NEVER spray synthetic pyrethroids (Cypermethrin, Deltamethrin), which trigger massive pest resurgence. Verified Chemical Control: Pymetrozine 50% WG @ 0.6 g/L (120 g/acre) OR Dinotefuran 20% SG @ 0.4 g/L (80 g/acre). Ensure spray is directed strictly at the base/hills of plants.`,
    keywords: ["bph", "brown planthopper", "సుడిదోమ", "hopper burn", "pymetrozine", "chess", "dinotefuran", "alleyways"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 48,
      printedPage: 15,
      sectionHeader: "వరిలో సుడిదోమ మరియు తెల్లవీపు దోమ నివారణ",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    ipm: {
      cultural: ["Provide 20 cm alleyways every 2 meters", "Drain standing water for 48 hours", "Avoid excess nitrogen"],
      mechanical: ["Direct spray nozzle strictly to base of tillers"],
      biological: ["Conserve spiders (Lycosa pseudoannulata) and mirid bugs (Cyrtorhinus lividipennis)"],
    },
    verifiedChemicalId: "pymetrozine_50_wg",
  },
  {
    id: "rec_pest_cotton_pink_bollworm",
    title: "పత్తిలో గులాబీ రంగు పురుగు (Pink Bollworm) గుర్తింపు మరియు సస్యరక్షణ",
    crop: "Cotton",
    category: "insect_pests",
    originalTeluguText: `గులాబీ రంగు పురుగు (Pectinophora gossypiella): పూత దశలో పువ్వు రేకలను కలిపి ముడివేస్తుంది, దీనిని 'రోసెట్ పువ్వు' (Rosetted Flower) అంటారు. కాయలపై కనిపించని సూక్ష్మ రంధ్రం ద్వారా లార్వా లోపలికి ప్రవేశించి గింజలను, పత్తి పీచును తిని డ్యామేజ్ చేస్తుంది.
ఈటీఎల్ (ETL): ఎకరానికి పెట్టిన లింగాకర్షక బుట్టలలో వరుసగా 3 రోజులు రోజుకు 8 లేదా అంతకంటే ఎక్కువ మగ రెక్కల పురుగులు పడినా లేదా 10% పచ్చి కాయలలో పురుగు నష్టం కనిపించినా సస్యరక్షణ చేపట్టాలి.
నివారణ చర్యలు:
1. ఎకరానికి 8 లింగాకర్షక బుట్టలు అమర్చాలి.
2. వేప నూనె (10,000 ppm) @ 2 మి.లీ లీటరు నీటికి పిచికారీ చేయాలి.
3. పూత దశలో ట్రైకోగ్రామా బాక్ట్రే పరాన్నజీవులను ఎకరానికి 60,000 వంతున విడుదల చేయాలి.
4. పురుగు ఉధృతి ఉన్నప్పుడు: ఎమామెక్టిన్ బెంజోయేట్ 5% SG @ 0.4 గ్రాములు లీటరు నీటికి (ఎకరానికి 80 గ్రాములు) లేదా ప్రొఫెనోఫాస్ 50% EC @ 2.0 మి.లీ లీటరు నీటికి పిచికారీ చేయాలి.`,
    normalizedTeluguText: `గులాబీ రంగు పురుగు: రోసెట్ పువ్వులు, కాయ లోపలి గింజలు దెబ్బతినడం. ETL: బుట్టలో రోజుకు 8 పురుగులు. IPM: 8 లింగాకర్షక బుట్టలు, వేప నూనె 2 మి.లీ/లీ. రసాయన మందు: ఎమామెక్టిన్ బెంజోయేట్ 5% SG @ 0.4 గ్రా/లీ (80 గ్రా/ఎకరానికి).`,
    englishText: `Cotton Pink Bollworm (Pectinophora gossypiella): Causes 'Rosetted Flowers' by webbing petals together. Larvae bore into developing bolls, feeding on seeds and staining lint. ETL: 8 moths/trap/day for 3 consecutive days OR 10% damaged green bolls. IPM: Install 8 pheromone traps/acre; spray 5% NSKE or Neem Oil (10,000 ppm) @ 2 mL/L; release Trichogramma bactrae @ 60,000/acre. Chemical Control: Emamectin Benzoate 5% SG @ 0.4 g/L (80 g/acre) OR Profenofos 50% EC @ 2.0 mL/L.`,
    keywords: ["pink bollworm", "గులాబీ రంగు పురుగు", "cotton pest", "rosetted flower", "emamectin", "proclaim", "pheromone trap"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "August 2024",
      filename: "vyavasayam-August-2024.pdf",
      pdfPage: 12,
      printedPage: 10,
      sectionHeader: "పత్తి పంటలో గులాబీ రంగు పురుగు సస్యరక్షణ ప్రణాళిక",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    ipm: {
      cultural: ["Plant non-Bt refugia rows", "Destroy crop residue and avoid ratoon cotton"],
      mechanical: ["Erect 8 pheromone traps per acre at crop canopy height"],
      biological: ["Release Trichogramma bactrae egg parasitoids"],
    },
    verifiedChemicalId: "emamectin_5_sg",
  },
  {
    id: "rec_pest_chilli_thrips_mites",
    title: "మిరపలో పైముడత (తామర పురుగులు) మరియు కిందిముడత (నల్లి) వ్యత్యాసం & నివారణ",
    crop: "Chilli",
    category: "insect_pests",
    originalTeluguText: `రైతులు మిరపలో ఆకుముడత వచ్చినప్పుడు తామర పురుగులా లేక నల్లి పురుగులా అని గుర్తించకుండా తప్పుడు మందులు కొట్టి నష్టపోతున్నారు.
1. పైముడత (తామర పురుగులు - Thrips):
- ఆకులు పైకి దోనెల్లా ముడుచుకుంటాయి. ఆకుల అడుగున గోధుమ రంగు గీతలు కనిపిస్తాయి.
- నివారణ: ఎకరానికి 20 నీలి రంగు జిగురు అట్టలు అమర్చాలి. రసాయన మందు: ఫిప్రోనిల్ 5% SC @ 2.0 మి.లీ లీటరు నీటికి లేదా స్పైనెటోరమ్ 11.7% SC @ 0.9 మి.లీ లీటరు నీటికి పిచికారీ చేయాలి.
2. కిందిముడత (పచ్చ నల్లి - Yellow Mites):
- ఆకులు బోర్లించిన పడవలా కిందికి ముడుచుకుంటాయి. ఆకుల తొడిమలు సాగిపోతాయి, ఆకులు మందంగా ముదురు ఆకుపచ్చగా మారతాయి.
- నివారణ: ఎకరానికి 20 పసుపు రంగు జిగురు అట్టలు అమర్చాలి. రసాయన మందు: స్పైరోమెసిఫెన్ 22.9% SC (ఒబెరాన్) @ 1.0 మి.లీ లీటరు నీటికి లేదా డయాఫెంథియురాన్ 50% WP @ 1.25 గ్రాములు లీటరు నీటికి ఆకుల అడుగుభాగం తడిచేలా పిచికారీ చేయాలి.`,
    normalizedTeluguText: `మిరప ముడత రకాలు: ఆకులు పైకి ముడుచుకుంటే తామర పురుగులు (ఫిప్రోనిల్ 5% SC @ 2 మి.లీ/లీ, నీలి జిగురు అట్టలు). ఆకులు కిందికి ముడుచుకుంటే నల్లి (స్పైరోమెసిఫెన్ 22.9% SC @ 1 మి.లీ/లీ, ఆకుల అడుగున పిచికారీ).`,
    englishText: `Chilli Leaf Curl Differentiation — Thrips vs Mites:
1. Upward Curling (Thrips): Leaf margins curl upward like a boat/cup with brown streaks underneath. Management: Install 20 blue sticky traps/acre. Spray Fipronil 5% SC @ 2.0 mL/L OR Spinetoram 11.7% SC @ 0.9 mL/L.
2. Downward Curling (Yellow Mites): Leaf margins curl downward like an inverted boat; petioles elongate and leaves turn brittle/leathery dark green. Management: Install yellow sticky traps. Spray Spiromesifen 22.9% SC @ 1.0 mL/L OR Diafenthiuron 50% WP @ 1.25 g/L with thorough under-leaf coverage.`,
    keywords: ["chilli leaf curl", "thrips", "mites", "పైముడత", "కిందిముడత", "తామర పురుగులు", "నల్లి", "fipronil", "spiromesifen"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "October 2024",
      filename: "vyavasayam-October-2024.pdf",
      pdfPage: 22,
      printedPage: 20,
      sectionHeader: "మిరపలో రసం పీల్చే పురుగుల యాజమాన్యం",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    verifiedChemicalId: "fipronil_5_sc",
  },
  {
    id: "rec_pest_maize_fall_armyworm",
    title: "మొక్కజొన్నలో కత్తెర పురుగు (Fall Armyworm) సమగ్ర నివారణ పద్ధతులు",
    crop: "Maize",
    category: "insect_pests",
    originalTeluguText: `కత్తెర పురుగు (Spodoptera frugiperda): మొక్కజొన్న సుడులలో చేరి పత్రహరితాన్ని కొరికి తిని అధిక మోతాదులో రంపపు పొట్టు లాంటి మలాన్ని విసర్జిస్తుంది. ఆకులు విచ్చుకున్నప్పుడు వరసగా గుండ్రని రంధ్రాలు కనిపిస్తాయి.
నివారణ చర్యలు:
1. విత్తిన 10-15 రోజులకు ఎకరానికి 4 లింగాకర్షక బుట్టలు పెట్టాలి.
2. మొక్కజొన్న సుడులలో పొడి ఇసుక లేదా సున్నం+ఇసుక మిశ్రమం (1:9 నిష్పత్తిలో) వేయడం వల్ల లార్వాలు సుడులనుండి బయటకు వచ్చి నశిస్తాయి.
3. రసాయన పిచికారీ: క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ లీటరు నీటికి లేదా ఎమామెక్టిన్ బెంజోయేట్ 5% SG @ 0.4 గ్రాములు లీటరు నీటికి సుడి లోపలికి మందు పడేలా నాజిల్ ను విప్పి పిచికారీ చేయాలి.`,
    normalizedTeluguText: `మొక్కజొన్న కత్తెర పురుగు: సుడుల్లో రంపపు పొట్టు లాంటి విసర్జన, ఆకులపై వరుస రంధ్రాలు. ఇసుక-సున్నం (9:1) మిశ్రమం సుడుల్లో వేయాలి. రసాయన మందు: క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ/లీ లేదా ఎమామెక్టిన్ బెంజోయేట్ @ 0.4 గ్రా/లీ సుడులలో పడేలా పిచికారీ చేయాలి.`,
    englishText: `Maize Fall Armyworm (Spodoptera frugiperda): Larvae feed inside central plant whorls, producing characteristic sawdust-like fecal frass and ragged rows of holes on expanded leaves. Management: Drop dry sand + lime mixture (9:1 ratio) directly into whorls. Chemical spray: Direct nozzle straight into plant whorls with Chlorantraniliprole 18.5% SC @ 0.3 mL/L OR Emamectin Benzoate 5% SG @ 0.4 g/L.`,
    keywords: ["fall armyworm", "కత్తెర పురుగు", "spodoptera frugiperda", "maize pest", "coragen", "emamectin"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 82,
      printedPage: 49,
      sectionHeader: "మొక్కజొన్నలో కత్తెర పురుగు యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    verifiedChemicalId: "coragen_18_5_sc",
  },

  // ==========================================
  // 6. PLANT DISEASES & PATHOLOGY
  // ==========================================
  {
    id: "rec_dis_paddy_blast",
    title: "వరి అగ్గితెగులు (Blast Disease) నివారణ మరియు మందుల పిచికారీ",
    crop: "Paddy",
    category: "plant_diseases",
    originalTeluguText: `అగ్గితెగులు (Pyricularia oryzae): ఆకులపై కదురు ఆకారంలో ఇరువైపులా మొనదేలిన మచ్చలు ఏర్పడతాయి. మచ్చల మధ్య భాగం బూడిద రంగులో, అంచులు ముదురు గోధుమ రంగులో ఉంటాయి. ఈనె దశలో కంకి మెడ వద్ద నల్లటి మచ్చ ఏర్పడి కంకి విరిగిపోతుంది (Neck Blast).
అనుకూల వాతావరణం: రాత్రి ఉష్ణోగ్రతలు 20 డిగ్రీల కన్నా తగ్గడం, మంచు కురవడం, అధిక నత్రజని వాడకం.
నివారణ:
1. నత్రజని ఎరువులను అధికంగా వాడకూడదు; నత్రజనిని విడతల వారీగా వేయాలి.
2. లక్షణాలు కనిపించగానే: ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రాములు లీటరు నీటికి (ఎకరానికి 120 గ్రాములు) లేదా ఐసోప్రోథియోలేన్ 40% EC @ 1.5 మి.లీ లీటరు నీటికి లేదా ట్రైఫ్లాక్సీస్ట్రోబిన్ + టెబుకొనజోల్ 75% WG (నటివో) @ 0.4 గ్రాములు లీటరు నీటికి పిచికారీ చేయాలి.`,
    normalizedTeluguText: `వరి అగ్గితెగులు: ఆకులపై బూడిద కేంద్రంతో కదురు ఆకారపు మచ్చలు, మెడ విరుపు. చల్లని వాతావరణం, మంచులో ఉధృతి. నత్రజని తగ్గించాలి. మందు: ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ లేదా నటివో @ 0.4 గ్రా/లీ పిచికారీ చేయాలి.`,
    englishText: `Paddy Blast (Pyricularia oryzae): Symptoms include diamond/spindle-shaped lesions with ash-grey centers and reddish-brown margins on leaf blades. Panicle neck rot (Neck Blast) turns neck nodes black and breaks panicles, causing complete grain sterility. Favorable Weather: High humidity (>90%), cool nights (<20°C), heavy morning dew, and excessive nitrogen application. Chemical Management: Tricyclazole 75% WP @ 0.6 g/L (120 g/acre) OR Isoprothiolane 40% EC @ 1.5 mL/L OR Trifloxystrobin + Tebuconazole 75% WG (Nativo) @ 0.4 g/L.`,
    keywords: ["blast", "paddy blast", "అగ్గితెగులు", "neck blast", "మెడ విరుపు", "tricyclazole", "nativo", "pyricularia"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 51,
      printedPage: 18,
      sectionHeader: "వరిలో తెగుళ్ల యాజమాన్యం — అగ్గితెగులు",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    verifiedChemicalId: "tricyclazole_75_wp",
  },
  {
    id: "rec_dis_paddy_sheath_blight",
    title: "వరి పొడ తెగులు (Sheath Blight) లక్షణాలు మరియు సస్యరక్షణ",
    crop: "Paddy",
    category: "plant_diseases",
    originalTeluguText: `పొడ తెగులు (Rhizoctonia solani): నీటి మట్టం వద్ద ఆకు తొడుగులపై పాము చర్మం లాంటి ఆకుపచ్చని బూడిద రంగు మచ్చలు ఏర్పడతాయి. మచ్చల చుట్టూ ముదురు గోధుమ రంగు సరిహద్దు ఉంటుంది. తెగులు పై ఆకులకు మరియు కంకులకు పాకి తీవ్ర నష్టం కలిగిస్తుంది.
నివారణ:
- దుబ్బులు దట్టంగా ఉన్నచోట, అధిక యూరియా వాడిన చోట ఉధృతి ఎక్కువ.
- పిచికారీ: హెక్సాకొనజోల్ 5% SC @ 2.0 మి.లీ లీటరు నీటికి లేదా వాలిడామైసిన్ 3% L @ 2.0 మి.లీ లీటరు నీటికి లేదా ప్రాపికొనజోల్ 25% EC @ 1.0 మి.లీ లీటరు నీటికి మొక్క మొదళ్ళు, దిగువ ఆకు తొడుగులు బాగా తడిచేలా పిచికారీ చేయాలి.`,
    normalizedTeluguText: `వరి పొడ తెగులు: నీటి మట్టం వద్ద ఆకు తొడుగులపై పాము పొలుసుల వంటి మచ్చలు. మందు: హెక్సాకొనజోల్ 5% SC @ 2 మి.లీ/లీ లేదా వాలిడామైసిన్ 3% L @ 2 మి.లీ/లీ మొక్కల మొదళ్ళపై పిచికారీ చేయాలి.`,
    englishText: `Paddy Sheath Blight (Rhizoctonia solani): Manifests as greenish-grey, oval, serpent-skin-like water-soaked lesions with distinct dark brown borders on leaf sheaths just above water level. Ascends to upper leaves in humid dense canopies. Management: Hexaconazole 5% SC @ 2.0 mL/L (400 mL/acre) OR Validamycin 3% L @ 2.0 mL/L OR Propiconazole 25% EC @ 1.0 mL/L. Ensure spray thoroughly saturates the plant bases and lower sheaths.`,
    keywords: ["sheath blight", "పొడ తెగులు", "rhizoctonia", "hexaconazole", "validamycin", "వరి మచ్చ తెగులు"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 52,
      printedPage: 19,
      sectionHeader: "వరిలో పొడ తెగులు యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    verifiedChemicalId: "hexaconazole_5_sc",
  },
  {
    id: "rec_dis_paddy_blb",
    title: "వరిలో బాక్టీరియా ఆకు ఎండు తెగులు (BLB) సత్వర నివారణ జాగ్రత్తలు",
    crop: "Paddy",
    category: "plant_diseases",
    originalTeluguText: `బాక్టీరియా ఆకు ఎండు తెగులు (Xanthomonas oryzae pv. oryzae): ఆకుల చివర్ల నుండి అంచుల వెంబడి అలల ఆకారంలో (Wavy Margins) పసుపు-తెలుపు రంగులో ఆకులు ఎండిపోతాయి. తెల్లవారుజామున ఆకుల అడుగున చిన్న తుంపరల వంటి బాక్టీరియా జిగురు బిందువులు కనిపిస్తాయి.
అత్యవసర చర్యలు:
1. తెగులు కనిపించిన వెంటనే యూరియా/నత్రజని వేయడం తక్షణమే ఆపివేయాలి.
2. పొలంలోని నీటిని పూర్తిగా తీసివేసి 3-4 రోజులు ఆరబెట్టాలి (ఒక పొలం నుండి మరొక పొలానికి నీరు పారించరాదు).
3. పిచికారీ: కాపర్ ఆక్సిక్లోరైడ్ 50% WP @ 3.0 గ్రాములు + స్ట్రెప్టోసైక్లిన్ @ 0.1 గ్రాము (10 లీటర్ల నీటికి 1 గ్రాము) కలిపి పిచికారీ చేయాలి.`,
    normalizedTeluguText: `బాక్టీరియా ఆకు ఎండు తెగులు (BLB): ఆకు అంచుల వెంబడి అలల వలె ఎండిపోవడం. వెంటనే యూరియా ఆపాలి, నీరు తీసి ఆరబెట్టాలి. మందు: కాపర్ ఆక్సిక్లోరైడ్ 3 గ్రా + స్ట్రెప్టోసైక్లిన్ 0.1 గ్రా లీటరు నీటికి కలిపి పిచికారీ చేయాలి.`,
    englishText: `Bacterial Leaf Blight (BLB - Xanthomonas oryzae): Symptoms start as water-soaked stripes at leaf margins, rapidly expanding into wavy straw-yellow drying zones from tips downward. Amber-colored bacterial ooze droplets appear in early morning dew. Immediate Cultural Interventions: STOP all nitrogen/urea top-dressing instantly. Drain all standing water from the field for 3–4 days to prevent swimming pathogen spread. Chemical Spray: Copper Oxychloride 50% WP @ 3.0 g/L + Plantomycin/Streptocycline @ 0.1 g/L (1g per 10 L water).`,
    keywords: ["blb", "bacterial leaf blight", "బాక్టీరియా ఆకు ఎండు తెగులు", "xanthomonas", "streptocycline", "copper oxychloride"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 53,
      printedPage: 20,
      sectionHeader: "బాక్టీరియా ఆకు ఎండు తెగులు",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    verifiedChemicalId: "copper_oxychloride_50_wp",
  },
  {
    id: "rec_dis_chilli_dieback",
    title: "మిరపలో కొమ్మ ఎండు / కాయ కుళ్ళు తెగులు (Dieback & Anthracnose) నివారణ",
    crop: "Chilli",
    category: "plant_diseases",
    originalTeluguText: `కొమ్మ ఎండు మరియు కాయ కుళ్ళు తెగులు (Colletotrichum capsici): కొమ్మల చివర్ల నుండి కిందికి ఎండిపోవడం వల్ల మొక్కలు కొయ్యల్లా మారిపోతాయి. పండిన కాయలపై నల్లటి గుండ్రని నొక్కుడు మచ్చలు ఏర్పడి కాయలు కుళ్ళి రాలిపోతాయి.
నివారణ:
1. విత్తే ముందు విత్తనశుద్ధి చేయాలి (క్యాప్టాన్ లేదా థైరామ్ 3 గ్రా/కిలో విత్తనానికి).
2. పిచికారీ: అజోక్సిస్ట్రోబిన్ 23% SC @ 1.0 మి.లీ లీటరు నీటికి లేదా మాంకోజెబ్ 75% WP @ 2.5 గ్రాములు లీటరు నీటికి లేదా కాపర్ ఆక్సిక్లోరైడ్ 50% WP @ 3.0 గ్రాములు లీటరు నీటికి పూత మరియు కాయ దశలలో 15 రోజుల వ్యవధిలో రెండుసార్లు పిచికారీ చేయాలి.`,
    normalizedTeluguText: `మిరప కొమ్మ ఎండు, కాయ కుళ్ళు: కొమ్మల పైనుండి కిందికి ఎండటం, కాయలపై గుండ్రని మచ్చలు. మందు: అజోక్సిస్ట్రోబిన్ 23% SC @ 1 మి.లీ/లీ లేదా మాంకోజెబ్ @ 2.5 గ్రా/లీ పిచికారీ చేయాలి.`,
    englishText: `Chilli Dieback & Fruit Rot / Anthracnose (Colletotrichum capsici): Necrosis starts at branch tips and progresses downwards (dieback), leaving dead skeleton twigs. Circular sunken black spots with concentric rings develop on mature ripe fruits. Management: Azoxystrobin 23% SC @ 1.0 mL/L OR Mancozeb 75% WP @ 2.5 g/L OR Copper Oxychloride 50% WP @ 3.0 g/L at flowering and fruit formation stages.`,
    keywords: ["chilli dieback", "anthracnose", "కొమ్మ ఎండు", "కాయ కుళ్ళు", "colletotrichum", "azoxystrobin"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "November 2024",
      filename: "vyavasayam-November-2024.pdf",
      pdfPage: 18,
      printedPage: 16,
      sectionHeader: "మిరపలో కొమ్మ ఎండు మరియు కాయ కుళ్ళు తెగులు యాజమాన్యం",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 7. WEED MANAGEMENT
  // ==========================================
  {
    id: "rec_weed_transplanted_paddy",
    title: "నాటు వరిలో సమగ్ర కలుపు యాజమాన్యం మరియు కలుపు మందులు",
    crop: "Paddy",
    category: "weed_management",
    originalTeluguText: `వరిలో కలుపు వల్ల 30-40% దిగుబడి తగ్గుతుంది.
1. మొలక రాకముందు చల్లే కలుపు మందు (Pre-emergence):
- నాటిన 3 నుండి 5 రోజులలోపు: ప్రెటిలాక్లోర్ 50% EC @ 400 మి.లీ ఎకరానికి లేదా ఆక్సాడయర్గిల్ 80% WP @ 35 గ్రాములు ఎకరానికి 20-25 కిలోల పొడి ఇసుకలో కలిపి పొలంలో సమానంగా చల్లాలి లేదా పిచికారీ చేయాలి. మందు చల్లేటప్పుడు పొలంలో 2-3 సెం.మీ పలుచటి నీరు ఉండాలి, 48 గంటలు నీరు ఇంకిపోకుండా చూడాలి.
2. మొలక వచ్చిన తర్వాత చల్లే కలుపు మందు (Post-emergence):
- నాటిన 15 నుండి 20 రోజులకు కలుపు 2-3 ఆకుల దశలో ఉన్నప్పుడు: బిస్పైరిబాక్ సోడియం 10% SC (నామినీ గోల్డ్) @ 80-100 మి.లీ ఎకరానికి 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయాలి. పిచికారీ చేసే ముందు పొలంలోని నీటిని పూర్తిగా తీసివేసి, పిచికారీ చేసిన 2 రోజుల తర్వాత తిరిగి నీరు పెట్టాలి.`,
    normalizedTeluguText: `వరి కలుపు నివారణ: నాటిన 3-5 రోజులకు ప్రెటిలాక్లోర్ 50% EC @ 400 మి.లీ ఇసుకలో కలిపి పలుచటి నీటిలో చల్లాలి. నాటిన 15-20 రోజులకు కలుపు 2-3 ఆకుల దశలో బిస్పైరిబాక్ సోడియం @ 100 మి.లీ/ఎకరానికి నీరు తీసి పిచికారీ చేయాలి.`,
    englishText: `Transplanted Rice Weed Management:
1. Pre-emergence (3–5 DAT): Pretilachlor 50% EC @ 400 mL/acre OR Oxadiargyl 80% WP @ 35 g/acre mixed in 20–25 kg dry sand and broadcast evenly. Maintain a 2–3 cm standing water film for 48 hours without draining.
2. Post-emergence (15–20 DAT at 2–3 weed leaf stage): Bispyribac Sodium 10% SC @ 80–100 mL/acre in 200 L water. Drain standing water completely before spraying; re-irrigate field 48 hours later.`,
    keywords: ["paddy weed", "pretilachlor", "bispyribac sodium", "కలుపు యాజమాన్యం", "నామినీ గోల్డ్", "nominee gold", "herbicides"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 41,
      printedPage: 8,
      sectionHeader: "వరిలో కలుపు యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
    verifiedChemicalId: "pretilachlor_50_ec",
  },

  // ==========================================
  // 8. BIOLOGICAL CONTROL & INTEGRATED PEST MANAGEMENT (IPM)
  // ==========================================
  {
    id: "rec_ipm_bio_agents",
    title: "తెలంగాణ పంటలలో జీవ నియంత్రణ మరియు మిత్రపురుగుల సంరక్షణ",
    crop: "General",
    category: "biological_ipm",
    originalTeluguText: `రసాయన మందుల వాడకాన్ని తగ్గించి పర్యావరణ హిత వ్యవసాయం చేయడానికి PJTAU సిఫారసులు:
1. ట్రైకోగ్రామా పరాన్నజీవులు: వరి కాండం తొలిచే పురుగు, పత్తి గులాబీ రంగు పురుగు, మొక్కజొన్న కత్తెర పురుగు గుడ్లను నాశనం చేస్తాయి. ఎకరానికి 40,000-50,000 గుడ్ల కార్డులను పొలంలో అక్కడక్కడ అమర్చాలి.
2. ఎన్.పి.వి (NPV వైరస్): శనగపచ్చ పురుగు నివారణకు హెచ్.ఎన్.పి.వి (HNPV) 200 LE ఎకరానికి సాయంత్రం వేళల్లో పిచికారీ చేయాలి.
3. వేప ఉత్పత్తులు: వేపనూనె (10,000 ppm) @ 2 మి.లీ లేదా 5% వేప గింజల కషాయం (NSKE) రసం పీల్చే పురుగులు మరియు లద్దె పురుగుల గుడ్లు పెట్టకుండా అరికడుతుంది.
4. ఆకర్షక పంటలు (Trap Crops): పత్తి చుట్టూ బంతి లేదా ఆముదం మొక్కలు నాటడం ద్వారా శనగపచ్చ పురుగు, పొగాకు లద్దె పురుగులను పత్తికి చేరకుండా నిరోధించవచ్చు.`,
    normalizedTeluguText: `జీవ నియంత్రణ: ట్రైకోగ్రామా కార్డులు (40,000/ఎకరం), వేప నూనె 2 మి.లీ/లీ, పత్తిలో బంతి/ఆముదం ఆకర్షక పంటలు. రసాయన మందుల ఖర్చు తగ్గి మిత్రపురుగులు రక్షించబడతాయి.`,
    englishText: `Biological Control & Beneficial Conservation:
1. Trichogramma Egg Parasitoids: Parasitizes eggs of Stem Borer, Bollworms, and Armyworms. Release 40,000–50,000 parasitoids/acre using egg cards.
2. Botanical Sprays: Neem Oil (10,000 ppm) @ 2 mL/L or 5% Neem Seed Kernel Extract (NSKE) acts as oviposition deterrent and feeding inhibitor.
3. Trap Crops: Planting Marigold or Castor border rows around Cotton attracts Helicoverpa and Spodoptera away from the main crop.`,
    keywords: ["biological control", "ipm", "trichogramma", "nske", "జీవ నియంత్రణ", "వేప నూనె", "trap crops", "మిత్రపురుగులు"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "May 2024",
      filename: "vyavasayam-may-2024.pdf",
      pdfPage: 16,
      printedPage: 14,
      sectionHeader: "పంటలలో జీవ నియంత్రణ పద్ధతులు",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 9. HORTICULTURE & CASH CROPS
  // ==========================================
  {
    id: "rec_hort_turmeric_rhizome_rot",
    title: "పసుపులో దుంప కుళ్ళు తెగులు (Rhizome Rot) సమగ్ర నివారణ",
    crop: "Turmeric",
    category: "horticulture",
    originalTeluguText: `తెలంగాణలోని నిజామాబాద్, జగిత్యాల జిల్లాల్లో పసుపు ప్రధాన వాణిజ్య పంట. దుంప కుళ్ళు (Pythium aphanidermatum): నేలలో నీరు నిలిచిపోయినప్పుడు దుంపలు మెత్తబడి కుళ్ళి దుర్వాసన వస్తాయి, ఆకులు పసుపు రంగులోకి మారి ఎండిపోతాయి.
నివారణ:
1. విత్తే ముందు విత్తన దుంపలను మెటలాక్సిల్ 8% + మాంకోజెబ్ 64% WP @ 2.5 గ్రాములు లీటరు నీటికి కలిపిన ద్రావణంలో 40 నిమిషాలు నానబెట్టి ఆరబెట్టి విత్తుకోవాలి.
2. పొలంలో నీరు నిల్వ ఉండకుండా మురుగు నీటి కాలువలు తీయాలి.
3. తెగులు లక్షణాలు కనిపించగానే: మొక్కల మొదళ్ళ వద్ద కాపర్ ఆక్సిక్లోరైడ్ 50% WP @ 3.0 గ్రాములు లీటరు నీటికి లేదా మెటలాక్సిల్-మాంకోజెబ్ @ 2.5 గ్రాములు లీటరు నీటికి కలిపి మొదళ్ళు తడిచేలా ద్రావణాన్ని తడపాలి (Drenching).`,
    normalizedTeluguText: `పసుపు దుంప కుళ్ళు: నీరు నిలవడం వల్ల దుంపలు కుళ్ళిపోవడం. విత్తనశుద్ధి: మెటలాక్సిల్ + మాంకోజెబ్ 2.5 గ్రా/లీ లో 40 నిమిషాలు నానబెట్టాలి. పొలంలో మురుగు కాలువలు తీయాలి. మొదళ్ల వద్ద డ్రెంచింగ్ చేయాలి.`,
    englishText: `Turmeric Rhizome Rot (Pythium aphanidermatum): Highly destructive in Nizamabad and Jagtial districts under poor drainage. Rhizomes turn soft and rot with a foul odor; foliage turns yellow and collapses. Management: Pre-sowing rhizome seed treatment by soaking in Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L for 40 minutes. Ensure perfect drainage via raised beds or ridges. At first symptom: Soil drench base of plants with Copper Oxychloride 50% WP @ 3.0 g/L or Ridomil MZ @ 2.5 g/L.`,
    keywords: ["turmeric", "rhizome rot", "పసుపు", "దుంప కుళ్ళు", "pythium", "drenching", "metalaxyl"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 198,
      printedPage: 165,
      sectionHeader: "పసుపులో దుంపకుళ్ళు తెగులు యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 10. AGRICULTURAL ENGINEERING & MECHANIZATION
  // ==========================================
  {
    id: "rec_eng_paddy_transplanter",
    title: "వరి యాంత్రిక నాట్లు (Mechanical Transplanter) పద్ధతి",
    crop: "Paddy",
    category: "agri_engineering",
    originalTeluguText: `కూలీల కొరతను అధిగమించడానికి సెల్ఫ్ ప్రొపెల్డ్ 4-వరుసలు లేదా 8-వరుసల పాడీ ట్రాన్స్‌ప్లాంటర్ ఉత్తమ ప్రత్యామ్నాయం.
పద్ధతి:
- ప్లాస్టిక్ ట్రేలలో మ్యాట్ నర్సరీ (Mat Nursery) పెంచాలి. ఎకరానికి 10-12 కిలోల విత్తనాలు సరిపోతాయి.
- 15-18 రోజుల లేత నారును యంత్రం ద్వారా సమదూరంలో (30x14 సెం.మీ లేదా 30x12 సెం.మీ) నాటవచ్చు.
- రోజుకు ఒక యంత్రంతో 4 నుండి 5 ఎకరాలు నాటవచ్చు.
- ఎకరానికి రూ. 3000 నుండి 4000 వరకు కూలీల ఖర్చు ఆదా అవుతుంది మరియు దుబ్బులు బలంగా చేసి పిలకలు ఎక్కువగా వస్తాయి.`,
    normalizedTeluguText: `వరి యాంత్రిక నాట్లు: మ్యాట్ నర్సరీ ద్వారా ఎకరానికి 10-12 కిలోల విత్తనాలు. 15-18 రోజుల లేత నారు నాటడం వల్ల అధిక పిలకలు, ఎకరానికి రూ. 4000 ఆదా.`,
    englishText: `Mechanical Paddy Transplanting: 4-row or 8-row self-propelled transplanters solve acute farm labor shortages. Requires mat nursery raised on plastic trays (seed rate: 10–12 kg/acre). Transplants 15–18 day tender seedlings at uniform 30x14 cm spacing. Covers 4–5 acres/day. Yields increase by 10–15% due to reduced root shock and superior tillering.`,
    keywords: ["mechanical transplanter", "mat nursery", "వరి యాంత్రిక నాట్లు", "farm mechanization", "వ్యవసాయ యంత్రాలు"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 421,
      printedPage: 388,
      sectionHeader: "వరి సాగులో యాంత్రీకరణ — నాటు యంత్రాలు",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 11. POSTHARVEST & STORAGE
  // ==========================================
  {
    id: "rec_post_grain_storage",
    title: "ధాన్యపు నిల్వలో తేమ శాతం మరియు పురుగుల బారిన పడకుండా జాగ్రత్తలు",
    crop: "General",
    category: "postharvest_management",
    originalTeluguText: `వరి ధాన్యాన్ని నిల్వ చేసే ముందు ఎండబెట్టి తేమ శాతాన్ని 13-14% వరకు తీసుకురావాలి. అధిక తేమ ఉంటే బూజు పట్టి గింజలు రంగు మారతాయి.
నిల్వ గోదాములలో పొగబెట్టడం (Fumigation):
- గోనె సంచుల బయటి ఉపరితలంపై మలాథియాన్ 50% EC ని 1:100 నిష్పత్తిలో నీటిలో కలిపి పిచికారీ చేయాలి.
- ధాన్యపు పురుగుల (ముక్కు పురుగు, కల్తీ పురుగు) నివారణకు అల్యూమినియం ఫాస్ఫైడ్ 3 గ్రాముల బిళ్ళలను టన్ను ధాన్యానికి 3 చొప్పున వేసి ప్లాస్టిక్ కవర్లతో గాలి చొరబడకుండా 7 రోజుల పాటు కప్పి ఉంచాలి.`,
    normalizedTeluguText: `ధాన్యపు నిల్వ: 13-14% తేమ శాతానికి ఎండబెట్టాలి. గోనె సంచులపై మలాథియాన్ పిచికారీ. నిల్వ పురుగుల నివారణకు అల్యూమినియం ఫాస్ఫైడ్ బిళ్ళలతో గాలి చొరబడకుండా ధూపం చేయాలి.`,
    englishText: `Grain Storage & Postharvest Moisture Management: Sun-dry paddy grains to 13–14% moisture before bagging to prevent fungal heating and discolouration. Warehouse Sanitation: Spray gunny bag stacks with Malathion 50% EC (1:100 dilution). For storage weevils and borers, fumigate under airtight tarpaulins with Aluminium Phosphide @ 3 tablets (3g each) per tonne of grain for 7 days.`,
    keywords: ["grain storage", "grain moisture", "ధాన్యపు నిల్వ", "fumigation", "aluminium phosphide", "malathion"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 450,
      printedPage: 417,
      sectionHeader: "ధాన్యం నిల్వ యాజమాన్యం",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 12. AGRICULTURAL TECHNOLOGY (DRONES & DIGITAL)
  // ==========================================
  {
    id: "rec_tech_drone_spraying",
    title: "వ్యవసాయంలో డ్రోన్ల ద్వారా పురుగుమందుల పిచికారీ మార్గదర్శకాలు (SOP)",
    crop: "General",
    category: "agri_technology",
    originalTeluguText: `తెలంగాణ ప్రభుత్వం మరియు PJTAU ఆమోదించిన కిసాన్ డ్రోన్ పిచికారీ నిబంధనలు:
1. నీటి పరిమాణం: ఎకరానికి 10 నుండి 12 లీటర్ల నీరు అవసరం (అల్ట్రా లో వాల్యూమ్ ULV నాజిల్స్).
2. ఎగిరే ఎత్తు: పంట పైకప్పు (Crop Canopy) నుండి 1.5 నుండి 2.0 మీటర్ల ఎత్తులో గంటకు 15-20 కి.మీ వేగంతో డ్రోన్ ఎగరాలి.
3. గాలి వేగం: గాలి వేగం గంటకు 10 కి.మీ మించకూడదు (గాలి తీవ్రత ఉంటే డ్రిఫ్ట్ జరిగి పక్క పొలాలకు మందు కొట్టుకుపోతుంది).
4. సమయం: తెల్లవారుజామున 6-9 గంటల మధ్య లేదా సాయంత్రం 4-6:30 మధ్య మాత్రమే పిచికారీ చేయాలి.
5. భద్రత: డ్రోన్ ఆపరేటర్ సర్టిఫైడ్ పైలట్ అయి ఉండాలి, రసాయన మిశ్రమం తయారీలో రక్షణ తొడుగులు తప్పనిసరి.`,
    normalizedTeluguText: `డ్రోన్ పిచికారీ SOP: ఎకరానికి 10-12 లీటర్ల నీరు, పంట నుండి 1.5-2 మీటర్ల ఎత్తు. గాలి వేగం 10 కి.మీ/గం లోపు ఉండాలి. ఉదయం లేదా సాయంత్రం మాత్రమే పిచికారీ.`,
    englishText: `Agricultural Drone Spraying Standard Operating Procedure (SOP):
1. Spray Volume: 10–12 Litres of water per acre using Ultra-Low Volume (ULV) atomizing nozzles.
2. Flight Altitude: 1.5 to 2.0 meters above the crop canopy at an operational speed of 15–20 km/h.
3. Wind Limitations: Abort spraying if wind speed exceeds 10 km/h to prevent droplet drift onto adjacent fields.
4. Timing: Early morning (6:00–9:00 AM) or late afternoon (4:00–6:30 PM) to avoid thermal updrafts and bee activity.
5. Pilot Certification: DGCA Remote Pilot Certificate mandatory.`,
    keywords: ["drone spraying", "కిసాన్ డ్రోన్", "kisan drone", "agri drone sop", "drone water volume", "precision spraying"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "March 2024",
      filename: "vyavasayam-March-2024.pdf",
      pdfPage: 28,
      printedPage: 26,
      sectionHeader: "వ్యవసాయంలో డ్రోన్ల వినియోగం — ప్రామాణిక నిర్వహణ పద్ధతులు (SOP)",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-20",
    dosageConfidence: "high_verified",
  },

  // ==========================================
  // 12. ADVANCED BIOLOGICAL CONTROL & BIO-INPUTS
  // ==========================================
  {
    id: "rec_bio_trichoderma_biocontrol",
    title: "ట్రైకోడెర్మా విరిడే / హార్జియానమ్ జీవ శిలీంద్ర నాశిని (Trichoderma Bio-Fungicide)",
    crop: "All",
    category: "biological_ipm",
    originalTeluguText: `ట్రైకోడెర్మా విరిడే (Trichoderma viride) మరియు ట్రైకోడెర్మా హార్జియానమ్ (Trichoderma harzianum) పంటలలో నేల మరియు విత్తన సంక్రమణ తెగుళ్ళను అరికట్టే అత్యంత శక్తివంతమైన మిత్ర జీవ శిలీంద్రాలు (Antagonistic Beneficial Fungi).
లక్ష్యం:
శనగ, కంది, వేరుశనగ, పత్తి, మిరప, టమాటా మరియు పసుపు పంటలలో వచ్చే వేరు కుళ్ళు (Root Rot), మొవ్వు కుళ్ళు (Collar Rot), నారుకుళ్ళు (Damping Off), కాండం కుళ్ళు (Stem Rot), మరియు ఎండు తెగులు / విల్ట్ (Fusarium Wilt) లను సమర్థవంతంగా నివారిస్తుంది.

వినియోగ పద్ధతులు & మోతాదులు (PJTAU సిఫారసులు):
1. విత్తన శుద్ధి (Seed Treatment): కిలో విత్తనానికి 4 నుండి 5 గ్రాముల ట్రైకోడెర్మా పొడిని కొద్దిగా గంజి లేదా బెల్లం ద్రావణంలో కలిపి విత్తనాలకు పట్టించి, 30 నిమిషాలు నీడలో ఆరబెట్టి విత్తుకోవాలి.
2. నారు వేర్ల శుద్ధి (Root Dip): మిరప, టమాటా కూరగాయ నారు నాటడానికి ముందు లీటరు నీటికి 10 గ్రాముల ట్రైకోడెర్మా కలిపి నారు వేర్లను 15-20 నిమిషాలు నానబెట్టి నాటాలి.
3. నేల యాజమాన్యం (Soil Application - అత్యుత్తమ ఫలితం): ఎకరానికి 1 నుండి 2 కిలోల ట్రైకోడెర్మా పొడిని 50-100 కిలోల బాగా మాగిన పశువుల ఎరువు (FYM) లేదా వర్మీకంపోస్ట్ + 5 కిలోల వేప పిండితో కలపాలి. మిశ్రమంపై నీరు చల్లి 30% తేమ ఉండేలా చూసి, నీడలో గోనె సంచులతో కప్పి 7-10 రోజులు నిల్వ ఉంచాలి (ఈ సమయంలో పచ్చని ట్రైకోడెర్మా శిలీంద్ర బీజాలు విపరీతంగా వృద్ధి చెందుతాయి). దీనిని ఆఖరి దుక్కిలో లేదా మొక్కల మొదళ్ళలో తేమ ఉన్నప్పుడు వేయాలి.

ముఖ్య గమనిక & జాగ్రత్తలు:
- ట్రైకోడెర్మాను రసాయన శిలీంద్ర నాశినులతో (ఉదా: కార్బండిజమ్, మాంకోజెబ్, హెక్సాకొనజోల్) ఎప్పుడూ కలపరాదు.
- రసాయన మందుల వాడకానికి, ట్రైకోడెర్మా వాడకానికి మధ్య కనీసం 10-14 రోజుల వ్యవధి ఉండాలి.`,
    normalizedTeluguText: `ట్రైకోడెర్మా విరిడే: వేరుకుళ్ళు, ఎండుతెగులు, నారుకుళ్ళు నివారణకు మిత్ర శిలీంద్రం. విత్తనశుద్ధి: కిలో విత్తనానికి 4-5 గ్రాములు. నేల అప్లికేషన్: ఎకరానికి 1-2 కిలోలు 100 కిలోల పశువుల ఎరువులో 7-10 రోజులు వృద్ధి చేసి దుక్కిలో చల్లాలి. రసాయన మందులతో కలపరాదు.`,
    englishText: `Trichoderma (Trichoderma viride & Trichoderma harzianum) Bio-Fungicide:
An antagonistic beneficial biocontrol fungus that actively suppresses soil-borne and seed-borne plant pathogens (Fusarium, Rhizoctonia, Pythium, Sclerotium) responsible for Root Rot, Collar Rot, Stem Rot, Damping Off, and Vascular Wilt in Cotton, Chilli, Bengalgram, Redgram, Groundnut, Turmeric, and Vegetables.

Application Methods & Dosages (PJTAU Package of Practices):
1. Seed Treatment: 4–5 grams per kg seed (or 8–10 g/kg for pulses). Slurry with starch or 10% jaggery solution, coat seeds evenly, and shade dry for 30 minutes before sowing.
2. Seedling Root Dip: Dissolve 10 g/L water; dip roots of Chilli, Tomato, or Brinjal seedlings for 15–20 minutes prior to transplanting.
3. Soil Application (Recommended for Field Protection): Mix 1–2 kg Trichoderma powder with 50–100 kg well-decomposed FYM (Farmyard Manure) or Vermicompost + 5 kg Neem Cake. Maintain 30% moisture by sprinkling water and incubate under shade covered with moist gunny bags for 7–10 days. The fungal mycelium turns powdery green. Broadcast across 1 acre during final land preparation or top-dress along root zones with adequate soil moisture.

Critical Precautions:
- Never mix Trichoderma directly with chemical fungicides (Carbendazim, Mancozeb, Hexaconazole).
- Maintain an interval of at least 10–14 days between chemical fungicide spraying and biological applications.`,
    keywords: [
      "trichoderma",
      "ట్రైకోడెర్మా",
      "trichoderma viride",
      "trichoderma harzianum",
      "bio-fungicide",
      "biological control",
      "root rot",
      "collar rot",
      "wilt",
      "fusarium",
      "damping off",
      "నారుకుళ్ళు",
      "వేరు కుళ్ళు",
      "ఎండు తెగులు",
      "seed treatment",
      "జీవ శిలీంద్ర నాశిని"
    ],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine & Diksoochi Reference",
      publisher: "PJTAU",
      publicationMonthYear: "August 2024",
      filename: "vyavasayam-August-2024.pdf",
      pdfPage: 14,
      printedPage: 12,
      sectionHeader: "సస్యరక్షణలో ట్రైకోడెర్మా జీవ శిలీంద్ర నాశిని ప్రాముఖ్యత",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-24",
    dosageConfidence: "high_verified",
  },
  {
    id: "rec_bio_pseudomonas_fluorescens",
    title: "సూడోమోనాస్ ఫ్లోరోసెన్స్ జీవ బాక్టీరియా నాశిని (Pseudomonas fluorescens)",
    crop: "All",
    category: "biological_ipm",
    originalTeluguText: `సూడోమోనాస్ ఫ్లోరోసెన్స్ (Pseudomonas fluorescens) ఒక ప్రయోజనకరమైన మిత్ర బాక్టీరియా. ఇది బాక్టీరియా మరియు శిలీంద్రాల వల్ల వచ్చే తెగుళ్ళను అరికట్టడమే కాకుండా మొక్కల వేర్ల పెరుగుదలను ప్రేరేపిస్తుంది (PGPR).
ఉపయోగాలు:
- వరిలో బాక్టీరియా ఆకు ఎండు తెగులు (BLB), తొడుగు ఎండు తెగులు (Sheath Blight).
- మిరప, పత్తి, కూరగాయల్లో ఎండు తెగులు (Bacterial Wilt).

వాడుక పద్ధతులు:
1. విత్తన శుద్ధి: కిలో విత్తనానికి 10 గ్రాములు.
2. నారు శుద్ధి: లీటరు నీటికి 10 గ్రాములు (20 నిమిషాలు).
3. ఆకులపై పిచికారీ: లీటరు నీటికి 5 గ్రాములు లేదా 2.5 మి.లీ ద్రావణం కలిపి పిచికారీ చేయాలి.`,
    normalizedTeluguText: `సూడోమోనాస్ ఫ్లోరోసెన్స్: బాక్టీరియా ఆకు ఎండు తెగులు, షీత్ బ్లైట్ నివారణకు జీవ బాక్టీరియా. విత్తనశుద్ధికి 10 గ్రా/కిలో, పిచికారీకి 5 గ్రా/లీటర్.`,
    englishText: `Pseudomonas fluorescens: Beneficial plant growth-promoting rhizobacteria (PGPR) and biocontrol agent against Bacterial Leaf Blight (BLB), Sheath Blight in Paddy, and Bacterial Wilt in Chilli and Vegetables. Induces systemic resistance in plants. Application: Seed treatment @ 10 g/kg seed; Foliar spray @ 5 g/L or 2.5 mL/L water at early disease initiation.`,
    keywords: ["pseudomonas", "సూడోమోనాస్", "pseudomonas fluorescens", "bio bactericide", "blb biocontrol", "pgpr", "జీవ బాక్టీరియా"],
    citation: {
      documentTitle: "Telangana Vyavasaayam Diksoochi 2019–2020",
      publisher: "PJTAU",
      publicationMonthYear: "2019-2020",
      filename: "Vyavasaayam-Diksoochi-2019-2020.pdf",
      pdfPage: 112,
      printedPage: 85,
      sectionHeader: "జీవ నియంత్రణ కారకాలు — సూడోమోనాస్",
      sourcePriority: "pjtau_diksoochi_baseline",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-24",
    dosageConfidence: "high_verified",
  },
  {
    id: "rec_bio_neem_nske_azadirachtin",
    title: "వేప నూనె, వేప గింజల కషాయం (NSKE 5%) & అజాడిరక్తిన్ జీవ పురుగుల నివారణ",
    crop: "All",
    category: "biological_ipm",
    originalTeluguText: `రసాయన పురుగు మందుల వాడకాన్ని తగ్గించి, రసం పీల్చే పురుగులను నివారించడానికి వేప ఉత్పత్తులు అత్యుత్తమమైనవి.
వాడుక:
1. వేప గింజల కషాయం (NSKE 5%): 10 కిలోల తాజా వేప గింజల పొడిని 200 లీటర్ల నీటిలో రాత్రంతా నానబెట్టి, మరుసటి రోజు వడకట్టి, 100 గ్రాముల సబ్బు పొడి కలిపి ఎకరానికి పిచికారీ చేయాలి.
2. అజాడిరక్తిన్ (Azadirachtin 10,000 ppm / 1% EC): లీటరు నీటికి 1.0 నుండి 1.5 మి.లీ కలిపి పిచికారీ చేయాలి (లేదా 1500 ppm @ 3–5 మి.లీ/లీ).
ప్రయోజనాలు: పురుగుల గుడ్లను నాశనం చేస్తుంది, ఆకులను చేదుగా మార్చి పురుగులు తినకుండా ఆపుతుంది (Anti-feedant & Oviposition Deterrent). మిత్ర పురుగులకు ఏ విధమైన హాని కలిగించదు.`,
    normalizedTeluguText: `వేప కషాయం (NSKE 5%) & అజాడిరక్తిన్: రసం పీల్చే పురుగులు, పురుగుల గుడ్ల నివారణకు ఎకరానికి 5% వేప కషాయం లేదా అజాడిరక్తిన్ 10000 ppm @ 1 మి.లీ/లీ పిచికారీ చేయాలి.`,
    englishText: `Neem Formulations (NSKE 5% & Azadirachtin Botanical Pesticide):
Primary botanical pesticide for eco-friendly IPM. Controls early-stage sucking pests (thrips, aphids, whitefly, jassids, mites) and acts as an oviposition deterrent and anti-feedant.
Dosage: 5% Neem Seed Kernel Extract (NSKE @ 10 kg/acre in 200 L water) or Azadirachtin 10,000 ppm @ 1.0–1.5 mL/L (or 1,500 ppm @ 3–5 mL/L). Completely safe for natural predators, honeybees, and spider populations.`,
    keywords: ["neem", "nske", "azadirachtin", "వేప నూనె", "వేప కషాయం", "botanical pesticide", "organic pest control"],
    citation: {
      documentTitle: "PJTAU Vyavasayam Monthly Magazine",
      publisher: "PJTAU",
      publicationMonthYear: "May 2024",
      filename: "vyavasayam-may-2024.pdf",
      pdfPage: 17,
      printedPage: 15,
      sectionHeader: "సస్యరక్షణలో వేప ఆధారిత ఉత్పత్తుల ప్రాముఖ్యత",
      sourcePriority: "pjtau_magazine_recent",
    },
    qualityStatus: "verified_agricultural_record",
    lastReviewDate: "2026-11-24",
    dosageConfidence: "high_verified",
  },
];
