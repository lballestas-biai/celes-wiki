---
title: Inicio
module: Vista general
route: /dashboard
aliases: []
permission: dashboard
audience: [Clientes, Usuarios]
summary: >
  Inicio es la pantalla de bienvenida de Celes: saluda por tu nombre y reúne el material de
  formación de Celes Academy —centro de ayuda, libros, videos y vocabulario de retail— junto
  al panel de tus accesos directos, que son los filtros que guardaste en otras pantallas.
keywords: [inicio, bienvenida, accesos directos, celes academy, centro de ayuda, videos]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Dashboard/DashboardPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Dashboard/components/ShortcutPanel/ShortcutPanel.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/components/Filters/FiltersDialog/ShortcutSetForm/ShortcutSetForm.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/index.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dashboard.json
    ref: c98f195c5
---

# Inicio

## Qué es y para qué sirve { #que-es }

Inicio no opera nada: no hay aquí un pedido que aprobar ni un pronóstico que corregir. Es la
puerta de entrada, y hace dos cosas.

La primera es **enseñarte a usar Celes**. El bloque de tarjetas es *Celes Academy*: el centro
de ayuda, los libros, los videos cortos y un par de términos de retail explicados. Es material
general de producto, el mismo para todas las empresas.

La segunda es **devolverte a donde estabas**. El panel de accesos directos guarda pantallas con
los filtros que tú dejaste puestos, así que volver a «lo que reviso cada lunes» es un clic y no
seis.

![Inicio: el saludo, el botón «Ver accesos directos» y las cuatro tarjetas de Celes Academy —
centro de ayuda, libros electrónicos, videos y términos del retailer.](../assets/screenshots/vista-general/panel-de-inicio.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Abrir tus accesos directos.** El botón **Ver accesos directos**, arriba a la derecha, despliega
un panel lateral con los que hayas guardado. Cada uno muestra su nombre y la pantalla a la que
pertenece, y trae dos acciones: **Seleccionar**, que te lleva allí con los filtros ya aplicados, y
**Borrar**. Si no has guardado ninguno, el panel aparece vacío.

**Crear un acceso directo.** No se crean aquí: se crean **en la pantalla que quieres guardar**.
Abre su panel de filtros, déjalos como los quieres y guarda el conjunto con un nombre. A partir
de ahí aparece en este panel. Lo que se guarda es la dirección completa —pantalla más filtros—,
así que el acceso directo reproduce la vista y no solo la pantalla. Dos accesos directos tuyos no
pueden llamarse igual.

**Entrar al centro de ayuda y a Celes Academy.** Las tarjetas listan libros electrónicos y videos
cortos de producto, y cada elemento se abre en una pestaña nueva. **Ver todo** lleva al catálogo
completo de videos. Qué hay detrás de cada tarjeta, y cuál funciona hoy, está en
[Academy](../recursos/academy.md).

**Preguntarle a CELI.** La tarjeta *Aprende nuevos términos del Retailer* termina en un campo de
búsqueda: lo que escribas ahí y envíes con <kbd>Enter</kbd> se le pasa al asistente, que se abre con
tu consulta ya puesta. El campo está deshabilitado en las instancias que no tienen el asistente
habilitado.

**Hacer el recorrido guiado.** La primera vez que entras, Celes ofrece un recorrido de tres o
cuatro pasos que señala las tarjetas y el asistente. Es la presentación de la pantalla y se puede
cerrar en cualquier momento.

!!! info "Inicio no es necesariamente tu pantalla de arranque"

    Entrar a Celes sin indicar una pantalla te deja en **la pantalla de aterrizaje de tu rol**,
    que define quien administra los roles y no tiene por qué ser Inicio: en muchas empresas se
    apunta directamente a Comprar o a Distribuir, para que quien entra empiece por su trabajo.
    Inicio sigue estando en la primera entrada del menú lateral.

!!! warning "Dos cosas cambian de una empresa a otra"

    - **Algunas instancias sustituyen el contenido de esta pantalla por un tablero propio**
      —indicadores del negocio en lugar del material de formación—. Es una configuración por
      empresa: si tu Inicio no se parece al de la captura, es por esto.
    - **El botón «Visita nuestro Centro de Ayuda» todavía no lleva a ninguna parte**, y los tres
      enlaces de la tarjeta de libros electrónicos apuntan hoy a una página que no existe
      (comprobado el 1 de agosto de 2026). Los videos sí abren. Ver
      [Academy](../recursos/academy.md).

## Qué necesita para funcionar { #requisitos }

- **El permiso `dashboard`**, o cualquiera que cuelgue de él. Sin él la pantalla no aparece en
  el menú.
- **Ningún dato.** Es la única pantalla de Celes que se ve completa el primer día, antes de que
  haya una sola venta cargada.
- **Para los accesos directos**, haber guardado alguno desde el panel de filtros de otra
  pantalla. Son **por persona y por empresa**: no se comparten entre usuarios, y si trabajas en
  más de una instancia cada una tiene los suyos.
- **Para el buscador de la última tarjeta**, tener el asistente habilitado.

## Conceptos relacionados { #conceptos }

- [Bienvenida](../primeros-pasos/index.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
- [Detalle de Producto](detalle-de-producto.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
