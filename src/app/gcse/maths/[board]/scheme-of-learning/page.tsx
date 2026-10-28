import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceHubShell from "@/components/member/ResourceHubShell";
import { isBoard, loadTopics } from "@/lib/data";

export const metadata: Metadata = { title: "GCSE Maths Scheme of Learning" };

/**
 * /gcse/maths/[board]/scheme-of-learning — stage-by-stage course
 * (original pattern): numbered cyan stage circles, Lessons grid with
 * radio progress circles, Tests sub-list (Test A/B) per stage.
 */
export default async function SchemeOfLearningPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const grades = Object.keys(doc.grades);

  const tabs = [
    { label: "All resources", href: `/gcse/maths/${board}`, icon: "▦" },
    { label: "Worksheets", href: `/gcse/maths/${board}/worksheets`, icon: "🖨" },
    { label: "Question bank", href: `/gcse/maths/${board}/questions`, icon: "◉" },
    { label: "Scheme of learning", href: `/gcse/maths/${board}/scheme-of-learning`, icon: "🪜" },
    { label: "Flashcards", href: `/gcse/maths/${board}/flashcards`, icon: "🗂" },
    { label: "Videos", href: `/gcse/maths/${board}/videos`, icon: "▶" },
  ];

  return (
    <ResourceHubShell board={board} title="Scheme of learning" activeTab="Scheme of learning" tabs={tabs}>
      <div className="mt-8 space-y-8">
        {grades.map((g, idx) => (
          <section key={g} className="relative rounded-3xl border-2 border-line bg-panel p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-base font-extrabold text-white">
                {idx + 1}
              </span>
              <h2 className="text-xl font-extrabold">Stage {idx + 1}</h2>
              <span className="ml-auto text-xs text-muted">Grade {g} topics</span>
            </div>

            <h5 className="mt-5 text-xs font-bold uppercase tracking-wide text-muted">Lessons</h5>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {doc.grades[g].map((t) => (
                <Link
                  key={t.slug}
                  href={`/gcse/maths/${board}/${t.slug}/questions`}
                  className="flex items-center gap-3 rounded-xl border-2 border-line px-4 py-3 text-sm font-semibold transition hover:border-accent/60"
                >
                  <span className="size-5 shrink-0 rounded-full border-2 border-line" aria-hidden />
                  <span className="min-w-0 truncate">{t.title}</span>
                </Link>
              ))}
            </div>

            <h5 className="mt-5 text-xs font-bold uppercase tracking-wide text-muted">Tests</h5>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {["Test A", "Test B"].map((tst) => (
                <Link
                  key={tst}
                  href={`/gcse/maths/${board}/mock-exam-builder`}
                  className="flex items-center gap-3 rounded-xl border-2 border-line px-4 py-3 text-sm font-semibold transition hover:border-accent/60"
                >
                  <span className="size-5 shrink-0 rounded-full border-2 border-line" aria-hidden />
                  <span className="min-w-0 truncate">Stage {idx + 1} {tst}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ResourceHubShell>
  );
}
