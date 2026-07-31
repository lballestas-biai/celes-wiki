---
title: Calendario de Compras
module: Pronóstico
route: /planning/procurement-calendar
aliases: []
permission: planning.procurement-calendar
audience: [Clientes, Usuarios]
summary: >
  Esta entrada del menú de Pronóstico todavía no tiene pantalla: la dirección existe y
  responde, pero no muestra nada. El calendario de compras que sí funciona es el de
  Reabastecimiento.
keywords: [calendario de compras, no disponible]
tenant_variance: none
status: draft
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.planning.procurement-calendar.index.lazy.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: fd8a12056
---

# Calendario de Compras

!!! warning "Esta pantalla todavía no existe"

    *Calendario de Compras* aparece en el menú de Pronóstico y su dirección
    (`/planning/procurement-calendar`) responde, pero **la pantalla no está implementada**:
    quien entre no verá ningún calendario. No es un problema de configuración de tu
    instancia ni de permisos.

    Esta página se queda en borrador a propósito. No documentamos una pantalla que no
    existe, y se actualizará cuando exista o cuando la entrada salga del menú.

## Qué hay mientras tanto { #alternativa }

Si lo que buscas es el calendario de las órdenes de compra —qué se pide, a quién y qué
día—, la pantalla que lo hace es
[Calendario de Órdenes de Compra](../reabastecimiento/calendario-de-oc.md), en
Reabastecimiento. Son pantallas distintas y esa sí está en producción.

Si lo que buscas es el calendario de promociones, se abre desde
[Campañas](../promociones/campanas.md#calendario); el de eventos es
[Calendario de Eventos](calendario-de-eventos.md).

## Conceptos relacionados { #conceptos }

- [Pronóstico](index.md)
- [Calendario de Órdenes de Compra](../reabastecimiento/calendario-de-oc.md)
