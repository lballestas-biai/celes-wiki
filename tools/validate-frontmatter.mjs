#!/usr/bin/env node
/**
 * Comprueba que toda página de `docs/` cumple el contrato de contenido
 * (`tools/content-contract.json`). Es lo que hace imposible mergear una página que
 * miente sobre su ruta, su permiso o su fecha de verificación.
 *
 *   node tools/validate-frontmatter.mjs [--only docs/ruta.md] [--json]
 *
 * El contrato tiene dos niveles a propósito:
 *
 *   · **Siempre** — la forma: están todas las claves, con el tipo y el vocabulario que
 *     toca, y lo que dicen `title`/`route`/`permission`/`aliases` coincide con el
 *     inventario canónico de pantallas. Un esqueleto recién sembrado ya lo cumple.
 *   · **Con `status: verified`** — la «definición de página completa» de la épica: se
 *     acabaron los textos de relleno, hay palabras clave, hay fuentes, la variación por
 *     instancia está decidida, están las secciones con sus anclas y hay al menos una
 *     captura. Marcar `verified` es afirmar eso, y esto lo verifica.
 *
 * Lo que una máquina no puede juzgar — si el texto es correcto, si la captura está
 * saneada — es trabajo de la revisión humana del PR, no de este script.
 *
 * Reparto con las otras dos herramientas: `nav-audit` responde *qué páginas deben
 * existir*, esta responde *qué debe decir cada página de sí misma*, y `check-denylist`
 * responde *qué no puede decir ninguna*.
 */

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FrontmatterError, readFrontmatter } from './lib/frontmatter.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = path.join(ROOT, 'docs')

const argv = process.argv.slice(2)
const only = valueOf('--only')
const asJson = argv.includes('--json')

const contract = readJson('tools/content-contract.json')
const inventory = readJson('tools/inventory.json')
const statusValues = readStatusValues()

/** Hoy en la zona del proyecto: `verified_at` no puede estar en el futuro. */
const TODAY = new Date().toISOString().slice(0, 10)

const findings = []
const report = (check, file, message, line) =>
  findings.push({ check, file, message, line: line ?? null })

const byPage = new Map(inventory.pages.map((page) => [page.page, page]))
const files = only
  ? [path.relative(DOCS, path.resolve(ROOT, only))]
  : markdownFiles(DOCS).sort()

for (const file of files) {
  validate(file, readFileSync(path.join(DOCS, file), 'utf8'))
}

// --- salida ---------------------------------------------------------------

if (asJson) {
  console.log(JSON.stringify({ files: files.length, findings }, null, 2))
  process.exit(findings.length ? 1 : 0)
}

if (findings.length) {
  console.error(`validate-frontmatter: ${findings.length} incumplimiento(s) del contrato\n`)
  for (const check of [...new Set(findings.map((f) => f.check))]) {
    console.error(`  ${check}`)
    for (const finding of findings.filter((f) => f.check === check)) {
      const where = `docs/${finding.file}${finding.line ? `:${finding.line}` : ''}`
      console.error(`    · ${where} — ${finding.message}`)
    }
    console.error('')
  }
  console.error('  El contrato está en tools/content-contract.json y explicado en CONTRIBUTING.md.')
  process.exit(1)
}

const verified = files.filter((file) => statusOf(file) === 'verified').length
console.log(
  `validate-frontmatter: ${files.length} páginas conformes ` +
    `· ${verified} verificadas, ${files.length - verified} en borrador`,
)

// --- el contrato, página por página ---------------------------------------

