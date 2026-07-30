---
title: Reglas de Negocio
module: Activación
route: /activation/business-rules
aliases: [/administration/configuration/business-rules]
permission: activation.business-rules
audience: [Clientes, Usuarios]
summary: >
  Pendiente. Esta página es un esqueleto: todavía no describe la pantalla.
keywords: []
tenant_variance: unknown
status: draft
verified_at: 2026-07-29
sources:
  - repo: celes-platform
    path: apps/web-client/src/routeTree.gen.ts
    ref: 981f61942
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: 981f61942
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: 981f61942
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: 981f61942
---

# Reglas de Negocio

!!! warning "Página en construcción"
    Todavía no describe la pantalla. Lo único verificado por ahora es la ficha de
    abajo, derivada del código de la aplicación.

## Ficha de la pantalla { #ficha }

| | |
|---|---|
| **Dónde está** | Menú: Activación › Reglas de Negocio |
| **Dirección** | `/activation/business-rules` |
| **Quién la ve** | Usuarios con el permiso `activation.business-rules`. También la abre el permiso anterior `administration.configuration.business-rules`. |
| **Otras direcciones** | `/administration/configuration/business-rules` — llevan a esta misma pantalla |

## Qué es y para qué sirve { #que-es }

## Qué puedes hacer aquí { #que-puedes-hacer }

## Qué necesita para funcionar { #requisitos }

## Conceptos relacionados { #conceptos }
