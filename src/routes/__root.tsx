import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteShell } from "@/components/site-shell";
import { AppQueryProvider } from "@/components/app-query-provider";
import appCss from "../styles.css?url";
import { applySettings, getLocalSettings, getSiteSettings } from "@/lib/cms";

const APP_NAME = "Phenom Best Academy";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Phenom Best Academy — Tranquil Excellence for Global Impact. Multidisciplinary education, professional development, research, consultancy, leadership, languages, mentorship, guidance, study abroad, digital learning, faith-based content, and creative development.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: APP_NAME },
      {
        property: "og:description",
        content: "Tranquil Excellence for Global Impact. Empowering minds. Enriching cultures. Inspiring global leaders.",
      },
      { property: "og:image", content: "/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: APP_NAME },
      {
        name: "twitter:description",
        content: "Tranquil Excellence for Global Impact. Empowering minds. Enriching cultures. Inspiring global leaders.",
      },
      { name: "twitter:image", content: "/og.jpg" },
      { name: "theme-color", content: "#152238" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  useEffect(() => { applySettings(getLocalSettings()); void getSiteSettings().catch(() => undefined); }, []);
  return (
    <html lang="en-NG" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <AppQueryProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
        </AppQueryProvider>
        <Scripts />
      </body>
    </html>
  );
}
