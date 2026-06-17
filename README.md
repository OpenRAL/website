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

Hero (floating L0–L7 layer stack) → **architecture diagram** (Helix-style dual-system
S1 ⇄ S2 flow) → what it solves → capabilities → **terminal install** (`curl` installer) →
rSkills → team → contact → footer (GitHub · Hugging Face · Discord).

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
