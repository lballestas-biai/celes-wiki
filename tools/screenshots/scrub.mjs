/**
 * El saneamiento, sin DOM: qué se hace con un valor.
 *
 * Es una **función pura y determinista**: el mismo valor real siempre produce el mismo
 * valor ficticio. Eso es lo que hace que las capturas se puedan volver a tomar y salgan
 * iguales, y que un mismo producto se llame igual en dos pantallas distintas.
 *
 * La irreversibilidad no la da el hash —es corto y una lista de candidatos se prueba
 * entera en un rato—: la da el **salt**, que no está en el repositorio. Con el salt se
 * puede reproducir la captura; sin él no se puede preguntarle al mapa si un nombre
 * concreto estaba en la pantalla. Por eso `capture.mjs` lo guarda fuera del árbol de
 * trabajo y por eso perderlo solo cuesta que las próximas capturas usen otros nombres.
 *
 * Aquí no se importa nada, a propósito: este archivo se inyecta tal cual en la página
 * que se va a capturar (ver `paraElNavegador` en capture.mjs).
 */

const MASCARA = (1n << 64n) - 1n
const FNV_BASE = 0xcbf29ce484222325n
const FNV_PRIMO = 0x100000001b3n

/**
 * FNV-1a de 64 bits con avalancha. No es criptografía; ver la nota del encabezado.
 *
 * El separador entre el salt y el texto va escrito como escape y no como el byte en crudo:
 * con el byte literal git considera **binario** este archivo y deja de mostrar su diff, y el
 * archivo central del pipeline es justo el que tiene que poder revisarse en un PR.
 */
export function hash64(texto, salt = '') {
  const bytes = new TextEncoder().encode(`${salt}\u0000${texto}`)
  let h = FNV_BASE
  for (const byte of bytes) h = ((h ^ BigInt(byte)) * FNV_PRIMO) & MASCARA
  return mezclar(h)
}

function mezclar(valor) {
  let h = valor & MASCARA
  h ^= h >> 33n
  h = (h * 0xff51afd7ed558ccdn) & MASCARA
  h ^= h >> 33n
  h = (h * 0xc4ceb9fe1a85ec53n) & MASCARA
  h ^= h >> 33n
  return h
}

/** Un flujo determinista de enteros a partir de un hash. */
function flujo(semilla) {
  let estado = semilla
  return () => {
    estado = mezclar(estado + 0x9e3779b97f4a7c15n)
    return Number(estado & 0xffffn)
  }
}

const MAYUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Lo que vale el sufijo de un número de la pantalla.
 *
 * Hace falta para poder comparar dos ticks del mismo eje: sin esto el `1300 k` de un eje
 * vale 1300 y el `3 M` de al lado vale 3, así que escalarlos por el mismo factor deja el
 * eje desordenado y la rejilla no reconoce que el paso es constante. Se ordena de más largo
 * a más corto porque `MM` empieza por `M`.
 */
const MAGNITUDES = [
  ['millones', 1e6],
  ['mil', 1e3],
  ['MM', 1e9],
  ['M', 1e6],
  ['k', 1e3],
  ['K', 1e3],
  // Con límite de palabra a la izquierda: el `M` de `MM` ya se resolvió arriba, pero el `k`
  // de `Unidades` no puede contar como mil. Se compilan una vez: esto corre por cada número
  // de la pantalla.
].map(([marca, unidad]) => ({ unidad, patron: new RegExp(`(^|[\\s\\u00a0])${marca}\\b`, 'u') }))

/** El multiplicador que declara un sufijo, y el sufijo desde donde empieza. `' k'` → 1000. */
function magnitudDe(sufijo) {
  for (const { unidad, patron } of MAGNITUDES) {
    const encontrado = patron.exec(sufijo)
    if (encontrado) return { unidad, marca: sufijo.slice(encontrado.index) }
  }
  return { unidad: 1, marca: '' }
}

/**
 * @param {{catalogo: object, reglas: object, salt: string}} opciones
 */
