# Cómo se escribe en esta wiki

Esta es la documentación de producto de Celes. Es **pública**, la lee un cliente, y su
promesa es que **lo que dice es verificable**: cada página declara contra qué se
verificó y cuándo. Eso obliga a un contrato, y el contrato lo comprueba una máquina en
cada *pull request*.

Todo lo que hay aquí se resume en cuatro preguntas:

| | Lo responde | Lo comprueba |
|---|---|---|
| ¿Qué páginas deben existir? | El inventario de pantallas de la aplicación | `tools/nav-audit.mjs` |
| ¿Qué debe decir cada página de sí misma? | El contrato de contenido | `tools/validate-frontmatter.mjs` |
| ¿Qué no puede decir ninguna? | La lista de no publicables | `tools/check-denylist.mjs` |
| ¿Puede un agente citarla sin romper el enlace? | El índice y las anclas | `tools/agent-index.test.mjs` |

Antes de abrir el PR, los cuatro a la vez:

```bash
node tools/nav-audit.mjs
node tools/validate-frontmatter.mjs
node tools/check-denylist.mjs
node tools/agent-index.test.mjs
```

Son Node puro, sin `npm install`. En CI corren igual y **el PR no se puede mergear si
alguno falla**.

## Las dos reglas de fondo

1. **Se escribe contra la realidad, no contra la memoria.** Se abre la pantalla, se lee
   el código que la implementa, y lo que se afirma queda anotado en `sources:`. Lo que
   no se pueda verificar no entra — o entra marcado como borrador.
2. **La wiki es pública.** Nada que identifique a un cliente, describa las tripas del
   sistema o sirva a quien busque una puerta de entrada. La lista completa está más
   abajo.

## El contrato de contenido

Toda página lleva frontmatter. La forma canónica está en
[`tools/content-contract.json`](tools/content-contract.json); esto es la misma cosa en
prosa.

```yaml
---
title: Comprar                          # el nombre que la aplicación le da a la pantalla
module: Reabastecimiento                # el bloque de la wiki; lo fija el inventario
route: /work-area/procurement           # dirección canónica  ·  solo páginas de pantalla
aliases: [/work-area/procurement/order] # otras direcciones que llegan aquí
permission: work-area.procurement       # derivado del código  ·  `~` si no exige ninguno
audience: [Clientes, Usuarios]          # Clientes · Usuarios · Administradores · Implementadores
summary: >                              # ≤3 frases. Se publica, y es la respuesta corta del agente
  Qué es y para qué sirve.
keywords: [orden de compra, sugerido]   # por dónde alguien buscaría esta página
tenant_variance: none                   # none · low · high   (unknown solo en borrador)
status: draft                           # draft · verified
verified_at: 2026-07-30                 # AAAA-MM-DD, no puede estar en el futuro
sources:
  - repo: celes-platform
    path: apps/web-client/src/routes/...
    ref: <commit>
---
```

Tres cosas que el validador no deja pasar y conviene saber de antemano:

- **`title`, `module`, `route`, `permission` y `aliases` no se eligen.** Los fija el
  inventario canónico de pantallas (`tools/inventory.json`, derivado del código de la
  aplicación). Si crees que el inventario está mal, se arregla el inventario, no la
  página. Léelo en [`tools/INVENTORY.md`](tools/INVENTORY.md).
- **Un valor de `status` que no esté en `extra.status` de `mkdocs.yml` rompe el menú**
  — el tema pinta un cuadrado vacío. Por eso el validador saca de ahí los estados que
  admite: añadir uno es tocar dos sitios, `extra.status` en `mkdocs.yml` y su icono
  `--md-status--<valor>` en `brand.css`.
- **Las rutas de archivos del código van en `sources:` y en ningún otro sitio.** En el
  cuerpo de la página son contenido interno y el denylist las rechaza.

## Definición de página completa

`status: verified` es una afirmación: *esta página está terminada y verificada*. Se
puede marcar cuando la página cumple las siete condiciones. Las cinco primeras las
comprueba el validador; las dos últimas, quien revisa el PR.

1. `summary` responde «¿qué es y para qué sirve?» en ≤3 frases, sin el texto de relleno
   del esqueleto.
2. Están las tres secciones, con sus anclas estables y con contenido:
   `{ #que-es }`, `{ #que-puedes-hacer }`, `{ #requisitos }`. Las anclas son estables
   porque el agente de la Etapa 2 cita página **y** sección.
