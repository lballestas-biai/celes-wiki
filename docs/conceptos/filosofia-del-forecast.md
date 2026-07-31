---
title: Filosofía del forecast
module: Conceptos
audience: [Clientes, Usuarios]
summary: >
  El pronóstico de Celes estima **demanda**, no venta: lo que tus clientes habrían
  comprado, que no es lo mismo que lo que alcanzaste a venderles. Esta página explica esa
  distinción, qué corrige el pronóstico enriquecido y cómo juzgar si está acertando.
keywords: [forecast, pronóstico, demanda, venta, quiebre de stock, escenarios, sesgo]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/common/ProductListForecastOrigin/ForecastSourceDetailsDrawer.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/PageProductDetailDefault/ForecastHealthReportPanel.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# Filosofía del forecast

## Demanda no es venta { #demanda-no-es-venta }

La venta es lo que registró la caja. La demanda es lo que tus clientes querían comprar.
Coinciden mientras haya producto en el estante; el día que se agota, dejan de coincidir —y
la que se queda corta es siempre la venta.

Ese día es el problema. Un modelo entrenado solo con la venta observada aprende que ese
producto «vendió poco» justo cuando lo que pasó fue que no había qué vender. Al día
siguiente pide menos, se vuelve a agotar, y la profecía se cumple sola.

Por eso **el pronóstico de Celes apunta a la demanda**, y por eso la aplicación mantiene
las dos series separadas: en el examen del pronóstico puedes comparar *Forecast vs.
Ventas* o *Forecast vs. Demanda*, y en el detalle de un producto la gráfica de salud
contrapone **Demanda real** contra **Forecast**. En un periodo con quiebres, esas dos
comparaciones dan resultados distintos, y la que juzga al modelo con justicia es la de
demanda.

!!! info "Qué significa esto al leer un número"

    Si comparas el pronóstico contra la venta de un periodo en el que hubo agotados, el
    pronóstico va a parecer alto. No necesariamente lo era: la venta era baja porque no
    había inventario. Ver [Resumen](../pronostico/resumen.md), donde se elige contra qué
    se compara.

## Qué se pronostica, y con qué detalle { #que-se-pronostica }

El pronóstico no es un número por producto: es una serie por **producto y punto**, día a
día, hacia adelante. Esa granularidad es la que permite que el mismo producto tenga un
sugerido distinto en dos tiendas, y la que hace que valga la pena mirar el error por
tienda y no solo el total.

De ahí se derivan las dos preguntas de reabastecimiento —qué comprar y cómo repartir—,
descritas en [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md).

## Pronóstico base y pronóstico enriquecido { #base-y-enriquecido }

Celes calcula un **pronóstico base** a partir de la historia. Ese número casi nunca es el
último: encima se aplica lo que el negocio sabe y la historia no.

| Capa | Qué la produce | Para qué |
|---|---|---|
| **Pronóstico de Celes** | El modelo, sobre la historia de demanda | La línea base |
| **Escenarios** | Correcciones que tú defines sobre productos y periodos | Ajustar lo que sabes que va a pasar y el modelo no puede saber |
| **Promociones** | El efecto estimado de una promoción o campaña | Anticipar el pico y el arrastre |

El resultado de aplicar esas capas es el **pronóstico enriquecido**, y es el que alimenta
las recomendaciones. La aplicación no esconde de dónde viene cada valor: marca si un
número trae modificaciones de promoción, de escenario o de las dos, y deja abrir el
detalle de qué lo modificó.

Es una distinción con consecuencias prácticas. Cuando alguien dice «el forecast está mal»,
la primera pregunta es *cuál*: si el base falla, es un asunto del modelo o de los datos; si
el base está bien y el enriquecido no, alguien cargó un escenario o una promoción que no
correspondía.

## Cuándo se recalcula { #cuando-se-recalcula }

El pronóstico se recalcula en la corrida diaria, en sus propias etapas, antes de que se
calculen los sugeridos. No cambia durante el día: lo que ves hoy es el resultado del
último procesamiento terminado, y una corrección que cargues ahora se refleja en la
siguiente corrida. Ver [El ciclo diario de datos](ciclo-diario-de-datos.md).

## No todo es pronosticable { #no-todo-es-pronosticable }

Hay productos cuya historia no da señal suficiente: los que acaban de nacer, los que se
venden una vez cada tanto, los que se descontinuaron. Forzar un pronóstico ahí produce un
número con apariencia de dato y sin contenido.

Celes prefiere decirlo. Dos mecanismos lo cubren:

- **Consolidar la historia** cuando el producto es nuevo pero su demanda no lo es —porque
  reemplaza a otro, o porque pertenece a una familia que sí tiene señal—. Ver
  [Sustitutos y agrupaciones](sustitutos-y-agrupaciones.md). Cuando eso pasa, el
  pronóstico vive en la serie consolidada, y el producto individual puede aparecer sin
  pronóstico propio **sin que sea un error**.
- **Avisar de las anomalías**, en [Alertas de Forecast](../pronostico/alertas-de-forecast.md)
  y en el reporte de salud del detalle de producto, que además propone una corrección por
  semanas y deja crearla como escenario en el momento.

## Cómo saber si está acertando { #como-juzgarlo }

Tres reglas que evitan la mayoría de las conclusiones apresuradas:

1. **Compara al nivel en que decides.** Un pronóstico diario por producto y tienda puede
   verse pésimo y ser perfectamente útil agregado a la semana, que es el horizonte con el
   que se compra.
2. **Mira el sesgo antes que la precisión.** Un error grande y repartido a los dos lados se
   compensa; un error pequeño y siempre del mismo lado se acumula en sobrestock o en
   quiebres.
3. **Pregunta contra qué se está comparando** —venta o demanda, base o enriquecido—. Cuatro
   combinaciones, cuatro respuestas distintas para el mismo periodo.

Las métricas concretas y dónde leerlas están en [Resumen](../pronostico/resumen.md).

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md)
- [Sustitutos y agrupaciones](sustitutos-y-agrupaciones.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md)
- [Resumen](../pronostico/resumen.md) y [Escenarios](../pronostico/escenarios.md)
