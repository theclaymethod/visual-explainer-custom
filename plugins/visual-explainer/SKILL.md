---
name: visual-explainer
description: Generate beautiful, self-contained HTML pages that visually explain systems, code changes, plans, and data. Use when the user asks for a diagram, architecture overview, diff review, plan review, project recap, comparison table, or any visual explanation of technical concepts. Also use proactively when you are about to render a complex ASCII table (4+ rows or 3+ columns) — present it as a styled HTML page instead.
license: MIT
compatibility: Requires a browser to view generated HTML files. Optional surf-cli for AI image generation.
metadata:
  author: nicobailon
  version: "0.6.3"
---

# Visual Explainer

Generate self-contained HTML files for technical diagrams, visualizations, and data tables. Always open the result in the browser. Never fall back to ASCII art when this skill is loaded.

**Proactive table rendering.** When you're about to present tabular data as an ASCII box-drawing table in the terminal (comparisons, audits, feature matrices, status reports, any structured rows/columns), generate an HTML page instead. The threshold: if the table has 4+ rows or 3+ columns, it belongs in the browser. Don't wait for the user to ask — render it as HTML automatically and tell them the file path. You can still include a brief text summary in the chat, but the table itself should be the HTML page.

## Available Commands

Detailed prompt templates in `./commands/`. In Pi, these are slash commands (`/diff-review`). In Claude Code, namespaced (`/visual-explainer:diff-review`). In Codex, use `/prompts:diff-review` (if installed to `~/.codex/prompts/`) or invoke `$visual-explainer` and describe the workflow.

| Command | What it does |
|---------|-------------|
| `generate-web-diagram` | Generate an HTML diagram for any topic |
| `generate-visual-plan` | Generate a visual implementation plan for a feature |
| `generate-slides` | Generate a magazine-quality slide deck (vertical or `--magazine` horizontal) |
| `generate-poster` | Generate a single-canvas rich-composition poster (HTML + PNG) via poster-ai — see `./references/poster.md` |
| `generate-video` | Generate an explainer video (MP4) via Hyperframes; `--style=long-form\|reel` |
| `render-video` | Convert an existing HTML deck to an MP4 via Hyperframes |
| `diff-review` | Visual diff review with architecture comparison and code review |
| `plan-review` | Compare a plan against the codebase with risk assessment |
| `project-recap` | Mental model snapshot for context-switching back to a project |
| `fact-check` | Verify accuracy of a document against actual code |
| `share` | Deploy an HTML page to Vercel and get a live URL |

## Workflow

### 1. Think (5 seconds, not 5 minutes)

Before writing HTML, commit to a direction. Don't default to "dark theme with blue accents" every time.

**Visual is always default.** Even essays, blog posts, and articles get visual treatment — extract structure into cards, diagrams, grids, tables.

Prose patterns (lead paragraphs, pull quotes, callout boxes) are **accent elements** within visual pages, not a separate mode. Use them to highlight key points or provide breathing room, but the page structure remains visual.

For prose accents, see "Prose Page Elements" in `./references/css-patterns.md`. For everything else, use the standard freeform approach with aesthetic directions below.

**Who is looking?** A developer understanding a system? A PM seeing the big picture? A team reviewing a proposal? This shapes information density and visual complexity.

**What type of content?** Architecture, flowchart, sequence, data flow, schema/ER, state machine, mind map, class diagram, C4 architecture, data table, timeline, dashboard, or prose-first page. Each has distinct layout needs and rendering approaches (see Diagram Types below).

**What aesthetic?** **Default to Mono-Industrial** unless the user names a different one. The other aesthetics listed below remain available, but they are opt-in — they do not rotate in by default.

**Default aesthetic — Mono-Industrial (Swiss, monochrome, typography-first).** Inspired by Nothing, Braun, Teenage Engineering. Hierarchy is built from type scale, weight, and spacing — never from color. Grayscale canvas with status colors only (success / warning / error) on values themselves. Three-layer rule: display, primary, tertiary. Font budget: Space Grotesk + Space Mono + optional Geist Pixel Square for exactly one hero element per page. Zero on-load motion. One "moment of surprise" per page (an oversized number, a vast gap, a pixel-display word, a broken grid). **Before generating, read `./references/mono-industrial.md`.** For architecture output, base on `./templates/mono-industrial.html`. For slide decks, base on `./templates/mono-industrial-slides.html`.

**Named alternatives (use only when the user explicitly requests one).** The aesthetics below exist for users who ask for SubQ, Blueprint, Editorial, Paper/ink, Monochrome terminal, or an IDE-inspired palette by name. Do not rotate through them on your own initiative, and do not select them as a "change of pace" for variety.

**Brand aesthetics:**
- **SubQ / Subquadratic** — the Subquadratic company brand. Dark-first black canvas with a light-mode inversion via `prefers-color-scheme: light` (cream canvas, black contrast panel). Libre Baskerville serif display + Manrope body + Roboto Mono labels + Roboto Serif Semi-Bold wordmark. Pixel-block accent system (yellow / blue / orange / green — unchanged across modes), cross-mark corner anchors, 40px grid texture on hero, ghost wordmark footer. Wired through semantic role tokens (`--bg`, `--panel`, `--text-display`, `--text-secondary`, `--ghost`, `--grid-line`) so the page inverts cleanly; Mermaid detects the scheme at runtime. **Before generating, read `./references/subq.md`.** Base on `./templates/subq.html`. Trigger: user says "subq", "subquadratic", "the SubQ brand", or "our brand" in a context that implies Subquadratic. Always verify BOTH modes before delivery.

**Constrained aesthetics (prefer these):**
- Blueprint (technical drawing feel, subtle grid background, deep slate/blue palette, monospace labels, precise borders) — see `websocket-implementation-plan.html` for reference
- Editorial (serif headlines like Instrument Serif or Crimson Pro, generous whitespace, muted earth tones or deep navy + gold)
- Paper/ink (warm cream `#faf7f5` background, terracotta/sage accents, informal feel)
- Monochrome terminal (green/amber on near-black, monospace everything, CRT glow optional)

**Flexible aesthetics (use with caution):**
- IDE-inspired (borrow a real, named color scheme: Dracula, Nord, Catppuccin Mocha/Latte, Solarized Dark/Light, Gruvbox, One Dark, Rosé Pine) — commit to the actual palette, don't approximate
- Data-dense (small type, tight spacing, maximum information, muted colors)

**Explicitly forbidden:**
- Neon dashboard (cyan + magenta + purple on dark) — always produces AI slop
- Gradient mesh (pink/purple/cyan blobs) — too generic
- Any combination of Inter font + violet/indigo accents + gradient text

**Do not rotate aesthetics on your own.** Mono-Industrial is the default for every fresh generation. Switch only when the user requests a named alternative ("do it in Editorial style", "use the Dracula palette", "make it paper/ink"). The previous guidance to "vary the choice each time" is obsolete — variety is not a goal, consistent identity is. The swap test still applies within whichever aesthetic you pick: if you replaced the fonts and colors with a generic default and nobody would notice, you haven't designed anything.

