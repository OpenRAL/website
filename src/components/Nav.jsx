import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Nav.css";

const LINKS = [
  { href: "/#architecture", label: "Harness" },
  { href: "/pipeline#rskills", label: "rSkills" },
  { href: "/#install", label: "Install" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") : "";

  // scroll-spy: highlight the nav item for the section in view — a section that
  // scrolls out clears itself, so the page's own link takes the rule back
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.split("#")[1])).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          setActive((cur) => (e.isIntersecting ? e.target.id : cur === e.target.id ? "" : cur))
        );
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // exactly one link lights up: the page must match, then the in-view section —
  // or the page's own bare link when no tracked section is showing
  const isActive = (l) => {
    const [linkPath, hash] = l.href.split("#");
    if (linkPath.replace(/\/+$/, "") !== path) return false;
    return hash ? hash === active : !active;
  };

  return (
    <motion.header
      className="nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="brand" href="/">
        <img className="brand-mark" src="/assets/icon.svg" alt="" aria-hidden="true" />
        <span className="brand-name">OpenRAL</span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={isActive(l) ? "active" : undefined}
            aria-current={isActive(l) ? "true" : undefined}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <a href="https://github.com/OpenRAL/openral" target="_blank" rel="noopener" className="nav-cta">
        GitHub ↗
      </a>
    </motion.header>
  );
}
