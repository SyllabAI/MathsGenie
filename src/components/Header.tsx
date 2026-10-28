"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { coursesByQualification, SITE } from "@/lib/data";

const FLYOUT = [
  { label: "GCSE", href: "/gcse" },
  { label: "A Level", href: "/a-level/maths/edexcel" },
  { label: "AS Level", href: `${SITE.original}/aslevel.php` },
  { label: "IGCSE", href: `${SITE.original}/igcse.php` },
  { label: "KS2", href: `${SITE.original}/primary.php` },
  { label: "International A Level", href: `${SITE.original}/newalevel.php` },
  { label: "International AS Level", href: `${SITE.original}/newalevel.php` },
];

const FEATURES = [
  { label: "Question bank", href: "/gcse/maths/edexcel/questions", desc: "Practice questions with AI feedback" },
  { label: "Question Rush", href: "/gcse/question-rush", desc: "Race the clock on quick-fire questions" },
  { label: "Daily Greens", href: "/gcse/daily-greens", desc: "A daily bite of revision" },
  { label: "Hot topics", href: "/gcse/maths/edexcel/topic-heatmap", desc: "Topics that come up most in real papers" },
  { label: "Scheme of learning", href: "/gcse/maths/edexcel/scheme-of-learning", desc: "A stage-by-stage course" },
  { label: "Teach Genie", href: "/gcse/maths/edexcel/teach-genie", desc: "Learn by teaching Baby Genie" },
  { label: "Mock exam builder", href: "/gcse/maths/edexcel/mock-exam-builder", desc: "Build a custom paper" },
  { label: "Grade calculator", href: "/gcse/maths/edexcel/predicted-grade-calculator", desc: "Predict your final grade" },
  { label: "Revision planner", href: "/features/revision-planner", desc: "Plan your revision schedule" },
];

/** Teal genie blob in a black rounded tile — original logo, drawn from scratch. */
function LogoMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-[10px] bg-ink-solid">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path
          d="M12 3.6c.9-.9 2.3-.4 2.5.7 2.4.6 4.1 2.6 4.1 5 0 1.2-.4 2.3-1.1 3.2.4.5.6 1.1.6 1.7 0 1.7-1.5 3-3.4 3h-5.4c-1.9 0-3.4-1.3-3.4-3 0-.6.2-1.2.6-1.7C5.8 11.6 5.4 10.5 5.4 9.3c0-2.4 1.7-4.4 4.1-5 .2-1.1 1.6-1.6 2.5-.7Z"
          fill="#2fe4b7"
        />
        <circle cx="9.8" cy="10.2" r="1.5" fill="#0a0a0a" />
        <circle cx="14.2" cy="10.2" r="1.5" fill="#0a0a0a" />
        <path d="M9.6 13.6c1.5 1.1 3.3 1.1 4.8 0" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

