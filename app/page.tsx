"use client";

import GameCanvas from "./components/GameCanvas";
import LeadChat from "./components/LeadChat";
import Toaster from "./components/Toaster";

export default function Page() {
  return (
    <>
      <section className="card mt-4">
        <div className="kicker">Practice • Tune • Share</div>
        <h1 className="mt-1 font-serif text-2xl font-semibold">
          V60 Brewing Simulator
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Adjust your variables, reveal your score, then message PASA Coffee on
          WhatsApp for training and gear.
        </p>
        <div className="mt-5">
          <GameCanvas />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[var(--panel)]/50 p-4 backdrop-blur">
        <h2 className="font-serif text-lg font-semibold">Tips</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>
            Baseline: <strong>15g</strong> → <strong>250g</strong>,{" "}
            <strong>94°C</strong>, bloom <strong>35s</strong>,{" "}
            <strong>4 pours</strong>, total ~<strong>180s</strong>, grind{" "}
            <strong>6–7.5</strong>.
          </li>
          <li>
            Keep movements steady; aim for an even bed and consistent flow.
          </li>
        </ul>
      </section>

      <LeadChat />
      <Toaster />
    </>
  );
}
