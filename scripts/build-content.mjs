/**
 * Reads the raw study material produced by the content pipeline and emits one
 * typed JSON bundle PER LOCALE the app imports at build time. Markdown becomes
 * HTML here so the runtime ships no parser.
 *
 * Locales: es is the source of truth (CERT_CONTENT_DIR). Translations live as
 * OVERLAYS in CERT_I18N_DIR/<lang>/<CERT>/… mirroring the source layout:
 *   domains/dN.md         → replaces the chapter (glossary/checklist re-extracted)
 *   decoder.md            → replaces the decoder
 *   logistics.md          → replaces the logistics prose
 *   facts.json            → PARTIAL: translated prose fields merge over the source
 *   questions/dN.json     → per-question overlay by id: {explanationEs, distractorsEs, trap, scenario}
 *   official-samples.json → per-question overlay by id (same fields; trapPattern accepted)
 * Anything missing falls back to Spanish, so every locale ships complete today
 * and becomes fully translated as overlays land. Question stems/options are
 * NEVER overlaid: the real exam is in English and they stay in English.
 *
 * Note: localized text is stored under the same field names the app already
 * reads (nameEs, titleEs, explanationEs, …) — "Es" is historical; per-locale
 * bundles carry that locale's language in those fields.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')
const SOURCE = process.env.CERT_CONTENT_DIR || join(REPO, 'content')
const I18N = process.env.CERT_I18N_DIR || join(SOURCE, '..', 'content-i18n')
const OUT_DIR = join(REPO, 'src', 'content')

const CODES = ['CCAO-F', 'CCDV-F', 'CCAR-F', 'CCAR-P']
const LOCALES = ['es', 'en', 'fr', 'ja']

/** facts.json prose fields a translation overlay may replace at the top level. */
const FACT_PROSE_FIELDS = [
  'nameEs', 'audience', 'mqc', 'notFor', 'delivery', 'prerequisites', 'languages',
  'retakePolicy', 'recertification', 'scoring', 'fee',
  'examDayRules', 'howToPrepare', 'registrationSteps', 'questionTypes',
]

const highlighter = await createHighlighter({
  themes: ['vitesse-light', 'vitesse-dark'],
  langs: ['python', 'typescript', 'javascript', 'json', 'bash', 'yaml', 'markdown', 'xml', 'text'],
})

const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text'
      return highlighter.codeToHtml(text, {
        lang: language,
        themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
        defaultColor: false,
      })
    },
    table(token) {
      const header = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('')
      const body = token.rows
        .map((row) => `<tr>${row.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`)
        .join('')
      return `<div class="table-scroll"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`
    },
  },
})

const exists = async (p) => access(p).then(() => true, () => false)
const readJson = async (p) => (await exists(p)) ? JSON.parse(await readFile(p, 'utf8')) : null
const readText = async (p) => (await exists(p)) ? await readFile(p, 'utf8') : null

/** Pull the glossary table and checklist list out of a domain chapter so the
 *  app can render them as interactive widgets instead of inert prose. The
 *  section headings differ per language. */
const GLOSSARY_RX = /##\s*(?:Glosario|Glossary|Glossaire|用語集)[^\n]*\n([\s\S]*?)(?=\n##\s|\n?$)/i
const CHECKLIST_RX = /##\s*(?:Checklist|Liste de contrôle|チェックリスト)[^\n]*\n([\s\S]*?)(?=\n##\s|\n?$)/i

function extractSections(md) {
  const glossary = []
  const checklist = []
  const glossaryBlock = md.match(GLOSSARY_RX)
  if (glossaryBlock) {
    for (const line of glossaryBlock[1].split('\n')) {
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
      if (cells.length < 2) continue
      if (/^-+$/.test(cells[0].replace(/[:\s]/g, '-'))) continue
      if (/^(t[eé]rmino|term|terme|用語)/i.test(cells[0])) continue
      glossary.push({ en: cells[0], es: cells[1] || '', meaning: cells[2] || '' })
    }
  }
  const checklistBlock = md.match(CHECKLIST_RX)
  if (checklistBlock) {
    for (const line of checklistBlock[1].split('\n')) {
      const m = line.match(/^\s*(?:[-*]|\d+\.)\s*(?:\[[ x]\]\s*)?(.+)$/)
      if (m && m[1].trim().length > 8) checklist.push(m[1].trim())
    }
  }
  return { glossary, checklist }
}

const normalizeQuestion = (q, code, fallbackDomain) => ({
  id: q.id,
  cert: q.cert || code,
  domain: Number(q.domain ?? fallbackDomain),
  source: q.source || 'practice',
  difficulty: q.difficulty || 'medium',
  type: q.type || (Array.isArray(q.correct) && q.correct.length > 1 ? 'multiple-response' : 'multiple-choice'),
  objective: q.objective || q.taskStatement || '',
  scenario: q.scenario || '',
  stem: q.stem,
  options: q.options,
  correct: Array.isArray(q.correct) ? q.correct : [q.correct],
  explanationEs: q.explanationEs || q.officialRationale || '',
  officialRationale: q.officialRationale || '',
  distractorsEs: q.distractorsEs || {},
  trap: q.trap || q.trapPattern || '',
  tags: q.tags || [],
})

/** Apply a per-question translation overlay (matched by id) to a normalized question. */
function applyQuestionOverlay(q, ov) {
  if (!ov) return q
  return {
    ...q,
    scenario: ov.scenario ?? q.scenario,
    explanationEs: ov.explanationEs ?? ov.explanation ?? q.explanationEs,
    distractorsEs: ov.distractorsEs ?? ov.distractors ?? q.distractorsEs,
    trap: ov.trap ?? ov.trapPattern ?? q.trap,
  }
}

