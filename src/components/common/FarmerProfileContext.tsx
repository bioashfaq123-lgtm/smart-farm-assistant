"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FarmerProfile,
  DEFAULT_SAMPLE_FARMER,
  EMPTY_INITIAL_FARMER,
  getStoredFarmerProfile,
  saveFarmerProfile,
  resetToSampleProfile,
  TELANGANA_DISTRICTS,
} from "@/lib/profile/farmerProfile";

interface FarmerProfileContextType {
  profile: FarmerProfile;
  updateProfile: (updates: Partial<FarmerProfile>) => void;
  resetToSample: () => void;
  isModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const FarmerProfileContext = createContext<FarmerProfileContextType>({
  profile: EMPTY_INITIAL_FARMER,
  updateProfile: () => {},
  resetToSample: () => {},
  isModalOpen: false,
  openProfileModal: () => {},
  closeProfileModal: () => {},
});

export function FarmerProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(EMPTY_INITIAL_FARMER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    const stored = getStoredFarmerProfile();
    setProfile(stored);

    // If visiting for the first time without completed profile, automatically ask the farmer to complete setup!
    if (!stored.hasCompletedOnboarding) {
      setIsModalOpen(true);
    }

    const handleUpdate = () => {
      setProfile(getStoredFarmerProfile());
    };

    window.addEventListener("smartfarm_profile_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("smartfarm_profile_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    const updated = saveFarmerProfile(updates);
    setProfile(updated);
  };

  const resetToSample = () => {
    const sample = resetToSampleProfile();
    setProfile(sample);
  };

  return (
    <FarmerProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetToSample,
        isModalOpen,
        openProfileModal: () => setIsModalOpen(true),
        closeProfileModal: () => setIsModalOpen(false),
      }}
    >
      {children}
      {isModalOpen && (
        <FarmerProfileModal
          profile={profile}
          onSave={(updates) => {
            updateProfile(updates);
            setIsModalOpen(false);
          }}
          onReset={() => {
            resetToSample();
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </FarmerProfileContext.Provider>
  );
}

export function useFarmerProfile() {
  return useContext(FarmerProfileContext);
}

// Modal Component for changing farmer profile
function FarmerProfileModal({
  profile,
  onSave,
  onReset,
  onClose,
}: {
  profile: FarmerProfile;
  onSave: (updates: Partial<FarmerProfile>) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [district, setDistrict] = useState(profile.district || "Jagtial");
  const [mandal, setMandal] = useState(profile.mandal || "Dharmapuri");
  const [village, setVillage] = useState(profile.village || "Mallapur");
  const [areaAcre, setAreaAcre] = useState(profile.areaAcre || 4);
  const [areaGunta, setAreaGunta] = useState(profile.areaGunta || 0);
  const [primaryCrop, setPrimaryCrop] = useState(profile.primaryCrop || "Paddy (RNR 15048 / Telangana Sona)");
  const [soilType, setSoilType] = useState(profile.soilType || "Red Sandy Loam (చల్కా నేలలు)");
  const [irrigationType, setIrrigationType] = useState(profile.irrigationType || "3 HP Submersible Borewell");
  const [sowingDate, setSowingDate] = useState(profile.sowingDate || "");
  const [cropAgeDays, setCropAgeDays] = useState<number | "">(() => {
    if (profile.sowingDate) {
      const diff = Math.floor((Date.now() - new Date(profile.sowingDate).getTime()) / (1000 * 60 * 60 * 24));
      return isNaN(diff) || diff < 0 ? "" : diff;
    }
    return "";
  });

  const handleSowingDateChange = (val: string) => {
    setSowingDate(val);
    if (val) {
      const diff = Math.floor((Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24));
      setCropAgeDays(isNaN(diff) || diff < 0 ? 0 : diff);
    } else {
      setCropAgeDays("");
    }
  };

  const handleCropAgeChange = (daysVal: string) => {
    if (daysVal === "") {
      setCropAgeDays("");
      setSowingDate("");
      return;
    }
    const days = parseInt(daysVal, 10);
    if (!isNaN(days) && days >= 0) {
      setCropAgeDays(days);
      const targetDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      setSowingDate(targetDate.toISOString().split("T")[0]);
    }
  };

  const districtNames = Object.keys(TELANGANA_DISTRICTS);

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const meta = TELANGANA_DISTRICTS[newDist];
    if (meta) {
      setMandal(meta.defaultMandal);
      setVillage(meta.defaultVillage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      district,
      mandal: mandal.trim(),
      village: village.trim(),
      areaAcre,
      areaGunta,
      primaryCrop,
      soilType,
      irrigationType,
      sowingDate,
      isCustom: true,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              {profile.hasCompletedOnboarding ? "Farmer Profile & Field Setup" : "Welcome! Complete Farmer & Field Setup"}
            </h3>
            <p className="text-xs text-stone-500">
              {profile.hasCompletedOnboarding
                ? "Personalize your real farm parameters and district location"
                : "Enter your farm parameters to get personalized PJTAU advisories, local weather, and IoT insights"}
            </p>
          </div>
          {profile.hasCompletedOnboarding && (
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* First-time onboarding helper banner */}
        {!profile.hasCompletedOnboarding && (
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-green-950/40 border border-emerald-300 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <span className="text-xl shrink-0">🌾</span>
            <div>
              <p className="font-bold">Rythu Digital Setup (తెలంగాణ రైతు పోర్టల్)</p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                Set up your district and crop once. All farm advisories, fertilizer split schedules, mandi rates, and sensor telemetry will adapt directly to your field.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Farmer Name / రైతు పేరు <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g. Md Ashfaq / మీ పేరు"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                District / జిల్లా
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {districtNames.map((d) => (
                  <option key={d} value={d}>
                    {d} ({TELANGANA_DISTRICTS[d]?.nameTe})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Mandal / మండలం
              </label>
              <input
                type="text"
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Village / గ్రామం
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Land Area (Acres)
              </label>
              <input
                type="number"
                min="0.1"
                max="1000"
                step="any"
                value={areaAcre}
                onChange={(e) => setAreaAcre(parseFloat(e.target.value) || 1)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Guntas (0–39)
              </label>
              <input
                type="number"
                min="0"
                max="39"
                step="1"
                value={areaGunta}
                onChange={(e) => setAreaGunta(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Primary Crop / పంట
              </label>
              <select
                value={primaryCrop}
                onChange={(e) => setPrimaryCrop(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
              >
                <option value="Paddy (RNR 15048 / Telangana Sona)">Paddy (RNR 15048 / Telangana Sona)</option>
                <option value="Paddy (BPT 5204 / Samba Mahsuri)">Paddy (BPT 5204 / Samba Mahsuri)</option>
                <option value="Cotton (Medium-Long Staple)">Cotton (Medium-Long Staple)</option>
                <option value="Maize (Hybrid Yellow)">Maize (Hybrid Yellow)</option>
                <option value="Chilli (Teja)">Chilli (Teja)</option>
                <option value="Redgram (PRG 176)">Redgram (PRG 176)</option>
                <option value="Soybean (JS 335)">Soybean (JS 335)</option>
                <option value="Turmeric (Duggirala / Nizamabad)">Turmeric (Duggirala / Nizamabad)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Soil Type / నేల రకం
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
              >
                <option value="Red Sandy Loam (చల్కా నేలలు)">Red Sandy Loam (చల్కా నేలలు)</option>
                <option value="Deep Black Clay (నల్ల రేగడి)">Deep Black Clay (నల్ల రేగడి)</option>
                <option value="Medium Black Soil (మధ్యస్థ నల్ల నేల)">Medium Black Soil (మధ్యస్థ నల్ల నేల)</option>
                <option value="Alluvial Loam (ఒండ్రు నేల)">Alluvial Loam (ఒండ్రు నేల)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Sowing Date / విత్తిన తేదీ
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => handleSowingDateChange(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Crop Age (Days) / పంట వయస్సు (రోజులు)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="365"
                  step="1"
                  placeholder="e.g. 45"
                  value={cropAgeDays}
                  onChange={(e) => handleCropAgeChange(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">days</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Irrigation Source / నీటి పారుదల
            </label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-2.5 text-sm font-medium outline-none"
            >
              <option value="3 HP Submersible Borewell">3 HP Submersible Borewell</option>
              <option value="5 HP Submersible Borewell">5 HP Submersible Borewell</option>
              <option value="Open Well Monoblock Pump">Open Well Monoblock Pump</option>
              <option value="Canal / Lift Irrigation">Canal / Lift Irrigation</option>
              <option value="Drip Irrigation System">Drip Irrigation System</option>
            </select>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 transition border border-stone-200 dark:border-stone-700 rounded-xl"
            >
              Load Sample Profile (Mallesham Goud, Jagtial)
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {profile.hasCompletedOnboarding && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition"
              >
                {profile.hasCompletedOnboarding ? "Save My Profile" : "Complete Field Setup"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
