#!/usr/bin/env node
/**
 * Toma las capturas de la wiki.
 *
 *   node tools/screenshots/capture.mjs                    # todos los objetivos
 *   node tools/screenshots/capture.mjs --solo comprar     # los que coincidan
 *   node tools/screenshots/capture.mjs --sin-escribir     # audita y no escribe nada
 *   node tools/screenshots/capture.mjs --con-original     # guarda además el original, fuera del repositorio
 *
 * El orden de la corrida es el que importa, y es este:
 *
 *   1. Navegar y **esperar el dato**. El selector `espera` de cada objetivo solo existe
 *      cuando la pantalla terminó de cargar; si no aparece, no hay captura.
 *   2. **Cortar la red.** A partir de aquí la página no puede recibir datos nuevos, así
 *      que lo que se sanee se queda saneado. Sin esto, una respuesta que llega tarde
 *      repinta la tabla con los valores reales justo antes del disparo.
 *   3. Sanear (`dom.mjs`) y dejar un observador que reaplique lo que la aplicación
 *      repinte por su cuenta.
 *   4. **Auditar.** Si la guarda encuentra algo con forma de dato de cliente, esta
 *      pantalla no produce PNG. El resto de la corrida sigue: se informa al final.
 *   5. Recortar, recomprimir y escribir. La entrada del manifiesto queda **sin revisar**:
 *      publicarla exige el paso humano (`approve.mjs`).
 *
 * Requisitos: un Chromium de depuración con la sesión puesta
 * (`~/support/diag-harness/chrome-debug.sh start` + `auto-login.mjs <tenant> prd`) y el
 * Playwright de ese mismo harness. Ver README.md de esta carpeta.
 */

import { createHash, randomBytes } from 'node:crypto'
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buscarNombres, redact } from '../lib/nombres.mjs'
import { optimizar } from './png.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(AQUI, '../..')
const argv = process.argv.slice(2)
const opcion = (nombre) => argv.includes(nombre)
const valor = (nombre, porDefecto) => (argv.includes(nombre) ? argv[argv.indexOf(nombre) + 1] : porDefecto)

const PROPOSITO_MANIFIESTO = [
  'Una entrada por captura publicada. Lo escribe capture.mjs y lo comprueba',
  'check-screenshots.mjs, que falla si un PNG de docs/assets/screenshots/ no está aquí o',
  'si cambió después de capturarse. `revision` es opcional desde #2816: si está, tiene',
  'que ser la firma de la imagen que se publica hoy.',
  '`salt_id` identifica el salt con el que se saneó sin revelarlo: dos capturas con el',
  'mismo salt_id usan los mismos nombres ficticios y son comparables entre sí.',
  '`reglas` y `catalogo` son el número de versión de esos dos archivos, y ese número no',
  'se sube en cada edición: para saber con qué reglas exactas salió una captura, el',
  'historial de git de reglas.json en la fecha de `tomada_en`.',
]

const AMBIENTES = {
  prd: 'https://app.celes.ai',
  qas: 'https://qas.app.celes.ai',
  dev: 'https://dev.app.celes.ai',
}

const ambiente = valor('--ambiente', 'prd')
const base = AMBIENTES[ambiente]
if (!base) fallar(`ambiente inválido: ${ambiente} (prd | qas | dev)`)

const leerJson = (relativo) => JSON.parse(readFileSync(path.join(ROOT, relativo), 'utf8'))
const inventario = leerJson('tools/inventory.json')
const objetivos = leerJson('tools/screenshots/objetivos.json')
const reglas = leerJson('tools/screenshots/reglas.json')
const catalogo = leerJson('tools/screenshots/catalogo.json')

const salt = resolverSalt()
const filtro = valor('--solo', null)
const seleccion = objetivos.objetivos.filter((objetivo) => !filtro || objetivo.page.includes(filtro))
if (!seleccion.length) fallar(`ningún objetivo coincide con «${filtro}»`)

