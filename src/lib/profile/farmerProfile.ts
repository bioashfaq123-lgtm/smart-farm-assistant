/**
 * Telangana Farmer Profile Store & District Geographic Coordinate Registry
 * Allows farmers to manage their own real field profile or use the validated sample.
 */

export interface FarmerProfile {
  name: string;
  nameTe?: string;
  district: string;
  districtTe?: string;
  mandal: string;
  mandalTe?: string;
  village: string;
  villageTe?: string;
  areaAcre: number;
  areaGunta: number;
  primaryCrop: string;
  primaryCropTe?: string;
  soilType: string;
  soilTypeTe?: string;
  irrigationType: string;
  irrigationTypeTe?: string;
  sowingDate: string;
  phone?: string;
  isCustom: boolean;
}

export const TELANGANA_DISTRICTS: Record<
  string,
  { lat: number; lon: number; nameTe: string; defaultMandal: string; defaultVillage: string }
> = {
  Jagtial: {
    lat: 18.7963,
    lon: 78.9125,
    nameTe: "జగిత్యాల",
    defaultMandal: "Dharmapuri",
    defaultVillage: "Mallapur",
  },
  Warangal: {
    lat: 17.9689,
    lon: 79.5941,
    nameTe: "వరంగల్",
    defaultMandal: "Enmamula",
    defaultVillage: "Geesugonda",
  },
  Karimnagar: {
    lat: 18.4386,
    lon: 79.1288,
    nameTe: "కరీంనగర్",
    defaultMandal: "Manakondur",
    defaultVillage: "Choppadandi",
  },
  Nizamabad: {
    lat: 18.6725,
    lon: 78.0941,
    nameTe: "నిజామాబాద్",
    defaultMandal: "Armoor",
    defaultVillage: "Balkonda",
  },
  Khammam: {
    lat: 17.2473,
    lon: 80.1514,
    nameTe: "ఖమ్మం",
    defaultMandal: "Khammam Rural",
    defaultVillage: "Nelakondapalli",
  },
  Nalgonda: {
    lat: 17.0575,
    lon: 79.2684,
    nameTe: "నల్గొండ",
    defaultMandal: "Miryalaguda",
    defaultVillage: "Narketpally",
  },
  Suryapet: {
    lat: 17.1424,
    lon: 79.6239,
    nameTe: "సూర్యాపేట",
    defaultMandal: "Kodad",
    defaultVillage: "Huzurnagar",
  },
  Mahabubnagar: {
    lat: 16.7488,
    lon: 77.9856,
    nameTe: "మహబూబ్‌నగర్",
    defaultMandal: "Jadcherla",
    defaultVillage: "Bhoothpur",
  },
  Sangareddy: {
    lat: 17.619,
    lon: 78.0811,
    nameTe: "సంగారెడ్డి",
    defaultMandal: "Zaheerabad",
    defaultVillage: "Kandi",
  },
  Siddipet: {
    lat: 18.1018,
    lon: 78.852,
    nameTe: "సిద్దిపేట",
    defaultMandal: "Gajwel",
    defaultVillage: "Dubbak",
  },
  Medak: {
    lat: 18.0454,
    lon: 78.2612,
    nameTe: "మెదక్",
    defaultMandal: "Narsapur",
    defaultVillage: "Haveli Ghanpur",
  },
  Adilabad: {
    lat: 19.6641,
    lon: 78.532,
    nameTe: "ఆదిలాబాద్",
    defaultMandal: "Bazarhathnoor",
    defaultVillage: "Gudihatnur",
  },
  Mancherial: {
    lat: 18.8679,
    lon: 79.4639,
    nameTe: "మంచిర్యాల",
    defaultMandal: "Chennur",
    defaultVillage: "Luxettipet",
  },
  Nirmal: {
    lat: 19.0964,
    lon: 78.3434,
    nameTe: "నిర్మల్",
    defaultMandal: "Khanapur",
    defaultVillage: "Mudhole",
  },
  Kamareddy: {
    lat: 18.3229,
    lon: 78.3379,
    nameTe: "కామారెడ్డి",
    defaultMandal: "Banswada",
    defaultVillage: "Yellareddy",
  },
  Peddapalli: {
    lat: 18.616,
    lon: 79.3787,
    nameTe: "పెద్దపల్లి",
    defaultMandal: "Sulthanabad",
    defaultVillage: "Ramagundam",
  },
  "Rajanna Sircilla": {
    lat: 18.3888,
    lon: 78.8041,
    nameTe: "రాజన్న సిరిసిల్ల",
    defaultMandal: "Vemulawada",
    defaultVillage: "Chandurthi",
  },
  "Bhadradri Kothagudem": {
    lat: 17.5554,
    lon: 80.6179,
    nameTe: "భద్రాద్రి కొత్తగూడెం",
    defaultMandal: "Bhadrachalam",
    defaultVillage: "Palwancha",
  },
  Mahabubabad: {
    lat: 17.5989,
    lon: 79.9984,
    nameTe: "మహబూబాబాద్",
    defaultMandal: "Kesamudram",
    defaultVillage: "Dornakal",
  },
  Jangaon: {
    lat: 17.7226,
    lon: 79.1558,
    nameTe: "జనగామ",
    defaultMandal: "Palakurthi",
    defaultVillage: "Bachannapet",
  },
  "Jayashankar Bhupalpally": {
    lat: 18.4312,
    lon: 79.8662,
    nameTe: "జయశంకర్ భూపాలపల్లి",
    defaultMandal: "Chityal",
    defaultVillage: "Mogullapally",
  },
  Mulugu: {
    lat: 18.1924,
    lon: 79.9408,
    nameTe: "ములుగు",
    defaultMandal: "Venkatapur",
    defaultVillage: "Govindaraopet",
  },
  Wanaparthy: {
    lat: 16.3624,
    lon: 78.0631,
    nameTe: "వనపర్తి",
    defaultMandal: "Pebbair",
    defaultVillage: "Gopalpeta",
  },
  Nagarkurnool: {
    lat: 16.4854,
    lon: 78.3142,
    nameTe: "నాగర్‌కర్నూల్",
    defaultMandal: "Achampet",
    defaultVillage: "Kalwakurthy",
  },
  "Jogulamba Gadwal": {
    lat: 16.2324,
    lon: 77.8078,
    nameTe: "జోగులాంబ గద్వాల",
    defaultMandal: "Alampur",
    defaultVillage: "Ieeja",
  },
  Narayanpet: {
    lat: 16.7356,
    lon: 77.4984,
    nameTe: "నారాయణపేట",
    defaultMandal: "Makthal",
    defaultVillage: "Marikal",
  },
  Vikarabad: {
    lat: 17.3364,
    lon: 77.9048,
    nameTe: "వికారాబాద్",
    defaultMandal: "Tandur",
    defaultVillage: "Pargi",
  },
  "Medchal-Malkajgiri": {
    lat: 17.6297,
    lon: 78.4814,
    nameTe: "మేడ్చల్-మల్కాజిగిరి",
    defaultMandal: "Ghatkesar",
    defaultVillage: "Medchal",
  },
  Rangareddy: {
    lat: 17.2023,
    lon: 78.5372,
    nameTe: "రంగారెడ్డి",
    defaultMandal: "Chevella",
    defaultVillage: "Shadnagar",
  },
  Hyderabad: {
    lat: 17.385,
    lon: 78.4867,
    nameTe: "హైదరాబాద్",
    defaultMandal: "Amberpet",
    defaultVillage: "Charminar",
  },
  "Yadadri Bhuvanagiri": {
    lat: 17.5113,
    lon: 78.8856,
    nameTe: "యాదాద్రి భువనగిరి",
    defaultMandal: "Bhongir",
    defaultVillage: "Alair",
  },
  "Kumuram Bheem Asifabad": {
    lat: 19.3624,
    lon: 79.2882,
    nameTe: "కొమరంభీమ్ ఆసిఫాబాద్",
    defaultMandal: "Kagaznagar",
    defaultVillage: "Sirpur",
  },
  Hanumakonda: {
    lat: 18.0138,
    lon: 79.5539,
    nameTe: "హనుమకొండ",
    defaultMandal: "Hasanparthy",
    defaultVillage: "Parkal",
  },
};

