"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TOPICS } from "@/data/topics";
import {
  getStoredProgress,
  getUserProfile,
  UserProfile
} from "@/lib/storage";
import { UserOverallProgress } from "@/types";
import {
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
  BookOpen,
  FlaskConical,
  Flame,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function LaporanBelajarPage() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [progress, setProgress] = useState<UserOverallProgress>({});

  useEffect(() => {
    setProfile(getUserProfile());
    setProgress(getStoredProgress());

    const handleUpdate = () => {
      setProfile(getUserProfile());
      setProgress(getStoredProgress());
    };
    window.addEventListener("dilsa_storage_updated", handleUpdate);
    window.addEventListener("dilsa_profile_updated", handleUpdate);
    return () => {
      window.removeEventListener("dilsa_storage_updated", handleUpdate);
      window.removeEventListener("dilsa_profile_updated", handleUpdate);
    };
  }, []);

  // Compute stats
  let totalQuizzesTaken = 0;
  let totalScoreSum = 0;
  let completedLabsCount = 0;

  TOPICS.forEach((t) => {
    const p = progress[t.slug];
    if (p?.labCompleted) completedLabsCount++;
    if (p?.quizPercentage !== undefined) {
      totalQuizzesTaken++;
      totalScoreSum += p.quizPercentage;
    }
  });

  const averageScore = totalQuizzesTaken > 0 ? Math.round(totalScoreSum / totalQuizzesTaken) : 0;
  const overallPercentage = Math.round(
    ((completedLabsCount + totalQuizzesTaken) / (TOPICS.length * 2)) * 100
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE6F1]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Laporan Evaluasi & Kemajuan Belajar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
            Laporan Hasil Belajar Sains
          </h1>
          <p className="text-xs text-[#617187] mt-1">
            Pantau capaian eksperimen virtual, pemahaman materi, dan hasil kuis mandiri siswa.
          </p>
        </div>

        {/* Print / Export Action */}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DCE6F1] text-xs font-bold text-[#172B45] hover:bg-[#F3F8FF] transition-all shadow-2xs self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-[#2583E8]" />
          <span>Cetak Laporan</span>
        </button>
      </div>

      {/* Student Identity Card */}
      <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#174A8B] text-[#48CAE4] flex items-center justify-center font-extrabold text-xl shadow-xs">
            {profile.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#172B45]">
                {profile.name}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DDF0FF] text-[#174A8B]">
                {profile.classGrade}
              </span>
            </div>
            <p className="text-xs text-[#617187] mt-0.5">{profile.school}</p>
            <p className="text-[11px] text-[#2583E8] font-medium mt-1 italic">
              "{profile.bio}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#617187] font-semibold block uppercase">
              Tingkat Penguasaan
            </span>
            <span className="text-xl font-extrabold text-[#23845B] font-mono">
              {overallPercentage}%
            </span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#23845B]/10 border border-[#23845B]/20 flex items-center justify-center text-[#23845B]">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* 4 Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-[#2583E8]">
            <FlaskConical className="w-5 h-5" />
            <span className="text-xs font-bold text-[#172B45]">Lab Selesai</span>
          </div>
          <span className="text-2xl font-extrabold text-[#174A8B] font-mono">
            {completedLabsCount} <span className="text-sm font-normal text-[#617187]">/ {TOPICS.length}</span>
          </span>
          <p className="text-[11px] text-[#617187] mt-1">Eksperimen virtual teruji</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-[#D97706]">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold text-[#172B45]">Rata-Rata Kuis</span>
          </div>
          <span className="text-2xl font-extrabold text-[#D97706] font-mono">
            {averageScore}%
          </span>
          <p className="text-[11px] text-[#617187] mt-1">Dari {totalQuizzesTaken} modul evaluasi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-[#16A34A]">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold text-[#172B45]">Total Jam Belajar</span>
          </div>
          <span className="text-2xl font-extrabold text-[#16A34A] font-mono">
            {profile.learningHours} <span className="text-sm font-normal text-[#617187]">Jam</span>
          </span>
          <p className="text-[11px] text-[#617187] mt-1">Waktu interaksi simulasi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs">
          <div className="flex items-center gap-2 mb-2 text-[#EF4444]">
            <Flame className="w-5 h-5 fill-[#EF4444]" />
            <span className="text-xs font-bold text-[#172B45]">Runtutan Belajar</span>
          </div>
          <span className="text-2xl font-extrabold text-[#EF4444] font-mono">
            {profile.streakDays} <span className="text-sm font-normal text-[#617187]">Hari</span>
          </span>
          <p className="text-[11px] text-[#617187] mt-1">Konsistensi belajar harian</p>
        </div>
      </div>

      {/* Module Breakdown Table */}
      <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6">
        <h3 className="text-base font-bold text-[#172B45] mb-4">
          Rincian Capaian per Tema Modul
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#174A8B] border-b border-[#DCE6F1]">
                <th className="p-3 font-semibold">Tema Eksperimen</th>
                <th className="p-3 font-semibold text-center">Status Teori</th>
                <th className="p-3 font-semibold text-center">Laboratorium 2D</th>
                <th className="p-3 font-semibold text-center">Nilai Kuis</th>
                <th className="p-3 font-semibold text-center">Kategori</th>
                <th className="p-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6F1]">
              {TOPICS.map((topic) => {
                const p = progress[topic.slug];
                const isLabDone = p?.labCompleted;
                const score = p?.quizPercentage;

                let categoryLabel = "Belum Dievaluasi";
                let categoryColor = "bg-slate-100 text-[#617187]";
                if (score !== undefined) {
                  if (score >= 80) {
                    categoryLabel = "Memahami dengan Baik";
                    categoryColor = "bg-green-100 text-green-800";
                  } else if (score >= 60) {
                    categoryLabel = "Cukup Memahami";
                    categoryColor = "bg-amber-100 text-amber-800";
                  } else {
                    categoryLabel = "Perlu Ditinjau";
                    categoryColor = "bg-blue-100 text-blue-800";
                  }
                }

                return (
                  <tr key={topic.id} className="hover:bg-[#F8FAFC]/80">
                    <td className="p-3">
                      <div className="font-bold text-[#172B45]">{topic.title}</div>
                      <span className="text-[10px] text-[#617187]">{topic.badge}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#23845B]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {isLabDone ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#23845B]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Teruji
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#617187]">Belum Diuji</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-sm">
                      {score !== undefined ? `${score}%` : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${categoryColor}`}>
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/topics/${topic.slug}/lab`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2583E8] hover:underline"
                      >
                        Buka Lab
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remedial & AI Study Recommendations */}
      <div className="bg-[#FFF8E7] rounded-3xl border border-[#FFD45A]/60 p-6 flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#A96508]">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm">Rekomendasi Bimbingan Belajar</h3>
          </div>
          <p className="text-xs text-[#172B45] leading-relaxed max-w-2xl mb-3">
            Berdasarkan riwayat kuis, pemahaman konsep <strong>"Penentuan Sudut terhadap Garis Normal"</strong> pada cermin datar dapat diperdalam lagi dengan mengaktifkan Busur Derajat di Lab Optik.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/topics/cahaya-dan-optik/lab"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174A8B] text-white text-xs font-bold hover:bg-[#12396d] shadow-xs"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Latihan Ulang di Lab Optik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
