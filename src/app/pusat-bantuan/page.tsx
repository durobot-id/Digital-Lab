"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  FlaskConical,
  Cable,
  Activity,
  Sun,
  Bot,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export default function PusatBantuanPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: "Bagaimana cara menyambungkan kabel pada Lab Kelistrikan?",
      a: "Klik pada salah satu pin terminal bulat (berwarna merah atau biru) di komponen pertama. Pin akan berpendar kuning. Selanjutnya klik pin terminal pada komponen tujuan. Kabel lentur akan otomatis terhubung. Untuk menghapus kabel, cukup klik pada kabel tersebut."
    },
    {
      q: "Mengapa lampu di Lab Kelistrikan tidak menyala padahal kabel sudah tersambung?",
      a: "Pastikan dua hal: pertama, kabel harus membentuk sirkuit melingkar tertutup dari kutub positif (+) baterai melalui beban kembali ke kutub negatif (-). Kedua, pastikan sakelar dalam posisi tertutup (ON)."
    },
    {
      q: "Apakah data hasil eksperimen dan nilai kuis saya akan tersimpan?",
      a: "Ya! Seluruh kemajuan belajar, data titik pengamatan, dan nilai kuis tersimpan secara otomatis dan aman di browser perangkat Anda melalui LocalStorage."
    },
    {
      q: "Bagaimana cara bertanya ke Asisten AI saat bereksperimen?",
      a: "Di setiap halaman laboratorium, klik tombol terapung 'Tanya Asisten Lab' di pojok kanan bawah. Anda dapat memilih pertanyaan cepat seperti 'Jelaskan hasil saat ini' atau mengetik pertanyaan bebas. Asisten akan membaca nilai parameter yang sedang aktif secara live!"
    },
    {
      q: "Apakah laboratorium ini menggantikan praktikum fisik di sekolah?",
      a: "Laboratorium virtual DILSA dirancang sebagai pendamping belajar interaktif untuk mempermudah visualisasi dan pemahaman konsep secara mandiri, tanpa risiko bahaya fisik atau keterbatasan alat di sekolah."
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#DCE6F1]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF0FF] text-[#174A8B] text-xs font-bold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          Pusat Bantuan & Panduan Praktikum
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
          Panduan Penggunaan DILSA
        </h1>
        <p className="text-xs text-[#617187] mt-1">
          Pelajari cara mengoperasikan meja kerja virtual, merakit komponen, dan memaksimalkan bimbingan asisten sains.
        </p>
      </div>

      {/* 3 Step Interactive Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guide 1: Kelistrikan */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4">
              <Cable className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[#172B45] mb-2">
              Merakit Rangkaian Listrik
            </h3>
            <ol className="space-y-2 text-xs text-[#617187] list-decimal list-inside leading-relaxed">
              <li>Tekan tombol tambah baterai, sakelar, atau lampu.</li>
              <li>Seret komponen bebas di atas kisi meja kerja.</li>
              <li>Klik pin terminal untuk menarik kabel penghantar.</li>
              <li>Tutup sakelar dan amati nyala lampu & arus!</li>
            </ol>
          </div>
          <Link
            href="/topics/kelistrikan/lab"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] mt-4 hover:underline"
          >
            Buka Lab Kelistrikan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Guide 2: Gaya & Gerak */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[#172B45] mb-2">
              Menguji Hukum II Newton
            </h3>
            <ol className="space-y-2 text-xs text-[#617187] list-decimal list-inside leading-relaxed">
              <li>Seret balok kereta langsung ke posisi awal yang diinginkan.</li>
              <li>Atur gaya dorong (F), massa benda (m), dan kekasaran lantai.</li>
              <li>Tekan 'Mulai Simulasi' dan amati grafik v-t.</li>
              <li>Tekan 'Catat Titik Data' untuk membuat tabel.</li>
            </ol>
          </div>
          <Link
            href="/topics/gaya-dan-gerak/lab"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] mt-4 hover:underline"
          >
            Buka Lab Gaya & Gerak <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Guide 3: Cahaya & Optik */}
        <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mb-4">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-[#172B45] mb-2">
              Pemantulan Cermin Datar
            </h3>
            <ol className="space-y-2 text-xs text-[#617187] list-decimal list-inside leading-relaxed">
              <li>Seret sumber laser untuk memvariasikan sudut datang (i).</li>
              <li>Nyalakan Busur Derajat untuk memeriksa sudut pantul (r).</li>
              <li>Ganti ke mode objek lilin dan geser jarak benda (s).</li>
              <li>Buktikan bahwa jarak bayangan s' selalu sama dengan s!</li>
            </ol>
          </div>
          <Link
            href="/topics/cahaya-dan-optik/lab"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] mt-4 hover:underline"
          >
            Buka Lab Optik <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs p-6 sm:p-8">
        <h3 className="text-lg font-extrabold text-[#172B45] mb-2">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h3>
        <p className="text-xs text-[#617187] mb-6">
          Jawaban cepat untuk pertanyaan teknis dan cara penggunaan platform DILSA.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#DCE6F1] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] hover:bg-[#F3F8FF] text-left transition-colors"
                >
                  <span className="font-bold text-xs text-[#172B45]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#2583E8] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#617187] shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-[#617187] leading-relaxed bg-white border-t border-[#DCE6F1]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div className="bg-[#EBF5FF] rounded-3xl border border-[#2583E8]/30 p-6 flex items-start gap-4 text-xs text-[#174A8B]">
        <ShieldCheck className="w-6 h-6 text-[#2583E8] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-1">Catatan Keselamatan Eksperimen Nyata</h4>
          <p className="leading-relaxed text-[#1E3A53]">
            Simulasi kelistrikan di platform DILSA menggunakan model arus ideal DC tegangan rendah. Di laboratorium fisik nyata, jangan pernah menyambung kutub baterai langsung tanpa resistor/lampu (korsleting) dan hindari menyentuh sumber tegangan tinggi AC rumah tangga.
          </p>
        </div>
      </div>
    </div>
  );
}
