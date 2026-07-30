---
title: Historial de Órdenes de Compra
module: Reabastecimiento
route: /work-area/procurement/order-history
aliases: []
permission: work-area.procurement
audience: [Clientes, Usuarios]
summary: >
  Las órdenes de compra que ya se enviaron, una por fila, dentro del rango de fechas que
  elijas. Sirve para confirmar que una orden salió, ver quién la envió y con qué cantidad,
  y abrir el detalle de sus productos.
keywords: [historial, órdenes enviadas, orden de compra, auditoría, rango de fechas]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/ProductListOrderHistory/ProductListOrderHistory.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaProcurement/WorkAreaProcurementOrderHistoryPage/WorkAreaProcurementOrderHistoryPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
---

# Historial de Órdenes de Compra

## Qué es y para qué sirve { #que-es }

Es el registro de lo que se envió. Cada fila es una orden de compra con su identificador,
su proveedor, su centro de distribución, quién la creó, cuándo, y las cantidades y el costo
que llevaba.

Responde tres preguntas que aparecen todos los días: *¿esta orden salió?*, *¿quién la
mandó?* y *¿con qué cantidades?*. Es también el sitio al que remite la aplicación cuando
una orden se procesa en segundo plano y quieres saber cómo terminó.

Se llega desde el botón **Ver historial** de [Comprar](comprar.md).

![El historial con una orden por fila y el rango de fechas
arriba.](../assets/screenshots/reabastecimiento/historial-de-ordenes-de-compra.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

- **Elegir el rango de fechas.** El selector de arriba a la derecha abre con **la última
  semana**. Si no aparece nada, lo primero que hay que revisar es si la orden que buscas
  cae fuera de ese rango.
- **Filtrar y buscar.** Los filtros de la aplicación se combinan con el rango, y la
  búsqueda rápida sirve para localizar un identificador o un proveedor concreto.
- **Ver los productos de una orden.** La acción de cada fila abre el detalle: las líneas
  que llevaba esa orden, producto por producto.
- **Totalizar todas las páginas** con el interruptor del pie, para que la fila de totales
  sume el resultado completo.
- **Exportar a Excel** el resultado, para conciliarlo con el sistema donde entra la compra.

## Qué necesita para funcionar { #requisitos }

- **Órdenes enviadas dentro del rango.** Una tabla vacía casi siempre significa un rango
  demasiado corto, no una orden perdida.
- **El permiso `work-area.procurement`** en lectura.
- Que la orden **haya terminado de procesarse**: entre el envío y su aparición aquí puede
  pasar un rato, porque el envío se resuelve en segundo plano.

## Conceptos relacionados { #conceptos }

- [Creación de Orden de Compra](creacion-de-orden-de-compra.md)
- [Trazabilidad de entregas](trazabilidad-de-entregas.md) — qué pasó con el archivo que se
  le mandó al cliente, que es la pregunta siguiente a «¿la orden salió?»
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
