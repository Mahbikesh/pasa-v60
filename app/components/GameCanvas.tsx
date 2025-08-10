"use client";

import { useEffect, useMemo, useState } from "react";
import WhatsAppCTA from "./WhatsAppCTA";

type Recipe = {
  grind: number; // 1-10
  temp: number; // 85-100
  dose: number; // 10-25g
  water: number; // 150-350g
  bloom: number; // 10-60s
  total: number; // 120-300s
  pours: number; // 1-6
};

const IDEAL = {
  grindMin: 6,
  grindMax: 7.5,
  temp: 94,
  dose: 15,
  water: 250,
  bloom: 35,
  total: 180,
  pours: 4,
};

const BEST_KEY = "v60_best_score";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Scoring: 0–1000 (unchanged logic) */
function scoreRecipe(r: Recipe): number {
  let score = 0;

  // Ratio (dose:water ~ 1:16.67) — 250 pts
  const targetRatio = IDEAL.water / IDEAL.dose;
  const ratio = r.water / r.dose;
  const ratioErr = Math.abs(ratio - targetRatio);
  const ratioPts =
    ratioErr <= 0.8 ? 250 : clamp(250 - (ratioErr - 0.8) * 120, 0, 250);
  score += ratioPts;

  // Temperature — 150 pts (±4 full, taper to ±10)
  const tempErr = Math.abs(r.temp - IDEAL.temp);
  const tempPts =
    tempErr <= 4 ? 150 : clamp(150 - (tempErr - 4) * (150 / 6), 0, 150);
  score += tempPts;

  // Bloom — 150 pts (±10 full, taper to ±25)
  const bloomErr = Math.abs(r.bloom - IDEAL.bloom);
  const bloomPts =
    bloomErr <= 10 ? 150 : clamp(150 - (bloomErr - 10) * (150 / 15), 0, 150);
  score += bloomPts;

  // Pours — 100 pts (exact=100; ±1=80; ±2=60; etc.)
  const poursDiff = Math.abs(r.pours - IDEAL.pours);
  const poursMap: Record<number, number> = {
    0: 100,
    1: 80,
    2: 60,
    3: 40,
    4: 20,
  };
  const poursPts = poursMap[Math.min(poursDiff, 4)] ?? 0;
  score += poursPts;

  // Total time — 200 pts (±30 full, taper to ±80)
  const totalErr = Math.abs(r.total - IDEAL.total);
  const totalPts =
    totalErr <= 30 ? 200 : clamp(200 - (totalErr - 30) * (200 / 50), 0, 200);
  score += totalPts;

  // Grind window — 150 pts (full in 6–7.5; taper outside)
  let grindPts = 0;
  if (r.grind >= IDEAL.grindMin && r.grind <= IDEAL.grindMax) {
    grindPts = 150;
  } else {
    const dist =
      r.grind < IDEAL.grindMin
        ? IDEAL.grindMin - r.grind
        : r.grind - IDEAL.grindMax;
    grindPts = clamp(150 - (dist / 2.5) * 150, 0, 150);
  }
  score += grindPts;

  return Math.round(clamp(score, 0, 1000));
}

