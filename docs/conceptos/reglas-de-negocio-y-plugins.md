---
title: Reglas de negocio y plugins
module: Conceptos
audience: [Clientes, Usuarios, Administradores]
summary: >
  Celes deja intervenir el cálculo en tres sitios distintos: reglas de negocio que marcan
  productos, pasos del pipeline que definen cómo se calcula, y plugins que ajustan una
  orden concreta. Confundirlos lleva a tocar lo que no era.
keywords: [reglas de negocio, plugins, pipeline, presupuesto, cubicaje, segmentos]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/OrderPluginsSelector.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationBusinessRules/components/BusinessRulesForm.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/order_plugins/application/service.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/configs/application/services/business_rule_service.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# Reglas de negocio y plugins

## Tres sitios donde se interviene el cálculo { #tres-sitios }

Cuando alguien dice «hay que cambiar cómo Celes calcula esto», puede estar hablando de
tres cosas muy distintas. Se distinguen por **cuándo surten efecto** y **a quién afectan**:

| | Reglas de negocio | Pasos y plugins del pipeline | Plugins de orden |
|---|---|---|---|
| **Qué cambian** | Cómo se clasifica un producto | Cómo se calcula el sugerido | Las cantidades de *esta* orden |
| **Dónde se definen** | [Reglas de Negocio](../activacion/reglas-de-negocio.md) | [Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md) | En la propia mesa de trabajo de la orden |
| **Cuándo aplican** | En la siguiente corrida diaria | En la siguiente corrida diaria | En el momento, sobre el borrador |
| **A quién afectan** | A todos | A todos | Solo a quien está armando esa orden |
| **Quién suele tocarlo** | Negocio, con acompañamiento | Implementación | Compras o distribución, a diario |

La regla práctica: **lo que cambia el cálculo se ve mañana; lo que cambia una orden se ve
ahora**.

## Reglas de negocio { #reglas-de-negocio }

Una regla de negocio contesta preguntas de clasificación sobre el catálogo: *¿este producto
se compra?*, *¿este se distribuye?*, *¿qué prioridad tiene?*. No calcula cantidades: decide
si un producto entra al cálculo y con qué etiqueta.

Se trabajan en **conjuntos de reglas**, no sueltas. Cada conjunto tiene su nombre, su
descripción y un **estado** —creado, aprobado o rechazado—, que es lo que permite escribir
una regla, revisarla y recién entonces dejarla actuar. Dentro del conjunto, cada regla es
una condición y lo que se asigna cuando se cumple.

Dos advertencias que valen más que la mecánica:

!!! warning "Una regla no tiene alcance parcial"

    Un conjunto de reglas aplica a todo lo que cumpla su condición, en toda la empresa. No
    existe «probémoslo en una tienda»: si la condición está mal acotada, el efecto es
    general. Antes de aprobar, la pregunta es cuántos productos cambian de clasificación,
    no cuáles.

!!! warning "Excluir de comprar no es excluir de distribuir"

    Son marcas distintas y se resuelven por separado. Un producto puede estar fuera de la
    compra y seguir apareciendo en la distribución, y a la inversa. Si el objetivo es
    sacarlo de la operación, hay que decirlo en las dos.

## Pasos y plugins del pipeline { #pipeline }

El sugerido no sale de una fórmula: sale de una **secuencia de pasos** por módulo
—distribución, compra, escasez, sustitutos, sintéticos—. Cada paso hace una cosa (cubrir la
demanda del periodo, calcular el inventario de seguridad para absorber la variabilidad de
la demanda y del tiempo de entrega, aplicar múltiplos) y recibe sus argumentos.

Lo que en esta pantalla se llama **plugin** es un paso disponible para añadir a la
secuencia. La aplicación conoce las dependencias entre pasos: avisa si falta uno previo, si
hay conflicto con otro ya agregado, o si el paso solo puede usarse una vez.

Un paso puede configurarse de dos maneras:

- **Global** — un solo juego de valores para todo.
- **Por segmentos** — varios juegos, cada uno con las condiciones de los productos a los
  que aplica y un segmento por defecto para el resto. **Si un producto cumple más de un
  segmento, se usa el primero de la lista**; el orden es la política, no un detalle.

Cambiar esto cambia lo que calcule ese módulo **a partir de la siguiente corrida**, para
todos. No es una pantalla de operación diaria.

## Plugins de orden { #plugins-de-orden }

Estos son los que un comprador usa a diario. Actúan **sobre el borrador de una orden ya
abierta**, sobre lo que esté filtrado en ese momento, y no cambian el cálculo de nadie más:

| Plugin | Qué hace |
|---|---|
| **Restricción de Presupuesto** | Ajusta las cantidades para no pasar de un presupuesto, priorizando por cobertura, velocidad de venta, venta en dinero o la prioridad configurada. Puede también *subir* cantidades para aprovechar el presupuesto |
| **Restricción de Dimensiones** | Lo mismo, pero contra cajas, peso o volumen, con un máximo y un mínimo opcional —el mínimo sirve cuando el proveedor exige un piso de compra— |
| **Cálculo de Cubicaje** | Reparte los productos en camiones respetando su capacidad, y deja armarlos a mano arrastrando productos |
| **Sobreescribir Cantidad** | Fija la misma cantidad a todos los productos filtrados |
| **Vaciar CEDI** | Redistribuye el excedente del centro entre los ítems filtrados |

Tres cosas que conviene saber antes de usarlos:

- **El alcance es el filtro.** Se aplican a *todo lo que esté filtrado*, no a lo
  seleccionado en pantalla. Un filtro más amplio de lo que crees es el error más caro aquí,
  y la aplicación lo advierte en los plugins más destructivos.
- **Cada plugin depende de un permiso.** El selector solo aparece si tienes al menos uno, y
  solo lista los que puedes usar. Que un compañero vea una opción que tú no ves es normal.
- **Escriben sobre el borrador.** Sobrescriben las cantidades sugeridas; el sugerido
  original se recalcula en la siguiente corrida.

## Cómo elegir dónde intervenir { #donde-intervenir }

- *«Este producto no debería aparecer nunca en compras»* → **regla de negocio**.
- *«El sugerido debería cubrir dos semanas y no una»* → normalmente un **parámetro**, no
  una regla; ver [Jerarquía de parámetros](jerarquia-de-parametros.md).
- *«El cálculo debería tener en cuenta el inventario de seguridad de otra forma»* → **paso
  del pipeline**.
- *«Este pedido no puede pasar de este dinero»* → **plugin de orden**.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md)
- [Jerarquía de parámetros](jerarquia-de-parametros.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md)
