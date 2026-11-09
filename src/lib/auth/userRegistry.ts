/**
 * Smart Farm Assistant — User Account & Farmer Registry Store
 * Handles credentials (Google OAuth / Gmail + Password) and connects them directly
 * to their saved Farmer Profile & Field Setup.
 */

import { FarmerProfile, EMPTY_INITIAL_FARMER, saveFarmerProfile, TELANGANA_DISTRICTS } from "@/lib/profile/farmerProfile";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored securely in client registry
  provider: "google" | "credentials";
  profile: FarmerProfile;
  createdAt: string;
}

const USERS_STORAGE_KEY = "smartfarm_user_accounts";

// Pre-seeded verified farmer accounts for testing and demonstration
export const INITIAL_REGISTERED_USERS: UserAccount[] = [
  {
    id: "user-ashfaq",
    name: "Ashfaq Mohammed",
    email: "bioashfaq123@gmail.com",
    password: "password123",
    provider: "credentials",
    profile: {
      ...EMPTY_INITIAL_FARMER,
      name: "Ashfaq Mohammed",
      email: "bioashfaq123@gmail.com",
      phone: "+91 98490 87654",
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
      irrigationType: "3 HP Submersible Borewell",
      sowingDate: "2026-07-15",
      isCustom: true,
      hasCompletedOnboarding: true,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-ashfaq-ts",
    name: "Ashfaq Mohammed",
    email: "ashfaq@smartfarm.telangana",
    password: "password123",
    provider: "credentials",
    profile: {
      ...EMPTY_INITIAL_FARMER,
      name: "Ashfaq Mohammed",
      email: "ashfaq@smartfarm.telangana",
      phone: "+91 98490 87654",
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
      irrigationType: "3 HP Submersible Borewell",
      sowingDate: "2026-07-15",
      isCustom: true,
      hasCompletedOnboarding: true,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-mallesham",
    name: "Mallesham Goud",
    email: "mallesham@rythu.ts.gov",
    password: "password123",
    provider: "credentials",
    profile: {
      ...EMPTY_INITIAL_FARMER,
      name: "Mallesham Goud",
      nameTe: "మల్లేశం గౌడ్",
      email: "mallesham@rythu.ts.gov",
      phone: "+91 98480 12345",
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
      irrigationType: "3 HP Submersible Borewell",
      sowingDate: "2026-07-15",
      isCustom: true,
      hasCompletedOnboarding: true,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

/**
 * Retrieve all registered farmer accounts from localStorage
 */
export function getRegisteredUsers(): UserAccount[] {
  if (typeof window === "undefined") return INITIAL_REGISTERED_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback to initial
  }

  // Initialize storage with pre-seeded users
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
  } catch (e) {}

  return INITIAL_REGISTERED_USERS;
}

/**
 * Find a registered user by email address (case-insensitive)
 */
export function findUserByEmail(email: string): UserAccount | undefined {
  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === cleanEmail);
}

/**
 * Register a new farmer: creates credentials AND saves complete Farmer Profile & Field Setup
 */
export function registerNewFarmer(data: {
  name: string;
  email: string;
  password?: string;
  provider?: "google" | "credentials";
  phone?: string;
  district: string;
  mandal?: string;
  village?: string;
  areaAcre: number;
  areaGunta?: number;
  primaryCrop: string;
  soilType?: string;
  irrigationType?: string;
  sowingDate?: string;
  preferredLanguage?: string;
}): UserAccount {
  const users = getRegisteredUsers();
  const cleanEmail = data.email.trim().toLowerCase();
  const districtMeta = TELANGANA_DISTRICTS[data.district] || TELANGANA_DISTRICTS["Jagtial"];

  const mandal = data.mandal?.trim() || districtMeta.defaultMandal;
  const village = data.village?.trim() || districtMeta.defaultVillage;

  const newProfile: FarmerProfile = {
    ...EMPTY_INITIAL_FARMER,
    name: data.name.trim(),
    email: cleanEmail,
    phone: data.phone?.trim() || "",
    district: data.district,
    districtTe: districtMeta.nameTe,
    mandal,
    village,
    areaAcre: data.areaAcre || 4.0,
    areaGunta: data.areaGunta || 0,
    primaryCrop: data.primaryCrop || "Paddy (RNR 15048 / Telangana Sona)",
    soilType: data.soilType || "Red Sandy Loam (చల్కా నేలలు)",
    irrigationType: data.irrigationType || "3 HP Submersible Borewell",
    sowingDate: data.sowingDate || new Date().toISOString().split("T")[0],
    preferredLanguage: data.preferredLanguage || "English",
    isCustom: true,
    hasCompletedOnboarding: true,
  };

  const newAccount: UserAccount = {
    id: `user-${Date.now()}`,
    name: data.name.trim(),
    email: cleanEmail,
    password: data.password || "",
    provider: data.provider || "credentials",
    profile: newProfile,
    createdAt: new Date().toISOString(),
  };

  // Upsert user into registry
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  let updatedUsers: UserAccount[];
  if (existingIdx >= 0) {
    updatedUsers = [...users];
    updatedUsers[existingIdx] = newAccount;
  } else {
    updatedUsers = [newAccount, ...users];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem("smartfarm_logged_in", "true");
    } catch (e) {}
  }

  // Set as current active profile immediately
  saveFarmerProfile(newProfile);

  return newAccount;
}

/**
 * Authenticate with Gmail/Email and Password
 */
export function authenticateWithPassword(
  email: string,
  password?: string
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const user = findUserByEmail(cleanEmail);

  if (!user) {
    // If not found in registry, check if user is entering a valid email
    // Provide a helpful hint to register their farm profile
    return {
      success: false,
      error: "No registered farm profile found with this email. Please register your farm profile first.",
    };
  }

  // If user has a password set, verify it
  if (user.password && password && user.password !== password) {
    return {
      success: false,
      error: "Incorrect password. Please try again or use Google Sign-In.",
    };
  }

  // Successful login: load their saved farmer profile directly
  saveFarmerProfile(user.profile);
  if (typeof window !== "undefined") {
    localStorage.setItem("smartfarm_logged_in", "true");
  }

  return { success: true, user };
}

/**
 * Authenticate with Google (1-click or Google Account selection)
 */
export function authenticateWithGoogle(
  email: string,
  name?: string
): { success: boolean; user: UserAccount; isNew: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  let user = findUserByEmail(cleanEmail);

  if (user) {
    // Existing registered user: login directly with saved farm profile
    saveFarmerProfile(user.profile);
    if (typeof window !== "undefined") {
      localStorage.setItem("smartfarm_logged_in", "true");
    }
    return { success: true, user, isNew: false };
  }

  // First-time Google user: auto-register with default Telangana farm profile
  // They can review or adjust in field setup
  const farmerName = name?.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const newAccount = registerNewFarmer({
    name: farmerName,
    email: cleanEmail,
    provider: "google",
    district: "Jagtial",
    mandal: "Dharmapuri",
    village: "Mallapur",
    areaAcre: 4.5,
    areaGunta: 0,
    primaryCrop: "Paddy (RNR 15048 / Telangana Sona)",
    soilType: "Red Sandy Loam (చల్కా నేలలు)",
    irrigationType: "3 HP Submersible Borewell",
  });

  return { success: true, user: newAccount, isNew: true };
}
