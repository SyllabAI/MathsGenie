# 03 — Information Architecture

## Primary Navigation (persistent header)

| Label | Href | Notes |
|---|---|---|
| Home | `/` | |
| Revision planner | `/features/revision-planner` | tool landing page |
| Ask Genie AI | `/ask-genie` | AI chat assistant |
| Worksheets | `/gcse/worksheets` (a-level variant) | |
| Question Rush | `/gcse/question-rush` (a-level variant) | timed drill |
| Daily Greens | `/gcse/daily-greens` (a-level variant) | daily problems |
| Ideas + feedback | `/feature-requests` | |
| Sign up | `/auth/signup?redirectTo={path}` | auth |
| Old site | external link to legacy pages | |

## Page Hierarchy

```
Home
├── Qualification hubs (GCSE / IGCSE / A-Level / AS / KS2 / IAL / IAS)
│   └── Subject pages → Board pages (course)
│       ├── Course home: mode grid (Popular / Practice / Learn / Tools)
│       ├── Topic pages (grade tabs → topic list → topic page)
│       │   └── Topic modes: questions / videos / revision-guides / flashcards / lessons / question-rush
│       ├── Papers (series → paper → question paper / mark scheme / solutions)
│       ├── Worksheets, mini-tests, 45-min-tests, predicted-papers
│       └── predicted-grade-calculator, mock-exam-builder
├── Tools: Revision planner, Ask Genie AI, Answer marking, Lesson starters, Grade calculator
├── Question Rush (global + per-topic)
├── Daily Greens (global + per-qualification)
└── Blog + Feature requests
```

## Course Page Section Order (observed on /gcse)

1. **Pick your exam board** — 6 board cards (AQA, Edexcel, Eduqas, OCR, WJEC, CCEA)
2. **Popular** — worksheets, past papers, question bank
3. **Practice** — predicted papers, mini tests, 45 min tests (with one-line descriptions)
4. **Learn** — revision guides, lessons, videos, flashcards
5. **Tools** — predicted grade calculator, mock exam builder
6. **FAQs** — accordion (board availability, where to find papers, free?, cross-board revision)

## Homepage Sections (observed order)

1. Hero: "Your All-in-One Resource to Crush Your GCSEs & A Levels" + CTA
2. "See the all new MathsGenie" strip
3. "Learn every topic your way" — sample lesson (Solving Quadratics: what you'll learn, factorising steps)
4. "Practise until exam day feels easy" — question practice demo
5. "Get your answers marked like an examiner" — marking demo (strengths, 40/40)
6. Upload & Mark Past Papers
7. Predicted Grade Calculator
8. "Meet Genie — Your AI Study Partner" (Always available…, Know exactly where you stand…, feedback 61/80)
9. Qualification mega-menu (667 courses) in nav
10. Footer: Tools / Company columns + cookie consent (Reject optional / Allow)

## Course Catalog (parsed from home mega-menu)

| Qualification | Courses |
|---|---|
| GCSE | 189 |
| IGCSE | 91 |
| A-Level | 172 |
| AS-Level | 106 |
| KS2 | 1 |
| International A-Level | 60 |
| International AS-Level | 48 |
| **Total** | **667** |

Full list: `data/subjects.json`. Boards observed: AQA, Edexcel, OCR, WJEC, Eduqas, CCEA (+ OCR Twenty First Century, AQA Synergy science variants).

## A-Level Maths (new spec) Module Structure

44 topics parsed from `/a-level/maths/edexcel` RSC payload, classified by slug prefix:

| Module | Topics |
|---|---|
| AS Pure Mathematics | 14 |
| Pure Mathematics Year 2 | 11 |
| AS Statistics | 7 |
| Mechanics Year 2 | 4 |
| AS Mechanics | 3 |
| Statistics Year 2 | 2 |
| Pure Y1 / Stats Y1 / Mech Y1 (shared slugs) | 3 |

Legacy A-Level (Spec 9371): C1–C4, S1, M1 per-topic resources + Solomon worksheets (old `/alevel.html`).

## GCSE Maths Topic Distribution (all 6 boards identical)

| Grade tab | Topics |
|---|---|
| 1 | 13 |
| 2 | 17 |
| 3 | 20 |
| 4–9 | remaining 84 across tabs incl. 8/9 |
| **Total** | **134** |
