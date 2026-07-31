---
title: Cómo se construyen los reportes
module: Conceptos
audience: [Clientes, Usuarios, Administradores]
summary: >
  Ninguna tabla de Celes viene de fábrica: cada una se arma con una consulta, un catálogo de
  columnas y una lista de filtros habilitados. Eso explica por qué dos empresas ven el mismo
  reporte con columnas distintas, y por qué a veces falta un filtro.
keywords: [reportes, columnas, filtros, agrupaciones, exportar, suscripciones, configuración]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/web-client/src/pages/DynamicPage/DynamicPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationConfigColumnsPage/AdministrationConfigColumnsPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdministrationAppFiltersPage/AdministrationAppFiltersPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/pages/Administration/AdminstrationQueryBuilder/AdministrationQueryBuilderPage/AdministrationQueryBuilderPage.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# Cómo se construyen los reportes

## Nada viene de fábrica { #nada-de-fabrica }

Las tablas y las gráficas de Celes no tienen columnas fijas. Cada pantalla que muestra datos
se apoya en una **consulta** —qué información pide y cómo la presenta— y esa consulta se
configura por empresa.

Es una decisión de diseño con una consecuencia directa: **lo que tú ves no es lo que ve otro
cliente**, y ni siquiera lo que ve un compañero con otros permisos. Esta wiki describe el
comportamiento base; los nombres exactos de tus columnas los define tu instancia.

## Las tres piezas { #las-piezas }

| Pieza | Qué decide | Dónde se administra |
|---|---|---|
| **El catálogo de columnas** | Qué columnas existen, cómo se llaman de cara al usuario, de qué tipo son y cómo se formatean | [Columnas](../administracion/columnas.md) |
| **La consulta** | Qué datos trae una pantalla y cómo se agrupan | [Consultas](../administracion/consultas.md) |
| **Los filtros de la aplicación** | Por qué columnas se puede filtrar en esa pantalla | [Filtros](../administracion/filtros.md) |

Se encadenan: una columna que no está en el catálogo no puede entrar en una consulta, y una
que no esté habilitada como filtro no aparece en el panel de filtros —aunque sí se vea en la
tabla—. Esa es la causa habitual de *«veo la columna pero no puedo filtrar por ella»*.

## Qué se puede configurar de una columna { #columnas }

- **La etiqueta** con la que se presenta. El dato llega con un nombre técnico; lo que lees es
  una traducción, y por eso una misma cifra puede llamarse distinto en dos empresas.
- **El tipo y el formato** —moneda, porcentaje, decimales, fecha—, que cambian cómo se ve el
  número, no su valor.
- **Si es visible** y en qué orden aparece.
- **Si es calculada**: hay columnas que no vienen del dato sino de una fórmula sobre otras
  columnas de la misma consulta.
- **Iconos condicionales**: reglas del estilo «si el valor supera este umbral, muestra este
  icono en este color», que son las que convierten una tabla en algo leíble de un vistazo.

!!! warning "Una columna calculada se calcula dentro de su propia consulta"

    Si el mismo indicador aparece en una tabla de detalle y en otra agrupada, cada una lo
    calcula con sus propios números. Para las sumas coinciden; para promedios, precios y
    porcentajes pueden no coincidir, y ninguna de las dos está mal: están respondiendo
    preguntas distintas. Cuando dos pantallas discrepan, esa suele ser la razón antes que
    un error de datos.

## Agrupaciones y vistas { #agrupaciones }

Muchas pantallas ofrecen un selector de **agrupación** —por centro, por proveedor, por
categoría—. No es un adorno de presentación: cambia las filas, cambia los totales y, en las
pantallas de pedido, cambia qué orden se puede generar.

Qué agrupaciones ofrece el selector se configura por empresa, igual que las columnas. Y en
las pantallas que tienen varias **vistas** del mismo dato, cada vista es una consulta
distinta con sus propias columnas.

## Lo que puedes hacer con cualquier tabla { #comportamientos }

Aunque el contenido cambie, el comportamiento es común:

- **Filtrar**, con el panel de filtros de la pantalla; los filtros suelen viajar contigo
  cuando pasas a otra pantalla relacionada.
- **Elegir columnas**, para esconder lo que no te interesa.
- **Ordenar y paginar.** Cuidado al comparar: ordenar afecta a todo el resultado, no solo a
  la página que estás viendo.
- **Totalizar todo el resultado** y no solo la página, donde exista el interruptor de
  agregado total. Es la diferencia entre «el total de esta página» y «el total de la
  consulta».
- **Exportar** a Excel o CSV, con las columnas que elijas, la página actual o el resultado
  completo.
- **Suscribirte**, en los reportes que lo admiten, para recibirlo cada cierto tiempo sin
  entrar.

## Cuando el reporte no dice lo que esperas { #diagnostico }

Antes de concluir que el dato está mal, en este orden:

1. **¿De cuándo es?** Los reportes muestran el último cierre. Ver
   [El ciclo diario de datos](ciclo-diario-de-datos.md).
2. **¿Qué filtros hay puestos?** Incluidos los que arrastraste desde otra pantalla.
3. **¿Cómo está agrupado?** Un total que no cuadra suele ser el mismo dato agrupado de otra
   forma.
4. **¿Estás comparando dos consultas distintas?** Dos pantallas pueden medir cosas parecidas
   con definiciones distintas de la misma palabra.

Si después de eso sigue sin cuadrar, lo que hay que pedirle a tu administrador es concreto:
qué columna, en qué pantalla, y si debe aparecer en la tabla, en el panel de filtros o en
las dos.

## Conceptos relacionados { #conceptos }

- [Por qué tu instancia puede diferir](por-que-tu-instancia-difiere.md)
- [El ciclo diario de datos](ciclo-diario-de-datos.md)
- [Jerarquía de parámetros](jerarquia-de-parametros.md)
- [Reportes](../reportes/index.md)
