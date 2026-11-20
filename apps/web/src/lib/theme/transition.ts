import { coverRadius, inkPath, makeInk } from "./ink";
import type { ResolvedTheme } from "./cookie";

/** Ink spill length. Tuned with Emil's `animate`: long enough to read as liquid, short enough not to block. */
export const SPILL_MS = 900;
/** Reduced-motion cross-fade. */
export const FADE_MS = 200;

export type TransitionMode = "ink" | "fade" | "instant";

export type ThemeTransitionEvent = {
  phase: "start" | "end";
  from: ResolvedTheme;
  to: ResolvedTheme;
  mode: TransitionMode;
  /** How long the visual swap takes, so WebGL scenes can tween uniforms in sync. */
  duration: number;
  /** Viewport point the ink spills from. */
  origin: { x: number; y: number };
};

export function chooseMode(opts: { reducedMotion: boolean; supportsViewTransitions: boolean }): TransitionMode {
  if (!opts.supportsViewTransitions) return "instant";
  return opts.reducedMotion ? "fade" : "ink";
}

export function durationFor(mode: TransitionMode): number {
  return mode === "ink" ? SPILL_MS : mode === "fade" ? FADE_MS : 0;
}

/** Centre of an element in viewport coordinates, or the top-right corner as a fallback. */
export function originFrom(from: Element | { x: number; y: number } | null | undefined, viewportWidth: number) {
  if (from && "getBoundingClientRect" in from) {
    const b = from.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  }
  if (from) return { x: from.x, y: from.y };
  return { x: viewportWidth - 48, y: 40 };
}

type StartViewTransition = (cb: () => void) => {
  ready: Promise<void>;
  finished: Promise<void>;
};

/**
 * Swaps the theme inside a View Transition. In `ink` mode the new snapshot is
 * revealed through the ink blot's clip-path, redrawn every frame. The returned
 * promise resolves when the swap is fully on screen.
 */
export async function runThemeTransition(opts: {
  mode: TransitionMode;
  origin: { x: number; y: number };
  apply: () => void;
}): Promise<void> {
  const { mode, origin, apply } = opts;
  const doc = document as Document & { startViewTransition?: StartViewTransition };
  const root = document.documentElement;

  if (mode === "instant" || !doc.startViewTransition) {
    apply();
    return;
  }

  const duration = durationFor(mode);
  root.dataset.vt = mode;
  root.style.setProperty("--vt-duration", `${duration}ms`);

  let style: HTMLStyleElement | null = null;
  if (mode === "ink") {
    style = document.createElement("style");
    style.textContent = `::view-transition-new(root){clip-path:circle(0px at ${origin.x}px ${origin.y}px)}`;
    document.head.appendChild(style);
  }

  const vt = doc.startViewTransition.call(document, apply);

  try {
    await vt.ready;
    if (mode === "ink" && style) {
      const sheet = style;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ink = makeInk((Math.random() * 2 ** 31) | 0);
      const Rend = coverRadius(ink, origin.x, origin.y, w, h);
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const frame = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const d = inkPath(ink, origin.x, origin.y, Rend, p);
          sheet.textContent = d
            ? `::view-transition-new(root){clip-path:path("${d}")}`
            : `::view-transition-new(root){clip-path:circle(0px at ${origin.x}px ${origin.y}px)}`;
          if (p < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
    }
    await vt.finished;
  } catch {
    // Skipped transitions (tab hidden, another transition started) still apply the theme.
  } finally {
    style?.remove();
    delete root.dataset.vt;
    root.style.removeProperty("--vt-duration");
  }
}
