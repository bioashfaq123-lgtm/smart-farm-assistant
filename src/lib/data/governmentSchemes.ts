export interface GovernmentScheme {
  id: string;
  nameEn: string;
  nameTe: string;
  shortName: string;
  level: "state" | "central";
  category: "dbt" | "insurance" | "irrigation" | "machinery" | "credit" | "soil";
  categoryLabelEn: string;
  categoryLabelTe: string;
  badgeEn: string;
  badgeTe: string;
  financialBenefitEn: string;
  financialBenefitTe: string;
  summaryEn: string;
  summaryTe: string;
  eligibilityEn: string[];
  eligibilityTe: string[];
  documentsRequiredEn: string[];
  documentsRequiredTe: string[];
  howToApplyEn: string[];
  howToApplyTe: string[];
  officialPortalUrl: string;
  portalName: string;
  helpline: string;
  iconType: string;
  isPopular?: boolean;
}

export const GOVERNMENT_SCHEMES_DATA: GovernmentScheme[] = [
  // --- TELANGANA STATE SCHEMES ---
  {
    id: "ts-rythu-bharosa",
    nameEn: "Rythu Bharosa Investment Support",
    nameTe: "రైతు భరోసా పెట్టుబడి సాయం",
    shortName: "Rythu Bharosa",
    level: "state",
    category: "dbt",
    categoryLabelEn: "Direct Benefit Transfer (DBT)",
    categoryLabelTe: "ప్రత్యక్ష నగదు బదిలీ (DBT)",
    badgeEn: "Telangana State Scheme",
    badgeTe: "తెలంగాణ రాష్ట్ర పథకం",
    financialBenefitEn: "₹15,000 / Acre / Year (₹7,500 per Kharif & Rabi Season)",
    financialBenefitTe: "ఎకరానికి ఏటా ₹15,000 (ఖరీఫ్ & రబీ సీజన్‌కు ₹7,500 చొప్పున)",
    summaryEn: "Annual direct investment support for agricultural inputs (seeds, fertilizers, plowing) provided directly to farmer bank accounts before each crop season.",
    summaryTe: "విత్తనాలు, ఎరువులు మరియు సాగు ఖర్చుల కోసం పంట కాలానికి ముందు ఎకరానికి ఏటా ₹15,000 నేరుగా రైతుల ఖాతాలో జమ చేసే పథకం.",
    eligibilityEn: [
      "All patta landholders with agricultural land in Telangana",
      "Verified tenant farmers (కౌలు రైతులు) as per state guidelines",
      "No upper acreage cap on eligible agricultural land",
      "Aadhaar must be linked to bank account and Dharani passbook"
    ],
    eligibilityTe: [
      "తెలంగాణలో వ్యవసాయ పట్టా భూమి కలిగిన రైతులందరూ",
      "ప్రభుత్వ నిబంధనల ప్రకారం గుర్తింపు పొందిన కౌలు రైతులు",
      "వ్యవసాయ భూమిపై గరిష్ట పరిమితి లేదు",
      "ధరణి పాస్‌బుక్, ఆధార్ మరియు బ్యాంక్ ఖాతా అనుసంధానం తప్పనిసరి"
    ],
    documentsRequiredEn: [
      "Dharani Pattadar Passbook / RoR 1B",
      "Aadhaar Card copy",
      "Active Bank Account Passbook with IFSC",
      "Passport size photograph"
    ],
    documentsRequiredTe: [
      "ధరణి పట్టాదారు పాస్‌బుక్ / RoR 1B",
      "రైతు ఆధార్ కార్డు కాపీ",
      "ఆధార్‌తో లింక్ అయిన బ్యాంక్ పాస్‌బుక్ కాపీ",
      "పాస్‌పోర్ట్ సైజు ఫోటో"
    ],
    howToApplyEn: [
      "New landholders can verify details through the Agriculture Extension Officer (AEO) or Rythu Vedika.",
      "Check payment disbursement status on the official Rythu Bharosa portal using Pattadar passbook number or Aadhaar.",
      "Ensure e-KYC and NPCI bank seeding are completed to prevent transaction failures."
    ],
    howToApplyTe: [
      "కొత్త పట్టాదారులు రైతు వేదిక లేదా వ్యవసాయ విస్తరణ అధికారి (AEO) వద్ద వివరాలు నమోదు చేసుకోవచ్చు.",
      "రైతు భరోసా అధికారిక పోర్టల్‌లో పట్టాదారు పాస్‌బుక్ లేదా ఆధార్ నంబర్‌తో స్టేటస్ చెక్ చేయవచ్చు.",
      "ట్రాన్సాక్షన్ విఫలం కాకుండా ఆధార్ NPCI బ్యాంక్ సీడింగ్ పూర్తయిందని నిర్ధారించుకోండి."
    ],
    officialPortalUrl: "https://rythubharosa.telangana.gov.in",
    portalName: "rythubharosa.telangana.gov.in",
    helpline: "1800-200-1001 / 040-23383520",
    iconType: "coins",
    isPopular: true,
  },
  {
    id: "ts-fine-rice-bonus",
    nameEn: "Telangana ₹500/Qtl Fine Rice MSP Bonus",
    nameTe: "సన్న బియ్యం బోనస్ - ₹500/క్వింటాల్",
    shortName: "Fine Rice Bonus",
    level: "state",
    category: "dbt",
    categoryLabelEn: "Crop Procurement Bonus",
    categoryLabelTe: "పంట కొనుగోలు బోనస్",
    badgeEn: "Telangana State Scheme",
    badgeTe: "తెలంగాణ రాష్ట్ర పథకం",
    financialBenefitEn: "₹500 / Quintal Bonus over Central MSP (Total ₹2,820 / Qtl)",
    financialBenefitTe: "కేంద్ర మద్దతు ధరకు అదనంగా క్వింటాలుకు ₹500 బోనస్ (మొత్తం ₹2,820 / క్వింటాల్)",
    summaryEn: "Government of Telangana provides an incentive bonus of ₹500 per quintal over the central MSP for 33 notified fine rice varieties (including RNR 15048 / Telangana Sona, BPT 5204).",
    summaryTe: "రైతులు పండించిన 33 రకాల సన్న వరి (తెలంగాణ సోనా RNR 15048, BPT 5204) కి క్వింటాలుకు ₹500 చొప్పున అదనపు ప్రోత్సాహక బోనస్ చెల్లింపు.",
    eligibilityEn: [
      "Farmers cultivating certified fine paddy varieties in Telangana",
      "Paddy must be sold at authorized Government PPC procurement centers (IKP / PACS / APMC)",
      "Grain moisture content must be ≤ 17% as per civil supplies procurement standards",
      "Pre-registration on Telangana Civil Supplies Procurement Portal is required"
    ],
    eligibilityTe: [
      "తెలంగాణలో ధృవీకరించబడిన సన్న వరి రకాలు సాగుచేసిన రైతులు",
      "ప్రభుత్వ ధాన్యం కొనుగోలు కేంద్రాలు (IKP / PACS / మార్కెట్ యార్డ్) లో విక్రయించాలి",
      "ధాన్యంలో తేమ శాతం 17% లేదా అంతకంటే తక్కువగా ఉండాలి",
      "సివిల్ సప్లైస్ కొనుగోలు పోర్టల్‌లో ముందస్తు నమోదు అవసరం"
    ],
    documentsRequiredEn: [
      "Dharani Patta Passbook / Crop Booking Slip",
      "Farmer Aadhaar Card",
      "Grain Delivery / Weighment Slip (తక్పట్టీ) from PPC Centre",
      "Bank Account details linked with Aadhaar"
    ],
    documentsRequiredTe: [
      "ధరణి పట్టాదారు పాస్‌బుక్ / పంట నమోదు రసీదు",
      "రైతు ఆధార్ కార్డు",
      "కొనుగోలు కేంద్రం నుంచి ఇచ్చిన తక్పట్టీ (Weighment Slip)",
      "ఆధార్ అనుసంధాన బ్యాంక్ ఖాతా వివరాలు"
    ],
    howToApplyEn: [
      "Ensure your paddy crop is booked by the local AEO during crop inspection.",
      "Bring dried paddy (≤ 17% moisture) to your nearest PACS/IKP procurement centre.",
      "Weighment slip is generated with biometric authentication; Central MSP and TS ₹500 bonus are credited via direct DBT."
    ],
    howToApplyTe: [
      "స్థానిక వ్యవసాయ అధికారి (AEO) పంట నమోదులో మీ సన్న వరి రకం నమోదైందని నిర్ధారించుకోండి.",
      "తేమ శాతం 17% లోపు ఉండేలా ఎండబోసి సమీప కొనుగోలు కేంద్రానికి తీసుకెళ్లండి.",
      "బయోమెట్రిక్ ద్వారా తక్పట్టీ జనరేట్ అయ్యాక, మద్దతు ధర మరియు ₹500 బోనస్ నేరుగా మీ బ్యాంక్ ఖాతాలో జమ అవుతాయి."
    ],
    officialPortalUrl: "https://epds.telangana.gov.in",
    portalName: "epds.telangana.gov.in",
    helpline: "1967 (Civil Supplies Toll-Free)",
    iconType: "wheat",
    isPopular: true,
  },
  {
    id: "ts-rythu-bima",
    nameEn: "Rythu Bima (Farmer Group Life Insurance)",
    nameTe: "రైతు బీమా (రైతుల సమూహ జీవిత బీమా)",
    shortName: "Rythu Bima",
    level: "state",
    category: "insurance",
    categoryLabelEn: "100% Free Life Insurance",
    categoryLabelTe: "ఉచిత జీవిత బీమా రక్షణ",
    badgeEn: "Telangana State Scheme",
    badgeTe: "తెలంగాణ రాష్ట్ర పథకం",
    financialBenefitEn: "₹5,00,000 (₹5 Lakhs) Insurance Cover Credited within 10 Days",
    financialBenefitTe: "రైతు మరణిస్తే కుటుంబ నామినీకి 10 రోజుల్లో ₹5,00,000 (₹5 లక్షల) ఆర్థిక సాయం",
    summaryEn: "100% state-funded life insurance scheme for registered landholder farmers. In the unfortunate event of a farmer's death due to any cause, ₹5 Lakh is credited to the nominee within 10 days.",
    summaryTe: "పట్టాదారు రైతులకు పూర్తి ఉచిత జీవిత బీమా. ఏ కారణం చేతనైనా రైతు మరణిస్తే 10 రోజుల్లో నామినీ ఖాతాలో ₹5 లక్షల పరిహారం జమచేయబడుతుంది. ప్రీమియం మొత్తం ప్రభుత్వమే చెల్లిస్తుంది.",
    eligibilityEn: [
      "Registered pattadar landholder farmers in Telangana",
      "Age between 18 and 59 years at the time of policy renewal (14th August every year)",
      "100% insurance premium is paid entirely by the Government of Telangana (free for farmers)",
      "Covers natural death as well as accidental death"
    ],
    eligibilityTe: [
      "తెలంగాణలో వ్యవసాయ భూమి పట్టా కలిగిన రైతులు",
      "వయస్సు 18 నుండి 59 సంవత్సరాల లోపు ఉండాలి (ప్రతి సంవత్సరం ఆగస్టు 14 నాటికి)",
      "బీమా ప్రీమియం మొత్తం ప్రభుత్వమే ఎల్‌ఐసీకి చెల్లిస్తుంది (రైతులకు పూర్తి ఉచితం)",
      "సహజ మరణం లేదా ప్రమాదవశాత్తు మరణించినా బీమా వర్తిస్తుంది"
    ],
    documentsRequiredEn: [
      "Pattadar Passbook / Dharani Title deed",
      "Deceased Farmer's Aadhaar Card & Death Certificate",
      "Nominee's Aadhaar Card & Bank Passbook Copy",
      "Family Member Certificate / VRO Enquiry Report"
    ],
    documentsRequiredTe: [
      "పట్టాదారు పాస్‌బుక్ / ధరణి టైటిల్ డీడ్",
      "మరణించిన రైతు ఆధార్ మరియు మరణ ధృవీకరణ పత్రం (Death Certificate)",
      "నామినీ ఆధార్ కార్డు మరియు బ్యాంక్ ఖాతా పాస్‌బుక్",
      "కుటుంబ సభ్యుల సర్టిఫికేట్ / స్థానిక VRO నివేదిక"
    ],
    howToApplyEn: [
      "Farmer enrolment is automatic upon getting a Pattadar Passbook before August cut-off.",
      "In case of demise, family submits death certificate and nominee details to the village AEO.",
      "Claim is processed online and LIC disburses ₹5,00,000 directly to the nominee's bank account."
    ],
    howToApplyTe: [
      "ధరణి పాస్‌బుక్ రాగానే స్థానిక AEO ద్వారా బీమా పోర్టల్‌లో నామినీ పేరు నమోదు చేయించుకోవాలి.",
      "రైతు మరణిస్తే గ్రామ వ్యవసాయ అధికారి (AEO) వద్ద క్లెయిమ్ దరఖాస్తు సమర్పించాలి.",
      "10 రోజుల్లో ఎల్.ఐ.సి (LIC) ద్వారా నామినీ బ్యాంక్ ఖాతాలో ₹5,00,000 నేరుగా జమ అవుతాయి."
    ],
    officialPortalUrl: "https://rythubima.telangana.gov.in",
    portalName: "rythubima.telangana.gov.in",
    helpline: "040-23383520 / 1800-200-1001",
    iconType: "shield",
    isPopular: true,
  },
  {
    id: "ts-free-power",
    nameEn: "24x7 Free Agriculture Electricity",
    nameTe: "24x7 ఉచిత వ్యవసాయ విద్యుత్",
    shortName: "24x7 Free Power",
    level: "state",
    category: "irrigation",
    categoryLabelEn: "Energy & Irrigation Subsidy",
    categoryLabelTe: "విద్యుత్ & సాగునీటి రాయితీ",
    badgeEn: "Telangana State Scheme",
    badgeTe: "తెలంగాణ రాష్ట్ర పథకం",
    financialBenefitEn: "100% Free Unmetered 3-Phase Power (Saves ~₹35,000/Yr/Pump)",
    financialBenefitTe: "100% ఉచిత 3-ఫేస్ నాణ్యమైన విద్యుత్ (ప్రతి బోరుకు ఏటా ~₹35,000 ఆదా)",
    summaryEn: "Round-the-clock free unmetered power supply to over 27.5 lakh agricultural pump sets across Telangana, powering borewells and lift irrigation without electricity bills.",
    summaryTe: "తెలంగాణలోని 27.5 లక్షల వ్యవసాయ పంపుసెట్లకు 24 గంటల పాటు నాణ్యమైన 3-ఫేస్ ఉచిత విద్యుత్ సరఫరా. కరెంట్ బిల్లుల భారం లేకుండా వ్యవసాయం.",
    eligibilityEn: [
      "All authorized agricultural borewells and open wells in Telangana",
      "Connected agricultural motors from 3 HP to 10+ HP",
      "Zero electricity charges billed to farmers"
    ],
    eligibilityTe: [
      "తెలంగాణలోని అన్ని అధీకృత వ్యవసాయ బోరుబావులు మరియు బావులు",
      "3 HP నుండి 10+ HP వరకు గల వ్యవసాయ మోటార్లు",
      "రైతులకు ఎటువంటి కరెంట్ బిల్లు చెల్లింపులు ఉండవు"
    ],
    documentsRequiredEn: [
      "Electricity Consumer Service Number (USCNO)",
      "Land ownership title or Patta passbook",
      "Borewell sanctioned service approval"
    ],
    documentsRequiredTe: [
      "విద్యుత్ సర్వీస్ కనెక్షన్ నంబర్ (USCNO)",
      "పట్టాదారు పాస్‌బుక్ లేదా భూమి హక్కు పత్రం",
      "విద్యుత్ శాఖ అనుమతి పత్రం"
    ],
    howToApplyEn: [
      "Apply for new agriculture connection at local TSSPDCL / TSNPDCL sub-station or via Meeseva.",
      "Submit survey number and borewell feasibility report.",
      "Transformer and line connection provided under agricultural free tariff category."
    ],
    howToApplyTe: [
      "కొత్త వ్యవసాయ కనెక్షన్ కోసం మీసేవ లేదా స్థానిక సబ్‌స్టేషన్ (TSSPDCL/TSNPDCL) లో దరఖాస్తు చేసుకోవాలి.",
      "సర్వే నంబర్ మరియు బోరుబావి వివరాలు సమర్పించాలి.",
      "రైతులకు ఉచిత కేటగిరీ కింద ట్రాన్స్‌ఫార్మర్ మరియు లైన్ కనెక్షన్ అందించబడుతుంది."
    ],
    officialPortalUrl: "https://tgspdcl.in",
    portalName: "tgspdcl.in / tgnpdcl.in",
    helpline: "1912 (Discom Power Emergency Toll-Free)",
    iconType: "zap",
  },
  {
    id: "ts-crop-loan-waiver",
    nameEn: "Rythu Runa Mafi (Crop Loan Waiver up to ₹2 Lakh)",
    nameTe: "రైతు రుణమాఫీ (రూ. 2 లక్షల వరకు పంట రుణాల మాఫీ)",
    shortName: "Rythu Runa Mafi",
    level: "state",
    category: "credit",
    categoryLabelEn: "Agricultural Debt Relief",
    categoryLabelTe: "వ్యవసాయ రుణ విముక్తి",
    badgeEn: "Telangana State Scheme",
    badgeTe: "తెలంగాణ రాష్ట్ర పథకం",
    financialBenefitEn: "Full Waiver of Short-Term Crop Loans up to ₹2,00,000 / Family",
    financialBenefitTe: "కుటుంబానికి గరిష్టంగా రూ. 2,00,000 వరకు పంట రుణాల పూర్తి మాఫీ",
    summaryEn: "Government of Telangana waives outstanding short-term agricultural crop loans up to ₹2 Lakh per farmer family disbursed/renewed up to December 9, 2023.",
    summaryTe: "డిసెంబర్ 9, 2023 నాటికి తీసుకున్న పంట రుణాలను కుటుంబానికి గరిష్టంగా రూ. 2 లక్షల వరకు ప్రభుత్వం పూర్తి రుణమాఫీ చేస్తోంది.",
    eligibilityEn: [
      "Telangana farmer families with short-term crop loans (Panta Ranalu)",
      "Disbursed or renewed between December 12, 2018 and December 9, 2023",
      "Covers Commercial Banks, Regional Rural Banks (APGVB, TGB), and DCCBs",
      "Ration card (FSC) used to verify family unit limit of ₹2,00,000"
    ],
    eligibilityTe: [
      "తెలంగాణలో స్వల్పకాలిక పంట రుణాలు తీసుకున్న రైతు కుటుంబాలు",
      "డిసెంబర్ 12, 2018 నుండి డిసెంబర్ 9, 2023 మధ్య పొందిన రుణాలు",
      "వాణిజ్య బ్యాంకులు, గ్రామీణ బ్యాంకులు (APGVB/TGB) మరియు సహకార బ్యాంకులు వర్తిస్తాయి",
      "కుటుంబ పరిమితి రూ. 2 లక్షల లెక్కింపునకు రేషన్ కార్డు ఆధారం"
    ],
    documentsRequiredEn: [
      "Bank Loan Account Passbook with IFSC",
      "Food Security Card (Ration Card)",
      "Farmer Aadhaar Card",
      "Dharani Patta Passbook"
    ],
    documentsRequiredTe: [
      "పంట రుణ ఖాతా పాస్‌బుక్",
      "ఆహార భద్రతా కార్డు (రేషన్ కార్డు)",
      "రైతు ఆధార్ కార్డు కాపీ",
      "ధరణి పట్టాదారు పాస్‌బుక్"
    ],
    howToApplyEn: [
      "Banks submit loan lists to the government portal automatically.",
      "Check your waiver eligibility and disbursement status at clw.telangana.gov.in.",
      "If ration card verification is pending, submit family details at the local Mandal Agriculture Office (MAO)."
    ],
    howToApplyTe: [
      "బ్యాంకులే నేరుగా రుణ ఖాతాల వివరాలను ప్రభుత్వ పోర్టల్‌కు అందిస్తాయి.",
      "clw.telangana.gov.in పోర్టల్‌లో మీ లోన్ ఖాతా నంబర్ లేదా ఆధార్‌తో స్టేటస్ తనిఖీ చేయవచ్చు.",
      "రేషన్ కార్డు సమస్యలు ఉంటే మండల వ్యవసాయ అధికారి (MAO) వద్ద దరఖాస్తు సమర్పించవచ్చు."
    ],
    officialPortalUrl: "https://clw.telangana.gov.in",
    portalName: "clw.telangana.gov.in",
    helpline: "040-23383520",
    iconType: "banknote",
    isPopular: true,
  },
  {
    id: "ts-micro-irrigation",
    nameEn: "TSMIP - Telangana Micro Irrigation Subsidy",
    nameTe: "బిందు & తుంపర సేద్యం రాయితీ (TSMIP)",
    shortName: "TSMIP Drip Subsidy",
    level: "state",
    category: "irrigation",
    categoryLabelEn: "Drip & Sprinkler Subsidy",
    categoryLabelTe: "డ్రిప్ & స్ప్రింక్లర్ రాయితీ",
    badgeEn: "Telangana State Scheme",
    badgeTe: "తెలంగాణ రాష్ట్ర పథకం",
    financialBenefitEn: "100% Subsidy for SC/ST, 90% for BC, 80% for Other Farmers",
    financialBenefitTe: "ఎస్సీ/ఎస్టీలకు 100%, బీసీలకు 90%, ఇతర రైతులకు 80% సబ్సిడీతో డ్రిప్ కిట్లు",
    summaryEn: "Subsidy for installing modern micro-irrigation systems (drip and sprinkler) to conserve groundwater, double water-use efficiency, and boost crop yields.",
    summaryTe: "బోరుబావులలో భూగర్భజలాల ఆదా మరియు అధిక దిగుబడుల కోసం బిందు, తుంపర సేద్య పరికరాల ఏర్పాటుకు భారీ ప్రభుత్వ రాయితీ.",
    eligibilityEn: [
      "Farmers holding agricultural land with assured irrigation water source (borewell/well)",
      "Landholding from 1.0 to 12.5 acres in Telangana",
      "100% subsidy for SC/ST small & marginal farmers (up to 5 acres)",
      "90% subsidy for BC farmers; 80% subsidy for others"
    ],
    eligibilityTe: [
      "సాగునీటి వనరు (బోరుబావి/బావి) కలిగిన తెలంగాణ రైతులు",
      "1 ఎకరం నుండి 12.5 ఎకరాల వరకు సాగుభూమి ఉండాలి",
      "ఎస్సీ/ఎస్టీ రైతులకు 5 ఎకరాల వరకు 100% ఉచిత సబ్సిడీ",
      "బీసీ రైతులకు 90%, ఇతరులకు 80% రాయితీ వర్తిస్తుంది"
    ],
    documentsRequiredEn: [
      "Dharani Patta Passbook",
      "Aadhaar Card",
      "Caste Certificate (for SC/ST/BC farmers)",
      "Electricity connection receipt / Borewell photo"
    ],
    documentsRequiredTe: [
      "ధరణి పట్టాదారు పాస్‌బుక్",
      "రైతు ఆధార్ కార్డు",
      "కుల ధృవీకరణ పత్రం (ఎస్సీ, ఎస్టీ, బీసీ రైతులకు)",
      "కరెంట్ బిల్లు రశీదు / బోరుబావి ఫోటో"
    ],
    howToApplyEn: [
      "Apply online through the TSMIP Horticulture portal or nearest Meeseva center.",
      "Horticulture Officer inspects the farm and measures the field layout.",
      "Authorized drip company installs pipes, drippers, filters, and venturi with 5-year warranty."
    ],
    howToApplyTe: [
      "మీసేవ లేదా ఉద్యానవన శాఖ TSMIP పోర్టల్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవాలి.",
      "హార్టికల్చర్ అధికారి క్షేత్రస్థాయి పరిశీలన జరిపి లేఅవుట్ సర్వే చేస్తారు.",
      "కంపెనీ ప్రతినిధులు 5 సంవత్సరాల వారంటీతో డ్రిప్ పరికరాలను అమర్చుతారు."
    ],
    officialPortalUrl: "https://horticulture.telangana.gov.in",
    portalName: "horticulture.telangana.gov.in",
    helpline: "040-23222210 / 1800-425-3500",
    iconType: "droplet",
  },

  // --- CENTRAL GOVERNMENT SCHEMES ---
  {
    id: "pm-kisan",
    nameEn: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    nameTe: "పి.ఎం. కిసాన్ సమ్మాన్ నిధి",
    shortName: "PM-KISAN",
    level: "central",
    category: "dbt",
    categoryLabelEn: "Central Income Support (DBT)",
    categoryLabelTe: "కేంద్ర ప్రభుత్వ ఆదాయ సాయం (DBT)",
    badgeEn: "Government of India",
    badgeTe: "భారత ప్రభుత్వం",
    financialBenefitEn: "₹6,000 / Year in 3 Equal Installments of ₹2,000 via Direct DBT",
    financialBenefitTe: "ఏటా ₹6,000 (ప్రతి 4 నెలలకు ₹2,000 చొప్పున 3 విడతల్లో నేరుగా ఖాతాలో)",
    summaryEn: "Flagship central government scheme providing income support of ₹6,000 per year in 3 four-monthly installments to all landholding farmer families across India.",
    summaryTe: "దేశంలోని ప్రతి రైతు కుటుంబానికి పెట్టుబడి మరియు కుటుంబ అవసరాల నిమిత్తం ఏడాదికి ₹6,000 ఆర్థిక సాయాన్ని 3 విడతల్లో అందించే కేంద్ర పథకం.",
    eligibilityEn: [
      "All landholding farmer families with cultivable land in India",
      "Land records must be seeded with Aadhaar and e-KYC completed",
      "Institutional landholders and income tax paying families are excluded",
      "Aadhaar-seeded bank account with active NPCI DBT bridge is mandatory"
    ],
    eligibilityTe: [
      "సాగుభూమి కలిగిన దేశంలోని చిన్న, సన్నకారు రైతు కుటుంబాలన్నీ",
      "ఆధార్ e-KYC మరియు భూమి రికార్డులు ధృవీకరించబడి ఉండాలి",
      "సంస్థాగత భూయజమానులు మరియు ఆదాయపు పన్ను చెల్లించేవారు మినహాయింపు",
      "ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతా (NPCI DBT) తప్పనిసరి"
    ],
    documentsRequiredEn: [
      "Aadhaar Card",
      "Land Ownership RoR / Patta Passbook",
      "Active Bank Account Passbook",
      "Mobile number linked to Aadhaar for OTP"
    ],
    documentsRequiredTe: [
      "రైతు ఆధార్ కార్డు",
      "పట్టాదారు పాస్‌బుక్ / భూమి యాజమాన్య రికార్డు",
      "బ్యాంక్ ఖాతా పాస్‌బుక్",
      "ఓటీపీ కొరకు ఆధార్‌తో అనుసంధానమైన మొబైల్ నంబర్"
    ],
    howToApplyEn: [
      "Visit pmkisan.gov.in and click on 'New Farmer Registration'.",
      "Complete face authentication or OTP-based e-KYC on PM-KISAN mobile app.",
      "Check installment release status under 'Know Your Status' on the portal."
    ],
    howToApplyTe: [
      "pmkisan.gov.in వెబ్‌సైట్‌లో 'New Farmer Registration' ద్వారా దరఖాస్తు చేసుకోవాలి.",
      "PM-KISAN యాప్‌లో ముఖ గుర్తింపు (Face Auth) లేదా OTP ద్వారా e-KYC పూర్తి చేయండి.",
      "పోర్టల్‌లోని 'Know Your Status' విభాగంలో విడతల జమ స్థితిని సులభంగా తెలుసుకోవచ్చు."
    ],
    officialPortalUrl: "https://pmkisan.gov.in",
    portalName: "pmkisan.gov.in",
    helpline: "155261 / 011-24300606 / 1800-115-526",
    iconType: "wallet",
    isPopular: true,
  },
  {
    id: "pmfby-insurance",
    nameEn: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    nameTe: "ప్రధాన మంత్రి ఫసల్ బీమా యోజన (పంట బీమా)",
    shortName: "PMFBY Crop Insurance",
    level: "central",
    category: "insurance",
    categoryLabelEn: "Comprehensive Crop Insurance",
    categoryLabelTe: "సమగ్ర పంట బీమా రక్షణ",
    badgeEn: "Government of India",
    badgeTe: "భారత ప్రభుత్వం",
    financialBenefitEn: "Comprehensive Crop Damage Cover at Low 1.5% - 2% Premium",
    financialBenefitTe: "అత్యల్ప ప్రీమియంతో (1.5% - 2%) ప్రకృతి విపత్తుల నుండి పూర్తి పంట రక్షణ",
    summaryEn: "Comprehensive risk coverage against yield loss from natural calamities, droughts, floods, hailstorms, pest attacks, and post-harvest localized losses.",
    summaryTe: "వర్షాభావం, అతివృష్టి, తెగుళ్ళు మరియు అకాల వర్షాల వల్ల కలిగే పంట నష్టానికి పూర్తి పరిహారం అందించే జాతీయ పంటల బీమా పథకం.",
    eligibilityEn: [
      "All farmers growing notified crops (Paddy, Cotton, Maize, Chilli, Redgram)",
      "Covers both loanee farmers and non-loanee sharecroppers / tenant farmers",
      "Low farmer premium: 2% for Kharif food crops, 1.5% for Rabi, 5% for commercial/horticultural crops",
      "Balance 95%+ premium is shared between Central and State Governments"
    ],
    eligibilityTe: [
      "నోటిఫై చేయబడిన పంటలు (వరి, ప్రత్తి, మొక్కజొన్న, మిర్చి) సాగుచేసే రైతులందరూ",
      "బ్యాంకు రుణాలు తీసుకున్నవారు మరియు రుణం లేని కౌలు రైతులూ అర్హులే",
      "అత్యల్ప రైతు ప్రీమియం: ఖరీఫ్‌కు 2%, రబీకి 1.5%, వాణిజ్య పంటలకు 5%",
      "మిగిలిన 95% పైగా ప్రీమియాన్ని కేంద్ర, రాష్ట్ర ప్రభుత్వాలే భరిస్తాయి"
    ],
    documentsRequiredEn: [
      "Sowing Certificate issued by Village Agricultural Officer / VRO",
      "Dharani Patta Passbook / Land Tenancy Deed",
      "Aadhaar Card copy",
      "Bank Account Passbook"
    ],
    documentsRequiredTe: [
      "వ్యవసాయ అధికారి లేదా VRO ఇచ్చిన విత్తన సాగు ధృవీకరణ పత్రం",
      "ధరణి పాస్‌బుక్ / కౌలు ఒప్పంద పత్రం",
      "రైతు ఆధార్ కార్డు కాపీ",
      "బ్యాంక్ ఖాతా పాస్‌బుక్ కాపీ"
    ],
    howToApplyEn: [
      "Enroll through local bank branch, Common Service Centre (CSC), or pmfby.gov.in before the seasonal cut-off date.",
      "In case of localized storm/inundation damage, report within 72 hours on Crop Insurance App or toll-free helpline.",
      "Surveyors conduct satellite & field assessment; claims are credited directly to bank account."
    ],
    howToApplyTe: [
      "సీజన్ గడువు తేదీలోపు మీ సమీప బ్యాంక్, సి.ఎస్.సి (CSC) కేంద్రం లేదా pmfby.gov.in ద్వారా నమోదు చేసుకోవాలి.",
      "విపత్తు వల్ల పంట దెబ్బతింటే 72 గంటల్లోపు 'క్రాప్ ఇన్సూరెన్స్ యాప్' లేదా టోల్ ఫ్రీ నంబర్‌కు ఫిర్యాదు చేయాలి.",
      "శాటిలైట్ మరియు క్షేత్రస్థాయి పరిశీలన తర్వాత పరిహారం నేరుగా మీ బ్యాంక్ ఖాతాలో జమ అవుతుంది."
    ],
    officialPortalUrl: "https://pmfby.gov.in",
    portalName: "pmfby.gov.in",
    helpline: "1800-180-1551 (Kisan Call Centre) / 14447",
    iconType: "shield-alert",
    isPopular: true,
  },
  {
    id: "kisan-credit-card",
    nameEn: "Kisan Credit Card (KCC) Scheme",
    nameTe: "కిసాన్ క్రెడిట్ కార్డు (KCC)",
    shortName: "Kisan Credit Card",
    level: "central",
    category: "credit",
    categoryLabelEn: "Subsidized Crop Credit",
    categoryLabelTe: "రాయితీ పంట రుణాలు (4% వడ్డీ)",
    badgeEn: "Government of India",
    badgeTe: "భారత ప్రభుత్వం",
    financialBenefitEn: "Crop Credit up to ₹3,00,000 at 4% Interest (Collateral-Free to ₹1.6L)",
    financialBenefitTe: "రూ. 3 లక్షల వరకు కేవలం 4% వార్షిక వడ్డీకే పంట రుణం (రూ. 1.6 లక్షల వరకు పూచీకత్తు అవసరం లేదు)",
    summaryEn: "Revolving crop credit card providing timely and adequate credit to farmers for crop cultivation, input purchase, and allied animal husbandry at a subsidized 4% net interest rate.",
    summaryTe: "రైతులకు సాగు ఖర్చులు, ఎరువులు, విత్తనాలు మరియు పాడిపరిశ్రమ కోసం వార్షిక 4% అత్యల్ప రాయితీ వడ్డీకే సులభంగా రుణాలు అందించే కిసాన్ క్రెడిట్ కార్డు.",
    eligibilityEn: [
      "All farmers, individual landholders, joint borrowers, tenant farmers, and SHGs",
      "Animal husbandry, dairy, poultry, and fisheries farmers also eligible",
      "7% basic interest minus 3% prompt repayment incentive = 4% effective interest rate",
      "ATM-enabled RuPay card for cash withdrawals at village ATMs"
    ],
    eligibilityTe: [
      "వ్యవసాయదారులు, ఉమ్మడి భూయజమానులు, కౌలు రైతులు మరియు స్వయం సహాయక సంఘాలు",
      "పాడి పశువులు, గొర్రెలు, మేకల పెంపకం మరియు మత్స్యకారులూ అర్హులే",
      "సకాలంలో రుణం చెల్లిస్తే 3% ప్రోత్సాహకంతో కేవలం 4% వడ్డీ మాత్రమే పడుతుంది",
      "గ్రామీణ ఎటిఎమ్‌లలో సులభంగా నగదు డ్రా చేసుకునే రూపే (RuPay) కార్డు సదుపాయం"
    ],
    documentsRequiredEn: [
      "KCC Application Form (available at any bank)",
      "Land Records (Pattadar Passbook / RoR 1B)",
      "Identity Proof (Aadhaar / Voter ID)",
      "Recent passport-size photographs"
    ],
    documentsRequiredTe: [
      "బ్యాంకులో లభించే KCC దరఖాస్తు ఫారమ్",
      "భూమి యాజమాన్య పత్రాలు (పట్టాదారు పాస్‌బుక్ / 1B)",
      "ఆధార్ కార్డు మరియు ఓటర్ ఐడీ",
      "ఇటీవలి పాస్‌పోర్ట్ సైజు ఫోటోలు"
    ],
    howToApplyEn: [
      "Visit your local Commercial Bank, APGVB, TGB, or Cooperative Bank branch.",
      "Submit one-page simplified KCC form with Dharani passbook and Aadhaar.",
      "Bank issues RuPay KCC card with limit within 14 working days."
    ],
    howToApplyTe: [
      "మీ సమీప గ్రామీణ బ్యాంక్ (APGVB/TGB), వాణిజ్య బ్యాంక్ లేదా సొసైటీ శాఖను సంప్రదించండి.",
      "సరళీకృత దరఖాస్తుతో పాటు పట్టా పాస్‌బుక్, ఆధార్ కార్డు సమర్పించండి.",
      "14 పని దినాల్లో బ్యాంకు మీకు RuPay కిసాన్ క్రెడిట్ కార్డును మంజూరు చేస్తుంది."
    ],
    officialPortalUrl: "https://myscheme.gov.in/schemes/kcc",
    portalName: "myscheme.gov.in/schemes/kcc",
    helpline: "1800-11-2211 / 1800-180-1111",
    iconType: "credit-card",
  },
  {
    id: "pm-kusum-solar",
    nameEn: "PM-KUSUM (Solar Agriculture Pumps Scheme)",
    nameTe: "పి.ఎం. కుసుమ్ (సౌర వ్యవసాయ పంపుసెట్ల పథకం)",
    shortName: "PM-KUSUM Solar",
    level: "central",
    category: "irrigation",
    categoryLabelEn: "Solar Pumps & Clean Energy",
    categoryLabelTe: "సౌర పంపులు & హరిత శక్తి",
    badgeEn: "Government of India",
    badgeTe: "భారత ప్రభుత్వం",
    financialBenefitEn: "60% Subsidy (30% Central + 30% State) on 3 to 10 HP Solar Pumps",
    financialBenefitTe: "3 HP నుండి 10 HP సౌర పంపుసెట్లపై 60% ప్రభుత్వ రాయితీ (30% కేంద్రం + 30% రాష్ట్రం)",
    summaryEn: "De-dieselize agriculture by installing off-grid solar water pumps and solarizing existing grid pumps. Farmers can irrigate daytime without power cuts and sell excess solar power.",
    summaryTe: "కరెంట్ కోతలతో సంబంధం లేకుండా పగటిపూట నిరంతరం పంటలకు నీరందించేందుకు సౌర విద్యుత్ పంపుసెట్లకు 60% సబ్సిడీ. మిగులు విద్యుత్తును గ్రిడ్‌కు అమ్మి అదనపు ఆదాయం పొందవచ్చు.",
    eligibilityEn: [
      "Individual farmers with agricultural land and borewell/well",
      "Water User Associations (WUAs) and Farmer Producer Organizations (FPOs)",
      "Farmers without grid electricity connection given priority",
      "Solarizes 3 HP, 5 HP, 7.5 HP, and 10 HP agricultural submersible motors"
    ],
    eligibilityTe: [
      "సాగుభూమి మరియు బోరుబావి కలిగిన వ్యక్తిగత రైతులు",
      "రైతు ఉత్పత్తిదారుల సంఘాలు (FPOs) మరియు సాగునీటి సంఘాలు",
      "విద్యుత్ కనెక్షన్ లేని మారుమూల వ్యవసాయ భూములకు మొదటి ప్రాధాన్యత",
      "3 HP, 5 HP, 7.5 HP మరియు 10 HP పంపుసెట్లకు వర్తిస్తుంది"
    ],
    documentsRequiredEn: [
      "Dharani Patta Passbook / Land Record",
      "Borewell yield certificate / Water source proof",
      "Aadhaar Card",
      "Bank Account details"
    ],
    documentsRequiredTe: [
      "ధరణి పట్టాదారు పాస్‌బుక్ కాపీ",
      "బోరుబావి నీటి లభ్యత ధృవీకరణ పత్రం",
      "రైతు ఆధార్ కార్డు",
      "బ్యాంక్ ఖాతా వివరాలు"
    ],
    howToApplyEn: [
      "Register online at REDCO Telangana / pmkusum.mnre.gov.in portal.",
      "Pay 10% farmer share; remaining 60% is paid by Central and State Governments (30% bank loan optional).",
      "Empanelled solar EPC installs solar panels, VFD inverter, and pump set with 5-year comprehensive maintenance."
    ],
    howToApplyTe: [
      "తెలంగాణ రెడ్కో (TSREDCO) లేదా pmkusum.mnre.gov.in పోర్టల్‌లో నమోదు చేసుకోండి.",
      "రైతు వాటాగా 10% చెల్లిస్తే, మిగతా 60% సబ్సిడీ వస్తుంది (మిగిలిన 30% బ్యాంకు రుణం లభిస్తుంది).",
      "5 సంవత్సరాల ఉచిత నిర్వహణతో సోలార్ ప్యానెళ్ళు, ఇన్వర్టర్ మరియు మోటార్ అమర్చబడుతుంది."
    ],
    officialPortalUrl: "https://pmkusum.mnre.gov.in",
    portalName: "pmkusum.mnre.gov.in",
    helpline: "1800-180-3333",
    iconType: "sun",
  },
  {
    id: "smam-mechanization",
    nameEn: "Sub-Mission on Agricultural Mechanization (SMAM)",
    nameTe: "వ్యవసాయ యాంత్రీకరణ సబ్-మిషన్ (SMAM)",
    shortName: "SMAM Machinery",
    level: "central",
    category: "machinery",
    categoryLabelEn: "Machinery & Equipment Grant",
    categoryLabelTe: "వ్యవసాయ యంత్రాల రాయితీ",
    badgeEn: "Government of India",
    badgeTe: "భారత ప్రభుత్వం",
    financialBenefitEn: "40% to 50% Subsidy on Tractors, Rotavators, Harvesters & Drones",
    financialBenefitTe: "ట్రాక్టర్లు, రోటవేటర్లు, వరి నాటు యంత్రాలు, డ్రోన్లపై 40% నుండి 50% సబ్సిడీ",
    summaryEn: "Promotes farm mechanization to overcome farm labor shortages, lower production costs, and accelerate harvesting through subsidized tractors, implements, and agri-drones.",
    summaryTe: "కూలీల కొరతను అధిగమించి వ్యవసాయ ఖర్చులను తగ్గించడానికి ట్రాక్టర్లు, వరి కోత యంత్రాలు, పవర్ టిల్లర్లు మరియు మందు పిచికారీ చేసే డ్రోన్లకు భారీ సబ్సిడీ.",
    eligibilityEn: [
      "All registered farmers in India",
      "Women farmers, SC/ST, and small/marginal farmers receive up to 50% subsidy",
      "Other category farmers receive 40% subsidy on agricultural implements",
      "Custom Hiring Centres (CHCs) get up to 80% project assistance"
    ],
    eligibilityTe: [
      "నమోదైన వ్యవసాయదారులందరూ అర్హులు",
      "మహిళా రైతులు, ఎస్సీ, ఎస్టీ మరియు చిన్న రైతులకు 50% వరకు రాయితీ",
      "ఇతర సాధారణ రైతులకు పరికరాలపై 40% రాయితీ లభిస్తుంది",
      "గ్రామాల్లో యంత్రాల అద్దె కేంద్రాల (CHC) ఏర్పాటుకు 80% వరకు ప్రాజెక్ట్ సాయం"
    ],
    documentsRequiredEn: [
      "Farmer Registration ID / Aadhaar",
      "Land Record (Patta Passbook)",
      "Quotation of machinery from authorized agricultural dealer",
      "Bank Account details & Caste certificate (if applicable)"
    ],
    documentsRequiredTe: [
      "రైతు నమోదు ఐడీ / ఆధార్ కార్డు",
      "భూమి పట్టాదారు పాస్‌బుక్",
      "అధికారిక డీలర్ నుండి తీసుకున్న యంత్రం కొటేషన్",
      "బ్యాంక్ ఖాతా వివరాలు మరియు కుల ధృవీకరణ పత్రం"
    ],
    howToApplyEn: [
      "Register on agrimachinery.nic.in and select preferred equipment and manufacturer.",
      "District Agricultural Officer scrutinizes and issues administrative sanction.",
      "Purchase equipment from dealer and subsidy amount is directly released into farmer's bank account."
    ],
    howToApplyTe: [
      "agrimachinery.nic.in పోర్టల్‌లో నమోదు చేసుకుని కావలసిన పరికరాన్ని ఎంచుకోవాలి.",
      "జిల్లా వ్యవసాయ అధికారి పరిశీలించి పరిపాలనా అనుమతి (Sanction) జారీ చేస్తారు.",
      "డీలర్ వద్ద పరికరం కొనుగోలు చేసిన తర్వాత సబ్సిడీ నగదు నేరుగా మీ ఖాతాలో జమవుతుంది."
    ],
    officialPortalUrl: "https://agrimachinery.nic.in",
    portalName: "agrimachinery.nic.in",
    helpline: "011-23382937 / 1800-180-1551",
    iconType: "tractor",
  },
  {
    id: "soil-health-card",
    nameEn: "Soil Health Card Scheme",
    nameTe: "సాయిల్ హెల్త్ కార్డు పథకం (మృత్తిక ఆరోగ్య కార్డు)",
    shortName: "Soil Health Card",
    level: "central",
    category: "soil",
    categoryLabelEn: "Free Soil Testing & Advisory",
    categoryLabelTe: "ఉచిత నేల పరీక్ష & సిఫార్సులు",
    badgeEn: "Government of India",
    badgeTe: "భారత ప్రభుత్వం",
    financialBenefitEn: "100% Free Soil Nutrient Testing of 12 Parameters every 2 Years",
    financialBenefitTe: "ప్రతి 2 సంవత్సరాలకు 12 రకాల పోషకాల ఉచిత నేల పరీక్ష మరియు ఎరువుల మోతాదు కార్డు",
    summaryEn: "Soil testing card issued to every farmer assessing 12 soil chemical and physical parameters with crop-wise customized fertilizer dosage recommendations, saving ₹3,000-₹5,000/acre.",
    summaryTe: "మీ పొలంలోని నేల నమూనాను సేకరించి ఉచితంగా పరీక్షించి 12 పోషకాల వివరాలతో కూడిన కార్డు అందిస్తారు. పంటకు ఎంత యూరియా, డీఏపీ వాడాలో ఖచ్చితంగా తెలుస్తుంది.",
    eligibilityEn: [
      "All farmers cultivating agricultural lands across India",
      "Tests 12 parameters: N, P, K, Sulphur, Zinc, Fe, Copper, Manganese, Boron, pH, EC, and Organic Carbon",
      "Helps prevent soil degradation and over-application of synthetic fertilizers"
    ],
    eligibilityTe: [
      "వ్యవసాయ భూములను సాగుచేస్తున్న రైతులందరూ",
      "నత్రజని, భాస్వరం, పొటాష్, జింక్, ఐరన్, పి.హెచ్ (pH) సహా 12 పోషకాల విశ్లేషణ",
      "భూసారం తగ్గకుండా కాపాడటంతో పాటు అనవసర రసాయనిక ఎరువుల ఖర్చును తగ్గిస్తుంది"
    ],
    documentsRequiredEn: [
      "Representative field soil sample collected from agricultural plot",
      "Farmer Aadhaar Card",
      "Survey number & village location details"
    ],
    documentsRequiredTe: [
      "పొలం నుండి సేకరించిన నేల నమూనా (Soil Sample)",
      "రైతు ఆధార్ కార్డు కాపీ",
      "భూమి సర్వే నంబర్ మరియు గ్రామ వివరాలు"
    ],
    howToApplyEn: [
      "Local Agriculture Extension Officer (AEO) or Rythu Vedika collects soil samples before sowing.",
      "Soil sample is analyzed at district agricultural testing laboratory.",
      "Soil Health Card is delivered to farmer or downloaded from soilhealth.dac.gov.in."
    ],
    howToApplyTe: [
      "విత్తనాలు వేసే ముందు స్థానిక వ్యవసాయ విస్తరణ అధికారి (AEO) పొలం నుండి మట్టి నమూనా సేకరిస్తారు.",
      "జిల్లా సాయిల్ టెస్టింగ్ ల్యాబ్‌లో ఉచితంగా పరీక్ష చేస్తారు.",
      "పరీక్షా ఫలితాల కార్డును రైతు వేదికలో అందజేస్తారు లేదా ఆన్‌లైన్‌లో డౌన్‌లోడ్ చేసుకోవచ్చు."
    ],
    officialPortalUrl: "https://soilhealth.dac.gov.in",
    portalName: "soilhealth.dac.gov.in",
    helpline: "011-23381012 / 1800-180-1551",
    iconType: "flask",
  },
];

