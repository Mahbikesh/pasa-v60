"use client";

import { useEffect, useState } from "react";

export default function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      setMsg(detail);
      const t = setTimeout(() => setMsg(null), 1600);
      return () => clearTimeout(t);
    }
    window.addEventListener("toast", onToast as EventListener);
    return () => window.removeEventListener("toast", onToast as EventListener);
  }, []);

  if (!msg) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="pointer-events-auto toast">{msg}</div>
    </div>
  );
}
