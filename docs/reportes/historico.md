---
title: Histórico
module: Reportes
route: /reports-and-analytics/history
aliases: [/reports-and-analytics/overall]
permission: reports-and-analytics.history
audience: [Clientes, Usuarios]
summary: >
  Histórico es la foto del periodo: cuánto se vendió, cuánto inventario lo sostuvo, cuánta
  venta se perdió por quiebre y qué margen quedó. Todo con el mismo rango de fechas y con
  un desglose que se cambia sobre la marcha.
keywords: [histórico, desempeño general, venta perdida, sobreinventario, GMROI, margen]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.reports-and-analytics.history.index.lazy.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.reports-and-analytics.overall.index.lazy.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/hooks/mockDataGeneralPerformance_v2.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/components/custom/GeneralPerformanceSectionTable/GeneralPerformanceSectionTable.tsx
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: bacaa614e
  - repo: celes-platform
    path: apps/web-client/public/locales/es/reports-and-analytics.json
    ref: bacaa614e
---

# Histórico

## Qué es y para qué sirve { #que-es }

Es la pantalla a la que la aplicación te lleva al entrar a Reportes, y la que responde
**«¿cómo nos fue?»** sin tener que cruzar tres informes.

Su gracia no son los números sueltos —esos están en cualquier reporte de ventas— sino que
los pone **juntos y sobre el mismo periodo**: la venta al lado del inventario que la
sostuvo, y las dos al lado de lo que **no** se vendió porque no había. Vender más con menos
inventario es una buena noticia; venderlo con el doble de inventario y con quiebres en la
otra punta de la red, no. Esa comparación es lo que esta pantalla existe para hacer.

![Histórico: los indicadores del periodo arriba, la curva de venta, inventario y venta
perdida en el centro, y el desglose por proveedor
abajo.](../assets/screenshots/reportes/historico.png)

!!! info "Puede que en tu instancia se llame Desempeño General"

    Es la misma pantalla: cambió de nombre y de dirección, no de contenido. La aplicación te
    muestra la entrada del menú que corresponde al permiso que tengas concedido —el nuevo,
    *Histórico*, o el anterior, *Desempeño General*— y esconde la otra. La captura de arriba
    está tomada de una instancia que todavía usa el nombre anterior.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Leer los indicadores del periodo.** La fila de tarjetas resume el rango de fechas
completo. Las habituales:

| Indicador | Qué dice |
|---|---|
| **Ventas** | Lo vendido en el periodo, en dinero y en unidades |
| **Inventario (último día)** | Cuánto inventario había al cerrar el periodo. No es un promedio: es una foto del último día |
| **Venta Perdida** | Lo que se dejó de vender por no tener producto. Se acompaña del porcentaje que representa sobre la venta total |
| **Utilidad Bruta** | Lo que quedó después del costo, con el margen en porcentaje |
| **Sobreinventario (último día)** | Cuánto del inventario del último día está de más frente a lo que se espera vender |
| **GMROI** | Cuánto margen devuelve cada unidad de dinero invertida en inventario |

**Mover la gráfica.** Los dos selectores de arriba a la derecha cambian el eje del tiempo
—*Día*, *Semana*, *Mes*— y la unidad —*Cantidad* o *Valor*—. La curva muestra a la vez
inventario, venta, venta perdida y sobreinventario, que es la lectura que importa: la venta
perdida casi siempre aparece pegada a un valle del inventario, y verlas separadas cuesta
más que verlas juntas.

**Cambiar el desglose de la tabla.** El selector de la tabla de abajo reparte el mismo
periodo **por proveedor, por tienda, por categoría o por producto**. Es el paso que
convierte «la venta perdida fue del 10 %» en «la venta perdida está en estos seis
proveedores». Algunas instancias añaden aquí otros cortes, como línea y sub-línea.

**Acotar.** Los **Filtros** y el **rango de fechas** de la barra superior aplican a las
tarjetas, a la gráfica y a la tabla a la vez.

**Sacar la información.** La tabla se exporta a Excel o CSV, y admite **suscribirse** para
recibirla periódicamente con los filtros que tengas puestos.

## Cómo leer el periodo { #periodo }

Dos advertencias que evitan la mayoría de las lecturas equivocadas:

- **Las tarjetas del último día no son promedios.** Inventario y sobreinventario son una
  foto del cierre del periodo; ventas, venta perdida y utilidad son acumulados de todo el
  rango. Comparar una foto con un acumulado —«tengo tanto inventario y vendí tanto»— solo
  tiene sentido si tienes claro cuál es cuál.
- **Si el rango llega hasta hoy, el último día está incompleto.** Los datos entran con el
  procesamiento diario, así que el día en curso trae lo que hubiera llegado hasta el último
  cierre. Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).

## Qué necesita para funcionar { #requisitos }

- **Ventas cargadas para el periodo**, o no hay nada que contar.
- **Costo cargado**, si esperas que la utilidad bruta, el margen y el GMROI signifiquen
  algo.
- **Inventario por bodega**, para las tarjetas de inventario y sobreinventario y para la
  curva.
- **El permiso `reports-and-analytics.history`** —o el anterior
  `reports-and-analytics.overall`, que abre la misma pantalla con su nombre de antes—.

## Conceptos relacionados { #conceptos }

- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Balanceo de Inventario](balanceo-de-inventario.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
