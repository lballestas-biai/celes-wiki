---
title: Pronóstico
module: Pronóstico
route: /planning
aliases: []
permission: planning
audience: [Clientes, Usuarios]
summary: >
  Pronóstico es donde vive la predicción de demanda: cuánto se espera vender de cada
  producto en cada punto, qué tan bien le está yendo a esa predicción, y las tres formas
  de intervenirla —escenarios, promociones y eventos— cuando sabes algo que el modelo no.
keywords: [pronóstico, forecast, demanda, escenario, promoción, evento]
tenant_variance: low
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.planning.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: fd8a12056
---

# Pronóstico

## Qué es y para qué sirve { #que-es }

Todo lo que Celes sugiere pedir arranca de una cifra: **cuánta demanda se espera**. Este
módulo es donde esa cifra se mira, se mide y —cuando hace falta— se corrige.

La distinción que ordena el módulo es que Celes no predice *ventas*: predice **demanda**.
Si un producto se agotó el martes, sus ventas del martes fueron cero y su demanda no lo
fue. Por qué se hace así está en
[Filosofía del forecast](../conceptos/filosofia-del-forecast.md), y conviene leerlo antes
de discutir una cifra concreta.

El pronóstico es automático y se recalcula con el procesamiento diario: nadie tiene que
lanzarlo. Lo que sí hace falta es **vigilarlo** —para eso están Resumen y Alertas de
Forecast— y **corregirlo** cuando el negocio sabe algo que la historia de ventas no trae:
una campaña que arranca, un feriado nuevo, una apertura. Para eso están escenarios,
promociones y eventos.

![La pantalla de Resumen, que es donde abre el módulo: el forecast contra las ventas, con
las métricas de error arriba.](../assets/screenshots/pronostico/resumen.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

Las pantallas del módulo se reparten en dos oficios: **mirar** el pronóstico y
**modificarlo**.

| Entrada del menú | Para qué | Página |
|---|---|---|
| **Resumen** | Comparar el pronóstico contra lo que realmente pasó, y medir el error | [Resumen](resumen.md) |
| **Alertas de Forecast** | Revisar las anomalías que Celes detectó en su propio pronóstico, y corregirlas | [Alertas de Forecast](alertas-de-forecast.md) |
| **Escenarios** | Fijar cifras a mano, para un periodo y un conjunto de productos | [Escenarios](escenarios.md) |
| **Calendario de Eventos** | Declarar los hechos del calendario que mueven la demanda | [Calendario de Eventos](calendario-de-eventos.md) |
| **Demanda y Promociones** | Ver el pronóstico día a día por producto y estimar el efecto de una promoción | [Demanda y Promociones](demanda-y-promociones.md) |
| **Calendario de Compras** | Todavía no está disponible | [Calendario de Compras](calendario-de-compras.md) |

El menú de Pronóstico puede mostrarte además entradas que **no pertenecen a este módulo**:
Campañas Promocionales, Calendario de Promociones, Colaboradores externos y Campañas de
Marketing Comercial son direcciones anteriores de pantallas que hoy viven en
[Promociones](../promociones/index.md), [Surtido](../surtido/index.md) y
[Administración](../administracion/index.md). Llevan a la misma pantalla; cuál de las dos
direcciones ves depende de qué permiso tengas concedido.

!!! tip "Al entrar te deja en Resumen"

    La dirección `/planning` no tiene pantalla propia: al abrirla, la aplicación te lleva a
    **Resumen**. Si tu usuario no tiene permiso sobre esa pantalla, te deja en **Demanda y
    Promociones**.

!!! info "Puede que veas estas pantallas bajo «Reportes»"

    Resumen y Alertas de Forecast estuvieron antes en el módulo de Reportes, con los
    nombres *Forecast* y *Alertas del Forecast*. La aplicación sigue aceptando esas
    direcciones y, si tu usuario conserva los permisos anteriores, es ahí donde las verás.
    Es la misma pantalla, y las capturas de estas páginas se tomaron así.

## Las tres formas de intervenir el pronóstico { #intervenciones }

Se parecen y no son lo mismo. Elegir mal la herramienta es el error más común del módulo:

- **Un escenario** fija la cifra, para los productos y el periodo que elijas. Es el
  bisturí: no explica el porqué, impone el cuánto. Sirve cuando ya sabes el número —una
  negociación cerrada, un pedido institucional confirmado—.
- **Una promoción** no impone la cifra: **la estima**. Le dices el descuento y las fechas,
  y Celes calcula el volumen incremental y lo que eso hace con el margen. Sirve cuando lo
  que sabes es la palanca comercial, no el resultado.
- **Un evento** no toca ninguna cifra: le enseña al modelo **que ese día es especial**, con
  las fechas de referencia de cuando pasó antes. Sirve para lo que se repite —una temporada
  escolar, un aniversario— y vale para los años siguientes, no solo para este.

Un escenario y una promoción caducan con su rango de fechas. Un evento se queda.

## Qué necesita para funcionar { #requisitos }

- **Historia de ventas suficiente.** Un producto nuevo no tiene con qué pronosticar hasta
  que acumula historia, o hasta que se le declara un producto sustituto que se la preste.
  Ver [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md).
- **El procesamiento del día terminado.** Las cifras que ves son las del último cierre.
  Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).
- **Un permiso del módulo `planning`.** Cada pantalla exige el suyo: ver el módulo no
  alcanza para entrar a todas.
- **El calendario de festivos de tu país cargado**, si esperas que el modelo distinga un
  festivo de un día cualquiera.

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
