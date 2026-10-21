"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopicData, TopicProgress } from "@/types";
import {
  Activity,
  Zap,
  Sun,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Award,
  ArrowRight
} from "lucide-react";
import { getTopicProgress } from "@/lib/storage";

interface TopicCardProps {
  topic: TopicData;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const [progress, setProgress] = useState<TopicProgress>({
    materialCompleted: false,
    labCompleted: false
  });

  useEffect(() => {
    setProgress(getTopicProgress(topic.slug));
  }, [topic.slug]);

  // Large visual icon and theme gradient
  const renderVisual = () => {
    switch (topic.iconName) {
      case "Activity":
        return {
          icon: <Activity className="w-12 h-12 text-[#2583E8]" />,
          bg: "bg-gradient-to-br from-[#DDF0FF] to-[#E0F2FE]",
          formula: "F = m × a",
          tag: "Mekanika Gerak"
        };
      case "Zap":
        return {
          icon: <Zap className="w-12 h-12 text-[#F59E0B]" />,
          bg: "bg-gradient-to-br from-[#FEF3C7] to-[#FFFBEB]",
          formula: "V = I × R",
          tag: "Rangkaian DC"
        };
      case "Sun":
        return {
          icon: <Sun className="w-12 h-12 text-[#0284C7]" />,
          bg: "bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF]",
          formula: "sudut i = sudut r",
          tag: "Optika Cermin"
        };
      default:
        return {
          icon: <Activity className="w-12 h-12 text-[#2583E8]" />,
          bg: "bg-[#F3F8FF]",
          formula: "F = m × a",
          tag: "Fisika IPA"
        };
    }
  };

  const visual = renderVisual();

  return (
    <div className="bg-white rounded-3xl border border-[#DCE6F1] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-6 sm:p-7 flex flex-col items-center text-center">
        {/* Large Visual Icon */}
        <div
          className={`w-24 h-24 rounded-3xl ${visual.bg} border border-[#DCE6F1] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs`}
        >
          {visual.icon}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF0FF] text-[#174A8B]">
            {visual.tag}
          </span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
            {visual.formula}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-lg text-[#172B45] group-hover:text-[#2583E8] transition-colors mb-2 leading-snug">
          {topic.title}
        </h3>

        {/* Concise Single-Line Goal */}
        <p className="text-xs text-[#617187] line-clamp-2 max-w-xs mb-4">
          {topic.labConfig.goal}
        </p>

        {/* Evaluation status if available */}
        {progress.quizPercentage !== undefined && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#23845B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Award className="w-4 h-4" />
            <span>Skor Kuis: {progress.quizPercentage}%</span>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="p-5 pt-0 flex flex-col gap-2">
        {/* Main CTA: Direct Lab */}
        <Link
          href={`/topics/${topic.slug}/lab`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs text-white bg-[#2583E8] hover:bg-[#1f6fc7] shadow-xs hover:shadow-md transition-all group-hover:bg-[#174A8B]"
        >
          <FlaskConical className="w-4 h-4" />
          Masuk ke Laboratorium 2D
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/topics/${topic.slug}`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#617187] hover:text-[#174A8B] bg-[#F8FAFC] hover:bg-[#F3F8FF] border border-[#DCE6F1] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2583E8]" />
            Materi
          </Link>
          <Link
            href={`/topics/${topic.slug}/quiz`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#617187] hover:text-[#174A8B] bg-[#F8FAFC] hover:bg-[#F3F8FF] border border-[#DCE6F1] transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#23845B]" />
            Kuis
          </Link>
        </div>
      </div>
    </div>
  );
}
