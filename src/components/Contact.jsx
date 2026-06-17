import { useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Contact.css";

const TO = "hello@openral.com";

export default function Contact() {
  const left = useReveal();
  const right = useReveal({ delay: 0.08 });
  const [status, setStatus] = useState({ msg: "", kind: "" });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      audience: form.audience.value,
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      company: form.company ? form.company.value.trim() : "", // honeypot
    };
    if (!data.name || !data.email || !data.message) {
      setStatus({ msg: "Please fill in every field.", kind: "err" });
      return;
    }

    setSending(true);
    setStatus({ msg: "", kind: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ msg: `Message sent to ${TO}. We'll be in touch.`, kind: "ok" });
        form.reset();
      } else if (res.status === 503 && out.code === "not_configured") {
        setStatus({ msg: `Email isn't wired up yet — please reach us directly at ${TO}.`, kind: "info" });
      } else {
        setStatus({ msg: out.error || "Something went wrong. Please email us directly.", kind: "err" });
      }
    } catch {
      setStatus({ msg: `Network error. Please email us directly at ${TO}.`, kind: "err" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="band band-contact">
      <div className="contact-grid">
        <motion.div className="contact-copy" {...left}>
          <div className="eyebrow">06 — Get in touch</div>
          <h2>Let's talk.</h2>
          <p>
            Building a robot, a fleet, or a model you want to run on OpenRAL? Researching the harness layer?
            Looking to partner? Reach out — everything lands at <code>hello@openral.com</code>. Pick the topic in
            the form so we can route it.
          </p>
          <div className="contact-rails">
            <a className="rail" href="mailto:hello@openral.com">
              <span>General &amp; partnerships</span>hello@openral.com
            </a>
          </div>
        </motion.div>

        <motion.form className="contact-form" onSubmit={onSubmit} noValidate {...right}>
          <div className="hp" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="audience">This is about</label>
            <div className="select-wrap">
              <select id="audience" name="audience" required defaultValue="hello">
                <option value="hello">A general question</option>
                <option value="partner">A partnership / collaboration</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={4} placeholder="What are you working on?" required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={sending}>
            {sending ? "Sending…" : (
              <>
                Send message <span className="arr">→</span>
              </>
            )}
          </button>
          <p className={`form-status ${status.kind}`} role="status" aria-live="polite">
            {status.msg}
          </p>
        </motion.form>
      </div>
    </section>
  );
}
