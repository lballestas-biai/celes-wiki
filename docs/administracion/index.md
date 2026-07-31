---
title: Administración
module: Administración
route: /administration
aliases: []
permission: administration
audience: [Administradores, Implementadores]
summary: >
  Administración es donde se configura Celes para tu empresa: quién entra y qué ve, cómo entran
  los datos y se traducen al modelo del producto, y con qué valores se hacen los cálculos. Es la
  sección que explica por qué dos instancias del mismo producto se comportan distinto.
keywords: [administración, configuración, accesos, datos maestros, parámetros, instancia]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/navigationItems.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/providers/AuthProvider/checkModuleAccess.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: c98f195c5
---

# Administración

## Qué es y para qué sirve { #que-es }

Las demás secciones de Celes se usan; esta se configura. Aquí no se compra, no se distribuye y
no se consulta un reporte: se decide **cómo se comportan** esas pantallas para tu empresa.

Eso la convierte en la respuesta a una pregunta que aparece a menudo: *«¿por qué en mi instancia
esto no funciona como está documentado?»*. Casi siempre porque alguien lo configuró así, y la
configuración está en una de estas pantallas.

![Administración abre en Usuarios, la primera pantalla de Control de
Acceso.](../assets/screenshots/administracion/usuarios.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

La sección se divide en cinco bloques.

**[Control de Acceso](control-de-acceso.md)** — quién entra y qué ve. Las personas, los roles que
les dan permiso sobre cada pantalla, y los permisos de datos que recortan la información dentro
de ellas.

**[Datos Maestros](datos-maestros.md)** — cómo entra el dato. Subirlo, conectarlo con el modelo de
Celes y vigilar que esté sano.

**[Configuración General](configuracion-general.md)** — con qué valores se calcula y cómo se
presentan los datos: parámetros, catálogo de columnas, filtros, consultas, cubicaje y las
variables de la instancia.

**Operación** — la automatización del reabastecimiento y el seguimiento de los despachos. Estas
pantallas se documentan en
**[Automatización & Operación](../reabastecimiento/automatizacion-y-operacion.md)**, que es donde
viven hoy en el menú.

**Seguimiento** — [Historial de Jobs](historial-de-jobs.md),
[Logs de Usuarios](logs-de-usuarios.md), [Dashboard ANS](dashboard-ans.md) y
[Colaboradores Externos](colaboradores-externos.md).

!!! info "Entrar a «Administración» te deja en Usuarios"

    La sección no tiene una pantalla propia: la dirección lleva a **Control de Acceso**, y de ahí
    a **Usuarios**. Si tu rol no alcanza Usuarios, esa entrada te dejará en un aviso de falta de
    permiso; en ese caso entra por la pantalla de Administración que sí tengas concedida, desde
    el menú.

!!! warning "Lo que se cambia aquí afecta a todos"

    Casi nada de esta sección es una preferencia personal. Un parámetro, una variable o una
    consulta valen para toda la empresa, y muchos cambios solo se ven reflejados en el siguiente
    ciclo de cálculo. Ver [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).

## Qué necesita para funcionar { #requisitos }

- **Un rol con permisos de Administración.** Basta tener **una** de las pantallas para que la
  sección aparezca en el menú: mostrará las que tengas.
- **El permiso `administration`** en cualquiera de sus formas más específicas.

## Conceptos relacionados { #conceptos }

- [Control de Acceso](control-de-acceso.md)
- [Datos Maestros](datos-maestros.md)
- [Configuración General](configuracion-general.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
- [Jerarquía de parámetros](../conceptos/jerarquia-de-parametros.md)
- [Roles y permisos](../primeros-pasos/roles-y-permisos.md)
