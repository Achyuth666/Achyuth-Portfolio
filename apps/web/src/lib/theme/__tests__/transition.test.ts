import { describe, expect, it, vi } from "vitest";

import { FADE_MS, SPILL_MS, chooseMode, durationFor, originFrom, runThemeTransition } from "../transition";

describe("chooseMode", () => {
  it("spills ink by default", () => {
    expect(chooseMode({ reducedMotion: false, supportsViewTransitions: true })).toBe("ink");
  });

  it("cross-fades under reduced motion", () => {
    expect(chooseMode({ reducedMotion: true, supportsViewTransitions: true })).toBe("fade");
  });

  it("swaps instantly without View Transitions", () => {
    expect(chooseMode({ reducedMotion: false, supportsViewTransitions: false })).toBe("instant");
  });
});

describe("durationFor", () => {
  it("matches the design tokens", () => {
    expect(durationFor("ink")).toBe(SPILL_MS);
    expect(SPILL_MS).toBe(900);
    expect(durationFor("fade")).toBe(FADE_MS);
    expect(FADE_MS).toBe(200);
    expect(durationFor("instant")).toBe(0);
  });
});

describe("originFrom", () => {
  it("uses the centre of an element", () => {
    const el = document.createElement("button");
    el.getBoundingClientRect = () => ({ left: 10, top: 20, width: 40, height: 40 }) as DOMRect;
    expect(originFrom(el, 1000)).toEqual({ x: 30, y: 40 });
  });

  it("accepts a point, and falls back to the top-right", () => {
    expect(originFrom({ x: 5, y: 6 }, 1000)).toEqual({ x: 5, y: 6 });
    expect(originFrom(null, 1000)).toEqual({ x: 952, y: 40 });
  });
});

describe("runThemeTransition", () => {
  it("applies immediately in instant mode", async () => {
    const apply = vi.fn();
    await runThemeTransition({ mode: "instant", origin: { x: 0, y: 0 }, apply });
    expect(apply).toHaveBeenCalledOnce();
  });

  it("applies inside a view transition and cleans up after a fade", async () => {
    const apply = vi.fn();
    let modeDuringTransition: string | undefined;
    const start = vi.fn((cb: () => void) => {
      modeDuringTransition = document.documentElement.dataset.vt;
      cb();
      return { ready: Promise.resolve(), finished: Promise.resolve() };
    });
    Object.assign(document, { startViewTransition: start });
    try {
      await runThemeTransition({ mode: "fade", origin: { x: 0, y: 0 }, apply });
    } finally {
      delete (document as { startViewTransition?: unknown }).startViewTransition;
    }
    expect(modeDuringTransition).toBe("fade");
    expect(start).toHaveBeenCalledOnce();
    expect(apply).toHaveBeenCalledOnce();
    expect(document.documentElement.dataset.vt).toBeUndefined();
  });
});
