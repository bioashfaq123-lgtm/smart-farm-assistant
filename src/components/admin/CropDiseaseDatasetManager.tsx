"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Download,
  RefreshCw,
  Search,
  Filter,
  Save,
  Clock,
  Eye,
  FileCheck
} from "lucide-react";

interface DatasetItem {
  id: string;
  timestamp: number;
  crop: string;
  context?: {
    stage?: string;
    part?: string;
    spread?: string;
    weather?: string;
    sprays?: string;
  };
  topCauseId?: string;
  topCauseName?: string;
  confidence?: string;
  isUnderstood?: boolean;
  imageThumb?: string;
  userFeedback?: "yes" | "no" | "not_sure" | "custom" | null;
  userCorrectDisease?: string | null;
  adminLabel?: string | null;
  adminNotes?: string | null;
  adminVerifiedAt?: number | null;
}

const TELANGANA_DISEASE_OPTIONS = [
  // Paddy
  { id: "paddy_blast", label: "Paddy: Rice Blast (అగ్గితెగులు)" },
  { id: "paddy_bacterial_leaf_blight", label: "Paddy: Bacterial Leaf Blight (బాక్టీరియా ఆకు ఎండు)" },
  { id: "paddy_sheath_blight", label: "Paddy: Sheath Blight (మట్ట కుళ్లు తెగులు)" },
  { id: "paddy_brown_planthopper", label: "Paddy: Brown Planthopper / BPH (సుడి దోమ)" },
  { id: "paddy_zinc_deficiency", label: "Paddy: Zinc Deficiency (జింక్ లోపం / తుప్పు మచ్చలు)" },
  // Maize
  { id: "maize_fall_armyworm", label: "Maize: Fall Armyworm (కత్తెర పురుగు)" },
  { id: "maize_turcicum_blight", label: "Maize: Turcicum Leaf Blight (టర్సికమ్ ఆకు ఎండు)" },
  { id: "maize_nitrogen_deficiency", label: "Maize: Nitrogen Deficiency (నత్రజని లోపం)" },
  // Cotton
  { id: "cotton_bacterial_blight", label: "Cotton: Bacterial Blight / Blackarm (నల్లకాండం)" },
  { id: "cotton_pink_bollworm", label: "Cotton: Pink Bollworm (గులాబీ రంగు కాయ తొలిచే పురుగు)" },
  { id: "cotton_magnesium_deficiency", label: "Cotton: Magnesium Deficiency / Reddening (ఎరుపు ఆకులు)" },
  // Groundnut
  { id: "groundnut_tikka_leaf_spot", label: "Groundnut: Tikka Leaf Spot (టిక్కా ఆకుమచ్చ తెగులు)" },
  { id: "groundnut_collar_rot", label: "Groundnut: Collar Rot / Crown Rot (మొదలు కుళ్లు తెగులు)" },
  { id: "groundnut_iron_chlorosis", label: "Groundnut: Iron Deficiency (ఇనుము లోపం)" },
  // Sesame
  { id: "sesame_phyllody", label: "Sesame: Phyllody (ఆకుజెముడు తెగులు)" },
  { id: "sesame_leaf_webber", label: "Sesame: Leaf Webber & Pod Borer (ఆకు ముడుత పురుగు)" },
  // Redgram
  { id: "redgram_fusarium_wilt", label: "Redgram: Fusarium Wilt (ఎండు తెగులు)" },
  { id: "redgram_pod_borer", label: "Redgram: Gram Pod Borer (శనగ పచ్చపురుగు)" },
  { id: "redgram_sterility_mosaic", label: "Redgram: Sterility Mosaic (వెర్రి తెగులు)" },
  // Chilli
  { id: "chilli_murda_leaf_curl", label: "Chilli: Murda Leaf Curl & Thrips (ముడత తెగులు / బొబ్బర)" },
  { id: "chilli_anthracnose_fruit_rot", label: "Chilli: Anthracnose / Dieback (కొమ్మ ఎండు & కాయకుళ్లు)" },
  { id: "chilli_powdery_mildew", label: "Chilli: Powdery Mildew (బూడిద తెగులు)" },
  // Soybean
  { id: "soybean_yellow_mosaic", label: "Soybean: Yellow Mosaic Virus (పసుపు రంగు మొజాయిక్)" },
  { id: "soybean_girdle_beetle", label: "Soybean: Girdle Beetle (రింగ్ బీటిల్)" },
  { id: "soybean_potassium_deficiency", label: "Soybean: Potassium Deficiency (పొటాష్ లోపం)" },
  // Other / Fallback
  { id: "healthy", label: "Healthy Plant (ఆరోగ్యకరమైన మొక్క)" },
  { id: "unclear_photo", label: "Unclear / Poor Photo (మసక ఫోటో)" },
  { id: "other_pest", label: "Other Pest / Uncatalogued (ఇతర పురుగు/సమస్య)" }
];

