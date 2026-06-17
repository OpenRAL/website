import { motion, useReducedMotion } from "framer-motion";
import "./CardViz.css";

// An advisory scene graph: object nodes carrying poses, linked by spatial
// relations the reasoner queries. Generated inline (no asset). The whole SVG
// fades in once; the live node breathes via CSS — internals stay static so
// every node/edge renders reliably.

const NODES = [
  { id: "table", x: 160, y: 106, label: "table", r: 14 },
  { id: "cup", x: 92, y: 60, label: "cup", r: 11, live: true, pose: "0.42 0.10 0.85" },
  { id: "bowl", x: 230, y: 54, label: "bowl", r: 12 },
  { id: "shelf", x: 252, y: 126, label: "shelf", r: 12 },
  { id: "bin", x: 64, y: 130, label: "bin", r: 11 },
];

const N = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES = [
  { a: "cup", b: "table", rel: "on" },
  { a: "bowl", b: "table", rel: "on" },
  { a: "table", b: "shelf", rel: "near" },
  { a: "bin", b: "table", rel: "left-of" },
];

export default function SceneGraphViz() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="card-viz"
      role="img"
      aria-label="Scene graph of object poses and spatial relations"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        {/* edges + relation labels */}
        {EDGES.map((e) => {
          const a = N[e.a];
          const b = N[e.b];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const w = e.rel.length * 4.4 + 6;
          return (
            <g key={`${e.a}-${e.b}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="viz-edge" />
              <rect className="viz-label-bg" x={mx - w / 2} y={my - 6} width={w} height="11" rx="2.5" />
              <text className="viz-label" x={mx} y={my + 1.8} textAnchor="middle" style={{ fill: "var(--text-2)" }}>
                {e.rel}
              </text>
            </g>
          );
        })}

        {/* nodes */}
        {NODES.map((n) => (
          <g key={n.id}>
            {n.live && (
              <circle cx={n.x} cy={n.y} r={n.r + 4} fill="none" stroke="var(--live)" strokeWidth="1" className="viz-pulse" />
            )}
            <circle cx={n.x} cy={n.y} r={n.r} className={`viz-node${n.live ? " is-live" : ""}`} />
            <text className="viz-label" x={n.x} y={n.y + 2.6} textAnchor="middle">
              {n.label}
            </text>
            {n.pose && (
              <>
                <rect className="viz-label-bg" x={n.x - 28} y={n.y - n.r - 13} width="56" height="11" rx="2.5" />
                <text
                  className="viz-label"
                  x={n.x}
                  y={n.y - n.r - 5}
                  textAnchor="middle"
                  style={{ fill: "var(--live)", fontSize: "7px" }}
                >
                  {n.pose}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
