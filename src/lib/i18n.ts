/**
 * Diccionario de UI y copy editorial en los 4 idiomas del sitio.
 * Módulo autónomo (NO importa el bundle de contenido) para que los client
 * components puedan importarlo sin arrastrar los bundles al navegador.
 *
 * Los stems/opciones de las preguntas NO se localizan: el examen real se
 * rinde en inglés. Se localiza la capa de enseñanza (UI, explicaciones,
 * temario), que viaja en los bundles por idioma — no aquí.
 */

export const LOCALES = ["es", "en", "fr", "ja"] as const;
export type Lang = (typeof LOCALES)[number];

export const LANG_NAMES: Record<Lang, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  ja: "日本語",
};

/** Locale BCP-47 para toLocaleDateString y <html lang>. */
export const LANG_TAGS: Record<Lang, string> = { es: "es", en: "en", fr: "fr", ja: "ja" };

export const isLang = (x: string): x is Lang => (LOCALES as readonly string[]).includes(x);

export const CERT_ROLES: Record<string, string> = {
  "CCAO-F": "Associate",
  "CCDV-F": "Developer",
  "CCAR-F": "Architect",
  "CCAR-P": "Architect",
};
export const CERT_LEVELS: Record<string, "Foundations" | "Professional"> = {
  "CCAO-F": "Foundations",
  "CCDV-F": "Foundations",
  "CCAR-F": "Foundations",
  "CCAR-P": "Professional",
};
export const CERT_FEES: Record<string, number> = {
  "CCAO-F": 99,
  "CCDV-F": 125,
  "CCAR-F": 125,
  "CCAR-P": 175,
};

type PlanItem = { code: string; weeks: string; why: string; focus: string };
type Truth = { t: string; d: string };
type HowStep = { n: string; t: string; d: string };
type WhereItem = [string, string];

export type Dict = {
  meta: {
    siteTitle: string;
    template: string;
    description: string;
    ogDescription: string;
  };
  nav: { skip: string; ruta: string; coffee: string; themeToLight: string; themeToDark: string; brand: string };
  langSwitcher: string;
  footer: {
    blurb: string;
    disclaimer: string;
    certsLabel: string;
    linksLabel: string;
    rutaLink: string;
    coffeeLink: string;
    officialReg: string;
    pearson: string;
  };
  banner: { title: string; sub: string; groupLabel: string; tierTitleLive: (tag: string) => string; tierTitlePending: (tag: string) => string };
  tierTags: { 5: string; 10: string; 20: string };
  certTagline: Record<string, string>;
  home: {
    badge: string;
    h1a: string;
    h1b: string;
    h1c: string;
    heroPara: (practice: number) => string;
    ctaAssociate: string;
    ctaRoute: string;
    statQuestions: string;
    statOfficial: (n: number) => string;
    statDomains: string;
    statObjectives: (n: number) => string;
    statWords: string;
    statWordsSub: string;
    statCost: string;
    statCostSub: string;
    fichaKicker: string;
    ficha: [string, string][];
    credsTitle: string;
    credsKicker: string;
    items: (n: number) => string;
    domains: (n: number) => string;
    questionsHere: (n: number) => string;
    heaviest: (d: number, w: number) => string;
    study: string;
    howTitle: string;
    howSteps: HowStep[];
    donateKicker: string;
    donateTitle: string;
    donatePara: string;
    donateCta: string;
  };
  cert: {
    practicar: (n: number) => string;
    simulacro: string;
    decodificador: string;
    fichaLabels: [string, string, string, string, string, string];
    whereTitle: string;
    whereKicker: string;
    wherePara: (top3: string, pct: string) => [string, string, string];
    domainLabel: (n: number) => string;
    objectivesCount: (n: number) => string;
    examItems: (n: number) => string;
    questionsHere: (n: number) => string;
    forWhoTitle: string;
    mqcLabel: string;
    notForLabel: string;
    rulesTitle: string;
    ruleKeys: [string, string, string, string, string];
    logisticsCta: string;
    sourceLabel: string;
    metaDescription: (nameEs: string, domains: number, questions: number, items: number, minutes: number) => string;
  };
  domain: {
    breadcrumb: (n: number) => string;
    domainOf: (n: number, total: number) => string;
    itemsOf: (est: number, total: number) => string;
    objectivesKicker: string;
    notPublished: string;
    untranslated: string;
    thisDomain: string;
    weight: string;
    estItems: string;
    objectives: string;
    questions: string;
    reading: string;
    readingMin: (min: number) => string;
    practiceDomain: string;
    otherDomains: string;
    prev: (n: number, w: number) => string;
    next: (n: number, w: number) => string;
    metaTitle: (n: number, title: string, w: number, code: string) => string;
    metaDescription: (n: number, code: string, objectives: number) => string;
  };
  decoder: {
    breadcrumb: string;
    title: string;
    intro: (code: string, n: number) => string;
    notYet: string;
    untranslated: string;
    dissectTitle: string;
    dissectPara: (n: number) => string;
    seeDissection: string;
    officialRationale: string;
    teaches: string;
    trap: string;
    applyPractice: string;
    backTo: (code: string) => string;
    metaTitle: (code: string) => string;
    metaDescription: (name: string) => string;
  };
  logistics: {
    breadcrumb: string;
    title: string;
    intro: (code: string) => string;
    regTitle: string;
    officialRegCta: string;
    rulesTitle: string;
    prepTitle: string;
    practice: string;
    backTo: (code: string) => string;
    metaTitle: (code: string) => string;
    metaDescription: (name: string) => string;
  };
  practice: {
    breadcrumb: string;
    title: string;
    titleRunning: (cert: string) => string;
    sub: (certName: string) => string;
    domainsKicker: string;
    all: string;
    none: string;
    top3: string;
    top3Title: string;
    filterKicker: string;
    filters: { all: string; unseen: string; failed: string; official: string };
    howMany: string;
    allSizeLabel: string;
    inSession: (of: number) => string;
    start: string;
    changeSelection: string;
    loading: string;
    metaTitle: (code: string) => string;
    metaDescription: (name: string) => string;
  };
  quiz: {
    noQuestions: string;
    of: string;
    flag: string;
    flagged: string;
    answered: (n: number) => string;
    scenario: string;
    multiResponse: string;
    officialBadge: string;
    officialTooltip: string;
    diff: { easy: string; medium: string; hard: string };
    correct: string;
    incorrect: (keys: string) => string;
    officialRationaleLabel: string;
    whyFail: string;
    trap: string;
    objective: string;
    prev: string;
    check: string;
    next: string;
    finish: string;
    deliver: string;
    confirmDeliver: (answered: number, total: number) => string;
    navigation: string;
    goTo: (n: number, answered: boolean) => string;
    resultMock: string;
    resultPractice: string;
    scaledLabel: string;
    hits: (pct: number) => string;
    timeSpent: string;
    abovePass: (pass: number) => string;
    belowPass: (pass: number) => string;
    scaledNote1: string;
    scaledNoteStrong: string;
    scaledNote2: string;
    byDomain: string;
    reviewChapter: (d: number) => string;
    reviewTitle: (n: number) => string;
    anotherRound: string;
    backTo: (cert: string) => string;
  };
  mock: {
    breadcrumb: string;
    title: string;
    sub: (items: number, certName: string, minutes: number) => string;
    mixKicker: string;
    itemsPct: (items: number, weight: number) => string;
    shortfall: (list: string) => string;
    stats: { items: string; time: string; timeValue: (m: number) => string; pass: string; feedback: string; feedbackValue: string };
    start: string;
    timerNote: (m: number) => string;
    historyTitle: string;
    raw: (correct: number, total: number, pct: number) => string;
    minutes: (m: number) => string;
    metaTitle: (code: string) => string;
    metaDescription: (name: string, items: number, minutes: number) => string;
  };
  flashcards: {
    title: string;
    cards: string;
    table: string;
    termOf: (i: number, n: number) => string;
    reveal: string;
    flipAria: string;
    colEn: string;
    colLocal: string;
    colMeaning: string;
  };
  checklist: { kicker: string; progress: (done: number, total: number) => string; mastered: string; hint: string };
  markRead: { done: string; mark: string };
  domainProgress: { read: string; noData: string };
  dash: {
    emptyTitle: string;
    emptyPara: string;
    emptyCta: string;
    title: string;
    clear: string;
    confirmClear: string;
    statAnswered: string;
    statAccuracy: string;
    statChapters: string;
    statMocks: string;
    chapters: string;
    pctOf: (pct: number, total: number) => string;
    lastMockTitle: string;
  };
  ruta: {
    kicker: string;
    title: (fee: number) => string;
    intro: string;
    orderTitle: string;
    plan: PlanItem[];
    hoursLabel: string;
    temario: string;
    truthsTitle: string;
    truths: Truth[];
    metaTitle: string;
    metaDescription: string;
  };
  donar: {
    kicker: string;
    title: string;
    intro: (questions: number) => string;
    mathKicker: string;
    math1a: string;
    math1b: (fee: number) => string;
    math1c: string;
    math2: string;
    payOnce: string;
    stripeGo: string;
    orAnyAmount: string;
    soon: string;
    pendingKicker: string;
    pendingPara1: string;
    pendingPara2: string;
    stripeNote: string;
    whereTitle: string;
    where: WhereItem[];
    otherTitle: string;
    other: string[];
    backCta: string;
    metaTitle: string;
    metaDescription: string;
  };
};

/* ================================================================== ES */