export const DEFAULT_SAMPLE_FARMER: FarmerProfile = {
  name: "Mallesham Goud",
  nameTe: "మల్లేశం గౌడ్",
  district: "Jagtial",
  districtTe: "జగిత్యాల",
  mandal: "Dharmapuri",
  mandalTe: "ధర్మపురి",
  village: "Mallapur",
  villageTe: "మల్లాపూర్",
  areaAcre: 4.5,
  areaGunta: 0,
  primaryCrop: "Paddy (RNR 15048 / Telangana Sona)",
  primaryCropTe: "వరి (RNR 15048 / తెలంగాణ సోనా)",
  soilType: "Red Sandy Loam (చల్కా నేలలు)",
  soilTypeTe: "ఎర్ర చల్కా నేలలు",
  irrigationType: "3 HP Submersible Borewell",
  irrigationTypeTe: "3 హెచ్.పి సబ్మర్సిబుల్ బోరుబావి",
  sowingDate: "2026-07-15",
  phone: "+91 98480 12345",
  isCustom: false,
};

const STORAGE_KEY = "smartfarm_farmer_profile";

export function getStoredFarmerProfile(): FarmerProfile {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_FARMER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.district) {
        return { ...DEFAULT_SAMPLE_FARMER, ...parsed };
      }
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SAMPLE_FARMER;
}

export function saveFarmerProfile(profile: Partial<FarmerProfile>): FarmerProfile {
  const current = getStoredFarmerProfile();
  const updated: FarmerProfile = {
    ...current,
    ...profile,
    isCustom: true,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("smartfarm_profile_updated"));
    } catch (e) {
      // storage error
    }
  }
  return updated;
}

export function resetToSampleProfile(): FarmerProfile {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("smartfarm_profile_updated"));
    } catch (e) {
      // storage error
    }
  }
  return DEFAULT_SAMPLE_FARMER;
}
