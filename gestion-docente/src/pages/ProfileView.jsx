import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { C } from "../constants/constants";
import { calcCorteNote, calcEncargoNote, scaleColor, isFullyGraded } from "../utils/utils";
import { Btn } from "../components/Btn";
import { chartTheme, colors, spacing, typography } from "../design";
import { stdDev, clamp } from "../utils/mathUtils";

function StatCard({ label, value, tone = "neutral", helper }) {
  const toneColor = tone === "good" ? C.green : tone === "bad" ? "#ef4444" : tone === "warn" ? C.orange : "#eee";
  return (
    <div className="panel-minimal interactive-card" style={{ borderRadius: 10, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: C.gray, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: toneColor, lineHeight: 1 }}>{value}</div>
      {helper && <div style={{ marginTop: 4, fontSize: 11, color: "#a9a9a9", lineHeight: 1.3 }}>{helper}</div>}
    </div>
  );
}

export function ProfileView({ students, grades, profileId, encargos, isMobile, avgByEnc, onBack, onDownload, T }) {
  const TT = T || { gridLine: "#333", textMuted: "#555" };
  const st = students.find(s => s.id === profileId);
  const sg = grades[profileId];

  if (!st || !sg) {
    return (
      <div style={{ padding: `${spacing[6]}px` }}>
        <div className="glass-card edge-light" style={{ borderRadius: 12, padding: 36, textAlign: "center", color: "#777" }}>
          Selecciona un estudiante desde el dashboard.
        </div>
      </div>
    );
  }

  const fn = calcCorteNote(sg, encargos);
  const encargoRows = encargos.map(e => {
    const note = calcEncargoNote(sg[e.id], e.criterios);
    const groupNote = avgByEnc[e.id] || 0;
    return {
      id: e.id,
      nombre: e.nombre,
      porcentaje: e.porcentaje,
      note,
      groupNote,
      delta: note - groupNote,
      criterios: e.criterios,
    };
  });

  const validNotes = encargoRows.map(r => r.note).filter(v => v > 0);
  const consistency = clamp(5 - stdDev(validNotes) * 1.6, 0, 5);
  const bestEnc = encargoRows.length ? [...encargoRows].sort((a, b) => b.note - a.note)[0] : null;
  const weakEnc = encargoRows.length ? [...encargoRows].sort((a, b) => a.note - b.note)[0] : null;

  const evaluatedRanking = students
    .filter(s => grades[s.id] && isFullyGraded(grades[s.id], encargos))
    .map(s => ({ id: s.id, final: calcCorteNote(grades[s.id], encargos) }))
    .sort((a, b) => b.final - a.final);

  const rankPos = evaluatedRanking.findIndex(x => x.id === profileId) + 1;
  const rankText = rankPos > 0 ? `#${rankPos}/${evaluatedRanking.length}` : "—";

  const groupProjected = encargos.reduce((sum, e) => sum + (avgByEnc[e.id] || 0) * (e.porcentaje / 100), 0);
  const diffVsGroup = fn - groupProjected;

  const radarData = encargos.slice(0, 8).map(e => ({
    subject: e.nombre.length > 12 ? e.nombre.slice(0, 12) + "…" : e.nombre,
    student: calcEncargoNote(sg[e.id], e.criterios),
    group: avgByEnc[e.id] || 0,
  }));

  const statusLabel = fn >= 4 ? "Alto desempeño" : fn >= 3 ? "Estable" : "En riesgo";
  const statusColor = fn >= 4 ? C.green : fn >= 3 ? C.orange : "#ef4444";

  const diagnosis = fn >= 4
    ? "Perfil sólido y consistente. Recomendado aumentar complejidad de retos y exigencia conceptual."
    : fn >= 3
      ? "Perfil con base aceptable y margen de mejora. Focalizar retroalimentación en encargos de menor rendimiento."
      : "Perfil en zona de riesgo. Priorizar acompañamiento individual y refuerzo sobre criterios estructurales.";

  return (
    <div style={{ padding: `0 ${spacing[5]}px ${spacing[5]}px`, flex: 1 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: spacing[2] + 2 }}>
        <div className="glass-card edge-light edge-light-active" style={{ borderRadius: 14, overflow: "hidden" }}>
          <div style={{ height: 3, background: "linear-gradient(120deg,#e7027c,#f2992e)" }} />
          <div style={{ padding: 14, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: typography.size.label, letterSpacing: 1.2, textTransform: "uppercase", color: colors.neutral.textLabel, marginBottom: 4 }}>Ficha analítica del estudiante</div>
              <div style={{ fontSize: typography.size.h1, fontWeight: typography.weight.bold, lineHeight: 1.1, marginBottom: 4 }}>{st.name}</div>
              <div style={{ fontSize: typography.size.bodySmall - 1, color: colors.neutral.textMuted, marginBottom: 8 }}>ID: {st.id}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, border: `1px solid ${statusColor}66`, color: statusColor, background: `${statusColor}1a`, fontWeight: 700 }}>{statusLabel}</span>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, border: "1px solid #333", color: "#bbb", background: "#161616", fontWeight: 600 }}>Ranking {rankText}</span>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, border: "1px solid #333", color: "#bbb", background: "#161616", fontWeight: 600 }}>Consistencia {consistency.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "flex-start" : "flex-end", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: 1 }}>Nota general</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: statusColor, lineHeight: 1 }}>{fn.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: diffVsGroup >= 0 ? C.green : "#ef4444" }}>
                  {diffVsGroup >= 0 ? "+" : ""}{diffVsGroup.toFixed(2)} vs grupo
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(6,minmax(0,1fr))", gap: 8 }}>
          <StatCard label="Promedio" value={fn.toFixed(2)} tone={fn >= 3 ? "good" : "bad"} helper="Escala sobre 5.0" />
          <StatCard label="Consistencia" value={consistency.toFixed(2)} tone={consistency >= 3 ? "good" : "warn"} helper="Estabilidad entre encargos" />
          <StatCard label="Mejor encargo" value={bestEnc ? bestEnc.note.toFixed(2) : "—"} tone="good" helper={bestEnc ? bestEnc.nombre : "Sin datos"} />
          <StatCard label="Encargo débil" value={weakEnc ? weakEnc.note.toFixed(2) : "—"} tone={weakEnc && weakEnc.note < 3 ? "bad" : "warn"} helper={weakEnc ? weakEnc.nombre : "Sin datos"} />
          <StatCard label="Riesgo" value={fn < 3 ? "Sí" : "No"} tone={fn < 3 ? "bad" : "good"} helper={fn < 3 ? "Requiere refuerzo" : "Sin alerta"} />
          <StatCard label="Posición" value={rankText} tone="neutral" helper="Sobre evaluados completos" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          <div className="glass-card edge-light glass-hover interactive-card" style={{ borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Módulo de atributos</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.magenta, marginBottom: 6 }}>Radar de competencias</div>
            <div style={{ display: "flex", gap: 10, fontSize: 10, color: C.gray, marginBottom: 6 }}>
              <span><span style={{ color: C.magenta }}>■</span> Estudiante</span>
              <span><span style={{ color: C.orange }}>■</span> Grupo</span>
            </div>
            {radarData.length === 0 ? (
              <div style={{ color: C.gray, fontSize: 12, textAlign: "center", padding: "24px 0" }}>
                No hay datos comparativos aún.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                <PolarGrid stroke={TT.gridLine || chartTheme.grid.stroke} />
                <PolarAngleAxis dataKey="subject" tick={chartTheme.axisTickSmall} />
                <PolarRadiusAxis domain={[0, 5]} tick={chartTheme.axisTickSmall} />
                  <Radar dataKey="student" stroke={C.magenta} fill={C.magenta} fillOpacity={0.28} />
                  <Radar dataKey="group" stroke={C.orange} fill={C.orange} fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="glass-card edge-light glass-hover interactive-card" style={{ borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Módulo de rendimiento</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.magenta, marginBottom: 8 }}>Desempeño por encargo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {encargoRows.map(r => (
                <div key={r.id} className="panel-minimal" style={{ padding: "7px 8px", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ flex: 1, fontSize: 12, color: "#d7d7d7" }}>{r.nombre} ({r.porcentaje}%)</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: scaleColor(r.note) }}>{r.note.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 7, background: "#222", borderRadius: 4, overflow: "hidden", marginBottom: 3 }}>
                    <div style={{ width: (r.note / 5) * 100 + "%", height: "100%", background: scaleColor(r.note), borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 10, color: r.delta >= 0 ? C.green : "#ef4444" }}>
                    {r.delta >= 0 ? "+" : ""}{r.delta.toFixed(2)} vs promedio del grupo
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card edge-light glass-hover interactive-card" style={{ borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Diagnóstico del sistema</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.magenta, marginBottom: 8 }}>Lectura interpretativa del perfil</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div className="panel-minimal" style={{ borderRadius: 8, padding: 8 }}>
              <div style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: 1 }}>Fortaleza principal</div>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginTop: 4 }}>{bestEnc ? bestEnc.nombre : "Sin datos"}</div>
            </div>
            <div className="panel-minimal" style={{ borderRadius: 8, padding: 8 }}>
              <div style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: 1 }}>Debilidad principal</div>
              <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginTop: 4 }}>{weakEnc ? weakEnc.nombre : "Sin datos"}</div>
            </div>
            <div className="panel-minimal" style={{ borderRadius: 8, padding: 8 }}>
              <div style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: 1 }}>Posición frente al grupo</div>
              <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginTop: 4 }}>{rankText}</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#cfcfcf" }}>{diagnosis}</p>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Btn small variant="ghost" onClick={onBack}>← Dashboard</Btn>
          <Btn small color={C.magenta} onClick={onDownload}>Descargar informe</Btn>
        </div>
      </div>
    </div>
  );
}
