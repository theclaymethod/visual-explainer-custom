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

---

## 3. Color System

```css
/* Structure */
--subq-black:    #000000;   /* page bg — canonical */
--subq-navy:     #080d1f;   /* alt surface (rare) */
--subq-charcoal: #3b362d;   /* divider, code surface, surface variant */
--subq-tan:      #b7a99a;   /* border, secondary text, ghost chrome */
--subq-gray:     #999489;   /* disabled, muted */
--subq-cream:    #fffaf3;   /* contrast panel surface */

/* Accents — used as pixel blocks and the single CTA color */
--subq-yellow:   #FFE237;   /* inferred — verify against design tokens */
--subq-blue:     #0834bc;   /* CTA fill + accent */
--subq-orange:   #eb521e;   /* accent */
--subq-green:    #3A7A35;   /* inferred — verify against design tokens */

/* Text on black */
--text-display:   #ffffff;
--text-primary:   rgba(255, 255, 255, 0.92);
--text-secondary: #b7a99a;                    /* tan, literal */
--text-disabled:  rgba(255, 255, 255, 0.30);  /* the "ghost" wordmark treatment */

/* Rules */
--rule:         rgba(183, 169, 154, 0.20);    /* tan hairline */
--rule-strong:  rgba(183, 169, 154, 0.40);
```

### Where accent colors may appear

| Allowed | Forbidden |
|---|---|
| Pixel blocks (the signature arrangement) | Accent-colored headlines or body |
| The CTA fill (blue only — never four CTAs in four colors) | Accent-colored section borders |
| Corner cross marks (each corner may carry a different accent) | Colored card backgrounds (use cream or charcoal) |
| Code block syntax tokens (see § 8) | Rainbow data-viz — pick one accent and stick |
| Edge emphasis in a Mermaid diagram (one accent per diagram) | Gradient fills on anything except a social-post background |

### "Dark-first but not dark-only"

The deck never defines a full light mode. Cream surfaces appear as **embedded panels** on a black page (contrast cards, mock screens, a business-card example). Treat cream as a surface, not a page mode — a `.subq-panel--cream` section on an otherwise black page is correct; flipping the entire page to cream is off-system.

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

Grayscale nodes with tan borders and white text. Accent color appears only on **one** edge or node per diagram, to mark the critical path or the primary surface.

```js
const nodeFill   = '#000000';
const nodeBorder = '#b7a99a';
const nodeText   = '#ffffff';
const edgeColor  = 'rgba(183, 169, 154, 0.55)';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  look: 'classic',
  layout: 'elk',
  themeVariables: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    fontSize: '15px',
    background: '#000000',
    primaryColor: nodeFill,
    primaryTextColor: nodeText,
    primaryBorderColor: nodeBorder,
    lineColor: edgeColor,
    tertiaryColor: '#3b362d',
    clusterBkg: '#000000',
    clusterBorder: 'rgba(183, 169, 154, 0.20)',
    mainBkg: nodeFill,
  }
});
```

**Single-accent emphasis** — pick one per diagram:

```
classDef primary stroke:#0834bc,stroke-width:2px,color:#ffffff;
classDef warn    stroke:#FFE237,stroke-width:2px,color:#FFE237;
classDef err     stroke:#eb521e,stroke-width:2px,color:#eb521e;

A --> B
B --> C:::primary
```

Apply `:::primary` / `:::warn` / `:::err` to **one** node or edge per diagram. Using two accents in one Mermaid diagram signals the page is overworked — consider splitting into two diagrams.

Node labels: Manrope 15px. Edge labels: Roboto Mono 11px, tan (`#b7a99a`), 0.15em tracking.

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
| Full-color KPI cards | Hero number in Libre Baskerville 400 or Roboto Mono 300, label in Roboto Mono tan above |
| Emoji section headers | Corner cross mark (`+`) on the section + Roboto Mono label |
| Full-page light mode | Cream panel embedded in an otherwise dark page |

---

## 13. Pre-render Gate

Before generating, confirm:

- [ ] Is the page black-canvassed by default, cream used only as an embedded surface (not a full mode)?
- [ ] Am I using Libre Baskerville + Manrope + Roboto Mono — only these three?
- [ ] Does the one display headline use Libre Baskerville? Is body in Manrope? Are labels in Roboto Mono at 0.15em tracking?
- [ ] Are accent colors (yellow, blue, orange, green) confined to pixel blocks, the primary CTA, and/or one Mermaid emphasis?
- [ ] Is there at least one cross mark at a corner? No more than four? No threes?
- [ ] Is the hero either bare or accompanied by a pixel-block arrangement — not a gradient, not a photograph, not a stock illustration?
- [ ] Does the layout lean left, with generous negative space to the right?
- [ ] Is there zero on-load motion?
- [ ] Does every code block use the SubQ terminal palette, not the Mono-Industrial one?
- [ ] Does the footer carry a ghost "Subquadratic" wordmark at ~14% opacity?

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
- **Full light mode.** Not specified in the deck. Until a spec lands, treat cream as a surface for embedded panels, never a full-page mode.

Confirmed directly from the brand deck's palette page: `#FFE237` (yellow), `#000000` (black), `#fffaf3` (cream), `#0834bc` (blue), `#eb521e` (orange), `#999489` (gray), `#080d1f` (navy), `#b7a99a` (tan), `#3b362d` (charcoal).
