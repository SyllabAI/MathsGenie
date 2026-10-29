import Link from "next/link";
import { alevelHubTabs, ALEVEL_ORIGINAL_PATH } from "@/lib/alevel";

/**
 * A-Level twin of ResourceHubShell — same member-era chrome (gradient
 * hero band, breadcrumb with spec tag, H1 + tab bar with active cyan
 * underline) but for the A Level course: breadcrumb A Level › Maths
 * Edexcel, "Spec 9MA0", tabs from alevelHubTabs().
 */

const ICONS: Record<string, string> = {
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
  "Predicted papers": "🔮",
  "Daily Greens": "🌿",
  "Teach Genie": "🧞",
  "Revision guides": "📘",
  "Exam builder": "🧪",
  "Paper marker": "🖊",
  "Answer marking": "✍️",
};

export default function ALevelHubShell({
  title,
  activeTab,
  children,
  intro,
}: {
  title: string;
  activeTab: string;
  children: React.ReactNode;
  intro?: string;
}) {
  const tabs = alevelHubTabs(activeTab);
  const shown = tabs.slice(0, 5);
  const rest = tabs.slice(5);

  return (
    <div>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#ffd3e0]/70 via-[#e9dcfd]/60 to-[#cfe6ff]/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-7 sm:px-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
            <Link href="/a-level" className="text-ink/60 hover:text-accent">A Level</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <Link href={ALEVEL_ORIGINAL_PATH} className="text-ink/60 hover:text-accent">
              Maths Edexcel
            </Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-medium text-ink">{title}</span>
            <span className="ml-2 rounded-full border-2 border-line bg-paper/80 px-2.5 py-0.5 text-[11px] font-bold text-muted">
              Spec 9MA0
            </span>
          </nav>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-title text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
            <span className="rounded-full border-2 border-line bg-paper/80 px-3.5 py-1.5 text-xs font-bold text-muted">
              Save Maths to your subjects
            </span>
          </div>
          {intro && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">{intro}</p>}
        </div>
      </div>

      {/* tab bar */}
      <div className="sticky top-0 z-30 border-b-2 border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
          {shown.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              aria-current={activeTab === t.label ? "page" : undefined}
              className={`flex flex-none items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-semibold transition ${
                activeTab === t.label
                  ? "border-accent text-accent"
                  : "border-transparent text-ink/55 hover:text-ink"
              } ${t.external ? "pr-1" : ""}`}
            >
              <span aria-hidden>{ICONS[t.label] ?? t.icon}</span>
              {t.label}
            </Link>
          ))}
          {rest.length > 0 && (
            <details className="relative flex-none">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-ink/55 transition hover:text-ink">
                More <span aria-hidden>▾</span>
              </summary>
              <div className="absolute right-0 top-12 z-40 w-56 rounded-2xl border-2 border-line bg-paper p-1.5 shadow-xl">
                {rest.map((t) => (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-paper-2"
                  >
                    <span aria-hidden>{ICONS[t.label] ?? t.icon}</span>
                    {t.label}
                  </Link>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