export default function CropDiseaseDatasetManager() {
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCrop, setFilterCrop] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>({});
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const fetchDataset = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diagnose?action=dataset");
      const data = await res.json();
      if (res.ok && Array.isArray(data.dataset)) {
        setItems(data.dataset);
        // Initialize local selected labels
        const labelsMap: Record<string, string> = {};
        const notesMap: Record<string, string> = {};
        data.dataset.forEach((item: DatasetItem) => {
          if (item.adminLabel) labelsMap[item.id] = item.adminLabel;
          if (item.adminNotes) notesMap[item.id] = item.adminNotes;
        });
        setSelectedLabels(labelsMap);
        setSelectedNotes(notesMap);
      }
    } catch (err) {
      console.warn("Failed to load dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  const handleSaveLabel = async (id: string) => {
    const label = selectedLabels[id];
    const notes = selectedNotes[id] || "";
    if (!label) {
      alert("Please select a verified label before saving.");
      return;
    }

    setSavingId(id);
    try {
      const res = await fetch("/api/diagnose?action=label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label, notes })
      });
      if (res.ok) {
        setItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, adminLabel: label, adminNotes: notes, adminVerifiedAt: Date.now() } : item
          )
        );
      } else {
        alert("Could not update label. Please try again.");
      }
    } catch (e) {
      alert("Network error updating label.");
    } finally {
      setSavingId(null);
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ["ID", "Timestamp", "Crop", "TopCauseModel", "ModelConfidence", "FarmerFeedback", "FarmerCorrection", "VerifiedAdminLabel", "AdminNotes"];
    const rows = items.map(i => [
      i.id,
      new Date(i.timestamp).toISOString(),
      i.crop,
      i.topCauseName || "",
      i.confidence || "",
      i.userFeedback || "",
      (i.userCorrectDisease || "").replace(/"/g, '""'),
      i.adminLabel || "PENDING",
      (i.adminNotes || "").replace(/"/g, '""')
    ]);

    const csvStr = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `telangana_crop_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter(item => {
    if (filterCrop !== "all" && item.crop.toLowerCase() !== filterCrop.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.topCauseName || "").toLowerCase().includes(q);
      const matchLabel = (item.adminLabel || "").toLowerCase().includes(q);
      const matchFeedback = (item.userCorrectDisease || "").toLowerCase().includes(q);
      if (!matchName && !matchLabel && !matchFeedback) return false;
    }
    return true;
  });

  const verifiedCount = items.filter(i => Boolean(i.adminLabel)).length;
  const pendingCount = items.length - verifiedCount;
  const feedbackYes = items.filter(i => i.userFeedback === "yes").length;
  const feedbackNo = items.filter(i => i.userFeedback === "no").length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Total Consented Photos</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              📸
            </div>
          </div>
          <div className="text-2xl font-bold mt-2 text-stone-900 dark:text-white">{items.length}</div>
          <div className="text-xs text-stone-400 mt-1">Anonymously collected from farmers</div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Verified Labels</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2 text-blue-600">{verifiedCount}</div>
          <div className="text-xs text-stone-400 mt-1">Ready for evaluation dataset</div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2 text-amber-600">{pendingCount}</div>
          <div className="text-xs text-stone-400 mt-1">Awaiting expert labeling</div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Farmer Feedback Ratio</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold mt-2 text-stone-900 dark:text-white">
            👍 {feedbackYes} · 👎 {feedbackNo}
          </div>
          <div className="text-xs text-stone-400 mt-1">Direct feedback from Telangana farmers</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by crop, disease, or feedback..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <select
            value={filterCrop}
            onChange={e => setFilterCrop(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
          >
            <option value="all">All Crops</option>
            <option value="Paddy">Paddy</option>
            <option value="Maize">Maize</option>
            <option value="Cotton">Cotton</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Sesame">Sesame</option>
            <option value="Redgram">Redgram</option>
            <option value="Chilli">Chilli</option>
            <option value="Soybean">Soybean</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDataset}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dataset CSV</span>
          </button>
        </div>
      </div>

      {/* Dataset Items Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Submitted Photo Records ({filteredItems.length})
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            Click thumbnail to view full photo. Select verified label and tap Save.
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            Loading dataset records from storage...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            No crop photo records found. Photos appear here when farmers check &quot;I consent to anonymously save this photo&quot; during diagnosis.
          </div>
        ) : (
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredItems.map(item => {
              const dt = new Date(item.timestamp);
              const dateStr = dt.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div key={item.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition">
                  {/* Photo Thumbnail + Basic Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-16 h-16 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden shrink-0 cursor-pointer relative group"
                      onClick={() => item.imageThumb && setActivePhotoModal(item.imageThumb)}
                      title="Click to expand"
                    >
                      {item.imageThumb ? (
                        <img src={item.imageThumb} alt="Crop sample" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-stone-900 dark:text-white">
                          {item.crop}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {dateStr}
                        </span>
                        {item.adminLabel ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                            ✓ Labeled
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                            Pending Review
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                        AI Top Cause: <b>{item.topCauseName || "Unsure"}</b> ({item.confidence?.toUpperCase() || "MED"})
                      </div>

                      {item.context && (
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          Stage: {item.context.stage} · Part: {item.context.part} · Spread: {item.context.spread}
                        </div>
                      )}

                      {item.userFeedback && (
                        <div className="text-xs mt-1.5 flex items-center gap-1.5 font-medium">
                          <span className="text-stone-400">Farmer Feedback:</span>
                          {item.userFeedback === "yes" && <span className="text-emerald-600">👍 Confirmed correct</span>}
                          {item.userFeedback === "no" && <span className="text-red-600">👎 Reported incorrect</span>}
                          {item.userFeedback === "not_sure" && <span className="text-amber-600">🤔 Not sure</span>}
                          {item.userCorrectDisease && (
                            <span className="text-stone-700 dark:text-stone-200">
                              (Claimed: &quot;{item.userCorrectDisease}&quot;)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Labeling Form Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
                    <select
                      value={selectedLabels[item.id] || ""}
                      onChange={e => setSelectedLabels({ ...selectedLabels, [item.id]: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 w-full sm:w-64"
                    >
                      <option value="">-- Select Verified Disease Label --</option>
                      {TELANGANA_DISEASE_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Expert notes / AEO comments..."
                      value={selectedNotes[item.id] || ""}
                      onChange={e => setSelectedNotes({ ...selectedNotes, [item.id]: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 w-full sm:w-48"
                    />

                    <button
                      onClick={() => handleSaveLabel(item.id)}
                      disabled={savingId === item.id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingId === item.id ? "Saving..." : "Save Label"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Photo Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActivePhotoModal(null)}
        >
          <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl max-w-xl w-full border border-stone-700 shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">High-Resolution Photo Preview</span>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <img src={activePhotoModal} alt="Expanded crop" className="w-full max-h-[70vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
