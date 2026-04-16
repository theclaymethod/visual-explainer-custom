# Mono-Industrial — Default Aesthetic

Swiss typography. Monochrome canvas. Hierarchy through type, weight, and spacing — never through color. This is the default aesthetic for visual-explainer. Produce this unless the user explicitly asks for a named alternative (Blueprint, Editorial, Paper/ink, Monochrome terminal, IDE-inspired).

Inspired by Nothing, Braun, Dieter Rams, Teenage Engineering. The vibe is instrument panel, not dashboard.

Reference templates:
- `./templates/mono-industrial.html` — architecture + Mermaid + data row (scrollable)
- `./templates/mono-industrial-slides.html` — slide deck (9 slides covering all 10 slide-type roles)

Read both before generating. The principles below are mandatory; the templates are the canonical expression.

---

## 1. Philosophy

- **Subtract, don't add.** Every element earns its pixel. Default to removal.
- **Structure is ornament.** The grid and the data are the decoration. No added decoration.
- **Monochrome is the canvas.** Color is an event, not a default. Status only.
- **Type does the heavy lifting.** Scale, weight, and spacing create hierarchy. Not color, not icons, not boxes.
- **Both modes are first-class.** Dark = OLED black. Light = warm off-white. Neither is derived.
- **Percussive, not fluid.** Motion is a click, not a swoosh. Near zero on load.

---

## 2. The Three-Layer Rule

Every page has exactly three layers of importance. Not two, not five.

| Layer | Role | Treatment |
|-------|------|-----------|
| **Display** | The one thing the user sees first | Space Grotesk at display size, or Doto if a hero number warrants it. `--text-display`. Generous negative space around it. |
| **Primary** | Supporting context, body copy, section titles | Space Grotesk at body/heading sizes. `--text-primary`. Grouped tight to the display. |
| **Tertiary** | Metadata, labels, nav, system info | Space Mono ALL CAPS. `--text-secondary` or `--text-disabled`. Pushed to edges. |

**The squint test** — before delivering, blur your eyes. If two elements compete for "most important," one needs to shrink, fade, or move. Common failure: making everything "primary." Even spacing + even size = visual flatness.

---

## 3. Font Budget (strict)

**2 families per page + optional 1 Doto accent.**

| Family | Role | Load always? |
|--------|------|--------------|
| Space Grotesk | Display + body + section titles | Yes |
| Space Mono | Labels, metadata, code, zoom buttons, all ALL-CAPS treatment | Yes |
| Doto | One element only — a hero number, a display word, a single break-the-grid moment | **Only when used.** Otherwise do not include it in the `<link>`. |

**Per-page limits:**
- 3 font sizes maximum (one display, one body, one caption)
- 2 weights maximum (Regular 400 + either Light 300 or Medium 500). **Never Bold** except in monospace where 700 is idiomatic.
- Labels are always Space Mono, ALL CAPS, generous tracking (0.08em–0.14em).

If you reach for a new font size: it's probably a spacing problem. Add distance instead.

