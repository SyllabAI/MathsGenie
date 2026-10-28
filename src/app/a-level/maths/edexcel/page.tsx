import type { Metadata } from "next";
import Link from "next/link";
import ALevelTabs from "@/components/alevel/ALevelTabs";
import { Attribution, Faq } from "@/components/Content";
import {
  alevelLessonSlugs,
  alevelOriginalTopicUrl,
  ALEVEL_ORIGINAL_PATH,
  alevelOriginalUrl,
  alevelTopics,
  ALEVEL_MODULE_ORDER,
} from "@/lib/alevel";

export const metadata: Metadata = {
  title: "Edexcel A Level Maths Revision",
  description:
    "Free Edexcel A Level Maths resources — 44 topics across pure mathematics, statistics and mechanics, interactive lessons, past papers from 2018–2025 with mark schemes (recreated catalog).",
};

/** Public assessment facts for Edexcel A-Level Maths (9MA0), self-presented. */
const ASSESSMENT = [
  { paper: "Paper 1 (Pure Mathematics 1)", calc: "Calculator", duration: "2h", marks: "100 marks", weight: "33.3%" },
  { paper: "Paper 2 (Pure Mathematics 2)", calc: "Calculator", duration: "2h", marks: "100 marks", weight: "33.3%" },
  { paper: "Paper 3 (Statistics and Mechanics)", calc: "Calculator", duration: "2h", marks: "100 marks", weight: "33.3%" },
];

/** Self-written summary of the skills the qualification builds (AO-based). */
const SKILLS = [
  "Construct and present clear mathematical arguments and proofs",
  "Use and apply standard techniques fluently",
  "Solve problems within mathematics and in modelling contexts",
  "Interpret solutions in the context of the problem",
  "Work confidently with functions, calculus and vectors",
  "Reason with probability and statistical distributions",
  "Model motion and forces in mechanics",
  "Use a calculator and technology effectively",
  "Translate real-world situations into mathematical models",
];

/** FAQ headings mirror the original's; every answer is our own words. */
const FAQ_ITEMS = [
  {
    q: "What is the difference between AS and A Level Maths?",
    a: "AS covers roughly the first half of the content — pure maths plus introductory statistics and mechanics — assessed after one year, and it is graded A to E on its own. The full A Level takes all of that further: Year 2 pure topics like parametric equations and numerical methods, plus deeper statistics and mechanics, across three two-hour papers. AS results do not count towards the final A Level grade.",
  },
  {
    q: "How hard is A Level Maths compared to other A Levels?",
    a: "It is a step up in pace rather than in mystery: GCSE topics reappear immediately in harder forms, and new ideas (calculus, logarithms, proof) arrive in the first term. The saving grace is that it is the most past-paper-rich A Level there is — topics repeat in recognisable shapes, so disciplined topic-by-topic practice converts directly into marks.",
  },
  {
    q: "What topics are covered in Edexcel A Level Maths?",
    a: "Pure mathematics takes two thirds of the course — algebra, coordinate geometry, trigonometry, calculus and vectors — and the final third splits between statistics (data, probability, distributions, hypothesis testing) and mechanics (kinematics, forces, Newton's laws). Browse the module tree above for all 44 topics.",
  },
  {
    q: "What GCSE grades do I need for A Level Maths?",
    a: "Most schools and sixth forms ask for at least a grade 7 at GCSE, some accept a strong 6 with support. The algebra fluency matters more than the number: if quadratics, indices and rearranging feel automatic, the A Level start is very manageable — the first pure topics are GCSE favourites in sharper clothing.",
  },
  {
    q: "How is Edexcel A Level Maths assessed?",
    a: "Three written calculator papers of equal weight, each two hours and 100 marks: two pure mathematics papers and one combined statistics and mechanics paper. Roughly half the marks reward routine technique, the rest reasoning, modelling and problem solving.",
  },
  {
    q: "What degrees and careers does A Level Maths lead to?",
    a: "It is the gateway A Level for maths, physics, engineering, economics and computer science, and it is highly valued for medicine, architecture, data science, finance and actuarial work. Even where it is not required, it signals the quantitative reasoning employers and universities trust.",
  },
  {
    q: "Is A Level Maths worth taking for my degree?",
    a: "If your target course lists it as required, the decision is made. If it is merely recommended, taking it keeps far more doors open than it closes — and the problem-solving stamina you build transfers to any quantitative degree, from chemistry to economics, even when the content itself is not reused.",
  },
];

