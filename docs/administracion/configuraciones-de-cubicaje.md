---
title: Configuraciones de Cubicaje
module: Administración
route: /administration/configuration/cubing-configurations
aliases: []
permission: administration.configuration.cubing-configurations
audience: [Administradores]
summary: >
  Configuraciones de Cubicaje define los límites físicos con los que se ajusta un pedido: cuánto
  peso, volumen, pallets, cajas o costo caben en un envío, y hasta qué porcentaje se puede
  redondear para completar una unidad de transporte.
keywords: [cubicaje, pallet, caja, peso, volumen, redondeo, transporte, restricciones]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationCubingConfigurationsPage/AdministrationCubingConfigurationsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationCubingConfigurationsPage/components/CubingConfigurationsTable/CubingConfigurationsTable.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Configuraciones de Cubicaje

## Qué es y para qué sirve { #que-es }

El sugerido que calcula Celes es la cantidad que el negocio necesita. Lo que se puede despachar es
otra cosa: un camión tiene un peso máximo, un pallet se arma completo o se desaprovecha, y a
ningún proveedor se le pide media caja.

El cubicaje es el ajuste entre esas dos cifras. Aquí se declaran los límites físicos —por
proveedor, por centro de distribución, por tipo de transporte— y **cuánto se permite redondear**
para completar una unidad. Es lo que convierte un sugerido de 47 unidades en un pedido de 48
porque así se cierra la caja.

![Configuraciones de Cubicaje: las configuraciones de la instancia con su alcance, su modo y los
límites declarados.](../assets/screenshots/administracion/configuraciones-de-cubicaje.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Separar compras de distribución.** Lo primero de la pantalla es un conmutador entre **COMPRAS**
y **DISTRIBUCIÓN**: no es un filtro cosmético, son dos conjuntos de configuraciones
independientes.

**Ver las configuraciones.** La tabla lista, por configuración, a quién aplica —**Agrupador
proveedor**, **Proveedor**, **Centro de distribución**, **Código de mezcla**, **Tipo de
transporte** y **Nombre del transporte**— el **Modo de cubicaje**, sus límites mínimos y máximos
de **peso, volumen, pallets, cajas y costo**, el **% Redondeo** y si está **Activo**. Con muchas
columnas la tabla se desplaza en horizontal y el buscador ayuda a llegar a una fila concreta.

**Crear y editar una configuración.** El formulario pide primero dos cosas que definen todo lo
demás:

- **Alcance** — **Compras** o **Distribución**. Son cálculos distintos y no comparten
  configuración.
- **Modo de cubicaje** — **Pallet** o **Caja**: la unidad en la que se piensa el armado.

Después van las **Restricciones** —los mínimos y máximos— y el **porcentaje de redondeo**, que es
cuánto se permite pasarse o quedarse corto para cerrar una unidad.

**Editar en la propia tabla.** Se puede modificar directamente en la celda. Los cambios quedan
pendientes hasta guardarlos o descartarlos, y la pantalla no deja seguir con otras acciones
mientras haya cambios sin resolver.

**Bajar y subir en Excel.** **Descargar Excel** exporta las configuraciones y **Subir Excel** las
devuelve modificadas. La carga **valida antes de aplicar**: si el archivo tiene errores lo dice y
no procesa, y al terminar informa cuántas se **crearon**, cuántas se **actualizaron** y cuántas
**fallaron**, con la opción de volver a subir el archivo corregido. Es el camino práctico cuando
hay que declarar decenas de proveedores.

**Activar y desactivar.** Una configuración se puede dejar inactiva sin borrarla, que es lo
adecuado para una regla estacional.

**Eliminar.** Pide confirmación con el nombre de la configuración.

!!! info "Si no tienes permiso de edición, la pantalla te lo dice"

    Con permiso de solo lectura los botones de crear y modificar aparecen deshabilitados y con la
    explicación al pasar el ratón. Se puede consultar todo.

!!! warning "El cubicaje explica pedidos que «no cuadran» con el sugerido"

    Cuando alguien pregunta por qué el pedido no es exactamente el sugerido, la respuesta suele
    estar aquí: se redondeó para cerrar una unidad de transporte, o un máximo lo recortó. Es
    esperado, y el porcentaje de redondeo es la palanca para ajustarlo.

!!! tip "No es lo mismo para comprar que para distribuir"

    El **Alcance** separa las dos cadenas. Una configuración de Compras no afecta a la
    distribución ni al contrario, y es un olvido frecuente: se ajusta el cubicaje de compras y se
    espera ver el cambio en la distribución.

## Qué necesita para funcionar { #requisitos }

- **Los datos físicos del producto** —peso, volumen, unidades por caja, cajas por pallet—: sin
  ellos no hay nada que cubicar.
- **El maestro de proveedores y centros de distribución**, que es sobre lo que se declara el
  alcance de cada configuración.
- **El permiso `administration.configuration.cubing-configurations`**, y el de edición sobre él
  para crear o modificar.

## Conceptos relacionados { #conceptos }

- [Comprar](../reabastecimiento/comprar.md)
- [Distribuir](../reabastecimiento/distribuir.md)
- [Creación de Orden de Compra](../reabastecimiento/creacion-de-orden-de-compra.md)
- [Parámetros Generales](parametros-generales.md)
- [Configuración General](configuracion-general.md)
- [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md)
