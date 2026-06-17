import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NODES, EDGES } from "../data/layers.js";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import "./ArchitectureDiagram.css";

const VW = 1080;
const VH = 560;
const ARC_TOP = 30;

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
  const obsTop = byId.obs.y;

  // safety → reasoner: feedback loop arcing over the top
  if (e.route === "over") {
    const [ax, ay] = a.top;
    const [bx, by] = b.top;
    return `M ${ax} ${ay} C ${ax} ${ARC_TOP} ${bx} ${ARC_TOP} ${bx} ${by}`;
  }
  // sensors → safety: gentle bow across the inter-row gap
  if (e.route === "cross") {
    const [ax, ay] = a.right;
    const [bx, by] = b.left;
    return `M ${ax} ${ay} C ${ax + 180} ${ay + 32} ${bx - 180} ${by + 32} ${bx} ${by}`;
  }
  // node → observability card (dotted taps)
  if (e.route === "tap") {
    const obs = byId.obs;
    const [ax, ay] = a.bottom;
    if (e.from === "reasoner") {
      const tx = obs.x + 34; // enter obs top-left, routed down the memory/rSkill gap
      return `M 545 ${ay} C 470 ${ay + 90} 470 ${obsTop - 46} ${tx} ${obsTop}`;
    }
    if (e.from === "safety") {
      const tx = obs.x + obs.w - 34; // enter obs top-right, kept clear of rSkill
      return `M ${ax} ${ay} C ${ax} ${ay + 120} ${tx + 34} ${obsTop - 30} ${tx} ${obsTop}`;
    }
    return `M ${ax} ${ay} C ${ax} ${ay + 24} ${ax} ${obsTop - 24} ${ax} ${obsTop}`; // skills, straight down
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
    body: "12 benchmark configs across LIBERO, MetaWorld, ManiSkill3, SimplerEnv, RoboCasa, gym-aloha and gym-pusht — every rSkill ships a reproducible eval, never a faked number.",
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

  const isEdgeHot = (e) => hovered && (e.from === hovered || e.to === hovered);
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
          deny-by-default supervisor watches sensors and gates every command — vetoes loop straight back into
          replanning, and every step is traced.
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
              const faint = e.route === "tap";
              return (
                <g key={`${e.from}-${e.to}`} className={`edge${hot ? " hot" : ""}${hovered && !hot ? " dim" : ""}${faint ? " tap" : ""}${e.dashed ? " dashed" : ""}`}>
                  <motion.path
                    className="edge-base"
                    d={d}
                    fill="none"
                    initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    strokeDasharray={e.dashed ? "4 6" : faint ? "2 6" : undefined}
                  />
                  {!reduce && (
                    <path
                      className={`edge-flow${faint ? " flow-tap" : ""}${e.dashed ? " flow-dashed" : ""}`}
                      d={d}
                      fill="none"
                      style={{ animationDelay: `${i * 0.22}s` }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {EDGES.filter((e) => e.label).map((e) => {
            const a = anchors(byId[e.from]);
            const b = anchors(byId[e.to]);
            const x = (a.top[0] + b.top[0]) / 2;
            return (
              <div key={e.label} className="edge-label" style={{ left: pct(x, VW), top: pct(ARC_TOP - 16, VH) }}>
                {e.label}
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
