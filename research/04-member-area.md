# Research 04 — Member area (logged-in) reverse engineering

Probed on the live site on 2026-10-29 with a real account (magic-code login).
Evidence: `crawl_raw/member/*.png` (screenshots 01–31), `crawl_raw/member/sidebar-logged-in.html`,
`crawl_raw/mg-auth-state.json` (saved browser session).

## 1. Login flow

1. `https://mathsgenie.co.uk/auth/signup?redirectTo=%2Fhome` — tabbed auth card
   ("Create your MathsGenie account 100% free" / "Welcome back").
2. Log in tab: email → "Continue with email" → magic 6-digit code screen
   ("Check your email", single 6-digit input, Verify disabled until filled,
   auto-submits when 6 digits entered). OAuth buttons: Google, Apple, Microsoft.
3. After verify → redirect to `/classrooms` (title "Classrooms | MathsGenie").
   `/home` 307-redirects to `/classrooms`.
4. Session is a Supabase-style JWT in cookies (`state save` captured in mg-auth-state.json).

## 2. App shell (logged in)

Stack, top to bottom:

1. **Offer banner** (dismissible): indigo→blue gradient, white text,
   "🎓 Welcome offer **40% off**  4d 05h 16m 22s" (live countdown) + yellow pill CTA
   "Get 40% off" + ✕. On `/your-plan` the same banner renders **yellow on dark theme**.
2. **Header** (66px incl. 2px bottom border `#f0f0f0`, white, static):
   - Left: logo (teal genie in black rounded tile) + "MathsGenie" wordmark
   - `GCSE ⇕` qualification combobox (bordered pill)
   - `Find course ⌄` bordered pill
   - `Features ⌄` plain pill
   - `Old site ↗ | ✕` chip
   - `🔍 Search` wide grey rounded input
   - Right cluster: 🔔 bell w/ red badge `5`, `✦ 3XP` (violet), `⚡ 15` (pink),
     `🔥 4` (orange), avatar (28px, genie face)
3. **Sidebar** — see §3.
4. **Main** scrolls independently; sidebar + header stay.

## 3. Sidebar (exact spec from DOM dump)

```html
<aside aria-label="Main navigation" data-slot="pinnable-rail" id="app-desktop-sidebar"
  class="absolute inset-y-0 left-0 flex flex-col overflow-hidden border-subtle border-r-2
         bg-background transition-[width] duration-200 ease-out w-55 px-3 py-2 …rail-collapsed:…">
```

Measured computed styles (logged-in, `/classrooms`):

| Property | Value |
|---|---|
| Width | **220px** (`w-55`), 64px when rail-collapsed |
| Position | `absolute inset-y-0 left-0` inside shell row below header |
| Background | `rgb(255,255,255)` |
| Right border | **2px `rgb(240,240,240)`** |
| Padding | `8px 12px` (`px-3 py-2`) |
| Row | 40px tall, `px-2 py-2`, `rounded-xl` (12px), gap-0.5 between rows |
| Icon | 24px (`size-6`), `mr-2.5`, stroke ~1px, `fill=none` viewBox 24 |
| Label | **16px / 400**, capitalize, truncate, `flex-1` |
| Active | bg **`#CEFBFF`** `rgb(206,251,255)`, text **`#1CB0F6`** `rgb(28,176,246)` |
| Inactive | `text-foreground/60` (ink @ 60%); hover bg-muted + text-foreground |
| Upgrade row | text **`#9133EA`** `rgb(145,51,234)`, hover bg purple tint |
| Collapse btn | 32px (`h-8 w-8`), `rounded-2xl`, bottom-right of last row |
| Width anim | `transition-[width] duration-200 ease-out` |
| Scroll fades | h-6 gradients top/bottom, opacity-toggled |
| Drag resize | `absolute inset-y-0 -right-1 w-2 cursor-col-resize` |
| Font | **Inter** |

### Nav items (order matters)

Main nav (`<nav>`, gap-0.5):

| Label | href | Notes |
|---|---|---|
| Home | `/classrooms` | active state on load |
| Daily Greens | `/gcse/daily-greens` | plant/sprout icon |
| Worksheets | `/gcse/worksheets` | printer-ish icon |
| Videos | `/gcse/videos` | play-square icon |
| Lessons | `/gcse/lessons` | book icon |
| Homework | `/classrooms/homework` | people icon |
| Tests | `/classrooms/test` | clipboard icon |

Bottom section (pt-1, own gap-0.5):

