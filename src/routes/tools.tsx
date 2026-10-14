import { createFileRoute } from "@tanstack/react-router";
import {
  Calculator,
  ChevronDown,
  Copy,
  Crown,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  Languages,
  LineChart,
  Maximize2,
  Minimize2,
  Moon,
  Monitor,
  Play,
  Printer,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
  Settings2,
  ShieldCheck,
  Keyboard,
  Sun,
  Trash2,
  Upload,
  Volume2,
  X,
  Clock,
  Percent,
  Calendar,
  Shuffle,
  StickyNote,
} from "lucide-react";
import bwipjs from "@bwip-js/browser";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  convertCurrency,
  currencyName,
  getCurrencyCodes,
  getLiveCurrencyRates,
  type CurrencyState,
} from "@/lib/currency";
import { getSupabase } from "@/lib/cms";
import { getLocale, setLocale, supportedLocales, type SupportedLocale } from "@/lib/i18n";
import { getMyActiveSubscriptions, type ActiveSubscription } from "@/lib/platform";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

type HubTool =
  | "calculator"
  | "units"
  | "formulas"
  | "graph"
  | "english"
  | "translation"
  | "scanner"
  | "productivity";

type CalculatorMode = "basic" | "scientific";
type AngleMode = "DEG" | "RAD" | "GRAD";
type ThemeMode = "system" | "light" | "dark";

type Snap = {
  id: string;
  name: string;
  text: string;
  createdAt: string;
};

type UnitDefinition = {
  label: string;
  symbol: string;
  factor: number;
  offset?: number;
};

type UnitCategory = {
  name: string;
  units: UnitDefinition[];
};

const toolMenu: Array<{
  id: HubTool;
  label: string;
  description: string;
  icon: typeof Calculator;
}> = [
  {
    id: "calculator",
    label: "Calculator",
    description: "Basic and scientific mathematics",
    icon: Calculator,
  },
  {
    id: "units",
    label: "Unit Converter",
    description: "Mathematics, physics, chemistry and live currency",
    icon: RefreshCw,
  },
  {
    id: "formulas",
    label: "Formula & Units",
    description: "Learn, enter values, solve and understand",
    icon: FlaskConical,
  },
  {
    id: "graph",
    label: "Graph Plotter",
    description: "Plot functions and compare curves",
    icon: LineChart,
  },
  {
    id: "english",
    label: "English Literacy",
    description: "Words, grammar, phonics and pronunciation",
    icon: FileText,
  },
  {
    id: "translation",
    label: "Language Translation",
    description: "Translation, pronunciation and speech",
    icon: Languages,
  },
  {
    id: "scanner",
    label: "All-Purpose Scanner & Creator",
    description: "OCR, reader and professional code creation",
    icon: QrCode,
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Percentage, dates, timer, notes and helpers",
    icon: StickyNote,
  },
];

