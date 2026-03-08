import { useState, useMemo, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { C, G, DEFAULT_COURSES, THEMES } from "./constants/constants";
import { uid, avg, calcEncargoNote, calcCorteNote, isFullyGraded } from "./utils/utils";
import { parseRubricJson, transformRubricJsonToEncargos } from "./utils/rubricImport";
import { useMedia } from "./hooks/useMedia";
import { downloadHTML, buildCourseReport, buildDashboardReport, buildStudentReport } from "./utils/reports";

import { Header } from "./components/Header";
import { EncargosPanel } from "./components/EncargosPanel";
import { StatsBar } from "./components/StatsBar";

import { EvalView } from "./pages/EvalView";
import { DashboardView } from "./pages/DashboardView";
import { ProfileView } from "./pages/ProfileView";
import { ReportView } from "./pages/ReportView";
import { CoursesView } from "./pages/CoursesView";
import { Input } from "./components/Input";
import { Btn } from "./components/Btn";

export default function App() {
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [selCourseId, setSelCourseId] = useState("c1");
  const [selCorte, setSelCorte] = useState(1);
  const [selStudent, setSelStudent] = useState(null);
  const [selEncargo, setSelEncargo] = useState(null);
  const [editing, setEditing] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", semester: "", group: "" });
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newSt, setNewSt] = useState({ id: "", name: "" });
  const [showCorteEdit, setShowCorteEdit] = useState(false);
  const [showEncPanel, setShowEncPanel] = useState(false);
  const [showEncForm, setShowEncForm] = useState(false);
  const [showRubricImport, setShowRubricImport] = useState(false);
  const [newEnc, setNewEnc] = useState({ nombre: "", descripcion: "", porcentaje: "" });
  const [rubricRaw, setRubricRaw] = useState("");
  const [rubricPreview, setRubricPreview] = useState(null);
  const [rubricImportError, setRubricImportError] = useState("");
  const [rubricImportSuccess, setRubricImportSuccess] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("ui-theme") || "dark");
  const T = THEMES[theme] || THEMES.dark;

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editEncId, setEditEncId] = useState(null);
  const [showCritForm, setShowCritForm] = useState(null);
  const [newCrit, setNewCrit] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useMedia("(max-width:767px)");
  const isTablet = useMedia("(min-width:768px) and (max-width:1023px)");

  /* ── Derived state ── */
  const course = courses.find(c => c.id === selCourseId) || courses[0];
  const evalKey = "corte-" + selCorte;
  const encargos = (course && course.encargos && course.encargos[evalKey]) || [];
  const students = (course && course.students) || [];
  const grades = (course && course.grades && course.grades[evalKey]) || {};
  const encTotal = encargos.reduce((s, e) => s + e.porcentaje, 0);
  const activeEnc = encargos.find(e => e.id === selEncargo) || null;
  const cortesTotal = course && course.cortes ? course.cortes.reduce((s, c) => s + c.weight, 0) : 0;

  /* ── Persistence ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("eval-dash-v4");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.courses && d.courses.length) {
          const ids = new Set(d.courses.map(c => c.id));
          setCourses([...d.courses, ...DEFAULT_COURSES.filter(c => !ids.has(c.id))]);
        }
        if (d.selCourseId) setSelCourseId(d.selCourseId);
      }
    } catch (e) { /* first run */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    setAutosaveStatus("saving");

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          "eval-dash-v4",
          JSON.stringify({ courses, selCourseId })
        );

        setAutosaveStatus("saved");
        setLastSavedAt(new Date());
      } catch {
        setAutosaveStatus("error");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [courses, selCourseId, loaded]);

  /* ── Theme CSS vars ── */
  useEffect(() => {
    localStorage.setItem("ui-theme", theme);
    const root = document.documentElement;
    root.style.setProperty("--t-bg", T.bg);
    root.style.setProperty("--t-header", T.header);
    root.style.setProperty("--g-accent", G.accentGradient);
    root.style.setProperty("--g-success", G.successGradient);
    root.style.setProperty("--g-warning", G.warningGradient);
    root.style.setProperty("--g-danger", G.dangerGradient);
    root.style.setProperty("--g-glass", G.glassGradient);
  }, [theme, T]);

  function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark");
  }

  /* ── Analytics ── */
  const evaluated = useMemo(
    () => students.filter(s => grades[s.id] && isFullyGraded(grades[s.id], encargos)),
    [students, grades, encargos]
  );
  const allFinals = useMemo(
    () => evaluated.map(s => calcCorteNote(grades[s.id], encargos)),
    [evaluated, grades, encargos]
  );
  const groupAvg = useMemo(() => avg(allFinals), [allFinals]);
  const ranking = useMemo(
    () => evaluated.map(s => ({ ...s, final: calcCorteNote(grades[s.id], encargos) })).sort((a, b) => b.final - a.final),
    [evaluated, grades, encargos]
  );
  const atRisk = useMemo(() => ranking.filter(s => s.final < 3), [ranking]);

  const avgByEnc = useMemo(() => {
    if (!evaluated.length) return {};
    const r = {};
    encargos.forEach(e => {
      r[e.id] = avg(evaluated.map(s => calcEncargoNote(grades[s.id] && grades[s.id][e.id], e.criterios)));
    });
    return r;
  }, [evaluated, grades, encargos]);

  const avgByCrit = useMemo(() => {
    if (!evaluated.length || !encargos.length) return {};
    const r = {};
    encargos.forEach(e => {
      e.criterios.forEach(cr => {
        const key = e.id + "__" + cr.id;
        const vals = evaluated.map(s => {
          const sg = grades[s.id];
          return (sg && sg[e.id] && sg[e.id][cr.id]) || 0;
        }).filter(v => v > 0);
        r[key] = avg(vals);
      });
    });
    return r;
  }, [evaluated, grades, encargos]);

  const globalCritAvg = useMemo(() => {
    if (!evaluated.length) return {};
    const byName = {};
    encargos.forEach(e => {
      e.criterios.forEach(cr => {
        if (!byName[cr.nombre]) byName[cr.nombre] = [];
        evaluated.forEach(s => {
          const v = (grades[s.id] && grades[s.id][e.id] && grades[s.id][e.id][cr.id]) || 0;
          if (v > 0) byName[cr.nombre].push(v);
        });
      });
    });
    const r = {};
    Object.entries(byName).forEach(([name, vals]) => { r[name] = avg(vals); });
    return r;
  }, [evaluated, grades, encargos]);

  const notesByEncargo = useMemo(() => {
    const r = {};
    encargos.forEach(e => {
      r[e.id] = evaluated
        .map(s => ({ id: s.id, name: s.name, note: calcEncargoNote(grades[s.id] && grades[s.id][e.id], e.criterios) }))
        .sort((a, b) => b.note - a.note);
    });
    return r;
  }, [evaluated, grades, encargos]);

  const strengths = useMemo(
    () => [...Object.entries(avgByEnc)].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => encargos.find(e => e.id === k)).filter(Boolean).map(e => e.nombre),
    [avgByEnc, encargos]
  );
  const weaknesses = useMemo(
    () => [...Object.entries(avgByEnc)].sort((a, b) => a[1] - b[1]).slice(0, 3).map(([k]) => encargos.find(e => e.id === k)).filter(Boolean).map(e => e.nombre),
    [avgByEnc, encargos]
  );

  /* ── Mutations ── */
  function updateCourse(id, fn) {
    setCourses(prev => prev.map(c => c.id === id ? fn({ ...c }) : c));
  }

  function handleSaveEncargo() {
    if (!selStudent) {
      setSaveError("Primero selecciona un estudiante.");
      return;
    }
    if (!selEncargo || !activeEnc) {
      setSaveError("Primero selecciona un encargo.");
      return;
    }
    if (activeEnc.criterios.length === 0) {
      setSaveError("Este encargo no tiene criterios de rúbrica.");
      return;
    }
    if (!activeEnc.criterios.every(cr => editing[cr.id] >= 1)) {
      setSaveError("Debes calificar todos los criterios antes de guardar.");
      return;
    }
    setSaveError("");
    const targets = selectedStudents.length > 0 ? selectedStudents : [selStudent];
    if (targets.length > 1) {
      const ok = window.confirm(`Esta evaluación se aplicará a ${targets.length} estudiantes. ¿Continuar?`);
      if (!ok) return;
    }
    updateCourse(selCourseId, c => {
      const g = { ...(c.grades || {}) };
      const ek = { ...(g[evalKey] || {}) };
      targets.forEach(sid => {
        const sg = { ...(ek[sid] || {}) };
        sg[activeEnc.id] = { ...editing };
        ek[sid] = sg;
      });
      g[evalKey] = ek;
      return { ...c, grades: g };
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    if (targets.length > 1) setSelectedStudents([]);
  }

  function toggleSelectedStudent(id) {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    if (!selStudent) {
      setSelStudent(id);
      setSelEncargo(null);
      setEditing({});
    }
  }

  function clearSelectedStudents() {
    setSelectedStudents([]);
  }

  function selectStudent(id) {
    setSaveError("");
    setSelStudent(id);
    setSelEncargo(null);
    setEditing({});
  }

  function selectEncargo(eid) {
    setSaveError("");
    setSelEncargo(eid);
    const ex = grades[selStudent] && grades[selStudent][eid];
    setEditing(ex ? { ...ex } : {});
  }

  function addCourse() {
    if (!newCourse.name) return;
    const nc = { id: uid(), name: newCourse.name, semester: parseInt(newCourse.semester) || 1, group: newCourse.group || "—", cortes: [{ id: 1, weight: 30 }, { id: 2, weight: 30 }, { id: 3, weight: 40 }], students: [], encargos: {}, grades: {} };
    setCourses(p => [...p, nc]);
    setNewCourse({ name: "", semester: "", group: "" });
    setShowCourseForm(false);
    setSelCourseId(nc.id);
  }

  function addStudent() {
    if (!newSt.id || !newSt.name) return;
    updateCourse(selCourseId, c => ({ ...c, students: [...c.students, { id: newSt.id, name: newSt.name }] }));
    setNewSt({ id: "", name: "" });
    setShowAddStudent(false);
  }

  function removeStudent(sid) {
    updateCourse(selCourseId, c => ({ ...c, students: c.students.filter(s => s.id !== sid) }));
    if (selStudent === sid) { setSelStudent(null); setSelEncargo(null); }
  }

  function updateCorteWeight(cid, w) {
    updateCourse(selCourseId, c => ({ ...c, cortes: c.cortes.map(ct => ct.id === cid ? { ...ct, weight: parseInt(w) || 0 } : ct) }));
  }
  function addCorte() {
    updateCourse(selCourseId, c => {
      const nid = c.cortes.length ? Math.max(...c.cortes.map(x => x.id)) + 1 : 1;
      return { ...c, cortes: [...c.cortes, { id: nid, weight: 0 }] };
    });
  }
  function removeCorte(cid) {
    updateCourse(selCourseId, c => ({ ...c, cortes: c.cortes.filter(x => x.id !== cid) }));
  }

  function addEncargo() {
    if (!newEnc.nombre) return;
    const enc = { id: uid(), nombre: newEnc.nombre, descripcion: newEnc.descripcion, porcentaje: parseInt(newEnc.porcentaje) || 0, criterios: [] };
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = [...(encs[evalKey] || []), enc];
      return { ...c, encargos: encs };
    });
    setNewEnc({ nombre: "", descripcion: "", porcentaje: "" });
    setShowEncForm(false);
  }

  function toggleRubricImport() {
    setRubricImportSuccess("");
    setShowRubricImport(prev => {
      const next = !prev;
      if (!next) {
        setRubricRaw("");
        setRubricPreview(null);
        setRubricImportError("");
      }
      return next;
    });
  }

  function previewRubricImport() {
    const parsed = parseRubricJson(rubricRaw);
    if (!parsed.ok) {
      setRubricImportError(parsed.error);
      setRubricPreview(null);
      return;
    }
    setRubricImportError("");
    setRubricPreview(parsed.data);
  }

  function confirmRubricImport() {
    const parsed = parseRubricJson(rubricRaw);
    if (!parsed.ok) {
      setRubricImportError(parsed.error);
      setRubricPreview(null);
      return;
    }

    const importedEncargos = transformRubricJsonToEncargos(parsed.data, uid);
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = importedEncargos;
      return { ...c, encargos: encs };
    });

    setSelEncargo(null);
    setEditing({});
    setRubricImportSuccess("Rúbrica importada correctamente.");
    setRubricRaw("");
    setRubricPreview(null);
    setRubricImportError("");
    setShowRubricImport(false);
  }

  function removeEncargo(eid) {
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = (encs[evalKey] || []).filter(e => e.id !== eid);
      return { ...c, encargos: encs };
    });
    if (selEncargo === eid) setSelEncargo(null);
  }

  function updateEncargo(eid, field, val) {
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = (encs[evalKey] || []).map(e =>
        e.id === eid ? { ...e, [field]: field === "porcentaje" ? (parseInt(val) || 0) : val } : e
      );
      return { ...c, encargos: encs };
    });
  }

  function addCriterion(eid) {
    if (!newCrit) return;
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = (encs[evalKey] || []).map(e =>
        e.id === eid ? { ...e, criterios: [...e.criterios, { id: uid(), nombre: newCrit }] } : e
      );
      return { ...c, encargos: encs };
    });
    setNewCrit("");
    setShowCritForm(null);
  }

  function removeCriterion(eid, crid) {
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = (encs[evalKey] || []).map(e =>
        e.id === eid ? { ...e, criterios: e.criterios.filter(cr => cr.id !== crid) } : e
      );
      return { ...c, encargos: encs };
    });
  }

  function renameCriterion(eid, crid, name) {
    updateCourse(selCourseId, c => {
      const encs = { ...(c.encargos || {}) };
      encs[evalKey] = (encs[evalKey] || []).map(e =>
        e.id === eid ? { ...e, criterios: e.criterios.map(cr => cr.id === crid ? { ...cr, nombre: name } : cr) } : e
      );
      return { ...c, encargos: encs };
    });
  }

  function exportBackup() {
    const data = { version: 1, savedAt: new Date().toISOString(), courses };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "backup_evaluaciones.json";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.courses || !Array.isArray(data.courses)) { alert("Archivo inválido"); return; }
        setCourses(data.courses);
        if (data.courses.length) { setSelCourseId(data.courses[0].id); setSelCorte(1); }
        setSelStudent(null); setSelEncargo(null);
        alert("Backup cargado correctamente");
      } catch (e) { alert("Archivo inválido"); }
    };
    reader.readAsText(file);
  }

  function handleDownloadReport() {
    const { html, filename } = buildCourseReport({ course, selCorte, groupAvg, evaluated, students, encargos, avgByEnc, globalCritAvg, ranking, atRisk, strengths, weaknesses });
    downloadHTML(html, filename);
  }

  function handleDownloadDashboard() {
    const { html, filename } = buildDashboardReport({ course, selCorte, groupAvg, evaluated, students, encargos, avgByEnc, globalCritAvg, allFinals, ranking });
    downloadHTML(html, filename);
  }

  function handleDownloadStudent(sid) {
    const st = students.find(s => s.id === sid);
    const sg = grades[sid];
    if (!st || !sg) return;
    const { html, filename } = buildStudentReport({ st, sg, course, selCorte, encargos, groupAvg, avgByCrit });
    downloadHTML(html, filename);
  }

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", background: C.black, color: C.gray, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Roboto',sans-serif" }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: T.text, fontFamily: "'Roboto',system-ui,sans-serif", display: "flex", flexDirection: "column" }}>
      <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={e => { importBackup(e.target.files[0]); e.target.value = ""; }} />

      <Header
        courses={courses}
        selCourseId={selCourseId}
        setSelCourseId={setSelCourseId}
        setSelStudent={setSelStudent}
        setSelEncargo={setSelEncargo}
        setSelCorte={setSelCorte}
        course={course}
        selCorte={selCorte}
        showEncPanel={showEncPanel}
        setShowEncPanel={setShowEncPanel}
        showCorteEdit={showCorteEdit}
        setShowCorteEdit={setShowCorteEdit}
        exportBackup={exportBackup}
        fileInputRef={fileInputRef}
        importBackup={importBackup}
        theme={theme}
        T={T}
        toggleTheme={toggleTheme}
        isMobile={isMobile}
      />

      {/* Course form */}
      {showCourseForm && (
        <div style={{ background: C.card, padding: 14, margin: "0 28px", borderRadius: "0 0 10px 10px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Input value={newCourse.name} onChange={v => setNewCourse(p => ({ ...p, name: v }))} placeholder="Nombre" style={{ flex: "1 1 140px" }} />
          <Input value={newCourse.semester} onChange={v => setNewCourse(p => ({ ...p, semester: v }))} placeholder="Sem" style={{ flex: "0 0 60px" }} />
          <Input value={newCourse.group} onChange={v => setNewCourse(p => ({ ...p, group: v }))} placeholder="Grupo" style={{ flex: "0 0 70px" }} />
          <Btn small onClick={addCourse}>Crear</Btn>
          <Btn small color="#555" onClick={() => setShowCourseForm(false)}>×</Btn>
        </div>
      )}

      {/* Corte editor */}
      {showCorteEdit && (
        <div style={{ background: C.card, padding: 14, margin: "0 28px", borderRadius: "0 0 10px 10px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
            {(course.cortes || []).map(ct => (
              <div key={ct.id} style={{ display: "flex", alignItems: "center", gap: 4, background: C.input, borderRadius: 8, padding: "4px 8px" }}>
                <span style={{ fontSize: 11, color: C.gray }}>C{ct.id}</span>
                <input type="number" value={ct.weight} onChange={e => updateCorteWeight(ct.id, e.target.value)} style={{ width: 48, background: "transparent", border: "1px solid #444", borderRadius: 4, color: "#eee", padding: "2px 6px", fontSize: 12, fontFamily: "'Roboto',sans-serif" }} />
                <span style={{ fontSize: 10, color: C.gray }}>%</span>
                {course.cortes.length > 1 && <button onClick={() => removeCorte(ct.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14 }}>×</button>}
              </div>
            ))}
            <Btn small color={C.orange} onClick={addCorte}>+</Btn>
          </div>
          <div style={{ fontSize: 11, color: cortesTotal === 100 ? C.green : "#ef4444", fontWeight: 600 }}>Total: {cortesTotal}%{cortesTotal !== 100 && " ⚠"}</div>
        </div>
      )}

      {showEncPanel && (
        <EncargosPanel
          encargos={encargos}
          encTotal={encTotal}
          selCorte={selCorte}
          isMobile={isMobile}
          editEncId={editEncId}
          setEditEncId={setEditEncId}
          showEncForm={showEncForm}
          setShowEncForm={setShowEncForm}
          showRubricImport={showRubricImport}
          toggleRubricImport={toggleRubricImport}
          newEnc={newEnc}
          setNewEnc={setNewEnc}
          addEncargo={addEncargo}
          rubricRaw={rubricRaw}
          setRubricRaw={setRubricRaw}
          rubricPreview={rubricPreview}
          rubricImportError={rubricImportError}
          rubricImportSuccess={rubricImportSuccess}
          previewRubricImport={previewRubricImport}
          confirmRubricImport={confirmRubricImport}
          removeEncargo={removeEncargo}
          updateEncargo={updateEncargo}
          showCritForm={showCritForm}
          setShowCritForm={setShowCritForm}
          newCrit={newCrit}
          setNewCrit={setNewCrit}
          addCriterion={addCriterion}
          removeCriterion={removeCriterion}
          renameCriterion={renameCriterion}
          setShowCourseForm={setShowCourseForm}
        />
      )}

      <StatsBar
        evaluated={evaluated}
        students={students}
        groupAvg={groupAvg}
        atRisk={atRisk}
        selCorte={selCorte}
      />

      <Routes>
        <Route path="/" element={
          <EvalView
            isMobile={isMobile}
            isTablet={isTablet}
            students={students}
            evaluated={evaluated}
            grades={grades}
            encargos={encargos}
            selStudent={selStudent}
            selEncargo={selEncargo}
            selectStudent={selectStudent}
            removeStudent={removeStudent}
            showAddStudent={showAddStudent}
            setShowAddStudent={setShowAddStudent}
            newSt={newSt}
            setNewSt={setNewSt}
            addStudent={addStudent}
            selectEncargo={selectEncargo}
            editing={editing}
            setEditing={setEditing}
            saved={saved}
            onSave={handleSaveEncargo}
            activeEnc={activeEnc}
            saveError={saveError}
            selectedStudents={selectedStudents}
            toggleSelectedStudent={toggleSelectedStudent}
            clearSelectedStudents={clearSelectedStudents}
          />
        } />
        <Route path="/dashboard" element={
          <DashboardView
            evaluated={evaluated}
            isMobile={isMobile}
            encargos={encargos}
            avgByEnc={avgByEnc}
            globalCritAvg={globalCritAvg}
            allFinals={allFinals}
            ranking={ranking}
            atRisk={atRisk}
            course={course}
            students={students}
            groupAvg={groupAvg}
            notesByEncargo={notesByEncargo}
            T={T}
            onNavigateProfile={(id) => { setProfileId(id); navigate("/profile"); }}
            onDownload={handleDownloadDashboard}
          />
        } />
        <Route path="/profile" element={
          <ProfileView
            students={students}
            grades={grades}
            profileId={profileId}
            encargos={encargos}
            isMobile={isMobile}
            avgByEnc={avgByEnc}
            T={T}
            onBack={() => navigate("/dashboard")}
            onDownload={() => handleDownloadStudent(profileId)}
          />
        } />
        <Route path="/report" element={
          <ReportView
            evaluated={evaluated}
            course={course}
            selCorte={selCorte}
            students={students}
            encargos={encargos}
            avgByEnc={avgByEnc}
            globalCritAvg={globalCritAvg}
            groupAvg={groupAvg}
            atRisk={atRisk}
            ranking={ranking}
            grades={grades}
            onOpenProfile={(id) => { setProfileId(id); navigate("/profile"); }}
            onDownload={handleDownloadReport}
          />
        } />
        <Route path="/courses" element={
          <CoursesView
            courses={courses}
            setCourses={setCourses}
            selCourseId={selCourseId}
            setSelCourseId={setSelCourseId}
            setSelStudent={setSelStudent}
            setSelEncargo={setSelEncargo}
            setShowCourseForm={setShowCourseForm}
            isMobile={isMobile}
          />
        } />
      </Routes>

      <div style={{ background: C.dark, padding: 10, textAlign: "center", fontSize: 11, color: T.textMuted, borderTop: "1px solid " + T.border, marginTop: "auto" }}>
        Prof. Odis · Profesional en diseño gráfico · Especialista en pedagogía y docencia · ocorzo@areandina.edu.co
        <div style={{ fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
          <span>
            {autosaveStatus === "saving" && "🟠"}
            {autosaveStatus === "saved" && "🟢"}
            {autosaveStatus === "error" && "🔴"}
          </span>
          <span style={{ color: C.gray }}>
            {lastSavedAt
              ? lastSavedAt.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })
              : "Sin guardado"}
          </span>
        </div>
      </div>
    </div>
  );
}
