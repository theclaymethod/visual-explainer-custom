# Export Contracts

This reference defines what each export surface is for, and when it should be selected.

## PDF

Use for:

- printable decks
- review handoffs
- artifacts that will live in email, docs, or drive folders
- long-form explainers that need a paginated version

Route with:

- `export-pdf`

Modes:

- `slides`
- `magazine`
- `scroll`

## MP4

Use for:

- default video delivery
- review links
- presentations
- social uploads when transparency is not needed

Route with:

- `generate-video`
- `render-video`

## MOV

Use for:

- transparent overlays
- lower thirds
- compositing into Premiere, Resolve, Final Cut, or After Effects

Route with:

- `render-video`

Contract:

- transparent composition
- no page background on `html` / `body`
- editor-targeted delivery note

## WebM

Use for:

- browser loops
- transparent browser assets
- self-contained embeds where browser playback matters more than editor compatibility

Route with:

- `render-video`
- `export-assets`

## Asset export

Use for:

- thumbnails
- still frames
- keyframes
- inline media snippets
- per-slide stills

Route with:

- `export-assets`
