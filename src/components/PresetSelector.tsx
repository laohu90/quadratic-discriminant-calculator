import React from 'react';
import { Bookmark, Dices, Sparkles } from 'lucide-react';
import { SupportedLang, T } from '../utils/translations';

interface Preset {
  name: Record<SupportedLang, string>;
  desc: string;
  tag: string;
  a: number;
  b: number;
  c: number;
}

const PRESETS: Preset[] = [
  {
    name: {
      en: 'Two Rational Roots',
      es: 'Dos Raíces Racionales',
      fr: 'Deux Racines Rationnelles',
      pt: 'Duas Raízes Racionais',
      zh: '两有理数解 (整洁分解)',
    },
    desc: 'x² - 5x + 6 = 0 (Roots: 2, 3)',
    tag: 'Δ = 1 > 0',
    a: 1,
    b: -5,
    c: 6,
  },
  {
    name: {
      en: 'Double Root / Square',
      es: 'Raíz Doble (Vértice en Eje)',
      fr: 'Racine Double (Carré Parfait)',
      pt: 'Raiz Dupla (Vértice no Eixo)',
      zh: '完全平方式 (单重根)',
    },
    desc: 'x² - 6x + 9 = 0 (x = 3)',
    tag: 'Δ = 0',
    a: 1,
    b: -6,
    c: 9,
  },
  {
    name: {
      en: 'Two Irrational Roots',
      es: 'Dos Raíces Irracionales',
      fr: 'Deux Racines Irrationnelles',
      pt: 'Duas Raízes Irracionais',
      zh: '两无理数解 (二次根式)',
    },
    desc: 'x² - 4x + 1 = 0 (2 ± √3)',
    tag: 'Δ = 12 > 0',
    a: 1,
    b: -4,
    c: 1,
  },
  {
    name: {
      en: 'Complex / No Real Roots',
      es: 'Sin Raíces Reales (Complejas)',
      fr: 'Racines Complexes (i = √-1)',
      pt: 'Sem Raízes Reais (Complexas)',
      zh: '无实数解 (共轭虚数根)',
    },
    desc: 'x² + 2x + 5 = 0 (-1 ± 2i)',
    tag: 'Δ = -16 < 0',
    a: 1,
    b: 2,
    c: 5,
  },
  {
    name: {
      en: 'Leading Coeff a ≠ 1',
      es: 'Coeficiente a ≠ 1 (Difícil)',
      fr: 'Coeff a ≠ 1 (Forme Canonique)',
      pt: 'Coeficiente a ≠ 1 (Bhaskara)',
      zh: '二次项系数 a ≠ 1 (配方法难点)',
    },
    desc: '2x² + 7x + 3 = 0 (Divide by 2)',
    tag: 'Δ = 25 > 0',
    a: 2,
    b: 7,
    c: 3,
  },
  {
    name: {
      en: 'Physics Projectile Motion',
      es: 'Movimiento Parabólico',
      fr: 'Trajectoire Balistique',
      pt: 'Lançamento de Projétil',
      zh: '美高物理抛体运动轨迹',
    },
    desc: '-16t² + 48t + 64 = 0 (Flight time)',
    tag: 'h(t) = -16t² + v₀t',
    a: -16,
    b: 48,
    c: 64,
  },
];

interface PresetSelectorProps {
  lang: SupportedLang;
  currentA: number;
  currentB: number;
  currentC: number;
  onSelect: (a: number, b: number, c: number) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  lang,
  currentA,
  currentB,
  currentC,
  onSelect,
}) => {
  const handleRandomize = () => {
    // Generate clean integer roots or classic cases
    const types = ['clean_real', 'double_root', 'complex', 'scaled'];
    const pick = types[Math.floor(Math.random() * types.length)];
    if (pick === 'clean_real') {
      const r1 = Math.floor(Math.random() * 11) - 5; // -5..5
      let r2 = Math.floor(Math.random() * 11) - 5;
      if (r1 === r2) r2 += 1;
      // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2
      onSelect(1, -(r1 + r2), r1 * r2);
    } else if (pick === 'double_root') {
      const r = Math.floor(Math.random() * 9) - 4; // -4..4
      onSelect(1, -2 * r, r * r);
    } else if (pick === 'complex') {
      const h = Math.floor(Math.random() * 7) - 3;
      const k = Math.floor(Math.random() * 5) + 1; // positive k > 0
      // (x - h)^2 + k = x^2 - 2hx + (h^2 + k)
      onSelect(1, -2 * h, h * h + k);
    } else {
      const aVal = [2, 3, -1, -2][Math.floor(Math.random() * 4)];
      const bVal = Math.floor(Math.random() * 9) - 4;
      const cVal = Math.floor(Math.random() * 11) - 5;
      onSelect(aVal, bVal, cVal);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
          <Bookmark className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'en' ? 'Quick Test Examples (Click to Solve Instantly):' : '高频经典题型（点击即刻求解）：'}</span>
        </div>

        <button
          onClick={handleRandomize}
          title={lang === 'en' ? 'Generate Random Equation Challenge' : '随机生成一个方程'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
        >
          <Dices className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
          <span>{lang === 'en' ? '🎲 Surprise Me (Random)' : '🎲 随机方程'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PRESETS.map((p, idx) => {
          const isSelected = p.a === currentA && p.b === currentB && p.c === currentC;

          return (
            <button
              key={idx}
              onClick={() => onSelect(p.a, p.b, p.c)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer hover:shadow-xs ${
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-600 text-indigo-950 ring-2 ring-indigo-200 shadow-xs scale-101'
                  : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-200 text-slate-800'
              }`}
            >
              <div>
                <div className="font-bold text-xs truncate">
                  {p.name[lang] || p.name.en}
                </div>
                <div className="font-mono text-[11px] text-slate-500 truncate mt-0.5">
                  {p.desc}
                </div>
              </div>
              <span className={`mt-2 inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border self-start ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-indigo-700 border-indigo-200'
              }`}>
                {p.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
