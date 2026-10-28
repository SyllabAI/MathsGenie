# 08 — A-Level Module Regroup (Year 1 / Year 2)

Date: 2026-10-29 · Trigger: A-Level hub v2 restyle (`a-level-v2-restyle/1`).

## Claim

The live site's A-Level hub (`mathsgenie.co.uk/a-level/maths/edexcel`) now presents
the Edexcel A-Level Maths catalog grouped by **Year 1 / Year 2** modules, replacing
the AS / A2 style grouping captured in the original crawl. The 44-topic set is
unchanged — only the grouping moved.

## Evidence (fetched 2026-10-29)

- Live hub page (`/a-level/maths/edexcel`, 200): module headings observed in DOM
  text — `Year 1 Pure Mathematics`, `Year 1 Statistics`, `Year 1 Mechanics`,
  `Year 2 Pure Mathematics`, `Year 2 Statistics`, `Year 2 Mechanics` — with
  `Spec 9MA0` in the hero and tabs `Topics` / `Resources`.
- Live lessons page (`/a-level/maths/edexcel/lessons`, 200): per-topic outbound
  links follow `{catalog-slug}/lessons` (e.g.
  `/a-level/maths/edexcel/as-pure-mathematics-1-algebraic-expressions/lessons`),
  confirming the original still serves topics under the exact slugs already in
  `data/a-level-maths/topics-edexcel.json` — no slug migration happened.
- Count check: 14 + 7 + 3 + 12 + 3 + 5 = 44 = parsed `topic_count`. Every live
  title resolves 1:1 to an existing parsed slug, so the regroup is a pure
  presentation change.
- Live A-Level Teach Genie tab exists, but `/a-level/maths/edexcel/teach-genie`
  currently renders "This page may have been moved or removed" (404-in-200) —
  the route is dead on the original. The recreation ships a working interactive
  demo for that route instead.

## Mapping applied (old → new, arithmetic-checked)

| Old module (parsed catalog) | N | New module (live) | N |
|---|---|---|---|
| AS Pure Mathematics | 14 | Year 1 Pure Mathematics | 14 |
| AS Statistics | 7 | Year 1 Statistics | 7 |
| AS Mechanics | 3 | Year 1 Mechanics | 3 |
| Pure Mathematics Year 2 (11) + Pure Mathematics Year 1 (1) | 12 | Year 2 Pure Mathematics | 12 |
| Statistics Year 1 (1) + Statistics Year 2 (2) | 3 | Year 2 Statistics | 3 |
| Mechanics Year 1 (1) + Mechanics Year 2 (4) | 5 | Year 2 Mechanics | 5 |

Slugs and hrefs are byte-identical to the parsed catalog (AGENTS.md: match slugs
so data stays diffable). The regroup script asserts each slug is used exactly
once and the total is 44 before writing.

## Consequences for the recreation

- `/a-level/maths/edexcel` renders module sections in the live Year 1/Year 2 order.
- Lessons/Teach Genie hubs group topic pickers by the same six modules.
- `spec: "9MA0"` is now part of the topics doc (observed in the live hero).
