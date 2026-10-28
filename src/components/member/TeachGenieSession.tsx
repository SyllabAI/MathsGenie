"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

/**
 * Teach Genie — interactive "learn by teaching" session (Feynman
 * technique). Pick up to 3 topics, explain them to Baby Genie in your
 * own words, answer Genie's follow-up questions, then read the
 * "what stuck" summary. The original runs this on its AI backend;
 * this recreation runs the same conversation shape locally.
 */

type Topic = { slug: string; title: string };
type GradeGroup = { grade: string; topics: Topic[] };
type Msg = { from: "genie" | "you"; text: string };

const PROBES = [
  "Nice start! Now give me a worked example with actual numbers — I learn best from those.",
  "Good. What's the most common mistake people make with this, and how do we dodge it?",
  "Okay! How would you explain this to a Year 7 in one sentence?",
  "Last one: where would this show up in an exam question? Describe what the question might look like.",
];

function BabyGenie({ className, mood = "happy" }: { className?: string; mood?: "happy" | "think" }) {
  const brow = mood === "think" ? <path d="M33 33c4-2 8-2 12 0" stroke="#14171c" strokeWidth="2.4" strokeLinecap="round" fill="none" /> : null;
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <path d="M48 16c17 0 27 11 27 26 0 6.5-2.2 11.6-5.6 15.2 1.5 2 2.3 4.4 2.3 7C71.7 73.6 61.3 82 48 82s-23.7-8.4-23.7-17.8c0-2.6.8-5 2.3-7C23.2 53.6 21 48.5 21 42c0-15 10-26 27-26Z" fill="#2fe4b7" />
      {brow}
      <circle cx="39" cy="42" r="4.4" fill="#14171c" />
      <circle cx="57" cy="42" r="4.4" fill="#14171c" />
      <circle cx="40.4" cy="40.6" r="1.4" fill="#fff" />
      <circle cx="58.4" cy="40.6" r="1.4" fill="#fff" />
      <path d={mood === "think" ? "M40 56h16" : "M39 54c5.4 4.2 12.6 4.2 18 0"} stroke="#14171c" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M26 66c-6 2-9 6-8 11 6 1 11-1 14-6" fill="#2fe4b7" />
    </svg>
  );
}