const es: Dict = {
  meta: {
    siteTitle: "Guía de certificaciones Claude — preparación en español",
    template: "%s · Guía de certificaciones Claude",
    description:
      "Preparación completa y gratuita para las cuatro certificaciones oficiales de Anthropic: Associate, Developer y Architect (Foundations y Professional). Temario por dominio, banco de preguntas, simulacros con el blueprint real.",
    ogDescription:
      "Temario por dominio, banco de preguntas y simulacros para las 4 certificaciones oficiales de Anthropic. Gratis.",
  },
  nav: {
    skip: "Saltar al contenido",
    ruta: "Ruta",
    coffee: "☕ Invítame un café",
    themeToLight: "Cambiar a modo claro",
    themeToDark: "Cambiar a modo oscuro",
    brand: "Certificaciones Claude",
  },
  langSwitcher: "Idioma",
  footer: {
    blurb:
      "Material de estudio gratuito para las cuatro certificaciones de Anthropic. Construido sobre los exam guides oficiales v1.0 (julio 2026) y la documentación pública de Anthropic.",
    disclaimer:
      "Proyecto independiente. No está afiliado, patrocinado ni avalado por Anthropic. “Claude” es marca de Anthropic PBC.",
    certsLabel: "Certificaciones",
    linksLabel: "Enlaces",
    rutaLink: "Ruta de estudio",
    coffeeLink: "Invítame un café",
    officialReg: "Registro oficial ↗",
    pearson: "Pearson VUE ↗",
  },
  banner: {
    title: "¿Te agrada el contenido? Invítame un café.",
    sub: "La guía es gratis y lo seguirá siendo — el café financia mantenerla al día con cada versión de los exam guides.",
    groupLabel: "Montos de apoyo",
    tierTitleLive: (tag) => `${tag} — pago único vía Stripe`,
    tierTitlePending: (tag) => `${tag} — ver opciones de apoyo`,
  },
  tierTags: { 5: "Un café", 10: "Café para dos", 20: "Café del mes" },
  certTagline: {
    "CCAO-F": "Usar Claude para trabajo real de negocio: prompts, evaluación del output, Projects, riesgo y escalamiento.",
    "CCDV-F": "Construir contra la API: Messages, batches, caching, streaming, tools, MCP y agentes.",
    "CCAR-F": "Diseñar sistemas agénticos de producción: orquestación, MCP, Claude Code, structured output, contexto.",
    "CCAR-P": "Arquitectura de solución end-to-end: integración, evaluación, governance, stakeholders, ciclo de vida.",
  },
  home: {
    badge: "Exam guides oficiales v1.0 · Efectivos julio 2026",
    h1a: "Las cuatro certificaciones de Claude,",
    h1b: " estudiadas a fondo",
    h1c: " y en tu idioma.",
    heroPara: (practice) =>
      `Anthropic publica el blueprint de cada examen y unas pocas preguntas de ejemplo. Aquí está todo lo demás: cada objetivo oficial desarrollado, ${practice} preguntas de práctica escritas contra esos objetivos y verificadas una por una, simulacros con la mezcla real de dominios, y el patrón con el que están construidos los distractores.`,
    ctaAssociate: "Empezar por Associate",
    ctaRoute: "Ver la ruta completa",
    statQuestions: "Preguntas",
    statOfficial: (n) => `${n} oficiales`,
    statDomains: "Dominios",
    statObjectives: (n) => `${n} objetivos`,
    statWords: "Palabras",
    statWordsSub: "de temario",
    statCost: "Costo total",
    statCostSub: "los 4 exámenes",
    fichaKicker: "Lo que hay que saber antes de pagar",
    ficha: [
      ["Corte", "720 / 1000 escalado — NO es 72% de aciertos. El mapeo raw→escalado no es público."],
      ["Formato", "Multiple choice y multiple response. 120 minutos. Proctored (Pearson VUE, online o centro)."],
      ["Prerrequisitos", "Ninguno. Los cuatro exámenes son independientes: puedes tomarlos en el orden que quieras."],
      ["Reintentos", "Hasta 4 por examen en 12 meses rodantes. Esperas de 14, 30 y 90 días. Cada intento se paga."],
      ["Vigencia", "12 meses. La renovación a tiempo es gratis; si caduca, pagas el examen completo otra vez."],
    ],
    credsTitle: "Las cuatro credenciales",
    credsKicker: "Elige por rol, no por prestigio",
    items: (n) => `${n} ítems`,
    domains: (n) => `${n} dominios`,
    questionsHere: (n) => `${n} preguntas aquí`,
    heaviest: (d, w) => `El más pesado: D${d} (${w}%)`,
    study: "Estudiar →",
    howTitle: "Cómo usar esto",
    howSteps: [
      {
        n: "01",
        t: "Lee el decodificador antes que el temario",
        d: "Cada examen tiene un patrón de construcción. Las preguntas oficiales lo revelan: hay un arquetipo de respuesta correcta y cuatro arquetipos de distractor. Reconocerlos te resuelve los ítems que no sabes de memoria.",
      },
      {
        n: "02",
        t: "Ataca los dominios por peso, no por orden",
        d: "En Associate, tres dominios son la mitad del examen. En Developer, uno solo pesa 33%. Estudiar el dominio 1 primero porque es el primero es desperdiciar horas: el sitio ordena por impacto.",
      },
      {
        n: "03",
        t: "Practica primero, simula al final",
        d: "El modo práctica te da la explicación y el análisis de cada distractor al instante. El simulacro replica el blueprint real con cronómetro y sin feedback, y te devuelve el desglose por dominio.",
      },
    ],
    donateKicker: "Gratis, y sin muro de pago",
    donateTitle: "Si te ahorra una reprobada, te ahorró más de lo que cuesta un café.",
    donatePara:
      "Todo el material es gratuito y lo seguirá siendo. Un reintento del examen Architect cuesta $125. Si esta guía te evita ese golpe, cinco dólares son un intercambio decente — y financian que el temario siga actualizado cuando Anthropic publique la v1.1.",
    donateCta: "☕ Invítame un café",
  },
  cert: {
    practicar: (n) => `Practicar · ${n} preguntas`,
    simulacro: "Simulacro cronometrado",
    decodificador: "Decodificador del examen",
    fichaLabels: ["Ítems", "Minutos", "Corte escalado", "Por intento", "Vigencia", "Dominios"],
    whereTitle: "Dónde está realmente el examen",
    whereKicker: "Ordenado por peso",
    wherePara: (top3, pct) => ["Tres dominios — ", ` — concentran el ${pct}% de los ítems.`, " Si tu tiempo es limitado, ahí es donde rinde cada hora."],
    domainLabel: (n) => `Dominio ${n}`,
    objectivesCount: (n) => `${n} objetivos oficiales`,
    examItems: (n) => `≈${n} ítems en el examen`,
    questionsHere: (n) => `${n} preguntas aquí`,
    forWhoTitle: "Para quién es",
    mqcLabel: "El candidato mínimamente calificado",
    notForLabel: "Para quién NO es",
    rulesTitle: "Reglas del juego",
    ruleKeys: ["Puntuación", "Reintentos", "Recertificación", "Prerrequisitos", "Idioma"],
    logisticsCta: "Registro, Pearson VUE y día del examen →",
    sourceLabel: "Fuente",
    metaDescription: (nameEs, domains, questions, items, minutes) =>
      `Guía completa para ${nameEs}: ${domains} dominios, ${questions} preguntas de práctica, simulacro con el blueprint oficial. ${items} ítems, ${minutes} min, corte 720/1000.`,
  },
  domain: {
    breadcrumb: (n) => `Dominio ${n}`,
    domainOf: (n, total) => `Dominio ${n} de ${total}`,
    itemsOf: (est, total) => `≈${est} de los ${total} ítems`,
    objectivesKicker: "Objetivos oficiales · verbatim del exam guide",
    notPublished: "El capítulo de este dominio aún no está publicado.",
    untranslated: "Este capítulo aún no está traducido a este idioma; se muestra en español.",
    thisDomain: "Este dominio",
    weight: "Peso",
    estItems: "Ítems estimados",
    objectives: "Objetivos",
    questions: "Preguntas",
    reading: "Lectura",
    readingMin: (min) => `≈${min} min`,
    practiceDomain: "Practicar este dominio",
    otherDomains: "Otros dominios",
    prev: (n, w) => `← Dominio ${n} · ${w}%`,
    next: (n, w) => `Dominio ${n} · ${w}% →`,
    metaTitle: (n, title, w, code) => `D${n}: ${title} (${w}%) — ${code}`,
    metaDescription: (n, code, objectives) =>
      `Capítulo completo del dominio ${n} de ${code}: ${objectives} objetivos oficiales, conceptos clave, ejemplos, errores comunes, glosario y checklist.`,
  },
  decoder: {
    breadcrumb: "Decodificador",
    title: "El decodificador",
    intro: (code, n) =>
      `Un examen de opción múltiple no es una prueba de memoria: es un artefacto construido con reglas. Estas son las de ${code}, derivadas de las ${n} preguntas de ejemplo que Anthropic publicó y del lenguaje del exam guide.`,
    notYet: "Aún no publicado.",
    untranslated: "El decodificador aún no está traducido a este idioma; se muestra en español.",
    dissectTitle: "Las preguntas oficiales, diseccionadas",
    dissectPara: (n) =>
      `Estas ${n} son las únicas preguntas reales que Anthropic ha publicado para este examen. Valen más que cien inventadas: son la muestra de calibración.`,
    seeDissection: "Ver disección ↓",
    officialRationale: "Justificación oficial",
    teaches: "Qué te enseña",
    trap: "Trampa:",
    applyPractice: "Aplicarlo en práctica",
    backTo: (code) => `Volver a ${code}`,
    metaTitle: (code) => `Decodificador del examen — ${code}`,
    metaDescription: (name) =>
      `Cómo están construidos los ítems de ${name}: el arquetipo de respuesta correcta, los roles de los distractores y la técnica de eliminación.`,
  },
  logistics: {
    breadcrumb: "Logística",
    title: "Registro y día del examen",
    intro: (code) =>
      `Todo lo operativo de ${code}: desde el checkout en Partner Academy hasta las reglas que te pueden anular el examen si las rompes.`,
    regTitle: "Registro, paso a paso",
    officialRegCta: "Ir al registro oficial ↗",
    rulesTitle: "Reglas del día del examen",
    prepTitle: "Cómo prepararse, según Anthropic",
    practice: "Practicar",
    backTo: (code) => `Volver a ${code}`,
    metaTitle: (code) => `Registro y día del examen — ${code}`,
    metaDescription: (name) =>
      `Cómo registrarse, agendar en Pearson VUE, qué esperar el día del examen, reglas de conducta, reintentos y recertificación de ${name}.`,
  },
  practice: {
    breadcrumb: "Práctica",
    title: "Práctica dirigida",
    titleRunning: (cert) => `Práctica · ${cert}`,
    sub: (certName) => `Cada pregunta te devuelve la explicación y por qué falla cada distractor, en el momento. ${certName}.`,
    domainsKicker: "Dominios",
    all: "Todos",
    none: "Ninguno",
    top3: "Solo los 3 más pesados",
    top3Title: "Los tres dominios que más pesan en el examen",
    filterKicker: "Filtro",
    filters: { all: "Todas", unseen: "Sin ver", failed: "Falladas", official: "Oficiales" },
    howMany: "Cuántas preguntas",
    allSizeLabel: "Todas",
    inSession: (of) => `preguntas en esta sesión · de ${of} disponibles`,
    start: "Empezar",
    changeSelection: "← Cambiar selección",
    loading: "Cargando…",
    metaTitle: (code) => `Práctica — ${code}`,
    metaDescription: (name) => `Banco de preguntas de práctica de ${name}, con explicación y análisis de cada distractor.`,
  },
  quiz: {
    noQuestions: "No hay preguntas disponibles para esta selección.",
    of: "/",
    flag: "◇ Marcar",
    flagged: "◆ Marcada",
    answered: (n) => `${n} respondidas`,
    scenario: "Escenario:",
    multiResponse: "Respuesta múltiple",
    officialBadge: "★ Oficial",
    officialTooltip: "Pregunta de ejemplo publicada por Anthropic en el exam guide oficial",
    diff: { easy: "Fácil", medium: "Media", hard: "Difícil" },
    correct: "Correcto",
    incorrect: (keys) => `Incorrecto — la respuesta es ${keys}`,
    officialRationaleLabel: "Justificación oficial de Anthropic:",
    whyFail: "Por qué fallan las otras",
    trap: "Trampa:",
    objective: "Objetivo medido:",
    prev: "← Anterior",
    check: "Comprobar",
    next: "Siguiente →",
    finish: "Terminar y ver informe",
    deliver: "Entregar",
    confirmDeliver: (answered, total) => `¿Entregar el simulacro con ${answered} de ${total} respondidas?`,
    navigation: "Navegación",
    goTo: (n, answered) => `Ir a la pregunta ${n}${answered ? " (respondida)" : ""}`,
    resultMock: "Resultado del simulacro",
    resultPractice: "Resultado de la sesión",
    scaledLabel: "Escalado estimado · 100–1000",
    hits: (pct) => `Aciertos · ${pct}% crudo`,
    timeSpent: "Tiempo empleado",
    abovePass: (pass) => `Por encima del corte (${pass}) en esta simulación.`,
    belowPass: (pass) => `Por debajo del corte (${pass}) en esta simulación.`,
    scaledNote1: "Anthropic no publica el mapeo de aciertos crudos a escala 100–1000, así que este número es una",
    scaledNoteStrong: " estimación lineal",
    scaledNote2: ", no una predicción. Trátalo como semáforo, no como veredicto: apunta a ≥80% crudo antes de pagar el examen.",
    byDomain: "Desglose por dominio",
    reviewChapter: (d) => `→ Repasar el capítulo del dominio ${d}`,
    reviewTitle: (n) => `Revisión de las ${n} preguntas`,
    anotherRound: "Otra ronda",
    backTo: (cert) => `Volver a ${cert}`,
  },
  mock: {
    breadcrumb: "Simulacro",
    title: "Simulacro cronometrado",
    sub: (items, certName, minutes) =>
      `${items} ítems repartidos entre los dominios exactamente como los reparte el blueprint oficial de ${certName}. Cronómetro de ${minutes} minutos, sin feedback hasta entregar, opciones barajadas.`,
    mixKicker: "Mezcla de este simulacro",
    itemsPct: (items, weight) => `${items} ítems · ${weight}%`,
    shortfall: (list) =>
      `El banco todavía no tiene suficientes preguntas para llenar ${list} al 100% del blueprint; ese dominio va con las que hay.`,
    stats: {
      items: "Ítems",
      time: "Tiempo",
      timeValue: (m) => `${m} min`,
      pass: "Corte",
      feedback: "Feedback",
      feedbackValue: "Al entregar",
    },
    start: "Empezar simulacro",
    timerNote: (m) => `El cronómetro arranca al pulsar. Reserva ${m} minutos sin interrupciones — el examen real no se pausa.`,
    historyTitle: "Tus simulacros",
    raw: (correct, total, pct) => `${correct}/${total} · ${pct}% crudo`,
    minutes: (m) => `${m} min`,
    metaTitle: (code) => `Simulacro — ${code}`,
    metaDescription: (name, items, minutes) =>
      `Simulacro cronometrado de ${name}: ${items} ítems en ${minutes} minutos, con la mezcla de dominios del blueprint oficial.`,
  },
  flashcards: {
    title: "Glosario del dominio",
    cards: "Tarjetas",
    table: "Tabla",
    termOf: (i, n) => `Término ${i} de ${n}`,
    reveal: "Clic para revelar",
    flipAria: "Voltear tarjeta",
    colEn: "Término (EN)",
    colLocal: "Español",
    colMeaning: "Qué significa",
  },
  checklist: {
    kicker: "Checklist de dominio",
    progress: (done, total) => `${done} / ${total}`,
    mastered: "· dominado",
    hint: "Si no puedes marcar una casilla con honestidad, ahí está tu siguiente hora de estudio.",
  },
  markRead: { done: "✓ Capítulo leído", mark: "Marcar como leído" },
  domainProgress: { read: "✓ Leído", noData: "Sin datos" },
  dash: {
    emptyTitle: "Tu progreso aparecerá aquí",
    emptyPara:
      "En cuanto respondas la primera pregunta o marques un capítulo como leído, este panel se llena: precisión por dominio, capítulos cubiertos, historial de simulacros. Todo vive en tu navegador — sin cuenta, sin servidor.",
    emptyCta: "Responder la primera",
    title: "Tu progreso",
    clear: "Borrar todo",
    confirmClear: "¿Borrar todo tu progreso? No se puede deshacer.",
    statAnswered: "Preguntas respondidas",
    statAccuracy: "Precisión global",
    statChapters: "Capítulos leídos",
    statMocks: "Simulacros",
    chapters: "Capítulos",
    pctOf: (pct, total) => `${pct}% de ${total}`,
    lastMockTitle: "Último simulacro (escalado estimado)",
  },
  ruta: {
    kicker: "El camino completo",
    title: (fee) => `Cuatro exámenes, $${fee}, y un orden que no es el obvio.`,
    intro:
      "Los cuatro exámenes son independientes: no hay prerrequisitos y puedes tomarlos en cualquier orden. Pero el contenido sí se acumula. Este orden —barato a caro, Foundations antes que Professional— hace que cada examen pague parte del siguiente.",
    orderTitle: "El orden recomendado",
    plan: [
      {
        code: "CCAO-F",
        weeks: "Semanas 1–3",
        why: "Es la puerta barata ($99) y la única que no exige código. Su temario —evaluación del output, selección de modelo, riesgo— reaparece en las otras tres, así que estudiarla primero abarata todo lo que viene.",
        focus: "Empieza por D2 (Output Evaluation), que solo él es el 21% del examen.",
      },
      {
        code: "CCDV-F",
        weeks: "Semanas 4–7",
        why: "Aquí se paga la deuda técnica: Messages API, batches, prompt caching, streaming, tools, MCP. Un solo dominio —Applications and Integration— vale un tercio del examen; si lo dominas, ya tienes la mitad del camino andado.",
        focus: "D2 (33.1%) + D5 (16.8%) = la mitad del examen en dos dominios.",
      },
      {
        code: "CCAR-F",
        weeks: "Semanas 8–12",
        why: "El examen más denso: 29 task statements y preguntas basadas en escenarios de producción largos. También el mejor documentado — su exam guide trae 12 preguntas de ejemplo y 4 ejercicios de preparación, más que las otras tres juntas.",
        focus: "D1 (Agentic Architecture, 27%) es el eje. Practica leyendo escenarios completos sin saltar al final.",
      },
      {
        code: "CCAR-P",
        weeks: "Semanas 13–17",
        why: "El nivel Professional cambia el lente: ya no es cómo construirlo, sino cómo defenderlo ante un cliente — integración, evaluación, governance, stakeholders. Déjalo al final: es el más caro ($175) y el que más se apoya en lo anterior.",
        focus: "Los tres dominios blandos (Governance, Stakeholders, Lifecycle) suman 35%. No los subestimes por ser 'no técnicos'.",
      },
    ],
    hoursLabel: "Dónde poner las horas:",
    temario: "Temario",
    truthsTitle: "Cinco cosas que conviene saber antes de pagar",
    truths: [
      {
        t: "720/1000 no es 72%",
        d: "Es una escala. Anthropic no publica cómo convierte aciertos crudos en puntos escalados, así que nadie —ni este sitio— puede decirte cuántas preguntas necesitas acertar. La única estrategia segura es apuntar a ≥80% crudo en los simulacros.",
      },
      {
        t: "Cada intento se paga",
        d: "Reprobar el Architect Professional cuesta $175 otra vez. Y hay ventana de espera: 14 días tras el primer fallo, 30 tras el segundo, 90 tras el tercero. Cuatro intentos por examen en 12 meses rodantes.",
      },
      {
        t: "La credencial caduca en 12 meses",
        d: "Y la renovación a tiempo es gratis (evaluación no proctored). Si la dejas caducar, vuelves a pagar el examen completo. Pon un recordatorio al mes 11, no al 12.",
      },
      {
        t: "El examen es en inglés",
        d: "El material de este sitio está en tu idioma, pero los enunciados de práctica están en inglés a propósito: el día del examen no habrá traducción. Cada dominio trae su glosario EN↔ES.",
      },
      {
        t: "No hay curso obligatorio",
        d: "Anthropic no exige ningún curso y no garantiza que ninguno te haga aprobar. Los cursos de preparación de Partner Academy son un recurso más, no un pase.",
      },
      {
        t: "El blueprint es el contrato",
        d: "Los ítems se escriben contra los objetivos publicados. Todo lo que no esté en el blueprint no se pregunta — y todo lo que esté, sí. Es la lista de lo que hay que saber, literalmente.",
      },
    ],
    metaTitle: "Ruta de estudio",
    metaDescription:
      "En qué orden atacar las cuatro certificaciones de Claude, cuánto cuesta el camino completo, y un plan de estudio por semanas basado en el peso real de cada dominio.",
  },
  donar: {
    kicker: "Sin muro de pago, sin registro, sin anuncios",
    title: "Invítame un café, si te sirvió.",
    intro: (questions) =>
      `Nada de este sitio está detrás de un pago. Los cuatro temarios, las ${questions} preguntas, los simulacros y los decodificadores son gratis y lo van a seguir siendo, hayas donado o no.`,
    mathKicker: "La aritmética",
    math1a: "Un reintento del examen Architect cuesta ",
    math1b: (fee) => `$125. El camino completo, $${fee}.`,
    math1c: " Si esta guía te evita una reprobada, te ahorró 25 veces lo que pide esta página.",
    math2:
      "Y si no te lo puedes permitir, o simplemente no quieres: usa todo el material igual. En serio. Está aquí para que apruebes, no para cobrarte.",
    payOnce: "Pago único · Stripe",
    orAnyAmount: "o el monto que quieras.",
    stripeGo: "Stripe ↗",
    soon: "Próximamente",
    pendingKicker: "Enlaces de pago pendientes",
    pendingPara1: "Los Payment Links de Stripe todavía no están configurados. Se activan poniendo",
    pendingPara2: "en las variables de entorno del proyecto.",
    stripeNote:
      "El pago lo procesa Stripe. Este sitio no ve ni almacena tus datos de tarjeta — de hecho, no almacena nada: no hay servidor, no hay cuentas, no hay analítica. Tu progreso de estudio vive solo en tu navegador.",
    whereTitle: "A dónde va",
    where: [
      [
        "Mantener el temario vivo",
        "Los exam guides son v1.0, efectivos julio 2026. Cuando Anthropic publique la v1.1 —y lo hará— hay que releer los cuatro guides, detectar qué objetivos cambiaron, reescribir los capítulos afectados y revisar cada pregunta que colgaba de ellos.",
      ],
      [
        "Más preguntas, mejor verificadas",
        "Cada pregunta de este banco pasó por un revisor adversarial que intentó tumbarla: buscar el dato falso, la doble respuesta defendible, el distractor de paja. Ese proceso es lo caro, y es lo que separa un banco útil de mil preguntas de relleno.",
      ],
      [
        "Cubrir lo que Partner Academy no cubre en tu idioma",
        "El material oficial de preparación está en inglés y detrás del Partner Network. Este sitio es el intento de que eso no sea la barrera entre alguien y una credencial.",
      ],
    ],
    otherTitle: "Otras formas de ayudar que no cuestan nada",
    other: [
      "Encontraste una pregunta con un error factual: dilo. Corregirla vale más que los cinco dólares.",
      "Compártelo con alguien que esté por presentar. El costo marginal de un lector más es cero.",
      "Si aprobaste con esto, cuéntalo — y di qué faltó.",
    ],
    backCta: "← Volver al material",
    metaTitle: "Invítame un café",
    metaDescription:
      "Este material es gratuito y sin registro. Si te sirvió, un café ($5, $10 o $20) ayuda a mantenerlo actualizado cuando Anthropic publique nuevas versiones de los exam guides.",
  },
};

