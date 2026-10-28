# Skill: reverse-engineering (rea-style)

Adapted from morluto/rea methodology for website targets. Principles:
inspect → cite evidence → state limitations → never guess silently.

## Process

1. **Frame the question.** One feature per investigation ("How does the grade
   calculator work?" not "recreate the site").
2. **Collect evidence.** Raw HTML, flight payloads, CSS, network namespaces.
   Save under `crawl_raw/` (gitignored) or quote precisely in research docs.
3. **Decode.** Prefer embedded data (RSC flight JSON) over rendered DOM guesses.
   Document extraction regex/parsers in `scripts/`.
4. **Conclude with citations.** Every claim in `research/` links to its evidence
   source (file + the exact string/key observed).
5. **State limitations.** Auth-gated or client-fetched behavior is explicitly
   marked "not captured" — with the reason (ToS, auth, copyright).
6. **Respect boundaries.** No authenticated scraping, no media re-hosting, no
   bulk content copying. Metadata and structure only.

## Output format

Write findings to `research/features/{NN}-{feature}.md` using the template:
Behaviour → Evidence → Limitations → Recreation status/plan.
