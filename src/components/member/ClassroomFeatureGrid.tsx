import Link from "next/link";

/**
 * The grouped resource grid from the original classroom page
 * (research/04-member-area.md §4): Popular / Practice / Learn / Tools,
 * colored icon tiles, "Popular"/"New" badges, exact card copy.
 */

type Feature = {
  title: string;
  desc: string;
  badge?: "Popular" | "New";
  tile: string; // tailwind bg for the icon tile
  glyph: string;
  href: string;
};

const GROUPS: { group: string; items: Feature[] }[] = [
  {
    group: "Popular",
    items: [
      { title: "Worksheets", desc: "Downloadable exam booklets and worksheets per topic", tile: "bg-[#d9f4e5]", glyph: "📗", href: "/gcse/maths/edexcel/worksheets" },
      { title: "Papers", desc: "Past papers, predicted papers and mini tests", tile: "bg-[#d3f3fa]", glyph: "📘", href: "/gcse/maths/edexcel/papers" },
    ],
  },
  {
    group: "Practice",
    items: [
      { title: "Question bank", desc: "Practice questions with AI feedback · 18,486 questions", badge: "Popular", tile: "bg-[#e9dcfd]", glyph: "❓", href: "/gcse/maths/edexcel/questions" },
      { title: "Question Rush", desc: "Race the clock on quick-fire multiple-choice questions", badge: "New", tile: "bg-[#d4ddff]", glyph: "⏱", href: "/gcse/maths/edexcel/question-rush" },
      { title: "Daily Greens", desc: "A quick worksheet each day that targets your weaknesses", tile: "bg-[#d9f4e5]", glyph: "🥬", href: "/gcse/daily-greens" },
      { title: "Hot topics", desc: "See which topics come up most in real past papers", tile: "bg-[#fde8ec]", glyph: "🔥", href: "/gcse/maths/edexcel/topic-heatmap" },
    ],
  },
  {
    group: "Learn",
    items: [
      { title: "Lessons", desc: "Step-by-step lessons and quizzes", tile: "bg-[#d4ddff]", glyph: "📖", href: "/gcse/maths/edexcel/lessons" },
      { title: "Videos", desc: "Master concepts with explainer videos", tile: "bg-[#d3f3fa]", glyph: "🎬", href: "/gcse/maths/edexcel/videos" },
      { title: "Flashcards", desc: "Remember concepts with active recall", tile: "bg-[#fef5a7]", glyph: "🗂", href: "/gcse/maths/edexcel/flashcards" },
      { title: "Scheme of learning", desc: "A stage-by-stage course through the whole GCSE", tile: "bg-[#d9f4e5]", glyph: "🪜", href: "/gcse/maths/edexcel/scheme-of-learning" },
      { title: "Teach Genie", desc: "Review a topic by teaching it to Baby Genie", badge: "New", tile: "bg-[#e9dcfd]", glyph: "🧞", href: "/gcse/maths/edexcel/teach-genie" },
    ],
  },
  {
    group: "Tools",
    items: [
      { title: "Exam builder", desc: "Build a custom mock from exam-style questions", tile: "bg-[#fde3c4]", glyph: "🛠", href: "/gcse/maths/edexcel/mock-exam-builder" },
      { title: "Paper marker", desc: "Mark your whole class's papers in one go", tile: "bg-[#d4ddff]", glyph: "✍", href: "/features/answer-marking" },
      { title: "Grade calculator", desc: "Enter your marks to see your predicted grade", tile: "bg-[#e9dcfd]", glyph: "📊", href: "/gcse/maths/edexcel/predicted-grade-calculator" },
    ],
  },
];

export default function ClassroomFeatureGrid() {
  return (
    <div className="mt-8 space-y-9">
      {GROUPS.map(({ group, items }) => (
        <section key={group}>
          <h2 className="text-xl font-extrabold tracking-tight">{group}</h2>
          <div className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {items.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-paper-2"
              >
                <span className={`relative flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${f.tile}`} aria-hidden>
                  {f.glyph}
                  {f.badge && (
                    <span
                      className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                        f.badge === "Popular" ? "bg-[#7c3aed]" : "bg-[#1cb0f6]"
                      }`}
                    >
                      {f.badge}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{f.title}</span>
                  <span className="block text-sm text-muted">{f.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
