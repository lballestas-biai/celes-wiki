---
title: Requisitos de datos
module: Primeros pasos
audience: [Clientes, Implementadores, Administradores]
summary: >
  Celes calcula sobre los datos de tu operación: ventas, inventario, maestros,
  movimientos y parámetros. Esta página resume qué información necesita cada capacidad
  del producto, por qué caminos puede entrar, cada cuánto debe llegar y cómo comprobar
  que llegó bien.
keywords: [datos, requisitos, ingesta, carga de datos, homologación, calidad de datos, frescura]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/api-core/alembic/versions/2026_02_19_1500-f6a7b8c9d0e1_repopulate_canonical_schema.py
    ref: d3c915057
  - repo: celes-platform
    path: apps/api-core/src/data_mapper/domain/entities/mapping_config.py
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/pages/IntegrationEngine/components/ModuleCards/ModuleCards.tsx
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataUploadPage/ingestaGuide.ts
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dataUpload.json
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dataQuality.json
    ref: d3c915057
  - repo: celes-platform
    path: apps/api-core/src/common/event_ledger/event_types.py
    ref: d3c915057
---

# Requisitos de datos

## Qué necesita recibir Celes { #que-necesita }

Celes define un modelo de datos propio —el mismo para todos— y tu información se traduce
a él. Está organizado en **cinco grupos**, uno por capacidad del producto, con **19
entidades** y **267 campos** en total, de los cuales **138 son obligatorios**. Cada
grupo suma sobre el anterior: sin el primero no hay nada que calcular.

| Grupo | Qué información pide | Para qué se usa |
|---|---|---|
| **Pronóstico** | Ventas, inventario, precios de lista, los maestros (compañía, puntos de venta, bodegas, centros de distribución, centros operativos, productos y proveedores) y las relaciones entre ellos | Estimar la demanda. Es la base de todo lo demás |
| **Pronóstico promocional** | Las promociones: fechas de vigencia, precio normal y precio promocional | Separar el efecto de una promoción de la demanda de fondo |
| **Distribución** | Movimientos de inventario (incluido lo que va en tránsito), las compras con su estado y lo ya recibido, y los parámetros de distribución | Calcular cuánto mandarle a cada punto |
| **Compras** | Los parámetros de compra | Calcular cuánto pedirle a cada proveedor |
| **Fabricación** | La lista de materiales: qué componentes y en qué cantidad lleva cada producto terminado | Llevar la demanda del producto final a sus insumos |

Cuatro cosas que conviene tener claras antes de la implementación:

- **Los maestros no son solo catálogos.** Además de productos, tiendas y bodegas, Celes
  necesita las **relaciones**: qué centro de distribución surte a qué bodega y con qué
  prioridad, y qué proveedor atiende qué producto, con qué prioridad y bajo qué tipo de
  operación —almacenamiento, entrega directa o *cross-docking*—. Sin esas relaciones hay
  pronóstico, pero no hay a quién comprarle ni a dónde despachar.
- **Los parámetros también son datos.** Nivel de servicio, periodo de revisión, tiempos
  de entrega del proveedor y del último tramo, días de compra y de despacho, mínimos,
  múltiplos y capacidades. En los grupos de Distribución y Compras **todos** los campos
  de parámetros son obligatorios: son la política que el cálculo va a respetar.
- **Los precios llevan vigencia.** Se cargan con fecha de inicio y de fin, no como un
  valor único por producto.
- **Hay información opcional que solo suma.** Los datos de empleados, por ejemplo, no
  tienen ningún campo obligatorio: enriquecen el análisis, no condicionan el cálculo.

## Por dónde entran los datos { #como-llegan }

Hay dos caminos, y no son excluyentes:

**1. Conectando tu fuente.** Celes lee la información donde ya vive y la traduce a su
modelo en [Homologación](../administracion/homologacion.md) —la misma herramienta que
aparece como [Motor de Integración](../administracion/motor-de-integracion.md) dentro de
Configuración General—. Ahí se enlaza cada campo tuyo con el campo que Celes espera, y
para lo que tu sistema no tiene se pueden crear **campos virtuales**, con un valor fijo o
con una fórmula sobre tus propias columnas, además de filtros para descartar filas que no
deben entrar.

