"use client";

import { useState } from "react";
import Link from "next/link";
import {
  addHomework,
  dueLabel,
  removeHomework,
  toggleHomework,
  useHomework,
} from "@/lib/assignments";
import { useClassrooms } from "@/lib/classrooms";
import EmptyClassroomState from "@/components/member/EmptyClassroomState";
import TaskPicker, { type Task } from "@/components/member/TaskPicker";

/**
 * /classrooms/homework — the full homework flow (research/04 §4):
 * the original gates this page behind classrooms; with a classroom you
 * can set homework ("Choose the tasks and send them to your class"),
 * see everything you have set with due dates, and mark it handed in.
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
                <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {room ? room.name : "Classroom"}
                </span>
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
                  href="/gcse/maths/edexcel/questions"
                  className="ml-auto text-xs font-semibold text-accent hover:underline"
                >
                  Preview the question bank →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {wizard && <Wizard rooms={rooms} onClose={() => setWizard(false)} />}
    </div>
  );
}

function Wizard({
  rooms,
  onClose,
}: {
  rooms: { id: string; name: string; boards: string[] }[];
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("Homework 1");
  const [due, setDue] = useState(() => {
    const d = new Date(Date.now() + 7 * 86_400_000);
    return d.toISOString().slice(0, 10);
  });

  const canNext = step === 1 ? Boolean(roomId) : step === 2 ? tasks.length > 0 : true;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Set homework"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-paper p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Step {step} of 3</p>
            <h3 className="mt-1 text-2xl font-extrabold">
              {step === 1 ? "Choose a classroom" : step === 2 ? "Choose the tasks" : "Set the details"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {step === 1
                ? "Which class is this homework for?"
                : step === 2
                  ? "Pick topics and how many questions each carries."
                  : "Give it a title and a due date, then send it to your class."}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted transition hover:bg-paper-2">✕</button>
        </div>

        {step === 1 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoomId(r.id)}
                className={`flex flex-col items-start gap-1 rounded-2xl border-2 px-4 py-4 text-left transition ${
                  roomId === r.id ? "border-accent bg-accent-soft/50" : "border-line hover:border-ink/25"
                }`}
              >
                <span className="text-sm font-bold">{r.name}</span>
                <span className="text-xs text-muted">{r.boards.join(" / ")}</span>
              </button>
            ))}
            <Link
              href="/classrooms"
              className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-dashed border-line text-sm font-semibold text-muted transition hover:border-accent hover:text-accent"
            >
              ＋ New classroom
            </Link>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5">
            <TaskPicker value={tasks} onChange={setTasks} />
          </div>
        )}

        {step === 3 && (
          <div className="mt-5">
            <label className="block text-sm font-semibold">
              Homework title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-sm font-normal outline-none transition focus:border-accent"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Due date
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-sm font-normal outline-none transition focus:border-accent"
              />
            </label>
            <div className="mt-4 rounded-2xl bg-paper-2 px-4 py-3 text-sm">
              <span className="font-bold">{tasks.reduce((n, t) => n + t.count, 0)} questions</span> across{" "}
              {tasks.length} topic{tasks.length === 1 ? "" : "s"} · due {due}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s === 3 ? 2 : 1) as 1 | 2)}
              className="rounded-full border-2 border-line px-5 py-2.5 text-sm font-bold transition hover:bg-paper-2"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue <span aria-hidden>→</span>
            </button>
          ) : (
            <button
              disabled={!roomId}
              onClick={() => {
                if (roomId) addHomework({ classroomId: roomId, title, tasks, due });
                onClose();
              }}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Set homework
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
