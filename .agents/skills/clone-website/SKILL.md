# Skill: clone-website

Adapted from JCodesMore/ai-website-cloner-template for this repo's target
(mathsgenie.co.uk). Four phases; do not skip.

## 1. MAP
- Crawl target pages with a browser-like UA; save raw HTML (see research/06).
- Build the URL taxonomy (research/02); map source URLs → local routes.
- Preserve prior work: check git log + research/ before re-crawling.

## 2. OBSERVE
- Inspect desktop (1440) + mobile (390) renderings of key pages.
- Decode RSC/flight payloads for embedded data (research/04).
- Extract design tokens from compiled CSS (research/05).
- Record evidence: file, size, exact strings. No claim without a citation.

## 3. BUILD
- Implement routes per research/07 map, data-driven from `data/*.json`.
- Components in `src/components`, primitives in `src/components/ui`.
- Tailwind v4 tokens; support dark mode; match spacing/typography scales.
- Interactions working client-side (tabs, sliders, timers); no backend calls.

## 4. COMPARE
- `npm run build` must pass; then side-by-side screenshots vs live site at
  matched viewports/states; log diffs as issues; iterate.
- Re-run this checklist before merge.
