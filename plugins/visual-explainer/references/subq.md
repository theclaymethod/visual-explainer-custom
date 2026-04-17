# SubQ — Subquadratic Brand Aesthetic

A named alternative aesthetic for visual-explainer. Use when the user asks for "subq", "subquadratic", the SubQ brand, or any page that ships inside Subquadratic's internal or external surfaces. **Not the default** — the default remains Mono-Industrial. Select SubQ only when explicitly requested.

Source: SubQ V6 Brand Exploration deck. The hex values below are lifted from that deck; a handful were partially obscured in the PDF and marked **(inferred)** — verify with the design team before using on public-facing material.

Reference template: `./templates/subq.html`

---

## 1. Philosophy

- **Dark-first.** Pure black is the page. Cream is an alternate surface for contrast panels — not a light mode.
- **Three voices, one per register.** Serif display, sans body, monospace label. Each typeface has exactly one job.
- **Accent as geometry, not ink.** The yellow / orange / green / blue palette appears as pixel blocks and the CTA button. Never as body text, never as card borders, never as chart fills.
- **The grid is visible.** A fine 40px line overlay on hero canvases is signature — the system exposes its own infrastructure.
- **Cross marks anchor the composition.** Four `+` glyphs at the corners. They bound the space without enclosing it, like registration marks.
- **Asymmetry. Left-heavy. Generous negative space.** Centered layouts are wrong for this system.
- **No shadows, no gradients, no pills.** One gradient exists for social-post backgrounds and nowhere else.

---

## 2. Font System (strict)

Three typefaces. Every page loads these three, nothing else.

| Family | Role | Weights | Source |
|---|---|---|---|
| **Libre Baskerville** | Display + section headlines | 400, 700 | Google Fonts |
| **Manrope** | Body + UI prose | 400, 500, 600 | Google Fonts |
| **Roboto Mono** | Labels, metadata, numbers, nav, code | 300, 400 | Google Fonts |

The logotype "Subquadratic" / "SubQ" is set in **Roboto Serif Semi-Bold** (600). This family is reserved for the wordmark only — do not use Roboto Serif for headlines or body. Load it only when a wordmark appears on the page.

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Manrope:wght@400;500;600&family=Roboto+Mono:wght@300;400&family=Roboto+Serif:wght@600&display=swap" rel="stylesheet">
```

Drop the `Roboto+Serif:wght@600` token from the URL when no wordmark appears on the page.

### Per-page limits

- **3 font sizes** on the page (one display, one body, one caption). Add one more only when a numeric hero warrants it.
- **Libre Baskerville** is reserved for the one display headline and, at most, section titles. Never body copy.
- **Manrope** handles all running prose, UI labels in title-case, and quotes.
- **Roboto Mono** handles every label, nav item, timestamp, number, and code identifier. Labels go title-case or sentence-case — **never ALL CAPS** in this system.
- **Letter-spacing:** `0.15em` on Roboto Mono labels by default, `0.3em` on monumental Roboto Mono treatments (billboard-scale lines, closing statements), `0` on Manrope and Libre Baskerville.

### Italic usage

Manrope italic for quoted voices and testimonials only: *"Finally! A foundation that can support my vision."* Never italicize for emphasis — use weight 500 instead.

### Strict numeric rule

**Every number on the page is set in Roboto Mono** — Light (300) for display/hero numbers, Normal (400) for inline metadata. This includes percentages, currency, deltas, counts, ratios, and timestamps. Libre Baskerville is for headers only; its serif `%`, `$`, and digits carry a book-type personality that clashes with the otherwise modern page. The brand deck's type-system slide demonstrates this explicitly: "01" is shown in Roboto Mono Light, not in the serif.

---

## 3. Color System

Two layers: **brand color constants** (never change) and **semantic role tokens** (invert with mode). Dark is canonical; light inverts the neutrals but leaves the accent palette untouched.

### Brand constants

```css
--subq-black:    #000000;
--subq-navy:     #080d1f;
--subq-charcoal: #3b362d;
--subq-tan:      #b7a99a;
--subq-gray:     #999489;
--subq-cream:    #fffaf3;

