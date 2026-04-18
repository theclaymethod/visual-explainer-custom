---
description: Export thumbnails, stills, keyframes, snippets, and loopable assets from existing visual-explainer artifacts.
argument-hint: "<artifact> [--kind=keyframes|slides|inline-media|loop]"
---

Load the visual-explainer skill, then export reusable assets from an existing artifact.

**Clarify.** This is a Tier 2 command under `./references/clarify.md`. Do not ask questions unless the requested asset kind conflicts with the input type.

**Read first:** `./references/output-resolver.md` and `./references/export-contracts.md`.

## Asset kinds

| Kind | Input | Primary script |
|---|---|---|
| `keyframes` | MP4 / WebM | `extract-keyframes.sh` |
| `inline-media` | PNG / JPG / GIF / WebP / WebM / MP4 | `embed-media.sh` |
| `loop` | frame directory | `frames-to-webm.sh` |
| `slides` | HTML deck or magazine | `export-slides-png.mjs` |

## Workflow

1. Determine the asset kind from the input and the user's request.
2. Route to the right script:

```bash
bash {{skill_dir}}/scripts/extract-keyframes.sh <video>
bash {{skill_dir}}/scripts/embed-media.sh <media>
bash {{skill_dir}}/scripts/frames-to-webm.sh <frames-dir> <out.webm> [fps]
node {{skill_dir}}/scripts/export-slides-png.mjs <input.html> <outputDir> [--mode=slides|magazine] [--orientation=landscape|portrait]
```

3. Report every output path produced.
4. If the export fails because Playwright is unavailable (needed for the `slides` kind), forward the install hint exactly and stop.

## Compatibility

Treat `--poster-export` on `/generate-slides` as a legacy alias for this command. The HTML-to-PNG path is implemented by `export-slides-png.mjs`; the legacy `poster-ai` flow is no longer required.
