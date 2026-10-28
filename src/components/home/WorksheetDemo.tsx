"use client";

import { useEffect, useState } from "react";

/**
 * Floating worksheet card from the original hero: numbered questions,
 * handwritten-style working, dotted answer lines, and a Genie feedback
 * popup. Question set rotates every few seconds like the live site.
 */

type Demo = {
  topic: string;
  qs: { q: string; work: string[]; answer: string; unit?: string; marks: number }[];
  feedback: string;
  score: string;
};

const DEMOS: Demo[] = [
  {
    topic: "addition",
    qs: [
      { q: "Work out 254 + 87", work: ["254 + 80 = 334", "334 + 7 = 341"], answer: "341", marks: 1 },
      { q: "Work out 1582 + 357", work: ["1582 + 300 = 1882", "1882 + 57 = 1939"], answer: "1939", marks: 1 },
    ],
    feedback: "Added the hundreds first, then the units — clean column working.",
    score: "2/2",
  },
  {
    topic: "conversions",
    qs: [
      { q: "Change 2580 grams to kilograms.", work: ["2580 ÷ 1000 = 2.58"], answer: "2.58", unit: "kg", marks: 1 },
      { q: "Change 1.6 kilometres to metres.", work: ["1.6 × 1000 = 1600"], answer: "1600", unit: "m", marks: 1 },
      { q: "Change 48 cm to mm.", work: ["48 × 10 = 480"], answer: "480", unit: "mm", marks: 1 },
    ],
    feedback: "Correct ×1000 / ÷1000 conversions throughout.",
    score: "3/3",
  },
  {
    topic: "time",
    qs: [
      { q: "Change 120 minutes to hours.", work: ["120 ÷ 60 = 2", "= 2 hours"], answer: "2", unit: "hours", marks: 1 },
      { q: "Change 4 hours to minutes.", work: ["4 × 60 = 240"], answer: "240", unit: "minutes", marks: 1 },
    ],
    feedback: "Divided 120 minutes by 60 to get 2 hours.",
    score: "2/2",
  },
];

export default function WorksheetDemo() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % DEMOS.length), 5200);
    return () => clearInterval(t);
  }, []);

  const demo = DEMOS[idx];

  return (
    <div className="relative">
      {/* worksheet card */}
      <div className="relative rounded-3xl border border-line bg-white p-6 shadow-[0_18px_60px_-24px_rgb(10_10_10/0.25)] sm:p-8">
        {demo.qs.map((item, i) => (
          <div key={item.q} className={`py-4 ${i > 0 ? "border-t border-line" : ""}`}>
            <div className="flex items-start gap-4">
              <span className="font-title text-sm font-bold text-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.q}</p>
                <div className="mt-2 space-y-0.5 font-hand text-lg leading-snug text-ink/80">
                  {item.work.map((w) => (
                    <p key={w}>{w}</p>
                  ))}
                </div>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <span className="h-px flex-1 border-b-2 border-dotted border-ink/30" />
                  {item.unit && <span className="text-xs font-semibold text-muted">{item.unit}</span>}
                </div>
                <p className="mt-1 text-right text-[11px] font-semibold text-muted">
                  (Total for question {i + 1} is {item.marks} mark{item.marks > 1 ? "" : ""})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* genie feedback popup */}
      <div className="float-y absolute -bottom-8 -right-3 w-64 rounded-2xl border border-line bg-white p-4 shadow-[0_16px_48px_-16px_rgb(10_10_10/0.3)] sm:-right-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-ink-solid">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path
                d="M12 3.6c.9-.9 2.3-.4 2.5.7 2.4.6 4.1 2.6 4.1 5 0 1.2-.4 2.3-1.1 3.2.4.5.6 1.1.6 1.7 0 1.7-1.5 3-3.4 3h-5.4c-1.9 0-3.4-1.3-3.4-3 0-.6.2-1.2.6-1.7C5.8 11.6 5.4 10.5 5.4 9.3c0-2.4 1.7-4.4 4.1-5 .2-1.1 1.6-1.6 2.5-.7Z"
                fill="#2fe4b7"
              />
              <circle cx="9.8" cy="10.2" r="1.4" fill="#0a0a0a" />
              <circle cx="14.2" cy="10.2" r="1.4" fill="#0a0a0a" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Genie</p>
            <p className="text-[11px] text-muted">just now</p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#00c750] text-[11px] font-bold text-[#00a35e]">
            {demo.score}
          </span>
        </div>
        <p className="mt-2.5 rounded-xl bg-[#e5f8ec] px-3 py-2 text-xs font-medium leading-relaxed text-[#0b6b3a]">
          ✓ {demo.feedback}
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="rounded-full bg-paper-2 px-3 py-1 text-[11px] font-semibold text-muted">Reset</span>
          <span className="flex-1 rounded-full bg-[#a333e0] px-3 py-1.5 text-center text-[11px] font-bold text-white">
            1⚡ Re-mark
          </span>
        </div>
      </div>
    </div>
  );
}
