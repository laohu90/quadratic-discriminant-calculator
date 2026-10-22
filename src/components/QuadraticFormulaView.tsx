import React from 'react';
import { Calculator, Check, Copy } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang, T } from '../utils/translations';
import { MathView } from './MathView';

interface QuadraticFormulaViewProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const QuadraticFormulaView: React.FC<QuadraticFormulaViewProps> = ({ analysis, lang }) => {
  const { quadraticFormulaSteps, xIntercepts, discriminant } = analysis;
  const [copied, setCopied] = React.useState(false);

  const copySolution = () => {
    const text = discriminant === 0
      ? `x = ${xIntercepts.exactLatex1}`
      : `x1 = ${xIntercepts.exactLatex1}, x2 = ${xIntercepts.exactLatex2}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBtnLabel = copied
    ? (lang === 'zh' ? '已复制！' : lang === 'es' ? '¡Copiado!' : lang === 'fr' ? 'Copié !' : lang === 'pt' ? 'Copiado!' : 'Copied!')
    : (lang === 'zh' ? '复制解' : lang === 'es' ? 'Copiar Raíces' : lang === 'fr' ? 'Copier Racines' : lang === 'pt' ? 'Copiar Raízes' : 'Copy Roots');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm text-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Calculator className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {T.formulaTitle[lang]}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {T.formulaSubtitle[lang]}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={copySolution}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 transition shadow-2xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copyBtnLabel}</span>
        </button>
      </div>

      {/* Prominent Exact Solutions Box */}
      <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">
            {T.exactSolutionsLabel[lang]}
          </div>
          <div className="text-xl sm:text-2xl font-mono text-slate-900 flex flex-wrap items-center gap-4">
            {discriminant === 0 ? (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-slate-500 text-base font-sans">x =</span>
                <MathView math={xIntercepts.exactLatex1} />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-slate-500 text-base font-sans">x₁ =</span>
                  <MathView math={xIntercepts.exactLatex1} />
                </div>
                <span className="text-slate-400 font-sans text-sm font-semibold">
                  {lang === 'zh' ? '及' : lang === 'es' ? 'y' : lang === 'fr' ? 'et' : lang === 'pt' ? 'e' : 'and'}
                </span>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-slate-500 text-base font-sans">x₂ =</span>
                  <MathView math={xIntercepts.exactLatex2} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Decimal Approximations (if real) */}
        {xIntercepts.x1 !== null && xIntercepts.x2 !== null && (
          <div className="border-t md:border-t-0 md:border-l border-emerald-200/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
            <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              {T.decimalApproxLabel[lang]}
            </div>
            <div className="text-base font-mono text-emerald-950 font-bold">
              {discriminant === 0 ? (
                <span>x ≈ {xIntercepts.x1.toFixed(4)}</span>
              ) : (
                <div className="space-y-1">
                  <div>x₁ ≈ {xIntercepts.x1.toFixed(4)}</div>
                  <div>x₂ ≈ {xIntercepts.x2.toFixed(4)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3.5">
        {quadraticFormulaSteps.map((step, idx) => {
          const stepTitle = step.title ? (step.title[lang] || step.title.en) : (lang === 'zh' ? step.titleZh : step.titleEn);
          const stepExp = step.explanation ? (step.explanation[lang] || step.explanation.en) : (lang === 'zh' ? step.explanationZh : step.explanationEn);

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {stepTitle}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono text-slate-900 text-lg sm:text-xl overflow-x-auto shadow-2xs">
                <MathView math={step.latex} block />
              </div>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {stepExp}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