export default function GameCanvas() {
  // ↓↓↓ Default values tuned to land ~400–500/1000
  const [r, setR] = useState<Recipe>({
    grind: 3.5, // too fine (outside 6–7.5 window)
    temp: 88, // below 94
    dose: 13, // under baseline
    water: 270, // a bit over
    bloom: 50, // long bloom
    total: 150, // shorter brew
    pours: 5, // more than target
  });

  const [best, setBest] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false); // hide score until reveal

  // On mount: load best score & set slider fill %
  useEffect(() => {
    const v = localStorage.getItem(BEST_KEY);
    if (v) setBest(Number(v));
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="range"]')
    );
    inputs.forEach((input) => {
      const min = Number(input.min),
        max = Number(input.max),
        val = Number(input.value);
      const pct = Math.round(((val - min) / (max - min)) * 100);
      input.style.setProperty("--_fill", pct + "%");
    });
  }, []);

  const currentScore = useMemo(() => scoreRecipe(r), [r]);

  function update<K extends keyof Recipe>(key: K, val: number) {
    setRevealed(false); // hide result when tweaking
    setR((prev) => ({ ...prev, [key]: val }));
    // smooth fill for the changed slider (WebKit)
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${String(key)}"]`
    );
    if (input) {
      const min = Number(input.min),
        max = Number(input.max);
      const pct = Math.round(((val - min) / (max - min)) * 100);
      input.style.setProperty("--_fill", pct + "%");
    }
  }

  function reveal() {
    setRevealed(true);
  }

  function saveBest() {
    if (!revealed) return; // don’t save unrevealed score
    const prev = Number(localStorage.getItem(BEST_KEY) || "0");
    const next = Math.max(prev, currentScore);
    localStorage.setItem(BEST_KEY, String(next));
    setBest(next);
    window.dispatchEvent(new CustomEvent("toast", { detail: "Saved!" }));
  }

  const shareText = `My V60 score is ${currentScore}/1000`;
  const shareUrl = `https://wa.me/${
    (process.env as any).NEXT_PUBLIC_WHATSAPP_NUMBER
  }?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            k: "grind",
            label: "Grind (1–10)",
            min: 1,
            max: 10,
            step: 0.1,
            hint: "Sweet spot: 6–7.5",
            val: r.grind.toFixed(1),
          },
          {
            k: "temp",
            label: "Temperature (°C)",
            min: 85,
            max: 100,
            step: 1,
            hint: "Target: 94°C (±4)",
            val: r.temp + "°C",
          },
          {
            k: "dose",
            label: "Dose (g)",
            min: 10,
            max: 25,
            step: 0.5,
            hint: "Baseline: 15g",
            val: r.dose + "g",
          },
          {
            k: "water",
            label: "Water (g)",
            min: 150,
            max: 350,
            step: 5,
            hint: "Baseline: 250g",
            val: r.water + "g",
          },
          {
            k: "bloom",
            label: "Bloom (s)",
            min: 10,
            max: 60,
            step: 1,
            hint: "Target: 35s (±10)",
            val: r.bloom + "s",
          },
          {
            k: "total",
            label: "Total Time (s)",
            min: 120,
            max: 300,
            step: 5,
            hint: "Target: 180s (±30)",
            val: r.total + "s",
          },
        ].map(({ k, label, min, max, step, hint, val }) => (
          <div key={k} className="card inner-warm soft-shadow">
            <div className="label">{label}</div>
            <div className="slider-row">
              <input
                className="tap with-fill"
                type="range"
                min={min}
                max={max}
                step={step}
                value={(r as any)[k]}
                name={k}
                onChange={(e) => update(k as any, Number(e.target.value))}
                aria-label={label}
              />
              <span className="text-sm tabular-nums">{val}</span>
            </div>
            <p className="hint mt-1">{hint}</p>
          </div>
        ))}

        <div className="card inner-warm soft-shadow sm:col-span-2">
          <div className="label">Pours</div>
          <div className="slider-row">
            <input
              className="tap with-fill"
              type="range"
              min={1}
              max={6}
              step={1}
              value={r.pours}
              name="pours"
              onChange={(e) => update("pours", Number(e.target.value))}
              aria-label="Pours"
            />
            <span className="text-sm tabular-nums">{r.pours}</span>
          </div>
          <p className="hint mt-1">Target: 4 pours</p>
        </div>
      </div>

      {/* Score + Actions */}
      <div className="card flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="kicker">Result</div>

          {revealed ? (
            <>
              <div className="mt-1 flex items-center gap-2 reveal-in">
                {/* Coffee bean icon */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="opacity-90"
                >
                  <path
                    fill="currentColor"
                    d="M12 2c4.418 0 8 3.134 8 7 0 4.866-3.582 9-8 9S4 13.866 4 9c0-3.866 3.582-7 8-7zm1.3 2.4c-1.36 3.52-1.06 6.26.9 8.22 1.96 1.96 4.7 2.26 8.22.9-.42 3.2-3.86 6.5-8.42 6.5-5.24 0-9.5-4.26-9.5-9.5 0-4.56 3.3-8 6.5-8.42z"
                  />
                </svg>
                <div className="font-serif text-3xl font-bold tabular-nums">
                  {currentScore}{" "}
                  <span className="text-base font-normal text-[var(--muted)]">
                    / 1000
                  </span>
                </div>
              </div>
              <div className="text-xs text-[var(--muted)]">
                Best: <span className="tabular-nums">{best ?? "—"}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-[var(--muted)]">
                Hidden — adjust your settings, then click{" "}
                <strong>Show your result</strong>.
              </div>
              <div className="text-xs text-[var(--muted)]/80">
                Tip: changing any slider hides the result until you reveal
                again.
              </div>
            </>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {!revealed && (
            <button
              className="btn btn-primary lift ring-focus"
              onClick={reveal}
            >
              Show your result
            </button>
          )}
          <button
            className="btn btn-primary lift ring-focus"
            onClick={saveBest}
            disabled={!revealed}
          >
            Save & Share
          </button>
          <a
            className="btn btn-outline lift ring-focus"
            href={revealed ? shareUrl : undefined}
            onClick={(e) => {
              if (!revealed) e.preventDefault();
            }}
            aria-disabled={!revealed}
            target="_blank"
            rel="noreferrer"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>

      {/* Quick CTA */}
      <div className="flex justify-end">
        <WhatsAppCTA
          label="Message PASA on WhatsApp"
          message={
            revealed
              ? `My V60 score is ${currentScore}/1000`
              : "Hi PASA Coffee 👋 I want to improve my V60!"
          }
          className="btn btn-success lift pulse"
        />
      </div>
    </div>
  );
}
