"use client";

import { useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react";

import { cn } from "@/lib/cn";
import { tiltFromPointer } from "@/lib/motion";

type TiltCardProps = ComponentPropsWithoutRef<"div"> & {
  /** Max rotation in degrees on each axis. */
  max?: number;
};

/**
 * A card that tilts toward the pointer in 3D and carries a pearl and champagne glare
 * where the light would catch it. Fine pointers only; reduced motion keeps it flat.
 */
export function TiltCard({ max = 8, className, children, style, ...rest }: TiltCardProps) {
  const el = useRef<HTMLDivElement | null>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const node = el.current;
    if (!node || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = node.getBoundingClientRect();
    const t = tiltFromPointer({ x: e.clientX, y: e.clientY }, r, max);
    node.style.transition = "transform 120ms var(--ease-ink-out)";
    node.style.transform = `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(1.015)`;
    node.style.setProperty("--glare-x", `${t.px * 100}%`);
    node.style.setProperty("--glare-y", `${t.py * 100}%`);
    node.style.setProperty("--glare", "1");
  };

  const leave = () => {
    const node = el.current;
    if (!node) return;
    node.style.transition = "transform 600ms var(--ease-ink-out)";
    node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    node.style.setProperty("--glare", "0");
  };

  return (
    <div
      ref={el}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("relative h-full [transform-style:preserve-3d] will-change-transform", className)}
      style={style}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] mix-blend-screen transition-opacity duration-300 ease-out"
        style={{
          opacity: "var(--glare, 0)",
          background:
            "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), color-mix(in oklab, var(--pearl) 45%, transparent), color-mix(in oklab, var(--hover-2) 22%, transparent) 30%, transparent 60%)",
        }}
      />
    </div>
  );
}
