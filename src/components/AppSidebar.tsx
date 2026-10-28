"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SITE } from "@/lib/data";
import {
  IconBug,
  IconBugSmall,
  IconChat,
  IconChevron,
  IconCollapse,
  IconDots,
  IconGreens,
  IconHome,
  IconIdeas,
  IconOldSite,
  IconPlanner,
  IconRush,
  IconSurvey,
  IconWorksheets,
} from "@/components/SidebarIcons";

/**
 * App-style left rail, cloned from the original mathsgenie app shell:
 * 220px white rail, 2px right border (#f0f0f0), px-3/py-2, gap-0.5 rows of
 * rounded-xl gray nav items (40px tall, 24px solid icons), cyan/blue active
 * state, scroll fades, pinned footer with Ideas + Other/bug/collapse, and an
 * animated icon-only collapse (64px) persisted to localStorage.
 */

type Rail = { collapsed: boolean; width: number };

const EXPANDED = 220;
const COLLAPSED = 64;
const DEFAULT_RAIL: Rail = { collapsed: false, width: EXPANDED };
const RAIL_EVENT = "mg-rail-change";

let railSnapshot: Rail = DEFAULT_RAIL;
let railPrimed = false;

function primeRail(): Rail {
  if (!railPrimed && typeof window !== "undefined") {
    railPrimed = true;
    try {
      const collapsed = localStorage.getItem("mg-rail") === "collapsed";
      const w = Number(localStorage.getItem("mg-rail-width"));
      railSnapshot = {
        collapsed,
        width: Number.isFinite(w) && w >= 200 && w <= 320 ? w : EXPANDED,
      };
    } catch {}
  }
  return railSnapshot;
}

