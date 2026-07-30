/**
 * El PNG que se commitea: sin metadatos y recomprimido.
 *
 * Se reescribe el archivo dejando solo los trozos que hacen falta para pintar la imagen
 * (`IHDR`, paleta si la hay, `IDAT`, `IEND`) y volviendo a comprimir los datos con el
 * nivel máximo. Los píxeles no se tocan: se descomprime y se vuelve a comprimir el mismo
 * flujo, así que la imagen es exactamente la misma.
 *
 * Dos motivos, y el segundo es el que importa:
 *
 *   · Pesa menos. Un sitio de documentación con 81 capturas nota la diferencia.
 *   · Se van los trozos accesorios (`tEXt`, `tIME`, `iTXt`…). Hoy el navegador no escribe
 *     nada comprometedor ahí, pero el historial de git es permanente y no queremos que la
 *     próxima versión del navegador nos meta un metadato que nadie estaba mirando.
 *
 * Node puro: `node:zlib`, como el resto de `tools/`. No se usa `optipng` ni nada externo
 * a propósito — el mismo archivo de entrada tiene que dar el mismo archivo de salida en
 * cualquier máquina donde alguien vuelva a tomar la captura.
 */

import { deflateSync, inflateSync } from 'node:zlib'

const FIRMA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const CONSERVAR = new Set(['IHDR', 'PLTE', 'tRNS', 'IDAT', 'IEND'])

/** @returns {{png: Buffer, ancho: number, alto: number, quitados: string[]}} */
export function optimizar(entrada) {
  if (!entrada.subarray(0, 8).equals(FIRMA)) throw new Error('no es un PNG')

  const trozos = []
  const idat = []
  const quitados = []
  let cursor = 8

  while (cursor < entrada.length) {
    const largo = entrada.readUInt32BE(cursor)
    const tipo = entrada.toString('latin1', cursor + 4, cursor + 8)
    const datos = entrada.subarray(cursor + 8, cursor + 8 + largo)
    cursor += largo + 12

    if (!CONSERVAR.has(tipo)) {
      quitados.push(tipo)
      continue
    }
    if (tipo === 'IDAT') idat.push(datos)
    else trozos.push({ tipo, datos })
  }

  const cabecera = trozos.find((trozo) => trozo.tipo === 'IHDR')
  if (!cabecera || !idat.length) throw new Error('PNG sin IHDR o sin IDAT')

  const recomprimido = deflateSync(inflateSync(Buffer.concat(idat)), { level: 9 })
  const salida = [FIRMA]
  for (const trozo of trozos) {
    if (trozo.tipo === 'IEND') continue
    salida.push(armar(trozo.tipo, trozo.datos))
  }
  salida.push(armar('IDAT', recomprimido), armar('IEND', Buffer.alloc(0)))

  return {
    png: Buffer.concat(salida),
    ancho: cabecera.datos.readUInt32BE(0),
    alto: cabecera.datos.readUInt32BE(4),
    quitados: [...new Set(quitados)],
  }
}

function armar(tipo, datos) {
  const largo = Buffer.alloc(4)
  largo.writeUInt32BE(datos.length)
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'latin1'), datos])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(cuerpo))
  return Buffer.concat([largo, cuerpo, crc])
}

const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256)
  for (let i = 0; i < 256; i += 1) {
    let valor = i
    for (let bit = 0; bit < 8; bit += 1) valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1
    tabla[i] = valor
  }
  return tabla
})()

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) crc = TABLA_CRC[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
