"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* Demo gamification data — fictional, mirrors the structure documented in
   research/features/10-member-area.md. No real student data. */
const DEMO = {
  xp: 120,
  rank: "Bronze I",
  xpToNext: 80,
  studyToday: 25,
  multiplierStages: [
    { label: "x1", at: "0m" },
    { label: "x2", at: "30m" },
    { label: "x3", at: "2h" },
  ],
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
    { name: "@quicksilver", s: 75 },
    { name: "@mathwizard", s: 54 },
    { name: "@pineapple", s: 50 },
    { name: "@sevensigma", s: 44 },
    { name: "@integral", s: 41 },
  ],
  user: { name: "Demo Student", handle: "@demostudent", type: "Student" },
};

const NAV = [
  { label: "Home", href: "/dashboard", icon: "🏠" },
  { label: "Daily Greens", href: "/dashboard/daily-greens", icon: "🌿" },
  { label: "Worksheets", href: "/dashboard/worksheets", icon: "📄" },
  { label: "Videos", href: "/dashboard/videos", icon: "🎬" },
  { label: "Lessons", href: "/dashboard/lessons", icon: "📖" },
  { label: "Homework", href: "/dashboard/homework", icon: "📝" },
  { label: "Tests", href: "/dashboard/tests", icon: "🧪" },
];

type Pop = null | "xp" | "energy" | "streak" | "profile";

