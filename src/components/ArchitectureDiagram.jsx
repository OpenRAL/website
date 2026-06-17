import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NODES, EDGES, DUAL_BAND } from "../data/layers.js";
import { useReveal } from "../hooks/useReveal.js";
import "./ArchitectureDiagram.css";

const VW = 1080;
const VH = 560;

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const anchors = (n) => ({
  cx: n.x + n.w / 2,
  cy: n.y + n.h / 2,
  right: [n.x + n.w, n.y + n.h / 2],
  left: [n.x, n.y + n.h / 2],
  top: [n.x + n.w / 2, n.y],
  bottom: [n.x + n.w / 2, n.y + n.h],
});

function edgePath(fromId, toId, dashed) {
  const a = anchors(byId[fromId]);
  const b = anchors(byId[toId]);

  // feedback loop: route under the whole diagram
  if (dashed) {
    const [ax, ay] = a.bottom;
    const [bx, by] = b.bottom;
    return `M ${ax} ${ay} C ${ax} 540 ${bx} 540 ${bx} ${by}`;
  }
  // vertically stacked (same column) → bottom → top
  if (Math.abs(a.cx - b.cx) < 60) {
    const [ax, ay] = a.bottom;
    const [bx, by] = b.top;
    return `M ${ax} ${ay} C ${ax} ${ay + 44} ${bx} ${by - 44} ${bx} ${by}`;
  }
  // horizontal flow → right → left
  const [ax, ay] = a.right;
  const [bx, by] = b.left;
  const mid = (ax + bx) / 2;
  return `M ${ax} ${ay} C ${mid} ${ay} ${mid} ${by} ${bx} ${by}`;
}

export default function ArchitectureDiagram() {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  const isEdgeHot = (f, t) => hovered && (f === hovered || t === hovered);
  const pct = (v, total) => `${(v / total) * 100}%`;

  return (
    <section id="architecture" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">The architecture</div>
        <h2>One typed contract, two coupled systems.</h2>
        <p className="band-sub">
          A slow <strong>S2 reasoner</strong> plans in typed tool-calls; a fast <strong>S1 skill</strong> layer
          executes action chunks. Perception and spatial memory feed both, a deny-by-default supervisor gates
          every command, and observability traces the whole loop — replayable from the trace alone.
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
          {/* connectors */}
          <svg className="diagram-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <rect
              className="dual-band"
              x={DUAL_BAND.x}
              y={DUAL_BAND.y}
              width={DUAL_BAND.w}
              height={DUAL_BAND.h}
              rx="20"
            />
            {EDGES.map(([f, t, dashed], i) => {
              const d = edgePath(f, t, dashed);
              const hot = isEdgeHot(f, t);
              return (
                <g key={`${f}-${t}`} className={`edge${hot ? " hot" : ""}${hovered && !hot ? " dim" : ""}`}>
                  <motion.path
                    className="edge-base"
                    d={d}
                    fill="none"
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    strokeDasharray={dashed ? "2 7" : undefined}
                  />
                  {!reduce && !dashed && (
                    <path className="edge-flow" d={d} fill="none" style={{ animationDelay: `${i * 0.25}s` }} />
                  )}
                </g>
              );
            })}
          </svg>

          {/* dual-system label */}
          <div className="dual-label" style={{ left: pct(DUAL_BAND.x, VW), top: pct(DUAL_BAND.y - 26, VH) }}>
            Dual-system control · S1 ⇄ S2
          </div>

          {/* nodes */}
          {NODES.map((n) => (
            <div
              key={n.id}
              className={`node node-${n.group}${hovered === n.id ? " active" : ""}${
                hovered && hovered !== n.id ? " dim" : ""
              }`}
              style={{
                left: pct(n.x, VW),
                top: pct(n.y, VH),
                width: pct(n.w, VW),
                height: pct(n.h, VH),
              }}
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

      <p className="diagram-hint">L0–L7 · perception → reasoning → skills → safety → actuation, traced end to end.</p>
    </section>
  );
}
