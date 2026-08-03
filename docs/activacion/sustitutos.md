---
title: Sustitutos
module: Activación
route: /activation/substitute-products
aliases: [/administration/configuration/substitute-products]
permission: activation.substitute-products
audience: [Administradores, Implementadores]
summary: >
  Sustitutos es donde se declara que un producto reemplaza a otro —o una bodega a otra— para que
  la demanda del que se va no se pierda. Cada sustitución tiene su vigencia, su porcentaje y su
  múltiplo de empaque, y la aplicación valida que ambos productos existan donde se aplica.
keywords: [sustitutos, sustitución, producto origen, producto destino, vigencia, bodega, importación masiva]
tenant_variance: high
status: verified
verified_at: 2026-08-03
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationSubstituteProducts/AdministrationSubstituteProductsPage/components/SubstituteProductList/SubstituteProductList.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationSubstituteProducts/AdministrationSubstituteProductsPage/components/SubstituteProductList/helpers.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationSubstituteProducts/AdministrationSubstituteProductDetailsPage/AdministrationSubstituteProductDetailsPage.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationSubstituteProducts/AdministrationSubstituteProductDetailsPage/ProductSubstitution/ProductSubstitution.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: 9e2f8b758
---

# Sustitutos

## Qué es y para qué sirve { #que-es }

Un producto cambia de código, una referencia se descontinúa y otra la reemplaza, una bodega deja
de operar y sus ventas se van a otra. Para el sistema son cosas distintas; para el cliente que
compra, es la misma. Sin decirlo, el que llega arranca sin historia y el que se va sigue pesando
en el pronóstico.

Esta pantalla es donde se dice. Una sustitución nombra un **origen** y un **destino** concretos
—productos o bodegas—, y con ellos la demanda se traslada de uno a otro durante la vigencia que se
le fije.

![Las sustituciones configuradas, con su tipo, sus fechas y su vigencia. En las instancias que
conservan el permiso anterior, la pantalla se titula «Productos Sustitutos» y vive dentro de
Administración › Configuración
General.](../assets/screenshots/activacion/sustitutos.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver las sustituciones configuradas.** La tabla lista cada una con su **Nombre de la
sustitución**, su **Tipo de Sustitución**, las fechas, el **Porcentaje de sustitución** y una
columna **Vigencia** que la aplicación deduce de las fechas:

| Vigencia | Qué significa |
|---|---|
| **Vigente** | Hoy cae dentro del periodo. Una sustitución sin fecha final se mantiene vigente |
| **Programada** | La fecha inicial es futura: todavía no mueve nada |
| **Vencida** | La fecha final ya pasó |

La descripción y las columnas de autoría llegan ocultas; el **panel de columnas** las trae de
vuelta. La tabla **no se ordena por columna**: se pagina contra el servidor, así que ordenar solo
reordenaría la página que estás viendo.

**Crear una sustitución.** **Crear producto sustituto** abre el formulario, y lo primero es el
**Tipo de Sustitución**, que decide el resto:

| Tipo | Qué hace |
|---|---|
| **Sustituir dentro de una misma tienda** | Un producto reemplaza a otro. Se declara el **Producto origen** y el **Producto destino**, y las bodegas donde aplica |
| **Sustituir bodega** | Una bodega reemplaza a otra por completo — la pantalla lo advierte: *la Bodega se sustituirá totalmente*. Se declara la **Bodega origen** y la **Bodega destino**, y se pueden añadir filtros para acotar qué productos entran |

Después, cuatro campos comunes a los dos tipos: **Fecha de sustitución inicial** y **final**, el
**Porcentaje de sustitución** —cuánto de la demanda del origen se le atribuye al destino, entre
0,01 y 100— y el **Múltiplo de empaque**, que corrige la equivalencia cuando el destino no viene
en la misma presentación que el origen.

**Editar, ver y eliminar.** Desde el menú de la fila. *Eliminar* pide confirmación con el nombre
de la sustitución.

**Importar en bloque.** **Importar** abre la *Importación masiva de productos sustitutos*, con
plantilla descargable. La sustitución entre productos admite Excel o CSV; la de bodega, solo
Excel, con los filtros en su propia hoja. El resultado se informa por fila con el conteo de
**Creadas**, **Actualizadas**, **Omitidas** y **Con error**, y un archivo grande sigue
procesándose en segundo plano.

!!! warning "El tipo de sustitución no se puede cambiar después"

    Una vez creada, el **Tipo de Sustitución** queda fijo y la pantalla lo deshabilita
    explicándolo. Si te equivocaste de tipo, hay que eliminar la sustitución y crearla de nuevo.

!!! warning "Sobrescribir es destructivo"

    La casilla **Sobrescribir sustituciones existentes** de la importación reemplaza la
    sustitución existente del mismo producto y bodega. No fusiona.

!!! tip "La aplicación avisa de las bodegas donde el producto no existe"

    Antes de guardar, valida que origen y destino existan en las bodegas seleccionadas: las que no,
    **las excluye y lo dice**. Si no queda ninguna bodega válida —o los dos productos no comparten
    ninguna—, no deja guardar. Es la comprobación que evita una sustitución que parece configurada
    y no aplica en ningún sitio.

## Qué necesita para funcionar { #requisitos }

- **El permiso `activation.substitute-products`** —o el anterior
  `administration.configuration.substitute-products`, que abre la misma pantalla en su dirección
  anterior— y el de edición sobre él para crear, importar o eliminar.
- **Los maestros de producto y de bodega cargados y homologados**: origen y destino se eligen del
  catálogo, y la validación de bodegas se apoya en él. Ver
  [Datos Maestros](../administracion/datos-maestros.md).
- **Fechas de vigencia decididas.** Son obligatorias en el formulario y son lo que hace que la
  sustitución empiece y termine cuando el negocio dice, no cuando alguien se acuerda.

Una sustitución **no recalcula nada en el momento**: se aplica en la siguiente corrida diaria y,
si está programada, a partir de su fecha inicial.

## Conceptos relacionados { #conceptos }

- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md) — cuándo conviene una
  sustitución y cuándo una agrupación, y qué pasa con el producto que cede su demanda.
- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md) — por qué la historia importa
  tanto.
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md) — cuándo se nota el cambio.