/* Accents — identical on both canvases */
--subq-yellow:   #FFE237;
--subq-blue:     #0834bc;   /* CTA fill */
--subq-orange:   #eb521e;
--subq-green:    #3A7A35;   /* inferred — verify against design tokens */
```

### Semantic roles — dark (canonical)

```css
:root {
  --bg:            var(--subq-black);
  --panel:         var(--subq-cream);
  --panel-text:    var(--subq-black);
  --panel-text-dim: rgba(0, 0, 0, 0.70);
  --panel-label:   rgba(0, 0, 0, 0.55);

  --text-display:   #ffffff;
  --text-primary:   rgba(255, 255, 255, 0.92);
  --text-secondary: var(--subq-tan);
  --text-disabled:  rgba(255, 255, 255, 0.30);

  --rule:        rgba(183, 169, 154, 0.20);
  --rule-strong: rgba(183, 169, 154, 0.40);
  --grid-line:   rgba(255, 255, 255, 0.05);
  --ghost:       rgba(255, 255, 255, 0.12);
}
```

### Semantic roles — light

Applied by the OS preference (`@media (prefers-color-scheme: light)`) OR the explicit toggle override (`:root[data-theme="light"]`). The toggle's override beats the media query so a user on a dark OS can still pin a page to light.

```css
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --bg:            var(--subq-cream);
    --panel:         var(--subq-black);   /* panel inverts: black on cream page */
    --panel-text:    var(--subq-cream);
    --panel-text-dim: rgba(255, 250, 243, 0.80);
    --panel-label:   rgba(255, 250, 243, 0.55);
    --text-display:   var(--subq-black);
    --text-primary:   rgba(0, 0, 0, 0.88);
    --text-secondary: var(--subq-charcoal);
    --text-disabled:  rgba(0, 0, 0, 0.36);
    --rule:        rgba(59, 54, 45, 0.16);
    --rule-strong: rgba(59, 54, 45, 0.32);
    --grid-line:   rgba(0, 0, 0, 0.06);
    --ghost:       rgba(0, 0, 0, 0.10);
  }
}

/* Explicit toggle overrides — beat the media query either way */
:root[data-theme="light"] { /* same tokens as the light block above */ }
:root[data-theme="dark"]  { /* same tokens as the canonical dark block */ }
```

### Theme toggle (light / dark / auto)

Every SubQ page ships with a three-option selector tight to the top-right corner. Each option pairs a geometric icon with a visible text label: ring (Light), solid disc (Dark), half-filled disc (Auto).

**Icons are inline SVG, not Unicode glyphs.** Early drafts used `○ ● ◐` characters; they centered inconsistently across fonts and the circles' visual weight drifted. The canonical version is inline SVG at a 16×16 viewBox rendered at 12×12, all three sharing the same `r=5` and 1.5 stroke-width so the outer bounds line up pixel-for-pixel.

```html
<svg class="theme-toggle__glyph" viewBox="0 0 16 16" aria-hidden="true">
  <!-- Light: ring -->
  <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
</svg>

<svg class="theme-toggle__glyph" viewBox="0 0 16 16" aria-hidden="true">
  <!-- Dark: solid (stroke + fill for identical outer bounds with the ring) -->
  <circle cx="8" cy="8" r="5" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
</svg>

<svg class="theme-toggle__glyph" viewBox="0 0 16 16" aria-hidden="true">
  <!-- Auto: ring + filled right half -->
  <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M 8 3 A 5 5 0 0 1 8 13 Z" fill="currentColor"/>
