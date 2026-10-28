"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addClassroom,
  greeting,
  useClassrooms,
  USER,
  type Classroom,
} from "@/lib/classrooms";

/**
 * /classrooms — the member home, cloned from the live logged-in dashboard
 * (research/04-member-area.md §4): time-aware greeting, blue hero band,
 * My classrooms (empty state or cards), Getting started links, and the
 * two-step "New classroom" modal (subject → exam board → name).
 */

const SUBJECTS = [
  { name: "Maths", glyph: "ƒ(x)", note: "Choose exam board", expand: true },
  { name: "Further Maths", glyph: "∿", note: "Choose exam board", expand: true },
  { name: "Statistics", glyph: "⌗", note: "Choose exam board", expand: true },
  { name: "Maths Numeracy", glyph: "ƒ(x)", note: "WJEC", expand: false, boards: ["WJEC"] },
  { name: "Old Maths", glyph: "ƒ(x)", note: "Edexcel", expand: false, boards: ["Edexcel"] },
];

const BOARDS = ["AQA", "Edexcel", "Eduqas", "OCR", "WJEC", "CCEA"];

const STARTERS = [
  { t: "Make a lesson", d: "Build a lesson for one of your classrooms.", icon: "📖", href: "/gcse/maths/edexcel/lessons" },
  { t: "Make a test", d: "Pick the questions and set it for your class.", icon: "🧪", href: "/gcse/maths/edexcel/mock-exam-builder" },
  { t: "Set homework", d: "Choose the tasks and send them to your class.", icon: "📝", href: "/classrooms/homework" },
];

