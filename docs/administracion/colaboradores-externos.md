---
title: Colaboradores Externos
module: Administración
route: /administration/external-collaborators
aliases: [/planning/external-collaborators]
permission: administration.external-collaborators
audience: [Administradores]
summary: >
  Colaboradores Externos permite invitar a alguien de fuera de tu empresa —típicamente un
  proveedor— a participar en Celes sin darle una cuenta de usuario. Se invita por correo, queda
  asociado a un proveedor y su acceso se limita a eso.
keywords: [colaboradores externos, proveedor, invitación, acceso externo, estado]
tenant_variance: low
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/_layout.administration.external-collaborators.index.lazy.tsx
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/src/utils/routeMigrations.ts
    ref: c98f195c5
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: c98f195c5
---

# Colaboradores Externos

## Qué es y para qué sirve { #que-es }

Buena parte de la información que mejora una compra no está dentro de la empresa: está en el
proveedor. Cuándo va a poder despachar, qué va a estar en falta, qué promoción viene.

Esta pantalla existe para que ese intercambio no dependa de correos sueltos. Un colaborador
externo es alguien de fuera —una persona del proveedor— que se invita a participar, **asociado a
ese proveedor** y con un alcance limitado a él. No es un usuario de tu empresa: no se crea en
[Usuarios](usuarios.md) ni recibe roles.

![Colaboradores Externos: la lista de colaboradores con su correo, el proveedor al que están
asociados, quién los invitó y su estado.](../assets/screenshots/administracion/colaboradores-externos.png)

## Qué puedes hacer aquí { #que-puedes-hacer }

**Ver la lista.** La tabla muestra, por colaborador, el **nombre del colaborador**, el **correo**,
el **proveedor** al que está asociado, **quién lo invitó** y su **estado**. Las dos últimas son
las que sirven para auditar: dicen quién abrió cada acceso externo y si sigue vigente.

**Invitar a un colaborador.** El botón **Agregar Colaborador** da de alta la invitación. Lo
esencial es el correo y el proveedor: es esa asociación la que define qué podrá ver.

!!! info "La lista vacía es el estado normal al empezar"

    En una instancia que todavía no ha invitado a nadie, esta pantalla muestra su tabla sin
    filas. Así se ve en la captura de arriba: es el punto de partida, no un error.

!!! warning "Un acceso externo se revisa periódicamente"

    Un colaborador invitado sigue teniendo acceso hasta que alguien lo quite, y la gente cambia
    de empresa. La columna de estado y la de quién invitó están para que esa revisión sea
    posible; conviene hacerla con la misma disciplina que la de [Usuarios](usuarios.md).

!!! tip "Cambió de sitio en el menú"

    Esta pantalla estuvo en **Pronóstico** y hoy pertenece a **Administración**. Cuál de las dos
    direcciones usas lo decide tu permiso: con el anterior la aplicación te lleva a la dirección
    de Pronóstico, con el nuevo a la de Administración. Es la misma pantalla.

## Qué necesita para funcionar { #requisitos }

- **El maestro de proveedores cargado**: un colaborador se asocia a un proveedor, así que el
  proveedor tiene que existir.
- **El correo de la persona del proveedor.**
- **El permiso `administration.external-collaborators`** —o el anterior equivalente de
  Pronóstico—, y el de edición sobre él para invitar.

## Conceptos relacionados { #conceptos }

- [Usuarios](usuarios.md)
- [Permiso de datos](permiso-de-datos.md)
- [Comprar](../reabastecimiento/comprar.md)
- [Administración](index.md)
