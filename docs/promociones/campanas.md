---
title: Campañas
module: Promociones
route: /promotions/campaigns
aliases: [/planning/promotional-campaigns]
permission: promotions.campaigns
audience: [Clientes, Usuarios]
summary: >
  Una campaña agrupa promociones para que se revisen y se aprueben juntas. Esta pantalla es
  la lista de todas ellas, con su estado y lo que cada una deja; desde aquí se crean, se
  suben desde un archivo, se aprueban o se rechazan, y se abre el calendario de promociones.
keywords: [campaña, promoción, aprobar campaña, calendario de promociones, ROI, subir promociones]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningPromotionalCampaigns/PlanningPromotionalCampaignsPage/PlanningPromotionalCampaignsPage.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningPromotionalCampaigns/PlanningPromotionalCampaignsPage/components/CampaignsList/CampaignsList.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningPromotionalCampaigns/PlanningPromotionalCampaignDetailsPage/PlanningPromotionalCampaignDetailsPage.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningPromotionalCampaigns/PlanningPromotionalCampaignsPage/components/PromotionalCalendarDialog/PromotionalCalendarDialog.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningPromotionalCalendarPage/components/PromotionalCalendarViewer/PromotionalCalendarViewer.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fdb9c1358
---

# Campañas

## Qué es y para qué sirve { #que-es }

Una **campaña** es un contenedor de promociones: le pones nombre —«Aniversario», «Fin de
mes de julio»— y dentro caben todas las promociones que pertenecen a esa iniciativa
comercial. Sirve para tres cosas que una promoción suelta no permite:

1. **Aprobar en bloque.** El estado se decide sobre la campaña, no promoción por promoción.
2. **Medir el conjunto.** Cuánto se invirtió en toda la campaña y qué devolvió, no lo que
   dejó cada descuento por separado.
3. **Ver el calendario.** Todas las promociones repartidas sobre un mes o una semana, que es
   como se detecta que dos iniciativas se pisan.

Esta pantalla es la lista de campañas. La promoción en sí —los productos, el descuento, la
estimación— se arma en [Demanda y Promociones](../pronostico/demanda-y-promociones.md) y se
asocia a una campaña al guardarla.

![La lista de campañas, con el estado de cada una, el interruptor de campañas vigentes y los
botones de calendario, carga y creación.](../assets/screenshots/promociones/campanas.png)

!!! info "Puede que la veas como «Campañas Promocionales», bajo Pronóstico"

    Es la misma pantalla en su dirección anterior, `/planning/promotional-campaigns`, donde
    el menú la llama así. **Cuál de las dos ves depende de qué permiso tengas concedido**, y
    la captura de arriba está tomada con el anterior: por eso la cabecera dice *Campañas
    Promocionales* y no *Campañas*.

## Los estados de una campaña { #estados }

El estado se pinta como una etiqueta de color en la lista, y decide qué se puede hacer con
la campaña:

| Estado | Qué significa |
|---|---|
| **Creada** | Es el estado en el que nace. Es el único en el que se puede editar, añadirle promociones o cambiarle el estado |
| **Aprobado** | La campaña rige. Ya no se edita ni se le añaden promociones |
| **Rechazado** | Se revisó y se decidió no aplicarla |

En una instancia con historia puedes encontrarte campañas antiguas con otras etiquetas
—*Borrador*, *Activo*, *Finalizada*—. Son estados de versiones anteriores de la pantalla: se
siguen mostrando tal cual, y las campañas que los llevan se comportan como las que no están
en *Creada*.

!!! warning "Borrar una campaña aprobada no la borra: la archiva"

    Y archiva **también todas sus promociones**. La aplicación lo advierte antes de hacerlo.
    Una campaña que ya rigió no se puede desaparecer del histórico; una que sigue en *Creada*
    sí se borra de verdad.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver solo lo que está vigente.** El interruptor **Campañas vigentes** de la barra de la
tabla deja únicamente las que rigen hoy. Es el primer sitio donde mirar cuando alguien
pregunta qué promociones hay puestas ahora mismo.

**Crear una campaña.** **Crear Campaña** pide dos cosas: un nombre y una descripción. Nace
vacía y en estado *Creada*; las promociones se le añaden después, desde su detalle o desde
[Demanda y Promociones](../pronostico/demanda-y-promociones.md).

