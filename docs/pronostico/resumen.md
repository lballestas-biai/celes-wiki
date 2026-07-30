---
title: Resumen
module: Pronóstico
route: /planning/forecast-summary
aliases: [/reports-and-analytics/forecast]
permission: planning.forecast-summary
audience: [Clientes, Usuarios]
summary: >
  Resumen contrasta el pronóstico con lo que realmente pasó y pone el error en cifras:
  cuánto se desvió, hacia qué lado y dónde. Es la pantalla desde la que se responde
  «¿puedo confiar en el forecast?» antes de discutir un pedido concreto.
keywords: [resumen, forecast, accuracy, MAPE, BIAS, error del pronóstico]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.planning.forecast-summary.index.lazy.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastKPIs/ForecastKPIs.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastKPIs/ForecastKpiCard.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastPerformanceSectionTable/ForecastPerformanceSectionTable.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/reports-and-analytics.json
    ref: fd8a12056
---

# Resumen

## Qué es y para qué sirve { #que-es }

Es el examen del pronóstico. La pantalla pone lado a lado **lo que Celes predijo** y **lo
que realmente ocurrió** en el periodo que elijas, y traduce la diferencia a un puñado de
métricas de error.

Sirve para dos preguntas, en este orden. La primera es de confianza: *¿el forecast está
acertando lo suficiente como para pedir con él?* La segunda es de diagnóstico: *¿dónde no
está acertando?* —porque el error casi nunca está repartido parejo, y la tabla de abajo
existe justo para encontrar la tienda, la categoría o el proveedor que lo concentra.

![Resumen con la sección Forecast vs. Ventas: las tarjetas de error arriba, la curva de
pronóstico contra ventas en el centro y el desglose por tienda
abajo.](../assets/screenshots/pronostico/resumen.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir qué se compara contra qué.** El selector de arriba a la izquierda cambia la
sección entera. Las combinaciones habituales son cuatro, y la diferencia entre ellas no es
cosmética:

- *Forecast vs. Ventas* — el pronóstico base contra lo que se facturó.
- *Forecast Enriquecido vs. Ventas* — el pronóstico **ya modificado** por escenarios y
  promociones, contra lo facturado. Es el que responde «¿acertó lo que finalmente usamos?».
- *Forecast vs. Demanda* y *Forecast Enriquecido vs. Demanda* — lo mismo, pero contra la
  demanda estimada en vez de la venta. En un periodo con quiebres de stock, estas dos son
  las que no castigan al modelo por algo que no pudo venderse.

**Leer las tarjetas de error.** Arriba aparecen el total pronosticado y el vendido, y con
ellos las métricas del periodo. Qué tarjetas trae tu instancia se configura, pero las
habituales son:

| Métrica | Qué dice | Cómo se lee |
|---|---|---|
| **Accuracy** | Qué porcentaje del pronóstico acertó | Más alto es mejor |
| **MAPE** | Error porcentual promedio | Más bajo es mejor |
| **sMAPE** | Igual que MAPE, pero simétrico: no se dispara cuando el valor real es muy pequeño | Más bajo es mejor |
| **BIAS** | Hacia qué lado se equivoca | Positivo = se pronostica de más; negativo = de menos |
| **MAE** | Error promedio en unidades, no en porcentaje | Más bajo es mejor |
| **FVA** | Cuánto aporta el forecast frente a no usarlo | Positivo = aporta |

De todas, **BIAS es la que más decisiones cambia**: un MAPE alto dice que el pronóstico es
impreciso, pero un BIAS alto y persistente dice que es *sesgado*, y un sesgo sostenido se
traduce en sobrestock o en quiebres, siempre del mismo lado.

**Mover la gráfica.** Los dos selectores sobre la curva cambian el eje del tiempo —*Día*,
*Semana*, *Mes*— y la unidad —*Cantidad*, *Valor*, o las dos a la vez—. Cambiar a semana o
a mes suele ser lo primero que hay que hacer: un forecast diario que se ve pésimo por
producto puede ser perfectamente bueno agregado a la semana, que es el horizonte con el
que de verdad se compra.

**Buscar dónde está el error.** La tabla de abajo desglosa el mismo periodo por *Tienda*,
*Producto*, *Categoría*, *Proveedor* o *Semana*. Es el paso que convierte «el forecast anda
mal» en «el forecast anda mal en estas cuatro tiendas».

**Acotar y sacar la información.** Los **Filtros** y el **rango de fechas** de la barra
superior aplican a todo lo de la pantalla —tarjetas, gráfica y tabla— a la vez. La tabla se
exporta, y admite suscribirse para recibirla periódicamente.

!!! info "Lo que ves aquí depende de tu instancia"

    Qué secciones ofrece el selector, qué métricas traen las tarjetas y por qué campos
    desglosa la tabla se configuran por empresa. Ver
    [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md).

## Cómo mirar el periodo { #periodo }

El rango de fechas suele abrir sobre un periodo que **incluye días futuros**, y eso hace
que la curva tenga dos mitades muy distintas: hasta hoy hay pronóstico *y* venta, y a
partir de mañana solo pronóstico. La línea de ventas cayendo a cero al llegar a hoy no es
una caída de la demanda: es que todavía no ha pasado.

Para juzgar el acierto, hay que mirar **un periodo ya cerrado**. Para planear, uno futuro.
Mezclarlos en la misma ventana es lo que produce la mayoría de las lecturas equivocadas de
esta pantalla.

## Qué necesita para funcionar { #requisitos }

- **Ventas cargadas para el periodo que estás mirando.** Sin ellas no hay contra qué
  comparar y las métricas de error salen vacías o sin sentido.
- **El procesamiento del día terminado**, si esperas que el periodo llegue hasta ayer. Ver
  [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).
- **El permiso `planning.forecast-summary`** —o el anterior
  `reports-and-analytics.forecast`, que abre la misma pantalla.

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Alertas de Forecast](alertas-de-forecast.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
