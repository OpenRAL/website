import { motion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./Solve.css";

const ITEMS = [
  {
    title: "Fragmentation, everywhere",
    body: (
      <>
        Every robot SDK, every VLA, every sensor has its own dialect. OpenRAL puts a single, typed contract
        layer — Pydantic manifests over a ROS 2 backbone — between your robot and your models.
      </>
    ),
  },
  {
    title: "Safety bolted on last",
    body: (
      <>
        Safety is the architecture, not a wrapper. Python <em>proposes</em> actions; a deny-by-default
        supervisor <em>disposes</em> them. <code>ROSSafetyViolation</code> is never silently caught.
      </>
    ),
  },
  {
    title: "Models locked to vendors",
    body: (
      <>
        Swap SmolVLA, π0.5, ACT, Diffusion Policy, MolmoAct2, GR00T N1.7 or RLDX-1 behind one{" "}
        <code>rSkill</code> interface — embodiment tags, license posture and latency budgets enforced at load.
      </>
    ),
  },
  {
    title: "Nothing reproducible",
    body: (
      <>
        Every execution is replayable from its trace alone: OpenTelemetry spans with tensor shapes, pinned
        weights, logged prompts, and a rosbag2 ↔ LeRobot dataset flywheel.
      </>
    ),
  },
];

export default function Solve() {
  const reveal = useReveal();
  const { container, item } = useStagger();
  return (
    <section id="solve" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — The problem</div>
        <h2>
          Robots, models and sensors don't speak the same language. OpenRAL is the <em>contract</em> that
          makes them.
        </h2>
      </motion.div>
      <motion.div
        className="solve-list"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {ITEMS.map((it, i) => (
          <motion.article className="solve-row" key={it.title} variants={item}>
            <div className="solve-idx">{String(i + 1).padStart(2, "0")}</div>
            <div className="solve-content">
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
