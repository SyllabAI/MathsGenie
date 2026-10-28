"use client";

import { useMemo, useState } from "react";
import type { ALevelLesson, LessonQuestion } from "@/lib/alevel";

/**
 * Interactive step-by-step lesson player for the recreated A-Level lessons.
 * Content is original composition (data/a-level-maths/lessons-edexcel.json);
 * everything runs client-side with instant feedback — no backend.
 */

type Feedback = { correct: boolean; text: string } | null;

const isAcceptable = (raw: string, q: Extract<LessonQuestion, { type: "numeric" }>) => {
  const norm = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, "").replace(/\.+$/, "");
  return q.accept.map(norm).includes(norm(raw)) || norm(raw) === norm(q.answer);
};

export default function LessonPlayer({
  lesson,
  practiceUrl,
  next,
}: {
  lesson: ALevelLesson;
  practiceUrl: string;
  next?: { slug: string; title: string; href: string };
}) {
  // stages: 0 = intro, 1..lesson.steps.length = content steps, steps.length+1 = summary
  const totalSteps = lesson.steps.length + 2;
  const summaryStage = totalSteps - 1;
  const [stage, setStage] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [picked, setPicked] = useState<Record<string, number>>({}); // mcq answers by q index within check step
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});

  const checkSteps = useMemo(
    () => lesson.steps.filter((s): s is Extract<typeof s, { kind: "check" }> => s.kind === "check"),
    [lesson],
  );
  const totalQuestions = checkSteps.reduce((n, s) => n + s.questions.length, 0);
  const firstTryCorrect = Object.values(feedback).filter((f) => f?.correct).length;

  const isCheck = (i: number) => lesson.steps[i - 1]?.kind === "check";
  const stepKey = (stepIdx: number, qIdx: number) => `${stepIdx}:${qIdx}`;

  const answerMcq = (stepIdx: number, qIdx: number, choice: number) => {
    const key = stepKey(stepIdx, qIdx);
    if (solved[key]) return;
    const step = lesson.steps[stepIdx - 1] as Extract<ALevelLesson["steps"][number], { kind: "check" }>;
    const q = step.questions[qIdx] as Extract<LessonQuestion, { type: "mcq" }>;
    const correct = choice === q.answer;
    setPicked((p) => ({ ...p, [key]: choice }));
    setFeedback((f) => ({ ...f, [key]: { correct, text: q.explain } }));
    if (correct) setSolved((s) => ({ ...s, [key]: true }));
  };

  const answerNumeric = (stepIdx: number, qIdx: number) => {
    const key = stepKey(stepIdx, qIdx);
    if (solved[key]) return;
    const step = lesson.steps[stepIdx - 1] as Extract<ALevelLesson["steps"][number], { kind: "check" }>;
    const q = step.questions[qIdx] as Extract<LessonQuestion, { type: "numeric" }>;
    const raw = inputs[key] ?? "";
    if (raw.trim() === "") return;
    const correct = isAcceptable(raw, q);
    setFeedback((f) => ({ ...f, [key]: { correct, text: q.explain } }));
    if (correct) setSolved((s) => ({ ...s, [key]: true }));
  };

  const stepSolved = (stepIdx: number) => {
    const step = lesson.steps[stepIdx - 1] as Extract<ALevelLesson["steps"][number], { kind: "check" }>;
    return step.questions.every((_, qIdx) => solved[stepKey(stepIdx, qIdx)]);
  };

  const advance = () => setStage((s) => Math.min(s + 1, totalSteps - 1));
  const restart = () => {
    setStage(0);
    setRevealed({});
    setPicked({});
    setInputs({});
    setFeedback({});
    setSolved({});
  };

  const progress = Math.round(((stage + 1) / totalSteps) * 100);

  return (
    <div>
      {/* progress */}
      <div className="sticky top-14 z-20 -mx-1 mb-6 rounded-full bg-paper/85 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Lesson progress"
          >
            <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="shrink-0 text-xs font-semibold text-muted">{progress}%</span>
        </div>
      </div>

      {/* intro */}
      {stage === 0 && (
        <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label="Lesson overview">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-accent">{lesson.module}</span>
            <span className="rounded-full bg-paper-2 px-3 py-1">≈ {lesson.minutes} min</span>
            <span className="rounded-full bg-paper-2 px-3">{lesson.steps.filter((s) => s.kind === "check").reduce((n, s) => n + s.questions.length, 0)} quick checks</span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{lesson.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{lesson.keyIdea}</p>
          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-muted">By the end you will be able to</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent" aria-hidden>✓</span>
                {o}
              </li>
            ))}
          </ul>
          <button onClick={advance} className="btn-primary mt-6">Start lesson</button>
        </section>
      )}

      {/* content steps */}
      {stage >= 1 && stage < summaryStage && (() => {
        const step = lesson.steps[stage - 1];
        if (step.kind === "concept") {
          const shown = revealed[stage - 1] ?? false;
          return (
            <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label={step.title}>
              <h2 className="text-xl font-extrabold tracking-tight">{step.title}</h2>
              {step.body.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 max-w-2xl text-[15px] leading-relaxed">{p}</p>
              ))}
              <div className="mt-5 rounded-2xl border-2 border-accent/25 bg-accent-soft/40 p-5">
                <p className="text-sm font-bold">{step.example.problem}</p>
                {!shown ? (
                  <button onClick={() => setRevealed((r) => ({ ...r, [stage - 1]: true }))} className="btn-ghost mt-3">
                    Show worked solution
                  </button>
                ) : (
                  <div className="mt-3">
                    <ol className="space-y-1.5 text-sm leading-relaxed">
                      {step.example.lines.map((l) => (
                        <li key={l.slice(0, 24)} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          {l}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 rounded-xl bg-panel px-3 py-2 text-xs font-semibold text-accent-ink">
                      Tip: {step.example.takeaway}
                    </p>
                  </div>
                )}
              </div>
              <button onClick={advance} className="btn-primary mt-6">
                {isCheck(stage + 1) ? "Try the quick checks" : "Continue"}
              </button>
            </section>
          );
        }
        return (
          <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label={step.title}>
            <h2 className="text-xl font-extrabold tracking-tight">{step.title}</h2>
            <p className="mt-1 text-sm text-muted">Answer to move on — instant feedback, first-try answers count for your score.</p>
            <div className="mt-5 space-y-6">
              {step.questions.map((q, qIdx) => {
                const key = stepKey(stage, qIdx);
                const fb = feedback[key] ?? null;
                const done = !!solved[key];
                return (
                  <div key={key} className="rounded-2xl border border-line bg-paper p-5">
                    <p className="text-sm font-bold">
                      {qIdx + 1}. {q.prompt}
                    </p>
                    {q.type === "mcq" ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => {
                          const chosen = picked[key] === oi;
                          const state = !fb
                            ? "border-line bg-panel hover:border-accent/50"
                            : done && chosen
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                              : chosen && !fb.correct
                                ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                                : oi === q.answer && done
                                  ? "border-emerald-400/60 bg-emerald-50/60"
                                  : "border-line bg-panel opacity-60";
                          return (
                            <button
                              key={opt}
                              onClick={() => answerMcq(stage, qIdx, oi)}
                              disabled={done}
                              className={`rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-medium transition ${state}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <input
                          value={inputs[key] ?? ""}
                          onChange={(e) => setInputs((v) => ({ ...v, [key]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && answerNumeric(stage, qIdx)}
                          disabled={done}
                          placeholder="Your answer"
                          aria-label={`Answer for: ${q.prompt}`}
                          className="w-44 rounded-xl border-2 border-line bg-panel px-3 py-2 text-sm font-medium focus:border-accent"
                        />
                        {!done && (
                          <button onClick={() => answerNumeric(stage, qIdx)} className="btn-ghost">Check</button>
                        )}
                      </div>
                    )}
                    {fb && (
                      <p
                        role="status"
                        aria-live="polite"
                        className={`mt-3 rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          fb.correct ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100" : "bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
                        }`}
                      >
                        <strong>{fb.correct ? "Correct — " : "Not yet — "}</strong>
                        {fb.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={advance} disabled={!stepSolved(stage)} className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-40">
              {stepSolved(stage) ? (stage === summaryStage - 1 ? "See your results" : "Continue") : "Answer all questions to continue"}
            </button>
          </section>
        );
      })()}

      {/* summary */}
      {stage === summaryStage && (
        <section className="rounded-3xl border-2 border-line bg-panel p-6 sm:p-8" aria-label="Lesson results">
          <h2 className="text-2xl font-extrabold tracking-tight">Lesson complete — {lesson.title}</h2>
          <p className="mt-2 text-sm text-muted">
            {firstTryCorrect === totalQuestions
              ? `Perfect run: ${firstTryCorrect}/${totalQuestions} first-try. You are ready for exam-style questions on this topic.`
              : `You solved ${firstTryCorrect} of ${totalQuestions} on the first try. Skim the worked solutions once more, then try the originals — accuracy compounds.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={restart} className="btn-ghost">Teach it again from the start</button>
            <a href={practiceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Practice on the original ↗
            </a>
            {next && (
              <a href={next.href} className="btn-black">Next lesson: {next.title} →</a>
            )}
          </div>
          <p className="mt-6 rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs leading-relaxed text-muted">
            Lesson content is an original composition written for this recreation
            (UI demo material) — the topic list follows the public 9MA0 curriculum.
            Live lessons on the original site: see the Lessons tab ↗.
          </p>
        </section>
      )}
    </div>
  );
}
