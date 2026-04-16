---
description: Generate a single-canvas rich-composition poster (HTML + PNG) via poster-ai
---
Load the visual-explainer skill, then generate a fixed-canvas poster for: $@

**Read `./references/poster.md` and `./templates/mono-industrial-poster.tsx` before generating.** Poster output uses `poster-ai` (CLI binary: `poster`) to turn a single TSX file into a self-contained HTML poster and a rasterized PNG. It is **not** a replacement for the primary scrollable HTML flow — it is the right output when the content is intrinsically a fixed-canvas graphic: a shareable summary, a dashboard, an infographic, or a poster for print/social.

**Before generating:**

1. Check availability: `which poster`. If missing, install with `npm install -g poster-ai` or fall back to a hand-written single-canvas HTML.
2. Pick a canvas size based on intent:
   - Architecture / landscape poster: `w-[1600px] h-[1000px]`
   - Portrait editorial: `w-[1200px] h-[1500px]`
   - Social card (Twitter/LinkedIn): `w-[1200px] h-[628px]`
   - Square (Slack, Instagram): `w-[1080px] h-[1080px]`
3. Commit to the Mono-Industrial aesthetic by default (Swiss, monochrome, hierarchy-first, Space Grotesk + Space Mono + optional Doto hero). Follow `./references/mono-industrial.md` for tokens and the pre-render gate. Use a named alternative only if the user requests one.

**Authoring:**

- The root of the component MUST be a single element (not a Fragment). Poster measures one element for the canvas.
- Load Google Fonts via a `<link>` inside the root element.
- Avoid Mermaid — poster's rasterizer doesn't wait long enough for Mermaid's async render. Use custom SVG, Recharts, or a pre-rendered Mermaid SVG as an `<img>`.
- Exactly one moment of surprise per poster (Doto display number, oversized word, broken-grid element).

**Workflow:**

1. Draft the TSX at `~/.agent/diagrams/<name>.poster.tsx` following the Mono-Industrial pattern.
2. Run `/unslop` on all prose copy (headlines, descriptions, body) before writing into the TSX. See SKILL.md § 4.
3. Build: `poster build ~/.agent/diagrams/<name>.poster.tsx -o ~/.agent/diagrams/<name>.poster.html`
4. Export PNG: `poster export ~/.agent/diagrams/<name>.poster.tsx -o ~/.agent/diagrams/<name>.poster.png`
5. **Verify in the browser** (see SKILL.md § 6): open the HTML, confirm canvas renders correctly, no clipped text, hierarchy legible, status colors only on values. Compare against the PNG to catch anything that drifts between live render and raster.
6. Tell the user both file paths (HTML for live viewing with the export toolbar, PNG for sharing).

Use `.poster.` as an infix in the filename (`payments-q1.poster.html`, `payments-q1.poster.png`) to distinguish from the scrollable HTML output.
