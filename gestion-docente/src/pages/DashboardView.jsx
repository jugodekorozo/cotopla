import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { C } from "../constants/constants";
import { scaleColor } from "../utils/utils";
import { Btn } from "../components/Btn";
import { ExploreDataPanel } from "../components/ExploreDataPanel";
import { CourseNarrativePanel } from "../components/CourseNarrativePanel";
import { DashboardInsights } from "../components/DashboardInsights";

export function DashboardView({
  evaluated, isMobile, encargos, avgByEnc, globalCritAvg, allFinals, ranking, atRisk,
  course, students, groupAvg,
  notesByEncargo, T,
  onNavigateProfile,
  onDownload,
}) {
  const TT = T || {
    tooltipBg: "#1a1a1a",
    tooltipText: "#f3f4f6",
    border: "#4b5563",
    textSoft: "#d4d4d4",
    textMuted: "#9a9a9a",
    gridLine: "rgba(255,255,255,0.16)",
  };
  const [showExplore, setShowExplore] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);
  const [drillDown, setDrillDown] = useState(null); // { type:'enc', id } | { type:'dist', grade }

  function handleEncClick(data) {
    if (!data || !data.id) return;
    setDrillDown(prev =>
      prev && prev.type === "enc" && prev.id === data.id ? null : { type: "enc", id: data.id }
    );
  }

  function handleDistClick(payload) {
    if (!payload || !payload.activePayload || !payload.activePayload.length) return;
    const grade = parseInt(payload.activePayload[0].payload.range);
    setDrillDown(prev =>
      prev && prev.type === "dist" && prev.grade === grade ? null : { type: "dist", grade }
    );
  }

  /* ── Drill-down rows ── */
  let drillRows = [];
  let drillTitle = "";
  if (drillDown) {
    if (drillDown.type === "enc") {
      const enc = encargos.find(e => e.id === drillDown.id);
      drillTitle = enc ? `Notas en "${enc.nombre}"` : "Encargo";
      drillRows = (notesByEncargo && notesByEncargo[drillDown.id]) || [];
    } else if (drillDown.type === "dist") {
      drillTitle = `Estudiantes con nota ${drillDown.grade}`;
      drillRows = ranking
        .filter(s => Math.round(s.final) === drillDown.grade)
        .map(s => ({ id: s.id, name: s.name, note: s.final }));
    }
  }

  const encChartData = encargos.map(e => ({
    name: e.nombre.length > 14 ? e.nombre.slice(0, 14) + "…" : e.nombre,
    id: e.id,
    avg: +((avgByEnc[e.id] || 0).toFixed(2)),
  }));

  if (!evaluated.length) {
    return (
      <div style={{ padding: "0 24px 24px", flex: 1 }}>
        <DashboardInsights
          encargos={encargos} avgByEnc={avgByEnc} globalCritAvg={globalCritAvg}
          atRisk={atRisk} groupAvg={groupAvg} evaluated={evaluated}
        />
        <div className="glass-card edge-light" style={{ background: "transparent", borderRadius: 12, padding: 24, textAlign: "center", color: "#a8a8a8" }}>Sin evaluaciones completas.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px 20px", flex: 1 }}>
      {/* Insights strip */}
      <DashboardInsights
        encargos={encargos} avgByEnc={avgByEnc} globalCritAvg={globalCritAvg}
        atRisk={atRisk} groupAvg={groupAvg} evaluated={evaluated}
      />

      {/* Charts grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>

        {/* Promedio por encargo — clickable */}
        <div className={`glass-card glass-hover edge-light${drillDown && drillDown.type === "enc" ? " edge-light-active" : ""}`} style={{ background: "transparent", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.magenta, marginBottom: 1 }}>Promedio por encargo</div>
          <div style={{ fontSize: 10, color: TT.textMuted, marginBottom: 4 }}>Clic en una barra para ver detalle</div>
          <ResponsiveContainer width="100%" height={Math.max(160, encargos.length * 28)}>
            <BarChart data={encChartData} layout="vertical">
              <defs>
                <linearGradient id="encAvgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e7027c" />
                  <stop offset="100%" stopColor="#a11763" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={TT.gridLine} />
              <XAxis type="number" domain={[0, 5]} tick={{ fill: C.gray, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: C.gray, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: TT.tooltipBg, border: "1px solid " + TT.border, color: TT.tooltipText }} />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]} onClick={handleEncClick} style={{ cursor: "pointer" }}>
                {encChartData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={drillDown && drillDown.type === "enc" && drillDown.id === entry.id ? "#fff" : "url(#encAvgGrad)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Promedio por criterio */}
        <div className="glass-card glass-hover edge-light" style={{ background: "transparent", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.magenta, marginBottom: 4 }}>Promedio por criterio</div>
          <ResponsiveContainer width="100%" height={Math.max(140, Object.keys(globalCritAvg).length * 30)}>
            <BarChart data={Object.entries(globalCritAvg).map(p => ({ name: p[0], avg: +(p[1].toFixed(2)) }))} layout="vertical">
              <defs>
                <linearGradient id="critAvgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f6b64f" />
                  <stop offset="100%" stopColor="#f2992e" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={TT.gridLine} />
              <XAxis type="number" domain={[0, 5]} tick={{ fill: C.gray, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fill: C.gray, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: TT.tooltipBg, border: "1px solid " + TT.border, color: TT.tooltipText }} />
              <Bar dataKey="avg" fill="url(#critAvgGrad)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de notas — clickable */}
        <div className={`glass-card glass-hover edge-light${drillDown && drillDown.type === "dist" ? " edge-light-active" : ""}`} style={{ background: "transparent", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 1, color: C.orange }}>Distribución de notas</div>
          <div style={{ fontSize: 10, color: TT.textMuted, marginBottom: 4 }}>Clic en una barra para ver quiénes</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={[1, 2, 3, 4, 5].map(v => ({ range: "" + v, count: allFinals.filter(x => Math.round(x) === v).length }))}
              onClick={handleDistClick}
              style={{ cursor: "pointer" }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={TT.gridLine} />
              <XAxis dataKey="range" tick={{ fill: C.gray, fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: C.gray, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: TT.tooltipBg, border: "1px solid " + TT.border, color: TT.tooltipText }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {[1, 2, 3, 4, 5].map((v, i) => {
                  const base = ["#f2992e", "#f4aa2f", "#eab308", "#96b92f", C.green][i];
                  const selected = drillDown && drillDown.type === "dist" && drillDown.grade === v;
                  return <Cell key={i} fill={selected ? "#fff" : base} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking */}
        <div className="glass-card glass-hover edge-light" style={{ background: "transparent", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.magenta, marginBottom: 6 }}>Ranking</div>
          <div style={{ maxHeight: 140, overflowY: "auto", marginBottom: 6 }}>
            {ranking.map((s, i) => (
              <div key={s.id} onClick={() => onNavigateProfile(s.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, cursor: "pointer", background: i === 0 ? "#1a0a2a" : "transparent" }}>
                <span style={{ fontWeight: 700, color: i < 3 ? C.orange : TT.textMuted, width: 20, textAlign: "right", fontSize: 12 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 11 }}>{s.name}</span>
                <span style={{ fontWeight: 700, fontSize: 12, color: s.final >= 3 ? C.green : "#ef4444" }}>{s.final.toFixed(2)}</span>
              </div>
            ))}
          </div>
          {atRisk.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>Alertas</div>
              {atRisk.map(s => <div key={s.id} style={{ fontSize: 11, color: "#ef4444", padding: "2px 0" }}>⚠ {s.name} — {s.final.toFixed(2)}</div>)}
            </>
          )}
        </div>
      </div>

      {/* Drill-down detail panel */}
      {drillDown && (
        <div className="glass-card edge-light" style={{ background: "transparent", borderRadius: 12, padding: 10, marginTop: 8, borderTop: "2px solid " + C.magenta }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.magenta }}>{drillTitle}</span>
            <button
              onClick={() => setDrillDown(null)}
              style={{
                background: "none", border: "1px solid #4b5563", borderRadius: 6,
                color: "#d5d5d5", fontSize: 11, padding: "3px 10px",
                cursor: "pointer", fontFamily: "'Roboto',sans-serif",
              }}
            >
              Cerrar detalle
            </button>
          </div>
          {drillRows.length === 0 ? (
            <div style={{ color: "#a8a8a8", fontSize: 12 }}>Sin estudiantes en este rango.</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {drillRows.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => onNavigateProfile(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 12px", borderRadius: 8,
                    background: "#0f0f0f", border: "1px solid #1e1e1e",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#aaa" }}>{i + 1}. {s.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: scaleColor(s.note) }}>
                    {s.note.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Btn small color={C.magenta} onClick={onDownload}>Descargar reporte del dashboard</Btn>
        <button
          onClick={() => setShowExplore(p => !p)}
          style={{
            padding: "5px 12px", borderRadius: 8, border: "1px solid #2e2e2e",
            background: showExplore ? "#1a1a1a" : "transparent",
            color: showExplore ? "#ccc" : "#555",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Roboto',sans-serif",
          }}
        >
          {showExplore ? "Ocultar exploración" : "Explorar datos"}
        </button>
        <button
          onClick={() => setShowNarrative(p => !p)}
          style={{
            padding: "5px 12px", borderRadius: 8, border: "1px solid #2e2e2e",
            background: showNarrative ? "#1a1a1a" : "transparent",
            color: showNarrative ? "#ccc" : "#555",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Roboto',sans-serif",
          }}
        >
          {showNarrative ? "Cerrar narrativa" : "Narrativa del curso"}
        </button>
      </div>

      {/* Explore panel */}
      {showExplore && (
        <div className="panel-minimal" style={{ marginTop: 8 }}>
          <ExploreDataPanel
            encargos={encargos}
            avgByEnc={avgByEnc}
            globalCritAvg={globalCritAvg}
            allFinals={allFinals}
          />
        </div>
      )}

      {/* Narrative panel */}
      {showNarrative && (
        <div className="panel-minimal" style={{ marginTop: 8 }}>
          <CourseNarrativePanel
            course={course}
            students={students}
            evaluated={evaluated}
            ranking={ranking}
            atRisk={atRisk}
            avgByEnc={avgByEnc}
            globalCritAvg={globalCritAvg}
            groupAvg={groupAvg}
            encargos={encargos}
          />
        </div>
      )}
    </div>
  );
}
