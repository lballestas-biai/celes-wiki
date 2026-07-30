---
title: Alertas de Forecast
module: Pronóstico
route: /planning/forecast-alerts
aliases: [/reports-and-analytics/forecast-analysis]
permission: planning.forecast-alerts
audience: [Clientes, Usuarios]
summary: >
  Alertas de Forecast es la lista de anomalías que Celes detectó en su propio pronóstico:
  productos cuya curva se dispara, se apaga o se saltó una temporada. Cada alerta trae una
  corrección propuesta semana a semana, que se puede aplicar, ajustar o descartar.
keywords: [alertas, anomalía, hockey stick, death spiral, corrección, escenario sugerido]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.planning.forecast-alerts.index.lazy.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastFlaggedProductsTable/ForecastFlaggedProductsTable.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastFlaggedProductsTable/ActiveFlagsCell.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastFlaggedProductsTable/ForecastHealthDrawerContent.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/ForecastFlaggedProductsTable/SelectionActionBar.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: fd8a12056
---

# Alertas de Forecast

## Qué es y para qué sirve { #que-es }

Un pronóstico puede estar equivocado de dos maneras: fallando un poco en todas partes, o
fallando **mucho en unos pocos casos**. Lo primero se mide en [Resumen](resumen.md). Lo
segundo se atiende aquí.

Celes revisa su propio pronóstico buscando formas de curva que casi nunca son correctas
—una demanda que se dispara sin motivo, otra que se apaga hasta cero, una temporada que el
modelo no recogió— y publica cada caso como una **anomalía**. Esta pantalla es esa lista,
con una corrección ya calculada al lado de cada fila.

Es una lista de trabajo, no un reporte: la idea es vaciarla. Cada fila se atiende una vez
—aplicando la corrección o descartándola— y desaparece.

![La lista de anomalías: las banderas activas de cada producto y, a la derecha, el escenario
sugerido con el valor actual y el corregido para cada una de las cinco semanas
siguientes.](../assets/screenshots/pronostico/alertas-de-forecast.png)

## Las cuatro banderas { #banderas }

La columna **Flags Activas** dice qué se detectó. Un producto puede llevar más de una:

| Bandera | Qué significa |
|---|---|
| **Hockey Stick** | El pronóstico sube de forma brusca e inusual frente a la tendencia |
| **Death Spiral** | El pronóstico cae de forma continua acercándose a cero |
| **Missed Seasonal Lift** | El pronóstico no recogió un incremento estacional esperado |
| **Missed Seasonal Drop** | El pronóstico no recogió una caída estacional esperada |

*Death Spiral* es la que más daño silencioso hace: un pronóstico que se apaga deja de pedir,
la falta de pedido produce quiebres, y los quiebres le confirman al modelo que ya no se
vende. Es el círculo que la alerta existe para romper.

Una anomalía **no es necesariamente un error**. Un producto que de verdad está saliendo del
surtido tiene su *Death Spiral* bien puesta, y una campaña que arranca justifica un *Hockey
Stick*. Por eso ninguna corrección se aplica sola: la pantalla propone y la persona decide.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Leer la corrección propuesta sin abrir nada.** El grupo de columnas **Escenario sugerido**
muestra, para cada una de las semanas siguientes, el valor que hay hoy y el valor corregido.
Con eso suele bastar para saber si la propuesta tiene sentido.

**Abrir el detalle de una fila.** **Ver detalles** despliega un panel con tres cosas: la
gráfica de **Demanda Real vs Forecast** del producto en ese punto, una **explicación
escrita** de por qué se levantó la alerta —redactada automáticamente para ese caso— y la
corrección semana a semana. Desde ahí se puede:

- **Usar sugerencia** — aplica los valores propuestos.
- **Personalizar** — abre la corrección para escribir tú el valor de cada semana antes de
  aplicarla.
- **Descartar anomalía** — cierra la alerta sin tocar el pronóstico. Es lo correcto cuando
  la curva rara es la curva real.

**Atender muchas de una vez.** Las casillas de la izquierda seleccionan filas, y
**Seleccionar todas las alertas** las toma todas, incluidas las de las páginas siguientes.
Con una selección activa aparecen **Usar Sugerencia** y **Descartar Anomalía**, que hacen lo
mismo que en el panel pero para todo el lote. Las dos piden confirmación, y con razón: una
crea y aprueba un escenario que mueve el pronóstico vivo, y la otra no se puede deshacer.

**Ver el pronóstico completo.** El botón **Ver Forecast** lleva al detalle del pronóstico.

**Acotar y exportar.** Los **Filtros** y el rango de fechas de la barra superior aplican a
toda la lista. La tabla se exporta, y admite suscribirse para recibirla periódicamente.

Un punto verde junto al nombre del producto señala que ese producto tiene una **promoción
activa**. Muchas veces esa es toda la explicación de la anomalía, y no hay nada que corregir.

!!! warning "Aplicar una sugerencia crea un escenario aprobado"

    No es una anotación: **Usar sugerencia** crea un [escenario](escenarios.md) y lo aprueba
    en el mismo paso, así que el pronóstico corregido entra en vigor de inmediato y afecta a
    lo que Celes sugiera pedir. El escenario queda listado en Escenarios, con su nombre, su
    vigencia y su autor.

## Cuando la lista queda vacía { #vacia }

El pie de la tabla dice cuántas anomalías hay y en qué página vas. Cuando no queda ninguna,
la pantalla lo declara: *«Todas las anomalías han sido revisadas»*. Eso no significa que el
pronóstico sea perfecto —significa que no quedan casos con forma de anomalía sin atender—.
Qué tan bueno es el pronóstico se sigue midiendo en [Resumen](resumen.md).

## Qué necesita para funcionar { #requisitos }

- **Historia suficiente para detectar una forma.** Un producto recién creado no genera
  alertas: no hay tendencia contra la que comparar.
- **El procesamiento del día terminado.** Las alertas se recalculan con él. Ver
  [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).
- **Permiso de escritura para actuar.** Ver la lista solo pide lectura; usar sugerencias,
  personalizar o descartar exige permiso de escritura sobre esta pantalla, y sin él las
  casillas de selección no aparecen.
- **El permiso `planning.forecast-alerts`** —o el anterior
  `reports-and-analytics.forecast-analysis`, que abre la misma pantalla.

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Escenarios](escenarios.md)
- [Resumen](resumen.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
