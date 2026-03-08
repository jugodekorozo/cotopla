import { C, G } from "../constants/constants";
import { Btn } from "./Btn";
import { useNavigate, useLocation } from "react-router-dom";

const SEL_STYLE = (T) => ({
  background: T.selectBg,
  border: "1px solid " + T.border,
  borderRadius: 8,
  padding: "6px 10px",
  fontFamily: "'Roboto',sans-serif",
  fontSize: 12,
  outline: "none",
  cursor: "pointer",
});

export function Header({
  courses, selCourseId, setSelCourseId, setSelStudent, setSelEncargo, setSelCorte,
  course, selCorte,
  showEncPanel, setShowEncPanel,
  showCorteEdit, setShowCorteEdit,
  exportBackup, fileInputRef,
  theme, T, toggleTheme, isMobile,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  function navBtn(label, view) {
    const path = view === "eval" ? "/" : "/" + view;
    const active = location.pathname === path;
    return (
      <button
        key={view}
        onClick={() => navigate(path)}
        style={{
          padding: "6px 13px", borderRadius: 8, border: "none",
          cursor: "pointer", fontWeight: 600, fontSize: 12,
          whiteSpace: "nowrap", fontFamily: "'Roboto',sans-serif",
          background: active ? G.accentGradient : T.navBtn,
          color: active ? "#fff" : T.navBtnText,
          transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
          boxShadow: active ? "0 0 0 1px rgba(231,2,124,0.28), 0 6px 16px rgba(6,182,212,0.12)" : "none",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="glass-card header-premium" style={{
      background: "transparent",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: isMobile ? "10px 16px" : "10px 28px",
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
      borderRadius: 0,
      borderLeft: "none",
      borderRight: "none",
      borderTop: "none",
    }}>

      {/* ── Left: Brand + course info ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", color: C.magenta, lineHeight: 1,
        }}>
          Panel de evaluación
        </span>
        <span style={{
          fontSize: isMobile ? 13 : 15, fontWeight: 700,
          color: T.text, lineHeight: 1.2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          maxWidth: isMobile ? 180 : 280,
        }}>
          {course ? course.name : "—"}
        </span>
        {course && (
          <span style={{ fontSize: 10, color: T.textSoft, lineHeight: 1 }}>
            Grupo {course.group} · Sem {course.semester}
          </span>
        )}
      </div>

      {/* ── Middle: Course controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <select
          value={selCourseId}
          onChange={e => { setSelCourseId(e.target.value); setSelStudent(null); setSelEncargo(null); setSelCorte(1); }}
          style={{ ...SEL_STYLE(T), color: C.green, fontWeight: 700, maxWidth: isMobile ? 150 : 200 }}
        >
          {courses.map(c => <option key={c.id} value={c.id}>{c.name} — {c.group}</option>)}
        </select>
        <select
          value={selCorte}
          onChange={e => { setSelCorte(parseInt(e.target.value)); setSelStudent(null); setSelEncargo(null); }}
          style={{ ...SEL_STYLE(T), color: C.orange, fontWeight: 600 }}
        >
          {(course && course.cortes ? course.cortes : []).map(ct => (
            <option key={ct.id} value={ct.id}>Corte {ct.id} ({ct.weight}%)</option>
          ))}
        </select>
        <Btn small color={C.orange} onClick={() => setShowEncPanel(!showEncPanel)}>Encargos</Btn>
        <button
          onClick={() => setShowCorteEdit(!showCorteEdit)}
          title="Editar cortes"
          style={{
            padding: "5px 9px", borderRadius: 8,
            border: "1px solid " + T.border,
            background: showCorteEdit ? T.navBtn : "transparent",
            color: T.textSoft,
            fontSize: 12, cursor: "pointer",
            fontFamily: "'Roboto',sans-serif",
          }}
        >⚙</button>
      </div>

      {/* ── Right: Navigation + actions + theme toggle ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
        {navBtn("Evaluar", "eval")}
        {navBtn("Dashboard", "dashboard")}
        {navBtn("Informe", "report")}
        {navBtn("Cursos", "courses")}

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: T.border, margin: "0 2px", flexShrink: 0 }} />

        <Btn small color={C.green} onClick={exportBackup}>Backup</Btn>
        <Btn small color="#888" onClick={() => fileInputRef.current && fileInputRef.current.click()}>Cargar</Btn>

        {/* Theme toggle — subtle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          style={{
            padding: "5px 9px", borderRadius: 8,
            border: "1px solid " + T.border,
            background: "transparent",
            color: T.textSoft,
            fontSize: 13, cursor: "pointer",
            fontFamily: "'Roboto',sans-serif",
            lineHeight: 1,
            transition: "border-color 0.2s",
          }}
        >
          {theme === "dark" ? "☀" : "🌙"}
        </button>
      </div>
    </div>
  );
}
