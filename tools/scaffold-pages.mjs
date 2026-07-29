#!/usr/bin/env node
/**
 * Siembra la wiki a partir de `tools/inventory.json`:
 *
 *  1. crea el stub de cada página que todavía no existe en `docs/`
 *  2. reescribe el `nav` de `mkdocs.yml`
 *
 * El stub **no** es un archivo vacío: ya trae la ficha verificada de la pantalla —
 * dónde está en el menú, su dirección, quién la ve y con qué otras URL se llega — con
 * su `sources:` y su `verified_at`. Eso es lo que 0.2 puede afirmar; el resto del
 * contenido es trabajo de 1a.2–1a.9 y queda como `status: draft`.
 *
 *   node tools/scaffold-pages.mjs [--check]
 *
 * Nunca pisa una página existente: si el archivo está, se deja como está.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describePermission } from './lib/format.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = path.join(ROOT, 'docs')
const MKDOCS = path.join(ROOT, 'mkdocs.yml')
const check = process.argv.includes('--check')

const inventory = JSON.parse(readFileSync(path.join(ROOT, 'tools/inventory.json'), 'utf8'))

/**
 * Los archivos que sostienen la ficha del stub: existencia de la ruta, etiqueta, permiso
 * y pares alias/canónica. Es el `sources:` mínimo honesto de una página recién sembrada.
 */
const FICHA_SOURCES = [
  'apps/web-client/src/routeTree.gen.ts',
  'apps/web-client/public/locales/es/routes.json',
  'apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts',
  'apps/web-client/src/utils/routeMigrations.ts',
]

const NAV_START = '# --- nav generado por tools/scaffold-pages.mjs — no editar a mano ---'
const NAV_END = '# --- fin del nav generado ---'

// --- 1. stubs -------------------------------------------------------------

const created = []
const missing = []

for (const page of inventory.pages) {
  const file = path.join(DOCS, page.page)
  if (existsSync(file)) continue
  if (check) {
    missing.push(page.page)
    continue
  }
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, page.route ? screenStub(page) : conceptStub(page))
  created.push(page.page)
}

// --- 2. nav ---------------------------------------------------------------

const navYaml = renderNav(inventory)
const current = readFileSync(MKDOCS, 'utf8')
const updated = spliceNav(current, navYaml)

if (check) {
  const problems = []
  if (missing.length) {
    problems.push(`Faltan ${missing.length} páginas del inventario:\n    ${missing.join('\n    ')}`)
  }
  if (updated !== current) problems.push('El nav de mkdocs.yml no coincide con el inventario.')
  if (problems.length) {
    console.error('scaffold-pages --check falló:\n')
    for (const problem of problems) console.error(`  · ${problem}`)
    console.error('\n  Correr `node tools/scaffold-pages.mjs` y commitear.')
    process.exit(1)
  }
  console.log(`scaffold-pages: ${inventory.pages.length} páginas al día`)
} else {
  writeFileSync(MKDOCS, updated)
  console.log(
    `scaffold-pages: ${created.length} stubs creados, ` +
      `${inventory.pages.length - created.length} ya existían, nav reescrito`,
  )
}

// --- plantillas -----------------------------------------------------------

function frontmatter(fields) {
  const lines = ['---']
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue
    const rendered = Array.isArray(value) ? `[${value.join(', ')}]` : String(value)
    lines.push(`${key}:${rendered.startsWith('\n') ? '' : ' '}${rendered}`)
  }
  lines.push('---', '', '')
  return lines.join('\n')
}

/** Administración es de administradores; el resto de la aplicación es de todos. */
function audienceOf(page) {
  return page.route?.startsWith('/administration') ? ['Administradores'] : ['Clientes', 'Usuarios']
}

