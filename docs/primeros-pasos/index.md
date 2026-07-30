---
title: Bienvenida
module: Primeros pasos
audience: [Clientes, Usuarios]
summary: >
  Celes pronostica la demanda de cada producto en cada punto de tu red y, a partir de
  ese pronóstico, sugiere qué comprar y cómo distribuirlo. Esta página explica cómo se
  entra, qué vas a encontrar en el menú y cómo está organizada esta wiki.
keywords: [Celes, primeros pasos, inicio de sesión, menú, módulos, empresa]
tenant_variance: low
status: verified
verified_at: 2026-07-30
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/LoginPage/LoginPage.tsx
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/public/locales/es/login.json
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/hooks/queries/useTenantUserRolesPermissionsQuery.ts
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/src/components/Layout/NavMenu/NavMenu.tsx
    ref: d3c915057
  - repo: celes-platform
    path: apps/web-client/public/locales/es/routes.json
    ref: d3c915057
---

# Bienvenida

## Qué hace Celes { #que-hace }

Celes estima cuánta demanda va a tener cada producto en cada punto de tu red y usa esa
estimación para responder las dos preguntas de todos los días: **qué comprarle a cada
proveedor** y **cómo repartir lo que ya tienes** entre centros de distribución, bodegas
y tiendas. Sobre esas dos respuestas se apoya el resto: los reportes miden qué tan bien
salieron, las promociones y los eventos las corrigen, y la automatización puede
ejecutarlas sin que nadie apriete un botón.

La aplicación no es una calculadora de un solo paso. Verás la misma cifra en varias
pantallas —el pronóstico, el sugerido, la orden, el reporte— y cada una la muestra en un
momento distinto de ese recorrido.

## Cómo se entra { #como-se-entra }

Se entra con la cuenta corporativa que ya usas: **Inicio de sesión con Google** o
**Inicio de sesión con Microsoft**. Celes no maneja una contraseña propia, así que las
políticas de tu empresa —doble factor, expiración, bloqueo— se aplican tal cual.

Después del inicio de sesión pasan dos cosas:

1. **Eliges la empresa.** Si tu cuenta está habilitada en una sola, Celes entra directo;
   si está en varias, aparece el selector **Selecciona la empresa**. Puedes cambiarte
   más tarde sin cerrar sesión: la aplicación recarga los datos de la empresa nueva.
2. **Celes te deja en tu página predeterminada**, que la define tu rol. Si tu rol no
   tiene una configurada, entras al **Inicio**. Y si llegaste por un enlace a una
   pantalla concreta, te lleva ahí en vez de a la predeterminada.

## Qué vas a encontrar { #que-vas-a-encontrar }

| Sección | Qué vive ahí |
|---|---|
| [Inicio](../vista-general/panel-de-inicio.md) | El panel de entrada, con el estado general de la operación |
| [Reabastecimiento](../reabastecimiento/index.md) | Comprar, Distribuir, Solicitudes de Tiendas, Calendario de OC y la automatización de compra y distribución |
| [Pronóstico](../pronostico/index.md) | El pronóstico de demanda y lo que lo corrige: Resumen, Alertas de Forecast, Escenarios, Calendario de Eventos, Demanda y Promociones |
| [Promociones](../promociones/index.md) | Campañas y Calendario de Promociones |
| [Surtido](../surtido/index.md) | Trade Marketing y Promociones de Exhibición |
| [Activación](../activacion/index.md) | Lo que cambia cómo Celes calcula: Reglas de Negocio, Productos de Agrupación y Sustitutos |
| [Reportes](../reportes/index.md) | Histórico, Desempeño Comercial, Adherencia, Distribuciones Estimadas y Balanceo de Inventario |
| [Administración](../administracion/index.md) | Configuración, control de acceso, datos maestros, carga de datos y auditoría |

Además de las pantallas del menú hay una que se abre desde cualquier producto que
aparezca en una tabla: el [Detalle de Producto](../vista-general/detalle-de-producto.md),
que reúne en un solo lugar lo que Celes sabe de ese producto.

## Tu menú no es el de todos { #tu-menu }

El menú lateral se arma con lo que tu usuario tiene permitido ver: una sección a la que
no tienes acceso no aparece en la lista, no aparece deshabilitada. Por eso dos personas
de la misma empresa pueden ver menús distintos, y por eso una captura de esta wiki puede
mostrar una opción que tú no tengas.

A eso se suma que no todas las empresas contratan las mismas capacidades. Lo que esta
wiki describe es el comportamiento base del producto; cuando algo depende de tu
configuración, la página lo dice en vez de prometerte un valor concreto.

Cómo se conceden esos accesos está en [Roles y permisos](roles-y-permisos.md).

## Cómo está organizada esta wiki { #esta-wiki }

- **Una página por pantalla.** Se llaman igual que en tu menú y siguen el mismo orden.
  La lista no se escribió a mano: se deriva de las pantallas que la aplicación
  realmente tiene, y una revisión automática avisa si aparece una pantalla sin página.
- **[Conceptos](../conceptos/index.md) transversales.** Explican el porqué —cómo se
  calcula un sugerido, qué predice el pronóstico, cuándo están listos los números del
  día—. Cuando una pantalla depende de uno, lo enlaza.
- **Cada página dice cuándo se verificó y contra qué.** Es la ficha que ves arriba, y es
  el motivo por el que puedes creerle: si el producto cambió y la página todavía no, se
  nota en la fecha. Las que aún no están terminadas se marcan como borrador.

## Por dónde empezar { #por-donde-empezar }

- [Roles y permisos](roles-y-permisos.md) — por qué ves lo que ves, y qué pedirle a tu
  administrador cuando falte algo.
- [Requisitos de datos](requisitos-de-datos.md) — qué necesita recibir Celes para que
  los números tengan sentido, y con qué frecuencia.
- [Conceptos](../conceptos/index.md) — las ideas que se repiten en todas las pantallas.
