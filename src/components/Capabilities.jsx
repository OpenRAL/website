import { motion } from "framer-motion";
import { FEATURES } from "../data/features.js";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import CardMedia from "./CardMedia.jsx";
import PointcloudViz from "./PointcloudViz.jsx";
import SceneGraphViz from "./SceneGraphViz.jsx";
import "./Capabilities.css";

const VIZ = { pointcloud: PointcloudViz, scenegraph: SceneGraphViz };

// Bento spans, matched to FEATURES order. c2 = 2 cols, c4 = 4 cols (wide).
// Tiles a 6-col grid into 4 clean rows; the two list-heavy cards (rSkills #7,
// simulation #9) get the wide slots.
const SPANS = ["c2", "c2", "c2", "c2", "c2", "c2", "c4", "c2", "c4", "c2"];

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
        {FEATURES.map((f, i) => {
          const Viz = f.viz && VIZ[f.viz];
          return (
          <motion.article className={`feat ${SPANS[i]}${f.soon ? " is-soon" : ""}`} key={f.title} variants={item}>
            {Viz ? <Viz /> : <CardMedia paths={f.media} />}
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
        })}
      </motion.div>
    </section>
  );
}
