---
title: Trade Marketing
module: Surtido
route: /assortment/trade-marketing
aliases: [/planning/trade-marketing-campaigns]
permission: assortment.trade-marketing
audience: [Clientes, Usuarios]
summary: >
  Una campaña de trade marketing agrupa exhibiciones: producto, bodega y periodo, con la
  cantidad de inventario que hay que tener puesta ahí. Esta pantalla es la lista de
  campañas, desde donde se crean, se suben desde un archivo, se aprueban y se rechazan.
keywords: [trade marketing, exhibición, campaña, stock adicional, aprobar, importar]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/PlanningTradeMarketingCampaignsPage/PlanningTradeMarketingCampaignsPage.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/PlanningTradeMarketingCampaignsPage/components/TradeMarketingCampaignUploaderDialog/TradeMarketingCampaignUploaderDialog.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningTradeMarketingCampaigns/helpers.ts
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/api-core/src/inventory/domain/trade_marketing_import.py
    ref: fdb9c1358
---

# Trade Marketing

## Qué es y para qué sirve { #que-es }

Una **campaña de trade marketing** es un acuerdo de exhibición convertido en cifras: *este
producto, en estas tiendas, del 1 al 30, con tantas unidades puestas*. Cada una de esas
líneas es una **exhibición**, y la campaña es el paquete que se aprueba de una vez.

Lo que hace por ti es que ese acuerdo llegue solo al reabastecimiento. Sin campaña, alguien
tiene que acordarse de pedir de más para llenar la punta de góndola; con campaña, la
cantidad declarada se suma a lo que Celes sugiere distribuir a esa bodega mientras dure el
periodo.

![La lista de campañas de trade marketing, con el estado de cada una y el interruptor de
campañas vigentes.](../assets/screenshots/surtido/trade-marketing.png)

!!! info "Puede que la veas como «Campañas de Marketing Comercial», bajo Pronóstico"

    Es la misma pantalla en su dirección anterior, `/planning/trade-marketing-campaigns`,
    donde el menú la llama así. **Cuál de las dos ves depende de qué permiso tengas
    concedido**, y la captura de arriba está tomada con el anterior: por eso la cabecera dice
    *Campañas de Marketing Comercial* y no *Trade Marketing*.

## Los dos tipos de campaña { #tipos }

Cambian lo que significa la cantidad de inventario de cada exhibición, y la aplicación lo
explica bajo el selector al elegirlo:

| Tipo | Qué significa la cantidad |
|---|---|
| **Recurrente** | Un **nivel a mantener**: se repone de forma recurrente durante todo el periodo de la campaña |
| **Envío único** | El **total a enviar** en todo el periodo, no un nivel recurrente. A medida que se registran ventas solo se envía el faltante hasta completar ese total |

*Recurrente* es el comportamiento de siempre y el que llevan todas las campañas creadas antes
de que existiera el tipo. **Envío único puede no estar disponible en tu instancia**: es una
funcionalidad que se habilita por empresa, y donde no lo esté no verás el selector ni el tipo
en la cabecera de la campaña.

## Los estados de una campaña { #estados }

| Estado | Qué significa |
|---|---|
| **Creada** | Es como nace. El único estado en el que se edita, se borra y se le añaden exhibiciones |
| **Aprobado** | La campaña rige y sus exhibiciones aprobadas cuentan para el reabastecimiento |
| **Rechazado** | Se revisó y se decidió no aplicarla |
| **Finalizada por Cliente** | Se dio por terminada antes de su fecha de fin |

!!! warning "Finalizar una campaña no se puede deshacer"

    La aplicación lo advierte antes de hacerlo. La acción **Finalizar** aparece solo en
    campañas aprobadas, exige el permiso de aprobación, y puede no estar habilitada en tu
    instancia.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver solo lo vigente.** El interruptor **Campañas vigentes** de la barra de la tabla deja
las que rigen hoy.