export default function MemberShell({ children }: { children: React.ReactNode }) {
  const [pop, setPop] = useState<Pop>(null);
  const [navOpen, setNavOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPop(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function greeting() {
    const h = new Date().getHours();
    if (h < 5) return "Good late night";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good late night";
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-line bg-night text-white transition-transform lg:static lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-5">
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <path
              d="M8 20c-1.8 0-3-1.2-3-2.6 0-1.3 1-2.3 2.4-2.5-.2-3.4 2.6-6.4 6.6-6.9 4.4-.5 8.2 1.9 8.9 5.4l4.6 1.2c.9.2 1.5.8 1.5 1.6 0 .9-.8 1.6-1.8 1.6l-3-.1v2.1c0 .7-.5 1.2-1.2 1.2H21l-.8 2.6c-.2.6-.7 1-1.3 1h-6.4c-.7 0-1.2-.5-1.3-1.1L10.5 20H8z"
              fill="#2fe4b7"
            />
          </svg>
          <span className="font-hand text-2xl font-bold">
            Maths<span className="text-mint">Genie</span>
          </span>
        </div>
        <nav className="mt-2 space-y-1 px-3" aria-label="Member">
          {NAV.map((n) => (
            <MemberLink key={n.href} href={n.href} icon={n.icon} label={n.label} onClick={() => setNavOpen(false)} />
          ))}
          <MemberLink href="/dashboard/settings" icon="⚙️" label="Settings" accent onClick={() => setNavOpen(false)} />
          <MemberLink href="/" icon="↩" label="Back to site" muted onClick={() => setNavOpen(false)} />
        </nav>
        <p className="absolute bottom-4 px-5 text-[11px] leading-relaxed text-white/35">
          Demo dashboard — original recreation with fictional data.
        </p>
      </aside>
      {navOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar + HUD */}
        <div ref={ref} className="sticky top-0 z-30 border-b border-line bg-night/95 text-white backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              className="rounded-lg border border-white/15 px-2.5 py-1.5 text-sm lg:hidden"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <select
              aria-label="Active qualification"
              className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 outline-none sm:block"
              defaultValue="gcse"
            >
              <option value="gcse">GCSE</option>
              <option value="alevel">A Level</option>
              <option value="igcse">IGCSE</option>
            </select>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => setPop(pop === "xp" ? null : "xp")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
              >
                <span className="text-peri">✦</span> {DEMO.xp} XP
              </button>
              <button
                onClick={() => setPop(pop === "energy" ? null : "energy")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
              >
                <span className="text-purple-300">⚡</span> {DEMO.energy} energy
              </button>
              <button
                onClick={() => setPop(pop === "streak" ? null : "streak")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
              >
                <span className="text-orange-400">🔥</span> {DEMO.streak}
              </button>
              <button
                onClick={() => setPop(pop === "profile" ? null : "profile")}
                aria-label="Profile menu"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-sm font-bold"
              >
                D
              </button>
            </div>
          </div>

          {/* popovers */}
          {pop === "xp" && (
            <Popover title={`${DEMO.xp} XP`} chip={DEMO.rank}>
              <p className="text-xs text-white/60">{DEMO.xpToNext} XP to Silver I</p>
              <div className="mt-3 rounded-xl bg-white/5 p-3">
                <p className="flex justify-between text-xs text-white/70">
                  <span>Study time today</span>
                  <span className="font-semibold text-white">{DEMO.studyToday}m</span>
                </p>
                <div className="mt-2 flex gap-1">
                  {DEMO.multiplierStages.map((s) => (
                    <div key={s.label} className="h-1.5 flex-1 rounded-full bg-mint/60" />
                  ))}
                </div>
                <p className="mt-1.5 flex justify-between text-[11px] text-white/45">
                  <span>x1</span><span>x2 · 30m</span><span>x3 · 2h</span>
                </p>
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-mint">How does XP work?</p>
            </Popover>
          )}
          {pop === "energy" && (
            <Popover title={`${DEMO.energy} / ${DEMO.energyMax} energy`} chip="Free plan">
              <p className="text-xs leading-relaxed text-white/60">
                Energy is spent on AI marking and Ask Genie. It refills every
                week — unused energy doesn&apos;t carry over.
              </p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-purple-400"
                  style={{ width: `${(DEMO.energy / DEMO.energyMax) * 100}%` }}
                />
              </div>
            </Popover>
          )}
          {pop === "streak" && (
            <Popover title={`${DEMO.streak} day streak`} chip="🔥">
              <div className="mt-1 flex justify-between">
                {DEMO.week.map((d, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-lg ${d.done ? "text-orange-400" : "text-white/25"}`}>
                      {d.done ? "🔥" : "○"}
                    </p>
                    <p className="text-[10px] text-white/50">{d.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-white/50">Top streaks</p>
              <ul className="mt-1.5 space-y-1 text-sm">
                {DEMO.leaders.map((l, i) => (
                  <li key={l.name} className="flex items-center gap-2 text-white/75">
                    <span className="w-4 text-xs text-white/40">{i + 1}</span>
                    <span className="flex-1 truncate">{l.name}</span>
                    <span className="font-semibold text-orange-400">🔥 {l.s}</span>
                  </li>
                ))}
              </ul>
            </Popover>
          )}
          {pop === "profile" && (
            <div className="absolute right-4 top-16 w-56 rounded-2xl border border-white/10 bg-night-2 p-2 shadow-2xl sm:right-6">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">{DEMO.user.name}</p>
                <p className="text-xs text-white/50">{DEMO.user.handle} · {DEMO.user.type}</p>
              </div>
              <Link
                href="/dashboard/settings"
                onClick={() => setPop(null)}
                className="block rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                Settings
              </Link>
              <Link
                href="/"
                onClick={() => setPop(null)}
                className="block rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                Sign out
              </Link>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function MemberLink({
  href,
  icon,
  label,
  accent,
  muted,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  accent?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        accent
          ? "text-mint hover:bg-white/10"
          : muted
          ? "text-white/60 hover:bg-white/10 hover:text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </Link>
  );
}

function Popover({
  title,
  chip,
  children,
}: {
  title: string;
  chip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute right-4 top-16 w-72 rounded-2xl border border-white/10 bg-night-2 p-4 shadow-2xl sm:right-6">
      <p className="flex items-center gap-2 text-lg font-bold">
        {title}
        {chip && (
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/70">
            {chip}
          </span>
        )}
      </p>
      {children}
    </div>
  );
}
