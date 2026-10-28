import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceHubShell from "@/components/member/ResourceHubShell";
import { isBoard, loadTopics, SITE } from "@/lib/data";

export const metadata: Metadata = { title: "GCSE Maths Hot Topics" };

/**
 * /gcse/maths/[board]/topic-heatmap — Hot topics (original pattern):
 * Foundation/Higher toggle, Pro-gated "Your priorities", and a
 * topic × exam-series intensity table. Intensity cells are deterministic
 * placeholders (recreation), structure mirrors the original heatmap.
 */

const SERIES = ["June 2018", "November 2018", "June 2019", "November 2019", "November 2020", "June 2022", "June 2023"];

function intensity(slug: string, series: string) {
  let h = 5381;
  const key = slug + series;
  for (let i = 0; i < key.length; i++) {
    h = (h * 33) ^ key.charCodeAt(i);
  }
  return Math.abs(h) % 4; // 0..3
}

const CELL = [
  "bg-paper-2",
  "bg-[#ffe3b3]",
  "bg-[#ffb26b]",
  "bg-[#ff6b35]",
] as const;

export default async function TopicHeatmapPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const grades = Object.keys(doc.grades);
  const rows = grades.flatMap((g) => doc.grades[g].slice(0, 6).map((t) => ({ ...t, grade: g })));

  const tabs = [
    { label: "All resources", href: `/gcse/maths/${board}`, icon: "▦" },
    { label: "Worksheets", href: `/gcse/maths/${board}/worksheets`, icon: "🖨" },
    { label: "Question bank", href: `/gcse/maths/${board}/questions`, icon: "◉" },
    { label: "Question Rush", href: `/gcse/question-rush`, icon: "⏱" },
    { label: "Hot topics", href: `/gcse/maths/${board}/topic-heatmap`, icon: "📊" },
    { label: "Daily Greens", href: `/gcse/daily-greens`, icon: "🌿" },
  ];

  return (
    <ResourceHubShell board={board} title="Hot topics" activeTab="Hot topics" tabs={tabs}>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border-2 border-line p-1 text-sm font-bold">
          <button className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-1.5 shadow-sm">
            <span className="text-[#1cb0f6]" aria-hidden>◆</span> Foundation
          </button>
          <button className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-muted transition hover:text-ink">
            <span className="text-[#ff9600]" aria-hidden>◆</span> Higher
          </button>
        </div>
        <button className="ml-auto flex items-center gap-1.5 rounded-full border-2 border-line px-4 py-2 text-sm font-semibold transition hover:bg-paper-2">
          Course order <span aria-hidden>▾</span>
        </button>
      </div>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <span aria-hidden>🚩</span> Your priorities
        </h2>
        <p className="mt-1 text-sm text-muted">
          The topics where you&apos;re leaving the most marks on the table, ranked from your own answers.
        </p>
        <div className="mt-4 rounded-3xl border-2 border-dashed border-line bg-panel px-6 py-8 text-center">
          <p className="text-2xl" aria-hidden>🧞</p>
          <h3 className="mt-2 font-extrabold">See your priorities with Pro</h3>
          <a
            href="/your-plan"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
          >
            Upgrade to Pro
          </a>
        </div>
      </section>

      <section className="mt-10 overflow-x-auto rounded-2xl border-2 border-line">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="bg-paper-2 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-bold">Topic</th>
              <th className="px-2 py-3 font-bold">Grade</th>
              {SERIES.map((s) => (
                <th key={s} className="px-2 py-3 text-center font-bold">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((t) => (
              <tr key={t.slug} className="transition hover:bg-paper-2/60">
                <td className="max-w-64 truncate px-4 py-3 font-semibold">{t.title}</td>
                <td className="px-2 py-3 text-muted">{t.grade}</td>
                {SERIES.map((s) => (
                  <td key={s} className="px-2 py-2">
                    <span className={`mx-auto flex size-7 items-center justify-center rounded-md text-[10px] font-bold text-ink/70 ${CELL[intensity(t.slug, s)]}`}>
                      {intensity(t.slug, s) > 0 ? `${intensity(t.slug, s) * 2}` : ""}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="mt-4 text-xs text-muted">
        Intensity marks are recreation placeholders — real per-series data opens on the{" "}
        <a href={`${SITE.original}/gcse/maths/edexcel`} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
          original site ↗
        </a>.
      </p>
    </ResourceHubShell>
  );
}
