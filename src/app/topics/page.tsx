import React from "react";
import { TOPICS } from "@/data/topics";
import TopicCard from "@/components/topic/TopicCard";
import { FlaskConical, Filter, Clock, GraduationCap } from "lucide-react";

export default function TopicsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-[#DCE6F1]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF0FF] text-[#174A8B] text-xs font-semibold mb-3">
          <FlaskConical className="w-3.5 h-3.5" />
          Katalog Modul IPA Terpadu
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172B45] tracking-tight">
          Katalog Tema Laboratorium
        </h1>
        <p className="text-xs sm:text-sm text-[#617187] mt-1 max-w-2xl">
          Pilih salah satu tema di bawah ini untuk memulai rangkaian belajar: Materi formal, Simulasi laboratorium 2D interaktif, bimbingan AI kontekstual, dan Kuis evaluasi.
        </p>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F1] text-[#172B45] font-medium">
            <GraduationCap className="w-4 h-4 text-[#2583E8]" />
            <span>Jenjang: Kelas VII – IX SMP/MTs</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F1] text-[#172B45] font-medium">
            <Clock className="w-4 h-4 text-[#174A8B]" />
            <span>Durasi: 25 – 30 Menit / Tema</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F1] text-[#172B45] font-medium">
            <FlaskConical className="w-4 h-4 text-[#23845B]" />
            <span>3 Modul Eksperimen Virtual 2D</span>
          </div>
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
