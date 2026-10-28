# Feature Inventory

Complete feature surface of mathsgenie.co.uk (new site, Oct 2026), with implementation
notes for the recreation. Evidence references: see [../06-parsing-methodology.md](../06-parsing-methodology.md).

| # | Feature | Type | Auth | Data source on original | Recreation |
|---|---|---|---|---|---|
| 1 | Qualification mega-menu (667 courses) | Navigation | No | Server-rendered anchors | ✅ from `subjects.json` |
| 2 | GCSE Maths course page (6 boards) | Content | No | RSC flight: mode grid + FAQ | ✅ |
| 3 | Grade-tab topic browser (134 topics × 6 boards) | Content | No | RSC flight topic rows | ✅ from `topics-*.json` |
| 4 | Topic pages + mode cards | Content | No | RSC flight | ✅ |
| 5 | Question bank (per topic) | Interactive | Partial (beyond sample) | React Query client APIs | ✅ UI shell + outbound links |
| 6 | Past papers catalog (15 series) | Content | No | RSC flight: series + resource URLs | ✅ catalog, links out |
| 7 | Predicted papers / mini tests / 45-min tests | Content | Partial | Asset CDN PDF groups | ✅ catalog rows, links out |
| 8 | Question Rush | Game | Partial | Client APIs, per-topic routes | ✅ client-side game UI |
| 9 | Daily Greens | Content | Partial | Daily problem feed | ✅ deterministic daily picker |
| 10 | Revision Guides / Worksheets / Flashcards / Lessons | Content | Partial | Asset CDN + client APIs | ✅ hub pages + links out |
| 11 | Videos (per topic) | Content | No | Topic `/videos` routes | ✅ hub + links out |
| 12 | Ask Genie AI | AI chat | Yes | Authenticated AI API | ✅ UI shell, no backend |
| 13 | Answer marking (upload & mark) | AI marking | Yes | Upload + marking APIs | documented only |
| 14 | Mock exam builder | Composer | Partial | Question metadata APIs | documented + UI stub |
| 15 | Predicted grade calculator | Tool | No | Static grade boundaries | ✅ fully working |
| 16 | Revision planner | Tool | Yes (persist) | Planner APIs | ✅ local-state UI |
| 17 | Lesson starters | Tool | — | — | documented only |
| 18 | Blog / Feature requests | Content | No | — | footer links only |
| 19 | Auth (signup/redirectTo) | Auth | — | `/auth/signup` | stub links |
| 20 | Dark mode + cookie consent | Platform | No | CSS + banner | ✅ both implemented |

## Cross-cutting behaviours

- **Tier system**: Foundation (grades 1–5) / Higher (4–9); topics tagged per grade tab.
- **Board parity**: identical 134-topic structure across Edexcel/AQA/OCR/WJEC/Eduqas/CCEA.
- **Old-site bridge**: "Old MathsGenie" links preserved for legacy pages.
- **A11y**: skip-to-content link, focus-visible rings, semantic headings.
- **i18n**: none (English only).
