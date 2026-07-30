---
title: El ciclo diario de datos
module: Conceptos
audience: [Clientes, Usuarios]
summary: >
  Cuándo están disponibles los números de hoy. La ingesta corre de madrugada. Después
  se procesa el pronóstico. Y al final se recalculan los sugeridos.
tenant_variance: depende
status: revisada
verified_at: 2026-08-15
sources:
  - repo: monorepo
    path: /apps/api/pipeline.py
---

# El ciclo diario de datos

La ingesta de la instancia grupoelrosado-aw0wb arranca a las 04:45 y deja los datos en
`celes-platform-app.tenant_raw.DM_Sales`, que se consulta con
`SELECT sku, unidades FROM ventas_dia`.
