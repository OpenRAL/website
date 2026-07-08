// Architecture-diagram nodes + edges — a closed control loop.
// Coordinates are in the SVG viewBox space (0 0 1120 648).
// Forward flow reads left→right; the loop closes via two feedback paths
// (robot → world state over the top, robot → sensors along the bottom).

const VIEWBOX_WIDTH = 1120;
const VIEWBOX_HEIGHT = 648;

// Common x anchors in the viewBox.
const X_LEFT = 36;
const X_IO = 194;
const X_CENTER = 534;
const X_RIGHT = 950;

// Common y anchors in the viewBox.
const Y_TOP = 118;
const Y_MID = 230;
const Y_BOTTOM = 330;

// Reused node dimensions.
const NODE_W_SM = 120;
const NODE_W_MD = 132;
const NODE_W_LG = 190;
const NODE_H_MD = 96;
const NODE_H_LG = 104;

export const NODES = [
  { id: "sensors", x: X_LEFT, y: Y_MID, w: NODE_W_SM, h: NODE_H_LG, group: "io", title: "Sensors", sub: "RGB-D · lidar · tactile" },
  { id: "perception", x: X_IO, y: Y_TOP, w: NODE_W_MD, h: NODE_H_MD, group: "io", title: "Perception AI", sub: "detections → spatial" },
  { id: "world", x: 364, y: Y_TOP, w: NODE_W_MD, h: NODE_H_MD, group: "io", title: "World State", sub: "tf2 · 30 Hz · detections" },
  { id: "memory", x: 364, y: Y_BOTTOM, w: NODE_W_MD, h: NODE_H_MD, group: "io", title: "Spatial Memory", sub: "advisory scene graph" },
  { id: "reasoner", x: X_CENTER, y: Y_TOP, w: NODE_W_LG, h: NODE_H_MD, group: "s2", title: "Reasoner", sub: "LLM planner · tool-calls" },
  { id: "skills", x: X_CENTER, y: Y_BOTTOM, w: NODE_W_LG, h: NODE_H_MD, group: "s1", title: "rSkills\n(robot skills)", sub: "VLA · VLM · reward · ROS" },
  { id: "safety", x: 762, y: Y_MID, w: 150, h: NODE_H_LG, group: "safety", title: "Safety", sub: "C++ · deny-by-default" },
  { id: "robot", x: X_RIGHT, y: Y_MID, w: 134, h: NODE_H_LG, group: "robot", title: "Robot", sub: "Edge · Fleet · Cloud · Sim" },
  { id: "obs", x: X_CENTER, y: 488, w: NODE_W_LG, h: NODE_H_MD, group: "obs", title: "Observability\nTraceability", sub: "OTel · Foxglove" },
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
