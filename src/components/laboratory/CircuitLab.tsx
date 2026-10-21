"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Plus,
  Trash2,
  Table,
  Zap,
  Sliders,
  Power,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  MousePointer,
  Cable,
  FolderOpen
} from "lucide-react";
import { TopicData } from "@/types";
import {
  playClickSound,
  playSwitchSound,
  playConnectWireSound,
  playSparkSound,
  playSuccessChime
} from "@/lib/audio";

interface CircuitLabProps {
  topic: TopicData;
  onStateChange?: (state: any) => void;
}

export type ComponentType = "battery" | "lamp" | "switch" | "resistor" | "ammeter";

export interface Terminal {
  id: string; // e.g. "comp-1-t1"
  label: string; // "+" or "-" or "1" or "2"
  relX: number;
  relY: number;
}

export interface PlacedComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  label: string;
  voltage?: number; // for battery
  resistance?: number; // for lamp / resistor
  isClosed?: boolean; // for switch
  terminals: Terminal[];
}

export interface Wire {
  id: string;
  fromCompId: string;
  fromTermId: string;
  toCompId: string;
  toTermId: string;
}

export default function CircuitLab({ topic, onStateChange }: CircuitLabProps) {
  const [sparkCoords, setSparkCoords] = useState<{ x: number; y: number } | null>(null);
  const prevClosedLoopRef = useRef<boolean>(true);
  // Preset or custom components
  const [components, setComponents] = useState<PlacedComponent[]>([
    {
      id: "bat-1",
      type: "battery",
      x: 140,
      y: 160,
      label: "Baterai 12V",
      voltage: 12,
      terminals: [
        { id: "bat-1-pos", label: "+", relX: 45, relY: -28 },
        { id: "bat-1-neg", label: "-", relX: -45, relY: -28 }
      ]
    },
    {
      id: "sw-1",
      type: "switch",
      x: 340,
      y: 70,
      label: "Sakelar",
      isClosed: false,
      terminals: [
        { id: "sw-1-t1", label: "A", relX: -40, relY: 0 },
        { id: "sw-1-t2", label: "B", relX: 40, relY: 0 }
      ]
    },
    {
      id: "lamp-1",
      type: "lamp",
      x: 560,
      y: 160,
      label: "Lampu 1 (10Ω)",
      resistance: 10,
      terminals: [
        { id: "lamp-1-t1", label: "1", relX: -35, relY: 28 },
        { id: "lamp-1-t2", label: "2", relX: 35, relY: 28 }
      ]
    }
  ]);

  // Initial wires empty so user connects them manually
  const [wires, setWires] = useState<Wire[]>([]);
  const [conductingCompIds, setConductingCompIds] = useState<Set<string>>(new Set());
  const [conductingWireIds, setConductingWireIds] = useState<Set<string>>(new Set());

  const [selectedCompId, setSelectedCompId] = useState<string | null>("bat-1");
  const [activeWiringPin, setActiveWiringPin] = useState<{
    compId: string;
    termId: string;
  } | null>(null);

  // Dragging state
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Simulation output
  const [circuitStats, setCircuitStats] = useState({
    isClosedLoop: false,
    currentTotal: 0,
    voltageSource: 0,
    resistanceTotal: 0,
    powerTotal: 0
  });

  // Calculate Circuit Loop State & Active Conducting Elements
  useEffect(() => {
    const battery = components.find((c) => c.type === "battery");
    if (!battery) {
      setConductingCompIds(new Set());
      setConductingWireIds(new Set());
      setCircuitStats({
        isClosedLoop: false,
        currentTotal: 0,
        voltageSource: 0,
        resistanceTotal: 0,
        powerTotal: 0
      });
      return;
    }

    const posPinId = `${battery.id}-pos`;
    const negPinId = `${battery.id}-neg`;

    // 1. Build adjacency graph between component terminals
    const adj: Record<string, string[]> = {};
    const addEdge = (u: string, v: string) => {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push(v);
      adj[v].push(u);
    };

    // Wires create edges between terminals
    wires.forEach((w) => {
      addEdge(w.fromTermId, w.toTermId);
    });

    // Internal component continuity
    components.forEach((c) => {
      if (c.type === "switch") {
        if (c.isClosed) {
          addEdge(`${c.id}-t1`, `${c.id}-t2`);
        }
      } else if (c.type === "lamp" || c.type === "resistor" || c.type === "ammeter") {
        addEdge(`${c.id}-t1`, `${c.id}-t2`);
      }
    });

    // Reachability helper with optional edge skip
    const canReach = (
      start: string,
      target: string,
      skipEdge?: { u: string; v: string }
    ): boolean => {
      if (start === target) return true;
      const visited = new Set<string>([start]);
      const queue: string[] = [start];
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (curr === target) return true;
        for (const next of adj[curr] || []) {
          if (skipEdge) {
            if (
              (curr === skipEdge.u && next === skipEdge.v) ||
              (curr === skipEdge.v && next === skipEdge.u)
            ) {
              continue;
            }
          }
          if (!visited.has(next)) {
            visited.add(next);
            queue.push(next);
          }
        }
      }
      return false;
    };

    // 2. Check if circuit is a closed loop between battery positive and negative
    const isClosed = canReach(posPinId, negPinId);

    if (!isClosed) {
      setConductingCompIds(new Set());
      setConductingWireIds(new Set());
      setCircuitStats({
        isClosedLoop: false,
        currentTotal: 0,
        voltageSource: battery.voltage || 12,
        resistanceTotal: 0,
        powerTotal: 0
      });
      prevClosedLoopRef.current = false;
      return;
    }

    // 3. Circuit is closed! Now verify which EXACT components and wires carry current
    const activeComps = new Set<string>();
    activeComps.add(battery.id);

    components.forEach((c) => {
      if (c.type === "switch") {
        if (c.isClosed) {
          const t1 = `${c.id}-t1`;
          const t2 = `${c.id}-t2`;
          const skip = { u: t1, v: t2 };
          if (
            (canReach(posPinId, t1, skip) && canReach(negPinId, t2, skip)) ||
            (canReach(posPinId, t2, skip) && canReach(negPinId, t1, skip))
          ) {
            activeComps.add(c.id);
          }
        }
      } else if (c.type === "lamp" || c.type === "resistor" || c.type === "ammeter") {
        const t1 = `${c.id}-t1`;
        const t2 = `${c.id}-t2`;
        const skip = { u: t1, v: t2 };
        if (
          (canReach(posPinId, t1, skip) && canReach(negPinId, t2, skip)) ||
          (canReach(posPinId, t2, skip) && canReach(negPinId, t1, skip))
        ) {
          activeComps.add(c.id);
        }
      }
    });

    const activeWires = new Set<string>();
    wires.forEach((w) => {
      const skip = { u: w.fromTermId, v: w.toTermId };
      if (
        (canReach(posPinId, w.fromTermId, skip) && canReach(negPinId, w.toTermId, skip)) ||
        (canReach(posPinId, w.toTermId, skip) && canReach(negPinId, w.fromTermId, skip))
      ) {
        activeWires.add(w.id);
      }
    });

    // 4. Calculate total resistance of ONLY actively conducting components
    let totalR = 0;
    components.forEach((c) => {
      if (activeComps.has(c.id)) {
        if (c.type === "lamp" || c.type === "resistor") {
          totalR += c.resistance || 10;
        }
      }
    });

    if (totalR === 0) totalR = 0.5; // Wire safety internal resistance to prevent division by zero
    const v = battery.voltage || 12;
    const current = Number((v / totalR).toFixed(2));
    const power = Number((v * current).toFixed(2));

    if (!prevClosedLoopRef.current && isClosed && current > 0) {
      playSuccessChime();
      playSparkSound();
    }
    prevClosedLoopRef.current = isClosed && current > 0;

    setConductingCompIds(activeComps);
    setConductingWireIds(activeWires);
    setCircuitStats({
      isClosedLoop: isClosed,
      currentTotal: current,
      voltageSource: v,
      resistanceTotal: totalR,
      powerTotal: power
    });

    if (onStateChange) {
      onStateChange({
        topic: "kelistrikan",
        parameters: {
          teganganBaterai_V: v,
          hambatanTotal_Ohm: totalR,
          jumlahKomponen: components.length,
          jumlahKabel: wires.length,
          statusLoop: isClosed ? "Tertutup (Arus Mengalir)" : "Terbuka (Arus Nol)"
        },
        measurements: {
          hambatanTotal_Ohm: totalR,
          kuatArusTotal_A: current,
          dayaTotal_W: power
        }
      });
    }
  }, [components, wires, onStateChange]);

  // Handle Dragging Components
  const handlePointerDown = (e: React.PointerEvent, comp: PlacedComponent) => {
    // If clicking a terminal pin, let pin handler take over
    if ((e.target as HTMLElement).getAttribute("data-pin")) return;

    setSelectedCompId(comp.id);
    setDraggingCompId(comp.id);

    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    dragOffsetRef.current = {
      x: clientX - comp.x,
      y: clientY - comp.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingCompId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const newX = Math.max(60, Math.min(740, clientX - dragOffsetRef.current.x));
    const newY = Math.max(50, Math.min(340, clientY - dragOffsetRef.current.y));

    setComponents((prev) =>
      prev.map((c) => (c.id === draggingCompId ? { ...c, x: newX, y: newY } : c))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingCompId) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDraggingCompId(null);
    }
  };

  // Handle Connecting Wires Between Terminal Pins
  const handlePinClick = (compId: string, termId: string) => {
    if (!activeWiringPin) {
      // First terminal selected
      playClickSound();
      setActiveWiringPin({ compId, termId });
    } else {
      // Second terminal clicked -> create wire if from different pin
      if (activeWiringPin.termId === termId) {
        setActiveWiringPin(null);
        return;
      }

      // Check if wire already exists
      const exists = wires.some(
        (w) =>
          (w.fromTermId === activeWiringPin.termId && w.toTermId === termId) ||
          (w.fromTermId === termId && w.toTermId === activeWiringPin.termId)
      );

      if (!exists) {
        const newWire: Wire = {
          id: `wire-${Date.now()}`,
          fromCompId: activeWiringPin.compId,
          fromTermId: activeWiringPin.termId,
          toCompId: compId,
          toTermId: termId
        };
        setWires((prev) => [...prev, newWire]);
        playConnectWireSound();
        const pinCoords = getPinCoords(termId);
        setSparkCoords(pinCoords);
        setTimeout(() => setSparkCoords(null), 500);
      }
      setActiveWiringPin(null);
    }
  };

  // Add Component to Workbench
  const addComponent = (type: ComponentType) => {
    playClickSound();
    const id = `${type}-${Date.now()}`;
    let newComp: PlacedComponent;

    const spawnX = 200 + (components.length % 5) * 60;
    const spawnY = 150 + ((components.length * 20) % 80);

    if (type === "battery") {
      newComp = {
        id,
        type: "battery",
        x: spawnX,
        y: spawnY,
        label: "Baterai 12V",
        voltage: 12,
        terminals: [
          { id: `${id}-pos`, label: "+", relX: 45, relY: -28 },
          { id: `${id}-neg`, label: "-", relX: -45, relY: -28 }
        ]
      };
    } else if (type === "lamp") {
      newComp = {
        id,
        type: "lamp",
        x: spawnX,
        y: spawnY,
        label: `Lampu (${10}Ω)`,
        resistance: 10,
        terminals: [
          { id: `${id}-t1`, label: "1", relX: -35, relY: 28 },
          { id: `${id}-t2`, label: "2", relX: 35, relY: 28 }
        ]
      };
    } else if (type === "switch") {
      newComp = {
        id,
        type: "switch",
        x: spawnX,
        y: spawnY,
        label: "Sakelar",
        isClosed: false,
        terminals: [
          { id: `${id}-t1`, label: "A", relX: -40, relY: 0 },
          { id: `${id}-t2`, label: "B", relX: 40, relY: 0 }
        ]
      };
    } else if (type === "resistor") {
      newComp = {
        id,
        type: "resistor",
        x: spawnX,
        y: spawnY,
        label: "Resistor (20Ω)",
        resistance: 20,
        terminals: [
          { id: `${id}-t1`, label: "1", relX: -40, relY: 0 },
          { id: `${id}-t2`, label: "2", relX: 40, relY: 0 }
        ]
      };
    } else {
      newComp = {
        id,
        type: "ammeter",
        x: spawnX,
        y: spawnY,
        label: "Ammeter",
        terminals: [
          { id: `${id}-t1`, label: "+", relX: -35, relY: 0 },
          { id: `${id}-t2`, label: "-", relX: 35, relY: 0 }
        ]
      };
    }

    setComponents((prev) => [...prev, newComp]);
    setSelectedCompId(id);
  };

  // Remove Selected Component
  const deleteSelected = () => {
    if (!selectedCompId) return;
    playClickSound();
    setComponents((prev) => prev.filter((c) => c.id !== selectedCompId));
    setWires((prev) =>
      prev.filter(
        (w) => w.fromCompId !== selectedCompId && w.toCompId !== selectedCompId
      )
    );
    setSelectedCompId(null);
  };

  // Toggle Switch
  const toggleSwitch = (switchId: string) => {
    playSwitchSound();
    setComponents((prev) =>
      prev.map((c) => (c.id === switchId ? { ...c, isClosed: !c.isClosed } : c))
    );
  };

  // Preset Loaders
  const loadPresetSeries = () => {
    playClickSound();
    setComponents([
      {
        id: "bat-1",
        type: "battery",
        x: 140,
        y: 200,
        label: "Baterai 12V",
        voltage: 12,
        terminals: [
          { id: "bat-1-pos", label: "+", relX: 45, relY: -28 },
          { id: "bat-1-neg", label: "-", relX: -45, relY: -28 }
        ]
      },
      {
        id: "sw-1",
        type: "switch",
        x: 280,
        y: 90,
        label: "Sakelar",
        isClosed: true,
        terminals: [
          { id: "sw-1-t1", label: "A", relX: -40, relY: 0 },
          { id: "sw-1-t2", label: "B", relX: 40, relY: 0 }
        ]
      },
      {
        id: "lamp-1",
        type: "lamp",
        x: 460,
        y: 90,
        label: "Lampu 1 (10Ω)",
        resistance: 10,
        terminals: [
          { id: "lamp-1-t1", label: "1", relX: -35, relY: 28 },
          { id: "lamp-1-t2", label: "2", relX: 35, relY: 28 }
        ]
      },
      {
        id: "lamp-2",
        type: "lamp",
        x: 620,
        y: 200,
        label: "Lampu 2 (10Ω)",
        resistance: 10,
        terminals: [
          { id: "lamp-2-t1", label: "1", relX: -35, relY: 28 },
          { id: "lamp-2-t2", label: "2", relX: 35, relY: 28 }
        ]
      }
    ]);
    setWires([
      { id: "w1", fromCompId: "bat-1", fromTermId: "bat-1-pos", toCompId: "sw-1", toTermId: "sw-1-t1" },
      { id: "w2", fromCompId: "sw-1", fromTermId: "sw-1-t2", toCompId: "lamp-1", toTermId: "lamp-1-t1" },
      { id: "w3", fromCompId: "lamp-1", fromTermId: "lamp-1-t2", toCompId: "lamp-2", toTermId: "lamp-2-t1" },
      { id: "w4", fromCompId: "lamp-2", fromTermId: "lamp-2-t2", toCompId: "bat-1", toTermId: "bat-1-neg" }
    ]);
  };

  const loadPresetParallel = () => {
    playClickSound();
    setComponents([
      {
        id: "bat-1",
        type: "battery",
        x: 140,
        y: 190,
        label: "Baterai 12V",
        voltage: 12,
        terminals: [
          { id: "bat-1-pos", label: "+", relX: 45, relY: -28 },
          { id: "bat-1-neg", label: "-", relX: -45, relY: -28 }
        ]
      },
      {
        id: "sw-1",
        type: "switch",
        x: 320,
        y: 70,
        label: "Sakelar Utama",
        isClosed: true,
        terminals: [
          { id: "sw-1-t1", label: "A", relX: -40, relY: 0 },
          { id: "sw-1-t2", label: "B", relX: 40, relY: 0 }
        ]
      },
      {
        id: "lamp-1",
        type: "lamp",
        x: 540,
        y: 110,
        label: "Lampu Cabang 1 (10Ω)",
        resistance: 10,
        terminals: [
          { id: "lamp-1-t1", label: "1", relX: -35, relY: 28 },
          { id: "lamp-1-t2", label: "2", relX: 35, relY: 28 }
        ]
      },
      {
        id: "lamp-2",
        type: "lamp",
        x: 540,
        y: 260,
        label: "Lampu Cabang 2 (10Ω)",
        resistance: 10,
        terminals: [
          { id: "lamp-2-t1", label: "1", relX: -35, relY: 28 },
          { id: "lamp-2-t2", label: "2", relX: 35, relY: 28 }
        ]
      }
    ]);
    setWires([
      { id: "w1", fromCompId: "bat-1", fromTermId: "bat-1-pos", toCompId: "sw-1", toTermId: "sw-1-t1" },
      { id: "w2", fromCompId: "sw-1", fromTermId: "sw-1-t2", toCompId: "lamp-1", toTermId: "lamp-1-t1" },
      { id: "w3", fromCompId: "sw-1", fromTermId: "sw-1-t2", toCompId: "lamp-2", toTermId: "lamp-2-t1" },
      { id: "w4", fromCompId: "lamp-1", fromTermId: "lamp-1-t2", toCompId: "bat-1", toTermId: "bat-1-neg" },
      { id: "w5", fromCompId: "lamp-2", fromTermId: "lamp-2-t2", toCompId: "bat-1", toTermId: "bat-1-neg" }
    ]);
  };

  const clearCanvas = () => {
    playClickSound();
    setComponents([]);
    setWires([]);
    setSelectedCompId(null);
  };

  // Helper to get absolute coordinates of a terminal pin
  const getPinCoords = (termId: string) => {
    for (const c of components) {
      const term = c.terminals.find((t) => t.id === termId);
      if (term) {
        return { x: c.x + term.relX, y: c.y + term.relY };
      }
    }
    return { x: 0, y: 0 };
  };

  const selectedComp = components.find((c) => c.id === selectedCompId);

  return (
    <div className="flex flex-col gap-6">
      {/* Workbench Action Toolbar */}
      <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Component Spawner Tray */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#174A8B] mr-1 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#2583E8]" />
            Ambil Komponen:
          </span>
          <button
            onClick={() => addComponent("battery")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F3F8FF] text-[#174A8B] border border-[#DCE6F1] hover:bg-[#DDF0FF] hover:border-[#2583E8] transition-all"
          >
            🔋 + Baterai
          </button>
          <button
            onClick={() => addComponent("lamp")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F3F8FF] text-[#174A8B] border border-[#DCE6F1] hover:bg-[#DDF0FF] hover:border-[#2583E8] transition-all"
          >
            💡 + Lampu
          </button>
          <button
            onClick={() => addComponent("switch")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F3F8FF] text-[#174A8B] border border-[#DCE6F1] hover:bg-[#DDF0FF] hover:border-[#2583E8] transition-all"
          >
            ⚡ + Sakelar
          </button>
          <button
            onClick={() => addComponent("resistor")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F3F8FF] text-[#174A8B] border border-[#DCE6F1] hover:bg-[#DDF0FF] hover:border-[#2583E8] transition-all"
          >
            🟫 + Resistor
          </button>
        </div>

        {/* Templates & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadPresetSeries}
            className="text-xs px-3 py-1.5 rounded-xl font-medium bg-white border border-[#DCE6F1] text-[#617187] hover:text-[#174A8B] hover:bg-[#F3F8FF]"
          >
            Susun Seri
          </button>
          <button
            onClick={loadPresetParallel}
            className="text-xs px-3 py-1.5 rounded-xl font-medium bg-white border border-[#DCE6F1] text-[#617187] hover:text-[#174A8B] hover:bg-[#F3F8FF]"
          >
            Susun Paralel
          </button>
          <button
            onClick={clearCanvas}
            className="text-xs px-3 py-1.5 rounded-xl font-medium bg-white border border-[#DCE6F1] text-[#C43D4B] hover:bg-red-50"
            title="Bersihkan meja kerja"
          >
            Kosongkan
          </button>
        </div>
      </div>

      {/* Main Interactive Breadboard / Canvas */}
      <div className="bg-white rounded-2xl border border-[#DCE6F1] shadow-xs p-5">
        {/* Canvas Status & Multimeter Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DCE6F1]">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                circuitStats.isClosedLoop ? "bg-emerald-500 animate-pulse" : "bg-red-400"
              }`}
            ></span>
            <span className="text-xs font-bold text-[#172B45]">
              {circuitStats.isClosedLoop
                ? "Rangkaian Tertutup (Arus Mengalir)"
                : "Rangkaian Terbuka (Arus Terputus / Belum Tersambung)"}
            </span>
          </div>

          {/* Multimeter Digital Readout */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-[#F3F8FF] border border-[#DCE6F1] text-[#174A8B] font-semibold">
              V = {circuitStats.voltageSource} V
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#DDF0FF] border border-[#2583E8]/30 text-[#174A8B] font-bold">
              I = {circuitStats.currentTotal} A
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FFF4C7] border border-[#FFD45A]/50 text-[#A96508] font-bold">
              R_total = {circuitStats.resistanceTotal} Ω
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-[#DCE6F1] text-[#23845B] font-bold">
              P = {circuitStats.powerTotal} W
            </span>
          </div>
        </div>

        {/* Tip for User */}
        <div className="mb-3 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#DCE6F1] text-[11px] text-[#617187] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-[#2583E8]" />
            <span>
              <strong>Cara Sambung Kabel:</strong> Klik pin terminal bulat (merah/biru) pada komponen pertama, lalu klik pin terminal komponen tujuan. Seret komponen untuk memindahkannya.
            </span>
          </div>
          {activeWiringPin && (
            <span className="px-2 py-0.5 rounded bg-[#FFD45A] text-[#172B45] font-bold text-[10px] animate-pulse">
              Pin Terpilih: Klik pin tujuan untuk menyambung!
            </span>
          )}
        </div>

        {/* SVG Interactive Canvas */}
        <div className="relative w-full h-96 bg-[#F8FAFC] rounded-xl border border-[#DCE6F1] overflow-hidden select-none">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-default"
            viewBox="0 0 800 380"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Dot Grid & Effects */}
            <defs>
              <pattern id="work-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#CBD5E1" />
              </pattern>
              {/* Radial glow filter for lamp */}
              <filter id="bulb-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Embedded Dynamic CSS for Realistic Fluid Motion */}
            <style>{`
              @keyframes electronStream {
                from { stroke-dashoffset: 40; }
                to { stroke-dashoffset: 0; }
              }
              .running-electrons {
                stroke-dasharray: 8 12;
                animation: electronStream 0.65s linear infinite;
              }
              @keyframes sparkBurstAnim {
                0% { transform: scale(0.3) rotate(0deg); opacity: 1; }
                100% { transform: scale(1.8) rotate(45deg); opacity: 0; }
              }
              .spark-anim {
                animation: sparkBurstAnim 0.45s ease-out forwards;
              }
            `}</style>

            <rect width="800" height="380" fill="url(#work-grid)" />

            {/* Render Wires */}
            {wires.map((w) => {
              const start = getPinCoords(w.fromTermId);
              const end = getPinCoords(w.toTermId);
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              // Smooth curved wire
              const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY + (end.y - start.y) * 0.2} ${end.x} ${end.y}`;

              return (
                <g key={w.id} className="group cursor-pointer">
                  {/* Clickable hit area to delete wire */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="18"
                    onClick={() => {
                      playClickSound();
                      setWires((prev) => prev.filter((item) => item.id !== w.id));
                    }}
                  />
                  {/* Wire core shadow / outer casing */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={circuitStats.isClosedLoop ? "#1D4ED8" : "#94A3B8"}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Inner Wire Core */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={circuitStats.isClosedLoop ? "#60A5FA" : "#CBD5E1"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Dynamic Running Electron Flow when closed circuit */}
                  {circuitStats.isClosedLoop && circuitStats.currentTotal > 0 && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#FDE047"
                      strokeWidth="3"
                      className="running-electrons"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}

            {/* Spark Effect Burst upon wire connection */}
            {sparkCoords && (
              <g transform={`translate(${sparkCoords.x}, ${sparkCoords.y})`} className="spark-anim pointer-events-none">
                <circle cx="0" cy="0" r="10" fill="#FFD45A" opacity="0.9" />
                <line x1="-16" y1="0" x2="16" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="0" y1="-16" x2="0" y2="16" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="-12" y1="-12" x2="12" y2="12" stroke="#F59E0B" strokeWidth="2" />
                <line x1="-12" y1="12" x2="12" y2="-12" stroke="#F59E0B" strokeWidth="2" />
              </g>
            )}

            {/* Render Placed Components */}
            {components.map((c) => {
              const isSelected = selectedCompId === c.id;

              return (
                <g
                  key={c.id}
                  transform={`translate(${c.x}, ${c.y})`}
                  onPointerDown={(e) => handlePointerDown(e, c)}
                  className="cursor-move"
                >
                  {/* Selection Highlight */}
                  {isSelected && (
                    <rect
                      x="-55"
                      y="-45"
                      width="110"
                      height="90"
                      rx="14"
                      fill="#DDF0FF"
                      fillOpacity="0.35"
                      stroke="#2583E8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* BATTERY COMPONENT */}
                  {c.type === "battery" && (
                    <g>
                      <rect x="-40" y="-25" width="80" height="50" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                      <rect x="-10" y="-32" width="20" height="8" rx="2" fill="#F59E0B" />
                      {/* Polarity markers */}
                      <text x="24" y="-12" fill="#EF4444" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                        +
                      </text>
                      <text x="-24" y="-12" fill="#60A5FA" fontSize="14" fontWeight="extrabold" textAnchor="middle">
                        -
                      </text>
                      <text x="0" y="7" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                        {c.voltage}V
                      </text>
                      <text x="0" y="38" fill="#174A8B" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {c.label}
                      </text>
                    </g>
                  )}

                  {/* LAMP BULB COMPONENT */}
                  {c.type === "lamp" && (
                    <g>
                      {/* Dynamic Radiant Halo & Beams if current flowing */}
                      {circuitStats.isClosedLoop && circuitStats.currentTotal > 0 && (
                        <g>
                          <circle cx="0" cy="-10" r="50" fill="#FDE047" fillOpacity="0.32" filter="url(#bulb-glow)" className="animate-pulse" />
                          <circle cx="0" cy="-10" r="34" fill="#FEF08A" fillOpacity="0.5" />
                          {/* Light Rays */}
                          {[-45, -90, -135, 45, 90, 135].map((deg) => (
                            <line
                              key={deg}
                              x1={35 * Math.cos((deg * Math.PI) / 180)}
                              y1={-10 + 35 * Math.sin((deg * Math.PI) / 180)}
                              x2={48 * Math.cos((deg * Math.PI) / 180)}
                              y2={-10 + 48 * Math.sin((deg * Math.PI) / 180)}
                              stroke="#F59E0B"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              opacity="0.85"
                            />
                          ))}
                        </g>
                      )}
                      {/* Glass bulb shell */}
                      <circle
                        cx="0"
                        cy="-10"
                        r="24"
                        fill={circuitStats.isClosedLoop && circuitStats.currentTotal > 0 ? "#FFFBEB" : "#F8FAFC"}
                        stroke={circuitStats.isClosedLoop && circuitStats.currentTotal > 0 ? "#F59E0B" : "#475569"}
                        strokeWidth="2.5"
                      />
                      {/* Tungsten Filament */}
                      <path
                        d="M -7 5 L -4 -10 L 0 -4 L 4 -10 L 7 5"
                        fill="none"
                        stroke={circuitStats.isClosedLoop && circuitStats.currentTotal > 0 ? "#DC2626" : "#94A3B8"}
                        strokeWidth={circuitStats.isClosedLoop && circuitStats.currentTotal > 0 ? "2.5" : "2"}
                      />
                      {/* Lamp base screw & contact */}
                      <rect x="-12" y="5" width="24" height="15" rx="3" fill="#64748B" stroke="#475569" strokeWidth="1" />
                      <line x1="-12" y1="10" x2="12" y2="10" stroke="#94A3B8" strokeWidth="1" />
                      <line x1="-12" y1="14" x2="12" y2="14" stroke="#94A3B8" strokeWidth="1" />
                      <text x="0" y="34" fill="#172B45" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {c.label}
                      </text>
                    </g>
                  )}

                  {/* SWITCH COMPONENT */}
                  {c.type === "switch" && (
                    <g onClick={() => toggleSwitch(c.id)} className="cursor-pointer group">
                      <rect
                        x="-45"
                        y="-18"
                        width="90"
                        height="36"
                        rx="8"
                        fill={c.isClosed ? "#F0FDF4" : "#FEF2F2"}
                        stroke={c.isClosed ? "#22C55E" : "#F87171"}
                        strokeWidth="2"
                      />
                      {/* Terminal studs */}
                      <circle cx="-25" cy="0" r="5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                      <circle cx="25" cy="0" r="5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                      {/* Lever Arm */}
                      <line
                        x1="-25"
                        y1="0"
                        x2={c.isClosed ? 25 : 15}
                        y2={c.isClosed ? 0 : -24}
                        stroke={c.isClosed ? "#16A34A" : "#DC2626"}
                        strokeWidth="5"
                        strokeLinecap="round"
                        className="transition-all duration-200"
                      />
                      <circle
                        cx={c.isClosed ? 25 : 15}
                        cy={c.isClosed ? 0 : -24}
                        r="4"
                        fill={c.isClosed ? "#15803D" : "#B91C1C"}
                        className="transition-all duration-200"
                      />
                      <text
                        x="0"
                        y="32"
                        fill={c.isClosed ? "#15803D" : "#B91C1C"}
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {c.isClosed ? "Sakelar ON (Klik)" : "Sakelar OFF (Klik)"}
                      </text>
                    </g>
                  )}

                  {/* RESISTOR COMPONENT */}
                  {c.type === "resistor" && (
                    <g>
                      <rect x="-35" y="-15" width="70" height="30" rx="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
                      {/* Color code bands */}
                      <line x1="-20" y1="-15" x2="-20" y2="15" stroke="#EA580C" strokeWidth="4" />
                      <line x1="-5" y1="-15" x2="-5" y2="15" stroke="#3B82F6" strokeWidth="4" />
                      <line x1="10" y1="-15" x2="10" y2="15" stroke="#10B981" strokeWidth="4" />
                      <line x1="22" y1="-15" x2="22" y2="15" stroke="#F59E0B" strokeWidth="3" />
                      <text x="0" y="32" fill="#172B45" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {c.label}
                      </text>
                    </g>
                  )}

                  {/* TERMINAL PINS (FOR CONNECTING WIRES) */}
                  {c.terminals.map((term) => {
                    const isPinActive = activeWiringPin?.termId === term.id;

                    return (
                      <g
                        key={term.id}
                        transform={`translate(${term.relX}, ${term.relY})`}
                        data-pin="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinClick(c.id, term.id);
                        }}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={isPinActive ? "8" : "6"}
                          fill={isPinActive ? "#FFD45A" : term.label === "+" ? "#EF4444" : "#2583E8"}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="hover:scale-125 transition-transform"
                        />
                        <text
                          x="0"
                          y="-10"
                          fontSize="9"
                          fill="#174A8B"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          {term.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Component Parameter Adjuster */}
        {selectedComp && (
          <div className="mt-4 p-4 rounded-xl bg-[#F3F8FF] border border-[#DCE6F1] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#174A8B]">
                Komponen Terpilih: <strong>{selectedComp.label}</strong>
              </span>

              {/* Adjust Voltage */}
              {selectedComp.type === "battery" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#617187]">Tegangan:</label>
                  {[3, 6, 9, 12, 24].map((v) => (
                    <button
                      key={v}
                      onClick={() =>
                        setComponents((prev) =>
                          prev.map((c) =>
                            c.id === selectedComp.id ? { ...c, voltage: v, label: `Baterai ${v}V` } : c
                          )
                        )
                      }
                      className={`text-xs px-2 py-0.5 rounded border font-mono ${
                        selectedComp.voltage === v
                          ? "bg-[#2583E8] text-white border-[#2583E8]"
                          : "bg-white text-[#172B45] border-[#DCE6F1]"
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              )}

              {/* Adjust Resistance */}
              {(selectedComp.type === "lamp" || selectedComp.type === "resistor") && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#617187]">Hambatan:</label>
                  {[5, 10, 20, 30].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setComponents((prev) =>
                          prev.map((c) =>
                            c.id === selectedComp.id
                              ? {
                                  ...c,
                                  resistance: r,
                                  label: `${selectedComp.type === "lamp" ? "Lampu" : "Resistor"} (${r}Ω)`
                                }
                              : c
                          )
                        )
                      }
                      className={`text-xs px-2 py-0.5 rounded border font-mono ${
                        selectedComp.resistance === r
                          ? "bg-[#2583E8] text-white border-[#2583E8]"
                          : "bg-white text-[#172B45] border-[#DCE6F1]"
                      }`}
                    >
                      {r}Ω
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#C43D4B] bg-white border border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Komponen Ini
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
