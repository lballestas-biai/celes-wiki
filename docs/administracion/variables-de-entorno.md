---
title: Variables de entorno
module: Administración
route: /administration/configuration/environment-variables
aliases: []
permission: administration.configuration.environment-variables
audience: [Administradores, Implementadores]
summary: >
  Variables de entorno son los interruptores de configuración de tu instancia: valores con los
  que se enciende o ajusta un comportamiento del producto sin tocar el producto. Se dividen en
  variables normales y secretos, que son variables cifradas.
keywords: [variables de entorno, configuración, secretos, interruptores, valor por defecto]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationEnvironmentVariablesPage/AdministrationEnvironmentVariablesPage.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: c98f195c5
---

# Variables de entorno

## Qué es y para qué sirve { #que-es }

No todo lo configurable de Celes es un parámetro de negocio. Hay decisiones que no son «cuántos
días de cobertura» sino «¿está encendida esta funcionalidad en esta instancia?». Esas viven aquí.

Una variable de entorno es un valor con nombre que el producto consulta para decidir cómo
comportarse. La pantalla trae un **catálogo** de las que Celes reconoce, cada una con su
descripción y su valor por defecto, y permite además definir **variables personalizadas**.

![Variables de entorno: la sección de secretos y la de variables, cada una con su tabla de
nombre, valor y última actualización.](../assets/screenshots/administracion/variables-de-entorno.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver las dos secciones.** La pantalla está partida en dos:

- **Variables de entorno** — configuración no sensible. La tabla muestra nombre, descripción,
  valor, última actualización y acciones.
- **Variables secretas de entorno** — las mismas, pero **cifradas**. Se usan para lo que no
  puede quedar a la vista.

Cada sección lleva su propio total y su propio botón de creación, y cuando una está vacía lo
dice explícitamente. Una instancia sin secretos configurados es normal.

**Ver el catálogo por grupos.** Las variables que Celes reconoce vienen agrupadas por el área
que afectan —forecast, reabastecimiento, interfaz, exportación, promociones, chat—, cada una con
su **tipo** (Booleano o Texto), su **valor por defecto** y su descripción. Es la lista de lo que
se puede encender, con la explicación al lado.

**Crear o editar una variable.** El formulario valida según el tipo: una variable booleana del
catálogo solo acepta `true` o `false`, y el campo de valor lleva un contador de caracteres.
Junto a cada variable ya definida se indica **cuándo se actualizó por última vez**.

**Eliminar.** Pide confirmación, con el nombre de la variable en el mensaje.

!!! warning "Un valor de aquí puede cambiar lo que ven todos los usuarios"

    Estas variables no son de un usuario ni de una pantalla: son de la instancia. Encender o
    apagar una cambia el comportamiento para todo el mundo, y en algunos casos hasta el
    siguiente ciclo de cálculo no se ve el efecto. Ver
    [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md).

!!! info "Un secreto se escribe, no se lee"

    Los secretos están cifrados: la pantalla permite crearlos y reemplazarlos, no consultar su
    valor. Si se perdió, se define de nuevo.

!!! tip "Algunas funcionalidades te traen aquí"

    Hay pantallas que, cuando una funcionalidad necesita una variable que no está definida,
    enlazan directamente a esta pantalla **con esa variable ya seleccionada** en el formulario
    de creación. Si llegaste así, el nombre ya viene puesto.

## Qué necesita para funcionar { #requisitos }

- **Saber qué hace la variable.** El catálogo trae la descripción y el valor por defecto de cada
  una; para las personalizadas, la responsabilidad es de quien las define.
- **El permiso `administration.configuration.environment-variables`**, y el de edición sobre él
  para crear o modificar.

## Conceptos relacionados { #conceptos }

- [Configuración General](configuracion-general.md)
- [Otras configuraciones](otras-configuraciones.md)
- [Por qué tu instancia puede diferir](../conceptos/por-que-tu-instancia-difiere.md)
- [El ciclo diario de datos](../conceptos/ciclo-diario-de-datos.md)
