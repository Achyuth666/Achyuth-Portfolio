import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  /** outline: hairline chip. solid: inverted block, for the one thing that matters in a row. */
  variant?: "outline" | "solid";
};

export function Badge({ variant = "outline", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "label inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3",
        variant === "solid" ? "bg-fg text-bg" : "hairline-strong text-fg/80",
        className,
      )}
      {...rest}
    />
  );
}
