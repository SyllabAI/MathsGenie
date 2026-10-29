"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClassroomFeatureGrid from "@/components/member/ClassroomFeatureGrid";
import HomeworkWizard from "@/components/member/HomeworkWizard";
import TestWizard from "@/components/member/TestWizard";
import { useClassrooms, USER, type Classroom } from "@/lib/classrooms";
import {
  bestResult,
  dueLabel,
  removeHomework,
  removeTest,
  toggleHomework,
  useHomework,
  useTests,
  type Homework,
  type TestPaper,
} from "@/lib/assignments";

/**
 * /classrooms/{id} — one classroom (research/04-member-area.md §4):
 * "View as student" banner, name, tabs Resources | Lessons | Tests |
 * Homework | Members. The Tests and Homework tabs are classroom-scoped —
 * they list only what has been set for THIS class and open the wizards
 * pre-scoped to it. "View as student" flips the page to the student view:
 * teacher CTAs disappear and the Resources tab becomes a chronological
 * class feed of everything set for the class (homework + tests, newest
 * first) with student actions (sit test / open questions).
 *
 * Evidence note: the tab structure and the "View as student" banner are
 * from the original capture; the populated lists and the feed layout are
 * our reconstruction (the probe account had no classrooms, so the original
 * only ever showed these pages' empty states).
 */

type Tab = "resources" | "tests" | "homework" | "members";

const TABS: { key: Tab; label: string }[] = [
  { key: "resources", label: "Resources" },
  { key: "tests", label: "Tests" },
  { key: "homework", label: "Homework" },
  { key: "members", label: "Members" },
];

/** Demo roster — fictional, like the original's leaderboard demo names. */
const STUDENTS = [
  { name: "Amara O.", seen: "Active today" },
  { name: "Ben H.", seen: "Active today" },
  { name: "Chloe W.", seen: "Last seen yesterday" },
  { name: "Dev P.", seen: "Active today" },
  { name: "Elsa N.", seen: "Last seen 2 days ago" },
  { name: "Faris K.", seen: "Last seen yesterday" },
  { name: "Grace M.", seen: "Last seen 3 days ago" },
  { name: "Henrik S.", seen: "Last seen 5 days ago" },
];

