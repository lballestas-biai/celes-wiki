---
title: Compra Automática
module: Reabastecimiento
route: /work-area/automation/automatic-procurement
aliases: [/administration/operation/automatic-procurement]
permission: work-area.automation
audience: [Clientes, Usuarios, Administradores]
summary: >
  Aquí se programan las órdenes de compra que salen solas: qué productos, cada cuánto y a
  qué hora. Es la misma mecánica que la distribución automática, aplicada al pedido al
  proveedor.
keywords: [compra automática, programación, recurrencia, orden de compra, automatización]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationAutomaticProcurementListPage/AdministrationAutomaticProcurementListPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationAutomaticProcurementDetailsPage/AdministrationAutomaticProcurementDetailsPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d20adaaea
  - repo: celes-platform
    path: apps/api-core/src/configs/application/jobs/execute_procurement_order_job.py
    ref: d20adaaea
---

# Compra Automática

## Qué es y para qué sirve { #que-es }

Es el equivalente de [Distribución Automática](distribucion-automatica.md) para el pedido
al proveedor: una configuración toma los productos que cumplan unos filtros, usa el
sugerido de compra y envía la orden con la frecuencia que definas, sin que nadie tenga que
abrir [Creación de Orden de Compra](creacion-de-orden-de-compra.md).

Se usa donde la compra es rutinaria —un proveedor que atiende siempre los mismos días, una
categoría estable— y se reserva la revisión manual para lo que de verdad la necesita.

![La lista de configuraciones de compra automática, con su recurrencia y su
estado.](../assets/screenshots/reabastecimiento/compra-automatica.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

Lo mismo que en distribución automática, sobre órdenes de compra:

- **Crear una configuración** con su **información general** (nombre, descripción, nota de
  la orden y destinatarios de las alertas de fallo), su **frecuencia** —diaria, semanal o
  mensual, con hora y zona horaria—, una **fecha de fin** opcional y sus **filtros**.
- **Activar o pausar** desde la lista, con el selector de la columna **Estado**.
- **Enviar solo lo no enviado**, para no repetir una compra que ya salió.
- **Ver en OC**, que abre la orden de compra con los mismos filtros de la configuración,
  para comprobar sobre qué actúa antes de activarla.
- **Consultar la última ejecución** y su resultado, y **borrar** lo que ya no aplica.

!!! warning "Sin filtros, aplica a todo"

    Una configuración guardada sin filtros actúa sobre **todos** los productos con
    sugerencia. La aplicación lo advierte antes de guardar; en compras, el costo de
    equivocarse ahí es una orden al proveedor.

## La hora importa más que en distribución { #hora }

La [distribución automática](distribucion-automatica.md) comprueba, antes de despachar, que
el procesamiento del día haya terminado, y si no, se reprograma para más tarde. **La compra
automática no hace esa comprobación**: corre a la hora que le pusiste, con los números que
haya en ese momento.

La consecuencia práctica es que la hora de la configuración hay que elegirla a conciencia,
con margen suficiente después del corte diario de datos. Programarla demasiado temprano no
falla ni avisa: manda una orden calculada con el corte del día anterior.

Si el envío **falla**, sí avisa: los destinatarios de la configuración reciben un correo en
cada intento fallido, y si se agotan los reintentos la configuración queda **pausada**.

## Qué necesita para funcionar { #requisitos }

- **El permiso `work-area.automation`** (o el anterior de Administración) en escritura.
- **Filtros que acoten el alcance**, normalmente por proveedor o por centro.
- **Una hora posterior al corte diario de datos**, porque esta pantalla no espera a que el
  procesamiento termine (ver abajo).
- **Los parámetros del proveedor** —días de compra, mínimos, múltiplos—, que la orden
  automática respeta igual que la manual.

## Conceptos relacionados { #conceptos }

- [La automatización y sus condiciones](../conceptos/automatizacion-y-sus-condiciones.md)
- [Distribución Automática](distribucion-automatica.md)
- [Creación de Orden de Compra](creacion-de-orden-de-compra.md)
- [Calendario de OC](calendario-de-oc.md)
