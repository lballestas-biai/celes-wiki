---
title: Creación de Orden de Compra
module: Reabastecimiento
route: /work-area/procurement/order
aliases: []
permission: work-area.procurement
audience: [Clientes, Usuarios]
summary: >
  Es la mesa de trabajo de la compra: la lista de productos de un proveedor y un centro,
  con la cantidad sugerida por Celes en una celda editable. Aquí se ajusta línea por línea,
  se guarda el avance y se envía la orden.
keywords: [orden de compra, cantidad, enviar orden, borrador, restricciones, plugins]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/ProductListOrder/ProductListOrder.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaProcurement/WorkAreaProcurementOrderPage/WorkAreaProcurementOrderPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/OrderPluginsSelector.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
---

# Creación de Orden de Compra

## Qué es y para qué sirve { #que-es }

Aquí se arma la orden. Se llega desde [Comprar](comprar.md), con **Generar Orden** sobre un
grupo, y la pantalla se abre acotada a ese grupo: arriba a la izquierda quedan sus datos
—el centro, el proveedor— y la tabla trae solo sus productos, con los filtros que traías
puestos.

Cada fila es una línea del pedido. La columna **Cantidad** es editable y llega con el
sugerido de Celes; lo que quede ahí es lo que se va a pedir. El resto de columnas están
para decidir: inventario actual, en tránsito y ordenado, días de cobertura, demanda
pronosticada, mínimos y múltiplos del proveedor, costo estimado.

![La mesa de trabajo de la compra: cantidades editables, totales y el botón «Enviar Orden
de Compra».](../assets/screenshots/reabastecimiento/creacion-de-orden-de-compra.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

Cinco cosas, en el orden en que suelen hacerse: ajustar las cantidades, entender de dónde
sale un sugerido, aplicar una restricción a todo el pedido, guardar el avance y enviar.

### Ajustar cantidades

Escribe sobre la celda **Cantidad**. Puedes seleccionar filas con la casilla de la
izquierda y trabajar solo sobre esas; el pie de la tabla muestra cuántas llevas
seleccionadas y la suma de lo que vas a pedir.

En el menú de **Filtros rápidos** hay dos interruptores que cambian el alcance del trabajo:

- *Solo productos con sugerencias* — deja a la vista lo que hay que pedir.
- *Seleccionar todos los productos* — selecciona el resultado **completo**, no solo la
  página. Al activarlo, la pantalla totaliza todas las páginas y deja de permitir
  deseleccionar filas sueltas: o va todo, o se apaga el interruptor.

Si el resultado trae familias de productos —sintéticos o sustitutos—, el interruptor
**Agrupador** las junta bajo su producto padre. Las filas de familia son informativas: no
se seleccionan ni se editan.

### Entender un sugerido

La acción **Quiero saber más** de cada fila abre la ficha **Detalles del Producto**, con el
histórico del producto en ese destino y el **Detalle de Recomendación de Compra**: la
explicación, etapa por etapa, de cómo se llegó a esa cifra —la demanda a cubrir, el
inventario inicial, las entradas esperadas, los múltiplos aplicados— y con qué parámetros.
Desde ahí también se puede corregir la cantidad sin cerrar la ficha.

### Aplicar una restricción o un plugin

El selector de **plugins** aplica una operación sobre todo lo que está filtrado. Cada uno
depende de un permiso propio, así que verás solo los que tengas concedidos:

| Plugin | Qué hace |
|---|---|
| **Restricción de Presupuesto** | Reparte un presupuesto máximo del proveedor entre los productos, priorizando por cobertura, velocidad de venta, venta en dinero o prioridad configurada |
| **Restricción de Dimensiones** | Ajusta las cantidades a un máximo (y un mínimo opcional) de cajas, peso o volumen |
| **Cálculo de Cubicaje** | Reparte los productos en camiones respetando volumen, peso y valor, y permite armarlos a mano |
| **Sobreescribir Cantidad** | Pone la misma cantidad en todos los productos filtrados |

Debajo de la barra de herramientas, el bloque de **Restricciones** muestra las que ya
aplican a esta orden por parámetros —mínimos de pedido, múltiplos de compra, peso mínimo—.

### Guardar sin enviar

El botón **Guardar solo modificados** conserva el avance sin mandar nada; su menú ofrece
además **Guardar todo**. Es lo que permite dejar una orden a medias y retomarla.

### Enviar

**Enviar Orden de Compra** pide confirmación mostrando cuántos productos y cuántas unidades
van, la fecha de la orden y la **fecha y hora de entrega esperada**. Al confirmar, la orden
se procesa en segundo plano: puedes seguir navegando y el resultado aparece en el
[Historial de Órdenes de Compra](historial-de-ordenes-de-compra.md).

Si algunos productos ya se enviaron hoy, la aplicación avisa antes de duplicar y deja
elegir entre **enviar solo los nuevos** o **forzar el envío de todos** —esto último, solo
con permiso para hacerlo—.

### Cargar un Excel

Cuando tu usuario tiene el permiso `work-area.procurement.order.upload`, aparece **Cargar
archivo Excel**, que crea las líneas de la orden desde un archivo en vez de a mano.

!!! warning "Cambiar el filtro descarta lo que no se ha guardado"

    Cambiar filtros u ordenamiento vuelve a consultar los datos y pierde las cantidades que
    hayas escrito. La aplicación pregunta antes; si vas a reordenar la tabla, guarda primero.

## Qué necesita para funcionar { #requisitos }

- **Haber entrado desde un grupo de [Comprar](comprar.md)**. Se puede abrir la pantalla
  directamente, pero entonces no está acotada a ninguna orden concreta.
- **El permiso `work-area.procurement`**: de lectura para ver la pantalla, de escritura
  para editar y guardar, y de ejecución para enviar. Se puede tener uno y no el otro.
- **Los parámetros del proveedor** —mínimo de pedido, múltiplo de compra, tiempo de
  entrega—, que son lo que la orden respeta al calcular y al validar.
- **Los permisos de cada plugin**, si esperas verlos en el selector.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md)
- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
