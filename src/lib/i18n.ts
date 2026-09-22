const rawSupportedLocales = [
  // Existing Phenom regional/interface locales — preserved.
  ['en-NG','English — Nigeria'],['en-GB','English — United Kingdom'],['en-US','English — United States'],['en-AU','English — Australia'],['en-CA','English — Canada'],['pcm-NG','Nigerian Pidgin English'],
  ['fr-FR','Français'],['es-ES','Español'],['zh-CN','中文（简体）'],['pt-PT','Português — Portugal'],['ar','العربية'],['de-DE','Deutsch'],['it-IT','Italiano'],['ru-RU','Русский'],['yo-NG','Yorùbá'],['ig-NG','Igbo'],['ha-NG','Hausa'],
  ['sw-KE','Kiswahili — Kenya / East Africa'],['sw-TZ','Kiswahili — Tanzania'],['nl-NL','Nederlands'],['pl-PL','Polski'],['tr-TR','Türkçe'],['ko-KR','한국어'],['ja-JP','日本語'],['hi-IN','हिन्दी'],['bn-BD','বাংলা'],['ur-PK','اردو'],['fa-IR','فارسی'],['he-IL','עברית'],['id-ID','Bahasa Indonesia'],['ms-MY','Bahasa Melayu'],['th-TH','ไทย'],['vi-VN','Tiếng Việt'],['fil-PH','Filipino'],['uk-UA','Українська'],['ro-RO','Română'],['cs-CZ','Čeština'],['el-GR','Ελληνικά'],['da-DK','Dansk'],['sv-SE','Svenska'],['no-NO','Norsk'],['fi-FI','Suomi'],['hu-HU','Magyar'],['am-ET','አማርኛ'],['so-SO','Soomaali'],['zu-ZA','isiZulu'],['xh-ZA','isiXhosa'],

  // Additional written languages supported by Google Cloud Translation NMT.
  // They are available as interface-language candidates; reviewed Phenom
  // resource packs are populated independently and never translated at runtime.
  ['ab','Аҧсуа'],['ace','Acehnese'],['ach','Acholi'],['af','Afrikaans'],['sq','Shqip'],['alz','Alur'],['as','অসমীয়া'],['awa','Awadhi'],['ay','Aymara'],['az','Azərbaycan dili'],
  ['ban','Basa Bali'],['bm','Bamanankan'],['ba','Башҡортса'],['eu','Euskara'],['be','Беларуская'],['bem','Bemba'],['bn','বাংলা'],['bho','भोजपुरी'],['bik','Bikol'],['bs','Bosanski'],['br','Brezhoneg'],['bg','Български'],['bua','Буряад'],['yue','粵語'],
  ['ca','Català'],['ceb','Cebuano'],['ny','Chichewa'],['cv','Чӑвашла'],['co','Corsu'],['crh','Qırımtatarca'],['hr','Hrvatski'],['din','Dinka'],['dv','ދިވެހި'],['doi','डोगरी'],['dov','Dombe'],['dz','རྫོང་ཁ'],['eo','Esperanto'],['et','Eesti'],['ee','Eʋegbe'],
  ['fj','Fijian'],['ff','Fulfulde'],['gaa','Ga'],['gl','Galego'],['lg','Luganda'],['ka','ქართული'],['gn','Guaraní'],['gu','ગુજરાતી'],['ht','Kreyòl Ayisyen'],['haw','Hawaiian'],['hil','Hiligaynon'],['hmn','Hmong'],
  ['ilo','Ilokano'],['ga','Gaeilge'],['jv','Basa Jawa'],['kn','ಕನ್ನಡ'],['pam','Kapampangan'],['kk','Қазақша'],['cgg','Rukiga'],['rw','Kinyarwanda'],['ktu','Kituba'],['gom','कोंकणी'],['kri','Krio'],['ku','Kurdî'],['ckb','کوردی'],['ky','Кыргызча'],
  ['lo','ລາວ'],['ltg','Latgalian'],['la','Latina'],['lij','Ligure'],['li','Limburgs'],['ln','Lingála'],['lt','Lietuvių'],['lmo','Lombard'],['luo','Dholuo'],['lb','Lëtzebuergesch'],['mk','Македонски'],['mai','मैथिली'],['mak','Makassar'],['mg','Malagasy'],['ml','മലയാളം'],['mt','Malti'],['mi','Māori'],
  ['chm','Марий'],['mni-Mtei','ꯃꯤꯇꯩ ꯂꯣꯟ'],['min','Baso Minangkabau'],['lus','Mizo'],['mn','Монгол'],['my','မြန်မာ'],['nr','isiNdebele'],['new','नेपाल भाषा'],['nso','Sepedi'],['nus','Nuer'],['oc','Occitan'],['or','ଓଡ଼ିଆ'],['om','Afaan Oromoo'],['pag','Pangasinan'],['pap','Papiamento'],
  ['ps','پښتو'],['pa','ਪੰਜਾਬੀ'],['pa-Arab','پنجابی'],['qu','Runasimi'],['rom','Romani'],['rn','Kirundi'],['gd','Gàidhlig'],['sr','Српски'],['sk','Slovenčina'],['sl','Slovenščina'],['st','Sesotho'],['crs','Kreol Seselwa'],['shn','Shan'],['sn','chiShona'],['scn','Sicilianu'],['szl','Ślōnskŏ'],['sd','سنڌي'],['si','සිංහල'],
  ['ss','siSwati'],['tg','Тоҷикӣ'],['ta','தமிழ்'],['tt','Татарча'],['te','తెలుగు'],['tet','Tetum'],['ti','ትግርኛ'],['ts','Xitsonga'],['tn','Setswana'],['tk','Türkmençe'],['ak','Akan'],['uz','Oʻzbekcha'],['cy','Cymraeg'],['yi','ייִדיש'],['yua','Maya Yucatec'],
  ['hy','Հայերեն'],['km','ខ្មែរ'],['is','Íslenska'],['lv','Latviešu'],['mr','मराठी'],['ne','नेपाली'],['ug','ئۇيغۇرچە'],['brx','बड़ो'],['hne','छत्तीसगढ़ी'],['lzh','文言文'],['prs','دری'],['fo','Føroyskt'],['mww','Hmong Daw'],['otq','Hñähñu'],['sm','Gagana Samoa'],['ty','Reo Tahiti'],['bo','བོད་སྐད་'],['to','Lea Faka-Tonga'],['hsb','Hornjoserbsce'],['fy','Frysk'],['zh-TW','中文（繁體）'],['zh-HK','粵語（香港）'],['zh-Hans','简体中文'],['zh-Hant','繁體中文'],['en-NZ','English — New Zealand'],['en-PH','English — Philippines'],['en-ZA','English — South Africa'],['et-EE','Eesti — Eesti'],['fr-CA','Français — Canada'],['fr-CH','Français — Suisse'],['nl-BE','Nederlands — België'],['pt-BR','Português — Brasil'],
  ['es-MX','Español — México'],['es-AR','Español — Argentina'],['es-419','Español — Latinoamérica'],['nb','Norsk bokmål'],['nb-NO','Norsk bokmål — Norge'],['he','עברית'],['iw','עברית']
 ] as const;

// One canonical, duplicate-free, alphabetically ordered registry for the whole platform.
const uniqueSupportedLocales = Array.from(new Map(rawSupportedLocales.map(([code, label]) => [code, [code, label] as const])).values());
export const supportedLocales = uniqueSupportedLocales.sort((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }));
export type SupportedLocale = typeof rawSupportedLocales[number][0];
const KEY = 'phenom-locale-v4';

function localeFromTag(tag: string): SupportedLocale | null {
  const normalized = tag.trim().toLowerCase();
  const exact = supportedLocales.find(([code]) => code.toLowerCase() === normalized);
  if (exact) return exact[0];
  const language = normalized.split('-')[0];
  return supportedLocales.find(([code]) => code.toLowerCase().split('-')[0] === language)?.[0] || null;
}

/**
 * Browser/device language is used only for the first visit when no explicit
 * preference exists. Location is deliberately never consulted and can never
 * override a language the learner has chosen.
 */
export function getLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en-NG';
  const saved = window.localStorage.getItem(KEY);
  if (saved) return localeFromTag(saved) || 'en-NG';
  const browser = typeof navigator !== 'undefined' ? localeFromTag(navigator.language || '') : null;
  return browser || 'en-NG';
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
