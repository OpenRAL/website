import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./VideoShowcase.css";

/* ------------------------------------------------------------------
   Auto-discovery.

   Drop a clip into one of:
     src/videos/benchmarks/   src/videos/simulation/   src/videos/deployment/

   Name it  <benchmark>_<rskill>_<success|fail>.mp4  — e.g.
     libero-spatial_pi05_success.mp4
     warehouse-pick_rtdetr-v2_fail.mp4

   The category comes from the folder; the overlays (benchmark name,
   rSkill name, SUCCESS/FAIL) are parsed from the filename. Use hyphens
   inside a name, underscores only as the three separators. No code
   change is needed to add a clip — Vite globs the folders at build time.
   ------------------------------------------------------------------ */
const FILES = import.meta.glob("/src/videos/*/*.{mp4,webm,mov,m4v}", {
  eager: true,
  query: "?url",
  import: "default",
});

function parseClip(path, url) {
  const seg = path.split("/");
  const category = seg[seg.length - 2]; // folder name
  const base = seg[seg.length - 1].replace(/\.[^.]+$/, "");
  const parts = base.split("_");
  const tail = parts[parts.length - 1] || "";
  const status = /^succ/i.test(tail) ? "success" : /^fail/i.test(tail) ? "fail" : null;
  const benchmark = parts[0] || base;
  const rskill = parts.slice(1, status ? -1 : undefined).join("_") || "—";
  return { id: path, url, category, benchmark, rskill, status };
}

const ALL = Object.entries(FILES).map(([path, url]) => parseClip(path, url));

const TABS = [
  { id: "benchmarks", label: "Benchmarks" },
  { id: "simulation", label: "Simulation" },
  { id: "deployment", label: "Deployment" },
];

const ExpandIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4" />
  </svg>
);

const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* One square, rounded, looping clip with its overlays. */
function ClipCard({ clip, reduce, onOpen }) {
  return (
    <button type="button" className="show-card" onClick={() => onOpen(clip)}
      aria-label={`${clip.benchmark} · ${clip.rskill} · ${clip.status || "result"} — open full size`}>
      <video className="show-video" src={clip.url} muted loop playsInline
        autoPlay={!reduce} preload="metadata" tabIndex={-1} />
      <span className="show-grad" aria-hidden="true" />

      <span className="show-chip show-chip-tl">{clip.benchmark}</span>
      <span className="show-chip show-chip-tr">{clip.rskill}</span>

      {clip.status && (
        <span className={`show-status show-status-${clip.status}`}>
          <i className="show-dot" />
          {clip.status === "success" ? "SUCCESS" : "FAIL"}
        </span>
      )}

      <span className="show-expand" aria-hidden="true">
        <ExpandIcon />
      </span>
    </button>
  );
}

/* Seamless horizontal marquee. Two copies of the track translate -50%;
   the row pauses when any card is hovered/focused or the modal is open.
   Under reduced-motion it becomes a plain horizontal scroll region. */
function Marquee({ clips, reverse, paused, reduce, onOpen }) {
  if (!clips.length) {
    return (
      <div className="show-empty">
        Drop a clip into <code>src/videos/{clips.category}</code> named{" "}
        <code>&lt;benchmark&gt;_&lt;rskill&gt;_&lt;success|fail&gt;.mp4</code> and it appears here.
      </div>
    );
  }

  const loop = reduce ? clips : [...clips, ...clips];
  const duration = Math.max(18, clips.length * 7);

  return (
    <div className={`show-marquee${reduce ? " is-static" : ""}`} data-reverse={reverse || undefined}>
      <ul
        className={`show-track${paused ? " is-paused" : ""}`}
        style={reduce ? undefined : { "--marquee-dur": `${duration}s` }}
      >
        {loop.map((clip, i) => (
          <li className="show-item" key={`${clip.id}-${i}`} aria-hidden={i >= clips.length || undefined}>
            <ClipCard clip={clip} reduce={reduce} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Full-resolution modal — native aspect ratio, controls, sound. */
function ClipModal({ clip, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="show-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${clip.benchmark} — ${clip.rskill}`}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="show-dialog"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="show-dialog-bar">
          <span className="show-dialog-meta">
            <span className="show-dialog-bench">{clip.benchmark}</span>
            <span className="show-dialog-sep">/</span>
            <span className="show-dialog-rskill">{clip.rskill}</span>
            {clip.status && (
              <span className={`show-status show-status-${clip.status} is-inline`}>
                <i className="show-dot" />
                {clip.status === "success" ? "SUCCESS" : "FAIL"}
              </span>
            )}
          </span>
          <button ref={closeRef} type="button" className="show-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <video className="show-dialog-video" src={clip.url} autoPlay loop playsInline controls />
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default function VideoShowcase() {
  const head = useReveal();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(TABS[0].id);
  const [open, setOpen] = useState(null);

  const tabIndex = TABS.findIndex((t) => t.id === active);
  const clips = ALL.filter((c) => c.category === active);
  clips.category = active; // for the empty-state hint

  return (
    <section id="showcase" className="band">
      <motion.div className="band-head" {...head}>
        <div className="eyebrow">03 — See it run</div>
        <h2>
          Every clip is a <em>real run</em>, scored and labelled.
        </h2>
        <p className="band-sub">
          Benchmarks, simulation and on-hardware deployment — each video is one rSkill on one
          benchmark, marked <strong>SUCCESS</strong> or <strong>FAIL</strong> exactly as the eval
          recorded it. Hover to pause; click any clip to watch it full size.
        </p>
      </motion.div>

      <div className="show-tabs" role="tablist" aria-label="Showcase categories">
        {TABS.map((t) => {
          const count = ALL.filter((c) => c.category === t.id).length;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              className={`show-tab${active === t.id ? " active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
              <span className="show-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Marquee
            clips={clips}
            reverse={tabIndex % 2 === 1}
            paused={!!open}
            reduce={reduce}
            onOpen={setOpen}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {open && <ClipModal clip={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
