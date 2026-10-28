import type { Metadata } from "next";
import Link from "next/link";
import { Attribution } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";
import { catalog, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Edexcel A Level Maths Revision",
  description: "44 A-Level Maths topics organised by module — recreated from the parsed Edexcel course catalog.",
};

const MODULE_ORDER = [
  "AS Pure Mathematics",
  "Pure Mathematics Year 1",
  "Pure Mathematics Year 2",
  "AS Statistics",
  "Statistics Year 1",
  "Statistics Year 2",
  "AS Mechanics",
  "Mechanics Year 1",
  "Mechanics Year 2",
];

export default function ALevelEdexcelPage() {
  const doc = catalog.alevelEdexcel;
  const modules = MODULE_ORDER.filter((m) => doc.modules[m]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">A Level</span>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">Maths · Edexcel</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-hand text-5xl font-bold">Edexcel A Level Maths</h1>
        <Badge tone="accent">New spec</Badge>
      </div>
      <p className="mt-2 max-w-3xl text-muted">
        {doc.topic_count} topics across pure mathematics, statistics and mechanics —
        classified from the original&apos;s own slug structure
        ({"topic slugs embed the module and chapter"}). The old spec (9371,
        C1–C4/S1/M1) still lives on the original site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <a href={`${SITE.original}/a-level/maths/edexcel/papers`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line bg-panel px-4 py-1.5 font-medium hover:bg-paper-2">
          A-Level past papers ↗
        </a>
        <a href={`${SITE.original}/a-level/question-rush`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line bg-panel px-4 py-1.5 font-medium hover:bg-paper-2">
          A-Level Question Rush ↗
        </a>
        <a href={`${SITE.original}/a-level/daily-greens`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line bg-panel px-4 py-1.5 font-medium hover:bg-paper-2">
          A-Level Daily Greens ↗
        </a>
      </div>

      <div className="mt-10 space-y-10">
        {modules.map((mod) => (
          <section key={mod}>
            <h2 className="font-hand text-3xl font-bold">{mod}</h2>
            <p className="text-sm text-muted">{doc.modules[mod].length} topics</p>
            <ol className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
              {doc.modules[mod].map((t, i) => (
                <li key={t.slug} className="flex items-center gap-3 px-4 py-3 hover:bg-paper-2">
                  <span className="w-7 shrink-0 text-center text-sm font-semibold text-muted">{i + 1}</span>
                  <span className="flex-1 font-medium">{t.title}</span>
                  <a
                    href={`${SITE.original}${t.href}/questions`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:bg-paper-2"
                  >
                    Questions ↗
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <Attribution href={`${SITE.original}/a-level/maths/edexcel`} />
    </div>
  );
}
