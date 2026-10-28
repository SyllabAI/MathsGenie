"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * /your-plan, dark theme like the original (research/04-member-area.md §8):
 * comet-genie hero, "Your All-in-one Plan to Breeze Through Your Exams",
 * UK's #1 laurels, Pro feature groups, tutoring-savings calculator
 * (hours × hourly rate) and an alternatives comparison table.
 */

const HOURS = [
  { label: "Relaxed", h: 3 },
  { label: "Balanced", h: 5 },
  { label: "Intense", h: 8 },
];

const RATES = [
  { label: "Budget", r: 40 },
  { label: "Standard", r: 55 },
  { label: "Premium", r: 70 },
];

const PRO_GROUPS = [
  {
    title: "Learn & Exam Practice",
    items: ["Question bank for your exam board", "Scheme of learning, stage by stage", "Predicted papers & mini tests", "Flashcards for every topic"],
  },
  {
    title: "Genie AI Tutor",
    items: ["Ask Genie, explainers on demand", "Teach Genie (Feynman reviews)", "Step-by-step hint system", "Voice & photo input"],
  },
  {
    title: "Marking & Progress",
    items: ["AI answer marking as you go", "Whole-paper marker", "Weakness-targeting Daily Greens", "Predicted grade tracking"],
  },
];

const COMPARE = [
  { feature: "Question bank for your exam board", ai: "No equivalent built-in feature", sme: "Included", tutor: "No equivalent built-in feature" },
  { feature: "Ready-made worksheets for every topic", ai: "Not exam-board specific", sme: "Included", tutor: "Made ad hoc" },
  { feature: "Video explainers per topic", ai: "Generic videos", sme: "Included", tutor: "In-session only" },
  { feature: "AI marking with mark-scheme codes", ai: "Unreliable marking", sme: "Self-marked", tutor: "Marked by hand" },
  { feature: "Streaks, XP & weekly goals", ai: "Rarely included", sme: "Not included", tutor: "Not included" },
];

