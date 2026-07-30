/**
 * El saneamiento y la guarda, dentro de la página.
 *
 * Este archivo corre en el navegador, sobre la pantalla ya cargada y **antes** de la
 * captura (D6 de la épica: se sanea el DOM, no se difumina el PNG después). Se divide en
 * tres pasos, y el tercero es el que importa:
 *
 *   1. `aplicar`       — quita lo que no debe salir, borra la identidad de la cuenta y
 *                        pasa cada nodo de texto por `scrub.mjs`; el elemento que lo
 *                        contiene queda marcado con `data-wiki-saneado`.
 *   2. `observar`      — deja el paso 1 armado para lo que la aplicación repinte después.
 *   3. `auditar`       — recorre lo que quedó **visible** y devuelve todo lo que parece
 *                        un dato sin sanear. Si devuelve algo, `capture.mjs` no escribe
 *                        ningún PNG.
 *
 * El paso 3 existe porque el 1 no se puede verificar a sí mismo: sanea las regiones que
 * alguien declaró en `reglas.json`, y la aplicación cambia. La guarda no pregunta «¿hice
 * lo que dije?» sino «¿queda algo con forma de dato de cliente?», que es la pregunta que
 * de verdad protege al repositorio.
 *
 * Sin imports a propósito: se inyecta como script clásico en la página, junto a scrub.mjs.
 */

const IGNORAR_TAG = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE', 'HEAD'])
const MARCA = 'data-wiki-saneado'

/** Quita del documento lo que `reglas.quitar` declara. */
export function quitar(reglas) {
  const quitados = []
  for (const regla of reglas.quitar) {
    const encontrados = [...document.querySelectorAll(regla.sel)]
    for (const elemento of encontrados) elemento.remove()
    if (encontrados.length) quitados.push({ sel: regla.sel, n: encontrados.length })
  }
  return quitados
}

/**
 * Congela lo que se mueve. Una gráfica a medio animar o un `skeleton` parpadeando hacen
 * que dos corridas de la misma pantalla den PNG distintos, y la repetibilidad es parte
 * del cierre de este pipeline.
 */
export function congelar() {
  const estilo = document.createElement('style')
  estilo.id = 'wiki-congelar'
  estilo.textContent = `*, *::before, *::after {
    animation-delay: -1s !important;
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }`
  document.head.append(estilo)
}

/**
 * El saneamiento completo de un árbol: quitar, identidad, texto. Es idempotente —se puede
 * volver a llamar sobre la misma pantalla— y es lo que reaplica el observador.
 *
 * @param {Array<[string, string]>} pares identidad real → identidad de ejemplo
 */
export function aplicar(saneador, reglas, { pares = [] } = {}, raiz = document.body) {
  const quitados = quitar(reglas)
  const identidad = reemplazarIdentidad(pares, raiz)
  const { escalados, incoherentes } = escalarEjes(saneador, reglas)
  // Se acumulan para que `auditar` los reporte: así el único camino por el que se aborta una
  // captura sigue siendo la guarda, y no hay una segunda salida que mantener.
  for (const eje of incoherentes) ejesIncoherentes.set(`${eje.donde}|${eje.porque}`, eje)
  const cuenta = sanear(saneador, reglas, raiz)
  return { ...cuenta, identidad, ejes: escalados, ejesIncoherentes: ejesIncoherentes.size, quitados }
}

/** Los ejes que no se pudieron escalar sin que la gráfica mintiera. Ver `escalarEjes`. */
const ejesIncoherentes = new Map()

/**
 * Los ejes numéricos, con un factor por eje.
 *
 * Va antes del recorrido general porque el eje hay que verlo entero: tick por tick cada
 * etiqueta saldría con un número independiente y el eje dejaría de ser creciente. Ver
 * `ejes` en reglas.json.
 */
