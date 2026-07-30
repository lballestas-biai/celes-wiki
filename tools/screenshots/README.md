# Capturas de pantalla

Una captura por pantalla, sin datos de ningún cliente, y repetible.

Esto es lo que implementa **D4** y **D6** de la épica: se captura contra un tenant real
—no hay ambiente de demostración con datos creíbles— y el dato se cambia **en el DOM
antes de disparar la cámara**, no se difumina el PNG después. Un difuminado no se puede
comprobar; un reemplazo determinista sí.

```bash
# una vez por sesión
~/support/diag-harness/chrome-debug.sh start
node ~/support/diag-harness/auto-login.mjs <tenant> prd

# capturar
node tools/screenshots/capture.mjs                     # todos los objetivos
node tools/screenshots/capture.mjs --solo comprar      # los que coincidan
node tools/screenshots/capture.mjs --sin-escribir      # audita y no escribe nada

# la puerta humana, y lo que comprueba CI
node tools/screenshots/approve.mjs --pendientes
node tools/screenshots/approve.mjs --todas --por "Tu nombre"
node tools/screenshots/check-screenshots.mjs
node tools/screenshots/scrub.test.mjs
```

## Las piezas

| Archivo | Qué es |
|---|---|
| `objetivos.json` | Qué pantallas se capturan y con qué selector se sabe que cargaron |
| `reglas.json` | Qué es un dato del cliente, con qué se reemplaza y qué aborta la captura. **Es donde se toca cuando la aplicación cambia** |
| `catalogo.json` | Los nombres ficticios: tiendas, centros, proveedores, productos |
| `scrub.mjs` | El mapa de valores. Puro y determinista, sin DOM |
| `dom.mjs` | Las reglas de región, la identidad y **la guarda**. Corre dentro de la página |
| `capture.mjs` | La corrida: navegar, cortar la red, sanear, auditar, recortar, escribir |
| `png.mjs` | El PNG que se commitea: sin metadatos y recomprimido |
| `approve.mjs` | La revisión humana, anotada en `manifest.json` |
| `check-screenshots.mjs` | Lo que CI exige: manifiesto, revisión, y el historial de git limpio |
| `scrub.test.mjs` | Las pruebas del mapa de valores (corren en CI, sin navegador) |

`scrub.mjs` y `dom.mjs` se inyectan en la página como un script clásico —`capture.mjs` les
quita los `import`/`export` al concatenarlos—. Es un rodeo, y a cambio el saneamiento se
puede probar con `node` en vez de vivir dentro de un `page.evaluate`.

## Por qué el orden de la corrida es ese

1. **Esperar el dato.** El `espera` de cada objetivo solo existe cuando la pantalla acabó
   de cargar. Si no aparece, no hay captura: mejor eso que publicar un esqueleto de carga.
2. **Cortar la red.** Desde aquí la página no puede recibir datos nuevos. Sin este corte,
   una respuesta que llega tarde repinta la tabla con los valores reales justo antes del
   disparo.
3. **Sanear**, y dejar un `MutationObserver` que reaplique lo que la aplicación repinte por
   su cuenta (React vuelve a pintar al pasar el ratón por una celda, y en ese repintado el
   valor real vuelve al DOM).
4. **Auditar.** Si la guarda encuentra algo con forma de dato, esa pantalla **no produce
   PNG**. La corrida sigue con el resto y lo informa al final.
5. Recortar a la región útil, recomprimir, escribir, y anotar en el manifiesto **sin
   revisar**.

## La guarda, y por qué es lo que de verdad protege

El saneamiento sabe sanear las regiones que alguien declaró en `reglas.json`. La
aplicación cambia, y el día que cambie una clase el saneamiento se queda sin nada que
hacer y no se entera. Por eso la pregunta de la guarda no es «¿hice lo que dije?» sino
**«¿queda algo con forma de dato de cliente?»**:

| Regla | Qué caza |
|---|---|
| `region-sin-sanear` | Un texto dentro de una celda o un eje que nadie tocó |
| `numero-sin-sanear` | Un número con separadores, moneda o magnitud, esté donde esté |
| `mayusculas` | Una palabra en mayúsculas sostenidas que no es sigla conocida — así vienen los maestros del cliente, y es la regla que más atrapa |
| `identidad` | El nombre, el correo o la instancia de la cuenta que está capturando |
| `imagen-externa` | Un `img` de otro origen, que en la práctica es la foto de esa cuenta |
| `nombre-de-cliente` · `tenant-slug` | Un nombre de la lista de `denylist.json`, o un identificador de instancia, en el texto que quedó a la vista |

Más una última pregunta que se hace ya en Node, sobre el texto que quedó a la vista:
**¿aparece el nombre de algún cliente conocido, o el identificador de una instancia?** La
lista es la misma de `tools/denylist.json` (como hash) y la comparación es la misma que usa
`check-denylist.mjs`. Es la red que atrapa lo que las reglas de región no saben nombrar: un
texto libre, una celda que creímos vocabulario, un nombre de regla escrito con la marca del
cliente.

