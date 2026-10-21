"use client";

import React, { useState, useEffect } from "react";
import {
  getUserSettings,
  saveUserSettings,
  resetAllData,
  UserSettings
} from "@/lib/storage";
import {
  Settings,
  Volume2,
  VolumeX,
  Cpu,
  Zap,
  RotateCcw,
  Save,
  CheckCircle2,
  ShieldCheck,
  Download,
  Upload
} from "lucide-react";
import { playClickSound, playSuccessChime } from "@/lib/audio";

export default function PengaturanPage() {
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSettings(getUserSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserSettings(settings);
    if (settings.soundEnabled) {
      playSuccessChime();
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetData = () => {
    if (confirm("Apakah Anda yakin ingin mereset seluruh data progres belajar dan skor kuis?")) {
      resetAllData();
      alert("Seluruh data lokal berhasil dibersihkan.");
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#DCE6F1]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF0FF] text-[#174A8B] text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          Preferensi Aplikasi & Laboratorium
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
          Pengaturan DILSA
        </h1>
        <p className="text-xs text-[#617187] mt-1">
          Atur kenyamanan interaksi simulasi, gaya bimbingan asisten AI, dan kelola data lokal.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Audio & Tactile Feedback */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6">
          <h3 className="text-sm font-bold text-[#172B45] flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-[#2583E8]" />
            Efek Suara & Respon Audio Laboratorium
          </h3>
          <p className="text-xs text-[#617187] mb-4">
            Memberikan umpan balik suara klik saat menyambung kabel, menekan sakelar, atau menjawab kuis.
          </p>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#DCE6F1]">
            <span className="text-xs font-semibold text-[#172B45]">
              Aktifkan Efek Suara Simulasi
            </span>
            <button
              type="button"
              onClick={() => {
                const next = !settings.soundEnabled;
                setSettings((prev) => ({ ...prev, soundEnabled: next }));
                if (next) playClickSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? "bg-[#2583E8]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.soundEnabled ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* AI Guidance Style */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6">
          <h3 className="text-sm font-bold text-[#172B45] flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[#A96508]" />
            Gaya Bimbingan Asisten AI DILSA
          </h3>
          <p className="text-xs text-[#617187] mb-4">
            Pilih cara asisten laboratorium merespons pertanyaan saat simulasi berlangsung.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "socratic",
                title: "Metode Sokratik",
                desc: "Membimbing dengan pertanyaan pemantik dan prediksi mandiri."
              },
              {
                id: "direct",
                title: "Petunjuk Praktis",
                desc: "Fokus pada langkah tindakan berikutnya di meja eksperimen."
              },
              {
                id: "detailed",
                title: "Penjelasan Lengkap",
                desc: "Ulasan mendalam mengaitkan data dengan rumus teori formal."
              }
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, aiPromptStyle: style.id as any }))}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  settings.aiPromptStyle === style.id
                    ? "bg-[#F3F8FF] border-[#2583E8] ring-2 ring-[#2583E8]"
                    : "bg-white border-[#DCE6F1] hover:bg-[#F8FAFC]"
                }`}
              >
                <span className="font-bold text-xs text-[#172B45] block mb-1">
                  {style.title}
                </span>
                <p className="text-[11px] text-[#617187] leading-relaxed">
                  {style.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Gemini API Key Override */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6">
          <h3 className="text-sm font-bold text-[#172B45] flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#23845B]" />
            Kunci API Gemini Kustom (Opsional)
          </h3>
          <p className="text-xs text-[#617187] mb-3">
            Secara default aplikasi telah terhubung ke model Gemini 3.8 Flash. Anda juga dapat menggunakan kunci API pribadi jika diperlukan.
          </p>
          <input
            type="password"
            value={settings.customApiKey}
            onChange={(e) => setSettings((prev) => ({ ...prev, customApiKey: e.target.value }))}
            placeholder="Masukkan token / API key jika ingin mengganti default..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6F1] text-xs font-mono text-[#172B45] focus:outline-none focus:border-[#2583E8] bg-[#F8FAFC] focus:bg-white transition-all"
          />
        </div>

        {/* Submit & Reset Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-[#C43D4B] bg-white hover:bg-red-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data Belajar
          </button>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs font-bold text-[#23845B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Pengaturan tersimpan!
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2583E8] hover:bg-[#1f6fc7] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Save className="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
