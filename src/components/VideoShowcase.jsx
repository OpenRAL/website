import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import manifest from "../videos/manifest.json";
import "./VideoShowcase.css";

/* ------------------------------------------------------------------
   Clips are hosted on the OpenRAL/website-media HF dataset (public CDN)
   and listed in src/videos/manifest.json. Each entry carries a poster, a
   light square `preview` (the autoscroll strip) and a `full` clip (the
   modal). To add one: drop a raw file into media/<category>/ named
   <benchmark>_<rskill>_<success|fail>.<ext> and run `npm run media`,
   which encodes it, uploads it, and refreshes the manifest. See
   src/videos/README.md.
   ------------------------------------------------------------------ */
const BASE = manifest.base;

// Randomise clip order once per page load (Fisher–Yates).
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL = shuffle(
  manifest.clips.map((c) => ({
    ...c,
    poster: `${BASE}/${c.poster}`,
    preview: `${BASE}/${c.preview}`,
    full: `${BASE}/${c.full}`,
  }))
);

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

/* One square, rounded, looping clip with its overlays.
   Lazy: the file isn't fetched until the card scrolls into view; it then
   plays while visible and pauses when it leaves — so only the handful of
   on-screen clips ever load or play, regardless of how many exist. */
function ClipCard({ clip, reduce, onOpen }) {
  const videoRef = useRef(null);
  const [load, setLoad] = useState(false); // src set on first reveal, then kept
  const [visible, setVisible] = useState(false);

  // Track visibility; start ~120px early so a clip is ready as it enters view.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoad(true);
      },
      { rootMargin: "120px", threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Play when visible (calling play() also triggers the load under preload=none);
  // pause when off-screen. Runs after src is set, so the file exists to play.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !load) return;
    if (visible && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [load, visible, reduce]);

  return (
    <button type="button" className="show-card" onClick={() => onOpen(clip)}
      aria-label={`${clip.benchmark} · ${clip.rskill} · ${clip.status || "result"} — open full size`}>
      <video
        ref={videoRef}
        className="show-video"
        src={load ? clip.preview : undefined}
        poster={clip.poster || undefined}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
      />
      <span className="show-grad" aria-hidden="true" />

      <div className="show-top">
        <span className="show-chip show-chip-bench">{clip.benchmark}</span>
        <span className="show-chip show-chip-rskill">{clip.rskill}</span>
      </div>

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

/* Horizontal autoscroll. Each clip is rendered once; a second, aria-hidden
   copy is added ONLY when the strip overflows its container — so the loop is
   seamless yet the duplicate is always off-screen (a clip is never visible
   twice at once). If the clips fit, they're shown once, centered, no scroll.
   The row pauses on hover/focus or while the modal is open; under
   reduced-motion it's a plain, manually-scrollable strip. */
function Marquee({ clips, paused, reduce, onOpen }) {
  const wrapRef = useRef(null);
  const seqRef = useRef(null);
  // px to shift per loop; 0 means the clips fit and shouldn't scroll
  const [shift, setShift] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShift(0);
      return;
    }
    const measure = () => {
      const wrap = wrapRef.current;
      const seq = seqRef.current;
      if (!wrap || !seq) return;
      const gap = parseFloat(getComputedStyle(seq).columnGap) || 0;
      const seqW = seq.scrollWidth;
      setShift(seqW > wrap.clientWidth + 1 ? seqW + gap : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, [clips, reduce]);

  if (!clips.length) {
    return (
      <div className="show-empty">
        Drop a clip into <code>media/{clips.category}</code> named{" "}
        <code>&lt;benchmark&gt;_&lt;rskill&gt;_&lt;success|fail&gt;.mp4</code>, then run{" "}
        <code>npm run media</code> — it appears here.
      </div>
    );
  }

  const animate = shift > 0 && !reduce;
  const duration = Math.max(14, shift / 70); // ~70px/s, constant feel

  const seq = (ref, hidden) => (
    <ul className="show-seq" ref={ref} aria-hidden={hidden || undefined}>
      {clips.map((clip, i) => (
        <li className="show-item" key={`${clip.id}-${i}`}>
          <ClipCard clip={clip} reduce={reduce} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`show-marquee${reduce ? " is-static" : ""}`} ref={wrapRef}>
      <div
        className={`show-track${animate ? " is-animated" : " is-centered"}${paused ? " is-paused" : ""}`}
        style={animate ? { "--marquee-dur": `${duration}s`, "--marquee-shift": `${shift}px` } : undefined}
      >
        {seq(seqRef, false)}
        {animate && seq(null, true)}
      </div>
    </div>
  );
}

/* Full-resolution modal — native aspect ratio, controls, sound.
   The dialog sizes itself to the clip's real aspect ratio (read from the
   loaded metadata) so wide deployment composites open at full width instead
   of being squeezed into a square-ish box — i.e. genuinely high-res. */
function ClipModal({ clip, onClose }) {
  const closeRef = useRef(null);
  const [aspect, setAspect] = useState(null); // intrinsic width / height

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
        style={aspect ? { width: `min(96vw, calc((90vh - 64px) * ${aspect}))` } : undefined}
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
        <video
          className="show-dialog-video"
          src={clip.full}
          poster={clip.poster}
          autoPlay
          loop
          playsInline
          controls
          onLoadedMetadata={(e) => {
            const { videoWidth: w, videoHeight: h } = e.currentTarget;
            if (w && h) setAspect(w / h);
          }}
        />
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

  const clips = ALL.filter((c) => c.category === active);
  clips.category = active; // for the empty-state hint

  return (
    <section id="showcase" className="band">
      <motion.div className="band-head" {...head}>
        <div className="eyebrow">06 — See it run</div>
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
