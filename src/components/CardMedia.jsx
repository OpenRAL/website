import { useReducedMotion } from "framer-motion";
import "./CardMedia.css";

// Renders 1–3 looping videos/gifs at the top of a card. Returns null when
// no paths are supplied, so cards stay text-only until media is added.
export default function CardMedia({ paths = [] }) {
  const reduce = useReducedMotion();
  const items = paths.slice(0, 3);
  if (!items.length) return null;

  return (
    <div className={`card-media n-${items.length}`}>
      {items.map((src, i) =>
        /\.gif(\?|$)/i.test(src) ? (
          <img key={i} src={src} alt="" loading="lazy" />
        ) : (
          <video key={i} src={src} muted loop playsInline autoPlay={!reduce} preload="metadata" />
        )
      )}
    </div>
  );
}
