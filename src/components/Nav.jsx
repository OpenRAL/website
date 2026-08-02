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

  // scroll-spy: highlight the nav item for the section in view (home only —
  // on subpages the hash targets don't exist and the observer is empty)
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.split("#")[1])).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const isActive = (l) => l.href === path || (!!active && l.href.endsWith("#" + active));

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
      <nav className="nav-links">
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
        <a href="https://github.com/OpenRAL/openral" target="_blank" rel="noopener" className="nav-cta">
          GitHub ↗
        </a>
      </nav>
    </motion.header>
  );
}
