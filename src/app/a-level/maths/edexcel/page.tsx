import type { Metadata } from "next";
import Link from "next/link";
import ALevelCourseBody from "@/components/a-level/ALevelCourseBody";
import { catalog, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Edexcel A Level Maths Revision",
  description:
    "Free Edexcel A Level Maths revision: exam-style questions, worksheets, and past papers from 2018–2025 with mark schemes — 44 topics across pure, statistics and mechanics.",
};

/** /a-level/maths/edexcel — v2 course page: gradient hero, Topics/Resources tabs, module accordion. */
export default function ALevelEdexcelPage() {
  const doc = catalog.alevelEdexcel;
  // modules are stored pre-grouped as Year 1/2 × Pure/Statistics/Mechanics,
  // in the original's chapter order (research/08, research/08-a-level-module-regroup)
  const modules = Object.entries(doc.modules).map(([name, topics]) => ({ name, topics }));

  return (
    <div>
      {/* gradient hero band */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#ffd3e0]/70 via-[#e9dcfd]/60 to-[#cfe6ff]/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-7 sm:px-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
            <Link href="/a-level" className="text-ink/60 hover:text-accent">A Level</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">Maths Edexcel</span>
            <span className="ml-auto hidden text-xs text-ink/50 sm:block">Spec 9MA0</span>
          </nav>
          <div className="mt-2 flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight">Maths</h1>
            <button
              aria-label="Save Maths to your subjects"
              className="rounded-lg p-1.5 text-ink/50 transition hover:bg-white/60 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4.5L5 20V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-ink/70">
            Free Edexcel A Level Maths revision: {doc.topic_count} topics across pure mathematics,
            statistics and mechanics, with exam-style questions, worksheets and past papers from
            2018–2025 with mark schemes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <ALevelCourseBody modules={modules} topicCount={doc.topic_count} />

        <p className="mt-10 text-center text-xs text-muted">
          Full course (papers, question bank, lessons) lives on{" "}
          <a href={`${SITE.original}/a-level/maths/edexcel`} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
            the original site ↗
          </a>{" "}
          — topic links open there.
        </p>
      </div>
    </div>
  );
}
