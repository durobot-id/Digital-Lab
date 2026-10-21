"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TOPICS } from "@/data/topics";
import LabCard from "@/components/topic/LabCard";
import {
  FlaskConical,
  Filter,
  GraduationCap,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function TopicsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const filteredTopics = TOPICS.filter((t) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Mekanika") return t.slug === "gaya-dan-gerak";
    if (activeFilter === "Kelistrikan") return t.slug === "kelistrikan";
    if (activeFilter === "Optik") return t.slug === "cahaya-dan-optik";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header Row matching Home style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DCE6F1]">
        <div>
          <span className="text-[11px] font-bold text-[#1E3A53] tracking-widest uppercase block mb-1">
            Kurikulum Sains SMP / MTs (Kelas VII – IX)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
            Materi Belajar & Laboratorium Virtual
          </h1>
          <p className="text-xs text-[#617187] mt-1 max-w-2xl">
            Pilih modul di bawah ini untuk memulai eksperimen interaktif 2D, pelajari materi konsep, dan uji pemahamanmu.
          </p>
        </div>

        {/* Quick Badge info */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DDF0FF] text-[#174A8B] text-xs font-semibold">
            <FlaskConical className="w-3.5 h-3.5 text-[#2583E8]" />
            <span>3 Modul Siap Praktikum</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Filter Action matching Beranda exactly */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
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

      {/* Grid of Lab Cards with Pastel Flask Illustrations matching Home & Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTopics.map((topic, idx) => {
          const colors: ("blue" | "purple" | "green" | "orange")[] = [
            "blue",
            "purple",
            "green"
          ];
          // Ensure correct distinct color for each domain
          const colorScheme =
            topic.slug === "gaya-dan-gerak"
              ? "blue"
              : topic.slug === "kelistrikan"
              ? "purple"
              : "green";

          return (
            <div key={topic.id} className="flex flex-col">
              <LabCard topic={topic} colorScheme={colorScheme} />

              {/* Extra Secondary Action: Pelajari Materi Formal */}
              <div className="mt-2.5 flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#DCE6F1] shadow-2xs text-xs">
                <span className="text-[#617187] text-[11px] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#174A8B]" />
                  Teori & Kuis
                </span>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="font-bold text-[#174A8B] hover:text-[#2583E8] flex items-center gap-1"
                >
                  Baca Teori Formal
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
