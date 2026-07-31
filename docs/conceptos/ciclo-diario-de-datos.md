---
title: El ciclo diario de datos
module: Conceptos
audience: [Clientes, Usuarios, Administradores]
summary: >
  Celes no calcula en vivo: una vez al día toma los datos de tu operación, los procesa en
  etapas y publica el resultado. Todo lo que ves —pronóstico, sugeridos, reportes— es la
  foto de esa última corrida, y saber a qué hora ocurre explica casi todas las sorpresas.
keywords: [procesamiento, corrida diaria, última ejecución, etapas, corte, frescura]
tenant_variance: high
status: verified
verified_at: 2026-07-31
sources:
  - repo: celes-platform
    path: apps/api-core/src/processing_events/domain/entities.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/processing_events/application/day_completeness.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/api-core/src/inventory/application/items/service.py
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/src/components/LastExecutionDate/LastExecutionDate.tsx
    ref: d0a73d245
  - repo: celes-platform
    path: apps/web-client/public/locales/es/administration.json
    ref: d0a73d245
---

# El ciclo diario de datos

## Una corrida al día { #una-corrida }

Celes no recalcula cuando abres una pantalla. Una vez al día, a una hora configurada para tu
empresa, arranca un **procesamiento** que recorre todo el camino —de los datos crudos al
sugerido— y publica el resultado. Desde ese momento y hasta la corrida siguiente, lo que ves
es esa foto.

Entenderlo resuelve la pregunta más frecuente sobre el producto: *«vendí esto hace dos horas,
¿por qué no aparece?»*. Porque el corte fue antes.

## Las etapas { #etapas }

La corrida no es un paso único, y la aplicación las muestra por nombre en el panel de
progreso de ejecución:

| Etapa | Qué hace |
|---|---|
| **Ingesta de datos** | Recibe lo que enviaron tus sistemas: ventas, inventarios, maestros, movimientos |
| **Preparación de datos** | Limpia, homologa y deja la información lista para calcular |
| **Pronóstico** | Estima la demanda, en una o varias fases |
| **Sustitutos** y **Sintéticos** | Consolidan historias de productos que se reemplazan o se agrupan |
| **Distribución**, **Escasez**, **Asignación** y **Compras** | Calculan los sugeridos de cada módulo |
| **Hechos** y **Agregaciones** | Construyen los números que alimentan los reportes |
| **Publicación de datos** | Deja el resultado disponible para la aplicación |

El orden importa: el pronóstico se calcula antes que los sugeridos, y los sugeridos antes que
los reportes que los miden. Un problema en una etapa temprana no se queda ahí —arrastra a
todas las siguientes—, y por eso el diagnóstico útil siempre empieza por la primera etapa que
falló, no por la pantalla donde se notó.

## De cuándo son los números que estás viendo { #de-cuando-son }

La aplicación lo dice, y conviene tomar el hábito de mirarlo: en las pantallas de
reabastecimiento aparece la fecha de la **última ejecución exitosa**. Si esa fecha no es la
de hoy, no estás viendo los números de hoy —y ninguna otra pantalla te lo va a advertir.

De ahí se derivan tres lecturas que evitan conclusiones equivocadas:

- **El día en curso está incompleto.** Un reporte cuyo rango llega hasta hoy trae, del día de
  hoy, solo lo que hubiera llegado al último corte.
- **Lo que cambies ahora se ve mañana.** Un parámetro, una regla de negocio, un escenario o
  un sustituto entran en la siguiente corrida, no en el número que tienes en pantalla.
- **Que un dato no esté no significa que no exista.** Puede estar en tu sistema de origen y
  no haber alcanzado el corte.

!!! info "La hora de la corrida se configura por empresa"

    Cada empresa tiene la suya, y suele estar puesta después de la ventana en la que sus
    sistemas envían los datos del día anterior. Puede haber más de una corrida diaria si la
    operación lo exige. El horario se interpreta en una **zona horaria de referencia única
    para todas las empresas**, así que si tu operación está en otro huso, tu corrida empieza
    a la hora local equivalente, no a la que muestra el reloj de la configuración.

## Qué pasa si la corrida no ha terminado { #si-no-termino }

No es un caso raro: un archivo que llega tarde o una etapa que se demora hacen que a las diez
de la mañana los datos del día todavía no estén.

- **Distribuir queda bloqueado.** Enviar una solicitud de distribución con números viejos
  despacharía mercancía con la foto de ayer, así que la aplicación **no lo permite** y avisa
  de que el procesamiento del día no ha terminado. Es una protección deliberada, no un error.
- **Las automatizaciones esperan.** No fallan ni se apagan: reintentan más tarde el mismo
  día. Ver [La automatización y sus condiciones](automatizacion-y-sus-condiciones.md).
- **Las pantallas siguen mostrando la corrida anterior**, con su fecha a la vista.

## Cuando algo se ve raro { #diagnostico }

Antes de reportar un número, tres comprobaciones en este orden:

1. **¿De cuándo es?** La fecha de última ejecución exitosa.
2. **¿Llegaron los datos?** Si la ingesta del día no trajo lo esperado, todo lo demás hereda
   el hueco. Ver [Calidad de Datos](../administracion/calidad-de-datos.md) y
   [Carga de Datos](../administracion/carga-de-datos.md).
3. **¿Cómo terminó la corrida?** El progreso de ejecución y el
   [Historial de Jobs](../administracion/historial-de-jobs.md) dicen qué etapas corrieron,
   cuánto tardaron y cuáles fallaron.

Una empresa puede además tener el procesamiento **apagado** a propósito —durante una
implementación, por ejemplo—. En ese caso no hay corrida que esperar, y quien lo sepa es
quien acompaña la implementación.

## Conceptos relacionados { #conceptos }

- [La automatización y sus condiciones](automatizacion-y-sus-condiciones.md)
- [Filosofía del forecast](filosofia-del-forecast.md)
- [Sugerido de compra vs. de distribución](sugerido-compra-vs-distribucion.md)
- [Jerarquía de parámetros](jerarquia-de-parametros.md)
- [Requisitos de datos](../primeros-pasos/requisitos-de-datos.md)
