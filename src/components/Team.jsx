import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Team.css";

const LINKS = [
  { href: "https://github.com/AdrianLlopart", label: "GitHub" },
  { href: "https://www.linkedin.com/in/adrian-llopart", label: "LinkedIn" },
  { href: "https://scholar.google.com/citations?user=L1W-Y4wAAAAJ", label: "Scholar" },
  { href: "https://huggingface.co/AdrianLlopart", label: "Hugging Face" },
  { href: "https://adrianllopart.github.io/", label: "Site" },
  { href: "mailto:adrianllopart@openral.com", label: "adrianllopart@openral.com" },
];

export default function Team() {
  const reveal = useReveal();
  return (
    <section id="team" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">05 — Who's building it</div>
        <h2>Built in the open.</h2>
      </motion.div>
      <motion.article className="member" {...useReveal({ delay: 0.05 })}>
        <div className="member-photo">
          <img src="/assets/adrian.png" alt="Adrian Llopart" loading="lazy" />
        </div>
        <div className="member-body">
          <h3>Adrian Llopart</h3>
          <div className="member-role">Founder · Senior AI Engineer, PhD</div>
          <p>
            AI &amp; humanoid robotics — vision-language-action models, perception, 3D human pose, and the
            harness that makes them run safely on real robots. Based in Copenhagen.
          </p>
          <div className="member-links">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </motion.article>
    </section>
  );
}
