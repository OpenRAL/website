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

      // dots span the whole viewport, gently brighter toward the top
      dots = [];
      for (let y = GAP; y < h; y += GAP) {
        const topFactor = 0.45 + 0.55 * Math.max(0, 1 - y / (h * 1.25));
        for (let x = GAP; x < w; x += GAP) {
          dots.push({ x, y, spatial: topFactor, phase: x * 0.013 + y * 0.021 });
        }
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < dots.length; i++) {
        const dt = dots[i];
        const ripple = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(t * 0.0011 + dt.phase);
        ctx.globalAlpha = (0.06 + 0.24 * ripple) * dt.spatial;
        ctx.fillRect(dt.x, dt.y, 2, 2);
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

    // pause the loop while the tab is hidden
    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    build();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="dotfield" aria-hidden="true" />;
}
