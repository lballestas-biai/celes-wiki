---
title: Roles y permisos
module: Primeros pasos
audience: [Clientes, Usuarios, Administradores]
summary: >
  El acceso a Celes se concede por roles: cada rol reúne permisos, y cada permiso abre
  una sección de la aplicación con un nivel de acción. De ahí salen tu menú, tu página
  de entrada y hasta qué tiendas ves dentro de cada pantalla.
keywords: [roles, permisos, acceso, usuarios, página predeterminada, bodegas, no autorizado]
tenant_variance: low
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/helpers.ts
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/useHasPermission.ts
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/hooks/queries/useTenantUserRolesPermissionsQuery.ts
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/Layout.tsx
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d3c915057
---

# Roles y permisos

## Usuario, rol, permiso { #modelo }

Son tres piezas encadenadas:

- Un **usuario** es una persona dentro de una empresa. Puede estar activo o inactivo.
- Un **rol** es un paquete de permisos con un nombre —«Comprador», «Jefe de tienda»— que
  cada empresa define a su medida. Un usuario puede tener varios.
- Un **permiso** habilita una sección de la aplicación. Permiso y pantalla son la misma
  cosa dicha de dos maneras: el permiso de una sección es lo que abre esa pantalla y las
  que cuelgan de ella.

Un permiso además puede estar **inactivo**, y entonces no cuenta para nada aunque el rol
lo incluya.

## Los tres niveles: Lector, Editor, Ejecutor { #niveles }

Tener el permiso te deja entrar; el **nivel de acción** decide qué puedes hacer una vez
dentro.

| Nivel | Qué te deja hacer |
|---|---|
| **Lector** | Consultar la pantalla y sus datos |
| **Editor** | Además, crear y modificar |
| **Ejecutor** | Además, ejecutar — enviar la orden, lanzar el proceso |

Es una escala, no tres cajones separados: quien es **Ejecutor** puede todo lo que puede
un Editor, y un **Editor** todo lo que puede un Lector. Subir a alguien de nivel nunca le
quita algo que ya podía hacer.

Cuando te falta el nivel que una acción pide, el botón no responde y la aplicación
avisa: *«No tienes permiso para realizar esta acción. Contacta a un administrador si
necesitas hacerlo.»*

## Cuando tienes varios roles { #varios-roles }

Los permisos de todos tus roles se suman. Si dos roles conceden el mismo permiso con
niveles distintos, **gana el más alto**: un rol Lector nunca te recorta lo que otro rol
te concedió como Ejecutor.

La **página predeterminada** no se suma: la fija el rol de mayor **prioridad** de los que
tengas. Si ese rol no tiene ninguna configurada, entras al Inicio.

## Qué ves y qué no { #que-ves }

- **El menú muestra solo lo tuyo.** Una sección sin permiso no aparece atenuada: no
  aparece. Lo mismo con las opciones dentro de cada sección.
- **Escribir la dirección a mano no sirve de atajo.** Si abres la dirección de una
  pantalla que no te corresponde, en su lugar aparece **No autorizado**.
- **Un usuario inactivo se queda sin permisos**, aunque conserve sus roles. El síntoma es
  el mismo que no tener ninguno.

## No es solo qué pantallas: también qué datos { #alcance-de-datos }

Dos usuarios con el mismo rol pueden ver cifras distintas en la misma pantalla, porque el
alcance de los datos se concede aparte:

- **Bodegas.** A cada usuario se le asignan las tiendas y bodegas que le competen.
- **Permiso de datos.** Restringe el acceso a datos concretos —por usuario o por
  aplicación— para que alguien vea la pantalla completa pero solo su porción de la
  operación.
- **Países.** La cuenta puede quedar limitada a los países en los que opera esa persona.

## Dónde se administra { #donde-se-administra }

Todo esto vive en **Administración › [Control de Acceso](../administracion/control-de-acceso.md)**:

- [Usuarios](../administracion/usuarios.md) — alta y baja de personas, sus roles, sus
  bodegas y su permiso de datos.
- [Roles y Permisos](../administracion/roles-y-permisos.md) — qué abre cada rol, con qué
  nivel, con qué prioridad y con qué página predeterminada.
- [Permiso de datos](../administracion/permiso-de-datos.md) — los recortes de datos que
  luego se asignan a usuarios.

## Si algo no te aparece { #si-no-aparece }

Antes de escalarlo, tres preguntas en este orden:

1. **¿Es un problema de nivel o de acceso?** Si ves la pantalla pero el botón no
   responde, te falta nivel (Editor o Ejecutor). Si no ves la pantalla, te falta el
   permiso.
2. **¿Tu usuario está activo?** Un usuario inactivo entra a la aplicación y no ve nada.
3. **¿Estás en la empresa correcta?** Los permisos se conceden por empresa; al cambiarte
   de una a otra cambia todo el menú.

Las tres las resuelve el administrador de tu empresa desde Control de Acceso.

## Conceptos relacionados { #conceptos }

- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md) — los
  permisos son solo uno de los motivos por los que tu aplicación no es igual a la de otro.
- [Conceptos](../conceptos/index.md)
