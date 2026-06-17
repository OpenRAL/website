// Vercel serverless function — contact form → email via Resend.
//
// Routes a submission to hello@openral.com (general) or partner@openral.com
// (partnerships). Requires two pieces of config as Vercel environment vars:
//   RESEND_API_KEY   — API key from https://resend.com
//   CONTACT_FROM     — a verified sender on openral.com, e.g.
//                      "OpenRAL <noreply@openral.com>"
//
// Until those exist, the endpoint fails *loudly and clearly* with a 503 +
// { code: "not_configured" } so the front-end can tell the visitor to email
// us directly — it never pretends to have sent a message it didn't send.

const ROUTES = {
  hello: "hello@openral.com",
  partner: "partner@openral.com",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clamp(s, n) {
  return String(s == null ? "" : s).slice(0, n).trim();
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
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
  const honeypot = clamp(body.company, 100); // optional anti-spam trap

  if (honeypot) return res.status(200).json({ ok: true }); // silently drop bots
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
