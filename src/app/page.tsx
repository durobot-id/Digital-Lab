import React from "react";
import Link from "next/link";
import { TOPICS } from "@/data/topics";
import TopicCard from "@/components/topic/TopicCard";
import {
  Atom,
  FlaskConical,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#DCE6F1] bg-gradient-to-b from-[#DDF0FF]/60 via-[#F3F8FF] to-[#F3F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DCE6F1] shadow-2xs mb-6 text-xs font-semibold text-[#174A8B]">
            <Atom className="w-4 h-4 text-[#2583E8]" />
            <span>Laboratorium Sains Virtual SMP/MTs Berbimbingan AI</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#172B45] tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Eksplorasi Konsep IPA Nyata Lewat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2583E8] to-[#174A8B]">
              Laboratorium Virtual 2D
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-[#617187] max-w-2xl mx-auto leading-relaxed mb-8">
            DILSA membantu siswa memahami sains melalui eksperimen interaktif, memanipulasi variabel, mengamati data kalkulasi deterministik, serta berdiskusi dengan asisten lab cerdas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#2583E8] hover:bg-[#1f6fc7] shadow-md hover:shadow-lg transition-all"
            >
              Mulai Eksperimen Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/topics/gaya-dan-gerak"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#174A8B] bg-white hover:bg-[#DDF0FF] border border-[#DCE6F1] transition-all"
            >
              <FlaskConical className="w-4 h-4 text-[#2583E8]" />
              Coba Lab Gaya & Gerak
            </Link>
          </div>

          {/* Disclaimer Banner */}
          <div className="mt-10 inline-flex items-center gap-2 text-xs text-[#617187] bg-white/80 px-4 py-2 rounded-xl border border-[#DCE6F1]">
            <ShieldCheck className="w-4 h-4 text-[#23845B]" />
            <span>
              Laboratorium virtual dengan perhitungan deterministik resmi. Tidak memerlukan perangkat spesifikasi tinggi.
            </span>
          </div>
        </div>
      </section>

      {/* Alur Belajar 4 Langkah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#2583E8] uppercase tracking-wider">
            Alur Terstruktur
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] mt-1">
            4 Langkah Pembelajaran Mandiri
          </h2>
          <p className="text-xs sm:text-sm text-[#617187] mt-2 max-w-xl mx-auto">
            Setiap tema didesain dengan urutan terarah agar pemahaman konsep terbentuk secara alami dan mendalam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#F3F8FF] text-[#2583E8] flex items-center justify-center font-bold text-sm mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#174A8B] uppercase">Langkah 1</span>
            <h3 className="font-bold text-sm text-[#172B45] mt-1 mb-2">Pelajari Materi Formal</h3>
            <p className="text-xs text-[#617187] leading-relaxed">
              Pahami definisi ilmiah, besaran, satuan, dan rumus inti yang ditata sesuai kurikulum SMP/MTs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#DDF0FF] text-[#174A8B] flex items-center justify-center font-bold text-sm mb-4">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#174A8B] uppercase">Langkah 2</span>
            <h3 className="font-bold text-sm text-[#172B45] mt-1 mb-2">Jalankan Laboratorium 2D</h3>
            <p className="text-xs text-[#617187] leading-relaxed">
              Ubah gaya, massa, tegangan, atau sudut sinar. Amati respons visual dan catat tabel data pengamatan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4C7] text-[#A96508] flex items-center justify-center font-bold text-sm mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#174A8B] uppercase">Langkah 3</span>
            <h3 className="font-bold text-sm text-[#172B45] mt-1 mb-2">Bimbingan Asisten AI</h3>
            <p className="text-xs text-[#617187] leading-relaxed">
              Asisten AI memantau nilai laboratorium secara live untuk memberi arahan sokratik tanpa membocorkan jawaban.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-[#DCE6F1] shadow-2xs relative">
            <div className="w-10 h-10 rounded-xl bg-[#23845B]/10 text-[#23845B] flex items-center justify-center font-bold text-sm mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#174A8B] uppercase">Langkah 4</span>
            <h3 className="font-bold text-sm text-[#172B45] mt-1 mb-2">Kuis & Umpan Balik</h3>
            <p className="text-xs text-[#617187] leading-relaxed">
              Uji pemahaman lewat soal prediksi dan kalkulasi dengan ulasan ilmiah per pertanyaan.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Tema Eksperimen Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#2583E8] uppercase tracking-wider">
              Modul Eksperimen Tersedia
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] mt-1">
              Pilih Tema Laboratorium IPA
            </h2>
            <p className="text-xs sm:text-sm text-[#617187] mt-1">
              Tiga tema unggulan fisika mekanika, kelistrikan, dan optik cahaya.
            </p>
          </div>

          <Link
            href="/topics"
            className="text-xs font-bold text-[#2583E8] hover:text-[#174A8B] flex items-center gap-1 shrink-0"
          >
            Lihat Semua Detail Tema
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
