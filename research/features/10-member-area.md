# 10 · Member Area (logged-in)

> Evidence: authenticated session on the live site (with the account owner's
> consent), 2026-10-28. 12 screenshots + DOM text captures. The session was
> used for UI/feature documentation only — no premium content was downloaded
> or re-hosted. Original code and copy in the recreation; nothing verbatim.

## Account scope observed

Educator account (`account type: Teacher`), GCSE qualification, boards
Edexcel + CIE, no classrooms created — so every classroom-gated page showed
its empty state, which is itself useful evidence of the gating pattern.

## Global member chrome

Two persistent layers wrap every member page:

1. **Top bar** — qualification switcher (`Active qualification: GCSE`),
   Find course, Features, global Search combobox, Old-site link, notification
   bell (badge count), then the **gamification HUD**:
   - **XP button** — e.g. `3 XP`. Popover: current rank chip (`Unranked`),
     progress line (`72 XP to Bronze III`), **study time today** `0m` with a
     3-segment multiplier bar `x1 · x2 · 30m · x3 · 2h` and caption
     `30m more to earn all XP at x2`, plus a `How does XP work?` link.
   - **Energy button** — e.g. `15 energy left` (purple bolt icon).
     Popover/Settings: *Energy is spent on AI marking and Ask Genie. It
     refills every week.* Free plan = **20/week**, next refill countdown,
     unused energy does not carry over.
   - **Streak button** — flame icon + `4 day streak`. Popover: big flame
     count, week grid `M T W T F S S` (done days lit), **Top streaks**
     leaderboard (top 5 usernames with flame counts), `How do streaks work?`.
   - **Profile avatar** — menu with `Settings` and `Sign out`.
2. **Left sidebar** — Home, Daily Greens, Worksheets, Videos, Lessons,
   Homework, Tests, Upgrade (highlighted), Ideas + Feedback, Settings,
   `Other` expander. Active item = filled pill.

A dismissible blue **welcome-offer countdown banner** sits above the top bar
(`40% off · Ends in 4d 23h 04m 45s`).

## Dashboard — `/classrooms`

Greeting is time-aware (`Good late night, <first name> <surname>`).
Sections:

- **My classrooms** — grid of classroom cards; empty state explains the
  qualification switcher.
- **Getting started** — three task cards: *Make a lesson* (build a lesson for
  a classroom), *Make a test* (pick questions, set for class), *Set homework*
  (choose tasks, send to class).
- **New classroom modal** — `Choose a subject` → searchable subject list
  (Maths: pick exam boards, Further Maths, Statistics, Maths Numeracy: WJEC,
  Old Maths: Edexcel) → `Continue` disabled until a subject+board is picked.

## Classroom-gated pages (empty-state pattern)

| Route | Empty-state message pattern |
|---|---|
| `/gcse/daily-greens` | "Choose a classroom to open its daily greens" + note that Daily Greens is Maths-only |
| `/gcse/worksheets` | "Choose a classroom to open its worksheets" |
| `/gcse/videos` | same pattern |
| `/gcse/lessons` | same pattern |
| `/classrooms/homework` | "see and set its homework" |
| `/classrooms/test` | "see and set its tests" |

Pattern: heading → one-line instruction → reason (no classroom) → CTA
`Go to classrooms`. The **classroom is the unit of organisation**: resources,
homework and tests all hang off classrooms, not off the raw course.

## Settings — `/settings/*`

Tab rail: **Account · Subscription · Preferences · Emails · Privacy &
security · Guardians**.

- **Account** — profile card (avatar, name, email, member-since, account
  type, current/best streak), username `@handle` with Edit, **Exam details**
  (account type, qualification, exam boards, school), **Subjects & target
  grades** (per-subject rows: `Physics · Edexcel · A Level` etc., editor
  adds/removes GCSE subjects).
- **Subscription** — plan card (Free plan / current plan), upgrade pitch
  (Pro: unlimited marking, Ask Genie, mock exams), **Energy meter**
  `15 / 20` with weekly refill explainer, **Weekly limits** table:
  Lessons 1/3 · Revision notes 3/3 · Flashcard topics 2/3 · Question topics
  1/3 · Walkthroughs 2/3 · Question Rush 9/10 (free-plan caps; counter
  increments on use).
- **Preferences** — Appearance (Light / Dark / System with Aa previews),
  Accessibility (Text size: Default/Large/Extra large; Easier-reading font;
  Background colour tint) — all client-side display adjustments.

## Gamification economy (facts for the recreation)

- **XP** → named ranks (Unranked, Bronze I–III, …); XP earned per activity;
  daily study-time multiplier stages at 30 min (x2) and 2 h (x3).
- **Energy** → weekly-refilled meter consumed by AI features (marking,
  Ask Genie); plan-dependent cap (20/week on Free).
- **Streak** → consecutive active days; week grid; site-wide leaderboard.
- **Weekly limits** → per-feature counters on the free plan.

## Recreation mapping

| Live route | Recreated route | Status |
|---|---|---|
| `/classrooms` | `/dashboard` | built — sidebar shell, greeting, empty classroom state, getting-started cards |
| `/classrooms` (modal) | `/dashboard` (subject modal) | built — searchable subject picker, board step |
| HUD popovers | top-bar HUD on `/dashboard` | built — XP/streak/energy popovers, original data |
| `/settings/*` | `/dashboard/settings` | built — account/subscription/preferences tabs, free-plan limits table |
| gated resource pages | `/dashboard/{daily-greens,worksheets,…}` | built — same empty-state pattern, links back to dashboard |

All member-area recreations use **original code, original copy and demo
data** (fictional usernames on the leaderboard, no real student data).
