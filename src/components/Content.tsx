import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/data";

type Topic = { slug: string; title: string; href: string };

/** Topic row list for a grade tab, mirroring the original's numbered topic rows. */
export function TopicList({ topics, board }: { topics: Topic[]; board: string }) {
  return (
    <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
      {topics.map((t, i) => (
        <li key={t.slug} className="group flex items-center gap-3 px-4 py-3 hover:bg-paper-2">
          <span className="w-7 shrink-0 text-center text-sm font-semibold text-muted">{i + 1}</span>
          <Link href={`/gcse/maths/${board}/${t.slug}`} className="flex-1 font-medium group-hover:text-accent">
            {t.title}
          </Link>
          <Link
            href={`/gcse/maths/${board}/${t.slug}`}
            className="rounded-full border border-line px-3 py-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
          >
            Open
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Mode cards grid on topic pages (questions / videos / revision / flashcards…). */
export function ModeCards({
  board,
  topic,
  originalHref,
}: {
  board: string;
  topic: string;
  originalHref: string;
}) {
  const base = `/gcse/maths/${board}/${topic}`;
  const modes: { label: string; desc: string; href: string; icon: ReactNode; outbound?: boolean }[] = [
    {
      label: "Questions",
      desc: "Exam-style question bank",
      href: `${base}/questions`,
      icon: "❓",
    },
    {
      label: "Videos",
      desc: "Topic walkthroughs on the original",
      href: `${SITE.original}${originalHref}/videos`,
      icon: "▶",
      outbound: true,
    },
    {
      label: "Revision notes",
      desc: "Topic-by-topic notes on the original",
      href: `${SITE.original}${originalHref}/revision-guides`,
      icon: "📝",
      outbound: true,
    },
    {
      label: "Flashcards",
      desc: "Active recall on the original",
      href: `${SITE.original}${originalHref}/flashcards`,
      icon: "🃏",
      outbound: true,
    },
    {
      label: "Question Rush",
      desc: "Timed drill for this topic",
      href: `${base}/questions#rush`,
      icon: "⚡",
    },
    {
      label: "Mock exam builder",
      desc: "Compose a custom paper",
      href: `/gcse/maths/${board}/mock-exam-builder?topic=${encodeURIComponent(topic)}`,
      icon: "🧩",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {modes.map((m) => (
        <a
          key={m.label}
          href={m.href}
          target={m.outbound ? "_blank" : undefined}
          rel={m.outbound ? "noopener noreferrer" : undefined}
          className="group rounded-2xl border border-line bg-panel p-4 transition-shadow hover:shadow-md"
        >
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-paper-2 text-lg group-hover:bg-accent-soft">
            {m.icon}
          </div>
          <p className="font-semibold group-hover:text-accent">
            {m.label}
            {m.outbound && <span className="ml-1 text-xs text-muted">↗</span>}
          </p>
          <p className="mt-0.5 text-xs text-muted">{m.desc}</p>
        </a>
      ))}
    </div>
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
