# 11 — AS Level hub, qualification Daily Greens, homework & tests flows

Session date: 2026-10-29. Follow-ups to `08-a-level-module-regroup.md`,
`10-qualification-hubs-rail-popovers.md` and `04-member-area.md`.

## 1. AS Level (original capture, logged-out RSC payloads)

- `https://www.mathsgenie.co.uk/as-level` — **"AS Level Subjects"** hub,
  same deck-card pattern as `/a-level`:
  - **Popular (15)**: Maths, Further Maths, Psychology, Biology, Chemistry,
    Business, Physics, History, Sociology, Economics, Art and Design,
    Geography, English Literature, Politics, Computer Science.
  - **Other subjects (17)**: Design And Technology, Drama, English Language,
    English Language And Literature, French, German, Latin, Law, Media
    Studies, Music, Physical Education, Spanish, Welsh, Chinese, Classical
    Civilisation, ICT, Religious Studies, Russian.
  - Plain `<a>` hrefs captured for the direct-link cards:
    Latin→`/as-level/latin/ocr`, Welsh→`/as-level/welsh/wjec`,
    Chinese→`/as-level/chinese/edexcel`,
    Classical Civilisation→`/as-level/classical-civilisation/ocr`,
    ICT→`/as-level/ict/wjec`, Russian→`/as-level/russian/edexcel`.
    Popular cards navigate via JS (choose-exam-board menus), as on /a-level.
- `https://www.mathsgenie.co.uk/as-level/maths/edexcel` — course page:
  - H1 "Maths", chip **Spec 8MA0** (not 9MA0 — AS is its own spec code),
    description "815 exam-style questions, 151 worksheets, past papers
    2018–2025", tabs Topics | Resources.
  - 24 parent topics in 3 modules: **AS Pure Mathematics (14)**,
    **AS Statistics (7)**, **AS Mechanics (3)** — the AS subset of 9MA0,
    grouped AS-style (not Year 1/Year 2).
  - 132 subsection slugs also in the payload (e.g.
    `as-pure-mathematics-1-5-surds`, `as-statistics-box-plots`) — archived
    in `data/as-level-maths/topics-edexcel.json` under each parent.
  - Assessment: Paper 1 Pure 2h/100 marks/62.5%; Paper 2 Stats+Mech
    1h 15m/60 marks/37.5%.
- `https://www.mathsgenie.co.uk/as-level/daily-greens` and `/ks2/daily-greens`
  (both 200): qualification-level landing — H1 "X Daily Greens" + the
  one-line description + a single "Maths" subject card. The worksheet flow
  itself is classroom-gated.

## 2. Replica implementation

| Route | Component | Notes |
| --- | --- | --- |
| `/as-level` | `components/as-level/AsLevelHub.tsx` → `a-level/ALevelHub` | generalized hub (title/subjects/hrefFor props); deck cards via shared `SubjectDeckCard` (added `hrefFor` + `internalSlug` props) |
| `/as-level/maths/edexcel` | `components/courses/CourseBody` | Spec 8MA0, 3 module groups (24 topics), assessment table, aims, 7 FAQs (answers are our own words) |
| `/a-level/daily-greens` `/as-level/daily-greens` `/igcse/daily-greens` `/ks2/daily-greens` | `components/member/QualDailyGreens.tsx` | original landing pattern + interactive set |
| `/classrooms/homework` | wizard (3 steps) | choose classroom → tasks (`TaskPicker`, grade accordions + per-topic question stepper) → title + due date |
| `/classrooms/test` | wizard (3 steps) | classroom → topics+counts → title + duration slider |
| `/classrooms/test/{id}` | timed runner | countdown chip, auto-submit at 0:00, per-question marks, retake |

- `src/lib/assignments.ts` — localStorage store (keys `mg-homework`,
  `mg-tests`, `mg-results`) with hooks, mirrors `lib/classrooms.ts`.
- `src/lib/questions.ts` — per-qual banks (A-Level pure/stats/mech 12,
  IGCSE 10, KS2 10; all our own compositions) + `dailySetFor(qual)` with
  per-qual seed offsets (deterministic daily set per qualification) +
  `isAnswerCorrect()` tolerant marker (units/currency/"x =" prefixes,
  numeric equality 5.0 == 5) used by Daily Greens and the test runner.
- `DailyGreensClient` gained `qual` prop; per-qual streak storage
  (`mg-greens-{qual}`); GCSE keeps `mg-greens`.
- Cross-links fixed: header FLYOUT AS Level → `/as-level` (was original
  aslevel.php); A-Level tab "Daily Greens" now internal; KS2 quick link
  internal; IGCSE course Daily Greens tile internal; dashboard starter
  "Make a test" → `/classrooms/test`.

## 3. Flow verification (production build, localhost:3111)

- AS hub + course + both Daily Greens pages 200; screenshots in
  `crawl_raw/replica/replica-as-*.png`.
- Homework: seeded classroom → 3-step wizard (ticked Addition and
  Subtraction ×5 + Pythagoras ×5, due 2026-11-05) → card "Homework 1 ·
  10B Maths · Due in 8 days · 2 tasks · 10 questions" → "Mark handed in"
  toggles to Reopen ✓ (`replica-homework-*.png`).
- Test: 10B Mid-topic Test (Angles ×2, Area and Perimeter ×2, 10 min) →
  runner built 4 topic-matched questions, timer counted 10:00→09:55,
  answers "28/68/22/78.5" (vs stored "x = 28", "68°", "22 cm", "78.5 cm²")
  → **6/6 marks** via the tolerant marker → "Best 6/6" chip on the card
  (`replica-test-*.png`).
- Known demo limitation: the paper builder fills missing topics from the
  sample bank (only ~45 GCSE-style questions exist), so large tests
  repeat topics rather than real per-topic question sets.
