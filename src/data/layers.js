// Architecture-diagram nodes + edges (Helix-style dual-system flow).
// Coordinates are in the SVG viewBox space (0 0 1080 500).

export const NODES = [
  { id: "sensors", x: 24, y: 210, w: 158, h: 100, group: "io", layer: "L0–L1", title: "Sensors + HAL", sub: "RGB-D · lidar · tactile · SO-100…G1" },
  { id: "perception", x: 246, y: 104, w: 190, h: 96, group: "io", layer: "L1–L2", title: "World State", sub: "tf2 · 30 Hz · 2D→3D detections" },
  { id: "memory", x: 246, y: 320, w: 190, h: 96, group: "io", layer: "L2", title: "Spatial Memory", sub: "advisory scene graph · recall" },
  { id: "reasoner", x: 500, y: 100, w: 208, h: 104, group: "s2", layer: "L4", title: "S2 · Reasoner", sub: "LLM planner · typed tool-calls" },
  { id: "skills", x: 500, y: 316, w: 208, h: 104, group: "s1", layer: "L3", title: "S1 · rSkill", sub: "VLA policy · 30–200 Hz chunks" },
  { id: "safety", x: 772, y: 210, w: 150, h: 100, group: "safety", layer: "L6", title: "Safety", sub: "C++ · deny-by-default" },
  { id: "robot", x: 952, y: 210, w: 104, h: 100, group: "robot", layer: "act", title: "Robot", sub: "real · sim" },
];

// [from, to, dashed?, label?]
export const EDGES = [
  ["sensors", "perception"],
  ["perception", "memory"], // detections lifted into spatial memory
  ["perception", "reasoner"],
  ["memory", "reasoner"],
  ["perception", "skills"],
  ["reasoner", "skills"],
  ["skills", "safety"],
  ["safety", "robot"],
  ["safety", "reasoner", true, "veto → replan"], // deny-by-default loops back
];

// Dual-system framing band that sits behind reasoner + skills.
export const DUAL_BAND = { x: 476, y: 78, w: 256, h: 366 };