| Label | href | Notes |
|---|---|---|
| Upgrade | `/your-plan` | purple accent, arrow-up-circle icon |
| Ideas + feedback | `/feature-requests` | lightbulb icon |
| Settings | `/settings/account` | gear icon |
| Other ⌄ | menu | + separate `Report a bug` icon button + `Collapse sidebar` button |

`Other` menu (popup, couldn't freeze in snapshot) + `rail-collapsed:` CSS variant
hides labels via `[&_a>*:not(:first-child)]:hidden` etc. — collapse is CSS-driven,
width animates 220→64px, icons stay, "Report a bug" button hides (`data-rail-hide-collapsed`).

## 4. `/classrooms` dashboard

- H3 greeting: "**Good evening**, {first+last name}" (time-of-day aware)
- Blue gradient hero band with genie mascots + "Getting started" cards on the right:
  - *Make a lesson* — Build a lesson for one of your classrooms.
  - *Make a test* — Pick the questions and set it for your class.
  - *Set homework* — Choose the tasks and send them to your class.
- "My classrooms" section: empty state → grey avatar, "**No GCSE classrooms yet**",
  "Create a classroom to get started. Switch qualification to see your other classrooms.",
  cyan `New classroom` button.
- Toast "Classroom created" bottom-right on creation.

### Classroom creation modal (2 steps)

1. "Step 1 of 2 — **Choose a subject**" ("Classrooms are maths-only for now"):
   searchable cards: Maths, Further Maths, Statistics, Maths Numeracy (WJEC), Old Maths (Edexcel).
   Maths expands a board menu: AQA, Edexcel, Eduqas, OCR, WJEC, CCEA (checkbox items).
2. "**Name your classroom**" — text input prefilled "New Maths classroom" → `Create classroom`.

### Classroom page `/classrooms/{id}`

Teacher view banner ("View as student" / "Dismiss"), H1 name, tabs:
`Resources | Lessons | Tests | Homework | Members (0)` (+ ⚙ menu: Paper Marker,
Content Coverage, Settings). Resource grid, 2 columns, grouped:

- **Popular**: Worksheets ("Downloadable exam booklets and worksheets per topic"),
  Papers ("Past papers, predicted papers and mini tests")
- **Practice**: Question bank 🏷Popular ("Practice questions with AI feedback — 18486 questions"),
  Question Rush 🏷New ("Race the clock on quick-fire multiple-choice questions"),
  Daily Greens ("A quick worksheet each day that targets your weaknesses"),
  Hot topics ("See which topics come up most in real past papers")
- **Learn**: Lessons ("Step-by-step lessons and quizzes"),
  Videos ("Master concepts with explainer videos"),
  Flashcards ("Remember concepts with active recall"),
  Scheme of learning ("A stage-by-stage course through the whole GCSE"),
  Teach Genie 🏷New ("Review a topic by teaching it to Baby Genie")
- **Tools**: Exam builder ("Build a custom mock from exam-style questions"),
  Paper marker ("Mark your whole class's papers in one go"),
  Grade calculator ("Enter your marks to see your predicted grade")

Feature cards: 56px rounded-2xl colored icon tile + title + desc + optional badge.
First-run spotlight tour tooltip ("Resources — Our resources for the subject…", Next).

## 5. Complete feature URL map (GCSE ⇒ Edexcel Maths)

| Feature | URL |
|---|---|
| Worksheets | `/gcse/maths/edexcel/worksheets` |
| Papers | `/gcse/maths/edexcel/papers` |
| Question bank | `/gcse/maths/edexcel/questions` |
| Question Rush | `/gcse/maths/edexcel/question-rush` |
| Daily Greens | `/gcse/maths/edexcel/daily-greens` |
| Hot topics | `/gcse/maths/edexcel/topic-heatmap` |
| Lessons | `/gcse/maths/edexcel/lessons` |
| Videos | `/gcse/maths/edexcel/videos` |
| Flashcards | `/gcse/maths/edexcel/flashcards` |
| Scheme of learning | `/gcse/maths/edexcel/scheme-of-learning` |
| Teach Genie | `/gcse/maths/edexcel/teach-genie` |
| Exam builder | `/gcse/maths/edexcel/mock-exam-builder` |
| Grade calculator | `/gcse/maths/edexcel/predicted-grade-calculator` |
| Paper marker | `/classrooms/{id}/paper-marker` |
| Content coverage | `/classrooms/{id}/content-coverage` |
| Classroom settings | `/classrooms/{id}/settings` |

Classroom-scoped URLs append `?classroomId={id}` to the gcse feature pages.

## 6. Feature page anatomy (shared "resource hub" pattern)

- Pink→violet→blue **gradient hero band** at top of content area
- Breadcrumb `GCSE › Maths Edexcel › {Feature}` + right-aligned "Spec 1MA1"
- H1 "{Subject} {Feature}" + bookmark/save button ("Save Maths to your subjects")
- **Resource tab bar**: All resources / Worksheets / Question bank / … (active tab
  cyan text + 2px cyan underline, tab-specific icons, "Pin X to sidebar" pin button,
  `More resources ⌄` overflow)
- Body per feature:
  - Question bank: search + Grade 1…8/9 accordions, per-topic rows w/ radio progress
    circle, "N questions", select-all checkbox, floating **Start revising** pill button
  - Question UI `/gcse/maths/edexcel/grade-1-1-1-addition-and-subtraction/questions/q1`:
    focus mode (sidebar → icon rail), Easy/Medium tabs, question number pagination,
    card w/ marks `[2]`, success rate `46%`, calculator/hints/video icons, Markscheme
    modal (video walkthrough + M1/A1 code list), answer input, `Next question →`
    big cyan button, Baby Genie mascot bottom-right
  - Hot topics: Foundation/Higher toggle + "Course order" sort, "Your priorities"
    (Pro-gated), heatmap table Topic × exam-series (June 2018 … Nov 2020+) with
    colored intensity cells
  - Scheme of learning: numbered stage circles (cyan), Lessons grid (radio cards,
    2-col), Tests sub-list (Test A/B)
  - Grade calculator: Foundation/Higher tabs, series pills (Average / June 2026 /
    June 2025 / Nov 2025 / Nov 2024), grade card "U ↑ 30 marks to 1", 0/240 marks
    progress, Grade boundaries Table/Graph tabs
  - Teach Genie: "Learn by Teaching" (Feynman technique) hero, Start New Session,
    How it works: Pick your topics → Teach Baby Genie → See what stuck
  - Exam builder: "Which topics should it cover?" topic picker (same grade accordions)
- Empty classroom-gated pages (Videos/Lessons/Daily Greens w/o classroom): icon +
  "No GCSE classrooms yet" + cyan "Go to classrooms"; with classroom: pink gradient
  classroom card "Edexcel / My Maths Class / Open →"

## 7. Gamification popovers (header chips)

- **XP**: "3 XP / Unranked / 72 XP to Bronze III / Study time today 0m / x1, x2·30m,
  x3·2h / 30m more to earn all XP at x2 / How does XP work?"
- **Energy**: sleeping-genie illustration, "Everything from the old MathsGenie site is
  still free (doesn't cost energy)", "15 / 20" + 20 dot progress, weekly limits accordion
- **Streak**: orange card, 🔥4 "Day streak", M–S weekly flame calendar, "Top streaks"
  leaderboard (@ck_25 76, @nebularoar 55, …)
- **Profile**: avatar + full name + "Joined 6 days ago" + ✏, menu: My progress / Saved /
  Settings

## 8. `/your-plan` (pricing, dark theme)

Black background page: dark header variant, yellow offer banner, comet-genie mascot,
"Your All-in-one Plan to Breeze Through Your Exams", "UK's #1 Maths Revision Platform"
laurels, Pro feature groups (Learn & Exam Practice / Genie AI Tutor / Marking & Progress),
tutoring-savings calculator (hours: Relaxed 3h / Balanced 5h / Intense 8h; rate:
£40/£55/£70 per hour → "You could save £10,935/year"), comparison table vs AI chatbots /
Save My Exams / Traditional tutoring.

## 9. `/settings/account`

H1 Settings; left nav: Account / Subscription / Preferences / Emails / Privacy & security /
Guardians. Account panel: Customize avatar, name + Edit, Account type (Student/Teacher/P…),
Exam details (qualification, Add school), Subjects & target grades (per-subject option
rows), Account actions (Sign out), Reset progress (confirm), Delete account (confirm).

## 10. Recreation status — question player + popovers (added 2026-10-29)

- Focus mode + player UI: `src/components/player/QuestionPlayer.tsx`, route
  `/gcse/maths/[board]/[topic]/questions/[qid]` (qN), global chrome stripped via
  `Chrome.tsx` FOCUS_PATTERN; AppSidebar returns null on focus routes.
- Question sets: `src/lib/player-questions.ts` — deterministic, our own
  compositions (16 verified template families + handwritten pool fallback).
- HUD popovers rebuilt to this file's §7 spec inside `Header.tsx` (MemberHud,
  exported for the player's focus header).
