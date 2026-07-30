---
title: Escenarios
module: Pronóstico
route: /planning/scenarios
aliases: []
permission: planning.scenarios
audience: [Clientes, Usuarios]
summary: >
  Un escenario fija a mano el pronóstico de un conjunto de productos durante un rango de
  fechas, y solo empieza a regir cuando alguien lo aprueba. Esta pantalla es la lista de
  todos ellos, con su estado, su vigencia y quién los creó.
keywords: [escenario, ajuste del forecast, aprobar, vigencia, uplift]
tenant_variance: low
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningScenarios/PlanningScenariosPage/PlanningScenariosPage.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningScenarios/PlanningScenariosPage/components/ScenarioList/ScenarioList.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningScenarios/PlanningScenariosCreatePage/PlanningScenariosCreatePage.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningScenarios/PlanningScenariosDetailsPage/components/ScenarioAnalyzerPanel/ScenarioAnalyzerPanel.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fd8a12056
---

# Escenarios

## Qué es y para qué sirve { #que-es }

Un **escenario** es una corrección del pronóstico hecha a mano: *para estos productos, en
estos puntos, durante estas fechas, la demanda va a ser esta*. Es la herramienta para
cuando el negocio ya sabe el número y el modelo no tiene cómo saberlo —un pedido
institucional confirmado, una apertura, una salida de surtido pactada—.

A diferencia de una [promoción](demanda-y-promociones.md), un escenario **no estima nada**:
impone. Y a diferencia de un [evento](calendario-de-eventos.md), no le enseña nada al
modelo: solo cambia la cifra, y solo mientras dure su vigencia.

Esta pantalla es el inventario de escenarios. Sirve para tres cosas: saber **qué está
alterando el pronóstico ahora mismo**, crear uno nuevo, y revisar o retirar los que ya
están.

![La lista de escenarios, con el estado de cada uno, su vigencia, y quién lo creó y lo
modificó por última vez.](../assets/screenshots/pronostico/escenarios.png)

## Los estados, y cuál de ellos manda { #estados }

Solo hay uno que cambie el pronóstico:

| Estado | Qué significa |
|---|---|
| **Creado** | Está guardado pero **no afecta al pronóstico**. Se puede editar y borrar |
| **Aprobado** | Está rigiendo dentro de su rango de fechas |
| **Rechazado** | Se revisó y se decidió no aplicarlo |
| **Eliminado** | Se retiró. Un escenario aprobado no se borra: se archiva, para que quede el rastro |
| **Interrumpido** | Su procesamiento no terminó. No se puede editar ni borrar |

!!! warning "Aprobar un escenario es definitivo"

    La aplicación lo advierte antes de hacerlo, y conviene tomárselo en serio: **un escenario
    aprobado no se puede modificar**. Si hay que corregirlo, se archiva y se crea otro. Y no
    se puede aprobar un escenario cuya fecha de fin ya pasó.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver solo lo que está rigiendo.** Los dos interruptores de la barra de la tabla acotan la
lista, y no son lo mismo:

- *En curso* — solo los **aprobados** cuyo rango incluye hoy. Es decir: lo que está
  cambiando el pronóstico en este momento.
- *Vigentes y programados* — los que rigen hoy **más** los que están programados con fecha
  de fin de hoy en adelante.

Cuando alguien pregunta «¿por qué el pronóstico de este producto dice esto?», *En curso* es
el primer sitio donde mirar.

**Crear un escenario.** **Crear escenario** abre una mesa de trabajo con el pronóstico de
los productos que filtres, y ahí se corrigen las cifras. Hay tres formas de hacerlo, y la
pantalla las distingue después en el analizador:

- **Por productos** — se eligen filas y se escriben los valores.
- **Por incremento sobre un filtro** — se aplica un porcentaje de aumento o disminución a
  todo lo que caiga bajo un filtro, sin tener que tocar producto por producto.
- **Desde un archivo** — con **Subir escenario**: se descarga la plantilla, se llena y se
  sube.

El trabajo a medio hacer se guarda como borrador, así que salir de la pantalla no lo pierde.

**Revisar uno.** **Ver detalles** abre el escenario con su **Analizador**, que responde tres
preguntas: de dónde salió (modo de creación, quién lo hizo, y el detalle de qué se cambió),
cuánto movió en total —el *uplift* absoluto y porcentual, original contra modificado— y, si
se creó desde un archivo, el archivo mismo para descargarlo.

**Editar, aprobar, rechazar o retirar.** Desde la lista y desde el detalle, según el estado.
Editar solo cambia el nombre y los comentarios; las cifras se corrigen en la mesa de trabajo.

**Buscar, filtrar y exportar.** La búsqueda por nombre, los **Filtros** de la aplicación y
la exportación a Excel o CSV funcionan como en el resto de las listas.

## Qué necesita para funcionar { #requisitos }

- **Fechas futuras.** Un escenario corrige el pronóstico, y el pronóstico solo existe hacia
  adelante: no se puede modificar el de días que ya pasaron.
- **Permiso de escritura** para crear, editar, aprobar o borrar. Con solo lectura la lista
  se ve, pero las acciones de cada fila no aparecen.
- **El permiso `planning.scenarios`** para entrar a la pantalla.
- **Que el archivo coincida con el intervalo**, si se sube uno: si la plantilla viene
  agregada por semana y en la pantalla está elegido *Día*, la carga se rechaza.

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Alertas de Forecast](alertas-de-forecast.md)
- [Demanda y Promociones](demanda-y-promociones.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
