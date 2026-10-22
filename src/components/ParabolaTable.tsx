import React from 'react';
import { Table, Copy, Check } from 'lucide-react';
import { QuadraticAnalysis } from '../utils/mathEngine';
import { SupportedLang } from '../utils/translations';

interface ParabolaTableProps {
  analysis: QuadraticAnalysis;
  lang: SupportedLang;
}

export const ParabolaTable: React.FC<ParabolaTableProps> = ({ analysis, lang }) => {
  const { tableOfValues } = analysis;
  const [copied, setCopied] = React.useState(false);

  const copyTable = () => {
    const header = 'x\ty\n';
    const rows = tableOfValues.map((p) => `${p.x}\t${p.y}`).join('\n');
    navigator.clipboard.writeText(header + rows);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLabelText = (label: string | undefined): string => {
    if (!label) return '';
    if (label === 'Vertex') {
      return lang === 'zh' ? '顶点 (Vertex)' : lang === 'fr' ? 'Sommet' : 'Vertex';
    }
    if (label.includes('Root') || label.includes('Zero')) {
      return lang === 'zh' ? '实数零点' : lang === 'es' ? 'Raíz / Cero' : lang === 'fr' ? 'Racine' : lang === 'pt' ? 'Raiz / Zero' : 'Root / Zero';
    }
    if (label.includes('y-intercept')) {
      return lang === 'zh' ? 'y轴截距' : lang === 'es' ? 'Corte en y' : lang === 'fr' ? 'Ordonnée origine' : lang === 'pt' ? 'Interseção em y' : 'y-intercept';
    }
    return label;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Table className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {lang === 'zh'
                ? '抛物线坐标点对应表 (TI-84 / 绘图坐标)'
                : lang === 'es'
                ? 'Tabla de Valores (x, y) y Coordenadas'
                : lang === 'fr'
                ? 'Tableau de Valeurs (x, y) & Coordonnées'
                : lang === 'pt'
                ? 'Tabela de Valores (x, y) e Coordenadas'
                : 'Table of Values (x, y) & Graphing Coordinates'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'zh'
                ? '以顶点为中心的 7 组核心坐标点'
                : lang === 'es'
                ? '7 puntos clave centrados en el vértice'
                : lang === 'fr'
                ? '7 points clés centrés autour du sommet'
                : lang === 'pt'
                ? '7 pontos-chave centrados no vértice'
                : 'Key 7 points centered around the vertex'}
            </p>
          </div>
        </div>

        <button
          onClick={copyTable}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 transition shadow-2xs cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>
            {copied
              ? (lang === 'zh' ? '已复制' : lang === 'es' ? '¡Copiado!' : lang === 'fr' ? 'Copié !' : lang === 'pt' ? 'Copiado!' : 'Copied')
              : (lang === 'zh' ? '复制表格' : lang === 'es' ? 'Copiar Puntos' : lang === 'fr' ? 'Copier Points' : lang === 'pt' ? 'Copiar Pontos' : 'Copy Points')}
          </span>
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-center text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3 font-mono">x</th>
              <th className="p-3 font-mono">y = f(x)</th>
              <th className="p-3 font-sans">
                {lang === 'zh'
                  ? '几何特征'
                  : lang === 'es'
                  ? 'Propiedad'
                  : lang === 'fr'
                  ? 'Caractéristique'
                  : lang === 'pt'
                  ? 'Propriedade'
                  : 'Landmark'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableOfValues.map((pt, idx) => {
              const isVertex = pt.label === 'Vertex';
              return (
                <tr
                  key={idx}
                  className={`transition ${isVertex ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/50'}`}
                >
                  <td className="p-2.5 font-mono text-slate-900">{pt.x}</td>
                  <td className="p-2.5 font-mono text-indigo-700 font-semibold">{pt.y}</td>
                  <td className="p-2.5">
                    {pt.label ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isVertex
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : pt.label.includes('Root')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-sky-100 text-sky-800 border border-sky-300'
                        }`}
                      >
                        {getLabelText(pt.label)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
