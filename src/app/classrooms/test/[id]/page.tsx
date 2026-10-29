"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { addResult, getTest, type TestPaper } from "@/lib/assignments";
import { SAMPLE_QUESTIONS, isAnswerCorrect, type SampleQuestion } from "@/lib/questions";

/**
 * /classrooms/test/{id} — sit a test made in the "Make a test" wizard.
 * Timed paper-style player: countdown chip in the header, questions drawn
 * deterministically from our own sample bank to match the chosen topics,
 * auto-submit when the clock hits zero, marks saved (lib/assignments.ts)
 * and echoed back on the test card. Mirrors the focus-mode feel of the
 * original's test pages (no sidebar distraction here — the shell handles it).
 */

function pickQuestions(tasks: { topic: string; count: number }[]): SampleQuestion[] {
  const used = new Set<string>();
  const out: SampleQuestion[] = [];
  for (const t of tasks) {
    const needle = t.topic.toLowerCase();
    const words = needle.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    const matches = SAMPLE_QUESTIONS.filter(
      (q) => !used.has(q.id) && (needle.includes(q.topic) || words.some((w) => q.topic.includes(w))),
    );
    const rest = SAMPLE_QUESTIONS.filter((q) => !used.has(q.id) && !matches.includes(q));
    const pool = [...matches, ...rest];
    for (let i = 0; i < Math.min(t.count, pool.length); i++) {
      const q = pool[i];
      used.add(q.id);
      out.push(q);
    }
  }
  return out;
}

export default function TestRunnerPage() {
  const params = useParams<{ id: string }>();
  const [test, setTest] = useState<TestPaper | null | undefined>(undefined); // undefined = loading
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [left, setLeft] = useState(0);
  const paper = useMemo(() => (test ? pickQuestions(test.tasks) : []), [test]);
  const submittedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const found = getTest(params.id) ?? null;
      setTest(found);
      if (found) setLeft(found.minutes * 60);
    }, 0);
    return () => clearTimeout(t);
  }, [params.id]);

  const total = paper.reduce((n, q) => n + q.marks, 0);
  const score = paper.reduce(
    (n, q) => (isAnswerCorrect(answers[q.id] || "", q.answer) ? n + q.marks : n),
    0,
  );

  function submit() {
    if (submittedRef.current || !test) return;
    submittedRef.current = true;
    setSubmitted(true);
    addResult({ kind: "test", refId: test.id, score, total });
  }

  // countdown + auto-submit
  useEffect(() => {
    if (!test || submitted) return;
    const iv = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(iv);
          submit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, submitted]);

  if (test === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted">Loading…</div>;
  }

  if (test === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Test not found</h1>
        <p className="mt-2 text-sm text-muted">It may have been deleted from this browser.</p>
        <Link
          href="/classrooms/test"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
        >
          Back to tests
        </Link>
      </div>
    );
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const urgent = !submitted && left <= 60;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* paper header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Test · in progress</p>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight">{test.title}</h1>
        </div>
        <span
          role="timer"
          aria-label="Time remaining"
          className={`rounded-full px-4 py-2 font-mono text-lg font-bold tabular-nums ${
            urgent ? "animate-pulse bg-rose-500/10 text-rose-600" : "bg-paper-2 text-ink"
          }`}
        >
          ⏱ {mm}:{ss}
        </span>
      </div>

      {submitted ? (
        <div className="mt-6 rounded-3xl border-2 border-line bg-panel p-8 text-center">
          <p className="font-hand text-4xl font-bold">
            {score}/{total} marks
          </p>
          <p className="mt-2 text-sm text-muted">
            {score === total
              ? "Full marks — flawless paper! 🎉"
              : score >= total * 0.7
                ? "Strong paper. Review the slips below and go again."
                : "Good effort — check the corrections below, then retake it."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/classrooms/test"
              className="rounded-full border-2 border-line px-5 py-2.5 text-sm font-bold transition hover:bg-paper-2"
            >
              Back to tests
            </Link>
            <button
              onClick={() => {
                submittedRef.current = false;
                setSubmitted(false);
                setAnswers({});
                setLeft(test.minutes * 60);
              }}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
            >
              Retake
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={submit}
          className="mt-5 w-full rounded-full bg-ink py-3 font-semibold text-paper transition hover:opacity-90"
        >
          Submit paper ({total} marks)
        </button>
      )}

      {/* questions */}
      <div className="mt-6 space-y-4">
        {paper.map((q, i) => {
          const given = (answers[q.id] || "").trim().toLowerCase();
          const correct = given && isAnswerCorrect(answers[q.id] || "", q.answer);
          return (
            <div key={q.id} className="rounded-2xl border border-line bg-panel p-5">
              <div className="flex gap-2">
                <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-paper">
                  Q{i + 1}
                </span>
                <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {q.marks} mark{q.marks > 1 ? "s" : ""}
                </span>
                <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {q.topic}
                </span>
              </div>
              <p className="mt-3 font-medium">{q.prompt}</p>
              <input
                value={answers[q.id] || ""}
                disabled={submitted}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Your answer…"
                className={`mt-3 w-full rounded-xl border bg-paper px-4 py-2.5 outline-none ${
                  submitted
                    ? correct
                      ? "border-emerald-500"
                      : "border-rose-500"
                    : "border-line"
                }`}
              />
              {submitted && (
                <p className="mt-2 text-sm text-muted">
                  {correct ? "✓ Correct" : "✗ Answer"}: <strong className="text-accent">{q.answer}</strong>
                  {q.working ? ` — ${q.working}` : ""}
                </p>
              )}
            </div>
          );
        })}
        {paper.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            No questions could be built from this test&apos;s topics.
          </p>
        )}
      </div>
    </div>
  );
}
