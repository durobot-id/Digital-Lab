"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserProfile, UserProfile } from "@/lib/storage";

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export default function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());

  useEffect(() => {
    setProfile(getUserProfile());
    const handleProfileUpdate = () => {
      setProfile(getUserProfile());
    };
    window.addEventListener("dilsa_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("dilsa_profile_updated", handleProfileUpdate);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const term = searchTerm.toLowerCase();
    if (term.includes("listrik") || term.includes("rangkaian") || term.includes("ohm") || term.includes("lampu")) {
      router.push("/topics/kelistrikan/lab");
    } else if (term.includes("gaya") || term.includes("gerak") || term.includes("newton") || term.includes("balok")) {
      router.push("/topics/gaya-dan-gerak/lab");
    } else if (term.includes("cahaya") || term.includes("cermin") || term.includes("optik") || term.includes("pantul")) {
      router.push("/topics/cahaya-dan-optik/lab");
    } else {
      router.push("/topics");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DCE6F1] h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#617187] hover:text-[#172B45] hover:bg-[#F3F8FF] transition-all"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="w-4 h-4 text-[#8AA2BA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari eksperimen, materi..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#F4F7FB] border border-[#DCE6F1] text-xs text-[#172B45] placeholder-[#8AA2BA] focus:outline-none focus:bg-white focus:border-[#2583E8] transition-all"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8AA2BA] bg-white px-1.5 py-0.5 rounded border border-[#DCE6F1]">
            ⌘ K
          </kbd>
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl text-[#617187] hover:text-[#172B45] hover:bg-[#F3F8FF] transition-all border border-transparent hover:border-[#DCE6F1]"
          title="Notifikasi Belajar"
          aria-label="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#E63946] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* Synchronized Student Profile Pill */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-[#F3F8FF] transition-all border border-transparent hover:border-[#DCE6F1] group"
          title="Buka Profil Siswa"
        >
          <div className="w-8 h-8 rounded-full bg-[#1E3A53] text-[#48CAE4] flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            {profile.avatarInitials}
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-[#172B45] leading-tight group-hover:text-[#2583E8] transition-colors">
              {profile.name}
            </h4>
            <p className="text-[10px] text-[#617187] leading-none">
              {profile.classGrade}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