</svg>
```

The word carries the meaning; the icon carries the icon-level affordance. Don't ship icon-only on the assumption that users know the symbols — the cost of the extra word is paid back every first-time interaction.

**Cross-mark interaction.** The TR corner is reserved for the toggle, so pages that include it drop to the TL + BR opposing-diagonal cross-mark pattern (still two, still on-rule per § 4). Don't keep TR or BL when the toggle is present — that's three cross marks and the reference template forbids it.

```html
<div class="theme-toggle" role="radiogroup" aria-label="Theme">
  <button type="button" role="radio" data-theme="light"  aria-checked="false">
    <span class="theme-toggle__glyph" aria-hidden="true">&#9675;</span>
    <span>Light</span>
  </button>
  <button type="button" role="radio" data-theme="dark"   aria-checked="false">
    <span class="theme-toggle__glyph" aria-hidden="true">&#9679;</span>
    <span>Dark</span>
  </button>
  <button type="button" role="radio" data-theme="system" aria-checked="true">
    <span class="theme-toggle__glyph" aria-hidden="true">&#9680;</span>
    <span>Auto</span>
  </button>
</div>
```

**Label choice: "Auto", not "System".** "Auto" is one syllable shorter, reads faster in a tight monospace label, and matches the term macOS and iOS use for the same concept. "System" is still a valid alias in documentation; the visible UI word is "Auto".

**Chrome and state:**

- **Pill container** — hairline `var(--rule)` border, 4% text-color tint, 10px backdrop blur with light saturation boost. On hover/focus-within the tint steps to 8% and the border to `var(--rule-strong)`.
- **Resting** — labels sit in `var(--text-secondary)`, no pill fill.
- **Hover / focus** on an individual button — label flips to `var(--text-display)` in 180ms.
- **Active (aria-checked)** — label in `var(--text-display)` plus a SubQ-blue tinted pill (`color-mix(in srgb, var(--subq-blue) 14%, transparent)`). The blue connects visually to the primary CTA — "selected" and "primary action" share one accent, which is intentional.
- **Single-indicator collapse on hover-capable devices.** At rest, only the active button is visible — a small circular pill showing just the current mode's glyph. The other two buttons collapse fully (`max-width: 0`, `padding: 0`, `opacity: 0`). On hover or focus-within, the pill unfurls leftward (right-edge anchored via `right: 32px`) and all three buttons expand with labels. Touch devices skip the collapse block since there's no hover affordance — the full labeled pill is the default there.
- **Entrance** — opacity 0 → 1 with a 4px translateY slide, over 520ms, delayed 300ms after page load. Honors `prefers-reduced-motion: reduce`. This is SubQ's one sanctioned exception to the "zero on-load motion" rule because the toggle is the page's only interactive affordance; users need a cue that it exists.

**Responsive behavior (the /adapt pass):**

| Viewport | Position | Touch target | Notes |
|---|---|---|---|
| **Desktop** (≥ 769px) | Fixed, top 24px / right 24px — tight to the top-right corner. Cross marks drop to the TL + BR opposing-diagonal pair so the TR corner is free | Click-sized (32px high, generous padding) | Collapsed to a single circular indicator at rest; hover unfurls the full selector |
| **Tablet / phone** (421–768px) | Fixed, bottom 24px / right 24px — thumb zone | **44px minimum height**, 12px/14px padding | Larger type (12px), looser gap, no reliance on hover |
| **Narrow phone** (≤ 420px) | Fixed bottom bar, left 16px / right 16px, stretched full-width | Each button flexes to 1/3 of the bar, center-aligned | All three options stay visible; no hamburger, no collapse |

The bottom-right placement on mobile is deliberate: at desktop sizes the toggle is a quiet secondary affordance in the margin, but on mobile it's closer to the thumb and slightly more prominent because there's no hover to reveal it.

**Script contract:**

- Writes the choice to `localStorage` under `subq-theme` and sets `document.documentElement.dataset.theme` to `"light"` or `"dark"`.
- `"system"` removes the attribute and the storage key, falling back to `prefers-color-scheme`.
- Mermaid diagrams re-render in the new palette on every toggle change — see § 9 for the `effectiveMode()` helper.

**Mermaid re-renders on change.** The diagram reads its palette from the same source of truth (`effectiveMode()` checks `data-theme` first, then `prefers-color-scheme`). On toggle click, the script stashes each block's original source, clears `data-processed`, and calls `mermaid.run()` again so the nodes flip color without a page reload.

**Live OS tracking in System mode.** When the user has no override set, the script listens to the `change` event on `matchMedia('(prefers-color-scheme: light)')` and re-themes Mermaid live if the OS flips.

**Page-level default.** One-off pages can start in a specific mode by setting `<html lang="en" data-theme="light">` (or `dark`) in the markup. If a user has previously saved a preference, that wins — they get what they chose on their last visit.

### Inversion rules

| Dark | Light | Notes |
|---|---|---|
| Black canvas | Cream canvas | `--bg` |
| Cream contrast panel | Black contrast panel | `--panel` — the panel is the inverse of the page, always |
| White display text | Black display text | `--text-display` |
| Tan secondary text | Charcoal secondary text | `--text-secondary` |
| White grid lines 5% | Black grid lines 6% | `--grid-line` |
| White ghost wordmark 12% | Black ghost wordmark 10% | `--ghost` |
| Pixel blocks (4 accents) | Pixel blocks (4 accents) | **Unchanged** — accents carry across modes |
| Cross marks (4 accents) | Cross marks (4 accents) | **Unchanged** |
| Primary CTA (blue fill, white text) | Primary CTA (blue fill, white text) | **Unchanged** — white on blue works either way |
| Secondary CTA (white border + text) | Secondary CTA (black border + text) | Bind to `--text-display` |
| Terminal code block (dark) | Terminal code block (dark) | **Unchanged** — terminals are dark, like Mono-Industrial |

### Where accent colors may appear

| Allowed | Forbidden |
|---|---|
| Pixel blocks (the signature arrangement) | Accent-colored headlines or body |
| The CTA fill (blue only — never four CTAs in four colors) | Accent-colored section borders |
| Corner cross marks (each corner may carry a different accent) | Colored card backgrounds (use cream or charcoal) |
| Code block syntax tokens (see § 8) | Rainbow data-viz — pick one accent and stick |
| Edge emphasis in a Mermaid diagram (one accent per diagram) | Gradient fills on anything except a social-post background |

### Dark-first, light-mode supported

The brand deck is dark-canonical. The light mode above is this skill's extension, inferred by inverting the deck's existing palette — cream becomes the page, black becomes the contrast panel, tan secondary text becomes charcoal. The four accent colors were audited against both canvases and work on either.

Light mode kicks in via `@media (prefers-color-scheme: light)`. It follows the viewer's OS preference automatically — don't hard-force one mode unless the user explicitly asks.

When generating, verify both modes before delivery. The most common breakage is a value hard-coded as `#ffffff` or `rgba(255, 255, 255, ...)` that fails to invert under light mode. If you find one, bind it to a semantic token (`--text-display`, `--text-primary`, `--ghost`, `--grid-line`) so the inversion happens automatically.

