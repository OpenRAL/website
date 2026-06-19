import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useReveal } from "../hooks/useReveal.js";
import "./Dashboard.css";

/* The deployment dashboard sits alone inside the signature OpenRAL console
   window. As the page scrolls, callout "bubbles" reveal in the gutters on
   alternating sides — each a filled dot on the window edge, a connector line,
   and a card (header + subtitle) naming one region of the live operator view.

   MEDIA: the recorded walkthrough plays in the console; the still WebP is its
   poster (instant paint, zero layout shift) and the reduced-motion fallback.
   Both are the SAME 1280×3564 frame, so every callout position stays valid. */
const VIDEO = "/assets/dashboard-navigation.webm";
const MEDIA = "/assets/dashboard-view.webp";
const ALT =
  "OpenRAL mission-control dashboard — deployment identity, alarms, operator prompt, multi-modal camera feeds, SLAM map and point cloud, reasoner output, live skill/inference/safety signals, robot joint state and action chunk, telemetry sparklines and the activity log.";

/* Callouts, top → bottom. `t` is the vertical anchor as a fraction of the
   panel height (1280×3564), so it tracks the image at any width. Sides
   alternate so connectors never collide. Headers 2–4 words, subtitles one
   line, all in OpenRAL vocabulary (see python/observability dashboard). */
const NOTES = [
  { t: 0.03, side: "right", h: "Deployment identity",
    s: "Run mode, robot, rSkill, inference engine and safety kernel — latched immutably at launch." },
  { t: 0.075, side: "left", h: "Command center",
    s: "Steer the running policy with a voice or text prompt; reset the safety e-stop in one click." },
  { t: 0.19, side: "right", h: "Multi-modal sensor feeds",
    s: "Every camera and modality streams live, each tagged with its age and metadata." },
  { t: 0.3, side: "left", h: "Spatial perception",
    s: "A live SLAM occupancy map beside a robot-view point cloud rendered from the octomap." },
  { t: 0.42, side: "right", h: "Reasoner decision",
    s: "Each tick the reasoner picks the next tool and rSkill, with model and error state." },
  { t: 0.53, side: "left", h: "Embodiment & safety",
    s: "Per-joint actual-vs-commanded state, the next action chunk, gripper setpoint and safety ledger." },
  { t: 0.7, side: "right", h: "Telemetry metrics",
    s: "Every subsystem's histograms and gauges as rolling, real-time sparklines." },
  { t: 0.86, side: "left", h: "Activity log",
    s: "A chronological stream of spans, safety events and bridged logs, filtered by severity." },
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

/* One scroll-revealed callout bubble. Outer node owns positioning (so it can
   go static on mobile); inner motion node owns the edge-inward reveal. */
function Note({ note }) {
  const reduce = useReducedMotion();
  const fromX = note.side === "left" ? -34 : 34;
  return (
    <div
      className={`dash-note ${note.side}`}
      style={{ top: `calc(var(--dash-img-top, 96px) + var(--dash-img-h, 1640px) * ${note.t})` }}
    >
      <motion.div
        className="dash-note-in"
        initial={reduce ? false : { opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="dash-dot" aria-hidden="true" />
        <span className="dash-line" aria-hidden="true" />
        <div className="dash-card">
          <div className="dash-card-h">{note.h}</div>
          <p className="dash-card-s">{note.s}</p>
        </div>
      </motion.div>
    </div>
  );
}

/* Full-resolution lightbox — the whole panel, scrollable, Esc to close. */
function DashboardModal({ onClose }) {
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
      className="dash-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="OpenRAL mission-control dashboard, full view"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="dash-dialog"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="dash-dialog-bar">
          <span className="dash-dialog-meta">
            <span className="dash-dialog-title">openral · mission-control</span>
            <span className="dash-live">
              <i className="dash-live-dot" />LIVE
            </span>
          </span>
          <button ref={closeRef} type="button" className="dash-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="dash-dialog-scroll">
          <img className="dash-dialog-img" src={MEDIA} alt={ALT} width={1280} height={3564} />
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default function Dashboard() {
  const head = useReveal();
  const frame = useReveal({ delay: 0.05 });
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const stageRef = useRef(null);
  const mediaRef = useRef(null);

  /* Anchor the callouts to the MEDIA (not the stage) so the window title bar
     and padding don't shift them. Publish the media's top offset + height as
     CSS vars the notes read in their `top: calc(...)`. */
  useEffect(() => {
    const stage = stageRef.current;
    const media = mediaRef.current;
    if (!stage || !media) return;
    const measure = () => {
      const top = media.getBoundingClientRect().top - stage.getBoundingClientRect().top;
      stage.style.setProperty("--dash-img-top", `${top}px`);
      stage.style.setProperty("--dash-img-h", `${media.offsetHeight}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(media);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [reduce]);

  /* Play the walkthrough only while it's on screen (preload="none", so the
     ~4 MB clip isn't fetched until it scrolls into view), pause when it
     leaves. Skipped under reduced motion, where we render the still poster. */
  useEffect(() => {
    if (reduce) return;
    const video = mediaRef.current;
    if (!video || video.tagName !== "VIDEO") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section id="dashboard" className="band">
      <motion.div className="band-head" {...head}>
        <div className="eyebrow">07 — Mission control</div>
        <h2>
          See the whole stack <em>running</em> — every action, sensor and trace in one pane.
        </h2>
        <p className="band-sub">
          One operator console for a live deployment: sensors, spatial perception, the policy's
          decisions, embodiment, telemetry and the full OpenTelemetry trace. Scroll to see what each
          panel shows.
        </p>
      </motion.div>

      <div className="dash-stage" ref={stageRef}>
        <motion.div className="dash-window" {...frame}>
          <header className="dash-bar">
            <span className="dash-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="dash-file">openral · mission-control</span>
            <span className="dash-status">
              <span className="dash-pulse" />LIVE
            </span>
            <button type="button" className="dash-expand" onClick={() => setOpen(true)}
              aria-label="Expand dashboard to full size">
              <ExpandIcon />
              <span>expand</span>
            </button>
          </header>
          {reduce ? (
            <img ref={mediaRef} className="dash-img" src={MEDIA} alt={ALT} width={1280} height={3564} loading="lazy" />
          ) : (
            <video
              ref={mediaRef}
              className="dash-img"
              src={VIDEO}
              poster={MEDIA}
              width={1280}
              height={3564}
              muted
              loop
              playsInline
              preload="none"
              aria-label={ALT}
            />
          )}
        </motion.div>

        {NOTES.map((note) => (
          <Note key={note.h} note={note} />
        ))}
      </div>

      <AnimatePresence>{open && <DashboardModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </section>
  );
}
