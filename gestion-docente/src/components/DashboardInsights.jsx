import { C } from "../constants/constants";

export function DashboardInsights({ encargos, avgByEnc, globalCritAvg, atRisk, evaluated }) {
  if (!evaluated.length) {
    return (
      <div className="panel-secondary" style={{ borderRadius: 12, padding: "10px 12px", marginBottom: 10, color: "#7a818c", fontSize: 12, textAlign: "center" }}>
        Aún no hay suficiente información para generar insights.
      </div>
    );
  }

  const sortedEnc = encargos
    .filter(e => avgByEnc[e.id] != null)
    .sort((a, b) => (avgByEnc[b.id] || 0) - (avgByEnc[a.id] || 0));
  const bestEnc = sortedEnc[0];

  const critEntries = Object.entries(globalCritAvg).sort((a, b) => a[1] - b[1]);
  const worstCrit = critEntries[0];

  const insights = [];

  if (bestEnc) {
    const val = avgByEnc[bestEnc.id];
    insights.push({
      icon: "▲",
      color: val >= 4 ? C.green : val >= 3 ? "#eab308" : C.orange,
      label: "Mejor encargo",
      value: `${bestEnc.nombre} · ${val.toFixed(2)}`,
    });
  }

  if (worstCrit) {
    const val = worstCrit[1];
    insights.push({
      icon: "▼",
      color: val < 2.5 ? "#ef4444" : val < 3 ? C.orange : "#eab308",
      label: "Criterio a reforzar",
      value: `${worstCrit[0]} · ${val.toFixed(2)}`,
    });
  }

  insights.push({
    icon: atRisk.length ? "⚠" : "✓",
    color: atRisk.length ? "#ef4444" : C.green,
    label: "Estudiantes en riesgo",
    value: atRisk.length
      ? `${atRisk.length} estudiante${atRisk.length > 1 ? "s" : ""} bajo 3.0`
      : "Ninguno — todos aprobados",
  });

  return (
    <div className="panel-secondary" style={{ borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.magenta, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
        Insights del curso
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {insights.map((ins, i) => (
          <div
            key={i}
            className="edge-light interactive-card"
            style={{
              flex: "1 1 220px",
              background: "rgba(0,0,0,0.35)",
              borderRadius: 8,
              padding: "8px 10px",
              borderLeft: "3px solid " + ins.color,
            }}
          >
            <div style={{ fontSize: 10, color: "#8b95a5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
              {ins.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", lineHeight: 1.3 }}>
              <span style={{ color: ins.color, marginRight: 5 }}>{ins.icon}</span>
              {ins.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
