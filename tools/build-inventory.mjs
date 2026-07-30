#!/usr/bin/env node
/**
 * Junta la foto del código (`tools/data/app-routes.json`) con las decisiones humanas
 * (`tools/decisions.json`) y produce el inventario canónico de pantallas:
 *
 *   tools/inventory.json   la tabla que consume nav-audit.mjs y el generador de stubs
 *   tools/INVENTORY.md     la misma tabla para leer y revisar en el PR
 *
 * Regla dura: **toda ruta tiene que terminar con un destino explícito**. Si aparece una
 * pantalla nueva en la aplicación y nadie decidió qué hacer con ella, esto falla. Es el
 * mecanismo que impide que una pantalla se caiga de la wiki en silencio.
 *
 *   node tools/build-inventory.mjs [--check]
 *
 * `--check` no escribe: falla si lo generado difiere de lo commiteado (para CI).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cell, formatPermission } from './lib/format.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')

const snapshot = readJson('tools/data/app-routes.json')
const decisions = readJson('tools/decisions.json')

const problems = []
const byPath = new Map(snapshot.routes.map((route) => [route.path, route]))

// --- 1. destino de cada ruta ---------------------------------------------

const entries = snapshot.routes.map((route) => {
  const base = {
    path: route.path,
    label_es: route.label_es,
    label_en: route.label_en,
    permission: route.permission,
    in_nav: route.in_nav,
    in_router: route.in_router,
  }

  if (!route.in_router) {
    return {
      ...base,
      disposition: 'stale',
      note:
        decisions.stale_notes[route.path] ??
        'Etiqueta en routes.json sin ruta en el router: la pantalla no existe.',
    }
  }

  if (route.path in decisions.excluded) {
    return { ...base, disposition: 'excluded', note: decisions.excluded[route.path] }
  }

  if (route.dynamic || route.form) {
    return {
      ...base,
      disposition: 'dynamic',
      note: route.form
        ? 'Formulario de creación de la pantalla madre; se documenta dentro de ella.'
        : 'Ruta con parámetro (detalle de un registro); se documenta dentro de su pantalla madre.',
    }
  }

  const declaredAlias = decisions.aliases[route.path]
  if (declaredAlias) {
    return {
      ...base,
      disposition: 'alias',
      canonical: declaredAlias.canonical,
      source: 'decisión',
      note: declaredAlias.evidence,
    }
  }

  if (route.migration?.role === 'alias') {
    return {
      ...base,
      disposition: 'alias',
      canonical: route.migration.counterpart,
      source: 'ROUTE_MIGRATIONS',
      note: 'URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido.',
    }
  }

  const partOf = decisions.sections[route.path]
  if (partOf) return { ...base, disposition: 'section', part_of: partOf }

  const page = decisions.pages[route.path]
  if (page) {
    return {
      ...base,
      disposition: 'page',
      page: page.page,
      block: page.block,
      title: page.title,
      note: page.note ?? null,
    }
  }

  problems.push(
    `Ruta sin destino: ${route.path} («${route.label_es ?? 'sin etiqueta'}»). ` +
      'Decidir en tools/decisions.json: pages, sections, aliases o excluded.',
  )
  return { ...base, disposition: 'undecided' }
})

const entryByPath = new Map(entries.map((entry) => [entry.path, entry]))

// --- 2. resolución transitiva a página -----------------------------------

/** Sigue alias → sección → página; devuelve la ruta canónica que sí tiene página. */
function resolveToPage(routePath, seen = new Set()) {
  if (seen.has(routePath)) return null
  seen.add(routePath)
  const entry = entryByPath.get(routePath)
  if (!entry) return null
  if (entry.disposition === 'page') return entry
  if (entry.disposition === 'alias') return resolveToPage(entry.canonical, seen)
  if (entry.disposition === 'section') return resolveToPage(entry.part_of, seen)
  return null
}

for (const entry of entries) {
  if (entry.disposition !== 'alias' && entry.disposition !== 'section') continue
  const target = entry.disposition === 'alias' ? entry.canonical : entry.part_of
  if (!byPath.has(target)) {
    problems.push(`${entry.path} apunta a ${target}, que no existe en la aplicación.`)
    continue
  }
  const resolved = resolveToPage(entry.path)
  if (!resolved) {
    problems.push(`${entry.path} → ${target} no termina en ninguna página de la wiki.`)
    continue
  }
  entry.resolves_to = resolved.path
  entry.page = resolved.page
}

// --- 3. páginas de la wiki ------------------------------------------------

const blocks = decisions.blocks
const pages = []

/** Ruta del menú lateral tal como la lee el usuario: «Reabastecimiento › Comprar». */
function menuPath(route) {
  if (!route.in_nav) return null
  const labels = [...(route.nav_parents ?? []), route.path].map(
    (parent) => byPath.get(parent)?.label_es ?? parent,
  )
  return labels.join(' › ')
}

