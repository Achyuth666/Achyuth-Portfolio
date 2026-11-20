import { describe, expect, it } from "vitest";

import { assertOneItalicWord, countItalic, parseEmphasis, plainText } from "../emphasis";

describe("parseEmphasis", () => {
  it("splits plain and italic segments", () => {
    expect(parseEmphasis("Selected *work*.")).toEqual([
      { text: "Selected ", italic: false },
      { text: "work", italic: true },
      { text: ".", italic: false },
    ]);
  });

  it("keeps an unmatched asterisk as text", () => {
    const segs = parseEmphasis("5 * 3 rules");
    expect(countItalic(segs)).toBe(0);
    expect(plainText(segs)).toBe("5 * 3 rules");
  });

  it("returns the plain string for screen readers", () => {
    expect(plainText(parseEmphasis("I build AI that *ships*."))).toBe("I build AI that ships.");
  });
});

describe("assertOneItalicWord", () => {
  it("accepts exactly one italic word", () => {
    expect(() => assertOneItalicWord("Two teams, real *users*.")).not.toThrow();
  });

  it.each(["No italics here", "*Two* italic *words*", "An *italic phrase* is not a word"])(
    "rejects %s",
    (title) => {
      expect(() => assertOneItalicWord(title)).toThrow(/exactly one italic word/);
    },
  );
});
