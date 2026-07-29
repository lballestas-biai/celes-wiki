/** Formato legible de un permiso derivado, para la vista en Markdown. */
export function formatPermission(permission) {
  if (!permission) return '—'
  const { kind, code, alternatives = [], legacy = [] } = permission

  switch (kind) {
    case 'unrestricted':
      return 'sin permiso'
    case 'module':
      return code ? `cualquiera de \`${code}.*\`` : '—'
    case 'administration-prefix':
      return `\`${code}\` (prefijo)`
    case 'migrated': {
      const nuevos = [code, ...alternatives].filter(Boolean).map((c) => `\`${c}\``)
      const viejos = legacy.map((c) => `\`${c}\``)
      return `${nuevos.join(' o ')}${viejos.length ? ` — o el anterior ${viejos.join(' / ')}` : ''}`
    }
    default:
      return code ? `\`${code}\`` : '—'
  }
}

/** La misma información en prosa, para el cuerpo de la página. */
export function describePermission(permission) {
  if (!permission) return 'Sin determinar.'
  const { kind, code, alternatives = [], legacy = [] } = permission
  const anterior = legacy.length
    ? ` También la abre el permiso anterior ${legacy.map((c) => `\`${c}\``).join(' o ')}.`
    : ''

  switch (kind) {
    case 'unrestricted':
      return 'Cualquier usuario que entre a la aplicación: esta pantalla no exige permiso.'
    case 'module':
      return `Cualquier usuario con algún permiso del módulo \`${code}\`.`
    case 'exact':
      return `Usuarios con el permiso \`${code}\`.`
    case 'administration-prefix':
      return `Usuarios con el permiso \`${code}\`, o con uno más específico dentro de él.`
    case 'migrated': {
      const nuevos = [code, ...alternatives].filter(Boolean).map((c) => `\`${c}\``)
      return `Usuarios con el permiso ${nuevos.join(' o ')}.${anterior}`
    }
    default:
      return 'Sin determinar.'
  }
}

/** Escapa un valor para meterlo en una celda de tabla Markdown. */
export function cell(value) {
  return String(value ?? '—').replace(/\|/g, '\\|')
}
