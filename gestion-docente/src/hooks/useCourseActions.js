import { uid } from "../utils/utils";
import { useStudentActions } from "./useStudentActions";
import { useEncargoActions } from "./useEncargoActions";
import { useBackupActions } from "./useBackupActions";

export function useCourseActions(params) {
  const {
    courses,
    setCourses,
    selCourseId,
    setSelCourseId,
    newCourse,
    setNewCourse,
    setShowCourseForm,
    setSelCorte,
  } = params;

  function updateCourse(id, fn) {
    setCourses(prev => prev.map(c => (c.id === id ? fn({ ...c }) : c)));
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

  const studentActions = useStudentActions(params);
  const encargoActions = useEncargoActions(params);
  const backupActions = useBackupActions(params);

  return {
    updateCourse,
    addCourse,
    updateCorteWeight,
    addCorte,
    removeCorte,
    ...studentActions,
    ...encargoActions,
    ...backupActions,
  };
}
