import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { Badge, TierPill } from "@/components/ui/Badge";
import { isBoard, boardLabel, loadTopics, gradeTabs, SITE, type TopicsDoc } from "@/lib/data";

const HUB_META: Record<
  string,
  { title: string; desc: string; outboundPath: (slug: string) => string }
> = {
  worksheets: {
    title: "Worksheets",
    desc: "Downloadable exam booklets grouped by grade and topic. The original serves printable PDFs — these links open them there.",
    outboundPath: (slug) => `/gcse/maths/edexcel/${slug}/questions`,
  },
  "revision-guides": {
    title: "Revision Guides",
    desc: "Topic-by-topic notes with worked examples. Links open the original's guide for each topic.",
    outboundPath: (slug) => `/gcse/maths/edexcel/${slug}/revision-guides`,
  },
  lessons: {
    title: "Lessons",
    desc: "Interactive bite-sized lessons per topic, hosted on the original.",
    outboundPath: (slug) => `/gcse/maths/edexcel/${slug}`,
  },
  videos: {
    title: "Videos",
    desc: "Topic-by-topic video walkthroughs. Links open the original's video page for each topic.",
    outboundPath: (slug) => `/gcse/maths/edexcel/${slug}/videos`,
  },
  flashcards: {
    title: "Flashcards",
    desc: "Active-recall flashcard decks per topic, hosted on the original.",
    outboundPath: (slug) => `/gcse/maths/edexcel/${slug}/flashcards`,
  },
};

export function HubMeta(mode: string) {
  return HUB_META[mode] ?? HUB_META.worksheets;
}

export default async function HubPage({
  board,
  mode,
  tier,
}: {
  board: string;
  mode: string;
  tier?: string;
}) {
  if (!isBoard(board)) notFound();
  const meta = HUB_META[mode];
  if (!meta) notFound();
  const doc: TopicsDoc = await loadTopics(board);
  const tabs = gradeTabs(doc);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/gcse" className="hover:text-accent">GCSE</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/gcse/maths/${board}`} className="hover:text-accent">{boardLabel(board)}</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">{meta.title}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-hand text-5xl font-bold">{boardLabel(board)} {meta.title}</h1>
        {tier && <TierPill tier={tier === "foundation" ? "F" : "H"} />}
      </div>
      <p className="mt-2 max-w-3xl text-muted">{meta.desc}</p>

      <div className="mt-10 space-y-10">
        {tabs.map((g) => (
          <section key={g}>
            <h2 className="font-hand text-3xl font-bold">Grade {g}</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {doc.grades[g].map((t) => (
                <div key={t.slug} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-panel px-4 py-2.5">
                  <span className="truncate text-sm font-medium">{t.title}</span>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/gcse/maths/${board}/${t.slug}`}
                      className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper hover:opacity-90"
                    >
                      Topic page
                    </Link>
                    <a
                      href={`${SITE.original}${meta.outboundPath(t.slug).replace("edexcel", board)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:bg-paper-2"
                    >
                      Original ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8">
        <Badge>{doc.topic_count} topics · catalog parsed {new Date().toISOString().slice(0, 10)}</Badge>
      </div>

      <Attribution href={`${SITE.original}/gcse/maths/${board}/${mode}`} />
    </div>
  );
}