export function escalarEjes(saneador, reglas) {
  if (!reglas.ejes) return { escalados: 0, incoherentes: [] }
  let escalados = 0
  const incoherentes = []
  for (const eje of document.querySelectorAll(reglas.ejes.sel)) {
    const etiquetas = [...eje.querySelectorAll(reglas.ejes.ticks)]
    const nodos = etiquetas.map((etiqueta) => [...nodosDeTexto(etiqueta)]).flat()
    if (nodos.length < 2) continue

    const decision = saneador.escalarEje(nodos.map((nodo) => nodo.nodeValue))
    if (!decision) continue // no es un eje numérico: que lo sanee el pase normal

    // Un eje que salió desordenado o con etiquetas repetidas no se puede arreglar aquí, y
    // dejarlo con sus valores reales sería publicar las magnitudes. Se anota y la corrida se
    // cae: es la única salida que no publica nada malo.
    if (decision.accion === 'incoherente') {
      incoherentes.push({ porque: decision.porque, donde: ruta(eje) })
      continue
    }

    if (decision.accion === 'intacto') {
      // Protegerlo, no solo no escalarlo: si el pase normal lo alcanza, rehace cada etiqueta
      // por su cuenta y el eje de accuracy sale «0%, 22%, 914%».
      for (const nodo of nodos) {
        recordar(nodo)
        marcar(nodo.parentElement, `eje-${decision.porque}`)
      }
      continue
    }

    nodos.forEach((nodo, indice) => {
      if (decision.ticks[indice] === nodo.nodeValue) return
      nodo.nodeValue = decision.ticks[indice]
      recordar(nodo)
      marcar(nodo.parentElement, 'eje')
    })
    escalados += 1
  }
  return { escalados, incoherentes }
}

/**
 * La identidad de la cuenta que captura, cambiada por la de ejemplo.
 *
 * No basta con quitar el avatar: el saludo del inicio trae el nombre completo y no está
 * en ninguna región de datos. Se reemplaza el literal, y lo que se escape lo caza la
 * guarda.
 */
export function reemplazarIdentidad(pares, raiz = document.body) {
  if (!pares.length) return 0
  let cambios = 0
  for (const nodo of nodosDeTexto(raiz)) {
    let texto = nodo.nodeValue
    for (const [real, ejemplo] of pares) {
      if (real && texto.toLowerCase().includes(real.toLowerCase())) {
        texto = texto.replace(new RegExp(escapar(real), 'giu'), ejemplo)
      }
    }
    if (texto !== nodo.nodeValue) {
      nodo.nodeValue = texto
      recordar(nodo)
      marcar(nodo.parentElement, 'identidad')
      cambios += 1
    }
  }
  return cambios
}

/** Sanea todo el árbol y marca lo que toca. Es idempotente: se puede volver a llamar. */
export function sanear(saneador, reglas, raiz = document.body) {
  const cuenta = { numero: 0, texto: 0, fecha: 0 }
  for (const nodo of nodosDeTexto(raiz)) {
    const elemento = nodo.parentElement
    if (!elemento) continue
    if (esNuestro(nodo)) continue

    const region = regionDe(elemento, reglas)
    const resultado = saneador.sanear(nodo.nodeValue, {
      enRegion: Boolean(region),
      especie: region ? especieDeRegion(region, saneador, reglas) : undefined,
      pista: pistaDe(elemento, region),
    })
    if (!resultado) continue

    if (resultado.texto !== nodo.nodeValue) nodo.nodeValue = resultado.texto
    recordar(nodo)
    marcar(elemento, resultado.tipo)
    cuenta[resultado.tipo === 'numero' || resultado.tipo === 'numero-embebido' ? 'numero' : resultado.tipo === 'fecha' ? 'fecha' : 'texto'] += 1
  }
  return cuenta
}

/**
 * Vuelve a sanear lo que la aplicación reescriba.
 *
 * Hace falta: React vuelve a pintar cuando llega una respuesta o cuando el ratón entra a
 * una celda, y en ese repintado el valor real vuelve al DOM. Sin el observador, entre el
 * saneamiento y el disparo de la cámara hay una ventana en la que la pantalla se
 * des-sanea sola.
 */
