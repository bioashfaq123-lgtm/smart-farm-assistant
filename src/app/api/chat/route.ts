import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PJTAU Pre-Cached agronomy answers for fallback when GEMINI_API_KEY is not set or quota exhausted
const PJTAU_KNOWLEDGE_BASE = [
  {
    keywords: ["blast", "అగ్గితెగులు", "lesion", "spindle", "వరి తెగులు"],
    replyEn:
      "🌿 **Paddy Leaf Blast (Pyricularia oryzae) — PJTAU Advisory**:\n\n• **Symptoms**: Diamond/spindle-shaped lesions with greyish center and reddish-brown margin.\n• **Immediate Action**: Stop or postpone urea/nitrogen top-dressing immediately.\n• **Recommended Spray**: Spray Tricyclazole 75% WP @ 0.6 g/L OR Isoprothiolane 40% EC @ 1.5 mL/L.\n• **Water Management**: Maintain 2–3 cm thin water layer.\n\n⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your Mandal Agricultural Officer (MAO) before spraying.*",
    replyTe:
      "🌿 **వరి అగ్గితెగులు (Leaf Blast) — PJTAU సిఫారసు**:\n\n• **లక్షణాలు**: ఆకులపై కంటి లేదా నూలుకండె ఆకారపు మచ్చలు, మధ్యలో బూడిద రంగు, అంచులు గోధుమ రంగు.\n• **తక్షణ చర్య**: యూరియా (నత్రజని) ఎరువుల వాడకాన్ని వెంటనే నిలిపివేయండి.\n• **పిచికారీ**: ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రాములు లేదా ఐసోప్రోథియోలేన్ 40% EC @ 1.5 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయాలి.\n• **నీటి యాజమాన్యం**: మడిలో 2-3 సెం.మీ పలుచని నీరు నిల్వ ఉంచాలి.\n\n⚠️ *గమనిక: ఈ AI సలహా కేవలం మార్గదర్శకం మాత్రమే. రసాయనాలు పిచికారీ చేసే ముందు మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*",
  },
  {
    keywords: ["bollworm", "pink", "గులాబీ", "పత్తి", "cotton"],
    replyEn:
      "☁️ **Cotton Pink Bollworm (Pectinophora gossypiella) — PJTAU Advisory**:\n\n• **ETL Threshold**: 10% damaged green bolls or 8 moths/trap/night for 3 consecutive days.\n• **Monitoring**: Install 8–10 pheromone traps per acre.\n• **Recommended Spray**: Spray Profenofos 50% EC @ 2.0 mL/L OR Emamectin Benzoate 5% SG @ 5 g per 10 L water.\n• **Sanitation**: Collect and destroy dropped rosetted flowers twice weekly.\n\n⚠️ *Statutory Disclaimer: AI advice is indicative. Consult your AEO before chemical spraying.*",
    replyTe:
      "☁️ **పత్తిలో గులాబీ రంగు పురుగు — PJTAU సిఫారసు**:\n\n• **ఆర్థిక నష్ట పరిమితి**: 10% కాయలు దెబ్బతిన్నప్పుడు లేదా వరుసగా 3 రోజులు బుట్టకు 8 పురుగులు పడినప్పుడు.\n• **యాజమాన్యం**: ఎకరానికి 8-10 లింగాకర్షక బుట్టలు అమర్చాలి.\n• **పిచికారీ**: ప్రొఫెనోఫాస్ 50% EC @ 2 మి.లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 5% SG @ 5 గ్రాములు 10 లీటర్ల నీటికి కలిపి పిచికారీ చేయాలి.\n• **శుభ్రత**: రాలిన గుడ్డి పూలను ఏరి కాల్చివేయాలి.\n\n⚠️ *గమనిక: రసాయనాలు పిచికారీ చేసే ముందు గ్రామ వ్యవసాయ అధికారి (AEO)ని సంప్రదించండి.*",
  },
  {
    keywords: ["bonus", "బోనస్", "msp", "ధర", "500", "sanna", "సన్న"],
    replyEn:
      "💰 **Telangana ₹500/Quintal Fine Rice Bonus Procedure**:\n\n1. **Eligibility**: Fine rice varieties (సన్న రకాలు) such as RNR 15048 (Telangana Sona), BPT 5204 (Samba Mahsuri), MTU 1010, KNM 118.\n2. **Prerequisites**: Crop booking by local AEO on Rythu Bandhu portal, Pattadar Passbook, Aadhaar, and NPCI-linked active bank account.\n3. **Quality Norms**: Grain moisture must be under 17%, foreign matter < 1%.\n4. **Payout**: Central MSP ₹2,320 + State Bonus ₹500 = **₹2,820 / quintal** credited directly via DBT to bank account.\n\n⚠️ *Confirm PPC center dates with your local PACS/IKP procurement center.*",
    replyTe:
      "💰 **తెలంగాణ ₹500 సన్నవడ్ల బోనస్ పొందే విధానం**:\n\n1. **అర్హత కలిగిన రకాలు**: RNR 15048 (తెలంగాణ సోనా), BPT 5204 (సాంబ మసూరి), MTU 1010, KNM 118 వంటి సన్న రకాలు.\n2. **కావలసిన పత్రాలు**: ఏఈఓ వద్ద పంట నమోదు (Crop Booking), పట్టాదారు పాస్ పుస్తకం, ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతా.\n3. **నాణ్యతా ప్రమాణాలు**: ధాన్యంలో తేమ 17% కంటే తక్కువగా ఉండాలి.\n4. **మొత్తం చెల్లింపు**: కేంద్ర MSP ₹2,320 + రాష్ట్ర బోనస్ ₹500 = **క్వింటాలుకు ₹2,820** నేరుగా బ్యాంక్ ఖాతాలో జమ అవుతుంది.\n\n⚠️ *వివరాల కోసం మీ గ్రామ పీఏసీఎస్ / ఐకేపీ కొనుగోలు కేంద్రాన్ని సంప్రదించండి.*",
  },
  {
    keywords: ["dap", "urea", "fertilizer", "ఎరువు", "యూరియా", "డీఏపీ", "potash"],
    replyEn:
      "🌱 **PJTAU Paddy Fertilizer Schedule (RNR 15048 / 4.5 Acres)**:\n\n• **Basal (దుక్కిలో)**: 100% DAP (5–6 bags) + 25% Urea (2 bags) + 50% MOP (1.5 bags).\n• **Active Tillering (21–25 DAT)**: 2nd split Urea (3–4 bags).\n• **Panicle Initiation (50–55 DAT)**: 3rd split Urea (3 bags) + remaining 50% MOP (1.5 bags). Never apply DAP at this stage.\n• **Zinc Deficiency**: If leaves show khaira rust, spray Zinc Sulphate (21%) @ 2 g/L + Urea @ 10 g/L.\n\n⚠️ *Statutory Disclaimer: AI advice is indicative. Adjust based on soil test card (STCR).*",
    replyTe:
      "🌱 **వరిలో ఎరువుల యాజమాన్యం (PJTAU సిఫారసు)**:\n\n• **దుక్కిలో (చివరి దమ్ము)**: మొత్తం డీఏపీ (5-6 బస్తాలు) + పావువంతు యూరియా (2 బస్తాలు) + సగం పొటాష్ (1.5 బస్తాలు).\n• **పిలకల దశ (21-25 రోజులు)**: 2వ దఫా యూరియా (3-4 బస్తాలు).\n• **చిరుపొట్ట దశ (50-55 రోజులు)**: 3వ దఫా యూరియా (3 బస్తాలు) + మిగిలిన సగం పొటాష్ (1.5 బస్తాలు). ఈ దశలో డీఏపీ అస్సలు వేయరాదు.\n• **జింక్ లోపం**: ఆకులు తుప్పు మచ్చలుగా మారితే లీటరు నీటికి 2 గ్రాముల జింక్ సల్ఫేట్ + 10 గ్రాముల యూరియా కలిపి పిచికారీ చేయాలి.\n\n⚠️ *గమనిక: నేల పరీక్ష ఫలితాల ఆధారంగా ఎరువుల మోతాదును సర్దుబాటు చేసుకోవాలి.*",
  },
  {
    keywords: ["vermicompost", "earthworm", "వర్మీ", "కంపోస్ట్", "వానపాముల", "compost"],
    replyEn:
      "🪱 **PJTAU Vermicompost Preparation Guide for Telangana Farmers**:\n\n1. **Location & Bed Setup**: Select a shaded spot (under tree canopy or thatch roof). Construct an HDPE or brick pit measuring 10 ft length × 3 ft width × 2 ft height. Provide a 2% slope for drainage.\n2. **Bottom Layering (Bedding)**: Base layer of 2 inches gravel/coarse sand + 3 inches dried crop residue (paddy straw / dried leaves).\n3. **Feeding Layer**: Add partially decomposed farmyard manure (FYM) mixed with chopped green biomass or vegetable waste in 60:40 ratio. Fill up to 1.5 ft.\n4. **Earthworm Inoculation**: Introduce African Nightcrawler (*Eisenia fetida*) or *Eudrilus eugeniae* @ 1 to 1.5 kg (approx 1,000–1,500 worms) per bed.\n5. **Moisture & Temperature**: Sprinkle water daily to maintain 60–70% moisture (sponge-damp, never waterlogged) and 25–30°C temperature.\n6. **Harvesting (45–60 Days)**: Stop watering 3–4 days before harvest. Scrape tea-powder like dark granular castings from the top layer.\n\n⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices.*",
    replyTe:
      "🪱 **వర్మీ కంపోస్ట్ (వానపాముల ఎరువు) తయారీ విధానం — PJTAU సిఫారసు**:\n\n1. **స్థల ఎంపిక**: నీడ ఉన్న ప్రదేశంలో (చెట్ల కింద లేదా తాటాకుల పందిరి కింద) 10 అడుగుల పొడవు, 3 అడుగుల వెడల్పు, 2 అడుగుల ఎత్తు గల బెడ్ లేదా తొట్టిని ఏర్పాటు చేయాలి.\n2. **మొదటి పొర**: అడుగున 2 అంగుళాల కంకర లేదా ఇసుక, దానిపై 3 అంగుళాల ఎండు గడ్డి లేదా ఎండుటాకులు పరచాలి.\n3. **ఆహార పదార్థాలు**: పాక్షికంగా కుళ్లిన పశువుల పేడ, వ్యవసాయ వ్యర్థాలను 60:40 నిష్పత్తిలో 1.5 అడుగుల ఎత్తు వరకు నింపాలి.\n4. **వానపాముల విడుదల**: బెడ్‌కు 1 నుండి 1.5 కిలోల 'ఐసీనియా ఫెటిడా' (Eisenia fetida) లేదా 'యూడ్రిలస్' వానపాములను వదలాలి.\n5. **తేమ యాజమాన్యం**: ప్రతిరోజూ నీరు చిలకరిస్తూ 60–70% తేమ ఉండేలా చూడాలి. నీరు నిలవ ఉండరాదు.\n6. **సేకరణ (45–60 రోజులు)**: నల్లటి టీపొడి లాంటి వర్మీ కంపోస్ట్ సిద్ధమయ్యాక పైపొరలను తీసి ఆరబెట్టి జల్లెడ పట్టి నిల్వ చేసుకోవాలి.\n\n⚠️ *గమనిక: ఈ AI సలహా PJTAU మార్గదర్శకాల ప్రకారం రూపొందించబడింది.*",
  },
  {
    keywords: ["spot", "brown", "మచ్చలు", "ఆకు", "bipolaris", "lesion", "blight", "fungal", "image", "photo", "leaf"],
    replyEn:
      "🌿 **Paddy Brown Spot & Foliar Fungal Lesions (Bipolaris oryzae) — PJTAU Advisory**:\n\n• **Symptoms**: Oval to circular dark brown spots with yellowish halos on leaf blades. Lesions coalesce causing leaf drying. Common in low-potash or moisture-stressed soils.\n• **Immediate Action**: Drain standing excess water, avoid excessive urea (nitrogen), and top-dress potash.\n• **Recommended Chemical Spray**:\n  1. Propiconazole 25% EC @ 1.0 mL/L water (200 mL/acre) OR\n  2. Mancozeb 75% WP @ 2.0 to 2.5 g/L water (400–500 g/acre) OR\n  3. Tricyclazole 75% WP @ 0.6 g/L water (120 g/acre).\n• **Organic / Biological Alternative**: Spray Pseudomonas fluorescens @ 10 g/L or 1% Neem Oil (10,000 ppm) @ 2 mL/L.\n• **Soil Health**: Ensure balanced potash application (MOP @ 25 kg/acre at tillering/panicle stage).\n\n⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your Mandal Agricultural Officer (MAO) before spraying.*",
    replyTe:
      "🌿 **వరిలో గోధుమ రంగు మచ్చ తెగులు (Brown Spot) — PJTAU సిఫారసు**:\n\n• **లక్షణాలు**: ఆకులపై గుండ్రని లేదా కోడిగుడ్డు ఆకారంలో గోధుమ రంగు మచ్చలు ఏర్పడి చుట్టూ పసుపు రంగు వలయం ఉంటుంది. పొటాష్ లోపం లేదా నీటి ఎద్దడి వల్ల తీవ్రమవుతుంది.\n• **తక్షణ చర్య**: మడిలో నిలిచిన నీటిని తీసివేయండి, అధిక యూరియా వాడకాన్ని ఆపివేయండి.\n• **పిచికారీ మందులు**:\n  1. ప్రొపికొనజోల్ 25% EC @ 1.0 మి.లీ లీటరు నీటికి (ఎకరానికి 200 మి.లీ) లేదా\n  2. మాంకోజెబ్ 75% WP @ 2.0 నుండి 2.5 గ్రాములు లీటరు నీటికి లేదా\n  3. ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీటరు.\n• **సేంద్రీయ ప్రత్యామ్నాయం**: సూడోమోనాస్ ఫ్లోరోసెన్స్ @ 10 గ్రా/లీటరు లేదా వేప నూనె @ 2 మి.లీ/లీటరు.\n• **ఎరువుల సమతుల్యత**: ఎకరానికి 25 కిలోల పొటాష్ (MOP) ఎరువును వేయడం వల్ల రోగనిరోధక శక్తి పెరుగుతుంది.\n\n⚠️ *గమనిక: ఈ AI సలహా కేవలం మార్గదర్శకం మాత్రమే. రసాయనాలు పిచికారీ చేసే ముందు మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*",
  },
  {
    keywords: ["chilli", "మిరప", "thrips", "నల్లి", "ముడత", "curl", "black thrips"],
    replyEn:
      "🌶️ **Chilli Black Thrips & Leaf Curl (Thrips parvispinus) — PJTAU Advisory**:\n\n• **Symptoms**: Upward curling of leaves, silvering on underside, shedding of flowers and small fruits.\n• **Cultural Measures**: Install 30–40 blue and yellow sticky traps per acre.\n• **Recommended Chemical Spray**:\n  1. Spinetoram 11.7% SC @ 0.9 mL/L OR\n  2. Fipronil 5% SC @ 2.0 mL/L OR\n  3. Cyantraniliprole 10.26% OD @ 1.2 mL/L.\n• **Organic Alternative**: Spray Neem oil (10,000 ppm) @ 3 mL/L + Pongamia oil @ 2 mL/L.\n\n⚠️ *Statutory Disclaimer: Consult your local Agricultural Extension Officer (AEO) before spraying.*",
    replyTe:
      "🌶️ **మిరపలో నల్ల తామర పురుగు మరియు ఆకుముడత — PJTAU సిఫారసు**:\n\n• **లక్షణాలు**: ఆకులు పైకి ముడుచుకుపోవడం, ఆకుల వెనుక వెండి రంగు చారలు, పూత మరియు పిందె రాలడం.\n• **యాజమాన్యం**: ఎకరానికి 30-40 నీలి మరియు పసుపు రంగు జిగురు అట్టలు పెట్టాలి.\n• **పిచికారీ**:\n  1. స్పినెటోరమ్ 11.7% SC @ 0.9 మి.లీ లేదా\n  2. ఫిప్రోనిల్ 5% SC @ 2.0 మి.లీ లేదా\n  3. సయాంట్రానిలిప్రోల్ 10.26% OD @ 1.2 మి.లీ లీటరు నీటికి.\n• **సేంద్రీయ పద్ధతి**: వేప నూనె (10,000 ppm) @ 3 మి.లీ పిచికారీ చేయాలి.\n\n⚠️ *గమనిక: రసాయనాలు వాడే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.*",
  },
];

