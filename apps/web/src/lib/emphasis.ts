export type EmphasisSegment = { text: string; italic: boolean };

/**
 * Splits headline copy written as `"Selected *work*"` into plain and italic
 * segments. Asterisks are the only markup; an unmatched `*` is kept as text.
 */
export function parseEmphasis(source: string): EmphasisSegment[] {
  const segments: EmphasisSegment[] = [];
  const pattern = /\*([^*]+)\*/g;
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    const index = match.index;
    if (index > last) segments.push({ text: source.slice(last, index), italic: false });
    segments.push({ text: match[1] ?? "", italic: true });
    last = index + match[0].length;
  }
  if (last < source.length) segments.push({ text: source.slice(last), italic: false });
  return segments;
}

export function countItalic(segments: EmphasisSegment[]): number {
  return segments.filter((s) => s.italic).length;
}

/** The plain string a screen reader should hear. */
export function plainText(segments: EmphasisSegment[]): string {
  return segments.map((s) => s.text).join("");
}

/**
 * Design law 4: every display headline has exactly one italic word.
 * Throws so a bad headline fails the build instead of shipping.
 */
export function assertOneItalicWord(source: string): EmphasisSegment[] {
  const segments = parseEmphasis(source);
  const italics = segments.filter((s) => s.italic);
  if (italics.length !== 1 || /\s/.test(italics[0]?.text.trim() ?? "")) {
    throw new Error(
      `Headline "${source}" must contain exactly one italic word (wrap it in *asterisks*).`,
    );
  }
  return segments;
}
