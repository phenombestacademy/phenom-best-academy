import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({
  kicker,
  title,
  lede,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line bg-navy-deep text-cream", className)}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.12] text-cream sm:text-5xl">
          {title}
        </h1>
        {lede ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/80 sm:text-lg">{lede}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16", className)}>
      {children}
    </section>
  );
}
