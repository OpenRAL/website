import { motion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./Solve.css";

// title = the problem; solution = OpenRAL's answer.
const ITEMS = [
  {
    title: "Fragmentation, everywhere",
    problem: "Every robot SDK, VLA and sensor speaks its own dialect.",
    solution: "One typed contract — Pydantic manifests over a ROS 2 backbone.",
  },
  {
    title: "Safety bolted on last",
    problem: "Most stacks treat safety as a wrapper added at the end.",
    solution: "A separate deny-by-default supervisor — Python proposes, it disposes.",
  },
  {
    title: "Models locked to vendors",
    problem: "Each VLA ships its own runtime; swapping one is a rewrite.",
    solution: "π0.5, SmolVLA, ACT, GR00T… behind one rSkill interface.",
  },
  {
    title: "Robots fail — then nothing",
    problem: "A dropped grasp or a changed scene silently ends the task.",
    solution: "A typed failure bus + a replanning ladder: retry → substitute → re-plan → handoff.",
  },
  {
    title: "Nothing reproducible",
    problem: "A run that worked once can't be replayed or audited.",
    solution: "Every execution replays from its trace — OTel spans + a dataset flywheel.",
  },
];

export default function Solve() {
  const reveal = useReveal();
  const { container, item } = useStagger();
  return (
    <section id="solve" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — The problem &amp; our answer</div>
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
              <div className="solve-problem">
                <span className="solve-tag">Problem</span>
                <h3>{it.title}</h3>
                <p>{it.problem}</p>
              </div>
              <div className="solve-answer">
                <span className="solve-tag is-answer">OpenRAL</span>
                <p>{it.solution}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
