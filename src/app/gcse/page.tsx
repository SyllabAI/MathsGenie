import type { Metadata } from "next";
import Link from "next/link";
import { Faq, Attribution } from "@/components/Content";

export const metadata: Metadata = {
  title: "GCSE Maths Revision",
  description:
    "Choose your exam board for past papers, mark schemes, grade boundaries and revision materials — recreated from the parsed MathsGenie catalog.",
};

const BOARDS = [
  { slug: "edexcel", name: "Edexcel", spec: "1MA1", tint: "from-sky-400 to-blue-500" },
  { slug: "aqa", name: "AQA", spec: "8300", tint: "from-rose-400 to-red-500" },
  { slug: "ocr", name: "OCR", spec: "J560", tint: "from-amber-400 to-orange-500" },
  { slug: "wjec", name: "WJEC", spec: null, tint: "from-emerald-400 to-green-500" },
  { slug: "eduqas", name: "Eduqas", spec: null, tint: "from-indigo-400 to-violet-500" },
  { slug: "ccea", name: "CCEA", spec: null, tint: "from-fuchsia-400 to-pink-500" },
];

const SECTIONS: { title: string; links: { label: string; desc: string; href: string; tint: string }[] }[] = [
  {
    title: "Popular",
    links: [
      { label: "Worksheets", desc: "Exam-style booklets by grade", href: "/gcse/worksheets", tint: "from-sky-400 to-blue-500" },
      { label: "Past papers", desc: "Every series with mark schemes", href: "/gcse/maths/edexcel/papers", tint: "from-green-500 to-emerald-600" },
      { label: "Question bank", desc: "Drill questions topic by topic", href: "/gcse/maths/edexcel", tint: "from-purple-500 to-violet-600" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Predicted papers", desc: "Papers built from past patterns", href: "/gcse/maths/edexcel/papers", tint: "from-pink-500 to-rose-500" },
      { label: "Question Rush", desc: "60-second timed sprint", href: "/gcse/question-rush", tint: "from-amber-400 to-orange-500" },
      { label: "Daily Greens", desc: "One fresh set every day", href: "/gcse/daily-greens", tint: "from-green-500 to-emerald-600" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Revision guides", desc: "Topic-by-topic notes", href: "/gcse/maths/edexcel/revision-guides", tint: "from-sky-400 to-blue-500" },
      { label: "Lessons", desc: "Interactive bite-sized lessons", href: "/gcse/maths/edexcel/lessons", tint: "from-purple-500 to-violet-600" },
      { label: "Videos", desc: "Walkthroughs for every topic", href: "/gcse/maths/edexcel/videos", tint: "from-rose-400 to-red-500" },
      { label: "Flashcards", desc: "Active-recall practice", href: "/gcse/maths/edexcel/flashcards", tint: "from-amber-400 to-orange-500" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Predicted grade calculator", desc: "Predict grades from marks", href: "/gcse/maths/edexcel/predicted-grade-calculator", tint: "from-green-500 to-emerald-600" },
      { label: "Mock exam builder", desc: "Compose your own paper", href: "/gcse/maths/edexcel/mock-exam-builder", tint: "from-pink-500 to-rose-500" },
      { label: "Revision planner", desc: "Plan topics across weeks", href: "/features/revision-planner", tint: "from-sky-400 to-blue-500" },
    ],
  },
];

function CardTile({ l }: { l: { label: string; desc: string; href: string; tint: string } }) {
  return (
    <Link
      href={l.href}
      className="group rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
    >
      <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${l.tint} text-sm font-bold text-white`}>
        {l.label.charAt(0)}
      </span>
      <p className="font-semibold group-hover:text-accent">{l.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{l.desc}</p>
    </Link>
  );
}

export default function GcsePage() {
  return (
    <div>
      {/* dark hero band */}
      <section className="hero-glow text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <span className="rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-xs font-semibold text-mint">
            GCSE
          </span>
          <h1 className="font-hand mt-4 text-6xl font-bold leading-none">
            GCSE Maths Revision
          </h1>
          <p className="mt-3 max-w-2xl text-white/65">
            Pick your exam board. Every board shares the same 134-topic
            structure, so you can revise across boards when you need extra
            practice.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold">Pick your exam board</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {BOARDS.map((b) => (
              <Link
                key={b.slug}
                href={`/gcse/maths/${b.slug}`}
                className="group overflow-hidden rounded-3xl border border-line bg-panel transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
              >
                <div className={`flex h-24 items-end bg-gradient-to-br ${b.tint} p-4`}>
                  <span className="font-hand text-3xl font-bold text-white drop-shadow">
                    {b.name}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm font-semibold">GCSE Maths</span>
                  {b.spec ? (
                    <span className="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] font-bold text-muted">
                      Spec {b.spec}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-mint opacity-0 transition group-hover:opacity-100">
                      Open →
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-10">
          <h2 className="text-2xl font-bold">Free GCSE Maths resources</h2>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
                {s.title}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {s.links.map((l) => (
                  <CardTile key={l.label} l={l} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">GCSE Maths FAQs</h2>
          <div className="mt-5">
            <Faq
              items={[
                {
                  q: "Which exam boards offer GCSE Maths?",
                  a: "AQA, Edexcel, Eduqas, OCR, WJEC and CCEA — all six have their own course page in the board grid above.",
                },
                {
                  q: "Where can I find GCSE Maths past papers?",
                  a: "Each board's Papers page lists every series with question papers and mark schemes. This recreation links to the original PDFs rather than re-hosting them.",
                },
                {
                  q: "Are these GCSE Maths resources free?",
                  a: "The core revision resources on the original site are free; some AI tools have paid tiers. This recreation is free and open-source.",
                },
                {
                  q: "Can I revise with a different board's materials?",
                  a: "Yes. Topic content overlaps heavily between boards, so cross-board practice is common — the grade tabs work the same everywhere.",
                },
              ]}
            />
          </div>
        </section>

        <Attribution href="https://www.mathsgenie.co.uk/gcse.html" />
      </div>
    </div>
  );
}
