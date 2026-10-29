import Link from "next/link";
import DailyGreensClient from "@/components/DailyGreensClient";
import type { QualKey } from "@/lib/questions";

/**
 * Qualification-level Daily Greens body — mirrors the original's
 * /{qual}/daily-greens landing (captured for AS Level and KS2,
 * research/11): breadcrumb + "X Daily Greens" H1, the one-line
 * description, a single "Maths" subject card, then our interactive
 * daily set (the original's worksheet flow is classroom-gated).
 */
export default function QualDailyGreens({
  qual,
  qualName,
  qualHref,
  spec,
  courseHref,
  courseLabel,
  rushHref = null,
}: {
  qual: QualKey;
  qualName: string;
  qualHref: string;
  spec?: string;
  courseHref: string;
  courseLabel: string;
  rushHref?: string | null;
}) {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

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
            <Link href={qualHref} className="text-ink/60 hover:text-accent">{qualName}</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <Link href={courseHref} className="text-ink/60 hover:text-accent">Maths</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">Daily Greens</span>
            {spec && <span className="ml-auto hidden text-xs text-ink/50 sm:block">{spec}</span>}
          </nav>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{qualName} Daily Greens</h1>
          <p className="mt-1.5 max-w-3xl text-sm text-ink/70">
            A quick worksheet each day that targets your weaknesses.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={courseHref}
            className="group relative flex min-h-32 flex-1 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#e5306f] to-[#c026a3] p-4 text-white shadow-sm transition hover:shadow-md"
          >
            <svg viewBox="0 0 200 120" className="absolute -right-6 -top-4 size-36 opacity-30" aria-hidden>
              <path d="M20 90C60 20 140 20 180 70" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />
            </svg>
            <div className="relative">
              <p className="text-xs font-semibold text-white/75">Maths · rebuilt course</p>
              <p className="mt-1 text-lg font-extrabold">{courseLabel}</p>
            </div>
            <span className="relative inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink transition group-hover:bg-white/90">
              Open <span aria-hidden>›</span>
            </span>
          </Link>
          <div className="rounded-3xl border-2 border-line bg-panel p-4 text-sm sm:max-w-xs">
            <p className="font-bold">How it works</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted">
              <li>Three questions a day, the same set for everyone.</li>
              <li>Each answer you get right turns green.</li>
              <li>Your streak is saved in this browser, per qualification.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-extrabold">{today}</h2>
          <p className="mt-1 text-sm text-muted">Today&apos;s set — start whenever you like.</p>
          <div className="mt-5">
            <DailyGreensClient qual={qual} rushHref={rushHref} />
          </div>
        </div>
      </div>
    </div>
  );
}
