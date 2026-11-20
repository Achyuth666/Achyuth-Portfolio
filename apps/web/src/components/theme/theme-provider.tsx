"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import {
  THEME_KEY,
  isThemePreference,
  serializeThemeCookie,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme/cookie";
import {
  chooseMode,
  durationFor,
  originFrom,
  runThemeTransition,
  type ThemeTransitionEvent,
} from "@/lib/theme/transition";

export type ThemeOrigin = Element | { x: number; y: number } | null | undefined;
export type ThemeTransitionListener = (event: ThemeTransitionEvent) => void;

export type ThemeTransitionContextValue = {
  /** The stored preference: light, dark or system. */
  theme: ThemePreference;
  /** What is actually on screen. */
  resolvedTheme: ResolvedTheme;
  /** Flip light ↔ dark, spilling ink from `origin` (an element or a viewport point). */
  toggle: (origin?: ThemeOrigin) => void;
  /** Set a preference, with the same spill when the visible theme changes. */
  setTheme: (theme: ThemePreference, origin?: ThemeOrigin) => void;
  isTransitioning: boolean;
  /** Listen for start/end of every theme swap (WebGL scenes sync uniforms here). Returns an unsubscribe. */
  subscribe: (listener: ThemeTransitionListener) => () => void;
};

const ThemeTransitionContext = createContext<ThemeTransitionContextValue | null>(null);

// next-themes renders an inline <script>; React 19 warns about script tags rendered
// on the client, so it is inert text on the client (Next 16 "preventing flash" guide).
const scriptProps = {
  type: typeof window === "undefined" ? "text/javascript" : "text/plain",
} as const;

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      storageKey={THEME_KEY}
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      <ThemeTransitionBridge>{children}</ThemeTransitionBridge>
    </NextThemesProvider>
  );
}

function readResolved(): ResolvedTheme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ThemeTransitionBridge({ children }: { children: ReactNode }) {
  const next = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const busy = useRef(false);
  const listeners = useRef(new Set<ThemeTransitionListener>());

  const preference: ThemePreference = isThemePreference(next.theme) ? next.theme : "system";
  const resolvedTheme: ResolvedTheme = next.resolvedTheme === "dark" ? "dark" : "light";

  // Mirror the preference into a cookie so the head script restores it before paint.
  useEffect(() => {
    document.cookie = serializeThemeCookie(preference);
  }, [preference]);

  const emit = useCallback((event: ThemeTransitionEvent) => {
    for (const l of listeners.current) l(event);
  }, []);

  const setThemeNext = next.setTheme;

  const setTheme = useCallback(
    (target: ThemePreference, originArg?: ThemeOrigin) => {
      if (busy.current) return;
      const from = readResolved();
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const to: ResolvedTheme = target === "system" ? (systemDark ? "dark" : "light") : target;

      const apply = () => {
        flushSync(() => setThemeNext(target));
        // next-themes applies the attribute in an effect; set it here too so the
        // View Transition's "new" snapshot is guaranteed to be the new theme.
        const root = document.documentElement;
        root.setAttribute("data-theme", to);
        root.style.colorScheme = to;
        document.cookie = serializeThemeCookie(target);
      };

      if (from === to) {
        apply();
        return;
      }

      const mode = chooseMode({
        reducedMotion: prefersReducedMotion(),
        supportsViewTransitions: "startViewTransition" in document,
      });
      const origin = originFrom(originArg, window.innerWidth);
      const event = { from, to, mode, duration: durationFor(mode), origin };

      busy.current = true;
      setIsTransitioning(true);
      emit({ phase: "start", ...event });
      void runThemeTransition({ mode, origin, apply }).finally(() => {
        busy.current = false;
        setIsTransitioning(false);
        emit({ phase: "end", ...event });
      });
    },
    [emit, setThemeNext],
  );

  const toggle = useCallback(
    (origin?: ThemeOrigin) => setTheme(readResolved() === "dark" ? "light" : "dark", origin),
    [setTheme],
  );

  const subscribe = useCallback((listener: ThemeTransitionListener) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  const value = useMemo<ThemeTransitionContextValue>(
    () => ({ theme: preference, resolvedTheme, toggle, setTheme, isTransitioning, subscribe }),
    [preference, resolvedTheme, toggle, setTheme, isTransitioning, subscribe],
  );

  return <ThemeTransitionContext.Provider value={value}>{children}</ThemeTransitionContext.Provider>;
}

/**
 * The theme API for the whole app, including WebGL scenes:
 *
 * ```ts
 * const { resolvedTheme, subscribe } = useThemeTransition();
 * useEffect(() => subscribe(({ phase, to, duration }) => {
 *   if (phase === "start") tweenUniform(material.uniforms.uInk, to, duration);
 * }), [subscribe]);
 * ```
 */
export function useThemeTransition(): ThemeTransitionContextValue {
  const ctx = useContext(ThemeTransitionContext);
  if (!ctx) throw new Error("useThemeTransition must be used inside <ThemeProvider>.");
  return ctx;
}
