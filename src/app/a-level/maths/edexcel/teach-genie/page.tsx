import type { Metadata } from "next";
import Link from "next/link";
import GenieMascot from "@/components/alevel/GenieMascot";
import TeachSession from "@/components/alevel/TeachSession";
import { Attribution } from "@/components/Content";
import ALevelHubShell from "@/components/alevel/ALevelHubShell";
import {
  alevelLessonSlugs,
  alevelLesson,
  alevelOriginalTopicUrl,
  ALEVEL_ORIGINAL_PATH,
  alevelTopicList,
} from "@/lib/alevel";

export const metadata: Metadata = {
  title: "A Level Maths Teach Genie",
  description:
    "Learn by teaching: explain an A Level Maths topic to Baby Genie in your own words and see what stuck — an interactive recreation of the Teach Genie flow.",
};

export default function ALevelTeachGeniePage() {
  const topics = alevelTopicList().map(({ slug, title, module }) => ({ slug, title, module }));

  // key-idea nudges come from the recreated interactive lessons only.
  const hints: Record<string, string> = {};
  for (const slug of alevelLessonSlugs()) {
    const lesson = alevelLesson(slug);
    if (lesson) hints[slug] = lesson.keyIdea;
  }

  return (
    <ALevelHubShell title="Teach Genie" activeTab="Teach Genie">
      {/* hero — Learn by Teaching */}
      <div className="mt-8 grid items-center gap-8 rounded-3xl border-2 border-line bg-gradient-to-br from-[#e9dcfd]/50 to-[#d3f3fa]/50 p-8 sm:grid-cols-[auto_1fr]">
        <GenieMascot className="mx-auto size-32 float-y" />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Learn by Teaching</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Pick a topic, explain it to Baby Genie in your own words, and see what
            stuck. The Feynman technique — the fastest way to find the gaps in your
            understanding — now wired for the full A Level course.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link href="#teach-session" className="btn-primary">
              Start a session
            </Link>
            <Link href={`${ALEVEL_ORIGINAL_PATH}/lessons`} className="btn-ghost">
              Learn it first in Lessons
            </Link>
          </div>
        </div>
      </div>

      {/* how it works */}
      <h3 className="mt-12 text-xl font-extrabold">How it works</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          {
            n: 1,
            t: "Pick your topics",
            d: "Choose any of the 44 A Level topics — Year 1 or Year 2, pure, stats or mechanics.",
          },
          {
            n: 2,
            t: "Teach Baby Genie",
            d: "Explain the method out loud or in writing. The prompts push the questions a confused student would ask.",
          },
          {
            n: 3,
            t: "See what stuck",
            d: "Audit yourself against the five gap checks, then export your notes straight into revision.",
          },
        ].map((s) => (
          <div key={s.n} className="rounded-3xl border-2 border-line bg-panel p-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent font-extrabold text-white">{s.n}</span>
            <h4 className="mt-3 font-extrabold">{s.t}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
          </div>
        ))}
      </div>

      {/* interactive session */}
      <div className="mt-12">
        <TeachSession topics={topics} hints={hints} practiceBase={alevelOriginalTopicUrl("").replace(/\/$/, "")} />
      </div>

      <Attribution href={alevelOriginalTopicUrl("")} />
    </ALevelHubShell>
  );
}
