import type { CSSProperties } from "react";

const POOLS = [
  { color: "var(--film-1)", size: "42%", top: "-8%", left: "-6%", duration: 24 },
  { color: "var(--film-2)", size: "38%", top: "30%", left: "48%", duration: 28 },
  { color: "var(--film-3)", size: "30%", top: "58%", left: "6%", duration: 20 },
] as const;

/**
 * Three blurred film-coloured pools that drift slowly behind a grid of glass
 * tiles, so the glass has colour to frost and refract. Decorative, behind
 * content, still under reduced motion. Place inside a `relative` parent.
 */
export function FilmPools() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {POOLS.map((p, i) => (
        <span
          key={i}
          className="film-pool aspect-square"
          style={
            {
              background: p.color,
              width: p.size,
              top: p.top,
              left: p.left,
              "--pool-duration": `${p.duration}s`,
              animationDelay: `${-i * 6}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
