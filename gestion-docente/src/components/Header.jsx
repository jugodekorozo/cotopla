import { C, G } from "../constants/constants";
import { Btn } from "./Btn";
import { useNavigate, useLocation } from "react-router-dom";
import { colors, radius, spacing, typography } from "../design";
import { useTheme } from "../contexts/ThemeContext";

const SEL_STYLE = (T) => ({
  background: T.selectBg,
  border: "1px solid " + T.border,
  borderRadius: radius.medium,
  padding: `${spacing[2] - 2}px ${spacing[3] - 2}px`,
  fontFamily: typography.family.sans,
  fontSize: typography.size.bodySmall,
  outline: "none",
  cursor: "pointer",
});

export function Header({
  courses, selCourseId, setSelCourseId, setSelStudent, setSelEncargo, setSelCorte,
  course, selCorte,
  showEncPanel, setShowEncPanel,
  showCorteEdit, setShowCorteEdit,
  exportBackup, fileInputRef,
  isMobile,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, T, toggleTheme } = useTheme();

  function navBtn(label, view) {
    const path = view === "eval" ? "/" : "/" + view;
    const active = location.pathname === path;
    return (
      <button
        key={view}
        onClick={() => navigate(path)}
        style={{
          padding: `${spacing[2] - 2}px ${spacing[3] + 1}px`, borderRadius: radius.medium, border: "none",
          cursor: "pointer", fontWeight: typography.weight.semibold, fontSize: typography.size.bodySmall,
          whiteSpace: "nowrap", fontFamily: typography.family.sans,
          background: active ? G.accentGradient : T.navBtn,
          color: active ? colors.neutral.textPrimary : T.navBtnText,
          transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
          boxShadow: active ? "0 0 0 1px rgba(231,2,124,0.28), 0 6px 16px rgba(242,153,46,0.12)" : "none",
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
          fontSize: typography.size.caption, fontWeight: typography.weight.bold, letterSpacing: 2,
          textTransform: "uppercase", color: C.magenta, lineHeight: 1,
        }}>
          Panel de evaluación
        </span>
        <span style={{
          fontSize: isMobile ? typography.size.body : typography.size.h3, fontWeight: typography.weight.bold,
          color: T.text, lineHeight: 1.2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          maxWidth: isMobile ? 180 : 280,
        }}>
          {course ? course.name : "—"}
        </span>
        {course && (
          <span style={{ fontSize: typography.size.label, color: T.textSoft, lineHeight: 1 }}>
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
        <Btn small variant="secondary" onClick={() => setShowEncPanel(!showEncPanel)}>Encargos</Btn>
        <button
          onClick={() => setShowCorteEdit(!showCorteEdit)}
          title="Editar cortes"
          style={{
            padding: `${spacing[1] + 1}px ${spacing[2] + 1}px`, borderRadius: radius.medium,
            border: "1px solid " + T.border,
            background: showCorteEdit ? T.navBtn : "transparent",
            color: T.textSoft,
            fontSize: typography.size.bodySmall, cursor: "pointer",
            fontFamily: typography.family.sans,
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

        <Btn small variant="primary" onClick={exportBackup}>Backup</Btn>
        <Btn small variant="ghost" onClick={() => fileInputRef.current && fileInputRef.current.click()}>Cargar</Btn>

        {/* Theme toggle — subtle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          style={{
            padding: `${spacing[1] + 1}px ${spacing[2] + 1}px`, borderRadius: radius.medium,
            border: "1px solid " + T.border,
            background: "transparent",
            color: T.textSoft,
            fontSize: typography.size.body, cursor: "pointer",
            fontFamily: typography.family.sans,
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