/* ================================================================== EN */

const en: Dict = {
  meta: {
    siteTitle: "Claude Certification Guide — full exam prep",
    template: "%s · Claude Certification Guide",
    description:
      "Complete, free preparation for all four official Anthropic certifications: Associate, Developer, and Architect (Foundations and Professional). Per-domain study chapters, a question bank, and mock exams built on the real blueprint.",
    ogDescription:
      "Per-domain chapters, question bank, and mock exams for the 4 official Anthropic certifications. Free.",
  },
  nav: {
    skip: "Skip to content",
    ruta: "Path",
    coffee: "☕ Buy me a coffee",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    brand: "Claude Certifications",
  },
  langSwitcher: "Language",
  footer: {
    blurb:
      "Free study material for Anthropic's four certifications. Built on the official v1.0 exam guides (July 2026) and Anthropic's public documentation.",
    disclaimer:
      "Independent project. Not affiliated with, sponsored, or endorsed by Anthropic. “Claude” is a trademark of Anthropic PBC.",
    certsLabel: "Certifications",
    linksLabel: "Links",
    rutaLink: "Study path",
    coffeeLink: "Buy me a coffee",
    officialReg: "Official registration ↗",
    pearson: "Pearson VUE ↗",
  },
  banner: {
    title: "Enjoying the content? Buy me a coffee.",
    sub: "The guide is free and will stay free — coffee funds keeping it current with every exam-guide release.",
    groupLabel: "Support amounts",
    tierTitleLive: (tag) => `${tag} — one-time payment via Stripe`,
    tierTitlePending: (tag) => `${tag} — see support options`,
  },
  tierTags: { 5: "A coffee", 10: "Coffee for two", 20: "Coffee for the month" },
  certTagline: {
    "CCAO-F": "Use Claude for real business work: prompts, output evaluation, Projects, risk, and escalation.",
    "CCDV-F": "Build against the API: Messages, batches, caching, streaming, tools, MCP, and agents.",
    "CCAR-F": "Design production agentic systems: orchestration, MCP, Claude Code, structured output, context.",
    "CCAR-P": "End-to-end solution architecture: integration, evaluation, governance, stakeholders, lifecycle.",
  },
  home: {
    badge: "Official exam guides v1.0 · Effective July 2026",
    h1a: "All four Claude certifications,",
    h1b: " studied in depth",
    h1c: ", in your language.",
    heroPara: (practice) =>
      `Anthropic publishes each exam's blueprint and a handful of sample questions. Here is everything else: every official objective developed in full, ${practice} practice questions written against those objectives and verified one by one, mock exams with the real domain mix, and the pattern the distractors are built with.`,
    ctaAssociate: "Start with Associate",
    ctaRoute: "See the full path",
    statQuestions: "Questions",
    statOfficial: (n) => `${n} official`,
    statDomains: "Domains",
    statObjectives: (n) => `${n} objectives`,
    statWords: "Words",
    statWordsSub: "of study chapters",
    statCost: "Total cost",
    statCostSub: "all 4 exams",
    fichaKicker: "What to know before you pay",
    ficha: [
      ["Passing score", "720 / 1000 scaled — NOT 72% of answers. The raw→scaled mapping is not public."],
      ["Format", "Multiple choice and multiple response. 120 minutes. Proctored (Pearson VUE, online or test center)."],
      ["Prerequisites", "None. The four exams are independent: take them in any order you like."],
      ["Retakes", "Up to 4 per exam in rolling 12 months. Waits of 14, 30, and 90 days. Every attempt is paid."],
      ["Validity", "12 months. On-time renewal is free; if it lapses, you pay for the full exam again."],
    ],
    credsTitle: "The four credentials",
    credsKicker: "Choose by role, not by prestige",
    items: (n) => `${n} items`,
    domains: (n) => `${n} domains`,
    questionsHere: (n) => `${n} questions here`,
    heaviest: (d, w) => `Heaviest: D${d} (${w}%)`,
    study: "Study →",
    howTitle: "How to use this",
    howSteps: [
      {
        n: "01",
        t: "Read the decoder before the chapters",
        d: "Every exam has a construction pattern. The official questions reveal it: there is one correct-answer archetype and four distractor archetypes. Recognizing them solves the items you don't know from memory.",
      },
      {
        n: "02",
        t: "Attack domains by weight, not by order",
        d: "In Associate, three domains are half the exam. In Developer, a single one weighs 33%. Studying domain 1 first because it comes first wastes hours: this site sorts by impact.",
      },
      {
        n: "03",
        t: "Practice first, simulate last",
        d: "Practice mode gives you the explanation and every distractor's analysis instantly. The mock exam replicates the real blueprint with a timer and no feedback, then hands you the per-domain breakdown.",
      },
    ],
    donateKicker: "Free, with no paywall",
    donateTitle: "If it saves you one failed attempt, it saved you more than a coffee costs.",
    donatePara:
      "All the material is free and will stay free. One Architect retake costs $125. If this guide spares you that hit, five dollars is a fair trade — and it funds keeping the chapters current when Anthropic ships v1.1.",
    donateCta: "☕ Buy me a coffee",
  },
  cert: {
    practicar: (n) => `Practice · ${n} questions`,
    simulacro: "Timed mock exam",
    decodificador: "Exam decoder",
    fichaLabels: ["Items", "Minutes", "Passing (scaled)", "Per attempt", "Validity", "Domains"],
    whereTitle: "Where the exam really is",
    whereKicker: "Sorted by weight",
    wherePara: (top3, pct) => ["Three domains — ", ` — concentrate ${pct}% of the items.`, " If your time is limited, that's where every hour pays."],
    domainLabel: (n) => `Domain ${n}`,
    objectivesCount: (n) => `${n} official objectives`,
    examItems: (n) => `≈${n} items on the exam`,
    questionsHere: (n) => `${n} questions here`,
    forWhoTitle: "Who it's for",
    mqcLabel: "The minimally qualified candidate",
    notForLabel: "Who it's NOT for",
    rulesTitle: "Rules of the game",
    ruleKeys: ["Scoring", "Retakes", "Recertification", "Prerequisites", "Language"],
    logisticsCta: "Registration, Pearson VUE & exam day →",
    sourceLabel: "Source",
    metaDescription: (nameEs, domains, questions, items, minutes) =>
      `Complete guide to ${nameEs}: ${domains} domains, ${questions} practice questions, mock exam on the official blueprint. ${items} items, ${minutes} min, 720/1000 passing.`,
  },
  domain: {
    breadcrumb: (n) => `Domain ${n}`,
    domainOf: (n, total) => `Domain ${n} of ${total}`,
    itemsOf: (est, total) => `≈${est} of ${total} items`,
    objectivesKicker: "Official objectives · verbatim from the exam guide",
    notPublished: "This domain's chapter isn't published yet.",
    untranslated: "This chapter isn't translated into this language yet; shown in Spanish.",
    thisDomain: "This domain",
    weight: "Weight",
    estItems: "Estimated items",
    objectives: "Objectives",
    questions: "Questions",
    reading: "Reading",
    readingMin: (min) => `≈${min} min`,
    practiceDomain: "Practice this domain",
    otherDomains: "Other domains",
    prev: (n, w) => `← Domain ${n} · ${w}%`,
    next: (n, w) => `Domain ${n} · ${w}% →`,
    metaTitle: (n, title, w, code) => `D${n}: ${title} (${w}%) — ${code}`,
    metaDescription: (n, code, objectives) =>
      `Full chapter for domain ${n} of ${code}: ${objectives} official objectives, key concepts, examples, common mistakes, glossary, and checklist.`,
  },
  decoder: {
    breadcrumb: "Decoder",
    title: "The decoder",
    intro: (code, n) =>
      `A multiple-choice exam isn't a memory test: it's an artifact built with rules. These are ${code}'s, derived from the ${n} sample questions Anthropic published and from the exam guide's own language.`,
    notYet: "Not published yet.",
    untranslated: "The decoder isn't translated into this language yet; shown in Spanish.",
    dissectTitle: "The official questions, dissected",
    dissectPara: (n) =>
      `These ${n} are the only real questions Anthropic has published for this exam. They're worth more than a hundred invented ones: they're the calibration sample.`,
    seeDissection: "See dissection ↓",
    officialRationale: "Official rationale",
    teaches: "What it teaches you",
    trap: "Trap:",
    applyPractice: "Apply it in practice",
    backTo: (code) => `Back to ${code}`,
    metaTitle: (code) => `Exam decoder — ${code}`,
    metaDescription: (name) =>
      `How ${name} items are built: the correct-answer archetype, each distractor's role, and the elimination technique.`,
  },
  logistics: {
    breadcrumb: "Logistics",
    title: "Registration & exam day",
    intro: (code) =>
      `Everything operational about ${code}: from checkout on Partner Academy to the rules that can void your exam if you break them.`,
    regTitle: "Registration, step by step",
    officialRegCta: "Go to official registration ↗",
    rulesTitle: "Exam-day rules",
    prepTitle: "How to prepare, per Anthropic",
    practice: "Practice",
    backTo: (code) => `Back to ${code}`,
    metaTitle: (code) => `Registration & exam day — ${code}`,
    metaDescription: (name) =>
      `How to register, schedule with Pearson VUE, what to expect on exam day, conduct rules, retakes, and recertification for ${name}.`,
  },
  practice: {
    breadcrumb: "Practice",
    title: "Guided practice",
    titleRunning: (cert) => `Practice · ${cert}`,
    sub: (certName) => `Every question gives you the explanation and why each distractor fails, on the spot. ${certName}.`,
    domainsKicker: "Domains",
    all: "All",
    none: "None",
    top3: "Only the 3 heaviest",
    top3Title: "The three domains that weigh the most on the exam",
    filterKicker: "Filter",
    filters: { all: "All", unseen: "Unseen", failed: "Missed", official: "Official" },
    howMany: "How many questions",
    allSizeLabel: "All",
    inSession: (of) => `questions this session · of ${of} available`,
    start: "Start",
    changeSelection: "← Change selection",
    loading: "Loading…",
    metaTitle: (code) => `Practice — ${code}`,
    metaDescription: (name) => `${name} practice question bank, with an explanation and per-distractor analysis for every item.`,
  },
  quiz: {
    noQuestions: "No questions available for this selection.",
    of: "/",
    flag: "◇ Flag",
    flagged: "◆ Flagged",
    answered: (n) => `${n} answered`,
    scenario: "Scenario:",
    multiResponse: "Multiple response",
    officialBadge: "★ Official",
    officialTooltip: "Sample question published by Anthropic in the official exam guide",
    diff: { easy: "Easy", medium: "Medium", hard: "Hard" },
    correct: "Correct",
    incorrect: (keys) => `Incorrect — the answer is ${keys}`,
    officialRationaleLabel: "Anthropic's official rationale:",
    whyFail: "Why the others fail",
    trap: "Trap:",
    objective: "Objective measured:",
    prev: "← Previous",
    check: "Check",
    next: "Next →",
    finish: "Finish & see report",
    deliver: "Submit",
    confirmDeliver: (answered, total) => `Submit the mock with ${answered} of ${total} answered?`,
    navigation: "Navigation",
    goTo: (n, answered) => `Go to question ${n}${answered ? " (answered)" : ""}`,
    resultMock: "Mock exam result",
    resultPractice: "Session result",
    scaledLabel: "Estimated scaled · 100–1000",
    hits: (pct) => `Correct · ${pct}% raw`,
    timeSpent: "Time spent",
    abovePass: (pass) => `Above the passing score (${pass}) in this simulation.`,
    belowPass: (pass) => `Below the passing score (${pass}) in this simulation.`,
    scaledNote1: "Anthropic doesn't publish the raw→scaled mapping, so this number is a",
    scaledNoteStrong: " linear estimate",
    scaledNote2: ", not a prediction. Treat it as a traffic light, not a verdict: aim for ≥80% raw before paying for the exam.",
    byDomain: "Per-domain breakdown",
    reviewChapter: (d) => `→ Review the domain ${d} chapter`,
    reviewTitle: (n) => `Review of all ${n} questions`,
    anotherRound: "Another round",
    backTo: (cert) => `Back to ${cert}`,
  },
  mock: {
    breadcrumb: "Mock exam",
    title: "Timed mock exam",
    sub: (items, certName, minutes) =>
      `${items} items spread across domains exactly as the official ${certName} blueprint spreads them. ${minutes}-minute timer, no feedback until you submit, shuffled options.`,
    mixKicker: "This mock's mix",
    itemsPct: (items, weight) => `${items} items · ${weight}%`,
    shortfall: (list) =>
      `The bank doesn't yet have enough questions to fill ${list} to 100% of the blueprint; that domain runs with what's available.`,
    stats: {
      items: "Items",
      time: "Time",
      timeValue: (m) => `${m} min`,
      pass: "Passing",
      feedback: "Feedback",
      feedbackValue: "On submit",
    },
    start: "Start mock exam",
    timerNote: (m) => `The timer starts when you click. Set aside ${m} uninterrupted minutes — the real exam doesn't pause.`,
    historyTitle: "Your mock exams",
    raw: (correct, total, pct) => `${correct}/${total} · ${pct}% raw`,
    minutes: (m) => `${m} min`,
    metaTitle: (code) => `Mock exam — ${code}`,
    metaDescription: (name, items, minutes) =>
      `Timed ${name} mock exam: ${items} items in ${minutes} minutes, with the official blueprint's domain mix.`,
  },
  flashcards: {
    title: "Domain glossary",
    cards: "Cards",
    table: "Table",
    termOf: (i, n) => `Term ${i} of ${n}`,
    reveal: "Click to reveal",
    flipAria: "Flip card",
    colEn: "Term (EN)",
    colLocal: "Translation",
    colMeaning: "What it means",
  },
  checklist: {
    kicker: "Domain checklist",
    progress: (done, total) => `${done} / ${total}`,
    mastered: "· mastered",
    hint: "If you can't honestly tick a box, that's where your next study hour goes.",
  },
  markRead: { done: "✓ Chapter read", mark: "Mark as read" },
  domainProgress: { read: "✓ Read", noData: "No data" },
  dash: {
    emptyTitle: "Your progress will appear here",
    emptyPara:
      "As soon as you answer your first question or mark a chapter as read, this panel fills in: per-domain accuracy, chapters covered, mock history. It all lives in your browser — no account, no server.",
    emptyCta: "Answer the first one",
    title: "Your progress",
    clear: "Clear all",
    confirmClear: "Delete all your progress? This cannot be undone.",
    statAnswered: "Questions answered",
    statAccuracy: "Overall accuracy",
    statChapters: "Chapters read",
    statMocks: "Mock exams",
    chapters: "Chapters",
    pctOf: (pct, total) => `${pct}% of ${total}`,
    lastMockTitle: "Last mock (estimated scaled)",
  },
  ruta: {
    kicker: "The full path",
    title: (fee) => `Four exams, $${fee}, and an order that isn't the obvious one.`,
    intro:
      "The four exams are independent: no prerequisites, take them in any order. But the content does compound. This order — cheap to expensive, Foundations before Professional — makes each exam pay for part of the next.",
    orderTitle: "The recommended order",
    plan: [
      {
        code: "CCAO-F",
        weeks: "Weeks 1–3",
        why: "It's the cheap door ($99) and the only one that requires no code. Its material — output evaluation, model selection, risk — reappears in the other three, so studying it first makes everything after cheaper.",
        focus: "Start with D2 (Output Evaluation): on its own it's 21% of the exam.",
      },
      {
        code: "CCDV-F",
        weeks: "Weeks 4–7",
        why: "This is where the technical debt gets paid: Messages API, batches, prompt caching, streaming, tools, MCP. A single domain — Applications and Integration — is worth a third of the exam; master it and you're halfway there.",
        focus: "D2 (33.1%) + D5 (16.8%) = half the exam in two domains.",
      },
      {
        code: "CCAR-F",
        weeks: "Weeks 8–12",
        why: "The densest exam: 29 task statements and questions built on long production scenarios. Also the best documented — its exam guide ships 12 sample questions and 4 prep exercises, more than the other three combined.",
        focus: "D1 (Agentic Architecture, 27%) is the axis. Practice reading full scenarios without skipping to the end.",
      },
      {
        code: "CCAR-P",
        weeks: "Weeks 13–17",
        why: "The Professional level changes the lens: no longer how to build it, but how to defend it in front of a client — integration, evaluation, governance, stakeholders. Leave it for last: it's the priciest ($175) and leans hardest on everything before it.",
        focus: "The three 'soft' domains (Governance, Stakeholders, Lifecycle) add up to 35%. Don't underestimate them for being 'non-technical'.",
      },
    ],
    hoursLabel: "Where to put the hours:",
    temario: "Chapters",
    truthsTitle: "Five things worth knowing before you pay",
    truths: [
      {
        t: "720/1000 is not 72%",
        d: "It's a scale. Anthropic doesn't publish how raw answers convert to scaled points, so nobody — including this site — can tell you how many questions you need. The only safe strategy is aiming for ≥80% raw on mocks.",
      },
      {
        t: "Every attempt is paid",
        d: "Failing Architect Professional costs $175 again. And there's a waiting window: 14 days after the first fail, 30 after the second, 90 after the third. Four attempts per exam in rolling 12 months.",
      },
      {
        t: "The credential expires in 12 months",
        d: "And on-time renewal is free (non-proctored assessment). Let it lapse and you pay for the full exam again. Set a reminder at month 11, not 12.",
      },
      {
        t: "The exam is in English",
        d: "This site's teaching is in your language, but the practice stems are in English on purpose: there is no translation on exam day. Every domain ships its EN glossary.",
      },
      {
        t: "No course is mandatory",
        d: "Anthropic doesn't require any course and doesn't guarantee any will make you pass. Partner Academy prep courses are one more resource, not a ticket.",
      },
      {
        t: "The blueprint is the contract",
        d: "Items are written against the published objectives. Anything not in the blueprint isn't asked — and everything in it is. It's literally the list of what you must know.",
      },
    ],
    metaTitle: "Study path",
    metaDescription:
      "In what order to attack Claude's four certifications, what the full path costs, and a week-by-week study plan based on each domain's real weight.",
  },
  donar: {
    kicker: "No paywall, no signup, no ads",
    title: "Buy me a coffee, if it helped.",
    intro: (questions) =>
      `Nothing on this site sits behind a payment. The four study tracks, the ${questions} questions, the mocks, and the decoders are free and will stay free, whether you donate or not.`,
    mathKicker: "The arithmetic",
    math1a: "One Architect retake costs ",
    math1b: (fee) => `$125. The full path, $${fee}.`,
    math1c: " If this guide saves you one failed attempt, it saved you 25× what this page asks.",
    math2:
      "And if you can't afford it, or simply don't want to: use everything anyway. Seriously. It's here so you pass, not to charge you.",
    payOnce: "One-time payment · Stripe",
    orAnyAmount: "or any amount you like.",
    stripeGo: "Stripe ↗",
    soon: "Coming soon",
    pendingKicker: "Payment links pending",
    pendingPara1: "The Stripe Payment Links aren't configured yet. They activate by setting",
    pendingPara2: "in the project's environment variables.",
    stripeNote:
      "Payment is processed by Stripe. This site never sees or stores your card data — in fact, it stores nothing: no server, no accounts, no analytics. Your study progress lives only in your browser.",
    whereTitle: "Where it goes",
    where: [
      [
        "Keeping the chapters alive",
        "The exam guides are v1.0, effective July 2026. When Anthropic ships v1.1 — and it will — all four guides get re-read, changed objectives get detected, affected chapters get rewritten, and every question hanging off them gets reviewed.",
      ],
      [
        "More questions, better verified",
        "Every question in this bank went through an adversarial reviewer who tried to knock it down: hunting the false fact, the doubly-defensible answer, the straw distractor. That process is the expensive part — it's what separates a useful bank from a thousand filler questions.",
      ],
      [
        "Covering what Partner Academy doesn't in your language",
        "The official prep material is in English and behind the Partner Network. This site is the attempt to make sure that isn't the barrier between someone and a credential.",
      ],
    ],
    otherTitle: "Other ways to help that cost nothing",
    other: [
      "Found a question with a factual error? Say it. Fixing it is worth more than the five dollars.",
      "Share it with someone about to sit the exam. The marginal cost of one more reader is zero.",
      "If you passed with this, tell the story — and say what was missing.",
    ],
    backCta: "← Back to the material",
    metaTitle: "Buy me a coffee",
    metaDescription:
      "This material is free with no signup. If it helped, a coffee ($5, $10, or $20) keeps it current when Anthropic publishes new exam-guide versions.",
  },
};

