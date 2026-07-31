---
title: Sugerido de compra vs. de distribución
module: Conceptos
audience: [Clientes, Usuarios]
summary: >
  Celes calcula dos recomendaciones distintas a partir de la misma demanda pronosticada:
  cuánto traer de un proveedor y cómo repartir lo que ya está dentro de la cadena. Esta
  página explica en qué se parecen, en qué no, y por qué un producto puede tener las dos.
keywords: [sugerido, compra, distribución, recomendación, escasez, múltiplos, cobertura]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/components/SuggestionExplanation/Table/ReplenishmentTable.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/components/SuggestionExplanation/Table/ProcurementTable.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/components/SuggestionExplanation/StageSelector.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/inventory/application/orders/service.py
    ref: d0a73d245
---

# Sugerido de compra vs. de distribución

## Dos preguntas, no una { #dos-preguntas }

Todos los días hay que responder dos cosas, y no son la misma:

- **¿Qué le pido al proveedor?** Es traer inventario nuevo a la cadena. Se decide por
  centro de distribución y proveedor, y se materializa en una orden de compra.
- **¿Cómo reparto lo que ya tengo?** Es mover inventario que ya está dentro, del centro
  hacia las tiendas. Se decide por centro y se materializa en una solicitud de
  distribución.

Las dos parten de la misma demanda pronosticada, y ahí acaba el parecido. La compra puede
pedir lo que haga falta —el límite lo pone el proveedor, el presupuesto o el camión—. La
distribución **no puede inventar inventario**: si el centro no tiene suficiente para todas
las tiendas, alguna recibe menos. Esa diferencia explica casi todo lo demás.

Por eso [Comprar](../reabastecimiento/comprar.md) y
[Distribuir](../reabastecimiento/distribuir.md) son dos pantallas y no dos pestañas de
una, y por eso reponer un centro de distribución es una **compra**, aunque el producto
venga de otro nodo de la propia cadena.

## El esqueleto que comparten { #esqueleto }

Las dos recomendaciones se construyen proyectando el inventario en el tiempo hasta la
siguiente oportunidad de pedir, y preguntando cuánto falta para llegar hasta ahí sin
quebrarse:

1. **De cuánto se parte** — el inventario disponible en el punto, más lo que ya viene en
   camino y lo que se ordenó y aún no llega.
2. **Cuánto se va a ir** — la demanda pronosticada del periodo que hay que cubrir.
3. **Con cuánto hay que llegar al final** — el colchón que exige la política de la
   empresa: inventario de seguridad, mínimos de exhibición, coberturas.
4. **Cuánto pedir, entonces** — la diferencia, ajustada a lo que es físicamente pedible:
   múltiplos de empaque, mínimos de proveedor, capacidades.

El paso 4 es el que más sorprende. Un faltante de 7 unidades con un empaque de 12 no se
convierte en 7: se convierte en 12 o en 0, según la política. Cuando un número no cuadra
con la cuenta hecha a mano, el múltiplo suele ser la explicación.

!!! tip "Celes te enseña la cuenta"

    En las pantallas de compra y distribución, cada producto tiene un **Detalle de
    Recomendación** que muestra esa proyección: el inventario inicial, la demanda del
    periodo, las entradas previstas, el inventario final y el pedido sugerido que
    resulta, para hoy y para el próximo pedido. Es el primer lugar donde mirar antes de
    preguntar por qué el número es ese.

## En qué se diferencian { #diferencias }

| | Compra | Distribución |
|---|---|---|
| **Qué decide** | Cuánto traer a la cadena | Cómo repartir lo que ya está dentro |
| **De dónde sale** | Un proveedor | Un centro de distribución |
| **A dónde llega** | Un centro de distribución | Tiendas y puntos de venta |
| **Qué la limita** | Presupuesto, mínimos del proveedor, capacidad de transporte | El inventario disponible en el centro |
| **Qué demanda cubre** | La de toda la red que ese centro surte | La de cada punto en su ventana de reposición |
| **Cuando no alcanza** | Se pide más, o se pide después | Se reparte con criterio: es la etapa de escasez |

La consecuencia práctica: en compra, el número grande es una decisión de dinero; en
distribución, es una decisión de **prioridad entre tiendas**.

Se nota también en lo que cada detalle muestra. El de compra razona sobre el juego de
inventario del centro —lo que entra, lo que se traslada a tiendas, el stock de seguridad—
y permite desplegar las tiendas que hay detrás de esa cifra. El de distribución razona
sobre una tienda concreta y su ventana de reposición.

## La etapa de escasez { #escasez }

Cuando el centro no tiene lo suficiente para servir todo lo que las tiendas necesitan, el
cálculo no reparte por orden de llegada ni recorta un porcentaje parejo. Entra una etapa
específica —la de **escasez**— que decide quién recibe qué con el inventario que hay.

Saber que esa etapa existe cambia cómo se lee una lista de distribución: un sugerido más
bajo de lo esperado en una tienda no significa que su demanda esté mal calculada. Puede
significar que el centro estaba corto y el reparto ya tomó una decisión.

## Un cálculo en etapas, y configurable { #etapas }

Ni la compra ni la distribución son una sola fórmula. Cada una es una **secuencia de
etapas** que se ejecutan en orden, y el Detalle de Recomendación deja ver por cuáles pasó
el producto que estás mirando:

| Etapa | Qué resuelve |
|---|---|
| **Sustitutos** y **Sintéticos** | Consolidan la historia de productos que se reemplazan o se agrupan, para que haya señal que pronosticar. Ver [Sustitutos y agrupaciones](sustitutos-y-agrupaciones.md) |
| **Distribución** | Calcula el sugerido de cada punto de venta |
| **Escasez** | Reparte cuando el centro no alcanza |
| **Asignación CD** | Resuelve el reparto entre centros de distribución |
| **Compra** | Calcula qué pedirle al proveedor |

Qué etapas tiene tu instancia, y con qué pasos, se configura en
[Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md). Es la razón
por la que dos empresas con los mismos datos pueden obtener sugeridos distintos, y por la
que esta página describe la forma del cálculo y no una fórmula cerrada.

## Qué puede cambiar el número { #que-lo-cambia }

Antes de concluir que un sugerido está mal, estas son las palancas que lo mueven, en orden
de frecuencia:

- **Los parámetros** —cobertura, tiempos de entrega, nivel de servicio, mínimos,
  múltiplos—, que pueden estar puestos a un nivel de detalle distinto del que crees. Ver
  [Jerarquía de parámetros](jerarquia-de-parametros.md).
- **El pronóstico**, si la demanda estimada del periodo no es la que esperabas. Ver
  [Filosofía del forecast](filosofia-del-forecast.md).
- **Las reglas de negocio**, que pueden dejar un producto fuera de comprarse o
  distribuirse. Ver [Reglas de negocio y plugins](reglas-de-negocio-y-plugins.md).
- **La fecha del cálculo**: el sugerido es el del último procesamiento terminado, no el
  del minuto actual. Ver [El ciclo diario de datos](ciclo-diario-de-datos.md).

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](filosofia-del-forecast.md)
- [Jerarquía de parámetros](jerarquia-de-parametros.md)
- [Reglas de negocio y plugins](reglas-de-negocio-y-plugins.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Comprar](../reabastecimiento/comprar.md) y [Distribuir](../reabastecimiento/distribuir.md)
