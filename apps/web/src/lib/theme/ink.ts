/**
 * Ink-spill geometry.
 *
 * Adapted from "Ink Spill Theme Switch" by kedhareswer on 21st.dev (MIT):
 * https://21st.dev/@kedhareswer/components/ink-spill-theme-switch
 *
 * A star-shaped ink blot whose rim is fractal noise plus hairline tendrils,
 * with droplets that land just ahead of the front and get swallowed. Pure
 * maths, no DOM, so it can be unit tested and reused by WebGL scenes.
 *
 * Changes from the original: the blot is drawn into a View Transition's
 * `::view-transition-new(root)` clip-path instead of a second React tree,
 * the rim resolution is configurable (360 points by default, enough for a
 * ragged edge at 60fps), and the
 * easing is exported so other scenes can follow the same curve.
 */

export type InkShape = {
  /** [frequency, amplitude, phase, drift] */
  harmonics: number[][];
  /** [angle, width (rad), length (x R), delay (0..1)] */
  tendrils: number[][];
  /** [angle, distance (x Rend), size (x Rend), stretch] */
  drops: number[][];
  /** Deepest the rim can fall below R, as a fraction of R. */
  dip: number;
};

const TAU = Math.PI * 2;
const FREQS = [3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
const ROUGH = 0.22;

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeInk(seed: number): InkShape {
  const r = mulberry32(seed);
  const harmonics = FREQS.map((k) => [
    k,
    (0.6 + r() * 0.8) / Math.pow(k, 0.55),
    r() * TAU,
    (r() - 0.5) * 9,
  ]);
  let sum = 0;
  for (const h of harmonics) sum += h[1] ?? 0;
  for (const h of harmonics) h[1] = ((h[1] ?? 0) * ROUGH) / sum;

  const tendrils: number[][] = [];
  for (let i = 0; i < 70; i++)
    tendrils.push([r() * TAU, 0.005 + r() * 0.018, 0.015 + Math.pow(r(), 1.6) * 0.14, r() * 0.7]);
  for (let i = 0; i < 9; i++)
    tendrils.push([r() * TAU, 0.014 + r() * 0.03, 0.12 + r() * 0.22, r() * 0.45]);

  const drops: number[][] = [];
  for (let i = 0; i < 130; i++)
    drops.push([r() * TAU, 0.05 + r() * 1.0, 0.0012 + Math.pow(r(), 2.6) * 0.009, 1 + r() * 2.2]);

  return { harmonics, tendrils, drops, dip: ROUGH };
}

function wrap(a: number) {
  const m = a % TAU;
  return m > Math.PI ? m - TAU : m < -Math.PI ? m + TAU : m;
}

/** Rim radius at angle `a` for a blot of nominal radius R at progress p. */
export function rimAt(ink: InkShape, a: number, R: number, p: number) {
  let n = 0;
  for (const [freq = 0, amp = 0, phase = 0, drift = 0] of ink.harmonics)
    n += amp * Math.sin(freq * a + phase + drift * p);
  let spike = 0;
  for (const [angle = 0, width = 1, length = 0, delay = 0] of ink.tendrils) {
    const grow = Math.min(1, Math.max(0, (p - delay) / 0.3));
    if (grow <= 0) continue;
    const d = wrap(a - angle) / width;
    if (d > 3 || d < -3) continue;
    spike += length * grow * Math.exp(-d * d);
  }
  return R * (1 + n + spike);
}

/** The radius that guarantees every corner of a w × h box is inked from (ox, oy). */
export function coverRadius(ink: InkShape, ox: number, oy: number, w: number, h: number) {
  const far = Math.max(
    Math.hypot(ox, oy),
    Math.hypot(w - ox, oy),
    Math.hypot(ox, h - oy),
    Math.hypot(w - ox, h - oy),
  );
  return (far / (1 - ink.dip)) * 1.02;
}

/**
 * The spill's easing: a cubic ease-out blended with smoothstep, so the blot
 * bursts out of the toggle, then settles as it reaches the far corner.
 */
export function easeSpill(p: number) {
  const t = Math.min(1, Math.max(0, p));
  const out = 1 - Math.pow(1 - t, 3);
  const smooth = t * t * (3 - 2 * t);
  return out * 0.55 + smooth * 0.45;
}

/** An SVG/CSS path for the blot plus its droplets at progress p, wound clockwise. */
export function inkPath(
  ink: InkShape,
  ox: number,
  oy: number,
  Rend: number,
  p: number,
  steps = 360,
): string {
  const R = Rend * easeSpill(p);
  if (R <= 0.5) return "";
  const parts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU;
    const r = rimAt(ink, a, R, p);
    parts.push((i ? "L" : "M") + (ox + r * Math.cos(a)).toFixed(1) + " " + (oy + r * Math.sin(a)).toFixed(1));
  }
  parts.push("Z");
  for (const [angle = 0, distance = 0, size = 0, stretch = 1] of ink.drops) {
    const dist = distance * Rend;
    const born = (R - dist * 0.8) / (dist * 0.12);
    if (born <= 0) continue;
    const ry = Math.max(0.6, size * Rend * Math.min(1, born));
    const rx = ry * stretch;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = ox + dist * c;
    const y = oy + dist * s;
    const rot = ((angle * 180) / Math.PI).toFixed(1);
    const head = (x + rx * c).toFixed(1) + " " + (y + rx * s).toFixed(1);
    const tail = (x - rx * c).toFixed(1) + " " + (y - rx * s).toFixed(1);
    const radii = rx.toFixed(1) + " " + ry.toFixed(1) + " " + rot;
    parts.push("M" + head + "A" + radii + " 1 1 " + tail + "A" + radii + " 1 1 " + head + "Z");
  }
  return parts.join("");
}
