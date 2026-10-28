"use client";

import { useState } from "react";

/**
 * Impact survey — the original gates this behind login; this recreation is a
 * short standalone form stored in the browser only.
 */

const QUESTIONS = [
  {
    id: "year",
    label: "Where are you in your school journey?",
    options: ["Year 9 or below", "Year 10", "Year 11", "Resit / post-16", "Teacher or tutor", "Parent"],
  },
  {
    id: "board",
    label: "Which exam board are you taking?",
    options: ["Edexcel", "AQA", "OCR", "Eduqas", "WJEC", "CCEA", "Not sure yet"],
  },
  {
    id: "usage",
    label: "How often do you revise here?",
    options: ["Daily", "A few times a week", "Weekly", "Before mocks/exams only", "First visit"],
  },
];

export default function ImpactSurveyPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="rounded-3xl border border-line bg-paper p-8 shadow-sm">
        <h1 className="font-title text-2xl font-extrabold tracking-tight text-ink">
          Impact survey
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Three quick questions that help shape what gets built next. This recreation keeps
          your answers in this browser only — nothing is uploaded.
        </p>

        <div className="mt-6 space-y-6">
          {QUESTIONS.map((q) => (
            <fieldset key={q.id}>
              <legend className="text-sm font-bold text-ink">{q.label}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={answers[q.id] === o}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                      answers[q.id] === o
                        ? "border-accent bg-accent-soft text-accent-ink"
                        : "border-line text-ink/70 hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-8">
          {done ? (
            <p className="rounded-2xl bg-[#d9f4e5] px-5 py-4 text-sm font-bold text-[#0f7a55]">
              Thanks — your answers were saved in this browser. Shukran for helping out!
            </p>
          ) : (
            <p className="text-xs text-ink/40">Answer all three to finish the survey.</p>
          )}
        </div>
      </div>
    </div>
  );
}
