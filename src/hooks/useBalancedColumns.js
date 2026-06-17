import { useCallback, useLayoutEffect, useRef, useState } from "react";

// Round-robin indices into `cc` columns — a sane initial render at the right
// card width so heights can be measured.
function roundRobin(count, cc) {
  const cols = Array.from({ length: cc }, () => []);
  for (let i = 0; i < count; i++) cols[i % cc].push(i);
  return cols;
}

function colsFor(width) {
  return width <= 560 ? 1 : width <= 1024 ? 2 : 3;
}

// Distributes `count` cards across responsive columns so every column ends at
// the SAME total height — the bento fills a clean rectangle. Cards are measured
// and packed greedily (tallest-first into the shortest column) to minimise the
// slack that `justify-content: space-between` then absorbs. Returns a ref for
// the wrapper, the column assignment, and the shared min-height.
export function useBalancedColumns(count, gap = 14) {
  const ref = useRef(null);
  const [layout, setLayout] = useState(() => ({ cols: roundRobin(count, 3), minH: 0 }));
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const colCountRef = useRef(3);

  const relayout = useCallback(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const cc = colsFor(wrap.clientWidth);

    // column count changed → re-render natural columns at the new width first,
    // then a follow-up pass measures and balances.
    if (cc !== colCountRef.current) {
      colCountRef.current = cc;
      setLayout({ cols: roundRobin(count, cc), minH: 0 });
      return;
    }

    const nodes = wrap.querySelectorAll("[data-feat]");
    if (!nodes.length) return;
    const heights = {};
    nodes.forEach((n) => {
      heights[+n.dataset.feat] = n.getBoundingClientRect().height;
    });

    const order = Array.from({ length: count }, (_, i) => i).sort((a, b) => (heights[b] || 0) - (heights[a] || 0));
    const cols = Array.from({ length: cc }, () => []);
    const sums = new Array(cc).fill(0);
    for (const idx of order) {
      let m = 0;
      for (let c = 1; c < cc; c++) if (sums[c] < sums[m]) m = c;
      cols[m].push(idx);
      sums[m] += (heights[idx] || 0) + gap;
    }
    cols.forEach((c) => c.sort((a, b) => a - b)); // restore reading order within column
    const minH = Math.round(Math.max(0, Math.max(...sums) - gap));

    const prev = layoutRef.current;
    if (prev.minH !== minH || JSON.stringify(prev.cols) !== JSON.stringify(cols)) {
      setLayout({ cols, minH });
    }
  }, [count, gap]);

  useLayoutEffect(() => {
    relayout();
    const wrap = ref.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(relayout);
    ro.observe(wrap);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout).catch(() => {});
    return () => ro.disconnect();
  }, [relayout]);

  return { ref, cols: layout.cols, minH: layout.minH };
}
