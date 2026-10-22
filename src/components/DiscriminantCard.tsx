import React from 'react';
import { Target, Zap, Sparkles } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang, T, getRootNatureTitle } from '../utils/translations';
import { MathView } from './MathView';

interface DiscriminantCardProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const DiscriminantCard: React.FC<DiscriminantCardProps> = ({ analysis, lang }) => {
  const { a, b, c, discriminant, radical, rootNature, rootNatureDesc } = analysis;

  const isPositive = discriminant > 0;
  const isZero = discriminant === 0;

  const title = T.deltaCardTitle[lang];
  const subtitle = T.deltaCardSubtitle[lang];
  const deltaLabel = T.deltaValueLabel[lang];
  const substLabel = T.substitutionLabel[lang];
  const conclLabel = T.conclusionLabel[lang];

  const rootTitleText = getRootNatureTitle(rootNature, lang);
  const rootDescText = rootNatureDesc ? (rootNatureDesc[lang] || rootNatureDesc.en) : analysis.rootNatureDescEn;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden text-base">
      {/* Top Banner: Formula & Calculation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`p-2.5 rounded-xl border ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isZero
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <Zap className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Big Delta Value Pill */}
        <div
          className={`flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xs ${
            isPositive
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : isZero
              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          }`}
        >
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-wider opacity-75">
              {deltaLabel}
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              Δ = {discriminant}
            </div>
          </div>
          <div className="text-3xl">
            {isPositive ? '📈' : isZero ? '🎯' : '🔮'}
          </div>
        </div>
      </div>

      {/* Step Calculation & Diagnosis Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step Calculation */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between">
          <div className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>{substLabel}</span>
          </div>

          <div className="my-3 p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-mono text-slate-900 text-lg sm:text-xl overflow-x-auto shadow-2xs">
            <MathView math={`\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c})`} block />
          </div>

          <div className="mt-2 text-sm text-slate-600 flex items-center justify-between font-mono bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <span>= {b * b} - ({4 * a * c})</span>
            <span className="font-extrabold text-indigo-700 text-base">= {discriminant}</span>
          </div>
        </div>

        {/* Nature of Roots Badge & Diagnosis */}
        <div
          className={`rounded-xl p-5 border flex flex-col justify-between ${
            isPositive
              ? 'bg-emerald-50/70 border-emerald-300'
              : isZero
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-rose-50/70 border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
              {conclLabel}
            </span>
            <span
              className={`text-xs sm:text-sm px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                isPositive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isZero
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isPositive ? 'Δ > 0' : isZero ? 'Δ = 0' : 'Δ < 0'}
            </span>
          </div>

          <div className="my-3">
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {rootTitleText}
            </div>
            <p className="text-sm sm:text-base text-slate-700 mt-1.5 leading-relaxed">
              {rootDescText}
            </p>
          </div>

          {/* Factorability note */}
          {isPositive && radical.isPerfectSquare && (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-100 px-3 py-2 rounded-lg border border-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {lang === 'zh'
                  ? '因式分解快捷通道：判别式为完全平方数，本方程可在有理数范围内直接分解！'
                  : lang === 'es'
                  ? '¡Factorizable! Como Δ es un cuadrado perfecto, este trinomio se factoriza limpiamente en números enteros.'
                  : lang === 'fr'
                  ? 'Factorisable ! Puisque Δ est un carré parfait, ce trinôme se factorise facilement avec des entiers.'
                  : lang === 'pt'
                  ? 'Fatorável! Como Δ é um quadrado perfeito, este trinômio pode ser fatorado diretamente com inteiros.'
                  : 'Factorable: Because Δ is a perfect square, this quadratic factors cleanly with whole numbers!'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
