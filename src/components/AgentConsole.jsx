import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import "./AgentConsole.css";

// A live S2-reasoner trace: typed tool-calls streaming as the agent acts.
// Distinct from the architecture diagram — this shows the system running.
const TRACE = [
  { tok: "reasoner.tick", val: "S2 online", skill: null },
  { tok: "ExecuteRSkill", val: 'detect · "mug, table"', skill: "detect" },
  { tok: "query_scene", val: 'vlm · "mug on table"', skill: "vlm" },
  { tok: "recall", val: '"mug" → pose ✓', skill: "recall", ok: true },
  { tok: "LifecycleTransition", val: "pick → ACTIVE", skill: "pick" },
  { tok: "ExecuteRSkill", val: "navigate_to_pose", skill: "navigate" },
  { tok: "safety.acm", val: "self/world clear ✓", skill: "safety", ok: true },
  { tok: "ExecuteRSkill", val: 'pick("mug")', skill: "pick" },
  { tok: "query_progress", val: "robometer 0.72 ↑", skill: "robometer" },
  { tok: "failure.bus", val: "grasp slipped", skill: null },
  { tok: "replan", val: "retry → substitute", skill: null },
  { tok: "EmitPrompt", val: '"confirm placement?"', skill: null },
  { tok: "ExecuteRSkill", val: "place", skill: "place" },
  { tok: "safety.check", val: "verdict pass ✓", skill: "safety", ok: true },
  { tok: "dataset.append", val: "episode +1 ↗", skill: null },
  { tok: "otel.span", val: "trace flushed", skill: null },
];
const CHIPS = ["detect", "vlm", "recall", "navigate", "pick", "robometer", "place", "safety"];
const MAX = 6;

export default function AgentConsole() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [done, setDone] = useState([]);
  const [cur, setCur] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (reduce) {
      setDone(TRACE.slice(-MAX).map((l) => ({ ...l, typed: l.val })));
      return;
    }
    if (!inView) return;
    let cancelled = false;
    const timers = [];
    let i = 0;

    const start = () => {
      const l = TRACE[i % TRACE.length];
      setActive(l.skill);
      setCur({ ...l, typed: "" });
      let k = 0;
      const type = () => {
        if (cancelled) return;
        k += 1;
        setCur({ ...l, typed: l.val.slice(0, k) });
        if (k < l.val.length) {
          timers.push(setTimeout(type, 26));
        } else {
          setDone((prev) => [...prev, { ...l, typed: l.val }].slice(-MAX));
          setCur(null);
          i += 1;
          timers.push(setTimeout(start, i % TRACE.length === 0 ? 1500 : 720));
        }
      };
      timers.push(setTimeout(type, 140));
    };

    start();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const rows = cur ? [...done, cur] : done;

  return (
    <div className="agent" ref={ref} aria-hidden="true">
      <div className="agent-bar">
        <span className="agent-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="agent-title">openral · agent</span>
        <span className="agent-live">
          <span className="agent-pulse" />
          LIVE
        </span>
      </div>

      <div className="agent-trace">
        {rows.map((l, idx) => (
          <div className={`tr-line${l.ok ? " ok" : ""}`} key={idx}>
            <span className="tr-tok">{l.tok}</span>
            <span className="tr-arrow">▸</span>
            <span className="tr-val">{l.typed}</span>
            {cur && idx === rows.length - 1 && <span className="tr-cursor" />}
          </div>
        ))}
      </div>

      <div className="agent-chips">
        {CHIPS.map((c) => (
          <span className={`chip${active === c ? " on" : ""}`} key={c}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
