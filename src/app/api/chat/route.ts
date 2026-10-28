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
    keywords: ["chemical fertilizer", "fertilizers schedule", "రసాయన ఎరువులు", "ఎరువుల మోతాదు", "ఎరువుల షెడ్యూల్", "npk", "potash", "mop", "balanced fertilizer"],
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

  // 11. Vermicompost & Earthworm Manure
  {
    keywords: [
      "vermicompost",
      "vermi compost",
      "earthworm",
      "earthworms",
      "వానపాముల",
      "వానపాములు",
      "vermiwash",
      "worm casting",
      "worm composting",
      "వానపాముల ఎరువు",
      "సేంద్రీయ ఎరువు",
      "సేంద్రియ ఎరువు",
      "organic compost",
      ],

    replyEn: `🪱 **Vermicompost (Earthworm Organic Manure) — PJTAU Package of Practices & Scientific Guidelines**:

• **What is Vermicompost?**:
  - Vermicompost is premium organic humus produced through the eco-biological breakdown of cow dung, crop stalks, and agricultural residue using specialized surface earthworms (**Eisenia fetida** or **Eudrilus eugeniae**).
  - It contains 5× more available nitrogen, 7× more available phosphorus, and 11× more potassium than standard Farm Yard Manure (FYM), alongside vital plant growth hormones (auxins & gibberellins).

• **Nutrient Profile**:
  - **Organic Carbon (OC)**: 18% to 22%
  - **Total Nitrogen (N)**: 1.5% to 2.5%
  - **Available Phosphorus (P₂O₅)**: 1.0% to 1.5%
  - **Potash (K₂O)**: 1.5% to 2.0%
  - **Micronutrients**: Zinc, Iron, Magnesium, Calcium, and living beneficial mycorrhizae.

• **PJTAU Recommended Application Dosages**:
  1. **Paddy & Field Crops**: Apply **2.0 to 2.5 tonnes per acre** as a basal dressing during final puddling (*dhummu*) or land preparation.
  2. **Cotton, Chilli & Maize**: Apply **1.5 to 2.0 tonnes per acre** in seed furrows before sowing.
  3. **Vegetables (Tomato, Brinjal, Bhendi)**: Apply **2.5 to 3.0 tonnes per acre** incorporated into the top 10 cm of soil.
  4. **Fruit Orchards (Mango, Guava, Citrus)**: Apply **5 to 10 kg per tree** along the root drip circle (1.5 m from trunk) twice yearly (June-July and Oct-Nov).

• **Farmer Bed Preparation Method**:
  - **Dimensions**: 10 ft length × 3 ft width × 2 ft height in shaded ground.
  - **Layers**: 3 inches dry twigs/straw base, 6 inches semi-decomposed cow dung (15–20 days old), upper layers with shredded crop residue.
  - **Earthworms**: Release 1.0 to 1.5 kg of *Eisenia fetida* earthworms (approx. 1,000–1,500 worms) per bed.
  - **Moisture**: Keep 40%–50% dampness by sprinkling water every 2 days (avoid water stagnation).
  - **Harvesting**: Ready in **60 to 75 days**. It turns dark brown/black with a pleasant forest soil odor and granular tea-powder texture.

• **Agronomic Benefits for Telangana Soils**:
  - Increases soil moisture-holding capacity by 25%–30% in red sandy loam and black cotton soils.
  - Restores beneficial mycorrhizae and earthworm colonies destroyed by excess chemicals.
  - Safely reduces synthetic Urea and DAP dependency by 25% to 30%.

⚠️ *Statutory Disclaimer: Always use well-cured, odorless, granular vermicompost. Keep covered under shade to protect earthworms and beneficial bacteria from direct UV sun rays.*`,
    replyTe: `🪱 **వానపాముల ఎరువు (వర్మీకంపోస్ట్) — PJTAU సమగ్ర శాస్త్రీయ మార్గదర్శకాలు**:

• **వర్మీకంపోస్ట్ అంటే ఏమిటి?**:
  - వానపాముల ఎరువు అనేది వ్యవసాయ వ్యర్థాలు, పశువుల పేడను ప్రత్యేకమైన వానపాములు (**ఐసీనియా ఫెటిడా** లేదా **యుడ్రిలస్ యూజినే**) సహాయంతో జీర్ణక్రియ జరిపించి తయారుచేసే మేలైన సేంద్రీయ ఎరువు.
  - సాధారణ పశువుల ఎరువుతో పోలిస్తే ఇందులో 5 రెట్లు ఎక్కువ నత్రజని, 7 రెట్లు ఎక్కువ భాస్వరం, 11 రెట్లు ఎక్కువ పొటాష్ ఉంటాయి.

• **పోషక విలువలు**:
  - **సేంద్రీయ కర్బనం (Organic Carbon)**: 18% నుండి 22%
  - **నత్రజని (Nitrogen)**: 1.5% నుండి 2.5%
  - **భాస్వరం (Phosphorus)**: 1.0% నుండి 1.5%
  - **పొటాష్ (Potassium)**: 1.5% నుండి 2.0%
  - **సూక్ష్మ పోషకాలు**: జింక్, ఇనుము, మెగ్నీషియం, కాల్షియం సమృద్ధిగా లభిస్తాయి.

• **PJTAU సిఫారసు చేసిన మోతాదు (ఎకరానికి)**:
  1. **వరి & ధాన్యపు పంటలు**: ఆఖరి దమ్ము లేదా నేల తయారీలో ఎకరానికి **2.0 నుండి 2.5 టన్నులు** వేయాలి.
  2. **పత్తి, మిరప, మొక్కజొన్న**: నాట్లు వేసే వరుసల్లో ఎకరానికి **1.5 నుండి 2.0 టన్నులు** వేయాలి.
  3. **కూరగాయల పంటలు**: ఎకరానికి **2.5 నుండి 3.0 టన్నులు** నేలలో కలియదున్నాలి.
  4. **పండ్ల తోటలు (మామిడి, జామ, బత్తాయి)**: చెట్టు వయస్సును బట్టి చెట్టుకు **5 నుండి 10 కిలోలు** పాదుల్లో (కాండం నుండి 1.5 మీటర్ల దూరంలో) వేయాలి.

• **తయారీ పద్ధతి (బెడ్ విధానం)**:
  - **కొలతలు**: 10 అడుగుల పొడవు × 3 అడుగుల వెడల్పు × 2 అడుగుల ఎత్తు గల బెడ్లను చెట్ల నీడలో ఏర్పాటు చేయాలి.
  - **పొరలు**: అడుగున 3 అంగుళాల ఎండు గడ్డి, పైన 6 అంగుళాల పాత పశువుల పేడ, ఆపై వ్యవసాయ వ్యర్థాలు వేయాలి.
  - **వానపాములు**: ఒక బెడ్ కు 1 నుండి 1.5 కిలోల ఐసీనియా ఫెటిడా వానపాములను వదలాలి.
  - **తేమ యాజమాన్యం**: ఎప్పుడూ 40-50% తేమ ఉండేలా 2-3 రోజులకు ఒకసారి నీరు చిలకరించాలి.
  - **ఎరువు తయారీ**: **60 నుండి 75 రోజుల్లో** నల్లటి టీ పొడి రూపంలో స్వచ్ఛమైన ఎరువు సిద్ధమవుతుంది.

• **రైతుకు కలిగే ప్రయోజనాలు**:
  - నేలలో తేమ నిల్వ సామర్థ్యం 25-30% పెరుగుతుంది.
  - రసాయన ఎరువుల (యూరియా, డీఏపీ) ఖర్చును 25% నుండి 30% వరకు తగ్గించవచ్చు.

⚠️ *గమనిక: వానపాముల ఎరువును ఎండలో ఆరబెట్టరాదు. తేమ ఆరిపోకుండా నీడలోనే నిల్వ ఉంచాలి.*`,
  },

  // 12. Jeevamrutham & Ghanajeevamrutham
  {
    keywords: [
      "jeevamrutham",
      "jeevamrut",
      "ghana jeevamrutham",
      "జీవామృతం",
      "ఘన జీవామృతం",
      "panchagavya",
      "పంచగవ్య",
      "cow dung",
      "cow urine",
      "ఆవు పేడ",
      "ఆవు మూత్రం",
      "జీవామృతం తయారీ",
    ],
    replyEn: `🧪 **Jeevamrutham & Ghanajeevamrutham (Liquid & Solid Bio-Enhancers) — Organic Farming Guide**:

• **What is Jeevamrutham?**:
  - Jeevamrutham is a fermented microbial culture that multiplies billions of beneficial soil bacteria and mycorrhizae using native desi cow dung and urine.
  - It acts as a bio-stimulant, making fixed soil nutrients (phosphorus, zinc, iron) available to plant roots.

• **Standard 200-Liter Recipe (For 1 Acre)**:
  1. **Desi Cow Dung**: 10 kg (fresh).
  2. **Desi Cow Urine**: 5 to 10 liters.
  3. **Jaggery (Gud)**: 2 kg (organic/unrefined).
  4. **Pulse Flour (Besan)**: 2 kg (gram flour or pigeonpea flour).
  5. **Undisturbed Soil**: Handful of live soil collected from the farm bund or banyan tree root zone (rich in native microbial inoculants).
  6. **Water**: 200 Liters in a plastic drum.

• **Fermentation Method**:
  - Stir the mixture clockwise with a wooden stick for 2–3 minutes twice daily (morning & evening).
  - Keep the drum covered with a jute gunny bag in shade.
  - Ready for field application in **48 to 72 hours** (summer) or **4 to 5 days** (winter).

• **Application Guidelines**:
  - **Through Irrigation Water**: Apply 200 Liters per acre mixed directly with flood/canal water or filtered through cloth for drip irrigation every 15–21 days.
  - **Foliar Spray**: Filter Jeevamrutham through double-layer cotton cloth; dilute **10% (1 Liter Jeevamrutham in 10 Liters water)** and spray on crops at vegetative and flowering stages.
  - **Ghanajeevamrutham (Solid Form)**: Mix 100 kg dry cow dung with 20 L liquid Jeevamrutham, dry in shade for 4–5 days, and broadcast @ 100–200 kg/acre as a basal soil dressing.

⚠️ *Statutory Disclaimer: Jeevamrutham is a biological inoculant, not a bulk chemical nutrient source. Combine with green manure or vermicompost for maximum crop vigor.*`,
    replyTe: `🧪 **జీవామృతం & ఘన జీవామృతం తయారీ — సమగ్ర సేంద్రీయ వ్యవసాయ మార్గదర్శకాలు**:

• **జీవామృతం అంటే ఏమిటి?**:
  - జీవామృతం అనేది దేశవాళీ ఆవు పేడ, మూత్రం ఆధారంగా నేలలోని కోట్ల కొద్దీ సూక్ష్మజీవులను వృద్ధి చేసే ఒక అద్భుతమైన ద్రవ జీవ రసాయనం.
  - ఇది నేలలో స్థిరీకరించబడిన పోషకాలను కరిగించి మొక్క వేర్లకు సులభంగా అందిస్తుంది.

• **200 లీటర్ల ద్రావణ తయారీకి కావలసిన వస్తువులు (1 ఎకరానికి)**:
  1. **దేశవాళీ ఆవు పేడ**: 10 కిలోలు (తాజాది).
  2. **ఆవు మూత్రం**: 5 నుండి 10 లీటర్లు.
  3. **నల్ల బెల్లం**: 2 కిలోలు.
  4. **ద్విదళ ధాన్యపు పిండి (బేసన్)**: 2 కిలోలు (శనగ లేదా మినుము పిండి).
  5. **సజీవ మట్టి**: గట్టు లేదా మర్రిచెట్టు కింద నుంచి సేకరించిన గుప్పెడు పుట్టమట్టి.
  6. **నీరు**: 200 లీటర్ల ప్లాస్టిక్ డ్రమ్ములో నింపాలి.

• **తయారీ విధానం**:
  - అన్నింటినీ కర్రతో సవ్యదిశలో (క్లాక్ వైజ్) రోజుకు రెండుసార్లు 2-3 నిమిషాలు కలపాలి.
  - డ్రమ్ముపై గోనెసంచి కప్పి నీడలో ఉంచాలి.
  - వేసవిలో **48-72 గంటల్లో**, చలికాలంలో 4-5 రోజుల్లో జీవామృతం సిద్ధమవుతుంది.

• **వాడే విధానం**:
  - **పారే నీటి ద్వారా**: ఎకరానికి 200 లీటర్ల ద్రావణాన్ని పంట కాల్వ నీటిలో లేదా ఫిల్టర్ చేసి డ్రిప్ ద్వారా ప్రతి 15-20 రోజులకు అందించాలి.
  - **పిచికారీ రూపంలో**: పలచటి బట్టతో వడపోసి, 10% మోతాదులో (10 లీటర్ల నీటికి 1 లీటరు జీవామృతం) పిచికారీ చేయాలి.
  - **ఘన జీవామృతం**: 100 కిలోల పొడి పేడకు 20 లీటర్ల జీవామృతం కలిపి నీడలో ఆరబెట్టి, ఆఖరి దుక్కిలో ఎకరానికి 100-200 కిలోలు చల్లుకోవాలి.

⚠️ *గమనిక: జీవామృతం తయారైన 7-10 రోజుల్లోపు పంటలకు వాడుకోవాలి.*`,
  },

  // 13. Weed Management & Herbicides
  {
    keywords: [
      "weed",
      "weeds",
      "herbicide",
      "weedicide",
      "కలుపు",
      "కలుపు మందు",
      "nominee gold",
      "bispyribac",
      "pretilachlor",
      "pendimethalin",
      "కలుపు నివారణ",
      "గడ్డి",
    ],
    replyEn: `🌾 **Weed Management in Field Crops — PJTAU Recommended Package of Practices**:

• **Paddy Weed Management (Transplanted & Wet DSR)**:
  1. **Pre-Emergence (0–3 Days After Transplanting / DAT)**:
     - **Pretilachlor 50% EC** @ 500 mL/acre OR **Pretilachlor 30.7% EC (with Safener / Rifit)** @ 600 mL/acre in 200 L water.
     - Alternatively, mix with 20–25 kg dry sand and broadcast evenly. Maintain a thin 2 cm layer of standing water for 48 hours.
  2. **Early Post-Emergence (15–20 DAT / 2–3 Weed Leaf Stage)**:
     - **Bispyribac Sodium 10% SC (Nominee Gold)** @ 80–100 mL/acre (diluted in 150 L water). Controls major grasses, broadleaf weeds, and sedges.
     - For broadleaf weeds only: **2,4-D Sodium Salt 80% WP** @ 400 g/acre or **Almix (Metsulfuron + Chlorimuron)** @ 8 g/acre.
     - Drain standing water before spraying; re-flood the field 48 hours after application.

• **Cotton & Maize Weed Control**:
  - **Pre-Emergence (within 48 hours of sowing)**: Spray **Pendimethalin 30% EC** @ 1.0–1.3 L/acre in 200 L water on moist soil.
  - **Post-Emergence in Maize (15–20 DAS)**: Spray **Tembotrione 34.4% SC (Laudis)** @ 115 mL/acre with surfactant.

⚠️ *Statutory Disclaimer: Never spray herbicides during high winds or rain. Use flat fan or floodjet nozzles for uniform ground coverage.*`,
    replyTe: `🌾 **వరి మరియు వాణిజ్య పంటల్లో కలుపు యాజమాన్యం — PJTAU సిఫారసులు**:

• **వరిలో కలుపు నివారణ**:
  1. **మొలక రాకముందు (నాటిన 0-3 రోజుల్లో)**:
     - **ప్రీటిలాక్లోర్ 50% EC** @ 500 మి.లీ లేదా సేఫెనర్ కలిగిన **ప్రీటిలాక్లోర్ 30.7% EC (రిఫిట్)** @ 600 మి.లీ ఎకరానికి 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయాలి.
     - లేదా 25 కిలోల ఇసుకలో కలిపి మడిలో సమానంగా చల్లాలి. 48 గంటలు పలుచటి నీరు ఉంచాలి.
  2. **మొలక వచ్చిన తర్వాత (నాటిన 15-20 రోజులకు / 2-3 ఆకుల దశలో)**:
     - **బిస్పైరిబాక్ సోడియం 10% SC (నామినీ గోల్డ్)** @ 80-100 మి.లీ ఎకరానికి 150 లీటర్ల నీటిలో కలిపి పిచికారీ చేయాలి. ఇది గడ్డి జాతి మరియు వెడల్పాకు కలుపును సమర్థవంతంగా అణిచివేస్తుంది.
     - వెడల్పాకు కలుపు మాత్రమే ఉంటే: **ఆల్మిక్స్ (Almix)** @ 8 గ్రాములు లేదా **2,4-D సోడియం సాల్ట్** @ 400 గ్రాములు ఎకరానికి వాడాలి.
     - మందు కొట్టేముందు నీటిని తీసివేసి, పిచికారీ చేసిన 48 గంటల తర్వాత తిరిగి నీరు పెట్టాలి.

• **పత్తి & మొక్కజొన్నలో కలుపు**:
  - విత్తిన 48 గంటల్లోపు తడి నేలపై **పెండిమిథాలిన్ 30% EC** @ 1.0-1.3 లీటర్లు ఎకరానికి పిచికారీ చేయాలి.

⚠️ *గమనిక: కలుపు మందులను ఫ్లాట్ ఫ్యాన్ నాజిల్‌తో తగినంత తేమ ఉన్నప్పుడు మాత్రమే పిచికారీ చేయాలి.*`,
  },

  // 14. Soil Testing & Soil Health
  {
    keywords: [
      "soil test",
      "soil testing",
      "భూసార",
      "మట్టి పరీక్ష",
      "soil health",
      "భూసార పరీక్ష",
      "soil ph",
      "saline soil",
      "alkaline soil",
      "చౌడు నేలలు",
    ],
    replyEn: `🧪 **Soil Testing & Soil Health Management — PJTAU Guidelines**:

• **Why Test Soil?**:
  - Determines available Nitrogen (N), Phosphorus (P), Potassium (K), Zinc (Zn), and Iron (Fe).
  - Measures soil pH (acidity/alkalinity) and Electrical Conductivity (EC) to prevent over-fertilization.

• **Scientific Soil Sampling Procedure**:
  1. **Timing**: Sample in May-June (summer) before monsoon ploughing or after crop harvest.
  2. **Pattern**: Take 10 to 15 zigzag sub-samples across the 1-acre field.
  3. **Depth**:
     - Field crops (Paddy, Maize, Cotton): 0 to 15 cm depth.
     - Tree orchards (Mango, Citrus): 0–30 cm and 30–60 cm depth.
  4. **V-Shaped Cut**: Remove surface weeds, make a 'V' shaped 15 cm pit, scrape a 1-inch slice of soil from top to bottom.
  5. **Quartering Method**: Mix all sub-samples together, divide into 4 quarters, discard opposite quarters repeatedly until 500 grams remain.
  6. **Packaging**: Air-dry under shade (never direct sun), pack in clean cloth bag with farmer name, survey number, and village. Submit to District Soil Testing Lab or Mandal Agriculture Office (MAO).

• **Soil Reclamation**:
  - **Alkaline / Sodic Soil (pH > 8.5)**: Apply **Gypsum @ 1 to 2 tonnes/acre** followed by heavy leaching.
  - **Acidic Soil (pH < 6.5)**: Apply **Agricultural Lime @ 500 kg/acre**.
  - **Saline Soil (High EC)**: Improve drainage channels and grow green manure crops (*Dhaincha*).

⚠️ *Statutory Disclaimer: Apply fertilizers strictly according to your Government Soil Health Card recommendations to cut input costs.*`,
    replyTe: `🧪 **భూసార పరీక్ష & నేల ఆరోగ్య యాజమాన్యం — PJTAU మార్గదర్శకాలు**:

• **మట్టి నమూనా తీసే సరైన విధానం**:
  1. **సమయం**: వేసవిలో (మే-జూన్) లేదా పంట కోతల తర్వాత మట్టి నమూనా తీయాలి.
  2. **నమూనాల సేకరణ**: ఎకరం పొలంలో 'V' ఆకారంలో 10-15 చోట్ల జిగ్‌జాగ్ పద్ధతిలో సేకరించాలి.
  3. **లోతు**: వరి, పత్తి, మొక్కజొన్న పంటలకు **0 నుండి 15 సెం.మీ (అర అడుగు)** లోతు వరకు మట్టి తీయాలి.
  4. **నాలుగు భాగాల విభజన పద్ధతి**: సేకరించిన మట్టిని బాగా కలిపి, చతురస్రాకారంలో పరిచి, ఎదురెదురు భాగాలను తొలగిస్తూ చివరికి **అర కిలో (500 గ్రా)** మిగిలేలా చేయాలి.
  5. **ప్యాకింగ్**: మట్టిని నీడలోనే ఆరబెట్టి, శుభ్రమైన గుడ్డ సంచిలో రైతు పేరు, సర్వే నంబర్ రాసి మండల వ్యవసాయ అధికారి (MAO) లేదా జిల్లా భూసార పరీక్షా కేంద్రానికి పంపాలి.

• **సమస్యాత్మక నేలల నివారణ**:
  - **చౌడు నేలలు (pH 8.5 కంటే ఎక్కువ)**: ఎకరానికి **1 నుండి 2 టన్నుల జిప్సం** వేసి నీరు పెట్టి మురుగునీటిని తీసివేయాలి.
  - **ఆమ్ల నేలలు (pH 6.5 కంటే తక్కువ)**: ఎకరానికి **500 కిలోల సున్నం** వేసి కలియదున్నాలి.
  - **పచ్చిరొట్ట ఎరువులు**: జీలుగా, జనుము సాగు చేసి పూత దశలో కలియదున్నడం వల్ల భూమి సారవంతం అవుతుంది.

⚠️ *గమనిక: మీ సాయిల్ హెల్త్ కార్డ్ (భూసార కార్డు) సిఫారసుల ఆధారంగానే ఎరువులను వాడండి.*`,
  },

  // 15. Maize Fall Armyworm (FAW)
  {
    keywords: [
      "fall armyworm",
      "faw",
      "armyworm",
      "కత్తెర పురుగు",
      "మొక్కజొన్న",
      "maize pest",
      "spodoptera frugiperda",
      "కత్తెర",
    ],
    replyEn: `🌽 **Maize Fall Armyworm (Spodoptera frugiperda) — PJTAU Management Protocol**:

• **Damage Symptoms**:
  - Young larvae scrape leaf surfaces leaving papery windows. Older larvae enter leaf whorls (*suzi*) and feed aggressively, leaving jagged holes and heavy sawdust-like fecal pellets.
  - **ETL**: 5% damaged seedlings or 10% whorl damage.

• **Recommended Chemical Spray (Direct Spray into Whorl)**:
  1. **Emamectin Benzoate 5% SG (Proclaim)** @ 0.4 g/L water (80 g/acre).
  2. **Chlorantraniliprole 18.5% SC (Coragen)** @ 0.4 mL/L water (80 mL/acre).
  3. **Spinetoram 11.7% SC (Delegate)** @ 0.5 mL/L water.

• **Poison Bait Application (Highly Effective for Late Instars)**:
  - Mix **10 kg Rice Bran + 2 kg Jaggery dissolved in 2–3 L water**; ferment for 24 hours.
  - Mix with **Thiodicarb 75% WP @ 100 g** or **Chlorpyrifos 20% EC @ 100 mL** half an hour before application. Apply small pellets into plant whorls in early evening.

⚠️ *Statutory Disclaimer: Spray nozzles must be directed vertically into the plant whorls for effective larval kill.*`,
    replyTe: `🌽 **మొక్కజొన్నలో కత్తెర పురుగు (Fall Armyworm) — PJTAU సమగ్ర నివారణ చర్యలు**:

• **నష్ట లక్షణాలు**: చిన్న లార్వాలు ఆకుల పత్రహరితాన్ని గీకి తిని తెల్లటి కిటికీల వంటి మచ్చలు చేస్తాయి. పెద్ద పురుగులు సుడులలో చేరి ఆకులను కొరికివేసి, రంపపు పొట్టు వంటి మలాన్ని వదులుతాయి.

• **సిఫారసు చేసిన మందులు (సుడిలో పడేలా పిచికారీ చేయాలి)**:
  1. **ఇమామెక్టిన్ బెంజోయేట్ 5% SG** @ 0.4 గ్రాములు లీటరు నీటికి (ఎకరానికి 80 గ్రాములు).
  2. **క్లోరాంట్రానిలిప్రోల్ 18.5% SC (కోరాజెన్)** @ 0.4 మి.లీ లీటరు నీటికి.
  3. **స్పినెటోరమ్ 11.7% SC** @ 0.5 మి.లీ లీటరు నీటికి.

• **విషపు ఎర తయారీ (తీవ్రత ఎక్కువగా ఉన్నప్పుడు)**:
  - 10 కిలోల తవుడు + 2 కిలోల బెల్లాన్ని 2-3 లీటర్ల నీటిలో కలిపి 24 గంటలు పులియబెట్టాలి.
  - పొలంలో వేసే అరగంట ముందు **థయోడికార్బ్ 75% WP @ 100 గ్రాములు** కలిపి చిన్న చిన్న ఉండలుగా చేసి సాయంత్రం వేళ మొక్క సుడుల్లో వేయాలి.`,
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

// Synthesize a structured topic-aware response for any agricultural query
function buildSynthesizedAgronomicAnswer(
  query: string,
  crop: string,
  district: string,
  lang: "en" | "te",
  supplementarySnippet?: string
): string {
  const isTelugu = lang === "te";
  const qLower = query.toLowerCase();

  // 1. Organic, Compost, Soil Health or Vermicompost
  const isOrganic = qLower.includes("vermi") || qLower.includes("compost") || qLower.includes("organic") ||
                    qLower.includes("manure") || qLower.includes("earthworm") || qLower.includes("జీవ") ||
                    qLower.includes("సేంద్రీయ") || qLower.includes("వానపాము");
  if (isOrganic) {
    if (isTelugu) {
      return "🪱 **కృషి సహాయక్ — PJTAU సేంద్రీయ ఎరువుల మార్గదర్శకం (" + crop + " • " + district + " జిల్లా)**:\n\n" +
        "• **ప్రశ్న**: \"" + query + "\"\n" +
        "• **శాస్త్రీయ వివరణ**:\n" +
        "  - వర్మీకంపోస్ట్ (వానపాముల ఎరువు) మరియు సేంద్రీయ ఎరువులు నేలలోని సేంద్రీయ కర్బనాన్ని (Organic Carbon) పెంచి, వేర్లకు కావలసిన నత్రజని, భాస్వరం, పొటాష్ పోషకాలను సహజసిద్ధంగా అందిస్తాయి.\n" +
        "  - సాధారణ పశువుల ఎరువు కన్నా వానపాముల ఎరువులో 5 రెట్లు అధిక పోషకాలు మరియు నేల మైక్రోబయోమ్‌ను కాపాడే ఎంజైములు ఉంటాయి.\n\n" +
        "• **PJTAU సిఫారసు చేసిన మోతాదులు**:\n" +
        "  1. **వరి & ధాన్యపు పంటలు**: ఆఖరి దమ్ము లేదా దుక్కిలో ఎకరానికి **2.0 నుండి 2.5 టన్నుల** వర్మీకంపోస్ట్ వేయాలి.\n" +
        "  2. **పత్తి, మిరప, కూరగాయలు**: నాట్లు వేసే వరుసల్లో ఎకరానికి **1.5 నుండి 2.0 టన్నులు** వేయాలి.\n" +
        "  3. **ద్రవ జీవామృతం**: 200 లీటర్ల జీవామృతాన్ని ప్రతి 15-20 రోజులకు ఒకసారి నీటి తడి ద్వారా అందించాలి.\n\n" +
        "• **రైతుకు కలిగే లాభాలు**:\n" +
        "  - నేలలో తేమ నిల్వ సామర్థ్యం 25-30% పెరుగుతుంది.\n" +
        "  - రసాయన యూరియా/డీఏపీ ఖర్చును 25% నుండి 30% వరకు తగ్గించవచ్చు.\n\n" +
        "⚠️ *గమనిక: సేంద్రీయ ఎరువులను నేరుగా ఎండలో ఆరబెట్టరాదు. నీడలోనే తేమ ఆరకుండా నిల్వ ఉంచాలి.*";
    }
    return "🪱 **Krishi Sahayak — PJTAU Organic & Soil Health Advisory (" + crop + " • " + district + " District)**:\n\n" +
      "• **Query Assessed**: \"" + query + "\"\n" +
      "• **Scientific Agronomy Context**:\n" +
      "  - Vermicompost and organic manures significantly enrich soil organic carbon (OC), water holding capacity, and beneficial mycorrhizae.\n" +
      "  - Earthworm compost (*Eisenia fetida*) delivers 5× more nitrogen, 7× more phosphorus, and 11× more potassium than standard farmyard manure (FYM).\n\n" +
      "• **PJTAU Recommended Dosages**:\n" +
      "  1. **Paddy & Field Crops**: Apply **2.0 to 2.5 tonnes per acre** as a basal dressing during final puddling (*dhummu*).\n" +
      "  2. **Cotton, Chilli & Vegetables**: Apply **1.5 to 2.0 tonnes per acre** placed along seed furrows.\n" +
      "  3. **Liquid Bio-stimulants**: Apply **Jeevamrutham @ 200 L/acre** with irrigation every 15–21 days.\n\n" +
      "• **Soil Health Benefits**:\n" +
      "  - Increases drought resilience by holding 25%–30% more moisture in root zones.\n" +
      "  - Offsets chemical fertilizer (Urea & DAP) requirements by 25% to 30%.\n\n" +
      "⚠️ *Statutory Disclaimer: Always apply well-decomposed, odorless vermicompost. Keep covered under shade to preserve active microbes.*";
  }

  // 2. Weeds & Herbicides
  const isWeed = qLower.includes("weed") || qLower.includes("herbicide") || qLower.includes("కలుపు") || qLower.includes("గడ్డి");
  if (isWeed) {
    if (isTelugu) {
      return "🌾 **కృషి సహాయక్ — PJTAU కలుపు యాజమాన్యం (" + crop + " • " + district + " జిల్లా)**:\n\n" +
        "• **ప్రశ్న**: \"" + query + "\"\n" +
        "• **PJTAU సిఫారసు చేసిన చర్యలు**:\n" +
        "  1. **మొలక రాకముందు (0-3 రోజులు)**: ప్రీటిలాక్లోర్ 50% EC @ 500 మి.లీ/ఎకరానికి లేదా రిఫిట్ (సేఫెనర్) @ 600 మి.లీ 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయాలి.\n" +
        "  2. **మొలక వచ్చిన తర్వాత (15-20 రోజులు)**: బిస్పైరిబాక్ సోడియం 10% SC (నామినీ గోల్డ్) @ 80-100 మి.లీ/ఎకరానికి పిచికారీ చేయాలి.\n" +
        "  3. **నీటి యాజమాన్యం**: మందు పిచికారీ చేసే ముందు నీరు తీసివేసి, 48 గంటల తర్వాత తిరిగి పలుచగా నీరు నిలపాలి.\n\n" +
        "⚠️ *గమనిక: కలుపు మందులను తగినంత తేమ ఉన్నప్పుడు ఫ్లాట్ ఫ్యాన్ నాజిల్‌తో మాత్రమే పిచికారీ చేయాలి.*";
    }
    return "🌾 **Krishi Sahayak — PJTAU Weed Management (" + crop + " • " + district + " District)**:\n\n" +
      "• **Query Assessed**: \"" + query + "\"\n" +
      "• **PJTAU Recommended Measures**:\n" +
      "  1. **Pre-Emergence (0–3 DAT)**: Apply Pretilachlor 50% EC @ 500 mL/acre or Rifit (with safener) @ 600 mL/acre in 200 L water.\n" +
      "  2. **Post-Emergence (15–20 DAT)**: Spray Bispyribac Sodium 10% SC (Nominee Gold) @ 80–100 mL/acre for sedges and grassy weeds.\n" +
      "  3. **Field Moisture**: Drain standing water before herbicide application; re-flood with a shallow 2 cm layer 48 hours later.\n\n" +
      "⚠️ *Statutory Disclaimer: Spray only in calm morning hours using a floodjet or flat fan nozzle.*";
  }

  // 3. Default General Agronomic Advisory
  const contextSnippet = supplementarySnippet || (isTelugu
    ? crop + " పైరులో సమగ్ర ఎరువులు, నీటి మరియు సస్యరక్షణ చర్యలు పాటించడం ముఖ్యం."
    : "Follow PJTAU Package of Practices for balanced nutrition and pest monitoring in your " + crop + " field.");

  if (isTelugu) {
    return "🌾 **కృషి సహాయక్ — PJTAU సమగ్ర వ్యవసాయ సలహా (" + crop + " • " + district + " జిల్లా)**:\n\n" +
      "• **ప్రశ్న**: \"" + query + "\"\n" +
      "• **గమనికలు & లక్షణాలు**:\n" +
      "  - " + contextSnippet + "\n" +
      "  - పిలక మరియు పూత దశల్లో పంటను తరచూ గమనిస్తూ తగిన పోషకాలను అందించాలి.\n\n" +
      "• **PJTAU సిఫారసు చేసిన చర్యలు**:\n" +
      "  1. **ఎరువుల యాజమాన్యం**: పిలకల దశలో నత్రజని (యూరియా) మాత్రమే వేయాలి. డీఏపీని ఆఖరి దమ్ములోనే వేయాలి.\n" +
      "  2. **సస్యరక్షణ**: పురుగుల నివారణకు క్లోరాంట్రానిలిప్రోల్ 18.5% SC @ 0.3 మి.లీ లేదా కార్టాప్ 50% SP @ 2.0 గ్రా/లీ పిచికారీ చేయాలి.\n" +
      "  3. **తెగుళ్ల నివారణ**: మచ్చలు లేదా కుళ్ళు ఉంటే ట్రైసైక్లాజోల్ 75% WP @ 0.6 గ్రా/లీ లేదా హెక్సాకొనజోల్ 5% SC @ 2.0 మి.లీ/లీటరు పిచికారీ చేయాలి.\n" +
      "  4. **సేంద్రీయ పద్ధతి**: వేప నూనె (10,000 ppm) @ 2.0 మి.లీ/లీటరు నీటికి కలిపి పిచికారీ చేయాలి.\n\n" +
      "⚠️ *గమనిక: ఈ సమాచారం PJTAU ప్యాకేజ్ ఆఫ్ ప్రాక్టీసెస్ మార్గదర్శకాల ఆధారంగా రూపొందించబడింది. మీ మండల వ్యవసాయ అధికారి (MAO)ని సంప్రదించండి.*";
  }

  return "🌾 **Krishi Sahayak — PJTAU Agronomic Advisory (" + crop + " • " + district + " District)**:\n\n" +
    "• **Query Assessed**: \"" + query + "\"\n" +
    "• **Agronomic Context**:\n" +
    "  - " + contextSnippet + "\n" +
    "  - Ensure regular monitoring during critical tillering, panicle emergence, and grain filling stages.\n\n" +
    "• **Recommended PJTAU Practices**:\n" +
    "  1. **Fertilizer Management**: Apply nitrogen (Urea) in recommended splits. Do not top-dress phosphatic fertilizers (DAP) after planting.\n" +
    "  2. **Pest & Insect Protection**: Spray **Chlorantraniliprole 18.5% SC** @ 0.3 mL/L water (60 mL/acre) OR **Cartap Hydrochloride 50% SP** @ 2.0 g/L water (400 g/acre).\n" +
    "  3. **Disease Control**: If foliar lesions or sheath rot occur, apply **Tricyclazole 75% WP** @ 0.6 g/L or **Hexaconazole 5% SC** @ 2.0 mL/L.\n" +
    "  4. **Organic Alternative**: Apply **Neem Oil (Azadirachtin 10,000 ppm)** @ 2.0 mL/L water or 5% NSKE.\n\n" +
    "⚠️ *Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your Mandal Agricultural Officer (MAO) before applying chemicals.*";
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
    const isApiKeyValid = Boolean(
      apiKey &&
      typeof apiKey === "string" &&
      apiKey.trim().length >= 30 &&
      apiKey.trim().startsWith("AIzaSy")
    );

    // 1. Check Gemini Generative AI only if a valid AI Studio key is provided
    if (isApiKeyValid) {
      const candidateModels = ["gemini-1.5-flash", "gemini-1.5-flash-8b"];

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
