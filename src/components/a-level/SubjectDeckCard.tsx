"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  SUBJECT_TINTS,
  subjectCoverUrl,
  subjectHref,
  type ALevelSubject,
} from "@/lib/alevel-subjects";

/**
 * 3D "card deck" subject tile — the signature A-Level hub card on the
 * original: a pastel tile with blurred cover glow, a stack of white
 * deck layers behind an aspect-[3/4] cover, and a hover tilt that
 * swings the deck open (rotateY, perspective from the left).
 * Clicking a subject with several boards opens the "Choose exam board"
 * popover (white rounded-2xl, muted header, board links).
 *
 * Shared by the A-Level and AS-Level hubs: pass `hrefFor` to change the
 * link resolver (defaults to the A-Level one) and `internalSlug` to mark
 * which subject card opens our rebuilt course page.
 */
export default function SubjectDeckCard({
  subject,
  hrefFor = subjectHref,
  internalSlug = "maths",
}: {
  subject: ALevelSubject;
  hrefFor?: (s: ALevelSubject, board?: string) => string;
  internalSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number; above: boolean } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tint = SUBJECT_TINTS[subject.slug] ?? "#eef0f3";
  const cover = subjectCoverUrl(subject);
  const isMaths = subject.slug === internalSlug;
  const ext = !isMaths;

  const openMenu = () => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) {
      const MENU_H = 330;
      const above = r.bottom + MENU_H > window.innerHeight && r.top > MENU_H;
      setMenuPos({ left: r.left + r.width / 2, top: above ? window.innerHeight - r.top + 6 : r.bottom + 6, above });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onScroll = () => setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  const deck = (
    <div
      className="group relative isolate w-full cursor-pointer overflow-visible rounded-2xl p-2 text-left transition-all"
      style={{ background: tint }}
      role={subject.boards ? "button" : undefined}
      aria-haspopup={subject.boards ? "menu" : undefined}
      aria-expanded={subject.boards ? open : undefined}
      aria-label={subject.boards ? `${subject.name}: choose exam board` : subject.name}
      tabIndex={0}
      onClick={(e) => {
        if (subject.boards) {
          e.preventDefault();
          if (open) setOpen(false);
          else openMenu();
        }
      }}
      onKeyDown={(e) => {
        if (subject.boards && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          if (open) setOpen(false);
          else openMenu();
        }
      }}
    >
      {/* blurred cover glow behind the tile */}
      <img
        alt=""
        src={cover}
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 rounded-2xl object-cover opacity-30 blur-2xl saturate-200 transition-opacity group-hover:opacity-50"
      />
      <div
        className="relative transition-transform duration-700 ease-in-out"
        style={{ perspective: "1500px", perspectiveOrigin: "left" }}
      >
        <div
          className="relative aspect-[3/4] w-full transition-transform duration-700 ease-in-out group-hover:-rotate-2 group-hover:scale-105"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* deck stack: white layers stepping back in Z */}
          {[
            { z: 18, inset: 1, zi: 29 },
            { z: 12, inset: 2, zi: 28 },
            { z: 6, inset: 3, zi: 27 },
            { z: 0, inset: 4, zi: 26 },
            { z: -6, inset: 5, zi: 25 },
          ].map((l) => (
            <div
              key={l.zi}
              className="absolute rounded-r-2xl rounded-l-lg border-2 border-gray-200 bg-white"
              style={{
                top: l.inset,
                right: l.inset,
                bottom: l.inset,
                left: l.inset,
                transform: `translateZ(${l.z}px)`,
                zIndex: l.zi,
              }}
            />
          ))}
          {/* top card: cover art + title + white ring */}
          <div
            className="absolute inset-0 rounded-r-2xl rounded-l-lg shadow-xl"
            style={{ transform: "translateZ(20px)", backfaceVisibility: "hidden", zIndex: 30 }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-r-2xl rounded-l-lg">
              <img alt={subject.name} src={cover} className="-z-10 h-full w-full object-cover" />
              <p className="absolute inset-x-3 bottom-2 z-10 line-clamp-3 text-center text-sm font-bold leading-[1.15] tracking-tight text-white sm:text-base">
                {subject.name}
              </p>
              <div className="absolute inset-0 rounded-r-2xl rounded-l-lg border-2 border-white transition-all group-hover:border-white/30 sm:border-[3px]" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div ref={wrapRef} className="relative @container">
      {ext && !subject.boards ? (
        <a
          href={hrefFor(subject, "aqa")}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={subject.name}
        >
          {deck}
        </a>
      ) : (
        deck
      )}

      {/* exam-board popover — fixed so the Popular shelf's scroll
          container can't clip it (the original portals its menu too) */}
      {open && subject.boards && menuPos && (
        <div
          role="menu"
          className={`fixed z-[60] max-h-72 w-44 -translate-x-1/2 overflow-y-auto rounded-2xl border-2 border-ink/10 bg-white p-1 text-left shadow-lg ${menuPos.above ? "translate-y-full" : ""}`}
          style={menuPos.above ? { left: menuPos.left, bottom: menuPos.top } : { left: menuPos.left, top: menuPos.top }}
        >
          <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted">Choose exam board</div>
          {subject.boards.map((b) => {
            const href = hrefFor(subject, b.slug);
            const internal = href.startsWith("/");
            return internal ? (
              <Link
                key={b.slug}
                role="menuitem"
                href={href}
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-soft"
                onClick={() => setOpen(false)}
              >
                {b.label}
              </Link>
            ) : (
              <a
                key={b.slug}
                role="menuitem"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-soft"
                onClick={() => setOpen(false)}
              >
                {b.label} <span aria-hidden className="text-xs text-muted">↗</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
