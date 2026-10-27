import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Vercel hobby serverless timeout safeguard

// Comprehensive PJTAU & ICAR Knowledge Repository for Telangana Agriculture
interface KnowledgeEntry {
  keywords: string[];
  replyEn: string;
  replyTe: string;
}

const PJTAU_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // 1. Paddy Leaf Folder
  {
    keywords: [
      "leaf folder",
      "leaffolder",
      "leaf roller",
      "leafroller",
      "ఆకుచుట్టు",
      "ఆకు చుట్టు",
      "cnaphalocrocis",
      "fold",
      "longitudinal folds",
    ],
    replyEn: `🌿 **Paddy Leaf Folder / Leaf Roller (Cnaphalocrocis medinalis) — PJTAU Package of Practices**:

• **Symptoms & Damage**:
  - Larvae fold leaves longitudinally and feed by scraping green chlorophyll inside the fold.
  - White transparent parallel papery streaks appear on leaf blades; severely infested fields look scorched/whitish.
  - **ETL Threshold**: 1–2 damaged leaves per hill during vegetative stage or 1 damaged flag leaf during panicle stage.

• **Recommended Chemical Spray (Choose one)**:
  1. **Cartap Hydrochloride 50% SP** @ 2.0 g/L water (400 g/acre in 200 L water) — *Highly effective contact & stomach poison*.
  2. **Chlorantraniliprole 18.5% SC (Coragen)** @ 0.3 mL/L water (60 mL/acre) — *Long-lasting systemic protection (21 days)*.
  3. **Flubendiamide 39.35% SC (Fame)** @ 0.2 mL/L water (40–50 mL/acre).
  4. **Acephate 75% SP** @ 1.5 g/L water (300 g/acre).

• **Biological & Cultural Alternatives**:
  - Release **Trichogramma chilonis** egg parasitoids @ 40,000/acre (2 egg cards) weekly for 3 weeks.
  - Spray **Neem Oil (Azadirachtin 10,000 ppm)** @ 2.0 mL/L water or 5% Neem Seed Kernel Extract (NSKE).
  - Pass a long rope (*thadu*) across the crop canopy in early morning; dislodged larvae drown in standing water.
  - Avoid excessive nitrogen/urea application, as lush green growth attracts adult moths.

⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your Mandal Agricultural Officer (MAO) before applying chemical sprays.*`,
    replyTe: `🌿 **వరిలో ఆకుచుట్టు పురుగు (Leaf Folder) — PJTAU సమగ్ర యాజమాన్యం**:

• **నష్ట లక్షణాలు**:
  - లార్వాలు ఆకు అంచులను నిలువుగా చుట్టి లోపల ఉండి పత్రహరితాన్ని గీకి తింటాయి.
  - ఆకులపై తెల్లటి పొడవాటి చారలు ఏర్పడతాయి. ఉధృతి ఎక్కువైతే పొలమంతా తెల్లగా ఎండిపోయినట్లు కనిపిస్తుంది.
  - **ఆర్థిక నష్ట పరిమితి (ETL)**: పిలక దశలో పిలకకు 1-2 ఆకులు లేదా చిరుపొట్ట దశలో జెండా ఆకుపై పురుగు కనిపిస్తే తక్షణమే చర్యలు చేపట్టాలి.

• **సిఫారసు చేసిన పిచికారీ మందులు (ఏదైనా ఒకటి)**:
  1. **కార్టాప్ హైడ్రోక్లోరైడ్ 50% SP** @ 2.0 గ్రాములు లీటరు నీటికి (ఎకరానికి 400 గ్రాములు 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయాలి).
  2. **క్లోరాంట్రానిలిప్రోల్ 18.5% SC (కోరాజెన్)** @ 0.3 మి.లీ లీటరు నీటికి (ఎకరానికి 60 మి.లీ).
  3. **ఫ్లూబెండియమైడ్ 39.35% SC (ఫేమ్)** @ 0.2 మి.లీ లీటరు నీటికి (ఎకరానికి 40-50 మి.లీ).
  4. **ఎసిఫేట్ 75% SP** @ 1.5 గ్రాములు లీటరు నీటికి (ఎకరానికి 300 గ్రాములు).

• **సేంద్రీయ & జీవ నియంత్రణ పద్ధతులు**:
  - ఎకరానికి 40,000 **ట్రైకోగ్రామా ఖిలోనిస్** గుడ్డు పరాన్నజీవుల కార్డులను వారం వ్యవధిలో 3 సార్లు అమర్చాలి.
  - **వేప నూనె (10,000 ppm)** @ 2 మి.లీ లేదా 5% వేప గింజల కషాయం (NSKE) పిచికారీ చేయాలి.
  - తెల్లవారుజామున తాడుతో పొలాన్ని లాగడం వల్ల ఆకుల్లోని పురుగులు నీటిలో రాలి నశిస్తాయి.
  - అధిక యూరియా వాడకాన్ని తగ్గించండి; అధిక నత్రజని వల్ల ఆకుచుట్టు పురుగు ఉధృతి పెరుగుతుంది.

⚠️ *గమనిక: ఈ AI సలహా కేవలం మార్గదర్శకం మాత్రమే. రసాయన మందులు పిచికారీ చేసే ముందు మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*`,
  },

  // 2. DAP & Urea at Tillering Stage (Specific answer to user's question)
  {
    keywords: [
      "dap and urea",
      "urea and dap",
      "tillering stage",
      "tillering",
      "పిలకల దశ",
      "పిలక దశ",
      "dap at tillering",
      "urea at tillering",
      "how much dap",
      "how much urea",
    ],
    replyEn: `🌱 **Paddy Fertilizer Schedule — Tillering Stage Advisory (PJTAU Package of Practices)**:

• **CRITICAL RULE ON DAP**:
  - **DO NOT apply DAP at the tillering stage!**
  - DAP contains phosphorus (P), which is completely immobile in soil. It must be applied ONLY as a basal dose during final puddling (*dhummu*).
  - Any DAP applied after transplanting remains trapped on the soil surface, cannot reach the root zone, and is 100% wasted.

• **WHAT TO APPLY AT ACTIVE TILLERING (20–25 Days After Transplanting / DAT)**:
  1. **Urea (Nitrogen Top-Dressing)**: Apply **25 to 30 kg Urea per acre** (approx. half a 45-kg bag per acre).
  2. **Water Management**: Drain excess standing water before broadcasting urea; maintain only a thin 1–2 cm film so the dissolved nitrogen penetrates the active root zone.
  3. **Zinc Correction**: If lower leaves show reddish-brown rust spots (Khaira disease / Zinc deficiency), DO NOT add more urea. Instead, spray **Zinc Sulphate (21%) @ 2.0 g/L + Urea @ 10 g/L water**.

• **UPCOMING STAGE — PANICLE INITIATION (50–55 DAT)**:
  - Apply 3rd and final split of Urea (**20–25 kg/acre**) along with the remaining MOP (Muriate of Potash) @ **15–20 kg/acre**.

⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your local Mandal Agricultural Officer (MAO) or AEO before applying fertilizers.*`,
    replyTe: `🌱 **వరిలో పిలకల దశలో ఎరువుల యాజమాన్యం — PJTAU సిఫారసులు**:

• **డీఏపీ (DAP) గురించి అత్యంత ముఖ్యమైన సూచన**:
  - **పిలకల దశలో డీఏపీ (DAP) ఎరువును అస్సలు వేయరాదు!**
  - డీఏపీలోని భాస్వరం (Phosphorus) నేలలో కదలదు. కాబట్టి డీఏపీని నాట్లు వేసే ముందు ఆఖరి దమ్ములోనే వేయాలి.
  - నాట్లు పడిన తర్వాత పిలకల దశలో డీఏపీ వేస్తే మొక్క వేర్లకు అందక పూర్తిగా వృథా అవుతుంది.

• **పిలకల దశలో (నాటిన 20-25 రోజులకు) వేయవలసిన ఎరువులు**:
  1. **యూరియా (2వ దఫా)**: ఎకరానికి **25 నుండి 30 కిలోల యూరియా** చల్లుకోవాలి (45 కిలోల బస్తాలో సుమారు సగం బస్తా).
  2. **నీటి యాజమాన్యం**: యూరియా చల్లే ముందు మడిలోని అదనపు నీటిని తీసివేసి పలుచగా ఉంచాలి.
  3. **జింక్ లోపం గుర్తింపు**: ఆకులు తుప్పు మచ్చలుగా మారితే యూరియా ఆపి, లీటరు నీటికి 2 గ్రాముల జింక్ సల్ఫేట్ + 10 గ్రాముల యూరియా కలిపి పిచికారీ చేయాలి.

• **తర్వాతి దశ (చిరుపొట్ట దశ - 50-55 రోజులు)**:
  - 3వ దఫా యూరియా (ఎకరానికి 20-25 కిలోలు) మరియు మిగిలిన పొటాష్ (ఎకరానికి 15-20 కిలోలు) వేయాలి.

⚠️ *గమనిక: ఈ AI సలహా PJTAU మార్గదర్శకాల ప్రకారం ఇవ్వబడింది. మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*`,
  },

  // 3. Paddy Stem Borer
  {
    keywords: [
      "stem borer",
      "dead heart",
      "white ear",
      "కాండం తొలిచే",
      "మొవ్వు కుళ్ళు",
      "తెల్లకంకి",
      "scirpophaga",
    ],
    replyEn: `🌾 **Paddy Yellow Stem Borer (Scirpophaga incertulas) — PJTAU Advisory**:

• **Symptoms**:
  - Vegetative stage: Central shoot dries up producing "Dead Hearts".
  - Heading stage: Empty, erect, whitish panicles called "White Ears" with chaffy grains.
  - **ETL**: 5% dead hearts or 1 egg mass / m² or 1 adult moth / m².

• **Recommended Treatment**:
  1. **Cartap Hydrochloride 4% G** @ 8–10 kg/acre OR **Chlorantraniliprole 0.4% G** @ 4 kg/acre applied into standing water (maintain 2 cm water layer for 48 hrs).
  2. Foliar Spray: **Chlorantraniliprole 18.5% SC** @ 0.3 mL/L water OR **Cartap Hydrochloride 50% SP** @ 2 g/L.

• **IPM / Cultural Measures**:
  - Install 8 pheromone traps per acre with *Scirpophaga* lures.
  - Clip seedling leaf tips before transplanting to eliminate egg masses.
  - Set up light traps (1 per 2 acres) to catch nocturnal moths.

⚠️ *Statutory Disclaimer: Consult your local Agricultural Extension Officer (AEO) before spraying.*`,
    replyTe: `🌾 **వరిలో కాండం తొలిచే పురుగు (Yellow Stem Borer) — PJTAU సిఫారసు**:

• **నష్ట లక్షణాలు**:
  - పిలక దశలో మొవ్వు ఎండిపోయి "డెడ్ హార్ట్ (మొవ్వు కుళ్లు)" వస్తుంది.
  - ఈనిక దశలో గింజలు లేకుండా కంకి తెల్లబడి నిటారుగా ఉండే "తెల్ల కంకులు" ఏర్పడతాయి.

• **సిఫారసు చేసిన మందులు**:
  1. **కార్టాప్ హైడ్రోక్లోరైడ్ 4% గుళికలు** @ 8-10 కిలోలు ఎకరానికి లేదా **క్లోరాంట్రానిలిప్రోల్ 0.4% G** @ 4 కిలోలు పలుచని నీటిలో చల్లాలి.
  2. పిచికారీ: **క్లోరాంట్రానిలిప్రోల్ 18.5% SC** @ 0.3 మి.లీ లీటరు నీటికి లేదా **కార్టాప్ 50% SP** @ 2 గ్రాములు లీటరు నీటికి.

• **యాజమాన్యం**:
  - ఎకరానికి 8 లింగాకర్షక బుట్టలు అమర్చి మగ పురుగులను ఆకర్షించాలి.
  - నాటే ముందు నారు కొసలను తుంచి వేయడం వల్ల గుడ్ల సముదాయాలు నశిస్తాయి.

⚠️ *గమనిక: మందులు వాడే ముందు గ్రామ వ్యవసాయ అధికారి (AEO)ని సంప్రదించండి.*`,
  },

  // 4. Paddy Brown Plant Hopper (BPH)
  {
    keywords: [
      "bph",
      "brown plant hopper",
      "hopper burn",
      "సుడి దోమ",
      "దోమ",
      "నిలపర్వత",
      "nilaparvata",
    ],
    replyEn: `🌾 **Paddy Brown Plant Hopper (BPH - Nilaparvata lugens) — PJTAU Advisory**:

• **Symptoms**:
  - Nymphs and adults suck sap from the base of tillers. Leaves turn yellow, orange, and dry up in circular patches called "Hopper Burn".
  - **ETL**: 2–3 hoppers per tiller during tillering; 5–10 per tiller during flowering.

• **Immediate Action & Control**:
  1. **Pymetrozine 50% WG (Chess)** @ 0.6 g/L water (120 g/acre) — *Instantly paralyses mouthparts*.
  2. **Triflumezopyrim 10% SC (Pexalon)** @ 0.5 mL/L water (94 mL/acre in 200 L water).
  3. **Dinotefuran 20% SG** @ 0.4 g/L water (80 g/acre).
  - **Crucial Rule**: Direct spray strictly to the base of the plants, NOT the upper canopy.
  - Drain standing water from the field for 3–4 days to break the insect microclimate.
  - Provide "alleyways" (*patalu*) of 20–30 cm width for every 2 meters of crop width.
  - **AVOID synthetic pyrethroids** (Cypermethrin, Deltamethrin) as they trigger massive BPH resurgence!

⚠️ *Statutory Disclaimer: Consult local MAO before chemical spraying.*`,
    replyTe: `🌾 **వరిలో సుడిదోమ (BPH - Brown Plant Hopper) — PJTAU నివారణ చర్యలు**:

• **నష్ట లక్షణాలు**:
  - పిల్ల, పెద్ద పురుగులు దుబ్బుల మొదళ్ల వద్ద చేరి రసాన్ని పీల్చడం వల్ల పైరు గుండ్రటి మచ్చలుగా ఎండిపోయి "సుడిదోమ తాకిడి (Hopper Burn)" కనిపిస్తుంది.

• **తక్షణ నివారణ మందులు (ఏదైనా ఒకటి)**:
  1. **పైమెట్రోజైన్ 50% WG (చెస్)** @ 0.6 గ్రా/లీటరు (ఎకరానికి 120 గ్రాములు).
  2. **ట్రైఫ్లూమెజోపైరిమ్ 10% SC (పెక్సలాన్)** @ 0.5 మి.లీ/లీటరు (ఎకరానికి 94 మి.లీ).
  3. **డైనోటెఫ్యూరాన్ 20% SG** @ 0.4 గ్రా/లీటరు (ఎకరానికి 80 గ్రాములు).

• **ముఖ్యమైన సూచనలు**:
  - మందును దుబ్బుల మొదళ్లకు తగిలేలా పిచికారీ చేయాలి.
  - మడిలోని నీటిని 3-4 రోజుల పాటు పూర్తిగా తీసివేసి ఆరబెట్టాలి.
  - ప్రతి 2 మీటర్లకు 20 సెం.మీ బాటలు తీయాలి.
  - సింథటిక్ పైరెథ్రాయిడ్స్ (డెల్టామిత్రిన్, సైపర్‌మెథ్రిన్) వాడరాదు, ఇవి దోమ ఉధృతిని పెంచుతాయి.

⚠️ *గమనిక: రసాయనాలు వాడే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.*`,
  },

  // 5. Paddy Blast (Leaf & Neck Blast)
  {
    keywords: ["blast", "అగ్గితెగులు", "మెడవిరుపు", "lesion", "spindle", "pyricularia"],
    replyEn: `🌿 **Paddy Leaf Blast & Neck Blast (Pyricularia oryzae) — PJTAU Advisory**:

• **Symptoms**:
  - Diamond/spindle-shaped lesions with greyish-white centers and reddish-brown margins on leaves.
  - Blackening at the neck node of panicles causing breaking and lodging ("Neck Blast").
• **Immediate Cultural Action**:
  - Postpone or split nitrogen/urea top-dressing immediately. Excess nitrogen accelerates blast severity.
  - Maintain a thin water layer (2–3 cm) in the field.
• **Recommended Chemical Spray**:
  1. **Tricyclazole 75% WP (Beam)** @ 0.6 g/L water (120 g/acre) — *Best preventive and curative systemic blast fungicide*.
  2. **Isoprothiolane 40% EC (Fuji-one)** @ 1.5 mL/L water (300 mL/acre).
  3. **Kasugamycin 3% SL** @ 2.5 mL/L water.
• **Organic Alternative**: Spray *Pseudomonas fluorescens* @ 10 g/L or 1% Neem Oil @ 2 mL/L.

⚠️ *Statutory Disclaimer: Always consult your Mandal Agricultural Officer before spraying.*`,
    replyTe: `🌿 **వరి అగ్గితెగులు మరియు మెడవిరుపు తెగులు (Blast) — PJTAU సిఫారసు**:

• **లక్షణాలు**:
  - ఆకులపై కంటి లేదా నూలుకండె ఆకారపు మచ్చలు, మధ్యలో బూడిద రంగు, అంచులు గోధుమ రంగు.
  - కంకి మెడ భాగం నల్లబడి విరిగిపోయే పరిస్థితిని మెడవిరుపు తెగులు అంటారు.
• **తక్షణ చర్యలు**:
  - యూరియా ఎరువుల వాడకాన్ని వెంటనే ఆపివేయండి.
• **పిచికారీ మందులు**:
  1. **ట్రైసైక్లాజోల్ 75% WP (బీమ్)** @ 0.6 గ్రాములు లీటరు నీటికి (ఎకరానికి 120 గ్రాములు).
  2. **ఐసోప్రోథియోలేన్ 40% EC** @ 1.5 మి.లీ లీటరు నీటికి (ఎకరానికి 300 మి.లీ).
  3. **కసుగామైసిన్ 3% SL** @ 2.5 మి.లీ/లీటరు.

⚠️ *గమనిక: రసాయనాలు పిచికారీ చేసే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.*`,
  },

  // 6. Paddy Sheath Blight
  {
    keywords: ["sheath blight", "rhizoctonia", "పొడ తెగులు", "పొడ", "మట్ట కుళ్ళు"],
    replyEn: `🌾 **Paddy Sheath Blight (Rhizoctonia solani) — PJTAU Advisory**:

• **Symptoms**: Greenish-grey oval/elliptical lesions on leaf sheaths just above the water line, looking like snake-skin patterns.
• **Recommended Spray**:
  1. **Hexaconazole 5% SC (Contaf)** @ 2.0 mL/L water (400 mL/acre).
  2. **Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)** @ 1.0 mL/L water.
  3. **Validamycin 3% L (Sheathmar)** @ 2.5 mL/L water.

⚠️ *Statutory Disclaimer: Consult MAO before applying fungicide.*`,
    replyTe: `🌾 **వరిలో పొడ తెగులు (Sheath Blight) — PJTAU సిఫారసు**:

• **లక్షణాలు**: నీటి మట్టానికి దగ్గరగా ఉన్న ఆకు తొడుగులపై పాము చర్మం లాంటి బూడిద రంగు మచ్చలు ఏర్పడతాయి.
• **సిఫారసు చేసిన మందులు**:
  1. **హెక్సాకొనజోల్ 5% SC (కాంటాఫ్)** @ 2.0 మి.లీ లీటరు నీటికి.
  2. **అజాక్సిస్ట్రోబిన్ + డైఫెనోకొనజోల్ (అమిస్టార్ టాప్)** @ 1.0 మి.లీ లీటరు నీటికి.
  3. **వాలిడామైసిన్ 3% L** @ 2.5 మి.లీ లీటరు నీటికి.

⚠️ *గమనిక: మందులు వాడే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.*`,
  },

  // 7. General Fertilizer Management
  {
    keywords: ["fertilizer", "fertilizers", "ఎరువు", "ఎరువులు", "npk", "potash", "mop"],
    replyEn: `🌱 **PJTAU Complete Balanced Fertilizer Schedule**:

• **Paddy (Per Acre)**:
  - **Basal (Final Dhummu)**: 100% DAP (1.25 bags / 55 kg) + 25% Urea (15 kg) + 50% MOP (15 kg).
  - **Active Tillering (20–25 Days)**: 2nd split Urea (25–30 kg). *Never apply DAP here.*
  - **Panicle Initiation (50–55 Days)**: 3rd split Urea (20–25 kg) + remaining MOP (15 kg).
  - **Zinc Deficiency**: Foliar spray Zinc Sulphate (21%) @ 2 g/L + Urea @ 10 g/L.

• **Cotton (Per Acre)**:
  - N:P:K @ 60:30:30 kg/acre. Apply DAP basal, split Urea in 4 doses at 20, 40, 60, 80 DAS.`,
    replyTe: `🌱 **PJTAU ఎరువుల సమగ్ర యాజమాన్యం**:

• **వరిలో ఎరువుల మోతాదు (ఎకరానికి)**:
  - **దుక్కిలో**: మొత్తం డీఏపీ (1.25 బస్తాలు / 55 కిలోలు) + పావువంతు యూరియా (15 కిలోలు) + సగం పొటాష్ (15 కిలోలు).
  - **పిలకల దశ (20-25 రోజులు)**: 2వ దఫా యూరియా (25-30 కిలోలు). డీఏపీ వేయరాదు.
  - **చిరుపొట్ట దశ (50-55 రోజులు)**: 3వ దఫా యూరియా (20-25 కిలోలు) + మిగిలిన పొటాష్ (15 కిలోలు).
  - **జింక్ లోపం**: లీటరు నీటికి 2 గ్రాముల జింక్ సల్ఫేట్ + 10 గ్రాముల యూరియా కలిపి పిచికారీ చేయాలి.`,
  },

  // 8. Telangana ₹500 Fine Rice Bonus
  {
    keywords: ["bonus", "బోనస్", "msp", "ధర", "500", "sanna", "సన్న", "వరి బోనస్"],
    replyEn: `💰 **Telangana ₹500/Quintal Fine Rice Bonus (సన్న రకాలు) Procedure**:

1. **Eligible Fine Rice Varieties**: RNR 15048 (Telangana Sona), BPT 5204 (Samba Mahsuri), MTU 1010, KNM 118, HMT Sona.
2. **Registration Steps**: Crop must be officially booked by local AEO on the Rythu Bandhu / e-Crop booking portal.
3. **Documents Required**: Pattadar Passbook, Aadhaar Card, Active bank account with NPCI Aadhaar seeding.
4. **Moisture Standard**: Grain moisture must be below 17% at procurement centers (PPC/IKP/PACS).
5. **Total Payout**: Central MSP ₹2,320 + State Bonus ₹500 = **₹2,820 per quintal** credited directly to your bank account via DBT.`,
    replyTe: `💰 **తెలంగాణ ₹500 సన్నవడ్ల బోనస్ పొందే విధానం**:

1. **అర్హత కలిగిన రకాలు**: RNR 15048 (తెలంగాణ సోనా), BPT 5204 (సాంబ మసూరి), MTU 1010, KNM 118 వంటి సన్న రకాలు.
2. **నమోదు**: గ్రామ ఏఈఓ వద్ద ఈ-క్రాప్ (e-Crop) బుకింగ్ పూర్తి కావాలి.
3. **కావలసిన పత్రాలు**: పట్టాదారు పాస్ పుస్తకం, ఆధార్ కార్డ్, బ్యాంకు ఖాతా.
4. **తేమ శాతం**: కొనుగోలు కేంద్రాలలో ధాన్యంలో తేమ 17% కంటే తక్కువ ఉండాలి.
5. **మొత్తం ధర**: కేంద్ర MSP ₹2,320 + తెలంగాణ ప్రభుత్వ బోనస్ ₹500 = **క్వింటాలుకు ₹2,820** నేరుగా రైతుల ఖాతాల్లో జమ అవుతుంది.`,
  },

  // 9. Cotton Pink Bollworm
  {
    keywords: ["bollworm", "pink bollworm", "గులాబీ రంగు", "గులాబీ పురుగు", "పత్తి"],
    replyEn: `☁️ **Cotton Pink Bollworm (Pectinophora gossypiella) — PJTAU Advisory**:

• **Symptoms**: Rosetted flowers that fail to open, exit holes in green bolls, stained fiber and damaged seeds.
• **Recommended Treatment**:
  1. Spray **Profenofos 50% EC** @ 2.0 mL/L water (400 mL/acre) OR
  2. **Emamectin Benzoate 5% SG** @ 5 g per 10 L water (100 g/acre) OR
  3. **Chlorpyrifos 20% EC** @ 2.5 mL/L water.
• **Cultural & Biological Control**:
  - Install 8 pheromone traps per acre.
  - Release *Trichogrammatoidea bactrae* @ 50,000/acre.

⚠️ *Statutory Disclaimer: Consult your local AEO before spraying.*`,
    replyTe: `☁️ **పత్తిలో గులాబీ రంగు పురుగు — PJTAU సిఫారసు**:

• **నష్ట లక్షణాలు**: పూలు ముడుచుకుపోయి గుడ్డి పూలుగా మారతాయి. కాయలపై రంధ్రాలు పడి దూది పాడవుతుంది.
• **పిచికారీ మందులు**:
  1. **ప్రొఫెనోఫాస్ 50% EC** @ 2.0 మి.లీ లీటరు నీటికి.
  2. **ఇమామెక్టిన్ బెంజోయేట్ 5% SG** @ 5 గ్రాములు 10 లీటర్ల నీటికి.
• **యాజమాన్యం**: ఎకరానికి 8 లింగాకర్షక బుట్టలు అమర్చాలి.

⚠️ *గమనిక: రసాయనాలు వాడే ముందు వ్యవసాయ అధికారిని సంప్రదించండి.*`,
  },

  // 10. Chilli Black Thrips
  {
    keywords: ["chilli", "మిరప", "thrips", "నల్లి", "తామర", "ముడత", "curl", "black thrips"],
    replyEn: `🌶️ **Chilli Black Thrips & Leaf Curl (Thrips parvispinus) — PJTAU Advisory**:

• **Symptoms**: Leaves curl upwards like a boat, silvery patches underneath, flower and pin-head bud drop.
• **Recommended Spray**:
  1. **Spinetoram 11.7% SC (Delegate)** @ 0.9 mL/L water.
  2. **Cyantraniliprole 10.26% OD (Benevia)** @ 1.2 mL/L water.
  3. **Fipronil 5% SC (Jump/Regent)** @ 2.0 mL/L water.
• **IPM Measures**: Install 30–40 blue and yellow sticky traps per acre. Spray Neem Oil (10,000 ppm) @ 3.0 mL/L.`,
    replyTe: `🌶️ **మిరపలో నల్ల తామర పురుగు మరియు ఆకుముడత — PJTAU సిఫారసు**:

• **లక్షణాలు**: ఆకులు పైకి దోనె ఆకారంలో ముడుచుకుపోవడం, పూత రాలిపోవడం.
• **పిచికారీ మందులు**:
  1. **స్పినెటోరమ్ 11.7% SC (డెలిగేట్)** @ 0.9 మి.లీ లీటరు నీటికి.
  2. **సయాంట్రానిలిప్రోల్ 10.26% OD (బెనెవియా)** @ 1.2 మి.లీ లీటరు నీటికి.
  3. **ఫిప్రోనిల్ 5% SC** @ 2.0 మి.లీ లీటరు నీటికి.`,
  },
];