---

## 4. The Cross Mark Motif

Every SubQ page carries `+` glyphs at the corners. Up to four total, one per corner. Each can be a different accent color. They are plain typographic crosses set in Roboto Mono, not SVG marks.

```css
.subq-crossmark {
  position: absolute;
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  color: var(--subq-yellow);  /* or any accent */
  user-select: none;
  pointer-events: none;
}

.subq-crossmark--tl { top: 32px; left: 32px; }
.subq-crossmark--tr { top: 32px; right: 32px; }
.subq-crossmark--bl { bottom: 32px; left: 32px; }
.subq-crossmark--br { bottom: 32px; right: 32px; }
```

Rules:

- **Two or four, never three.** Three creates visual imbalance. Two opposing corners (TL + BR, or TR + BL) is valid and often preferable.
- **Each cross is one color.** Don't multicolor a single cross with layered glyphs.
- **32–48px offset from the edge.** Closer than 32px and they read as decoration, not registration marks.
- **Never on mobile at screens under 600px** — collapse them out via media query. They rely on canvas space to read correctly.
- **Not interactive.** No hover, no link, no tooltip. They're compositional anchors.

---

## 5. The Pixel Block Motif

SubQ's signature graphic system: solid-filled rectangles in the four accent colors, arranged in Mondrian-like clusters. The motif literally encodes "pixels" and "subquadratic scaling."

