import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/data";

type Topic = { slug: string; title: string; href: string };

/** Topic row list for a grade tab, mirroring the original's numbered topic rows. */
export function TopicList({ topics, board }: { topics: Topic[]; board: string }) {
  return (
    <ol className="grid gap-1.5 md:grid-cols-2">
      {topics.map((t, i) => (
        <li key={t.slug}>
          <Link
            href={`/gcse/maths/${board}/${t.slug}`}
            className="group -mx-2 flex items-center gap-4 rounded-3xl p-2.5 transition-colors hover:bg-paper-2 dark:hover:bg-night-2"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-sm font-bold text-muted group-hover:bg-accent-soft group-hover:text-accent dark:bg-night-3 dark:text-paper/60">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium group-hover:text-accent">
              {t.title}
            </span>
            <span
              className="shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Board cards grid (6 boards). */
export function BoardCards() {
  const boards: { slug: string; name: string; tint: string }[] = [
    { slug: "edexcel", name: "Edexcel", tint: "from-sky-500 to-sky-700" },
    { slug: "aqa", name: "AQA", tint: "from-rose-500 to-rose-700" },
    { slug: "ocr", name: "OCR", tint: "from-amber-500 to-amber-700" },
    { slug: "wjec", name: "WJEC", tint: "from-emerald-500 to-emerald-700" },
    { slug: "eduqas", name: "Eduqas", tint: "from-indigo-500 to-indigo-700" },
    { slug: "ccea", name: "CCEA", tint: "from-fuchsia-500 to-fuchsia-700" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {boards.map((b) => (
        <Link
          key={b.slug}
          href={`/gcse/maths/${b.slug}`}
          className="group overflow-hidden rounded-2xl border border-line bg-panel transition-shadow hover:shadow-md"
        >
          <div className={`flex h-20 items-end bg-gradient-to-br ${b.tint} p-3`}>
            <span className="font-hand text-2xl font-bold text-white drop-shadow">{b.name}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold">GCSE Maths</span>
            <Badge>Spec 1MA1</Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** FAQ accordion using native details, like the original's course-page FAQs. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
      {items.map((f) => (
        <details key={f.q} className="group px-4 py-3">
          <summary className="cursor-pointer list-none font-semibold marker:hidden">
            <span className="mr-2 inline-block text-accent transition-transform group-open:rotate-90">›</span>
            {f.q}
          </summary>
          <p className="mt-2 pl-5 text-sm leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Visible attribution note required on every page that links out. */
export function Attribution({ href }: { href?: string }) {
  return (
    <p className="mt-8 rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs leading-relaxed text-muted">
      Recreation note: original content belongs to MathsGenie and the awarding
      bodies. {href && (
        <>
          Live version:{" "}
          <a href={href} className="text-accent underline" rel="noopener noreferrer">
            {href.replace("https://www.mathsgenie.co.uk", "") || "/"}
          </a>
          .{" "}
        </>
      )}
      No copyrighted material is re-hosted in this project.
    </p>
  );
}
