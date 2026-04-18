---
description: Generate an explainer video (MP4) via Hyperframes. Long-form or reel.
argument-hint: "<topic or outline> [--style=long-form|reel] [--duration=Ns] [--voice=<name>] [--no-ask]"
---

# /generate-video

Generate a new video from scratch. Wraps Hyperframes with recipe-based routing for delivery, editable, and browser-native video outputs.

**Input:** a topic, outline, or source document.
**Output:** one final render in `~/.agent/videos/` (`.mp4`, `.mov`, or `.webm`) plus 3 keyframe PNGs for review.
**Cost:** medium — render wall-clock is typically 30s–5min depending on duration and quality.

---

## Styles

Two primary styles, picked via `--style` or confirmed via AskUserQuestion. Output format is a separate routing decision — see `references/output-resolver.md` and `references/render-modes.md`.

### `long-form` (default when unsure)

- **Aspect:** 16:9 landscape, 1920×1080
- **Duration:** 60–180 seconds
- **Pacing:** Slide-paced, 10s average dwell per scene, 6–12 scenes
- **Audience:** Team meetings, onboarding, LinkedIn, docs embeds
- **Template:** `templates/hyperframes-longform.html`
- **Animations:** Fade-ups, count-ups, cross-fades between scenes, optional shader transitions at major beat boundaries
- **Audio:** TTS narration over dwell scenes; optional soft bed

### `reel` (supports two aspect ratios)

- **Aspect:** `--aspect=9:16` (default, vertical 1080×1920) OR `--aspect=16:9` (landscape 1920×1080)
- **Duration:** 30–60 seconds (default 45s)
- **Pacing:** Hard cuts every 1.2–1.8s; 6–8 beats; hook within 2s
- **Audience — 9:16:** Shorts / Reels / TikTok silent-autoplay feeds
- **Audience — 16:9:** X/Twitter embeds, LinkedIn, YouTube-embedded, desktop shares, conference intro stings
- **Templates:**
  - `templates/hyperframes-reel.html` (9:16)
  - `templates/hyperframes-reel-landscape.html` (16:9)
- **Animations:** Kinetic typography (word-by-word), progressive diagram reveal, Ken Burns on imagery, shader transitions at beat boundaries. 16:9 MECHANISM beats use native split-screen (before/after side-by-side) instead of vertical stacks.
- **Audio:** TTS narration with burned-in captions; safe zones adapt (9:16 bottom 200px for phone chrome, 16:9 bottom 140px centered caption bar)
- **Read:** `references/reel-patterns.md` § Two aspect ratios — authoritative guide for picking between 9:16 and 16:9 and the layout rules that differ between them.

---

## Workflow

### 1. Resolve before authoring

Read:

- `./RESOLVER.md`
- `./references/output-resolver.md`
- `./references/hyperframes-prompting.md`
- `./references/render-modes.md`

Decide:

- cold start vs warm start
- video recipe
- output format (`mp4`, `mov`, `webm`)
- render mode (`local`, `docker`)

### 2. Clarify

If the request is ambiguous (missing: style, duration, audience, aesthetic), ask 1–3 questions via AskUserQuestion. See `references/clarify.md`. **Video is a high-cost command** — always ask at least "style" and "duration" before rendering, even if the user was otherwise clear. Bypass only when the user passed `--no-ask` or stated both style and duration explicitly.

### 3. Check prerequisites

```bash
bash {{skill_dir}}/scripts/hyperframes-doctor.sh
```

If this exits non-zero, **abort** and forward the install hints to the user. Do not attempt to render.

### 4. Author the composition

- **Long-form:** Start from `templates/hyperframes-longform.html`. Build one scene per major beat from the outline. Apply unslop to all prose copy before placing it in the template.
- **Reel:** Start from `templates/hyperframes-reel.html`. Compress the outline to HOOK → PROBLEM → CONTEXT → MECHANISM → PROOF → RESOLUTION → CTA. Every scene is a single claim.

Recipe-level routing (this command is `mp4`-only — `mov` / `webm` recipes live on `/render-video`):

- `explainer-longform` -> `mp4`
- `social-reel` -> `mp4`
- `announcement-bumper` -> `mp4`

If the user wants a `.mov` lower third or a `.webm` browser loop from scratch, route to `/generate-web-diagram` first to author the composition HTML, then hand off to `/render-video --format=mov` or `/render-video --format=webm`. See `./RESOLVER.md` Step 4.

