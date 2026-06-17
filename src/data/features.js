// Capability cards. `items` renders as a chip list; `media` holds 1–3 video/gif
// paths (empty for now — pass paths later and the card populates).
export const FEATURES = [
  {
    title: "Robot manifests",
    body: "One typed HAL over ros2_control — the same contract drives every embodiment.",
    items: ["SO-101", "Franka", "UR5e", "ALOHA", "OpenArm", "Unitree G1", "Fourier GR-2", "WidowX"],
    media: [],
  },
  {
    title: "Perception → world state",
    body: "Open-vocab detectors lift 2D→3D into a tf2-aware, 30 Hz world-state snapshot.",
    media: [],
  },
  {
    title: "Spatial memory",
    body: "An advisory scene graph the reasoner queries to recall where things are.",
    media: [],
  },
  {
    title: "Swappable policies",
    body: "Any VLA behind one rSkill interface — quantized, action-chunked, latency-budgeted.",
    items: ["π0.5", "SmolVLA", "ACT", "Diffusion Policy", "xVLA", "MolmoAct2", "GR00T N1.7", "RLDX-1", "OpenVLA-OFT"],
    media: [],
  },
  {
    title: "Typed reasoner",
    body: "An LLM emits typed tool-calls over the live skill registry — never free-form JSON.",
    media: [],
  },
  {
    title: "Edge ↔ cloud inference",
    body: "ONNX→TensorRT + NF4 quantization; run on Jetson Thor / Orin, or split to the cloud.",
    media: [],
  },
  {
    title: "Simulation environments",
    body: "Roll out any rSkill headless before it touches hardware.",
    items: ["MuJoCo", "Isaac Sim", "Genesis", "RoboCasa", "ManiSkill3", "SimplerEnv", "LIBERO", "MetaWorld"],
    media: [],
  },
  {
    title: "Deny-by-default safety",
    body: "A separate C++ supervisor gates every command — deadman + E-stop, hardening toward the EU AI Act.",
    media: [],
  },
  {
    title: "Traceable & replayable",
    body: "OpenTelemetry spans, a Foxglove live scene, and a LeRobot dataset flywheel.",
    media: [],
  },
  {
    title: "World models",
    body: "Mental simulation and failure anticipation slot in front of the reasoner.",
    soon: true,
    media: [],
  },
];
