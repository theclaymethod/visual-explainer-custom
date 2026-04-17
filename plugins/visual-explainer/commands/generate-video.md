---
description: Generate an explainer video (MP4) via Hyperframes. Long-form or reel.
argument-hint: "<topic or outline> [--style=long-form|reel] [--duration=Ns] [--voice=<name>] [--no-ask]"
---

# /generate-video

Generate an explainer video from scratch. Wraps Hyperframes (local HTML → MP4 renderer) with specialized modes for explainer content.

**Input:** a topic, outline, or source document.
**Output:** one MP4 in `~/.agent/videos/<slug>.mp4` plus 3 keyframe PNGs for review.
**Cost:** medium — render wall-clock is typically 30s–5min depending on duration and quality.

---

## Styles

Two styles, picked via `--style` or confirmed via AskUserQuestion.

### `long-form` (default when unsure)

- **Aspect:** 16:9 landscape, 1920×1080
- **Duration:** 60–180 seconds
- **Pacing:** Slide-paced, 10s average dwell per scene, 6–12 scenes
- **Audience:** Team meetings, onboarding, LinkedIn, docs embeds
- **Template:** `templates/hyperframes-longform.html`
- **Animations:** Fade-ups, count-ups, cross-fades between scenes, optional shader transitions at major beat boundaries
- **Audio:** TTS narration over dwell scenes; optional soft bed

### `reel`

- **Aspect:** 9:16 vertical, 1080×1920
- **Duration:** 30–60 seconds (default 45s)
- **Pacing:** Hard cuts every 1.2–1.8s; 6–8 beats; hook within 2s
- **Audience:** Shorts / Reels / TikTok silent-autoplay feeds
- **Template:** `templates/hyperframes-reel.html`
- **Animations:** Kinetic typography (word-by-word), progressive diagram reveal, Ken Burns on imagery, shader transitions at beat boundaries
- **Audio:** TTS narration with burned-in captions; bottom-third safe-zone respected
- **Read:** `references/reel-patterns.md` before generating — it's the authoritative guide

---

## Workflow

### 1. Clarify

If the request is ambiguous (missing: style, duration, audience, aesthetic), ask 1–3 questions via AskUserQuestion. See `references/clarify.md`. **Video is a high-cost command** — always ask at least "style" and "duration" before rendering, even if the user was otherwise clear. Bypass only when the user passed `--no-ask` or stated both style and duration explicitly.

### 2. Check prerequisites

```bash
bash {{skill_dir}}/scripts/hyperframes-doctor.sh
```

If this exits non-zero, **abort** and forward the install hints to the user. Do not attempt to render.

### 3. Author the composition

- **Long-form:** Start from `templates/hyperframes-longform.html`. Build one scene per major beat from the outline. Apply unslop to all prose copy before placing it in the template.
- **Reel:** Start from `templates/hyperframes-reel.html`. Compress the outline to HOOK → PROBLEM → CONTEXT → MECHANISM → PROOF → RESOLUTION → CTA. Every scene is a single claim.

Follow the hard rules in `references/gsap-rules.md`:
- Timeline is `{ paused: true }` and registered on `window.__timelines["<id>"]` synchronously
- No `Math.random`, `Date.now`, `repeat: -1`, `setTimeout` in the timeline builder
- `<video>` elements have `muted playsinline` (none in default templates)
- `<audio>` lives in separate elements, not video tracks

### 4. Narration

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

### 5. Lint + validate

```bash
cd ~/.agent/videos/<slug>
npx hyperframes lint
npx hyperframes validate   # WCAG contrast audit
```

Resolve any errors before rendering. `--strict` is applied on render so unresolved lint errors will abort the render anyway.

### 6. Draft render

```bash
npx hyperframes render \
  --output ~/.agent/videos/<slug>-draft.mp4 \
  --quality draft \
  --fps 30 \
  --strict
```

### 7. Extract keyframes

```bash
bash {{skill_dir}}/scripts/extract-keyframes.sh \
  ~/.agent/videos/<slug>-draft.mp4 \
  ~/.agent/videos/<slug>/keyframes
```

Show the 3 keyframes to the user (via `open`, embedding in a markdown response, or any available preview mechanism). Ask: "Ready for the final render, or anything to adjust?" Don't proceed without confirmation — the final render is expensive.

### 8. Final render (on approval)

```bash
npx hyperframes render \
  --output ~/.agent/videos/<slug>.mp4 \
  --quality standard \
  --fps 30 \
  --strict
```

Use `--quality high` only if the user explicitly asks for a delivery master. `high` ~doubles render time.

### 9. Deliver

Report:
- Final MP4 path
- Duration / file size / resolution
- Thumbnail (first keyframe) inline if the surface supports it
- Offer `/share` if the user wants a hosted URL (note: `share.sh` currently handles HTML; videos need a different hosting path)

---

## Flags

| Flag | Default | Notes |
|---|---|---|
| `--style=<long-form\|reel>` | ask | Required if ambiguous |
| `--duration=<Ns>` | 60 (long-form), 45 (reel) | Enforced ranges 30–180s |
| `--voice=<name>` | `af_nova` | Hyperframes TTS voice |
| `--no-narration` | off | Skip TTS; silent video |
| `--no-captions` | off | Reel only; default is captions on |
| `--quality=<draft\|standard\|high>` | standard | Final-pass quality |
| `--fps=<24\|30\|60>` | 30 | `60` doubles render time |
| `--no-ask` | off | Skip AskUserQuestion; use defaults |

---

## References

- `references/hyperframes.md` — runtime, constraints, CLI flags
- `references/gsap-rules.md` — GSAP constraints for Hyperframes
- `references/reel-patterns.md` — reel format rules (authoritative for reel style)
- `references/clarify.md` — when to ask via AskUserQuestion
- `templates/hyperframes-longform.html`, `templates/hyperframes-reel.html` — starter compositions
