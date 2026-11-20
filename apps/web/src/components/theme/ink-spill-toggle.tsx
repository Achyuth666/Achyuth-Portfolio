"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import { useThemeTransition } from "./theme-provider";

const subscribeNoop = () => () => {};

/**
 * The only theme control on the site. Clicking spills the other theme out of
 * this button. The glyph is half-filled ink: it shows the theme you'd get.
 */
export function InkSpillToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggle, isTransitioning } = useThemeTransition();
  // Before hydration the server can't know the theme; render a neutral label.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const label = !mounted ? "Switch theme" : dark ? "Switch to paper theme" : "Switch to ink theme";

  return (
    <button
      type="button"
      onClick={(e) => toggle(e.currentTarget)}
      aria-label={label}
      title={label}
      aria-busy={isTransitioning || undefined}
      data-cursor="grow"
      className={cn(
        "group relative inline-flex size-11 shrink-0 items-center justify-center rounded-full hairline-strong",
        "transition-transform duration-[120ms] ease-out active:scale-[0.94]",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-fg/6",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="overflow-visible">
        <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Ink pooling into the circle; it flips sides under the spill, no extra motion. */}
        <path
          d="M12 3.75a8.25 8.25 0 0 1 0 16.5c-2.1-1.6-3.1-3.9-2.4-6 .5-1.6 2-2.4 2.2-4.1.2-1.9-.9-4.1.2-6.4Z"
          fill="currentColor"
          className="origin-center"
          style={{ transform: dark ? "rotate(180deg)" : undefined }}
        />
      </svg>
    </button>
  );
}
