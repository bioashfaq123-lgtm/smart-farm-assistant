"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FarmerProfile,
  DEFAULT_SAMPLE_FARMER,
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
  profile: DEFAULT_SAMPLE_FARMER,
  updateProfile: () => {},
  resetToSample: () => {},
  isModalOpen: false,
  openProfileModal: () => {},
  closeProfileModal: () => {},
});

export function FarmerProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_SAMPLE_FARMER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    setProfile(getStoredFarmerProfile());

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
  const [district, setDistrict] = useState(profile.district);
  const [mandal, setMandal] = useState(profile.mandal);
  const [village, setVillage] = useState(profile.village);
  const [areaAcre, setAreaAcre] = useState(profile.areaAcre);
  const [areaGunta, setAreaGunta] = useState(profile.areaGunta);
  const [primaryCrop, setPrimaryCrop] = useState(profile.primaryCrop);
  const [soilType, setSoilType] = useState(profile.soilType);
  const [irrigationType, setIrrigationType] = useState(profile.irrigationType);

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
      name,
      district,
      mandal,
      village,
      areaAcre,
      areaGunta,
      primaryCrop,
      soilType,
      irrigationType,
      isCustom: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Farmer Profile & Field Setup
            </h3>
            <p className="text-xs text-stone-500">
              Personalize your real farm parameters and district location
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Farmer Name / రైతు పేరు
            </label>
            <input
              type="text"
              value={name}
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
                max="100"
                step="0.5"
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
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 sm:w-auto px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition"
              >
                Save My Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