function screenStub(page) {
  const block = inventory.blocks[page.block]
  const sources = FICHA_SOURCES.map(
    (file) => `  - repo: celes-platform\n    path: ${file}\n    ref: ${inventory.source.ref}`,
  ).join('\n')

  const ficha = [
    '| | |',
    '|---|---|',
    `| **Dónde está** | ${page.menu_path ? `Menú: ${page.menu_path}` : 'No aparece en el menú lateral: se llega desde otra pantalla'} |`,
    `| **Dirección** | \`${page.route}\` |`,
    `| **Quién la ve** | ${describePermission(page.permission)} |`,
  ]
  if (page.aliases.length) {
    ficha.push(
      `| **Otras direcciones** | ${page.aliases.map((a) => `\`${a}\``).join('<br>')} — llevan a esta misma pantalla |`,
    )
  }
  if (page.sections.length) {
    ficha.push(
      `| **Incluye** | ${page.sections.map((s) => `${s.label_es} (\`${s.path}\`)`).join('<br>')} |`,
    )
  }

  return (
    frontmatter({
      title: page.title,
      module: block,
      route: page.route,
      aliases: page.aliases,
      permission: page.permission.code ?? '~',
      audience: audienceOf(page),
      summary: `>\n  Pendiente. Esta página es un esqueleto: todavía no describe la pantalla.`,
      keywords: [],
      tenant_variance: 'unknown',
      status: 'draft',
      verified_at: inventory.source.ref_date,
      sources: `\n${sources}`,
    }) +
    [
      `# ${page.title}`,
      '',
      '!!! warning "Página en construcción"',
      '    Todavía no describe la pantalla. Lo único verificado por ahora es la ficha de',
      '    abajo, derivada del código de la aplicación.',
      '',
      '## Ficha de la pantalla { #ficha }',
      '',
      ...ficha,
      '',
      '## Qué es y para qué sirve { #que-es }',
      '',
      '## Qué puedes hacer aquí { #que-puedes-hacer }',
      '',
      '## Qué necesita para funcionar { #requisitos }',
      '',
      '## Conceptos relacionados { #conceptos }',
      '',
    ].join('\n')
  )
}

function conceptStub(page) {
  return (
    frontmatter({
      title: page.title,
      module: inventory.blocks[page.block],
      audience: ['Clientes', 'Usuarios'],
      summary: `>\n  Pendiente. Esta página es un esqueleto: todavía no explica el concepto.`,
      keywords: [],
      tenant_variance: 'unknown',
      status: 'draft',
      verified_at: inventory.source.ref_date,
      sources: '[]',
    }) +
    [
      `# ${page.title}`,
      '',
      '!!! warning "Página en construcción"',
      '    Todavía no tiene contenido.',
      '',
    ].join('\n')
  )
}

// --- nav ------------------------------------------------------------------

function yamlKey(text) {
  return /^[\w áéíóúüñÁÉÍÓÚÜÑ&.,()-]+$/.test(text) ? text : `'${text.replace(/'/g, "''")}'`
}

function renderNav(data) {
  const lines = [
    NAV_START,
    '# El inventario canónico de pantallas (tools/inventory.json) es quien manda:',
    '# `node tools/nav-audit.mjs` falla si una pantalla de la aplicación no tiene página aquí.',
    'nav:',
    '  - Inicio: index.md',
  ]

  for (const [block, label] of Object.entries(data.blocks)) {
    const pages = data.pages.filter((page) => page.block === block)
    if (!pages.length) continue
    lines.push(`  - ${yamlKey(label)}:`)
    for (const page of pages) {
      // Con `navigation.indexes`, la página listada sin título es la portada de la sección.
      if (path.basename(page.page) === 'index.md') lines.push(`      - ${page.page}`)
      else lines.push(`      - ${yamlKey(page.nav_title)}: ${page.page}`)
    }
  }

  lines.push(NAV_END, '')
  return lines.join('\n')
}

function spliceNav(source, nav) {
  const start = source.indexOf(NAV_START)
  if (start !== -1) {
    const end = source.indexOf(NAV_END, start)
    if (end === -1) throw new Error('mkdocs.yml tiene el marcador de inicio del nav pero no el de fin')
    return source.slice(0, start) + nav + source.slice(end + NAV_END.length + 1)
  }

  // Primera vez: se reemplaza el bloque `nav:` existente, que vive al final del archivo.
  const legacy = source.search(/^nav:$/m)
  if (legacy === -1) throw new Error('mkdocs.yml no tiene bloque `nav:`')
  return source.slice(0, legacy) + nav
}
