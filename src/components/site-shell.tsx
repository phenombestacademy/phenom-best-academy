import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  Home,
  Menu,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { academy } from "@/lib/academy";
import { cn } from "@/lib/utils";

const desktopNav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/programmes", label: "Programmes" },
  { to: "/leadership", label: "Leadership" },
  { to: "/contact", label: "Contact" },
  { to: "/careers", label: "Careers" },
] as const;

const moreLinks = [
  { to: "/about", label: "About the Academy" },
  { to: "/programmes", label: "Programmes & languages" },
  { to: "/leadership", label: "Leadership" },
  { to: "/contact", label: "Contact" },
  { to: "/careers", label: "Careers" },
] as const;

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useActivePath();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-navy-mid/40 bg-navy-deep text-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Phenom Best Academy home">
            <BrandMark className="h-9 sm:hidden" />
            <BrandWordmark className="hidden h-9 sm:block lg:h-10" />
            <span className="min-w-0 truncate font-display text-lg font-semibold tracking-tight text-cream sm:hidden">
              Phenom Best
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {desktopNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive(pathname, item.to)
                    ? "bg-navy-mid text-cream"
                    : "text-ivory/80 hover:bg-navy-mid/70 hover:text-cream",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/enquire">Make an enquiry</Link>
            </Button>
            <Button asChild size="sm" variant="cream" className="sm:hidden">
              <Link to="/enquire">Enquire</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-navy-mid bg-navy-deep text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandWordmark className="h-12" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
              {academy.motto}. {academy.tagline}
            </p>
            <p className="mt-4 text-xs tracking-wide text-ivory/55">
              RC {academy.rc} · TIN {academy.tin}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              {desktopNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-ivory/80 hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/path" className="text-ivory/80 hover:text-cream">
                  Find your path
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-ivory/80">
              {academy.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="hover:text-cream">
                    {email}
                  </a>
                </li>
              ))}
              {academy.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="hover:text-cream">
                    {p.display}
                  </a>
                </li>
              ))}
              <li>{academy.location}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-mid">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>{academy.copyright}</p>
            <p>A multidisciplinary education and professional services academy.</p>
          </div>
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="App"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          <Tab to="/" icon={Home} label="Home" active={pathname === "/"} />
          <Tab
            to="/services"
            icon={BookOpen}
            label="Services"
            active={pathname.startsWith("/services")}
          />
          <Tab to="/path" icon={Compass} label="Path" active={pathname === "/path"} />
          <Tab to="/enquire" icon={Send} label="Enquire" active={pathname === "/enquire"} />
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cn(
                "flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium",
                moreOpen ? "text-orange" : "text-muted",
              )}
            >
              <Menu className="size-5" strokeWidth={1.7} />
              More
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy-deep/55"
            onClick={() => setMoreOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="More"
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-cream px-5 pb-28 pt-4 shadow-card"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xl font-semibold">Explore the Academy</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex size-11 items-center justify-center rounded-md text-ink"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="divide-y divide-line">
              {moreLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex min-h-14 items-center text-base font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Tab({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
          active ? "text-orange" : "text-muted",
        )}
      >
        <Icon className="size-5" strokeWidth={1.7} />
        {label}
      </Link>
    </li>
  );
}
