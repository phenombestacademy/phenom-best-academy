export type CurrencyRateMap = Record<string, number>;

export type CurrencyState = {
  base: string;
  rates: CurrencyRateMap;
  fetchedAt: string | null;
  source: string;
  live: boolean;
};

const API = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'phenom-live-currency-rates-v1';
const CACHE_TTL = 6 * 60 * 60 * 1000;

export const FALLBACK_RATES: CurrencyRateMap = {
  USD: 1, EUR: 0.85, GBP: 0.74, CAD: 1.37, AUD: 1.53, NZD: 1.70, CHF: 0.80,
  CNY: 7.15, JPY: 148, INR: 88, PKR: 283, NGN: 1530, ZAR: 17.2, GHS: 12.8,
  KES: 129, UGX: 3480, TZS: 2470, RWF: 1450, AED: 3.67, SAR: 3.75, QAR: 3.64,
  BHD: 0.376, KWD: 0.307, OMR: 0.384, ILS: 3.35, EGP: 48.5, MAD: 9.9,
  BRL: 5.4, MXN: 18.7, ARS: 1450, CLP: 930, COP: 3900, PEN: 3.5,
  SGD: 1.29, HKD: 7.82, KRW: 1390, THB: 32.5, MYR: 4.25, IDR: 16600,
  PHP: 58, VND: 26300, TRY: 41.5, PLN: 3.65, SEK: 9.2, NOK: 9.7, DKK: 6.35,
  CZK: 21.5, HUF: 330, RON: 4.3, BGN: 1.66, ISK: 123, RUB: 80,
};

export function getCurrencyCodes(): string[] {
  try {
    const values = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.('currency');
    if (values?.length) return values.filter((x) => /^[A-Z]{3}$/.test(x)).sort();
  } catch { /* older browsers */ }
  return Object.keys(FALLBACK_RATES).sort();
}

export function currencyName(code: string, locale = 'en-GB') {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'currency' });
    return names.of(code) || code;
  } catch { return code; }
}

function fromCache(): CurrencyState | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') as CurrencyState & { cachedAt?: number } | null;
    if (cached?.rates && cached.cachedAt && Date.now() - cached.cachedAt < CACHE_TTL) return cached;
  } catch { /* ignore */ }
  return null;
}

export async function getLiveCurrencyRates(force = false): Promise<CurrencyState> {
  if (!force) {
    const cached = fromCache();
    if (cached) return cached;
  }
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    const response = await fetch(API, { signal: controller.signal, headers: { Accept: 'application/json' } });
    window.clearTimeout(timer);
    if (!response.ok) throw new Error(`Currency service returned ${response.status}`);
    const json = await response.json() as { rates?: CurrencyRateMap; time_last_update_utc?: string };
    if (!json.rates?.USD) throw new Error('Currency service returned no USD rates.');
    const state: CurrencyState = { base: 'USD', rates: json.rates, fetchedAt: json.time_last_update_utc || new Date().toISOString(), source: 'ExchangeRate-API open endpoint', live: true };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...state, cachedAt: Date.now() }));
    return state;
  } catch {
    return { base: 'USD', rates: FALLBACK_RATES, fetchedAt: null, source: 'Built-in reference rates', live: false };
  }
}

export function convertCurrency(amount: number, from: string, to: string, rates: CurrencyRateMap) {
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!Number.isFinite(amount) || !fromRate || !toRate) return null;
  return amount * (toRate / fromRate);
}
