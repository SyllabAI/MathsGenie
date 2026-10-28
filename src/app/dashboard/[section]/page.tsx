import Link from "next/link";
import { notFound } from "next/navigation";

const SECTIONS: Record<string, { title: string; verb: string; extra?: string }> = {
  "daily-greens": {
    title: "Daily Greens",
    verb: "open its daily greens",
    extra: "Daily Greens is Maths only right now — a Maths classroom makes its topics show up here.",
  },
  worksheets: { title: "Worksheets", verb: "open its worksheets" },
  videos: { title: "Videos", verb: "open its videos" },
  lessons: { title: "Lessons", verb: "open its lessons" },
  homework: { title: "Homework", verb: "see and set its homework" },
  tests: { title: "Tests", verb: "see and set its tests" },
};

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

/** Classroom-gated member pages — same empty-state pattern as the original. */
export default async function MemberSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const s = SECTIONS[section];
  if (!s) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">{s.title}</h1>
      <p className="mt-2 text-muted">Choose a classroom to {s.verb}.</p>
      <div className="mt-8 rounded-3xl border border-line bg-panel p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-2 text-2xl" aria-hidden="true">
          🗂️
        </span>
        <p className="mt-4 text-lg font-bold">No GCSE classrooms yet</p>
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
          {s.extra ?? "Create a GCSE classroom to see its resources here, or switch qualification to see your other classrooms."}
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block rounded-full bg-sky-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
        >
          Go to classrooms
        </Link>
      </div>
    </div>
  );
}
