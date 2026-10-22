import React, { useState } from 'react';
import { Layers, Calculator, GitMerge, Sparkles, BookOpen, CheckCircle, Split } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang } from '../utils/translations';
import { MathView } from './MathView';

interface AllMethodsComparisonProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const AllMethodsComparison: React.FC<AllMethodsComparisonProps> = ({ analysis, lang }) => {
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'formula' | 'square' | 'factoring' | 'vieta'>('all');
  const { factoring, vietas, completingSquareSteps, discriminant, xIntercepts } = analysis;

  const tabLabels: Record<'all' | 'factoring' | 'square' | 'formula' | 'vieta', Record<SupportedLang, string>> = {
    all: {
      en: 'All Methods',
      es: 'Todos los Métodos',
      fr: 'Toutes les Méthodes',
      pt: 'Todos os Métodos',
      zh: '全部解法',
    },
    factoring: {
      en: 'Factoring (AC)',
      es: 'Factorización',
      fr: 'Factorisation',
      pt: 'Fatoração',
      zh: '因式分解法',
    },
    square: {
      en: 'Completing Square',
      es: 'Completar Cuadrado',
      fr: 'Forme Canonique',
      pt: 'Completar Quadrados',
      zh: '配方法',
    },
    formula: {
      en: 'Quadratic Formula',
      es: 'Fórmula General',
      fr: 'Formule Quadratique',
      pt: 'Fórmula de Bhaskara',
      zh: '求根公式',
    },
    vieta: {
      en: 'Vieta’s Formulas',
      es: 'Relaciones de Vieta',
      fr: 'Relations de Viète',
      pt: 'Relações de Girard/Viète',
      zh: '韦达定理',
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <GitMerge className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'zh'
                  ? '一元二次方程四大解法全流程对比'
                  : lang === 'es'
                  ? 'Comparación de los 4 Métodos de Resolución'
                  : lang === 'fr'
                  ? 'Comparaison des 4 Méthodes de Résolution'
                  : lang === 'pt'
                  ? 'Comparação dos 4 Métodos de Resolução (Bhaskara)'
                  : 'Compare All Solving Methods (Algebra 1 & 2)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === 'zh'
                  ? '因式分解法（十字相乘）、配方法、万能求根公式、韦达定理根与系数关系'
                  : lang === 'es'
                  ? 'Factorización, Completar el Cuadrado, Fórmula General y Relaciones de Vieta'
                  : lang === 'fr'
                  ? 'Factorisation, Forme Canonique, Formule Quadratique et Relations de Viète'
                  : lang === 'pt'
                  ? 'Fatoração, Completar Quadrados, Fórmula de Bhaskara e Relações de Girard'
                  : 'Side-by-side comparison: Factoring, Completing the Square, Quadratic Formula & Vieta’s'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          {(['all', 'factoring', 'square', 'formula', 'vieta'] as const).map((tabId) => (
            <button
              key={tabId}
              onClick={() => setSelectedMethod(tabId)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedMethod === tabId
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tabLabels[tabId][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Method 1: Factoring / AC Method */}
        {(selectedMethod === 'all' || selectedMethod === 'factoring') && (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">1</span>
                  {lang === 'zh'
                    ? '因式分解法 (十字相乘/提取公因式)'
                    : lang === 'es'
                    ? 'Factorización (Método AC)'
                    : lang === 'fr'
                    ? 'Factorisation (Méthode AC)'
                    : lang === 'pt'
                    ? 'Fatoração (Método do Produto Notável)'
                    : 'Factoring (AC Method)'}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  factoring.isFactorable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {factoring.isFactorable
                    ? (lang === 'zh' ? '适用本题' : lang === 'es' ? 'Factorizable' : lang === 'fr' ? 'Factorisable' : lang === 'pt' ? 'Fatorável' : 'Factorable')
                    : (lang === 'zh' ? '本题不适用整系数分解' : lang === 'es' ? 'No factorizable en ℤ' : lang === 'fr' ? 'Non factorisable sur ℤ' : lang === 'pt' ? 'Não fatorável em ℤ' : 'Not Factorable Over ℤ')}
                </span>
              </div>

              {factoring.isFactorable && factoring.factorLatex ? (
                <div className="space-y-3 mt-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-mono text-slate-900 text-base shadow-2xs">
                    <MathView math={factoring.factorLatex} />
                  </div>
                  {factoring.stepsEn && (
                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 bg-white/70 p-3 rounded-lg border border-slate-200/60">
                      {(lang === 'zh' ? factoring.stepsZh : factoring.stepsEn)?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-white/60 rounded-lg border border-dashed border-slate-200 text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
                  {lang === 'zh'
                    ? `因为判别式 Δ = ${discriminant} 不是完全平方数，本方程无法在整数范围内因式分解。请采用配方法或求根公式求解！`
                    : lang === 'es'
                    ? `Como el discriminante Δ = ${discriminant} no es un cuadrado perfecto, esta ecuación no se puede factorizar con enteros. ¡Utiliza completar el cuadrado o la fórmula general!`
                    : lang === 'fr'
                    ? `Comme le discriminant Δ = ${discriminant} n’est pas un carré parfait, cette équation n’est pas factorisable dans les entiers. Utilisez la forme canonique ou la formule quadratique !`
                    : lang === 'pt'
                    ? `Como o discriminante Δ = ${discriminant} não é um quadrado perfeito, esta equação não pode ser fatorada em números inteiros. Use completar quadrados ou a Fórmula de Bhaskara!`
                    : `Because the discriminant Δ = ${discriminant} is not a perfect square, this quadratic equation cannot be factored into clean whole-number binomials. Use Completing the Square or the Quadratic Formula instead!`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Method 2: Completing the Square Summary */}
        {(selectedMethod === 'all' || selectedMethod === 'square') && (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
                  {lang === 'zh'
                    ? '配方法 (标准推导)'
                    : lang === 'es'
                    ? 'Completar el Cuadrado'
                    : lang === 'fr'
                    ? 'Forme Canonique'
                    : lang === 'pt'
                    ? 'Completando Quadrados'
                    : 'Completing the Square'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {lang === 'zh' ? '万能通解' : lang === 'es' ? 'Universal' : lang === 'fr' ? 'Universelle' : lang === 'pt' ? 'Universal' : 'Universal'}
                </span>
              </div>

              <div className="space-y-3 mt-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-mono text-slate-900 text-base shadow-2xs">
                  <MathView math={completingSquareSteps[Math.min(5, completingSquareSteps.length - 2)]?.latex || ''} />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 bg-white/70 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                  {lang === 'zh'
                    ? `核心步骤：两边同加配方常数项 (b/2a)² = (${analysis.b}/${2 * analysis.a})²，构造成二项式平方。`
                    : lang === 'es'
                    ? `Paso clave: Sumar el término complementario (b/2a)² = (${analysis.b}/${2 * analysis.a})² a ambos lados para formar un binomio al cuadrado.`
                    : lang === 'fr'
                    ? `Étape clé : Ajouter le terme canonique (b/2a)² = (${analysis.b}/${2 * analysis.a})² aux deux membres pour obtenir un carré parfait.`
                    : lang === 'pt'
                    ? `Passo fundamental: Somar o termo complementar (b/2a)² = (${analysis.b}/${2 * analysis.a})² em ambos os membros para formar um trinômio quadrado perfeito.`
                    : `Key step: Add magic completing term (b/2a)² = (${analysis.b}/${2 * analysis.a})² to both sides to form a perfect square binomial.`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Method 3: Quadratic Formula */}
        {(selectedMethod === 'all' || selectedMethod === 'formula') && (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">3</span>
                  {lang === 'zh'
                    ? '万能求根公式法'
                    : lang === 'es'
                    ? 'Fórmula General'
                    : lang === 'fr'
                    ? 'Formule Quadratique'
                    : lang === 'pt'
                    ? 'Fórmula de Bhaskara'
                    : 'Quadratic Formula'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {lang === 'zh' ? '万能通解' : lang === 'es' ? 'Universal' : lang === 'fr' ? 'Universelle' : lang === 'pt' ? 'Universal' : 'Universal'}
                </span>
              </div>

              <div className="space-y-3 mt-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-mono text-slate-900 text-base shadow-2xs">
                  <MathView math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 flex items-center justify-between">
                  <span>Δ = {discriminant}</span>
                  <span className="font-bold text-indigo-700">
                    {discriminant === 0 ? `x = ${xIntercepts.exactLatex1}` : `x₁ = ${xIntercepts.exactLatex1}, x₂ = ${xIntercepts.exactLatex2}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Method 4: Vieta's Formulas (SAT & ACT Favorite) */}
        {(selectedMethod === 'all' || selectedMethod === 'vieta') && (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">4</span>
                  {lang === 'zh'
                    ? '韦达定理 (根与系数关系 / SAT必考)'
                    : lang === 'es'
                    ? 'Relaciones de Vieta (Suma y Producto)'
                    : lang === 'fr'
                    ? 'Relations de Viète (Somme & Produit)'
                    : lang === 'pt'
                    ? 'Relações de Girard / Viète (Soma e Produto)'
                    : 'Vieta’s Formulas (Sum & Product)'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {lang === 'zh' ? '标化考试重点' : lang === 'es' ? 'SAT & Exámenes' : lang === 'fr' ? 'Bac & Concours' : lang === 'pt' ? 'ENEM & Vestibulares' : 'SAT & ACT Math'}
                </span>
              </div>

              <div className="space-y-2.5 mt-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs sm:text-sm font-mono shadow-2xs">
                  <span className="text-slate-500">
                    {lang === 'zh' ? '两根之和:' : lang === 'es' ? 'Suma de raíces:' : lang === 'fr' ? 'Somme des racines :' : lang === 'pt' ? 'Soma das raízes:' : 'Sum of Roots:'}
                  </span>
                  <div className="text-sm font-bold text-slate-900 flex items-center">
                    <MathView math={`x_1 + x_2 = -\\frac{b}{a} = ${vietas.sumLatex}`} />
                    <span className="text-slate-400 font-sans text-xs ml-2">({vietas.sumValue.toFixed(2)})</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs sm:text-sm font-mono shadow-2xs">
                  <span className="text-slate-500">
                    {lang === 'zh' ? '两根之积:' : lang === 'es' ? 'Producto de raíces:' : lang === 'fr' ? 'Produit des racines :' : lang === 'pt' ? 'Produto das raízes:' : 'Product of Roots:'}
                  </span>
                  <div className="text-sm font-bold text-slate-900 flex items-center">
                    <MathView math={`x_1 \\cdot x_2 = \\frac{c}{a} = ${vietas.productLatex}`} />
                    <span className="text-slate-400 font-sans text-xs ml-2">({vietas.productValue.toFixed(2)})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
