---
title: Roles y Permisos
module: Administración
route: /administration/access-control/roles-and-permissions
aliases: []
permission: administration.access-control.roles-and-permissions
audience: [Administradores]
summary: >
  Roles y Permisos define los paquetes de acceso que se asignan a las personas. Cada rol dice
  qué pantallas alcanza y, en cada una, si el usuario solo consulta, puede modificar o puede
  ejecutar. También fija a qué pantalla entra quien lo tenga.
keywords: [roles, permisos, lector, editor, ejecutor, prioridad, página predeterminada]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationRolesAndPermissionsPage/AdministrationRolesAndPermissionsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/helpers.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/hooks/queries/useTenantUserRolesPermissionsQuery.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Roles y Permisos

## Qué es y para qué sirve { #que-es }

Un rol es una respuesta a la pregunta «¿qué puede hacer alguien con este cargo?». Aquí se
escriben esas respuestas una vez y se reutilizan: en [Usuarios](usuarios.md) se asignan
personas a roles, no permisos a personas.

Cada permiso de un rol tiene dos partes que conviene no confundir: **a qué pantalla llega** y
**qué puede hacer allí**.

![Roles y Permisos: la lista de roles con su prioridad y su página predeterminada; cada uno se
despliega en sus permisos.](../assets/screenshots/administracion/roles-y-permisos.png)

## Los tres niveles de acción { #acciones }

Un permiso no es un sí o un no: es uno de tres niveles, y cada uno incluye al anterior.

| Nivel | Qué habilita |
|---|---|
| **Lector** | Entrar a la pantalla y consultarla. Los botones que modifican algo aparecen deshabilitados. |
| **Editor** | Todo lo anterior, más crear, modificar y eliminar. |
| **Ejecutor** | Todo lo anterior, más lanzar procesos desde la pantalla —generar una orden, disparar una ejecución—. |

La jerarquía es real y se aplica igual en la interfaz y en el servidor: **quien es Ejecutor
nunca tiene menos que un Editor**. Eso importa al revisar un rol: no hace falta concederle
Editor «además de» Ejecutor.

Cuando una persona tiene **varios roles**, para cada pantalla queda con **el nivel más alto**
que le dé cualquiera de ellos. Quitarle un permiso a alguien exige revisarle todos los roles,
no solo el principal.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver los roles de un vistazo.** La lista muestra, por rol, su **Nombre del rol**, su
**Prioridad**, su **Página predeterminada** y sus **Acciones**. Un rol sin página predeterminada
deja esa celda vacía.

**Revisar un rol permiso por permiso.** Cada fila se despliega en la lista de permisos del rol,
con el nivel concedido en cada uno. Un permiso puede estar marcado como **Inactivo**: sigue
escrito en el rol pero no concede nada.

**Buscar por rol o por permiso.** El buscador atraviesa las dos cosas. Buscar por permiso es
la forma de responder «¿quiénes pueden tocar esto?», que es la pregunta difícil cuando hay
muchos roles.

**Crear un rol.** El botón **Crear rol** pide el nombre y admite un **rol padre**, del que
hereda. Dos campos más gobiernan el comportamiento del rol:

- **Prioridad** — cuando alguien tiene varios roles, el de mayor prioridad decide a qué
  pantalla entra al iniciar sesión.
- **Página predeterminada** — cuál es esa pantalla.

**Actualizar y eliminar.** Eliminar un rol pide escribir su nombre para confirmar; si no
coincide, no se borra.

!!! warning "La página predeterminada tiene que ser una que el rol vea"

    Si el rol aterriza en una pantalla que sus propios permisos no alcanzan, quien lo tenga
    entrará a un aviso de falta de permiso en cada inicio de sesión. Al cambiar los permisos
    de un rol, revisa que su página predeterminada siga estando entre las que puede ver.

!!! info "Cómo se traduce un permiso en una pantalla"

    El nombre de un permiso reproduce la dirección de la pantalla que abre, por niveles:
    módulo, sección y —cuando existe— sub-sección. En **Administración**, conceder un permiso
    de un nivel más profundo alcanza también a la pantalla que lo contiene, y conceder el de
    la sección alcanza a sus pantallas hijas. Por eso quien tiene una sola pantalla de una
    sección puede entrar a la sección: entra, y ve la pestaña que sí tiene.

## Qué necesita para funcionar { #requisitos }

- **Saber qué pantallas usa cada cargo** de tu empresa: el diseño de los roles es una
  decisión de negocio, no técnica.
- **El permiso `administration.access-control.roles-and-permissions`**, y el de edición sobre
  él para crear o modificar roles.

## Conceptos relacionados { #conceptos }

- [Usuarios](usuarios.md)
- [Permiso de datos](permiso-de-datos.md)
- [Control de Acceso](control-de-acceso.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
