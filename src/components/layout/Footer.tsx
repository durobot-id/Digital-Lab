"use client";

import React from "react";
import Link from "next/link";
import { Atom, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#DCE6F1] py-10 mt-auto text-xs text-[#617187]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#174A8B] flex items-center justify-center text-white">
                <Atom className="w-4 h-4 text-[#FFD45A]" />
              </div>
              <span className="font-bold text-sm text-[#174A8B]">
                DILSA — Digital Laboratorium Science AI
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md text-[#617187]">
              Platform laboratorium virtual dan asisten sains cerdas untuk siswa SMP/MTs (kelas VII–IX). Menggabungkan materi formal kurikulum, simulasi 2D interaktif, bimbingan AI kontekstual, dan kuis evaluasi.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#23845B] font-medium bg-[#23845B]/5 px-3 py-1.5 rounded-lg border border-[#23845B]/20 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Simulasi berbasis kalkulasi fisika matematika deterministik resmi.</span>
            </div>
          </div>

          {/* Tema Eksperimen */}
          <div>
            <h4 className="font-bold text-xs text-[#172B45] uppercase tracking-wider mb-3">
              Tema Eksperimen
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/topics/gaya-dan-gerak" className="hover:text-[#2583E8] transition-colors">
                  Gaya dan Gerak (Hukum II Newton)
                </Link>
              </li>
              <li>
                <Link href="/topics/kelistrikan" className="hover:text-[#2583E8] transition-colors">
                  Rangkaian Listrik Sederhana (Hukum Ohm)
                </Link>
              </li>
              <li>
                <Link href="/topics/cahaya-dan-optik" className="hover:text-[#2583E8] transition-colors">
                  Cahaya & Optik (Cermin Datar)
                </Link>
              </li>
            </ul>
          </div>

          {/* Batasan Virtual */}
          <div>
            <h4 className="font-bold text-xs text-[#172B45] uppercase tracking-wider mb-3">
              Keterangan
            </h4>
            <p className="text-[11px] leading-relaxed text-[#617187]">
              Laboratorium virtual ini bertujuan untuk membantu visualisasi konsep dan demonstrasi pembelajaran sains. Simulasi berjalan langsung di browser tanpa instalasi software rumit.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#DCE6F1] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© 2026 DILSA (Digital Laboratorium Science AI). Dikembangkan untuk pendidikan sains Indonesia.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#174A8B]">
              <Cpu className="w-3.5 h-3.5 text-[#2583E8]" />
              Didukung AI Cerdas Berbimbingan Sokratik
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
