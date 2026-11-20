# DESIGN — "Latent Space" design system

Phase 1, step 2. Direction locked with `ui-ux-pro-max` (`--design-system "portfolio editorial
monochrome minimal"`, plus `typography` and `style` searches). The database's picks are a starting
point; `CLAUDE.md` design laws override them (see "What we took, what we rejected").

## Style: Editorial monochrome

A printed object, not an app. Ink on warm paper, set like a magazine: a big serif display with one
italic word, a tight grotesk for interface, mono for metadata. Texture (grain, glass) replaces
colour. Emphasis comes from **scale, weight, italics and inversion** — a black block on paper, or a
paper block on ink.

Closest database styles: **E-Ink / Paper** (paper ground, grain, monochrome, high contrast) crossed
with **Minimalism & Swiss** (grid, hairlines, no shadows) and **Editorial Grid / Magazine**
(oversized display type, asymmetric grid).

### What we took, what we rejected

| `ui-ux-pro-max` output | Decision |
| --- | --- |
| Minimalism & Swiss: grid, hairlines, no shadows, low performance cost | **Taken** |
| E-Ink / Paper: grain texture, paper ground, print-friendly | **Taken** (and Recruiter Mode is print-ready) |
| E-Ink: "dark mode not recommended", "no animation" | **Rejected**: both themes are first-class; motion is restrained, not absent |
| Palette `#18181B` / `#FAFAFA` / accent `#2563EB` / destructive `#DC2626` | **Rejected**: only `#0A0A0A` and `#F5F3EE`. Errors use inversion + an icon + text, never red |
| Pairing "Minimalist Monochrome Editorial": Playfair Display + Source Serif 4 + JetBrains Mono, no sans | **Partly**: keep the triple stack idea (display / UI / mono) but swap every face (below) |
| Playfair Display 900, tracking-tighter | **Rejected**: overused, and its italic is too ornate. Display stays at regular weight |
| GSAP `back.out(1.4)` stagger | **Rejected** for UI (overshoot reads as sloppy here). Strong ease-out curves instead |
| Checklist: 4.5:1 contrast, visible focus, 44px targets, reduced motion, 375–1440 checks | **Taken** |

## Colour

Two hex values exist in the whole codebase. They live in `globals.css` and nowhere else.

| Token | Value |
| --- | --- |
| `--ink` | `#0A0A0A` |
| `--paper` | `#F5F3EE` |

**Themes swap roles.** Components never say "ink" or "paper"; they say foreground/background.

| Semantic token | Paper theme (light) | Ink theme (dark) |
| --- | --- | --- |
| `--bg` | paper | ink |
| `--fg` | ink | paper |

**Greys come only from opacity of `--fg` over `--bg`** (via `color-mix(in oklab, var(--fg) N%, transparent)`).
The ladder, with measured contrast against the background:

| Step | Use | Contrast (paper / ink theme) |
| --- | --- | --- |
| `fg` (100) | Headlines, body | 17.9 : 1 / 17.9 : 1 |
| `fg/80` | Secondary body | 10.5 / 11.4 |
| `fg/60` | **Minimum for any text** (captions, labels) | 5.1 / 6.7 (AA) |
| `fg/40` | Disabled text, large decorative numerals only | 2.7 / 3.5 (not for body) |
| `fg/24` | Strong hairline, input borders (3:1 non-text not required for decorative rules) | — |
| `fg/12` | Hairlines, dividers | — |
| `fg/6` | Glass fill, hover wash | — |
| `fg/3` | Grain intensity, subtle zebra | — |

Inversion (`bg-fg text-bg`) is the only "accent": primary buttons, selected chips, the active nav
item, focus rings and the cursor.

**Focus ring:** 2px solid `--fg` with a 2px `--bg` offset — visible on both themes and on
inverted blocks.

## Typography

| Role | Face | Why |
| --- | --- | --- |
| Display | **Instrument Serif** (400 + real italic) | Condensed editorial serif with a beautiful true italic; free via `next/font/google`; not an AI default |
| UI / body | **Geist Sans** (variable) | Sharp grotesk, neutral, excellent at small sizes |
| Labels, data, code | **Geist Mono** | Metadata, eyebrows, stack chips, the API-request form |

Rules:

- **Every display headline has exactly one italic word.** `SectionHeading` enforces this in
  development (it throws on 0 or 2+ italic segments).
- Display is weight 400 only; scale carries hierarchy. UI caps at 600. No 900 anywhere.
- Mono labels: **sentence case**, `0.02em` tracking, 12px. No tracked-out all-caps eyebrows (a
  generated-page tell); a label appears only when it carries information. Never body text in mono.
- `text-wrap: balance` on headings, `pretty` on paragraphs. No orphans.

### Type scale (fluid, mobile → desktop)

| Token | Face | Size | Leading | Tracking |
| --- | --- | --- | --- | --- |
| `display-xl` | Serif | clamp(3.5rem → 9rem) | 0.92 | −0.02em |
| `display-lg` | Serif | clamp(2.75rem → 6rem) | 0.95 | −0.015em |
| `display-md` | Serif | clamp(2.25rem → 4rem) | 1.0 | −0.01em |
| `display-sm` | Serif | clamp(1.75rem → 2.5rem) | 1.05 | −0.005em |
| `title` | Sans 500 | 1.25rem | 1.4 | −0.01em |
| `body-lg` | Sans 400 | 1.125rem | 1.6 | 0 |
| `body` | Sans 400 | 1rem | 1.6 | 0 |
| `body-sm` | Sans 400 | 0.875rem | 1.5 | 0 |
| `label` | Mono 500 | 0.75rem | 1.3 | 0.02em, sentence case |

