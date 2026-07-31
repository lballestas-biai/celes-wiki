---
title: Datos Maestros
module: Administración
route: /administration/master-data
aliases: [/administration/data-manager]
permission: administration.master-data.mapping
audience: [Administradores, Implementadores]
summary: >
  Datos Maestros agrupa las tres pantallas del dato de entrada: subirlo, conectarlo con el
  modelo de Celes y vigilar que esté sano. Es la sección de la que depende todo lo demás,
  porque ningún cálculo es mejor que el dato con el que se hizo.
keywords: [datos maestros, gestión de datos, carga, homologación, calidad, integración]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataManagerPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.master-data.index.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: c98f195c5
---

# Datos Maestros

## Qué es y para qué sirve { #que-es }

Todo lo que Celes calcula sale de datos que pone tu empresa. Esta sección es donde esos datos
entran, se traducen al lenguaje del producto y se vigilan. No tiene contenido propio: agrupa
tres pantallas en pestañas.

| Pestaña | Para qué |
|---|---|
| [Carga de Datos](carga-de-datos.md) | Subir la información de cada entidad, o revisar que la integración automática la esté dejando. |
| [Homologación](homologacion.md) | Decir qué campo tuyo corresponde a cada campo del modelo de Celes. |
| [Calidad de Datos](calidad-de-datos.md) | Ver el resultado de las pruebas automáticas sobre lo que llegó. |

El orden en que están listadas es el orden en que se usan durante una implementación, y también
el orden en que conviene revisarlas cuando algo va mal: si un número no aparece, primero se
comprueba que el dato llegó, después que está mapeado, y después que pasó las pruebas.

![Datos Maestros abre en la pestaña disponible según tu permiso; aquí,
Homologación.](../assets/screenshots/administracion/homologacion.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Moverte entre las tres pantallas.** La dirección de la sección, por sí sola, **lleva a la
primera que tu rol alcance**: Carga de Datos si la tienes concedida y, si no, Homologación o
Calidad de Datos.

**Ver solo lo que tu rol alcanza.** Las pestañas se filtran con tus permisos.

!!! info "El orden de las pestañas cambia con tu permiso"

    Esta sección está en migración: se llamaba «Gestión de Datos» y hoy es **Datos Maestros**.
    Con el permiso anterior verás Carga de Datos primero; con el nuevo, Carga de Datos queda al
    final. Son las mismas tres pantallas y el mismo contenido — solo cambia el orden y la
    dirección. Los enlaces guardados de la dirección anterior siguen funcionando.

## Qué necesita para funcionar { #requisitos }

- **Al menos una de las tres pantallas concedida** en tu rol: la sección no tiene contenido
  propio.
- **El permiso `administration.master-data.mapping`**, o el de Calidad de Datos, o el anterior
  equivalente de Gestión de Datos.

## Conceptos relacionados { #conceptos }

- [Carga de Datos](carga-de-datos.md)
- [Homologación](homologacion.md)
- [Calidad de Datos](calidad-de-datos.md)
- [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
