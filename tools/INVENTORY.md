<!-- Generado por tools/build-inventory.mjs. No editar a mano. -->

# Inventario canónico de pantallas

Qué pantallas existen en la aplicación, cómo se llaman, quién las ve y qué página de
la wiki les corresponde. Se deriva del código de `celes-app/celes-platform`, no del
mock ni de la memoria de nadie.

**Ref:** `981f61942` (2026-07-29) · **Rutas:** 153 · **Páginas:** 81 (65 de pantalla, 16 transversales)

| Destino | Rutas |
|---|---|
| Página propia | 65 |
| Alias de otra pantalla | 23 |
| Sección dentro de otra página | 9 |
| Detalle o formulario (ruta con parámetro) | 41 |
| Excluida (no es pantalla de producto) | 3 |
| Obsoleta (etiqueta sin pantalla) | 12 |

## Pantallas con página propia

`Permiso` es el que exige `checkModuleAccess` para esa ruta; en Administración basta
que los segmentos de uno sean prefijo de los del otro, en cualquier dirección.

| Ruta canónica | Etiqueta (es) | Etiqueta (en) | Permiso | En el menú | Página | Alias |
|---|---|---|---|---|---|---|
| `/dashboard` | Inicio | Dashboard | cualquiera de `dashboard.*` | sí | `docs/vista-general/panel-de-inicio.md` | — |
| `/work-area/product-dashboard` | Detalle de Producto | Product details | `work-area.product-dashboard` | no | `docs/vista-general/detalle-de-producto.md` | `/product-detail` |
| `/work-area` | Reabastecimiento | Replenishment | cualquiera de `work-area.*` | sí | `docs/reabastecimiento/index.md` | — |
| `/work-area/procurement` | Comprar | Buy | `work-area.procurement` | sí | `docs/reabastecimiento/comprar.md` | — |
| `/work-area/procurement/order` | Creación de Orden de Compra | Procurement order | `work-area.procurement` | no | `docs/reabastecimiento/creacion-de-orden-de-compra.md` | — |
| `/work-area/procurement/order-history` | Historial de Órdenes de Compra | Procurement orders sent | `work-area.procurement` | no | `docs/reabastecimiento/historial-de-ordenes-de-compra.md` | — |
| `/work-area/procurement-calendar` | Calendario de OC | PO Calendar | sin permiso | sí | `docs/reabastecimiento/calendario-de-oc.md` | — |
| `/work-area/replenishment` | Distribuir | Distribute | `work-area.replenishment` | sí | `docs/reabastecimiento/distribuir.md` | — |
| `/work-area/replenishment/order` | Solicitud de Distribución | Replenishment request | `work-area.replenishment` | no | `docs/reabastecimiento/solicitud-de-distribucion.md` | — |
| `/work-area/replenishment/order-history` | Historial de Órdenes de Distribución | Replenishment requests sent | `work-area.replenishment` | no | `docs/reabastecimiento/historial-de-ordenes-de-distribucion.md` | — |
| `/work-area/replenishment-suggestions` | Solicitudes de Tiendas | Store Requests | `work-area.replenishment-suggestions` | sí | `docs/reabastecimiento/solicitudes-de-tiendas.md` | — |
| `/work-area/automation` | Automatización & Operación | Automation & Operation | `work-area.automation` — o el anterior `administration.operation.automatic-replenishment` / `administration.operation.automatic-procurement` / `administration.operation.pipeline-configuration` / `administration.operation.dispatches` | sí | `docs/reabastecimiento/automatizacion-y-operacion.md` | `/administration/operation` |
| `/work-area/automation/automatic-replenishment` | Distribución Automática | Automatic Replenishment | `work-area.automation` — o el anterior `administration.operation.automatic-replenishment` | no | `docs/reabastecimiento/distribucion-automatica.md` | `/administration/operation/automatic-replenishment` |
| `/work-area/automation/automatic-procurement` | Compra Automática | Automatic Purchase Order | `work-area.automation` — o el anterior `administration.operation.automatic-procurement` | no | `docs/reabastecimiento/compra-automatica.md` | `/administration/operation/automatic-procurement` |
| `/work-area/automation/pipeline-configuration` | Configuración de Pipeline | Pipeline Configuration | `work-area.automation` — o el anterior `administration.operation.pipeline-configuration` | no | `docs/reabastecimiento/configuracion-de-pipeline.md` | `/administration/operation/pipeline-configuration` |
| `/work-area/automation/dispatches` | Trazabilidad de entregas | Delivery traceability | `work-area.automation` — o el anterior `administration.operation.dispatches` | no | `docs/reabastecimiento/trazabilidad-de-entregas.md` | `/administration/operation/dispatches` |
| `/planning` | Pronóstico | Forecast | cualquiera de `planning.*` | sí | `docs/pronostico/index.md` | — |
| `/planning/forecast-summary` | Resumen | Summary | `planning.forecast-summary` — o el anterior `reports-and-analytics.forecast` | sí | `docs/pronostico/resumen.md` | `/reports-and-analytics/forecast` |
| `/planning/forecast-alerts` | Alertas de Forecast | Forecast Alerts | `planning.forecast-alerts` — o el anterior `reports-and-analytics.forecast-analysis` | sí | `docs/pronostico/alertas-de-forecast.md` | `/reports-and-analytics/forecast-analysis` |
| `/planning/scenarios` | Escenarios | Scenarios | `planning.scenarios` | sí | `docs/pronostico/escenarios.md` | — |
| `/planning/events-calendar` | Calendario de Eventos | Events Calendar | `planning.events-calendar` | sí | `docs/pronostico/calendario-de-eventos.md` | — |
| `/planning/demand-and-promotions` | Demanda y Promociones | Demand and Promotions | `planning.demand-and-promotions` | sí | `docs/pronostico/demanda-y-promociones.md` | — |
| `/planning/procurement-calendar` | Calendario de Compras | Procurement Calendar | `planning.procurement-calendar` | sí | `docs/pronostico/calendario-de-compras.md` | — |
| `/promotions` | Promociones | Promotions | cualquiera de `promotions.*` | sí | `docs/promociones/index.md` | — |
| `/promotions/campaigns` | Campañas | Campaigns | `promotions.campaigns` — o el anterior `planning.promotional-campaigns` | sí | `docs/promociones/campanas.md` | `/planning/promotional-campaigns` |
| `/promotions/calendar` | Calendario de Promociones | Promotional Calendar | `promotions.calendar` — o el anterior `planning.promotional-calendar` | sí | `docs/promociones/calendario-de-promociones.md` | `/planning/promotional-calendar` |
| `/assortment` | Surtido | Assortment | cualquiera de `assortment.*` | sí | `docs/surtido/index.md` | — |
| `/assortment/trade-marketing` | Trade Marketing | Trade Marketing | `assortment.trade-marketing` — o el anterior `planning.trade-marketing-campaigns` | sí | `docs/surtido/trade-marketing.md` | `/planning/trade-marketing-campaigns` |
| `/assortment/trade-marketing/exhibitions-promotions` | Promociones de Exhibición | Exhibition Promotions | `assortment.trade-marketing` — o el anterior `planning.trade-marketing-campaigns` | no | `docs/surtido/promociones-de-exhibicion.md` | `/planning/trade-marketing-campaigns/exhibitions-promotions` |
| `/activation` | Activación | Activation | cualquiera de `activation.*` | sí | `docs/activacion/index.md` | — |
| `/activation/business-rules` | Reglas de Negocio | Business Rules | `activation.business-rules` — o el anterior `administration.configuration.business-rules` | sí | `docs/activacion/reglas-de-negocio.md` | `/administration/configuration/business-rules` |
| `/activation/grouping-products` | Productos de Agrupación | Grouping Products | `activation.grouping-products` — o el anterior `administration.configuration.synthetic-products` | sí | `docs/activacion/productos-de-agrupacion.md` | `/administration/configuration/grouping-products`<br>`/administration/configuration/synthetic-products` |
| `/activation/substitute-products` | Sustitutos | Substitutes | `activation.substitute-products` — o el anterior `administration.configuration.substitute-products` | sí | `docs/activacion/sustitutos.md` | `/administration/configuration/substitute-products` |
| `/reports-and-analytics` | Reportes | Reports | cualquiera de `reports-and-analytics.*` | sí | `docs/reportes/index.md` | — |
| `/reports-and-analytics/history` | Histórico | History | `reports-and-analytics.history` — o el anterior `reports-and-analytics.overall` | sí | `docs/reportes/historico.md` | `/reports-and-analytics/overall` |
| `/reports-and-analytics/commercial-performance` | Desempeño Comercial | Commercial Performance | `reports-and-analytics.commercial-performance` | sí | `docs/reportes/desempeno-comercial.md` | — |
| `/reports-and-analytics/adherence` | Adherencia | Adherence | `reports-and-analytics.adherence` | sí | `docs/reportes/adherencia.md` | — |
| `/reports-and-analytics/replenishment-report` | Distribuciones Estimadas | Estimated Distributions | `reports-and-analytics.replenishment-report` | sí | `docs/reportes/distribuciones-estimadas.md` | — |
| `/reports-and-analytics/inventory-balancing` | Balanceo de Inventario | Inventory Balancing | `reports-and-analytics.inventory-balancing` | sí | `docs/reportes/balanceo-de-inventario.md` | `/work-area/inventory-balancing`<br>`/work-area/inventory-balancing/details` |
| `/administration` | Administración | Administration | cualquiera de `administration.*` | sí | `docs/administracion/index.md` | — |
| `/administration/configuration` | Configuración General | General Settings | `administration.configuration` (prefijo) | sí | `docs/administracion/configuracion-general.md` | — |
| `/administration/configuration/app-filters` | Filtros | Filters | `administration.configuration.app-filters` (prefijo) | no | `docs/administracion/filtros.md` | — |
| `/administration/configuration/data-allocation` | Asignación de Datos | Data Allocation | `administration.configuration.data-allocation` (prefijo) | no | `docs/administracion/asignacion-de-datos.md` | — |
| `/administration/configuration/general-parameters` | Parámetros Generales | General Parameters | `administration.configuration.general-parameters` (prefijo) | no | `docs/administracion/parametros-generales.md` | — |
| `/administration/configuration/parameters-manager` | Configuración de Parámetros | Parameters Manager | `administration.configuration.parameters-manager` (prefijo) | no | `docs/administracion/configuracion-de-parametros.md` | — |
| `/administration/configuration/cubing-configurations` | Configuraciones de Cubicaje | Cubing Configurations | `administration.configuration.cubing-configurations` (prefijo) | no | `docs/administracion/configuraciones-de-cubicaje.md` | — |
| `/administration/configuration/config-columns` | Columnas | Columns | `administration.configuration.config-columns` (prefijo) | no | `docs/administracion/columnas.md` | — |
| `/administration/configuration/query-builder` | Consultas | Queries | `administration.configuration.query-builder` (prefijo) | no | `docs/administracion/consultas.md` | — |
| `/administration/configuration/reference-products` | Productos de Referencia | Reference Products | `administration.configuration.reference-products` (prefijo) | no | `docs/administracion/productos-de-referencia.md` | — |
| `/administration/configuration/integration-engine` | Motor de Integración | Integration Engine | `administration.configuration.integration-engine` (prefijo) | no | `docs/administracion/motor-de-integracion.md` | — |
| `/administration/configuration/environment-variables` | Variables de entorno | Environment variables | `administration.configuration.environment-variables` (prefijo) | no | `docs/administracion/variables-de-entorno.md` | — |
| `/administration/configuration/other` | Otras configuraciones | Other configurations | `administration.configuration.other` (prefijo) | no | `docs/administracion/otras-configuraciones.md` | — |
| `/administration/access-control` | Control de Acceso | Access Control | `administration.access-control` (prefijo) | sí | `docs/administracion/control-de-acceso.md` | — |
| `/administration/access-control/users` | Usuarios | Users | `administration.access-control.users` (prefijo) | no | `docs/administracion/usuarios.md` | — |
| `/administration/access-control/roles-and-permissions` | Roles y Permisos | Roles and Permissions | `administration.access-control.roles-and-permissions` (prefijo) | no | `docs/administracion/roles-y-permisos.md` | — |
| `/administration/access-control/data-permission` | Permiso de datos | Data Permission | `administration.access-control.data-permission` (prefijo) | no | `docs/administracion/permiso-de-datos.md` | — |
| `/administration/master-data` | Datos Maestros | Master Data | `administration.master-data.mapping` o `administration.master-data.data-quality` — o el anterior `administration.data-manager.mapping` / `administration.data-manager.data-quality` / `administration.data-manager.data-upload` | sí | `docs/administracion/datos-maestros.md` | `/administration/data-manager` |
| `/administration/master-data/mapping` | Homologación | Mapping | `administration.master-data.mapping` — o el anterior `administration.data-manager.mapping` | no | `docs/administracion/homologacion.md` | `/administration/data-manager/mapping` |
| `/administration/master-data/data-quality` | Calidad de Datos | Data Quality | `administration.master-data.data-quality` — o el anterior `administration.data-manager.data-quality` | no | `docs/administracion/calidad-de-datos.md` | `/administration/data-manager/data-quality` |
| `/administration/data-manager/data-upload` | Carga de Datos | Data Upload | `administration.data-manager.data-upload` (prefijo) | no | `docs/administracion/carga-de-datos.md` | — |
| `/administration/external-collaborators` | Colaboradores Externos | External collaborators | `administration.external-collaborators` — o el anterior `planning.external-collaborators` | sí | `docs/administracion/colaboradores-externos.md` | `/planning/external-collaborators` |
| `/administration/job-history` | Historial de Jobs | Job History | `administration.job-history` (prefijo) | sí | `docs/administracion/historial-de-jobs.md` | — |
| `/administration/users-logs` | Logs de Usuarios | Users Logs | `administration.users-logs` (prefijo) | sí | `docs/administracion/logs-de-usuarios.md` | — |
| `/administration/sla-dashboard` | Dashboard ANS | SLA Dashboard | `administration.sla-dashboard` (prefijo) | sí | `docs/administracion/dashboard-ans.md` | — |
| `/support` | Soporte | Support | cualquiera de `support.*` | no | `docs/recursos/soporte.md` | — |

