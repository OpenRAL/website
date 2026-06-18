import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NODES, EDGES } from "../data/layers.js";
import { useReveal } from "../hooks/useReveal.js";
import "./ArchitectureDiagram.css";

const VW = 1120;
const VH = 648;

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const anchors = (n) => ({
  cx: n.x + n.w / 2,
  cy: n.y + n.h / 2,
  right: [n.x + n.w, n.y + n.h / 2],
  left: [n.x, n.y + n.h / 2],
  top: [n.x + n.w / 2, n.y],
  bottom: [n.x + n.w / 2, n.y + n.h],
});

function edgePath(e) {
  const a = anchors(byId[e.from]);
  const b = anchors(byId[e.to]);

  // feedback: robot → world state, arcing over the top
  if (e.route === "loopTop") {
    const [ax, ay] = a.top;
    const [bx, by] = b.top;
    return `M ${ax} ${ay} C ${ax} 46 ${bx} 46 ${bx} ${by}`;
  }
  // feedback: robot → sensors, arcing along the bottom, clear of Observability
  if (e.route === "loopBottom") {
    const [ax, ay] = a.bottom;
    const [bx, by] = b.bottom;
    return `M ${ax} ${ay} C ${ax} 706 ${bx} 706 ${bx} ${by}`;
  }
  // sensors → safety, straight across the inter-row gap
  if (e.route === "cross") {
    const [ax, ay] = a.right;
    const [bx, by] = b.left;
    return `M ${ax} ${ay} C ${ax + 210} ${ay} ${bx - 210} ${by} ${bx} ${by}`;
  }
  // node → observability card
  if (e.route === "tap") {
    const top = byId.obs.y;
    const [ax, ay] = a.bottom;
    if (e.from === "reasoner") return `M 555 ${ay} C 467 300 467 452 525 ${top}`;
    if (e.from === "safety") return `M ${ax} ${ay} C ${ax} 452 702 472 665 ${top}`;
    return `M ${ax} ${ay} C ${ax} ${ay + 28} ${ax} ${top - 28} ${ax} ${top}`; // skills
  }
  // vertically stacked (same column)
  if (Math.abs(a.cx - b.cx) < 60) {
    const [ax, ay] = a.bottom;
    const [bx, by] = b.top;
    return `M ${ax} ${ay} C ${ax} ${ay + 44} ${bx} ${by - 44} ${bx} ${by}`;
  }
  // horizontal flow
  const [ax, ay] = a.right;
  const [bx, by] = b.left;
  const mid = (ax + bx) / 2;
  return `M ${ax} ${ay} C ${mid} ${ay} ${mid} ${by} ${bx} ${by}`;
}

export default function ArchitectureDiagram() {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  const isEdgeHot = (e) => hovered && (e.from === hovered || e.to === hovered);
  const pct = (v, total) => `${(v / total) * 100}%`;

  return (
    <section id="architecture" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — Architecture</div>
        <h2>
          One typed <em>contract</em>, two coupled <em>systems</em>.
        </h2>
        <p className="band-sub">
          A slow <strong>S2 reasoner</strong> plans in typed tool-calls; a fast <strong>S1 rSkill</strong> layer
          executes action chunks. Perception lifts detections into spatial memory; both feed the reasoner and the
          rSkills, and a deny-by-default supervisor gates every command before it reaches the robot — whose new
          state flows straight back into perception and the next decision.
        </p>
      </motion.div>

      <motion.div
        className="diagram-scroll"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="diagram-stage" onMouseLeave={() => setHovered(null)}>
          <svg className="diagram-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {EDGES.map((e, i) => {
              const d = edgePath(e);
              const hot = isEdgeHot(e);
              return (
                <g key={`${e.from}-${e.to}`} className={`edge${hot ? " hot" : ""}${hovered && !hot ? " dim" : ""}`}>
                  <motion.path
                    className="edge-base"
                    d={d}
                    fill="none"
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {!reduce && <path className="edge-flow" d={d} fill="none" style={{ animationDelay: `${i * 0.2}s` }} />}
                </g>
              );
            })}
          </svg>

          {NODES.map((n) => (
            <div
              key={n.id}
              className={`node node-${n.group}${hovered === n.id ? " active" : ""}${
                hovered && hovered !== n.id ? " dim" : ""
              }`}
              style={{ left: pct(n.x, VW), top: pct(n.y, VH), width: pct(n.w, VW), height: pct(n.h, VH) }}
              onMouseEnter={() => setHovered(n.id)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              <span className="node-layer">{n.layer}</span>
              <span className="node-title">{n.title}</span>
              <span className="node-sub">{n.sub}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
