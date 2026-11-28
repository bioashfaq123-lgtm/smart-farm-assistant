// Client & Local Analytics Store for Smart Farmer Assistant

export interface VisitorEvent {
  id: string;
  timestamp: number;
  path: string;
  device: "Mobile" | "Desktop" | "Tablet";
  district: string;
  sessionId: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  activeUsersNow: number;
  todayVisits: number;
  todayGrowthPercent: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topPages: {
    name: string;
    path: string;
    visits: number;
    percentage: number;
  }[];
  hourlyTraffic: {
    hour: string;
    visitors: number;
    pageviews: number;
  }[];
  dailyTrend: {
    day: string;
    visits: number;
    farmers: number;
  }[];
  districts: {
    district: string;
    farmers: number;
    percentage: number;
  }[];
  recentActivity: {
    id: string;
    timeAgo: string;
    action: string;
    page: string;
    device: "Mobile" | "Desktop" | "Tablet";
    district: string;
  }[];
}

const STORAGE_EVENTS_KEY = "sf_analytics_events_v1";
const STORAGE_SESSION_KEY = "sf_session_id_v1";
const STORAGE_VISITOR_KEY = "sf_visitor_id_v1";

const TELANGANA_DISTRICTS = [
  "Jagtial (కోరుట్ల)",
  "Karimnagar (కరీంనగర్)",
  "Nizamabad (నిజామాబాద్)",
  "Warangal (వరంగల్)",
  "Nalgonda (నల్గొండ)",
  "Khammam (ఖమ్మం)",
  "Siddipet (సిద్దిపేట)",
  "Hyderabad (హైదరాబాద్)",
];

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sId = sessionStorage.getItem(STORAGE_SESSION_KEY);
  if (!sId) {
    sId = "sess_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
    sessionStorage.setItem(STORAGE_SESSION_KEY, sId);
  }
  return sId;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let vId = localStorage.getItem(STORAGE_VISITOR_KEY);
  if (!vId) {
    vId = "vis_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(STORAGE_VISITOR_KEY, vId);
  }
  return vId;
}

export function detectDevice(): "Mobile" | "Desktop" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua) || (width >= 640 && width <= 1024)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua) || width < 640) {
    return "Mobile";
  }
  return "Desktop";
}

export function recordClientPageview(path: string): void {
  if (typeof window === "undefined") return;

  const sessionId = getOrCreateSessionId();
  const device = detectDevice();
  let district = "Jagtial";
  try {
    const raw = localStorage.getItem("smartfarm_farmer_profile");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.district) district = parsed.district;
    }
  } catch {}

  const event: VisitorEvent = {
    id: "evt_" + Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
    path,
    device,
    district,
    sessionId,
  };

  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    const events: VisitorEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(event);
    // Keep max 100 actual events
    if (events.length > 100) events.length = 100;
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn("Could not write analytics event to localStorage:", err);
  }
}

export function getAnalyticsSummary(): AnalyticsSummary {
  let localEvents: VisitorEvent[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (raw) localEvents = JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;
  const recentSessions = new Set(
    localEvents
      .filter((e) => e.timestamp > fifteenMinsAgo)
      .map((e) => e.sessionId)
  );

  const activeUsersNow = Math.max(1, recentSessions.size);
  const totalVisitors = localEvents.length;
  const todayVisits = localEvents.filter((e) => {
    const d = new Date(e.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return {
    totalVisitors,
    activeUsersNow,
    todayVisits,
    todayGrowthPercent: 0,
    deviceBreakdown: {
      mobile: 100,
      desktop: 0,
      tablet: 0,
    },
    topPages: [],
    hourlyTraffic: [],
    dailyTrend: [],
    districts: [],
    recentActivity: [],
  };
}

export function exportAnalyticsCSV(summary: AnalyticsSummary): void {
  if (typeof window === "undefined") return;

  let csv = "Smart Farm Assistant Admin - Visitor Analytics Report\n";
  csv += `Generated At,${new Date().toLocaleString()}\n`;
  csv += `Total Visitors,${summary.totalVisitors}\n`;
  csv += `Active Users Right Now,${summary.activeUsersNow}\n`;
  csv += `Today's Visits,${summary.todayVisits}\n\n`;

  csv += "Top Visited Pages,Path,Visits,Percentage\n";
  summary.topPages.forEach((p) => {
    csv += `"${p.name}","${p.path}",${p.visits},${p.percentage}%\n`;
  });

  csv += "\nDistrict Breakdown,Farmers,Share\n";
  summary.districts.forEach((d) => {
    csv += `"${d.district}",${d.farmers},${d.percentage}%\n`;
  });

  csv += "\nDaily Traffic Trend,Day,Visits,Active Farmers\n";
  summary.dailyTrend.forEach((d) => {
    csv += `"${d.day}",${d.visits},${d.farmers}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `smart_farm_assistant_admin_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