export default function PricingDark() {
  const [hours, setHours] = useState(5);
  const [rate, setRate] = useState(55);
  const saved = useMemo(() => hours * rate * 52 - 119, [hours, rate]);

  return (
    <div className="min-h-full bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {/* hero */}
        <div className="pt-14 text-center">
          <CometGenie className="mx-auto size-32" />
          <h2 className="mx-auto mt-2 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your <span className="underline decoration-sky-400 decoration-4 underline-offset-8">All-in-one</span> Plan
            <br />
            to Breeze Through Your Exams
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Laurel className="size-9 -scale-x-100" />
            <p className="text-lg font-bold text-white/90">UK&apos;s #1 Maths Revision Platform</p>
            <Laurel className="size-9" />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/gcse" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/85">
              Start free
            </Link>
            <a
              href="https://mathsgenie.co.uk/your-plan"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/25 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              See plans on the original
            </a>
          </div>
        </div>

        {/* pro groups */}
        <h3 className="mt-16 text-center text-2xl font-extrabold">
          Pro Includes Everything You Need to Ace Your GCSEs
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PRO_GROUPS.map((g) => (
            <div key={g.title} className="rounded-3xl border border-white/10 bg-[#14171c] p-6">
              <h4 className="font-extrabold text-mint">{g.title}</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {g.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-mint" aria-hidden>✓</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-white/50">
          <a href="https://mathsgenie.co.uk/your-plan" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            Learn more about our 14+ features &amp; tools
          </a>
        </p>

        {/* savings calculator */}
        <h3 className="mt-16 text-center text-2xl font-extrabold">
          You could save <span className="text-mint">£{saved.toLocaleString("en-GB")}</span>/year compared to tutoring
        </h3>
        <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-white/10 bg-[#14171c] p-6">
          <p className="text-sm font-bold text-white/80">Hours of tutoring per week</p>
          <div className="mt-2 flex gap-2">
            {HOURS.map((o) => (
              <button
                key={o.label}
                onClick={() => setHours(o.h)}
                className={`flex-1 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                  hours === o.h ? "border-mint bg-mint/15 text-mint" : "border-white/15 text-white/70 hover:bg-white/5"
                }`}
              >
                {o.label} {o.h} hours
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-white/80">Tutor hourly rate</p>
          <div className="mt-2 flex gap-2">
            {RATES.map((o) => (
              <button
                key={o.label}
                onClick={() => setRate(o.r)}
                className={`flex-1 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                  rate === o.r ? "border-mint bg-mint/15 text-mint" : "border-white/15 text-white/70 hover:bg-white/5"
                }`}
              >
                {o.label} £{o.r}/hour
              </button>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-white/60">
            MathsGenie Pro costs about £119/year — roughly{" "}
            <span className="font-bold text-mint">{Math.max(1, Math.round((hours * rate * 52) / 119))}×</span> cheaper
            than the equivalent tutoring hours.
          </p>
        </div>

        {/* comparison table */}
        <h3 className="mt-16 text-center text-2xl font-extrabold">Compare MathsGenie to the alternatives</h3>
        <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-[#14171c] text-left">
                <th className="px-5 py-4 font-bold">Features</th>
                <th className="px-5 py-4 font-bold text-white/60">AI chatbots</th>
                <th className="px-5 py-4 font-bold text-white/60">Save My Exams</th>
                <th className="px-5 py-4 font-bold text-white/60">Traditional tutoring</th>
                <th className="px-5 py-4 font-bold text-mint">MathsGenie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {COMPARE.map((row) => (
                <tr key={row.feature}>
                  <td className="px-5 py-4 font-semibold">{row.feature}</td>
                  <td className="px-5 py-4 text-white/50">{row.ai}</td>
                  <td className="px-5 py-4 text-white/50">{row.sme}</td>
                  <td className="px-5 py-4 text-white/50">{row.tutor}</td>
                  <td className="px-5 py-4 font-semibold text-mint">Included</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          Recreation for research — the real plans live on{" "}
          <a href="https://mathsgenie.co.uk/your-plan" target="_blank" rel="noopener noreferrer" className="underline">
            mathsgenie.co.uk/your-plan
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function CometGenie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <path d="M14 82C30 60 44 46 62 34" stroke="url(#tail)" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.8" />
      <circle cx="22" cy="72" r="4" fill="#5cc1ea" opacity="0.7" />
      <circle cx="36" cy="58" r="3" fill="#2fe4b7" opacity="0.8" />
      <path d="M70 22c12 0 19 8 19 19 0 5-1.7 9-4.5 12 .8 1.6 1.2 3.4 1.2 5.3 0 9-7.3 15.7-15.7 15.7s-15.7-6.7-15.7-15.7c0-1.9.4-3.7 1.2-5.3C52.7 50 51 46 51 41c0-11 7-19 19-19Z" fill="#2fe4b7" transform="translate(-12 -12)" />
      <circle cx="49" cy="24" r="3.4" fill="#14171c" />
      <circle cx="63" cy="24" r="3.4" fill="#14171c" />
      <path d="M49 34c4 3 10 3 14 0" stroke="#14171c" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M83 12l2.2 5.8L91 20l-5.8 2.2L83 28l-2.2-5.8L75 20l5.8-2.2L83 12Z" fill="#fef5a7" />
      <defs>
        <linearGradient id="tail" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#14171c" />
          <stop offset="1" stopColor="#2fe4b7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Laurel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#f5b800" aria-hidden>
      <path d="M4 2c1 4 2.5 7.5 5 10.5-.7.9-1.3 1.9-1.8 3C4.4 12.2 3 8 2.6 3.6L4 2Zm5.5 13.4c.5-1 1.1-2 1.8-2.9 1 .9 2.1 1.8 3.3 2.5l-1.2 2.6a17 17 0 0 1-3.9-2.2Zm6.3 1.2 1.5-2.4c1.4.5 2.9.9 4.4 1l-.5 2.9c-1.9-.1-3.7-.6-5.4-1.5Z" />
    </svg>
  );
}
