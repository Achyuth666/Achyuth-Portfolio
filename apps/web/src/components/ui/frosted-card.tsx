import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

type FrostedCardProps<T extends ElementType> = {
  as?: T;
  /** Inverted: a solid foreground block instead of glass. The only "accent" the system allows. */
  inverted?: boolean;
  padding?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const PADDING = { sm: "p-4", md: "p-6", lg: "p-8 md:p-10" } as const;

/** Frosted monochrome glass: fg/6 fill, 1px fg/12 hairline, 24px blur. */
export function FrostedCard<T extends ElementType = "div">({
  as,
  inverted = false,
  padding = "md",
  className,
  ...rest
}: FrostedCardProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-lg)]",
        inverted ? "bg-fg text-bg" : "glass",
        PADDING[padding],
        className,
      )}
      {...rest}
    />
  );
}
