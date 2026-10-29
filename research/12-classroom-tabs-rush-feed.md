# 12 — Classroom-scoped tabs, per-qual Question Rush, student class feed

Session date: 2026-10-30. Follow-ups to `11-aslevel-daily-greens-homework-tests.md`
and `features/04-question-rush.md` / `features/10-member-area.md`.

## 1. Classroom-scoped Tests & Homework tabs

The original's classroom shell has tabs **Resources | Lessons | Tests |
Homework | Members** with a "View as student" banner (research/04 §4).
Until now the replica's Tests/Homework tabs just linked out to the global
wizards; they are now **classroom-scoped**:

- `/classrooms/{id}` → `components/member/ClassroomDetailClient.tsx`
  (client component; classroom + assignments come from localStorage).
  - **Tests tab** — only tests whose `classroomId` matches; empty state
    "No tests for this class yet"; `＋ Make a test` opens the wizard
    pre-scoped to the class (classroom step skipped, "For: {name}" chip).
  - **Homework tab** — same pattern for homework (due chips, handed-in
    toggle, delete).
  - **Members tab** — teacher + 8 fictional students (initial avatars,
    "Active today / Last seen…" chips) with a demo-roster note.
  - Tab counts live in the strip; deep links `?tab=tests|homework|members`
    and `?view=student` are honoured on load (rAF-deferred, repo-wide
    SSR-safe pattern).
- Wizards extracted to `components/member/HomeworkWizard.tsx` and
  `TestWizard.tsx` with an optional `fixedRoomId` prop — the global pages
  (`/classrooms/homework`, `/classrooms/test`) reuse the same components
  and their cards now deep-link into the classroom tab
  (`/classrooms/{id}?tab=…`).

## 2. Student view — "class feed"

"View as student" (banner toggle, also `?view=student`) hides every
teacher CTA and replaces the Resources grid with the **class feed**:
a chronological timeline (newest first, `before:` vertical rail) merging
that classroom's homework and tests. Each entry: icon node (📝/🧪), title,
Homework/Test chip, due chip (homework) or Best x/y chip (test), tasks
line, "Set {date} · n tasks · n questions", and the student action —
"Start homework →" (question bank) or "Sit test →/Retake test →"
(timed runner). Empty state: "Nothing has been set for this class yet."

Evidence note: the tab list and the banner are from the original capture;
the probe account had no classrooms, so populated lists and the feed
layout are our reconstruction (clearly marked in code comments).

## 3. Question Rush for the other qualifications

`research/features/04` records the original exposes Rush per
qualification (`/gcse/question-rush`, `/a-level/question-rush`, plus
per-topic routes). Replicated:

- `lib/questions.ts` — `rushPoolsForQual(qual)` builds pool tabs from the
  banks: GCSE = Grades 1–8/9; A-Level & AS-Level = All modules / Pure /
  Statistics / Mechanics (topic mapping); IGCSE & KS2 = All topics.
- `QuestionRushGame` refactored from `grades` to `pools: RushPool[]`
  (best streak still per-pool in localStorage; GCSE keys unchanged so
  existing bests survive).
- Routes: `/gcse/question-rush` (updated + switcher), `/a-level/question-rush`
  (via `a-level/[feature]`, which previously passed grade labels matching
  no questions — empty-pool bug fixed), and new standalone
  `/as-level/question-rush`, `/igcse/question-rush`, `/ks2/question-rush`
  with breadcrumb + H1 + `RushQualSwitcher` (cross-qual chips).
- Entries wired: per-qual Daily Greens pages pass `rushHref` (the
  "Race the clock" link after finishing a set); KS2 landing Question Rush
  chip is now internal (was outbound); IGCSE course tile → internal Rush;
  classroom feature grid Rush card → `/gcse/question-rush` (was a
  non-existent per-topic route).

## 4. Verification (production build, localhost:3111)

- Seeded classroom "10B Maths" → Tests tab shows "10B Mid-topic Test"
  with Best chip + wizard opens at Step 1 of 2 with "For: 10B Maths";
  Homework tab lists "Homework 1" with due chip
  (`replica-classroom-tests-tab.png`, `replica-classroom-homework-tab.png`).
- Student view: banner flips, CTAs hidden, feed shows both items newest
  first with student actions (`replica-classroom-student-feed.png`).
- `/a-level/question-rush`: All modules / Pure / Statistics / Mechanics
  pools populated, game playable (`replica-alevel-rush.png`);
  `/ks2/question-rush` and `/as-level/question-rush` 200 with switcher
  (`replica-ks2-rush.png`).
