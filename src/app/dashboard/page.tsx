"use client";

import { useState } from "react";
import Greeting from "@/components/member/Greeting";

const SUBJECTS = [
  { name: "Maths", note: "pick exam boards", expand: true },
  { name: "Further Maths", note: "pick exam boards", expand: true },
  { name: "Statistics", note: "pick exam boards", expand: true },
  { name: "Maths Numeracy", note: "WJEC" },
  { name: "Old spec Maths", note: "Edexcel" },
];

const BOARDS = ["Edexcel", "AQA", "OCR", "WJEC", "Eduqas", "CCEA"];

const STARTERS = [
  { t: "Make a lesson", d: "Build a lesson for one of your classrooms.", icon: "📖" },
  { t: "Make a test", d: "Pick the questions and set it for your class.", icon: "🧪" },
  { t: "Set homework", d: "Choose the tasks and send them to your class.", icon: "📝" },
];

export default function DashboardHome() {
  const [modal, setModal] = useState(false);
  const [subject, setSubject] = useState<string | null>(null);
  const [board, setBoard] = useState<string | null>(null);

  return (
    <div className="relative min-h-full bg-gradient-to-b from-sky-400/10 to-transparent">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Greeting name="Demo Student" />

        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink/80">
            <span aria-hidden="true">👤</span> My classrooms
          </h2>
          <div className="mt-4 rounded-3xl border border-line bg-panel p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-2 text-2xl" aria-hidden="true">
              👤
            </span>
            <p className="mt-4 text-lg font-bold">No GCSE classrooms yet</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
              Create a classroom to get started. Switch qualification to see your
              other classrooms.
            </p>
            <button
              onClick={() => setModal(true)}
              className="mt-5 rounded-full bg-sky-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              New classroom
            </button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink/80">Getting started</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {STARTERS.map((s) => (
              <button
                key={s.t}
                className="flex items-start gap-3 rounded-3xl border border-line bg-panel p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
              >
                <span className="text-2xl" aria-hidden="true">{s.icon}</span>
                <span>
                  <span className="block font-bold">{s.t}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{s.d}</span>
                </span>
                <span className="ml-auto self-center text-muted" aria-hidden="true">›</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* New classroom modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          onClick={() => setModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a subject"
        >
          <div
            className="w-full max-w-lg rounded-t-3xl border border-line bg-panel p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Choose a subject</h3>
              <button
                onClick={() => setModal(false)}
                aria-label="Close"
                className="rounded-full px-2.5 py-1 text-muted hover:bg-paper-2"
              >
                ✕
              </button>
            </div>
            <input
              placeholder="Search GCSE subjects"
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            />
            <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto">
              {SUBJECTS.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSubject(s.expand ? s.name : s.name)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    subject === s.name
                      ? "border-sky-400 bg-sky-400/10 text-sky-700"
                      : "border-line bg-paper hover:bg-paper-2"
                  }`}
                >
                  {s.name}
                  <span className="text-xs font-normal text-muted">{s.note} ›</span>
                </button>
              ))}
              {subject && SUBJECTS.find((x) => x.name === subject)?.expand && (
                <div className="rounded-2xl border border-line bg-paper p-3">
                  <p className="px-1 pb-2 text-xs font-bold uppercase tracking-wide text-muted">
                    Exam board
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {BOARDS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBoard(b)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                          board === b ? "bg-sky-500 text-white" : "bg-paper-2 text-ink/70 hover:bg-ink/5"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              disabled={!subject || !board}
              className="mt-4 w-full rounded-full bg-sky-500 py-3 text-sm font-bold text-white transition enabled:hover:bg-sky-600 disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
