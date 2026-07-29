#!/usr/bin/env node
/**
 * Audita que la wiki siga cubriendo la aplicación. Es lo que corre en CI.
 *
 *   node tools/nav-audit.mjs
 *   node tools/nav-audit.mjs --against-repo ~/support/celes-platform [--ref origin/development]
 *
 * Sin `--against-repo` audita contra la foto commiteada (`tools/data/app-routes.json`),
 * que es lo único que CI puede ver: el monorepo es privado. Con `--against-repo` vuelve a
 * leer el código y además avisa si la foto se quedó vieja — ese es el modo de la rutina
 * de refresco.
 *
 * Lo que comprueba:
 *
 *   1. inventario al día      inventory.json e INVENTORY.md se regeneran igual
 *   2. pantalla sin página    toda pantalla con página asignada tiene su .md
 *   3. página sin pantalla    todo .md de docs/ está en el inventario
 *   4. alias sin canónica     todo alias y toda sección terminan en una página real
 *   5. nav completo           toda página del inventario está en el nav de mkdocs.yml
 *   6. frontmatter            title/route/permission/aliases coinciden con el inventario
 *   7. deriva                 (solo con --against-repo) la foto commiteada sigue vigente
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = path.join(ROOT, 'docs')

const argv = process.argv.slice(2)
const againstRepo = valueOf('--against-repo')
const ref = valueOf('--ref') ?? 'origin/development'

const findings = []
const report = (check, message) => findings.push({ check, message })

const inventory = readJson('tools/inventory.json')
const snapshot = readJson('tools/data/app-routes.json')
const mkdocs = readFileSync(path.join(ROOT, 'mkdocs.yml'), 'utf8')

// 1. El inventario y los stubs se regeneran idénticos ----------------------

for (const script of ['build-inventory.mjs', 'scaffold-pages.mjs']) {
  const run = spawnSync(process.execPath, [path.join(ROOT, 'tools', script), '--check'], {
    encoding: 'utf8',
  })
  if (run.status !== 0) {
    report('inventario al día', `${script} --check falló:\n${indent(run.stderr.trim())}`)
  }
}

// 2 y 6. Cada página del inventario existe y su frontmatter dice la verdad --

for (const page of inventory.pages) {
  const file = path.join(DOCS, page.page)
  if (!existsSync(file)) {
    const quien = page.route ? `la pantalla \`${page.route}\`` : 'una página transversal'
    report('pantalla sin página', `${quien} no tiene \`docs/${page.page}\`.`)
    continue
  }

  const front = parseFrontmatter(readFileSync(file, 'utf8'))
  if (!front) {
    report('frontmatter', `docs/${page.page} no tiene frontmatter.`)
    continue
  }

  expect(page, front, 'title', page.title)
  expect(page, front, 'module', inventory.blocks[page.block])
  if (page.route) {
    expect(page, front, 'route', page.route)
    expect(page, front, 'permission', page.permission.code ?? '~')
    expect(page, front, 'aliases', `[${page.aliases.join(', ')}]`)
  }
}

// 3. Ninguna página suelta en docs/ ----------------------------------------

const known = new Set(['index.md', ...inventory.pages.map((page) => page.page)])
for (const file of markdownFiles(DOCS)) {
  if (!known.has(file)) {
    report(
      'página sin pantalla',
      `docs/${file} no está en el inventario. Asignarle una pantalla en tools/decisions.json o borrarla.`,
    )
  }
}

// 4. Alias y secciones terminan en una página ------------------------------

for (const route of snapshot.routes) {
  const entry = inventory.routes.find((r) => r.path === route.path)
  if (!entry) {
    report('pantalla sin página', `\`${route.path}\` no aparece en el inventario.`)
    continue
  }
  if ((entry.disposition === 'alias' || entry.disposition === 'section') && !entry.page) {
    report('alias sin canónica', `\`${entry.path}\` no termina en ninguna página de la wiki.`)
  }
  if (entry.disposition === 'undecided') {
    report('pantalla sin página', `\`${entry.path}\` no tiene destino decidido.`)
  }
}

// 5. El nav las lista a todas ----------------------------------------------

for (const page of inventory.pages) {
  if (!mkdocs.includes(`${page.page}\n`)) {
    report('nav incompleto', `docs/${page.page} no está en el \`nav\` de mkdocs.yml.`)
  }
}

// 7. Deriva contra el código vivo ------------------------------------------

if (againstRepo) {
  const { buildSnapshot } = await import('./lib/snapshot.mjs')
  const fresh = buildSnapshot(againstRepo, ref)

  for (const [file, hash] of Object.entries(fresh.source.files)) {
    if (snapshot.source.files[file] !== hash) {
      report(
        'deriva',
        `${file} cambió desde \`${snapshot.source.ref}\`. ` +
          'Regenerar con `node tools/snapshot-app-routes.mjs` y revisar el diff.',
      )
    }
  }

  const before = new Set(snapshot.routes.map((r) => r.path))
  const after = new Set(fresh.routes.map((r) => r.path))
  for (const routePath of after) {
    if (!before.has(routePath)) report('deriva', `Pantalla nueva en la aplicación: \`${routePath}\`.`)
  }
  for (const routePath of before) {
    if (!after.has(routePath)) report('deriva', `Pantalla que ya no existe: \`${routePath}\`.`)
  }
}

// --- salida ---------------------------------------------------------------

if (findings.length) {
  console.error(`nav-audit: ${findings.length} hallazgo(s)\n`)
  for (const check of [...new Set(findings.map((f) => f.check))]) {
    console.error(`  ${check}`)
    for (const finding of findings.filter((f) => f.check === check)) {
      console.error(`    · ${finding.message}`)
    }
    console.error('')
  }
  process.exit(1)
}

console.log(
  `nav-audit: sin huecos · ${inventory.totals.pages_de_pantalla} pantallas con página, ` +
    `${inventory.totals.alias} alias, ${inventory.totals.secciones} secciones ` +
    `· ref ${snapshot.source.ref}${againstRepo ? ' (comprobado contra el código vivo)' : ''}`,
)

// --- utilidades -----------------------------------------------------------

function valueOf(flag) {
  const index = argv.indexOf(flag)
  return index === -1 ? undefined : argv[index + 1]
}

function readJson(relative) {
  return JSON.parse(readFileSync(path.join(ROOT, relative), 'utf8'))
}

function indent(text) {
  return text
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n')
}

function expect(page, front, key, value) {
  if (front[key] !== value) {
    report(
      'frontmatter',
      `docs/${page.page}: \`${key}\` dice «${front[key] ?? '(nada)'}» y el inventario dice «${value}».`,
    )
  }
}

/**
 * Lee los escalares de una línea del frontmatter. No es un parser de YAML: solo mira
 * `clave: valor` en la primera columna, que es lo que el contrato pide comprobar.
 * El validador completo del contrato es 0.4.
 */
function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return null
  const fields = {}
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([a-z_]+):\s*(.*)$/)
    if (field) fields[field[1]] = field[2].trim()
  }
  return fields
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
