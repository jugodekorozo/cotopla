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
  newStudent,
  setNewStudent,
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
    if (!newStudent.id || !newStudent.name) return;
    updateCourse(selCourseId, c => ({ ...c, students: [...c.students, { id: newStudent.id, name: newStudent.name }] }));
    setNewStudent({ id: "", name: "" });
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
