import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
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
  themeColor: "#0D1D2D",
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
      <body className="min-h-full bg-[#F4F7FB] text-[#172B45] antialiased">
        <ServiceWorkerRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
