---
title: Balanceo de Inventario
module: Reportes
route: /reports-and-analytics/inventory-balancing
aliases: [/work-area/inventory-balancing, /work-area/inventory-balancing/details]
permission: reports-and-analytics.inventory-balancing
audience: [Clientes, Usuarios]
summary: >
  Balanceo de Inventario lista el producto que sobra en cada bodega —cuánto, cuánto cuesta
  tenerlo ahí y cuánto se vende al día— y, para cada línea, qué otras bodegas lo necesitan.
  Es la pantalla del inventario que no falta: está mal ubicado.
keywords: [balanceo, sobreinventario, excedente, traslado, bodega, costo de sobreinventario]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaInventoryBalancing/WorkAreaInventoryBalancingPage/WorkAreaInventoryBalancingPage.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaInventoryBalancing/WorkAreaInventoryBalancingPage/components/InventoryBalancingSummary/InventoryBalancingSummary.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaInventoryBalancing/WorkAreaInventoryBalancingDetailsPage/WorkAreaInventoryBalancingDetailsPage.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.work-area.inventory-balancing.index.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: bacaa614e
---

# Balanceo de Inventario

## Qué es y para qué sirve { #que-es }

Hay una clase de problema que no se arregla comprando: el producto ya está en la empresa,
pero en el sitio equivocado. Sobra en una bodega, donde se va a quedar quieto hasta que se
venda o se dañe, y falta en otra, donde se está perdiendo la venta hoy.

Esta pantalla pone esa lista sobre la mesa. Cada fila es **un producto en una bodega** con
más inventario del que va a necesitar, con el excedente cuantificado en unidades y en
dinero. Y de cada fila cuelga la otra mitad de la respuesta: **quién lo necesita**, para que
la decisión no sea «hay que sacar esto de aquí» sino «esto va a estas tiendas».

![Balanceo de Inventario: la barra de indicadores arriba y la lista de producto y bodega con
excedente, ordenada por la cantidad que
sobra.](../assets/screenshots/reportes/balanceo-de-inventario.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Medir el tamaño del problema.** La barra de arriba resume **lo que hay bajo los filtros
que tengas puestos**, no el total de la empresa: cuántos productos están en sobreinventario,
cuánto inventario hay en bodega y en tránsito, cuánto de eso sobra y **cuánto cuesta** —el
costo del sobreinventario es la cifra con la que se justifica mover algo—, más la demanda
diaria promedio. Filtra por una categoría y la barra se recalcula con ella.

**Ordenar por lo que más pesa.** La tabla se ordena por cualquier columna: por cantidad
excedente para atacar el volumen, por costo para atacar el dinero inmovilizado. No es lo
mismo: mil unidades de un producto barato pueden estorbar menos que veinte de uno caro.

**Ver quién lo necesita.** **Ver detalles**, al final de la fila, abre la otra cara del
problema: para ese producto, la lista de bodegas que lo están pidiendo, con el **sugerido de
distribución** de cada una. La cabecera te recuerda de qué producto y de qué bodega vienes,
y cuánto era el excedente.

**Elegir columnas y exportar.** El botón de columnas muestra u oculta las que no te
interesan, y el de exportar baja la tabla a Excel o CSV —la página actual o el resultado
completo—.

!!! info "Es una pantalla de diagnóstico, no de ejecución"

    Aquí no se mueve inventario. Lo que se decide con esta lista se ejecuta en
    [Distribuir](../reabastecimiento/distribuir.md) o en una
    [Solicitud de Distribución](../reabastecimiento/solicitud-de-distribucion.md), que es
    donde nace la orden que efectivamente traslada el producto.

!!! tip "Si llegas desde una dirección antigua, es la misma pantalla"

    Esta pantalla estuvo en el Área de trabajo. Esa dirección sigue funcionando y **redirige
    aquí conservando los filtros**, así que los enlaces y marcadores guardados no se rompen.

## Qué es «sobreinventario» aquí { #sobreinventario }

Sobra no es «hay mucho»: es **más de lo que esa bodega va a necesitar** en el horizonte con
el que trabajas. Por eso el cálculo depende de dos cosas que no están en esta pantalla y sí
la gobiernan:

- **El pronóstico de demanda de esa bodega.** El mismo inventario es excedente en una tienda
  de venta lenta y es normal en una de venta rápida.
- **Los parámetros de cobertura** —cuántos días de inventario se quiere tener— que fija tu
  empresa, por bodega o por categoría. Ver
  [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

Que un producto aparezca aquí no es, por sí solo, un error de nadie: una compra estacional,
una promoción que no funcionó o una apertura que arrancó despacio terminan igual en esta
lista. Lo que la lista dice es **dónde está el dinero quieto**, no de quién es la culpa.

## Qué necesita para funcionar { #requisitos }

- **Inventario por bodega cargado y al día**, incluido el que va en tránsito: sin él no hay
  excedente que calcular.
- **Pronóstico de demanda** para las bodegas que quieras evaluar.
- **Costo del producto**, si esperas que el costo del sobreinventario signifique algo.
- **El permiso `reports-and-analytics.inventory-balancing`.**

## Conceptos relacionados { #conceptos }

- [Distribuir](../reabastecimiento/distribuir.md)
- [Solicitud de Distribución](../reabastecimiento/solicitud-de-distribucion.md)
- [Histórico](historico.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
