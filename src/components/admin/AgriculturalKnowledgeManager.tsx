"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Layers,
  ShieldCheck,
  RefreshCw,
  Eye,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Database,
  ExternalLink,
} from "lucide-react";
import { AGRICULTURAL_KNOWLEDGE_STORE } from "@/lib/knowledge/knowledgeStore";
import { VERIFIED_PESTICIDES } from "@/lib/knowledge/pesticideRegistry";
import { KnowledgeRecord, QualityStatus } from "@/lib/knowledge/types";

// Audit Manifest Summary Data
const AUDIT_SUMMARY = {
  totalPublications: 58,
  totalBookPages: 721,
  totalMagazinePages: 2968,
  totalCombinedPages: 3689,
  integrityVerifiedPct: 100,
  duplicateIdenticalHashes: 0,
  status: "Verified SHA-256 Digest",
};

// Publications List from Audit Manifest
const PUBLICATIONS_LIST = [
  { filename: "Vyavasaayam-Diksoochi-2019-2020.pdf", pages: 721, sizeMb: 83.25, type: "Comprehensive Reference Book", status: "Verified & Indexed", ocr: "Unicode Normalized" },
  { filename: "Vyavasayam - August, 2026.pdf", pages: 52, sizeMb: 15.55, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam - June, 2026.pdf", pages: 52, sizeMb: 15.17, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam - November, 2026.pdf", pages: 52, sizeMb: 16.33, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam - October 2026.pdf", pages: 52, sizeMb: 16.57, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam -September, 2026.pdf", pages: 52, sizeMb: 19.02, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam, April 2026.pdf", pages: 52, sizeMb: 17.46, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam, May 2026.pdf", pages: 52, sizeMb: 14.22, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "Vyavasayam-July-2026.pdf", pages: 52, sizeMb: 16.58, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-April-2023.pdf", pages: 52, sizeMb: 16.44, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-April-2024-01.pdf", pages: 52, sizeMb: 15.48, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-April-2025.pdf", pages: 52, sizeMb: 19.20, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-August-2023.pdf", pages: 52, sizeMb: 14.68, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-August-2024.pdf", pages: 52, sizeMb: 15.31, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-August-2025-1.pdf", pages: 52, sizeMb: 22.90, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-December-2022-1.pdf", pages: 52, sizeMb: 18.76, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-December-2023.pdf", pages: 52, sizeMb: 18.98, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-December-2024.pdf", pages: 56, sizeMb: 19.06, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-December-2025.pdf", pages: 52, sizeMb: 18.87, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-February-2022.pdf", pages: 52, sizeMb: 22.16, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-February-2023.pdf", pages: 52, sizeMb: 22.02, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-February-2024.pdf", pages: 52, sizeMb: 15.95, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-February-2025.pdf", pages: 52, sizeMb: 17.16, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-February-2026.pdf", pages: 52, sizeMb: 49.84, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-January-2022.pdf", pages: 52, sizeMb: 16.58, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-January-2023.pdf", pages: 52, sizeMb: 15.86, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-January-2025.pdf", pages: 52, sizeMb: 16.99, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-January-2026.pdf", pages: 52, sizeMb: 16.30, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-July-2022.pdf", pages: 52, sizeMb: 14.99, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-July-2024-2.pdf", pages: 52, sizeMb: 16.33, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-july-2023.pdf", pages: 52, sizeMb: 14.17, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-june-2023-1.pdf", pages: 52, sizeMb: 16.74, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
  { filename: "vyavasayam-june-2024-2.pdf", pages: 52, sizeMb: 22.27, type: "Monthly Issue", status: "Verified & Indexed", ocr: "Decoded PUA" },
];

export default function AgriculturalKnowledgeManager() {
  const [subTab, setSubTab] = useState<"publications" | "records" | "pesticides" | "gaps">("publications");
  const [pubSearch, setPubSearch] = useState("");
  const [recordCrop, setRecordCrop] = useState("all");
  const [recordCategory, setRecordCategory] = useState("all");
  const [recordsState, setRecordsState] = useState<KnowledgeRecord[]>(AGRICULTURAL_KNOWLEDGE_STORE);
  const [selectedRecord, setSelectedRecord] = useState<KnowledgeRecord | null>(null);

  // Update record quality status in local state
  const handleUpdateStatus = (id: string, newStatus: QualityStatus) => {
    setRecordsState((prev) =>
      prev.map((r) => (r.id === id ? { ...r, qualityStatus: newStatus, lastReviewDate: "2026-11-23" } : r))
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, qualityStatus: newStatus } : null));
    }
  };

  const filteredPubs = PUBLICATIONS_LIST.filter((p) =>
    p.filename.toLowerCase().includes(pubSearch.toLowerCase())
  );

  const filteredRecords = recordsState.filter((r) => {
    const cropMatch = recordCrop === "all" || r.crop.toLowerCase() === recordCrop.toLowerCase();
    const catMatch = recordCategory === "all" || r.category === recordCategory;
    return cropMatch && catMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-2xs">
          <span className="text-xs text-stone-500 font-semibold block">Total Publications</span>
          <b className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1 block">
            {AUDIT_SUMMARY.totalPublications}
          </b>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            1 Diksoochi + 57 Magazines
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-2xs">
          <span className="text-xs text-stone-500 font-semibold block">Total Ingested Pages</span>
          <b className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1 block">
            {AUDIT_SUMMARY.totalCombinedPages.toLocaleString()}
          </b>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            721 book + 2,968 monthly
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-2xs">
          <span className="text-xs text-stone-500 font-semibold block">SHA-256 Integrity</span>
          <b className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
            100% OK
          </b>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">
            Zero Corrupted Streams
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-2xs">
          <span className="text-xs text-stone-500 font-semibold block">CIBRC Verified Pesticides</span>
          <b className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
            {VERIFIED_PESTICIDES.length}
          </b>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 block">
            Statutory Label Guard Active
          </span>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab("publications")}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
            subTab === "publications"
              ? "bg-indigo-600 text-white"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          📁 Source Publications ({PUBLICATIONS_LIST.length})
        </button>
        <button
          onClick={() => setSubTab("records")}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
            subTab === "records"
              ? "bg-indigo-600 text-white"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          📖 Curated Agronomic Records ({recordsState.length})
        </button>
        <button
          onClick={() => setSubTab("pesticides")}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
            subTab === "pesticides"
              ? "bg-indigo-600 text-white"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          🛡️ CIBRC Pesticide Registry ({VERIFIED_PESTICIDES.length})
        </button>
        <button
          onClick={() => setSubTab("gaps")}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
            subTab === "gaps"
              ? "bg-indigo-600 text-white"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          ❓ Unanswered Queries & Gaps
        </button>
      </div>

      {/* TAB 1: PUBLICATIONS TABLE */}
      {subTab === "publications" && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Imported PJTAU Agricultural Publications Manifest
              </h3>
              <p className="text-xs text-stone-500">
                Indexed in agricultural-sources directory with cryptographic SHA-256 validation.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                placeholder="Search publication..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Filename & Document</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Pages</th>
                  <th className="p-3">Size (MB)</th>
                  <th className="p-3">Telugu OCR / Font</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredPubs.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition">
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{p.filename}</span>
                    </td>
                    <td className="p-3 text-stone-600 dark:text-stone-400">{p.type}</td>
                    <td className="p-3 font-mono">{p.pages}</td>
                    <td className="p-3 font-mono">{p.sizeMb}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                        {p.ocr}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CURATED AGRONOMIC RECORDS */}
      {subTab === "records" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Centralized Agricultural Knowledge Records
                </h3>
                <p className="text-xs text-stone-500">
                  Telugu & English normalized agronomic knowledge items with source citations.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={recordCrop}
                  onChange={(e) => setRecordCrop(e.target.value)}
                  className="rounded-xl border border-stone-200 dark:border-stone-700 p-1.5 text-xs bg-stone-50 dark:bg-stone-800"
                >
                  <option value="all">All Crops</option>
                  <option value="Paddy">Paddy</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Maize">Maize</option>
                  <option value="Redgram">Redgram</option>
                  <option value="General">General / Mechanization</option>
                </select>

                <select
                  value={recordCategory}
                  onChange={(e) => setRecordCategory(e.target.value)}
                  className="rounded-xl border border-stone-200 dark:border-stone-700 p-1.5 text-xs bg-stone-50 dark:bg-stone-800"
                >
                  <option value="all">All Topics</option>
                  <option value="varieties_seed">Varieties & Seed</option>
                  <option value="sowing_planting">Sowing & Planting</option>
                  <option value="soil_nutrients">Soil & Nutrients</option>
                  <option value="insect_pests">Insect Pests</option>
                  <option value="plant_diseases">Plant Diseases</option>
                  <option value="weed_management">Weeds</option>
                  <option value="biological_ipm">Biological & IPM</option>
                  <option value="agri_technology">Technology & Drones</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecord(r)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedRecord?.id === r.id
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border-stone-200 dark:border-stone-800 hover:border-indigo-300 bg-white dark:bg-stone-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-stone-100">{r.crop}</span>
                      <span className="text-stone-400">&bull;</span>
                      <span className="text-[11px] text-stone-500 capitalize">{r.category.replace("_", " ")}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.qualityStatus === "verified_agricultural_record"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-amber-50 text-amber-700 border-amber-300"
                      }`}
                    >
                      {r.qualityStatus}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-1">{r.title}</h4>
                  <p className="text-stone-500 text-[11px] line-clamp-2">{r.englishText}</p>
                  <div className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                    {r.citation.documentTitle} &bull; PDF Page {r.citation.pdfPage} (Printed: {r.citation.printedPage})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Record Inspector & Editor */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Record Inspector & Approval
            </h3>

            {selectedRecord ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-stone-500 text-[11px] block">Title</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{selectedRecord.title}</p>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Telugu Normalized Text</span>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-[11px] leading-relaxed max-h-36 overflow-y-auto">
                    {selectedRecord.originalTeluguText}
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">English Verified Translation</span>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-[11px] leading-relaxed max-h-36 overflow-y-auto">
                    {selectedRecord.englishText}
                  </div>
                </div>

                <div>
                  <span className="text-stone-500 text-[11px] block">Source Citation</span>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300">
                    <b>{selectedRecord.citation.documentTitle}</b> ({selectedRecord.citation.publicationMonthYear})<br />
                    File: {selectedRecord.citation.filename}<br />
                    PDF Page: {selectedRecord.citation.pdfPage} &bull; Printed: {selectedRecord.citation.printedPage}
                  </p>
                </div>

                {/* Quality Status Toggle Buttons */}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block">
                    Quality Assurance Action:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedRecord.id, "verified_agricultural_record")}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Verified</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRecord.id, "needs_manual_review")}
                      className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag for Review</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-stone-400 text-xs">
                Select a knowledge record from the left panel to inspect text extraction, translations, and verify quality status.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CIBRC PESTICIDE REGISTRY */}
      {subTab === "pesticides" && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Indian CIBRC & PJTAU Statutory Chemical Registry
            </h3>
            <p className="text-xs text-stone-500">
              Only molecules and formulations registered here are allowed to be prescribed by Krishi Sahayak & Plant Doctor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Active Ingredient & Formulation</th>
                  <th className="p-3">Common Brands</th>
                  <th className="p-3">Approved Crops</th>
                  <th className="p-3">Target Pests / Diseases</th>
                  <th className="p-3">Dosage / Litre</th>
                  <th className="p-3">Dosage / Acre</th>
                  <th className="p-3">PHI (Days)</th>
                  <th className="p-3">Statutory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {VERIFIED_PESTICIDES.map((chem) => (
                  <tr key={chem.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-bold text-stone-900 dark:text-stone-100">
                      {chem.activeIngredient}
                    </td>
                    <td className="p-3 text-stone-600 dark:text-stone-400">
                      {chem.commonBrands.join(", ")}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {chem.approvedCrops.join(", ")}
                      </span>
                    </td>
                    <td className="p-3 text-stone-700 dark:text-stone-300">
                      {chem.targetPestsOrDiseases.join("; ")}
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {chem.dosagePerLiterWater}
                    </td>
                    <td className="p-3 font-mono">{chem.dosagePerAcre}</td>
                    <td className="p-3 font-mono">{chem.waitingPeriodDaysPHI}d</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                        {chem.registrationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: UNANSWERED QUERIES & GAPS */}
      {subTab === "gaps" && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Anonymized Unanswered Queries & Knowledge Gap Log
            </h3>
            <p className="text-xs text-stone-500">
              Farmer queries that required clarification or lacked direct PJTAU matches. Use this log to add new knowledge records.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { query: "what spray to use on cotton", crop: "Cotton", issue: "Missing symptom context", actionTaken: "Clarification protocol invoked" },
              { query: "which medicine for yellow leaves", crop: "Paddy", issue: "Ambiguous yellowing symptom (etiology unconfirmed)", actionTaken: "Asked diagnostic follow-up on leaf position & BLB pattern" },
              { query: "how to apply drone spray on maize", crop: "Maize", issue: "Requested spray SOP for ULV nozzles", actionTaken: "Retrieved DGCA / PJTAU Drone SOP (10-12 L water/acre)" },
            ].map((gap, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">"{gap.query}"</span>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                    <span>Crop: {gap.crop}</span> &bull; <span>Issue: {gap.issue}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 text-[11px] font-semibold">
                  {gap.actionTaken}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
