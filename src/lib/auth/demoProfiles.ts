export interface DemoFarmer {
  id: string;
  name: string;
  nameDisplay: string;
  email: string;
  phone: string;
  languageBadge: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  primaryCrop: string;
  crops: string[];
  areaAcre: number;
  soilType: string;
  irrigationType: string;
  sowingDate: string;
}

export const QUICK_DEMO_FARMERS: DemoFarmer[] = [
  {
    id: "ram-sharma",
    name: "राम शर्मा",
    nameDisplay: "राम शर्मा (Maharashtra Farmer)",
    email: "ram@farmer.com",
    phone: "+91 98220 12345",
    languageBadge: "Hindi",
    state: "Maharashtra",
    district: "Nashik",
    mandal: "Niphad",
    village: "Pimpalgaon",
    primaryCrop: "Rice",
    crops: ["Rice", "Wheat"],
    areaAcre: 5.0,
    soilType: "Black Cotton Soil (రెగూర్ నేలలు)",
    irrigationType: "Drip Irrigation & Canal",
    sowingDate: "2026-06-25",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    nameDisplay: "Priya Nair (Kerala Farmer)",
    email: "priya@farmer.com",
    phone: "+91 94470 54321",
    languageBadge: "Malayalam",
    state: "Kerala",
    district: "Palakkad",
    mandal: "Chittur",
    village: "Kozhinjampara",
    primaryCrop: "Coconut",
    crops: ["Coconut", "Pepper"],
    areaAcre: 3.5,
    soilType: "Laterite Soil",
    irrigationType: "Micro-Sprinkler",
    sowingDate: "2026-05-15",
  },
  {
    id: "md-ashfaq",
    name: "Md Ashfaq",
    nameDisplay: "Md Ashfaq (Telangana Farmer)",
    email: "ashfaq@smartfarm.telangana",
    phone: "+91 98490 87654",
    languageBadge: "Telugu / English",
    state: "Telangana",
    district: "Jagtial",
    mandal: "Dharmapuri",
    village: "Mallapur",
    primaryCrop: "Paddy (RNR 15048 / Telangana Sona)",
    crops: ["Paddy", "Chilli"],
    areaAcre: 4.5,
    soilType: "Red Sandy Loam (చల్కా నేలలు)",
    irrigationType: "3 HP Solar Drip & Borewell",
    sowingDate: "2026-07-15",
  },
  {
    id: "mallesham-goud",
    name: "Mallesham Goud",
    nameDisplay: "మల్లేశం గౌడ్ (Jagtial Farmer)",
    email: "mallesham@rythu.ts.gov",
    phone: "+91 98480 12345",
    languageBadge: "Telugu",
    state: "Telangana",
    district: "Jagtial",
    mandal: "Dharmapuri",
    village: "Mallapur",
    primaryCrop: "Paddy (RNR 15048 / Telangana Sona)",
    crops: ["Telangana Sona", "Maize"],
    areaAcre: 4.5,
    soilType: "Red Sandy Loam (చల్కా నేలలు)",
    irrigationType: "3 HP Submersible Borewell",
    sowingDate: "2026-07-15",
  },
  {
    id: "ravi-kumar",
    name: "Ravi Kumar",
    nameDisplay: "Ravi Kumar (Warangal Farmer)",
    email: "ravi.kumar@rythu.ts.gov",
    phone: "+91 94401 23456",
    languageBadge: "Telugu",
    state: "Telangana",
    district: "Warangal",
    mandal: "Enmamula",
    village: "Geesugonda",
    primaryCrop: "Cotton (Bunny / Medium-Long Staple)",
    crops: ["Cotton", "Redgram"],
    areaAcre: 6.0,
    soilType: "Medium Black Soil (నల్లరేగడి)",
    irrigationType: "Rainfed & Borewell Backup",
    sowingDate: "2026-06-20",
  },
];
