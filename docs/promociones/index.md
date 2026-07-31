---
title: Promociones
module: Promociones
route: /promotions
aliases: []
permission: promotions
audience: [Clientes, Usuarios]
summary: >
  Promociones es donde las promociones dejan de mirarse una a una y se gestionan como
  campañas: agrupadas, aprobadas o rechazadas en bloque, y vistas sobre un calendario.
  La promoción se arma en Pronóstico; aquí se administra.
keywords: [promoción, campaña, calendario promocional, descuento, aprobación]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.promotions.tsx
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: fdb9c1358
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/helpers.ts
    ref: fdb9c1358
---

# Promociones

## Qué es y para qué sirve { #que-es }

Una promoción rara vez va sola. Lo que el negocio decide no suele ser «20 % en este producto
del 3 al 10», sino una **temporada**: un aniversario, un fin de mes, una campaña de
proveedor, con decenas o cientos de promociones dentro. Este módulo existe para tratar ese
bloque como una sola cosa: revisarlo entero, aprobarlo entero y verlo entero sobre un
calendario.

Conviene tener clara la división del trabajo con [Pronóstico](../pronostico/index.md), porque
la promoción vive en los dos sitios:

- **En [Demanda y Promociones](../pronostico/demanda-y-promociones.md) se arma una
  promoción**: se eligen los productos, se fija el descuento y las fechas, y Celes estima el
  volumen incremental y lo que deja.
- **Aquí se administra el conjunto**: qué campañas hay, qué promociones tiene cada una, cuál
  está aprobada y cómo se reparten todas en el calendario.

![La lista de campañas promocionales, con el estado de cada una y el interruptor de campañas
vigentes.](../assets/screenshots/promociones/campanas.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

| Entrada del menú | Para qué | Página |
|---|---|---|
| **Campañas** | Ver, crear, aprobar y rechazar campañas, y abrir el calendario de promociones | [Campañas](campanas.md) |

Es la única entrada del módulo. Todo lo demás cuelga de ella: el detalle de una campaña, el
de cada promoción y el calendario se abren desde ahí.

!!! tip "Al entrar te deja en Campañas"

    La dirección `/promotions` no tiene pantalla propia: al abrirla, la aplicación te lleva a
    **Campañas**. Si tu usuario no tiene permiso sobre esa pantalla, te deja en
    [Inicio](../vista-general/panel-de-inicio.md).

!!! info "Puede que veas Campañas bajo «Pronóstico»"

    Es una pantalla en mudanza: vive en `/promotions/campaigns` y también responde en
    `/planning/promotional-campaigns`, donde el menú la llama *Campañas Promocionales*.
    **Cuál de las dos ves depende de qué permiso tengas concedido** —el nuevo, de
    Promociones, o el anterior, de Pronóstico—. Es la misma pantalla y los mismos datos; si
    compartes un enlace con alguien y a esa persona le abre otra dirección, es esto.

!!! warning "El Calendario de Promociones ya no es una entrada del menú"

    Hasta el 2026-07-30 fue una pantalla aparte. Hoy es una vista que se abre **desde
    Campañas**, con el botón del mismo nombre, y el permiso que la controla no cambió. Si tu
    usuario tenía esa pantalla como página de entrada, la aplicación te lleva ahora a
    Campañas.

## Qué necesita para funcionar { #requisitos }

- **Un permiso del módulo `promotions`.** Con cualquiera entras al módulo; cada pantalla y
  cada vista exige después el suyo.
- **Promociones creadas.** Una campaña vacía es un contenedor sin nada dentro: no se le
  puede cambiar el estado ni aporta nada al calendario. Las promociones se arman en
  [Demanda y Promociones](../pronostico/demanda-y-promociones.md), o se suben en bloque
  desde un archivo.
- **Precio y costo cargados**, si esperas que las cifras de retorno de una campaña
  —inversión, utilidad incremental, ROI— signifiquen algo.

## Conceptos relacionados { #conceptos }

- [Demanda y Promociones](../pronostico/demanda-y-promociones.md)
- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Trade Marketing](../surtido/trade-marketing.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
