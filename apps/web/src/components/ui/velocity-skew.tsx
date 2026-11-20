"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { damp, skewFromVelocity } from "@/lib/motion";

/**
 * Leans its content with scroll speed: fast scrolling skews it like type on a
 * moving press, and it settles back when the page stops. Reduced motion: still.
 */
export function VelocitySkew({ children, max = 10 }: { children: ReactNode; max?: number }) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let target = 0;
    let current = 0;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000) || 1 / 60;
      const y = window.scrollY;
      target = skewFromVelocity((y - lastY) / dt, max);
      lastY = y;
      lastT = now;
      current = damp(current, target, 10, dt);
      node.style.transform = `skewX(${current.toFixed(2)}deg)`;
      if (Math.abs(current) > 0.01 || Math.abs(target) > 0.01) raf = requestAnimationFrame(tick);
      else {
        node.style.transform = "";
        raf = 0;
      }
    };
    const onScroll = () => {
      if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [max]);

  return (
    <div ref={el} className="will-change-transform">
      {children}
    </div>
  );
}
