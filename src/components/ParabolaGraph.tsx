import React, { useMemo, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang } from '../utils/translations';

interface ParabolaGraphProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const ParabolaGraph: React.FC<ParabolaGraphProps> = ({ analysis, lang }) => {
  const { a, b, c, vertex, xIntercepts, discriminant } = analysis;
  const svgRef = useRef<SVGSVGElement>(null);

  const [zoomFactor, setZoomFactor] = useState(1);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);

  // Compute nice domain
  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    let minX = vertex.x - 5;
    let maxX = vertex.x + 5;

    if (xIntercepts.x1 !== null && xIntercepts.x2 !== null) {
      const minRoot = Math.min(xIntercepts.x1, xIntercepts.x2);
      const maxRoot = Math.max(xIntercepts.x1, xIntercepts.x2);
      minX = Math.min(minX, minRoot - 2.5);
      maxX = Math.max(maxX, maxRoot + 2.5);
    }

    minX = Math.min(minX, -2);
    maxX = Math.max(maxX, 2);

    const spanX = (maxX - minX) / zoomFactor;
    const centerX = vertex.x;
    const finalXMin = centerX - spanX / 2;
    const finalXMax = centerX + spanX / 2;

    const yAtMinX = a * finalXMin * finalXMin + b * finalXMin + c;
    const yAtMaxX = a * finalXMax * finalXMax + b * finalXMax + c;
    const yAt0 = c;

    const sampleYs = [vertex.y, yAtMinX, yAtMaxX, yAt0, 0];
    let minY = Math.min(...sampleYs) - 3;
    let maxY = Math.max(...sampleYs) + 3;

    const spanY = Math.max(maxY - minY, (finalXMax - finalXMin) * 0.8) / zoomFactor;
    const centerY = (minY + maxY) / 2;
    const finalYMin = centerY - spanY / 2;
    const finalYMax = centerY + spanY / 2;

    return {
      xMin: finalXMin,
      xMax: finalXMax,
      yMin: finalYMin,
      yMax: finalYMax,
    };
  }, [a, b, c, vertex.x, vertex.y, xIntercepts, zoomFactor]);

  const width = 640;
  const height = 440;
  const pad = 40;

  const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
  const toSvgY = (y: number) => (height - pad) - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);
  const fromSvgX = (svgX: number) => xMin + ((svgX - pad) / (width - 2 * pad)) * (xMax - xMin);

  const curvePath = useMemo(() => {
    const pointsCount = 140;
    const step = (xMax - xMin) / pointsCount;
    const pts: string[] = [];

    for (let i = 0; i <= pointsCount; i++) {
      const curX = xMin + i * step;
      const curY = a * curX * curX + b * curX + c;
      const sx = toSvgX(curX);
      const sy = toSvgY(curY);

      if (i === 0) {
        pts.push(`M ${sx.toFixed(2)} ${sy.toFixed(2)}`);
      } else {
        pts.push(`L ${sx.toFixed(2)} ${sy.toFixed(2)}`);
      }
    }
    return pts.join(' ');
  }, [xMin, xMax, yMin, yMax, a, b, c]);

  const xTicks = useMemo(() => {
    const range = xMax - xMin;
    let step = 1;
    if (range > 20) step = 5;
    else if (range > 10) step = 2;
    else if (range < 4) step = 0.5;

    const start = Math.ceil(xMin / step) * step;
    const ticks: number[] = [];
    for (let val = start; val <= xMax; val += step) {
      ticks.push(parseFloat(val.toFixed(2)));
    }
    return ticks;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const range = yMax - yMin;
    let step = 1;
    if (range > 30) step = 10;
    else if (range > 15) step = 5;
    else if (range > 8) step = 2;
    else if (range < 4) step = 0.5;

    const start = Math.ceil(yMin / step) * step;
    const ticks: number[] = [];
    for (let val = start; val <= yMax; val += step) {
      ticks.push(parseFloat(val.toFixed(2)));
    }
    return ticks;
  }, [yMin, yMax]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;

    if (svgX >= pad && svgX <= width - pad) {
      const mathX = fromSvgX(svgX);
      const mathY = a * mathX * mathX + b * mathX + c;
      setHoverPoint({ x: mathX, y: mathY });
    } else {
      setHoverPoint(null);
    }
  };

  const handleMouseLeave = () => setHoverPoint(null);

  const originX = toSvgX(0);
  const originY = toSvgY(0);
  const vertexSvgX = toSvgX(vertex.x);
  const vertexSvgY = toSvgY(vertex.y);
  const yIntSvgX = toSvgX(0);
  const yIntSvgY = toSvgY(c);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {lang === 'zh'
                ? '交互式抛物线图像与几何交点'
                : lang === 'es'
                ? 'Parábola Interactiva y Geometría'
                : lang === 'fr'
                ? 'Parabole Interactive & Géométrie'
                : lang === 'pt'
                ? 'Parábola Interativa e Geometria'
                : 'Interactive Parabola & Geometry'}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                discriminant > 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : discriminant === 0
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {discriminant > 0
                ? (lang === 'zh' ? '2个实数交点' : lang === 'es' ? '2 Raíces Reales' : lang === 'fr' ? '2 Racines Réelles' : lang === 'pt' ? '2 Raízes Reais' : '2 Real Roots')
                : discriminant === 0
                ? (lang === 'zh' ? '1个切点 (重根)' : lang === 'es' ? '1 Raíz Doble' : lang === 'fr' ? '1 Racine Double' : lang === 'pt' ? '1 Raiz Dupla' : '1 Tangent Root')
                : (lang === 'zh' ? '0个实数交点' : lang === 'es' ? '0 Raíces Reales' : lang === 'fr' ? '0 Racine Réelle' : lang === 'pt' ? '0 Raízes Reais' : '0 Real Roots')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {lang === 'zh'
              ? `曲线 y = ${analysis.standardFormLatex.replace(' = 0', '')} | 顶点 (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`
              : lang === 'es'
              ? `Curva y = ${analysis.standardFormLatex.replace(' = 0', '')} | Vértice (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`
              : lang === 'fr'
              ? `Courbe y = ${analysis.standardFormLatex.replace(' = 0', '')} | Sommet (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`
              : lang === 'pt'
              ? `Curva y = ${analysis.standardFormLatex.replace(' = 0', '')} | Vértice (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`
              : `y = ${analysis.standardFormLatex.replace(' = 0', '')} | Vertex (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`}
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setZoomFactor((z) => Math.min(z * 1.3, 4))}
            title={lang === 'zh' ? '放大' : lang === 'es' ? 'Acercar' : lang === 'fr' ? 'Zoom avant' : lang === 'pt' ? 'Aproximar' : 'Zoom In'}
            className="p-1.5 hover:bg-white rounded transition text-slate-700 shadow-2xs cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomFactor((z) => Math.max(z / 1.3, 0.4))}
            title={lang === 'zh' ? '缩小' : lang === 'es' ? 'Alejar' : lang === 'fr' ? 'Zoom arrière' : lang === 'pt' ? 'Afastar' : 'Zoom Out'}
            className="p-1.5 hover:bg-white rounded transition text-slate-700 shadow-2xs cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomFactor(1)}
            title={lang === 'zh' ? '重置视角' : lang === 'es' ? 'Restablecer' : lang === 'fr' ? 'Réinitialiser' : lang === 'pt' ? 'Redefinir' : 'Reset View'}
            className="p-1.5 hover:bg-white rounded transition text-slate-700 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas on pristine white grid */}
      <div className="relative mt-3 w-full aspect-[16/11] bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <clipPath id="chartClip">
              <rect x={pad} y={pad} width={width - 2 * pad} height={height - 2 * pad} rx={6} />
            </clipPath>
            <linearGradient id="parabolaGradLight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <g className="text-slate-200" clipPath="url(#chartClip)">
            {xTicks.map((xVal) => (
              <line
                key={`gx-${xVal}`}
                x1={toSvgX(xVal)}
                y1={pad}
                x2={toSvgX(xVal)}
                y2={height - pad}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray={xVal === 0 ? '' : '2,2'}
              />
            ))}
            {yTicks.map((yVal) => (
              <line
                key={`gy-${yVal}`}
                x1={pad}
                y1={toSvgY(yVal)}
                x2={width - pad}
                y2={toSvgY(yVal)}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray={yVal === 0 ? '' : '2,2'}
              />
            ))}
          </g>

          {/* X Axis */}
          {originY >= pad && originY <= height - pad && (
            <g>
              <line
                x1={pad}
                y1={originY}
                x2={width - pad}
                y2={originY}
                stroke="#475569"
                strokeWidth={1.5}
              />
              <polygon
                points={`${width - pad},${originY - 3} ${width - pad + 6},${originY} ${width - pad},${originY + 3}`}
                fill="#475569"
              />
              <text
                x={width - pad + 10}
                y={originY + 4}
                className="text-[11px] font-bold fill-slate-700"
              >
                x
              </text>
            </g>
          )}

          {/* Y Axis */}
          {originX >= pad && originX <= width - pad && (
            <g>
              <line
                x1={originX}
                y1={height - pad}
                x2={originX}
                y2={pad}
                stroke="#475569"
                strokeWidth={1.5}
              />
              <polygon
                points={`${originX - 3},${pad} ${originX},${pad - 6} ${originX + 3},${pad}`}
                fill="#475569"
              />
              <text
                x={originX + 6}
                y={pad - 8}
                className="text-[11px] font-bold fill-slate-700"
              >
                y
              </text>
            </g>
          )}

          {/* Axis numbers/ticks */}
          <g className="text-[9px] fill-slate-400 font-mono">
            {xTicks.map((xVal) => {
              if (Math.abs(xVal) < 0.001) return null;
              const sx = toSvgX(xVal);
              const sy = Math.min(Math.max(originY + 12, pad + 12), height - pad - 6);
              return (
                <text key={`tx-${xVal}`} x={sx} y={sy} textAnchor="middle">
                  {xVal}
                </text>
              );
            })}
            {yTicks.map((yVal) => {
              if (Math.abs(yVal) < 0.001) return null;
              const sy = toSvgY(yVal);
              const sx = Math.min(Math.max(originX - 6, pad + 14), width - pad - 14);
              return (
                <text key={`ty-${yVal}`} x={sx} y={sy + 3} textAnchor="end">
                  {yVal}
                </text>
              );
            })}
          </g>

          {/* Clipped chart area */}
          <g clipPath="url(#chartClip)">
            {/* Axis of Symmetry: dashed amber line */}
            <line
              x1={vertexSvgX}
              y1={pad}
              x2={vertexSvgX}
              y2={height - pad}
              stroke="#d97706"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              opacity={0.8}
            />

            {/* Parabola curve */}
            <path
              d={curvePath}
              fill="none"
              stroke="url(#parabolaGradLight)"
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Real X-intercepts (Roots) */}
            {xIntercepts.x1 !== null && xIntercepts.x2 !== null && (
              <>
                <circle
                  cx={toSvgX(xIntercepts.x1)}
                  cy={originY}
                  r={5}
                  className="fill-emerald-600 stroke-white stroke-2"
                />
                {discriminant > 0 && (
                  <circle
                    cx={toSvgX(xIntercepts.x2)}
                    cy={originY}
                    r={5}
                    className="fill-emerald-600 stroke-white stroke-2"
                  />
                )}
              </>
            )}

            {/* Y-intercept (0, c) */}
            <circle
              cx={yIntSvgX}
              cy={yIntSvgY}
              r={4}
              className="fill-sky-500 stroke-white stroke-2"
            />

            {/* Vertex Point */}
            <circle
              cx={vertexSvgX}
              cy={vertexSvgY}
              r={6}
              className="fill-amber-500 stroke-white stroke-2 shadow-sm"
            />

            {/* Hover Crosshair point */}
            {hoverPoint && (
              <g>
                <line
                  x1={toSvgX(hoverPoint.x)}
                  y1={pad}
                  x2={toSvgX(hoverPoint.x)}
                  y2={height - pad}
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
                <circle
                  cx={toSvgX(hoverPoint.x)}
                  cy={toSvgY(hoverPoint.y)}
                  r={4}
                  className="fill-indigo-600 stroke-white stroke-1"
                />
              </g>
            )}
          </g>

          {/* Labels & Callouts */}
          {/* Vertex label */}
          <g>
            <rect
              x={vertexSvgX > width / 2 ? vertexSvgX - 110 : vertexSvgX + 10}
              y={vertexSvgY > height / 2 ? vertexSvgY - 32 : vertexSvgY + 10}
              width={100}
              height={24}
              rx={5}
              fill="#ffffff"
              stroke="#d97706"
              strokeWidth={1}
              className="filter drop-shadow-sm"
            />
            <text
              x={vertexSvgX > width / 2 ? vertexSvgX - 60 : vertexSvgX + 60}
              y={vertexSvgY > height / 2 ? vertexSvgY - 16 : vertexSvgY + 26}
              textAnchor="middle"
              className="text-[10px] font-bold fill-amber-800 font-mono"
            >
              V ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
            </text>
          </g>

          {/* X intercepts label if present */}
          {xIntercepts.x1 !== null && discriminant > 0 && (
            <g>
              <text
                x={toSvgX(xIntercepts.x1)}
                y={originY - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-emerald-800 font-mono"
              >
                x₁={xIntercepts.x1.toFixed(2)}
              </text>
              {xIntercepts.x2 !== null && (
                <text
                  x={toSvgX(xIntercepts.x2)}
                  y={originY - 8}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-emerald-800 font-mono"
                >
                  x₂={xIntercepts.x2.toFixed(2)}
                </text>
              )}
            </g>
          )}

          {/* Hover readout badge */}
          {hoverPoint && (
            <g>
              <rect
                x={pad + 8}
                y={pad + 8}
                width={130}
                height={22}
                rx={4}
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth={1}
                className="filter drop-shadow-xs"
              />
              <text
                x={pad + 14}
                y={pad + 23}
                className="text-[10px] fill-slate-700 font-mono font-medium"
              >
                (x: {hoverPoint.x.toFixed(2)}, y: {hoverPoint.y.toFixed(2)})
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-800">
              {lang === 'zh' ? '顶点 (h, k)' : lang === 'fr' ? 'Sommet (h, k)' : 'Vertex (h, k)'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="w-3 h-0.5 border-t border-dashed border-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-800">
              {lang === 'zh'
                ? '对称轴'
                : lang === 'es'
                ? 'Eje de Simetría'
                : lang === 'fr'
                ? 'Axe de Symétrie'
                : lang === 'pt'
                ? 'Eixo de Simetria'
                : 'Axis of Symmetry'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              x = {vertex.x.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-800">
              {lang === 'zh'
                ? '实数根 (x截距)'
                : lang === 'es'
                ? 'Raíces (cortes x)'
                : lang === 'fr'
                ? 'Racines (zéros)'
                : lang === 'pt'
                ? 'Raízes (cortes x)'
                : 'Roots (x-intercepts)'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {discriminant > 0 
                ? (lang === 'zh' ? '2个交点' : lang === 'es' ? '2 Cortes Reales' : lang === 'fr' ? '2 Zéros' : lang === 'pt' ? '2 Interseções' : '2 Real Crossings')
                : discriminant === 0 
                ? (lang === 'zh' ? '1个切点' : lang === 'es' ? '1 Tangente' : lang === 'fr' ? '1 Tangent' : lang === 'pt' ? '1 Tangente' : '1 Tangent Touch')
                : (lang === 'zh' ? '无实数截距' : lang === 'es' ? 'Sin Cortes' : lang === 'fr' ? 'Aucun Zéro' : lang === 'pt' ? 'Sem Cortes' : 'None (Complex)')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-800">
              {lang === 'zh'
                ? 'y轴截距 (0, c)'
                : lang === 'es'
                ? 'Corte con y (0, c)'
                : lang === 'fr'
                ? 'Ordonnée origine (0, c)'
                : lang === 'pt'
                ? 'Interseção em y (0, c)'
                : 'y-intercept (0, c)'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              (0, {c})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
