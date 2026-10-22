import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, FileText } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang } from '../utils/translations';
import { MathView } from './MathView';

interface PrintableWorksheetModalProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
  onClose: () => void;
}

export const PrintableWorksheetModal: React.FC<PrintableWorksheetModalProps> = ({
  analysis,
  lang,
  onClose,
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {lang === 'zh'
                  ? '可打印代数作业讲义与标准解答'
                  : lang === 'es'
                  ? 'Hoja de Trabajo Imprimible y Soluciones'
                  : lang === 'fr'
                  ? 'Fiche d’Exercices Imprimable & Corrigé'
                  : lang === 'pt'
                  ? 'Atividade para Impressão e Gabarito'
                  : 'Printable Homework / Worksheet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === 'zh'
                  ? '包含题头、填空解题区域及标准评分参考答案'
                  : 'Print-ready worksheet for teachers & students'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'en' ? 'Print / Save as PDF' : '打印 / 存为 PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div ref={printContentRef} className="space-y-6 text-slate-800 p-2">
          {/* Worksheet Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                {lang === 'en' ? 'Algebra Worksheet: Quadratic Equations & Steps' : '代数习题与解题步骤报告'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'en' ? 'Topic: Discriminant (Δ) & Completing the Square' : '专题：一元二次方程判别式与配方法'}
              </p>
            </div>
            <div className="text-right text-xs space-y-1 font-mono">
              <div>Name: ______________________</div>
              <div>Date: ______________________</div>
              <div>Period / Class: _____________</div>
            </div>
          </div>

          {/* Given Equation Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Given Equation:</span>
              <div className="text-xl font-mono font-bold text-slate-900 mt-1">
                <MathView math={analysis.standardFormLatex} />
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-600">
              <div>a = {analysis.a}</div>
              <div>b = {analysis.b}</div>
              <div>c = {analysis.c}</div>
            </div>
          </div>

          {/* Problem Part 1: Discriminant */}
          <div className="border border-slate-300 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Part 1: The Discriminant (Δ = b² - 4ac) & Root Nature
            </h4>
            <div className="font-mono text-sm bg-white p-2.5 rounded border border-slate-200">
              Δ = ({analysis.b})² - 4({analysis.a})({analysis.c}) = {analysis.discriminant}
            </div>
            <div className="text-xs text-slate-700 font-medium">
              Conclusion: {lang === 'en' ? analysis.rootNatureTitleEn : analysis.rootNatureTitleZh} ({analysis.discriminant > 0 ? 'Δ > 0' : analysis.discriminant === 0 ? 'Δ = 0' : 'Δ < 0'})
            </div>
          </div>

          {/* Problem Part 2: Completing the Square Steps */}
          <div className="border border-slate-300 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Part 2: Completing the Square Full Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              {analysis.completingSquareSteps.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-2 border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-900 shrink-0">Step {step.stepNumber}:</span>
                  <div className="font-mono text-indigo-900">
                    <MathView math={step.latex} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Part 3: Final Solutions & Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-300 rounded-xl p-3 text-xs space-y-1">
              <span className="font-bold uppercase text-slate-500">Exact Solutions:</span>
              <div className="font-mono text-sm text-slate-900 font-bold">
                {analysis.discriminant === 0 ? (
                  <MathView math={`x = ${analysis.xIntercepts.exactLatex1}`} />
                ) : (
                  <MathView math={`x_1 = ${analysis.xIntercepts.exactLatex1}, \\quad x_2 = ${analysis.xIntercepts.exactLatex2}`} />
                )}
              </div>
            </div>

            <div className="border border-slate-300 rounded-xl p-3 text-xs space-y-1">
              <span className="font-bold uppercase text-slate-500">Vertex Form:</span>
              <div className="font-mono text-sm text-slate-900 font-bold">
                <MathView math={analysis.vertexFormLatex} />
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Vertex (h, k) = ({analysis.vertex.x.toFixed(2)}, {analysis.vertex.y.toFixed(2)})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
