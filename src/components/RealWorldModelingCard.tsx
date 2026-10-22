import React from 'react';
import { Rocket, Clock, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang } from '../utils/translations';
import { MathView } from './MathView';

interface RealWorldModelingCardProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const RealWorldModelingCard: React.FC<RealWorldModelingCardProps> = ({ analysis, lang }) => {
  const { a, b, c, vertex, projectile } = analysis;

  if (a >= 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {lang === 'zh'
                ? '现实建模应用：极小值与成本优化'
                : lang === 'es'
                ? 'Aplicación Práctica: Costo Mínimo / Extremo'
                : lang === 'fr'
                ? 'Application Réelle : Coût Minimal / Extremum'
                : lang === 'pt'
                ? 'Aplicação Prática: Custo Mínimo / Extremo'
                : 'Real-World Application: Minimum Cost / Extremum'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'zh'
                ? '因为二次项系数 a > 0，抛物线开口向上，在顶点处取得全局最小值。'
                : lang === 'es'
                ? 'Como a > 0, la parábola abre hacia arriba (tiene un mínimo global en el vértice).'
                : lang === 'fr'
                ? 'Comme a > 0, la parabole est orientée vers le haut (minimum global au sommet).'
                : lang === 'pt'
                ? 'Como a > 0, a parábola tem concavidade voltada para cima (ponto de mínimo no vértice).'
                : 'Since a > 0, the parabola opens UPWARDS (has an absolute minimum at vertex).'}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-500 mb-1">
              {lang === 'zh' ? '极小值点 (顶点):' : lang === 'es' ? 'Punto Mínimo (Vértice):' : lang === 'fr' ? 'Point Minimum (Sommet) :' : lang === 'pt' ? 'Ponto Mínimo (Vértice):' : 'Minimum Point (Vertex):'}
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
            </div>
            <p className="text-slate-500 mt-1">
              {lang === 'zh'
                ? `当 x = ${vertex.x.toFixed(2)} 时取得最小值 y = ${vertex.y.toFixed(2)}。`
                : lang === 'es'
                ? `El valor mínimo es y = ${vertex.y.toFixed(2)} cuando x = ${vertex.x.toFixed(2)}.`
                : lang === 'fr'
                ? `La valeur minimale est y = ${vertex.y.toFixed(2)} pour x = ${vertex.x.toFixed(2)}.`
                : lang === 'pt'
                ? `O valor mínimo é y = ${vertex.y.toFixed(2)} para x = ${vertex.x.toFixed(2)}.`
                : `The minimum value is y = ${vertex.y.toFixed(2)} when x = ${vertex.x.toFixed(2)}.`}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-500 mb-1">
              {lang === 'zh' ? '物理抛体运动贴士:' : lang === 'es' ? 'Consejo de Tiro Parabólico:' : lang === 'fr' ? 'Conseil Mouvement Balistique :' : lang === 'pt' ? 'Dica de Lançamento Oblíquo:' : 'Tip for Projectile Motion:'}
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {lang === 'zh'
                ? '在自由落体抛体运动中，重力加速度为负（英制 a = -16 ft/s²，公制 a = -4.9 m/s²）。您可点击预设中的“美高物理抛体运动轨迹”查看经典模型。'
                : lang === 'es'
                ? 'Para modelar gravedad (h(t) = -16t² + v₀t + h₀), selecciona "Tiro Parabólico" en la barra de ajustes con a = -16 o -4.9.'
                : lang === 'fr'
                ? 'Pour modéliser la pesanteur (h(t) = -4.9t² + v₀t + h₀), choisissez le préréglage Balistique avec a = -4.9 ou -16.'
                : lang === 'pt'
                ? 'Para modelar movimento balístico (h(t) = -16t² + v₀t + h₀), selecione "Lançamento de Projétil" nos exemplos pré-definidos.'
                : 'To model gravity/projectile motion (e.g. h(t) = -16t² + v₀t + h₀), choose "US Physics Projectile" in the presets bar where a = -16 ft/s² or -4.9 m/s².'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // When a < 0: Projectile motion
  const peakTime = vertex.x;
  const maxHeight = vertex.y;
  const initialHeight = c;
  const totalFlightTime = projectile?.totalFlightTime;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <span className="p-2 rounded-xl bg-orange-50 text-orange-700">
          <Rocket className="w-4 h-4" />
        </span>
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            {lang === 'zh'
              ? '现实物理建模：抛体轨迹与飞行指标'
              : lang === 'es'
              ? 'Modelado Físico: Cinemática y Movimiento Parabólico'
              : lang === 'fr'
              ? 'Modélisation Physique : Balistique et Trajectoire'
              : lang === 'pt'
              ? 'Modelagem Física: Lançamento de Projéteis e Trajetória'
              : 'Real-World Modeling: Projectile Motion & Trajectory'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'zh'
              ? `轨迹方程：h(t) = ${analysis.standardFormLatex.replace(' = 0', '').replace(/x/g, 't')} (t 为时间，h 为高度)`
              : `h(t) = ${analysis.standardFormLatex.replace(' = 0', '').replace(/x/g, 't')}`}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-slate-500 block mb-1">
            {lang === 'zh' ? '最高点耗时' : lang === 'es' ? 'Tiempo al Vértice' : lang === 'fr' ? 'Temps au Sommet' : lang === 'pt' ? 'Tempo ao Ápice' : 'Time to Peak (t)'}
          </span>
          <span className="text-base font-bold font-mono text-slate-900">{peakTime.toFixed(2)} s</span>
          <span className="text-xs text-slate-400 block mt-0.5">t = -b / (2a)</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-slate-500 block mb-1">
            {lang === 'zh' ? '最大飞行高度' : lang === 'es' ? 'Altura Máxima' : lang === 'fr' ? 'Hauteur Maximale' : lang === 'pt' ? 'Altura Máxima' : 'Max Peak Height (h)'}
          </span>
          <span className="text-base font-bold font-mono text-indigo-700">{maxHeight.toFixed(2)} ft</span>
          <span className="text-xs text-slate-400 block mt-0.5">Vertex Y</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-slate-500 block mb-1">
            {lang === 'zh' ? '落地总时间' : lang === 'es' ? 'Tiempo de Vuelo' : lang === 'fr' ? 'Temps de Vol' : lang === 'pt' ? 'Tempo de Voo' : 'Total Flight Time'}
          </span>
          <span className="text-base font-bold font-mono text-emerald-700">
            {typeof totalFlightTime === 'number' ? `${totalFlightTime.toFixed(2)} s` : 'N/A'}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">Root h(t) = 0</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-slate-500 block mb-1">
            {lang === 'zh' ? '起始发射高度' : lang === 'es' ? 'Altura Inicial' : lang === 'fr' ? 'Hauteur Initiale' : lang === 'pt' ? 'Altura Inicial' : 'Launch Height'}
          </span>
          <span className="text-base font-bold font-mono text-slate-900">{initialHeight} ft</span>
          <span className="text-xs text-slate-400 block mt-0.5">h(0) = c</span>
        </div>
      </div>
    </div>
  );
};
