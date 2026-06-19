import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./Select.css";

/* Accessible select-only listbox (ARIA APG pattern). A combobox button opens a
   listbox popup; focus moves to the list and an aria-activedescendant tracks
   the highlighted option. A hidden input mirrors the value so it submits with
   the form like a native <select>. Fully themeable, unlike a native popup. */
export default function Select({ id, name, options, defaultValue, labelId, required }) {
  const reactId = useId();
  const baseId = id || reactId;
  const listId = `${baseId}-list`;

  const initial = Math.max(0, options.findIndex((o) => o.value === defaultValue));
  const [value, setValue] = useState(options[initial]?.value ?? options[0]?.value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initial < 0 ? 0 : initial);

  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  // close on outside pointer
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // on open: sync active to the selected option and move focus to the list
  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    const raf = requestAnimationFrame(() => listRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the highlighted option in view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`#${baseId}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, baseId]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  };
  const choose = (i) => {
    setValue(options[i].value);
    close();
  };

  const onButtonKeyDown = (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); break;
      case "ArrowUp": e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break;
      case "Home": e.preventDefault(); setActive(0); break;
      case "End": e.preventDefault(); setActive(options.length - 1); break;
      case "Enter":
      case " ": e.preventDefault(); choose(active); break;
      case "Escape": e.preventDefault(); close(); break;
      case "Tab": close(false); break;
      default: break;
    }
  };

  return (
    <div className="lb" ref={rootRef}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={btnRef}
        type="button"
        id={baseId}
        className="lb-button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId ? `${labelId} ${baseId}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="lb-value">{selected?.label}</span>
        <span className={`lb-arrow${open ? " open" : ""}`} aria-hidden="true">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            className="lb-list"
            aria-labelledby={labelId}
            aria-activedescendant={`${baseId}-opt-${active}`}
            onKeyDown={onListKeyDown}
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${baseId}-opt-${i}`}
                role="option"
                aria-selected={o.value === value}
                className={`lb-option${i === active ? " active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
              >
                <span className="lb-check" aria-hidden="true">{o.value === value ? "✓" : ""}</span>
                <span className="lb-option-label">{o.label}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
