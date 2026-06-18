import { motion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./Solve.css";

// Presented as a git diff: each problem is a "hunk" — a red removed line (the
// fault) resolved by a green added line (the OpenRAL answer).
const ITEMS = [
  {
    title: "Fragmentation, everywhere",
    problem: "Every robot SDK, VLA and sensor speaks its own dialect — integration is one-off glue code.",
    solution: "Eight typed layers with Pydantic v2 contracts at every boundary, over a ROS 2 backbone.",
  },
  {
    title: "Safety bolted on last",
    problem: "Safety runs inside the policy process — the same one that can crash or hang.",
    solution: "A separate C++ deny-by-default kernel screens every action chunk: Python proposes, C++ disposes.",
  },
  {
    title: "Models locked to vendors",
    problem: "Each VLA ships its own runtime, deps and quirks — swapping one is a rewrite.",
    solution: "31 policies, detectors and VLMs as Hub-installable rSkills behind one Skill interface.",
  },
  {
    title: "Robots fail — then nothing",
    problem: "A dropped grasp or a shifted object silently ends the task — no recovery.",
    solution: "Typed failure triggers drive a bounded ladder: retry → substitute → re-plan → human handoff.",
  },
  {
    title: "Nothing reproducible",
    problem: "A run that worked once can't be replayed, audited or learned from.",
    solution: "Every run is an OpenTelemetry trace — replay it, or fold it into a LeRobot dataset flywheel.",
  },
];

export default function Solve() {
  const reveal = useReveal();
  const { container, item } = useStagger(0.07);

  return (
    <section id="solve" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">04 — The problem &amp; our answer</div>
        <h2>
          Robots, models and sensors don't speak the same language. OpenRAL is the <em>contract</em> that
          makes them.
        </h2>
        <p className="band-sub">Five faults in today's robotics stack, each resolved by OpenRAL — read it like a diff.</p>
      </motion.div>

      <motion.div className="diff-console" {...useReveal({ delay: 0.05 })}>
        <header className="diff-bar">
          <span className="diff-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="diff-file">robotics-landscape.diff</span>
          <span className="diff-status">
            <span className="diff-pulse" />5 resolved
          </span>
        </header>

        <motion.div
          className="diff-list"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {ITEMS.map((it, i) => (
            <motion.article className="diff-hunk" key={it.title} variants={item}>
              <div className="diff-hunk-head">
                <span className="diff-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="diff-title">{it.title}</span>
                <span className="diff-meta">
                  <span className="diff-count del">−1</span>
                  <span className="diff-count add">+1</span>
                </span>
              </div>
              <div className="diff-lines">
                <div className="diff-line del">
                  <span className="diff-sign">−</span>
                  <span className="diff-text">{it.problem}</span>
                </div>
                <div className="diff-line add">
                  <span className="diff-sign">+</span>
                  <span className="diff-text">{it.solution}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
