---
title: Configuración General
module: Administración
route: /administration/configuration
aliases: []
permission: administration.configuration
audience: [Administradores, Implementadores]
summary: >
  Configuración General reúne, en pestañas, las pantallas que definen cómo se comporta Celes
  en tu empresa: los parámetros de la cadena de suministro, el catálogo de columnas y
  consultas de los reportes, los filtros, las reglas de cubicaje y las variables de la
  instancia.
keywords: [configuración general, parámetros, columnas, consultas, filtros, cubicaje, pestañas]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationConfigurationPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.configuration.index.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/components/UI/NavTabs/NavTabs.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: c98f195c5
---

# Configuración General

## Qué es y para qué sirve { #que-es }

Esta es la sección donde se ajusta el comportamiento del producto sin cambiar el producto. No
tiene contenido propio: es una barra de pestañas, y cada pestaña es una pantalla con su propia
página en esta wiki.

Lo que se toca aquí **cambia lo que ven y calculan otras pantallas**. Un parámetro de
cobertura modificado aquí mueve el sugerido de compra de mañana; una columna añadida aquí
aparece en un reporte. Es la sección con más consecuencias indirectas de Celes.

![Configuración General abre en Parámetros Generales, con las pestañas de la sección
arriba.](../assets/screenshots/administracion/parametros-generales.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Moverte entre las pantallas de configuración.** La dirección de la sección, por sí sola,
**lleva a [Parámetros Generales](parametros-generales.md)**.

Agrupadas por lo que hacen, las pestañas son:

**Cómo calcula Celes**

- [Parámetros Generales](parametros-generales.md) — los valores por combinación de producto,
  bodega y proveedor.
- [Configuración de Parámetros](configuracion-de-parametros.md) — qué parámetros existen y por
  qué criterios se pueden diferenciar.
- [Configuraciones de Cubicaje](configuraciones-de-cubicaje.md) — las restricciones de
  transporte que redondean un pedido.
- [Productos de Referencia](productos-de-referencia.md) — de qué producto copia su demanda uno
  que no tiene historia.
- [Otras configuraciones](otras-configuraciones.md) — dos parámetros del pronóstico.

**Cómo se ven los datos**

- [Filtros](filtros.md) — qué columnas puede filtrar cada aplicación.
- [Columnas](columnas.md) — el catálogo de columnas disponibles.
- [Consultas](consultas.md) — las consultas que alimentan los reportes.

**De la instancia**

- [Variables de entorno](variables-de-entorno.md) — los interruptores de configuración.
- [Motor de Integración](motor-de-integracion.md) — el mapeo de los datos del cliente al
  modelo de Celes.
- [Asignación de Datos](asignacion-de-datos.md).

!!! info "No todas las pestañas están en todas las instancias"

    La barra muestra **solo las pestañas que tu rol alcanza**, así que dos administradores de
    la misma empresa pueden ver barras distintas. Y hay pestañas que no están habilitadas en
    la mayoría de las instancias. Si las pestañas no caben en el ancho de la pantalla, las
    restantes se agrupan en un menú al final de la barra.

!!! tip "Tres pantallas se mudaron a Activación"

    **Reglas de Negocio**, **Productos de Agrupación** y **Sustitutos** vivían aquí y hoy están
    en el módulo **Activación**. Aparecen como pestaña de esta sección solo si tu rol conserva
    el permiso anterior; con el permiso nuevo se ven en su sitio actual. Es la misma pantalla
    en los dos casos.

## Qué necesita para funcionar { #requisitos }

- **Al menos una de las pantallas de la sección concedida** en tu rol.
- **El permiso `administration.configuration`** o uno más específico dentro de él.
- **Criterio para tocarla.** Casi todo lo de esta sección afecta cálculos que ya están en
  marcha; conviene entender [la jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
  antes de cambiar un valor.

## Conceptos relacionados { #conceptos }

- [Administración](index.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
