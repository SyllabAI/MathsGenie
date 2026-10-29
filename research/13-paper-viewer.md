# 13 — Fullscreen Paper Viewer (question papers + mark schemes)

Probed live on mathsgenie.co.uk (logged-out) — route `/paper/gcse/maths/edexcel/gcse-maths-2025-june-1ma1-1f`.

## Original structure (captured from live DOM + RSC payload)

### Route + data model
- List page: `/gcse/maths/edexcel/papers` — SSR HTML with series accordions
  (`aria-label="June 2025 Papers"`), cover thumbnails
  (`assets.mathsgenie.co.uk/papers/covers/paper-{uuid}.jpg`), per-paper cards.
- Viewer route: `/paper/{board}/{subject}/{slug}` (Next.js `FullscreenPaperViewer` component).
- RSC payload embeds the full paper object:
  `slug, title ("June 2025 - Paper 1F 1MA1/1F"), level, examYear, session, paperLabel,`
  `paperUrl, markSchemeUrl, workedSolutionUrl, insertUrl, youtubeVideoUrl` (etc).
- **PDF host**: `assets.mathsgenie.co.uk/sources/genie/past-papers/{year}/pearson/gcse-maths/{code}/question-paper-*.pdf` / `mark-scheme-*.pdf` — CORS `access-control-allow-origin: *` (verified), so client-side pdf.js rendering works.

### Viewer chrome (from live probing, re-verified session 12)
- Top bar: back arrow (no title text) · **View mark scheme** (cyan pill, #35b3c9; toggles → "Hide mark scheme")
  · Download · Print · Log your mark (icon, aria "Log your mark for {title}") · ⋯ More controls ·
  (Sign up when logged out). Mark echo chip appears after saving.
- **Print popover**: "Print now" button + heading "Send it to someone to print" +
  "Their email" textbox + Cloudflare captcha + Send (disabled until verified).
- **More controls menu**: Formula sheet · Calculator · Report an issue.
- **Split workspace**: 1 pane by default; "View mark scheme" adds a second pane side by side.
  Each pane header: document combobox (aria "Left pane"/"Right pane" → Question paper / Mark scheme /
  Formula sheet) + **"Show papers" dark circle** (flips to "Hide papers"; the annotation toolbar
  hides while the papers sidebar is open) + per-pane Download + "Close left/right split pane".
- **Papers sidebar** (from "Show papers"): series accordions (June 2025, November 2024, …
  down to 2000 Mini tests), items "Paper 1F · F" etc., current paper highlighted cyan;
  clicking navigates inside the viewer route.
- **Divider between panes** is an accessibility slider (aria-valuenow 50), draggable.
- **Zoom**: per-pane − / + rail pinned at the pane's top-right edge (no % label).
- **Pages render to `<canvas>`** as regions "Page N" (pdf.js-style; no iframes, no embeds).
- **Toolbar** (floating bottom, text tool ACTIVE on load): Undo, Redo, Clear all, Browse,
  Select, Text, Math text box, Draw, Erase, **Pen colour: Black** (popover: 6 swatches
  Black/Red/Blue/Green/Purple/Orange, ring on selected), **Pen thickness: Medium** (popover:
  4 dot sizes), Line, Ruler, Protractor, Compasses, ✕ Collapse → floating round pen handle
  re-opens it. (No separate highlighter button — the highlighter-looking icon IS "Erase".)
- **Text tool default**: "Put your answer down" popover — "Click anywhere in the box and type
  your working. It saves as you go." with `Add text` placeholder + watermarked answer boxes.
- **Log your mark dialog**: "Your mark [0] / Paper total [80] / Save mark / Just mark as done".
- **Calculator**: floating fx-83GT CW emulator (light title panel "Calcula…" + model dropdown
  fx-83GT CW / fx-991 CW + minimise ^ + ✕; dark navy body, pill keys, full CW layout:
  ON/HOME, cursor pad + OK, SHIFT (blue) / VARIABLE / FUNCTION / CATALOG / TOOLS,
  x x□ √□ x■ x² log□, Ans sin cos tan ( ), numpad with ⌫/AC, ×10■, EXE).
- **Open Ask Genie** floating dark rounded-square mascot button (bottom right).
- The original keeps its **site left rail** visible inside the viewer.

## Recreation (this repo)
- `scripts/crawl_past_papers.py` → `data/gcse-maths/papers-past-edexcel.json`
  (14 series, 83 papers, 83 question PDFs + 83 mark schemes + 59 worked solutions, all with covers).
- Route `src/app/paper/[board]/[slug]/page.tsx` (Suspense-wrapped) →
  `src/components/paper/PaperWorkspace.tsx` (~1200 lines):
  - pdfjs-dist 4.x, worker at `public/pdf.worker.min.mjs`; PDFs streamed from the original host (never re-hosted).
  - Split panes with doc dropdown / close / per-pane zoom; ops model
    `{page, kind: stroke|line|arc|text}` normalised 0–1 per page, drawn on overlay canvases;
    undo/redo stacks per document; annotations persisted to localStorage per slug.
  - Toolbar parity: browse / text / math text / pen / highlighter / eraser / 4 colours /
    3 thicknesses / line / ruler (draggable cm straightedge) / protractor (draggable, degree ticks) /
    compasses (drag centre→radius, commits an arc op).
  - Text boxes reproduce the "Put your answer down" popover; saved as you go (debounced localStorage).
  - Log your mark dialog + top-bar echo ("Your mark: 64/80"), persisted `mg-paper-marks-v1`.
  - fx-83GT-style calculator (functional: arithmetic, sin/cos/tan in degrees, log/ln, √, x^, π, DEL/AC/EXE).
  - `?doc=markscheme|formula` deep link opens the split view directly (used by index cards).
- Papers index `src/app/gcse/maths/[board]/papers/page.tsx` restyled to the original:
  search + type/year filters, series accordions, cover cards, buttons → viewer route
  (Question paper / Mark scheme / Solutions). Non-Edexcel boards keep a note + original link.
- Chrome suppression: `/paper/` added to `FOCUS_PATTERN` (header/footer) + CookieBanner hidden —
  the viewer is a fullscreen route exactly like the original.

## Verification
- clone-paper-viewer2.png (single pane), clone-paper-dual.png (split), clone-paper-draw.png
  (pen stroke), clone-paper-text.png ("x = 4" box), clone-paper-calc.png (7×8=56),
  clone-paper-formula.png (formula sheet), clone-papers-index.png (index restyle).
- `npm run check` clean (0 errors); marks + annotations verified in localStorage.
- Session 12 (feature-for-feature re-audit vs live original, browser-driven):
  toolbar order/aria identical; colour popover (6 swatches, cycling label), thickness popover
  (4 sizes), Draw→stroke, Select→drag-move (live preview + commit), Erase removes, Undo pops;
  split panes + draggable divider (aria-valuenow 69 after drag); Show papers sidebar navigates
  to Paper 2F in-viewer; Formula sheet via pane combobox; zoom 595→685→595 px;
  print popover + log-mark dialog ("Your mark: 52/80" echo chip); calculator 78×8=624;
  collapse→pen handle→expand. Screenshots: rep2-*.png.
