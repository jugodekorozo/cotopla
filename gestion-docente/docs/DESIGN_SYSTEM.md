# Mini Design System (Cotopla)

## Objetivo
Base visual liviana para consistencia y mantenimiento, sin cambiar lógica de negocio.

## Ubicación
- `src/design/tokens/colors.js`
- `src/design/tokens/spacing.js`
- `src/design/tokens/typography.js`
- `src/design/tokens/radius.js`
- `src/design/tokens/shadows.js`
- `src/design/panels.js`
- `src/design/states.js`
- `src/design/chartTheme.js`
- `src/design/index.js`

## Tokens
- `colors`: paleta semántica (brand, neutral, semantic) y gradientes (solo para bordes/highlights/datos).
- `spacing`: escala `4, 8, 12, 16, 20, 24, 32, 40`.
- `typography`: familias, pesos y escala de tamaños (`display`, `h1`, `h2`, `h3`, `body`, `label`, `caption`).
- `radius`: `small`, `medium`, `large`, `xl`, `pill`.
- `shadows`: `subtle`, `medium`, `strong`, `glow`.

## Paneles reutilizables
- `panelStyles.primary`
- `panelStyles.secondary`
- `panelStyles.minimal`
- `panelStyles.glassCard`
- `panelStyles.active`

## Botones
`Btn` soporta variantes:
- `primary`
- `secondary`
- `ghost`
- `danger`

También conserva compatibilidad con `color` custom para casos existentes.

## Estados visuales
`uiStates` centraliza:
- `success`
- `warning`
- `danger`
- `selected`
- `disabled`

## Charts
`chartTheme` centraliza:
- grid
- ticks
- tooltip

Uso recomendado en componentes Recharts para evitar estilos repetidos.

## Reglas clave
1. No usar degradados en texto.
2. Gradientes solo en bordes, barras, nodos, acentos y estados activos.
3. Reutilizar spacing tokens y evitar valores aleatorios.
4. Usar colores semánticos (`success`, `warning`, `danger`, `selected`) antes que hex directos.
5. Edge lighting solo para foco/selección, no en todos los elementos.
