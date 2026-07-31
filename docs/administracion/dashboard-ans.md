---
title: Dashboard ANS
module: Administración
route: /administration/sla-dashboard
aliases: []
permission: administration.sla-dashboard
audience: [Administradores]
summary: >
  Dashboard ANS mide el cumplimiento de los acuerdos de nivel de servicio del soporte de Celes:
  cuántos tickets se respondieron y resolvieron dentro del tiempo comprometido, por prioridad. Su
  pestaña de configuración define el horario de atención y los umbrales.
keywords: [ANS, SLA, soporte, tickets, cumplimiento, prioridad, umbrales, horario]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.sla-dashboard.index.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.sla-dashboard.dashboard.index.lazy.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.sla-dashboard.configuration.index.lazy.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Dashboard ANS

## Qué es y para qué sirve { #que-es }

Un acuerdo de nivel de servicio solo sirve si alguien lo mide. Esta pantalla mide el del soporte:
de los tickets que tu empresa ha abierto, cuántos se **respondieron** y cuántos se **resolvieron**
dentro del tiempo comprometido para su prioridad.

Es la pantalla que se lleva a una reunión de seguimiento con Celes: no discute casos, discute
tendencia y cumplimiento.

![Dashboard ANS: las seis tarjetas de cumplimiento del periodo y, debajo, el desglose por
prioridad.](../assets/screenshots/administracion/dashboard-ans.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

La pantalla tiene dos pestañas: **Dashboard** y **Configuración**. La dirección de la pantalla
lleva al **Dashboard**.

### Dashboard

**Ver los indicadores del periodo.** Seis cifras resumen el estado: **Total de tickets**,
**Cumplimiento de respuesta**, **Cumplimiento de resolución**, **Tickets vencidos**, **Tiempo
promedio de respuesta** y **Tiempo promedio de resolución**.

La diferencia entre los dos cumplimientos es la que suele importar: responder rápido y resolver
tarde da un perfil distinto de responder tarde y resolver rápido, y se corrigen de maneras
distintas.

**Acotar el periodo.** Un selector de rango de fechas en la esquina superior derecha; abre sobre
el mes en curso.

**Desglosar por prioridad.** La tabla trae **una fila por prioridad con tickets** —**Crítico**,
**Alta**, **Medio**, **Baja**— y para cada una el **Total** y cuántos quedaron con respuesta y
resolución **cumplidas** o **vencidas**. Un incumplimiento en Crítico no se lee igual que el mismo
número en Baja.

### Configuración

**Definir el horario de atención.** Se declara la **zona horaria** y, día por día —de lunes a
domingo—, si está **activo** y su hora de **inicio** y **fin**. Esto es lo que convierte «cuatro
horas» en un compromiso interpretable: las horas se cuentan **dentro del horario laboral**, no en
tiempo corrido.

**Fijar los umbrales.** Para cada prioridad se define el **tiempo de respuesta** y el **tiempo de
resolución** comprometidos, y si cada uno se mide contra el horario laboral o en tiempo corrido.

**Guardar.** El guardado es explícito y la pantalla confirma el resultado.

!!! warning "Cambiar los umbrales cambia el histórico que ves"

    El cumplimiento se calcula comparando los tiempos reales con los umbrales configurados. Si se
    ajusta un umbral, **el porcentaje de periodos anteriores también cambia**, porque se recalcula
    con la configuración vigente. Conviene acordar los umbrales una vez y no moverlos para
    interpretar un periodo.

!!! info "No está habilitada en todas las instancias"

    Es de las pantallas que dependen del permiso `administration.sla-dashboard`, y no todas las
    implementaciones lo tienen concedido. Si no la ves en el menú de Administración, es que tu
    instancia no la tiene.

## Qué necesita para funcionar { #requisitos }

- **Tickets de soporte registrados** en el periodo que quieras medir.
- **El horario de atención y los umbrales configurados** en la segunda pestaña: sin ellos el
  cumplimiento no se puede calcular.
- **El permiso `administration.sla-dashboard`**, que alcanza también a sus dos pestañas.

## Conceptos relacionados { #conceptos }

- [Soporte](../recursos/soporte.md)
- [Historial de Jobs](historial-de-jobs.md)
- [Administración](index.md)