Falla cerrado: si algo no calza, no hay archivo. Y cuando protesta, casi siempre lo que hay
que hacer es **declarar la región o la especie que falta** en `reglas.json` y volver a
correr. La lista de siglas permitidas es para lo que de verdad es vocabulario de la
aplicación —una palabra que el cliente lee igual en su pantalla—; **un dato no se silencia
ahí**, y en el diff se distingue perfectamente una cosa de la otra.

## Añadir una pantalla

1. Anotarla en `objetivos.json` con su `page` del inventario y el selector que solo existe
   cuando la pantalla ya tiene datos.
2. `node tools/screenshots/capture.mjs --sin-escribir --solo <pedazo del nombre>`. Si la
   guarda protesta, es que esa pantalla trae una región o una especie de columna que
   `reglas.json` todavía no describe.
3. Cuando salga limpia, capturar de verdad, **abrir el PNG y mirarlo**, y aprobar.

El paso 2 se repite hasta que la guarda calle. Vale la pena mirar el PNG aunque la guarda
esté contenta: en las cinco primeras pantallas, lo que la guarda no podía saber salió a la
vista mirando —un eje de porcentajes que decía 914 %, un botón «Generar Orden» convertido en
«Dato De Ejemplo», dos centros distintos con el mismo nombre ficticio—. Ninguna de esas tres
es una fuga; las tres eran capturas que documentaban una aplicación que no existe.

## La revisión humana

**Ninguna captura se publica sin que una persona la haya abierto y mirado.** No es
burocracia: la guarda lee el DOM, y hay cosas que solo están en los píxeles —lo que la
aplicación pinte dentro de un `canvas`, una marca de agua, un tooltip que quedó abierto—.

El registro es ejecutable, no una promesa:

1. `capture.mjs` escribe la entrada del manifiesto con `revision: null`.
2. Quien revisa abre los PNG (`approve.mjs --pendientes` los lista) y aprueba con su
   nombre. La aprobación guarda el `sha256` de **esa** imagen.
3. `check-screenshots.mjs` —obligatorio en `main`— falla si un PNG no está en el
   manifiesto, si no tiene revisión, o si cambió después de que alguien lo revisara.

Volver a capturar borra la aprobación anterior a propósito: se aprueba una imagen, no un
nombre de archivo.

## El original nunca entra al repositorio

El historial de git es permanente: una captura sin sanear que entre no se borra con el
commit siguiente; hay que reescribir la historia o recrear el repositorio.

De ahí tres cosas, en orden de fuerza:

- **Por defecto no se toma ningún original.** El saneamiento va antes del disparo, así que
  no hace falta ninguno. `--con-original` existe para comparar cuando se está afinando una
  regla, y escribe en `~/.cache/celes-wiki/originales/`, fuera del árbol de trabajo.
- `tools/screenshots/raw/` y `*.raw.png` están en `.gitignore`.
- `check-screenshots.mjs` barre **todo el historial** buscando imágenes fuera de
  `docs/assets/screenshots/`, y las que tengan nombre de material de trabajo
  (`raw`, `original`, `wip`). Por eso su job de CI clona con `fetch-depth: 0`.

## El salt

El saneamiento es determinista: el mismo valor real da siempre el mismo valor ficticio, y
por eso una captura se puede volver a tomar y sale igual. Lo que impide darle la vuelta al
mapa es el **salt**, que vive en `~/.config/celes/.wiki-scrub-salt` y no está en el
repositorio (sin él, con una lista de nombres candidatos se podría preguntar cuál estaba en
la pantalla).

Se genera solo en la primera corrida. Conservarlo es lo que mantiene coherentes las
capturas entre sí; perderlo no compromete nada, solo hace que las próximas usen otros
nombres. `manifest.json` anota su `salt_id` —un hash corto— para poder saber si dos
capturas son comparables sin publicar el salt.

## Lo que este pipeline **no** resuelve

- **La cuenta de captura es de administrador.** Hoy se captura con la API key personal del
  agente (`is_admin=true`), y eso cambia la interfaz: la pantalla trae botones «Ver SQL» y
  «Copiar SQL» que un cliente no ve. Se quitan en `reglas.json`, pero quitar de la captura
  lo que sobra es un parche: para esta épica basta una cuenta **de solo lectura**, pedida en
  el issue #2811.
- **La forma de las curvas es real.** Los ejes se reescalan con un factor por eje —las
  magnitudes no se publican— pero el dibujo de la serie sigue siendo el del tenant. Sin
  volúmenes ni nombres no identifica a nadie; queda anotado porque es una decisión, no un
  olvido.
- **Los píxeles no se leen.** Ver «La revisión humana».
- **Un código corto se le puede escapar.** Quitando de `reglas.json` las tres formas de
  encontrar una celda, la guarda caza los cuatro nombres de centro de la pantalla de
  Comprar y no escribe nada —falla cerrado, se puede comprobar—, pero los códigos de tres
  dígitos de esa misma tabla no la despiertan: no tienen forma de magnitud ni de nombre. La
  guarda caza nombres y magnitudes; un identificador corto en una región que nadie declaró
  depende de la revisión humana.
