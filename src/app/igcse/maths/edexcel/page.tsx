import type { Metadata } from "next";
import Link from "next/link";
import CourseBody from "@/components/courses/CourseBody";
import { SITE } from "@/lib/data";
import igcseEdexcel from "../../../../data/igcse-maths/topics-edexcel.json";

export const metadata: Metadata = {
  title: "Edexcel IGCSE Maths Revision — MathsGenie",
  description:
    "Free Edexcel IGCSE Maths revision: 119 topics across Grades 1–9 with exam-style questions, worksheets, and past papers from 2018–2025 with mark schemes.",
};

type Doc = {
  qualification: string;
  subject: string;
  board: string;
  spec: string;
  topic_count: number;
  grades: Record<string, { slug: string; title: string; href: string }[]>;
};

const doc = igcseEdexcel as unknown as Doc;

const RESOURCES = [
  {
    section: "Popular",
    items: [
      {
        title: "Worksheets",
        desc: "Downloadable exam booklets and worksheets per topic",
        icon: "🖨",
        tint: "#d9f4e5",
        href: `${SITE.original}/igcse/maths/edexcel/worksheets`,
      },
      {
        title: "Past papers",
        desc: "Real past papers from 2018–2025 with mark schemes",
        icon: "📄",
        tint: "#e3f4fe",
        href: `${SITE.original}/igcse/maths/edexcel/papers`,
      },
    ],
  },
  {
    section: "Practice",
    items: [
      {
        title: "Question bank",
        desc: "Practice questions with AI feedback",
        icon: "❓",
        tint: "#e9dcfd",
        href: `${SITE.original}/igcse/maths/edexcel`,
        badge: "Popular",
        count: "1,210 questions",
      },
      {
        title: "Daily Greens",
        desc: "A quick worksheet each day that targets your weaknesses",
        icon: "🌿",
        tint: "#d9f4e5",
        href: `${SITE.original}/igcse/daily-greens`,
      },
      {
        title: "Question Rush",
        desc: "Race the clock on quick-fire questions",
        icon: "⚡",
        tint: "#fde3c4",
        href: "/gcse/question-rush",
      },
    ],
  },
  {
    section: "Learn",
    items: [
      {
        title: "Videos",
        desc: "Master concepts with explainer videos",
        icon: "▶",
        tint: "#e9dcfd",
        href: `${SITE.original}/igcse/maths/edexcel`,
      },
      {
        title: "Flashcards",
        desc: "Remember concepts with active recall",
        icon: "🗂",
        tint: "#e3f4fe",
        href: `${SITE.original}/igcse/maths/edexcel/flashcards`,
      },
    ],
  },
  {
    section: "Tools",
    items: [
      {
        title: "Exam builder",
        desc: "Build a custom mock from exam-style questions",
        icon: "✏️",
        tint: "#f0f1f3",
        href: `${SITE.original}/igcse/maths/edexcel`,
      },
      {
        title: "Grade calculator",
        desc: "Estimate the grade your mock scores point to",
        icon: "📈",
        tint: "#fde8ec",
        href: "/gcse/maths/edexcel/predicted-grade-calculator",
      },
    ],
  },
];

const ASSESSMENT = [
  { paper: "Paper 1", tier: "Foundation", time: "2 hours", marks: "100 marks", weight: "50%" },
  { paper: "Paper 2", tier: "Foundation", time: "2 hours", marks: "100 marks", weight: "50%" },
  { paper: "Paper 1", tier: "Higher", time: "2 hours", marks: "100 marks", weight: "50%" },
  { paper: "Paper 2", tier: "Higher", time: "2 hours", marks: "100 marks", weight: "50%" },
];

const AIMS = [
  "recall and apply mathematical knowledge and techniques",
  "carry out routine procedures accurately, with and without a calculator",
  "organise, process and interpret information in tables, graphs and diagrams",
  "estimate, approximate and work to an appropriate degree of accuracy",
  "analyse a problem and select a suitable strategy to solve it",
  "make logical inferences and draw conclusions from mathematical data",
  "communicate mathematical methods and results clearly",
  "interpret information and convert between different representations",
  "translate problems in mathematical or non-mathematical contexts into a series of mathematical processes",
];

