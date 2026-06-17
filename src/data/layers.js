// Architecture-diagram nodes + edges — a closed control loop.
// Coordinates are in the SVG viewBox space (0 0 1120 620).
// Forward flow reads left→right; the loop closes via two feedback paths
// (robot → world state over the top, robot → sensors along the bottom).

export const NODES = [
  { id: "sensors", x: 36, y: 230, w: 152, h: 104, group: "io", layer: "L0–L1", title: "Sensors + HAL", sub: "RGB-D · lidar · tactile" },
  { id: "world", x: 250, y: 118, w: 184, h: 96, group: "io", layer: "L1–L2", title: "World State", sub: "tf2 · 30 Hz · detections" },
  { id: "memory", x: 250, y: 330, w: 184, h: 96, group: "io", layer: "L2", title: "Spatial Memory", sub: "advisory scene graph" },
  { id: "reasoner", x: 500, y: 118, w: 190, h: 96, group: "s2", layer: "L4", title: "S2 · Reasoner", sub: "LLM planner · tool-calls" },
  { id: "skills", x: 500, y: 330, w: 190, h: 96, group: "s1", layer: "L3", title: "S1 · rSkill", sub: "VLA policy · 30–200 Hz" },
  { id: "safety", x: 756, y: 230, w: 150, h: 104, group: "safety", layer: "L6", title: "Safety", sub: "C++ · deny-by-default" },
  { id: "robot", x: 968, y: 230, w: 116, h: 104, group: "robot", layer: "act", title: "Robot", sub: "real · sim" },
  { id: "obs", x: 500, y: 488, w: 190, h: 84, group: "obs", layer: "L7", title: "Observability", sub: "OTel · Foxglove" },
];

export const EDGES = [
  // forward path
  { from: "sensors", to: "world" },
  { from: "world", to: "memory" },
  { from: "world", to: "reasoner" },
  { from: "world", to: "skills" },
  { from: "memory", to: "reasoner" },
  { from: "memory", to: "skills" },
  { from: "reasoner", to: "skills" },
  { from: "skills", to: "safety" },
  { from: "safety", to: "robot" },
  { from: "sensors", to: "safety", route: "cross" }, // supervisor watches raw sensors
  // feedback loop
  { from: "robot", to: "world", route: "loopTop" },
  { from: "robot", to: "sensors", route: "loopBottom" },
  // observability taps
  { from: "reasoner", to: "obs", route: "tap" },
  { from: "skills", to: "obs", route: "tap" },
  { from: "safety", to: "obs", route: "tap" },
];
