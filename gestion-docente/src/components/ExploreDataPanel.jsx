import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";
import { C } from "../constants/constants";
import { heatColor, jitter, statusTag } from "../utils/colorUtils";

function CardModule({ icon, title, type, status, children, stats, insight }) {
  const st = statusTag(status);
  return (
    <div className="glass-card edge-light interactive-card" style={{ background: "transparent", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 10, color: "#8b95a5", textTransform: "uppercase", letterSpacing: 1.1 }}>{type}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e8edf7" }}>{title}</div>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: st.color }}>{st.label}</span>
      </div>

      <div style={{ marginBottom: 10 }}>{children}</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {stats.map((s, i) => (
          <div key={i} className="panel-minimal" style={{ padding: "6px 8px", minWidth: 92, flex: "1 1 92px" }}>
            <div style={{ fontSize: 10, color: "#8b95a5", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: s.color || "#FFFFFF" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#a9b3c3", lineHeight: 1.45 }}>{insight}</div>
    </div>
  );
}

function StripPlot({ values }) {
  const W = 420;
  const H = 88;
  const PX = 22;
  const plotW = W - PX * 2;
  const midY = H / 2;
  const ticks = [0, 1, 2, 3, 4, 5];

  function xPos(v) { return PX + (v / 5) * plotW; }

  const mean = values.reduce((a, b) => a + b, 0) / values.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <line x1={PX} y1={midY} x2={W - PX} y2={midY} stroke="#252525" strokeWidth={1} />
      <line
        x1={xPos(mean)} y1={midY - 22}
        x2={xPos(mean)} y2={midY + 22}
        stroke="#444" strokeWidth={1} strokeDasharray="3 3"
      />
      <text x={xPos(mean)} y={14} textAnchor="middle" fill="#5f6b7c" fontSize={8} fontFamily="'Roboto',sans-serif">
        x̄ {mean.toFixed(2)}
      </text>

      {ticks.map(t => (
        <g key={t}>
          <line x1={xPos(t)} y1={midY - 3} x2={xPos(t)} y2={midY + 3} stroke="#2e2e2e" strokeWidth={1} />
          <text x={xPos(t)} y={H - 4} textAnchor="middle" fill="#5f6b7c" fontSize={8} fontFamily="'Roboto',sans-serif">{t}</text>
        </g>
      ))}

      {values.map((v, i) => {
        const x = xPos(v);
        const y = midY + jitter(i, 28);
        const color = heatColor(v);
        return (
          <circle key={i} cx={x} cy={y} r={4.5}
            fill={color} fillOpacity={0.65}
            stroke={color} strokeOpacity={0.25} strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}

export function ExploreDataPanel({ encargos, avgByEnc, globalCritAvg, allFinals }) {
  const hasData = allFinals && allFinals.length > 0;
  const hasEnc = encargos && encargos.length >= 3;
  const hasCrit = globalCritAvg && Object.keys(globalCritAvg).length > 0;

  const radarData = (encargos || []).map(e => ({
    subject: e.nombre.length > 15 ? e.nombre.slice(0, 15) + "…" : e.nombre,
    value: +(avgByEnc[e.id] || 0).toFixed(2),
    fullMark: 5,
  }));

  const heatRows = Object.entries(globalCritAvg || {})
    .map(([name, val]) => ({ name, val: +Number(val).toFixed(2) }))
    .sort((a, b) => b.val - a.val);

  const encMean = radarData.length
    ? radarData.reduce((s, x) => s + x.value, 0) / radarData.length
    : 0;
  const critSpread = heatRows.length
    ? heatRows[0].val - heatRows[heatRows.length - 1].val
    : 0;
  const finalsMean = hasData ? allFinals.reduce((a, b) => a + b, 0) / allFinals.length : 0;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
        <CardModule
          icon="📡"
          title="Sensor de distribución"
          type="DIAGNÓSTICO"
          status={!hasData ? "alert" : finalsMean >= 3.5 ? "stable" : finalsMean >= 3 ? "improving" : "critical"}
          stats={[
            { label: "media", value: hasData ? finalsMean.toFixed(2) : "—", color: finalsMean >= 3 ? C.green : "#ef4444" },
            { label: "muestra", value: hasData ? allFinals.length : 0, color: C.magenta },
          ]}
          insight={hasData ? "Monitorea dispersión real y estabilidad del corte." : "No hay notas finales calculadas todavía."}
        >
          {hasData ? (
            <StripPlot values={allFinals} />
          ) : (
            <div className="panel-minimal" style={{ textAlign: "center", color: "#8b95a5", fontSize: 11, padding: "18px 8px" }}>
              Sin señal suficiente.
            </div>
          )}
        </CardModule>

        <CardModule
          icon="🧭"
          title="Radar de competencias"
          type="ANÁLISIS"
          status={!hasEnc ? "alert" : encMean >= 3.5 ? "stable" : "improving"}
          stats={[
            { label: "media", value: hasEnc ? encMean.toFixed(2) : "—", color: C.magenta },
            { label: "encargos", value: encargos.length, color: C.orange },
          ]}
          insight={hasEnc ? "El perfil muestra el equilibrio entre tareas del corte." : "Se necesitan al menos 3 encargos evaluados para activar este módulo."}
        >
          {hasEnc ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData} margin={{ top: 8, right: 14, bottom: 8, left: 14 }}>
                <PolarGrid stroke="#2a2f3a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#95a0b0", fontSize: 9, fontFamily: "'Roboto',sans-serif" }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke={C.magenta} fill={C.magenta} fillOpacity={0.12} strokeWidth={1.5} dot={{ fill: C.magenta, r: 2.8, strokeWidth: 0 }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="panel-minimal" style={{ textAlign: "center", color: "#8b95a5", fontSize: 11, padding: "18px 8px" }}>
              Sin señal suficiente.
            </div>
          )}
        </CardModule>

        <CardModule
          icon="🧪"
          title="Sensor de encargos"
          type="DESEMPEÑO"
          status={!hasCrit ? "alert" : heatRows[0].val - heatRows[heatRows.length - 1].val >= 1.5 ? "alert" : "stable"}
          stats={[
            { label: "mejor", value: hasCrit ? heatRows[0].val.toFixed(1) : "—", color: C.green },
            { label: "brecha", value: hasCrit ? critSpread.toFixed(1) : "—", color: C.orange },
          ]}
          insight={hasCrit ? "La brecha revela consistencia o dispersión entre competencias." : "No hay criterios evaluados para este módulo."}
        >
          {hasCrit ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {heatRows.slice(0, 6).map(({ name, val }) => {
                const color = heatColor(val);
                const pct = (val / 5) * 100;
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ flex: "1 1 110px", fontSize: 10, color: "#9aa5b4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }} title={name}>
                      {name}
                    </span>
                    <div style={{ flex: "0 0 90px", height: 14, background: "#141822", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: color, opacity: 0.74 }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 24, textAlign: "right" }}>{val.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="panel-minimal" style={{ textAlign: "center", color: "#8b95a5", fontSize: 11, padding: "18px 8px" }}>
              Sin señal suficiente.
            </div>
          )}
        </CardModule>
      </div>
    </div>
  );
}
