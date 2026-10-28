import type { Metadata } from "next";
import Link from "next/link";
import ClassroomFeatureGrid from "@/components/member/ClassroomFeatureGrid";

export const metadata: Metadata = { title: "Classroom" };

/**
 * /classrooms/[id] — teacher view of one classroom (research/04-member-area.md §4):
 * "View as student" banner, name, tabs (Resources/Lessons/Tests/Homework/Members)
 * and the grouped resource grid (Popular / Practice / Learn / Tools).
 */

export default async function ClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-full">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-accent-soft/40 px-4 py-2.5 text-sm sm:px-8">
        <p className="text-ink/70">
          <span aria-hidden>👤</span> You&apos;re viewing this classroom as a teacher.
        </p>
        <span className="flex items-center gap-2">
          <button className="rounded-full border-2 border-line bg-paper px-3.5 py-1.5 text-xs font-bold transition hover:bg-paper-2">
            View as student
          </button>
          <button className="rounded-full px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-paper-2">
            Dismiss
          </button>
        </span>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h1 className="pt-6 text-3xl font-extrabold tracking-tight">My Maths Class</h1>

        <nav className="mt-4 flex items-center gap-1 overflow-x-auto border-b-2 border-line text-sm font-semibold" aria-label="Classroom sections">
          {[
            { label: "Resources", href: `/classrooms/${id}`, active: true },
            { label: "Lessons", href: "/gcse/maths/edexcel/lessons" },
            { label: "Tests", href: "/classrooms/test" },
            { label: "Homework", href: "/classrooms/homework" },
            { label: "Members (0)", href: `/classrooms/${id}#members` },
          ].map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className={`-mb-0.5 whitespace-nowrap border-b-[3px] px-3.5 py-2.5 transition ${
                t.active ? "border-accent text-accent" : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <ClassroomFeatureGrid />
      </div>
    </div>
  );
}
