#!/usr/bin/env node
/**
 * La puerta de revisión humana, escrita en el manifiesto.
 *
 *   node tools/screenshots/approve.mjs --pendientes                     # qué falta mirar
 *   node tools/screenshots/approve.mjs --todas --por "Nombre Apellido"
 *   node tools/screenshots/approve.mjs reabastecimiento/comprar.png --por "Nombre Apellido"
 *
 * Aprobar es afirmar que **abriste el PNG y lo miraste**. Ese es el paso que ningún script
 * puede hacer: la guarda de `capture.mjs` no sabe leer píxeles, así que un dato que la
 * aplicación pinte dentro de un `canvas`, una marca de agua o un nombre en un tooltip que
 * quedó abierto solo los ve una persona.
 *
 * La aprobación se guarda junto al `sha256` del archivo aprobado. Si el PNG se vuelve a
 * capturar, la firma cambia y `check-screenshots.mjs` vuelve a exigir revisión: se aprueba
 * una imagen, no un nombre de archivo.
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const MANIFIESTO = path.join(ROOT, 'tools/screenshots/manifest.json')
const argv = process.argv.slice(2)
const valor = (nombre) => (argv.includes(nombre) ? argv[argv.indexOf(nombre) + 1] : null)

if (!existsSync(MANIFIESTO)) fallar('todavía no hay manifiesto: corré capture.mjs primero')
const manifiesto = JSON.parse(readFileSync(MANIFIESTO, 'utf8'))

const pendientes = manifiesto.capturas.filter((captura) => !revisada(captura))

if (argv.includes('--pendientes') || !argv.length) {
  if (!pendientes.length) {
    console.log(`approve: no hay capturas pendientes · ${manifiesto.capturas.length} revisadas`)
    process.exit(0)
  }
  console.log(`approve: ${pendientes.length} captura(s) sin revisar\n`)
  for (const captura of pendientes) {
    console.log(`  docs/assets/screenshots/${captura.destino}`)
    console.log(`    pantalla ${captura.ruta} · ${captura.ancho}×${captura.alto} · tomada ${captura.tomada_en}`)
  }
  console.log(
    '\n  Abrirlas y mirar, una por una, que no quede ningún dato de cliente ni identidad de\n' +
      '  la cuenta que capturó. Después:\n' +
      '    node tools/screenshots/approve.mjs --todas --por "Tu nombre"',
  )
  process.exit(0)
}

const por = valor('--por')
if (!por) fallar('falta --por "Nombre Apellido": la revisión es de alguien, no de nadie')

const objetivos = argv.includes('--todas') ? pendientes : manifiesto.capturas.filter((c) => argv.includes(c.destino))
if (!objetivos.length) fallar('ninguna captura coincide (¿ya estaba revisada? probá --pendientes)')

const hoy = new Date().toISOString().slice(0, 10)
for (const captura of objetivos) {
  const archivo = path.join(ROOT, 'docs/assets/screenshots', captura.destino)
  if (!existsSync(archivo)) fallar(`${captura.destino} está en el manifiesto pero no en docs/assets/screenshots/`)
  const sha = createHash('sha256').update(readFileSync(archivo)).digest('hex')
  if (sha !== captura.sha256) fallar(`${captura.destino} cambió desde que se capturó: volver a correr capture.mjs`)
  captura.revision = { por, en: hoy, sha256: sha }
  console.log(`✓ ${captura.destino} — revisada por ${por}`)
}

writeFileSync(MANIFIESTO, `${JSON.stringify(manifiesto, null, 2)}\n`)
console.log(`\n${objetivos.length} captura(s) aprobadas. El manifiesto va en el mismo PR que los PNG.`)

function revisada(captura) {
  return Boolean(captura.revision?.por && captura.revision?.sha256 === captura.sha256)
}

function fallar(mensaje) {
  console.error(`approve: ${mensaje}`)
  process.exit(2)
}
