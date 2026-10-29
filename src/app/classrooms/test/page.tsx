"use client";

import { useState } from "react";
import Link from "next/link";
import { bestResult, removeTest, useTests } from "@/lib/assignments";
import { useClassrooms } from "@/lib/classrooms";
import EmptyClassroomState from "@/components/member/EmptyClassroomState";
import TestWizard from "@/components/member/TestWizard";

/**
 * /classrooms/test — the full test flow (research/04 §4): the original
 * gates tests behind classrooms ("Pick the questions and set it for your
 * class"). With a classroom you can build a timed paper from topics,
 * then sit it in the built-in runner at /classrooms/test/{id} — scores
 * are saved and shown on the card. Each card deep-links into that
 * classroom's Tests tab (/classrooms/{id}?tab=tests) where the
 * per-classroom list lives. Stored client-side (lib/assignments.ts).
 */
export default function TestsPage() {
  const rooms = useClassrooms();
  const tests = useTests();
  const [wizard, setWizard] = useState(false);

  if (rooms.length === 0 && tests.length === 0) {
    return (
      <EmptyClassroomState
        title="Tests"
        note="Tests belong to classrooms. Create one to set your first test."
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Tests</h1>
          <p className="mt-1 text-sm text-muted">
            Pick the questions and set it for your class. {tests.length > 0 && `${tests.length} made.`}
          </p>
        </div>
        <button
          onClick={() => setWizard(true)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
        >
          ＋ Make a test
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {tests.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center sm:col-span-2">
            <p className="text-sm text-muted">
              No tests yet. Choose topics, pick a duration and build your first paper.
            </p>
          </div>
        )}
        {tests.map((t) => {
          const room = rooms.find((r) => r.id === t.classroomId);
          const qs = t.tasks.reduce((n, task) => n + task.count, 0);
          const best = bestResult("test", t.id);
          return (
            <div key={t.id} className="flex flex-col rounded-2xl border-2 border-line bg-panel p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold">{t.title}</h3>
                <Link
                  href={`/classrooms/${t.classroomId}?tab=tests`}
                  className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted transition hover:bg-accent-soft/60 hover:text-accent"
                >
                  {room ? room.name : "Classroom"}
                </Link>
                {best && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    Best {best.score}/{best.total}
                  </span>
                )}
              </div>
              <p className="mt-1.5 flex-1 text-sm text-muted">
                {t.tasks.map((task) => `${task.topic} ×${task.count}`).join(" · ")}
              </p>
              <p className="mt-1 text-xs text-muted">
                {qs} questions · {t.minutes} minutes
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/classrooms/test/${t.id}`}
                  className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-paper transition hover:opacity-90"
                >
                  {best ? "Retake test" : "Start test"} →
                </Link>
                <button
                  onClick={() => removeTest(t.id)}
                  className="rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold text-muted transition hover:border-rose-300 hover:text-rose-600"
                >
                  Delete
                </button>
                <Link
                  href={`/classrooms/${t.classroomId}?tab=tests`}
                  className="ml-auto text-xs font-semibold text-accent hover:underline"
                >
                  Open classroom →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {wizard && <TestWizard rooms={rooms} onClose={() => setWizard(false)} />}
    </div>
  );
}
