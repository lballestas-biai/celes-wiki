---
title: Academy
module: Recursos
audience: [Clientes, Usuarios]
summary: >
  Celes Academy es el material de formación que la aplicación ofrece desde Inicio: videos
  cortos de producto, libros electrónicos, vocabulario de retail y el asistente. Esta página
  dice qué hay detrás de cada tarjeta y cuál está disponible hoy.
keywords: [academy, formación, videos, libros electrónicos, centro de ayuda, tour]
tenant_variance: low
status: verified
verified_at: 2026-08-01
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Dashboard/components/VideosCard.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Dashboard/components/EbooksCard.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Dashboard/components/HelpCenterCard.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/src/pages/Dashboard/components/LearnCard.tsx
    ref: a3437e470
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dashboard.json
    ref: a3437e470
---

# Academy

## Qué es y para qué sirve { #que-es }

**Celes Academy** no es una pantalla ni un producto aparte: es el nombre del material de
formación que Celes publica, y el bloque de tarjetas con el que te recibe
[Inicio](../vista-general/panel-de-inicio.md). Son cuatro cosas distintas —videos, libros,
vocabulario y el asistente— con un mismo propósito: que aprendas a usar la herramienta sin
tener que abrir un manual.

Es material **general de producto**: el mismo para todas las empresas, sin nada de la
configuración de la tuya. Lo que sí depende de tu instancia es qué tarjetas ves, porque algunas
sustituyen el contenido de Inicio por un tablero propio.

## Qué encontrarás { #que-encontraras }

### Videos de producto

Tutoriales cortos —de uno o dos minutos— sobre tareas concretas: aplicar filtros, enviar una
orden de compra. Inicio muestra los últimos con su duración, y **Ver todo** abre el catálogo
completo: la colección [**Celes en 1 minuto**](https://vimeo.com/showcase/11653413), pública y
sin necesidad de cuenta.

Es el recurso más rentable de los cuatro cuando lo que quieres es ver *cómo se hace* algo.

### Libros electrónicos

Guías más largas sobre el oficio, no sobre la herramienta: eficiencia operativa en retail,
estrategias de pronóstico de compra, el efecto del pronóstico en el flujo de caja. Se abren en
el sitio público de Celes desde la tarjeta **Descargar nuestros E-Books**.

### Vocabulario de retail

La tarjeta **Aprende nuevos términos del Retailer** explica un par de términos del oficio —el
**GMROI** y el **AOV**— y termina en un campo de búsqueda que le pasa tu pregunta al asistente.

Su versión completa y mantenida es el [Glosario](glosario.md) de esta wiki, que además enlaza
cada término con la pantalla donde se usa.

### El asistente

**CELI** responde preguntas sobre la herramienta dentro de la aplicación y, si el caso no se
resuelve hablando, abre un ticket de [Soporte](soporte.md) por ti. Solo está en las instancias
que lo tienen habilitado.

### El recorrido guiado

La primera vez que entras, Inicio ofrece un recorrido de cuatro pasos que señala las tarjetas y
el asistente. Se puede cerrar en cualquier momento y no vuelve a aparecer.

!!! warning "Qué está disponible hoy"

    Comprobado el **1 de agosto de 2026**:

    - **Los videos funcionan**: el catálogo es público y se abre sin cuenta.
    - **Los libros electrónicos no abren.** Los tres enlaces de la tarjeta apuntan al sitio
      público de Celes, que hoy responde «página no encontrada». No es un problema de tu
      instancia ni de tus permisos.
    - **El botón «Visita nuestro Centro de Ayuda» todavía no lleva a ninguna parte.** Lo que
      esa tarjeta promete —un glosario del vocabulario de retail— lo cubre mientras tanto el
      [Glosario](glosario.md) de esta wiki.

    Esta wiki es, hoy, la documentación de producto que se mantiene al día: cada página dice
    contra qué se verificó y cuándo.

## Conceptos relacionados { #conceptos }

- [Inicio](../vista-general/panel-de-inicio.md)
- [Glosario](glosario.md)
- [Soporte](soporte.md)
- [Bienvenida](../primeros-pasos/index.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
