import { useLayoutEffect } from "react";

// Height-based masonry for a CSS grid: measures each child and sets its
// grid-row-end span so cards pack tightly by their natural height instead of
// stretching to the tallest card in their row. Recomputes on resize, on any
// card's content change, and once webfonts have loaded.
export function useMasonry(ref, deps = []) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid || typeof ResizeObserver === "undefined") return;

    const layout = () => {
      const cs = getComputedStyle(grid);
      const rowH = parseFloat(cs.gridAutoRows) || 1;
      const gap = parseFloat(cs.rowGap) || 0;
      for (const item of grid.children) {
        const h = item.getBoundingClientRect().height;
        const span = Math.max(1, Math.ceil((h + gap) / (rowH + gap)));
        item.style.gridRowEnd = `span ${span}`;
      }
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(grid);
    for (const item of grid.children) ro.observe(item);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout).catch(() => {});

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
