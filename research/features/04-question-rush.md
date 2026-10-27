# Feature 04 — Question Rush

## Behaviour on original

1. Global entry `/gcse/question-rush` (also per-qualification `/a-level/question-rush`) and per-topic `{topic}/question-rush`.
2. Grade-tab navigation (Grade 1 … 8/9) selects a topic pool; e.g. OCR route `grade-3-3-13-substitution/question-rush` shows "Substitution" drill.
3. Fast-paced timed drill: rapid-fire questions, immediate feedback, score/streak tracking. Board-scoped pools (AQA/OCR/Eduqas/CCEA routes observed in the wild).
4. Auth-gated beyond a sample (Sign up CTA in header).

## Evidence

- question_rush.html (228 KB): nav + Question Rush heading, grade tabs; per-topic routes indexed by search engines (`grade-8-9-8-3-proof/question-rush`, `grade-7-7-10-iteration/question-rush`).
- Mode-card asset `question-rush-v5-{dark,light}-tinted.svg` in topic flight — v5 naming implies iterative redesigns of this feature.

## Recreation

- `src/app/gcse/question-rush/page.tsx` — grade tabs → topic picker → `QuestionRushGame` client component.
- Game: 60-second timer, question card from a built-in sample set (per grade), instant right/wrong flash, streak + score HUD, end screen with best-streak (localStorage).
- Per-topic entry from topic pages; "full question pool → original site" outbound CTA.
