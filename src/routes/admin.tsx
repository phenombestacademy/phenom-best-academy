import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Bell,
  ImagePlus,
  Landmark,
  Mail,
  Palette,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  deleteMedia,
  getLocalSettings,
  getSiteSettings,
  getSupabase,
  listAllMedia,
  listAllPaymentProviders,
  makeMediaId,
  saveMedia,
  savePaymentProvider,
  saveSiteSettings,
  uploadMediaFile,
  type MediaItem,
  type MediaKind,
  type PaymentProviderPublic,
  type SiteSettings,
} from '@/lib/cms';

import { getMyProfile, type Profile } from '@/lib/platform';

import {
  deleteAnnouncement,
  listAllAnnouncements,
  saveAnnouncement,
  type Announcement,
} from '@/lib/notifications';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex,nofollow' }],
  }),
  component: AdminStudio,
});

const kindLabels: Record<MediaKind, string> = {
  picture: 'Pictures & gallery',
  video: 'Videos',
  song: 'Songs & music',
  sound: 'Free sounds / samples',
  resource: 'Resources & downloads',
  learning: 'Learning materials',
  news: 'News & updates',
  link: 'Useful links',
};

type UserRow = {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
};

type UploadProgress = {
  percentage: number;
  bytesUploaded: number;
  bytesTotal: number;
  phase: 'starting' | 'uploading' | 'finalizing' | 'complete';
};

