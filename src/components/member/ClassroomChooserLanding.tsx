"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listClassrooms, subscribeClassrooms, type Classroom } from "@/lib/classrooms";

/**
 * Landing for classroom-gated resources (original /gcse/videos & /gcse/lessons):
 * heading + "Choose a classroom to open its X" + gradient classroom card
 * ("Edexcel / My Maths Class / Open →") or the no-classrooms empty state.
 */
export default function ClassroomChooserLanding({ kind }: { kind: "videos" | "lessons" }) {
  const [rooms, setRooms] = useState<Classroom[] | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRooms(listClassrooms()));
    const un = subscribeClassrooms(() => setRooms(listClassrooms()));
    return () => {
      cancelAnimationFrame(raf);
      un();
    };
  }, []);

  const plural = kind; // "videos" | "lessons"

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-center gap-3 text-left">
        <span className="flex size-11 items-center justify-center rounded-xl bg-paper-2 text-muted" aria-hidden>
          {kind === "videos" ? (
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
              <path d="M4 4C4 3.45 4.45 3 5 3h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1Zm-2 5c0-1.66 1.34-3 3-3h14c1.66 0 3 1.34 3 3v9c0 1.66-1.34 3-3 3H5c-1.66 0-3-1.34-3-3V9Zm10.57 1.6a1 1 0 0 0-1.52-.86l-2.5 1.6a1 1 0 0 0 0 1.68l2.5 1.6a1 1 0 0 0 1.52-.86v-3.16Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
              <path d="M3 6c0-1.66 1.34-3 3-3h12c1.66 0 3 1.34 3 3v4a1 1 0 1 1-2 0V6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H6c-1.66 0-3-1.34-3-3V6Z" />
              <path d="M12.85 11.01c-1.12-.3-2.14.72-1.84 1.84l2.21 8.25c.35 1.29 2.08 1.52 2.75.36l2.01-3.48 3.48-2.01c1.16-.67.93-2.4-.36-2.75l-8.25-2.21Z" />
            </svg>
          )}
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight">GCSE {kind === "videos" ? "Videos" : "Lessons"}</h3>
      </div>
      <p className="mt-2 text-center text-sm text-muted">Choose a classroom to open its {plural}.</p>

      {rooms && rooms.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {rooms.map((r) => (
            <Link
              key={r.id}
              href={`/gcse/maths/edexcel/${kind}?classroomId=${r.id}`}
              className="group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#e5306f] to-[#c026a3] p-4 text-white shadow-sm transition hover:shadow-md"
            >
              <svg viewBox="0 0 200 120" className="absolute -right-6 -top-4 size-36 opacity-30" aria-hidden>
                <path d="M20 90C60 20 140 20 180 70" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />
              </svg>
              <div className="relative">
                <p className="text-xs font-semibold text-white/75">{r.boards.join(" / ")}</p>
                <p className="mt-1 text-lg font-extrabold">{r.name}</p>
              </div>
              <span className="relative inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink transition group-hover:bg-white/90">
                Open <span aria-hidden>›</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-14 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-paper-2" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-8 text-muted" fill="currentColor">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" />
            </svg>
          </div>
          <h4 className="mt-4 text-xl font-extrabold">No GCSE classrooms yet</h4>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
            Classrooms are Maths only for now. Create a Maths classroom and its {plural} will show up here.
          </p>
          <Link
            href="/classrooms"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
          >
            Go to classrooms
          </Link>
        </div>
      )}
    </div>
  );
}
