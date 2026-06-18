# Showcase clips

Videos shown in the **"06 — See it run"** section (`src/components/VideoShowcase.jsx`).
They are auto-discovered at build time — **no code change is needed to add one.**

## How to add a clip

1. Drop the file into the folder for its category:
   - `benchmarks/`
   - `simulation/`
   - `deployment/`
2. Name it:

   ```
   <benchmark>_<rskill>_<success|fail>.<ext>
   ```

   Examples:

   ```
   benchmarks/libero-spatial_pi05_success.mp4
   simulation/warehouse-pick_rtdetr-v2_fail.mp4
   deployment/franka-stack_qwen35_success.mp4
   ```

That's it — it appears in the autoscroll, with the overlays filled in from the name.

## Naming rules

- **Three underscore-separated parts.** Use **hyphens** inside a name
  (`libero-spatial`), never underscores — underscores are the separators.
- The **last** part must be `success` or `fail` (case-insensitive). It drives the
  centre pill: a green blinking dot + `SUCCESS`, or a red dot + `FAIL`.
- Part 1 → the **top-left** chip (benchmark name).
- Part 2 → the **top-right** chip (rSkill name).
- Any resolution / aspect ratio is fine — clips are squared (centre-cropped) in
  the strip, and shown at full native resolution in the modal.

## Supported formats

`.mp4`, `.webm`, `.mov`, `.m4v`. `.mp4` (H.264) is the safest cross-browser choice.
Keep strip clips reasonably small (they autoplay, muted, on loop); the modal plays
the same file with sound and controls.
