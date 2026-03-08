import { C } from "../constants/constants";
import { Btn } from "./Btn";
import { Input } from "./Input";
import { spacing, typography } from "../design";

export function EncargosPanel({
  encargos, encTotal, selCorte, isMobile,
  editEncId, setEditEncId,
  showEncForm, setShowEncForm,
  showRubricImport, toggleRubricImport,
  newEnc, setNewEnc, addEncargo,
  rubricRaw, setRubricRaw, rubricPreview, rubricImportError, rubricImportSuccess, previewRubricImport, confirmRubricImport,
  removeEncargo, updateEncargo,
  showCritForm, setShowCritForm, newCrit, setNewCrit, addCriterion, removeCriterion, renameCriterion,
  setShowCourseForm,
}) {
  const importedTotal = rubricPreview
    ? rubricPreview.encargos.reduce((sum, enc) => sum + Number(enc.porcentaje || 0), 0)
    : 0;
  const importedCorteMismatch = rubricPreview && Number(rubricPreview.corte) !== Number(selCorte);

  return (
    <div className="glass-card edge-light" style={{ background: "transparent", padding: `${spacing[3]}px ${spacing[6]}px`, margin: `0 ${spacing[6]}px`, borderRadius: "0 0 12px 12px", borderTop: "1px solid " + C.orange, borderLeft: "none", borderRight: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[2] }}>
        <span style={{ fontSize: typography.size.body, fontWeight: typography.weight.bold, color: C.orange }}>Encargos — Corte {selCorte}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn small variant="primary" onClick={() => setShowEncForm(!showEncForm)}>+ Encargo</Btn>
          <Btn small variant="secondary" onClick={toggleRubricImport}>Importar JSON</Btn>
          <Btn small color={C.magenta} onClick={() => setShowCourseForm(true)}>+ Curso</Btn>
        </div>
      </div>
      {rubricImportSuccess && (
        <div style={{ marginBottom: 8, background: "#0d1f14", border: "1px solid " + C.green, borderRadius: 8, padding: "8px 10px", color: C.green, fontSize: 12 }}>
          {rubricImportSuccess}
        </div>
      )}
      {showRubricImport && (
        <div style={{ background: C.input, borderRadius: 10, padding: 10, border: "1px solid #333", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: C.gray, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            Importar rúbrica JSON
          </div>
          <textarea
            value={rubricRaw}
            onChange={e => setRubricRaw(e.target.value)}
            placeholder='Pega aquí el JSON de rúbrica (con "encargos").'
            style={{ width: "100%", minHeight: 110, background: "#111", border: "1px solid #333", borderRadius: 8, color: "#eee", fontSize: 12, padding: 10, fontFamily: "'Roboto',sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Btn small variant="secondary" onClick={previewRubricImport}>Previsualizar</Btn>
            <Btn small variant="ghost" onClick={toggleRubricImport}>Cerrar</Btn>
          </div>

          {rubricImportError && (
            <div style={{ marginTop: 8, background: "#2a0f0f", border: "1px solid #ef4444", borderRadius: 8, padding: "8px 10px", color: "#ef4444", fontSize: 12 }}>
              {rubricImportError}
            </div>
          )}

          {rubricPreview && (
            <div style={{ marginTop: 8, background: "#151515", border: "1px solid #2a2a2a", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.orange, marginBottom: 6 }}>Previsualización (solo lectura)</div>
              <div style={{ fontSize: 11, color: "#ccc", marginBottom: 6 }}>
                Curso: {rubricPreview.curso || "—"} · Grupo: {rubricPreview.grupo || "—"} · Corte JSON: {rubricPreview.corte ?? "—"}
              </div>
              <div style={{ fontSize: 11, color: importedTotal === 100 ? C.green : "#eab308", marginBottom: 4 }}>
                Total de porcentajes importados: {importedTotal}%
              </div>
              {importedTotal !== 100 && (
                <div style={{ fontSize: 11, color: "#eab308", marginBottom: 4 }}>
                  Advertencia: el total de la rúbrica no suma 100%.
                </div>
              )}
              {importedCorteMismatch && (
                <div style={{ fontSize: 11, color: "#eab308", marginBottom: 6 }}>
                  Advertencia: el JSON indica corte {rubricPreview.corte}, pero se importará en el corte seleccionado ({selCorte}).
                </div>
              )}
              <div style={{ display: "grid", gap: 8 }}>
                {rubricPreview.encargos.map((enc, idx) => (
                  <div key={idx} style={{ background: "#101010", border: "1px solid #242424", borderRadius: 8, padding: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#eee" }}>{enc.nombre} <span style={{ color: C.orange }}>({enc.porcentaje}%)</span></div>
                    <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{enc.descripcion || "Sin descripción"}</div>
                    <div style={{ marginTop: 4, fontSize: 11, color: "#ccc" }}>
                      Criterios: {enc.criterios.join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8 }}>
                <Btn small variant="primary" onClick={confirmRubricImport}>Importar rúbrica</Btn>
              </div>
            </div>
          )}
        </div>
      )}
      {showEncForm && (
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Input value={newEnc.nombre} onChange={v => setNewEnc(p => ({ ...p, nombre: v }))} placeholder="Nombre del encargo" style={{ flex: "1 1 160px" }} />
          <Input value={newEnc.descripcion} onChange={v => setNewEnc(p => ({ ...p, descripcion: v }))} placeholder="Descripción" style={{ flex: "1 1 160px" }} />
          <Input value={newEnc.porcentaje} onChange={v => setNewEnc(p => ({ ...p, porcentaje: v }))} placeholder="%" style={{ flex: "0 0 55px" }} type="number" />
          <Btn small onClick={addEncargo}>Crear</Btn>
        </div>
      )}
      {encargos.length === 0 ? (
        <div style={{ fontSize: 12, color: "#555", padding: 8 }}>No hay encargos para este corte. Crea uno con el botón + Encargo.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
          {encargos.map(e => (
            <div key={e.id} style={{ background: C.input, borderRadius: 10, padding: 10, border: "1px solid " + (editEncId === e.id ? "#555" : "#222") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                {editEncId === e.id ? (
                  <>
                    <Input value={e.nombre} onChange={v => updateEncargo(e.id, "nombre", v)} style={{ flex: 1, padding: "3px 8px", fontSize: 12 }} />
                    <input type="number" value={e.porcentaje} onChange={ev => updateEncargo(e.id, "porcentaje", ev.target.value)} style={{ width: 45, background: "transparent", border: "1px solid #444", borderRadius: 4, color: "#eee", padding: "3px 6px", fontSize: 12, fontFamily: "'Roboto',sans-serif" }} />
                    <button onClick={() => setEditEncId(null)} style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontWeight: 700 }}>✓</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#eee" }}>{e.nombre}</span>
                    <span style={{ fontSize: 11, color: C.orange, fontWeight: 700 }}>{e.porcentaje}%</span>
                    <button onClick={() => setEditEncId(e.id)} style={{ background: "none", border: "none", color: C.gray, cursor: "pointer", fontSize: 11 }}>✎</button>
                    <button onClick={() => removeEncargo(e.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14 }}>×</button>
                  </>
                )}
              </div>
              <div style={{ paddingLeft: 6 }}>
                <div style={{ fontSize: 10, color: C.magenta, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Rúbrica</div>
                {e.criterios.length === 0 && <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Sin criterios. Agrega criterios a la rúbrica.</div>}
                {e.criterios.map(cr => (
                  <div key={cr.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#bbb", padding: "2px 0" }}>
                    <span style={{ color: C.gray }}>·</span>
                    <input
                      value={cr.nombre}
                      onChange={ev => renameCriterion(e.id, cr.id, ev.target.value)}
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid transparent", color: "#ccc", fontSize: 11, fontFamily: "'Roboto',sans-serif", padding: "1px 4px", outline: "none" }}
                      onFocus={ev => { ev.target.style.borderBottom = "1px solid #555"; }}
                      onBlur={ev => { ev.target.style.borderBottom = "1px solid transparent"; }}
                    />
                    <button onClick={() => removeCriterion(e.id, cr.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}>×</button>
                  </div>
                ))}
                {showCritForm === e.id ? (
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    <Input value={newCrit} onChange={setNewCrit} placeholder="Nuevo criterio" style={{ flex: 1, padding: "2px 6px", fontSize: 11 }} />
                    <Btn small variant="primary" onClick={() => addCriterion(e.id)} style={{ padding: "2px 8px", fontSize: 10 }}>+</Btn>
                    <Btn small variant="ghost" onClick={() => setShowCritForm(null)} style={{ padding: "2px 8px", fontSize: 10 }}>×</Btn>
                  </div>
                ) : (
                  <button onClick={() => { setShowCritForm(e.id); setNewCrit(""); }} style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontSize: 10, marginTop: 4 }}>+ criterio</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11, fontWeight: 600, marginTop: 8, color: encTotal === 100 ? C.green : "#ef4444" }}>
        Total encargos: {encTotal}%{encTotal !== 100 && " ⚠ debe ser 100%"}
      </div>
    </div>
  );
}
