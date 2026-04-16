# Poster Output — Fixed-Canvas Rich Graphics

Secondary output modality for visual-explainer. Uses the [`poster-ai`](https://github.com/Michaelliv/poster) CLI (binary: `poster`) to turn a single TSX file into a self-contained HTML poster or a rasterized PNG/SVG/PDF/JPG/WebP.

**This is an opt-in supplementary path, not a replacement.** The primary output for scrollable, interactive, responsive, theme-switching pages remains the hand-written HTML + Mermaid flow (architecture.html, mermaid-flowchart.html, data-table.html, mono-industrial.html). Use poster when the output is intrinsically a **fixed-canvas graphic**: a shareable summary, a dashboard, an infographic, an individual slide, or an embedded hero image inside a larger HTML page.

Check availability before using: `which poster`. If not installed: `npm install -g poster-ai`. If unavailable, fall back to hand-written HTML or an SVG/CSS illustration — don't error.

---

## When to use poster

**Use poster for:**

- `/generate-poster <topic>` — a single-canvas rich composition (architecture poster, shareable diff summary, project-recap hero card)
- Shareable summary images for Slack/Twitter/LinkedIn (1200×630 social card, 1600×900 landscape)
- Dashboards and KPI posters with Recharts
- Infographics with fixed layout (Sankey, org chart, pyramid, hierarchy, timeline strip)
- **Embedded graphics** inside a scrollable HTML page (see § Embedded Graphics below)
- Individual slides rendered as PNG when a user wants downloadable/shareable slide images

**Don't use poster for:**

- The primary output of `/diff-review`, `/plan-review`, `/project-recap`, `/fact-check`, `/generate-web-diagram` (they need scrollable multi-section pages with responsive layout, Mermaid zoom/pan, light/dark theme, sticky TOCs)
- Anything with live Mermaid — poster's server-side rasterizer waits 1500ms for Recharts, which is often not enough for Mermaid's async render. If you need a Mermaid diagram, keep the Mermaid-in-HTML flow.
- Pages that need to scroll. Poster is canvas-locked; overflow is clipped at export time.
- Output that must adapt to viewport width. Poster produces one canvas size.

---

## CLI

```bash
# Self-contained HTML (live React, opens in any browser, has export toolbar)
poster build entry.tsx -o out.html
poster build entry.tsx -o out.html --width 1600 --height 1000

# Server-side rasterization via headless Chrome
poster export entry.tsx -o out.png     # PNG
poster export entry.tsx -o out.svg     # SVG
poster export entry.tsx -o out.pdf     # PDF
poster export entry.tsx -o out.jpg     # JPG
poster export entry.tsx -o out.webp    # WebP

# Inline TSX via stdin (for agents)
poster export - -o hero.png <<'EOF'
export default function() {
  return (<div className="w-[1200px] h-[600px] bg-black text-white">...</div>);
}
EOF

# Machine-readable output
poster build entry.tsx -o out.html --json --quiet
```

**Canvas sizing.** Declare `w-[Npx]` and `h-[Npx]` on the single root element — the renderer measures that element and crops to it. The `--width`/`--height` flags force a viewport; usually you don't need them.

**Common canvas sizes:**

| Purpose | Size |
|---|---|
| Landscape poster / architecture | 1600×1000 |
| Portrait editorial / data story | 1200×1500 |
| Slide (16:9) | 1920×1080 or 1600×900 |
| Social card | 1200×628 |
| Square Slack/LinkedIn | 1080×1080 |

---

## Authoring constraints

- **The root must be a single element, not a Fragment.** Poster measures one element for the canvas. `<>` will fail with "Node is either not visible or not an HTMLElement."
- **Tailwind is loaded via CDN** — arbitrary values work (`text-[72px]`, `bg-[#000]`, `w-[1600px]`).
- **Google Fonts** load via a `<link>` placed inside the root element (Google Fonts CSS works from body). For Mono-Industrial: `Space+Grotesk:wght@400;500&family=Space+Mono:wght@400;700&family=Doto:wght@400;700`.
- **Recharts, lucide-react, shadcn/ui** are available as normal imports — esbuild bundles them at build time.
- **No Mermaid.** Either render the diagram as custom SVG inside the TSX, or render Mermaid separately (`mmdc` CLI or hand-written SVG) and `<img>` it into the poster.
- **No file system access at runtime.** Everything is embedded at build time.
- **Content that overflows the canvas is clipped on export.** Design to fit the declared dimensions.
- **Export waits 1500ms after `networkidle0`** for animations to settle. Override with `--wait-for <ms>` if you load heavy async content.

---

## Mono-Industrial in TSX

The canonical TSX reference is `./templates/mono-industrial-poster.tsx`. It demonstrates:

- 1600×1000 canvas with the full token system expressed as constants (`T_PRIMARY`, `RULE`, `OK`, `WARN`, etc.)
- Google Fonts loaded via `<link>` inside the root
- Three-layer hierarchy: metadata row → oversized headline + Doto hero number → section clusters and a latency table
- One moment of surprise (the 1.2M Doto number)
- Grayscale palette with status colors only on the "OVER · 17%" cell
- Spacing-grouped sections, no cards, single hairlines

**Tokens as TS constants:**

```tsx
const BG = "#000000";
const FG = "rgba(242, 237, 229, 1.00)";
const T_PRIMARY = "rgba(242, 237, 229, 0.90)";
const T_SECONDARY = "rgba(242, 237, 229, 0.58)";
const T_DISABLED = "rgba(242, 237, 229, 0.36)";
const RULE = "rgba(242, 237, 229, 0.14)";
const OK = "#6bd48e";
const WARN = "#f0b05a";
const ERR = "#ef7b7b";

const SG = "'Space Grotesk', system-ui, sans-serif";
const SM = "'Space Mono', 'SF Mono', Consolas, monospace";
const DT = "'Doto', 'Space Grotesk', system-ui, sans-serif";
```

**Light-mode poster:** swap the BG / FG / T_* / RULE / status constants to their light-theme values from `./mono-industrial.md`. A poster is single-theme by design — pick one at render time. If both are needed, emit two posters.

---

## Slide decks as per-slide posters

The HTML slide deck at `./templates/mono-industrial-slides.html` stays canonical for interactive viewing (arrow keys, scroll-snap, Mermaid zoom). Poster adds a **downloadable/shareable** option: render each slide to its own PNG.

Workflow when user asks for slide export (e.g., `/generate-slides --poster-export`):

1. Draft each slide as a separate TSX entry file — one TSX per slide, canvas 1920×1080 (or 1600×900).
2. For each slide: `poster export <slide>.tsx -o <slide>.png`
3. Collect all PNGs into `~/.agent/diagrams/<deck-name>/slides/`
4. Tell the user the directory path so they can upload slides individually or import into Keynote/Google Slides

**Don't abandon the HTML deck.** Always produce the interactive HTML first (for live viewing), then add the PNG export as a secondary artifact.

---

## Embedded graphics inside a scrollable HTML page

Use poster as a **programmatic image generator** for hero banners, inline infographics, and decorative accents inside the primary scrollable HTML output. This is the peer to surf-cli's Gemini-generated illustrations, but deterministic: you write the design in TSX, poster rasterizes it.

**Workflow:**

1. Agent drafts a TSX component sized for the embed slot (e.g., `w-[1200px] h-[400px]` for a hero banner, `w-[800px] h-[500px]` for an inline figure).
2. `poster export <graphic>.tsx -o /tmp/ve-graphic.png` — uses headless Chrome, produces a PNG.
3. Base64-encode the PNG (macOS: `IMG=$(base64 -i /tmp/ve-graphic.png)`; Linux: `base64 -w 0`).
4. Embed inline in the main HTML as `<img src="data:image/png;base64,${IMG}" alt="..." class="ve-hero">`.
5. Delete the temp PNG after embedding.

**When to use this over surf-cli:**

| | poster | surf-cli (Gemini) |
|---|---|---|
| Output is | Deterministic, code-driven | Generative, prompt-driven |
| Good for | Dashboards, charts, schematics, diagrams, data-art, structured layouts | Hero illustrations, conceptual art, photorealism, mood imagery |
| Controllable | Fully (it's React) | Limited (prompt only) |
| Fonts | Google Fonts, any CSS | Whatever the model decides |
| Re-render | Edit TSX, re-run | Re-prompt (may drift) |

Use **poster** for structured/technical graphics. Use **surf** for illustrations, decorative art, or conceptual imagery. They're complements, not alternatives.

**Degradation:** If `poster` isn't installed (`which poster` returns empty), fall back to hand-written inline SVG or a plain CSS composition. Don't error.

---

## File structure in the skill

- `./references/poster.md` — this file
- `./templates/mono-industrial-poster.tsx` — canonical Mono-Industrial poster reference
- `./commands/generate-poster.md` — the slash command spec

Posters generated by the agent are written to `~/.agent/diagrams/` alongside HTML output, with a descriptive filename: `payments-architecture.poster.html`, `q1-recap.poster.png`, etc. Use the `.poster.` infix to distinguish from scrollable HTML output.

---

## Quick reference: when to pick which output

| Input | Primary output | Poster adds |
|---|---|---|
| `/diff-review` | scrollable HTML w/ Mermaid | optional summary card PNG |
| `/plan-review` | scrollable HTML w/ risk table | optional risk-overview poster |
| `/project-recap` | scrollable HTML | optional recap hero card for Slack |
| `/generate-web-diagram` | scrollable HTML w/ Mermaid | alternative `/generate-poster` for fixed-canvas diagram |
| `/generate-visual-plan` | scrollable HTML | optional single-page plan poster |
| `/generate-slides` | HTML deck (scroll-snap) | optional per-slide PNGs via `--poster-export` |
| `/generate-poster` *(new)* | single-canvas HTML + PNG | primary |
