import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./CookieNotice.css";

const KEY = "openral-cookie-notice";

export default function CookieNotice() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked — just don't show */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="cookie"
          role="dialog"
          aria-label="Cookie notice"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>
            OpenRAL uses <strong>no tracking cookies</strong> — only essential local storage to remember this
            notice. <a href="/privacy">Privacy</a>.
          </p>
          <button type="button" className="cookie-ok" onClick={dismiss}>
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
