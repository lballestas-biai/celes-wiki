---
title: Permiso de datos
module: Administración
route: /administration/access-control/data-permission
aliases: []
permission: administration.access-control.data-permission
audience: [Administradores]
summary: >
  Permiso de datos recorta qué información ve cada quien dentro de las pantallas que ya tiene
  concedidas. Un rol decide a qué pantalla entras; un permiso de datos decide si en esa
  pantalla ves toda la empresa o solo tus tiendas, tu región o tu categoría.
keywords: [permiso de datos, restricción, filtro, conjunto de filtros, visibilidad, alcance]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataPermissionPage/AdministrationDataPermissionPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: c98f195c5
---

# Permiso de datos

## Qué es y para qué sirve { #que-es }

Hay dos preguntas distintas sobre el acceso, y Celes las contesta en pantallas distintas:

- **¿A qué pantallas entra esta persona?** Lo deciden sus roles, en
  [Roles y Permisos](roles-y-permisos.md).
- **¿Qué datos ve cuando entra?** Lo decide un permiso de datos, aquí.

Un jefe de zona y el director comercial pueden usar exactamente la misma pantalla y tener que
ver números distintos: uno los de su zona, el otro los de todas. Eso es lo que se configura
aquí, y se hace **una vez** en lugar de repetir un filtro en cada consulta.

![Permiso de datos: la lista de conjuntos de filtros configurados, con el selector de tipo y
sus acciones por fila.](../assets/screenshots/administracion/permiso-de-datos.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir a qué se aplica la restricción.** El selector de la parte superior cambia entre tres
tipos, y cada uno responde a una necesidad distinta:

| Tipo | A quién restringe |
|---|---|
| **Usuarios** | A una persona concreta. Es el caso del jefe de zona que solo debe ver su zona. |
| **Aplicaciones** | A una pantalla o funcionalidad, para todos los que la usen. |
| **Datamarts** | <!-- denylist-ok: almacen-de-datos — «Datamart» es la etiqueta literal del selector de esta pantalla; se nombra el control, no un conjunto de datos interno --> Al conjunto de datos completo, con lo que la restricción alcanza a todo lo que se construya sobre él. |

**Ver los conjuntos configurados.** La tabla lista, para el tipo seleccionado, cada conjunto
de filtros con su nombre, el tipo y —cuando aplica— a qué persona o aplicación pertenece.

**Crear y editar un conjunto.** El botón de crear abre el mismo diálogo de filtros que usan
los reportes: se eligen columnas y valores, y esa combinación queda guardada con un nombre.
Editar uno abre el diálogo con las condiciones que ya tenía.

**Eliminar.** Cada fila lleva la acción de eliminar, que pide confirmación antes de borrar.

!!! warning "Quitar un permiso de datos amplía lo que se ve, no lo reduce"

    Un conjunto de filtros es una **restricción**. Si lo eliminas, la persona o la aplicación
    dejan de estar limitadas y pasan a ver todo lo que su rol alcance. Es el error de sentido
    más común en esta pantalla: al depurar la lista se amplían accesos sin querer.

!!! info "Por qué dos personas ven totales distintos"

    Cuando alguien reporta que un número «no cuadra» con el de un compañero, y las dos
    pantallas y filtros son los mismos, lo primero que hay que mirar es esta pantalla: es la
    causa habitual. Un permiso de datos no se anuncia en el reporte — actúa por debajo, y el
    total sale más pequeño sin decir por qué.

## Qué necesita para funcionar { #requisitos }

- **Saber cómo se reparte la responsabilidad** en tu empresa: por tienda, por región, por
  categoría o por proveedor. La restricción se escribe sobre las columnas que existan para
  eso.
- **Los usuarios ya creados** en [Usuarios](usuarios.md), si vas a restringir por persona.
- **El permiso `administration.access-control.data-permission`**, y el de edición sobre él
  para crear o modificar.

## Conceptos relacionados { #conceptos }

- [Usuarios](usuarios.md)
- [Roles y Permisos](roles-y-permisos.md)
- [Filtros](filtros.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
