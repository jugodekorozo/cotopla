export function useBackupActions({
  courses,
  setCourses,
  setSelCourseId,
  setSelCorte,
  setSelStudent,
  setSelEncargo,
}) {
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

  return { exportBackup, importBackup };
}
