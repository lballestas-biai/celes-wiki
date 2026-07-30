#!/usr/bin/env node
/**
 * Lo que CI comprueba sobre las capturas. Cuatro preguntas:
 *
 *   1. ¿Está en el manifiesto? Un PNG en `docs/assets/screenshots/` que nadie anotó no se
 *      sabe de dónde salió ni con qué reglas se saneó.
 *   2. ¿La miró una persona? `revision` con nombre y con el `sha256` del archivo que hay
 *      hoy. Aprobar una imagen y cambiarla después no cuenta.
 *   3. ¿Es un PNG de verdad, del tamaño que dice? Barato de comprobar y delata un archivo
 *      cambiado a mano.
 *   4. ¿Entró alguna imagen al **historial** fuera de `docs/assets/screenshots/`? El
 *      historial de git es permanente: un original commiteado no se borra con el commit
 *      siguiente. Esta es la única de las cuatro que mira el pasado, y por eso el job de
 *      CI clona con `fetch-depth: 0`.
 *
 * Lo que **no** comprueba: los píxeles. Que la captura no muestre datos de cliente lo
 * afirma la revisión humana del punto 2; esto solo se asegura de que esa revisión exista.
 *
 *   node tools/screenshots/check-screenshots.mjs
 *   node tools/screenshots/check-screenshots.mjs --sin-historial   # sin el barrido de git
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const CAPTURAS = 'docs/assets/screenshots'
const MANIFIESTO = path.join(ROOT, 'tools/screenshots/manifest.json')
const FIRMA_PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const problemas = []
const anotar = (que, porque) => problemas.push({ que, porque })

const manifiesto = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, 'utf8')) : { capturas: [] }
const porDestino = new Map(manifiesto.capturas.map((captura) => [captura.destino, captura]))
const publicadas = listarPng(path.join(ROOT, CAPTURAS))

for (const destino of publicadas) {
  const captura = porDestino.get(destino)
  if (!captura) {
    anotar(`${CAPTURAS}/${destino} no está en el manifiesto`, 'Toda captura publicada se toma con capture.mjs, que la anota.')
    continue
  }

  const bytes = readFileSync(path.join(ROOT, CAPTURAS, destino))
  const sha = createHash('sha256').update(bytes).digest('hex')

  if (!bytes.subarray(0, 8).equals(FIRMA_PNG)) anotar(`${destino} no es un PNG`, 'Las capturas de la wiki son PNG.')
  else {
    const ancho = bytes.readUInt32BE(16)
    const alto = bytes.readUInt32BE(20)
    if (ancho !== captura.ancho || alto !== captura.alto) {
      anotar(
        `${destino} mide ${ancho}×${alto} y el manifiesto dice ${captura.ancho}×${captura.alto}`,
        'El archivo no es el que se capturó.',
      )
    }
  }

  if (sha !== captura.sha256) {
    anotar(`${destino} cambió después de capturarse`, 'Volver a correr capture.mjs y aprobar de nuevo.')
    continue
  }
  if (!captura.revision?.por) {
    anotar(
      `${destino} no tiene revisión humana`,
      'Ningún script sabe si una captura muestra datos de cliente: eso lo mira una persona. ' +
        'node tools/screenshots/approve.mjs --pendientes',
    )
  } else if (captura.revision.sha256 !== sha) {
    anotar(
      `${destino} se revisó con otro contenido`,
      'La aprobación es de una imagen concreta. Volver a aprobar la que hay ahora.',
    )
  }
}

for (const captura of manifiesto.capturas) {
  if (!publicadas.includes(captura.destino)) {
    anotar(`el manifiesto anota ${captura.destino}, que no existe`, 'Quitar la entrada o volver a capturar.')
  }
}

if (!argvTiene('--sin-historial')) revisarHistorial()

if (problemas.length) {
  console.error(`check-screenshots: ${problemas.length} problema(s)\n`)
  for (const problema of problemas) {
    console.error(`  · ${problema.que}`)
    console.error(`    ${problema.porque}`)
  }
  console.error('\n  El procedimiento completo está en tools/screenshots/README.md.')
  process.exit(1)
}

const revisadas = manifiesto.capturas.filter((captura) => captura.revision?.por).length
console.log(`check-screenshots: limpio · ${publicadas.length} captura(s) publicadas, ${revisadas} revisadas`)

// --- el historial ----------------------------------------------------------

/**
 * Toda imagen que haya existido en cualquier commit de cualquier rama. Se compara el
 * camino, no el contenido: lo que se quiere impedir es que un original acabe en un sitio
 * donde nadie lo revisa (o donde el nombre delata que es material de trabajo).
 */
function revisarHistorial() {
  let objetos
  try {
    objetos = execFileSync('git', ['rev-list', '--objects', '--all'], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })
      .toString()
      .split('\n')
  } catch (error) {
    anotar('no pude leer el historial de git', `El barrido necesita el repositorio completo (fetch-depth: 0). ${error.message.split('\n')[0]}`)
    return
  }

  const imagen = /\.(png|jpe?g|gif|webp|avif|bmp|tiff?)$/i
  const trabajo = /(^|[/_-])(raw|original|originales|wip|tmp|temp|borrador)([/_.-]|$)/i
  const vistos = new Set()

  for (const linea of objetos) {
    const camino = linea.slice(41).trim()
    if (!camino || !imagen.test(camino) || vistos.has(camino)) continue
    vistos.add(camino)

    if (!camino.startsWith(`${CAPTURAS}/`)) {
      anotar(
        `el historial tiene una imagen fuera de ${CAPTURAS}/: ${camino}`,
        'Las capturas van todas al mismo sitio para poder revisarlas todas. Si es un original, el historial ya no se puede limpiar con un commit: hay que reescribirlo.',
      )
    }
    if (trabajo.test(camino)) {
      anotar(`el historial tiene ${camino}`, 'Un nombre de trabajo (raw/original/wip) delata material sin sanear.')
    }
  }
}

// --- utilidades ------------------------------------------------------------

function listarPng(carpeta, prefijo = '') {
  if (!existsSync(carpeta)) return []
  const encontrados = []
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const relativo = prefijo ? `${prefijo}/${entrada.name}` : entrada.name
    const absoluto = path.join(carpeta, entrada.name)
    if (entrada.isDirectory()) encontrados.push(...listarPng(absoluto, relativo))
    else if (statSync(absoluto).isFile() && /\.png$/i.test(entrada.name)) encontrados.push(relativo)
  }
  return encontrados.sort()
}

function argvTiene(bandera) {
  return process.argv.slice(2).includes(bandera)
}
