# Output Resolver

This reference answers one question before any command runs:

**What artifact should we generate?**

The answer should not be implicit in a flag if the user's real ask is about the output surface itself.

## Output-first routing

| User asks for... | Output family | Command |
|---|---|---|
| An explainer page, plan, review, comparison, architecture view, or table | `html` | One of the core HTML commands |
| A handout, printable deck, or artifact for review in docs/email | `pdf` | `export-pdf` |
| A deliverable video for playback or sharing | `video-delivery` | `generate-video` or `render-video` |
| A transparent motion asset for editors | `video-editable` | `render-video` |
| A transparent or looping browser asset | `video-browser` | `render-video` |
| Thumbnails, keyframes, stills, or inline snippets | `assets` | `export-assets` |

## Input shape -> command

| Input | Route |
|---|---|
| Topic, idea, concept, architecture | `generate-web-diagram` |
| Feature brief, implementation request | `generate-visual-plan` |
| Existing HTML deck or magazine | `render-video`, `export-pdf`, or `export-assets` |
| Existing review/spec/recap HTML | `export-pdf` or `export-assets` |
| Existing document needing verification | `fact-check` |
| Existing HTML artifact needing delivery | `share` |

## Anti-patterns

- Don't hide PDF under slide generation if the ask is explicitly "export this as a PDF."
- Don't assume `mp4` for every video request. Use `mov` for transparent editor assets and `webm` for browser-native loops/alpha.
- Don't create a new top-level command when a recipe or export surface is enough.
