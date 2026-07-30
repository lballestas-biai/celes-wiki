---
title: Documentación de producto
audience: [Clientes, Usuarios]
summary: >
  Documentación de producto de Celes: qué hace cada pantalla, qué significa cada
  número y por qué el sistema decide lo que decide. Cada página se escribe contra
  la aplicación y su código, y declara cuándo fue verificada por última vez.
keywords: [wiki, documentación, ayuda, Celes]
tenant_variance: none
status: draft
verified_at: 2026-07-29
sources:
  - repo: celes-wiki
    path: mkdocs.yml
    ref: main
---

# Celes Wiki

## Cómo está escrita esta wiki { #como-esta-escrita }

Tres reglas gobiernan el contenido:

- **Se escribe contra la realidad, no contra la memoria.** Cada página se redacta
  consultando la aplicación y el código que la implementa, con los nombres de
  pantalla exactos que ves en tu menú.
- **Declara cuándo fue verificada.** Toda página lleva la fecha de su última
  verificación y las fuentes contra las que se comprobó. Si algo cambió en el
  producto y la página todavía no, se nota.
- **Distingue lo común de lo tuyo.** Celes se configura por cliente. Cuando un
  comportamiento depende de tu configuración, la página lo dice en lugar de
  prometer un valor concreto.

## Estado de esta wiki { #estado }

!!! warning "En construcción"

    El menú lateral ya lista **todas** las pantallas de la aplicación: se derivó del
    código, no de una lista escrita a mano, y una revisión automática falla si aparece
    una pantalla sin página. Los contenidos, en cambio, se están escribiendo. Cada
    página que todavía no describe su pantalla lo dice arriba, y de momento solo
    afirma su ficha: dónde está en el menú, su dirección y quién puede verla.

## Cómo corregir algo { #como-corregir }

Cada página tiene un botón **:material-pencil: Editar esta página** arriba a la
derecha. Abre el archivo en GitHub y tu cambio entra como propuesta revisable.
Si algo de aquí no coincide con lo que ves en la aplicación, eso es un defecto de
la wiki: repórtalo o corrígelo por ahí.
