import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./CardViz.css";

// A tabletop pointcloud with two detected objects — generated inline (no asset).
// Perspective rows of points fan out toward the viewer; denser clusters sit
// under each detection box. The SVG fades in once; a CSS scan line sweeps.

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// detection boxes in viewBox space
const BOXES = [
  { x: 86, y: 78, w: 46, h: 40, label: "cup 0.98" },
  { x: 188, y: 92, w: 58, h: 52, label: "bowl 0.94" },
];

function buildPoints() {
  const rng = makeRng(20260617);
  const pts = [];
  // table plane: rows from far (top) to near (bottom), widening in perspective
  for (let r = 0; r < 13; r++) {
    const t = r / 12;
    const y = 72 + t * 78;
    const half = 44 + t * 116;
    const count = 7 + Math.round(t * 12);
    for (let i = 0; i < count; i++) {
      const x = 160 + (rng() * 2 - 1) * half;
      pts.push({ x, y: y + (rng() * 2 - 1) * 2.4, o: 0.12 + t * 0.34, r: 0.7 + t * 0.5 });
    }
  }
  // dense clusters lifted slightly above the plane under each box
  for (const b of BOXES) {
    for (let i = 0; i < 26; i++) {
      const x = b.x + rng() * b.w;
      const y = b.y + 6 + rng() * (b.h - 6);
      pts.push({ x, y, o: 0.5 + rng() * 0.45, r: 0.9 + rng() * 0.7 });
    }
  }
  return pts;
}

function Brackets({ x, y, w, h }) {
  const k = 7; // bracket arm length
  const corners = [
    `M ${x} ${y + k} L ${x} ${y} L ${x + k} ${y}`,
    `M ${x + w - k} ${y} L ${x + w} ${y} L ${x + w} ${y + k}`,
    `M ${x + w} ${y + h - k} L ${x + w} ${y + h} L ${x + w - k} ${y + h}`,
    `M ${x + k} ${y + h} L ${x} ${y + h} L ${x} ${y + h - k}`,
  ];
  return corners.map((d, i) => <path key={i} className="viz-bracket" d={d} />);
}

export default function PointcloudViz() {
  const reduce = useReducedMotion();
  const points = useMemo(buildPoints, []);

  return (
    <motion.div
      className="card-viz"
      role="img"
      aria-label="Pointcloud of a tabletop with detected objects"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        {/* table edge */}
        <line x1="0" y1="70" x2="320" y2="70" className="viz-edge" opacity="0.5" />

        {/* pointcloud */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} className="viz-dot" opacity={p.o} />
        ))}

        {/* scan line */}
        {!reduce && (
          <g className="viz-scan">
            <rect x="0" y="0" width="320" height="2" fill="var(--accent)" opacity="0.55" />
          </g>
        )}

        {/* detections */}
        {BOXES.map((b) => (
          <g key={b.label}>
            <Brackets {...b} />
            <rect className="viz-label-bg" x={b.x} y={b.y - 12} width={b.label.length * 4.6 + 8} height="11" rx="2.5" />
            <circle cx={b.x + 5} cy={b.y - 6.5} r="1.7" fill="var(--live)" />
            <text className="viz-label" x={b.x + 10} y={b.y - 3.7}>
              {b.label}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
