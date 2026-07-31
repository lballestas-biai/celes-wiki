---
title: Carga de Datos
module: Administración
route: /administration/data-manager/data-upload
aliases: []
permission: administration.data-manager.data-upload
audience: [Administradores, Implementadores]
summary: >
  Carga de Datos es donde se sube la información de cada entidad que Celes necesita —un archivo
  por entidad— y donde se ve cuáles ya tienen datos. Sirve tanto para la carga manual como para
  comprobar que la integración automática esté dejando los archivos.
keywords: [carga de datos, subir archivo, entidades, sincronizar, guía de ingesta, validación]
tenant_variance: high
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationDataUploadPage/AdministrationDataUploadPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/dataUpload.json
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: c98f195c5
---

# Carga de Datos

!!! warning "Página sin captura de pantalla"

    El contenido de abajo está verificado contra el código y los textos de la aplicación, pero
    **falta la captura**: ninguna de las instancias con las que se documenta esta wiki tiene este
    permiso concedido, así que no se pudo llegar a la pantalla para fotografiarla. Queda como
    borrador hasta que se pueda.

## Qué es y para qué sirve { #que-es }

Antes de que Celes calcule algo, sus datos tienen que llegar. Esta pantalla es la puerta: una
lista de **entidades** —ventas, inventario, productos, bodegas, precios y las demás que tu
implementación use— y, en cada una, la posibilidad de subir su archivo.

Lo habitual es que los datos lleguen solos, por una integración programada. Aun así esta pantalla
importa por dos razones: es donde se ve **si una entidad tiene datos o no**, y es por donde se
sube algo a mano cuando hace falta —una carga inicial, una corrección, una entidad que todavía no
está automatizada—.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver el estado de cada entidad.** Cada entidad se presenta con su estado: **Cargada** o **Sin
cargar**. Es el primer sitio donde mirar cuando una pantalla de Celes aparece vacía.

**Subir un archivo.** El diálogo va en tres pasos —**Seleccionar**, **Previsualizar** y
**Confirmar**—, y el paso del medio es el que evita la mayoría de los errores: muestra el formato
detectado, cuántas columnas trae, una muestra de filas y el tipo de dato de cada columna.

**Ver si el archivo encaja con la entidad.** La validación compara la estructura del archivo con
la que la entidad espera y dice si **coincide**, qué **columnas faltan** y qué **columnas no se
esperaban**. Cuando no puede leer la estructura, lo avisa: el archivo se puede subir igual, pero
sin esa comprobación.

Los formatos admitidos son `.parquet`, `.xlsx`, `.csv` y `.txt`.

**Reemplazar y descargar.** Una entidad ya cargada se puede reemplazar, y su archivo se puede
volver a descargar para revisarlo.

**Sincronizar archivos.** El botón de sincronizar dispara el procesamiento de lo que haya
disponible; los archivos se procesan en segundo plano. Si ya hay una sincronización en curso, la
pantalla lo dice y pide esperar. En instancias sin sincronización configurada, el botón lo indica.

**Descargar la guía de ingesta.** Genera un archivo con la estructura que Celes espera de cada
entidad. Es el documento que se le pasa a quien va a preparar los datos del lado del cliente.

**Descargar los archivos de integración.** Para configurar el envío automático desde el sistema de
origen.

**Mostrar u ocultar entidades.** Quien tenga permiso de edición puede entrar en modo de
configuración y marcar qué entidades se muestran para este cliente. Las ocultas aparecen atenuadas
mientras se configura, y quien solo tiene lectura no las recibe en absoluto.

!!! info "Es la única de las tres pestañas que no se movió"

    Cuando la sección pasó de «Gestión de Datos» a **[Datos Maestros](datos-maestros.md)**, esta
    pantalla se quedó en la dirección anterior: sus dos hermanas tienen dirección nueva y ésta no.
    Es también la pestaña a la que la sección lleva por defecto cuando la tienes concedida.

!!! warning "Subir un archivo no lo pone en los reportes"

    Cargar el dato es el primer paso de tres. Después tiene que estar **mapeado** en
    [Homologación](homologacion.md) y **pasar las pruebas** de
    [Calidad de Datos](calidad-de-datos.md); y el número aparece en el siguiente ciclo de cálculo,
    no de inmediato.

## Qué necesita para funcionar { #requisitos }

- **Los archivos con la estructura esperada.** La guía de ingesta que se descarga desde aquí es la
  referencia.
- **El permiso `administration.data-manager.data-upload`**, y el de edición sobre él para subir
  archivos o cambiar la visibilidad de las entidades.

## Conceptos relacionados { #conceptos }

- [Datos Maestros](datos-maestros.md)
- [Homologación](homologacion.md)
- [Calidad de Datos](calidad-de-datos.md)
- [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
