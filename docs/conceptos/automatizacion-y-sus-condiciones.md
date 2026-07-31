---
title: La automatización y sus condiciones
module: Conceptos
audience: [Clientes, Usuarios, Administradores]
summary: >
  Celes puede armar y enviar órdenes sin que nadie apriete un botón, pero solo bajo
  condiciones: que los datos del día estén listos y que los filtros digan exactamente sobre
  qué actuar. Esta página explica qué se automatiza, qué la detiene y cómo se supervisa.
keywords: [automatización, distribución automática, compra automática, reintentos, filtros, alertas]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/api-core/src/configs/application/jobs/execute_distribution_order_job.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/configs/application/jobs/execute_procurement_order_job.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/inventory/application/orders/service.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/configs/application/jobs/order_failure_notifier.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# La automatización y sus condiciones

## Qué se puede automatizar { #que-se-automatiza }

Automatizar en Celes no es «que el sistema decida»: es que **lo que haría una persona con
unos filtros dados se ejecute solo, a una hora dada**. El cálculo es el mismo; lo que cambia
es quién aprieta el botón.

| Qué | Dónde se configura |
|---|---|
| Armar y enviar una **solicitud de distribución** | [Distribución Automática](../reabastecimiento/distribucion-automatica.md) |
| Armar y enviar una **orden de compra** | [Compra Automática](../reabastecimiento/compra-automatica.md) |
| Recibir un **reporte** periódicamente | La suscripción de cada reporte |
| Intercambiar datos con tus sistemas | [Motor de Integración](../administracion/motor-de-integracion.md) |

Todas comparten la misma anatomía: una **frecuencia**, unos **filtros** que definen el
alcance, unos **destinatarios de alerta** y un **estado** que se puede pausar.

## La condición que más importa: los datos del día { #condicion-datos }

Una orden automática que se ejecute antes de que termine el procesamiento diario despacharía
mercancía con los números de ayer. Por eso la distribución automática **comprueba primero que
el procesamiento del día haya terminado**, y si no:

- **no envía nada** y se reprograma para más tarde el mismo día, esperando cada vez un poco
  más —quince minutos, luego media hora, luego una, y de ahí en adelante una hora—;
- si el siguiente intento se pasaría de la medianoche en la zona horaria de la configuración,
  **desiste por hoy** y vuelve a intentarlo en su próxima ejecución programada;
- **no cuenta como fallo**: no gasta reintentos, no manda alerta y no pausa la configuración.

Esa espera es la razón por la que programar una automatización muy temprano no adelanta nada:
solo hace que espere más. Ver [El ciclo diario de datos](ciclo-diario-de-datos.md).

!!! warning "La compra automática no espera al procesamiento"

    La comprobación de datos listos protege el envío de **distribución** —el automático y
    también el manual—. La **compra automática no la lleva**: si se ejecuta antes de que
    termine la corrida del día, arma la orden con la última foto disponible. Si tu operación
    depende de eso, la protección es programarla a una hora posterior al cierre habitual del
    procesamiento, no confiar en que el sistema la retenga.

!!! info "La comprobación se puede desactivar, y viene activa"

    Está activa para todas las empresas y solo se desactiva a propósito, como excepción
    acordada durante una implementación. Desactivada, la distribución automática —y el envío
    manual— dejan de esperar y pueden despachar con datos del día anterior.

## La segunda condición: el alcance { #alcance }

Los filtros de una configuración automática son su alcance, y se aplican **cada vez que
corre**, sobre lo que haya ese día.

!!! warning "Sin filtros, aplica a todo"

    Una configuración sin filtros actúa sobre todos los productos que tengan sugerencia. La
    aplicación lo advierte antes de guardar, y es el error más caro de estas pantallas: no
    falla, no avisa después, y despacha de más.

Dos costumbres que lo evitan:

- **Comprobar antes de activar.** Desde el detalle de la configuración se abre la pantalla de
  distribución con esos mismos filtros, para ver sobre qué productos va a actuar.
- **Evitar el doble despacho.** La opción de enviar solo lo no enviado omite en cada corrida
  lo que ya salió, que es lo que se quiere cuando hay varias corridas al día o alguien
  también despacha a mano.

## Qué pasa cuando falla de verdad { #fallos }

Un fallo real —un error al enviar, un sistema de destino que no responde— sí tiene
consecuencias, y son deliberadamente ruidosas:

1. **Se avisa por correo** a los destinatarios de la configuración, en cada intento fallido.
   Quien la crea queda siempre incluido y no se puede quitar.
2. **Si se agotan los reintentos, la configuración queda pausada.** Es preferible que deje de
   correr a que siga fallando en silencio y alguien la dé por viva.

De ahí que dos cosas valgan la pena al configurar: **destinatarios que existan y lean**, y
revisar de vez en cuando la columna de estado, porque una configuración pausada por fallos
tiene el mismo aspecto que una pausada a propósito.

## Lo que la automatización no arregla { #lo-que-no-hace }

Automatizar amplifica lo que ya hay. Si los parámetros están mal, el sugerido está mal y la
orden automática lo enviará puntualmente todos los días. Antes de automatizar un flujo
conviene haberlo hecho a mano unas cuantas veces y estar conforme con lo que sale.

Y hay algo que no delega: **la responsabilidad de mirar**. La automatización quita el trabajo
de armar la orden, no el de revisar que lo que se está enviando tenga sentido.

## Conceptos relacionados { #conceptos }

- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md)
- [Jerarquía de parámetros](jerarquia-de-parametros.md)
- [Distribución Automática](../reabastecimiento/distribucion-automatica.md) y
  [Compra Automática](../reabastecimiento/compra-automatica.md)
