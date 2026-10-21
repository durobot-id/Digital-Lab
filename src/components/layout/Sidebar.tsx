"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Atom,
  Home,
  FlaskConical,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  Zap,
  Activity,
  Sun
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const mainMenuItems = [
    {
      name: "Beranda",
      href: "/",
      icon: Home,
      isActive: pathname === "/"
    },
    {
      name: "Laboratorium",
      href: "/topics/kelistrikan/lab",
      icon: FlaskConical,
      isActive: pathname.includes("/lab")
    },
    {
      name: "Materi Belajar",
      href: "/topics",
      icon: BookOpen,
      isActive: pathname === "/topics" || (pathname.startsWith("/topics/") && !pathname.includes("/lab") && !pathname.includes("/quiz"))
    },
    {
      name: "Pencapaian & Kuis",
      href: "/topics/gaya-dan-gerak/quiz",
      icon: Award,
      badge: "3",
      isActive: pathname.includes("/quiz")
    },
    {
      name: "Laporan Belajar",
      href: "/topics",
      icon: BarChart3,
      isActive: false
    }
  ];

  const secondaryMenuItems = [
    {
      name: "Pengaturan",
      href: "#",
      icon: Settings
    },
    {
      name: "Pusat Bantuan",
      href: "#",
      icon: HelpCircle
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D1D2D] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header Brand */}
          <div className="p-6 pb-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
              <div className="w-10 h-10 rounded-xl bg-[#FFD45A] flex items-center justify-center text-[#0D1D2D] shadow-xs group-hover:scale-105 transition-transform">
                <Atom className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-wider text-white">
                  DILSA
                </h1>
                <p className="text-[10px] tracking-widest text-[#8AA2BA] uppercase font-semibold">
                  Science Laboratory
                </p>
              </div>
            </Link>

            {/* Close Button on Mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#8AA2BA] hover:text-white hover:bg-white/10"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <div className="px-4 py-4">
            <span className="text-[10px] font-bold text-[#627D98] tracking-widest uppercase px-3 block mb-2">
              Menu Utama
            </span>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      item.isActive
                        ? "bg-[#1E3A53] text-[#48CAE4] shadow-xs"
                        : "text-[#9FB3C8] hover:text-white hover:bg-[#162B3F]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="w-5 h-5 rounded-full bg-[#FFD45A] text-[#0D1D2D] text-[10px] font-extrabold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Labs Section */}
          <div className="px-4 py-2">
            <span className="text-[10px] font-bold text-[#627D98] tracking-widest uppercase px-3 block mb-2">
              Eksperimen Aktif
            </span>
            <div className="space-y-1">
              <Link
                href="/topics/gaya-dan-gerak/lab"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-[#9FB3C8] hover:text-white hover:bg-[#162B3F] transition-all"
              >
                <Activity className="w-3.5 h-3.5 text-[#2583E8]" />
                <span className="truncate">Gaya & Gerak Benda</span>
              </Link>
              <Link
                href="/topics/kelistrikan/lab"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-[#9FB3C8] hover:text-white hover:bg-[#162B3F] transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFD45A]" />
                <span className="truncate">Rangkaian Listrik DC</span>
              </Link>
              <Link
                href="/topics/cahaya-dan-optik/lab"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-[#9FB3C8] hover:text-white hover:bg-[#162B3F] transition-all"
              >
                <Sun className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span className="truncate">Pemantulan Cermin</span>
              </Link>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="px-4 py-3 mt-auto">
            <span className="text-[10px] font-bold text-[#627D98] tracking-widest uppercase px-3 block mb-2">
              Lainnya
            </span>
            <nav className="space-y-1">
              {secondaryMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9FB3C8] hover:text-white hover:bg-[#162B3F] transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Card (Sidebar Promo/Badge matching screenshot) */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#162D42] to-[#1E3A53] border border-[#274866]/50">
            <div className="w-8 h-8 rounded-lg bg-[#FFD45A] text-[#0D1D2D] flex items-center justify-center mb-2.5 shadow-xs font-bold text-xs">
              <Atom className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              Eksplorasi Tanpa Batas!
            </h4>
            <p className="text-[10px] text-[#9FB3C8] mb-3 leading-relaxed">
              Jalankan simulasi 2D dan diskusikan hasil bersama Asisten AI DILSA.
            </p>
            <Link
              href="/topics/kelistrikan/lab"
              onClick={onClose}
              className="block w-full py-2 px-3 rounded-xl bg-[#FFD45A] hover:bg-[#ffe082] text-[#0D1D2D] font-bold text-xs text-center transition-all shadow-xs"
            >
              Mulai Eksperimen
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
