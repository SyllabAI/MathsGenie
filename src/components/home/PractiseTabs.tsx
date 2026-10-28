"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * "Practise until exam day feels easy" — black active pill tabs over a
 * periwinkle slide, mirroring the original's practice section.
 */

const TABS = [
  {
    label: "Question Bank",
    headline: "Thousands of real exam-style questions",
    copy: "Filter by topic and grade, reveal worked solutions step by step, and track which questions you have already banked.",
    href: "/gcse/maths/edexcel/grade-3-3-13-substitution/questions",
    cta: "Open the question bank",
  },
  {
    label: "Predicted Papers",
    headline: "Predicted papers built from past trends",
    copy: "Full mock papers in the style of your exam board, with mark schemes — perfect for a timed dress rehearsal.",
    href: "/gcse/maths/edexcel/papers",
    cta: "See predicted papers",
  },
  {
    label: "Past Paper Videos",
    headline: "Every past paper, worked on video",
    copy: "Watch an expert attempt real papers in real time, narrating the decisions that earn method marks.",
    href: "/gcse/maths/edexcel/videos",
    cta: "Watch worked papers",
  },
  {
    label: "Mock Exam Builder",
    headline: "Compose the exact paper you need",
    copy: "Pick topics, grades and length — the builder assembles a printable mock with a matching mark scheme.",
    href: "/gcse/maths/edexcel/mock-exam-builder",
    cta: "Build a mock",
  },
];

export default function PractiseTabs() {
  const [idx, setIdx] = useState(0);
  const t = TABS[idx];

  return (
    <section className="bg-paper py-16 sm:py-20" aria-label="Practise until exam day feels easy">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-title text-3xl font-extrabold tracking-tight sm:text-4xl">
          Practise until exam day feels easy
        </h2>

        <div className="no-scrollbar mx-auto mt-6 flex max-w-full items-center gap-2 overflow-x-auto pb-1" role="tablist">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                i === idx ? "bg-ink text-white" : "bg-paper-2 text-ink hover:bg-ink/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] p-6 sm:p-10" style={{ background: "var(--pas-peri)" }}>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="w-full rounded-2xl bg-white p-6 shadow-[0_14px_40px_-18px_rgb(10_10_10/0.25)]">
                <div className="flex items-center justify-between text-xs font-semibold text-muted">
                  <span>Question 12 · Grade 6</span>
                  <span className="rounded-full bg-[#e5f8ec] px-2.5 py-1 text-[#0b6b3a]">✓ marked</span>
                </div>
                <p className="mt-3 text-sm font-semibold">
                  The table shows information about 80 envelopes.
                  Work out an estimate for the mean weight.
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-line text-sm">
                  {[
                    ["Weight (w grams)", "Frequency"],
                    ["0 < w ≤ 10", "12"],
                    ["10 < w ≤ 20", "28"],
                    ["20 < w ≤ 30", "40"],
                  ].map((row, i) => (
                    <div key={row[0]} className={`grid grid-cols-2 px-4 py-2 ${i === 0 ? "bg-paper-2 font-semibold" : "border-t border-line text-muted"}`}>
                      <span>{row[0]}</span>
                      <span className="text-right">{row[1]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-px border-b-2 border-dotted border-ink/25" />
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-hand text-lg text-ink/80">1720 ÷ 80 = 21.5 g</span>
                  <span className="rounded-full bg-[#e5f8ec] px-3 py-1 text-xs font-bold text-[#0b6b3a]">3/3 marks</span>
                </div>
              </div>
            </div>
            <div className="order-1 max-w-md lg:order-2 lg:justify-self-end">
              <h3 className="font-title text-3xl font-extrabold leading-tight tracking-tight text-[#312e81] sm:text-4xl">
                {t.headline}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#3730a3]">{t.copy}</p>
              <Link
                href={t.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#312e81] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              >
                {t.cta} <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
