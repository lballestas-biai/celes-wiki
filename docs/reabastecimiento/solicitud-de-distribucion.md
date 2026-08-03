---
title: Solicitud de Distribución
module: Reabastecimiento
route: /work-area/replenishment/order
aliases: []
permission: work-area.replenishment
audience: [Clientes, Usuarios]
summary: >
  Es la mesa de trabajo del reparto: los productos de un centro con la cantidad sugerida
  para cada tienda en una celda editable. Aquí se ajusta, se guarda el avance y se envía la
  orden de distribución.
keywords: [solicitud de distribución, reparto, cantidad, enviar orden, cubicaje, vaciar cedi]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/ProductListOrder/ProductListOrder.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaReplenishment/WorkAreaReplenishmentOrderPage/WorkAreaReplenishmentOrderPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/OrderPluginsSelector.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
---

# Solicitud de Distribución

## Qué es y para qué sirve { #que-es }

Es la pantalla donde el reparto se convierte en un pedido concreto. Se llega desde
[Distribuir](distribuir.md) con **Generar Orden** sobre un grupo, y se abre acotada a él:
arriba quedan sus datos y la tabla trae solo sus líneas.

Cada fila es un producto para un destino. La columna **Cantidad** llega con el sugerido de
Celes y es editable; lo que quede ahí es lo que se va a mandar. Alrededor están las cifras
para decidir: la demanda a cubrir de esa tienda, su inventario y el del centro, lo que está
en tránsito, los múltiplos de despacho y —cuando la tienda ya pidió por su cuenta— lo que
pidió.

![La solicitud de distribución, con las cantidades editables, el candado de lo ya enviado y
«Enviar Orden de Distribución».](../assets/screenshots/reabastecimiento/solicitud-de-distribucion.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

Lo mismo que en la orden de compra —ajustar, entender, restringir, guardar y enviar— más
dos cosas propias del reparto: el bloqueo de lo que ya se despachó y el plugin de vaciado
del centro.

### Ajustar cantidades { #ajustar-cantidades }

Se edita sobre la celda **Cantidad**, con las mismas ayudas que en la orden de compra:
selección por filas, totales al pie, el filtro rápido *solo productos con sugerencias* y el
interruptor *seleccionar todos los productos*, que abarca el resultado completo y no solo
la página. En algunas empresas ese interruptor viene activado de entrada.

Si el resultado trae familias de sintéticos o sustitutos, el interruptor **Agrupador** las
junta bajo su producto padre; las filas de familia son informativas.

### Lo que ya se envió queda bloqueado { #lo-ya-enviado }

Una línea que ya se despachó hoy aparece con un **candado** y no se puede editar. Es la
protección contra el doble despacho.

Quien tenga el permiso `work-area.replenishment.order.unlock-sent` ve el candado como un
botón y puede abrir una línea concreta, o abrirlas todas con **Desbloquear todos los
enviados**. El desbloqueo dura lo que dure la sesión en la pantalla.

Si aun así se manda algo repetido, la aplicación avisa antes: puedes **enviar solo los
nuevos** o **forzar el envío de todos**.

### Entender un sugerido { #entender-un-sugerido }

**Quiero saber más** abre la ficha **Detalles del Producto** con el **Detalle de
Recomendación de Distribución**: la explicación por etapas de cómo salió la cifra —la
demanda a cubrir, el inventario inicial de la tienda, las entradas esperadas, el reparto
por escasez cuando el centro no alcanza, la asignación entre centros— y los parámetros
usados.

### Aplicar una restricción o un plugin { #restricciones-y-plugins }

El selector de **plugins** trae los que tengas permitidos:

| Plugin | Qué hace |
|---|---|
| **Restricción de Presupuesto** | Reparte un presupuesto máximo entre los productos filtrados según el criterio que elijas |
| **Restricción de Dimensiones** | Ajusta a un máximo (y un mínimo opcional) de cajas, peso o volumen |
| **Cálculo de Cubicaje** | Reparte lo que se va a despachar en camiones, respetando volumen, peso y valor |
| **Sobreescribir Cantidad** | Pone la misma cantidad en todos los productos filtrados |
| **Vaciar CEDI** | Reparte el excedente del centro entre los destinos filtrados, sobrescribiendo las cantidades sugeridas |

**Vaciar CEDI** existe solo en distribución, y aplica a **todos** los centros incluidos en
los filtros activos: conviene revisar el alcance antes de confirmar.

### Guardar, enviar y cargar un Excel { #guardar-enviar-excel }

- **Guardar solo modificados** —y **Guardar todo** en su menú— conserva el avance sin
  despachar nada.
- **Enviar Orden de Distribución** pide confirmación con el número de productos y de
  unidades, y procesa en segundo plano; el resultado queda en el
  [Historial de Órdenes de Distribución](historial-de-ordenes-de-distribucion.md).
- **Cargar archivo Excel** crea las líneas desde un archivo, con una plantilla descargable.
  Si el archivo tiene errores, la aplicación los enumera y deja volver a cargarlo.

!!! warning "Cambiar el filtro descarta lo que no se ha guardado"

    Cambiar filtros u ordenamiento vuelve a consultar y pierde las cantidades escritas. La
    aplicación pregunta antes de hacerlo.

## Qué necesita para funcionar { #requisitos }

- **Haber entrado desde un grupo de [Distribuir](distribuir.md)**, para que la pantalla
  esté acotada a una orden concreta.
- **El permiso `work-area.replenishment`**: lectura para ver, escritura para editar y
  guardar, ejecución para enviar.
- **`work-area.replenishment.order.unlock-sent`** si necesitas reeditar lo ya enviado.
- **Los parámetros de distribución y de despacho** —múltiplos, mínimos, capacidades—, que
  son lo que la orden respeta.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md)
- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md)
- [Solicitudes de Tiendas](solicitudes-de-tiendas.md)
