# OpenRAL — website

The public landing page for **OpenRAL**, the open-source harness for physical AI:
a typed orchestration layer over ROS 2 that turns vision-language-action models,
perception and reasoning into safe, runnable robot behavior.

→ Project repo: [github.com/OpenRAL/openral](https://github.com/OpenRAL/openral)

## Stack

- **Hand-built static site** — `index.html` + `styles.css` + `app.js`. No framework,
  no build step. Fonts: Clash Display + Satoshi (Fontshare) and JetBrains Mono (Google Fonts).
- **One serverless function** — `api/contact.js` (Vercel Node runtime) delivers the
  contact form to the right inbox via [Resend](https://resend.com).

## Sections

Hero (a live agent-console illustration: bimanual robot, RGB + depth feeds, and an
S2 reasoner trace that triggers rSkills — `vlm`, `recall`, `navigate`, `pick`,
`robometer`, `place`, `safety`) → what it solves → capabilities → rSkills → team →
contact → footer.

## Local preview

The page itself is fully static — open it with any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

To exercise the `/api/contact` function locally, use the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Deploy (Vercel)

1. Import this repo in Vercel (Framework preset: **Other** — it's static + serverless).
2. Add two environment variables (Project → Settings → Environment Variables):
   | Variable | Value |
   |---|---|
   | `RESEND_API_KEY` | An API key from your Resend account |
   | `CONTACT_FROM` | A verified sender on the domain, e.g. `OpenRAL <noreply@openral.com>` |
3. In Resend, **verify the `openral.com` domain** so the function can send from it.
4. Map the custom domain (`openral.com`) in Vercel → Settings → Domains.

### Contact form behavior

The form posts `{ audience, name, email, message }` to `/api/contact`. `audience`
routes the message to **hello@openral.com** (general) or **partner@openral.com**
(partnerships); the visitor's address is set as `reply_to`.

Until `RESEND_API_KEY` and `CONTACT_FROM` are set, the endpoint returns
`503 { code: "not_configured" }` and the form tells the visitor to email us
directly — it never silently drops a message.

## License

Apache-2.0.