/* ---------------- welcome-offer banner (dismissible, countdown) --------- */
function OfferBanner() {
  const [hidden, setHidden] = useState(true);
  const [left, setLeft] = useState("");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let dismissed = false;
      try {
        dismissed = localStorage.getItem("mg-offer-dismissed") === "1";
      } catch {}
      if (!dismissed) {
        setHidden(false);
        const end = new Date(Date.now() + 4 * 864e5 + 5 * 36e5 + 16 * 6e4).getTime();
        const tick = () => {
          const ms = Math.max(0, end - Date.now());
          const d = Math.floor(ms / 864e5);
          const h = Math.floor((ms % 864e5) / 36e5);
          const m = Math.floor((ms % 36e5) / 6e4);
          const s = Math.floor((ms % 6e4) / 1e3);
          setLeft(`${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
        };
        tick();
        const id = setInterval(tick, 1000);
        cleanupTimer = () => clearInterval(id);
      }
    });
    let cleanupTimer: (() => void) | undefined;
    return () => {
      cancelAnimationFrame(raf);
      cleanupTimer?.();
    };
  }, []);

  const dismiss = () => {
    setHidden(true);
    try { localStorage.setItem("mg-offer-dismissed", "1"); } catch {}
  };

  if (hidden) return null;
  return (
    <div className="relative z-40 flex h-11 items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 px-10 text-sm text-white">
      <span aria-hidden>🎓</span>
      <span className="font-semibold">Welcome offer</span>
      <span className="rounded-md bg-white/15 px-1.5 py-0.5 font-bold">40% off</span>
      <span className="tabular-nums text-white/90">{left}</span>
      <Link
        href="/your-plan"
        className="rounded-full bg-yellow-300 px-3.5 py-1 text-xs font-bold text-blue-950 transition hover:bg-yellow-200"
      >
        Get 40% off
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss offer"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ---------------- member HUD (XP / energy / streak / avatar) ------------ */
const HUD = {
  xp: 3,
  rank: "Unranked",
  xpToNext: 72,
  energy: 15,
  energyMax: 20,
  streak: 4,
  week: [
    { d: "M", done: true },
    { d: "T", done: true },
    { d: "W", done: false },
    { d: "T", done: false },
    { d: "F", done: false },
    { d: "S", done: false },
    { d: "S", done: false },
  ],
  leaders: [
    { name: "@ck_25", s: 76 },
    { name: "@nebularoar", s: 55 },
    { name: "@faylinn", s: 51 },
    { name: "@cosmofly", s: 47 },
    { name: "@aclimb", s: 44 },
  ],
  user: { name: "nawaf al hussain khondokar", joined: "Joined 6 days ago" },
};

function Avatar() {
  /* genie-face avatar like the original (teal face, red hat) */
  return (
    <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-sky-400 ring-2 ring-white">
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
        <path d="M12 5.2c3.6 0 6.2 2.5 6.2 6.2 0 1.5-.4 2.7-1.1 3.7H6.9c-.7-1-1.1-2.2-1.1-3.7 0-3.7 2.6-6.2 6.2-6.2Z" fill="#5cc1ea" />
        <path d="M4.5 9.5C4.5 6 7.9 3 12 3s7.5 3 7.5 6.5c0 .8-.6 1.4-1.4 1.4H5.9c-.8 0-1.4-.6-1.4-1.4Z" fill="#e7000b" />
        <circle cx="9.6" cy="12.6" r="1.1" fill="#0a0a0a" />
        <circle cx="14.4" cy="12.6" r="1.1" fill="#0a0a0a" />
        <path d="M9.8 15.6c1.4 1 3 1 4.4 0" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

type Pop = null | "xp" | "energy" | "streak" | "profile";

function MemberHud() {
  const [pop, setPop] = useState<Pop>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPop(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative flex items-center gap-1" ref={ref}>
      <button
        className="relative hidden size-9 items-center justify-center rounded-full transition hover:bg-paper-2 sm:flex"
        aria-label="Updates (5)"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 19a2.2 2.2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[#e7000b] text-[10px] font-bold text-white">
          5
        </span>
      </button>

      <button
        onClick={() => setPop(pop === "xp" ? null : "xp")}
        aria-label="3 XP"
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition hover:bg-paper-2"
      >
        <svg viewBox="0 0 24 24" className="size-4 text-[#a560ff]" fill="currentColor" aria-hidden>
          <path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6L12 2z" />
        </svg>
        {HUD.xp}XP
      </button>

      <button
        onClick={() => setPop(pop === "energy" ? null : "energy")}
        aria-label="15 energy left"
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition hover:bg-paper-2"
      >
        <svg viewBox="0 0 24 24" className="size-4 text-[#ff2e9a]" fill="currentColor" aria-hidden>
          <path d="M13 2 4.5 13.5c-.3.4 0 .9.5.9H11l-1 7.6 8.6-11.5c.3-.4 0-.9-.5-.9H13l1-7.6z" />
        </svg>
        {HUD.energy}
      </button>

      <button
        onClick={() => setPop(pop === "streak" ? null : "streak")}
        aria-label="4 day streak"
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-bold transition hover:bg-paper-2"
      >
        <svg viewBox="0 0 24 24" className="size-4 text-[#ff9600]" fill="currentColor" aria-hidden>
          <path d="M12.6 2.3c.2 2.6-.8 4.1-2.2 5.6-1.2 1.3-2.6 2.8-2.9 5.3-.5-.4-1-1.2-1.2-2.2-1.5 1.4-2.8 3.4-2.8 5.6 0 3.9 3.4 7 8.5 7s8.5-3.1 8.5-7c0-5.5-4.6-7.6-5.6-12.1-.9.3-1.9 1.4-2.3 2.8z" />
        </svg>
        {HUD.streak}
      </button>

      <button
        onClick={() => setPop(pop === "profile" ? null : "profile")}
        aria-label="Profile avatar"
        className="ml-0.5"
      >
        <Avatar />
      </button>

      {/* popovers */}
      {pop === "xp" && (
        <Popover>
          <p className="text-lg font-bold">{HUD.xp} XP</p>
          <p className="text-sm text-muted">{HUD.rank}</p>
          <p className="mt-1 text-xs text-muted">{HUD.xpToNext} XP to Bronze III</p>
          <div className="mt-3 rounded-xl bg-paper-2 p-3">
            <p className="flex justify-between text-xs text-muted">
              <span>Study time today</span>
              <span className="font-semibold text-ink">0m</span>
            </p>
            <div className="mt-2 flex gap-1">
              <div className="h-1.5 flex-1 rounded-full bg-accent/30" />
              <div className="h-1.5 flex-1 rounded-full bg-accent/60" />
              <div className="h-1.5 flex-1 rounded-full bg-accent" />
            </div>
            <p className="mt-1.5 flex justify-between text-[11px] text-muted">
              <span>x1</span><span>x2 · 30m</span><span>x3 · 2h</span>
            </p>
          </div>
          <p className="mt-3 cursor-pointer text-center text-xs font-semibold text-accent">How does XP work?</p>
        </Popover>
      )}
      {pop === "energy" && (
        <Popover>
          <p className="rounded-xl bg-paper-2 p-2.5 text-xs text-muted">
            Everything from the old MathsGenie site is still free (doesn&apos;t cost energy)
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-base font-bold">
            <svg viewBox="0 0 24 24" className="size-4 text-[#ff2e9a]" fill="currentColor" aria-hidden>
              <path d="M13 2 4.5 13.5c-.3.4 0 .9.5.9H11l-1 7.6 8.6-11.5c.3-.4 0-.9-.5-.9H13l1-7.6z" />
            </svg>
            Energy
          </p>
          <p className="mt-1 text-sm">
            <span className="text-xl font-extrabold">{HUD.energy}</span>
            <span className="text-muted"> / {HUD.energyMax}</span>
          </p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: HUD.energyMax }).map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < HUD.energy ? "bg-[#ff2e9a]" : "bg-ink/10"}`} />
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Energy is used for Genie AI marking and chat. It refills every week — unused energy doesn&apos;t carry over.
          </p>
        </Popover>
      )}
      {pop === "streak" && (
        <Popover>
          <div className="rounded-2xl bg-[#fff4e5] p-3">
            <p className="flex items-center gap-2 text-xl font-extrabold text-[#ff9600]">
              <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
                <path d="M12.6 2.3c.2 2.6-.8 4.1-2.2 5.6-1.2 1.3-2.6 2.8-2.9 5.3-.5-.4-1-1.2-1.2-2.2-1.5 1.4-2.8 3.4-2.8 5.6 0 3.9 3.4 7 8.5 7s8.5-3.1 8.5-7c0-5.5-4.6-7.6-5.6-12.1-.9.3-1.9 1.4-2.3 2.8z" />
              </svg>
              {HUD.streak}
            </p>
            <p className="text-xs text-[#b36b00]">Day streak</p>
            <div className="mt-2 flex justify-between">
              {HUD.week.map((d, i) => (
                <div key={i} className="text-center">
                  <p className={`text-base ${d.done ? "text-[#ff9600]" : "text-ink/20"}`} aria-hidden>{d.done ? "🔥" : "🔥"}</p>
                  <p className={`text-[10px] font-semibold ${d.done ? "text-[#ff9600]" : "text-muted"}`}>{d.d}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-bold">
            <span aria-hidden>🏆</span> Top streaks
          </p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {HUD.leaders.map((l, i) => (
              <li key={l.name} className="flex items-center gap-2">
                <span aria-hidden>{["🥇", "🥈", "🥉"][i] ?? <span className="w-4 text-xs text-muted">#{i + 1}</span>}</span>
                <span className="flex-1 truncate text-ink/70">{l.name}</span>
                <span className="font-semibold text-[#ff9600]">🔥 {l.s}</span>
              </li>
            ))}
          </ul>
        </Popover>
      )}
      {pop === "profile" && (
        <div className="absolute right-2 top-12 z-50 w-64 rounded-2xl border-2 border-ink/10 bg-paper p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{HUD.user.name}</p>
              <p className="text-xs text-muted">{HUD.user.joined}</p>
            </div>
          </div>
          <div className="mt-1 border-t border-line pt-1">
            {[
              { label: "My progress", href: "/classrooms" },
              { label: "Saved", href: "/gcse/worksheets" },
              { label: "Settings", href: "/settings/account" },
            ].map((i) => (
              <Link
                key={i.label}
                href={i.href}
                onClick={() => setPop(null)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-paper-2"
              >
                {i.label}
              </Link>
            ))}
            <a
              href={SITE.original}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-paper-2"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Popover({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border-2 border-ink/10 bg-paper p-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
      {children}
    </div>
  );
}

export default function Header() {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [oldChip, setOldChip] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [railCollapsed, setRailCollapsed] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  /* the app rail announces its collapsed state; show a pin button like the original */
  useEffect(() => {
    const onRail = (e: Event) => {
      const collapsed = Boolean((e as CustomEvent).detail?.collapsed);
      setRailCollapsed(collapsed);
    };
    window.addEventListener("mg-rail", onRail);
    return () => window.removeEventListener("mg-rail", onRail);
  }, []);

  const courses = coursesByQualification();
  const allCourses = Object.values(courses).flat();
  const matches =
    query.trim().length > 1
      ? allCourses
          .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 6)
      : [];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!searchRef.current?.contains(e.target as Node)) setQuery((q) => (matches.length ? q : ""));
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [matches.length]);

  return (
    <header className="sticky top-0 z-50">
      <OfferBanner />
      <div className="border-b-2 border-[#f0f0f0] bg-paper text-ink">
        <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
          {railCollapsed && (
            <button
              type="button"
              aria-label="Pin sidebar open"
              onClick={() => {
                setRailCollapsed(false);
                window.dispatchEvent(new Event("mg-rail-expand"));
              }}
              className="hidden size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-ink/60 transition hover:bg-paper-2 hover:text-ink lg:flex"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
                <path d="M9.5 5v14" />
              </svg>
            </button>
          )}
          <Link href="/" className="flex items-center gap-2.5" aria-label="MathsGenie home">
            <LogoMark />
            <span className="font-title text-[22px] font-extrabold leading-none tracking-tight">
              MathsGenie
            </span>
          </Link>

          {/* primary nav — pill dropdowns like the original */}
          <nav className="ml-3 hidden items-center gap-1.5 lg:flex" aria-label="Primary">
            <div className="relative">
              <button
                onClick={() => { setFlyoutOpen((v) => !v); setFeaturesOpen(false); }}
                aria-expanded={flyoutOpen}
                className="flex items-center gap-1.5 rounded-full border-2 border-line px-3.5 py-1.5 text-sm font-semibold transition hover:bg-paper-2"
              >
                GCSE
                <svg viewBox="0 0 12 14" className="size-3 text-muted" aria-hidden>
                  <path d="M2 5l4-4 4 4M2 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {flyoutOpen && (
                <div className="absolute left-0 top-12 w-64 rounded-2xl border-2 border-ink/10 bg-paper p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted">Pick a qualification</p>
                  {FLYOUT.map((f) => (
                    <Link
                      key={f.label}
                      href={f.href}
                      onClick={() => setFlyoutOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-paper-2"
                    >
                      {f.label}
                      <span className="text-muted" aria-hidden>›</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setFlyoutOpen((v) => !v); setFeaturesOpen(false); }}
                aria-expanded={flyoutOpen}
                className="flex items-center gap-1.5 rounded-full border-2 border-line px-3.5 py-1.5 text-sm font-semibold transition hover:bg-paper-2"
              >
                Find course
                <Chevron open={flyoutOpen} />
              </button>
              {flyoutOpen && (
                <div className="absolute left-0 top-12 w-64 rounded-2xl border-2 border-ink/10 bg-paper p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted">Resources</p>
                  {FLYOUT.map((f) => (
                    <Link
                      key={f.label}
                      href={f.href}
                      onClick={() => setFlyoutOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-paper-2"
                    >
                      {f.label}
                      <span className="text-muted" aria-hidden>›</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setFeaturesOpen((v) => !v); setFlyoutOpen(false); }}
                aria-expanded={featuresOpen}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition hover:bg-paper-2"
              >
                Features
                <Chevron open={featuresOpen} />
              </button>
              {featuresOpen && (
                <div className="absolute left-0 top-12 w-72 rounded-2xl border-2 border-ink/10 bg-paper p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                  {FEATURES.map((f) => (
                    <Link
                      key={f.href}
                      href={f.href}
                      onClick={() => setFeaturesOpen(false)}
                      className="block rounded-xl px-3 py-2 transition hover:bg-paper-2"
                    >
                      <span className="block text-sm font-semibold">{f.label}</span>
                      <span className="block text-xs text-muted">{f.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {oldChip && (
              <span className="ml-1 flex items-center gap-1 rounded-full border-2 border-line py-1 pl-3.5 pr-1.5 text-sm font-semibold">
                <a href={`${SITE.original}/gcse.html`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent">
                  Old site
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </a>
                <button
                  onClick={() => setOldChip(false)}
                  aria-label="Hide the old site link"
                  className="flex size-6 items-center justify-center rounded-full transition hover:bg-paper-2"
                >
                  ✕
                </button>
              </span>
            )}
          </nav>

          {/* right cluster: search + member HUD */}
          <div className="ml-auto flex items-center gap-2" ref={searchRef}>
            <div className="relative hidden md:block">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search courses"
                className="w-56 rounded-full bg-paper-2 px-4 py-2 pl-9 text-sm outline-none ring-line transition focus:w-64 focus:ring-2"
              />
              <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted" aria-hidden>
                <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {matches.length > 0 && (
                <div className="absolute right-0 top-11 w-72 rounded-2xl border-2 border-ink/10 bg-paper p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                  {matches.map((c) => (
                    <Link
                      key={c.href + c.title}
                      href={`/course?href=${encodeURIComponent(c.href)}&title=${encodeURIComponent(c.title)}`}
                      onClick={() => setQuery("")}
                      className="block truncate rounded-xl px-3 py-2 text-sm transition hover:bg-paper-2"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <MemberHud />

            <button
              className="flex size-9 items-center justify-center rounded-full transition hover:bg-paper-2 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-paper px-4 py-3 lg:hidden" aria-label="Mobile">
          {FLYOUT.slice(0, 2).map((f) => (
            <Link key={f.label} href={f.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-paper-2">
              {f.label}
            </Link>
          ))}
          {FEATURES.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-paper-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