function validate(file, source) {
  let parsed
  try {
    parsed = readFrontmatter(source)
  } catch (error) {
    if (!(error instanceof FrontmatterError)) throw error
    return report('frontmatter', file, error.message, error.line)
  }
  if (!parsed) return report('frontmatter', file, 'no tiene frontmatter.', 1)

  const { data, lines, body, bodyLine } = parsed
  const at = (key) => lines[key] ?? 1
  const kind = kindOf(file)
  const entry = byPage.get(file)

  // 1. Claves: están las que tocan, no hay de más, no hay de otro tipo de página ----

  const required = [...contract.requeridos.todas, ...contract.requeridos[kind]]
  for (const key of required) {
    if (!(key in data)) report('claves', file, `falta \`${key}\`.`, 1)
  }
  for (const key of contract.prohibidos[kind] ?? []) {
    if (key in data) {
      report('claves', file, `\`${key}\` no va en una página de tipo «${kind}».`, at(key))
    }
  }
  for (const key of Object.keys(data)) {
    if (!(key in contract.campos)) {
      report('claves', file, `\`${key}\` no existe en el contrato (¿un typo?).`, at(key))
    }
  }

  // 2. Tipos y vocabularios --------------------------------------------------

  for (const key of ['title', 'module', 'summary', 'status', 'tenant_variance', 'verified_at']) {
    if (key in data && typeof data[key] !== 'string') {
      report('tipos', file, `\`${key}\` tiene que ser texto.`, at(key))
    }
  }
  for (const key of ['audience', 'keywords', 'aliases', 'sources']) {
    if (key in data && !Array.isArray(data[key])) {
      report('tipos', file, `\`${key}\` tiene que ser una lista.`, at(key))
    }
  }
  if ('permission' in data && data.permission !== null && typeof data.permission !== 'string') {
    report('tipos', file, '`permission` tiene que ser texto o `~`.', at('permission'))
  }

  if (typeof data.title === 'string' && data.title.length > contract.limites.title_caracteres) {
    report('tipos', file, `\`title\` pasa de ${contract.limites.title_caracteres} caracteres.`, at('title'))
  }

  for (const value of asArray(data.audience)) {
    if (!contract.vocabularios.audience.includes(value)) {
      report(
        'vocabulario',
        file,
        `\`audience\` dice «${value}»; el contrato admite ${list(contract.vocabularios.audience)}.`,
        at('audience'),
      )
    }
  }
  if (Array.isArray(data.audience) && data.audience.length === 0) {
    report('vocabulario', file, '`audience` no puede ir vacío: toda página es para alguien.', at('audience'))
  }

  if (!contract.vocabularios.tenant_variance.includes(data.tenant_variance)) {
    report(
      'vocabulario',
      file,
      `\`tenant_variance\` dice «${data.tenant_variance}»; el contrato admite ${list(contract.vocabularios.tenant_variance)}.`,
      at('tenant_variance'),
    )
  }

  // `status` manda sobre la marca visible del menú lateral: un valor sin entrada en
  // `extra.status` de mkdocs.yml sale como un cuadrado vacío junto al nombre.
  if (!statusValues.includes(data.status)) {
    report(
      'vocabulario',
      file,
      `\`status\` dice «${data.status}» y no está en \`extra.status\` de mkdocs.yml ` +
        `(hay: ${list(statusValues)}). Añadirlo ahí y darle su icono \`--md-status--${data.status}\` en brand.css.`,
      at('status'),
    )
  }

  if (asArray(data.keywords).length > contract.limites.keywords_maximo) {
    report(
      'vocabulario',
      file,
      `\`keywords\` tiene ${data.keywords.length}; el máximo es ${contract.limites.keywords_maximo}.`,
      at('keywords'),
    )
  }

  // 3. La fecha de verificación ---------------------------------------------

  if (typeof data.verified_at === 'string') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.verified_at) || !isRealDate(data.verified_at)) {
      report('fecha', file, `\`verified_at\` no es una fecha AAAA-MM-DD válida: «${data.verified_at}».`, at('verified_at'))
    } else if (data.verified_at > TODAY) {
      report('fecha', file, `\`verified_at\` está en el futuro (${data.verified_at}).`, at('verified_at'))
    }
  }

  // 4. El resumen ------------------------------------------------------------

  if (typeof data.summary === 'string') {
    const summary = data.summary.trim()
    if (summary === '') {
      report('resumen', file, '`summary` está vacío.', at('summary'))
    } else {
      if (countSentences(summary) > contract.limites.summary_frases) {
        report(
          'resumen',
          file,
          `\`summary\` tiene ${countSentences(summary)} frases; el contrato permite ${contract.limites.summary_frases}. ` +
            'Es la respuesta corta que da el agente y el primer párrafo que se publica.',
          at('summary'),
        )
      }
      if (summary.length > contract.limites.summary_caracteres) {
        report(
          'resumen',
          file,
          `\`summary\` tiene ${summary.length} caracteres; el máximo es ${contract.limites.summary_caracteres}.`,
          at('summary'),
        )
      }
    }
  }

  // 5. Las fuentes -----------------------------------------------------------

  asArray(data.sources).forEach((source, index) => {
    const where = `\`sources[${index}]\``
    if (source === null || typeof source !== 'object' || Array.isArray(source)) {
      return report('fuentes', file, `${where} no es un mapa \`repo\`/\`path\`/\`ref\`.`, at('sources'))
    }
    for (const key of ['repo', 'path', 'ref']) {
      if (typeof source[key] !== 'string' || source[key].trim() === '') {
        report('fuentes', file, `${where} no declara \`${key}\`.`, at('sources'))
      }
    }
    if (source.repo && !contract.vocabularios.repos.includes(source.repo)) {
      report(
        'fuentes',
        file,
        `${where} apunta al repositorio «${source.repo}», que no está en el contrato (${list(contract.vocabularios.repos)}).`,
        at('sources'),
      )
    }
    if (typeof source.path === 'string' && (source.path.startsWith('/') || source.path.includes('..'))) {
      report('fuentes', file, `${where}: \`path\` tiene que ser relativo a la raíz del repositorio.`, at('sources'))
    }
  })

  // 6. Coincide con el inventario canónico ----------------------------------

  if (entry) {
    agree(file, at, data, 'title', entry.title)
    agree(file, at, data, 'module', inventory.blocks[entry.block])
    if (entry.route) {
      agree(file, at, data, 'route', entry.route)
      agree(file, at, data, 'permission', entry.permission.code ?? null)
      agreeList(file, at, data, 'aliases', entry.aliases)
    }
  } else if (kind !== 'portada') {
    report('inventario', file, 'no está en tools/inventory.json.', 1)
  }

  // 7. Lo que además exige `status: verified` -------------------------------

  if (data.status !== 'verified') return
  const rules = contract.verified

  for (const placeholder of contract.placeholders.summary) {
    if (String(data.summary ?? '').includes(placeholder)) {
      report('página completa', file, 'sigue con el `summary` del esqueleto.', at('summary'))
    }
  }
  for (const placeholder of contract.placeholders.cuerpo) {
    if (body.includes(placeholder)) {
      report('página completa', file, `el cuerpo sigue con el aviso «${placeholder}».`, bodyLine)
    }
  }
  if (rules.tenant_variance_decidido && data.tenant_variance === 'unknown') {
    report(
      'página completa',
      file,
      '`tenant_variance: unknown` — una página verificada tiene que decir si lo descrito cambia de una instancia a otra.',
      at('tenant_variance'),
    )
  }
  if (asArray(data.keywords).length < rules.keywords_minimo) {
    report('página completa', file, `necesita al menos ${rules.keywords_minimo} \`keywords\`.`, at('keywords'))
  }
  if (asArray(data.sources).length < rules.sources_minimo) {
    report(
      'página completa',
      file,
      '`sources` vacío: una página verificada declara contra qué se verificó.',
      at('sources'),
    )
  }

  if (kind !== 'pantalla') return

  const sections = readSections(body)
  for (const anchor of rules.secciones_pantalla) {
    const section = sections.find((s) => s.anchor === anchor)
    if (!section) {
      report('página completa', file, `falta la sección \`{ #${anchor} }\`.`, bodyLine)
    } else if (section.text.length < 40) {
      report('página completa', file, `la sección \`{ #${anchor} }\` está vacía.`, bodyLine + section.line)
    }
  }
  if (countScreenshots(body) < rules.captura_minima) {
    report(
      'página completa',
      file,
      `necesita al menos ${rules.captura_minima} captura en \`assets/screenshots/\`.`,
      bodyLine,
    )
  }
}

