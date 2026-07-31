---
title: Calidad de Datos
module: Administración
route: /administration/master-data/data-quality
aliases: [/administration/data-manager/data-quality]
permission: administration.master-data.data-quality
audience: [Administradores, Implementadores]
summary: >
  Calidad de Datos vigila la salud de la información que alimenta el pronóstico, la
  distribución, la compra y los reportes. Cada noche se corren cientos de pruebas automáticas
  y aquí se publica el resultado, con el detalle de qué falló y qué revisar.
keywords: [calidad de datos, pruebas, frescura, anomalías, dimensiones, severidad, asistente]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataQualityPage/AdministrationDataQualityPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataQualityPage/docs/dataQuality.es.md
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dataQuality.json
    ref: c98f195c5
---

# Calidad de Datos

## Qué es y para qué sirve { #que-es }

Un pronóstico solo es tan bueno como el dato que lo alimenta, y un dato malo casi nunca avisa:
no rompe nada, simplemente empuja el número en la dirección equivocada. Esta pantalla existe
para que eso deje de ser invisible.

Cada noche se ejecutan cientos de pruebas automáticas sobre la información de tu instancia
—que las claves no vengan vacías, que no haya duplicados, que los valores estén en el rango
esperado, que las cargas hayan llegado a tiempo— y aquí se publica el resultado. Cuando un
número de un reporte parece raro, esta es la primera pantalla que hay que mirar.

![Calidad de Datos: el panel general con la tasa de aprobación, el recuento por estado y el
desglose por dimensión.](../assets/screenshots/administracion/calidad-de-datos.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

La pantalla se organiza en pestañas:

**Panel General** — el resumen: la **tasa de aprobación** como indicador circular, y al lado el
**total de pruebas** y cuántas quedaron **aprobadas**, **fallidas**, con **advertencias**, con
**errores** y cuántas son **fallas críticas**. Debajo, **Por Dimensión**: un gráfico radar con las
seis dimensiones y una tarjeta por dimensión con su porcentaje y cuántas pruebas lo componen —«96
/ 101»—. Es la vista de «¿estamos bien o no?», y el radar deja ver de un golpe cuál de las seis
está hundida.

**Resultados de Pruebas** — el listado de la última ejecución de cada prueba, con su estado,
prioridad, dimensión, severidad y número de fallas. Se puede filtrar por rango de fechas y
quedarse solo con las últimas ejecuciones. Al abrir una fila aparece el detalle: la
**descripción legible** de qué comprueba, el **historial de los últimos 30 runs** como barras
de color para ver la tendencia, y una **vista previa de las filas que fallaron** cuando está
disponible.

**Frescura de Datos** — la antigüedad de cada carga. Una fuente desactualizada compromete los
números del día, y aquí se ve cuál va retrasada.

**Anomalías** — métricas que se desvían de su propio histórico: volúmenes de registros y
estadísticos por campo que se salen del rango esperado. No son reglas incumplidas, son cambios
sospechosos.

Además, la pantalla incluye **su propia documentación**, en el botón **Documentación** que está
junto a las pestañas: explica las dimensiones, los estados y cómo se calcula la frescura.

!!! info "Puede que tengas una pestaña más"

    Hay una pestaña de **Asistente** —un chat que responde qué está fallando, por qué y qué
    revisar, y que se puede abrir desde una prueba concreta— que todavía no está en todas las
    versiones desplegadas. Si no la ves, tu instancia aún no la tiene.

## Cómo leer un resultado { #como-leer }

Los cuatro estados no significan lo mismo, y confundirlos hace perder tiempo:

| Estado | Qué significa |
|---|---|
| **Aprobado** | Todos los registros cumplen la regla en la última ejecución. |
| **Fallido** | Hay registros que no la cumplen. |
| **Advertencia** | Hay incumplimientos, pero la severidad configurada no los considera bloqueantes. |
| **Error** | La prueba **no pudo ejecutarse**. No dice nada sobre el dato: dice que no se midió. |

Y cada prueba se clasifica en una de seis **dimensiones**, que dicen qué propiedad del dato se
está midiendo: **Completitud** (los campos clave no vienen vacíos), **Exactitud** (los valores
están en el rango esperado), **Unicidad** (no hay duplicados en claves de negocio),
**Validez** (los valores pertenecen al catálogo permitido), **Consistencia** (los datos
concuerdan entre sí) y **Oportunidad** (las cargas llegan a tiempo).

!!! warning "Una prueba con severidad de error detiene procesos"

    Las pruebas marcadas con severidad de error **bloquean los procesos críticos** cuando
    fallan; las de advertencia se reportan y no detienen nada. Si un cálculo del día no corrió,
    esta pantalla suele tener el motivo.

!!! info "Qué pruebas ves depende de tu instancia"

    El conjunto de pruebas se define sobre el modelo de datos de tu implementación, así que el
    número total, las capas y las dimensiones cubiertas cambian de una instancia a otra.

## Qué necesita para funcionar { #requisitos }

- **Las cargas de datos corriendo**: las pruebas se ejecutan sobre lo que llegó.
- **El mapeo hecho** en [Homologación](homologacion.md): una prueba sobre un campo sin mapear no
  mide nada útil.
- **El permiso `administration.master-data.data-quality`.**

## Conceptos relacionados { #conceptos }

- [Datos Maestros](datos-maestros.md)
- [Homologación](homologacion.md)
- [Carga de Datos](carga-de-datos.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md)
