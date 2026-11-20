import { describe, expect, it } from "vitest";

import { skewFromVelocity, tiltFromPointer } from "../motion";

const rect = { left: 0, top: 0, width: 200, height: 100 };

describe("tiltFromPointer", () => {
  it("is flat at the centre", () => {
    const t = tiltFromPointer({ x: 100, y: 50 }, rect, 8);
    expect(t.rx).toBeCloseTo(0);
    expect(t.ry).toBeCloseTo(0);
    expect(t).toMatchObject({ px: 0.5, py: 0.5 });
  });

  it("tips toward the corner the pointer is in, capped at max", () => {
    const t = tiltFromPointer({ x: 200, y: 0 }, rect, 8);
    expect(t.ry).toBe(8); // right edge turns toward the viewer
    expect(t.rx).toBe(8); // top edge tips back
  });

  it("clamps pointers outside the card", () => {
    const t = tiltFromPointer({ x: -500, y: 900 }, rect, 8);
    expect(t).toEqual({ rx: -8, ry: -8, px: 0, py: 1 });
  });
});

describe("skewFromVelocity", () => {
  it("is zero at rest and signed with direction", () => {
    expect(skewFromVelocity(0)).toBe(0);
    expect(skewFromVelocity(1200)).toBeGreaterThan(0);
    expect(skewFromVelocity(-1200)).toBeLessThan(0);
  });

  it("saturates below the max however fast the scroll", () => {
    expect(Math.abs(skewFromVelocity(1e6, 10))).toBeLessThanOrEqual(10);
    expect(skewFromVelocity(1e6, 10)).toBeGreaterThan(9.9);
  });
});
