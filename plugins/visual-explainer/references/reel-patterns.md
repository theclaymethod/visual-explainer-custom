# Reel Patterns — Brain-Rot-Friendly Fast-Cut Explainer Video

**What this is.** The vertical 9:16 fast-paced explainer format. 30–60 seconds total. Hard cuts every 1–2 seconds. Burned-in captions. TTS narration. Kinetic typography. Progressive diagram reveal. Designed to hold attention on silent-autoplay feeds (Shorts, Reels, TikTok).

This format is a sibling of `long-form` (16:9 dwell slides). Pick one per render; don't mix.

---

## When to Use Reel Format

Pick reel when:
- The audience is scrolling a feed (not sitting through a deck)
- The content can be compressed to a single claim + 3–5 supporting beats
- The hook works in 3 seconds or less
- A narrator can explain each beat in one or two sentences

Pick long-form instead when:
- The content has 8+ distinct ideas
- The audience needs to dwell on a diagram for several seconds
- The piece is intended for a team meeting or onboarding flow
- The narration requires nuance (multiple clauses, qualifications)

If in doubt, ask the user.

---

## Structural Template

A reel is a timeline, not a sequence of slides. Every beat overlaps the next by 200–400ms for a continuous feel, even with hard visual cuts.

```
Time    Beat                     Typical content
─────   ──────────────────────   ──────────────────────────────────────
0.0s    HOOK                     Oversized stat, provocative question, cold-open result
2.0s    PROBLEM                  What's broken; frame the tension in one line
5.0s    CONTEXT                  Why this matters; one sentence, one visual
9.0s    MECHANISM                Progressive diagram reveal; how the thing works
18.0s   PROOF                    Stat, chart, quote, screenshot that validates the claim
25.0s   RESOLUTION               What to do with this / the takeaway in one line
30.0s   CTA                      URL, handle, follow prompt — 2 seconds max
```

This is a template, not a rule. Shorter reels collapse beats; longer ones add a second PROOF or second MECHANISM. Total duration target: 30–45s for max retention, 60s max.

---

## Cut Pacing

- **Hard cuts every 1.2–1.8 seconds during body beats.** The eye needs novelty to stay engaged.
- **Slow during the mechanism.** Diagram reveals can dwell for 3–5 seconds as long as elements are actively animating in.
- **Never cut mid-word of a voiceover line.** Each cut lands on a phrase boundary.
- **No dissolve transitions inside a beat.** Dissolves read as "slideshow" — reserve them for beat-to-beat transitions only, and sparingly.

Use shader transitions from Hyperframes registry (`flash-through-white`, `domain-warp-dissolve`, `grid-pixelate-wipe`) between major beats, not within beats.

---

## Typography Rules

Reel typography is louder and blunter than page or long-form typography.

| Role | Size | Weight | Treatment |
|---|---|---|---|
| Hook stat | 180–260px | 600–700 | Fills the viewport vertically; one element alone on the frame |
| Hook claim | 80–120px | 500 | Two or three lines max; word-by-word stagger |
| Beat title | 60–80px | 500 | Entrance: slide in from right, fade out up |
| Body copy | 32–48px | 400 | One or two lines; never a paragraph |
| Caption (burned-in) | 28–36px | 600 | Bottom third; white on black scrim; word-level highlighting optional |
| Attribution / kicker | 18–22px | 500 | Mono; all-caps; 0.12em tracking |

Body-copy paragraphs belong in long-form, not reel. If the content needs a paragraph, it needs long-form.

---

## Kinetic Typography — the Primary Motion Pattern

Text animates in word-by-word or line-by-line. Rarely character-by-character (that reads as "meme font parade" unless executed carefully).

Recommended GSAP approach (uses SplitText or manual `<span>` wrapping):

```js
// Wrap each word in a <span class="w">...</span> server-side or at build time.
// Avoid runtime DOM manipulation — Hyperframes captures frame-by-frame.

tl.from(".hook .w", {
  y: 80,
  opacity: 0,
  duration: 0.5,
  stagger: 0.04,
  ease: "power3.out",
}, 0.1);

tl.to(".hook .w", {
  y: -40,
  opacity: 0,
  duration: 0.3,
  stagger: 0.02,
  ease: "power2.in",
}, 1.7);
```

Word-by-word is the workhorse. Use line-by-line for longer claims that exceed 5–6 words.

---

## Progressive Diagram Reveal — the Killer Feature

For the MECHANISM beat. An inline SVG diagram (authored per `diagrams-svg.md` rules) draws itself node-by-node, then arrow-by-arrow, then labels appear last.

Required authoring pattern:

