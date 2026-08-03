/**
 * El índice que la wiki publica para que un agente pueda consultarla.
 *
 * Aquí vive la construcción; `tools/build-agent-index.mjs` es la línea de comandos y
 * `tools/agent-index.test.mjs` las pruebas. Se emiten tres artefactos, y los tres salen
 * de la misma lectura de `docs/`:
 *
 *   · `wiki-index.json`  el catálogo: una entrada por página, con su resumen, sus
 *                        palabras clave y **sus anclas**. Es lo que se recorre para
 *                        decidir qué página responde una pregunta.
 *   · `llms.txt`         el mapa corto, en el formato de llmstxt.org: título, resumen y
 *                        un enlace por página, agrupado por bloque.
 *   · `llms-full.txt`    el texto completo de todas las páginas, en un solo archivo.
 *
 * Tres decisiones que conviene no deshacer sin querer:
 *
 * 1. **Las anclas se leen, no se inventan.** Cada `##`/`###` de la wiki lleva su id
 *    escrito en el Markdown (`## Título { #ancla }`), así que el índice las copia. Si el
 *    id se dedujera del título, cambiar una palabra del encabezado rompería toda cita
 *    publicada; escrito, el título se puede reescribir sin tocar el enlace. Una página
 *    con un encabezado sin id es un error de construcción, no un aviso.
 *
 * 2. **El índice no publica `sources:`.** El agente no necesita rutas del código para
 *    responder, y un archivo público y legible por máquina con el mapa de archivos del
 *    monorepo es más exposición de la que D5 de la épica aceptó (que era la ficha
 *    renderizada de cada página). La rutina de refresco (#2805) lee el frontmatter de
 *    `docs/` directamente, que es donde vive.
 *
 * 3. **El orden lo manda el `nav` de `mkdocs.yml`**, no el disco. Es el mismo orden que
 *    ve una persona en el menú, y es lo que hace comprobable la cobertura: si una página
 *    está en el nav y no en el índice, la construcción falla.
 */

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { FrontmatterError, readFrontmatter } from './frontmatter.mjs'

/** Versión del formato de `wiki-index.json`. Subirla si cambia la forma de una entrada. */
export const SCHEMA_VERSION = 1

const NAV_START = '# --- nav generado por tools/scaffold-pages.mjs — no editar a mano ---'
const NAV_END = '# --- fin del nav generado ---'

/** Error de construcción con el archivo que lo provoca. */
export class IndexError extends Error {
  constructor(message, file) {
    super(file ? `docs/${file} — ${message}` : message)
    this.name = 'IndexError'
    this.file = file ?? null
  }
}

/**
 * Lee `mkdocs.yml` y `docs/` y devuelve el índice ya armado.
 *
 * @param {string} root raíz del repositorio
 * @returns {object} el contenido de `wiki-index.json`
 */
export function buildIndex(root) {
  const mkdocs = readFileSync(path.join(root, 'mkdocs.yml'), 'utf8')
  const site = readSite(mkdocs)
  const nav = readNav(mkdocs)

  const docs = path.join(root, 'docs')
  const onDisk = new Set(markdownFiles(docs))
  const pages = []

  for (const entry of nav) {
    if (!onDisk.has(entry.page)) {
      throw new IndexError('está en el `nav` de mkdocs.yml y no existe en el disco.', entry.page)
    }
    pages.push(readPage(docs, entry, site))
  }

  // Cobertura, en las dos direcciones. La primera la garantiza el bucle de arriba; esta
  // es la que caza una página escrita y nunca enlazada, que el agente no encontraría.
  const indexed = new Set(pages.map((page) => page.path))
  for (const file of onDisk) {
    if (!indexed.has(file)) {
      throw new IndexError('no está en el `nav` de mkdocs.yml: quedaría fuera del índice.', file)
    }
  }

  checkLinks(pages)

  return {
    // Los artefactos publicados no nombran los archivos que los generan: la wiki es
    // pública y el denylist confina las rutas del código al `sources:` del frontmatter.
    _: 'Índice de la wiki de Celes para consulta por un agente. Una entrada por página, con su resumen, sus palabras clave y las anclas de sus secciones. Generado en cada publicación a partir del contenido; no se edita a mano.',
    schema_version: SCHEMA_VERSION,
    site,
    totals: {
      pages: pages.length,
      verified: pages.filter((page) => page.status === 'verified').length,
      anchors: pages.reduce((sum, page) => sum + page.anchors.length, 0),
    },
    blocks: [...new Map(pages.filter((p) => p.module).map((p) => [p.module, p.module])).keys()],
    pages,
  }
}

// --- mkdocs.yml -----------------------------------------------------------

