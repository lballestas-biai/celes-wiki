#!/usr/bin/env node
/**
 * Emite los artefactos que la wiki publica para ser consultada por un agente.
 *
 *   node tools/build-agent-index.mjs [--out docs] [--quiet]
 *
 * Escribe tres archivos en `docs/`, que MkDocs copia tal cual a la raíz del sitio:
 *
 *   docs/wiki-index.json   catálogo con resumen, palabras clave y anclas por página
 *   docs/llms.txt          el mapa corto, formato llmstxt.org
 *   docs/llms-full.txt     el texto completo de todas las páginas
 *
 * **Los tres están en `.gitignore` y se generan en cada construcción.** No se commitean
 * a propósito: son una copia derivada de `docs/`, y una copia commiteada solo puede
 * estar de acuerdo con su fuente o mentir. Lo que sí está versionado —y es lo que hace
 * estable la cita del agente— son las anclas, escritas a mano en cada encabezado del
 * Markdown; el índice se limita a copiarlas.
 *
 * Por eso corre **antes** de `mkdocs build` en `deploy.yml`, y también antes de
 * `check-denylist` en `content-checks.yml`: lo que se publica se revisa.
 *
 * La construcción falla —no avisa— si una página del nav no existe, si una página de
 * `docs/` no está en el nav, si un encabezado no lleva ancla explícita, si un ancla está
 * repetida o si una cita interna apunta a una página o a un ancla que no existen. Un
 * índice incompleto es peor que ninguno: el agente no sabe que le falta algo.
 *
 * Las pruebas de todo esto están en `tools/agent-index.test.mjs`.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { IndexError, buildIndex, renderLlms, renderLlmsFull, toJson } from './lib/agent-index.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const out = path.resolve(ROOT, valueOf('--out') ?? 'docs')
const quiet = argv.includes('--quiet')

let index
try {
  index = buildIndex(ROOT)
} catch (error) {
  if (!(error instanceof IndexError)) throw error
  console.error(`build-agent-index: no se pudo construir el índice\n\n  · ${error.message}\n`)
  process.exit(1)
}

const artefactos = {
  'wiki-index.json': `${JSON.stringify(toJson(index), null, 2)}\n`,
  'llms.txt': renderLlms(index),
  'llms-full.txt': renderLlmsFull(index),
}

mkdirSync(out, { recursive: true })
for (const [name, content] of Object.entries(artefactos)) {
  writeFileSync(path.join(out, name), content)
}

if (!quiet) {
  const { pages, verified, anchors } = index.totals
  const tamaños = Object.entries(artefactos)
    .map(([name, content]) => `${name} ${Math.round(Buffer.byteLength(content) / 1024)} kB`)
    .join(' · ')
  console.log(
    `build-agent-index: ${pages} páginas (${verified} verificadas) y ${anchors} anclas ` +
      `· ${tamaños}`,
  )
}

function valueOf(flag) {
  const i = argv.indexOf(flag)
  return i === -1 ? undefined : argv[i + 1]
}