// Reference diagnosis cases for offline fallback
const FALLBACK_DIAGNOSIS_CASES: Record<string, any> = {
  paddy: {
    diseaseNameEn: "Paddy Leaf Blast (Pyricularia oryzae)",
    diseaseNameTe: "వరి అగ్గితెగులు (Leaf Blast)",
    severity: "high",
    symptomsEn: "Spindle or diamond-shaped lesions on leaf blades with grey/whitish centers and brown margins. Lesions enlarge and coalesce.",
    symptomsTe: "ఆకులపై నూలుకండె ఆకారపు మచ్చలు, మధ్యలో బూడిద రంగు మరియు అంచులలో గోధుమ రంగు కనిపిస్తాయి.",
    remedyEn: "Spray Tricyclazole 75% WP @ 0.6 g/L water (120 g/acre) OR Isoprothiolane 40% EC @ 1.5 mL/L (300 mL/acre).",
    remedyTe: "ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రాములు (ఎకరానికి 120 గ్రా) లేదా ఐసోప్రోథియోలేన్ 40% EC @ 1.5 మి.లీ లీటరు నీటికి పిచికారీ చేయాలి.",
    dosageEn: "0.6 g/L water (Tricyclazole 75% WP)",
    dosageTe: "0.6 గ్రా/లీటరు (ట్రైసైక్లాజోల్ 75% WP)",
    organicAlternativeEn: "Neem oil (Azadirachtin 10,000 ppm) @ 2 mL/L OR Pseudomonas fluorescens @ 10 g/L. Drain excess water.",
    organicAlternativeTe: "వేప నూనె (10,000 ppm) @ 2 మి.లీ లేదా సూడోమోనాస్ ఫ్లోరోసెన్స్ @ 10 గ్రా/లీటరు నీటికి కలపాలి.",
    safetyEn: "Wear protective face mask and gloves. Avoid spraying during midday heat. Do not spray against the wind.",
    safetyTe: "ముఖానికి మాస్క్ మరియు చేతి తొడుగులు ధరించండి. ఎండ తీవ్రత ఎక్కువగా ఉన్నప్పుడు పిచికారీ చేయరాదు.",
  },
  cotton: {
    diseaseNameEn: "Cotton Pink Bollworm (Pectinophora gossypiella)",
    diseaseNameTe: "పత్తిలో గులాబీ రంగు పురుగు (Pink Bollworm)",
    severity: "high",
    symptomsEn: "Rosetted flowers that fail to open properly. Small exit holes in developing green bolls with internal fiber staining.",
    symptomsTe: "పూలు ముడుచుకుపోయి గుడ్డి పూలుగా మారతాయి. లేత పత్తి కాయలపై రంధ్రాలు పడి దూది పాడవుతుంది.",
    remedyEn: "Spray Profenofos 50% EC @ 2 mL/L water (400 mL/acre) OR Emamectin Benzoate 5% SG @ 5 g per 10 L water (100 g/acre).",
    remedyTe: "ప్రొఫెనోఫాస్ 50% EC @ 2 మి.లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 5% SG @ 5 గ్రాములు 10 లీటర్ల నీటికి పిచికారీ చేయాలి.",
    dosageEn: "2.0 mL/L water (Profenofos 50% EC)",
    dosageTe: "2.0 మి.లీ/లీటరు (ప్రొఫెనోఫాస్ 50% EC)",
    organicAlternativeEn: "Install 8 pheromone traps per acre. Spray Beauveria bassiana @ 5 g/L. Handpick and destroy rosetted flowers.",
    organicAlternativeTe: "ఎకరానికి 8 లింగాకర్షక బుట్టలు అమర్చండి. బవేరియా బాసియానా @ 5 గ్రా/లీటరు పిచికారీ చేయండి.",
    safetyEn: "Wash hands thoroughly after handling pesticides. Keep livestock away from treated fields for 48 hours.",
    safetyTe: "రసాయనాలు వాడిన తర్వాత చేతులను శుభ్రంగా కడుక్కోండి. పశువులను పొలంలోకి 48 గంటల వరకు రానివ్వవద్దు.",
  },
  maize: {
    diseaseNameEn: "Fall Armyworm (Spodoptera frugiperda)",
    diseaseNameTe: "మొక్కజొన్న కత్తెర పురుగు (Fall Armyworm)",
    severity: "high",
    symptomsEn: "Pinholes and large irregular ragged leaf feeding with heavy sawdust-like fecal frass in central leaf whorls.",
    symptomsTe: "ఆకుల సుడిలో రంపపు పొట్టు లాంటి మల విసర్జన, ఆకులపై పెద్ద రంధ్రాలు ఏర్పడటం.",
    remedyEn: "Spray Chlorantraniliprole 18.5% SC @ 0.4 mL/L (80 mL/acre) OR Spinetoram 11.7% SC @ 0.5 mL/L (100 mL/acre).",
    remedyTe: "క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.4 మి.లీ లేదా స్పినెటోరమ్ 11.7% SC @ 0.5 మి.లీ లీటరు నీటికి కలపాలి.",
    dosageEn: "0.4 mL/L directed into plant whorls",
    dosageTe: "0.4 మి.లీ/లీటరు సుడి లోపలికి చేరేలా పిచికారీ చేయాలి",
    organicAlternativeEn: "Apply sand + lime mixture (9:1) or wood ash into whorls. Spray Metarhizium rileyi @ 5 g/L.",
    organicAlternativeTe: "ఇసుక మరియు సున్నం మిశ్రమం (9:1) సుడిలో వేయండి. మెటార్హిజియం రిలేయి @ 5 గ్రా/లీటరు పిచికారీ చేయండి.",
    safetyEn: "Direct nozzle straight into the leaf whorl. Wear protective eye goggles and footwear.",
    safetyTe: "సుడి లోపలికి స్ప్రే నాజిల్ ఉంచి పిచికారీ చేయాలి. రక్షణ కళ్లద్దాలు ధరించండి.",
  },
};

