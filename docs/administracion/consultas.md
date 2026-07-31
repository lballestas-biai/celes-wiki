---
title: Consultas
module: Administración
route: /administration/configuration/query-builder
aliases: []
permission: administration.configuration.query-builder
audience: [Administradores, Implementadores]
summary: >
  Consultas es el inventario de las consultas que alimentan los reportes y las tablas de Celes.
  Cada una define qué datos trae una pantalla; desde aquí se ven, se buscan, se duplican para
  crear variantes y se dan de baja.
keywords: [consultas, reportes, inventario, duplicar, configuración avanzada]
tenant_variance: high
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdminstrationQueryBuilder/AdministrationQueryBuilderPage/AdministrationQueryBuilderPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Consultas

!!! warning "Esta página no lleva captura, y es a propósito"

    Se capturó la pantalla y **se decidió no publicarla**. El listado muestra, en su primera
    columna, los identificadores internos con los que están armados los reportes, y esta wiki no
    publica esas interioridades: cambian sin aviso y no significan nada para quien usa el
    producto. Es la única pantalla de Administración en la que el contenido de la propia tabla
    entra en conflicto con esa regla, así que la página se queda en borrador: describe para qué
    sirve la pantalla, sin retratar lo que hay dentro.

## Qué es y para qué sirve { #que-es }

Las tablas y los reportes de Celes no traen sus columnas de fábrica: cada uno se apoya en una
**consulta** que define qué datos pide y cómo los presenta. Eso es lo que permite que dos
empresas vean el mismo reporte con columnas distintas, adaptadas a lo que cada una mide.

Esta pantalla es el inventario de esas consultas. Es la más técnica de Administración y la que
menos conviene tocar sin acompañamiento: un cambio aquí no afecta a una pantalla, afecta a
**todos los que usan la pantalla**.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver el inventario.** La tabla lista cada consulta con su identificador, su **Descripción**, su
**Tipo** —si alimenta una tabla o una gráfica—, la aplicación a la que sirve y **quién la creó y
quién la actualizó** por última vez. Esas dos últimas columnas son las útiles cuando hay que
averiguar por qué un reporte cambió.

**Buscar.** El buscador filtra contra el servidor y **queda en la dirección de la pantalla**, así
que un enlace a una búsqueda concreta se puede compartir o guardar, y los botones de atrás y
adelante del navegador funcionan como se espera.

**Duplicar una consulta.** Es la acción más práctica de la pantalla: copiar una consulta
existente para hacer una variante sin arriesgar la original. Lo recomendable, cuando hay que
probar un cambio, es duplicar y trabajar sobre la copia.

**Abrir el detalle.** Cada consulta tiene su pantalla de detalle, donde se define su contenido.
Esa configuración es trabajo de implementación y **no se documenta en esta wiki**: si necesitas
un cambio, el camino es pedirlo al equipo de Celes.

**Eliminar.** Pide confirmación. Dar de baja una consulta que una pantalla todavía usa deja esa
pantalla sin datos.

!!! danger "Esta pantalla puede dejar reportes en blanco"

    Modificar o eliminar una consulta afecta a la pantalla que la usa, para todos los usuarios y
    de inmediato. Si un reporte dejó de mostrar filas o empezó a fallar justo después de un
    cambio de configuración, este inventario —y sus columnas de quién actualizó y cuándo— es el
    primer sitio donde mirar.

!!! info "Para cambiar columnas hay pantallas menos arriesgadas"

    Si lo que quieres es que un reporte muestre otra columna, o que se pueda filtrar por un
    campo más, revisa antes [Columnas](columnas.md) y [Filtros](filtros.md): resuelven la mayoría
    de esos pedidos sin tocar la consulta.

## Qué necesita para funcionar { #requisitos }

- **Conocimiento del modelo de datos de tu instancia.** Es una pantalla de implementación, no de
  operación diaria.
- **El permiso `administration.configuration.query-builder`**, y el de edición sobre él para
  duplicar, modificar o eliminar.

## Conceptos relacionados { #conceptos }

- [Columnas](columnas.md)
- [Filtros](filtros.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [Configuración General](configuracion-general.md)
- [Reportes](../reportes/index.md)
