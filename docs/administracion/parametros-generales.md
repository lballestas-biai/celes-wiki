---
title: Parámetros Generales
module: Administración
route: /administration/configuration/general-parameters
aliases: []
permission: administration.configuration.general-parameters
audience: [Administradores]
summary: >
  Parámetros Generales es donde se fijan los valores con los que Celes calcula: días de
  cobertura, mínimos de pedido, lead time y demás. Se editan por combinación —de bodega,
  proveedor, categoría o producto—, de forma masiva y con vigencia por rango de fechas.
keywords: [parámetros, cobertura, lead time, mínimo de pedido, vigencia, importar, masivo]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationGeneralParametersPage/AdministrationGeneralParametersPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.configuration.index.tsx
    ref: c98f195c5
---

# Parámetros Generales

## Qué es y para qué sirve { #que-es }

Celes no calcula igual para todo. Un producto perecedero de una tienda de alta rotación y un
electrodoméstico de una bodega regional no quieren la misma cobertura ni el mismo mínimo de
pedido. Los valores que hacen esa diferencia se escriben aquí.

Cada fila es **una combinación** —el cruce de bodega, proveedor, categoría o producto que tu
instancia use— y en ella el valor del parámetro que estés viendo. La pantalla trabaja **un
parámetro a la vez**: se elige arriba y la tabla muestra sus valores.

![Parámetros Generales: el parámetro elegido arriba, y la tabla con una fila por combinación
—producto, proveedor y bodega— y su valor a la
derecha.](../assets/screenshots/administracion/parametros-generales.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir el parámetro.** El selector de la parte superior lista los parámetros habilitados en
tu instancia; el catálogo lo define
[Configuración de Parámetros](configuracion-de-parametros.md). Cuando el parámetro tiene una
descripción, aparece junto a su nombre.

**Editar los valores en la tabla.** Se escribe directamente en la celda. Los cambios se
acumulan sin guardarse: el botón de **guardar** los aplica todos juntos y solo se habilita
cuando hay algo pendiente. Una celda vacía no se guarda — el parámetro necesita un valor.

**Cambiar muchas filas a la vez.** La edición masiva aplica el mismo valor a la selección, que
es lo práctico cuando hay que subir la cobertura de una categoría completa.

**Elegir columnas.** El selector de columnas muestra u oculta las que no te interesan: con
muchos criterios de agrupación la tabla se vuelve ancha.

**Bajar y subir la tabla en Excel.** El botón de descarga exporta lo que estás viendo, y el de
subida permite devolverlo modificado. La importación **valida antes de aplicar**: muestra
cuántas filas son nuevas, cuántas modifican una existente y cuántas tienen errores, y las
erróneas se omiten. El resultado queda con su recuento de creados, actualizados, omitidos y
con error.

## Valores con vigencia { #vigencia }

Un parámetro puede no ser un solo número, sino **un valor por rango de fechas**: la cobertura
de diciembre no es la del resto del año. Para esos, la pantalla abre un panel con tres partes:

- **Filtros a usar** — a qué combinaciones aplica este valor.
- **Valores** — el valor en sí.
- **Rangos de fechas** — desde cuándo y hasta cuándo rige.

Dos rangos que se solapen sobre las mismas combinaciones **colisionan**, y entonces no está
definido cuál manda. Por eso hay un botón de **verificar**: comprueba la colisión antes de
guardar, y si la hay, lista los registros en conflicto y te deja descargarlos. Conviene usarlo
siempre que se añada un rango sobre un parámetro que ya tenía valores.

En la importación por Excel, las columnas de filtro admiten operadores: valores separados por
coma se leen como «es», `!(valores)` como «no es», `EMPTY` como «está vacío» y `!EMPTY` como
«no está vacío».

!!! warning "Lo que se cambia aquí no se ve hoy"

    Un parámetro nuevo entra en el siguiente cálculo, no en el número que tienes en pantalla.
    Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).

!!! info "Un valor más específico gana"

    Cuando la misma combinación queda cubierta por dos niveles —el de la categoría y el del
    producto—, manda el más específico. La regla completa está en
    [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

## Qué necesita para funcionar { #requisitos }

- **Los parámetros dados de alta** en [Configuración de Parámetros](configuracion-de-parametros.md),
  con los criterios por los que quieres diferenciarlos.
- **Los maestros cargados** —bodegas, proveedores, categorías—: las combinaciones de la tabla
  salen de ellos.
- **El permiso `administration.configuration.general-parameters`**, y el de edición sobre él
  para guardar cambios.

## Conceptos relacionados { #conceptos }

- [Configuración de Parámetros](configuracion-de-parametros.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Configuración General](configuracion-general.md)
- [Comprar](../reabastecimiento/comprar.md)