### Rules

- Solid fill only. **No gradient, no border, no radius, no shadow.**
- Rectangles in any aspect ratio; squares are common but not required.
- Cluster of 3–7 blocks per appearance. Beyond that, it reads as noise.
- One block per accent maximum within a single cluster. Repeating accents creates banding.
- Blocks may **crop at the canvas edge** (bleed off the frame). That's the billboard treatment and it's intentional.
- Blocks may **overlap or visually collide with text**. That's the web-hero treatment and it's intentional.

### Composition patterns

1. **Hero column.** Vertical stack of 4–5 blocks, varied heights, positioned center-ish-right of a left-aligned headline. The primary web-mock hero arrangement.
2. **Corner cluster.** Compact 2×2 grid, ~48–96px blocks, placed in one quadrant. Used for avatar-sized contexts (YouTube icon, business card mark).
3. **Scatter.** 5–8 blocks distributed across a large canvas, uneven spacing. Billboard and promotional surfaces.

```html
<div class="subq-pixelstack">
  <div class="subq-pixel" style="background:var(--subq-yellow); height:72px;"></div>
  <div class="subq-pixel" style="background:var(--subq-orange); height:48px;"></div>
  <div class="subq-pixel" style="background:var(--subq-blue); height:96px;"></div>
  <div class="subq-pixel" style="background:var(--subq-gray); height:40px;"></div>
  <div class="subq-pixel" style="background:var(--subq-green); height:64px;"></div>
</div>
```

```css
.subq-pixelstack { display: flex; flex-direction: column; gap: 0; width: 120px; }
.subq-pixel { width: 100%; }
```

No gap between stacked blocks — they touch. No rounded corners. No transitions.

---

## 6. Grid Texture

Optional overlay for hero canvases and single-section pages. Fine 1px rules at 40px intervals on both axes, rendered via `background-image` so no DOM elements are added.

```css
.subq-gridcanvas {
  background-color: var(--subq-black);
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

Use sparingly: on the page-level `<body>` or on one dominant hero section. Layering it on every card becomes visual noise and destroys the "grid as signature" effect.

---

## 7. Spacing as Structure

8px base unit. Fixed tiers, used as rhythm.

```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 48px;
--space-6: 72px;
--space-7: 96px;
--space-8: 144px;
```

**Asymmetric section rhythm.** Major sections sit on `--space-7` gaps. Grouped items sit on `--space-2` to `--space-3`. If a block feels cramped, first check whether its neighbors are over-spaced — adding a divider is usually the wrong fix.

**Container strategy (lightest-first):**

| Tier | When | Appearance |
|---|---|---|
| 1. Spacing alone | Default | No border, no fill |
| 2. Hairline rule | Between siblings | `border-top: 1px solid var(--rule);` |
| 3. Cream panel | Contrast moments only | `background: var(--subq-cream); color: var(--subq-black);` |
| 4. Charcoal surface | Code blocks, Mermaid containers | `background: var(--subq-charcoal); border: 1px solid var(--rule);` |

---

## 8. Code Blocks — Terminal with SubQ Syntax Palette

Like Mono-Industrial, code blocks are terminal-dark. Unlike Mono-Industrial, they can take a small accent border and use the SubQ palette for syntax tokens.

**Setup:** load Prism.js from jsDelivr (see `./libraries.md` § Prism.js). Apply the CSS below instead of the Mono-Industrial theme.

```css
pre.code-block,
pre.code-block[class*="language-"] {
  background: #050505;
  color: #f2ede5;
  border: 1px solid rgba(183, 169, 154, 0.22);
  border-radius: 4px;
  padding: 18px 20px;
  font-family: 'Roboto Mono', 'SF Mono', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
}
pre.code-block code { background: none; color: inherit; font-family: inherit; text-shadow: none; }

