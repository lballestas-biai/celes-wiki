/**
 * Lectura de las cuatro fuentes de verdad de la aplicación.
 *
 * Todas viven en `apps/web-client` del monorepo privado `celes-app/celes-platform`.
 * Este módulo NO decide nada: solo convierte esos archivos a datos. Las decisiones
 * (canónica vs. alias, bloque de contenido, qué se excluye) están en
 * `tools/inventory.json`, que es lo que se revisa a mano.
 */

import { execFileSync } from 'node:child_process'
import path from 'node:path'

const WEB_CLIENT = 'apps/web-client'

export const SOURCE_FILES = {
  routeTree: `${WEB_CLIENT}/src/routeTree.gen.ts`,
  labelsEs: `${WEB_CLIENT}/public/locales/es/routes.json`,
  labelsEn: `${WEB_CLIENT}/public/locales/en/routes.json`,
  navigationItems: `${WEB_CLIENT}/src/components/Layout/NavMenu/navigationItems.ts`,
  checkModuleAccess: `${WEB_CLIENT}/src/providers/AuthProvider/checkModuleAccess.ts`,
  authHelpers: `${WEB_CLIENT}/src/providers/AuthProvider/helpers.ts`,
  routeMigrations: `${WEB_CLIENT}/src/utils/routeMigrations.ts`,
}

/** Lee un archivo en un ref de git sin tocar el working tree del checkout. */
export function readAtRef(repoDir, ref, filePath) {
  return execFileSync('git', ['-C', path.resolve(repoDir), 'show', `${ref}:${filePath}`], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
}

export function resolveRef(repoDir, ref) {
  const sha = execFileSync('git', ['-C', path.resolve(repoDir), 'rev-parse', ref], {
    encoding: 'utf8',
  }).trim()
  const date = execFileSync(
    'git',
    ['-C', path.resolve(repoDir), 'log', '-1', '--format=%cd', '--date=short', sha],
    { encoding: 'utf8' },
  ).trim()
  return { sha, short: sha.slice(0, 9), date }
}

/**
 * Inventario real de rutas: las claves de `FileRoutesByFullPath` en `routeTree.gen.ts`,
 * que TanStack Router genera del árbol de archivos de `src/routes/`.
 *
 * Es la única fuente que dice si una ruta **existe**. `routes.json` no sirve para eso:
 * conserva etiquetas de pantallas que ya se borraron (ver `stale` en el inventario).
 */
export function parseRouterPaths(routeTreeSource) {
  const block = matchBlock(routeTreeSource, /export interface FileRoutesByFullPath \{/)
  const paths = new Set()
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*'([^']+)':/)
    if (m) paths.add(normalizePath(m[1]))
  }
  if (paths.size === 0) throw new Error('FileRoutesByFullPath vacío: cambió routeTree.gen.ts')
  return paths
}

/** `/dashboard/` y `/dashboard` son la misma ruta: la barra final es la ruta índice. */
export function normalizePath(p) {
  return p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p
}

/**
 * Árbol del menú lateral. El archivo es un literal TypeScript con referencias a
 * componentes de icono; se eliminan y el resto se evalúa como literal JS.
 */
export function parseNavigationItems(source) {
  const literal = matchAssignment(source, /export const navigationItems: NavigationItems =\s*/)
  const cleaned = literal.replace(/icon:\s*Icon\w+,?/g, '')
  const items = evalLiteral(cleaned, 'navigationItems')

  const nav = new Map()
  const walk = (nodes, parents) => {
    for (const node of nodes) {
      nav.set(normalizePath(node.path), {
        parents,
        exact: node.exact ?? false,
        exactExcludeRoutes: (node.exactExcludeRoutes ?? []).map(normalizePath),
      })
      if (node.children) walk(node.children, [...parents, normalizePath(node.path)])
    }
  }
  walk(items, [])
  return nav
}

/**
 * `ROUTE_MIGRATIONS` de `routeMigrations.ts`: el catálogo que el propio código usa para
 * decidir, cuando una pantalla vive en dos URLs, cuál le toca a cada usuario.
 *
 * Es lo que resuelve los duplicados: `legacyPath` es el alias, `newPath` la canónica.
 * No hay que adivinarlos comparando etiquetas.
 */
export function parseRouteMigrations(source) {
  const literal = matchAssignment(source, /const ROUTE_MIGRATIONS: readonly RouteMigration\[\] =\s*/)
  const migrations = evalLiteral(literal, 'ROUTE_MIGRATIONS')
  if (!migrations.length) throw new Error('ROUTE_MIGRATIONS vacío: cambió routeMigrations.ts')
  return migrations
}

/**
 * `ROUTE_SEGMENT_PERMISSION_ALIASES` de `AuthProvider/helpers.ts`: segmentos de URL que
 * se renombraron pero cuyo código de permiso quedó con el nombre viejo.
 */
export function parseSegmentPermissionAliases(source) {
  const literal = matchAssignment(
    source,
    /const ROUTE_SEGMENT_PERMISSION_ALIASES: Record<string, string> =\s*/,
  )
  return evalLiteral(literal, 'ROUTE_SEGMENT_PERMISSION_ALIASES')
}

/**
 * Rutas que `checkModuleAccess` deja pasar sin permiso alguno (el `return true` inicial).
 * Se extraen del código en vez de copiarse para que el snapshot se rompa si desaparecen.
 */
export function parseUnrestrictedPaths(source) {
  const head = source.slice(0, source.indexOf('if (!permissions.length)'))
  const paths = [...head.matchAll(/path === '([^']+)'/g)].map((m) => m[1])
  return new Set(paths)
}

// --- utilidades de parseo -------------------------------------------------

/** Devuelve el literal (array u objeto) que sigue a `anchor`, balanceando delimitadores. */
function matchAssignment(source, anchor) {
  const m = source.match(anchor)
  if (!m) throw new Error(`No se encontró la asignación ${anchor}`)
  return sliceBalanced(source, m.index + m[0].length)
}

/** Devuelve el cuerpo `{...}` que sigue a `anchor`, sin las llaves externas. */
function matchBlock(source, anchor) {
  const m = source.match(anchor)
  if (!m) throw new Error(`No se encontró el bloque ${anchor}`)
  const body = sliceBalanced(source, m.index + m[0].length - 1)
  return body.slice(1, -1)
}

const OPENERS = { '{': '}', '[': ']' }

function sliceBalanced(source, start) {
  const open = source[start]
  const close = OPENERS[open]
  if (!close) throw new Error(`Se esperaba { o [ en la posición ${start}, hay "${open}"`)

  let depth = 0
  let quote = null
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = null
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch
    else if (ch === open) depth++
    else if (ch === close && --depth === 0) return source.slice(start, i + 1)
  }
  throw new Error('Literal sin cerrar')
}

/**
 * Evalúa un literal TypeScript de solo-datos. Se le quitan antes las anotaciones
 * `as const satisfies …` y los tipos; si queda algo que no sea dato, `Function` falla
 * y el snapshot no se genera — que es el comportamiento que se quiere.
 */
function evalLiteral(literal, what) {
  const cleaned = literal
    .replace(/\bas const satisfies [^,\n]+/g, '')
    .replace(/\bas const\b/g, '')
    .replace(/\bsatisfies [A-Za-z<>[\]| ]+/g, '')
  try {
    // biome-ignore lint/security/noGlobalEval: literal de datos extraído del código fuente
    return new Function(`return (${cleaned})`)()
  } catch (error) {
    throw new Error(`No se pudo evaluar ${what}: ${error.message}`)
  }
}
