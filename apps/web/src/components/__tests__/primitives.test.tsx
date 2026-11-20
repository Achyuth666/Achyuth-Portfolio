import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge, Marquee, SectionHeading, SplitText } from "@/components/ui";

describe("SectionHeading", () => {
  it("renders exactly one italic word", () => {
    render(<SectionHeading title="Selected *work*." kicker="12 projects" />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h.textContent).toBe("Selected work.");
    expect(h.querySelectorAll("em")).toHaveLength(1);
  });

  it("refuses a headline without one", () => {
    expect(() => render(<SectionHeading title="Selected work" />)).toThrow();
  });
});

describe("SplitText", () => {
  it("exposes one plain label and splits the words", () => {
    render(<SplitText as="h1" text="Ink, paper and *nothing* else." />);
    const h = screen.getByRole("heading", { name: "Ink, paper and nothing else." });
    expect(h.querySelectorAll(".split-word")).toHaveLength(5);
    expect(h.querySelectorAll("em")).toHaveLength(1);
    // The visible text keeps the space after the italic word.
    expect(h.textContent).toBe("Ink, paper and nothing else.");
  });
});

describe("Marquee", () => {
  it("hides the duplicate copy from assistive tech", () => {
    render(
      <Marquee label="Stack">
        <span>FastAPI</span>
      </Marquee>,
    );
    const region = screen.getByRole("region", { name: /^Stack/ });
    expect(region.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });
});

describe("Badge", () => {
  it("inverts for the solid variant", () => {
    render(<Badge variant="solid">Production</Badge>);
    expect(screen.getByText("Production").className).toContain("bg-fg");
  });
});
