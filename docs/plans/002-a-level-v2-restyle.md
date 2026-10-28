# 002 — A-Level hub v2 restyle + Teach Genie / Lessons interactive content

Branch: `a-level-v2-restyle/1` · Date: 2026-10-29 · Repo working agreement: AGENTS.md.

## Goal

Bring the A-Level hub to the v2 visual identity (parity with the restyled GCSE
surfaces from commit `19625a08b`) and give the A-Level route real interactive
Teach Genie / Lessons content instead of v1-era static lists.

## Evidence base

- Live original now renders `/a-level/maths/edexcel` with the v2 template:
  aurora hero band, `Spec 9MA0`, Topics/Resources tabs, module topic browser,
  Assessment at a glance, Course aims & skills, FAQ (observed 2026-10-29).
- Live A-Level lessons links use `{catalog-slug}/lessons` — catalog slugs
  unchanged, only module grouping moved (see `research/08-a-level-module-regroup.md`).
- Live A-Level Teach Genie tab exists but the route is dead (404-in-200) — the
  recreation ships a working interactive demo.

## Tasks

- [x] Regroup `data/a-level-maths/topics-edexcel.json` to Year 1/Year 2 (asserts: 44/44, slug-preserving)
- [x] Research note for the regroup (`research/08-a-level-module-regroup.md`)
- [x] `ALevelHubShell` — v2 gradient hero chrome + A-Level resource tab taxonomy
- [x] Restyle `/a-level/maths/edexcel` — aurora hero, Topics/Resources tabs, module browser, assessment table, aims & skills, FAQ
- [x] Original-composition lesson data (`data/a-level-maths/lessons-edexcel.json`, 6 starter lessons)
- [x] `/a-level/maths/edexcel/lessons` hub — filter pills All/Year 1/Year 2, interactive markers
- [x] `/a-level/maths/edexcel/lessons/[topic]` — interactive step-by-step LessonPlayer (reveal worked examples, instant-feedback quick checks)
- [x] `/a-level/maths/edexcel/teach-genie` — interactive Feynman session (explain → spot gaps → what stuck), copy-to-clipboard export
- [x] `npm run check` green (lint + typecheck + production build)
- [ ] Review (severity-tagged) then merge

## Non-goals

- No copyrighted content: all lesson/session text is original composition on
  standard curriculum topics; outbound links still go to the original.
- No AI backend: Teach Genie is an honest client-side demo (labelled as such).
