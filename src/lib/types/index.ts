/**
 * TypeScript definitions for Smart Farm Assistant
 */

export type Language = "en" | "te";

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  primaryCrop: string;
  cropVariety: string;
  areaAcre: number;
  areaGunta: number;
  soilType: string;
  irrigationType: "Drip" | "Sprinkler" | "Borewell Flood" | "Canal Furrow";
  sowingDate: string;
  daysSinceSowing: number;
  organicCertified: boolean;
  smartSensorsInstalled: boolean;
}

export interface WeatherOverview {
  location: string;
  tempCurrent: number;
  tempHigh: number;
  tempLow: number;
  conditionEn: string;
  conditionTe: string;
  humidityPct: number;
  windSpeedKmH: number;
  rainChancePct: number;
  uvIndex: number;
  updatedAt: string;
  forecast5Day: {
    dayEn: string;
    dayTe: string;
    temp: number;
    rainChance: number;
    condition: string;
  }[];
}

export interface SensorTelemetry {
  soilMoisturePct: number;
  soilMoistureStatus: "normal" | "warning" | "critical";
  soilMoistureRange: string;
  soilTempC: number;
  soilTempStatus: "normal" | "warning" | "critical";
  soilTempRange: string;
  airHumidityPct: number;
  airHumidityStatus: "normal" | "warning" | "critical";
  airHumidityRange: string;
  soilPh: number;
  soilPhStatus: "normal" | "warning" | "critical";
  soilPhRange: string;
  lastUpdated: string;
}

export interface TelemetryPoint {
  date: string;
  moisture: number;
  temperature: number;
  humidity: number;
  ph: number;
}

export interface IoTAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  titleEn: string;
  titleTe: string;
  descEn: string;
  descTe: string;
  sensorId: string;
  timeAgoEn: string;
  timeAgoTe: string;
  dismissed?: boolean;
}

export interface ConnectedDevice {
  id: string;
  nameEn: string;
  nameTe: string;
  type: "hub" | "sensor" | "actuator";
  isOnline: boolean;
  batteryPct: number;
  rssiSignal: string;
  lastSeenEn: string;
  lastSeenTe: string;
}

export interface PumpState {
  pumpOn: boolean;
  mode: "manual" | "auto";
  thresholdMoisturePct: number;
  rainSkipActive: boolean;
  lastChanged: string;
  valveAOpen: boolean;
  valveBOpen: boolean;
}

export interface MandiPriceItem {
  id: string;
  cropKey?: string;
  varietyKey?: string;
  commodityEn: string;
  commodityTe: string;
  variety: string;
  varietyTe?: string;
  marketNameEn: string;
  marketNameTe: string;
  districtEn: string;
  districtTe: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  prevPrice: number;
  changeAmount: number;
  changePct: number;
  arrivalsQtl: number;
  mspPrice: number;
  govtBonus?: number;
  priceDate: string;
  unit: string;
  distanceKm: number;
  status: "open" | "closed";
  marketStatus?: string;
  totalFarmerRate?: number;
  secretaryPhone?: string;
  mapsQuery: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorVillage: string;
  authorDistrict: string;
  authorCrop: string;
  timeAgoEn: string;
  timeAgoTe: string;
  category: "pest" | "market" | "seeds" | "schemes" | "machinery";
  questionEn: string;
  questionTe: string;
  upvotes: number;
  hasUserUpvoted?: boolean;
  repliesCount: number;
  officialAnswer?: {
    expertName: string;
    designationEn: string;
    designationTe: string;
    institution: string;
    answerEn: string;
    answerTe: string;
    answeredAt: string;
  };
}

export interface AdvisoryTip {
  id: string;
  categoryEn: string;
  categoryTe: string;
  titleEn: string;
  titleTe: string;
  descEn: string;
  descTe: string;
  badgeColor: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  textEn: string;
  textTe?: string;
  timestamp: string;
  audioPlaying?: boolean;
  imageUrl?: string;
  searchQuery?: string;
  isFallback?: boolean;
  source?: string;
}

export interface FieldZone {
  id: string;
  nameEn: string;
  nameTe: string;
  cropEn: string;
  cropTe: string;
  areaAcre: number;
  moisturePct: number;
  status: "optimal" | "dry" | "saturated";
  sensorNode: string;
}

export interface CropTimelineStage {
  day: number;
  stageEn: string;
  stageTe: string;
  status: "completed" | "current" | "upcoming";
  adviceEn: string;
  adviceTe: string;
}

export interface PestDiagnosticCase {
  id: string;
  cropEn: string;
  cropTe: string;
  pestNameEn: string;
  pestNameTe: string;
  severity: "high" | "medium" | "low";
  symptomsEn: string;
  symptomsTe: string;
  recommendedSprayEn: string;
  recommendedSprayTe: string;
  dosageEn: string;
  dosageTe: string;
  organicAlternativeEn: string;
  organicAlternativeTe: string;
  ppePrecautionsEn: string;
  ppePrecautionsTe: string;
  sampleImageUrl: string;
}

export interface MandiPriceHistoryPoint {
  date: string;
  price: number;
}
