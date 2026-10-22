import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, Flame } from 'lucide-react';
import { analyzeQuadratic, RootNatureType } from '../utils/mathEngine';
import { SupportedLang } from '../utils/translations';
import { MathView } from './MathView';

interface PracticeChallengeProps {
  lang: SupportedLang;
  onLoadEquation: (a: number, b: number, c: number) => void;
}

const PRESET_QUESTIONS: Array<{ a: number; b: number; c: number }> = [
  { a: 1, b: -5, c: 6 },     // delta = 1 > 0 (rational)
  { a: 1, b: -6, c: 9 },     // delta = 0 (double root)
  { a: 1, b: 2, c: 5 },      // delta = -16 < 0 (complex)
  { a: 2, b: 3, c: -2 },     // delta = 25 > 0 (rational)
  { a: 1, b: -4, c: 1 },     // delta = 12 > 0 (irrational)
  { a: 3, b: -6, c: 3 },     // delta = 0 (double root)
  { a: 2, b: -2, c: 5 },     // delta = -36 < 0 (complex)
  { a: 1, b: 7, c: 10 },     // delta = 9 > 0 (rational)
  { a: 4, b: -12, c: 9 },    // delta = 0 (double root)
  { a: 1, b: -2, c: 4 },     // delta = -12 < 0 (complex)
  { a: 2, b: 5, c: -3 },     // delta = 49 > 0 (rational)
  { a: 1, b: 4, c: 2 },      // delta = 8 > 0 (irrational)
];

