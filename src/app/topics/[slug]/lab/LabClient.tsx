"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopicData } from "@/types";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import MotionLab from "@/components/laboratory/MotionLab";
import CircuitLab from "@/components/laboratory/CircuitLab";
import OpticsLab from "@/components/laboratory/OpticsLab";
import AiAssistant from "@/components/assistant/AiAssistant";
import {
  FlaskConical,
  ArrowRight,
  BookOpen,
  Smartphone
} from "lucide-react";
import { saveTopicProgress } from "@/lib/storage";

interface LabClientProps {
  topic: TopicData;
}

export default function LabClient({ topic }: LabClientProps) {
  const [labState, setLabState] = useState<any>(null);

  useEffect(() => {
    if (topic?.slug) {
      saveTopicProgress(topic.slug, { labCompleted: true });
    }
  }, [topic?.slug]);

  return (
    <div className="pb-24">
      {/* Stepper Breadcrumb */}
      <Breadcrumb
        topicSlug={topic.slug}
        topicTitle={topic.title}
        activeStage="lab"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Orientation Hint Banner */}
        <div className="md:hidden mb-4 p-3 rounded-xl bg-[#FFF4C7] border border-[#FFD45A]/50 text-xs text-[#A96508] flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 rotate-90" />
          <span>
            Tip: Putar perangkat ke orientasi <strong>Landscape</strong> untuk area simulasi yang lebih leluasa.
          </span>
        </div>

        {/* Lab Top Header Bar */}
        <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-5 sm:p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#174A8B]">
                Laboratorium Virtual Interaktif
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#172B45]">
              {topic.title}
            </h1>
            <p className="text-xs text-[#617187] mt-1 max-w-2xl">
              {topic.labConfig.goal}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/topics/${topic.slug}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#617187] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#DCE6F1]"
            >
              <BookOpen className="w-4 h-4" />
              Tinjau Materi
            </Link>
            <Link
              href={`/topics/${topic.slug}/quiz`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2583E8] hover:bg-[#1f6fc7] shadow-xs transition-all"
            >
              Lanjut ke Kuis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Render Specific Simulation */}
        <div className="mb-10">
          {topic.slug === "gaya-dan-gerak" && (
            <MotionLab topic={topic} onStateChange={setLabState} />
          )}
          {topic.slug === "kelistrikan" && (
            <CircuitLab topic={topic} onStateChange={setLabState} />
          )}
          {topic.slug === "cahaya-dan-optik" && (
            <OpticsLab topic={topic} onStateChange={setLabState} />
          )}
        </div>

        {/* Bottom CTA Next Step Card */}
        <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#172B45]">
              Sudah selesai menguji dan mencatat data?
            </h3>
            <p className="text-xs text-[#617187]">
              Uji pemahamanmu tentang hasil eksperimen ini melalui 6 soal kuis evaluasi.
            </p>
          </div>

          <Link
            href={`/topics/${topic.slug}/quiz`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#174A8B] hover:bg-[#12396d] shadow-xs transition-all shrink-0"
          >
            Mulai Kuis Evaluasi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Embedded Context-Aware AI Assistant */}
      <AiAssistant topicSlug={topic.slug} labState={labState} />
    </div>
  );
}
