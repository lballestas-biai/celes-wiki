# celes-wiki

Documentación de producto de Celes. Sitio publicado:
**<https://lballestas-biai.github.io/celes-wiki/>**

Stack: [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). El contenido
vive en Markdown bajo `docs/`; el `nav` de `mkdocs.yml` es explícito.

## Reglas del contenido

Esta wiki es **pública y cliente-facing**. Antes de escribir, dos cosas:

1. **Se escribe contra la realidad verificable** — la aplicación y el código que la
   implementa. Toda página de pantalla lleva en su frontmatter `sources:` y
   `verified_at`. Lo que no se pueda verificar no entra, o entra como
   `status: draft`.
2. **No publicable, sin excepciones:** nombres de clientes o tenants · datos reales
   de producto, precio o volumen · SQL, nombres de tablas o datasets · credenciales,
   llaves de API, URLs internas, IDs de proyecto en la nube · contenido de la base
   de conocimiento interna de soporte · capturas sin sanear.

El historial de git es permanente: una captura sin sanear que entre al repo no se
borra con un commit siguiente. `tools/screenshots/raw/` está en `.gitignore`.

Las dos reglas son ejecutables: el contrato de frontmatter y la lista de no
publicables se comprueban en cada PR. **Antes de escribir una página, leer
[`CONTRIBUTING.md`](CONTRIBUTING.md)**, que es el contrato en prosa.

```bash
node tools/validate-frontmatter.mjs   # el contrato de cada página
node tools/check-denylist.mjs         # lo que ninguna página puede decir
node tools/check-denylist.mjs --list  # qué busca y por qué
```

## Desarrollo local

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

.venv/bin/mkdocs serve          # http://127.0.0.1:8000
.venv/bin/mkdocs build --strict # lo mismo que corre CI
```

`strict: true` está activo: un enlace roto o una página fuera del `nav` **falla el
build**. Es a propósito — un 404 en la navegación de un sitio cliente-facing es un
defecto.

El plugin `git-revision-date-localized` lee el historial de git para mostrar la
fecha real de último cambio de cada página, así que CI clona con `fetch-depth: 0`.

## Publicación

Cada push a `main` dispara `.github/workflows/deploy.yml`, que construye el sitio y
lo publica en GitHub Pages. No hay paso manual.

## El tema

El look viene del mock de referencia (`eliana-a11y/celes-wiki`, un `index.html` con
las páginas embebidas en un objeto JS). Se portó el CSS y la estructura, no el JS:
cada pieza del mock se mapea a una que el theme ya trae.

```
docs/assets/stylesheets/brand.css   # tokens: color, sombras, iconos de estado
docs/assets/stylesheets/layout.css  # el porte del layout (aquí no hay literales de color)
overrides/partials/content.html     # cabecera del artículo desde el frontmatter
overrides/partials/logo.html        # la marca del mock
overrides/partials/search.html      # copia del theme + nombre accesible del diálogo
overrides/partials/progress.html    # copia del theme + nombre accesible de la barra
```

**`search.html` y `progress.html` son copias literales de los partials de
mkdocs-material 9.7.7** con un `aria-label` añadido cada uno. Al subir de versión hay
que re-sincronizarlas contra el original; el resto de los overrides son aditivos.

### El frontmatter se ve

`content.html` renderiza la cabecera de cada página a partir de su frontmatter, y de
ahí sale el bloque de metadatos visible: `module` y `status` sobre el título;
`summary` como resumen destacado; `audience` como etiquetas; y `route`, `aliases`,
`permission`, `tenant_variance` y `verified_at` en la ficha de auditoría. Eso es lo
que hace la wiki auditable: **si una página no dice contra qué se verificó y cuándo,
el lector no tiene por qué creerle.**

Consecuencias para quien escribe contenido:

- El `<h1>` sigue viniendo del Markdown (`# Título`) y debe ser lo primero del cuerpo.
- `summary` ya no es solo metadato del agente: **se publica** como primer párrafo.
  No repetirlo en el cuerpo.
- La tabla «Ficha de la pantalla» de los stubs quedó redundante en sus filas
  *Dirección* y *Quién la ve* — el bloque de metadatos ya las muestra. Al escribir
  una página, quitarlas y quedarse con lo que no está en el frontmatter (dónde está
  en el menú, qué sub-pantallas incluye).
- `status: draft` se ve: etiqueta ocre junto al módulo, filo ocre en la ficha y una
  marca junto al nombre en el menú lateral. Todo valor nuevo de `status` necesita su
  entrada en `extra.status` (mkdocs.yml) **y** su icono `--md-status--<valor>` en
  `brand.css`; sin el icono el theme pinta un cuadrado.

### Accesibilidad

El mock viene de un repo `a11y` y esa parte no se porta a medias: `mkdocs build` +
Lighthouse (escritorio) dan **100 en accesibilidad**, con foco visible en todo lo
interactivo y en ambos esquemas. Dos colores del mock se oscurecieron porque no
llegaban a 4.5:1 — están anotados en `brand.css`. Al tocar color o foco, volver a
correr la auditoría.

