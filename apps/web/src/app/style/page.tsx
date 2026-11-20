import type { Metadata } from "next";
import type { ReactNode } from "react";

import { InkSpillToggle } from "@/components/theme/ink-spill-toggle";
import {
  Badge,
  BentoGrid,
  BentoItem,
  FrostedCard,
  HairlineBorder,
  HairlineRule,
  MagneticButton,
  Marquee,
  SectionHeading,
  SplitText,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { ThemeReadout } from "./theme-readout";

export const metadata: Metadata = {
  title: "Style — Latent Space",
  description: "Every token and component of the Latent Space design system, in both themes.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  ["colour", "Colour"],
  ["type", "Type"],
  ["space", "Space and shape"],
  ["surfaces", "Surfaces"],
  ["motion", "Motion"],
  ["components", "Components"],
  ["theme", "Theme switch"],
] as const;

type Theme = "light" | "dark";

// WCAG contrast of fg at each opacity over bg, measured per theme.
const LADDER: ReadonlyArray<{ step: number; use: string; ratio?: Record<Theme, string> }> = [
  { step: 100, use: "Headlines and body", ratio: { light: "17.9 : 1", dark: "17.9 : 1" } },
  { step: 80, use: "Secondary body", ratio: { light: "10.5 : 1", dark: "11.4 : 1" } },
  { step: 60, use: "Smallest text allowed", ratio: { light: "5.1 : 1", dark: "6.7 : 1" } },
  { step: 40, use: "Disabled, large numerals", ratio: { light: "2.7 : 1", dark: "3.5 : 1" } },
  { step: 24, use: "Control borders" },
  { step: 12, use: "Hairlines" },
  { step: 6, use: "Glass, hover wash" },
  { step: 3, use: "Zebra rows" },
];

const TYPE = [
  { token: "display-xl", spec: "Instrument Serif 56 to 144px, leading 0.92", sample: "I build AI that *ships*." },
  { token: "display-lg", spec: "Instrument Serif 44 to 96px, leading 0.95", sample: "Selected *work*." },
  { token: "display-md", spec: "Instrument Serif 36 to 64px, leading 1.0", sample: "Two teams, real *users*." },
  { token: "display-sm", spec: "Instrument Serif 28 to 40px, leading 1.05", sample: "Verified, not *claimed*." },
  { token: "title", spec: "Geist 500, 20px", sample: "Production outbound voice AI" },
  { token: "body-lg", spec: "Geist 400, 18px, leading 1.6", sample: "I build the unglamorous parts too: queues, evals, monitoring, the retry logic nobody demos." },
  { token: "body", spec: "Geist 400, 16px, leading 1.6", sample: "Answers cite their sources and say “I don't know” when the context doesn't cover the question." },
  { token: "body-sm", spec: "Geist 400, 14px, leading 1.5", sample: "Deepgram, ElevenLabs, LiveKit, Redis and FastAPI, handling 300 to 400 calls a month." },
  { token: "label", spec: "Geist Mono 500, 12px", sample: "Bengaluru, open to AI roles" },
] as const;

const SPACE = [2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96] as const;
const RADII = [
  { name: "sm", px: 6, use: "Chips, inputs" },
  { name: "md", px: 12, use: "Buttons" },
  { name: "lg", px: 20, use: "Cards" },
  { name: "full", px: 999, use: "Pills, toggle" },
] as const;

const MOTION = [
  { token: "--dur-press", value: "120ms", use: "Press scale 0.97" },
  { token: "--dur-ui", value: "200ms", use: "Hover, toggles, chips" },
  { token: "--dur-reveal", value: "600ms", use: "Split text, once per page" },
  { token: "--dur-spill", value: "900ms", use: "The ink spill" },
  { token: "--dur-fade", value: "200ms", use: "Reduced-motion theme fade" },
] as const;

const CURVES = [
  { token: "--ease-out", value: "cubic-bezier(0.23, 1, 0.32, 1)", p: [0.23, 1, 0.32, 1], use: "Anything entering or answering a press" },
  { token: "--ease-in-out", value: "cubic-bezier(0.77, 0, 0.175, 1)", p: [0.77, 0, 0.175, 1], use: "Movement already on screen" },
] as const;

const STATES = [
  { name: "Rest", cls: "bg-fg text-bg" },
  { name: "Hover, pulled", cls: "bg-fg text-bg translate-x-[3px] -translate-y-[2px]" },
  { name: "Keyboard focus", cls: "bg-fg text-bg outline-2 outline-offset-3 outline-fg" },
  { name: "Pressed", cls: "bg-fg text-bg scale-[0.97]" },
  { name: "Disabled", cls: "bg-fg text-bg opacity-40" },
] as const;

const STACK = ["LangGraph", "FastAPI", "PyTorch", "MLflow", "DVC", "Kubernetes", "Celery", "Redis", "MongoDB", "LiveKit", "YOLOv8", "Next.js"];

function Section({ id, title, intro, children }: { id: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-fg/12 py-16 md:py-24">
      <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
        <h2 id={`${id}-h`} className="title">
          {title}
        </h2>
        <p className="body max-w-[60ch] text-fg/80">{intro}</p>
      </div>
      {children}
    </section>
  );
}

/** The same content rendered in a forced paper panel and a forced ink panel. */
function ThemePair({
  children,
  className,
}: {
  children: ReactNode | ((theme: Theme) => ReactNode);
  className?: string;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {(["light", "dark"] as const).map((t) => (
        <div
          key={t}
          data-theme={t}
          className={cn("relative min-w-0 overflow-hidden rounded-[var(--radius-lg)] bg-bg text-fg hairline", className)}
        >
          <p className="label absolute right-4 top-4 text-fg/60">{t === "light" ? "Paper" : "Ink"}</p>
          <div className="p-5 pt-12 md:p-8 md:pt-12">{typeof children === "function" ? children(t) : children}</div>
        </div>
      ))}
    </div>
  );
}

function CurvePlot({ p }: { p: readonly [number, number, number, number] }) {
  const [x1, y1, x2, y2] = p;
  const s = 80;
  return (
    <svg viewBox="-4 -4 88 88" className="size-20 shrink-0" aria-hidden="true">
      <rect x="0" y="0" width={s} height={s} fill="none" stroke="currentColor" strokeOpacity="0.12" />
      <path
        d={`M0 ${s} C${x1 * s} ${s - y1 * s} ${x2 * s} ${s - y2 * s} ${s} 0`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function StylePage() {
  return (
    <>
      <header className="sticky top-3 z-40 mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-6xl">
        <div className="glass flex items-center justify-between gap-4 rounded-full py-1.5 pl-5 pr-1.5">
          <a href="#main" className="label whitespace-nowrap">
            Latent Space <span className="text-fg/60">/ style</span>
          </a>
          <nav aria-label="Style sections" className="hidden min-w-0 lg:block">
            <ul className="flex gap-1">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="body-sm rounded-full px-3 py-2 text-fg/80 transition-colors duration-200 ease-out hover:bg-fg/6 hover:text-fg"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <InkSpillToggle />
        </div>
        <nav aria-label="Style sections" className="glass mt-2 overflow-x-auto rounded-full lg:hidden">
          <ul className="flex w-max gap-1 px-2 py-1">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="body-sm inline-flex h-11 items-center rounded-full px-3 text-fg/80">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-8">
        <div className="grid gap-10 pb-16 pt-20 md:pb-24 md:pt-32">
          <p className="label text-fg/60">Design system, phase 1</p>
          <SplitText as="h1" immediate text="Ink, paper and *nothing* else." className="display-xl max-w-[12ch]" />
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end">
            <p className="body-lg max-w-[56ch] text-fg/80">
              Two tones that swap roles between themes. Every grey is an opacity of the foreground. Emphasis
              comes from weight, italics, scale and inversion. The only colour event is the ink spill: press the
              toggle in the bar above.
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Badge variant="solid">#0A0A0A</Badge>
              <Badge>#F5F3EE</Badge>
            </div>
          </div>
        </div>

        <Section
          id="colour"
          title="Colour"
          intro="Components never name ink or paper. They use bg and fg, and greys come from fg at a fixed opacity. Text never drops below fg/60, which keeps every surface above AA."
        >
          <ThemePair>
            {(t) => (
              <>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex aspect-[5/3] flex-col justify-between rounded-[var(--radius-md)] bg-fg p-4 text-bg">
                <span className="label">fg, {t === "light" ? "#0A0A0A" : "#F5F3EE"}</span>
                <span className="display-sm">{t === "light" ? "Ink" : "Paper"}</span>
              </div>
              <div className="flex aspect-[5/3] flex-col justify-between rounded-[var(--radius-md)] p-4 hairline">
                <span className="label text-fg/60">bg, {t === "light" ? "#F5F3EE" : "#0A0A0A"}</span>
                <span className="display-sm">{t === "light" ? "Paper" : "Ink"}</span>
              </div>
            </div>
            <ul className="mt-6 divide-y divide-fg/12">
              {LADDER.map(({ step, use, ratio }) => (
                <li key={step} className="grid grid-cols-[3rem_4rem_1fr_auto] items-center gap-3 py-2.5">
                  <span className="label">fg/{step}</span>
                  <span
                    className="h-6 rounded-[var(--radius-sm)]"
                    style={{ background: `color-mix(in oklab, var(--fg) ${step}%, transparent)` }}
                  />
                  <span className="body-sm text-fg/80">{use}</span>
                  <span className="label text-fg/60">{ratio?.[t] ?? ""}</span>
                </li>
              ))}
            </ul>
              </>
            )}
          </ThemePair>
        </Section>

        <Section
          id="type"
          title="Type"
          intro="Instrument Serif for display, always at 400 with exactly one italic word. Geist Sans for interface and reading. Geist Mono for labels and data, in sentence case."
        >
          <ul className="divide-y divide-fg/12 border-y border-fg/12">
            {TYPE.map(({ token, spec, sample }) => (
              <li key={token} className="grid gap-3 py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
                <div className="flex flex-col gap-1">
                  <span className="label">{token}</span>
                  <span className="body-sm text-fg/60">{spec}</span>
                </div>
                {token.startsWith("display") ? (
                  <SectionHeading as="h3" size={token.replace("display-", "") as "xl" | "lg" | "md" | "sm"} title={sample} />
                ) : (
                  <p className={cn(token, "max-w-[60ch]")}>{sample}</p>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="space"
          title="Space and shape"
          intro="Twelve spacing steps and nothing between them. Radius grows with the size of the thing it rounds; nested corners use the outer radius minus the gap."
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <ul className="flex flex-col gap-2.5" aria-label="Spacing scale">
              {SPACE.map((px) => (
                <li key={px} className="grid grid-cols-[3rem_1fr] items-center gap-4">
                  <span className="label text-fg/60">{px}px</span>
                  <span className="h-3 rounded-[2px] bg-fg" style={{ width: px * 3 }} />
                </li>
              ))}
            </ul>
            <ul className="grid grid-cols-2 gap-3" aria-label="Radius scale">
              {RADII.map(({ name, px, use }) => (
                <li key={name} className="flex flex-col gap-3">
                  <div className="aspect-[4/3] hairline-strong bg-fg/3" style={{ borderRadius: Math.min(px, 64) }} />
                  <div>
                    <p className="label">radius-{name}</p>
                    <p className="body-sm text-fg/60">
                      {name === "full" ? "Fully round" : `${px}px`}, {use.toLowerCase()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="surfaces"
          title="Surfaces"
          intro="Texture replaces colour. A static film grain sits over everything at 3.5 percent. Glass is fg at 6 percent behind a 24px blur with a hairline. No shadows anywhere."
        >
          <ThemePair>
            <div className="relative">
              <p aria-hidden="true" className="display-xl pointer-events-none absolute -top-4 left-0 select-none text-fg">
                <em>latent</em>
              </p>
              <div className="relative grid gap-3 pt-16 sm:grid-cols-2">
                <FrostedCard>
                  <p className="label text-fg/60">glass</p>
                  <p className="title mt-2">FrostedCard</p>
                  <p className="body-sm mt-1 text-fg/80">fg/6, blur 24px, 1px fg/12</p>
                </FrostedCard>
                <FrostedCard inverted>
                  <p className="label opacity-60">inverted</p>
                  <p className="title mt-2">The only accent</p>
                  <p className="body-sm mt-1 opacity-80">bg on fg, for the one thing that matters</p>
                </FrostedCard>
                <HairlineBorder radius="lg" className="p-6">
                  <p className="label text-fg/60">hairline</p>
                  <p className="title mt-2">HairlineBorder</p>
                  <p className="body-sm mt-1 text-fg/80">1px fg/12, all the way round</p>
                </HairlineBorder>
                <HairlineBorder strong radius="lg" className="p-6">
                  <p className="label text-fg/60">hairline, strong</p>
                  <p className="title mt-2">For controls</p>
                  <p className="body-sm mt-1 text-fg/80">1px fg/24</p>
                </HairlineBorder>
              </div>
            </div>
          </ThemePair>
        </Section>

        <Section
          id="motion"
          title="Motion"
          intro="UI answers in under 300ms. Only the ink spill and the first reveal of a headline take longer. Nothing used dozens of times a day animates, and reduced motion keeps opacity only."
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <ul className="divide-y divide-fg/12 border-y border-fg/12">
              {MOTION.map(({ token, value, use }) => (
                <li key={token} className="grid grid-cols-[9rem_4rem_1fr] items-center gap-4 py-3">
                  <span className="label">{token}</span>
                  <span className="body-sm">{value}</span>
                  <span className="body-sm text-fg/60">{use}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-6">
              {CURVES.map(({ token, value, p, use }) => (
                <li key={token} className="flex items-center gap-5">
                  <CurvePlot p={p} />
                  <div className="min-w-0">
                    <p className="label">{token}</p>
                    <p className="body-sm break-words text-fg/80">{value}</p>
                    <p className="body-sm text-fg/60">{use}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="components"
          title="Components"
          intro="The Phase 1 primitives. Each one is rendered in both themes so contrast and hairlines can be checked side by side. Move a mouse over this section to see the invert cursor."
        >
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h3 className="label text-fg/60">MagneticButton and Badge</h3>
              <ThemePair>
                <div className="flex flex-wrap items-center gap-3">
                  <MagneticButton href="#components">Download resume</MagneticButton>
                  <MagneticButton variant="secondary">Ask my AI</MagneticButton>
                  <MagneticButton variant="ghost" href="#components">
                    Email me
                  </MagneticButton>
                  <MagneticButton disabled>Disabled</MagneticButton>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="solid">Production</Badge>
                  <Badge>LangGraph</Badge>
                  <Badge>FastAPI</Badge>
                  <Badge>Kubernetes</Badge>
                </div>
              </ThemePair>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="label text-fg/60">Button states, frozen for review</h3>
              <ThemePair>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-5">
                  {STATES.map(({ name, cls }) => (
                    <li key={name} className="flex flex-col items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex h-11 items-center rounded-[var(--radius-md)] px-5 text-[0.9375rem] font-medium",
                          cls,
                        )}
                      >
                        Download
                      </span>
                      <span className="label text-fg/60">{name}</span>
                    </li>
                  ))}
                </ul>
              </ThemePair>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="label text-fg/60">SectionHeading and SplitText</h3>
              <ThemePair>
                <SectionHeading kicker="Experience, 2 roles" title="Two teams, real *users*." size="md" as="h4" />
                <HairlineRule className="my-6" />
                <SplitText
                  text="I don't demo AI. I put it *live* and keep it there."
                  className="display-sm max-w-[22ch]"
                />
              </ThemePair>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="label text-fg/60">BentoGrid</h3>
              <BentoGrid>
                <BentoItem cols={4} rows={2}>
                  <FrostedCard className="flex h-full flex-col justify-between gap-8" padding="lg">
                    <p className="label text-fg/60">Building now</p>
                    <p className="display-md max-w-[14ch]">
                      Outbound voice AI, in <em>production</em>.
                    </p>
                  </FrostedCard>
                </BentoItem>
                <BentoItem cols={2}>
                  <FrostedCard inverted className="flex h-full flex-col justify-between gap-6">
                    <p className="label opacity-60">Based in</p>
                    <p className="display-sm">Bengaluru</p>
                  </FrostedCard>
                </BentoItem>
                <BentoItem cols={2}>
                  <HairlineBorder radius="lg" className="flex h-full flex-col justify-between gap-6 p-6">
                    <p className="label text-fg/60">Certified</p>
                    <p className="title">Oracle Generative AI Professional</p>
                  </HairlineBorder>
                </BentoItem>
                <BentoItem cols={3}>
                  <HairlineBorder radius="lg" className="flex h-full flex-col justify-between gap-6 p-6">
                    <p className="label text-fg/60">Off the keyboard</p>
                    <p className="title">Master of Ceremonies at international events</p>
                  </HairlineBorder>
                </BentoItem>
                <BentoItem cols={3}>
                  <HairlineBorder radius="lg" className="flex h-full flex-col justify-between gap-6 p-6">
                    <p className="label text-fg/60">Studying</p>
                    <p className="title">Final-year B.Tech, AI and ML, VIT Bhopal</p>
                  </HairlineBorder>
                </BentoItem>
              </BentoGrid>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="label text-fg/60">Marquee</h3>
              <div className="border-y border-fg/12 py-6">
                <Marquee label="Tools in the stack" duration={45}>
                  {STACK.map((s) => (
                    <span key={s} className="display-sm whitespace-nowrap">
                      {s}
                    </span>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="theme"
          title="Theme switch"
          intro="The new theme spills out of the toggle with a fractal edge, tendrils and droplets in 900ms. Reduced motion gets a 200ms cross-fade. The choice is kept in a cookie and restored before first paint."
        >
          <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-12">
            <div className="flex items-center gap-4">
              <InkSpillToggle />
              <p className="body-sm max-w-[24ch] text-fg/80">Same control as the bar. Spills from wherever it sits.</p>
            </div>
            <FrostedCard>
              <p className="label mb-4 text-fg/60">useThemeTransition()</p>
              <ThemeReadout />
            </FrostedCard>
          </div>
        </Section>
      </main>

      <footer className="mx-auto w-full max-w-6xl border-t border-fg/12 px-4 py-10 md:px-8">
        <p className="body-sm text-fg/60">
          Latent Space design system. Source of truth: <span className="font-mono">docs/DESIGN.md</span>.
        </p>
      </footer>
    </>
  );
}