function AdminStudio() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getLocalSettings());
  const [paymentSettings, setPaymentSettings] = useState<PaymentProviderPublic[]>([]);
  const [cmsBlocks, setCmsBlocks] = useState<Record<string, unknown>[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percentage: 0,
    bytesUploaded: 0,
    bytesTotal: 0,
    phase: 'starting',
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    kind: 'picture' as MediaKind,
    url: '',
    thumbnailUrl: '',
    downloadUrl: '',
    source: 'external' as 'external' | 'upload',
    published: true,
    featured: false,
  });

  const [notice, setNotice] = useState({
    id: '',
    title: '',
    body: '',
    linkUrl: '',
    published: true,
    floating: true,
    startsAt: '',
    endsAt: '',
  });

  const [cmsForm, setCmsForm] = useState({
    pageKey: 'home',
    blockKey: 'hero',
    title: '',
    body: '',
    iconName: '',
    imageUrl: '',
    href: '',
    published: true,
  });

  const [email, setEmail] = useState({
    subject: '',
    body: '',
    recipient: 'all',
  });

  const counts = useMemo(
    () =>
      Object.keys(kindLabels).map((kind) => ({
        kind: kind as MediaKind,
        count: media.filter((item) => item.kind === kind).length,
      })),
    [media],
  );

  useEffect(() => {
    void loadInitial();
  }, []);

  async function loadInitial() {
    const p = await getMyProfile();
    setProfile(p);

    if (p?.role !== 'super_admin') return;

    await refresh();

    try {
      setSettings(await getSiteSettings());
    } catch {}

    try {
      setPaymentSettings(await listAllPaymentProviders());
    } catch {}
  }

  async function refresh() {
    try {
      setMedia(await listAllMedia());
      setAnnouncements(await listAllAnnouncements());

      const sb = getSupabase();
      if (!sb) return;

      const { data, error } = await sb
        .from('cms_content_blocks')
        .select('*')
        .order('page_key')
        .order('sort_order');

      if (error) throw error;
      setCmsBlocks((data ?? []) as Record<string, unknown>[]);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Could not load the control centre.',
      );
    }
  }

  async function upload(file: File) {
    setUploading(true);
    setUploadFile(file);
    setUploadProgress({
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: file.size,
      phase: 'starting',
    });
    setStatus(`Preparing ${file.name}…`);

    try {
      const url = await uploadMediaFile(file, (progress) => {
        setUploadProgress(progress);
        setStatus(
          progress.phase === 'complete'
            ? `Upload complete: ${file.name}`
            : progress.phase === 'finalizing'
              ? `Upload ${Math.round(progress.percentage)}% — finalizing…`
              : `Uploading ${file.name} — ${Math.round(progress.percentage)}%`,
        );
      });

      setForm((current) => ({
        ...current,
        url,
        source: 'upload',
      }));

      setUploadProgress({
        percentage: 100,
        bytesUploaded: file.size,
        bytesTotal: file.size,
        phase: 'complete',
      });

      setStatus(
        `Upload successful: ${file.name} is ready to save to the Academy media library.`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function saveContent() {
    if (!form.title.trim() || !form.url.trim()) {
      setStatus('Add a title and URL or upload a file first.');
      return;
    }

    try {
      await saveMedia({
        id: editing?.id || makeMediaId(),
        title: form.title.trim(),
        description: form.description.trim(),
        kind: form.kind,
        source: form.source,
        url: form.url.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || undefined,
        downloadUrl: form.downloadUrl.trim() || undefined,
        published: form.published,
        featured: form.featured,
        createdAt: editing?.createdAt || new Date().toISOString(),
      });

      setEditing(null);
      setForm({
        title: '',
        description: '',
        kind: 'picture',
        url: '',
        thumbnailUrl: '',
        downloadUrl: '',
        source: 'external',
        published: true,
        featured: false,
      });
      setUploadFile(null);
      setStatus('Content saved.');
      await refresh();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Could not save content.',
      );
    }
  }

  function edit(item: MediaItem) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      kind: item.kind,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl || '',
      downloadUrl: item.downloadUrl || '',
      source: item.source,
      published: item.published,
      featured: item.featured,
    });
  }

  async function saveNotice() {
    if (!notice.title.trim() || !notice.body.trim()) {
      setStatus('Add an announcement title and message first.');
      return;
    }

    try {
      await saveAnnouncement({
        id: notice.id || crypto.randomUUID(),
        title: notice.title.trim(),
        body: notice.body.trim(),
        linkUrl: notice.linkUrl.trim() || null,
        published: notice.published,
        floating: notice.floating,
        startsAt: notice.startsAt
          ? new Date(notice.startsAt).toISOString()
          : null,
        endsAt: notice.endsAt ? new Date(notice.endsAt).toISOString() : null,
      });

      setNotice({
        id: '',
        title: '',
        body: '',
        linkUrl: '',
        published: true,
        floating: true,
        startsAt: '',
        endsAt: '',
      });

      setStatus('Announcement saved.');
      await refresh();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Could not save announcement.',
      );
    }
  }

  async function saveCmsBlock() {
    const sb = getSupabase();
    if (!sb) throw new Error('Connect Supabase first.');

    const {
      data: { user },
    } = await sb.auth.getUser();

    const { error } = await sb.from('cms_content_blocks').upsert(
      {
        page_key: cmsForm.pageKey.trim(),
        block_key: cmsForm.blockKey.trim(),
        title: cmsForm.title,
        body: cmsForm.body,
        icon_name: cmsForm.iconName || null,
        image_url: cmsForm.imageUrl || null,
        href: cmsForm.href || null,
        published: cmsForm.published,
        updated_by: user?.id || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'page_key,block_key' },
    );

    if (error) throw error;
    setStatus('Editable content block saved.');
    await refresh();
  }

  async function sendEmail() {
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Connect Supabase first.');

      setStatus('Sending email… Please wait…');

      const { data, error } = await sb.functions.invoke('send-admin-email', {
        body: email,
      });

      if (error) throw error;

      setStatus(data?.message || 'Email request accepted.');
      setEmail({ subject: '', body: '', recipient: 'all' });
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Email could not be sent.',
      );
    }
  }

  async function loadUsers() {
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Connect Supabase first.');

      const { data, error } = await sb.functions.invoke('admin-directory', {
        body: {},
      });

      if (error) throw error;
      setUsers(data?.users || []);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Could not load user directory.',
      );
    }
  }

  async function setUserRole(userId: string, role: string) {
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Connect Supabase first.');

      setStatus('Updating role… Please wait…');

      const { data, error } = await sb.functions.invoke('manage-user-role', {
        body: { userId, role },
      });

      if (error) throw error;

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? { ...user, role: data?.role || role }
            : user,
        ),
      );

      setStatus('User role updated.');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Could not update user role.',
      );
    }
  }

  function formatBytes(bytes: number) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.min(
      units.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024)),
    );
    return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-line bg-cream p-8">
          <h1 className="font-display text-3xl font-bold">
            Administrator access
          </h1>
          <p className="mt-3 text-muted">
            Sign in with the designated Super Admin account.
          </p>
          <Button asChild className="mt-5">
            <Link to="/account">Go to account</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (profile.role !== 'super_admin') {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-orange/30 bg-orange/5 p-8">
          <h1 className="font-display text-3xl font-bold">
            Access restricted
          </h1>
          <p className="mt-3 text-muted">
            Only the designated Super Admin account can use this studio.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">
          Super Admin Studio
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">
          Control content, branding, announcements and client communication.
        </h1>
        <p className="mt-3 max-w-4xl text-on-navy">
          Manage the Academy content and administration from one protected
          workspace.
        </p>
      </div>

      {status && (
        <p
          className="mt-4 rounded-xl border border-line bg-cream p-4 text-sm"
          role="status"
        >
          {status}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.slice(0, 4).map((item) => (
          <div
            key={item.kind}
            className="rounded-2xl border border-line bg-cream p-5"
          >
            <p className="text-xs uppercase tracking-wide text-muted">
              {kindLabels[item.kind]}
            </p>
            <p className="mt-2 text-3xl font-bold">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-cream p-6">
          <div className="flex items-center gap-2">
            <ImagePlus className="text-orange" />
            <h2 className="font-display text-2xl font-semibold">
              Content & news
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted">
            Create or edit news, resources, videos, audio, PDFs and links.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Type</Label>
              <select
                className="mt-1 h-11 w-full rounded-md border border-line bg-white px-3"
                value={form.kind}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kind: e.target.value as MediaKind,
                  })
                }
              >
                {Object.entries(kindLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Source</Label>
              <select
                className="mt-1 h-11 w-full rounded-md border border-line bg-white px-3"
                value={form.source}
                onChange={(e) =>
                  setForm({
                    ...form,
                    source: e.target.value as 'external' | 'upload',
                  })
                }
              >
                <option value="external">URL / hosted</option>
                <option value="upload">Upload</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="Uploaded file URL or hosted media URL"
              />
            </div>

            {form.source === 'upload' && (
              <div className="sm:col-span-2 rounded-2xl border border-dashed border-line bg-white p-4">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-paper p-5 text-sm font-semibold">
                  <Upload className="size-5" />
                  {uploading ? 'Uploading… Please wait…' : 'Choose file'}
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.rtf,.epub,.txt,.csv,.zip"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void upload(file);
                    }}
                  />
                </label>

                {uploadFile && (
                  <div className="mt-4 rounded-xl bg-paper p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <strong className="block truncate">
                          {uploadFile.name}
                        </strong>
                        <span className="text-xs text-muted">
                          {uploadFile.type || 'Unknown type'} ·{' '}
                          {formatBytes(uploadFile.size)}
                        </span>
                      </div>
                      <strong>
                        {Math.round(uploadProgress.percentage)}%
                      </strong>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-orange transition-all"
                        style={{ width: `${uploadProgress.percentage}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-muted">
                      {uploadProgress.phase === 'complete'
                        ? 'Upload successful — click Publish content to save it.'
                        : uploadProgress.phase === 'finalizing'
                          ? 'Finalizing the Storage object…'
                          : `Transferred ${formatBytes(uploadProgress.bytesUploaded)} of ${formatBytes(uploadProgress.bytesTotal)}`}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="sm:col-span-2">
              <Label>Description / write-up</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Thumbnail URL</Label>
              <Input
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm({ ...form, thumbnailUrl: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Download URL</Label>
              <Input
                value={form.downloadUrl}
                onChange={(e) =>
                  setForm({ ...form, downloadUrl: e.target.value })
                }
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Featured
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={() => void saveContent()}>
              <Save className="mr-2 size-4" />
              {editing ? 'Update content' : 'Publish content'}
            </Button>

            {editing && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: '',
                    description: '',
                    kind: 'picture',
                    url: '',
                    thumbnailUrl: '',
                    downloadUrl: '',
                    source: 'external',
                    published: true,
                    featured: false,
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="mt-6 max-h-80 space-y-2 overflow-auto">
            {media.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.title}</p>
                  <p className="text-xs text-muted">
                    {kindLabels[item.kind]} ·{' '}
                    {item.published ? 'Published' : 'Draft'}
                  </p>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => edit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await deleteMedia(item.id);
                        setStatus('Content deleted.');
                        await refresh();
                      } catch (error) {
                        setStatus(
                          error instanceof Error
                            ? error.message
                            : 'Could not delete content.',
                        );
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-6">
          <div className="flex items-center gap-2">
            <Bell className="text-gold" />
            <h2 className="font-display text-2xl font-semibold">
              Floating announcements
            </h2>
          </div>

          <div className="mt-4 grid gap-3">
            <Input
              placeholder="Announcement title"
              value={notice.title}
              onChange={(e) => setNotice({ ...notice, title: e.target.value })}
            />
            <Textarea
              placeholder="Message to clients"
              value={notice.body}
              onChange={(e) => setNotice({ ...notice, body: e.target.value })}
            />
            <Input
              placeholder="Optional link"
              value={notice.linkUrl}
              onChange={(e) =>
                setNotice({ ...notice, linkUrl: e.target.value })
              }
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="datetime-local"
                value={notice.startsAt}
                onChange={(e) =>
                  setNotice({ ...notice, startsAt: e.target.value })
                }
              />
              <Input
                type="datetime-local"
                value={notice.endsAt}
                onChange={(e) =>
                  setNotice({ ...notice, endsAt: e.target.value })
                }
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notice.floating}
                onChange={(e) =>
                  setNotice({ ...notice, floating: e.target.checked })
                }
              />
              Show as floating announcement
            </label>

            <Button onClick={() => void saveNotice()}>
              <Bell className="mr-2 size-4" />
              Publish announcement
            </Button>
          </div>

          <div className="mt-6 space-y-2">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-line bg-white p-3"
              >
                <div className="flex justify-between gap-2">
                  <strong>{item.title}</strong>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await deleteAnnouncement(item.id);
                        await refresh();
                      } catch (error) {
                        setStatus(
                          error instanceof Error
                            ? error.message
                            : 'Could not delete announcement.',
                        );
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Palette className="text-purple" />
            <h2 className="font-display text-2xl font-semibold">
              Branding, colours & backgrounds
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                'background',
                'surface',
                'accent',
                'accent2',
                'text',
                'muted',
                'gradientStart',
                'gradientEnd',
              ] as const
            ).map((key) => (
              <label key={key} className="text-sm font-semibold">
                {key}
                <input
                  type="color"
                  value={settings[key] as string}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.value })
                  }
                  className="mt-1 h-11 w-full rounded-md border border-line bg-white p-1"
                />
              </label>
            ))}

            <label className="text-sm font-semibold">
              Background mode
              <select
                className="mt-1 h-11 w-full rounded-md border border-line bg-white px-3"
                value={settings.backgroundMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    backgroundMode:
                      e.target.value as SiteSettings['backgroundMode'],
                  })
                }
              >
                <option value="solid">Solid</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
                <option value="pattern">Pattern</option>
              </select>
            </label>

            <label className="text-sm font-semibold">
              Background image URL
              <Input
                value={settings.backgroundImageUrl}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    backgroundImageUrl: e.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-semibold">
              Pattern
              <select
                className="mt-1 h-11 w-full rounded-md border border-line bg-white px-3"
                value={settings.pattern}
                onChange={(e) =>
                  setSettings({ ...settings, pattern: e.target.value })
                }
              >
                <option value="none">None</option>
                <option value="dots">Dots</option>
                <option value="grid">Grid</option>
                <option value="diagonal">Diagonal texture</option>
              </select>
            </label>

            <label className="text-sm font-semibold">
              Upload background image
              <input
                className="mt-1 block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setStatus('Uploading background… Please wait…');
                    const url = await uploadMediaFile(file, (progress) => {
                      setStatus(
                        `Uploading background — ${Math.round(progress.percentage)}%`,
                      );
                    });

                    setSettings({
                      ...settings,
                      backgroundImageUrl: url,
                      backgroundMode: 'image',
                    });
                    setStatus(
                      'Background uploaded. Save global appearance.',
                    );
                  } catch (error) {
                    setStatus(
                      error instanceof Error
                        ? error.message
                        : 'Background upload failed.',
                    );
                  }
                }}
              />
            </label>

            <label className="text-sm font-semibold">
              Logo URL
              <Input
                value={settings.logoUrl}
                onChange={(e) =>
                  setSettings({ ...settings, logoUrl: e.target.value })
                }
              />
            </label>

            <label className="text-sm font-semibold">
              Gradient angle
              <input
                type="range"
                min="0"
                max="360"
                value={settings.gradientAngle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gradientAngle: Number(e.target.value),
                  })
                }
                className="mt-3 w-full"
              />
            </label>

            <label className="text-sm font-semibold">
              Text scale
              <select
                className="mt-1 h-11 w-full rounded-md border border-line bg-white px-3"
                value={settings.fontScale}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fontScale: Number(e.target.value),
                  })
                }
              >
                <option value="0.95">95%</option>
                <option value="1">100%</option>
                <option value="1.075">108%</option>
                <option value="1.15">115%</option>
                <option value="1.25">125%</option>
              </select>
            </label>
          </div>

          <Button
            className="mt-5"
            onClick={async () => {
              try {
                await saveSiteSettings(settings);
                setStatus('Global appearance settings saved.');
              } catch (error) {
                setStatus(
                  error instanceof Error
                    ? error.message
                    : 'Could not save settings.',
                );
              }
            }}
          >
            <Save className="mr-2 size-4" />
            Save global appearance
          </Button>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Landmark className="text-green" />
            <h2 className="font-display text-2xl font-semibold">
              Payment provider controls
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted">
            Enable only payment providers that have actually been configured.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {paymentSettings.map((payment) => (
              <div
                key={payment.provider}
                className="rounded-xl border border-line bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>{payment.publicLabel}</strong>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={payment.enabled}
                      onChange={(e) =>
                        setPaymentSettings((current) =>
                          current.map((item) =>
                            item.provider === payment.provider
                              ? { ...item, enabled: e.target.checked }
                              : item,
                          ),
                        )
                      }
                    />
                    Enabled
                  </label>
                </div>

                <Input
                  className="mt-3"
                  value={payment.publicNote || ''}
                  onChange={(e) =>
                    setPaymentSettings((current) =>
                      current.map((item) =>
                        item.provider === payment.provider
                          ? { ...item, publicNote: e.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Public payment note"
                />

                {payment.provider === 'direct' && (
                  <div className="mt-3 grid gap-2">
                    <Input
                      value={payment.directBankName || ''}
                      onChange={(e) =>
                        setPaymentSettings((current) =>
                          current.map((item) =>
                            item.provider === payment.provider
                              ? {
                                  ...item,
                                  directBankName: e.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      placeholder="Bank name"
                    />
                    <Input
                      value={payment.directAccountName || ''}
                      onChange={(e) =>
                        setPaymentSettings((current) =>
                          current.map((item) =>
                            item.provider === payment.provider
                              ? {
                                  ...item,
                                  directAccountName: e.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      placeholder="Account name"
                    />
                    <Input
                      value={payment.directAccountNumber || ''}
                      onChange={(e) =>
                        setPaymentSettings((current) =>
                          current.map((item) =>
                            item.provider === payment.provider
                              ? {
                                  ...item,
                                  directAccountNumber: e.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      placeholder="Account number"
                    />
                    <Textarea
                      value={payment.directInstructions || ''}
                      onChange={(e) =>
                        setPaymentSettings((current) =>
                          current.map((item) =>
                            item.provider === payment.provider
                              ? {
                                  ...item,
                                  directInstructions: e.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      placeholder="Transfer instructions"
                    />
                  </div>
                )}

                <Button
                  size="sm"
                  className="mt-3"
                  onClick={async () => {
                    try {
                      await savePaymentProvider(payment);
                      setStatus(`${payment.publicLabel} settings saved.`);
                    } catch (error) {
                      setStatus(
                        error instanceof Error
                          ? error.message
                          : 'Could not save payment settings.',
                      );
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Plus className="text-purple" />
            <h2 className="font-display text-2xl font-semibold">
              Page content & custom blocks
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Page key"
              value={cmsForm.pageKey}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, pageKey: e.target.value })
              }
            />
            <Input
              placeholder="Block key"
              value={cmsForm.blockKey}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, blockKey: e.target.value })
              }
            />
            <Input
              placeholder="Title"
              value={cmsForm.title}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, title: e.target.value })
              }
            />
            <Input
              placeholder="Icon name"
              value={cmsForm.iconName}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, iconName: e.target.value })
              }
            />
            <Textarea
              className="sm:col-span-2"
              placeholder="Write-up / body"
              value={cmsForm.body}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, body: e.target.value })
              }
            />
            <Input
              placeholder="Image URL"
              value={cmsForm.imageUrl}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, imageUrl: e.target.value })
              }
            />
            <Input
              placeholder="Link URL"
              value={cmsForm.href}
              onChange={(e) =>
                setCmsForm({ ...cmsForm, href: e.target.value })
              }
            />
          </div>

          <Button
            className="mt-3"
            onClick={() =>
              void saveCmsBlock().catch((error) =>
                setStatus(
                  error instanceof Error
                    ? error.message
                    : 'Could not save content block.',
                ),
              )
            }
          >
            <Save className="mr-2 size-4" />
            Save block
          </Button>

          <div className="mt-5 grid gap-2">
            {cmsBlocks.map((block) => (
              <div
                key={String(block.id)}
                className="rounded-xl bg-white p-3"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <strong>
                      {String(block.page_key)} / {String(block.block_key)}
                    </strong>
                    <p className="text-sm text-muted">
                      {String(block.title || 'Untitled')} ·{' '}
                      {block.published ? 'Published' : 'Draft'}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCmsForm({
                        pageKey: String(block.page_key || ''),
                        blockKey: String(block.block_key || ''),
                        title: String(block.title || ''),
                        body: String(block.body || ''),
                        iconName: String(block.icon_name || ''),
                        imageUrl: String(block.image_url || ''),
                        href: String(block.href || ''),
                        published: Boolean(block.published),
                      })
                    }
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-6">
          <div className="flex items-center gap-2">
            <Mail className="text-blue" />
            <h2 className="font-display text-2xl font-semibold">
              Direct email
            </h2>
          </div>

          <div className="mt-4 grid gap-3">
            <Input
              placeholder="Subject"
              value={email.subject}
              onChange={(e) =>
                setEmail({ ...email, subject: e.target.value })
              }
            />
            <Textarea
              placeholder="Message"
              value={email.body}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
            />
            <select
              className="h-11 rounded-md border border-line bg-white px-3"
              value={email.recipient}
              onChange={(e) =>
                setEmail({ ...email, recipient: e.target.value })
              }
            >
              <option value="all">All active email subscribers</option>
              <option value="admins">Administrators</option>
              <option value="users">All registered users</option>
            </select>

            <Button onClick={() => void sendEmail()}>
              <Mail className="mr-2 size-4" />
              Send email
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-6">
          <div className="flex items-center gap-2">
            <Users className="text-green" />
            <h2 className="font-display text-2xl font-semibold">
              Client email directory
            </h2>
          </div>

          <Button
            className="mt-4"
            variant="outline"
            onClick={() => void loadUsers()}
          >
            Load email directory
          </Button>

          <div className="mt-4 max-h-64 space-y-2 overflow-auto">
            {users.map((user) => (
              <div key={user.id} className="rounded-lg bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong>{user.full_name || 'User'}</strong>
                    <p className="text-sm text-muted">
                      {user.email} · {user.role || 'user'}
                    </p>
                  </div>

                  {user.role !== 'super_admin' && (
                    <select
                      className="h-10 rounded-md border border-line bg-white px-3 text-sm"
                      value={user.role || 'user'}
                      onChange={(e) =>
                        void setUserRole(user.id, e.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="parent">Parent</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