Follow the hard rules in `references/gsap-rules.md`:
- Timeline is `{ paused: true }` and registered on `window.__timelines["<id>"]` synchronously
- No `Math.random`, `Date.now`, `repeat: -1`, `setTimeout` in the timeline builder
- `<video>` elements have `muted playsinline` (none in default templates)
- `<audio>` lives in separate elements, not video tracks

### 5. Narration

If narration is in scope (default for reel, optional for long-form):

```bash
npx hyperframes tts "Your script here, written as one paragraph." \
  --voice af_nova \
  --output ~/.agent/videos/<slug>/narration.wav
```

Voice menu: ship with Hyperframes. If the user hasn't picked, ask via AskUserQuestion (brief: voice gender + tone). Default `af_nova`.

For reel: generate captions from narration:
```bash
npx hyperframes transcribe ~/.agent/videos/<slug>/narration.wav \
  --output ~/.agent/videos/<slug>/narration.vtt
```

Use the VTT output to pace the burned-in caption layer in the reel template. Each caption aligns with a beat boundary.

### 6. Lint + validate

```bash
cd ~/.agent/videos/<slug>
npx hyperframes lint
npx hyperframes validate   # WCAG contrast audit
```

Resolve any errors before rendering. `--strict` is applied on render so unresolved lint errors will abort the render anyway.

### 7. Draft render

```bash
npx hyperframes render \
  --output ~/.agent/videos/<slug>-draft.<ext> \
  --quality draft \
  --fps 30 \
  --strict
```

Use `--docker` for deterministic team-facing output when Docker is available and the user asked for a final-quality shared render.

### 8. Extract keyframes

```bash
bash {{skill_dir}}/scripts/extract-keyframes.sh \
  ~/.agent/videos/<slug>-draft.<ext> \
  ~/.agent/videos/<slug>/keyframes
```

Show the 3 keyframes to the user (via `open`, embedding in a markdown response, or any available preview mechanism). Ask: "Ready for the final render, or anything to adjust?" Don't proceed without confirmation — the final render is expensive.

### 9. Final render (on approval)

```bash
npx hyperframes render \
  --output ~/.agent/videos/<slug>.<ext> \
  --quality standard \
  --fps 30 \
  --strict
```

Use `--quality high` only if the user explicitly asks for a delivery master. `high` ~doubles render time.

### 10. Deliver

Report:
- Final render path and format
- Duration / file size / resolution
- Thumbnail (first keyframe) inline if the surface supports it
- If format is `mov`, state that it targets editor/compositing workflows.
- If format is `webm`, state that it targets browser playback and embeds.
- Do not offer `/share` for video until a video-hosting path exists.

---

## Flags

| Flag | Default | Notes |
|---|---|---|
| `--style=<long-form\|reel>` | ask | Required if ambiguous |
| `--aspect=<9:16\|16:9>` | 16:9 (long-form), 9:16 (reel) | Only meaningful for `--style=reel` (long-form is always 16:9) |
| `--duration=<Ns>` | 60 (long-form), 45 (reel) | Enforced ranges 30–180s |
| `--voice=<name>` | `af_nova` | Hyperframes TTS voice |
| `--no-narration` | off | Skip TTS; silent video |
| `--no-captions` | off | Reel only; default is captions on |
| `--format=mp4` | `mp4` | Only `mp4` is supported here. `mov` / `webm` route through `/render-video`. |
| `--quality=<draft\|standard\|high>` | standard | Final-pass quality |
| `--fps=<24\|30\|60>` | 30 | `60` doubles render time |
| `--docker` | off | Deterministic team-facing final render |
| `--no-ask` | off | Skip AskUserQuestion; use defaults |

---

## References

- `RESOLVER.md` — top-level routing
- `references/output-resolver.md` — format routing
- `references/hyperframes-prompting.md` — prompt shapes and vocabulary
- `references/render-modes.md` — local vs docker, mp4 vs mov vs webm
- `references/hyperframes.md` — runtime, constraints, CLI flags
- `references/gsap-rules.md` — GSAP constraints for Hyperframes
- `references/reel-patterns.md` — reel format rules (authoritative for reel style)
- `references/clarify.md` — when to ask via AskUserQuestion
- `templates/hyperframes-longform.html`, `templates/hyperframes-reel.html` — starter compositions