const { chromium } = await cargarPlaywright()
const navegador = await chromium.connectOverCDP(process.env.DIAG_CHROME_CDP || 'http://127.0.0.1:9222')
const contexto = navegador.contexts()[0]
if (!contexto) fallar('el Chromium de depuración no tiene contexto; ¿corriste chrome-debug.sh start?')

const fuenteInyectable = [
  paraElNavegador(readFileSync(path.join(AQUI, 'scrub.mjs'), 'utf8')),
  paraElNavegador(readFileSync(path.join(AQUI, 'dom.mjs'), 'utf8')),
  'globalThis.__wiki = { crearSaneador, aplicar, observar, auditar, congelar };',
].join('\n')

const resultados = []
const identidad = await leerIdentidad()

for (const objetivo of seleccion) {
  resultados.push(await capturar(objetivo))
}

await navegador.close()
informar()

// --- la captura de una pantalla -------------------------------------------

async function capturar(objetivo) {
  const pagina = inventario.pages.find((entrada) => entrada.page === objetivo.page)
  if (!pagina) return { objetivo, estado: 'error', motivo: `«${objetivo.page}» no está en el inventario` }
  if (!pagina.route) return { objetivo, estado: 'error', motivo: `«${objetivo.page}» no es una pantalla: no tiene ruta` }

  const destino = objetivo.page.replace(/\.md$/u, '.png')
  const page = await contexto.newPage()
  try {
    await page.setViewportSize({ width: objetivos.viewport.ancho, height: objetivos.viewport.alto })
    // `busqueda` ajusta el estado que la pantalla lee de la URL —un rango de fechas, un
    // agrupador—. La ruta la sigue mandando el inventario: esto no puede llevar a otra
    // pantalla, solo pedirle a la misma que muestre algo.
    await page.goto(base + pagina.route + (objetivo.busqueda ?? ''), {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    })
    if (/\/login|\/signin/u.test(page.url())) {
      return { objetivo, estado: 'error', motivo: 'la sesión del navegador expiró: volver a correr auto-login.mjs' }
    }
    await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {})
    await page.waitForSelector(objetivo.espera, { state: 'visible', timeout: 45_000 })
    await page.waitForTimeout(objetivos.reposo_ms)

    const original = opcion('--con-original') ? await guardarOriginal(page, destino) : null

    // El corte de red va **antes** del saneamiento: ver el paso 2 del encabezado.
    await page.route('**/*', (ruta) => ruta.abort())

    await page.addScriptTag({ content: fuenteInyectable })
    const cuenta = await page.evaluate(
      ({ catalogo, reglas, salt, pares }) => {
        const saneador = globalThis.__wiki.crearSaneador({ catalogo, reglas, salt })
        globalThis.__wiki.congelar()
        const resultado = globalThis.__wiki.aplicar(saneador, reglas, { pares })
        globalThis.__wiki.observar(saneador, reglas, { pares })
        globalThis.__wikiSaneador = saneador
        return resultado
      },
      { catalogo, reglas, salt, pares: identidad.pares },
    )

    await page.waitForTimeout(700)
    const auditoria = await page.evaluate(
      ({ reglas, valores }) => globalThis.__wiki.auditar(globalThis.__wikiSaneador, reglas, { identidad: valores }),
      { reglas, valores: identidad.valores },
    )
    const hallazgos = [...auditoria.hallazgos, ...nombresDeCliente(auditoria.texto)]
    if (hallazgos.length) return { objetivo, destino, estado: 'sucia', hallazgos, cuenta, original }

    const recorte = await calcularRecorte(page, objetivo.recorte ?? objetivos.recorte_por_defecto)
    const crudo = await page.screenshot({ clip: recorte, animations: 'disabled', caret: 'hide' })
    const { png, ancho, alto } = optimizar(crudo)

    if (opcion('--sin-escribir')) return { objetivo, destino, estado: 'limpia-sin-escribir', cuenta, bytes: png.length }

    const absoluto = path.join(ROOT, 'docs/assets/screenshots', destino)
    mkdirSync(path.dirname(absoluto), { recursive: true })
    writeFileSync(absoluto, png)
    anotarEnManifiesto({ destino, page: objetivo.page, ruta: pagina.route, png, ancho, alto })

    return { objetivo, destino, estado: 'escrita', cuenta, bytes: png.length, ancho, alto, original }
  } catch (error) {
    return { objetivo, destino, estado: 'error', motivo: error.message.split('\n')[0] }
  } finally {
    await page.close().catch(() => {})
  }
}

