# OpenRAL — website

The public landing page for **OpenRAL**, the open-source harness for physical AI:
a typed orchestration layer over ROS 2 that turns vision-language-action models,
perception and reasoning into safe, runnable robot behavior.

→ Project repo: [github.com/OpenRAL/openral](https://github.com/OpenRAL/openral)

## Stack

- **Vite + React + Framer Motion** — component-based single page under `src/`, built to
  static assets. Refined-dark theme with a single muted-clay accent. Fonts: Clash Display +
  Satoshi (Fontshare) and JetBrains Mono (Google Fonts).
- **One serverless function** — `api/contact.js` (Vercel Node runtime) delivers the
  contact form to the right inbox via [Resend](https://resend.com).

## Sections

Hero (floating L0–L7 layer stack) → **terminal install** (`curl` installer) →
**architecture diagram** (Helix-style dual-system S1 ⇄ S2 flow) → **showcase**
(autoscrolling benchmark / simulation / deployment clips) → what it solves →
capabilities → rSkills → contact → footer (GitHub · Hugging Face · Discord).

## Showcase videos

The **"See it run"** section is an autoscrolling strip of benchmark, simulation
and deployment clips. Videos are **not** committed to this repo — they're hosted
on the public [`OpenRAL/website-media`](https://huggingface.co/datasets/OpenRAL/website-media)
Hugging Face dataset (CDN-backed) and listed in `src/videos/manifest.json`.

**To make a video show up on the site:**

```bash
# 1. Drop the raw clip (any size/format) into the gitignored media/ folder.
#    The sub-folder picks the tab; the filename fills the on-clip labels:
#    <benchmark>_<rskill>_<success|fail>.<ext>
media/benchmarks/libero-spatial_pi05_success.mp4
media/simulation/warehouse-pick_rtdetr-v2_fail.mp4
media/deployment/franka-stack_qwen35_success.mp4

# 2. Encode (poster + square preview + full clip), upload to HF, refresh manifest:
npm run media

# 3. Commit the updated src/videos/manifest.json — that's the only tracked change.
git add src/videos/manifest.json && git commit -m "Add showcase clip"
```

Use hyphens *inside* a name (`libero-spatial`); underscores only separate the
three parts, and the last must be `success` or `fail`. Adding clips needs
`ffmpeg` and the `hf` CLI signed in with write access to the `OpenRAL` org
(`hf auth whoami`); `npm run media -- --no-upload` encodes + updates the
manifest locally without publishing. Full reference: [`src/videos/README.md`](./src/videos/README.md).

## Local preview

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

To exercise the `/api/contact` function locally, use the Vercel CLI (`npm i -g vercel`
then `vercel dev`) — it serves the Vite build and the serverless function together.

## Deploy (Vercel)

1. Import this repo in Vercel (Framework preset: **Vite** — it builds `dist/` and serves
   the `api/` function alongside).
2. Add two environment variables (Project → Settings → Environment Variables):
   | Variable | Value |
   |---|---|
   | `RESEND_API_KEY` | An API key from your Resend account |
   | `CONTACT_FROM` | A verified sender on the domain, e.g. `OpenRAL <noreply@openral.com>` |
3. In Resend, **verify the `openral.com` domain** so the function can send from it.
4. Map the custom domain (`openral.com`) in Vercel → Settings → Domains.

### Contact form behavior

The form posts `{ audience, name, email, message }` to `/api/contact`. `audience`
routes the message to **hello@openral.com** (both the general and partnership
topics currently land there; the subject line distinguishes them); the
visitor's address is set as `reply_to`.

Until `RESEND_API_KEY` and `CONTACT_FROM` are set, the endpoint returns
`503 { code: "not_configured" }` and the form tells the visitor to email us
directly — it never silently drops a message.

## License

Apache-2.0.
