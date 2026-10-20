import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "DILSA — Digital Laboratorium Science AI",
  description:
    "Platform pembelajaran IPA interaktif berbasis web dan AI untuk siswa SMP/MTs (kelas VII-IX). Dilengkapi laboratorium virtual 2D deterministik, asisten AI sokratik, dan kuis evaluasi.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#2583E8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F3F8FF] text-[#172B45] antialiased">
        <ServiceWorkerRegister />
        <Suspense fallback={<div className="h-16 bg-white border-b border-[#DCE6F1]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
