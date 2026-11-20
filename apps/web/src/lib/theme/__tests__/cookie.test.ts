import { describe, expect, it } from "vitest";

import { parseThemeCookie, resolveTheme, serializeThemeCookie, themeInitScript } from "../cookie";

describe("parseThemeCookie", () => {
  it("reads the theme among other cookies", () => {
    expect(parseThemeCookie("a=1; theme=dark; b=2")).toBe("dark");
  });

  it("ignores unknown values and other names", () => {
    expect(parseThemeCookie("theme=purple")).toBeNull();
    expect(parseThemeCookie("mytheme=dark")).toBeNull();
    expect(parseThemeCookie("")).toBeNull();
    expect(parseThemeCookie(undefined)).toBeNull();
  });

  it("survives malformed encoding", () => {
    expect(parseThemeCookie("theme=%E0%A4%A")).toBeNull();
  });

  it("round-trips with serializeThemeCookie", () => {
    const [pair] = serializeThemeCookie("system").split(";");
    expect(parseThemeCookie(pair)).toBe("system");
    expect(serializeThemeCookie("light")).toMatch(/Path=\/; Max-Age=\d+; SameSite=Lax/);
  });
});

describe("resolveTheme", () => {
  it("follows the system only for the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });
});

describe("themeInitScript", () => {
  it("applies the cookie theme to <html> before paint", () => {
    document.cookie = "theme=dark; path=/";
    document.documentElement.removeAttribute("data-theme");
    new Function(themeInitScript)();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("js")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
