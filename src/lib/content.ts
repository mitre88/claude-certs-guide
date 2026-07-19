import bundleEs from "@/content/bundle.es.json";
import bundleEn from "@/content/bundle.en.json";
import bundleFr from "@/content/bundle.fr.json";
import bundleJa from "@/content/bundle.ja.json";
import { CERT_FEES, type Lang } from "@/lib/i18n";

/**
 * SERVER-ONLY: este módulo importa los cuatro bundles (uno por idioma) y no
 * debe importarse desde client components — arrastraría todos los bundles al
 * JS del navegador. Los client components reciben datos ya recortados vía
 * props desde sus páginas server.
 *
 * Nota de nombres: los campos *Es (nameEs, titleEs, explanationEs…) son
 * históricos; en cada bundle llevan el texto del idioma de ese bundle.
 */

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
  translated: boolean;
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
  decoderTranslated: boolean;
  logisticsTranslated: boolean;
  factsTranslated: boolean;
  questions: Question[];
  blueprint: { n: number; weight: number; items: number }[];
  stats: { questions: number; official: number; practice: number; words: number };
};

const BUNDLES: Record<Lang, { certs: Cert[] }> = {
  es: bundleEs as unknown as { certs: Cert[] },
  en: bundleEn as unknown as { certs: Cert[] },
  fr: bundleFr as unknown as { certs: Cert[] },
  ja: bundleJa as unknown as { certs: Cert[] },
};

/** Orden recomendado de ataque: barato → caro, Foundations antes que Professional. */
export const ORDER = ["CCAO-F", "CCDV-F", "CCAR-F", "CCAR-P"];

export const certs = (lang: Lang): Cert[] =>
  [...BUNDLES[lang].certs].sort((a, b) => ORDER.indexOf(a.code) - ORDER.indexOf(b.code));

export const cert = (lang: Lang, code: string): Cert | undefined =>
  BUNDLES[lang].certs.find((c) => c.code.toLowerCase() === code.toLowerCase());

export const domain = (lang: Lang, code: string, n: number): Domain | undefined =>
  cert(lang, code)?.domains.find((d) => d.n === n);

export const questionsFor = (lang: Lang, code: string, domainN?: number): Question[] => {
  const qs = cert(lang, code)?.questions ?? [];
  return domainN ? qs.filter((q) => q.domain === domainN) : qs;
};

export const totalFee = () => ORDER.reduce((s, code) => s + (CERT_FEES[code] ?? 0), 0);

export const globalStats = (lang: Lang) => {
  const cs = certs(lang);
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
