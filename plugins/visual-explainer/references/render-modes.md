# Render Modes

This reference defines how to choose rendering mode and container format for video work.

## Local vs Docker

| Mode | Use when |
|---|---|
| `local` | fast iteration, draft review, laptop workflow |
| `docker` | deterministic team review, CI, final delivery where identical output matters |

Rule:

- default to `local` for draft renders
- prefer `docker` for final team-facing renders when Docker is available

## Container / codec routing

| Format | Use when | Notes |
|---|---|---|
| `mp4` | default delivery | fastest path for review and sharing |
| `mov` | transparent editable asset | best for video editors |
| `webm` | browser-native transparency or loop | best for embeds, not editing |

## Worker and quality defaults

- `draft`: fastest preview
- `standard`: approval and default delivery
- `high`: explicit master export only

Start with default worker count. Increase only on well-provisioned machines or CI.
