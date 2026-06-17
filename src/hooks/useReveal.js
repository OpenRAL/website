import { useReducedMotion } from "framer-motion";

// Shared whileInView variants. Returns props you can spread onto a
// motion element; collapses to no-op when the user prefers reduced motion.
export function useReveal({ y = 22, delay = 0, duration = 0.7 } = {}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return { initial: false, animate: { opacity: 1, y: 0 } };
  }
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

// Container/child variants for staggered grids.
export function useStagger(stagger = 0.07) {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger } },
  };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      };
  return { container, item };
}