export function observar(saneador, reglas, opciones = {}) {
  const observador = new MutationObserver((cambios) => {
    for (const cambio of cambios) {
      const raiz = cambio.type === 'characterData' ? cambio.target.parentElement : cambio.target
      if (raiz && raiz.nodeType === Node.ELEMENT_NODE) aplicar(saneador, reglas, opciones, raiz)
    }
  })
  observador.observe(document.body, { subtree: true, childList: true, characterData: true })
  globalThis.__wikiObservador = observador
  return true
}

/**
 * Qué quedó con forma de dato de cliente. Solo mira lo **visible**: lo que no se pinta
 * no sale en el PNG, y ampliar la guarda a lo invisible la vuelve imposible de pasar (el
 * identificador de la instancia vive en atributos que no se pueden borrar sin romper la
 * aplicación).
 *
 * @param {string[]} identidad valores reales de la cuenta que captura, para comprobar que
 *   ninguno quedó a la vista
 */
export function auditar(saneador, reglas, { identidad = [] } = {}) {
  // Marcas que dicen «esta celda se miró y se decidió dejarla como está». Eximen de exigir
  // reemplazo, no del resto de la guarda: un dato de cliente escondido en una columna que
  // creímos vocabulario sigue teniendo que caer por número o por mayúsculas.
  const SIN_REEMPLAZO = new Set(['fecha', 'vocabulario', 'razon-coherente'])
  const hallazgos = []
  const reporte = (regla, muestra, donde) => hallazgos.push({ regla, muestra: recortar(muestra), donde })
  const config = reglas.guarda
  const siglas = new Set(config.mayusculas.siglas_permitidas)
  // Vale solo dentro de una celda marcada `vocabulario`: ver `guarda` en reglas.json.
  const vocabulario = new Set(config.mayusculas.vocabulario_permitido ?? [])
  const reMayusculas = new RegExp(`\\b[A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ0-9.&'’-]{${config.mayusculas.largo_minimo - 1},}\\b`, 'gu')
  const visibles = []

  for (const nodo of nodosDeTexto(document.body)) {
    const elemento = nodo.parentElement
    if (!elemento || !esVisible(elemento)) continue
    const texto = nodo.nodeValue
    if (!texto.trim()) continue
    visibles.push(texto)

    const marcas = (elemento.getAttribute(MARCA) ?? '').split(' ').filter(Boolean)
    const reemplazado = marcas.some((marca) => !SIN_REEMPLAZO.has(marca) && !marca.startsWith('eje-'))
    // Un eje intocable (porcentaje, fechas) y una razón que tiene que seguir cuadrando con
    // las cifras de al lado se miraron y se decidieron: sus números se quedan a propósito.
    // Las palabras, en cambio, se siguen mirando.
    const ejeDecidido = marcas.some((marca) => marca.startsWith('eje-') || marca === 'razon-coherente')
    const region = regionDe(elemento, reglas)

    if (region && !marcas.length && /[\p{L}\p{N}]/u.test(texto)) {
      reporte('region-sin-sanear', texto, ruta(elemento))
    }
    if (!reemplazado && !ejeDecidido && saneador.tieneNumeroDeDatos(texto)) {
      reporte('numero-sin-sanear', texto, ruta(elemento))
    }
    if (!reemplazado) {
      const esVocabulario = marcas.includes('vocabulario')
      for (const palabra of texto.match(reMayusculas) ?? []) {
        if (siglas.has(palabra.replace(/[.']/gu, ''))) continue
        if (esVocabulario && vocabulario.has(palabra)) continue
        if (/^\d+$/u.test(palabra)) continue
        reporte('mayusculas', palabra, ruta(elemento))
      }
    }
  }

  // Un eje que no se pudo escalar sin que la gráfica mintiera. No es una fuga —sus números
  // ya no son los del cliente— pero sí una captura que documenta algo que no existe, y eso
  // tampoco se publica.
  // Va sin `reporte` a propósito: la muestra es un motivo nuestro y no un dato del cliente,
  // así que se imprime entera y no tapada.
  for (const eje of ejesIncoherentes.values()) {
    hallazgos.push({ regla: 'eje-incoherente', muestra: eje.porque, donde: eje.donde })
  }

  const aLaVista = visibles.join(' ').toLowerCase()
  for (const valor of identidad) {
    if (valor && valor.length >= 4 && aLaVista.includes(valor.toLowerCase())) {
      reporte('identidad', valor, 'texto visible')
    }
  }

  const permitidos = config.imagenes.origenes_permitidos
  for (const imagen of document.querySelectorAll('img, [style*="background-image"]')) {
    if (!esVisible(imagen)) continue
    const fuente = imagen.getAttribute('src') ?? imagen.getAttribute('style') ?? ''
    const url = fuente.match(/https?:\/\/([^/"')\s]+)/u)
    if (url && !permitidos.includes(url[1])) reporte('imagen-externa', url[1], ruta(imagen))
  }

  // El texto que quedó a la vista vuelve a Node: allí `capture.mjs` le pasa la lista de
  // nombres de cliente, que no puede vivir en el navegador (son hashes de un archivo del
  // repositorio y compararlos aquí obligaría a inyectarlos en la página).
  return { hallazgos, texto: visibles.join('\n') }
}

// --- utilidades ------------------------------------------------------------

function* nodosDeTexto(raiz) {
  if (raiz.nodeType === Node.TEXT_NODE) {
    yield raiz
    return
  }
  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode: (nodo) =>
      nodo.parentElement && !IGNORAR_TAG.has(nodo.parentElement.tagName)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  })
  let nodo
  while ((nodo = walker.nextNode())) yield nodo
}

function regionDe(elemento, reglas) {
  for (const region of reglas.regiones) {
    const dentro = elemento.closest(region.sel)
    if (!dentro) continue
    if (region.excepto && elemento.closest(region.excepto)) continue
    if (esInterfaz(elemento, dentro, reglas)) continue
    return dentro
  }
  return null
}

/**
 * Un control dentro de la región: el botón «Generar Orden» de la columna «Acciones» es
 * vocabulario de la aplicación, no un dato. Ver `interfaz` en reglas.json — la excepción
 * exige que el control esté *dentro* de la región y no sea la región misma.
 */
function esInterfaz(elemento, region, reglas) {
  if (!reglas.interfaz) return false
  const control = elemento.closest(reglas.interfaz.sel)
  return Boolean(control && control !== region && region.contains(control))
}

/**
 * De qué es la columna.
 *
 * Se usan las dos pistas, el `data-field` de la celda y el encabezado que ve el lector,
 * porque ninguna basta sola: en el reporte de desempeño la columna «Nombre del Proveedor»
 * tiene `data-field="category"` —el reporte se agrupa por proveedor y el campo se llama
 * como el agrupador—, así que con el `data-field` solo, un nombre de proveedor se
 * reemplazaría por una categoría.
 */
function especieDeRegion(region, saneador, reglas) {
  const campo = region.getAttribute?.('data-field') ?? ''
  const encabezado = encabezadoDe(region, campo)
  if (campo || encabezado) return saneador.especieDe(encabezado, campo)
  const etiqueta = etiquetaDe(region, reglas)
  if (etiqueta) return saneador.especieDe(etiqueta)
  return saneador.especieDe(region.getAttribute?.('class') ?? '')
}

/**
 * La etiqueta de una región que no es una celda de tabla.
 *
 * No toda pantalla presenta el dato en una tabla: el Calendario de OC pinta cada orden
 * como una tarjeta de pares etiqueta/valor —«Nombre de Proveedor» encima del nombre—, y
 * ahí la única pista de qué es el valor está en el nodo de al lado. La región lo declara
 * con `pista`, un selector que se busca **dentro del padre de la región**; sin él, esos
 * nombres de proveedor salían por la especie por defecto y la guarda abortaba la captura.
 */
function etiquetaDe(region, reglas) {
  for (const declaracion of reglas.regiones) {
    if (!declaracion.pista || !region.matches?.(declaracion.sel)) continue
    const etiqueta = region.parentElement?.querySelector(declaracion.pista)
    if (etiqueta && etiqueta !== region) return etiqueta.textContent.trim()
  }
  return ''
}

/**
 * De qué habla esta cifra, para decidir qué hacer con un porcentaje.
 *
 * Un `69,77%` no dice si es un MAPE —que no deriva de nada visible y se sanea— o un margen
 * bruto —que es la razón entre dos cifras que están ahí al lado y hay que dejar quieta—. La
 * pista es el encabezado si la cifra está en una tabla, y si no el texto de la tarjeta que la
 * contiene: en una tarjeta KPI el título y el valor son hermanos («MAPE» y «69,77%»), así que
 * subir hasta el bloque y leerlo entero basta y no hace falta declarar un selector por
 * pantalla.
 */
function pistaDe(elemento, region) {
  if (region) {
    const campo = region.getAttribute?.('data-field') ?? ''
    return `${encabezadoDe(region, campo)} ${campo}`.trim()
  }
  const tarjeta = elemento.closest('[class*="Card"], [class*="Paper"], [class*="Tile"]')
  return (tarjeta?.textContent ?? '').replace(/\s+/gu, ' ').trim().slice(0, 120)
}

/** El encabezado de la columna de una celda: por campo, y si no, por posición. */
function encabezadoDe(celda, campo) {
  const indice = celda.getAttribute?.('data-colindex')
  const cabecera =
    (campo && document.querySelector(`.MuiDataGrid-columnHeader[data-field="${CSS.escape(campo)}"]`)) ||
    (indice && document.querySelector(`.MuiDataGrid-columnHeader[data-colindex="${indice}"]`)) ||
    null
  return cabecera?.textContent ?? ''
}

/**
 * Qué valor puso aquí el saneamiento.
 *
 * Es lo que hace que volver a pasar sobre la misma pantalla no vuelva a revolver lo ya
 * saneado (`$ 1.234` → otro número → otro más), y a la vez que un valor **restaurado** por
 * la aplicación sí se vuelva a sanear: si el texto del nodo ya no es el que dejamos, es de
 * la aplicación otra vez. Mirar la marca del elemento no serviría — la marca sobrevive al
 * repintado y dejaría pasar el valor real.
 */
const nuestros = new WeakMap()
const recordar = (nodo) => nuestros.set(nodo, nodo.nodeValue)
const esNuestro = (nodo) => nuestros.get(nodo) === nodo.nodeValue

function escapar(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

function marcar(elemento, tipo) {
  if (!elemento) return
  const previas = new Set((elemento.getAttribute(MARCA) ?? '').split(' ').filter(Boolean))
  previas.add(tipo)
  elemento.setAttribute(MARCA, [...previas].join(' '))
}

function esVisible(elemento) {
  if (typeof elemento.checkVisibility === 'function') {
    return elemento.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })
  }
  return Boolean(elemento.getClientRects().length)
}

/** Dónde está, para poder ir a mirarlo sin volver a capturar. */
function ruta(elemento) {
  const partes = []
  for (let nodo = elemento; nodo && nodo !== document.body && partes.length < 4; nodo = nodo.parentElement) {
    const clase = (nodo.getAttribute?.('class') ?? '').split(/\s+/u).filter(Boolean).slice(0, 2).join('.')
    partes.unshift(`${nodo.tagName.toLowerCase()}${clase ? `.${clase}` : ''}`)
  }
  return partes.join('>')
}

/** Un hallazgo se imprime en la consola de quien captura: se recorta y se tapa. */
function recortar(texto) {
  const plano = texto.replace(/\s+/gu, ' ').trim()
  if (plano.length <= 4) return `${plano[0]}${'·'.repeat(Math.max(plano.length - 1, 0))}`
  return `${plano.slice(0, 2)}${'·'.repeat(Math.min(plano.length - 3, 12))}${plano.slice(-1)}`
}
