# 05 — Design System

Tokens observed in the site's compiled CSS (`/_next/static/chunks/*.css`, Tailwind v4 build) and DOM.

## Palette (observed hex values)

| Role | Value | Where observed |
|---|---|---|
| Paper (light bg) | `#fafafa`, `#f5f5f5` | page backgrounds, cards |
| Ink (primary text) | `#14171c` | headings/body on light |
| Ink solid | `#0a0a0a` | pure text / dark-mode base |
| Panel | `#171717`, `#191919`, `#242424` | dark surfaces |
| Muted text | `#737373` | secondary copy |
| Lines / borders | `#e5e5e5`, `#f0f0f0` | dividers, table rules |
| Soft accent | `#d4ddff` | highlighted chips/badges |
| Deep blue accent | `#075985` | links, informational accents |
| Success / marking | contextual (marking demo green) | answer-marking UI |

Inference: **"paper & ink" editorial palette** — near-white paper, near-black ink,
restrained blue accents, generous whitespace, rounded cards, pill badges.

## Typography

| Token | Observation |
|---|---|
| Display / brand | `MathsGenie Hand` — custom handwritten display font (brand signature) |
| Body | Tailwind default stack: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji"…` |
| Mono | `ui-monospace, SFMono-Regular, Menlo…` |
| Extra tokens | `--font-display`, `--font-ink`, `--font-marking`, `--font-serif` variables |

Recreation strategy: keep system sans for body; substitute an open-licensed
handwritten font (**Caveat**) for the brand/display face — we do not copy their
proprietary font file.

## Component Inventory (DOM observation)

- **Board cards** — rounded-xl cards, cover image, label (6 boards)
- **Mode cards** — icon card pair with `mode-cards/{name}-{dark|light}-tinted.svg`
- **Pill badges** — `inline-flex rounded-full …` (grade chips, F/H tier tags) —
  exact utility string captured in flight payload: `className:"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full font-medium transition-[color,box-shadow] focus-visible:border-ring focus-"`
- **Grade tabs** — horizontal tab strip Grade 1 → 8/9
- **Paper rows** — year heading (`###` series separator in DOM) + paper buttons (Question paper / Mark scheme / Solutions)
- **Accordion FAQs** — course page bottom
- **Cookie banner** — bottom notice, Reject optional / Allow
- **Skip link** — `#main-content` a11y pattern
- **Sticky header** — nav pills, Sign up CTA, Old-site link

## Dark mode

CSS ships `dark:` variants + tinted asset pairs (`-dark-tinted.svg`), i.e. full
dual-theme support. Recreation implements both themes via Tailwind `dark:` class
strategy.

## Motion

Subtle transitions only (`transition-[color,box-shadow]`, hover lifts). No heavy
animation libraries observed — keep recreation CSS-transition based.
