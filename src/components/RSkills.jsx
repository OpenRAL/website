import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./RSkills.css";

// Each kind maps to a real rSkill manifest from github.com/OpenRAL/openral.
const KINDS = [
  {
    kind: "vla",
    what: "Visuomotor policy · S1",
    yaml: `name: "OpenRAL/rskill-pi05-libero-nf4"
kind: "vla"
role: "s1"
model_family: "pi05"
license: "permissive_research"
embodiment_tags: ["franka_panda"]
quantization:
  dtype: "int4"
  backend: "pytorch"
latency_budget:
  per_chunk_ms: 200.0`,
  },
  {
    kind: "detector",
    what: "Real-time detector · S1",
    yaml: `name: "OpenRAL/rskill-rtdetr-v2-r50vd"
kind: "detector"
role: "s1"
license: "apache-2.0"
detector:
  mode: "continuous"
  labels: ["person", "cup", "bowl", ...]  # 80 COCO classes
  input_size: [640, 640]
  score_threshold: 0.5
latency_budget:
  per_chunk_ms: 50.0`,
  },
  {
    kind: "vlm",
    what: "Scene VLM · S2",
    yaml: `name: "OpenRAL/rskill-qwen35-4b-nf4"
kind: "vlm"
role: "s2"
license: "apache-2.0"
actions: ["query"]
quantization:
  dtype: "int4"
  backend: "pytorch"
latency_budget:
  per_chunk_ms: 3000.0`,
  },
  {
    kind: "reward",
    what: "Reward monitor · S2",
    yaml: `name: "OpenRAL/rskill-robometer-4b-nf4"
kind: "reward"
role: "s2"
license: "apache-2.0"
actions: ["monitor"]
reward:
  progress_range: [0.0, 1.0]
  success_threshold: 0.5
  frame_window_s: 8.0
  target_fps: 3.0`,
  },
  {
    kind: "ros_action",
    what: "ROS 2 action wrapper · S1",
    yaml: `name: "OpenRAL/rskill-nav2-navigate-to-pose"
kind: "ros_action"
role: "s1"
license: "apache-2.0"
embodiment_tags: ["mobile_base"]
actions: ["navigate"]
ros_integration:
  package: "nav2_msgs"
  interface_type: "NavigateToPose"
  interface_name: "/navigate_to_pose"`,
  },
  {
    kind: "playbook",
    what: "Reasoner playbook · S2",
    yaml: `name: "OpenRAL/rskill-find-object"
kind: "playbook"
role: "s2"
license: "apache-2.0"
embodiment_tags: ["any"]
capabilities_required:
  has_vision: true
actions: ["plan"]
playbook:
  trigger: "goal names an object whose location is unknown"
  body_uri: "./PLAYBOOK.md"
  composes_tools: ["recall_object", "locate_in_view", "execute_rskill"]
  done_predicate: "target confirmed in view at a known pose"
  max_steps: 12`,
  },
];

const LINKS = [
  { href: "https://huggingface.co/OpenRAL/models", label: "Browse rSkills", primary: true },
  { href: "https://github.com/OpenRAL/openral/tree/master/rskills/template", label: "rSkill template ↗" },
  { href: "https://github.com/OpenRAL/openral/tree/master/.agents/skills/rskill-packager", label: "rskill-packager agent ↗" },
];

// Minimal YAML colorizer: keys, quoted strings, numbers — tonal monochrome.
function colorize(text) {
  return text.split("\n").map((line, li) => {
    const m = line.match(/^(\s*)([\w.]+)(:)(.*)$/);
    return (
      <div className="yrow" key={li}>
        {m ? (
          <>
            {m[1]}
            <span className="yk">{m[2]}</span>
            {m[3]}
            {colorVal(m[4])}
          </>
        ) : (
          colorVal(line)
        )}
      </div>
    );
  });
}
function colorVal(s) {
  const out = [];
  // Match either a double-quoted string (group 1) or a number (integer/decimal, group 2).
  const re = /("[^"]*")|(\b\d+\.\d+\b|\b\d+\b)/g;
  let last = 0;
  let mm;
  while ((mm = re.exec(s))) {
    if (mm.index > last) out.push(s.slice(last, mm.index));
    out.push(
      <span className={mm[1] ? "ys" : "yn"} key={mm.index}>
        {mm[0]}
      </span>
    );
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export default function RSkills() {
  const left = useReveal();
  const right = useReveal({ delay: 0.1 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(KINDS[0].kind);
  // Auto-cycle through the kinds every 3s until the user picks a tab.
  const [autoplay, setAutoplay] = useState(true);
  const current = KINDS.find((k) => k.kind === active) || KINDS[0];

  useEffect(() => {
    if (!autoplay || reduce) return;
    const id = setInterval(() => {
      setActive((cur) => {
        const i = KINDS.findIndex((k) => k.kind === cur);
        return KINDS[(i + 1) % KINDS.length].kind;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [autoplay, reduce]);

  const pickKind = (kind) => {
    setActive(kind);
    setAutoplay(false);
  };

  return (
    <section id="rskills" className="band band-split">
      <motion.div className="split-copy" {...left}>
        <div className="eyebrow">05 — rSkills</div>
        <h2>
          <em>rSkills</em> you can publish, score and share.
        </h2>
        <p>
          An <strong>rSkill</strong> is a <strong>standardized robot skill</strong> — one capability packaged as
          a Hugging Face Hub repo: a typed <code>rskill.yaml</code> manifest, the weights, an optional engine
          plan, and a reproducible <code>eval/&lt;benchmark&gt;.json</code>. Six kinds, one contract — pick a kind
          to see a real manifest.
        </p>
        <ul className="ticks">
          <li>Typed manifest — embodiment tags, capabilities, quantization, fallback skill</li>
          <li>License-governed — commercial posture derived from the weights' license</li>
          <li>Eval-scored — paper-cited or reproduced-locally, never faked</li>
          <li>Installed and run with the <code>openral rskill</code> CLI</li>
        </ul>
        <div className="split-actions">
          {LINKS.map((l) => (
            <a
              key={l.label}
              className={`btn ${l.primary ? "btn-primary" : "btn-ghost"}`}
              href={l.href}
              target="_blank"
              rel="noopener"
            >
              {l.label}
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div className="split-vis" {...right}>
        <div className="kind-tabs" role="tablist" aria-label="rSkill kinds">
          {KINDS.map((k) => (
            <button
              key={k.kind}
              role="tab"
              aria-selected={active === k.kind}
              className={`kind-tab${active === k.kind ? " active" : ""}`}
              onClick={() => pickKind(k.kind)}
            >
              {k.kind}
            </button>
          ))}
        </div>
        <div className="yaml">
          <div className="yaml-bar">
            <span>rskill.yaml</span>
            <span className="yaml-kind">{current.what}</span>
          </div>
          <pre>
            <AnimatePresence mode="wait" initial={false}>
              <motion.code
                key={active}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {colorize(current.yaml)}
              </motion.code>
            </AnimatePresence>
          </pre>
        </div>
      </motion.div>
    </section>
  );
}
