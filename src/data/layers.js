// Architecture-diagram nodes + edges — a closed control loop.
// Coordinates are in the SVG viewBox space (0 0 1120 648).
// Forward flow reads left→right; the loop closes via two feedback paths
// (robot → world state over the top, robot → sensors along the bottom).

export const NODES = [
  { id: "sensors", x: 36, y: 230, w: 120, h: 104, group: "io", title: "Sensors", sub: "RGB-D · lidar · tactile" },
  { id: "perception", x: 194, y: 118, w: 132, h: 96, group: "io", title: "Perception AI", sub: "detections → spatial" },
  { id: "world", x: 364, y: 118, w: 132, h: 96, group: "io", title: "World State", sub: "tf2 · 30 Hz · detections" },
  { id: "memory", x: 364, y: 330, w: 132, h: 96, group: "io", title: "Spatial Memory", sub: "advisory scene graph" },
  { id: "reasoner", x: 534, y: 118, w: 190, h: 96, group: "s2", title: "Reasoner", sub: "LLM planner · tool-calls" },
  { id: "skills", x: 534, y: 330, w: 190, h: 96, group: "s1", title: "rSkills\n(robot skills)", sub: "VLA · VLM · reward · ROS" },
  { id: "safety", x: 762, y: 230, w: 150, h: 104, group: "safety", title: "Safety", sub: "C++ · deny-by-default" },
  { id: "robot", x: 950, y: 230, w: 134, h: 104, group: "robot", title: "Robot", sub: "Edge · Fleet · Cloud · Sim" },
  { id: "obs", x: 534, y: 488, w: 190, h: 96, group: "obs", title: "Observability\nTraceability", sub: "OTel · Foxglove" },
];

export const EDGES = [
  // forward path
  { from: "sensors", to: "perception" },
  { from: "perception", to: "world" },
  { from: "perception", to: "memory" },
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
