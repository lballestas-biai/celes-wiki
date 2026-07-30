/**
 * Reimplementación de `checkModuleAccess.ts` para responder, por ruta,
 * **quién puede ver esta pantalla**.
 *
 * La aplicación no guarda "permiso de la pantalla X" en ningún lado: convierte la ruta
 * en códigos de módulo y los compara contra los `permission.code` del usuario. Así que
 * el permiso de cada página de la wiki es *derivable*, no una opinión — y esta función
 * es esa derivación. Si `checkModuleAccess.ts` cambia, `nav-audit` compara el hash del
 * archivo y avisa.
 */

import { normalizePath } from './app-sources.mjs'

/**
 * @returns {{
 *   kind: 'unrestricted'|'module'|'exact'|'administration-prefix'|'migrated',
 *   code: string|null,
 *   legacy?: string[],
 *   note?: string
 * }}
 */
export function derivePermission(rawPath, ctx) {
  const path = normalizePath(rawPath)
  const { unrestrictedPaths, segmentAliases, migrations } = ctx

  for (const unrestricted of unrestrictedPaths) {
    if (isWithin(path, unrestricted)) {
      return {
        kind: 'unrestricted',
        code: null,
        note: 'checkModuleAccess la deja pasar antes de mirar permisos: la ve cualquier usuario autenticado',
      }
    }
  }

  const migrated = resolveMigrationPermission(path, migrations)
  if (migrated) return migrated

  const segments = path
    .split('/')
    .filter(Boolean)
    .slice(0, 3)
    .map((segment) => segmentAliases[segment] ?? segment)

  const [moduleCode, submoduleCode, innerSubmoduleCode] = segments
  if (!moduleCode) return { kind: 'module', code: null }

  if (!submoduleCode) {
    return {
      kind: 'module',
      code: moduleCode,
      note: 'basta cualquier permiso activo del módulo',
    }
  }

  if (moduleCode === 'administration') {
    return {
      kind: 'administration-prefix',
      code: [moduleCode, submoduleCode, innerSubmoduleCode].filter(Boolean).join('.'),
      note: 'en Administración un permiso abre la ruta si los segmentos de uno son prefijo de los del otro, en cualquier dirección',
    }
  }

  // Fuera de Administración solo cuentan los dos primeros segmentos: `/work-area/automation/dispatches`
  // se resuelve con `work-area.automation`, no con un código de tres partes.
  return { kind: 'exact', code: `${moduleCode}.${submoduleCode}` }
}

/**
 * Ruta cubierta por `ROUTE_MIGRATIONS`: el permiso preferido es el nuevo, con el viejo
 * como respaldo. La URL que ve el usuario depende de cuál de los dos tenga concedido.
 */
function resolveMigrationPermission(path, migrations) {
  const migration = migrations.find(
    ({ legacyPath, newPath }) => isWithin(path, legacyPath) || isWithin(path, newPath),
  )
  if (!migration) return null

  const base = isWithin(path, migration.newPath) ? migration.newPath : migration.legacyPath
  const nestedSegment = path.slice(base.length).split('/').filter(Boolean)[0]

  // Sub-rutas explícitamente no migradas (p. ej. `data-upload`) siguen la regla general.
  if (nestedSegment && migration.unmigratedNestedSegments?.includes(nestedSegment)) return null

  const legacyByNested = migration.legacyPermissionCodeByNestedSegment
  const newByNested = migration.newPermissionCodeByNestedSegment
  const hasNestedConfig = Boolean(nestedSegment && (legacyByNested || newByNested))

  if (hasNestedConfig) {
    const legacyCode = legacyByNested?.[nestedSegment]
    const newCode = newByNested?.[nestedSegment]
    const pair = migration.permissionMigrations.find(
      (pm) =>
        (newCode && pm.newPermissionCode === newCode) ||
        (legacyCode && pm.legacyPermissionCodes.includes(legacyCode)),
    )
    if (pair) {
      return {
        kind: 'migrated',
        code: pair.newPermissionCode,
        legacy: legacyCode ? [legacyCode] : [...pair.legacyPermissionCodes],
        note: 'pantalla en migración: vale el permiso nuevo o el viejo',
      }
    }
    // Segmento anidado sin par de permisos: la app niega el acceso.
    return { kind: 'migrated', code: null, legacy: [], note: 'sin permiso asociado' }
  }

  // Ruta padre de una migración: la abre cualquiera de los permisos de sus hijas,
  // nuevo o viejo, más los `legacyParentPermissionCodes` si los hay.
  const newCodes = migration.permissionMigrations.map((pm) => pm.newPermissionCode)
  return {
    kind: 'migrated',
    code: newCodes[0],
    alternatives: newCodes.slice(1),
    legacy: [
      ...migration.permissionMigrations.flatMap((pm) => [...pm.legacyPermissionCodes]),
      ...(migration.legacyParentPermissionCodes ?? []),
    ],
    note: 'pantalla en migración: vale el permiso nuevo o el viejo',
  }
}

function isWithin(path, base) {
  return path === base || path.startsWith(`${base}/`)
}
