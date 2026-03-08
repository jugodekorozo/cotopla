import { useMemo, useRef, useState } from "react";
import { C } from "../constants/constants";
import { calcEncargoNote, scaleColor } from "../utils/utils";
import { Btn } from "../components/Btn";
import { colors, spacing, typography } from "../design";
import {
  getGeneralReading,
  getEncargoReading,
  getCriteriaReading,
  getRiskReading,
  getPedagogicRecommendation,
} from "../utils/narrativa";
import { mean, stdDev, clamp } from "../utils/mathUtils";

const DOC = {
  shell: colors.neutral.bgDark,
  paper: colors.neutral.surface,
  line: colors.neutral.border,
  text: colors.neutral.textSecondary,
  muted: colors.neutral.textMuted,
  serif: typography.family.serif,
  sans: typography.family.sans,
};

function SectionTitle({ n, title, subtitle }) {
  return (
    <header style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: DOC.sans, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#a0a6b5", marginBottom: 4 }}>
        {n}. {subtitle}
      </div>
      <h2 style={{ fontFamily: DOC.sans, fontSize: 19, fontWeight: 700, color: "#f2f4f8", margin: 0 }}>{title}</h2>
    </header>
  );
}

function BodyText({ children, style }) {
  return (
    <p style={{ fontFamily: DOC.serif, fontSize: 17, lineHeight: 1.72, color: DOC.text, margin: "0 0 10px", ...style }}>
      {children}
    </p>
  );
}

function FigureBlock({ id, number, title, caption, reading, active, onHover, children }) {
  return (
    <figure
      id={id}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className="interactive-card"
      style={{
        margin: "0 0 14px",
        padding: 12,
        borderRadius: 10,
        border: active ? "1px solid rgba(231,2,124,0.45)" : "1px solid " + DOC.line,
        background: "#17171b",
        boxShadow: active ? "0 0 0 1px rgba(231,2,124,0.24), 0 10px 26px rgba(0,0,0,0.35)" : "0 6px 20px rgba(0,0,0,0.25)",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
      }}
    >
      <figcaption style={{ fontFamily: DOC.sans, fontSize: 12, color: "#b5b9c4", marginBottom: 8 }}>
        <strong>Figura {number}.</strong> {title}
      </figcaption>
      {children}
      <figcaption style={{ fontFamily: DOC.serif, fontSize: 13, color: DOC.muted, marginTop: 8 }}>{caption}</figcaption>
      <div style={{ marginTop: 6, fontFamily: DOC.serif, fontSize: 14, color: "#cfd4df", lineHeight: 1.58 }}>
        <strong style={{ fontFamily: DOC.sans, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#9ea7b8" }}>Lectura:</strong> {reading}
      </div>
    </figure>
  );
}

function DistributionFigure({ rows, hoverId, setHoverId }) {
  const W = 640;
  const H = 180;
  const padX = 40;
  const axisY = H / 2;
  const innerW = W - padX * 2;

  const points = rows.map((s, i) => {
    const x = padX + (s.final / 5) * innerW;
    const band = Math.floor(s.final * 4) / 4;
    const y = axisY + ((i % 9) - 4) * 7 + (band % 0.5 === 0 ? -2 : 2);
    return { ...s, x, y };
  });

  const hovered = rows.find(x => x.id === hoverId) || null;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        <line x1={padX} y1={axisY} x2={W - padX} y2={axisY} stroke="#343741" strokeWidth={1} />
        {[0, 1, 2, 3, 4, 5].map(v => {
          const x = padX + (v / 5) * innerW;
          return (
            <g key={v}>
              <line x1={x} y1={axisY - 5} x2={x} y2={axisY + 5} stroke="#3e414c" strokeWidth={1} />
              <text x={x} y={H - 10} textAnchor="middle" fill="#9ea3b0" fontSize={10} fontFamily={DOC.sans}>{v}</text>
            </g>
          );
        })}
        {points.map(p => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={hoverId === p.id ? 6 : 4.6}
            fill={scaleColor(p.final)}
            fillOpacity={0.82}
            stroke={hoverId === p.id ? "#fff" : "transparent"}
            strokeWidth={1.2}
            onMouseEnter={() => setHoverId(p.id)}
            onMouseLeave={() => setHoverId(null)}
            style={{ cursor: "pointer", transition: "r 160ms ease" }}
          />
        ))}
      </svg>
      <div style={{ minHeight: 20, fontFamily: DOC.sans, fontSize: 11, color: "#c5cbda", marginTop: 2 }}>
        {hovered ? `${hovered.name} · ${hovered.final.toFixed(2)}` : "Hover en un punto para ver detalle del estudiante."}
      </div>
    </div>
  );
}

