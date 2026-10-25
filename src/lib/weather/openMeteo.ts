/**
 * Live Open-Meteo Weather Service for Telangana Districts
 * Free tier, accurate hourly/daily forecasting with 30-minute client caching.
 */

import { TELANGANA_DISTRICTS } from "@/lib/profile/farmerProfile";

export interface LiveWeatherData {
  district: string;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmH: number;
  precipitationMm: number;
  weatherCode: number;
  weatherDescriptionEn: string;
  weatherDescriptionTe: string;
  todayHighC: number;
  todayLowC: number;
  rainProbabilityPct: number;
  dailyForecast: {
    date: string;
    dayNameEn: string;
    dayNameTe: string;
    highC: number;
    lowC: number;
    rainProbPct: number;
    precipitationMm: number;
    conditionEn: string;
    conditionTe: string;
  }[];
  isLive: boolean;
  cachedAt: number;
  lastUpdatedText: string;
  source: string;
}

// WMO Weather code interpreter
export function interpretWeatherCode(code: number): { en: string; te: string } {
  switch (code) {
    case 0:
      return { en: "Clear sky", te: "నిర్మలమైన ఆకాశం" };
    case 1:
    case 2:
    case 3:
      return { en: "Partly cloudy", te: "పాక్షికంగా మేఘావృతం" };
    case 45:
    case 48:
      return { en: "Foggy / Mist", te: "పొగమంచు" };
    case 51:
    case 53:
    case 55:
      return { en: "Light drizzle", te: "తేలికపాటి జల్లులు" };
    case 61:
    case 63:
    case 65:
      return { en: "Rain showers", te: "వర్షం" };
    case 80:
    case 81:
    case 82:
      return { en: "Heavy downpour", te: "భారీ వర్షం" };
    case 95:
    case 96:
    case 99:
      return { en: "Thunderstorm warning", te: "ఉరుములతో కూడిన వర్షం" };
    default:
      return { en: "Fair weather", te: "అనుకూల వాతావరణం" };
  }
}

const CACHE_PREFIX = "smartfarm_weather_cache_";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function fetchLiveDistrictWeather(district: string = "Jagtial"): Promise<LiveWeatherData> {
  const coords = TELANGANA_DISTRICTS[district] || TELANGANA_DISTRICTS.Jagtial;
  const cacheKey = `${CACHE_PREFIX}${district.toLowerCase()}`;

  // 1. Check client localStorage cache
  if (typeof window !== "undefined") {
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached: LiveWeatherData = JSON.parse(cachedRaw);
        const age = Date.now() - cached.cachedAt;
        if (age < CACHE_TTL_MS) {
          const minutesAgo = Math.max(1, Math.floor(age / 60000));
          return {
            ...cached,
            isLive: true,
            lastUpdatedText: `${minutesAgo} min ago`,
          };
        }
      }
    } catch (e) {
      // cache read failed
    }
  }

  // 2. Fetch fresh Open-Meteo forecast
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo status ${res.status}`);

    const json = await res.json();
    const current = json.current;
    const daily = json.daily;

    const condition = interpretWeatherCode(current.weather_code);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNamesTe: Record<string, string> = {
      Sun: "ఆది",
      Mon: "సోమ",
      Tue: "మంగళ",
      Wed: "బుధ",
      Thu: "గురు",
      Fri: "శుక్ర",
      Sat: "శని",
    };

    const dailyForecast = (daily.time || []).slice(0, 5).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      const dayEn = dayNames[d.getDay()] || "Day";
      const dayTe = dayNamesTe[dayEn] || dayEn;
      const prob = (daily.precipitation_probability_max && daily.precipitation_probability_max[idx]) ?? 0;
      const rainMm = (daily.precipitation_sum && daily.precipitation_sum[idx]) ?? 0;
      const cond = prob > 50 ? { en: "Rain", te: "వర్షం" } : { en: "Clear/Cloudy", te: "సాధారణం" };

      return {
        date: dateStr,
        dayNameEn: dayEn,
        dayNameTe: dayTe,
        highC: Math.round(daily.temperature_2m_max[idx] ?? 32),
        lowC: Math.round(daily.temperature_2m_min[idx] ?? 22),
        rainProbPct: prob,
        precipitationMm: rainMm,
        conditionEn: cond.en,
        conditionTe: cond.te,
      };
    });

    const liveData: LiveWeatherData = {
      district,
      temperatureC: Math.round(current.temperature_2m ?? 28),
      humidityPct: Math.round(current.relative_humidity_2m ?? 60),
      windSpeedKmH: Math.round(current.wind_speed_10m ?? 8),
      precipitationMm: current.precipitation ?? 0,
      weatherCode: current.weather_code ?? 0,
      weatherDescriptionEn: condition.en,
      weatherDescriptionTe: condition.te,
      todayHighC: Math.round(daily.temperature_2m_max?.[0] ?? 32),
      todayLowC: Math.round(daily.temperature_2m_min?.[0] ?? 22),
      rainProbabilityPct: daily.precipitation_probability_max?.[0] ?? 0,
      dailyForecast,
      isLive: true,
      cachedAt: Date.now(),
      lastUpdatedText: "Just now",
      source: "Open-Meteo Live API",
    };

    // Save to cache
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(liveData));
      } catch (e) {}
    }

    return liveData;
  } catch (err) {
    // 3. Fallback to cached copy if offline
    if (typeof window !== "undefined") {
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached: LiveWeatherData = JSON.parse(cachedRaw);
          const minutesAgo = Math.max(1, Math.floor((Date.now() - cached.cachedAt) / 60000));
          return {
            ...cached,
            isLive: false,
            lastUpdatedText: `Cached (${minutesAgo} min ago)`,
            source: "Cached Open-Meteo",
          };
        }
      } catch (e) {}
    }

    // 4. Safe offline baseline if never fetched before
    return {
      district,
      temperatureC: 28,
      humidityPct: 62,
      windSpeedKmH: 9,
      precipitationMm: 0,
      weatherCode: 1,
      weatherDescriptionEn: "Partly cloudy",
      weatherDescriptionTe: "పాక్షికంగా మేఘావృతం",
      todayHighC: 32,
      todayLowC: 21,
      rainProbabilityPct: 15,
      dailyForecast: [
        { date: "Day 1", dayNameEn: "Today", dayNameTe: "నేడు", highC: 32, lowC: 21, rainProbPct: 15, precipitationMm: 0, conditionEn: "Partly cloudy", conditionTe: "మేఘాలు" },
        { date: "Day 2", dayNameEn: "Tomorrow", dayNameTe: "రేపు", highC: 31, lowC: 22, rainProbPct: 20, precipitationMm: 0, conditionEn: "Partly cloudy", conditionTe: "మేఘాలు" },
        { date: "Day 3", dayNameEn: "Wed", dayNameTe: "బుధ", highC: 30, lowC: 21, rainProbPct: 35, precipitationMm: 2, conditionEn: "Light rain", conditionTe: "తేలికపాటి వర్షం" },
        { date: "Day 4", dayNameEn: "Thu", dayNameTe: "గురు", highC: 28, lowC: 20, rainProbPct: 60, precipitationMm: 12, conditionEn: "Showers", conditionTe: "వర్షం" },
        { date: "Day 5", dayNameEn: "Fri", dayNameTe: "శుక్ర", highC: 31, lowC: 21, rainProbPct: 25, precipitationMm: 0, conditionEn: "Fair", conditionTe: "అనుకూలం" },
      ],
      isLive: false,
      cachedAt: Date.now(),
      lastUpdatedText: "Offline baseline",
      source: "Offline Agronomy Baseline",
    };
  }
}
