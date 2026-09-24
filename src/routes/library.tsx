import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, FileText, Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/page-hero";
import { getCurriculumAssetUrl, listCurriculumLibrary, uploadCurriculumLibraryFile, type CurriculumLibraryItem } from "@/lib/cms";
import { getMyProfile, type Profile } from "@/lib/platform";

export const Route = createFileRoute("/library")({ component: LibraryHub });

function LibraryHub() {
  const [items, setItems] = useState<CurriculumLibraryItem[]>([]);
  const [query, setQuery] = useState("");
  const [topicId, setTopicId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setItems(await listCurriculumLibrary({ query, topicId: topicId || undefined, limit: 300 })); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load the Academy Library."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [topicId]);
  useEffect(() => { void getMyProfile().then(setProfile).catch(() => setProfile(null)); }, []);

  async function openItem(item: CurriculumLibraryItem, mode: "view" | "download") {
    setOpening(item.id + mode);
    try {
      const url = await getCurriculumAssetUrl(item, mode);
      if (!url) throw new Error(mode === "download" ? "Download is not enabled for this resource." : "This resource is not currently available to your account.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not open this resource."); }
    finally { setOpening(""); }
  }

  return <>
    <PageHero kicker="The Phenom Best Academy Library" title="One canonical library. Many learning pathways." lede="Resources are stored once and connected to the curricula, subjects and topics where they belong. A resource appearing in more than one place does not create a duplicate copy." />
    <Section>
      <div className="rounded-2xl border border-line bg-cream p-5 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search Library</span>
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted" />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void load(); }} placeholder="Search resources by title…" className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3" />
          </label>
          <Button onClick={() => void load()}>Search Library</Button>
        </div>
        <p className="mt-3 text-xs text-muted">The Library respects resource permissions. Teachers can view or download only where the resource permits it; editing remains restricted to Super Admin.</p>
      </div>

      {error ? <div className="mt-5 rounded-xl border border-orange/40 bg-orange/5 p-4 text-sm">{error}</div> : null}
      {loading ? <div className="mt-8 rounded-2xl border border-line bg-cream p-8 text-center">Loading the canonical Library…</div> : null}
      {!loading && !items.length ? <div className="mt-8 rounded-2xl border border-line bg-cream p-8 text-center"><p className="font-display text-2xl font-semibold">No accessible resources found.</p><p className="mt-2 text-sm text-muted">Resources appear here automatically when their canonical asset is stored and available to your account.</p></div> : null}

      {profile?.role === "super_admin" ? <div className="mt-5 rounded-2xl border border-purple/20 bg-purple/5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-display text-xl font-semibold">Super Admin: add real Library material</h2><p className="mt-1 text-sm text-muted">Upload the actual PDF, DOCX, PPTX, audio, video or other source file. The original format is preserved; the Library database only indexes the canonical file.</p></div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold">
            {uploading ? "Uploading…" : "Choose real file"}
            <input className="sr-only" type="file" disabled={uploading} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md,.zip,.epub,.mp3,.wav,.m4a,.mp4,.webm,.mov,.png,.jpg,.jpeg,.gif" onChange={async e => {
              const file = e.target.files?.[0]; e.currentTarget.value = ""; if (!file) return;
              setUploading(true); setUploadMessage("");
              try { await uploadCurriculumLibraryFile(file, {}, p => setUploadMessage(p.phase === "complete" ? "File stored and published." : `Uploading ${Math.round(p.percentage)}%…`)); await load(); }
              catch (err) { setUploadMessage(err instanceof Error ? err.message : "Upload failed."); }
              finally { setUploading(false); }
            }} />
          </label>
        </div>
        {uploadMessage ? <p className="mt-3 text-sm">{uploadMessage}</p> : null}
      </div> : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => <article key={item.id} className="rounded-2xl border border-line bg-cream p-5 shadow-card">
          <div className="flex size-11 items-center justify-center rounded-xl bg-paper"><FileText className="size-5 text-orange" /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[.14em] text-orange">{item.itemType}</p>
          <h2 className="mt-2 font-display text-xl font-semibold">{item.title}</h2>
          {item.topicTitle ? <p className="mt-2 text-sm text-muted">{item.topicCode ? item.topicCode + " · " : ""}{item.topicTitle}</p> : null}
          {item.curriculumId ? <p className="mt-1 text-xs text-muted">Curriculum: {item.curriculumId}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {item.storagePath ? <Button size="sm" variant="navy" disabled={opening !== ""} onClick={() => void openItem(item, "view")}><Eye className="size-4" />{opening === item.id + "view" ? "Opening…" : "View"}</Button> : null}
            {item.canDownload && item.storagePath ? <Button size="sm" variant="outline" disabled={opening !== ""} onClick={() => void openItem(item, "download")}><Download className="size-4" />{opening === item.id + "download" ? "Preparing…" : "Download"}</Button> : null}
            {item.externalUrl && !item.storagePath ? <Button size="sm" variant="outline" onClick={() => window.open(item.externalUrl ?? "", "_blank", "noopener,noreferrer")}><ExternalLink className="size-4" />Open source</Button> : null}
          </div>
        </article>)}
      </div>
    </Section>
  </>;
}
