# Feature 08 — Predicted Grade Calculator

## Behaviour on original

1. Per-course route: `/gcse/maths/{board}/predicted-grade-calculator` (linked from course "Tools" section).
2. Sliders per paper (three GCSE papers 1–3, F/H tiers) → totals mapped against grade boundaries → predicted grade + "marks to next grade".
3. A-Level variant uses the three A-Level papers; TikTok buzz around "grade calculator sliders" confirms slider-based UX.
4. Also marketed on homepage as "Predicted Grade Calculator" section.

## Evidence

- grade_calc.html (269 KB): slider UI shell; tools link on gcse.html (`/gcse/maths/edexcel/predicted-grade-calculator` et al. for all 6 boards).
- GCSE papers structure (1F/1H/2F/2H/3F/3H, 80 marks/paper) from papers catalog; boundaries vary by series/tier (public knowledge).

## Recreation

- `src/app/gcse/maths/[board]/predicted-grade-calculator/page.tsx` — fully working: three paper sliders (0–80), tier toggle F/H, editable boundary table (sample 2023-style boundaries preloaded), live predicted grade chip + "X marks to next grade" line, dark-mode aware.
- Clearly labelled as an approximation with editable boundaries (original uses official series boundaries server-side).
