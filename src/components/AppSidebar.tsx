"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  IconBug,
  IconBugSmall,
  IconChat,
  IconChevron,
  IconCollapse,
  IconDots,
  IconGreens,
  IconHome,
  IconHomework,
  IconIdeas,
  IconLessons,
  IconOldSite,
  IconSettings,
  IconSurvey,
  IconTests,
  IconUpgrade,
  IconVideos,
  IconWorksheets,
} from "@/components/SidebarIcons";

/**
 * App-style left rail, cloned from the original mathsgenie member shell
 * (see research/04-member-area.md §3 and research/09 §sidebar):
 * 220px white rail, 2px right border #f0f0f0, px-3/py-2, gap-0.5 rows of
 * rounded-xl 40px items, 24px icons, 16px labels, active state
 * #CEFBFF bg / #1CB0F6 text, purple Upgrade row, pinned footer with
 * Upgrade / Ideas / Settings / Other + bug + collapse, scroll fades,
 * animated icon-only collapse (64px) persisted to localStorage.
 *
 * Rail-mode polish (this revision):
 *  - custom dark hover tooltips (native `title` removed) — rendered with
 *    fixed positioning because the aside itself clips overflowing content;
 *  - the "Other" disclosure group opens as a flyout to the RIGHT of the
 *    rail when collapsed instead of being suppressed;
 *  - collapse/expand transitions stay 200ms ease-out, persisted state.
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

/* exact nav of the original logged-in rail (order matters) */
const MAIN = [
  { label: "Home", href: "/classrooms", Icon: IconHome },
  { label: "Daily Greens", href: "/gcse/daily-greens", Icon: IconGreens },
  { label: "Worksheets", href: "/gcse/worksheets", Icon: IconWorksheets },
  { label: "Videos", href: "/gcse/videos", Icon: IconVideos },
  { label: "Lessons", href: "/gcse/lessons", Icon: IconLessons },
  { label: "Homework", href: "/classrooms/homework", Icon: IconHomework },
  { label: "Tests", href: "/classrooms/test", Icon: IconTests },
];

const OTHER_ITEMS = [
  { label: "Old site", href: "https://old.mathsgenie.co.uk", Icon: IconOldSite },
  { label: "Chat with support", href: "https://github.com/SyllabAI/MathsGenie/discussions", Icon: IconChat },
  { label: "Report bug", href: "https://github.com/SyllabAI/MathsGenie/issues/new?labels=bug", Icon: IconBugSmall },
  { label: "Impact survey", href: "/impact-survey", Icon: IconSurvey },
];

