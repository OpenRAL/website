#!/usr/bin/env node
/* ------------------------------------------------------------------
   build-media.mjs — encode + upload showcase clips, refresh manifest.

   Workflow:
     1. Drop raw clips into  media/<category>/<benchmark>_<rskill>_<success|fail>.<ext>
        categories: benchmarks | simulation | deployment
     2. Run:  npm run media
        → ffmpeg encodes each clip into three web assets:
            poster.jpg   small first-frame thumbnail
            preview.mp4  square 640px, muted, compressed — the autoscroll strip
            full.mp4     capped 1080p, with audio — the click-to-expand modal
        → uploads them to the OpenRAL/website-media HF dataset (public)
        → writes src/videos/manifest.json (the only tracked artifact)

   Raw clips and encoded outputs are gitignored; the website loads every
   clip from the HF CDN, so nothing heavy ever touches the repo or bundle.

   Flags:
     --no-upload   encode + write manifest only (skip the HF push)
   ------------------------------------------------------------------ */
import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "media");
const OUT = join(ROOT, "media-dist");
const MANIFEST = join(ROOT, "src", "videos", "manifest.json");

const REPO = "OpenRAL/website-media";
const BASE = `https://huggingface.co/datasets/${REPO}/resolve/main`;
const CATEGORIES = ["benchmarks", "simulation", "deployment"];
const VIDEO_RE = /\.(mp4|mov|webm|m4v|mkv)$/i;
const noUpload = process.argv.includes("--no-upload");

function sh(cmd, args) {
  return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
}

// <benchmark>_<rskill>_<success|fail> — hyphens inside names, underscores separate.
function parseName(file) {
  const base = file.replace(/\.[^.]+$/, "");
  const parts = base.split("_");
  const tail = parts[parts.length - 1] || "";
  const status = /^succ/i.test(tail) ? "success" : /^fail/i.test(tail) ? "fail" : null;
  const benchmark = parts[0] || base;
  const rskill = parts.slice(1, status ? -1 : undefined).join("_") || "—";
  return { base, benchmark, rskill, status };
}

function encode(input, dir, category) {
  mkdirSync(dir, { recursive: true });
  const preview = join(dir, "preview.mp4");
  const full = join(dir, "full.mp4");
  const poster = join(dir, "poster.jpg");

  // strip preview: 640px square, muted, web-optimised.
  // benchmarks/simulation are center-cropped to a square; deployment clips are
  // wide side-by-side (sim | dashboard) composites, so a center crop would only
  // show the seam — letterbox the whole frame into the square instead.
  const previewVf = category === "deployment"
    ? "scale=640:-2:flags=lanczos,pad=640:640:(ow-iw)/2:(oh-ih)/2:color=black,fps=30"
    : "crop='min(iw,ih)':'min(iw,ih)',scale=640:640:flags=lanczos,fps=30";
  sh("ffmpeg", ["-y", "-i", input,
    "-vf", previewVf,
    "-an", "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
    "-crf", "28", "-preset", "veryfast", "-movflags", "+faststart", preview]);

  // full clip: native aspect, capped at 1080p, keep audio
  sh("ffmpeg", ["-y", "-i", input,
    "-vf", "scale='min(1920,iw)':'-2':force_original_aspect_ratio=decrease,scale='-2':'min(1080,ih)'",
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-crf", "23", "-preset", "medium", "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart", full]);

  // poster: one frame from the square preview
  sh("ffmpeg", ["-y", "-ss", "0.3", "-i", preview, "-frames:v", "1", "-q:v", "3", poster]);

  const kb = (p) => Math.round(statSync(p).size / 1024);
  return { preview, full, poster, sizes: { preview: kb(preview), full: kb(full), poster: kb(poster) } };
}

if (!existsSync(SRC)) {
  console.error(`No media/ folder. Create media/<category>/ and drop clips in.`);
  process.exit(1);
}

const clips = [];
let count = 0;
for (const category of CATEGORIES) {
  const dir = join(SRC, category);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).sort()) {
    if (!VIDEO_RE.test(file)) continue;
    const { base, benchmark, rskill, status } = parseName(file);
    if (!status) {
      console.warn(`⚠ skip ${category}/${file} — name must end in _success or _fail`);
      continue;
    }
    const id = `${category}/${base}`;
    process.stdout.write(`• ${id} … `);
    const { sizes } = encode(join(dir, file), join(OUT, id), category);
    console.log(`poster ${sizes.poster}kB · preview ${sizes.preview}kB · full ${sizes.full}kB`);
    clips.push({
      id, category, benchmark, rskill, status,
      poster: `${id}/poster.jpg`,
      preview: `${id}/preview.mp4`,
      full: `${id}/full.mp4`,
    });
    count++;
  }
}

if (!count) {
  console.error("No valid clips found in media/. Nothing to do.");
  process.exit(1);
}

writeFileSync(MANIFEST, JSON.stringify({ base: BASE, clips }, null, 2) + "\n");
console.log(`\n✓ wrote ${MANIFEST} (${count} clip${count > 1 ? "s" : ""})`);

if (noUpload) {
  console.log("↷ --no-upload: skipped HF push.");
  process.exit(0);
}

console.log(`↑ uploading media-dist → ${REPO} …`);
execFileSync("hf", ["upload", REPO, "media-dist", ".", "--type", "dataset",
  "--commit-message", `Add ${count} showcase clip asset(s)`],
  { stdio: "inherit", cwd: ROOT });
console.log(`✓ done — ${count} clip(s) live on the HF CDN.`);
