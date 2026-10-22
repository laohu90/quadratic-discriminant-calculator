import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Layers,
  Sparkles,
  Printer,
  Globe,
  Share2,
  BookOpen,
  Award,
  Zap,
  Check,
  Activity,
  GitMerge,
  Dices,
  Copy,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { analyzeQuadratic } from './utils/mathEngine';
import { SupportedLang, LANGUAGES, detectUserLanguage, saveUserLanguage, T } from './utils/translations';
import { EquationInput } from './components/EquationInput';
import { DiscriminantCard } from './components/DiscriminantCard';
import { CompletingSquareView } from './components/CompletingSquareView';
import { QuadraticFormulaView } from './components/QuadraticFormulaView';
import { ParabolaGraph } from './components/ParabolaGraph';
import { ParabolaTable } from './components/ParabolaTable';
import { AllMethodsComparison } from './components/AllMethodsComparison';
import { DiscriminantSliderExplorer } from './components/DiscriminantSliderExplorer';
import { RealWorldModelingCard } from './components/RealWorldModelingCard';
import { PrintableWorksheetModal } from './components/PrintableWorksheetModal';
import { PresetSelector } from './components/PresetSelector';
import { PracticeChallenge } from './components/PracticeChallenge';
import { EducationalGuide } from './components/EducationalGuide';
import { MathView } from './components/MathView';

