---
title: Distribución Automática
module: Reabastecimiento
route: /work-area/automation/automatic-replenishment
aliases: [/administration/operation/automatic-replenishment]
permission: work-area.automation
audience: [Clientes, Usuarios, Administradores]
summary: >
  Aquí se programan los repartos que ya no hace falta revisar a mano: qué productos, cada
  cuánto y a qué hora. Cada configuración se activa o se pausa desde la lista, y avisa por
  correo cuando una ejecución falla.
keywords: [distribución automática, programación, recurrencia, automatización, pausar]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationAutomaticReplenishmentListPage/AdministrationAutomaticReplenishmentListPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationAutomaticReplenishmentDetailsPage/AdministrationAutomaticReplenishmentDetailsPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/api-core/src/configs/application/jobs/execute_distribution_order_job.py
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d20adaaea
---

# Distribución Automática

## Qué es y para qué sirve { #que-es }

Una configuración de distribución automática es una orden de distribución que se arma y se
envía sola, con una frecuencia que tú defines. Hace exactamente lo que haría una persona en
[Solicitud de Distribución](solicitud-de-distribucion.md): toma los productos que cumplan
unos filtros, usa la cantidad sugerida y envía.

La pantalla es la lista de esas configuraciones, con su regla de recurrencia, su estado, la
próxima ejecución, la última y cómo terminó.

![La lista de configuraciones, con su estado, su recurrencia y su próxima
ejecución.](../assets/screenshots/reabastecimiento/distribucion-automatica.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Crear una configuración**, con el botón de arriba a la derecha. El formulario tiene
cuatro bloques:

- **Información general** — nombre, descripción, una nota que viaja con la orden y los
  usuarios que reciben la alerta si la ejecución falla. Quien la crea siempre queda
  incluido y no se puede quitar.
- **Frecuencia** — cada cuánto y a qué hora se ejecuta: diaria, semanal en unos días
  concretos, o mensual por día del mes, por último día o por posición («el segundo
  martes»). El formulario muestra en una frase cuándo va a correr, con su zona horaria.
- **Avanzado** — una fecha de fin, opcional.
- **Filtros** — a qué productos aplica. **Sin filtros aplica a todos los que tengan
  sugerencia**, y la aplicación lo advierte antes de guardar: es el error más caro de esta
  pantalla.

**Activar o pausar** desde la propia lista, con el selector de la columna **Estado**. Una
configuración pausada conserva todo y deja de ejecutarse.

**Enviar solo lo no enviado.** El interruptor *Enviar solo productos no enviados* omite en
cada corrida lo que ya salió, para no duplicar despachos.

**Ver en Distribución.** Desde el detalle, abre [Distribuir](distribuir.md) con los mismos
filtros de la configuración, para comprobar sobre qué productos va a actuar antes de
activarla.

**Consultar cómo terminó la última ejecución** en las columnas de resultado y fecha, y
**borrar** una configuración que ya no aplica.

## Qué pasa cuando los datos no están listos { #reintentos }

La ejecución automática necesita que el procesamiento del día haya terminado; si no, estaría
despachando con números viejos. Cuando llega su hora y los datos aún no están:

- **no envía nada** y se reprograma para más tarde el mismo día, esperando cada vez un poco
  más —quince minutos, luego media hora, luego una—;
- si el siguiente intento se pasaría de la medianoche en tu zona horaria, **desiste por
  hoy** y vuelve a intentarlo en su próxima ejecución programada;
- esto **no** cuenta como fallo: no gasta reintentos ni pausa la configuración.

Un fallo de verdad —un error al enviar— sí avisa por correo a los destinatarios de la
configuración en cada intento fallido, y si se agotan los reintentos la configuración
**queda pausada** para que nadie la dé por viva.

## Qué necesita para funcionar { #requisitos }

- **El permiso `work-area.automation`** (o el anterior de Administración) en escritura para
  crear, activar o pausar.
- **Filtros que acoten lo que se va a despachar.** Sin filtros, aplica a todo lo que tenga
  sugerencia.
- **El procesamiento diario terminado antes de la hora programada.** Programar a una hora
  temprana no adelanta los datos: solo hace que la configuración espere y reintente.
- **Destinatarios de alerta válidos**, o nadie se entera de que dejó de correr.

## Conceptos relacionados { #conceptos }

- [La automatización y sus condiciones](../conceptos/automatizacion-y-sus-condiciones.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Solicitud de Distribución](solicitud-de-distribucion.md)
- [Trazabilidad de entregas](trazabilidad-de-entregas.md)