## Space, radius, lines

- **Spacing** uses Tailwind's 4px scale, restricted to: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80,
  96 px (from `landing-page-design` B2). Section rhythm: 96px desktop / 64px mobile.
- **Radius:** `--radius-sm` 6px (chips, inputs), `--radius-md` 12px (buttons), `--radius-lg` 20px
  (cards), `--radius-full` for pills. Nested radius = outer − gap.
- **Hairline:** 1px `fg/12`. Strong hairline `fg/24`. Borders go all the way round.
- **No shadows.** Depth comes from glass and hairlines.

## Texture

- **Grain:** a fixed, `pointer-events-none` SVG `feTurbulence` overlay, `opacity: 0.035`,
  `mix-blend-mode: multiply` (paper) / `screen` (ink). Static (no animated grain = no repaint cost).
  Hidden in print.
- **Frosted glass:** `background: fg/6`, `backdrop-filter: blur(24px) saturate(1)`, 1px `fg/12`
  hairline, radius-lg. Falls back to `fg/6` on `bg/92` where `backdrop-filter` is unsupported.

## Motion

Emil Kowalski's rules; tuned with `animate`.

| Token | Value | Use |
| --- | --- | --- |
| `--ease-ink-out` (Tailwind `ease-out`) | `cubic-bezier(0.23, 1, 0.32, 1)` | Everything entering or responding |
| `--ease-ink-in-out` (Tailwind `ease-in-out`) | `cubic-bezier(0.77, 0, 0.175, 1)` | Movement already on screen |
| `--dur-press` | 120ms | Button press scale (0.97) |
| `--dur-ui` | 200ms | Hover, toggles, chips |
| `--dur-reveal` | 600ms | Scroll reveals, split text (once only) |
| `--dur-spill` | 900ms | Ink-spill theme switch |
| `--dur-fade` | 200ms | Reduced-motion theme cross-fade |

- Never animate ⌘K opening, typing, or anything used 100+ times a day.
- Animate only `transform`, `opacity`, `clip-path`/mask.
- Hover effects only under `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion: reduce` → no movement; opacity only, or nothing.

## Components (Phase 1 primitives)

| Component | Notes |
| --- | --- |
| `FrostedCard` | Glass surface; `as` prop; optional `inverted` |
| `HairlineBorder` | Wraps content in a 1px `fg/12` box; `strong` variant `fg/24` |
| `MagneticButton` | Pulls toward the pointer (max 8px, spring back); `primary` = inverted block, `secondary` = hairline; `asChild`-style `href` support; press scale 0.97 |
| `InvertCursor` | `mix-blend-mode: difference` dot that grows over links/buttons; fine pointers only; off under reduced motion |
| `SplitText` | Line/word rise-and-fade on first view; screen readers get the plain string |
| `Marquee` | CSS-only infinite strip; the strip is focusable and pauses on hover or focus (WCAG 2.2.2), static under reduced motion |
| `BentoGrid` | 6-col grid → 1 col on mobile; `BentoItem` with col/row spans |
| `SectionHeading` | Mono eyebrow + serif display with one italic word (`"Selected *work*"` syntax) |
| `Badge` | Mono chip: `outline` (hairline) / `solid` (inverted) |
| `ThemeToggle` | The ink spill (see below) |

## Theme switch: the ink spill

- `next-themes` (`attribute="data-theme"`, `defaultTheme="system"`), mirrored into a `theme`
  cookie. A blocking `<head>` script reads the cookie and sets `data-theme` before first paint.
  The server does **not** call `cookies()`: under Cache Components that would make every page
  dynamic (Next 16 "Preventing flash" guide), and the script gives the same no-flash result
  while pages stay static.
- Toggle → `document.startViewTransition()` → the new snapshot is revealed through an SVG mask
  whose fractal edge (turbulence-displaced circle plus tendrils and droplets) grows from the toggle's
  centre over 900ms on `--ease-in-out`.
- Reduced motion → 200ms cross-fade. No View Transitions → instant swap.
- The geometry (`src/lib/theme/ink.ts`) is adapted from kedhareswer's MIT component; the clip-path
  is redrawn per frame on `::view-transition-new(root)` instead of rendering the page twice.
- `useThemeTransition()` exposes `{ theme, resolvedTheme, toggle(origin?), setTheme, isTransitioning, subscribe }`
  so WebGL scenes can tween their uniforms in sync.

## Review notes (Phase 1)

- `/style` shows every primitive in a forced paper panel and a forced ink panel side by side,
  plus a frozen row of button states (rest, hover, focus, pressed, disabled).
- Below `lg` the section nav becomes a second, horizontally scrolling glass row (44px targets).

## Accessibility floor

AA contrast (text never below `fg/60`), 44×44 touch targets, visible focus on every surface,
skip link, keyboard-reachable everything, `aria-hidden` on decorative grain/cursor/marquee clones,
no information conveyed by tone alone.
