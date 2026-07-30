/**
 * Lector del frontmatter de una página.
 *
 * No es un parser de YAML general: entiende **exactamente** las formas que el contrato
 * de contenido usa (`tools/content-contract.json`) y **falla** ante cualquier otra. Eso
 * es a propósito: un parser permisivo que adivina mal deja pasar una página rota, y en
 * esta wiki el frontmatter no es decoración — se publica en la cabecera del artículo y
 * es lo que hace la página auditable.
 *
 * Formas soportadas:
 *
 *   clave: escalar                 · `~`, `null` y el valor vacío se leen como null
 *   clave: [a, b, c]               · secuencia en línea
 *   clave: >                       · escalar plegado (las líneas se unen con espacios)
 *   clave: |                       · escalar literal (se conservan los saltos)
 *   clave:                         · secuencia en bloque, de escalares o de mapas
 *     - uno
 *     - k: v
 *       k2: v2
 *
 * Sin dependencias: el resto de `tools/` también es Node puro.
 */

/** Error de sintaxis con la línea real dentro del archivo. */
export class FrontmatterError extends Error {
  constructor(message, line) {
    super(message)
    this.name = 'FrontmatterError'
    this.line = line
  }
}

/**
 * @param {string} source contenido completo del `.md`
 * @returns {{data: object, lines: Record<string, number>, body: string, bodyLine: number}|null}
 *   `null` si el archivo no abre con un bloque `---`.
 */
export function readFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/)
  if (!match) return null

  const yaml = match[1].split(/\r?\n/)
  // +1 porque la línea 1 del archivo es el `---` de apertura.
  const data = {}
  const lines = {}

  let i = 0
  while (i < yaml.length) {
    const raw = yaml[i]
    const lineNumber = i + 2

    if (raw.trim() === '' || raw.trimStart().startsWith('#')) {
      i += 1
      continue
    }
    if (/^\s/.test(raw)) {
      throw new FrontmatterError(`indentación inesperada: «${raw.trim()}»`, lineNumber)
    }

    const entry = raw.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:[ \t]+(.*))?$/)
    if (!entry) {
      throw new FrontmatterError(`no es una clave del frontmatter: «${raw.trim()}»`, lineNumber)
    }

    const [, key, rest = ''] = entry
    if (key in data) throw new FrontmatterError(`clave repetida: \`${key}\``, lineNumber)
    lines[key] = lineNumber

    const inline = rest.trim()
    const block = /^[>|]/.test(inline)

    if (inline !== '' && !block) {
      data[key] = parseInline(inline, lineNumber)
      i += 1
      continue
    }

    // Valor en bloque: se consumen las líneas indentadas que siguen.
    const start = i + 1
    let end = start
    while (end < yaml.length && (yaml[end].trim() === '' || /^\s/.test(yaml[end]))) end += 1
    const nested = yaml.slice(start, end)

    if (block) {
      data[key] = parseBlockScalar(nested, inline[0])
    } else if (nested.some((line) => line.trim().startsWith('- '))) {
      data[key] = parseBlockSequence(nested, start + 2)
    } else if (nested.every((line) => line.trim() === '')) {
      data[key] = null
    } else {
      throw new FrontmatterError(
        `\`${key}\` abre un bloque que no es ni un escalar (\`>\`/\`|\`) ni una secuencia (\`- \`)`,
        lineNumber,
      )
    }
    i = end
  }

  const body = source.slice(match[0].length)
  const bodyLine = match[0].split(/\r?\n/).length
  return { data, lines, body, bodyLine }
}

/** Escalar suelto o secuencia en línea. */
function parseInline(text, lineNumber) {
  if (text.startsWith('[')) {
    if (!text.endsWith(']')) {
      throw new FrontmatterError(`secuencia en línea sin cerrar: «${text}»`, lineNumber)
    }
    const inner = text.slice(1, -1).trim()
    if (inner === '') return []
    return inner.split(',').map((item) => parseScalar(item.trim()))
  }
  if (text.startsWith('{')) {
    throw new FrontmatterError('los mapas en línea (`{...}`) no se usan en el contrato', lineNumber)
  }
  return parseScalar(text)
}

function parseScalar(text) {
  const value = text.replace(/\s+#.*$/, '').trim()
  if (value === '' || value === '~' || /^null$/i.test(value)) return null
  if (value === 'true') return true
  if (value === 'false') return false
  const quoted = value.match(/^'(.*)'$/s) ?? value.match(/^"(.*)"$/s)
  return quoted ? quoted[1] : value
}

/**
 * `>` pliega las líneas en un párrafo; `|` las conserva. Una línea en blanco corta
 * párrafo en ambos casos, que es lo único del plegado de YAML que el contenido usa.
 */
function parseBlockScalar(lines, marker) {
  const text = [...lines]
  while (text.length && text[text.length - 1].trim() === '') text.pop()

  if (marker === '|') return text.map((line) => line.trim()).join('\n')

  const paragraphs = []
  let current = []
  for (const line of text) {
    if (line.trim() === '') {
      if (current.length) paragraphs.push(current.join(' '))
      current = []
    } else current.push(line.trim())
  }
  if (current.length) paragraphs.push(current.join(' '))
  return paragraphs.join('\n\n').replace(/[ \t]+/g, ' ').trim()
}

/** Secuencia en bloque: de escalares o de mapas de un nivel. */
function parseBlockSequence(lines, firstLineNumber) {
  const items = []
  let current = null
  let itemIndent = null

  lines.forEach((raw, offset) => {
    const lineNumber = firstLineNumber + offset
    if (raw.trim() === '') return

    const bullet = raw.match(/^(\s*)-[ \t]+(.*)$/)
    if (bullet) {
      const [, indent, rest] = bullet
      itemIndent = indent.length + 2
      const pair = rest.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:[ \t]+(.*))?$/)
      if (pair) {
        current = { [pair[1]]: parseInline((pair[2] ?? '').trim(), lineNumber) }
        items.push(current)
      } else {
        current = null
        items.push(parseInline(rest.trim(), lineNumber))
      }
      return
    }

    // Continuación del mapa abierto por el último `- `.
    const pair = raw.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*):(?:[ \t]+(.*))?$/)
    if (!pair || current === null || pair[1].length !== itemIndent) {
      throw new FrontmatterError(`no encaja en la secuencia: «${raw.trim()}»`, lineNumber)
    }
    current[pair[2]] = parseInline((pair[3] ?? '').trim(), lineNumber)
  })

  return items
}