**Subir promociones desde un archivo.** **Subir promociones** abre la carga masiva: se
descarga la plantilla con el formato que espera el calendario, se llena, y al subirla eliges
si esas promociones **crean una campaña nueva** o **se agregan a una existente**. La carga
se procesa **en segundo plano**: la aplicación te avisa de que se está subiendo y la campaña
aparece cuando termina. Si el archivo trae errores, se listan fila por fila —columna
obligatoria vacía, fecha de inicio posterior a la de fin, tipo de descuento inválido, días
fuera del rango de la promoción— y no se sube nada hasta corregirlos.

**Abrir una campaña.** **Ver detalles** entra a la campaña: su nombre, sus indicadores y la
lista de sus promociones. Está descrito [más abajo](#detalle).

**Editar o borrar.** Desde el menú de la fila. **Editar** solo cambia el nombre y la
descripción, y solo mientras la campaña esté en *Creada*. **Eliminar** está disponible en
*Creada* y en *Aprobado*, con la diferencia que explica el aviso de arriba.

**Buscar, filtrar y exportar.** La búsqueda de la barra es por **nombre de campaña**. Los
**Filtros** de la aplicación acotan la lista igual que en el resto de las pantallas, y la
exportación entrega Excel o CSV, de la página actual o de todo el resultado.

## El calendario de promociones { #calendario }

El botón **Calendario de Promociones** abre, sin salir de esta pantalla, todas las
promociones repartidas sobre el tiempo. Tiene tres vistas, que se eligen en el selector de
la cabecera:

| Vista | Qué muestra |
|---|---|
| **Mensual** | Un mes completo, con las promociones sobre los días que abarcan |
| **Semanal** | Una semana, con más sitio para leer cada promoción |
| **Lista** | Una fila por promoción: fecha, nombre, número de productos impactados y crecimiento esperado en % |

Las flechas de la cabecera mueven el mes —o la semana, según la vista—. La vista elegida
queda en la dirección del navegador, así que un enlace a esta pantalla puede abrir el
calendario ya puesto en la vista que quieras enseñar.

!!! info "El calendario tiene su propio permiso"

    El botón solo aparece si tu usuario tiene concedido `promotions.calendar` —o el anterior
    `planning.promotional-calendar`—. Sin él, la pantalla de campañas funciona igual y el
    botón no está.

## El detalle de una campaña { #detalle }

Al abrir una campaña, la pantalla tiene tres partes.

**Los indicadores.** Cuatro tarjetas con lo que la campaña deja: **Ingresos incrementales**
—el aumento de ventas frente a un escenario sin promoción—, **Utilidad incremental** —esa
ganancia menos los costos de la promoción—, **Inversión** —el costo total en descuentos— y
**ROI** —la relación entre las dos anteriores—. En cuanto la campaña sale de *Creada*, las
cuatro se pintan atenuadas.

**El cambio de estado.** El desplegable de la cabecera es el que aprueba o rechaza. Está
apagado si la campaña no está en *Creada*, si no tienes permiso de escritura o **si la
campaña no tiene ninguna promoción**: no hay nada que aprobar.

**La lista de promociones.** Una fila por promoción, con su interruptor de **Promociones
vigentes** y su propia exportación. **Crear promoción** añade una a esta campaña, y **Ver
más detalles** abre la promoción: sus productos, su descuento, sus fechas y su estimación.
Borrar una promoción de una campaña aprobada la **archiva**, por la misma razón que la
campaña.

## Qué necesita para funcionar { #requisitos }

- **El permiso `promotions.campaigns`**, o el anterior `planning.promotional-campaigns`.
- **Permiso de escritura** para crear, editar, borrar, subir o cambiar el estado. Con solo
  lectura la lista y el detalle se ven, y los botones no están.
- **El permiso `promotions.calendar`** para el calendario, aparte del anterior.
- **Promociones dentro.** Una campaña vacía no se puede aprobar ni aporta nada al
  calendario.
- **Precio y costo cargados** para que los indicadores signifiquen algo: la inversión, la
  utilidad incremental y el ROI salen de comparar ingresos contra costos.

## Conceptos relacionados { #conceptos }

- [Demanda y Promociones](../pronostico/demanda-y-promociones.md)
- [Promociones](index.md)
- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Trade Marketing](../surtido/trade-marketing.md)
