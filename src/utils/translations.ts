/**
 * Multi-Language Translations Engine
 * Supports: English ('en'), Spanish ('es'), French ('fr'), Portuguese ('pt'), Chinese ('zh')
 */

import { RootNatureType } from './mathEngine';

export type SupportedLang = 'en' | 'es' | 'fr' | 'pt' | 'zh';

export interface LangItem {
  code: SupportedLang;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LangItem[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
];

export function detectUserLanguage(): SupportedLang {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && ['en', 'es', 'fr', 'pt', 'zh'].includes(urlLang)) {
      return urlLang as SupportedLang;
    }
    const saved = localStorage.getItem('user_lang_pref');
    if (saved && ['en', 'es', 'fr', 'pt', 'zh'].includes(saved)) {
      return saved as SupportedLang;
    }
  } catch {
    // fallback
  }
  return 'en';
}

export function saveUserLanguage(lang: SupportedLang) {
  try {
    localStorage.setItem('user_lang_pref', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  } catch {
    // ignore
  }
}

export const T = {
  // Brand & Header
  brandTitle: {
    en: 'Quadratic Discriminant Calculator',
    es: 'Calculadora de Discriminante Cuadrático',
    fr: 'Calculateur de Discriminant Quadratique',
    pt: 'Calculadora do Discriminante (Bhaskara)',
    zh: '一元二次方程判别式与配方法解题器',
  },
  brandSubtitle: {
    en: 'Δ = b² - 4ac • Completing the Square • Factoring • Parabola Graph',
    es: 'Δ = b² - 4ac • Completar el Cuadrado • Factorización • Gráfica',
    fr: 'Δ = b² - 4ac • Forme Canonique • Factorisation • Parabole',
    pt: 'Δ = b² - 4ac • Fórmula de Bhaskara • Completar Quadrados • Gráfico',
    zh: '判别式前置诊断 • 8步配方法拆解 • 十字相乘法 • 抛物线图像与表格',
  },
  badgeLevel: {
    en: 'US Curriculum & SAT Standard',
    es: 'Álgebra de Secundaria y Bachillerato',
    fr: 'Mathématiques Collège & Lycée',
    pt: 'Fórmula de Bhaskara • ENEM & Vestibulares',
    zh: '初高中代数与SAT标化考试规范',
  },
  heroTitle: {
    en: 'Quadratic Discriminant Calculator & Step-by-Step Solver',
    es: 'Calculadora de Discriminante y Resolución Paso a Paso',
    fr: 'Calculateur de Discriminant et Résolution Étape par Étape',
    pt: 'Calculadora do Discriminante Delta e Resolução Passo a Passo',
    zh: '一元二次方程判别式计算器与配方法全解',
  },
  heroDesc: {
    en: 'Calculate Δ = b² - 4ac, determine the nature of roots (two distinct real, one double root, or complex conjugate roots), and solve with step-by-step Completing the Square, AC Factoring, Quadratic Formula, and interactive Parabola graph with coordinates table.',
    es: 'Calcula Δ = b² - 4ac, determina la naturaleza de las raíces (dos reales distintas, raíz doble o raíces complejas) y resuelve paso a paso completando el cuadrado, fórmula general y gráfica interactiva con tabla de coordenadas.',
    fr: 'Calculez Δ = b² - 4ac, déterminez la nature des racines (deux réelles distinctes, une double ou complexes conjuguées) et résolvez étape par étape avec la forme canonique, factorisation, formule quadratique et parabole.',
    pt: 'Calcule Δ = b² - 4ac, determine a natureza das raízes (duas reais distintas, raiz dupla ou raízes complexas) e resolva passo a passo completando quadrados, Fórmula de Bhaskara e gráfico da parábola com tabela de pontos.',
    zh: '在线求解一元二次方程，计算判别式 Δ = b² - 4ac 预判根的个数与实虚性；提供配方法 8 步全解、十字相乘因式分解、韦达定理与抛物线坐标表。',
  },

  // Tabs
  tabCalc: {
    en: 'Calculator & Graph',
    es: 'Calculadora y Gráfica',
    fr: 'Calculateur & Graphe',
    pt: 'Calculadora e Gráfico',
    zh: '计算器与图像',
  },
  tabSquare: {
    en: 'Completing Square',
    es: 'Completar Cuadrado',
    fr: 'Forme Canonique',
    pt: 'Completar Quadrados',
    zh: '配方法拆解',
  },
  tabMethods: {
    en: 'All 4 Methods',
    es: 'Los 4 Métodos',
    fr: 'Les 4 Méthodes',
    pt: 'Os 4 Métodos (Bhaskara)',
    zh: '四大解法对比',
  },
  tabQuiz: {
    en: 'Quiz Challenge',
    es: 'Práctica Rápida',
    fr: 'Défi Quiz',
    pt: 'Desafio Rápido',
    zh: '速决刷题测试',
  },
  tabGuide: {
    en: 'FAQ & Guide',
    es: 'Guía y Preguntas',
    fr: 'Guide & FAQ',
    pt: 'Guia e Dúvidas',
    zh: '指南与FAQ',
  },

  // Controls
  printBtn: {
    en: 'Print Worksheet',
    es: 'Imprimir Tarea',
    fr: 'Imprimer Fiche',
    pt: 'Imprimir Atividade',
    zh: '打印讲义',
  },
  shareBtn: {
    en: 'Share Link',
    es: 'Copiar Enlace',
    fr: 'Partager Lien',
    pt: 'Copiar Link',
    zh: '复制链接',
  },
  copiedNotice: {
    en: 'Copied to Clipboard!',
    es: '¡Copiado al Portapapeles!',
    fr: 'Copié dans le Presse-papiers !',
    pt: 'Copiado para a Área de Transferência!',
    zh: '已复制到剪贴板！',
  },

  // Input Box
  inputTitle: {
    en: 'Quadratic Equation Input',
    es: 'Entrada de la Ecuación Cuadrática',
    fr: 'Saisie de l’Équation du Second Degré',
    pt: 'Entrada da Equação do 2º Grau',
    zh: '一元二次方程快速输入',
  },
  inputDesc: {
    en: 'Enter coefficients (supports fractions like 1/2 or decimals) or paste any equation.',
    es: 'Introduce coeficientes (acepta fracciones como 1/2 o decimales) o pega una ecuación.',
    fr: 'Entrez les coefficients (fractions comme 1/2 ou décimaux acceptés) ou collez l’équation.',
    pt: 'Insira coeficientes (aceita frações como 1/2 ou decimais) ou cole uma equação.',
    zh: '输入各项系数（支持 1/2 等分数或小数输入）或直接粘贴方程。',
  },
  modeSliders: {
    en: 'Coefficients (a, b, c)',
    es: 'Coeficientes (a, b, c)',
    fr: 'Coefficients (a, b, c)',
    pt: 'Coeficientes (a, b, c)',
    zh: '系数调节器 (a, b, c)',
  },
  modeType: {
    en: 'Type Formula',
    es: 'Escribir Ecuación',
    fr: 'Saisie Texte',
    pt: 'Digitar Equação',
    zh: '自由文本输入',
  },
  resetBtn: {
    en: 'Reset Equation',
    es: 'Restablecer Ecuación',
    fr: 'Réinitialiser',
    pt: 'Restaurar Equação',
    zh: '重置方程',
  },
  currentEqLabel: {
    en: 'Current Equation:',
    es: 'Ecuación Actual:',
    fr: 'Équation en Cours :',
    pt: 'Equação Atual:',
    zh: '当前解题方程：',
  },

  // Discriminant Card
  deltaCardTitle: {
    en: 'The Discriminant (Δ = b² - 4ac)',
    es: 'El Discriminante (Δ = b² - 4ac)',
    fr: 'Le Discriminant (Δ = b² - 4ac)',
    pt: 'O Discriminante Delta (Δ = b² - 4ac)',
    zh: '判别式计算与性质诊断 (Δ = b² - 4ac)',
  },
  deltaCardSubtitle: {
    en: 'Algebra root nature and geometric crossing indicator',
    es: 'Indicador de la naturaleza de raíces e intersecciones geométricas',
    fr: 'Indicateur de la nature des racines et intersections avec l’axe des x',
    pt: 'Indicador do tipo de raízes e interseções com o eixo x',
    zh: '方程前置诊断：一秒判断解的个数、实虚性及几何交点',
  },
  deltaValueLabel: {
    en: 'Discriminant Value',
    es: 'Valor de Delta',
    fr: 'Valeur du Delta',
    pt: 'Valor de Delta',
    zh: '判别式计算数值',
  },
  substitutionLabel: {
    en: 'Step-by-Step Substitution',
    es: 'Sustitución Paso a Paso',
    fr: 'Substitution Pas à Pas',
    pt: 'Substituição Passo a Passo',
    zh: '数值代入与计算',
  },
  conclusionLabel: {
    en: 'Root Classification',
    es: 'Clasificación de Raíces',
    fr: 'Classification des Racines',
    pt: 'Classificação das Raízes',
    zh: '根的判别结论',
  },

  // Completing the Square
  squareTitle: {
    en: 'Completing the Square — Step-by-Step Breakdown',
    es: 'Completar el Cuadrado — Explicación Paso a Paso',
    fr: 'Forme Canonique — Résolution Étape par Étape',
    pt: 'Completando o Quadrado — Passo a Passo Detalhado',
    zh: '配方法全流程详细拆解过程',
  },
  squareSubtitle: {
    en: 'Standard algebraic method used across US High School Math',
    es: 'Método algebraico estándar de secundaria y preparatoria',
    fr: 'Méthode de référence pour trouver la forme canonique et les zéros',
    pt: 'Método padrão para encontrar a forma canônica e raízes',
    zh: '代数核心解题法：移项、化一、加配方常数、开方',
  },
  showAllSteps: {
    en: 'Show All Steps',
    es: 'Mostrar Todos los Pasos',
    fr: 'Tous les Pas',
    pt: 'Mostrar Tudo',
    zh: '展开全部步骤',
  },
  guidedSteps: {
    en: 'Step-by-Step Guide',
    es: 'Guía Interactiva',
    fr: 'Guide Interactif',
    pt: 'Guia Passo a Passo',
    zh: '逐步讲解模式',
  },
  nextStep: {
    en: 'Next Step',
    es: 'Siguiente Paso',
    fr: 'Étape Suivante',
    pt: 'Próximo Passo',
    zh: '下一步',
  },
  prevStep: {
    en: 'Previous',
    es: 'Anterior',
    fr: 'Précédent',
    pt: 'Anterior',
    zh: '上一步',
  },

  // Formula View
  formulaTitle: {
    en: 'Quadratic Formula Solution (Exact & Decimal)',
    es: 'Fórmula General Cuadrática (Exacta y Decimal)',
    fr: 'Formule Quadratique (Valeurs Exactes et Décimales)',
    pt: 'Fórmula de Bhaskara (Valores Exatos e Decimais)',
    zh: '求根公式代入与精确解（含最简根式）',
  },
  formulaSubtitle: {
    en: 'Universal formula: x = (-b ± √Δ) / 2a',
    es: 'Fórmula general: x = (-b ± √Δ) / 2a',
    fr: 'Formule générale : x = (-b ± √Δ) / 2a',
    pt: 'Fórmula de Bhaskara: x = (-b ± √Δ) / 2a',
    zh: '万能公式代入计算、根号因数化简及最简分式约分',
  },
  exactSolutionsLabel: {
    en: 'Exact Simplified Solutions',
    es: 'Soluciones Exactas Simplificadas',
    fr: 'Solutions Exactes Simplifiées',
    pt: 'Raízes Exatas Simplificadas',
    zh: '解析精确解',
  },
  decimalApproxLabel: {
    en: 'Decimal Approximations',
    es: 'Aproximaciones Decimales',
    fr: 'Approximations Décimales',
    pt: 'Aproximações Decimais',
    zh: '四位小数近似值',
  },

  // Parabola Graph
  graphTitle: {
    en: 'Interactive Parabola & Geometry',
    es: 'Parábola Interactiva y Geometría',
    fr: 'Parabole Interactive & Géométrie',
    pt: 'Parábola Interativa e Geometria',
    zh: '交互式抛物线图像与几何交点',
  },
  vertexLabel: {
    en: 'Vertex (h, k)',
    es: 'Vértice (h, k)',
    fr: 'Sommet (h, k)',
    pt: 'Vértice (h, k)',
    zh: '顶点 (h, k)',
  },
  axisLabel: {
    en: 'Axis of Symmetry',
    es: 'Eje de Simetría',
    fr: 'Axe de Symétrie',
    pt: 'Eixo de Simetria',
    zh: '对称轴',
  },
  rootsLabel: {
    en: 'Roots (x-intercepts)',
    es: 'Raíces (Puntos en x)',
    fr: 'Racines (Intersections x)',
    pt: 'Raízes (Interseções x)',
    zh: '实数根 (x轴截距)',
  },
  yIntLabel: {
    en: 'y-intercept (0, c)',
    es: 'Intersección con y (0, c)',
    fr: 'Ordonnée à l’origine (0, c)',
    pt: 'Interseção no eixo y (0, c)',
    zh: 'y轴截距 (0, c)',
  },
  coeffQuadratic: {
    en: 'Quadratic Coefficient (a)',
    es: 'Coeficiente Cuadrático (a)',
    fr: 'Coefficient Quadratique (a)',
    pt: 'Coeficiente Quadrático (a)',
    zh: '二次项系数 (a)',
  },
  coeffLinear: {
    en: 'Linear Coefficient (b)',
    es: 'Coeficiente Lineal (b)',
    fr: 'Coefficient Linéaire (b)',
    pt: 'Coeficiente Linear (b)',
    zh: '一次项系数 (b)',
  },
  coeffConstant: {
    en: 'Constant Term (c)',
    es: 'Término Independiente (c)',
    fr: 'Terme Constant (c)',
    pt: 'Termo Constante (c)',
    zh: '常数项 (c)',
  },
  presetsTitle: {
    en: 'Curriculum Presets & Real-World Examples',
    es: 'Ejemplos y Casos de Estudio',
    fr: 'Exemples & Modèles d’Étude',
    pt: 'Exemplos Práticos e Curriculares',
    zh: '典型代数考题与现实物理预设',
  },
};

/**
 * Root Nature Title by Language
 */
export function getRootNatureTitle(nature: RootNatureType, lang: SupportedLang): string {
  const titles: Record<RootNatureType, Record<SupportedLang, string>> = {
    'two-real-rational': {
      en: 'Two Distinct Rational Real Roots',
      es: 'Dos Raíces Reales Racionales Distintas',
      fr: 'Deux Racines Réelles Rationnelles Distinctes',
      pt: 'Duas Raízes Reais Racionais Distintas',
      zh: '两个不相等的有理数实根',
    },
    'two-real-irrational': {
      en: 'Two Distinct Irrational Real Roots',
      es: 'Dos Raíces Reales Irracionales Distintas',
      fr: 'Deux Racines Réelles Irrationnelles Distinctes',
      pt: 'Duas Raízes Reais Irracionais Distintas',
      zh: '两个不相等的无理数实根',
    },
    'one-real-double': {
      en: 'One Repeated Real Root (Double Root)',
      es: 'Una Raíz Real Doble (Solución Única)',
      fr: 'Une Racine Réelle Double (Solution Unique)',
      pt: 'Uma Raiz Real Dupla (Solução Única)',
      zh: '两个相等的实根（重根 / 唯一解）',
    },
    'two-complex': {
      en: 'Two Complex Conjugate Roots (No Real Solutions)',
      es: 'Dos Raíces Complejas Conjugadas (Sin Soluciones Reales)',
      fr: 'Deux Racines Complexes Conjuguées (Pas de Solution Réelle)',
      pt: 'Duas Raízes Complexas Conjugadas (Sem Raízes Reais)',
      zh: '无实数解（两个共轭复数根）',
    },
  };
  return titles[nature]?.[lang] || titles[nature]?.en;
}

/**
 * Completing the Square Step Titles by Language
 */
export function getSquareStepTitle(stepNumber: number, a: number, lang: SupportedLang): string {
  const titles: Record<number, Record<SupportedLang, string>> = {
    1: {
      en: '1. Start with the Standard Form',
      es: '1. Escribir en Forma Estándar',
      fr: '1. Partir de la Forme Standard',
      pt: '1. Escrever na Forma Padrão',
      zh: '第一步：整理为标准形式',
    },
    2: {
      en: '2. Isolate Variable Terms (Move Constant to Right)',
      es: '2. Aislar Términos con Variables (Mover Constante)',
      fr: '2. Isoler les Variables (Déplacer la Constante)',
      pt: '2. Isolar as Variáveis (Mover Constante)',
      zh: '第二步：移项（常数项移到等号右边）',
    },
    3: {
      en: `3. Make Leading Coefficient 1 (Divide by a = ${a})`,
      es: `3. Coeficiente Principal Igual a 1 (Dividir entre a = ${a})`,
      fr: `3. Rendre le Coeff Principal Égal à 1 (Diviser par a = ${a})`,
      pt: `3. Tornar o Coeficiente Principal Igual a 1 (Dividir por a = ${a})`,
      zh: `第三步：二次项系数化为 1（两边除以 a = ${a}）`,
    },
    4: {
      en: '4. Calculate the Completing Term: (b / 2a)²',
      es: '4. Calcular el Término para Completar: (b / 2a)²',
      fr: '4. Calculer le Terme Canonique : (b / 2a)²',
      pt: '4. Calcular o Termo do Quadrado Perfeito: (b / 2a)²',
      zh: '第四步：计算配方常数项 [(一次项系数 / 2)²]',
    },
    5: {
      en: '5. Add the Completing Term to BOTH Sides',
      es: '5. Sumar el Término a AMBOS Lados',
      fr: '5. Ajouter le Terme aux DEUX Côtés',
      pt: '5. Somar o Termo em AMBOS os Lados',
      zh: '第五步：等式两边同时加上配方常数',
    },
    6: {
      en: '6. Write the Left Side as a Binomial Square',
      es: '6. Expresar como Binomio al Cuadrado',
      fr: '6. Écrire sous Forme de Carré Parfait',
      pt: '6. Fatorar como Quadrado Perfeito',
      zh: '第六步：左侧因式分解为完全平方式',
    },
    7: {
      en: '7. Apply Square Root Property (Take ±√)',
      es: '7. Aplicar Propiedad de Raíz Cuadrada (Tomar ±√)',
      fr: '7. Prendre la Racine Carrée (±√)',
      pt: '7. Aplicar Propriedade da Raiz Quadrada (Tirar ±√)',
      zh: '第七步：两边开平方（运用平方根性质）',
    },
    8: {
      en: '8. Isolate x for the Final Solution(s)',
      es: '8. Despejar x para las Soluciones Finales',
      fr: '8. Isoler x pour les Solutions Finales',
      pt: '8. Isolar x para Encontrar as Raízes',
      zh: '第八步：解出 x（得到最终根）',
    },
  };

  return titles[stepNumber]?.[lang] || titles[stepNumber]?.en;
}
