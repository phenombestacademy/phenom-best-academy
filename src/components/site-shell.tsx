import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  Home,
  Menu,
  Send,
  X,
  Bell,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BrandFull, BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { academy } from "@/lib/academy";
import { cn } from "@/lib/utils";
import { getSupabase } from "@/lib/cms";
import { getMyProfile, signOut } from "@/lib/platform";
import {
  getLocale,
  initLocale,
  setLocale,
  supportedLocales,
  startAutoTranslation,
  type SupportedLocale,
} from "@/lib/i18n";
import {
  listActiveAnnouncements,
  listMyNotifications,
  markNotificationRead,
  subscribeEmail,
  type Announcement,
  type UserNotification,
} from "@/lib/notifications";

const desktopNav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/programmes", label: "Programmes" },
  { to: "/leadership", label: "Leadership" },
  { to: "/contact", label: "Contact" },
  { to: "/careers", label: "Careers" },
  { to: "/media", label: "Media & Resources" },
  { to: "/tools", label: "Phenom Tool Hub" },
  { to: "/platform", label: "Platform" },
] as const;

const moreLinks = [
  { to: "/about", label: "About the Academy" },
  { to: "/programmes", label: "Programmes & languages" },
  { to: "/leadership", label: "Leadership" },
  { to: "/contact", label: "Contact" },
  { to: "/careers", label: "Careers" },
  { to: "/media", label: "Media & Resources" },
  { to: "/tools", label: "Phenom Tool Hub" },
  { to: "/platform", label: "Platform" },
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");
  const [locale, setCurrentLocale] =
    useState<SupportedLocale>("en-NG");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    setCurrentLocale(initLocale());
    startAutoTranslation();

    const onChange = () => setCurrentLocale(getLocale());

    window.addEventListener("phenom-locale-change", onChange);

    return () =>
      window.removeEventListener(
        "phenom-locale-change",
        onChange,
      );
  }, []);

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      setIsAuthenticated(false);
      setIsSuperAdmin(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setIsAuthenticated(Boolean(data.session));
      if (!data.session) {
        setIsSuperAdmin(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        if (active) setIsSuperAdmin(profile?.role === 'super_admin');
      } catch {
        if (active) setIsSuperAdmin(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setIsAuthenticated(Boolean(session));

      if (!session) {
        setIsSuperAdmin(false);
        return;
      }

      // Keep the auth callback synchronous so Supabase can finish the
      // auth event immediately. Profile work happens outside the callback
      // and therefore cannot hold up navigation or touch interaction.
      window.setTimeout(() => {
        if (!active) return;

        void getMyProfile()
          .then((profile) => {
            if (active) setIsSuperAdmin(profile?.role === "super_admin");
          })
          .catch(() => {
            if (active) setIsSuperAdmin(false);
          });
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const announcements = await listActiveAnnouncements();
        if (active) setAnnouncements(announcements);

        if (isAuthenticated) {
          const notifications = await listMyNotifications();
          if (active) setNotifications(notifications);
        } else if (active) {
          setNotifications([]);
        }
      } catch {}

    };

    void load();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

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
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="Phenom Best Academy home"
          >
            <BrandWordmark className="h-10 max-w-[12rem] sm:h-11 sm:max-w-[15rem] lg:h-12" />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {desktopNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "touch-manipulation rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive(pathname, item.to)
                    ? "bg-navy-mid text-cream"
                    : "text-on-navy-muted hover:bg-navy-mid/70 hover:text-cream",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <label className="block">
              <span className="sr-only">Language</span>

              <select
                aria-label="Language"
                value={locale}
                onChange={(e) => {
                  const v = e.target.value as SupportedLocale;
                  setLocale(v);
                  setCurrentLocale(v);
                }}
                className="w-[5.5rem] max-w-[11rem] rounded-md border border-navy-mid bg-navy-mid px-2 py-2 text-xs text-cream sm:w-auto"
              >
                {supportedLocales.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNoticeOpen((v) => !v)}
              className="relative flex size-10 items-center justify-center rounded-md text-cream hover:bg-navy-mid"
            >
              <Bell className="size-5" />

              {notifications.some((n) => !n.readAt) ||
              announcements.length > 0 ? (
                <span className="absolute right-1 top-1 flex size-2.5 rounded-full bg-orange" />
              ) : null}
            </button>

            <div className="hidden gap-2 sm:flex">
              {isAuthenticated ? (
                <Button
                  size="sm"
                  variant="cream"
                  onClick={() => void signOut()}
                >
                  Logout
                </Button>
              ) : (
                <Button asChild size="sm" variant="cream">
                  <Link to="/account">Sign in</Link>
                </Button>
              )}

              {isSuperAdmin ? (
                <Button asChild size="sm" variant="cream">
                  <Link to="/admin">Super Admin</Link>
                </Button>
              ) : null}

              <Button asChild size="sm">
                <Link to="/enquire">Make an enquiry</Link>
              </Button>
            </div>

            <div className="flex gap-1.5 sm:hidden">
              {isAuthenticated ? (
                <Button
                  size="sm"
                  variant="cream"
                  onClick={() => void signOut()}
                >
                  Logout
                </Button>
              ) : (
                <Button asChild size="sm" variant="cream">
                  <Link to="/account">Sign in</Link>
                </Button>
              )}

              {isSuperAdmin ? (
                <Button asChild size="sm" variant="cream">
                  <Link to="/admin">Admin</Link>
                </Button>
              ) : null}

              <Button asChild size="sm">
                <Link to="/enquire">Enquire</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {announcements.find((a) => a.floating) ? (
        <div className="fixed inset-x-3 top-[4.75rem] z-50 mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-navy-deep p-4 text-cream shadow-card">
          {(() => {
            const a = announcements.find((x) => x.floating)!;

            return (
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gold">
                    {a.title}
                  </p>

                  <p className="mt-1 text-sm text-cream/80">
                    {a.body}
                  </p>

                  {a.linkUrl ? (
                    <a
                      className="mt-2 inline-block text-sm font-semibold text-cream underline"
                      href={a.linkUrl}
                    >
                      Open announcement
                    </a>
                  ) : null}
                </div>

                <button
                  type="button"
                  aria-label="Close announcement"
                  onClick={() =>
                    setAnnouncements((prev) =>
                      prev.map((x) =>
                        x.id === a.id
                          ? { ...x, floating: false }
                          : x,
                      ),
                    )
                  }
                  className="flex size-9 items-center justify-center rounded-full hover:bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>
            );
          })()}
        </div>
      ) : null}

      {noticeOpen ? (
        <div className="fixed right-3 top-[4.75rem] z-[60] w-[min(92vw,26rem)] rounded-2xl border border-line bg-cream p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Notifications
            </h2>

            <button
              type="button"
              onClick={() => setNoticeOpen(false)}
              className="flex size-9 items-center justify-center rounded-full"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 max-h-[60vh] space-y-2 overflow-auto">
            {notifications.length === 0 &&
            announcements.length === 0 ? (
              <p className="py-4 text-sm text-muted">
                No new notifications.
              </p>
            ) : null}

            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-xl bg-paper p-3"
              >
                <p className="font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {a.body}
                </p>
              </div>
            ))}

            {notifications.map((n) => (
              <button
                type="button"
                key={n.id}
                onClick={async () => {
                  await markNotificationRead(n.id);

                  setNotifications((prev) =>
                    prev.map((x) =>
                      x.id === n.id
                        ? {
                            ...x,
                            readAt: new Date().toISOString(),
                          }
                        : x,
                    ),
                  );

                  if (n.linkUrl) location.href = n.linkUrl;
                }}
                className="block w-full rounded-xl bg-paper p-3 text-left"
              >
                <p className="font-semibold">{n.title}</p>

                <p className="mt-1 text-sm text-muted">
                  {n.body}
                </p>

                <p className="mt-1 text-[11px] text-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-navy-mid bg-navy-deep text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="w-fit rounded-xl bg-cream p-2">
              <BrandFull className="h-auto w-full max-w-[22rem]" />
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
              {academy.motto}. {academy.tagline}
            </p>

            <p className="mt-4 text-xs tracking-wide text-ivory/55">
              RC {academy.rc} · TIN {academy.tin}
            </p>

            <div className="mt-6 space-y-3 border-t border-navy-mid pt-5">
              {academy.brands.map((brand) => (
                <div key={brand.name}>
                  <p className="text-sm font-semibold text-cream">
                    {brand.name}
                  </p>

                  <p className="text-xs text-ivory/60">
                    {brand.descriptor}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Explore
            </p>

            <ul className="mt-3 space-y-2 text-sm">
              {desktopNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-on-navy-muted hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="/path"
                  className="text-on-navy-muted hover:text-cream"
                >
                  Find your path
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-on-navy-muted hover:text-cream">
                  Your Phenom access points
                </Link>
              </li>
              {isSuperAdmin ? (
                <li>
                  <Link to="/admin" className="font-semibold text-gold hover:text-cream">
                    Super Admin Studio
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Stay informed
            </p>

            <p className="mt-3 text-sm text-ivory/75">
              Subscribe for Academy news, learning updates and
              announcements.
            </p>

            <form
              className="mt-3 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  await subscribeEmail(subscriberEmail);
                  setSubscribeStatus("Subscribed successfully.");
                  setSubscriberEmail("");
                } catch (err) {
                  setSubscribeStatus(
                    err instanceof Error
                      ? err.message
                      : "Subscription could not be completed.",
                  );
                }
              }}
            >
              <input
                aria-label="Email address"
                type="email"
                required
                value={subscriberEmail}
                onChange={(e) =>
                  setSubscriberEmail(e.target.value)
                }
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-md border border-navy-mid bg-white px-3 py-2 text-sm text-ink"
              />

              <button className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white">
                Subscribe
              </button>
            </form>

            {subscribeStatus ? (
              <div className="mt-2 text-xs text-gold">
                <p>{subscribeStatus}</p>
                {subscribeStatus === "Subscribed successfully." ? (
                  <Link to="/account" className="mt-1 inline-block font-semibold text-cream underline">Create or access your Phenom account →</Link>
                ) : null}
              </div>
            ) : null}

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Contact
            </p>

            <ul className="mt-3 space-y-2 text-sm text-on-navy-muted">
              {academy.emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-cream"
                  >
                    {email}
                  </a>
                </li>
              ))}

              {academy.phones.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    className="hover:text-cream"
                  >
                    {p.display}
                  </a>
                </li>
              ))}

              <li>{academy.location}</li>

              <li>
                <a
                  href={academy.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream underline-offset-2 hover:underline"
                >
                  {academy.registeredAddress}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-mid">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>{academy.copyright}</p>

            <div className="flex items-center gap-3">
              <p>
                A multidisciplinary education and professional services
                academy.
              </p>

              <span className="text-ivory/40">
                Academy
              </span>
            </div>
          </div>
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur-md lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label="App"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          <Tab
            to="/"
            icon={Home}
            label="Home"
            active={pathname === "/"}
          />

          <Tab
            to="/services"
            icon={BookOpen}
            label="Services"
            active={pathname.startsWith("/services")}
          />

          <Tab
            to="/path"
            icon={Compass}
            label="Path"
            active={pathname === "/path"}
          />

          <Tab
            to="/enquire"
            icon={Send}
            label="Enquire"
            active={pathname === "/enquire"}
          />

          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cn(
                "touch-manipulation flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium",
                moreOpen ? "text-orange" : "text-muted",
              )}
            >
              <Menu
                className="size-5"
                strokeWidth={1.7}
              />
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
              <p className="font-display text-xl font-semibold">
                Explore the Academy
              </p>

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
                    className="touch-manipulation flex min-h-14 items-center text-base font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/account" className="touch-manipulation flex min-h-14 items-center text-base font-semibold text-ink">Your Phenom access points</Link>
              </li>
              {isSuperAdmin ? (
                <li>
                  <Link to="/admin" className="touch-manipulation flex min-h-14 items-center text-base font-semibold text-green hover:text-green-deep">Super Admin Studio</Link>
                </li>
              ) : null}
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
          "touch-manipulation flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
          active ? "text-orange" : "text-muted",
        )}
      >
        <Icon
          className="size-5"
          strokeWidth={1.7}
        />
        {label}
      </Link>
    </li>
  );
}
