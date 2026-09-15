import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, FileText, Image as ImageIcon, Music2, Play, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/page-hero";
import { listPublishedMedia, type MediaItem } from "@/lib/cms";

export const Route = createFileRoute("/media")({ component: MediaHub });

const labels = { picture: "Pictures", video: "Videos", song: "Songs", sound: "Sounds", resource: "Resources", learning: "Learning", news: "News", link: "Useful links" } as const;

function MediaHub() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { document.title = "Media & Resources — Phenom Best Academy"; void listPublishedMedia().then(setItems).catch((e) => setError(e instanceof Error ? e.message : "Could not load media.")); }, []);
  return <>
    <PageHero kicker="Media, knowledge & creativity" title="Explore what Phenom Best Academy publishes" lede="A growing home for pictures, videos, music, sounds, resources, learning materials, news, useful links, Phenom Sound Press and Phenom Sound Lab content." />
    <Section>
      {error ? <div className="rounded-xl border border-orange/40 bg-cream p-4 text-sm text-muted">{error}</div> : null}
      {items.length === 0 && !error ? <div className="rounded-2xl border border-line bg-cream p-8 text-center shadow-card"><p className="font-display text-2xl font-semibold">The library is ready for its first publication.</p><p className="mt-2 text-muted">Published media added through the Admin Studio will appear here.</p></div> : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => <MediaCard key={item.id} item={item} />)}
      </div>
    </Section>
  </>;
}

function MediaCard({ item }: { item: MediaItem }) {
  const isAudio = item.kind === "song" || item.kind === "sound";
  const isVideo = item.kind === "video";
  return <article className="overflow-hidden rounded-2xl border border-line bg-cream shadow-card">
    {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" className="aspect-video w-full object-cover" /> : <div className="flex aspect-video items-center justify-center bg-paper"><MediaIcon kind={item.kind} /></div>}
    <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange">{labels[item.kind]}</p><h2 className="mt-2 font-display text-2xl font-semibold">{item.title}</h2>{item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
      {isAudio ? <audio className="mt-4 w-full" controls preload="none" src={item.url} /> : null}
      {isVideo && item.url.includes("youtube") ? <div className="mt-4 rounded-xl bg-paper p-3 text-sm text-muted">Open the hosted video to use the host's full quality and playback controls.</div> : null}
      <div className="mt-4 flex flex-wrap gap-2"><Button asChild variant="navy" size="sm"><a href={item.url} target="_blank" rel="noreferrer"><ExternalLink className="size-4" />Open</a></Button>{item.downloadUrl ? <Button asChild variant="outline" size="sm"><a href={item.downloadUrl} target="_blank" rel="noreferrer"><Download className="size-4" />Download</a></Button> : null}</div>
    </div>
  </article>;
}

function MediaIcon({ kind }: { kind: MediaItem["kind"] }) {
  if (kind === "picture") return <ImageIcon className="size-12 text-purple" />;
  if (kind === "song") return <Music2 className="size-12 text-orange" />;
  if (kind === "sound") return <Volume2 className="size-12 text-green" />;
  if (kind === "video") return <Play className="size-12 text-blue" />;
  return <FileText className="size-12 text-gold" />;
}
