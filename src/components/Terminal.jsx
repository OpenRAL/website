import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Terminal.css";

// Exact `console.export_text()` output of openral_cli.main.render_banner("0.1.0", width=127)
// and of the `openral doctor` Rich table — captured from the real CLI so the site shows the
// literal terminal output, not a re-styled approximation.
const BANNER_TEXT = `╭─ OPENRAL v0.1.0 ────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                             │
│  █             █   ██████╗ ██████╗ ███████╗███╗   ██╗██████╗  █████╗ ██╗       │  Discord       discord.gg/3paXT2bVyB       │
│  ██▄         ▄██  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔══██╗██║       │  GitHub        github.com/OpenRAL/openral  │
│  ████▄▄   ▄▄████  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║██████╔╝███████║██║       │  Hugging Face  huggingface.co/OpenRAL      │
│  ▀██████ ██████▀  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║██╔══██╗██╔══██║██║       │  Website       openral.com                 │
│     ▀███████▀     ╚██████╔╝██║     ███████╗██║ ╚████║██║  ██║██║  ██║███████╗  │  ────────────────────────────────────────  │
│   ▀   ▀███▀   ▀    ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝  │  doctor         diagnose your host setup   │
│                                                                                │  rskill search  find installable skills    │
│          OpenRAL — Open Robot Agentic Layer (harness) for embodied AI          │  help           list every command         │
│        fast policies · slow reasoning · rewards · perception · control         │  exit           leave the repl · Ctrl-D    │
│                                                                                                                             │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯`;

const DOCTOR_TEXT = `                    openral doctor
┏━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ check        ┃ status ┃ details                     ┃
┡━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ Python       │ ok     │ 3.12.4                      │
│ Platform     │ ok     │ Ubuntu 24.04 (noble) x86_64 │
│ ROS 2 distro │ ok     │ jazzy                       │
│ colcon       │ ok     │ 0.20.0                      │
│ GPU          │ ok     │ NVIDIA RTX 4090 · CUDA 12.6 │
│ USB devices  │ ok     │ so101, realsense            │
└──────────────┴────────┴─────────────────────────────┘`;

// Real openral ROS 2 package names (~/openral), one per product pillar — observability,
// safety, perception, reasoning, skill execution — interleaved like colcon's parallel build.
const CLI_CLONE_CMD = "git clone git@github.com:OpenRAL/openral.git";
const CLI_SCRIPT = [
  { cmd: CLI_CLONE_CMD },
  { cmd: "just quickstart" },
  {
    out: [
      { t: "Starting >>> opentelemetry_cpp_vendor" },
      { t: "Starting >>> openral_safety_kernel" },
      { t: "Finished <<< opentelemetry_cpp_vendor [17.9s]", k: "ok" },
      { t: "Starting >>> openral_perception_ros" },
      { t: "Finished <<< openral_safety_kernel [9.2s]", k: "ok" },
      { t: "Starting >>> openral_reasoner_ros" },
      { t: "Finished <<< openral_perception_ros [14.1s]", k: "ok" },
      { t: "Starting >>> openral_rskill_ros" },
      { t: "Finished <<< openral_reasoner_ros [11.6s]", k: "ok" },
      { t: "Finished <<< openral_rskill_ros [20.9s]", k: "ok" },
    ],
  },
  { banner: true },
  { cmd: "doctor" },
  { table: true },
];
const CLI_COPY = `${CLI_CLONE_CMD} && cd openral && just quickstart`;

// Tier-0 (ADR-0021): installs uv + CPython 3.12 + openral-cli only — no ROS 2,
// no colcon build, no REPL launch — so no Starting/Finished lines here, and the
// ending below is the real "next steps" text from scripts/install.sh, condensed.
const CURL_CMD = "curl -fsSL https://raw.githubusercontent.com/OpenRAL/openral/master/scripts/install.sh | bash";
const CURL_SCRIPT = [
  { cmd: CURL_CMD },
  {
    out: [
      { t: "▸ installing uv + CPython 3.12…" },
      { t: "▸ installing openral-cli (uv tool install)…" },
      { t: "✓ openral installed: ~/.local/bin/openral", k: "ok" },
      { t: "==> Tier-0 install complete.", k: "ok" },
      { t: "openral doctor — diagnose the host (Python, OS, GPU, USB)" },
      { t: "openral install ros — ROS 2 + libusb + udev (sudo, opt-in)" },
    ],
  },
];

