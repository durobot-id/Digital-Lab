"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("DILSA Service Worker registered", reg))
        .catch((err) => console.warn("DILSA Service Worker registration failed", err));
    }
  }, []);

  return null;
}