## Qué páginas existen, y por qué

Las páginas de la wiki no se eligen a mano: se derivan de las pantallas que la
aplicación realmente tiene. La cadena es:

```
celes-app/celes-platform          ← el código de la aplicación (privado)
        │  node tools/snapshot-app-routes.mjs --repo <checkout> --ref origin/development
        ▼
tools/data/app-routes.json        ← qué rutas existen, cómo se llaman, quién las ve
        │  + tools/decisions.json ← lo que el código NO decide (bloque, exclusiones)
        │  node tools/build-inventory.mjs
        ▼
tools/inventory.json              ← el inventario canónico  ·  vista legible: tools/INVENTORY.md
        │  node tools/scaffold-pages.mjs
        ▼
docs/**.md  +  el `nav` de mkdocs.yml
```

Lee **[`tools/INVENTORY.md`](tools/INVENTORY.md)** para ver la tabla: ruta canónica,
etiqueta en español e inglés, permiso, si está en el menú, y qué página le toca.

Cuatro fuentes de verdad, todas en `apps/web-client`:

| Qué responde | Archivo |
|---|---|
| ¿La pantalla existe? | `src/routeTree.gen.ts` |
| ¿Cómo se llama? | `public/locales/{es,en}/routes.json` |
| ¿Quién la ve? | `src/providers/AuthProvider/checkModuleAccess.ts` |
| ¿Tiene otra URL? | `src/utils/routeMigrations.ts` |

Dos cosas que conviene saber antes de tocar nada:

- **`routes.json` no dice qué pantallas existen.** Conserva etiquetas de pantallas ya
  borradas. Quien manda sobre la existencia es el árbol de rutas.
- **Los duplicados no se adivinan.** Cuando una pantalla tiene dos URL, `routeMigrations.ts`
  declara cuál es la nueva y cuál la anterior. Los pares que no están ahí se resuelven
  con la evidencia del código (un `redirect`, quién enlaza a quién) y esa evidencia
  queda escrita en `tools/decisions.json`.

### La auditoría

`node tools/nav-audit.mjs` es lo que corre en CI y falla el PR si:

- una pantalla de la aplicación se quedó sin página,
- hay un `.md` en `docs/` que no corresponde a ninguna pantalla,
- un alias no termina en ninguna página,
- una página del inventario falta del `nav`.

Responde **qué páginas deben existir**. Lo que cada página dice de sí misma —incluido
si su `route`, su `permission` y sus `aliases` coinciden con el inventario— lo
comprueba `validate-frontmatter`, que es quien tiene el contrato.

CI audita contra la foto commiteada porque el monorepo es privado. Para comprobar
además que esa foto sigue vigente, con un checkout a mano:

```bash
node tools/nav-audit.mjs --against-repo ~/ruta/a/celes-platform
```

### Cuando la aplicación cambia

```bash
node tools/snapshot-app-routes.mjs --repo ~/ruta/a/celes-platform  # 1. refrescar la foto
node tools/build-inventory.mjs                                     # 2. falla si hay pantallas sin destino
node tools/scaffold-pages.mjs                                      # 3. sembrar stubs + reescribir el nav
```

El paso 2 falla a propósito ante una pantalla nueva: obliga a decidir qué se hace con
ella en `tools/decisions.json` en lugar de dejarla caer en silencio. `scaffold-pages`
nunca pisa una página existente.

## Estructura

```
mkdocs.yml            # configuración y nav (el bloque `nav` lo genera scaffold-pages)
CONTRIBUTING.md       # el contrato de contenido, en prosa
docs/                 # el contenido
  assets/stylesheets/ # tokens de marca y porte del layout del mock
overrides/            # extensiones del theme (ver «El tema»)
tools/                # inventario, auditoría y guardas (Node puro, sin dependencias)
  content-contract.json  # qué frontmatter exige cada tipo de página
  denylist.json          # qué no puede aparecer en una wiki pública
  data/               # la foto commiteada del código de la aplicación
requirements.txt      # versiones pinneadas
```

## Las guardas de CI

| Workflow | Job | Qué impide |
|---|---|---|
| `deploy.yml` | `build` | Publicar un enlace roto, una página fuera del `nav` o una fecha inventada |
| `nav-audit.yml` | `nav-audit` | Que una pantalla de la aplicación se quede sin página |
| `content-checks.yml` | `content-checks` | Una página que incumple el contrato o que dice algo no publicable |
| `content-checks.yml` | `secrets` | Que entre una credencial al historial (gitleaks) |

Las cuatro son *status checks* obligatorios de `main`. `secrets` usa
`gitleaks-action`, gratuito en repositorios públicos de una cuenta personal: si este
repositorio pasa a una organización, pedirá `GITLEAKS_LICENSE`.
