---
title: Reabastecimiento
module: Reabastecimiento
route: /work-area
aliases: []
permission: work-area
audience: [Clientes, Usuarios]
summary: >
  Reabastecimiento es donde se decide cuánto pedir y a quién: comprarle al proveedor y
  repartir desde el centro de distribución hacia las tiendas. Celes calcula un sugerido
  para cada producto y cada destino, y aquí lo revisas, lo ajustas y lo envías.
keywords: [reabastecimiento, comprar, distribuir, sugerido, orden, pedido]
tenant_variance: low
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.work-area.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: d20adaaea
---

# Reabastecimiento

## Qué es y para qué sirve { #que-es }

Es el módulo operativo de Celes: el sitio donde el pronóstico se convierte en un pedido.
Cada día, para cada producto y cada destino, Celes calcula **cuánto hace falta** —cuánto
comprarle al proveedor y cuánto mandar desde el centro de distribución a cada tienda— y
esa cifra aparece aquí como **sugerido**.

El sugerido es una propuesta, no una orden. Quien opera la revisa, la ajusta si conoce algo
que el modelo no sabe, y la envía. Lo que se envía queda registrado, y lo que se envió
antes se distingue de lo que todavía no.

Reabastecimiento cubre dos flujos que se parecen en la pantalla y son distintos en el
fondo:

- **Comprar** — el pedido al proveedor. La pregunta es *cuánto traer a la cadena*.
- **Distribuir** — el reparto desde el centro de distribución hacia los puntos de venta.
  La pregunta es *cómo repartir lo que ya está adentro*.

La diferencia entre los dos cálculos está en
[Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md).

!!! tip "Al entrar te deja en Comprar"

    La dirección `/work-area` no tiene pantalla propia: al abrirla, la aplicación te lleva
    a **Comprar**. Si tu operación empieza por distribución, entra directo a **Distribuir**
    desde el menú.

![La pantalla de Comprar, que es donde abre el módulo: la lista de productos agregada por
centro de distribución.](../assets/screenshots/reabastecimiento/comprar.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

El menú lateral abre cinco entradas, en este orden:

| Entrada del menú | Para qué | Página |
|---|---|---|
| **Comprar** | Revisar el sugerido de compra y armar la orden al proveedor | [Comprar](comprar.md) |
| **Distribuir** | Revisar el sugerido de distribución y armar el reparto a las tiendas | [Distribuir](distribuir.md) |
| **Solicitudes de Tiendas** | Que cada punto de venta pida lo que necesita | [Solicitudes de Tiendas](solicitudes-de-tiendas.md) |
| **Calendario de OC** | Ver qué compras tocan cada día de la semana | [Calendario de OC](calendario-de-oc.md) |
| **Automatización & Operación** | Que las órdenes se generen y se envíen solas | [Automatización & Operación](automatizacion-y-operacion.md) |

Hay además tres pantallas a las que se llega desde las anteriores, no desde el menú:

- [Creación de Orden de Compra](creacion-de-orden-de-compra.md) y
  [Solicitud de Distribución](solicitud-de-distribucion.md) — la mesa de trabajo de cada
  flujo, donde se editan cantidades y se envía el pedido.
- [Historial de Órdenes de Compra](historial-de-ordenes-de-compra.md) e
  [Historial de Órdenes de Distribución](historial-de-ordenes-de-distribucion.md) — lo que
  ya se envió.

El recorrido normal es el mismo en los dos flujos: **revisar la lista agregada → generar la
orden de un grupo → ajustar cantidades → enviar → comprobar en el historial**.

## Qué necesita para funcionar { #requisitos }

Reabastecimiento es la última capa del cálculo: consume lo que produjeron todas las
anteriores. Para que muestre números necesita:

- **El pronóstico del día**, que a su vez necesita las ventas y el inventario cargados
  antes del corte. Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).
- **Los maestros y sus relaciones**: qué centro surte a qué tienda, qué proveedor atiende
  qué producto. Sin eso, un producto existe pero no tiene a quién comprársele ni desde
  dónde surtirse, y no aparece en ningún sugerido.
- **Los parámetros** de compra y de distribución —nivel de servicio, periodo de revisión,
  tiempos de entrega, mínimos y múltiplos—, que son la política que el cálculo respeta.
  Ver [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

El detalle de qué información pide Celes y por dónde entra está en
[Requisitos de datos](../primeros-pasos/requisitos-de-datos.md).

!!! info "«Última ejecución exitosa»"

    Arriba a la derecha, Comprar y Distribuir muestran la fecha del último procesamiento
    que terminó bien. Es la respuesta a «¿estos números son de hoy?»: si la fecha no es la
    de hoy, lo que estás viendo es el corte anterior.

## Quién ve este módulo { #quien }

Reabastecimiento aparece en el menú de quien tenga concedido **cualquier** permiso que
empiece por `work-area`. Dentro, cada entrada exige el suyo —`work-area.procurement` para
Comprar, `work-area.replenishment` para Distribuir—, así que dos personas del mismo equipo
pueden ver el módulo y encontrar menús distintos.

Además del acceso a la pantalla, los permisos distinguen **leer**, **escribir** y
**ejecutar**: se puede tener permiso para revisar una orden y ajustar cantidades sin
tenerlo para enviarla. Ver [Roles y permisos](../primeros-pasos/roles-y-permisos.md).

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [La automatización y sus condiciones](../conceptos/automatizacion-y-sus-condiciones.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
