import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceHubShell from "@/components/member/ResourceHubShell";
import { isBoard, loadTopics, SITE } from "@/lib/data";

export const metadata: Metadata = { title: "GCSE Maths Question Bank" };

/**
 * /gcse/maths/[board]/questions — question-bank hub (original pattern):
 * search + Grade 1…8/9 accordions with per-topic rows, progress radio,
 * deterministic recreation question counts, and "Start revising" linking
 * into the per-topic question player.
 */

/* deterministic pseudo-count so the UI matches the original's "N questions" feel
   without copying its catalog numbers (research note §6) */
function questionCount(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 30 + (Math.abs(h) % 340);
}

export default async function QuestionBankPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const grades = Object.keys(doc.grades);

  const tabs = [
    { label: "All resources", href: `/gcse/maths/${board}`, icon: "▦" },
    { label: "Worksheets", href: `/gcse/maths/${board}/worksheets`, icon: "🖨" },
    { label: "Question bank", href: `/gcse/maths/${board}/questions`, icon: "◉" },
    { label: "Question Rush", href: `/gcse/question-rush`, icon: "⏱" },
    { label: "Hot topics", href: `/gcse/maths/${board}/topic-heatmap`, icon: "📊" },
    { label: "Scheme of learning", href: `/gcse/maths/${board}/scheme-of-learning`, icon: "🪜" },
    { label: "Teach Genie", href: `/gcse/maths/${board}/teach-genie`, icon: "🧞" },
  ];

  return (
    <ResourceHubShell board={board} title="Question bank" activeTab="Question bank" tabs={tabs}>
      <label className="mt-6 flex max-w-md items-center gap-2 rounded-full bg-paper-2 px-4 py-2.5">
        <svg viewBox="0 0 20 20" className="size-4 text-muted" aria-hidden>
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input placeholder="Search topics..." className="w-full bg-transparent text-sm outline-none" />
      </label>

      <div className="mt-6 space-y-4">
        {grades.map((g) => (
          <details key={g} open={g === grades[0]} className="group rounded-2xl border-2 border-line bg-panel">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4">
              <span className="rounded-full border-2 border-line p-1 text-[10px] text-muted transition group-open:rotate-180" aria-hidden>▾</span>
              <h3 className="text-lg font-extrabold">Grade {g}</h3>
              <span className="ml-auto text-xs text-muted">{doc.grades[g].length} topics</span>
            </summary>
            <ul className="border-t-2 border-line px-2 pb-2">
              {doc.grades[g].map((t) => {
                const n = questionCount(t.slug);
                return (
                  <li key={t.slug} className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-paper-2">
                    <span className="size-5 shrink-0 rounded-full border-2 border-line" aria-hidden />
                    <Link href={`/gcse/maths/${board}/${t.slug}/questions`} className="min-w-0 flex-1 truncate text-sm font-semibold hover:text-accent">
                      {t.title}
                    </Link>
                    <span className="shrink-0 text-xs text-muted">{n} questions</span>
                    <a
                      href={`${SITE.original}/gcse/maths/edexcel/${t.slug}/questions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs text-muted transition hover:bg-paper-2 hover:text-ink"
                    >
                      Original ↗
                    </a>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Counts are deterministic placeholders for the recreation — real banks open from each topic page.
      </p>
    </ResourceHubShell>
  );
}
