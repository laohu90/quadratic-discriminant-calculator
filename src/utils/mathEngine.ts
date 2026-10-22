/**
 * Math Engine for Quadratic Equation & Discriminant Calculator
 * Precision Fraction, Radical Simplification, Completing the Square Steps,
 * AC Factoring Method, Vieta's Formulas, and Parabola Table of Values.
 */

// Greatest Common Divisor
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export interface Fraction {
  n: number; // numerator
  d: number; // denominator (always > 0)
}

function toIntegerRatio(num: number, den: number): { n: number; d: number } {
  let n = num;
  let d = den;
  let scale = 1;
  // Convert decimals to exact integer ratios up to 6 decimal places
  while ((!Number.isInteger(n) || !Number.isInteger(d)) && scale <= 1000000) {
    n = parseFloat((num * scale).toFixed(6));
    d = parseFloat((den * scale).toFixed(6));
    scale *= 10;
  }
  return { n: Math.round(n), d: Math.round(d) };
}

export function simplifyFraction(n: number, d: number): Fraction {
  if (d === 0) return { n, d: 0 };
  if (n === 0) return { n: 0, d: 1 };
  
  const sign = (n < 0 ? -1 : 1) * (d < 0 ? -1 : 1);
  const ratio = toIntegerRatio(Math.abs(n), Math.abs(d));
  const g = gcd(ratio.n, ratio.d);
  
  return {
    n: sign * (ratio.n / g),
    d: ratio.d / g,
  };
}

export function addFractions(f1: Fraction, f2: Fraction): Fraction {
  return simplifyFraction(f1.n * f2.d + f2.n * f1.d, f1.d * f2.d);
}

export function multiplyFractions(f1: Fraction, f2: Fraction): Fraction {
  return simplifyFraction(f1.n * f2.n, f1.d * f2.d);
}

export function fractionToLatex(f: Fraction): string {
  if (f.d === 1) return `${f.n}`;
  if (f.n < 0) return `-\\frac{${Math.abs(f.n)}}{${f.d}}`;
  return `\\frac{${f.n}}{${f.d}}`;
}

export function fractionToFormatted(f: Fraction): string {
  if (f.d === 1) return `${f.n}`;
  return `${f.n}/${f.d}`;
}

export function parseNumberOrFraction(input: string | number): number | null {
  if (typeof input === 'number') return isNaN(input) ? null : input;
  const str = input.trim();
  if (!str) return null;

  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      const n = parseFloat(parts[0]);
      const d = parseFloat(parts[1]);
      if (!isNaN(n) && !isNaN(d) && d !== 0) {
        return n / d;
      }
    }
  }

  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

export interface RadicalResult {
  outside: number;
  inside: number;
  isImaginary: boolean;
  isPerfectSquare: boolean;
}

export function simplifyRadical(val: number): RadicalResult {
  const isImaginary = val < 0;
  const absVal = Math.abs(Math.round(val));

  if (absVal === 0) {
    return { outside: 0, inside: 1, isImaginary: false, isPerfectSquare: true };
  }

  let outside = 1;
  let inside = absVal;

  for (let i = Math.floor(Math.sqrt(absVal)); i >= 2; i--) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside /= (i * i);
    }
  }

  const isPerfectSquare = inside === 1;

  return {
    outside,
    inside,
    isImaginary,
    isPerfectSquare,
  };
}

export type SupportedLang = 'en' | 'es' | 'fr' | 'pt' | 'zh';

export type MultilingualText = Record<SupportedLang, string>;

function makeMultilingual(en: string, zh: string): MultilingualText {
  return { en, es: en, fr: en, pt: en, zh };
}

export type RootNatureType = 
  | 'two-real-rational'
  | 'two-real-irrational'
  | 'one-real-double'
  | 'two-complex';

export interface TablePoint {
  x: number;
  y: number;
  label?: string; // 'Vertex', 'x-intercept', etc.
}

export interface FactoringBreakdown {
  isFactorable: boolean;
  acProduct: number;
  pair?: [number, number];
  factorLatex?: string;
  stepsEn?: string[];
  stepsZh?: string[];
  steps?: Record<SupportedLang, string[]>;
}

export interface VietasFormulas {
  sumLatex: string;
  sumValue: number;
  sumFrac: Fraction;
  productLatex: string;
  productValue: number;
  productFrac: Fraction;
}

export interface ProjectileMotionModeling {
  isApplicable: boolean; // only when a < 0
  peakTime: number;
  maxHeight: number;
  totalFlightTime: number | null;
  initialHeight: number;
}

