---
title: Detalle de Producto
module: Vista general
route: /work-area/product-dashboard
aliases: [/product-detail]
permission: work-area.product-dashboard
audience: [Clientes, Usuarios]
summary: >
  Detalle de Producto es la ficha completa de un producto en un punto de venta: los atributos
  y parámetros con los que Celes lo trata, el desglose de cómo salió su sugerido, y el
  histórico de ventas, inventario, compras y distribuciones de esa combinación.
keywords: [detalle de producto, ficha de producto, historico, sugerido, atributos]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/WorkAreaProductDetailsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/hooks/mockDataProductDetail.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/PageProductDetailDefault/PageProductDetailDefault.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/components/ProductDetailsTabs/ProductDetailsTabs.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/components/ProductPreview/ProductPreviewOrder.tsx
    ref: c98f195c5
---

# Detalle de Producto

## Qué es y para qué sirve { #que-es }

Cuando el sugerido de un producto no cuadra con lo que esperabas, la pregunta siempre es la
misma: *¿por qué?*. Esta pantalla es la respuesta larga.

Es la ficha de **un producto en un punto de venta concreto** —no la del producto en general—, y
por eso siempre se llega a ella desde otra pantalla, con esa pareja ya elegida. Reúne tres cosas
que en el resto de Celes están repartidas: los atributos y parámetros con los que el motor trata
esa combinación, el desglose de cómo se formó su sugerido, y su historia.

![Detalle de Producto: la barra con el producto y la bodega, las pestañas de atributos con el
desglose del sugerido, y abajo el selector de vista con el histórico de
distribuciones.](../assets/screenshots/vista-general/detalle-de-producto.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Llegar.** No está en el menú lateral. Se entra desde el detalle de un producto en
[Comprar](../reabastecimiento/comprar.md) o [Distribuir](../reabastecimiento/distribuir.md):
abre el producto y pulsa **Ver más detalles**. Se abre **en una pestaña nueva**, para que no
pierdas el pedido que estabas revisando. El botón solo aparece si tu rol alcanza esta pantalla.

**Identificar de qué habla la pantalla.** Arriba, en una barra, el código y el nombre del
producto y de la bodega. Si tu instancia muestra más de cuatro datos ahí, la barra los esconde y
el triángulo de la izquierda la despliega.

**Leer los atributos por pestañas.** Debajo, un juego de pestañas agrupa los campos de esa
combinación: cómo se formó el sugerido paso a paso —necesidad, stock de seguridad, existencias,
lo que ya viene en camino—, el resumen y los parámetros con los que se calculó. **Los nombres de
las pestañas y los campos que trae cada una los define cada empresa**, así que el juego que veas
puede no ser el de la captura. La flecha de la izquierda pliega el bloque entero.

**Cambiar de vista.** El selector de abajo elige qué se mira de ese producto: histórico de
distribuciones, histórico de compras, ventas e inventario, o forecast contra ventas. Cada vista
trae sus tarjetas, su gráfica y su tabla, y la lista de vistas también se configura por empresa.
Cuando una vista distingue tipos de pronóstico, el mismo selector trae una entrada por tipo, en
vez de un segundo desplegable.

**Acotar el periodo.** El rango de fechas de arriba a la derecha manda sobre lo que muestran las
tarjetas, las gráficas y las tablas. En las vistas que son puro histórico, Celes **no deja elegir
fechas futuras**: no habría nada que enseñar.

**Pedir la explicación de una gráfica.** Las gráficas traen un botón de explicación que redacta,
en lenguaje corriente, qué está pasando en esa curva —el comportamiento de la venta, la calidad
del pronóstico o el efecto de una promoción, según la vista—.

**Ver el reporte de salud del forecast.** Cuando esa combinación tiene una anomalía detectada en
su pronóstico, encima de los reportes aparece un bloque que la explica. Es el mismo diagnóstico
que se trabaja en [Alertas de Forecast](../pronostico/alertas-de-forecast.md), traído a la ficha
del producto.

!!! info "Es una pantalla de lectura"

    Aquí no se aprueba, no se edita y no se envía nada: se entiende. Las decisiones se toman en
    la pantalla desde la que llegaste. Lo único que cambia lo que ves es el rango de fechas y el
    selector de vista.

!!! tip "Dos direcciones, una pantalla"

    La ficha responde también en `/product-detail`. Es la dirección anterior, se conserva para
    que no se rompan los enlaces guardados, y muestra exactamente lo mismo.

## Qué necesita para funcionar { #requisitos }

- **Un producto y una bodega en la dirección.** Sin esa pareja la pantalla no tiene de qué
  hablar y se queda vacía; por eso se entra desde el detalle de un producto y no a mano.
- **El permiso `work-area.product-dashboard`.** Sin él no aparece el botón **Ver más detalles**
  en el detalle del producto.
- **Que tu empresa tenga configurados los grupos de atributos y las vistas de reportes.** Son las
  dos cosas que esta pantalla no trae de fábrica: los grupos deciden las pestañas y las vistas
  deciden el selector de abajo.
- **Historia cargada.** Las vistas de histórico muestran lo que haya en el periodo elegido: un
  producto nuevo, o una combinación que nunca se ha distribuido, sale con la tabla vacía y eso es
  correcto.

## Conceptos relacionados { #conceptos }

- [Comprar](../reabastecimiento/comprar.md)
- [Distribuir](../reabastecimiento/distribuir.md)
- [Sugerido de compra y de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [Alertas de Forecast](../pronostico/alertas-de-forecast.md)
- [Por qué tu instancia difiere](../conceptos/por-que-tu-instancia-difiere.md)
