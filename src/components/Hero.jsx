import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import AgentConsole from "./AgentConsole.jsx";
import "./Hero.css";

export default function Hero() {
  const reveal = useReveal();
  return (
    <section className="hero">
      <motion.div className="hero-copy" {...reveal}>
        <div className="kicker">
          <span className="dot" />
          OPEN-SOURCE · APACHE-2.0
        </div>
        <h1>
          The open harness
          <br />
          for <em>physical AI</em>.
        </h1>
        <p className="lede">
          OpenRAL is the typed orchestration layer that turns vision-language-action
          models, perception and reasoning into <strong>safe, runnable robot behavior</strong> —
          on real hardware and in simulation. One contract over many robots, many models, one safety boundary.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="https://github.com/OpenRAL/openral" target="_blank" rel="noopener">
            View the code <span className="arr">↗</span>
          </a>
          <a className="btn btn-ghost" href="#install">
            Install
          </a>
        </div>
      </motion.div>

      <motion.div
        className="hero-vis"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <AgentConsole />
      </motion.div>
    </section>
  );
}
