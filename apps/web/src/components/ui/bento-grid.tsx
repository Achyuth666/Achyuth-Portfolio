import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

/** Six columns on desktop, two on tablet, one on phones. */
export function BentoGrid({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6 md:auto-rows-[minmax(10rem,auto)]", className)}
      {...rest}
    />
  );
}

const COL = { 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4", 6: "sm:col-span-2 md:col-span-6" } as const;
const ROW = { 1: "", 2: "md:row-span-2" } as const;

type BentoItemProps = ComponentPropsWithoutRef<"div"> & {
  cols?: keyof typeof COL;
  rows?: keyof typeof ROW;
};

export function BentoItem({ cols = 2, rows = 1, className, ...rest }: BentoItemProps) {
  return <div className={cn("min-w-0", COL[cols], ROW[rows], className)} {...rest} />;
}
