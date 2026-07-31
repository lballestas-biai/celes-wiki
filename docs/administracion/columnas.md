---
title: Columnas
module: Administración
route: /administration/configuration/config-columns
aliases: []
permission: administration.configuration.config-columns
audience: [Administradores, Implementadores]
summary: >
  Columnas es el catálogo de las columnas disponibles en tu instancia: para cada una, cómo se
  llama de cara al usuario, de qué tipo es y cómo se formatea. Es el inventario del que se surten
  los reportes y los filtros.
keywords: [columnas, catálogo, etiqueta, tipo de dato, formato, ventas, suministro]
tenant_variance: high
status: draft
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationConfigColumnsPage/AdministrationConfigColumnsPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Columnas

!!! warning "Esta página no lleva captura, y es a propósito"

    Se capturó la pantalla y **se decidió no publicarla**. Las dos columnas que darían sentido a la
    imagen —la etiqueta que ve el usuario y el formato— son texto que configura cada cliente, así
    que el saneamiento las reemplaza; y la que queda legible es el nombre técnico del campo, que
    esta wiki no publica. Una captura que esconde lo que importa y muestra lo que no, no ayuda.
    La página describe la pantalla sin retratarla, y por eso queda en borrador.

## Qué es y para qué sirve { #que-es }

Cada columna que un usuario ve en un reporte, o que puede elegir en un panel de filtros, tiene que
existir primero en un catálogo. Este es ese catálogo.

Su trabajo es traducir: el dato llega con un nombre técnico y aquí se le pone la **etiqueta** con
la que se va a presentar, se declara **de qué tipo** es y **cómo se formatea**. Es la razón de que
un usuario lea «Días de inventario» y no el identificador interno del campo.

## Qué puedes hacer aquí { #que-puedes-hacer }

**Elegir el conjunto de datos.** El catálogo está separado por origen: **Ventas** y
**Suministro**. Se selecciona arriba, y **la pantalla abre en Ventas**. Si la ves vacía, no
concluyas que no hay nada configurado: prueba el otro conjunto — es habitual que la mayoría de las
columnas de una instancia estén en Suministro.

**Ver el catálogo.** La tabla muestra, por columna, su nombre técnico, su **Label** —la etiqueta
que ve el usuario—, su alias, su **Data Type** y su **Format**.

**Buscar.** El buscador filtra el catálogo por lo que escribas.

**Crear una columna.** El diálogo de creación pide el conjunto de datos, el campo de origen, la
etiqueta, el tipo y el formato. El campo de origen se elige de los disponibles en ese conjunto, no
se escribe a mano.

**Editar y eliminar.** Editar abre el mismo diálogo con los valores actuales. Eliminar pide
confirmación con el nombre de la columna.

!!! warning "Eliminar una columna la quita de donde se estuviera usando"

    Una columna del catálogo puede estar habilitada en [Filtros](filtros.md) o formar parte de un
    reporte. Borrarla del catálogo la retira de ahí también, y el efecto lo notan los usuarios, no
    quien la borró.

!!! info "Añadir una columna al catálogo no la pone en un reporte"

    Son dos pasos. Aquí la columna pasa a **existir**; para que se pueda filtrar por ella hay que
    habilitarla en [Filtros](filtros.md), y para que aparezca en una tabla hay que incluirla en el
    reporte correspondiente. Ver
    [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md).

!!! tip "La etiqueta es lo que se busca, el campo no"

    Cuando alguien pide «la columna X», suele estar nombrando la **etiqueta**. Dos instancias
    pueden tener el mismo dato con etiquetas distintas, y la misma etiqueta puede corresponder a
    campos distintos. Al comparar dos instancias, la etiqueta no es identificador suficiente.

## Qué necesita para funcionar { #requisitos }

- **Los datos ya mapeados** en [Homologación](homologacion.md): las columnas que se pueden dar de
  alta son las que existen en el origen.
- **Acuerdo sobre el nombre.** La etiqueta es la que va a ver todo el mundo; cambiarla después
  confunde a quien ya se acostumbró.
- **El permiso `administration.configuration.config-columns`**, y el de edición sobre él para
  crear o modificar.

## Conceptos relacionados { #conceptos }

- [Filtros](filtros.md)
- [Consultas](consultas.md)
- [Homologación](homologacion.md)
- [Cómo se construyen los reportes](../conceptos/como-se-construyen-los-reportes.md)
- [Configuración General](configuracion-general.md)