/** El recorte a la región útil, sin salirse de la ventana. */
async function calcularRecorte(page, selector) {
  const caja = await page.locator(selector).first().boundingBox().catch(() => null)
  if (!caja) return undefined
  const { ancho, alto } = objetivos.viewport
  const x = Math.max(0, Math.round(caja.x))
  const y = Math.max(0, Math.round(caja.y))
  return { x, y, width: Math.min(Math.round(caja.width), ancho - x), height: Math.min(Math.round(caja.height), alto - y) }
}

/**
 * El original, si alguien lo pide para comparar. Va **fuera del árbol de trabajo**: en el
 * repositorio no puede existir un PNG sin sanear ni un instante, porque el historial de
 * git no se borra. Por lo mismo el valor por defecto es no tomarlo.
 */
async function guardarOriginal(page, destino) {
  const cache = process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache')
  const carpeta = path.join(cache, 'celes-wiki', 'originales')
  if (carpeta.startsWith(ROOT)) fallar('la carpeta de originales no puede estar dentro del repositorio')
  mkdirSync(carpeta, { recursive: true })
  const archivo = path.join(carpeta, `${destino.replace(/\//gu, '-')}`)
  writeFileSync(archivo, await page.screenshot())
  return archivo
}

/**
 * La última pregunta de la guarda: ¿quedó a la vista el nombre de algún cliente conocido, o
 * el identificador de una instancia?
 *
 * Se hace aquí y no en la página porque la lista vive como hashes en `tools/denylist.json`
 * —el repositorio es público— y comparte implementación con `check-denylist.mjs`
 * (`tools/lib/nombres.mjs`): una comprobación de fuga duplicada es una que se queda vieja.
 *
 * Es la red que atrapa lo que las reglas de región no saben nombrar: una celda que creímos
 * vocabulario, un texto libre, un nombre de regla que el cliente escribió con su marca.
 */
function nombresDeCliente(texto) {
  const denylist = leerJson('tools/denylist.json')
  const hallazgos = []

  const hashes = new Map(denylist.nombres.hashes.map((entrada) => [entrada.h, entrada.pista]))
  for (const { gram, pista } of buscarNombres(texto, hashes)) {
    hallazgos.push({ regla: 'nombre-de-cliente', muestra: redact(gram), donde: pista })
  }

  const tenant = denylist.reglas.find((regla) => regla.id === 'tenant-slug')
  for (const coincidencia of texto.match(new RegExp(tenant.regex, 'g')) ?? []) {
    hallazgos.push({ regla: 'tenant-slug', muestra: redact(coincidencia), donde: 'texto visible' })
  }
  return hallazgos
}

// --- manifiesto ------------------------------------------------------------

/**
 * El manifiesto es de dónde salió cada PNG: con qué reglas, con qué salt y en qué fecha.
 * `revision: null` significa «esta captura todavía no la miró nadie», que desde #2816 se
 * puede publicar. Volver a capturar borra la revisión anterior a propósito — la
 * aprobación es de un PNG concreto, no del nombre del archivo.
 */
function anotarEnManifiesto({ destino, page, ruta, png, ancho, alto }) {
  const archivo = path.join(ROOT, 'tools/screenshots/manifest.json')
  const manifiesto = existsSync(archivo)
    ? JSON.parse(readFileSync(archivo, 'utf8'))
    : { version: 1, _: PROPOSITO_MANIFIESTO, capturas: [] }

  const entrada = {
    destino,
    page,
    ruta,
    ambiente,
    sha256: createHash('sha256').update(png).digest('hex'),
    bytes: png.length,
    ancho,
    alto,
    tomada_en: new Date().toISOString().slice(0, 10),
    salt_id: idDelSalt(),
    reglas: reglas.version,
    catalogo: catalogo.version,
    revision: null,
  }

  manifiesto._ = PROPOSITO_MANIFIESTO
  manifiesto.capturas = [...manifiesto.capturas.filter((c) => c.destino !== destino), entrada].sort((a, b) =>
    a.destino.localeCompare(b.destino),
  )
  writeFileSync(archivo, `${JSON.stringify(manifiesto, null, 2)}\n`)
}

