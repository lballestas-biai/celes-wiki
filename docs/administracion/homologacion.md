---
title: Homologación
module: Administración
route: /administration/master-data/mapping
aliases: [/administration/data-manager/mapping]
permission: administration.master-data.mapping
audience: [Administradores, Implementadores]
summary: >
  Homologación conecta los datos como los tiene tu empresa con el modelo que Celes espera.
  Cada campo tuyo se arrastra al campo equivalente del modelo, y hasta que esa conexión
  existe, el dato está cargado pero Celes no lo puede usar.
keywords: [homologación, mapeo, modelo canónico, campos, integración, cobertura]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataManagerMappingPage/AdministrationDataManagerMappingPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/pages/IntegrationEngine/IntegrationEnginePage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/integration-engine.json
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: c98f195c5
---

# Homologación

## Qué es y para qué sirve { #que-es }

Ninguna empresa guarda sus datos como los guarda otra. Lo que en tu sistema es el código de la
bodega puede llamarse de cinco maneras distintas, y Celes no puede adivinar cuál de tus
columnas es esa.

Homologación es donde se responde eso, campo por campo. La pantalla trabaja con tres columnas:
**Datos de Origen** —tus campos, tal como llegaron—, **Campos Canónicos** —los que Celes espera,
cada uno con su descripción y su tipo— y **Campos Mapeados**, que es el resultado. Arrastrar un
campo del origen a un campo canónico es decirle al producto «esto es aquello». Mientras un campo
obligatorio no esté unido, el dato existe pero no entra en ningún cálculo.

Es, junto con [Carga de Datos](carga-de-datos.md), la pantalla que hace que una implementación
arranque — y la que hay que revisar cuando cambia el sistema de origen.

![Homologación: las tarjetas de avance por módulo arriba, las tablas canónicas como pestañas, y
las tres columnas del lienzo —origen, campos canónicos y campos
mapeados—.](../assets/screenshots/administracion/homologacion.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver cuánto falta.** Arriba hay una tarjeta por módulo —Forecast, Forecast Promocional,
Distribución, Compras, Fabricación y los que use tu instancia— con su porcentaje de avance y
**cuántas tablas están completas** («0/12 tablas completas»). Es el resumen que dice si la
instancia está lista o no.

**Elegir qué tabla mapear.** Debajo de las tarjetas, las tablas del módulo aparecen como
pestañas, cada una con su porcentaje. Se trabaja una tabla a la vez.

**Elegir el origen.** Los selectores de **conjunto de datos** y **tabla** llenan la columna de
*Datos de Origen*; hasta que se eligen, esa columna invita a hacerlo y no muestra campos.

**Entrar en modo de edición.** La pantalla abre **en solo lectura**: **Mapeo Automático** y
**Guardar Mapeo** aparecen deshabilitados hasta que se activa **Modo Edición**. No es que te
falten permisos — es que el lienzo no se toca por accidente.

**Unir campos arrastrando.** Se arrastra un campo del origen sobre el campo canónico que le
corresponde, y la unión pasa a *Campos Mapeados*, que lleva la cuenta. Los campos canónicos
obligatorios van marcados, y cada uno trae su descripción y su tipo, así que se puede decidir sin
consultar un documento aparte. Un campo puede recibir un **alias** cuando el nombre del origen no
coincide.

**Pedir una sugerencia automática.** **Mapeo Automático** propone las uniones que puede inferir
por nombre y contenido. Es un punto de partida: **la propuesta se revisa antes de guardar**,
porque dos campos con nombre parecido no siempre son el mismo dato.

**Ver los datos antes de decidir.** La **Vista Previa de Datos**, al pie, muestra el contenido
real; se habilita una vez guardado el mapeo. Es la forma de resolver las dudas de verdad —cuál de
dos columnas parecidas trae el código y cuál la descripción—.

**Concentrarte en lo que falta.** El interruptor **Mostrar solo columnas sin mapear** deja a la
vista lo pendiente, y el buscador filtra por nombre. En una tabla ancha es la diferencia entre
terminar y perderse.

**Sincronizar y declarar relaciones.** **Sincronizar** vuelve a leer qué hay disponible del lado
del origen. Y cuando el dato de un campo hay que buscarlo en otra tabla, se puede declarar la
relación entre las dos.

**Guardar.** **Guardar Mapeo** es explícito. Junto al título se muestra **la última
sincronización**, que es la referencia para saber si lo que ves ya se aplicó.

!!! info "La misma pantalla está en dos sitios"

    Este lienzo es también el de **[Motor de Integración](motor-de-integracion.md)**, en
    Configuración General: son dos direcciones y dos permisos distintos sobre **la misma
    pantalla**. Que veas una, la otra o las dos depende de qué te haya concedido tu rol.

!!! tip "Si llegas desde una dirección antigua, es la misma pantalla"

    Esta pantalla estuvo bajo «Gestión de Datos» y hoy está bajo **Datos Maestros**. Cuál de las
    dos direcciones usas la decide tu permiso: con el anterior, la aplicación te lleva a la
    dirección anterior; con el nuevo, a la nueva. El contenido es idéntico.

!!! warning "Un mapeo mal hecho no falla: calcula mal"

    Unir un campo al equivalente equivocado no produce un error. Produce números plausibles y
    falsos, y el efecto aparece días después en un pronóstico o en un sugerido. La vista previa
    del dato está justamente para evitarlo.

## Qué necesita para funcionar { #requisitos }

- **Los datos ya cargados** desde [Carga de Datos](carga-de-datos.md) o por la integración
  automática: sin origen no hay nada que unir.
- **Saber qué significa cada campo de tu sistema.** Es la parte que Celes no puede resolver
  sola, y la que exige a alguien que conozca el origen.
- **El permiso `administration.master-data.mapping`**, y el de edición sobre él para guardar
  uniones.

## Conceptos relacionados { #conceptos }

- [Datos Maestros](datos-maestros.md)
- [Carga de Datos](carga-de-datos.md)
- [Calidad de Datos](calidad-de-datos.md)
- [Motor de Integración](motor-de-integracion.md)
- [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
