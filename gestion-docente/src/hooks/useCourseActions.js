import { uid } from "../utils/utils";
import { parseRubricJson, transformRubricJsonToEncargos } from "../utils/rubricImport";

export function useCourseActions({
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
  newSt,
  setNewSt,
  setShowAddStudent,
  newEnc,
  setNewEnc,
  setShowEncForm,
  rubricRaw,
  setRubricRaw,
  setRubricPreview,
  setRubricImportError,
  setRubricImportSuccess,
  setShowRubricImport,
  newCrit,
  setNewCrit,
  setShowCritForm,
}) {
  function updateCourse(id, fn) {
    setCourses(prev => prev.map(c => (c.id === id ? fn({ ...c }) : c)));
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
    setSelectedStudents(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
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
    const nc = {
      id: uid(),
      name: newCourse.name,
      semester: parseInt(newCourse.semester) || 1,
      group: newCourse.group || "—",
      cortes: [{ id: 1, weight: 30 }, { id: 2, weight: 30 }, { id: 3, weight: 40 }],
      students: [],
      encargos: {},
      grades: {},
    };
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
    if (selStudent === sid) {
      setSelStudent(null);
      setSelEncargo(null);
    }
  }

  function updateCorteWeight(cid, w) {
    updateCourse(selCourseId, c => ({ ...c, cortes: c.cortes.map(ct => (ct.id === cid ? { ...ct, weight: parseInt(w) || 0 } : ct)) }));
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
        e.id === eid ? { ...e, criterios: e.criterios.map(cr => (cr.id === crid ? { ...cr, nombre: name } : cr)) } : e
      );
      return { ...c, encargos: encs };
    });
  }

  function exportBackup() {
    const data = { version: 1, savedAt: new Date().toISOString(), courses };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup_evaluaciones.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.courses || !Array.isArray(data.courses)) {
          alert("Archivo inválido");
          return;
        }
        setCourses(data.courses);
        if (data.courses.length) {
          setSelCourseId(data.courses[0].id);
          if (setSelCorte) setSelCorte(1);
        }
        setSelStudent(null);
        setSelEncargo(null);
        alert("Backup cargado correctamente");
      } catch {
        alert("Archivo inválido");
      }
    };
    reader.readAsText(file);
  }

  return {
    updateCourse,
    handleSaveEncargo,
    toggleSelectedStudent,
    clearSelectedStudents,
    selectStudent,
    selectEncargo,
    addCourse,
    addStudent,
    removeStudent,
    updateCorteWeight,
    addCorte,
    removeCorte,
    addEncargo,
    toggleRubricImport,
    previewRubricImport,
    confirmRubricImport,
    removeEncargo,
    updateEncargo,
    addCriterion,
    removeCriterion,
    renameCriterion,
    exportBackup,
    importBackup,
  };
}
