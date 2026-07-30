---
title: Dashboard ANS
module: Administración
route: /administration/sla-dashboard
aliases: []
permission: administration.sla-dashboard
audience: [Administradores]
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

# Dashboard ANS

!!! warning "Página en construcción"
    Todavía no describe la pantalla. Lo único verificado por ahora es la ficha de
    abajo, derivada del código de la aplicación.

## Ficha de la pantalla { #ficha }

| | |
|---|---|
| **Dónde está** | Menú: Administración › Dashboard ANS |
| **Dirección** | `/administration/sla-dashboard` |
| **Quién la ve** | Usuarios con el permiso `administration.sla-dashboard`, o con uno más específico dentro de él. |
| **Incluye** | Configuración (`/administration/sla-dashboard/configuration`)<br>Dashboard (`/administration/sla-dashboard/dashboard`) |

## Qué es y para qué sirve { #que-es }

## Qué puedes hacer aquí { #que-puedes-hacer }

## Qué necesita para funcionar { #requisitos }

## Conceptos relacionados { #conceptos }