export default function App() {
  // Read initial coefficients from URL params if available (e.g. ?a=1&b=-5&c=6)
  const getInitialCoeffs = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlA = parseFloat(params.get('a') || '');
      const urlB = parseFloat(params.get('b') || '');
      const urlC = parseFloat(params.get('c') || '');

      return {
        a: !isNaN(urlA) && urlA !== 0 ? urlA : 1,
        b: !isNaN(urlB) ? urlB : -5,
        c: !isNaN(urlC) ? urlC : 6,
      };
    } catch {
      return { a: 1, b: -5, c: 6 };
    }
  };

  const initial = getInitialCoeffs();
  const [a, setA] = useState<number>(initial.a);
  const [b, setB] = useState<number>(initial.b);
  const [c, setC] = useState<number>(initial.c);

  const [lang, setLang] = useState<SupportedLang>(() => detectUserLanguage());
  
  // Solver method tab in the left column (in-place switching, NOT whole-page navigation)
  const [solverMethod, setSolverMethod] = useState<'completing-square' | 'formula' | 'factoring' | 'all-methods'>('completing-square');
  
  const [showWorksheetModal, setShowWorksheetModal] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [activeBottomSection, setActiveBottomSection] = useState<'none' | 'quiz' | 'modeling' | 'guide'>('none');

  // Save language preference
  useEffect(() => {
    saveUserLanguage(lang);
  }, [lang]);

  // Sync URL query params with current equation
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('a', a.toString());
      params.set('b', b.toString());
      params.set('c', c.toString());
      if (lang !== 'en') {
        params.set('lang', lang);
      } else {
        params.delete('lang');
      }
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    } catch {
      // Ignore in iframe restriction
    }
  }, [a, b, c, lang]);

  // Compute quadratic analysis
  const analysis = useMemo(() => {
    try {
      return analyzeQuadratic(a, b, c);
    } catch {
      return analyzeQuadratic(1, 0, 0);
    }
  }, [a, b, c]);

  const handleEquationChange = (newA: number, newB: number, newC: number) => {
    setA(newA);
    setB(newB);
    setC(newC);
  };

  const handleRandomize = () => {
    const types = ['clean_real', 'double_root', 'complex', 'scaled'];
    const pick = types[Math.floor(Math.random() * types.length)];
    if (pick === 'clean_real') {
      const r1 = Math.floor(Math.random() * 9) - 4;
      let r2 = Math.floor(Math.random() * 9) - 4;
      if (r1 === r2) r2 += 1;
      setA(1);
      setB(-(r1 + r2));
      setC(r1 * r2);
    } else if (pick === 'double_root') {
      const r = Math.floor(Math.random() * 7) - 3;
      setA(1);
      setB(-2 * r);
      setC(r * r);
    } else if (pick === 'complex') {
      const h = Math.floor(Math.random() * 5) - 2;
      const k = Math.floor(Math.random() * 4) + 1;
      setA(1);
      setB(-2 * h);
      setC(h * h + k);
    } else {
      setA(2);
      setB(7);
      setC(3);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const handleCopySummary = () => {
    const summary = `${analysis.standardFormLatex}\nΔ = b² - 4ac = ${analysis.discriminant}\nRoots: ${analysis.xIntercepts.exactLatex1}, ${analysis.xIntercepts.exactLatex2}\nVertex: (${analysis.vertex.x.toFixed(2)}, ${analysis.vertex.y.toFixed(2)})`;
    navigator.clipboard.writeText(summary);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xs text-white font-black text-xl font-mono">
              Δ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  {lang === 'en' ? 'Quadratic Discriminant Calculator' : '一元二次方程判别式与配方法解题器'}
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {lang === 'en' ? 'US Curriculum' : '初高中代数'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {lang === 'en'
                  ? 'Δ = b² - 4ac • Completing the Square • Factoring • Parabola Graph'
                  : '判别式前置诊断 • 8步配方法拆解 • 十字相乘法 • 抛物线图像与表格'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {/* Random Button */}
            <button
              onClick={handleRandomize}
              title={lang === 'en' ? 'Generate Random Equation Challenge' : '随机生成一个方程'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">{lang === 'en' ? 'Random Equation' : '随机方程'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLang)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 pl-7 pr-7 rounded-xl border border-slate-200 focus:outline-hidden cursor-pointer"
                title="Select Language / Idioma / Langue / Idioma / 语言"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.nativeName}
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-indigo-600 absolute left-2 pointer-events-none" />
            </div>

            {/* Printable Worksheet Button */}
            <button
              onClick={() => setShowWorksheetModal(true)}
              title={lang === 'en' ? 'Generate Printable Homework Worksheet' : '生成可打印作业讲义'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{lang === 'en' ? 'Print Worksheet' : '打印讲义'}</span>
            </button>

            {/* Share Link Button */}
            <button
              onClick={handleShare}
              title={lang === 'en' ? 'Copy Equation URL' : '复制方程专属链接'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              {shareFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Section 1: Top Input & 1-Click Interactive Presets */}
        <div className="space-y-4">
          <EquationInput
            a={a}
            b={b}
            c={c}
            onChange={handleEquationChange}
            lang={lang}
          />

          <PresetSelector
            lang={lang}
            currentA={a}
            currentB={b}
            currentC={c}
            onSelect={handleEquationChange}
          />
        </div>

        {/* Section 2: Core Result Focal Point (The Discriminant & Root Diagnosis) */}
        <section aria-label="Discriminant Result">
          <DiscriminantCard analysis={analysis} lang={lang} />
        </section>

        {/* Section 3: The 2-Column Mathematical Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (lg:col-span-7): Full Step-by-Step Solver with In-Place Method Switching */}
          <div className="lg:col-span-7 space-y-4">
            {/* Method Switcher Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-2xs flex flex-wrap items-center gap-1">
              <button
                onClick={() => setSolverMethod('completing-square')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-1 justify-center cursor-pointer ${
                  solverMethod === 'completing-square'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'en' ? 'Completing Square (8 Steps)' : '配方法 (8步拆解)'}</span>
              </button>

              <button
                onClick={() => setSolverMethod('formula')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-1 justify-center cursor-pointer ${
                  solverMethod === 'formula'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>{lang === 'en' ? 'Quadratic Formula' : '求根公式'}</span>
              </button>

              <button
                onClick={() => setSolverMethod('all-methods')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-1 justify-center cursor-pointer ${
                  solverMethod === 'all-methods'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <GitMerge className="w-4 h-4" />
                <span>{lang === 'en' ? 'All 4 Methods' : '四大解法对比'}</span>
              </button>
            </div>

            {/* Active Method Solution View */}
            <div>
              {solverMethod === 'completing-square' && (
                <CompletingSquareView analysis={analysis} lang={lang} />
              )}

              {solverMethod === 'formula' && (
                <QuadraticFormulaView analysis={analysis} lang={lang} />
              )}

              {solverMethod === 'all-methods' && (
                <div className="space-y-4">
                  <AllMethodsComparison analysis={analysis} lang={lang} />
                  <QuadraticFormulaView analysis={analysis} lang={lang} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Interactive Parabola Graph & Real-Time C-Slider Explorer */}
          <div className="lg:col-span-5 space-y-6">
            {/* Parabola Graph */}
            <div className="sticky top-20 space-y-6">
              <ParabolaGraph analysis={analysis} lang={lang} />

              {/* Dynamic C-Slider Explorer (Engaging Interactive Widget) */}
              <DiscriminantSliderExplorer
                initialA={a}
                initialB={b}
                onApplyC={(newC) => setC(newC)}
                lang={lang}
              />

              {/* Coordinates Table */}
              <ParabolaTable analysis={analysis} lang={lang} />
            </div>
          </div>
        </div>

        {/* Section 4: Interactive Quiz & Practice Hook (Directly engages users!) */}
        <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <Award className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {lang === 'en' ? '⚡ 30-Second Discriminant Speed Quiz' : '⚡ 30秒判别式速决挑战'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {lang === 'en'
                    ? 'Can you determine how many real roots an equation has before solving?'
                    : '无需画图解题，能否在 5 秒内通过判别式判断根的实虚性？'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveBottomSection(activeBottomSection === 'quiz' ? 'none' : 'quiz')}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
            >
              {activeBottomSection === 'quiz'
                ? (lang === 'en' ? 'Collapse Quiz' : '收起刷题')
                : (lang === 'en' ? 'Start Challenge →' : '开始挑战 →')}
            </button>
          </div>

          {activeBottomSection === 'quiz' && (
            <div className="pt-6">
              <PracticeChallenge
                lang={lang}
                onLoadEquation={(qA, qB, qC) => {
                  setA(qA);
                  setB(qB);
                  setC(qC);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </section>

        {/* Section 5: Real-World Applications & Word Problems */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Zap className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {lang === 'en' ? 'Real-World Projectile & Economic Modeling' : '初高中物理与经济学实际应用建模'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {lang === 'en'
                    ? 'Physics trajectory flight time, maximum projectile height, and revenue optimization.'
                    : '抛体运动飞行时间、最高点重力加速度、利润最大化顶点问题。'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveBottomSection(activeBottomSection === 'modeling' ? 'none' : 'modeling')}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
            >
              {activeBottomSection === 'modeling'
                ? (lang === 'en' ? 'Collapse Modeling' : '收起建模')
                : (lang === 'en' ? 'View Modeling →' : '查看物理建模 →')}
            </button>
          </div>

          {activeBottomSection === 'modeling' && (
            <div className="pt-6">
              <RealWorldModelingCard analysis={analysis} lang={lang} />
            </div>
          )}
        </section>

        {/* Section 6: Comprehensive Educational Guide & FAQ (Google SEO Rich Answers) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                <BookOpen className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {lang === 'en' ? 'Formula Reference, Definitions & Common Questions' : '公式定理、定义与常见问答'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {lang === 'en'
                    ? 'Step-by-step mathematical proofs, discriminant thresholds, and FAQ for students and teachers.'
                    : '配方法代数证明、判别式临界判定定理与考试常见易错点。'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveBottomSection(activeBottomSection === 'guide' ? 'none' : 'guide')}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
            >
              {activeBottomSection === 'guide'
                ? (lang === 'en' ? 'Collapse Guide' : '收起指南')
                : (lang === 'en' ? 'Read Guide & FAQ →' : '阅读指南与FAQ →')}
            </button>
          </div>

          {activeBottomSection === 'guide' && (
            <div className="pt-6">
              <EducationalGuide lang={lang} />
            </div>
          )}
        </section>
      </main>

      {/* Printable Worksheet Modal */}
      {showWorksheetModal && (
        <PrintableWorksheetModal
          analysis={analysis}
          lang={lang}
          onClose={() => setShowWorksheetModal(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-600">
            <div>
              <div className="font-bold text-slate-900 mb-2">
                {lang === 'en' ? 'The Discriminant (Δ)' : '判别式原理 (Δ)'}
              </div>
              <p className="leading-relaxed">
                {lang === 'en'
                  ? 'Δ = b² - 4ac distinguishes whether roots are real, rational, irrational, or complex conjugate pairs without graphing.'
                  : 'Δ = b² - 4ac 位于二次方程求根公式的根号下方，无需画图即可直接确定方程的根数与实虚性。'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-2">
                {lang === 'en' ? 'Completing the Square' : '配方法 8 步规范'}
              </div>
              <p className="leading-relaxed">
                {lang === 'en'
                  ? 'Standardizes any quadratic ax² + bx + c = 0 into vertex form a(x - h)² + k = 0 by adding (b / 2a)².'
                  : '将一元二次方程恒等变形转化为 (x + b/2a)² = (b²-4ac)/4a²，是推导二次求根公式的核心数学基础。'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-2">
                {lang === 'en' ? 'US Curriculum Standards' : '课程标准对接'}
              </div>
              <p className="leading-relaxed">
                {lang === 'en'
                  ? 'Complies with Common Core State Standards (CCSS.MATH.CONTENT.HSA.REI.B.4.A & B) for high school algebra.'
                  : '全面对接初中代数、中考、高考及美高 Algebra 1 / Algebra 2、SAT / ACT 数学考纲。'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-2">
                {lang === 'en' ? 'International Domain' : '全球多语种上线'}
              </div>
              <p className="leading-relaxed">
                quadratic-discriminant-calculator.formulacalckit.com
                <br />
                Available in English, Español, Français, Português, and 简体中文.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © 2026 Quadratic Discriminant & Completing the Square Solver. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>https://quadratic-discriminant-calculator.formulacalckit.com/</span>
              <span>•</span>
              <span>English (Default)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
