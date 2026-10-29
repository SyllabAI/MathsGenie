import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ALevelHubShell from "@/components/member/ALevelHubShell";
import MockExamBuilder from "@/components/alevel/MockExamBuilder";
import GradeCalculatorAL from "@/components/alevel/GradeCalculatorAL";
import PaperMarker from "@/components/alevel/PaperMarker";
import QuestionRushGame from "@/components/QuestionRushGame";
import { Attribution } from "@/components/Content";
import { alevelTopics, alevelTopicList, alevelOriginalTopicUrl, alevelOriginalUrl } from "@/lib/alevel";
/**
 * /a-level/<feature> — the original exposes every practice/learn/tool as a
 * flat route under /a-level (captured from the Features mega-menu,
 * research/09 §4): worksheets, question bank, Question Rush, Daily Greens,
 * past + predicted papers, hot topics, lessons, revision guides, videos,
 * flashcards, mock exam builder, answer marking, paper marker, grade
 * calculator. This dynamic route recreates each with the same chrome
 * (ALevelHubShell) and real A-Level course data; per-topic deep resources
 * hot-link back to the original topic pages.
 */

const FEATURES = [
  "worksheets", "questions", "question-rush", "daily-greens", "papers",
  "predicted-papers", "topic-heatmap", "videos", "flashcards",
  "revision-guides", "mock-exam-builder", "essay-marker", "paper-marker",
  "predicted-grade-calculator",
] as const;

type Feature = (typeof FEATURES)[number];

const META: Record<Feature, { title: string; tab: string; intro: string }> = {
  worksheets: { title: "Worksheets", tab: "Worksheets", intro: "Exam-style worksheets for every Edexcel A Level topic — split by module so you can revise alongside your lessons." },
  questions: { title: "Question bank", tab: "Question bank", intro: "Exam-style questions for each topic, graded from warm-up to full exam standard." },
  "question-rush": { title: "Question Rush", tab: "Question Rush", intro: "Beat the clock on quick-fire A Level questions — speed and accuracy both count." },
  "daily-greens": { title: "Daily Greens", tab: "Daily Greens", intro: "A quick worksheet each day that targets your weaknesses across the A Level course." },
  papers: { title: "Past papers", tab: "Papers", intro: "Every Edexcel A Level Maths past paper with mark schemes, arranged by exam series." },
  "predicted-papers": { title: "Predicted papers", tab: "Papers", intro: "Practice papers built around the topics most likely to appear this summer." },
  "topic-heatmap": { title: "Hot topics", tab: "Hot topics", intro: "Where everyone struggles right now — the hottest topics across the A Level course." },
  videos: { title: "Videos", tab: "Videos", intro: "Revision videos for every A Level topic, module by module." },
  flashcards: { title: "Flashcards", tab: "Flashcards", intro: "Spaced-repetition decks for each topic. The review queue keeps the tricky cards coming back." },
  "revision-guides": { title: "Revision guides", tab: "Revision guides", intro: "Condensed revision notes per module, plus the formula book you get in the exam." },
  "mock-exam-builder": { title: "Mock exam builder", tab: "Exam builder", intro: "Build a custom mock from exam-style questions — pick topics, set the marks, print it." },
  "essay-marker": { title: "Answer marking", tab: "Answer marking", intro: "Upload or paste your written working and get it marked against the scheme." },
  "paper-marker": { title: "Paper marker", tab: "Paper marker", intro: "Upload a completed paper and get it AI marked, question by question." },
  "predicted-grade-calculator": { title: "Grade calculator", tab: "Grade calculator", intro: "Enter your paper marks to see your predicted A Level grade against typical boundaries." },
};

export function generateStaticParams() {
  return FEATURES.map((feature) => ({ feature }));
}

export async function generateMetadata({ params }: { params: Promise<{ feature: string }> }): Promise<Metadata> {
  const { feature } = await params;
  const meta = META[feature as Feature];
  return { title: meta ? `${meta.title} - A Level Maths | MathsGenie Recreation` : "A Level Maths" };
}

function TopicGrid({ tab }: { tab: string }) {
  const modules = alevelTopics.modules;
  return (
    <div className="space-y-10">
      {Object.entries(modules).map(([mod, topics]) => (
        <section key={mod} aria-labelledby={`mod-${mod.replace(/\W+/g, "-")}`}>
          <div className="flex items-center gap-3">
            <h2 id={`mod-${mod.replace(/\W+/g, "-")}`} className="font-title text-xl font-extrabold tracking-tight">{mod}</h2>
            <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-bold text-muted">{topics.length} topics</span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <a
                key={t.slug}
                href={alevelOriginalTopicUrl(t.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border-2 border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <p className="font-semibold leading-snug group-hover:text-accent">{t.title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
                  {tab} <span aria-hidden>↗</span>
                </p>
              </a>
            ))}
          </div>
        </section>
      ))}
      <Attribution href={alevelOriginalUrl("/a-level/worksheets")} />
    </div>
  );
}

