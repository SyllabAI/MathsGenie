"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dailySet } from "@/lib/questions";
import { Badge } from "@/components/ui/Badge";

/** Daily Greens — deterministic daily set + streak tracker (localStorage). */
export default function DailyGreensClient() {
  const [set, setSet] = useState<ReturnType<typeof dailySet>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    // deferred: hydrate local state after mount (SSR-safe)
    const t = setTimeout(() => {
      setSet(dailySet());
      try {
        const s = JSON.parse(localStorage.getItem("mg-greens") || "{}");
        setStreak(s.streak ?? 0);
        const today = new Date().toISOString().slice(0, 10);
        if (s.lastDay === today) setDoneToday(true);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function finish() {
    const today = new Date().toISOString().slice(0, 10);
    let next = streak;
    try {
      const s = JSON.parse(localStorage.getItem("mg-greens") || "{}");
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      next = s.lastDay === yesterday ? (s.streak ?? 0) + 1 : 1;
      localStorage.setItem("mg-greens", JSON.stringify({ streak: next, lastDay: today }));
    } catch {
      next = 1;
    }
    setStreak(next);
    setDoneToday(true);
    setChecked(true);
  }

  const correctCount = set.filter((q) => {
    const given = (answers[q.id] || "").trim().toLowerCase();
    return given && given === q.answer.trim().toLowerCase();
  }).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">🔥 {streak}-day streak</Badge>
        {doneToday && <Badge tone="dark">Today saved ✓</Badge>}
        <span className="text-sm text-muted">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {set.map((q, i) => (
          <div key={q.id} className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex gap-2">
              <Badge tone="dark">Q{i + 1}</Badge>
              <Badge>{q.marks} mark{q.marks > 1 ? "s" : ""}</Badge>
              <Badge tone="accent">Grade {q.grade}</Badge>
            </div>
            <p className="mt-3 font-medium">{q.prompt}</p>
            <input
              value={answers[q.id] || ""}
              disabled={checked}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              placeholder="Your answer…"
              className={`mt-3 w-full rounded-xl border bg-paper px-4 py-2.5 outline-none ${
                checked
                  ? (answers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
                    ? "border-emerald-500"
                    : "border-rose-500"
                  : "border-line"
              }`}
            />
            {checked && (
              <p className="mt-2 text-sm text-muted">
                Answer: <strong className="text-accent">{q.answer}</strong>
                {q.working ? ` — ${q.working}` : ""}
              </p>
            )}
          </div>
        ))}
      </div>

      {!checked ? (
        <button
          onClick={finish}
          className="mt-6 w-full rounded-full bg-ink py-3 font-semibold text-paper hover:opacity-90"
        >
          Finish today&apos;s set ({correctCount}/{set.length} green so far)
        </button>
      ) : (
        <div className="mt-6 rounded-2xl border border-line bg-panel p-5 text-center">
          <p className="font-hand text-3xl font-bold">
            {correctCount}/{set.length} turned green 🟢
          </p>
          <p className="mt-1 text-sm text-muted">
            Come back tomorrow — same time, new set.{" "}
            <Link href="/gcse/question-rush" className="text-accent underline">
              Or rush some questions now →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
