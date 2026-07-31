---
title: Adherencia
module: Reportes
route: /reports-and-analytics/adherence
aliases: []
permission: reports-and-analytics.adherence
audience: [Clientes, Usuarios]
summary: >
  Adherencia compara lo que se pidió contra lo que Celes recomendó pedir, en compras y en
  distribución. Responde si el sugerido se está usando, quién se aparta de él y en qué
  tiendas, categorías o productos.
keywords: [adherencia, sugerido, cantidad solicitada, órdenes, seguimiento, usuario]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/ReportsAndAnalitycs/ReportsAndAnalitycsAdherencePage/ReportsAndAnalitycsAdherencePage.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.reports-and-analytics.adherence.index.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/hooks/mockDataAdherencePerformance.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/public/locales/es/reports-and-analytics.json
    ref: bacaa614e
---

# Adherencia

## Qué es y para qué sirve { #que-es }

Celes recomienda una cantidad; una persona decide otra. **Adherencia mide esa distancia.**

No es una pantalla de reproche: es la que dice si el sugerido está sirviendo. Una adherencia
baja y constante casi siempre significa una de dos cosas, y las dos importan. O el sugerido
está mal calibrado —un parámetro, un lead time, una restricción de empaque que no refleja la
realidad— y hay que corregirlo; o está bien y no se está usando, y entonces el problema no
es el modelo. Distinguir una de la otra es todo el trabajo, y esta pantalla es donde
empieza: mostrando **dónde** se separa, no solo cuánto.

![Adherencia a Compras: lo sugerido contra lo solicitado en las tarjetas, la curva del
periodo, y el desglose por tienda abajo.](../assets/screenshots/reportes/adherencia.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir qué se está midiendo.** El selector de arriba a la derecha cambia la pantalla
entera, y son tres vistas distintas:

| Vista | Qué compara |
|---|---|
| **Órdenes de Compra** | Lo que se pidió al proveedor contra lo que Celes sugirió comprar |
| **Órdenes de Distribución** | Lo que se pidió al centro de distribución contra lo que Celes sugirió distribuir |
| **Órdenes** | No compara cantidades: cuenta **órdenes**, y muestra cuándo y quién las emitió |

Al entrar por el menú, la pantalla abre en **Órdenes de Compra**.

**Leer los indicadores.** En las dos primeras vistas, las tarjetas resumen el periodo:
*Cantidad Sugerida* y *Cantidad Solicitada* —y sus equivalentes en dinero, *Valor Sugerido*
y *Valor Solicitado*—, la *Adherencia General*, que es la razón entre lo solicitado y lo
recomendado, y el reparto de los pedidos en **superiores, inferiores y exactos** respecto al
sugerido.

**Seguir la curva.** *Adherencia por Día* —o por semana, o por mes— pone en el mismo eje la
cantidad sugerida, la solicitada y el porcentaje de adherencia. Sirve para ver si la
distancia es estable o si se abrió a partir de una fecha, que suele coincidir con un cambio
de parámetros o de responsable.

**Buscar dónde se separa.** La tabla de abajo reparte lo mismo **por tienda, por categoría,
por producto, por proveedor o por usuario**. La de usuario es la que cierra la conversación:
el mismo sugerido, tratado de forma distinta por cada persona, dice más que cualquier
promedio.

**Ver cuándo se pide.** La vista de **Órdenes** trae mapas de calor —*órdenes por día de la
semana y hora*, *por día y hora*, y por usuario— con un selector para mirar solo compras,
solo distribución o el total. Es la vista de operación: a qué hora se trabaja de verdad, qué
días se concentra el pedido y si alguien está emitiendo fuera de la ventana esperada.

**Acotar y sacar la información.** Los **Filtros** y el **rango de fechas** aplican a toda
la pantalla. Las tablas se exportan y admiten suscripción.

## Cómo se lee el porcentaje { #lectura }

**100 % es pedir exactamente lo sugerido.** Lo que se sale de ahí tiene dos lecturas
opuestas y conviene no confundirlas:

- **Por debajo de 100 %** se pidió menos de lo recomendado. Repetido, termina en quiebre y
  aparece como venta perdida en [Histórico](historico.md).
- **Por encima de 100 %** se pidió de más. Repetido, termina en sobreinventario y aparece
  en [Balanceo de Inventario](balanceo-de-inventario.md).

Los valores muy grandes son normales cuando el sugerido es pequeño: pedir 107 donde se
sugerían 7 da más de 1.500 %, y no significa que algo esté roto — significa que casi todo lo
pedido se decidió por fuera del sugerido. Es justo el caso de la captura de arriba, y por
eso la lectura útil no es el porcentaje suelto sino **las dos cantidades al lado**.

!!! warning "Solo se mide lo que pasó por Celes"

    La comparación existe cuando hay un sugerido con el que comparar. Un pedido creado por
    fuera de la aplicación no tiene sugerido asociado, así que no entra en el numerador ni en
    el denominador: no baja la adherencia, simplemente no está. Si las cifras te parecen
    pequeñas frente a lo que compra tu empresa, es esto y no un error de la pantalla.

!!! tip "Si la pantalla sale vacía, mueve el rango de fechas"

    El rango con el que abre incluye días futuros, en los que todavía no se ha emitido nada.
    Es la causa más común de un «No hay datos disponibles» aquí.

## Qué necesita para funcionar { #requisitos }

- **Órdenes creadas desde Celes**, de compra o de distribución. Sin ellas no hay nada que
  comparar.
- **Un periodo ya transcurrido** en el rango de fechas.
- **El permiso `reports-and-analytics.adherence`.** Es el que abre la pantalla, y con él
  entran las tres vistas: el selector las ofrece todas.
- **Precio o costo cargado**, si esperas que las tarjetas de *Valor* digan algo; las de
  cantidad no lo necesitan.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Comprar](../reabastecimiento/comprar.md)
- [Distribuir](../reabastecimiento/distribuir.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
