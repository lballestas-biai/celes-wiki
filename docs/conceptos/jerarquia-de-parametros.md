---
title: Jerarquía de parámetros
module: Conceptos
audience: [Clientes, Usuarios, Administradores]
summary: >
  Los parámetros son la política de la empresa escrita en números: cobertura, tiempos de
  entrega, mínimos, múltiplos. Rara vez valen lo mismo para todo, así que se fijan por
  niveles — y esta página explica cuál gana cuando dos niveles aplican a la vez.
keywords: [parámetros, criterios, jerarquía, precedencia, vigencia, cobertura, política]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/api-core/src/tenants/domain/config/entities.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/tenants/domain/dynamic_params.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/tenants/application/services/supply_chain_params_service.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationParametersManagerPage/AdministrationParametersManagerPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# Jerarquía de parámetros

## Qué es un parámetro { #que-es }

Un parámetro es una decisión de negocio expresada como número, para que el cálculo pueda
usarla. Las familias habituales:

| Familia | Qué gobierna |
|---|---|
| **Periodos de revisión y cobertura** | Cuántos días tiene que cubrir un pedido, cada cuánto se pide |
| **Tiempos de entrega** | Cuánto tarda el proveedor, cuánto el último tramo hasta la tienda |
| **Nivel de servicio** | Cuánto riesgo de quiebre se acepta, y por tanto cuánto colchón se lleva |
| **Mínimos y múltiplos** | Qué cantidades son pedibles: empaque, mínimo de pedido, mínimo de despacho |
| **Capacidades** | Cuánto cabe: en la tienda, en el camión, en la orden del día |
| **Estados** | Si un punto está activo, en apertura, en cierre |

No son configuración técnica: son la política de la empresa. Un cambio de cobertura de 7 a
14 días mueve el inventario de toda la red.

## Definición y valor son dos cosas { #definicion-y-valor }

- **[Configuración de Parámetros](../administracion/configuracion-de-parametros.md)** define
  *el molde*: qué parámetros existen, cómo se llaman, qué tipo de valor admiten y —lo que
  importa aquí— **por qué criterios se pueden diferenciar**.
- **[Parámetros Generales](../administracion/parametros-generales.md)** guarda *los valores*:
  una fila por combinación, con su número.

Lo primero decide cuánto control tendrá el negocio; lo segundo lo ejerce. Un parámetro cuyo
molde solo admite el criterio de bodega **no se podrá afinar por proveedor**, por más que
alguien lo necesite después.

## Los niveles y su orden { #niveles }

Un valor no se fija «para todo»: se fija para una **combinación** de criterios. Los criterios
habituales son División, Centro de Distribución, Proveedor, Bodega, Categoría y Subcategoría
de Producto, y el producto mismo; cuáles existen depende de tu instancia.

En el molde del parámetro, esos criterios se asignan **en un orden**, que la pantalla llama
*Orden de agrupación*. Ese orden **es** la jerarquía: es lo que resuelve el valor efectivo
cuando más de un nivel aplica a la misma combinación.

La consecuencia de todos los días:

!!! info "Gana el nivel más específico"

    Si la categoría *Lácteos* tiene cobertura 7 y el producto *Leche entera 1 L* tiene
    cobertura 10, ese producto usa 10. Los demás lácteos usan 7. Poner un valor general no
    borra los específicos, y por eso subir «la cobertura de todo» a veces no cambia nada:
    lo que manda son las excepciones que alguien cargó antes.

!!! warning "Reordenar los criterios cambia valores que nadie tocó"

    Cambiar el *Orden de agrupación* de un parámetro no edita ningún valor, pero cambia
    cuál de ellos gana. Es la modificación con más efecto y menos rastro visible de toda la
    configuración de parámetros. Antes de tocarlo, hay que saber qué combinaciones tienen
    valor en más de un nivel.

## El filtro del parámetro { #filtro }

Además de los criterios, un parámetro puede llevar un **filtro**: condiciones que limitan
sobre qué combinaciones existe. Con filtro, Parámetros Generales solo muestra las
combinaciones que lo cumplen.

Es útil —evita cargar valores donde no aplican— y tiene un efecto secundario que sorprende:
las combinaciones que dejan de cumplir el filtro **desaparecen de la pantalla**. El valor no
se borra, pero deja de estar a la vista y deja de poder corregirse desde la interfaz.

## Valores con vigencia { #vigencia }

Algunos parámetros no son un número sino **un número por periodo**: la cobertura de
diciembre no es la del resto del año. Para esos, un valor lleva su rango de fechas además de
sus filtros.

Dos rangos que se solapen sobre las mismas combinaciones **colisionan**, y entonces cuál
manda deja de estar definido. Por eso la pantalla ofrece verificar la colisión antes de
guardar, y conviene usarlo siempre que se añada un rango sobre un parámetro que ya tenía
valores. Un parámetro sin vigencia rige siempre; uno con vigencia rige solo dentro de ella.

## Cuándo surte efecto { #cuando-surte-efecto }

Un parámetro guardado no cambia el número que tienes en pantalla: entra en el **siguiente
cálculo**. Ver [El ciclo diario de datos](ciclo-diario-de-datos.md).

Eso vale también al revés: si un sugerido cambió y nadie tocó el pronóstico, un parámetro
editado ayer es el sospechoso habitual.

## Cómo averiguar qué valor está usando un producto { #como-averiguarlo }

1. Abre el parámetro en **Parámetros Generales** y busca la combinación exacta del producto
   —su bodega, su proveedor, su categoría—.
2. Si aparece en varias filas a distintos niveles, mira el **Orden de agrupación** del
   parámetro en Configuración de Parámetros: ese orden decide.
3. Si el parámetro tiene vigencia, comprueba qué rango cubre la fecha de hoy.
4. Y contrasta con el **Detalle de Recomendación** del producto, que muestra los parámetros
   con los que se calculó esa recomendación.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md)
- [Reglas de negocio y plugins](reglas-de-negocio-y-plugins.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md)
