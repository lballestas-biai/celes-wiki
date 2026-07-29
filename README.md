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

## Estructura

```
mkdocs.yml            # configuración y nav explícito
docs/                 # el contenido
  assets/stylesheets/ # tokens de marca
overrides/            # extensiones del theme
requirements.txt      # versiones pinneadas
```