### 2. Structure

**Read the reference material** before generating. Don't memorize it — read it each time to absorb the patterns.

**For Mono-Industrial output (the default), always read `./references/mono-industrial.md` first.** Then, depending on output type:
- Scrollable architecture / plan / diff / recap / table / mixed: `./templates/mono-industrial.html`
- Slide deck (`--slides` or `/generate-slides`): `./templates/mono-industrial-slides.html` (still consult `./references/slide-patterns.md` for engine-level patterns like scroll-snap, nav chrome, and slide-type roles)

**For named alternative aesthetics** (only when the user explicitly asks for one), use these legacy reference templates instead:
- Text-heavy architecture overviews: `./templates/architecture.html`
- Flowcharts, sequence, ER, state, mind map, class, C4: `./templates/mermaid-flowchart.html`
- Data tables, comparisons, audits: `./templates/data-table.html`
- Slide decks: `./templates/slide-deck.html` + `./references/slide-patterns.md`
- Prose-heavy pages: "Prose Page Elements" in `./references/css-patterns.md` + "Typography by Content Voice" in `./references/libraries.md`

**For CSS/layout patterns and SVG connectors**, read `./references/css-patterns.md`.

**For diagram generation specifically** — the 13 supported diagram types (architecture, flowchart, sequence, state, ER, timeline, swimlane, quadrant, nested, tree, layer stack, Venn, pyramid/funnel) — **default to inline SVG**, not Mermaid. Read `./references/diagrams-svg.md` for the type-selection gate, shape semantics (ovals = start/end, rects = steps, diamonds = decisions, dots = merges), complexity budgets (max 9 nodes, 12 arrows, 2 accent elements), removal test, annotation primitive, sketchy filter, and anti-patterns list. Read `./references/diagram-tokens.md` for the per-aesthetic token mapping so the same diagram rules produce aesthetic-appropriate output across Mono-Industrial, SubQ, Editorial-Diagram, Blueprint, Paper/ink, Terminal, and IDE-inspired palettes. Start from `./templates/svg-diagram-starter.html` — it ships the `<defs>` block (dot pattern, arrow markers, sketchy filter), the 4px grid, masked arrow labels, and a bottom legend strip. Mermaid remains available as a fallback — see the table below.

**For pages with 4+ sections** (reviews, recaps, dashboards), also read `./references/responsive-nav.md` for section navigation with sticky sidebar TOC on desktop and horizontal scrollable bar on mobile.

**Choosing a rendering approach:**

| Content type | Approach | Why |
|---|---|---|
| Architecture (text-heavy) | CSS Grid cards + flow arrows | Rich card content (descriptions, code, tool lists) needs CSS control |
| Architecture (topology, ≤ 14 nodes) | **Inline SVG** (see `./references/diagrams-svg.md`) | Editorial control, shape semantics, 4px grid, focal accent rule |
| Architecture (topology, 15+ nodes) | **Mermaid** (hybrid: Mermaid overview + CSS Grid cards) | Auto-routing beats hand-authored coordinates above the complexity budget |
| Flowchart / pipeline (≤ 9 nodes) | **Inline SVG** | Shape carries meaning (oval/rect/diamond/dot) — requires hand authoring |
| Flowchart / pipeline (10+ nodes) | **Mermaid** | Auto layout needed past the budget |
| Sequence diagram (≤ 5 lifelines) | **Inline SVG** | Activation bars, self-message U-loops, dashed return arrows are editorial decisions |
| Sequence diagram (6+ lifelines) | **Mermaid** `sequenceDiagram` | Auto layout needed past the budget |
| Data flow | **Mermaid** with edge labels | Auto edge routing beats hand-drawn lines for data pipelines |
| ER / schema diagram (≤ 8 entities) | **Inline SVG** | Cardinality labels, PK/FK glyphs, aggregate-root focal rule |
| ER / schema diagram (9+ entities) | **Mermaid** `erDiagram` | Relationship routing auto-resolves |
| State machine (≤ 9 states) | **Inline SVG** | Self-loops, start/end glyphs, `event [guard] / action` labels |
| State machine (10+ states) | **Mermaid** `stateDiagram-v2` / `flowchart TD` | See `stateDiagram-v2` label caveat below |
| Timeline | **Inline SVG** with honest intervals | Unequal intervals must get unequal spacing — Mermaid can't do this |
| Swimlane | **Inline SVG** | Lane dividers, handoff arrows, eyebrow lane labels |
| Quadrant | **Inline SVG** | Axis-end labels, focal "do first" accent |
| Nested containment | **Inline SVG** | Concentric rounded rects with escalating stroke opacity |
| Tree (≤ depth 4) | **Inline SVG** | Orthogonal elbow connectors, never diagonal |
| Layer stack | **Inline SVG** | 4–6 horizontal bands with mono index + sans name + context note |
| Venn (2–3 circles) | **Inline SVG** | Proportional circle sizes, set-specific hairline strokes |
| Pyramid / funnel | **Inline SVG** | Honest proportional widths — Mermaid can't enforce this |
| Mind map | **Mermaid** `mindmap` | Radial layout is ergonomic in Mermaid and doesn't benefit from SVG control |
| Class diagram | **Mermaid** `classDiagram` | Inheritance/composition routing is Mermaid's strength |
| C4 architecture | **Mermaid** `graph TD` + `subgraph` | Use flowchart-as-C4 (native `C4Context` ignores themes) |
| Data table | HTML `<table>` | Semantic markup, accessibility, copy-paste behavior |
| Dashboard | CSS Grid + Chart.js | Card grid with embedded charts |

**Mermaid theming:** Always use `theme: 'base'` with custom `themeVariables` so colors match your page palette. Use `layout: 'elk'` for complex graphs (requires the `@mermaid-js/layout-elk` package — see `./references/libraries.md` for the CDN import). Override Mermaid's SVG classes with CSS for pixel-perfect control. See `./references/libraries.md` for full theming guide.

**Mermaid containers:** Always center Mermaid diagrams with `display: flex; justify-content: center;`. Add zoom controls (+/−/reset/expand) to every `.mermaid-wrap` container. Include the click-to-expand JavaScript so clicking the diagram (or the ⛶ button) opens it full-size in a new tab.

**⚠️ Never use bare `<pre class="mermaid">`.** It renders but has no zoom/pan controls — diagrams become tiny and unusable. Always use the full `diagram-shell` pattern from `templates/mermaid-flowchart.html`: the HTML structure (`.diagram-shell` > `.mermaid-wrap` > `.zoom-controls` + `.mermaid-viewport` > `.mermaid-canvas`), the CSS, and the ~200-line JS module for zoom/pan/fit. Copy it wholesale.

**Mermaid scaling:** Diagrams with 10+ nodes render too small by default. For 10-12 nodes, increase `fontSize` in themeVariables to 18-20px and set `INITIAL_ZOOM` to 1.5-1.6. For 15+ elements, don't try to scale — use the hybrid pattern instead (simple Mermaid overview + CSS Grid cards). See "Architecture / System Diagrams" below.

