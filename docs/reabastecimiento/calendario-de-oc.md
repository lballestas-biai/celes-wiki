---
title: Calendario de OC
module: Reabastecimiento
route: /work-area/procurement-calendar
aliases: []
permission: ~
audience: [Clientes, Usuarios]
summary: >
  El Calendario de OC muestra la semana de compras: qué órdenes toca preparar cada día,
  para qué centro y qué proveedor, con lo que Celes sugiere comprar. Sirve para planear la
  semana en vez de descubrir cada mañana lo que había que pedir.
keywords: [calendario, compras, semana, órdenes de compra, planeación, proveedor]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaProcurement/WorkAreaProcurementCalendarPage/WorkAreaProcurementCalendarPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaProcurement/WorkAreaProcurementCalendarPage/components/ProcurementOrdersWeekView/ProcurementOrdersWeekViewColumn.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: d20adaaea
---

# Calendario de OC

## Qué es y para qué sirve { #que-es }

Las compras no se hacen todos los días a todo el mundo: cada proveedor tiene sus días de
pedido. Esta pantalla pone ese ritmo sobre un calendario, para poder mirar la semana
completa antes de sentarse a comprar.

A la izquierda hay un calendario del mes, con un **punto** en los días que tienen algo
programado. A la derecha, la semana del día seleccionado, con una columna por día y una
tarjeta por orden. Cada tarjeta trae los datos del pedido —el centro de distribución, el
proveedor, la compra sugerida— según la agrupación elegida.

![La semana de compras: el mes a la izquierda con sus días marcados, y la semana con una
tarjeta por orden.](../assets/screenshots/reabastecimiento/calendario-de-oc.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

- **Moverte por el tiempo.** Las flechas del mes cambian de mes y las de la semana la
  desplazan; al elegir un día en el calendario, la vista de la derecha salta a su semana.
- **Elegir la agrupación** con **Agrupar por**, que decide qué representa cada tarjeta: un
  centro, un centro y un proveedor, o lo que esté configurado para tu empresa.
- **Filtrar** con los filtros de la aplicación, para mirar solo una categoría, una marca o
  un proveedor.
- **Abrir una orden.** Al pulsar una tarjeta se pasa a la creación de esa orden de compra,
  ya situada en su fecha, sin tener que buscarla en la lista.

!!! info "Este calendario no es el de Pronóstico"

    Hay otra pantalla parecida, **Calendario de Compras**, dentro de Pronóstico. Esta —el
    **Calendario de OC**— es la operativa: la semana de órdenes a preparar. Son pantallas
    distintas y conviven.

## Qué necesita para funcionar { #requisitos }

- **Días de compra configurados por proveedor.** Sin eso no hay nada que programar y el
  calendario sale vacío: no es un fallo de la pantalla, es un parámetro que falta.
- **Sugeridos de compra calculados** para esos días, es decir, el procesamiento del día
  terminado.
- **Una agrupación configurada**, igual que en [Comprar](comprar.md).
- **Ningún permiso propio**: a diferencia del resto del módulo, esta pantalla no exige un
  permiso específico. Aparece en el menú de Reabastecimiento para quien vea el módulo.

## Conceptos relacionados { #conceptos }

- [Comprar](comprar.md)
- [Creación de Orden de Compra](creacion-de-orden-de-compra.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
