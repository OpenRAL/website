import { motion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./RSkills.css";

export default function RSkills() {
  const left = useReveal();
  const right = useReveal({ delay: 0.1 });
  return (
    <section id="rskills" className="band band-split">
      <motion.div className="split-copy" {...left}>
        <div className="eyebrow">04 — rSkills</div>
        <h2>Skills you can publish, score and share.</h2>
        <p>
          An <strong>rSkill</strong> is one robot capability, packaged as a HuggingFace Hub repo: an{" "}
          <code>rskill.yaml</code> manifest, the weights, an optional engine plan, and an{" "}
          <code>eval/&lt;benchmark&gt;.json</code> validated against a typed schema. Licenses are
          version-specific and enforced by the loader; latency budgets are contractual.
        </p>
        <ul className="ticks">
          <li>Typed manifest — embodiment tags, capabilities, quantization, fallback skill</li>
          <li>License-governed — commercial posture derived from the weights' license</li>
          <li>Eval-scored — paper-cited or reproduced-locally, never faked</li>
          <li>
            Kinds — <code>vla</code> · <code>detector</code> · <code>vlm</code> · <code>reward</code> ·{" "}
            <code>ros_action</code>
          </li>
        </ul>
      </motion.div>
      <motion.div className="split-vis" {...right}>
        <div className="yaml">
          <div className="yaml-bar">
            <span>rskill.yaml</span>
          </div>
          <pre>
            <code>
              <span className="yk">name</span>: <span className="ys">"OpenRAL/rskill-pi05-openarm-vision"</span>
              {"\n"}
              <span className="yk">kind</span>: <span className="ys">"vla"</span>
              {"\n"}
              <span className="yk">role</span>: <span className="ys">"s1"</span>
              {"\n"}
              <span className="yk">model_family</span>: <span className="ys">"pi05"</span>
              {"\n"}
              <span className="yk">license</span>: <span className="ys">"apache-2.0"</span>
              {"\n"}
              <span className="yk">embodiment_tags</span>: [<span className="ys">"openarm"</span>]
              {"\n"}
              <span className="yk">actions</span>: [<span className="ys">PICK</span>, <span className="ys">PLACE</span>,{" "}
              <span className="ys">TRANSFER</span>]
              {"\n"}
              <span className="yk">latency_budget</span>:{"\n"}
              {"  "}
              <span className="yk">warm_chunk_ms</span>: <span className="yn">120</span>
              {"\n"}
              <span className="yk">eval</span>:{"\n"}
              {"  "}
              <span className="yk">libero_spatial</span>: <span className="yn">0.972</span>
            </code>
          </pre>
        </div>
      </motion.div>
    </section>
  );
}
