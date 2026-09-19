import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Bell,
  ImagePlus,
  Mail,
  Palette,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
  Landmark,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  defaultSettings,
  deleteMedia,
  getLocalSettings,
  getSiteSettings,
  getSupabase,
  listAllMedia,
  makeMediaId,
  saveMedia,
  saveSiteSettings,
  uploadMediaFile,
  listAllPaymentProviders,
  savePaymentProvider,
  type MediaItem,
  type MediaKind,
  type SiteSettings,
  type PaymentProviderPublic,
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

function AdminStudio() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] =
    useState<SiteSettings>(getLocalSettings());

  const [status, setStatus] = useState('');

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState({
    percentage: 0,
    bytesUploaded: 0,
    bytesTotal: 0,
    phase: 'starting' as
      | 'starting'
      | 'uploading'
      | 'finalizing'
      | 'complete',
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<
    PaymentProviderPublic[]
  >([]);

  const [email, setEmail] = useState({
    subject: '',
    body: '',
    recipient: 'all',
  });

  const [cmsBlocks, setCmsBlocks] = useState<
    Record<string, unknown>[]
  >([]);

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

  useEffect(() => {
    void (async () => {
      const p = await getMyProfile();

      setProfile(p);

      if (p?.role === 'super_admin') {
        await refresh();

        try {
          setSettings(await getSiteSettings());

          try {
            setPaymentSettings(
              await listAllPaymentProviders(),
            );
          } catch {
            // Payment settings may not yet be configured.
          }
        } catch {
          // Keep local settings if remote settings cannot load.
        }
      }
    })();
  }, []);

  async function refresh() {
    try {
      setMedia(await listAllMedia());
      setAnnouncements(await listAllAnnouncements());

      const sb = getSupabase();

      if (sb) {
        const { data } = await sb
          .from('cms_content_blocks')
          .select('*')
          .order('page_key')
          .order('sort_order');

        setCmsBlocks(
          (data || []) as Record<string, unknown>[],
        );
      }
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : 'Could not load the control centre.',
      );
    }
  }

  const counts = useMemo(
    () =>
      Object.keys(kindLabels).map((k) => ({
        kind: k as MediaKind,
        count: media.filter((x) => x.kind === k).length,
      })),
    [media],
  );

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
            Only the designated Super Admin account can use
            this studio.
          </p>
        </div>
      </section>
    );
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
      const url = await uploadMediaFile(
        file,
        (progress) => {
          setUploadProgress(progress);

          setStatus(
            progress.phase === 'complete'
              ? `Upload complete: ${file.name}`
              : progress.phase === 'finalizing'
                ? `Upload ${Math.round(
                    progress.percentage,
                  )}% — finalizing…`
                : `Uploading ${file.name} — ${Math.round(
                    progress.percentage,
                  )}%`,
          );
        },
      );

      setForm((x) => ({
        ...x,
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
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : 'Upload failed.',
      );
    } finally {
      setUploading(false);
    }
  }

  async function saveContent() {
    if (!form.title.trim()) {
      setStatus('Add a title before publishing.');
      return;
    }

    if (!form.url.trim()) {
      setStatus(
        'Add a URL or upload a file before publishing.',
      );
      return;
    }

    try {
      setStatus('Saving content… Please wait…');

      await saveMedia({
        id: editing?.id || makeMediaId(),
        title: form.title.trim(),
        description: form.description.trim(),
        kind: form.kind,
        source: form.source,
        url: form.url.trim(),
        thumbnailUrl:
          form.thumbnailUrl.trim() || undefined,
        downloadUrl:
          form.downloadUrl.trim() || undefined,
        published: form.published,
        featured: form.featured,
        createdAt:
          editing?.createdAt ||
          new Date().toISOString(),
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

      setUploadProgress({
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: 0,
        phase: 'starting',
      });

      setStatus('Content saved successfully.');

      await refresh();
    } catch (e) {
      setStatus(
        e instanceof Error
          ? `Could not save content: ${e.message}`
          : 'Could not save content.',
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

  async function sendEmail() {
    try {
      setStatus('Sending email… Please wait…');

      const s = getSupabase();

      if (!s) {
        throw new Error('Connect Supabase first.');
      }

      const { data, error } =
        await s.functions.invoke(
          'send-admin-email',
          {
            body: {
              subject: email.subject,
              body: email.body,
              recipient: email.recipient,
            },
          },
        );

      if (error) throw error;

      setStatus(
        data?.message ||
          'Email request accepted.',
      );

      setEmail({
        subject: '',
        body: '',
        recipient: 'all',
      });
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : 'Email could not be sent.',
      );
    }
  }

  async function setUserRole(
    userId: string,
    role: string,
  ) {
    try {
      setStatus('Updating role… Please wait…');

      const s = getSupabase();

      if (!s) {
        throw new Error('Connect Supabase first.');
      }

      const { data, error } =
        await s.functions.invoke(
          'manage-user-role',
          {
            body: {
              userId,
              role,
            },
          },
        );

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                role: data?.role || role,
              }
            : u,
        ),
      );

      setStatus('User role updated.');
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : 'Could not update user role.',
      );
    }
  }

  async function loadUsers() {
    try {
      const s = getSupabase();

      if (!s) {
        throw new Error('Connect Supabase first.');
      }

      const { data, error } =
        await s.functions.invoke(
          'admin-directory',
          {
            body: {},
          },
        );

      if (error) throw error;

      setUsers(data?.users || []);
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : 'Could not load user directory.',
      );
    }
  }

  async function saveCmsBlock() {
    const sb = getSupabase();

    if (!sb) {
      throw new Error('Connect Supabase first.');
    }

    const {
      data: { user },
    } = await sb.auth.getUser();

    const { error } = await sb
      .from('cms_content_blocks')
      .upsert(
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
        {
          onConflict: 'page_key,block_key',
        },
      );

    if (error) throw error;

    setStatus('Editable content block saved.');

    await refresh();
  }

  async function saveNotice() {
    try {
      await saveAnnouncement({
        id: notice.id || crypto.randomUUID(),
        title: notice.title,
        body: notice.body,
        linkUrl: notice.linkUrl || null,
        published: notice.published,
        floating: notice.floating,
        startsAt: notice.startsAt
          ? new Date(
              notice.startsAt,
            ).toISOString()
          : null,
        endsAt: notice.endsAt
          ? new Date(
              notice.endsAt,
            ).toISOString()
          : null,
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

      setStatus(
        'Announcement published. It can appear in the floating banner and notification bar.',
      );

      await refresh();
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : 'Could not save announcement.',
      );
    }
  }

  function formatBytes(bytes: number) {
    if (!bytes) return '0 B';

    const units = [
      'B',
      'KB',
      'MB',
      'GB',
      'TB',
    ];

    const i = Math.min(
      units.length - 1,
      Math.floor(
        Math.log(bytes) / Math.log(1024),
      ),
    );

    return `${(
      bytes /
      1024 ** i
    ).toFixed(i ? 1 : 0)} ${units[i]}`;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">
          Super Admin Studio
        </p>

        <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">
          Control content, branding, announcements and
          client communication.
        </h1>

        <p className="mt-3 max-w-4xl text-on-navy">
          All customer-facing integrations stay in the
          background. Customers see only Phenom Best Academy,
          secure checkout screens when needed, and simple
          “Working… Please wait…” states.
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
        {counts.slice(0, 4).map((x) => (
          <div
            key={x.kind}
            className="rounded-2xl border border-line bg-cream p-5"
          >
            <p className="text-xs uppercase tracking-wide text-muted">
              {kindLabels[x.kind]}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {x.count}
            </p>
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
            Create or edit news, resources, videos, audio,
            PDFs and links. Nothing is public until you
            publish it.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>

              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div>
             
