import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Terminal.css";

const CMD = "curl -fsSL https://raw.githubusercontent.com/OpenRAL/openral/master/scripts/install.sh | sh";
const OUTPUT = [
  { t: "▸ fetching openral install script…", k: "run" },
  { t: "▸ resolving ROS 2 + Python deps…", k: "run" },
  { t: "▸ installing harness · L0–L7…", k: "run" },
  { t: "✓ openral ready — run `openral doctor` to verify", k: "ok" },
];

export default function Terminal() {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const [typed, setTyped] = useState(reduce ? CMD : "");
  const [lines, setLines] = useState(reduce ? OUTPUT.length : 0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    let cancelled = false;
    const timers = [];

    const run = () => {
      setTyped("");
      setLines(0);
      let i = 0;
      const type = () => {
        if (cancelled) return;
        i += 1;
        setTyped(CMD.slice(0, i));
        if (i < CMD.length) {
          timers.push(setTimeout(type, 26));
        } else {
          OUTPUT.forEach((_, idx) =>
            timers.push(setTimeout(() => !cancelled && setLines(idx + 1), 420 * (idx + 1)))
          );
          timers.push(setTimeout(run, 420 * OUTPUT.length + 4200)); // loop
        }
      };
      timers.push(setTimeout(type, 500));
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <section id="install" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">01 — Install</div>
        <h2>
          One <em>command</em>. The whole harness.
        </h2>
        <p className="band-sub">
          OpenRAL installs on top of a ROS 2 + Python environment. The script pulls the typed harness, the
          skill loader and the safety forwarders — then <code>openral doctor</code> checks your stack.
        </p>
      </motion.div>

      <motion.div className="term" ref={ref} {...reveal}>
        <div className="term-bar">
          <span className="term-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="term-title">openral · install</span>
          <button className="term-copy" type="button" onClick={copy} aria-label="Copy install command">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <div className="term-body">
          <div className="term-cmd">
            <span className="term-prompt">$</span>
            <code>
              {typed}
              {!reduce && typed.length < CMD.length && <span className="term-cursor" />}
            </code>
          </div>
          <div className="term-out">
            {OUTPUT.slice(0, lines).map((l, i) => (
              <motion.div
                key={i}
                className={`term-line ${l.k}`}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                {l.t}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <p className="term-note">
        Prerequisites: ROS 2 Jazzy · Python 3.12+ · a CUDA GPU for VLA inference. Full guide in the{" "}
        <a href="https://github.com/OpenRAL/openral" target="_blank" rel="noopener">
          repository
        </a>
        .
      </p>
    </section>
  );
}
