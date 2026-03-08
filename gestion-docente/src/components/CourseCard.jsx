import { C, G } from "../constants/constants";

const STATUS_MAP = {
  good:  { color: C.green,   label: "Buen desempeño",  dot: "●" },
  ok:    { color: "#eab308", label: "Suficiente",       dot: "●" },
  risk:  { color: "#ef4444", label: "En riesgo",        dot: "●" },
  empty: { color: "#3a3a3a", label: "Sin datos",        dot: "○" },
};

function MetricBlock({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: color || "#FFFFFF", lineHeight: 1, letterSpacing: -0.5 }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export function CourseCard({ course, summary, isSelected, onSelect, onDelete, canDelete }) {
  const st = STATUS_MAP[summary.status] || STATUS_MAP.empty;
  const accentColor = isSelected ? C.magenta : st.color;

  return (
    <div className="glass-card glass-hover edge-light" style={{
      borderRadius: 14,
      border: `2px solid ${accentColor}`,
      boxShadow: isSelected
        ? `0 0 0 3px ${C.magenta}28, 0 6px 24px #00000080`
        : `0 2px 14px #00000050`,
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: 300,
      transition: "box-shadow 0.25s, border-color 0.25s",
    }}>

      {/* Accent stripe */}
      <div style={{ height: 3, background: isSelected ? G.accentGradient : accentColor, flexShrink: 0 }} />

      {/* Header */}
      <div style={{
        padding: "12px 14px 12px",
        background: "linear-gradient(160deg, #181818 0%, #0f0f0f 100%)",
        borderBottom: "1px solid #1c1c1c",
        position: "relative",
      }}>
        {/* Status badge */}
        <div style={{
          position: "absolute", top: 13, right: 14,
          display: "flex", alignItems: "center", gap: 5,
          background: "#080808",
          border: `1px solid ${st.color}40`,
          borderRadius: 20,
          padding: "3px 9px",
        }}>
          <span style={{ fontSize: 7, color: st.color, lineHeight: 1 }}>{st.dot}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: st.color, textTransform: "uppercase", letterSpacing: 1 }}>
            {st.label}
          </span>
        </div>

        {/* Course name */}
        <div style={{
          fontSize: 17, fontWeight: 700, lineHeight: 1.25,
          color: isSelected ? C.magenta : "#efefef",
          marginBottom: 8, paddingRight: 90,
        }}>
          {course.name}
        </div>

        {/* Chips */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <Chip>Grupo {course.group}</Chip>
          <Chip>Sem {course.semester}</Chip>
          {isSelected && <Chip accent={C.magenta}>Activo</Chip>}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: "12px 14px 10px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 12 }}>
          <MetricBlock
            label="Promedio"
            value={summary.evaluatedCount >= 1 ? summary.groupAvg.toFixed(2) : "—"}
            color={summary.evaluatedCount >= 1 ? (summary.groupAvg >= 3 ? C.green : "#ef4444") : "#444"}
          />
          <MetricBlock
            label="Evaluados"
            value={`${summary.evaluatedCount}/${summary.totalStudents}`}
            color={C.orange}
          />
          <MetricBlock
            label="Riesgo"
            value={summary.evaluatedCount >= 1 ? summary.atRiskCount : "—"}
            color={
              summary.evaluatedCount < 1 ? "#444" :
              summary.atRiskCount > 0 ? "#ef4444" : C.green
            }
          />
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: "#9aa0aa", textTransform: "uppercase", letterSpacing: 1 }}>
              Progreso
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: summary.progressPct === 100 ? C.green : summary.progressPct > 0 ? "#888" : "#333",
            }}>
              {summary.progressPct}%
            </span>
          </div>
          <div style={{ height: 5, background: "#1a1a1a", borderRadius: 3 }}>
            <div style={{
              width: summary.progressPct + "%",
              height: "100%",
              background: summary.progressPct === 100 ? C.green : accentColor,
              borderRadius: 3,
              transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ fontSize: 10, color: "#3a3a3a", marginTop: 5 }}>
            {summary.evaluatedCount === 0
              ? `${summary.totalStudents} estudiante${summary.totalStudents !== 1 ? "s" : ""} · sin evaluar`
              : summary.progressPct === 100
              ? "Todos los estudiantes evaluados"
              : `${summary.evaluatedCount} de ${summary.totalStudents} estudiantes evaluados`}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: "8px 10px",
        borderTop: "1px solid #181818",
        background: "#080808",
        display: "flex", gap: 6,
      }}>
        <button
          onClick={onSelect}
          style={{
            flex: 1, padding: "7px 0", borderRadius: 8,
            border: isSelected ? `1px solid ${C.magenta}66` : "1px solid #222",
            background: isSelected ? `${C.magenta}1a` : "#161616",
            color: isSelected ? C.magenta : "#bbb",
            fontWeight: isSelected ? 700 : 400,
            fontSize: 12, cursor: isSelected ? "default" : "pointer",
            fontFamily: "'Roboto',sans-serif",
            transition: "background 0.2s",
          }}
        >
          {isSelected ? "Seleccionado" : "Seleccionar"}
        </button>
        {canDelete && (
          <button
            onClick={onDelete}
            style={{
              padding: "7px 13px", borderRadius: 8,
              border: "1px solid #2a1010",
              background: "#110808",
              color: "#ef444490",
              fontSize: 12, cursor: "pointer",
              fontFamily: "'Roboto',sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef444460"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#ef444490"; e.currentTarget.style.borderColor = "#2a1010"; }}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ children, accent }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: accent ? 700 : 500,
      padding: "2px 9px", borderRadius: 20,
      background: accent ? `${accent}22` : "#1a1a1a",
      border: `1px solid ${accent ? accent + "55" : "#2a2a2a"}`,
      color: accent ? accent : "#888",
    }}>
      {children}
    </span>
  );
}
