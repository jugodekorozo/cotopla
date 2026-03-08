import { C, G } from "../constants/constants";
import { calcCorteNote, calcEncargoNote, isFullyGraded } from "../utils/utils";
import { Btn } from "../components/Btn";
import { Input } from "../components/Input";
import { EvalArea } from "../components/EvalArea";

export function EvalView({
  isMobile, isTablet,
  students, grades, encargos, selStudent, selEncargo,
  selectStudent, removeStudent,
  showAddStudent, setShowAddStudent, newSt, setNewSt, addStudent,
  selectEncargo,
  editing, setEditing, saved, onSave,
  activeEnc,
  saveError,
  evaluated,
  selectedStudents, toggleSelectedStudent, clearSelectedStudents,
}) {
  const evaluatedCount = evaluated ? evaluated.length : students.filter(s => isFullyGraded(grades[s.id], encargos)).length;
  const total = students.length;
  const pct = total ? Math.round((evaluatedCount / total) * 100) : 0;
  const selCount = selectedStudents ? selectedStudents.length : 0;
  const hasFocus = Boolean(selStudent || selCount > 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "250px 1fr", gap: 10, padding: "0 20px 20px", flex: 1 }}>
      {/* Student list */}
      <div
        className="glass-card edge-light"
        style={{
          background: "transparent",
          borderRadius: 12,
          padding: 8,
          maxHeight: isMobile ? "none" : "calc(100vh - 190px)",
          overflowY: "auto",
          alignSelf: "start",
          position: isMobile ? "static" : "sticky",
          top: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: C.gray, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Estudiantes</span>
          <Btn small color={C.magenta} onClick={() => setShowAddStudent(!showAddStudent)}>+</Btn>
        </div>

        {/* Selection counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, minHeight: 16 }}>
          <span style={{ fontSize: 10, color: selCount > 0 ? C.magenta : "#444" }}>
            {selCount > 0
              ? `${selCount} estudiante${selCount > 1 ? "s" : ""} seleccionado${selCount > 1 ? "s" : ""}`
              : "Selecciona para evaluación grupal"}
          </span>
          {selCount > 0 && (
            <button
              onClick={clearSelectedStudents}
              style={{ background: "none", border: "none", color: "#555", fontSize: 10, cursor: "pointer", padding: 0, fontFamily: "'Roboto',sans-serif" }}
            >
              Limpiar
            </button>
          )}
        </div>

        {showAddStudent && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
            <Input value={newSt.id} onChange={v => setNewSt(p => ({ ...p, id: v }))} placeholder="ID" />
            <Input value={newSt.name} onChange={v => setNewSt(p => ({ ...p, name: v }))} placeholder="Nombre" />
            <Btn small onClick={addStudent}>Agregar</Btn>
          </div>
        )}

        {students.map(s => {
          const full = isFullyGraded(grades[s.id], encargos);
          const partial = grades[s.id] && !full;
          const active = selStudent === s.id;
          const checked = selectedStudents && selectedStudents.includes(s.id);
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              {/* Checkbox for group selection */}
              <input
                type="checkbox"
                checked={checked || false}
                onChange={() => toggleSelectedStudent(s.id)}
                title="Seleccionar para evaluación grupal"
                style={{ cursor: "pointer", accentColor: C.magenta, flexShrink: 0 }}
              />
              <button
                onClick={() => selectStudent(s.id)}
                className={`student-item edge-light${active || checked ? " edge-light-active" : ""}${active ? " student-selected" : ""}`}
                style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 5,
                  padding: "4px 6px", borderRadius: 8,
                  border: active ? "1px solid " + C.magenta : checked ? "1px solid rgba(231,2,124,0.45)" : "1px solid transparent",
                  background: active ? "rgba(231,2,124,0.18)" : checked ? "rgba(231,2,124,0.1)" : "transparent",
                  boxShadow: active ? "0 0 0 1px rgba(231,2,124,0.25)" : "none",
                  cursor: "pointer", textAlign: "left", color: "#eee",
                  fontFamily: "'Roboto',sans-serif",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: full ? C.green : partial ? C.orange : "#444" }} />
                <span style={{ fontSize: 11, lineHeight: 1.2 }}>{s.name}</span>
                {full && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: C.green }}>{calcCorteNote(grades[s.id], encargos).toFixed(1)}</span>}
              </button>
              <button onClick={() => removeStudent(s.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 11 }}>×</button>
            </div>
          );
        })}
      </div>

      {/* Right panel: encargo selector + eval area */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className={`glass-card edge-light${hasFocus ? " edge-light-active focus-gradient-panel" : ""}`} style={{ background: "transparent", borderRadius: 12, padding: 10, border: hasFocus ? "1px solid rgba(231,2,124,0.28)" : undefined }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: 1 }}>Contexto de evaluación</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? C.green : C.orange }}>
              {pct}%
            </span>
          </div>
            <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3 }}>
              <div style={{
                width: pct + "%", height: "100%", borderRadius: 3,
                background: pct === 100 ? G.successGradient : G.accentGradient,
                transition: "width 300ms ease",
              }} />
            </div>
          <div style={{ fontSize: 10, color: "#7b8798", marginTop: 4 }}>
            {pct === 100
              ? "Todos los estudiantes evaluados"
              : `${evaluatedCount} de ${total} estudiante${total !== 1 ? "s" : ""} evaluados`}
          </div>

          {selStudent && encargos.length > 0 && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 10, color: C.gray, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Seleccionar encargo</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {encargos.map(e => {
                  const done = grades[selStudent] && grades[selStudent][e.id] && e.criterios.length > 0 && e.criterios.every(cr => grades[selStudent][e.id][cr.id] >= 1);
                  const active = selEncargo === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => selectEncargo(e.id)}
                      className={`encargo-chip${active ? " encargo-active" : " encargo-inactive"}`}
                      style={{ padding: "5px 10px", borderRadius: 8, border: active ? "1px solid " + C.magenta : "1px solid " + (done ? C.green : "#333"), background: active ? "rgba(231,2,124,0.22)" : C.input, color: active ? "#fff" : "#ccc", fontSize: 11, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "'Roboto',sans-serif", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: done ? C.green : e.criterios.length === 0 ? C.orange : "#555" }} />
                      {e.nombre} <span style={{ color: C.gray, fontSize: 10 }}>({e.porcentaje}%)</span>
                      {done && <span style={{ color: C.green, fontWeight: 700, fontSize: 10 }}>{calcEncargoNote(grades[selStudent][e.id], e.criterios).toFixed(1)}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {saveError && (
          <div style={{
            background: "#2a0f0f", color: "#ef4444",
            border: "1px solid #ef4444", borderRadius: 8,
            padding: "8px 10px", fontSize: 12,
          }}>
            {saveError}
          </div>
        )}

        <EvalArea
          selStudent={selStudent}
          activeEnc={activeEnc}
          students={students}
          encargos={encargos}
          editing={editing}
          setEditing={setEditing}
          saved={saved}
          onSave={onSave}
          selectedStudents={selectedStudents}
        />
      </div>
    </div>
  );
}
