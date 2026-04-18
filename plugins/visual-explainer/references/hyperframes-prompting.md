# HyperFrames Prompting

This reference adapts the current HyperFrames prompting guidance into local repo rules so the video commands can route and author consistently.

## Two prompt shapes

### Cold start

Use when the user describes a video from scratch.

Good inputs include:

- duration
- aspect ratio
- mood or style
- key elements: captions, lower thirds, narration, music, background video

Example shape:

- "Create a 45-second 9:16 reel about our queue redesign with hype captions and bass-reactive logo pulses."

### Warm start

Use when the user provides source material:

- URL
- changelog
- README
- transcript
- PDF
- CSV
- existing HTML deck or magazine

Example shape:

- "Turn this release note into a 30-second launch announcement video."

Warm-start prompts should stay grounded in the provided material rather than inventing generic copy.

## Vocabulary that changes output

### Motion feel

| Word | Effect |
|---|---|
| `smooth` | natural deceleration |
| `snappy` | quick and decisive |
| `bouncy` | overshoot and settle |
| `springy` | oscillation-heavy |
| `dramatic` | fast start, long glide |
| `dreamy` | slow and symmetrical |

### Caption tone

| Tone | Recommended use |
|---|---|
| `hype` | short social clips, launch moments |
| `corporate` | reviews, announcements, internal presentation clips |
| `tutorial` | narrated walkthroughs, explainer flows |
| `storytelling` | slower case-study or recap pieces |
| `social` | playful or creator-style clips |

### Transition energy

| Level | Typical expression |
|---|---|
| calm | blur crossfade, gentle morph |
| medium | push, slide, whip-pan |
| high | zoom-through, glitch, burn |

### Highlight effects

| Effect | Use |
|---|---|
| `highlight` | key phrases |
| `circle` | single words or metrics |
| `burst` | hype moments |
| `scribble` | rejection or contrast |
| `sketchout` | callouts or boxes |

### Rendering quality

| Quality | Use |
|---|---|
| `draft` | fast iteration |
| `standard` | review and approval |
| `high` | final delivery |

## Iteration rule

After the first draft render, prefer editor-style change requests:

- make the title bigger
- reduce caption size
- move captions higher
- swap to dark mode
- add a lower third at 0:03
- replace the background track

Do not re-spec the whole composition unless the direction itself changed.

## Command behavior

Video commands should always decide:

1. cold start vs warm start
2. recipe
3. output format
4. render mode
5. draft iteration path
