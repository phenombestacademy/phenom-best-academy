import type { ReactNode } from 'react';

export function BrandedLearningSheet({
  children,
  schoolName,
  schoolLogoUrl,
  premium = false,
}: {
  children: ReactNode;
  schoolName?: string;
  schoolLogoUrl?: string | null;
  premium?: boolean;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card print:shadow-none">
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.055]" aria-hidden="true">
        <div className="rotate-[-24deg] text-center font-display text-4xl font-bold uppercase tracking-[0.18em] text-navy-deep sm:text-6xl">
          Phenom Best Academy
        </div>
      </div>
      <header className="relative z-10 mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={schoolLogoUrl || '/brand/mark-clear.png'} alt="" className="h-9 w-9 rounded-lg object-contain" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy-deep">{schoolName || 'Phenom Best Academy'}</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Powered by Phenom Best Academy</p>
          </div>
        </div>
        {premium && <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-navy-deep">Premium access</span>}
      </header>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 mt-6 border-t border-line pt-3 text-[10px] text-muted">
        Phenom Best Academy • Tranquil Excellence for Global Impact
      </footer>
    </article>
  );
}
