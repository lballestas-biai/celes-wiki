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
- una página del inventario falta del `nav`,
- el frontmatter de una página miente sobre su ruta, su permiso o sus alias.

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
docs/                 # el contenido
  assets/stylesheets/ # tokens de marca
overrides/            # extensiones del theme
tools/                # inventario de pantallas y auditoría (Node puro, sin dependencias)
  data/               # la foto commiteada del código de la aplicación
requirements.txt      # versiones pinneadas
```
