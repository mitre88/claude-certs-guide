import bundle from "@/content/bundle.json";

export type Question = {
  id: string;
  cert: string;
  domain: number;
  source: "official" | "practice";
  difficulty: "easy" | "medium" | "hard";
  type: "multiple-choice" | "multiple-response";
  objective: string;
  scenario: string;
  stem: string;
  options: { key: string; text: string }[];
  correct: string[];
  explanationEs: string;
  officialRationale: string;
  distractorsEs: Record<string, string>;
  trap: string;
  tags: string[];
};

export type Domain = {
  n: number;
  title: string;
  titleEs: string;
  weight: number;
  objectives: string[];
  html: string;
  words: number;
  glossary: { en: string; es: string; meaning: string }[];
  checklist: string[];
};

export type Cert = {
  code: string;
  name: string;
  nameEs: string;
  version: string;
  effective: string;
  fee: string;
  items: number;
  scoredItems: number;
  minutes: number;
  passScaled: number;
  validityMonths: number;
  delivery: string;
  prerequisites: string;
  languages: string;
  questionTypes: string[];
  audience: string;
  mqc: string;
  notFor: string;
  domains: Domain[];
  retakePolicy: string;
  recertification: string;
  examDayRules: string[];
  scoring: string;
  howToPrepare: string[];
  registrationSteps: string[];
  sources: string[];
  decoderHtml: string;
  logisticsHtml: string;
  questions: Question[];
  blueprint: { n: number; weight: number; items: number }[];
  stats: { questions: number; official: number; practice: number; words: number };
};

const CERTS = (bundle as { certs: Cert[] }).certs;

/** Orden recomendado de ataque: barato → caro, Foundations antes que Professional. */
export const ORDER = ["CCAO-F", "CCDV-F", "CCAR-F", "CCAR-P"];

export const certs = (): Cert[] =>
  [...CERTS].sort((a, b) => ORDER.indexOf(a.code) - ORDER.indexOf(b.code));

export const cert = (code: string): Cert | undefined =>
  CERTS.find((c) => c.code.toLowerCase() === code.toLowerCase());

export const domain = (code: string, n: number): Domain | undefined =>
  cert(code)?.domains.find((d) => d.n === n);

export const questionsFor = (code: string, domainN?: number): Question[] => {
  const qs = cert(code)?.questions ?? [];
  return domainN ? qs.filter((q) => q.domain === domainN) : qs;
};

/** Metadatos editoriales que no vienen del exam guide. */
export const CERT_META: Record<
  string,
  { role: string; tagline: string; feeNum: number; level: "Foundations" | "Professional" }
> = {
  "CCAO-F": {
    role: "Associate",
    tagline: "Usar Claude para trabajo real de negocio: prompts, evaluación del output, Projects, riesgo y escalamiento.",
    feeNum: 99,
    level: "Foundations",
  },
  "CCDV-F": {
    role: "Developer",
    tagline: "Construir contra la API: Messages, batches, caching, streaming, tools, MCP y agentes.",
    feeNum: 125,
    level: "Foundations",
  },
  "CCAR-F": {
    role: "Architect",
    tagline: "Diseñar sistemas agénticos de producción: orquestación, MCP, Claude Code, structured output, contexto.",
    feeNum: 125,
    level: "Foundations",
  },
  "CCAR-P": {
    role: "Architect",
    tagline: "Arquitectura de solución end-to-end: integración, evaluación, governance, stakeholders, ciclo de vida.",
    feeNum: 175,
    level: "Professional",
  },
};

export const totalFee = () =>
  certs().reduce((s, c) => s + (CERT_META[c.code]?.feeNum ?? 0), 0);

export const globalStats = () => {
  const cs = certs();
  return {
    certs: cs.length,
    domains: cs.reduce((s, c) => s + c.domains.length, 0),
    questions: cs.reduce((s, c) => s + c.stats.questions, 0),
    official: cs.reduce((s, c) => s + c.stats.official, 0),
    words: cs.reduce((s, c) => s + c.stats.words, 0),
    objectives: cs.reduce(
      (s, c) => s + c.domains.reduce((t, d) => t + d.objectives.length, 0),
      0,
    ),
  };
};

/** Construye un simulacro con la misma mezcla por dominio que el examen real. */
export function buildMock(code: string, seed = Date.now()): Question[] {
  const c = cert(code);
  if (!c) return [];
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const pick: Question[] = [];
  for (const b of c.blueprint) {
    const pool = c.questions.filter((q) => q.domain === b.n);
    // Fisher-Yates con PRNG sembrado: el mismo seed reproduce el mismo examen.
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    pick.push(...shuffled.slice(0, Math.min(b.items, shuffled.length)));
  }
  for (let i = pick.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pick[i], pick[j]] = [pick[j], pick[i]];
  }
  return pick;
}

export const DONATE_URL =
  process.env.NEXT_PUBLIC_STRIPE_DONATE_URL ?? "";
