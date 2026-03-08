# Modelo de datos — Panel de Evaluación Docente

Este documento describe las entidades principales del sistema, sus campos, tipos,
relaciones y ejemplos realistas. El estado persiste en `localStorage` (clave `eval-dash-v4`)
y en archivos `.json` de backup.

---

## Índice de entidades

| Entidad | Descripción breve |
|---|---|
| [Course](#course) | Asignatura evaluada con su configuración completa |
| [Student](#student) | Estudiante inscrito en un curso |
| [Corte](#corte) | Período de evaluación dentro del curso |
| [Encargo](#encargo) | Actividad evaluada en un corte |
| [RubricCriterion](#rubriccriterion) | Criterio de rúbrica de un encargo |
| [GradeRecord](#graderecord) | Calificaciones por criterio de un estudiante en un encargo |
| [CourseGrades](#coursegrades) | Índice completo de calificaciones de un curso |
| [RubricImportJSON](#rubricimportjson) | Formato de importación de rúbricas desde JSON externo |
| [BackupFile](#backupfile) | Archivo de respaldo exportado por el usuario |
| [ThemeTokens](#themetokens) | Tokens de color del sistema de temas UI |
| [AnalyticsSnapshot](#analyticssnapshot) | Datos derivados calculados por App.jsx en tiempo real |

---

## Course

Entidad raíz del sistema. Contiene todos los datos de una asignatura: estudiantes,
períodos, encargos y calificaciones. Es el objeto que se persiste en localStorage
y en los backups.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único generado con `uid()` (ej. `"c1"`, `"m7k2a9"`) |
| `name` | `string` | Nombre de la asignatura (ej. `"Ilustración Publicitaria"`) |
| `semester` | `number` | Semestre académico (ej. `7`). `0` si no aplica |
| `group` | `string` | Identificador del grupo (ej. `"751"`, `"único"`) |
| `cortes` | `Corte[]` | Lista de períodos de evaluación del curso |
| `students` | `Student[]` | Lista de estudiantes inscritos |
| `encargos` | `Record<corteKey, Encargo[]>` | Encargos por corte. Clave: `"corte-{id}"` |
| `grades` | `CourseGrades` | Calificaciones completas del curso |

### Ejemplo

```json
{
  "id": "c1",
  "name": "Ilustración Publicitaria",
  "semester": 7,
  "group": "751",
  "cortes": [
    { "id": 1, "weight": 30 },
    { "id": 2, "weight": 30 },
    { "id": 3, "weight": 40 }
  ],
  "students": [
    { "id": "111138141", "name": "Gissel Yaneth Alvarez Lara" }
  ],
  "encargos": {
    "corte-1": [
      {
        "id": "m7k2a9",
        "nombre": "Retrato expresionista",
        "descripcion": "Ilustración de retrato con técnica mixta",
        "porcentaje": 60,
        "criterios": [
          { "id": "cr01", "nombre": "Composición" },
          { "id": "cr02", "nombre": "Color" }
        ]
      }
    ]
  },
  "grades": {
    "corte-1": {
      "111138141": {
        "m7k2a9": { "cr01": 4, "cr02": 3 }
      }
    }
  }
}
```

### Relaciones

- Contiene `Corte[]`, `Student[]`, `Encargo[]` (indexados por corte) y `CourseGrades`.
- La clave de indexación de encargos y calificaciones es `"corte-{corte.id}"` (ej. `"corte-1"`).

---

## Student

Representa a un estudiante inscrito en el curso.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Número de identificación del estudiante (ej. `"111138141"`) |
| `name` | `string` | Nombre completo (ej. `"Gissel Yaneth Alvarez Lara"`) |

### Ejemplo

```json
{ "id": "111138141", "name": "Gissel Yaneth Alvarez Lara" }
```

### Relaciones

- Vive dentro de `Course.students[]`.
- Su `id` es la clave en `CourseGrades` para acceder a sus calificaciones.

---

## Corte

Período de evaluación dentro de un curso. Cada corte tiene un peso porcentual
que representa su contribución a la nota final del curso.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Número del corte (1, 2, 3…) |
| `weight` | `number` | Peso porcentual del corte sobre la nota final del curso (ej. `30` = 30 %) |

> Los pesos de todos los cortes de un curso deben sumar 100 para que los reportes
> sean correctos. El sistema muestra una advertencia si no se cumple.

### Ejemplo

```json
[
  { "id": 1, "weight": 30 },
  { "id": 2, "weight": 30 },
  { "id": 3, "weight": 40 }
]
```

### Relaciones

- Vive dentro de `Course.cortes[]`.
- Su `id` se usa para construir la clave `"corte-{id}"` que indexa encargos y calificaciones.

---

## Encargo

Actividad, proyecto o tarea evaluada dentro de un corte específico.
Contiene los criterios de rúbrica con los que se evalúa.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | ID generado con `uid()` |
| `nombre` | `string` | Nombre de la actividad (ej. `"Retrato expresionista"`) |
| `descripcion` | `string` | Descripción breve (puede ser vacío) |
| `porcentaje` | `number` | Peso del encargo dentro del corte (ej. `60` = 60 %). Los encargos del corte deben sumar 100. |
| `criterios` | `RubricCriterion[]` | Lista de criterios de rúbrica |

> La nota del encargo para un estudiante se calcula como el promedio simple de
> las calificaciones de todos sus criterios (`calcEncargoNote` en `utils.js`).
> La nota del corte es la suma ponderada de los encargos por su `porcentaje`.

### Ejemplo

```json
{
  "id": "m7k2a9",
  "nombre": "Retrato expresionista",
  "descripcion": "Ilustración de retrato con técnica mixta y paleta limitada",
  "porcentaje": 60,
  "criterios": [
    { "id": "cr01", "nombre": "Composición" },
    { "id": "cr02", "nombre": "Color" },
    { "id": "cr03", "nombre": "Técnica" }
  ]
}
```

### Relaciones

- Vive dentro de `Course.encargos["corte-{id}"][]`.
- Su `id` es la clave para acceder a las calificaciones del estudiante en `GradeRecord`.

---

## RubricCriterion

Criterio individual de evaluación dentro de un encargo.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | ID generado con `uid()` |
| `nombre` | `string` | Nombre del criterio (ej. `"Composición"`) |

### Ejemplo

```json
{ "id": "cr01", "nombre": "Composición" }
```

### Relaciones

- Vive dentro de `Encargo.criterios[]`.
- Su `id` es la clave en `GradeRecord` para la nota de ese criterio.

---

## GradeRecord

Calificaciones de **un estudiante** en **un encargo**.
Es un mapa de `criterio.id → nota`.

### Estructura

```
GradeRecord = { [criterionId: string]: number }
```

- Las notas son enteros entre **1 y 5** (escala cualitativa):
  - `1` = Insuficiente
  - `2` = Básico
  - `3` = Aceptable
  - `4` = Avanzado
  - `5` = Excelente
- Un criterio con valor `0` o ausente significa **sin evaluar**.
- Un estudiante está completamente evaluado en un encargo cuando
  todos sus criterios tienen valor `≥ 1` (`isFullyGraded` en `utils.js`).

### Ejemplo

```json
{
  "cr01": 4,
  "cr02": 3,
  "cr03": 5
}
```

Significa: Composición = Avanzado, Color = Aceptable, Técnica = Excelente.
Nota del encargo = promedio(4, 3, 5) = **4.00**.

### Relaciones

- Vive dentro de `CourseGrades[corteKey][studentId][encargoId]`.

---

## CourseGrades

Índice completo de calificaciones de un curso. Es el campo `grades` del objeto `Course`.

### Estructura

```
CourseGrades = {
  [corteKey: string]: {              // ej. "corte-1", "corte-2"
    [studentId: string]: {           // ej. "111138141"
      [encargoId: string]: GradeRecord  // ej. "m7k2a9"
    }
  }
}
```

### Ejemplo

```json
{
  "corte-1": {
    "111138141": {
      "m7k2a9": { "cr01": 4, "cr02": 3, "cr03": 5 },
      "enc456": { "cr04": 4, "cr05": 4 }
    },
    "111139450": {
      "m7k2a9": { "cr01": 3, "cr02": 2, "cr03": 3 }
    }
  },
  "corte-2": {}
}
```

### Relaciones

- Es el campo `Course.grades`.
- Las claves de primer nivel (`"corte-{id}"`) corresponden a `Corte.id`.
- Las claves de segundo nivel corresponden a `Student.id`.
- Las claves de tercer nivel corresponden a `Encargo.id`.

---

## RubricImportJSON

Formato esperado al importar una rúbrica desde JSON externo mediante el panel
de importación (botón "Importar JSON"). Validado por `rubricImport.js`.

### Estructura

```json
{
  "encargos": [
    {
      "nombre": "string (requerido)",
      "descripcion": "string (opcional)",
      "porcentaje": "number (requerido)",
      "criterios": ["string", "string"]
    }
  ]
}
```

> Los criterios se listan como strings simples (solo el nombre).
> Al importar, el sistema genera `id` automáticamente con `uid()`.

### Ejemplo válido

```json
{
  "encargos": [
    {
      "nombre": "Retrato expresionista",
      "descripcion": "Ilustración con técnica mixta",
      "porcentaje": 60,
      "criterios": ["Composición", "Color", "Técnica"]
    },
    {
      "nombre": "Identidad editorial",
      "porcentaje": 40,
      "criterios": ["Concepto", "Tipografía", "Paleta cromática"]
    }
  ]
}
```

### Relaciones

- Al confirmar la importación, se transforma en `Encargo[]` y reemplaza los
  encargos del corte activo en `Course.encargos[corteKey]`.

---

## BackupFile

Archivo `.json` generado por el botón "Backup" y cargado con "Cargar".
Contiene el estado completo de todos los cursos.

### Estructura

```json
{
  "version": 1,
  "savedAt": "2025-11-15T14:30:00.000Z",
  "courses": [ /* Course[] */ ]
}
```

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `version` | `number` | Versión del esquema del backup (actualmente `1`) |
| `savedAt` | `string` | Timestamp ISO 8601 del momento de exportación |
| `courses` | `Course[]` | Lista completa de cursos con todos sus datos |

### Comportamiento al importar

- Si el archivo es válido, reemplaza el estado completo de `courses`.
- El `selCourseId` se establece al primer curso del archivo.
- Se resetea `selStudent`, `selEncargo` y `selCorte`.

---

## ThemeTokens

Objeto de tokens de color calculado por `THEMES[theme]` en `constants.js`.
Se pasa como prop `T` desde `App.jsx` a los componentes que lo necesitan.

### Tokens disponibles

| Token | Tipo | Uso |
|---|---|---|
| `bg` | `string` (hex) | Color de fondo de la página (`--t-bg`) |
| `header` | `string` (hex) | Color de fondo del header y footer (`--t-header`) |
| `text` | `string` (hex) | Color de texto principal |
| `textSoft` | `string` (hex) | Texto secundario / subtítulos |
| `textMuted` | `string` (hex) | Texto terciario / hints / metadatos |
| `border` | `string` (hex) | Color de bordes y separadores |
| `input` | `string` (hex) | Fondo de inputs y selects |
| `navBtn` | `string` (hex) | Fondo de botones de navegación inactivos |
| `navBtnText` | `string` (hex) | Color de texto de botones de navegación inactivos |
| `tooltipBg` | `string` (hex) | Fondo de tooltips de gráficas |
| `tooltipText` | `string` (hex) | Texto de tooltips de gráficas |
| `gridLine` | `string` (hex) | Líneas de grilla de gráficas (CartesianGrid, PolarGrid) |
| `selectBg` | `string` (hex) | Fondo de elementos `<select>` |
| `selectText` | `string` (hex) | Texto de elementos `<select>` |

> Los colores de acento (`C.green`, `C.magenta`, `C.orange`) son fijos y no
> varían con el tema. Las tarjetas de datos (`C.card = "#1a1a1a"`) tampoco
> cambian — siempre son oscuras para mantener la legibilidad de las gráficas.

### Temas disponibles

| Tema | Descripción |
|---|---|
| `"dark"` | Fondo negro, texto claro. Valor por defecto. |
| `"light"` | Fondo gris claro `#f2f4f7`, texto oscuro. |

### Persistencia

El tema activo se guarda en `localStorage` bajo la clave `"ui-theme"`.

---

## AnalyticsSnapshot

Datos derivados que `App.jsx` calcula en tiempo real mediante `useMemo`.
No se persisten — se recalculan en cada render cuando cambian `grades` o `encargos`.

### Valores calculados

| Nombre | Tipo | Descripción | Función |
|---|---|---|---|
| `evaluated` | `Student[]` | Estudiantes con todos los encargos calificados en el corte activo | `isFullyGraded` |
| `allFinals` | `number[]` | Nota final de cada estudiante evaluado | `calcCorteNote` |
| `groupAvg` | `number` | Promedio grupal de las notas finales | `avg(allFinals)` |
| `ranking` | `(Student & { final: number })[]` | Estudiantes evaluados ordenados de mayor a menor nota | — |
| `atRisk` | `(Student & { final: number })[]` | Estudiantes con nota final `< 3.0` | — |
| `avgByEnc` | `Record<encargoId, number>` | Promedio grupal por encargo | `calcEncargoNote` |
| `avgByCrit` | `Record<"encargoId__criterionId", number>` | Promedio grupal por criterio específico | — |
| `globalCritAvg` | `Record<criterionName, number>` | Promedio grupal por nombre de criterio (agrupado entre encargos) | — |
| `notesByEncargo` | `Record<encargoId, { id, name, note }[]>` | Notas de cada estudiante por encargo, ordenadas descendentemente | — |
| `strengths` | `string[]` | Top 3 encargos con mayor promedio grupal (nombres) | — |
| `weaknesses` | `string[]` | Top 3 encargos con menor promedio grupal (nombres) | — |

### Fórmulas clave

```
nota_encargo(estudiante, encargo) = promedio_simple(criterios con nota ≥ 1)

nota_corte(estudiante) = Σ (nota_encargo × encargo.porcentaje / 100)
                         para cada encargo del corte activo

promedio_grupal = promedio(nota_corte de cada estudiante evaluado)
```

---

## Notas sobre el estado de la app (UIState)

El estado de la interfaz no se persiste entre sesiones (salvo `theme` y `selCourseId`).

| Variable | Tipo | Descripción |
|---|---|---|
| `selCourseId` | `string` | ID del curso activo |
| `selCorte` | `number` | ID del corte activo |
| `selStudent` | `string \| null` | ID del estudiante seleccionado en la vista de evaluación |
| `selEncargo` | `string \| null` | ID del encargo seleccionado en la vista de evaluación |
| `editing` | `GradeRecord` | Estado temporal del formulario de calificación (no guardado aún) |
| `selectedStudents` | `string[]` | IDs de estudiantes seleccionados para evaluación grupal |
| `profileId` | `string \| null` | ID del estudiante cuyo perfil se está visualizando |
| `theme` | `"dark" \| "light"` | Tema de UI activo (persiste en localStorage como `"ui-theme"`) |

---

*Última actualización: 2026-03-08*