3. `tenant_variance` decidido (`none`, `low` o `high`) y al menos dos `keywords`.
4. Al menos una captura en `docs/assets/screenshots/`, tomada con
   `tools/screenshots/capture.mjs` (`tools/screenshots/README.md`). Las capturas **no se
   hacen a mano**: el saneamiento del dato de cliente pasa antes del disparo y es del
   pipeline. La firma humana dejó de ser obligatoria en #2816; mirar el PNG antes de
   mergear sigue siendo lo único que ve lo que el DOM no dice.
5. `sources:` con al menos una referencia y `verified_at` del día en que se verificó.
6. Usa los nombres de la interfaz **exactos**, y enlaza a los conceptos transversales
   que explican el porqué.
7. Cero contenido de la lista de abajo.

Mientras falte cualquiera de ellas, la página se queda en `draft`. Un borrador es
honesto; una página `verified` que no cumple, no.

## Las anclas

**Todo encabezado del cuerpo lleva su ancla escrita**, no solo las tres obligatorias:

```markdown
## Qué puedes hacer aquí { #que-puedes-hacer }
### Ajustar cantidades { #ajustar-cantidades }
```

El id va en minúsculas con guiones y no se repite dentro de la página. Vale también para
un borrador, y lo comprueba `validate-frontmatter`.

La razón es la Etapa 2: el chat responde citando **página y sección**, y esa cita se
publica. Si el id se dedujera del título —que es lo que hace MkDocs por su cuenta—,
cambiar una palabra del encabezado rompería todos los enlaces ya dados. Escrito en el
Markdown, el encabezado se puede reordenar y reescribir sin tocar el enlace.

De ahí salen `wiki-index.json`, `llms.txt` y `llms-full.txt`, que se generan en cada
publicación; el README los explica en «El índice para el agente». Enlazar a la sección de
otra página se hace como siempre, y si el ancla no existe **el PR falla**:

```markdown
[en qué se diferencian](../conceptos/sugerido-compra-vs-distribucion.md#diferencias)
```

## Lo que no se publica

| | |
|---|---|
| Nombres de clientes o de sus instancias | Datos reales de producto, precio o volumen |
| SQL, nombres de tablas, capas o modelos de datos | Interioridades del constructor de reportes |
| Credenciales, llaves, tokens | Direcciones internas, proyectos en la nube, servicios |
| Rutas del código fuera de `sources:` | Contenido de la base de conocimiento interna de soporte |
| Capturas sin sanear | Correos de personas |

Lo comprueba `tools/check-denylist.mjs` con las reglas de
[`tools/denylist.json`](tools/denylist.json) (`--list` las imprime). Dos detalles del
diseño que importan:

- **Los nombres de cliente están como hash, no en claro.** Este repositorio es público:
  una lista de clientes aquí sería exactamente la fuga que la regla existe para
  impedir. Para añadir uno:

  ```bash
  node tools/check-denylist.mjs --hash 'Nombre del cliente'
  ```

  y se pega en `nombres.hashes` la línea que imprime.
- **Es una red, no una prueba.** Atrapa lo que sabe nombrar. No sabe leer los píxeles de
  una captura ni juzgar si una frase revela algo: eso sigue siendo trabajo de quien
  revisa. Lo que sí garantiza sobre las capturas es dónde pueden vivir (`docs/assets/`),
  cómo no pueden llamarse (`raw`, `original`, `wip`…) y que no entren datos crudos
  (`.csv`, `.sql`, `.xlsx`…).

Si un hallazgo es un falso positivo, se anota en la línea — o en la anterior — con el
motivo:

```markdown
<!-- denylist-ok: sql — «select» aquí es el nombre de un control de la interfaz -->
```

El motivo es obligatorio. Una excepción sin motivo es una regla apagada a escondidas, y
en el diff se ve igual de bien que el texto que justifica.

**El historial de git es permanente.** Una captura sin sanear o una credencial que
entren al repositorio no se borran con el commit siguiente; hay que reescribir el
historial y rotar lo filtrado. Por eso `tools/screenshots/raw/` está en `.gitignore`, por
eso `check-screenshots.mjs` barre el historial completo buscando imágenes fuera de
`docs/assets/screenshots/`, y por eso hay un escáner de secretos en CI además del
denylist.

## El flujo

1. Rama desde `main` y un PR. `main` está protegida: no se empuja directo.
2. CI corre cuatro cosas — `build` (construye el sitio con `--strict`), `nav-audit`,
   `content-checks` y `secrets`. Las cuatro tienen que pasar.
3. Revisión humana. Es donde se juzga lo que una máquina no puede: si el texto es
   correcto, si la captura está limpia, si esto se le puede enseñar a un cliente.

Para ver los cambios mientras escribes:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve
```

El resto del funcionamiento del repositorio —de dónde sale el inventario, cómo está
portado el tema, qué hacer cuando la aplicación cambia— está en el
[README](README.md).
