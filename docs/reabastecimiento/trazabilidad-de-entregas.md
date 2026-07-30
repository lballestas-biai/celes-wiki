---
title: Trazabilidad de entregas
module: Reabastecimiento
route: /work-area/automation/dispatches
aliases: [/administration/operation/dispatches]
permission: work-area.automation
audience: [Clientes, Usuarios, Administradores]
summary: >
  El historial de los archivos que Celes le envía a cada destino y cómo terminó cada envío:
  entregado, fallido o pendiente. Responde «la orden salió, pero ¿llegó?», y desde aquí se
  puede reintentar un envío fallido o reenviar uno ya entregado.
keywords: [trazabilidad, entregas, envíos, archivo, reintento, reenvío, canal]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationDispatchesPage/AdministrationDispatchesPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationDispatchesPage/utils.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d20adaaea
---

# Trazabilidad de entregas

## Qué es y para qué sirve { #que-es }

Enviar una orden en Celes es solo la mitad del camino: la otra mitad es que el archivo de
esa orden llegue al sistema que la va a ejecutar. Esta pantalla cubre esa segunda mitad.

Cada fila es un **envío**: la orden a la que pertenece, cuándo salió, por qué canal, con
qué nombre de archivo, en qué estado terminó y cuántos intentos costó. Es la respuesta a
«la orden aparece en el historial, pero el sistema del otro lado dice que no la recibió».

![Un envío por fila, con su estado, su origen y su
canal.](../assets/screenshots/reabastecimiento/trazabilidad-de-entregas.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Buscar un envío** por código de orden o por nombre de archivo, y acotar por rango de
fechas, estado o canal.

**Leer el estado**, que es lo primero que se mira:

| Estado | Qué significa |
|---|---|
| **Pendiente** | El envío está registrado y todavía no ha empezado |
| **En proceso** | Está en curso; hay que esperar a que termine |
| **Entregado** | Llegó al destino |
| **Fallido** | No llegó |
| **Requiere revisión** | Terminó en una situación que alguien tiene que mirar |

**Ver por dónde salió.** La columna **Canal** dice el medio —SFTP, la carpeta del cliente,
su API o un correo— y **Origen** dice si el envío lo disparó una ejecución automática.

**Abrir el historial de un envío.** Al pulsar una fila se abre el detalle con **todos los
intentos** de entregar ese archivo, del más antiguo al más reciente, y para el intento
seleccionado: la confirmación que devolvió el destino, a dónde se envió, el error reportado
si lo hubo, y la auditoría de quién cerró o reemplazó el envío y por qué.

**Descargar el archivo enviado**, desde el detalle. El enlace es temporal y caduca en una
hora.

**Reintentar o reenviar**, con permiso de escritura:

- **Reintentar envío** — para un envío que **no** llegó. Cierra el intento fallido y crea
  uno nuevo.
- **Reenviar al cliente** — para uno que **sí** llegó y hay que volver a mandar. El destino
  va a recibir el archivo por segunda vez, así que la aplicación lo advierte.

En los dos casos el **motivo es obligatorio** y queda registrado junto con tu nombre. No es
burocracia: es lo que permite explicar, semanas después, por qué un archivo llegó dos
veces.

!!! info "Cuándo no se puede reenviar"

    Un envío pendiente o en proceso todavía no tiene desenlace, y uno que ya fue
    reemplazado por otro más reciente no se reenvía: hay que mirar el intento siguiente de
    la lista. La pantalla explica el motivo en cada caso.

## Qué necesita para funcionar { #requisitos }

- **El permiso `work-area.automation`** (o el anterior de Administración) en lectura para
  ver, en escritura para reintentar o reenviar.
- **Un canal de salida configurado** para tu empresa. Sin canal no hay envíos que rastrear
  y la pantalla aparece vacía.
- **Órdenes enviadas dentro del rango de fechas** seleccionado.

## Conceptos relacionados { #conceptos }

- [Historial de Órdenes de Compra](historial-de-ordenes-de-compra.md)
- [Historial de Órdenes de Distribución](historial-de-ordenes-de-distribucion.md)
- [Distribución Automática](distribucion-automatica.md)
- [La automatización y sus condiciones](../conceptos/automatizacion-y-sus-condiciones.md)