export interface QuadraticAnalysis {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  radical: RadicalResult;
  rootNature: RootNatureType;
  rootNatureTitle: MultilingualText;
  rootNatureDesc: MultilingualText;
  // Backward compatibility
  rootNatureTitleEn: string;
  rootNatureTitleZh: string;
  rootNatureDescEn: string;
  rootNatureDescZh: string;
  vertex: { x: number; y: number; xFrac: Fraction; yFrac: Fraction };
  axisOfSymmetry: number;
  yIntercept: { x: 0; y: number };
  xIntercepts: { x1: number | null; x2: number | null; exactLatex1: string; exactLatex2: string };
  vertexFormLatex: string;
  standardFormLatex: string;
  factoring: FactoringBreakdown;
  vietas: VietasFormulas;
  tableOfValues: TablePoint[];
  projectile?: ProjectileMotionModeling;
  quadraticFormulaSteps: Array<{
    title: MultilingualText;
    titleEn: string;
    titleZh: string;
    latex: string;
    explanation: MultilingualText;
    explanationEn: string;
    explanationZh: string;
  }>;
  completingSquareSteps: Array<{
    stepNumber: number;
    title: MultilingualText;
    titleEn: string;
    titleZh: string;
    latex: string;
    explanation: MultilingualText;
    explanationEn: string;
    explanationZh: string;
    highlight?: string;
  }>;
}

export function formatTerm(coeff: number, power: number, isLeading = false): string {
  if (coeff === 0) return '';
  const sign = coeff < 0 ? '-' : isLeading ? '' : '+';
  const abs = Math.abs(coeff);
  let coeffStr = `${abs}`;
  if (power > 0 && abs === 1) {
    coeffStr = '';
  }

  if (power === 2) {
    return `${sign} ${coeffStr}x^2`.trim();
  } else if (power === 1) {
    return `${sign} ${coeffStr}x`.trim();
  } else {
    return `${sign} ${abs}`.trim();
  }
}

export function buildStandardFormLatex(a: number, b: number, c: number): string {
  const parts: string[] = [];
  parts.push(formatTerm(a, 2, true));
  if (b !== 0) parts.push(formatTerm(b, 1, false));
  if (c !== 0) parts.push(formatTerm(c, 0, false));
  if (parts.length === 0) parts.push('0');
  return parts.join(' ') + ' = 0';
}

export function computeFactoring(a: number, b: number, c: number, delta: number, radical: RadicalResult): FactoringBreakdown {
  if (delta < 0 || !radical.isPerfectSquare) {
    return {
      isFactorable: false,
      acProduct: a * c,
    };
  }

  // Integer factoring (AC method)
  const ac = a * c;
  let p1: number | null = null;
  let p2: number | null = null;

  // Search for two numbers that multiply to a*c and sum to b
  const absAc = Math.abs(ac);
  for (let f = 1; f <= absAc; f++) {
    if (absAc % f === 0) {
      const pairs: Array<[number, number]> = [
        [f, ac / f],
        [-f, -(ac / f)],
      ];
      for (const [x, y] of pairs) {
        if (x + y === b) {
          p1 = x;
          p2 = y;
          break;
        }
      }
      if (p1 !== null) break;
    }
  }

  // Special case: c = 0
  if (c === 0) {
    // ax^2 + bx = x(ax + b)
    const factorLatex = a === 1 ? `x(x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}) = 0` : `x(${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}) = 0`;
    return {
      isFactorable: true,
      acProduct: 0,
      factorLatex,
      stepsEn: [
        'Greatest Common Factor: Factor out x: x(' + (a === 1 ? 'x' : `${a}x`) + (b >= 0 ? ` + ${b}` : ` - ${Math.abs(b)}`) + ') = 0',
        'Zero Product Property: Set each factor equal to zero: x = 0 or ' + (a === 1 ? 'x' : `${a}x`) + (b >= 0 ? ` + ${b}` : ` - ${Math.abs(b)}`) + ' = 0',
      ],
      stepsZh: [
        '提取公因式：方程两项皆含 x，提取公因式得到：x(' + (a === 1 ? 'x' : `${a}x`) + (b >= 0 ? ` + ${b}` : ` - ${Math.abs(b)}`) + ') = 0',
        '零乘积性质：令各因式分别等于 0，得到两根。',
      ],
    };
  }

  if (p1 !== null && p2 !== null) {
    // Factor by grouping: ax^2 + p1*x + p2*x + c = 0
    // Group 1: ax^2 + p1*x -> g1*x (d1*x + e1)
    const g1 = gcd(Math.abs(a), Math.abs(p1));
    const factorA = a / g1;
    const factorP1 = p1 / g1;

    // Group 2: p2*x + c -> g2 (factorA*x + factorP1)
    const g2 = p2 / factorA;

    const term1 = `${g1 === 1 ? '' : g1}x ${g2 >= 0 ? `+ ${g2}` : `- ${Math.abs(g2)}`}`;
    const term2 = `${factorA === 1 ? '' : factorA}x ${factorP1 >= 0 ? `+ ${factorP1}` : `- ${Math.abs(factorP1)}`}`;
    const factorLatex = `(${term1})(${term2}) = 0`;

    return {
      isFactorable: true,
      acProduct: ac,
      pair: [p1, p2],
      factorLatex,
      stepsEn: [
        `AC Method: Multiply a · c = (${a}) · (${c}) = ${ac}.`,
        `Find two factors that multiply to ${ac} and add to b = ${b}: Found ${p1} and ${p2} (since ${p1} · ${p2} = ${ac} and ${p1} + ${p2} = ${b}).`,
        `Split the middle term: ${formatTerm(a, 2, true)} + (${p1}x) + (${p2}x) + (${c}) = 0.`,
        `Factor by grouping: (${term1})(${term2}) = 0.`,
        `Zero Product Property: Set each factor to 0 to find the solutions.`,
      ],
      stepsZh: [
        `十字相乘/AC法：计算首尾项乘积 a · c = (${a}) · (${c}) = ${ac}。`,
        `寻找两个数，使其乘积为 ${ac} 且和为一次项系数 b = ${b}：得到 ${p1} 与 ${p2}。`,
        `拆分中间项：${formatTerm(a, 2, true)} + (${p1}x) + (${p2}x) + (${c}) = 0。`,
        `分组分解法提取公因式，得到：(${term1})(${term2}) = 0。`,
        `应用零乘积性质，令各括号内一次式为 0 即可直接得解。`,
      ],
    };
  }

  return {
    isFactorable: true,
    acProduct: ac,
  };
}

