"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * "Learn every topic your way" — pill tabs + full-width pastel slide with a
 * white preview card (left) and colored headline + CTA (right), round black
 * carousel arrows, dot pagination. All lesson copy is original to this
 * recreation; the slide structure mirrors the live site's layout.
 */

type Slide = {
  tab: string;
  headline: string;
  copy: string;
  cta: string;
  href: string;
  bg: string;
  text: string;   // headline color
  btn: string;    // button bg
  card: React.ReactNode;
};

const CARD_SHELL = "w-full rounded-2xl bg-white p-6 shadow-[0_14px_40px_-18px_rgb(10_10_10/0.25)]";

function GuidesCard() {
  return (
    <div className={CARD_SHELL}>
      <p className="font-title text-base font-bold">Solving Quadratics</p>
      <p className="mt-4 text-sm font-bold">What you&apos;ll learn</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted">
        <li>• How to recognise a quadratic expression.</li>
        <li>• How to factorise quadratics like <em>x² + bx + c</em> into two brackets.</li>
        <li>• How to solve a quadratic equation once it is factorised.</li>
      </ul>
      <p className="mt-4 text-sm font-bold">1. What is a quadratic?</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        A <strong className="text-ink">quadratic</strong> is an expression or equation where
        the highest power of the variable is squared, such as <em>x²</em> or <em>a²</em>.
      </p>
      <div className="mt-4 rounded-xl bg-[#fde8ec] p-3.5">
        <p className="text-xs font-bold text-[#c0265c]">🎯 Definition</p>
        <p className="mt-1 text-xs font-semibold text-ink">Quadratic</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          A quadratic expression has a squared term as its highest power, for
          example x² + 5x + 6.
        </p>
      </div>
    </div>
  );
}

