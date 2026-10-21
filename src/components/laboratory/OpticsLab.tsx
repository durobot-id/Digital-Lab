"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  RotateCcw,
  Plus,
  Table,
  HelpCircle,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye,
  Compass
} from "lucide-react";
import { TopicData } from "@/types";
import {
  playClickSound,
  playLaserSound,
  playResetSound,
  playSuccessChime
} from "@/lib/audio";

interface OpticsLabProps {
  topic: TopicData;
  onStateChange?: (state: any) => void;
}

interface OpticsDataPoint {
  id: number;
  incidentAngle: number;
  reflectedAngle: number;
  objectDistance: number;
  imageDistance: number;
  isVirtual: boolean;
}

export default function OpticsLab({ topic, onStateChange }: OpticsLabProps) {
  // Mode: "ray" (Sinar Datang & Pantul) or "object" (Objek & Bayangan Maya)
  const [labMode, setLabMode] = useState<"ray" | "object">("ray");

  // Ray parameters
  const [incidentAngle, setIncidentAngle] = useState<number>(45); // Degrees (0 to 80)
  const [showNormal, setShowNormal] = useState<boolean>(true);
  const [showProtractor, setShowProtractor] = useState<boolean>(true);
  const [showVirtualRay, setShowVirtualRay] = useState<boolean>(true);

  // Object & Image parameters
  const [objectDistance, setObjectDistance] = useState<number>(20); // cm (5 to 40)
  const [objectHeight, setObjectHeight] = useState<number>(40); // px

  // Prediction challenge mode
  const [predictionChallenge, setPredictionChallenge] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<number>(45);
  const [hasRevealed, setHasRevealed] = useState<boolean>(true);

  // Guidance and table
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [recordedData, setRecordedData] = useState<OpticsDataPoint[]>([]);

  // Physics calculation (Hukum Snellius Pemantulan)
  const reflectedAngle = incidentAngle;
  const imageDistance = objectDistance;

  // Sync state to parent / AI assistant
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        topic: "cahaya-dan-optik",
        parameters: {
          modeLab: labMode === "ray" ? "Studi Berkas Sinar Laser" : "Studi Objek & Bayangan Maya",
          sudutDatang_derajat: incidentAngle,
          jarakBenda_cm: objectDistance,
          garisNormalAktif: showNormal,
          busurDerajatAktif: showProtractor
        },
        measurements: {
          sudutPantul_derajat: reflectedAngle,
          jarakBayangan_cm: imageDistance,
          sifatBayangan: "Maya, Tegak, Sama Besar (s' = s)",
          perbesaran_M: 1
        },
        activeExperimentStep: activeStep
      });
    }
  }, [
    labMode,
    incidentAngle,
    reflectedAngle,
    objectDistance,
    imageDistance,
    showNormal,
    showProtractor,
    activeStep,
    onStateChange
  ]);

  const handleReset = () => {
    playResetSound();
    setLabMode("ray");
    setIncidentAngle(45);
    setObjectDistance(20);
    setShowNormal(true);
    setShowProtractor(true);
    setShowVirtualRay(true);
    setPredictionChallenge(false);
    setHasRevealed(true);
  };

  const handleRecordData = () => {
    playClickSound();
    const entry: OpticsDataPoint = {
      id: Date.now(),
      incidentAngle,
      reflectedAngle,
      objectDistance,
      imageDistance,
      isVirtual: true
    };
    setRecordedData((prev) => [...prev, entry]);
  };

  // Canvas geometry coordinates
  // Mirror vertical center at x = 400. Mirror extends from y=30 to y=270
  const mirrorX = 400;
  const hitY = 150; // Point of incidence O

  // Angle in radians (measured from normal which is horizontal along y=150 towards left x<400)
  const rad = (incidentAngle * Math.PI) / 180;
  const rayLength = 260;

  // Incident ray source: (mirrorX - rayLength * cos(rad), hitY - rayLength * sin(rad))
  const sourceX = mirrorX - rayLength * Math.cos(rad);
  const sourceY = hitY - rayLength * Math.sin(rad);

  // Reflected ray destination: (mirrorX - rayLength * cos(rad), hitY + rayLength * sin(rad))
  const reflectedX = mirrorX - rayLength * Math.cos(rad);
  const reflectedY = hitY + rayLength * Math.sin(rad);

  // Virtual ray behind mirror: (mirrorX + rayLength * cos(rad), hitY - rayLength * sin(rad))
  const virtualX = mirrorX + rayLength * Math.cos(rad);
  const virtualY = hitY - rayLength * Math.sin(rad);

  return (
    <div className="flex flex-col gap-6">
      {/* Experiment Steps Guide Banner */}
      <div className="bg-white rounded-xl border border-[#DCE6F1] shadow-xs overflow-hidden">
        <div
          className="flex items-center justify-between p-4 bg-[#F3F8FF] border-b border-[#DCE6F1] cursor-pointer"
          onClick={() => setShowGuide(!showGuide)}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#2583E8]" />
            <h3 className="font-semibold text-[#172B45] text-sm">
              Panduan Langkah Eksperimen Optik Cermin Datar
            </h3>
            <span className="text-xs bg-[#DDF0FF] text-[#174A8B] px-2 py-0.5 rounded-full font-medium">
              Langkah {activeStep} dari 3
            </span>
          </div>
          <button className="text-[#617187] hover:text-[#172B45]" aria-label="Toggle panduan">
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showGuide && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {topic.labConfig.suggestedExperiments.map((exp) => (
              <div
                key={exp.step}
                onClick={() => setActiveStep(exp.step)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  activeStep === exp.step
                    ? "border-[#2583E8] bg-[#F3F8FF] ring-1 ring-[#2583E8]"
                    : "border-[#DCE6F1] bg-white hover:bg-[#F3F8FF]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeStep === exp.step
                        ? "bg-[#2583E8] text-white"
                        : "bg-[#DDF0FF] text-[#174A8B]"
                    }`}
                  >
                    {exp.step}
                  </span>
                  <span className="font-medium text-xs text-[#172B45]">{exp.title}</span>
                </div>
                <p className="text-xs text-[#617187] line-clamp-2 mb-1">{exp.instruction}</p>
                <p className="text-[11px] text-[#23845B] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> {exp.expectedObservation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main 2D Optics Canvas */}
      <div className="bg-white rounded-xl border border-[#DCE6F1] shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DCE6F1]">
          <div>
            <h2 className="text-base font-bold text-[#174A8B]">
              Simulasi Optik 2D: {labMode === "ray" ? "Pemantulan Berkas Sinar" : "Objek & Bayangan Maya"}
            </h2>
            <p className="text-xs text-[#617187]">
              Cermin datar memantulkan cahaya teratur dengan sudut datang = sudut pantul terhadap garis normal.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#F3F8FF] border border-[#DCE6F1] font-mono font-medium text-[#172B45]">
              Sudut Datang i = {incidentAngle}°
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#DDF0FF] border border-[#2583E8]/30 font-mono font-semibold text-[#174A8B]">
              Sudut Pantul r = {hasRevealed ? `${reflectedAngle}°` : "??° (Tebak)"}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FFF4C7] border border-[#FFD45A]/50 font-mono font-semibold text-[#A96508]">
              Jarak Benda s = {objectDistance} cm
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-[#DCE6F1] font-mono text-[#617187]">
              Jarak Bayangan s' = {imageDistance} cm
            </span>
          </div>
        </div>

        {/* SVG Interactive Optics Canvas */}
        <div className="relative w-full h-80 bg-gradient-to-b from-[#FAFBFD] to-[#F1F5F9] rounded-lg border border-[#DCE6F1] overflow-hidden select-none">
          <svg className="w-full h-full" viewBox="0 0 800 300">
            <defs>
              <pattern id="optics-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
              {/* Arrow markers */}
              <marker id="arrow-ray-in" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#EA580C" />
              </marker>
              <marker id="arrow-ray-out" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#2583E8" />
              </marker>
              {/* Radial glow filter for laser */}
              <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Radial glow filter for candle flame */}
              <filter id="flame-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Embedded CSS for Realistic Fluid Optics Motion */}
            <style>{`
              @keyframes flameFlicker {
                0% { transform: scale(1) translateY(0); }
                50% { transform: scale(1.08, 0.93) translateY(-1px); }
                100% { transform: scale(1) translateY(0); }
              }
              .candle-flame-anim {
                animation: flameFlicker 0.4s ease-in-out infinite;
                transform-origin: 0px -40px;
              }
              @keyframes laserCorePulse {
                0% { opacity: 0.85; stroke-width: 3.5; }
                50% { opacity: 1; stroke-width: 4.5; }
                100% { opacity: 0.85; stroke-width: 3.5; }
              }
              .laser-pulse-stream {
                animation: laserCorePulse 1.2s ease-in-out infinite;
              }
            `}</style>

            <rect width="800" height="300" fill="url(#optics-grid)" />

            {/* Behind the mirror zone shading (Virtual domain x > 400) */}
            <rect x={mirrorX} y="0" width="400" height="300" fill="#F8FAFC" opacity="0.6" />
            <text x={mirrorX + 40} y="30" fill="#94A3B8" fontSize="11" fontWeight="bold">
              [Ruang Maya di Belakang Cermin]
            </text>
            <text x="60" y="30" fill="#64748B" fontSize="11" fontWeight="bold">
              [Ruang Nyata di Depan Cermin]
            </text>

            {/* Flat Mirror Bar at x=400 */}
            <line x1={mirrorX} y1="20" x2={mirrorX} y2="280" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
            {/* Mirror reflective coat silver overlay */}
            <line x1={mirrorX - 2} y1="22" x2={mirrorX - 2} y2="278" stroke="#38BDF8" strokeWidth="2" />
            {/* Mirror rear hatch pattern */}
            <g stroke="#94A3B8" strokeWidth="1.5">
              {Array.from({ length: 26 }).map((_, i) => (
                <line key={i} x1={mirrorX} y1={25 + i * 10} x2={mirrorX + 12} y2={25 + i * 10 + 8} />
              ))}
            </g>
            <text x={mirrorX + 8} y="295" fill="#174A8B" fontSize="11" fontWeight="bold">
              Cermin Datar
            </text>

            {/* Normal Line (Perpendicular to mirror: horizontal at y=hitY) */}
            {showNormal && (
              <g>
                <line
                  x1="120"
                  y1={hitY}
                  x2={mirrorX + 140}
                  y2={hitY}
                  stroke="#64748B"
                  strokeWidth="1.8"
                  strokeDasharray="5 5"
                />
                {/* 90-degree right angle indicator */}
                <rect x={mirrorX - 16} y={hitY - 16} width="16" height="16" fill="none" stroke="#64748B" strokeWidth="1" />
                <text x="130" y={hitY - 8} fill="#64748B" fontSize="11" fontWeight="bold">
                  Garis Normal (N)
                </text>
              </g>
            )}

            {/* Protractor / Busur Derajat Overlay at point O (mirrorX, hitY) */}
            {showProtractor && labMode === "ray" && (
              <g opacity="0.45">
                {/* Semi-circle protractor on the left side */}
                <path
                  d={`M ${mirrorX} ${hitY - 110} A 110 110 0 0 0 ${mirrorX} ${hitY + 110} Z`}
                  fill="#E0F2FE"
                  stroke="#0284C7"
                  strokeWidth="1.5"
                />
                {/* Degree ticks every 15 deg */}
                {[0, 15, 30, 45, 60, 75, 90].map((deg) => {
                  const tickRad = (deg * Math.PI) / 180;
                  const tx1 = mirrorX - 100 * Math.cos(tickRad);
                  const ty1 = hitY - 100 * Math.sin(tickRad);
                  const tx2 = mirrorX - 110 * Math.cos(tickRad);
                  const ty2 = hitY - 110 * Math.sin(tickRad);
                  return (
                    <g key={deg}>
                      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#0284C7" strokeWidth="1.5" />
                      <text x={tx1 - 8} y={ty1} fill="#0369A1" fontSize="9" textAnchor="end">
                        {deg}°
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* RAY MODE RENDERING */}
            {labMode === "ray" && (
              <g>
                {/* 1. Incident Ray (Sinar Datang) with Glow Core */}
                <line
                  x1={sourceX}
                  y1={sourceY}
                  x2={mirrorX}
                  y2={hitY}
                  stroke="#EA580C"
                  strokeWidth="4"
                  className="laser-pulse-stream"
                  markerMid="url(#arrow-ray-in)"
                />
                {/* Laser Ray Inner Core */}
                <line
                  x1={sourceX}
                  y1={sourceY}
                  x2={mirrorX}
                  y2={hitY}
                  stroke="#FFD45A"
                  strokeWidth="1.8"
                />
                {/* Mid-point indicator */}
                <circle cx={(sourceX + mirrorX) / 2} cy={(sourceY + hitY) / 2} r="3" fill="#EA580C" />

                {/* Laser Source Graphic (Draggable) */}
                <g
                  transform={`translate(${sourceX - 25}, ${sourceY - 14})`}
                  className="cursor-grab active:cursor-grabbing group"
                  onPointerDown={(e) => {
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    playLaserSound();
                    const handleMove = (moveEvt: PointerEvent) => {
                      const rect = svg.getBoundingClientRect();
                      const curX = moveEvt.clientX - rect.left;
                      const curY = moveEvt.clientY - rect.top;
                      const dx = mirrorX - curX;
                      const dy = hitY - curY;
                      if (dx > 5) {
                        const angleRad = Math.atan2(dy, dx);
                        const deg = Math.round((angleRad * 180) / Math.PI);
                        const clamped = Math.max(0, Math.min(80, deg));
                        setIncidentAngle(clamped);
                      }
                    };
                    const handleUp = () => {
                      window.removeEventListener("pointermove", handleMove);
                      window.removeEventListener("pointerup", handleUp);
                    };
                    window.addEventListener("pointermove", handleMove);
                    window.addEventListener("pointerup", handleUp);
                  }}
                >
                  <rect x="0" y="0" width="46" height="26" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                  <rect x="42" y="7" width="8" height="12" rx="1.5" fill="#EA580C" />
                  <text x="21" y="17" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                    LASER
                  </text>
                </g>

                {/* Incident Angle Arc */}
                <path
                  d={`M ${mirrorX - 60} ${hitY} A 60 60 0 0 0 ${mirrorX - 60 * Math.cos(rad)} ${hitY - 60 * Math.sin(rad)}`}
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="2"
                />
                <text
                  x={mirrorX - 75}
                  y={hitY - 20}
                  fill="#EA580C"
                  fontSize="12"
                  fontWeight="bold"
                >
                  i = {incidentAngle}°
                </text>

                {/* 2. Reflected Ray (Sinar Pantul) */}
                {hasRevealed && (
                  <g>
                    <line
                      x1={mirrorX}
                      y1={hitY}
                      x2={reflectedX}
                      y2={reflectedY}
                      stroke="#2583E8"
                      strokeWidth="4"
                      className="laser-pulse-stream"
                      markerMid="url(#arrow-ray-out)"
                    />
                    <line
                      x1={mirrorX}
                      y1={hitY}
                      x2={reflectedX}
                      y2={reflectedY}
                      stroke="#93C5FD"
                      strokeWidth="1.8"
                    />
                    <circle cx={(mirrorX + reflectedX) / 2} cy={(hitY + reflectedY) / 2} r="3" fill="#2583E8" />

                    {/* Reflected Angle Arc */}
                    <path
                      d={`M ${mirrorX - 60} ${hitY} A 60 60 0 1 ${mirrorX - 60 * Math.cos(rad)} ${hitY + 60 * Math.sin(rad)}`}
                      fill="none"
                      stroke="#2583E8"
                      strokeWidth="2"
                    />
                    <text
                      x={mirrorX - 75}
                      y={hitY + 30}
                      fill="#2583E8"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      r = {reflectedAngle}°
                    </text>
                  </g>
                )}

                {/* Virtual Ray Extension Behind Mirror */}
                {showVirtualRay && hasRevealed && (
                  <g>
                    <line
                      x1={mirrorX}
                      y1={hitY}
                      x2={virtualX}
                      y2={virtualY}
                      stroke="#94A3B8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text x={virtualX + 5} y={virtualY} fill="#64748B" fontSize="9">
                      Perpanjangan Sinar Maya
                    </text>
                  </g>
                )}

                {/* Point of Incidence O with Shimmering Glint */}
                <circle cx={mirrorX} cy={hitY} r="8" fill="#FEE2E2" opacity="0.8" filter="url(#laser-glow)" className="animate-ping" />
                <circle cx={mirrorX} cy={hitY} r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                <text x={mirrorX - 18} y={hitY - 10} fill="#1E293B" fontSize="11" fontWeight="bold">
                  Titik O
                </text>
              </g>
            )}

            {/* OBJECT & VIRTUAL IMAGE MODE RENDERING */}
            {labMode === "object" && (() => {
              const objX = mirrorX - objectDistance * 7.5;
              const imgX = mirrorX + objectDistance * 7.5;
              const objY = hitY + 25;
              const h = objectHeight;

              return (
                <g>
                  {/* Object: Real Candle (Draggable) */}
                  <g
                    transform={`translate(${objX}, ${objY})`}
                    className="cursor-grab active:cursor-grabbing group"
                    onPointerDown={(e) => {
                      const svg = e.currentTarget.ownerSVGElement;
                      if (!svg) return;
                      const handleMove = (moveEvt: PointerEvent) => {
                        const rect = svg.getBoundingClientRect();
                        const curX = moveEvt.clientX - rect.left;
                        const distPx = mirrorX - curX;
                        const distCm = Math.round(distPx / 7.5);
                        const clamped = Math.max(5, Math.min(38, distCm));
                        setObjectDistance(clamped);
                      };
                      const handleUp = () => {
                        window.removeEventListener("pointermove", handleMove);
                        window.removeEventListener("pointerup", handleUp);
                      };
                      window.addEventListener("pointermove", handleMove);
                      window.addEventListener("pointerup", handleUp);
                    }}
                  >
                    {/* Candle body */}
                    <rect x="-8" y={-h} width="16" height={h} rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                    {/* Wick */}
                    <line x1="0" y1={-h} x2="0" y2={-h - 5} stroke="#334155" strokeWidth="1.5" />
                    {/* Animated Candle Flame */}
                    <g className="candle-flame-anim">
                      <circle cx="0" cy={-h - 13} r="14" fill="#FDE047" fillOpacity="0.38" filter="url(#flame-glow)" />
                      <path
                        d={`M 0 ${-h - 4} Q -6 ${-h - 13} 0 ${-h - 22} Q 6 ${-h - 13} 0 ${-h - 4}`}
                        fill="#EF4444"
                      />
                      <path
                        d={`M 0 ${-h - 5} Q -3 ${-h - 12} 0 ${-h - 18} Q 3 ${-h - 12} 0 ${-h - 5}`}
                        fill="#FCD34D"
                      />
                    </g>
                    {/* Distance Ruler Arrow to mirror */}
                    <line x1="0" y1="20" x2={mirrorX - objX} y2="20" stroke="#174A8B" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x={(mirrorX - objX) / 2} y="36" fill="#174A8B" fontSize="11" fontWeight="bold" textAnchor="middle">
                      s = {objectDistance} cm (Geser)
                    </text>
                    <text x="0" y={-h - 28} fill="#172B45" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Benda Nyata
                    </text>
                  </g>

                  {/* Virtual Image: Behind mirror */}
                  <g transform={`translate(${imgX}, ${objY})`} opacity="0.85">
                    {/* Virtual candle body (dashed border) */}
                    <rect
                      x="-8"
                      y={-h}
                      width="16"
                      height={h}
                      rx="3"
                      fill="#FEF08A"
                      stroke="#D97706"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    {/* Virtual Wick */}
                    <line x1="0" y1={-h} x2="0" y2={-h - 5} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
                    {/* Virtual Flame */}
                    <path
                      d={`M 0 ${-h - 4} Q -6 ${-h - 13} 0 ${-h - 22} Q 6 ${-h - 13} 0 ${-h - 4}`}
                      fill="#F87171"
                      stroke="#EF4444"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    {/* Distance line */}
                    <line x1="0" y1="20" x2={mirrorX - imgX} y2="20" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x={(mirrorX - imgX) / 2} y="36" fill="#64748B" fontSize="11" fontWeight="bold" textAnchor="middle">
                      s' = {imageDistance} cm
                    </text>
                    <text x="0" y={-h - 28} fill="#64748B" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Bayangan Maya
                    </text>
                  </g>

                  {/* Light ray construction connecting candle tip to mirror and reflected to observer */}
                  <line
                    x1={objX}
                    y1={objY - h - 14}
                    x2={mirrorX}
                    y2={objY - h - 14}
                    stroke="#EA580C"
                    strokeWidth="2"
                  />
                  <line
                    x1={mirrorX}
                    y1={objY - h - 14}
                    x2={imgX}
                    y2={objY - h - 14}
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Ray bouncing to observer eye */}
                  <line
                    x1={objX}
                    y1={objY - h - 14}
                    x2={mirrorX}
                    y2={hitY}
                    stroke="#EA580C"
                    strokeWidth="1.8"
                  />
                  <line
                    x1={mirrorX}
                    y1={hitY}
                    x2={objX + 45}
                    y2={hitY + 50}
                    stroke="#2583E8"
                    strokeWidth="2"
                  />
                  <line
                    x1={mirrorX}
                    y1={hitY}
                    x2={imgX}
                    y2={objY - h - 14}
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />

                  {/* Observer Eye Graphic */}
                  <g transform={`translate(${objX + 45}, ${hitY + 50})`}>
                    <path d="M -15 0 Q 0 -9 15 0 Q 0 9 -15 0 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="2" cy="0" r="4.5" fill="#0284C7" />
                    <circle cx="3" cy="-1" r="1.5" fill="#FFFFFF" />
                    <text x="0" y="18" fill="#174A8B" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Mata Pengamat
                    </text>
                  </g>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[#DCE6F1]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setLabMode(labMode === "ray" ? "object" : "ray");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs bg-[#2583E8] text-white hover:bg-[#1f6fc7] shadow-xs"
            >
              <Eye className="w-4 h-4" />
              {labMode === "ray" ? "Ganti ke Mode Objek & Bayangan Maya" : "Ganti ke Mode Berkas Sinar Laser"}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#617187] hover:text-[#C43D4B] bg-white hover:bg-red-50 border border-[#DCE6F1]"
              title="Reset ke kondisi awal"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecordData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#23845B] text-white hover:bg-[#1d6d4a] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Catat Eksperimen
            </button>
            <button
              onClick={() => setShowTable(!showTable)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border ${
                showTable
                  ? "bg-[#DDF0FF] border-[#2583E8] text-[#174A8B] font-semibold"
                  : "bg-white border-[#DCE6F1] text-[#617187]"
              }`}
            >
              <Table className="w-4 h-4" />
              Tabel Catatan ({recordedData.length})
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Snell's Law Prediction Challenge */}
      {labMode === "ray" && (
        <div className="bg-gradient-to-r from-[#EFF6FF] via-[#F0FDF4] to-[#FFFBEB] p-4 rounded-xl border border-[#BFDBFE] shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2583E8] text-white flex items-center justify-center font-black text-sm shadow-xs">
              ?
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B45]">Tantangan Prediksi: Hukum Pemantulan Cahaya</h4>
              <p className="text-[11px] text-[#617187]">
                Jika sinar laser datang dengan sudut <strong>i = {incidentAngle}°</strong>, berapakah besar sudut pantulnya?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#DCE6F1]">
              <span className="text-xs text-[#617187] font-medium">Tebakan:</span>
              <input
                type="number"
                min="0"
                max="90"
                value={userGuess}
                onChange={(e) => {
                  setUserGuess(Number(e.target.value));
                  setHasRevealed(false);
                }}
                className="w-14 px-1.5 py-0.5 rounded text-xs font-bold font-mono text-center text-[#172B45] focus:outline-none"
              />
              <span className="text-xs text-[#617187] font-bold">°</span>
            </div>
            <button
              onClick={() => {
                setHasRevealed(true);
                if (Math.abs(userGuess - reflectedAngle) <= 1) {
                  playSuccessChime();
                } else {
                  playClickSound();
                }
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2583E8] text-white hover:bg-[#1d6fc5] transition-all shadow-xs"
            >
              Uji Prediksi
            </button>
            {hasRevealed && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md animate-fade-in ${
                  Math.abs(userGuess - reflectedAngle) <= 1
                    ? "bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]"
                    : "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                }`}
              >
                {Math.abs(userGuess - reflectedAngle) <= 1
                  ? "Hebat, Tepat Sekali! (Sudut Datang i = Sudut Pantul r)"
                  : `Kurang tepat. Berdasarkan Hukum Snellius, r = ${reflectedAngle}°`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Control Sliders & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Incident Angle Slider (Sudut Datang) */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#EA580C]" />
              Sudut Datang (i)
            </label>
            <span className="text-sm font-mono font-bold text-[#EA580C] bg-[#FFF4C7] px-2 py-0.5 rounded border border-[#FFD45A]/40">
              {incidentAngle}°
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-2">
            Sudut diukur dari garis normal (bukan dari permukaan cermin).
          </p>
          <input
            type="range"
            min="0"
            max="75"
            step="5"
            value={incidentAngle}
            onChange={(e) => {
              setIncidentAngle(Number(e.target.value));
              if (predictionChallenge) setHasRevealed(false);
            }}
            className="w-full accent-[#EA580C] cursor-pointer"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[0, 15, 30, 45, 60].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setIncidentAngle(val);
                  if (predictionChallenge) setHasRevealed(false);
                }}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                  incidentAngle === val
                    ? "bg-[#EA580C] text-white border-[#EA580C]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
                }`}
              >
                {val}°
              </button>
            ))}
          </div>
        </div>

        {/* Object Distance Slider */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#174A8B]" />
              Jarak Benda ke Cermin (s)
            </label>
            <span className="text-sm font-mono font-bold text-[#174A8B] bg-[#F3F8FF] px-2 py-0.5 rounded border border-[#DCE6F1]">
              {objectDistance} cm
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-2">
            Geser posisi benda lilin mendekati atau menjauhi cermin datar.
          </p>
          <input
            type="range"
            min="5"
            max="35"
            step="5"
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
            className="w-full accent-[#174A8B] cursor-pointer"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[10, 15, 20, 25, 30].map((val) => (
              <button
                key={val}
                onClick={() => setObjectDistance(val)}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                  objectDistance === val
                    ? "bg-[#174A8B] text-white border-[#174A8B]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1]"
                }`}
              >
                {val}cm
              </button>
            ))}
          </div>
        </div>

        {/* Display Overlays Toggles */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <label className="text-xs font-bold text-[#172B45] mb-2 block flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#2583E8]" />
            Elemen Visual Bantuan
          </label>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 text-xs text-[#172B45] cursor-pointer">
              <input
                type="checkbox"
                checked={showNormal}
                onChange={(e) => setShowNormal(e.target.checked)}
                className="rounded accent-[#2583E8]"
              />
              Tampilkan Garis Normal (Garis N)
            </label>
            <label className="flex items-center gap-2 text-xs text-[#172B45] cursor-pointer">
              <input
                type="checkbox"
                checked={showProtractor}
                onChange={(e) => setShowProtractor(e.target.checked)}
                className="rounded accent-[#2583E8]"
              />
              Tampilkan Busur Derajat (Protractor)
            </label>
            <label className="flex items-center gap-2 text-xs text-[#172B45] cursor-pointer">
              <input
                type="checkbox"
                checked={showVirtualRay}
                onChange={(e) => setShowVirtualRay(e.target.checked)}
                className="rounded accent-[#2583E8]"
              />
              Tampilkan Perpanjangan Sinar Maya
            </label>
          </div>
        </div>
      </div>

      {/* Observation Data Table */}
      {showTable && (
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DCE6F1]">
            <div>
              <h3 className="text-xs font-bold text-[#174A8B] flex items-center gap-1.5">
                <Table className="w-4 h-4 text-[#23845B]" />
                Tabel Catatan Pengamatan Optik
              </h3>
              <p className="text-[11px] text-[#617187]">
                Perhatikan konsistensi kesamaan antara sudut datang (i) dan sudut pantul (r) serta perbandingan jarak s dan s'.
              </p>
            </div>
            {recordedData.length > 0 && (
              <button
                onClick={() => setRecordedData([])}
                className="text-[11px] text-[#C43D4B] hover:underline"
              >
                Hapus Semua Data
              </button>
            )}
          </div>

          {recordedData.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#617187] bg-[#F8FAFC] rounded-lg border border-dashed border-[#DCE6F1]">
              Belum ada data pengamatan yang dicatat. Klik{" "}
              <strong className="text-[#23845B]">"Catat Eksperimen"</strong> di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F3F8FF] text-[#174A8B] border-b border-[#DCE6F1]">
                    <th className="p-2 font-semibold">No</th>
                    <th className="p-2 font-semibold text-[#EA580C]">Sudut Datang i (°)</th>
                    <th className="p-2 font-semibold text-[#2583E8]">Sudut Pantul r (°)</th>
                    <th className="p-2 font-semibold">Jarak Benda s (cm)</th>
                    <th className="p-2 font-semibold text-[#23845B]">Jarak Bayangan s' (cm)</th>
                    <th className="p-2 font-semibold">Sifat Bayangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE6F1]">
                  {recordedData.map((d, index) => (
                    <tr key={d.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-2 font-mono text-[#617187]">{index + 1}</td>
                      <td className="p-2 font-mono font-bold text-[#EA580C]">{d.incidentAngle}°</td>
                      <td className="p-2 font-mono font-bold text-[#2583E8] bg-[#F3F8FF]/50">
                        {d.reflectedAngle}°
                      </td>
                      <td className="p-2 font-mono">{d.objectDistance} cm</td>
                      <td className="p-2 font-mono font-bold text-[#23845B]">{d.imageDistance} cm</td>
                      <td className="p-2 text-[#617187]">Maya, Tegak, Sama Besar</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
