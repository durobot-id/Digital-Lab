"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Plus,
  Minus,
  Table,
  LineChart,
  HelpCircle,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { TopicData } from "@/types";

interface MotionLabProps {
  topic: TopicData;
  onStateChange?: (state: any) => void;
}

interface DataPoint {
  id: number;
  time: number;
  force: number;
  mass: number;
  friction: string;
  acceleration: number;
  velocity: number;
  position: number;
}

export default function MotionLab({ topic, onStateChange }: MotionLabProps) {
  // Parameters
  const [force, setForce] = useState<number>(20); // Newton (-100 to 100)
  const [mass, setMass] = useState<number>(4); // kg (1 to 20)
  const [frictionMode, setFrictionMode] = useState<"none" | "low" | "high">("none");

  // Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(1.0); // meters (0 to 12)
  const [velocity, setVelocity] = useState<number>(0); // m/s
  const [time, setTime] = useState<number>(0); // seconds
  const [vHistory, setVHistory] = useState<{ t: number; v: number }[]>([
    { t: 0, v: 0 }
  ]);
  const [recordedData, setRecordedData] = useState<DataPoint[]>([]);
  const [showChart, setShowChart] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Friction coefficient
  const mu = frictionMode === "none" ? 0 : frictionMode === "low" ? 0.1 : 0.25;
  const g = 9.8;
  const normalForce = mass * g;
  const maxFriction = mu * normalForce;

  // Calculate Net Force and Acceleration
  let frictionForce = 0;
  if (frictionMode !== "none") {
    if (Math.abs(velocity) < 0.01 && Math.abs(force) <= maxFriction) {
      frictionForce = -force; // Static friction balances applied force
    } else {
      const dir = velocity !== 0 ? Math.sign(velocity) : Math.sign(force);
      frictionForce = -dir * maxFriction;
    }
  }

  let fNet = force + frictionForce;
  if (Math.abs(velocity) < 0.01 && Math.abs(force) <= maxFriction && frictionMode !== "none") {
    fNet = 0;
  }
  const acceleration = Number((fNet / mass).toFixed(2));

  // Sync state to parent / AI assistant
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        topic: "gaya-dan-gerak",
        parameters: {
          gayaDorong_N: force,
          massa_kg: mass,
          kondisiGesekan: frictionMode,
          koefisienGesek: mu
        },
        measurements: {
          gayaResultan_N: Number(fNet.toFixed(2)),
          percepatan_ms2: acceleration,
          kecepatan_ms: Number(velocity.toFixed(2)),
          posisi_m: Number(position.toFixed(2)),
          waktu_s: Number(time.toFixed(2))
        },
        activeExperimentStep: activeStep
      });
    }
  }, [force, mass, frictionMode, fNet, acceleration, velocity, position, time, activeStep, onStateChange, mu]);

  // Animation Loop
  const reqRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const stepSimulation = useCallback(
    (dt: number) => {
      setPosition((prevPos) => {
        setVelocity((prevVel) => {
          let newVel = prevVel + acceleration * dt;
          // Apply friction damping when force is zero
          if (force === 0 && frictionMode !== "none") {
            if (Math.abs(newVel) <= 0.05) newVel = 0;
          }
          let newPos = prevPos + newVel * dt;
          // Boundary bounce or stop
          if (newPos > 11.5) {
            newPos = 11.5;
            newVel = 0;
          } else if (newPos < 0.5) {
            newPos = 0.5;
            newVel = 0;
          }
          return Number(newVel.toFixed(3));
        });
        return Number((prevPos + velocity * dt).toFixed(3));
      });

      setTime((prevT) => {
        const nextT = Number((prevT + dt).toFixed(2));
        setVHistory((prev) => {
          const updated = [...prev, { t: nextT, v: Number(velocity.toFixed(2)) }];
          if (updated.length > 50) return updated.slice(-50);
          return updated;
        });
        return nextT;
      });
    },
    [acceleration, force, frictionMode, velocity]
  );

  useEffect(() => {
    if (!isRunning) {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Clamp elapsed time to prevent giant leap on tab inactive
      const dt = Math.min(elapsed, 0.05);
      stepSimulation(dt);

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isRunning, stepSimulation]);

  const handleReset = () => {
    setIsRunning(false);
    setPosition(1.0);
    setVelocity(0);
    setTime(0);
    setVHistory([{ t: 0, v: 0 }]);
  };

  const handleManualStep = () => {
    setIsRunning(false);
    stepSimulation(0.1);
  };

  const handleRecordData = () => {
    const newEntry: DataPoint = {
      id: Date.now(),
      time: Number(time.toFixed(2)),
      force,
      mass,
      friction: frictionMode === "none" ? "Licin (0)" : frictionMode === "low" ? "Rendah (0.1)" : "Kasar (0.25)",
      acceleration,
      velocity: Number(velocity.toFixed(2)),
      position: Number(position.toFixed(2))
    };
    setRecordedData((prev) => [...prev, newEntry]);
  };

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
              Panduan Langkah Eksperimen
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

      {/* Main 2D Simulation Canvas & Track */}
      <div className="bg-white rounded-xl border border-[#DCE6F1] shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DCE6F1]">
          <div>
            <h2 className="text-base font-bold text-[#174A8B]">
              Simulasi Lintasan 2D: Balok pada Lintasan Horizontal
            </h2>
            <p className="text-xs text-[#617187]">
              Skala visual 1 meter = 60 px. Sumbu positif mengarah ke kanan.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#F3F8FF] border border-[#DCE6F1] font-mono font-medium text-[#172B45]">
              t = {time.toFixed(1)} s
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#DDF0FF] border border-[#2583E8]/30 font-mono font-semibold text-[#174A8B]">
              a = {acceleration.toFixed(2)} m/s²
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FFF4C7] border border-[#FFD45A]/50 font-mono font-semibold text-[#A96508]">
              v = {velocity.toFixed(2)} m/s
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-[#DCE6F1] font-mono text-[#617187]">
              x = {position.toFixed(2)} m
            </span>
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div className="relative w-full h-64 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] rounded-lg border border-[#DCE6F1] overflow-hidden select-none">
          <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
              {/* Arrowhead markers */}
              <marker id="arrow-force" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#2583E8" />
              </marker>
              <marker id="arrow-friction" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#C43D4B" />
              </marker>
              <marker id="arrow-net" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#23845B" />
              </marker>
            </defs>
            <rect width="800" height="240" fill="url(#grid)" />

            {/* Floor / Track Base */}
            <rect x="0" y="160" width="800" height="80" fill={frictionMode === "none" ? "#E0F2FE" : frictionMode === "low" ? "#CBD5E1" : "#94A3B8"} />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#475569" strokeWidth="3" />

            {/* Floor Friction Texture Hatching if friction active */}
            {frictionMode !== "none" && (
              <g stroke="#64748B" strokeWidth="1" opacity="0.6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <line key={i} x1={i * 20} y1="162" x2={i * 20 - 10} y2="175" />
                ))}
              </g>
            )}

            {/* Ruler Meter Markings */}
            {Array.from({ length: 13 }).map((_, i) => {
              const xPos = 40 + i * 58;
              return (
                <g key={i}>
                  <line x1={xPos} y1="160" x2={xPos} y2="175" stroke="#334155" strokeWidth="2" />
                  <text x={xPos} y="190" fontSize="11" fill="#475569" textAnchor="middle" fontFamily="monospace">
                    {i}m
                  </text>
                  {/* Half meter tick */}
                  {i < 12 && (
                    <line x1={xPos + 29} y1="160" x2={xPos + 29} y2="168" stroke="#64748B" strokeWidth="1" />
                  )}
                </g>
              );
            })}

            {/* Dynamic Cart / Block */}
            {(() => {
              const cartX = 40 + position * 58;
              const cartWidth = 60 + (mass - 1) * 2; // Size grows slightly with mass
              const cartHeight = 50;
              const cartY = 160 - cartHeight;

              return (
                <g>
                  {/* Cart Body */}
                  <rect
                    x={cartX - cartWidth / 2}
                    y={cartY}
                    width={cartWidth}
                    height={cartHeight}
                    rx="6"
                    fill="#174A8B"
                    stroke="#0F2D54"
                    strokeWidth="2"
                    className="cursor-grab active:cursor-grabbing"
                  />
                  {/* Cart Label */}
                  <text
                    x={cartX}
                    y={cartY + 22}
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {mass} kg
                  </text>
                  <text
                    x={cartX}
                    y={cartY + 38}
                    fill="#DDF0FF"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    massa
                  </text>

                  {/* Wheels */}
                  <circle cx={cartX - cartWidth / 3} cy="156" r="7" fill="#334155" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx={cartX + cartWidth / 3} cy="156" r="7" fill="#334155" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Force Vectors */}
                  {/* 1. Applied Force (F) Vector */}
                  {force !== 0 && (
                    <g>
                      <line
                        x1={cartX}
                        y1={cartY + cartHeight / 2}
                        x2={cartX + force * 1.2}
                        y2={cartY + cartHeight / 2}
                        stroke="#2583E8"
                        strokeWidth="3.5"
                        markerEnd="url(#arrow-force)"
                      />
                      <text
                        x={cartX + force * 1.2}
                        y={cartY + cartHeight / 2 - 8}
                        fill="#174A8B"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        F = {force} N
                      </text>
                    </g>
                  )}

                  {/* 2. Friction Force (f) Vector */}
                  {frictionForce !== 0 && (
                    <g>
                      <line
                        x1={cartX}
                        y1="152"
                        x2={cartX + frictionForce * 1.2}
                        y2="152"
                        stroke="#C43D4B"
                        strokeWidth="3"
                        markerEnd="url(#arrow-friction)"
                      />
                      <text
                        x={cartX + frictionForce * 1.2}
                        y="144"
                        fill="#C43D4B"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        f = {Math.abs(Number(frictionForce.toFixed(1)))} N
                      </text>
                    </g>
                  )}

                  {/* 3. Resultant Force (F_net) Vector */}
                  {Math.abs(fNet) > 0.1 && (
                    <g>
                      <line
                        x1={cartX}
                        y1={cartY - 14}
                        x2={cartX + fNet * 1.0}
                        y2={cartY - 14}
                        stroke="#23845B"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        markerEnd="url(#arrow-net)"
                      />
                      <text
                        x={cartX + fNet * 1.0}
                        y={cartY - 20}
                        fill="#23845B"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        F_net = {fNet.toFixed(1)} N
                      </text>
                    </g>
                  )}
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Legend for Vectors */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs text-[#617187]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#2583E8] rounded-full"></span>
            <span>Gaya Dorong (F)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#C43D4B] rounded-full"></span>
            <span>Gaya Gesekan (f)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#23845B] rounded-full"></span>
            <span>Gaya Resultan (F_net)</span>
          </div>
        </div>

        {/* Playback Controls & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[#DCE6F1]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                isRunning
                  ? "bg-[#FFD45A] text-[#172B45] hover:bg-[#ffe082]"
                  : "bg-[#2583E8] text-white hover:bg-[#1f6fc7]"
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              {isRunning ? "Jeda Simulasi" : "Mulai Simulasi"}
            </button>

            <button
              onClick={handleManualStep}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#174A8B] bg-[#F3F8FF] hover:bg-[#DDF0FF] border border-[#DCE6F1] disabled:opacity-50"
              title="Maju 0.1 detik"
            >
              <StepForward className="w-4 h-4" />
              Satu Langkah
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#617187] hover:text-[#C43D4B] bg-white hover:bg-red-50 border border-[#DCE6F1]"
              title="Reset ke posisi awal"
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
              Catat Titik Data
            </button>
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border ${
                showChart
                  ? "bg-[#DDF0FF] border-[#2583E8] text-[#174A8B] font-semibold"
                  : "bg-white border-[#DCE6F1] text-[#617187]"
              }`}
            >
              <LineChart className="w-4 h-4" />
              Grafik v-t
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
              Tabel Data ({recordedData.length})
            </button>
          </div>
        </div>
      </div>

      {/* Control Sliders & Physics Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Force Slider (F) */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#2583E8]" />
              Gaya Dorong (F)
            </label>
            <span className="text-sm font-mono font-bold text-[#2583E8] bg-[#F3F8FF] px-2 py-0.5 rounded border border-[#DCE6F1]">
              {force} N
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-3">
            Tanda positif mendorong ke kanan (+), negatif ke kiri (-).
          </p>
          <input
            type="range"
            min="-60"
            max="60"
            step="5"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            className="w-full accent-[#2583E8] cursor-pointer"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[-40, -20, 0, 20, 40].map((val) => (
              <button
                key={val}
                onClick={() => setForce(val)}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                  force === val
                    ? "bg-[#2583E8] text-white border-[#2583E8]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
                }`}
              >
                {val}N
              </button>
            ))}
          </div>
        </div>

        {/* Mass Slider (m) */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#174A8B]" />
              Massa Benda (m)
            </label>
            <span className="text-sm font-mono font-bold text-[#174A8B] bg-[#F3F8FF] px-2 py-0.5 rounded border border-[#DCE6F1]">
              {mass} kg
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-3">
            Massa mempengaruhi inersia / kelembaman benda (a = F/m).
          </p>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-[#174A8B] cursor-pointer"
          />
          <div className="flex justify-between gap-1 mt-2">
            {[1, 2, 4, 8, 12].map((val) => (
              <button
                key={val}
                onClick={() => setMass(val)}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                  mass === val
                    ? "bg-[#174A8B] text-white border-[#174A8B]"
                    : "bg-[#F8FAFC] text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
                }`}
              >
                {val}kg
              </button>
            ))}
          </div>
        </div>

        {/* Friction Selector (μ) */}
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#172B45] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#A96508]" />
              Kondisi Gesekan (μ)
            </label>
            <span className="text-xs font-mono font-bold text-[#A96508] bg-[#FFF4C7] px-2 py-0.5 rounded border border-[#FFD45A]/40">
              μ = {mu}
            </span>
          </div>
          <p className="text-[11px] text-[#617187] mb-3">
            Gesekan menghambat gerak: f = μ × (m × g).
          </p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button
              onClick={() => setFrictionMode("none")}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                frictionMode === "none"
                  ? "bg-[#2583E8] text-white border-[#2583E8] shadow-xs"
                  : "bg-white text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
              }`}
            >
              Tanpa Gesekan
              <span className="block text-[10px] opacity-80">(Licin μ=0)</span>
            </button>
            <button
              onClick={() => setFrictionMode("low")}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                frictionMode === "low"
                  ? "bg-[#2583E8] text-white border-[#2583E8] shadow-xs"
                  : "bg-white text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
              }`}
            >
              Gesekan Rendah
              <span className="block text-[10px] opacity-80">(μ = 0.1)</span>
            </button>
            <button
              onClick={() => setFrictionMode("high")}
              className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                frictionMode === "high"
                  ? "bg-[#2583E8] text-white border-[#2583E8] shadow-xs"
                  : "bg-white text-[#617187] border-[#DCE6F1] hover:bg-[#F3F8FF]"
              }`}
            >
              Gesekan Kasar
              <span className="block text-[10px] opacity-80">(μ = 0.25)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time v-t Graph */}
      {showChart && (
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DCE6F1]">
            <div>
              <h3 className="text-xs font-bold text-[#174A8B] flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-[#2583E8]" />
                Grafik Kecepatan terhadap Waktu (v - t)
              </h3>
              <p className="text-[11px] text-[#617187]">
                Gradien kemiringan garis menunjukkan percepatan benda: a = Δv / Δt.
              </p>
            </div>
            <button
              onClick={() => setVHistory([{ t: time, v: velocity }])}
              className="text-[11px] text-[#617187] hover:text-[#172B45] underline"
            >
              Bersihkan Grafik
            </button>
          </div>

          <div className="h-44 w-full bg-[#F8FAFC] rounded-lg border border-[#DCE6F1] p-2 relative">
            <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
              {/* Center Zero Line */}
              <line x1="40" y1="70" x2="490" y2="70" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3" />
              <text x="32" y="74" fontSize="9" fill="#64748B" textAnchor="end">
                0
              </text>
              <text x="32" y="20" fontSize="9" fill="#2583E8" textAnchor="end">
                +10
              </text>
              <text x="32" y="125" fontSize="9" fill="#C43D4B" textAnchor="end">
                -10
              </text>
              <text x="495" y="66" fontSize="9" fill="#64748B">
                t (s)
              </text>
              <text x="45" y="14" fontSize="9" fill="#174A8B" fontWeight="bold">
                v (m/s)
              </text>

              {/* Data Polyline */}
              {vHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#2583E8"
                  strokeWidth="2.5"
                  points={vHistory
                    .map((pt, i) => {
                      const x = 40 + (i / Math.max(vHistory.length - 1, 1)) * 440;
                      // map v (-10 to +10) to y (125 to 15)
                      const clampedV = Math.max(-10, Math.min(10, pt.v));
                      const y = 70 - (clampedV / 10) * 55;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}
            </svg>
          </div>
        </div>
      )}

      {/* Observation Data Table */}
      {showTable && (
        <div className="bg-white rounded-xl border border-[#DCE6F1] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DCE6F1]">
            <div>
              <h3 className="text-xs font-bold text-[#174A8B] flex items-center gap-1.5">
                <Table className="w-4 h-4 text-[#23845B]" />
                Tabel Catatan Pengamatan Eksperimen
              </h3>
              <p className="text-[11px] text-[#617187]">
                Gunakan data ini untuk memverifikasi kesesuaian nilai terukur dengan rumus F = m × a.
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
              Belum ada data eksperimen yang dicatat. Tekan tombol{" "}
              <strong className="text-[#23845B]">"Catat Titik Data"</strong> di atas saat simulasi berjalan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F3F8FF] text-[#174A8B] border-b border-[#DCE6F1]">
                    <th className="p-2 font-semibold">No</th>
                    <th className="p-2 font-semibold">Waktu (s)</th>
                    <th className="p-2 font-semibold">Gaya Dorong F (N)</th>
                    <th className="p-2 font-semibold">Massa m (kg)</th>
                    <th className="p-2 font-semibold">Gesekan</th>
                    <th className="p-2 font-semibold text-[#2583E8]">Percepatan a (m/s²)</th>
                    <th className="p-2 font-semibold text-[#A96508]">Kecepatan v (m/s)</th>
                    <th className="p-2 font-semibold">Posisi x (m)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE6F1]">
                  {recordedData.map((d, index) => (
                    <tr key={d.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-2 font-mono text-[#617187]">{index + 1}</td>
                      <td className="p-2 font-mono">{d.time}</td>
                      <td className="p-2 font-mono font-medium">{d.force}</td>
                      <td className="p-2 font-mono font-medium">{d.mass}</td>
                      <td className="p-2 text-[#617187]">{d.friction}</td>
                      <td className="p-2 font-mono font-bold text-[#2583E8] bg-[#F3F8FF]/50">
                        {d.acceleration}
                      </td>
                      <td className="p-2 font-mono font-medium text-[#A96508]">{d.velocity}</td>
                      <td className="p-2 font-mono">{d.position}</td>
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
