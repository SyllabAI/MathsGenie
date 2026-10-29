# 09 — Logged-in probe: sidebar live spec, lesson player mechanics, A-Level hub

**Method:** agent-browser session, logged in with a fresh email code
(2026-10-29). All observations from `mathsgenie.co.uk` production DOM +
computed styles; screenshots in `crawl_raw/`.

## 1. Sidebar — verified spec (logged-in home `/home`)

`<aside>` computed + class dump (first-hand):

- Container: `absolute inset-y-0 left-0 flex flex-col overflow-hidden
  border-subtle border-r-2 bg-background transition-[width] duration-200
  ease-out w-55 px-3 py-2` + a long `rail-collapsed:[&_*]:hidden`-style
  attribute list that hides non-icon children when collapsed.
- Computed: **width 220px**, **position absolute**, **bg
  rgb(255,255,255)**, **border-right 2px solid rgb(240,240,240)**.
- `<nav>` inside: `scrollbar-none flex min-h-0 flex-1 flex-col
  overflow-y-auto overflow-x-hidden w-full gap-0.5`.
- Item (inactive `a`): `group/navitem relative flex w-full flex-none
  cursor-pointer items-center rounded-xl transition-colors
  text-foreground/60 hover:bg-muted hover:text-foreground px-2 py-2`;
  icon `mr-2.5 size-6 shrink-0 text-muted-foreground opacity-60
  group-hover/navitem:opacity-100`; label `p.min-w-0 flex-1 truncate
  text-sm capitalize`.
- Active item swaps to `bg-accent-primary text-accent-primary-foreground`
  (rounded-xl kept).
- Our `AppSidebar.tsx` already implements all of the above (verified
  line-by-line against this dump).

Nav map captured (hrefs): Home `/classrooms` · Daily Greens
`/gcse/daily-greens` · Worksheets `/gcse/worksheets` · Videos
`/gcse/videos` · Lessons `/gcse/lessons` · Homework
`/classrooms/homework` · Tests `/classrooms/test` · Upgrade
`/your-plan` · Ideas + feedback `/feature-requests` · Settings
`/settings/account` · bottom: "Other" disclosure, Report-a-bug,
Collapse-sidebar buttons.

## 2. Lesson player — live mechanics (grade-1 multiplication lesson)

Focus-mode route
`/gcse/maths/edexcel/grade-1-1-2-multiplication-and-division/lessons`
renders a full-screen immersive player:

- **Chrome:** left "Study navigation" rail with `Show topics`; top
  progress bar with `x` close; breadcrumb GCSE › Maths › Topic behind
  the panel.
- **Progressive reveal:** each step starts with heading + first
  paragraph; the primary button reads **Next** while more paragraphs
  remain (older revealed paragraphs stay, dimmed), flipping to
  **Continue** to advance to the next step. Progress advances per step
  (observed 6.67% → 13.3% → 26.7% → 40% → 46.7% on a 15-step lesson).
- **Question type 1 — MCQ:** card labelled "Multiple Choice Question";
  A/B/C/D chips rendered as full-width buttons
  `rounded-2xl border-2 border-b-4 px-4 py-2 cursor-grab draggable`;
  after picking, chip shows "Option A, correct answer" and siblings
  disable; **Continue** appears.
- **Question type 2 — Complete the sentence:** inline answer rendered
  with a **MathLive `<math-field>`** web component
  (`mathfield-wrapper mx-1 mt-1 inline-flex cursor-text items-center
  justify-center px-2 border-b-2`, `min-width:120px; min-height:32px`,
  KaTeX for the printed equation) + **Check** button; typing the value
  and Check → correct feedback → Continue.
- **Question type 3 — Tap or drag to order:** card labelled "Tap or
  drag to order", heading colour `#e88a2d` (rgb(232,138,45) captured).
  Four numbered slots (`h-8 w-8 rounded-xl bg-muted` badges 1-4, empty
  slot = bottom rule `h-0.5 rounded-full bg-border` inside
  `min-h-12` row) + chip bank below (`rounded-2xl border-2 border-b-4
  px-4 py-2 cursor-grab draggable`). Tap-to-place and drag both work;
  footer shows **Check Order** and **Skip** (Skip reveals next step,
  progress advanced 40% → 46.7%).
- **Footer:** `‹ Back` · **Ask Genie** (footer button; only on some
  steps) · primary Next/Continue/Check Order.
- **Topics drawer:** Show topics opens grade accordion (Grade 1 … Grade
  8/9) inside the study navigation.

Our `LessonPlayer.tsx` now implements all four step types
(teach/example progressive reveal, mcq, fill/input, **order** — added
this session from the live dump above) plus Skip on order steps, seeded
shuffle, tap + drag placement, slot/chip states and the feedback band.

## 3. Lessons hub (logged-in)

