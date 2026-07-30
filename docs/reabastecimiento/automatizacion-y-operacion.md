---
title: Automatización & Operación
module: Reabastecimiento
route: /work-area/automation
aliases: [/administration/operation]
permission: work-area.automation
audience: [Clientes, Usuarios, Administradores]
summary: >
  Automatización & Operación es donde se programa que las órdenes se generen y se envíen
  solas, y donde se vigila que eso esté pasando. Agrupa cuatro pestañas: distribución
  automática, compra automática, configuración de pipeline y trazabilidad de entregas.
keywords: [automatización, operación, programación, ejecución automática, pestañas]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationOperationPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.work-area.automation.index.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: d20adaaea
---

# Automatización & Operación

## Qué es y para qué sirve { #que-es }

Revisar un sugerido y enviarlo a mano es lo correcto mientras alguien tenga algo que
aportar. Cuando no lo tiene —un reparto rutinario, una compra que siempre sale igual el
mismo día—, ese trabajo se puede programar: eso es lo que se configura aquí.

No es una pantalla sino un contenedor con **cuatro pestañas**, que cubren el ciclo entero:
programar, definir cómo se calcula, y comprobar que el resultado llegó a su destino.

![Las cuatro pestañas del módulo, sobre la lista de configuraciones de distribución
automática.](../assets/screenshots/reabastecimiento/distribucion-automatica.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

| Pestaña | Para qué | Página |
|---|---|---|
| **Distribución Automática** | Programar el reparto a las tiendas | [Distribución Automática](distribucion-automatica.md) |
| **Compra Automática** | Programar las órdenes al proveedor | [Compra Automática](compra-automatica.md) |
| **Configuración de Pipeline** | Definir el flujo de cálculo de un módulo | [Configuración de Pipeline](configuracion-de-pipeline.md) |
| **Trazabilidad de entregas** | Ver si el archivo de cada orden llegó al destino | [Trazabilidad de entregas](trazabilidad-de-entregas.md) |

Al entrar por el menú, la aplicación abre la primera pestaña a la que tengas acceso.

!!! info "Esta sección tiene dos direcciones"

    Es una pantalla en mudanza: vive en `/work-area/automation` y también responde en
    `/administration/operation`. **Cuál de las dos ves depende de qué permiso tengas
    concedido** —el nuevo, de Reabastecimiento, o el anterior, de Administración—. Es la
    misma pantalla y los mismos datos; si compartes un enlace con alguien y a esa persona
    le abre otra dirección, es esto.

## Qué necesita para funcionar { #requisitos }

- **El permiso `work-area.automation`**, o el anterior de Administración
  (`administration.operation.*`) para la pestaña correspondiente. Sin ninguno de los dos,
  la sección no aparece en el menú.
- **El permiso de escritura** para crear, editar, activar o pausar una configuración: con
  solo lectura se ven las programaciones y no se tocan.
- **Que el flujo manual ya funcione.** Automatizar no arregla un sugerido que está mal:
  programa el envío de lo que hoy sale a mano, con los mismos filtros y las mismas reglas.

## Conceptos relacionados { #conceptos }

- [La automatización y sus condiciones](../conceptos/automatizacion-y-sus-condiciones.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