1. Author the final-state SVG using the SVG-primary rules. Run the Removal Test. This is the "end frame."
2. Tag each major element with a class: `.node-1`, `.node-2`, `.arrow-1`, `.label-1`, etc.
3. In the GSAP timeline, build a staged reveal:

```js
// Step 1: nodes fade-scale in, in reading order
tl.from(".node-1", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(1.4)" }, 9.0);
tl.from(".node-2", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(1.4)" }, 9.4);
tl.from(".node-3", { scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(1.4)" }, 9.8);

// Step 2: arrows stroke-dash in
// (paths must have stroke-dasharray and stroke-dashoffset set to path length)
tl.to(".arrow-1", { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 10.4);
tl.to(".arrow-2", { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 11.0);

// Step 3: labels appear last, on masking rects
tl.from(".arrow-1-label, .arrow-1-mask", { opacity: 0, duration: 0.3 }, 11.2);
tl.from(".arrow-2-label, .arrow-2-mask", { opacity: 0, duration: 0.3 }, 11.8);

// Step 4: accent focal element pulse on entry
tl.from(".focal", { scale: 0.4, opacity: 0, duration: 0.5, ease: "back.out(2)" }, 12.4);
```

All the shape/grid/focal rules from `diagrams-svg.md` still apply — the animation only changes *how* the final-state diagram arrives on screen, not what the final state looks like. The focal rule (≤ 2 accent uses) is non-negotiable.

---

## Ken Burns + Shader Transitions

For still imagery (screenshots, photos, diagrams between beats):

**Ken Burns.** Subtle pan/zoom on static images so dead time feels alive.
```js
tl.fromTo(".photo", { scale: 1.0, x: 0 }, { scale: 1.12, x: -30, duration: 4.0, ease: "none" }, 5.0);
```
Keep the scale delta small (1.0 → 1.08–1.15). Large deltas look seasick.

**Shader transitions between beats.** Install via `npx hyperframes add <transition-name>` and wrap two beats in the transition's registered block. Recommended starters:
- `flash-through-white` — snappy, hides layout reshuffles
- `domain-warp-dissolve` — higher-energy, for the hook→problem transition
- `grid-pixelate-wipe` — technical-feeling, suits data transitions

One transition per beat boundary. Never stack two. Never use inside a single beat.

---

## TTS + Burned-in Captions

Reel output defaults to silent-autoplay, so captions are not optional — they're how the viewer reads the narration.

### Generate narration
```bash
npx hyperframes tts "Narration script here, written as a single paragraph." \
  --voice af_nova \
  --output narration.wav
```
Voice choices ship with the Hyperframes install. `af_nova` is a safe neutral default. The skill can offer a small voice menu via AskUserQuestion if the user hasn't picked.

### Generate caption timings
```bash
npx hyperframes transcribe narration.wav --output narration.vtt
```

### Burn captions into the composition
```html
<!-- Audio track (travels separately from any <video>) -->
<audio
  data-start="0"
  data-duration="45"
  data-track-index="0"
  src="narration.wav"
></audio>

<!-- Caption layer — one div per caption, positioned bottom third -->
<div class="captions">
  <div class="cap" data-start="0.0" data-duration="2.1">the one stat that matters</div>
  <div class="cap" data-start="2.2" data-duration="2.4">but nobody looks at</div>
  <!-- ... -->
</div>
```

Caption styling: 28–36px, weight 600, high-contrast (white on semi-transparent black scrim), bottom third of the frame, max two lines at a time, word-level highlight synced to audio (optional but high-impact).

### Sync cuts to narration
Narration script lines align with beat boundaries. Write the script first, time it with TTS, then build the visual timeline to match. Pacing should feel rehearsed, not overdubbed.

---

## Reel-Specific Layout Rules

- **Full-bleed everything.** No gutters, no padded frames, no visible background except the composition's own canvas.
- **Single focal element per frame.** One stat, one headline, one diagram element pulsing. Never three cards competing.
- **Vertical hierarchy.** Primary content in the top two-thirds. Captions in the bottom third. No mixing.
- **Safe zone.** Leave 100px of breathing room top and bottom — phone UI chrome (clock, home bar) overlaps the edges.
- **Contrast checks.** Run `npx hyperframes validate` (WCAG contrast audit) before final render.

---

## Verification After Render

Follow the verification flow from `references/hyperframes.md`:

1. Render at `--quality draft`
2. Extract 3 keyframes (start / mid / end) via `scripts/extract-keyframes.sh`
3. Show the keyframes to the user via the mechanism described in `commands/generate-video.md`
4. On approval, render at `--quality standard` for delivery

Specifically for reels, the 3 keyframes should land on:
- The hook (≤ 2s)
- The middle of the mechanism reveal
- The CTA / resolution

If any keyframe shows text cut off by the phone safe zone, caption illegibility, or a static dead frame, fix before final.