// --- entorno ---------------------------------------------------------------

/**
 * El salt del saneamiento. Vive fuera del repositorio: con él las capturas se pueden
 * repetir tal cual, y sin él nadie puede comprobar si un nombre concreto estaba en la
 * pantalla (ver el encabezado de scrub.mjs). Perderlo no es grave — las próximas capturas
 * usan otros nombres ficticios.
 */
function resolverSalt() {
  if (process.env.WIKI_SCRUB_SALT) return process.env.WIKI_SCRUB_SALT
  const archivo = path.join(os.homedir(), '.config/celes/.wiki-scrub-salt')
  if (existsSync(archivo)) return readFileSync(archivo, 'utf8').trim()
  mkdirSync(path.dirname(archivo), { recursive: true })
  const nuevo = randomBytes(24).toString('hex')
  writeFileSync(archivo, `${nuevo}\n`, { mode: 0o600 })
  chmodSync(archivo, 0o600)
  console.log(`· salt nuevo en ${archivo} (guardarlo: es lo que hace repetibles las capturas)`)
  return nuevo
}

/** Identifica el salt sin revelarlo, para poder anotarlo en el manifiesto. */
function idDelSalt() {
  return createHash('sha256').update(salt).digest('hex').slice(0, 8)
}

/**
 * De quién es la sesión del navegador, para poder borrarla de la pantalla y comprobar que
 * no quedó. Sale del registro que `auto-login.mjs` escribe en IndexedDB, así que no hay
 * que pasar el nombre a mano ni acertar con el tenant.
 */
async function leerIdentidad() {
  const page = await contexto.newPage()
  try {
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    const registro = await page.evaluate(
      () =>
        new Promise((resolver) => {
          const peticion = indexedDB.open('firebaseLocalStorageDb')
          peticion.onerror = () => resolver(null)
          peticion.onsuccess = () => {
            const db = peticion.result
            if (!db.objectStoreNames.contains('firebaseLocalStorage')) return resolver(null)
            const todo = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').getAll()
            todo.onerror = () => resolver(null)
            todo.onsuccess = () => {
              const valor = todo.result?.[0]?.value
              resolver(valor ? { nombre: valor.displayName, correo: valor.email, tenant: valor.tenantId } : null)
            }
          }
        }),
    )
    if (!registro) {
      console.log('· aviso: no pude leer la identidad de la sesión; la guarda solo comprobará el resto de las reglas')
      return { pares: [], valores: [] }
    }

    const ejemplo = catalogo.usuario
    const pares = [
      [registro.nombre, ejemplo.nombre],
      [registro.correo, ejemplo.correo],
      [registro.tenant, 'instancia-de-ejemplo'],
    ].filter(([real]) => real)

    // Además de los literales completos, la guarda mira los pedazos: un apellido suelto en
    // otra parte de la pantalla no lo arregla el reemplazo, pero sí tiene que abortar.
    const pedazos = [
      ...(registro.nombre?.split(/\s+/u) ?? []),
      registro.correo?.split('@')[0],
      registro.tenant?.split('-')[0],
    ].filter((pedazo) => pedazo && pedazo.length >= 4)

    return { pares, valores: [...pares.map(([real]) => real), ...pedazos] }
  } finally {
    await page.close().catch(() => {})
  }
}

