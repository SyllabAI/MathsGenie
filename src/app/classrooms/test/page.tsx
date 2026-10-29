"use client";

import { useState } from "react";
import Link from "next/link";
import { addTest, bestResult, removeTest, useTests } from "@/lib/assignments";
import { useClassrooms } from "@/lib/classrooms";
import EmptyClassroomState from "@/components/member/EmptyClassroomState";
import TaskPicker, { type Task } from "@/components/member/TaskPicker";

/**
 * /classrooms/test — the full test flow (research/04 §4): the original
 * gates tests behind classrooms ("Pick the questions and set it for your
 * class"). With a classroom you can build a timed paper from topics,
 * then sit it in the built-in runner at /classrooms/test/{id} — scores
 * are saved and shown on the card. Stored client-side (lib/assignments.ts).
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
                <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {room ? room.name : "Classroom"}
                </span>
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
  const [title, setTitle] = useState("Test 1");
  const [minutes, setMinutes] = useState(25);

  const canNext = step === 1 ? Boolean(roomId) : step === 2 ? tasks.length > 0 : true;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Make a test"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-paper p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Step {step} of 3</p>
            <h3 className="mt-1 text-2xl font-extrabold">
              {step === 1 ? "Choose a classroom" : step === 2 ? "Pick the questions" : "Timing & title"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {step === 1
                ? "Which class is this test for?"
                : step === 2
                  ? "Choose the topics each section draws from."
                  : "Name the paper and set the clock."}
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
            <TaskPicker value={tasks} onChange={setTasks} noun="questions per topic" />
          </div>
        )}

        {step === 3 && (
          <div className="mt-5">
            <label className="block text-sm font-semibold">
              Test title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-sm font-normal outline-none transition focus:border-accent"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Duration: <span className="font-bold text-accent">{minutes} minutes</span>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="mt-2 w-full accent-[#1cb0f6]"
                aria-label="Duration in minutes"
              />
            </label>
            <div className="mt-4 rounded-2xl bg-paper-2 px-4 py-3 text-sm">
              <span className="font-bold">{tasks.reduce((n, t) => n + t.count, 0)} questions</span> across{" "}
              {tasks.length} topic{tasks.length === 1 ? "" : "s"} · {minutes} minutes
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
                if (roomId) addTest({ classroomId: roomId, title, tasks, minutes });
                onClose();
              }}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
