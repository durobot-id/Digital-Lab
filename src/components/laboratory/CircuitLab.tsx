"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  RotateCcw,
  Plus,
  Table,
  HelpCircle,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Power
} from "lucide-react";
import { TopicData } from "@/types";

interface CircuitLabProps {
  topic: TopicData;
  onStateChange?: (state: any) => void;
}

interface CircuitDataPoint {
  id: number;
  mode: string;
  voltage: number;
  r1: number;
  r2: number;
  switchState: string;
  currentTotal: number;
  powerTotal: number;
  rTotal: number;
}

export default function CircuitLab({ topic, onStateChange }: CircuitLabProps) {
  // Mode: "single" | "series" | "parallel"
  const [circuitType, setCircuitType] = useState<"single" | "series" | "parallel">("series");
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [voltage, setVoltage] = useState<number>(12); // Volts (1.5 to 24)
  const [resistance1, setResistance1] = useState<number>(10); // Ohm (5 to 50)
  const [resistance2, setResistance2] = useState<number>(10); // Ohm (5 to 50)

  // Guided step & observations
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [recordedData, setRecordedData] = useState<CircuitDataPoint[]>([]);

  // Physics calculations (Deterministik Hukum Ohm)
  let rTotal = 0;
  let iTotal = 0;
  let i1 = 0;
  let i2 = 0;
  let v1 = 0;
  let v2 = 0;
  let p1 = 0;
  let p2 = 0;

  if (isSwitchClosed) {
    if (circuitType === "single") {
      rTotal = resistance1;
      iTotal = Number((voltage / rTotal).toFixed(2));
      i1 = iTotal;
      v1 = voltage;
      p1 = Number((v1 * i1).toFixed(2));
    } else if (circuitType === "series") {
      rTotal = resistance1 + resistance2;
      iTotal = Number((voltage / rTotal).toFixed(2));
      i1 = iTotal;
      i2 = iTotal;
      v1 = Number((iTotal * resistance1).toFixed(2));
      v2 = Number((iTotal * resistance2).toFixed(2));
      p1 = Number((i1 * i1 * resistance1).toFixed(2));
      p2 = Number((i2 * i2 * resistance2).toFixed(2));
    } else if (circuitType === "parallel") {
      rTotal = Number(((resistance1 * resistance2) / (resistance1 + resistance2)).toFixed(2));
      i1 = Number((voltage / resistance1).toFixed(2));
      i2 = Number((voltage / resistance2).toFixed(2));
      iTotal = Number((i1 + i2).toFixed(2));
      v1 = voltage;
      v2 = voltage;
      p1 = Number((voltage * i1).toFixed(2));
      p2 = Number((voltage * i2).toFixed(2));
    }
  }

  const pTotal = Number((p1 + p2).toFixed(2));

  // Sync state to parent / AI assistant
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        topic: "kelistrikan",
        parameters: {
          tipeRangkaian: circuitType,
          statusSakelar: isSwitchClosed ? "Tertutup (Arus Mengalir)" : "Terbuka (Arus Terputus)",
          teganganBaterai_V: voltage,
          hambatanLampu1_Ohm: resistance1,
          hambatanLampu2_Ohm: circuitType !== "single" ? resistance2 : 0
        },
        measurements: {
          hambatanTotal_Ohm: rTotal,
          kuatArusTotal_A: iTotal,
          kuatArusLampu1_A: i1,
          kuatArusLampu2_A: i2,
          dayaLampu1_W: p1,
          dayaLampu2_W: p2,
          dayaTotal_W: pTotal
        },
        activeExperimentStep: activeStep
      });
    }
  }, [
    circuitType,
    isSwitchClosed,
    voltage,
    resistance1,
    resistance2,
    rTotal,
    iTotal,
    i1,
    i2,
    p1,
    p2,
    pTotal,
    activeStep,
    onStateChange
  ]);

  const handleReset = () => {
    setCircuitType("series");
    setIsSwitchClosed(true);
    setVoltage(12);
    setResistance1(10);
    setResistance2(10);
  };

  const handleRecordData = () => {
    const entry: CircuitDataPoint = {
      id: Date.now(),
      mode: circuitType === "single" ? "Tunggal" : circuitType === "series" ? "Seri" : "Paralel",
      voltage,
      r1: resistance1,
      r2: circuitType === "single" ? 0 : resistance2,
      switchState: isSwitchClosed ? "Tertutup" : "Terbuka",
      currentTotal: iTotal,
      powerTotal: pTotal,
      rTotal
    };
    setRecordedData((prev) => [...prev, entry]);
  };

  // Lamp brightness opacity (max 100W ref)
  const lamp1Brightness = Math.min(1, Math.max(0, p1 / 25));
  const lamp2Brightness = Math.min(1, Math.max(0, p2 / 25));

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
              Panduan Langkah Eksperimen Kelistrikan
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

      {/* Main 2D Circuit Canvas */}
      <div className="bg-white rounded-xl border border-[#DCE6F1] shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DCE6F1]">
          <div>
            <h2 className="text-base font-bold text-[#174A8B]">
              Simulasi Rangkaian DC: {circuitType === "series" ? "Rangkaian Seri" : circuitType === "parallel" ? "Rangkaian Paralel" : "Rangkaian Tunggal"}
            </h2>
            <p className="text-xs text-[#617187]">
              Titik kuning menunjukkan arah aliran konvensional arus (dari kutub positif ke negatif).
            </p>
          </div>

          {/* Quick Metrics Multi-meter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-md font-semibold text-xs border ${
                isSwitchClosed
                  ? "bg-[#23845B]/10 text-[#23845B] border-[#23845B]/30"
                  : "bg-red-50 text-[#C43D4B] border-red-200"
              }`}
            >
              {isSwitchClosed ? "Rangkaian Tertutup" : "Rangkaian Terbuka"}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F3F8FF] border border-[#DCE6F1] font-mono font-medium text-[#172B45]">
              V = {voltage} V
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#DDF0FF] border border-[#2583E8]/30 font-mono font-semibold text-[#174A8B]">
              I_total = {iTotal} A
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FFF4C7] border border-[#FFD45A]/50 font-mono font-semibold text-[#A96508]">
              R_total = {rTotal} Ω
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-[#DCE6F1] font-mono text-[#617187]">
              P_total = {pTotal} W
            </span>
          </div>
        </div>

        {/* Circuit Schematic SVG Canvas */}
        <div className="relative w-full h-80 bg-gradient-to-b from-[#FAFBFD] to-[#F1F5F9] rounded-lg border border-[#DCE6F1] overflow-hidden select-none">
          <svg className="w-full h-full" viewBox="0 0 800 320">
            <defs>
              <pattern id="circuit-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
              {/* Glow filter for Lamp 1 */}
              <radialGradient id="lamp1-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD45A" stopOpacity={lamp1Brightness} />
                <stop offset="60%" stopColor="#FFC107" stopOpacity={lamp1Brightness * 0.7} />
                <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
              </radialGradient>
              {/* Glow filter for Lamp 2 */}
              <radialGradient id="lamp2-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD45A" stopOpacity={lamp2Brightness} />
                <stop offset="60%" stopColor="#FFC107" stopOpacity={lamp2Brightness * 0.7} />
                <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="320" fill="url(#circuit-grid)" />

            {/* Circuit Wire Traces */}
            {circuitType === "series" && (
              <g>
                {/* Outer loop: (120,60) -> (680,60) -> (680,260) -> (120,260) -> (120,60) */}
                <path
                  d="M 120 60 L 680 60 L 680 260 L 120 260 Z"
                  fill="none"
                  stroke={isSwitchClosed ? "#2583E8" : "#94A3B8"}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Current electron flow animation if closed */}
                {isSwitchClosed && iTotal > 0 && (
                  <path
                    d="M 120 60 L 680 60 L 680 260 L 120 260 Z"
                    fill="none"
                    stroke="#FFD45A"
                    strokeWidth="3"
                    strokeDasharray="6 14"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                )}
              </g>
            )}

            {circuitType === "single" && (
              <g>
                <path
                  d="M 140 70 L 660 70 L 660 250 L 140 250 Z"
                  fill="none"
                  stroke={isSwitchClosed ? "#2583E8" : "#94A3B8"}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {isSwitchClosed && iTotal > 0 && (
                  <path
                    d="M 140 70 L 660 70 L 660 250 L 140 250 Z"
                    fill="none"
                    stroke="#FFD45A"
                    strokeWidth="3"
                    strokeDasharray="6 14"
                    strokeLinecap="round"
                  />
                )}
              </g>
            )}

            {circuitType === "parallel" && (
              <g>
                {/* Main Outer Loop */}
                <path
                  d="M 120 60 L 680 60 L 680 260 L 120 260 Z"
                  fill="none"
                  stroke={isSwitchClosed ? "#2583E8" : "#94A3B8"}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Center Parallel Branch Wire */}
                <line
                  x1="680"
                  y1="160"
                  x2="480"
                  y2="160"
                  stroke={isSwitchClosed ? "#2583E8" : "#94A3B8"}
                  strokeWidth="5"
                />
                <line
                  x1="320"
                  y1="160"
                  x2="120"
                  y2="160"
                  stroke={isSwitchClosed ? "#2583E8" : "#94A3B8"}
                  strokeWidth="5"
                />
                {/* Current animation */}
                {isSwitchClosed && iTotal > 0 && (
                  <>
                    <path
                      d="M 120 60 L 680 60 L 680 260 L 120 260 Z"
                      fill="none"
                      stroke="#FFD45A"
                      strokeWidth="3"
                      strokeDasharray="6 14"
                    />
                    <line
                      x1="120"
                      y1="160"
                      x2="680"
                      y2="160"
                      stroke="#FFD45A"
                      strokeWidth="3"
                      strokeDasharray="6 14"
                    />
                  </>
                )}
              </g>
            )}

            {/* Battery Component (Left branch at x=120) */}
            <g transform="translate(80, 130)">
              {/* Battery Body */}
              <rect x="25" y="0" width="30" height="60" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              {/* Battery Terminals */}
              <rect x="35" y="-6" width="10" height="6" fill="#F59E0B" rx="1" />
              <line x1="15" y1="15" x2="30" y2="15" stroke="#FFFFFF" strokeWidth="2" />
              <line x1="22.5" y1="7.5" x2="22.5" y2="22.5" stroke="#FFFFFF" strokeWidth="2" />
              <line x1="15" y1="45" x2="30" y2="45" stroke="#94A3B8" strokeWidth="2" />
              <text x="40" y="35" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                {voltage}V
              </text>
              <text x="40" y="76" fill="#174A8B" fontSize="10" fontWeight="bold" textAnchor="middle">
                Baterai
              </text>
            </g>

            {/* Switch Component (Bottom branch) */}
            <g
              transform="translate(230, 240)"
              className="cursor-pointer"
              onClick={() => setIsSwitchClosed(!isSwitchClosed)}
            >
              {/* Background Plate */}
              <rect x="0" y="0" width="100" height="40" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="4" fill="#334155" />
              <circle cx="80" cy="20" r="4" fill="#334155" />
              {/* Switch Lever */}
              {isSwitchClosed ? (
                <line x1="20" y1="20" x2="80" y2="20" stroke="#23845B" strokeWidth="4" strokeLinecap="round" />
              ) : (
                <line x1="20" y1="20" x2="70" y2="-5" stroke="#C43D4B" strokeWidth="4" strokeLinecap="round" />
              )}
              <text x="50" y="32" fill="#64748B" fontSize="9" fontWeight="bold" textAnchor="middle">
                {isSwitchClosed ? "Sakelar Tertutup" : "Sakelar Terbuka"}
              </text>
            </g>

            {/* Digital Ammeter in Circuit */}
            <g transform="translate(400, 242)">
              <rect x="0" y="0" width="110" height="36" rx="6" fill="#172B45" stroke="#2583E8" strokeWidth="1.5" />
              <text x="12" y="22" fill="#60A5FA" fontSize="11" fontWeight="bold">
                Ammeter:
              </text>
              <text x="75" y="22" fill="#34D399" fontSize="12" fontWeight="mono" fontWeight-bold="true">
                {iTotal} A
              </text>
            </g>

            {/* Load 1: Lamp 1 */}
            {(() => {
              const lamp1X = circuitType === "series" ? 380 : circuitType === "parallel" ? 400 : 400;
              const lamp1Y = circuitType === "parallel" ? 60 : 60;

              return (
                <g transform={`translate(${lamp1X - 35}, ${lamp1Y - 35})`}>
                  {/* Glowing halo */}
                  {lamp1Brightness > 0.05 && (
                    <circle cx="35" cy="35" r={30 + lamp1Brightness * 40} fill="url(#lamp1-glow)" />
                  )}
                  {/* Lamp Bulb */}
                  <circle
                    cx="35"
                    cy="35"
                    r="24"
                    fill={isSwitchClosed && p1 > 0 ? "#FEF08A" : "#F1F5F9"}
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  {/* Filament */}
                  <path
                    d="M 27 45 L 31 30 L 35 38 L 39 30 L 43 45"
                    fill="none"
                    stroke={isSwitchClosed && p1 > 0 ? "#EA580C" : "#94A3B8"}
                    strokeWidth="2"
                  />
                  {/* Lamp base */}
                  <rect x="27" y="47" width="16" height="8" fill="#64748B" rx="1" />
                  {/* Labels */}
                  <text x="35" y="72" fill="#172B45" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Lampu 1 ({resistance1}Ω)
                  </text>
                  <text x="35" y="86" fill="#2583E8" fontSize="10" font-mono textAnchor="middle">
                    {v1}V | {p1}W
                  </text>
                </g>
              );
            })()}

            {/* Load 2: Lamp 2 (only in series or parallel) */}
            {circuitType !== "single" && (() => {
              const lamp2X = circuitType === "series" ? 560 : 400;
              const lamp2Y = circuitType === "series" ? 60 : 160;

              return (
                <g transform={`translate(${lamp2X - 35}, ${lamp2Y - 35})`}>
                  {/* Glowing halo */}
                  {lamp2Brightness > 0.05 && (
                    <circle cx="35" cy="35" r={30 + lamp2Brightness * 40} fill="url(#lamp2-glow)" />
                  )}
                  {/* Lamp Bulb */}
                  <circle
                    cx="35"
                    cy="35"
                    r="24"
                    fill={isSwitchClosed && p2 > 0 ? "#FEF08A" : "#F1F5F9"}
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  {/* Filament */}
                  <path
                    d="M 27 45 L 31 30 L 35 38 L 39 30 L 43 45"
                    fill="none"
                    stroke={isSwitchClosed && p2 > 0 ? "#EA580C" : "#94A3B8"}
                    strokeWidth="2"
                  />
                  {/* Lamp base */}
                  <rect x="27" y="47" width="16" height="8" fill="#64748B" rx="1" />
                  {/* Labels */}
                  <text x="35" y="72" fill="#172B45" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Lampu 2 ({resistance2}Ω)
                  </text>
                  <text x="35" y="86" fill="#2583E8" fontSize="10" font-mono textAnchor="middle">
                    {v2}V | {p2}W
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[#DCE6F1]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSwitchClosed(!isSwitchClosed)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                isSwitchClosed
                  ? "bg-[#C43D4B] text-white hover:bg-[#b0303e]"
                  : "bg-[#23845B] text-white hover:bg-[#1d6d4a]"
              }`}
            >
              <Power className="w-4 h-4" />
              {isSwitchClosed ? "Buka Sakelar (Putus Arus)" : "Tutup Sakelar (Alirkan Arus)"}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#617187] hover:text-[#C43D4B] bg-white hover:bg-red-50 border border-[#DCE6F1]"
              title="Reset ke pengaturan awal"
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
              Catat Pengukuran
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

      {/* Control Sliders & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Topology Selector */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <label className="text-xs font-bold text-[#172B45] mb-2 block flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#2583E8]" />
            Pilihan Rangkaian
          </label>
          <div className="flex flex-col gap-1.5 mt-2">
            <button
              onClick={() => setCircuitType("series")}
              className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-all border ${
                circuitType === "series"
                  ? "bg-[#2583E8] text-white border-[#2583E8]"
                  : "bg-white text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
              }`}
            >
              Rangkaian Seri
              <span className="block text-[10px] opacity-80">R_total = R1 + R2</span>
            </button>
            <button
              onClick={() => setCircuitType("parallel")}
              className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-all border ${
                circuitType === "parallel"
                  ? "bg-[#2583E8] text-white border-[#2583E8]"
                  : "bg-white text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
              }`}
            >
              Rangkaian Paralel
              <span className="block text-[10px] opacity-80">1/R = 1/R1 + 1/R2</span>
            </button>
            <button
              onClick={() => setCircuitType("single")}
              className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-all border ${
                circuitType === "single"
                  ? "bg-[#2583E8] text-white border-[#2583E8]"
                  : "bg-white text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
              }`}
            >
              Rangkaian Tunggal
              <span className="block text-[10px] opacity-80">1 Lampu Saja</span>
            </button>
          </div>
        </div>

        {/* Battery Voltage Slider */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#174A8B]" />
              Tegangan (V)
            </label>
            <span className="text-sm font-mono font-bold text-[#174A8B] bg-[#F3F8FF] px-2 py-0.5 rounded border border-[#DCE6F1]">
              {voltage} V
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-2">Beda potensial sumber energi baterai.</p>
          <input
            type="range"
            min="3"
            max="24"
            step="1.5"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full accent-[#174A8B] cursor-pointer"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[3, 6, 9, 12, 24].map((val) => (
              <button
                key={val}
                onClick={() => setVoltage(val)}
                className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                  voltage === val
                    ? "bg-[#174A8B] text-white border-[#174A8B]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1]"
                }`}
              >
                {val}V
              </button>
            ))}
          </div>
        </div>

        {/* Resistance Lamp 1 */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#2583E8]" />
              Hambatan R1
            </label>
            <span className="text-sm font-mono font-bold text-[#2583E8] bg-[#F3F8FF] px-2 py-0.5 rounded border border-[#DCE6F1]">
              {resistance1} Ω
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-2">Resistansi beban Lampu 1.</p>
          <input
            type="range"
            min="5"
            max="40"
            step="5"
            value={resistance1}
            onChange={(e) => setResistance1(Number(e.target.value))}
            className="w-full accent-[#2583E8] cursor-pointer"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[5, 10, 20, 30, 40].map((val) => (
              <button
                key={val}
                onClick={() => setResistance1(val)}
                className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                  resistance1 === val
                    ? "bg-[#2583E8] text-white border-[#2583E8]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1]"
                }`}
              >
                {val}Ω
              </button>
            ))}
          </div>
        </div>

        {/* Resistance Lamp 2 */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#A96508]" />
              Hambatan R2
            </label>
            <span className="text-sm font-mono font-bold text-[#A96508] bg-[#FFF4C7] px-2 py-0.5 rounded border border-[#FFD45A]/40">
              {resistance2} Ω
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-2">
            {circuitType === "single" ? "Nonaktif pada mode tunggal." : "Resistansi beban Lampu 2."}
          </p>
          <input
            type="range"
            min="5"
            max="40"
            step="5"
            disabled={circuitType === "single"}
            value={resistance2}
            onChange={(e) => setResistance2(Number(e.target.value))}
            className="w-full accent-[#A96508] cursor-pointer disabled:opacity-40"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[5, 10, 20, 30, 40].map((val) => (
              <button
                key={val}
                disabled={circuitType === "single"}
                onClick={() => setResistance2(val)}
                className={`text-[10px] px-1.5 py-0.5 rounded border font-mono disabled:opacity-40 ${
                  resistance2 === val
                    ? "bg-[#A96508] text-white border-[#A96508]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1]"
                }`}
              >
                {val}Ω
              </button>
            ))}
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
                Tabel Catatan Pengukuran Kelistrikan
              </h3>
              <p className="text-[11px] text-[#617187]">
                Perhatikan bagaimana perbandingan nilai kuat arus dan daya lampu pada rangkaian seri vs paralel.
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
              Belum ada data pengukuran yang dicatat. Klik{" "}
              <strong className="text-[#23845B]">"Catat Pengukuran"</strong> di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F3F8FF] text-[#174A8B] border-b border-[#DCE6F1]">
                    <th className="p-2 font-semibold">No</th>
                    <th className="p-2 font-semibold">Tipe Rangkaian</th>
                    <th className="p-2 font-semibold">Sakelar</th>
                    <th className="p-2 font-semibold">Tegangan V</th>
                    <th className="p-2 font-semibold">R1 (Ω)</th>
                    <th className="p-2 font-semibold">R2 (Ω)</th>
                    <th className="p-2 font-semibold text-[#A96508]">R_total (Ω)</th>
                    <th className="p-2 font-semibold text-[#2583E8]">I_total (A)</th>
                    <th className="p-2 font-semibold text-[#23845B]">Daya P (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE6F1]">
                  {recordedData.map((d, index) => (
                    <tr key={d.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-2 font-mono text-[#617187]">{index + 1}</td>
                      <td className="p-2 font-medium">{d.mode}</td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            d.switchState === "Tertutup"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {d.switchState}
                        </span>
                      </td>
                      <td className="p-2 font-mono">{d.voltage}V</td>
                      <td className="p-2 font-mono">{d.r1}</td>
                      <td className="p-2 font-mono">{d.r2 || "-"}</td>
                      <td className="p-2 font-mono font-bold text-[#A96508]">{d.rTotal}</td>
                      <td className="p-2 font-mono font-bold text-[#2583E8] bg-[#F3F8FF]/50">
                        {d.currentTotal}
                      </td>
                      <td className="p-2 font-mono font-bold text-[#23845B]">{d.powerTotal}</td>
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