for (const entry of entries) {
  if (entry.disposition !== 'page') continue
  pages.push({
    page: entry.page,
    title: entry.title,
    nav_title: decisions.pages[entry.path].nav_title ?? entry.title,
    block: entry.block,
    route: entry.path,
    menu_path: menuPath(byPath.get(entry.path)),
    label_es: entry.label_es,
    label_en: entry.label_en,
    permission: entry.permission,
    in_nav: entry.in_nav,
    aliases: entries
      .filter((other) => other.disposition === 'alias' && other.resolves_to === entry.path)
      .map((other) => other.path),
    sections: entries
      .filter((other) => other.disposition === 'section' && other.resolves_to === entry.path)
      .map((other) => ({ path: other.path, label_es: other.label_es })),
    note: entry.note,
  })
}

for (const standalone of decisions.standalone) {
  pages.push({
    ...standalone,
    nav_title: standalone.nav_title ?? standalone.title,
    route: null,
    aliases: [],
    sections: [],
  })
}

for (const page of pages) {
  if (!(page.block in blocks)) problems.push(`${page.page}: bloque desconocido «${page.block}».`)
}

const duplicates = pages
  .map((page) => page.page)
  .filter((file, index, all) => all.indexOf(file) !== index)
for (const duplicate of new Set(duplicates)) {
  problems.push(`Dos entradas apuntan al mismo archivo: ${duplicate}.`)
}

// El orden del nav se lee de `decisions.json`: el de `blocks` para las secciones y, dentro
// de cada una, el orden en que están escritas las páginas. Es orden de lectura, no
// alfabético — que una wiki se lea en el orden en que se trabaja importa.
const blockOrder = Object.keys(blocks)
const pageOrder = [...Object.values(decisions.pages), ...decisions.standalone].map((p) => p.page)
pages.sort(
  (a, b) =>
    blockOrder.indexOf(a.block) - blockOrder.indexOf(b.block) ||
    pageOrder.indexOf(a.page) - pageOrder.indexOf(b.page),
)

// --- 4. salida ------------------------------------------------------------

const countBy = (disposition) => entries.filter((e) => e.disposition === disposition).length

const inventory = {
  _: 'Generado por tools/build-inventory.mjs a partir de tools/data/app-routes.json y tools/decisions.json. No editar a mano.',
  source: snapshot.source,
  blocks,
  totals: {
    routes: entries.length,
    pages: pages.length,
    pages_de_pantalla: pages.filter((p) => p.route).length,
    pages_sin_pantalla: pages.filter((p) => !p.route).length,
    alias: countBy('alias'),
    secciones: countBy('section'),
    dinamicas: countBy('dynamic'),
    excluidas: countBy('excluded'),
    obsoletas: countBy('stale'),
  },
  pages,
  routes: entries,
}

if (problems.length) {
  console.error('El inventario no cierra:\n')
  for (const problem of problems) console.error(`  · ${problem}`)
  process.exit(1)
}

writeOrCheck('tools/inventory.json', `${JSON.stringify(inventory, null, 2)}\n`)
writeOrCheck('tools/INVENTORY.md', renderMarkdown(inventory))

console.log(
  `inventario: ${inventory.totals.routes} rutas → ${inventory.totals.pages} páginas ` +
    `(${inventory.totals.alias} alias, ${inventory.totals.secciones} secciones, ` +
    `${inventory.totals.dinamicas} dinámicas, ${inventory.totals.excluidas} excluidas, ` +
    `${inventory.totals.obsoletas} obsoletas)`,
)

// --- utilidades -----------------------------------------------------------

function readJson(relative) {
  return JSON.parse(readFileSync(path.join(ROOT, relative), 'utf8'))
}

function writeOrCheck(relative, content) {
  const file = path.join(ROOT, relative)
  if (!check) {
    writeFileSync(file, content)
    return
  }
  const current = readFileSync(file, 'utf8')
  if (current !== content) {
    console.error(
      `${relative} está desactualizado. Correr \`node tools/build-inventory.mjs\` y commitear.`,
    )
    process.exit(1)
  }
}

