"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, FlaskConical, HelpCircle, Check, ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  topicSlug: string;
  topicTitle: string;
  activeStage: "material" | "lab" | "quiz" | "summary";
}

export default function Breadcrumb({
  topicSlug,
  topicTitle,
  activeStage
}: BreadcrumbProps) {
  const stages = [
    {
      id: "material",
      label: "1. Materi Formal",
      href: `/topics/${topicSlug}`,
      icon: BookOpen
    },
    {
      id: "lab",
      label: "2. Laboratorium 2D",
      href: `/topics/${topicSlug}/lab`,
      icon: FlaskConical
    },
    {
      id: "quiz",
      label: "3. Kuis & Evaluasi",
      href: `/topics/${topicSlug}/quiz`,
      icon: HelpCircle
    }
  ];

  return (
    <div className="bg-white border-b border-[#DCE6F1] py-3 px-4 sm:px-6 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Topic Title Link */}
        <div className="flex items-center gap-2 text-xs">
          <Link href="/topics" className="text-[#617187] hover:text-[#174A8B]">
            Katalog Tema
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#617187]" />
          <span className="font-bold text-[#172B45] truncate max-w-xs sm:max-w-md">
            {topicTitle}
          </span>
        </div>

        {/* Learning Flow Stepper */}
        <div className="flex items-center gap-1 sm:gap-2">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const isPassed =
              (activeStage === "lab" && stage.id === "material") ||
              (activeStage === "quiz" && (stage.id === "material" || stage.id === "lab")) ||
              (activeStage === "summary");

            return (
              <React.Fragment key={stage.id}>
                <Link
                  href={stage.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2583E8] text-white shadow-xs"
                      : isPassed
                      ? "bg-[#DDF0FF] text-[#174A8B] hover:bg-[#cce7ff]"
                      : "bg-[#F8FAFC] text-[#617187] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">{idx + 1}</span>
                  {isPassed && !isActive && <Check className="w-3 h-3 text-[#23845B]" />}
                </Link>
                {idx < stages.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
