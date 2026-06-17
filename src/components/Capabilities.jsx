import { motion } from "framer-motion";
import { FEATURES } from "../data/features.js";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./Capabilities.css";

// Bento spans, matched to the FEATURES order. c2 = 2 cols, c4 = 4 cols (wide),
// tall = 2 rows. Featured: VLA adapters (tall), Safety + Edge (wide).
const SPANS = ["c2", "c2 tall", "c2", "c2", "c2", "c4", "c2", "c2", "c4"];

export default function Capabilities() {
  const reveal = useReveal();
  const { container, item } = useStagger(0.05);
  return (
    <section id="features" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">04 — What's inside</div>
        <h2>
          A full <em>stack</em>, composed — not reinvented.
        </h2>
        <p className="band-sub">
          OpenRAL builds on tf2, MoveIt 2, Nav2 and ros2_control, and adds the typed VLA / rSkill / reasoning /
          safety / observability layer ROS 2 doesn't have.
        </p>
      </motion.div>
      <motion.div
        className="feat-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {FEATURES.map((f, i) => (
          <motion.article
            className={`feat ${SPANS[i]}${f.soon ? " is-soon" : ""}`}
            key={f.title}
            variants={item}
          >
            <div className="feat-ico">{f.tag}</div>
            <h3>
              {f.title}
              {f.soon && <span className="soon">Coming soon</span>}
            </h3>
            <p>{f.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
