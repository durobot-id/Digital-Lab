"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TOPICS } from "@/data/topics";
import LabCard from "@/components/topic/LabCard";
import {
  getUserProfile,
  getStoredProgress,
  DEFAULT_PROFILE,
  DEFAULT_PROGRESS,
  UserProfile
} from "@/lib/storage";
import { UserOverallProgress } from "@/types";
import {
  Flame,
  Play,
  FlaskConical,
  Award,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [progress, setProgress] = useState<UserOverallProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    setProfile(getUserProfile());
    setProgress(getStoredProgress());
    const handleUpdate = () => {
      setProfile(getUserProfile());
      setProgress(getStoredProgress());
    };
    window.addEventListener("dilsa_profile_updated", handleUpdate);
    window.addEventListener("dilsa_storage_updated", handleUpdate);
    return () => {
      window.removeEventListener("dilsa_profile_updated", handleUpdate);
      window.removeEventListener("dilsa_storage_updated", handleUpdate);
    };
  }, []);

  const filteredTopics = TOPICS.filter((t) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Mekanika") return t.slug === "gaya-dan-gerak";
    if (activeFilter === "Kelistrikan") return t.slug === "kelistrikan";
    if (activeFilter === "Optik") return t.slug === "cahaya-dan-optik";
    return true;
  });

  // Calculate live completed labs
  let completedLabsCount = 0;
  TOPICS.forEach((t) => {
    if (progress[t.slug]?.labCompleted) completedLabsCount++;
  });
  const labPercent = Math.round((completedLabsCount / TOPICS.length) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Greeting Header Row matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#1E3A53] tracking-widest uppercase block mb-1">
            Selamat Datang Kembali
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight" suppressHydrationWarning>
            Halo, {profile.name}! Siap bereksperimen?
          </h2>
          <p className="text-xs text-[#617187] mt-1">
            Temukan hal baru dan jadilah ilmuwan hebat hari ini.
          </p>
        </div>

        {/* Learning Streak Pill matching screenshot */}
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#DCE6F1] shadow-2xs hover:bg-[#F3F8FF] transition-all self-start sm:self-auto"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFF4C7] text-[#D97706] flex items-center justify-center">
            <Flame className="w-5 h-5 fill-[#D97706]" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-[#172B45] block leading-tight" suppressHydrationWarning>
              {profile.streakDays} Hari
            </span>
            <span className="text-[10px] text-[#617187] leading-none">
              Runtutan belajar
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Big Green/Teal Hero Banner Card matching screenshot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#175C4C] via-[#1C6957] to-[#257A66] text-white p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-xl z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#E6F4EA] text-[11px] font-bold uppercase tracking-wider mb-4 border border-white/20">
            <FlaskConical className="w-3.5 h-3.5 text-[#FFD45A]" />
            Pilihan Minggu Ini
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Jelajahi Dunia Sains Tanpa Batas!
          </h3>
          <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed mb-6 max-w-md">
            Lakukan eksperimen seru dengan aman, interaktif, dan menyenangkan dari mana saja bersama Laboratorium Virtual DILSA.
          </p>
          <Link
            href="/topics/kelistrikan/lab"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs text-[#172B45] bg-[#FFD45A] hover:bg-[#ffe082] transition-all shadow-md hover:scale-105"
          >
            <Play className="w-4 h-4 fill-[#172B45]" />
            Mulai Eksperimen
          </Link>
        </div>

        {/* Right Illustration Vector matching screenshot */}
        <div className="relative shrink-0 w-64 sm:w-72 h-48 flex items-center justify-center">
          <svg viewBox="0 0 280 200" className="w-full h-full drop-shadow-md">
            {/* Desk table */}
            <rect x="20" y="140" width="240" height="12" rx="4" fill="#E2A96D" />
            <rect x="40" y="152" width="16" height="40" fill="#C98B50" />
            <rect x="224" y="152" width="16" height="40" fill="#C98B50" />

            {/* Laptop */}
            <polygon points="90,140 170,140 162,110 98,110" fill="#E2E8F0" />
            <rect x="100" y="70" width="60" height="42" rx="3" fill="#1E293B" />
            <rect x="104" y="74" width="52" height="34" rx="2" fill="#38BDF8" />

            {/* Student character */}
            <circle cx="130" cy="50" r="16" fill="#FCD34D" />
            <path d="M 118 42 Q 130 32 142 42 Q 140 34 126 36 Z" fill="#92400E" />
            <path d="M 112 85 C 112 66 148 66 148 85 Z" fill="#0284C7" />

            {/* Scientific Chart Screen */}
            <rect x="35" y="75" width="46" height="55" rx="4" fill="#FFFFFF" />
            <rect x="42" y="105" width="6" height="18" fill="#10B981" />
            <rect x="52" y="95" width="6" height="28" fill="#0EA5E9" />
            <rect x="62" y="85" width="6" height="38" fill="#F59E0B" />

            {/* Floating Checkmark Badge */}
            <circle cx="215" cy="65" r="14" fill="#FBBF24" />
            <path d="M 210 65 L 214 69 L 221 61" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* Chemical Test Tube Rack */}
            <rect x="195" y="95" width="8" height="45" rx="4" fill="#60A5FA" />
            <rect x="210" y="85" width="8" height="55" rx="4" fill="#34D399" />
          </svg>
        </div>
      </div>

      {/* 3. Progres Belajarmu Section matching screenshot */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#172B45]">
              Progres Belajarmu
            </h3>
            <p className="text-xs text-[#617187]">
              Teruskan semangat belajarmu, {profile.name}!
            </p>
          </div>
          <Link
            href="/laporan-belajar"
            className="text-xs font-bold text-[#174A8B] hover:text-[#2583E8] flex items-center gap-1"
          >
            Lihat Laporan Lengkap
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Eksperimen Selesai */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#617187] font-medium block">
                    Eksperimen Selesai
                  </span>
                  <span className="text-base font-extrabold text-[#172B45] font-mono" suppressHydrationWarning>
                    {completedLabsCount} <span className="text-xs text-[#8AA2BA]">/ {TOPICS.length}</span>
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full" suppressHydrationWarning>
                {labPercent}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#0284C7] rounded-full transition-all duration-500" style={{ width: `${labPercent}%` }} />
            </div>
          </div>

          {/* Card 2: Lencana Diperoleh */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#617187] font-medium block">
                    Lencana Terbuka
                  </span>
                  <span className="text-base font-extrabold text-[#172B45] font-mono" suppressHydrationWarning>
                    {profile.badges.filter(b => b.unlocked).length} <span className="text-xs text-[#8AA2BA]">/ {profile.badges.length}</span>
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full" suppressHydrationWarning>
                {Math.round((profile.badges.filter(b => b.unlocked).length / profile.badges.length) * 100)}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                style={{ width: `${Math.round((profile.badges.filter(b => b.unlocked).length / profile.badges.length) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 3: Waktu Belajar */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#617187] font-medium block">
                    Waktu Belajar
                  </span>
                  <span className="text-base font-extrabold text-[#172B45] font-mono" suppressHydrationWarning>
                    {profile.learningHours} <span className="text-xs text-[#8AA2BA]">Jam</span>
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full" suppressHydrationWarning>
                {profile.streakDays} Hari Streak
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#16A34A] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((profile.learningHours / 10) * 100))}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Eksperimen Populer Section matching screenshot */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#172B45]">
              Eksperimen Populer
            </h3>
            <p className="text-xs text-[#617187]">
              Eksperimen pilihan yang paling banyak dicoba siswa.
            </p>
          </div>

          <Link
            href="/topics"
            className="text-xs font-bold text-[#174A8B] hover:text-[#2583E8] flex items-center gap-1 self-start sm:self-auto"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Tabs & Filter Action matching screenshot */}
        <div className="flex items-center justify-between gap-3 mb-6 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            {["Semua", "Kelistrikan", "Mekanika", "Optik"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab
                    ? "bg-[#1E3A53] text-white shadow-xs"
                    : "bg-white text-[#617187] hover:bg-[#F3F8FF] hover:text-[#172B45] border border-[#DCE6F1]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveFilter("Semua")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DCE6F1] text-xs font-semibold text-[#617187] hover:bg-[#F3F8FF] shrink-0"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Grid of Lab Cards with Pastel Flask Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => {
            const colors: ("blue" | "purple" | "green" | "orange")[] = [
              "blue",
              "purple",
              "green"
            ];
            const colorScheme = colors[idx % colors.length];

            return <LabCard key={topic.id} topic={topic} colorScheme={colorScheme} />;
          })}
        </div>
      </div>
    </div>
  );
}
