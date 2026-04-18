---
description: Export an existing visual-explainer HTML artifact to PDF.
argument-hint: "<artifact.html> [--mode=slides|magazine|scroll] [--orientation=landscape|portrait]"
---

Load the visual-explainer skill, then export an existing HTML artifact to PDF.

**Clarify.** This is a Tier 2 command under `./references/clarify.md`. Do not ask questions unless the user explicitly gave contradictory export requirements.

**Read first:** `./references/output-resolver.md` and `./references/export-contracts.md`.

## When to use

Use this command when the user's real ask is the PDF itself:

- "export this deck to PDF"
- "make this printable"
- "give me a handout version"
- "I need the magazine as a PDF"

Do **not** hide this intent under `/generate-slides --pdf` unless you are preserving compatibility with an existing invocation.

## Inputs

- `$1`: existing HTML artifact path
- Optional flags:
  - `--mode=slides|magazine|scroll`
  - `--orientation=landscape|portrait`
  - `--width=<px>`
  - `--height=<px>`
  - `--selector=<css>`

## Workflow

1. Verify the input HTML exists.
2. Infer the export mode from the artifact unless the user overrode it.
3. Run:

```bash
node {{skill_dir}}/scripts/export-slides-pdf.mjs <input.html> <output.pdf> [flags]
```

4. Report the output path and whether the export ran in `slides`, `magazine`, or `scroll` mode.
5. If the export fails because Playwright is unavailable, forward the install hint exactly and stop.

## Compatibility

Treat `--pdf` on `/generate-slides` as a legacy alias for this command.
