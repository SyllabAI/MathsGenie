import type { Metadata } from "next";
import Link from "next/link";
import CourseBody from "@/components/courses/CourseBody";
import { SITE } from "@/lib/data";
import { aslevelTopics } from "@/lib/aslevel";

export const metadata: Metadata = {
  title: "Edexcel AS Level Maths Revision — MathsGenie",
  description:
    "Free Edexcel AS Level Maths revision: 24 topics across pure mathematics, statistics and mechanics, with exam-style questions, worksheets and past papers from 2018–2025 with mark schemes.",
};

const RESOURCES = [
  {
    section: "Popular",
    items: [
      {
        title: "Worksheets",
        desc: "Downloadable exam booklets and worksheets per topic",
        icon: "🖨",
        tint: "#d9f4e5",
        href: `${SITE.original}/as-level/maths/edexcel/worksheets`,
      },
      {
        title: "Past papers",
        desc: "Real past papers from 2018–2025 with mark schemes",
        icon: "📄",
        tint: "#e3f4fe",
        href: `${SITE.original}/as-level/maths/edexcel/papers`,
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
        href: `${SITE.original}/as-level/maths/edexcel/questions`,
        badge: "Popular",
        count: "815 questions",
      },
      {
        title: "Daily Greens",
        desc: "A quick worksheet each day that targets your weaknesses",
        icon: "🌿",
        tint: "#d9f4e5",
        href: "/as-level/daily-greens",
      },
    ],
  },
  {
    section: "Learn",
    items: [
      {
        title: "Lessons",
        desc: "Step-by-step lessons and quizzes",
        icon: "📖",
        tint: "#e9dcfd",
        href: `${SITE.original}/as-level/maths/edexcel/lessons`,
      },
      {
        title: "Flashcards",
        desc: "Remember concepts with active recall",
        icon: "🗂",
        tint: "#e3f4fe",
        href: `${SITE.original}/as-level/maths/edexcel/flashcards`,
      },
    ],
  },
  {
    section: "Tools",
    items: [
      {
        title: "Mini tests",
        desc: "45-minute checks on a handful of topics",
        icon: "⏱",
        tint: "#fde3c4",
        href: `${SITE.original}/as-level/maths/edexcel/mini-tests`,
      },
      {
        title: "Grade calculator",
        desc: "Estimate the grade your mock scores point to",
        icon: "📈",
        tint: "#fde8ec",
        href: `${SITE.original}/as-level/maths/edexcel/predicted-grade-calculator`,
      },
    ],
  },
];

// Our own phrasing of the standard aims of the Edexcel AS maths course.
const AIMS = [
  "Select and apply standard techniques accurately, with and without a calculator",
  "Construct rigorous mathematical arguments and proofs",
  "Make logical deductions and inferences from given information",
  "Translate real-world problems into mathematical models",
  "Interpret and evaluate the outputs of a mathematical model",
  "Solve multi-step, unstructured problems by choosing a suitable strategy",
  "Manipulate algebraic expressions, equations and inequalities fluently",
  "Use calculators and technology effectively, and know when not to",
  "Communicate reasoning clearly with correct notation and language",
];

// FAQ titles mirror the original's question list; answers are our own words.
const FAQS = [
  {
    q: "Does AS Level Maths count towards my A Level?",
    a: "Under the current linear system in England, AS results do not count towards the final A Level grade — the A Level is examined fully at the end of two years. AS is still a standalone, UCAS-bearing qualification, and it is a useful checkpoint of your Year 1 understanding.",
  },
  {
    q: "How big is the jump from GCSE Maths to AS Level?",
    a: "The main change is the depth of algebra: quadratics, simultaneous equations and inequalities are treated far more rigorously, and every new idea (binomial expansion, differentiation, integration, logarithms) builds directly on fluent algebraic manipulation. Students with a solid grade 7+ usually settle in quickly with regular practice.",
  },
  {
    q: "What topics are covered in Edexcel AS Level Maths?",
    a: "Fourteen pure topics (algebraic expressions through exponentials and logarithms), seven statistics topics (data collection through hypothesis testing) and three mechanics topics (constant acceleration, forces and motion, variable acceleration) — all 24 are listed on this page with their subsections.",
  },
  {
    q: "What GCSE grade do I need for AS Level Maths?",
    a: "Most schools and colleges ask for at least a grade 6 or 7 at GCSE, and some prefer higher for the full A Level. The strongest predictor is algebraic confidence rather than the overall grade.",
  },
  {
    q: "How is Edexcel AS Level Maths assessed?",
    a: "Two written papers: Paper 1 is 2 hours of pure mathematics (100 marks, 62.5%) and Paper 2 is 1 hour 15 minutes of statistics and mechanics (60 marks, 37.5%). Calculators are allowed in both.",
  },
  {
    q: "What can I do with an AS Level in Maths?",
    a: "It demonstrates quantitative reasoning for UCAS and apprenticeships. Subjects like economics, psychology, computing and geography value the statistics content especially, and it keeps the door open to the full A Level.",
  },
  {
    q: "Is AS Level Maths worth taking?",
    a: "If your school offers it alongside three A Levels, it is a low-risk way to keep maths going, support your other quantitative subjects and practise timed exam technique — with a standalone grade to show for it.",
  },
];

/** /as-level/maths/edexcel — v2 course page: gradient hero, Topics/Resources tabs, module groups. */
export default function AsLevelEdexcelPage() {
  const doc = aslevelTopics;
  const groups = Object.entries(doc.modules).map(([name, topics]) => ({ name, topics }));

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
            <Link href="/as-level" className="text-ink/60 hover:text-accent">AS Level</Link>
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
            Free Edexcel AS Level Maths revision: 815 exam-style questions, 151 worksheets, and
            past papers from 2018–2025 with mark schemes — {doc.topic_count} topics across pure
            mathematics, statistics and mechanics.
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
                  <th className="px-4 py-3 font-semibold">Assessment</th>
                  <th className="px-4 py-3 font-semibold">Format</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Marks</th>
                  <th className="px-4 py-3 font-semibold">Weighting</th>
                </tr>
              </thead>
              <tbody>
                {doc.assessment.map((r) => (
                  <tr key={r.paper} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold">{r.paper}</td>
                    <td className="px-4 py-3">{r.format}</td>
                    <td className="px-4 py-3">{r.duration}</td>
                    <td className="px-4 py-3">{r.marks}</td>
                    <td className="px-4 py-3">{r.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            A calculator is allowed in both papers. AS grades A–E are awarded; the AS can be taken
            as a standalone qualification.
          </p>
        </section>

        {/* Course aims & skills */}
        <section className="mt-12">
          <h2 className="text-xl font-extrabold tracking-tight">Course aims &amp; skills</h2>
          <p className="mt-3 max-w-3xl text-sm text-ink/70">
            Edexcel AS Level Maths builds the skills examiners reward. By the end of the course
            you should be able to:
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
          <a href={`${SITE.original}/as-level/maths/edexcel`} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
            the original site ↗
          </a>{" "}
          — this recreation documents the course structure and links back.
        </p>
      </div>
    </div>
  );
}
