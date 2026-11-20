import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds per loop. Slow is calm; this is ambient, not a ticker. */
  duration?: number;
  /** Accessible name for the strip. The duplicate copy is hidden from screen readers. */
  label: string;
  className?: string;
};

/**
 * CSS-only infinite strip. Pauses on hover and on keyboard focus (the strip
 * itself is focusable, so there is always a pause mechanism); static under
 * reduced motion. The content is rendered twice and the track slides by half.
 */
export function Marquee({ children, duration = 40, label, className }: MarqueeProps) {
  return (
    <div
      role="region"
      aria-label={`${label} (focus to pause)`}
      tabIndex={0}
      className={cn("marquee overflow-hidden rounded-[var(--radius-sm)]", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track flex w-max">
        <div className="flex shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