/** Los tres escalares de la cabecera que el índice publica. */
function readSite(mkdocs) {
  const read = (key) => {
    const match = mkdocs.match(new RegExp(`^${key}:[ \\t]+(.*)$`, 'm'))
    if (!match) throw new IndexError(`mkdocs.yml no declara \`${key}\``)
    return match[1].trim().replace(/^['"](.*)['"]$/, '$1')
  }
  const url = read('site_url')
  return {
    name: read('site_name'),
    description: read('site_description'),
    url: url.endsWith('/') ? url : `${url}/`,
  }
}

/**
 * El `nav` generado, en orden. Entiende exactamente las dos formas que emite
 * `scaffold-pages.mjs` —`- Título: ruta.md` y `- ruta.md` bajo un `- Bloque:`— y falla
 * ante cualquier otra: si el generador cambia de forma, esto tiene que enterarse.
 */
function readNav(mkdocs) {
  const start = mkdocs.indexOf(NAV_START)
  const end = mkdocs.indexOf(NAV_END)
  if (start === -1 || end === -1) throw new IndexError('mkdocs.yml no tiene el bloque `nav` generado')

  const entries = []
  let block = null

  for (const raw of mkdocs.slice(start, end).split('\n')) {
    const line = raw.replace(/\s+$/, '')
    if (line.trim() === '' || line.trimStart().startsWith('#') || line === 'nav:') continue

    const group = line.match(/^ {2}- (.+):$/)
    if (group) {
      block = unquote(group[1])
      continue
    }

    const titled = line.match(/^ {2,6}- (.+): (\S+\.md)$/)
    if (titled) {
      entries.push({ page: titled[2], nav_title: unquote(titled[1]), block: line.startsWith('  - ') ? null : block })
      continue
    }

    const bare = line.match(/^ {6}- (\S+\.md)$/)
    if (bare) {
      entries.push({ page: bare[1], nav_title: block, block })
      continue
    }

    throw new IndexError(`no entiendo esta línea del nav: «${line.trim()}»`)
  }

  return entries
}

function unquote(text) {
  const quoted = text.match(/^'(.*)'$/s) ?? text.match(/^"(.*)"$/s)
  return quoted ? quoted[1].replace(/''/g, "'") : text
}

// --- una página -----------------------------------------------------------

function readPage(docs, entry, site) {
  const source = readFileSync(path.join(docs, entry.page), 'utf8')

  let parsed
  try {
    parsed = readFrontmatter(source)
  } catch (error) {
    if (!(error instanceof FrontmatterError)) throw error
    throw new IndexError(`frontmatter ilegible (línea ${error.line}): ${error.message}`, entry.page)
  }
  if (!parsed) throw new IndexError('no tiene frontmatter.', entry.page)

  const { data, body } = parsed
  const url = `${site.url}${urlPathOf(entry.page)}`
  const anchors = readAnchors(body, entry.page).map((anchor) => ({ ...anchor, url: `${url}#${anchor.id}` }))

  return {
    id: entry.page.replace(/\.md$/, ''),
    path: entry.page,
    url,
    title: str(data.title),
    nav_title: entry.nav_title ?? str(data.title),
    module: str(data.module),
    route: str(data.route),
    aliases: arr(data.aliases),
    permission: str(data.permission),
    audience: arr(data.audience),
    summary: oneLine(str(data.summary) ?? ''),
    keywords: arr(data.keywords),
    tenant_variance: str(data.tenant_variance),
    status: str(data.status),
    verified_at: str(data.verified_at),
    anchors,
    links: readLinks(body, entry.page),
    body,
  }
}

/** `index.md` → ``, `bloque/index.md` → `bloque/`, `bloque/pág.md` → `bloque/pág/`. */
function urlPathOf(file) {
  const withoutExtension = file.replace(/\.md$/, '')
  if (withoutExtension === 'index') return ''
  return `${withoutExtension.replace(/\/index$/, '')}/`
}

/**
 * Las anclas de la página: todo `##` y `###` con su id explícito. Un encabezado sin id
 * detiene la construcción — sin id, el enlace que publique el agente depende del texto
 * del título, y el título se reescribe.
 *
 * Exportada para `agent-index.test.mjs`: es la guarda que sostiene la promesa de que una
 * cita publicada no se rompe, y se prueba sola, sin montar un sitio de mentira.
 */
export function readAnchors(body, file) {
  const anchors = []
  const seen = new Set()
  let fenced = false

  body.split('\n').forEach((line) => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    if (fenced) return

    const heading = line.match(/^(#{2,6})\s+(.*)$/)
    if (!heading) return

    const [, hashes, rest] = heading
    const explicit = rest.match(/^(.*?)\s*\{\s*#([A-Za-z0-9_-]+)\s*\}\s*$/)
    if (!explicit) {
      throw new IndexError(
        `el encabezado «${rest.trim()}» no lleva ancla explícita. Escribirlo como ` +
          `\`${hashes} ${rest.trim()} { #una-ancla }\`.`,
        file,
      )
    }
    const [, title, id] = explicit
    if (seen.has(id)) throw new IndexError(`el ancla \`#${id}\` está repetida.`, file)
    seen.add(id)
    anchors.push({ id, title: title.trim(), level: hashes.length })
  })

  return anchors
}

/** Enlaces salientes a otras páginas de la wiki, ya resueltos a su archivo. */
export function readLinks(body, file) {
  const links = []
  const from = path.dirname(file)

  for (const match of body.matchAll(/(!)?\[[^\]]*\]\(([^)\s]+)\)/g)) {
    if (match[1]) continue // una imagen no es una cita
    const target = match[2]
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue // http:, mailto:…

    const [href, anchor] = target.split('#')
    if (href === '') {
      links.push({ page: file, anchor: anchor ?? null })
      continue
    }
    if (!href.endsWith('.md')) continue // capturas y demás estáticos

    links.push({ page: path.posix.normalize(path.posix.join(from, href)), anchor: anchor ?? null })
  }

  // Dedup conservando el orden de aparición.
  const key = (link) => `${link.page}#${link.anchor ?? ''}`
  return [...new Map(links.map((link) => [key(link), link])).values()]
}

/**
 * Ninguna cita interna apunta al vacío. `mkdocs build --strict` ya lo comprueba para el
 * sitio; se repite aquí porque el índice se construye y se valida sin Python, y porque
 * lo que el agente va a citar son exactamente estos pares página + ancla.
 */
export function checkLinks(pages) {
  const byPath = new Map(pages.map((page) => [page.path, page]))

  for (const page of pages) {
    for (const link of page.links) {
      const target = byPath.get(link.page)
      if (!target) {
        throw new IndexError(`enlaza a \`${link.page}\`, que no es una página de la wiki.`, page.path)
      }
      if (link.anchor && !target.anchors.some((anchor) => anchor.id === link.anchor)) {
        throw new IndexError(
          `enlaza a \`${link.page}#${link.anchor}\` y esa página no tiene ese ancla.`,
          page.path,
        )
      }
    }
  }
}

/**
 * El índice tal como se publica. El cuerpo de cada página se queda fuera: es lo que
 * `llms-full.txt` sirve, y meterlo aquí multiplicaría por diez un archivo que se recorre
 * entero para decidir qué página abrir.
 */
export function toJson(index) {
  return {
    ...index,
    pages: index.pages.map(({ body, ...page }) => page),
  }
}

// --- los dos .txt ---------------------------------------------------------

/**
 * `llms.txt` en el formato de llmstxt.org: un H1, el resumen del sitio entre `>`, y una
 * sección por bloque con un enlace y una frase por página.
 */
export function renderLlms(index) {
  const lines = [
    `# ${index.site.name}`,
    '',
    `> ${index.site.description}`,
    '',
    'Documentación de producto de Celes. Cada página describe una pantalla o un concepto',
    'del producto y declara contra qué se verificó y en qué fecha.',
    '',
    `- [wiki-index.json](${index.site.url}wiki-index.json): el mismo contenido en JSON, con las anclas de cada sección para poder citar página y sección.`,
    `- [llms-full.txt](${index.site.url}llms-full.txt): el texto completo de todas las páginas en un solo archivo.`,
    '',
  ]

  const withoutBlock = index.pages.filter((page) => !page.module)
  if (withoutBlock.length) {
    lines.push('## Portada', '')
    for (const page of withoutBlock) lines.push(item(page))
    lines.push('')
  }

  for (const block of index.blocks) {
    lines.push(`## ${block}`, '')
    for (const page of index.pages.filter((page) => page.module === block)) lines.push(item(page))
    lines.push('')
  }

  return `${lines.join('\n').trimEnd()}\n`

  function item(page) {
    return `- [${page.title}](${page.url}): ${page.summary}`
  }
}

/**
 * `llms-full.txt`: el texto de todas las páginas, en el orden del menú, cada una con la
 * cabecera mínima que permite citarla. Sin `sources:` — ver la decisión 2 de arriba.
 */
export function renderLlmsFull(index) {
  const parts = [
    `# ${index.site.name} — texto completo`,
    '',
    `> ${index.site.description}`,
    '',
    `Las ${index.totals.pages} páginas de ${index.site.url} en un solo archivo, en el orden del menú.`,
    'Generado en cada publicación a partir del contenido de la wiki.',
    '',
  ]

  for (const page of index.pages) {
    const ficha = [
      `url: ${page.url}`,
      page.module ? `bloque: ${page.module}` : null,
      page.route ? `pantalla: ${page.route}` : null,
      page.permission ? `permiso: ${page.permission}` : null,
      `estado: ${page.status} · verificada: ${page.verified_at} · variación por instancia: ${page.tenant_variance}`,
      page.anchors.length ? `secciones: ${page.anchors.map((a) => `#${a.id}`).join(' · ')}` : null,
    ].filter(Boolean)

    parts.push(
      '---',
      '',
      `<!-- página: ${page.id} -->`,
      '',
      ...ficha,
      '',
      page.body.trim(),
      '',
    )
  }

  return `${parts.join('\n').trimEnd()}\n`
}

// --- utilidades -----------------------------------------------------------

function str(value) {
  return typeof value === 'string' ? value : null
}

function arr(value) {
  return Array.isArray(value) ? value : []
}

function oneLine(text) {
  return text.replace(/\s+/g, ' ').trim()
}

export function markdownFiles(dir, prefix = '') {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'assets') continue
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) files.push(...markdownFiles(path.join(dir, entry.name), relative))
    else if (entry.name.endsWith('.md')) files.push(relative)
  }
  return files
}
