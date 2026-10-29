import Link from "next/link";

/**
 * Qualification switcher strip for the per-qualification Question Rush
 * pages — mirrors how the original exposes Rush globally per qualification
 * (/gcse/question-rush, /a-level/question-rush, …, research/features/04).
 */
const QUALS = [
  { key: "gcse", label: "GCSE", href: "/gcse/question-rush" },
  { key: "a-level", label: "A Level", href: "/a-level/question-rush" },
  { key: "as-level", label: "AS Level", href: "/as-level/question-rush" },
  { key: "igcse", label: "IGCSE", href: "/igcse/question-rush" },
  { key: "ks2", label: "KS2", href: "/ks2/question-rush" },
];

export default function RushQualSwitcher({ current }: { current: string }) {
  return (
    <nav aria-label="Question Rush qualifications" className="flex flex-wrap gap-1.5">
      {QUALS.map((q) =>
        q.key === current ? (
          <span
            key={q.key}
            aria-current="page"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
          >
            {q.label}
          </span>
        ) : (
          <Link
            key={q.key}
            href={q.href}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:bg-paper-2"
          >
            {q.label}
          </Link>
        ),
      )}
    </nav>
  );
}
