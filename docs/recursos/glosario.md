---
title: Glosario
module: Recursos
audience: [Clientes, Usuarios]
summary: >
  Los términos que aparecen en Celes y en el oficio del retail, explicados en una o dos
  frases. Cada entrada enlaza la página donde ese término se usa de verdad, así que el
  glosario sirve tanto para entender una palabra como para saber dónde mirar después.
keywords: [glosario, términos, vocabulario, definiciones, retail]
tenant_variance: none
status: verified
verified_at: 2026-08-01
sources:
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dashboard.json
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/work-area.json
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/reports-and-analytics.json
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/fields.json
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: a3437e470
  - repo: celes-wiki
    path: docs/conceptos
    ref: main
---

# Glosario

Dos clases de palabras conviven en Celes: las **del oficio** —cobertura, quiebre, GMROI—, que
existen fuera de la herramienta, y las **de la herramienta** —sugerido, escenario, plugin—, que
significan algo concreto aquí. Este glosario mezcla las dos a propósito: quien pregunta «¿qué es
esto?» no suele saber de cuál de las dos se trata.

Cada entrada termina en la página donde ese término se usa. Si buscas uno que no está, el
buscador de arriba encuentra las palabras dentro de las páginas.

## A { #a }

Adherencia
:   Qué parte de lo que Celes sugirió terminó pedida y recibida de verdad. Mide cuánto se sigue
    la recomendación, no si la recomendación era buena.
    Ver [Adherencia](../reportes/adherencia.md#lectura).

ANS
:   *Acuerdo de nivel de servicio.* El tiempo comprometido para responder y para resolver un
    ticket de soporte, según su prioridad. Ver [Soporte](soporte.md#columnas-ans) y
    [Dashboard ANS](../administracion/dashboard-ans.md).

AOV
:   *Valor promedio de orden.* El promedio de dinero que un cliente gasta por transacción. Es
    vocabulario de retail, no un cálculo de Celes.

Asignación CD
:   La etapa del cálculo que reparte entre centros de distribución cuando hay más de uno.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md#etapas).

Automatización
:   Que Celes ejecute solo lo que alguien haría a mano: calcular la distribución o la compra y,
    si está configurado, enviar la orden. Tiene condiciones, y la primera es que los datos del
    día estén listos.
    Ver [La automatización y sus condiciones](../conceptos/automatizacion-y-sus-condiciones.md).

## B { #b }

Balanceo de inventario
:   La comparación entre lo que sobra en unos puntos y lo que falta en otros, para mover
    inventario que ya está dentro de la cadena en lugar de comprar más.
    Ver [Balanceo de Inventario](../reportes/balanceo-de-inventario.md).

Bodega
:   Cualquier punto donde hay inventario: una tienda, un centro de distribución, un almacén. Es
    la palabra que usan las columnas y los filtros de Celes cuando no importa de qué tipo es.

## C { #c }

Calidad de datos
:   Las comprobaciones sobre lo que llega cada día: si llegó, si llegó completo y si llegó a
    tiempo. Ver [Calidad de Datos](../administracion/calidad-de-datos.md) y
    [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md#calidad).

Campaña
:   El envoltorio de un conjunto de promociones con un mismo periodo y objetivo. Dentro viven
    las promociones, y es el nivel donde se aprueba o se rechaza.
    Ver [Campañas](../promociones/campanas.md).

CEDI
:   *Centro de distribución.* El punto desde el que se surte a las tiendas. Reponerlo es una
    **compra**, aunque el producto venga de otro punto de la propia cadena; repartir desde él es
    una **distribución**.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md#dos-preguntas).

Cobertura
:   Cuántos días de venta alcanza el inventario que hay. Es a la vez una medida —los días que
    cubres hoy— y un objetivo —los días que quieres cubrir—, y como objetivo es uno de los
    parámetros que más mueve el sugerido.
    Ver [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

Colaborador externo
:   Alguien de fuera de tu empresa —normalmente un proveedor— con acceso acotado a lo suyo.
    Ver [Colaboradores Externos](../administracion/colaboradores-externos.md).

Cubicaje
:   El volumen y el peso del pedido frente a lo que cabe en el transporte. Sirve para que un
    sugerido llene el camión en vez de dejarlo a medias o pasarse.
    Ver [Configuraciones de Cubicaje](../administracion/configuraciones-de-cubicaje.md).

## D { #d }

Demanda
:   Lo que tus clientes habrían comprado. **No es la venta**: cuando un producto está agotado, la
    venta es cero y la demanda no. Celes pronostica demanda, y esa distinción es la que evita que
    el pronóstico aprenda de tus propios quiebres.
    Ver [Filosofía del forecast](../conceptos/filosofia-del-forecast.md#demanda-no-es-venta).

Detalle de Recomendación
:   El panel que muestra, producto por producto, la cuenta que produjo el sugerido: inventario
    inicial, demanda del periodo, entradas previstas, inventario final y pedido resultante. Es el
    primer sitio donde mirar cuando un número sorprende.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md#esqueleto).

Días de inventario
:   Los días que durará el inventario actual al ritmo de venta esperado. Es la forma habitual de
    comparar puntos con volúmenes muy distintos.

Distribución
:   Repartir hacia las tiendas el inventario que ya está dentro de la cadena. A diferencia de la
    compra, no puede inventar inventario: si el centro no alcanza, alguien recibe menos.
    Ver [Distribuir](../reabastecimiento/distribuir.md).

## E { #e }

Escasez
:   La etapa del cálculo que decide quién recibe qué cuando el centro no tiene suficiente para
    todas las tiendas. No reparte por orden de llegada ni recorta parejo.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md#escasez).

Escenario
:   Una modificación del pronóstico acotada a un periodo, unos productos y unos puntos: «esto va
    a vender más estas dos semanas». Se aprueba, tiene vigencia y se puede revertir.
    Ver [Escenarios](../pronostico/escenarios.md).

Excedente
:   El inventario que sobra en un punto respecto a lo que necesita. Es lo que hace posible
    moverlo a donde falta.
    Ver [Balanceo de Inventario](../reportes/balanceo-de-inventario.md).

Exhibición
:   Espacio adicional para un producto —una punta de góndola, una isla— durante un periodo. Suma
    inventario en la tienda por encima de lo que pediría la reposición normal.
    Ver [Promociones de Exhibición](../surtido/promociones-de-exhibicion.md).

## F { #f }

Forecast
:   Ver **Pronóstico**.

## G { #g }

GMROI
:   *Retorno de la inversión de margen bruto.* Cuánto beneficio bruto genera cada unidad de
    moneda invertida en inventario. Junta rentabilidad y rotación en un solo número.
    Ver [Histórico](../reportes/historico.md).

## H { #h }

Histórico
:   El reporte del desempeño del negocio en un periodo: venta, margen, inventario, quiebres.
    Antes se llamaba *Desempeño General*. Ver [Histórico](../reportes/historico.md).

Homologación
:   Hacer coincidir los códigos de tu empresa con los que espera Celes, para que un mismo
    producto o punto sea uno solo aunque venga escrito de dos maneras.
    Ver [Homologación](../administracion/homologacion.md).

## I { #i }

Instancia
:   La configuración de Celes de una empresa: sus pantallas, sus parámetros, sus reglas y sus
    datos. Dos instancias del mismo producto pueden comportarse distinto, y por eso esta wiki
    describe el comportamiento base.
    Ver [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md).

## L { #l }

Lead time
:   El tiempo que pasa entre pedir y tener el producto disponible para vender. Es un parámetro, y
    el sugerido lo usa para saber qué periodo tiene que cubrir el pedido de hoy.
    Ver [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

## M { #m }

Margen bruto
:   La diferencia entre lo que vendes y lo que te costó, antes de gastos. Se mira en dinero y en
    porcentaje, y casi nunca dicen lo mismo.
    Ver [Desempeño Comercial](../reportes/desempeno-comercial.md).

Mínimo del proveedor
:   La cantidad más pequeña que un proveedor acepta en un pedido. Junto con el múltiplo, es lo que
    convierte un faltante calculado en una cantidad realmente pedible.

Múltiplo de empaque
:   El paquete en el que se compra o se distribuye un producto: si el empaque es de 12, un
    faltante de 7 se convierte en 12 o en 0, según la política. Es la explicación más frecuente de
    un sugerido que no cuadra con la cuenta hecha a mano.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md#esqueleto).

## N { #n }

Nivel de servicio
:   Qué porcentaje de la demanda quieres poder atender sin quedarte sin producto. Subirlo sube el
    stock de seguridad, y con él el sugerido.
    Ver [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

## O { #o }

Orden de compra
:   El pedido a un proveedor, con sus productos, cantidades y condiciones. Se arma desde la lista
    de compra y queda en el historial.
    Ver [Creación de Orden de Compra](../reabastecimiento/creacion-de-orden-de-compra.md).

## P { #p }

Parámetro
:   Un valor de política que el cálculo consulta: cobertura, nivel de servicio, lead time,
    múltiplos. Lo difícil no es el valor, sino **a qué nivel está puesto** —empresa, categoría,
    producto, punto— y desde cuándo rige.
    Ver [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md#que-es).

Permiso
:   Lo que decide qué pantallas ves y qué puedes hacer en ellas. Se agrupan en roles, y un rol
    puede ser de lectura, de edición o de ejecución.
    Ver [Roles y permisos](../primeros-pasos/roles-y-permisos.md#modelo).

Pipeline
:   La secuencia de pasos con la que tu instancia calcula el sugerido. Que sea configurable es la
    razón por la que dos empresas con los mismos datos pueden obtener números distintos.
    Ver [Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md).

Plugin
:   Una pieza que interviene el cálculo en un punto concreto —limitar por presupuesto, ajustar por
    las dimensiones del transporte, vaciar un centro— sin reescribir el resto.
    Ver [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md#plugins-de-orden).

Procesamiento
:   La corrida diaria que actualiza todo: ingiere los datos del día, recalcula el pronóstico y
    produce los sugeridos. Lo que ves en pantalla es siempre el resultado de la **última corrida
    terminada**, no del minuto actual.
    Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md#una-corrida).

Producto de agrupación
:   Un producto que representa a varios para que juntos tengan historia suficiente que
    pronosticar. Antes se llamaba *producto sintético*.
    Ver [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md#las-dos).

Pronóstico
:   La estimación de la demanda futura por producto y punto. Celes distingue el **base** —el que
    calcula el modelo— del **enriquecido**, que incorpora promociones, eventos y escenarios.
    Ver [Filosofía del forecast](../conceptos/filosofia-del-forecast.md#base-y-enriquecido).

## Q { #q }

Quiebre
:   Quedarse sin producto disponible para vender. Es el momento en el que la venta y la demanda
    dejan de coincidir, y por eso importa tanto en el pronóstico.
    Ver [Filosofía del forecast](../conceptos/filosofia-del-forecast.md#demanda-no-es-venta).

## R { #r }

Reabastecimiento
:   El trabajo de mantener el inventario donde tiene que estar: comprar lo que falta y repartir lo
    que hay. Es el módulo donde viven Comprar y Distribuir.
    Ver [Reabastecimiento](../reabastecimiento/index.md).

Regla de negocio
:   Una condición que decide si un producto entra o no en un cálculo —qué se compra, qué se
    distribuye— sin tocar la fórmula.
    Ver [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md#reglas-de-negocio).

Rotación
:   La velocidad a la que un producto se vende respecto al inventario que mantienes de él. Alta
    rotación y alto margen rara vez van juntos, y de esa tensión trata media planificación.

## S { #s }

Sobreinventario
:   Inventario por encima de lo que el punto necesita. Cuánto es «de más» depende del criterio con
    el que se mida, y por eso el reporte lo explica antes de listarlo.
    Ver [Balanceo de Inventario](../reportes/balanceo-de-inventario.md#sobreinventario).

Solicitud de distribución
:   El documento que materializa un reparto desde un centro hacia sus puntos, con cantidades por
    producto y destino.
    Ver [Solicitud de Distribución](../reabastecimiento/solicitud-de-distribucion.md).

Stock de seguridad
:   El colchón de inventario que se mantiene para absorber la variabilidad de la demanda y de los
    tiempos de entrega. Sube con el nivel de servicio que quieras sostener.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md#esqueleto).

Sugerido
:   La cantidad que Celes recomienda pedir o repartir. Es una recomendación, no una orden: se
    revisa, se ajusta y se convierte en pedido cuando alguien lo decide.
    Ver [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md).

Sustituto
:   Un producto que reemplaza a otro —porque se descontinuó o cambió de referencia o de empaque—.
    Declararlo hace que la historia del anterior siga sirviendo para pronosticar el nuevo.
    Ver [Sustitutos y agrupaciones](../conceptos/sustitutos-y-agrupaciones.md#las-dos).

## T { #t }

Trade marketing
:   Las campañas acordadas con proveedores para impulsar un producto en el punto de venta:
    exhibiciones, espacios adicionales, actividades.
    Ver [Trade Marketing](../surtido/trade-marketing.md).

Trazabilidad de entregas
:   El historial de los archivos de órdenes que Celes envía a cada destino, con el resultado de
    cada intento.
    Ver [Trazabilidad de entregas](../reabastecimiento/trazabilidad-de-entregas.md).

## V { #v }

Venta perdida
:   La venta que no ocurrió por no tener producto. No se observa —por definición nadie la
    registra—: se estima a partir de la demanda y del quiebre.
    Ver [Histórico](../reportes/historico.md).

Vigencia
:   El periodo durante el cual un valor rige: un parámetro con fechas, un escenario aprobado, una
    promoción. Fuera de su vigencia, el valor existe pero no se aplica.
    Ver [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md#vigencia).

## Conceptos relacionados { #conceptos }

- [Conceptos](../conceptos/index.md) — las páginas que explican estos términos de verdad
- [Academy](academy.md)
- [Bienvenida](../primeros-pasos/index.md)
- [Novedades de producto](novedades.md)
