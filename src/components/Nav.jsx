import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Nav.css";

const LINKS = [
  { href: "/#install", label: "Install" },
  { href: "/#solve", label: "Why" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#features", label: "Capabilities" },
  { href: "/#rskills", label: "rSkills" },
  { href: "/#showcase", label: "Showcase" },
];

export default function Nav() {
  const [active, setActive] = useState("");

  // scroll-spy: highlight the nav item for the section in view
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
            className={active && l.href.endsWith("#" + active) ? "active" : undefined}
            aria-current={active && l.href.endsWith("#" + active) ? "true" : undefined}
          >
            {l.label}
          </a>
        ))}
        <a href="/#contact" className="nav-cta">
          Contact
        </a>
      </nav>
    </motion.header>
  );
}
