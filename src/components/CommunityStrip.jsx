import { motion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import { GitHubIcon, DiscordIcon, HuggingFaceIcon } from "./icons.jsx";
import "./CommunityStrip.css";

const CARDS = [
  {
    href: "https://github.com/OpenRAL/openral",
    title: "GitHub",
    icon: GitHubIcon,
    body: "Star the repo, open an issue, ship a PR — Apache-2.0, built in the open.",
    cta: "OpenRAL/openral ↗",
  },
  {
    href: "https://discord.gg/3paXT2bVyB",
    title: "Discord",
    icon: DiscordIcon,
    body: "Robot bring-ups, rSkill drops and roadmap talk, live.",
    cta: "discord.gg/3paXT2bVyB ↗",
  },
  {
    href: "https://huggingface.co/OpenRAL",
    title: "Hugging Face",
    icon: HuggingFaceIcon,
    body: "Every rSkill is a Hub repo — browse them, install them, publish your own.",
    cta: "huggingface.co/OpenRAL ↗",
  },
];

export default function CommunityStrip() {
  const reveal = useReveal();
  const { container, item } = useStagger(0.08);

  return (
    <section id="community" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">04 — Community</div>
        <h2>
          Built in the <em>open</em>.
        </h2>
        <p className="band-sub">
          OpenRAL is a non-profit, Apache-2.0 project. The harness, the rSkills and the benchmarks are all public
          — and all better with you in the loop.
        </p>
      </motion.div>

      <motion.div
        className="comm-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {CARDS.map((c) => (
          <motion.a key={c.title} className="comm-card" href={c.href} target="_blank" rel="noopener" variants={item}>
            <h3>
              <span className="comm-icon" aria-hidden="true">
                <c.icon />
              </span>
              {c.title}
            </h3>
            <p>{c.body}</p>
            <span className="comm-cta">{c.cta}</span>
          </motion.a>
        ))}
      </motion.div>

      <div className="comm-more">
        <a href="/pipeline">
          Explore the pipeline <span className="arr">→</span>
        </a>
      </div>
    </section>
  );
}
