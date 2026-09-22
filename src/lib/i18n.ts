export const supportedLocales = [
  ['en-NG','English — Nigeria'],['en-GB','English — United Kingdom'],['en-US','English — United States'],['en-AU','English — Australia'],['en-CA','English — Canada'],['pcm-NG','Nigerian Pidgin English'],
  ['fr-FR','Français'],['es-ES','Español'],['zh-CN','Mandarin / Chinese'],['pt-PT','Português'],['ar','العربية'],['de-DE','Deutsch'],['it-IT','Italiano'],['ru-RU','Русский'],['yo-NG','Yorùbá'],['ig-NG','Igbo'],['ha-NG','Hausa'],
  ['sw-KE','Kiswahili — Kenya / East Africa'],['sw-TZ','Kiswahili — Tanzania'],['nl-NL','Nederlands'],['pl-PL','Polski'],['tr-TR','Türkçe'],['ko-KR','한국어'],['ja-JP','日本語'],['hi-IN','हिन्दी'],['bn-BD','বাংলা'],['ur-PK','اردو'],['fa-IR','فارسی'],['he-IL','עברית'],['id-ID','Bahasa Indonesia'],['ms-MY','Bahasa Melayu'],['th-TH','ไทย'],['vi-VN','Tiếng Việt'],['fil-PH','Filipino'],['uk-UA','Українська'],['ro-RO','Română'],['cs-CZ','Čeština'],['el-GR','Ελληνικά'],['da-DK','Dansk'],['sv-SE','Svenska'],['no-NO','Norsk'],['fi-FI','Suomi'],['hu-HU','Magyar'],['am-ET','አማርኛ'],['so-SO','Soomaali'],['zu-ZA','isiZulu'],['xh-ZA','isiXhosa']
] as const;
export type SupportedLocale = typeof supportedLocales[number][0];
const KEY='phenom-locale-v3';
const ONBOARDING_KEY='phenom-onboarding-locale-v1';
const ORIGINAL = new WeakMap<Text,string>();

function localeFromTag(tag:string):SupportedLocale|null{
  const normalized=tag.trim().toLowerCase();
  const exact=supportedLocales.find(([code])=>code.toLowerCase()===normalized);
  if(exact)return exact[0];
  const language=normalized.split('-')[0];
  const regional=supportedLocales.find(([code])=>code.toLowerCase().split('-')[0]===language);
  return regional?.[0]||null;
}

function detectDefaultLocale():SupportedLocale{
  if(typeof window==='undefined')return'en-NG';
  const onboarding=window.localStorage.getItem(ONBOARDING_KEY);
  const savedOnboarding=onboarding?localeFromTag(onboarding):null;
  if(savedOnboarding)return savedOnboarding;

  const browserLanguages=[...(navigator.languages||[]),navigator.language||''];
  for(const tag of browserLanguages){
    const detected=localeFromTag(tag);
    if(detected)return detected;
  }

  try{
    const timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(timeZone==='Africa/Lagos')return'en-NG';
  }catch{}

  return'en-NG';
}
let observer: MutationObserver | null = null; let translating=false; let queued=false;
export function getLocale():SupportedLocale{
  if(typeof window==='undefined')return'en-NG';
  const saved=window.localStorage.getItem(KEY);
  const detectedSaved=saved?localeFromTag(saved):null;
  return detectedSaved||detectDefaultLocale();
}
export function setLocale(locale:SupportedLocale){
  if(typeof window==='undefined')return;
  window.localStorage.setItem(KEY,locale);
  window.localStorage.setItem(ONBOARDING_KEY,locale);
  document.documentElement.lang=locale;
  if(locale.startsWith('en-')){
    if(observer){ observer.disconnect(); observer=null; }
    translating=false;
  }
  window.dispatchEvent(new Event('phenom-locale-change'));
  void translateVisibleContent(locale);
  if(!locale.startsWith('en-')) startAutoTranslation();
}
export function initLocale(){const locale=getLocale();if(typeof document!=='undefined')document.documentElement.lang=locale;return locale;}
function isExcluded(node:Text){const parent=node.parentElement;if(!parent)return true;if(parent.closest('script,style,noscript,textarea,input,select,option,[data-no-translate],[contenteditable="true"]'))return true;const text=node.nodeValue?.trim()||'';if(text.length<2||/^https?:\/\//i.test(text)||/^mailto:/i.test(text)||/^\+?\d[\d\s().-]{5,}$/.test(text))return true;return false;}
function collect(){const nodes:Text[]=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n:Node|null;while((n=walker.nextNode())){const t=n as Text;if(!isExcluded(t)){if(!ORIGINAL.has(t))ORIGINAL.set(t,t.nodeValue||'');nodes.push(t);}}return nodes;}
function restore(){const nodes=collect();for(const n of nodes){const o=ORIGINAL.get(n);if(o!==undefined)n.nodeValue=o;}}
async function translateBatch(locale:SupportedLocale,texts:string[]):Promise<string[]>{const supabaseUrl=import.meta.env.VITE_SUPABASE_URL as string|undefined;const anon=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;if(!supabaseUrl||!anon)return texts;const r=await fetch(`${supabaseUrl}/functions/v1/translate-ui`,{method:'POST',headers:{'Content-Type':'application/json','apikey':anon},body:JSON.stringify({locale,texts})});if(!r.ok)return texts;const p=await r.json();return Array.isArray(p.translations)?p.translations:texts;}
export async function translateVisibleContent(locale:SupportedLocale=getLocale()){if(typeof document==='undefined'||locale.startsWith('en-')){restore();return;}if(translating)return;translating=true;try{const nodes=collect();const unique=[...new Set(nodes.map(n=>(ORIGINAL.get(n)||n.nodeValue||'').trim()).filter(Boolean))];const map=new Map<string,string>();for(let i=0;i<unique.length;i+=45){const batch=unique.slice(i,i+45);const out=await translateBatch(locale,batch);batch.forEach((x,j)=>map.set(x,out[j]||x));}for(const n of nodes){const o=(ORIGINAL.get(n)||n.nodeValue||'').trim();const translated=map.get(o);if(translated&&translated!==o)n.nodeValue=(n.nodeValue||'').replace(o,translated);}}finally{translating=false;}}
export function startAutoTranslation(){
  if(typeof window==='undefined'||observer||getLocale().startsWith('en-'))return;
  const run=()=>{if(queued||translating)return;queued=true;window.setTimeout(()=>{queued=false;void translateVisibleContent(getLocale());},180);};
  observer=new MutationObserver(run);
  observer.observe(document.body,{childList:true,subtree:true});
  run();
}
