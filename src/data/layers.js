// Architecture-diagram nodes + edges (Helix-style dual-system flow).
// Coordinates are in the SVG viewBox space (0 0 1080 560).

export const NODES = [
  { id: "sensors", x: 24, y: 196, w: 158, h: 104, group: "io", layer: "L0–L1", title: "Sensors + HAL", sub: "RGB-D · lidar · tactile · SO-100…G1" },
  { id: "perception", x: 246, y: 92, w: 190, h: 96, group: "io", layer: "L1–L2", title: "World State", sub: "tf2 · 30 Hz · 2D→3D detections" },
  { id: "memory", x: 246, y: 300, w: 190, h: 96, group: "io", layer: "L2", title: "Spatial Memory", sub: "advisory scene graph · recall" },
  { id: "reasoner", x: 500, y: 88, w: 208, h: 104, group: "s2", layer: "L4", title: "S2 · Reasoner", sub: "LLM planner · typed tool-calls" },
  { id: "skills", x: 500, y: 296, w: 208, h: 104, group: "s1", layer: "L3", title: "S1 · rSkill", sub: "VLA policy · 30–200 Hz chunks" },
  { id: "safety", x: 772, y: 196, w: 150, h: 104, group: "safety", layer: "L6", title: "Safety", sub: "C++ · deny-by-default" },
  { id: "robot", x: 952, y: 196, w: 104, h: 104, group: "robot", layer: "act", title: "Robot", sub: "real · sim" },
  { id: "obs", x: 246, y: 452, w: 676, h: 80, group: "obs", layer: "L7", title: "Observability", sub: "OpenTelemetry spans · Foxglove live scene · LeRobot dataset flywheel" },
];

export const EDGES = [
  { from: "sensors", to: "perception" },
  { from: "perception", to: "memory" }, // detections lifted into spatial memory
  { from: "perception", to: "reasoner" },
  { from: "memory", to: "reasoner" },
  { from: "perception", to: "skills" },
  { from: "reasoner", to: "skills" },
  { from: "skills", to: "safety" },
  { from: "safety", to: "robot" },
  { from: "sensors", to: "safety", route: "cross" }, // safety also watches raw sensors
  { from: "safety", to: "reasoner", dashed: true, route: "over", label: "veto → replan" },
  { from: "reasoner", to: "obs", route: "tap" },
  { from: "skills", to: "obs", route: "tap" },
  { from: "safety", to: "obs", route: "tap" },
];

// Dual-system framing band that sits behind reasoner + skills.
export const DUAL_BAND = { x: 476, y: 66, w: 256, h: 346 };
