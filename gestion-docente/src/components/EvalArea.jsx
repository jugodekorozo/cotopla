import { C, SCALE } from "../constants/constants";
import { avg } from "../utils/utils";
import { Btn } from "./Btn";
import { spacing, typography } from "../design";

export function EvalArea({ selStudent, activeEnc, students, encargos, editing, setEditing, saved, onSave, selectedStudents }) {
  if (!selStudent) {
    return <div className="glass-card edge-light" style={{ background: "transparent", borderRadius: 12, padding: 24, textAlign: "center", color: "#a8a8a8" }}>Selecciona un estudiante</div>;
  }
  if (!activeEnc) {
    return (
      <div className="glass-card edge-light edge-light-active" style={{ background: "transparent", borderRadius: 12, padding: 20, textAlign: "center", color: "#a8a8a8", fontSize: 13, border: "1px solid rgba(231,2,124,0.35)" }}>
        {encargos.length ? "Selecciona un encargo para evaluar" : "Configura encargos primero (botón Encargos)"}
      </div>
    );
  }
  if (activeEnc.criterios.length === 0) {
    return (
      <div className="glass-card edge-light edge-light-active" style={{ background: "transparent", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid rgba(231,2,124,0.35)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{activeEnc.nombre}</div>
        <div style={{ fontSize: 12, color: C.orange, marginBottom: 8 }}>Este encargo no tiene criterios de rúbrica.</div>
        <div style={{ fontSize: 11, color: C.gray }}>Ve al panel <strong>Encargos</strong> y agrega criterios a la rúbrica antes de evaluar.</div>
      </div>
    );
  }
  var allFilled = activeEnc.criterios.every(cr => editing[cr.id] >= 1);
  var encAvg = allFilled ? avg(activeEnc.criterios.map(cr => editing[cr.id])) : 0;
  var studentName = (students.find(s => s.id === selStudent) || {}).name;
  var groupCount = selectedStudents && selectedStudents.length > 1 ? selectedStudents.length : 0;
  var isActiveCard = Boolean(selStudent || groupCount > 0);

  return (
    <div className={`glass-card edge-light${isActiveCard ? " edge-light-active focus-gradient-panel" : ""}${saved ? " save-success-flash" : ""}`} style={{ background: "transparent", borderRadius: 12, padding: 12, border: isActiveCard ? "1px solid rgba(231,2,124,0.35)" : undefined }}>
      {/* Group eval banner */}
      {groupCount > 0 && (
        <div style={{
          marginBottom: 8, padding: "6px 10px", borderRadius: 8,
          background: "rgba(231,2,124,0.12)", border: "1px solid rgba(231,2,124,0.45)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>👥</span>
          <span style={{ fontSize: 12, color: C.magenta, fontWeight: 600 }}>
            Evaluación grupal activa — se aplicará a {groupCount} estudiantes
          </span>
        </div>
      )}
      <div style={{ fontSize: typography.size.h3, fontWeight: typography.weight.bold, marginBottom: 2 }}>{groupCount > 0 ? `${groupCount} estudiantes` : studentName}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <span style={{ fontSize: 13, color: C.magenta, fontWeight: 600 }}>{activeEnc.nombre}</span>
        <span style={{ fontSize: 11, color: C.gray }}>({activeEnc.porcentaje}%)</span>
      </div>
      {activeEnc.descripcion && <div style={{ fontSize: 10, color: "#8b95a5", marginBottom: 6 }}>{activeEnc.descripcion}</div>}
      <div style={{ fontSize: 10, color: C.magenta, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Rúbrica</div>
      {activeEnc.criterios.map(cr => {
        var v = editing[cr.id] || 0;
        var sc = SCALE.find(x => x.val === v);
        return (
          <div key={cr.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", borderBottom: "1px solid #222", flexWrap: "wrap" }}>
            <span style={{ flex: "1 1 120px", fontSize: 12, color: "#ccc", minWidth: 100 }}>{cr.nombre}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {SCALE.map(s => (
                <button
                  key={s.val}
                  onClick={() => setEditing(p => ({ ...p, [cr.id]: s.val }))}
                  title={s.label}
                  className={`rubric-score-btn${v === s.val ? " score-selected" : ""}`}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: v === s.val ? "3px solid " + s.color : "2px solid #333",
                    background: v === s.val ? s.color : C.input,
                    color: v === s.val ? "#fff" : C.gray,
                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                    fontFamily: "'Roboto',sans-serif"
                  }}
                >
                  {s.val}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 11, color: sc ? sc.color : "#555", fontWeight: 600, minWidth: 70 }}>{sc ? sc.label : "—"}</span>
          </div>
        );
      })}
      {/* Prediction widget */}
      <div style={{
        marginTop: 6, padding: "7px 10px", borderRadius: 8,
        background: "#0a0a0a", border: "1px solid #1c1c1c",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
            {allFilled ? "Nota proyectada del encargo" : "Evaluación en progreso"}
          </div>
          {allFilled ? (
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: encAvg >= 3 ? C.green : "#ef4444" }}>
              {encAvg.toFixed(2)}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: "#666" }}>
              {Object.values(editing).filter(v => v >= 1).length}/{activeEnc.criterios.length} criterios completados
            </span>
          )}
        </div>
        {allFilled && (
          <div style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: encAvg >= 4 ? "#0a1e0a" : encAvg >= 3 ? "#0e1a0a" : "#1e0a0a",
            border: `1px solid ${encAvg >= 4 ? C.green : encAvg >= 3 ? "#4a8a4a" : "#ef4444"}`,
            color: encAvg >= 4 ? C.green : encAvg >= 3 ? "#7abf7a" : "#ef4444",
          }}>
            {encAvg >= 4 ? "Desempeño alto" : encAvg >= 3 ? "Desempeño aceptable" : "Requiere refuerzo"}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: spacing[2] - 2 }}>
        {saved && <span className="save-indicator">Guardado</span>}
        <Btn onClick={onSave} variant={saved ? "primary" : groupCount > 0 ? "secondary" : undefined} color={groupCount > 0 ? C.orange : C.magenta}>
          {saved ? "✓ Guardado" : groupCount > 0 ? `Guardar para ${groupCount} estudiantes` : "Guardar"}
        </Btn>
      </div>
    </div>
  );
}
