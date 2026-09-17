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
  Delete,
  RotateCcw,
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

type CalculatorMode =
  | 'basic'
  | 'scientific'
  | 'engineering'
  | 'advanced';

type AngleMode = 'DEG' | 'RAD' | 'GRAD';

type VariableName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'X' | 'Y' | 'M';

const VARIABLES: VariableName[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'X',
  'Y',
  'M',
];

function factorial(n: number) {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n) || n > 170) {
    throw new Error('Factorial requires a whole number from 0 to 170.');
  }

  let value = 1;

  for (let i = 2; i <= n; i++) value *= i;

  return value;
}

function permutation(n: number, r: number) {
  if (
    !Number.isFinite(n) ||
    !Number.isFinite(r) ||
    !Number.isInteger(n) ||
    !Number.isInteger(r) ||
    n < 0 ||
    r < 0 ||
    r > n
  ) {
    throw new Error('nPr requires whole numbers with 0 ≤ r ≤ n.');
  }

  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number) {
  if (
    !Number.isFinite(n) ||
    !Number.isFinite(r) ||
    !Number.isInteger(n) ||
    !Number.isInteger(r) ||
    n < 0 ||
    r < 0 ||
    r > n
  ) {
    throw new Error('nCr requires whole numbers with 0 ≤ r ≤ n.');
  }

  return factorial(n) / (factorial(r) * factorial(n - r));
}

function toRadians(value: number, angleMode: AngleMode) {
  if (angleMode === 'RAD') return value;
  if (angleMode === 'GRAD') return (value * Math.PI) / 200;
  return (value * Math.PI) / 180;
}

function fromRadians(value: number, angleMode: AngleMode) {
  if (angleMode === 'RAD') return value;
  if (angleMode === 'GRAD') return (value * 200) / Math.PI;
  return (value * 180) / Math.PI;
}

function decimalToFraction(value: number) {
  if (!Number.isFinite(value)) return String(value);

  const sign = value < 0 ? -1 : 1;
  let x = Math.abs(value);

  if (Number.isInteger(x)) return String(value);

  let bestNumerator = Math.round(x);
  let bestDenominator = 1;
  let bestError = Math.abs(x - bestNumerator);

  for (let denominator = 1; denominator <= 10000; denominator++) {
    const numerator = Math.round(x * denominator);
    const error = Math.abs(x - numerator / denominator);

    if (error < bestError) {
      bestError = error;
      bestNumerator = numerator;
      bestDenominator = denominator;

      if (error < 1e-10) break;
    }
  }

  const gcd = (a: number, b: number): number => {
    while (b) {
      const temp = a % b;
      a = b;
      b = temp;
    }

    return Math.abs(a);
  };

  const divisor = gcd(bestNumerator, bestDenominator);

  return `${sign * (bestNumerator / divisor)}/${bestDenominator / divisor}`;
}

function engineeringNotation(value: number) {
  if (!Number.isFinite(value) || value === 0) return String(value);

  const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
  const mantissa = value / 10 ** exponent;

  return `${Number(mantissa.toPrecision(10))} × 10^${exponent}`;
}

function dmsToDecimal(degrees: number, minutes = 0, seconds = 0) {
  const sign = degrees < 0 ? -1 : 1;

  return sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600);
}

function decimalToDms(value: number) {
  const sign = value < 0 ? '-' : '';
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  return `${sign}${degrees}° ${minutes}' ${Number(seconds.toFixed(6))}"`;
}

