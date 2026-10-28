import Link from "next/link";

/**
 * Shared empty state for classroom-gated pages, matching the original
 * (research/04-member-area.md §6): icon, "No GCSE classrooms yet",
 * helper line, cyan "Go to classrooms" button.
 */
export default function EmptyClassroomState({ title, note }: { title: string; note: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
      <div className="flex items-center justify-center gap-3 text-left">
        <span className="flex size-11 items-center justify-center rounded-xl bg-paper-2" aria-hidden>
          <svg viewBox="0 0 24 24" className="size-6 text-muted" fill="currentColor">
            <path d="M4 4C4 3.45 4.45 3 5 3h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1Zm-2 5c0-1.66 1.34-3 3-3h14c1.66 0 3 1.34 3 3v9c0 1.66-1.34 3-3 3H5c-1.66 0-3-1.34-3-3V9Z" />
          </svg>
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight">GCSE {title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted">Choose a classroom to open its {title.toLowerCase()}.</p>

      <div className="mt-14">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-paper-2" aria-hidden>
          <svg viewBox="0 0 24 24" className="size-8 text-muted" fill="currentColor">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" />
          </svg>
        </div>
        <h4 className="mt-4 text-xl font-extrabold">No GCSE classrooms yet</h4>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">{note}</p>
        <Link
          href="/classrooms"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
        >
          Go to classrooms
        </Link>
      </div>
    </div>
  );
}
