import { useRef } from "react";
import { motion } from "framer-motion";
import { FEATURES } from "../data/features.js";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import { useMasonry } from "../hooks/useMasonry.js";
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

export default function Capabilities() {
  const reveal = useReveal();
  const { container, item } = useStagger(0.05);
  const gridRef = useRef(null);
  useMasonry(gridRef, [FEATURES.length]);

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
        ref={gridRef}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {FEATURES.map((f) => (
          <motion.article className={`feat${f.soon ? " is-soon" : ""}`} key={f.title} variants={item}>
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
        ))}
      </motion.div>
    </section>
  );
}
