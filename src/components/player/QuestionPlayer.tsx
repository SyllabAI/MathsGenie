"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MemberHud } from "@/components/Header";
import {
  IconLessons,
  IconRush,
  IconVideos,
  IconWorksheets,
} from "@/components/SidebarIcons";
import { playerSet } from "@/lib/player-questions";
import FloatingWindow, { initWin, type WinState } from "./FloatingWindow";
import GeniePanel from "./GeniePanel";

/**
 * Question player with focus mode (original /questions/qN anatomy, research
 * 04 §6 + member/18-question-ui.png):
 *  - focus chrome: minimal 64px header (back arrow + HUD), standard header/
 *    footer removed by Chrome.tsx on this route
 *  - sidebar becomes a 64px context icon rail; floating expand button grows
 *    it to a labelled 220px rail (width transition, like the original rail)
 *  - Easy/Medium underline tabs, numbered pagination (cyan filled current)
 *  - question card: marks, success-rate tooltip, calculator flag, guide/
 *    marking/walkthrough icons, done check, Markscheme pill, kebab
 *  - Markscheme modal with video walkthrough + M1/A1 code list
 *  - Baby Genie mascot bottom-right
 */

type Props = {
  board: string;
  topic: string;
  title: string;
  grade: string;
  initialN: number;
};

/* ------------------------------ small icons ---------------------------- */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IconPanel = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.5 4.5v15" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconGrid = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <rect x="3.5" y="3.5" width="7.4" height="7.4" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.1" y="3.5" width="7.4" height="7.4" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.5" y="13.1" width="7.4" height="7.4" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.1" y="13.1" width="7.4" height="7.4" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconQB = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M12 3.5a8.5 8.5 0 1 1-7.3 4.2L3.5 3.5l4.2 1.2A8.46 8.46 0 0 1 12 3.5Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.6c0 1.6-2.4 2-2.4 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 16.2h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const IconCards = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <rect x="7.5" y="3.5" width="13" height="11" rx="1.5" transform="rotate(6 14 9)" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.5" y="9.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m7 15 1.8 1.8L12 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 19H7a2 2 0 0 0-2 2V4.5Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 7.5h6.5M9 11h6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconPen = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="m12.5 7.5 4 4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconPlay = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m10.2 9 4.6 3-4.6 3V9Z" fill="currentColor" />
  </svg>
);

const IconCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="m5.5 12.5 4 4 9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconKebab = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <circle cx="12" cy="5.5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="18.5" r="1.6" />
  </svg>
);

const IconInfo = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const IconMarkScheme = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M4 6h10M4 10h10M4 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m14.5 13.5 2.2 2.2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 18h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconCalc = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8.5 7h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 19h.01M12 19h.01M15.5 19h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IconBack = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconExpand = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M10 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.5 12h10m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function GenieFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3.6c.9-.9 2.3-.4 2.5.7 2.4.6 4.1 2.6 4.1 5 0 1.2-.4 2.3-1.1 3.2.4.5.6 1.1.6 1.7 0 1.7-1.5 3-3.4 3h-5.4c-1.9 0-3.4-1.3-3.4-3 0-.6.2-1.2.6-1.7C5.8 11.6 5.4 10.5 5.4 9.3c0-2.4 1.7-4.4 4.1-5 .2-1.1 1.6-1.6 2.5-.7Z"
        fill="#2fe4b7"
      />
      <circle cx="9.8" cy="10.2" r="1.5" fill="#0a0a0a" />
      <circle cx="14.2" cy="10.2" r="1.5" fill="#0a0a0a" />
      <path d="M9.6 13.6c1.5 1.1 3.3 1.1 4.8 0" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ------------------------------ focus rail ----------------------------- */