function extractCleanBase64(input: string): { base64: string; mimeType: string } {
  let mimeType = "image/jpeg";
  let base64 = input;

  if (input.includes(";base64,")) {
    const parts = input.split(";base64,");
    base64 = parts[1];
    const mimeMatch = parts[0].match(/data:(.*?)$/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1];
    }
  }

  return { base64: base64.trim(), mimeType };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      message = "",
      lang = "en",
      farmerProfile,
      image,
      imageMimeType,
      mode = "chat",
    } = body;

    const hasImage = Boolean(image && typeof image === "string" && image.trim().length > 50);

    if (!hasImage && (!message || typeof message !== "string" || message.trim() === "")) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const district = farmerProfile?.district || "Jagtial";
    const crop = farmerProfile?.primaryCrop || "Paddy";
    const isDiagnosisMode = mode === "diagnosis" || hasImage;
    const userQuery = message && message.trim() !== ""
      ? message
      : isDiagnosisMode
      ? "Please analyze this crop leaf photo for disease, pest damage, or deficiency symptoms under PJTAU recommendations."
      : "Hello Krishi Sahayak";

    // 1. If GEMINI_API_KEY is present, call Gemini 1.5 Flash Multimodal Generative API
    if (apiKey && apiKey.trim() !== "") {
      let systemPrompt = "";
      if (isDiagnosisMode) {
        systemPrompt = `You are Krishi Sahayak (కృషి సహాయక్), an expert agronomic visual pathologist for Telangana farmers, working strictly within PJTAU (Professor Jayashankar Telangana State Agricultural University) Package of Practices.
Farmer Context: District: ${district}, Crop: ${crop}, Acres: ${farmerProfile?.areaAcre || 4.5}.
Language: Respond in ${lang === "te" ? "natural Telangana Telugu (తెలుగు)" : "clear, practical English"}.

Instructions for Visual Leaf Pathology Analysis:
Analyze the uploaded crop image carefully for pathogens, fungal/bacterial leaf spot, insect damage, or nutrient deficiencies.
Respond strictly in this structured format:
**IDENTIFIED**: [Pathogen, Pest, or Deficiency Name in English and Telugu]
**SEVERITY**: [Low / Moderate / High]
**SYMPTOMS**: [Exact visual lesions, discoloration, or leaf symptoms observed in image]
**REMEDY**: [Recommended PJTAU approved chemical molecule with exact dosage per liter of water and per acre]
**DOSAGE**: [Concise dosage instruction, e.g. 0.6 g/L water]
**ORGANIC_ALTERNATIVE**: [Organic or biological control, e.g. Neem oil, Trichoderma, Beauveria, or cultural method]
**SAFETY**: [PPE, spray precautions, and safety rules]

Conclude with this mandatory statutory disclaimer:
${
  lang === "te"
    ? "⚠️ గమనిక: ఈ AI నిర్ధారణ కేవలం పరిశీలనా మార్గదర్శకం మాత్రమే. రసాయన మందులు పిచికారీ చేసే ముందు తప్పనిసరిగా మీ స్థానిక మండల వ్యవసాయ అధికారి (MAO) లేదా ఏఈఓని సంప్రదించండి."
    : "⚠️ Statutory Disclaimer: AI visual diagnosis is indicative guidance based on PJTAU Package of Practices. Always consult your local Mandal Agricultural Officer (MAO) or Agricultural Extension Officer (AEO) before applying chemical sprays."
}`;
      } else {
        systemPrompt = `You are Krishi Sahayak (కృషి సహాయక్), an expert bilingual agronomic AI assistant for Telangana farmers, working strictly within PJTAU (Professor Jayashankar Telangana State Agricultural University) Package of Practices.
Farmer Context: District: ${district}, Crop: ${crop}, Acres: ${farmerProfile?.areaAcre || 4.5}.
Language: Respond in ${lang === "te" ? "natural Telangana Telugu (తెలుగు)" : "clear, practical English"}.
Always adhere to:
1. Provide practical, step-by-step agronomy advice with precise dosages per litre of water or per acre.
2. If chemical sprays are recommended, always provide both organic/IPM preventive alternatives and standard approved chemical molecules.
3. If discussing Paddy, highlight the Telangana Government ₹500/quintal Fine Rice (సన్న రకాలు) bonus if relevant.
4. Conclude EVERY response with this mandatory disclaimer:
${
  lang === "te"
    ? "⚠️ గమనిక: ఈ AI సలహా కేవలం సమాచార మార్గదర్శకం మాత్రమే. మందులు వాడే ముందు తప్పనిసరిగా మీ స్థానిక మండల వ్యవసాయ అధికారి (MAO) లేదా ఏఈఓని సంప్రదించండి."
    : "⚠️ Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your local Mandal Agricultural Officer (MAO) or Agricultural Extension Officer (AEO) before applying chemical sprays."
}`;
      }

      const candidateModels = [
        process.env.GEMINI_MODEL,
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-1.5-flash",
      ].filter(Boolean) as string[];

      const contentsParts: any[] = [];
      contentsParts.push({ text: `${systemPrompt}\n\nFarmer Query: ${userQuery}` });

      if (hasImage) {
        const { base64, mimeType } = extractCleanBase64(image);
        contentsParts.push({
          inline_data: {
            mime_type: imageMimeType || mimeType,
            data: base64,
          },
        });
      }

      for (const modelId of candidateModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
          const geminiRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: contentsParts,
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 900,
              },
            }),
            signal: AbortSignal.timeout(18000),
          });

          if (geminiRes.status === 429) {
            continue;
          }

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const candidate = geminiData.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text;

            if (text) {
              // If diagnosis mode, parse structured sections
              let diagnosisData: any = null;
              if (isDiagnosisMode) {
                const getField = (label: string): string => {
                  const match = text.match(new RegExp(`\\*\\*${label}\\*\\*:\\s*([^\\n*]+)`, "i"));
                  return match ? match[1].trim() : "";
                };

                const identified = getField("IDENTIFIED");
                const severityRaw = getField("SEVERITY").toLowerCase();
                const severity: "low" | "medium" | "high" = severityRaw.includes("high")
                  ? "high"
                  : severityRaw.includes("low")
                  ? "low"
                  : "medium";

                diagnosisData = {
                  diseaseName: identified || "Pathology Analysis Complete",
                  severity,
                  symptoms: getField("SYMPTOMS"),
                  remedy: getField("REMEDY"),
                  dosage: getField("DOSAGE"),
                  organicAlternative: getField("ORGANIC_ALTERNATIVE"),
                  safety: getField("SAFETY"),
                  fullText: text,
                };
              }

              const finalSearchQuery = userQuery || `${crop} PJTAU crop advisory`;
              return NextResponse.json({
                reply: text,
                diagnosis: diagnosisData,
                isLiveAi: true,
                source: hasImage
                  ? `Gemini AI Multimodal (${modelId} • PJTAU Grounded)`
                  : `Gemini AI (${modelId} • PJTAU Grounded)`,
                searchQuery: finalSearchQuery,
                webSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(finalSearchQuery + " PJTAU Telangana agriculture")}`,
                pjtauSearchUrl: `https://www.google.com/search?q=site%3Apjtau.edu.in+${encodeURIComponent(finalSearchQuery)}`,
              });
            }
          }
        } catch (err) {
          // Try next candidate model
          continue;
        }
      }
    }

    // 2. Verified Offline Fallback (Guaranteed zero crashes, honest labeling)
    const finalSearchQuery = userQuery || `${crop} PJTAU package of practices`;
    const webSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(finalSearchQuery + " PJTAU Telangana agriculture")}`;
    const pjtauSearchUrl = `https://www.google.com/search?q=site%3Apjtau.edu.in+${encodeURIComponent(finalSearchQuery)}`;

    if (mode === "diagnosis" || hasImage) {
      const cropKey = crop.toLowerCase().includes("cotton")
        ? "cotton"
        : crop.toLowerCase().includes("maize")
        ? "maize"
        : "paddy";

      const fb = FALLBACK_DIAGNOSIS_CASES[cropKey] || FALLBACK_DIAGNOSIS_CASES.paddy;
      const diseaseName = lang === "te" ? fb.diseaseNameTe : fb.diseaseNameEn;
      const symptoms = lang === "te" ? fb.symptomsTe : fb.symptomsEn;
      const remedy = lang === "te" ? fb.remedyTe : fb.remedyEn;
      const dosage = lang === "te" ? fb.dosageTe : fb.dosageEn;
      const organic = lang === "te" ? fb.organicAlternativeTe : fb.organicAlternativeEn;
      const safety = lang === "te" ? fb.safetyTe : fb.safetyEn;

      const fallbackReply = `🌿 **${diseaseName}**\n\n• **${lang === "te" ? "లక్షణాలు" : "Symptoms"}**: ${symptoms}\n• **${lang === "te" ? "సిఫారసు చేసిన మందు" : "Prescribed Remedy"}**: ${remedy}\n• **${lang === "te" ? "సేంద్రీయ ప్రత్యామ్నాయం" : "Organic Alternative"}**: ${organic}\n• **${lang === "te" ? "రక్షణ చర్యలు" : "Safety"}**: ${safety}\n\n⚠️ ${
        lang === "te"
          ? "గమనిక: ఈ సమాచారం PJTAU నిర్ధారిత సూచనల ఆధారంగా ఇవ్వబడింది. రసాయనాలు పిచికారీ చేసే ముందు MAO/AEOని సంప్రదించండి."
          : "Statutory Disclaimer: Based on verified PJTAU reference cases. Consult local MAO before chemical spraying."
      }`;

      return NextResponse.json({
        reply: fallbackReply,
        diagnosis: {
          diseaseName,
          severity: fb.severity,
          symptoms,
          remedy,
          dosage,
          organicAlternative: organic,
          safety,
          fullText: fallbackReply,
        },
        isLiveAi: false,
        source: apiKey
          ? "Offline PJTAU Reference Cases (Gemini API rate-limited or unreachable)"
          : "Offline PJTAU Reference Cases (Configure GEMINI_API_KEY for live multimodal vision)",
        searchQuery: diseaseName,
        webSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(diseaseName + " PJTAU Telangana spray treatment")}`,
        pjtauSearchUrl: `https://www.google.com/search?q=site%3Apjtau.edu.in+${encodeURIComponent(diseaseName)}`,
      });
    }

    // Regular text chat fallback
    const lower = message.toLowerCase();
    const matched = PJTAU_KNOWLEDGE_BASE.find((item) =>
      item.keywords.some((kw) => lower.includes(kw.toLowerCase()) || message.includes(kw))
    );

    let fallbackReply = "";
    if (matched) {
      fallbackReply = lang === "te" ? matched.replyTe : matched.replyEn;
    } else {
      fallbackReply =
        lang === "te"
          ? `🌾 మీ ప్రశ్నకు ధన్యవాదాలు. PJTAU మార్గదర్శకాల ప్రకారం, పంట ఎదుగుదల మరియు నేల తేమను సమతుల్యంగా ఉంచడం ముఖ్యం.\n\nవివరమైన మోతాదుల కోసం దయచేసి నిర్దిష్ట తెగులు లేదా ఎరువుల పేరును పేర్కొనండి (ఉదా: అగ్గితెగులు, గులాబీ రంగు పురుగు, యూరియా, సన్నవడ్ల బోనస్).\n\n⚠️ గమనిక: AI సలహా కేవలం మార్గదర్శకం మాత్రమే. మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.`
          : `🌾 Thank you for your question. Based on PJTAU package of practices, maintaining balanced nutrition and monitoring pest ETL thresholds is vital.\n\nFor specific spray dosages, please mention the pest or input (e.g., Blast, Pink Bollworm, Urea Dosage, or ₹500 Bonus).\n\n⚠️ Statutory Disclaimer: AI advice is indicative. Always consult your Mandal Agricultural Officer (MAO) before spraying.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      isLiveAi: false,
      source: apiKey
        ? "Offline PJTAU Advisory (Gemini upstream rate-limited or temporarily unreachable)"
        : "Offline PJTAU Advisory (Configure GEMINI_API_KEY in environment variables for live generative chat)",
      searchQuery: finalSearchQuery,
      webSearchUrl,
      pjtauSearchUrl,
    });
  } catch (err: any) {
    const fallbackQuery = "Telangana PJTAU crop disease spray";
    return NextResponse.json({
      reply: "Based on PJTAU guidelines, ensure adequate moisture and consult your local Mandal Agricultural Officer before spraying.",
      searchQuery: fallbackQuery,
      webSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(fallbackQuery + " agriculture")}`,
      pjtauSearchUrl: `https://www.google.com/search?q=site%3Apjtau.edu.in+${encodeURIComponent(fallbackQuery)}`,
      isLiveAi: false,
      source: "Offline PJTAU Advisory (Error recovery mode)",
      error: err?.message,
    });
  }
}
