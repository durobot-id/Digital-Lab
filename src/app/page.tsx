import React from "react";
import Link from "next/link";
import { TOPICS } from "@/data/topics";
import TopicCard from "@/components/topic/TopicCard";
import {
  Atom,
  FlaskConical,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Compact Clean Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-8 md:pt-12 md:pb-10 border-b border-[#DCE6F1] bg-gradient-to-b from-[#DDF0FF]/60 via-[#F3F8FF] to-[#F3F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Small Clean Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DCE6F1] shadow-2xs mb-4 text-xs font-semibold text-[#174A8B]">
            <Atom className="w-4 h-4 text-[#2583E8]" />
            <span>Laboratorium Sains Virtual SMP/MTs</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172B45] tracking-tight mb-2">
            Pilih Modul & Eksplorasi Eksperimen
          </h1>

          {/* Clean 1-sentence Subtitle */}
          <p className="text-xs sm:text-sm text-[#617187] max-w-xl mx-auto mb-4">
            Rakit komponen, geser parameter fisika, dan diskusikan hasil simulasi bersama Asisten AI.
          </p>

          {/* Quick Feature Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#DCE6F1] text-[#172B45] font-medium">
              <FlaskConical className="w-3.5 h-3.5 text-[#2583E8]" />
              Simulasi 2D Interaktif
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#DCE6F1] text-[#172B45] font-medium">
              <Cpu className="w-3.5 h-3.5 text-[#A96508]" />
              Asisten Gemini AI Live
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#DCE6F1] text-[#172B45] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#23845B]" />
              Fisika Deterministik Riil
            </span>
          </div>
        </div>
      </section>

      {/* Direct Topic Selection Grid (Immediate Focus on Home) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B45]">
              Tema Eksperimen Utama
            </h2>
            <p className="text-xs text-[#617187]">
              Klik tombol masuk laboratorium untuk langsung merakit atau menguji.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}
