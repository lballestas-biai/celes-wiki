---
title: Novedades de producto
module: Recursos
audience: [Clientes, Usuarios]
summary: >
  Qué ha cambiado en Celes y dónde verlo. Cada entrada corresponde a un cambio que ya está en
  la aplicación y enlaza la página que lo documenta. La página arranca en julio de 2026: lo
  anterior no se publica porque no hay un registro que se pueda respaldar fecha a fecha.
keywords: [novedades, cambios, versiones, menú, reorganización]
tenant_variance: low
status: verified
verified_at: 2026-08-01
sources:
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/MenuReorganizationTour/MenuReorganizationTour.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/MenuReorganizationTour/helpers.ts
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/common.json
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
    path: apps/web-client/src/pages/WorkArea/common/ProductListOrder/ConvertibleUnitSelector.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/WorkArea/common/OrderPluginBudgetRestrictionsDialog/OrderPluginBudgetRestrictionsDialog.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/components/CustomerAssistant/useCanUseCustomerAssistant.ts
    ref: a3437e470
---

# Novedades de producto

## De dónde sale esta página { #procedencia }

Aquí entra **lo que se nota usando Celes**: una pantalla que cambió de sitio, una acción nueva,
una restricción que antes no estaba. No entran las correcciones internas ni los cambios que no
alteran lo que ves.

Cada entrada se comprueba igual que el resto de la wiki: **está en la aplicación hoy**, y la
ficha del final de la página dice contra qué versión del producto se verificó. Si una entrada
menciona una pantalla, enlaza su página, y esa página lleva su propia fecha de verificación.

!!! info "Esta página empieza en julio de 2026"

    Antes de esa fecha Celes no mantenía un registro de cambios publicable: los dos archivos de
    notas de versión del producto dejaron de actualizarse —el último, en marzo de 2026— y el
    registro que sí siguió vivo es el del trabajo interno, que no se puede publicar tal cual:
    está escrito en vocabulario de desarrollo y llega a nombrar a clientes concretos.

    Reconstruir hacia atrás sería inventar fechas. Preferimos empezar donde podemos verificar.

## El menú se reorganizó { #menu }

El cambio más visible de julio de 2026 no añade funciones: **mueve quince herramientas a un
sitio más lógico**. Lo que hacen y cómo se usan no cambió; cambió dónde están.

La aplicación te lo cuenta la primera vez que entras, con un recorrido llamado **Novedades del
menú**: te muestra *Antes*, *Ahora* y *Para qué sirve* de cada herramienta. Solo aparecen las
que tu perfil puede abrir, y solo una vez; si más adelante recibes acceso a otra ubicación
nueva, se te muestra únicamente esa.

**Las direcciones antiguas siguen funcionando.** Un enlace guardado en tus favoritos, o el que
alguien te pasó por correo, te deja en la pantalla nueva.

| Antes | Ahora | Página |
|---|---|---|
| Administración › Operación › Distribución Automática | Reabastecimiento › Automatización & Operación | [Distribución Automática](../reabastecimiento/distribucion-automatica.md) |
| Administración › Operación › Compra Automática | Reabastecimiento › Automatización & Operación | [Compra Automática](../reabastecimiento/compra-automatica.md) |
| Administración › Operación › Configuración de Pipeline | Reabastecimiento › Automatización & Operación | [Configuración de Pipeline](../reabastecimiento/configuracion-de-pipeline.md) |
| Administración › Operación › Trazabilidad de entregas | Reabastecimiento › Automatización & Operación | [Trazabilidad de entregas](../reabastecimiento/trazabilidad-de-entregas.md) |
| Reportes › Forecast | Pronóstico › Resumen | [Resumen](../pronostico/resumen.md) |
| Reportes › Alertas del Forecast | Pronóstico › Alertas de Forecast | [Alertas de Forecast](../pronostico/alertas-de-forecast.md) |
| Reportes › Desempeño General | Reportes › Histórico | [Histórico](../reportes/historico.md) |
| Pronóstico › Campañas Promocionales | Promociones › Campañas | [Campañas](../promociones/campanas.md) |
| Pronóstico › Campañas de Marketing Comercial | Surtido › Trade Marketing | [Trade Marketing](../surtido/trade-marketing.md) |
| Pronóstico › Colaboradores externos | Administración › Colaboradores Externos | [Colaboradores Externos](../administracion/colaboradores-externos.md) |
| Administración › Configuración General › Reglas de Negocio | Activación › Reglas de Negocio | [Reglas de Negocio](../activacion/reglas-de-negocio.md) |
| Administración › Configuración General › Productos de Agrupación | Activación › Productos de Agrupación | [Productos de Agrupación](../activacion/productos-de-agrupacion.md) |
| Administración › Configuración General › Productos Sustitutos | Activación › Sustitutos | [Sustitutos](../activacion/sustitutos.md) |
| Administración › Gestión de Datos › Homologación | Administración › Datos Maestros › Homologación | [Homologación](../administracion/homologacion.md) |
| Administración › Gestión de Datos › Calidad de Datos | Administración › Datos Maestros › Calidad de Datos | [Calidad de Datos](../administracion/calidad-de-datos.md) |

