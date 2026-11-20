"use client";

import { useEffect, useRef } from "react";

import { damp } from "@/lib/motion";

const INTERACTIVE = 'a, button, [role="button"], [data-cursor="grow"], summary, label';
const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"]';

/**
 * A paper-coloured disc with `mix-blend-mode: difference`: it inverts whatever
 * sits under it, so it reads on both themes and on inverted blocks. It grows
 * over interactive elements and hides over text fields (the I-beam wins).
 * The native cursor stays: this is an addition, never a replacement.
 * Fine pointers only, off under reduced motion, and never in print.
 */
export function InvertCursor() {
  const dot = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = dot.current;
    if (!el || !fine.matches || still.matches) return;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let scale = 0;
    let targetScale = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      x = damp(x, tx, 28, dt);
      y = damp(y, ty, 28, dt);
      scale = damp(scale, targetScale, 18, dt);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      const settled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(targetScale - scale) < 0.005;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest(TEXT_ENTRY)) targetScale = 0;
      else if (target?.closest(INTERACTIVE)) targetScale = 2.6;
      else targetScale = 1;
      if (scale === 0 && targetScale > 0) {
        x = tx;
        y = ty;
      }
      wake();
    };
    const onLeave = () => {
      targetScale = 0;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="invert-cursor pointer-events-none fixed left-0 top-0 z-[70] size-4 rounded-full bg-paper mix-blend-difference"
      style={{ transform: "translate3d(-100px, -100px, 0) scale(0)" }}
    />
  );
}
