---
title: Asignación de Datos
module: Administración
route: /administration/configuration/data-allocation
aliases: []
permission: administration.configuration.data-allocation
audience: [Administradores]
summary: >
  Asignación de Datos aparece como pestaña de Configuración General, pero la pantalla no está
  implementada: su dirección responde con un texto de relleno. No hay funcionalidad que
  documentar todavía.
keywords: [asignación de datos, pendiente, no implementada]
tenant_variance: unknown
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.configuration.data-allocation.index.lazy.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationConfigurationPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: c98f195c5
---

# Asignación de Datos

!!! warning "Esta pantalla todavía no existe"

    El nombre está declarado y la dirección responde, pero **no hay pantalla detrás**: lo que se
    dibuja es un texto de relleno, sin ninguna funcionalidad. Está anotado como pendiente y esta
    página se escribirá cuando la pantalla exista.

## Qué es y para qué sirve { #que-es }

Nada, por ahora. «Asignación de Datos» figura en la lista de pestañas de
[Configuración General](configuracion-general.md) y tiene su propio permiso reservado, pero
detrás no hay funcionalidad construida.

En la práctica no la vas a encontrar: la pestaña **solo se muestra a quien tenga concedido su
permiso**, y ese permiso no está habilitado en las instancias revisadas. Si aparece en tu
Configuración General y al abrirla ves un texto sin sentido, no es un error de tu instancia — es
el estado real de la pantalla.

## Qué puedes hacer aquí { #que-puedes-hacer }

Nada todavía.

## Qué necesita para funcionar { #requisitos }

- Que la pantalla se construya.

## Conceptos relacionados { #conceptos }

- [Configuración General](configuracion-general.md)
- [Homologación](homologacion.md) — si lo que buscas es asociar tus datos al modelo de Celes, esa
  es la pantalla que lo hace.
- [Permiso de datos](permiso-de-datos.md) — si lo que buscas es limitar qué datos ve cada
  usuario.
