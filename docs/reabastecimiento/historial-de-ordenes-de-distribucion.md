---
title: Historial de Órdenes de Distribución
module: Reabastecimiento
route: /work-area/replenishment/order-history
aliases: []
permission: work-area.replenishment
audience: [Clientes, Usuarios]
summary: >
  Las órdenes de distribución que ya se enviaron, una por fila, dentro del rango de fechas
  que elijas. Sirve para confirmar que un despacho salió, ver quién lo envió y con qué
  cantidad, y abrir el detalle de sus productos.
keywords: [historial, órdenes enviadas, distribución, despacho, rango de fechas]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/ProductListOrderHistory/ProductListOrderHistory.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/WorkAreaReplenishmentOrderHistoryPage/WorkAreareplenishmentOrderHistoryPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
---

# Historial de Órdenes de Distribución

## Qué es y para qué sirve { #que-es }

Es el registro de los despachos enviados. Cada fila es una orden de distribución con su
identificador, la bodega de destino, el centro que la surte, quién la creó, cuándo, y las
cantidades enviadas frente a las que Celes recomendaba.

Esa última comparación es la que más se usa: en la misma fila conviven **lo enviado** y **lo
recomendado**, así que el historial sirve para medir adherencia sin salir de la pantalla.

Se llega desde el botón **Ver historial** de [Distribuir](distribuir.md).

![El historial de distribución, con lo enviado y lo recomendado en la misma
fila.](../assets/screenshots/reabastecimiento/historial-de-ordenes-de-distribucion.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

- **Elegir el rango de fechas.** Abre con **la última semana**; una tabla vacía suele ser
  un rango corto, no un despacho perdido.
- **Filtrar y buscar** por bodega, centro o identificador de orden.
- **Ver los productos de una orden** con la acción **Ver detalles** de cada fila.
- **Totalizar todas las páginas** con el interruptor del pie.
- **Exportar a Excel** el resultado.

!!! tip "Aquí se comprueba el candado"

    Cuando una línea aparece bloqueada en
    [Solicitud de Distribución](solicitud-de-distribucion.md), es porque ya se envió hoy.
    Este historial es donde se comprueba **qué** se envió y **cuánto**, antes de decidir si
    hace falta desbloquearla y reenviar.

## Qué necesita para funcionar { #requisitos }

- **Despachos enviados dentro del rango** seleccionado.
- **El permiso `work-area.replenishment`** en lectura.
- Que la orden **haya terminado de procesarse**: el envío se resuelve en segundo plano y
  tarda un momento en aparecer.

## Conceptos relacionados { #conceptos }

- [Solicitud de Distribución](solicitud-de-distribucion.md)
- [Trazabilidad de entregas](trazabilidad-de-entregas.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
