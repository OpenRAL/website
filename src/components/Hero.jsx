import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import { useCountUp } from "../hooks/useCountUp.js";
import "./Hero.css";

const STATS = [
  { count: 8, label: "typed layers" },
  { count: 16, label: "robot manifests" },
  { count: 30, label: "+ rSkills" },
  { count: 63, label: "ADRs on record" },
];

const LAYERS = [
  { tag: "L7", name: "Observability" },
  { tag: "L6", name: "Safety supervisor" },
  { tag: "L4", name: "S2 · Reasoner" },
  { tag: "L3", name: "S1 · Skills / VLA" },
  { tag: "L1", name: "Perception" },
  { tag: "L0", name: "HAL · ros2_control" },
];

function Stat({ count, label }) {
  const { ref, value } = useCountUp(count);
  return (
    <div className="stat">
      <span className="stat-num" ref={ref}>
        {value}
      </span>
      <span className="stat-lbl">{label}</span>
    </div>
  );
}

export default function Hero() {
  const reveal = useReveal();
  return (
    <section className="hero">
      <motion.div className="hero-copy" {...reveal}>
        <div className="kicker">
          <span className="dot" />
          OPEN-SOURCE · APACHE-2.0 · BUILT ON ROS 2
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
        <div className="hero-stats">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="hero-vis"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        aria-hidden="true"
      >
        <div className="stack">
          {LAYERS.map((l, i) => (
            <motion.div
              className="stack-card"
              key={l.tag}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="stack-tag">{l.tag}</span>
              <span className="stack-name">{l.name}</span>
              <span className="stack-bar" />
            </motion.div>
          ))}
          <div className="stack-flow" />
        </div>
      </motion.div>
    </section>
  );
}