export const PracticeChallenge: React.FC<PracticeChallengeProps> = ({ lang, onLoadEquation }) => {
  const [qIndex, setQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<RootNatureType | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const currentPreset = PRESET_QUESTIONS[qIndex % PRESET_QUESTIONS.length];
  const analysis = analyzeQuadratic(currentPreset.a, currentPreset.b, currentPreset.c);

  const choices: Array<{
    type: RootNatureType;
    label: Record<SupportedLang, string>;
    desc: Record<SupportedLang, string>;
  }> = [
    {
      type: 'two-real-rational',
      label: {
        en: 'Two Rational Real Roots (Δ > 0, Perfect Square)',
        es: 'Dos Raíces Reales Racionales (Δ > 0, Cuadrado Perfecto)',
        fr: 'Deux Racines Réelles Rationnelles (Δ > 0, Carré Parfait)',
        pt: 'Duas Raízes Reais Racionais (Δ > 0, Quadrado Perfeito)',
        zh: '两不同有理数实根 (Δ > 0 且为完全平方数)',
      },
      desc: {
        en: 'Crosses x-axis twice at clean fractions/integers. Factorable.',
        es: 'Corta el eje x dos veces en fracciones/enteros limpios. Factorizable.',
        fr: 'Coupe l’axe des x deux fois en fractions/entiers. Factorisable.',
        pt: 'Corta o eixo x duas vezes em frações/inteiros. Fatorável.',
        zh: '与 x 轴有两个整洁的有理交点，可直接因式分解。',
      },
    },
    {
      type: 'two-real-irrational',
      label: {
        en: 'Two Irrational Real Roots (Δ > 0, Not Square)',
        es: 'Dos Raíces Reales Irracionales (Δ > 0, No Cuadrado)',
        fr: 'Deux Racines Réelles Irrationnelles (Δ > 0, Non Carré)',
        pt: 'Duas Raízes Reais Irracionais (Δ > 0, Não Quadrado)',
        zh: '两不同无理数实根 (Δ > 0 但非平方数)',
      },
      desc: {
        en: 'Crosses x-axis twice, but requires square roots (radicals).',
        es: 'Corta el eje x dos veces, pero requiere radicales.',
        fr: 'Coupe l’axe des x deux fois, mais implique des racines carrées.',
        pt: 'Corta o eixo x duas vezes, mas requer radicais.',
        zh: '与 x 轴有两个交点，但根带有根号。',
      },
    },
    {
      type: 'one-real-double',
      label: {
        en: 'One Repeated Real Root (Δ = 0)',
        es: 'Una Raíz Real Doble (Δ = 0)',
        fr: 'Une Racine Réelle Double (Δ = 0)',
        pt: 'Uma Raiz Real Dupla (Δ = 0)',
        zh: '一重根 / 唯一解 (Δ = 0)',
      },
      desc: {
        en: 'Parabola vertex touches x-axis tangentially. Perfect square trinomial.',
        es: 'El vértice de la parábola toca el eje x tangencialmente.',
        fr: 'Le sommet de la parabole touche l’axe des x de manière tangente.',
        pt: 'O vértice da parábola tangencia o eixo x.',
        zh: '抛物线顶点与 x 轴相切，为完全平方式。',
      },
    },
    {
      type: 'two-complex',
      label: {
        en: 'No Real Roots / Two Complex (Δ < 0)',
        es: 'Sin Raíces Reales / Dos Complejas (Δ < 0)',
        fr: 'Pas de Racine Réelle / Deux Complexes (Δ < 0)',
        pt: 'Sem Raízes Reais / Duas Complexas (Δ < 0)',
        zh: '无实数根 / 两个共轭复数根 (Δ < 0)',
      },
      desc: {
        en: 'Parabola floats above/below x-axis without touching.',
        es: 'La parábola flota por encima/debajo del eje x sin tocarlo.',
        fr: 'La parabole flotte au-dessus/en dessous de l’axe sans le toucher.',
        pt: 'A parábola flutua acima/abaixo do eixo x sem tocar.',
        zh: '抛物线悬空，与 x 轴无交点，含虚数单位 i。',
      },
    },
  ];

  const handleSelect = (choice: RootNatureType) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const isCorrect = choice === analysis.rootNature;
    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQIndex((i) => (i + 1) % PRESET_QUESTIONS.length);
  };

  const isCorrect = selectedAnswer === analysis.rootNature;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'en' ? 'Discriminant Challenge: Predict Root Nature' : '判别式速决实战挑战'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'en'
                  ? 'Master speed for Algebra 1, Algebra 2 & SAT Math questions.'
                  : '针对美高与初中代数常考题型，快速判断判别式符号与根的特征。'}
              </p>
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs shadow-2xs">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span className="text-slate-600 font-medium">{lang === 'en' ? 'Streak:' : '连续答对:'}</span>
            <span className="font-extrabold text-amber-800 font-mono text-sm">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs shadow-2xs">
            <span className="text-slate-600 font-medium">{lang === 'en' ? 'Best:' : '最高纪录:'}</span>
            <span className="font-extrabold text-indigo-800 font-mono text-sm">{bestStreak}</span>
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mt-5 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1 bg-white px-2.5 py-0.5 rounded-full border border-indigo-100 shadow-2xs">
          {lang === 'en' ? `Question #${(qIndex % PRESET_QUESTIONS.length) + 1}` : `题目 #${(qIndex % PRESET_QUESTIONS.length) + 1}`}
        </span>
        <div className="text-2xl sm:text-3xl font-mono text-slate-900 py-3 font-semibold">
          <MathView math={analysis.standardFormLatex} block />
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
          {lang === 'en'
            ? 'Without fully solving, calculate Δ = b² - 4ac in your head: what is the sign and root classification?'
            : '无需解出方程，心算判别式 Δ = b² - 4ac：该方程属于哪类根？'}
        </p>
      </div>

      {/* Choice Buttons */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((choice) => {
          let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-2xs';

          if (isAnswered) {
            if (choice.type === analysis.rootNature) {
              btnStyle = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 text-emerald-900 font-semibold';
            } else if (selectedAnswer === choice.type) {
              btnStyle = 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 text-rose-900';
            } else {
              btnStyle = 'bg-slate-50 border-slate-200 opacity-40 text-slate-400';
            }
          }

          return (
            <button
              key={choice.type}
              onClick={() => handleSelect(choice.type)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left transition duration-150 flex flex-col justify-between cursor-pointer ${btnStyle}`}
            >
              <div className="font-bold text-sm sm:text-base mb-1">
                {choice.label[lang] || choice.label.en}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {choice.desc[lang] || choice.desc.en}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback banner after answering */}
      {isAnswered && (
        <div className={`mt-5 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
        }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-bold text-slate-900">
                {isCorrect
                  ? (lang === 'en' ? 'Correct! Fantastic job.' : '回答正确！干得漂亮！')
                  : (lang === 'en' ? 'Incorrect, keep practicing!' : '回答错误，再接再厉！')}
              </div>
              <div className="text-xs text-slate-700 mt-0.5 font-mono">
                Δ = ({currentPreset.b})² - 4({currentPreset.a})({currentPreset.c}) = {analysis.discriminant}
                {analysis.discriminant > 0 ? ' > 0' : analysis.discriminant === 0 ? ' = 0' : ' < 0'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onLoadEquation(currentPreset.a, currentPreset.b, currentPreset.c)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition shadow-2xs"
            >
              {lang === 'en' ? 'Open in Solver' : '在计算器中详细拆解'}
            </button>
            <button
              onClick={nextQuestion}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition"
            >
              {lang === 'en' ? 'Next Question →' : '下一题 →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