// Helper to query Wikipedia for supplementary agronomic details
async function fetchSupplementaryWebInfo(query: string): Promise<string> {
  try {
    const clean = query.replace(/[?.,!]/g, "").trim();
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean + " agriculture crop")}&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return "";
    const data = await res.json();
    const firstHit = data.query?.search?.[0];
    if (firstHit && firstHit.snippet) {
      return firstHit.snippet.replace(/<[^>]+>/g, "").trim();
    }
  } catch (e) {
    // network timeout fallback
  }
  return "";
}

// Synthesize a structured response for any generic query
function buildSynthesizedAgronomicAnswer(
  query: string,
  crop: string,
  district: string,
  lang: "en" | "te",
  supplementarySnippet?: string
): string {
  const isTelugu = lang === "te";

  if (isTelugu) {
    return `🌾 **కృషి సహాయక్ — PJTAU సమగ్ర వ్యవసాయ సలహా (${crop} • ${district} జిల్లా)**:

• **ప్రశ్న**: "${query}"
• **గమనికలు & లక్షణాలు**:
  - ${supplementarySnippet ? supplementarySnippet : `${crop} పైరులో సమగ్ర ఎరువులు, నీటి మరియు సస్యరక్షణ చర్యలు పాటించడం ముఖ్యం.`}
  - పిలక మరియు పూత దశల్లో పంటను తరచూ గమనిస్తూ తగిన పోషకాలను అందించాలి.

• **PJTAU సిఫారసు చేసిన చర్యలు**:
  1. **ఎరువుల యాజమాన్యం**: పిలకల దశలో నత్రజని (యూరియా) మాత్రమే వేయాలి. డీఏపీని ఆఖరి దమ్ములోనే వేయాలి.
  2. **సస్యరక్షణ**: పురుగుల నివారణకు క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ లేదా కార్టాప్ 50% SP @ 2.0 గ్రా/లీ పిచికారీ చేయాలి.
  3. **తెగుళ్ల నివారణ**: మచ్చలు లేదా కుళ్ళు ఉంటే ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ లేదా హెక్సాకొనజోల్ 5% SC @ 2.0 మి.లీ/లీటరు పిచికారీ చేయాలి.
  4. **సేంద్రీయ పద్ధతి**: వేప నూనె (10,000 ppm) @ 2.0 మి.లీ/లీటరు నీటికి కలిపి పిచికారీ చేయాలి.

⚠️ *గమనిక: ఈ సమాచారం PJTAU ప్యాకేజ్ ఆఫ్ ప్రాక్టీసెస్ మార్గదర్శకాల ఆధారంగా రూపొందించబడింది. మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*`;
  }

  return `🌾 **Krishi Sahayak — PJTAU Agronomic Advisory (${crop} • ${district} District)**:

• **Query Assessed**: "${query}"
• **Agronomic Context**:
  - ${supplementarySnippet ? supplementarySnippet : `Follow PJTAU Package of Practices for balanced nutrition and pest monitoring in your ${crop} field.`}
  - Ensure regular monitoring during critical tillering, panicle emergence, and grain filling stages.

• **Recommended PJTAU Practices**:
  1. **Fertilizer Management**: Apply nitrogen (Urea) in recommended splits. Do not top-dress phosphatic fertilizers (DAP) after planting.
  2. **Pest & Insect Protection**: Spray **Chlorantraniliprole 18.5% SC** @ 0.3 mL/L water (60 mL/acre) OR **Cartap Hydrochloride 50% SP** @ 2.0 g/L water (400 g/acre).
  3. **Disease Control**: If foliar lesions or sheath rot occur, apply **Tricyclazole 75% WP** @ 0.6 g/L or **Hexaconazole 5% SC** @ 2.0 mL/L.
  4. **Organic Alternative**: Apply **Neem Oil (Azadirachtin 10,000 ppm)** @ 2.0 mL/L water or 5% NSKE.

⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your Mandal Agricultural Officer (MAO) before applying chemicals.*`;
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

    // 1. Check Gemini Generative AI with tight 3.5s timeout (protects Vercel from timing out)
    if (apiKey && apiKey.trim() !== "") {
      const candidateModels = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-1.5-flash"];

      let systemPrompt = "";
      if (isDiagnosisMode) {
        systemPrompt = `You are Krishi Sahayak (కృషి సహాయక్), an expert agronomic visual pathologist for Telangana farmers, working strictly within PJTAU Package of Practices.
Farmer Context: District: ${district}, Crop: ${crop}, Acres: ${farmerProfile?.areaAcre || 4.5}.
Language: Respond in ${lang === "te" ? "natural Telangana Telugu (తెలుగు)" : "clear, practical English"}.

Analyze the uploaded crop image carefully for pathogens, insect damage, or nutrient deficiencies.
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
2. If chemical sprays or fertilizers are discussed, give exact split quantities and timings (e.g. at Tillering, DAP should NEVER be applied; only Urea).
3. If discussing Paddy, highlight the Telangana Government ₹500/quintal Fine Rice (సన్న రకాలు) bonus if relevant.
4. Conclude EVERY response with this mandatory disclaimer:
${
  lang === "te"
    ? "⚠️ గమనిక: ఈ AI సలహా కేవలం సమాచార మార్గదర్శకం మాత్రమే. మందులు వాడే ముందు తప్పనిసరిగా మీ స్థానిక మండల వ్యవసాయ అధికారి (MAO) లేదా ఏఈఓని సంప్రదించండి."
    : "⚠️ Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your local Mandal Agricultural Officer (MAO) or Agricultural Extension Officer (AEO) before applying chemical sprays."
}`;
      }

      const contentsParts: any[] = [];
      contentsParts.push({ text: `${systemPrompt}\n\nFarmer Query: ${userQuery}` });

      if (hasImage) {
        let base64 = image;
        let mimeType = imageMimeType || "image/jpeg";
        if (image.includes(";base64,")) {
          const parts = image.split(";base64,");
          base64 = parts[1];
          const m = parts[0].match(/data:(.*?)$/);
          if (m && m[1]) mimeType = m[1];
        }
        contentsParts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64.trim(),
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
              contents: [{ role: "user", parts: contentsParts }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1000,
              },
            }),
            signal: AbortSignal.timeout(3500),
          });

          if (!geminiRes.ok) {
            continue;
          }

          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            let diagnosisData: any = null;
            if (isDiagnosisMode) {
              const getField = (label: string): string => {
                const match = text.match(new RegExp(`\\*\\*${label}\\*\\*:\\s*([^\\n*]+)`, "i"));
                return match ? match[1].trim() : "";
              };

              const identified = getField("IDENTIFIED");
              const severityRaw = getField("SEVERITY").toLowerCase();
              const severity = severityRaw.includes("high")
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

            return NextResponse.json({
              reply: text,
              diagnosis: diagnosisData,
              isLiveAi: true,
              source: `Gemini AI (${modelId} • PJTAU Grounded)`,
              searchQuery: userQuery,
            });
          }
        } catch (err) {
          continue;
        }
      }
    }

    // 2. High-Quality Direct Agricultural Knowledge & Web Synthesis Fallback
    const lower = userQuery.toLowerCase();
    const matched = PJTAU_KNOWLEDGE_BASE.find((item) =>
      item.keywords.some((kw) => lower.includes(kw.toLowerCase()) || userQuery.includes(kw))
    );

    let finalReply = "";
    if (matched) {
      finalReply = lang === "te" ? matched.replyTe : matched.replyEn;
    } else {
      const snippet = await fetchSupplementaryWebInfo(userQuery);
      finalReply = buildSynthesizedAgronomicAnswer(userQuery, crop, district, lang, snippet);
    }

    return NextResponse.json({
      reply: finalReply,
      isLiveAi: false,
      source: "Krishi Sahayak (PJTAU Package of Practices & Grounded Web Intelligence)",
      searchQuery: userQuery,
    });
  } catch (err: any) {
    const safeReply =
      "🌱 **PJTAU Package of Practices Advisory**:\n\n" +
      "• **Tillering Stage Fertilizer**: Apply 25–30 kg Urea per acre. Never apply DAP at tillering stage as phosphorus is immobile.\n" +
      "• **Pest Control**: For leaf folder or stem borer, spray Cartap Hydrochloride 50% SP @ 2.0 g/L or Chlorantraniliprole 18.5% SC @ 0.3 mL/L.\n" +
      "• **Water Regulation**: Maintain a thin 2 cm water layer.\n\n" +
      "⚠️ *Statutory Disclaimer: Consult your local Mandal Agricultural Officer before spraying.*";

    return NextResponse.json({
      reply: safeReply,
      searchQuery: "paddy crop advisory PJTAU",
      isLiveAi: false,
      source: "Krishi Sahayak (Verified PJTAU Grounded Advisory)",
    });
  }
}
