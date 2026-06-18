# Showcase clips

Videos for the **"03 — See it run"** section (`src/components/VideoShowcase.jsx`).

Clips are **not** stored in this repo. They live on the public Hugging Face
dataset **[OpenRAL/website-media](https://huggingface.co/datasets/OpenRAL/website-media)**
(CDN-backed) and are listed in [`manifest.json`](./manifest.json) — the only
tracked artifact. Each clip is encoded into three web assets:

| asset | what | where it's used |
|---|---|---|
| `poster.jpg` | small first-frame thumbnail | shown before a clip loads |
| `preview.mp4` | square 640px, muted, compressed | the autoscroll strip |
| `full.mp4` | native aspect, ≤1080p, with audio | the click-to-expand modal |

The strip lazy-loads: only clips actually on screen fetch their `preview.mp4`,
so the section scales to any number of large source videos.

## Add a clip

1. Drop the raw file (any resolution/format) into the local `media/` folder —
   it's gitignored, so big files never enter the repo:

   ```
   media/benchmarks/libero-spatial_pi05_success.mp4
   media/simulation/warehouse-pick_rtdetr-v2_fail.mp4
   media/deployment/franka-stack_qwen35_success.mp4
   ```

   The **folder** sets the tab (`benchmarks` / `simulation` / `deployment`).

2. Run:

   ```bash
   npm run media
   ```

   This encodes the three assets, uploads them to the HF dataset, and rewrites
   `manifest.json`. Commit the updated `manifest.json` and you're done.

   Use `npm run media -- --no-upload` to encode + refresh the manifest locally
   without pushing to HF (e.g. to preview before publishing).

## Naming

```
<benchmark>_<rskill>_<success|fail>.<ext>
```

- **Three underscore-separated parts.** Use **hyphens** inside a name
  (`libero-spatial`), never underscores — underscores are the separators.
- Last part must be `success` or `fail` → the centre `SUCCESS`/`FAIL` pill.
- Part 1 → top-left chip (benchmark). Part 2 → top-right chip (rSkill).

## Requirements

`ffmpeg` (encoding) and the `hf` CLI authenticated with write access to the
`OpenRAL` org (`hf auth whoami`). Source formats: `.mp4`, `.mov`, `.webm`,
`.m4v`, `.mkv`.
