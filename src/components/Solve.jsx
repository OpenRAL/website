import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./Solve.css";

// title = the problem; solution = OpenRAL's answer. A numbered list; each row
// flips like a book page (hover / focus / tap) to reveal the answer.
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
  const { container, item } = useStagger(0.06);
  const [flipped, setFlipped] = useState(() => new Set());

  const toggle = (i) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section id="solve" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — The problem &amp; our answer</div>
        <h2>
          Robots, models and sensors don't speak the same language. OpenRAL is the <em>contract</em> that
          makes them.
        </h2>
        <p className="band-sub">Hover a row to turn the page — every problem, the OpenRAL answer on the back.</p>
      </motion.div>

      <motion.ol
        className="solve-list"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {ITEMS.map((it, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <motion.li className="solve-row" key={it.title} variants={item}>
              <div
                className={`flip${flipped.has(i) ? " is-flipped" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${it.title}. Reveal OpenRAL's answer.`}
                onClick={() => toggle(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(i);
                  }
                }}
              >
                <div className="flip-inner">
                  <div className="flip-face flip-front">
                    <span className="solve-idx">{num}</span>
                    <div className="flip-body">
                      <h3>{it.title}</h3>
                      <p>{it.problem}</p>
                    </div>
                    <span className="flip-hint">
                      the fix <Arrow />
                    </span>
                  </div>
                  <div className="flip-face flip-back">
                    <span className="solve-idx">{num}</span>
                    <div className="flip-body">
                      <h3>OpenRAL</h3>
                      <p>{it.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </section>
  );
}
