---
title: Configuración de Parámetros
module: Administración
route: /administration/configuration/parameters-manager
aliases: []
permission: administration.configuration.parameters-manager
audience: [Administradores, Implementadores]
summary: >
  Configuración de Parámetros es el catálogo: qué parámetros existen en tu instancia, cómo se
  llaman de cara al usuario, de qué tipo es su valor y por qué criterios se puede diferenciar
  cada uno. Los valores en sí se editan en Parámetros Generales.
keywords: [catálogo de parámetros, criterios, agrupación, tipo de valor, crear parámetro]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationParametersManagerPage/AdministrationParametersManagerPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Configuración de Parámetros

## Qué es y para qué sirve { #que-es }

Hay una diferencia entre «¿cuántos días de cobertura tiene esta categoría?» y «¿existe un
parámetro de días de cobertura, y se puede fijar por categoría?». La primera pregunta se
contesta en [Parámetros Generales](parametros-generales.md); la segunda, aquí.

Esta pantalla define **el molde**: el nombre del parámetro, la etiqueta con que se le presenta
al usuario, el tipo de valor que admite y **a qué nivel de detalle se puede diferenciar**. Ese
último punto es el que decide cuánto control tendrá el negocio: un parámetro que solo admite el
criterio de bodega no se podrá afinar por proveedor, por más que alguien lo necesite después.

![Configuración de Parámetros: el catálogo de parámetros de la instancia con su etiqueta,
unidad y etiqueta de valor.](../assets/screenshots/administracion/configuracion-de-parametros.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver el catálogo.** La tabla lista los parámetros con su **Nombre**, su **Etiqueta**, la
**Unidad** y la **Etiqueta de valor**. El nombre es el identificador; la etiqueta es lo que se
lee en las demás pantallas.

**Crear un parámetro.** El botón **Crear parámetro** abre un panel lateral. Además del nombre
y la etiqueta, lo que define su comportamiento es:

- **Tipo de valor** — Numérico, Texto, Fecha o Booleano.
- **Unidad** y **Etiqueta de valor** — cómo se rotula el valor al editarlo.
- **Descripción** — opcional; se muestra como ayuda junto al parámetro en Parámetros Generales.
- **Valores permitidos** — si el parámetro debe aceptar solo un conjunto cerrado de opciones.

El nombre admite solo caracteres alfanuméricos y guiones bajos, sin espacios.

**Asignar los criterios.** Es la parte que más pesa del panel: hay una lista de **Criterios
disponibles** y otra de asignados, que la pantalla titula **Orden de agrupación**. Los
criterios se pasan de una a otra y **el orden importa**: es el que define la jerarquía con la
que se resuelve un valor cuando dos niveles aplican a la misma combinación. Cada criterio se
puede mover arriba, abajo, al principio o al final.

Los criterios habituales son División, Centro de Distribución, Proveedor, Bodega, Categoría de
Producto y Subcategoría de Producto; los que aparezcan dependen de tu instancia.

**Restringir a qué combinaciones aplica.** El panel incluye un **Filtro del parámetro**:
condiciones que limitan sobre qué combinaciones existe. Con el filtro puesto, Parámetros
Generales **solo muestra las combinaciones que lo cumplen**. Sin filtro, el parámetro aplica a
todas.

**Editar y eliminar.** Editar abre el mismo panel con los valores actuales. Eliminar pide
confirmación.

!!! warning "Poner un filtro esconde combinaciones ya cargadas"

    Las combinaciones que dejen de cumplir el filtro **desaparecen de Parámetros Generales**
    para ese parámetro; la propia pantalla lo advierte antes de aplicar. No es un borrado, pero
    el efecto práctico es que un valor configurado deja de estar a la vista y deja de poderse
    corregir desde la interfaz.

!!! warning "Cambiar el orden de agrupación cambia qué valor gana"

    El orden de los criterios asignados **es** la jerarquía de precedencia. Reordenarlos puede
    cambiar el valor efectivo de combinaciones que nadie tocó. Ver
    [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

## Qué necesita para funcionar { #requisitos }

- **Los criterios disponibles configurados** en tu instancia: son los niveles por los que se
  puede diferenciar, y no todos existen en todas.
- **Acuerdo previo con el negocio** sobre a qué nivel se quiere gobernar cada parámetro:
  cambiarlo después mueve valores ya cargados.
- **El permiso `administration.configuration.parameters-manager`**, y el de edición sobre él
  para crear o modificar.

## Conceptos relacionados { #conceptos }

- [Parámetros Generales](parametros-generales.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [Configuración General](configuracion-general.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
