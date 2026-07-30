---
title: Comprar
module: Reabastecimiento
route: /work-area/procurement
aliases: []
permission: work-area.procurement
audience: [Clientes, Usuarios]
summary: >
  Comprar es la lista de todo lo que Celes sugiere pedirle a los proveedores, agrupada
  como trabajas: por centro de distribución, por proveedor o por la combinación que uses.
  Desde aquí se elige un grupo y se pasa a armar su orden de compra.
keywords: [comprar, compra, sugerido de compra, proveedor, orden de compra, agrupar]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/ProductList/ProductList.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaProcurement/WorkAreaProcurementPage/WorkAreaProcurementPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/helpers.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/components/LastExecutionDate/LastExecutionDate.tsx
    ref: d20adaaea
---

# Comprar

## Qué es y para qué sirve { #que-es }

Es el punto de partida de la compra. Celes calcula, para cada producto y cada centro de
distribución, **cuánto conviene pedirle al proveedor** teniendo en cuenta la demanda
pronosticada, el inventario que ya hay —en el centro, en tránsito y ya ordenado—, el nivel
de servicio y los tiempos de entrega. Esta pantalla presenta ese resultado como una lista.

La lista no se lee producto por producto: se lee **agrupada**. Una orden de compra se le
manda a *un* proveedor desde *un* centro, así que la pantalla agrupa por esa combinación y
cada fila es un grupo con su total. Al elegir un grupo se pasa a
[Creación de Orden de Compra](creacion-de-orden-de-compra.md), que es donde se trabaja
línea por línea.

![La lista agregada por centro de distribución, con el selector de agrupación, la búsqueda
y el botón «Ver historial».](../assets/screenshots/reabastecimiento/comprar.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir cómo se agrupa.** El selector de la barra de herramientas ofrece las agrupaciones
configuradas para tu empresa —por centro de distribución, por centro y proveedor, y las que
se hayan definido—. La agrupación manda sobre todo lo demás: cambia las filas, cambia los
totales y cambia qué orden se puede generar.

**Pasar a la orden.** En cada fila, la acción **Generar Orden** abre la mesa de trabajo de
ese grupo, llevándose los filtros que tengas puestos. Esa acción solo aparece cuando la
lista está agrupada: sin grupo no hay orden que armar, y la acción de la fila abre el
detalle del producto.

**Acotar lo que ves.** Arriba a la derecha están los **Filtros** —los mismos filtros de la
aplicación, por categoría, marca, proveedor o lo que tengas configurado—. Y en la barra de
la tabla, a la derecha, un selector de filtros rápidos —*Selecciona los productos*— con dos
opciones:

- *Solo productos con sugerencias* — esconde lo que no hay que pedir.
- *Solo productos sin enviar* — esconde lo que ya se pidió hoy. Solo aparece si esta opción
  está habilitada para tu empresa.

**Ver los totales de toda la consulta.** El interruptor **Agregado total**, abajo a la
izquierda, hace que la fila de totales sume *todas* las páginas del resultado y no solo la
que estás viendo.

**Sacar la información.** El botón de exportar entrega la lista en Excel o CSV, con las
columnas que elijas y para la página actual o el resultado completo.

**Ir a lo ya enviado.** **Ver historial** lleva al
[Historial de Órdenes de Compra](historial-de-ordenes-de-compra.md).

!!! info "Las columnas no son iguales en todas las empresas"

    Qué columnas trae esta lista, cómo se llaman y qué agrupaciones ofrece el selector se
    configuran por empresa. Lo que ves en tu instancia puede no coincidir con esta página
    ni con la de otro cliente. Ver
    [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md).

## Qué necesita para funcionar { #requisitos }

- **El procesamiento del día terminado.** Arriba a la derecha aparece **Última ejecución
  exitosa** con su fecha: es lo que responde si los números son de hoy o del corte
  anterior.
- **Al menos una agrupación configurada.** La lista no consulta nada hasta que hay un
  grupo seleccionado; si el selector está vacío, no es que no haya productos, es que falta
  la configuración.
- **Los parámetros de compra y las relaciones producto–proveedor.** Un producto sin
  proveedor asignado no tiene sugerido de compra, por mucha demanda que tenga.
- **El permiso `work-area.procurement`**, en su modalidad de lectura para ver la pantalla.

## Cómo leer los colores { #colores }

Cuando una fila ya tiene cantidad pedida, se pinta:

- **Verde** — lo pedido llega o supera lo que Celes sugería.
- **Naranja** — se pidió menos de lo sugerido.
- **Sin color** — todavía no se ha pedido nada.

Es un semáforo de adherencia, no de error: pedir menos de lo sugerido puede ser exactamente
lo correcto si conoces algo que el modelo no sabe.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