const unitCategories: UnitCategory[] = [
  {
    name: "Length",
    units: [
      { label: "Metre", symbol: "m", factor: 1 },
      { label: "Kilometre", symbol: "km", factor: 1000 },
      { label: "Centimetre", symbol: "cm", factor: 0.01 },
      { label: "Millimetre", symbol: "mm", factor: 0.001 },
      { label: "Micrometre", symbol: "µm", factor: 1e-6 },
      { label: "Nanometre", symbol: "nm", factor: 1e-9 },
      { label: "Inch", symbol: "in", factor: 0.0254 },
      { label: "Foot", symbol: "ft", factor: 0.3048 },
      { label: "Yard", symbol: "yd", factor: 0.9144 },
      { label: "Mile", symbol: "mi", factor: 1609.344 },
      { label: "Nautical mile", symbol: "nmi", factor: 1852 },
    ],
  },
  {
    name: "Mass",
    units: [
      { label: "Kilogram", symbol: "kg", factor: 1 },
      { label: "Gram", symbol: "g", factor: 0.001 },
      { label: "Milligram", symbol: "mg", factor: 1e-6 },
      { label: "Tonne", symbol: "t", factor: 1000 },
      { label: "Pound", symbol: "lb", factor: 0.45359237 },
      { label: "Ounce", symbol: "oz", factor: 0.028349523125 },
    ],
  },
  {
    name: "Area",
    units: [
      { label: "Square metre", symbol: "m²", factor: 1 },
      { label: "Square kilometre", symbol: "km²", factor: 1e6 },
      { label: "Square centimetre", symbol: "cm²", factor: 1e-4 },
      { label: "Hectare", symbol: "ha", factor: 10000 },
      { label: "Acre", symbol: "acre", factor: 4046.8564224 },
      { label: "Square foot", symbol: "ft²", factor: 0.09290304 },
    ],
  },
  {
    name: "Volume",
    units: [
      { label: "Cubic metre", symbol: "m³", factor: 1 },
      { label: "Litre", symbol: "L", factor: 0.001 },
      { label: "Millilitre", symbol: "mL", factor: 1e-6 },
      { label: "Cubic centimetre", symbol: "cm³", factor: 1e-6 },
      { label: "US gallon", symbol: "US gal", factor: 0.003785411784 },
      { label: "US fluid ounce", symbol: "US fl oz", factor: 0.0000295735295625 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { label: "Celsius", symbol: "°C", factor: 1 },
      { label: "Fahrenheit", symbol: "°F", factor: 1 },
      { label: "Kelvin", symbol: "K", factor: 1 },
    ],
  },
  {
    name: "Speed",
    units: [
      { label: "Metre per second", symbol: "m/s", factor: 1 },
      { label: "Kilometre per hour", symbol: "km/h", factor: 1000 / 3600 },
      { label: "Mile per hour", symbol: "mph", factor: 1609.344 / 3600 },
      { label: "Knot", symbol: "kn", factor: 1852 / 3600 },
    ],
  },
  {
    name: "Acceleration",
    units: [
      { label: "Metre per second squared", symbol: "m/s²", factor: 1 },
      { label: "Standard gravity", symbol: "g₀", factor: 9.80665 },
    ],
  },
  {
    name: "Force",
    units: [
      { label: "Newton", symbol: "N", factor: 1 },
      { label: "Kilonewton", symbol: "kN", factor: 1000 },
      { label: "Dyne", symbol: "dyn", factor: 1e-5 },
      { label: "Pound-force", symbol: "lbf", factor: 4.4482216152605 },
    ],
  },
  {
    name: "Energy",
    units: [
      { label: "Joule", symbol: "J", factor: 1 },
      { label: "Kilojoule", symbol: "kJ", factor: 1000 },
      { label: "Calorie", symbol: "cal", factor: 4.184 },
      { label: "Kilocalorie", symbol: "kcal", factor: 4184 },
      { label: "Watt-hour", symbol: "Wh", factor: 3600 },
      { label: "Kilowatt-hour", symbol: "kWh", factor: 3.6e6 },
      { label: "Electronvolt", symbol: "eV", factor: 1.602176634e-19 },
    ],
  },
  {
    name: "Power",
    units: [
      { label: "Watt", symbol: "W", factor: 1 },
      { label: "Kilowatt", symbol: "kW", factor: 1000 },
      { label: "Megawatt", symbol: "MW", factor: 1e6 },
      { label: "Horsepower", symbol: "hp", factor: 745.6998715822702 },
    ],
  },
  {
    name: "Pressure",
    units: [
      { label: "Pascal", symbol: "Pa", factor: 1 },
      { label: "Kilopascal", symbol: "kPa", factor: 1000 },
      { label: "Bar", symbol: "bar", factor: 100000 },
      { label: "Atmosphere", symbol: "atm", factor: 101325 },
      { label: "Millimetre of mercury", symbol: "mmHg", factor: 133.322387415 },
      { label: "PSI", symbol: "psi", factor: 6894.757293168 },
    ],
  },
  {
    name: "Time",
    units: [
      { label: "Second", symbol: "s", factor: 1 },
      { label: "Millisecond", symbol: "ms", factor: 0.001 },
      { label: "Minute", symbol: "min", factor: 60 },
      { label: "Hour", symbol: "h", factor: 3600 },
      { label: "Day", symbol: "day", factor: 86400 },
      { label: "Week", symbol: "week", factor: 604800 },
    ],
  },
  {
    name: "Frequency",
    units: [
      { label: "Hertz", symbol: "Hz", factor: 1 },
      { label: "Kilohertz", symbol: "kHz", factor: 1000 },
      { label: "Megahertz", symbol: "MHz", factor: 1e6 },
      { label: "Gigahertz", symbol: "GHz", factor: 1e9 },
    ],
  },
  {
    name: "Charge",
    units: [
      { label: "Coulomb", symbol: "C", factor: 1 },
      { label: "Millicoulomb", symbol: "mC", factor: 0.001 },
      { label: "Microcoulomb", symbol: "µC", factor: 1e-6 },
      { label: "Ampere-hour", symbol: "Ah", factor: 3600 },
    ],
  },
  {
    name: "Voltage",
    units: [
      { label: "Volt", symbol: "V", factor: 1 },
      { label: "Millivolt", symbol: "mV", factor: 0.001 },
      { label: "Kilovolt", symbol: "kV", factor: 1000 },
    ],
  },
  {
    name: "Resistance",
    units: [
      { label: "Ohm", symbol: "Ω", factor: 1 },
      { label: "Kilohm", symbol: "kΩ", factor: 1000 },
      { label: "Megohm", symbol: "MΩ", factor: 1e6 },
    ],
  },
  {
    name: "Capacitance",
    units: [
      { label: "Farad", symbol: "F", factor: 1 },
      { label: "Microfarad", symbol: "µF", factor: 1e-6 },
      { label: "Nanofarad", symbol: "nF", factor: 1e-9 },
      { label: "Picofarad", symbol: "pF", factor: 1e-12 },
    ],
  },
  {
    name: "Inductance",
    units: [
      { label: "Henry", symbol: "H", factor: 1 },
      { label: "Millihenry", symbol: "mH", factor: 1e-3 },
      { label: "Microhenry", symbol: "µH", factor: 1e-6 },
    ],
  },
  {
    name: "Amount of substance",
    units: [
      { label: "Mole", symbol: "mol", factor: 1 },
      { label: "Millimole", symbol: "mmol", factor: 0.001 },
      { label: "Micromole", symbol: "µmol", factor: 1e-6 },
    ],
  },
  {
    name: "Density",
    units: [
      { label: "Kilogram per cubic metre", symbol: "kg/m³", factor: 1 },
      { label: "Gram per cubic centimetre", symbol: "g/cm³", factor: 1000 },
      { label: "Gram per millilitre", symbol: "g/mL", factor: 1000 },
    ],
  },
  {
    name: "Digital data",
    units: [
      { label: "Byte", symbol: "B", factor: 1 },
      { label: "Kilobyte", symbol: "KB", factor: 1000 },
      { label: "Megabyte", symbol: "MB", factor: 1e6 },
      { label: "Gigabyte", symbol: "GB", factor: 1e9 },
      { label: "Kibibyte", symbol: "KiB", factor: 1024 },
      { label: "Mebibyte", symbol: "MiB", factor: 1024 ** 2 },
      { label: "Gibibyte", symbol: "GiB", factor: 1024 ** 3 },
    ],
  },
  {
    name: "Angle",
    units: [
      { label: "Degree", symbol: "°", factor: Math.PI / 180 },
      { label: "Radian", symbol: "rad", factor: 1 },
      { label: "Gradian", symbol: "gon", factor: Math.PI / 200 },
      { label: "Arcminute", symbol: "′", factor: Math.PI / 10800 },
      { label: "Arcsecond", symbol: "″", factor: Math.PI / 648000 },
    ],
  },
];

const formulaLibrary = [
  { subject: "Mathematics", level: "Primary", name: "Percentage", formula: "percentage = part ÷ whole × 100", explanation: "A percentage tells you how many parts there are out of 100.", variables: ["part", "whole"], solve: (v: Record<string, number>) => (v.whole ? (v.part / v.whole) * 100 : NaN) },
  { subject: "Mathematics", level: "Primary", name: "Average / Mean", formula: "mean = sum ÷ count", explanation: "Add all observations and divide by how many observations there are.", variables: ["sum", "count"], solve: (v: Record<string, number>) => (v.count ? v.sum / v.count : NaN) },
  { subject: "Mathematics", level: "Secondary", name: "Pythagoras", formula: "c = √(a² + b²)", explanation: "For a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.", variables: ["a", "b"], solve: (v: Record<string, number>) => Math.sqrt(v.a ** 2 + v.b ** 2) },
  { subject: "Mathematics", level: "Secondary", name: "Quadratic roots", formula: "x = (−b ± √(b² − 4ac)) ÷ 2a", explanation: "Find the roots of ax² + bx + c = 0 using the quadratic formula.", variables: ["a", "b", "c"], solve: (v: Record<string, number>) => { const d = v.b ** 2 - 4 * v.a * v.c; if (d < 0 || v.a === 0) return NaN; return (-v.b + Math.sqrt(d)) / (2 * v.a); } },
  { subject: "Mathematics", level: "University", name: "Simple interest", formula: "I = PRT", explanation: "Simple interest is principal multiplied by rate and time. Use rate as a decimal.", variables: ["P", "R", "T"], solve: (v: Record<string, number>) => v.P * v.R * v.T },
  { subject: "Mathematics", level: "University", name: "Compound amount", formula: "A = P(1 + r/n)^(nt)", explanation: "Compounding applies interest repeatedly over n periods per year.", variables: ["P", "r", "n", "t"], solve: (v: Record<string, number>) => v.P * (1 + v.r / v.n) ** (v.n * v.t) },
  { subject: "Statistics", level: "Secondary", name: "Z-score", formula: "z = (x − μ) ÷ σ", explanation: "A z-score measures how many standard deviations an observation is from the mean.", variables: ["x", "μ", "σ"], solve: (v: Record<string, number>) => (v.x - v.μ) / v.σ },
  { subject: "Statistics", level: "University", name: "Variance", formula: "σ² = Σ(x − μ)² ÷ N", explanation: "Population variance is the mean of squared deviations from the population mean.", variables: ["sumSquaredDeviations", "N"], solve: (v: Record<string, number>) => v.sumSquaredDeviations / v.N },
  { subject: "Physics", level: "Primary", name: "Speed", formula: "v = d ÷ t", explanation: "Speed is distance travelled divided by elapsed time.", variables: ["d", "t"], solve: (v: Record<string, number>) => v.d / v.t },
  { subject: "Physics", level: "Secondary", name: "Force", formula: "F = ma", explanation: "Net force equals mass multiplied by acceleration.", variables: ["m", "a"], solve: (v: Record<string, number>) => v.m * v.a },
  { subject: "Physics", level: "Secondary", name: "Kinetic energy", formula: "KE = ½mv²", explanation: "The energy associated with motion depends on mass and the square of speed.", variables: ["m", "v"], solve: (v: Record<string, number>) => 0.5 * v.m * v.v ** 2 },
  { subject: "Physics", level: "University", name: "Ohm's law", formula: "V = IR", explanation: "Voltage across a resistor equals current multiplied by resistance.", variables: ["I", "R"], solve: (v: Record<string, number>) => v.I * v.R },
  { subject: "Physics", level: "University", name: "Ideal gas law", formula: "PV = nRT", explanation: "Relates pressure, volume, amount of gas, the gas constant and absolute temperature.", variables: ["n", "R", "T", "V"], solve: (v: Record<string, number>) => (v.n * v.R * v.T) / v.V },
  { subject: "Physics", level: "Professional", name: "Electrical power", formula: "P = VI", explanation: "For a DC electrical system, power equals voltage multiplied by current.", variables: ["V", "I"], solve: (v: Record<string, number>) => v.V * v.I },
  { subject: "Chemistry", level: "Secondary", name: "Moles", formula: "n = m ÷ M", explanation: "Moles equal sample mass divided by molar mass.", variables: ["m", "M"], solve: (v: Record<string, number>) => v.m / v.M },
  { subject: "Chemistry", level: "Secondary", name: "Molar concentration", formula: "c = n ÷ V", explanation: "Molar concentration is amount of substance per litre or other chosen volume unit.", variables: ["n", "V"], solve: (v: Record<string, number>) => v.n / v.V },
  { subject: "Chemistry", level: "University", name: "pH", formula: "pH = −log₁₀[H⁺]", explanation: "For dilute aqueous solutions, pH is the negative base-10 logarithm of hydrogen-ion concentration.", variables: ["H"], solve: (v: Record<string, number>) => -Math.log10(v.H) },

  { subject: "Mathematics", level: "Primary", name: "Area of rectangle", formula: "A = l × w", explanation: "Area of a rectangle is length multiplied by width.", variables: ["l", "w"], solve: (v: Record<string, number>) => v.l * v.w },
  { subject: "Mathematics", level: "Primary", name: "Perimeter of rectangle", formula: "P = 2(l + w)", explanation: "Add all sides; for a rectangle this is twice length plus width.", variables: ["l", "w"], solve: (v: Record<string, number>) => 2 * (v.l + v.w) },
  { subject: "Mathematics", level: "Primary", name: "Area of triangle", formula: "A = ½ × b × h", explanation: "Area of a triangle is half the base times the perpendicular height.", variables: ["b", "h"], solve: (v: Record<string, number>) => 0.5 * v.b * v.h },
  { subject: "Mathematics", level: "Primary", name: "Circumference of circle", formula: "C = 2πr", explanation: "Distance around a circle is twice pi times the radius.", variables: ["r"], solve: (v: Record<string, number>) => 2 * Math.PI * v.r },
  { subject: "Mathematics", level: "Primary", name: "Area of circle", formula: "A = πr²", explanation: "Area of a circle is pi times the square of the radius.", variables: ["r"], solve: (v: Record<string, number>) => Math.PI * v.r ** 2 },
  { subject: "Mathematics", level: "Secondary", name: "Slope of a line", formula: "m = (y₂ − y₁) ÷ (x₂ − x₁)", explanation: "Slope measures steepness between two points on a straight line.", variables: ["y2", "y1", "x2", "x1"], solve: (v: Record<string, number>) => (v.y2 - v.y1) / (v.x2 - v.x1) },
  { subject: "Mathematics", level: "Secondary", name: "Distance between points", formula: "d = √((x₂−x₁)² + (y₂−y₁)²)", explanation: "Straight-line distance on the Cartesian plane.", variables: ["x1", "y1", "x2", "y2"], solve: (v: Record<string, number>) => Math.sqrt((v.x2 - v.x1) ** 2 + (v.y2 - v.y1) ** 2) },
  { subject: "Mathematics", level: "Secondary", name: "Sine rule (side)", formula: "a ÷ sin A = b ÷ sin B", explanation: "In any triangle, sides are proportional to the sines of opposite angles. Enter a, A (degrees) and B to find b.", variables: ["a", "A", "B"], solve: (v: Record<string, number>) => { const ar = (v.A * Math.PI) / 180; const br = (v.B * Math.PI) / 180; return (v.a * Math.sin(br)) / Math.sin(ar); } },
  { subject: "Mathematics", level: "Secondary", name: "Cosine rule (side)", formula: "c² = a² + b² − 2ab cos C", explanation: "Find a side when two sides and the included angle are known.", variables: ["a", "b", "C"], solve: (v: Record<string, number>) => Math.sqrt(v.a ** 2 + v.b ** 2 - 2 * v.a * v.b * Math.cos((v.C * Math.PI) / 180)) },
  { subject: "Mathematics", level: "Secondary", name: "Volume of cylinder", formula: "V = πr²h", explanation: "Volume of a right circular cylinder.", variables: ["r", "h"], solve: (v: Record<string, number>) => Math.PI * v.r ** 2 * v.h },
  { subject: "Mathematics", level: "Secondary", name: "Volume of sphere", formula: "V = ⁴⁄₃πr³", explanation: "Volume of a sphere from its radius.", variables: ["r"], solve: (v: Record<string, number>) => (4 / 3) * Math.PI * v.r ** 3 },
  { subject: "Mathematics", level: "University", name: "Arithmetic series sum", formula: "Sₙ = n/2 × (2a + (n−1)d)", explanation: "Sum of the first n terms of an arithmetic progression.", variables: ["n", "a", "d"], solve: (v: Record<string, number>) => (v.n / 2) * (2 * v.a + (v.n - 1) * v.d) },
  { subject: "Mathematics", level: "University", name: "Geometric series sum", formula: "Sₙ = a(1 − rⁿ) ÷ (1 − r)", explanation: "Sum of the first n terms of a geometric progression (r ≠ 1).", variables: ["a", "r", "n"], solve: (v: Record<string, number>) => v.a * (1 - v.r ** v.n) / (1 - v.r) },
  { subject: "Mathematics", level: "University", name: "Permutation nPr", formula: "nPr = n! ÷ (n−r)!", explanation: "Ordered arrangements of r items from n.", variables: ["n", "r"], solve: (v: Record<string, number>) => { const fact = (k: number) => { let p = 1; for (let i = 2; i <= k; i++) p *= i; return p; }; return fact(v.n) / fact(v.n - v.r); } },
  { subject: "Mathematics", level: "University", name: "Combination nCr", formula: "nCr = n! ÷ (r!(n−r)!)", explanation: "Unordered selections of r items from n.", variables: ["n", "r"], solve: (v: Record<string, number>) => { const fact = (k: number) => { let p = 1; for (let i = 2; i <= k; i++) p *= i; return p; }; return fact(v.n) / (fact(v.r) * fact(v.n - v.r)); } },
  { subject: "Mathematics", level: "Professional", name: "Present value", formula: "PV = FV ÷ (1 + r)ⁿ", explanation: "Discount a future cash amount to present value at rate r over n periods.", variables: ["FV", "r", "n"], solve: (v: Record<string, number>) => v.FV / (1 + v.r) ** v.n },
  { subject: "Mathematics", level: "Professional", name: "Future value annuity", formula: "FV = PMT × ((1+r)ⁿ − 1) ÷ r", explanation: "Future value of equal payments at end of each period.", variables: ["PMT", "r", "n"], solve: (v: Record<string, number>) => v.PMT * ((1 + v.r) ** v.n - 1) / v.r },
  { subject: "Statistics", level: "Primary", name: "Median of three", formula: "median = middle value after sorting", explanation: "Enter three numbers a ≤ b ≤ c conceptually; this returns the middle of three inputs.", variables: ["a", "b", "c"], solve: (v: Record<string, number>) => [v.a, v.b, v.c].sort((x, y) => x - y)[1] },
  { subject: "Statistics", level: "Secondary", name: "Probability (equally likely)", formula: "P = favourable ÷ total", explanation: "Classical probability for equally likely outcomes.", variables: ["favourable", "total"], solve: (v: Record<string, number>) => v.favourable / v.total },
  { subject: "Statistics", level: "University", name: "Standard error of mean", formula: "SE = σ ÷ √n", explanation: "Standard error decreases as sample size increases.", variables: ["σ", "n"], solve: (v: Record<string, number>) => v.σ / Math.sqrt(v.n) },
  { subject: "Statistics", level: "Professional", name: "Coefficient of variation", formula: "CV = (σ ÷ μ) × 100", explanation: "Relative variability as a percentage of the mean.", variables: ["σ", "μ"], solve: (v: Record<string, number>) => (v.σ / v.μ) * 100 },
  { subject: "Physics", level: "Primary", name: "Speed", formula: "v = d ÷ t", explanation: "Average speed is distance divided by time.", variables: ["d", "t"], solve: (v: Record<string, number>) => v.d / v.t },
  { subject: "Physics", level: "Secondary", name: "Density", formula: "ρ = m ÷ V", explanation: "Density is mass per unit volume.", variables: ["m", "V"], solve: (v: Record<string, number>) => v.m / v.V },
  { subject: "Physics", level: "Secondary", name: "Weight", formula: "W = mg", explanation: "Weight is mass times gravitational field strength.", variables: ["m", "g"], solve: (v: Record<string, number>) => v.m * v.g },
  { subject: "Physics", level: "Secondary", name: "Pressure", formula: "P = F ÷ A", explanation: "Pressure is force per unit area.", variables: ["F", "A"], solve: (v: Record<string, number>) => v.F / v.A },
  { subject: "Physics", level: "University", name: "Momentum", formula: "p = mv", explanation: "Linear momentum is mass times velocity.", variables: ["m", "v"], solve: (v: Record<string, number>) => v.m * v.v },
  { subject: "Physics", level: "University", name: "Wave speed", formula: "v = fλ", explanation: "Wave speed equals frequency times wavelength.", variables: ["f", "λ"], solve: (v: Record<string, number>) => v.f * v["λ"] },
  { subject: "Physics", level: "Professional", name: "Gravitational force", formula: "F = G m₁ m₂ ÷ r²", explanation: "Newton's law of universal gravitation.", variables: ["G", "m1", "m2", "r"], solve: (v: Record<string, number>) => (v.G * v.m1 * v.m2) / v.r ** 2 },
  { subject: "Chemistry", level: "Primary", name: "Percentage composition", formula: "% = (part mass ÷ total mass) × 100", explanation: "Mass percent of an element or component in a sample.", variables: ["part", "total"], solve: (v: Record<string, number>) => (v.part / v.total) * 100 },
  { subject: "Chemistry", level: "Secondary", name: "Dilution", formula: "C₁V₁ = C₂V₂", explanation: "Solve for C₂ given initial concentration and volumes.", variables: ["C1", "V1", "V2"], solve: (v: Record<string, number>) => (v.C1 * v.V1) / v.V2 },
  { subject: "Chemistry", level: "University", name: "Ideal gas density", formula: "ρ = PM ÷ RT", explanation: "Gas density from pressure, molar mass, gas constant and temperature.", variables: ["P", "M", "R", "T"], solve: (v: Record<string, number>) => (v.P * v.M) / (v.R * v.T) },
  { subject: "Chemistry", level: "Professional", name: "Reaction rate (simple)", formula: "rate = Δconcentration ÷ Δtime", explanation: "Average rate of change of concentration with time.", variables: ["dC", "dt"], solve: (v: Record<string, number>) => v.dC / v.dt },
  { subject: "Business Mathematics", level: "Secondary", name: "Profit", formula: "Profit = Revenue − Cost", explanation: "Basic profit from revenue and total cost.", variables: ["Revenue", "Cost"], solve: (v: Record<string, number>) => v.Revenue - v.Cost },
  { subject: "Business Mathematics", level: "University", name: "Markup percent", formula: "Markup % = (selling − cost) ÷ cost × 100", explanation: "Markup relative to cost price.", variables: ["selling", "cost"], solve: (v: Record<string, number>) => ((v.selling - v.cost) / v.cost) * 100 },
  { subject: "Business Mathematics", level: "Professional", name: "Break-even units", formula: "Q = Fixed ÷ (Price − Variable)", explanation: "Units needed to cover fixed costs at a contribution margin.", variables: ["Fixed", "Price", "Variable"], solve: (v: Record<string, number>) => v.Fixed / (v.Price - v.Variable) },
  { subject: "Chemistry", level: "Professional", name: "Beer–Lambert law", formula: "A = εlc", explanation: "Absorbance is proportional to molar absorptivity, path length and concentration.", variables: ["ε", "l", "c"], solve: (v: Record<string, number>) => v.ε * v.l * v.c },
];

const languageOptions = supportedLocales.map(([code, label]) => ({
  code,
  label,
}));

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function factorial(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 170) {
    throw new Error("Factorial requires a whole number from 0 to 170.");
  }
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

function angleToRadians(value: number, mode: AngleMode) {
  if (mode === "RAD") return value;
  if (mode === "GRAD") return (value * Math.PI) / 200;
  return (value * Math.PI) / 180;
}

function radiansToAngle(value: number, mode: AngleMode) {
  if (mode === "RAD") return value;
  if (mode === "GRAD") return (value * 200) / Math.PI;
  return (value * 180) / Math.PI;
}

function evaluateExpression(
  expression: string,
  angleMode: AngleMode,
  ans: number,
) {
  let source = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "PI")
    .replace(/√/g, "sqrt")
    .replace(/∛/g, "cbrt")
    .replace(/\^/g, "**")
    .replace(/\bmod\b/gi, "%")
    .replace(/\s+/g, "");

  // Treat a trailing percent as a percentage while preserving a/b-style modulo.
  source = source.replace(/(\d+(?:\.\d+)?)%(?!\d|\.)/g, "($1/100)");
  // Scientific-notation key: 1 EXP 6 => 1 × 10^6.
  source = source.replace(/(\d+(?:\.\d+)?)[eE][+-]?(\d+)/g, (_, mantissa, exponent) => {
    const sign = String(exponent).startsWith("-") ? "-" : "";
    const digits = String(exponent).replace(/^[+-]/, "");
    return `(${mantissa}*10**${sign}${digits})`;
  });

  source = source.replace(/\bAns\b/gi, "ANS");
  source = source.replace(/\be\^/gi, "exp(");

  if (!/^[0-9A-Za-z_+*/().,%-]*$/.test(source)) {
    throw new Error("Unsupported character in expression.");
  }

  const rad = (v: number) => angleToRadians(v, angleMode);
  const fromRad = (v: number) => radiansToAngle(v, angleMode);
  const sin = (v: number) => Math.sin(rad(v));
  const cos = (v: number) => Math.cos(rad(v));
  const tan = (v: number) => Math.tan(rad(v));
  const asin = (v: number) => fromRad(Math.asin(v));
  const acos = (v: number) => fromRad(Math.acos(v));
  const atan = (v: number) => fromRad(Math.atan(v));
  const log = (v: number) => Math.log10(v);
  const ln = (v: number) => Math.log(v);
  const sqrt = (v: number) => Math.sqrt(v);
  const cbrt = (v: number) => Math.cbrt(v);
  const abs = (v: number) => Math.abs(v);
  const floor = (v: number) => Math.floor(v);
  const ceil = (v: number) => Math.ceil(v);
  const tenPow = (v: number) => 10 ** v;
  const exp = (v: number) => Math.exp(v);
  const nPr = (n: number, r: number) => factorial(n) / factorial(n - r);
  const nCr = (n: number, r: number) =>
    factorial(n) / (factorial(r) * factorial(n - r));

  source = source.replace(/\be\b/g, "E");

  const value = Function(
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "log",
    "ln",
    "sqrt",
    "cbrt",
    "abs",
    "floor",
    "ceil",
    "tenPow",
    "exp",
    "nPr",
    "nCr",
    "PI",
    "E",
    "ANS",
    `"use strict"; return (${source})`,
  )(
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
    log,
    ln,
    sqrt,
    cbrt,
    abs,
    floor,
    ceil,
    tenPow,
    exp,
    nPr,
    nCr,
    Math.PI,
    Math.E,
    ans,
  );

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Math error.");
  }
  return value;
}

