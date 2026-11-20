import { describe, expect, it } from "vitest";

import { damp, magneticOffset, splitWords } from "../motion";

const rect = { left: 100, top: 100, width: 100, height: 40 };

describe("magneticOffset", () => {
  it("is zero at the centre", () => {
    expect(magneticOffset({ x: 150, y: 120 }, rect)).toEqual({ x: 0, y: 0 });
  });

  it("pulls toward the pointer in proportion to strength", () => {
    expect(magneticOffset({ x: 170, y: 110 }, rect, 0.25)).toEqual({ x: 5, y: -2.5 });
  });

  it("caps the pull on each axis", () => {
    expect(magneticOffset({ x: 400, y: -300 }, rect, 0.25, 8)).toEqual({ x: 8, y: -8 });
  });
});

describe("damp", () => {
  it("moves toward the target without overshooting", () => {
    const v = damp(0, 10, 20, 1 / 60);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(10);
  });

  it("is frame-rate independent", () => {
    const one = damp(0, 10, 20, 1 / 30);
    const two = damp(damp(0, 10, 20, 1 / 60), 10, 20, 1 / 60);
    expect(two).toBeCloseTo(one, 10);
  });
});

describe("splitWords", () => {
  it("keeps trailing whitespace with each word", () => {
    expect(splitWords("Ink, paper  and")).toEqual(["Ink, ", "paper  ", "and"]);
  });
});