/** Self-written one-liners for the Resources tab (internal vs outbound). */
const RESOURCES: { label: string; desc: string; href: string; external: boolean; icon: string }[] = [
  { label: "Lessons", desc: "Interactive step-by-step lessons — start here for the core pure toolkit.", href: `${ALEVEL_ORIGINAL_PATH}/lessons`, external: false, icon: "📖" },
  { label: "Teach Genie", desc: "Learn by teaching: explain a topic to Baby Genie and see what stuck.", href: `${ALEVEL_ORIGINAL_PATH}/teach-genie`, external: false, icon: "🧞" },
  { label: "Ask Genie AI", desc: "The AI tutor shell — recreated as a demo chat UI.", href: "/ask-genie", external: false, icon: "🪄" },
  { label: "Question bank", desc: "Exam-style questions per topic, hosted on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/questions`), external: true, icon: "◉" },
  { label: "Past papers", desc: "Series from 2018–2025 with mark schemes on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/papers`), external: true, icon: "📄" },
  { label: "Worksheets", desc: "Printable booklets per topic, hosted on the original.", href: alevelOriginalUrl("/a-level/worksheets"), external: true, icon: "🖨" },
  { label: "Revision guides", desc: "Topic-by-topic notes on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/revision-guides`), external: true, icon: "📘" },
  { label: "Videos", desc: "Walkthroughs per topic on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/videos`), external: true, icon: "▶" },
  { label: "Flashcards", desc: "Active-recall decks on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/flashcards`), external: true, icon: "🗂" },
  { label: "Exam builder", desc: "Compose custom topic papers on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/mock-exam-builder`), external: true, icon: "🧪" },
  { label: "Paper marker", desc: "Upload-and-mark flow on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/paper-marker`), external: true, icon: "🖊" },
  { label: "Grade calculator", desc: "Boundary sliders on the original.", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/predicted-grade-calculator`), external: true, icon: "🎛" },
  { label: "Daily Greens", desc: "A daily problem set on the original.", href: alevelOriginalUrl("/a-level/daily-greens"), external: true, icon: "🌿" },
  { label: "Question Rush", desc: "Timed drill on the original.", href: alevelOriginalUrl("/a-level/question-rush"), external: true, icon: "⏱" },
];

export default function ALevelEdexcelPage() {
  const doc = alevelTopics;
  const lessons = alevelLessonSlugs();

  const topicsPanel = (
    <div className="mt-6 space-y-9">
      {ALEVEL_MODULE_ORDER.map((mod) => (
        <section key={mod} aria-label={mod}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-title text-xl font-extrabold tracking-tight">{mod}</h2>
            <span className="text-xs font-semibold text-muted">{doc.modules[mod].length} topics</span>
          </div>
          <ol className="mt-3 grid gap-1.5 md:grid-cols-2">
            {doc.modules[mod].map((t, i) => (
              <li
                key={t.slug}
                className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-3.5 py-2.5 transition hover:border-accent/40"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-2 text-sm font-bold text-muted">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{t.title}</span>
                <div className="flex shrink-0 items-center gap-1.5">
                  {lessons.has(t.slug) && (
                    <Link
                      href={`${ALEVEL_ORIGINAL_PATH}/lessons/${t.slug}`}
                      className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white transition hover:bg-accent-ink"
                    >
                      Lesson
                    </Link>
                  )}
                  <a
                    href={alevelOriginalTopicUrl(t.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold transition hover:bg-paper-2"
                  >
                    Original ↗
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );

  const resourcesPanel = (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {RESOURCES.map((r) =>
        r.external ? (
          <a
            key={r.label}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border-2 border-line bg-panel p-5 transition hover:border-accent/50"
          >
            <span className="text-2xl" aria-hidden>{r.icon}</span>
            <p className="mt-2 font-bold group-hover:text-accent">{r.label} ↗</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{r.desc}</p>
          </a>
        ) : (
          <Link
            key={r.label}
            href={r.href}
            className="group rounded-3xl border-2 border-accent/25 bg-accent-soft/30 p-5 transition hover:border-accent/60"
          >
            <span className="text-2xl" aria-hidden>{r.icon}</span>
            <p className="mt-2 font-bold group-hover:text-accent">{r.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{r.desc}</p>
          </Link>
        ),
      )}
    </div>
  );

  return (
    <div>
      {/* aurora hero band */}
      <div className="aurora-hero">
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-8 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-ink/70">
              <Link href="/" className="font-medium hover:text-accent">A Level</Link>
              <span className="text-ink/40" aria-hidden>›</span>
              <span className="font-bold text-ink">Maths Edexcel</span>
            </nav>
            <p className="shrink-0 text-ink/60">
              Spec <span className="font-bold text-ink">{doc.spec}</span>
            </p>
          </div>

          <h1 className="font-title mt-3 text-4xl font-extrabold tracking-tight">Maths</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Free Edexcel A Level Maths revision: {doc.topic_count} topics across pure
            mathematics, statistics and mechanics, interactive lessons, and past
            papers from 2018–2025 with mark schemes — a recreated catalog linking to
            the original site&apos;s resources.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-14 sm:px-8">
        <div className="mt-6">
          <ALevelTabs topics={topicsPanel} resources={resourcesPanel} />
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
            Edexcel A Level Maths builds the skills examiners reward. By the end of
            the course you should be able to:
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

        <Attribution href={`${alevelOriginalUrl(ALEVEL_ORIGINAL_PATH)}`} />
      </div>
    </div>
  );
}
