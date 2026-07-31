---
title: Reportes
module: Reportes
route: /reports-and-analytics
aliases: []
permission: reports-and-analytics
audience: [Clientes, Usuarios]
summary: >
  Reportes es el módulo de solo mirar: qué pasó con las ventas y el inventario, qué tan
  bien se está siguiendo lo que Celes sugiere, qué distribuciones vienen y dónde hay
  inventario mal ubicado. Nada de lo que hay aquí modifica un pedido.
keywords: [reportes, analítica, indicadores, exportar, suscripción, adherencia]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.reports-and-analytics.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: bacaa614e
---

# Reportes

## Qué es y para qué sirve { #que-es }

El resto de la aplicación sirve para **decidir**: qué comprar, cuánto distribuir, qué
promocionar. Este módulo sirve para **mirar**, y ninguna de sus pantallas cambia un pedido.
Es donde se responde qué pasó, qué tan bien lo estamos haciendo y qué viene.

Las cuatro preguntas que cubre, en el orden en que se suelen hacer:

- **¿Cómo va el negocio?** Ventas, inventario, venta perdida y margen del mismo periodo,
  con el mismo desglose — es [Histórico](historico.md).
- **¿Se está siguiendo lo que Celes sugiere?** Cuánto se pidió frente a cuánto se
  recomendó, por tienda, por usuario o por producto — es [Adherencia](adherencia.md).
- **¿Qué viene?** Cuánta distribución va a salir del centro los próximos días — es
  [Distribuciones Estimadas](distribuciones-estimadas.md).
- **¿Dónde está el inventario que sobra?** Qué producto está de más en qué bodega, y
  quién lo necesita — es [Balanceo de Inventario](balanceo-de-inventario.md).

![Histórico, la pantalla en la que abre el módulo: los indicadores del periodo arriba, la
curva de ventas e inventario en el centro y el desglose
abajo.](../assets/screenshots/reportes/historico.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

| Entrada del menú | Para qué | Página |
|---|---|---|
| **Histórico** *(o **Desempeño General**)* | Ventas, inventario, venta perdida y margen del periodo, con su desglose | [Histórico](historico.md) |
| **Distribuciones Estimadas** | Ver cuánta distribución se espera en los próximos días, por tienda, producto o centro | [Distribuciones Estimadas](distribuciones-estimadas.md) |
| **Adherencia** | Comparar lo pedido contra lo sugerido, en compras y en distribución | [Adherencia](adherencia.md) |
| **Desempeño Comercial** | Ventas, margen, ticket y canasta con su variación contra el periodo anterior | [Desempeño Comercial](desempeno-comercial.md) |
| **Balanceo de Inventario** | Encontrar el inventario que sobra en una bodega y las que lo necesitan | [Balanceo de Inventario](balanceo-de-inventario.md) |
| **Forecast** | Es [Resumen](../pronostico/resumen.md), del módulo de Pronóstico | [Resumen](../pronostico/resumen.md) |
| **Alertas del Forecast** | Es [Alertas de Forecast](../pronostico/alertas-de-forecast.md), del módulo de Pronóstico | [Alertas de Forecast](../pronostico/alertas-de-forecast.md) |

!!! tip "Al entrar te deja en Histórico"

    La dirección `/reports-and-analytics` no tiene pantalla propia: al abrirla, la
    aplicación te lleva a **Histórico** —o a esa misma pantalla con su nombre anterior,
    **Desempeño General**, si es el permiso que conserva tu usuario—.

!!! info "Histórico y Desempeño General son la misma pantalla"

    Cambió de nombre y de dirección, no de contenido. Verás una **o** la otra, nunca las
    dos: la aplicación muestra la entrada que corresponde al permiso que tengas concedido
    —el nuevo o el anterior— y esconde la otra. Lo mismo pasa con Forecast y Alertas del
    Forecast, que hoy viven en [Pronóstico](../pronostico/index.md).

## Lo que todas las pantallas comparten { #comun }

Aprender una es casi aprenderlas todas: los controles de la barra superior y de cada
tarjeta se repiten.

- **Filtros y rango de fechas.** Están arriba a la derecha y aplican a **todo lo de la
  pantalla a la vez** —indicadores, gráficas y tabla—. Qué se puede filtrar cambia de una
  pantalla a otra, y no todas tienen rango de fechas: Balanceo de Inventario mira el estado
  de hoy, así que no lo lleva.
- **Un desglose que se elige.** La tabla de cada pantalla trae un selector que cambia por
  qué se agrupa: por tienda, por producto, por categoría, por proveedor. No es un filtro:
  es lo mismo contado de otra manera.
- **Maximizar.** Cada tarjeta tiene un botón que la expande a toda la pantalla, útil
  cuando la tabla trae más columnas de las que caben.
- **Exportar.** Las tablas se bajan a Excel o CSV.
- **Suscribirse.** Donde aparece la campana, el reporte se puede programar para que llegue
  solo —por correo, o a una carpeta— con la periodicidad que elijas y con los filtros que
  tenías puestos. Toda suscripción lleva fecha de caducidad: se renueva a conciencia en vez
  de quedarse mandando archivos para siempre.

!!! warning "El rango de fechas por defecto no siempre es el que necesitas"

    Varias pantallas abren sobre un periodo que **incluye días futuros**. En Distribuciones
    Estimadas eso es exactamente lo que se quiere; en Adherencia significa mirar días en los
    que todavía no se ha pedido nada, y es la causa más común de una pantalla que parece
    vacía o rota. Si no ves datos, lo primero que hay que mover es el rango.

## Qué necesita para funcionar { #requisitos }

- **Un permiso del módulo `reports-and-analytics`.** Con cualquiera entras al módulo; cada
  pantalla exige después el suyo, y por eso dos personas de la misma empresa pueden ver
  menús distintos.
- **El procesamiento del día terminado.** Lo que ves es el último cierre, no el minuto
  actual. Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).
- **Ventas, inventario y costo cargados.** Cada indicador se apoya en un dato que viene de
  tu empresa: sin costo no hay margen, sin inventario no hay sobreinventario ni cobertura.

## Conceptos relacionados { #conceptos }

- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
