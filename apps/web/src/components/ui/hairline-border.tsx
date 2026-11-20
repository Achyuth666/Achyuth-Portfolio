import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type HairlineBorderProps = ComponentPropsWithoutRef<"div"> & {
  /** fg/24 instead of fg/12, for inputs and anything that needs to read as a control. */
  strong?: boolean;
  radius?: "none" | "sm" | "md" | "lg";
  /** The hairline turns into rotating film on hover or focus. */
  film?: boolean;
};

const RADIUS = {
  none: "rounded-none",
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
} as const;

/** A 1px all-round hairline. Borders go all the way round or not at all. */
export function HairlineBorder({ strong = false, radius = "md", film = false, className, ...rest }: HairlineBorderProps) {
  return (
    <div
      className={cn(film ? "film-border" : strong ? "hairline-strong" : "hairline", RADIUS[radius], className)}
      {...rest}
    />
  );
}

/** A horizontal rule in the same weight, for separating rows. */
export function HairlineRule({ className }: { className?: string }) {
  return <hr className={cn("h-px border-0 bg-fg/12", className)} />;
}
