---
title: Usuarios
module: Administración
route: /administration/access-control/users
aliases: []
permission: administration.access-control.users
audience: [Administradores]
summary: >
  Usuarios es el registro de quién puede entrar a Celes en tu empresa. Cada persona se crea
  con un correo y se le asignan uno o más roles, y son esos roles —no la persona— los que
  deciden qué pantallas ve y qué puede modificar en ellas.
keywords: [usuarios, alta de usuario, roles, acceso, correo, invitar]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationUsersPage/AdministrationUsersPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationAccessControlPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.access-control.index.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Usuarios

## Qué es y para qué sirve { #que-es }

Toda la seguridad de Celes cuelga de dos listas: la de personas y la de roles. Esta pantalla
mantiene la primera.

Aquí no se conceden permisos uno por uno. Se da de alta a la persona y se le asignan
**roles**, que son paquetes de permisos definidos en
[Roles y Permisos](roles-y-permisos.md). Eso mantiene el control manejable: cuando cambia lo
que puede hacer un cargo, se cambia el rol y no las treinta personas que lo tienen.

![Usuarios: la lista de personas con acceso a la instancia, con sus roles y su estado, y el
botón para crear una nueva.](../assets/screenshots/administracion/usuarios.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver quién tiene acceso.** La tabla lista las personas de tu instancia con cuatro columnas:
**Nombre**, **Correo**, **Código interno** y **Estado** —Activo o Inactivo—. Los roles de cada
persona no están en la tabla: se consultan y se cambian abriendo su detalle. Al pie aparece el
total de usuarios de la instancia, que no es el de la página que estás viendo.

**Buscar.** El buscador filtra por lo que escribas y consulta al servidor, así que encuentra
personas que no están en la página actual. La búsqueda espera a que termines de escribir
antes de disparar.

**Crear un usuario.** **Crear Usuario** abre el formulario de alta. Lo esencial es el correo
—es la identidad con la que la persona inicia sesión— y los roles.

**Ver el detalle, editar y eliminar.** Cada fila lleva su menú de acciones al final, en una
columna que se queda fija a la derecha aunque desplaces la tabla: **ver detalles**, **editar** y
**eliminar**. El detalle es donde están los roles de la persona, sus bodegas y sus permisos de
datos. Eliminar **pide que escribas el correo del usuario** para confirmar: es una salvaguarda
deliberada contra el borrado por descuido.

**Exportar la lista.** El botón de exportar baja el listado completo a Excel, que es la forma
práctica de auditar accesos o de pasarle la lista a alguien que no entra a Celes.

!!! info "Ver no es poder cambiar"

    Las acciones de escritura —crear, editar, eliminar— solo se habilitan si tu rol tiene
    permiso de **edición** sobre esta pantalla. Con permiso de solo lectura la pantalla se ve
    completa y los botones aparecen deshabilitados. Es lo mismo en todas las pantallas de
    Administración; el detalle está en [Roles y Permisos](roles-y-permisos.md).

!!! tip "Es la pantalla de entrada de Administración"

    Tanto **Administración** como **Control de Acceso** llevan aquí cuando no indicas una
    pantalla concreta. Si tu rol no alcanza a Usuarios, esas dos direcciones te dejarán en un
    aviso de falta de permiso: entra por la pantalla de Administración que sí tengas
    concedida.

## Qué necesita para funcionar { #requisitos }

- **Al menos un rol definido** en [Roles y Permisos](roles-y-permisos.md): un usuario sin rol
  entra pero no ve nada.
- **El correo corporativo de la persona**, que es su identidad de acceso.
- **El permiso `administration.access-control.users`** para ver la pantalla, y el de edición
  sobre él para crear o modificar.

## Conceptos relacionados { #conceptos }

- [Control de Acceso](control-de-acceso.md)
- [Roles y Permisos](roles-y-permisos.md)
- [Permiso de datos](permiso-de-datos.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
