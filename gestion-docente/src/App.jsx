import { useMemo, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { C, DEFAULT_COURSES } from "./constants/constants";
import { useMedia } from "./hooks/useMedia";
import { useTheme } from "./contexts/ThemeContext";
import { useAppPersistence } from "./hooks/useAppPersistence";
import { useCourseAnalytics } from "./hooks/useCourseAnalytics";
import { useCourseActions } from "./hooks/useCourseActions";
import { useEncargoPanelState } from "./hooks/useEncargoPanelState";
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
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const isMobile = useMedia("(max-width:767px)");
  const isTablet = useMedia("(min-width:768px) and (max-width:1023px)");

  const [selCorte, setSelCorte] = useState(1);
  const [selStudent, setSelStudent] = useState(null);
  const [selEncargo, setSelEncargo] = useState(null);
  const [editing, setEditing] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", semester: "", group: "" });
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: "", name: "" });
  const [showCorteEdit, setShowCorteEdit] = useState(false);
  const [showEncPanel, setShowEncPanel] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const encPanelState = useEncargoPanelState();

  const { T } = useTheme();

  const {
    courses,
    setCourses,
    selCourseId,
    setSelCourseId,
    loaded,
    autosaveStatus,
    lastSavedAt,
  } = useAppPersistence(DEFAULT_COURSES);

  const course = useMemo(() => courses.find(c => c.id === selCourseId) || courses[0], [courses, selCourseId]);
  const evalKey = "corte-" + selCorte;
  const encargos = (course && course.encargos && course.encargos[evalKey]) || [];
  const students = (course && course.students) || [];
  const grades = (course && course.grades && course.grades[evalKey]) || {};
  const encTotal = encargos.reduce((s, e) => s + e.porcentaje, 0);
  const activeEnc = encargos.find(e => e.id === selEncargo) || null;
  const cortesTotal = course && course.cortes ? course.cortes.reduce((s, c) => s + c.weight, 0) : 0;

  const {
    evaluated,
    allFinals,
    groupAvg,
    ranking,
    atRisk,
    avgByEnc,
    avgByCrit,
    globalCritAvg,
    notesByEncargo,
    strengths,
    weaknesses,
  } = useCourseAnalytics({ students, grades, encargos });

  const actions = useCourseActions({
    courses,
    setCourses,
    selCourseId,
    setSelCourseId,
    setSelCorte,
    evalKey,
    grades,
    activeEnc,
    selStudent,
    setSelStudent,
    selEncargo,
    setSelEncargo,
    editing,
    setEditing,
    selectedStudents,
    setSelectedStudents,
    setSaved,
    setSaveError,
    newCourse,
    setNewCourse,
    setShowCourseForm,
    newStudent,
    setNewStudent,
    setShowAddStudent,
    ...encPanelState,
  });

  function handleDownloadReport() {
    const { html, filename } = buildCourseReport({
      course,
      selCorte,
      groupAvg,
      evaluated,
      students,
      encargos,
      avgByEnc,
      globalCritAvg,
      ranking,
      atRisk,
      strengths,
      weaknesses,
    });
    downloadHTML(html, filename);
  }

  function handleDownloadDashboard() {
    const { html, filename } = buildDashboardReport({
      course,
      selCorte,
      groupAvg,
      evaluated,
      students,
      encargos,
      avgByEnc,
      globalCritAvg,
      allFinals,
      ranking,
    });
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
      <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={e => { actions.importBackup(e.target.files[0]); e.target.value = ""; }} />

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
        exportBackup={actions.exportBackup}
        fileInputRef={fileInputRef}
        importBackup={actions.importBackup}
        isMobile={isMobile}
      />

      {showCourseForm && (
        <div style={{ background: C.card, padding: 14, margin: "0 28px", borderRadius: "0 0 10px 10px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Input value={newCourse.name} onChange={v => setNewCourse(p => ({ ...p, name: v }))} placeholder="Nombre" style={{ flex: "1 1 140px" }} />
          <Input value={newCourse.semester} onChange={v => setNewCourse(p => ({ ...p, semester: v }))} placeholder="Sem" style={{ flex: "0 0 60px" }} />
          <Input value={newCourse.group} onChange={v => setNewCourse(p => ({ ...p, group: v }))} placeholder="Grupo" style={{ flex: "0 0 70px" }} />
          <Btn small onClick={actions.addCourse}>Crear</Btn>
          <Btn small color="#555" onClick={() => setShowCourseForm(false)}>×</Btn>
        </div>
      )}

      {showCorteEdit && (
        <div style={{ background: C.card, padding: 14, margin: "0 28px", borderRadius: "0 0 10px 10px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
            {(course.cortes || []).map(ct => (
              <div key={ct.id} style={{ display: "flex", alignItems: "center", gap: 4, background: C.input, borderRadius: 8, padding: "4px 8px" }}>
                <span style={{ fontSize: 11, color: C.gray }}>C{ct.id}</span>
                <input type="number" value={ct.weight} onChange={e => actions.updateCorteWeight(ct.id, e.target.value)} style={{ width: 48, background: "transparent", border: "1px solid #444", borderRadius: 4, color: "#eee", padding: "2px 6px", fontSize: 12, fontFamily: "'Roboto',sans-serif" }} />
                <span style={{ fontSize: 10, color: C.gray }}>%</span>
                {course.cortes.length > 1 && <button onClick={() => actions.removeCorte(ct.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14 }}>×</button>}
              </div>
            ))}
            <Btn small color={C.orange} onClick={actions.addCorte}>+</Btn>
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
          {...encPanelState}
          toggleRubricImport={actions.toggleRubricImport}
          addEncargo={actions.addEncargo}
          previewRubricImport={actions.previewRubricImport}
          confirmRubricImport={actions.confirmRubricImport}
          removeEncargo={actions.removeEncargo}
          updateEncargo={actions.updateEncargo}
          addCriterion={actions.addCriterion}
          removeCriterion={actions.removeCriterion}
          renameCriterion={actions.renameCriterion}
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
            selectStudent={actions.selectStudent}
            removeStudent={actions.removeStudent}
            showAddStudent={showAddStudent}
            setShowAddStudent={setShowAddStudent}
            newStudent={newStudent}
            setNewStudent={setNewStudent}
            addStudent={actions.addStudent}
            selectEncargo={actions.selectEncargo}
            editing={editing}
            setEditing={setEditing}
            saved={saved}
            onSave={actions.handleSaveEncargo}
            activeEnc={activeEnc}
            saveError={saveError}
            selectedStudents={selectedStudents}
            toggleSelectedStudent={actions.toggleSelectedStudent}
            clearSelectedStudents={actions.clearSelectedStudents}
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
                second: "2-digit",
              })
              : "Sin guardado"}
          </span>
        </div>
      </div>
    </div>
  );
}
