#!/usr/bin/env node
/**
 * Genera `tools/data/app-routes.json`: la foto de las pantallas de la aplicación,
 * derivada del código de `celes-app/celes-platform` en un ref concreto.
 *
 * Se commitea el resultado porque el monorepo es privado y CI no lo puede clonar:
 * `nav-audit.mjs` corre contra esta foto. Regenerarla es un paso manual y explícito,
 * y su diff es lo que se revisa cuando la aplicación cambia.
 *
 *   node tools/snapshot-app-routes.mjs --repo ~/support/celes-platform --ref origin/development
 *
 * Este archivo no toma decisiones de contenido: solo dice qué rutas existen, cómo se
 * llaman, quién las ve y cuáles están en migración. Qué página de la wiki les
 * corresponde se decide en `tools/decisions.json`.
 *
 * Después de regenerar hay que correr `node tools/build-inventory.mjs` (y
 * `node tools/scaffold-pages.mjs` si aparecieron pantallas nuevas).
 */

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSnapshot } from './lib/snapshot.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'tools/data/app-routes.json')

function parseArgs(argv) {
  const args = { repo: process.env.CELES_PLATFORM_DIR, ref: 'origin/development' }
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '')
    if (!(key in args)) throw new Error(`Opción desconocida: ${argv[i]}`)
    args[key] = argv[i + 1]
  }
  if (!args.repo) {
    throw new Error(
      'Falta --repo con la ruta al checkout de celes-app/celes-platform (o CELES_PLATFORM_DIR)',
    )
  }
  return args
}

const { repo, ref } = parseArgs(process.argv.slice(2))
const snapshot = buildSnapshot(repo, ref)

writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(
  `${path.relative(ROOT, OUT)} · ref ${snapshot.source.ref} (${snapshot.source.ref_date}) · ` +
    `${snapshot.totals.routes} rutas, ${snapshot.totals.in_router} en el router, ` +
    `${snapshot.totals.labelled_only} solo con etiqueta, ${snapshot.migrations.length} migraciones`,
)
