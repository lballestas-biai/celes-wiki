/**
 * Los nombres de cliente, como hash.
 *
 * Vive aparte porque hay dos sitios que preguntan lo mismo: `check-denylist.mjs` sobre el
 * Markdown que se va a publicar, y `screenshots/check-screenshots.mjs` sobre el texto que
 * quedó en una captura. Duplicar una comprobación de fuga es la manera de que una de las
 * dos copias se quede vieja.
 *
 * Por qué hash y no literal: este repositorio es público. Una lista de clientes en claro
 * sería exactamente la fuga que la regla existe para impedir.
 */

import { createHash } from 'node:crypto'

/** Con tildes fuera, en minúsculas y con los separadores colapsados. */
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export const hashOf = (text) => createHash('sha256').update(normalize(text)).digest('hex').slice(0, 12)

/**
 * Los nombres de la lista que aparecen en un texto.
 *
 * Se comparan hashes de los n-gramas de 1 a 3 palabras, de más largo a más corto: «Grupo
 * X» y «X» son la misma fuga, no dos.
 *
 * @param {string} texto
 * @param {Map<string, string>} hashes hash de 12 → pista legible
 * @returns {Array<{gram: string, pista: string}>}
 */
export function buscarNombres(texto, hashes) {
  if (!hashes.size) return []
  const encontrados = []
  const palabras = normalize(texto).split(' ').filter(Boolean)
  let reclamado = 0 // hasta qué palabra llega el último nombre ya reportado

  for (let i = 0; i < palabras.length; i += 1) {
    for (let n = Math.min(3, palabras.length - i); n >= 1; n -= 1) {
      if (i < reclamado) break
      const gram = palabras.slice(i, i + n).join(' ')
      const pista = hashes.get(hashOf(gram))
      if (!pista) continue
      reclamado = i + n
      encontrados.push({ gram, pista })
      break
    }
  }
  return encontrados
}

/** Tapa un valor para poder nombrarlo en un log sin publicarlo. */
export function redact(text) {
  if (text.length <= 4) return `${text[0]}${'·'.repeat(text.length - 1)}`
  return `${text.slice(0, 2)}${'·'.repeat(Math.min(text.length - 3, 12))}${text.slice(-1)}`
}