export function analyzeQuadratic(a: number, b: number, c: number): QuadraticAnalysis {
  if (a === 0) {
    throw new Error('Coefficient "a" cannot be 0 in a quadratic equation.');
  }

  const delta = b * b - 4 * a * c;
  const radical = simplifyRadical(delta);

  let rootNature: RootNatureType;
  let rootNatureTitle: MultilingualText;
  let rootNatureDesc: MultilingualText;

  if (delta > 0) {
    if (radical.isPerfectSquare) {
      rootNature = 'two-real-rational';
      rootNatureTitle = {
        en: 'Two Distinct Rational Real Roots',
        es: 'Dos Raíces Reales Racionales Distintas',
        fr: 'Deux Racines Réelles Rationnelles Distinctes',
        pt: 'Duas Raízes Reais Racionais Distintas',
        zh: '两个不相等的有理数实根',
      };
      rootNatureDesc = {
        en: `Δ = ${delta} > 0 and is a perfect square (${radical.outside}²). The parabola crosses the x-axis at two clean rational points. The trinomial is factorable over integers/rationals.`,
        es: `Δ = ${delta} > 0 y es un cuadrado perfecto (${radical.outside}²). La parábola cruza el eje x en dos puntos racionales limpios. El trinomio es factorizable.`,
        fr: `Δ = ${delta} > 0 et est un carré parfait (${radical.outside}²). La parabole coupe l’axe des x en deux points rationnels nets. Le trinôme est factorisable.`,
        pt: `Δ = ${delta} > 0 e é um quadrado perfeito (${radical.outside}²). A parábola cruza o eixo x em dois pontos racionais. O trinômio pode ser fatorado.`,
        zh: `判别式 Δ = ${delta} > 0 且为完全平方数 (${radical.outside}²)。抛物线与 x 轴有两个不同有理交点，原方程可因式分解。`,
      };
    } else {
      rootNature = 'two-real-irrational';
      rootNatureTitle = {
        en: 'Two Distinct Irrational Real Roots',
        es: 'Dos Raíces Reales Irracionales Distintas',
        fr: 'Deux Racines Réelles Irrationnelles Distinctes',
        pt: 'Duas Raízes Reais Irracionais Distintas',
        zh: '两个不相等的无理数实根',
      };
      rootNatureDesc = {
        en: `Δ = ${delta} > 0 but not a perfect square. The parabola crosses the x-axis twice, but solutions involve radicals (square roots).`,
        es: `Δ = ${delta} > 0 pero no es cuadrado perfecto. La parábola cruza el eje x dos veces, pero las raíces contienen radicales.`,
        fr: `Δ = ${delta} > 0 mais pas un carré parfait. La parabole coupe l’axe des x deux fois, les solutions contiennent des radicaux.`,
        pt: `Δ = ${delta} > 0 mas não é quadrado perfeito. A parábola cruza o eixo x duas vezes, mas as raízes contêm radicais.`,
        zh: `判别式 Δ = ${delta} > 0 但不是完全平方数。抛物线与 x 轴有两个交点，根含有不可化简的二次根号。`,
      };
    }
  } else if (delta === 0) {
    rootNature = 'one-real-double';
    rootNatureTitle = {
      en: 'One Repeated Real Root (Double Root)',
      es: 'Una Raíz Real Doble (Solución Única)',
      fr: 'Une Racine Réelle Double (Solution Unique)',
      pt: 'Uma Raiz Real Dupla (Solução Única)',
      zh: '两个相等的实根（重根 / 唯一解）',
    };
    rootNatureDesc = {
      en: `Δ = 0. The parabola vertex touches the x-axis tangentially at exactly one point. The equation is a perfect square trinomial.`,
      es: `Δ = 0. El vértice de la parábola toca tangencialmente el eje x en exactamente un punto. Es un trinomio cuadrado perfecto.`,
      fr: `Δ = 0. Le sommet de la parabole est tangent à l’axe des x en un point unique. C’est un trinôme carré parfait.`,
      pt: `Δ = 0. O vértice da parábola tangencia o eixo x em exatamente um ponto. É um trinômio quadrado perfeito.`,
      zh: `判别式 Δ = 0。抛物线顶点恰好与 x 轴相切于一点，原方程为完全平方式。`,
    };
  } else {
    rootNature = 'two-complex';
    rootNatureTitle = {
      en: 'Two Complex Conjugate Roots (No Real Solutions)',
      es: 'Dos Raíces Complejas Conjugadas (Sin Soluciones Reales)',
      fr: 'Deux Racines Complexes Conjuguées (Pas de Solution Réelle)',
      pt: 'Duas Raízes Complexas Conjugadas (Sem Soluções Reais)',
      zh: '无实数解（两个共轭复数根）',
    };
    rootNatureDesc = {
      en: `Δ = ${delta} < 0. No real roots. Has two complex conjugate solutions with imaginary unit i = √(-1). The parabola floats without touching the x-axis.`,
      es: `Δ = ${delta} < 0. No hay soluciones reales. Tiene dos raíces complejas conjugadas con unidad imaginaria i = √(-1). La parábola flota sin tocar el eje x.`,
      fr: `Δ = ${delta} < 0. Aucune solution réelle. Comporte deux racines complexes conjuguées avec l’unité imaginaire i = √(-1). La parabole ne coupe pas l’axe des x.`,
      pt: `Δ = ${delta} < 0. Sem raízes reais. Possui duas raízes complexas conjugadas com unidade imaginária i = √(-1). A parábola flutua sem tocar o eixo x.`,
      zh: `判别式 Δ = ${delta} < 0。在实数范围内无解；在复数范围内有一对共轭复数解 (含虚数单位 i)。抛物线悬浮与 x 轴无交点。`,
    };
  }

  // Vertex
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);
  const hFrac = simplifyFraction(-b, 2 * a);
  const kFrac = simplifyFraction(4 * a * c - b * b, 4 * a);

  // Exact roots Latex & values
  let x1Val: number | null = null;
  let x2Val: number | null = null;
  let exactLatex1 = '';
  let exactLatex2 = '';

  const denom = 2 * a;

  if (delta >= 0) {
    if (radical.isPerfectSquare) {
      const r1 = simplifyFraction(-b + radical.outside, denom);
      const r2 = simplifyFraction(-b - radical.outside, denom);
      x1Val = r1.n / r1.d;
      x2Val = r2.n / r2.d;
      exactLatex1 = fractionToLatex(r1);
      exactLatex2 = fractionToLatex(r2);
    } else {
      x1Val = (-b + Math.sqrt(delta)) / denom;
      x2Val = (-b - Math.sqrt(delta)) / denom;
      
      const g = gcd(gcd(Math.abs(b), radical.outside), Math.abs(denom));
      const sB = -b / g;
      const sOut = radical.outside / g;
      const sDenom = denom / g;
      const denomAbs = Math.abs(sDenom);
      const sign = sDenom < 0 ? -1 : 1;

      const outPart = sOut === 1 ? `\\sqrt{${radical.inside}}` : `${sOut}\\sqrt{${radical.inside}}`;
      if (denomAbs === 1) {
        exactLatex1 = `${sign * sB} + ${outPart}`;
        exactLatex2 = `${sign * sB} - ${outPart}`;
      } else {
        exactLatex1 = `\\frac{${sign * sB} + ${outPart}}{${denomAbs}}`;
        exactLatex2 = `\\frac{${sign * sB} - ${outPart}}{${denomAbs}}`;
      }
    }
  } else {
    // Complex roots
    const g = gcd(gcd(Math.abs(b), radical.outside), Math.abs(denom));
    const sB = -b / g;
    const sOut = radical.outside / g;
    const sDenom = denom / g;
    const denomAbs = Math.abs(sDenom);
    const sign = sDenom < 0 ? -1 : 1;

    const outPart = radical.inside === 1 
      ? (sOut === 1 ? 'i' : `${sOut}i`) 
      : (sOut === 1 ? `i\\sqrt{${radical.inside}}` : `${sOut}i\\sqrt{${radical.inside}}`);
    
    if (denomAbs === 1) {
      exactLatex1 = `${sign * sB} + ${outPart}`;
      exactLatex2 = `${sign * sB} - ${outPart}`;
    } else {
      exactLatex1 = `\\frac{${sign * sB} + ${outPart}}{${denomAbs}}`;
      exactLatex2 = `\\frac{${sign * sB} - ${outPart}}{${denomAbs}}`;
    }
  }

  // Vertex form: y = a(x - h)^2 + k
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${a}`;
  let vertexFormLatex = '';
  if (hFrac.n === 0) {
    const kTerm = kFrac.n === 0 ? '' : kFrac.n > 0 ? `+ ${fractionToLatex(kFrac)}` : `- ${fractionToLatex({ n: Math.abs(kFrac.n), d: kFrac.d })}`;
    vertexFormLatex = `y = ${aPrefix}x^2 ${kTerm}`.trim();
  } else {
    const hSign = hFrac.n < 0 ? `+ ${fractionToLatex({ n: Math.abs(hFrac.n), d: hFrac.d })}` : `- ${fractionToLatex(hFrac)}`;
    const kTerm = kFrac.n === 0 ? '' : kFrac.n > 0 ? `+ ${fractionToLatex(kFrac)}` : `- ${fractionToLatex({ n: Math.abs(kFrac.n), d: kFrac.d })}`;
    vertexFormLatex = `y = ${aPrefix}\\left(x ${hSign}\\right)^2 ${kTerm}`.trim();
  }

  const standardFormLatex = buildStandardFormLatex(a, b, c);

  // Vieta's formulas
  const sumFrac = simplifyFraction(-b, a);
  const prodFrac = simplifyFraction(c, a);
  const vietas: VietasFormulas = {
    sumLatex: fractionToLatex(sumFrac),
    sumValue: -b / a,
    sumFrac,
    productLatex: fractionToLatex(prodFrac),
    productValue: c / a,
    productFrac: prodFrac,
  };

  // Table of values (7 points centered around vertex x = h)
  const tableOfValues: TablePoint[] = [];
  const baseH = Math.round(h * 2) / 2; // snap to half integers
  const steps = [-3, -2, -1, 0, 1, 2, 3];
  for (const s of steps) {
    const curX = baseH + s;
    const curY = a * curX * curX + b * curX + c;
    let label: string | undefined;
    if (Math.abs(curX - h) < 0.001) label = 'Vertex';
    else if (Math.abs(curY) < 0.001) label = 'Root (x-int)';
    else if (Math.abs(curX) < 0.001) label = 'y-int';

    tableOfValues.push({
      x: curX,
      y: parseFloat(curY.toFixed(4)),
      label,
    });
  }

  // Factoring Method breakdown
  const factoring = computeFactoring(a, b, c, delta, radical);

  // Real world projectile modeling (if a < 0)
  let projectile: ProjectileMotionModeling | undefined;
  if (a < 0) {
    // flight time: positive root
    let totalFlightTime: number | null = null;
    if (x1Val !== null && x2Val !== null) {
      const posRoots = [x1Val, x2Val].filter((r) => r >= 0);
      if (posRoots.length > 0) totalFlightTime = Math.max(...posRoots);
    }
    projectile = {
      isApplicable: true,
      peakTime: Math.max(0, h),
      maxHeight: k,
      totalFlightTime,
      initialHeight: c,
    };
  }

  // Steps for Quadratic Formula with 5 languages
  const quadraticFormulaSteps = [
    {
      title: {
        en: '1. Identify Coefficients',
        es: '1. Identificar Coeficientes',
        fr: '1. Identifier les Coefficients',
        pt: '1. Identificar os Coeficientes',
        zh: '1. 提取各项系数',
      },
      titleEn: '1. Identify Coefficients',
      titleZh: '1. 提取各项系数',
      latex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
      explanation: {
        en: 'Compare with the standard form ax² + bx + c = 0.',
        es: 'Comparar con la forma estándar ax² + bx + c = 0.',
        fr: 'Comparer avec la forme standard ax² + bx + c = 0.',
        pt: 'Comparar com a forma padrão ax² + bx + c = 0.',
        zh: '对比一元二次方程标准形式 ax² + bx + c = 0，提取各项系数。',
      },
      explanationEn: 'Compare with the standard form ax² + bx + c = 0.',
      explanationZh: '对比一元二次方程标准形式 ax² + bx + c = 0，提取各项系数。',
    },
    {
      title: {
        en: '2. Compute Discriminant (Δ)',
        es: '2. Calcular el Discriminante (Δ)',
        fr: '2. Calculer le Discriminant (Δ)',
        pt: '2. Calcular o Discriminante Delta (Δ)',
        zh: '2. 计算判别式 (Δ / Delta)',
      },
      titleEn: '2. Compute Discriminant (Δ)',
      titleZh: '2. 计算判别式 (Δ / Delta)',
      latex: `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${b * b} - (${4 * a * c}) = ${delta}`,
      explanation: rootNatureDesc,
      explanationEn: rootNatureDesc.en,
      explanationZh: rootNatureDesc.zh,
    },
    {
      title: {
        en: '3. Substitute into Quadratic Formula',
        es: '3. Sustituir en la Fórmula General',
        fr: '3. Remplacer dans la Formule Quadratique',
        pt: '3. Substituir na Fórmula de Bhaskara',
        zh: '3. 代入求根公式',
      },
      titleEn: '3. Substitute into Quadratic Formula',
      titleZh: '3. 代入求根公式',
      latex: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${b}) \\pm \\sqrt{${delta}}}{2(${a})}`,
      explanation: {
        en: 'Apply universal formula x = (-b ± √Δ) / (2a).',
        es: 'Aplicar la fórmula general x = (-b ± √Δ) / (2a).',
        fr: 'Appliquer la formule quadratique x = (-b ± √Δ) / (2a).',
        pt: 'Aplicar a Fórmula de Bhaskara x = (-b ± √Δ) / (2a).',
        zh: '代入二次方程万能求根公式 x = (-b ± √Δ) / (2a)。',
      },
      explanationEn: 'Apply the universal quadratic formula x = (-b ± √Δ) / (2a).',
      explanationZh: '代入二次方程万能求根公式 x = (-b ± √Δ) / (2a)。',
    },
    {
      title: {
        en: '4. Simplify Radicals & Fractions',
        es: '4. Simplificar Radicales y Fracciones',
        fr: '4. Simplifier les Radicaux et Fractions',
        pt: '4. Simplificar Radicais e Frações',
        zh: '4. 化简根号与分式',
      },
      titleEn: '4. Simplify Radicals & Fractions',
      titleZh: '4. 化简根号与分式',
      latex: delta >= 0 
        ? (delta === 0 
            ? `x = \\frac{${-b}}{${denom}} = ${exactLatex1}`
            : `x = ${exactLatex1} \\quad \\text{or} \\quad x = ${exactLatex2}`)
        : `x = ${exactLatex1} \\quad \\text{or} \\quad x = ${exactLatex2}`,
      explanation: {
        en: delta >= 0
          ? `Simplify radical: √${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}. Reduce fractions.`
          : `Extract imaginary unit i: √(${delta}) = i√${Math.abs(delta)}. Yields complex conjugate pair.`,
        es: delta >= 0
          ? `Simplificar radical: √${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}. Reducir fracciones.`
          : `Extraer la unidad imaginaria i: √(${delta}) = i√${Math.abs(delta)}. Da un par conjugado complejo.`,
        fr: delta >= 0
          ? `Simplifier le radical : √${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}. Réduire les fractions.`
          : `Extraire l'unité imaginaire i : √(${delta}) = i√${Math.abs(delta)}. Donne deux solutions complexes conjuguées.`,
        pt: delta >= 0
          ? `Simplificar radical: √${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}. Reduzir frações.`
          : `Extrair unidade imaginária i: √(${delta}) = i√${Math.abs(delta)}. Resulta em par complexo conjugado.`,
        zh: delta >= 0
          ? `化简二次根式：√${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}，约分至最简。`
          : `提出虚数单位 i：√(${delta}) = i√${Math.abs(delta)}，并约分得到一对共轭复数解。`,
      },
      explanationEn: delta >= 0
        ? `Simplify the radical: √${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}. Reduce fractions to lowest terms.`
        : `Since Δ < 0, extract imaginary unit i: √(${delta}) = i√${Math.abs(delta)} = ${radical.outside > 1 ? radical.outside : ''}i${radical.inside > 1 ? `√${radical.inside}` : ''}.`,
      explanationZh: delta >= 0
        ? `化简二次根式：√${delta} ${radical.isPerfectSquare ? `= ${radical.outside}` : `= ${radical.outside > 1 ? radical.outside : ''}√${radical.inside}`}，约分至最简。`
        : `由于 Δ < 0，提出虚数单位 i：√(${delta}) = i√${Math.abs(delta)}，并约分得到一对共轭复数解。`,
    },
  ];

  // Completing the Square Steps
  const completingSquareSteps: QuadraticAnalysis['completingSquareSteps'] = [];

  // Step 1
  completingSquareSteps.push({
    stepNumber: 1,
    title: makeMultilingual('Start with the Standard Form', '第一步：整理为标准形式'),
    titleEn: 'Start with the Standard Form',
    titleZh: '第一步：整理为标准形式',
    latex: buildStandardFormLatex(a, b, c),
    explanation: makeMultilingual('Ensure the equation is in standard form ax² + bx + c = 0.', '确认方程已化为 ax² + bx + c = 0 的标准形式。'),
    explanationEn: 'Ensure the equation is in standard form ax² + bx + c = 0.',
    explanationZh: '确认方程已化为 ax² + bx + c = 0 的标准形式。',
  });

  // Step 2
  const lhsStep2 = [formatTerm(a, 2, true), formatTerm(b, 1, false)].filter(Boolean).join(' ');
  const rhsStep2 = `${-c}`;
  completingSquareSteps.push({
    stepNumber: 2,
    title: makeMultilingual('Isolate Variable Terms (Move Constant to Right Side)', '第二步：移项（常数项移到等号右边）'),
    titleEn: 'Isolate Variable Terms (Move Constant to Right Side)',
    titleZh: '第二步：移项（常数项移到等号右边）',
    latex: `${lhsStep2} = ${rhsStep2}`,
    explanation: makeMultilingual(`Subtract ${c >= 0 ? c : `(${c})`} from both sides of the equation so only variable terms remain on the left.`, `两边同时减去常数项 ${c}，使含有未知数的项保留在等号左侧。`),
    explanationEn: `Subtract ${c >= 0 ? c : `(${c})`} from both sides of the equation so only variable terms remain on the left.`,
    explanationZh: `两边同时减去常数项 ${c}，使含有未知数的项保留在等号左侧。`,
  });

  // Step 3
  const bOverA = simplifyFraction(b, a);
  const negCOverA = simplifyFraction(-c, a);

  let currentLhs = '';
  let currentRhsLatex = '';

  if (a !== 1) {
    const bOverAText = bOverA.n >= 0 ? `+ ${fractionToLatex(bOverA)}x` : `- ${fractionToLatex({ n: Math.abs(bOverA.n), d: bOverA.d })}x`;
    currentLhs = `x^2 ${bOverAText}`;
    currentRhsLatex = fractionToLatex(negCOverA);

    completingSquareSteps.push({
      stepNumber: 3,
      title: makeMultilingual(`Make the Leading Coefficient 1 (Divide by a = ${a})`, `第三步：二次项系数化为 1（两边除以 a = ${a}）`),
      titleEn: `Make the Leading Coefficient 1 (Divide by a = ${a})`,
      titleZh: `第三步：二次项系数化为 1（两边除以 a = ${a}）`,
      latex: `${currentLhs} = ${currentRhsLatex}`,
      explanation: makeMultilingual(`To apply completing the square, the coefficient of x² must be 1. Divide all terms on both sides by ${a}.`, `配方法的核心前提是二次项系数为 1。因此等式两边各项同时除以 ${a}。`),
      explanationEn: `To apply completing the square, the coefficient of x² must be 1. Divide all terms on both sides by ${a}.`,
      explanationZh: `配方法的核心前提是二次项系数为 1。因此等式两边各项同时除以 ${a}。`,
    });
  } else {
    const bText = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
    currentLhs = `x^2 ${bText}`;
    currentRhsLatex = `${-c}`;
  }

  // Step 4
  const halfCoeff = simplifyFraction(b, 2 * a);
  const magicTerm = simplifyFraction(b * b, 4 * a * a);
  const halfCoeffLatex = fractionToLatex(halfCoeff);
  const magicTermLatex = fractionToLatex(magicTerm);

  completingSquareSteps.push({
    stepNumber: 4,
    title: makeMultilingual('Calculate the Completing Term: (b / 2a)²', '第四步：计算配方常数项 [(一次项系数 / 2)²]'),
    titleEn: 'Calculate the Completing Term: (b / 2a)²',
    titleZh: '第四步：计算配方常数项 [(一次项系数 / 2)²]',
    latex: `\\left(\\frac{1}{2} \\cdot \\frac{b}{a}\\right)^2 = \\left(${halfCoeffLatex}\\right)^2 = ${magicTermLatex}`,
    explanation: makeMultilingual(`Take half of the coefficient of x, which is ${halfCoeffLatex}, and square it to get ${magicTermLatex}. This is the exact number that forms a perfect square trinomial!`, `取一次项系数的一半得到 ${halfCoeffLatex}，将其平方得到 ${magicTermLatex}。这就是使左边构成完全平方式的“配方常数”！`),
    explanationEn: `Take half of the coefficient of x, which is ${halfCoeffLatex}, and square it to get ${magicTermLatex}. This is the exact number that forms a perfect square trinomial!`,
    explanationZh: `取一次项系数的一半得到 ${halfCoeffLatex}，将其平方得到 ${magicTermLatex}。这就是使左边构成完全平方式的“配方常数”！`,
    highlight: `Magic term = ${magicTermLatex}`,
  });

  // Step 5
  const rhsSum = addFractions(negCOverA, magicTerm);
  const rhsSumLatex = fractionToLatex(rhsSum);

  completingSquareSteps.push({
    stepNumber: 5,
    title: makeMultilingual('Add the Completing Term to BOTH Sides', '第五步：等式两边同时加上配方常数'),
    titleEn: 'Add the Completing Term to BOTH Sides',
    titleZh: '第五步：等式两边同时加上配方常数',
    latex: `${currentLhs} + \\mathbf{${magicTermLatex}} = ${currentRhsLatex} + \\mathbf{${magicTermLatex}} = ${rhsSumLatex}`,
    explanation: makeMultilingual('By adding to both sides, the equation remains strictly equivalent. Notice the right-hand numerator is exactly the discriminant Δ!', '根据等式性质，两边同时加上配方项保持等式平衡。注意右边通分后的分子正是判别式 Δ = b² - 4ac！'),
    explanationEn: 'By adding to both sides, the equation remains strictly equivalent. Notice the right-hand numerator is exactly the discriminant Δ!',
    explanationZh: '根据等式性质，两边同时加上配方项保持等式平衡。注意右边通分后的分子正是判别式 Δ = b² - 4ac！',
  });

  // Step 6
  const factorSign = halfCoeff.n >= 0 ? `+ ${fractionToLatex(halfCoeff)}` : `- ${fractionToLatex({ n: Math.abs(halfCoeff.n), d: Math.abs(halfCoeff.d) })}`;

  completingSquareSteps.push({
    stepNumber: 6,
    title: makeMultilingual('Write the Left Side as a Binomial Square', '第六步：左侧因式分解为完全平方式'),
    titleEn: 'Write the Left Side as a Binomial Square',
    titleZh: '第六步：左侧因式分解为完全平方式',
    latex: `\\left(x ${factorSign}\\right)^2 = ${rhsSumLatex}`,
    explanation: makeMultilingual(`The left-hand side trinomial factors into (x + (${halfCoeffLatex}))² using the identity (u + v)² = u² + 2uv + v².`, `根据完全平方公式 (u + v)² = u² + 2uv + v²，左侧三项式化简为二项式平方 (x ${factorSign})²。`),
    explanationEn: `The left-hand side trinomial factors into (x + (${halfCoeffLatex}))² using the identity (u + v)² = u² + 2uv + v².`,
    explanationZh: `根据完全平方公式 (u + v)² = u² + 2uv + v²，左侧三项式化简为二项式平方 (x ${factorSign})²。`,
  });

  // Step 7
  let sqrtRhsLatex = '';
  if (delta > 0) {
    if (radical.isPerfectSquare) {
      const simplifiedRoot = simplifyFraction(radical.outside, 2 * Math.abs(a));
      sqrtRhsLatex = `\\pm ${fractionToLatex(simplifiedRoot)}`;
    } else {
      sqrtRhsLatex = `\\pm \\frac{\\sqrt{${delta}}}{${2 * Math.abs(a)}}`;
    }
  } else if (delta === 0) {
    sqrtRhsLatex = '0';
  } else {
    sqrtRhsLatex = `\\pm \\frac{i\\sqrt{${Math.abs(delta)}}}{${2 * Math.abs(a)}}`;
  }

  completingSquareSteps.push({
    stepNumber: 7,
    title: makeMultilingual('Apply the Square Root Property (Take ±√)', '第七步：两边开平方（运用平方根性质）'),
    titleEn: 'Apply the Square Root Property (Take ±√)',
    titleZh: '第七步：两边开平方（运用平方根性质）',
    latex: `x ${factorSign} = ${sqrtRhsLatex}`,
    explanation: makeMultilingual(delta >= 0 ? 'Take the square root of both sides. Remember the ± (plus or minus) symbol gives both branches!' : 'Since the right side is negative, the square root involves the imaginary number i = √(-1).', delta >= 0 ? '两边同时开平方根，注意必须加上“±”正负号以包含两个方向的根。' : '因为右边为负数，开平方需引入虚数单位 i = √(-1)。'),
    explanationEn: delta >= 0
      ? 'Take the square root of both sides. Remember the ± (plus or minus) symbol gives both branches!'
      : 'Since the right side is negative, the square root involves the imaginary number i = √(-1).',
    explanationZh: delta >= 0
      ? '两边同时开平方根，注意必须加上“±”正负号以包含两个方向的根。'
      : '因为右边为负数，开平方需引入虚数单位 i = √(-1)。',
  });

  // Step 8
  completingSquareSteps.push({
    stepNumber: 8,
    title: makeMultilingual('Isolate x for the Final Solution(s)', '第八步：解出 x（得到最终根）'),
    titleEn: 'Isolate x for the Final Solution(s)',
    titleZh: '第八步：解出 x（得到最终根）',
    latex: delta === 0
      ? `x = ${exactLatex1}`
      : `x_1 = ${exactLatex1}, \\quad x_2 = ${exactLatex2}`,
    explanation: makeMultilingual(`Subtract ${halfCoeffLatex} from both sides to get the final exact roots.`, `两边移项整理出 x 的值。精确根为上述公式，对应近似小数解如上所示。`),
    explanationEn: `Subtract ${halfCoeffLatex} from both sides to get the final exact roots.`,
    explanationZh: `两边移项整理出 x 的值。精确根为上述公式，对应近似小数解如上所示。`,
  });

  return {
    a,
    b,
    c,
    discriminant: delta,
    radical,
    rootNature,
    rootNatureTitle,
    rootNatureDesc,
    rootNatureTitleEn: rootNatureTitle.en,
    rootNatureTitleZh: rootNatureTitle.zh,
    rootNatureDescEn: rootNatureDesc.en,
    rootNatureDescZh: rootNatureDesc.zh,
    vertex: { x: h, y: k, xFrac: hFrac, yFrac: kFrac },
    axisOfSymmetry: h,
    yIntercept: { x: 0, y: c },
    xIntercepts: { x1: x1Val, x2: x2Val, exactLatex1, exactLatex2 },
    vertexFormLatex,
    standardFormLatex,
    factoring,
    vietas,
    tableOfValues,
    projectile,
    quadraticFormulaSteps,
    completingSquareSteps,
  };
}

