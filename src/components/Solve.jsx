import { motion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./Solve.css";

// Presented as a git diff: each problem is a "hunk" — a red removed line (the
// fault) resolved by a green added line (the OpenRAL answer).
const ITEMS = [
  {
    title: "Fragmentation, everywhere",
    path: "harness/contract.py",
    problem: "Every robot SDK, VLA and sensor speaks its own dialect.",
    solution: "One typed contract — Pydantic manifests over a ROS 2 backbone.",
  },
  {
    title: "Safety bolted on last",
    path: "kernel/supervisor.cpp",
    problem: "Most stacks treat safety as a wrapper added at the end.",
    solution: "A separate deny-by-default supervisor — Python proposes, it disposes.",
  },
  {
    title: "Models locked to vendors",
    path: "rskills/registry.py",
    problem: "Each VLA ships its own runtime; swapping one is a rewrite.",
    solution: "π0.5, SmolVLA, ACT, GR00T… behind one rSkill interface.",
  },
  {
    title: "Robots fail — then nothing",
    path: "recovery/ladder.py",
    problem: "A dropped grasp or a changed scene silently ends the task.",
    solution: "A typed failure bus + a replanning ladder: retry → substitute → re-plan → handoff.",
  },
  {
    title: "Nothing reproducible",
    path: "trace/replay.py",
    problem: "A run that worked once can't be replayed or audited.",
    solution: "Every execution replays from its trace — OTel spans + a dataset flywheel.",
  },
];

export default function Solve() {
  const reveal = useReveal();
  const { container, item } = useStagger(0.07);

  return (
    <section id="solve" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — The problem &amp; our answer</div>
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
                  <span className="diff-path">{it.path}</span>
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