async function buildLocale(locale) {
  const bundle = { locale, generatedAt: new Date().toISOString(), certs: [] }

  for (const code of CODES) {
    const base = join(SOURCE, code)
    if (!(await exists(base))) {
      console.warn(`⚠  falta ${code} — se omite`)
      continue
    }
    const over = join(I18N, locale, code)
    const isEs = locale === 'es'

    const baseFacts = await readJson(join(base, 'facts.json'))
    if (!baseFacts) throw new Error(`${code}: falta facts.json`)

    // ---- facts: partial overlay of prose fields + per-domain titleEs
    let facts = structuredClone(baseFacts)
    let factsTranslated = isEs
    if (!isEs) {
      const ovFacts = await readJson(join(over, 'facts.json'))
      if (ovFacts) {
        factsTranslated = true
        for (const f of FACT_PROSE_FIELDS) if (ovFacts[f] !== undefined) facts[f] = ovFacts[f]
        if (Array.isArray(ovFacts.domains)) {
          for (const od of ovFacts.domains) {
            const target = facts.domains.find((d) => d.n === od.n)
            if (target && od.titleEs) target.titleEs = od.titleEs
          }
        }
      }
    }

    // ---- decoder / logistics: whole-file overlay
    const decoderSrc = (!isEs && (await readText(join(over, 'decoder.md')))) || (await readText(join(base, 'decoder.md'))) || ''
    const decoderTranslated = isEs || (await exists(join(over, 'decoder.md')))
    const logisticsSrc = (!isEs && (await readText(join(over, 'logistics.md')))) || (await readText(join(base, 'logistics.md'))) || ''
    const logisticsTranslated = isEs || (await exists(join(over, 'logistics.md')))

    const decoderHtml = decoderSrc ? await marked.parse(decoderSrc) : ''
    const logisticsHtml = logisticsSrc ? await marked.parse(logisticsSrc) : ''

    // ---- official samples + per-locale overlay
    const officialRaw = (await readJson(join(base, 'official-samples.json'))) || []
    const officialOv = isEs ? null : await readJson(join(over, 'official-samples.json'))
    const officialOvById = new Map((officialOv || []).map((o) => [o.id, o]))
    const official = officialRaw.map((q) =>
      applyQuestionOverlay(normalizeQuestion({ ...q, source: 'official' }, code), officialOvById.get(q.id)),
    )

    const domains = []
    const questions = [...official]

    for (const d of facts.domains) {
      // chapter: overlay whole-file, else fallback
      const basePath = join(base, 'domains', `d${d.n}.md`)
      const overPath = join(over, 'domains', `d${d.n}.md`)
      const useOverlay = !isEs && (await exists(overPath))
      const raw = (useOverlay ? await readText(overPath) : await readText(basePath)) || ''
      const translated = isEs || useOverlay
      const { glossary, checklist } = extractSections(raw)
      // The domain page already renders the title, weight and objectives from facts,
      // so the chapter's own leading H1 would print it a second time.
      const body = raw.replace(/^#\s+[^\n]*\n+/, '')
      domains.push({
        n: d.n,
        title: d.title,
        titleEs: d.titleEs || d.title,
        weight: d.weight,
        objectives: d.objectives || [],
        html: body ? await marked.parse(body) : '',
        words: raw ? raw.split(/\s+/).length : 0,
        glossary,
        checklist,
        translated,
      })

      // questions: base + per-id overlay
      const qs = (await readJson(join(base, 'questions', `d${d.n}.json`))) || []
      const qOv = isEs ? null : await readJson(join(over, 'questions', `d${d.n}.json`))
      const qOvById = new Map((qOv || []).map((o) => [o.id, o]))
      for (const q of qs) {
        const norm = normalizeQuestion(q, code, d.n)
        questions.push(applyQuestionOverlay(norm, qOvById.get(norm.id)))
      }
    }

    // A mock exam mirrors the real blueprint: items are drawn per domain in proportion to weight.
    const blueprint = facts.domains.map((d) => ({
      n: d.n,
      weight: d.weight,
      items: Math.max(1, Math.round((d.weight / 100) * facts.items)),
    }))

    bundle.certs.push({
      ...facts,
      decoderHtml,
      logisticsHtml,
      decoderTranslated,
      logisticsTranslated,
      factsTranslated,
      domains,
      questions,
      blueprint,
      stats: {
        questions: questions.length,
        official: official.length,
        practice: questions.length - official.length,
        words: domains.reduce((s, d) => s + d.words, 0),
      },
    })
  }

  return bundle
}

await mkdir(OUT_DIR, { recursive: true })

for (const locale of LOCALES) {
  const bundle = await buildLocale(locale)
  await writeFile(join(OUT_DIR, `bundle.${locale}.json`), JSON.stringify(bundle))
  const totalQ = bundle.certs.reduce((s, c) => s + c.stats.questions, 0)
  const translated = bundle.certs.reduce((s, c) => s + c.domains.filter((d) => d.translated).length, 0)
  const totalD = bundle.certs.reduce((s, c) => s + c.domains.length, 0)
  console.log(
    `✓ bundle.${locale}: ${bundle.certs.length} certs · ${totalQ} preguntas · capítulos traducidos ${translated}/${totalD}`,
  )
  for (const c of bundle.certs) {
    const thin = c.domains.filter((d) => d.words < 500).map((d) => `d${d.n}`)
    if (locale === 'es' && thin.length) console.log(`  ${c.code.padEnd(8)} ⚠ delgados: ${thin.join(',')}`)
  }
}
