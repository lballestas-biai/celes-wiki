---
title: Control de Acceso
module: Administración
route: /administration/access-control
aliases: []
permission: administration.access-control
audience: [Administradores]
summary: >
  Control de Acceso agrupa las tres pantallas que deciden quién entra a Celes y qué ve: las
  personas, los roles que les dan permiso sobre cada pantalla, y los permisos de datos que
  recortan la información dentro de esas pantallas.
keywords: [control de acceso, seguridad, usuarios, roles, permisos, visibilidad]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationAccessControlPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.access-control.index.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/components/UI/NavTabs/NavTabs.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: c98f195c5
---

# Control de Acceso

## Qué es y para qué sirve { #que-es }

Control de Acceso no es una pantalla con contenido propio: es la sección que reúne las tres
que responden, por separado, las tres preguntas del acceso.

| Pestaña | Qué responde |
|---|---|
| [Usuarios](usuarios.md) | **Quién** puede entrar. |
| [Roles y Permisos](roles-y-permisos.md) | **A qué pantallas** llega cada quien, y qué puede hacer en ellas. |
| [Permiso de datos](permiso-de-datos.md) | **Qué datos** ve dentro de esas pantallas. |

Separarlas tiene una consecuencia práctica: cuando alguien «no ve algo», la respuesta está en
una de las tres y casi nunca en la pantalla donde se reportó el problema. Si no ve la pantalla,
es su rol. Si la ve vacía o con menos de lo esperado, es su permiso de datos.

![Control de Acceso abre en Usuarios, con las tres pestañas de la sección en la parte
superior.](../assets/screenshots/administracion/usuarios.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Moverte entre las tres pantallas.** Las pestañas de arriba son la navegación de la sección.
La dirección de Control de Acceso, por sí sola, **te lleva a Usuarios**.

**Ver solo lo que tu rol alcanza.** Las pestañas se filtran con tus permisos: si tu rol solo
tiene una de las tres, es la única que aparece. No verás una pestaña que al abrirla te niegue
el paso.

!!! info "Entrar a la sección no exige el permiso de la sección"

    En Administración basta tener **una** de las pantallas de dentro para que la sección se
    abra: te deja en la que sí tienes. Y al contrario, quien tenga concedida la sección
    completa alcanza sus tres pantallas.

## Qué necesita para funcionar { #requisitos }

- **Al menos una de las tres pantallas concedida** en tu rol: la sección no tiene contenido
  propio que mostrar.
- **El permiso `administration.access-control`** o uno más específico dentro de él.

## Conceptos relacionados { #conceptos }

- [Usuarios](usuarios.md)
- [Roles y Permisos](roles-y-permisos.md)
- [Permiso de datos](permiso-de-datos.md)
- [Administración](index.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
