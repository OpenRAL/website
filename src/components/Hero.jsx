import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Hero.css";

// The control loop, top → bottom: sense → model → reason → act → guard → trace.
const LOOP = [
  { tag: "L1", name: "Sensors", spec: "RGB-D · lidar · tactile", group: "io" },
  { tag: "L2", name: "World State", spec: "tf2 snapshot · 30 Hz · detections", group: "io" },
  { tag: "L4", name: "Reasoning · S2", spec: "LLM planner · typed tool-calls", group: "s2" },
  { tag: "L3", name: "rSkill · S1", spec: "VLA policy · 30–200 Hz chunks", group: "s1" },
  { tag: "L6", name: "Safety", spec: "C++ · deny-by-default · E-stop", group: "safety" },
  { tag: "L7", name: "Observability", spec: "OpenTelemetry · Foxglove", group: "io" },
];

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
      </motion.div>

      <motion.div
        className="hero-vis"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        aria-hidden="true"
      >
        <div className="loop">
          <div className="loop-bar">
            <span className="loop-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="loop-title">openral · control loop</span>
            <span className="loop-live">
              <span className="loop-pulse" />
              LIVE
            </span>
          </div>
          <div className="loop-rows">
            <span className="loop-spine" />
            {LOOP.map((r, i) => (
              <motion.div
                className={`loop-row group-${r.group}`}
                key={r.tag + r.name}
                style={{ "--i": i }}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="loop-node" />
                <span className="loop-tag">{r.tag}</span>
                <span className="loop-main">
                  <b>{r.name}</b>
                  <i>{r.spec}</i>
                </span>
              </motion.div>
            ))}
          </div>
          <div className="loop-foot">
            S2 plans · S1 acts · safety vetoes · every step traced
          </div>
        </div>
      </motion.div>
    </section>
  );
}
