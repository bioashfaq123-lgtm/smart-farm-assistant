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
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, lang = "en", farmerProfile } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If GEMINI_API_KEY is present, call Gemini Generative API
    if (apiKey && apiKey.trim() !== "") {
      const district = farmerProfile?.district || "Jagtial";
      const crop = farmerProfile?.primaryCrop || "Paddy";

      const systemPrompt = `You are Krishi Sahayak (కృషి సహాయక్), an expert bilingual agronomic AI assistant for Telangana farmers, working strictly within PJTAU (Professor Jayashankar Telangana State Agricultural University) Package of Practices.
Farmer context: District: ${district}, Crop: ${crop}, Acres: ${farmerProfile?.areaAcre || 4.5}.
Language: Respond in ${lang === "te" ? "natural Telangana Telugu (తెలుగు)" : "clear, practical English"}.
Always adhere to:
1. Provide practical, step-by-step agronomy advice with precise dosages per litre of water or per acre.
2. If chemical sprays are recommended, always provide both organic/IPM preventive alternatives and standard approved chemical molecules with exact active ingredient percentage.
3. If discussing Paddy, highlight the Telangana Government ₹500/quintal Fine Rice (సన్న రకాలు) bonus if relevant.
4. Conclude EVERY response with this mandatory disclaimer:
${
  lang === "te"
    ? "⚠️ గమనిక: ఈ AI సలహా కేవలం సమాచార మార్గదర్శకం మాత్రమే. మందులు వాడే ముందు తప్పనిసరిగా మీ స్థానిక మండల వ్యవసాయ అధికారి (MAO) లేదా ఏఈఓని సంప్రదించండి."
    : "⚠️ Statutory Disclaimer: AI advice is indicative agronomic guidance based on PJTAU Package of Practices. Always consult your local Mandal Agricultural Officer (MAO) or Agricultural Extension Officer (AEO) before applying chemical sprays."
}`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      try {
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nFarmer Question: ${message}` }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800,
            },
          }),
        });

        if (geminiRes.status === 429) {
          // Rate limit reached
          return NextResponse.json(
            {
              error: "AI rate limit reached. Please wait a minute or consult the offline agronomic advisory.",
              isRateLimited: true,
            },
            { status: 429 }
          );
        }

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidate = geminiData.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;

          if (text) {
            return NextResponse.json({
              reply: text,
              isLiveAi: true,
              source: "Gemini 1.5 Flash (PJTAU Grounded)",
            });
          }
        }
      } catch (err) {
        // Fall back gracefully below
      }
    }

    // 2. Verified Offline Agronomy Knowledge Fallback (Guaranteed zero crashes)
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
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to process chat query. Please try again.",
        details: err?.message,
      },
      { status: 500 }
    );
  }
}
