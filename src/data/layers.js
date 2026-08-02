// Architecture-diagram nodes + edges — a closed control loop.
// Coordinates are in the SVG viewBox space (0 0 1120 648).
// Forward flow reads left→right; the loop closes via two feedback paths
// (robot → world state over the top, robot → sensors along the bottom).
//
// `swap` lists real, interchangeable implementations the node cycles through
// live on the page — the visual proof that contents swap while the harness
// stays fixed. `detail` feeds the panel under the diagram (hover/tap a node).

export const NODES = [
  {
    id: "sensors", x: 30, y: 228, w: 150, h: 100, group: "io",
    title: "Sensors",
    swap: ["D435i", "OAK-D Pro", "stereo rig", "FT-300", "lidar", "webcam"],
    detail: {
      body: "RGB-D, stereo, force-torque and UVC adapters stream straight onto typed ROS 2 topics.",
      items: ["RealSense D435i", "OAK-D Pro", "Robotiq FT-300", "stereo rigs", "hand-eye calibration"],
    },
  },
  {
    id: "perception", x: 204, y: 118, w: 150, h: 100, group: "io",
    title: "Perception AI",
    swap: ["OmDet-Turbo", "RT-DETR v2", "LocateAnything", "Depth Anything 3", "cuVSLAM", "Qwen3.5-4B"],
    detail: {
      body: "Open-vocab detectors, a scene VLM, metric depth and stereo SLAM lift every detection 2D\u21923D into world state.",
      items: ["OmDet-Turbo", "RT-DETR v2", "LocateAnything-3B", "Qwen3.5-4B", "Depth Anything 3", "cuVSLAM"],
    },
  },
  {
    id: "world", x: 378, y: 118, w: 150, h: 100, group: "io",
    title: "World State", sub: "tf2 · 30 Hz · detections",
    detail: {
      body: "A tf2-consistent snapshot of every frame, joint and detection at 30 Hz \u2014 identical in sim and on hardware.",
      items: ["tf2 frames", "30 Hz", "detections", "occupancy map"],
    },
  },
  {
    id: "memory", x: 378, y: 338, w: 150, h: 100, group: "io",
    title: "Spatial Memory", sub: "advisory scene graph",
    detail: {
      body: "An advisory 3D scene graph the reasoner queries to recall where things are.",
      items: ["scene graph", "object poses", "recall_object"],
    },
  },
  {
    id: "reasoner", x: 552, y: 118, w: 190, h: 100, group: "s2",
    title: "Reasoner",
    swap: ["Anthropic", "OpenAI", "Cosmos 3 Edge", "Ollama", "vLLM"],
    detail: {
      body: "A slow LLM planner emits typed tool-calls over the live skill registry \u2014 cloud, local or fully on-device.",
      items: ["Anthropic", "OpenAI", "NVIDIA Cosmos 3 Edge", "Ollama", "vLLM"],
    },
  },
  {
    id: "skills", x: 552, y: 338, w: 190, h: 100, group: "s1",
    title: "rSkills\n(robot skills)",
    swap: [
      "SmolVLA", "π0.5", "GR00T N1.7", "LingBot-VLA 2.0", "InternVLA-N1", "ACT",
      "MolmoAct2", "xVLA", "RLDX-1", "OpenVLA-OFT", "Diffusion Policy",
      "MoveIt 2", "Nav2", "Robometer-4B", "find-object", "verify-outcome",
    ],
    detail: {
      body: "One typed manifest for every capability \u2014 VLA policies, detectors, VLMs, reward monitors, ROS 2 actions and playbooks. All Hub-installable, all swappable.",
      items: ["SmolVLA", "\u03c00.5", "GR00T N1.7", "LingBot-VLA 2.0", "InternVLA-N1", "ACT", "OpenVLA-OFT", "MoveIt 2", "Nav2", "Robometer-4B", "find-object"],
    },
  },
  {
    id: "safety", x: 766, y: 228, w: 150, h: 100, group: "safety",
    title: "Safety", sub: "deny-by-default",
    detail: {
      body: "A separate C++ deny-by-default kernel screens every action chunk \u2014 Python proposes, C++ disposes.",
      items: ["self / world collision", "deadman watchdog", "hardware E-stop", "EU AI Act 2027"],
    },
  },
  {
    id: "robot", x: 940, y: 228, w: 150, h: 100, group: "robot",
    title: "Robot",
    swap: ["Franka Panda", "SO-101", "Unitree G1", "Galaxea A1", "UR5e", "ALOHA", "WidowX", "Fourier GR1", "Sawyer"],
    detail: {
      body: "One typed HAL over ros2_control \u2014 15+ embodiments, desk arms to humanoids, sim and real.",
      items: ["SO-101", "Franka Panda", "UR5e", "ALOHA", "Galaxea A1", "Unitree G1 / H1", "Fourier GR1", "WidowX"],
    },
  },
  {
    id: "obs", x: 552, y: 488, w: 190, h: 100, group: "obs",
    title: "Observability\nTraceability", sub: "OTel · Foxglove",
    detail: {
      body: "Every run is an OpenTelemetry trace \u2014 replay it, audit it, or fold it into a LeRobot dataset.",
      items: ["OTel spans", "live dashboard", "Foxglove", "LeRobot flywheel"],
    },
  },
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
