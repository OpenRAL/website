import { motion, useReducedMotion } from "framer-motion";
import { FEATURES } from "../data/features.js";
import { useReveal } from "../hooks/useReveal.js";
import { useBalancedColumns } from "../hooks/useBalancedColumns.js";
import CardMedia from "./CardMedia.jsx";
import "./Capabilities.css";

// Renders a body string, turning **…** spans into <strong>.
function richBody(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
}

function Card({ f, idx, reduce }) {
  return (
    <motion.article
      className={`feat${f.soon ? " is-soon" : ""}`}
      data-feat={idx}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (idx % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <CardMedia paths={f.media} />
      <h3>
        {f.title}
        {f.soon && <span className="soon">Soon</span>}
      </h3>
      <p>{richBody(f.body)}</p>
      {f.items && (
        <ul className="feat-items">
          {f.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

export default function Capabilities() {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const { ref, cols, minH } = useBalancedColumns(FEATURES.length);

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
      <div className="feat-bento" ref={ref}>
        {cols.map((idxs, ci) => (
          <div className="feat-col" key={ci} style={minH ? { minHeight: minH } : undefined}>
            {idxs.map((idx) => (
              <Card key={FEATURES[idx].title} f={FEATURES[idx]} idx={idx} reduce={reduce} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
