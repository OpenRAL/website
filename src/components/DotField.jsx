import { useEffect, useRef } from "react";

// Lightweight animated dot-matrix background (canvas, no WebGL).
// Monochrome white dots whose brightness ripples over time — a calm,
// black-and-white take on the Aceternity dot-grid effect.
export default function DotField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 26;
    let dots = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // concentrate brightness toward the top-centre, fading out down/edges
      const cx = w * 0.5;
      const cy = h * 0.12;
      const maxd = Math.hypot(w * 0.7, h * 1.05);
      dots = [];
      for (let y = GAP; y < h; y += GAP) {
        for (let x = GAP; x < w; x += GAP) {
          const d = Math.hypot(x - cx, y - cy) / maxd;
          const spatial = Math.max(0, 1 - d);
          if (spatial < 0.04) continue;
          dots.push({ x, y, spatial, phase: x * 0.012 + y * 0.02 });
        }
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < dots.length; i++) {
        const dt = dots[i];
        const ripple = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(t * 0.0011 + dt.phase);
        ctx.globalAlpha = (0.03 + 0.17 * ripple) * dt.spatial;
        ctx.fillRect(dt.x, dt.y, 1.7, 1.7);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      if (t - last > 33) {
        // ~30fps
        draw(t);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };

    build();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="dotfield" aria-hidden="true" />;
}