/**
 * `scrub.mjs` y `dom.mjs` se inyectan en la página como un script clásico, que no admite
 * `import`/`export`. Se quitan: al concatenarlos quedan en el mismo ámbito y las llamadas
 * entre ellos siguen resolviendo. Lo que se gana es poder probar los dos archivos con
 * `node` (scrub.test.mjs) en vez de tener el saneamiento escrito dentro de un `evaluate`.
 */
function paraElNavegador(fuente) {
  return fuente.replace(/^\s*import[^\n]*\n/gmu, '').replace(/^export /gmu, '')
}

async function cargarPlaywright() {
  const candidatos = [
    process.env.WIKI_PLAYWRIGHT,
    path.join(os.homedir(), 'support/diag-harness/node_modules/playwright/index.mjs'),
    'playwright',
  ].filter(Boolean)
  for (const candidato of candidatos) {
    try {
      return await import(candidato)
    } catch {
      /* siguiente */
    }
  }
  fallar(
    'no encuentro Playwright. Este es el único paso de la wiki que no es Node puro: usa el\n' +
      '  del navegador de diagnóstico (~/support/diag-harness). Apuntarlo con WIKI_PLAYWRIGHT=<ruta a index.mjs>.',
  )
}

// --- salida ----------------------------------------------------------------

function informar() {
  const etiqueta = { escrita: '✓', 'limpia-sin-escribir': '·', sucia: '✗', error: '!' }
  console.log('')
  for (const resultado of resultados) {
    const nombre = resultado.destino ?? resultado.objetivo.page
    if (resultado.estado === 'escrita') {
      console.log(
        `${etiqueta.escrita} ${nombre} — ${resultado.ancho}×${resultado.alto}, ${Math.round(resultado.bytes / 1024)} KB · ` +
          `saneado: ${resultado.cuenta.texto} textos, ${resultado.cuenta.numero} números, ${resultado.cuenta.identidad} de identidad`,
      )
    } else if (resultado.estado === 'limpia-sin-escribir') {
      console.log(`${etiqueta['limpia-sin-escribir']} ${nombre} — limpia (no se escribió: --sin-escribir)`)
    } else if (resultado.estado === 'sucia') {
      console.log(`${etiqueta.sucia} ${nombre} — la guarda encontró ${resultado.hallazgos.length} cosa(s) sin sanear:`)
      for (const grupo of agrupar(resultado.hallazgos)) {
        console.log(`    ${grupo.regla} (${grupo.n}): ${grupo.muestras.join(', ')}`)
        console.log(`      p. ej. en ${grupo.donde}`)
      }
    } else {
      console.log(`${etiqueta.error} ${nombre} — ${resultado.motivo}`)
    }
    if (resultado.original) console.log(`    original sin sanear (fuera del repositorio): ${resultado.original}`)
  }

  const sucias = resultados.filter((r) => r.estado === 'sucia').length
  const errores = resultados.filter((r) => r.estado === 'error').length
  const escritas = resultados.filter((r) => r.estado === 'escrita').length
  console.log('')
  if (escritas) {
    console.log(
      `${escritas} captura(s) escritas y **sin revisar**. Mirarlas una por una y registrar el visto bueno:\n` +
        '  node tools/screenshots/approve.mjs --todas --por "Tu nombre"',
    )
  }
  if (sucias) {
    console.log(
      `${sucias} pantalla(s) no produjeron PNG. Eso es la guarda haciendo su trabajo: hay que\n` +
        '  declarar la región que falta en tools/screenshots/reglas.json y volver a correr.',
    )
  }
  process.exit(sucias || errores ? 1 : 0)
}

function agrupar(hallazgos) {
  const porRegla = new Map()
  for (const hallazgo of hallazgos) {
    const grupo = porRegla.get(hallazgo.regla) ?? { regla: hallazgo.regla, n: 0, muestras: [], donde: hallazgo.donde }
    grupo.n += 1
    if (grupo.muestras.length < 5) grupo.muestras.push(`«${hallazgo.muestra}»`)
    porRegla.set(hallazgo.regla, grupo)
  }
  return [...porRegla.values()]
}

function fallar(mensaje) {
  console.error(`capture: ${mensaje}`)
  process.exit(2)
}
