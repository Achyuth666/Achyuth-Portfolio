import { assertOneItalicWord } from "@/lib/emphasis";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** Headline with exactly one *italic* word, e.g. "Selected *work*". Anything else throws. */
  title: string;
  /** Short mono line above the headline. Use only when it carries information (a count, a place, a date). */
  kicker?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm";
  id?: string;
  className?: string;
};

const SIZE = { xl: "display-xl", lg: "display-lg", md: "display-md", sm: "display-sm" } as const;

export function SectionHeading({ title, kicker, as = "h2", size = "lg", id, className }: SectionHeadingProps) {
  const segments = assertOneItalicWord(title);
  const Tag = as;
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {kicker ? <p className="label text-fg/60">{kicker}</p> : null}
      <Tag id={id} className={cn(SIZE[size], "max-w-[16ch]")}>
        {segments.map((s, i) => (s.italic ? <em key={i}>{s.text}</em> : <span key={i}>{s.text}</span>))}
      </Tag>
    </div>
  );
}