export function crearSaneador({ catalogo, reglas, salt }) {
  if (!salt) throw new Error('el saneamiento necesita un salt (ver capture.mjs)')

  const reNumero = new RegExp(reglas.numeros.patron, 'gu')
  const reNumeroEntero = new RegExp(reglas.numeros.completo, 'u')
  const reExige = new RegExp(reglas.numeros.exige, 'u')
  const reFecha = new RegExp(reglas.fechas.patron, 'iu')
  const reAnio = new RegExp(reglas.fechas.anios, 'u')
  const reNoEsFecha = new RegExp(reglas.fechas.nunca_en_mayusculas, 'u')
  const reMoneda = new RegExp(reglas.magnitudes.moneda, 'u')
  const rePorcentajePropio = new RegExp(reglas.magnitudes.porcentajes_propios, 'iu')
  const especies = reglas.especies.orden.map((entrada) => ({
    especie: entrada.especie,
    compilado: new RegExp(entrada.patron, 'iu'),
  }))

  /** vacio · fecha · numero · texto */
  function clasificar(texto) {
    const valor = texto.trim()
    if (!valor || !/[\p{L}\p{N}]/u.test(valor)) return 'vacio'
    // Ver `fechas.nunca_en_mayusculas` en reglas.json: el patrón acepta un mes suelto para
    // los ejes agregados por mes, y eso dejaba pasar un escenario llamado «JULIO». Una fecha
    // la escribe la aplicación y no viene en mayúsculas sostenidas.
    if (reFecha.test(valor) && !reNoEsFecha.test(valor)) return 'fecha'
    if (reNumeroEntero.test(valor)) return 'numero'
    return 'texto'
  }

  /**
   * Rehace los dígitos dejando cada separador donde estaba, así que no hace falta
   * entender el formato: `$ 20.540,75` sale con la misma forma y el mismo ancho.
   *
   * Dos conservaciones deliberadas, por grupo de dígitos: un grupo entero de ceros se
   * queda en ceros (un `0,00` es un estado de la pantalla, no un dato de nadie) y los
   * ceros a la izquierda se mantienen (un código `001` sigue pareciendo un código).
   */
  function numero(texto, semilla = '') {
    const siguiente = flujo(hash64(`${texto}${semilla}`, salt))
    return texto.replace(/\d+/gu, (grupo) => rehacerDigitos(grupo, siguiente))
  }

  function rehacerDigitos(grupo, siguiente) {
    if (/^0+$/u.test(grupo)) return grupo
    let significativoPendiente = true
    return [...grupo]
      .map((digito) => {
        if (digito === '0' && significativoPendiente) return '0'
        const sorteado = siguiente() % 10
        if (significativoPendiente) {
          significativoPendiente = false
          return String(1 + (sorteado % 9))
        }
        return String(sorteado)
      })
      .join('')
  }

  /**
   * Los números con forma de dato que van dentro de una frase. Pasan por el mismo escalado
   * que los nodos numéricos: el subtítulo «47,41% de las ventas totales» de una tarjeta es
   * la razón entre dos cifras que están ahí al lado, y rehacerlo dígito a dígito publicaba
   * una tarjeta cuya propia división no cuadraba.
   */
  function numerosEmbebidos(texto, pista) {
    return texto.replace(reNumero, (coincidencia) => {
      if (!esDatoNumerico(coincidencia)) return coincidencia
      return escalarMagnitud(coincidencia, pista)?.texto ?? numero(coincidencia)
    })
  }

  // --- magnitudes ------------------------------------------------------------

  /**
   * Qué se hace con una cifra de la pantalla, y es lo único de este archivo que mira más
   * allá del valor que tiene delante.
   *
   * Rehacer los dígitos de cada celda por su cuenta —lo que se hacía antes— deja una captura
   * cuya aritmética no cuadra: una columna cuyas filas no suman su propio total, un
   * sobreinventario mayor que el inventario, un forecast que en dinero supera a las ventas y
   * en unidades no llega. Cualquiera que divida dos cifras de la captura ve que la
   * aplicación no sabe sumar, y eso desacredita la página entera.
   *
   * Así que la transformación es **lineal y compartida**: un factor por dimensión —uno para
   * el dinero, otro para las cantidades—, el mismo en toda la captura y en todas. Una
   * multiplicación conserva las sumas, los totales y las desigualdades sin que haya que
   * declarar ninguna fórmula, y no conserva las magnitudes, que es lo que no puede
   * publicarse. El precio unitario implícito tampoco se conserva: dinero y cantidades no
   * comparten factor.
   *
   * La contrapartida, que es una decisión y está anotada en el README: lo que sí sobrevive
   * son las **razones dentro de una misma dimensión** —el margen bruto, el porcentaje de
   * venta perdida, el GMROI—, porque el factor se cancela al dividir. Por eso un porcentaje
   * derivable de dos cifras visibles se deja **intacto**: cambiarlo es exactamente lo que
   * rompía la coherencia. Los porcentajes que no derivan de nada visible —los errores del
   * forecast: MAPE, sMAPE, BIAS, MAE, accuracy, FVA— no tienen con qué cuadrar y sí se
   * sanean; `magnitudes.porcentajes_propios` de reglas.json dice cuáles son.
   */
  function escalarMagnitud(texto, pista = '') {
    const parte = partirNumero(texto)
    if (!parte) return null
    const dimension = dimensionDe(parte)

    if (dimension === 'porcentaje') {
      if (!rePorcentajePropio.test(pista)) return { texto, coherente: true }
      return { texto: formatearComo(parte, escalarPorcentaje(parte.absoluto)), coherente: false }
    }
    return { texto: formatearComo(parte, parte.absoluto * factorDe(dimension)), coherente: false }
  }

  /** dinero · cantidad · porcentaje. Lo dice la forma del número, no la columna. */
  function dimensionDe(parte) {
    if (/%/u.test(parte.sufijo) || /%/u.test(parte.prefijo)) return 'porcentaje'
    if (reMoneda.test(parte.prefijo) || reMoneda.test(parte.sufijo)) return 'dinero'
    return 'cantidad'
  }

  /**
   * El factor de una dimensión: sale del salt, así que es el mismo en toda la corrida y en
   * las que vengan —dos capturas de la misma pantalla son comparables entre sí— y no se
   * puede deshacer sin el salt.
   */
  const factores = new Map()
  function factorDe(dimension) {
    if (factores.has(dimension)) return factores.get(dimension)
    const rango = reglas.magnitudes?.factores?.[dimension] ?? reglas.magnitudes?.factores?.cantidad
    const sorteado = Number(hash64(`dimension:${dimension}`, salt) % 10_000n) / 10_000
    const factor = rango.min + sorteado * (rango.max - rango.min)
    factores.set(dimension, factor)
    return factor
  }

  /**
   * Un porcentaje no se puede multiplicar sin más: un 80% por 1,4 da 112%, que no existe.
   * Si el factor se sale del techo se **divide** en vez de multiplicar, que mantiene el
   * resultado dentro del rango y sigue siendo determinista.
   */
  function escalarPorcentaje(absoluto) {
    const factor = factorDe('porcentaje')
    const techo = absoluto <= 100 ? 100 : Infinity
    return absoluto * factor > techo ? absoluto / factor : absoluto * factor
  }

  const esDatoNumerico = (texto) => reExige.test(texto) && !reFecha.test(texto.trim()) && !reAnio.test(texto.trim())

  /**
   * Qué hacer con un eje de una gráfica. Tres respuestas, y la segunda es la que se olvida:
   *
   *   `{accion: 'escalado', ticks}`  un eje de magnitudes: se reescala entero.
   *   `{accion: 'intacto'}`          un eje que **no se puede tocar**: porcentajes y fechas.
   *                                  Hay que protegerlo, no solo no escalarlo — si se deja
   *                                  caer al saneamiento por nodo, cada etiqueta se rehace
   *                                  por su cuenta y el eje de accuracy sale «0%, 22%, 914%».
   *   `null`                         no es un eje numérico (un eje de categorías, con
   *                                  nombres de tienda): que lo sanee el pase normal.
   *
   * @param {string[]} ticks las etiquetas del eje, en su orden
   */
  function escalarEje(ticks) {
    const utiles = ticks.filter((tick) => tick.trim())
    if (utiles.length < 2) return null
    // Un 0-100% es una escala fija de la interfaz, no un dato del cliente.
    if (utiles.some((tick) => tick.includes('%'))) return { accion: 'intacto', porque: 'porcentaje' }
    // Un eje de fechas empieza por un número («16 de jul, 2026») y se dejaría escalar sin
    // protestar: el eje X se correría dos semanas y la gráfica hablaría de otras fechas.
    if (utiles.some((tick) => reFecha.test(tick.trim()))) return { accion: 'intacto', porque: 'fechas' }
    const partidos = utiles.map(partirNumero)
    if (partidos.some((parte) => !parte)) return null

    // El eje se escala con el factor de su dimensión, el mismo con el que se escalan las
    // celdas y las tarjetas: si el eje llevara un factor propio, la gráfica y la tabla de
    // debajo hablarían de magnitudes distintas.
    // La dimensión se decide mirando el eje entero: el primer tick de un eje de dinero es un
    // «0» pelado, sin el símbolo de la moneda, así que preguntárselo solo a él lo habría
    // escalado con el factor de las cantidades y la gráfica no cuadraría con sus tarjetas.
    const factor = factorDe(partidos.some((parte) => dimensionDe(parte) === 'dinero') ? 'dinero' : 'cantidad')
    const vocabulario = unidadesDe(partidos)
    const nuevos = enRejilla(partidos, factor, vocabulario) ?? escalarTickPorTick(partidos, factor, vocabulario)

    // Lo que de verdad protege al eje: comprobar el resultado. Si quedó desordenado o con
    // dos etiquetas iguales, la gráfica avisaría de que la captura está trucada, y eso es
    // peor que no tener captura.
    const problema = revisarEje(partidos, nuevos)
    if (problema) return { accion: 'incoherente', porque: problema }

    const pendientes = [...nuevos.map((nuevo) => nuevo.texto)]
    return { accion: 'escalado', ticks: ticks.map((tick) => (tick.trim() ? pendientes.shift() ?? tick : tick)) }
  }

  const escalarTickPorTick = (partidos, factor, vocabulario) =>
    partidos.map((parte) => {
      const absoluto = parte.absoluto * factor
      return {
        absoluto,
        texto: formatearComo(
          { ...parte, redondear: significativasDe(parte), ajustarDecimales: true },
          absoluto,
          unidadPara(absoluto, vocabulario),
        ),
      }
    })

  /**
   * Las magnitudes que el eje ya usaba, que son las que su formateador sabe emitir. Un eje
   * que mezcla `800 k` con `1,6 M` no está mal formateado: es un formateador compacto, y la
   * captura tiene que seguir pareciéndose a eso.
   */
  function unidadesDe(partidos) {
    const vistas = new Map([[1, '']])
    for (const parte of partidos) if (!vistas.has(parte.unidad)) vistas.set(parte.unidad, parte.marcaUnidad)
    return [...vistas].map(([unidad, marcaUnidad]) => ({ unidad, marcaUnidad })).sort((a, b) => b.unidad - a.unidad)
  }

  /** La magnitud con la que se emite un valor: la mayor que no lo deja por debajo de uno. */
  function unidadPara(absoluto, vocabulario) {
    const magnitud = Math.abs(absoluto)
    return vocabulario.find((candidata) => magnitud >= candidata.unidad) ?? vocabulario[vocabulario.length - 1]
  }

  /**
   * ¿El eje nuevo se puede publicar? Dos preguntas, y las dos salieron de mirar un PNG:
   *
   *   · **¿sigue ordenado?** Escalar tick por tick sin mirar el sufijo daba ejes que
   *     retrocedían: el `valor` de `1300 k` es 1300 y el de `3 M` es 3.
   *   · **¿hay dos etiquetas iguales?** Un paso de medio millón emitido con cero decimales
   *     sale «1 M · 1 M · 2 M · 2 M». El eje crece, pero enseña dos veces el mismo número.
   */
  function revisarEje(partidos, nuevos) {
    for (let indice = 1; indice < nuevos.length; indice += 1) {
      const crecia = partidos[indice].absoluto > partidos[indice - 1].absoluto
      if (crecia && nuevos[indice].absoluto <= nuevos[indice - 1].absoluto) return 'el eje dejó de crecer'
      if (crecia && nuevos[indice].texto === nuevos[indice - 1].texto) return 'dos etiquetas del eje salieron iguales'
    }
    return null
  }

  /**
   * El caso bueno: un eje que empieza en cero, con paso constante y una sola unidad. Se
   * escala el paso, se lo redondea a un valor de los que usan los ejes de verdad (1, 1,5,
   * 2, 2,5, 3, 4, 5, 6, 7,5, 8 × 10ⁿ) y se reconstruyen los ticks como múltiplos.
   *
   * Escalar tick por tick daría un eje creciente pero de pasos desiguales —73 k, 150 k,
   * 220 k, 290 k…—, que no se parece a nada que la aplicación pinte. Cuando el eje no es
   * así de regular se vuelve al escalado por tick, que siempre funciona.
   */
  function enRejilla(partidos, factor, vocabulario) {
    if (partidos.length < 3) return null
    // En absoluto, no en la escala del sufijo: un eje que va de `800 k` a `4 M` tiene el paso
    // constante, y compararlo por el número visible decía que no.
    if (partidos[0].absoluto !== 0) return null

    const pasos = partidos.slice(1).map((parte, indice) => parte.absoluto - partidos[indice].absoluto)
    if (pasos[0] <= 0) return null
    if (pasos.some((paso) => Math.abs(paso - pasos[0]) > pasos[0] * 0.02)) return null

    const paso = pasoBonito(pasos[0] * factor)
    return partidos.map((parte, indice) => {
      const absoluto = paso * indice
      // `redondear: false` porque un múltiplo de un paso bonito ya es redondo y un segundo
      // redondeo le rompería el paso constante. Los decimales, en cambio, se dejan calcular:
      // fijarlos en cero es lo que duplicaba etiquetas.
      const destino = unidadPara(absoluto, vocabulario)
      return {
        absoluto,
        texto: formatearComo({ ...parte, redondear: false, decimales: 0, ajustarDecimales: true }, absoluto, destino),
      }
    })
  }

  const BONITOS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8]

  function pasoBonito(paso) {
    const magnitud = 10 ** Math.floor(Math.log10(paso))
    const normalizado = paso / magnitud
    const elegido = BONITOS.reduce((mejor, candidato) =>
      Math.abs(candidato - normalizado) < Math.abs(mejor - normalizado) ? candidato : mejor,
    )
    return elegido * magnitud
  }

  /** `$ 212,5 k` → sus pedazos, con el número ya en base 10 y el locale resuelto. */
  function partirNumero(texto) {
    const partes = texto.trim().match(/^([^\d-]*)(-?[\d.,\u00a0\u202f ]*\d)(.*)$/u)
    if (!partes) return null
    const [, prefijo, cuerpo, sufijo] = partes

    // El separador decimal es el último `.` o `,` con una o dos cifras detrás; el resto son
    // separadores de miles. Sirve igual para `1.234,5` que para `1,234.5`.
    const decimal = cuerpo.match(/[.,](\d{1,2})$/u)
    const enteros = (decimal ? cuerpo.slice(0, -decimal[0].length) : cuerpo).replace(/[^\d-]/gu, '')
    const valor = Number(`${enteros || '0'}.${decimal ? decimal[1] : '0'}`)
    if (!Number.isFinite(valor)) return null

    const { unidad, marca } = magnitudDe(sufijo)
    return {
      original: texto,
      prefijo,
      sufijo,
      unidad,
      // `' k'` de `' k'`, y `''` de `' Unidades'`: lo que hay que reemplazar si el n\u00famero
      // cambia de magnitud al escalarse.
      marcaUnidad: marca,
      valor,
      // El valor de verdad, ya en base 10: es el \u00fanico con el que se puede comparar,
      // sumar o escalar. `valor` se queda para formatear con la misma forma.
      absoluto: valor * unidad,
      decimales: decimal ? decimal[1].length : 0,
      separadorMiles: cuerpo.match(/[.,\u00a0\u202f ](?=\d{3})/u)?.[0] ?? '',
      separadorDecimal: decimal ? decimal[0][0] : ',',
    }
  }

  /**
   * El número nuevo con el formato del viejo.
   *
   * `absoluto` va **en base 10**, no en la escala del sufijo: es la única forma de que dos
   * ticks con unidades distintas se puedan comparar. `destino` permite emitirlo en otra
   * magnitud que la del original —un eje que se escala hacia arriba pasa de `k` a `M`— y
   * fijar los decimales de todo un eje a la vez.
   */
  function formatearComo(parte, absoluto, destino = {}) {
    const unidad = destino.unidad ?? parte.unidad
    const marcaUnidad = destino.marcaUnidad ?? parte.marcaUnidad
    const enUnidad = Math.abs(absoluto) / unidad

    // Un eje de la aplicación nunca dice «1345 k»: su formateador emite números redondos, y
    // por eso un tick se redondea (`redondear: <cifras>`) a **las mismas cifras
    // significativas que traía el original**, que es la precisión con la que esa pantalla
    // pinta ese eje. Con un número fijo de cifras se colaba lo contrario: el eje que la
    // aplicación pinta «500 k · 1 M · 2 M» salía con un «220 k» al lado, que ese formateador
    // no emitiría nunca. Una celda no se redondea: ahí dejaría una tabla de cantidades
    // terminadas todas en ceros y, peor, rompería la aditividad que hace que la columna sume
    // su propio total.
    const base = destino.decimales ?? parte.decimales
    const escalado = parte.redondear ? significativas(enUnidad, parte.redondear) : enUnidad
    // Un eje puede necesitar un decimal que el original no tenía: sin esto, un paso bonito de
    // medio millón en un eje que la aplicación pinta con cero decimales sale «1 M · 1 M · 2 M
    // · 2 M». Una celda no lo necesita nunca —una cantidad entera tiene que seguir siendo
    // entera— y ahí se conservan los decimales de la pantalla.
    const decimales = destino.decimales ?? (parte.ajustarDecimales ? decimalesPara(escalado, parte.decimales) : parte.decimales)

    const redondeado = Math.round(escalado * 10 ** decimales) / 10 ** decimales
    const [enteros, cifras = ''] = redondeado.toFixed(decimales).split('.')
    // Si el original no llegaba a mil no traía separador de miles que copiar, y al escalarlo
    // salía un «$ 1067,04» que esa pantalla no escribe así. Se deduce del separador decimal,
    // que es el otro signo del mismo locale.
    const miles = parte.separadorMiles || (parte.separadorDecimal === ',' ? '.' : ',')
    const agrupado = enteros.replace(/\B(?=(\d{3})+(?!\d))/gu, miles)
    const signo = absoluto < 0 ? '-' : ''
    const sufijo = `${parte.sufijo.slice(0, parte.sufijo.length - parte.marcaUnidad.length)}${marcaUnidad}`
    return `${parte.prefijo}${signo}${agrupado}${cifras ? parte.separadorDecimal + cifras : ''}${sufijo}`
  }

  /** Cuántos decimales hacen falta para no perder el valor, sin pasarse de dos. */
  function decimalesPara(valor, minimos) {
    for (const cifras of [minimos, 1, 2]) {
      if (cifras >= minimos && Math.abs(valor - Number(valor.toFixed(cifras))) < 1e-9) return cifras
    }
    return Math.max(minimos, 2)
  }

  /**
   * Con cuánta precisión pintaba la aplicación este tick: `500 k` es una cifra
   * significativa, `1,35 M` son tres. Es lo que hay que conservar para que el eje nuevo
   * parezca salido del mismo formateador que el viejo.
   */
  function significativasDe(parte) {
    const digitos = String(parte.valor).replace(/[^\d]/gu, '').replace(/0+$/u, '')
    return Math.max(digitos.length, 1)
  }

  function significativas(valor, cifras) {
    if (valor === 0) return 0
    const magnitud = 10 ** (Math.floor(Math.log10(valor)) - cifras + 1)
    return Math.round(valor / magnitud) * magnitud
  }

  /**
   * Misma forma, otro contenido: dígito por dígito y letra por letra. Para códigos.
   *
   * Los ceros a la izquierda se conservan —un `004` tiene que seguir pareciendo un código de
   * tienda y no un número cualquiera—, así que los grupos de dígitos van por la misma
   * transformación que `numero`.
   */
  function forma(texto, semilla = '') {
    const siguiente = flujo(hash64(`${texto}${semilla}`, salt))
    return texto.replace(/\d+|[\p{L}]/gu, (trozo) => {
      if (/\d/u.test(trozo)) return rehacerDigitos(trozo, siguiente)
      if (/[a-z]/u.test(trozo)) return MAYUSCULAS[siguiente() % 26].toLowerCase()
      return MAYUSCULAS[siguiente() % 26]
    })
  }

  /**
   * Un código, y no dos filas con el mismo.
   *
   * Va por `forma` y no por el escalado de magnitudes: un identificador multiplicado por 1,7
   * deja de tener la longitud de un código, y `797` es un nodo numérico como cualquier otro
   * —sin esta rama el escalado se lo llevaba—. Y va con reparto inyectivo dentro de la
   * captura por lo mismo que los nombres: dos códigos distintos que salgan iguales se leen
   * como un defecto de la aplicación.
   */
  const codigosDados = new Set()
  function codigo(texto) {
    const clave = `codigo|${texto}`
    if (asignados.has(clave)) return asignados.get(clave)
    let elegido = forma(texto)
    for (let intento = 1; codigosDados.has(elegido) && intento <= 64; intento += 1) {
      elegido = forma(texto, `#${intento}`)
    }
    codigosDados.add(elegido)
    asignados.set(clave, elegido)
    return elegido
  }

  /** Qué es la columna, para elegir la lista del catálogo. */
  function especieDe(...pistas) {
    const pista = pistas.filter(Boolean).join(' ')
    if (!pista) return reglas.especies.porDefecto
    for (const { especie, compilado } of especies) if (compilado.test(pista)) return especie
    return reglas.especies.porDefecto
  }

  // Lo que ya se repartió en **esta** captura, para no darle el mismo nombre ficticio a dos
  // valores reales distintos. Ver `delCatalogo`.
  const asignados = new Map()
  const tomados = new Set()
  const unicos = new Set(reglas.especies.unicos ?? [])

  /**
   * Un valor del catálogo, elegido por el hash del valor real.
   *
   * En las especies de `especies.unicos` el reparto es **inyectivo dentro de la captura**: dos
   * centros distintos con el mismo hash saldrían con el mismo nombre y la tabla parecería
   * tener filas repetidas —un lector razonable lo leería como un defecto de la aplicación—.
   * Si el hash cae en un nombre ya tomado se prueba el siguiente, y si el catálogo se agota se
   * numera («CD ABARROTES 02»), que es como se llaman de verdad los locales de una cadena.
   *
   * La consistencia entre pantallas se conserva igual: el primer intento sigue siendo función
   * del valor real, así que solo cambia de nombre lo que colisiona.
   */
  function delCatalogo(texto, especie) {
    const cual = catalogo[especie] ? especie : reglas.especies.porDefecto
    const lista = catalogo[cual]
    const clave = `${cual}|${texto}`
    if (asignados.has(clave)) return ajustarCaja(texto, asignados.get(clave))

    let elegido = lista[Number(hash64(texto, salt) % BigInt(lista.length))]
    if (unicos.has(cual)) {
      for (let intento = 1; tomados.has(`${cual}|${elegido}`); intento += 1) {
        elegido =
          intento <= lista.length
            ? lista[Number(hash64(`${texto}#${intento}`, salt) % BigInt(lista.length))]
            : `${lista[Number(hash64(texto, salt) % BigInt(lista.length))]} ${String(intento - lista.length + 1).padStart(2, '0')}`
      }
      tomados.add(`${cual}|${elegido}`)
    }
    asignados.set(clave, elegido)
    return ajustarCaja(texto, elegido)
  }

  /** La identidad de ejemplo, con la forma del valor real: correo si el real era un correo. */
  function comoUsuario(texto) {
    const ejemplo = catalogo.usuario
    return texto.includes('@') ? ejemplo.correo : ejemplo.nombre
  }

  /**
   * El reemplazo imita la caja del original: la aplicación trae los maestros del cliente
   * en mayúsculas sostenidas y una captura con esa columna en minúsculas se nota.
   */
  function ajustarCaja(original, reemplazo) {
    const letras = [...original].filter((caracter) => /\p{L}/u.test(caracter))
    if (letras.length >= 2 && letras.every((caracter) => caracter === caracter.toUpperCase())) {
      return reemplazo.toUpperCase()
    }
    if (letras.length >= 2 && letras.every((caracter) => caracter === caracter.toLowerCase())) {
      return reemplazo.toLowerCase()
    }
    return reemplazo
      .toLowerCase()
      .replace(/(^|\s)(\p{L})/gu, (_, espacio, letra) => `${espacio}${letra.toUpperCase()}`)
  }

  /**
   * El saneamiento de un nodo de texto.
   *
   * @param {string} texto el contenido real
   * @param {{enRegion?: boolean, especie?: string}} contexto
   * @returns {{texto: string, tipo: string}|null} `null` si no hay nada que cambiar
   */
  function sanear(texto, { enRegion = false, especie, pista = '' } = {}) {
    const tipo = clasificar(texto)
    if (tipo === 'vacio') return null
    if (tipo === 'fecha') return { texto, tipo: 'fecha' }
    const cual = especie ?? reglas.especies.porDefecto

    // El código va **antes** que el número: `797` es un nodo numérico y sin esta rama se lo
    // llevaba el escalado de magnitudes, que a un identificador no le hace nada bueno.
    if (enRegion && cual === 'codigo') return { texto: codigo(texto), tipo: 'codigo' }

    if (tipo === 'numero') {
      // Un nodo que es solo un número: dentro de una región es un dato y se rehace
      // siempre; fuera, solo si tiene forma de dato — «25» y «100» son el selector de
      // filas por página y cambiarlos rompe la pantalla que se está documentando.
      if (!enRegion && !esDatoNumerico(texto)) return null
      const escalado = escalarMagnitud(texto, pista)
      // Un número que no se pudo entender no se deja pasar: se rehace como antes.
      if (!escalado) return { texto: numero(texto), tipo: 'numero' }
      // Una razón se queda como está para que siga cuadrando con las cifras que tiene al
      // lado. Se devuelve marcada, no como `null`: la guarda tiene que saber que esta cifra
      // se miró y se decidió, o la contaría como un número sin sanear y abortaría la captura.
      if (escalado.coherente) return { texto, tipo: 'razon-coherente' }
      return { texto: escalado.texto, tipo: 'numero' }
    }

    if (enRegion) {
      // Ver `especies` en reglas.json: estas dos no salen del catálogo.
      if (cual === 'vocabulario') return { texto, tipo: 'vocabulario' }
      if (cual === 'usuario') return { texto: comoUsuario(texto), tipo: 'usuario' }
      return { texto: delCatalogo(texto, cual), tipo: cual }
    }

    // Fuera de una región el texto es vocabulario de la aplicación y se conserva; lo
    // único que no puede quedarse es un número con forma de dato metido en la frase.
    const conNumeros = numerosEmbebidos(texto, pista)
    return conNumeros === texto ? null : { texto: conNumeros, tipo: 'numero-embebido' }
  }

  /** ¿Este texto tiene un número con forma de dato? Lo usa la guarda. */
  function tieneNumeroDeDatos(texto) {
    const valor = texto.trim()
    if (!valor || reFecha.test(valor)) return false
    for (const coincidencia of valor.match(reNumero) ?? []) {
      if (esDatoNumerico(coincidencia)) return true
    }
    return false
  }

  return {
    clasificar,
    sanear,
    numero,
    forma,
    codigo,
    escalarEje,
    escalarMagnitud,
    factorDe,
    especieDe,
    delCatalogo,
    tieneNumeroDeDatos,
    hash: (texto) => hash64(texto, salt),
  }
}
