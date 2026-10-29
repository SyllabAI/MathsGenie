"use client";

import { useState } from "react";
import Link from "next/link";
import { addHomework } from "@/lib/assignments";
import TaskPicker, { type Task } from "@/components/member/TaskPicker";

/**
 * Shared "Set homework" wizard (research/04 §4: "Choose the tasks and send
 * them to your class"). Used by /classrooms/homework (pick a classroom first)
 * and by the per-classroom Homework tab, where fixedRoomId pre-scopes it to
 * one class and the classroom step is skipped. Saved via lib/assignments.
 */
export default function HomeworkWizard({
  rooms,
  fixedRoomId,
  onClose,
}: {
  rooms: { id: string; name: string; boards: string[] }[];
  fixedRoomId?: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(fixedRoomId ? 2 : 1);
  const [roomId, setRoomId] = useState<string | null>(fixedRoomId ?? null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("Homework 1");
  const [due, setDue] = useState(() => {
    const d = new Date(Date.now() + 7 * 86_400_000);
    return d.toISOString().slice(0, 10);
  });

  const fixed = Boolean(fixedRoomId);
  const total = fixed ? 2 : 3;
  const shown = fixed ? step - 1 : step;
  const room = rooms.find((r) => r.id === roomId);
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
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Step {shown} of {total}</p>
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
            {fixed && room && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-soft/60 px-3 py-1 text-xs font-bold text-accent">
                For: {room.name}
              </span>
            )}
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
          {step > (fixed ? 2 : 1) ? (
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
