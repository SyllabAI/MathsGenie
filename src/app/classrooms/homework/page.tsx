"use client";

import { useState } from "react";
import Link from "next/link";
import {
  dueLabel,
  removeHomework,
  toggleHomework,
  useHomework,
} from "@/lib/assignments";
import { useClassrooms } from "@/lib/classrooms";
import EmptyClassroomState from "@/components/member/EmptyClassroomState";
import HomeworkWizard from "@/components/member/HomeworkWizard";

/**
 * /classrooms/homework — the full homework flow (research/04 §4):
 * the original gates this page behind classrooms; with a classroom you
 * can set homework ("Choose the tasks and send them to your class"),
 * see everything you have set with due dates, and mark it handed in.
 * Each card deep-links into that classroom's Homework tab
 * (/classrooms/{id}?tab=homework) where the per-classroom list lives.
 * Stored client-side (lib/assignments.ts) like the rest of the member area.
 */
export default function HomeworkPage() {
  const rooms = useClassrooms();
  const homework = useHomework();
  const [wizard, setWizard] = useState(false);

  if (rooms.length === 0 && homework.length === 0) {
    return (
      <EmptyClassroomState
        title="Homework"
        note="Homework you set (or receive) lives in your classrooms. Create one to get started."
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Homework</h1>
          <p className="mt-1 text-sm text-muted">
            Choose the tasks and send them to your class. {homework.length > 0 && `${homework.length} set.`}
          </p>
        </div>
        <button
          onClick={() => setWizard(true)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
        >
          ＋ Set homework
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {homework.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Nothing set yet. Pick a classroom, choose some topics and a due date, and send it out.
            </p>
          </div>
        )}
        {homework.map((hw) => {
          const room = rooms.find((r) => r.id === hw.classroomId);
          const due = dueLabel(hw.due);
          const qs = hw.tasks.reduce((n, t) => n + t.count, 0);
          return (
            <div
              key={hw.id}
              className={`rounded-2xl border-2 bg-panel p-4 transition ${hw.completed ? "border-emerald-500/40" : "border-line"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-base font-bold ${hw.completed ? "line-through opacity-60" : ""}`}>
                  {hw.title}
                </h3>
                <Link
                  href={`/classrooms/${hw.classroomId}?tab=homework`}
                  className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted transition hover:bg-accent-soft/60 hover:text-accent"
                >
                  {room ? room.name : "Classroom"}
                </Link>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    due.tone === "late"
                      ? "bg-rose-500/10 text-rose-600"
                      : due.tone === "soon"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-paper-2 text-muted"
                  }`}
                >
                  {due.text}
                </span>
                <span className="ml-auto text-xs text-muted">
                  {hw.tasks.length} task{hw.tasks.length === 1 ? "" : "s"} · {qs} questions
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted">
                {hw.tasks.map((t) => `${t.topic} ×${t.count}`).join(" · ")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleHomework(hw.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    hw.completed
                      ? "border-2 border-line text-muted hover:bg-paper-2"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {hw.completed ? "Reopen" : "Mark handed in ✓"}
                </button>
                <button
                  onClick={() => removeHomework(hw.id)}
                  className="rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold text-muted transition hover:border-rose-300 hover:text-rose-600"
                >
                  Delete
                </button>
                <Link
                  href={`/classrooms/${hw.classroomId}?tab=homework`}
                  className="ml-auto text-xs font-semibold text-accent hover:underline"
                >
                  Open classroom →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {wizard && <HomeworkWizard rooms={rooms} onClose={() => setWizard(false)} />}
    </div>
  );
}
