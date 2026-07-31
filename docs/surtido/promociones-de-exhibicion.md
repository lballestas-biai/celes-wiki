---
title: Promociones de Exhibición
module: Surtido
route: /assortment/trade-marketing/exhibitions-promotions
aliases: [/planning/trade-marketing-campaigns/exhibitions-promotions]
permission: assortment.trade-marketing
audience: [Clientes, Usuarios]
summary: >
  Es el interior de una campaña de trade marketing: una fila por exhibición —producto,
  bodega, periodo y stock adicional—, con su estado. Desde aquí se crean y se editan las
  exhibiciones, se aprueban o rechazan una a una, y se cambia el estado de la campaña.
keywords: [exhibición, stock adicional, bodega, aprobar exhibición, campaña de trade marketing]
tenant_variance: low
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/PlanningTradeMarketingCampaignDetailsPage/PlanningTradeMarketingCampaignDetailsPage.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/PlanningTradeMarketingCampaignDetailsPage/components/UpsertExhibitionDialog.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/PlanningTradeMarketingCampaignDetailsPage/components/ProductSelector/ProductSelector.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/PlanningTradeMarketingCampaignDetailsPage/helpers.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fdb9c1358
---

# Promociones de Exhibición

!!! warning "Falta la captura de esta pantalla"

    Todo lo que dice esta página está verificado contra el producto. Lo que falta es la
    imagen: esta pantalla solo muestra algo cuando se abre desde una campaña concreta, y el
    pipeline de capturas navega por dirección fija. Mientras tanto se queda en borrador.

## Qué es y para qué sirve { #que-es }

Aquí es donde una campaña de trade marketing deja de ser un nombre y se llena de contenido.
Cada fila es una **exhibición**: *tantas unidades de este producto, en esta bodega, del día
tal al día cual*. La campaña es el paquete; esto es lo que hay dentro.

No está en el menú lateral: se llega desde
[Trade Marketing](trade-marketing.md), con **Ver detalles** en la fila de una campaña, o
automáticamente justo después de crear una.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Añadir una exhibición.** **Crear Exhibición Adicional** abre el formulario, que se llena
en cascada: primero la **división**, y esa elección acota los **productos**; elegido el
producto, se acotan las **bodegas** donde existe. Después van el **rango de fechas**, la
**cantidad de inventario** —tiene que ser al menos 1— y un comentario opcional.

!!! tip "Si la campaña es nueva, se guarda con la primera exhibición"

    Al crear una campaña, el nombre y el tipo que escribiste todavía no están guardados: son
    un borrador. **La campaña se crea de verdad cuando guardas su primera exhibición.** Si
    sales antes, no queda nada.

**Editar una exhibición.** Desde el menú de la fila, y solo mientras esa exhibición esté en
*Creada*.

**Aprobar o rechazar una exhibición.** También desde el menú de la fila, una a una. Exige el
permiso de aprobación, que es distinto del de escritura.

**Cambiar el estado de la campaña entera.** El botón de la cabecera —que muestra el estado
actual— despliega *Aprobar* y *Rechazar*. Está apagado si la campaña no está en *Creada* o si
no tienes el permiso de aprobación.

**Ver solo lo vigente.** El interruptor **Promociones vigentes** de la barra de la tabla deja
las exhibiciones que rigen hoy.

**Exportar.** A Excel o CSV, de la página actual o de todo el resultado.

## Los estados de una exhibición { #estados }

Se pintan como una etiqueta de color, igual que los de la campaña, y son los suyos propios:
una campaña aprobada puede tener exhibiciones sin aprobar.

| Estado | Qué significa |
|---|---|
| **Creada** | Es como nace. El único estado en el que se edita, se aprueba o se rechaza |
| **Aprobado** | Cuenta para el reabastecimiento durante su rango de fechas |
| **Rechazado** | Se revisó y se decidió no aplicarla |
| **Archivado** | Se retiró; queda el rastro |

## Qué necesita para funcionar { #requisitos }

- **Una campaña.** Esta pantalla siempre se abre en el contexto de una: sin campaña no hay
  nada que mostrar.
- **El permiso `assortment.trade-marketing`**, o el anterior
  `planning.trade-marketing-campaigns`, para entrar.
- **Permiso de escritura** para crear y editar exhibiciones.
- **El permiso de aprobación** (`assortment.trade-marketing.approval`, o el anterior
  `planning.trade-marketing-campaigns.approval`) para aprobar o rechazar. Si el servidor
  rechaza el cambio por falta de este permiso, la aplicación lo dice con ese motivo y no con
  un error genérico.
- **Los códigos de división, producto y bodega cargados**, porque los tres selectores del
  formulario se alimentan de ellos.

## Conceptos relacionados { #conceptos }

- [Trade Marketing](trade-marketing.md)
- [Surtido](index.md)
- [Distribuir](../reabastecimiento/distribuir.md)