/**
 * Natural language / equation string parser
 */
export function parseEquationString(input: string): { a: number; b: number; c: number } | null {
  if (!input || !input.trim()) return null;

  let clean = input.toLowerCase().replace(/\s+/g, '');

  let lhs = clean;
  let rhs = '0';

  if (clean.includes('=')) {
    const parts = clean.split('=');
    if (parts.length === 2) {
      lhs = parts[0];
      rhs = parts[1];
    }
  }

  function extractPolynomial(polyStr: string): { a: number; b: number; c: number } {
    let a = 0;
    let b = 0;
    let c = 0;

    const str = polyStr.replace(/x²/g, 'x^2').replace(/t²/g, 't^2').replace(/t/g, 'x');
    const re = /([+-]?[^+-]+)/g;
    const matches = str.match(re) || [];

    for (const term of matches) {
      if (term.includes('x^2')) {
        const coeffStr = term.replace('x^2', '');
        if (coeffStr === '' || coeffStr === '+') a += 1;
        else if (coeffStr === '-') a -= 1;
        else {
          const num = parseNumberOrFraction(coeffStr);
          if (num !== null) a += num;
        }
      } else if (term.includes('x')) {
        const coeffStr = term.replace('x', '');
        if (coeffStr === '' || coeffStr === '+') b += 1;
        else if (coeffStr === '-') b -= 1;
        else {
          const num = parseNumberOrFraction(coeffStr);
          if (num !== null) b += num;
        }
      } else {
        const num = parseNumberOrFraction(term);
        if (num !== null) c += num;
      }
    }

    return { a, b, c };
  }

  try {
    const leftTerms = extractPolynomial(lhs);
    const rightTerms = extractPolynomial(rhs);

    const a = leftTerms.a - rightTerms.a;
    const b = leftTerms.b - rightTerms.b;
    const c = leftTerms.c - rightTerms.c;

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      return null;
    }

    return { a, b, c };
  } catch {
    return null;
  }
}
