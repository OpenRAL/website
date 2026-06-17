export const FEATURES = [
  {
    tag: "L0–L1 · HAL + sensors",
    title: "16 robot manifests",
    body: "SO-100/101, Franka, UR5e/10e, ALOHA, OpenArm, Rizon4, Unitree H1 & G1, panda_mobile — a typed HAL over ros2_control plus a generalizable sensor catalog (RGB-D, LiDAR, F/T, tactile).",
  },
  {
    tag: "L3 · Skill (S1)",
    title: "Swappable VLA adapters",
    body: "SmolVLA, π0.5, ACT, Diffusion Policy, xVLA, MolmoAct2, GR00T N1.7 and RLDX-1 behind one Skill interface — quantized, action-chunked, latency-budgeted.",
  },
  {
    tag: "L1–L2 · perception",
    title: "Perception → world state",
    body: "A GStreamer perception bus with RT-DETR / open-vocab detectors, 2D→3D object lift into the map frame, and a 30 Hz tf2-aware world-state snapshot.",
  },
  {
    tag: "L2 · memory",
    title: "Spatial memory",
    body: "A persistent, advisory scene graph the reasoner queries to recall where objects, places and rooms are — open-vocab matching so 'find the mug' resolves to a pose.",
  },
  {
    tag: "L4 · Reasoning (S2)",
    title: "Typed reasoner",
    body: "An LLM emits typed ReasonerToolCall structured tool-calls — ExecuteRskill, navigate, recall, lifecycle — over a palette built from the live skill registry. Bounded replanning, no free-form JSON.",
  },
  {
    tag: "L6 · Safety",
    title: "Deny-by-default safety",
    body: "Python proposes, a separate safety process disposes. Deadman + E-stop forwarders ship today; the allocation-free C++ kernel is hardening toward the EU AI Act 2027 safety-case deadline.",
    soon: true,
  },
  {
    tag: "L7 · Observability",
    title: "Traceable & replayable",
    body: "OpenTelemetry spans with tensor shapes, a live dashboard, a failure bus, and a rosbag2 ↔ LeRobot dataset flywheel. Every run replayable from its trace.",
  },
  {
    tag: "L5 · World Action Model",
    title: "World models",
    body: "Mental simulation, failure anticipation and replanning subgoals slot in front of the reasoner — the interface ships today, concrete adapters next.",
    soon: true,
  },
  {
    tag: "deploy · edge",
    title: "Edge & TensorRT",
    body: "ONNX→TensorRT engine build/cache, NF4 quantization, and a sim ↔ real deploy path — the same manifest drives MuJoCo, robosuite, RoboCasa and real hardware.",
  },
];