/** Heuristic "what stuck" analysis of the explanation. */
function analyse(msgs: Msg[], topic: string) {
  const text = msgs
    .filter((m) => m.from === "you")
    .map((m) => m.text)
    .join(" ")
    .toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const strengths: string[] = [];
  const gaps: string[] = [];
  if (words >= 60) strengths.push("Detailed explanation");
  else if (words >= 25) strengths.push("Solid overview");
  else gaps.push("Explanation was brief — aim for a full paragraph");
  if (/\d/.test(text)) strengths.push("Used real numbers");
  else gaps.push("Add a worked example with numbers");
  if (/because|so that|which means|that's why|therefore|since/.test(text)) strengths.push("Explained the why");
  else gaps.push("Say why the rule works, not just what it is");
  if (/mistake|careful|don't|do not|trick|avoid|common/.test(text)) strengths.push("Flagged the traps");
  if (new RegExp(topic.split(" ")[0].toLowerCase()).test(text) === false) gaps.push("Use the topic's own vocabulary");
  if (strengths.length === 0) strengths.push("You showed up — that's step one");
  const score = Math.min(100, strengths.length * 22 + Math.min(words, 40));
  return { strengths: strengths.slice(0, 4), gaps: gaps.slice(0, 3), score, words };
}

export default function TeachGenieSession({ board, groups }: { board: string; groups: GradeGroup[] }) {
  const [phase, setPhase] = useState<"landing" | "picking" | "teaching" | "summary">("landing");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Topic[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [probeIdx, setProbeIdx] = useState(0);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [result, setResult] = useState<ReturnType<typeof analyse> | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, topics: g.topics.filter((t) => t.title.toLowerCase().includes(query)) }))
        .filter((g) => g.topics.length > 0),
    [groups, query]
  );

  const togglePick = (t: Topic) =>
    setPicked((prev) =>
      prev.some((p) => p.slug === t.slug)
        ? prev.filter((p) => p.slug !== t.slug)
        : prev.length >= 3
          ? prev
          : [...prev, t]
    );

  const startTeaching = () => {
    if (picked.length === 0) return;
    const first = picked[0];
    setActiveTopic(first);
    setMsgs([
      { from: "genie", text: `Hi! I'm Baby Genie 🧞 I've never heard of **${first.title}** — will you teach it to me? Explain it in your own words, like I'm new to the whole idea.` },
    ]);
    setProbeIdx(0);
    setPhase("teaching");
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const next = [...msgs, { from: "you" as const, text }];
    const userMsgs = next.filter((m) => m.from === "you").length;

    if (userMsgs >= 4) {
      setResult(analyse(next, activeTopic?.title ?? ""));
      setPhase("summary");
      setDraft("");
      return;
    }
    const probe =
      userMsgs === 1
        ? PROBES[0]
        : userMsgs === 2
          ? PROBES[1]
          : PROBES[2 + (probeIdx % 2)];
    next.push({ from: "genie", text: probe });
    setMsgs(next);
    setProbeIdx((i) => i + 1);
    setDraft("");
    requestAnimationFrame(() => chatRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }));
  };

  const teachNextTopic = () => {
    const remaining = picked.filter((p) => p.slug !== activeTopic?.slug);
    if (remaining.length === 0) {
      setPhase("picking");
      return;
    }
    const nxt = remaining[0];
    setActiveTopic(nxt);
    setMsgs([{ from: "genie", text: `Ready for the next one? Teach me **${nxt.title}** — same deal, own words!` }]);
    setProbeIdx(0);
    setResult(null);
    setPhase("teaching");
  };

  /* ---------------- landing ---------------- */
  if (phase === "landing") {
    return (
      <div>
        <div className="mt-8 grid items-center gap-8 rounded-3xl border-2 border-line bg-gradient-to-br from-[#e9dcfd]/50 to-[#d3f3fa]/50 p-8 sm:grid-cols-[auto_1fr]">
          <BabyGenie className="mx-auto size-32" />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">Learn by Teaching</h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Pick a topic, explain it to Baby Genie in your own words, and see what stuck. The
              Feynman technique — the fastest way to find the gaps in your understanding.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <button
                onClick={() => setPhase("picking")}
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
              >
                Start New Session
              </button>
              <Link
                href={`/gcse/maths/${board}`}
                className="rounded-full border-2 border-line bg-paper px-6 py-2.5 text-sm font-bold transition hover:bg-paper-2"
              >
                Pick your topics
              </Link>
            </div>
          </div>
        </div>

        <h3 className="mt-12 text-xl font-extrabold">How it works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { n: 1, t: "Pick your topics", d: "Choose any topic from the course — or let Genie pick one you got wrong recently." },
            { n: 2, t: "Teach Baby Genie", d: "Explain the method out loud or in writing. Baby Genie asks the questions a confused student would ask." },
            { n: 3, t: "See what stuck", d: "Get a breakdown of what you explained clearly and what needs another look." },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl border-2 border-line bg-panel p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent font-extrabold text-white">{s.n}</span>
              <h4 className="mt-3 font-extrabold">{s.t}</h4>
              <p className="mt-1.5 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Sessions run on the original&apos;s AI tutor — this recreation documents and replays the
          flow locally.
        </p>
      </div>
    );
  }

  /* ---------------- topic picker ---------------- */
  if (phase === "picking") {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Pick topics to teach</h2>
            <p className="mt-1 text-sm text-muted">Choose up to 3 — Genie will quiz you through each one.</p>
          </div>
          <BabyGenie className="size-16 flex-none" />
        </div>

        <div className="relative mt-5 max-w-sm">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics..."
            aria-label="Search topics"
            className="w-full rounded-2xl border border-line bg-paper-2 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:bg-paper focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {picked.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {picked.map((t) => (
              <button
                key={t.slug}
                onClick={() => togglePick(t)}
                className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent/20"
              >
                {t.title} <span aria-hidden>✕</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {filtered.map((g) => (
            <section key={g.grade} className="rounded-2xl border-2 border-line bg-paper p-1">
              <p className="px-3 pb-1 pt-2 text-sm font-bold">Grade {g.grade}</p>
              <div className="grid gap-1 pb-1 pl-2 sm:grid-cols-2">
                {g.topics.map((t) => {
                  const on = picked.some((p) => p.slug === t.slug);
                  return (
                    <button
                      key={t.slug}
                      onClick={() => togglePick(t)}
                      aria-pressed={on}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition ${
                        on ? "bg-accent-soft font-semibold text-accent" : "hover:bg-paper-2"
                      }`}
                    >
                      <span className={`flex size-5 flex-none items-center justify-center rounded-md border-2 ${on ? "border-accent bg-accent text-white" : "border-ink/20"}`}>
                        {on && (
                          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3.4">
                            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="truncate">{t.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="sticky bottom-4 mt-6 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border-2 border-line bg-white/95 py-2 pl-5 pr-2 shadow-xl backdrop-blur">
            <span className="text-sm font-semibold text-muted">{picked.length}/3 selected</span>
            <button
              onClick={startTeaching}
              disabled={picked.length === 0}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-accent-ink disabled:opacity-40"
            >
              Start teaching ›
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- teaching chat ---------------- */
  if (phase === "teaching") {
    return (
      <div className="mt-8">
        <div className="rounded-3xl border-2 border-line bg-panel">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <BabyGenie className="size-12" mood={draft.length > 40 ? "think" : "happy"} />
            <div>
              <p className="font-extrabold">Teaching session</p>
              <p className="text-xs text-muted">
                Topic: <span className="font-semibold text-ink">{activeTopic?.title}</span> · explain it like I&apos;m new
              </p>
            </div>
            <button
              onClick={() => setPhase("picking")}
              className="ml-auto rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold transition hover:bg-paper-2"
            >
              Change topics
            </button>
          </div>

          <div ref={chatRef} className="flex max-h-[420px] min-h-[280px] flex-col gap-3 overflow-y-auto px-5 py-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    m.from === "you"
                      ? "rounded-br-md bg-accent text-white"
                      : "rounded-bl-md bg-paper-2 text-ink"
                  }`}
                >
                  {m.text.split(/\*\*(.+?)\*\*/g).map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j}>{part}</strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line p-4">
            <div className="flex items-end gap-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={2}
                placeholder={`Explain ${activeTopic?.title ?? "the topic"} in your own words…`}
                aria-label="Your explanation"
                className="min-h-[52px] flex-1 resize-none rounded-2xl border-2 border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent"
              />
              <button
                onClick={send}
                disabled={draft.trim() === ""}
                className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-accent-ink disabled:opacity-40"
              >
                Send
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14m-6-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">
              {msgs.filter((m) => m.from === "you").length}/4 explanations · Genie is checking for the why, the numbers and the traps
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- summary ---------------- */
  const r = result!;
  return (
    <div className="mt-8">
      <div className="mx-auto max-w-2xl rounded-3xl border-2 border-line bg-panel p-8 text-center">
        <BabyGenie className="mx-auto size-20" />
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight">See what stuck</h2>
        <p className="mt-1 text-sm text-muted">
          Your session on <span className="font-semibold text-ink">{activeTopic?.title}</span> — {r.words} words taught to Baby Genie.
        </p>

        {/* confidence meter */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Teaching confidence</span>
            <span>{r.score}%</span>
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-mint transition-all duration-700"
              style={{ width: `${r.score}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-[#e9f9ef] p-4">
            <p className="text-sm font-extrabold text-emerald-700">What stuck</p>
            <ul className="mt-2 space-y-1.5">
              {r.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="mt-0.5 text-emerald-600" aria-hidden>✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[#fdf3e3] p-4">
            <p className="text-sm font-extrabold text-amber-700">Needs another look</p>
            <ul className="mt-2 space-y-1.5">
              {r.gaps.length === 0 ? (
                <li className="text-sm text-ink/60">Nothing — a full explanation. Try a harder topic!</li>
              ) : (
                r.gaps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-ink/80">
                    <span className="mt-0.5 text-amber-600" aria-hidden>→</span> {s}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {picked.length > 1 && activeTopic && picked.filter((p) => p.slug !== activeTopic.slug).length > 0 && (
            <button
              onClick={teachNextTopic}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
            >
              Teach next topic ›
            </button>
          )}
          <button
            onClick={() => { setPhase("picking"); setResult(null); }}
            className="rounded-full border-2 border-line bg-paper px-6 py-2.5 text-sm font-bold transition hover:bg-paper-2"
          >
            Pick more topics
          </button>
          {activeTopic && (
            <Link
              href={`/gcse/maths/${board}/${activeTopic.slug}/lessons`}
              className="rounded-full border-2 border-line bg-paper px-6 py-2.5 text-sm font-bold transition hover:bg-paper-2"
            >
              Run the {activeTopic.title} lesson
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