function flattenReduced(script) {
  return script.flatMap((b) => {
    if (b.cmd) return [{ kind: "cmd", text: b.cmd }];
    if (b.out) return b.out.map((l) => ({ kind: "out", ...l }));
    if (b.banner) return [{ kind: "banner" }];
    return [{ kind: "table" }];
  });
}

function useScriptRunner(script, active, reduce) {
  const [rows, setRows] = useState([]);
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    if (reduce) {
      setRows(flattenReduced(script));
      return;
    }
    if (!active) return;
    let cancelled = false;
    const timers = [];
    const after = (fn, ms) => timers.push(setTimeout(() => !cancelled && fn(), ms));

    const step = (i) => {
      if (cancelled) return;
      if (i >= script.length) {
        after(() => {
          setRows([]);
          step(0);
        }, 3600);
        return;
      }
      const block = script[i];
      if (block.cmd) {
        let c = 0;
        const type = () => {
          if (cancelled) return;
          c += 1;
          setTyping(block.cmd.slice(0, c));
          if (c < block.cmd.length) {
            after(type, 22);
          } else {
            after(() => {
              setRows((r) => [...r, { kind: "cmd", text: block.cmd }]);
              setTyping(null);
              step(i + 1);
            }, 300);
          }
        };
        after(type, 300);
      } else if (block.out) {
        let li = 0;
        const reveal = () => {
          if (cancelled) return;
          const item = block.out[li];
          setRows((r) => [...r, { kind: "out", ...item }]);
          li += 1;
          if (li < block.out.length) after(reveal, 260);
          else after(() => step(i + 1), 500);
        };
        after(reveal, 220);
      } else {
        after(() => {
          setRows((r) => [...r, { kind: block.banner ? "banner" : "table" }]);
          step(i + 1);
        }, 400);
      }
    };

    step(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [script, active, reduce]);

  return { rows, typing };
}

// Colors the literal "ok" status cells without disturbing column alignment —
// a <span> adds no character width, so the monospace grid stays intact.
function colorizeOk(line, i) {
  return (
    <div key={i}>
      {line.split(/(ok)/g).map((chunk, j) =>
        chunk === "ok" ? (
          <span className="term-ok" key={j}>
            ok
          </span>
        ) : (
          chunk
        )
      )}
    </div>
  );
}

function Banner() {
  return <pre className="term-pre term-banner">{BANNER_TEXT}</pre>;
}

function DoctorTable() {
  return <pre className="term-pre term-doctor">{DOCTOR_TEXT.split("\n").map(colorizeOk)}</pre>;
}

function ScriptPane({ script, active, reduce }) {
  const { rows, typing } = useScriptRunner(script, active, reduce);
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rows, typing]);

  return (
    <div className="term-body" ref={bodyRef}>
      {rows.map((r, i) => {
        if (r.kind === "cmd") {
          return (
            <div className="term-cmd" key={i}>
              <span className="term-prompt">$</span>
              <code>{r.text}</code>
            </div>
          );
        }
        if (r.kind === "banner") return <Banner key={i} />;
        if (r.kind === "table") return <DoctorTable key={i} />;
        return (
          <motion.div
            key={i}
            className={`term-line ${r.k || ""}`}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {r.t}
          </motion.div>
        );
      })}
      {typing !== null && (
        <div className="term-cmd">
          <span className="term-prompt">$</span>
          <code>
            {typing}
            {!reduce && <span className="term-cursor" />}
          </code>
        </div>
      )}
    </div>
  );
}

export default function Terminal() {
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [tab, setTab] = useState("cli");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tab === "cli" ? CLI_COPY : CURL_CMD);
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
          <div className="term-tabs">
            <button
              className={`term-tab${tab === "cli" ? " active" : ""}`}
              type="button"
              onClick={() => setTab("cli")}
            >
              CLI
            </button>
            <button
              className={`term-tab term-tab-curl${tab === "curl" ? " active" : ""}`}
              type="button"
              onClick={() => setTab("curl")}
            >
              <span className="soon">Coming soon</span>
              CURL
            </button>
          </div>
          <button className="term-copy" type="button" onClick={copy} aria-label="Copy install command">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        {tab === "cli" ? (
          <ScriptPane key="cli" script={CLI_SCRIPT} active={inView} reduce={reduce} />
        ) : (
          <ScriptPane key="curl" script={CURL_SCRIPT} active={inView} reduce={reduce} />
        )}
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
