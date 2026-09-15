import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlus, Link2, LogIn, Music2, Palette, Plus, Save, Trash2, Upload, Video, FileText, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultSettings, deleteMedia, getLocalSettings, getSupabase, listAllMedia, makeMediaId, saveLocalSettings, saveMedia, uploadMediaFile, type MediaItem, type MediaKind, type SiteSettings } from "@/lib/cms";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: AdminStudio,
});

const kindLabels: Record<MediaKind, string> = {
  picture: "Pictures & gallery",
  video: "Videos",
  song: "Songs & music",
  sound: "Free sounds / samples",
  resource: "Resources & downloads",
  learning: "Learning materials",
  news: "News & updates",
  link: "Useful links",
};

function AdminStudio() {
  const connected = Boolean(getSupabase());
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getLocalSettings());
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ title: "", description: "", kind: "picture" as MediaKind, url: "", thumbnailUrl: "", downloadUrl: "", source: "external" as "external" | "upload", published: true, featured: false });
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    try {
      setMedia(await listAllMedia());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load content.");
    }
  }

  useEffect(() => { void refresh(); }, []);
  useEffect(() => { document.title = "Admin Studio — Phenom Best Academy"; }, []);

  const counts = useMemo(() => Object.keys(kindLabels).map((kind) => ({ kind: kind as MediaKind, count: media.filter((item) => item.kind === kind).length })), [media]);

  async function addItem() {
    if (!form.title.trim() || !form.url.trim()) {
      setStatus("Please provide a title and a media/link URL, or upload a file first.");
      return;
    }
    try {
      await saveMedia({ id: makeMediaId(), title: form.title.trim(), description: form.description.trim(), kind: form.kind, source: form.source, url: form.url.trim(), thumbnailUrl: form.thumbnailUrl.trim() || undefined, downloadUrl: form.downloadUrl.trim() || undefined, published: form.published, featured: form.featured, createdAt: new Date().toISOString() });
      setForm({ title: "", description: "", kind: "picture", url: "", thumbnailUrl: "", downloadUrl: "", source: "external", published: true, featured: false });
      setStatus(connected ? "Content saved to the connected CMS." : "Saved locally on this device. Connect the CMS to publish across devices.");
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save content.");
    }
  }

  async function handleFile(file: File) {
    setUploading(true);
    setStatus("Uploading media…");
    try {
      const url = await uploadMediaFile(file);
      setForm((current) => ({ ...current, url, source: "upload" }));
      setStatus("Upload complete. Add the title and publish when ready.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this item from the content library?")) return;
    await deleteMedia(id);
    await refresh();
    setStatus("Content removed.");
  }

  function updateSettings(next: Partial<SiteSettings>) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    saveLocalSettings(merged);
    setStatus("Appearance settings saved on this device. Connected settings can be made global in the next CMS connection step.");
  }

  return (
    <div className="min-h-dvh bg-paper pb-16">
      <header className="border-b border-line bg-navy-deep text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Phenom Best Academy</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-cream">Admin Studio</h1>
            <p className="text-sm text-ivory/70">Content, media, publishing and visual control</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="cream"><Link to="/">View website</Link></Button>
            {!connected ? <span className="inline-flex items-center rounded-md border border-gold/40 px-3 py-2 text-xs text-gold">Preview / local mode</span> : <span className="inline-flex items-center rounded-md border border-green/50 px-3 py-2 text-xs text-green">CMS connected</span>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {!connected ? (
          <section className="rounded-2xl border border-gold/50 bg-cream p-5 shadow-card">
            <div className="flex gap-3"><LogIn className="mt-0.5 size-5 text-gold" /><div><h2 className="font-display text-xl font-semibold">Connect the real CMS</h2><p className="mt-1 text-sm leading-relaxed text-muted">This studio is already structured for the full content-management system. It is currently in local mode because the secure database, authentication and media-storage credentials have not been connected yet. Local changes stay on this Android device; once Supabase is connected, the same controls can manage the live site from anywhere.</p></div></div>
          </section>
        ) : null}

        {status ? <div className="rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink" role="status">{status}</div> : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counts.slice(0, 4).map((item) => <div key={item.kind} className="rounded-2xl border border-line bg-cream p-5 shadow-card"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{kindLabels[item.kind]}</p><p className="mt-2 font-display text-3xl font-semibold">{item.count}</p></div>)}
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-line bg-cream p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange">Content manager</p><h2 className="mt-1 font-display text-2xl font-semibold">Add media, resources or updates</h2><p className="mt-1 text-sm text-muted">Use an external link for most media, or upload a real file when the connected storage is ready.</p></div><Plus className="size-6 text-orange" /></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="title">Title</Label><Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Phenom Best Academy launch video" /></div>
              <div className="grid gap-1.5"><Label htmlFor="kind">Content type</Label><select id="kind" className="h-11 rounded-md border border-line bg-cream px-3.5 text-[0.9375rem]" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as MediaKind })}>{Object.entries(kindLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
              <div className="grid gap-1.5"><Label htmlFor="source">Source</Label><select id="source" className="h-11 rounded-md border border-line bg-cream px-3.5 text-[0.9375rem]" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as "external" | "upload" })}><option value="external">External link / hosted media</option><option value="upload">Direct upload</option></select></div>
              <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="url">Media / page URL</Label><Input id="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="YouTube, Audiomack, cloud file, image, MP3, M4A, WAV, PDF, etc." /></div>
              {form.source === "upload" ? <div className="sm:col-span-2"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-paper px-4 py-5 text-sm font-semibold hover:border-blue"><Upload className="size-5" />{uploading ? "Uploading…" : "Choose a real media file"}<input type="file" className="sr-only" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.zip" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleFile(file); }} /></label></div> : null}
              <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A short, useful description for visitors." /></div>
              <div className="grid gap-1.5"><Label htmlFor="thumb">Thumbnail URL (optional)</Label><Input id="thumb" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="Image URL for video/audio/resource card" /></div>
              <div className="grid gap-1.5"><Label htmlFor="download">Download URL (optional)</Label><Input id="download" value={form.downloadUrl} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} placeholder="Only where downloads are permitted" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish immediately</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature this item</label>
            </div>
            <Button className="mt-5" size="lg" onClick={() => void addItem()}><Save className="size-4" />Save content</Button>
          </section>

          <section className="rounded-2xl border border-line bg-cream p-5 shadow-card sm:p-6">
            <div className="flex items-start gap-3"><Palette className="size-6 text-purple" /><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple">Appearance control</p><h2 className="mt-1 font-display text-2xl font-semibold">Keep the beauty, control the feel</h2><p className="mt-1 text-sm text-muted">These settings establish a safe visual control layer without allowing the brand to become chaotic.</p></div></div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-1.5"><Label htmlFor="background">Background colour</Label><div className="flex gap-2"><input id="background" type="color" className="h-11 w-14 rounded border border-line bg-cream p-1" value={settings.background} onChange={(e) => updateSettings({ background: e.target.value })} /><Input value={settings.background} onChange={(e) => updateSettings({ background: e.target.value })} /></div></div>
              <div className="grid gap-1.5"><Label htmlFor="surface">Surface colour</Label><div className="flex gap-2"><input id="surface" type="color" className="h-11 w-14 rounded border border-line bg-cream p-1" value={settings.surface} onChange={(e) => updateSettings({ surface: e.target.value })} /><Input value={settings.surface} onChange={(e) => updateSettings({ surface: e.target.value })} /></div></div>
              <div className="grid gap-1.5"><Label htmlFor="accent">Accent colour</Label><div className="flex gap-2"><input id="accent" type="color" className="h-11 w-14 rounded border border-line bg-cream p-1" value={settings.accent} onChange={(e) => updateSettings({ accent: e.target.value })} /><Input value={settings.accent} onChange={(e) => updateSettings({ accent: e.target.value })} /></div></div>
              <div className="grid gap-1.5"><Label htmlFor="animation">Animation level</Label><select id="animation" className="h-11 rounded-md border border-line bg-cream px-3.5" value={settings.animation} onChange={(e) => updateSettings({ animation: e.target.value as SiteSettings["animation"] })}><option value="refined">Refined professional</option><option value="minimal">Minimal</option><option value="off">Off</option></select></div>
              <div className="rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed text-muted"><strong className="text-ink">Logo control:</strong> the official Phenom Best Academy logo remains the default. The full connected CMS will let you replace the logo by uploading a new approved asset rather than editing the site code.</div>
              <Button variant="outline" onClick={() => { setSettings(defaultSettings); saveLocalSettings(defaultSettings); setStatus("Appearance restored to the approved Phenom Best defaults."); }}><Palette className="size-4" />Restore brand defaults</Button>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-line bg-cream p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue">Content library</p><h2 className="mt-1 font-display text-2xl font-semibold">Everything you publish</h2></div><Link2 className="size-6 text-blue" /></div>
          <div className="mt-5 grid gap-3">
            {media.length === 0 ? <p className="rounded-xl bg-paper p-5 text-sm text-muted">Your library is ready. Add your first picture, video, song, sound, resource, learning material, news item or useful link above.</p> : media.map((item) => <article key={item.id} className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-blue">{kindLabels[item.kind]}</span>{item.published ? <span className="text-xs font-semibold text-green">Published</span> : <span className="text-xs font-semibold text-muted">Draft</span>}{item.featured ? <span className="text-xs font-semibold text-gold">Featured</span> : null}</div><h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3>{item.description ? <p className="mt-1 text-sm text-muted">{item.description}</p> : null}<p className="mt-2 truncate text-xs text-muted">{item.url}</p></div><div className="flex shrink-0 gap-2"><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-semibold"><ExternalLink className="size-4" />Open</a><Button variant="outline" onClick={() => void remove(item.id)}><Trash2 className="size-4" />Remove</Button></div></article>)}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminFeature icon={ImagePlus} title="Pictures" body="Direct uploads or external image hosting, with gallery-ready records." />
          <AdminFeature icon={Video} title="Video" body="YouTube/external embeds plus direct video uploads when appropriate." />
          <AdminFeature icon={Music2} title="Music & sound" body="MP3, M4A, WAV and other supported audio sources with lightweight external hosting." />
          <AdminFeature icon={FileText} title="Resources" body="PDFs, documents, learning materials, downloads, news and useful links." />
        </section>
      </main>
    </div>
  );
}

function AdminFeature({ icon: Icon, title, body }: { icon: typeof ImagePlus; title: string; body: string }) {
  return <div className="rounded-2xl border border-line bg-cream p-5 shadow-card"><Icon className="size-6 text-orange" /><h3 className="mt-3 font-display text-xl font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{body}</p></div>;
}
