import Link from "next/link";
import { alevelHubTabs, alevelTopics, ALEVEL_ORIGINAL_PATH, alevelOriginalUrl } from "@/lib/alevel";

export type ALevelTab = { label: string; href: string; icon: string; external?: boolean };

const TAB_ICONS: Record<string, string> = {
  "All resources": "▦",
  "Question bank": "◉",
  Worksheets: "🖨",
  Papers: "📄",
  "Revision Guides": "📘",
  Lessons: "📖",
  Videos: "▶",
  Flashcards: "🗂",
  "Exam builder": "🧪",
  "Paper marker": "🖊",
  "Teach Genie": "🧞",
  "Grade calculator": "🎛",
  "Daily Greens": "🌿",
};

const tabClass = (active: boolean) =>
  `flex items-center gap-1.5 whitespace-nowrap border-b-[3px] px-3 py-2 transition ${
    active ? "border-accent text-accent" : "border-transparent text-ink/60 hover:text-ink"
  }`;

/**
 * Shared A-Level course chrome, mirroring the original member-era course
 * pages (research/04-member-area.md §6, observed live 2026-10-29): pastel
 * gradient hero band, breadcrumb with the "Spec 9MA0" tag, H1 and the
 * resource tab bar with active cyan underline. Tabs pointing at this
 * recreation stay internal; the rest link out to the original.
 */
export default function ALevelHubShell({
  title,
  activeTab,
  heading,
  extraCrumb,
  children,
}: {
  title: string;
  activeTab: string;
  /** Override the H1 (defaults to `Maths {title}` like the original). */
  heading?: string;
  /** Extra breadcrumb segment between the course root and this page. */
  extraCrumb?: { label: string; href?: string };
  children: React.ReactNode;
}) {
  const tabs: ALevelTab[] = alevelHubTabs(activeTab);
  const shown = tabs.slice(0, 5);
  const rest = tabs.slice(5);

  return (
    <div>
      {/* gradient hero band */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#ffd3e0]/70 via-[#e9dcfd]/60 to-[#cfe6ff]/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-7 sm:px-6">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
            <Link href="/" className="text-ink/60 hover:text-accent">A Level</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <Link href={ALEVEL_ORIGINAL_PATH} className="text-ink/60 hover:text-accent">
              Maths Edexcel
            </Link>
            {extraCrumb && (
              <>
                <span className="text-ink/40" aria-hidden>›</span>
                {extraCrumb.href ? (
                  <Link href={extraCrumb.href} className="text-ink/60 hover:text-accent">
                    {extraCrumb.label}
                  </Link>
                ) : (
                  <span className="text-ink/60">{extraCrumb.label}</span>
                )}
              </>
            )}
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">{title}</span>
            <span className="ml-auto hidden text-xs text-ink/50 sm:block">
              Spec {alevelTopics.spec}
            </span>
          </nav>
          <div className="mt-2 flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight">{heading ?? `Maths ${title}`}</h1>
          </div>

          {/* resource tab bar */}
          <div className="mt-4 flex items-end gap-1 overflow-x-auto text-sm font-semibold">
            {shown.map((t) =>
              t.external ? (
                <a
                  key={t.label}
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tabClass(t.label === activeTab)}
                >
                  <span aria-hidden className="text-base leading-none">{t.icon ?? TAB_ICONS[t.label] ?? "•"}</span>
                  {t.label}
                </a>
              ) : (
                <Link key={t.label} href={t.href} className={tabClass(t.label === activeTab)}>
                  <span aria-hidden className="text-base leading-none">{t.icon ?? TAB_ICONS[t.label] ?? "•"}</span>
                  {t.label}
                </Link>
              ),
            )}
            {rest.length > 0 && (
              <details className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-1 whitespace-nowrap border-b-[3px] border-transparent px-3 py-2 text-ink/60 hover:text-ink">
                  <span aria-hidden>⋯</span> More resources
                </summary>
                <div className="absolute left-0 top-11 z-30 w-56 rounded-2xl border-2 border-ink/10 bg-paper p-1.5 shadow-xl">
                  {rest.map((t) =>
                    t.external ? (
                      <a
                        key={t.label}
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-paper-2"
                      >
                        <span aria-hidden>{t.icon ?? TAB_ICONS[t.label] ?? "•"}</span> {t.label} ↗
                      </a>
                    ) : (
                      <Link
                        key={t.label}
                        href={t.href}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-paper-2"
                      >
                        <span aria-hidden>{t.icon ?? TAB_ICONS[t.label] ?? "•"}</span> {t.label}
                      </Link>
                    ),
                  )}
                </div>
              </details>
            )}
            <a
              href={alevelOriginalUrl(ALEVEL_ORIGINAL_PATH)}
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
