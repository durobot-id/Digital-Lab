"use client";

import React from "react";
import Link from "next/link";
import { TopicData } from "@/types";
import { ArrowRight, FlaskConical } from "lucide-react";

interface LabCardProps {
  topic: TopicData;
  colorScheme: "blue" | "purple" | "green" | "orange";
}

export default function LabCard({ topic, colorScheme }: LabCardProps) {
  const getTheme = () => {
    switch (colorScheme) {
      case "blue":
        return {
          bg: "bg-[#EBF5FF]",
          badgeBg: "bg-[#DDF0FF]",
          badgeText: "text-[#1E40AF]",
          strokeColor: "#2583E8",
          liquidColor: "#60A5FA",
          flaskBorder: "#1D4ED8"
        };
      case "purple":
        return {
          bg: "bg-[#F5EEFF]",
          badgeBg: "bg-[#F3E8FF]",
          badgeText: "text-[#6B21A8]",
          strokeColor: "#9333EA",
          liquidColor: "#C084FC",
          flaskBorder: "#7E22CE"
        };
      case "green":
        return {
          bg: "bg-[#EBFBF3]",
          badgeBg: "bg-[#DCFCE7]",
          badgeText: "text-[#166534]",
          strokeColor: "#16A34A",
          liquidColor: "#4ADE80",
          flaskBorder: "#15803D"
        };
      case "orange":
      default:
        return {
          bg: "bg-[#FFF6ED]",
          badgeBg: "bg-[#FFEDD5]",
          badgeText: "text-[#9A3412]",
          strokeColor: "#EA580C",
          liquidColor: "#FB923C",
          flaskBorder: "#C2410C"
        };
    }
  };

  const theme = getTheme();

  return (
    <Link
      href={`/topics/${topic.slug}/lab`}
      className="bg-white rounded-3xl border border-[#DCE6F1] shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
    >
      {/* Top Pastel Illustration Container matching screenshot */}
      <div className={`h-40 ${theme.bg} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
        {/* Soft decorative background circles */}
        <div className="absolute w-32 h-32 rounded-full bg-white/40 -top-10 -right-10 pointer-events-none" />
        <div className="absolute w-24 h-24 rounded-full bg-white/40 -bottom-8 -left-8 pointer-events-none" />

        {/* Illustrated Beaker & Test Tubes SVG */}
        <svg viewBox="0 0 160 120" className="w-36 h-28 drop-shadow-xs">
          {/* Left Test Tube */}
          <rect x="25" y="35" width="12" height="42" rx="6" fill="#FFFFFF" stroke={theme.strokeColor} strokeWidth="2.5" />
          <path d="M 27 55 L 35 55 A 4 4 0 0 1 35 73 L 27 73 Z" fill={theme.liquidColor} opacity="0.8" />
          <line x1="23" y1="36" x2="39" y2="36" stroke={theme.strokeColor} strokeWidth="2.5" strokeLinecap="round" />

          {/* Center Erlenmeyer Flask */}
          <path
            d="M 68 25 L 92 25 L 92 40 L 118 85 A 8 8 0 0 1 110 95 L 50 95 A 8 8 0 0 1 42 85 L 68 40 Z"
            fill="#FFFFFF"
            stroke={theme.strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Flask Lip */}
          <line x1="64" y1="25" x2="96" y2="25" stroke={theme.strokeColor} strokeWidth="3" strokeLinecap="round" />
          {/* Liquid inside Flask */}
          <path
            d="M 54 82 L 106 82 L 108 86 A 7 7 0 0 1 102 93 L 58 93 A 7 7 0 0 1 52 86 Z"
            fill={theme.liquidColor}
          />
          {/* Bubbles */}
          <circle cx="76" cy="65" r="3" fill={theme.strokeColor} opacity="0.6" />
          <circle cx="86" cy="72" r="2" fill={theme.strokeColor} opacity="0.5" />
          <circle cx="70" cy="78" r="2.5" fill={theme.strokeColor} opacity="0.5" />

          {/* Right Test Tube */}
          <rect x="123" y="35" width="12" height="42" rx="6" fill="#FFFFFF" stroke={theme.strokeColor} strokeWidth="2.5" />
          <path d="M 125 50 L 133 50 A 4 4 0 0 1 133 73 L 125 73 Z" fill={theme.liquidColor} opacity="0.8" />
          <line x1="121" y1="36" x2="137" y2="36" stroke={theme.strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Badge */}
          <span
            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${theme.badgeBg} ${theme.badgeText}`}
          >
            {topic.badge}
          </span>

          {/* Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-[#172B45] group-hover:text-[#2583E8] transition-colors leading-snug mb-1">
            {topic.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#617187] line-clamp-2 leading-relaxed">
            {topic.labConfig.goal}
          </p>
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F1F5F9] text-xs font-bold text-[#2583E8]">
          <span className="flex items-center gap-1.5 text-xs text-[#174A8B]">
            <FlaskConical className="w-3.5 h-3.5" />
            Buka Laboratorium 2D
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
