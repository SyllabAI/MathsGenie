"use client";

import { useEffect, useState } from "react";

/**
 * Big single-quote carousel from the original homepage: oversized quote with
 * a colored underlined phrase, blob avatar, name + role, dot pagination.
 * Testimonials are FICTIONAL (written for this recreation).
 */

type Quote = { text: string; highlight: string; after: string; name: string; role: string; color: string; emoji: string; bg: string };

const QUOTES: Quote[] = [
  {
    text: "Honestly this site carries my whole revision timetable. It ",
    highlight: "turned my grade 5 into a solid 7",
    after: " in one term of past-paper practice.",
    name: "Priya K.",
    role: "GCSE Student",
    color: "#e7000b",
    emoji: "🦊",
    bg: "#fde8ec",
  },
  {
    text: "The step-by-step solutions are unreal. It ",
    highlight: "explains exactly where I lost the mark",
    after: " instead of just giving the answer.",
    name: "Tom W.",
    role: "A-Level Student",
    color: "#1cb0f6",
    emoji: "🐙",
    bg: "#e3f4fe",
  },
  {
    text: "I recommend it to every student I teach. It ",
    highlight: "takes you through the entire course",
    after: " topic by topic with real exam questions.",
    name: "Mr D. Hughes",
    role: "Head of Maths",
    color: "#0b6b3a",
    emoji: "🐸",
    bg: "#d9f4e5",
  },
  {
    text: "Daily Greens plus Question Rush made revision feel like a game. It ",
    highlight: "kept me coming back every single day",
    after: " right up until paper 3.",
    name: "Amara N.",
    role: "GCSE Student",
    color: "#a333e0",
    emoji: "🦄",
    bg: "#e9dcfd",
  },
];

export default function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const q = QUOTES[idx];

  return (
    <section className="bg-paper py-16 sm:py-20" aria-label="Student testimonials">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <blockquote className="font-title text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[28px]">
          <span className="text-muted">“</span>
          {q.text}
          <span
            className="underline-decoration underline-offset-4"
            style={{ color: q.color, textDecoration: "underline", textDecorationThickness: 2, textDecorationColor: q.color }}
          >
            {q.highlight}
          </span>
          {q.after}
          <span className="text-muted">”</span>
        </blockquote>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span
            className="flex size-11 items-center justify-center rounded-full text-xl"
            style={{ background: q.bg }}
            aria-hidden
          >
            {q.emoji}
          </span>
          <span className="text-left">
            <span className="block text-sm font-bold">{q.name}</span>
            <span className="block text-sm text-muted">{q.role}</span>
          </span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Choose testimonial">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-accent" : "w-2 bg-ink/15 hover:bg-ink/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