function subscribeRail(cb: () => void) {
  window.addEventListener(RAIL_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(RAIL_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function writeRail(patch: Partial<Rail>) {
  railSnapshot = { ...primeRail(), ...patch };
  try {
    localStorage.setItem("mg-rail", railSnapshot.collapsed ? "collapsed" : "open");
    localStorage.setItem("mg-rail-width", String(railSnapshot.width));
  } catch {}
  window.dispatchEvent(new CustomEvent("mg-rail", { detail: { collapsed: railSnapshot.collapsed } }));
  window.dispatchEvent(new Event(RAIL_EVENT));
}

const MAIN = [
  { label: "Home", href: "/", Icon: IconHome },
  { label: "Revision planner", href: "/features/revision-planner", Icon: IconPlanner },
  { label: "Ask Genie AI", href: "/ask-genie", genie: true as const },
  { label: "Worksheets", href: "/gcse/worksheets", Icon: IconWorksheets },
  { label: "Question Rush", href: "/gcse/question-rush", Icon: IconRush },
  { label: "Daily Greens", href: "/gcse/daily-greens", Icon: IconGreens },
];

const OTHER_ITEMS = [
  { label: "Old site", href: "https://old.mathsgenie.co.uk", Icon: IconOldSite },
  { label: "Chat with support", href: "https://github.com/SyllabAI/MathsGenie/discussions", Icon: IconChat },
  { label: "Report bug", href: "https://github.com/SyllabAI/MathsGenie/issues/new?labels=bug", Icon: IconBugSmall },
  { label: "Impact survey", href: "/impact-survey", Icon: IconSurvey },
];

function GenieAvatar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 2.6c2.9-2.9 8.9-1.1 9.3 3.4.3 3-1.2 4.6-1.2 6 0 1.4 1.4 2.6 1.2 5-.3 3.6-3.7 6.4-9.3 6.4s-9-2.8-9.3-6.4c-.2-2.4 1.2-3.6 1.2-5 0-1.4-1.5-3-1.2-6C3.1 1.5 9.1-.3 12 2.6Z"
        fill="#2fe4b7"
      />
      <circle cx="9.4" cy="12.4" r="1.5" fill="#14171c" />
      <circle cx="14.6" cy="12.4" r="1.5" fill="#14171c" />
      <path d="M9.5 16.2c1.5 1.2 3.5 1.2 5 0" stroke="#14171c" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const rail = useSyncExternalStore(subscribeRail, primeRail, () => DEFAULT_RAIL);
  const { collapsed, width } = rail;
  const [otherOpen, setOtherOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* announce state so the header can show the pin/expand button */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mg-rail", { detail: { collapsed } }));
  }, [collapsed]);

  /* header toggle request */
  useEffect(() => {
    const expand = () => writeRail({ collapsed: false });
    window.addEventListener("mg-rail-expand", expand);
    return () => window.removeEventListener("mg-rail-expand", expand);
  }, []);

  /* close the Other menu on outside click / Escape */
  useEffect(() => {
    if (!otherOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOtherOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOtherOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [otherOpen]);

  const updateFades = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setAtTop(el.scrollTop < 4);
    setAtBottom(el.scrollTop + el.clientHeight > el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(updateFades);
    return () => cancelAnimationFrame(id);
  }, [updateFades, collapsed]);

  /* drag-resize */
  const startResize = (e: React.PointerEvent) => {
    if (collapsed) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const move = (ev: PointerEvent) => {
      writeRail({ width: Math.min(320, Math.max(200, startW + ev.clientX - startX)) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const railWidth = collapsed ? COLLAPSED : width;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const rowCls = (active: boolean) =>
    `group/navitem relative flex w-full flex-none cursor-pointer items-center rounded-xl px-2 py-2 text-sm transition-colors ${
      active ? "bg-[#cefbff] text-accent" : "text-ink/60 hover:bg-paper-2 hover:text-ink"
    }`;

  return (
    <div
      className="sticky top-16 shrink-0 self-start transition-[width] duration-200 ease-out max-lg:hidden"
      style={{ width: railWidth, height: "calc(100dvh - 4rem)" }}
    >
      <aside
        id="app-desktop-sidebar"
        aria-label="Main navigation"
        className="absolute inset-y-0 left-0 flex flex-col overflow-hidden border-r-2 border-[#f0f0f0] bg-paper px-3 py-2 transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: railWidth }}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <nav
            ref={navRef}
            onScroll={updateFades}
            aria-label="Sections"
            className="no-scrollbar flex min-h-0 w-full flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
          >
            {MAIN.map(({ label, href, Icon, genie }) => {
              const active = isActive(href);
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={rowCls(active)}
                  title={collapsed ? label : undefined}
                >
                  {genie ? (
                    <GenieAvatar className="mr-2.5 size-6 shrink-0" />
                  ) : (
                    <Icon className="mr-2.5 size-6 shrink-0" />
                  )}
                  {collapsed ? null : (
                    <p className="min-w-0 flex-1 truncate whitespace-nowrap capitalize">{label}</p>
                  )}
                </Link>
              );
            })}
          </nav>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-paper to-transparent transition-opacity ${atTop ? "opacity-0" : "opacity-100"}`}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-paper to-transparent transition-opacity ${atBottom ? "opacity-0" : "opacity-100"}`}
          />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-0.5 pt-1">
          <Link
            href="/feature-requests"
            className={rowCls(isActive("/feature-requests"))}
            title={collapsed ? "Ideas + feedback" : undefined}
          >
            <IconIdeas className="mr-2.5 size-6 shrink-0" />
            {collapsed ? null : <p className="min-w-0 flex-1 truncate whitespace-nowrap capitalize">Ideas + feedback</p>}
          </Link>

          <div className="flex items-center gap-0.5">
            <div className="relative min-w-0 flex-1" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={otherOpen}
                onClick={() => setOtherOpen((v) => !v)}
                className={`flex w-full items-center rounded-xl px-2 py-2 text-left text-sm transition-colors ${
                  otherOpen ? "bg-paper-2 text-ink" : "text-ink/60 hover:bg-paper-2 hover:text-ink"
                }`}
              >
                <IconDots className="mr-2.5 size-6 shrink-0" />
                {collapsed ? null : (
                  <>
                    <p className="min-w-0 flex-1 truncate">Other</p>
                    <IconChevron
                      className={`size-4 shrink-0 text-ink/40 transition-transform ${otherOpen ? "rotate-180" : ""}`}
                    />
                  </>
                )}
              </button>

              {otherOpen && !collapsed && (
                <div
                  role="menu"
                  className="absolute bottom-12 left-0 z-30 w-56 rounded-2xl border-2 border-ink/10 bg-paper p-1 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
                >
                  {OTHER_ITEMS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      role="menuitem"
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper-2"
                    >
                      <Icon className="size-5 shrink-0 text-ink/70" />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {!collapsed && (
              <>
                <a
                  href="https://github.com/SyllabAI/MathsGenie/issues/new?labels=bug"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Report a bug"
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-ink/60 transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <IconBug className="size-5" />
                </a>
                <button
                  type="button"
                  onClick={() => writeRail({ collapsed: true })}
                  aria-label="Collapse sidebar"
                  className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-muted transition-colors hover:bg-ink/10 hover:text-ink"
                >
                  <IconCollapse className="size-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* drag handle */}
        {!collapsed && (
          <div
            aria-hidden
            onPointerDown={startResize}
            onDoubleClick={() => writeRail({ width: EXPANDED })}
            className="absolute inset-y-0 -right-1 z-20 w-2 cursor-col-resize"
          />
        )}
      </aside>
    </div>
  );
}