```html
<!-- With Doto -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&family=Space+Mono:wght@400;700&family=Doto:wght@400;700&display=swap" rel="stylesheet">

<!-- Without Doto (page has no hero moment) -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

---

## 4. Color System

Grayscale carries hierarchy. **Status is the only color on the page** — success, warning, error — applied to the **value**, never to row backgrounds, section fills, or labels.

### Dark (default)

```css
:root {
  --bg: #000000;
  --fg: #f2ede5;
  --text-display:   rgba(242, 237, 229, 1.00);
  --text-primary:   rgba(242, 237, 229, 0.90);
  --text-secondary: rgba(242, 237, 229, 0.58);
  --text-disabled:  rgba(242, 237, 229, 0.36);
  --rule:        rgba(242, 237, 229, 0.14);
  --rule-strong: rgba(242, 237, 229, 0.28);
  --ok:   #6bd48e;
  --warn: #f0b05a;
  --err:  #ef7b7b;
}
```

### Light

```css
@media (prefers-color-scheme: light) {
  :root {
    --bg: #f6f4f0;     /* warm off-white */
    --fg: #16130f;     /* near-black */
    --text-display:   rgba(22, 19, 15, 1.00);
    --text-primary:   rgba(22, 19, 15, 0.90);
    --text-secondary: rgba(22, 19, 15, 0.56);
    --text-disabled:  rgba(22, 19, 15, 0.36);
    --rule:        rgba(22, 19, 15, 0.12);
    --rule-strong: rgba(22, 19, 15, 0.24);
    --ok:   #2f7a3e;
    --warn: #b36b00;
    --err:  #a51818;
  }
}
```

**Whether dark-first or light-first depends on content.** Executive / presentation output → dark-first. Reviewer / reading output → light-first. Just pick one at the top and invert via `prefers-color-scheme`.

**Forbidden:** gradients in chrome, gradient text, colored cards, colored borders (except status), colored row backgrounds, accent-dim washes. Nothing tinted. If you're about to add an accent color because the page feels "too quiet," the page is working. Leave it.

---

## 5. Spacing as Structure

Fixed tiers, used as rhythm.

```css
--space-1: 4px;   /* tight: icon+label, number+unit */
--space-2: 8px;   /* tight: adjacent labels */
--space-3: 16px;  /* medium: sibling list items */
--space-4: 32px;  /* wide: section break */
--space-5: 64px;  /* wide-to-vast: major sections */
--space-6: 96px;  /* vast: context shift (hero → body) */
```

**If two things need a divider, the spacing is wrong.** Use a divider only when you've exhausted spacing (data rows, nav items that must be visually parallel). Most sections need only a single hairline `1px solid var(--rule)` between them.

---

## 6. Container Strategy (lightest-first)

Default to the lightest tier that works. Never box the most important element.

| Tier | When | Appearance |
|------|------|------------|
| 1. Spacing alone | Default. Use this. | No border, no fill. Proximity groups items. |
| 2. Single hairline rule | Between sibling sections | `border-top: 1px solid var(--rule);` |
| 3. Border outline | Mermaid containers, code blocks, data wrappers | `1px solid var(--rule)`, no fill |
| 4. Surface card | Almost never | Border + background — reserved for isolated interactive elements like zoom controls |

Current templates in this skill default to tier 4 (rounded cards, elevated shadows). Mono-Industrial **inverts that default to tier 1**. Cards are an escape hatch, not a layout primitive.

---

## 7. Motion

**Near zero on load.** No `fadeUp`, no staggered reveal, no `translateY` entrance, no `scale` entrance, no `opacity: 0 → 1`. The page is fully composed at paint.

**User-triggered only:**
- Hover: instant opacity or color swap, `transition: opacity 120ms ease-out` max
- Focus rings: immediate
- Mermaid zoom / pan: existing behavior preserved
- Slide transitions: **instant cut** (no fade, no slide, no scale) — scroll-snap handles the step

**Forbidden:**
- `animation: fadeUp`, `@keyframes glow`, animated shadows, pulsing effects
- `cubic-bezier` curves longer than 300ms
- Any spring / bounce easing
- Scroll-driven reveal, parallax, lazy fade-in

`prefers-reduced-motion: reduce` changes nothing for this aesthetic, because there's nothing to reduce.

---

## 8. The One Moment of Surprise

Every Mono-Industrial page breaks its own pattern in **exactly one place**. That one break IS the design. Without it: sterile grid. With more than one: visual noise.

Candidates for the surprise (pick one per page):
- A Doto display number (events/sec, version, page count)
- A vast gap where everything else is tight
- A single oversized Doto word ("END.", "01.", "NOW")
- A circular element among rectangles
- A slide that aligns against the grid rather than with it

Never make the surprise a color, an icon, or a gradient. It's always a typographic or compositional move.

---

## 9. Compositional Balance

**Asymmetry > symmetry.** Centered layouts feel generic. Favor deliberate imbalance:

- **Left-heavy, right-sparse** — oversized headline left, metadata stack right
- **Top-heavy** — big display near top, vast air below
- **Edge-anchored** — metadata pinned to corners, negative space in the middle

Balance a heavy element with empty space, not with another heavy element.

---

## 10. Per-Template Translation

When generating output in Mono-Industrial, translate the usual patterns:

| Usual pattern | Mono-Industrial replacement |
|---|---|
| Card with border + bg + shadow | Spacing-grouped item, no container |
| Color-coded section borders | Space Mono ALL CAPS label above the section |
| Role-colored nodes in Mermaid | Grayscale nodes, labels carry the role |
| Zebra striping in tables | No zebra; row-top hairline only |
| Colored badges | Space Mono ALL CAPS text with `--ok` / `--warn` / `--err` |
| KPI card with gradient number | Bare Doto or Space Mono number with ALL-CAPS label above |
| Animated KPI reveal | Static, instant |
| Emoji section headers | Numbered index in Space Mono: `<span class="index">01</span>` |

---

## 11. Mermaid Theming (Mono-Industrial)

Grayscale only. Apply color via `classDef` **only** when a node or edge semantically represents a success, warning, or error state. See `./libraries.md` → "Mono-Industrial Mermaid Theme" for the exact `themeVariables` block.

```js
const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
const nodeFill   = isDark ? '#000000' : '#ffffff';
const nodeBorder = isDark ? 'rgba(242, 237, 229, 0.58)' : 'rgba(22, 19, 15, 0.56)';
const nodeText   = isDark ? 'rgba(242, 237, 229, 0.95)' : 'rgba(22, 19, 15, 0.95)';
const edgeColor  = isDark ? 'rgba(242, 237, 229, 0.40)' : 'rgba(22, 19, 15, 0.40)';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  look: 'classic',
  layout: 'elk',
  themeVariables: {
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontSize: '15px',
    primaryColor: nodeFill,
    primaryBorderColor: nodeBorder,
    primaryTextColor: nodeText,
    secondaryColor: nodeFill,
    secondaryBorderColor: nodeBorder,
    secondaryTextColor: nodeText,
    tertiaryColor: nodeFill,
    tertiaryBorderColor: nodeBorder,
    tertiaryTextColor: nodeText,
    lineColor: edgeColor,
    noteBkgColor: nodeFill,
    noteTextColor: nodeText,
    noteBorderColor: nodeBorder,
  }
});
```

**Status on specific edges only:** add `classDef warn stroke:#b36b00,stroke-width:2px` (light) / `#f0b05a` (dark) and apply via `:::warn` on the specific edge or node that represents a degraded path. Do not status-color nodes that simply participate in the flow.