Dos cambios de nombre acompañan a la mudanza: los **Productos Sintéticos** pasaron a llamarse
**Productos de Agrupación**, y **Desempeño General** pasó a llamarse **Histórico**. Son la misma
herramienta.

## Julio de 2026 { #2026-07 }

**El Calendario de Promociones dejó de ser una pantalla.** Ahora es una vista que se abre desde
[Campañas](../promociones/campanas.md), con el mismo contenido: las promociones repartidas por
mes, semana o lista. Si lo tenías en el menú, ahí es donde está.

**Buscar una orden por su ID en todo el historial.** Los dos historiales de órdenes traen un
buscador propio: escribes el **ID exacto** de la orden y la encuentra sin que tengas que acertar
con los demás filtros. Sigue acotado al rango de fechas activo, y cuando no aparece nada, el
aviso te dice justamente eso y ofrece limpiar la búsqueda.
Ver [Historial de Órdenes de Compra](../reabastecimiento/historial-de-ordenes-de-compra.md) y
[Historial de Órdenes de Distribución](../reabastecimiento/historial-de-ordenes-de-distribucion.md).

**Cambiar la unidad en la lista de pedido.** Un selector de **Unidad** en las pantallas de pedido
convierte las cantidades en caliente, sin salir de la lista ni rehacer el pedido. Ver
[Comprar](../reabastecimiento/comprar.md) y [Distribuir](../reabastecimiento/distribuir.md).

**Repartir un presupuesto con un criterio explícito.** Cuando acotas un pedido por presupuesto,
ahora eliges *para qué* se reparte: **Cobertura**, **Velocidad de venta**, **Venta ($)** o
**Prioridad**, cada uno con su explicación en el propio diálogo. Y puedes pedir lo contrario de
lo habitual —**incrementar cantidades para alcanzar el presupuesto**— cuando sobra plata.
Ver [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md).

**Promociones que se pisan: ahora se ven antes de aprobar.** Al verificar una campaña, Celes
muestra cuántos productos entran en conflicto con promociones ya aprobadas, en qué días y con
cuáles, y **bloquea la aprobación** mientras haya colisión. Ver
[Campañas](../promociones/campanas.md).

**Cargar los eventos del calendario desde un archivo.** Descargas la plantilla, la llenas y la
subes: el asistente valida, te enseña qué filas crean y cuáles actualizan, y solo entonces
confirmas. Las filas sin ID crean un evento nuevo; las que traen un ID existente lo actualizan.
Ver [Calendario de Eventos](../pronostico/calendario-de-eventos.md).

**Escenarios: dos filtros nuevos y una regla más estricta.** Puedes ver solo los que están **En
curso** o los **Vigentes y programados** —los de hoy más los que empiezan después—. Y un
escenario **cuya fecha de fin ya pasó no se puede aprobar**. Ver
[Escenarios](../pronostico/escenarios.md).

**Las suscripciones a reportes se manejan una por una.** Cada suscripción se puede **habilitar**,
**deshabilitar** o **ejecutar ahora** sin tocar las demás, y su rango de fechas puede ser
**relativo** —los últimos N días o meses, que es lo recomendado— en vez de fijo. La entrega
admite CSV, XLSX y Parquet, con avisos sobre cuál conviene según el tamaño. Ver
[Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md).

**Importar valores de parámetros desde Excel, con aviso de colisiones.** Se sube el archivo
exportado, se revisa qué filas son nuevas y cuáles modifican, y antes de procesar Celes avisa si
algún rango de fechas se solapa con valores que ya existen —y deja descargar la lista de
choques—. Ver [Configuración de Parámetros](../administracion/configuracion-de-parametros.md) y
[Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md).

**Trazabilidad de entregas: de dónde salió cada envío.** Una columna **Origen** distingue los
envíos **Automáticos** de los que no se pudieron confirmar como tales, y el buscador acepta el
número de orden o el nombre del archivo. Ver
[Trazabilidad de entregas](../reabastecimiento/trazabilidad-de-entregas.md).

**El asistente se llama CELI.** Cambió el nombre —antes era CAVI— y con él todos los textos de
la conversación: el saludo, el campo para preguntar y el aviso de que conviene verificar las
cifras críticas. Es el mismo asistente, y sigue estando solo en las instancias cuyo rol lo
habilita. Ver [Inicio](../vista-general/panel-de-inicio.md) y [Academy](academy.md).

## Cómo se mantiene esta página { #mantenimiento }

Esta wiki se revisa contra el producto y se actualiza cuando algo cambia; esta página es el
resumen de esas revisiones, en orden inverso. Dos consecuencias prácticas:

- **Lo que aquí no está, o no cambió para el usuario, o todavía no se ha verificado.** Si notas
  algo nuevo que no aparece, cuéntalo por [Soporte](soporte.md): es la forma más rápida de que
  entre.
- **Una novedad no dice cuándo llegó a tu instancia.** El mes es el de la publicación del cambio
  en el producto. Ver [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md).

## Conceptos relacionados { #conceptos }

- [Academy](academy.md)
- [Glosario](glosario.md)
- [Soporte](soporte.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
