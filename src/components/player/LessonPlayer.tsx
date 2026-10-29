"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lesson, Step } from "@/lib/lessons";
import { LESSON_INDEX } from "@/lib/lessons";

/**
 * Full-screen lesson player — recreates the original's immersive focus
 * mode: fixed viewport chrome (top bar, icon rail, topics drawer), a
 * step progress bar, and step types lifted from the live player:
 *   teach/example  — paragraphs revealed one-by-one, older ones fade
 *   mcq            — A–D options, instant green/red feedback band
 *   fill / input   — inline answer box with Check + hint
 * Footer: Back · Ask Genie (hint popover) · Next/Continue/Check.
 */

export function markLessonDone(slug: string) {
  try {
    const raw = localStorage.getItem("mg-lessons-done");
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    set.add(slug);
    localStorage.setItem("mg-lessons-done", JSON.stringify([...set]));
    window.dispatchEvent(new Event("mg-lessons-updated"));
  } catch {}
}

/** Raw cached snapshot for useSyncExternalStore (stable string identity). */
let doneCache: string | null = null;
export function doneLessonsRaw(): string {
  const raw = localStorage.getItem("mg-lessons-done") ?? "[]";
  if (doneCache !== raw) doneCache = raw;
  return doneCache;
}

export function doneLessons(): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem("mg-lessons-done") ?? "[]"));
  } catch {
    return new Set();
  }
}

/* ------------------------------------------------------------------ icons */

