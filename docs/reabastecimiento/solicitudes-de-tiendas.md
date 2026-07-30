---
title: Solicitudes de Tiendas
module: Reabastecimiento
route: /work-area/replenishment-suggestions
aliases: []
permission: work-area.replenishment-suggestions
audience: [Clientes, Usuarios]
summary: >
  Es la pantalla desde la que cada punto de venta pide lo que necesita: se elige la bodega,
  se escribe la cantidad producto por producto y se guarda. La solicitud queda registrada y
  entra al proceso de distribución; no despacha nada por sí sola.
keywords: [solicitudes de tiendas, pedido de tienda, bodega, solicitud, distribución]
tenant_variance: high
status: draft
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishmentSuggestionsPage/WorkAreaReplenishmentSuggestionsPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/api-core/src/inventory/interfaces/api/orders/resources.py
    ref: d20adaaea
  - repo: celes-platform
    path: apps/api-core/src/inventory/application/orders/service.py
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
---

# Solicitudes de Tiendas

!!! warning "Falta la captura"

    El texto de esta página está verificado contra el código, pero todavía no lleva
    captura: la instancia con la que se toman las capturas no tiene esta pantalla
    configurada, y publicar una imagen de una pantalla sin columnas documentaría un
    problema de configuración en vez del producto. Por eso queda como **borrador**.

## Qué es y para qué sirve { #que-es }

En [Distribuir](distribuir.md) es el centro quien decide qué mandar. Aquí es al revés: es
**la tienda la que pide**. Cada punto de venta abre esta pantalla, elige su bodega y anota,
producto por producto, la cantidad que quiere recibir.

Lo que se guarda es una **solicitud**, no un despacho. Queda registrada con tu usuario, la
fecha y la bodega, y entra al proceso de distribución como una petición más que se tiene en
cuenta al armar el reparto. La orden sigue saliendo desde
[Solicitud de Distribución](solicitud-de-distribucion.md).

Es la pantalla que usan las cadenas donde el punto de venta conoce algo que el modelo no
ve: un evento local, una exhibición, un cliente grande que avisó.

## Qué puedes hacer aquí { #que-puedes-hacer }

- **Elegir la bodega.** El selector de la barra de herramientas lista las bodegas a las que
  tienes acceso, y al lado quedan a la vista su código y su nombre para no equivocarse. Sin
  bodega elegida la tabla no muestra productos: eso es lo que dice el mensaje *«Selecciona
  una bodega para ver los productos»*.
- **Escribir la cantidad** en la columna **Cantidad**, que es editable. La tabla deja fijas
  a la izquierda las columnas que identifican el producto, para no perderse al desplazarse.
- **Guardar cambios.** El botón guarda lo que hayas modificado; hasta entonces nada queda
  registrado.
- **Cargar un archivo Excel**, si tienes el permiso
  `work-area.replenishment-suggestions.upload`, para pedir en bloque en vez de a mano. Al
  terminar, la aplicación informa del resultado de la carga.
- **Exportar** la lista a Excel o CSV.

!!! warning "Cambiar de bodega o de página descarta lo no guardado"

    La aplicación pregunta antes de cambiar la bodega, el orden o la página si tienes
    cantidades escritas sin guardar. Guarda antes de moverte.

## Qué necesita para funcionar { #requisitos }

- **El permiso `work-area.replenishment-suggestions`** en lectura para ver la pantalla y en
  escritura para pedir.
- **Acceso a la bodega**: solo aparecen las bodegas que tu usuario tenga asignadas.
- **Columnas configuradas para esta pantalla.** Si la lista aparece sin columnas, no es que
  no haya productos: es que la pantalla no está configurada para tu empresa.
- **Que tu operación use solicitudes de tienda.** Es un flujo opcional; muchas cadenas
  distribuyen solo con el sugerido central.

## Conceptos relacionados { #conceptos }

- [Distribuir](distribuir.md)
- [Solicitud de Distribución](solicitud-de-distribucion.md)
- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
