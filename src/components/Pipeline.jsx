import { motion } from "framer-motion";
import { useReveal, useStagger } from "../hooks/useReveal.js";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import DotField from "./DotField.jsx";
import Dashboard from "./Dashboard.jsx";
import RSkills from "./RSkills.jsx";
import "./Pipeline.css";

// Commands are real CLI invocations from the repo's cheat sheet — keep in sync
// with github.com/OpenRAL/openral README.
const COMMANDS = [
  { cmd: "openral benchmark run", note: "score an rSkill against the scene catalogue" },
  { cmd: "openral sim run", note: "same agent, headless YAML-driven rollout" },
  { cmd: "openral deploy sim --config scenes/deploy/my_workcell.yaml", note: "rehearse the deployment in sim" },
  { cmd: "openral deploy run --config scenes/deploy/my_workcell.yaml", note: "same agent, real hardware" },
  { cmd: "openral dashboard", note: "watch every span live at :4318" },
];

const ARENAS = [
  {
    title: "Benchmark",
    body: "Score any rSkill on the standard suites — video, metrics and a reproducible SkillEvalResult JSON out of every run.",
    items: ["LIBERO", "MetaWorld", "ManiSkill3", "SimplerEnv", "RoboCasa", "RoboTwin 2.0", "RLBench", "VLABench", "BEHAVIOR-1K"],
  },
  {
    title: "Simulate",
    body: "One YAML drives a reproducible headless rollout — heavy sim stacks install themselves on first use.",
    items: ["MuJoCo", "Isaac Sim", "Genesis", "SAPIEN", "robosuite", "CoppeliaSim", "gym-aloha", "gym-pusht"],
  },
  {
    title: "Deploy",
    body: "The identical agent goes to hardware — edge-quantized, reward-monitored, behind the same safety kernel.",
    items: ["f32", "bf16", "int8", "nf4", "onnx", "tensorrt", "thor", "orin", "x86 dGPU"],
  },
];

const TRACE = [
  "OpenTelemetry spans end-to-end — reasoner ticks, action chunks, safety verdicts",
  "Live operator dashboard + read-only Foxglove 3D scene",
  "Every run replayable and auditable from its trace",
  "Successful runs fold into a LeRobot dataset flywheel",
];

export default function Pipeline() {
  const head = useReveal();
  const cmdReveal = useReveal({ delay: 0.08 });
  const traceReveal = useReveal();
  const { container, item } = useStagger(0.08);

  return (
    <>
      <DotField />
      <Nav />
      <main id="top">
        <section id="pipeline" className="band">
          <motion.div className="band-head" {...head}>
            <div className="eyebrow">01 — The pipeline</div>
            <h2>
              Benchmark. Simulate. <em>Deploy.</em> Same agent.
            </h2>
            <p className="band-sub">
              The harness, the rSkills and the safety boundary don't change between arenas — only the command
              does. Score a skill, roll it out headless, then put it on hardware, with the same typed trace out of
              every run.
            </p>
          </motion.div>

          <motion.div className="pipe-console" {...cmdReveal}>
            <header className="pipe-bar">
              <span className="pipe-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="pipe-file">same agent · benchmark → sim → real</span>
            </header>
            <div className="pipe-lines">
              {COMMANDS.map((c) => (
                <div className="pipe-line" key={c.cmd}>
                  <span className="pipe-prompt">$</span>
                  <span className="pipe-cmd">{c.cmd}</span>
                  <span className="pipe-note"># {c.note}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="arena-grid"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {ARENAS.map((a) => (
              <motion.article className="arena-card" key={a.title} variants={item}>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <ul className="arena-items">
                  {a.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <RSkills />

        <Dashboard />

        <section id="traceability" className="band">
          <motion.div className="band-head" {...traceReveal}>
            <div className="eyebrow">04 — Traceability</div>
            <h2>
              Every run leaves a <em>trace</em> you can replay.
            </h2>
            <p className="band-sub">
              Nothing about a run is anecdotal. If it happened, it's in the trace — and if it's in the trace, you
              can replay it, audit it, or learn from it.
            </p>
          </motion.div>
          <ul className="trace-ticks">
            {TRACE.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="trace-actions">
            <a className="btn btn-ghost" href="https://docs.openral.com" target="_blank" rel="noopener">
              Observability docs <span className="arr">↗</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