**Mermaid layout direction:** Prefer `flowchart TD` (top-down) over `flowchart LR` (left-to-right) for complex diagrams. LR spreads horizontally and makes labels unreadable when there are many nodes. Use LR only for simple 3-4 node linear flows. See `./references/libraries.md` "Layout Direction: TD vs LR".

**Mermaid line breaks in flowchart labels:** Use `<br/>` inside quoted labels. Never use escaped newlines like `\n` (Mermaid renders them as literal text in HTML output). Example: `A["Copilot Backend<br/>/api + /api/voicebot"]`.

**Mermaid CSS class collision constraint:** Never define `.node` as a page-level CSS class. Mermaid.js uses `.node` internally on SVG `<g>` elements with `transform: translate(x, y)` for positioning. Page-level `.node` styles (hover transforms, box-shadows) leak into diagrams and break layout. Use the namespaced `.ve-card` class for card components instead. The only safe way to style Mermaid's `.node` is scoped under `.mermaid` (e.g., `.mermaid .node rect`).

**AI-generated illustrations (optional).** If [surf-cli](https://github.com/nicobailon/surf-cli) is available, you can generate images via Gemini and embed them in the page for creative, illustrative, explanatory, educational, or decorative purposes. Check availability with `which surf`. If available:

```bash
# Generate to a temp file (use --aspect-ratio for control)
surf gemini "descriptive prompt" --generate-image /tmp/ve-img.png --aspect-ratio 16:9

# Base64 encode for self-containment (macOS)
IMG=$(base64 -i /tmp/ve-img.png)
# Linux: IMG=$(base64 -w 0 /tmp/ve-img.png)

# Embed in HTML and clean up
# <img src="data:image/png;base64,${IMG}" alt="descriptive alt text">
rm /tmp/ve-img.png
```

See `./references/css-patterns.md` for image container styles (hero banners, inline illustrations, captions).

**When to use:** Hero banners that establish the page's visual tone. Conceptual illustrations for abstract systems that Mermaid can't express (physical infrastructure, user journeys, mental models). Educational diagrams that benefit from artistic or photorealistic rendering. Decorative accents that reinforce the aesthetic.

**When to skip:** Anything Mermaid or CSS handles well. Generic decoration that doesn't convey meaning. Data-heavy pages where images would distract. Always degrade gracefully — if surf isn't available, skip images without erroring. The page should stand on its own with CSS and typography alone.

**Prompt craft:** Match the image to the page's palette and aesthetic direction. Specify the style (3D render, technical illustration, watercolor, isometric, flat vector, etc.) and mention dominant colors from your CSS variables. Use `--aspect-ratio 16:9` for hero banners, `--aspect-ratio 1:1` for inline illustrations. Keep prompts specific — "isometric illustration of a message queue with cyan nodes on dark navy background" beats "a diagram of a queue."

**Code-driven embedded graphics via poster-ai (optional).** When you need a *structured* inline graphic — a KPI card, a Sankey diagram, a hierarchy figure, a dashboard strip — and you want determinism instead of generative output, use `poster-ai` as the image generator (the peer to surf-cli's Gemini illustrations). Check availability with `which poster`. If available:

```bash
# Write TSX to a temp file (sized for the embed slot, e.g. 1200×400 hero banner)
cat > /tmp/ve-graphic.tsx <<'TSX'
export default function() {
  return (<div className="w-[1200px] h-[400px] bg-black text-white ...">...</div>);
}
TSX

# Rasterize via headless Chrome
poster export /tmp/ve-graphic.tsx -o /tmp/ve-graphic.png --quiet

# Base64 encode for inline embedding (macOS)
IMG=$(base64 -i /tmp/ve-graphic.png)
# Linux: IMG=$(base64 -w 0 /tmp/ve-graphic.png)

# Embed:  <img src="data:image/png;base64,${IMG}" alt="...">
rm /tmp/ve-graphic.tsx /tmp/ve-graphic.png
```

**Poster vs surf:** use `poster` when the graphic is structural (dashboards, charts, schematics, data-art with exact layouts, diagrams you want to iterate on in code). Use `surf` when the graphic is illustrative (hero photography, conceptual art, mood imagery, anything generative). They are complements — pick based on whether you want deterministic/code-driven or generative/prompt-driven output. See `./references/poster.md` for canvas sizes, Mono-Industrial TSX idioms, and the full constraints list (no Mermaid inside posters, single-element root, etc.). Degrade gracefully — skip if `poster` isn't installed.

**Recorded UI demos (optional).** When the page explains a *running UI feature* — a form flow, a hover reveal, a multi-step wizard — a short silent webm loop beats a still screenshot. The video stays self-contained in the HTML via a base64 data URI, just like surf images and poster graphics.

Capture path (pick whichever is available):

- **Playwright MCP (preferred).** Use `browser_navigate`, `browser_resize`, `browser_take_screenshot` to save 6–12 numbered frames (`frame-001.png` … `frame-012.png`) into `~/.agent/diagrams/<slug>/`. Wait ~400ms between beats so animations settle.
- **`agent-browser` CLI (shortcut).** If installed, `agent-browser record start <out.webm>` / `record stop` captures continuously while you run interactions between them.

Encode and embed:

```bash
# Stitch frames → webm (skip if you used agent-browser record)
bash {{skill_dir}}/scripts/frames-to-webm.sh \
  ~/.agent/diagrams/<slug> \
  ~/.agent/diagrams/<slug>.webm \
  2  # fps

# Emit a self-contained <video> snippet with base64 inline
bash {{skill_dir}}/scripts/embed-media.sh ~/.agent/diagrams/<slug>.webm
# → <video autoplay loop muted playsinline><source src="data:video/webm;base64,..."></video>
```

Paste the `<video>` snippet directly into the section that introduces the feature. Keep the source webm under 2MB before encoding — above that, the base64-inflated HTML gets sluggish. The helper warns on stderr when you cross that line.

See `./references/demo-capture.md` for the full capture workflow, frame pacing, aesthetic framing per theme, and when to skip the demo entirely. `embed-media.sh` also handles PNG/JPG/GIF/WebP/MP4, so use it anywhere you'd otherwise hand-roll a `base64 -i | sed` pipeline. Degrade gracefully — if `ffmpeg` or a browser capture tool isn't available, fall back to a still screenshot or a Mermaid illustration.

### 3. Style

**If generating Mono-Industrial (the default), follow `./references/mono-industrial.md` — not the rules below.** The guidance in this section (font rotation, multi-accent palettes, staggered fade-in animation) applies only when the user has explicitly requested a named alternative aesthetic (Blueprint, Editorial, Paper/ink, Monochrome terminal, IDE-inspired). Mono-Industrial overrides all of it: fixed typography (Space Grotesk + Space Mono + optional Geist Pixel Square), grayscale palette with status colors only, zero on-load motion.

Apply these principles to every diagram in a **named alternative aesthetic**:

**Typography is the diagram.** Pick a distinctive font pairing from the list in `./references/libraries.md`. Every page should use a different pairing from recent generations.

**Forbidden as `--font-body`:** Inter, Roboto, Arial, Helvetica, system-ui alone. These are AI slop signals.

**Good pairings (use these):**
- DM Sans + Fira Code (technical, precise)
- Instrument Serif + JetBrains Mono (editorial, refined)
- IBM Plex Sans + IBM Plex Mono (reliable, readable)
- Bricolage Grotesque + Fragment Mono (bold, characterful)
- Plus Jakarta Sans + Azeret Mono (rounded, approachable)

Load via `<link>` in `<head>`. Include a system font fallback in the `font-family` stack for offline resilience.

**Color tells a story.** Use CSS custom properties for the full palette. Define at minimum: `--bg`, `--surface`, `--border`, `--text`, `--text-dim`, and 3-5 accent colors. Each accent should have a full and a dim variant (for backgrounds). Name variables semantically when possible (`--pipeline-step` not `--blue-3`). Support both themes.

**Forbidden accent colors:** `#8b5cf6` `#7c3aed` `#a78bfa` (indigo/violet), `#d946ef` (fuchsia), the cyan-magenta-pink combination. These are Tailwind defaults that signal zero design intent.

**Good accent palettes (use these):**
- Terracotta + sage (`#c2410c`, `#65a30d`) — warm, earthy
- Teal + slate (`#0891b2`, `#0369a1`) — technical, precise
- Rose + cranberry (`#be123c`, `#881337`) — editorial, refined
- Amber + emerald (`#d97706`, `#059669`) — data-focused
- Deep blue + gold (`#1e3a5f`, `#d4a73a`) — premium, sophisticated

Put your primary aesthetic in `:root` and the alternate in the media query:

```css
/* Light-first (editorial, paper/ink, blueprint): */
:root { /* light values */ }
@media (prefers-color-scheme: dark) { :root { /* dark values */ } }

/* Dark-first (neon, IDE-inspired, terminal): */
:root { /* dark values */ }
@media (prefers-color-scheme: light) { :root { /* light values */ } }
```

**Surfaces whisper, they don't shout.** Build depth through subtle lightness shifts (2-4% between levels), not dramatic color changes. Borders should be low-opacity rgba (`rgba(255,255,255,0.08)` in dark mode, `rgba(0,0,0,0.08)` in light) — visible when you look, invisible when you don't.

**Backgrounds create atmosphere.** Don't use flat solid colors for the page background. Subtle gradients, faint grid patterns via CSS, or gentle radial glows behind focal areas. The background should feel like a space, not a void.

**Visual weight signals importance.** Not every section deserves equal visual treatment. Executive summaries and key metrics should dominate the viewport on load (larger type, more padding, subtle accent-tinted background zone). Reference sections (file maps, dependency lists, decision logs) should be compact and stay out of the way. Use `<details>/<summary>` for sections that are useful but not primary — the collapsible pattern is in `./references/css-patterns.md`.

**Surface depth creates hierarchy.** Vary card depth to signal what matters. Hero sections get elevated shadows and accent-tinted backgrounds (`ve-card--hero` pattern). Body content stays flat (default `.ve-card`). Code blocks and secondary content feel recessed (`ve-card--recessed`). See the depth tiers in `./references/css-patterns.md`. Don't make everything elevated — when everything pops, nothing does.

**Animation earns its place.** Staggered fade-ins on page load are almost always worth it — they guide the eye through the diagram's hierarchy. Mix animation types by role: `fadeUp` for cards, `fadeScale` for KPIs and badges, `drawIn` for SVG connectors, `countUp` for hero numbers. Hover transitions on interactive-feeling elements make the diagram feel alive. Always respect `prefers-reduced-motion`. CSS transitions and keyframes handle most cases. For orchestrated multi-element sequences, anime.js via CDN is available (see `./references/libraries.md`).

**Forbidden animations:**
- Animated glowing box-shadows (`@keyframes glow { box-shadow: 0 0 20px... }`) — this is AI slop
- Pulsing/breathing effects on static content
- Continuous animations that run after page load (except for progress indicators)

Keep animations purposeful: entrance reveals, hover feedback, and user-initiated interactions. Nothing should glow or pulse on its own.

### 4. Copy — unslop every line of prose before you write it to HTML

Before you render any prose into the page, **run the copy through the `/unslop` skill**. Generated HTML often looks right structurally while the text underneath reads like generic AI output — predictable rhythms, overused connectors, manufactured emphasis, "Here's the thing:" phrasings. The template design will not save you if the copy is slop.

**What counts as "copy" (must be unslopped):**

- Headlines and sub-headlines
- Lead paragraphs, body paragraphs, descriptions under sections or modules
- Module/card descriptions
- Callout text, pull quotes, blockquotes
- Slide body copy
- Any complete-sentence content meant to be read as prose

**What does NOT count as copy (leave untouched):**

- Space Mono ALL CAPS labels (`LAST UPDATED`, `SOURCE`, `STATUS`)
- Numeric values, units, timestamps
- Code snippets, filenames, identifiers
- Mermaid node labels (they're diagram labels, not prose — keep them terse and technical)
- Table header cells and column names
- System messages in square brackets (`[NO DATA]`, `[ERROR: ...]`)
- Version strings, section numbers, counters

**Workflow:**

1. Draft the full set of prose copy for the page as a plain-text block before writing HTML.
2. Invoke `/unslop` on that block. The skill runs its two-pass diagnosis-then-reconstruction and returns revised copy.
3. Paste the unslopped copy into the HTML template. Do not paraphrase it again or "polish" it further — `/unslop` already did that work, and re-editing reintroduces the patterns it removed.

If you skip this step and your prose still reads as AI-generated (telltale phrases like "it's important to note", "let that sink in", "in today's fast-paced landscape", predictable three-item lists, transitional "however"s and "moreover"s), the output has failed the craft bar regardless of how good the visual design is.

### 5. Deliver

**Output location:** Write to `~/.agent/diagrams/`. Use a descriptive filename based on content: `modem-architecture.html`, `pipeline-flow.html`, `schema-overview.html`. The directory persists across sessions.

**Open in browser:**
- macOS: `open ~/.agent/diagrams/filename.html`
- Linux: `xdg-open ~/.agent/diagrams/filename.html`

**Tell the user** the file path so they can re-open or share it.

### 6. Verify in a browser (mandatory)

**Every generated diagram must be rendered and inspected before you report it as done.** Writing HTML does not verify it works — Mermaid can fail to parse, text can overflow, grids can collapse, and none of that shows up until a browser actually renders the page. A clean file write is not a green signal.

**Tool preference (use the first one available):**

1. **Playwright MCP** (preferred — widely available in Claude Code). Use these MCP tools:
   - `browser_navigate` to `file://~/.agent/diagrams/<filename>.html`
   - `browser_resize` to 1440×900 (desktop)
   - `browser_take_screenshot` (full page)
   - `browser_console_messages` to catch JS errors
   - `browser_resize` to 390×844 (mobile)
   - `browser_take_screenshot` again
2. **`/expect` skill** (if Playwright MCP is not available). Pass the file path; it runs adversarial checks and returns findings.
3. **`agent-browser` CLI** (portable fallback). Use `agent-browser screenshot <file-url>`.
4. **No browser automation available**: explicitly say so in your final message. Do NOT claim the output is verified. Open the file for the user with `open`/`xdg-open` and tell them you couldn't auto-verify.

**What to inspect in the screenshots (the LLM reads them):**

- **Mermaid rendered**, not a raw `<pre class="mermaid">` text dump. If you see Mermaid source code on the page, the diagram failed to parse — fix the source and regenerate.
- **No layout overflow.** Content stays inside its container at both desktop and mobile widths. Horizontal scrollbars on the body are a failure (except inside intentional `.table-scroll` / `.mermaid-wrap` containers).
- **Text not clipped or truncated.** Headings wrap cleanly. No ellipsis where there shouldn't be one. No characters pushed off-screen.
- **No template placeholders leaked** into output (`{{skill_dir}}`, `TODO`, placeholder names like "Module A" unless that's genuinely the content).
- **Hierarchy visible at a glance.** Apply the squint test mentally to the screenshot: the primary element dominates, the tertiary metadata stays quiet. For Mono-Industrial specifically: the three-layer rule is legible, status colors appear only on values, the one moment of surprise is clearly placed.
- **No console errors.** `browser_console_messages` should return empty or contain only expected warnings. Mermaid parse errors, font 404s, or JS exceptions are failures.
- **Both themes look intentional.** If practical, toggle `prefers-color-scheme` via `browser_evaluate` and re-screenshot; at minimum, verify the default theme renders coherently.

**On failure (anything above):**

- Fix the root cause — usually a Mermaid syntax error, overflowing text, or a missing CSS class. Don't shotgun-patch by tweaking margins.
- Regenerate the file.
- Re-verify in the browser.
- If still failing after a second attempt, deliver what you have but **tell the user exactly what's broken** and what you tried. Don't claim success on broken output.

**Do not skip this step.** The whole point of this skill is producing output that actually looks good when a human opens it. An unverified HTML file is a promise the skill can't keep.

**For poster output specifically (see `./references/poster.md` → "Canvas-fit verification loop"):** posters clip silently at the canvas edge — the live HTML preview will happily let content flow past the declared `w-[Npx] h-[Npx]` box, and only the exported PNG shows the real cropped result. After `poster export`, load the PNG (not just the HTML) and inspect for edge clipping, cut elements, collapsed grids, shrunken hero, or lost moment-of-surprise. If any fail, rework the TSX and re-export. Bounded at 3 attempts.

## Diagram Types

**The full rules, shape semantics, complexity budgets, removal test, and anti-patterns for all 13 supported diagram types live in `./references/diagrams-svg.md`.** This section summarizes the rendering-approach decision per type. Aesthetic token mappings for every diagram type live in `./references/diagram-tokens.md`.

Before authoring any diagram, pick the type via the Type Selection Gate in `diagrams-svg.md`, check the complexity budget, and run the Removal Test before emitting.

### Architecture / System Diagrams
Three approaches depending on complexity:

**Topology (≤ 14 elements):** Use **inline SVG** (start from `./templates/svg-diagram-starter.html`). Group nodes by tier or trust boundary. Focal accent on 1–2 critical integration points. Dashed rectangles for region boundaries with masked boundary labels.

**Text-heavy overviews (under 15 elements):** CSS Grid with explicit row/column placement when cards need descriptions, code references, tool lists, or other rich content that SVG nodes can't hold. Reference: `./templates/architecture.html`.

**Complex architectures (15+ elements):** Use the **hybrid pattern** — a simple Mermaid overview (5–8 nodes showing module relationships) followed by detailed CSS Grid cards for each module's internals. Auto-routing beats hand-authored coordinates above the complexity budget.

### Flowcharts / Pipelines
**Inline SVG for ≤ 9 nodes; Mermaid above that.** Shape carries meaning, not color: ovals (`rx=20`) for start/end, rectangles (`rx=6`) for steps, diamonds for decisions (≤ 3 exits or nest diamonds), filled dots (`r=4`) for merge points. Vertical flow. "Yes" → right, "No" → down. Label every edge. Accent on the happy path OR the most consequential decision — not every decision.

### Sequence Diagrams
**Inline SVG for ≤ 5 lifelines; Mermaid above that.** Actors in boxes at the top. Vertical dashed lifelines. Horizontal message arrows. Time flows down only. Activation bars 8px wide, muted fill, 0.8 stroke. Self-messages as U-loops. Return arrows dashed. Accent on the primary success response only.

### Data Flow Diagrams
**Mermaid** with edge labels. Data flow diagrams emphasize auto-routed connections over hand-placed boxes.

### Schema / ER Diagrams
**Inline SVG for ≤ 8 entities; Mermaid above that.** Two-part entity shape: header (type tag + name) + field list. `#` marks PK, `→` marks FK. Cardinality (`1`, `N`, `0..1`, `1..*`) placed 10–12px from connecting edge. Cluster related entities; don't draw every FK on a huge model. Accent on the aggregate root.

### State Machines / Decision Trees
**Inline SVG for ≤ 9 states; Mermaid above that.** Rounded rects (`rx=8`) for states. Start = filled dot (`r=6`). End = ringed dot. Transition labels in the pattern `event [guard] / action`. Self-loops arc above the node. Never draw "from any state" lines from every state — annotate once.

**`stateDiagram-v2` label caveat:** Transition labels have a strict parser — colons, parentheses, `<br/>`, HTML entities, and most special characters cause silent parse failures ("Syntax error in text"). If your labels need any of these (e.g., `cancel()`, `curate: true`, multi-line labels), use `flowchart TD` instead with rounded nodes and quoted edge labels (`|"label text"|`). Flowcharts handle all special characters and support `<br/>` for line breaks. Reserve `stateDiagram-v2` for simple single-word or plain-text labels.

### Mind Maps / Hierarchical Breakdowns
**Use Mermaid.** Use `mindmap` syntax for hierarchical branching from a root node. Mermaid handles the radial layout automatically. Style with `themeVariables` to control node colors at each depth level.

### Class Diagrams
**Use Mermaid.** Use `classDiagram` syntax for domain modeling, OOP design, and entity relationships with typed properties and methods. Supports relationships: association (`-->`), composition (`*--`), aggregation (`o--`), and inheritance (`<|--`). Add multiplicity labels (e.g., `"1" --> "*"`) and abstract/interface markers (`<<interface>>`, `<<abstract>>`). For simple entity boxes without OOP semantics (no methods, no inheritance), prefer `erDiagram` instead — it produces cleaner output for pure data modeling.

### C4 Architecture Diagrams
**Use Mermaid flowchart syntax — NOT native C4.** Use `graph TD` with `subgraph` blocks for C4 boundaries. Native `C4Context` hardcodes sharp corners, its own font, blue icons, and inline SVG colors that ignore `themeVariables` — it always clashes with custom palettes.

**Flowchart-as-C4 pattern:** Persons → rounded nodes `(("Name"))`, systems → rectangles `["Name"]`, databases → cylinders `[("Name")]`, boundaries → `subgraph` blocks, relationships → labeled arrows `-->|"protocol"|`. Use `classDef` + `:::className` to visually differentiate external systems (e.g., dashed borders). This inherits `themeVariables`, `fontFamily`, and CSS overrides like every other Mermaid diagram.

### Data Tables / Comparisons / Audits
Use a real `<table>` element — not CSS Grid pretending to be a table. Tables get accessibility, copy-paste behavior, and column alignment for free. The reference template at `./templates/data-table.html` demonstrates all patterns below.

**Use proactively.** Any time you'd render an ASCII box-drawing table in the terminal, generate an HTML table instead. This includes: requirement audits (request vs plan), feature comparisons, status reports, configuration matrices, test result summaries, dependency lists, permission tables, API endpoint inventories — any structured rows and columns.

Layout patterns:
- Sticky `<thead>` so headers stay visible when scrolling long tables
- Alternating row backgrounds via `tr:nth-child(even)` (subtle, 2-3% lightness shift)
- First column optionally sticky for wide tables with horizontal scroll
- Responsive wrapper with `overflow-x: auto` for tables wider than the viewport
- Column width hints via `<colgroup>` or `th` widths — let text-heavy columns breathe
- Row hover highlight for scanability

Status indicators (use styled `<span>` elements, never emoji):
- Match/pass/yes: colored dot or checkmark with green background
- Gap/fail/no: colored dot or cross with red background
- Partial/warning: amber indicator
- Neutral/info: dim text or muted badge

Cell content:
- Wrap long text naturally — don't truncate or force single-line
- Use `<code>` for technical references within cells
- Secondary detail text in `<small>` with dimmed color
- Keep numeric columns right-aligned with `tabular-nums`

### Timeline / Roadmap Views
**Inline SVG.** Horizontal hairline baseline. Ticks at meaningful intervals with monospace date labels. Events as dots with labels alternating above and below (thin connector lines to their dots). **Time scale must be honest** — unequal intervals get unequal spacing. Break the axis visibly when density demands it. For multi-phase roadmaps with rich content per phase, fall back to the CSS card pattern (central line pseudo-element + alternating cards).

### Swimlane Diagrams
**Inline SVG.** One lane per actor, max 5 lanes. Lane labels in the eyebrow style (mono, small, UPPERCASE, 0.18em tracking) in the left margin. 1px hairline dividers between lanes. Accent on high-impact boundary-crossing handoffs. Never assign one step to two lanes.

### Quadrant / Priority Matrices
**Inline SVG.** Centered axis cross. Axis labels at axis **ends**, not midpoints. Items as dots (`r=4`) with text labels. Accent on the "do first" item (top-right quadrant). ~12 items max. Never place items on axis lines. Never fill the four quadrants with different colors.

### Nested Containment
**Inline SVG.** 3–5 concentric rounded rects. Horizontal padding 24–32px, vertical padding 32–36px. Eyebrow label top-left on a small masked overlay across the ring. Stroke opacity escalates inward (0.30 → 0.45 → accent innermost). Accent on the innermost focal ring only.

### Tree / Hierarchy
**Inline SVG for depth ≤ 4; Mermaid `mindmap` for deeper or wider trees.** Root at top (or left). Nodes 120–180w × 40–52h. Name in sans 12px/600, optional sublabel in mono 9px. **Connectors orthogonal (elbow-style), never diagonal.** Max 5 children per level. Accent on one node only: either root or a critical leaf, not both.

### Layer Stack / Abstraction Levels
**Inline SVG.** 4–6 horizontal bands, 56–72px tall, 800–880px wide in a 1000 viewBox. Row content left-to-right: mono index · sans 600 layer name · contextual note. Fills alternate subtle shades OR all-paper with hairline dividers. Accent on the "bottleneck / pays-rent" layer. Direction indicator (arrow glyph) outside the left margin.

### Venn Diagrams
**Inline SVG.** 2 or 3 circles (never 4). Hairline 1px strokes in set-specific colors. Fills are very-low-opacity rgba versions of the same colors. Set names outside circles, intersection terms inside. One accent overlap = focal. Circle sizes proportional to cardinality, not fake-equal.

### Pyramid / Funnel
**Inline SVG.** 4–6 layers, 56–72px tall each. **Widths must be honest** (proportional to count or percentage). Centered name in sans 600 per layer, optional sublabel and optional side annotation. Accent on the apex (pyramid) or the conversion layer (funnel), never the base. Pick pyramid-up OR funnel-down and commit.

### Dashboard / Metrics Overview
Card grid layout. Hero numbers large and prominent. Sparklines via inline SVG `<polyline>`. Progress bars via CSS `linear-gradient` on a div. For real charts (bar, line, pie), use **Chart.js via CDN** (see `./references/libraries.md`). KPI cards with trend indicators (up/down arrows, percentage deltas).

### Implementation Plans

For visualizing implementation plans, extension designs, or feature specifications. The goal is **understanding the approach**, not reading the full source code.

**Don't dump full files.** Displaying entire source files inline overwhelms the page and defeats the purpose of a visual explanation. Instead:
- Show **file structure with descriptions** — list functions/exports with one-line explanations
- Show **key snippets only** — the 5-10 lines that illustrate the core logic
- Use **collapsible sections** for full code if truly needed

**Code blocks require explicit formatting.** Without `white-space: pre-wrap`, code runs together into an unreadable wall. See the "Code Blocks" section in `./references/css-patterns.md` for the base pattern.

**Mono-Industrial code blocks are terminal-dark with syntax highlighting.** Every code block on a Mono-Industrial page uses a near-black background (`#0a0a0a`) regardless of whether the page is in light or dark mode, paired with Prism.js for syntax highlighting using the restrained token palette in `./references/libraries.md` → "Prism.js — Syntax Highlighting". The terminal block is the one place in the aesthetic that breaks the grayscale rule — it uses the existing status colors (`--warn` for strings/numbers, `--err` for tags/deletions, `--ok` for diff insertions) plus three levels of foreground opacity for everything else. No new colors are introduced. See `./references/mono-industrial.md` § 16 for the rationale and the full token mapping.

**Structure for implementation plans:**
1. Overview/purpose (what problem does this solve?)
2. Flow diagram (Mermaid or CSS cards)
3. File structure with descriptions (not full code)
4. Key implementation details (snippets)
5. API/interface summary
6. Usage examples

### Documentation (READMEs, Library Docs, API References)

When visualizing documentation, extract structure into visual elements:

| Content | Visual Treatment |
|---------|------------------|
| Features | Card grid (2-3 columns) |
| Install/setup steps | Numbered cards or vertical flow |
| API endpoints/commands | Table with sticky header |
| Config options | Table |
| Architecture | Mermaid diagram or CSS card layout |
| Comparisons | Side-by-side panels or table |
| Warnings/notes | Callout boxes |

Don't just format the prose — transform it. A feature list becomes a card grid. Install steps become a numbered flow. An API reference becomes a table.

### Prose Accent Elements

Use these sparingly within visual pages to highlight key points or provide breathing room. See "Prose Page Elements" in `./references/css-patterns.md` for CSS patterns.

- **Lead paragraph** — larger intro text to set context before diving into cards/grids
- **Pull quote** — highlight a key insight; one per page maximum
- **Callout box** — warnings, tips, important notes
- **Section divider** — visual break between major sections

**When to use:** A visual page explaining an essay might use a lead paragraph for the thesis, then cards for key arguments. A README visualization might use callout boxes for warnings but otherwise stay card/table-focused.

## Slide Deck Mode

An alternative output format for presenting content as a magazine-quality slide presentation instead of a scrollable page. **Opt-in only** — the agent generates slides when the user invokes `/generate-slides`, passes `--slides` to an existing prompt (e.g., `/diff-review --slides`), or explicitly asks for a slide deck. Never auto-select slide format.

**Before generating slides**, read `./references/slide-patterns.md` (engine CSS, slide types, transitions, nav chrome, presets) and `./templates/slide-deck.html` (reference template showing all 10 types). Also read `./references/css-patterns.md` for shared patterns and `./references/libraries.md` for Mermaid/Chart.js theming.

**Slides are not pages reformatted.** They're a different medium. Each slide is exactly one viewport tall (100dvh) with no scrolling. Typography is 2–3× larger. Compositions are bolder. The agent composes a narrative arc (impact → context → deep dive → resolution) rather than mechanically paginating the source.

**Content completeness.** Changing the medium does not mean dropping content. Follow the "Planning a Deck from a Source Document" process in `slide-patterns.md` before writing any HTML: inventory the source, map every item to slides, verify coverage. Every section, decision, data point, specification, and collapsible detail from the source must appear in the deck. If a plan has 7 sections, the deck covers all 7. If there are 6 decisions, present all 6 — not the 2 that fit on one slide. Collapsible details in the source become their own slides. Add more slides rather than cutting content. A 22-slide deck that covers everything beats a 13-slide deck that looks polished but is missing 40% of the source.

**Slide types (10):** Title, Section Divider, Content, Split, Diagram, Dashboard, Table, Code, Quote, Full-Bleed. Each has a defined layout in `slide-patterns.md`. Content that exceeds a slide's density limit splits across multiple slides — never scrolls within a slide.

**Visual richness:** Check `which surf` at the start. If surf-cli is available, generate 2–4 images (title slide background, full-bleed background, optional content illustrations) before writing HTML — see the Proactive Imagery section in `slide-patterns.md` for the workflow. Also use SVG decorative accents, per-slide background gradients, inline sparklines, and small Mermaid diagrams. Visual-first, text-second.

**Compositional variety:** Consecutive slides must vary spatial approach — centered, left-heavy, right-heavy, split, edge-aligned, full-bleed. Three centered slides in a row means push one off-axis.

**Curated presets:** Four slide-specific presets as starting points (Midnight Editorial, Warm Signal, Terminal Mono, Swiss Clean) plus the existing 8 aesthetic directions adapted for slides. Pick one and commit. See `slide-patterns.md` for preset CSS values.

**`--slides` flag on existing prompts:** When a user passes `--slides` to `/diff-review`, `/plan-review`, `/project-recap`, or other prompts, the agent gathers data using the prompt's normal data-gathering instructions, then presents the content as a slide deck instead of a scrollable page. The slide version tells the same story with different structure and pacing — but the same breadth of coverage. Don't use the slide format as an excuse to summarize or skip sections that the scrollable version would have included.

**`--poster-export` flag (optional).** When the user passes `--poster-export` to `/generate-slides`, the agent produces the interactive HTML deck first (canonical), then *additionally* renders each slide to its own fixed-canvas PNG via `poster-ai`. Slides go to `~/.agent/diagrams/<deck-name>/slides/<NN>-<title>.png` at 1920×1080 (or 1600×900 for tighter 16:9). Use these PNGs to share individual slides or to import into Keynote / Google Slides. Check `which poster` first; if missing, tell the user the flag is unavailable and proceed with HTML-only. See `./references/poster.md` → "Slide decks as per-slide posters" for the workflow.

## Video Output Mode

An alternative output format: MP4 / WebM video via [Hyperframes](https://github.com/heygen-com/hyperframes) (Apache 2.0, HeyGen). **Opt-in only** — the agent generates video when the user invokes `/generate-video` or `/render-video`, or explicitly asks for an "explainer video," "reel," or "mp4." Never auto-select video.

**Two commands:**
- `/generate-video` — greenfield. Takes a topic/outline, builds a Hyperframes composition from scratch, renders MP4.
- `/render-video` — takes an existing HTML deck (from `/generate-slides` or `/generate-slides --magazine`) and converts it to MP4.

**Two styles, picked explicitly:**
- `long-form` — 16:9 landscape, 1920×1080, 60–180s, slide-paced dwell scenes, TTS narration, minor shader transitions. For meetings, onboarding, LinkedIn.
- `reel` — 9:16 vertical, 1080×1920, 30–60s, hard cuts every 1.2–1.8s, kinetic typography, progressive diagram reveal, burned-in captions. For Shorts / Reels / TikTok silent-autoplay feeds.

**Before generating video, read `./references/hyperframes.md` (runtime, constraints, CLI flags), `./references/gsap-rules.md` (hard constraints — timelines must be `{ paused: true }`, no `Math.random`, no `repeat: -1`), and — for reel style — `./references/reel-patterns.md` (beat structure, kinetic typography, progressive diagram reveal, TTS + burned-in captions).** Start compositions from `./templates/hyperframes-longform.html` or `./templates/hyperframes-reel.html`.

**Runtime requirements.** Hyperframes needs Node ≥ 22 and FFmpeg on PATH. The skill runs `bash {{skill_dir}}/scripts/hyperframes-doctor.sh` at the start of any video command; if it exits non-zero, abort and forward install hints to the user. Do not attempt to render with missing deps.

**Verification flow is mandatory.** Video is a high-cost command.
1. `npx hyperframes lint && npx hyperframes validate` before render (validate runs WCAG contrast audit)
2. `npx hyperframes render --quality draft` for fast preview
3. `bash {{skill_dir}}/scripts/extract-keyframes.sh <draft.mp4>` → 3 keyframes (start/mid/end)
4. Show keyframes to user, ask for approval
5. On approval: `npx hyperframes render --quality standard` for delivery

Because video is high-cost, the AskUserQuestion caveat (see `./references/clarify.md`) **always fires** for video commands — even if the user's request is otherwise clear. Minimum questions: style (long-form vs reel) and duration. Bypass only on explicit `--no-ask` flag.

**Video output location:** `~/.agent/videos/<slug>.mp4` (not `~/.agent/diagrams/`). Keyframes to `~/.agent/videos/<slug>/keyframes/`. Intermediate assets (narration.wav, captions.vtt) to `~/.agent/videos/<slug>/`.

## File Structure

Every diagram is a single self-contained `.html` file. No external assets except CDN links (fonts, optional libraries). Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descriptive Title</title>
  <link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">
  <style>
    /* CSS custom properties, theme, layout, components — all inline */
  </style>
</head>
<body>
  <!-- Semantic HTML: sections, headings, lists, tables, inline SVG -->
  <!-- No script needed for static CSS-only diagrams -->
  <!-- Optional: <script> for Mermaid, Chart.js, or anime.js when used -->
</body>
</html>
```

## Sharing Pages

Share visual explainer pages instantly via Vercel. No account or authentication required.

**Usage:**
```bash
bash {{skill_dir}}/scripts/share.sh <html-file>
```

**Example:**
```bash
bash {{skill_dir}}/scripts/share.sh ~/.agent/diagrams/my-diagram.html

# Output:
# ✓ Shared successfully!
# Live URL:  https://skill-deploy-abc123.vercel.app
# Claim URL: https://vercel.com/claim-deployment?code=...
```

**How it works:**
1. Copies HTML file to temp directory as `index.html`
2. Deploys via the vercel-deploy skill (zero-auth claimable deployment)
3. URL is live immediately — works in any browser

**Requirements:**
- vercel-deploy skill (should be pre-installed; if not: `pi install npm:vercel-deploy`)

**Notes:**
- Deployments are public — anyone with the URL can view
- Preview deployments have configurable retention (default: 30 days)
- Claim URL lets you transfer the deployment to your Vercel account

See `./commands/share.md` for the `/share` command template.

## Quality Checks

Most of these are enforced by the mandatory **Verify in a browser** step above (Workflow § 6). The list below is the human-readable expansion of what the LLM is actually looking for when inspecting screenshots.

- **The squint test**: Blur your eyes. Can you still perceive hierarchy? Are sections visually distinct?
- **The swap test**: Would replacing your fonts and colors with a generic dark theme make this indistinguishable from a template? If yes, push the aesthetic further.
- **Both themes**: Toggle your OS between light and dark mode. Both should look intentional, not broken.
- **Information completeness**: Does the diagram actually convey what the user asked for? Pretty but incomplete is a failure.
- **No overflow**: Resize the browser to different widths. No content should clip or escape its container. Every grid and flex child needs `min-width: 0`. Side-by-side panels need `overflow-wrap: break-word`. Never use `display: flex` on `<li>` for marker characters — it creates anonymous flex items that can't shrink, causing lines with many inline `<code>` badges to overflow. Use absolute positioning for markers instead. See the Overflow Protection section in `./references/css-patterns.md`.
- **Mermaid zoom controls**: Every `.mermaid-wrap` container must have zoom controls (+/−/reset/expand buttons), Ctrl/Cmd+scroll zoom, click-and-drag panning, and click-to-expand (clicking without dragging opens the diagram full-size in a new tab). The expand button (⛶) provides the same functionality. See `./references/css-patterns.md` for the full pattern including the `openMermaidInNewTab()` function.
- **File opens cleanly**: No console errors, no broken font loads, no layout shifts.

## Anti-Patterns (AI Slop)

These patterns are explicitly forbidden. They signal "AI-generated template" and undermine the skill's purpose of producing distinctive, high-quality diagrams. Review every generated page against this list.

### Typography

**Forbidden fonts as primary `--font-body`:**
- Inter — the single most overused AI default
- Roboto, Arial, Helvetica — generic system fallbacks promoted to primary
- system-ui, sans-serif alone — no character, no intent

**Required:** Pick from the font pairings in `./references/libraries.md`. Every generation should use a different pairing from the last.

### Color Palette

**Forbidden accent colors:**
- Indigo-500/violet-500 (`#8b5cf6`, `#7c3aed`, `#a78bfa`) — Tailwind's default purple range
- The cyan + magenta + pink neon gradient combination (`#06b6d4` → `#d946ef` → `#f472b6`)
- Any palette that could be described as "Tailwind defaults with purple/pink/cyan accents"

**Forbidden color effects:**
- Gradient text on headings (`background: linear-gradient(...); background-clip: text;`) — this screams AI-generated
- Animated glowing box-shadows on cards (`box-shadow: 0 0 20px var(--glow); animation: glow 2s...`)
- Multiple overlapping radial glows in accent colors creating a "neon haze"

**Required:** Build palettes from the reference templates (terracotta/sage, teal/cyan, rose/cranberry, slate/blue) or derive from real IDE themes (Dracula, Nord, Solarized, Gruvbox, Catppuccin). Accents should feel intentional, not default.

### Section Headers

**Forbidden:**
- Emoji icons in section headers (🏗️, ⚙️, 📁, 💻, 📅, 🔗, ⚡, 🔧, 📦, 🚀, etc.)
- Section headers that all use the same icon-in-rounded-box pattern

**Required:** Use styled monospace labels with colored dot indicators (see `.section-label` in templates), numbered badges (`section__num` pattern), or asymmetric section dividers. If an icon is genuinely needed, use an inline SVG that matches the palette — not emoji.

### Layout & Hierarchy

**Forbidden:**
- Perfectly centered everything with uniform padding
- All cards styled identically with the same border-radius, shadow, and spacing
- Every section getting equal visual treatment — no hero/primary vs. secondary distinction
- Symmetric layouts where left and right halves mirror each other

**Required:** Vary visual weight. Hero sections should dominate (larger type, more padding, accent-tinted background). Reference sections should feel compact. Use the depth tiers (hero → elevated → default → recessed). Asymmetric layouts create interest.

### Template Patterns

**Forbidden:**
- Three-dot window chrome (red/yellow/green dots) on code blocks — this is a cliché
- KPI cards where every metric has identical gradient text treatment
- "Neon Dashboard" as an aesthetic choice — it always produces generic results
- Gradient meshes with pink/purple/cyan blobs in the background

**Required:** Code blocks use a simple header with filename or language label. KPI cards vary by importance — hero numbers for the primary metric, subdued treatment for supporting metrics. Pick aesthetics with natural constraints: Blueprint (must feel technical/precise), Editorial (must have generous whitespace and serif typography), Paper/ink (must feel warm and informal).

### The Slop Test

Before delivering, apply this test: **Would a developer looking at this page immediately think "AI generated this"?** The telltale signs:

1. Inter or Roboto font with purple/violet gradient accents
2. Every heading has `background-clip: text` gradient
3. Emoji icons leading every section
4. Glowing cards with animated shadows
5. Cyan-magenta-pink color scheme on dark background
6. Perfectly uniform card grid with no visual hierarchy
7. Three-dot code block chrome

If two or more of these are present, the page is slop. Regenerate with a different aesthetic direction — Editorial, Blueprint, Paper/ink, or a specific IDE theme. These constrained aesthetics are harder to mess up because they have specific visual requirements that prevent defaulting to generic patterns.