function EncargoLollipopFigure({ rows, hoverId, setHoverId }) {
  const hovered = rows.find(x => x.id === hoverId) || null;
  return (
    <div>
      <div>
        {rows.map((r, idx) => {
          const pct = (r.value / 5) * 100;
          const active = hoverId === r.id;
          return (
            <div
              key={r.id}
              onMouseEnter={() => setHoverId(r.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{ display: "grid", gridTemplateColumns: "1fr 210px 46px", alignItems: "center", gap: 8, marginBottom: 6, opacity: hoverId && !active ? 0.58 : 1, transition: "opacity 180ms ease" }}
            >
              <span style={{ fontFamily: DOC.serif, fontSize: 14, color: DOC.text }}>{idx + 1}. {r.label}</span>
              <div style={{ position: "relative", height: 8, background: "#2e3038", borderRadius: 4 }}>
                <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(120deg,#e7027c,#a11763)", borderRadius: 4 }} />
                <div style={{ position: "absolute", left: `calc(${pct}% - 6px)`, top: -3, width: 14, height: 14, borderRadius: "50%", background: active ? "#fff" : "#d0d4df", border: "2px solid #1b1d22", transition: "background 160ms ease" }} />
              </div>
              <span style={{ fontFamily: DOC.sans, fontSize: 12, fontWeight: 700, color: C.magenta, textAlign: "right" }}>{r.value.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div style={{ minHeight: 20, fontFamily: DOC.sans, fontSize: 11, color: "#c5cbda", marginTop: 2 }}>
        {hovered ? `${hovered.label} · Promedio ${hovered.value.toFixed(2)} · Peso ${hovered.weight}%` : "Hover en un nodo para ver detalle del encargo."}
      </div>
    </div>
  );
}

function CriteriaFigure({ rows, hoverLabel, setHoverLabel }) {
  if (!rows.length) {
    return <div style={{ fontFamily: DOC.sans, fontSize: 12, color: DOC.muted }}>No hay criterios evaluados.</div>;
  }

  const best = rows[0];
  const weak = rows[rows.length - 1];
  const hovered = rows.find(r => r.label === hoverLabel) || null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 6 }}>
        {rows.map(r => {
          const active = hoverLabel === r.label;
          const tag = r.label === best.label ? "Fuerte" : r.label === weak.label ? "Débil" : "";
          return (
            <div
              key={r.label}
              onMouseEnter={() => setHoverLabel(r.label)}
              onMouseLeave={() => setHoverLabel(null)}
              style={{
                border: "1px solid " + (active ? "#5a606f" : "#30323a"),
                borderRadius: 8,
                padding: "8px 9px",
                background: active ? "#1f222a" : "#191b22",
                transition: "background 180ms ease, border-color 180ms ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: DOC.serif, fontSize: 14, color: DOC.text }}>{r.label}</div>
                {tag && (
                  <span style={{ fontFamily: DOC.sans, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: tag === "Fuerte" ? C.green : "#ef4444" }}>{tag}</span>
                )}
              </div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 7, background: "#2f333d", borderRadius: 4 }}>
                  <div style={{ width: (r.value / 5) * 100 + "%", height: "100%", background: "#f2992e", borderRadius: 4 }} />
                </div>
                <span style={{ fontFamily: DOC.sans, fontSize: 12, fontWeight: 700, color: "#f2992e" }}>{r.value.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ minHeight: 20, fontFamily: DOC.sans, fontSize: 11, color: "#c5cbda", marginTop: 4 }}>
        {hovered ? `${hovered.label} · Promedio ${hovered.value.toFixed(2)}` : `Criterio más fuerte: ${best.label} (${best.value.toFixed(2)}) · más débil: ${weak.label} (${weak.value.toFixed(2)}).`}
      </div>
    </div>
  );
}

function StudentMapFigure({ rows, hoverId, setHoverId, onOpenProfile }) {
  const W = 640;
  const H = 260;
  const pad = 36;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;

  function toX(v) { return pad + (v / 5) * innerW; }
  function toY(v) { return H - pad - (v / 5) * innerH; }

  const hovered = rows.find(x => x.id === hoverId) || null;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        <rect x={pad} y={pad} width={innerW} height={innerH} fill="#14161b" stroke="#30323a" strokeWidth={1} />
        <line x1={toX(3)} y1={pad} x2={toX(3)} y2={H - pad} stroke="#3f424d" strokeDasharray="4 4" />
        <line x1={pad} y1={toY(3)} x2={W - pad} y2={toY(3)} stroke="#3f424d" strokeDasharray="4 4" />

        {[0, 1, 2, 3, 4, 5].map(v => (
          <g key={v}>
            <text x={toX(v)} y={H - 10} textAnchor="middle" fill="#969dac" fontSize={9} fontFamily={DOC.sans}>{v}</text>
            <text x={14} y={toY(v) + 3} textAnchor="middle" fill="#969dac" fontSize={9} fontFamily={DOC.sans}>{v}</text>
          </g>
        ))}

        {rows.map(r => (
          <circle
            key={r.id}
            cx={toX(r.consistency)}
            cy={toY(r.quality)}
            r={hoverId === r.id ? 6 : 4.8}
            fill={r.quality >= 3 ? C.green : "#ef4444"}
            fillOpacity={0.82}
            stroke={hoverId === r.id ? "#fff" : "transparent"}
            strokeWidth={1.3}
            onMouseEnter={() => setHoverId(r.id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => onOpenProfile && onOpenProfile(r.id)}
            style={{ cursor: onOpenProfile ? "pointer" : "default", transition: "r 170ms ease" }}
          />
        ))}

        <text x={W / 2} y={H - 2} textAnchor="middle" fill="#a5acba" fontSize={10} fontFamily={DOC.sans}>Consistencia (0–5)</text>
        <text x={10} y={H / 2} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle" fill="#a5acba" fontSize={10} fontFamily={DOC.sans}>Calidad promedio (0–5)</text>
      </svg>

      <div style={{ minHeight: 20, fontFamily: DOC.sans, fontSize: 11, color: "#c5cbda", marginTop: 4 }}>
        {hovered
          ? `${hovered.name} · Calidad ${hovered.quality.toFixed(2)} · Consistencia ${hovered.consistency.toFixed(2)}${onOpenProfile ? " · click para perfil" : ""}`
          : "Cuadrantes: superior derecho = alto rendimiento estable; inferior izquierdo = riesgo pedagógico."}
      </div>
    </div>
  );
}

function ProgressFigure({ rows, totalStudents, hoverId, setHoverId }) {
  const hovered = rows.find(r => r.id === hoverId) || null;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8 }}>
        {rows.map((r, idx) => (
          <div
            key={r.id}
            onMouseEnter={() => setHoverId(r.id)}
            onMouseLeave={() => setHoverId(null)}
            style={{
              border: "1px solid " + (hoverId === r.id ? "rgba(231,2,124,0.45)" : "#2f3139"),
              background: "#16171c",
              borderRadius: 8,
              padding: 8,
              transition: "border-color 180ms ease, transform 180ms ease",
              transform: hoverId === r.id ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            <div style={{ fontFamily: DOC.sans, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#98a0b1", marginBottom: 4 }}>
              Encargo {idx + 1}
            </div>
            <div style={{ fontFamily: DOC.serif, fontSize: 14, color: DOC.text, marginBottom: 6 }}>{r.name}</div>
            <div style={{ height: 7, background: "#2a2d36", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
              <div style={{ width: r.progress + "%", height: "100%", background: r.progress >= 70 ? "linear-gradient(120deg,#f2992e,#6eb42c)" : "linear-gradient(120deg,#e7027c,#f2992e)", borderRadius: 4, transition: "width 220ms ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: DOC.sans, fontSize: 11 }}>
              <span style={{ color: "#c6cddd" }}>{r.completed}/{totalStudents}</span>
              <span style={{ color: r.progress >= 70 ? C.green : C.orange, fontWeight: 700 }}>{r.progress.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ minHeight: 20, fontFamily: DOC.sans, fontSize: 11, color: "#c5cbda", marginTop: 4 }}>
        {hovered
          ? `${hovered.name} · ${hovered.completed}/${totalStudents} evaluados · Promedio ${hovered.avg.toFixed(2)}`
          : "Hover en un módulo para ver avance del encargo y su promedio actual."}
      </div>
    </div>
  );
}

export function ReportView({
  evaluated, course, selCorte, students, encargos,
  avgByEnc, globalCritAvg, groupAvg, atRisk, ranking,
  grades,
  onOpenProfile,
  onDownload,
}) {
  const [activeFigure, setActiveFigure] = useState(null);
  const [hoverDistId, setHoverDistId] = useState(null);
  const [hoverEncId, setHoverEncId] = useState(null);
  const [hoverCritLabel, setHoverCritLabel] = useState(null);
  const [hoverMapId, setHoverMapId] = useState(null);
  const [hoverProgId, setHoverProgId] = useState(null);

  const fig1Ref = useRef(null);
  const fig2Ref = useRef(null);
  const fig3Ref = useRef(null);
  const fig4Ref = useRef(null);
  const fig5Ref = useRef(null);

  const date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

  const generalReading = getGeneralReading(groupAvg, evaluated, students, atRisk);
  const encargoReading = getEncargoReading(encargos, avgByEnc);
  const criteriaReading = getCriteriaReading(globalCritAvg);
  const riskReading = getRiskReading(atRisk, evaluated);
  const { rec, actions } = getPedagogicRecommendation(groupAvg, atRisk, evaluated, encargos, avgByEnc);

  const encRows = useMemo(
    () => encargos
      .map(e => ({ id: e.id, label: e.nombre, value: avgByEnc[e.id] || 0, weight: e.porcentaje }))
      .sort((a, b) => b.value - a.value),
    [encargos, avgByEnc]
  );

  const critRows = useMemo(
    () => Object.entries(globalCritAvg)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    [globalCritAvg]
  );

  const mapRows = useMemo(() => {
    return ranking.map(s => {
      const notes = encargos.map(enc => calcEncargoNote(grades[s.id] && grades[s.id][enc.id], enc.criterios)).filter(v => v > 0);
      const q = notes.length ? mean(notes) : s.final;
      const consistency = clamp(5 - stdDev(notes) * 1.6, 0, 5);
      return { id: s.id, name: s.name, quality: q, consistency, final: s.final };
    });
  }, [ranking, encargos, grades]);

  const progressRows = useMemo(() => {
    return encargos.map(enc => {
      const completed = students.filter(st => {
        const g = grades[st.id] && grades[st.id][enc.id];
        if (!g || !enc.criterios.length) return false;
        return enc.criterios.every(cr => g[cr.id] >= 1);
      }).length;
      const progress = students.length ? (completed / students.length) * 100 : 0;
      return {
        id: enc.id,
        name: enc.nombre,
        completed,
        progress,
        avg: avgByEnc[enc.id] || 0,
      };
    });
  }, [encargos, students, grades, avgByEnc]);

  const progressGlobal = useMemo(() => {
    if (!progressRows.length) return 0;
    return mean(progressRows.map(r => r.progress));
  }, [progressRows]);

  const fig1Reading = useMemo(() => {
    if (!ranking.length) return "Sin distribución disponible.";
    const highs = ranking.filter(s => s.final >= 4).length;
    const lows = ranking.filter(s => s.final < 3).length;
    return `Concentración principal en rango medio (${groupAvg.toFixed(2)}). Altos: ${highs}; en riesgo: ${lows}.`;
  }, [ranking, groupAvg]);

  const fig4Reading = useMemo(() => {
    if (!mapRows.length) return "Sin datos suficientes para mapa de estudiantes.";
    const highStable = mapRows.filter(r => r.quality >= 3 && r.consistency >= 3).length;
    const potential = mapRows.filter(r => r.quality >= 3 && r.consistency < 3).length;
    const risk = mapRows.filter(r => r.quality < 3 && r.consistency < 3).length;
    return `Predomina el cuadrante de alto rendimiento estable (${highStable}). Potencial irregular: ${potential}. Riesgo: ${risk}.`;
  }, [mapRows]);

  const fig5Reading = useMemo(() => {
    if (!progressRows.length) return "No hay encargos configurados para medir ritmo de evaluación.";
    const done = progressRows.filter(r => r.progress >= 95).length;
    const pending = progressRows.filter(r => r.progress < 50).length;
    return `Avance global del corte: ${progressGlobal.toFixed(0)}%. Encargos completos: ${done}; rezagados: ${pending}.`;
  }, [progressRows, progressGlobal]);

  const findings = useMemo(() => {
    const bestEnc = encRows[0];
    const weakCrit = critRows[critRows.length - 1];
    return [
      {
        key: "fig1",
        label: "Desempeño general",
        value: groupAvg.toFixed(2),
        note: `${evaluated.length}/${students.length} evaluados en el corte.`,
      },
      {
        key: "fig2",
        label: "Mejor encargo",
        value: bestEnc ? bestEnc.value.toFixed(2) : "—",
        note: bestEnc ? `${bestEnc.label} lidera el rendimiento actual.` : "Sin encargos con datos.",
      },
      {
        key: "fig3",
        label: "Criterio a reforzar",
        value: weakCrit ? weakCrit.value.toFixed(2) : "—",
        note: weakCrit ? `${weakCrit.label} requiere acompañamiento.` : "No hay criterios consolidados.",
      },
      {
        key: "fig5",
        label: "Ritmo de evaluación",
        value: `${progressGlobal.toFixed(0)}%`,
        note: `${atRisk.length} estudiantes por debajo de 3.0.`,
      },
    ];
  }, [groupAvg, evaluated.length, students.length, encRows, critRows, progressGlobal, atRisk.length]);

  function jumpToFigure(key) {
    setActiveFigure(key);
    const refMap = { fig1: fig1Ref, fig2: fig2Ref, fig3: fig3Ref, fig4: fig4Ref, fig5: fig5Ref };
    const targetRef = refMap[key];
    if (targetRef && targetRef.current) targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!evaluated.length) {
    return (
      <div style={{ padding: "0 20px 20px", flex: 1 }}>
        <div style={{ background: "#121212", borderRadius: 12, padding: 28, textAlign: "center", color: "#888" }}>
          Sin evaluaciones completas para generar el informe.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px 20px", flex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: DOC.shell, borderRadius: 12, border: "1px solid " + DOC.line }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid " + DOC.line, fontFamily: DOC.sans }}>
          <span style={{ fontSize: 12, color: "#a0a7b5", letterSpacing: 1, textTransform: "uppercase" }}>Paper interactivo editorial</span>
          <Btn small color={C.magenta} onClick={onDownload}>Descargar HTML</Btn>
        </div>

        <div style={{ padding: `${spacing[6] - 2}px ${spacing[6]}px` }}>
          <header style={{ marginBottom: 20 }}>
            <h1 style={{ fontFamily: DOC.serif, fontSize: 36, fontWeight: 700, lineHeight: 1.16, margin: "0 0 8px", color: "#f4f6fa" }}>
              Informe interactivo de análisis pedagógico
            </h1>
            <div style={{ fontFamily: DOC.serif, fontSize: 20, marginBottom: 6, color: "#d8deea" }}>{course.name}</div>
            <div style={{ fontFamily: DOC.sans, fontSize: 12, color: DOC.muted }}>
              Grupo {course.group} · Semestre {course.semester} · Corte {selCorte} · {date}
            </div>
          </header>

          <section style={{ marginBottom: 18 }}>
            <SectionTitle n="Resumen" title="Abstract" subtitle="Síntesis" />
            <BodyText>{generalReading}</BodyText>
          </section>

          <section style={{ marginBottom: 18 }}>
            <SectionTitle n={1} title="Metodología" subtitle="Base analítica" />
            <BodyText>
              El documento integra notas finales por estudiante, desempeño por encargo, promedios de criterio y avance de evaluación.
              La lectura combina estructura académica y visualización editorial para facilitar socialización con perfiles de diseño.
            </BodyText>
          </section>

          <section style={{ marginBottom: 18 }}>
            <SectionTitle n={2} title="Hallazgos clave" subtitle="Lectura ejecutiva" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 8 }}>
              {findings.map(item => (
                <button
                  key={item.key}
                  onClick={() => jumpToFigure(item.key)}
                  style={{
                    textAlign: "left",
                    border: "1px solid #3a2a34",
                    background: "#1a1519",
                    borderRadius: 9,
                    padding: "9px 10px",
                    cursor: "pointer",
                    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(231,2,124,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#3a2a34"; }}
                >
                  <div style={{ fontFamily: DOC.sans, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: C.magenta, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: DOC.sans, fontSize: 22, fontWeight: 700, color: "#f0f2f8", lineHeight: 1, marginBottom: 5 }}>{item.value}</div>
                  <div style={{ fontFamily: DOC.serif, fontSize: 13, color: "#ccd1dd", lineHeight: 1.45 }}>{item.note}</div>
                </button>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 18 }}>
            <SectionTitle n={3} title="Figuras" subtitle="Análisis visual" />

            <div ref={fig1Ref}>
              <FigureBlock
                id="fig1"
                number={1}
                title="Distribución del desempeño del grupo"
                caption="Figura 1. Distribución del desempeño del grupo."
                reading={fig1Reading}
                active={activeFigure === "fig1"}
                onHover={setActiveFigure}
              >
                <DistributionFigure rows={ranking} hoverId={hoverDistId} setHoverId={setHoverDistId} />
              </FigureBlock>
            </div>

            <div ref={fig2Ref}>
              <FigureBlock
                id="fig2"
                number={2}
                title="Promedio por encargo"
                caption="Figura 2. Promedio de desempeño por encargo."
                reading={encargoReading}
                active={activeFigure === "fig2"}
                onHover={setActiveFigure}
              >
                <EncargoLollipopFigure rows={encRows} hoverId={hoverEncId} setHoverId={setHoverEncId} />
              </FigureBlock>
            </div>

            <div ref={fig3Ref}>
              <FigureBlock
                id="fig3"
                number={3}
                title="Anatomía de la rúbrica"
                caption="Figura 3. Desempeño promedio por criterio de la rúbrica."
                reading={criteriaReading}
                active={activeFigure === "fig3"}
                onHover={setActiveFigure}
              >
                <CriteriaFigure rows={critRows} hoverLabel={hoverCritLabel} setHoverLabel={setHoverCritLabel} />
              </FigureBlock>
            </div>

            <div ref={fig4Ref}>
              <FigureBlock
                id="fig4"
                number={4}
                title="Mapa de estudiantes"
                caption="Figura 4. Distribución del grupo según consistencia y calidad promedio."
                reading={fig4Reading}
                active={activeFigure === "fig4"}
                onHover={setActiveFigure}
              >
                <StudentMapFigure rows={mapRows} hoverId={hoverMapId} setHoverId={setHoverMapId} onOpenProfile={onOpenProfile} />
              </FigureBlock>
            </div>

            <div ref={fig5Ref}>
              <FigureBlock
                id="fig5"
                number={5}
                title="Ritmo de evaluación"
                caption="Figura 5. Progreso del proceso de evaluación."
                reading={fig5Reading}
                active={activeFigure === "fig5"}
                onHover={setActiveFigure}
              >
                <ProgressFigure rows={progressRows} totalStudents={students.length} hoverId={hoverProgId} setHoverId={setHoverProgId} />
              </FigureBlock>
            </div>
          </section>

          <section style={{ marginBottom: 18 }}>
            <SectionTitle n={4} title="Discusión" subtitle="Interpretación" />
            <BodyText>{encargoReading}</BodyText>
            <BodyText>{criteriaReading}</BodyText>
            <BodyText>{riskReading}</BodyText>
          </section>

          <section style={{ marginBottom: 8 }}>
            <SectionTitle n={5} title="Conclusión / recomendación" subtitle="Cierre" />
            <BodyText style={{ fontStyle: "italic" }}>{rec}</BodyText>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {actions.map((a, i) => (
                <li key={i} style={{ fontFamily: DOC.serif, fontSize: 16, lineHeight: 1.65, color: DOC.text, marginBottom: 6 }}>
                  {a}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
