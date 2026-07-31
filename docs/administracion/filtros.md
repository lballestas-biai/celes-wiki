---
title: Filtros
module: Administración
route: /administration/configuration/app-filters
aliases: []
permission: administration.configuration.app-filters
audience: [Administradores, Implementadores]
summary: >
  Filtros decide, para cada aplicación de Celes, por qué columnas se puede filtrar. Lo que se
  habilita aquí es lo que después aparece en el panel de filtros de esa pantalla; lo que no
  está aquí, no se puede filtrar allí.
keywords: [filtros, aplicación, columnas, panel de filtros, configuración]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationAppFiltersPage/AdministrationAppFiltersPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Filtros

## Qué es y para qué sirve { #que-es }

Cuando un usuario abre el panel de filtros de un reporte y no encuentra la columna que
necesita, la causa está aquí: esa columna no está habilitada para esa aplicación.

Esta pantalla es la que decide, aplicación por aplicación, **qué se puede filtrar**. Cada
aplicación —cada pantalla o funcionalidad de Celes que consulta datos— tiene su lista de
columnas habilitadas, y es la que el panel de filtros ofrece al usuario.

![Filtros: las aplicaciones agrupadas en secciones desplegables, cada una con las columnas que
tiene habilitadas.](../assets/screenshots/administracion/filtros.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver qué puede filtrar cada aplicación.** La lista se agrupa en secciones desplegables, con el
recuento de aplicaciones de cada una. Cada tarjeta muestra la aplicación, su origen de datos y
**cuántas columnas** tiene habilitadas; **Ver columnas** las despliega. La barra de
herramientas permite expandir o contraer todo y buscar una aplicación por nombre.

**Crear un filtro de aplicación.** El botón **Nuevo filtro** da de alta la configuración de una
aplicación que todavía no la tiene.

**Agregar o quitar columnas.** **Agregar Columnas** abre la lista de las disponibles y deja
elegir las que se habilitan. Las columnas que se pueden ofrecer salen del catálogo de
[Columnas](columnas.md): si una no está en el catálogo, aquí no aparece.

**Cambiar el origen de datos de la aplicación.** Es la acción de más consecuencias de esta
pantalla, y por eso pide confirmación con una vista previa que dice exactamente qué va a pasar:
cuántas columnas **se re-mapearán** al nuevo origen y cuántas **se eliminarán** porque no
existen en él. Desde ese mismo diálogo se puede re-mapear las coincidencias o limpiar todas las
columnas.

**Eliminar.** Quitar la configuración de una aplicación la deja sin filtros propios.

!!! warning "Cambiar el origen puede dejar una pantalla sin filtros"

    Las columnas que no existan en el nuevo origen **se eliminan de la configuración**. El
    diálogo las lista antes de aplicar, y las que falten se pueden volver a añadir desde
    [Columnas](columnas.md). Conviene leer ese listado y no aceptar de corrido.

!!! info "Habilitar un filtro no es dar acceso al dato"

    Esto decide **qué se puede filtrar**, no **qué se puede ver**. Recortar la información que
    alcanza cada persona es otra cosa y se hace en
    [Permiso de datos](permiso-de-datos.md).

## Qué necesita para funcionar { #requisitos }

- **El catálogo de [Columnas](columnas.md) poblado** para el origen de datos de la aplicación:
  es de ahí de donde salen las columnas que se pueden habilitar.
- **El permiso `administration.configuration.app-filters`**, y el de edición sobre él para
  modificar.

## Conceptos relacionados { #conceptos }

- [Columnas](columnas.md)
- [Permiso de datos](permiso-de-datos.md)
- [Consultas](consultas.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [Configuración General](configuracion-general.md)