/* SubQ token palette */
.token.comment,
.token.prolog,
.token.cdata         { color: rgba(183, 169, 154, 0.55); font-style: italic; }
.token.punctuation,
.token.operator      { color: rgba(255, 255, 255, 0.50); }
.token.property,
.token.tag,
.token.constant,
.token.deleted       { color: #eb521e; }                   /* orange */
.token.boolean,
.token.number        { color: #FFE237; }                   /* yellow */
.token.string,
.token.char,
.token.builtin,
.token.attr-value    { color: #FFE237; }                   /* yellow */
.token.selector,
.token.attr-name     { color: #0834bc; }                   /* blue */
.token.keyword,
.token.atrule        { color: #ffffff; font-weight: 500; }
.token.function,
.token.class-name    { color: #ffffff; }
.token.regex,
.token.variable      { color: rgba(255, 255, 255, 0.92); }
.token.inserted      { color: #3A7A35; }                   /* green */
.token.important,
.token.bold          { font-weight: 700; }
.token.italic        { font-style: italic; }
```

**File header pattern** (Roboto Mono, tan label, 0.15em tracking):

```html
<figure class="code-file">
  <figcaption class="code-file__cap">
    <span class="code-file__name">src/api/auth.ts</span>
    <span class="code-file__lang">Typescript</span>
  </figcaption>
  <pre class="code-block"><code class="language-ts">...</code></pre>
</figure>
```

```css
.code-file { margin: 32px 0; }
.code-file__cap {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 0 2px 6px;
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--subq-tan);
}
.code-file__name { color: rgba(255, 255, 255, 0.92); }
```

Unlike Mono-Industrial, **labels here stay title-case / sentence-case** (no ALL CAPS).

---

## 9. Mermaid Theming (SubQ)

Neutral nodes (no fill color — they match the page canvas), tan or charcoal borders, white or black text. Accent color appears only on **one** edge or node per diagram, to mark the critical path or the primary surface. Mermaid's `themeVariables` take plain values, not CSS custom properties — so the theme must detect the color scheme at runtime and choose values to match.

```js
const isLight    = matchMedia('(prefers-color-scheme: light)').matches;
const nodeFill   = isLight ? '#fffaf3' : '#000000';
const nodeBorder = isLight ? '#3b362d' : '#b7a99a';
const nodeText   = isLight ? '#000000' : '#ffffff';
const edgeColor  = isLight ? 'rgba(59, 54, 45, 0.55)'  : 'rgba(183, 169, 154, 0.55)';
const clusterBd  = isLight ? 'rgba(59, 54, 45, 0.18)'  : 'rgba(183, 169, 154, 0.20)';
const tertiary   = isLight ? '#b7a99a' : '#3b362d';

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  look: 'classic',
  layout: 'elk',
  themeVariables: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: '15px',
    background: nodeFill,
    primaryColor: nodeFill,
    primaryTextColor: nodeText,
    primaryBorderColor: nodeBorder,
    lineColor: edgeColor,
    tertiaryColor: tertiary,
    clusterBkg: nodeFill,
    clusterBorder: clusterBd,
    mainBkg: nodeFill,
    edgeLabelBackground: nodeFill,
  }
});
```

**Single-accent emphasis** — pick one per diagram. Do **not** set `color:` on classDefs; let the emphasized node inherit the current mode's text color so the diagram stays readable when the scheme flips.

```
classDef primary stroke:#0834bc,stroke-width:2px;
classDef warn    stroke:#FFE237,stroke-width:2px;
classDef err     stroke:#eb521e,stroke-width:2px;

A --> B
B --> C:::primary
```

Apply `:::primary` / `:::warn` / `:::err` to **one** node or edge per diagram. Using two accents in one Mermaid diagram signals the page is overworked — consider splitting into two diagrams.

Node labels: Manrope 15px. Edge labels: Roboto Mono 11px at 0.15em tracking — color follows `lineColor` which flips with mode.

---

## 10. Component Patterns

### Buttons

Two variants. Both 8px radius. No shadow. Primary is the only place blue appears as a fill.

```css
.subq-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.05em;
  transition: opacity 120ms ease-out;
  text-decoration: none;
}
.subq-btn--primary {
  background: var(--subq-blue);
  color: #ffffff;
  border: 1px solid var(--subq-blue);
}
.subq-btn--secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
}
.subq-btn:hover { opacity: 0.85; }
```

No hover lift. No color shift. A 15% opacity drop is the entire feedback.

### Cards / sections

Default to no container. When a container is needed:

- **Charcoal surface** for code-adjacent content (`background: var(--subq-charcoal); border: 1px solid var(--rule);`)
- **Cream panel** for a single contrast moment per page (`background: var(--subq-cream); color: var(--subq-black);`)

Never a neutral gray card. Never an accent-colored card.

### Data tables

- `<table>` with sticky `<thead>`
- Header row: Roboto Mono 11px, tan, 0.15em tracking, uppercase letter-case in `<th>` styling
- Body: Manrope 14px
- Row separator: 1px tan hairline at 20% opacity (never zebra)
- Status indicators (pass/fail) as small Roboto Mono tags in status color — the row body stays tan/white

### Nav header

```html
<header class="subq-nav">
  <span class="subq-logotype">Subquadratic</span>
  <nav class="subq-navlinks">
    <a href="#">STT</a>
    <a href="#">LLM</a>
    <a href="#">TTS</a>
  </nav>
  <a class="subq-btn subq-btn--primary" href="#">Contact Sales</a>
</header>
```

```css
.subq-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 48px;
  border-bottom: 1px solid var(--rule);
}
.subq-logotype {
  font-family: 'Roboto Serif', Georgia, serif;
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
}
.subq-navlinks {
  display: flex; gap: 40px;
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.15em;
}
.subq-navlinks a { color: #ffffff; text-decoration: none; opacity: 0.88; }
.subq-navlinks a:hover { opacity: 1; }
```

### Ghost wordmark footer

Every full-page SubQ output ends with an oversized "Subquadratic" set at 30% opacity across the bottom edge:

```html
<footer class="subq-footer">
  <span class="subq-footer__ghost">Subquadratic</span>
  <div class="subq-footer__meta">
    <span>Prepared by Marketing</span>
    <span>Proprietary & Confidential</span>
  </div>
</footer>
```

```css
.subq-footer {
  margin-top: var(--space-7);
  padding: var(--space-5) 48px var(--space-4);
  border-top: 1px solid var(--rule);
  position: relative;
}
.subq-footer__ghost {
  display: block;
  font-family: 'Roboto Serif', Georgia, serif;
  font-weight: 600;
  font-size: clamp(48px, 10vw, 128px);
  line-height: 1;
  color: rgba(255, 255, 255, 0.14);
  letter-spacing: -0.02em;
}
.subq-footer__meta {
  display: flex; justify-content: space-between;
  margin-top: var(--space-3);
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--subq-tan);
}
```

---

## 11. Motion

Minimal. Precise. Never organic or springy.

- Hover: 120ms opacity-only transitions. No transform, no color shift.
- Page load: static. No staggered fade-in, no entrance animations.
- Mermaid: existing zoom/pan preserved.
- Pixel blocks and cross marks never animate.

`prefers-reduced-motion: reduce` is a no-op for this aesthetic — there's nothing to reduce.

---

## 12. Per-Template Translation

When the user requests SubQ output, translate the usual patterns:

| Usual pattern | SubQ replacement |
|---|---|
| Rounded card with shadow | Spacing-grouped section with optional hairline rule |
| Accent-colored section border | Roboto Mono tan label above the section |
| Status pills with emoji | Roboto Mono 11px tag in status color, no background |
| Gradient hero | Black hero with pixel-block column and 40px grid overlay |
| Full-color KPI cards | Hero number in Roboto Mono Light (300), label in Roboto Mono tan above. Never Libre Baskerville — that's reserved for headers per the type system. |
| Emoji section headers | Corner cross mark (`+`) on the section + Roboto Mono label |
| Full-page light mode | Supported via `prefers-color-scheme: light`. Cream becomes the canvas, black becomes the contrast panel. |

---

## 13. Pre-render Gate

Before generating, confirm:

- [ ] Is the page wired to semantic role tokens (`--bg`, `--panel`, `--text-display`, `--text-secondary`, `--ghost`, `--grid-line`) — not to `var(--subq-black)` or hard-coded whites/blacks?
- [ ] Is there a `@media (prefers-color-scheme: light)` block that inverts the semantic tokens?
- [ ] Am I using Libre Baskerville + Manrope + Roboto Mono — only these three?
- [ ] Does the one display headline use Libre Baskerville? Is body in Manrope? Are labels in Roboto Mono at 0.15em tracking?
- [ ] Are accent colors (yellow, blue, orange, green) confined to pixel blocks, the primary CTA, and/or one Mermaid emphasis?
- [ ] Is there at least one cross mark at a corner? No more than four? No threes?
- [ ] Is the hero either bare or accompanied by a pixel-block arrangement — not a gradient, not a photograph, not a stock illustration?
- [ ] Does the layout lean left, with generous negative space to the right?
- [ ] Is there zero on-load motion?
- [ ] Does every code block use the SubQ terminal palette, not the Mono-Industrial one, and stay dark in light mode?
- [ ] Does the footer carry a ghost "Subquadratic" wordmark that flips correctly between modes (`var(--ghost)`)?
- [ ] Does the Mermaid theme detect `prefers-color-scheme` and choose node fill / text / border values to match?
- [ ] Have I checked the page in BOTH `prefers-color-scheme: dark` and `light` before delivering?

---

## 14. When NOT to use SubQ

- Default generations — use Mono-Industrial.
- User hasn't mentioned SubQ, Subquadratic, or the brand — don't apply it.
- Public-facing customer material where the brand has tighter tokens — escalate to design team for exact hex values on yellow, green, and any logotype applications.
- Poster-ai output — the cross-mark and grid-texture patterns work, but confirm the pixel-block palette with a design stakeholder before committing to shareable assets.

---

## 15. Known uncertainties (verify with design)

- **Green hex.** The green swatch label was partially obscured in the deck. Best interpretation: `#3A7A35`. Design team should confirm.
- **Letter-spacing on monumental Roboto Mono.** Billboard treatment reads at ~0.3em, but no explicit token is specified. Use your judgment and bias toward less, not more.
- **Light mode.** Not specified in the brand deck. The light mode defined in § 3 is this skill's extension, inferred from the deck's palette by inverting neutrals while preserving the accent system. Confirm with design before shipping to public-facing material.

Confirmed directly from the brand deck's palette page: `#FFE237` (yellow), `#000000` (black), `#fffaf3` (cream), `#0834bc` (blue), `#eb521e` (orange), `#999489` (gray), `#080d1f` (navy), `#b7a99a` (tan), `#3b362d` (charcoal).
