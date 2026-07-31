---
title: Por qué tu instancia puede diferir
module: Conceptos
audience: [Clientes, Usuarios, Administradores]
summary: >
  Celes se configura empresa por empresa: permisos, capacidades contratadas, columnas,
  parámetros, reglas e integraciones. Esta página enumera en qué puede diferir tu instancia
  de lo que describe esta wiki, y cómo averiguar cuál es tu caso.
keywords: [instancia, empresa, configuración, permisos, capacidades, variación, multiempresa]
tenant_variance: none
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/components/Feature/Feature.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# Por qué tu instancia puede diferir

## Un producto, muchas configuraciones { #un-producto }

Celes es el mismo producto para todos, y casi nada de lo que ves está fijo. La aplicación se
configura empresa por empresa —y dentro de una empresa, usuario por usuario—, así que dos
personas pueden tener delante la misma pantalla con distinto contenido, distintas columnas y
distintas opciones.

Esta wiki describe **el comportamiento base**. Cuando algo depende de tu configuración, la
página lo dice en vez de prometerte un valor concreto; y cada página lleva en su ficha una
etiqueta de **variación por instancia** que anticipa cuánto puede cambiar lo que estás
leyendo.

## En qué puede diferir { #en-que-difiere }

### Lo que puedes ver { #permisos }

El menú lateral se arma con lo que tu usuario tiene permitido: una sección a la que no tienes
acceso **no aparece**, no aparece deshabilitada. Por eso una captura de esta wiki puede
mostrar una opción que tú no tengas, y por eso el primer diagnóstico de «no encuentro la
pantalla» es de permisos, no de producto. Ver
[Roles y permisos](../primeros-pasos/roles-y-permisos.md).

Además, cada rol puede tener su **página de inicio**: dos personas que entran con la misma
dirección terminan en pantallas distintas.

### Qué capacidades están habilitadas { #capacidades }

No todas las empresas usan todo. Hay funcionalidades que se habilitan por contrato y otras
que se activan de forma gradual, empresa por empresa, mientras se estabilizan. El efecto
práctico es el mismo: **una opción descrita aquí puede no existir todavía en tu instancia**, y
puede aparecer más adelante sin que nadie cambie tu configuración.

### Qué datos recibe Celes { #datos }

El producto solo puede calcular sobre lo que tus sistemas envían. Una capacidad sin sus datos
no falla con un mensaje: simplemente no muestra nada útil. Qué necesita cada una está en
[Requisitos de datos](../primeros-pasos/requisitos-de-datos.md).

### Cómo se llaman y qué muestran las tablas { #reportes }

Las columnas, sus etiquetas, sus formatos, las agrupaciones del selector y los filtros
disponibles se configuran por empresa. Ver
[Cómo se construyen los reportes](como-se-construyen-los-reportes.md).

### Con qué política se calcula { #politica }

Los parámetros, las reglas de negocio y los pasos del cálculo son tuyos. Dos empresas con los
mismos datos pueden obtener sugeridos distintos, y las dos estar bien. Ver
[Jerarquía de parámetros](jerarquia-de-parametros.md) y
[Reglas de negocio y plugins](reglas-de-negocio-y-plugins.md).

### Cuándo y cómo entran y salen los datos { #integraciones }

La hora del procesamiento diario, la zona horaria de tu operación y la forma en que las
órdenes salen hacia tus sistemas se configuran por empresa. Ver
[El ciclo diario de datos](ciclo-diario-de-datos.md) y
[Motor de Integración](../administracion/motor-de-integracion.md).

### La dirección de algunas pantallas { #direcciones }

Algunas pantallas se han reorganizado y conservan **dos direcciones válidas**: la actual y la
anterior. Un enlace guardado hace meses puede seguir funcionando aunque el menú la muestre en
otro sitio, y la wiki indica ambas en la ficha de cada página.

## Cómo saber cuál es tu caso { #como-saberlo }

1. **Mira tu menú**, no esta wiki: es la lista de lo que tu usuario tiene habilitado.
2. **Mira la ficha de la página** que estás leyendo: dice a qué dirección corresponde, qué
   permiso exige y cuánto varía entre instancias.
3. **Pregunta a tu administrador** por lo concreto: si un permiso te falta, si una capacidad
   está habilitada, si una columna existe en el catálogo.
4. **Y si trabajas con más de una empresa**, comprueba en cuál estás: el selector de empresa
   cambia todo lo anterior a la vez.

!!! info "Esta wiki no puede describir tu instancia una por una"

    Es un sitio público y único para todos los clientes: describe el producto, no tu
    configuración. Cuando una página dice que algo *se configura por empresa*, no es una
    evasiva — es la respuesta correcta, y la concreta la tiene tu administrador.

## Conceptos relacionados { #conceptos }

- [Cómo se construyen los reportes](como-se-construyen-los-reportes.md)
- [Jerarquía de parámetros](jerarquia-de-parametros.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
