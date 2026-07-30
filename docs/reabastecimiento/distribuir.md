---
title: Distribuir
module: Reabastecimiento
route: /work-area/replenishment
aliases: []
permission: work-area.replenishment
audience: [Clientes, Usuarios]
summary: >
  Distribuir es la lista de todo lo que Celes sugiere mandar desde los centros de
  distribución hacia las tiendas, agrupada como trabajas. Desde aquí se elige un grupo y se
  pasa a armar su solicitud de distribución.
keywords: [distribuir, distribución, reparto, sugerido, tienda, centro de distribución]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/ProductList/ProductList.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/WorkAreaReplenishmentPage/WorkAreaReplenishmentPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/helpers.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
---

# Distribuir

## Qué es y para qué sirve { #que-es }

Es la pantalla del reparto. Con lo que ya está dentro de la cadena, Celes calcula **cuánto
mandarle a cada tienda**: cuánta demanda tiene que cubrir cada punto en su ventana de
reposición, cuánto inventario le queda, cuánto hay disponible en el centro de distribución
y cómo repartirlo cuando no alcanza para todos.

La lógica es distinta a la de compra y conviene tenerlo presente: comprar decide *cuánto
traer*; distribuir decide *cómo repartir lo que hay*. Cuando el centro no tiene suficiente,
el cálculo entra en una etapa de escasez y reparte con criterio en vez de servir a quien
llegue primero. La comparación completa está en
[Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md).

Como en Comprar, la lista se lee **agrupada** —una solicitud se manda desde un centro— y al
elegir un grupo se pasa a [Solicitud de Distribución](solicitud-de-distribucion.md).

![La lista de distribución agregada, con su selector de agrupación y sus
totales.](../assets/screenshots/reabastecimiento/distribuir.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

Lo mismo que en [Comprar](comprar.md), sobre otros números:

- **Agrupar** con el selector de la barra de herramientas, según lo configurado para tu
  empresa. La acción **Generar Orden** de cada fila aparece cuando hay agrupación y abre la
  solicitud de ese grupo, arrastrando los filtros activos.
- **Filtrar**, con los filtros de la aplicación y con el selector de filtros rápidos de la
  barra de la tabla —*Solo productos con sugerencias* y *Solo productos sin enviar*—.
- **Totalizar** todas las páginas con el interruptor **Agregado total**.
- **Exportar** a Excel o CSV las columnas que elijas.
- **Ver historial**, que lleva al
  [Historial de Órdenes de Distribución](historial-de-ordenes-de-distribucion.md).

!!! tip "Los centros de distribución no se surten aquí"

    Esta pantalla reparte *desde* los centros *hacia* los puntos de venta. Reponer el
    propio centro es una compra, y se hace en [Comprar](comprar.md). Si echas de menos un
    nodo en la lista, lo primero que hay que mirar es si ese nodo es un centro y no una
    tienda.

## Qué necesita para funcionar { #requisitos }

- **El procesamiento del día terminado**, igual que en Comprar: la fecha de **Última
  ejecución exitosa** dice de cuándo son los números.
- **Las relaciones de surtido**: qué centro surte a qué tienda y con qué prioridad. Un
  punto de venta sin centro asignado no recibe sugerido.
- **Los parámetros de distribución** —periodo de revisión, tiempo del último tramo,
  mínimos, múltiplos y capacidades—, que son la política que el reparto respeta.
- **Una agrupación configurada** para que la lista consulte algo.
- **El permiso `work-area.replenishment`**, en lectura para ver la pantalla.

## Cómo leer los colores { #colores }

El mismo semáforo de Comprar: **verde** cuando lo ya pedido alcanza o supera el sugerido,
**naranja** cuando se quedó corto, y sin color cuando todavía no se ha pedido nada.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md)
- [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
