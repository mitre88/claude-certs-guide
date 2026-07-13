/**
 * Reads the raw study material produced by the content pipeline and emits a single
 * typed JSON bundle the app imports at build time. Markdown becomes HTML here so the
 * runtime ships no parser.
 */
import { readFile, readdir, writeFile, mkdir, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')
const SOURCE = process.env.CERT_CONTENT_DIR || join(REPO, 'content')
const OUT = join(REPO, 'src', 'content', 'bundle.json')

const CODES = ['CCAO-F', 'CCDV-F', 'CCAR-F', 'CCAR-P']

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
const readMd = async (p) => (await exists(p)) ? marked.parse(await readFile(p, 'utf8')) : ''

/** Pull the `## Glosario` table and `## Checklist` list out of a domain chapter so the
 *  app can render them as interactive widgets instead of inert prose. */
function extractSections(md) {
  const glossary = []
  const checklist = []
  const glossaryBlock = md.match(/##\s*Glosario[^\n]*\n([\s\S]*?)(?=\n##\s|\n?$)/i)
  if (glossaryBlock) {
    for (const line of glossaryBlock[1].split('\n')) {
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
      if (cells.length < 2) continue
      if (/^-+$/.test(cells[0].replace(/[:\s]/g, '-'))) continue
      if (/^t[eé]rmino/i.test(cells[0])) continue
      glossary.push({ en: cells[0], es: cells[1] || '', meaning: cells[2] || '' })
    }
  }
  const checklistBlock = md.match(/##\s*Checklist[^\n]*\n([\s\S]*?)(?=\n##\s|\n?$)/i)
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

const bundle = { generatedAt: new Date().toISOString(), certs: [] }

for (const code of CODES) {
  const base = join(SOURCE, code)
  if (!(await exists(base))) {
    console.warn(`⚠  falta ${code} — se omite`)
    continue
  }

  const facts = await readJson(join(base, 'facts.json'))
  if (!facts) throw new Error(`${code}: falta facts.json`)

  const decoderHtml = await readMd(join(base, 'decoder.md'))
  const logisticsHtml = await readMd(join(base, 'logistics.md'))

  const officialRaw = (await readJson(join(base, 'official-samples.json'))) || []
  const official = officialRaw.map((q) => normalizeQuestion({ ...q, source: 'official' }, code))

  const domains = []
  const questions = [...official]

  for (const d of facts.domains) {
    const mdPath = join(base, 'domains', `d${d.n}.md`)
    const raw = (await exists(mdPath)) ? await readFile(mdPath, 'utf8') : ''
    const { glossary, checklist } = extractSections(raw)
    // The domain page already renders the title, weight and objectives from facts.json,
    // so the chapter's own leading `# Dominio N: …` H1 would print it a second time.
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
    })

    const qPath = join(base, 'questions', `d${d.n}.json`)
    const qs = (await readJson(qPath)) || []
    for (const q of qs) questions.push(normalizeQuestion(q, code, d.n))
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

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(bundle))

const totalQ = bundle.certs.reduce((s, c) => s + c.stats.questions, 0)
const totalW = bundle.certs.reduce((s, c) => s + c.stats.words, 0)
console.log(
  `✓ bundle: ${bundle.certs.length} certs · ${totalQ} preguntas · ${totalW.toLocaleString('es')} palabras de estudio`,
)
for (const c of bundle.certs) {
  const thin = c.domains.filter((d) => d.words < 500).map((d) => `d${d.n}`)
  console.log(
    `  ${c.code.padEnd(8)} ${String(c.stats.questions).padStart(3)} preguntas (${c.stats.official} oficiales) · ${c.domains.length} dominios` +
      (thin.length ? `  ⚠ delgados: ${thin.join(',')}` : ''),
  )
}