function RailBtn({
  href,
  label,
  active,
  expanded,
  children,
}: {
  href: string;
  label: string;
  active?: boolean;
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center gap-3 rounded-xl transition-colors ${
        expanded ? "px-2.5" : "justify-center px-0"
      } ${
        active
          ? "bg-accent-soft text-accent"
          : "text-ink/55 hover:bg-paper-2 hover:text-ink"
      }`}
    >
      <span className="grid size-6 shrink-0 place-items-center [&>svg]:size-6">{children}</span>
      {expanded && <span className="truncate text-[15px] font-medium">{label}</span>}
    </Link>
  );
}

function FocusRail({ board, topic, expanded, onToggle }: { board: string; topic: string; expanded: boolean; onToggle: () => void }) {
  const base = `/gcse/maths/${board}`;
  return (
    <div
      className="sticky top-16 hidden h-[calc(100dvh-64px)] shrink-0 self-start overflow-hidden border-r-2 border-[#f0f0f0] bg-paper transition-[width] duration-200 ease-out md:block"
      style={{ width: expanded ? 220 : 64 }}
    >
      <div className="flex h-full flex-col gap-1 px-2.5 py-3">
        <RailBtn href={base} label="All resources" expanded={expanded}>
          <IconGrid />
        </RailBtn>
        <RailBtn href={`${base}/worksheets`} label="Worksheets" expanded={expanded}>
          <IconWorksheets />
        </RailBtn>
        <RailBtn href={`${base}/${topic}/questions`} label="Question bank" active expanded={expanded}>
          <IconQB />
        </RailBtn>
        <RailBtn href="/gcse/question-rush" label="Question Rush" expanded={expanded}>
          <IconRush />
        </RailBtn>
        <RailBtn href={`${base}/lessons`} label="Lessons" expanded={expanded}>
          <IconLessons />
        </RailBtn>
        <RailBtn href={`${base}/videos`} label="Videos" expanded={expanded}>
          <IconVideos />
        </RailBtn>
        <RailBtn href={`${base}/flashcards`} label="Flashcards" expanded={expanded}>
          <IconCards />
        </RailBtn>
        <div className="mt-auto">
          <button
            type="button"
            onClick={onToggle}
            className={`flex h-11 w-full items-center rounded-xl text-ink/55 transition-colors hover:bg-paper-2 hover:text-ink ${
              expanded ? "gap-3 px-2.5" : "justify-center"
            }`}
          >
            <span className="grid size-6 shrink-0 place-items-center"><IconPanel className="size-6" /></span>
            {expanded && <span className="text-[15px] font-medium">Exit focus mode</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ the player ----------------------------- */

export default function QuestionPlayer({ board, topic, title, grade, initialN }: Props) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium">("easy");
  const [qn, setQn] = useState(initialN);
  const [expanded, setExpanded] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});
  /* floating windows (original mg-popup system) */
  const [msOpen, setMsOpen] = useState(false);
  const [msWin, setMsWin] = useState<WinState>(() => initWin(88, 20, 470, 620));
  const [formulaWin, setFormulaWin] = useState<WinState>(() => ({ ...initWin(88, 140, 420, 560), closed: true }));
  const [genieOpen, setGenieOpen] = useState(false);
  /* highlighter tool (original Highlight button): toggles pen mode;
     while on, clicking a sentence of the prompt toggles a yellow mark */
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});
  const [kebab, setKebab] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [playStep, setPlayStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const kebabRef = useRef<HTMLDivElement>(null);

  const set = useMemo(
    () => playerSet({ slug: topic, title, grade, difficulty }),
    [topic, title, grade, difficulty]
  );
  const q = set[Math.min(qn, set.length) - 1];
  const key = `${difficulty}:${q.n}`;
  const base = `/gcse/maths/${board}/${topic}/questions`;
  const finished = qn > set.length;

  /* keep the URL in sync with the visible question (shallow, no reload) */
  useEffect(() => {
    const url = finished ? `${base}` : `${base}/q${qn}`;
    window.history.replaceState(null, "", url);
  }, [qn, finished, base]);

  /* close kebab / windows on Escape */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setKebab(false);
        setMsOpen(false);
        setHighlightMode(false);
      }
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  /* close kebab on outside click */
  useEffect(() => {
    if (!kebab) return;
    const close = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) setKebab(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [kebab]);

  const submit = () => {
    if (inputRef.current?.value.trim()) setDone((d) => ({ ...d, [key]: true }));
  };

  const next = () => {
    submit();
    if (qn <= set.length) setQn(qn + 1);
  };

  const switchDifficulty = (d: "easy" | "medium") => {
    if (d === difficulty) return;
    setDifficulty(d);
    setQn(1);
  };

  return (
    <div className="min-h-dvh bg-paper text-ink">
      {/* focus header — back arrow + HUD only (member/18-question-ui.png) */}
      <header className="sticky top-0 z-40 border-b-2 border-[#f0f0f0] bg-paper">
        <div className="flex h-16 items-center gap-2 px-3 sm:px-4">
          <Link
            href={base}
            aria-label="Back to question bank"
            className="grid size-10 place-items-center rounded-xl text-ink/70 transition hover:bg-paper-2 hover:text-ink"
          >
            <IconBack className="size-5.5" />
          </Link>
          <div className="ml-auto flex items-center">
            <div className="relative mr-1" ref={kebabRef}>
              <button
                type="button"
                aria-label="More options"
                onClick={() => setKebab((v) => !v)}
                className="grid size-9 place-items-center rounded-full text-ink/50 transition hover:bg-paper-2 hover:text-ink"
              >
                <IconKebab className="size-5" />
              </button>
              {kebab && (
                <div role="menu" className="absolute right-0 top-11 z-50 w-52 rounded-2xl border-2 border-ink/10 bg-paper p-1 shadow-lg">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setSavedToast(true);
                      setKebab(false);
                      setTimeout(() => setSavedToast(false), 1800);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-paper-2"
                  >
                    <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M6 4h12v17l-6-4-6 4V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                    Save question
                  </button>
                  <a
                    role="menuitem"
                    href="https://github.com/SyllabAI/MathsGenie/issues/new?labels=bug&title=Question%20problem"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setKebab(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-paper-2"
                  >
                    <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M12 3 2.5 20h19L12 3Zm0 6v5m0 3h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Report an issue
                  </a>
                  <button
                    role="menuitem"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href).catch(() => {});
                      setCopied(true);
                      setKebab(false);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-paper-2"
                  >
                    <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {copied ? "Link copied ✓" : "Copy link"}
                  </button>
                </div>
              )}
            </div>
            <MemberHud />
          </div>
        </div>
      </header>

      <div className="flex w-full">
        <FocusRail board={board} topic={topic} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />

        {/* floating expand control — grows the rail, like the original pin */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse rail" : "Expand rail"}
          className={`fixed top-[76px] z-30 hidden size-8 place-items-center rounded-full border-2 border-line bg-paper text-ink/60 shadow-sm transition-all hover:text-ink md:grid ${
            expanded ? "left-[232px]" : "left-[76px]"
          }`}
        >
          <IconExpand className={`size-4.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl px-5 pb-28 pt-10 sm:px-8">
            <h1 className="font-title text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>

            {/* difficulty tabs */}
            <div className="mt-6 grid grid-cols-2 border-b-2 border-line" role="tablist" aria-label="Difficulty">
              {(["easy", "medium"] as const).map((d) => (
                <button
                  key={d}
                  role="tab"
                  aria-selected={difficulty === d}
                  onClick={() => switchDifficulty(d)}
                  className={`-mb-0.5 border-b-2 pb-3 pt-1 text-sm font-semibold capitalize transition ${
                    difficulty === d
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {finished ? (
              <div className="mt-8 rounded-2xl border-2 border-line bg-panel p-10 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
                  <IconCheck className="size-7" />
                </span>
                <h2 className="mt-4 text-xl font-extrabold">Set complete — nice work!</h2>
                <p className="mt-1 text-sm text-muted">
                  You finished the {difficulty} set for {title.toLowerCase()}. Switch difficulty or go again.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={() => { setQn(1); }} className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink">
                    Redo set
                  </button>
                  <button onClick={() => switchDifficulty(difficulty === "easy" ? "medium" : "easy")} className="rounded-full border-2 border-line px-5 py-2.5 text-sm font-semibold transition hover:bg-paper-2">
                    Try {difficulty === "easy" ? "Medium" : "Easy"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* pagination */}
                <nav className="mt-7 flex items-center justify-center gap-1.5" aria-label="Question number">
                  <button
                    onClick={() => setQn(Math.max(1, qn - 1))}
                    disabled={qn === 1}
                    aria-label="Previous question"
                    className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-paper-2 disabled:opacity-30"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none"><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  {set.slice(0, 11).map((it) => (
                    <button
                      key={it.n}
                      onClick={() => setQn(it.n)}
                      aria-current={qn === it.n ? "page" : undefined}
                      className={`grid size-9 place-items-center rounded-full text-sm font-semibold transition ${
                        qn === it.n
                          ? "bg-accent text-white shadow-[0_2px_0_rgba(11,135,196,0.6)]"
                          : done[`${difficulty}:${it.n}`]
                            ? "border-2 border-accent/40 text-accent"
                            : "border-2 border-line text-muted hover:border-ink/20 hover:text-ink"
                      }`}
                    >
                      {it.n}
                    </button>
                  ))}
                  {set.length > 11 && (
                    <button
                      onClick={() => setQn(set.length)}
                      aria-label={`Jump to question ${set.length}`}
                      className="grid h-9 min-w-9 place-items-center rounded-full border-2 border-line px-2 text-sm font-semibold text-muted transition hover:border-ink/20 hover:text-ink"
                    >
                      …
                    </button>
                  )}
                  <button
                    onClick={() => setQn(Math.min(set.length, qn + 1))}
                    disabled={qn === set.length}
                    aria-label="Next question"
                    className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-paper-2 disabled:opacity-30"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none"><path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </nav>

                {/* question card */}
                <article className="mt-6 rounded-2xl border-2 border-line bg-panel p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="text-lg font-bold">Question {q.n}</h2>
                    {!q.calculator && (
                      <span className="relative inline-flex items-center text-muted" title="Non-calculator">
                        <IconCalc className="size-4.5" />
                        <span className="absolute -right-1.5 -top-1 text-xs font-bold text-[#e7000b]" aria-hidden>✕</span>
                      </span>
                    )}
                    <span className="group relative flex cursor-default items-center gap-1 text-sm text-muted">
                      <span className="border-b border-dotted border-muted">{q.rate}%</span>
                      <IconInfo className="size-3.5" />
                      <span role="tooltip" className="pointer-events-none absolute left-0 top-6 z-30 w-44 rounded-lg bg-ink-solid px-2.5 py-1.5 text-[11px] font-medium leading-snug text-paper opacity-0 transition group-hover:opacity-100">
                        {q.rate}% of students marked this correct on first attempt
                      </span>
                    </span>

                    <div className="ml-auto flex items-center gap-0.5">
                      <Link
                        href={`/gcse/maths/${board}/${topic}`}
                        title="Revision notes"
                        className="grid size-9 place-items-center rounded-full text-ink/55 transition hover:bg-paper-2 hover:text-ink"
                      >
                        <IconBook className="size-5" />
                      </Link>
                      <button
                        type="button"
                        aria-pressed={highlightMode}
                        title={highlightMode ? "Highlight mode on — click sentences to mark" : "Highlight"}
                        onClick={() => setHighlightMode((v) => !v)}
                        className={`grid size-9 place-items-center rounded-full transition ${
                          highlightMode
                            ? "border-2 border-ink bg-paper-2 text-ink shadow-sm"
                            : "text-ink/55 hover:bg-paper-2 hover:text-ink"
                        }`}
                      >
                        <IconPen className="size-5" />
                      </button>
                      <button
                        type="button"
                        title="Watch walkthrough"
                        onClick={() => { setPlayStep(0); setMsWin((w) => ({ ...w, closed: false, minimized: false })); setMsOpen(true); }}
                        className="grid size-9 place-items-center rounded-full text-ink/55 transition hover:bg-paper-2 hover:text-ink"
                      >
                        <IconPlay className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={done[key] ? "Marked correct" : "Mark as done"}
                        onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                        aria-pressed={Boolean(done[key])}
                        className={`grid size-9 place-items-center rounded-full transition ${
                          done[key] ? "bg-[#d9f4e5] text-[#059669]" : "text-ink/40 hover:bg-paper-2 hover:text-ink"
                        }`}
                      >
                        <IconCheck className="size-5" />
                      </button>
                      <button
                        type="button"
                        title="Formula sheet"
                        aria-label="Formula sheet"
                        onClick={() => setFormulaWin((w) => ({ ...w, closed: false, minimized: false }))}
                        className="grid size-9 place-items-center rounded-full text-ink/55 transition hover:bg-paper-2 hover:text-ink"
                      >
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5M9 7h7M9 11h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPlayStep(0); setMsWin((w) => ({ ...w, closed: false, minimized: false })); setMsOpen(true); }}
                        className="ml-1 flex items-center gap-1.5 rounded-full border-2 border-line px-3.5 py-1.5 text-sm font-semibold transition hover:bg-paper-2"
                      >
                        <IconMarkScheme className="size-4.5" />
                        Markscheme
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-6">
                    <p className={`text-[17px] leading-relaxed ${highlightMode ? "cursor-text" : ""}`}>
                      {q.prompt.split(/(?<=[.?!])\s+/).map((sent, i) => {
                        const hk = `${key}:${i}`;
                        const on = highlights[hk];
                        return highlightMode || on ? (
                          <span
                            key={i}
                            role={highlightMode ? "button" : undefined}
                            onClick={
                              highlightMode
                                ? () => setHighlights((h) => ({ ...h, [hk]: !h[hk] }))
                                : undefined
                            }
                            className={`rounded-[3px] transition-colors ${
                              on ? "bg-[#fff176] px-0.5" : highlightMode ? "hover:bg-[#fff176]/40 px-0.5" : ""
                            }`}
                          >
                            {sent}{" "}
                          </span>
                        ) : (
                          <span key={i}>{sent}{" "}</span>
                        );
                      })}
                    </p>
                    <span className="shrink-0 text-sm text-muted">[{q.marks}]</span>
                  </div>
                  {highlightMode && (
                    <p className="mt-2 text-xs font-medium text-muted" role="status">
                      Highlight mode — click any sentence to mark or unmark it. Esc exits.
                    </p>
                  )}

                  <input
                    ref={inputRef}
                    key={key}
                    defaultValue={answers[key] ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    placeholder="Write your answer here..."
                    className="mt-5 w-full rounded-xl bg-paper-2 px-4 py-3.5 text-[15px] outline-none transition placeholder:text-muted focus:ring-2 focus:ring-accent/50"
                  />
                </article>

                <button
                  type="button"
                  onClick={next}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-base font-bold text-white transition hover:bg-accent-ink"
                >
                  {qn === set.length ? "Finish set" : "Next question"}
                  <svg viewBox="0 0 24 24" className="size-4.5" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Baby Genie mascot (bottom-right, toggles the Ask Genie panel) */}
      <button
        type="button"
        onClick={() => setGenieOpen((v) => !v)}
        aria-label="Ask Baby Genie"
        aria-expanded={genieOpen}
        className="fixed bottom-5 right-5 z-[1006] grid size-14 place-items-center rounded-2xl bg-ink-solid shadow-lg transition hover:scale-105"
      >
        <GenieFace className="size-10" />
      </button>

      <GeniePanel
        open={genieOpen}
        onClose={() => setGenieOpen(false)}
        topicTitle={title}
        questionPrompt={q.prompt}
        answer={q.answer}
      />

      {/* saved toast */}
      {savedToast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[1015] -translate-x-1/2 rounded-full bg-ink-solid px-5 py-2.5 text-sm font-semibold text-paper shadow-xl">
          Question saved to your list ✓
        </div>
      )}

      {/* markscheme — floating window (original mg-popup anatomy) */}
      {msOpen && !msWin.closed && (
        <FloatingWindow
          title="Video walkthrough"
          state={msWin}
          onChange={setMsWin}
          onClose={() => { setMsOpen(false); setMsWin((w) => ({ ...w, closed: true })); }}
          maxW={620}
          maxH={800}
        >
          <div className="h-full overflow-y-auto p-5">
            {/* walkthrough player: steps revealed one by one */}
            <div className="overflow-hidden rounded-xl bg-ink-solid text-paper">
              <div className="flex min-h-56 flex-col justify-between bg-[radial-gradient(120%_120%_at_20%_0%,#23282f_0%,#0a0a0a_70%)] p-5">
                {playStep === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <button
                      onClick={() => setPlayStep(1)}
                      className="grid size-16 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:scale-105 hover:bg-white/25"
                      aria-label="Play walkthrough"
                    >
                      <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-paper/50">
                      Step {playStep} of {q.steps.length}
                    </p>
                    <p className="mt-3 text-lg font-semibold leading-relaxed">{q.steps[playStep - 1].text}</p>
                    {q.working && playStep === q.steps.length && (
                      <pre className="mt-4 whitespace-pre rounded-lg bg-white/10 p-3 text-sm tabular-nums">{q.working}</pre>
                    )}
                  </div>
                )}
                {playStep > 0 && (
                  <div className="mt-5 flex items-center gap-2">
                    <button onClick={() => setPlayStep(Math.max(1, playStep - 1))} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20">‹ Prev</button>
                    {playStep < q.steps.length ? (
                      <button onClick={() => setPlayStep(playStep + 1)} className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white transition hover:bg-accent-ink">Next step ›</button>
                    ) : (
                      <span className="text-xs text-paper/50">End of walkthrough</span>
                    )}
                    <div className="ml-auto flex gap-1">
                      {q.steps.map((_, i) => (
                        <span key={i} className={`h-1.5 w-5 rounded-full ${i < playStep ? "bg-accent" : "bg-white/20"}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h3 className="mt-6 text-lg font-bold">Markscheme</h3>
            <ul className="mt-3 space-y-2.5">
              {q.steps.map((s, i) => (
                <li key={i} className="flex items-center justify-between gap-4 text-[15px]">
                  <span className="flex min-w-0 items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink/40" aria-hidden />
                    <span className="min-w-0">{s.text}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-bold text-muted">{s.code}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-xl bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink/70">
              Answer: <b>{q.answer}</b> — written for this recreation; the original links its own video walkthrough and full mark scheme per question.
            </p>
          </div>
        </FloatingWindow>
      )}

      {/* formula sheet — floating PDF window (iframe hot-links the
          original board resource; nothing is re-hosted) */}
      {!formulaWin.closed && (
        <FloatingWindow
          title="Formula sheet"
          state={formulaWin}
          onChange={setFormulaWin}
          onClose={() => setFormulaWin((w) => ({ ...w, closed: true }))}
        >
          <div className="h-full bg-white">
            <iframe
              src="https://assets.mathsgenie.co.uk/board-resources/gcse-maths/gcse-formulae-to-remember.pdf#view=FitH"
              title="Formula sheet"
              className="h-full w-full border-0"
            />
            <noscript>
              <a href="https://assets.mathsgenie.co.uk/board-resources/gcse-maths/gcse-formulae-to-remember.pdf">Open the formula sheet</a>
            </noscript>
          </div>
        </FloatingWindow>
      )}
    </div>
  );
}