function renderMarkdown(data) {
  const lines = []
  const push = (...text) => lines.push(...text)

  push(
    '<!-- Generado por tools/build-inventory.mjs. No editar a mano. -->',
    '',
    '# Inventario canónico de pantallas',
    '',
    'Qué pantallas existen en la aplicación, cómo se llaman, quién las ve y qué página de',
    'la wiki les corresponde. Se deriva del código de `celes-app/celes-platform`, no del',
    'mock ni de la memoria de nadie.',
    '',
    `**Ref:** \`${data.source.ref}\` (${data.source.ref_date}) · **Rutas:** ${data.totals.routes} · ` +
      `**Páginas:** ${data.totals.pages} (${data.totals.pages_de_pantalla} de pantalla, ` +
      `${data.totals.pages_sin_pantalla} transversales)`,
    '',
    '| Destino | Rutas |',
    '|---|---|',
    `| Página propia | ${data.totals.pages_de_pantalla} |`,
    `| Alias de otra pantalla | ${data.totals.alias} |`,
    `| Sección dentro de otra página | ${data.totals.secciones} |`,
    `| Detalle o formulario (ruta con parámetro) | ${data.totals.dinamicas} |`,
    `| Excluida (no es pantalla de producto) | ${data.totals.excluidas} |`,
    `| Obsoleta (etiqueta sin pantalla) | ${data.totals.obsoletas} |`,
    '',
    '## Pantallas con página propia',
    '',
    '`Permiso` es el que exige `checkModuleAccess` para esa ruta; en Administración basta',
    'que los segmentos de uno sean prefijo de los del otro, en cualquier dirección.',
    '',
    '| Ruta canónica | Etiqueta (es) | Etiqueta (en) | Permiso | En el menú | Página | Alias |',
    '|---|---|---|---|---|---|---|',
  )

  for (const page of data.pages.filter((p) => p.route)) {
    push(
      `| \`${page.route}\` | ${cell(page.label_es)} | ${cell(page.label_en)} | ` +
        `${formatPermission(page.permission)} | ${page.in_nav ? 'sí' : 'no'} | ` +
        `\`docs/${page.page}\` | ${page.aliases.map((a) => `\`${a}\``).join('<br>') || '—'} |`,
    )
  }

  push(
    '',
    '## Páginas sin pantalla',
    '',
    'Bienvenida, conceptos transversales y recursos: explican el porqué, no una pantalla.',
    '',
    '| Página | Título | Bloque |',
    '|---|---|---|',
  )
  for (const page of data.pages.filter((p) => !p.route)) {
    push(`| \`docs/${page.page}\` | ${cell(page.title)} | ${cell(data.blocks[page.block])} |`)
  }

  push(
    '',
    '## Alias',
    '',
    'La misma pantalla con dos URL. Las declaradas por `ROUTE_MIGRATIONS` son migraciones en',
    'curso: cuál ve el usuario depende de qué permiso tenga concedido. Las demás llevan la',
    'evidencia en el código que las sostiene.',
    '',
    '| Alias | Canónica | Declarado por | Por qué |',
    '|---|---|---|---|',
  )
  for (const entry of data.routes.filter((r) => r.disposition === 'alias')) {
    push(
      `| \`${entry.path}\` | \`${entry.canonical}\` | ${cell(entry.source)} | ${cell(entry.note)} |`,
    )
  }

  push(
    '',
    '## Secciones',
    '',
    'Sub-pantallas sin página propia: pestañas y vistas de detalle que se documentan dentro',
    'de su pantalla madre.',
    '',
    '| Ruta | Etiqueta | Se documenta en |',
    '|---|---|---|',
  )
  for (const entry of data.routes.filter((r) => r.disposition === 'section')) {
    push(`| \`${entry.path}\` | ${cell(entry.label_es)} | \`docs/${entry.page}\` |`)
  }

  push(
    '',
    '## Rutas sin página, y por qué',
    '',
    '### Obsoletas: etiqueta en `routes.json` sin pantalla en el router',
    '',
    '`routes.json` conserva nombres de pantallas que ya se borraron. No son huecos de la',
    'wiki: son pantallas que no existen.',
    '',
    '| Ruta | Etiqueta | Motivo |',
    '|---|---|---|',
  )
  for (const entry of data.routes.filter((r) => r.disposition === 'stale')) {
    push(`| \`${entry.path}\` | ${cell(entry.label_es)} | ${cell(entry.note)} |`)
  }

  push('', '### Excluidas', '', '| Ruta | Etiqueta | Motivo |', '|---|---|---|')
  for (const entry of data.routes.filter((r) => r.disposition === 'excluded')) {
    push(`| \`${entry.path}\` | ${cell(entry.label_es)} | ${cell(entry.note)} |`)
  }

  push(
    '',
    '### Rutas con parámetro y formularios',
    '',
    'Detalles de un registro (`$id`) y formularios de creación. Se documentan dentro de la',
    'página de su pantalla madre, no aparte.',
    '',
    '<details><summary>Ver las ' +
      data.routes.filter((r) => r.disposition === 'dynamic').length +
      '</summary>',
    '',
    '| Ruta | Etiqueta |',
    '|---|---|',
  )
  for (const entry of data.routes.filter((r) => r.disposition === 'dynamic')) {
    push(`| \`${entry.path}\` | ${cell(entry.label_es)} |`)
  }
  push('', '</details>', '')

  return `${lines.join('\n')}\n`
}
