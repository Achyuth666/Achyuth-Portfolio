"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { useThemeTransition } from "@/components/theme/theme-provider";
import type { ThemeTransitionEvent } from "@/lib/theme/transition";

const subscribeNoop = () => () => {};

/** Live view of `useThemeTransition()`: what a WebGL scene would receive. */
export function ThemeReadout() {
  const { theme, resolvedTheme, isTransitioning, subscribe, setTheme } = useThemeTransition();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [last, setLast] = useState<ThemeTransitionEvent | null>(null);

  useEffect(() => subscribe(setLast), [subscribe]);

  const rows: Array<[string, string]> = [
    ["theme", mounted ? theme : "…"],
    ["resolvedTheme", mounted ? resolvedTheme : "…"],
    ["isTransitioning", String(isTransitioning)],
    [
      "last event",
      last
        ? `${last.phase} ${last.from} to ${last.to}, ${last.mode}, ${last.duration}ms from (${Math.round(last.origin.x)}, ${Math.round(last.origin.y)})`
        : "none yet",
    ],
  ];

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[0.8125rem]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-fg/60">{k}</dt>
            <dd className="min-w-0 break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Theme preference">
        {(["light", "dark", "system"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={mounted && theme === t}
            onClick={(e) => setTheme(t, e.currentTarget)}
            className="label h-11 rounded-full px-5 hairline-strong aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {t === "light" ? "Paper" : t === "dark" ? "Ink" : "System"}
          </button>
        ))}
      </div>
    </div>
  );
}
