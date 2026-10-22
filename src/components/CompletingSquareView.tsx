import React, { useState } from 'react';
import { Sparkles, ChevronRight, Layers, BookOpen } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang, T, getSquareStepTitle } from '../utils/translations';
import { MathView } from './MathView';

interface CompletingSquareViewProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const CompletingSquareView: React.FC<CompletingSquareViewProps> = ({ analysis, lang }) => {
  const { completingSquareSteps, vertexFormLatex, vertex, a } = analysis;
  const [activeStep, setActiveStep] = useState<number>(completingSquareSteps.length);
  const [viewMode, setViewMode] = useState<'all' | 'interactive'>('all');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm text-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Layers className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {T.squareTitle[lang]}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {T.squareSubtitle[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm self-start sm:self-auto">
          <button
            onClick={() => {
              setViewMode('all');
              setActiveStep(completingSquareSteps.length);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'all'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {T.showAllSteps[lang]}
          </button>
          <button
            onClick={() => {
              setViewMode('interactive');
              setActiveStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              viewMode === 'interactive'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {T.guidedSteps[lang]}
          </button>
        </div>
      </div>

      {/* Interactive navigation bar if interactive mode is selected */}
      {viewMode === 'interactive' && (
        <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between">
          <span className="text-sm font-bold text-indigo-950">
            {lang === 'zh'
              ? `第 ${activeStep} 步 / 共 ${completingSquareSteps.length} 步`
              : lang === 'es'
              ? `Paso ${activeStep} de ${completingSquareSteps.length}`
              : lang === 'fr'
              ? `Étape ${activeStep} sur ${completingSquareSteps.length}`
              : lang === 'pt'
              ? `Passo ${activeStep} de ${completingSquareSteps.length}`
              : `Step ${activeStep} of ${completingSquareSteps.length}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
              disabled={activeStep <= 1}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition shadow-2xs"
            >
              {T.prevStep[lang]}
            </button>
            <button
              onClick={() => setActiveStep((s) => Math.min(completingSquareSteps.length, s + 1))}
              disabled={activeStep >= completingSquareSteps.length}
              className="px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition flex items-center gap-1 shadow-xs"
            >
              {T.nextStep[lang]}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        {completingSquareSteps.map((step) => {
          const isVisible = viewMode === 'all' || step.stepNumber <= activeStep;
          if (!isVisible) return null;

          const isCurrentActive = viewMode === 'interactive' && step.stepNumber === activeStep;
          const stepTitle = getSquareStepTitle(step.stepNumber, a, lang);
          const stepExp = step.explanation ? (step.explanation[lang] || step.explanation.en) : (lang === 'zh' ? step.explanationZh : step.explanationEn);

          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border transition-all duration-200 p-5 sm:p-6 ${
                isCurrentActive
                  ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                  : 'bg-slate-50/80 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {step.stepNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                    {stepTitle}
                  </h4>
                </div>

                {step.highlight && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {step.highlight}
                  </span>
                )}
              </div>

              {/* Latex Equation Block */}
              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-x-auto text-slate-900 font-mono text-lg sm:text-xl shadow-2xs">
                <MathView math={step.latex} block />
              </div>

              {/* Explanation */}
              <div className="mt-3 flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <p className="leading-relaxed">
                  {stepExp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertex Form Derivation Callout */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-center gap-2 text-indigo-900 text-sm sm:text-base font-bold mb-2">
          <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            {lang === 'zh'
              ? '美高核心考点联结：配方法转化为二次函数顶点式'
              : lang === 'es'
              ? 'Conexión Curricular: De la Forma Estándar a la Forma de Vértice'
              : lang === 'fr'
              ? 'Lien Pédagogique : De la Forme Standard à la Forme Canonique'
              : lang === 'pt'
              ? 'Aplicação Curricular: Da Forma Geral à Forma Canônica (Vértice)'
              : 'Curriculum Connection: Standard Form to Vertex Form y = a(x - h)² + k'}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {lang === 'zh'
            ? '通过配方法，一元二次方程的标准形式可直接转化为顶点式 y = a(x - h)² + k，从而秒求抛物线顶点 (h, k) 与极值：'
            : lang === 'es'
            ? 'Al completar el cuadrado, la forma estándar se convierte directamente en la forma canónica o de vértice y = a(x - h)² + k:'
            : lang === 'fr'
            ? 'La méthode de complétion du carré permet de passer directement à la forme canonique y = a(x - h)² + k et de lire le sommet :'
            : lang === 'pt'
            ? 'Completando o quadrado, a forma geral se transforma diretamente na forma canônica do vértice y = a(x - h)² + k:'
            : 'Completing the square converts standard form into vertex form y = a(x - h)² + k, revealing the vertex (h, k) instantly:'}
        </p>
        <div className="p-4 rounded-xl bg-white border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-base font-mono text-slate-900 shadow-2xs">
          <div>
            <span className="text-slate-500 text-xs sm:text-sm mr-2 font-sans">
              {lang === 'zh' ? '顶点式:' : lang === 'es' ? 'Forma de Vértice:' : lang === 'fr' ? 'Forme Canonique :' : lang === 'pt' ? 'Forma Canônica:' : 'Vertex Form:'}
            </span>
            <MathView math={vertexFormLatex} />
          </div>
          <div className="text-indigo-700 font-mono text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
            Vertex (h, k) = ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
          </div>
        </div>
      </div>
    </div>
  );
};
