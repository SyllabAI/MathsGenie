# AGENTS.md — MathsGenie Recreation

Working agreement for AI agents (and humans) contributing to this repository.
Conventions adopted from [obra/superpowers](https://github.com/obra/superpowers);
cloning workflow from [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template);
analysis methodology from [morluto/rea](https://github.com/morluto/rea).

## What this repo is

A research-driven recreation of mathsgenie.co.uk:

- `data/` — parsed factual catalog (topics, papers, courses) as JSON. **Metadata only.**
- `research/` — reverse-engineering docs with evidence citations (rea-style).
- `src/` — Next.js 16 (App Router, React 19, TS strict, Tailwind v4) recreation.
- `scripts/` — crawler/parser that regenerates `data/`.
- `docs/plans/` — task plans following superpowers' bite-sized-task format.

## Non-negotiable constraints

1. **No copyrighted content.** Never commit PDFs, question text beyond trivial
   samples, images, fonts, or media from mathsgenie.co.uk / awarding bodies.
   Resources are *linked*, not copied. Sample questions used for UI demos must be
   original compositions on standard curriculum topics.
2. **Outbound attribution.** Any page linking out to the original carries a
   visible attribution note.
3. **Match slugs & routes** of the original (`grade-{t}-{g}-{i}-{slug}`) so data
   stays diffable against the source of truth.
4. **TypeScript strict + ESLint clean** — `npm run check` must pass before push.

## Workflow (superpowers)

1. **Brainstorm** — clarify the change before coding; capture in the PR/commit.
2. **Plan** — write tasks to `docs/plans/` as checkboxes, 2–5 min per task.
3. **Work in a branch/worktree**; keep `main` buildable (`npm run build`).
4. **TDD where practical** — data transforms in `scripts/` get assertions;
   components get build + type checks.
5. **Review before merge** — severity-tagged findings, evidence cited.

## Data pipeline

```bash
python3 scripts/build_catalog.py   # crawl_raw/ → data/  (see research/06)
```

If site structure changed, re-run the crawl (see research/06-parsing-methodology.md),
update parser, regenerate JSON, commit data + research updates together.

## Skills

`.agents/skills/clone-website/` — canonical Map→Observe→Build→Compare skill.
`.agents/skills/reverse-engineering/` — rea-style evidence-first analysis skill.
