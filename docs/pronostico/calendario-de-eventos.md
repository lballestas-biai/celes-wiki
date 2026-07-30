---
title: Calendario de Eventos
module: Pronóstico
route: /planning/events-calendar
aliases: []
permission: planning.events-calendar
audience: [Clientes, Usuarios]
summary: >
  El Calendario de Eventos es donde se le cuentan al modelo los hechos que mueven la
  demanda y no están en los datos de venta: una temporada escolar, un aniversario, un
  feriado local. Cada evento se declara con sus fechas y con las de cuando ya ocurrió antes.
keywords: [eventos, calendario, temporada, estacionalidad, fechas de referencia]
tenant_variance: low
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Planning/PlanningEventsCalendarPage/PlanningEventsCalendarPage.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/components/Calendar/Calendar.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/src/components/Calendar/MonthlyCalendar.tsx
    ref: fd8a12056
  - repo: celes-platform
    path: apps/web-client/public/locales/es/planning.json
    ref: fd8a12056
---

# Calendario de Eventos

## Qué es y para qué sirve { #que-es }

El modelo aprende de la historia de ventas, y hay cosas que la historia de ventas no
explica por sí sola: que la segunda semana de enero se venda el triple de cuadernos, que el
aniversario de una cadena mueva una categoría entera, que un feriado local vacíe una ciudad.
Un **evento** es la forma de decírselo.

Lo que distingue a un evento de las otras dos formas de intervenir el pronóstico es que
**no cambia ninguna cifra**. Un [escenario](escenarios.md) impone un número y una
[promoción](demanda-y-promociones.md) estima uno; un evento marca un tramo del calendario
como especial y le da al modelo **las fechas de cuando ese mismo hecho ocurrió antes**, para
que aprenda de ellas el tamaño del efecto. Por eso es la herramienta de lo que **se
repite**: se declara una vez y sirve para los años siguientes.

![El calendario mensual con los botones de crear, subir y exportar eventos, y los filtros de
categoría y subcategoría. El mes de la captura no tiene ningún evento
declarado.](../assets/screenshots/pronostico/calendario-de-eventos.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Recorrer el calendario.** Las flechas de la cabecera avanzan y retroceden el mes. Los
eventos aparecen sobre los días que cubren; cuando un día tiene más de los que caben, la
celda ofrece *+ ver N más*.

**Acotar por categoría.** Los dos selectores de arriba filtran por **categoría del evento**
y, si esa categoría las tiene, por **subcategoría** —Navidad, Halloween, temporada escolar,
aniversario de la marca—. Es la categoría del evento, no la del producto.

**Crear un evento.** **Crear evento** pide el nombre, las fechas, la categoría y —cuando
aplica— la subcategoría. Y dos cosas que son las que de verdad determinan su efecto:

- **A qué alcanza.** Sin filtros, el evento se aplica a **toda la compañía y todos los
  productos**. Con filtros, solo a lo que caiga bajo ellos. Se puede además aplicar a nivel
  de país.
- **Las fechas de referencia.** Los rangos de cuando el mismo evento ocurrió en el pasado.
  Son lo que le permite al modelo medir el efecto en vez de adivinarlo, y algunas categorías
  exigen un mínimo de rangos pasados para poder guardar.

Si las fechas se solapan con otro evento, la pantalla lo avisa antes de guardar.

**Editar o eliminar.** Al pulsar un evento del calendario se abre su detalle, desde donde se
modifica o se borra. Borrar pide confirmación y no se puede deshacer.

**Cargar muchos de una vez.** **Subir eventos** trabaja con una plantilla de Excel o CSV, en
tres pasos —subir, revisar, confirmar—. La revisión dice cuántas filas crean, cuántas
actualizan y cuántas tienen error, y las que tienen error se omiten en vez de tumbar la
carga. La regla que hay que conocer: **una fila sin ID crea un evento nuevo; una fila con el
ID de un evento exportado lo actualiza**. La importación corre en segundo plano, así que se
puede cerrar la ventana.

**Exportar.** **Exportar eventos** descarga los eventos propios que se cruzan con el rango
de fechas que elijas, en Excel o CSV. Los **eventos globales no se incluyen**: no son tuyos
y no se editan desde aquí.

!!! tip "Los filtros del archivo son columnas"

    En la plantilla de carga, cada filtro que quieras aplicar es una columna cuyo encabezado
    empieza por `Filtro:` seguido del nombre del filtro tal como aparece al crear un evento.
    En la celda se escriben uno o varios valores separados por coma. Qué filtros hay
    disponibles se configura en Administración › Configuración general de filtros, en la
    sección *Calendario de Eventos*.

## Qué necesita para funcionar { #requisitos }

- **Fechas de referencia en el pasado.** Un evento sin historia previa le dice al modelo que
  algo pasa, pero no cuánto. Algunas categorías directamente no dejan guardar sin ellas.
- **Categorías de eventos configuradas.** El formulario pide una categoría existente; si no
  hay ninguna, no hay evento que crear.
- **Permiso de escritura** para crear, subir o eliminar. La exportación solo pide lectura.
  Además, una categoría puede estar restringida: al importar, las filas de una categoría
  para la que no tienes permiso se rechazan una a una.
- **El permiso `planning.events-calendar`.**

## Conceptos relacionados { #conceptos }

- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Escenarios](escenarios.md)
- [Demanda y Promociones](demanda-y-promociones.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
