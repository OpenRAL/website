import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import { track } from "../analytics.js";
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

// Tier-0 (ADR-0021): `curl … | bash` installs uv + CPython 3.12 + openral-cli
// (user-local, no sudo/ROS 2). The `out` lines mirror scripts/install.sh's real
// `==> …` info output, condensed; then `openral` drops into the REPL (banner) and
// `doctor` prints the host table — the same banner + doctor the REPL shows.
const CURL_CMD = "curl -fsSL https://raw.githubusercontent.com/OpenRAL/openral/master/scripts/install.sh | bash";
const CURL_SCRIPT = [
  { cmd: CURL_CMD },
  {
    out: [
      { t: "==> detected platform: linux x86_64" },
      { t: "==> installing uv + CPython 3.12 (uv-managed)…" },
      { t: "==> installing openral-cli (uv tool install)" },
      { t: "==> openral installed: ~/.local/bin/openral", k: "ok" },
    ],
  },
  { cmd: "openral" },
  { banner: true },
  { cmd: "doctor" },
  { table: true },
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
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CURL_CMD);
      setCopied(true);
      track("install_command_copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <section id="install" className="band">
      <motion.div className="band-head" {...reveal}>
        <div className="eyebrow">03 — Install</div>
        <h2>
          One <em>command</em>. The whole harness.
        </h2>
        <p className="band-sub">
          Install OpenRAL with a single command — everything else comes when you need it.
        </p>
      </motion.div>

      <motion.div className="term" ref={ref} {...reveal}>
        <div className="term-bar">
          <span className="term-dots">
            <i />
            <i />
            <i />
          </span>
          <div className="term-tabs" />
          <button className="term-copy" type="button" onClick={copy} aria-label="Copy install command">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <ScriptPane key="curl" script={CURL_SCRIPT} active={inView} reduce={reduce} />
      </motion.div>
    </section>
  );
}
