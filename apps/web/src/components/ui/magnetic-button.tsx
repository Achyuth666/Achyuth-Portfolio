"use client";

import { useRef, type ComponentPropsWithoutRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { magneticOffset } from "@/lib/motion";

type Common = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  /** Pull strength (0..1) and cap (px). Keep it small: it should feel like weight, not a toy. */
  strength?: number;
  children: ReactNode;
  className?: string;
};

type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof Common>;
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof Common>;
export type MagneticButtonProps = AsButton | AsLink;

const VARIANT = {
  primary: "bg-fg text-bg",
  secondary: "hairline-strong text-fg [@media(hover:hover)_and_(pointer:fine)]:hover:bg-fg/6",
  ghost: "text-fg underline decoration-fg/24 underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-fg",
} as const;

const SIZE = { md: "h-11 px-5 text-[0.9375rem]", lg: "h-14 px-7 text-base" } as const;

const REST_TRANSITION = "scale 120ms var(--ease-ink-out), background-color 200ms var(--ease-ink-out)";

function canPull() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * A button (or link) that leans toward the pointer and springs back on leave.
 * The label moves a little further than the shell, which reads as depth.
 * Fine pointers only; reduced motion turns the pull off.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const { variant = "primary", size = "md", strength = 0.25, children, className, ...rest } = props;
  const shell = useRef<HTMLElement | null>(null);
  const label = useRef<HTMLSpanElement | null>(null);

  const move = (e: PointerEvent<HTMLElement>) => {
    const el = shell.current;
    if (!el || e.pointerType !== "mouse" || !canPull()) return;
    const o = magneticOffset({ x: e.clientX, y: e.clientY }, el.getBoundingClientRect(), strength, 8);
    el.style.transition = `translate 120ms var(--ease-ink-out), ${REST_TRANSITION}`;
    el.style.translate = `${o.x}px ${o.y}px`;
    if (label.current) label.current.style.translate = `${o.x * 0.5}px ${o.y * 0.5}px`;
  };

  const leave = () => {
    const el = shell.current;
    if (!el) return;
    el.style.transition = `translate 400ms var(--ease-ink-out), ${REST_TRANSITION}`;
    el.style.translate = "0px 0px";
    if (label.current) label.current.style.translate = "0px 0px";
  };

  const classes = cn(
    "relative inline-flex select-none items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium",
    "transition-[scale,background-color] duration-[120ms] ease-out active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-40",
    VARIANT[variant],
    variant === "ghost" ? "h-11 px-1" : SIZE[size],
    className,
  );

  const inner = (
    <span ref={label} className="inline-flex items-center gap-2 transition-[translate] duration-[400ms] ease-out">
      {children}
    </span>
  );

  if (typeof rest.href === "string") {
    const anchorProps = rest as Omit<AsLink, keyof Common>;
    return (
      <a
        ref={(n) => {
          shell.current = n;
        }}
        data-cursor="grow"
        className={classes}
        onPointerMove={move}
        onPointerLeave={leave}
        {...anchorProps}
      >
        {inner}
      </a>
    );
  }

  const buttonProps = rest as Omit<AsButton, keyof Common>;
  return (
    <button
      ref={(n) => {
        shell.current = n;
      }}
      type="button"
      data-cursor="grow"
      className={classes}
      onPointerMove={move}
      onPointerLeave={leave}
      {...buttonProps}
    >
      {inner}
    </button>
  );
}
