# Build Plan — MathsGenie Recreation

Superpowers-style plan: bite-sized tasks, executed in order. Status updates inline.

## Phase 0 — Research & Data ✅
- [x] Crawl 22 pages (~6.3 MB raw evidence)
- [x] Decode RSC flight payloads
- [x] Build catalog: 667 courses, 6×134 GCSE topics, 44 A-Level topics, 15 series papers
- [x] Extract design tokens
- [x] Write research/ docs (7 core + 12 feature briefs)

## Phase 1 — Frontend scaffold
- [x] Next.js 16 App Router + TS strict + Tailwind v4
- [x] Design system: paper/ink palette, Caveat display font, dark mode
- [x] Header (nav pills + mega-menu + signup CTA), Footer, CookieBanner, Badge

## Phase 2 — Content routes
- [x] `/` homepage sections
- [x] `/gcse` board grid + sections + FAQ
- [x] `/gcse/maths/[board]` grade tabs + topic list (6 boards, SSG)
- [x] `/gcse/maths/[board]/[topic]` mode cards
- [x] `/gcse/maths/[board]/papers` series catalog (outbound links)
- [x] `/a-level/maths/edexcel` module browser
- [x] Resource hub pages (worksheets / revision-guides / lessons / videos / flashcards)

## Phase 3 — Tool & game UIs
- [x] `/gcse/question-rush` timed game (client)
- [x] `/gcse/daily-greens` deterministic daily set + streak
- [x] `/ask-genie` chat shell (demo mode)
- [x] `/features/revision-planner` local planner
- [x] `/gcse/maths/[board]/predicted-grade-calculator` working sliders
- [x] `/gcse/maths/[board]/mock-exam-builder` topic picker stub

## Phase 4 — Ship
- [x] `npm run check` (lint + typecheck + build) green
- [x] README + LICENSE (MIT) + .gitignore
- [x] Push to github.com/SyllabAI/MathsGenie
- [ ] Post-build visual compare (screenshots) — tracked as follow-up issue
