// Architecture-diagram nodes + edges (Helix-style dual-system flow).
// Coordinates are in the SVG viewBox space (0 0 1080 560).

export const NODES = [
  { id: "sensors", x: 24, y: 230, w: 156, h: 100, group: "io", layer: "L0–L1", title: "Sensors + HAL", sub: "RGB-D · LiDAR · F/T · tactile" },
  { id: "perception", x: 246, y: 120, w: 184, h: 96, group: "io", layer: "L1–L2", title: "Perception", sub: "detect · 2D→3D lift · 30 Hz" },
  { id: "memory", x: 246, y: 344, w: 184, h: 96, group: "io", layer: "L2", title: "Spatial Memory", sub: "advisory scene graph" },
  { id: "reasoner", x: 496, y: 116, w: 206, h: 104, group: "s2", layer: "L4", title: "S2 · Reasoner", sub: "typed tool-calls · slow" },
  { id: "skills", x: 496, y: 340, w: 206, h: 104, group: "s1", layer: "L3", title: "S1 · Skills / VLA", sub: "action chunks · fast" },
  { id: "safety", x: 770, y: 230, w: 150, h: 100, group: "safety", layer: "L6", title: "Safety", sub: "deny-by-default" },
  { id: "robot", x: 952, y: 230, w: 104, h: 100, group: "robot", layer: "act", title: "Robot", sub: "16-DoF" },
];

// [from, to, dashed?]
export const EDGES = [
  ["sensors", "perception"],
  ["sensors", "memory"],
  ["perception", "reasoner"],
  ["memory", "reasoner"],
  ["perception", "skills"],
  ["reasoner", "skills"],
  ["skills", "safety"],
  ["safety", "robot"],
  ["robot", "sensors", true],
];

// Dual-system framing band that sits behind reasoner + skills.
export const DUAL_BAND = { x: 472, y: 92, w: 254, h: 376 };
