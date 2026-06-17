import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Solve.css";

// title = the problem; solution = OpenRAL's answer. The answer unveils on
// scroll, a beat after each card enters view — the reveal is the scroll moment.
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

// span pattern that tiles 5 cards into two clean rows on the 6-col grid
const SPANS = ["s2", "s2", "s2", "s3", "s3"];

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M2 7.5h10M8.5 4l3.5 3.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Solve() {
  const reveal = useReveal();
  const reduce = useReducedMotion();

  return (
    <section id="solve" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — The problem &amp; our answer</div>
        <h2>
          Robots, models and sensors don't speak the same language. OpenRAL is the <em>contract</em> that
          makes them.
        </h2>
      </motion.div>

      <div className="solve-grid">
        {ITEMS.map((it, i) => (
          <motion.article
            className={`prob-card ${SPANS[i]}`}
            key={it.title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="prob-num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="prob-title">{it.title}</h3>
            <p className="prob-text">{it.problem}</p>
            <div className="prob-divider" />
            <motion.div
              className="prob-answer"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 + 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Arrow />
              <p>{it.solution}</p>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
