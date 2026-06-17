import { motion } from "framer-motion";
import "./Nav.css";

const LINKS = [
  { href: "#architecture", label: "Architecture" },
  { href: "#solve", label: "Why" },
  { href: "#features", label: "Capabilities" },
  { href: "#install", label: "Install" },
  { href: "#team", label: "Team" },
];

export default function Nav() {
  return (
    <motion.header
      className="nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="brand" href="#top">
        <img className="brand-mark" src="/assets/icon.svg" alt="" aria-hidden="true" />
        <span className="brand-name">OpenRAL</span>
      </a>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="nav-cta">
          Contact
        </a>
      </nav>
    </motion.header>
  );
}
