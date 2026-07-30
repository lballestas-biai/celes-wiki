#!/usr/bin/env node
/**
 * Busca en lo que se publica aquello que una wiki pública no puede decir:
 * nombres de clientes, SQL, tablas y datasets, interioridades del constructor de
 * reportes, credenciales, direcciones internas y contenido de la base de conocimiento
 * de soporte. Las reglas están en `tools/denylist.json`.
 *
 *   node tools/check-denylist.mjs
 *   node tools/check-denylist.mjs --hash 'Nombre del cliente'   # línea para `nombres.hashes`
 *   node tools/check-denylist.mjs --list                        # las reglas, en una tabla
 *
 * **Esto es una red, no una prueba.** Atrapa lo que sabe nombrar; que una página sea
 * publicable lo sigue decidiendo la revisión humana. Y no mira dentro de los píxeles de
 * una captura: sanear la captura es del proceso que la toma, no de este script.
 *
 * Cuando un hallazgo es un falso positivo se anota en la línea (o en la anterior):
 *
 *     <!-- denylist-ok: sql — la palabra «select» es parte del nombre de un botón -->
 *
 * El motivo es obligatorio: una excepción sin motivo es una regla apagada a escondidas.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFrontmatter } from './lib/frontmatter.mjs'
import { buscarNombres, hashOf, redact } from './lib/nombres.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const denylist = JSON.parse(readFileSync(path.join(ROOT, 'tools/denylist.json'), 'utf8'))

// --- modos de ayuda -------------------------------------------------------

if (argv.includes('--hash')) {
  const name = argv[argv.indexOf('--hash') + 1]
  if (!name) {
    console.error('Uso: node tools/check-denylist.mjs --hash \'Nombre del cliente\'')
    process.exit(2)
  }
  console.log(`    { "h": "${hashOf(name)}", "pista": "nombre de cliente" }`)
  console.log(`\n  Pegar en \`nombres.hashes\` de tools/denylist.json. El nombre en claro no va al repositorio.`)
  process.exit(0)
}

if (argv.includes('--list')) {
  console.log(`denylist v${denylist.version} — ${denylist.reglas.length} reglas\n`)
  for (const rule of denylist.reglas) {
    console.log(`  ${rule.id.padEnd(28)} ${rule.que}`)
    console.log(`  ${''.padEnd(28)} ${rule.porque}\n`)
  }
  console.log(`  nombres de cliente: ${denylist.nombres.hashes.length} (como hash)`)
  process.exit(0)
}

// --- el barrido -----------------------------------------------------------

let scopeCache
const findings = []
const report = (rule, file, line, match) => findings.push({ rule, file, line, match })

const nameHashes = new Map(denylist.nombres.hashes.map((entry) => [entry.h, entry.pista]))
const rules = denylist.reglas.map((rule) => ({
  ...rule,
  compiled: new RegExp(rule.regex, `${rule.flags ?? ''}g`),
}))

for (const file of filesInScope()) {
  const absolute = path.join(ROOT, file)
  const source = readFileSync(absolute, 'utf8')
  const lines = source.split('\n')
  const bodyFrom = file.endsWith('.md') ? bodyLineOf(source) : 1

  for (const rule of rules) {
    if (rule.solo_en && !file.startsWith(rule.solo_en)) continue
    const from = rule.ambito === 'cuerpo' ? bodyFrom : 1
    scan(rule.compiled, source, lines, (start, end, match) => {
      if (end < from) return
      if (allowed(lines, start, end, rule.id)) return
      report(rule, file, start, rule.redactar ? redact(match) : match)
    })
  }

  scanNames(file, lines)
}

checkAssets()

// --- salida ---------------------------------------------------------------

if (findings.length) {
  console.error(`check-denylist: ${findings.length} hallazgo(s) de contenido no publicable\n`)
  for (const id of [...new Set(findings.map((f) => f.rule.id))]) {
    const group = findings.filter((f) => f.rule.id === id)
    console.error(`  ${id} — ${group[0].rule.que}`)
    console.error(`    ${group[0].rule.porque}`)
    for (const finding of group) {
      console.error(`      · ${finding.file}:${finding.line} — «${finding.match}»`)
    }
    console.error('')
  }
  console.error(
    '  Si alguno es un falso positivo, anotarlo en la línea con\n' +
      '    <!-- denylist-ok: <regla> — motivo -->\n' +
      '  Las reglas están en tools/denylist.json y explicadas en CONTRIBUTING.md.',
  )
  process.exit(1)
}

console.log(
  `check-denylist: limpio · ${rules.length} reglas y ${nameHashes.size} nombres ` +
    `sobre ${filesInScope().length} archivos publicados`,
)

// --- utilidades -----------------------------------------------------------

/**
 * Recorre las coincidencias de un patrón traduciendo el índice a número de línea. Una
 * coincidencia puede abarcar varias líneas (un `SELECT … FROM` repartido), así que se
 * informa dónde empieza y dónde acaba: la anotación `denylist-ok` vale en cualquiera.
 */
