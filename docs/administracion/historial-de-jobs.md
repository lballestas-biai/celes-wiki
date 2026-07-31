---
title: Historial de Jobs
module: Administración
route: /administration/job-history
aliases: []
permission: administration.job-history
audience: [Administradores]
summary: >
  Historial de Jobs lista los procesos que se han lanzado en tu instancia —importaciones,
  exportaciones, generaciones masivas— con su estado y su resultado. Es donde se comprueba si
  algo que se mandó a ejecutar terminó bien.
keywords: [historial de jobs, procesos, importación, exportación, estado, resultado]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationJobHistoryPage/AdministrationJobHistoryPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Historial de Jobs

## Qué es y para qué sirve { #que-es }

Varias acciones de Celes no terminan cuando cierras el diálogo: se van a ejecutar por detrás.
Subir un archivo de parámetros, exportar un listado grande o lanzar una generación masiva son
procesos que siguen su curso mientras tú sigues trabajando.

Esta pantalla es el registro de esos procesos. Sirve para contestar dos preguntas concretas:
**¿terminó?** y, si terminó mal, **¿por qué?**

![Historial de Jobs: las ejecuciones de la instancia con su tipo, su estado y su fecha, y el
acceso al resultado de cada una.](../assets/screenshots/administracion/historial-de-jobs.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver las ejecuciones.** La tabla lista los procesos con su tipo, a qué apuntan, su estado y
cuándo se lanzaron. Es una lista paginada contra el servidor, así que el total del pie es el
número real de la instancia.

**Abrir el resultado de uno.** Cada fila lleva al detalle de su respuesta: es donde está el
motivo cuando un proceso falló, o el recuento de lo procesado cuando terminó bien. Un archivo
importado que «no hizo nada» casi siempre tiene aquí la explicación —filas omitidas por
validación, por ejemplo—.

**Conservar tu vista.** La configuración de la tabla —columnas, orden— se recuerda entre
visitas.

!!! info "No es el historial de los cálculos diarios"

    Aquí están los procesos **que alguien lanzó** desde la aplicación. El pronóstico nocturno,
    la distribución automática y las cargas programadas son otra cosa: su estado se sigue en
    [Calidad de Datos](calidad-de-datos.md), en
    [Automatización & Operación](../reabastecimiento/automatizacion-y-operacion.md) y en el
    [ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).

## Qué necesita para funcionar { #requisitos }

- **Que se haya lanzado algún proceso**: en una instancia recién montada la lista está vacía y
  eso es correcto.
- **El permiso `administration.job-history`.**

## Conceptos relacionados { #conceptos }

- [Parámetros Generales](parametros-generales.md)
- [Carga de Datos](carga-de-datos.md)
- [Calidad de Datos](calidad-de-datos.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
