# SVG Diagrams — Editorial-Grade Inline SVG

**The primary diagram approach.** For the 13 supported diagram types, generate pure inline SVG with no JS dependencies. Mermaid stays available as a fallback for graphs with 15+ nodes where auto-layout beats hand-authored coordinates.

This reference is a paraphrased port of the rules and primitives from [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) (MIT, Cocoon AI), adapted to fit inside an aesthetic-aware skill. Original rules by Cathryn Lavery; adaptation here preserves the philosophy and prescriptions while integrating with this skill's token system.

---

## Philosophy

The best diagrams are done when nothing can be removed, not when everything has been added. Deletion is the highest-quality move.

- **Target density: 4/10.** Visually complete, not overwhelming. If a node can be removed without losing comprehension, remove it. If two nodes always travel together, merge them.
- **Confident restraint.** One accent color. One or two uses per diagram. One focal element.
- **Shape carries meaning, not color.** Flowchart ovals mean start/end, rects mean steps, diamonds mean decisions. Color is reserved for focal emphasis, not taxonomy.
- **Hairlines over shadows.** Shadows signal "web app"; hairline borders signal "figure in a magazine."
- **Honest proportions.** Timeline intervals space by real time. Funnel widths match real conversion. Venn circle sizes track real cardinality.

---

## The Removal Test — Pre-Output Gate

Run this checklist before emitting any SVG diagram. If any answer is "no," the diagram is not ready.

**Type fit**
- [ ] Does the chosen diagram type actually match the content? (See § Type Selection Gate.)
- [ ] Would a paragraph explain this better? (If yes, write the paragraph.)

**Removal**
- [ ] Can any node be removed without losing comprehension?
- [ ] Can any two nodes that always travel together be merged?
- [ ] Can any arrow be removed because the layout already implies direction?

**Signal (the focal rule)**
- [ ] Is the accent color used on ≤ 2 elements?
- [ ] Is there exactly one focal element (the place the eye should land first)?
- [ ] Are non-focal elements intentionally quieter?

