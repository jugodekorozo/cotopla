export function useStudentActions({
  selCourseId,
  setCourses,
  selStudent,
  setSelStudent,
  setSelEncargo,
  setEditing,
  selectedStudents,
  setSelectedStudents,
  setSaveError,
  newSt,
  setNewSt,
  setShowAddStudent,
}) {
  function updateCourse(id, fn) {
    setCourses(prev => prev.map(c => (c.id === id ? fn({ ...c }) : c)));
  }

  function selectStudent(id) {
    setSaveError("");
    setSelStudent(id);
    setSelEncargo(null);
    setEditing({});
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

  return { selectStudent, toggleSelectedStudent, clearSelectedStudents, addStudent, removeStudent };
}
