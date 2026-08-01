---
title: Soporte
module: Recursos
route: /support
aliases: []
permission: support
audience: [Clientes, Usuarios]
summary: >
  Soporte es tu canal con el equipo de Celes desde dentro de la aplicación: abres un ticket,
  sigues la conversación y ves el tiempo que queda del acuerdo de servicio. La dirección
  `/support` lleva directamente a **Tickets de Soporte**, la lista de tus casos.
keywords: [soporte, tickets, ayuda, ANS, conversación, notificaciones]
tenant_variance: low
status: verified
verified_at: 2026-08-01
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.support.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Support/SupportTicketsPage/SupportTicketsPage.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Support/SupportTicketsPage/columns.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Support/SupportTicketsPage/components/CreateTicketDialog.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Support/SupportTicketsPage/components/TicketMessageDrawer.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/SidebarUserMenu/SidebarUserMenu.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/common.json
    ref: a3437e470
---

# Soporte

## Ficha de la pantalla { #ficha }

| | |
|---|---|
| **Dónde está** | No está en el menú lateral: se llega desde el menú de tu cuenta, abajo del todo, bajo **¿Necesitas ayuda?** → **Mis Tickets** |
| **Dirección** | `/support`, que redirige a `/support/tickets` |
| **Quién la ve** | Quien tenga el permiso `support.tickets`. Con permiso de solo lectura ves **tus** tickets; con permiso de edición, también los del resto de tu empresa |

## Qué es y para qué sirve { #que-es }

Cuando algo no cuadra —una cifra que no entiendes, una pantalla que no carga, un pedido que
salió raro— el camino no es el correo de alguien: es un ticket. Esta pantalla es ese canal,
dentro de la aplicación y sin cambiar de herramienta.

Lo que aporta frente a escribir un correo es **trazabilidad**: cada caso tiene un número, un
estado, una prioridad y un tiempo comprometido de respuesta y de resolución. Puedes ver en qué
va sin preguntarle a nadie, y el cumplimiento agregado de esos tiempos se mide en
[Dashboard ANS](../administracion/dashboard-ans.md).

![Tickets de Soporte en su vista por defecto, «Mis tickets»: el buscador, el botón «Crear Nuevo
Ticket», los filtros de estado y prioridad, y las columnas de la lista —incluidas las de ANS—.
La captura se tomó con una cuenta sin tickets, así que la tabla sale
vacía.](../assets/screenshots/recursos/soporte.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Crear un ticket.** El botón **Crear Nuevo Ticket** abre un formulario corto: **Asunto**,
**Descripción** y **Prioridad** —*Crítica*, *Alta*, *Media* o *Baja*—. Puedes **adjuntar
archivos** antes de enviarlo, y quitar los que hayas añadido por equivocación. Los dos campos de
texto son obligatorios.

**Seguir la conversación.** Al abrir un ticket se despliega el panel de la conversación con los
mensajes en orden, cada uno marcado como **Tú** o con el nombre de quien atiende. Desde ahí
respondes, adjuntas un archivo o una imagen, y ves los adjuntos que ya se enviaron. El panel
muestra además el **Estado Celes**: el estado con el que el equipo de Celes lleva el caso
internamente, más fino que el estado del ticket.

**Compartir un caso.** **Copiar enlace** copia la dirección de ese ticket. Quien la abra —si
tiene permiso— aterriza en la lista con la conversación ya desplegada; el enlace es estable y se
puede pegar en un correo o en un chat.

**Encontrar un ticket.** El buscador filtra por **ID, asunto o usuario**. Los desplegables acotan
por **Estado** —*Abierto*, *En progreso* o *Resuelto*— y por **Prioridad**, y el último ordena por
fecha de actualización o de creación, en los dos sentidos.

**Cambiar de ámbito.** Si tu permiso lo permite, el primer desplegable alterna entre **Mis
tickets**, **Todos** y **No míos**. Es la diferencia entre seguir lo tuyo y coordinar lo de un
equipo. Con permiso de solo lectura ese desplegable no cambia nada: siempre ves los tuyos.

**Enterarte sin entrar.** Un aviso en la parte superior ofrece **Activar notificaciones**: si las
aceptas, el navegador te avisa cuando soporte responde, aunque estés en otra pantalla. Y el menú
de tu cuenta muestra un contador de respuestas sin leer junto a **Mis Tickets**.

### Las columnas de ANS { #columnas-ans }

Cuatro columnas describen el acuerdo de nivel de servicio de cada caso:

| Columna | Qué dice |
|---|---|
| **ANS Respuesta** | El tiempo comprometido para la **primera respuesta**, según la prioridad del ticket |
| **Restante Respuesta** | Cuánto queda de ese tiempo. En verde si se respondió dentro del plazo; en rojo y con la palabra **Vencido** si se pasó |
| **ANS Resolución** | El tiempo comprometido para **cerrar** el caso |
| **Restante Resolución** | Lo mismo, para la resolución |

Un guion significa que esa medida no aplica a ese ticket.

## Qué necesita para funcionar { #requisitos }

- **El permiso `support.tickets`.** Sin él, la entrada **Mis Tickets** no aparece en el menú de
  tu cuenta.
- **Que tu cuenta esté dada de alta en el soporte de Celes.** La lista se arma a partir de tu
  usuario; si el soporte no reconoce tu cuenta, la pantalla no puede mostrarte tickets aunque
  tengas el permiso.
- **Permiso del navegador**, solo para las notificaciones. Si las bloqueaste antes, hay que
  volver a habilitarlas desde la configuración del navegador: el aviso de la pantalla ya no
  puede pedirlas.
- **Ningún dato cargado.** Es de las pocas pantallas que funcionan igual el primer día, antes de
  que haya una sola venta en la plataforma.

!!! info "El asistente también abre tickets"

    Si tu instancia tiene el asistente habilitado, CELI puede **crear el ticket por ti** al final
    de una conversación y ofrecerte un enlace para verlo aquí. Cuando no lo consigue, te deja el
    atajo para crearlo a mano en esta pantalla. Ver [Inicio](../vista-general/panel-de-inicio.md).

## Conceptos relacionados { #conceptos }

- [Celes Academy](academy.md)
- [Dashboard ANS](../administracion/dashboard-ans.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
