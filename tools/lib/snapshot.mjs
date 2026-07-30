/**
 * Construye la foto de las pantallas de la aplicación a partir de un checkout de
 * `celes-app/celes-platform` en un ref dado.
 *
 * Vive aparte de `tools/snapshot-app-routes.mjs` porque `nav-audit.mjs --against-repo`
 * la vuelve a construir en memoria para detectar si la foto commiteada se quedó vieja.
 */

import { createHash } from 'node:crypto'
import {
  SOURCE_FILES,
  normalizePath,
  parseNavigationItems,
  parseRouteMigrations,
  parseRouterPaths,
  parseSegmentPermissionAliases,
  parseUnrestrictedPaths,
  readAtRef,
  resolveRef,
} from './app-sources.mjs'
import { derivePermission } from './derive-permission.mjs'

export function buildSnapshot(repoDir, ref) {
  const resolved = resolveRef(repoDir, ref)

  const sources = Object.fromEntries(
    Object.entries(SOURCE_FILES).map(([key, file]) => [key, readAtRef(repoDir, resolved.sha, file)]),
  )

  const routerPaths = parseRouterPaths(sources.routeTree)
  const labelsEs = JSON.parse(sources.labelsEs)
  const labelsEn = JSON.parse(sources.labelsEn)
  const nav = parseNavigationItems(sources.navigationItems)
  const migrations = parseRouteMigrations(sources.routeMigrations)
  const segmentAliases = parseSegmentPermissionAliases(sources.authHelpers)
  const unrestrictedPaths = parseUnrestrictedPaths(sources.checkModuleAccess)

  const permissionCtx = { unrestrictedPaths, segmentAliases, migrations }

  // Una ruta puede existir en el router, en routes.json, o en ambos. Las dos listas se
  // unen a propósito: la diferencia es justamente lo que hay que decidir en el inventario.
  const allPaths = [...new Set([...routerPaths, ...Object.keys(labelsEs).map(normalizePath)])].sort()

  const migrationByPath = new Map()
  for (const migration of migrations) {
    migrationByPath.set(normalizePath(migration.legacyPath), { role: 'alias', migration })
    migrationByPath.set(normalizePath(migration.newPath), { role: 'canonical', migration })
  }

  /** El primer segmento tras la base migrada, si lo hay: `/a/b/c` sobre base `/a/b` → `c`. */
  function nestedSegment(routePath, base) {
    return routePath.slice(base.length).split('/').filter(Boolean)[0]
  }

  function migrationOf(routePath) {
    const direct = migrationByPath.get(routePath)
    const entry =
      direct ??
      [...migrationByPath.entries()].find(([base]) => routePath.startsWith(`${base}/`))?.[1] ??
      null
    if (!entry) return null

    const { role, migration } = entry
    const base = role === 'canonical' ? migration.newPath : migration.legacyPath
    const nested = nestedSegment(routePath, normalizePath(base))
    if (nested && migration.unmigratedNestedSegments?.includes(nested)) return null

    const counterpartBase = role === 'canonical' ? migration.legacyPath : migration.newPath
    const suffix = routePath.slice(normalizePath(base).length)
    const counterpartNested =
      role === 'canonical'
        ? renameNested(nested, migration.newPermissionCodeByNestedSegment, migration.legacyPermissionCodeByNestedSegment)
        : renameNested(nested, migration.legacyPermissionCodeByNestedSegment, migration.newPermissionCodeByNestedSegment)

    const counterpart =
      counterpartNested && nested
        ? `${normalizePath(counterpartBase)}${suffix.replace(`/${nested}`, `/${counterpartNested}`)}`
        : `${normalizePath(counterpartBase)}${suffix}`

    return { role, counterpart: normalizePath(counterpart) }
  }

  /**
   * Traduce un segmento anidado de un lado de la migración al otro. Hoy los nombres
   * coinciden a ambos lados (`mapping`, `data-quality`), pero el código permite que no,
   * así que se cruza por el código de permiso en vez de asumir que son iguales.
   */
  function renameNested(segment, fromMap, toMap) {
    if (!segment || !fromMap || !toMap) return segment
    const code = fromMap[segment]
    if (!code) return segment
    const pair = migrations
      .flatMap((m) => m.permissionMigrations)
      .find((pm) => pm.newPermissionCode === code || pm.legacyPermissionCodes.includes(code))
    if (!pair) return segment
    const target = [pair.newPermissionCode, ...pair.legacyPermissionCodes]
    return Object.entries(toMap).find(([, c]) => target.includes(c))?.[0] ?? segment
  }

  const routes = allPaths.map((routePath) => {
    const navEntry = nav.get(routePath)
    const migration = migrationOf(routePath)
    return {
      path: routePath,
      label_es: labelsEs[routePath] ?? labelsEs[`${routePath}/`] ?? null,
      label_en: labelsEn[routePath] ?? labelsEn[`${routePath}/`] ?? null,
      in_router: routerPaths.has(routePath),
      in_routes_json: routePath in labelsEs || `${routePath}/` in labelsEs,
      in_nav: Boolean(navEntry),
      nav_parents: navEntry?.parents ?? null,
      dynamic: routePath.includes('$'),
      form: /\/(create)$/.test(routePath),
      permission: derivePermission(routePath, permissionCtx),
      migration,
    }
  })

  const snapshot = {
    _: 'Generado por tools/snapshot-app-routes.mjs. No editar a mano: regenerar y revisar el diff.',
    source: {
      repo: 'celes-app/celes-platform',
      ref: resolved.short,
      ref_full: resolved.sha,
      ref_date: resolved.date,
      files: Object.fromEntries(
        Object.entries(SOURCE_FILES).map(([key, file]) => [
          file,
          createHash('sha256').update(sources[key]).digest('hex').slice(0, 16),
        ]),
      ),
    },
    totals: {
      routes: routes.length,
      in_router: routes.filter((r) => r.in_router).length,
      labelled_only: routes.filter((r) => !r.in_router).length,
      in_nav: routes.filter((r) => r.in_nav).length,
      dynamic_or_form: routes.filter((r) => r.dynamic || r.form).length,
    },
    migrations: migrations.map((m) => ({
      alias: normalizePath(m.legacyPath),
      canonical: normalizePath(m.newPath),
      permissions: m.permissionMigrations.map((pm) => ({
        new: pm.newPermissionCode,
        legacy: [...pm.legacyPermissionCodes],
      })),
      unmigrated_nested: m.unmigratedNestedSegments ?? [],
    })),
    routes,
  }

  return snapshot
}
