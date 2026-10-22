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
  CheckCircle2,
  Table,
  Activity,
  GitMerge,
  Rocket,
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

  const getInitialTab = (): 'solver' | 'completing-square' | 'methods' | 'graph' | 'practice' | 'guide' => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab');
      if (t && ['solver', 'completing-square', 'methods', 'graph', 'practice', 'guide'].includes(t)) {
        return t as any;
      }
    } catch {}
    return 'solver';
  };

  const [activeTab, setActiveTab] = useState<'solver' | 'completing-square' | 'methods' | 'graph' | 'practice' | 'guide'>(getInitialTab);
  const [showWorksheetModal, setShowWorksheetModal] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Save language preference
  useEffect(() => {
    saveUserLanguage(lang);
  }, [lang]);

  // Sync URL query params with current equation and tab
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('a', a.toString());
      params.set('b', b.toString());
      params.set('c', c.toString());
      params.set('tab', activeTab);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } catch {
      // Ignore in iframe restriction
    }
  }, [a, b, c, activeTab]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm text-white font-black text-xl font-mono">
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

          {/* Navigation & Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* View Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto max-w-[280px] sm:max-w-none">
              <button
                onClick={() => handleTabChange('solver')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  activeTab === 'solver'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'en' ? 'Calculator' : '计算器'}</span>
                <span className="md:hidden">{lang === 'en' ? 'Calc' : '计算'}</span>
              </button>

              <button
                onClick={() => handleTabChange('completing-square')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  activeTab === 'completing-square'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'en' ? 'Completing Square' : '配方法'}</span>
                <span className="md:hidden">{lang === 'en' ? 'Square' : '配方'}</span>
              </button>

              <button
                onClick={() => handleTabChange('methods')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  activeTab === 'methods'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'en' ? 'All 4 Methods' : '四大解法'}</span>
                <span className="md:hidden">{lang === 'en' ? 'Methods' : '解法'}</span>
              </button>

              <button
                onClick={() => handleTabChange('graph')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  activeTab === 'graph'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'en' ? 'Graph & Table' : '图像与表格'}</span>
                <span className="md:hidden">{lang === 'en' ? 'Graph' : '图表'}</span>
              </button>

              <button
                onClick={() => handleTabChange('practice')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  activeTab === 'practice'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">{lang === 'en' ? 'Quiz Challenge' : '速决刷题'}</span>
                <span className="md:hidden">{lang === 'en' ? 'Quiz' : '测试'}</span>
              </button>

              <button
                onClick={() => handleTabChange('guide')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                  activeTab === 'guide'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === 'en' ? 'FAQ & Guide' : '指南'}</span>
                <span className="md:hidden">{lang === 'en' ? 'Guide' : '指南'}</span>
              </button>
            </div>

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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{lang === 'en' ? 'Print Worksheet' : '打印讲义'}</span>
            </button>

            {/* Share Link Button */}
            <button
              onClick={handleShare}
              title={lang === 'en' ? 'Copy Equation URL' : '复制方程专属链接'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              {shareFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/50 via-white to-white border-b border-slate-100 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? 'Aligned with US Common Core & High School Math Standards'
                  : '贴合美高与初中代数考查标准 • 四大解法一次搞懂'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {lang === 'en'
                ? 'Quadratic Discriminant Calculator & Step-by-Step Solver'
                : '一元二次方程判别式计算器与配方法全解'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'Calculate Δ = b² - 4ac, determine the nature of roots (two distinct real, one double root, or complex conjugate roots), and solve with step-by-step Completing the Square, AC Factoring, Quadratic Formula, and interactive Parabola graph with coordinates table.'
                : '在线求解一元二次方程，计算判别式 Δ = b² - 4ac 预判根的个数与实虚性；提供配方法 8 步全解、十字相乘因式分解、韦达定理与抛物线坐标表。'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Equation Input & Presets always accessible at top */}
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

        {/* Tab 1: Discriminant & Root Analysis (Focused primary result) */}
        {activeTab === 'solver' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <DiscriminantCard analysis={analysis} lang={lang} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-mono">1</span>
                  {lang === 'en' ? 'Quick Solution Summary' : '核心解法速览'}
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">{lang === 'en' ? 'Vertex (h, k)' : '顶点坐标 (h, k)'}:</span>
                    <span className="font-mono font-semibold">({analysis.vertex.x.toFixed(2)}, {analysis.vertex.y.toFixed(2)})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">{lang === 'en' ? 'Axis of Symmetry' : '对称轴'}:</span>
                    <span className="font-mono font-semibold">x = {analysis.axisOfSymmetry}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{lang === 'en' ? 'Y-Intercept' : 'Y轴截距'}:</span>
                    <span className="font-mono font-semibold">(0, {c})</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-mono">2</span>
                    {lang === 'en' ? 'Explore Detailed Methods' : '深入探索其他解法'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'en'
                      ? 'Switch to the tabs above to view the 8-step Completing the Square breakdown, Quadratic Formula, Parabola graph, or Practice Quiz.'
                      : '点击上方标签可随时查看 8 步配方法详细推导、求根公式、抛物线可视化图表或进行刷题测试。'}
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('completing-square')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    {lang === 'en' ? 'View Completing Square →' : '查看配方法全解 →'}
                  </button>
                  <button
                    onClick={() => setActiveTab('graph')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
                  >
                    {lang === 'en' ? 'View Graph & Table →' : '查看抛物线图表 →'}
                  </button>
                </div>
              </div>
            </div>

            <RealWorldModelingCard analysis={analysis} lang={lang} />
          </div>
        )}

        {/* Tab 2: Completing the Square Focus */}
        {activeTab === 'completing-square' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <CompletingSquareView analysis={analysis} lang={lang} />
          </div>
        )}

        {/* Tab 3: All Methods Comparison */}
        {activeTab === 'methods' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <AllMethodsComparison analysis={analysis} lang={lang} />
            <QuadraticFormulaView analysis={analysis} lang={lang} />
          </div>
        )}

        {/* Tab 4: Parabola Graph & Table */}
        {activeTab === 'graph' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <ParabolaGraph analysis={analysis} lang={lang} />
            <ParabolaTable analysis={analysis} lang={lang} />
            <DiscriminantSliderExplorer
              initialA={a}
              initialB={b}
              onApplyC={(newC) => setC(newC)}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 5: Quiz Challenge */}
        {activeTab === 'practice' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <PracticeChallenge
              lang={lang}
              onLoadEquation={(qA, qB, qC) => {
                setA(qA);
                setB(qB);
                setC(qC);
                setActiveTab('solver');
              }}
            />
          </div>
        )}

        {/* Tab 6: FAQ & Guide */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <EducationalGuide lang={lang} />
          </div>
        )}
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
      <footer className="mt-16 bg-slate-50 border-t border-slate-200 py-10 text-xs text-slate-500">
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
                {lang === 'en' ? 'Completing the Square' : '配方法技巧'}
              </div>
              <p className="leading-relaxed">
                {lang === 'en'
                  ? 'A universal algebraic method that rewrites standard form ax² + bx + c into vertex form y = a(x - h)² + k to locate extremes.'
                  : '将一元二次方程通过两边同时加上 (b/2a)² 构造成完全平方式，为求根公式的推导核心。'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-2">
                {lang === 'en' ? 'Factoring (AC Method)' : '十字相乘与因式分解'}
              </div>
              <p className="leading-relaxed">
                {lang === 'en'
                  ? 'Whenever Δ is a non-negative perfect square, the quadratic equation can be cleanly factored over rational numbers.'
                  : '当且仅当判别式 Δ 为非负完全平方数时，方程可在有理数范围内因式分解。'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-2">
                {lang === 'en' ? 'Key Formulas' : '核心公式库'}
              </div>
              <div className="space-y-1 font-mono text-slate-700">
                <div>Standard: ax² + bx + c = 0</div>
                <div>Delta: Δ = b² - 4ac</div>
                <div>Formula: x = (-b ± √Δ) / 2a</div>
                <div>Vertex Form: y = a(x - h)² + k</div>
                <div>Vieta’s: x₁ + x₂ = -b/a</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
            <div>
              {lang === 'en'
                ? '© Quadratic Discriminant Calculator • Built for US High School & College Algebra'
                : '© 一元二次方程判别式与配方法在线计算器 • 专为初高中代数打造'}
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-mono">
              <span>Δ &gt; 0 (2 Real)</span>
              <span>•</span>
              <span>Δ = 0 (1 Real)</span>
              <span>•</span>
              <span>Δ &lt; 0 (Complex)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
