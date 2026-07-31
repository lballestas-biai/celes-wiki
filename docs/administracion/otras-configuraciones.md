---
title: Otras configuraciones
module: Administración
route: /administration/configuration/other
aliases: []
permission: administration.configuration.other
audience: [Administradores]
summary: >
  Otras configuraciones muestra dos ajustes del pronóstico —cuántas semanas se extiende y cada
  cuánto se re-entrena— con sus casillas de edición. Las casillas todavía no guardan nada: la
  pantalla está a medio construir y hoy solo sirve para leer los valores por defecto.
keywords: [otras configuraciones, pronóstico, horizonte, re-entrenamiento, pendiente]
tenant_variance: unknown
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOtherConfigurationPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.configuration.other.index.lazy.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationConfigurationPage.tsx
    ref: c98f195c5
---

# Otras configuraciones

!!! warning "Esta pantalla está a medio construir"

    Los dos campos que muestra **no guardan nada**: no tienen valor cargado ni botón de guardar, y
    los textos que los describen están escritos fijos en la pantalla, no traídos de la
    configuración de tu instancia. Se puede leer, no se puede usar. Está anotado como pendiente y
    esta página se completará cuando la pantalla funcione.

## Qué es y para qué sirve { #que-es }

La pantalla se presenta como los **parámetros del pronóstico** y describe dos:

- **Cuántas semanas se extiende el pronóstico al largo plazo.** Por defecto, **53 semanas**: cada
  vez que se generan pronósticos, se proyectan poco más de un año hacia adelante.
- **Cada cuánto se vuelve a entrenar el pronóstico.** Por defecto, **el día 15 de cada mes**.

Esos dos valores por defecto son información útil —explican hasta dónde llega el horizonte que
ves en [Pronóstico](../pronostico/index.md) y por qué el modelo no cambia todos los días—, y por
eso esta página los deja escritos. Lo que no se puede hacer es cambiarlos desde aquí.

En la práctica no vas a encontrar la pestaña: **solo se muestra a quien tenga concedido su
permiso**, y ese permiso no está habilitado en las instancias revisadas.

## Qué puedes hacer aquí { #que-puedes-hacer }

Leer los dos valores por defecto. Escribir en las casillas no tiene efecto.

Si necesitas cambiar el horizonte del pronóstico o la frecuencia de re-entrenamiento, el camino
es pedirlo al equipo de Celes.

## Qué necesita para funcionar { #requisitos }

- Que la pantalla termine de construirse: hoy no persiste los cambios.
- **El permiso `administration.configuration.other`**, que en general no está concedido.

## Conceptos relacionados { #conceptos }

- [Configuración General](configuracion-general.md)
- [Variables de entorno](variables-de-entorno.md) — es la pantalla que sí guarda ajustes de la
  instancia.
- [Filosofía del forecast](../conceptos/filosofia-del-forecast.md)
- [Pronóstico](../pronostico/index.md)
