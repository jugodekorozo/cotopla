import { uid } from "../utils/utils";
import { parseRubricJson, transformRubricJsonToEncargos } from "../utils/rubricImport";

export function useEncargoActions({
  selCourseId,
  setCourses,
  evalKey,
  grades,
  selStudent,
  selEncargo,
  setSelEncargo,
  activeEnc,
  editing,
  setEditing,
  selectedStudents,
  setSelectedStudents,
  setSaved,
  setSaveError,
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

  function selectEncargo(eid) {
    setSaveError("");
    setSelEncargo(eid);
    const ex = grades[selStudent] && grades[selStudent][eid];
    setEditing(ex ? { ...ex } : {});
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

  return {
    handleSaveEncargo,
    selectEncargo,
    addEncargo,
    removeEncargo,
    updateEncargo,
    toggleRubricImport,
    previewRubricImport,
    confirmRubricImport,
    addCriterion,
    removeCriterion,
    renameCriterion,
  };
}
