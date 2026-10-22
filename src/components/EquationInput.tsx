import React, { useState } from 'react';
import { Sliders, Type, AlertCircle, Plus, Minus, RotateCcw } from 'lucide-react';
import { parseEquationString, buildStandardFormLatex } from '../utils/mathEngine';
import { SupportedLang, T } from '../utils/translations';
import { MathView } from './MathView';

interface EquationInputProps {
  a: number;
  b: number;
  c: number;
  onChange: (a: number, b: number, c: number) => void;
  lang: SupportedLang;
}

export const EquationInput: React.FC<EquationInputProps> = ({
  a,
  b,
  c,
  onChange,
  lang,
}) => {
  const [inputMode, setInputMode] = useState<'coefficients' | 'natural'>('coefficients');
  const [naturalText, setNaturalText] = useState('x^2 - 5x + 6 = 0');
  const [naturalError, setNaturalError] = useState<string | null>(null);

  const [strA, setStrA] = useState(a.toString());
  const [strB, setStrB] = useState(b.toString());
  const [strC, setStrC] = useState(c.toString());

  React.useEffect(() => {
    setStrA(a.toString());
    setStrB(b.toString());
    setStrC(c.toString());
  }, [a, b, c]);

  const handleNaturalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseEquationString(naturalText);
    if (!parsed) {
      setNaturalError(
        lang === 'zh'
          ? '未能解析方程，请使用如 2x^2 - 5x + 3 = 0 或 x^2 = 16 的格式'
          : lang === 'es'
          ? 'No se pudo interpretar. Usa formato como: 2x^2 - 5x + 3 = 0 o x^2 = 16'
          : lang === 'fr'
          ? 'Impossible d’interpréter l’équation. Format attendu : 2x^2 - 5x + 3 = 0 ou x^2 = 16'
          : lang === 'pt'
          ? 'Não foi possível interpretar. Use o formato: 2x^2 - 5x + 3 = 0 ou x^2 = 16'
          : 'Unable to parse. Try format: 2x^2 - 5x + 3 = 0, x^2 = 16, or 3x^2 + 6x = 0'
      );
      return;
    }
    if (parsed.a === 0) {
      setNaturalError(
        lang === 'zh'
          ? '二次项系数 a 不能为 0（否则退化为一元一次方程 bx + c = 0）。'
          : lang === 'es'
          ? 'El coeficiente "a" no puede ser 0 (sería una ecuación lineal bx + c = 0).'
          : lang === 'fr'
          ? 'Le coefficient "a" ne peut pas être 0 (ce serait une équation linéaire bx + c = 0).'
          : lang === 'pt'
          ? 'O coeficiente "a" não pode ser 0 (seria uma equação linear bx + c = 0).'
          : 'Coefficient "a" cannot be 0 (that would be a linear equation bx + c = 0).'
      );
      return;
    }
    setNaturalError(null);
    onChange(parsed.a, parsed.b, parsed.c);
  };

  const handleTextChange = (key: 'a' | 'b' | 'c', textVal: string) => {
    if (key === 'a') setStrA(textVal);
    else if (key === 'b') setStrB(textVal);
    else setStrC(textVal);

    let numVal: number | null = null;
    if (textVal.includes('/')) {
      const parts = textVal.split('/');
      if (parts.length === 2) {
        const n = parseFloat(parts[0]);
        const d = parseFloat(parts[1]);
        if (!isNaN(n) && !isNaN(d) && d !== 0) numVal = n / d;
      }
    } else {
      const n = parseFloat(textVal);
      if (!isNaN(n)) numVal = n;
    }

    if (numVal !== null) {
      if (key === 'a' && numVal !== 0) onChange(numVal, b, c);
      else if (key === 'b') onChange(a, numVal, c);
      else if (key === 'c') onChange(a, b, numVal);
    }
  };

  const adjustVal = (key: 'a' | 'b' | 'c', delta: number) => {
    if (key === 'a') {
      let next = a + delta;
      if (next === 0) next = delta > 0 ? 1 : -1;
      onChange(next, b, c);
    } else if (key === 'b') {
      onChange(a, b + delta, c);
    } else {
      onChange(a, b, c + delta);
    }
  };

  const standardLatex = buildStandardFormLatex(a, b, c);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm text-base">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {T.inputTitle[lang]}
            </h2>
            <span className="text-xs sm:text-sm px-3 py-1 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              ax² + bx + c = 0
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {T.inputDesc[lang]}
          </p>
        </div>

        {/* Mode Toggle Button Group & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <button
              onClick={() => setInputMode('coefficients')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                inputMode === 'coefficients'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{T.modeSliders[lang]}</span>
            </button>
            <button
              onClick={() => setInputMode('natural')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                inputMode === 'natural'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>{T.modeType[lang]}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onChange(1, -5, 6);
              setNaturalText('x^2 - 5x + 6 = 0');
            }}
            title={T.resetBtn[lang]}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prominent Active Equation Card */}
      <div className="my-5 p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-2xs">
            {T.currentEqLabel[lang]}
          </span>
          <div className="text-2xl sm:text-3xl font-mono text-slate-900 tracking-tight font-bold">
            <MathView math={standardLatex} />
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm font-mono bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs text-slate-700 font-semibold">
          <span>a = <strong className="text-indigo-600 font-bold">{a}</strong></span>
          <span className="text-slate-300">•</span>
          <span>b = <strong className="text-indigo-600 font-bold">{b}</strong></span>
          <span className="text-slate-300">•</span>
          <span>c = <strong className="text-indigo-600 font-bold">{c}</strong></span>
        </div>
      </div>

      {/* Input Mode 1: Coefficients Sliders & Inputs */}
      {inputMode === 'coefficients' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Coefficient a */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-bold flex items-center justify-center text-sm">
                  a
                </span>
                <span>{T.coeffQuadratic[lang]}</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                a ≠ 0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustVal('a', -1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shrink-0 shadow-2xs"
                title="-1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={strA}
                onChange={(e) => handleTextChange('a', e.target.value)}
                placeholder="1 or 1/2"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-slate-900 font-mono text-xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => adjustVal('a', 1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shrink-0 shadow-2xs"
                title="+1"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('a', (-a).toString())}
                className="px-3 h-10 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 transition shadow-2xs"
                title="Toggle Sign"
              >
                ±
              </button>
            </div>

            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={Math.round(a)}
              onChange={(e) => handleTextChange('a', e.target.value)}
              className="w-full mt-4 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Coefficient b */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-bold flex items-center justify-center text-sm">
                  b
                </span>
                <span>{T.coeffLinear[lang]}</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustVal('b', -1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shrink-0 shadow-2xs"
                title="-1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={strB}
                onChange={(e) => handleTextChange('b', e.target.value)}
                placeholder="-5 or 3/4"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-slate-900 font-mono text-xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => adjustVal('b', 1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shrink-0 shadow-2xs"
                title="+1"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('b', (-b).toString())}
                className="px-3 h-10 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 transition shadow-2xs"
                title="Toggle Sign"
              >
                ±
              </button>
            </div>

            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={Math.round(b)}
              onChange={(e) => handleTextChange('b', e.target.value)}
              className="w-full mt-4 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Coefficient c */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-bold flex items-center justify-center text-sm">
                  c
                </span>
                <span>{T.coeffConstant[lang]}</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustVal('c', -1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shrink-0 shadow-2xs"
                title="-1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={strC}
                onChange={(e) => handleTextChange('c', e.target.value)}
                placeholder="6 or 2.5"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-slate-900 font-mono text-xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => adjustVal('c', 1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition shrink-0 shadow-2xs"
                title="+1"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('c', (-c).toString())}
                className="px-3 h-10 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 transition shadow-2xs"
                title="Toggle Sign"
              >
                ±
              </button>
            </div>

            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={Math.round(c)}
              onChange={(e) => handleTextChange('c', e.target.value)}
              className="w-full mt-4 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        /* Input Mode 2: Natural Text Form */
        <form onSubmit={handleNaturalSubmit} className="space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={naturalText}
              onChange={(e) => {
                setNaturalText(e.target.value);
                setNaturalError(null);
              }}
              placeholder="e.g. 2x^2 - 5x + 3 = 0, x^2 = 9, 3x^2 + 6x = 0"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 font-mono text-lg focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white transition shadow-sm text-base shrink-0"
            >
              {lang === 'zh' ? '解析并计算' : lang === 'es' ? 'Resolver' : lang === 'fr' ? 'Calculer' : lang === 'pt' ? 'Calcular' : 'Solve Equation'}
            </button>
          </div>

          {naturalError && (
            <div className="flex items-center gap-2.5 text-sm text-rose-600 bg-rose-50 border border-rose-200 p-3.5 rounded-xl font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{naturalError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 pt-1">
            <span className="font-semibold">
              {lang === 'zh' ? '常见例题点击直接填入:' : lang === 'es' ? 'Ejemplos rápidos:' : lang === 'fr' ? 'Exemples rapides :' : lang === 'pt' ? 'Exemplos rápidos:' : 'Quick examples:'}
            </span>
            {[
              '3x^2 - 6x + 2 = 0',
              'x^2 - 16 = 0',
              '2x^2 + 5x = 3',
              'x^2 + 4x + 5 = 0',
            ].map((ex) => (
              <button
                type="button"
                key={ex}
                onClick={() => {
                  setNaturalText(ex);
                  const parsed = parseEquationString(ex);
                  if (parsed) onChange(parsed.a, parsed.b, parsed.c);
                }}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
};
