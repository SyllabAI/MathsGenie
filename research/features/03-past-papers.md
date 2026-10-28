# Feature 03 — Past Papers Catalog

## Behaviour on original (`/gcse/maths/{board}/papers`)

1. Series headings in reverse-chronological order: June 2025, November 2024, … June 2017 (15 series for Edexcel).
2. Each series lists 6 papers: `Paper 1 Non-Calculator 1MA1/1F/1H`, `Paper 2 Calculator 1MA1/2F/2H`, `Paper 3 Calculator 1MA1/3F/3H` with F/H tier pills.
3. Per-paper buttons: **Question paper**, **Mark scheme**, **Solutions** (availability varies; Nov 2018 and earlier typically lack solutions).
4. Copy above list: papers "with mark schemes and worked solutions where available… Genie marks it question by question against the mark scheme" (upload-and-mark upsell).
5. Resources served from `assets.mathsgenie.co.uk/papers/{board}/gcse-maths/{resource-dir}/…pdf`; also mini-tests (`papers/gcse-maths/mini-tests/f5/F5MiniTest1.pdf`) and predicted-paper sets (e.g. `gcse-maths-edexcel-predicted-current-2026-predicted-paper-2-foundation/`).

## Evidence

- gcse_edexcel_papers.html flight: 15 series strings; 136 unique PDF URLs; 52 resource groups; paper-code tokens `1MA1/{1F,1H,2F,2H,3F,3H}`.
- Rendered page observation (papers listing): June 2025 → Sample sections with per-paper button triplets.

## Recreation

- `data/gcse-maths/papers-edexcel.json` — series list, paper codes, resource groups (dirs + file names).
- `src/app/gcse/maths/[board]/papers/page.tsx` — series sections with paper rows; **Question paper / Mark scheme buttons open the original PDF URL** (outbound, attribution note) — no PDFs re-hosted in this repo.
- UI: year heading, tier pills (F blue / H purple), resource button row per paper.