## Páginas sin pantalla

Bienvenida, conceptos transversales y recursos: explican el porqué, no una pantalla.

| Página | Título | Bloque |
|---|---|---|
| `docs/primeros-pasos/index.md` | Bienvenida | Primeros pasos |
| `docs/primeros-pasos/roles-y-permisos.md` | Roles y permisos | Primeros pasos |
| `docs/primeros-pasos/requisitos-de-datos.md` | Requisitos de datos | Primeros pasos |
| `docs/conceptos/index.md` | Conceptos | Conceptos |
| `docs/conceptos/sugerido-compra-vs-distribucion.md` | Sugerido de compra vs. de distribución | Conceptos |
| `docs/conceptos/filosofia-del-forecast.md` | Filosofía del forecast | Conceptos |
| `docs/conceptos/sustitutos-y-agrupaciones.md` | Sustitutos y agrupaciones | Conceptos |
| `docs/conceptos/reglas-de-negocio-y-plugins.md` | Reglas de negocio y plugins | Conceptos |
| `docs/conceptos/jerarquia-de-parametros.md` | Jerarquía de parámetros | Conceptos |
| `docs/conceptos/ciclo-diario-de-datos.md` | El ciclo diario de datos | Conceptos |
| `docs/conceptos/automatizacion-y-sus-condiciones.md` | La automatización y sus condiciones | Conceptos |
| `docs/conceptos/como-se-construyen-los-reportes.md` | Cómo se construyen los reportes | Conceptos |
| `docs/conceptos/por-que-tu-instancia-difiere.md` | Por qué tu instancia puede diferir | Conceptos |
| `docs/recursos/glosario.md` | Glosario | Recursos |
| `docs/recursos/academy.md` | Academy | Recursos |
| `docs/recursos/novedades.md` | Novedades de producto | Recursos |

