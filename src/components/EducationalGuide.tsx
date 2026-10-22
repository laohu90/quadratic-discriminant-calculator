import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, Sparkles, Check, Compass, FileText } from 'lucide-react';
import { SupportedLang } from '../utils/translations';
import { MathView } from './MathView';

interface EducationalGuideProps {
  lang: SupportedLang;
}

interface FaqItem {
  q: Record<SupportedLang, string>;
  a: Record<SupportedLang, string>;
  latex?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    latex: '\\Delta = b^2 - 4ac',
    q: {
      en: 'What is the formula for the discriminant of a quadratic equation?',
      es: '¿Cuál es la fórmula para el discriminante de una ecuación cuadrática?',
      fr: 'Quelle est la formule du discriminant d’une équation quadratique ?',
      pt: 'Qual é a fórmula do discriminante de uma equação do 2º grau?',
      zh: '一元二次方程判别式的计算公式是什么？',
    },
    a: {
      en: 'For any quadratic equation written in standard form ax² + bx + c = 0 (where a ≠ 0), the discriminant is denoted by Delta (Δ) and is calculated as Δ = b² - 4ac. It lies under the radical in the quadratic formula.',
      es: 'Para cualquier ecuación cuadrática ax² + bx + c = 0 (con a ≠ 0), el discriminante se denota como Delta (Δ) y se calcula como Δ = b² - 4ac.',
      fr: 'Pour toute équation ax² + bx + c = 0 (a ≠ 0), le discriminant noté Δ est calculé par Δ = b² - 4ac.',
      pt: 'Para qualquer equação ax² + bx + c = 0 (com a ≠ 0), o discriminante é denotado por Delta (Δ) e calculado como Δ = b² - 4ac.',
      zh: '在标准形式 ax² + bx + c = 0 (a ≠ 0) 中，判别式用希腊字母 Δ 表示，计算公式为 Δ = b² - 4ac。它正是一元二次方程求根公式中位于根号内部的整式。',
    },
  },
  {
    q: {
      en: 'What does a positive, zero, or negative discriminant mean?',
      es: '¿Qué significa un discriminante positivo, cero o negativo?',
      fr: 'Que signifie un discriminant positif, nul ou négatif ?',
      pt: 'O que significa um discriminante positivo, zero ou negativo?',
      zh: '判别式大于零、等于零、小于零分别代表什么含义？',
    },
    a: {
      en: '• If Δ > 0: Two distinct real roots (parabola crosses x-axis twice).\n• If Δ = 0: One repeated real root / double root (parabola vertex touches x-axis tangentially).\n• If Δ < 0: No real roots (two complex conjugate solutions with imaginary unit i).',
      es: '• Si Δ > 0: Dos raíces reales distintas.\n• Si Δ = 0: Una raíz real doble (tangente).\n• Si Δ < 0: Sin raíces reales (dos raíces complejas conjugadas).',
      fr: '• Si Δ > 0 : Deux racines réelles distinctes.\n• Si Δ = 0 : Une racine réelle double (tangente).\n• Si Δ < 0 : Pas de racine réelle (deux racines complexes conjuguées).',
      pt: '• Se Δ > 0: Duas raízes reais distintas.\n• Se Δ = 0: Uma raiz real dupla (tangente).\n• Se Δ < 0: Sem raízes reais (duas raízes complexas conjugadas).',
      zh: '• 当 Δ > 0 时：方程有两个不相等的实数根，抛物线与 x 轴有两个不同交点。\n• 当 Δ = 0 时：方程有两个相等的实数根（重根/唯一解），抛物线顶点与 x 轴相切。\n• 当 Δ < 0 时：无实数解，有一对共轭复数解 (含虚数单位 i)。',
    },
  },
  {
    latex: '\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}',
    q: {
      en: 'How do you solve a quadratic equation by completing the square step-by-step?',
      es: '¿Cómo resolver una ecuación cuadrática completando el cuadrado paso a paso?',
      fr: 'Comment résoudre une équation par la forme canonique étape par étape ?',
      pt: 'Como resolver uma equação do 2º grau completando quadrados passo a passo?',
      zh: '配方法解一元二次方程的具体操作步骤是什么？',
    },
    a: {
      en: '1. Standard form ax² + bx + c = 0.\n2. Move constant c to the right.\n3. Make leading coefficient 1 by dividing by a.\n4. Add (b/2a)² to both sides.\n5. Factor the left side as a binomial square (x + b/2a)².\n6. Take ±√ on both sides and isolate x.',
      es: '1. Forma estándar ax² + bx + c = 0.\n2. Mover constante a la derecha.\n3. Dividir entre a para que a=1.\n4. Sumar (b/2a)² a ambos lados.\n5. Factorizar como binomio al cuadrado.\n6. Aplicar raíz cuadrada y despejar x.',
      fr: '1. Forme standard ax² + bx + c = 0.\n2. Isoler la constante.\n3. Diviser par a.\n4. Ajouter (b/2a)² des deux côtés.\n5. Factoriser en carré parfait.\n6. Prendre la racine carrée et isoler x.',
      pt: '1. Forma padrão ax² + bx + c = 0.\n2. Isolar a constante.\n3. Dividir por a.\n4. Somar (b/2a)² em ambos os lados.\n5. Fatorar como quadrado perfeito.\n6. Aplicar raiz quadrada e isolar x.',
      zh: '1. 化为标准形式。\n2. 移项将常数项移到右侧。\n3. 二次项系数化为 1。\n4. 计算并两边加上配方常数 (b/2a)²。\n5. 左侧写成完全平方式 (x + b/2a)²。\n6. 两边开平方并解出 x。',
    },
  },
  {
    latex: '\\sqrt{\\Delta} \\in \\mathbb{Z} \\implies \\text{Factorable}',
    q: {
      en: 'When is a quadratic equation factorable using whole numbers without radicals?',
      es: '¿Cuándo es factorable una ecuación cuadrática sin radicales?',
      fr: 'Quand une équation est-elle factorisable sans racines ?',
      pt: 'Quando uma equação do 2º grau é fatorável sem radicais?',
      zh: '如何提前判断方程是否可以不用开根号、直接因式分解？',
    },
    a: {
      en: 'If a, b, c are integers and Δ = b² - 4ac is a perfect square (0, 1, 4, 9, 16, 25, 36, 49...), then √Δ is an integer, guaranteeing the trinomial can be factored into integer binomials.',
      es: 'Si a, b, c son enteros y Δ es un cuadrado perfecto, √Δ es un número entero, lo que garantiza que se puede factorizar sin raíces irracionales.',
      fr: 'Si a, b, c sont entiers et Δ est un carré parfait (0, 1, 4, 9, 16...), √Δ est un entier, garantissant une factorisation simple.',
      pt: 'Se a, b, c são inteiros e Δ é um quadrado perfeito, √Δ é um número inteiro, garantindo fatoração com números inteiros.',
      zh: '若系数均为整数且 Δ 是完全平方数（0, 1, 4, 9, 16, 25...），则 √Δ 为整数，必可在有理数范围内直接十字相乘分解。',
    },
  },
  {
    latex: 'y = a(x - h)^2 + k',
    q: {
      en: 'How does completing the square relate to the Parabola Vertex Form?',
      es: '¿Cómo se relaciona completar el cuadrado con la forma vértice de la parábola?',
      fr: 'Quel est le lien entre la forme canonique et le sommet de la parabole ?',
      pt: 'Como completar o quadrado se relaciona com a forma do vértice da parábola?',
      zh: '配方法如何帮助快速求出抛物线顶点坐标 (h, k)？',
    },
    a: {
      en: 'Completing the square converts y = ax² + bx + c into Vertex Form y = a(x - h)² + k, where the vertex is h = -b/(2a) and k = -Δ/(4a).',
      es: 'Completar el cuadrado convierte y = ax² + bx + c en la forma vértice y = a(x - h)² + k, donde el vértice es h = -b/(2a) y k = -Δ/(4a).',
      fr: 'La mise sous forme canonique donne y = a(x - h)² + k, où le sommet est h = -b/(2a) et k = -Δ/(4a).',
      pt: 'Completar quadrados converte y = ax² + bx + c na forma do vértice y = a(x - h)² + k, onde o vértice é h = -b/(2a) e k = -Δ/(4a).',
      zh: '配方法将抛物线化为顶点式 y = a(x - h)² + k，顶点横坐标 h = -b/(2a)，纵坐标 k = -Δ/(4a)，无需导数即可秒求最值。',
    },
  },
];

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ lang }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <span className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
          <BookOpen className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {lang === 'en'
              ? 'Algebra Knowledge Hub: Discriminant & Completing the Square'
              : '代数知识精讲：判别式原理与核心考点'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'en'
              ? 'Complete US Common Core Algebra 1 & 2 Reference Guide'
              : '涵盖初高中核心课程标准、判定定理与常见考试答疑'}
          </p>
        </div>
      </div>

      {/* Root Nature Master Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'en' ? 'Master Root Nature Decision Table' : '一元二次方程根的判别式核心速查表'}</span>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">{lang === 'en' ? 'Discriminant Condition' : '判别式条件'}</th>
                <th className="p-3">{lang === 'en' ? 'Nature of Roots' : '根的性质'}</th>
                <th className="p-3">{lang === 'en' ? 'Parabola Graph Behavior' : '抛物线几何图像'}</th>
                <th className="p-3">{lang === 'en' ? 'Factorability' : '因式分解性质'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-3 font-mono font-bold text-emerald-700">
                  Δ &gt; 0 (Perfect Square)
                </td>
                <td className="p-3 font-medium text-slate-900">
                  {lang === 'en' ? '2 Distinct Rational Real Roots' : '2个不相等的有理数实根'}
                </td>
                <td className="p-3">
                  {lang === 'en' ? 'Crosses x-axis at 2 clean rational points' : '与 x 轴有两个有理交点'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    {lang === 'en' ? 'Easy Integer Factoring' : '可十字相乘因式分解'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-3 font-mono font-bold text-blue-700">
                  Δ &gt; 0 (Not Square)
                </td>
                <td className="p-3 font-medium text-slate-900">
                  {lang === 'en' ? '2 Distinct Irrational Real Roots' : '2个不相等的无理数实根'}
                </td>
                <td className="p-3">
                  {lang === 'en' ? 'Crosses x-axis twice; solutions involve radicals (√)' : '与 x 轴有两个交点，根含不可化简根号'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    {lang === 'en' ? 'Quadratic Formula / Radicals' : '须用求根公式或配方'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-3 font-mono font-bold text-amber-700">
                  Δ = 0
                </td>
                <td className="p-3 font-medium text-slate-900">
                  {lang === 'en' ? '1 Repeated Real Root (Double Root)' : '2个相等的实根（重根/唯一解）'}
                </td>
                <td className="p-3">
                  {lang === 'en' ? 'Vertex touches x-axis tangentially' : '抛物线顶点与 x 轴相切'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                    {lang === 'en' ? 'Perfect Square Trinomial' : '完全平方式 (x - h)² = 0'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="p-3 font-mono font-bold text-rose-700">
                  Δ &lt; 0
                </td>
                <td className="p-3 font-medium text-slate-900">
                  {lang === 'en' ? 'No Real Roots (2 Complex Conjugates)' : '无实数根（2个共轭虚数解）'}
                </td>
                <td className="p-3">
                  {lang === 'en' ? 'Floats entirely above/below x-axis' : '抛物线悬空，与 x 轴无交点'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                    {lang === 'en' ? 'Complex Numbers (p ± qi)' : '引入虚数单位 i = √(-1)'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Accordion FAQ: Targets Google People Also Ask */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'en' ? 'Frequently Asked Questions (Google Featured Answers)' : '常见问题权威精析（Google 搜索高频精答）'}</span>
        </h4>

        <div className="space-y-2">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 transition cursor-pointer"
                >
                  <span>{faq.q[lang] || faq.q.en}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                    {faq.latex && (
                      <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-center font-mono text-indigo-900 text-sm">
                        <MathView math={faq.latex} block />
                      </div>
                    )}
                    <p className="whitespace-pre-line font-normal">
                      {faq.a[lang] || faq.a.en}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