**2. Subiendo archivos.** En [Carga de Datos](../administracion/carga-de-datos.md) se
sube un archivo por entidad, en `.parquet`, `.xlsx`, `.csv` o `.txt`. Antes de confirmar,
la pantalla previsualiza el archivo y compara sus columnas con las que la entidad espera,
diciendo cuáles faltan y cuáles sobran. Cada entidad ofrece además un **Excel de ejemplo**
y la pantalla entrega una **guía de ingesta** descargable: la lista completa de campos con
su obligatoriedad, su descripción y un ejemplo, más tres columnas en blanco para que
anotes de qué sistema, tabla y campo tuyos sale cada uno. Esa guía es el documento con el
que normalmente arranca una implementación.

!!! tip "Cuándo se considera completa una entidad"

    Homologación marca una entidad como completa cuando **todos sus campos obligatorios
    están enlazados**, y muestra el avance por grupo (por ejemplo, «3/4 tablas
    completas»). Las entidades sin ningún campo obligatorio no entran en esa cuenta.
    Mientras un grupo esté incompleto, lo que depende de él no se puede calcular.

## Cada cuánto tienen que llegar { #frecuencia }

Celes reprocesa **una vez al día**, a una hora acordada con cada cliente. Lo que esté
cargado a esa hora es lo que entra en los números del día; lo que llegue después espera a
la corrida siguiente. Por eso el acuerdo importante de la implementación no es solo *qué*
mandas, sino *a qué hora*.

Como regla práctica:

- **Todos los días**, antes del corte: ventas, inventario, movimientos y compras.
- **Cuando cambien, y antes de que empiecen a regir**: precios y promociones. Una
  promoción cargada después de arrancar no puede corregir un pronóstico que ya se calculó.
- **Cuando cambien**: los maestros y sus relaciones —producto nuevo, tienda nueva,
  proveedor que cambia.
- **Cuando cambie la política**: los parámetros.

El detalle de qué pasa en esa corrida y desde qué momento del día los números son los
definitivos está en [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).

## Cómo saber si llegaron bien { #calidad }

[Calidad de Datos](../administracion/calidad-de-datos.md) responde esa pregunta sin tener
que abrir un reporte y desconfiar de él:

- **Frescura de Datos** — cada fuente aparece como **Vigente**, **Advertencia** o
  **Desactualizado** según su antigüedad, agrupadas por dominio: Ventas, Cadena de
  suministro, Finanzas y Datos maestros. Es lo primero que hay que mirar cuando «los
  números de hoy se ven raros».
- **Resultados de Pruebas** — validaciones clasificadas por dimensión: Completitud,
  Exactitud, Unicidad, Validez, Consistencia y Oportunidad.
- **Anomalías** — valores que se salen del rango esperado frente a su propio histórico.
- **Panel General** — el resumen de todo lo anterior.

## Qué pasa si falta algo { #si-falta }

- **Falta un campo obligatorio.** Su entidad no se considera completa y el grupo que
  depende de ella no se procesa. Es un bloqueo de implementación, no un número raro.
- **Falta un maestro o una relación.** El producto existe pero no tiene a quién
  comprársele ni desde dónde surtirse: aparece en los datos y no en los sugeridos.
- **Un archivo llegó tarde.** El cálculo del día usó el corte anterior. Los números no
  están mal, están viejos — y Frescura de Datos lo muestra.
- **Un campo opcional no llega.** No bloquea el cálculo, pero recorta lo que puedes ver:
  un análisis por marca o por categoría necesita que esa marca y esa categoría vengan en
  el maestro de productos.

!!! info "Tu instancia puede pedir menos"

    Qué grupos y qué entidades aplican se configura por empresa: si no contrataste una
    capacidad, sus entidades no se te piden. Lo de arriba es el modelo completo, no una
    lista de tareas para todo el mundo. Ver
    [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md).