## Alias

La misma pantalla con dos URL. Las declaradas por `ROUTE_MIGRATIONS` son migraciones en
curso: cuál ve el usuario depende de qué permiso tenga concedido. Las demás llevan la
evidencia en el código que las sostiene.

| Alias | Canónica | Declarado por | Por qué |
|---|---|---|---|
| `/administration/configuration/business-rules` | `/activation/business-rules` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/configuration/grouping-products` | `/activation/grouping-products` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/configuration/substitute-products` | `/activation/substitute-products` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/configuration/synthetic-products` | `/activation/grouping-products` | decisión | redirect en routes/_layout.administration.configuration.synthetic-products.index.tsx: la funcionalidad se renombró a grouping-products (#2420) |
| `/administration/data-manager` | `/administration/master-data` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/data-manager/data-quality` | `/administration/master-data/data-quality` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/data-manager/mapping` | `/administration/master-data/mapping` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/operation` | `/work-area/automation` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/operation/automatic-procurement` | `/work-area/automation/automatic-procurement` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/operation/automatic-replenishment` | `/work-area/automation/automatic-replenishment` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/operation/dispatches` | `/work-area/automation/dispatches` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/administration/operation/pipeline-configuration` | `/work-area/automation/pipeline-configuration` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/planning/external-collaborators` | `/administration/external-collaborators` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/planning/promotional-calendar` | `/promotions/calendar` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/planning/promotional-campaigns` | `/promotions/campaigns` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/planning/trade-marketing-campaigns` | `/assortment/trade-marketing` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/planning/trade-marketing-campaigns/exhibitions-promotions` | `/assortment/trade-marketing/exhibitions-promotions` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/product-detail` | `/work-area/product-dashboard` | decisión | las dos rutas montan el mismo componente WorkAreaProductDetailsPage, pero la aplicación solo enlaza a /work-area/product-dashboard (ProductPreview.tsx) y solo esa ruta se consulta con checkModuleAccess |
| `/reports-and-analytics/forecast` | `/planning/forecast-summary` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/reports-and-analytics/forecast-analysis` | `/planning/forecast-alerts` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/reports-and-analytics/overall` | `/reports-and-analytics/history` | ROUTE_MIGRATIONS | URL anterior de la pantalla; el usuario ve una u otra según qué permiso tenga concedido. |
| `/work-area/inventory-balancing` | `/reports-and-analytics/inventory-balancing` | decisión | redirect permanente en routes/_layout.work-area.inventory-balancing.index.tsx: la sección se movió a Reportes (#2693) |
| `/work-area/inventory-balancing/details` | `/reports-and-analytics/inventory-balancing/details` | decisión | redirect permanente en routes/_layout.work-area.inventory-balancing.details.index.tsx (#2693) |

## Secciones

Sub-pantallas sin página propia: pestañas y vistas de detalle que se documentan dentro
de su pantalla madre.

| Ruta | Etiqueta | Se documenta en |
|---|---|---|
| `/administration/sla-dashboard/configuration` | Configuración | `docs/administracion/dashboard-ans.md` |
| `/administration/sla-dashboard/dashboard` | Dashboard | `docs/administracion/dashboard-ans.md` |
| `/planning/demand-and-promotions/details` | Demanda y Promociones | `docs/pronostico/demanda-y-promociones.md` |
| `/reports-and-analytics/adherence/orders` | Adherencia a Órdenes | `docs/reportes/adherencia.md` |
| `/reports-and-analytics/adherence/procurement` | Adherencia a Compras | `docs/reportes/adherencia.md` |
| `/reports-and-analytics/adherence/replenishment` | Adherencia a Distribución | `docs/reportes/adherencia.md` |
| `/reports-and-analytics/inventory-balancing/details` | Balanceo de Inventario - Detalles | `docs/reportes/balanceo-de-inventario.md` |
| `/support/tickets` | Tickets de Soporte | `docs/recursos/soporte.md` |
| `/work-area/procurement-calendar/order` | Creación de Órden de Compra | `docs/reabastecimiento/calendario-de-oc.md` |

## Rutas sin página, y por qué

### Obsoletas: etiqueta en `routes.json` sin pantalla en el router

`routes.json` conserva nombres de pantallas que ya se borraron. No son huecos de la
wiki: son pantallas que no existen.

| Ruta | Etiqueta | Motivo |
|---|---|---|
| `/administration/configuration/column-groups` | Grupos de columnas | «Grupos de columnas» no existe en el router; la pantalla viva de columnas es /administration/configuration/config-columns. |
| `/administration/configuration/column-groups/$columnGroupId` | Detalle de grupo de columnas | Etiqueta en routes.json sin ruta en el router: la pantalla no existe. |
| `/settings/lang` | Settings (language) | Las seis rutas /settings/* que el issue mandaba resolver no existen en el router y sus etiquetas están sin traducir. Son restos de una versión anterior: se excluyen enteras. |
| `/settings/parameters` | Settings - Parameters | Ver /settings/lang. |
| `/settings/parameters/exhibitions` | Settings - Parameters - Exhibitions | Ver /settings/lang. |
| `/settings/parameters/general` | Settings - Parameters - General | Ver /settings/lang. |
| `/settings/parameters/lead-time` | Settings - Parameters - Leadtime | Ver /settings/lang. |
| `/settings/parameters/perishables` | Settings - Parameters - Perishables | Ver /settings/lang. |
| `/work-area/price-definition` | Definición de Precios | «Definición de Precios» aparece en el alcance de la épica, pero la pantalla no existe en el router: la etiqueta quedó huérfana en routes.json. No se escribe página. |
| `/work-area/procurement/calendar` | Calendario de Órdenes de Compra | Tercer candidato del trío de calendarios de compra que planteaba el issue: no existe. Los calendarios reales son /work-area/procurement-calendar y /planning/procurement-calendar, que son pantallas distintas. |
| `/work-area/replenishment/suggestions` | Distribución Sugerida | «Distribución Sugerida» no existe; la pantalla viva de solicitudes es /work-area/replenishment-suggestions («Solicitudes de Tiendas»). |
| `/work-area/surplurs-management` | Gestión de Excedentes | Igual que Definición de Precios: etiqueta huérfana, sin pantalla. (El propio identificador tiene el error de escritura «surplurs».) |

### Excluidas

| Ruta | Etiqueta | Motivo |
|---|---|---|
| `/` | Inicio | No es una pantalla: redirige a la pantalla de inicio del tenant (`tenantDefaultLandingUrl`) o a la de acceso. Se explica en Primeros pasos. |
| `/login` | Inicio de sesión | Pantalla de acceso, no de producto. Se cubre en Primeros pasos. |
| `/logout` | Cierre de sesión | Cierre de sesión: no tiene interfaz que documentar. |

### Rutas con parámetro y formularios

Detalles de un registro (`$id`) y formularios de creación. Se documentan dentro de la
página de su pantalla madre, no aparte.

<details><summary>Ver las 41</summary>

| Ruta | Etiqueta |
|---|---|
| `/activation/business-rules/$id` | Detalle de Regla de Negocio |
| `/activation/business-rules/create` | Crear Regla de Negocio |
| `/activation/grouping-products/$id` | Detalle de Producto de Agrupación |
| `/activation/grouping-products/create` | Crear Producto de Agrupación |
| `/activation/substitute-products/$id` | Detalle de Sustituto |
| `/activation/substitute-products/create` | Crear Sustituto |
| `/administration/access-control/users/$userId` | Detalle de Usuario |
| `/administration/configuration/business-rules/$id` | Detalle de Regla de Negocio |
| `/administration/configuration/business-rules/create` | Crear Regla de Negocio |
| `/administration/configuration/grouping-products/$id` | Detalle de Producto de Agrupación |
| `/administration/configuration/grouping-products/create` | Crear Producto de Agrupación |
| `/administration/configuration/query-builder/$slug` | Detalle de consulta |
| `/administration/configuration/reference-products/$id` | Detalle de Producto de Referencia |
| `/administration/configuration/reference-products/create` | Crear Producto de Referencia |
| `/administration/configuration/substitute-products/$id` | Detalle de Producto Sustituto |
| `/administration/configuration/substitute-products/create` | Crear Producto Sustituto |
| `/administration/configuration/synthetic-products/$id` | Detalle de Producto de Agrupación |
| `/administration/configuration/synthetic-products/create` | Crear Producto de Agrupación |
| `/administration/data-manager/data-upload/$folderKey/files` | Archivos de la Carpeta |
| `/administration/operation/automatic-procurement/$id` | Compra Automática - Detalles |
| `/administration/operation/automatic-procurement/create` | Crear compra automática |
| `/administration/operation/automatic-replenishment/$id` | Distribución Automática - Detalles |
| `/administration/operation/automatic-replenishment/create` | Crear distribución automática |
| `/administration/operation/pipeline-configuration/$id` | Configuración de Pipeline |
| `/administration/operation/pipeline-configuration/create` | Crear Configuración de Pipeline |
| `/planning/promotional-campaigns/$campaignId` | Campaña Promocional |
| `/planning/promotional-campaigns/$campaignId/promotion/$promotionId` | Promoción |
| `/planning/promotional-campaigns/$campaignId/promotion/$promotionId/details` | Detalle de Promoción |
| `/planning/scenarios/$scenarioId` | Escenario |
| `/planning/scenarios/create` | Crear escenario |
| `/promotions/campaigns/$campaignId` | Campaña Promocional |
| `/promotions/campaigns/$campaignId/promotion/$promotionId` | Promoción |
| `/promotions/campaigns/$campaignId/promotion/$promotionId/details` | Detalle de Promoción |
| `/work-area/automation/automatic-procurement/$id` | Compra Automática - Detalles |
| `/work-area/automation/automatic-procurement/create` | Crear compra automática |
| `/work-area/automation/automatic-replenishment/$id` | Distribución Automática - Detalles |
| `/work-area/automation/automatic-replenishment/create` | Crear distribución automática |
| `/work-area/automation/pipeline-configuration/$id` | Configuración de Pipeline |
| `/work-area/automation/pipeline-configuration/create` | Crear Configuración de Pipeline |
| `/work-area/procurement/order-history/products/$orderId` | Productos de la orden de compra |
| `/work-area/replenishment/order-history/products/$orderId` | Productos de la orden de distribución |

</details>

