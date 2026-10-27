# Feature 02 — Topic Pages & Mode Cards

## Behaviour on original

Topic URL: `/gcse/maths/{board}/grade-{t}-{g}-{i}-{slug}`. The page shows:

1. Breadcrumb (GCSE → Maths → Board → topic title).
2. **Mode cards** — icon tiles linking to per-topic sub-resources:
   - Questions (question bank) → `{topic}/questions`
   - Videos → `{topic}/videos`
   - Revision notes / guides, Flashcards, Lessons (availability varies)
   - Question Rush for the topic → `{topic}/question-rush`
   - Mock exam builder (tools strip)
3. Each mode has light/dark icon variants from `assets.mathsgenie.co.uk/mode-cards/{name}-{light|dark}-tinted.svg`.
4. Metadata uses schema.org `learningResourceType`; walk-through media hosted at `assets.mathsgenie.co.uk/walkthroughs/review/*.mp4|jpg`.

## Evidence

- topic_substitution.html flight: mode refs `['/gcse/maths/edexcel/grade-3-3-13-substitution/videos', 'Video', 'Videos', '…/mode-cards/videos-dark-tinted.svg', '…question-bank…', '…question-rush-v5…', '…exam-builder…']`; `learningResourceType`, `LearningResource` keys.
- Questions page flight: walkthrough MP4/JPG pairs; `formulaUrl` → `board-resources/gcse-maths/gcse-formulae-to-remember.pdf`; React Query keys (`initialQuestionWindow`, `difficultyBand`, `calculatorUse`, `finalAnswers`, `explanation`).

## Recreation

- `src/app/gcse/maths/[board]/[topic]/page.tsx` — hero (title, grade badge, board chip), `ModeCards` grid linking to recreated mode pages; where a mode is not recreated, the card links **out to the original site** (clear attribution footnote on every topic page).
- Icons: hand-drawn inline SVGs, `dark:` variants swapped via CSS.
- Question-bank page: sample static questions in the same UI pattern (question card, marks pill, calculator flag, reveal-answer), plus outbound link to the full bank on the original.