const FAQS = [
  {
    q: "Is International GCSE Maths harder than GCSE Maths?",
    a: "The two courses cover very similar ground, but International GCSE Maths is examined in a slightly different way — typically no formula sheet and no tiered non-calculator paper. Most students moving between the two find the topics familiar; the style of the questions is the main adjustment.",
  },
  {
    q: "What topics are covered in Edexcel International GCSE Maths?",
    a: "Everything from number and ratio through algebra, geometry and trigonometry to statistics and probability, graded 1–9. Higher-tier topics add calculus (differentiation), functions, vectors proofs and algebraic fractions. The full list of 119 topics is on this page, grouped by grade.",
  },
  {
    q: "Who takes International GCSE Maths?",
    a: "It is common in UK international schools and independent schools, and popular with home-educated students worldwide. Universities and sixth forms treat it as equivalent to GCSE Maths.",
  },
  {
    q: "How is Edexcel International GCSE Maths assessed?",
    a: "Two written papers, each 2 hours and worth 100 marks with 50% weighting. Foundation and Higher tiers are available, and a calculator is allowed in both papers.",
  },
  {
    q: "Is International GCSE Maths accepted by UK sixth forms and universities?",
    a: "Yes. Edexcel International GCSEs (International GCSE is Pearson's official name) are regulated qualifications recognised by sixth forms, colleges and universities in the UK and abroad.",
  },
  {
    q: "How does International GCSE Maths differ from the UK GCSE?",
    a: "The content overlaps heavily, but International GCSE has no controlled assessment, offers summer and January exam series, and scales grades differently at the top end (a 9 is not awarded on Foundation tier, for example).",
  },
];

/** /igcse/maths/edexcel — v2 course page: gradient hero, Topics/Resources tabs, grade groups. */
export default function IgcseEdexcelPage() {
  const groups = Object.entries(doc.grades).map(([name, topics]) => ({ name: `Grade ${name}`, topics }));

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
            <Link href="/igcse" className="text-ink/60 hover:text-accent">IGCSE</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">Maths Edexcel</span>
            <span className="ml-auto hidden text-xs text-ink/50 sm:block">Spec {doc.spec}</span>
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
            Free Edexcel IGCSE Maths revision: 1,210 exam-style questions, 650 worksheets, and
            past papers from 2018–2025 with mark schemes — {doc.topic_count} topics grouped by
            grade, from Addition and Subtraction to Differentiation.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <CourseBody groups={groups} topicCount={doc.topic_count} resources={RESOURCES} />

        {/* Assessment at a glance */}
        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight">Assessment at a glance</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border-2 border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-paper-2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Paper</th>
                  <th className="px-4 py-3 font-semibold">Tier</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Marks</th>
                  <th className="px-4 py-3 font-semibold">Weighting</th>
                </tr>
              </thead>
              <tbody>
                {ASSESSMENT.map((r, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold">{r.paper}</td>
                    <td className="px-4 py-3">{r.tier}</td>
                    <td className="px-4 py-3">{r.time}</td>
                    <td className="px-4 py-3">{r.marks}</td>
                    <td className="px-4 py-3">{r.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            A calculator is allowed in both papers. Grades 9–1 are available on Higher; Foundation
            tops out at grade 5.
          </p>
        </section>

        {/* Course aims & skills */}
        <section className="mt-12">
          <h2 className="text-xl font-extrabold tracking-tight">Course aims &amp; skills</h2>
          <p className="mt-3 max-w-3xl text-sm text-ink/70">
            Edexcel IGCSE Maths builds the skills examiners reward. By the end of the course,
            students should be able to:
          </p>
          <ul className="mt-4 grid max-w-3xl gap-2 text-sm text-ink/80 sm:grid-cols-2">
            {AIMS.map((a) => (
              <li key={a} className="flex items-start gap-2 rounded-xl bg-paper-2 px-3 py-2.5">
                <span className="mt-0.5 text-accent" aria-hidden>✓</span>
                {a}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="mt-12">
          <h2 className="text-xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <div className="mt-4 max-w-3xl divide-y divide-line rounded-2xl border-2 border-line bg-paper">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-4 py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold">
                  {f.q}
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" fill="none" aria-hidden>
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-muted">
          Papers and downloads stay on{" "}
          <a href={`${SITE.original}/igcse/maths/edexcel`} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
            the original site ↗
          </a>{" "}
          — this recreation documents the course structure and links back.
        </p>
      </div>
    </div>
  );
}
