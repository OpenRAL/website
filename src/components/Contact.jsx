import { useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Contact.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value) {
  const v = value.trim();
  if (name === "name") return v ? "" : "Please enter your name.";
  if (name === "email") {
    if (!v) return "Please enter your email.";
    return EMAIL_RE.test(v) ? "" : "Enter a valid email address.";
  }
  if (name === "message") return v ? "" : "Add a short message.";
  return "";
}

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
];

export default function Contact() {
  const left = useReveal();
  const right = useReveal({ delay: 0.08 });
  const [status, setStatus] = useState({ msg: "", kind: "" });
  const [sending, setSending] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // clear an existing error as soon as the field becomes valid
    setErrors((errs) => (errs[name] && !validateField(name, value) ? { ...errs, [name]: "" } : errs));
  };
  const onBlur = (e) => {
    const { name, value } = e.target;
    setErrors((errs) => ({ ...errs, [name]: validateField(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nextErrors = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      message: validateField("message", values.message),
    };
    setErrors(nextErrors);
    const firstInvalid = ["name", "email", "message"].find((f) => nextErrors[f]);
    if (firstInvalid) {
      setStatus({ msg: "", kind: "" });
      form.elements[firstInvalid]?.focus();
      return;
    }

    setSending(true);
    setStatus({ msg: "", kind: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: form.audience.value,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          company: form.company ? form.company.value.trim() : "", // honeypot
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ msg: "Message sent. We'll be in touch.", kind: "ok" });
        setValues({ name: "", email: "", message: "" });
      } else if (res.status === 503 && out.code === "not_configured") {
        setStatus({ msg: "Email isn't wired up yet — please reach us on Discord.", kind: "info" });
      } else {
        setStatus({ msg: out.error || "Something went wrong. Please try again.", kind: "err" });
      }
    } catch {
      setStatus({ msg: "Network error. Please try again.", kind: "err" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="band band-contact">
      <div className="contact-grid">
        <motion.div className="contact-copy" {...left}>
          <div className="eyebrow">08 — Get in touch</div>
          <h2>
            Let's <em>talk</em>.
          </h2>
          <p>
            Building a robot, a fleet, or a model you want to run on OpenRAL? Researching the harness layer?
            Looking to partner? Pick the topic in the form and send — we'll route it to the right place.
          </p>
          <ul className="contact-points">
            <li>Partnerships &amp; integrations</li>
            <li>Research &amp; new rSkills</li>
            <li>Hardware bring-up &amp; deployments</li>
            <li>Policy evaluations on sim and real</li>
          </ul>
          <div className="contact-community">
            <span>Prefer real-time?</span>
            <a className="cc-discord" href="https://discord.gg/3paXT2bVyB" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19.5 5.2A17 17 0 0 0 15.3 4l-.2.4a13 13 0 0 1 3.7 1.2 13.6 13.6 0 0 0-11.6 0A13 13 0 0 1 10.9 4.4L10.7 4a17 17 0 0 0-4.2 1.2C3.7 9.3 3 13.3 3.3 17.2a17 17 0 0 0 5.1 2.6l.6-1c-.6-.2-1.1-.5-1.6-.8l.4-.3a9.7 9.7 0 0 0 8.4 0l.4.3c-.5.3-1 .6-1.6.8l.6 1a17 17 0 0 0 5.1-2.6c.4-4.5-.6-8.5-2.8-12ZM9.5 14.7c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
              </svg>
              Join the Discord
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

          {FIELDS.map((f) => (
            <div className="field" key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={values[f.name]}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={errors[f.name] ? "true" : undefined}
                aria-describedby={errors[f.name] ? `${f.name}-err` : undefined}
              />
              {errors[f.name] && (
                <span className="field-err" id={`${f.name}-err`} role="alert">
                  {errors[f.name]}
                </span>
              )}
            </div>
          ))}

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="What are you working on?"
              value={values.message}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={errors.message ? "true" : undefined}
              aria-describedby={errors.message ? "message-err" : undefined}
            />
            {errors.message && (
              <span className="field-err" id="message-err" role="alert">
                {errors.message}
              </span>
            )}
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