export default async function ALevelFeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  if (!FEATURES.includes(feature as Feature)) notFound();
  const meta = META[feature as Feature];

  /* deterministic "heat" per topic for Hot topics (recreated demo data) */
  const heat = (slug: string) => {
    let h = 0;
    for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 997;
    return 35 + (h % 61);
  };

  return (
    <ALevelHubShell title={meta.title} activeTab={meta.tab} intro={meta.intro}>
      {(feature === "worksheets" || feature === "videos" || feature === "questions") && <TopicGrid tab={meta.title} />}

      {feature === "flashcards" && (
        <div className="space-y-8">
          <div className="rounded-2xl border-2 border-line bg-paper p-6">
            <h2 className="font-title text-lg font-extrabold">Review queue</h2>
            <p className="mt-1 text-sm text-muted">Cards due today across your decks. Review keeps the ones you miss coming back sooner.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Due now: 12 cards", "Learning: 8", "New: 15"].map((s) => (
                <span key={s} className="rounded-full border-2 border-accent/30 bg-accent-soft/60 px-3.5 py-1.5 text-xs font-bold text-accent">{s}</span>
              ))}
            </div>
          </div>
          <TopicGrid tab="Flashcards" />
        </div>
      )}

      {feature === "topic-heatmap" && (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alevelTopicList().map((t) => {
              const h = heat(t.slug);
              const tone = h > 75 ? "bg-[#ffd9d0] text-[#b3261e]" : h > 55 ? "bg-[#ffe9c7] text-[#9a5b00]" : "bg-[#e2f6e9] text-[#0b7a3b]";
              return (
                <a key={t.slug} href={alevelOriginalTopicUrl(t.slug)} target="_blank" rel="noopener noreferrer" className="rounded-2xl border-2 border-line bg-paper p-4 transition hover:shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 font-semibold leading-snug">{t.title}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${tone}`}>{h}%</span>
                  </div>
                  <p className="mt-1.5 truncate text-xs text-muted">{t.module}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-2">
                    <div className="h-full rounded-full bg-[#e88a2d]" style={{ width: `${h}%` }} />
                  </div>
                </a>
              );
            })}
          </div>
          <Attribution href={alevelOriginalUrl("/a-level/topic-heatmap")} />
        </div>
      )}

      {feature === "revision-guides" && (
        <div className="space-y-10">
          <section>
            <h2 className="font-title text-xl font-extrabold tracking-tight">Formula book &amp; legacy notes</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Formula Book", href: alevelOriginalUrl("/a-level/old-maths/edexcel/legacy-old-alevel-bbbbbbbb-0000-4000-8000-000000000001") },
                ...["C1", "C2", "C3", "C4", "S1", "M1"].map((c, i) => ({
                  label: `All ${c} Revision Notes`,
                  href: alevelOriginalUrl(`/a-level/old-maths/edexcel/legacy-old-alevel-bbbbbbbb-0000-4000-8000-00000000000${i + 2}`),
                })),
              ].map((r) => (
                <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-line bg-paper p-4 transition hover:border-accent/40 hover:shadow-md">
                  <span className="font-semibold group-hover:text-accent">{r.label}</span>
                  <span aria-hidden className="text-muted">↗</span>
                </a>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-title text-xl font-extrabold tracking-tight">Solomon worksheets (legacy)</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["C1", "C2", "C3", "C4"].map((c, i) => (
                <a key={c} href={alevelOriginalUrl(`/a-level/old-maths/edexcel/legacy-old-alevel-bbbbbbbb-0000-4000-8000-00000000000${i + 8}`)} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-line bg-paper p-4 transition hover:border-accent/40 hover:shadow-md">
                  <span className="font-semibold group-hover:text-accent">{c} Solomon Worksheets</span>
                  <span aria-hidden className="text-muted">↗</span>
                </a>
              ))}
            </div>
          </section>
          <Attribution href={alevelOriginalUrl("/a-level/old-maths/edexcel")} />
        </div>
      )}

      {(feature === "papers" || feature === "predicted-papers") && (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["June 2024", "June 2023", "November 2022", "June 2022", "November 2021", "June 2019", "June 2018", "Specimen", "Sample assessment"].map((series) => (
              <div key={series} className="rounded-2xl border-2 border-line bg-paper p-5">
                <p className="font-title font-extrabold">{series}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Paper 1", "Paper 2", "Paper 3"].map((p) => (
                    <a key={p} href={alevelOriginalUrl("/a-level/maths/edexcel/papers")} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-line px-3 py-1.5 text-xs font-bold text-ink/70 transition hover:border-accent/40 hover:text-accent">
                      {p} <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
                <p className="mt-2.5 text-[11px] text-muted">Mark schemes on the original</p>
              </div>
            ))}
          </div>
          <Attribution href={alevelOriginalUrl("/a-level/maths/edexcel/papers")} />
        </div>
      )}

      {feature === "question-rush" && (
        <QuestionRushGame grades={["Year 1 Pure", "Year 1 Stats", "Year 1 Mech", "Year 2 Pure", "Year 2 Stats", "Year 2 Mech"]} />
      )}

      {feature === "daily-greens" && (
        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-line bg-paper p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">Today&apos;s set</p>
          <h2 className="mt-2 font-title text-2xl font-extrabold">5 questions, picked for you</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            One quick set per day, drawn from Year 1 and Year 2 modules and weighted toward topics you have not touched recently. Your streak grows every day you finish.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["Algebraic Expressions", "Quadratics", "Differentiation", "Probability", "SUVAT"].map((t, i) => (
              <span key={t} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-xs font-bold text-ink/70">Q{i + 1} · {t}</span>
            ))}
          </div>
          <a href={alevelOriginalUrl("/a-level/daily-greens")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink">
            Open on original <span aria-hidden>↗</span>
          </a>
        </div>
      )}

      {feature === "mock-exam-builder" && <MockExamBuilder />}

      {feature === "predicted-grade-calculator" && <GradeCalculatorAL />}

      {(feature === "essay-marker" || feature === "paper-marker") && (
        <PaperMarker mode={feature === "essay-marker" ? "answer" : "paper"} />
      )}
    </ALevelHubShell>
  );
}
