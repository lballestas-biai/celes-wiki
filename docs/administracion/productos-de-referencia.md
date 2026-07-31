---
title: Productos de Referencia
module: Administración
route: /administration/configuration/reference-products
aliases: []
permission: administration.configuration.reference-products
audience: [Administradores]
summary: >
  Productos de Referencia resuelve el problema del producto sin historia: se le indica de qué otro
  producto —o de qué otra bodega— debe copiar la demanda, con qué factor y durante cuánto tiempo,
  para que tenga pronóstico desde el primer día.
keywords: [productos de referencia, producto espejo, lanzamiento, sin historia, factor, bodega espejo]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationReferenceProducts/AdministrationReferenceProductsPage/AdministrationReferenceProductsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationReferenceProducts/AdministrationReferenceProductsDetailsPage/AdministrationReferenceProductsDetailsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Productos de Referencia

## Qué es y para qué sirve { #que-es }

Un pronóstico se construye con historia, y hay dos casos frecuentes en que no la hay: un producto
que se lanza y una tienda que abre. En los dos, esperar a tener historia significa comprar a ciegas
durante semanas, que es cuando más se pierde.

Esta pantalla es la respuesta. Se declara que un producto nuevo debe comportarse **como otro que sí
tiene historia** —su producto espejo— y Celes le presta esa demanda, ajustada por un factor y por
el tiempo que se indique. Lo mismo se puede hacer con una bodega completa.

![Productos de Referencia: las referencias configuradas, con su producto o bodega espejo, su
destino y su vigencia.](../assets/screenshots/administracion/productos-de-referencia.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver las referencias configuradas.** La tabla lista cada referencia con su **nombre**, qué
referencia a qué y su vigencia.

**Crear una referencia.** El botón **Crear producto de referencia** abre el formulario. Lo primero
es el **Tipo de Referencia**, que decide todo lo demás:

| Tipo | Qué hace |
|---|---|
| **Producto - Bodega** | Un producto en una bodega copia la demanda de otro producto en otra bodega. Es el caso del lanzamiento. |
| **Bodega espejo** | Una bodega entera se referencia a otra: **todos** sus productos copian de la bodega espejo. Es el caso de la tienda que abre. |

Después se declara el **Producto espejo** y la **Bodega espejo** —el origen— y el **Producto
destino** y la **Bodega destino** —quién copia—. En el tipo Producto - Bodega se pueden **agregar
varios productos** a la misma referencia, y en el de bodega espejo se pueden **agregar grupos de
bodegas**.

**Ajustar cuánto se copia.** Tres campos gobiernan la intensidad:

- **Factor de referencia** y **Porcentaje de referencia** — cuánto de la demanda del espejo se
  traslada. Un producto nuevo que se espera venda la mitad que su espejo no se referencia al 100 %.
- **Meses de referencia** — cuánta historia del espejo se toma.
- **Múltiplo de empaque** — para que la cantidad resultante respete el empaque del producto destino.

**Fijar la vigencia.** **Fecha inicial** y **fecha final de cobertura** delimitan cuándo aplica la
referencia. Es lo que hace que el préstamo sea temporal: pasado el periodo, el producto ya tiene su
propia historia y debe dejar de copiar.

**Editar y eliminar.** Editar abre el formulario con los valores actuales. Eliminar pide
confirmación con el nombre de la referencia.

!!! warning "El tipo de referencia no se puede cambiar después"

    Una vez creada, el **Tipo de Referencia** queda fijo: la pantalla lo deshabilita y lo explica.
    Si te equivocaste de tipo, hay que eliminar la referencia y crearla de nuevo.

!!! warning "«Bodega espejo» arrastra todo el surtido"

    En ese tipo, **la bodega se referencia totalmente** —la propia pantalla lo advierte—: no es un
    producto, son todos. Es lo correcto para una tienda que abre y es demasiado para un ajuste
    puntual.

!!! tip "Ponle fecha final desde el principio"

    Una referencia sin vencimiento sigue prestando demanda cuando el producto ya tiene la suya, y
    eso deforma el pronóstico sin que nadie se dé cuenta. El periodo de cobertura es el mecanismo
    para que la referencia se retire sola.

## Qué necesita para funcionar { #requisitos }

- **Un producto espejo con historia real**: la calidad del pronóstico del nuevo es la del espejo
  que se elija.
- **Los maestros de producto y bodega cargados**, para poder seleccionar origen y destino.
- **El permiso `administration.configuration.reference-products`**, y el de edición sobre él para
  crear o modificar.

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md)
- [Resumen](../pronostico/resumen.md)
- [Parámetros Generales](parametros-generales.md)
- [Configuración General](configuracion-general.md)
