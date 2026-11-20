"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

import { useThemeTransition } from "@/components/theme/theme-provider";

// The fluid sim is ~1k lines of WebGL: load it after first paint, never on the server.
const SplashCursor = dynamic(() => import("./splash-cursor"), { ssr: false });

/**
 * Cursor fluid colours: the light hover pair only (pale aqua, champagne, pearl).
 * Deeper film tones muddy into smoke on bone, so they stay out of the fluid.
 */
export const FILM_FLUID = {
  dark: ["#9fe0d6", "#efd08f", "#fbf6ec"],
  light: ["#6fc3b8", "#d8b46a", "#e9c98a"],
} as const;

/** Tuned for a short, clean light trail rather than lingering smoke. */
export const FLUID_TUNING = {
  size: 0.5,
  force: 0.8,
  swirl: 1.2,
  trail: 0.75,
  momentum: 0.6,
  shading: 0,
  colorSpeed: 0.4,
} as const;

function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia("(hover: hover) and (pointer: fine)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function canRun() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    typeof WebGL2RenderingContext !== "undefined"
  );
}

/**
 * The page-wide cursor: a short trail of light fluid (pale aqua, champagne, pearl)
 * that follows the pointer and fades within a second; re-tinted when the theme swaps.
 * Mouse and trackpad only; off for touch, reduced motion and no-WebGL2.
 */
export function FilmCursor() {
  const { resolvedTheme } = useThemeTransition();
  const enabled = useSyncExternalStore(subscribe, canRun, () => false);
  if (!enabled) return null;
  return (
    <SplashCursor
      theme={resolvedTheme}
      colors={[...FILM_FLUID[resolvedTheme]]}
      rainbow={false}
      {...FLUID_TUNING}
      intensity={resolvedTheme === "dark" ? 1.15 : 0.9}
      glow={resolvedTheme === "dark" ? 0.85 : 0}
      quality="medium"
      intro={false}
      zIndex={45}
      className="film-cursor"
    />
  );
}
