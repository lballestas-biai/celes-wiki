---
title: Motor de Integración
module: Administración
route: /administration/configuration/integration-engine
aliases: []
permission: administration.configuration.integration-engine
audience: [Administradores, Implementadores]
summary: >
  Motor de Integración es la pantalla que conecta los campos de tu sistema con los del modelo de
  Celes. Es exactamente el mismo lienzo que Homologación, ofrecido desde Configuración General y
  con su propio permiso.
keywords: [motor de integración, homologación, mapeo, modelo canónico, integración]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.configuration.integration-engine.index.lazy.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/IntegrationEngine/IntegrationEnginePage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataManagerMappingPage/AdministrationDataManagerMappingPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationConfigurationPage.tsx
    ref: c98f195c5
---

# Motor de Integración

## Qué es y para qué sirve { #que-es }

Motor de Integración y **[Homologación](homologacion.md)** son **la misma pantalla**. No se
parecen: es el mismo lienzo, con las mismas acciones y los mismos datos, ofrecido desde dos
sitios distintos del menú y con un permiso distinto cada uno.

Que existan las dos entradas responde a los dos momentos en que se usa. Desde **Datos Maestros**
se llega cuando el trabajo es el dato: subirlo, mapearlo, comprobar su calidad. Desde
**Configuración General** se llega cuando el trabajo es la configuración de la instancia. La
pantalla que se abre es la misma.

![El lienzo de mapeo: los campos del origen a la izquierda, los del modelo de Celes a la derecha,
con el avance por módulo arriba.](../assets/screenshots/administracion/homologacion.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

Lo mismo que en [Homologación](homologacion.md), donde está descrito en detalle: ver el avance
del mapeo por módulo, elegir una tabla, **unir campos arrastrando**, pedir una sugerencia
automática, previsualizar el contenido de un campo antes de decidir, quedarte solo con lo que
falta, declarar relaciones entre tablas del origen y guardar.

!!! info "Dos permisos sobre la misma pantalla"

    Cada dirección se rige por su propio permiso: `administration.configuration.integration-engine`
    para esta, `administration.master-data.mapping` para Homologación. Puedes tener una, la otra o
    las dos. Y como el nivel de acción —Lector, Editor, Ejecutor— también se resuelve por la
    dirección desde la que entras, es posible **poder editar el mapeo desde una entrada y solo
    consultarlo desde la otra**. Si los botones de guardar aparecen deshabilitados, prueba la otra
    entrada antes de pedir un cambio de permisos.

!!! warning "No está habilitada en la mayoría de las instancias"

    Este permiso no está concedido en muchas implementaciones: la entrada habitual al mapeo es
    **Homologación**, dentro de Datos Maestros. Si esta pestaña no te aparece en Configuración
    General, es lo esperable y no te falta nada — el mapeo se hace igual desde allí.

## Qué necesita para funcionar { #requisitos }

- **Los datos cargados** desde [Carga de Datos](carga-de-datos.md) o por la integración
  automática.
- **Saber qué significa cada campo de tu sistema de origen.**
- **El permiso `administration.configuration.integration-engine`**, y el de edición sobre él para
  guardar uniones.

## Conceptos relacionados { #conceptos }

- [Homologación](homologacion.md)
- [Datos Maestros](datos-maestros.md)
- [Carga de Datos](carga-de-datos.md)
- [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md)
- [Configuración General](configuracion-general.md)
