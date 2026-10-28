import Link from "next/link";
import { isBoard, boardLabel, SITE } from "@/lib/data";

/**
 * Shared "resource hub" chrome matching the original member-era pages
 * (research/04-member-area.md §6): pink→violet→blue gradient hero band,
 * breadcrumb with "Spec 1MA1" tag, H1 + save button, and the resource
 * tab bar with active cyan underline + pin button.
 */

export type HubTab = { label: string; href: string; icon: string; active?: boolean };

const TAB_ICONS: Record<string, string> = {
  "All resources": "▦",
  Worksheets: "🖨",
  "Question bank": "◉",
  "Question Rush": "⏱",
  "Hot topics": "📊",
  "Scheme of learning": "🪜",
  "Grade calculator": "🎛",
  Videos: "▶",
  Lessons: "📖",
  Flashcards: "🗂",
  Papers: "📄",
  "Daily Greens": "🌿",
  "Teach Genie": "🧞",
  "Revision guides": "📘",
};

export default function ResourceHubShell({
  board,
  title,
  activeTab,
  tabs,
  children,
}: {
  board: string;
  title: string;
  activeTab: string;
  tabs: HubTab[];
  children: React.ReactNode;
}) {
  if (!isBoard(board)) return null;
  const shown = tabs.slice(0, 4);
  const rest = tabs.slice(4);

  return (
    <div>
      {/* gradient hero band */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#ffd3e0]/70 via-[#e9dcfd]/60 to-[#cfe6ff]/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-7 sm:px-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
            <Link href="/gcse" className="text-ink/60 hover:text-accent">GCSE</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <Link href={`/gcse/maths/${board}`} className="text-ink/60 hover:text-accent">
              Maths {boardLabel(board)}
            </Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">{title}</span>
            <span className="ml-auto hidden text-xs text-ink/50 sm:block">Spec 1MA1</span>
          </nav>
          <div className="mt-2 flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Maths {title}
            </h1>
            <button
              aria-label={`Save Maths to your subjects`}
              className="rounded-lg p-1.5 text-ink/50 transition hover:bg-white/60 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4.5L5 20V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* resource tab bar */}
          <div className="mt-4 flex items-end gap-1 overflow-x-auto text-sm font-semibold">
            {shown.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-[3px] px-3 py-2 transition ${
                  t.active || t.label === activeTab
                    ? "border-accent text-accent"
                    : "border-transparent text-ink/60 hover:text-ink"
                }`}
              >
                <span aria-hidden className="text-base leading-none">{t.icon ?? TAB_ICONS[t.label] ?? "•"}</span>
                {t.label}
              </Link>
            ))}
            {rest.length > 0 && (
              <details className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-1 whitespace-nowrap border-b-[3px] border-transparent px-3 py-2 text-ink/60 hover:text-ink">
                  <span aria-hidden>⋯</span> More resources
                </summary>
                <div className="absolute left-0 top-11 z-30 w-56 rounded-2xl border-2 border-ink/10 bg-paper p-1.5 shadow-xl">
                  {rest.map((t) => (
                    <Link
                      key={t.label}
                      href={t.href}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-paper-2"
                    >
                      <span aria-hidden>{t.icon ?? TAB_ICONS[t.label] ?? "•"}</span> {t.label}
                    </Link>
                  ))}
                </div>
              </details>
            )}
            <a
              href={`${SITE.original}/gcse/maths/${board}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hidden items-center gap-1 whitespace-nowrap rounded-full border-2 border-line bg-paper/70 px-3 py-1.5 text-xs font-semibold transition hover:bg-paper-2 sm:flex"
            >
              Open on original ↗
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">{children}</div>
    </div>
  );
}
