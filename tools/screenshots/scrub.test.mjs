#!/usr/bin/env node
/**
 * Las pruebas del saneamiento.
 *
 *   node tools/screenshots/scrub.test.mjs
 *
 * Prueban lo único de este pipeline que se puede probar sin un navegador y sin la
 * aplicación: el mapa de valores. Y prueban, sobre todo, **la propiedad que el cierre de
 * 1a.1 pide** — mismo valor real, mismo valor ficticio, corrida tras corrida — porque es
 * la que no se puede comprobar mirando un PNG.
 *
 * Corren en CI: no tocan la red ni el disco.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { crearSaneador } from './scrub.mjs'
import { buscarNombres, normalize } from '../lib/nombres.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const leer = (nombre) => JSON.parse(readFileSync(path.join(AQUI, nombre), 'utf8'))
const catalogo = leer('catalogo.json')
const reglas = leer('reglas.json')
const denylist = JSON.parse(readFileSync(path.join(AQUI, '../denylist.json'), 'utf8'))

const SALT = 'salt-de-prueba-no-es-el-de-produccion'
const saneador = crearSaneador({ catalogo, reglas, salt: SALT })

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

console.log('scrub.test — el mapa de valores\n')

prueba('clasifica lo que ve en la aplicación', () => {
  igual(saneador.clasificar('$ 7.843.141,17'), 'numero')
  igual(saneador.clasificar('10,42%'), 'numero')
  igual(saneador.clasificar('50 k'), 'numero')
  igual(saneador.clasificar('1 M'), 'numero')
  igual(saneador.clasificar('0'), 'numero')
  igual(saneador.clasificar('16 de jul, 2026'), 'fecha')
  igual(saneador.clasificar('2026-07-30'), 'fecha')
  igual(saneador.clasificar('CENTRO DE DISTRIBUCION NORTE'), 'texto')
  igual(saneador.clasificar('   '), 'vacio')
  igual(saneador.clasificar('—'), 'vacio')
})

prueba('el mismo valor da siempre el mismo resultado', () => {
  const otro = crearSaneador({ catalogo, reglas, salt: SALT })
  for (const valor of ['$ 20.540,00', 'BODEGA CENTRAL', '102677', '35.292,92']) {
    igual(otro.sanear(valor, { enRegion: true }), saneador.sanear(valor, { enRegion: true }), `«${valor}»: `)
  }
})

prueba('otro salt da otro resultado', () => {
  const otro = crearSaneador({ catalogo, reglas, salt: 'otro-salt' })
  const conUno = saneador.sanear('BODEGA CENTRAL', { enRegion: true }).texto
  const conOtro = otro.sanear('BODEGA CENTRAL', { enRegion: true }).texto
  cierto(conUno !== conOtro, 'con dos salts distintos salió el mismo nombre ficticio')
})

prueba('el número conserva su forma y pierde su valor', () => {
  const { texto } = saneador.sanear('$ 7.843.141,17', { enRegion: true })
  cierto(texto !== '$ 7.843.141,17', 'no cambió')
  igual(texto.replace(/\d/gu, '#'), '$ #.###.###,##', 'la forma cambió: ')
})

prueba('los ceros se quedan quietos', () => {
  igual(saneador.sanear('0,00', { enRegion: true }).texto, '0,00')
  igual(saneador.numero('0'), '0')
  cierto(/^0\d\d$/u.test(saneador.numero('001')), `un código con ceros a la izquierda los perdió: ${saneador.numero('001')}`)
})

prueba('el año no es un dato', () => {
  const { texto } = saneador.sanear('16 de jul, 2026 - 30 de jul, 2026', { enRegion: false })
    ?? { texto: '16 de jul, 2026 - 30 de jul, 2026' }
  igual(texto, '16 de jul, 2026 - 30 de jul, 2026')
})

prueba('fuera de una región, los números de la interfaz sobreviven', () => {
  igual(saneador.sanear('25', { enRegion: false }), null, 'filas por página: ')
  igual(saneador.sanear('100', { enRegion: false }), null, 'filas por página: ')
  cierto(saneador.sanear('1.515.874,76', { enRegion: false }) !== null, 'un número con forma de dato tiene que caer igual')
})

prueba('dentro de una región manda la especie de la columna', () => {
  igual(saneador.especieDe('supplier_name', 'Nombre del Proveedor'), 'proveedor')
  igual(saneador.especieDe('store_code', 'Código de Tienda'), 'codigo')
  igual(saneador.especieDe('', 'Nombre del Centro de Distribución'), 'cedi')
  igual(saneador.especieDe('product_description', ''), 'producto')
  igual(saneador.especieDe('', ''), 'generico')
  cierto(
    catalogo.proveedor.includes(saneador.sanear('POZO CHAMORRO ARTURO GERMAN', { enRegion: true, especie: 'proveedor' }).texto),
    'un proveedor tiene que salir del catálogo de proveedores',
  )
})

prueba('dos valores distintos no salen con el mismo nombre', () => {
  const propio = crearSaneador({ catalogo, reglas, salt: SALT })
  const reales = Array.from({ length: 30 }, (_, i) => `CENTRO DE DISTRIBUCION ${i}`)
  const ficticios = reales.map((real) => propio.sanear(real, { enRegion: true, especie: 'cedi' }).texto)
  igual(new Set(ficticios).size, reales.length, `hubo nombres repetidos: ${ficticios.join(' | ')}`)
})

prueba('una categoría sí se puede repetir', () => {
  const propio = crearSaneador({ catalogo, reglas, salt: SALT })
  const ficticias = ['LACTEOS', 'BEBIDAS', 'ASEO', 'SNACKS', 'CARNES', 'FRUTAS', 'PANADERIA', 'LICORES', 'HOGAR'].map(
    (real) => propio.sanear(real, { enRegion: true, especie: 'categoria' }).texto,
  )
  cierto(
    new Set(ficticias).size < ficticias.length,
    'las categorías se están repartiendo como únicas: muchos productos comparten categoría',
  )
})

prueba('el reemplazo imita la caja del original', () => {
  const mayusculas = saneador.sanear('CD FRUVER', { enRegion: true, especie: 'cedi' }).texto
  igual(mayusculas, mayusculas.toUpperCase(), 'mayúsculas sostenidas: ')
  const titulo = saneador.sanear('Bodega Principal', { enRegion: true, especie: 'cedi' }).texto
  cierto(titulo !== titulo.toUpperCase(), `un nombre en capitalización de título salió en mayúsculas: ${titulo}`)
})

prueba('el eje se escala entero y sigue creciendo', () => {
  const ticks = ['0', '50 k', '100 k', '150 k', '200 k', '250 k']
  const { accion, ticks: nuevos } = saneador.escalarEje(ticks)
  igual(accion, 'escalado')
  igual(nuevos.length, ticks.length)
  cierto(nuevos.join('|') !== ticks.join('|'), 'el eje salió idéntico')
  const valores = nuevos.map((tick) => Number(tick.replace(/[^\d]/gu, '')))
  for (let i = 1; i < valores.length; i += 1) {
    cierto(valores[i] >= valores[i - 1], `el eje dejó de crecer: ${nuevos.join(' | ')}`)
  }
})

// Un eje intocable NO es lo mismo que un eje ajeno: si se devolviera `null`, el saneamiento
// por nodo rehace cada etiqueta y el eje de accuracy sale «0%, 22%, 914%».
prueba('un eje de porcentaje se protege, no se ignora', () => {
  igual(saneador.escalarEje(['0%', '20%', '40%', '60%', '80%', '100%']).accion, 'intacto')
})

prueba('un eje de fechas se protege, no se ignora', () => {
  igual(saneador.escalarEje(['16 de jul, 2026', '18 de jul, 2026', '20 de jul, 2026']).accion, 'intacto')
})

prueba('un eje de categorías no es asunto del escalado', () => {
  igual(saneador.escalarEje(['TIENDA UNO', 'TIENDA DOS', 'TIENDA TRES']), null)
})

prueba('un eje regular sale regular: mismo paso y números redondos', () => {
  const { ticks: nuevos } = saneador.escalarEje(['0', '100 k', '200 k', '300 k', '400 k'])
  const valores = nuevos.map((tick) => Number(tick.replace(/[^\d]/gu, '')))
  igual(valores[0], 0, 'el eje ya no empieza en cero: ')
  const paso = valores[1]
  for (let i = 1; i < valores.length; i += 1) {
    igual(valores[i], paso * i, `el paso dejó de ser constante (${nuevos.join(' | ')}): `)
  }
  cierto(/^\d{1,2}[05]?0*$/u.test(String(paso)), `«${paso}» no es un paso de eje creíble`)
  // El cero va sin unidad, igual que lo pinta la aplicación.
  igual(nuevos[0], '0')
  cierto(nuevos.slice(1).every((tick) => tick.endsWith(' k')), `el eje perdió su unidad: ${nuevos.join(' | ')}`)
})

prueba('un eje irregular se escala tick por tick y sigue creciendo', () => {
  const { ticks: nuevos } = saneador.escalarEje(['12,5', '31,4', '55,9', '104,2'])
  const valores = nuevos.map((tick) => Number(tick.replace(/\./gu, '').replace(',', '.')))
  for (let i = 1; i < valores.length; i += 1) {
    cierto(valores[i] > valores[i - 1], `el eje irregular dejó de crecer: ${nuevos.join(' | ')}`)
  }
})

prueba('un eje con dos unidades sigue creciendo', () => {
  const { ticks: nuevos } = saneador.escalarEje(['0', '500 k', '1 M', '2 M', '3 M'])
  const enMiles = nuevos.map((tick) => Number(tick.replace(/[^\d]/gu, '')) * (tick.includes('M') ? 1000 : 1))
  for (let i = 1; i < enMiles.length; i += 1) {
    cierto(enMiles[i] >= enMiles[i - 1], `el eje mezcló unidades y dejó de crecer: ${nuevos.join(' | ')}`)
  }
})

prueba('la columna la nombra su encabezado, no solo su data-field', () => {
  // En el reporte de desempeño la columna «Nombre del Proveedor» tiene data-field="category".
  igual(saneador.especieDe('Nombre del Proveedor', 'category'), 'proveedor')
  igual(saneador.especieDe('Código de Proveedor', 'supplier_code'), 'codigo')
})

prueba('la guarda reconoce un número de datos y no una fecha', () => {
  cierto(saneador.tieneNumeroDeDatos('105.521,20'), 'no vio un número de datos')
  cierto(saneador.tieneNumeroDeDatos('vendió $ 1.200 ayer'), 'no vio el número dentro de la frase')
  cierto(!saneador.tieneNumeroDeDatos('16 de jul, 2026'), 'confundió una fecha con un dato')
  cierto(!saneador.tieneNumeroDeDatos('Filas por página'), 'vio un número donde no hay')
  cierto(!saneador.tieneNumeroDeDatos('25'), 'el selector de filas no es un dato')
})

prueba('el catálogo no nombra a ningún cliente conocido', () => {
  const hashes = new Map(denylist.nombres.hashes.map((entrada) => [entrada.h, entrada.pista]))
  const entradas = Object.values(catalogo)
    .flat()
    .filter((entrada) => typeof entrada === 'string')
  for (const entrada of entradas) {
    const encontrados = buscarNombres(entrada, hashes)
    cierto(!encontrados.length, `una entrada del catálogo coincide con un nombre de la lista: ${normalize(entrada).slice(0, 3)}…`)
  }
})

prueba('las reglas y el catálogo son coherentes', () => {
  // `codigo` se rehace por forma, `vocabulario` no se toca y `usuario` sale de catalogo.usuario:
  // las tres no necesitan lista.
  const sinLista = new Set(['codigo', 'vocabulario', 'usuario'])
  for (const { especie } of reglas.especies.orden) {
    cierto(
      sinLista.has(especie) || Array.isArray(catalogo[especie]),
      `reglas.json usa la especie «${especie}» y el catálogo no la tiene`,
    )
  }
  cierto(Array.isArray(catalogo[reglas.especies.porDefecto]), 'el catálogo no tiene la especie por defecto')
  cierto(Boolean(catalogo.usuario?.nombre && catalogo.usuario?.correo), 'falta la identidad de ejemplo en el catálogo')
})

prueba('una pantalla de configuración conserva su vocabulario', () => {
  igual(saneador.especieDe('Estado', 'status'), 'vocabulario')
  igual(saneador.especieDe('Motor', 'engine'), 'vocabulario')
  igual(saneador.especieDe('Nombre', 'ruleset_name'), 'vocabulario', 'el nombre de una regla es de la plataforma: ')
  igual(saneador.sanear('is_distributed', { enRegion: true, especie: 'vocabulario' }).texto, 'is_distributed')
  igual(saneador.sanear('Creado', { enRegion: true, especie: 'vocabulario' }).texto, 'Creado')
})

prueba('quien creó la regla se cambia por la identidad de ejemplo', () => {
  igual(saneador.especieDe('Creado por', 'created_by'), 'usuario')
  igual(saneador.sanear('diego@biai.tech', { enRegion: true, especie: 'usuario' }).texto, catalogo.usuario.correo)
  igual(saneador.sanear('Diego Pérez', { enRegion: true, especie: 'usuario' }).texto, catalogo.usuario.nombre)
})

prueba('una fecha con hora sigue siendo una fecha', () => {
  igual(saneador.clasificar('18/3/2026, 2:26:27 p. m.'), 'fecha')
  igual(saneador.clasificar('2026-07-30 14:32'), 'fecha')
  igual(saneador.clasificar('14:32'), 'fecha')
  igual(saneador.sanear('18/3/2026, 2:26:27 p. m.', { enRegion: true }).texto, '18/3/2026, 2:26:27 p. m.')
})

console.log('')
if (fallos) {
  console.error(`scrub.test: ${fallos} prueba(s) fallaron`)
  process.exit(1)
}
console.log('scrub.test: todo en orden')