export default function ClassroomsPage() {
  const rooms = useClassrooms();
  const [modal, setModal] = useState(false);

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-sky-400/10 via-transparent to-transparent">
      <HeroBand />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {greeting()}, {USER.first}
        </h3>

        <section className="mt-8">
          <h5 className="flex items-center gap-2 text-sm font-bold text-ink/70">
            <svg viewBox="0 0 24 24" className="size-4 text-muted" fill="currentColor" aria-hidden>
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" />
            </svg>
            My classrooms
          </h5>

          {rooms.length === 0 ? (
            <div className="mt-4 rounded-3xl border-2 border-line bg-panel px-6 py-14 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-paper-2">
                <svg viewBox="0 0 24 24" className="size-8 text-muted" fill="currentColor" aria-hidden>
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" />
                </svg>
              </div>
              <h4 className="mt-4 text-xl font-extrabold">No GCSE classrooms yet</h4>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
                Create a classroom to get started. Switch qualification to see your other classrooms.
              </p>
              <button
                onClick={() => setModal(true)}
                className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
              >
                New classroom
              </button>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((r) => (
                <ClassroomCard key={r.id} room={r} />
              ))}
              <button
                onClick={() => setModal(true)}
                className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line text-sm font-semibold text-muted transition hover:border-accent hover:text-accent"
              >
                <span className="text-2xl" aria-hidden>＋</span>
                New classroom
              </button>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h5 className="text-sm font-bold text-ink/70">Getting started</h5>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {STARTERS.map((s) => (
              <Link
                key={s.t}
                href={s.href}
                className="group flex items-center gap-3 rounded-2xl border-2 border-line bg-panel p-4 transition hover:border-accent/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper-2 text-lg" aria-hidden>
                  {s.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{s.t}</span>
                  <span className="block truncate text-xs text-muted">{s.d}</span>
                </span>
                <span className="ml-auto text-muted transition group-hover:translate-x-0.5" aria-hidden>›</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {modal && <NewClassroomModal onClose={() => setModal(false)} />}
    </div>
  );
}

function ClassroomCard({ room }: { room: Classroom }) {
  const grad = room.boards[0] === "Edexcel" ? "from-[#e5306f] to-[#c026a3]" : "from-[#5cc1ea] to-[#1cb0f6]";
  return (
    <Link
      href={`/classrooms/${room.id}`}
      className={`group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${grad} p-4 text-white shadow-sm transition hover:shadow-md`}
    >
      <svg viewBox="0 0 200 120" className="absolute -right-6 -top-4 size-36 opacity-30" aria-hidden>
        <path d="M20 90C60 20 140 20 180 70" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />
      </svg>
      <div className="relative">
        <p className="text-xs font-semibold text-white/75">{room.boards.join(" / ")}</p>
        <p className="mt-1 text-lg font-extrabold">{room.name}</p>
      </div>
      <span className="relative inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink transition group-hover:bg-white/90">
        Open <span aria-hidden>›</span>
      </span>
    </Link>
  );
}

function HeroBand() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
      <svg viewBox="0 0 1200 160" className="size-full" preserveAspectRatio="xMidYMid slice">
        <rect width="1200" height="160" fill="url(#heroGrad)" opacity="0.22" />
        <circle cx="1120" cy="90" r="70" fill="#5cc1ea" opacity="0.18" />
        <circle cx="80" cy="110" r="56" fill="#2fe4b7" opacity="0.14" />
        <circle cx="620" cy="0" r="40" fill="#d4ddff" opacity="0.4" />
        <defs>
          <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5cc1ea" />
            <stop offset="0.5" stopColor="#2fe4b7" />
            <stop offset="1" stopColor="#1cb0f6" />
          </linearGradient>
        </defs>
      </svg>
      <Genie className="absolute -left-2 top-16 size-14 opacity-70" />
      <Genie className="absolute -right-1 top-14 size-16 opacity-70 flip" />
    </div>
  );
}

function Genie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 8c8 0 13 5 13 12 0 3-1 5.4-2.6 7.2.7 1 1.1 2.2 1.1 3.5C35.5 36 30.6 40 24 40s-11.5-4-11.5-9.3c0-1.3.4-2.5 1.1-3.5C12 25.4 11 23 11 20c0-7 5-12 13-12Z" fill="#2fe4b7" />
      <circle cx="19.5" cy="21" r="2.2" fill="#14171c" />
      <circle cx="28.5" cy="21" r="2.2" fill="#14171c" />
      <path d="M19.5 27.5c2.6 2 6.4 2 9 0" stroke="#14171c" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ---------------- two-step creation modal (original flow) --------------- */
function NewClassroomModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [subject, setSubject] = useState<string | null>(null);
  const [board, setBoard] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [name, setName] = useState("New Maths classroom");
  const [created, setCreated] = useState<Classroom | null>(null);

  const canContinue = useMemo(() => Boolean(subject), [subject]);

  function pickSubject(s: (typeof SUBJECTS)[number]) {
    if (s.expand) {
      setMenuOpen(menuOpen === s.name ? null : s.name);
      setSubject(s.name);
      setBoard(null);
    } else {
      setSubject(s.name);
      setBoard(s.boards?.[0] ?? null);
      setMenuOpen(null);
    }
  }

  function create() {
    const room = addClassroom({
      name: name || "New Maths classroom",
      subject: subject ?? "Maths",
      boards: board ? [board] : ["Edexcel"],
    });
    setCreated(room);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={created ? "Classroom created" : step === 1 ? "Choose a subject" : "Name your classroom"}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-paper p-6 shadow-2xl sm:p-8">
        {created ? (
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#d9f4e5]">
              <svg viewBox="0 0 24 24" className="size-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-extrabold">Classroom created</h3>
            <p className="mt-1 text-sm text-muted">
              {created.name} · {created.boards.join("/")} — you can open it from your classrooms.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="rounded-full border-2 border-line px-5 py-2.5 text-sm font-bold transition hover:bg-paper-2"
              >
                Back to classrooms
              </button>
              <Link
                href={`/classrooms/${created.id}`}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
              >
                Open classroom
              </Link>
            </div>
          </div>
        ) : step === 1 ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Step 1 of 2</p>
                <h3 className="mt-1 text-2xl font-extrabold">Choose a subject</h3>
                <p className="mt-1 text-sm text-muted">
                  Pick the GCSE maths subject this classroom is for. Classrooms are maths-only for now.
                </p>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted transition hover:bg-paper-2">✕</button>
            </div>

            <label className="mt-5 flex items-center gap-2 rounded-full bg-paper-2 px-4 py-2.5">
              <svg viewBox="0 0 20 20" className="size-4 text-muted" aria-hidden>
                <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input placeholder="Search GCSE subjects" className="w-full bg-transparent text-sm outline-none" />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {SUBJECTS.map((s) => (
                <div key={s.name} className="relative">
                  <button
                    onClick={() => pickSubject(s)}
                    className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 px-3 py-5 transition ${
                      subject === s.name ? "border-accent bg-accent-soft/50" : "border-line hover:border-ink/25"
                    }`}
                  >
                    <span className="text-lg font-bold text-[#e5306f]">{s.glyph}</span>
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-xs text-muted">{s.note}</span>
                  </button>
                  {menuOpen === s.name && (
                    <div className="absolute inset-x-0 top-full z-10 mt-1 rounded-2xl border-2 border-ink/10 bg-paper p-1.5 shadow-xl">
                      {BOARDS.map((b) => (
                        <button
                          key={b}
                          onClick={() => { setBoard(b); setMenuOpen(null); }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-paper-2 ${
                            board === b ? "text-accent" : ""
                          }`}
                        >
                          {b}
                          {board === b && <span aria-hidden>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="rounded-full px-4 py-2.5 text-sm font-bold text-muted transition hover:bg-paper-2">
                Cancel
              </button>
              <button
                disabled={!canContinue}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue <span aria-hidden>→</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Step 2 of 2</p>
                <h3 className="mt-1 text-2xl font-extrabold">Name your classroom</h3>
                <p className="mt-1 text-sm text-muted">
                  {subject} · {board}
                </p>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted transition hover:bg-paper-2">✕</button>
            </div>

            <label className="mt-6 block text-sm font-semibold">
              Classroom name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-sm font-normal outline-none transition focus:border-accent"
              />
            </label>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-full border-2 border-line px-5 py-2.5 text-sm font-bold transition hover:bg-paper-2"
              >
                Back
              </button>
              <button
                onClick={create}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
              >
                Create classroom
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
