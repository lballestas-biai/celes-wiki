#!/usr/bin/env node
/**
 * Las pruebas del índice para el agente.
 *
 *   node tools/agent-index.test.mjs
 *
 * Dos mitades:
 *
 *   · **Sobre la wiki real** — lo que pide el cierre de 1a.11: que el índice cubra el
 *     100% de las páginas del `nav` y que ninguna cita apunte a un ancla rota. Se
 *     comprueba construyendo el índice de verdad, no una maqueta.
 *   · **Sobre casos de laboratorio** — que las guardas *fallan* cuando toca. Una guarda
 *     que nunca se ve fallar es indistinguible de una guarda apagada, y estas tres
 *     (encabezado sin ancla, ancla repetida, cita rota) son las que sostienen la promesa
 *     de que un enlace publicado por el agente sigue funcionando.
 *
 * No tocan la red ni escriben en disco.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  IndexError,
  buildIndex,
  checkLinks,
  readAnchors,
  renderLlms,
  renderLlmsFull,
  toJson,
} from './lib/agent-index.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

let fallos = 0
const prueba = (nombre, fn) => {
  try {
    fn()
    console.log(`  ✓ ${nombre}`)
  } catch (error) {
    fallos += 1
    console.error(`  ✗ ${nombre}\n      ${error.message}`)
  }
}
const igual = (real, esperado, nota = '') => {
  if (JSON.stringify(real) !== JSON.stringify(esperado)) {
    throw new Error(`${nota}esperaba ${JSON.stringify(esperado)} y salió ${JSON.stringify(real)}`)
  }
}
const cierto = (condicion, nota) => {
  if (!condicion) throw new Error(nota)
}
const falla = (fn, fragmento) => {
  try {
    fn()
  } catch (error) {
    if (!(error instanceof IndexError)) throw error
    cierto(
      error.message.includes(fragmento),
      `falló, pero por otra cosa: «${error.message}» no menciona «${fragmento}»`,
    )
    return
  }
  throw new Error(`no falló, y tenía que fallar por «${fragmento}»`)
}

console.log('agent-index.test — el índice para el agente\n')

// --- sobre la wiki real ---------------------------------------------------

const index = buildIndex(ROOT)
const mkdocs = readFileSync(path.join(ROOT, 'mkdocs.yml'), 'utf8')

prueba('cubre el 100% de las páginas del nav', () => {
  // El nav es la lista publicada de páginas; se relee aquí a la brava, sin reusar el
  // parser del índice, para que un error en ese parser no se valide a sí mismo.
  const enElNav = [...mkdocs.matchAll(/^ +- (?:.+: )?(\S+\.md)$/gm)].map((m) => m[1])
  const enElIndice = new Set(index.pages.map((page) => page.path))

  cierto(enElNav.length > 0, 'no encontré ninguna página en el nav de mkdocs.yml')
  const faltan = enElNav.filter((page) => !enElIndice.has(page))
  igual(faltan, [], 'páginas del nav que no están en el índice: ')
  igual(index.pages.length, enElNav.length, 'el índice y el nav no tienen el mismo número de páginas: ')
})

prueba('ninguna cita interna apunta a un ancla rota', () => {
  // buildIndex ya lo comprueba y habría lanzado; esto lo afirma explícitamente y, de
  // paso, deja dicho cuántas citas se están sosteniendo.
  const conAncla = index.pages.flatMap((page) =>
    page.links.filter((link) => link.anchor).map((link) => ({ desde: page.path, ...link })),
  )
  const anclas = new Map(index.pages.map((page) => [page.path, new Set(page.anchors.map((a) => a.id))]))
  const rotas = conAncla.filter((link) => !anclas.get(link.page)?.has(link.anchor))
  igual(rotas, [], 'citas rotas: ')
  cierto(index.totals.anchors > 0, 'el índice no tiene ni un ancla')
})

prueba('toda página trae lo que el agente necesita para responder', () => {
  for (const page of index.pages) {
    cierto(page.title, `${page.path}: sin título`)
    cierto(page.summary.length > 0, `${page.path}: sin resumen`)
    cierto(page.url.startsWith(index.site.url), `${page.path}: la URL no cuelga del sitio`)
    cierto(page.anchors.length > 0, `${page.path}: sin ninguna sección citable`)
    cierto(page.status && page.verified_at, `${page.path}: sin estado o sin fecha de verificación`)
  }
})

prueba('las URL siguen la forma de directorio de MkDocs', () => {
  const url = (file) => index.pages.find((page) => page.path === file)?.url
  igual(url('index.md'), index.site.url)
  igual(url('reabastecimiento/index.md'), `${index.site.url}reabastecimiento/`)
  igual(url('reabastecimiento/comprar.md'), `${index.site.url}reabastecimiento/comprar/`)
})

prueba('el JSON publicado no arrastra el cuerpo de las páginas', () => {
  const json = toJson(index)
  cierto(
    json.pages.every((page) => !('body' in page)),
    'alguna entrada del índice sigue llevando el cuerpo entero',
  )
  igual(json.totals.pages, index.pages.length)
})

prueba('llms.txt lista todas las páginas, agrupadas por bloque', () => {
  const llms = renderLlms(index)
  igual(llms.split('\n')[0], `# ${index.site.name}`)
  for (const page of index.pages) {
    cierto(llms.includes(`](${page.url}):`), `${page.path} no aparece en llms.txt`)
  }
  for (const block of index.blocks) {
    cierto(llms.includes(`\n## ${block}\n`), `falta la sección «${block}» en llms.txt`)
  }
})

prueba('llms-full.txt trae el texto de todas las páginas', () => {
  const full = renderLlmsFull(index)
  for (const page of index.pages) {
    cierto(full.includes(`<!-- página: ${page.id} -->`), `${page.path} no aparece en llms-full.txt`)
    // Una frase del cuerpo, no solo la cabecera: es la diferencia entre un índice y el texto.
    const frase = page.body.trim().split('\n').filter((line) => line.trim().length > 40)[0]
    cierto(!frase || full.includes(frase.trim()), `${page.path}: la cabecera está pero el cuerpo no`)
  }
})

// --- las guardas fallan cuando toca ---------------------------------------

prueba('un encabezado sin ancla explícita detiene la construcción', () => {
  igual(readAnchors('## Con ancla { #con-ancla }\n', 'x.md'), [
    { id: 'con-ancla', title: 'Con ancla', level: 2 },
  ])
  falla(() => readAnchors('## Sin ancla\n', 'x.md'), 'no lleva ancla explícita')
  falla(() => readAnchors('### Tampoco esta\n', 'x.md'), 'no lleva ancla explícita')
})

prueba('un ancla repetida en la misma página detiene la construcción', () => {
  falla(
    () => readAnchors('## Uno { #repetida }\n## Dos { #repetida }\n', 'x.md'),
    'está repetida',
  )
})

prueba('un encabezado dentro de un bloque de código no es un ancla', () => {
  igual(readAnchors('```\n## Esto es código\n```\n', 'x.md'), [])
})

prueba('una cita a una página o a un ancla que no existen detiene la construcción', () => {
  const pagina = (path, anchors, links) => ({ path, anchors, links })
  const destino = pagina('b.md', [{ id: 'que-es', title: 'Qué es', level: 2 }], [])

  checkLinks([pagina('a.md', [], [{ page: 'b.md', anchor: 'que-es' }]), destino])
  falla(
    () => checkLinks([pagina('a.md', [], [{ page: 'b.md', anchor: 'no-existe' }]), destino]),
    'no tiene ese ancla',
  )
  falla(
    () => checkLinks([pagina('a.md', [], [{ page: 'c.md', anchor: null }]), destino]),
    'no es una página de la wiki',
  )
})

console.log('')
if (fallos) {
  console.error(`agent-index.test: ${fallos} prueba(s) fallaron`)
  process.exit(1)
}
console.log(
  `agent-index.test: todo en orden · ${index.totals.pages} páginas y ${index.totals.anchors} anclas`,
)