**Crear una campaña.** **Crear Campaña** pide el nombre, un comentario y —si tu instancia lo
ofrece— el tipo. Ojo con una particularidad: la campaña **no se guarda al cerrar ese
diálogo**, sino cuando le añades la primera exhibición. Hasta entonces es un borrador que
vive en la pantalla de [Promociones de Exhibición](promociones-de-exhibicion.md), a la que
la aplicación te lleva a continuación.

**Subir una campaña desde un archivo.** **Subir promociones** abre una importación de tres
pasos —*Cargar*, *Revisar*, *Resultado*— que es la forma práctica de meter cientos de
exhibiciones:

1. **Cargar.** Se descarga la plantilla, se llena y se sube. Acepta Excel (`.xlsx`) y CSV.
2. **Revisar.** Antes de crear nada, la aplicación clasifica cada fila: *A crear*, *No
   encontrada* —esa combinación de producto, división y bodega no existe—, *Inválida* —la
   fila tiene un error de formato— o *Pendiente de validar*. Si hay combinaciones no
   encontradas, **la importación no se puede procesar**: se descarga el detalle, se corrige
   el archivo y se vuelve a subir. Las filas inválidas simplemente no entran.
3. **Resultado.** Con el archivo en orden, se confirma y la campaña se **procesa en segundo
   plano**; la aplicación avisa cuando termina.

Las columnas de la plantilla son código de división, código de producto, código de bodega,
fecha inicial, fecha final, stock adicional y comentarios. Las fechas van en formato
`AAAA-MM-DD`, la final no puede ser anterior a la inicial, y en el código de bodega **los
ceros a la izquierda no importan**: `001` y `1` son la misma bodega.

!!! info "Un archivo grande no se valida en el momento"

    Por encima de cierto tamaño, las combinaciones de producto, división y bodega no se
    comprueban en el paso de revisión: se comprueban al procesar la campaña en segundo plano.
    Si alguna no existe, **la campaña falla entera** y el detalle queda en el historial de
    trabajos.

**Abrir una campaña.** **Ver detalles** lleva a sus exhibiciones —crear, editar, aprobar,
rechazar— en [Promociones de Exhibición](promociones-de-exhibicion.md).

**Editar, borrar y finalizar.** Desde el menú de la fila. Editar y borrar solo mientras la
campaña esté en *Creada*; finalizar, solo si está aprobada.

**Exportar.** A Excel o CSV, de la página actual o de todo el resultado.

!!! info "Esta pantalla no tiene el panel de Filtros"

    A diferencia de [Campañas](../promociones/campanas.md), aquí no hay filtros de la
    aplicación ni búsqueda por nombre: la lista se recorre con la paginación y el interruptor
    de vigentes.

## Qué necesita para funcionar { #requisitos }

- **El permiso `assortment.trade-marketing`**, o el anterior
  `planning.trade-marketing-campaigns`.
- **Permiso de escritura** para crear, editar, borrar o subir.
- **El permiso de aprobación** (`assortment.trade-marketing.approval`, o el anterior
  `planning.trade-marketing-campaigns.approval`) para aprobar, rechazar o finalizar. Es un
  permiso aparte del de escritura: se puede tener uno y no el otro, y la aplicación lo dice
  con un mensaje explícito cuando el servidor rechaza el cambio de estado.
- **Los códigos de producto, división y bodega cargados**, porque una exhibición se declara
  con esos tres.
- **Que el flujo de cálculo de tu instancia incluya el paso de trade marketing.** Sin él las
  campañas se crean, se aprueban y no llegan al sugerido. Ese paso existe solo en el flujo de
  **distribución**: no hay equivalente en compras. Se comprueba en
  [Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md).

## Conceptos relacionados { #conceptos }

- [Promociones de Exhibición](promociones-de-exhibicion.md)
- [Surtido](index.md)
- [Distribuir](../reabastecimiento/distribuir.md)
- [Campañas](../promociones/campanas.md)
- [Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md)