// --- utilidades -----------------------------------------------------------

function valueOf(flag) {
  const index = argv.indexOf(flag)
  return index === -1 ? undefined : argv[index + 1]
}

function readJson(relative) {
  return JSON.parse(readFileSync(path.join(ROOT, relative), 'utf8'))
}

function list(values) {
  return values.map((value) => `\`${value}\``).join(', ')
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function kindOf(file) {
  if (file === 'index.md') return 'portada'
  return byPage.get(file)?.route ? 'pantalla' : 'concepto'
}

function statusOf(file) {
  try {
    return readFrontmatter(readFileSync(path.join(DOCS, file), 'utf8'))?.data.status
  } catch {
    return undefined
  }
}

function agree(file, at, data, key, expected) {
  if (!(key in data)) return
  if (data[key] !== expected) {
    report(
      'inventario',
      file,
      `\`${key}\` dice «${data[key] ?? '~'}» y el inventario dice «${expected ?? '~'}».`,
      at(key),
    )
  }
}

function agreeList(file, at, data, key, expected) {
  if (!Array.isArray(data[key])) return
  const same =
    data[key].length === expected.length && data[key].every((value, i) => value === expected[i])
  if (!same) {
    report(
      'inventario',
      file,
      `\`${key}\` dice [${data[key].join(', ')}] y el inventario dice [${expected.join(', ')}].`,
      at(key),
    )
  }
}

/** Los valores de `status` que el theme sabe pintar. */
function readStatusValues() {
  const mkdocs = readFileSync(path.join(ROOT, 'mkdocs.yml'), 'utf8')
  const block = mkdocs.match(/^ {2}status:\n((?: {4}\S.*\n)+)/m)
  if (!block) throw new Error('mkdocs.yml no declara `extra.status`')
  return [...block[1].matchAll(/^ {4}([A-Za-z0-9_-]+):/gm)].map((match) => match[1])
}

function isRealDate(text) {
  const date = new Date(`${text}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text
}

/**
 * Cuenta frases: un punto final es el que va seguido de espacio y mayúscula (o el fin
 * del texto). Así «p. ej.» y «1.500» no inflan la cuenta.
 */
function countSentences(text) {
  const matches = text.match(/[.!?]+(?=\s+[¡¿"«(A-ZÁÉÍÓÚÑ0-9]|\s*$)/g)
  return matches ? matches.length : 1
}

/** Secciones `## Título { #ancla }` con el texto que cuelga de cada una. */
function readSections(body) {
  const lines = body.split('\n')
  const sections = []
  let current = null

  lines.forEach((line, index) => {
    const heading = line.match(/^##\s+(.*?)\s*\{\s*#([A-Za-z0-9_-]+)\s*\}\s*$/)
    if (heading) {
      current = { anchor: heading[2], line: index, text: '' }
      sections.push(current)
      return
    }
    if (/^#{1,6}\s/.test(line)) current = null
    else if (current) current.text += `${line.trim()} `
  })

  for (const section of sections) section.text = section.text.trim()
  return sections
}

function countScreenshots(body) {
  const images = [...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((match) => match[1])
  return images.filter((src) => src.includes('assets/screenshots/')).length
}

function markdownFiles(dir, prefix = '') {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'assets') continue
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) files.push(...markdownFiles(path.join(dir, entry.name), relative))
    else if (entry.name.endsWith('.md')) files.push(relative)
  }
  return files
}