function evaluateCalculatorExpression(
  expression: string,
  angleMode: AngleMode,
  ans: number,
  variables: Record<VariableName, number>,
) {
  let source = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'PI')
    .replace(/\bAns\b/gi, 'ANS')
    .replace(/\bRan#/gi, 'RAN')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/\^/g, '**')
    .replace(/\bmod\b/gi, '%')
    .replace(/xʸ/gi, '**')
    .replace(/\s+/g, '');

  source = source.replace(/\b10\^/gi, '10**');
  source = source.replace(/\be\^/gi, 'Math.E**');

  source = source.replace(/\b([A-FXYM])\b/g, (match) => {
    const key = match as VariableName;
    return `V_${key}`;
  });

  source = source.replace(/\bANS\b/g, 'ANS');
  source = source.replace(/\bRAN\b/g, 'RAN');
  source = source.replace(/\bPI\b/g, 'PI');

  const allowed = /^[0-9A-Za-z_+*/().,%\-*]+$/;

  if (!allowed.test(source)) {
    throw new Error('Expression contains an unsupported character.');
  }

  const rad = (value: number) => toRadians(value, angleMode);
  const angle = (value: number) => fromRadians(value, angleMode);

  const sin = (value: number) => Math.sin(rad(value));
  const cos = (value: number) => Math.cos(rad(value));
  const tan = (value: number) => Math.tan(rad(value));

  const asin = (value: number) => angle(Math.asin(value));
  const acos = (value: number) => angle(Math.acos(value));
  const atan = (value: number) => angle(Math.atan(value));

  const sinh = (value: number) => Math.sinh(value);
  const cosh = (value: number) => Math.cosh(value);
  const tanh = (value: number) => Math.tanh(value);

  const asinh = (value: number) => Math.asinh(value);
  const acosh = (value: number) => Math.acosh(value);
  const atanh = (value: number) => Math.atanh(value);

  const log = (value: number) => Math.log10(value);
  const ln = (value: number) => Math.log(value);
  const sqrt = (value: number) => Math.sqrt(value);
  const cbrt = (value: number) => Math.cbrt(value);
  const abs = (value: number) => Math.abs(value);
  const floor = (value: number) => Math.floor(value);
  const ceil = (value: number) => Math.ceil(value);
  const nPr = (n: number, r: number) => permutation(n, r);
  const nCr = (n: number, r: number) => combination(n, r);
  const fact = (value: number) => factorial(value);
  const dms = (d: number, m = 0, s = 0) => dmsToDecimal(d, m, s);
  const pol = (r: number, theta: number) => r * Math.cos(rad(theta));
  const rec = (x: number, y: number) =>
    Math.sqrt(x * x + y * y);

  const V_A = variables.A;
  const V_B = variables.B;
  const V_C = variables.C;
  const V_D = variables.D;
  const V_E = variables.E;
  const V_F = variables.F;
  const V_X = variables.X;
  const V_Y = variables.Y;
  const V_M = variables.M;
  const ANS = ans;
  const PI = Math.PI;
  const RAN = Math.random();

  const value = Function(
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'sinh',
    'cosh',
    'tanh',
    'asinh',
    'acosh',
    'atanh',
    'log',
    'ln',
    'sqrt',
    'cbrt',
    'abs',
    'floor',
    'ceil',
    'nPr',
    'nCr',
    'fact',
    'dms',
    'pol',
    'rec',
    'PI',
    'ANS',
    'RAN',
    'V_A',
    'V_B',
    'V_C',
    'V_D',
    'V_E',
    'V_F',
    'V_X',
    'V_Y',
    'V_M',
    `"use strict"; return (${source})`,
  )(
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
    sinh,
    cosh,
    tanh,
    asinh,
    acosh,
    atanh,
    log,
    ln,
    sqrt,
    cbrt,
    abs,
    floor,
    ceil,
    nPr,
    nCr,
    fact,
    dms,
    pol,
    rec,
    PI,
    ANS,
    RAN,
    V_A,
    V_B,
    V_C,
    V_D,
    V_E,
    V_F,
    V_X,
    V_Y,
    V_M,
  );

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Math error.');
  }

  return value;
}

