import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./RSkills.css";

// Each kind maps to a real rSkill manifest from huggingface.co/OpenRAL/models.
const KINDS = [
  {
    kind: "vla",
    what: "Visuomotor policy · S1",
    yaml: `name: "OpenRAL/rskill-pi05-libero-nf4"
kind: "vla"
role: "s1"
model_family: "pi05"
license: "gemma"
embodiment_tags: ["franka"]
actions: [PICK, PLACE, TRANSFER]
quantization: "nf4"
latency_budget:
  warm_chunk_ms: 120
eval:
  libero_spatial: 0.972`,
  },
  {
    kind: "detector",
    what: "Open-vocab perception",
    yaml: `name: "OpenRAL/rskill-rtdetr-v2-r50vd"
kind: "detector"
role: "perception"
model_family: "rt-detr-v2"
license: "apache-2.0"
engine: "tensorrt"
classes: "coco-80"
latency_budget:
  infer_ms: 8
eval:
  coco_map: 0.532`,
  },
  {
    kind: "vlm",
    what: "Scene understanding",
    yaml: `name: "OpenRAL/rskill-qwen35-4b-nf4"
kind: "vlm"
role: "perception"
model_family: "qwen3.5"
license: "apache-2.0"
tool: "query_scene"
quantization: "nf4"
capabilities: ["scene", "spatial"]
latency_budget:
  answer_ms: 450`,
  },
  {
    kind: "reward",
    what: "Task-progress scoring",
    yaml: `name: "OpenRAL/rskill-robometer-4b-nf4"
kind: "reward"
role: "critic"
model_family: "robometer"
base_model: "robometer/Robometer-4B"
license: "apache-2.0"
tool: "query_task_progress"
output: "progress in [0, 1]"
quantization: "nf4"`,
  },
  {
    kind: "ros_action",
    what: "ROS 2 action wrappers",
    yaml: `name: "OpenRAL/rskill-nav2-navigate-to-pose"
kind: "ros_action"
role: "s1"
backend: "nav2"
license: "apache-2.0"
action: "navigate_to_pose"
inputs: ["target_pose"]
weights: none`,
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
  const [active, setActive] = useState("vla");
  const current = KINDS.find((k) => k.kind === active);

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
          plan, and a reproducible <code>eval/&lt;benchmark&gt;.json</code>. Five kinds, one contract — pick a kind
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
              onClick={() => setActive(k.kind)}
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
