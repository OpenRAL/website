// Vercel serverless function — contact form → email via Resend.
//
// Routes a submission to hello@openral.com. Both the general and partnership
// topics currently deliver there (the subject line distinguishes them).
// Requires two pieces of config as Vercel environment vars:
//   RESEND_API_KEY   — API key from https://resend.com
//   CONTACT_FROM     — a verified sender on openral.com, e.g.
//                      "OpenRAL <noreply@openral.com>"
//
// Until those exist, the endpoint fails *loudly and clearly* with a 503 +
// { code: "not_configured" } so the front-end can tell the visitor to email
// us directly — it never pretends to have sent a message it didn't send.

// Both audiences currently deliver to hello@openral.com; the subject line
// still distinguishes a partnership enquiry from a general one.
const ROUTES = {
  hello: "hello@openral.com",
  partner: "hello@openral.com",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort, per-instance rate limit. Vercel functions are ephemeral and
// horizontally scaled, so this is not a hard global cap — it just blunts a
// trivial single-source flood that would burn the Resend quota or spam the
// inbox. A durable limiter (Vercel KV / Upstash) would be the real fix; see
// the security note in the README.
const RATE_LIMIT = { max: 5, windowMs: 60_000 };
const hits = new Map(); // ip -> number[] (timestamps within the window)

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory on a long-lived instance
  return recent.length > RATE_LIMIT.max;
}

function clamp(s, n) {
  // Strip control chars (incl. CR/LF) so user input can't smuggle structure
  // into the email subject/headers, then bound length.
  return String(s == null ? "" : s)
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .slice(0, n)
    .trim();
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Per-instance throttle to blunt floods (see rateLimited above).
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
  }

  // Body may arrive parsed (object) or raw (string) depending on runtime.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const audience = body.audience === "partner" ? "partner" : "hello";
  const name = clamp(body.name, 120);
  const email = clamp(body.email, 200);
  const message = clamp(body.message, 5000);
  const companyField = clamp(body.company, 100); // honeypot (anti-spam trap) field

  if (companyField) return res.status(200).json({ ok: true }); // silently drop bots
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const to = ROUTES[audience];
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !from) {
    return res.status(503).json({
      code: "not_configured",
      error: "Email delivery is not configured yet.",
    });
  }

  const subject = `[OpenRAL ${audience === "partner" ? "Partnerships" : "Contact"}] ${name}`;
  const text =
    `New ${audience === "partner" ? "partnership" : "general"} enquiry via openral.com\n\n` +
    `From: ${name} <${email}>\n\n${message}\n`;
  const html =
    `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">` +
    `<p><strong>New ${audience === "partner" ? "partnership" : "general"} enquiry</strong> via openral.com</p>` +
    `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>` +
    `<hr style="border:none;border-top:1px solid #ddd"/>` +
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("Resend error", r.status, detail);
      return res.status(502).json({ error: "Failed to send message. Please email us directly." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error", err);
    return res.status(502).json({ error: "Failed to send message. Please email us directly." });
  }
};
