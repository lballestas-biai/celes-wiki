---
title: Desempeño Comercial
module: Reportes
route: /reports-and-analytics/commercial-performance
aliases: []
permission: reports-and-analytics.commercial-performance
audience: [Clientes, Usuarios]
summary: >
  Desempeño Comercial mira la venta con ojos de comercial y no de inventario: cuánto se
  vendió, con qué margen, con qué ticket promedio y con qué canasta, siempre contra el
  periodo anterior o contra el mismo periodo del año pasado.
keywords: [desempeño comercial, ticket promedio, canasta, margen, variación, año anterior]
tenant_variance: high
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.reports-and-analytics.commercial-performance.index.lazy.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/hooks/mockDataCommercialPerformance.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/public/locales/es/reports-and-analytics.json
    ref: bacaa614e
---

# Desempeño Comercial

!!! warning "Página sin verificar contra la pantalla en vivo"

    Lo de abajo está derivado del código de la aplicación, no de la pantalla funcionando: la
    instancia con la que se toman las capturas de esta wiki no tiene habilitado este reporte,
    así que **esta página no lleva captura y puede que no describa exactamente lo que ves**.
    Se marcará como verificada cuando se pueda contrastar contra una instancia que lo tenga.

## Qué es y para qué sirve { #que-es }

[Histórico](historico.md) mira la venta desde el inventario: qué se vendió y qué hizo falta
para sostenerlo. Esta pantalla la mira desde el otro lado, el del **comercial**: no solo
cuánto se vendió, sino **cómo** se vendió —con qué margen, con cuántas facturas, con qué
ticket promedio y con qué tamaño de canasta— y, sobre todo, **contra qué se compara**.

La comparación es la razón de ser de la pantalla. Un mes bueno no se juzga en absoluto sino
contra el mes anterior o contra el mismo mes del año pasado, que es lo que separa el
crecimiento real de la estacionalidad.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir contra qué comparar.** El selector de la cabecera fija la base de todas las
variaciones: contra el año anterior, contra el mes anterior, contra la semana anterior, o
contra el mismo mes o semana del año pasado.

**Leer las tarjetas de variación.** El acumulado del periodo con su variación frente a esa
base: **ventas** en dinero y en cantidad, **utilidad bruta**, **número de facturas**,
**ticket promedio** y **tamaño de canasta**. Las dos últimas son las que explican la
primera: vender más con el mismo número de facturas no es lo mismo que venderlo con más
clientes.

**Seguir la venta en el tiempo.** La gráfica combina dos o tres series a la vez, y el
selector cambia la combinación —cantidad o valor de venta, contra precio de venta al público,
ticket promedio, porcentaje de margen o tamaño de canasta—. Es donde se ve si el margen se
sostuvo mientras el volumen subía.

**Cambiar de punto de vista.** Las pestañas reparten el mismo periodo por **punto de venta**,
por **división** y en un bloque de **comparativos**, con la venta por categoría y por centro
operativo, los productos más vendidos, y el detalle por categoría.

**Ver a qué hora se vende.** Un mapa de calor cruza el día de la semana con la hora, y otras
dos vistas reparten la venta por día de la semana y por día del mes. Es información de
operación —turnos, promociones por franja, reposición en sala— más que de análisis.

## Qué necesita para funcionar { #requisitos }

- **Ventas con nivel de factura**, no solo agregados por día: el número de facturas, el
  ticket promedio y la canasta salen de ahí.
- **Costo cargado**, para la utilidad bruta y el margen.
- **Historia del periodo con el que se compara.** Sin el año anterior cargado, la variación
  contra el año anterior no puede calcularse.
- **El permiso `reports-and-analytics.commercial-performance`**, que no todas las instancias
  conceden: es el reporte de Celes que menos empresas tienen habilitado.

## Conceptos relacionados { #conceptos }

- [Histórico](historico.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
