export const THEME_KEY = "theme";
export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = "light" | "dark";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && (THEME_PREFERENCES as readonly string[]).includes(value);
}

/** Reads the theme preference out of a `document.cookie`-style string. */
export function parseThemeCookie(cookie: string | null | undefined): ThemePreference | null {
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [rawName, ...rest] = part.split("=");
    if (rawName?.trim() !== THEME_KEY) continue;
    let value: string;
    try {
      value = decodeURIComponent(rest.join("=").trim());
    } catch {
      return null;
    }
    return isThemePreference(value) ? value : null;
  }
  return null;
}

export function serializeThemeCookie(theme: ThemePreference): string {
  return `${THEME_KEY}=${encodeURIComponent(theme)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (preference === "system") return systemDark ? "dark" : "light";
  return preference;
}

/**
 * Runs in <head> before first paint (Next 16 "preventing flash" pattern): the
 * cookie is read on the client so every page stays statically prerendered.
 * It also adds `js` to <html> so reveal animations only hide content when
 * JavaScript is there to show it again.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var m=document.cookie.match(/(?:^|; )${THEME_KEY}=([^;]*)/);var c=m?decodeURIComponent(m[1]):null;var s=null;try{s=localStorage.getItem("${THEME_KEY}")}catch(e){}var p=c||s||"system";if(c&&c!==s){try{localStorage.setItem("${THEME_KEY}",c)}catch(e){}}var r=p==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;if(r!=="light"&&r!=="dark")r="light";d.setAttribute("data-theme",r);d.style.colorScheme=r}catch(e){}})()`;
