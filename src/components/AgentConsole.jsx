import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import "./AgentConsole.css";

// A live S2-reasoner trace: typed tool-calls streaming as the agent acts.
// Distinct from the architecture diagram — this shows the system running.
const TRACE = [
  // S2 planning
  { tok: "audio.transcribe",    val: '"bring me a coke"',                    skill: null },
  { tok: "s2.reason",           val: "building plan · 7 subtasks",           skill: null },
  { tok: "s2.subtask[1]",       val: "navigate → kitchen",                   skill: null },
  { tok: "s2.subtask[2]",       val: "locate · CocaCola bottle",             skill: null },
  { tok: "s2.subtask[3]",       val: "ExecuteRSkill(grasp) · bottle",        skill: null },
  { tok: "s2.subtask[4]",       val: "locate glass · ExecuteRSkill(pour)",   skill: null },
  { tok: "s2.subtask[5]",       val: "return bottle → fridge",               skill: null },
  { tok: "s2.subtask[6]",       val: "recall glass · navigate user",         skill: null },
  { tok: "s2.subtask[7]",       val: "ExecuteRSkill(handover) · glass",      skill: null },
  // Navigate to kitchen
  { tok: "spatial_mem.recall",  val: "kitchen → pose (12.3, 4.1) ✓",        skill: "recall", ok: true },
  { tok: "LifecycleTransition", val: "navigate → ACTIVE",                    skill: "navigate" },
  { tok: "ExecuteRSkill",       val: "navigate_to_pose · kitchen",           skill: "navigate" },
  { tok: "detect.stream",       val: "scene · [corridor, door, wall]",       skill: "detect" },
  { tok: "robometer",           val: "0.91 ↑ · en route",                    skill: "robometer" },
  { tok: "safety.acm",          val: "self/world clear ✓",                   skill: "safety", ok: true },
  // Find Coca-Cola
  { tok: "ExecuteRSkill",       val: 'LocateAnything · "CocaCola"',          skill: "locate" },
  { tok: "detect.stream",       val: "scene · [shelf, bottles, mug]",        skill: "detect" },
  { tok: "query_scene",         val: 'vlm · "bottle on shelf-2"',            skill: "vlm" },
  { tok: "object_detector",     val: "CocaCola · conf 0.94 ✓",               skill: "detect", ok: true },
  { tok: "ExecuteRSkill",       val: "navigate_to_pose · shelf-2",           skill: "navigate" },
  // Grasp bottle — fails, replans, retries
  { tok: "safety.acm",          val: "self/world clear ✓",                   skill: "safety", ok: true },
  { tok: "ExecuteRSkill",       val: 'grasp("CocaCola")',                     skill: "grasp" },
  { tok: "robometer",           val: "0.61 ↑ · grip unstable",               skill: "robometer" },
  { tok: "failure.bus",         val: "grasp slipped · grip=0.21",            skill: null },
  { tok: "s2.reason",           val: "replan · grip angle +15°",             skill: null },
  { tok: "ExecuteRSkill",       val: 'grasp("CocaCola") · retry',            skill: "grasp" },
  { tok: "robometer",           val: "0.89 ↑ · grip stable ✓",               skill: "robometer", ok: true },
  // Find glass + pour
  { tok: "ExecuteRSkill",       val: 'LocateAnything · "glass"',             skill: "locate" },
  { tok: "detect.stream",       val: "scene · [counter, cups, bowl]",        skill: "detect" },
  { tok: "query_scene",         val: 'vlm · "glass · cupboard-1"',           skill: "vlm" },
  { tok: "object_detector",     val: "glass · conf 0.88 ✓",                  skill: "detect", ok: true },
  { tok: "ExecuteRSkill",       val: "navigate_to_pose · cupboard",          skill: "navigate" },
  { tok: "ExecuteRSkill",       val: 'grasp("glass")',                        skill: "grasp" },
  { tok: "ExecuteRSkill",       val: "pour(CocaCola → glass, 200ml)",        skill: "pour" },
  { tok: "query_progress",      val: "fill_level 94% ✓",                     skill: "robometer", ok: true },
  { tok: "ExecuteRSkill",       val: 'place("glass") · countertop',          skill: "place" },
  { tok: "safety.check",        val: "glass stable ✓",                       skill: "safety", ok: true },
  // Return bottle to fridge
  { tok: "ExecuteRSkill",       val: 'LocateAnything · "fridge"',            skill: "locate" },
  { tok: "detect.stream",       val: "scene · [fridge, counter, door]",      skill: "detect" },
  { tok: "query_scene",         val: 'vlm · "fridge · east wall"',           skill: "vlm" },
  { tok: "ExecuteRSkill",       val: "navigate_to_pose · fridge",            skill: "navigate" },
  { tok: "ExecuteRSkill",       val: 'open_door("fridge")',                   skill: "grasp" },
  { tok: "ExecuteRSkill",       val: 'place("CocaCola") · fridge',           skill: "place" },
  { tok: "ExecuteRSkill",       val: 'close_door("fridge")',                  skill: "grasp" },
  { tok: "safety.check",        val: "fridge sealed ✓",                      skill: "safety", ok: true },
  // Deliver to user
  { tok: "spatial_mem.recall",  val: "glass → countertop · pose ✓",         skill: "recall", ok: true },
  { tok: "ExecuteRSkill",       val: "navigate_to_pose · countertop",        skill: "navigate" },
  { tok: "ExecuteRSkill",       val: 'grasp("glass")',                        skill: "grasp" },
  { tok: "spatial_mem.recall",  val: "user → pose (0.0, 0.0) ✓",            skill: "recall", ok: true },
  { tok: "ExecuteRSkill",       val: "navigate_to_pose · user",              skill: "navigate" },
  { tok: "detect.stream",       val: "scene · [user, sofa, table]",          skill: "detect" },
  { tok: "safety.acm",          val: "self/world clear ✓",                   skill: "safety", ok: true },
  { tok: "ExecuteRSkill",       val: 'handover("glass")',                     skill: "handover" },
  { tok: "query_progress",      val: "handover confirmed ✓",                 skill: "robometer", ok: true },
  // Log episode
  { tok: "dataset.append",      val: "episode +1 ↗",                         skill: null },
  { tok: "otel.span",           val: "trace flushed",                        skill: null },
];
const CHIPS = ["detect", "vlm", "locate", "navigate", "grasp", "pour", "place", "recall", "robometer", "safety", "handover"];
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
