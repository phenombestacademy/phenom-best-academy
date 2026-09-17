import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calculator,
  Camera,
  FlaskConical,
  Languages,
  RefreshCw,
  ScanText,
  Trash2,
  Barcode,
  Copy,
  Brain,
  Minimize2,
  Maximize2,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getCurrencyCodes,
  currencyName,
  getLiveCurrencyRates,
  convertCurrency,
  type CurrencyState,
} from '@/lib/currency';
import { getSupabase } from '@/lib/cms';

export const Route = createFileRoute('/tools')({ component: ToolsPage });

const formulas = [
  ['Mathematics', 'Quadratic equation', 'x = (-b ± √(b² - 4ac)) / 2a'],
  ['Mathematics', 'Pythagoras', 'a² + b² = c²'],
  ['Physics', 'Force', 'F = ma'],
  ['Physics', 'Kinetic energy', 'KE = ½mv²'],
  ['Physics', 'Ohm’s law', 'V = IR'],
  ['Chemistry', 'Moles', 'n = m / M'],
  ['Chemistry', 'Concentration', 'c = n / V'],
];

type Snap = {
  id: string;
  name: string;
  text: string;
  createdAt: string;
};

function ToolsPage() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [calculatorFullscreen, setCalculatorFullscreen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  async function toggleCalculatorFullscreen() {
    if (!calculatorRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await calculatorRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  }

  useEffect(() => {
    const f = () =>
      setCalculatorFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener('fullscreenchange', f);

    return () => document.removeEventListener('fullscreenchange', f);
  }, []);

  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');
  const [translationTarget, setTranslationTarget] = useState('French');
  const [translationInput, setTranslationInput] = useState('');
  const [translationOutput, setTranslationOutput] = useState('');
  const [translationBusy, setTranslationBusy] = useState(false);
  const [translationPremium, setTranslationPremium] = useState(false);
  const [sentenceCount, setSentenceCount] = useState(0);

  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined'
      ? []
      : JSON.parse(
          window.localStorage.getItem('phenom-calculator-history') || '[]',
        ),
  );

  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('NGN');
  const [amount, setAmount] = useState('1');
  const [currency, setCurrency] = useState<CurrencyState | null>(null);
  const [loadingCurrency, setLoadingCurrency] = useState(true);

  const [text, setText] = useState('');
  const [snapshots, setSnapshots] = useState<Snap[]>([]);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [barcodeText, setBarcodeText] = useState('');
  const barcodeRef = useRef<HTMLDivElement>(null);

  const [textSize, setTextSize] = useState('medium');

  const codes = useMemo(() => getCurrencyCodes(), []);

  useEffect(() => {
    getLiveCurrencyRates()
      .then(setCurrency)
      .finally(() => setLoadingCurrency(false));

    (async () => {
      try {
        const s = getSupabase();
        const session = await s?.auth.getSession();

        if (s && session?.data.session) {
          const { data } = await s.rpc('has_premium_access', {
            p_service_code: 'calculator-premium',
            p_user_id: session.data.session.user.id,
          });

          setTranslationPremium(Boolean(data));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'phenom-calculator-history',
      JSON.stringify(history.slice(0, 100)),
    );
  }, [history]);

  const calculate = () => {
    try {
      const clean = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/[^0-9+\-*/().%\s]/g, '');

      if (!clean.trim()) return;

      const value = Function(`"use strict"; return (${clean})`)();

      const out = Number.isFinite(value) ? String(value) : 'Error';

      setResult(out);
      setHistory((h) => [`${expr} = ${out}`, ...h].slice(0, 100));
    } catch {
      setResult('Error');
    }
  };

  const scientific = (fn: string) => {
    const x = Number(expr);

    if (!Number.isFinite(x)) {
      setResult('Enter a number first.');
      return;
    }

    const map: Record<string, number> = {
      sin: Math.sin((x * Math.PI) / 180),
      cos: Math.cos((x * Math.PI) / 180),
      tan: Math.tan((x * Math.PI) / 180),
      log: Math.log10(x),
      ln: Math.log(x),
      sqrt: Math.sqrt(x),
      square: x * x,
    };

    setResult(String(map[fn]));
  };

  const converted = currency
    ? convertCurrency(Number(amount), from, to, currency.rates)
    : null;

  const size =
    textSize === 'large'
      ? 'text-lg'
      : textSize === 'small'
        ? 'text-sm'
        : 'text-base';

  async function translateTextNow() {
    const input = translationInput.trim();

    if (!input) return;

    const sentences =
      (input.match(/[.!?]+(?=\s|$)/g) || []).length || 1;

    setSentenceCount(sentences);

    if (!translationPremium && sentences > 5) {
      setTranslationOutput(
        'Limited Calculator translation allows up to 5 sentences at a time. Individual word translation remains available without this sentence limit. Premium removes the sentence limit.',
      );
      return;
    }

    setTranslationBusy(true);

    try {
      const s = getSupabase();

      if (!s) {
        throw new Error(
          'Connect the Academy language service to use translation.',
        );
      }

      const { data, error } = await s.functions.invoke('ai-router', {
        body: {
          mode: 'reasoning',
          prompt: `Translate the following text into ${translationTarget}. Preserve punctuation, numbers, names and line breaks. Do not add commentary. If the input is a single word, give only its direct translation.

${input}`,
        },
      });

      if (error) throw error;

      setTranslationOutput(String(data?.text || ''));
    } catch (e) {
      setTranslationOutput(
        e instanceof Error ? e.message : 'Translation failed.',
      );
    } finally {
      setTranslationBusy(false);
    }
  }

  async function extractImage(file: File) {
    setOcrBusy(true);

    try {
      const s = getSupabase();

      if (!s) {
        throw new Error(
          'Connect the Academy processing service to use image/text extraction.',
        );
      }

      const data = await fileToDataUrl(file);

      const { data: out, error } = await s.functions.invoke('ai-router', {
        body: {
          mode: 'reasoning',
          image: data,
          prompt:
            'Transcribe this image verbatim. Preserve every word, number, punctuation mark, line break and spelling. Do not solve or correct it. Then provide a separate section called ANALYSIS explaining what was detected. If it contains a maths/science assignment, also solve it step-by-step after the verbatim transcription.',
        },
      });

      if (error) throw error;

      setOcrResult(String(out?.text || 'No text returned.'));

      setSnapshots((prev) =>
        [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            text: String(out?.text || ''),
            createdAt: new Date().toISOString(),
          },
        ].slice(-10),
      );
    } catch (e) {
      setOcrResult(
        e instanceof Error ? e.message : 'Extraction failed.',
      );
    } finally {
      setOcrBusy(false);
    }
  }

  async function decodeAll() {
    if (!snapshots.length) return;

    setOcrBusy(true);

    try {
      const s = getSupabase();

      if (!s) {
        throw new Error(
          'Connect the Academy processing service to combine snapshots.',
        );
      }

      const prompt = `Work with these up to 10 consecutive snapshots as one document. Preserve verbatim text first, then solve/decode/explain what is appropriate.

${snapshots
  .map((x, i) => `SNAPSHOT ${i + 1}:\n${x.text}`)
  .join('\n\n')}`;

      const { data, error } = await s.functions.invoke('ai-router', {
        body: {
          mode: 'reasoning',
          prompt,
        },
      });

      if (error) throw error;

      setOcrResult(String(data?.text || ''));
    } catch (e) {
      setOcrResult(
        e instanceof Error
          ? e.message
          : 'Could not process snapshots.',
      );
    } finally {
      setOcrBusy(false);
    }
  }

  function clearSnapshots() {
    setSnapshots([]);
    setOcrResult('');
  }

  function makeBarcode() {
    const value = barcodeText.trim();

    if (!value || !barcodeRef.current) return;

    barcodeRef.current.innerHTML = '';

    const svg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    svg.setAttribute('viewBox', '0 0 420 100');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Barcode ${value}`);

    let x = 10;

    for (let i = 0; i < value.length; i++) {
      const n = value.charCodeAt(i);

      for (let b = 0; b < 7; b++) {
        if ((n >> (b % 8)) & 1) {
          const r = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'rect',
          );

          r.setAttribute('x', String(x));
          r.setAttribute('y', '10');
          r.setAttribute('width', String((b % 2) + 1));
          r.setAttribute('height', '70');

          svg.appendChild(r);
        }

        x += 2 + (b % 2);
      }
    }

    barcodeRef.current.appendChild(svg);
  }

  async function readBarcode(file: File) {
    const w = window as any;

    if (w.BarcodeDetector) {
      try {
        const d = new w.BarcodeDetector({
          formats: [
            'code_128',
            'code_39',
            'ean_13',
            'ean_8',
            'qr_code',
          ],
        });

        const out = await d.detect(await createImageBitmap(file));

        setBarcodeText(
          out.map((x: any) => x.rawValue).join('\n') ||
            'No barcode detected.',
        );

        return;
      } catch {}
    }

    await extractImage(file);
  }

  return (
    <section
      className={`mx-auto max-w-6xl px-4 py-10 sm:px-6 ${size}`}
    >
      <div className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">
          Phenom Calculator
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold text-green-400 sm:text-6xl">
          Calculate, scan, extract, translate and learn.
        </h1>

        <p className="mt-5 max-w-4xl text-cream/75">
          Phenom Calculator is the Academy processing display for
          mathematics, engineering, science, English learning,
          multilingual text extraction, translation and barcode
          workflows. CPD subscription content is not included in the
          calculator.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div
          ref={calculatorRef}
          className={`rounded-2xl border border-line bg-cream p-6 ${
            calculatorFullscreen ? 'h-screen overflow-auto' : ''
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calculator className="text-orange" />
              <h2 className="font-display text-2xl font-semibold">
                Calculator
              </h2>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={toggleCalculatorFullscreen}
              >
                {calculatorFullscreen ? (
                  <Minimize2 className="mr-2 size-4" />
                ) : (
                  <Maximize2 className="mr-2 size-4" />
                )}
                {calculatorFullscreen
                  ? 'Exit full screen'
                  : 'Full screen'}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowKeyboard((v) => !v)}
              >
                <Keyboard className="mr-2 size-4" />
                {showKeyboard ? 'Hide' : 'Show'} on-screen keyboard
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant={mode === 'basic' ? 'default' : 'outline'}
              onClick={() => setMode('basic')}
            >
              Basic
            </Button>

            <Button
              variant={
                mode === 'scientific' ? 'default' : 'outline'
              }
              onClick={() => setMode('scientific')}
            >
              Scientific
            </Button>
          </div>

          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
            className="mt-4 w-full rounded-xl border border-line bg-white p-4 text-right text-2xl"
            placeholder="12 × 4 + 5"
          />

          <div className="mt-3 min-h-10 rounded-xl bg-paper p-3 text-right font-semibold">
            {result}
          </div>

          <div
            className={`mt-4 grid grid-cols-4 gap-2 ${
              showKeyboard ? '' : 'hidden'
            }`}
          >
            {[
              '7',
              '8',
              '9',
              '÷',
              '4',
              '5',
              '6',
              '×',
              '1',
              '2',
              '3',
              '-',
              '0',
              '.',
              '%',
              '+',
            ].map((x) => (
              <button
                key={x}
                className="rounded-xl border border-line bg-white px-4 py-3"
                onClick={() => setExpr((e) => e + x)}
              >
                {x}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button onClick={calculate}>Calculate</Button>

            <Button
              variant="outline"
              onClick={() => {
                setExpr('');
                setResult('');
              }}
            >
              Clear
            </Button>
          </div>

          {mode === 'scientific' && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                'sin',
                'cos',
                'tan',
                'log',
                'ln',
                'sqrt',
                'square',
              ].map((x) => (
                <button
                  key={x}
                  className="rounded-xl border border-line bg-white px-4 py-3"
                  onClick={() => scientific(x)}
                >
                  {x === 'square' ? 'x²' : x}
                </button>
              ))}

              <button
                className="rounded-xl border border-line bg-white px-4 py-3"
                onClick={() =>
                  setExpr((e) => e + '3.141592653589793')
                }
              >
                π
              </button>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold">History & memory</h3>

            <div className="mt-2 max-h-40 overflow-auto rounded-xl bg-paper p-3 text-sm">
              {history.length
                ? history.map((h, i) => (
                    <div key={i}>{h}</div>
                  ))
                : 'No calculations yet.'}
            </div>

            <Button
              className="mt-2"
              variant="outline"
              onClick={() => setHistory([])}
            >
              <Trash2 className="mr-2 size-4" />
              Clear history
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-cream p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="text-purple" />
            <h2 className="font-display text-2xl font-semibold">
              Live currency converter
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border border-line p-3"
            />

            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-line p-3"
            >
              {codes.map((c) => (
                <option key={c}>
                  {c} — {currencyName(c)}
                </option>
              ))}
            </select>

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-line p-3"
            >
              {codes.map((c) => (
                <option key={c}>
                  {c} — {currencyName(c)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 rounded-2xl bg-paper p-5 text-3xl font-bold">
            {converted === null
              ? '—'
              : `${converted.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })} ${to}`}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              Swap
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setLoadingCurrency(true);
                getLiveCurrencyRates(true)
                  .then(setCurrency)
                  .finally(() => setLoadingCurrency(false));
              }}
            >
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>

            {loadingCurrency && (
              <span className="text-sm text-muted">
                Loading rates…
              </span>
            )}
          </div>

          <div className="mt-8">
            <label className="text-sm font-semibold">
              Display text size

              <select
                value={textSize}
                onChange={(e) => setTextSize(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line p-3"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          icon={<ScanText className="text-orange" />}
          title="Multi-snapshot Scanner & Processing"
        >
          <p className="text-sm text-muted">
            Add up to 10 consecutive snapshots. Images are processed
            securely for text extraction, solving, explanation and
            decoding. This page does not persist image files. The
            returned text can be copied, solved, explained or decoded.
          </p>

          <input
            ref={fileRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void extractImage(f);
            }}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={ocrBusy}
            >
              <Camera className="mr-2 size-4" />
              {ocrBusy
                ? 'Working… Please wait…'
                : 'Add snapshot'}
            </Button>

            <Button
              variant="outline"
              onClick={() => void decodeAll()}
              disabled={ocrBusy || !snapshots.length}
            >
              <Brain className="mr-2 size-4" />
              Process all {snapshots.length}/10
            </Button>

            <Button
              variant="outline"
              onClick={clearSnapshots}
            >
              <Trash2 className="mr-2 size-4" />
              Clear
            </Button>
          </div>

          <div className="mt-4 grid gap-2">
            {snapshots.map((s, i) => (
              <div
                key={s.id}
                className="rounded-xl bg-paper p-3 text-sm"
              >
                <strong>Snapshot {i + 1}</strong>

                <p className="mt-1 line-clamp-2 whitespace-pre-wrap">
                  {s.text}
                </p>
              </div>
            ))}
          </div>

          {ocrResult && (
            <div className="mt-4 rounded-xl border border-line bg-white p-4">
              <div className="flex justify-between">
                <strong>Extracted / processed result</strong>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard?.writeText(ocrResult)
                  }
                >
                  <Copy className="mr-1 size-4" />
                  Copy
                </Button>
              </div>

              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-sm">
                {ocrResult}
              </pre>
            </div>
          )}

          <p className="mt-3 text-xs text-muted">
            Privacy: captured images are sent only to the configured
            processing endpoint for the requested operation; this UI
            does not save them to Academy storage. Users should keep
            any desired copy on their own device.
          </p>
        </Panel>

        <Panel
          icon={<Languages className="text-purple" />}
          title="Translation & English learning"
        >
          <p className="text-sm text-muted">
            The limited calculator supports unlimited individual-word
            translation and up to 5 sentences per translation request.
            Premium removes the sentence limit and supports unlimited
            words and sentences, subject to fair-use and provider
            limits.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={translationTarget}
              onChange={(e) =>
                setTranslationTarget(e.target.value)
              }
              className="rounded-xl border border-line bg-white p-3"
              list="phenom-language-list"
              placeholder="Target language"
            />

            <datalist id="phenom-language-list">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
              <option>Mandarin / Chinese</option>
              <option>Portuguese</option>
              <option>Arabic</option>
              <option>German</option>
              <option>Italian</option>
              <option>Russian</option>
              <option>Yoruba</option>
              <option>Igbo</option>
              <option>Hausa</option>
              <option>Nigerian Pidgin English</option>
            </datalist>

            <label className="flex items-center gap-2 rounded-xl border border-line bg-white p-3 text-sm">
              <input
                type="checkbox"
                checked={translationPremium}
                readOnly
              />

              {translationPremium
                ? 'Premium translation enabled'
                : 'Limited translation'}
            </label>
          </div>

          <textarea
            value={translationInput}
            onChange={(e) =>
              setTranslationInput(e.target.value)
            }
            className="mt-3 min-h-28 w-full rounded-xl border border-line bg-white p-4"
            placeholder="Enter a word, phrase or sentences…"
          />

          <div className="mt-3 flex gap-2">
            <Button
              onClick={translateTextNow}
              disabled={translationBusy}
            >
              {translationBusy ? 'Translating…' : 'Translate'}
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigator.clipboard?.writeText(
                  translationOutput,
                )
              }
              disabled={!translationOutput}
            >
              <Copy className="mr-2 size-4" />
              Copy
            </Button>
          </div>

          {translationOutput && (
            <div className="mt-3 rounded-xl bg-paper p-4 whitespace-pre-wrap">
              {translationOutput}
            </div>
          )}

          <p className="mt-2 text-xs text-muted">
            Detected sentence count: {sentenceCount}. The premium
            control is an entitlement preview; production access is
            enforced by the signed-in account.
          </p>
        </Panel>

        <Panel
          icon={<Languages className="text-purple" />}
          title="English & language learning"
        >
          <p className="text-sm text-muted">
            Use the same processing display for spelling, grammar,
            pronunciation, meaning, sentence correction, reading
            comprehension and limited translation. Extended
            language-service usage should be routed to the Academy
            language service subscription.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-4 min-h-32 w-full rounded-xl border border-line bg-white p-4"
            placeholder="Type English or another supported language here…"
          />

          <div className="mt-3 flex gap-2">
            <Button
              onClick={async () => {
                const s = getSupabase();

                if (!s) return;

                const { data } = await s.functions.invoke(
                  'ai-router',
                  {
                    body: {
                      mode: 'reasoning',
                      prompt: `Teach this school-English/language question. Give meaning, spelling, grammar, pronunciation guidance and examples as applicable. Do not provide CPD content.

${text}`,
                    },
                  },
                );

                setOcrResult(String(data?.text || ''));
              }}
            >
              Teach / explain
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigator.clipboard?.writeText(text)
              }
            >
              <Copy className="mr-2 size-4" />
              Copy
            </Button>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          icon={<Barcode className="text-green" />}
          title="Barcode create & read"
        >
          <input
            value={barcodeText}
            onChange={(e) => setBarcodeText(e.target.value)}
            className="w-full rounded-xl border border-line bg-white p-3"
            placeholder="Enter barcode text"
          />

          <div className="mt-3 flex gap-2">
            <Button onClick={makeBarcode}>
              Create barcode
            </Button>

            <label className="inline-flex cursor-pointer items-center rounded-md border border-line px-4 py-2 text-sm font-semibold">
              Read barcode

              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void readBarcode(f);
                }}
              />
            </label>
          </div>

          <div
            ref={barcodeRef}
            className="mt-4 min-h-28 overflow-auto rounded-xl bg-white p-3"
          />
        </Panel>

        <Panel
          icon={<FlaskConical className="text-green" />}
          title="Formula library"
        >
          {formulas.map(([cat, title, formula]) => (
            <div
              key={title}
              className="mt-2 rounded-xl bg-paper p-3"
            >
              <span className="text-xs font-semibold uppercase text-purple">
                {cat}
              </span>

              <strong className="block">{title}</strong>

              <code className="text-sm">{formula}</code>
            </div>
          ))}
        </Panel>
      </div>
    </section>
  );
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: any;
}) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-6">
      <div className="flex items-center gap-2">
        {icon}

        <h2 className="font-display text-2xl font-semibold">
          {title}
        </h2>
      </div>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();

    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);

    r.readAsDataURL(file);
  });
}
