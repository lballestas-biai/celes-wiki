---
title: Logs de Usuarios
module: Administración
route: /administration/users-logs
aliases: []
permission: administration.users-logs
audience: [Administradores]
summary: >
  Logs de Usuarios es el registro de auditoría de las acciones que los usuarios ejecutan en
  Celes, consultable por rango de fechas. Hoy la pantalla no devuelve resultados: la consulta al
  servicio de auditoría falla, y eso está reportado.
keywords: [logs de usuarios, auditoría, registro, acciones, rango de fechas]
tenant_variance: unknown
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationUsersLogsPage/AdministrationUsersLogsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationUsersLogsPage/hooks/queries/useGetUsersLogsQuery.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Logs de Usuarios

!!! danger "Hoy esta pantalla no devuelve datos"

    La pantalla carga y sus controles funcionan, pero **la consulta al servicio de auditoría
    falla** y la tabla queda vacía en cualquier rango de fechas. Se comprobó en tres instancias
    distintas, así que no es un problema de una implementación concreta.

    Importa decirlo con claridad: **una tabla vacía aquí no significa que nadie haya hecho nada.**
    Significa que no se pudo consultar. Mientras esté así, esta pantalla no sirve como evidencia
    de auditoría. Está reportado y esta página se completará cuando responda.

## Qué es y para qué sirve { #que-es }

Cuando hay que responder «¿quién cambió esto, y cuándo?», la respuesta debería estar aquí. Logs de
Usuarios es el registro de auditoría: qué acciones ejecutaron los usuarios de tu instancia, con
quién las hizo y a qué hora.

Es una pantalla de control, no de operación: se usa al revisar un cambio inesperado de
configuración o al hacer una revisión periódica de accesos.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir el periodo.** Hay atajos de rango —**Hoy**, **Ayer**, **7 días**, **30 días**, **3
meses**, **6 meses**— y la opción de un rango a medida. La pantalla abre en **Hoy**.

Ojo con un detalle práctico: el rango **no queda en la dirección** de la pantalla, así que un
enlace a esta pantalla siempre abre en «Hoy» y hay que volver a elegir el periodo.

**Ver las acciones registradas.** La tabla trae, por registro, el **correo electrónico** de quien
la ejecutó, el **nombre de la acción**, la **fecha y hora ejecutada**, el **tipo de log** y el
**origen**.

**Abrir el detalle de una acción.** Cada fila se despliega y muestra los datos de la acción: sobre
qué objeto se hizo y con qué valores.

**Filtrar por acción.** El panel de filtros permite acotar a un tipo de acción concreto.

!!! info "No registra todo lo que pasa en Celes"

    El alcance de este registro es acotado: no es una traza completa de la actividad. Para los
    procesos que alguien lanza desde la aplicación —importaciones, exportaciones, generaciones
    masivas— el registro completo está en [Historial de Jobs](historial-de-jobs.md), y para los
    cálculos automáticos, en [Calidad de Datos](calidad-de-datos.md) y
    [Automatización & Operación](../reabastecimiento/automatizacion-y-operacion.md).

## Qué necesita para funcionar { #requisitos }

- **Que el servicio de auditoría responda.** Es la condición que hoy no se cumple.
- **El permiso `administration.users-logs`.**

## Conceptos relacionados { #conceptos }

- [Historial de Jobs](historial-de-jobs.md)
- [Usuarios](usuarios.md)
- [Roles y Permisos](roles-y-permisos.md)
- [Dashboard ANS](dashboard-ans.md)
