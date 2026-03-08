# Cotopla

Sistema experimental de evaluación académica para cursos de diseño gráfico, basado en rúbricas, dashboards analíticos y visualización de datos pedagógicos.

---

## Descripción

Cotopla es una herramienta de gestión docente diseñada para profesores que evalúan mediante encargos creativos y rúbricas cualitativas. Permite registrar calificaciones, analizar el desempeño grupal e individual, generar informes interpretativos y mantener un historial de evaluaciones por corte académico.

El nombre hace referencia al volcán Cotopaxi — símbolo de estructura, proceso y erupciones de datos.

---

## Problema que resuelve

Los sistemas de calificación tradicionales tratan la nota como un número final. Cotopla la trata como el resultado de múltiples criterios con peso distinto, agrupados en encargos, organizados por cortes.

El sistema permite:
- Evaluar a cada estudiante encargo por encargo, criterio por criterio
- Ver cómo se distribuye el desempeño del grupo
- Identificar estudiantes en riesgo antes de que sea tarde
- Generar una narrativa pedagógica interpretativa del curso

---

## Funcionalidades principales

- **Gestión de cursos** — múltiples cursos con grupos y semestres independientes
- **Cortes de evaluación** — cada curso tiene períodos con peso porcentual configurable
- **Encargos** — actividades evaluadas con rúbrica propia
- **Rúbricas personalizables** — criterios por encargo definidos por el docente
- **Importación de rúbricas** — carga desde JSON estructurado
- **Evaluación individual** — calificación por criterio en escala 1–5
- **Evaluación grupal** — aplicar la misma evaluación a múltiples estudiantes a la vez
- **Dashboard analítico** — gráficas de promedio por encargo, por criterio y distribución de notas
- **Perfil de estudiante** — radar de competencias, consistencia, posición en el ranking, diagnóstico
- **Informe del curso** — documento interpretativo con narrativa pedagógica y recomendaciones
- **Backup y carga** — exportar e importar el estado completo en JSON
- **Persistencia automática** — autosave en localStorage con indicador de estado
- **Tema claro / oscuro** — toggle de interfaz

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| React 19 | UI y estado |
| Vite 7 | Bundler y servidor de desarrollo |
| React Router 7 | Navegación entre vistas |
| Recharts 3 | Gráficas de barras y radar |
| localStorage | Persistencia local del estado |

---

## Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

### Build de producción

```bash
npm run build
npm run preview
```

---

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Header, EvalArea, StatsBar…)
├── pages/            # Vistas principales (EvalView, DashboardView, ProfileView…)
├── hooks/            # Custom hooks (useThemeMode, useCourseAnalytics, useAppPersistence…)
├── utils/            # Funciones puras (cálculo de notas, reportes, importación de rúbricas)
├── constants/        # Colores, temas, datos por defecto, escala de evaluación
docs/
├── DATA_MODEL.md     # Modelo de datos documentado (entidades, tipos, relaciones)
└── screenshots/      # Capturas de pantalla del proyecto
```

---

## Modelo de datos

Ver [docs/DATA_MODEL.md](docs/DATA_MODEL.md) para la descripción completa de las entidades del sistema: `Course`, `Student`, `Corte`, `Encargo`, `RubricCriterion`, `GradeRecord` y estructuras derivadas.

---

## Estado del proyecto

En desarrollo activo. Es un laboratorio de analítica pedagógica — funciona en producción para uso docente real, pero la arquitectura y las vistas siguen evolucionando.

---

## Roadmap

- [ ] Publicación online (Vercel / Netlify)
- [ ] Base de datos remota con autenticación
- [ ] Exportación a PDF nativa
- [ ] Mejoras en visualización (heatmaps, línea de tiempo del desempeño)
- [ ] Sistema de equipos y coevaluación
- [ ] Paper interactivo para presentación de resultados

---

*Desarrollado por Prof. Odis · Profesional en diseño gráfico · Especialista en pedagogía y docencia*