Edge labels: Space Mono, ALL CAPS, 11px. Node labels: Space Grotesk, 15px (presentation decks may bump to 20px).

---

## 12. Data Tables

- No zebra. No vertical cell borders. Only a single hairline above each row.
- Header row: Space Mono, ALL CAPS, 11px, `--text-secondary`.
- Numeric columns: right-aligned, `font-variant-numeric: tabular-nums`, `--font-mono`.
- Status values: `--ok` / `--warn` / `--err` on the **value only**. Never the row, never the label.
- Long text: wrap naturally. Never truncate.

See the `data-row` pattern in `./templates/mono-industrial.html` lines ~280.

---

## 13. Empty, Error, and Loading States

Inline Space Mono, ALL CAPS, square-bracketed. No illustrations, no multi-paragraph messages, no toast popups.

- `[NO DATA]`
- `[EMPTY]`
- `[LOADING...]`
- `[ERROR: timeout]`
- `[SAVED]`

---

## 14. Microcopy Voice

Instrument-style. Terse. Space Mono, ALL CAPS. Avoid sentence-case metadata labels.

| Yes | No |
|---|---|
| `LAST UPDATED` | `Last updated` |
| `SOURCE` | `Source:` |
| `OWNER · PLATFORM` | `Owned by the platform team` |
| `V 2.4.0` | `Version 2.4.0 (stable)` |
| `P99 / 24H` | `p99 latency over the last 24 hours` |

Date format in metadata rows: `2026 · 04 · 16` (dots, spaces, no slashes).

---

## 15. Responsive Behavior

- Below 768px: collapse splits to one column, keep the hero intact, shrink secondary and tertiary faster than primary. The three-layer hierarchy must survive.
- The hero should be full-width, not shrunk into a card.
- Spacing scales with `clamp()` on padding; type sizes with `clamp()` on font-size.

---

## 16. Pre-render Gate (check these before writing HTML)

Run through this list before generating. If any answer is no, stop and revise.

- [ ] Do I have exactly 3 layers of importance? (display / primary / tertiary)
- [ ] Am I using at most 2 font families + optional 1 Doto accent?
- [ ] Am I using at most 3 sizes and 2 weights?
- [ ] Is every color on the page either grayscale or a status value?
- [ ] Is there zero on-load motion?
- [ ] Is there exactly one moment of surprise on the page?
- [ ] Does the squint test pass (hierarchy legible even when blurred)?
- [ ] Did I default to spacing over containers, and hairlines over boxes?
- [ ] Do my metadata labels read like instrument panel callouts (Space Mono, ALL CAPS)?

---

## 17. When NOT to Use Mono-Industrial

Mono-Industrial is the default, but some requests imply a different aesthetic:

- User says "use Blueprint" / "use Editorial" / etc. → honor the named aesthetic
- User provides a specific palette or typographic direction → follow their direction
- The output is a creative/expressive piece (poster, brand page, illustration-heavy) → use a different aesthetic

Anything else — architecture, diff review, plan review, project recap, fact check, data tables, slide decks, documentation — produces Mono-Industrial by default.

No rotation. No varying the choice. Mono-Industrial every time.
