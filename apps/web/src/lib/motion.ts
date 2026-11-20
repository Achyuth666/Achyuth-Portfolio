/**
 * Magnetic pull: how far an element follows the pointer, as a translate in px.
 * Linear in the pointer's offset from the centre, capped at `max` on each axis
 * so a button never wanders out from under its own label.
 */
export function magneticOffset(
  pointer: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number },
  strength = 0.25,
  max = 8,
): { x: number; y: number } {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));
  return { x: clamp((pointer.x - cx) * strength), y: clamp((pointer.y - cy) * strength) };
}

/** Frame-rate independent exponential smoothing toward a target. */
export function damp(current: number, target: number, lambda: number, dtSeconds: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dtSeconds));
}

/** Splits a string into words, keeping the whitespace that followed each one. */
export function splitWords(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}