function StepIcon({ kind }: { kind: string }) {
  const cls = "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white";
  if (kind === "order")
    return (
      <span className={`${cls} bg-[#e88a2d]`} aria-hidden>
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M3 5h4M3 12h4M3 19h4M11 5h10M11 12h10M11 19h10" strokeLinecap="round" />
        </svg>
      </span>
    );
  if (kind === "mcq" || kind === "fill" || kind === "input")
    return (
      <span className={`${cls} bg-accent`} aria-hidden>
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M4 7h16M4 12h10M4 17h13" strokeLinecap="round" />
        </svg>
      </span>
    );
  return (
    <span className={`${cls} bg-amber-500`} aria-hidden>
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function BabyGenie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <path d="M48 16c17 0 27 11 27 26 0 6.5-2.2 11.6-5.6 15.2 1.5 2 2.3 4.4 2.3 7C71.7 73.6 61.3 82 48 82s-23.7-8.4-23.7-17.8c0-2.6.8-5 2.3-7C23.2 53.6 21 48.5 21 42c0-15 10-26 27-26Z" fill="#2fe4b7" />
      <circle cx="39" cy="42" r="4.4" fill="#14171c" />
      <circle cx="57" cy="42" r="4.4" fill="#14171c" />
      <circle cx="40.4" cy="40.6" r="1.4" fill="#fff" />
      <circle cx="58.4" cy="40.6" r="1.4" fill="#fff" />
      <path d="M39 54c5.4 4.2 12.6 4.2 18 0" stroke="#14171c" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M26 66c-6 2-9 6-8 11 6 1 11-1 14-6" fill="#2fe4b7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ player */

const RAIL_ICONS: { label: string; d: string; action?: "drawer" | "home" }[] = [
  { label: "Toggle topics panel", d: "M4 5h16v14H4zM9 5v14", action: "drawer" },
  { label: "Home", d: "M4 11l8-7 8 7v9h-5v-6h-6v6H4z", action: "home" },
  { label: "Resources", d: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { label: "Print", d: "M7 8V4h10v4M7 16H4v-6h16v6h-3M7 13h10v7H7z" },
  { label: "Help", d: "M12 17h.01M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9 1-.9 1.7M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" },
  { label: "Question Rush", d: "M12 7v5l3 3M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" },
  { label: "Lessons", d: "M5 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H5zM19 4h-3.5a3 3 0 0 0-1.5.4V20a2 2 0 0 1 2-2h3z" },
  { label: "Notebook", d: "M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 8h7M9 12h7" },
  { label: "Videos", d: "M4 5h16v14H4zM10 9.5l5 2.5-5 2.5z" },
  { label: "Flashcards", d: "M8 7h13v12H8zM3 5v13h3" },
];

export default function LessonPlayer({
  board,
  slug,
  title,
  lesson,
}: {
  board: string;
  slug: string;
  title: string;
  lesson: Lesson;
}) {
  const router = useRouter();
  const total = lesson.steps.length;

  const [stepIdx, setStepIdx] = useState(0);
  const [revealed, setRevealed] = useState(1); // paragraphs revealed on teach/example steps
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [inputVal, setInputVal] = useState("");
  /* "order" steps: slot i holds an index into step.items (null = empty).
     Derived board: until placements arrive the slots render empty, so no
     effect is needed to size the board when the step changes. */
  const [orderSlots, setOrderSlots] = useState<(number | null)[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [genieOpen, setGenieOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const step = lesson.steps[stepIdx];
  const needsAnswer = step.kind === "mcq" || step.kind === "fill" || step.kind === "input" || step.kind === "order";
  const paraCount = step.kind === "teach" || step.kind === "example"
    ? (step.paragraphs ?? step.lines ?? []).length
    : 0;

  const orderDeck = useMemo(() => {
    if (step.kind !== "order") return [];
    const n = step.items.length;
    let seed = 17 + stepIdx * 31 + title.length * 7;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const deck = step.items.map((_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    if (deck.every((v, i) => v === i) && n > 1) [deck[0], deck[n - 1]] = [deck[n - 1], deck[0]]; // never pre-solved
    return deck;
  }, [step, stepIdx, title]);

  const orderBoard: (number | null)[] =
    step.kind === "order"
      ? orderSlots.length === step.items.length
        ? orderSlots
        : step.items.map(() => null)
      : [];

  const slotsFull = step.kind === "order" && orderBoard.every((s) => s !== null);

  const answerCorrect = useMemo(() => {
    if (!checked) return false;
    if (step.kind === "mcq") return selected !== null && step.options[selected]?.correct;
    if (step.kind === "order") return orderBoard.every((s, i) => s === i);
    if (step.kind !== "fill" && step.kind !== "input") return false;
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
    return norm(inputVal) === norm(step.answer);
  }, [checked, selected, inputVal, step, orderBoard]);

  const canAdvance = finished
    ? false
    : (step.kind === "teach" || step.kind === "example") && revealed < paraCount
      ? false
      : !needsAnswer || checked;

  const resetStepState = useCallback(() => {
    setRevealed(1);
    setSelected(null);
    setChecked(false);
    setInputVal("");
    setOrderSlots([]);
    setGenieOpen(false);
    contentRef.current?.scrollTo({ top: 0 });
  }, []);

  const advance = useCallback(() => {
    if (!canAdvance) return;
    if (stepIdx + 1 >= total) {
      markLessonDone(slug);
      setFinished(true);
      return;
    }
    setStepIdx((i) => i + 1);
    resetStepState();
  }, [canAdvance, stepIdx, total, slug, resetStepState]);

  const back = useCallback(() => {
    setGenieOpen(false);
    if (stepIdx === 0) return;
    setStepIdx((i) => i - 1);
    resetStepState();
  }, [stepIdx, resetStepState]);

  // reveal next paragraph
  const revealNext = useCallback(() => {
    setRevealed((r) => Math.min(r + 1, paraCount));
  }, [paraCount]);

  const onPrimary = () => {
    if ((step.kind === "teach" || step.kind === "example") && revealed < paraCount) {
      revealNext();
      return;
    }
    advance();
  };

  // lock body scroll while the player is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const progress = finished ? 100 : Math.round(((stepIdx + (checked || (!needsAnswer && revealed >= paraCount) ? 1 : 0)) / total) * 100);

  const primaryLabel =
    step.kind === "order"
      ? checked ? (stepIdx + 1 >= total ? "Finish" : "Next") : "Check Order"
      : step.kind === "fill" || step.kind === "input"
      ? checked ? (stepIdx + 1 >= total ? "Finish" : "Next") : "Check"
      : (step.kind === "teach" || step.kind === "example") && revealed < paraCount
        ? "Continue"
        : stepIdx + 1 >= total ? "Finish" : "Next";

  const genieHint =
    "hint" in step && step.hint
      ? step.hint
      : step.kind === "teach" || step.kind === "example"
        ? "Read it once more, then try saying the rule back in your own words before moving on."
        : step.kind === "mcq"
          ? "Eliminate the options that break the rule first — usually two fall immediately."
          : step.kind === "order"
            ? "Find the step that must come first — everything else follows from it."
            : "Write what you can, even a partial line — it shows the method.";

  const onMcqPick = (i: number) => {
    if (checked || step.kind !== "mcq") return;
    setSelected(i);
    setChecked(true);
    if (!step.options[i].correct) setWrongCount((w) => w + 1);
  };

  const onCheckFill = () => {
    if (checked || inputVal.trim() === "") return;
    if (step.kind !== "fill" && step.kind !== "input") return;
    setChecked(true);
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
    if (norm(inputVal) !== norm(step.answer)) setWrongCount((w) => w + 1);
  };

  const onCheckOrder = useCallback(() => {
    if (checked || step.kind !== "order" || !orderBoard.every((s) => s !== null)) return;
    setChecked(true);
    if (!orderBoard.every((s, i) => s === i)) setWrongCount((w) => w + 1);
  }, [checked, step, orderBoard]);

  const onPlaceChip = (deckPos: number) => {
    if (checked || step.kind !== "order") return;
    const item = orderDeck[deckPos];
    setOrderSlots((slots) => {
      const board = slots.length === step.items.length ? slots : step.items.map(() => null);
      if (board.includes(item)) return board; // already placed
      const next = [...board];
      const empty = next.indexOf(null);
      if (empty === -1) return board;
      next[empty] = item;
      return next;
    });
  };

  const onRemoveChip = (slotIdx: number) => {
    if (checked || step.kind !== "order") return;
    setOrderSlots((slots) => {
      const board = slots.length === step.items.length ? slots : step.items.map(() => null);
      return board.map((s, i) => (i === slotIdx ? null : s));
    });
  };

  const onSkipOrder = () => {
    if (step.kind !== "order" || checked) return;
    setOrderSlots(step.items.map((_, i) => i)); // reveal correct order on the board
    setChecked(true);
  };

  // keyboard: Enter advances / checks (defined after onCheckOrder so the
  // handler closes over stable, declared values)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (step.kind === "order") {
        if (!checked && orderBoard.every((s) => s !== null) && orderBoard.length) onCheckOrder();
        else if (checked) advance();
        return;
      }
      if (tag === "INPUT" && !checked && needsAnswer) {
        if (inputVal.trim() === "") return;
        setChecked(true);
        if ((step.kind === "fill" || step.kind === "input") &&
            inputVal.trim().toLowerCase().replace(/\s+/g, "") !==
              step.answer.toLowerCase().replace(/\s+/g, "")) {
          setWrongCount((w) => w + 1);
        }
        return;
      }
      if (tag === "INPUT") {
        (e.target as HTMLInputElement).blur();
        advance();
        return;
      }
      advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, checked, needsAnswer, inputVal, step, orderBoard, onCheckOrder]);

  type FeedbackBody = { good: boolean; title: string; text: string } | null;
  const feedbackBody: FeedbackBody = useMemo(() => {
    if (!checked) return null;
    if (step.kind === "mcq") {
      const correctOpt = step.options.find((o) => o.correct);
      return answerCorrect
        ? {
            good: true,
            title: "Great job!",
            text: step.options[selected ?? 0]?.why ?? "That's right.",
          }
        : {
            good: false,
            title: "Not quite",
            text: `${step.options[selected ?? 0]?.why ?? ""} The answer is ${correctOpt?.text}.`.trim(),
          };
    }
    if (step.kind === "fill" || step.kind === "input") {
      const hint = step.hint ? ` ${step.hint}` : "";
      return answerCorrect
        ? { good: true, title: "Great job!", text: `Correct — ${step.answer}.${hint}` }
        : { good: false, title: "Not quite", text: `The answer is ${step.answer}.${hint}` };
    }
    if (step.kind === "order") {
      return answerCorrect
        ? { good: true, title: "Great job!", text: "The method is in the right order — each step sets up the next." }
        : { good: false, title: "Not quite", text: "The correct order is shown on the board — walk it through once before moving on." };
    }
    return null;
  }, [checked, answerCorrect, selected, step]);

  const feedback = feedbackBody ? (
    <div className={`absolute inset-x-0 bottom-0 px-6 py-4 sm:px-10 ${feedbackBody.good ? "bg-[#e9f9ef]" : "bg-[#fdeaea]"}`}>
      <div className="mx-auto flex max-w-3xl items-start gap-3">
        <span
          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-white ${
            feedbackBody.good ? "bg-emerald-500" : "bg-rose-500"
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3">
            {feedbackBody.good ? (
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            )}
          </svg>
        </span>
        <div>
          <p className={`font-extrabold ${feedbackBody.good ? "text-emerald-700" : "text-rose-700"}`}>
            {feedbackBody.title}
          </p>
          <p className="mt-1 text-sm text-ink/80">{feedbackBody.text}</p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white" role="dialog" aria-modal="true" aria-label={`${title} lesson`}>
      {/* top bar */}
      <header className="flex h-14 flex-none items-center gap-2 border-b border-line px-3">
        <Link
          href={`/gcse/maths/${board}/lessons`}
          aria-label="Back to lessons"
          className="rounded-lg p-2 text-ink/70 transition hover:bg-paper-2 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5m6-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="min-w-0 flex-1 truncate text-sm font-semibold text-ink/80">
          {title} <span className="font-normal text-muted">· Lesson</span>
        </div>
        <div className="relative">
          <button
            aria-label="More controls"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
            className="rounded-lg p-2 text-ink/70 transition hover:bg-paper-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border-2 border-ink/10 bg-white p-1 shadow-xl" onClick={() => setMoreOpen(false)}>
              <button
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-paper-2"
                onClick={() => { setStepIdx(0); setFinished(false); resetStepState(); setWrongCount(0); }}
              >
                ↺ Restart lesson
              </button>
              <a
                href={`https://www.mathsgenie.co.uk/gcse/maths/edexcel/${slug}/lessons`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-paper-2"
              >
                Open on original <span aria-hidden className="text-xs text-muted">↗</span>
              </a>
              <Link href={`/gcse/maths/${board}/lessons`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-paper-2">
                ← Exit lesson
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* icon rail */}
        <nav aria-label="Lesson rail" className="flex w-14 flex-none flex-col items-center gap-1 border-r border-line py-3">
          {RAIL_ICONS.map((ic) => {
            const active = ic.label === "Lessons";
            const clickable = ic.action === "drawer" || ic.action === "home" || active;
            const body = (
              <span
                className={`flex size-10 items-center justify-center rounded-xl transition ${
                  active ? "bg-accent-soft text-accent" : "text-ink/45 hover:bg-paper-2 hover:text-ink"
                }`}
                title={ic.label}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={ic.d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            );
            return clickable ? (
              <button key={ic.label} aria-label={ic.label} onClick={() => {
                if (ic.action === "drawer") setDrawerOpen((v) => !v);
                else router.push(`/gcse/maths/${board}/lessons`);
              }}>
                {body}
              </button>
            ) : (
              <span key={ic.label} className="cursor-default">{body}</span>
            );
          })}
        </nav>

        {/* topics drawer */}
        {drawerOpen && (
          <aside className="absolute inset-y-14 left-14 z-40 flex w-72 flex-col border-r-2 border-line bg-white shadow-2xl" aria-label="Lesson topics">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-extrabold">All lessons</span>
              <button aria-label="Close topics" onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 hover:bg-paper-2">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {Object.entries(
                LESSON_INDEX.reduce<Record<number, { slug: string; title: string; grade: number }[]>>((acc, l) => {
                  (acc[l.grade] ??= []).push(l);
                  return acc;
                }, {})
              )
                .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
                .map(([grade, items]) => (
                  <div key={grade} className="mb-2">
                    <p className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-muted">Grade {grade}</p>
                    {items.map((l) => (
                      <button
                        key={l.slug}
                        onClick={() => {
                          if (l.slug !== slug) router.push(`/gcse/maths/${board}/${l.slug}/lessons`);
                          setDrawerOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                          l.slug === slug ? "bg-accent-soft font-semibold text-accent" : "hover:bg-paper-2"
                        }`}
                      >
                        <span className={`size-2 flex-none rounded-full ${l.slug === slug ? "bg-accent" : "bg-ink/15"}`} />
                        <span className="truncate">{l.title}</span>
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          </aside>
        )}

        {/* content column */}
        <div ref={contentRef} className="relative min-w-0 flex-1 overflow-y-auto">
          {/* progress bar */}
          <div className="sticky top-0 z-10 bg-white px-6 pt-6 sm:px-10">
            <div className="mx-auto h-1.5 max-w-3xl overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${finished ? 100 : progress}%` }}
              />
            </div>
          </div>

          {finished ? (
            <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center">
              <span className="flex size-20 items-center justify-center rounded-full bg-[#e9f9ef]">
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <h2 className="mt-5 text-3xl font-extrabold">Lesson complete!</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                {title} — {total} steps finished
                {wrongCount === 0 ? " with every check passed first time. Flawless." : ` with ${wrongCount} check${wrongCount === 1 ? "" : "s"} to revisit. Re-run any step from the topics drawer.`}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/gcse/maths/${board}/lessons`}
                  className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
                >
                  Back to lessons
                </Link>
                <button
                  onClick={() => { setStepIdx(0); setFinished(false); resetStepState(); setWrongCount(0); }}
                  className="rounded-full border-2 border-line bg-paper px-6 py-2.5 text-sm font-bold transition hover:bg-paper-2"
                >
                  Restart lesson
                </button>
              </div>
              <BabyGenie className="mt-10 size-20" />
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-6 pb-44 pt-8 sm:px-10">
              {/* step header */}
              <div className="flex items-center gap-3">
                <StepIcon kind={step.kind} />
                <h2 className={`text-lg font-extrabold ${step.kind === "teach" || step.kind === "example" ? "text-amber-500" : step.kind === "order" ? "text-[#e88a2d]" : "text-accent"}`}>
                  {step.heading}
                </h2>
              </div>

              {/* body */}
              {(step.kind === "teach" || step.kind === "example") && (
                <div className="mt-6 space-y-5">
                  {(step.paragraphs ?? step.lines ?? []).slice(0, revealed).map((p, i) => (
                    <p key={i} className={`text-[17px] leading-8 transition-colors duration-500 ${i === revealed - 1 ? "text-ink" : "text-ink/35"}`}>
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {step.kind === "mcq" && (
                <div className="mt-6">
                  <p className="text-lg font-medium">{step.question}</p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    {step.options.map((o, i) => {
                      const isPicked = selected === i;
                      const showCorrect = checked && o.correct;
                      const showWrong = checked && isPicked && !o.correct;
                      const faded = checked && !o.correct && !isPicked;
                      return (
                        <button
                          key={o.label}
                          onClick={() => onMcqPick(i)}
                          disabled={checked}
                          className={`flex w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3 text-left transition ${
                            showCorrect
                              ? "border-transparent bg-[#e9f9ef]"
                              : showWrong
                                ? "border-transparent bg-[#fdeaea]"
                                : faded
                                  ? "border-line bg-white opacity-45"
                                  : "border-line bg-white hover:border-ink/20 hover:bg-paper-2"
                          }`}
                        >
                          <span
                            className={`flex size-8 flex-none items-center justify-center rounded-full text-sm font-bold transition ${
                              showCorrect
                                ? "bg-emerald-500 text-white"
                                : showWrong
                                  ? "bg-rose-500 text-white"
                                  : "border-2 border-ink/15 text-ink/70"
                            }`}
                            aria-hidden
                          >
                            {showCorrect ? (
                              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            ) : showWrong ? (
                              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
                            ) : (
                              o.label
                            )}
                          </span>
                          <span className={`text-[17px] ${faded ? "text-ink/60" : "text-ink"}`}>{o.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step.kind === "order" && (
                <div className="mt-6">
                  <p className="text-lg font-medium">{step.question}</p>
                  {/* numbered slots */}
                  <div className="mt-6 w-full space-y-2">
                    {orderBoard.map((slotItem, slotIdx) => {
                      const good = checked && slotItem === slotIdx;
                      const bad = checked && slotItem !== null && slotItem !== slotIdx;
                      return (
                        <div
                          key={slotIdx}
                          className="flex items-center gap-3"
                          onDragOver={(e) => {
                            if (!checked && step.kind === "order") {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (checked || step.kind !== "order") return;
                            const deckPos = Number(e.dataTransfer.getData("text/mg-order-chip"));
                            if (Number.isNaN(deckPos)) return;
                            const item = orderDeck[deckPos];
                            setOrderSlots((slots) => {
                              if (slots.includes(item)) return slots;
                              const next = [...slots];
                              while (next.length < step.items.length) next.push(null);
                              const existing = next.indexOf(item);
                              if (existing !== -1) next[existing] = null;
                              next[slotIdx] = item;
                              return next;
                            });
                          }}
                        >
                          <span
                            className={`flex h-8 w-8 flex-none items-center justify-center rounded-xl font-title text-base transition ${
                              good
                                ? "bg-emerald-500 text-white"
                                : bad
                                  ? "bg-rose-500 text-white"
                                  : "bg-paper-2 text-muted"
                            }`}
                            aria-hidden
                          >
                            {slotIdx + 1}
                          </span>
                          <div className="relative flex min-h-12 flex-1 items-center py-2">
                            {slotItem === null ? (
                              <div className="relative h-6 w-full">
                                <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-line" />
                              </div>
                            ) : (
                              <button
                                onClick={() => onRemoveChip(slotIdx)}
                                disabled={checked}
                                className={`w-full rounded-2xl border-2 px-4 py-2 text-left text-[15px] font-medium transition ${
                                  good
                                    ? "border-emerald-500 bg-[#e9f9ef] text-emerald-800"
                                    : bad
                                      ? "border-rose-500 bg-[#fdeaea] text-rose-800"
                                      : "border-line bg-white hover:border-ink/20"
                                } ${checked ? "cursor-default" : "hover:border-ink/30"}`}
                              >
                                {step.items[slotItem]}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* chip bank */}
                  <div className="mt-6 flex w-full flex-wrap justify-center gap-3">
                    {orderDeck.map((item, deckPos) => {
                      const placed = orderBoard.includes(item);
                      return (
                        <button
                          key={`${item}-${deckPos}`}
                          onClick={() => onPlaceChip(deckPos)}
                          disabled={checked || placed}
                          draggable={!checked && !placed}
                          onDragStart={(e) => {
                            const idx = deckPos;
                            e.dataTransfer.setData("text/mg-order-chip", String(idx));
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          className={`rounded-2xl border-2 border-b-4 px-4 py-2 text-[15px] font-medium transition ${
                            placed || checked
                              ? "border-line bg-paper-2 text-ink/30"
                              : "border-line bg-white text-ink hover:bg-paper-2 active:translate-y-0.5 active:border-b-2"
                          } ${placed || checked ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
                        >
                          {step.items[item]}
                        </button>
                      );
                    })}
                  </div>
                  {/* drag-and-drop handled per-slot above */}
                </div>
              )}

              {(step.kind === "fill" || step.kind === "input") && (
                <div className="mt-8">
                  {step.kind === "fill" ? (
                    <p className="flex flex-wrap items-center gap-2 text-xl">
                      <span>{step.before}</span>
                      <span className="relative inline-flex flex-col items-center">
                        <input
                          ref={inputRef}
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          disabled={checked}
                          aria-label="Your answer"
                          className={`w-36 border-b-2 bg-transparent pb-1 text-center text-xl outline-none transition ${
                            checked
                              ? answerCorrect
                                ? "border-emerald-500 text-emerald-700"
                                : "border-rose-500 text-rose-700"
                              : "border-ink/25 focus:border-accent"
                          }`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") onCheckFill();
                          }}
                        />
                        <svg viewBox="0 0 24 24" className="mt-1 size-4 self-end text-ink/30" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                          <rect x="3" y="7" width="18" height="10" rx="2" />
                          <path d="M7 10h.01M11 10h.01M15 10h.01M7 13.5h10" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span>{step.after}</span>
                    </p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">{step.question}</p>
                      <input
                        ref={inputRef}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        disabled={checked}
                        aria-label="Your answer"
                        placeholder="Type your answer…"
                        className={`mt-4 w-full max-w-md rounded-2xl border-2 px-4 py-3 text-lg outline-none transition ${
                          checked
                            ? answerCorrect
                              ? "border-emerald-500 text-emerald-700"
                              : "border-rose-500 text-rose-700"
                            : "border-line focus:border-accent"
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onCheckFill();
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* feedback band */}
          {!finished && feedback}
        </div>
      </div>

      {/* footer */}
      {!finished && (
        <footer className="relative flex h-[76px] flex-none items-center justify-between gap-3 border-t border-line px-4 sm:px-8">
          <button
            onClick={back}
            disabled={stepIdx === 0}
            className="flex items-center gap-1.5 rounded-full border-2 border-line px-5 py-2.5 text-sm font-bold transition enabled:hover:bg-paper-2 disabled:opacity-35"
          >
            <span aria-hidden>‹</span> Back
          </button>

          {/* Ask Genie + popover */}
          <div className="relative">
            {genieOpen && (
              <div className="absolute bottom-16 left-1/2 w-80 -translate-x-1/2 rounded-3xl border-2 border-line bg-white p-4 shadow-2xl">
                <div className="flex items-start gap-3">
                  <BabyGenie className="size-10 flex-none" />
                  <div>
                    <p className="text-sm font-extrabold">Genie says</p>
                    <p className="mt-1 text-sm text-ink/75">{genieHint}</p>
                  </div>
                </div>
                <button
                  onClick={() => setGenieOpen(false)}
                  className="mt-3 w-full rounded-full bg-paper-2 px-4 py-2 text-xs font-bold transition hover:bg-paper"
                >
                  Got it
                </button>
              </div>
            )}
            <button
              onClick={() => setGenieOpen((v) => !v)}
              aria-expanded={genieOpen}
              className="rounded-full border-2 border-[#e9b8f0] bg-white px-6 py-2.5 text-sm font-bold text-fuchsia-600 transition hover:bg-fuchsia-50"
            >
              Ask Genie
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step.kind === "order" && !checked && (
              <button
                onClick={onSkipOrder}
                className="rounded-full px-4 py-2.5 text-sm font-bold text-muted transition hover:bg-paper-2 hover:text-ink"
              >
                Skip
              </button>
            )}
            <button
              onClick={
                step.kind === "order"
                  ? checked
                    ? advance
                    : onCheckOrder
                  : step.kind === "fill" || step.kind === "input"
                    ? checked
                      ? advance
                      : onCheckFill
                    : onPrimary
              }
              disabled={
                step.kind === "order" && !checked
                  ? !slotsFull
                  : (step.kind === "fill" || step.kind === "input") && !checked && inputVal.trim() === ""
                    ? true
                    : !canAdvance && (step.kind === "teach" || step.kind === "example" ? false : false)
              }
              className={`min-w-28 rounded-full px-6 py-2.5 text-sm font-bold text-white transition ${
                canAdvance || (step.kind === "teach" || step.kind === "example")
                  ? "bg-accent hover:bg-accent-ink"
                  : "bg-accent/40"
              }`}
            >
              {primaryLabel} <span aria-hidden>›</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
