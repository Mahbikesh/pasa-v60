"use client";

import { useEffect, useMemo, useState } from "react";
import WhatsAppCTA from "./WhatsAppCTA";

const BEST_KEY = "v60_best_score";
type Interest =
  | "Barista Training"
  | "Coffee Gadgets"
  | "Machine Rental"
  | "General";

export default function LeadChat() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<Interest>("Barista Training");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const v = localStorage.getItem(BEST_KEY);
    if (v) setBest(Number(v));
  }, []);

  const message = useMemo(() => {
    const lines = [
      "Hi PASA Coffee 👋",
      `I'm interested in: ${interest}`,
      `Name: ${name || "(not provided)"}`,
      phone ? `Phone: ${phone}` : null,
      best != null ? `My latest V60 score: ${best}/1000` : null,
      note ? `Note: ${note}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [name, interest, phone, note, best]);

  return (
    <>
      {/* Floating Dock Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[var(--success)] px-5 py-3 text-sm font-semibold text-black shadow-[0_12px_28px_rgba(62,167,106,.35)] hover:bg-[color:var(--success)]/90 focus:outline-none"
        aria-label="Open chat"
      >
        Chat / Enquiry
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 p-3 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="card w-full max-w-sm bg-[var(--panel)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold">
                PASA Coffee — Chat
              </h3>
              <button
                className="rounded-full px-2 py-1 text-[var(--muted)] hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Name *</label>
                <input
                  className="field"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">What are you interested in?</label>
                <select
                  className="field"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as Interest)}
                >
                  <option>Barista Training</option>
                  <option>Coffee Gadgets</option>
                  <option>Machine Rental</option>
                  <option>General</option>
                </select>
              </div>

              <div>
                <label className="label">Phone (optional)</label>
                <input
                  className="field"
                  placeholder="05xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Note (optional)</label>
                <textarea
                  className="field"
                  rows={3}
                  placeholder="Tell us more…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-[var(--panel-2)]/70 p-3">
                <div className="label mb-2">Preview message</div>
                <pre className="whitespace-pre-wrap text-sm text-[var(--text)]/90">
                  {message}
                </pre>
              </div>

              <div className="flex gap-2 pt-1">
                <WhatsAppCTA
                  label="Send on WhatsApp"
                  message={message}
                  className="btn btn-success w-full"
                  disabled={!name.trim()}
                />
              </div>
              <p className="hint">
                We open WhatsApp with this message. Nothing is stored on our
                servers.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
