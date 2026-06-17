// Capability cards. `items` renders as a chip list; `media` holds 1–3 video/gif
// paths (empty for now — pass paths later and the card populates). `body`
// supports **bold** spans.
export const FEATURES = [
  {
    title: "Robot manifests",
    body: "One typed HAL over ros2_control — 16 embodiments, one contract, hand-eye calibration built in.",
    items: ["SO-101", "Franka", "UR5e", "ALOHA", "OpenArm", "Unitree G1", "Fourier GR-2", "WidowX"],
    media: [],
  },
  {
    title: "Sensors",
    body: "RGB-D, force-torque and UVC adapters stream straight onto typed ROS 2 topics.",
    items: ["RealSense D435", "OAK-D Pro", "Robotiq FT-300", "USB-UVC"],
    media: [],
  },
  {
    title: "Perception",
    body: "Open-vocab AI detectors and a scene VLM lift 2D→3D into a tf2-aware, 30 Hz world state.",
    items: ["RT-DETR", "LocateAnything", "Qwen3.5-4B VLM"],
    // media: tabletop pointcloud with detected objects
    media: [],
  },
  {
    title: "Spatial memory",
    body: "An advisory scene graph the reasoner queries to recall where things are.",
    // media: graph of object poses and locations
    media: [],
  },
  {
    title: "Reasoner (S2)",
    body: "A slow LLM runs the plan→act→observe loop, emitting typed tool-calls — ExecuteSkill, LifecycleTransition, EmitPrompt — over the live skill registry, never free-form JSON.",
    items: ["Anthropic", "OpenAI", "Ollama", "vLLM", "local"],
    media: [],
  },
  {
    title: "Safety Kernel",
    body: "A separate C++ deny-by-default supervisor gates every command — deadman + E-stop. **EU AI Act 2027 compliant.**",
    media: [],
  },
  {
    title: "rSkills",
    body: "Every kind behind one typed manifest — quantized, action-chunked, latency-budgeted. Policies, detectors, VLMs and reward models, all swappable.",
    items: ["π0.5", "SmolVLA", "ACT", "Diffusion Policy", "xVLA", "MolmoAct2", "GR00T N1.7", "RLDX-1", "Detectors", "VLMs", "Robometer", "WAM · soon"],
    media: [],
  },
  {
    title: "Edge Deployment",
    body: "ONNX→TensorRT + NF4 quantization, on Jetson Thor / Orin or x86 dGPU. Cloud deployment coming soon.",
    items: ["ONNX", "TensorRT", "NF4", "Jetson Thor", "Jetson Orin", "x86 dGPU", "Cloud · soon"],
    media: [],
  },
  {
    title: "Simulation environments",
    body: "Roll out any rSkill headless before it touches hardware.",
    items: ["MuJoCo", "Isaac Sim", "Genesis", "RoboCasa", "ManiSkill3", "SimplerEnv", "LIBERO", "MetaWorld"],
    media: [],
  },
  {
    title: "Traceable & replayable",
    body: "OpenTelemetry spans, a Foxglove live scene, and a LeRobot dataset flywheel.",
    media: [],
  },
];
