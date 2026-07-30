---
title: Demanda y Promociones
module: Pronóstico
route: /planning/demand-and-promotions
aliases: []
permission: planning.demand-and-promotions
audience: [Clientes, Usuarios]
summary: >
  Aquí se ve el pronóstico producto por producto y periodo por periodo, con el histórico al
  lado para comparar. Y desde aquí se arma una promoción: se eligen productos, se fija el
  descuento y Celes estima el volumen incremental y lo que esa promoción deja.
keywords: [demanda, promoción, descuento, ROI, volumen incremental, pronóstico por producto]
tenant_variance: high
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningDemandAndPromotions/PlanningDemandAndPromotionsPage/PlanningDemandAndPromotionsPage.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningDemandAndPromotions/PlanningDemandAndPromotionsDetailsPage/PlanningDemandAndPromotionsDetailsPage.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/common/ProductListForecastOrigin/ForecastSourceDetailsDrawer.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fd8a12056
---

# Demanda y Promociones

## Qué es y para qué sirve { #que-es }

Es la pantalla del pronóstico al detalle. Cada fila es un producto y cada columna un
periodo, y las columnas se agrupan en dos bloques: **Histórico** —lo que ya pasó— y
**Pronóstico** —lo que se espera—. Con eso se responde la pregunta concreta que ninguna
gráfica agregada responde: *¿cuánto se espera vender de este producto, este día, en este
punto?*

Y es, además, donde se arma una promoción. La lógica es la contraria a la de un
[escenario](escenarios.md): aquí no se escribe la cifra, se declara la **palanca** —un
descuento, unas fechas, unos productos— y Celes calcula qué volumen adicional produce eso y
qué deja en el margen.

![El pronóstico día a día por producto, con el histórico al lado, los selectores de unidad e
intervalo y la leyenda del origen del
pronóstico.](../assets/screenshots/pronostico/demanda-y-promociones.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir en qué unidad mirar.** El selector **Unidad** cambia lo que hay en las celdas:
unidades de venta, unidades de compra, unidades de distribución, valor o costo. No es un
detalle de presentación: un pronóstico que en unidades se ve estable puede estar subiendo en
valor, y al revés.

**Elegir el paso del tiempo.** **Intervalo** —*Día*, *Semana*, *Mes*— cambia cuántas
columnas hay y qué se suma en cada una.

**Agrupar como trabajas.** El selector de agrupación de la izquierda decide qué es una fila:
por producto, por centro y producto, o la combinación que tenga configurada tu empresa.

**Ver de dónde sale cada cifra.** Cuando el pronóstico de una celda no es el que calculó el
modelo sino uno modificado, la celda queda marcada con el **origen del pronóstico**:
*Promoción*, *Escenario* o *Mixto* si intervienen los dos. Al pulsarla se abre el detalle de
qué promoción o qué escenario la está cambiando, con su vigencia y su autor. Es la forma
rápida de contestar «¿por qué esta cifra dice esto?».

El interruptor **Mostrar Forecast de Celes y Escenario** pone al lado el pronóstico base
—sin promociones— para poder comparar contra él.

**Crear una promoción.** El recorrido es este:

1. **Elegir los productos** con las casillas, o —si hay filtros puestos— activar
   *Seleccionar todos los productos* para tomar todo lo que caiga bajo ese filtro sin
   marcarlos uno a uno.
2. Pulsar **Crear promoción** y llenar el panel: tipo de promoción, tipo de descuento (*En
   Factura* o *Nota de Crédito*), el porcentaje, las fechas y sobre qué días aplica —todos
   los días, o solo los lunes, o los que elijas—. Si el proveedor aporta, se declara ahí su
   contribución.
3. Celes **estima**: el volumen incremental, los ingresos de línea base y los incrementales,
   la inversión, la utilidad incremental y el **ROI**, con el detalle en formato P&L o en
   tabla.
4. La aplicación **comprueba colisiones** con otras promociones sobre los mismos productos
   en las mismas fechas, y dice cuántos productos y qué días chocan.
5. **Guardar promoción**: se le pone nombre y, si quieres, se asocia a una
   [campaña](../promociones/campanas.md).

**Bajar la tabla.** La exportación entrega lo que ves, y ofrece además *Exportar para
modificar Forecast*: la plantilla con la que se corrigen cifras y se vuelven a subir como
escenario.

**Abrir un producto.** **Ver detalles** lleva al detalle de ese producto, arrastrando los
filtros y el rango que tengas puestos.

!!! warning "Una colisión con una promoción aprobada bloquea el guardado"

    Si los productos y las fechas se cruzan con una promoción **ya aprobada**, la promoción
    nueva no se puede aprobar: dos descuentos simultáneos sobre el mismo producto no se
    pueden estimar por separado. Hay que ajustar fechas, productos, o retirar la otra.

!!! info "Las columnas y las agrupaciones dependen de tu instancia"

    Qué unidades ofrece el selector, qué agrupaciones hay y qué columnas trae la tabla se
    configuran por empresa. Ver
    [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md).

## Qué necesita para funcionar { #requisitos }

- **Fechas futuras para promocionar.** No se puede crear una promoción cuyo rango ya pasó:
  el pronóstico de días pasados no se modifica.
- **Precio y costo cargados.** La estimación de una promoción no es solo volumen: el ROI, la
  utilidad incremental y el P&L salen de comparar ingresos contra costos, y sin esos datos
  esas cifras no se pueden calcular.
- **Una selección de productos, o un filtro.** El botón de crear promoción está apagado
  mientras no haya ni productos marcados ni el modo de seleccionar todo con filtros.
- **Permiso de escritura** para crear promociones. Con solo lectura la tabla se ve y las
  casillas no aparecen.
- **El permiso `planning.demand-and-promotions`.**

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Escenarios](escenarios.md)
- [Campañas](../promociones/campanas.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