function scan(regex, source, lines, onMatch) {
  regex.lastIndex = 0
  const offsets = lineOffsets(lines)
  let match
  while ((match = regex.exec(source)) !== null) {
    if (match[0] === '') {
      regex.lastIndex += 1
      continue
    }
    const from = lineAt(offsets, match.index)
    const to = lineAt(offsets, match.index + match[0].length - 1)
    onMatch(from, to, collapse(match[0]))
  }
}

/**
 * Nombres de cliente. La comparación vive en `lib/nombres.mjs` porque el pipeline de
 * capturas hace la misma pregunta sobre el texto de una pantalla.
 */
function scanNames(file, lines) {
  if (!nameHashes.size) return
  lines.forEach((text, index) => {
    const line = index + 1
    if (allowed(lines, line, line, 'nombre-de-cliente')) return
    for (const { gram, pista } of buscarNombres(text, nameHashes)) {
      report(
        { id: 'nombre-de-cliente', que: pista, porque: 'La wiki es pública: no nombra a ningún cliente.' },
        file,
        line,
        redact(gram),
      )
    }
  })
}

/** Qué archivos pueden vivir en docs/, al margen de lo que digan. */
function checkAssets() {
  const config = denylist.archivos
  const prohibited = new RegExp(config.nombres_prohibidos, 'i')

  for (const file of walk(path.join(ROOT, 'docs'), 'docs')) {
    const name = path.basename(file)
    const extension = path.extname(name).toLowerCase()
    const rule = (id, que, porque) => ({ id, que, porque })

    if (config.extensiones_prohibidas.includes(extension)) {
      report(rule('archivo', `archivo \`${extension}\` en docs/`, 'Los datos crudos no se publican.'), file, 0, name)
    }
    if (prohibited.test(name)) {
      report(
        rule('archivo', 'nombre de archivo de trabajo', 'Un `raw`/`original`/`wip` delata material sin sanear.'),
        file,
        0,
        name,
      )
    }
    if (/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name) && !file.startsWith(config.imagenes_solo_en)) {
      report(
        rule('archivo', 'imagen fuera de docs/assets/', 'Las capturas van en un solo sitio para poder revisarlas todas.'),
        file,
        0,
        file,
      )
    }
  }
}

/**
 * `<!-- denylist-ok: regla — motivo -->` en la línea anterior al hallazgo, o en
 * cualquiera de las que abarca.
 */
function allowed(lines, start, end, id) {
  for (let line = start - 1; line <= end; line += 1) {
    const candidate = lines[line - 1]
    if (!candidate) continue
    const pragma = candidate.match(/denylist-ok:\s*([a-z-]+)\s*[—:-]\s*(.+?)\s*(?:-->|#}|\*\/)?\s*$/)
    if (pragma && pragma[1] === id && pragma[2].trim().length >= 10) return true
  }
  return false
}

function collapse(text) {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > 70 ? `${flat.slice(0, 67)}…` : flat
}

function lineOffsets(lines) {
  const offsets = [0]
  for (const line of lines) offsets.push(offsets[offsets.length - 1] + line.length + 1)
  return offsets
}

function lineAt(offsets, index) {
  let low = 0
  let high = offsets.length - 1
  while (low < high) {
    const middle = (low + high + 1) >> 1
    if (offsets[middle] <= index) low = middle
    else high = middle - 1
  }
  return low + 1
}

/** Primera línea del cuerpo de un `.md`; el frontmatter empieza en la 1. */
function bodyLineOf(source) {
  try {
    return readFrontmatter(source)?.bodyLine ?? 1
  } catch {
    return 1
  }
}

function filesInScope() {
  if (scopeCache) return scopeCache
  const files = []
  for (const pattern of denylist.ambitos.incluye) {
    const base = pattern.replace(/\/\*\*$/, '')
    const absolute = path.join(ROOT, base)
    if (statSync(absolute).isDirectory()) files.push(...walk(absolute, base))
    else files.push(base)
  }
  scopeCache = files.filter(
    (file) =>
      isText(file) && !denylist.ambitos.excluye.some((pattern) => file.startsWith(pattern.replace(/\*\*$/, ''))),
  )
  return scopeCache
}

function isText(file) {
  return /\.(md|ya?ml|html|txt|json|css|js)$/i.test(file)
}

function walk(dir, prefix) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = `${prefix}/${entry.name}`
    if (entry.isDirectory()) files.push(...walk(path.join(dir, entry.name), relative))
    else files.push(relative)
  }
  return files
}