export default function AppSidebar() {
  const pathname = usePathname();
  /* focus mode (question player /questions/qN): the original drops the app
     rail entirely and the player renders its own 64px context rail.
     NOTE: the early return lives after every hook (rules of hooks). */
  const rail = useSyncExternalStore(subscribeRail, primeRail, () => DEFAULT_RAIL);
  const { collapsed, width } = rail;
  const [otherOpen, setOtherOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);
  /* rail-mode hover tooltip: fixed-position, one instance for the whole rail */
  const [tip, setTip] = useState<{ label: string; top: number } | null>(null);
  const [otherBtnTop, setOtherBtnTop] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const otherBtnRef = useRef<HTMLButtonElement>(null);

  /* announce state so the header can show the pin/expand button */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mg-rail", { detail: { collapsed } }));
  }, [collapsed]);

  /* header toggle request — also clears transient rail UI here (instead of a
     collapsed-watching effect, which would setState synchronously in an effect) */
  useEffect(() => {
    const expand = () => {
      setTip(null);
      setOtherOpen(false);
      writeRail({ collapsed: false });
    };
    window.addEventListener("mg-rail-expand", expand);
    return () => window.removeEventListener("mg-rail-expand", expand);
  }, []);

  /* close the Other menu on outside click / Escape */
  useEffect(() => {
    if (!otherOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(t) &&
        otherBtnRef.current && !otherBtnRef.current.contains(t)
      ) {
        setOtherOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOtherOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [otherOpen]);

  /* close the rail tooltip when the pointer leaves the rail entirely */
  useEffect(() => {
    if (!tip) return;
    const clear = () => setTip(null);
    window.addEventListener("scroll", clear, { passive: true });
    return () => window.removeEventListener("scroll", clear);
  }, [tip]);

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
  const isActive = (href: string) => {
    if (href === "/classrooms") {
      return pathname === "/classrooms" ||
        (pathname.startsWith("/classrooms/") && !pathname.startsWith("/classrooms/homework") && !pathname.startsWith("/classrooms/test"));
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* focus route — bail out AFTER all hooks (see note above) */
  if (pathname && /\/gcse\/maths\/[^/]+\/[^/]+\/questions\/q\d+$/.test(pathname)) return null;

  /* rail-mode tooltip handlers (fixed positioning escapes the clipped aside) */
  const tipProps = (label: string) =>
    collapsed
      ? {
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
            setTip({ label, top: e.currentTarget.getBoundingClientRect().top }),
          onMouseLeave: () => setTip(null),
          onFocus: (e: React.FocusEvent<HTMLElement>) =>
            setTip({ label, top: e.currentTarget.getBoundingClientRect().top }),
          onBlur: () => setTip(null),
        }
      : {};

  const rowCls = (active: boolean) =>
    `group/navitem relative flex w-full flex-none cursor-pointer items-center rounded-xl px-2 py-2 text-base transition-colors ${
      active ? "bg-[#cefbff] text-[#1cb0f6]" : "text-ink/60 hover:bg-paper-2 hover:text-ink"
    }`;

  const iconCls = (active: boolean) =>
    `mr-2.5 size-6 shrink-0 ${active ? "" : "text-ink/60 opacity-60 group-hover/navitem:opacity-100"} ${
      collapsed ? "mr-0" : ""
    }`;

  return (
    <div
      className="sticky top-[66px] shrink-0 self-start transition-[width] duration-200 ease-out max-lg:hidden"
      style={{ width: railWidth, height: "calc(100dvh - 66px)" }}
    >
      <aside
        id="app-desktop-sidebar"
        aria-label="Main navigation"
        data-slot="pinnable-rail"
        data-rail-collapsed={collapsed ? "" : undefined}
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
            {MAIN.map(({ label, href, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  className={rowCls(active) + (collapsed ? " justify-center" : "")}
                  {...tipProps(label)}
                >
                  <Icon className={iconCls(active)} />
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
            href="/your-plan"
            aria-label={collapsed ? "Upgrade" : undefined}
            className="group/navitem relative flex w-full flex-none cursor-pointer items-center rounded-xl px-2 py-2 text-base text-[#9133ea] transition-colors hover:bg-[#f6ecfd]"
            {...tipProps("Upgrade")}
          >
            <IconUpgrade className={iconCls(false)} />
            {collapsed ? null : <p className="min-w-0 flex-1 truncate whitespace-nowrap capitalize">Upgrade</p>}
          </Link>

          <Link
            href="/feature-requests"
            aria-label={collapsed ? "Ideas + feedback" : undefined}
            className={rowCls(isActive("/feature-requests")) + (collapsed ? " justify-center" : "")}
            {...tipProps("Ideas + feedback")}
          >
            <IconIdeas className={iconCls(isActive("/feature-requests"))} />
            {collapsed ? null : <p className="min-w-0 flex-1 truncate whitespace-nowrap capitalize">Ideas + feedback</p>}
          </Link>

          <Link
            href="/settings/account"
            aria-label={collapsed ? "Settings" : undefined}
            className={rowCls(isActive("/settings")) + (collapsed ? " justify-center" : "")}
            {...tipProps("Settings")}
          >
            <IconSettings className={iconCls(isActive("/settings"))} />
            {collapsed ? null : <p className="min-w-0 flex-1 truncate whitespace-nowrap capitalize">Settings</p>}
          </Link>

          <div className="flex items-center gap-0.5">
            <button
              ref={otherBtnRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={otherOpen}
              aria-label="Other"
              onClick={() => {
                const rect = otherBtnRef.current?.getBoundingClientRect();
                if (rect) setOtherBtnTop(rect.top);
                setOtherOpen((v) => !v);
              }}
              className={
                `flex items-center rounded-xl px-2 py-2 text-left text-base transition-colors ${
                  otherOpen ? "bg-paper-2 text-ink" : "text-ink/60 hover:bg-paper-2 hover:text-ink"
                } ` + (collapsed ? "w-full justify-center" : "w-full min-w-0 flex-1")
              }
              {...tipProps("Other")}
            >
              <IconDots className={collapsed ? "size-6 shrink-0 text-ink/60" : "mr-2.5 size-6 shrink-0 text-ink/60 opacity-60"} />
              {collapsed ? null : (
                <>
                  <p className="min-w-0 flex-1 truncate">Other</p>
                  <IconChevron
                    className={`size-5 shrink-0 text-ink/40 opacity-60 transition-transform ${otherOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {!collapsed && (
              <>
                <a
                  href="https://github.com/SyllabAI/MathsGenie/issues/new?labels=bug"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Report a bug"
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-ink/60 transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <IconBug className="size-5 text-ink/60 opacity-60" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setTip(null);
                    setOtherOpen(false);
                    writeRail({ collapsed: true });
                  }}
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

      {/* "Other" flyout — expanded: anchored above the button inside the rail;
          collapsed: fixed flyout to the RIGHT of the rail (aside clips absolute
          children, so rail mode renders it outside). */}
      {otherOpen && !collapsed && (
        <div
          role="menu"
          ref={menuRef}
          className="mg-pop mg-pop-left absolute bottom-14 left-3 z-30 w-52 rounded-2xl border-2 border-ink/10 bg-paper p-1 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
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
      {otherOpen && collapsed && (
        <div
          role="menu"
          ref={menuRef}
          className="mg-pop mg-pop-left fixed z-50 w-52 rounded-2xl border-2 border-ink/10 bg-paper p-1 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          style={{ left: railWidth + 10, top: Math.max(8, otherBtnTop - 8) }}
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

      {/* rail-mode hover tooltip */}
      {collapsed && tip && (
        <div
          role="tooltip"
          aria-hidden
          className="mg-pop pointer-events-none fixed z-[60] whitespace-nowrap rounded-xl bg-ink px-2.5 py-1.5 text-xs font-semibold text-paper shadow-lg"
          style={{ left: railWidth + 10, top: tip.top + 6 }}
        >
          {tip.label}
        </div>
      )}
    </div>
  );
}
