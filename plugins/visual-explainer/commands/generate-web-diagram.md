---
description: Generate a beautiful standalone HTML diagram and open it in the browser
---
Load the visual-explainer skill, then generate an HTML diagram for: $@

Follow the visual-explainer skill workflow. Read the reference template and CSS patterns before generating. Default to the Mono-Industrial aesthetic (Geist Pixel Square hero, Space Grotesk + Space Mono body) unless the user explicitly requests a named alternative.

## Sub-agent fan-out (default for 3+ sections)

After drafting the page outline, count the major sections.

- **Outline has 1–2 sections, or `--no-parallel` was passed:** build sequentially yourself. Skip the rest of this section.
- **Outline has 3+ sections:** fan out to specialized sub-agents in parallel. Each sub-agent produces one section as a structured fragment; you stitch them together.

### Fan-out protocol

1. **Read the contract** at `plugins/visual-explainer/references/section-contract.md` before dispatching. It defines the fragment schema, role table, and stitching rules. Also read `plugins/visual-explainer/references/tokens.md` and `plugins/visual-explainer/references/components.md` so you understand what the sub-agents will produce.
2. **Assign a role to every section** from the role table: `hero`, `diagram`, `table`, `dashboard`, or `prose`. If a section doesn't fit any role, build it yourself rather than inventing a new role.
3. **Dispatch in parallel.** Send a single message containing one `Task` tool-use per section. For each:
   - `subagent_type`: `ve-{role}-builder`
   - `description`: short label like "Build hero — request ledger"
   - `prompt`: a self-contained brief with the section's content, role, index number, and a pointer to read `tokens.md`, `components.md`, `section-contract.md`, and the relevant component recipe before producing output. Pass headlines/lede/descriptions **already unslopped** — do NOT make sub-agents call `/unslop` themselves (the prose sub-agent is the only exception).
4. **Collect fragments** from each sub-agent. Each returns a single JSON object matching the contract schema.
5. **Validate.** Reject any fragment that violates the rejection conditions in `section-contract.md`. Re-dispatch with corrected brief — at most 1 retry per section.
6. **Stitch into one HTML file.** Build `<head>`, dedup font and library imports, publish tokens once on `:root`, concatenate `scoped_css` blocks, concatenate `section_html` in section order, substitute `{{NN}}` placeholders, add the bottom-of-page Mermaid render loop if any fragment needs it. The full stitching procedure is in `section-contract.md` § "Orchestrator responsibilities".
7. **Write** to `~/.agent/diagrams/<descriptive-name>.html`.
8. **Browser-verify** per the standard SKILL.md § 6 procedure: Playwright MCP screenshot at 1440×900 desktop and 390×844 mobile, console-error check, hierarchy check, no overflow at either width.
9. **Tell the user** the file path and which sub-agents fanned out.

### When fan-out is wrong

- **Single-diagram requests** (one Mermaid flow, nothing else): build sequentially. Fan-out adds overhead with no parallelism gain.
- **Sections that depend on each other's output** (e.g., a summary that quotes the table): build sequentially or build the dependent section yourself after the others return.
- **Stitch failures** (CSS leaks across sections, font missing, Mermaid not rendering): re-run with `--no-parallel` to confirm the sequential path works, then debug whichever sub-agent emitted the bad fragment.

## Optional AI illustration

If `surf` CLI is available (`which surf`), consider generating an AI illustration via `surf gemini --generate-image` when an image would genuinely enhance the page — a hero banner, conceptual illustration, or educational diagram that Mermaid can't express. Match the image style to the page's palette. Embed as base64 data URI. See css-patterns.md "Generated Images" for container styles. Skip images when the topic is purely structural or data-driven.

Write to `~/.agent/diagrams/` and open the result in the browser.