/* ================================================================== FR */

const fr: Dict = {
  meta: {
    siteTitle: "Guide des certifications Claude — préparation complète",
    template: "%s · Guide des certifications Claude",
    description:
      "Préparation complète et gratuite aux quatre certifications officielles d'Anthropic : Associate, Developer et Architect (Foundations et Professional). Chapitres par domaine, banque de questions, examens blancs sur le blueprint réel.",
    ogDescription:
      "Chapitres par domaine, banque de questions et examens blancs pour les 4 certifications officielles d'Anthropic. Gratuit.",
  },
  nav: {
    skip: "Aller au contenu",
    ruta: "Parcours",
    coffee: "☕ Offrez-moi un café",
    themeToLight: "Passer en mode clair",
    themeToDark: "Passer en mode sombre",
    brand: "Certifications Claude",
  },
  langSwitcher: "Langue",
  footer: {
    blurb:
      "Matériel d'étude gratuit pour les quatre certifications d'Anthropic. Construit sur les exam guides officiels v1.0 (juillet 2026) et la documentation publique d'Anthropic.",
    disclaimer:
      "Projet indépendant. Non affilié, sponsorisé ni approuvé par Anthropic. « Claude » est une marque d'Anthropic PBC.",
    certsLabel: "Certifications",
    linksLabel: "Liens",
    rutaLink: "Parcours d'étude",
    coffeeLink: "Offrez-moi un café",
    officialReg: "Inscription officielle ↗",
    pearson: "Pearson VUE ↗",
  },
  banner: {
    title: "Le contenu vous plaît ? Offrez-moi un café.",
    sub: "Le guide est gratuit et le restera — le café finance sa mise à jour à chaque version des exam guides.",
    groupLabel: "Montants de soutien",
    tierTitleLive: (tag) => `${tag} — paiement unique via Stripe`,
    tierTitlePending: (tag) => `${tag} — voir les options de soutien`,
  },
  tierTags: { 5: "Un café", 10: "Café pour deux", 20: "Café du mois" },
  certTagline: {
    "CCAO-F": "Utiliser Claude pour du vrai travail métier : prompts, évaluation des sorties, Projects, risque et escalade.",
    "CCDV-F": "Construire contre l'API : Messages, batches, caching, streaming, tools, MCP et agents.",
    "CCAR-F": "Concevoir des systèmes agentiques de production : orchestration, MCP, Claude Code, structured output, contexte.",
    "CCAR-P": "Architecture de solution de bout en bout : intégration, évaluation, gouvernance, parties prenantes, cycle de vie.",
  },
  home: {
    badge: "Exam guides officiels v1.0 · Effectifs juillet 2026",
    h1a: "Les quatre certifications Claude,",
    h1b: " étudiées en profondeur",
    h1c: ", dans votre langue.",
    heroPara: (practice) =>
      `Anthropic publie le blueprint de chaque examen et quelques questions d'exemple. Voici tout le reste : chaque objectif officiel développé, ${practice} questions d'entraînement écrites contre ces objectifs et vérifiées une à une, des examens blancs avec la vraie répartition des domaines, et le patron de construction des distracteurs.`,
    ctaAssociate: "Commencer par Associate",
    ctaRoute: "Voir le parcours complet",
    statQuestions: "Questions",
    statOfficial: (n) => `${n} officielles`,
    statDomains: "Domaines",
    statObjectives: (n) => `${n} objectifs`,
    statWords: "Mots",
    statWordsSub: "de chapitres",
    statCost: "Coût total",
    statCostSub: "les 4 examens",
    fichaKicker: "À savoir avant de payer",
    ficha: [
      ["Seuil", "720 / 1000 en score pondéré — ce n'est PAS 72 % de bonnes réponses. La conversion brut→pondéré n'est pas publique."],
      ["Format", "Choix multiple et réponses multiples. 120 minutes. Surveillé (Pearson VUE, en ligne ou en centre)."],
      ["Prérequis", "Aucun. Les quatre examens sont indépendants : passez-les dans l'ordre que vous voulez."],
      ["Repassages", "Jusqu'à 4 par examen sur 12 mois glissants. Délais de 14, 30 et 90 jours. Chaque tentative est payante."],
      ["Validité", "12 mois. Le renouvellement à temps est gratuit ; expirée, vous repayez l'examen complet."],
    ],
    credsTitle: "Les quatre certifications",
    credsKicker: "Choisissez par rôle, pas par prestige",
    items: (n) => `${n} items`,
    domains: (n) => `${n} domaines`,
    questionsHere: (n) => `${n} questions ici`,
    heaviest: (d, w) => `Le plus lourd : D${d} (${w} %)`,
    study: "Étudier →",
    howTitle: "Comment s'en servir",
    howSteps: [
      {
        n: "01",
        t: "Lisez le décodeur avant les chapitres",
        d: "Chaque examen a un patron de construction. Les questions officielles le révèlent : un archétype de bonne réponse et quatre archétypes de distracteur. Les reconnaître résout les items que vous ne savez pas par cœur.",
      },
      {
        n: "02",
        t: "Attaquez les domaines par poids, pas par ordre",
        d: "En Associate, trois domaines font la moitié de l'examen. En Developer, un seul pèse 33 %. Étudier le domaine 1 d'abord parce qu'il est premier gaspille des heures : le site trie par impact.",
      },
      {
        n: "03",
        t: "Entraînez-vous d'abord, simulez à la fin",
        d: "Le mode entraînement donne l'explication et l'analyse de chaque distracteur immédiatement. L'examen blanc réplique le vrai blueprint, chronométré et sans feedback, puis rend le détail par domaine.",
      },
    ],
    donateKicker: "Gratuit, sans paywall",
    donateTitle: "S'il vous évite un échec, il vous a économisé bien plus qu'un café.",
    donatePara:
      "Tout le matériel est gratuit et le restera. Un repassage de l'examen Architect coûte 125 $. Si ce guide vous évite ce coup, cinq dollars sont un échange honnête — et financent la mise à jour des chapitres quand Anthropic publiera la v1.1.",
    donateCta: "☕ Offrez-moi un café",
  },
  cert: {
    practicar: (n) => `S'entraîner · ${n} questions`,
    simulacro: "Examen blanc chronométré",
    decodificador: "Décodeur de l'examen",
    fichaLabels: ["Items", "Minutes", "Seuil pondéré", "Par tentative", "Validité", "Domaines"],
    whereTitle: "Où est vraiment l'examen",
    whereKicker: "Trié par poids",
    wherePara: (top3, pct) => ["Trois domaines — ", ` — concentrent ${pct} % des items.`, " Si votre temps est limité, c'est là que chaque heure paie."],
    domainLabel: (n) => `Domaine ${n}`,
    objectivesCount: (n) => `${n} objectifs officiels`,
    examItems: (n) => `≈${n} items à l'examen`,
    questionsHere: (n) => `${n} questions ici`,
    forWhoTitle: "Pour qui c'est",
    mqcLabel: "Le candidat minimalement qualifié",
    notForLabel: "Pour qui ce N'est PAS",
    rulesTitle: "Règles du jeu",
    ruleKeys: ["Notation", "Repassages", "Recertification", "Prérequis", "Langue"],
    logisticsCta: "Inscription, Pearson VUE et jour J →",
    sourceLabel: "Source",
    metaDescription: (nameEs, domains, questions, items, minutes) =>
      `Guide complet de ${nameEs} : ${domains} domaines, ${questions} questions d'entraînement, examen blanc sur le blueprint officiel. ${items} items, ${minutes} min, seuil 720/1000.`,
  },
  domain: {
    breadcrumb: (n) => `Domaine ${n}`,
    domainOf: (n, total) => `Domaine ${n} sur ${total}`,
    itemsOf: (est, total) => `≈${est} des ${total} items`,
    objectivesKicker: "Objectifs officiels · verbatim de l'exam guide",
    notPublished: "Le chapitre de ce domaine n'est pas encore publié.",
    untranslated: "Ce chapitre n'est pas encore traduit dans cette langue ; affiché en espagnol.",
    thisDomain: "Ce domaine",
    weight: "Poids",
    estItems: "Items estimés",
    objectives: "Objectifs",
    questions: "Questions",
    reading: "Lecture",
    readingMin: (min) => `≈${min} min`,
    practiceDomain: "S'entraîner sur ce domaine",
    otherDomains: "Autres domaines",
    prev: (n, w) => `← Domaine ${n} · ${w} %`,
    next: (n, w) => `Domaine ${n} · ${w} % →`,
    metaTitle: (n, title, w, code) => `D${n} : ${title} (${w} %) — ${code}`,
    metaDescription: (n, code, objectives) =>
      `Chapitre complet du domaine ${n} de ${code} : ${objectives} objectifs officiels, concepts clés, exemples, erreurs courantes, glossaire et checklist.`,
  },
  decoder: {
    breadcrumb: "Décodeur",
    title: "Le décodeur",
    intro: (code, n) =>
      `Un QCM n'est pas un test de mémoire : c'est un artefact construit avec des règles. Voici celles de ${code}, dérivées des ${n} questions d'exemple publiées par Anthropic et du langage de l'exam guide.`,
    notYet: "Pas encore publié.",
    untranslated: "Le décodeur n'est pas encore traduit dans cette langue ; affiché en espagnol.",
    dissectTitle: "Les questions officielles, disséquées",
    dissectPara: (n) =>
      `Ces ${n} sont les seules vraies questions qu'Anthropic a publiées pour cet examen. Elles valent plus que cent inventées : c'est l'échantillon d'étalonnage.`,
    seeDissection: "Voir la dissection ↓",
    officialRationale: "Justification officielle",
    teaches: "Ce que ça vous apprend",
    trap: "Piège :",
    applyPractice: "L'appliquer en entraînement",
    backTo: (code) => `Retour à ${code}`,
    metaTitle: (code) => `Décodeur de l'examen — ${code}`,
    metaDescription: (name) =>
      `Comment sont construits les items de ${name} : l'archétype de bonne réponse, le rôle de chaque distracteur et la technique d'élimination.`,
  },
  logistics: {
    breadcrumb: "Logistique",
    title: "Inscription et jour de l'examen",
    intro: (code) =>
      `Tout l'opérationnel de ${code} : du checkout sur Partner Academy aux règles qui peuvent annuler votre examen si vous les enfreignez.`,
    regTitle: "Inscription, pas à pas",
    officialRegCta: "Aller à l'inscription officielle ↗",
    rulesTitle: "Règles du jour J",
    prepTitle: "Comment se préparer, selon Anthropic",
    practice: "S'entraîner",
    backTo: (code) => `Retour à ${code}`,
    metaTitle: (code) => `Inscription et jour J — ${code}`,
    metaDescription: (name) =>
      `Comment s'inscrire, réserver chez Pearson VUE, à quoi s'attendre le jour J, règles de conduite, repassages et recertification de ${name}.`,
  },
  practice: {
    breadcrumb: "Entraînement",
    title: "Entraînement guidé",
    titleRunning: (cert) => `Entraînement · ${cert}`,
    sub: (certName) => `Chaque question rend l'explication et la raison d'échec de chaque distracteur, immédiatement. ${certName}.`,
    domainsKicker: "Domaines",
    all: "Tous",
    none: "Aucun",
    top3: "Seulement les 3 plus lourds",
    top3Title: "Les trois domaines qui pèsent le plus à l'examen",
    filterKicker: "Filtre",
    filters: { all: "Toutes", unseen: "Non vues", failed: "Ratées", official: "Officielles" },
    howMany: "Combien de questions",
    allSizeLabel: "Toutes",
    inSession: (of) => `questions cette session · sur ${of} disponibles`,
    start: "Commencer",
    changeSelection: "← Changer la sélection",
    loading: "Chargement…",
    metaTitle: (code) => `Entraînement — ${code}`,
    metaDescription: (name) => `Banque de questions d'entraînement de ${name}, avec explication et analyse de chaque distracteur.`,
  },
  quiz: {
    noQuestions: "Aucune question disponible pour cette sélection.",
    of: "/",
    flag: "◇ Marquer",
    flagged: "◆ Marquée",
    answered: (n) => `${n} répondues`,
    scenario: "Scénario :",
    multiResponse: "Réponses multiples",
    officialBadge: "★ Officielle",
    officialTooltip: "Question d'exemple publiée par Anthropic dans l'exam guide officiel",
    diff: { easy: "Facile", medium: "Moyenne", hard: "Difficile" },
    correct: "Correct",
    incorrect: (keys) => `Incorrect — la réponse est ${keys}`,
    officialRationaleLabel: "Justification officielle d'Anthropic :",
    whyFail: "Pourquoi les autres échouent",
    trap: "Piège :",
    objective: "Objectif mesuré :",
    prev: "← Précédente",
    check: "Vérifier",
    next: "Suivante →",
    finish: "Terminer et voir le rapport",
    deliver: "Rendre",
    confirmDeliver: (answered, total) => `Rendre l'examen blanc avec ${answered} réponses sur ${total} ?`,
    navigation: "Navigation",
    goTo: (n, answered) => `Aller à la question ${n}${answered ? " (répondue)" : ""}`,
    resultMock: "Résultat de l'examen blanc",
    resultPractice: "Résultat de la session",
    scaledLabel: "Score pondéré estimé · 100–1000",
    hits: (pct) => `Bonnes réponses · ${pct} % brut`,
    timeSpent: "Temps passé",
    abovePass: (pass) => `Au-dessus du seuil (${pass}) dans cette simulation.`,
    belowPass: (pass) => `En dessous du seuil (${pass}) dans cette simulation.`,
    scaledNote1: "Anthropic ne publie pas la conversion brut→pondéré, donc ce nombre est une",
    scaledNoteStrong: " estimation linéaire",
    scaledNote2: ", pas une prédiction. Traitez-le comme un feu de signalisation, pas un verdict : visez ≥80 % brut avant de payer l'examen.",
    byDomain: "Détail par domaine",
    reviewChapter: (d) => `→ Revoir le chapitre du domaine ${d}`,
    reviewTitle: (n) => `Révision des ${n} questions`,
    anotherRound: "Une autre série",
    backTo: (cert) => `Retour à ${cert}`,
  },
  mock: {
    breadcrumb: "Examen blanc",
    title: "Examen blanc chronométré",
    sub: (items, certName, minutes) =>
      `${items} items répartis entre les domaines exactement comme le blueprint officiel de ${certName}. Chrono de ${minutes} minutes, aucun feedback avant de rendre, options mélangées.`,
    mixKicker: "Répartition de cet examen blanc",
    itemsPct: (items, weight) => `${items} items · ${weight} %`,
    shortfall: (list) =>
      `La banque n'a pas encore assez de questions pour remplir ${list} à 100 % du blueprint ; ce domaine tourne avec ce qui existe.`,
    stats: {
      items: "Items",
      time: "Temps",
      timeValue: (m) => `${m} min`,
      pass: "Seuil",
      feedback: "Feedback",
      feedbackValue: "À la remise",
    },
    start: "Commencer l'examen blanc",
    timerNote: (m) => `Le chrono démarre au clic. Réservez ${m} minutes sans interruption — le vrai examen ne se met pas en pause.`,
    historyTitle: "Vos examens blancs",
    raw: (correct, total, pct) => `${correct}/${total} · ${pct} % brut`,
    minutes: (m) => `${m} min`,
    metaTitle: (code) => `Examen blanc — ${code}`,
    metaDescription: (name, items, minutes) =>
      `Examen blanc chronométré de ${name} : ${items} items en ${minutes} minutes, avec la répartition officielle des domaines.`,
  },
  flashcards: {
    title: "Glossaire du domaine",
    cards: "Cartes",
    table: "Tableau",
    termOf: (i, n) => `Terme ${i} sur ${n}`,
    reveal: "Cliquez pour révéler",
    flipAria: "Retourner la carte",
    colEn: "Terme (EN)",
    colLocal: "Traduction",
    colMeaning: "Ce que ça veut dire",
  },
  checklist: {
    kicker: "Checklist du domaine",
    progress: (done, total) => `${done} / ${total}`,
    mastered: "· maîtrisé",
    hint: "Si vous ne pouvez pas cocher une case honnêtement, voilà votre prochaine heure d'étude.",
  },
  markRead: { done: "✓ Chapitre lu", mark: "Marquer comme lu" },
  domainProgress: { read: "✓ Lu", noData: "Aucune donnée" },
  dash: {
    emptyTitle: "Votre progression apparaîtra ici",
    emptyPara:
      "Dès votre première réponse ou votre premier chapitre marqué comme lu, ce panneau se remplit : précision par domaine, chapitres couverts, historique d'examens blancs. Tout vit dans votre navigateur — sans compte, sans serveur.",
    emptyCta: "Répondre à la première",
    title: "Votre progression",
    clear: "Tout effacer",
    confirmClear: "Effacer toute votre progression ? C'est irréversible.",
    statAnswered: "Questions répondues",
    statAccuracy: "Précision globale",
    statChapters: "Chapitres lus",
    statMocks: "Examens blancs",
    chapters: "Chapitres",
    pctOf: (pct, total) => `${pct} % de ${total}`,
    lastMockTitle: "Dernier examen blanc (pondéré estimé)",
  },
  ruta: {
    kicker: "Le chemin complet",
    title: (fee) => `Quatre examens, ${fee} $, et un ordre qui n'est pas l'évident.`,
    intro:
      "Les quatre examens sont indépendants : aucun prérequis, passez-les dans n'importe quel ordre. Mais le contenu, lui, se cumule. Cet ordre — du moins cher au plus cher, Foundations avant Professional — fait que chaque examen paie une partie du suivant.",
    orderTitle: "L'ordre recommandé",
    plan: [
      {
        code: "CCAO-F",
        weeks: "Semaines 1–3",
        why: "C'est la porte la moins chère (99 $) et la seule sans code. Son contenu — évaluation des sorties, choix du modèle, risque — revient dans les trois autres : l'étudier d'abord rend tout le reste moins cher.",
        focus: "Commencez par D2 (Output Evaluation) : à lui seul, 21 % de l'examen.",
      },
      {
        code: "CCDV-F",
        weeks: "Semaines 4–7",
        why: "Ici se paie la dette technique : Messages API, batches, prompt caching, streaming, tools, MCP. Un seul domaine — Applications and Integration — vaut un tiers de l'examen ; maîtrisez-le et vous êtes à mi-chemin.",
        focus: "D2 (33,1 %) + D5 (16,8 %) = la moitié de l'examen en deux domaines.",
      },
      {
        code: "CCAR-F",
        weeks: "Semaines 8–12",
        why: "L'examen le plus dense : 29 task statements et des questions sur de longs scénarios de production. Aussi le mieux documenté — son exam guide livre 12 questions d'exemple et 4 exercices, plus que les trois autres réunis.",
        focus: "D1 (Agentic Architecture, 27 %) est l'axe. Entraînez-vous à lire les scénarios en entier sans sauter à la fin.",
      },
      {
        code: "CCAR-P",
        weeks: "Semaines 13–17",
        why: "Le niveau Professional change la focale : plus comment le construire, mais comment le défendre devant un client — intégration, évaluation, gouvernance, parties prenantes. Gardez-le pour la fin : le plus cher (175 $) et celui qui s'appuie le plus sur le reste.",
        focus: "Les trois domaines « soft » (Governance, Stakeholders, Lifecycle) totalisent 35 %. Ne les sous-estimez pas parce qu'ils sont « non techniques ».",
      },
    ],
    hoursLabel: "Où mettre les heures :",
    temario: "Chapitres",
    truthsTitle: "Cinq choses à savoir avant de payer",
    truths: [
      {
        t: "720/1000 n'est pas 72 %",
        d: "C'est une échelle. Anthropic ne publie pas la conversion des réponses brutes en points pondérés : personne — pas même ce site — ne peut vous dire combien de questions il faut. La seule stratégie sûre : viser ≥80 % brut aux examens blancs.",
      },
      {
        t: "Chaque tentative se paie",
        d: "Échouer à l'Architect Professional coûte encore 175 $. Et il y a un délai d'attente : 14 jours après le premier échec, 30 après le deuxième, 90 après le troisième. Quatre tentatives par examen sur 12 mois glissants.",
      },
      {
        t: "La certification expire en 12 mois",
        d: "Et le renouvellement à temps est gratuit (évaluation non surveillée). Laissez-la expirer et vous repayez l'examen complet. Mettez un rappel au mois 11, pas au 12.",
      },
      {
        t: "L'examen est en anglais",
        d: "L'enseignement de ce site est dans votre langue, mais les énoncés d'entraînement sont en anglais exprès : le jour J, il n'y aura pas de traduction. Chaque domaine livre son glossaire EN.",
      },
      {
        t: "Aucun cours n'est obligatoire",
        d: "Anthropic n'exige aucun cours et ne garantit qu'aucun vous fera réussir. Les cours de Partner Academy sont une ressource de plus, pas un billet d'entrée.",
      },
      {
        t: "Le blueprint est le contrat",
        d: "Les items s'écrivent contre les objectifs publiés. Tout ce qui n'est pas dans le blueprint n'est pas demandé — et tout ce qui y est, si. C'est littéralement la liste de ce qu'il faut savoir.",
      },
    ],
    metaTitle: "Parcours d'étude",
    metaDescription:
      "Dans quel ordre attaquer les quatre certifications Claude, ce que coûte le chemin complet, et un plan d'étude par semaines basé sur le poids réel de chaque domaine.",
  },
  donar: {
    kicker: "Pas de paywall, pas d'inscription, pas de pub",
    title: "Offrez-moi un café, si ça vous a servi.",
    intro: (questions) =>
      `Rien sur ce site n'est derrière un paiement. Les quatre parcours, les ${questions} questions, les examens blancs et les décodeurs sont gratuits et le resteront, que vous donniez ou non.`,
    mathKicker: "L'arithmétique",
    math1a: "Un repassage de l'examen Architect coûte ",
    math1b: (fee) => `125 $. Le chemin complet, ${fee} $.`,
    math1c: " Si ce guide vous évite un échec, il vous a économisé 25 fois ce que demande cette page.",
    math2:
      "Et si vous ne pouvez pas vous le permettre, ou n'en avez simplement pas envie : utilisez tout le matériel quand même. Sérieusement. Il est là pour que vous réussissiez, pas pour vous facturer.",
    payOnce: "Paiement unique · Stripe",
    orAnyAmount: "ou le montant de votre choix.",
    stripeGo: "Stripe ↗",
    soon: "Bientôt",
    pendingKicker: "Liens de paiement en attente",
    pendingPara1: "Les Payment Links Stripe ne sont pas encore configurés. Ils s'activent en définissant",
    pendingPara2: "dans les variables d'environnement du projet.",
    stripeNote:
      "Le paiement est traité par Stripe. Ce site ne voit ni ne stocke vos données de carte — en fait, il ne stocke rien : pas de serveur, pas de comptes, pas d'analytics. Votre progression vit uniquement dans votre navigateur.",
    whereTitle: "Où ça va",
    where: [
      [
        "Garder les chapitres vivants",
        "Les exam guides sont en v1.0, effectifs juillet 2026. Quand Anthropic publiera la v1.1 — et elle viendra — il faudra relire les quatre guides, détecter les objectifs qui changent, réécrire les chapitres touchés et revoir chaque question qui en dépendait.",
      ],
      [
        "Plus de questions, mieux vérifiées",
        "Chaque question de cette banque est passée par un relecteur adversarial qui a essayé de la faire tomber : chercher le fait faux, la double réponse défendable, le distracteur de paille. C'est ce processus qui coûte — et qui sépare une banque utile de mille questions de remplissage.",
      ],
      [
        "Couvrir ce que Partner Academy ne couvre pas dans votre langue",
        "Le matériel officiel de préparation est en anglais et derrière le Partner Network. Ce site est la tentative pour que ce ne soit pas la barrière entre quelqu'un et une certification.",
      ],
    ],
    otherTitle: "D'autres façons d'aider qui ne coûtent rien",
    other: [
      "Vous avez trouvé une question avec une erreur factuelle : dites-le. La corriger vaut plus que les cinq dollars.",
      "Partagez-le avec quelqu'un qui va passer l'examen. Le coût marginal d'un lecteur de plus est zéro.",
      "Si vous avez réussi avec ça, racontez-le — et dites ce qui manquait.",
    ],
    backCta: "← Retour au matériel",
    metaTitle: "Offrez-moi un café",
    metaDescription:
      "Ce matériel est gratuit et sans inscription. S'il vous a servi, un café (5, 10 ou 20 $) aide à le maintenir à jour quand Anthropic publie de nouvelles versions des exam guides.",
  },
};

