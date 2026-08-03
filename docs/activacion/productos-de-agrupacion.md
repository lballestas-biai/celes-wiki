---
title: Productos de Agrupación
module: Activación
route: /activation/grouping-products
aliases: [/administration/configuration/grouping-products, /administration/configuration/synthetic-products]
permission: activation.grouping-products
audience: [Administradores, Implementadores]
summary: >
  Productos de Agrupación resuelve el producto que solo tiene señal en conjunto: se describe con
  filtros qué productos son la misma cosa a efectos de demanda y por qué columnas se agrupan, y
  Celes pronostica sobre la serie consolidada en vez de sobre cada variante suelta.
keywords: [productos de agrupación, agrupación, filtros, secuencia, jerarquía, importación masiva]
tenant_variance: high
status: verified
verified_at: 2026-08-03
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationGroupingProducts/AdministrationGroupingProductPage/components/GroupingProductList/GroupingProductList.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationGroupingProducts/AdministrationGroupingProductDetailPage/AdministrationGroupingProductDetailPage.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationGroupingProducts/AdministrationGroupingProductDetailPage/components/AdditionalConfigsFields.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationGroupingProducts/AdministrationGroupingProductPage/components/UploadGroupingProductsDialog/UploadGroupingProductsDialog.tsx
    ref: 9e2f8b758
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: 9e2f8b758
---

# Productos de Agrupación

## Qué es y para qué sirve { #que-es }

Una talla concreta de una camisa se vende de forma intermitente; la camisa —todas sus tallas y
colores— se vende todos los días. Pronosticar la variante suelta es modelar ruido; pronosticar la
familia y devolver el resultado al detalle es lo que da un número usable.

Esta pantalla es donde se declara esa familia. Una agrupación **no nombra productos uno por uno**:
los describe con filtros y con las columnas por las que se agrupan. Esa es la diferencia con
[Sustitutos](sustitutos.md), que declara una pareja concreta.

![Productos de Agrupación sin ninguna agrupación configurada: es lo que ve quien entra por
primera vez, con los botones de importar y agregar.](../assets/screenshots/activacion/productos-de-agrupacion.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver las agrupaciones configuradas.** La tabla lista cada agrupación con su nombre, su
descripción y sus configuraciones. Estar vacía es normal en una instancia recién puesta en
marcha: la agrupación se configura cuando el catálogo la pide.

**Crear una agrupación.** **Agregar Producto de Agrupación** abre el formulario, que tiene tres
partes.

*Identificación* — **Nombre de la agrupación** y **Descripción**.

*Configuraciones adicionales* — cinco valores que gobiernan cómo se aplica:

| Campo | Qué hace |
|---|---|
| **Fecha de agrupación inicial** y **final** | La vigencia. Cada fecha limita a la otra: la aplicación no deja elegir un inicio posterior al fin |
| **Múltiplo de empaque** | Corrige la equivalencia cuando las variantes no vienen en la misma presentación. Mínimo 1 |
| **Porcentaje de agrupación** | Cuánto de la demanda se consolida. Entre 0,01 y 100, con dos decimales |
| **Secuencia** | Resuelve el empate cuando un producto cae en más de una agrupación: se procesa antes la de secuencia menor. Entero, mínimo 1 |

*Las dos pestañas* — lo que define el alcance:

- **Filtros** dice **qué productos entran**. Un producto entra cuando cumple todos los filtros
  declarados (por ejemplo, categoría *camisas* y color *rojo*).
- **Agrupación** dice **por qué columnas se agrupa**. Se eligen de *Campos disponibles* y se
  colocan en *Orden de agrupación*, donde **el orden define la jerarquía**; se reordenan
  arrastrándolas o desde el menú de cada campo.

**Editar y eliminar.** *Ver* abre la agrupación con sus valores actuales; *Eliminar* pide
confirmación con el nombre de la agrupación.

**Importar en bloque.** **Importar** abre la *Importación masiva de productos de agrupación*: se
descarga la **plantilla**, se llenan sus hojas —*Productos de agrupación*, *Agrupación* y
*Filtros*— y se sube el archivo. El resultado se informa por fila, con el conteo de **Creados**,
**Actualizados**, **Omitidos** y **Con error**. Si el archivo no pasa la validación, la
aplicación enumera los motivos y no crea nada.

**Exportar.** La tabla lleva el botón de exportación de los listados.

!!! warning "Sobrescribir es destructivo"

    La importación trae una casilla, **Sobrescribir productos de agrupación existentes**, que
    reemplaza la configuración de la agrupación con la misma referencia. No fusiona: lo que diga
    el archivo pasa a ser lo único que queda. La propia pantalla lo advierte al marcarla.

!!! tip "Un archivo grande se procesa en segundo plano"

    Pasado cierto tamaño, la importación deja de ser inmediata: la aplicación avisa de que
    continúa en segundo plano y te informa al terminar. Puedes cerrar el diálogo y seguir
    trabajando; la lista se actualiza sola cuando el proceso acaba.

!!! warning "La secuencia no es decorativa"

    En cuanto existe más de una agrupación, un producto puede caer en varias, y entonces la
    secuencia decide cuál manda. Dejarlas todas con el mismo valor no evita el conflicto: lo hace
    impredecible.

## Qué necesita para funcionar { #requisitos }

- **El permiso `activation.grouping-products`** —o el anterior
  `administration.configuration.synthetic-products`, que abre la misma pantalla en su dirección
  anterior— y el de edición sobre él para crear, importar o eliminar.
- **Los maestros de producto cargados y homologados**: tanto los filtros como el orden de
  agrupación se arman con columnas del catálogo. Ver
  [Datos Maestros](../administracion/datos-maestros.md).
- **Un archivo Excel** con las tres hojas de la plantilla, para la importación masiva.

Una agrupación **no recalcula nada en el momento**: se aplica en la siguiente corrida diaria y, si
la vigencia empieza más adelante, a partir de esa fecha.

## Conceptos relacionados { #conceptos }

- [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md) — por qué se consolida la
  demanda, y por qué el producto individual puede quedar sin pronóstico propio.
- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md) — qué es lo que Celes
  pronostica, y por qué la señal importa más que el detalle.
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md) — cuándo se nota el cambio.
