---
title: Distribuciones Estimadas
module: Reportes
route: /reports-and-analytics/replenishment-report
aliases: []
permission: reports-and-analytics.replenishment-report
audience: [Clientes, Usuarios]
summary: >
  Distribuciones Estimadas proyecta cuánta mercancía va a salir del centro de distribución
  hacia las tiendas en los próximos días, con una columna por fecha. Es la pantalla con la
  que se prepara la operación antes de que los pedidos existan.
keywords: [distribución estimada, proyección, centro de distribución, escasez, tienda, planificación]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.reports-and-analytics.replenishment-report.index.lazy.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/hooks/mockDataReplenishmentReport.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/core/PivotDataTable/PivotDataTable.tsx
    ref: bacaa614e
---

# Distribuciones Estimadas

## Qué es y para qué sirve { #que-es }

Las demás pantallas de Reportes miran hacia atrás. Esta mira hacia **adelante**: dice cuánta
mercancía se espera que salga del centro de distribución hacia cada tienda **los próximos
días**, antes de que ninguna de esas órdenes exista.

Sirve para preparar lo que no se improvisa: cuánta gente hace falta el jueves en el muelle,
cuántos camiones se contratan, qué producto conviene tener consolidado antes de que llegue
el pedido. Y sirve para lo contrario: **ver venir la escasez**. Si lo que las tiendas van a
pedir supera lo que el centro va a tener, es mejor enterarse ahora que el día del despacho.

![Distribuciones Estimadas: la curva de pedidos esperados desde el centro de distribución y
la tabla con una columna por fecha.](../assets/screenshots/reportes/distribuciones-estimadas.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver el volumen que viene.** La gráfica *Pedidos esperados desde Centro de Distribución*
lleva dos series: los **pedidos** y las **combinaciones de tienda y producto**, que es la
medida de cuán fragmentado es ese volumen. Mucha cantidad en pocas combinaciones se despacha
distinto que la misma cantidad repartida en miles de líneas. El selector cambia el eje del
tiempo a *Día*, *Semana* o *Mes*.

**Cambiar el eje de la tabla.** Las fechas siempre son las columnas; lo que se elige es qué
va en las filas:

| Vista | Para qué |
|---|---|
| **Por Tienda** | Cuánto le va a llegar a cada tienda, día por día |
| **Por Centro de Distribución** | La carga de trabajo que le viene a cada centro |
| **Por Centro de Distribución con Escasez** | Lo mismo, quedándose con lo que el centro **no** va a poder cubrir |
| **Por Producto** | Qué productos concentran el movimiento |
| **Por Proveedor** | Lo mismo, agrupado por quién los surte |

Cada vista cierra la fila con su **total** y se exporta a su propio archivo de Excel.

**Acotar.** Los **Filtros** y el **rango de fechas** de la barra superior aplican a la
gráfica y a la tabla a la vez.

!!! info "Las cantidades vienen con decimales"

    No es un defecto de presentación: esto es una **estimación** —el resultado de repartir
    una demanda pronosticada entre días—, no un pedido ya cuadrado a unidades de empaque. El
    redondeo, el múltiplo y el mínimo entran después, cuando la orden se crea de verdad en
    [Distribuir](../reabastecimiento/distribuir.md).

## Por qué el pasado sale vacío { #pasado }

Es la duda más frecuente de esta pantalla: si mueves el rango de fechas a un periodo ya
transcurrido, la tabla **no muestra nada**.

No es un fallo. Aquí no hay historia que consultar: lo que se publica es la proyección
vigente, la de los días que todavía no han pasado. Para mirar hacia atrás están
[Adherencia](adherencia.md) —lo que se pidió frente a lo que se sugería— y el
[Historial de Órdenes de Distribución](../reabastecimiento/historial-de-ordenes-de-distribucion.md),
que sí conserva lo que realmente se despachó.

## Qué necesita para funcionar { #requisitos }

- **Pronóstico de demanda vigente**, porque la proyección sale de ahí. Ver
  [Filosofía del forecast](../conceptos/filosofia-del-forecast.md).
- **La red de distribución declarada**: qué tienda se surte de qué centro. Sin ese vínculo
  no hay a quién asignarle el pedido esperado.
- **Los parámetros de distribución cargados** —cobertura, tiempos, mínimos—, que son los que
  convierten la demanda en una cantidad a mover.
- **El procesamiento del día terminado.** La proyección se recalcula con él. Ver
  [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).
- **El permiso `reports-and-analytics.replenishment-report`.**

## Conceptos relacionados { #conceptos }

- [Distribuir](../reabastecimiento/distribuir.md)
- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
