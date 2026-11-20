"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type NavItem = { id: string; label: string };

/** Returns the id of the section currently crossing the reading line (40% from the top). */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Writes scroll progress (0..1) to a CSS variable without re-rendering. */
function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
}

type SideNavProps = {
  items: NavItem[];
  /** Short wordmark at the top of the rail. */
  brand: string;
  /** Smaller line under the brand. */
  context?: string;
};

/**
 * The site menu: a vertical rail fixed to the left edge on large screens,
 * with a film bar marking the section in view and a film line that fills as
 * you scroll. Below `lg` it collapses into a menu button (top left) that opens
 * the same vertical list as a drawer from the left.
 */
export function SideNav({ items, brand, context }: SideNavProps) {
  const ids = items.map((i) => i.id);
  const active = useActiveSection(ids);
  const rail = useRef<HTMLElement | null>(null);
  useScrollProgress(rail);

  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    button.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    drawer.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const list = (inDrawer: boolean) => (
    <ol className="flex flex-col gap-1">
      {items.map((item, i) => {
        const current = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={inDrawer ? () => setOpen(false) : undefined}
              aria-current={current ? "location" : undefined}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-[var(--radius-sm)] pl-4 pr-3 transition-colors duration-200 ease-out",
                current ? "text-fg" : "text-fg/60 hover:text-fg",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full transition-[opacity,scale] duration-300 ease-out",
                  current ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0",
                )}
                style={{ background: "linear-gradient(var(--hover-1), var(--hover-2))" }}
              />
              <span className="label w-5 text-fg/60 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="body-sm font-medium">{item.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Large screens: the rail. */}
      <nav
        ref={rail}
        aria-label="Sections"
        className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between border-r border-fg/12 bg-bg/70 px-4 py-8 backdrop-blur-xl lg:flex"
      >
        <a href="#top" className="flex flex-col gap-1 px-4">
          <span className="display-sm leading-none">{brand}</span>
          {context ? <span className="label text-fg/60">{context}</span> : null}
        </a>
        {list(false)}
        <div className="flex items-center gap-3 px-4" aria-hidden="true">
          <span className="relative h-24 w-[3px] overflow-hidden rounded-full bg-fg/12">
            <span
              className="absolute inset-x-0 top-0 h-full origin-top rounded-full"
              style={{
                background: "linear-gradient(var(--hover-1), var(--hover-2))",
                transform: "scaleY(var(--progress, 0))",
              }}
            />
          </span>
          <span className="label text-fg/60">Scroll</span>
        </div>
      </nav>

      {/* Small screens: menu button and drawer. */}
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="side-drawer"
        onClick={() => setOpen((o) => !o)}
        className="glass fixed left-4 top-4 z-[60] inline-flex size-11 items-center justify-center rounded-full lg:hidden"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path
            d={open ? "M6 6l12 12" : "M4 8h16"}
            className="transition-[d] duration-300 ease-out"
          />
          <path d={open ? "M18 6L6 18" : "M4 16h10"} className="transition-[d] duration-300 ease-out" />
        </svg>
      </button>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={close}
      />
      <div
        id="side-drawer"
        ref={drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Sections"
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col gap-10 border-r border-fg/12 bg-bg px-4 pb-8 pt-20 transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col gap-1 px-4">
          <span className="display-sm leading-none">{brand}</span>
          {context ? <span className="label text-fg/60">{context}</span> : null}
        </div>
        {list(true)}
      </div>
    </>
  );
}
