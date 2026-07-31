---
title: Sustitutos y agrupaciones
module: Conceptos
audience: [Clientes, Usuarios]
summary: >
  Un producto nuevo no tiene historia, pero su demanda casi siempre sí: venía de otro
  código o pertenece a una familia que ya se vende. Sustitutos y agrupaciones son las dos
  formas de decírselo a Celes para que el pronóstico no empiece de cero.
keywords: [sustitutos, agrupación, sintéticos, historia, demanda, vigencia, secuencia]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationSubstituteProducts/AdministrationSubstituteProductsPage/AdministrationSubstituteProductsPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationGroupingProducts/AdministrationGroupingProductDetailPage/AdministrationGroupingProductDetailPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/components/SuggestionExplanation/StageSelector.tsx
    ref: d0a73d245
---

# Sustitutos y agrupaciones

## El problema: la historia se rompe { #el-problema }

El pronóstico aprende de la historia. Hay dos situaciones habituales en las que esa
historia existe pero no está donde el modelo la busca:

- **El producto cambió de código.** Un rebranding, un cambio de proveedor, una referencia
  que se descontinúa y otra que la reemplaza. Para el sistema son dos productos; para el
  cliente que lo compra, es el mismo.
- **El producto solo tiene señal en conjunto.** Una talla concreta de una camisa se vende
  de forma intermitente; la camisa —todas sus tallas y colores— se vende todos los días.

En los dos casos, pronosticar el producto aislado da un resultado pobre: o arranca de cero,
o intenta modelar un ruido. La solución es la misma en espíritu: **consolidar la demanda en
una serie que sí tenga señal, pronosticar ahí, y devolver el resultado al detalle**.

## Las dos herramientas { #las-dos }

| | Sustitución | Agrupación |
|---|---|---|
| **Responde a** | Este producto reemplaza a aquel | Estos productos son la misma cosa a efectos de demanda |
| **Se define en** | [Sustitutos](../activacion/sustitutos.md) | [Productos de Agrupación](../activacion/productos-de-agrupacion.md) |
| **Se declara** | Un origen y un destino, concretos | Un criterio: por qué columnas se agrupa y qué productos entran |
| **Caso típico** | Cambio de código o de referencia | Familias, tallas, colores, presentaciones |

### Sustitución { #sustitucion }

Se declara un **producto origen** y un **producto destino** —y, según el tipo, también una
bodega origen y una destino—. Hay dos tipos: sustituir un producto por otro **dentro de una
misma tienda**, o sustituir una **bodega completa**, cuando lo que se reemplaza es el punto
y no la referencia.

Tres cosas que definen el resultado:

- **La vigencia.** Toda sustitución tiene fecha de inicio y, opcionalmente, de fin; la
  aplicación la muestra como *Vigente*, *Programada* o *Vencida*. Una sustitución
  programada para el mes que viene todavía no está moviendo nada.
- **El porcentaje de sustitución.** Cuánto de la demanda del origen se le atribuye al
  destino. No siempre es todo: un producto puede repartirse entre dos sucesores.
- **El múltiplo de empaque.** Corrige la equivalencia cuando el destino no viene en la
  misma presentación que el origen. Sin él, «una unidad de aquel» y «una unidad de este»
  no son la misma cantidad de producto.

La aplicación valida que ambos productos existan en las bodegas seleccionadas y avisa
—antes de guardar— de las que va a excluir porque el producto no existe ahí.

### Agrupación { #agrupacion }

Una agrupación no nombra productos uno por uno: los describe. Se define con

- **Filtros** que dicen qué productos entran (por ejemplo, categoría *camisas* y color
  *rojo*): un producto entra cuando cumple **todos** los filtros;
- un **orden de agrupación**, la lista de columnas por las que se agrupa, donde **el orden
  define la jerarquía**;
- una **secuencia**, que resuelve el empate cuando un producto cae en más de una
  agrupación: se procesa antes la de secuencia menor;
- una **agregación** por columna —suma o promedio— para consolidar los valores;
- **porcentaje**, **múltiplo de empaque** y **fechas de vigencia**, con el mismo papel que
  en la sustitución.

Las dos pantallas admiten **importación masiva** por archivo, con plantilla descargable. La
opción de sobrescribir es destructiva: reemplaza la configuración existente de la misma
referencia.

## Qué pasa después, y qué vas a ver { #consecuencias }

Consolidar la demanda tiene un efecto visible que conviene anticipar, porque parece un
error y no lo es:

!!! warning "El producto individual puede aparecer sin pronóstico propio"

    Cuando la demanda de un producto se consolida en otra serie, **el pronóstico se calcula
    sobre la serie consolidada**, no sobre el producto suelto. En un tablero que liste
    productos pronosticables, ese producto puede salir como no pronosticable. Su demanda no
    se perdió: está contada una vez, en el lugar donde se pronosticó. Contarla en los dos
    sitios sería duplicarla.

Lo mismo explica por qué la consolidación ocurre **antes** que el cálculo del sugerido: en
la secuencia diaria, las etapas de *Sustitutos* y *Sintéticos* corren antes que las de
distribución y compra, de modo que el reabastecimiento ya trabaja con la historia
consolidada. Ver [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md).

## Cuándo se nota un cambio { #cuando-se-nota }

Crear o editar una sustitución o una agrupación no recalcula nada en el momento: se aplica
en la siguiente corrida diaria. Si la vigencia empieza más adelante, se aplicará a partir de
esa fecha. Ver [El ciclo diario de datos](ciclo-diario-de-datos.md).

## Cómo elegir entre las dos { #como-elegir }

- ¿Puedes nombrar el producto que reemplaza a cuál? → **sustitución**.
- ¿Lo que tienes es un criterio —una familia, una categoría, una variante— y no una pareja?
  → **agrupación**.
- ¿El producto viejo y el nuevo conviven un tiempo? → sustitución con **porcentaje** y con
  la **vigencia** ajustada al periodo de convivencia.

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](filosofia-del-forecast.md)
- [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md)
