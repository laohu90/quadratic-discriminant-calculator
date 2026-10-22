import React from 'react';
import { Bookmark } from 'lucide-react';
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
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-3.5">
        <Bookmark className="w-4 h-4 text-indigo-600" />
        <span>{T.presetsTitle[lang]}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRESETS.map((p, idx) => {
          const isSelected = p.a === currentA && p.b === currentB && p.c === currentC;

          return (
            <button
              key={idx}
              onClick={() => onSelect(p.a, p.b, p.c)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 ring-2 ring-indigo-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
              }`}
            >
              <div>
                <div className="font-bold text-xs sm:text-sm truncate">
                  {p.name[lang] || p.name.en}
                </div>
                <div className="font-mono text-[11px] text-slate-500 truncate mt-1">
                  {p.desc}
                </div>
              </div>
              <span className={`mt-2.5 inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded border self-start ${
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
