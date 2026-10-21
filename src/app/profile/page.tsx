"use client";

import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  saveUserProfile,
  UserProfile
} from "@/lib/storage";
import {
  User,
  Award,
  Save,
  CheckCircle2,
  Flame,
  Clock,
  Sparkles,
  School,
  GraduationCap
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#DCE6F1]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF0FF] text-[#174A8B] text-xs font-bold mb-2">
          <User className="w-3.5 h-3.5" />
          Profil Siswa & Pencapaian
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
          Profil Pembelajar Sains
        </h1>
        <p className="text-xs text-[#617187] mt-1">
          Kelola identitas, jenjang kelas, dan pantau lencana penghargaan yang telah diraih.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#174A8B] to-[#2583E8] text-[#FFD45A] flex items-center justify-center font-extrabold text-3xl shadow-md mb-4">
            {profile.avatarInitials}
          </div>
          <h2 className="text-lg font-extrabold text-[#172B45]">{profile.name}</h2>
          <p className="text-xs text-[#617187] mt-0.5">{profile.classGrade}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#EBF5FF] text-[#1E40AF] text-[11px] font-bold">
            {profile.school}
          </span>

          <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#F1F5F9]">
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#DCE6F1] text-center">
              <span className="text-[10px] text-[#617187] font-medium block">Streak</span>
              <span className="text-base font-extrabold text-[#EF4444] font-mono flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-[#EF4444]" />
                {profile.streakDays} Hari
              </span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#DCE6F1] text-center">
              <span className="text-[10px] text-[#617187] font-medium block">Jam Belajar</span>
              <span className="text-base font-extrabold text-[#16A34A] font-mono flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {profile.learningHours} Jam
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Form & Achievements */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Form */}
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 space-y-4">
            <h3 className="text-base font-bold text-[#172B45] flex items-center gap-2">
              <User className="w-4 h-4 text-[#2583E8]" />
              Data Diri Siswa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#172B45] block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const inits = val
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "S";
                    setProfile((prev) => ({ ...prev, name: val, avatarInitials: inits }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6F1] text-xs text-[#172B45] focus:outline-none focus:border-[#2583E8] bg-[#F8FAFC] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172B45] block mb-1">
                  Tingkat Kelas
                </label>
                <input
                  type="text"
                  value={profile.classGrade}
                  onChange={(e) => setProfile((prev) => ({ ...prev, classGrade: e.target.value }))}
                  placeholder="Contoh: Kelas VIII-A SMP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6F1] text-xs text-[#172B45] focus:outline-none focus:border-[#2583E8] bg-[#F8FAFC] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172B45] block mb-1">
                  Asal Sekolah / Madrasah
                </label>
                <input
                  type="text"
                  value={profile.school}
                  onChange={(e) => setProfile((prev) => ({ ...prev, school: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6F1] text-xs text-[#172B45] focus:outline-none focus:border-[#2583E8] bg-[#F8FAFC] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172B45] block mb-1">
                  Inisial Avatar
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={profile.avatarInitials}
                  onChange={(e) => setProfile((prev) => ({ ...prev, avatarInitials: e.target.value.toUpperCase() }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6F1] text-xs text-[#172B45] font-mono focus:outline-none focus:border-[#2583E8] bg-[#F8FAFC] focus:bg-white transition-all uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#172B45] block mb-1">
                  Catatan Motivasi / Bio Singkat
                </label>
                <input
                  type="text"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6F1] text-xs text-[#172B45] focus:outline-none focus:border-[#2583E8] bg-[#F8FAFC] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              {isSaved ? (
                <span className="text-xs font-bold text-[#23845B] flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  Profil berhasil diperbarui dan tersinkronisasi!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2583E8] hover:bg-[#1f6fc7] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </form>

          {/* Badges Collection */}
          <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6">
            <h3 className="text-base font-bold text-[#172B45] flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#D97706]" />
              Koleksi Lencana Penghargaan Sains
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                    b.unlocked
                      ? "bg-[#FEF3C7]/40 border-[#FBBF24]/50"
                      : "bg-[#F8FAFC] border-[#E2E8F0] opacity-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      b.unlocked
                        ? "bg-[#FFD45A] text-[#172B45] shadow-xs"
                        : "bg-[#CBD5E1] text-[#64748B]"
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#172B45]">{b.title}</span>
                      {b.unlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#23845B]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#617187] mt-0.5 leading-snug">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
