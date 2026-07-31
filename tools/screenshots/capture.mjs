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
 * Playwright de ese mismo harness. Las pantallas de detalle piden además el archivo local
 * de parámetros (`resolverParametros`). Ver README.md de esta carpeta.
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

/**
 * La API de cada ambiente. No se deduce de la dirección de la aplicación —fuera de prd ni
 * siquiera comparten dominio de primer nivel— y hace falta para preguntarle al servidor de
 * quién es la sesión que está capturando (`leerIdentidad`).
 */
const APIS = {
  prd: 'https://api.celes.ai',
  qas: 'https://qas.api.celes.app',
  dev: 'https://dev.api.celes.app',
}

/**
 * Las formas que puede declarar un parámetro de dirección (`resolverBusqueda`), para que un
 * valor mal copiado falle aquí —con el nombre del marcador— y no en una pantalla vacía.
 */
const FORMAS = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu,
  // Las llaves internas de producto y bodega son enteros de 64 bits con signo: el
  // signo importa y un valor copiado a medias sigue teniendo forma de número, así
  // que lo que se comprueba es el largo además del alfabeto.
  clave: /^-?\d{6,20}$/u,
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
const parametros = resolverParametros()
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
  const busqueda = resolverBusqueda(objetivo)
  if (busqueda.faltan.length) return { objetivo, destino, estado: 'sin-parametro', faltan: busqueda.faltan }

  // Una pantalla cuya ruta canónica redirige a una de sus sub-pantallas pierde por el
  // camino la cadena de consulta —el redirector rearma la suya—, así que a la ruta del
  // inventario no hay forma de llegarle con estado. `subruta` va derecho a la
  // sub-pantalla, y para que esto no se convierta en «visito la ruta que quiera»,
  // solo se admite una de las `sections` que el inventario ya le reconoce a la página.
  const ruta = objetivo.subruta ?? pagina.route
  if (objetivo.subruta && !(pagina.sections ?? []).some((seccion) => seccion.path === objetivo.subruta)) {
    return {
      objetivo,
      destino,
      estado: 'error',
      motivo: `«${objetivo.subruta}» no es una sección de «${objetivo.page}» en el inventario`,
    }
  }

  const page = await contexto.newPage()
  try {
    await page.setViewportSize({ width: objetivos.viewport.ancho, height: objetivos.viewport.alto })
    // `busqueda` ajusta el estado que la pantalla lee de la URL —un rango de fechas, un
    // agrupador, la campaña que se está mirando—. La ruta la sigue mandando el inventario:
    // esto no puede llevar a otra pantalla, solo pedirle a la misma que muestre algo.
    await page.goto(base + ruta + busqueda.texto, {
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
    anotarEnManifiesto({ destino, page: objetivo.page, ruta, png, ancho, alto })

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
 * Los parámetros de dirección que **no pueden viajar en el repositorio**, por lo mismo que
 * el salt: son identificadores de cliente. Viven en un JSON local de `marcador: valor`, y
 * `objetivos.json` solo escribe el marcador.
 *
 * Hace falta para las pantallas de detalle —una campaña, una promoción, un producto—, que
 * sin identificador en la dirección se pintan vacías. Capturarlas así no documenta el
 * producto, documenta una dirección incompleta.
 *
 * Perderlo **sí** importa, al revés que el salt: sin él esas pantallas no se pueden volver
 * a capturar. Por eso cada marcador se declara en `objetivos.json` con qué es, de dónde se
 * saca y qué forma tiene: quien tenga acceso a la aplicación puede reconstruirlo.
 */
function resolverParametros() {
  const archivo = process.env.WIKI_PARAMETROS || path.join(os.homedir(), '.config/celes/.wiki-parametros.json')
  if (!existsSync(archivo)) return { archivo, valores: {} }
  try {
    const valores = JSON.parse(readFileSync(archivo, 'utf8'))
    if (valores === null || typeof valores !== 'object' || Array.isArray(valores)) {
      fallar(`${archivo} tiene que ser un objeto JSON de «marcador»: «valor»`)
    }
    return { archivo, valores }
  } catch (error) {
    if (error instanceof SyntaxError) fallar(`${archivo} no es JSON válido: ${error.message}`)
    throw error
  }
}

/**
 * La cadena de consulta del objetivo, con sus marcadores `{{...}}` sustituidos.
 *
 * Un marcador tiene que estar declarado en `objetivos.json` —eso es cosa del repositorio, y
 * si falta es un error de programación: se aborta la corrida entera—. Que su **valor** falte
 * es cosa de la máquina que captura, y entonces solo cae esa pantalla: el resto de la
 * corrida sigue y se informa al final qué falta y dónde ponerlo.
 *
 * El valor se codifica antes de pegarlo: un marcador vale por un valor, no por un pedazo de
 * dirección.
 */
function resolverBusqueda(objetivo) {
  const declarados = objetivos.parametros ?? {}
  const faltan = []
  const texto = (objetivo.busqueda ?? '').replace(/\{\{([a-z0-9-]+)\}\}/gu, (_, nombre) => {
    const declarado = declarados[nombre]
    if (!declarado) fallar(`«${objetivo.page}» usa el marcador {{${nombre}}}, que no está declarado en objetivos.json`)
    const valor = valorDelParametro(nombre)
    if (!valor) {
      faltan.push({ nombre, ...declarado })
      return ''
    }
    const forma = FORMAS[declarado.forma]
    if (forma && !forma.test(valor)) {
      faltan.push({ nombre, ...declarado, motivo: `el valor que hay no tiene forma de ${declarado.forma}` })
      return ''
    }
    return encodeURIComponent(valor)
  })
  return { texto, faltan }
}

/** El valor de un marcador: primero el entorno, después el archivo local. Como el salt. */
function valorDelParametro(nombre) {
  const variable = `WIKI_PARAM_${nombre.toUpperCase().replace(/-/gu, '_')}`
  const candidatos = [process.env[variable], parametros.valores[nombre]]
  return candidatos.find((candidato) => typeof candidato === 'string' && candidato.trim())?.trim()
}

/**
 * De quién es la sesión del navegador, para poder borrarla de la pantalla y comprobar que
 * no quedó.
 *
 * Se preguntan **las tres fuentes**, porque ninguna basta sola y en 1a.8 eso se pagó: el
 * panel de inicio saluda con el nombre completo de la cuenta y salió publicado.
 *
 *   · El registro de sesión de IndexedDB —el que escribe `auto-login.mjs`— trae el correo
 *     y la instancia, pero su `displayName` es **nulo**: ese login no pasa por ninguna
 *     pantalla de proveedor y nadie llena ese campo.
 *   · `localStorage['user.displayName']` es de donde lo saca la propia aplicación cuando
 *     Firebase no lo trae (`syncUserDetails`): queda de un login interactivo anterior en
 *     este perfil, y es exactamente el nombre que se ve en el saludo.
 *   · `/configs/auth/me` es la fuente del servidor, la misma que usa la aplicación para el
 *     resto de la sesión, y la única que no depende de lo que haya quedado en el navegador.
 *
 * Y el registro no es `getAll()[0]`: esa posición la ocupa el centinela `__sak` de
 * Firebase, sin ningún dato. Leerlo daba un objeto verdadero con los tres campos vacíos,
 * así que no había reemplazo, la guarda se quedaba sin valores que buscar **y no se
 * imprimía ningún aviso**. Fallaba en silencio, que es lo peor que puede hacer un control.
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
              const sesion = todo.result?.find((fila) => String(fila?.fbase_key ?? '').startsWith('firebase:authUser:'))
              const valor = sesion?.value
              resolver({
                nombre: valor?.displayName || localStorage.getItem('user.displayName') || null,
                correo: valor?.email || localStorage.getItem('user.email') || null,
                tenant: valor?.tenantId || null,
                token: valor?.stsTokenManager?.accessToken || null,
              })
            }
          }
        }),
    )

    const delServidor = await nombreDelServidor(page, registro?.token)
    const nombres = [registro?.nombre, delServidor?.nombre].filter(Boolean)
    const correo = registro?.correo || delServidor?.correo || null

    if (!nombres.length && !correo) {
      // Sin identidad no hay ni reemplazo ni guarda que lo compruebe, y la pantalla de
      // inicio saluda por el nombre. Antes esto era un aviso; ahora para la corrida.
      fallar(
        'no pude leer la identidad de la sesión (ni IndexedDB, ni localStorage, ni /configs/auth/me).\n' +
          '  Sin ella el saludo del panel de inicio sale con el nombre real de la cuenta. Volver a loguear:\n' +
          '  node ~/support/diag-harness/auto-login.mjs <tenant> prd',
      )
    }

    const ejemplo = catalogo.usuario
    const pares = [
      ...nombres.map((nombre) => [nombre, ejemplo.nombre]),
      [correo, ejemplo.correo],
      [registro?.tenant, 'instancia-de-ejemplo'],
    ].filter(([real]) => real)

    // Además de los literales completos, la guarda mira los pedazos: un apellido suelto en
    // otra parte de la pantalla no lo arregla el reemplazo, pero sí tiene que abortar. El
    // local del correo se parte también por punto y guion bajo: `luis.ballestas` no aparece
    // nunca en una pantalla, pero «Ballestas» sí.
    const pedazos = [
      ...nombres.flatMap((nombre) => nombre.split(/\s+/u)),
      ...(correo?.split('@')[0].split(/[._-]/u) ?? []),
      registro?.tenant?.split('-')[0],
    ].filter((pedazo) => pedazo && pedazo.length >= 4)

    return { pares, valores: [...pares.map(([real]) => real), ...pedazos] }
  } finally {
    await page.close().catch(() => {})
  }
}

/**
 * El nombre que el servidor le da a la cuenta que captura. Es la fuente que no depende de
 * lo que haya quedado en este navegador, y la misma que consulta la aplicación.
 */
async function nombreDelServidor(page, token) {
  if (!token) return null
  const respuesta = await page
    .evaluate(
      async ({ jwt, api }) => {
        const r = await fetch(`${api}/configs/auth/me`, { headers: { Authorization: `Bearer ${jwt}` } })
        if (!r.ok) return null
        const j = await r.json()
        return { nombre: j?.data?.user?.name ?? null, correo: j?.data?.user?.email ?? null }
      },
      { jwt: token, api: APIS[ambiente] },
    )
    .catch(() => null)
  return respuesta
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
  const etiqueta = { escrita: '✓', 'limpia-sin-escribir': '·', sucia: '✗', 'sin-parametro': '?', error: '!' }
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
    } else if (resultado.estado === 'sin-parametro') {
      console.log(`${etiqueta['sin-parametro']} ${nombre} — falta el valor de ${resultado.faltan.length} parámetro(s) de dirección:`)
      for (const falta of resultado.faltan) {
        console.log(`    {{${falta.nombre}}} (${falta.forma})${falta.motivo ? ` — ${falta.motivo}` : ''}`)
        console.log(`      ${falta.que}`)
        console.log(`      de dónde sale: ${falta.como}`)
      }
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
  const sinParametro = resultados.filter((r) => r.estado === 'sin-parametro')
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
  if (sinParametro.length) {
    const nombres = [...new Set(sinParametro.flatMap((r) => r.faltan.map((f) => f.nombre)))]
    console.log(
      `${sinParametro.length} pantalla(s) no se capturaron por falta de un parámetro de dirección.\n` +
        '  Son identificadores de cliente: no pueden estar en el repositorio, así que se leen de\n' +
        `  ${parametros.archivo}, un JSON de «marcador»: «valor»:\n\n` +
        `    {\n${nombres.map((nombre) => `      "${nombre}": "..."`).join(',\n')}\n    }\n\n` +
        '  Qué es cada uno y de dónde sale está arriba, y declarado en `parametros` de\n' +
        '  tools/screenshots/objetivos.json. Para una corrida suelta vale también el entorno:\n' +
        `  ${nombres.map((nombre) => `WIKI_PARAM_${nombre.toUpperCase().replace(/-/gu, '_')}`).join(' ')}.\n` +
        '  Sin el valor no se captura: una pantalla de detalle sin identificador sale vacía, y\n' +
        '  eso no documenta el producto sino una dirección incompleta.',
    )
  }
  process.exit(sucias || errores || sinParametro.length ? 1 : 0)
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
