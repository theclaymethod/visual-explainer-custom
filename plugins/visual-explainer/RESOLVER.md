# Visual Explainer Resolver

This is the top-level routing table for the `visual-explainer` plugin.

The goal is simple:

- Route by **user intent**, not by whichever command happens to mention a feature.
- Pick the **output family** before the exact command.
- Load only the references needed for the selected path.

If a capability exists but is not reachable from this document, it is considered dark and should fail `check-resolvable`.

## Step 1: Determine the output family

| If the user wants... | Route to output family | Notes |
|---|---|---|
| A browser-readable explainer, review, comparison, architecture page, or table | `html` | Default family for the plugin |
| A printable handout or deck export | `pdf` | First-class export surface, not just a flag |
| A shareable video for review, presentation, or social | `video-delivery` | Usually `mp4` |
| A video asset for editing or compositing | `video-editable` | Usually `mov` |
| A looping or transparent browser asset | `video-browser` | Usually `webm` |
| Per-slide stills, thumbnails, keyframes, or reusable media snippets | `assets` | PNG, JPG, keyframes, snippets |

## Step 2: Pick the command

| Input shape | Primary command | Required refs |
|---|---|---|
| Topic, system, feature, concept, architecture | `generate-web-diagram` | `output-resolver.md`, `clarify.md`, `mono-industrial.md` |
| Feature request or implementation brief | `generate-visual-plan` | `output-resolver.md`, `clarify.md` |
| Existing diff / branch / commit / PR | `diff-review` | `output-resolver.md`, `clarify.md` |
| Existing plan/spec against codebase | `plan-review` | `output-resolver.md`, `clarify.md` |
| Recent project activity / re-entry summary | `project-recap` | `output-resolver.md`, `clarify.md` |
| Existing file to verify | `fact-check` | `output-resolver.md` |
| Existing HTML file to share | `share` | `output-resolver.md` |
| Topic or source material that should become a slide deck | `generate-slides` | `output-resolver.md`, `clarify.md`, `slide-patterns.md` |
| Topic or source material that should become a fixed-canvas graphic | `generate-poster` | `output-resolver.md`, `clarify.md`, `poster.md` |
| Topic, outline, transcript, changelog, URL, or doc that should become a video | `generate-video` | `output-resolver.md`, `hyperframes-prompting.md`, `render-modes.md` |
| Existing HTML deck, magazine, or explainer page that should become a video | `render-video` | `output-resolver.md`, `hyperframes-prompting.md`, `render-modes.md` |
| Existing HTML artifact that should become a PDF | `export-pdf` | `output-resolver.md`, `export-contracts.md` |
| Existing HTML/video/media artifact that should produce stills or snippets | `export-assets` | `output-resolver.md`, `export-contracts.md` |

## Step 3: For video, pick the recipe

Video commands must route to exactly one recipe before authoring or rendering. `Entry` is the only command that hosts the recipe end-to-end — routing to any other command violates the contract.

| User intent | Recipe | Entry | Default format |
|---|---|---|---|
| Explain a system, roadmap, plan, or launch in detail | `explainer-longform` | `generate-video` | `mp4` |
| Create a short hook-driven social clip | `social-reel` | `generate-video` | `mp4` |
| Convert an existing deck or magazine to a narrated video | `deck-to-video` | `render-video` | `mp4` |
| Generate a lower third, subscribe card, or compositing asset | `overlay-transparent` | `render-video` | `mov` |
| Generate a looping hero/background/browser embed | `browser-loop` | `render-video` | `webm` |
| Generate a short announcement bumper or intro sting | `announcement-bumper` | `generate-video` | `mp4` |

## Step 4: Negative routing rules

- Do **not** route to `generate-video` if the user already has an HTML deck or explainer page. Use `render-video`.
- Do **not** route to `render-video` if the user only has a topic or outline AND the target recipe is `explainer-longform`, `social-reel`, or `announcement-bumper`. Use `generate-video`.
- **mov / webm cold-start is a two-step handoff.** `overlay-transparent` and `browser-loop` are `render-video`-only. If the user has only a topic (e.g. "transparent lower third from scratch", "make a looping hero from nothing"), first route to `generate-web-diagram` to author the HTML composition, then hand off to `render-video --format=mov` (or `--format=webm`). Never pretend `generate-video` can emit `.mov` or `.webm` — its recipes are all `mp4`.
- Do **not** use `share` for videos. `share` is HTML-only until a dedicated video-hosting path exists.
- Do **not** leave PDF export hidden under `generate-slides --pdf` when the user's real intent is "make me a PDF". Use `export-pdf`.
- Do **not** create new top-level commands just because there is a new recipe. Recipes are subordinate routing targets, not new domains.

## Step 5: Verification gates

Every routed path should be covered by:

- The machine-readable manifest in `commands/manifest.json`
- The source docs in `README.md` and `SKILL.md`
- `check-resolvable.mjs`
- Prompt-route tests in `tests/visual-explainer-resolver.test.mjs`
