"use client";

import { useMemo, useRef, useState } from "react";

/**
 * Interactive "Learn by Teaching" (Feynman technique) session for the A-Level
 * Teach Genie route. The original runs this on its AI tutor; this recreation
 * ships an honest client-side demo: pick a topic → explain it in your own
 * words → audit your gaps → see what stuck, with copyable session notes.
 */

export type TeachTopic = { slug: string; title: string; module: string };

const EXPLAIN_TARGET = 120;

const GENERIC_PROMPTS = [
  "What is the core idea, in one sentence a friend could follow?",
  "What does it look like when used in a typical exam question?",
  "Where does people's intuition usually go wrong here?",
];

const GAP_PROMPTS = [
  "I can state the key definitions without looking anything up.",
  "I can work a standard example end-to-end, unaided.",
  "I can explain WHY each step in the method is allowed.",
  "I know the classic twist examiners add to this topic.",
  "I could teach this to someone who missed the last three lessons.",
];

export default function TeachSession({
  topics,
  hints,
  practiceBase,
}: {
  topics: TeachTopic[];
  /** slug → one-line key idea (only where an interactive lesson exists). */
  hints: Record<string, string>;
  /** Original-site topic URL prefix for the "try questions" hand-off. */
  practiceBase: string;
}) {
  const modules = useMemo(() => {
    const g = new Map<string, TeachTopic[]>();
    for (const t of topics) g.set(t.module, [...(g.get(t.module) ?? []), t]);
    return [...g.entries()];
  }, [topics]);

  const [stage, setStage] = useState(0); // 0 pick, 1 explain, 2 gaps, 3 stuck
  const [topic, setTopic] = useState<TeachTopic | null>(null);
  const [explanation, setExplanation] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [gaps, setGaps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const explainRef = useRef<HTMLTextAreaElement>(null);

  const gapCount = Object.values(gaps).filter(Boolean).length;
  const words = explanation.trim() ? explanation.trim().split(/\s+/).length : 0;

  const pick = (t: TeachTopic) => {
    setTopic(t);
    setStage(1);
    setExplanation("");
    setShowHint(false);
    setGaps({});
    setCopied(false);
    requestAnimationFrame(() => explainRef.current?.focus());
  };

  const copyNotes = async () => {
    if (!topic) return;
    const gapLines = GAP_PROMPTS.filter((_, i) => gaps[i]).map((g) => `- [ ] ${g}`);
    const notes = [
      `Teach Genie session — ${topic.title} (${topic.module})`,
      "",
      "My explanation:",
      explanation.trim() || "(nothing written)",
      "",
      "Gaps to close next:",
      ...(gapCount ? gapLines : ["- none flagged — try a harder topic"]),
      "",
      "Practice: " + `${practiceBase}/${topic.slug}/questions`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setStage(0);
    setTopic(null);
    setExplanation("");
    setGaps({});
    setCopied(false);
  };

  return (
    <div id="teach-session" className="space-y-6">
      {/* stage indicator */}
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted" aria-label="Session stages">
        {["Pick a topic", "Explain it", "Spot the gaps", "See what stuck"].map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full ${
                stage === i ? "bg-accent text-white" : stage > i ? "bg-accent-soft text-accent" : "bg-paper-2"
              }`}
              aria-current={stage === i ? "step" : undefined}
            >
              {i + 1}
            </span>
            <span className={stage === i ? "text-ink" : undefined}>{label}</span>
            {i < 3 && <span className="text-ink/30" aria-hidden>→</span>}
          </li>
        ))}
      </ol>

      {/* stage 0 — topic picker */}
      {stage === 0 && (
        <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label="Pick a topic">
          <h2 className="text-xl font-extrabold tracking-tight">Pick a topic to teach</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Choose anything from the course. Topics with an interactive lesson in this
            recreation include a key-idea nudge if you get stuck; everything else
            links straight into the original&apos;s course.
          </p>
          <div className="mt-5 space-y-5">
            {modules.map(([mod, list]) => (
              <div key={mod}>
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{mod}</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((t) => (
                    <button
                      key={t.slug}
                      onClick={() => pick(t)}
                      className="rounded-2xl border border-line bg-paper px-3.5 py-2.5 text-left text-sm font-medium transition hover:border-accent/60 hover:bg-accent-soft/40"
                    >
                      <span className="block truncate">{t.title}</span>
                      {hints[t.slug] && (
                        <span className="mt-0.5 block text-[10.5px] font-semibold uppercase tracking-wide text-accent">lesson nudge available</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* stage 1 — explain */}
      {stage === 1 && topic && (
        <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label="Explain it">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold tracking-tight">Teach Baby Genie: {topic.title}</h2>
            <button onClick={reset} className="text-xs font-semibold text-muted underline hover:text-accent">change topic</button>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {GENERIC_PROMPTS.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <textarea
            ref={explainRef}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={8}
            aria-label={`Your explanation of ${topic.title}`}
            placeholder="Explain it in your own words, as if Baby Genie has never seen the topic…"
            className="mt-4 w-full rounded-2xl border-2 border-line bg-paper p-4 text-sm leading-relaxed focus:border-accent"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className={`text-xs font-semibold ${words >= EXPLAIN_TARGET / 10 ? "text-muted" : "text-accent"}`}>
              {words} words — aim for at least {EXPLAIN_TARGET / 10} lines of thinking ({EXPLAIN_TARGET}+ characters)
            </p>
            {hints[topic.slug] && (
              <button onClick={() => setShowHint((s) => !s)} className="text-xs font-semibold text-accent underline">
                {showHint ? "hide the nudge" : "need a nudge?"}
              </button>
            )}
          </div>
          {showHint && hints[topic.slug] && (
            <p className="mt-2 rounded-xl bg-accent-soft/50 px-3 py-2 text-xs leading-relaxed text-ink/80">
              Key idea: {hints[topic.slug]}
            </p>
          )}
          <button
            onClick={() => setStage(2)}
            disabled={explanation.trim().length < EXPLAIN_TARGET}
            className="btn-primary mt-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {explanation.trim().length < EXPLAIN_TARGET ? `Write at least ${EXPLAIN_TARGET} characters to continue` : "Spot the gaps →"}
          </button>
        </section>
      )}

      {/* stage 2 — gaps */}
      {stage === 2 && topic && (
        <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label="Spot the gaps">
          <h2 className="text-xl font-extrabold tracking-tight">Spot the gaps: {topic.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            A confused student would push on the weakest points. Tick everything you
            are <em>not</em> yet certain about — honest gaps make the best revision list.
          </p>
          <div className="mt-4 space-y-2">
            {GAP_PROMPTS.map((g, i) => (
              <label
                key={g}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm transition hover:border-accent/50"
              >
                <input
                  type="checkbox"
                  checked={gaps[i] ?? false}
                  onChange={(e) => setGaps((s) => ({ ...s, [i]: e.target.checked }))}
                  className="mt-0.5 size-4 accent-[#1cb0f6]"
                />
                {g}
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => setStage(3)} className="btn-primary">See what stuck →</button>
            <button onClick={() => setStage(1)} className="btn-ghost">Back to my explanation</button>
          </div>
        </section>
      )}

      {/* stage 3 — what stuck */}
      {stage === 3 && topic && (
        <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label="What stuck">
          <h2 className="text-xl font-extrabold tracking-tight">What stuck: {topic.title}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted">Your explanation</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {explanation.trim() || "(nothing written)"}
              </p>
            </div>
            <div className="w-full rounded-2xl border border-line bg-paper p-5 lg:w-72">
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted">Session check</h3>
              <p className="mt-2 text-sm">
                {gapCount === 0
                  ? "All five checks ticked confidently — teach a harder topic, or jump into exam-style questions."
                  : `${gapCount} gap${gapCount === 1 ? "" : "s"} flagged. Revisit the flagged items first, then re-explain the topic from scratch.`}
              </p>
              {gapCount > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted">
                  {GAP_PROMPTS.filter((_, i) => gaps[i]).map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={copyNotes} className="btn-ghost">{copied ? "Copied ✓" : "Copy session notes"}</button>
            <a href={`${practiceBase}/${topic.slug}/questions`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Try questions on the original ↗
            </a>
            <button onClick={reset} className="btn-black">Teach another topic</button>
          </div>
        </section>
      )}

      <p className="text-center text-xs text-muted">
        Demo recreation — real Teach Genie sessions run on the original&apos;s AI tutor.
      </p>
    </div>
  );
}