/* ================================================================== JA */

const ja: Dict = {
  meta: {
    siteTitle: "Claude認定資格ガイド — 完全試験対策",
    template: "%s · Claude認定資格ガイド",
    description:
      "Anthropic公式4認定(Associate、Developer、Architect Foundations/Professional)の完全無料対策。ドメイン別チャプター、問題バンク、実際のブループリントに基づく模擬試験。",
    ogDescription: "Anthropic公式4認定のドメイン別チャプター、問題バンク、模擬試験。無料。",
  },
  nav: {
    skip: "コンテンツへスキップ",
    ruta: "学習ルート",
    coffee: "☕ コーヒーをおごる",
    themeToLight: "ライトモードに切り替え",
    themeToDark: "ダークモードに切り替え",
    brand: "Claude認定資格",
  },
  langSwitcher: "言語",
  footer: {
    blurb:
      "Anthropicの4つの認定資格のための無料学習教材。公式試験ガイドv1.0(2026年7月)とAnthropicの公開ドキュメントに基づいて構築。",
    disclaimer: "独立プロジェクトです。Anthropicとの提携・後援・承認はありません。「Claude」はAnthropic PBCの商標です。",
    certsLabel: "認定資格",
    linksLabel: "リンク",
    rutaLink: "学習ルート",
    coffeeLink: "コーヒーをおごる",
    officialReg: "公式登録 ↗",
    pearson: "Pearson VUE ↗",
  },
  banner: {
    title: "コンテンツが気に入ったら、コーヒーをおごってください。",
    sub: "このガイドは無料で、これからも無料です — コーヒー代は試験ガイドの各バージョンへの更新維持に使われます。",
    groupLabel: "サポート金額",
    tierTitleLive: (tag) => `${tag} — Stripeで単発支払い`,
    tierTitlePending: (tag) => `${tag} — サポートオプションを見る`,
  },
  tierTags: { 5: "コーヒー1杯", 10: "コーヒー2杯", 20: "1ヶ月分のコーヒー" },
  certTagline: {
    "CCAO-F": "実務でClaudeを使う:プロンプト、出力評価、Projects、リスク、エスカレーション。",
    "CCDV-F": "APIに対して構築する:Messages、バッチ、キャッシング、ストリーミング、ツール、MCP、エージェント。",
    "CCAR-F": "本番エージェントシステムの設計:オーケストレーション、MCP、Claude Code、構造化出力、コンテキスト。",
    "CCAR-P": "エンドツーエンドのソリューションアーキテクチャ:統合、評価、ガバナンス、ステークホルダー、ライフサイクル。",
  },
  home: {
    badge: "公式試験ガイドv1.0 · 2026年7月発効",
    h1a: "Claudeの4つの認定資格を、",
    h1b: "徹底的に研究し",
    h1c: "、あなたの言語で。",
    heroPara: (practice) =>
      `Anthropicは各試験のブループリントと少数のサンプル問題を公開しています。ここにはそれ以外のすべてがあります:公式目標の完全な解説、それらの目標に対して書かれ一問ずつ検証された${practice}問の練習問題、実際のドメイン配分の模擬試験、そして誤答選択肢の構築パターン。`,
    ctaAssociate: "Associateから始める",
    ctaRoute: "完全ルートを見る",
    statQuestions: "問題数",
    statOfficial: (n) => `公式${n}問`,
    statDomains: "ドメイン",
    statObjectives: (n) => `${n}の目標`,
    statWords: "語数",
    statWordsSub: "チャプター合計",
    statCost: "総費用",
    statCostSub: "4試験合計",
    fichaKicker: "支払う前に知っておくべきこと",
    ficha: [
      ["合格ライン", "スケールスコア720/1000 — 正答率72%ではありません。素点→スケールの変換は非公開です。"],
      ["形式", "多肢選択と複数回答。120分。監督付き(Pearson VUE、オンラインまたは会場)。"],
      ["前提条件", "なし。4試験は独立しており、好きな順序で受験できます。"],
      ["再受験", "12ヶ月間で各試験最大4回。待機期間は14日、30日、90日。毎回受験料が必要。"],
      ["有効期間", "12ヶ月。期限内の更新は無料。失効すると全額を再度支払います。"],
    ],
    credsTitle: "4つの認定資格",
    credsKicker: "肩書きではなく役割で選ぶ",
    items: (n) => `${n}問`,
    domains: (n) => `${n}ドメイン`,
    questionsHere: (n) => `当サイト${n}問`,
    heaviest: (d, w) => `最重要:D${d}(${w}%)`,
    study: "学習する →",
    howTitle: "使い方",
    howSteps: [
      {
        n: "01",
        t: "チャプターの前にデコーダーを読む",
        d: "各試験には構築パターンがあります。公式問題がそれを明かします:正解のアーキタイプが1つ、誤答のアーキタイプが4つ。それらを見抜ければ、暗記していない問題も解けます。",
      },
      {
        n: "02",
        t: "順番ではなく比重でドメインを攻める",
        d: "Associateでは3ドメインで試験の半分。Developerでは1ドメインだけで33%。「最初だから」ドメイン1から学ぶのは時間の無駄 — 当サイトはインパクト順に並べます。",
      },
      {
        n: "03",
        t: "まず練習、最後に模擬試験",
        d: "練習モードは解説と各誤答選択肢の分析を即座に返します。模擬試験は実際のブループリントをタイマー付き・フィードバックなしで再現し、ドメイン別の内訳を返します。",
      },
    ],
    donateKicker: "無料、ペイウォールなし",
    donateTitle: "不合格を1回防げたなら、コーヒー1杯以上の価値があったはず。",
    donatePara:
      "すべての教材は無料で、これからも無料です。Architect再受験は125ドル。このガイドがその出費を防いだなら、5ドルは妥当な交換です — そしてAnthropicがv1.1を公開したときの更新資金になります。",
    donateCta: "☕ コーヒーをおごる",
  },
  cert: {
    practicar: (n) => `練習する · ${n}問`,
    simulacro: "タイマー付き模擬試験",
    decodificador: "試験デコーダー",
    fichaLabels: ["問題数", "分", "合格ライン", "受験料", "有効期間", "ドメイン"],
    whereTitle: "試験の本当の在り処",
    whereKicker: "比重順",
    wherePara: (top3, pct) => ["3つのドメイン — ", ` — が問題の${pct}%を占めます。`, "時間が限られているなら、そこに1時間ずつ投資する価値があります。"],
    domainLabel: (n) => `ドメイン${n}`,
    objectivesCount: (n) => `公式目標${n}件`,
    examItems: (n) => `試験で約${n}問`,
    questionsHere: (n) => `当サイト${n}問`,
    forWhoTitle: "対象者",
    mqcLabel: "最低限の資格を持つ受験者像",
    notForLabel: "対象外の人",
    rulesTitle: "ルール",
    ruleKeys: ["採点", "再受験", "再認定", "前提条件", "言語"],
    logisticsCta: "登録、Pearson VUE、試験当日 →",
    sourceLabel: "出典",
    metaDescription: (nameEs, domains, questions, items, minutes) =>
      `${nameEs}の完全ガイド:${domains}ドメイン、${questions}問の練習問題、公式ブループリントの模擬試験。${items}問、${minutes}分、合格720/1000。`,
  },
  domain: {
    breadcrumb: (n) => `ドメイン${n}`,
    domainOf: (n, total) => `ドメイン${n}/${total}`,
    itemsOf: (est, total) => `${total}問中約${est}問`,
    objectivesKicker: "公式目標 · 試験ガイドからの原文",
    notPublished: "このドメインのチャプターはまだ公開されていません。",
    untranslated: "このチャプターはまだこの言語に翻訳されていません。スペイン語で表示しています。",
    thisDomain: "このドメイン",
    weight: "比重",
    estItems: "推定問題数",
    objectives: "目標",
    questions: "問題",
    reading: "読了時間",
    readingMin: (min) => `約${min}分`,
    practiceDomain: "このドメインを練習",
    otherDomains: "他のドメイン",
    prev: (n, w) => `← ドメイン${n} · ${w}%`,
    next: (n, w) => `ドメイン${n} · ${w}% →`,
    metaTitle: (n, title, w, code) => `D${n}:${title}(${w}%)— ${code}`,
    metaDescription: (n, code, objectives) =>
      `${code}のドメイン${n}の完全チャプター:公式目標${objectives}件、主要概念、例、よくある間違い、用語集、チェックリスト。`,
  },
  decoder: {
    breadcrumb: "デコーダー",
    title: "デコーダー",
    intro: (code, n) =>
      `多肢選択試験は記憶力テストではなく、ルールで構築された人工物です。これは${code}のルール — Anthropicが公開した${n}問のサンプルと試験ガイドの言葉遣いから導出しました。`,
    notYet: "まだ公開されていません。",
    untranslated: "デコーダーはまだこの言語に翻訳されていません。スペイン語で表示しています。",
    dissectTitle: "公式問題の解剖",
    dissectPara: (n) =>
      `この${n}問はAnthropicがこの試験のために公開した唯一の本物の問題です。創作の100問より価値があります:これがキャリブレーションのサンプルです。`,
    seeDissection: "解剖を見る ↓",
    officialRationale: "公式の根拠",
    teaches: "ここから学べること",
    trap: "罠:",
    applyPractice: "練習で応用する",
    backTo: (code) => `${code}に戻る`,
    metaTitle: (code) => `試験デコーダー — ${code}`,
    metaDescription: (name) => `${name}の問題の構築方法:正解のアーキタイプ、各誤答選択肢の役割、消去テクニック。`,
  },
  logistics: {
    breadcrumb: "手続き",
    title: "登録と試験当日",
    intro: (code) =>
      `${code}の運用面のすべて:Partner Academyでのチェックアウトから、破ると試験が無効になるルールまで。`,
    regTitle: "登録の手順",
    officialRegCta: "公式登録へ ↗",
    rulesTitle: "試験当日のルール",
    prepTitle: "Anthropic推奨の準備方法",
    practice: "練習する",
    backTo: (code) => `${code}に戻る`,
    metaTitle: (code) => `登録と試験当日 — ${code}`,
    metaDescription: (name) =>
      `${name}の登録方法、Pearson VUEでの予約、当日の流れ、行動規範、再受験、再認定。`,
  },
  practice: {
    breadcrumb: "練習",
    title: "ガイド付き練習",
    titleRunning: (cert) => `練習 · ${cert}`,
    sub: (certName) => `各問題は解説と、各誤答選択肢が間違っている理由をその場で返します。${certName}。`,
    domainsKicker: "ドメイン",
    all: "すべて",
    none: "なし",
    top3: "最重要3つのみ",
    top3Title: "試験で最も比重の大きい3ドメイン",
    filterKicker: "フィルター",
    filters: { all: "すべて", unseen: "未回答", failed: "不正解", official: "公式" },
    howMany: "問題数",
    allSizeLabel: "すべて",
    inSession: (of) => `問をこのセッションで · ${of}問中`,
    start: "開始",
    changeSelection: "← 選択を変更",
    loading: "読み込み中…",
    metaTitle: (code) => `練習 — ${code}`,
    metaDescription: (name) => `${name}の練習問題バンク。全問に解説と誤答選択肢ごとの分析付き。`,
  },
  quiz: {
    noQuestions: "この選択に該当する問題がありません。",
    of: "/",
    flag: "◇ マーク",
    flagged: "◆ マーク済み",
    answered: (n) => `${n}問回答済み`,
    scenario: "シナリオ:",
    multiResponse: "複数回答",
    officialBadge: "★ 公式",
    officialTooltip: "Anthropicが公式試験ガイドで公開したサンプル問題",
    diff: { easy: "易", medium: "中", hard: "難" },
    correct: "正解",
    incorrect: (keys) => `不正解 — 答えは${keys}`,
    officialRationaleLabel: "Anthropicの公式根拠:",
    whyFail: "他の選択肢が間違っている理由",
    trap: "罠:",
    objective: "測定される目標:",
    prev: "← 前へ",
    check: "確認",
    next: "次へ →",
    finish: "終了してレポートを見る",
    deliver: "提出",
    confirmDeliver: (answered, total) => `${total}問中${answered}問回答で模擬試験を提出しますか?`,
    navigation: "ナビゲーション",
    goTo: (n, answered) => `問題${n}へ${answered ? "(回答済み)" : ""}`,
    resultMock: "模擬試験の結果",
    resultPractice: "セッションの結果",
    scaledLabel: "推定スケールスコア · 100–1000",
    hits: (pct) => `正答 · 素点${pct}%`,
    timeSpent: "所要時間",
    abovePass: (pass) => `このシミュレーションでは合格ライン(${pass})を上回っています。`,
    belowPass: (pass) => `このシミュレーションでは合格ライン(${pass})を下回っています。`,
    scaledNote1: "Anthropicは素点→スケールの変換を公開していないため、この数字は",
    scaledNoteStrong: "線形推定",
    scaledNote2: "であり、予測ではありません。信号機として扱い、判定としては扱わないこと:受験料を払う前に素点80%以上を目指しましょう。",
    byDomain: "ドメイン別内訳",
    reviewChapter: (d) => `→ ドメイン${d}のチャプターを復習`,
    reviewTitle: (n) => `全${n}問のレビュー`,
    anotherRound: "もう一度",
    backTo: (cert) => `${cert}に戻る`,
  },
  mock: {
    breadcrumb: "模擬試験",
    title: "タイマー付き模擬試験",
    sub: (items, certName, minutes) =>
      `${certName}の公式ブループリントとまったく同じ配分で${items}問を出題。${minutes}分のタイマー、提出までフィードバックなし、選択肢はシャッフル。`,
    mixKicker: "この模擬試験の配分",
    itemsPct: (items, weight) => `${items}問 · ${weight}%`,
    shortfall: (list) =>
      `問題バンクにはまだ${list}をブループリントの100%まで満たす問題がありません。そのドメインは現状の問題数で実施されます。`,
    stats: {
      items: "問題数",
      time: "時間",
      timeValue: (m) => `${m}分`,
      pass: "合格ライン",
      feedback: "フィードバック",
      feedbackValue: "提出時",
    },
    start: "模擬試験を開始",
    timerNote: (m) => `クリックでタイマーが始まります。中断のない${m}分を確保してください — 本番は一時停止できません。`,
    historyTitle: "あなたの模擬試験",
    raw: (correct, total, pct) => `${correct}/${total} · 素点${pct}%`,
    minutes: (m) => `${m}分`,
    metaTitle: (code) => `模擬試験 — ${code}`,
    metaDescription: (name, items, minutes) =>
      `${name}のタイマー付き模擬試験:${minutes}分で${items}問、公式ブループリントのドメイン配分。`,
  },
  flashcards: {
    title: "ドメイン用語集",
    cards: "カード",
    table: "表",
    termOf: (i, n) => `用語 ${i}/${n}`,
    reveal: "クリックで表示",
    flipAria: "カードをめくる",
    colEn: "用語(EN)",
    colLocal: "訳",
    colMeaning: "意味",
  },
  checklist: {
    kicker: "ドメインチェックリスト",
    progress: (done, total) => `${done} / ${total}`,
    mastered: "· 習得済み",
    hint: "正直にチェックできない項目があれば、それが次の1時間の学習対象です。",
  },
  markRead: { done: "✓ 読了", mark: "読了にする" },
  domainProgress: { read: "✓ 読了", noData: "データなし" },
  dash: {
    emptyTitle: "進捗がここに表示されます",
    emptyPara:
      "最初の問題に回答するか、チャプターを読了にすると、このパネルが埋まります:ドメイン別の正答率、読了チャプター、模擬試験の履歴。すべてブラウザ内に保存 — アカウント不要、サーバーなし。",
    emptyCta: "最初の1問に回答",
    title: "あなたの進捗",
    clear: "すべて削除",
    confirmClear: "進捗をすべて削除しますか?元に戻せません。",
    statAnswered: "回答済み問題",
    statAccuracy: "全体正答率",
    statChapters: "読了チャプター",
    statMocks: "模擬試験",
    chapters: "チャプター",
    pctOf: (pct, total) => `${total}問中${pct}%`,
    lastMockTitle: "直近の模擬試験(推定スケール)",
  },
  ruta: {
    kicker: "完全ルート",
    title: (fee) => `4つの試験、$${fee}、そして自明ではない順序。`,
    intro:
      "4試験は独立しており、前提条件なし・順不同で受験できます。しかし内容は積み重なります。この順序 — 安い順、FoundationsをProfessionalより先に — なら、各試験が次の試験の一部を先払いしてくれます。",
    orderTitle: "推奨順序",
    plan: [
      {
        code: "CCAO-F",
        weeks: "第1–3週",
        why: "最も安い入口($99)で、コード不要の唯一の試験。その内容 — 出力評価、モデル選択、リスク — は他の3試験にも再登場するため、最初に学ぶと後がすべて楽になります。",
        focus: "D2(Output Evaluation)から。それだけで試験の21%。",
      },
      {
        code: "CCDV-F",
        weeks: "第4–7週",
        why: "技術的負債を払う場所:Messages API、バッチ、プロンプトキャッシング、ストリーミング、ツール、MCP。1ドメイン — Applications and Integration — だけで試験の3分の1。制覇すれば道半ば。",
        focus: "D2(33.1%)+ D5(16.8%)= 2ドメインで試験の半分。",
      },
      {
        code: "CCAR-F",
        weeks: "第8–12週",
        why: "最も密度の高い試験:29のタスクステートメントと長い本番シナリオに基づく問題。最も文書化された試験でもあり、試験ガイドには12のサンプル問題と4つの演習 — 他の3試験の合計より多い。",
        focus: "D1(Agentic Architecture、27%)が軸。最後に飛ばずにシナリオ全文を読む練習を。",
      },
      {
        code: "CCAR-P",
        weeks: "第13–17週",
        why: "Professionalレベルはレンズを変えます:どう作るかではなく、顧客の前でどう擁護するか — 統合、評価、ガバナンス、ステークホルダー。最後に:最も高価($175)で、前のすべてに最も依存します。",
        focus: "3つのソフトドメイン(Governance、Stakeholders、Lifecycle)で35%。「非技術的」と侮らないこと。",
      },
    ],
    hoursLabel: "時間を投資すべき場所:",
    temario: "チャプター",
    truthsTitle: "支払う前に知っておくべき5つのこと",
    truths: [
      {
        t: "720/1000は72%ではない",
        d: "これはスケールです。Anthropicは素点からスケールスコアへの変換を公開していないため、誰も — このサイトも — 何問正解すればよいか言えません。唯一安全な戦略は、模擬試験で素点80%以上を目指すことです。",
      },
      {
        t: "毎回の受験にお金がかかる",
        d: "Architect Professionalに落ちると、また$175。待機期間もあります:1回目の不合格後14日、2回目後30日、3回目後90日。12ヶ月間で各試験4回まで。",
      },
      {
        t: "認定は12ヶ月で失効する",
        d: "期限内の更新は無料(監督なしの評価)。失効させると試験全額を再度支払います。リマインダーは12ヶ月目ではなく11ヶ月目に。",
      },
      {
        t: "試験は英語",
        d: "当サイトの解説はあなたの言語ですが、練習問題の本文はあえて英語です:本番当日に翻訳はありません。各ドメインに用語集が付いています。",
      },
      {
        t: "必須コースはない",
        d: "Anthropicはいかなるコースも要求せず、どのコースも合格を保証しません。Partner Academyの対策コースはリソースの1つであり、チケットではありません。",
      },
      {
        t: "ブループリントが契約書",
        d: "問題は公開された目標に対して書かれます。ブループリントにないものは出題されず、あるものはすべて出題されます。文字通り、知るべきことのリストです。",
      },
    ],
    metaTitle: "学習ルート",
    metaDescription:
      "Claudeの4認定をどの順序で攻めるか、完全ルートの費用、各ドメインの実際の比重に基づく週別学習プラン。",
  },
  donar: {
    kicker: "ペイウォールなし、登録なし、広告なし",
    title: "役に立ったら、コーヒーをおごってください。",
    intro: (questions) =>
      `このサイトに有料コンテンツはありません。4つの学習トラック、${questions}問の問題、模擬試験、デコーダーはすべて無料で、寄付の有無にかかわらず無料のままです。`,
    mathKicker: "計算",
    math1a: "Architect再受験は",
    math1b: (fee) => `$125。完全ルートは$${fee}。`,
    math1c: "このガイドが不合格を1回防げば、このページが求める額の25倍の節約です。",
    math2: "余裕がない、あるいは単に気が進まないなら:そのまま全部使ってください。本当に。合格のためにあるのであって、課金のためではありません。",
    payOnce: "単発支払い · Stripe",
    orAnyAmount: "または好きな金額で。",
    stripeGo: "Stripe ↗",
    soon: "近日公開",
    pendingKicker: "支払いリンク準備中",
    pendingPara1: "StripeのPayment Linksはまだ設定されていません。有効化するには",
    pendingPara2: "をプロジェクトの環境変数に設定します。",
    stripeNote:
      "支払いはStripeが処理します。このサイトはカード情報を見ることも保存することもありません — 実際、何も保存しません:サーバーなし、アカウントなし、アナリティクスなし。学習進捗はブラウザ内にのみ存在します。",
    whereTitle: "使い道",
    where: [
      [
        "チャプターを最新に保つ",
        "試験ガイドはv1.0(2026年7月発効)。Anthropicがv1.1を公開したら — 必ず来ます — 4つのガイドを読み直し、変わった目標を検出し、影響を受けるチャプターを書き直し、それらに依存する全問題をレビューします。",
      ],
      [
        "より多く、より検証された問題",
        "このバンクの全問題は、落とそうとする敵対的レビュアーを通過しています:偽の事実、二重に擁護可能な答え、わら人形の誤答選択肢を探す。そのプロセスこそがコストであり、有用なバンクと千問の埋め草を分けるものです。",
      ],
      [
        "Partner Academyがあなたの言語でカバーしないものをカバーする",
        "公式対策教材は英語で、Partner Networkの内側にあります。このサイトは、それが誰かと認定資格の間の障壁にならないようにする試みです。",
      ],
    ],
    otherTitle: "お金のかからない協力方法",
    other: [
      "事実誤認のある問題を見つけたら教えてください。修正は5ドルより価値があります。",
      "受験予定の人に共有してください。読者が1人増える限界費用はゼロです。",
      "これで合格したら、その話を聞かせてください — 何が足りなかったかも。",
    ],
    backCta: "← 教材に戻る",
    metaTitle: "コーヒーをおごる",
    metaDescription:
      "この教材は無料・登録不要です。役に立ったなら、コーヒー($5、$10、$20)がAnthropicの新しい試験ガイド公開時の更新を支えます。",
  },
};

export const STR: Record<Lang, Dict> = { es, en, fr, ja };
export const t = (lang: Lang): Dict => STR[lang] ?? STR.es;
