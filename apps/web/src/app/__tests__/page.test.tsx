import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/theme/theme-provider";
import Home from "../page";

describe("Home", () => {
  it("renders the headline with one italic word", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Achyuth builds AI that");
    expect(heading.querySelectorAll("em")).toHaveLength(1);
  });
});
