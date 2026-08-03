---
title: Activación
module: Activación
route: /activation
aliases: []
permission: activation
audience: [Administradores, Implementadores]
summary: >
  Activación es donde se le enseña a Celes lo que el dato del cliente no trae dicho: cómo se
  clasifica el catálogo, qué productos son la misma cosa a efectos de demanda y cuál reemplaza a
  cuál. Son tres pantallas de configuración cuyo efecto se ve en el cálculo del día siguiente.
keywords: [activación, reglas de negocio, agrupación, sustitutos, configuración, catálogo]
tenant_variance: high
status: verified
verified_at: 2026-08-03
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.activation.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: 9e2f8b758
---

# Activación

## Qué es y para qué sirve { #que-es }

El pronóstico y el sugerido se calculan sobre el catálogo tal como llega. Hay tres cosas que ese
catálogo no dice por sí mismo y que cambian el resultado: **qué productos entran al cálculo y con
qué clasificación**, **qué productos son en realidad la misma cosa a efectos de demanda**, y **cuál
reemplaza a cuál cuando uno se descontinúa**.

Activación es donde se declaran esas tres cosas. No es una sección de operación diaria: se toca
cuando el catálogo cambia, y lo que se toca aquí se nota en la corrida siguiente, para todos.

![Reglas de Negocio, una de las tres pantallas del módulo: los conjuntos configurados con su
estado.](../assets/screenshots/activacion/reglas-de-negocio.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

| Pantalla | Qué responde |
|---|---|
| **[Reglas de Negocio](reglas-de-negocio.md)** | ¿Este producto se compra? ¿Se distribuye? ¿Con qué prioridad? Reglas agrupadas en conjuntos, con un estado que separa escribirlas de aprobarlas |
| **[Productos de Agrupación](productos-de-agrupacion.md)** | ¿Qué productos son la misma cosa a efectos de demanda? Se describen con filtros y con las columnas por las que se agrupan |
| **[Sustitutos](sustitutos.md)** | ¿Cuál reemplaza a cuál? Un origen y un destino concretos —productos o bodegas— con su vigencia |

**La dirección del módulo no es una pantalla.** `/activation` no tiene contenido propio: lleva a la
primera de las tres para la que tengas permiso. Si no tienes ninguna, la aplicación responde que no
estás autorizado.

!!! tip "Las tres tienen dos direcciones"

    Estas pantallas vivían antes en **Administración › Configuración General**. Según qué permiso
    tenga concedido tu instancia, verás unas u otras direcciones —y el menú mostrará *Activación* o
    no—, pero la pantalla es la misma. Las direcciones anteriores siguen funcionando: cada página
    las lista en su ficha.

## Qué necesita para funcionar { #requisitos }

- **Un permiso del módulo `activation`** —o el equivalente anterior en
  `administration.configuration`— para ver alguna de las tres pantallas, y el de edición sobre él
  para cambiar algo.
- **Los maestros de producto y de bodega cargados y homologados.** Las tres pantallas se arman con
  columnas del catálogo: sin catálogo sano no hay nada que filtrar ni que agrupar. Ver
  [Datos Maestros](../administracion/datos-maestros.md).
- **Criterio de negocio, no solo acceso.** Nada de lo que se configura aquí tiene alcance parcial:
  aplica a todo lo que cumpla la condición, en toda la empresa.

## Conceptos relacionados { #conceptos }

- [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md) — los tres sitios
  donde se interviene el cálculo.
- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md) — cuándo conviene cada
  una de las dos herramientas.
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md) — por qué el efecto se ve al
  día siguiente.