function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    let sentinel: WakeLockSentinel | null = null;
    const acquire = async () => {
      try {
        sentinel = await (navigator as Navigator & {
          wakeLock: { request(type: "screen"): Promise<WakeLockSentinel> };
        }).wakeLock.request("screen");
      } catch {
        // Some browsers require a user gesture; the setting remains enabled.
      }
    };

    void acquire();

    const onVisibility = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      void sentinel?.release().catch(() => undefined);
    };
  }, [enabled]);
}

function ToolsPage() {
  const [activeTool, setActiveTool] = useState<HubTool>("calculator");
  const [menuOpen, setMenuOpen] = useState(false);
  const [calculatorFullscreen, setCalculatorFullscreen] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>("basic");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const [ans, setAns] = useState(0);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>(() =>
    typeof window === "undefined"
      ? []
      : JSON.parse(
          window.localStorage.getItem("phenom-calculator-history") || "[]",
        ),
  );
  const calculatorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<ThemeMode>("system");
  const [fontScale, setFontScale] = useState(1);
  const [keepAwake, setKeepAwake] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [toolLocale, setToolLocale] = useState<SupportedLocale>(() => getLocale());

  const [unitCategory, setUnitCategory] = useState("Length");
  const [unitFrom, setUnitFrom] = useState("m");
  const [unitTo, setUnitTo] = useState("km");
  const [unitValue, setUnitValue] = useState("1");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("NGN");
  const [currencyAmount, setCurrencyAmount] = useState("1");
  const [currency, setCurrency] = useState<CurrencyState | null>(null);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  const [formulaSubject, setFormulaSubject] = useState("Mathematics");
  const [formulaLevel, setFormulaLevel] = useState("Primary");
  const [formulaId, setFormulaId] = useState(formulaLibrary[0].name);
  const [formulaValues, setFormulaValues] = useState<Record<string, string>>({});

  const [graphExpression, setGraphExpression] = useState("sin(x)");
  const [graphExpression2, setGraphExpression2] = useState("");
  const [graphMin, setGraphMin] = useState("-10");
  const [graphMax, setGraphMax] = useState("10");
  const [graphScale, setGraphScale] = useState(35);

  const [englishInput, setEnglishInput] = useState("");
  const [englishMode, setEnglishMode] = useState("Definition");
  const [englishOutput, setEnglishOutput] = useState("");
  const [englishBusy, setEnglishBusy] = useState(false);

  const [translationInput, setTranslationInput] = useState("");
  const [translationTarget, setTranslationTarget] = useState<SupportedLocale>(() => getLocale());
  const [translationOutput, setTranslationOutput] = useState("");
  const [translationBusy, setTranslationBusy] = useState(false);
  const [speechVoice, setSpeechVoice] = useState("");
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [translationPremium, setTranslationPremium] = useState(false);
  const [speechPremium, setSpeechPremium] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);

  const [scannerMode, setScannerMode] = useState<"ocr" | "reader" | "codes">("ocr");
  const [snapshots, setSnapshots] = useState<Snap[]>([]);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrResult, setOcrResult] = useState("");
  const [codeType, setCodeType] = useState("qrcode");
  const [codeText, setCodeText] = useState("");
  const [codeSvg, setCodeSvg] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [fileRef, setFileRef] = useState<HTMLInputElement | null>(null);

  const [pasteText, setPasteText] = useState("");

  /* Productivity helpers */
  const [percentBase, setPercentBase] = useState("");
  const [percentRate, setPercentRate] = useState("");
  const [dateA, setDateA] = useState("");
  const [dateB, setDateB] = useState("");
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [notes, setNotes] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem("phenom-calculator-notes") || "",
  );
  const [randomMin, setRandomMin] = useState("1");
  const [randomMax, setRandomMax] = useState("100");
  const [randomOut, setRandomOut] = useState("");

  const codes = useMemo(() => getCurrencyCodes(), []);

  const selectedCategory = unitCategories.find((category) => category.name === unitCategory) ?? unitCategories[0];
  const selectedFormula = formulaLibrary.find(
    (formula) =>
      formula.name === formulaId &&
      formula.subject === formulaSubject &&
      formula.level === formulaLevel,
  ) ?? formulaLibrary.find((formula) => formula.subject === formulaSubject && formula.level === formulaLevel) ?? formulaLibrary[0];

  const filteredFormulas = formulaLibrary.filter(
    (formula) => formula.subject === formulaSubject && formula.level === formulaLevel,
  );

  const selectedFromUnit =
    selectedCategory.units.find((unit) => unit.symbol === unitFrom) ??
    selectedCategory.units[0];
  const selectedToUnit =
    selectedCategory.units.find((unit) => unit.symbol === unitTo) ??
    selectedCategory.units[1] ??
    selectedCategory.units[0];

  const convertedUnit = (() => {
    const value = Number(unitValue);
    if (!Number.isFinite(value)) return null;
    if (unitCategory === "Temperature") {
      const toC = unitFrom === "°C" ? value : unitFrom === "°F" ? (value - 32) * (5 / 9) : value - 273.15;
      return unitTo === "°C" ? toC : unitTo === "°F" ? toC * (9 / 5) + 32 : toC + 273.15;
    }
    return (value * selectedFromUnit.factor) / selectedToUnit.factor;
  })();

  const convertedCurrency =
    currency && Number.isFinite(Number(currencyAmount))
      ? convertCurrency(Number(currencyAmount), currencyFrom, currencyTo, currency.rates)
      : null;

  useWakeLock(keepAwake);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("phenom-tools-theme") as ThemeMode | null;
    const storedScale = Number(window.localStorage.getItem("phenom-tools-font-scale") || "1");
    const storedWake = window.localStorage.getItem("phenom-tools-keep-awake") === "true";
    if (storedTheme) setTheme(storedTheme);
    if (Number.isFinite(storedScale) && storedScale >= 0.85 && storedScale <= 1.35) setFontScale(storedScale);
    setKeepAwake(storedWake);
  }, []);

  useEffect(() => {
    const syncLocale = () => {
      const locale = getLocale();
      setToolLocale(locale);
      setTranslationTarget((current) => current || locale);
    };
    syncLocale();
    window.addEventListener("phenom-locale-change", syncLocale);
    return () => window.removeEventListener("phenom-locale-change", syncLocale);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth || typeof synth.getVoices !== "function") return;
    const chooseVoice = () => {
      const preferredSpeech = toolLocale.toLowerCase();
      try {
        const voices = synth.getVoices();
        setSpeechVoices(voices);
        const exact = voices.find((voice) => voice.lang.toLowerCase() === preferredSpeech);
        const language = preferredSpeech.split("-")[0];
        const regional = voices.find((voice) => voice.lang.toLowerCase().startsWith(`${language}-`));
        if (exact || regional) setSpeechVoice((current) => current || (exact || regional)!.name);
      } catch {
        setSpeechVoices([]);
      }
    };
    chooseVoice();
    synth.addEventListener?.("voiceschanged", chooseVoice);
    return () => synth.removeEventListener?.("voiceschanged", chooseVoice);
  }, [toolLocale]);


  useEffect(() => {
    const resolvedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    document.documentElement.dataset.phenomToolsTheme = resolvedTheme;
    document.documentElement.style.setProperty("--phenom-tools-font-scale", String(fontScale));
    localStorage.setItem("phenom-tools-theme", theme);
    localStorage.setItem("phenom-tools-font-scale", String(fontScale));
    localStorage.setItem("phenom-tools-keep-awake", String(keepAwake));
  }, [theme, fontScale, keepAwake]);

  useEffect(() => {
    localStorage.setItem("phenom-calculator-history", JSON.stringify(history.slice(0, 100)));
  }, [history]);

  useEffect(() => {
    const listener = () => setCalculatorFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);

  useEffect(() => {
    void getLiveCurrencyRates().then(setCurrency).finally(() => setCurrencyLoading(false));
    void (async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) return;
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (userId) {
          const [tools, speech, subs] = await Promise.all([
            supabase.rpc("has_premium_access", {
              p_service_code: "tools_premium",
              p_user_id: userId,
            }),
            supabase.rpc("has_premium_access", {
              p_service_code: "tools_speech_premium",
              p_user_id: userId,
            }),
            getMyActiveSubscriptions(),
          ]);
          setTranslationPremium(Boolean(tools.data));
          setSpeechPremium(Boolean(speech.data));
          setActiveSubscriptions(subs);
        }
      } catch {
        // Public/free tools remain usable.
      }
    })();
  }, []);

  useEffect(() => {
    if (!filteredFormulas.some((formula) => formula.name === formulaId)) {
      setFormulaId(filteredFormulas[0]?.name || formulaLibrary[0].name);
      setFormulaValues({});
    }
  }, [formulaSubject, formulaLevel, filteredFormulas, formulaId]);

  const currentTool = toolMenu.find((tool) => tool.id === activeTool) ?? toolMenu[0];
  const CurrentIcon = currentTool.icon;

  function insert(value: string) {
    setExpr((previous) => `${previous}${value}`);
  }

  function calculate() {
    try {
      if (!expr.trim()) return;
      const value = evaluateExpression(expr, angleMode, ans);
      const output = Number(value.toPrecision(14)).toString();
      setResult(output);
      setAns(value);
      setHistory((items) => [`${expr} = ${output}`, ...items].slice(0, 100));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Math error.");
    }
  }

  function applyScientific(label: string) {
    if (!expr.trim()) {
      setResult("Enter a value or expression first.");
      return;
    }
    try {
      const value = evaluateExpression(expr, angleMode, ans);
      const operations: Record<string, (n: number) => number> = {
        sin: (n) => Math.sin(angleToRadians(n, angleMode)),
        cos: (n) => Math.cos(angleToRadians(n, angleMode)),
        tan: (n) => Math.tan(angleToRadians(n, angleMode)),
        asin: (n) => radiansToAngle(Math.asin(n), angleMode),
        acos: (n) => radiansToAngle(Math.acos(n), angleMode),
        atan: (n) => radiansToAngle(Math.atan(n), angleMode),
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        asinh: Math.asinh,
        acosh: Math.acosh,
        atanh: Math.atanh,
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        square: (n) => n ** 2,
        cube: (n) => n ** 3,
        reciprocal: (n) => 1 / n,
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        exp: Math.exp,
        tenPow: (n) => 10 ** n,
        factorial,
      };
      const next = operations[label](value);
      if (!Number.isFinite(next)) throw new Error("Math error.");
      setResult(String(Number(next.toPrecision(14))));
      setAns(next);
      setHistory((items) => [`${label}(${expr}) = ${next}`, ...items].slice(0, 100));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Math error.");
    }
  }

  async function toggleFullscreen() {
    if (!calculatorRef.current) return;
    try {
      if (!document.fullscreenElement) await calculatorRef.current.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      setCalculatorFullscreen(false);
    }
  }

  function clearCalculator() {
    setExpr("");
    setResult("");
  }

  function toggleSign() {
    setExpr((value) => {
      const trimmed = value.trim();
      if (!trimmed) return "-";
      if (trimmed.startsWith("-(") && trimmed.endsWith(")")) return trimmed.slice(2, -1);
      return `-(${trimmed})`;
    });
  }

  function applyMemory(action: "MC" | "MR" | "M+" | "M-" | "MS") {
    if (action === "MC") return setMemory(0);
    if (action === "MR") return setExpr((value) => `${value}${memory}`);
    if (action === "MS") {
      const value = Number(result);
      if (Number.isFinite(value)) setMemory(value);
      return;
    }
    const value = Number(result);
    if (!Number.isFinite(value)) return;
    setMemory((m) => (action === "M+" ? m + value : m - value));
  }

  function buildGraph(expression: string, expression2: string) {
    const min = Number(graphMin);
    const max = Number(graphMax);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
      return { error: "Choose a valid x-range." };
    }

    try {
      const width = 760;
      const height = 420;
      const samples = 420;
      const xToPx = (x: number) => ((x - min) / (max - min)) * width;
      const yToPx = (y: number) => height / 2 - y * graphScale;

      const plot = (source: string) => {
        if (!source.trim()) return "";
        const points: string[] = [];

        for (let i = 0; i <= samples; i += 1) {
          const x = min + ((max - min) * i) / samples;

          try {
            const y = evaluateGraphExpression(source, x);
            if (!Number.isFinite(y) || Math.abs(y) > 1e6) {
              points.push("M");
              continue;
            }
            points.push(`${xToPx(x).toFixed(1)},${yToPx(y).toFixed(1)}`);
          } catch {
            points.push("M");
          }
        }

        let d = "";
        let lastWasBreak = true;

        for (const point of points) {
          if (point === "M") {
            lastWasBreak = true;
            continue;
          }
          d += `${lastWasBreak ? "M" : "L"}${point}`;
          lastWasBreak = false;
        }

        return d;
      };

      const path1 = plot(expression);
      const path2 = plot(expression2);

      if (!path1 && !path2) {
        return { error: "The graph expression could not be plotted." };
      }

      return { width, height, path1, path2, error: "" };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Could not plot graph.",
      };
    }
  }


  async function runAi(prompt: string) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Connect Phenom Best Core first.");
    const { data, error } = await supabase.functions.invoke("ai-router", {
      body: { mode: "reasoning", prompt },
    });
    if (error) throw error;
    return String(data?.text || "");
  }

  async function runEnglish() {
    const input = englishInput.trim();
    if (!input) return;
    setEnglishBusy(true);
    try {
      const response = await runAi(
        `You are the Phenom Best Academy English Literacy service. Task: ${englishMode}.
For a single word, include correct spelling, a concise definition, useful synonyms and antonyms, pronunciation in readable phonetics and IPA where appropriate, phonics/sound breakdown when useful, British English and American English differences when they exist, common mistakes, and 2 examples. For a phrase or sentence, correct it where necessary, explain grammar, pronunciation, vocabulary and common errors. If the user asks for transcription, provide an IPA-style phonetic transcription and clearly label it. Do not provide CPD course lessons unless the user explicitly has that learning programme; this is the Tools service.
User input:
${input}`,
      );
      setEnglishOutput(response);
    } catch (error) {
      setEnglishOutput(error instanceof Error ? error.message : "Phenom Best Core could not complete the language task.");
    } finally {
      setEnglishBusy(false);
    }
  }

  function speak(text: string, language = "en-GB") {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth || typeof synth.speak !== "function") {
      setTranslationOutput("Speech synthesis is not available on this device/browser.");
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      const voices = typeof synth.getVoices === "function" ? synth.getVoices() : [];
      const voice = voices.find((candidate) => candidate.name === speechVoice);
      if (voice) utterance.voice = voice;
      synth.cancel();
      synth.speak(utterance);
    } catch {
      setTranslationOutput("Speech synthesis is not ready on this device. Please try again.");
    }
  }

  async function translate() {
    const input = translationInput.trim();
    if (!input) return;
    setTranslationBusy(true);
    try {
      const sentences = (input.match(/[.!?]+(?=\s|$)/g) || []).length || 1;
      if (!translationPremium && sentences > 5) {
        throw new Error(
          "Free translation supports up to 5 sentences per request. Tools Premium removes this sentence limit, subject to fair-use limits.",
        );
      }
      const label =
        languageOptions.find((language) => language.code === translationTarget)?.label ||
        translationTarget;
      const response = await runAi(
        `Translate the following text into ${label}. Preserve meaning, names, numbers, punctuation and line breaks. Do not add commentary. If the input is a single word, give the direct translation only. If a pronunciation is requested, give a useful pronunciation guide.
Text:
${input}`,
      );
      setTranslationOutput(response);
    } catch (error) {
      setTranslationOutput(error instanceof Error ? error.message : "Phenom Best Core could not complete the translation.");
    } finally {
      setTranslationBusy(false);
    }
  }

  async function processImage(file: File) {
    setOcrBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const supabase = getSupabase();
      if (!supabase) throw new Error("Connect Phenom Best Core first.");
      const { data: output, error } = await supabase.functions.invoke("ai-router", {
        body: {
          mode: "reasoning",
          image: dataUrl,
          prompt: `You are the Phenom Best Academy all-purpose image-to-text and document processing service.
Transcribe the supplied image verbatim first. Preserve words, numbers, punctuation, line breaks, tables, symbols and handwriting as faithfully as possible. Identify the language where possible. Do not silently correct the transcription. Then provide a separate ANALYSIS section. If the image contains a mathematics, physics, chemistry or academic question, provide a separate step-by-step solution after the transcription.
The user may combine up to 10 snapshots into one document.`,
        },
      });
      if (error) throw error;
      const text = String(output?.text || "No text returned.");
      setSnapshots((items) =>
        [...items, { id: crypto.randomUUID(), name: file.name, text, createdAt: new Date().toISOString() }].slice(-10),
      );
      setOcrResult(text);
    } catch (error) {
      setOcrResult(error instanceof Error ? error.message : "Phenom Best Core could not complete the image/document task.");
    } finally {
      setOcrBusy(false);
    }
  }

  async function processSnapshots() {
    if (!snapshots.length) return;
    setOcrBusy(true);
    try {
      const response = await runAi(
        `Combine and process these up to 10 consecutive image snapshots as one document. Preserve the extracted text first, then organise the content into a clean document. Retain tables and headings where possible. If it contains questions, solve them step-by-step after the transcription. Do not omit visible information.

${snapshots.map((item, index) => `SNAPSHOT ${index + 1} (${item.name}):\n${item.text}`).join("\n\n")}`,
      );
      setOcrResult(response);
    } catch (error) {
      setOcrResult(error instanceof Error ? error.message : "Could not process snapshots.");
    } finally {
      setOcrBusy(false);
    }
  }

  async function readCode(file: File) {
    const Detector = (window as typeof window & {
      BarcodeDetector?: new (options?: { formats?: string[] }) => {
        detect(image: ImageBitmap): Promise<Array<{ rawValue?: string; format?: string }>>;
      };
    }).BarcodeDetector;

    if (Detector) {
      try {
        const detector = new Detector({
          formats: [
            "qr_code",
            "data_matrix",
            "aztec",
            "pdf417",
            "code_128",
            "code_39",
            "ean_13",
            "ean_8",
          ],
        });
        const image = await createImageBitmap(file);
        const detected = await detector.detect(image);
        image.close?.();
        setScanResult(
          detected.length
            ? detected.map((item) => `${item.format || "code"}: ${item.rawValue || ""}`).join("\n")
            : "No supported code was detected.",
        );
        return;
      } catch {
        // Fall through to AI image processing.
      }
    }

    await processImage(file);
  }

  function createCode() {
    try {
      const payload =
        codeType === "qrcode" && (contactName || contactPhone || contactEmail || contactUrl)
          ? [
              "BEGIN:VCARD",
              "VERSION:3.0",
              contactName ? `FN:${contactName}` : "",
              contactPhone ? `TEL:${contactPhone}` : "",
              contactEmail ? `EMAIL:${contactEmail}` : "",
              contactUrl ? `URL:${contactUrl}` : "",
              "END:VCARD",
            ]
              .filter(Boolean)
              .join("\n")
          : codeText.trim();

      if (!payload) {
        setScanResult("Enter data to encode first.");
        return;
      }

      const svg = bwipjs.toSVG({
        bcid: codeType,
        text: payload,
        scale: 3,
        height: codeType === "pdf417" ? 12 : 18,
        includetext: codeType === "code128" || codeType === "code39",
        textxalign: "center",
        padding: 10,
      });

      setCodeSvg(svg);
      setScanResult(`Created ${codeType.toUpperCase()} successfully.`);
    } catch (error) {
      setCodeSvg("");
      setScanResult(error instanceof Error ? error.message : "Could not create code.");
    }
  }

  function downloadCode() {
    if (!codeSvg) return;
    const blob = new Blob([codeSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `phenom-${codeType}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function printCode() {
    if (!codeSvg) return;
    const popup = window.open("", "_blank", "noopener,noreferrer,width=700,height=700");
    if (!popup) return;
    popup.document.write(`<html><head><title>Phenom ${codeType}</title></head><body style="font-family:sans-serif;text-align:center;padding:30px">${codeSvg}<p>Phenom Best Academy</p></body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("phenom-calculator-notes", notes);
  }, [notes]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = window.setInterval(() => setTimerSec((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const percentResult = useMemo(() => {
    const b = Number(percentBase);
    const r = Number(percentRate);
    if (!Number.isFinite(b) || !Number.isFinite(r)) return "";
    return String(Number(((b * r) / 100).toPrecision(10)));
  }, [percentBase, percentRate]);

  const dateDiff = useMemo(() => {
    if (!dateA || !dateB) return "";
    const a = new Date(dateA).getTime();
    const b = new Date(dateB).getTime();
    if (!Number.isFinite(a) || !Number.isFinite(b)) return "";
    const days = Math.abs(Math.round((b - a) / 86400000));
    return `${days} day${days === 1 ? "" : "s"}`;
  }, [dateA, dateB]);

  async function pasteIntoTools() {
    try {
      const value = await navigator.clipboard.readText();
      setPasteText(value);
      setEnglishInput(value);
      setTranslationInput(value);
      setExpr(value);
    } catch {
      setPasteText("Clipboard access was not granted. Paste directly into any editable Phenom Tools field.");
    }
  }

  const graph = useMemo(() => buildGraph(graphExpression, graphExpression2), [graphExpression, graphExpression2, graphMin, graphMax, graphScale]);
  const graphError = graph.error;

  return (
    <>
      <style>{`
        .phenom-tools-page { min-height: 70vh; font-size: 1.05rem; color: #0a0a0a; }
        .phenom-tools-page p, .phenom-tools-page li, .phenom-tools-page label { color: #0a0a0a; }
        .phenom-tools-page .text-muted { color: #374151 !important; }
        .phenom-calc-key {
          min-height: 3rem; border-radius: 0.65rem; font-weight: 700; font-size: 1.05rem;
          border: 1px solid #d1d5db; background: #3d4f5f; color: #f8fafc;
          box-shadow: 0 2px 0 #1f2937;
          transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease;
          touch-action: manipulation; user-select: none;
        }
        .phenom-calc-key:active { transform: scale(0.94) translateY(1px); box-shadow: 0 0 0 #1f2937; filter: brightness(1.12); }
        .phenom-calc-key-op { background: #2b3a48; }
        .phenom-calc-key-fn { background: #334155; font-size: 0.82rem; }
        .phenom-calc-key-eq { background: #1E3A8A; border-color: #1e3a8a; }
        .phenom-calc-key-clr { background: #1d4ed8; border-color: #1d4ed8; }
        .phenom-feature-tile {
          border-radius: 1rem; border: 1px solid #e5e7eb; background: #fff;
          padding: 0.9rem 1rem; text-align: left; color: #0a0a0a;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .phenom-feature-tile:active { transform: scale(0.98); }
        .phenom-feature-tile:hover { box-shadow: 0 8px 24px rgba(15,23,42,0.08); }
        [data-phenom-tools-theme="dark"] .phenom-tools-page { background: #0f1728; color: #f1f5f9; border-radius: 2rem; padding-bottom: 2rem; }
        [data-phenom-tools-theme="dark"] .phenom-tools-surface { background: #182235 !important; color: #f8f3e7; border-color: #33445f !important; }
        [data-phenom-tools-theme="dark"] .phenom-tools-surface .text-muted { color: #b9c3d4 !important; }
        [data-phenom-tools-theme="dark"] .phenom-tools-surface input,
        [data-phenom-tools-theme="dark"] .phenom-tools-surface textarea,
        [data-phenom-tools-theme="dark"] .phenom-tools-surface select,
        [data-phenom-tools-theme="dark"] .phenom-tools-surface button:not(.bg-orange) { background: #101827 !important; color: #f8f3e7; border-color: #33445f !important; }
        [data-phenom-tools-theme="dark"] .phenom-tools-surface .bg-white { background: #101827 !important; }
      `}</style>
      <section
      className="phenom-tools-page mx-auto w-full max-w-[1600px] px-3 py-5 text-ink sm:px-5 lg:px-7"
      style={{ fontSize: `${fontScale}em`, color: "#0a0a0a" }}
    >
      <div
        className="relative overflow-hidden rounded-[2rem] text-cream shadow-card"
        style={{ background: "linear-gradient(145deg, #0d1522 0%, #1E3A8A 52%, #152238 100%)" }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #16A34A 0%, transparent 70%)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <img
              src="/brand/mark-clear.png"
              alt="Phenom Best Academy"
              className="mt-1 h-12 w-12 shrink-0 object-contain drop-shadow-md sm:h-14 sm:w-14"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#FBBF24" }}>
                Phenom Best Academy
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-5xl">
  Phenom Tool Hub
</h1>
              <p className="mt-2 max-w-3xl text-sm text-on-navy sm:text-base">
                The Academy Tool Hub — mathematics, science, engineering, finance, language, scanning and creation in one beautiful workspace.
              </p>
              <p className="mt-1.5 text-xs italic text-on-navy-muted">
                Tranquil Excellence for Global Impact.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="cream" size="sm" onClick={pasteIntoTools}>
              Paste into Tools
            </Button>
            <div className="relative">
              <Button
                variant="cream"
                size="sm"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((value) => !value)}
              >
                <Languages className="mr-2 size-4" />
                {toolLocale}
              </Button>
              {languageOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-navy-deep p-2 shadow-2xl">
                  <p className="px-3 py-2 text-xs text-cream/60">
                    Tool language follows your Academy language selection, then your device/browser language, with English — Nigeria as the fallback.
                  </p>
                  <select
                    aria-label="Tool Hub language"
                    value={toolLocale}
                    onChange={(e) => {
                      const locale = e.target.value as SupportedLocale;
                      setToolLocale(locale);
                      setLocale(locale);
                      setLanguageOpen(false);
                    }}
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-cream outline-none"
                  >
                    {languageOptions.map((language) => (
                      <option key={language.code} value={language.code} className="text-navy-deep">
                        {language.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
            <Button variant="cream" size="sm" onClick={() => setSettingsOpen((value) => !value)}>
              <Settings2 className="mr-2 size-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-4 text-left hover:bg-white/15"
          >
            <span className="flex items-center gap-3">
              <CurrentIcon className="size-5 text-gold" />
              <span>
                <strong className="block">{currentTool.label}</strong>
                <span className="text-xs text-cream/60">{currentTool.description}</span>
              </span>
            </span>
            <ChevronDown className={`size-5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen ? (
            <div className="mt-2 grid gap-2 rounded-2xl bg-white/10 p-2 sm:grid-cols-2 lg:grid-cols-4">
              {toolMenu.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    type="button"
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id);
                      setMenuOpen(false);
                    }}
                    className={`phenom-feature-tile flex w-full items-start gap-3 ${
                      activeTool === tool.id
                        ? "ring-2 ring-gold bg-gold/15"
                        : ""
                    }`}
                  >
                    <Icon className="size-5" />
                    <strong className="mt-2 block text-sm">{tool.label}</strong>
                    <span className="mt-1 block text-[11px] opacity-70">{tool.description}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {settingsOpen ? (
        <div className="phenom-tools-surface mt-4 rounded-2xl border border-line bg-cream p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Tool Hub settings</h2>
              <p className="text-sm text-muted">Your preferences are saved on this device.</p>
            </div>
            <button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings" className="rounded-full p-2 hover:bg-paper">
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-semibold">Theme
              <select className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={theme} onChange={(e) => setTheme(e.target.value as ThemeMode)}>
                <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Font size
              <select className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={fontScale} onChange={(e) => setFontScale(Number(e.target.value))}>
                <option value="0.9">90%</option><option value="1">100%</option><option value="1.1">110%</option><option value="1.2">120%</option><option value="1.3">130%</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm font-semibold">
              <input type="checkbox" checked={keepAwake} onChange={(e) => setKeepAwake(e.target.checked)} />
              Keep screen on while using Tools
            </label>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <strong>Paste / edit</strong>
              <p className="mt-1 text-xs text-muted">Every major tool uses editable fields. Clipboard paste is also available.</p>
            </div>
          </div>
        </div>
      ) : null}

      {!translationPremium ? (
        <div className="mt-4 rounded-2xl border border-orange/30 bg-orange/5 p-4 text-sm text-ink">
          <p className="font-semibold text-ink">Free preview of Premium Tools</p>
          <p className="mt-1 text-muted">
            You can open every Tool Hub section to explore what is available. Some advanced actions
            (long translations, deeper multi-image processing, and premium speech pathways) stay
            locked until Tools Premium is active — or until a matching CPD language plan unlocks
            only the speech capability it requires. Standard calculator, units, formulas, graph,
            codes and productivity helpers remain available.
          </p>
        </div>
      ) : null}

      {activeTool === "calculator" ? (
        <div
          ref={calculatorRef}
          className={`phenom-tools-surface mt-3 rounded-[2rem] border border-line bg-cream p-4 text-ink shadow-card sm:mt-5 sm:p-6 ${
            calculatorFullscreen ? "fixed inset-0 z-[60] m-0 h-[100dvh] max-h-[100dvh] overflow-auto rounded-none" : "min-h-[min(100dvh,920px)]"
          }`}
          style={{ color: "#0a0a0a" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple">Calculator engine</p>
              <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Basic + Scientific</h2>
            </div>
            <Button variant="outline" onClick={toggleFullscreen}>
              {calculatorFullscreen ? <Minimize2 className="mr-2 size-4" /> : <Maximize2 className="mr-2 size-4" />}
              {calculatorFullscreen ? "Exit full screen" : "Full-screen calculator"}
            </Button>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl bg-[#1f2937] p-4 text-right text-cream shadow-inner">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-cream/60">
              <span>{angleMode} · {mode === "scientific" ? "SCI" : "BASIC"} · MATH</span>
              <span>Ans {ans} · M {memory}</span>
            </div>
            <textarea
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") calculate(); }}
              className="min-h-[3.5rem] w-full resize-none border-0 bg-transparent p-0 text-right font-mono text-xl font-semibold text-cream outline-none sm:text-2xl"
              placeholder="0"
              aria-label="Calculator expression"
            />
            <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-cream sm:text-4xl">{result || "0"}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={`rounded-xl px-4 py-2 text-sm font-bold ${mode === "basic" ? "bg-navy-deep text-gold" : "border border-line bg-white"}`} onClick={() => setMode("basic")}>Basic 300+</button>
            <button type="button" className={`rounded-xl px-4 py-2 text-sm font-bold ${mode === "scientific" ? "bg-navy-deep text-gold" : "border border-line bg-white"}`} onClick={() => setMode("scientific")}>Scientific 991+</button>
            <select className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold" value={angleMode} onChange={(e) => setAngleMode(e.target.value as AngleMode)}>
              <option>DEG</option><option>RAD</option><option>GRAD</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["MC", "MR", "M+", "M-", "MS"].map((item) => <Button key={item} size="sm" variant="outline" onClick={() => applyMemory(item as "MC" | "MR" | "M+" | "M-" | "MS")}>{item}</Button>)}
            <Button size="sm" variant="outline" onClick={() => setExpr((value) => value.slice(0, -1))}>⌫</Button>
            <Button size="sm" variant="outline" onClick={clearCalculator}>AC</Button>
            <Button size="sm" variant="outline" onClick={() => setExpr((value) => `${value}Ans`)}>Ans</Button>
            <Button size="sm" variant="outline" onClick={() => setExpr((value) => `${value}π`)}>π</Button>
          </div>

          {/* Inline keypad — no floating overlay */}
          <div className="mt-4 rounded-[1.5rem] border border-line bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
                <div className="flex items-center gap-2">
                  <Keyboard className="size-5" style={{ color: "#16A34A" }} />
                  <div>
                    <p className="font-semibold text-ink">Calculator keypad</p>
                    <p className="text-[11px] text-muted">Basic and Scientific stay on this screen. Other tools open from the menu above.</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setMode("basic")}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold ${mode === "basic" ? "bg-navy-deep text-gold" : "border border-line bg-white text-navy-deep"}`}
                >
                  Basic
                </button>
                <button
                  type="button"
                  onClick={() => setMode("scientific")}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold ${mode === "scientific" ? "bg-navy-deep text-gold" : "border border-line bg-white text-navy-deep"}`}
                >
                  Scientific
                </button>
                <select
                  className="ml-auto shrink-0 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold"
                  value={angleMode}
                  onChange={(e) => setAngleMode(e.target.value as AngleMode)}
                  aria-label="Angle mode"
                >
                  <option>DEG</option><option>RAD</option><option>GRAD</option>
                </select>
              </div>

              {mode === "scientific" ? (
                <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                  {[
                    ["sin", "sin"], ["cos", "cos"], ["tan", "tan"], ["asin", "sin⁻¹"], ["acos", "cos⁻¹"], ["atan", "tan⁻¹"], ["sinh", "sinh"],
                    ["cosh", "cosh"], ["tanh", "tanh"], ["asinh", "sinh⁻¹"], ["acosh", "cosh⁻¹"], ["atanh", "tanh⁻¹"], ["log", "log"],
                    ["ln", "ln"], ["sqrt", "√x"], ["cbrt", "∛x"], ["square", "x²"], ["cube", "x³"], ["tenPow", "10ˣ"], ["exp", "eˣ"],
                    ["reciprocal", "1/x"], ["abs", "|x|"], ["floor", "⌊x⌋"], ["ceil", "⌈x⌉"], ["factorial", "x!"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyScientific(key)}
                      className="phenom-calc-key phenom-calc-key-fn"
                    >
                      {label}
                    </button>
                  ))}
                  <button type="button" onClick={() => insert("nPr(")} className="min-h-11 rounded-xl border border-line bg-white px-2 py-2 text-xs font-bold">nPr</button>
                  <button type="button" onClick={() => insert("nCr(")} className="min-h-11 rounded-xl border border-line bg-white px-2 py-2 text-xs font-bold">nCr</button>
                </div>
              ) : null}

              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {[
                  ["AC", "clear"], ["⌫", "backspace"], ["(", "input"], [")", "input"], ["mod", "input"],
                  ["7", "input"], ["8", "input"], ["9", "input"], ["÷", "input"], ["×", "input"],
                  ["4", "input"], ["5", "input"], ["6", "input"], ["−", "input"], ["+", "input"],
                  ["1", "input"], ["2", "input"], ["3", "input"], ["%", "input"], ["±", "sign"],
                  ["0", "input"], [".", "input"], ["π", "input"], ["e", "input"], ["=", "equals"],
                  ["√", "input"], ["∛", "input"], ["^", "input"], ["EXP", "input"], ["Ans", "input"],
                ].map(([key, action]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (action === "clear") clearCalculator();
                      else if (action === "backspace") setExpr((value) => value.slice(0, -1));
                      else if (action === "sign") toggleSign();
                      else if (action === "equals") calculate();
                      else insert(key === "mod" ? " mod " : key);
                    }}
                    className={`phenom-calc-key ${
                      key === "="
                        ? "phenom-calc-key-eq"
                        : key === "AC"
                          ? "phenom-calc-key-clr"
                          : (key === "÷" || key === "×" || key === "−" || key === "+")
                            ? "phenom-calc-key-op"
                            : ""
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="mt-2 text-[11px] text-muted">
                <span>DEG / RAD / GRAD · memory controls remain above. Switch tools with the dropdown menu only.</span>
              </div>
            </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.8fr]">
            <div>
              <h3 className="font-display text-xl font-semibold">Calculation history</h3>
              <div className="mt-2 max-h-52 overflow-auto rounded-xl bg-paper p-3 font-mono text-sm">
                {history.length ? history.map((item, index) => <p key={`${item}-${index}`} className="border-b border-line py-2 last:border-0">{item}</p>) : <p className="text-muted">No calculations yet.</p>}
              </div>
              <Button variant="outline" className="mt-2" onClick={() => setHistory([])}><Trash2 className="mr-2 size-4" />Clear history</Button>
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <h3 className="font-semibold">Paste and edit</h3>
              <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-line p-3" placeholder="Paste maths, science or language text here, then copy it into the appropriate tool." />
              <Button size="sm" className="mt-2" variant="outline" onClick={() => { setExpr(pasteText); setEnglishInput(pasteText); setTranslationInput(pasteText); }}>Use this text in Calculator / English / Translation</Button>
            </div>
          </div>
        </div>
      ) : null}

      {activeTool === "units" ? (
        <ToolCard title="Unit Converter" icon={<RefreshCw className="text-purple" />} description="Convert practical, mathematical, physics and chemistry quantities, plus live world currencies.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField label="Quantity" value={unitCategory} onChange={(value) => { setUnitCategory(value); const u = unitCategories.find((x) => x.name === value)?.units ?? []; setUnitFrom(u[0]?.symbol || ""); setUnitTo(u[1]?.symbol || u[0]?.symbol || ""); }} options={unitCategories.map((category) => category.name)} />
            <SelectField label="From" value={unitFrom} onChange={setUnitFrom} options={selectedCategory.units.map((unit) => unit.symbol)} labels={selectedCategory.units.map((unit) => unit.label)} />
            <SelectField label="To" value={unitTo} onChange={setUnitTo} options={selectedCategory.units.map((unit) => unit.symbol)} labels={selectedCategory.units.map((unit) => unit.label)} />
            <label className="text-sm font-semibold">Value<input className="mt-1 w-full rounded-xl border border-line bg-white p-3 text-lg" value={unitValue} onChange={(e) => setUnitValue(e.target.value)} inputMode="decimal" /></label>
          </div>
          <div className="mt-5 rounded-2xl bg-navy-deep p-5 text-on-navy">
            <p className="text-xs uppercase tracking-widest text-gold">Converted value</p>
            <p className="mt-2 text-3xl font-bold">{convertedUnit === null ? "—" : `${Number(convertedUnit.toPrecision(12))} ${selectedToUnit.symbol}`}</p>
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold">Live world currency</h3><p className="text-sm text-muted">Rates come from the Academy currency service. Refresh to request current rates.</p></div><Button variant="outline" onClick={() => { setCurrencyLoading(true); void getLiveCurrencyRates(true).then(setCurrency).finally(() => setCurrencyLoading(false)); }}><RefreshCw className="mr-2 size-4" />Refresh</Button></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-semibold">Amount<input type="number" className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={currencyAmount} onChange={(e) => setCurrencyAmount(e.target.value)} /></label>
              <SelectField label="From" value={currencyFrom} onChange={setCurrencyFrom} options={codes} labels={codes.map((code) => currencyName(code))} />
              <SelectField label="To" value={currencyTo} onChange={setCurrencyTo} options={codes} labels={codes.map((code) => currencyName(code))} />
            </div>
            <div className="mt-4 rounded-xl bg-paper p-4 text-2xl font-bold">{currencyLoading ? "Loading live rates…" : convertedCurrency === null ? "—" : `${convertedCurrency.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${currencyTo}`}</div>
          </div>
        </ToolCard>
      ) : null}

      {activeTool === "formulas" ? (
        <ToolCard title="Formula & Units" icon={<FlaskConical className="text-green" />} description="From primary-school foundations to university and professional formulas. Enter values directly and get a result plus an explanation.">
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField label="Subject" value={formulaSubject} onChange={setFormulaSubject} options={["Mathematics", "Statistics", "Business Mathematics", "Physics", "Chemistry"]} />
            <SelectField label="Level" value={formulaLevel} onChange={setFormulaLevel} options={["Primary", "Secondary", "University", "Professional"]} />
            <SelectField label="Formula" value={selectedFormula.name} onChange={setFormulaId} options={filteredFormulas.map((formula) => formula.name)} />
          </div>
          <div className="mt-5 rounded-2xl border border-purple/20 bg-purple/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-purple">{selectedFormula.subject} · {selectedFormula.level}</p>
            <h3 className="mt-2 font-display text-2xl font-bold">{selectedFormula.name}</h3>
            <code className="mt-3 block overflow-auto rounded-xl bg-white p-4 text-base">{selectedFormula.formula}</code>
            <p className="mt-3 text-sm leading-6 text-muted">{selectedFormula.explanation}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {selectedFormula.variables.map((variable) => <label key={variable} className="text-sm font-semibold">{variable}<input className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={formulaValues[variable] || ""} onChange={(e) => setFormulaValues((values) => ({ ...values, [variable]: e.target.value }))} inputMode="decimal" /></label>)}
            </div>
            <Button className="mt-4" onClick={() => { const values = Object.fromEntries(Object.entries(formulaValues).map(([key, value]) => [key, Number(value)])); const answer = selectedFormula.solve(values); setResult(Number.isFinite(answer) ? String(Number(answer.toPrecision(12))) : "Check the entered values."); }}>Solve formula</Button>
            {result && activeTool === "formulas" ? <div className="mt-4 rounded-xl bg-navy-deep p-4 text-xl font-bold text-gold">Answer: {result}</div> : null}
          </div>
        </ToolCard>
      ) : null}

      {activeTool === "graph" ? (
        <ToolCard title="Graph Plotter" icon={<LineChart className="text-blue" />} description="Plot one or two mathematical functions, change the x-range and inspect the curve visually.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-semibold lg:col-span-2">y₁ = f(x)<input className="mt-1 w-full rounded-xl border border-line bg-white p-3 font-mono" value={graphExpression} onChange={(e) => setGraphExpression(e.target.value)} /></label>
            <label className="text-sm font-semibold lg:col-span-2">y₂ = f(x) (optional)<input className="mt-1 w-full rounded-xl border border-line bg-white p-3 font-mono" value={graphExpression2} onChange={(e) => setGraphExpression2(e.target.value)} /></label>
            <label className="text-sm font-semibold">X minimum<input className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={graphMin} onChange={(e) => setGraphMin(e.target.value)} /></label>
            <label className="text-sm font-semibold">X maximum<input className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={graphMax} onChange={(e) => setGraphMax(e.target.value)} /></label>
            <label className="text-sm font-semibold lg:col-span-2">Vertical scale<input type="range" min="10" max="80" value={graphScale} onChange={(e) => setGraphScale(Number(e.target.value))} className="mt-3 w-full" /></label>
          </div>
          <div className="mt-5 overflow-auto rounded-2xl bg-white p-2">
            {graph && "width" in graph && typeof graph.height === 'number' ? <svg viewBox={`0 0 ${graph.width} ${graph.height}`} className="min-w-[700px] w-full" role="img" aria-label="Mathematical graph">
              <rect width={graph.width} height={graph.height} fill="white" />
              <line x1="0" y1={graph.height / 2} x2={graph.width} y2={graph.height / 2} stroke="#8b95a7" strokeWidth="1" />
              <line x1={graph.width / 2} y1="0" x2={graph.width / 2} y2={graph.height} stroke="#8b95a7" strokeWidth="1" />
              <path d={graph.path1} fill="none" stroke="#c94b16" strokeWidth="3" />
              {graph.path2 ? <path d={graph.path2} fill="none" stroke="#1a4a8c" strokeWidth="3" /> : null}
            </svg> : <p className="p-8 text-center text-muted">Enter a plottable expression.</p>}
          </div>
          {graphError ? <p className="mt-3 rounded-xl bg-orange/10 p-3 text-sm">{graphError}</p> : null}
          <p className="mt-3 text-xs text-muted">Try sin(x), cos(x), x^2, sqrt(x), log(x), ln(x), abs(x), or combinations such as 0.5*x^2-3.</p>
        </ToolCard>
      ) : null}

      {activeTool === "english" ? (
        <ToolCard title="English Literacy" icon={<FileText className="text-orange" />} description="Spelling, pronunciation, definition, synonyms, antonyms, phonics, grammar, common mistakes, British vs American English and phonetic transcription.">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <select className="rounded-xl border border-line bg-white p-3" value={englishMode} onChange={(e) => setEnglishMode(e.target.value)}>
              {["Definition", "Spelling", "Pronunciation", "Synonyms & Antonyms", "Phonics", "Grammar", "Common Mistakes", "British vs American English", "IPA / Phonetic Transcription"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <Button onClick={runEnglish} disabled={englishBusy}>{englishBusy ? "Working…" : "Analyse language"}</Button>
          </div>
          <textarea className="mt-3 min-h-36 w-full rounded-xl border border-line bg-white p-4 text-base" value={englishInput} onChange={(e) => setEnglishInput(e.target.value)} placeholder="Type or paste a word, sentence, paragraph or language question…" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => speak(englishInput || "Phenom Best Academy", "en-GB")}><Volume2 className="mr-2 size-4" />Speak British English</Button>
            <Button variant="outline" onClick={() => speak(englishInput || "Phenom Best Academy", "en-US")}><Volume2 className="mr-2 size-4" />Speak American English</Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(englishOutput)} disabled={!englishOutput}><Copy className="mr-2 size-4" />Copy result</Button>
          </div>
          {englishOutput ? <pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-5 text-sm leading-6">{englishOutput}</pre> : null}
          <div className="mt-5 rounded-xl border border-purple/20 bg-purple/5 p-4 text-sm text-muted">
            <strong>CPD distinction:</strong> English Literacy is a Tools service. It does not replace a structured CPD programme. A learner may subscribe to CPD separately; Tools Premium and CPD are separate entitlements. Where a specific CPD language requires premium speech or another Tool function, the relevant Tool entitlement can be enabled for that learning period without turning the entire CPD catalogue into Tools Premium.
          </div>
        </ToolCard>
      ) : null}

      {activeTool === "translation" ? (
        <ToolCard title="Language Translation" icon={<Languages className="text-purple" />} description="Translate supported Academy languages with editable text, pronunciation and device speech.">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <SelectField label="Target language" value={translationTarget} onChange={(value) => setTranslationTarget(value as SupportedLocale)} options={languageOptions.map((language) => language.code)} labels={languageOptions.map((language) => language.label)} />
            <Button onClick={translate} disabled={translationBusy}>{translationBusy ? "Translating…" : "Translate"}</Button>
          </div>
          <textarea className="mt-3 min-h-36 w-full rounded-xl border border-line bg-white p-4 text-base" value={translationInput} onChange={(e) => setTranslationInput(e.target.value)} placeholder="Type or paste text here…" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => speak(translationInput, translationTarget)} disabled={!translationInput}><Volume2 className="mr-2 size-4" />Speak source</Button>
            <Button variant="outline" onClick={() => speak(translationOutput, translationTarget)} disabled={!translationOutput}><Volume2 className="mr-2 size-4" />Speak translation</Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(translationOutput)} disabled={!translationOutput}><Copy className="mr-2 size-4" />Copy</Button>
          </div>
          {translationOutput ? <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-paper p-5 text-sm leading-6">{translationOutput}</pre> : null}
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 ${translationPremium ? "bg-green/10 text-green" : "bg-paper text-muted"}`}>{translationPremium ? "Tools Premium enabled" : "Standard Tools access"}</span>
            {speechPremium ? <span className="rounded-full bg-green/10 px-3 py-1 text-green">Speech Premium enabled</span> : <span className="rounded-full bg-paper px-3 py-1 text-muted">Device speech available where supported</span>}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">Device voice
              <select className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={speechVoice} onChange={(e) => setSpeechVoice(e.target.value)}>
                <option value="">System default voice</option>
                {speechVoices.map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} — {voice.lang}</option>)}
              </select>
            </label>
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <strong>Language catalogue</strong>
              <p className="mt-1 text-xs text-muted">{languageOptions.length} Academy language/locale variants are available for the translation interface.</p>
            </div>
          </div>
        </ToolCard>
      ) : null}

      {activeTool === "scanner" ? (
        <ToolCard title="All-Purpose Scanner & Creator" icon={<QrCode className="text-green" />} description="Image-to-text, text reading, code scanning and code creation for QR, Data Matrix, Aztec, PDF417 and common barcodes.">
          <div className="flex flex-wrap gap-2">
            {[
              ["ocr", "Image to Text"], ["reader", "Text & Image Reader"], ["codes", "Code Scanner / Creator"],
            ].map(([id, label]) => <Button key={id} variant={scannerMode === id ? "primary" : "outline"} onClick={() => setScannerMode(id as typeof scannerMode)}>{label}</Button>)}
          </div>

          {scannerMode === "ocr" ? (
            <div className="mt-5">
              <input ref={(element) => { setFileRef(element); }} className="hidden" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void processImage(file); }} />
              <div className="rounded-2xl border-2 border-dashed border-line p-6 text-center">
                <ScanLine className="mx-auto size-10 text-purple" />
                <h3 className="mt-3 font-display text-xl font-semibold">Up to 10 consecutive images</h3>
                <p className="mt-2 text-sm text-muted">Typed work, handwriting, photographs, symbols and common image formats can be submitted for processing. The configured premium service can perform deeper processing and longer work.</p>
                <Button className="mt-4" onClick={() => fileRef?.click()} disabled={ocrBusy}><Upload className="mr-2 size-4" />{ocrBusy ? "Processing…" : "Add image"}</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={processSnapshots} disabled={ocrBusy || !snapshots.length}>Process {snapshots.length}/10 images</Button>
                <Button variant="outline" onClick={() => { setSnapshots([]); setOcrResult(""); }}><Trash2 className="mr-2 size-4" />Clear</Button>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {snapshots.map((snapshot, index) => <div key={snapshot.id} className="rounded-xl border border-line bg-white p-3 text-sm"><strong>Image {index + 1}</strong><p className="mt-1 truncate text-muted">{snapshot.name}</p></div>)}
              </div>
              {ocrResult ? <div className="mt-4 rounded-2xl bg-paper p-5"><div className="flex flex-wrap justify-between gap-2"><strong>Processed content</strong><Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(ocrResult)}><Copy className="mr-2 size-4" />Copy</Button></div><pre className="mt-3 max-h-[34rem] overflow-auto whitespace-pre-wrap text-sm leading-6">{ocrResult}</pre></div> : null}
            </div>
          ) : null}

          {scannerMode === "reader" ? (
            <div className="mt-5">
              <textarea className="min-h-40 w-full rounded-xl border border-line bg-white p-4" placeholder="Paste or type text to read aloud…" value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => speak(pasteText || "Phenom Best Academy", "en-GB")}><Volume2 className="mr-2 size-4" />Read aloud</Button>
                <Button variant="outline" onClick={() => navigator.clipboard?.writeText(pasteText)}>Copy text</Button>
                <label className="inline-flex cursor-pointer items-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold">
                  Read an image
                  <input className="sr-only" type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; await processImage(file); }} />
                </label>
              </div>
              {ocrResult ? <div className="mt-4 rounded-xl bg-paper p-4"><div className="flex flex-wrap justify-between gap-2"><strong>Image text</strong><Button size="sm" variant="outline" onClick={() => speak(ocrResult, "en-GB")}><Volume2 className="mr-2 size-4" />Read result</Button></div><pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-sm">{ocrResult}</pre></div> : null}
              <p className="mt-3 text-xs text-muted">Speech uses the device's configured text-to-speech capability. The interface does not expose or brand the underlying speech engine.</p>
            </div>
          ) : null}

          {scannerMode === "codes" ? (
            <div className="mt-5 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <h3 className="font-display text-xl font-semibold">Create</h3>
                <SelectField label="Code format" value={codeType} onChange={setCodeType} options={["qrcode", "datamatrix", "azteccode", "pdf417", "code128", "code39", "ean13"]} labels={["QR Code", "Data Matrix", "Aztec Code", "PDF417", "Code 128", "Code 39", "EAN-13"]} />
                <textarea className="mt-3 min-h-32 w-full rounded-xl border border-line bg-white p-4" value={codeText} onChange={(e) => setCodeText(e.target.value)} placeholder="Enter a phone number, email, website, text, numeric data, alphanumeric text or other supported payload…" />
                {codeType === "qrcode" ? <div className="mt-3 rounded-xl border border-line bg-white p-4"><p className="text-sm font-semibold">Contact / link creator</p><div className="mt-2 grid gap-2"><input className="rounded-lg border border-line p-2" placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} /><input className="rounded-lg border border-line p-2" placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /><input className="rounded-lg border border-line p-2" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /><input className="rounded-lg border border-line p-2" placeholder="Website / social media link" value={contactUrl} onChange={(e) => setContactUrl(e.target.value)} /></div><p className="mt-2 text-xs text-muted">Leave contact fields empty to encode the main text box. QR can carry a web link that a scanner can open.</p></div> : null}
                <div className="mt-3 flex flex-wrap gap-2"><Button onClick={createCode}>Create code</Button><Button variant="outline" onClick={downloadCode} disabled={!codeSvg}><Download className="mr-2 size-4" />Save SVG</Button><Button variant="outline" onClick={printCode} disabled={!codeSvg}><Printer className="mr-2 size-4" />Print</Button></div>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">Scan</h3>
                <label className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-line p-6 text-sm font-semibold">Choose code image<input className="sr-only" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void readCode(file); }} /></label>
                {scanResult ? <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm">{scanResult}</pre> : null}
                {codeSvg ? <div className="mt-4 overflow-auto rounded-2xl border border-line bg-white p-5" dangerouslySetInnerHTML={{ __html: codeSvg }} /> : null}
              </div>
            </div>
          ) : null}
        </ToolCard>
      ) : null}

      {activeTool === "productivity" ? (
        <ToolCard
          title="Productivity"
          icon={<StickyNote className="text-green" />}
          description="Everyday helpers for study and work — percentage, date difference, stopwatch, random numbers, quick notes and device speech."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-2 font-semibold"><Percent className="size-4 text-green" /> Percentage</div>
              <label className="mt-3 block text-sm">Base value
                <input type="number" value={percentBase} onChange={(e) => setPercentBase(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2" />
              </label>
              <label className="mt-2 block text-sm">Percentage (%)
                <input type="number" value={percentRate} onChange={(e) => setPercentRate(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2" />
              </label>
              <p className="mt-3 rounded-xl bg-paper px-3 py-2 font-mono font-semibold">{percentResult || "—"}</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-2 font-semibold"><Calendar className="size-4 text-green" /> Date difference</div>
              <label className="mt-3 block text-sm">From
                <input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2" />
              </label>
              <label className="mt-2 block text-sm">To
                <input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2" />
              </label>
              <p className="mt-3 rounded-xl bg-paper px-3 py-2 font-semibold">{dateDiff || "—"}</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-2 font-semibold"><Clock className="size-4 text-green" /> Stopwatch</div>
              <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">
                {String(Math.floor(timerSec / 3600)).padStart(2, "0")}:
                {String(Math.floor((timerSec % 3600) / 60)).padStart(2, "0")}:
                {String(timerSec % 60).padStart(2, "0")}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => setTimerRunning((v) => !v)}>{timerRunning ? "Pause" : "Start"}</Button>
                <Button size="sm" variant="outline" onClick={() => { setTimerRunning(false); setTimerSec(0); }}>Reset</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-2 font-semibold"><Shuffle className="size-4 text-green" /> Random number</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-sm">Min
                  <input type="number" value={randomMin} onChange={(e) => setRandomMin(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2" />
                </label>
                <label className="text-sm">Max
                  <input type="number" value={randomMax} onChange={(e) => setRandomMax(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2" />
                </label>
              </div>
              <Button
                className="mt-3"
                size="sm"
                onClick={() => {
                  const lo = Number(randomMin);
                  const hi = Number(randomMax);
                  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo) {
                    setRandomOut("Invalid range");
                    return;
                  }
                  setRandomOut(String(Math.floor(Math.random() * (hi - lo + 1)) + lo));
                }}
              >
                Generate
              </Button>
              <p className="mt-2 font-mono text-xl font-semibold">{randomOut || "—"}</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 font-semibold"><StickyNote className="size-4 text-green" /> Quick notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-3 min-h-28 w-full rounded-xl border border-line bg-cream p-3 text-sm"
                placeholder="Scratch pad — saved on this device…"
              />
              <Button size="sm" variant="outline" className="mt-2" onClick={() => navigator.clipboard?.writeText(notes)}>
                <Copy className="mr-1 size-4" /> Copy notes
              </Button>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-center gap-2 font-semibold"><Volume2 className="size-4 text-green" /> Text to speech</div>
              <p className="mt-2 text-sm text-muted">
                Uses the speech voices available on this device. Select text in any tool, or speak notes and current results.
              </p>
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                onClick={() => {
                  const t =
                    window.getSelection()?.toString() ||
                    notes ||
                    expr ||
                    translationOutput ||
                    englishOutput ||
                    ocrResult ||
                    result;
                  if (t && typeof window !== "undefined" && window.speechSynthesis && typeof window.speechSynthesis.speak === "function") {
                    const u = new SpeechSynthesisUtterance(t);
                    window.speechSynthesis.speak(u);
                  }
                }}
              >
                Speak selected / current text
              </Button>
            </div>
          </div>
        </ToolCard>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-cream p-5">
          <ShieldCheck className="text-green" />
          <h2 className="mt-2 font-display text-lg font-semibold">Safe entitlement model</h2>
          <p className="mt-1 text-sm text-muted">Tools Premium and CPD are separate. A specific CPD programme may grant the particular Tool Premium capability it requires without granting unrelated Tool Premium services.</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-5">
          <Crown className="text-gold" />
          <h2 className="mt-2 font-display text-lg font-semibold">Premium without confusion</h2>
          <p className="mt-1 text-sm text-muted">A Tools Premium subscription does not automatically enrol a learner in CPD. A CPD subscription does not automatically unlock the entire Tool Hub.</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-5">
          <GraduationCap className="text-purple" />
          <h2 className="mt-2 font-display text-lg font-semibold">Learning stays learning</h2>
          <p className="mt-1 text-sm text-muted">CPD lessons, assessments and certificates remain in the CPD learning service. The Tool Hub provides the practical functions needed for direct learning access.</p>
        </div>
      </div>
    </section>
    </>
  );
}

function ToolCard({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="phenom-tools-surface mt-5 rounded-[2rem] border border-line bg-cream p-4 text-ink shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-xl bg-paper p-2">{icon}</div>
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-1 max-w-4xl text-sm text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labels = options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: string[];
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <select className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option, index) => <option key={option} value={option}>{labels[index] || option}</option>)}
      </select>
    </label>
  );
}

function evaluateGraphExpression(expression: string, x: number) {
  const source = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "PI")
    .replace(/\s+/g, "");
  if (!/^[0-9A-Za-z_+*/().,%-]*$/.test(source)) {
    throw new Error("Unsupported graph character.");
  }

  const value = Function(
    "x",
    "sin",
    "cos",
    "tan",
    "sqrt",
    "log",
    "ln",
    "abs",
    "floor",
    "ceil",
    "PI",
    `"use strict"; return (${source})`,
  )(
    x,
    Math.sin,
    Math.cos,
    Math.tan,
    Math.sqrt,
    Math.log10,
    Math.log,
    Math.abs,
    Math.floor,
    Math.ceil,
    Math.PI,
  );

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Non-finite graph value.");
  }
  return value;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
