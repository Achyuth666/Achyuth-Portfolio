import { describe, expect, it } from "vitest";

import { coverRadius, easeSpill, inkPath, makeInk, rimAt } from "../ink";

describe("ink geometry", () => {
  it("is deterministic for a seed", () => {
    expect(makeInk(42)).toEqual(makeInk(42));
    expect(makeInk(42)).not.toEqual(makeInk(43));
  });

  it("eases from 0 to 1 monotonically", () => {
    expect(easeSpill(0)).toBe(0);
    expect(easeSpill(1)).toBeCloseTo(1, 10);
    let prev = 0;
    for (let i = 1; i <= 100; i++) {
      const v = easeSpill(i / 100);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("covers every corner of the viewport at the end of the spill", () => {
    const w = 1440;
    const h = 900;
    const ox = 1380;
    const oy = 40;
    const corners: Array<[number, number]> = [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ];
    for (const seed of [1, 7, 99, 2024]) {
      const ink = makeInk(seed);
      const R = coverRadius(ink, ox, oy, w, h);
      for (const [cx, cy] of corners) {
        const a = Math.atan2(cy - oy, cx - ox);
        expect(rimAt(ink, a, R, 1)).toBeGreaterThanOrEqual(Math.hypot(cx - ox, cy - oy));
      }
    }
  });

  it("draws nothing at progress 0 and a closed path afterwards", () => {
    const ink = makeInk(3);
    expect(inkPath(ink, 10, 10, 500, 0)).toBe("");
    const d = inkPath(ink, 10, 10, 500, 0.5, 90);
    expect(d.startsWith("M")).toBe(true);
    expect(d).toContain("Z");
    expect(d).not.toMatch(/NaN|Infinity/);
  });
});