**Technical**
- [ ] Are arrows drawn before nodes in z-order (so nodes sit on top of lines)?
- [ ] Does every arrow label have an opaque paper-colored rect behind it (so it doesn't collide with strokes)?
- [ ] Is the legend a horizontal strip at the bottom of the SVG (never floating inside)?
- [ ] Is there no vertical `writing-mode` text on arrows?
- [ ] Has the SVG `viewBox` height been expanded by ~60px to make room for the legend?

**Typography**
- [ ] Are node names in the sans face (not monospace)?
- [ ] Is monospace used only for technical content (ports, types, URLs, arrow labels, eyebrow kicker)?
- [ ] Is JetBrains Mono absent from the diagram?

**Grid**
- [ ] Is every coordinate, font size, width, and gap divisible by 4? (Exemptions: stroke widths, opacity, the dot-pattern spacing of 22.)

If all boxes check, emit. Otherwise, iterate.

---

## Type Selection Gate

Before any SVG is authored, pick exactly one diagram type using this table.

| Content shape | Type |
|---|---|
| Components with visible connections | Architecture |
| Decision branches / conditional flow | Flowchart |
| Time-ordered messages between actors | Sequence |
| States with transitions and guards | State machine |
| Entities with typed fields and relationships | ER |
| Events placed in time | Timeline |
| Cross-functional process with handoffs across roles | Swimlane |
| Two-axis positioning / prioritization | Quadrant |
| Hierarchy through containment | Nested |
| Parent → children hierarchy | Tree |
| Stacked abstraction levels | Layer stack |
| Overlap between sets | Venn |
| Ranked hierarchy / conversion / drop-off | Pyramid / funnel |

**Anti-selection criteria — don't draw a diagram when:**

- A 3-column table says the same thing with less effort.
- The diagram is one generic shape with a label (write the sentence).
- A bulleted list conveys the same information.
- The content mixes two types (pick the dominant axis; if you can't, split into two diagrams).

---

## Universal Anti-Patterns

These patterns look AI-generated the second a designer sees them. Avoid every one.

| Anti-pattern | Why it fails |
|---|---|
| Dark mode + cyan/purple glow | Reads as neon-dashboard AI slop |
| JetBrains Mono as a blanket body font | Mono is for technical content only |
| Identical boxes for every node | Erases visual hierarchy |
| Legend floating inside the diagram | Must live as a horizontal strip at the bottom |
| Arrow labels without a masking rect | Text bleeds into strokes; becomes unreadable |
| Vertical `writing-mode` text on arrows | Unreadable at any size |
| Three equal-width summary cards | Too generic; vary widths |
| `box-shadow` on nodes | Use 1px hairline borders instead |
| `rounded-2xl` (16px radius) | Use 4–8px or none |
| Accent color on every "important" node | Erases focal signal |
| `background-clip: text` gradients on titles | AI slop signature |

---

## Complexity Budgets — Split the Diagram Before You Exceed These

If any budget is about to be blown, split the content into two smaller diagrams or collapse to a table.

| Type | Maximum |
|---|---|
| Generic nodes | 9 |
| Arrows / transitions | 12 |
| Focal (accent) elements | 2 |
| Sequence lifelines | 5 |
| Swimlane lanes | 5 |
| Quadrant items | 12 |
| ER entities | 8 |
| Nested containment levels | 6 |
| Tree depth | 4 (and ≤ 5 children per level) |
| Layer stack layers | 6 |
| Venn circles | 3 (4+ becomes a matrix) |
| Pyramid layers | 6 |
| Annotation callouts | 2 |

---

## Per-Type Rules

### 1. Architecture
Group nodes by tier or trust boundary. Consistent flow direction (L→R or T→B, not both). Mark regions with dashed rectangles; boundary labels sit on a small masked rect where they cross the border. Focal color lives on 1–2 critical integration points.

### 2. Flowchart
Shape carries meaning, not color:
- Oval (`rx=20`) — start / end
- Rectangle (`rx=6`) — step
- Diamond — decision (≤ 3 exits; nest diamonds if more)
- Filled dot (`r=4`) — merge point

Vertical flow. "Yes" → right, "No" → down, and **label every edge**. Accent on the happy path OR the most consequential decision — not every decision. Crossing arrows: use a small arc-jump.

### 3. Sequence
Actors in boxes at the top. Vertical dashed lifelines down the page. Horizontal message arrows. Time flows down, never up. Activation bars 8px wide with muted fill and 0.8 stroke. Self-messages are U-loops. Return arrows are dashed. Accent on the primary success response only (one or two max). No lane-style rendering (that's Swimlane, not Sequence). No unclosed activations.

### 4. State machine
Rounded rects (`rx=8`) for states. Start = filled dot (`r=6`). End = ringed dot. Transition labels use the pattern `event [guard] / action`. Self-loops arc above the node. Never draw "from any state" lines from every state — annotate once in prose or with a single global transition. If transitions exceed 2× state count, split into two state machines.

### 5. ER
Two-part entity: header (type tag + name) + field list. `#` marks the PK. `→` marks an FK. Cardinality (`1`, `N`, `0..1`, `1..*`) placed 10–12px from the connecting edge. Cluster related entities; don't draw every FK on a huge model. Accent on the aggregate root.

### 6. Timeline
Horizontal hairline baseline. Ticks at meaningful intervals with monospace date labels. Events as dots. Event labels alternate above and below the baseline with thin connector lines to their dots. **Time scale must be honest** — unequal intervals get unequal spacing. Break the axis visibly when density demands it.

### 7. Swimlane
One lane per actor. Lane labels in the eyebrow style (mono, small, UPPERCASE, 0.18em tracking) in the left margin. 1px hairline dividers between lanes. Accent on high-impact boundary-crossing handoffs. Never assign one step to two lanes.

### 8. Quadrant
Centered axis cross. Axis labels at axis **ends**, not midpoints. Items as dots (`r=4`) with text labels. Accent on the "do first" item (top-right). ~12 items max. Never place items on axis lines. Never fill the four quadrants with different colors.

### 9. Nested
3–5 concentric rounded rects. Horizontal padding 24–32px. Vertical padding 32–36px. Eyebrow label top-left on a small masked overlay across the ring. Stroke opacity escalates inward (0.30 → 0.45 → accent innermost). Fill opacity fades from 0.015 outer to accent-tinted inner. Accent on the innermost focal ring only.

### 10. Tree
Root at top (or left). Nodes sized 120–180w × 40–52h. Name in sans 12px/600, optional sublabel in mono 9px. **Connectors are orthogonal (elbow-style), never diagonal.** Max depth 4, max 5 children per level. Accent on one node only: either the root or a critical leaf, not both.

### 11. Layer stack
4–6 horizontal bands, each 56–72px high, 800–880px wide inside a 1000 viewBox. Row content left-to-right: mono index · layer name (sans 600) · contextual note. Fills alternate subtle shades OR all-paper with hairline dividers. Accent on the "bottleneck / pays-rent" layer. Direction indicator (arrow glyph) outside the left margin.

### 12. Venn
2 or 3 circles (never 4). Hairline 1px strokes in set-specific colors. Fills are very-low-opacity rgba versions of the same colors. Set names outside circles. Intersection terms inside. One accent overlap = focal. Circle sizes proportional to cardinality, not fake-equal.

### 13. Pyramid / funnel
4–6 layers, each 56–72px tall. **Widths must be honest** (proportional to count or percentage). Centered name in sans 600 per layer, optional sublabel and optional side annotation. Accent on the apex (pyramid) or the conversion layer (funnel), never the base. No mixed orientations — pick pyramid up or funnel down and commit.

---

## Primitives

Two accent primitives lift a diagram from "fine" to "editorial."

### Annotation callout
Italic serif + dashed leader line + landing dot. Signals "editorial voice" against the diagram's sans/mono body. Max 2 per diagram. Leader is **dashed only** (solid risks confusion with flow arrows). Placement in margins only; never overlaps content. Neutral callouts use ink text + 40% opacity leader. Focal callouts use the accent color for both text and leader.

```
┌─────────────────────────────┐
│  [node]  ┄┄┄┄┄┄┄┄● Italic serif annotation
│                     text
└─────────────────────────────┘
```

### Sketchy filter
SVG `feTurbulence` + `feDisplacementMap` to produce a wobbly, hand-drawn feel. **Critical rule: filter shapes, not text.** Displacement-mapped text becomes illegible; text sits in an unfiltered group above. Parameters:
- `baseFrequency` 0.01–0.04
- `numOctaves` 1–3 (2 typical)
- `scale` 1–6
- `seed` set for deterministic output

Use for narrative / essay contexts; skip for technical docs, dense labels, and dark backgrounds.

---

## Technical Implementation

### File shape
One self-contained `.html` file per diagram. Inline SVG. Google Fonts `<link>` is the only external reference (unless the active aesthetic bundles its fonts differently — see `diagram-tokens.md`).

### viewBox
Typical canvas is `1000 × 600`. Add ~60px of height reserved for a bottom legend strip.

### Background stack
```xml
<rect width="100%" height="100%" fill="var(--paper)" />
<rect width="100%" height="100%" fill="url(#dots)" opacity="0.55" />
```

The dot pattern gives the canvas editorial texture. Pattern cell 22×22; a 0.9-radius circle at 10% ink opacity.

### Arrow markers
Define three markers in `<defs>`:
- `arrow` — muted ink (default flow)
- `arrow-accent` — focal color
- `arrow-link` — link blue (only used for cross-references)

### Z-order
Draw arrows first, nodes second. This is a hard rule. Nodes must sit on top of lines, not the other way around.

### Arrow label masking
Every arrow label is preceded by a small `<rect>` filled with the paper color, slightly larger than the label's bounding box. Prevents the label from colliding with the stroke it sits on.

### Legend
A horizontal strip at the bottom of the viewBox, separated from the diagram body by a hairline rule (`stroke="var(--rule)"`). Never float legends inside the diagram body.

### 4px grid
Every coordinate, font size, width, height, and gap is divisible by 4. Stroke widths, opacity values, and the 22×22 dot pattern are the only exemptions.

---

## Decision: SVG vs Mermaid

Pure SVG is the default for all 13 supported types. Mermaid remains available as a fallback when:

- The graph has 15+ nodes and manual coordinate authoring would be impractical.
- The content is a forest of one type (all nodes identical shape) where Mermaid's auto-layout produces cleaner results than hand-placed coordinates would.
- The user explicitly requests Mermaid.

When using Mermaid, follow all rules in `libraries.md` → Mermaid Theming and apply the same anti-patterns list above. Even Mermaid should obey the focal rule, the masking rule, and the 4px grid.

---

## Aesthetic Token Adaptation

A diagram renders inside a page. Fonts and colors come from whichever aesthetic the host page uses. See `diagram-tokens.md` for the per-aesthetic token mapping:

- Inside Mono-Industrial → Space Grotesk + Space Mono, grayscale with status colors as focal
- Inside SubQ → Libre Baskerville + Manrope + Roboto Mono, pixel-block accents
- Inside Editorial-Diagram (the diagram-design native aesthetic) → Instrument Serif + Geist + Geist Mono, rust/coral accent
- Inside Blueprint → deep slate + cyan grid, monospace labels
- Inside other named aesthetics → inherit host tokens, preserve shape semantics and the 4px grid

Shape semantics, the 4px grid, arrow-label masking, z-order, complexity budgets, and the removal test are **aesthetic-independent** and apply to every diagram in every aesthetic.

---

## Attribution

This reference paraphrases and adapts the rules and philosophy from [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) (MIT License, © Cocoon AI). The original skill covers the same 13 diagram types with a fixed editorial aesthetic. This skill integrates those rules with an aesthetic-aware token system so the same rules apply regardless of the surrounding page's visual identity.
