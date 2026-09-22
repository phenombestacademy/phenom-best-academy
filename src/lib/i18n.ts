export const supportedLocales = [
  ['en-NG','English — Nigeria'],['en-GB','English — United Kingdom'],['en-US','English — United States'],['en-AU','English — Australia'],['en-CA','English — Canada'],['pcm-NG','Nigerian Pidgin English'],
  ['fr-FR','Français'],['es-ES','Español'],['zh-CN','Mandarin / Chinese'],['pt-PT','Português'],['ar','العربية'],['de-DE','Deutsch'],['it-IT','Italiano'],['ru-RU','Русский'],['yo-NG','Yorùbá'],['ig-NG','Igbo'],['ha-NG','Hausa'],
  ['sw-KE','Kiswahili — Kenya / East Africa'],['sw-TZ','Kiswahili — Tanzania'],['nl-NL','Nederlands'],['pl-PL','Polski'],['tr-TR','Türkçe'],['ko-KR','한국어'],['ja-JP','日本語'],['hi-IN','हिन्दी'],['bn-BD','বাংলা'],['ur-PK','اردو'],['fa-IR','فارسی'],['he-IL','עברית'],['id-ID','Bahasa Indonesia'],['ms-MY','Bahasa Melayu'],['th-TH','ไทย'],['vi-VN','Tiếng Việt'],['fil-PH','Filipino'],['uk-UA','Українська'],['ro-RO','Română'],['cs-CZ','Čeština'],['el-GR','Ελληνικά'],['da-DK','Dansk'],['sv-SE','Svenska'],['no-NO','Norsk'],['fi-FI','Suomi'],['hu-HU','Magyar'],['am-ET','አማርኛ'],['so-SO','Soomaali'],['zu-ZA','isiZulu'],['xh-ZA','isiXhosa']
] as const;

export type SupportedLocale = typeof supportedLocales[number][0];
const KEY = 'phenom-locale-v4';

function localeFromTag(tag: string): SupportedLocale | null {
  const normalized = tag.trim().toLowerCase();
  const exact = supportedLocales.find(([code]) => code.toLowerCase() === normalized);
  if (exact) return exact[0];
  const language = normalized.split('-')[0];
  return supportedLocales.find(([code]) => code.toLowerCase().split('-')[0] === language)?.[0] || null;
}

/**
 * Nigerian English is the product-wide default. Browser/device language is
 * deliberately NOT allowed to override it. A learner may change the locale
 * at any time and the preference persists locally and, when signed in, in
 * the user's Phenom profile.
 */
export function getLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en-NG';
  const saved = window.localStorage.getItem(KEY);
  return saved ? localeFromTag(saved) || 'en-NG' : 'en-NG';
}

export function setLocale(locale: SupportedLocale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' || locale === 'fa-IR' || locale === 'ur-PK' || locale === 'he-IL' ? 'rtl' : 'ltr';
  window.dispatchEvent(new CustomEvent('phenom-locale-change', { detail: locale }));
}

export function initLocale(): SupportedLocale {
  const locale = getLocale();
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' || locale === 'fa-IR' || locale === 'ur-PK' || locale === 'he-IL' ? 'rtl' : 'ltr';
  }
  return locale;
}

/*
 * Pre-translated interface resources live here (or in future locale modules).
 * There is intentionally NO runtime translation API, MutationObserver,
 * network translation request, or page-by-page translation pass.
 *
 * The fallback is Nigerian English until a locale's reviewed resource pack
 * exists. This guarantees that changing locale never blocks navigation,
 * forms, authentication, LMS activity, payments, or other functionality.
 */
const CORE_LABELS: Record<string, Partial<Record<SupportedLocale, string>>> = {
  About: { 'fr-FR':'À propos', 'es-ES':'Acerca de', 'pt-PT':'Sobre', 'de-DE':'Über uns', 'it-IT':'Chi siamo' },
  Services: { 'fr-FR':'Services', 'es-ES':'Servicios', 'pt-PT':'Serviços', 'de-DE':'Dienstleistungen', 'it-IT':'Servizi' },
  Programmes: { 'fr-FR':'Programmes', 'es-ES':'Programas', 'pt-PT':'Programas', 'de-DE':'Programme', 'it-IT':'Programmi' },
  Leadership: { 'fr-FR':'Direction', 'es-ES':'Liderazgo', 'pt-PT':'Liderazgo', 'de-DE':'Leaderschaft', 'it-IT':'Leadership' },
  Contact: { 'fr-FR':'Contact', 'es-ES':'Contacto', 'pt-PT':'Contacto', 'de-DE':'Kontakt', 'it-IT':'Contatti' },
  Careers: { 'fr-FR':'Carrières', 'es-ES':'Empleo', 'pt-PT':'Carreiras', 'de-DE':'Karriere', 'it-IT':'Carriere' },
  'Media & Resources': { 'fr-FR':'Médias et ressources', 'es-ES':'Medios y recursos', 'pt-PT':'Media e recursos', 'de-DE':'Medien und Ressourcen', 'it-IT':'Medien & Ressourcen' },
  'Sign in': { 'fr-FR':'Se connecter', 'es-ES':'Iniciar sesión', 'pt-PT':'Entrar', 'de-DE':'Anmelden', 'it-IT':'Anmelden' },
  Logout: { 'fr-FR':'Se déconnecter', 'es-ES':'Cerrar sesión', 'pt-PT':'Sair', 'de-DE':'Abmelden', 'it-IT':'Esci' },
  Enquire: { 'fr-FR':'Demander', 'es-ES':'Consultar', 'pt-PT':'Consultar', 'de-DE':'Anfragen', 'it-IT':'Richiedi informazioni' },
  'Make an enquiry': { 'fr-FR':'Faire une demande', 'es-ES':'Hacer una consulta', 'pt-PT':'Fazer uma consulta', 'de-DE':'Anfrage stellen', 'it-IT':'Invia una richiesta' },
  'Find your path': { 'fr-FR':'Trouvez votre parcours', 'es-ES':'Encuentra tu camino', 'pt-PT':'Encontre o seu percurso', 'de-DE':'Finden Sie Ihren Weg', 'it-IT':'Trova il tuo percorso' },
  Notifications: { 'fr-FR':'Notifications', 'es-ES':'Notificaciones', 'pt-PT':'Notificações', 'de-DE':'Benachrichtigungen', 'it-IT':'Notifiche' },
  'No new notifications.': { 'fr-FR':'Aucune nouvelle notification.', 'es-ES':'No hay nuevas notificaciones.', 'pt-PT':'Não há novas notificações.', 'de-DE':'Keine neuen Benachrichtigungen.', 'it-IT':'Nessuna nuova notifica.' },
};

export function t(text: string, locale: SupportedLocale = getLocale()): string {
  if (locale.startsWith('en-')) return text;
  return CORE_LABELS[text]?.[locale] || text;
}
