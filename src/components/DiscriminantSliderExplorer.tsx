import React, { useState } from 'react';
import { Sliders, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { SupportedLang } from '../utils/translations';
import { MathView } from './MathView';

interface DiscriminantSliderExplorerProps {
  initialA: number;
  initialB: number;
  onApplyC: (newC: number) => void;
  lang: SupportedLang;
}

export const DiscriminantSliderExplorer: React.FC<DiscriminantSliderExplorerProps> = ({
  initialA,
  initialB,
  onApplyC,
  lang,
}) => {
  // Let user explore changing c while holding a and b constant
  const [cVal, setCVal] = useState<number>(0);

  // Compute critical c where Delta = 0: b^2 - 4ac = 0 => c = b^2 / (4a)
  const criticalC = (initialB * initialB) / (4 * initialA);
  const currentDelta = initialB * initialB - 4 * initialA * cVal;

  const isPos = currentDelta > 0;
  const isZero = Math.abs(currentDelta) < 0.001;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {lang === 'en' ? 'Live Discriminant Explorer: Shift Constant c' : '判别式动态探索器：调节常数项 c 观察根的演变'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'en'
                ? 'Watch the parabola slide up and down across the zero line'
                : '拖动滑块调节 c，观察抛物线上移下移、交点由 2 变 1 再到 0 的全过程'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onApplyC(cVal)}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
        >
          {lang === 'en' ? 'Apply to Solver' : '应用此方程'}
        </button>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600">
            {lang === 'en' ? 'Fixed: a =' : '固定项：a ='} <strong>{initialA}</strong>, b = <strong>{initialB}</strong>
          </span>
          <span className="text-indigo-700 font-bold">
            c = <strong className="text-base">{cVal}</strong>
          </span>
        </div>

        <input
          type="range"
          min={Math.floor(criticalC - 10)}
          max={Math.ceil(criticalC + 10)}
          step="0.5"
          value={cVal}
          onChange={(e) => setCVal(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Min: {(criticalC - 10).toFixed(1)}</span>
          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {lang === 'en' ? `Critical Tangent c = ${criticalC.toFixed(2)} (Δ=0)` : `相切临界点 c = ${criticalC.toFixed(2)} (Δ=0)`}
          </span>
          <span>Max: {(criticalC + 10).toFixed(1)}</span>
        </div>
      </div>

      {/* Result Indicator */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        isPos
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : isZero
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{isPos ? '📈' : isZero ? '🎯' : '🔮'}</span>
          <div>
            <div className="font-bold">
              {isPos
                ? (lang === 'en' ? 'Two Real Intercepts (Δ > 0)' : '有两个实数交点 (Δ > 0)')
                : isZero
                ? (lang === 'en' ? 'Tangent Vertex Touching x-axis (Δ = 0)' : '顶点切于 x 轴 (Δ = 0)')
                : (lang === 'en' ? 'No Real Intercepts — Floating (Δ < 0)' : '无实数交点 — 抛物线悬空 (Δ < 0)')}
            </div>
            <div className="font-mono text-[11px] mt-0.5 opacity-80">
              Δ = ({initialB})² - 4({initialA})({cVal}) = {currentDelta.toFixed(2)}
            </div>
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs text-slate-700">
          {isPos ? 'Δ > 0' : isZero ? 'Δ = 0' : 'Δ < 0'}
        </span>
      </div>
    </div>
  );
};
