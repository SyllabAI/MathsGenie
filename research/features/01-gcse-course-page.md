# Feature 01 — GCSE Course Page & Grade-Tab Topic Browser

## Behaviour on original (`/gcse` → `/gcse/maths/{board}`)

1. `/gcse` shows 6 board cards + sectioned resource grid (Popular / Practice / Learn / Tools) + FAQ accordion.
2. Course page opens the topic browser: horizontal grade tabs `Grade 1 … Grade 8/9`.
3. Selecting a tab lists that grade's topics in order (slug index preserved).
4. Every topic row links to the topic page; side links to course-level modes.
5. Tier note: Foundation covers grades 1–5, Higher covers 4–9.

## Evidence

- Flight payload rows: `{"id":"s3-r13","slug":"grade-4-4-14-cylinders","title":"Cylinders","topicId":"…","href":…}` (gcse_edexcel.html).
- Counts: 134 topics per board across all 6 boards (parser output, build_catalog.py).
- Grade 1: 13 topics (Addition & Subtraction … Pictograms); Grade 2: 17 (Calculation Problems … Pie Charts); Grade 3: 20 (Error Intervals … Two Way Tables) — `data/gcse-maths/topics-edexcel.json`.

## Recreation

- `src/app/gcse/page.tsx` — board grid + resource sections + FAQ (native details accordion).
- `src/app/gcse/maths/[board]/page.tsx` — imports `topics-{board}.json`, client `GradeTabs` with `searchParams`-synced tab state, `TopicList` rows.
- `generateStaticParams` pre-renders all 6 boards; per-grade filtering is client-side for instant tab switches.
