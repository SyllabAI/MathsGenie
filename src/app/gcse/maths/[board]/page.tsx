import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseBrowser from "@/components/gcse/CourseBrowser";
import { Faq, Attribution } from "@/components/Content";
import { isBoard, boardLabel, loadTopics, gradeTabs, BOARD_SLUGS, SITE } from "@/lib/data";

export async function generateStaticParams() {
  return BOARD_SLUGS.map((board) => ({ board }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isBoard(board)) return {};
  return {
    title: `${boardLabel(board)} GCSE Maths Revision`,
    description: `Free ${boardLabel(board)} GCSE Maths resources — 134 topics by grade, past papers, mark schemes and revision materials (recreated catalog).`,
  };
}

/** Correct spec codes per awarding body (public facts). */
const SPEC_CODES: Record<string, string> = {
  edexcel: "1MA1",
  aqa: "8300",
  ocr: "J560",
};

/** Exam facts are public assessment details (self-written presentation). */
const ASSESSMENT = [
  { paper: "Paper 1", calc: "Non-calculator", duration: "1h 30m", marks: "80 marks", weight: "33.3%" },
  { paper: "Paper 2", calc: "Calculator", duration: "1h 30m", marks: "80 marks", weight: "33.3%" },
  { paper: "Paper 3", calc: "Calculator", duration: "1h 30m", marks: "80 marks", weight: "33.3%" },
];

/** Self-written summary of the qualification's assessment objectives. */
const SKILLS = [
  "Apply standard techniques accurately and fluently",
  "Recall facts, notation and mathematical vocabulary",
  "Reason, interpret and communicate mathematically",
  "Solve problems within maths and in real contexts",
  "Make deductions, inferences and draw conclusions",
  "Translate problems into mathematical processes",
  "Work confidently with number, algebra and geometry",
  "Interpret and construct graphs, tables and diagrams",
  "Evaluate methods and check results for accuracy",
];

/** Functional questions mirroring the original's FAQ headings; answers are our own words. */
const FAQ_ITEMS = [
  {
    q: "What is the difference between Foundation and Higher tier?",
    a: "Foundation papers cover grades 1 to 5 and top out at a grade 5, while Higher papers cover grades 4 to 9 and include more algebra, geometry and problem-solving depth. Both tiers sit the same three-paper structure, so choose the tier that matches your target grade and current working level.",
  },
  {
    q: "How hard is GCSE Maths compared to other GCSEs?",
    a: "GCSE Maths is considered demanding because it builds on connected ideas that keep compounding — a gap in number work shows up later in algebra and geometry. The flip side is that it is very learnable: steady topic-by-topic practice with past-paper style questions produces some of the most reliable grade gains of any subject.",
  },
  {
    q: "What topics are covered?",
    a: "The course spans six strands: number, algebra, ratio and proportion, geometry and measures, probability, and statistics. Use the grade accordions above to browse every topic from grade 1 foundations up to grade 8/9 extension material, each with its own set of practice resources.",
  },
  {
    q: "What do I need to know before starting?",
    a: "Secure KS3 foundations first: written and mental arithmetic, fractions, decimals and percentages, negative numbers, basic algebraic notation and angle facts. Most higher-grade struggles trace back to these basics, so revisit them whenever a new topic feels unstable.",
  },
  {
    q: "How is the qualification assessed?",
    a: "Three written papers of equal weight, each 1 hour 30 minutes and worth 80 marks. Paper 1 is non-calculator; Papers 2 and 3 allow a calculator. Every paper mixes routine technique questions with multi-step problem solving.",
  },
  {
    q: "What can I do after GCSE Maths?",
    a: "A grade 4 or above opens the door to A-Level Maths (grade 6+ recommended), and supports further study in sciences, economics, computing, engineering apprenticeships and most vocational routes. It is also a required or strongly preferred qualification for the majority of employers and sixth forms.",
  },
  {
    q: "Should I sit Foundation or Higher?",
    a: "If you are consistently working at grade 5 or above in mocks, Higher maximises your ceiling. If your current work sits at grades 3 to 4, Foundation lets you bank the core marks first. Talk to your teacher, then practise a full past paper in each tier to see where your marks actually land.",
  },
];

export default async function BoardPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const tabs = gradeTabs(doc);
  const grades = tabs.map((g) => ({ grade: g, topics: doc.grades[g] }));

  return (
    <div>
      {/* aurora hero band */}
      <div className="aurora-hero">
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-8 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-ink/70">
              <Link href="/gcse" className="font-medium hover:text-accent">GCSE</Link>
              <span className="text-ink/40" aria-hidden>›</span>
              <span className="font-bold text-ink">Maths {boardLabel(board)}</span>
            </nav>
            <p className="shrink-0 text-ink/60">
              Spec <span className="font-bold text-ink">{SPEC_CODES[board] ?? "—"}</span>
            </p>
          </div>

          <h1 className="font-title mt-3 text-4xl font-extrabold tracking-tight">Maths</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Free {boardLabel(board)} GCSE Maths revision for Foundation and Higher tier:
            {" "}{doc.topic_count} topics by grade, exam-style questions, worksheets,
            and past papers with mark schemes — a recreated catalog linking to the
            original site&apos;s resources.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-8">
        <div className="mt-6">
          <CourseBrowser board={board} grades={grades} />
        </div>

        {/* Assessment at a glance */}
        <section className="mt-14" aria-labelledby="assessment-heading">
          <h2 id="assessment-heading" className="font-title text-2xl font-extrabold tracking-tight">
            Assessment at a glance
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-125 text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Paper</th>
                  <th className="px-4 py-3 font-semibold">Format</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Marks</th>
                  <th className="px-4 py-3 font-semibold">Weighting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ASSESSMENT.map((row) => (
                  <tr key={row.paper} className="hover:bg-paper-2">
                    <td className="px-4 py-3 font-medium">{row.paper}</td>
                    <td className="px-4 py-3 text-muted">Written exam · {row.calc}</td>
                    <td className="px-4 py-3 text-muted">{row.duration}</td>
                    <td className="px-4 py-3 text-muted">{row.marks}</td>
                    <td className="px-4 py-3 font-semibold text-accent">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Course aims & skills */}
        <section className="mt-14" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="font-title text-2xl font-extrabold tracking-tight">
            Course aims &amp; skills
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted">
            {boardLabel(board)} GCSE Maths builds the skills examiners reward.
            By the end of the course you should be able to:
          </p>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 text-sm md:grid-cols-2">
            {SKILLS.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <span className="mt-1 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent" aria-hidden>
                  ✓
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-title text-2xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <Faq items={FAQ_ITEMS} />
          </div>
        </section>

        <Attribution href={`${SITE.original}/gcse/maths/${board}`} />
      </div>
    </div>
  );
}
