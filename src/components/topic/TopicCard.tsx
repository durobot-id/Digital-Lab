"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopicData, TopicProgress } from "@/types";
import {
  Activity,
  Zap,
  Sun,
  Clock,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Award
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

  // Icon mapping
  const renderIcon = () => {
    switch (topic.iconName) {
      case "Activity":
        return <Activity className="w-6 h-6 text-[#2583E8]" />;
      case "Zap":
        return <Zap className="w-6 h-6 text-[#FFD45A]" />;
      case "Sun":
        return <Sun className="w-6 h-6 text-[#2583E8]" />;
      default:
        return <Activity className="w-6 h-6 text-[#2583E8]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#DDF0FF] text-[#174A8B]">
            {topic.badge}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#617187]">
            <Clock className="w-3.5 h-3.5" />
            <span>{topic.durationMinutes} menit</span>
          </div>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#F3F8FF] border border-[#DCE6F1] flex items-center justify-center shrink-0 group-hover:bg-[#DDF0FF] transition-all">
            {renderIcon()}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#617187] flex items-center gap-1 mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {topic.gradeLevel}
            </span>
            <h3 className="font-bold text-base text-[#172B45] group-hover:text-[#2583E8] transition-colors leading-snug">
              {topic.title}
            </h3>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-[#617187] leading-relaxed mb-4 line-clamp-3">
          {topic.summary}
        </p>

        {/* Learning Objectives Preview */}
        <div className="space-y-1.5 pt-3 border-t border-[#DCE6F1]">
          <span className="text-[11px] font-bold text-[#174A8B] uppercase tracking-wider block mb-1">
            Fokus Utama:
          </span>
          {topic.learningObjectives.slice(0, 2).map((obj, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-[#617187]">
              <CheckCircle2 className="w-3 h-3 text-[#23845B] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer & Action */}
      <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#DCE6F1] flex items-center justify-between">
        {progress.quizPercentage !== undefined ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#23845B]">
            <Award className="w-4 h-4" />
            <span>Skor Kuis: {progress.quizPercentage}%</span>
          </div>
        ) : (
          <span className="text-xs text-[#617187] font-medium">Belum dievaluasi</span>
        )}

        <Link
          href={`/topics/${topic.slug}`}
          className="flex items-center gap-1 text-xs font-bold text-[#2583E8] group-hover:translate-x-1 transition-all"
        >
          Mulai Belajar
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
