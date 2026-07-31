---
title: Conceptos
module: Conceptos
audience: [Clientes, Usuarios]
summary: >
  Las ideas que se repiten en todas las pantallas y que ninguna explica del todo: qué
  predice el pronóstico, cómo se arma un sugerido, cuándo están listos los números del día
  y por qué tu instancia no es igual a la de al lado.
keywords: [conceptos, cómo funciona Celes, fundamentos, glosario]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# Conceptos

## Qué hay en esta sección { #que-hay }

El resto de la wiki tiene **una página por pantalla**: qué es, qué puedes hacer ahí y qué
necesita para funcionar. Esta sección es lo otro: **el porqué**. Son las ideas que atraviesan
varias pantallas y que ninguna de ellas puede explicar sola sin repetirse.

Se leen en cualquier orden y no hacen falta para usar el producto. Hacen falta cuando un
número no es el que esperabas y la explicación no está en la pantalla que tienes delante.

## Las páginas { #las-paginas }

| Concepto | Responde a |
|---|---|
| [Filosofía del forecast](filosofia-del-forecast.md) | ¿Qué predice Celes exactamente, y por qué demanda no es lo mismo que venta? |
| [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md) | ¿Por qué comprar y distribuir son dos cálculos distintos, y qué mueve cada número? |
| [Sustitutos y agrupaciones](sustitutos-y-agrupaciones.md) | ¿Cómo se pronostica un producto nuevo, o uno que casi no se vende solo? |
| [Jerarquía de parámetros](jerarquia-de-parametros.md) | Cuando el mismo parámetro está puesto en dos niveles, ¿cuál gana? |
| [Reglas de negocio y plugins](reglas-de-negocio-y-plugins.md) | ¿Dónde se interviene el cálculo, y qué se ve mañana frente a qué se ve ahora? |
| [El ciclo diario de datos](ciclo-diario-de-datos.md) | ¿De cuándo son los números que estoy viendo? |
| [La automatización y sus condiciones](automatizacion-y-sus-condiciones.md) | ¿Qué puede correr solo, y qué lo detiene? |
| [Cómo se construyen los reportes](como-se-construyen-los-reportes.md) | ¿Por qué esta tabla tiene estas columnas y no otras? |
| [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md) | ¿Por qué lo que leo aquí no coincide exactamente con lo que veo? |

Los términos sueltos —qué es una cobertura, un tiempo de entrega, un centro de
distribución— están en el [Glosario](../recursos/glosario.md).

## Por dónde empezar { #por-donde-empezar }

Según qué te haya traído aquí:

- **«No entiendo este sugerido»** → [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md),
  y después [Jerarquía de parámetros](jerarquia-de-parametros.md).
- **«El pronóstico no me cuadra»** → [Filosofía del forecast](filosofia-del-forecast.md), y
  [Sustitutos y agrupaciones](sustitutos-y-agrupaciones.md) si el producto es nuevo.
- **«Esto debería haber cambiado y no cambió»** → [El ciclo diario de datos](ciclo-diario-de-datos.md).
- **«Falta una columna, un filtro o una pantalla»** → [Cómo se construyen los reportes](como-se-construyen-los-reportes.md)
  y [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md).

## El camino completo, en una frase { #el-camino }

Tus sistemas envían los datos; una corrida diaria los prepara, consolida las historias que
hay que consolidar y **pronostica la demanda**; con ese pronóstico, tus parámetros y tus
reglas, Celes calcula **qué comprar y cómo repartir**; tú lo revisas, lo ajustas y lo envías
—o dejas que se envíe solo—; y los reportes miden qué tan bien salió. Cada eslabón de esa
frase tiene su página arriba.