function ToolsPage() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const expressionRef = useRef<HTMLTextAreaElement>(null);

  const [calculatorFullscreen, setCalculatorFullscreen] =
    useState(false);
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

    return () =>
      document.removeEventListener('fullscreenchange', f);
  }, []);

  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [selectedVariable, setSelectedVariable] =
    useState<VariableName>('A');

  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  const [ans, setAns] = useState(0);

  const [memory, setMemory] = useState(0);
  const [variables, setVariables] = useState<
    Record<VariableName, number>
  >({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    X: 0,
    Y: 0,
    M: 0,
  });

  const [history, setHistory] = useState<string[]>(() =>
    typeof window === 'undefined'
      ? []
      : JSON.parse(
          window.localStorage.getItem(
            'phenom-calculator-history',
          ) || '[]',
        ),
  );

  const [translationTarget, setTranslationTarget] =
    useState('French');
  const [translationInput, setTranslationInput] = useState('');
  const [translationOutput, setTranslationOutput] = useState('');
  const [translationBusy, setTranslationBusy] = useState(false);
  const [translationPremium, setTranslationPremium] =
    useState(false);
  const [sentenceCount, setSentenceCount] = useState(0);

  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('NGN');
  const [amount, setAmount] = useState('1');
  const [currency, setCurrency] = useState<CurrencyState | null>(
    null,
  );
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

  function focusExpression(position?: number) {
    requestAnimationFrame(() => {
      const input = expressionRef.current;

      if (!input) return;

      input.focus();

      const cursor =
        position === undefined ? input.value.length : position;

      input.setSelectionRange(cursor, cursor);
    });
  }

  function insertAtCursor(value: string) {
    const input = expressionRef.current;

    if (!input) {
      setExpr((current) => current + value);
      return;
    }

    const start = input.selectionStart ?? expr.length;
    const end = input.selectionEnd ?? start;

    const next = expr.slice(0, start) + value + expr.slice(end);

    setExpr(next);
    focusExpression(start + value.length);
  }

  function deleteAtCursor() {
    const input = expressionRef.current;

    if (!input) {
      setExpr((current) => current.slice(0, -1));
      return;
    }

    const start = input.selectionStart ?? expr.length;
    const end = input.selectionEnd ?? start;

    if (start !== end) {
      const next = expr.slice(0, start) + expr.slice(end);
      setExpr(next);
      focusExpression(start);
      return;
    }

    if (start === 0) return;

    const next = expr.slice(0, start - 1) + expr.slice(start);

    setExpr(next);
    focusExpression(start - 1);
  }

  function clearCalculator() {
    setExpr('');
    setResult('');
    focusExpression(0);
  }

  function calculate() {
    try {
      if (!expr.trim()) return;

      const value = evaluateCalculatorExpression(
        expr,
        angleMode,
        ans,
        variables,
      );

      const output = Number(value.toPrecision(12)).toString();

      setResult(output);
      setAns(value);
      setHistory((h) =>
        [`${expr} = ${output}`, ...h].slice(0, 100),
      );
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : 'Error',
      );
    }
  }

  function calculateUnary(
    fn: (
      value: number,
    ) => number | string,
    label: string,
  ) {
    try {
      const value = Number(
        evaluateCalculatorExpression(
          expr || 'Ans',
          angleMode,
          ans,
          variables,
        ),
      );

      const output = fn(value);

      if (typeof output === 'number' && Number.isFinite(output)) {
        const formatted = Number(output.toPrecision(12)).toString();

        setResult(formatted);
        setAns(output);
        setHistory((h) =>
          [`${label}(${value}) = ${formatted}`, ...h].slice(
            0,
            100,
          ),
        );
      } else {
        setResult(String(output));
      }
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : 'Error',
      );
    }
  }

  function handleScientificFunction(name: string) {
    if (shift) {
      const shifted: Record<string, string> = {
        sin: 'asin(',
        cos: 'acos(',
        tan: 'atan(',
        sinh: 'asinh(',
        cosh: 'acosh(',
        tanh: 'atanh(',
        log: '10**(',
        ln: 'e**(',
        sqrt: 'cbrt(',
        square: '**3',
      };

      const replacement = shifted[name];

      if (replacement) {
        insertAtCursor(replacement);
        setShift(false);
        return;
      }
    }

    const direct: Record<string, string> = {
      sin: 'sin(',
      cos: 'cos(',
      tan: 'tan(',
      asin: 'asin(',
      acos: 'acos(',
      atan: 'atan(',
      sinh: 'sinh(',
      cosh: 'cosh(',
      tanh: 'tanh(',
      asinh: 'asinh(',
      acosh: 'acosh(',
      atanh: 'atanh(',
      log: 'log(',
      ln: 'ln(',
      sqrt: 'sqrt(',
      cbrt: 'cbrt(',
      abs: 'abs(',
      floor: 'floor(',
      ceil: 'ceil(',
      square: '**2',
      cube: '**3',
      reciprocal: '1/(',
      exp10: '10**(',
      expe: 'e**(',
      factorial: 'fact(',
    };

    const value = direct[name];

    if (value) insertAtCursor(value);
  }

  function handleMemory(action: 'MC' | 'MR' | 'M+' | 'M-') {
    if (action === 'MC') {
      setMemory(0);
      return;
    }

    if (action === 'MR') {
      insertAtCursor(String(memory));
      return;
    }

    try {
      const value = evaluateCalculatorExpression(
        expr || 'Ans',
        angleMode,
        ans,
        variables,
      );

      setMemory((current) =>
        action === 'M+' ? current + value : current - value,
      );
    } catch {
      setResult('Enter a valid number first.');
    }
  }

  function storeVariable() {
    try {
      const value = evaluateCalculatorExpression(
        expr || 'Ans',
        angleMode,
        ans,
        variables,
      );

      setVariables((current) => ({
        ...current,
        [selectedVariable]: value,
      }));

      setResult(
        `${selectedVariable} = ${Number(
          value.toPrecision(12),
        )}`,
      );
    } catch {
      setResult('Enter a valid expression first.');
    }
  }

  function recallVariable() {
    insertAtCursor(selectedVariable);
  }

  function toggleSign() {
    if (!expr.trim()) {
      insertAtCursor('-');
      return;
    }

    if (expr.startsWith('-(') && expr.endsWith(')')) {
      setExpr(expr.slice(2, -1));
      focusExpression();
      return;
    }

    setExpr(`-(${expr})`);
    focusExpression();
  }

  function smartResultAction() {
    if (!result || result === 'Error') return;

    setExpr(result);
    setResult('');
    focusExpression();
  }

  const converted =
    currency && Number.isFinite(Number(amount))
      ? convertCurrency(
          Number(amount),
          from,
          to,
          currency.rates,
        )
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

      const { data, error } = await s.functions.invoke(
        'ai-router',
        {
          body: {
            mode: 'reasoning',
            prompt: `Translate the following text into ${translationTarget}. Preserve punctuation, numbers, names and line breaks. Do not add commentary. If the input is a single word, give only its direct translation.

${input}`,
          },
        },
      );

      if (error) throw error;

      setTranslationOutput(String(data?.text || ''));
    } catch (error) {
      setTranslationOutput(
        error instanceof Error
          ? error.message
          : 'Translation failed.',
      );
    } finally {
      setTranslationBusy(false);
    }
  }

  async function extractImage(file: File) {
    if (!file.type.startsWith('image/')) {
      setOcrResult('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setOcrResult(
        'This image is larger than 10 MB. Please choose a smaller image.',
      );
      return;
    }

    setOcrBusy(true);

    try {
      const s = getSupabase();

      if (!s) {
        throw new Error(
          'Connect the Academy processing service to use image/text extraction.',
        );
      }

      const data = await fileToDataUrl(file);

      const { data: out, error } = await s.functions.invoke(
        'ai-router',
        {
          body: {
            mode: 'reasoning',
            image: data,
            prompt:
              'Transcribe this image verbatim. Preserve every word, number, punctuation mark, line break and spelling. Do not solve or correct it. Then provide a separate section called ANALYSIS explaining what was detected. If it contains a maths/science assignment, also solve it step-by-step after the verbatim transcription.',
          },
        },
      );

      if (error) throw error;

      setOcrResult(String(out?.text || 'No text returned.'));

      setSnapshots((previous) =>
        [
          ...previous,
          {
            id: crypto.randomUUID(),
            name: file.name,
            text: String(out?.text || ''),
            createdAt: new Date().toISOString(),
          },
        ].slice(-10),
      );
    } catch (error) {
      setOcrResult(
        error instanceof Error
          ? error.message
          : 'Extraction failed.',
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
  .map((snapshot, index) => `SNAPSHOT ${index + 1}:\n${snapshot.text}`)
  .join('\n\n')}`;

      const { data, error } = await s.functions.invoke(
        'ai-router',
        {
          body: {
            mode: 'reasoning',
            prompt,
          },
        },
      );

      if (error) throw error;

      setOcrResult(String(data?.text || ''));
    } catch (error) {
      setOcrResult(
        error instanceof Error
          ? error.message
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
      const character = value.charCodeAt(i);

      for (let bit = 0; bit < 7; bit++) {
        if ((character >> (bit % 8)) & 1) {
          const rect = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'rect',
          );

          rect.setAttribute('x', String(x));
          rect.setAttribute('y', '10');
          rect.setAttribute('width', String((bit % 2) + 1));
          rect.setAttribute('height', '70');

          svg.appendChild(rect);
        }

        x += 2 + (bit % 2);
      }
    }

    barcodeRef.current.appendChild(svg);
  }

  async function readBarcode(file: File) {
    if (!file.type.startsWith('image/')) {
      setBarcodeText('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setBarcodeText(
        'This image is larger than 10 MB. Please choose a smaller image.',
      );
      return;
    }

    const windowWithBarcode = window as any;

    if (windowWithBarcode.BarcodeDetector) {
      try {
        const detector = new windowWithBarcode.BarcodeDetector({
          formats: [
            'code_128',
            'code_39',
            'ean_13',
            'ean_8',
            'qr_code',
          ],
        });

        const output = await detector.detect(
          await createImageBitmap(file),
        );

        setBarcodeText(
          output.map((item: any) => item.rawValue).join('\n') ||
            'No barcode detected.',
        );

        return;
      } catch {}
    }

    await extractImage(file);
  }

  async function teachEnglish() {
    if (!text.trim()) return;

    try {
      const s = getSupabase();

      if (!s) {
        setOcrResult(
          'Connect the Academy language service to use English learning.',
        );
        return;
      }

      const { data, error } = await s.functions.invoke(
        'ai-router',
        {
          body: {
            mode: 'reasoning',
            prompt: `Teach this school-English/language question. Give meaning, spelling, grammar, pronunciation guidance and examples as applicable. Do not provide CPD content.

${text}`,
          },
        },
      );

      if (error) throw error;

      setOcrResult(
        String(
          data?.text ||
            'No explanation was returned. Please try again.',
        ),
      );
    } catch (error) {
      setOcrResult(
        error instanceof Error
          ? error.message
          : 'English learning request failed.',
      );
    }
  }

  const basicKeys = [
    ['AC', 'action'],
    ['DEL', 'action'],
    ['(', 'value'],
    [')', 'value'],
    ['7', 'value'],
    ['8', 'value'],
    ['9', 'value'],
    ['÷', 'value'],
    ['4', 'value'],
    ['5', 'value'],
    ['6', 'value'],
    ['×', 'value'],
    ['1', 'value'],
    ['2', 'value'],
    ['3', 'value'],
    ['−', 'value'],
    ['0', 'value'],
    ['.', 'value'],
    ['%', 'value'],
    ['+', 'value'],
  ];

  const scientificKeys = [
    ['sin', 'scientific'],
    ['cos', 'scientific'],
    ['tan', 'scientific'],
    ['sin⁻¹', 'scientific'],
    ['cos⁻¹', 'scientific'],
    ['tan⁻¹', 'scientific'],
    ['sinh', 'scientific'],
    ['cosh', 'scientific'],
    ['tanh', 'scientific'],
    ['sinh⁻¹', 'scientific'],
    ['cosh⁻¹', 'scientific'],
    ['tanh⁻¹', 'scientific'],
    ['log', 'scientific'],
    ['ln', 'scientific'],
    ['10ˣ', 'scientific'],
    ['eˣ', 'scientific'],
    ['√x', 'scientific'],
    ['∛x', 'scientific'],
    ['x²', 'scientific'],
    ['x³', 'scientific'],
    ['xʸ', 'value'],
    ['1/x', 'scientific'],
    ['x!', 'scientific'],
    ['π', 'value'],
    ['e', 'value'],
    ['abs', 'scientific'],
    ['floor', 'scientific'],
    ['ceil', 'scientific'],
    ['nPr', 'special'],
    ['nCr', 'special'],
    ['Ran#', 'value'],
    ['mod', 'value'],
  ];

  const engineeringKeys = [
    ['EXP', 'value'],
    ['ENG', 'action'],
    ['S⇔D', 'action'],
    ['DMS', 'action'],
    ['Pol/Rec', 'action'],
    ['DEG', 'action'],
    ['RAD', 'action'],
    ['GRAD', 'action'],
    ['Ans', 'value'],
  ];

  function handleKey(
    key: string,
    kind: string,
  ) {
    if (key === 'AC') {
      clearCalculator();
      return;
    }

    if (key === 'DEL') {
      deleteAtCursor();
      return;
    }

    if (key === 'DEG' || key === 'RAD' || key === 'GRAD') {
      setAngleMode(key as AngleMode);
      return;
    }

    if (key === 'ENG') {
      try {
        const value = evaluateCalculatorExpression(
          expr || 'Ans',
          angleMode,
          ans,
          variables,
        );

        setResult(engineeringNotation(value));
      } catch {
        setResult('Enter a valid number first.');
      }

      return;
    }

    if (key === 'S⇔D') {
      try {
        const value = evaluateCalculatorExpression(
          expr || 'Ans',
          angleMode,
          ans,
          variables,
        );

        const fraction = decimalToFraction(value);

        setResult(
          result === fraction
            ? Number(value.toPrecision(12)).toString()
            : fraction,
        );
      } catch {
        setResult('Enter a valid number first.');
      }

      return;
    }

    if (key === 'DMS') {
      calculateUnary(
        (value) => decimalToDms(value),
        'DMS',
      );
      return;
    }

    if (key === 'Pol/Rec') {
      setResult(
        'Use pol(r,θ) or rec(x,y) in the expression, then press =.',
      );
      insertAtCursor('pol(');
      return;
    }

    if (key === 'EXP') {
      insertAtCursor('e');
      return;
    }

    if (key === 'Ans') {
      insertAtCursor('Ans');
      return;
    }

    if (key === 'π') {
      insertAtCursor('π');
      return;
    }

    if (key === 'e') {
      insertAtCursor('Math.E');
      return;
    }

    if (key === 'Ran#') {
      insertAtCursor('Ran#');
      return;
    }

    if (key === 'xʸ') {
      insertAtCursor('**');
      return;
    }

    if (key === 'mod') {
      insertAtCursor(' mod ');
      return;
    }

    if (key === 'nPr' || key === 'nCr') {
      insertAtCursor(`${key}(`);
      return;
    }

    if (kind === 'scientific') {
      const map: Record<string, string> = {
        sin: 'sin',
        cos: 'cos',
        tan: 'tan',
        'sin⁻¹': 'asin',
        'cos⁻¹': 'acos',
        'tan⁻¹': 'atan',
        sinh: 'sinh',
        cosh: 'cosh',
        tanh: 'tanh',
        'sinh⁻¹': 'asinh',
        'cosh⁻¹': 'acosh',
        'tanh⁻¹': 'atanh',
        log: 'log',
        ln: 'ln',
        '10ˣ': 'exp10',
        'eˣ': 'expe',
        '√x': 'sqrt',
        '∛x': 'cbrt',
        'x²': 'square',
        'x³': 'cube',
        '1/x': 'reciprocal',
        'x!': 'factorial',
        abs: 'abs',
        floor: 'floor',
        ceil: 'ceil',
      };

      handleScientificFunction(map[key] || key);
      return;
    }

    if (key === '±') {
      toggleSign();
      return;
    }

    if (kind === 'value') {
      insertAtCursor(key);
    }
  }

  return (
    <section
      className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 ${size}`}
    >
      <div className="rounded-3xl bg-navy-deep p-6 text-cream shadow-card sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">
          Phenom Calculator
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold text-green-400 sm:text-6xl">
          Calculate, scan, extract, translate and learn.
        </h1>

        <p className="mt-5 max-w-5xl text-base leading-7 text-cream/80 sm:text-lg">
          A powerful Academy learning and calculation workspace for
          mathematics, science, engineering, language learning,
          multilingual text processing, barcode workflows and
          practical everyday calculations.
        </p>
      </div>

      <div className="mt-8">
        <div
          ref={calculatorRef}
          className={`rounded-3xl border border-line bg-cream p-4 shadow-card sm:p-6 ${
            calculatorFullscreen
              ? 'min-h-screen overflow-auto'
              : ''
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue/10 p-3">
                  <Calculator className="size-7 text-blue" />
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold sm:text-3xl">
                    Phenom Calculator
                  </h2>

                  <p className="text-sm text-muted">
                    Interactive scientific & engineering calculator
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
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
                  onClick={() =>
                    setShowKeyboard((current) => !current)
                  }
                >
                  <Keyboard className="mr-2 size-4" />

                  {showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  ['basic', 'Basic'],
                  ['scientific', 'Scientific'],
                  ['engineering', 'Engineering'],
                  ['advanced', 'Advanced'],
                ] as [CalculatorMode, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold transition sm:text-base ${
                    mode === value
                      ? 'border-blue bg-blue text-white'
                      : 'border-line bg-white hover:bg-paper'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border-2 border-blue/20 bg-white p-4 shadow-inner sm:p-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue">
                  Expression
                </span>

                <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-muted">
                  {angleMode}
                </span>
              </div>

              <textarea
                ref={expressionRef}
                value={expr}
                onChange={(event) => setExpr(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    calculate();
                  }
                }}
                spellCheck={false}
                className="min-h-24 w-full resize-none border-0 bg-transparent text-right font-mono text-3xl font-semibold outline-none sm:min-h-28 sm:text-5xl"
                placeholder="0"
                aria-label="Calculator expression"
              />

              <div className="mt-3 border-t border-line pt-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Result
                </div>

                <button
                  type="button"
                  onClick={smartResultAction}
                  className="mt-1 block min-h-20 w-full overflow-x-auto text-right font-mono text-4xl font-bold text-blue outline-none sm:text-6xl"
                  title="Tap the result to move it into the expression"
                >
                  {result || '0'}
                </button>

                <div className="mt-2 flex flex-wrap justify-end gap-2 text-xs text-muted">
                  <span>Ans: {Number(ans.toPrecision(10))}</span>
                  <span>Memory: {Number(memory.toPrecision(10))}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              <button
                type="button"
                onClick={() => setShift((current) => !current)}
                className={`rounded-xl border px-3 py-3 font-bold ${
                  shift
                    ? 'border-orange bg-orange text-white'
                    : 'border-line bg-white'
                }`}
              >
                SHIFT
              </button>

              <button
                type="button"
                onClick={() => setAlpha((current) => !current)}
                className={`rounded-xl border px-3 py-3 font-bold ${
                  alpha
                    ? 'border-purple bg-purple text-white'
                    : 'border-line bg-white'
                }`}
              >
                ALPHA
              </button>

              <button
                type="button"
                onClick={() => setMode('basic')}
                className="rounded-xl border border-line bg-white px-3 py-3 font-bold"
              >
                MODE
              </button>

              <button
                type="button"
                onClick={() =>
                  setAngleMode((current) =>
                    current === 'DEG'
                      ? 'RAD'
                      : current === 'RAD'
                        ? 'GRAD'
                        : 'DEG',
                  )
                }
                className="rounded-xl border border-line bg-white px-3 py-3 font-bold"
              >
                SETUP
              </button>

              <button
                type="button"
                onClick={() => {
                  setExpr('');
                  setResult('');
                  setAns(0);
                  setMemory(0);
                }}
                className="rounded-xl border border-line bg-white px-3 py-3 font-bold"
              >
                RESET
              </button>

              <button
                type="button"
                onClick={() => setResult('')}
                className="rounded-xl border border-line bg-white px-3 py-3 font-bold"
              >
                CLEAR RESULT
              </button>
            </div>

            {alpha && (
              <div className="rounded-2xl border border-purple/30 bg-purple/5 p-3">
                <div className="mb-2 text-sm font-bold text-purple">
                  ALPHA variables
                </div>

                <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
                  {VARIABLES.map((variable) => (
                    <button
                      key={variable}
                      type="button"
                      onClick={() => {
                        setSelectedVariable(variable);
                        insertAtCursor(variable);
                      }}
                      className={`rounded-lg border px-2 py-3 font-bold ${
                        selectedVariable === variable
                          ? 'border-purple bg-purple text-white'
                          : 'border-line bg-white'
                      }`}
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'advanced' && (
              <div className="rounded-2xl border border-gold/40 bg-gold/5 p-4">
                <h3 className="font-display text-xl font-bold">
                  Advanced tools
                </h3>

                <p className="mt-1 text-sm text-muted">
                  Use functions directly in the expression area:
                  nPr(n,r), nCr(n,r), pol(r,θ), rec(x,y),
                  dms(degrees,minutes,seconds), abs(x), floor(x),
                  ceil(x) and modular arithmetic.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'nPr(',
                    'nCr(',
                    'pol(',
                    'rec(',
                    'dms(',
                    'abs(',
                    'floor(',
                    'ceil(',
                  ].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => insertAtCursor(value)}
                      className="rounded-xl border border-line bg-white px-4 py-3 font-mono font-bold"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showKeyboard && (
              <div className="rounded-2xl border border-line bg-paper/60 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted">
                    On-screen keyboard
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowKeyboard(false)}
                    className="rounded-lg p-2 text-muted hover:bg-white"
                  >
                    <Delete className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {basicKeys.map(([key, kind]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKey(key, kind)}
                      className={`min-h-14 rounded-2xl border text-lg font-bold transition active:scale-[.98] sm:min-h-16 sm:text-xl ${
                        key === 'AC'
                          ? 'border-orange bg-orange text-white'
                          : key === 'DEL'
                            ? 'border-purple bg-purple text-white'
                            : ['÷', '×', '−', '+'].includes(key)
                              ? 'border-blue/30 bg-blue/10 text-blue'
                              : 'border-line bg-white hover:bg-cream'
                      }`}
                    >
                      {key}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleKey('±', 'action')}
                    className="min-h-14 rounded-2xl border border-line bg-white text-lg font-bold sm:min-h-16"
                  >
                    ±
                  </button>

                  <button
                    type="button"
                    onClick={() => insertAtCursor('Ans')}
                    className="min-h-14 rounded-2xl border border-gold/40 bg-gold/10 text-lg font-bold text-ink sm:min-h-16"
                  >
                    Ans
                  </button>

                  <button
                    type="button"
                    onClick={calculate}
                    className="col-span-2 min-h-14 rounded-2xl border border-green/30 bg-green px-4 text-xl font-bold text-white sm:min-h-16"
                  >
                    =
                  </button>
                </div>

                {(mode === 'scientific' ||
                  mode === 'engineering' ||
                  mode === 'advanced') && (
                  <>
                    <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {scientificKeys.map(([key, kind]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleKey(key, kind)}
                          className="min-h-12 rounded-xl border border-blue/15 bg-white px-2 py-2 text-sm font-bold text-ink shadow-sm hover:bg-blue/5 sm:text-base"
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {engineeringKeys.map(([key, kind]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleKey(key, kind)}
                          className="min-h-12 rounded-xl border border-gold/25 bg-gold/5 px-2 py-2 text-sm font-bold sm:text-base"
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {['MC', 'MR', 'M+', 'M-'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        handleMemory(
                          key as 'MC' | 'MR' | 'M+' | 'M-',
                        )
                      }
                      className="rounded-xl border border-purple/20 bg-purple/5 px-3 py-3 font-bold text-purple"
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-line bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">
                      STO / RCL
                    </span>

                    <select
                      value={selectedVariable}
                      onChange={(event) =>
                        setSelectedVariable(
                          event.target.value as VariableName,
                        )
                      }
                      className="rounded-lg border border-line px-3 py-2 font-bold"
                    >
                      {VARIABLES.map((variable) => (
                        <option key={variable} value={variable}>
                          {variable}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={storeVariable}
                      className="rounded-lg border border-line bg-paper px-3 py-2 font-bold"
                    >
                      STO
                    </button>

                    <button
                      type="button"
                      onClick={recallVariable}
                      className="rounded-lg border border-line bg-paper px-3 py-2 font-bold"
                    >
                      RCL
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={calculate} className="min-h-12 px-6">
                Calculate
              </Button>

              <Button
                variant="outline"
                onClick={deleteAtCursor}
                className="min-h-12"
              >
                <Delete className="mr-2 size-4" />
                Delete
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    result || expr,
                  );
                }}
                disabled={!result && !expr}
                className="min-h-12"
              >
                <Copy className="mr-2 size-4" />
                Copy
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setExpr('');
                  setResult('');
                  focusExpression(0);
                }}
                className="min-h-12"
              >
                <RotateCcw className="mr-2 size-4" />
                Clear
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold">
                  History & memory
                </h3>

                <span className="text-sm text-muted">
                  {history.length} saved
                </span>
              </div>

              <div className="mt-2 max-h-44 overflow-auto rounded-2xl bg-paper p-4 text-sm">
                {history.length ? (
                  history.map((item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => {
                        const expression = item.split(' = ')[0];
                        setExpr(expression);
                        focusExpression();
                      }}
                      className="block w-full border-b border-line/60 py-2 text-left last:border-0 hover:text-blue"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-muted">
                    No calculations yet.
                  </span>
                )}
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
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-cream p-6 shadow-card">
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
              onChange={(event) => setAmount(event.target.value)}
              className="rounded-xl border border-line bg-white p-3"
              placeholder="Amount"
            />

            <select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="rounded-xl border border-line bg-white p-3"
            >
              {codes.map((code) => (
                <option key={code} value={code}>
                  {code} — {currencyName(code)}
                </option>
              ))}
            </select>

            <select
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="rounded-xl border border-line bg-white p-3"
            >
              {codes.map((code) => (
                <option key={code} value={code}>
                  {code} — {currencyName(code)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 rounded-2xl bg-paper p-5 text-3xl font-bold">
            {converted === null
              ? 'Enter a valid amount'
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
                  .catch(() => {
                    setCurrency(null);
                  })
                  .finally(() => setLoadingCurrency(false));
              }}
            >
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>

            {loadingCurrency && (
              <span className="self-center text-sm text-muted">
                Loading rates…
              </span>
            )}
          </div>

          <div className="mt-8">
            <label className="text-sm font-semibold">
              Display text size

              <select
                value={textSize}
                onChange={(event) =>
                  setTextSize(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-line bg-white p-3"
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
          <p className="text-sm leading-6 text-muted">
            Add up to 10 consecutive snapshots. Images are
            processed securely for text extraction, solving,
            explanation and decoding. This page does not persist
            image files. The returned text can be copied, solved,
            explained or decoded.
          </p>

          <input
            ref={fileRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) void extractImage(file);

              event.currentTarget.value = '';
            }}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={ocrBusy || snapshots.length >= 10}
            >
              <Camera className="mr-2 size-4" />
              {ocrBusy
                ? 'Working… Please wait…'
                : snapshots.length >= 10
                  ? '10 snapshots reached'
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
            {snapshots.map((snapshot, index) => (
              <div
                key={snapshot.id}
                className="rounded-xl bg-paper p-3 text-sm"
              >
                <strong>Snapshot {index + 1}</strong>

                <p className="mt-1 line-clamp-3 whitespace-pre-wrap">
                  {snapshot.text}
                </p>
              </div>
            ))}
          </div>

          {ocrResult && (
            <div className="mt-4 rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap justify-between gap-2">
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

              <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap text-sm leading-6">
                {ocrResult}
              </pre>
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-muted">
            Privacy: captured images are sent only to the
            configured processing endpoint for the requested
            operation; this UI does not save them to Academy
            storage. Users should keep any desired copy on their
            own device.
          </p>
        </Panel>

        <Panel
          icon={<Languages className="text-purple" />}
          title="Translation & English learning"
        >
          <p className="text-sm leading-6 text-muted">
            The limited calculator supports unlimited
            individual-word translation and up to 5 sentences per
            translation request. Premium removes the sentence
            limit and supports unlimited words and sentences,
            subject to fair-use and provider limits.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={translationTarget}
              onChange={(event) =>
                setTranslationTarget(event.target.value)
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
            onChange={(event) =>
              setTranslationInput(event.target.value)
            }
            className="mt-3 min-h-32 w-full rounded-xl border border-line bg-white p-4 leading-7"
            placeholder="Enter a word, phrase or sentences…"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={translateTextNow}
              disabled={translationBusy}
            >
              {translationBusy
                ? 'Translating…'
                : 'Translate'}
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
            <div className="mt-3 rounded-xl bg-paper p-4 whitespace-pre-wrap leading-7">
              {translationOutput}
            </div>
          )}

          <p className="mt-2 text-xs text-muted">
            Detected sentence count: {sentenceCount}. The premium
            control is an entitlement preview; production access
            is enforced by the signed-in account.
          </p>
        </Panel>

        <Panel
          icon={<Languages className="text-purple" />}
          title="English & language learning"
        >
          <p className="text-sm leading-6 text-muted">
            Use the same processing display for spelling, grammar,
            pronunciation, meaning, sentence correction, reading
            comprehension and limited translation. Extended
            language-service usage should be routed to the
            Academy language service subscription.
          </p>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-4 min-h-32 w-full rounded-xl border border-line bg-white p-4 leading-7"
            placeholder="Type English or another supported language here…"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => void teachEnglish()}>
              Teach / explain
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigator.clipboard?.writeText(text)
              }
              disabled={!text}
            >
              <Copy className="mr-2 size-4" />
              Copy input
            </Button>
          </div>

          {ocrResult && (
            <div className="mt-4 rounded-xl bg-paper p-4 whitespace-pre-wrap leading-7">
              {ocrResult}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          icon={<Barcode className="text-green" />}
          title="Barcode create & read"
        >
          <input
            value={barcodeText}
            onChange={(event) =>
              setBarcodeText(event.target.value)
            }
            className="w-full rounded-xl border border-line bg-white p-3"
            placeholder="Enter barcode text"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={makeBarcode}>
              Create barcode
            </Button>

            <label className="inline-flex cursor-pointer items-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold">
              Read barcode

              <input
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) void readBarcode(file);

                  event.currentTarget.value = '';
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
          {formulas.map(([category, title, formula]) => (
            <div
              key={title}
              className="mt-2 rounded-xl bg-paper p-3"
            >
              <span className="text-xs font-semibold uppercase text-purple">
                {category}
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
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-6 shadow-card">
      <div className="flex items-center gap-2">
        {icon}

        <h2 className="font-display text-2xl font-semibold">
          {title}
        </h2>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}
