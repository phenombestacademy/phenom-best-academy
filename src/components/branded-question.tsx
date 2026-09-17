import type { ReactNode } from 'react';

export function BrandedQuestion({
  number,
  children,
  options,
  explanation,
  showAnswer,
}: {
  number: number;
  children: ReactNode;
  options?: string[];
  explanation?: string;
  showAnswer?: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-white p-5">
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.045]" aria-hidden="true">
        <span className="rotate-[-22deg] font-display text-3xl font-bold uppercase tracking-[0.18em] text-navy-deep sm:text-5xl">Phenom Best Academy</span>
      </div>
      <div className="relative z-10 flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-deep text-xs font-bold text-cream">{number}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            <img src="/brand/mark-clear.png" alt="" className="h-4 w-4 object-contain" />
            Phenom Best Academy
          </div>
          <div className="text-base font-medium leading-relaxed text-navy-deep">{children}</div>
          {options?.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2">{options.map((option, i) => <div key={`${i}-${option}`} className="rounded-xl border border-line bg-cream px-3 py-2 text-sm">{String.fromCharCode(65+i)}. {option}</div>)}</div> : null}
          {showAnswer && explanation ? <div className="mt-4 rounded-xl border border-green/20 bg-green/5 p-4 text-sm"><strong>Answer / learning note:</strong> {explanation}</div> : null}
        </div>
      </div>
    </section>
  );
}
