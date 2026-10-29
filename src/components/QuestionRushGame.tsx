"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RushPool } from "@/lib/questions";
import { Badge } from "@/components/ui/Badge";

/**
 * Question Rush — recreated timed drill game.
 * 60 seconds, rapid-fire original sample questions, streak + score HUD.
 * The original runs Rush per qualification with a pool tab strip (GCSE
 * grades 1–8/9, A Level by module) — pools are passed in by the page
 * (lib/questions.ts rushPoolsForQual) so the same game powers every
 * qualification's Rush page.
 */
export default function QuestionRushGame({ pools }: { pools: RushPool[] }) {
  const [poolKey, setPoolKey] = useState<string>(pools[Math.min(2, pools.length - 1)]?.key ?? pools[0]?.key);
  const [phase, setPhase] = useState<"pick" | "play" | "done">("pick");
  const [timeLeft, setTimeLeft] = useState(60);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [flash, setFlash] = useState<"none" | "right" | "wrong">("none");
  const [answer, setAnswer] = useState("");
  const pool = useMemo<RushPool | undefined>(() => pools.find((p) => p.key === poolKey), [pools, poolKey]);
  const questions = pool?.questions ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[index % Math.max(questions.length, 1)];

  const finish = useCallback(() => {
    setPhase("done");
    setStreak((s) => {
      setBest((b) => Math.max(b, s));
      return s;
    });
    if (timer.current) clearInterval(timer.current);
  }, []);

  const start = useCallback(() => {
    setPhase("play");
    setTimeLeft(60);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setAnswer("");
    try { setBest(parseInt(localStorage.getItem(`mg-rush-best-${poolKey}`) || "0", 10)); } catch {}
    timer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer.current!);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [poolKey]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function check() {
    if (!q) return;
    const given = answer.trim().toLowerCase().replace(/\s+/g, " ");
    const want = q.answer.trim().toLowerCase().replace(/\s+/g, " ");
    const ok = given === want || (given.length > 2 && want.includes(given));
    setFlash(ok ? "right" : "wrong");
    setTimeout(() => setFlash("none"), 350);
    if (ok) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
    setIndex((i) => i + 1);
    setAnswer("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function saveBest() {
    try { localStorage.setItem(`mg-rush-best-${poolKey}`, String(best)); } catch {}
  }

  if (phase === "pick") {
    return (
      <div>
        {pools.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Question Rush pools">
            {pools.map((p) => (
              <button
                key={p.key}
                role="tab"
                aria-selected={poolKey === p.key}
                onClick={() => setPoolKey(p.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  poolKey === p.key ? "bg-ink text-paper" : "border border-line hover:bg-paper-2"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 rounded-2xl border border-line bg-panel p-8 text-center">
          <p className="font-hand text-4xl font-bold">⚡ Question Rush — {pool?.label}</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            60 seconds. Answer as many as you can. Streaks build your score —
            one wrong answer resets it.
          </p>
          <p className="mt-3 text-sm text-muted">Best streak: <strong>{best}</strong></p>
          <button
            onClick={start}
            className="mt-6 rounded-full bg-ink px-8 py-3 font-semibold text-paper hover:opacity-90"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    saveBest();
    return (
      <div className="rounded-2xl border border-line bg-panel p-8 text-center">
        <p className="font-hand text-4xl font-bold">Time!</p>
        <p className="mt-4 text-6xl font-bold text-accent">{score}</p>
        <p className="mt-1 text-muted">questions answered</p>
        <p className="mt-2 text-sm text-muted">Best streak this run: <strong>{best}</strong></p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={start} className="rounded-full bg-ink px-6 py-2.5 font-semibold text-paper hover:opacity-90">
            Go again
          </button>
          <button onClick={() => setPhase("pick")} className="rounded-full border border-line px-6 py-2.5 font-semibold hover:bg-paper-2">
            Change pool
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="dark">⏱ {timeLeft}s</Badge>
        <Badge tone="accent">Score {score}</Badge>
        <Badge tone={streak > 2 ? "higher" : "neutral"}>🔥 Streak {streak}</Badge>
        <button onClick={finish} className="ml-auto text-sm text-muted underline hover:text-ink">
          End run
        </button>
      </div>

      {q && (
        <div
          className={`mt-6 rounded-2xl border bg-panel p-8 transition-colors ${
            flash === "right" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950" :
            flash === "wrong" ? "border-rose-500 bg-rose-50 dark:bg-rose-950" :
            "border-line"
          }`}
        >
          <div className="flex gap-2">
            <Badge>{q.marks} mark{q.marks > 1 ? "s" : ""}</Badge>
            <Badge>{q.calculator ? "Calculator" : "Non-calc"}</Badge>
          </div>
          <p className="mt-4 text-xl font-medium">{q.prompt}</p>
          <form
            onSubmit={(e) => { e.preventDefault(); check(); }}
            className="mt-6 flex gap-2"
          >
            <input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer…"
              autoComplete="off"
              className="flex-1 rounded-xl border border-line bg-paper px-4 py-3 outline-none"
            />
            <button className="rounded-xl bg-ink px-6 font-semibold text-paper hover:opacity-90">
              Submit
            </button>
          </form>
          <p className="mt-3 text-xs text-muted">
            Skipping counts as wrong — press Enter after typing.
          </p>
        </div>
      )}
    </div>
  );
}