const AVATAR_TINTS = ["#e9dcfd", "#d3f3fa", "#d9f4e5", "#fde8ec", "#fde3c4", "#d4ddff", "#fef5a7", "#e3f4fe"];

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function ClassroomDetailClient({ id }: { id: string }) {
  const rooms = useClassrooms();
  const homework = useHomework();
  const tests = useTests();
  const [view, setView] = useState<"teacher" | "student">("teacher");
  const [tab, setTab] = useState<Tab>("resources");
  const [hwWizard, setHwWizard] = useState(false);
  const [testWizard, setTestWizard] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  /* Deep links: /classrooms/{id}?tab=tests&view=student (global list cards link here).
     Deferred to rAF (repo-wide SSR-safe pattern) so no setState happens synchronously. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get("tab");
      if (t === "tests" || t === "homework" || t === "members") setTab(t);
      if (sp.get("view") === "student") setView("student");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Unknown id (e.g. first visit before a classroom exists): fall back to a
     stand-in so the page still demonstrates the original's structure. */
  const room: Classroom =
    rooms.find((r) => r.id === id) ?? {
      id,
      name: "My Maths Class",
      subject: "Maths",
      boards: ["Edexcel"],
      createdAt: 0,
    };

  const roomHomework = homework.filter((h) => h.classroomId === id);
  const roomTests = tests.filter((t) => t.classroomId === id);
  const student = view === "student";

  return (
    <div className="min-h-full">
      {/* view-as banner */}
      {!dismissed && (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-accent-soft/40 px-4 py-2.5 text-sm sm:px-8">
          <p className="text-ink/70">
            <span aria-hidden>{student ? "🎒" : "👤"}</span>{" "}
            {student
              ? "You're viewing this classroom as a student."
              : "You're viewing this classroom as a teacher."}
          </p>
          <span className="flex items-center gap-2">
            <button
              onClick={() => setView(student ? "teacher" : "student")}
              className="rounded-full border-2 border-line bg-paper px-3.5 py-1.5 text-xs font-bold transition hover:bg-paper-2"
            >
              {student ? "View as teacher" : "View as student"}
            </button>
            {!student && (
              <button
                onClick={() => setDismissed(true)}
                className="rounded-full px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-paper-2"
              >
                Dismiss
              </button>
            )}
          </span>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 pt-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{room.name}</h1>
            <p className="mt-1 text-sm text-muted">
              {room.subject} · {room.boards.join(" / ")}
              {!student && ` · ${STUDENTS.length + 1} members`}
            </p>
          </div>
          {/* teacher CTAs — hidden in the student view */}
          {!student && tab === "tests" && (
            <button
              onClick={() => setTestWizard(true)}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
            >
              ＋ Make a test
            </button>
          )}
          {!student && tab === "homework" && (
            <button
              onClick={() => setHwWizard(true)}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
            >
              ＋ Set homework
            </button>
          )}
        </div>

        <nav
          className="mt-4 flex items-center gap-1 overflow-x-auto border-b-2 border-line text-sm font-semibold"
          aria-label="Classroom sections"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={`-mb-0.5 whitespace-nowrap border-b-[3px] px-3.5 py-2.5 transition ${
                tab === t.key ? "border-accent text-accent" : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              {t.label}
              {t.key === "members" ? ` (${STUDENTS.length + 1})` : t.key === "tests" ? ` (${roomTests.length})` : t.key === "homework" ? ` (${roomHomework.length})` : ""}
            </button>
          ))}
          <Link
            href="/gcse/maths/edexcel/lessons"
            className="-mb-0.5 whitespace-nowrap border-b-[3px] border-transparent px-3.5 py-2.5 text-ink/60 transition hover:text-ink"
          >
            Lessons
          </Link>
        </nav>

        {tab === "resources" && (student ? <ClassFeed homework={roomHomework} tests={roomTests} roomName={room.name} /> : <ClassroomFeatureGrid />)}

        {tab === "tests" &&
          (student ? (
            <ClassFeed homework={[]} tests={roomTests} roomName={room.name} />
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {roomTests.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center sm:col-span-2">
                  <p className="text-sm text-muted">
                    No tests for this class yet. Choose topics, pick a duration and build the first paper.
                  </p>
                </div>
              )}
              {roomTests.map((t) => (
                <TestCard key={t.id} test={t} />
              ))}
            </div>
          ))}

        {tab === "homework" &&
          (student ? (
            <ClassFeed homework={roomHomework} tests={[]} roomName={room.name} />
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              {roomHomework.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center">
                  <p className="text-sm text-muted">
                    Nothing set for this class yet. Pick some topics and a due date, and send it out.
                  </p>
                </div>
              )}
              {roomHomework.map((hw) => (
                <HomeworkCard key={hw.id} hw={hw} />
              ))}
            </div>
          ))}

        {tab === "members" && <Members room={room} student={student} />}
      </div>

      {hwWizard && <HomeworkWizard rooms={rooms} fixedRoomId={id} onClose={() => setHwWizard(false)} />}
      {testWizard && <TestWizard rooms={rooms} fixedRoomId={id} onClose={() => setTestWizard(false)} />}
    </div>
  );
}

/* ------------------------------ cards ------------------------------ */

function TestCard({ test }: { test: TestPaper }) {
  const qs = test.tasks.reduce((n, task) => n + task.count, 0);
  const best = bestResult("test", test.id);
  return (
    <div className="flex flex-col rounded-2xl border-2 border-line bg-panel p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold">{test.title}</h3>
        {best && (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            Best {best.score}/{best.total}
          </span>
        )}
        <span className="ml-auto text-xs text-muted">Set {fmtDate(test.createdAt)}</span>
      </div>
      <p className="mt-1.5 flex-1 text-sm text-muted">
        {test.tasks.map((task) => `${task.topic} ×${task.count}`).join(" · ")}
      </p>
      <p className="mt-1 text-xs text-muted">
        {qs} questions · {test.minutes} minutes
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/classrooms/test/${test.id}`}
          className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-paper transition hover:opacity-90"
        >
          {best ? "Retake test" : "Start test"} →
        </Link>
        <button
          onClick={() => removeTest(test.id)}
          className="rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold text-muted transition hover:border-rose-300 hover:text-rose-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function HomeworkCard({ hw }: { hw: Homework }) {
  const due = dueLabel(hw.due);
  const qs = hw.tasks.reduce((n, t) => n + t.count, 0);
  return (
    <div className={`rounded-2xl border-2 bg-panel p-4 transition ${hw.completed ? "border-emerald-500/40" : "border-line"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={`text-base font-bold ${hw.completed ? "line-through opacity-60" : ""}`}>{hw.title}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            due.tone === "late" ? "bg-rose-500/10 text-rose-600" : due.tone === "soon" ? "bg-amber-500/10 text-amber-600" : "bg-paper-2 text-muted"
          }`}
        >
          {due.text}
        </span>
        <span className="ml-auto text-xs text-muted">Set {fmtDate(hw.createdAt)}</span>
      </div>
      <p className="mt-1.5 text-sm text-muted">
        {hw.tasks.map((t) => `${t.topic} ×${t.count}`).join(" · ")}
      </p>
      <p className="mt-1 text-xs text-muted">
        {hw.tasks.length} task{hw.tasks.length === 1 ? "" : "s"} · {qs} questions
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => toggleHomework(hw.id)}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
            hw.completed ? "border-2 border-line text-muted hover:bg-paper-2" : "bg-emerald-600 text-white hover:bg-emerald-700"
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
      </div>
    </div>
  );
}

/* --------------------------- class feed --------------------------- */

type FeedItem =
  | { kind: "homework"; at: number; hw: Homework }
  | { kind: "test"; at: number; test: TestPaper };

function ClassFeed({
  homework,
  tests,
  roomName,
}: {
  homework: Homework[];
  tests: TestPaper[];
  roomName: string;
}) {
  const items: FeedItem[] = [
    ...homework.map((hw) => ({ kind: "homework" as const, at: hw.createdAt, hw })),
    ...tests.map((test) => ({ kind: "test" as const, at: test.createdAt, test })),
  ].sort((a, b) => b.at - a.at);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold tracking-tight">Class feed</h2>
        <p className="text-xs text-muted">Everything set for {roomName}, newest first.</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center">
          <p className="text-sm text-muted">
            Nothing has been set for this class yet. When your teacher sets homework or a test, it will appear here.
          </p>
        </div>
      ) : (
        <ol className="relative mt-4 flex flex-col gap-3 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-0.5 before:bg-line" aria-label="Class feed">
          {items.map((item) => {
            const isHw = item.kind === "homework";
            const due = isHw ? dueLabel(item.hw.due) : null;
            const best = !isHw ? bestResult("test", item.test.id) : undefined;
            const tasks = isHw ? item.hw.tasks : item.test.tasks;
            const qs = tasks.reduce((n, t) => n + t.count, 0);
            return (
              <li key={`${item.kind}-${isHw ? item.hw.id : item.test.id}`} className="relative flex gap-3">
                <span
                  className={`z-10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-lg ring-4 ring-paper ${
                    isHw ? "bg-[#fde8ec]" : "bg-[#d4ddff]"
                  }`}
                  aria-hidden
                >
                  {isHw ? "📝" : "🧪"}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-panel p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold">{isHw ? item.hw.title : item.test.title}</h3>
                    <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                      {isHw ? "Homework" : "Test"}
                    </span>
                    {due && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          due.tone === "late" ? "bg-rose-500/10 text-rose-600" : due.tone === "soon" ? "bg-amber-500/10 text-amber-600" : "bg-paper-2 text-muted"
                        }`}
                      >
                        {due.text}
                      </span>
                    )}
                    {best && (
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        Best {best.score}/{best.total}
                      </span>
                    )}
                    {isHw && item.hw.completed && (
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">Handed in ✓</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-muted">
                    {tasks.map((t) => `${t.topic} ×${t.count}`).join(" · ")}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Set {fmtDate(item.at)} · {tasks.length} task{tasks.length === 1 ? "" : "s"} · {qs} questions
                    {!isHw && ` · ${item.test.minutes} minutes`}
                  </p>
                  <div className="mt-3">
                    {isHw ? (
                      <Link
                        href="/gcse/maths/edexcel/questions"
                        className="inline-flex rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-paper transition hover:opacity-90"
                      >
                        Start homework →
                      </Link>
                    ) : (
                      <Link
                        href={`/classrooms/test/${item.test.id}`}
                        className="inline-flex rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-paper transition hover:opacity-90"
                      >
                        {best ? "Retake test" : "Sit test"} →
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/* ----------------------------- members ----------------------------- */

function Members({ room, student }: { room: Classroom; student: boolean }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold tracking-tight">Members</h2>
        <p className="text-xs text-muted">1 teacher · {STUDENTS.length} students</p>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border-2 border-line bg-panel p-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base font-extrabold text-accent" aria-hidden>
          {USER.first.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="font-bold">{USER.first}</p>
          <p className="text-xs text-muted">Teacher · {room.boards.join(" / ")}</p>
        </div>
        {!student && (
          <button className="ml-auto rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold text-muted transition hover:bg-paper-2">
            Manage
          </button>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {STUDENTS.map((s, i) => (
          <div key={s.name} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-panel p-3.5">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-ink/70"
              style={{ backgroundColor: AVATAR_TINTS[i % AVATAR_TINTS.length] }}
              aria-hidden
            >
              {s.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{s.name}</p>
              <p className="text-xs text-muted">Student</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <span className={`size-1.5 rounded-full ${s.seen === "Active today" ? "bg-emerald-500" : "bg-line"}`} aria-hidden />
              {s.seen}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">
        Demo roster — the original syncs members from the school&apos;s class lists.
      </p>
    </div>
  );
}