function QuestionCard() {
  return (
    <div className={CARD_SHELL}>
      <p className="text-sm font-semibold text-ink">Here is a right-angled triangle.</p>
      <div className="mt-4 rounded-xl bg-paper-2 p-4 text-center">
        <svg viewBox="0 0 120 70" className="mx-auto h-20" aria-hidden>
          <path d="M12 62 L108 62 L12 10 Z" fill="#e3f4fe" stroke="#0a0a0a" strokeWidth="1.6" />
          <path d="M12 54 h8 v8" fill="none" stroke="#0a0a0a" strokeWidth="1.2" />
          <text x="55" y="60" fontSize="9" fill="#737373">8 cm</text>
          <text x="14" y="38" fontSize="9" fill="#737373">6 cm</text>
          <text x="52" y="30" fontSize="9" fill="#737373">x</text>
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold">Work out the length x. Give your answer to 1 decimal place.</p>
      <div className="mt-3 space-y-2">
        {["6.7", "10.0", "9.3", "7.1"].map((opt, i) => (
          <div key={opt} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 text-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-paper-2 text-xs font-bold text-muted">
              {"ABCD"[i]}
            </span>
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarkingCard() {
  return (
    <div className={CARD_SHELL}>
      <div className="flex items-center gap-2 rounded-full border border-line p-1 text-sm font-semibold">
        <span className="flex-1 rounded-full bg-ink px-4 py-1.5 text-center text-white">Feedback</span>
        <span className="flex-1 py-1.5 text-center text-muted">Suggestions</span>
      </div>
      <p className="mt-4 font-title text-base font-bold">Strengths</p>
      <ul className="mt-2 space-y-2.5 text-sm leading-relaxed text-muted">
        <li className="flex gap-2">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
          Quotations are embedded and load-bearing — every reference advances the argument.
        </li>
        <li className="flex gap-2">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
          Precise terminology tied to effect: methods are named and then made to do interpretive work.
        </li>
      </ul>
      <div className="mt-4 rounded-xl bg-paper-2 p-3.5 text-sm leading-relaxed text-muted">
        <span className="underline decoration-[#e7000b] decoration-2 underline-offset-2">
          Priestley presents the Inspector as a moral force.
        </span>{" "}
        The imperative “remember” commands the audience — the{" "}
        <span className="underline decoration-[#a333e0] decoration-2 underline-offset-2">
          1912 setting exposes Edwardian complacency
        </span>
        .
      </div>
    </div>
  );
}

function VideosCard() {
  return (
    <div className={CARD_SHELL}>
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-[#e3f4fe] to-[#d4ddff]">
        <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-md">
          <svg viewBox="0 0 24 24" className="ml-0.5 size-6 text-accent" aria-hidden>
            <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <p className="mt-4 font-title text-base font-bold">Circle Theorems — full walkthrough</p>
      <p className="mt-1 text-sm text-muted">12 min · grades 5–9 · exam examples included</p>
      <div className="mt-3 flex gap-2 text-xs font-semibold text-muted">
        <span className="rounded-full bg-paper-2 px-3 py-1">Chapters</span>
        <span className="rounded-full bg-paper-2 px-3 py-1">Transcript</span>
      </div>
    </div>
  );
}

function FlashcardsCard() {
  return (
    <div className={CARD_SHELL}>
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <span>Card 4 of 12</span>
        <span>Active recall</span>
      </div>
      <div className="mt-3 flex min-h-36 items-center justify-center rounded-xl border-2 border-dashed border-line p-6 text-center">
        <p className="font-title text-lg font-bold">What is the quadratic formula?</p>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="flex-1 rounded-full bg-paper-2 px-4 py-2 text-center text-xs font-bold text-muted">Again</span>
        <span className="flex-1 rounded-full bg-[#e5f8ec] px-4 py-2 text-center text-xs font-bold text-[#0b6b3a]">Got it</span>
      </div>
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    tab: "Revision Guides & Notes",
    headline: "Bite-Sized Revision Guides",
    copy: "Turn dense GCSE content into clear, syllabus-aligned revision guides that make every topic easier to understand and revisit.",
    cta: "Explore revision guides",
    href: "/gcse/maths/edexcel/revision-guides",
    bg: "var(--pas-yellow)",
    text: "#8a4a06",
    btn: "#b45309",
    card: <GuidesCard />,
  },
  {
    tab: "Question Bank",
    headline: "Every Question Type",
    copy: "Target the exact topics you need with thousands of exam-style questions, worked solutions, and instant feedback.",
    cta: "Explore Question Bank",
    href: "/gcse/maths/edexcel/grade-3-3-13-substitution/questions",
    bg: "var(--pas-peri)",
    text: "#3730a3",
    btn: "#312e81",
    card: <QuestionCard />,
  },
  {
    tab: "Marking",
    headline: "Feedback That Teaches",
    copy: "Upload or type your answer and Genie marks it line by line — strengths, fixes and the exact wording examiners want.",
    cta: "Try the paper marker",
    href: "/features/answer-marking",
    bg: "var(--pas-lav)",
    text: "#6d28d9",
    btn: "#7c3aed",
    card: <MarkingCard />,
  },
  {
    tab: "Videos",
    headline: "Watch It Click",
    copy: "Short walkthroughs for every topic — worked examples first, common traps second, exam technique throughout.",
    cta: "Browse videos",
    href: "/gcse/maths/edexcel/videos",
    bg: "var(--pas-cyan)",
    text: "#0369a1",
    btn: "#0284c7",
    card: <VideosCard />,
  },
  {
    tab: "Flashcards",
    headline: "Recall That Sticks",
    copy: "Spaced-repetition flashcards for formulas, definitions and methods — self-test each topic until it is automatic.",
    cta: "Open flashcards",
    href: "/gcse/maths/flashcards",
    bg: "var(--pas-green)",
    text: "#0b6b3a",
    btn: "#059669",
    card: <FlashcardsCard />,
  },
];

export default function LearnYourWay() {
  const [idx, setIdx] = useState(0);
  const s = SLIDES[idx];

  return (
    <section className="bg-paper py-16 sm:py-20" aria-label="Learn every topic your way">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-title text-3xl font-extrabold tracking-tight sm:text-4xl">
          Learn every topic your way
        </h2>

        {/* pill tabs */}
        <div className="no-scrollbar mx-auto mt-6 flex max-w-full items-center gap-2 overflow-x-auto pb-1" role="tablist">
          {SLIDES.map((sl, i) => (
            <button
              key={sl.tab}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                i === idx ? "bg-ink text-white" : "bg-paper-2 text-ink hover:bg-ink/10"
              }`}
            >
              {sl.tab}
            </button>
          ))}
        </div>

        {/* pastel slide */}
        <div className="relative mt-8">
          <div className="rounded-[28px] p-6 transition-colors sm:p-10" style={{ background: s.bg }}>
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="order-2 lg:order-1">{s.card}</div>
              <div className="order-1 max-w-md lg:order-2 lg:justify-self-end">
                <h3 className="font-title text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl" style={{ color: s.text }}>
                  {s.headline}
                </h3>
                <p className="mt-3 text-base leading-relaxed" style={{ color: s.text, opacity: 0.85 }}>
                  {s.copy}
                </p>
                <Link
                  href={s.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                  style={{ background: s.btn }}
                >
                  {s.cta} <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          </div>

          {/* carousel arrows */}
          <button
            onClick={() => setIdx((idx - 1 + SLIDES.length) % SLIDES.length)}
            aria-label="Previous feature"
            className="absolute -left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-lg transition hover:scale-105 sm:-left-5"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((idx + 1) % SLIDES.length)}
            aria-label="Next feature"
            className="absolute -right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-lg transition hover:scale-105 sm:-right-5"
          >
            ›
          </button>
        </div>

        {/* dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-ink" : "w-2 bg-ink/15 hover:bg-ink/25"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
