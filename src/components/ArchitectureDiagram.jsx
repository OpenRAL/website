import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NODES, EDGES, DUAL_BAND } from "../data/layers.js";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./ArchitectureDiagram.css";

const VW = 1080;
const VH = 500;
const ARC_TOP = 52;

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

  // feedback loop (safety → reasoner): arc over the top
  if (dashed) {
    const [ax, ay] = a.top;
    const [bx, by] = b.top;
    return `M ${ax} ${ay} C ${ax} ${ARC_TOP} ${bx} ${ARC_TOP} ${bx} ${by}`;
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

const MODES = [
  {
    tag: "Benchmark",
    title: "Reproduce the score",
    body: "22 benchmark configs across LIBERO, MetaWorld, ManiSkill3, SimplerEnv, RoboCasa, gym-aloha and gym-pusht — every rSkill ships a reproducible eval, never a faked number.",
  },
  {
    tag: "Simulate",
    title: "Roll out in sim",
    body: "Run any rSkill headless in its backend — LIBERO, ManiSkill3, RoboCasa, SimplerEnv and an Isaac Sim integration — to validate a policy before it ever touches hardware.",
  },
  {
    tag: "Deploy",
    title: "Run the harness",
    body: "The same typed manifest drives sim and real: perception, the S2 reasoner, S1 rSkills and the deny-by-default safety supervisor, end to end.",
  },
];

export default function ArchitectureDiagram() {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const { container, item } = useStagger();
  const [hovered, setHovered] = useState(null);

  const isEdgeHot = (f, t) => hovered && (f === hovered || t === hovered);
  const pct = (v, total) => `${(v / total) * 100}%`;

  return (
    <section id="architecture" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">02 — Architecture</div>
        <h2>
          One typed <em>contract</em>, two coupled <em>systems</em>.
        </h2>
        <p className="band-sub">
          A slow <strong>S2 reasoner</strong> plans in typed tool-calls; a fast <strong>S1 rSkill</strong> layer
          executes action chunks. Perception lifts detections into spatial memory, both feed the reasoner, and a
          deny-by-default supervisor gates every command — vetoes loop straight back into replanning.
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
                    strokeDasharray={dashed ? "3 7" : undefined}
                  />
                  {!reduce && !dashed && (
                    <path className="edge-flow" d={d} fill="none" style={{ animationDelay: `${i * 0.25}s` }} />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="dual-label" style={{ left: pct(DUAL_BAND.x, VW), top: pct(DUAL_BAND.y - 24, VH) }}>
            Dual-system control · S1 ⇄ S2
          </div>

          {/* veto-loop label */}
          {EDGES.filter((e) => e[3]).map(([f, t, , label]) => {
            const a = anchors(byId[f]);
            const b = anchors(byId[t]);
            const x = (a.top[0] + b.top[0]) / 2;
            return (
              <div key={label} className="edge-label" style={{ left: pct(x, VW), top: pct(ARC_TOP - 18, VH) }}>
                {label}
              </div>
            );
          })}

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

      {/* L7 observability rail */}
      <motion.div className="obs-rail" {...useReveal({ delay: 0.05 })}>
        <span className="obs-tag">L7 · Observability</span>
        <span className="obs-text">
          Every step traced — <b>OpenTelemetry</b> spans, <b>Foxglove</b> live-scene visualization, and a{" "}
          <b>LeRobot dataset</b> flywheel. Replayable from the trace alone.
        </span>
      </motion.div>

      {/* run modes */}
      <motion.div
        className="modes"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {MODES.map((m) => (
          <motion.article className="mode" key={m.tag} variants={item}>
            <div className="mode-tag">{m.tag}</div>
            <h3>{m.title}</h3>
            <p>{m.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