`/gcse/lessons` lists classrooms ("Choose a classroom to open its
lessons"); a classroom links to
`/gcse/maths/edexcel/lessons?classroomId=<uuid>` which renders:
"Maths Lessons / Spec 1MA1" header, subject sub-nav (All resources ·
Worksheets · Question bank · Question Rush · Lessons + Pin-to-sidebar),
"Search topics…" box, then **Grade 1…Grade 8/9 accordions**, each row
"Not completed" bullet + "Learn {Topic}" link, header shows "0 of N
completed" progress. Mirrored by our LessonsHub.

## 4. A-Level hub (logged-in)

- Old `alevel.html` **redirects** to the new UI. `/a-level` shows
  "Your classrooms / No A Level classrooms yet" for a fresh account —
  the content hub is `/a-level/old-maths/edexcel`.
- That page: breadcrumb A Level › Old Maths Edexcel, H1 "Old Maths",
  "Spec 9371" badge, **Topics | Resources** tabs; Resources = Revision
  Notes & Formula Book (Formula Book, C1-C4/S1/M1 notes) + Solomon
  Worksheets (C1-C4); topic modules **Core 1-4, Statistics 1,
  Mechanics 1** with the full 33-topic list captured (see
  08-a-level-module-regroup.md for our remap to the 9MA0 course).
- A-Level topic page (e.g. Indices and Surds) = v2 card grid: Popular
  (Worksheets, Papers) · Practice (Question bank, Daily Greens) ·
  Learn (Videos) · Tools (Exam builder, Paper marker, Grade
  calculator, My progress).
- Qualification switcher options: GCSE / A Level / IGCSE / AS Level /
  KS2.

## 5. Cookie-consent + misc

- Bottom toast: "This site uses cookie tracking technologies. Learn
  more in our Cookie Policy." + Reject optional / Allow. Promo banner
  top-right: "Welcome offer: 40% off … Ends in 3d 13h …" with Dismiss.
- Header chips: Updates (5) · 3 XP · 20 energy left · 4 day streak ·
  Profile avatar.

## 6. Question player — focus mode + popover system (live, 2026-10-29)

Route `/gcse/maths/edexcel/<topic>/questions/q1` — full-screen focus
mode: left "Study navigation" rail + H1 + Easy/Medium/Hard tabs +
numbered pagination (cyan filled current, arrows each side) + question
card.

**Toolbar (right of the card header):** Revision notes (doc icon) ·
**Highlight** (pen, toggles mode) · **Watch walkthrough** (play) ·
**Mark as complete** (green check) · **Markscheme** pill ·
**More options** kebab (`role=menu`: **Save question**, **Report an
issue**).

**Popover system = `mg-popup` floating windows** (first-hand dump):
`mg-popup fixed flex flex-col overflow-hidden rounded-2xl border-2
border-subtle bg-background shadow-xl`, inline `top:88px; left:140px;
width:420px; height:560px; z-index:1010`, draggable `.mg-popup-top
cursor-move select-none border-b-2` title bar with **Minimize** +
**Close**, content iframe, and **8 resize handles**
(`.resizer.resizer-{n,s,e,w,ne,nw,se,sw}`).
- **Formula sheet** window: iframe of
  `assets.mathsgenie.co.uk/board-resources/gcse-maths/gcse-formulae-to-remember.pdf`
  via `/api/pdf-proxy`.
- **Video walkthrough / Markscheme** window (left side): embedded video
  player + "Markscheme" bulleted list with **M1/A1** code pills +
  "Walkthrough" section.

**Ask Genie** opens a right-side rounded-3xl chat panel: header
(history ↺ · new + · expand · close X), Genie app icon, "What're you
stuck on, <name>?", "Answer a question. I'll mark it here.",
suggestion chips (Compare calculation methods / Spot the place values /
Quiz me on multiplication), bottom "Ask…" input with + button.

**Question card header:** "Question 1" · calculator flag · red ✕ ·
success-rate "54%" dotted-underline + info tooltip.

### Recreation mapping (this session)
- `src/components/player/FloatingWindow.tsx` — mg-popup clone
  (drag / 8-way resize / minimize / close), used for Formula sheet
  (iframe hot-links the original PDF) and Video walkthrough +
  Markscheme (converted from the old modal).
- Highlight mode: toolbar pen toggles; sentence spans toggle yellow
  marks; Esc exits.
- Kebab menu matches the original (Save question → toast, Report an
  issue, Copy link extra).
- `src/components/player/GeniePanel.tsx` — Ask Genie chat panel clone
  (header buttons, mascot, chips, input; local canned tutor).
- A-Level feature pages: `/a-level/[feature]` covers the 14 flat
  routes from the Features mega-menu (worksheets, question bank,
  Question Rush, Daily Greens, past + predicted papers, hot topics,
  videos, flashcards, revision guides, mock exam builder, answer
  marking, paper marker, grade calculator) via `ALevelHubShell`
  (gradient hero, Spec 9MA0, tab bar) + `MockExamBuilder`,
  `GradeCalculatorAL` (A*–E bounds), `PaperMarker` clients.
