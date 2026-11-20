"use client";

import { useEffect, useRef, type ElementType } from "react";

import { cn } from "@/lib/cn";
import { parseEmphasis, plainText } from "@/lib/emphasis";
import { splitWords } from "@/lib/motion";

type SplitTextProps = {
  /** Text to reveal. `*word*` is set in italic. */
  text: string;
  as?: ElementType;
  className?: string;
  /** Reveal on mount instead of when scrolled into view (for above-the-fold headlines). */
  immediate?: boolean;
};

/**
 * Words rise out of their own line box, once, the first time the text is seen.
 * Server-rendered visible; it only hides when JS is present (`html.js`), and
 * reduced motion shows the final state. Screen readers get one plain string.
 */
export function SplitText({ text, as: Tag = "p", className, immediate = false }: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const segments = parseEmphasis(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => el.setAttribute("data-revealed", "");
    if (immediate || !("IntersectionObserver" in window)) {
      const raf = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  let index = 0;
  return (
    <Tag ref={ref} data-split="" className={className} aria-label={plainText(segments)}>
      {segments.map((seg, si) => [
        // Whitespace that opens a segment ("*nothing* else") belongs to no word; keep it.
        /^\s/.test(seg.text) ? <span key={`${si}-lead`} aria-hidden="true">{" "}</span> : null,
        ...splitWords(seg.text).map((word, wi) => {
          const i = index++;
          const trimmed = word.trimEnd();
          const space = word.slice(trimmed.length);
          const inner = seg.italic ? <em>{trimmed}</em> : trimmed;
          return (
            <span key={`${si}-${wi}`} aria-hidden="true">
              <span className="split-word">
                <span className={cn("split-word-inner")} style={{ ["--i" as string]: i }}>
                  {inner}
                </span>
              </span>
              {space}
            </span>
          );
        }),
      ])}
    </Tag>
  );
}
