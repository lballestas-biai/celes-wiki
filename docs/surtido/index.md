---
title: Surtido
module: Surtido
route: /assortment
aliases: []
permission: assortment
audience: [Clientes, Usuarios]
summary: >
  Surtido reúne las decisiones sobre qué producto ocupa qué espacio en el punto de venta.
  Hoy contiene Trade Marketing: las campañas de exhibición, que reservan inventario
  adicional para un producto en una bodega durante un periodo.
keywords: [surtido, exhibición, trade marketing, punto de venta, inventario adicional]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.assortment.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/api-core/src/configs/application/services/processing_service.py
    ref: fdb9c1358
---

# Surtido

## Qué es y para qué sirve { #que-es }

Una promoción cambia el **precio**; una exhibición cambia el **espacio**. Son dos palancas
distintas y este módulo es el de la segunda: dónde se pone un producto, cuánto se pone y
durante cuánto tiempo.

La diferencia importa porque el efecto sobre el reabastecimiento no es el mismo. Una
promoción mueve el **pronóstico** —Celes estima que se venderá más y a partir de ahí sugiere
más—. Una exhibición no toca el pronóstico: pide **inventario adicional**, encima de lo que
el pronóstico ya pedía, para que la punta de góndola no se quede vacía.

Y actúa sobre la **distribución**, no sobre la compra: lo que mueve es cuánto se le manda a
la tienda, no cuánto se le pide al proveedor.

![La lista de campañas de trade marketing, con el estado de cada una y el interruptor de
campañas vigentes.](../assets/screenshots/surtido/trade-marketing.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

| Entrada del menú | Para qué | Página |
|---|---|---|
| **Trade Marketing** | Crear y aprobar campañas de exhibición | [Trade Marketing](trade-marketing.md) |

Dentro de una campaña, sus exhibiciones se gestionan en
[Promociones de Exhibición](promociones-de-exhibicion.md), que se abre desde la lista.

!!! tip "Al entrar te deja en Trade Marketing"

    La dirección `/assortment` no tiene pantalla propia: al abrirla, la aplicación te lleva a
    **Trade Marketing**, que es la única entrada del módulo.

!!! info "Puede que veas Trade Marketing bajo «Pronóstico»"

    Es una pantalla en mudanza: vive en `/assortment/trade-marketing` y también responde en
    `/planning/trade-marketing-campaigns`, donde el menú la llama *Campañas de Marketing
    Comercial*. **Cuál de las dos ves depende de qué permiso tengas concedido** —el nuevo, de
    Surtido, o el anterior, de Pronóstico—. Es la misma pantalla y los mismos datos.

## Qué necesita para funcionar { #requisitos }

- **Un permiso del módulo `assortment`.**
- **Los códigos de producto, división y bodega cargados**, porque una exhibición se declara
  con esos tres: qué producto, de qué división, en qué bodega.
- **Que el flujo de cálculo de tu instancia incluya el paso de trade marketing.** Sin él, las
  campañas se crean y se aprueban igual, y no llegan al sugerido. Se comprueba en
  [Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md).

## Conceptos relacionados { #conceptos }

- [Trade Marketing](trade-marketing.md)
- [Promociones](../promociones/index.md)
- [Distribuir](../reabastecimiento/distribuir.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
