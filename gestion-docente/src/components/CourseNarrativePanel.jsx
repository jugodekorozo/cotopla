import { C, G } from "../constants/constants";

function heatColor(v) {
  if (v <= 1) return "#ef4444";
  if (v <= 2) return "#f2992e";
  if (v <= 3) return "#eab308";
  if (v <= 4) return "#6eb42c";
  return "#6eb42c";
}

function jitter(i, spread) {
  return (Math.sin(i * 9301 + 49297) * 0.5 + 0.5 - 0.5) * spread;
}

function statusTag(type) {
  if (type === "critical") return { label: "crítico", color: "#ef4444" };
  if (type === "alert") return { label: "alerta", color: "#f2992e" };
  if (type === "improving") return { label: "mejorando", color: C.magenta };
  return { label: "estable", color: "#6eb42c" };
}

function NarrativeCard({ icon, title, type, status, summary, stats, children }) {
  const st = statusTag(status);
  return (
    <div className="glass-card edge-light interactive-card" style={{ background: "transparent", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 10, color: "#8b95a5", textTransform: "uppercase", letterSpacing: 1.1 }}>{type}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf7" }}>{title}</div>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: st.color }}>{st.label}</span>
      </div>

      <p style={{ fontSize: 11, color: "#a9b3c3", lineHeight: 1.52, margin: "0 0 8px" }}>{summary}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {stats.map((s, i) => (
          <div key={i} className="panel-minimal" style={{ padding: "6px 8px", minWidth: 90, flex: "1 1 90px" }}>
            <div style={{ fontSize: 10, color: "#8b95a5", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: s.color || "#FFFFFF" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>{children}</div>
    </div>
  );
}

function MiniStrip({ values }) {
  const W = 500, H = 82, PX = 24;
  const plotW = W - PX * 2;
  const midY = H / 2;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  function xv(v) { return PX + (v / 5) * plotW; }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      <line x1={PX} y1={midY} x2={W - PX} y2={midY} stroke="#1e1e1e" strokeWidth={1} />
      <line x1={xv(mean)} y1={midY - 22} x2={xv(mean)} y2={midY + 22}
        stroke="#444" strokeWidth={1} strokeDasharray="3 2" />
      <text x={xv(mean)} y={11} textAnchor="middle" fill="#6b7481"
        fontSize={8} fontFamily="'Roboto',sans-serif">x̄ {mean.toFixed(2)}</text>
      {[0, 1, 2, 3, 4, 5].map(t => (
        <g key={t}>
          <line x1={xv(t)} y1={midY - 3} x2={xv(t)} y2={midY + 3} stroke="#222" strokeWidth={1} />
          <text x={xv(t)} y={H - 3} textAnchor="middle" fill="#5f6b7c"
            fontSize={8} fontFamily="'Roboto',sans-serif">{t}</text>
        </g>
      ))}
      {values.map((v, i) => (
        <circle key={i} cx={xv(v)} cy={midY + jitter(i, 28)}
          r={5} fill={heatColor(v)} fillOpacity={0.68}
          stroke={heatColor(v)} strokeOpacity={0.2} strokeWidth={1.5} />
      ))}
    </svg>
  );
}

export function CourseNarrativePanel({
  students, evaluated, ranking, atRisk,
  groupAvg,
}) {
  const hasData = evaluated.length > 0;
  const topStudent = ranking[0] || null;
  const recoveryZone = ranking.filter(s => s.final >= 2.5 && s.final < 3.2);
  const allFinalValues = ranking.map(s => s.final);

  function panoramaText() {
    if (!hasData) return "Aún no hay estudiantes completamente evaluados en este corte.";
    const pct = Math.round((evaluated.length / students.length) * 100);
    let opener = "";
    if (groupAvg >= 4) opener = "Desempeño sólido y consistente.";
    else if (groupAvg >= 3) opener = "Desempeño aceptable con focos de mejora.";
    else opener = "Dificultades que requieren intervención pedagógica.";
    const risk = atRisk.length > 0
      ? ` ${atRisk.length} en riesgo académico.`
      : " Sin estudiantes en riesgo.";
    return `${opener} Evaluados: ${evaluated.length}/${students.length} (${pct}%).${risk}`;
  }

  function pedagogicText() {
    if (!hasData) return "Completa evaluaciones para activar lectura pedagógica.";
    if (groupAvg < 2.5) return "Se recomienda intervención profunda y refuerzo individual.";
    if (groupAvg < 3) return "Se requiere refuerzo colectivo y revisión de progresión.";
    if (groupAvg < 3.5) return "Aplicar retroalimentación individual en criterios débiles.";
    if (groupAvg < 4) return "Profundizar encargos débiles y elevar desafío progresivo.";
    return "Escalar complejidad y consolidar estrategias exitosas.";
  }

  function pedagogicPoints() {
    if (!hasData) return [];
    if (groupAvg < 3) return [
      "Replantear encargos con mayor dificultad",
      "Acompañamiento individual para riesgo",
      "Refuerzo colectivo en criterios débiles",
    ];
    if (groupAvg < 3.5) return [
      "Retroalimentación individual focalizada",
      "Reconocer logros para sostener motivación",
      "Ajustar progresión de encargos",
    ];
    if (groupAvg < 4) return [
      "Profundizar encargos con menor promedio",
      "Desafíos adicionales para avanzados",
      "Aprendizaje colaborativo entre pares",
    ];
    return [
      "Elevar exigencia con proyectos complejos",
      "Conexiones interdisciplinarias",
      "Sistematizar estrategias exitosas",
    ];
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
        <NarrativeCard
          icon="🧠"
          title="Detector de riesgo"
          type="RIESGO"
          status={!hasData ? "alert" : atRisk.length > 0 ? "alert" : "stable"}
          summary={!hasData ? "Sin estudiantes evaluados." : `${topStudent ? `${topStudent.name} lidera con ${topStudent.final.toFixed(2)}.` : ""} ${atRisk.length} en riesgo y ${recoveryZone.length} en zona de recuperación.`}
          stats={[
            { label: "riesgo", value: atRisk.length, color: atRisk.length ? "#ef4444" : C.green },
            { label: "top", value: topStudent ? topStudent.final.toFixed(2) : "—", color: C.magenta },
          ]}
        >
          {allFinalValues.length > 0 ? (
            <>
              <MiniStrip values={allFinalValues} />
              {atRisk.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {atRisk.slice(0, 4).map(s => (
                    <span key={s.id} className="panel-minimal" style={{ padding: "4px 8px", fontSize: 10, color: "#ef4444", borderColor: "#2e0a0a" }}>
                      {s.name} · {s.final.toFixed(2)}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="panel-minimal" style={{ textAlign: "center", color: "#8b95a5", fontSize: 11, padding: "12px 8px" }}>Sin distribución de notas.</div>
          )}
        </NarrativeCard>

        <NarrativeCard
          icon="🎚"
          title="Ritmo del curso"
          type="EVOLUCIÓN"
          status={!hasData ? "alert" : groupAvg >= 3.5 ? "stable" : groupAvg >= 3 ? "improving" : "critical"}
          summary={panoramaText()}
          stats={[
            { label: "promedio", value: hasData ? groupAvg.toFixed(2) : "—", color: hasData ? (groupAvg >= 3 ? C.green : "#ef4444") : "#9CA3AF" },
            { label: "avance", value: `${evaluated.length}/${students.length}`, color: C.magenta },
          ]}
        >
          <div style={{ height: 5, background: "#141822", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: (evaluated.length / Math.max(students.length, 1)) * 100 + "%", height: "100%", background: G.accentGradient, opacity: 0.9 }} />
          </div>
        </NarrativeCard>

        <NarrativeCard
          icon="🛠"
          title="Insight pedagógico"
          type="ANÁLISIS"
          status={!hasData ? "alert" : groupAvg < 3 ? "critical" : groupAvg < 3.5 ? "improving" : "stable"}
          summary={pedagogicText()}
          stats={[
            { label: "estado", value: hasData ? (groupAvg >= 3.5 ? "alto" : groupAvg >= 3 ? "medio" : "bajo") : "—", color: hasData ? (groupAvg >= 3 ? C.green : "#ef4444") : "#9CA3AF" },
            { label: "acciones", value: pedagogicPoints().length, color: C.orange },
          ]}
        >
          {pedagogicPoints().length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {pedagogicPoints().map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: C.magenta, fontSize: 11, lineHeight: 1 }}>•</span>
                  <span style={{ fontSize: 11, color: "#b7c0ce", lineHeight: 1.45 }}>{pt}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-minimal" style={{ textAlign: "center", color: "#8b95a5", fontSize: 11, padding: "12px 8px" }}>Sin recomendaciones activas.</div>
          )}
        </NarrativeCard>
      </div>
    </div>
  );
}
