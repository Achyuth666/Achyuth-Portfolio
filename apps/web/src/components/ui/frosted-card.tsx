import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

type FrostedCardProps<T extends ElementType> = {
  as?: T;
  /** Inverted: a solid foreground block instead of glass, for the strongest emphasis on a surface. */
  inverted?: boolean;
  padding?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const PADDING = { sm: "p-4", md: "p-6", lg: "p-8 md:p-10" } as const;

/** Frosted glass: fg/6 fill, 24px blur, a hairline that turns to spinning film on hover. */
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
        "gloss",
        inverted ? "bg-fg text-bg" : "glass film-border [--surface:color-mix(in_oklab,var(--fg)_6%,transparent)]",
        PADDING[padding],
        className,
      )}
      {...rest}
    />
  );
}
