import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import DotField from "./DotField.jsx";
import "./Privacy.css";

export default function Privacy() {
  return (
    <>
      <DotField />
      <Nav />
      <main className="legal">
        <div className="legal-head">
          <div className="eyebrow">Legal</div>
          <h1>Privacy notice</h1>
          <p className="legal-meta">Last updated 25 October 2026</p>
        </div>

        <p className="legal-lead">
          OpenRAL is an open-source project. This site is a marketing page with a single contact form — there are
          no accounts, no payments, no advertising and no cookies. We use privacy-friendly, anonymous analytics to
          understand how the site is used. This notice explains the little data we handle.
        </p>

        <section>
          <h2>What we collect</h2>
          <p>
            <strong>Contact form:</strong> what you type in — your <strong>name</strong>, <strong>email address</strong>{" "}
            and <strong>message</strong> (plus the topic you select). There is no account to create.
          </p>
          <p>
            <strong>Usage analytics:</strong> anonymous, aggregate information about visits — pages viewed, which
            links and buttons are clicked, the referring site, browser and device type, and an approximate location
            (country/city) derived from your IP address. We never record what you type into the form, and we don't
            try to identify you.
          </p>
        </section>

        <section>
          <h2>How it's used</h2>
          <p>
            Your message is sent to our serverless function and delivered by email (via{" "}
            <a href="https://resend.com" target="_blank" rel="noopener">Resend</a>) to{" "}
            <code>hello@openral.com</code>, where we read it and reply. It is used only to respond to you. We do not
            store it in a database, profile you, or sell or share it with third parties for marketing.
          </p>
        </section>

        <section>
          <h2>Cookies &amp; tracking</h2>
          <p>
            This site sets <strong>no cookies</strong>. Analytics run cookieless via{" "}
            <a href="https://posthog.com" target="_blank" rel="noopener">PostHog</a> (EU cloud) and{" "}
            <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener">Vercel Web Analytics</a>:
            nothing is stored on your device, so you aren't recognised across visits. The only thing stored in
            your browser is a small <code>localStorage</code> flag remembering that you dismissed the cookie
            notice — it never leaves your device. Fonts are <strong>self-hosted</strong>, so loading the page makes
            no third-party requests that could reveal your IP to a font provider.
          </p>
        </section>

        <section>
          <h2>Hosting &amp; logs</h2>
          <p>
            The site and its contact function are hosted on <a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a>.
            Like any web host, Vercel may process standard request logs (e.g. IP address, timestamp) to serve and
            secure the site. See Vercel's own privacy documentation for details.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            OpenRAL is based in the EU, so the GDPR applies. You can ask us to access, correct or delete the
            personal data in any message you've sent us — just email <code>hello@openral.com</code> and we'll take
            care of it.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this notice? Reach us at <code>hello@openral.com</code> or on our{" "}
            <a href="https://discord.gg/3paXT2bVyB" target="_blank" rel="noopener">Discord</a>.
          </p>
        </section>

        <p className="legal-back">
          <a href="/">← Back to openral.com</a>
        </p>
      </main>
      <Footer />
    </>
  );
}
