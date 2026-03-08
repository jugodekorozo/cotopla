# Cotopla — Architecture

Cotopla es una aplicación de evaluación docente enfocada en cursos de diseño.
Permite gestionar cursos, encargos, rúbricas y analizar el desempeño de estudiantes mediante visualización de datos.

---

## Stack tecnológico

Frontend  
React + Vite

Lenguaje  
JavaScript (ES6)

Routing  
React Router

Visualización  
Gráficos personalizados inspirados en RAWGraphs

Persistencia  
LocalStorage con autosave

---

## Estructura principal

src/

components/  
Componentes reutilizables de interfaz  
Ejemplo: botones, encabezados, paneles.

pages/  
Vistas principales de la aplicación  
EvalView  
DashboardView  
CoursesView  
ReportView  
ProfileView

hooks/  
Lógica reutilizable del sistema

useAppPersistence  
Gestión de guardado automático de datos.

useCourseActions  
Operaciones sobre cursos y estudiantes.

useCourseAnalytics  
Cálculo de métricas y estadísticas.

useThemeMode  
Control de modo claro / oscuro.

utils/  
Funciones auxiliares de cálculo y transformación de datos.

design/  
Sistema de diseño y tokens visuales.

---

## Flujo general del sistema

1. El usuario crea o selecciona un curso.
2. Define encargos y rúbricas.
3. Evalúa estudiantes.
4. Los datos se guardan automáticamente en localStorage.
5. El dashboard analiza los datos y genera visualizaciones.
6. El módulo de informe genera una lectura interpretativa.

---

## Filosofía del proyecto

Cotopla busca:

- facilitar evaluación compleja mediante interfaz clara  
- convertir datos académicos en visualización útil  
- apoyar análisis pedagógico mediante narrativa de datos  
