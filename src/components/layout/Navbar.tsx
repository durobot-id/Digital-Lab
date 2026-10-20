"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Atom, Compass, BookOpen, Download } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DCE6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#174A8B] to-[#2583E8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all">
            <Atom className="w-6 h-6 text-[#FFD45A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[#174A8B]">
                DILSA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DDF0FF] text-[#174A8B]">
                SMP/MTs
              </span>
            </div>
            <p className="text-[10px] text-[#617187] font-medium leading-none">
              Digital Laboratorium Science AI
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-4 text-xs font-semibold">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/"
                ? "text-[#2583E8] bg-[#F3F8FF]"
                : "text-[#617187] hover:text-[#172B45] hover:bg-slate-50"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/topics"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pathname.startsWith("/topics")
                ? "text-[#2583E8] bg-[#F3F8FF]"
                : "text-[#617187] hover:text-[#172B45] hover:bg-slate-50"
            }`}
          >
            Katalog Tema
          </Link>

          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#DDF0FF] text-[#174A8B] hover:bg-[#cbe7ff] transition-all border border-[#2583E8]/30"
              title="Pasang aplikasi DILSA di perangkat Anda"
            >
              <Download className="w-3.5 h-3.5" />
              Pasang PWA
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
