---
title: Configuración de Pipeline
module: Reabastecimiento
route: /work-area/automation/pipeline-configuration
aliases: [/administration/operation/pipeline-configuration]
permission: work-area.automation.pipeline-configuration
audience: [Implementadores, Administradores]
summary: >
  Un pipeline es la secuencia de pasos con la que Celes calcula un módulo. Esta pantalla
  lista los flujos definidos y permite editarlos en un lienzo, paso a paso. Es una
  herramienta de implementación, no de operación diaria.
keywords: [pipeline, flujo, pasos, cálculo, configuración, implementación]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/AdministrationPipelineConfigurationListPage/AdministrationPipelineConfigurationListPage.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationOperation/components/PipelineEditor/PipelineEditorCanvas.tsx
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d20adaaea
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: fdb9c1358
---

# Configuración de Pipeline

## Qué es y para qué sirve { #que-es }

El sugerido de una pantalla no sale de una sola fórmula: sale de una **secuencia de pasos**
que se aplican en orden —cubrir la demanda, respetar el inventario de seguridad, repartir
cuando escasea, aplicar múltiplos—. Esa secuencia es el *pipeline* del módulo, y aquí es
donde se define.

La pantalla lista los flujos configurados, con su nombre, su descripción, a qué módulo
pertenecen, quién los creó y modificó, y un interruptor de estado que dice si están activos.
Al abrir uno se edita en un lienzo, encadenando pasos y sus argumentos.

![La lista de flujos por módulo, con su estado y su
autoría.](../assets/screenshots/reabastecimiento/configuracion-de-pipeline.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

- **Filtrar por módulo** con el selector de la izquierda —distribución, compra— y buscar un
  flujo por su nombre.
- **Crear un flujo** con el botón de arriba a la derecha, o **duplicar** uno existente para
  partir de algo que ya funciona.
- **Editar el flujo en el lienzo**: agregar pasos, ordenarlos y darles sus argumentos. Los
  pasos que necesitan una expresión matemática traen un editor de fórmula con vista previa.
- **Exportar e importar un flujo** como archivo, para llevarlo de un ambiente a otro o
  reutilizarlo. Al importar se elige entre **anexar al final** o **reemplazar** lo que haya
  en el lienzo, y la aplicación avisa si el archivo pertenece a otro módulo o trae pasos
  que ese módulo no reconoce.
- **Activar o desactivar** un flujo con el interruptor de la columna **Estado**, y
  **borrarlo**.

!!! warning "Esto cambia cómo se calcula, para todos"

    Un cambio aquí no afecta a una orden: afecta a **todo lo que ese módulo calcule a
    partir de la siguiente corrida**. No es una pantalla de operación diaria. Lo normal es
    que la toque quien implementa, no quien compra o distribuye.

## Qué necesita para funcionar { #requisitos }

- **El permiso `work-area.automation.pipeline-configuration`** (o el anterior de
  Administración) en escritura. Solo con lectura se ven los flujos y no se editan.
- **Saber qué hace cada paso.** El lienzo no valida el negocio: valida que el flujo esté
  bien formado. Un flujo válido puede producir sugeridos que no tienen sentido.
- **Una corrida posterior.** Los cambios se ven en los números a partir del siguiente
  procesamiento, no en el momento.

## Conceptos relacionados { #conceptos }

- [Sugerido de compra vs. de distribución](../conceptos/sugerido-compra-vs-distribucion.md)
- [Reglas de negocio y plugins](../conceptos/reglas-de-negocio-y-plugins.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
